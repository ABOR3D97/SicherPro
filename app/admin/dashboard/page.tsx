'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/admin/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Lade...</div>;

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A]">
            {/* Dashboard Header */}
            <header className="bg-[#587D85] text-white py-8 px-8 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="text-[#D9DEDF] mt-2">Angemeldet als: {user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-[#587D85] px-8 py-3 rounded-full font-bold hover:bg-[#3A3A3A] hover:text-white transition-all shadow-lg"
                    >
                        Abmelden
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl text-center"
                >
                    <h2 className="text-4xl font-bold mb-8 text-[#3A3A3A]">Willkommen im Admin-Bereich</h2>
                    <p className="text-xl text-[#B2B2AC] max-w-3xl mx-auto leading-relaxed">
                        Hier können Sie Bilder hochladen, Kontaktdaten bearbeiten und eingehende Anfragen verwalten.
                    </p>
                    <div className="mt-12 space-y-6">
                        {/* Nach den bestehenden Links */}
                        <Link href="/admin/dashboard/image-management" className="block bg-[#587D85] text-white py-6 rounded-2xl text-2xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg">
                            Bilder verwalten
                        </Link>
                        <Link href="/admin/dashboard/contact-management" className="block bg-[#587D85] text-white py-6 rounded-2xl text-2xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg">
                            Kontaktdaten & Anfragen
                        </Link>
                        <Link href="/" className="block bg-[#587D85] text-white py-6 rounded-2xl text-2xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg">
                            Zu Seite
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-[#3A3A3A] text-white py-12 px-6 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[#B2B2AC]">Admin Dashboard – SicherPro Wachschutz GmbH</p>
                </div>
            </footer>
        </main>
    );
}