'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BuildingOfficeIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/components/admin/Toast';

export interface ExternalService {
    id: string;
    name: string;
    provider: string;
    cost: number;
    currency: string;
    period: 'month' | 'year' | 'once';
    renewalDate: string | null; // YYYY-MM-DD
    notes: string;
}

const PERIOD_LABEL: Record<ExternalService['period'], string> = {
    month: 'pro Monat',
    year: 'pro Jahr',
    once: 'einmalig',
};

function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysUntil(dateStr: string | null): number | null {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    if (Number.isNaN(target.getTime())) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(v: number, currency: string) {
    try {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(v);
    } catch {
        return `${v.toFixed(2)} ${currency}`;
    }
}

function emptyDraft(): ExternalService {
    return {
        id: uid(),
        name: '',
        provider: '',
        cost: 0,
        currency: 'EUR',
        period: 'year',
        renewalDate: null,
        notes: '',
    };
}

export default function ExternalServicesSection() {
    const [services, setServices] = useState<ExternalService[]>([]);
    const [authReady, setAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<ExternalService | null>(null);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    // Daten laden sobald User da ist.
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            setAuthReady(true);
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const snap = await getDoc(doc(db, 'config', 'externalCosts'));
                if (snap.exists()) {
                    const data = snap.data() as { services?: ExternalService[] };
                    setServices(data.services || []);
                }
                setError(null);
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const persist = useCallback(
        async (next: ExternalService[]) => {
            setSaving(true);
            try {
                await setDoc(doc(db, 'config', 'externalCosts'), { services: next });
                setServices(next);
                return true;
            } catch (e) {
                console.error(e);
                toast.error(`Speichern fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`);
                return false;
            } finally {
                setSaving(false);
            }
        },
        [toast],
    );

    const handleSave = async () => {
        if (!editing) return;
        if (!editing.name.trim()) {
            toast.error('Name ist erforderlich.');
            return;
        }
        if (editing.cost < 0 || Number.isNaN(editing.cost)) {
            toast.error('Kosten müssen eine positive Zahl sein.');
            return;
        }
        const next = services.some((s) => s.id === editing.id)
            ? services.map((s) => (s.id === editing.id ? editing : s))
            : [...services, editing];

        const ok = await persist(next);
        if (ok) {
            setEditing(null);
            toast.success('Gespeichert.');
        }
    };

    const handleDelete = async (id: string) => {
        const s = services.find((x) => x.id === id);
        if (!s) return;
        if (!confirm(`„${s.name}" wirklich löschen?`)) return;
        const ok = await persist(services.filter((x) => x.id !== id));
        if (ok) toast.success('Gelöscht.');
    };

    // Summen
    const monthlyTotal = services.reduce((acc, s) => {
        if (s.period === 'month') return acc + s.cost;
        if (s.period === 'year') return acc + s.cost / 12;
        return acc;
    }, 0);
    const yearlyTotal = services.reduce((acc, s) => {
        if (s.period === 'month') return acc + s.cost * 12;
        if (s.period === 'year') return acc + s.cost;
        return acc;
    }, 0);
    const oneTimeTotal = services.reduce(
        (acc, s) => (s.period === 'once' ? acc + s.cost : acc),
        0,
    );

    if (!authReady || loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <p className="text-slate-500">Lade externe Dienste …</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-[#587D85]" />
                    Externe Dienste &amp; Kosten
                </h2>
                <button
                    onClick={() => setEditing(emptyDraft())}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#587D85] text-white rounded-xl text-sm font-medium hover:bg-[#3A3A3A]"
                >
                    <PlusIcon className="w-4 h-4" />
                    Hinzufügen
                </button>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    {error}
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                    Noch keine externen Dienste eingetragen. <br />
                    Klicke auf <strong>„Hinzufügen“</strong>, um z. B. deine IONOS-Domain oder Vercel-Hosting zu erfassen.
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                    <th className="py-2">Name</th>
                                    <th className="py-2 hidden md:table-cell">Anbieter</th>
                                    <th className="py-2 text-right">Kosten</th>
                                    <th className="py-2">Verlängerung</th>
                                    <th className="py-2 text-right">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {services.map((s) => {
                                    const days = daysUntil(s.renewalDate);
                                    const renewalUrgent = days !== null && days <= 30;
                                    const renewalSoon = days !== null && days > 30 && days <= 90;

                                    return (
                                        <tr key={s.id}>
                                            <td className="py-3">
                                                <p className="font-semibold text-[#1E293B]">{s.name}</p>
                                                {s.notes && (
                                                    <p className="text-xs text-slate-500 mt-0.5">{s.notes}</p>
                                                )}
                                            </td>
                                            <td className="py-3 text-slate-600 hidden md:table-cell">{s.provider || '–'}</td>
                                            <td className="py-3 text-right whitespace-nowrap">
                                                <p className="font-semibold text-[#1E293B]">
                                                    {formatCurrency(s.cost, s.currency)}
                                                </p>
                                                <p className="text-xs text-slate-500">{PERIOD_LABEL[s.period]}</p>
                                            </td>
                                            <td className="py-3">
                                                {s.renewalDate ? (
                                                    <div
                                                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                                                            renewalUrgent
                                                                ? 'bg-red-100 text-red-700'
                                                                : renewalSoon
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {renewalUrgent ? (
                                                            <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <ClockIcon className="w-3.5 h-3.5" />
                                                        )}
                                                        <span>
                                                            {new Date(s.renewalDate).toLocaleDateString('de-DE')}
                                                            {days !== null && (
                                                                <>
                                                                    {' '}({days >= 0 ? `in ${days} T.` : `vor ${-days} T. ABGELAUFEN`})
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">–</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => setEditing({ ...s })}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#587D85]"
                                                        title="Bearbeiten"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                        title="Löschen"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summen */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Monatlich</p>
                            <p className="text-2xl font-bold text-[#1E293B] mt-1">
                                {formatCurrency(monthlyTotal, 'EUR')}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Jährlich</p>
                            <p className="text-2xl font-bold text-[#1E293B] mt-1">
                                {formatCurrency(yearlyTotal, 'EUR')}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Einmalig (Summe)</p>
                            <p className="text-2xl font-bold text-[#1E293B] mt-1">
                                {formatCurrency(oneTimeTotal, 'EUR')}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Edit-Modal */}
            {editing && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => !saving && setEditing(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-[#1E293B]">
                                {services.some((s) => s.id === editing.id) ? 'Dienst bearbeiten' : 'Neuen Dienst'}
                            </h3>
                            <button
                                onClick={() => !saving && setEditing(null)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    placeholder="z. B. Domain sicherpro.de"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Anbieter</label>
                                <input
                                    type="text"
                                    value={editing.provider}
                                    onChange={(e) => setEditing({ ...editing, provider: e.target.value })}
                                    placeholder="z. B. IONOS / Vercel / Strato"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kosten</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editing.cost}
                                        onChange={(e) => setEditing({ ...editing, cost: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Währung</label>
                                    <select
                                        value={editing.currency}
                                        onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none bg-white"
                                    >
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="CHF">CHF</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Periode</label>
                                <select
                                    value={editing.period}
                                    onChange={(e) =>
                                        setEditing({ ...editing, period: e.target.value as ExternalService['period'] })
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none bg-white"
                                >
                                    <option value="month">monatlich</option>
                                    <option value="year">jährlich</option>
                                    <option value="once">einmalig</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Verlängerungs-/Ablaufdatum</label>
                                <input
                                    type="date"
                                    value={editing.renewalDate || ''}
                                    onChange={(e) => setEditing({ ...editing, renewalDate: e.target.value || null })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Bei &lt; 30 Tagen: rote Warnung. Bei &lt; 90 Tagen: gelbe Erinnerung.
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Hinweise (optional)</label>
                                <textarea
                                    rows={2}
                                    value={editing.notes}
                                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                                    placeholder="z. B. Tarif, Kundennummer, Login-Hinweise …"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#587D85] outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="px-5 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-2">
                            <button
                                onClick={() => setEditing(null)}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-[#587D85] text-white font-medium hover:bg-[#3A3A3A] disabled:opacity-50"
                            >
                                {saving ? 'Speichere …' : 'Speichern'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
