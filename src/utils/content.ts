import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/types';

export type Article = CollectionEntry<'articles'>;
export type Guide = CollectionEntry<'guides'>;

/** "ar/protein" → { lang: "ar", slug: "protein" } */
export function splitId(id: string): { lang: string; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang, slug: rest.join('/') };
}

export async function getArticles(lang: Lang, topic?: 'nutrition' | 'health'): Promise<Article[]> {
  const all = await getCollection('articles', (e) => splitId(e.id).lang === lang);
  return all
    .filter((e) => !topic || e.data.topics.includes(topic))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getGuide(lang: Lang, slug: string): Promise<Guide | undefined> {
  const all = await getCollection('guides', (e) => e.id === `${lang}/${slug}`);
  return all[0];
}

/** Rough reading time (≈200 words/min), at least 1 minute. */
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
