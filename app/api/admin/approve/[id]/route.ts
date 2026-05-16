import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth-server';
import { assertSameOrigin } from '@/lib/origin-check';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

function generateTempPassword() {
    return crypto.randomBytes(18).toString('base64url') + 'A1!';
}

function safeEq(a: string, b: string) {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const originError = assertSameOrigin(req);
    if (originError) return originError;

    const { id } = await params;

    const session = await getSession();
    if (!session?.owner) {
        return NextResponse.json({ error: 'Nur der Owner darf Anfragen freigeben.' }, { status: 403 });
    }

    const rl = rateLimit({ key: `approve:${getClientIp(req)}`, limit: 10, windowMs: 5 * 60 * 1000 });
    if (!rl.success) {
        return NextResponse.json({ error: 'Zu viele Versuche.' }, { status: 429 });
    }

    let token = '';
    try {
        const body = await req.json().catch(() => ({}));
        token = typeof body?.token === 'string' ? body.token : '';
    } catch {
        // ignore
    }

    if (!token) {
        return NextResponse.json({ error: 'Token erforderlich.' }, { status: 400 });
    }

    try {
        const snap = await adminDb.collection('pendingAdmins').doc(id).get();
        if (!snap.exists) {
            return NextResponse.json({ error: 'Anfrage nicht gefunden.' }, { status: 404 });
        }
        const data = snap.data() as { email: string; token?: string };
        if (!data.token || !safeEq(data.token, token)) {
            return NextResponse.json({ error: 'Ungültiger Token.' }, { status: 403 });
        }

        const tempPassword = generateTempPassword();
        let userRecord;
        try {
            userRecord = await adminAuth.createUser({
                email: data.email,
                password: tempPassword,
                emailVerified: false,
                disabled: false,
            });
        } catch (e: unknown) {
            const err = e as { code?: string };
            if (err.code === 'auth/email-already-exists') {
                userRecord = await adminAuth.getUserByEmail(data.email);
            } else {
                throw e;
            }
        }

        await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
        const link = await adminAuth.generatePasswordResetLink(data.email);

        await snap.ref.delete();

        return NextResponse.json({ success: true, email: data.email, resetLink: link });
    } catch (err) {
        console.error('Approval-Fehler:', err);
        return NextResponse.json({ error: 'Approval fehlgeschlagen.' }, { status: 500 });
    }
}
