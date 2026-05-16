import type { MetadataRoute } from 'next';

const SERVICE_SLUGS = [
    'objektschutz',
    'veranstaltungsschutz',
    'personenschutz',
    'mobiler-wachdienst-revierkontrollen',
    'brandwache',
    'baustellenbewachung',
    'bewachung-von-unterkuenften',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://sicherpro.de';
    const now = new Date();

    const staticPaths = [
        '',
        '/ueber-uns',
        '/kontakt',
        '/agb',
        '/datenschutz',
        '/impressum',
    ];

    const servicePaths = SERVICE_SLUGS.map((s) => `/dienstleistungen/${s}`);

    return [...staticPaths, ...servicePaths].map((path) => ({
        url: `${base}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'monthly' : 'yearly',
        priority: path === '' ? 1 : 0.7,
    }));
}
