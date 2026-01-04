'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

    return (
        <motion.section id="contact" className="py-24 px-6 bg-[#587D85] text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-4xl mx-auto">
                <motion.h2 className="text-5xl font-bold text-center mb-12" variants={itemVariants}>Kontaktieren Sie uns</motion.h2>
                <motion.p className="text-xl text-center mb-16 text-[#D9DEDF]" variants={itemVariants}>
                    Fordern Sie ein unverbindliches Angebot an oder stellen Sie Ihre Fragen.
                </motion.p>
                <motion.form onSubmit={handleSubmit} className="space-y-8" variants={itemVariants}>
                    {/* Formular-Felder wie zuvor */}
                    <div className="text-center">
                        <motion.button type="submit" className="bg-white text-[#587D85] px-12 py-5 rounded-full text-lg font-bold hover:bg-[#D9DEDF] transition-all duration-300 shadow-2xl" whileHover={{ scale: 1.05 }}>
                            Nachricht senden
                        </motion.button>
                    </div>
                    {submitted && <motion.p className="text-center text-[#D9DEDF] text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Vielen Dank! Ihre Nachricht wurde gesendet.</motion.p>}
                </motion.form>
            </div>
        </motion.section>
    );
}