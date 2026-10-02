#!/usr/bin/env node
/**
 * Post-build QA: verifies that every internal link, image, script and
 * stylesheet referenced from dist/**.html resolves to a built file, that every
 * page has exactly one <h1>, a <title>, lang/dir attributes, and that no
 * internal link points outside the configured base path. Release checks:
 * absolute self-URLs (canonical, hreflang, og:url, sitemap) stay on
 * SITE_URL + BASE_PATH, no localhost/dev URL leaks, every exercise has a page,
 * a short alias and a QR code that encodes exactly its public URL, and the
 * official contact links are present and well-formed.
 *
 * Usage: npm run build && npm run check:links   (respects SITE_URL, BASE_PATH)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import QRCode from 'qrcode';

const DIST = join(process.cwd(), 'dist');
const rawBase = process.env.BASE_PATH ?? '/';
const BASE = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;
const SITE = (process.env.SITE_URL || 'https://03gtr.github.io').replace(/\/+$/, '');
const ORIGIN_BASE = SITE + BASE;

if (!existsSync(DIST)) {
  console.error('dist/ not found — run the build first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const problems = [];

function resolveTarget(urlPath) {
  if (!urlPath.startsWith(BASE)) return { outside: true };
  const rel = decodeURIComponent(urlPath.slice(BASE.length));
  const candidates = rel === '' || rel.endsWith('/')
    ? [join(DIST, rel, 'index.html')]
    : [join(DIST, rel), join(DIST, rel, 'index.html'), join(DIST, `${rel}.html`)];
  return { exists: candidates.some((c) => existsSync(c)) };
}

const ATTR = /\s(?:href|src|poster)="([^"]+)"/g;
let linkCount = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const where = relative(DIST, file);
  const isRedirect = html.includes('http-equiv="refresh"');

  if (!/<html[^>]+lang="(ar|en)"[^>]+dir="(rtl|ltr)"/.test(html)) problems.push(`${where}: missing lang/dir on <html>`);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${where}: missing <title>`);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (!isRedirect && h1 !== 1) problems.push(`${where}: expected 1 <h1>, found ${h1}`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="/.test(img)) problems.push(`${where}: <img> without alt attribute`);
  }

  for (const m of html.matchAll(ATTR)) {
    let raw = m[1];
    // Absolute links to this site (canonical, hreflang alternates) must stay on SITE_URL + BASE_PATH.
    if (raw.startsWith(SITE + '/')) {
      if (!raw.startsWith(ORIGIN_BASE)) { problems.push(`${where}: self-URL "${raw}" is outside ${ORIGIN_BASE}`); continue; }
      raw = raw.slice(SITE.length);
    }
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(raw) || raw.startsWith('//')) continue;
    if (raw.startsWith('?')) continue; // same-page query (e.g. workout presets)
    linkCount++;
    const urlPath = raw.split('#')[0].split('?')[0];
    if (!urlPath.startsWith('/')) {
      problems.push(`${where}: relative URL "${raw}" (use base-aware absolute paths)`);
      continue;
    }
    const r = resolveTarget(urlPath);
    if (r.outside) problems.push(`${where}: "${raw}" is outside base path ${BASE}`);
    else if (!r.exists) problems.push(`${where}: broken link "${raw}"`);
  }
}

// No development URLs anywhere in the output.
for (const file of files.filter((f) => /\.(html|svg|xml|txt|json|js|css)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  if (/https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)\b/.test(text)) problems.push(`${relative(DIST, file)}: contains a localhost URL`);
}

// og:url must equal the canonical URL.
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const og = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (canonical && !canonical.startsWith(ORIGIN_BASE)) problems.push(`${relative(DIST, file)}: canonical "${canonical}" not under ${ORIGIN_BASE}`);
  if (og && og !== canonical) problems.push(`${relative(DIST, file)}: og:url differs from canonical`);
}

// Sitemap entries stay on the public origin.
for (const file of files.filter((f) => /sitemap-\d+\.xml$/.test(f))) {
  for (const [, loc] of readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!loc.startsWith(ORIGIN_BASE)) problems.push(`sitemap: "${loc}" not under ${ORIGIN_BASE}`);
    else if (!resolveTarget(loc.slice(SITE.length)).exists) problems.push(`sitemap: "${loc}" has no page`);
  }
}

// Every exercise: page, short alias and a QR code encoding exactly its public URL.
const slugs = readdirSync(join(DIST, 'exercises')).filter((n) => existsSync(join(DIST, 'exercises', n, 'index.html')));
let qrCount = 0;
for (const slug of slugs) {
  if (!existsSync(join(DIST, 'exercise', slug, 'index.html'))) problems.push(`exercise/${slug}/: missing short alias`);
  if (!existsSync(join(DIST, 'en', 'exercises', slug, 'index.html'))) problems.push(`en/exercises/${slug}/: missing English page`);
  const qrFile = join(DIST, 'qr', `${slug}.svg`);
  if (!existsSync(qrFile)) { problems.push(`qr/${slug}.svg: missing`); continue; }
  const expected = await QRCode.toString(`${ORIGIN_BASE}exercises/${slug}/`, {
    type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#000000', light: '#ffffff' },
  });
  if (readFileSync(qrFile, 'utf8') !== expected) problems.push(`qr/${slug}.svg: does not encode ${ORIGIN_BASE}exercises/${slug}/`);
  else qrCount++;
}

// Official contact links (src/config/gym.ts) on the gym page, both languages.
for (const page of ['gym/index.html', 'en/gym/index.html']) {
  const html = readFileSync(join(DIST, page), 'utf8');
  for (const needle of ['href="tel:+9647502183800"', 'href="https://wa.me/9647502183800"', 'href="https://maps.app.goo.gl/CoY85ebkDbvYP2EQ6?g_st=ac"', 'href="https://facebook.com/share/19o136kGJc"']) {
    if (!html.includes(needle)) problems.push(`${page}: missing contact link ${needle}`);
  }
}

// Web app manifest: valid JSON, base-aware paths, every icon exists at its declared PNG size.
let manifestIcons = 0;
const manifestFile = join(DIST, 'manifest.webmanifest');
if (!existsSync(manifestFile)) problems.push('manifest.webmanifest: missing');
else {
  let man = null;
  try {
    man = JSON.parse(readFileSync(manifestFile, 'utf8'));
  } catch {
    problems.push('manifest.webmanifest: invalid JSON');
  }
  if (man) {
    for (const key of ['id', 'start_url', 'scope']) if (man[key] !== BASE) problems.push(`manifest: ${key} "${man[key]}" should be "${BASE}"`);
    if (man.display !== 'standalone') problems.push('manifest: display should be "standalone"');
    if (!man.name || !man.short_name) problems.push('manifest: missing name/short_name');
    const sizes = new Set();
    for (const icon of man.icons ?? []) {
      const r = resolveTarget(icon.src);
      if (r.outside || !r.exists) { problems.push(`manifest: icon "${icon.src}" not found`); continue; }
      const png = readFileSync(join(DIST, decodeURIComponent(icon.src.slice(BASE.length))));
      const actual = `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`;
      if (png.toString('ascii', 1, 4) !== 'PNG') problems.push(`manifest: icon "${icon.src}" is not a PNG`);
      else if (actual !== icon.sizes) problems.push(`manifest: icon "${icon.src}" is ${actual}, declared ${icon.sizes}`);
      else manifestIcons++;
      sizes.add(icon.sizes);
    }
    if (!sizes.has('192x192') || !sizes.has('512x512')) problems.push('manifest: needs 192x192 and 512x512 icons');
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) in ${htmlFiles.length} pages:`);
  for (const p of problems.slice(0, 200)) console.error(`  - ${p}`);
  process.exit(1);
}
console.warn(`✓ ${htmlFiles.length} pages, ${linkCount} internal references — all resolve (base ${BASE}).`);
console.warn(`✓ ${slugs.length} exercises: page + English page + short alias + QR (${qrCount} QR codes encode ${ORIGIN_BASE}exercises/<slug>/).`);
console.warn('✓ Self-URLs, sitemap, og:url and contact links verified; no localhost URLs.');
console.warn(`✓ Web app manifest valid (start_url/scope ${BASE}); ${manifestIcons} icons present at their declared sizes.`);
