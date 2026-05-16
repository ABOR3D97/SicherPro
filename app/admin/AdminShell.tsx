'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    HomeIcon,
    EnvelopeIcon,
    PhotoIcon,
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    GlobeAltIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';
import { ToastProvider } from '@/components/admin/Toast';

const PUBLIC_ROUTES = ['/admin/login', '/admin/register', '/admin/approve-success', '/admin/approve-error'];

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
    { href: '/admin/dashboard', label: 'Übersicht', icon: HomeIcon },
    { href: '/admin/dashboard/contact-management', label: 'Anfragen', icon: EnvelopeIcon },
    { href: '/admin/dashboard/image-management', label: 'Bilder', icon: PhotoIcon },
    { href: '/admin/dashboard/usage', label: 'Verbrauch', icon: BanknotesIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authReady, setAuthReady] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/admin/approve/');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                setUser(null);
                setAuthReady(true);
                if (!isPublic) {
                    router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
                }
                return;
            }
            // Admin-Claim verifizieren — kein blindes Vertrauen auf eingeloggten User.
            try {
                const tokenResult = await u.getIdTokenResult();
                if (tokenResult.claims.admin !== true) {
                    await signOut(auth);
                    await fetch('/api/admin/session', { method: 'DELETE' });
                    router.replace('/admin/login?error=not_admin');
                    return;
                }
            } catch {
                await signOut(auth);
                router.replace('/admin/login');
                return;
            }
            setUser(u);
            setAuthReady(true);
        });
        return () => unsub();
    }, [isPublic, pathname, router]);

    const handleLogout = async () => {
        await signOut(auth);
        await fetch('/api/admin/session', { method: 'DELETE' });
        router.push('/admin/login');
    };

    if (isPublic) {
        return <ToastProvider>{children}</ToastProvider>;
    }

    if (!authReady || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
                <div className="text-[#587D85] text-lg">Lade …</div>
            </div>
        );
    }

    return (
        <ToastProvider>

        <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 flex-col bg-[#1E293B] text-white sticky top-0 h-screen">
                <div className="px-6 py-7 border-b border-white/10">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#587D85] grid place-items-center font-bold">SP</div>
                        <div>
                            <p className="font-bold text-lg leading-tight">SicherPro</p>
                            <p className="text-xs text-white/60">Admin Panel</p>
                        </div>
                    </Link>
                </div>
                <nav className="flex-1 px-3 py-6 space-y-1">
                    {NAV.map((item) => {
                        const active =
                            pathname === item.href ||
                            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                    active ? 'bg-[#587D85] text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition"
                    >
                        <GlobeAltIcon className="w-5 h-5" />
                        <span className="font-medium">Zur Website</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <div className="px-3 py-2 text-xs text-white/50 truncate" title={user.email ?? ''}>
                        {user.email}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-red-500/20 hover:text-red-300 transition"
                    >
                        <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Abmelden</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between bg-[#1E293B] text-white px-4 py-4 sticky top-0 z-30">
                    <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold">
                        <div className="w-8 h-8 rounded-lg bg-[#587D85] grid place-items-center text-sm">SP</div>
                        SicherPro Admin
                    </Link>
                    <button
                        onClick={() => setMobileNavOpen((p) => !p)}
                        aria-label="Menü"
                        className="p-2"
                    >
                        {mobileNavOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                    </button>
                </header>

                {mobileNavOpen && (
                    <div className="lg:hidden bg-[#1E293B] text-white px-4 py-3 space-y-1 border-t border-white/10">
                        {NAV.map((item) => {
                            const active =
                                pathname === item.href ||
                                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                                        active ? 'bg-[#587D85]' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-300 hover:bg-red-500/20"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                            Abmelden
                        </button>
                    </div>
                )}

                <main className="flex-1">{children}</main>
            </div>
        </div>
        </ToastProvider>
    );
}
