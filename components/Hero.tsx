'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function Hero() {
    const { images, loading } = useWebsiteImages();

    // Dynamische Hero-URL mit Fallback auf dein aktuelles Unsplash-Bild
    const heroBackground = images.home_hero ;

    return (
        <motion.section
            id="home"
            className="relative h-screen flex items-center justify-center overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Dynamisches Hintergrundbild */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url('${heroBackground}')` }}
            />

            {/* Optional: Lade-Overlay, falls Bild noch nicht da ist */}
            {loading && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}

            {/* Gradient-Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#587D85]/80" />

            {/* Inhalt */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                <motion.h1
                    className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
                    variants={itemVariants}
                >
                    SicherPro Wachschutz GmbH
                </motion.h1>
                <motion.p
                    className="text-2xl md:text-4xl text-[#D9DEDF] mb-8 drop-shadow-lg"
                    variants={itemVariants}
                >
                    auf höchstem Niveau
                </motion.p>
                <motion.p
                    className="text-lg md:text-xl text-[#D9DEDF] mb-12 max-w-3xl mx-auto drop-shadow-md"
                    variants={itemVariants}
                >
                    Maßgeschneiderte Sicherheitslösungen für öffentliche, gewerbliche und private Bereiche – mit über 15 Jahren Erfahrung und höchsten Zertifizierungen.
                </motion.p>
                <Link href="/kontakt">
                    <motion.button
                        className="bg-[#587D85] text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#3A3A3A] transition-all duration-300 shadow-2xl"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        Kostenloses Angebot anfragen
                    </motion.button>
                </Link>
            </div>
        </motion.section>
    );
}