# IQ GYM — product architecture (V1.2 Foundation)

```
IQ Group                    technology / product company (src/config/product.ts → company)
 └─ IQ GYM · ܒܹܝܬ݂ ܕܲܪܵܫܘܼܬ݂ܵܐ     the fitness product = this codebase (src/config/product.ts → product)
     └─ Alqosh Gym          first gym instance (src/config/gym.ts)
         قاعة القوش جم
```

IQ Group builds the product; it does not operate the gym. In the gym experience the gym's
brand leads, IQ GYM appears in the splash, footer ("Runs on IQ GYM") and About page, and
the IQ Group credit stays secondary.

> The Syriac product name is stored exactly as supplied by IQ Group, in one place:
> `product.syriacName`. The splash, footer and About page wordmark all read it from there.

## Official artwork, icons and installation

`public/brand/iq-gym-logo.jpg` is the official IQ GYM logo exactly as supplied (1280×1280 JPEG,
black background; a test pins its SHA-256). Everything else in `public/brand/` is a scaled or
cropped copy — never redrawn — listed in `brandAssets` (src/config/product.ts):

| File | Content | Used for |
| --- | --- | --- |
| `iq-gym-icon-192.png`, `iq-gym-icon-512.png`, `apple-touch-icon.png` (180) | complete logo, scaled | manifest icons, iPhone home screen |
| `iq-gym-icon-maskable-512.png` | complete logo at 74 % on its own black background | Android adaptive (circular) icon |
| `favicon-16.png`, `favicon-32.png`, `iq-gym-mark-96.webp` | crop of the king and ring (x 330, y 20, 600×600) — the full logo is unreadable at tab size | browser tab, footer mark, install hint |
| `iq-gym-logo-512.webp` | complete logo, scaled | splash, About, install page |

The original JPEG is also the `og:image`/`twitter:image` for link previews.

Installation: `/manifest.webmanifest` (generated from `src/utils/manifest.ts`, base-aware) declares
IQ GYM, `display: standalone` and the icons. There is **no service worker** and no offline caching,
so the installed app always loads the live site. `/install/` explains installation: the button
appears only when the browser fires `beforeinstallprompt` and opens the browser's own prompt;
iPhone/iPad get the Safari Share → "Add to Home Screen" steps (iOS has no install prompt). On iPhone
the home-screen app keeps its own storage, so local progress moves via export/restore.

## What is product vs. gym

| Product (shared, `src/config/product.ts`, `src/data`, `src/utils`, `src/visual`) | Gym instance (`src/config/gym.ts`) |
| --- | --- |
| Exercise database, anatomy, animations, search, filters | `id`, name, alt name, wordmark, colours |
| Goal journeys, pathways (powerlifting, conditioning, home) | Hours, benefits, discount policy |
| Calculator, meal planner, workout builders | Coaching team, contact, map, socials |
| Guides & articles, local progress, splash, analytics contract | Gym-specific copy (description, identity, About intro) |

Reusable components never hard-code the gym name (enforced by `tests/product.test.ts`).
Colour tokens live in `src/styles/global.css` and are mirrored in `gym.brand.colors`.

## Splash

`BaseLayout` shows IQ GROUP → IQ GYM + Syriac name → the gym, for ~0.9 s:
- only on the first page of a browser session (`sessionStorage`), never on exercise pages
  (QR landings), never with `prefers-reduced-motion`, never in print;
- the page is fully rendered underneath and the overlay ignores taps — nothing waits for it.
Settings: `splash` in `product.ts`.

## Goals and pathways (data-driven)

- `src/data/goal-ids.ts` — the ids (small, shipped to the browser).
- `src/data/goals.ts` — one object per goal: title, intro, ordered steps (each a real page),
  optional `beginnerMode`, `homeBuilder`, and `exerciseGroups` (curated slugs or a rule).
  Adding a goal = one object + its id; routes are generated automatically.
- `src/data/programs.ts` — discovery metadata over the one exercise database:
  `powerlifting` (curated existing slugs), `conditioning`, `home-bodyweight`, `home-equipment`
  (derived from equipment / category / type). Exposed as the library's "Pathway" filter
  (`/exercises/?program=…`). Nothing changes slugs, levels or anatomy.
- Experience level = the existing `difficulty` field (all 199 exercises), shown in words
  ("مناسب للمبتدئين / متوسط / متقدم") with neutral bars — never green.

## Local progress (no account)

`src/utils/progress.ts` (pure, tested) + `src/scripts/progress-store.ts` (browser).

- Key `iqGymLocal.v1` in `localStorage`; schema version 1.
- Stores: preferences (goal, level, beginner mode, motivation on/off), favourite slugs,
  completed `{slug, date}` (once per exercise per day), completed sessions, recent slugs,
  active days, saved builder plan. No names, measurements, gender, passwords or tokens.
- Malformed data is repaired (invalid entries dropped) or reset; the dashboard says so.
  Unknown/newer versions reset. Nothing ever throws to the page.
- Export → JSON file (`kind: iq-gym-local-progress`, `schema: 1`); import validates kind,
  version, size and every field, and asks before replacing. "Clear" asks for confirmation
  and only removes this device's data.
- Streak = consecutive days the user recorded something, ending today or yesterday.
- Motivation: one short message at meaningful moments (exercise/session recorded, return
  after ≥3 days, streak milestones 3/7/14/30/60/100); can be switched off; tests block
  shaming or comparison wording.

Future path: local progress → account → cloud sync (not in this phase). The state carries
`gymId` so it can be attached to a gym later.

## Analytics & privacy boundary

`src/utils/analytics.ts` defines the contract only:

- `AnalyticsEvent` (page/exercise/QR/goal/search/workout events) carries `gymId` and has no
  user id, name, gender, IP or fingerprint.
- Provider today: `none` — `track()` does nothing; `getPublicStats()` returns `null`, so the
  UI shows no visitor numbers (a test checks pages contain no visitor counters).
- A static site cannot count visitors across devices truthfully; real numbers need a real
  analytics service, disclosed to users with appropriate consent.
- Gender is never inferred (name, device, behaviour, IP, browser, language). If ever
  collected it must be voluntary (`VoluntaryGender`: man / woman / prefer not to say), never
  required, and published only in aggregates with small groups suppressed
  (`suppressSmallGroups`, `analytics.minGroupSize`).
- QR scans can't be told apart from other visits without changing printed URLs; the QR URLs
  are deliberately unchanged.

## Multi-gym (later)

Not implemented. The boundary is ready: a per-gym config (id, domain, branding, coaches,
sections, content overrides) selected at build time, sharing the exercise engine, anatomy,
animations, search and education. Analytics and local data are already keyed by `gymId`.
