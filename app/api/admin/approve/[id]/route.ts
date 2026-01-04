import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

function generateTempPassword() {
    return Math.random().toString(36).slice(-12) + 'A1!@'; // Starkes temp Passwort (nur intern!)
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const snap = await getDoc(doc(db, 'pendingAdmins', id));
        if (!snap.exists()) throw new Error('Anfrage nicht gefunden');

        const { email } = snap.data();

        // Temp Passwort generieren (nur intern)
        const tempPassword = generateTempPassword();

        // User erstellen
        await createUserWithEmailAndPassword(auth, email, tempPassword);

        // Sofort Password-Reset-Link senden (User setzt eigenes Passwort)
        await sendPasswordResetEmail(auth, email);

        // Pending löschen
        await deleteDoc(doc(db, 'pendingAdmins', id));

        return NextResponse.redirect(new URL('/admin/approve-success', request.url));
    } catch (err: any) {
        console.error('Approval Error:', err);
        return NextResponse.redirect(new URL('/admin/approve-error', request.url));
    }
}