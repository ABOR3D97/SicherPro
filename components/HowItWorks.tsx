'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {useWebsiteImages} from "@/hooks/useWebsiteImages";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function HowItWorks() {
    const { images, loading } = useWebsiteImages();
    // Dynamische Hero-URL mit Fallback auf dein aktuelles Unsplash-Bild
    const howItworksBackground = images.process_image ;


    return (
        <motion.section className="py-24 px-6 bg-[#D9DEDF]" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-7xl mx-auto">
                <motion.h2 className="text-5xl font-bold text-center mb-16 text-[#3A3A3A]" variants={itemVariants}>Unser Prozess</motion.h2>
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div variants={itemVariants}>
                        <img src={howItworksBackground} alt="Sicherheitsteam" className="rounded-3xl shadow-2xl" />
                    </motion.div>
                    <motion.div className="space-y-12" variants={containerVariants}>
                        {[
                            { num: '01', title: 'Persönliche Beratung', desc: 'Kostenlose Analyse Ihrer Sicherheitsbedürfnisse vor Ort.' },
                            { num: '02', title: 'Individuelles Konzept', desc: 'Maßgeschneidertes Sicherheitskonzept mit modernster Technik.' },
                            { num: '03', title: 'Professionelle Umsetzung', desc: 'Zuverlässiger Einsatz unseres qualifizierten Teams.' }
                        ].map((step) => (
                            <motion.div key={step.num} className="flex items-start space-x-6" variants={itemVariants}>
                                <div className="w-16 h-16 bg-[#587D85] rounded-full flex items-center justify-center flex-shrink-0 text-white text-2xl font-bold">
                                    {step.num}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold mb-3 text-[#3A3A3A]">{step.title}</h3>
                                    <p className="text-[#B2B2AC] leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}