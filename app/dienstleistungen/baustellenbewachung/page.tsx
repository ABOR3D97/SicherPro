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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Baustellenbewachung() {
    const { images } = useWebsiteImages();
    const hero = images.baustellen_hero;

    return (
        <main className="min-h-screen bg-[#F4F7F9] text-[#1E293B] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${hero}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/30 to-[#F4F7F9]/90" />

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
                        Baustellenbewachung
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#374151]"
                    >
                        Professionelle Sicherheitslösungen für Ihre Baustellen – zuverlässig, flexibel und diskret.
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
                        title: 'Schutz vor unbefugtem Zutritt',
                        text: 'Baustellen ziehen häufig unbefugte Personen an. Diebstahl von Baumaterialien, Vandalismus oder unerlaubtes Betreten außerhalb der Arbeitszeiten gehören zu den häufigsten Risiken. Ein einfacher Bauzaun reicht oft nicht aus – wir sorgen für effektiven Schutz.',
                    },
                    {
                        title: 'Kontrolle nach Feierabend',
                        text: 'Unsere Sicherheitsmitarbeiter überwachen das Gelände nach Feierabend der Handwerker. So stellen wir sicher, dass die Baustelle am nächsten Morgen ordnungsgemäß und ohne Zwischenfälle wieder aufgenommen werden kann.',
                    },
                    {
                        title: 'Flexibler Einsatz',
                        text: 'Unsere Leistungen können flexibel gebucht werden – ob nachts, an Wochenenden, an Feiertagen oder im 24-Stunden-Dienst. Unerwünschter „Baustellentourismus“ wird effektiv unterbunden.',
                    },
                    {
                        title: 'Professionelles Auftreten',
                        text: 'Mit sichtbarer Präsenz, regelmäßigen Kontrollgängen und professionellem Auftreten schrecken unsere Sicherheitskräfte ungebetene Gäste zuverlässig ab und gewährleisten einen reibungslosen Bauablauf.',
                    },
                    {
                        title: 'Zuverlässigkeit für Auftraggeber',
                        text: 'SicherPro Wachschutz handelt stets im Interesse des Auftraggebers. Wir schützen Ihr Bauvorhaben umfassend, sorgen für Sicherheit, Ordnung und einen planbaren Bauablauf.',
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
                        Sichern Sie Ihre Baustellen effektiv – mit professioneller Baustellenbewachung von SicherPro Wachschutz.
                    </motion.p>
                    <motion.div variants={fadeUp}>
                        <Link
                            href="/kontakt"
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
