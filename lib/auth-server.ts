import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie, isOwner } from './firebase-admin';

const COOKIE_NAME = '__session';

export async function getSession() {
    const jar = await cookies();
    const session = jar.get(COOKIE_NAME)?.value;
    const decoded = await verifySessionCookie(session);
    if (!decoded) return null;
    return {
        uid: decoded.uid,
        email: decoded.email ?? null,
        owner: isOwner(decoded.email),
    };
}

export async function requireAdmin() {
    const session = await getSession();
    if (!session) redirect('/admin/login');
    return session;
}

export async function requireOwner() {
    const session = await getSession();
    if (!session) redirect('/admin/login');
    if (!session.owner) redirect('/admin/dashboard');
    return session;
}
