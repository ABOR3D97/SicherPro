'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Impressum() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            {/* Hauptinhalt */}
            <motion.section className="mt-15  py-32 px-6" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="max-w-4xl mx-auto">
                    <motion.h1 className="text-6xl font-bold text-center mb-12 text-[#3A3A3A]" variants={itemVariants}>Impressum</motion.h1>
                    <motion.div className="bg-white rounded-3xl p-12 shadow-2xl space-y-8 text-lg leading-relaxed" variants={containerVariants}>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Angaben gemäß § 5 TMG</h2>
                            <p>SicherPro Wachschutz GmbH<br />
                                Ruhrorterstraße 56<br />
                                47059 Duisburg</p>
                            <br />
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Kontakt</h2>
                            <p>Telefon: +49 (0) 1575 - 5537863<br/>
                                E-Mail: info@sicherpro.de</p>
                        </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Vertretungsberechtigt</h2>
                            <p>Geschäftsführer: Ratib Al Salih<br />
                                Registergericht: Amtsgericht Düsseldorf<br />
                                Handelsregisternummer: HRB [Nummer]</p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Haftungsausschluss</h2>
                            <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Haftung für Links</h2>
                            <p>
                                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Unser Recht auf Änderung der Richtlinien mit Ankündigung</h2>
                            <p>
                                Wir behalten uns das Recht vor, jederzeit diese Richtlinien unter Beachtung der datenschutzrechtlichen Vorgaben zu ändern.
                            </p>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Verbraucherstreitbeilegung/Universalschlichtungsstelle
                            </h2>
                            <p>
                                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

                            </p>
                        </motion.div>
                    </motion.div>

                </div>
            </motion.section>

            {/* Footer */}
            <Footer />
        </main>
    );
}