'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function Brandwache() {
    const { images } = useWebsiteImages();
    const hero = images.brandwache_hero;

    return (
        <main className="min-h-screen bg-[#F4F6F7] text-[#2E2E2E] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-black/50" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center text-white"
                >
                    <motion.h1
                        variants={item}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Brandwache
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-200"
                    >
                        Vorbeugender Brandschutz mit Verantwortung, Erfahrung und Weitblick
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
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        variants={item}
                        className="text-xl leading-relaxed text-[#3A3A3A]"
                    >
                        Die Brandwache von <strong>SicherPro Wachschutz</strong> ist ein unverzichtbarer
                        Bestandteil moderner Sicherheitskonzepte. Wir schützen Gebäude, Veranstaltungen,
                        Baustellen und technische Anlagen – präventiv sowie im Ernstfall – um Personen-
                        und Sachschäden wirksam zu verhindern oder zu begrenzen.
                    </motion.p>
                </div>
            </motion.section>

            {/* LEISTUNGEN – CARDS */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="pb-24 px-6"
            >
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    {[
                        {
                            title: 'Einsatz bei erhöhtem Brandrisiko',
                            text:
                                'Unsere Brandwachen kommen bei erhöhtem Brandrisiko, nach Brandereignissen ' +
                                'oder beim Ausfall von Brandmelde- und Sprinkleranlagen zum Einsatz. ' +
                                'Wir arbeiten eng mit der zuständigen Feuerwehr zusammen und übernehmen ' +
                                'alle Sicherungsmaßnahmen bis zur vollständigen Wiederherstellung der Brandsicherheit.',
                        },
                        {
                            title: 'Rechtssicherheit & Verantwortung',
                            text:
                                'Mit SicherPro Wachschutz sind Sie rechtlich auf der sicheren Seite. ' +
                                'Unsere geschulten Mitarbeiter handeln aufmerksam, umsichtig und entschlossen ' +
                                'und sind sich der hohen Verantwortung ihrer Aufgabe jederzeit bewusst.',
                        },
                        {
                            title: 'Prävention als Kernaufgabe',
                            text:
                                'Ein zentraler Bestandteil unserer Brandwache ist die Prävention. ' +
                                'Wir achten konsequent auf die Einhaltung aller Brandschutzvorschriften, ' +
                                'setzen Auflagen durch und sensibilisieren Mitarbeiter sowie Besucher.',
                        },
                        {
                            title: 'Überwachung feuergefährlicher Arbeiten',
                            text:
                                'SicherPro Wachschutz überwacht feuergefährliche Arbeiten wie Schweiß- ' +
                                'oder Trennarbeiten, kontrolliert Funkenflug, Wärmeentwicklungen und ' +
                                'Gaskonzentrationen und führt regelmäßige Sicht- und Sicherheitskontrollen durch.',
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-[#587D85]">
                                {card.title}
                            </h3>
                            <p className="text-lg leading-relaxed text-[#3A3A3A]">
                                {card.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ABSCHLUSS */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-24 px-6 bg-[#587D85] text-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        variants={item}
                        className="text-4xl md:text-5xl font-bold mb-8"
                    >
                        Sicherheit beginnt mit Verantwortung
                    </motion.h2>

                    <motion.p
                        variants={item}
                        className="text-xl text-[#E5ECEE] mb-12"
                    >
                        Mit SicherPro Wachschutz entscheiden Sie sich für einen erfahrenen,
                        zuverlässigen Partner im vorbeugenden Brandschutz.
                    </motion.p>

                    <motion.div variants={item}>
                        <Link
                            href="/kontakt"
                            className="inline-block bg-white text-[#587D85] px-12 py-5 rounded-full font-bold text-lg hover:bg-[#E5ECEE] transition shadow-2xl"
                        >
                            Jetzt Beratung anfragen
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
