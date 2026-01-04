'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useWebsiteImages } from "@/hooks/useWebsiteImages";
import Link from 'next/link';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Kontakt() {
    const { images } = useWebsiteImages();
    const kontaktBackground = images.contact_hero ;
    const [isScrolled, setIsScrolled] = useState(false);

    const [formData, setFormData] = useState({ name:'', email:'', phone:'', message:'' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setSubmitted(false);
        try {
            const response = await fetch('/api/send-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name:'', email:'', phone:'', message:'' });
                setTimeout(() => setSubmitted(false), 6000); // Success verschwindet nach 6 Sekunden
            } else throw new Error('Serverfehler');
        } catch {
            setError(true);
            setTimeout(() => setError(false), 6000); // Error verschwindet nach 6 Sekunden
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#1F2937] overflow-x-hidden">
            <Nav isScrolled={true} />

            {/* HERO */}
            <section className="relative mt-33">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${kontaktBackground}')` }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1F2937]/20 to-[#F8FAFC]/95" />
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold mb-4">
                        Kontaktieren Sie uns
                    </motion.h1>
                    <motion.p variants={fadeUp} className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[#374151]">
                        Wir freuen uns auf Ihre Nachricht – unverbindlich und schnell.
                    </motion.p>
                </motion.div>
            </section>

            {/* FORMULAR & KONTAKTINFOS */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

                {/* FORMULAR */}
                <motion.div variants={fadeUp} className="space-y-8">
                    <h2 className="text-4xl font-bold mb-12 text-[#1F2937]">Schreiben Sie uns</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <input type="text" placeholder="Ihr Name *" required value={formData.name} onChange={(e) => setFormData({...formData, name:e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#B2B2AC] focus:border-[#587D85] outline-none transition"/>
                        <input type="email" placeholder="Ihre E-Mail *" required value={formData.email} onChange={(e) => setFormData({...formData, email:e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#B2B2AC] focus:border-[#587D85] outline-none transition"/>
                        <input type="tel" placeholder="Ihre Telefonnummer" value={formData.phone} onChange={(e) => setFormData({...formData, phone:e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#B2B2AC] focus:border-[#587D85] outline-none transition"/>
                        <textarea placeholder="Ihre Nachricht *" required rows={6} value={formData.message} onChange={(e)=>setFormData({...formData, message:e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#B2B2AC] focus:border-[#587D85] outline-none transition resize-none"/>
                        <motion.button type="submit" className="w-full bg-[#587D85] text-white py-5 rounded-2xl font-bold hover:bg-[#3A3A3A] transition shadow-lg" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>Nachricht senden</motion.button>

                        {/* ERFOLG / ERROR */}
                        <motion.div
                            initial={{ opacity:0, y:10 }}
                            animate={{ opacity: submitted || error ? 1 : 0, y: submitted || error ? 0 : 10 }}
                            transition={{ duration:0.5 }}
                            className="absolute left-0 right-0 mt-4 text-center"
                        >
                            {submitted && <p className="text-[#587D85] font-medium">Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.</p>}
                            {error && <p className="text-red-600 font-medium">Fehler beim Senden. Bitte versuchen Sie es später erneut.</p>}
                        </motion.div>
                    </form>
                </motion.div>

                {/* KONTAKTINFOS */}
                <motion.div variants={fadeUp} className="space-y-12">
                    <h2 className="text-4xl font-bold mb-12 text-[#1F2937]">Unsere Kontaktdaten</h2>
                    <div className="bg-white rounded-3xl p-10 shadow-2xl space-y-8">
                        {[
                            { icon:'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title:'Adresse', text:'Ruhrorterstraße 56\n47059 Duisburg\nDeutschland' },
                            { icon:'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title:'Telefon', text:'01575 - 5537863', href:'tel:+4921023076910' },
                            { icon:'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title:'E-Mail', text:'info@sicherpro.de', href:'mailto:info@sicherpro.de' }
                        ].map((item, i)=>(
                            <div key={i} className="flex items-start space-x-6">
                                <div className="w-14 h-14 bg-[#587D85] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-[#1F2937]">{item.title}</h3>
                                    <p className="text-[#6B7280] leading-relaxed">
                                        {item.href ? <a href={item.href} className="hover:text-[#587D85] transition">{item.text}</a> : item.text.split('\n').map((line,i)=><span key={i}>{line}<br/></span>)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* CTA */}
            <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once:true }} className="py-24 px-6 bg-[#587D85] text-white text-center">
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-6">Jetzt Beratung anfragen</motion.h2>
                <motion.p variants={fadeUp} className="mb-8 text-lg md:text-xl max-w-3xl mx-auto">Kontaktieren Sie uns noch heute für individuelle Sicherheitslösungen.</motion.p>
                <motion.div variants={fadeUp}>
                    <Link href="/public#contact" className="inline-block bg-white text-[#587D85] px-14 py-5 rounded-full font-bold hover:bg-[#D9E2E6] shadow-lg transition">Kontakt aufnehmen</Link>
                </motion.div>
            </motion.section>

            <Footer />
        </main>
    );
}
