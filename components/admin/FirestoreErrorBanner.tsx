'use client';
import React, { useEffect, useState } from 'react';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Props {
    message: string;
}

export default function FirestoreErrorBanner({ message }: Props) {
    const [email, setEmail] = useState<string | null>(null);
    const [hasAdminClaim, setHasAdminClaim] = useState<boolean | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u: User | null) => {
            if (!u) {
                setEmail(null);
                setHasAdminClaim(null);
                return;
            }
            setEmail(u.email);
            try {
                const t = await u.getIdTokenResult();
                setHasAdminClaim(t.claims.admin === true);
            } catch {
                setHasAdminClaim(false);
            }
        });
        return () => unsub();
    }, []);

    const forceRelogin = async () => {
        setRefreshing(true);
        try {
            await signOut(auth);
            await fetch('/api/admin/session', { method: 'DELETE' });
        } finally {
            router.push('/admin/login?next=/admin/dashboard');
        }
    };

    const refreshToken = async () => {
        setRefreshing(true);
        try {
            const u = auth.currentUser;
            if (u) {
                await u.getIdToken(true);
                window.location.reload();
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0" />
                <div className="flex-1">
                    <p className="font-bold text-red-800">Daten konnten nicht geladen werden</p>
                    <p className="text-sm text-red-700 mt-1">{message}</p>
                </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4 mb-4 text-xs space-y-1 font-mono">
                <p>
                    <span className="text-slate-500">Angemeldet als:</span>{' '}
                    <strong className="text-slate-900">{email || '–'}</strong>
                </p>
                <p>
                    <span className="text-slate-500">Admin-Claim im Token:</span>{' '}
                    {hasAdminClaim === null ? (
                        <span className="text-slate-400">unbekannt</span>
                    ) : hasAdminClaim ? (
                        <span className="text-emerald-700 font-bold">✓ vorhanden</span>
                    ) : (
                        <span className="text-red-700 font-bold">✗ FEHLT</span>
                    )}
                </p>
            </div>

            <div className="space-y-3 text-sm text-red-800">
                <p className="font-semibold">Mögliche Lösungen:</p>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>
                        <strong>Firestore-Rules deployen</strong> (einmalig):
                        <br />
                        <code className="text-xs bg-red-100 px-2 py-1 rounded inline-block mt-1">
                            firebase deploy --only firestore:rules,storage
                        </code>
                    </li>
                    {hasAdminClaim === false && (
                        <li>
                            <strong>Admin-Claim fehlt</strong> — falls deine E-Mail in <code>ADMIN_OWNER_EMAIL</code>{' '}
                            steht, einmal aus- und neu einloggen. Beim Login setzt der Server die Claim automatisch.
                        </li>
                    )}
                    <li>
                        <strong>Token neu laden</strong> — wenn der Server die Claim gerade gesetzt hat, ist der Browser-Token noch alt.
                    </li>
                </ol>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    onClick={refreshToken}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Token neu laden
                </button>
                <button
                    onClick={forceRelogin}
                    disabled={refreshing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                    Neu anmelden
                </button>
            </div>
        </div>
    );
}
