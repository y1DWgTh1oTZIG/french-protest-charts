import type { Chart } from "chart.js";

export const THEME = {
  ink: "#111827",
  label: "#4b5563",
  muted: "#6b7280",
  grid: "#E5E5E5",
  axisGrid: "rgba(17,24,23,0.06)",
  hollow: "#ffffff",
  dim: 0.18,
} as const;

/** #rrggbb → rgba(). Throws instead of emitting `rgba(NaN, …)`. */
export function alpha(hex: string, a: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`alpha() expects #rrggbb, got "${hex}"`);
  const n = Number.parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ── Segment geometry ────────────────────────────────────────────────────────
   Two facts about Chart.js v4 that the old code got wrong:

   1. A point element has BOTH `.x`/`.y` (canvas pixels) and `.parsed` (scale
      values). Comparing `.x` between endpoints measures pixels, so every
      segment looks like a gap and the whole line is dashed.

   2. `segment.borderDash` is resolved for EVERY ADJACENT PAIR of data indices,
      not once per visible connector, and the resolved styles are then snapped
      onto non-skipped points. With `spanGaps: true` a pair that straddles
      empty slots is still evaluated on its own, so "does this pair jump more
      than one slot" is always false. The question has to be asked about the
      CONNECTOR — the nearest visible point on either side of the pair.        */

export type SegmentCtx = {
  chart?: Chart;
  p0: unknown;
  p1: unknown;
  p0DataIndex?: number;
  p1DataIndex?: number;
};

type PtLike = { readonly v?: number | null; readonly detach?: boolean };
type SeriesLike = readonly (PtLike | null | undefined)[];

/** The DATA index of one endpoint. Never a raw pixel comparison. */
export function segIndex(ctx: SegmentCtx, which: 0 | 1): number | undefined {
  const given = which === 0 ? ctx.p0DataIndex : ctx.p1DataIndex;
  if (typeof given === "number" && Number.isFinite(given)) {
    return Math.round(given);
  }

  const pt = (which === 0 ? ctx.p0 : ctx.p1) as
    | { x?: unknown; parsed?: { x?: unknown } }
    | undefined;

  const parsed = pt?.parsed?.x;
  if (typeof parsed === "number" && Number.isInteger(parsed)) return parsed;

  // last resort: invert the pixel through the x scale
  const px = pt?.x;
  const axis = ctx.chart?.options?.indexAxis === "y" ? "y" : "x";
  const scale = ctx.chart?.scales?.[axis];
  if (typeof px === "number" && typeof scale?.getValueForPixel === "function") {
    const v = scale.getValueForPixel(px);
    if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  }
  return undefined;
}

export interface SpanOpts {
  /** Dash a connector that spans more than this many slots. */
  readonly slots?: number;
  readonly dash?: number[];
  /** Dashed differently when the connector bridges `[a, b]`. */
  readonly holiday?: (a: number, b: number) => boolean;
  readonly holidayDash?: readonly number[];
}

/**
 * Style a segment from the SERIES, so a connector is measured end to end:
 * `[a, b]` are the nearest visible (non-null, non-detached) points enclosing
 * the pair being evaluated. Pairs inside one connector therefore resolve to
 * one identical style and are drawn as one dashed run, not as loose pairs.
 */
export function spanSegment(series: SeriesLike, opts: SpanOpts = {}) {
  const n = series.length;
  const slots = opts.slots ?? 1;
  const dash = opts.dash ?? [6, 4];

  const shown = (i: number): boolean => {
    const p = series[i];
    return !!p && p.v != null && p.detach !== true;
  };

  const connector = (i0: number, i1: number): [number, number] | undefined => {
    let a = Math.max(0, Math.min(i0, i1));
    let b = Math.min(n - 1, Math.max(i0, i1));
    while (a > 0 && !shown(a)) a--;
    while (b < n - 1 && !shown(b)) b++;
    if (!shown(a) || !shown(b) || b <= a) return undefined;
    return [a, b];
  };

  return {
    borderDash: (ctx: SegmentCtx): number[] | undefined => {
      const i0 = segIndex(ctx, 0);
      const i1 = segIndex(ctx, 1);
      if (i0 === undefined || i1 === undefined) return undefined;

      const span = connector(i0, i1);
      if (!span) return undefined;
      const [a, b] = span;

      if (opts.holiday?.(a, b)) return [...(opts.holidayDash ?? [1.5, 3])];
      return b - a > slots + 0.01 ? [...dash] : undefined;
    },
  };
}

/** Pair-level dash for charts WITHOUT `spanGaps` (section C's episode charts).
 *  Where a dataset spans gaps, use `spanSegment` instead — a pair test cannot
 *  see the connector that will actually be stroked. */
export const gapSegment = (slots = 1, dash: number[] = [6, 4]) => ({
  borderDash: (ctx: SegmentCtx): number[] | undefined => {
    const i0 = segIndex(ctx, 0);
    const i1 = segIndex(ctx, 1);
    if (i0 === undefined || i1 === undefined) return undefined;
    return Math.abs(i1 - i0) > slots + 0.01 ? dash : undefined;
  },
});

const live = new Set<Chart>();

export const track = <T extends Chart>(chart: T): T => (live.add(chart), chart);

export function destroyAll(): void {
  for (const chart of live) {
    try {
      chart.destroy();
    } catch (err) {
      console.error("[chart] destroy failed", err);
    }
  }
  live.clear();
}
