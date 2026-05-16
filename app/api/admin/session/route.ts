import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, isOwner } from '@/lib/firebase-admin';
import { assertSameOrigin } from '@/lib/origin-check';

const COOKIE_NAME = '__session';
const EXPIRES_IN_MS = 60 * 60 * 24 * 1000; // 24 Stunden

export async function POST(req: NextRequest) {
    const originError = assertSameOrigin(req);
    if (originError) return originError;

    try {
        const { idToken } = await req.json();
        if (!idToken || typeof idToken !== 'string') {
            return NextResponse.json({ error: 'idToken erforderlich' }, { status: 400 });
        }

        const decoded = await adminAuth.verifyIdToken(idToken, true);
        if (!decoded.email) {
            return NextResponse.json({ error: 'Unauthorisiert' }, { status: 401 });
        }

        const owner = isOwner(decoded.email);
        const hasAdminClaim = decoded.admin === true;

        // Owner-Bootstrap: Sicherstellen, dass die Owner-Adresse immer Admin-Claim hat.
        if (owner && !hasAdminClaim) {
            await adminAuth.setCustomUserClaims(decoded.uid, { admin: true, owner: true });
            return NextResponse.json(
                {
                    error: 'Admin-Berechtigung gesetzt. Bitte einmal aus- und neu einloggen.',
                    refresh: true,
                },
                { status: 401 },
            );
        }

        if (!hasAdminClaim && !owner) {
            return NextResponse.json(
                { error: 'Kein Admin-Zugang. Anfrage beim Owner stellen.' },
                { status: 403 },
            );
        }

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: EXPIRES_IN_MS,
        });

        const jar = await cookies();
        jar.set(COOKIE_NAME, sessionCookie, {
            maxAge: EXPIRES_IN_MS / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({ success: true, email: decoded.email, owner });
    } catch (err) {
        console.error('Session-Erstellung fehlgeschlagen:', err);
        return NextResponse.json({ error: 'Unauthorisiert' }, { status: 401 });
    }
}

export async function DELETE() {
    const jar = await cookies();
    jar.delete(COOKIE_NAME);
    return NextResponse.json({ success: true });
}
