/* ================================================= population denominators
 *
 * A count is not a rate. These are the denominators that turn one into the
 * other, and the rules they impose:
 *
 *   1. Default geography is France ENTIÈRE. The ministry's national counts
 *      include overseas events (Guadeloupe 20 Oct, La Réunion and Mayotte on
 *      24 Oct), so a metropolitan-only base would shrink the denominator
 *      while the numerator kept them.
 *   2. A missing denominator returns null. It never falls back to another
 *      geography or another year: 1968 has no France-entière row in the
 *      current vintage, and a silent fallback is a wrong chart nobody sees.
 *   3. Population is a stock and turnout is a flow: a single day is compared
 *      with a 1 January figure. That is standard, and the note says so.
 *
 * Vintage: INSEE, « population au 1er janvier », January 2026 release. The
 * 2026 figures are provisional (frozen at end-2025) and INSEE revises this
 * series — re-check on each annual release and bump VINTAGE.
 */

import { localeMeta } from "./i18n.ts";
import type { EpisodeId } from "./model.ts";

export const VINTAGE =
  "INSEE, population au 1er janvier — January 2026 release";

export type PopBasis = "france" | "metro" | "aged15_64" | "active";

export interface Population {
  /** ISO date of the estimate — always 1 January. */
  readonly at: string;
  /** France entière (five overseas departments). null = not in this vintage. */
  readonly france: number | null;
  readonly metro: number;
  /** Resident population aged 15–64, published nationally only. */
  readonly aged15_64?: number;
  /** Population active au sens du BIT, annual average — not a same-day stock. */
  readonly active?: number;
}

export const POPULATION: Readonly<Record<string, Population>> = {
  "1968": { at: "1968-01-01", france: null, metro: 49_723_072 },
  "2006": { at: "2006-01-01", france: 63_186_117, metro: 61_399_733 },
  "2018": { at: "2018-01-01", france: 66_992_000, metro: 64_844_000 },
  "2019": { at: "2019-01-01", france: 67_258_000, metro: 65_097_000 },
  "2023": { at: "2023-01-01", france: 68_405_000, metro: 66_165_815 },
  "2025": { at: "2025-01-01", france: 68_852_000, metro: 66_579_000 },
  "2026": {
    at: "2026-01-01",
    france: 69_082_000,
    metro: 66_793_000,
    aged15_64: 42_514_000,
    active: 31_800_000, // 2025 annual average: the 2026 release is not out
  },
};

export const KEY_2026 = "2026";

/** Which denominator each historical movement is read against. `gj` starts in
 *  November 2018; the 2018 and 2019 bases differ by 0.4%, which is immaterial. */
export const EPISODE_POP: Readonly<Record<EpisodeId, string>> = {
  may68: "1968",
  cpe: "2006",
  gj: "2018",
  nahel: "2023",
  pensions: "2023",
  bt: "2025",
  students26: "2026",
};

export const population = (key: string): Population | null =>
  POPULATION[key] ?? null;

export const pop2026 = (): Population | null => population(KEY_2026);

/** The denominator, or null. No fallback, ever. */
export function denominator(
  pop: Population | null,
  basis: PopBasis = "france",
): number | null {
  if (!pop) return null;
  const v = pop[basis];
  return typeof v === "number" && v > 0 ? v : null;
}

/** A proportion (0.008 = 0.8 %), or null. */
export function share(
  count: number,
  pop: Population | null,
  basis: PopBasis = "france",
): number | null {
  const d = denominator(pop, basis);
  return d === null ? null : count / d;
}

/** Residents per 100 000, or null. */
export function per100k(
  count: number,
  pop: Population | null,
  basis: PopBasis = "france",
): number | null {
  const s = share(count, pop, basis);
  return s === null ? null : s * 100_000;
}

/* ----- formatting. Locale-tagged, so 0,80 % in French and 0.80% in English. */

let tag = "";
let pctFmt = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
let intFmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

function sync(): void {
  const next = localeMeta().tag;
  if (next === tag) return;
  tag = next;
  pctFmt = new Intl.NumberFormat(next, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  intFmt = new Intl.NumberFormat(next, { maximumFractionDigits: 0 });
}

export function fmtPct(p: number | null): string {
  sync();
  return p === null ? "—" : pctFmt.format(p);
}

export function fmtRate(v: number | null): string {
  sync();
  return v === null ? "—" : intFmt.format(Math.round(v));
}

/** "0,80 % – 1,16 %" · "0.80% – 1.16%" · a single value when lo === hi. */
export function fmtPctBand(lo: number | null, hi: number | null): string {
  if (lo === null || hi === null) return "—";
  const a = fmtPct(lo);
  return Math.abs(hi - lo) < 1e-9 ? a : `${a} – ${fmtPct(hi)}`;
}

export function fmtRateBand(lo: number | null, hi: number | null): string {
  if (lo === null || hi === null) return "—";
  const a = fmtRate(lo);
  const b = fmtRate(hi);
  return a === b ? a : `${a} – ${b}`;
}
