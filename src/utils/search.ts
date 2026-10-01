/**
 * Bilingual (Arabic / English) exercise search.
 *
 * Shared by the build (to precompute each exercise's search document) and the
 * browser (to score queries), so behaviour is identical everywhere.
 */

/** Nonspacing marks: Latin accents and Arabic tashkeel / hamza marks (after NFKD). */
const MARKS = /\p{Mn}/gu;
const TATWEEL = /ـ/g;

/** Normalise text for matching: case, Arabic letter variants, diacritics, punctuation. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(MARKS, '')
    .replace(TATWEEL, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ة/g, 'ه')
    .replace(/[ڤ]/g, 'ف')
    .replace(/[گ]/g, 'ك')
    .replace(/[چ]/g, 'ج')
    .replace(/[پ]/g, 'ب')
    .replace(/[’'`´]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove a leading Arabic definite article so "الصدر" matches "صدر". */
function stripArticle(token: string): string {
  return token.length > 3 && token.startsWith('ال') ? token.slice(2) : token;
}

export function tokenize(input: string): string[] {
  return normalize(input).split(' ').filter(Boolean).map(stripArticle);
}

/** A precomputed, weighted search document for one exercise. */
export interface SearchDoc {
  /** Canonical names (highest weight). */
  names: string;
  /** Aliases / colloquial names. */
  aliases: string;
  /** Muscles, category, equipment, pattern, tags. */
  meta: string;
  /**
   * What the item mainly trains (its own category + primary muscles). A match
   * here adds a bonus, so "back" ranks back exercises above "back squat".
   */
  focus?: string;
}

export function buildSearchDoc(parts: { names: string[]; aliases: string[]; meta: string[]; focus?: string[] }): SearchDoc {
  // Entries are wrapped as "| a b | c d |" so whole-entry matches can be detected.
  const join = (xs: string[]) => ` | ${xs.map((x) => tokenize(x).join(' ')).filter(Boolean).join(' | ')} | `;
  const doc: SearchDoc = { names: join(parts.names), aliases: join(parts.aliases), meta: join(parts.meta) };
  if (parts.focus?.length) doc.focus = join(parts.focus);
  return doc;
}

/**
 * Score a document against a query. Every query token must match somewhere
 * (AND semantics); returns 0 when the document does not match.
 */
export function scoreDoc(doc: SearchDoc, query: string): number {
  const tokens = tokenize(query);
  if (!tokens.length) return 1;
  let total = 0;
  for (const tok of tokens) {
    const s = scoreToken(doc, tok);
    if (s === 0) return 0;
    total += s;
  }
  const phrase = tokens.join(' ');
  // The query IS one of the exercise's names / aliases (e.g. "بنش" → bench press).
  if (doc.names.includes(`| ${phrase} |`)) total += 120;
  else if (doc.aliases.includes(`| ${phrase} |`)) total += 100;
  // A multi-word query appears as a phrase inside a name / alias (single words
  // are already scored per token — a bonus there would let "back" prefer
  // "back squat" over actual back exercises).
  else if (tokens.length > 1 && doc.names.includes(` ${phrase} `)) total += 50;
  else if (tokens.length > 1 && doc.aliases.includes(` ${phrase} `)) total += 25;
  // Tie-breaker: prefer shorter (more general) names.
  return total - doc.names.length / 1000;
}

function scoreToken(doc: SearchDoc, tok: string): number {
  const base = baseTokenScore(doc, tok);
  if (base === 0 || !doc.focus) return base;
  if (doc.focus.includes(` ${tok} `)) return base + 25;
  if (doc.focus.includes(` ${tok}`)) return base + 15;
  return base;
}

function baseTokenScore(doc: SearchDoc, tok: string): number {
  const word = ` ${tok} `;
  const prefix = ` ${tok}`;
  if (doc.names.includes(word)) return 30;
  if (doc.aliases.includes(word)) return 24;
  if (doc.names.includes(prefix)) return 20;
  if (doc.aliases.includes(prefix)) return 16;
  if (doc.meta.includes(word)) return 10;
  if (doc.meta.includes(prefix)) return 7;
  // Substring match for longer fragments (e.g. "بنش" inside "بنشبرس").
  if (tok.length >= 3 && (doc.names.includes(tok) || doc.aliases.includes(tok))) return 5;
  if (tok.length >= 3 && doc.meta.includes(tok)) return 3;
  return 0;
}
