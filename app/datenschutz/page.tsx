'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Datenschutz() {
    // (Gleicher Nav-Code)

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <Nav isScrolled={true} />

            {/* Hauptinhalt */}
            <motion.section className="mt-15  py-32 px-6" initial="hidden" animate="visible" >
                <div className="max-w-4xl mx-auto">
                    <motion.h1 className="text-6xl font-bold text-center mb-12 text-[#3A3A3A]" >Datenschutzerklärung</motion.h1>
                    <motion.div className="bg-white rounded-3xl p-12 shadow-2xl space-y-12 text-lg leading-relaxed">
                        <motion.div >
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">1. Verantwortlicher</h2>
                            <p>SicherPro Wachschutz GmbH, Harkortstr. 25, 40880 Ratingen, info@sicherpro.de</p>
                        </motion.div>
                        <motion.div>
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">2. Datenerhebung</h2>
                            <p>Wir erheben Daten bei Kontaktaufnahme (Name, E-Mail, Telefon) zur Vertragsdurchführung (Art. 6 Abs. 1 b DSGVO).</p>
                        </motion.div>
                        {/* Weitere Abschnitte: Cookies, Server-Logfiles, Rechte der Betroffenen, etc. */}
                        <motion.div >
                            <h2 className="text-3xl font-bold mb-4 text-[#587D85]">Rechte der Betroffenen</h2>
                            <p>Sie haben Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </main>
    );
}