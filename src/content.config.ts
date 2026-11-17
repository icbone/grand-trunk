import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per season: src/content/seasons/2004.md
const seasons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seasons' }),
  schema: z.object({
    year: z.number(),
    league: z.string().optional(), // e.g. "TUPA Open"
    division: z.string().optional(),
    record: z.string().optional(), // "8-4"
    finish: z.string().optional(), // "Semifinalist"
    // Canadian Nationals podium finish, shown in the home page honours
    honour: z.enum(['gold', 'silver', 'bronze']).optional(),
    captains: z.array(z.string()).default([]),
    gm: z.string().optional(), // general manager
    coaches: z.array(z.string()).default([]),
    // Individual awards, e.g. { name: "Connor Armstrong", award: "CUC final MVP" }
    awards: z.array(z.object({ name: z.string(), award: z.string() })).default([]),
    // Notable individual moments, e.g. { name: "Cooper Toogood", text: "Layout catch in the final" }
    highlights: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    // Per-player tags for a season, e.g. { "Ian Bone": "Rookie" }
    rosterNotes: z.record(z.string(), z.string()).default({}),
    roster: z.array(z.string()).default([]),
    games: z
      .array(
        z.object({
          date: z.string().optional(),
          opponent: z.string(),
          score: z.string(), // "15-12" (Grand Trunk first)
          result: z.enum(['W', 'L', 'T']),
          note: z.string().optional(),
        }),
      )
      .default([]),
    // Where the facts came from (Facebook post, league page, etc.)
    sources: z.array(z.string()).default([]),
  }),
});

// Lore / history stories: src/content/lore/*.md
const lore = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lore' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(100),
    year: z.number().optional(),
  }),
});

export const collections = { seasons, lore };
