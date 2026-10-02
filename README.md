# ALQOSH GYM — قاعة القوش جم

The official website of **ALQOSH GYM** (نادي القوش الرياضي): gym information, a bilingual exercise encyclopedia, and fitness & nutrition education — built mobile-first for members using their phones inside the gym.

It runs on **IQ GYM** (ܒܹܝܬ ܕۊܪܵܫܵܐ), IQ Group's reusable fitness-companion product; Alqosh Gym is its first gym instance. See **[docs/PRODUCT.md](docs/PRODUCT.md)** for the product/gym architecture.

> Supported & developed by [IQ Group](https://iq-group.app) · بدعم وتطوير IQ Group

## What's inside

| Area | Route (Arabic · English) |
| --- | --- |
| Home — hero, goal entry points, exercise search, beginner start, tools, gym info, permanent benefits, coaching team | `/` · `/en/` |
| My goal (هدفي) — 8 data-driven journeys: weight loss, muscle gain, maintain, fitness, beginner (beginner mode), powerlifting, fitness & conditioning, home training | `/goals/`, `/goals/<goal>/` |
| Home workout — time → equipment → goal → a ready session from the same library | `/workouts/home/` |
| My progress (MY IQ GYM) — goal, level, favourites, completed exercises, streak, saved plan, export/restore/clear; on-device only, no account | `/progress/` |
| Learning guides — gradual weight loss, natural muscle gain, recovery & sleep | `/learn/<slug>/` |
| Women's pathway — women's hours, women's coach, goals and tools | `/women/` |
| Exercise library — bilingual search + 8 filters (incl. pathway: powerlifting, conditioning, home), beginner mode | `/exercises/` |
| Exercise pages (one per exercise, QR-ready) | `/exercises/<slug>/` (alias `/exercise/<slug>/`) |
| Muscle explorer | `/muscles/`, `/muscles/<category>/` |
| Workout builder (incl. powerlifting, gym/home equipment, save as my plan) + men/women pathways | `/workouts/` |
| Calorie (BMR/TDEE) & macro calculator | `/calculator/` |
| Simple meal planner (Iraqi foods, hand portions) | `/nutrition/meals/` |
| Nutrition guide & Health articles | `/nutrition/`, `/health/`, `/articles/<slug>/` |
| Beginner hub · PRO hub · Classic vs Modern | `/beginner/`, `/advanced/`, `/classic-vs-modern/` |
| Gym information (hours, contact, permanent benefits, coaching team) | `/gym/` |
| QR guide for gym staff — print-ready codes for equipment | `/qr/` (SVGs at `/qr/<slug>.svg`) |

Arabic (RTL) is the default language at the root; English (LTR) lives under `/en/`.

## Stack

- [Astro](https://astro.build) static site (no backend, no accounts, no tracking) — deploys to GitHub Pages or any static host. Local progress uses `localStorage` on the visitor's device only.
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

All gym facts live in **`src/config/gym.ts`** (the gym instance; product-wide settings are in `src/config/product.ts`) — hours, permanent benefits, the permanent-discount statement, the coaching team, and the official phone/WhatsApp, Google Maps and Facebook links. A street address, opening days and coach credentials have not been provided and stay empty; the UI renders nothing for missing values.

## Architecture notes (future work — not part of V1.2)

**Visitor analytics.** The site ships no tracking. The contract for future analytics is `src/utils/analytics.ts` (provider "none" today: collects nothing, `getPublicStats()` returns `null`, so no visitor numbers are ever shown). A real provider must implement `AnalyticsProvider`, tag events with the `gymId`, be disclosed with appropriate consent, and only publish aggregates (small groups suppressed). Gender is never inferred. Details in [docs/PRODUCT.md](docs/PRODUCT.md).

**Multiple gyms.** Gym identity lives only in `src/config/gym.ts` (id, name, wordmark, colours, hours, benefits, coaches, contact, gym-specific copy) plus the colour tokens in `src/styles/global.css`; reusable components read it instead of hard-coding the name (a test enforces this). The exercise library, search, visual/animation engine, calculators, meal planner and workout builder (`src/data`, `src/utils`, `src/visual`, `src/scripts`) never import gym identity. A future multi-gym build would replace `gym.ts` with a per-gym config (gymId, domain, branding) selected at build time, without touching the exercise engine.

## Adding content

See **[docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md)** for exercises, animations, articles, tips, meals and QR codes.

## Content policy

- No invented exercise names, gym facts, hours, discounts, contact details, coach credentials, statistics or research.
- Scientific numbers in articles must cite a verifiable source (DOI/URL) in the article frontmatter.
- Exercise visuals: professional media when provided, otherwise a native SVG movement animation (quality-gated, reviewable at `/visuals-review/`), otherwise a static anatomical illustration. **GREEN = target muscle** everywhere. See [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md#2-exercise-visuals-animation--green-target-muscle).
- Fitness education only — not medical diagnosis or treatment.

© 2026 Alqosh Gym
