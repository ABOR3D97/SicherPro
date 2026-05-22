<div align="center">

# SicherPro Wachschutz GmbH

**Professionelle Website & Verwaltungsplattform für einen Sicherheitsdienst in Duisburg / NRW**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#lizenz)

[Features](#-features) • [Tech-Stack](#-tech-stack) • [Schnellstart](#-schnellstart) • [Deployment](#-deployment) • [Dokumentation](#-dokumentation)

</div>

---

## 📖 Über das Projekt

**SicherPro** ist eine vollständige Web-Plattform für die SicherPro Wachschutz GmbH – einen Sicherheitsdienst mit Sitz in Duisburg. Das System kombiniert eine SEO-optimierte öffentliche Website mit einem gehärteten Admin-Backend zur Verwaltung von Kundenanfragen, Website-Bildern und Verbrauchsmetriken.

Die Plattform ist auf die regulatorischen Anforderungen des Bewachungsgewerbes (**§ 34a GewO**, **BewachV**) und der **DSGVO** zugeschnitten.

---

## ✨ Features

### 🌐 Öffentliche Website

- **Startseite** mit Hero, Services-Übersicht, "Warum wir", Prozessschritten, Über-uns & Kontaktformular
- **7 Dienstleistungsseiten**: Objektschutz · Veranstaltungsschutz · Personenschutz · Mobiler Wachdienst · Brandwache · Baustellenbewachung · Bewachung von Unterkünften
- **DSGVO-konformes Kontaktformular** mit serverseitiger Validierung, Rate-Limiting und HTML-Escape
- **Pflichtseiten**: Impressum (§ 5 TMG + § 34a GewO + BewachV), Datenschutz (11 Sektionen), AGB (10 Sektionen inkl. § 14 BewachV)
- **Vollständig responsiv** (Mobile-first, 4 Breakpoints)
- **SEO**: Sitemap, robots.txt, Open Graph, deutsche Lokalisierung

### 🔐 Admin-Panel (`/admin`)

- **Dashboard**: Stat-Cards, letzte Anfragen, diagnostische Banner
- **Anfragenverwaltung**: Tabs (Aktiv/Ungelesen/Archiv), Suche, Sortierung, Bulk-Actions
- **Bilderverwaltung**: Drag & Drop, Echt-Zeit-Upload-Progress, CORS-/Quota-Erkennung
- **Verbrauchsanalyse**: Firestore-Doc-Counts, Storage-Bytes, Kostenabschätzung, externe Dienste (IONOS, Vercel)
- **Sichere Registrierung**: Self-Service-Anfrage + Owner-Approval-Flow

### 🛡️ Sicherheit

- HTTP-only Session-Cookies + Custom-Claim-Verifikation
- CSRF-Schutz via Origin/Referer-Check
- In-Memory Sliding-Window Rate-Limiting
- Timing-safe Token-Vergleich (`crypto.timingSafeEqual`)
- Strict CSP, HSTS, X-Frame-Options, Permissions-Policy
- SMTP mit erzwungenem TLS ≥ 1.2 + HTML-Escape + Header-Injection-Schutz
- Firestore- & Storage-Rules mit Default-Deny

→ Details siehe [`IMPLEMENTIERUNG.md`](IMPLEMENTIERUNG.md)

---

## 🛠️ Tech-Stack

| Schicht | Technologie |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Runtime** | [React 19](https://react.dev/) |
| **Sprache** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | [framer-motion](https://www.framer.com/motion/) |
| **Icons** | [@heroicons/react](https://heroicons.com/) |
| **Backend (BaaS)** | [Firebase](https://firebase.google.com/) – Auth, Firestore, Storage |
| **Backend (Server)** | [firebase-admin](https://firebase.google.com/docs/admin/setup) |
| **E-Mail** | [Nodemailer](https://nodemailer.com/) + IONOS SMTP |
| **Datum/Zeit** | [date-fns](https://date-fns.org/) |
| **Linting** | [ESLint 9](https://eslint.org/) + `eslint-config-next` |

---

## 🚀 Schnellstart

### Voraussetzungen

- **Node.js ≥ 20**
- **npm ≥ 10**
- Firebase-Projekt (Blaze-Plan bei Storage-Nutzung) mit aktivierter Authentication, Firestore & Storage
- SMTP-Zugang (z. B. IONOS)

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/MouhammadBdeir/sicherpro.git
cd sicherpro

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen anlegen
cp .env.example .env.local   # bzw. manuell erstellen, siehe unten
```

### Konfiguration: `.env.local`

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://sicherpro.de

# Firebase Client (öffentlich, NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=…
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…

# Firebase Admin (Service Account — GEHEIM)
FIREBASE_PROJECT_ID=…
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-…@….iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"

# Owner-E-Mail (bekommt automatisch Admin-Claim beim ersten Login)
ADMIN_OWNER_EMAIL=owner@sicherpro.de

# SMTP (IONOS)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=465
SMTP_USER=info@sicherpro.de
SMTP_PASS=…
```

### Entwicklung starten

```bash
npm run dev
```

→ Öffne [http://localhost:3000](http://localhost:3000)

### Firebase-Rules deployen

```bash
npm run deploy:rules            # firestore + storage
```

---

## 📜 Verfügbare Scripts

| Script | Beschreibung |
|---|---|
| `npm run dev` | Startet den Dev-Server (Next.js) |
| `npm run build` | Erstellt den Production-Build |
| `npm run start` | Startet den Production-Server |
| `npm run lint` | Führt ESLint aus |
| `npm run deploy:rules` | Deployt Firestore- & Storage-Rules via Service-Account |

### Wartungs-Scripts

| Script | Zweck |
|---|---|
| `node scripts/deploy-firebase.mjs [firestore\|storage\|list]` | Granulares Rules-Deployment |
| `node scripts/migrate-timestamps.mjs [--apply]` | Repariert `createdAt`-Feld in Inquiries |
| `node scripts/diagnose-images.mjs [--fix-bucket]` | Prüft Bild-URLs auf Erreichbarkeit & Bucket-Korrektheit |

---

## 🗂️ Projektstruktur

```
sicherpro/
├── app/                      # Next.js App Router
│   ├── (public)              # Startseite, Dienstleistungen, AGB, …
│   ├── admin/                # Admin-Bereich (Shell, Dashboard, …)
│   └── api/                  # API-Routen (send-inquiry, admin/*)
├── components/               # React-Komponenten
│   ├── (public)              # Hero, Services, WhyUs, HowItWorks, …
│   └── admin/                # Toast, Error-Banner, …
├── lib/                      # Server-Bibliotheken
│   ├── firebase.ts           # Client-SDK
│   ├── firebase-admin.ts     # Admin-SDK (server-only)
│   ├── auth-server.ts        # Session-Helper
│   ├── origin-check.ts       # CSRF
│   ├── rate-limit.ts         # In-Memory Rate-Limit
│   └── mailer.ts             # Nodemailer + Escape
├── hooks/                    # React-Hooks
├── scripts/                  # Deploy- & Maintenance-Scripts
├── firestore.rules           # Firestore Security Rules
├── storage.rules             # Storage Security Rules
├── middleware.ts             # Admin-Route-Protection
└── next.config.ts            # CSP + Security-Headers
```

---

## 🚢 Deployment

### Empfohlene Plattform: **Vercel**

1. Repository mit Vercel verbinden
2. Alle Environment-Variablen aus `.env.local` ins Vercel-Dashboard übertragen
3. `FIREBASE_PRIVATE_KEY` mit literalen `\n`-Sequenzen speichern (das Admin-SDK konvertiert sie zur Laufzeit)
4. Deploy → Vercel führt automatisch `npm run build` aus

### Erstmaliges Owner-Setup

1. Sicherstellen, dass `ADMIN_OWNER_EMAIL` in den Env-Vars gesetzt ist
2. Benutzer mit dieser E-Mail in Firebase Auth anlegen (oder über Self-Service-Registrierung)
3. Mit dieser E-Mail unter `/admin/login` einloggen
4. Beim ersten Login setzt der Server automatisch das `admin`-Custom-Claim → erneuter Login erforderlich
5. Anschließend können weitere Admins über `/admin/register` Anfragen stellen, die der Owner freigibt

### Firebase-Plan

Die Plattform benötigt den **Blaze-Plan** (Pay-as-you-go), sobald:
- Storage Free-Tier-Quota überschritten wird
- Server-seitige Storage-Operationen genutzt werden (Admin SDK → Bucket Listing)

---

## 📚 Dokumentation

Die ausführliche technische Dokumentation befindet sich in **[`IMPLEMENTIERUNG.md`](IMPLEMENTIERUNG.md)** und umfasst:

- 🔒 Sicherheitsarchitektur (Auth-Flow, CSRF, Rate-Limiting, CSP)
- 🔥 Firebase-Konfiguration (Rules, Bucket-Resolver)
- 🎛️ Admin-Bereich (Shell, Toast, Error-Banner)
- 🛣️ API-Routen-Referenz
- 🌍 Umgebungsvariablen-Übersicht
- 📦 Deployment & Operations
- ⚖️ SEO & rechtliche Pflichten (DSGVO, BewachV)
- 📱 Responsive-Design-Konventionen
- 📐 Code-Richtlinien
- 🔧 Troubleshooting
- ✅ Checklisten für neue Features
- ⚠️ **13 Sicherheits-Invarianten** – nicht ohne Review brechen

---

## 🔐 Sicherheits-Highlights

Diese Plattform implementiert mehrschichtige Sicherheit:

- ✅ **Middleware** → Session-Cookie-Pflicht für `/admin/**`
- ✅ **Server-Session** → HTTP-only, Secure, SameSite=Lax
- ✅ **Custom-Claim** → `admin: true` als zweite Verteidigungslinie
- ✅ **Owner-Bootstrap** → automatischer Claim für `ADMIN_OWNER_EMAIL`
- ✅ **CSRF-Schutz** → Origin/Referer-Validierung
- ✅ **Rate-Limiting** → pro IP, pro Endpunkt
- ✅ **CSP** → Whitelist statt Wildcard
- ✅ **HSTS** → 2 Jahre + Preload
- ✅ **TLS-Pflicht** für SMTP (≥ 1.2)
- ✅ **HTML-Escape** für alle User-Inputs in Mails
- ✅ **Timing-safe** Token-Vergleich
- ✅ **Default-Deny** Firestore & Storage Rules

Sicherheitslücke entdeckt? Bitte privat melden an **owner@sicherpro.de** statt öffentliches Issue.

---

## 🤝 Beiträge

Dies ist ein internes Projekt der SicherPro Wachschutz GmbH. Externe Pull Requests werden nicht angenommen, Bug-Reports sind willkommen.

Für interne Entwickler: Vor jedem Commit
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Sicherheits-Invarianten aus [`IMPLEMENTIERUNG.md`](IMPLEMENTIERUNG.md) beachtet
- [ ] Bei Schema-Änderung: `npm run deploy:rules`

---

## 📄 Lizenz

Proprietär — © SicherPro Wachschutz GmbH. Alle Rechte vorbehalten.

Quellcode darf nicht ohne ausdrückliche schriftliche Genehmigung kopiert, verteilt oder modifiziert werden.

---

## 📞 Kontakt

**SicherPro Wachschutz GmbH**
Duisburg, Nordrhein-Westfalen, Deutschland
🌐 [sicherpro.de](https://sicherpro.de)
✉️ info@sicherpro.de

---

<div align="center">

**Erstellt mit ❤️ in Duisburg**

</div>
