import { NextResponse } from 'next/server';
import { adminDb, adminStorage, STORAGE_BUCKET } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth-server';

const COLLECTIONS = ['inquiries', 'pendingAdmins', 'config'] as const;
const STORAGE_PREFIXES = ['website-images/'] as const;

interface FileInfo {
    bytes: number;
    files: number;
    error?: string;
}

interface CollectionResult {
    count: number;
    error?: string;
}

export async function GET() {
    // Session manuell prüfen — kein requireAdmin() in API-Routes (redirect → 500).
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const firestoreCounts: Record<string, CollectionResult> = {};
    const storagePerPrefix: Record<string, FileInfo> = {};
    let firestoreTotalDocs = 0;
    let storageTotalBytes = 0;
    let storageTotalFiles = 0;
    let bucketName = '';

    // Firestore counts — jede Collection einzeln, Fehler isoliert behandeln.
    await Promise.all(
        COLLECTIONS.map(async (name) => {
            try {
                const snap = await adminDb.collection(name).count().get();
                const c = snap.data().count;
                firestoreCounts[name] = { count: c };
                firestoreTotalDocs += c;
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                console.error(`[usage] count(${name}) fehlgeschlagen:`, msg);
                firestoreCounts[name] = { count: -1, error: msg };
            }
        }),
    );

    // Storage — Bucket holen + Files listen (expliziter Name als Failsafe).
    try {
        const bucket = adminStorage.bucket(STORAGE_BUCKET);
        bucketName = bucket.name;

        await Promise.all(
            STORAGE_PREFIXES.map(async (prefix) => {
                try {
                    const [files] = await bucket.getFiles({ prefix });
                    let bytes = 0;
                    for (const f of files) {
                        const s = f.metadata.size;
                        bytes += typeof s === 'string' ? parseInt(s, 10) : (s as number) ?? 0;
                    }
                    storagePerPrefix[prefix] = { bytes, files: files.length };
                    storageTotalBytes += bytes;
                    storageTotalFiles += files.length;
                } catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    console.error(`[usage] getFiles(${prefix}) fehlgeschlagen:`, msg);
                    storagePerPrefix[prefix] = { bytes: -1, files: -1, error: msg };
                }
            }),
        );
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[usage] Storage-Bucket-Init fehlgeschlagen:', msg);
        bucketName = `<Fehler: ${msg}>`;
    }

    const estimatedFirestoreBytes = firestoreTotalDocs > 0 ? firestoreTotalDocs * 550 : 0;

    return NextResponse.json({
        firestore: {
            counts: firestoreCounts,
            totalDocs: firestoreTotalDocs,
            estimatedBytes: estimatedFirestoreBytes,
        },
        storage: {
            perPrefix: storagePerPrefix,
            totalFiles: storageTotalFiles,
            totalBytes: storageTotalBytes,
            bucket: bucketName,
        },
        generatedAt: new Date().toISOString(),
    });
}
