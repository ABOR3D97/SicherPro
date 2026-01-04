'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function AboutUs() {
  const { images, loading } = useWebsiteImages();
  // Dynamische Hero-URL mit Fallback auf dein aktuelles Unsplash-Bild
  const about_processBackground = images.about_image ;

  return (
    <motion.section id="about-us" className="py-24 px-6 bg-[#B2B2AC]/10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
      <div className="max-w-7xl mx-auto">
        <motion.h2 className="text-5xl font-bold text-center mb-16 text-[#3A3A3A]" variants={itemVariants}>Über uns</motion.h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants}>
            <img src={about_processBackground} alt="Unser Team" className="rounded-3xl shadow-2xl" />
          </motion.div>
          <motion.div className="space-y-8" variants={containerVariants}>
            <motion.p className="text-xl leading-relaxed text-[#3A3A3A]" variants={itemVariants}>
              SicherPro Wachschutz GmbH ist Ihr zuverlässiger Partner für professionelle Sicherheitslösungen. Seit über 8 Jahren schützen wir Menschen, Werte und Infrastruktur in öffentlichen, gewerblichen und privaten Bereichen.
            </motion.p>
            <motion.p className="text-xl leading-relaxed text-[#3A3A3A]" variants={itemVariants}>
              Unser Erfolg basiert auf einem erfahrenen Team, kontinuierlicher Weiterbildung und modernster Technik. Wir sind zertifiziert nach DIN EN ISO 9100 und DIN 77200-1 und garantieren höchste Qualitätsstandards.
            </motion.p>
            {/* Statistiken und Werte wie zuvor */}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}