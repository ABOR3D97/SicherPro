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

export default function Veranstaltungsschutz() {
    const { images } = useWebsiteImages();
    const hero = images.veranstaltung_hero;

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#1F2937] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1F2937]/30 to-[#F8FAFC]/95" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center"
                >
                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        Veranstaltungsschutz
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#374151]"
                    >
                        Maßgeschneiderte Sicherheitslösungen für Konzerte, Sportveranstaltungen, Open-Air-Events und öffentliche Feste.
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
                        title: 'Individuelle Sicherheitskonzepte',
                        text: 'Jede Veranstaltung bringt eigene Anforderungen mit sich. Wir entwickeln maßgeschneiderte Sicherheitslösungen, die exakt auf Art, Größe und Ablauf des Events abgestimmt sind.',
                    },
                    {
                        title: 'Beratung & Planung',
                        text: 'Bereits in der Planungsphase stehen wir unseren Kunden beratend zur Seite. Je nach Veranstaltung setzen wir qualifiziertes Sicherheitspersonal gezielt ein und koordinieren organisatorische Abläufe.',
                    },
                    {
                        title: 'Veranstaltungssicherheit & Präsenz',
                        text: 'Unsere Sicherheitskräfte sorgen durch Präsenz, Aufmerksamkeit und professionelles Auftreten für Ordnung und Sicherheit während der gesamten Veranstaltung. Dazu gehören Messen, VIP-Events, Weihnachtsmärkte, Stadtfeste, Konzerte, Sportevents und mehr.',
                    },
                    {
                        title: 'Kontrolle am Einlass',
                        text: 'Ticketprüfungen, Ausgabe von Zutritts- oder VIP-Bändern sowie Personenkontrollen und Taschenüberprüfungen gehören zu unseren zentralen Aufgaben, um unbefugten Zutritt zu vermeiden.',
                    },
                    {
                        title: 'Überwachung & Ablaufkoordination',
                        text: 'Wir überwachen Bühnen, Verkaufsstände, Technikbereiche und Zelte, insbesondere abends und nachts. Auf Wunsch unterstützen wir beim Ticketverkauf und der abschließenden organisatorischen Abwicklung.',
                    },
                    {
                        title: 'Erfahrung & Zuverlässigkeit',
                        text: 'Mit SicherPro Wachschutz entscheiden Sie sich für einen erfahrenen Partner, der Sicherheit, Organisation und Service professionell miteinander verbindet – für erfolgreiche und sichere Veranstaltungen.',
                    },
                ].map((block, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        className="relative pl-8 border-l-4 border-[#587D85]/60"
                    >
                        <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
                        <p className="text-lg md:text-xl leading-relaxed text-[#374151]">{block.text}</p>
                    </motion.div>
                ))}
            </motion.section>

            {/* CTA */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 bg-[#587D85] text-white"
            >
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.p variants={fadeUp} className="text-xl md:text-2xl leading-relaxed">
                        Planen Sie Ihre Veranstaltung sicher – mit professionellem Veranstaltungsschutz von SicherPro Wachschutz.
                    </motion.p>
                    <motion.div variants={fadeUp}>
                        <Link
                            href="/public#contact"
                            className="inline-block bg-white px-14 py-5 rounded-full text-lg font-bold text-[#587D85] hover:bg-[#D9E2E6] transition shadow-lg"
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
