'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactForm() {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

    return (
        <motion.section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#587D85] text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-4xl mx-auto">
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-12" variants={itemVariants}>Kontaktieren Sie uns</motion.h2>
                <motion.p className="text-base sm:text-lg md:text-xl text-center mb-10 sm:mb-16 text-[#D9DEDF]" variants={itemVariants}>
                    Fordern Sie ein unverbindliches Angebot an oder stellen Sie Ihre Fragen.
                </motion.p>
                <motion.div className="text-center" variants={itemVariants}>
                    <Link href="/kontakt">
                        <motion.span
                            className="inline-block bg-white text-[#587D85] px-8 sm:px-12 py-3 sm:py-5 rounded-full text-base sm:text-lg font-bold hover:bg-[#D9DEDF] transition-all duration-300 shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            Nachricht senden
                        </motion.span>
                    </Link>
                </motion.div>
            </div>
        </motion.section>
    );
}
