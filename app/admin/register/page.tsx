'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Register() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Fehler beim Senden.');
            }
        } catch {
            setError('Verbindungsfehler. Bitte später erneut versuchen.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl p-10 sm:p-12 shadow-2xl text-center max-w-lg"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#587D85]">Anfrage gesendet</h1>
                    <p className="text-lg text-[#3A3A3A]">
                        Der Administrator wurde benachrichtigt. Sie erhalten eine E-Mail mit den Zugangsdaten, sobald
                        Ihre Anfrage freigegeben wurde.
                    </p>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 sm:p-12 shadow-2xl max-w-lg w-full"
            >
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-[#3A3A3A]">Admin-Anfrage</h1>
                <p className="text-center text-[#B2B2AC] mb-8">
                    Senden Sie Ihre E-Mail – der Owner prüft die Anfrage manuell.
                </p>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Ihre E-Mail *"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] outline-none transition"
                    />
                    {error && <p className="text-red-600 text-center bg-red-50 py-2 rounded-xl">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#587D85] text-white py-4 rounded-xl font-bold hover:bg-[#3A3A3A] transition shadow-lg disabled:opacity-60"
                    >
                        {loading ? 'Sende …' : 'Anfrage senden'}
                    </button>
                </form>
                <p className="text-center text-sm text-[#B2B2AC] mt-8">
                    Bereits Zugang?{' '}
                    <Link href="/admin/login" className="text-[#587D85] font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
