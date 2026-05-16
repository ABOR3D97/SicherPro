'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';

export default function AGB() {
    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            <motion.section
                className="mt-15 py-16 sm:py-24 md:py-32 px-4 sm:px-6"
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-4xl mx-auto">
                    <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 text-[#3A3A3A]">
                        Allgemeine Geschäftsbedingungen
                    </motion.h1>

                    <motion.div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl space-y-8 sm:space-y-10 text-base sm:text-lg leading-relaxed">

                        <p className="text-sm text-[#6B7280] italic">
                            Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}
                        </p>

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">1. Geltungsbereich</h2>
                            <p>
                                Die nachstehenden Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge,
                                Lieferungen und sonstige Leistungen zwischen der <strong>SicherPro Wachschutz GmbH</strong>{' '}
                                (nachfolgend „Auftragnehmer“) und ihren Kunden (nachfolgend „Auftraggeber“).
                            </p>
                            <p className="mt-4">
                                Abweichende, entgegenstehende oder ergänzende AGB des Auftraggebers werden nicht
                                Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">2. Vertragsschluss</h2>
                            <p>
                                Angebote des Auftragnehmers sind freibleibend. Ein Vertrag kommt erst durch schriftliche
                                Auftragsbestätigung oder durch Aufnahme der Leistung zustande.
                            </p>
                            <p className="mt-4">
                                Nebenabreden, Änderungen und Ergänzungen des Vertrags bedürfen zu ihrer Wirksamkeit der
                                Schriftform (Textform ausreichend, z. B. per E-Mail).
                            </p>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">3. Leistungsumfang</h2>
                            <p>
                                Art, Umfang, Ort und Zeit der zu erbringenden Bewachungsleistungen ergeben sich aus dem
                                jeweiligen Einzelvertrag bzw. der Auftragsbestätigung. Der Auftragnehmer ist berechtigt,
                                geeignete Subunternehmer einzusetzen.
                            </p>
                            <p className="mt-4">
                                Sämtliche Tätigkeiten werden im Rahmen der gewerberechtlichen Erlaubnis nach
                                § 34a Gewerbeordnung (GewO) sowie der Bewachungsverordnung (BewachV) erbracht.
                            </p>
                            <p className="mt-4">
                                Der Auftragnehmer ist nicht zur Übernahme hoheitlicher Aufgaben verpflichtet.
                                Bei Eintritt strafbarer Handlungen Dritter ist der Auftragnehmer berechtigt und verpflichtet,
                                die Polizei zu verständigen.
                            </p>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">4. Pflichten des Auftraggebers</h2>
                            <p>Der Auftraggeber stellt sicher, dass:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>dem Sicherheitspersonal ein gefahrloser Zugang zum Einsatzort gewährt wird;</li>
                                <li>alle für die Auftragsdurchführung erforderlichen Informationen, Pläne und Schlüssel
                                    rechtzeitig zur Verfügung gestellt werden;</li>
                                <li>die einsatzbezogenen sicherheitstechnischen Anlagen (z. B. Schließsysteme, Alarmanlagen,
                                    Beleuchtung) funktionsfähig sind;</li>
                                <li>besondere Gefahrenquellen und einsatzrelevante Besonderheiten vor Auftragsbeginn
                                    schriftlich mitgeteilt werden.</li>
                            </ul>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">5. Vergütung &amp; Zahlungsbedingungen</h2>
                            <p>
                                Die Vergütung richtet sich nach dem zwischen den Parteien vereinbarten Stunden- bzw.
                                Pauschalsatz zuzüglich der jeweils gültigen gesetzlichen Umsatzsteuer.
                            </p>
                            <p className="mt-4">
                                Rechnungen werden monatlich erstellt und sind, sofern nicht anders vereinbart, innerhalb
                                von <strong>14 Tagen</strong> ab Rechnungsdatum ohne Abzug zur Zahlung fällig.
                            </p>
                            <p className="mt-4">
                                Bei Zahlungsverzug gelten die gesetzlichen Verzugszinsen. Ist der Auftraggeber Unternehmer,
                                beträgt der Verzugszinssatz neun Prozentpunkte über dem Basiszinssatz (§ 288 Abs. 2 BGB);
                                ansonsten fünf Prozentpunkte über dem Basiszinssatz (§ 288 Abs. 1 BGB).
                            </p>
                            <p className="mt-4">
                                Eine Aufrechnung des Auftraggebers ist nur mit unbestrittenen oder rechtskräftig
                                festgestellten Forderungen zulässig.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">6. Vertragsdauer &amp; Kündigung</h2>
                            <p>
                                Die Vertragsdauer ergibt sich aus dem jeweiligen Einzelvertrag. Soweit nichts anderes
                                vereinbart ist, läuft der Vertrag auf unbestimmte Zeit und kann mit einer Frist von
                                <strong> drei Monaten</strong> zum Monatsende ordentlich gekündigt werden.
                            </p>
                            <p className="mt-4">
                                Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                                Kündigungen bedürfen der Schriftform.
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">7. Haftung &amp; Versicherung</h2>
                            <p>
                                Der Auftragnehmer haftet nach den gesetzlichen Bestimmungen für Schäden aus der Verletzung
                                des Lebens, des Körpers oder der Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit
                                unbeschränkt.
                            </p>
                            <p className="mt-4">
                                Bei leichter Fahrlässigkeit haftet der Auftragnehmer nur für die Verletzung wesentlicher
                                Vertragspflichten (Kardinalpflichten) und nur in Höhe des bei Vertragsschluss vorhersehbaren,
                                vertragstypischen Schadens.
                            </p>
                            <p className="mt-4">
                                Der Auftragnehmer unterhält die gesetzlich nach § 14 BewachV vorgeschriebene
                                Haftpflichtversicherung. Auf Verlangen wird dem Auftraggeber der Nachweis vorgelegt.
                            </p>
                            <p className="mt-4">
                                Schadensmeldungen sind unverzüglich, spätestens jedoch innerhalb von <strong>zwei Wochen</strong>{' '}
                                nach Bekanntwerden, schriftlich beim Auftragnehmer anzuzeigen.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">8. Verschwiegenheit &amp; Datenschutz</h2>
                            <p>
                                Der Auftragnehmer und seine Mitarbeiter sind zur Verschwiegenheit über alle ihnen im
                                Rahmen der Auftragsdurchführung bekannt gewordenen Tatsachen verpflichtet. Diese
                                Verpflichtung besteht auch nach Beendigung des Vertrags fort.
                            </p>
                            <p className="mt-4">
                                Die Verarbeitung personenbezogener Daten erfolgt im Einklang mit der Datenschutz-Grundverordnung (DSGVO).
                                Einzelheiten sind in unserer{' '}
                                <a href="/datenschutz" className="text-[#587D85] underline hover:text-[#3A3A3A]">
                                    Datenschutzerklärung
                                </a>{' '}
                                geregelt.
                            </p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">9. Höhere Gewalt</h2>
                            <p>
                                Ereignisse höherer Gewalt – einschließlich behördlich angeordneter Maßnahmen, Streiks,
                                Aussperrungen, Verkehrsstörungen und Naturkatastrophen – befreien die Parteien für die
                                Dauer der Störung von der Pflicht zur Leistung. Im Einzelfall kann der Vertrag aus wichtigem
                                Grund gekündigt werden.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">10. Schlussbestimmungen</h2>
                            <p>
                                Es gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des
                                UN-Kaufrechts (CISG).
                            </p>
                            <p className="mt-4">
                                Erfüllungsort und – soweit gesetzlich zulässig – ausschließlicher Gerichtsstand für alle
                                Streitigkeiten aus diesem Vertragsverhältnis ist <strong>Duisburg</strong>.
                            </p>
                            <p className="mt-4">
                                Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden,
                                bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt. Anstelle der unwirksamen
                                Bestimmung gilt diejenige wirksame Regelung als vereinbart, die dem wirtschaftlich
                                Gewollten am nächsten kommt.
                            </p>
                        </section>

                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
