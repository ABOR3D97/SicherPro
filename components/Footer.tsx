'use client';

import React from 'react';
import Link from 'next/link';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

export default function Footer() {
    const { images, loading } = useWebsiteImages();

    // gleiches Logo wie im Nav
    const logoUrl = images.home_logo || '/logo-transparent.svg';

    return (
        <footer className="bg-[#3A3A3A] text-white py-16 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

                {/* ================= LOGO + TEXT ================= */}
                <div>
                    {loading ? (
                        <div className="h-12 w-[150px] bg-white/10 animate-pulse rounded mb-6" />
                    ) : (
                        <img
                            src={logoUrl}
                            alt="SicherPro Wachschutz GmbH"
                            className="h-12 w-auto mb-6 object-contain"
                        />
                    )}

                    <p className="text-[#B2B2AC] leading-relaxed">
                        Ihr zuverlässiger Partner für professionelle Sicherheitslösungen in Deutschland.
                    </p>
                </div>

                {/* ================= SERVICES ================= */}
                <div>
                    <h4 className="text-xl font-bold mb-6 text-[#587D85]">Dienstleistungen</h4>
                    <ul className="space-y-3 text-[#B2B2AC]">
                        <li>
                            <Link href="/dienstleistungen/objektschutz" className="hover:text-white transition-colors">
                                Objektschutz
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/veranstaltungsschutz" className="hover:text-white transition-colors">
                                Veranstaltungsschutz
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/personenschutz" className="hover:text-white transition-colors">
                                Personenschutz
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/mobiler-wachdienst-revierkontrollen" className="hover:text-white transition-colors">
                                Mobiler Wachdienst & Revierkontrollen
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/brandwache" className="hover:text-white transition-colors">
                                Brandwache
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/baustellenbewachung" className="hover:text-white transition-colors">
                                Baustellenbewachung
                            </Link>
                        </li>
                        <li>
                            <Link href="/dienstleistungen/bewachung-von-unterkuenften" className="hover:text-white transition-colors">
                                Bewachung von Unterkünften
                            </Link>
                        </li>

                    </ul>
                </div>

                {/* ================= LEGAL ================= */}
                <div>
                    <h4 className="text-xl font-bold mb-6 text-[#587D85]">Rechtliches</h4>
                    <ul className="space-y-3 text-[#B2B2AC]">
                        <li>
                            <Link href="/impressum" className="hover:text-white transition-colors">
                                Impressum
                            </Link>
                        </li>
                        <li>
                            <Link href="/datenschutz" className="hover:text-white transition-colors">
                                Datenschutz
                            </Link>
                        </li>
                        <li>
                            <Link href="/agb" className="hover:text-white transition-colors">
                                AGB
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* ================= CONTACT ================= */}
                <div>
                    <h4 className="text-xl font-bold mb-6 text-[#587D85]">Kontakt</h4>
                    <p className="text-[#B2B2AC] mb-2">
                        Ruhrorterstraße 56<br />
                        47059 Duisburg
                    </p>
                    <p className="text-[#B2B2AC] mb-2">Tel: 01575 - 5537863</p>
                    <p className="text-[#B2B2AC]">E-Mail: info@sicherpro.de</p>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#B2B2AC]/30 text-center text-[#B2B2AC]">
                © 2026 SicherPro Wachschutz GmbH. Alle Rechte vorbehalten.
            </div>
        </footer>
    );
}
