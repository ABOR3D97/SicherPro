'use client';
import React, { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginInner() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const next = params.get('next') || '/admin/dashboard';
    const errorParam = params.get('error');

    useEffect(() => {
        if (errorParam === 'not_admin') {
            setError('Diese E-Mail hat keinen Admin-Zugang. Anfrage beim Owner stellen.');
        }
    }, [errorParam]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            let idToken = await cred.user.getIdToken();
            let res = await fetch('/api/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            const data = await res.json().catch(() => ({}));

            // Owner-Bootstrap: Server hat Admin-Claim gesetzt → Token frisch holen, retry.
            if (res.status === 401 && data?.refresh) {
                idToken = await cred.user.getIdToken(true);
                res = await fetch('/api/admin/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
            }

            if (!res.ok) {
                await signOut(auth);
                const j = await res.json().catch(() => ({ error: 'Session konnte nicht erstellt werden.' }));
                throw new Error(j.error || 'Session konnte nicht erstellt werden.');
            }
            router.push(next);
        } catch (err) {
            const code = (err as { code?: string })?.code;
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Falsche E-Mail oder Passwort.');
            } else if (code === 'auth/too-many-requests') {
                setError('Zu viele Versuche. Versuchen Sie es später erneut.');
            } else {
                setError(err instanceof Error ? err.message : 'Login fehlgeschlagen.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#D9DEDF] to-[#B2B2AC]/30 flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-10 sm:p-12 shadow-2xl max-w-lg w-full border border-[#B2B2AC]/50"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#3A3A3A] mb-3">Admin Login</h1>
                    <p className="text-base text-[#B2B2AC]">SicherPro Wachschutz GmbH – Verwaltungsbereich</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#3A3A3A] mb-2">E-Mail-Adresse</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="admin@sicherpro.de"
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] focus:outline-none transition-all text-[#3A3A3A]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#3A3A3A] mb-2">Passwort</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] focus:outline-none transition-all"
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-center font-medium bg-red-50 py-3 rounded-xl"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#587D85] text-white py-4 rounded-xl text-lg font-bold hover:bg-[#3A3A3A] transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Anmelden …' : 'Anmelden'}
                    </button>
                </form>

                <div className="text-center mt-8 space-y-3">
                    <p className="text-sm text-[#B2B2AC]">
                        Noch kein Zugang?{' '}
                        <Link href="/admin/register" className="text-[#587D85] font-bold hover:underline">
                            Registrierungsanfrage stellen
                        </Link>
                    </p>
                    <p className="text-xs text-[#B2B2AC]">
                        Passwort vergessen? Kontaktieren Sie den Administrator.
                    </p>
                </div>
            </motion.div>
        </main>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#D9DEDF]" />}>
            <LoginInner />
        </Suspense>
    );
}
