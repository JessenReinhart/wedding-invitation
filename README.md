# 💒 Wedding Invitation Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://wedding-invitation-tau-two.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28)](https://firebase.google.com)

> **A multi-tenant wedding invitation platform** with admin panel, RSVP, guestbook, registry, gallery, maps, and music — all configurable per couple without forking the repo.

**[→ Try the live demo (our wedding)](https://wedding-invitation-tau-two.vercel.app)**

## ✨ Features

- **💌 RSVP System** — Per-tenant RSVP collection with Firebase
- **💬 Guestbook** — Interactive comment wall
- **🎵 Music Player** — Background music with auto-play toggle
- **📸 Gallery** — Photo gallery with lightbox
- **🗺️ Interactive Map** — Leaflet-powered venue location
- **🎁 Registry** — Wishlist with page view counter
- **👨‍💼 Admin Panel** — Firebase Auth-protected. Manage: site config (names, date, location, wording), RSVPs, comments, registry items. Import/export JSON config.
- **🌐 Multi-tenant** — Same deployment, 100+ couples. Each tenant gets its own `VITE_TENANT_ID`, Firestore namespace, and Vercel project.
- **📱 Mobile-first** — Fully responsive

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Styling | CSS |
| Backend | Firebase Firestore + Auth (Email/Password) |
| Maps | React Leaflet |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel (multi-project per tenant) |

## 🚀 Quick Start

```bash
git clone https://github.com/JessenReinhart/wedding-invitation.git
cd wedding-invitation
npm install
npm run dev
```

Open:
- Main site → http://localhost:5173
- Admin panel → http://localhost:5173/admin.html
- Registry page → http://localhost:5173/registry.html

## 🧱 Architecture

This repo has two modes:

### Root site (`/`)
The live wedding site — our own invitation. Built with React + Firebase.

### Whitelabel (`/whitelabel`)
A multi-tenant, sellable template. Each client/couple gets:
- A `VITE_TENANT_ID` (e.g. `client_acme_2026`)
- A separate Vercel project pointing at `/whitelabel`
- Its own Firestore namespace (no data leakage)
- An admin panel for configuring everything via UI

→ See [`WHITELABEL_OPERATIONS_GUIDE.md`](./WHITELABEL_OPERATIONS_GUIDE.md) for the full commercial workflow.

## 📁 Project Structure

```
├── App.tsx                     # Router + main layout
├── admin.html / admin.tsx      # Admin panel
├── registry.html               # Registry page
├── components/
│   ├── RSVP.tsx               # RSVP form
│   ├── Hero.tsx               # Hero section
│   ├── Venue.tsx              # Venue info + map
│   ├── Gallery.tsx            # Photo gallery
│   ├── MusicPlayer.tsx        # Background music
│   └── ...                    # Navigation, verse, mobile nav
├── services/
│   ├── rsvp.ts                # RSVP Firestore operations
│   ├── comments.ts            # Guestbook Firestore operations
│   ├── registry.ts            # Registry Firestore operations
│   ├── siteConfig.ts          # Tenant config management
│   └── tracker.ts             # Visit tracking
├── contexts/
│   ├── SiteConfigContext.tsx   # Tenant config provider
│   ├── MusicContext.tsx        # Music player state
│   └── LanguageContext.tsx     # i18n
└── whitelabel/                 # Multi-tenant template
    ├── App.tsx                 # Whitelabel app shell
    ├── services/               # Whitelabel-specific service layer
    ├── components/             # Whitelabel components
    └── ...                     # Same structure, tenant-aware
```

## 🎯 Why this exists

Most wedding invitations are static pages or one-off builds. This is designed as a **platform** — one codebase serving unlimited couples with full admin control, no dev involvement after setup.

Built for our own wedding, productized as a whitelabel template.

---

*If this saved you from building a wedding site from scratch, [give it a ⭐](https://github.com/JessenReinhart/wedding-invitation).*
