import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'E-Mail erforderlich.' }, { status: 400 });
        }

        // Nur E-Mail speichern (kein Passwort!)
        const docRef = await addDoc(collection(db, 'pendingAdmins'), {
            email,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        });

        const approvalLink = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/approve/${docRef.id}`;

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_OWNER_EMAIL,
            subject: 'Neue Admin-Registrierungsanfrage',
            html: `
        <h2>Neue Anfrage</h2>
        <p>E-Mail: ${email}</p>
        <p><a href="${approvalLink}" style="background:#587D85;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Bestätigen</a></p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}