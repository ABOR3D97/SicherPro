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
        <motion.section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#D9DEDF]" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <div className="max-w-7xl mx-auto">
                <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-16 text-[#3A3A3A]" variants={itemVariants}>Unser Prozess</motion.h2>
                <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                    <motion.div variants={itemVariants}>
                        <img src={howItworksBackground} alt="Sicherheitsteam" className="rounded-2xl sm:rounded-3xl shadow-2xl w-full" />
                    </motion.div>
                    <motion.div className="space-y-8 sm:space-y-12" variants={containerVariants}>
                        {[
                            { num: '01', title: 'Persönliche Beratung', desc: 'Kostenlose Analyse Ihrer Sicherheitsbedürfnisse vor Ort.' },
                            { num: '02', title: 'Individuelles Konzept', desc: 'Maßgeschneidertes Sicherheitskonzept mit modernster Technik.' },
                            { num: '03', title: 'Professionelle Umsetzung', desc: 'Zuverlässiger Einsatz unseres qualifizierten Teams.' }
                        ].map((step) => (
                            <motion.div key={step.num} className="flex items-start gap-4 sm:gap-6" variants={itemVariants}>
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#587D85] rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg sm:text-2xl font-bold">
                                    {step.num}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-[#3A3A3A]">{step.title}</h3>
                                    <p className="text-[#B2B2AC] leading-relaxed text-sm sm:text-base">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}