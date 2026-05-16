#!/usr/bin/env node
/**
 * Diagnostiziert das config/websiteImages Dokument:
 * - liest alle Bild-URLs aus Firestore
 * - prüft jede URL mit HEAD-Request (Status, Größe)
 * - meldet welche kaputt sind
 *
 * Optional: --fix-bucket  ersetzt im Firestore-Eintrag .appspot.com → .firebasestorage.app
 *
 * Nutzung:
 *   node scripts/diagnose-images.mjs
 *   node scripts/diagnose-images.mjs --fix-bucket
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
    if (!res.ok) throw new Error(`Token: ${res.status} ${await res.text()}`);
    return (await res.json()).access_token;
}

async function firestore(token, url, opts = {}) {
    const res = await fetch(url, {
        ...opts,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    if (!res.ok) {
        const m = typeof body === 'object' ? body?.error?.message || JSON.stringify(body) : body;
        throw new Error(`${res.status} ${url} — ${m}`);
    }
    return body;
}

function bucketFromUrl(u) {
    // https://firebasestorage.googleapis.com/v0/b/<BUCKET>/o/<path>?...
    const m = u.match(/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\//);
    return m ? m[1] : null;
}

async function probeUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        return { status: res.status, length: res.headers.get('content-length') || '?' };
    } catch (e) {
        return { status: 0, length: '?', err: e.message };
    }
}

const args = process.argv.slice(2);
const fixBucket = args.includes('--fix-bucket');

const env = parseEnvFile('.env.local');
const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const expectedBucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;

if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Fehlende Env-Vars'); process.exit(1);
}

console.log(`🔍 Diagnose config/websiteImages → ${projectId}`);
console.log(`   Erwarteter Bucket: ${expectedBucket}\n`);

const token = await getAccessToken(clientEmail, privateKey);
const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/config/websiteImages`;

let doc;
try {
    doc = await firestore(token, docUrl);
} catch (e) {
    if (String(e.message).startsWith('404')) {
        console.log('❌ Dokument config/websiteImages existiert NICHT.');
        console.log('   → Lade in der Admin-UI mind. ein Bild hoch — dann wird das Dokument angelegt.');
        process.exit(0);
    }
    throw e;
}

const fields = doc.fields || {};
const keys = Object.keys(fields);
if (keys.length === 0) {
    console.log('⚠ Dokument existiert, ist aber LEER (keine Bilder gespeichert).');
    console.log('   → Lade in der Admin-UI mind. ein Bild hoch.');
    process.exit(0);
}

console.log(`Gefunden: ${keys.length} Image-Keys\n`);

const broken = [];
const wrongBucket = [];
const updates = {};

for (const k of keys.sort()) {
    const v = fields[k];
    const url = v?.stringValue;
    if (typeof url !== 'string') {
        console.log(`  ? ${k.padEnd(22)} — kein stringValue (${Object.keys(v).join(',')})`);
        continue;
    }
    const bucket = bucketFromUrl(url);
    const probe = await probeUrl(url);
    const statusIcon = probe.status === 200 ? '✓' : probe.status === 0 ? '✗' : '⚠';
    const bucketHint = bucket && bucket !== expectedBucket ? `  ← Bucket: ${bucket}` : '';
    console.log(`  ${statusIcon} ${k.padEnd(22)}  HTTP ${probe.status}  ${probe.length} bytes${bucketHint}`);

    if (probe.status !== 200) broken.push({ k, url, status: probe.status });
    if (bucket && bucket !== expectedBucket) {
        wrongBucket.push({ k, url, bucket });
        const newUrl = url.replace(`/v0/b/${bucket}/`, `/v0/b/${expectedBucket}/`);
        updates[k] = newUrl;
    }
}

console.log('');
console.log(`Zusammenfassung:`);
console.log(`  Gesamt:                 ${keys.length}`);
console.log(`  Kaputt (kein 200):      ${broken.length}`);
console.log(`  Falscher Bucket:        ${wrongBucket.length}`);

if (wrongBucket.length > 0 && !fixBucket) {
    console.log(`\n→ Mit  node scripts/diagnose-images.mjs --fix-bucket  werden die Bucket-Namen automatisch umgeschrieben.`);
}

if (fixBucket && Object.keys(updates).length > 0) {
    console.log(`\nSchreibe ${Object.keys(updates).length} Updates …`);
    const url = new URL(docUrl);
    for (const k of Object.keys(updates)) {
        url.searchParams.append('updateMask.fieldPaths', k);
    }
    const fieldsUpdate = {};
    for (const [k, v] of Object.entries(updates)) {
        fieldsUpdate[k] = { stringValue: v };
    }
    await firestore(token, url.toString(), {
        method: 'PATCH',
        body: JSON.stringify({ fields: fieldsUpdate }),
    });
    console.log('✓ Firestore aktualisiert. Erneut testen:  node scripts/diagnose-images.mjs');
}
