import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { assertSameOrigin } from '@/lib/origin-check';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { getMailer, escapeHtml, safeHeader, EMAIL_RE } from '@/lib/mailer';

const MAX_NAME = 100;
const MAX_PHONE = 40;
const MAX_MESSAGE = 5000;
const PHONE_RE = /^[+()\d\s/-]{6,30}$/;

export async function POST(request: NextRequest) {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const ip = getClientIp(request);
    const rl = rateLimit({ key: `inquiry:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 });
    if (!rl.success) {
        return NextResponse.json(
            { success: false, error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Ungültiges JSON' }, { status: 400 });
    }

    const { name, email, phone, message, privacyAccepted } = (body ?? {}) as Record<string, unknown>;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
        return NextResponse.json({ success: false, error: 'Fehlende Pflichtfelder' }, { status: 400 });
    }

    if (privacyAccepted !== true) {
        return NextResponse.json(
            { success: false, error: 'Datenschutzerklärung muss akzeptiert werden.' },
            { status: 400 },
        );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length > MAX_NAME) {
        return NextResponse.json({ success: false, error: 'Ungültiger Name' }, { status: 400 });
    }
    if (!EMAIL_RE.test(trimmedEmail) || trimmedEmail.length > 200) {
        return NextResponse.json({ success: false, error: 'Ungültige E-Mail' }, { status: 400 });
    }
    if (trimmedPhone) {
        if (trimmedPhone.length > MAX_PHONE) {
            return NextResponse.json({ success: false, error: 'Telefon zu lang' }, { status: 400 });
        }
        if (!PHONE_RE.test(trimmedPhone)) {
            return NextResponse.json(
                { success: false, error: 'Ungültige Telefonnummer (nur Ziffern, +, -, /, Leerzeichen).' },
                { status: 400 },
            );
        }
    }
    if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE) {
        return NextResponse.json({ success: false, error: 'Ungültige Nachricht' }, { status: 400 });
    }

    try {
        await adminDb.collection('inquiries').add({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone || null,
            message: trimmedMessage,
            read: false,
            archived: false,
            ip,
            privacyAccepted: true,
            privacyAcceptedAt: Timestamp.now(),
            createdAt: Timestamp.now(),
        });

        let mailSent = false;
        let mailError: string | null = null;

        try {
            const transporter = getMailer();
            const safeName = escapeHtml(trimmedName);
            const safeEmail = escapeHtml(trimmedEmail);
            const safePhone = escapeHtml(trimmedPhone || '-');
            const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br>');

            const info = await transporter.sendMail({
                from: `"SicherPro Kontakt" <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_OWNER_EMAIL,
                replyTo: safeHeader(trimmedEmail),
                subject: safeHeader(`Neue Anfrage von ${trimmedName}`),
                text: `Name: ${trimmedName}\nE-Mail: ${trimmedEmail}\nTelefon: ${trimmedPhone || '-'}\nNachricht: ${trimmedMessage}`,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <tr><td style="background-color: #587D85; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Neue Kontaktanfrage</h2>
      </td></tr>
      <tr><td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>E-Mail:</strong> ${safeEmail}</p>
        <p><strong>Telefon:</strong> ${safePhone}</p>
        <p><strong>Nachricht:</strong><br>${safeMessage}</p>
      </td></tr>
      <tr><td style="padding: 0 20px;"><hr style="border: none; border-top: 1px solid #dddddd; margin: 0;" /></td></tr>
      <tr><td style="padding: 15px 20px; font-size: 12px; color: #888888; text-align: center;">
        Diese E-Mail wurde automatisch über das Kontaktformular gesendet.<br>
        &copy; ${new Date().getFullYear()} SicherPro Wachschutz GmbH
      </td></tr>
    </table>
  </td></tr>
</table>`,
            });

            mailSent = true;
            console.log('E-Mail gesendet:', info.messageId);
        } catch (mailErr) {
            mailError = mailErr instanceof Error ? mailErr.message : String(mailErr);
            console.error('E-Mail-Versand fehlgeschlagen:', mailErr);
        }

        return NextResponse.json({
            success: true,
            mailSent,
            mailError: process.env.NODE_ENV === 'development' ? mailError : null,
        });
    } catch (error) {
        console.error('Allgemeiner Fehler in API:', error);
        return NextResponse.json({ success: false, error: 'Serverfehler' }, { status: 500 });
    }
}
