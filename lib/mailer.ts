import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

let cached: Transporter | null = null;

export function getMailer(): Transporter {
    if (cached) return cached;
    cached = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // 465 => secure SMTPS, sonst STARTTLS erzwingen.
        secure: Number(process.env.SMTP_PORT) === 465,
        requireTLS: Number(process.env.SMTP_PORT) !== 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        // Strikt – keine ungültigen Zertifikate akzeptieren.
        tls: { rejectUnauthorized: true, minVersion: 'TLSv1.2' },
    });
    return cached;
}

export const escapeHtml = (s: string) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

/** Verhindert Mail-Header-Injection (CRLF) und kappt zu lange Werte. */
export const safeHeader = (s: string, max = 200) =>
    String(s).replace(/[\r\n]+/g, ' ').slice(0, max);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
