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

export default function Personenschutz() {
    const { images } = useWebsiteImages();
    const hero = images.personenschutz_hero;

    return (
        <main className="min-h-screen bg-[#0F172A] text-gray-200 overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO – exklusiv & ruhig */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 to-[#0F172A]" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 max-w-6xl mx-auto px-6 py-32"
                >
                    <motion.span
                        variants={fadeUp}
                        className="uppercase tracking-widest text-sm text-[#7BA8B0]"
                    >
                        Individuelle Sicherheitslösungen
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl md:text-6xl font-bold mt-4 mb-8 text-white"
                    >
                        Personenschutz
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="max-w-3xl text-lg md:text-xl leading-relaxed"
                    >
                        Der Personenschutz von SicherPro Wachschutz steht für individuelle
                        Sicherheit auf höchstem Niveau – diskret, vorausschauend und
                        kompromisslos zuverlässig.
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
                        variants={fadeUp}
                        className="text-xl leading-relaxed"
                    >
                        Unser Anspruch ist es, Menschen in sensiblen Lebens- und
                        Arbeitssituationen zuverlässig zu schützen und ihnen ein
                        sicheres, selbstbestimmtes Auftreten zu ermöglichen – im
                        privaten Umfeld, im beruflichen Alltag oder bei öffentlichen
                        Anlässen.
                    </motion.p>
                </div>
            </motion.section>

            {/* SCHUTZMODULE – vertikale Struktur */}
            <motion.section
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="pb-24 px-6"
            >
                <div className="max-w-6xl mx-auto space-y-20">
                    {[
                        {
                            title: 'Maßgeschneiderte Schutzkonzepte',
                            text:
                                'Jede Schutzmaßnahme beginnt mit einer detaillierten Analyse der persönlichen ' +
                                'Situation. Auf dieser Basis entwickeln wir individuelle Sicherheitskonzepte, ' +
                                'die sich an Risiken, Bewegungsprofilen und persönlichen Anforderungen orientieren.',
                        },
                        {
                            title: 'Diskretes Auftreten und professionelle Begleitung',
                            text:
                                'Unsere Personenschützer agieren unauffällig, souverän und situationsangepasst. ' +
                                'Ziel ist es, Ihre Sicherheit zu gewährleisten, ohne Ihre Privatsphäre ' +
                                'einzuschränken.',
                        },
                        {
                            title: 'Vorausschauende Sicherheitsstrategie',
                            text:
                                'Neben der unmittelbaren Begleitung setzen wir auf Prävention: Risikoanalysen, ' +
                                'Umfeldbeobachtungen und die frühzeitige Erkennung möglicher Gefährdungen.',
                        },
                        {
                            title: 'Schutz bei Reisen und öffentlichen Terminen',
                            text:
                                'Ob Geschäftsreise, Auslandsaufenthalt oder öffentlicher Auftritt – wir planen ' +
                                'sichere Abläufe, überwachen Routen und sorgen für Schutz am Zielort.',
                        },
                        {
                            title: 'Beratung und Risikobewertung',
                            text:
                                'Wir unterstützen Sie dabei, Risiken realistisch einzuschätzen und nachhaltige ' +
                                'Schutzmaßnahmen für Sie, Ihre Familie oder Ihr Unternehmen zu entwickeln.',
                        },
                        {
                            title: 'Verfügbarkeit rund um die Uhr',
                            text:
                                'Unsere Personenschützer stehen flexibel zur Verfügung – tagsüber, nachts oder ' +
                                'im 24-Stunden-Dienst. Sicherheit kennt keine Uhrzeit.',
                        },
                        {
                            title: 'Schnelles Handeln in Ausnahmesituationen',
                            text:
                                'Im Ernstfall handeln unsere Mitarbeiter ruhig, entschlossen und effektiv. ' +
                                'Klare Abläufe und professionelle Einsatzstrategien sorgen für Schutz und ' +
                                'Deeskalation.',
                        },
                        {
                            title: 'Vertrauen als Basis',
                            text:
                                'Personenschutz erfordert absolutes Vertrauen. Diskretion, Verantwortungsbewusstsein ' +
                                'und höchste Professionalität stehen bei uns an erster Stelle.',
                        },
                    ].map((block, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="relative pl-8 border-l border-[#7BA8B0]/40"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-white">
                                {block.title}
                            </h3>
                            <p className="text-lg leading-relaxed text-gray-300 max-w-4xl">
                                {block.text}
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
                className="py-24 px-6 bg-[#020617]"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.p
                        variants={fadeUp}
                        className="text-xl leading-relaxed text-gray-300 mb-10"
                    >
                        SicherPro Wachschutz bietet professionellen Personenschutz,
                        der Sicherheit, Diskretion und Prävention vereint – zuverlässig,
                        individuell und auf höchstem Niveau.
                    </motion.p>

                    <motion.div variants={fadeUp}>
                        <Link
                            href="/kontakt"
                            className="inline-block bg-[#7BA8B0] px-14 py-5 rounded-full text-lg font-bold text-[#020617] hover:bg-[#8FBBC3] transition shadow-xl"
                        >
                            Persönliche Beratung anfragen
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
