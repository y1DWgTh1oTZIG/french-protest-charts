/* ================================================= population denominators
 *
 * Rules, and they are the whole file:
 *   1. Default geography is France ENTIÈRE. The ministry's national counts
 *      include overseas events, so a metropolitan base would shrink the
 *      denominator while the numerator kept them.
 *   2. A missing denominator returns null. Never a fallback to another
 *      geography or another year: 1968 has no France-entière row in this
 *      vintage, and a silent substitution is a wrong chart nobody sees.
 *   3. Population is a stock, turnout is a flow. A single day is compared
 *      with a 1 January figure. Standard — and the note says so.
 *
 * Vintage: INSEE, « Population au 1er janvier », January 2026 release.
 * The 2026 figures are provisional (frozen end-2025); INSEE revises this
 * series annually. Re-check and bump VINTAGE on each release.
 *
 * ── There is ONE population type ──────────────────────────────────────────
 * This file used to also declare a `Pop` interface whose metropolitan field
 * was spelled `metropole`. Nothing constructed it, `denominator()` read it,
 * and because esbuild does not type-check, the mismatch compiled cleanly and
 * made every 1968 share null at runtime. Deleted: `Population` is the only
 * shape, and its field is `metro`.
 */

export const VINTAGE =
  "INSEE, « Population au 1er janvier » — édition janvier 2026";

export type PopBasis = "france" | "metro" | "aged15_64" | "active";

export interface Population {
  /** ISO date of the estimate. Census date where a census is the source. */
  readonly at: string;
  /** France entière (five overseas departments). null = absent from vintage. */
  readonly france: number | null;
  /** Metropolitan France. Always present. */
  readonly metro: number;
  /** Resident population aged 15–64 — published nationally only. */
  readonly aged15_64?: number;
  /** Population active au sens du BIT, annual average, not a same-day stock. */
  readonly active?: number;
}

export const POPULATION: Readonly<Record<string, Population>> = {
  /* 1968 has one base only. INSEE, RP1968 in the 1 January 2026 geography:
     49 711 853. Not 49 723 072 — that is the older "sans doubles comptes"
     figure, 11 000 people adrift. Dated to the census, not to 1 January. */
  "1968": { at: "1968-03-07", france: null, metro: 49_711_853 },
  "2006": { at: "2006-01-01", france: 63_186_117, metro: 61_399_733 },
  "2018": { at: "2018-01-01", france: 66_992_000, metro: 64_844_000 },
  "2019": { at: "2019-01-01", france: 67_258_000, metro: 65_097_000 },
  "2023": { at: "2023-01-01", france: 68_405_000, metro: 66_165_815 },
  "2025": { at: "2025-01-01", france: 68_852_000, metro: 66_579_000 },
  "2026": {
    at: "2026-01-01",
    france: 69_082_000,
    metro: 66_793_000,
    aged15_64: 42_514_000, // summed from the age-by-age table — an estimate
    active: 31_800_000, // 2025 annual average; the 2026 release is not out
  },
};

export const KEY_2026 = "2026";
export const KEY_1968 = "1968";

/** Which base each historical movement is read against. `gj` spans 2018–19;
 *  the two bases differ by 0.4 %, which is immaterial at this precision. */
const EPISODE_POP = {
  may68: "1968",
  cpe: "2006",
  gj: "2018",
  nahel: "2023",
  pensions: "2023",
  bt: "2025",
  students26: "2026",
} as const satisfies Record<string, string>;

/** Deliberately `string`, not `EpisodeId`: an unmapped id yields "" → null,
 *  which is the loud failure this file is built to produce. */
export const popKeyFor = (id: string): string =>
  (EPISODE_POP as Record<string, string>)[id] ?? "";

export const population = (key: string): Population | null =>
  POPULATION[key] ?? null;

export const pop2026 = (): Population | null => population(KEY_2026);

/** Which base a rate is actually computed on. Never a silent substitution:
 *  every caption and every column header that prints a rate calls this and
 *  prints the answer with it. */
export function basisOf(pop: Population | null): "france" | "metro" | null {
  if (!pop) return null;
  if (pop.france !== null) return "france";
  return pop.metro > 0 ? "metro" : null;
}

export function denominator(pop: Population | null): number | null {
  if (!pop) return null;
  if (pop.france !== null) return pop.france;
  return pop.metro > 0 ? pop.metro : null;
}

/** `v` is a head count, the return is a percentage (0.4023 = 0.40 %). */
export function pctOfValue(
  v: number | null,
  pop: Population | null,
): number | null {
  if (v === null || !Number.isFinite(v) || !(v > 0)) return null;
  const d = denominator(pop);
  if (d === null || !(d > 0)) return null;
  return (v / d) * 100;
}
