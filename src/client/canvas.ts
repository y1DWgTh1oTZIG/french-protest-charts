/* Presentation primitives shared by sections A–C, plus the one registry of live
   Chart instances. Both sections previously kept their own (charts[] and a
   module-level WeakMap), so destroy paths diverged. */

import type { Chart } from "chart.js";

export const THEME = {
  ink: "#111827",
  label: "#4b5563",
  muted: "#6b7280",
  grid: "#E5E5E5",
  axisGrid: "rgba(17,24,39,0.06)",
  hollow: "#ffffff",
  dim: 0.18,
} as const;

/** #rrggbb → rgba(). Throws instead of emitting `rgba(NaN, …)` for `#abc` or a name. */
export function alpha(hex: string, a: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`alpha() expects #rrggbb, got "${hex}"`);
  const n = Number.parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

type SegmentCtx = {
  p0: { parsed: { x: number } };
  p1: { parsed: { x: number } };
};

/** Dashed connector wherever a line jumps more than `slots` x-slots. */
export const gapSegment = (slots = 1, dash: number[] = [6, 4]) => ({
  borderDash: (ctx: SegmentCtx) =>
    Math.abs(ctx.p1.parsed.x - ctx.p0.parsed.x) > slots + 0.01
      ? dash
      : undefined,
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
