'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, onSnapshot, orderBy, query, type FirestoreError } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { format } from 'date-fns';
import {
    EnvelopeOpenIcon,
    EnvelopeIcon,
    ArchiveBoxIcon,
    ClockIcon,
    ArrowRightIcon,
    PhotoIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';
import FirestoreErrorBanner from '@/components/admin/FirestoreErrorBanner';
import StorageErrorBanner, { type StorageProblemKind } from '@/components/admin/StorageErrorBanner';
import { probeImageUrl } from '@/lib/storage-health';

interface Inquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date | null;
    read: boolean;
    archived: boolean;
}

function parseTimestamp(raw: unknown): Date | null {
    if (!raw) return null;
    const t = raw as { toDate?: () => Date; seconds?: number };
    if (typeof t.toDate === 'function') {
        try { return t.toDate(); } catch { return null; }
    }
    if (typeof t.seconds === 'number') return new Date(t.seconds * 1000);
    return null;
}

interface Stats {
    total: number;
    unread: number;
    archived: number;
    last7days: number;
}

function StatCard({
                      icon: Icon,
                      label,
                      value,
                      tone,
                  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number | string;
    tone: 'accent' | 'green' | 'amber' | 'slate';
}) {
    const toneClass = {
        accent: 'bg-[#587D85]/10 text-[#587D85]',
        green: 'bg-emerald-100 text-emerald-700',
        amber: 'bg-amber-100 text-amber-700',
        slate: 'bg-slate-100 text-slate-700',
    }[tone];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4"
        >
            <div className={`w-12 h-12 rounded-xl grid place-items-center ${toneClass}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-3xl font-bold text-[#1E293B] leading-none">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
        </motion.div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, archived: 0, last7days: 0 });
    const [recent, setRecent] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [storageProblem, setStorageProblem] = useState<{ kind: StorageProblemKind; message: string } | null>(null);

    // Einmaliger Storage-Health-Check beim Mount.
    useEffect(() => {
        let mounted = true;
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user || !mounted) return;
            try {
                const snap = await getDoc(doc(db, 'config', 'websiteImages'));
                if (!snap.exists()) return;
                const data = snap.data() as Record<string, string>;
                const firstUrl = Object.values(data).find(
                    (v): v is string => typeof v === 'string' && v.startsWith('http'),
                );
                if (!firstUrl) return;
                const health = await probeImageUrl(firstUrl);
                if (mounted && !health.ok && health.kind) {
                    setStorageProblem({
                        kind: health.kind,
                        message: health.message || `HTTP ${health.httpStatus}`,
                    });
                }
            } catch {
                /* ignore — Probe ist best-effort */
            }
        });
        return () => {
            mounted = false;
            unsub();
        };
    }, []);

    useEffect(() => {
        let unsubSnap: (() => void) | null = null;
        const unsubAuth = onAuthStateChanged(auth, (user) => {
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
            const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
            unsubSnap = onSnapshot(
                q,
                (snap) => {
                    const now = Date.now();
                    const data: Inquiry[] = snap.docs.map((d) => {
                        const x = d.data() as Record<string, unknown>;
                        return {
                            id: d.id,
                            name: (x.name as string) ?? '',
                            email: (x.email as string) ?? '',
                            message: (x.message as string) ?? '',
                            createdAt: parseTimestamp(x.createdAt),
                            read: Boolean(x.read),
                            archived: Boolean(x.archived),
                        };
                    });
                    setStats({
                        total: data.length,
                        unread: data.filter((i) => !i.read && !i.archived).length,
                        archived: data.filter((i) => i.archived).length,
                        last7days: data.filter((i) => i.createdAt && now - i.createdAt.getTime() < SEVEN_DAYS).length,
                    });
                    setRecent(data.filter((i) => !i.archived).slice(0, 5));
                    setLoadError(null);
                    setLoading(false);
                },
                (err: FirestoreError) => {
                    console.error('Dashboard-Read fehlgeschlagen:', err);
                    setLoadError(
                        err.code === 'permission-denied'
                            ? 'Keine Berechtigung. Firestore-Rules prüfen.'
                            : `${err.code} – ${err.message}`,
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

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Übersicht</h1>
                <p className="text-slate-500 mt-1">Willkommen zurück im Admin-Bereich.</p>
            </div>

            {loadError && <FirestoreErrorBanner message={loadError} />}

            {storageProblem && (
                <StorageErrorBanner
                    message={storageProblem.message}
                    kind={storageProblem.kind}
                    onDismiss={() => setStorageProblem(null)}
                />
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard icon={EnvelopeIcon} label="Anfragen gesamt" value={loading ? '…' : stats.total} tone="accent" />
                <StatCard icon={EnvelopeOpenIcon} label="Ungelesen" value={loading ? '…' : stats.unread} tone="green" />
                <StatCard icon={ClockIcon} label="Letzte 7 Tage" value={loading ? '…' : stats.last7days} tone="amber" />
                <StatCard icon={ArchiveBoxIcon} label="Archiviert" value={loading ? '…' : stats.archived} tone="slate" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Inquiries */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-[#1E293B]">Neueste Anfragen</h2>
                        <Link
                            href="/admin/dashboard/contact-management"
                            className="text-sm text-[#587D85] hover:underline flex items-center gap-1"
                        >
                            Alle anzeigen <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <p className="text-slate-500">Lade …</p>
                    ) : recent.length === 0 ? (
                        <p className="text-slate-500 py-6 text-center">Noch keine Anfragen.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recent.map((i) => (
                                <li key={i.id} className="py-3 flex items-start gap-3">
                                    <span
                                        className={`mt-2 w-2 h-2 rounded-full ${i.read ? 'bg-slate-300' : 'bg-emerald-500'}`}
                                        title={i.read ? 'gelesen' : 'neu'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <p className="font-semibold text-[#1E293B] truncate">{i.name}</p>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">
                        {i.createdAt ? format(i.createdAt, 'dd.MM.yyyy HH:mm') : '— (unbekannt)'}
                      </span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">{i.email}</p>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{i.message}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-5">Schnellzugriff</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/dashboard/contact-management"
                            className="flex items-center gap-3 p-4 rounded-xl bg-[#587D85] text-white hover:bg-[#3A3A3A] transition"
                        >
                            <EnvelopeIcon className="w-5 h-5" />
                            <div>
                                <p className="font-semibold">Anfragen verwalten</p>
                                <p className="text-xs text-white/70">{stats.unread} ungelesen</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/dashboard/image-management"
                            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#587D85] hover:bg-slate-50 transition"
                        >
                            <PhotoIcon className="w-5 h-5 text-[#587D85]" />
                            <div>
                                <p className="font-semibold text-[#1E293B]">Bilder verwalten</p>
                                <p className="text-xs text-slate-500">Hero, Logo, Service-Bilder</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/dashboard/usage"
                            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-[#587D85] hover:bg-slate-50 transition"
                        >
                            <BanknotesIcon className="w-5 h-5 text-[#587D85]" />
                            <div>
                                <p className="font-semibold text-[#1E293B]">Verbrauch &amp; Kosten</p>
                                <p className="text-xs text-slate-500">Firestore- &amp; Storage-Auslastung</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
