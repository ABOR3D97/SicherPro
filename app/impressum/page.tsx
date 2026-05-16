'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function Impressum() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            <motion.section
                className="mt-15 py-16 sm:py-24 md:py-32 px-4 sm:px-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="max-w-4xl mx-auto">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-[#3A3A3A]"
                        variants={itemVariants}
                    >
                        Impressum
                    </motion.h1>

                    <motion.div
                        className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl space-y-6 sm:space-y-8 text-base sm:text-lg leading-relaxed"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Angaben gemäß § 5 TMG</h2>
                            <p>
                                SicherPro Wachschutz GmbH<br />
                                Ruhrorterstraße 56<br />
                                47059 Duisburg<br />
                                Deutschland
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Kontakt</h2>
                            <p>
                                Telefon: <a href="tel:+4915755537863" className="hover:text-[#587D85]">+49 (0) 1575 - 5537863</a><br />
                                E-Mail: <a href="mailto:info@sicherpro.de" className="hover:text-[#587D85]">info@sicherpro.de</a>
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Vertretungsberechtigt</h2>
                            <p>
                                Geschäftsführer: Ratib Al Salih<br />
                                Registergericht: Amtsgericht Düsseldorf<br />
                                Handelsregisternummer: HRB [Nummer eintragen]
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Umsatzsteuer-ID</h2>
                            <p>
                                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                                DE [USt-IdNr. eintragen]
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">
                                Berufsrechtliche Regelungen
                            </h2>
                            <p>
                                Erlaubnis nach § 34a Gewerbeordnung (GewO) für das Bewachungsgewerbe<br />
                                Erteilt durch: [zuständige Behörde, z. B. Stadt Duisburg – Ordnungsamt]<br />
                                Bewacherregister-Identifikationsnummer (BWR-ID): [BWR-ID eintragen]
                            </p>
                            <p className="mt-4">
                                Maßgebliche berufsrechtliche Bestimmungen:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>§ 34a Gewerbeordnung (GewO)</li>
                                <li>Bewachungsverordnung (BewachV)</li>
                            </ul>
                            <p className="mt-4 text-sm text-[#6B7280]">
                                Einsehbar unter <a href="https://www.gesetze-im-internet.de/" target="_blank" rel="noopener noreferrer" className="text-[#587D85] hover:underline">gesetze-im-internet.de</a>.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">
                                Redaktionell verantwortlich (§ 18 Abs. 2 MStV)
                            </h2>
                            <p>
                                Ratib Al Salih<br />
                                Ruhrorterstraße 56<br />
                                47059 Duisburg
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Haftungsausschluss</h2>
                            <p>
                                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Haftung für Links</h2>
                            <p>
                                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">Urheberrecht</h2>
                            <p>
                                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">
                                Verbraucherstreitbeilegung / Universalschlichtungsstelle
                            </h2>
                            <p>
                                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                            </p>
                            <p className="mt-4">
                                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#587D85] hover:underline">
                                    ec.europa.eu/consumers/odr
                                </a>.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
