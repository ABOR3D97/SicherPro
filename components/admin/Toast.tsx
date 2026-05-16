'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

type Kind = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    kind: Kind;
    msg: string;
}

interface ToastContextValue {
    show: (kind: Kind, msg: string) => void;
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;
const DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((cur) => cur.filter((t) => t.id !== id));
    }, []);

    const show = useCallback(
        (kind: Kind, msg: string) => {
            const id = nextId++;
            setToasts((cur) => [...cur, { id, kind, msg }]);
            setTimeout(() => dismiss(id), DURATION);
        },
        [dismiss],
    );

    const value: ToastContextValue = {
        show,
        success: (m) => show('success', m),
        error: (m) => show('error', m),
        info: (m) => show('info', m),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence initial={false}>
                    {toasts.map((t) => {
                        const tone =
                            t.kind === 'success'
                                ? 'bg-emerald-600'
                                : t.kind === 'error'
                                    ? 'bg-red-600'
                                    : 'bg-slate-700';
                        const Icon =
                            t.kind === 'success'
                                ? CheckCircleIcon
                                : t.kind === 'error'
                                    ? ExclamationTriangleIcon
                                    : InformationCircleIcon;
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                className={`pointer-events-auto ${tone} text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-md`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium flex-1">{t.msg}</span>
                                <button
                                    onClick={() => dismiss(t.id)}
                                    className="opacity-70 hover:opacity-100"
                                    aria-label="Schließen"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast muss innerhalb von <ToastProvider> verwendet werden');
    return ctx;
}
