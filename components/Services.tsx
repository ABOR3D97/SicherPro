'use client';
import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function Services() {
    return (
        <motion.section id="services" className="py-24 px-6 bg-[#D9DEDF]" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-7xl mx-auto">
                <motion.h2 className="text-5xl font-bold text-center mb-16 text-[#3A3A3A]" variants={itemVariants}>Unsere Dienstleistungen</motion.h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { title: 'Objektschutz & Bewachung', desc: 'Professioneller Schutz für Firmen, Anlagen und Infrastruktur – 24/7.' },
                        { title: 'Veranstaltungsschutz', desc: 'Sicherheit für Events, Messen und Großveranstaltungen mit erfahrenem Team.' },
                        { title: 'Personen- & Begleitschutz', desc: 'Diskreter Schutz für Führungskräfte und VIPs.' }
                    ].map((service) => (
                        <motion.div key={service.title} className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-[#B2B2AC]/30" variants={itemVariants} whileHover={{ y: -12 }}>
                            <div className="w-20 h-20 bg-[#587D85] rounded-full flex items-center justify-center mb-8 mx-auto">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-[#3A3A3A] text-center">{service.title}</h3>
                            <p className="text-[#B2B2AC] text-center mb-8 leading-relaxed">{service.desc}</p>
                            <button className="w-full bg-[#587D85] text-white py-4 rounded-full hover:bg-[#3A3A3A] transition-all duration-300 font-semibold shadow-lg">
                                Details & Angebot
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}