'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Register() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/admin/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (data.success) {
            setSuccess(true);
        } else {
            setError(data.error || 'Fehler.');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-lg">
                    <h1 className="text-4xl font-bold mb-6 text-[#587D85]">Anfrage gesendet!</h1>
                    <p className="text-xl text-[#3A3A3A]">Der Administrator wurde benachrichtigt. Sie erhalten eine E-Mail, sobald Ihr Account freigeschaltet ist.</p>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#D9DEDF] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 shadow-2xl max-w-lg w-full">
                <h1 className="text-5xl font-bold text-center mb-8 text-[#3A3A3A]">Admin-Anfrage</h1>
                <form onSubmit={handleRegister} className="space-y-8">
                    <input type="email" placeholder="Ihre E-Mail *" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-xl border-2 border-[#B2B2AC] focus:border-[#587D85] transition-all" />
                    {error && <p className="text-red-600 text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-[#587D85] text-white py-5 rounded-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg">
                        {loading ? 'Sende...' : 'Anfrage senden'}
                    </button>
                </form>
                <p className="text-center text-[#B2B2AC] mt-8">
                    Bereits Zugang? <a href="/admin/login" className="text-[#587D85] font-bold hover:underline">Login</a>
                </p>
            </motion.div>
        </main>
    );
}