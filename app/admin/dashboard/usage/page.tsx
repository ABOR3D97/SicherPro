'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowPathIcon,
    CircleStackIcon,
    PhotoIcon,
    BanknotesIcon,
    InformationCircleIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/admin/Toast';
import StorageErrorBanner, {
    classifyStorageError,
    type StorageProblemKind,
} from '@/components/admin/StorageErrorBanner';
import ExternalServicesSection from '@/components/admin/ExternalServicesSection';

interface UsageData {
    firestore: {
        counts: Record<string, { count: number; error?: string }>;
        totalDocs: number;
        estimatedBytes: number;
    };
    storage: {
        perPrefix: Record<string, { bytes: number; files: number; error?: string }>;
        totalFiles: number;
        totalBytes: number;
        bucket: string;
    };
    generatedAt: string;
}

// Firebase Free-Tier (Spark) – Quellen: firebase.google.com/pricing
const FREE = {
    firestoreStorageBytes: 1 * 1024 ** 3, // 1 GiB
    firestoreReadsPerDay: 50_000,
    firestoreWritesPerDay: 20_000,
    storageBytes: 5 * 1024 ** 3, // 5 GB
    storageDownloadGbPerDay: 1,
};

// Blaze-Preise (USD, eur3/Frankfurt – ohne Steuern; Stand der Vorlage)
const PRICE = {
    firestoreStoragePerGbMonth: 0.18,
    storagePerGbMonth: 0.026,
};

function formatBytes(b: number) {
    if (b < 0) return '–';
    if (b < 1024) return `${b} B`;
    if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(2)} MB`;
    return `${(b / 1024 ** 3).toFixed(3)} GB`;
}

function formatUsd(v: number) {
    return v < 0.01 ? '< $0.01' : `$${v.toFixed(2)}`;
}

function ProgressBar({ used, total, tone }: { used: number; total: number; tone: 'accent' | 'amber' | 'red' }) {
    const pct = Math.min(100, Math.max(0, (used / total) * 100));
    const toneClass = {
        accent: 'bg-[#587D85]',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
    }[tone];
    return (
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className={`h-full ${toneClass} transition-all`} style={{ width: `${pct}%` }} />
        </div>
    );
}

function tone(used: number, total: number): 'accent' | 'amber' | 'red' {
    const pct = (used / total) * 100;
    if (pct >= 90) return 'red';
    if (pct >= 70) return 'amber';
    return 'accent';
}

export default function Usage() {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [storageProblem, setStorageProblem] = useState<{ kind: StorageProblemKind; message: string } | null>(null);
    const toast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setStorageProblem(null);
        try {
            const res = await fetch('/api/admin/usage', { cache: 'no-store' });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Anfrage fehlgeschlagen');
            setData(json as UsageData);

            // Check ob Storage-Listing einen Fehler hatte (z. B. 402 / Billing).
            const storageErrors = Object.values((json as UsageData).storage?.perPrefix || {})
                .map((p) => p.error)
                .filter((e): e is string => Boolean(e));
            if (storageErrors.length > 0) {
                const msg = storageErrors[0];
                setStorageProblem({
                    kind: classifyStorageError({ message: msg }),
                    message: msg,
                });
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unbekannter Fehler';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Kosten-Schätzung (nur Storage-Kosten – Reads/Writes brauchen historische Metrik)
    const firestoreStorageGB = data ? data.firestore.estimatedBytes / 1024 ** 3 : 0;
    const storageGB = data ? data.storage.totalBytes / 1024 ** 3 : 0;
    const firestoreCost = Math.max(0, (firestoreStorageGB - 1) * PRICE.firestoreStoragePerGbMonth);
    const storageCost = Math.max(0, (storageGB - 5) * PRICE.storagePerGbMonth);
    const totalCost = firestoreCost + storageCost;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Verbrauch &amp; Kosten</h1>
                    <p className="text-slate-500 mt-1">
                        Live-Daten von Firestore und Cloud Storage. Letztes Update:{' '}
                        {data ? new Date(data.generatedAt).toLocaleString('de-DE') : '–'}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Aktualisieren
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-800">
                    <p className="font-semibold mb-1">Verbrauch konnte nicht geladen werden</p>
                    <p>{error}</p>
                </div>
            )}

            {storageProblem && (
                <StorageErrorBanner
                    message={storageProblem.message}
                    kind={storageProblem.kind}
                    onDismiss={() => setStorageProblem(null)}
                />
            )}

            {loading && !data && (
                <div className="text-center py-16 text-slate-500">Lade Verbrauchsdaten …</div>
            )}

            {data && (
                <>
                    {/* Übersicht */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <CircleStackIcon className="w-6 h-6 text-[#587D85]" />
                                <span className="text-sm font-medium text-slate-500">Firestore</span>
                            </div>
                            <p className="text-3xl font-bold text-[#1E293B]">{data.firestore.totalDocs}</p>
                            <p className="text-sm text-slate-500 mt-1">Dokumente · ~{formatBytes(data.firestore.estimatedBytes)}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <PhotoIcon className="w-6 h-6 text-[#587D85]" />
                                <span className="text-sm font-medium text-slate-500">Storage</span>
                            </div>
                            <p className="text-3xl font-bold text-[#1E293B]">{data.storage.totalFiles}</p>
                            <p className="text-sm text-slate-500 mt-1">Dateien · {formatBytes(data.storage.totalBytes)}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <BanknotesIcon className="w-6 h-6 text-[#587D85]" />
                                <span className="text-sm font-medium text-slate-500">Geschätzte Kosten / Monat</span>
                            </div>
                            <p className="text-3xl font-bold text-[#1E293B]">{formatUsd(totalCost)}</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {totalCost === 0 ? 'innerhalb des Free-Tiers' : 'nur Storage – ohne Reads/Writes'}
                            </p>
                        </motion.div>
                    </div>

                    {/* Externe Dienste — manuell gepflegt (IONOS, Vercel, …) */}
                    <ExternalServicesSection />

                    {/* Firestore Details */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                            <CircleStackIcon className="w-5 h-5 text-[#587D85]" />
                            Firestore Details
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Geschätzte Datenmenge</span>
                                    <span className="text-sm text-slate-500">
                                        {formatBytes(data.firestore.estimatedBytes)} / {formatBytes(FREE.firestoreStorageBytes)} (Free)
                                    </span>
                                </div>
                                <ProgressBar
                                    used={data.firestore.estimatedBytes}
                                    total={FREE.firestoreStorageBytes}
                                    tone={tone(data.firestore.estimatedBytes, FREE.firestoreStorageBytes)}
                                />
                            </div>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="text-left text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="py-2">Collection</th>
                                    <th className="py-2 text-right">Dokumente</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(data.firestore.counts).map(([col, info]) => (
                                    <tr key={col}>
                                        <td className="py-2 font-mono text-slate-700">{col}</td>
                                        <td className="py-2 text-right font-semibold text-[#1E293B]" title={info.error}>
                                            {info.error ? '⚠' : info.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-lg p-3 flex items-start gap-2">
                            <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                                Die Datenmengen-Schätzung basiert auf ~550 Bytes pro Dokument.
                                Reads/Writes pro Tag werden hier nicht angezeigt — die genauen Werte
                                stehen in der Firebase-Console unter „Usage“.
                            </span>
                        </div>
                    </div>

                    {/* Storage Details */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                            <PhotoIcon className="w-5 h-5 text-[#587D85]" />
                            Cloud Storage Details
                        </h2>

                        <p className="text-xs text-slate-500 mb-4">
                            Bucket: <code>{data.storage.bucket}</code>
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-700">Storage gesamt</span>
                                    <span className="text-sm text-slate-500">
                                        {formatBytes(data.storage.totalBytes)} / {formatBytes(FREE.storageBytes)} (Free)
                                    </span>
                                </div>
                                <ProgressBar
                                    used={data.storage.totalBytes}
                                    total={FREE.storageBytes}
                                    tone={tone(data.storage.totalBytes, FREE.storageBytes)}
                                />
                            </div>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="text-left text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="py-2">Ordner</th>
                                    <th className="py-2 text-right">Dateien</th>
                                    <th className="py-2 text-right">Größe</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(data.storage.perPrefix).map(([prefix, info]) => (
                                    <tr key={prefix}>
                                        <td className="py-2 font-mono text-slate-700">{prefix}</td>
                                        <td className="py-2 text-right font-semibold text-[#1E293B]">
                                            {info.files < 0 ? '–' : info.files}
                                        </td>
                                        <td className="py-2 text-right font-semibold text-[#1E293B]">
                                            {formatBytes(info.bytes)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Kostenschätzung */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                            <BanknotesIcon className="w-5 h-5 text-[#587D85]" />
                            Kostenschätzung (Blaze-Plan)
                        </h2>

                        <table className="w-full text-sm">
                            <thead className="text-left text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="py-2">Position</th>
                                    <th className="py-2 text-right">Über Free-Tier</th>
                                    <th className="py-2 text-right">USD/Monat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="py-2 text-slate-700">Firestore Storage (${PRICE.firestoreStoragePerGbMonth}/GB)</td>
                                    <td className="py-2 text-right text-slate-600">
                                        {Math.max(0, firestoreStorageGB - 1).toFixed(3)} GB
                                    </td>
                                    <td className="py-2 text-right font-semibold text-[#1E293B]">
                                        {formatUsd(firestoreCost)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-slate-700">Cloud Storage (${PRICE.storagePerGbMonth}/GB)</td>
                                    <td className="py-2 text-right text-slate-600">
                                        {Math.max(0, storageGB - 5).toFixed(3)} GB
                                    </td>
                                    <td className="py-2 text-right font-semibold text-[#1E293B]">
                                        {formatUsd(storageCost)}
                                    </td>
                                </tr>
                                <tr className="border-t-2 border-slate-200">
                                    <td className="py-3 font-bold text-[#1E293B]">Geschätzte Summe</td>
                                    <td></td>
                                    <td className="py-3 text-right font-bold text-[#1E293B]">{formatUsd(totalCost)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="mt-4 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                            <InformationCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                            <div>
                                <p className="font-semibold text-amber-800">Diese Schätzung enthält NICHT:</p>
                                <ul className="list-disc pl-5 mt-1 text-amber-700">
                                    <li>Firestore-Reads/Writes ($0.06 bzw. $0.18 pro 100.000)</li>
                                    <li>Storage-Downloads ($0.12 pro GB Egress)</li>
                                    <li>Authentication, Cloud Functions, andere Dienste</li>
                                </ul>
                                <p className="mt-2 text-amber-700">
                                    Auf dem Spark-Plan (kostenlos) fallen 0 € Kosten an, solange du im Free-Tier bleibst.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Links zu Firebase Console */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-base font-bold text-[#1E293B] mb-3">Detaillierte Live-Daten in der Firebase-Console</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a
                                href="https://console.firebase.google.com/project/_/usage"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#587D85] transition"
                            >
                                <span className="text-sm font-medium text-slate-700">Firestore Usage (Reads/Writes/Storage)</span>
                                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
                            </a>
                            <a
                                href="https://console.firebase.google.com/project/_/storage"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#587D85] transition"
                            >
                                <span className="text-sm font-medium text-slate-700">Storage Usage (Bytes + Downloads)</span>
                                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
                            </a>
                            <a
                                href="https://console.cloud.google.com/billing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#587D85] transition"
                            >
                                <span className="text-sm font-medium text-slate-700">Google Cloud Billing (echte Rechnung)</span>
                                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
                            </a>
                            <a
                                href="https://firebase.google.com/pricing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#587D85] transition"
                            >
                                <span className="text-sm font-medium text-slate-700">Firebase Pricing-Übersicht</span>
                                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
