'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, ArchiveBoxIcon, CheckIcon, EyeIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { auth, db } from '@/lib/firebase';
import { format } from 'date-fns';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    createdAt: Date;
    read: boolean;
    archived: boolean;
}

export default function ContactManagement() {
    const [user, setUser] = useState<any>(null);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    // Auth
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) setUser(currentUser);
            else router.push('/admin/login');
        });
        return () => unsubscribe();
    }, [router]);

    // Echtzeit-Anfragen
    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data: Inquiry[] = snapshot.docs.map((docSnapshot) => {
                    const d = docSnapshot.data();
                    return {
                        id: docSnapshot.id,
                        name: d.name ?? '',
                        email: d.email ?? '',
                        phone: d.phone ?? undefined,
                        message: d.message ?? '',
                        createdAt: d.createdAt?.toDate?.() ?? new Date(),
                        read: d.read ?? false,
                        archived: d.archived ?? false,
                    };
                });
                setInquiries(data);
                setLoading(false);
            },
            (error) => {
                console.error('Fehler beim Laden:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Aktionen
    const markAsRead = async (id: string) => {
        await updateDoc(doc(db, 'inquiries', id), { read: true });
    };

    const archive = async (id: string) => {
        await updateDoc(doc(db, 'inquiries', id), { archived: true });
    };

    const deleteInquiry = async (id: string) => {
        if (!confirm('Anfrage wirklich unwiderruflich löschen?')) return;
        await deleteDoc(doc(db, 'inquiries', id));
    };

    const reply = (email: string, name: string, message: string) => {
        const subject = encodeURIComponent('Antwort auf Ihre Anfrage bei SicherPro');
        const body = encodeURIComponent(
            `Sehr geehrte/r ${name},\n\nvielen Dank für Ihre Nachricht:\n"${message}"\n\nHier unsere Antwort:\n\nMit freundlichen Grüßen\nSicherPro Team`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    // Filter & Berechnungen
    const filteredInquiries = inquiries.filter(
        (i) =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (i.phone && i.phone.includes(searchTerm))
    );

    const activeInquiries = filteredInquiries.filter((i) => !i.archived);
    const archivedInquiries = filteredInquiries.filter((i) => i.archived);
    const unreadCount = activeInquiries.filter((i) => !i.read).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#D9DEDF]">
                <div className="text-2xl text-[#3A3A3A]">Lade Anfragen...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A]">
            {/* Header */}
            <header className="bg-[#587D85] text-white py-8 px-6 shadow-2xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

            {/* Willkommen & Navigation */}
            <section className="max-w-7xl mx-auto py-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-12 shadow-2xl text-center"
                >
                    <h2 className="text-4xl font-bold mb-8 text-[#3A3A3A]">Willkommen im Admin-Bereich</h2>
                    <p className="text-xl text-[#B2B2AC] max-w-3xl mx-auto leading-relaxed mb-12">
                        Verwalten Sie Bilder, Kontaktdaten und alle eingehenden Anfragen übersichtlich und professionell.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link
                            href="/admin/dashboard"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Zurück zum Dashboard
                        </Link>
                        <Link
                            href="/admin/dashboard/image-management"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Bilder verwalten
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Suche */}
            <section className="max-w-7xl mx-auto px-6 mb-8">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#587D85]" />
                    <input
                        type="text"
                        placeholder="Nach Name, E-Mail oder Nachricht suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-[#B2B2AC] focus:border-[#587D85] transition-all outline-none shadow-md"
                    />
                </div>
            </section>

            {/* Aktive Anfragen */}
            <section className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#3A3A3A]">
                        Aktive Anfragen ({activeInquiries.length})
                    </h2>
                    {unreadCount > 0 && (
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
              {unreadCount} ungelesen
            </span>
                    )}
                </div>

                {activeInquiries.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                        <p className="text-xl text-gray-600">Keine aktiven Anfragen vorhanden.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeInquiries.map((i) => (
                            <motion.div
                                key={i.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
                            >
                                {!i.read && (
                                    <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-br-2xl">
                                        NEU
                                    </div>
                                )}
                                <div className="mt-6">
                                    <h3 className="text-2xl font-bold mb-2 break-words">{i.name}</h3>
                                    <p className="text-[#587D85] mb-4 break-words">
                                        {i.email} {i.phone && <span className="text-[#3A3A3A]">| {i.phone}</span>}
                                    </p>
                                    <p className="text-gray-700 mb-6 line-clamp-4 break-words">{i.message}</p>
                                    <p className="text-sm text-gray-500 mb-6">{format(i.createdAt, 'dd.MM.yyyy HH:mm')}</p>
                                </div>

                                <div className="flex justify-end gap-4">
                                    {!i.read && (
                                        <button
                                            onClick={() => markAsRead(i.id)}
                                            title="Als gelesen markieren"
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <CheckIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedInquiry(i)}
                                        title="Details anzeigen"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <EyeIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => reply(i.email, i.name, i.message)}
                                        title="Antworten"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <PencilIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => archive(i.id)}
                                        title="Archivieren"
                                        className="text-yellow-600 hover:text-yellow-800"
                                    >
                                        <ArchiveBoxIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => deleteInquiry(i.id)}
                                        title="Löschen"
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Archivierte Anfragen */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#3A3A3A]">
                    Archivierte Anfragen ({archivedInquiries.length})
                </h2>

                {archivedInquiries.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                        <p className="text-xl text-gray-600">Keine archivierten Anfragen.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {archivedInquiries.map((i) => (
                            <motion.div
                                key={i.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 rounded-3xl p-8 shadow-xl opacity-90"
                            >
                                <h3 className="text-2xl font-bold mb-2 break-words">{i.name}</h3>
                                <p className="text-[#587D85] mb-4 break-words">
                                    {i.email} {i.phone && <span className="text-[#3A3A3A]">| {i.phone}</span>}
                                </p>
                                <p className="text-gray-700 mb-6 line-clamp-4 break-words">{i.message}</p>
                                <p className="text-sm text-gray-500 mb-6">{format(i.createdAt, 'dd.MM.yyyy HH:mm')}</p>

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setSelectedInquiry(i)}
                                        title="Details anzeigen"
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <EyeIcon className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => deleteInquiry(i.id)}
                                        title="Löschen"
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Detail-Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setSelectedInquiry(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-3xl font-bold mb-2">{selectedInquiry.name}</h3>
                                <p className="text-[#587D85] text-lg">
                                    {selectedInquiry.email} {selectedInquiry.phone && `| ${selectedInquiry.phone}`}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                <XMarkIcon className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">{selectedInquiry.message}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{format(selectedInquiry.createdAt, 'dd.MM.yyyy HH:mm')}</p>
                            <button
                                onClick={() => reply(selectedInquiry.email, selectedInquiry.name, selectedInquiry.message)}
                                className="bg-[#587D85] text-white px-8 py-3 rounded-full font-bold hover:bg-[#3A3A3A] transition-all shadow-lg"
                            >
                                Per E-Mail antworten
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-[#3A3A3A] text-white py-12 px-6 mt-auto">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[#B2B2AC]">Admin Dashboard – SicherPro Wachschutz GmbH</p>
                </div>
            </footer>
        </main>
    );
}