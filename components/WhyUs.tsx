'use client';
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function WhyUs() {
    return (
        <motion.section id="why-us" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#B2B2AC]/10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-7xl mx-auto">
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-16 text-[#3A3A3A]" variants={itemVariants}>Warum SicherPro?</motion.h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    {[
                        { title: 'Zertifiziert & Qualifiziert', desc: 'DIN EN ISO 9100 & DIN 77200-1 – höchste Standards.' },
                        { title: '24/7 Einsatzbereit', desc: 'Rund-um-die-Uhr-Service für maximale Sicherheit.' },
                        { title: 'Erfahrenes Team', desc: 'Über 15 Jahre Expertise und kontinuierliche Weiterbildung.' }
                    ].map((reason) => (
                        <motion.div key={reason.title} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 text-center" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#587D85] rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#3A3A3A]">{reason.title}</h3>
                            <p className="text-[#B2B2AC] leading-relaxed text-sm sm:text-base">{reason.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}