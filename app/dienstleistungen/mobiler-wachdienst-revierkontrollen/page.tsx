'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.15,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function MobilerWachdienst() {
    const { images } = useWebsiteImages();
    const hero = images.mobiler_hero;

    return (
        <main className="min-h-screen bg-[#EFF3F7] text-[#1E293B] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/40 to-[#EFF3F7]/80" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center"
                >
                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl md:text-6xl font-bold text-[#1E293B] mb-4"
                    >
                        Mobiler Wachdienst & Revierkontrollen
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
                    >
                        Flexible Sicherheitslösungen für Unternehmen, Wohnanlagen und öffentliche Bereiche –
                        präventiv, präsent und professionell.
                    </motion.p>
                </motion.div>
            </section>

            {/* LEISTUNGEN */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 max-w-5xl mx-auto space-y-16"
            >
                {[
                    {
                        title: 'Präventive Revierkontrollen',
                        text: 'Unsere Sicherheitskräfte kontrollieren Objekte wie Bürogebäude, Lagerhallen, Baustellen oder Wohnanlagen. Auf Wunsch überwachen wir auch ganze Straßenzüge oder klar definierte Gebiete, um verdächtige Personen oder Fahrzeuge frühzeitig zu erkennen.',
                    },
                    {
                        title: 'Flexible Einsatzintervalle',
                        text: 'Einsätze erfolgen je nach Bedarf mehrmals pro Nacht oder in individuell vereinbarten Intervallen. Unsere Mitarbeiter prüfen Zugänge, Außenbereiche und sicherheitsrelevante Punkte und reagieren sofort auf Auffälligkeiten.',
                    },
                    {
                        title: 'Abschreckende Präsenz',
                        text: 'Die sichtbare Präsenz unserer Streifenfahrzeuge trägt aktiv zur Einbruchprävention bei und vermittelt Sicherheit für Unternehmen, Mitarbeiter und Bewohner.',
                    },
                    {
                        title: 'Zusammenarbeit mit Behörden',
                        text: 'Bei Bedarf ziehen wir zuständige Behörden wie Polizei oder Ordnungsämter hinzu. Unsere Mitarbeiter handeln situationsgerecht, kommunikativ und deeskalierend, sodass die Sicherheit aller Beteiligten gewährleistet ist.',
                    },
                    {
                        title: 'Kunden und Einsatzgebiete',
                        text: 'Zu unseren Kunden zählen Wohnanlagen, öffentliche Plätze, Tankstellen, Betriebe mit Nachtbetrieb und andere Unternehmen. Regelmäßige Kontrollfahrten erhöhen die Sicherheit und minimieren Risiken für Personen und Eigentum.',
                    },
                    {
                        title: 'Zuverlässigkeit und Professionalität',
                        text: 'Der mobile Wachdienst von SicherPro Wachschutz steht für Flexibilität, Präsenz und professionelles Handeln – jederzeit einsatzbereit und aufmerksam.',
                    },
                ].map((block, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        className="relative pl-8 border-l-4 border-[#1E293B]/40"
                    >
                        <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
                        <p className="text-lg md:text-xl leading-relaxed">{block.text}</p>
                    </motion.div>
                ))}
            </motion.section>

            {/* CTA */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 bg-[#1E293B] text-white"
            >
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.p variants={fadeUp} className="text-xl md:text-2xl leading-relaxed">
                        Sorgen Sie für Sicherheit in Ihrem Revier oder Objekt – mit dem mobilen Wachdienst von SicherPro Wachschutz.
                    </motion.p>
                    <motion.div variants={fadeUp}>
                        <Link
                            href="/kontakt"
                            className="inline-block bg-[#7BA8B0] px-14 py-5 rounded-full text-lg font-bold text-[#1E293B] hover:bg-[#8FBBC3] transition shadow-lg"
                        >
                            Beratung anfragen
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
