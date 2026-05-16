'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    PencilSquareIcon,
    TrashIcon,
    ArchiveBoxIcon,
    ArchiveBoxXMarkIcon,
    CheckIcon,
    EyeIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
    query,
    type FirestoreError,
} from 'firebase/firestore';
import { useToast } from '@/components/admin/Toast';
import FirestoreErrorBanner from '@/components/admin/FirestoreErrorBanner';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    createdAt: Date | null;
    read: boolean;
    archived: boolean;
}

function parseTimestamp(raw: unknown): Date | null {
    if (!raw) return null;
    const t = raw as { toDate?: () => Date; seconds?: number };
    if (typeof t.toDate === 'function') {
        try {
            return t.toDate();
        } catch {
            return null;
        }
    }
    // Manche Records haben { seconds, nanoseconds }
    if (typeof t.seconds === 'number') {
        return new Date(t.seconds * 1000);
    }
    return null;
}

function formatDate(d: Date | null) {
    if (!d) return '— (unbekannt)';
    return format(d, 'dd.MM.yyyy HH:mm');
}

type Tab = 'active' | 'unread' | 'archived';
type SortKey = 'date_desc' | 'date_asc' | 'name';

export default function ContactManagement() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tab, setTab] = useState<Tab>('active');
    const [sort, setSort] = useState<SortKey>('date_desc');
    const toast = useToast();

    useEffect(() => {
        let unsubSnap: (() => void) | null = null;
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            // Vorhandene Subscription beenden bevor neue startet.
            if (unsubSnap) {
                unsubSnap();
                unsubSnap = null;
            }
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setLoadError(null);
            const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
            unsubSnap = onSnapshot(
                q,
                (snap) => {
                    const data: Inquiry[] = snap.docs.map((d) => {
                        const x = d.data() as Record<string, unknown>;
                        return {
                            id: d.id,
                            name: (x.name as string) ?? '',
                            email: (x.email as string) ?? '',
                            phone: (x.phone as string) ?? undefined,
                            message: (x.message as string) ?? '',
                            createdAt: parseTimestamp(x.createdAt),
                            read: Boolean(x.read),
                            archived: Boolean(x.archived),
                        };
                    });
                    setInquiries(data);
                    setLoadError(null);
                    setLoading(false);
                },
                (err: FirestoreError) => {
                    console.error('Inquiries-Read fehlgeschlagen:', err);
                    setLoadError(
                        err.code === 'permission-denied'
                            ? 'Keine Berechtigung zum Lesen der Anfragen. Firestore-Rules prüfen (admin-Custom-Claim erforderlich).'
                            : `Lesefehler: ${err.code} – ${err.message}`,
                    );
                    setLoading(false);
                },
            );
        });
        return () => {
            unsubAuth();
            if (unsubSnap) unsubSnap();
        };
    }, []);

    const wrap = async (action: Promise<unknown>, ok: string, fail = 'Aktion fehlgeschlagen') => {
        try {
            await action;
            toast.success(ok);
        } catch (e) {
            console.error(e);
            toast.error(fail);
        }
    };

    const markAsRead = (id: string) =>
        wrap(updateDoc(doc(db, 'inquiries', id), { read: true }), 'Als gelesen markiert');
    const markAsUnread = (id: string) =>
        wrap(updateDoc(doc(db, 'inquiries', id), { read: false }), 'Als ungelesen markiert');
    const archive = (id: string) =>
        wrap(updateDoc(doc(db, 'inquiries', id), { archived: true }), 'Anfrage archiviert');
    const unarchive = (id: string) =>
        wrap(updateDoc(doc(db, 'inquiries', id), { archived: false }), 'Aus Archiv geholt');

    const deleteInquiry = async (id: string) => {
        if (!confirm('Anfrage wirklich unwiderruflich löschen?')) return;
        try {
            await deleteDoc(doc(db, 'inquiries', id));
            toast.success('Anfrage gelöscht');
            if (selected?.id === id) setSelected(null);
        } catch (e) {
            console.error(e);
            toast.error('Löschen fehlgeschlagen');
        }
    };

    const reply = (i: Inquiry) => {
        const subject = encodeURIComponent('Antwort auf Ihre Anfrage bei SicherPro');
        const body = encodeURIComponent(
            `Sehr geehrte/r ${i.name},\n\nvielen Dank für Ihre Nachricht:\n"${i.message}"\n\nHier unsere Antwort:\n\nMit freundlichen Grüßen\nSicherPro Team`,
        );
        window.location.href = `mailto:${i.email}?subject=${subject}&body=${body}`;
        if (!i.read) {
            updateDoc(doc(db, 'inquiries', i.id), { read: true }).catch(() => {});
        }
        toast.info('E-Mail-Client wird geöffnet …');
    };

    const counts = {
        active: inquiries.filter((i) => !i.archived).length,
        unread: inquiries.filter((i) => !i.read && !i.archived).length,
        archived: inquiries.filter((i) => i.archived).length,
    };

    const visible = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        const list = inquiries.filter((i) => {
            if (tab === 'archived' && !i.archived) return false;
            if (tab === 'unread' && (i.read || i.archived)) return false;
            if (tab === 'active' && i.archived) return false;
            if (term) {
                const hay = `${i.name} ${i.email} ${i.message} ${i.phone ?? ''}`.toLowerCase();
                if (!hay.includes(term)) return false;
            }
            return true;
        });
        const ts = (d: Date | null) => d?.getTime() ?? 0;
        switch (sort) {
            case 'date_asc':
                return [...list].sort((a, b) => ts(a.createdAt) - ts(b.createdAt));
            case 'name':
                return [...list].sort((a, b) => a.name.localeCompare(b.name, 'de'));
            default:
                return list;
        }
    }, [inquiries, searchTerm, tab, sort]);

    if (loading) {
        return <div className="p-10 text-slate-500">Lade Anfragen …</div>;
    }

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Anfragen</h1>
                <p className="text-slate-500 mt-1">{counts.active} aktiv · {counts.unread} ungelesen · {counts.archived} archiviert</p>
            </div>

            {loadError && <FirestoreErrorBanner message={loadError} />}

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Name, E-Mail, Telefon, Nachricht …"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#587D85] focus:bg-white outline-none transition"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-slate-100 rounded-xl p-1">
                        {(['active', 'unread', 'archived'] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    tab === t ? 'bg-white text-[#1E293B] shadow' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {t === 'active' && `Aktiv (${counts.active})`}
                                {t === 'unread' && `Ungelesen (${counts.unread})`}
                                {t === 'archived' && `Archiv (${counts.archived})`}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#587D85]"
                        >
                            <option value="date_desc">Neueste zuerst</option>
                            <option value="date_asc">Älteste zuerst</option>
                            <option value="name">Name (A–Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            {visible.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
                    <p className="text-slate-500">Keine Anfragen in dieser Ansicht.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 w-8"></th>
                                <th className="px-6 py-3">Absender</th>
                                <th className="px-6 py-3 hidden md:table-cell">Nachricht</th>
                                <th className="px-6 py-3 hidden sm:table-cell whitespace-nowrap">Datum</th>
                                <th className="px-6 py-3 text-right">Aktionen</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {visible.map((i) => (
                                <tr
                                    key={i.id}
                                    className={`hover:bg-slate-50 transition ${!i.read && !i.archived ? 'bg-emerald-50/30' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <span
                                            className={`block w-2 h-2 rounded-full ${
                                                i.archived
                                                    ? 'bg-slate-300'
                                                    : i.read
                                                        ? 'bg-slate-300'
                                                        : 'bg-emerald-500'
                                            }`}
                                            title={i.archived ? 'archiviert' : i.read ? 'gelesen' : 'neu'}
                                        />
                                    </td>
                                    <td className="px-6 py-4 min-w-[180px]">
                                        <p className="font-semibold text-[#1E293B]">{i.name}</p>
                                        <p className="text-sm text-slate-500 break-all">{i.email}</p>
                                        {i.phone && <p className="text-xs text-slate-400">{i.phone}</p>}
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell max-w-md">
                                        <p className="text-sm text-slate-600 line-clamp-2">{i.message}</p>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500 whitespace-nowrap">
                                        {formatDate(i.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelected(i);
                                                    if (!i.read) markAsRead(i.id);
                                                }}
                                                title="Anzeigen"
                                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#587D85]"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => reply(i)}
                                                title="Antworten"
                                                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#587D85]"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                            {!i.archived ? (
                                                <button
                                                    onClick={() => archive(i.id)}
                                                    title="Archivieren"
                                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600"
                                                >
                                                    <ArchiveBoxIcon className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => unarchive(i.id)}
                                                    title="Aus Archiv holen"
                                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                                                >
                                                    <ArchiveBoxXMarkIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            {i.read ? (
                                                <button
                                                    onClick={() => markAsUnread(i.id)}
                                                    title="Als ungelesen markieren"
                                                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
                                                >
                                                    <CheckIcon className="w-5 h-5 rotate-180" />
                                                </button>
                                            ) : null}
                                            <button
                                                onClick={() => deleteInquiry(i.id)}
                                                title="Löschen"
                                                className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelected(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-slate-100">
                            <div className="min-w-0">
                                <h3 className="text-xl font-bold text-[#1E293B]">{selected.name}</h3>
                                <p className="text-[#587D85] mt-1 break-all">{selected.email}</p>
                                {selected.phone && <p className="text-sm text-slate-500">{selected.phone}</p>}
                                <p className="text-xs text-slate-400 mt-2">
                                    {formatDate(selected.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={() => deleteInquiry(selected.id)}
                                className="px-5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium"
                            >
                                Löschen
                            </button>
                            <button
                                onClick={() => {
                                    if (selected.archived) unarchive(selected.id);
                                    else archive(selected.id);
                                    setSelected(null);
                                }}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-white font-medium"
                            >
                                {selected.archived ? 'Aus Archiv holen' : 'Archivieren'}
                            </button>
                            <button
                                onClick={() => reply(selected)}
                                className="px-5 py-2.5 rounded-xl bg-[#587D85] text-white font-bold hover:bg-[#3A3A3A]"
                            >
                                Per E-Mail antworten
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
