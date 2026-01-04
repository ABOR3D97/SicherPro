'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '@/lib/firebase';
import { ArrowUpTrayIcon, CheckCircleIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

interface ImageItem {
    key: string;
    label: string;
    category: string;
}

const imagesList: ImageItem[] = [
    { key: 'home_logo', label: 'Startseite – Logo', category: 'Startseite' },
    { key: 'home_hero', label: 'Startseite – Hero-Bild', category: 'Startseite' },

    { key: 'about_hero', label: 'Über uns – Hero-Bild', category: 'Über uns' },
    { key: 'about_image', label: 'Über uns – Zusatzbild', category: 'Über uns' },
    { key: 'process_image', label: 'Über uns – Prozessbild', category: 'Über uns' },

    { key: 'contact_hero', label: 'Kontakt – Hero-Bild', category: 'Kontakt' },

    { key: 'baustellen_hero', label: 'Baustellenbewachung – Hero', category: 'Dienstleistungen' },
    { key: 'brandwache_hero', label: 'Brandwache – Hero', category: 'Dienstleistungen' },
    { key: 'objektschutz_hero', label: 'Objektschutz – Hero', category: 'Dienstleistungen' },
    { key: 'veranstaltung_hero', label: 'Veranstaltungsschutz – Hero', category: 'Dienstleistungen' },
    { key: 'personenschutz_hero', label: 'Personenschutz – Hero', category: 'Dienstleistungen' },
    { key: 'mobiler_hero', label: 'Mobiler Wachdienst – Hero', category: 'Dienstleistungen' },
    { key: 'unterkuenfte_hero', label: 'Bewachung von Unterkünften – Hero', category: 'Dienstleistungen' },
];

const categories = ['Alle', 'Startseite', 'Über uns', 'Kontakt', 'Dienstleistungen'];

export default function ImageManagement() {
    const [images, setImages] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Alle');
    const router = useRouter();

    // Auth
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) setUser(currentUser);
            else router.push('/admin/login');
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    // Bilder laden
    useEffect(() => {
        const loadImages = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'config', 'websiteImages'));
                if (docSnap.exists()) {
                    setImages(docSnap.data() as Record<string, string>);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Bilder:', error);
            }
        };
        loadImages();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    const handleUpload = async (key: string, file: File) => {
        if (!file) return;
        setUploading(key);
        setSuccess(null);

        try {
            const storageRef = ref(storage, `website-images/${key}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await setDoc(doc(db, 'config', 'websiteImages'), { [key]: url }, { merge: true });
            setImages((prev) => ({ ...prev, [key]: url }));

            const label = imagesList.find((i) => i.key === key)?.label || key;
            setSuccess(`"${label}" erfolgreich hochgeladen und aktualisiert!`);
            setTimeout(() => setSuccess(null), 6000);
        } catch (error) {
            console.error('Upload fehlgeschlagen:', error);
            alert('Fehler beim Hochladen – prüfen Sie die Konsole.');
        } finally {
            setUploading(null);
        }
    };

    const filteredImages = activeCategory === 'Alle'
        ? imagesList
        : imagesList.filter((item) => item.category === activeCategory);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#D9DEDF]">
                <div className="text-2xl text-[#3A3A3A]">Lade Dashboard...</div>
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
                    <h2 className="text-4xl font-bold mb-8 text-[#3A3A3A]">Bilderverwaltung</h2>
                    <p className="text-xl text-[#B2B2AC] max-w-4xl mx-auto leading-relaxed mb-12">
                        Verwalten Sie alle Website-Bilder zentral – mit Live-Vorschau und einfachem Upload.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link
                            href="/admin/dashboard"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Zurück zum Dashboard
                        </Link>
                        <Link
                            href="/admin/dashboard/contact-management"
                            className="bg-[#587D85] text-white py-4 px-8 rounded-2xl text-xl font-bold hover:bg-[#3A3A3A] transition-all shadow-lg text-center"
                        >
                            Anfragen verwalten
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Kategorien-Tabs */}
            <section className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full font-bold transition-all shadow-md ${
                                activeCategory === cat
                                    ? 'bg-[#587D85] text-white'
                                    : 'bg-white text-[#587D85] hover:bg-[#587D85] hover:text-white'
                            }`}
                        >
                            {cat} ({cat === 'Alle' ? imagesList.length : imagesList.filter(i => i.category === cat).length})
                        </button>
                    ))}
                </div>
            </section>

            {/* Bildergalerie */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                {filteredImages.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-xl">
                        <PhotoIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                        <p className="text-2xl text-gray-600">Keine Bilder in dieser Kategorie.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredImages.map((item) => (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-4 text-[#587D85]">{item.label}</h3>

                                    {images[item.key] ? (
                                        <div className="relative group mb-6 overflow-hidden rounded-2xl">
                                            <img
                                                src={images[item.key]}
                                                alt={item.label}
                                                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100">
                                                <p className="text-white text-sm mb-4 px-4 break-all">{images[item.key]}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 border-2 border-dashed rounded-2xl w-full h-80 mb-6 flex flex-col items-center justify-center text-gray-500">
                                            <PhotoIcon className="w-16 h-16 mb-4" />
                                            <p className="text-lg">Kein Bild hochgeladen</p>
                                        </div>
                                    )}

                                    <label className="block cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleUpload(item.key, e.target.files[0])}
                                            disabled={uploading === item.key}
                                            className="hidden"
                                        />
                                        <div
                                            className={`flex items-center justify-center gap-3 py-4 px-8 rounded-full font-bold transition-all shadow-lg ${
                                                uploading === item.key
                                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                                    : 'bg-[#587D85] text-white hover:bg-[#3A3A3A]'
                                            }`}
                                        >
                                            <ArrowUpTrayIcon className="w-6 h-6" />
                                            {uploading === item.key ? 'Wird hochgeladen...' : 'Neues Bild hochladen'}
                                        </div>
                                    </label>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Success Toast */}
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 z-50"
                >
                    <CheckCircleIcon className="w-8 h-8" />
                    <span className="text-lg font-bold">{success}</span>
                    <button onClick={() => setSuccess(null)} className="ml-4">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </motion.div>
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