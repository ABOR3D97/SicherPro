'use client';
import React, { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import HowItWorks from '@/components/HowItWorks';
import AboutUs from '@/components/AboutUs';
import ContactForm from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 100);
        };

        const updateNavHeight = () => {
            if (navRef.current) {
                setNavHeight(navRef.current.offsetHeight);
            }
        };

        const resizeObserver = new ResizeObserver(updateNavHeight);
        if (navRef.current) {
            resizeObserver.observe(navRef.current);
            updateNavHeight();
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateNavHeight);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateNavHeight);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <main className="min-h-screen bg-[#D9DEDF] text-[#3A3A3A] overflow-x-hidden scroll-smooth">
            <div ref={navRef}>
                <Nav isScrolled={isScrolled} />
            </div>
            <div style={{ paddingTop: isScrolled ? navHeight : 0 }}>
                <Hero />
                <Services />
                <WhyUs />
                <HowItWorks />
                <AboutUs />
                <ContactForm />
            </div>
            <Footer />
        </main>
    );
}