import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({
  title: z.string(),
  publisher: z.string().optional(),
  year: z.number().int().optional(),
  url: z.url().optional(),
  doi: z.string().optional(),
});

/**
 * Articles live in src/content/articles/<lang>/<slug>.md.
 * The same <slug> must exist in every language.
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Listing sections the article appears in. */
    topics: z.array(z.enum(['nutrition', 'health'])).min(1),
    /** Sort order inside a listing (lower first). */
    order: z.number().int(),
    icon: z.string().default('📄'),
    updated: z.coerce.date(),
    sources: z.array(source).default([]),
  }),
});

/** Long-form hubs: beginner, advanced, eras. src/content/guides/<lang>/<slug>.md */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    sources: z.array(source).default([]),
  }),
});

export const collections = { articles, guides };
