import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import nodemailer from 'nodemailer';
import {serverTimestamp} from "@firebase/database";

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: 'Fehlende Pflichtfelder' }, { status: 400 });
        }

        // 1. Immer in Firestore speichern (das funktioniert unabhängig von E-Mail)
        await addDoc(collection(db, 'inquiries'), {
            name,
            email,
            phone,
            message,
            read: false,
            archived: false,
            createdAt: serverTimestamp(),
        });


        let mailSent = false;
        let mailError = null;

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const info = await transporter.sendMail({
                from: `"SicherPro Kontakt" <${process.env.SMTP_USER}>`,
                to: process.env.ADMIN_OWNER_EMAIL,   // <-- deine Owner-E-Mail
                subject: `Neue Anfrage von ${name}`,
                text: `
          Name: ${name}
          E-Mail: ${email}
          Telefon: ${phone || '-'}
          Nachricht: ${message}
        `,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #587D85; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">Neue Kontaktanfrage</h2>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || '-'}</p>
            <p><strong>Nachricht:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding: 0 20px;">
            <hr style="border: none; border-top: 1px solid #dddddd; margin: 0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 15px 20px; font-size: 12px; color: #888888; text-align: center;">
            Diese E-Mail wurde automatisch über das Kontaktformular gesendet.<br>
            &copy; 2026 SicherPro Wachschutz GmbH
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`

            });

            mailSent = true;
            console.log('E-Mail erfolgreich gesendet:', info.messageId);
        } catch (mailErr: any) {
            mailError = mailErr.message;
            console.error('E-Mail-Versand fehlgeschlagen:', mailErr);
            // WICHTIG: Wir werfen KEINEN Fehler – Firestore hat ja gespeichert!
        }

        return NextResponse.json({
            success: true,
            mailSent,
            mailError: process.env.NODE_ENV === 'development' ? mailError : null, // Nur im Dev zeigen
        });
    } catch (error: any) {
        console.error('Allgemeiner Fehler in API:', error);
        return NextResponse.json({ success: false, error: 'Serverfehler' }, { status: 500 });
    }
}