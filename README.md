# ALQOSH GYM — قاعة القوش جم

The official website of **ALQOSH GYM** (نادي القوش الرياضي): gym information, a bilingual exercise encyclopedia, and fitness & nutrition education — built mobile-first for members using their phones inside the gym.

> Supported & developed by [IQ Group](https://iq-group.app) · بدعم وتطوير IQ Group

## What's inside

| Area | Route (Arabic · English) |
| --- | --- |
| Home — hero, goal entry points, exercise search, beginner start, tools, gym info, permanent benefits, coaching team | `/` · `/en/` |
| My goal (هدفي) — goal journeys over the existing tools (weight loss, muscle gain, maintain, fitness) | `/goals/`, `/goals/<goal>/` |
| Women's pathway — women's hours, women's coach, goals and tools | `/women/` |
| Exercise library — bilingual search + 7 filters | `/exercises/` |
| Exercise pages (one per exercise, QR-ready) | `/exercises/<slug>/` (alias `/exercise/<slug>/`) |
| Muscle explorer | `/muscles/`, `/muscles/<category>/` |
| Workout builder + men/women goal pathways | `/workouts/` |
| Calorie (BMR/TDEE) & macro calculator | `/calculator/` |
| Simple meal planner (Iraqi foods, hand portions) | `/nutrition/meals/` |
| Nutrition guide & Health articles | `/nutrition/`, `/health/`, `/articles/<slug>/` |
| Beginner hub · PRO hub · Classic vs Modern | `/beginner/`, `/advanced/`, `/classic-vs-modern/` |
| Gym information (hours, contact, permanent benefits, coaching team) | `/gym/` |
| QR guide for gym staff — print-ready codes for equipment | `/qr/` (SVGs at `/qr/<slug>.svg`) |

Arabic (RTL) is the default language at the root; English (LTR) lives under `/en/`.

## Stack

- [Astro](https://astro.build) static site (no backend, no accounts, no tracking) — deploys to GitHub Pages or any static host.
- TypeScript everywhere; data separated from presentation (`src/data`, `src/content`).
- Vanilla TypeScript islands for search, filters, calculator, meal planner and workout builder (no UI framework shipped).
- Self-hosted fonts (Cairo for Arabic/Latin, Bebas Neue for display).
- Vitest unit tests, ESLint, `astro check`, and a post-build link/HTML checker.

## Getting started

Requires Node.js 22+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run qa         # lint + type-check + tests + build + link check
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built site |
| `npm run lint` | ESLint |
| `npm run check` | Astro/TypeScript type check |
| `npm test` | Unit + data-integrity tests (exercise DB, search, calculator, workout builder) |
| `npm run check:links` | Verifies every internal link/asset in `dist/` resolves, one `<h1>` per page, `lang`/`dir` set |

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.

The workflow passes the Pages origin and base path to the build (`SITE_URL`, `BASE_PATH`), so the site works at `https://03gtr.github.io/alqosh-gym/` or on a custom domain without code changes.

> **QR codes encode the full public URL.** Decide the final domain *before* printing QR codes for the equipment. If the domain changes later, re-print from `/qr/`.

## Official gym information

All gym facts live in **`src/config/gym.ts`** — hours, permanent benefits, the permanent-discount statement, the coaching team, and the official phone/WhatsApp, Google Maps and Facebook links. A street address, opening days and coach credentials have not been provided and stay empty; the UI renders nothing for missing values.

## Architecture notes (future work — not part of V1)

**Visitor analytics.** V1 is fully static and ships no tracking. To add privacy-friendly analytics later (e.g. a cookieless script such as Plausible, GoatCounter or Cloudflare Web Analytics), create one `src/components/Analytics.astro` that renders the provider's `<script>` only when a `PUBLIC_ANALYTICS_*` build variable is set, and include it once in the `<head>` of `src/layouts/BaseLayout.astro`. Every page uses that layout, so no other file changes; set the variable in the GitHub Pages workflow. No backend is needed. Update the privacy wording in the About page and this README when you do.

**Multiple gyms.** Gym identity lives only in `src/config/gym.ts` (name, hours, benefits, coach, phone/WhatsApp, map, socials) plus the brand colour tokens in `src/styles/global.css` and the logo in `src/components/Logo.astro`. The exercise library, search, visual/animation engine, calculators, meal planner and workout builder (`src/data`, `src/utils`, `src/visual`, `src/scripts`) never import gym identity. A future multi-gym build would replace `gym.ts` with a per-gym config (gymId, domain, branding) selected at build time, without touching the exercise engine.

## Adding content

See **[docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md)** for exercises, animations, articles, tips, meals and QR codes.

## Content policy

- No invented exercise names, gym facts, hours, discounts, contact details, coach credentials, statistics or research.
- Scientific numbers in articles must cite a verifiable source (DOI/URL) in the article frontmatter.
- Exercise visuals: professional media when provided, otherwise a native SVG movement animation (quality-gated, reviewable at `/visuals-review/`), otherwise a static anatomical illustration. **GREEN = target muscle** everywhere. See [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md#2-exercise-visuals-animation--green-target-muscle).
- Fitness education only — not medical diagnosis or treatment.

© 2026 Alqosh Gym
