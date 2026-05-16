import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function resolveStorageBucket(projectId: string): string {
    // 1. Explizit gesetzt (Server-only)
    if (process.env.FIREBASE_STORAGE_BUCKET) return process.env.FIREBASE_STORAGE_BUCKET;
    // 2. Public-Variable (gleicher Name wie im Client)
    if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
        return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    }
    // 3. Fallback: neues Firebase-Default-Naming
    return `${projectId}.firebasestorage.app`;
}

function init(): App {
    if (getApps().length) return getApps()[0]!;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Firebase Admin: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL und FIREBASE_PRIVATE_KEY müssen gesetzt sein.',
        );
    }

    return initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket: resolveStorageBucket(projectId),
    });
}

const app: App = init();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
export const STORAGE_BUCKET = resolveStorageBucket(process.env.FIREBASE_PROJECT_ID!);

export const OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || '').toLowerCase();

export async function verifySessionCookie(cookie?: string) {
    if (!cookie) return null;
    try {
        const decoded = await adminAuth.verifySessionCookie(cookie, true);
        return decoded;
    } catch {
        return null;
    }
}

export function isOwner(email?: string | null): boolean {
    return !!email && email.toLowerCase() === OWNER_EMAIL;
}
