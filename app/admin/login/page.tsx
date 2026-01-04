'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Falsche E-Mail oder Passwort.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Ungültige Anmeldedaten.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Zu viele Versuche. Versuchen Sie es später erneut.');
            } else {
                setError('Login fehlgeschlagen. Bitte versuchen Sie es später erneut.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#D9DEDF] to-[#B2B2AC]/30 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-12 shadow-2xl max-w-lg w-full border border-[#B2B2AC]/50"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-[#3A3A3A] mb-4">Admin Login</h1>
                    <p className="text-lg text-[#B2B2AC]">SicherPro Wachschutz GmbH – Verwaltungsbereich</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div>
                        <label className="block text-lg font-medium text-[#3A3A3A] mb-2">E-Mail-Adresse</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@sicherpro.de"
                            className="w-full px-6 py-4 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] focus:outline-none transition-all text-[#3A3A3A]"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-[#3A3A3A] mb-2">Passwort</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-6 py-4 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] focus:outline-none transition-all"
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
                        className="w-full bg-[#587D85] text-white py-5 rounded-xl text-xl font-bold hover:bg-[#3A3A3A] transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Anmelden...' : 'Anmelden'}
                    </button>
                </form>

                <div className="text-center mt-8 space-y-4">
                    <p className="text-[#B2B2AC]">
                        Noch kein Zugang? <Link href="/admin/register" className="text-[#587D85] font-bold hover:underline">Registrierungsanfrage stellen</Link>
                    </p>
                    <p className="text-sm text-[#B2B2AC]">
                        Passwort vergessen? Kontaktieren Sie den Administrator.
                    </p>
                </div>
            </motion.div>
        </main>
    );
}