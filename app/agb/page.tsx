'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function AGB() {
    // (Gleicher Nav-Code wie oben)

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            {/* Hauptinhalt */}
            <motion.section className="mt-15  py-32 px-6" initial="hidden" animate="visible" >
                <div className="max-w-4xl mx-auto">
                    <motion.h1 className="text-6xl font-bold text-center mb-12 text-[#3A3A3A]" >Allgemeine Geschäftsbedingungen (AGB)</motion.h1>
                    <motion.div className="bg-white rounded-3xl p-12 shadow-2xl space-y-12 text-lg leading-relaxed">
                        <motion.div >
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">1. Geltungsbereich</h2>
                            <p>Diese AGB gelten für alle Verträge zwischen SicherPro Wachschutz GmbH und ihren Kunden. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, wir stimmen schriftlich zu.</p>
                        </motion.div>
                        {/* Weitere Abschnitte: Vertragsschluss, Leistungen, Vergütung, Haftung, Kündigung, Schlussbestimmungen – wie in deiner früheren Vorlage */}
                        <motion.div >
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">7. Schlussbestimmungen</h2>
                            <p>Es gilt deutsches Recht. Gerichtsstand ist Ratingen. Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}