import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth-server';
import ApproveForm from './ApproveForm';

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ token?: string }>;
}

export default async function ApprovePage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { token } = await searchParams;

    const session = await getSession();
    if (!session) {
        redirect(`/admin/login?next=/admin/approve/${id}?token=${token ?? ''}`);
    }
    if (!session.owner) {
        return (
            <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Zugriff verweigert</h1>
                    <p className="text-[#3A3A3A]">
                        Nur der Owner-Account darf Registrierungsanfragen freigeben.
                    </p>
                </div>
            </main>
        );
    }

    const snap = await adminDb.collection('pendingAdmins').doc(id).get();
    if (!snap.exists) {
        return (
            <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg text-center">
                    <h1 className="text-3xl font-bold text-[#587D85] mb-4">Nicht gefunden</h1>
                    <p className="text-[#3A3A3A]">Diese Anfrage existiert nicht mehr.</p>
                </div>
            </main>
        );
    }

    const data = snap.data() as { email: string; token?: string };
    if (!token || data.token !== token) {
        return (
            <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Ungültiger Link</h1>
                    <p className="text-[#3A3A3A]">Der Bestätigungs-Token stimmt nicht überein.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center p-6">
            <ApproveForm id={id} token={token} email={data.email} />
        </main>
    );
}
