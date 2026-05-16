import { NextRequest, NextResponse } from 'next/server';

/**
 * Schützt vor CSRF / Cross-Site-POSTs: prüft, ob Origin/Referer-Header
 * zum eigenen Host gehört. Bei Mismatch → 403.
 */
export function assertSameOrigin(req: NextRequest): NextResponse | null {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const expectedHost = req.nextUrl.host;

    const check = (raw: string | null) => {
        if (!raw) return null;
        try {
            return new URL(raw).host === expectedHost;
        } catch {
            return false;
        }
    };

    const originOk = check(origin);
    const refererOk = check(referer);

    // Mindestens einer der Header muss anwesend UND korrekt sein.
    if (originOk === false || (originOk === null && refererOk === false)) {
        return NextResponse.json({ error: 'Cross-Origin verboten' }, { status: 403 });
    }
    if (originOk === null && refererOk === null) {
        return NextResponse.json({ error: 'Origin/Referer fehlt' }, { status: 403 });
    }

    return null;
}
