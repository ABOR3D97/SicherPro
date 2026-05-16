import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { assertSameOrigin } from '@/lib/origin-check';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getMailer, escapeHtml, safeHeader, EMAIL_RE } from '@/lib/mailer';

export async function POST(request: NextRequest) {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const rl = rateLimit({ key: `register:${ip}`, limit: 3, windowMs: 60 * 60 * 1000 });
    if (!rl.success) {
        return NextResponse.json(
            { error: 'Zu viele Versuche. Bitte später erneut.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
        );
    }

    try {
        const { email } = await request.json();
        if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
            return NextResponse.json({ error: 'Gültige E-Mail erforderlich.' }, { status: 400 });
        }
        const normalized = email.trim().toLowerCase();

        const recentCutoff = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);
        const recent = await adminDb
            .collection('pendingAdmins')
            .where('email', '==', normalized)
            .where('requestedAt', '>', recentCutoff)
            .limit(1)
            .get();
        if (!recent.empty) {
            return NextResponse.json(
                { error: 'Anfrage wurde bereits gestellt. Bitte 5 Minuten warten.' },
                { status: 429 },
            );
        }

        const token = crypto.randomBytes(32).toString('hex');

        const docRef = await adminDb.collection('pendingAdmins').add({
            email: normalized,
            token,
            requestedAt: Timestamp.now(),
            status: 'pending',
            ip,
        });

        // Token bleibt im Link (der Owner braucht ihn zur Verifikation),
        // wird aber serverseitig timing-safe verglichen und nach Approval gelöscht.
        const approvalLink = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/approve/${docRef.id}?token=${token}`;

        const transporter = getMailer();
        await transporter.sendMail({
            from: `"SicherPro Admin" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_OWNER_EMAIL,
            subject: safeHeader('Neue Admin-Registrierungsanfrage'),
            html: `
                <h2>Neue Anfrage</h2>
                <p>E-Mail: <strong>${escapeHtml(normalized)}</strong></p>
                <p>Klicken Sie auf den Link, um die Anfrage zu prüfen und freizugeben:</p>
                <p><a href="${escapeHtml(approvalLink)}" style="background:#587D85;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">Anfrage prüfen</a></p>
                <p style="font-size:12px;color:#666">Sie müssen als Owner eingeloggt sein, um die Anfrage zu bestätigen.</p>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Register-Fehler:', err);
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}
