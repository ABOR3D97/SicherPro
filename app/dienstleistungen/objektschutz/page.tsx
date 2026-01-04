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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Objektschutz() {
    const { images } = useWebsiteImages();
    const hero = images.objektschutz_hero;

    return (
        <main className="min-h-screen bg-[#F1F5F9] text-[#1E293B] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/50 to-[#F1F5F9]/90" />

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
                        Objektschutz
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
                    >
                        Wir schützen Unternehmen, öffentliche Einrichtungen und private Objekte – zuverlässig,
                        strukturiert und professionell.
                    </motion.p>
                </motion.div>
            </section>

            {/* EINLEITUNG */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 max-w-5xl mx-auto"
            >
                <motion.p variants={fadeUp} className="text-lg md:text-xl leading-relaxed mb-12">
                    Der Objektschutz von SicherPro Wachschutz stellt die Sicherheit von Personen, Sachwerten und
                    Betriebsabläufen in den Mittelpunkt. Unser Ziel ist es, Risiken frühzeitig zu erkennen und
                    zu minimieren – damit Ihr Unternehmen und Ihre Einrichtungen rund um die Uhr geschützt sind.
                </motion.p>

                <div className="space-y-16">
                    {[
                        {
                            title: 'Dauerhafte oder zeitlich definierte Präsenz',
                            text:
                                'Unsere Sicherheitsmitarbeiter sind dauerhaft oder zu definierten Zeiten vor Ort im Einsatz. ' +
                                'Sie führen regelmäßige Streifen- und Rundgänge durch, überprüfen Zugänge und reagieren sofort auf sicherheitsrelevante Auffälligkeiten oder technische Störungen.',
                        },
                        {
                            title: 'Nach Betriebsschluss – maximale Sicherheit',
                            text:
                                'Nach Feierabend sorgen wir dafür, dass sich keine unbefugten Personen auf dem Gelände aufhalten. ' +
                                'Außenkontrollen, Zaun- und Geländeüberwachung verhindern unberechtigtes Betreten und erkennen potenzielle Gefahren frühzeitig.',
                        },
                        {
                            title: 'Kontrolle von Mitarbeiter- und Besucherausweisen',
                            text:
                                'Die Kontrolle sensibler Bereiche stärkt Sicherheit und vermittelt ein klares Gefühl von Ordnung für Beschäftigte und Besucher.',
                        },
                        {
                            title: 'Ergänzende Unterstützungsleistungen',
                            text:
                                'Auf Wunsch übernehmen wir weitere Aufgaben wie winterliche Räum- und Sicherungsdienste für Geh- und Fluchtwege oder Ordnungstätigkeiten im Außenbereich. Alle Leistungen werden individuell auf das Objekt abgestimmt.',
                        },
                        {
                            title: 'Zielgruppen & Kunden',
                            text:
                                'Unsere Kunden sind Büro- und Verwaltungsgebäude, Industrieanlagen, Hotels mit 24-Stunden-Betrieb sowie Museen und Einrichtungen mit besonders schützenswerten Werten. Wir stehen für Zuverlässigkeit, Diskretion und ein hohes Maß an Professionalität.',
                        },
                    ].map((block, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="relative pl-8 border-l-4 border-[#1E293B]/40"
                        >
                            <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
                            <p className="text-lg leading-relaxed max-w-3xl">{block.text}</p>
                        </motion.div>
                    ))}
                </div>
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
                        Sichern Sie Ihr Objekt professionell mit SicherPro Wachschutz – individuell, zuverlässig und rund um die Uhr.
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
