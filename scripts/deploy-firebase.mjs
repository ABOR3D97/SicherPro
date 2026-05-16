#!/usr/bin/env node
/**
 * Deployt firestore.rules + storage.rules in dein Firebase-Projekt.
 *
 * Nutzt den Service-Account aus .env.local (FIREBASE_PROJECT_ID,
 * FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) und ruft die
 * Firebase Rules REST-API DIREKT auf — keine firebase-tools nötig,
 * kein Konflikt mit gecachten User-Logins.
 *
 * Nutzung:
 *   node scripts/deploy-firebase.mjs                 # firestore + storage
 *   node scripts/deploy-firebase.mjs firestore       # nur firestore
 *   node scripts/deploy-firebase.mjs storage         # nur storage
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

function b64url(input) {
    return Buffer.from(input).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(clientEmail, privateKey, scope) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = b64url(
        JSON.stringify({
            iss: clientEmail,
            scope,
            aud: 'https://oauth2.googleapis.com/token',
            iat: now,
            exp: now + 3600,
        }),
    );
    const signer = createSign('RSA-SHA256');
    signer.update(`${header}.${payload}`);
    const sig = signer.sign(privateKey).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const assertion = `${header}.${payload}.${sig}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion,
        }),
    });
    if (!res.ok) throw new Error(`Token-Tausch fehlgeschlagen: ${res.status} ${await res.text()}`);
    const json = await res.json();
    return json.access_token;
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
    try { body = JSON.parse(text); } catch { body = text; }
    if (!res.ok) {
        const msg = typeof body === 'object' ? body?.error?.message || JSON.stringify(body) : body;
        throw new Error(`${res.status} ${url} — ${msg}`);
    }
    return body;
}

async function createRuleset(token, projectId, filename, content) {
    return api(token, `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`, {
        method: 'POST',
        body: JSON.stringify({
            source: { files: [{ name: filename, content }] },
        }),
    });
}

async function updateRelease(token, projectId, releaseName, rulesetName) {
    const fullName = `projects/${projectId}/releases/${releaseName}`;
    const release = { name: fullName, rulesetName };

    // Erst PATCH (Update) — Body-Wrapper { release: {...} }.
    try {
        return await api(
            token,
            `https://firebaserules.googleapis.com/v1/${fullName}`,
            { method: 'PATCH', body: JSON.stringify({ release }) },
        );
    } catch (e) {
        if (!String(e.message).startsWith('404')) throw e;
        // Release existiert nicht → POST (Create) erwartet das Release-Objekt direkt.
        return api(
            token,
            `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
            { method: 'POST', body: JSON.stringify(release) },
        );
    }
}

async function getStorageBucket(token, projectId, envBucket) {
    // 1. Wenn NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET gesetzt ist → das nehmen.
    if (envBucket) return envBucket;

    // 2. Sonst via API auflisten (braucht firebasestorage.buckets.list Permission).
    try {
        const res = await api(
            token,
            `https://firebasestorage.googleapis.com/v1beta/projects/${projectId}/buckets`,
        );
        const buckets = res.buckets || [];
        if (buckets.length) return buckets[0].name.split('/').pop();
    } catch {
        /* ignore */
    }

    // 3. Fallback: konventionelle Defaults raten.
    throw new Error(
        `Storage-Bucket nicht ermittelbar. Setze NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local ` +
        `(typisch: "${projectId}.appspot.com" oder "${projectId}.firebasestorage.app").`,
    );
}

async function deploy(targets) {
    const env = parseEnvFile('.env.local');
    const projectId = env.FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;
    const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        console.error('❌ Fehlende Env-Vars in .env.local');
        process.exit(1);
    }

    console.log(`🔥 Firebase-Deploy → ${projectId}`);
    console.log(`   Service-Account: ${clientEmail}`);
    console.log(`   Targets: ${targets.join(', ')}\n`);

    console.log('→ Access-Token holen …');
    const token = await getAccessToken(
        clientEmail,
        privateKey,
        'https://www.googleapis.com/auth/firebase',
    );
    console.log('  ✓ ok\n');

    if (targets.includes('firestore')) {
        console.log('→ Firestore-Rules deployen …');
        const content = readFileSync('firestore.rules', 'utf8');
        const ruleset = await createRuleset(token, projectId, 'firestore.rules', content);
        console.log(`  ruleset: ${ruleset.name}`);
        await updateRelease(token, projectId, 'cloud.firestore', ruleset.name);
        console.log('  ✓ Firestore-Rules aktiviert\n');
    }

    if (targets.includes('storage')) {
        console.log('→ Storage-Bucket ermitteln …');
        const bucket = await getStorageBucket(
            token,
            projectId,
            process.env.STORAGE_BUCKET_OVERRIDE || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        );
        console.log(`  ✓ ${bucket}\n`);

        console.log('→ Storage-Rules deployen …');
        const content = readFileSync('storage.rules', 'utf8');
        const ruleset = await createRuleset(token, projectId, 'storage.rules', content);
        console.log(`  ruleset: ${ruleset.name}`);
        await updateRelease(token, projectId, `firebase.storage/${bucket}`, ruleset.name);
        console.log('  ✓ Storage-Rules aktiviert\n');
    }

    console.log('✅ Fertig.');
}

async function listReleases() {
    const env = parseEnvFile('.env.local');
    const token = await getAccessToken(
        env.FIREBASE_CLIENT_EMAIL,
        env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        'https://www.googleapis.com/auth/firebase',
    );
    const data = await api(
        token,
        `https://firebaserules.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/releases`,
    );
    console.log('Bestehende Releases:');
    for (const r of data.releases || []) {
        const short = r.name.split('/releases/')[1];
        console.log(`  - ${short}  →  ${(r.rulesetName || '').split('/').pop()}`);
    }
}

const args = process.argv.slice(2);

if (args[0] === 'list') {
    listReleases().catch((err) => {
        console.error('❌', err.message || err);
        process.exit(1);
    });
} else {
    const targets = args.length === 0 ? ['firestore', 'storage'] : args;
    const valid = targets.every((t) => t === 'firestore' || t === 'storage');
    if (!valid) {
        console.error('❌ Gültige Targets: firestore | storage | list');
        process.exit(1);
    }

    deploy(targets).catch((err) => {
        console.error('❌ Deploy fehlgeschlagen:');
        console.error(err.message || err);
        process.exit(1);
    });
}
