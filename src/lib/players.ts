import { getCollection } from 'astro:content';
import aliasData from '../data/aliases.json';

const aliases = aliasData as Record<string, string>;
/** Map a name as written in a season file to its canonical spelling. */
export const canonical = (name: string) => aliases[name] ?? name;

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Player = { name: string; slug: string; years: number[]; captain: number[] };

/** Players are derived from season rosters — no separate player files to maintain. */
export async function getPlayers(): Promise<Player[]> {
  const seasons = await getCollection('seasons');
  const map = new Map<string, Player>();
  for (const s of seasons) {
    for (const raw of s.data.roster) {
      const name = canonical(raw);
      const slug = slugify(name);
      const p = map.get(slug) ?? { name, slug, years: [], captain: [] };
      p.years.push(s.data.year);
      if (s.data.captains.map(canonical).includes(name)) p.captain.push(s.data.year);
      map.set(slug, p);
    }
  }
  return [...map.values()]
    .map((p) => ({ ...p, years: p.years.sort(), captain: p.captain.sort() }))
    .sort((a, b) => b.years.length - a.years.length || a.name.localeCompare(b.name));
}
