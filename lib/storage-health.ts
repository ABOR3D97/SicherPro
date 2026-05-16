/**
 * Client-seitiger Health-Check für Firebase Storage:
 * macht einen HEAD-Request auf eine bekannte Image-URL und meldet zurück,
 * ob Storage Files ausliefert oder ob ein Quota-/Billing-Problem besteht.
 *
 * Wird typischerweise von Admin-Seiten beim Laden aufgerufen, um dem User
 * SOFORT zu zeigen, warum keine Bilder erscheinen — statt stiller `<img>`-Fehler.
 */
import type { StorageProblemKind } from '@/components/admin/StorageErrorBanner';

export interface StorageHealth {
    ok: boolean;
    kind?: StorageProblemKind;
    message?: string;
    httpStatus?: number;
}

export async function probeImageUrl(url: string): Promise<StorageHealth> {
    try {
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) return { ok: true, httpStatus: res.status };

        const status = res.status;
        if (status === 402) {
            return {
                ok: false,
                kind: 'billing',
                httpStatus: status,
                message:
                    'Firebase Storage gibt HTTP 402 (Payment Required) zurück. Tägliches Free-Tier-Limit erreicht oder Billing-Konto-Problem.',
            };
        }
        if (status === 401 || status === 403) {
            return {
                ok: false,
                kind: 'unauthorized',
                httpStatus: status,
                message: `HTTP ${status} – keine Berechtigung zum Lesen.`,
            };
        }
        if (status === 404) {
            return {
                ok: false,
                kind: 'bucket-not-found',
                httpStatus: status,
                message: `HTTP 404 – Datei oder Bucket nicht gefunden.`,
            };
        }
        if (status === 429) {
            return {
                ok: false,
                kind: 'quota-exceeded',
                httpStatus: status,
                message: 'HTTP 429 – Rate-Limit erreicht. Bitte später erneut versuchen.',
            };
        }
        return {
            ok: false,
            kind: 'unknown',
            httpStatus: status,
            message: `HTTP ${status} – unerwarteter Status.`,
        };
    } catch (err) {
        return {
            ok: false,
            kind: 'network',
            message: err instanceof Error ? err.message : 'Netzwerk-Fehler beim Probe-Request.',
        };
    }
}
