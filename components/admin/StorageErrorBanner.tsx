'use client';
import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type StorageProblemKind =
    | 'cors'
    | 'unauthorized'
    | 'unauthenticated'
    | 'bucket-not-found'
    | 'quota-exceeded'
    | 'billing'
    | 'network'
    | 'firestore-denied'
    | 'unknown';

export function classifyStorageError(err: unknown): StorageProblemKind {
    if (!err || typeof err !== 'object') return 'unknown';
    const e = err as { code?: string; message?: string };
    const msg = e.message || '';

    // HTTP 402 oder „Payment Required" → Billing-Problem
    if (/\b402\b|Payment Required|payment_required|billingDisabled/i.test(msg)) {
        return 'billing';
    }
    if (/CORS|preflight|ERR_FAILED|Failed to fetch|NetworkError|Network request failed/i.test(msg)) {
        return 'cors';
    }
    switch (e.code) {
        case 'storage/unauthorized':
            return 'unauthorized';
        case 'storage/unauthenticated':
            return 'unauthenticated';
        case 'storage/bucket-not-found':
        case 'storage/project-not-found':
            return 'bucket-not-found';
        case 'storage/quota-exceeded':
            return 'quota-exceeded';
        case 'storage/retry-limit-exceeded':
            return 'network';
        case 'permission-denied':
            return 'firestore-denied';
        case 'unavailable':
            return 'network';
    }
    return 'unknown';
}

interface Props {
    message: string;
    kind?: StorageProblemKind;
    onDismiss?: () => void;
}

const SOLUTIONS: Record<StorageProblemKind, { title: string; steps: React.ReactNode[] }> = {
    cors: {
        title: 'CORS- oder Netzwerk-Fehler',
        steps: [
            <>
                <strong>Bucket-Namen prüfen:</strong> In <code>.env.local</code> sollte
                {' '}<code>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code> auf den Bucket zeigen, für den
                Firebase Storage tatsächlich initialisiert ist (z. B.{' '}
                <code>sicherpro-wachschutz.firebasestorage.app</code>, NICHT{' '}
                <code>sicherpro-wachschutz.appspot.com</code>).
            </>,
            <>Nach Änderung <code>npm run dev</code> neu starten und Browser-Hard-Refresh (Strg+F5).</>,
            <>Internet-Verbindung prüfen — bei VPN/Proxy auch dort testen.</>,
        ],
    },
    unauthorized: {
        title: 'Keine Berechtigung (Storage-Rules)',
        steps: [
            <>
                Storage-Rules deployen:{' '}
                <code>npm run deploy:rules storage</code>
            </>,
            <>
                Admin-Custom-Claim prüfen — die Rules erfordern
                {' '}<code>request.auth.token.admin == true</code>.
            </>,
            <>Falls du Owner bist: Ausloggen + neu einloggen (Bootstrap setzt Claim).</>,
        ],
    },
    unauthenticated: {
        title: 'Nicht angemeldet',
        steps: [
            <>Session abgelaufen — bitte neu einloggen.</>,
            <>Falls das Problem bleibt: Browser-Cookies löschen und erneut anmelden.</>,
        ],
    },
    'bucket-not-found': {
        title: 'Storage-Bucket nicht gefunden',
        steps: [
            <>
                Firebase-Console öffnen → Storage → „Get started“ um den Bucket zu initialisieren.
            </>,
            <>
                <code>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code> in <code>.env.local</code> auf den
                tatsächlichen Bucket-Namen setzen.
            </>,
        ],
    },
    'quota-exceeded': {
        title: 'Storage-Kontingent überschritten',
        steps: [
            <>Firebase-Console → Plans → Auf Blaze (Pay-as-you-go) upgraden, oder</>,
            <>Alte/ungenutzte Dateien aus dem Bucket löschen, um Platz zu schaffen.</>,
        ],
    },
    billing: {
        title: 'HTTP 402 – Bezahl- oder Quota-Problem',
        steps: [
            <>
                <strong>Wahrscheinlichste Ursache:</strong> tägliches Spark-Plan-Limit überschritten
                (1 GB Download pro Tag). Das Limit setzt sich automatisch um 01:00 Uhr deutscher Zeit zurück.
            </>,
            <>
                <strong>Status prüfen:</strong>{' '}
                <a
                    href="https://console.firebase.google.com/project/_/usage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                >
                    Firebase Console → Usage and billing
                </a>{' '}
                — siehe heutiger Storage-Download.
            </>,
            <>
                <strong>Billing-Konto:</strong>{' '}
                <a
                    href="https://console.cloud.google.com/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                >
                    Google Cloud Billing
                </a>{' '}
                — Status muss „Active“ sein, Zahlungsmethode gültig.
            </>,
            <>
                <strong>Dauerhafte Lösung:</strong> Auf Blaze-Plan upgraden. Die ersten 5 GB Storage
                und 1 GB Download/Tag bleiben weiterhin <strong>kostenlos</strong> — du zahlst nur
                ab dem Moment, in dem du über das Free-Tier-Limit kommst.
            </>,
            <>
                Falls Budget-Cap konfiguriert wurde: Cloud Console → Billing → Budgets &amp; Alerts.
            </>,
        ],
    },
    network: {
        title: 'Netzwerk-Problem',
        steps: [
            <>Internet-Verbindung prüfen.</>,
            <>Firewall/AntiVirus: blockiert ggf. <code>*.googleapis.com</code>.</>,
            <>VPN deaktivieren und erneut versuchen.</>,
        ],
    },
    'firestore-denied': {
        title: 'Firestore lehnt Zugriff ab',
        steps: [
            <>
                Rules deployen: <code>npm run deploy:rules firestore</code>
            </>,
            <>Admin-Claim prüfen — siehe Banner oben auf der Anfragen-Seite.</>,
        ],
    },
    unknown: {
        title: 'Unbekannter Fehler',
        steps: [
            <>Browser-Konsole (F12) öffnen — dort steht der technische Fehler.</>,
            <>Seite neu laden und erneut versuchen.</>,
            <>Falls das Problem bleibt, den Fehlertext kopieren und melden.</>,
        ],
    },
};

export default function StorageErrorBanner({ message, kind = 'unknown', onDismiss }: Props) {
    const solution = SOLUTIONS[kind];

    return (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-red-800">{solution.title}</p>
                    <p className="text-sm text-red-700 mt-1 break-words">{message}</p>

                    <div className="mt-4 bg-white/60 rounded-lg p-4">
                        <p className="text-xs font-semibold text-red-800 mb-2">So beheben Sie das:</p>
                        <ol className="list-decimal pl-5 text-sm text-red-900 space-y-2">
                            {solution.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-400 hover:text-red-700 p-1 shrink-0"
                        aria-label="Schließen"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
