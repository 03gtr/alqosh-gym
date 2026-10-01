# Adding content to ALQOSH GYM

Everything is data-driven. Add data → run `npm test` → build. Pages, search, filters, muscle pages, the workout builder, the sitemap and QR codes update automatically.

## 1. Add an exercise

1. Open the category file in `src/data/exercises/` (e.g. `chest.ts`).
2. Append an object that follows `src/data/exercises/types.ts`. Copy an existing entry as a template.
3. Use only keys from `src/data/taxonomy.ts` for muscles, equipment, patterns, types, eras and goals. Need a new piece of equipment or muscle? Add it to the taxonomy with Arabic + English labels and search terms.
4. Run `npm test`. The data-integrity tests check unique slugs, valid taxonomy values, existing alternatives, complete Arabic + English text, and more.

Rules:

- **`slug` is permanent.** Printed QR codes point to `/exercises/<slug>/`. Never rename a published slug.
- Real exercise names only. Put other names in `aliases` (English) and `arabicAliases` (Arabic / gym slang) — never create a second entry for an alias.
- `steps`: 3–5 short steps covering start → movement → end → return.
- `difficulty` is a general guide, not a medical classification.
- Cardio, warm-up, mobility, stretching and holds need a `prescription` (time / holds / reps).

## 2. Exercise visuals (animation + green target muscle)

Every exercise page shows the best visual available, in this order:

1. **Professional media** (WebM/MP4 or WebP/GIF in `public/media/exercises/`, see below) — always wins.
2. **Generated SVG animation** — a native, data-driven movement template (no external GIFs) with play/pause, replay and 0.5× controls, a ghost of the end position, direction arrows and a synced phase strip (start → movement → end → return).
3. **Static anatomical illustration** — front + back body maps.

In all three, the muscle panel and body maps use one rule site-wide: **GREEN = target muscle** (`primaryMuscles`), subtle grey = secondary muscles. Colours come from the exercise data through one mapping layer (`src/visual/anatomy.ts` + `src/visual/shapes.ts`), never from the template.

### Give an exercise a generated animation

1. Pick (or add) a template in `src/visual/library.ts` — templates are grouped by pattern: press, push-up, pull, row, hinge, squat, lunge, curl, extension, raise, carry, core/rotation, cardio, mobility, stretching.
2. Map the slug to it in `VISUAL_ASSIGNMENTS` (`src/visual/assign.ts`).
3. Run `npm test`. The **quality gate** (`checkVisual`) only publishes the animation when every primary muscle has a visible region in that figure view and the template's targets overlap the primary muscles; otherwise the page automatically falls back to the static illustration. Never force a mismatch — leave the exercise unassigned instead.
4. Review it at **`/visuals-review/#<template-id>`** (or `#id1,id2` to compare): every keyframe, props and targets. The page is not indexed or linked.

**Coach review gate:** set `REVIEW.requireApproval = true` in `assign.ts` and list approved slugs in `REVIEW.approved` to publish only coach-approved animations. Templates are simplified educational diagrams — a coach should review them before relying on them.

### Add professional media (overrides the generated animation)

Drop files into `public/media/exercises/`, named after the slug — no code change needed:

| File | Use |
| --- | --- |
| `<slug>.webm` and/or `<slug>.mp4` | Short silent looping video (preferred — smallest) |
| `<slug>.webp` or `<slug>.gif` | Animated image (if no video) |
| `<slug>-poster.webp` (or `.avif`/`.jpg`/`.png`) | Still frame — used on cards and before the video loads |
| `<slug>.credit.txt` | One line: who made / licensed the media (shown on the page) |

Guidelines:

- Only use media you own or are licensed to use, and add the credit file.
- Show the four phases clearly: start → movement → end position → return.
- Keep files small: 3–6 s loops, ≤ 720 px wide, ideally < 1 MB (WebM/MP4 H.264, muted). Posters ≤ 60 KB WebP.
- Videos autoplay only when visible and never when the user prefers reduced motion; a play/pause button is always shown.

## 3. Goal journeys, women's pathway and coaching team

- **Goal journeys** (`/goals/<goal>/`) are data in `src/data/goals.ts`: each goal is an ordered list of steps that link to existing pages (calculator with `?goal=`, meal planner with `?goal=`, workout builder with `?goal=…#builder`, the exercise library with filters, articles). Keep wording neutral: no promised weight change, no timelines, no medical claims. `npm test` checks that every step opens an existing page or article.
- **Women's pathway** (`/women/`) reuses the official women's hours, the women's coach and the same tools. Exercises are never split by gender — goal and level decide.
- **Coaching team** lives in `gym.coaches` (`src/config/gym.ts`). Add names, credentials or photos only when officially provided; empty values are simply not shown.

## 4. Add an article

Create the same slug in both languages:

```
src/content/articles/ar/<slug>.md
src/content/articles/en/<slug>.md
```

Frontmatter (validated by `src/content.config.ts`):

```yaml
---
title: "..."
description: "One sentence (≤ 160 characters)"
topics: [nutrition]          # nutrition and/or health
order: 210                   # sort order in listings
icon: "🥗"
updated: 2026-10-01
sources:
  - title: "..."
    publisher: "..."
    year: 2017
    doi: "10.xxxx/xxxxx"
    url: "https://doi.org/10.xxxx/xxxxx"
---
```

- No top-level `#` heading (the page renders the title). Use `##` sections.
- Internal links are root-relative (`/calculator/`, `/en/calculator/`) — the build adds the deployment base path.
- Every specific number or scientific claim needs a verifiable source in `sources`. Check DOIs at `https://doi.org/api/handles/<doi>`.

Guides (Beginner, PRO, Classic vs Modern) live in `src/content/guides/{ar,en}/`.

## 5. Tips, meals and UI text

- Daily tips: `src/data/tips.ts` (bilingual, short, no medical claims).
- Meal examples: `src/data/meals.ts` (familiar local foods; no calorie numbers per meal).
- Interface text: `src/i18n/ui.ts` — Arabic first; TypeScript fails the build if an English key is missing.

## 6. Gym information

Edit `src/config/gym.ts` only with officially confirmed information (hours, benefits, coach details, contact, map, social links). Empty values are simply not shown.

## 7. QR codes

`/qr/` lists every exercise with a print-ready QR code (filter by category, then print or save as PDF). Each SVG is also available at `/qr/<slug>.svg`. QR codes encode the canonical Arabic page; it links to English.
