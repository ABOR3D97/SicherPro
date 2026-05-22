# SicherPro – Implementierungs-Dokumentation & Richtlinien

> Stand: 2026-05-23 • Branch `main` • Commit `872c717` (Hardening, admin redesign, responsive overhaul + bug fixes)
>
> Dieses Dokument beschreibt die komplette Architektur, alle sicherheitsrelevanten Entscheidungen, Betriebsabläufe und Richtlinien, die bei Weiterentwicklung **zwingend beachtet** werden müssen.

---

## Inhaltsverzeichnis

1. [Projektüberblick](#1-projektüberblick)
2. [Technologie-Stack](#2-technologie-stack)
3. [Verzeichnisstruktur](#3-verzeichnisstruktur)
4. [Sicherheitsarchitektur (KRITISCH)](#4-sicherheitsarchitektur-kritisch)
5. [Firebase-Konfiguration](#5-firebase-konfiguration)
6. [Admin-Bereich](#6-admin-bereich)
7. [API-Routen](#7-api-routen)
8. [Umgebungsvariablen (.env.local)](#8-umgebungsvariablen-envlocal)
9. [Deployment & Operations](#9-deployment--operations)
10. [SEO & Rechtliches (DSGVO/BewachV)](#10-seo--rechtliches-dsgvobewachv)
11. [Responsive Design](#11-responsive-design)
12. [Code-Richtlinien (was beachten)](#12-code-richtlinien-was-beachten)
13. [Häufige Fehler & Troubleshooting](#13-häufige-fehler--troubleshooting)
14. [Checkliste für neue Features](#14-checkliste-für-neue-features)

---

## 1. Projektüberblick

**SicherPro Wachschutz GmbH** ist die Website eines Sicherheitsdienstes mit Sitz in Duisburg/NRW. Das System bietet:

- **Öffentliche Website**: Startseite, 7 Dienstleistungsseiten, Über uns, Kontakt, AGB, Datenschutz, Impressum
- **Kontaktformular**: serverseitig validiert, in Firestore gespeichert, per E-Mail an Owner versendet
- **Admin-Panel** (`/admin/**`): Übersicht, Anfragenverwaltung, Bilderverwaltung, Verbrauchsanalyse
- **Bewachungsgewerbe-Compliance**: § 34a GewO, BewachV, DSGVO konform

Das Projekt wurde umfassend gehärtet (Security), neu strukturiert (Admin-UI) und vollständig responsiv überarbeitet.

---

## 2. Technologie-Stack

| Bereich | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.0 |
| Runtime | React | 19.2.3 |
| Sprache | TypeScript | ^5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | ^4.1.18 |
| Animation | framer-motion | ^12.23.26 |
| Icons | @heroicons/react | ^2.2.0 |
| Backend (BaaS) | Firebase (Auth, Firestore, Storage) | ^12.7.0 |
| Backend-Admin | firebase-admin | ^13.6.0 |
| Mail | nodemailer | ^7.0.12 |
| Datumshelfer | date-fns | ^4.1.0 |

**Wichtig:** Tailwind v3-Konfiguration wurde **entfernt**. Custom-Werte (z. B. `spacing-15`, `spacing-33`) leben jetzt im `@theme`-Block in `app/globals.css`.

---

## 3. Verzeichnisstruktur

```
SicherPro/
├── app/                          # Next.js App Router
│   ├── (public-pages)            # Startseite, Dienstleistungen, AGB, etc.
│   ├── admin/                    # Admin-Bereich
│   │   ├── AdminShell.tsx        # Layout-Wrapper (Sidebar + Mobile-Nav)
│   │   ├── layout.tsx            # robots: noindex
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── approve/[id]/         # Freigabe durch Owner
│   │   ├── approve-success/
│   │   ├── approve-error/
│   │   └── dashboard/
│   │       ├── page.tsx          # Übersicht + Stat-Cards
│   │       ├── contact-management/page.tsx
│   │       ├── image-management/page.tsx
│   │       └── usage/page.tsx    # Firestore-/Storage-/Kosten-Übersicht
│   ├── api/
│   │   ├── send-inquiry/route.ts
│   │   └── admin/
│   │       ├── session/route.ts      # POST/DELETE Session-Cookie
│   │       ├── register/route.ts     # Pending-Admin-Eintrag + Mail
│   │       ├── approve/[id]/route.ts # Freigabe (Owner-only)
│   │       └── usage/route.ts        # Counts + Storage-Bytes
│   ├── robots.ts                 # Disallow /admin & /api
│   ├── sitemap.ts                # Auto-generiert aus Service-Slugs
│   └── layout.tsx                # <html lang="de">, OG-Metadaten
├── components/
│   ├── (public)                  # Hero, Services, WhyUs, HowItWorks, …
│   └── admin/                    # AdminShell-Helfer
│       ├── Toast.tsx             # Toast-Provider
│       ├── FirestoreErrorBanner.tsx
│       ├── StorageErrorBanner.tsx
│       └── ExternalServicesSection.tsx
├── lib/
│   ├── firebase.ts               # Client-SDK (Browser)
│   ├── firebase-admin.ts         # Admin-SDK (server-only)
│   ├── auth-server.ts            # getSession, requireAdmin, requireOwner
│   ├── origin-check.ts           # CSRF-Schutz
│   ├── rate-limit.ts             # In-Memory Sliding-Window
│   ├── mailer.ts                 # Nodemailer + HTML-Escaping
│   └── storage-health.ts         # HEAD-Probe für Storage-Diagnose
├── hooks/
│   └── useWebsiteImages.ts       # Lädt config/websiteImages
├── scripts/
│   ├── deploy-firebase.mjs       # Regeln deployen via Service-Account-JWT
│   ├── migrate-timestamps.mjs    # createdAt-Reparatur
│   └── diagnose-images.mjs       # Bucket-/URL-Diagnose
├── firestore.rules
├── storage.rules
├── firebase.json
├── middleware.ts                 # /admin/** Protection
├── next.config.ts                # CSP + Security-Headers
└── tailwind.config.js / .css     # Tailwind v4
```

---

## 4. Sicherheitsarchitektur (KRITISCH)

> **Diese Sektion ist die wichtigste.** Hier dokumentiert sind die Sicherheits-Invarianten — sie dürfen **nicht** ohne explizite Begründung gebrochen werden.

### 4.1 Trennung Client-SDK vs. Admin-SDK

- **`lib/firebase.ts`** → ausschließlich für Browser/Client-Komponenten. Verwendet `NEXT_PUBLIC_*`-Variablen.
- **`lib/firebase-admin.ts`** → `import 'server-only'`. Niemals in `'use client'`-Dateien importieren. Verwendet privaten Service-Account.

**Richtlinie:**
> ❌ **NIE** das Client-SDK in `app/api/**` oder Server-Komponenten benutzen.
> ✅ Alle serverseitigen DB-/Auth-/Storage-Zugriffe gehen über `adminDb`, `adminAuth`, `adminStorage`.

### 4.2 Admin-Authentifizierung

**Drei-Schicht-Modell:**

1. **Middleware** (`middleware.ts`): redirected `/admin/**` ohne `__session`-Cookie zu `/admin/login`. Liste öffentlicher Pfade ist hart kodiert.
2. **Server-Session-Cookie** (`__session`): `httpOnly`, `secure` in Production, `sameSite=lax`, max-age 24 h. Erstellt von `adminAuth.createSessionCookie()`.
3. **Custom Claim `admin: true`**: Wird per `adminAuth.setCustomUserClaims()` gesetzt — nur Owner-Bootstrap oder durch Approval-Route.

**Owner-Bootstrap:**

- Beim ersten Login mit `ADMIN_OWNER_EMAIL` setzt `/api/admin/session` automatisch das Admin-Claim.
- Antwort: `401 { refresh: true }` → Client erzwingt Token-Refresh und tut sich erneut anmelden.
- Siehe [app/admin/login/page.tsx:41-48](app/admin/login/page.tsx).

### 4.3 Registrierungs- & Freigabe-Flow

```
User → POST /api/admin/register   (E-Mail + Rate-Limit + Origin-Check)
       ↓
       Firestore: pendingAdmins/<id> { email, token (crypto.randomBytes 32 hex), status: 'pending', ip }
       ↓
       Mail an Owner: Link enthält ID + Token
       ↓
Owner → GET /admin/approve/[id]?token=…   (server-seitig nur Anzeige, Owner-Auth erforderlich)
       ↓
Owner klickt "Bestätigen" → POST /api/admin/approve/[id]   (Body: { token })
       ↓
       - getSession() prüft Owner-Status
       - crypto.timingSafeEqual gegen gespeichertes Token
       - adminAuth.createUser() oder getUserByEmail()
       - setCustomUserClaims({ admin: true })
       - adminAuth.generatePasswordResetLink() → Mail/Link
       - pendingAdmins/<id> wird gelöscht
```

**Sicherheitsmaßnahmen:**

- ✅ POST statt GET (kein Token-Leak in Logs/Referer)
- ✅ Owner-Check ZUSÄTZLICH zum Token (Defense-in-Depth)
- ✅ Timing-safe Token-Vergleich (`crypto.timingSafeEqual`)
- ✅ Rate-Limit pro IP
- ✅ 5-Minuten-Re-Request-Sperre (verhindert Mail-Spam)

### 4.4 CSRF-Schutz (Origin-Check)

Alle `POST`/`PATCH`/`DELETE`-Routen prüfen `Origin`/`Referer` gegen den eigenen Host via `assertSameOrigin()`:

```ts
// lib/origin-check.ts
const originError = assertSameOrigin(req);
if (originError) return originError;   // → 403
```

**Regel:** Mindestens einer der beiden Header muss vorhanden UND korrekt sein. Bei `null/null` → 403.

### 4.5 Rate-Limiting

**Implementation:** In-Memory Sliding-Window (`lib/rate-limit.ts`). Schlüssel = IP via `x-forwarded-for`.

| Endpunkt | Limit | Fenster |
|---|---|---|
| `/api/send-inquiry` | 5 | 1 h |
| `/api/admin/register` | 3 | 1 h |
| `/api/admin/approve/[id]` | 10 | 5 min |

**⚠️ Caveat:** Funktioniert nur per Instanz. Auf Vercel/serverless → "best effort". Für echte Limits → **Upstash/Redis** integrieren (TODO).

### 4.6 Content-Security-Policy (CSP)

Definiert in [next.config.ts:8-21](next.config.ts):

- `default-src 'self'`
- `script-src` whitelisted: `googleapis.com`, `gstatic.com`, `apis.google.com` (+ `unsafe-inline`/`unsafe-eval` für Next.js + Firebase SDK)
- `connect-src`: alle Firebase-Endpunkte
- `frame-ancestors 'none'` + `X-Frame-Options: DENY` → Clickjacking-Schutz
- `upgrade-insecure-requests` nur in Production

**Weitere Header:** HSTS (2 Jahre + preload), Referrer-Policy, Permissions-Policy (camera/mic/geo OFF, FLoC OFF).

### 4.7 SMTP-Sicherheit

`lib/mailer.ts`:

- Port 465 → `secure: true` (SMTPS)
- Sonst → `requireTLS: true` (STARTTLS erzwungen)
- `rejectUnauthorized: true`, `minVersion: TLSv1.2` → **keine Self-Signed/Schwache Certs**
- `escapeHtml()` für alle User-Inputs in HTML-Mails
- `safeHeader()` strippt CRLF (verhindert Header-Injection) und kappt auf max. 200 Zeichen

**Richtlinie:**
> ❌ User-Input **NIEMALS** ungescapt in HTML-Mails einfügen.
> ❌ User-Input **NIEMALS** ungeprüft in `Subject`/`replyTo`/`from` etc.
> ✅ Immer `escapeHtml()` für Body, `safeHeader()` für Header-Felder.

### 4.8 Input-Validierung

In [app/api/send-inquiry/route.ts](app/api/send-inquiry/route.ts):

- `name`: max. 100 Zeichen
- `email`: regex `EMAIL_RE` + max. 200 Zeichen
- `phone`: regex `^[+()\d\s/-]{6,30}$`, max. 40
- `message`: max. 5000 Zeichen
- `privacyAccepted`: MUSS `=== true` sein

**Richtlinie:** Jede neue API-Route prüft Längen + Typ + Regex **bevor** Daten in Firestore landen.

---

## 5. Firebase-Konfiguration

### 5.1 Firestore-Rules (`firestore.rules`)

```js
match /inquiries/{doc} {
  allow read, update, delete: if isAdmin();
  allow create: if false;              // nur via Admin-SDK
}

match /pendingAdmins/{doc} {
  allow read, write: if false;         // KOMPLETT gesperrt
}

match /config/websiteImages {
  allow read: if true;                 // public, damit Site-Bilder geladen werden
  allow write: if isAdmin();
}

match /config/{doc} {
  allow read, write: if isAdmin();     // externalCosts, sonstige Configs
}

match /{document=**} { allow read, write: if false; }   // Default-Deny
```

**Beachten:**
- `pendingAdmins` und `inquiries.create` sind **bewusst** auf `false` — Schreibzugriffe laufen ausschließlich über Server-Routen mit Admin-SDK.
- Wer das Schreiben aus dem Client erlauben will, muss die Rule **explizit** ergänzen (und entsprechend Rate-Limit + Validierung dort einbauen).

### 5.2 Storage-Rules (`storage.rules`)

```js
match /website-images/{file=**} {
  allow read: if true;
  allow write: if isAdmin()
               && request.resource.size < 8 * 1024 * 1024
               && request.resource.contentType.matches('image/.*');
}

match /{file=**} { allow read, write: if false; }
```

- 8 MB Hard-Limit
- Nur `image/*` Content-Types
- Default-Deny

### 5.3 Storage-Bucket-Auflösung

Drei-Stufen-Fallback (`lib/firebase-admin.ts:7-16`):
1. `FIREBASE_STORAGE_BUCKET` (server)
2. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
3. `${projectId}.firebasestorage.app` (neues Firebase-Default-Naming)

**Hintergrund:** Firebase hat das Default-Bucket-Naming geändert (`.appspot.com` → `.firebasestorage.app`). Wenn alte URLs im Firestore stehen → `scripts/diagnose-images.mjs --fix-bucket` ausführen.

### 5.4 Rules deployen

```bash
npm run deploy:rules                    # deployt firestore + storage
node scripts/deploy-firebase.mjs firestore
node scripts/deploy-firebase.mjs storage
node scripts/deploy-firebase.mjs list   # zeigt aktuelle Releases
```

**Warum eigenes Script und nicht `firebase deploy`?** firebase-tools speichert User-Logins; auf Build-Servern führte das zu Konflikten. Das Script nutzt **direkt** den Service-Account aus `.env.local` mit JWT-Auth gegen die Rules-REST-API.

---

## 6. Admin-Bereich

### 6.1 AdminShell

`app/admin/AdminShell.tsx` ist der gemeinsame Layout-Wrapper:

- Desktop: feste Sidebar (`hidden lg:flex`)
- Mobile: Hamburger-Header + Drawer
- `onAuthStateChanged` verifiziert Admin-Claim **client-seitig zusätzlich** → fehlt der Claim, sofort Logout + Redirect
- Public-Pfade (`/admin/login`, `/admin/register`, `/admin/approve*`) **kein** Shell-Wrapper, nur `<ToastProvider>`

**Wichtig:** Die Middleware-Prüfung allein reicht nicht — sie testet nur die Session-Cookie-Existenz, nicht den Claim. Der AdminShell-Check ist die **zweite Verteidigungslinie**.

### 6.2 Dashboard-Seiten

| Seite | Zweck |
|---|---|
| `/admin/dashboard` | Übersicht: 4 Stat-Cards (Anfragen total/unread/archived/heute), letzte 5 Anfragen, Firestore-Error-Banner |
| `/admin/dashboard/contact-management` | Tabs Aktiv/Ungelesen/Archiv + Suche + Sort + Toasts |
| `/admin/dashboard/image-management` | Drag&Drop-Upload mit echtem Progress (`uploadBytesResumable`), pro-Karte Error-Banner mit CORS/402-Erkennung |
| `/admin/dashboard/usage` | Firestore-Doc-Counts + Storage-Bytes + Kostenabschätzung + Externe Dienste (IONOS, Vercel) |

### 6.3 Toast-System

`<ToastProvider>` umhüllt `AdminShell`. Nutzung:

```ts
const { success, error, info } = useToast();
success('Anfrage gelöscht');
```

Auto-Dismiss nach 4 s, mit `framer-motion`-Animation.

### 6.4 Error-Banner

**`FirestoreErrorBanner`** zeigt diagnostische Infos (E-Mail, Admin-Claim, Refresh/Re-Login-Buttons), wenn Firestore `permission-denied` wirft.

**`StorageErrorBanner`** klassifiziert Storage-Fehler in:
- `cors` → CORS-Header fehlen am Bucket
- `unauthorized` → Auth fehlt
- `billing` → HTTP 402 (Free-Tier-Quota)
- `bucket-not-found` → Falscher Bucket-Name
- `quota` → Rate-Limit
- `network` → Allg. Netzwerkfehler
- `firestore-denied` → Rules blockieren config-Lesung

Jede Kategorie liefert konkrete Action-Steps.

---

## 7. API-Routen

| Route | Methode | Schutz | Zweck |
|---|---|---|---|
| `/api/send-inquiry` | POST | Origin + Rate-Limit + Validierung | Kontaktformular |
| `/api/admin/session` | POST | Origin | Login → Session-Cookie |
| `/api/admin/session` | DELETE | – | Logout |
| `/api/admin/register` | POST | Origin + Rate-Limit | Registrierungsanfrage |
| `/api/admin/approve/[id]` | POST | Origin + Owner-Auth + Token | Freigabe |
| `/api/admin/usage` | GET | Session-Auth | Counts + Bytes |

**Richtlinien für neue API-Routen:**

1. **Immer** `assertSameOrigin(req)` als erste Zeile.
2. **Immer** Rate-Limit setzen, wenn die Route von außen erreichbar ist.
3. **Immer** Input typprüfen + längenbegrenzen.
4. **NIE** mit `requireAdmin()` aus `auth-server.ts` in API-Routen arbeiten — `redirect()` darf in API-Handlern nicht aufgerufen werden, sonst 500. Stattdessen `getSession()` + manuelles `NextResponse.json({ error }, { status: 401 })`.
5. **NIE** Client-SDK importieren — nur `firebase-admin`.

---

## 8. Umgebungsvariablen (.env.local)

```bash
# === Site ===
NEXT_PUBLIC_SITE_URL=https://sicherpro.de

# === Firebase Client (NEXT_PUBLIC_*) ===
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sicherpro-xyz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sicherpro-xyz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sicherpro-xyz.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# === Firebase Admin (Service Account – GEHEIM!) ===
FIREBASE_PROJECT_ID=sicherpro-xyz
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@sicherpro-xyz.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# Optional Override:
FIREBASE_STORAGE_BUCKET=sicherpro-xyz.firebasestorage.app

# === Admin-Owner ===
ADMIN_OWNER_EMAIL=owner@sicherpro.de   # bekommt automatisch Admin-Claim beim ersten Login

# === SMTP (IONOS) ===
SMTP_HOST=smtp.ionos.de
SMTP_PORT=465
SMTP_USER=info@sicherpro.de
SMTP_PASS=...

# === Optional ===
STORAGE_BUCKET_OVERRIDE=...   # nur fürs Deploy-Script
```

**Richtlinien:**

- ❌ `FIREBASE_PRIVATE_KEY` **niemals** commiten.
- ❌ `.env.local` ist in `.gitignore` — niemals Inhalt nach `.env` oder `.env.production` umkopieren.
- ✅ Bei Vercel/Hoster: jede Variable einzeln im Dashboard setzen. `FIREBASE_PRIVATE_KEY` mit `\n` (escaped) speichern; das Script wandelt zu echten Newlines.
- ✅ Owner-Mail einmal pro Environment setzen, **dann nicht mehr ändern** (sonst verliert bestehender Owner-Account den Bootstrap-Pfad).

---

## 9. Deployment & Operations

### 9.1 Build

```bash
npm run build         # next build
npm run start         # next start
npm run lint          # eslint
```

### 9.2 Firebase-Regeln deployen

```bash
npm run deploy:rules                          # firestore + storage
node scripts/deploy-firebase.mjs firestore    # nur firestore
node scripts/deploy-firebase.mjs storage      # nur storage
node scripts/deploy-firebase.mjs list         # vorhandene Releases
```

### 9.3 Daten-Migrations-Scripts

**Timestamp-Reparatur** (für alte Inquiries mit kaputtem `createdAt`):

```bash
node scripts/migrate-timestamps.mjs           # Dry-Run
node scripts/migrate-timestamps.mjs --apply   # tatsächlich schreiben
```

**Hintergrund:** Vor dem Fix kam `serverTimestamp` aus `@firebase/database` (Realtime-DB), nicht aus `firebase/firestore`. Resultat: `{".sv":"timestamp"}`-Object statt Timestamp.

**Bild-Diagnose** (URL-Check + Bucket-Mismatch):

```bash
node scripts/diagnose-images.mjs              # nur prüfen
node scripts/diagnose-images.mjs --fix-bucket # alte Bucket-URLs umschreiben
```

### 9.4 Hosting

- **Frontend:** Vercel oder eigener Server (Node 20+)
- **Domain/DNS:** IONOS (Renewals manuell in `/admin/dashboard/usage` eintragen)
- **Firebase-Plan:** Blaze (Pay-as-you-go) zwingend, sobald Storage > Free-Tier oder Server-API → Storage genutzt wird

---

## 10. SEO & Rechtliches (DSGVO/BewachV)

### 10.1 SEO

- `<html lang="de">` in `app/layout.tsx`
- Open-Graph + Twitter-Cards mit `metadataBase` aus `NEXT_PUBLIC_SITE_URL`
- `title.template = "%s | SicherPro Wachschutz GmbH"`
- `app/robots.ts` → `Disallow: /admin, /api`
- `app/sitemap.ts` → alle statischen + 7 Service-Slugs
- `app/admin/layout.tsx` → `robots: { index: false, follow: false }`

### 10.2 Pflichtseiten

**Impressum** (`app/impressum/page.tsx`):
- § 5 TMG-Pflichtangaben
- **§ 34a GewO** Erlaubnis-Sektion (Bewachungsgewerbe)
- **BewachV-Angabe** (zuständige Aufsichtsbehörde, Gewerbeerlaubnis-Nr.)
- Vertretungsberechtigung, USt-IdNr., Berufshaftpflicht

**Datenschutz** (`app/datenschutz/page.tsx`):
- 11 Sektionen, DSGVO-konform
- Art. 6/7/13/15-21 Rechte
- Firebase als Auftragsverarbeitung (USA-Übermittlung, SCCs)
- SMTP-Versand-Hinweise
- Cookies/Local-Storage

**AGB** (`app/agb/page.tsx`):
- 10 Sektionen
- **§ 14 BewachV** Versicherungsklausel
- **§ 288 BGB** Verzugszinsen
- Gerichtsstand: **Duisburg**

### 10.3 Richtlinie

> ❌ **Pflichttexte nicht ohne juristische Prüfung** ändern. Bei Änderung eines Pflichtfeldes (z. B. Bewachererlaubnis-Nr.) immer in Impressum **und** Datenschutz prüfen.

---

## 11. Responsive Design

Alle Seiten wurden auf konsistente Tailwind-Breakpoints umgestellt:

| Klasse | Breakpoint |
|---|---|
| Default | < 640 px (Mobile) |
| `sm:` | ≥ 640 px |
| `md:` | ≥ 768 px |
| `lg:` | ≥ 1024 px (Sidebar erscheint) |
| `xl:` | ≥ 1280 px |

**Konsequente Scaling-Pattern:**

- Text: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Padding: `py-12 sm:py-16 md:py-20 lg:py-24`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Buttons: `w-full sm:w-auto`

**Nav:** Hamburger schließt bei:
- Outside-Click (Backdrop)
- ESC-Taste
- Link-Click
- Beim Öffnen wird der Body-Scroll gelockt.

---

## 12. Code-Richtlinien (was beachten)

### 12.1 Server- vs. Client-Komponenten

- Default: **Server-Komponenten** (keine `'use client'`-Direktive)
- `'use client'` **nur**, wenn Hooks (`useState`, `useEffect`) oder Browser-APIs gebraucht werden
- Server-Code, der Admin-SDK nutzt, **muss** `import 'server-only'` haben (`lib/firebase-admin.ts`, `lib/auth-server.ts`, `lib/mailer.ts`).

### 12.2 Datenfluss

- **Lesen aus Firestore im Public-Bereich**: Client-SDK (`hooks/useWebsiteImages.ts`), weil Rules `allow read: if true` für `config/websiteImages` erlauben.
- **Schreiben in Firestore**: **immer** Admin-SDK via API-Route, **nie** Client-SDK.
- **Storage-Upload im Admin-Panel**: Client-SDK (`uploadBytesResumable`) — Storage-Rules verifizieren Admin-Claim und Größen-/Content-Type-Limits.

### 12.3 Naming

- Komponenten: PascalCase (`Hero.tsx`)
- Hooks: `useXxx` in `hooks/`
- API-Routen: `route.ts` mit `export async function GET/POST/…`
- Server-Lib: `lib/*.ts` mit `'server-only'`-Import

### 12.4 Fehlerbehandlung

- API-Routen: **immer** `NextResponse.json({ error }, { status })` — niemals `throw`.
- Client-Promises: **immer** `try/catch` mit Toast/Error-State.
- Errors loggen mit `console.error(...)` (Vercel sammelt das).
- Dev-Modus: `error.message` an Client zurückgeben (`process.env.NODE_ENV === 'development'`). Production: nur generische Meldungen.

### 12.5 Was NICHT tun

- ❌ `firebase` (Client-SDK) auf Server-Seite importieren
- ❌ Geheimnisse in `NEXT_PUBLIC_*`-Variablen
- ❌ `--no-verify` bei Commits (Hooks haben einen Grund)
- ❌ Admin-Route ohne Origin-Check oder Rate-Limit
- ❌ User-Input in HTML-Mail/HTML-Output ohne `escapeHtml`
- ❌ `eval` / `Function(...)` / unsafe-eval-CSP-Ausnahmen erweitern
- ❌ `pendingAdmins`-Rules öffnen
- ❌ `redirect()` aus `auth-server.ts` in API-Routen
- ❌ Storage-Bucket mit `.appspot.com` hart kodieren (Naming kann variieren)

---

## 13. Häufige Fehler & Troubleshooting

### 13.1 "Permission denied" in der Admin-UI

**Symptom:** Firestore-Reads schlagen mit `permission-denied` fehl, FirestoreErrorBanner erscheint.

**Ursachen:**
1. Custom-Claim `admin` fehlt am User-Token. → Re-Login erzwingt Token-Refresh.
2. Owner-Bootstrap noch nicht durchgelaufen. → Erneut einloggen.
3. Regeln nicht deployed. → `npm run deploy:rules`.

### 13.2 "Bilder werden nicht angezeigt"

**Diagnose:**

```bash
node scripts/diagnose-images.mjs
```

Mögliche Befunde:
- HTTP 402 → Blaze-Plan aktivieren oder Free-Tier-Limit abwarten.
- HTTP 404 → falscher Bucket. → `--fix-bucket`.
- HTTP 401/403 → Storage-Rules verbieten Lesung. → `storage.rules` prüfen.
- Network-Error → CORS-Header fehlen am Bucket (`gsutil cors set …`).

### 13.3 "createdAt zeigt — (unbekannt)"

→ `node scripts/migrate-timestamps.mjs --apply` ausführen.

### 13.4 Login mit Owner-E-Mail liefert "Bitte einmal aus- und neu einloggen"

Erwartetes Verhalten beim **ersten** Login: Server hat gerade Admin-Claim gesetzt, der Token ist aber noch ohne Claim. Client refresht automatisch (`getIdToken(true)`) und meldet erneut an. Falls nicht: manuell ausloggen und erneut anmelden.

### 13.5 "Cross-Origin verboten" (403)

Origin-Header weicht vom eigenen Host ab. Ursachen:
- Falscher `NEXT_PUBLIC_SITE_URL`
- Reverse-Proxy ohne `Host`-Pass-Through
- Lokaler Test mit `localhost` vs. `127.0.0.1`

### 13.6 "Mail wird nicht versendet"

- SMTP-Credentials prüfen
- IONOS: Port 465 + `SMTP_USER` = Postfach-Adresse (nicht Alias)
- Wenn TLS scheitert: Cert-Chain im OS prüfen (kein `rejectUnauthorized: false` einbauen — Sicherheitsregression)

---

## 14. Checkliste für neue Features

### Neue API-Route hinzufügen

- [ ] `import 'server-only'`-Lib für Admin-SDK
- [ ] `assertSameOrigin(req)` als erste Zeile
- [ ] Rate-Limit eingebaut
- [ ] Input-Validierung (Typ + Länge + Regex)
- [ ] Owner-/Admin-Check über `getSession()`
- [ ] Fehler nur via `NextResponse.json({ error }, { status })`
- [ ] HTML-Escape bei Mail-/HTML-Output
- [ ] Test mit dev-Server + Permission-Prompt

### Neue Admin-Seite hinzufügen

- [ ] Innerhalb `app/admin/dashboard/**`
- [ ] Erbt automatisch `AdminShell` + `ToastProvider`
- [ ] `'use client'` nur, wenn nötig
- [ ] Bei Firestore-Read: `FirestoreErrorBanner` bei `permission-denied`
- [ ] Mobile-Layout getestet (< 640 px)
- [ ] NAV-Item in `AdminShell.tsx` ergänzen

### Neue öffentliche Seite

- [ ] In `app/sitemap.ts` ergänzen
- [ ] Eigene `metadata` (title/description)
- [ ] Responsive auf 4 Breakpoints geprüft
- [ ] Bilder via `hooks/useWebsiteImages.ts` mit Fallback
- [ ] Datenschutz/Impressum verlinkt

### Firebase-Schema-Änderung

- [ ] `firestore.rules` aktualisiert
- [ ] `npm run deploy:rules` ausgeführt
- [ ] Default-Deny-Regel **NICHT** entfernt
- [ ] `pendingAdmins`-Rule **NICHT** geöffnet
- [ ] Storage-Limit (8 MB) ggf. anpassen, aber dokumentieren

### Vor jedem Release

- [ ] `npm run build` läuft ohne Fehler
- [ ] `npm run lint` clean
- [ ] Alle `NEXT_PUBLIC_*` und Server-Env-Variablen im Ziel-Environment gesetzt
- [ ] `npm run deploy:rules` nach Schema-Änderung
- [ ] Admin-Login End-to-End getestet (Owner-Bootstrap, normaler Admin)
- [ ] Kontaktformular Live-Test (Anfrage erscheint in `/admin/dashboard/contact-management` + Mail kommt an)
- [ ] CSP-Verstöße in DevTools-Console prüfen (Network → "blocked by CSP")
- [ ] Mobile-Test auf realem Gerät

---

## Anhang A: Referenz-Dateien

| Kategorie | Datei |
|---|---|
| Security-Headers + CSP | [next.config.ts](next.config.ts) |
| Middleware (Admin-Protection) | [middleware.ts](middleware.ts) |
| Admin-SDK + Owner-Logik | [lib/firebase-admin.ts](lib/firebase-admin.ts) |
| Server-Session-Helfer | [lib/auth-server.ts](lib/auth-server.ts) |
| CSRF-Schutz | [lib/origin-check.ts](lib/origin-check.ts) |
| Rate-Limit | [lib/rate-limit.ts](lib/rate-limit.ts) |
| Mail (Escape + TLS) | [lib/mailer.ts](lib/mailer.ts) |
| Storage-Diagnose | [lib/storage-health.ts](lib/storage-health.ts) |
| Admin-Layout | [app/admin/AdminShell.tsx](app/admin/AdminShell.tsx) |
| Login-Flow | [app/admin/login/page.tsx](app/admin/login/page.tsx) |
| Session-API | [app/api/admin/session/route.ts](app/api/admin/session/route.ts) |
| Register-API | [app/api/admin/register/route.ts](app/api/admin/register/route.ts) |
| Approve-API | [app/api/admin/approve/[id]/route.ts](app/api/admin/approve/[id]/route.ts) |
| Inquiry-API | [app/api/send-inquiry/route.ts](app/api/send-inquiry/route.ts) |
| Usage-API | [app/api/admin/usage/route.ts](app/api/admin/usage/route.ts) |
| Firestore-Rules | [firestore.rules](firestore.rules) |
| Storage-Rules | [storage.rules](storage.rules) |
| Deploy-Script | [scripts/deploy-firebase.mjs](scripts/deploy-firebase.mjs) |
| Timestamp-Migration | [scripts/migrate-timestamps.mjs](scripts/migrate-timestamps.mjs) |
| Bild-Diagnose | [scripts/diagnose-images.mjs](scripts/diagnose-images.mjs) |

---

## Anhang B: Sicherheits-Invarianten (Kurzliste)

Diese Punkte **niemals** lockern ohne dokumentierte Begründung & Code-Review:

1. `pendingAdmins`-Rules bleiben `allow read, write: if false`.
2. `inquiries.create` bleibt `false` (Schreiben nur via Admin-SDK).
3. Default-Deny für alle anderen Firestore-Pfade.
4. `__session`-Cookie: `httpOnly` + `secure` (prod) + `sameSite=lax`.
5. Admin-Claim wird **nur** via Approval-Route oder Owner-Bootstrap gesetzt.
6. Owner-Check zusätzlich zum Token-Check beim Approval.
7. Timing-safe Token-Vergleich.
8. CSP ohne `unsafe-eval` für eigene Scripts (nur Firebase braucht es).
9. SMTP mit `rejectUnauthorized: true` und TLS ≥ 1.2.
10. HTML-Escape bei jeder User-Input-Ausgabe in Mails.
11. Header-Sanitize (CRLF-Strip) bei jedem Mail-Header-Wert.
12. `frame-ancestors 'none'` + `X-Frame-Options: DENY`.
13. Storage-Upload nur für Admin mit Größen- und Content-Type-Limit.

---

**Stand:** 2026-05-23 • **Verantwortlich:** Muaaz Bdear • **Lizenz:** Internes Projekt SicherPro Wachschutz GmbH
