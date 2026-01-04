'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

interface NavProps {
    isScrolled: boolean;
}

export default function Nav({ isScrolled }: NavProps) {
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const { images, loading } = useWebsiteImages();
    const logoUrl = images.home_logo || '/logo-transparent.svg';

    const navTextClass = isScrolled
        ? 'text-[#3A3A3A] hover:text-[#587D85]'
        : 'text-white hover:text-[#587D85]';

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-[#D9DEDF]/95 backdrop-blur-md shadow-xl'
                    : 'bg-transparent'
            }`}
        >
            {/* ================= TOP BAR ================= */}
            <div className="bg-[#587D85] text-white py-3 px-6">
                <div className="max-w-7xl mx-auto flex justify-end space-x-8 text-sm">
                    <a href="tel:+49015755537863">01575 - 5537863</a>
                    <a href="mailto:info@sicherpro.de">info@sicherpro.de</a>
                </div>
            </div>

            {/* ================= MAIN NAV ================= */}
            <nav className="py-5 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    {/* Logo – jetzt dynamisch */}
                    <Link href="/">
                        {loading ? (
                            <div className="w-[150px] h-[50px] bg-gray-200 animate-pulse rounded" />
                        ) : (
                            <img
                                src={logoUrl}
                                alt="SicherPro Wachschutz GmbH"
                                className="h-[50px] w-auto object-contain"
                            />
                        )}
                    </Link>

                    {/* ================= DESKTOP MENU ================= */}
                    <ul className="hidden lg:flex items-center space-x-10 relative">

                        <li>
                            <Link href="/" className={`${navTextClass} font-medium transition  `}>
                                Startseite
                            </Link>
                        </li>

                        {/* ===== DESKTOP SERVICES DROPDOWN ===== */}
                        <li className="relative">
                            <button
                                type="button"
                                onClick={() => setServicesOpen(prev => !prev)}
                                aria-expanded={servicesOpen}
                                className={`flex items-center gap-2 font-medium transition ${navTextClass}`}
                            >
                                Dienstleistungen
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        servicesOpen ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`
                                    absolute top-full mt-6
                                    left-1/2 -translate-x-1/2
                                    w-[90vw] max-w-[960px]
                                    bg-white rounded-3xl shadow-2xl border border-secondary/20
                                    transition-all duration-300
                                    ${
                                    servicesOpen
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 pointer-events-none -translate-y-4'
                                }
                                `}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-8">

                                    <Link
                                        href="/dienstleistungen/objektschutz"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Objektschutz
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Schutz von Gebäuden & Anlagen
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/veranstaltungsschutz"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Veranstaltungsschutz
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Sicherheit für Events
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/personenschutz"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Personenschutz
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Schutz von Personen & VIPs
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/mobiler-wachdienst-revierkontrollen"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Mobiler Wachdienst & Revierkontrollen
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Flexible Kontrollfahrten & Präsenz
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/brandwache"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Brandwache
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Schutz vor Brandgefahren & Feuerkontrolle
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/baustellenbewachung"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Baustellenbewachung
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Schutz von Baustellen & Material
                                        </p>
                                    </Link>

                                    <Link
                                        href="/dienstleistungen/bewachung-von-unterkuenften"
                                        className="group p-6 rounded-2xl hover:bg-[#D9DEDF]/50 transition-colors duration-300"
                                    >
                                        <h4 className="text-lg font-semibold text-[#3A3A3A] group-hover:text-[#587D85]">
                                            Bewachung von Unterkünften
                                        </h4>
                                        <p className="mt-2 text-sm text-[#3A3A3A]/70">
                                            Ordnung & Sicherheit in Unterkünften
                                        </p>
                                    </Link>

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
                        className="lg:hidden"
                        onClick={() => setMobileOpen(prev => !prev)}
                    >
                        <svg
                            className="w-7 h-7 text-[#3A3A3A]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t border-secondary/20 shadow-xl">
                    <ul className="flex flex-col p-6 space-y-5">

                        <Link href="/" className="text-lg font-medium text-dark">
                            Startseite
                        </Link>

                        <button
                            onClick={() => setMobileServicesOpen(prev => !prev)}
                            className="flex justify-between items-center text-lg font-medium text-dark"
                        >
                            Dienstleistungen
                            <svg
                                className={`w-4 h-4 transition-transform ${
                                    mobileServicesOpen ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {mobileServicesOpen && (
                            <div className="pl-4 flex flex-col space-y-3 text-[#3A3A3A]">
                                <Link href="/dienstleistungen/objektschutz">Objektschutz</Link>
                                <Link href="/dienstleistungen/veranstaltungsschutz">Veranstaltungsschutz</Link>
                                <Link href="/dienstleistungen/personenschutz">Personenschutz</Link>
                                <Link href="/dienstleistungen/mobiler-wachdienst-revierkontrollen">
                                    Mobiler Wachdienst & Revierkontrollen
                                </Link>
                                <Link href="/dienstleistungen/brandwache">Brandwache</Link>
                                <Link href="/dienstleistungen/baustellenbewachung">Baustellenbewachung</Link>
                                <Link href="/dienstleistungen/bewachung-von-unterkuenften">
                                    Bewachung von Unterkünften
                                </Link>
                            </div>
                        )}


                        <Link href="/ueber-uns" className="text-lg font-medium text-dark">
                            Über uns
                        </Link>

                        <Link href="/kontakt" className="text-lg font-medium text-dark">
                            Kontakt
                        </Link>
                    </ul>
                </div>
            )}
        </div>
    );
}
