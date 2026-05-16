'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    id: string;
    token: string;
    email: string;
}

export default function ApproveForm({ id, token, email }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleApprove = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/admin/approve/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Fehler');
            router.push('/admin/approve-success');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-lg w-full">
            <h1 className="text-3xl font-bold text-[#587D85] mb-6 text-center">Anfrage prüfen</h1>
            <p className="text-[#3A3A3A] text-lg text-center mb-2">
                Möchten Sie folgende E-Mail als Admin freigeben?
            </p>
            <p className="text-xl font-bold text-center mb-8 break-all">{email}</p>

            {error && (
                <p className="text-red-600 bg-red-50 p-3 rounded-xl text-center mb-6">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.push('/admin/dashboard')}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl border-2 border-[#B2B2AC] text-[#3A3A3A] font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Abbrechen
                </button>
                <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl bg-[#587D85] text-white font-bold hover:bg-[#3A3A3A] transition disabled:opacity-50"
                >
                    {loading ? 'Freigeben …' : 'Freigeben'}
                </button>
            </div>
        </div>
    );
}
