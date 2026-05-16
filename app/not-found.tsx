'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] flex flex-col">
            <Nav isScrolled={true }/>

            {/* 404 Inhalt */}
            <section className="flex-1 flex items-center justify-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 mt-24 sm:mt-32">
                <motion.div
                    className="text-center max-w-3xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-[#587D85] mb-4 sm:mb-6 md:mb-8 drop-shadow-2xl">
                        404
                    </motion.h1>
                    <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-[#3A3A3A]">
                        Seite nicht gefunden
                    </motion.h2>
                    <motion.p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-[#B2B2AC] leading-relaxed">
                        Die gesuchte Seite existiert leider nicht. Vielleicht hilft ein Blick auf unsere Startseite oder Dienstleistungen weiter?
                    </motion.p>
                    <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <Link href="/" className="bg-[#587D85] text-white px-6 sm:px-10 py-3 sm:py-5 rounded-full text-base sm:text-lg font-semibold hover:bg-[#3A3A3A] transition-all duration-300 shadow-2xl inline-block">
                            Zurück zur Startseite
                        </Link>
                        <Link href="/kontakt" className="bg-white text-[#587D85] border-2 border-[#587D85] px-6 sm:px-10 py-3 sm:py-5 rounded-full text-base sm:text-lg font-semibold hover:bg-[#587D85] hover:text-white transition-all duration-300 shadow-2xl inline-block">
                            Kontakt aufnehmen
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

          <Footer/>
        </main>
    );
}