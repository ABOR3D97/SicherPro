'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, db, auth } from '@/lib/firebase';
import {
    ArrowUpTrayIcon,
    PhotoIcon,
    TrashIcon,
    ArrowTopRightOnSquareIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { doc, setDoc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { useToast } from '@/components/admin/Toast';
import StorageErrorBanner, {
    classifyStorageError,
    type StorageProblemKind,
} from '@/components/admin/StorageErrorBanner';
import { probeImageUrl } from '@/lib/storage-health';

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
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const UPLOAD_TIMEOUT_MS = 15_000;
const STEP_TIMEOUT_MS = 10_000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(
            () => reject(new Error(`Timeout: "${label}" dauerte länger als ${Math.round(ms / 1000)}s`)),
            ms,
        );
        p.then(
            (v) => {
                clearTimeout(timer);
                resolve(v);
            },
            (e) => {
                clearTimeout(timer);
                reject(e);
            },
        );
    });
}

function describeError(err: unknown): string {
    if (err && typeof err === 'object') {
        const e = err as { code?: string; message?: string };
        const msg = e.message || '';

        // Netzwerk-/CORS-Fehler haben meist code "storage/retry-limit-exceeded"
        // oder kommen als generischer Error mit "Failed to fetch" / "Network".
        const isCors =
            /CORS|preflight|ERR_FAILED|Failed to fetch|NetworkError|Network request failed/i.test(msg);
        if (isCors || (e.code === 'storage/retry-limit-exceeded' && !navigator.onLine === false)) {
            return 'CORS- oder Netzwerk-Fehler. Meist liegt es am falschen Bucket-Namen (siehe Banner oben) oder fehlender Internet-Verbindung.';
        }

        switch (e.code) {
            case 'storage/unauthorized':
                return 'Keine Berechtigung. Storage-Rules prüfen oder neu einloggen.';
            case 'storage/canceled':
                return 'Upload abgebrochen.';
            case 'storage/quota-exceeded':
                return 'Storage-Kontingent überschritten. Firebase-Plan prüfen.';
            case 'storage/unauthenticated':
                return 'Nicht angemeldet. Bitte neu einloggen.';
            case 'storage/retry-limit-exceeded':
                return 'Netzwerk-Timeout nach mehreren Versuchen. Verbindung oder Bucket-Konfiguration prüfen.';
            case 'storage/invalid-checksum':
                return 'Datei-Checksum-Fehler – Upload erneut versuchen.';
            case 'storage/object-not-found':
                return 'Storage-Objekt nicht gefunden.';
            case 'storage/bucket-not-found':
                return 'Storage-Bucket nicht gefunden. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local prüfen.';
            case 'storage/project-not-found':
                return 'Firebase-Projekt nicht gefunden. Konfiguration prüfen.';
            case 'storage/unknown':
                return 'Unbekannter Storage-Fehler. Browser-Konsole für Details prüfen.';
            case 'permission-denied':
                return 'Firestore-Permission verweigert (Rules prüfen).';
            case 'unavailable':
                return 'Firestore nicht erreichbar.';
        }
        if (e.code) return `${e.code}${msg ? ` – ${msg}` : ''}`;
        if (msg) return msg;
    }
    return String(err);
}

export default function ImageManagement() {
    const [images, setImages] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pageError, setPageError] = useState<{ message: string; kind: StorageProblemKind } | null>(null);
    const [activeCategory, setActiveCategory] = useState('Alle');
    const [dragKey, setDragKey] = useState<string | null>(null);
    const toast = useToast();

    const setError = useCallback((key: string, msg: string | null) => {
        setErrors((prev) => {
            if (msg) return { ...prev, [key]: msg };
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    const showPageError = useCallback((err: unknown) => {
        const msg = describeError(err);
        const kind = classifyStorageError(err);
        setPageError({ message: msg, kind });
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDoc(doc(db, 'config', 'websiteImages'));
                if (snap.exists()) {
                    const data = snap.data() as Record<string, string>;
                    setImages(data);

                    // Health-Check: erste echte URL anpingen — 402/billing sofort erkennen.
                    const firstUrl = Object.values(data).find(
                        (v): v is string => typeof v === 'string' && v.startsWith('http'),
                    );
                    if (firstUrl) {
                        const health = await probeImageUrl(firstUrl);
                        if (!health.ok && health.kind) {
                            setPageError({
                                message: health.message || `HTTP ${health.httpStatus}`,
                                kind: health.kind,
                            });
                            return;
                        }
                    }
                }
                setPageError(null);
            } catch (err) {
                console.error('Initial-Load fehlgeschlagen:', err);
                showPageError(err);
            }
        };
        load();
    }, [showPageError]);

    const handleUpload = useCallback(
        async (key: string, file: File) => {
            setError(key, null);

            if (!auth.currentUser) {
                const msg = 'Nicht angemeldet. Bitte neu einloggen.';
                setError(key, msg);
                toast.error(msg);
                return;
            }

            if (!ACCEPTED.includes(file.type)) {
                const msg = `Format "${file.type || 'unbekannt'}" nicht unterstützt. Erlaubt: JPG, PNG, WebP, SVG, GIF.`;
                setError(key, msg);
                toast.error(msg);
                return;
            }
            if (file.size > MAX_BYTES) {
                const msg = `Datei zu groß (${formatBytes(file.size)}). Max. ${formatBytes(MAX_BYTES)}.`;
                setError(key, msg);
                toast.error(msg);
                return;
            }

            setUploading(key);
            setUploadProgress(0);
            console.log(`[upload:${key}] start (${formatBytes(file.size)}, ${file.type})`);

            try {
                const ext = file.name.split('.').pop() || 'bin';
                const storageRef = ref(storage, `website-images/${key}.${ext}`);

                // Resumable Upload mit echtem Progress + Timeout + sauberem Cancel.
                const uploadPromise = new Promise<void>((resolve, reject) => {
                    const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
                    task.on(
                        'state_changed',
                        (snap) => {
                            const pct = snap.totalBytes
                                ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                                : 0;
                            setUploadProgress(pct);
                        },
                        (err) => reject(err),
                        () => resolve(),
                    );
                });

                await withTimeout(uploadPromise, UPLOAD_TIMEOUT_MS, 'Storage-Upload');
                console.log(`[upload:${key}] storage done`);

                const url = await withTimeout(
                    getDownloadURL(storageRef),
                    STEP_TIMEOUT_MS,
                    'Download-URL abrufen',
                );
                console.log(`[upload:${key}] got url`);

                await withTimeout(
                    setDoc(doc(db, 'config', 'websiteImages'), { [key]: url }, { merge: true }),
                    STEP_TIMEOUT_MS,
                    'Firestore-Update',
                );
                console.log(`[upload:${key}] firestore done`);

                setImages((prev) => ({ ...prev, [key]: url }));
                const label = imagesList.find((i) => i.key === key)?.label || key;
                toast.success(`"${label}" erfolgreich hochgeladen.`);
            } catch (err) {
                console.error(`[upload:${key}] FEHLER`, err);
                const msg = describeError(err);
                const kind = classifyStorageError(err);
                setError(key, msg);
                toast.error(`Upload fehlgeschlagen: ${msg}`);
                // Bei globalen Problemen (CORS, Auth, Bucket) auch Page-Banner setzen.
                if (['cors', 'unauthorized', 'unauthenticated', 'bucket-not-found', 'quota-exceeded'].includes(kind)) {
                    setPageError({ message: msg, kind });
                }
            } finally {
                setUploading(null);
                setUploadProgress(0);
            }
        },
        [toast, setError],
    );

    const handleDelete = useCallback(
        async (key: string) => {
            if (!confirm('Bild wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
            try {
                const url = images[key];
                if (url) {
                    try {
                        const path = decodeURIComponent(new URL(url).pathname.split('/o/')[1].split('?')[0]);
                        await deleteObject(ref(storage, path));
                    } catch {
                        // Storage-Datei fehlt evtl. – Firestore-Eintrag trotzdem entfernen
                    }
                }
                await updateDoc(doc(db, 'config', 'websiteImages'), { [key]: deleteField() });
                setImages((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                });
                setError(key, null);
                toast.success('Bild gelöscht.');
            } catch (err) {
                console.error('Delete-Fehler:', err);
                const msg = describeError(err);
                const kind = classifyStorageError(err);
                setError(key, msg);
                toast.error(`Löschen fehlgeschlagen: ${msg}`);
                if (['cors', 'unauthorized', 'unauthenticated', 'bucket-not-found'].includes(kind)) {
                    setPageError({ message: msg, kind });
                }
            }
        },
        [images, toast, setError],
    );

    const filtered = activeCategory === 'Alle' ? imagesList : imagesList.filter((i) => i.category === activeCategory);

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">Bilderverwaltung</h1>
                <p className="text-slate-500 mt-1">Lade Bilder per Drag &amp; Drop hoch. Max. {formatBytes(MAX_BYTES)} pro Datei.</p>
            </div>

            {pageError && (
                <StorageErrorBanner
                    message={pageError.message}
                    kind={pageError.kind}
                    onDismiss={() => setPageError(null)}
                />
            )}

            {/* Tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => {
                    const count = cat === 'Alle' ? imagesList.length : imagesList.filter((i) => i.category === cat).length;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                                activeCategory === cat
                                    ? 'bg-[#587D85] text-white shadow'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#587D85]'
                            }`}
                        >
                            {cat} <span className="opacity-60">({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((item) => {
                    const url = images[item.key];
                    const busy = uploading === item.key;
                    const isDragging = dragKey === item.key;
                    const error = errors[item.key];

                    return (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition ${
                                error ? 'border-red-300' : 'border-slate-100'
                            }`}
                        >
                            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-[#1E293B] truncate">{item.label}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                                        error
                                            ? 'bg-red-100 text-red-700'
                                            : busy
                                                ? 'bg-amber-100 text-amber-700'
                                                : url
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                  {error ? 'Fehler' : busy ? 'lädt …' : url ? 'gesetzt' : 'leer'}
                </span>
                            </div>

                            <label
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    setDragKey(item.key);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDragLeave={() => setDragKey(null)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragKey(null);
                                    const f = e.dataTransfer.files?.[0];
                                    if (f) handleUpload(item.key, f);
                                }}
                                className={`relative block cursor-pointer transition ${
                                    isDragging ? 'bg-[#587D85]/10' : 'bg-slate-50'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept={ACCEPTED.join(',')}
                                    onChange={(e) => e.target.files?.[0] && handleUpload(item.key, e.target.files[0])}
                                    disabled={busy}
                                    className="hidden"
                                />
                                {url ? (
                                    <img
                                        src={url}
                                        alt={item.label}
                                        className="w-full h-56 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-56 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                                        <PhotoIcon className="w-10 h-10 mb-2" />
                                        <p className="text-sm">Bild ziehen oder klicken</p>
                                    </div>
                                )}
                                {busy && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-3 px-6">
                                        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        <div className="text-sm font-medium">
                                            Wird hochgeladen … {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                                        </div>
                                        {uploadProgress > 0 && (
                                            <div className="w-full max-w-[200px] h-1.5 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white transition-all"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>

                            {error && (
                                <div className="bg-red-50 border-t border-red-200 px-4 py-3 flex items-start gap-2">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-red-700">Letzter Versuch fehlgeschlagen</p>
                                        <p className="text-sm text-red-800 break-words">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError(item.key, null)}
                                        className="text-red-400 hover:text-red-700 p-1 shrink-0"
                                        title="Fehler ausblenden"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="p-4 flex items-center gap-2">
                                <label className="flex-1">
                                    <input
                                        type="file"
                                        accept={ACCEPTED.join(',')}
                                        onChange={(e) => e.target.files?.[0] && handleUpload(item.key, e.target.files[0])}
                                        disabled={busy}
                                        className="hidden"
                                    />
                                    <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#587D85] text-white text-sm font-medium hover:bg-[#3A3A3A] transition cursor-pointer disabled:opacity-50">
                                        <ArrowUpTrayIcon className="w-4 h-4" />
                                        {url ? 'Ersetzen' : 'Hochladen'}
                                    </div>
                                </label>
                                {url && (
                                    <>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Im neuen Tab öffnen"
                                            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-[#587D85] hover:text-[#587D85] transition"
                                        >
                                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(item.key)}
                                            title="Löschen"
                                            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-600 transition"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
