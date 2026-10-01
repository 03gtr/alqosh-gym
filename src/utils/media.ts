/**
 * Build-time exercise media resolution (server only).
 *
 * Drop real files into public/media/exercises/ named after the slug and they
 * are picked up automatically — no code change needed:
 *   <slug>.webm / <slug>.mp4      short looping video (preferred, smallest)
 *   <slug>.webp / <slug>.gif      animated image
 *   <slug>-poster.webp|jpg|avif   still frame shown before the animation loads
 * Optional credit text: <slug>.credit.txt (one line).
 *
 * Nothing is faked: when no file exists the page says so honestly.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Exercise, ExerciseMedia } from '../data/exercises/types';

const DIR = join(process.cwd(), 'public', 'media', 'exercises');
const PUBLIC_PREFIX = '/media/exercises/';

function find(slug: string, exts: string[], suffix = ''): string | undefined {
  for (const ext of exts) {
    const file = `${slug}${suffix}.${ext}`;
    if (existsSync(join(DIR, file))) return PUBLIC_PREFIX + file;
  }
  return undefined;
}

export interface ResolvedMedia extends ExerciseMedia {
  hasAnimation: boolean;
}

export function resolveMedia(e: Exercise): ResolvedMedia {
  const explicit = e.media ?? {};
  const creditFile = join(DIR, `${e.slug}.credit.txt`);
  const media: ExerciseMedia = {
    webm: explicit.webm ?? find(e.slug, ['webm']),
    mp4: explicit.mp4 ?? find(e.slug, ['mp4']),
    webp: explicit.webp ?? find(e.slug, ['webp']),
    gif: explicit.gif ?? find(e.slug, ['gif']),
    poster: explicit.poster ?? find(e.slug, ['webp', 'avif', 'jpg', 'jpeg', 'png'], '-poster'),
    credit: explicit.credit ?? (existsSync(creditFile) ? readFileSync(creditFile, 'utf8').trim() : undefined),
  };
  return { ...media, hasAnimation: Boolean(media.webm || media.mp4 || media.webp || media.gif) };
}
