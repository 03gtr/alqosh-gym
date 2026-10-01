import type { APIRoute } from 'astro';
import { exercises } from '../data/exercises';
import { toLite } from '../utils/exercise-index';

/** Lightweight exercise index used by search, filters and the workout builder. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(exercises.map(toLite)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
