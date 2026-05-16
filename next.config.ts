import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// CSP: Firebase / Google APIs whitelisted, Inline-Scripts brauchen
// Next-Hashes – daher 'unsafe-inline' für Scripts NICHT setzen, sondern
// auf Nonces vertrauen (Next handhabt das automatisch im App Router).
const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googleapis.com https://www.gstatic.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://via.placeholder.com https://*.googleusercontent.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com wss://*.firebaseio.com",
    "frame-src https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    isProd ? 'upgrade-insecure-requests' : '',
].filter(Boolean).join('; ');

const securityHeaders = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'via.placeholder.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/v0/b/**' },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
