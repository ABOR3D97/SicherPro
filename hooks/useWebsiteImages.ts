import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WebsiteImages {
    // ================= Startseite =================
    home_logo?: string;
    home_hero?: string;

    // ================= Über uns =================
    about_hero?: string;
    about_image?: string;

    // ================= Process image =================
    process_image?: string;

    // ================= Kontakt =================
    contact_hero?: string;

    // ================= Dienstleistungen =================
    baustellen_hero?: string;
    baustellen_image?: string;

    brandwache_hero?: string;
    brandwache_image?: string;

    objektschutz_hero?: string;
    objektschutz_image?: string;

    veranstaltung_hero?: string;
    veranstaltung_image?: string;

    personenschutz_hero?: string;
    personenschutz_image?: string;

    mobiler_hero?: string;
    mobiler_image?: string;

    unterkuenfte_hero?: string;
    unterkuenfte_image?: string;

    // ================= Fallback =================
    [key: string]: string | undefined;
}


export function useWebsiteImages() {
    const [images, setImages] = useState<WebsiteImages>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'config', 'websiteImages'));
                if (docSnap.exists()) {
                    setImages(docSnap.data() as WebsiteImages);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Website-Bilder:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return { images, loading };
}