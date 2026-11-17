import { getCollection } from 'astro:content';
import aliasData from '../data/aliases.json';

const aliases = aliasData as Record<string, string>;
/** Map a name as written in a season file to its canonical spelling. */
export const canonical = (name: string) => aliases[name] ?? name;

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Person = {
  name: string;
  slug: string;
  years: number[]; // seasons played
  captain: number[]; // seasons as captain
  coachYears: number[]; // seasons coached
  awards: { year: number; award: string }[];
  highlights: { year: number; text: string }[];
};

/** People are derived from season rosters and coaches — no separate files to maintain. */
export async function getPeople(): Promise<Person[]> {
  const seasons = await getCollection('seasons');
  const map = new Map<string, Person>();
  const get = (raw: string) => {
    const name = canonical(raw);
    const slug = slugify(name);
    const p = map.get(slug) ?? { name, slug, years: [], captain: [], coachYears: [], awards: [], highlights: [] };
    map.set(slug, p);
    return p;
  };
  for (const s of seasons) {
    const captains = s.data.captains.map(canonical);
    for (const raw of s.data.roster) {
      const p = get(raw);
      p.years.push(s.data.year);
      if (captains.includes(p.name)) p.captain.push(s.data.year);
    }
    for (const raw of s.data.coaches) get(raw).coachYears.push(s.data.year);
    for (const h of s.data.highlights) get(h.name).highlights.push({ year: s.data.year, text: h.text });
    for (const a of s.data.awards) get(a.name).awards.push({ year: s.data.year, award: a.award });
  }
  const sorted = (a: number[]) => [...new Set(a)].sort();
  return [...map.values()].map((p) => ({
    ...p, years: sorted(p.years), captain: sorted(p.captain), coachYears: sorted(p.coachYears),
    awards: [...p.awards].sort((a, b) => a.year - b.year),
    highlights: [...p.highlights].sort((a, b) => a.year - b.year),
  }));
}

/** Everyone who played, most seasons first. */
export async function getPlayers(): Promise<Person[]> {
  return (await getPeople())
    .filter((p) => p.years.length > 0)
    .sort((a, b) => b.years.length - a.years.length || a.name.localeCompare(b.name));
}

/** Everyone who coached, most seasons coached first. */
export async function getCoaches(): Promise<Person[]> {
  return (await getPeople())
    .filter((p) => p.coachYears.length > 0)
    .sort((a, b) => b.coachYears.length - a.coachYears.length || a.name.localeCompare(b.name));
}
