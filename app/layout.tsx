import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sicherpro.de"),
  title: {
    default: "SicherPro Wachschutz GmbH – Sicherheitsdienst in Duisburg & NRW",
    template: "%s | SicherPro Wachschutz GmbH",
  },
  description:
      "Professionelle Sicherheitslösungen: Objektschutz, Veranstaltungsschutz, Personenschutz, Brandwache, Baustellenbewachung und mobiler Wachdienst. Zertifiziert nach DIN EN ISO 9100 und DIN 77200-1.",
  keywords: [
    "Sicherheitsdienst",
    "Wachschutz",
    "Objektschutz",
    "Veranstaltungsschutz",
    "Personenschutz",
    "Brandwache",
    "Baustellenbewachung",
    "Duisburg",
    "NRW",
    "SicherPro",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "SicherPro Wachschutz GmbH",
    title: "SicherPro Wachschutz GmbH – Sicherheitsdienst auf höchstem Niveau",
    description:
        "Maßgeschneiderte Sicherheitslösungen für öffentliche, gewerbliche und private Bereiche. Über 15 Jahre Erfahrung.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
