'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";

export default function UeberUns() {
    const { images } = useWebsiteImages();
    const aboutUsHero = images.about_hero ;
    const aboutUsImage = images.about_image ;

    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    };



    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            {/* Hero */}
            <motion.section className="mt-33 relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('${aboutUsHero}')` }} />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-8 text-[#3A3A3A] drop-shadow-2xl">
                        Über SicherPro
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-base sm:text-xl md:text-2xl lg:text-3xl text-[#587D85] max-w-4xl mx-auto">
                        Ihr zuverlässiger Partner für professionelle Sicherheitslösungen seit über 8 Jahren
                    </motion.p>
                </div>
            </motion.section>

            {/* Hauptinhalt */}
            <motion.section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#D9DEDF]" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                <div className="max-w-7xl mx-auto">
                    {/* Story */}
                    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-24">
                        <motion.div variants={itemVariants}>
                            <img src={aboutUsImage} alt="Unser Team" className="rounded-2xl sm:rounded-3xl shadow-2xl w-full object-cover h-[250px] sm:h-[350px] md:h-[400px]" />
                        </motion.div>
                        <motion.div className="space-y-4 sm:space-y-6 md:space-y-8" variants={itemVariants}>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A3A3A]">Unsere Geschichte</h2>
                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3A3A3A]">
                                SicherPro Wachschutz GmbH wurde mit der Vision gegründet, höchste Sicherheitsstandards für Unternehmen und Privatpersonen zu bieten. Seit unserer Gründung haben wir uns zu einem der führenden Anbieter in der Region entwickelt.
                            </p>
                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3A3A3A]">
                                Mit kontinuierlicher Weiterbildung unseres Teams und dem Einsatz modernster Technik garantieren wir rund um die Uhr zuverlässigen Schutz – zertifiziert nach DIN EN ISO 9100 und DIN 77200-1.
                            </p>
                        </motion.div>
                    </div>

                    {/* Statistiken */}
                    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24 text-center" variants={containerVariants}>
                        {[
                            { num: '8+', label: 'Jahre Erfahrung' },
                            { num: '500+', label: 'Zufriedene Kunden' },
                            { num: '24/7', label: 'Einsatzbereitschaft' },
                            { num: '100%', label: 'Zertifiziert' }
                        ].map((stat) => (
                            <motion.div key={stat.label} variants={itemVariants}>
                                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#587D85] mb-2 sm:mb-4">{stat.num}</div>
                                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-[#3A3A3A]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Werte */}
                    <motion.div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl" variants={containerVariants}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-[#3A3A3A]">Unsere Werte</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                            {[
                                { title: 'Zuverlässigkeit', desc: 'Wir sind immer da, wenn Sie uns brauchen – 24 Stunden am Tag.' },
                                { title: 'Professionalität', desc: 'Höchste Standards durch qualifiziertes und geschultes Personal.' },
                                { title: 'Vertrauen', desc: 'Diskretion und individuelle Lösungen für jeden Kunden.' }
                            ].map((value) => (
                                <motion.div key={value.title} className="text-center" variants={itemVariants}>
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#587D85] rounded-full flex items-center justify-center mb-4 sm:mb-6 md:mb-8 mx-auto">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-[#3A3A3A]">{value.title}</h3>
                                    <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#587D85] text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8">Bereit für mehr Sicherheit?</motion.h2>
                    <motion.p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-[#D9DEDF]">
                        Kontaktieren Sie uns für eine unverbindliche Beratung.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <Link href="/kontakt" className="bg-white text-[#587D85] px-8 sm:px-12 py-3 sm:py-5 rounded-full text-base sm:text-lg font-bold hover:bg-[#D9DEDF] transition-all duration-300 shadow-2xl inline-block">
                            Jetzt Kontakt aufnehmen
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}
