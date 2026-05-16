'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Datenschutz() {
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
                        Datenschutzerklärung
                    </motion.h1>

                    <motion.div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl space-y-8 sm:space-y-10 text-base sm:text-lg leading-relaxed">

                        <p className="text-sm text-[#6B7280] italic">
                            Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}
                        </p>

                        {/* 1 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">1. Verantwortlicher</h2>
                            <p>
                                Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                            </p>
                            <p className="mt-4">
                                <strong>SicherPro Wachschutz GmbH</strong><br />
                                Ruhrorterstraße 56<br />
                                47059 Duisburg<br />
                                Deutschland
                            </p>
                            <p className="mt-4">
                                Telefon: <a href="tel:+4915755537863" className="text-[#587D85] hover:underline">+49 (0) 1575 - 5537863</a><br />
                                E-Mail: <a href="mailto:info@sicherpro.de" className="text-[#587D85] hover:underline">info@sicherpro.de</a>
                            </p>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
                            <p>
                                Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer
                                funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung erfolgt nur
                                aufgrund gesetzlicher Bestimmungen oder einer ausdrücklichen Einwilligung.
                            </p>
                            <p className="mt-4">Rechtsgrundlagen sind insbesondere:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Art. 6 Abs. 1 lit. a DSGVO – Einwilligung</li>
                                <li>Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung und vorvertragliche Maßnahmen</li>
                                <li>Art. 6 Abs. 1 lit. c DSGVO – rechtliche Verpflichtung</li>
                                <li>Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse</li>
                            </ul>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">3. Bereitstellung der Website und Server-Logfiles</h2>
                            <p>
                                Beim Aufruf unserer Website werden durch unseren Hosting-Anbieter automatisch Informationen erfasst, die Ihr
                                Browser an unseren Server übermittelt. Dies sind insbesondere:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>IP-Adresse des anfragenden Endgeräts</li>
                                <li>Datum und Uhrzeit der Anfrage</li>
                                <li>Aufgerufene URL und übertragene Datenmenge</li>
                                <li>Browsertyp, Browserversion und Betriebssystem</li>
                                <li>Referrer-URL (zuvor besuchte Seite)</li>
                            </ul>
                            <p className="mt-4">
                                Diese Daten werden zur technischen Bereitstellung, Sicherheit und Stabilität der Website verarbeitet
                                (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
                            </p>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">4. Cookies</h2>
                            <p>
                                Unsere Website verwendet nur technisch notwendige Cookies, die für den Betrieb der Seite zwingend erforderlich
                                sind (Art. 6 Abs. 1 lit. f DSGVO). Dazu zählen insbesondere Session-Cookies für den geschützten Verwaltungsbereich.
                                Diese Cookies werden gelöscht, sobald Sie sich abmelden oder Ihren Browser schließen.
                            </p>
                            <p className="mt-4">
                                Tracking- oder Marketing-Cookies setzen wir nicht ein. Sie können in den Einstellungen Ihres Browsers das
                                Setzen von Cookies generell unterbinden. Dies kann die Funktionsfähigkeit der Website einschränken.
                            </p>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">5. Kontaktformular und E-Mail-Kontakt</h2>
                            <p>
                                Wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren, werden die folgenden personenbezogenen
                                Daten verarbeitet:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Name</li>
                                <li>E-Mail-Adresse</li>
                                <li>Telefonnummer (optional)</li>
                                <li>Inhalt Ihrer Nachricht</li>
                                <li>IP-Adresse und Zeitstempel der Absendung (zur Missbrauchsprävention)</li>
                            </ul>
                            <p className="mt-4">
                                Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage auf Grundlage Ihrer Einwilligung
                                (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Durchführung vorvertraglicher Maßnahmen
                                (Art. 6 Abs. 1 lit. b DSGVO).
                            </p>
                            <p className="mt-4">
                                Ihre Daten werden gelöscht, sobald sie für die Erreichung des Zwecks nicht mehr erforderlich sind,
                                spätestens jedoch nach Ablauf gesetzlicher Aufbewahrungsfristen. Zwingende gesetzliche Bestimmungen –
                                insbesondere handels- und steuerrechtliche Aufbewahrungsfristen – bleiben unberührt.
                            </p>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">6. Hosting und technische Dienstleister</h2>
                            <p>
                                Unsere Website wird bei einem externen Dienstleister gehostet. Die im Rahmen der Nutzung dieser Website
                                erhobenen Daten werden auf den Servern dieses Anbieters gespeichert. Ein Auftragsverarbeitungsvertrag
                                (Art. 28 DSGVO) wurde abgeschlossen.
                            </p>
                            <p className="mt-4">
                                Für die Speicherung von Kontaktanfragen sowie die Authentifizierung unserer Verwaltungsmitarbeitenden
                                nutzen wir Firebase-Dienste (Cloud Firestore, Firebase Authentication, Cloud Storage) der Google Ireland
                                Limited, Gordon House, Barrow Street, Dublin 4, Irland. Daten können dabei in Rechenzentren innerhalb
                                und außerhalb der EU/des EWR verarbeitet werden. Für Übermittlungen in Drittländer bestehen geeignete
                                Garantien gemäß Art. 46 DSGVO (Standardvertragsklauseln).
                            </p>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">7. Schriftarten</h2>
                            <p>
                                Diese Website verwendet die Schriftart „Geist“, die lokal von unserem Server ausgeliefert wird.
                                Es findet keine Verbindung zu externen Schriftart-Servern (z. B. Google Fonts CDN) statt. Ihre IP-Adresse
                                wird hierbei nicht an Dritte übermittelt.
                            </p>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">8. Datensicherheit</h2>
                            <p>
                                Wir treffen technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder
                                vorsätzliche Manipulation, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen.
                                Die Übertragung Ihrer Daten erfolgt über eine verschlüsselte SSL/TLS-Verbindung (HTTPS).
                            </p>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">9. Rechte der betroffenen Person</h2>
                            <p>Sie haben jederzeit folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                                <li>Recht auf Löschung („Recht auf Vergessenwerden“, Art. 17 DSGVO)</li>
                                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                                <li>Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO)</li>
                                <li>Recht auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
                            </ul>
                            <p className="mt-4">
                                Zur Ausübung dieser Rechte genügt eine formlose Mitteilung an
                                {' '}<a href="mailto:info@sicherpro.de" className="text-[#587D85] hover:underline">info@sicherpro.de</a>.
                            </p>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">10. Beschwerderecht bei der Aufsichtsbehörde</h2>
                            <p>
                                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
                                personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO). Für die SicherPro Wachschutz GmbH zuständig ist:
                            </p>
                            <p className="mt-4">
                                Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen<br />
                                Kavalleriestraße 2–4<br />
                                40213 Düsseldorf<br />
                                Telefon: 0211/38424-0<br />
                                E-Mail: poststelle@ldi.nrw.de
                            </p>
                        </section>

                        {/* 11 */}
                        <section>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#587D85]">11. Aktualität und Änderungen dieser Datenschutzerklärung</h2>
                            <p>
                                Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer Website oder aufgrund
                                geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu
                                ändern. Die jeweils aktuelle Fassung finden Sie jederzeit auf dieser Seite.
                            </p>
                        </section>

                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
