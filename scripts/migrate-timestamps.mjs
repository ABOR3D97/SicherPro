#!/usr/bin/env node
/**
 * Repariert das `createdAt`-Feld in der `inquiries`-Collection.
 *
 * Hintergrund: Frühere Inquiries wurden mit `serverTimestamp` aus dem falschen
 * Firebase-Package (Realtime DB statt Firestore) gespeichert — Resultat: ein
 * Plain-Object `{".sv":"timestamp"}`, das im UI als „— (unbekannt)" angezeigt
 * wird.
 *
 * Dieses Script liest jedes Dokument, prüft `createdAt` und ersetzt es bei
 * Bedarf durch `createTime` (das echte Firestore-Anlage-Datum aus dem
 * Doc-Metadata).
 *
 * Nutzung:
 *   node scripts/migrate-timestamps.mjs              # Dry-Run (zeigt was getan würde)
 *   node scripts/migrate-timestamps.mjs --apply      # Wendet die Änderungen an
 */

import { readFileSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';

function parseEnvFile(path) {
    if (!existsSync(path)) throw new Error(`Datei nicht gefunden: ${path}`);
    const out = {};
    for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const idx = line.indexOf('=');
        if (idx < 0) continue;
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        out[key] = value;
    }
    return out;
}

const b64u = (s) =>
    Buffer.from(s).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function getAccessToken(clientEmail, privateKey) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = b64u(
        JSON.stringify({
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/datastore',
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600,
        }),
    );
    const signer = createSign('RSA-SHA256');
    signer.update(`${header}.${payload}`);
    const sig = signer.sign(privateKey).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${header}.${payload}.${sig}`,
        }),
    });
    if (!res.ok) throw new Error(`Token-Tausch: ${res.status} ${await res.text()}`);
    return (await res.json()).access_token;
}

async function api(token, url, opts = {}) {
    const res = await fetch(url, {
        ...opts,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(opts.headers || {}),
        },
    });
    const text = await res.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    if (!res.ok) {
        const msg = typeof body === 'object' ? body?.error?.message || JSON.stringify(body) : body;
        throw new Error(`${res.status} ${url} — ${msg}`);
    }
    return body;
}

function isValidTimestamp(field) {
    // Firestore REST: Timestamp-Wert hat die Form { timestampValue: "ISO-String" }
    return field && typeof field === 'object' && typeof field.timestampValue === 'string';
}

async function listAllDocs(token, projectId, collection) {
    const out = [];
    let pageToken;
    do {
        const url = new URL(
            `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}`,
        );
        url.searchParams.set('pageSize', '300');
        if (pageToken) url.searchParams.set('pageToken', pageToken);
        const res = await api(token, url.toString());
        if (res.documents) out.push(...res.documents);
        pageToken = res.nextPageToken;
    } while (pageToken);
    return out;
}

async function updateCreatedAt(token, docName, isoTimestamp) {
    const url = new URL(`https://firestore.googleapis.com/v1/${docName}`);
    url.searchParams.append('updateMask.fieldPaths', 'createdAt');
    // currentDocument.exists=true verhindert versehentliche Creates.
    url.searchParams.set('currentDocument.exists', 'true');
    return api(token, url.toString(), {
        method: 'PATCH',
        body: JSON.stringify({
            fields: {
                createdAt: { timestampValue: isoTimestamp },
            },
        }),
    });
}

async function run({ apply }) {
    const env = parseEnvFile('.env.local');
    const projectId = env.FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.error('❌ Fehlende Env-Vars in .env.local');
        process.exit(1);
    }

    console.log(`🛠  Timestamp-Migration → ${projectId}`);
    console.log(`   Modus: ${apply ? 'APPLY (Änderungen werden geschrieben)' : 'DRY-RUN (nur Anzeige)'}\n`);

    const token = await getAccessToken(clientEmail, privateKey);
    const docs = await listAllDocs(token, projectId, 'inquiries');
    console.log(`Gefunden: ${docs.length} Inquiries\n`);

    let ok = 0;
    let needsFix = 0;
    let fixed = 0;
    let failed = 0;

    for (const d of docs) {
        const id = d.name.split('/').pop();
        const createdAtField = d.fields?.createdAt;
        const createTime = d.createTime; // ISO-String aus Doc-Metadata

        if (isValidTimestamp(createdAtField)) {
            ok++;
            continue;
        }

        needsFix++;
        const target = createTime;
        if (!target) {
            console.warn(`  ⚠ ${id}: kein createTime im Metadata — überspringe`);
            failed++;
            continue;
        }

        if (apply) {
            try {
                await updateCreatedAt(token, d.name, target);
                console.log(`  ✓ ${id} → ${target}`);
                fixed++;
            } catch (e) {
                console.error(`  ✗ ${id}: ${e.message}`);
                failed++;
            }
        } else {
            console.log(`  [dry] ${id} würde createdAt=${target} bekommen`);
        }
    }

    console.log('');
    console.log(`Gesamt: ${docs.length}`);
    console.log(`  bereits OK:        ${ok}`);
    console.log(`  bräuchten Fix:     ${needsFix}`);
    if (apply) {
        console.log(`  ✓ erfolgreich:     ${fixed}`);
        console.log(`  ✗ fehlgeschlagen:  ${failed}`);
    } else {
        console.log(`\n→ Mit  node scripts/migrate-timestamps.mjs --apply  wirklich ausführen.`);
    }
}

const apply = process.argv.includes('--apply');
run({ apply }).catch((err) => {
    console.error('\n❌ Fehler:', err.message || err);
    process.exit(1);
});
