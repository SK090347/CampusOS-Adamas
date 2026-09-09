# CampusOS — Adamas University (v2)

**Everything around your university, one intelligent operating layer.**

CampusOS is a digital operating system for [Adamas University](https://adamasuniversity.ac.in/) / Adamas Knowledge City (Barasat–Barrackpore Road, P.O. Jagannathpur, District 24 Parganas (North), Kolkata – 700126, West Bengal, India).

Core flow: **SEARCH → UNDERSTAND → NAVIGATE → ACT**

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- SQLite + Prisma (seeded demo data)
- Demo student auth + password-gated admin CMS
- **Leaflet + OpenStreetMap** interactive map with topology routing overlay
- Approximate campus overlay coordinates — **admin-editable / not official survey GPS**

## Quick start

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev -- -H 0.0.0.0 -p 3000
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start -- -H 0.0.0.0 -p 3000
```

### Reset database

```bash
npm run db:reset
```

## Demo credentials

| Role | How |
|------|-----|
| Demo student | Click **Demo as Aarav** (fictional: Aarav Sen, B.Tech CSE — AI & ML) |
| Admin | `/admin` with `ADMIN_PASSWORD` from `.env` |

Secrets live only in environment variables — never hardcode production secrets.

## Map (v2)

- Primary map: **Leaflet** with **OpenStreetMap** tiles
- Nodes carry relative layout (`x`, `y`) plus optional approximate `lat` / `lng`
- Edges carry **relative hop weights** (not metres)
- Routes are Dijkstra over `CampusNode` / `CampusEdge`
- UI banner: *Approximate campus overlay — admin-editable / not official survey GPS*
- Google Maps is **not** used or required

## Knowledge layer

Institutional records include: `sourceURL`, `sourceTitle`, `sourceType`, `retrievedAt`, `lastVerified`, `confidence`, `status`.

- **OFFICIAL** vs **SECONDARY** are labelled in UI
- Secondary sources are **never** presented as official policy
- Conflicts surface as **Information discrepancy detected**

## Modules

Home · Map · Campus Pulse · Academic OS · Academic Universe (10 schools) · People OS · Clubs (15 + quiz) · Events · Notices (What changed?) · Exams (no fake grades) · Library (in-app panels) · Hostel · Food · Sports/Wellness · Research · Innovation · Career · Global Adamas · Service Hub · AURA · My Campus · Notifications · Safety · Accessibility · Onboarding · Admin CMS

Mobile bottom nav: **Home | Map | Academics | Events | More**

## Leadership (seeded with sources)

- Prof. (Dr.) Samit Ray — Founder Chancellor
- Prof. (Dr.) Naveen Das — Vice Chancellor (Officiating)

Source: Adamas University official website references in seed metadata.

## Licence

Private / institutional demo for Adamas University CampusOS.
