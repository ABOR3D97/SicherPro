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
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function UnterkuenfteBewachung() {
    const { images } = useWebsiteImages();
    const hero = images.unterkuenfte_hero;

    return (
        <main className="min-h-screen bg-[#EEF1F2] text-[#2F2F2F] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO – ruhig & seriös */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-[#2F2F2F]/60" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-6xl mx-auto px-6 py-28 text-white"
                >
                    <motion.h1
                        variants={item}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Bewachung von Unterkünften
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="max-w-3xl text-lg md:text-xl text-gray-200"
                    >
                        Strukturierte Sicherheit durch klare Abläufe, feste Zuständigkeiten
                        und professionelles Sicherheitspersonal
                    </motion.p>
                </motion.div>
            </section>

            {/* EINLEITUNG */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6"
            >
                <div className="max-w-5xl mx-auto">
                    <motion.p
                        variants={item}
                        className="text-xl leading-relaxed"
                    >
                        SicherPro Wachschutz übernimmt die zuverlässige Bewachung von Unterkünften
                        und sorgt für einen geordneten, sicheren Betrieb der gesamten Einrichtung.
                        Durch klare Zuständigkeiten, strukturierte Abläufe und geschultes
                        Sicherheitspersonal schaffen wir Stabilität und Entlastung für Betreiber
                        und Verwaltung.
                    </motion.p>
                </div>
            </motion.section>

            {/* STRUKTURBEREICHE – LISTE MIT TRENNSYSTEM */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="pb-24 px-6"
            >
                <div className="max-w-6xl mx-auto space-y-12">
                    {[
                        {
                            title: 'Regelmäßige Kontroll- und Präsenzdienste',
                            text:
                                'Unsere Mitarbeiter sind sichtbar vor Ort im Einsatz und führen festgelegte ' +
                                'Kontrollgänge durch. Sicherheitsrelevante Bereiche, Außenflächen und Zugänge ' +
                                'werden überwacht, um Unregelmäßigkeiten frühzeitig zu erkennen.',
                        },
                        {
                            title: 'Überwachung der Zugangsbereiche',
                            text:
                                'Der Zugang zur Unterkunft wird kontrolliert und koordiniert. Unbefugtes ' +
                                'Betreten wird verhindert, Besucherbewegungen werden geregelt und ' +
                                'sicherheitsrelevante Vorkommnisse dokumentiert.',
                        },
                        {
                            title: 'Ruhesicherung und Ordnungsdienst',
                            text:
                                'Ein zentraler Bestandteil unserer Bewachung ist die Aufrechterhaltung von Ruhe ' +
                                'und Ordnung. Unsere Mitarbeiter greifen situationsgerecht ein und wirken durch ' +
                                'ihr Auftreten stabilisierend.',
                        },
                        {
                            title: 'Einsatzbereitschaft rund um die Uhr',
                            text:
                                'SicherPro Wachschutz stellt je nach Bedarf einen kontinuierlichen ' +
                                'Sicherheitsdienst – auch im Schicht- oder 24-Stunden-Betrieb – und gewährleistet ' +
                                'eine schnelle Reaktion auf Vorfälle.',
                        },
                        {
                            title: 'Objektbezogene Sicherheitsorganisation',
                            text:
                                'Jede Unterkunft wird individuell bewertet. Auf dieser Grundlage erstellen wir ' +
                                'eine strukturierte Sicherheitsorganisation, angepasst an die örtlichen ' +
                                'Gegebenheiten und betrieblichen Abläufe.',
                        },
                        {
                            title: 'Seriöses, zurückhaltendes Auftreten',
                            text:
                                'Unsere Sicherheitsmitarbeiter handeln sachlich, neutral und rechtskonform. ' +
                                'Diskretion, Respekt und ein professioneller Umgang sind fester Bestandteil ' +
                                'unserer Arbeitsweise.',
                        },
                    ].map((section, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="bg-white rounded-2xl p-10 shadow-lg border-l-8 border-[#587D85]"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-[#587D85]">
                                {section.title}
                            </h3>
                            <p className="text-lg leading-relaxed">
                                {section.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ABSCHLUSS – sehr nüchtern */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 bg-[#2F2F2F] text-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.p
                        variants={item}
                        className="text-xl leading-relaxed text-gray-200 mb-10"
                    >
                        SicherPro Wachschutz steht für sachliche, verlässliche und strukturierte
                        Bewachung von Unterkünften – professionell umgesetzt, klar organisiert
                        und verantwortungsbewusst ausgeführt.
                    </motion.p>

                    <motion.div variants={item}>
                        <Link
                            href="/kontakt"
                            className="inline-block bg-[#587D85] px-12 py-5 rounded-full text-lg font-bold hover:bg-[#6F949C] transition shadow-xl"
                        >
                            Kontakt aufnehmen
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
