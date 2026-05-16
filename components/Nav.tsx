'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

interface NavProps {
    isScrolled: boolean;
}

const SERVICES = [
    { slug: 'objektschutz', title: 'Objektschutz', desc: 'Schutz von Gebäuden & Anlagen' },
    { slug: 'veranstaltungsschutz', title: 'Veranstaltungsschutz', desc: 'Sicherheit für Events' },
    { slug: 'personenschutz', title: 'Personenschutz', desc: 'Schutz von Personen & VIPs' },
    { slug: 'mobiler-wachdienst-revierkontrollen', title: 'Mobiler Wachdienst & Revierkontrollen', desc: 'Flexible Kontrollfahrten & Präsenz' },
    { slug: 'brandwache', title: 'Brandwache', desc: 'Schutz vor Brandgefahren & Feuerkontrolle' },
    { slug: 'baustellenbewachung', title: 'Baustellenbewachung', desc: 'Schutz von Baustellen & Material' },
    { slug: 'bewachung-von-unterkuenften', title: 'Bewachung von Unterkünften', desc: 'Ordnung & Sicherheit in Unterkünften' },
];

export default function Nav({ isScrolled }: NavProps) {
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const { images, loading } = useWebsiteImages();
    const logoUrl = images.home_logo || '/logo-transparent.svg';
    const dropdownRef = useRef<HTMLLIElement>(null);

    const navTextClass = isScrolled
        ? 'text-[#3A3A3A] hover:text-[#587D85]'
        : 'text-white hover:text-[#587D85]';
    const hamburgerColor = isScrolled || mobileOpen ? 'text-[#3A3A3A]' : 'text-white';

    // Desktop-Dropdown: Outside-Click + ESC
    useEffect(() => {
        if (!servicesOpen) return;
        const onClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setServicesOpen(false);
            }
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setServicesOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
        };
    }, [servicesOpen]);

    // Mobile-Menu: ESC schließt + Body-Scroll-Lock bei offenem Menü
    useEffect(() => {
        if (!mobileOpen) return;
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', onEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const closeMobile = () => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
    };

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-[#D9DEDF]/95 backdrop-blur-md shadow-xl'
                    : 'bg-transparent'
            }`}
        >
            {/* ================= TOP BAR ================= */}
            <div className="bg-[#587D85] text-white py-2 sm:py-3 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-1 sm:gap-6 lg:gap-8 text-xs sm:text-sm">
                    <a href="tel:+4915755537863" className="hover:text-[#D9DEDF] transition whitespace-nowrap">
                        01575 - 5537863
                    </a>
                    <a href="mailto:info@sicherpro.de" className="hover:text-[#D9DEDF] transition whitespace-nowrap">
                        info@sicherpro.de
                    </a>
                </div>
            </div>

            {/* ================= MAIN NAV ================= */}
            <nav className="py-3 sm:py-5 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

                    {/* Logo */}
                    <Link href="/" className="shrink-0" onClick={closeMobile}>
                        {loading ? (
                            <div className="w-[110px] sm:w-[150px] h-[40px] sm:h-[50px] bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <img
                                src={logoUrl}
                                alt="SicherPro Wachschutz GmbH"
                                className="h-[40px] sm:h-[50px] w-auto object-contain"
                            />
                        )}
                    </Link>

                    {/* ================= DESKTOP MENU ================= */}
                    <ul className="hidden lg:flex items-center gap-6 xl:gap-10 relative">

                        <li>
                            <Link href="/" className={`${navTextClass} font-medium transition`}>
                                Startseite
                            </Link>
                        </li>

                        {/* ===== DESKTOP SERVICES DROPDOWN ===== */}
                        <li className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setServicesOpen((prev) => !prev)}
                                aria-expanded={servicesOpen}
                                aria-haspopup="menu"
                                className={`flex items-center gap-2 font-medium transition ${navTextClass}`}
                            >
                                Dienstleistungen
                                <svg
                                    className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            <div
                                role="menu"
                                className={`
                                    absolute top-full mt-4 lg:mt-6
                                    left-1/2 -translate-x-1/2
                                    w-[min(95vw,960px)]
                                    bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#B2B2AC]/20
                                    transition-all duration-300 origin-top
                                    ${
                                        servicesOpen
                                            ? 'opacity-100 translate-y-0 scale-100'
                                            : 'opacity-0 pointer-events-none -translate-y-4 scale-95'
                                    }
                                `}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 lg:p-8 max-h-[70vh] overflow-y-auto">
                                    {SERVICES.map((s) => (
                                        <Link
                                            key={s.slug}
                                            href={`/dienstleistungen/${s.slug}`}
                                            onClick={() => setServicesOpen(false)}
                                            className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                        >
                                            <h4 className="text-base sm:text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                                {s.title}
                                            </h4>
                                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#3A3A3A]/70">
                                                {s.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </li>

                        <li>
                            <Link href="/ueber-uns" className={`${navTextClass} font-medium transition`}>
                                Über uns
                            </Link>
                        </li>
                        <li>
                            <Link href="/kontakt" className={`${navTextClass} font-medium transition`}>
                                Kontakt
                            </Link>
                        </li>
                    </ul>

                    {/* ================= MOBILE BUTTON ================= */}
                    <button
                        className="lg:hidden p-2 -mr-2"
                        aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((prev) => !prev)}
                    >
                        <svg
                            className={`w-7 h-7 transition-colors ${hamburgerColor}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/30 z-40"
                        onClick={closeMobile}
                        aria-hidden="true"
                    />
                    {/* Panel */}
                    <div className="lg:hidden bg-white border-t border-[#B2B2AC]/20 shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto relative z-50">
                        <ul className="flex flex-col p-5 sm:p-6 space-y-1">

                            <li>
                                <Link
                                    href="/"
                                    onClick={closeMobile}
                                    className="block py-3 text-lg font-medium text-[#3A3A3A] hover:text-[#587D85] transition"
                                >
                                    Startseite
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={() => setMobileServicesOpen((p) => !p)}
                                    aria-expanded={mobileServicesOpen}
                                    className="w-full flex justify-between items-center py-3 text-lg font-medium text-[#3A3A3A] hover:text-[#587D85] transition"
                                >
                                    Dienstleistungen
                                    <svg
                                        className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        mobileServicesOpen ? 'max-h-[600px]' : 'max-h-0'
                                    }`}
                                >
                                    <div className="pl-4 py-2 flex flex-col space-y-1 border-l-2 border-[#587D85]/30">
                                        {SERVICES.map((s) => (
                                            <Link
                                                key={s.slug}
                                                href={`/dienstleistungen/${s.slug}`}
                                                onClick={closeMobile}
                                                className="block py-2 text-base text-[#3A3A3A] hover:text-[#587D85] transition"
                                            >
                                                {s.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>

                            <li>
                                <Link
                                    href="/ueber-uns"
                                    onClick={closeMobile}
                                    className="block py-3 text-lg font-medium text-[#3A3A3A] hover:text-[#587D85] transition"
                                >
                                    Über uns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kontakt"
                                    onClick={closeMobile}
                                    className="block py-3 text-lg font-medium text-[#3A3A3A] hover:text-[#587D85] transition"
                                >
                                    Kontakt
                                </Link>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
