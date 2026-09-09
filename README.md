# CampusOS — Adamas University

**Everything around your university, one intelligent operating layer.**

CampusOS is a digital operating system for [Adamas University](https://adamasuniversity.ac.in/) / Adamas Knowledge City (Barasat–Barrackpore Road, P.O. Jagannathpur, District 24 Parganas (North), Kolkata – 700126, West Bengal, India).

Core flow: **SEARCH → UNDERSTAND → NAVIGATE → ACT**

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- SQLite + Prisma (seeded demo data)
- Demo student auth + password-gated admin CMS
- Topology campus map (SVG) — relative layout, **no fabricated GPS/distances**

## Quick start

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Reset database

```bash
npm run db:reset
```

## Demo credentials

| Role | How |
|------|-----|
| Demo student | Click **Demo as Aarav** (fictional: Aarav Sen, B.Tech CSE — AI & ML) |
| Admin | `/admin` with `ADMIN_PASSWORD` from `.env` (default in `.env.example`) |

Secrets live only in environment variables — never hardcode production secrets.

## Demo flow

1. Home → search **“Where is my AI class?”**
2. Open the AI course card
3. **Navigate to class** → map animates topology route (Main Gate → Plaza → SOET)

## Knowledge layer

Institutional records include: `sourceURL`, `sourceTitle`, `sourceType`, `retrievedAt`, `lastVerified`, `confidence`, `status`.

- **OFFICIAL** vs **SECONDARY** are labelled in UI
- Secondary sources are **never** presented as official policy
- Conflicts surface as **“Information discrepancy detected”** with sources

## Map principles

- Nodes use relative SVG coordinates (`x`, `y` in a 0–1000 / 0–800 viewBox)
- Edges carry **relative hop weights** (not metres)
- Routes are Dijkstra over `CampusNode` / `CampusEdge` only
- Admins can add/edit nodes and edges in Admin CMS

## Modules

Home · Map · Campus Pulse · Academic OS · Academic Universe (10 schools) · People OS · Clubs (15 + quiz) · Events · Notices (What changed?) · Exams (no fake grades) · Library · Hostel · Food · Sports/Wellness · Research · Innovation (Submit Idea) · Career (non-official heuristic) · Global Adamas · Service Hub · AURA · My Campus · Notifications · Safety · Accessibility · Onboarding · Admin CMS

Mobile bottom nav: **Home | Map | Academics | Events | More**  
Desktop: sidebar layout

## Leadership (seeded with sources)

- Prof. (Dr.) Samit Ray — Founder Chancellor
- Prof. (Dr.) Naveen Das — Vice Chancellor (Officiating)

Source: Adamas University official website references in seed metadata.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server |
| `npm run build` | Prisma generate + Next production build |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Force reset DB + seed |

## Licence

Private / institutional demo for Adamas University CampusOS.
