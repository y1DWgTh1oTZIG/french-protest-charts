/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four series per panel, one shared log count axis.
   Companion: one panel per series, one line per episode on a sequential ramp.
   All copy is resolved from i18n.ts at render time. */

import {
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from "chart.js";
import { compact, fill, fmtSpan, fmtWeek, nf, plural, t } from "./i18n.ts";
import type { Band, Episode, EpisodeId, Flag, Metric, Row } from "./model.ts";
import { STUDENT_WEEKS, noteText } from "./chart.ts";
import type { NoteRef } from "./model.ts";

interface Pt {
  x: number;
  y: number; // midpoint of the published range — this is what gets plotted
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

interface PanelDataset extends ChartDataset<"line", Pt[]> {
  __item: Metric;
  __ep: number;
  __color: string;
  __hollow: boolean[];
  __label: string;
}

/* ------------------------------------------------------------- constants */

const MUTED = "#6b7280";
const GRID = "#E5E5E5";

/** Colour only — labels come from t().items. */
const SERIES: { key: Metric; color: string }[] = [
  { key: "p", color: "#0072B2" },
  { key: "a", color: "#E69F00" },
  { key: "f", color: "#009E73" },
  { key: "i", color: "#CC79A7" },
];
const METRICS: Metric[] = SERIES.map((s) => s.key);

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = [
  "#D6E6F2",
  "#B0CFE6",
  "#86B4D7",
  "#5C97C5",
  "#357AB0",
  "#1B5C92",
  "#0A3A63",
];

const hollow = (f: Flag): boolean =>
  f === "r" || f === "p" || f === "e" || f === "c";

function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------------- data */

const MAY68: Episode = {
  id: "may68",
  start: "1968-04-29",
  end: "1968-06-30",
  weeks: [
    { w: 0, from: "1968-04-29", to: "1968-05-05", p: [25_000, 100_000] },
    {
      w: 1,
      from: "1968-05-06",
      to: "1968-05-12",
      p: 20_000,
      a: [469, 891],
      f: [247, 300],
      i: 100,
      flag: { i: "f" },
    },
    { w: 2, from: "1968-05-13", to: "1968-05-19", p: [230_000, 1_000_000] },
    {
      w: 3,
      from: "1968-05-20",
      to: "1968-05-26",
      a: 1_000,
      i: 887,
      flag: { a: "f", i: "e" },
    },
    { w: 4, from: "1968-05-27", to: "1968-06-02" },
    { w: 5, from: "1968-06-03", to: "1968-06-09" },
    { w: 6, from: "1968-06-10", to: "1968-06-16" },
    { w: 7, from: "1968-06-17", to: "1968-06-23" },
    { w: 8, from: "1968-06-24", to: "1968-06-30" },
  ],
};

const CPE: Episode = {
  id: "cpe",
  start: "2006-02-06",
  end: "2006-04-16",
  weeks: [
    { w: 0, from: "2006-02-06", to: "2006-02-12", p: [200_000, 400_000] },
    { w: 4, from: "2006-03-06", to: "2006-03-12", p: [400_000, 1_000_000] },
    {
      w: 5,
      from: "2006-03-13",
      to: "2006-03-19",
      p: [500_000, 1_500_000],
      a: [156, 167],
      f: 34,
      i: 70,
      flag: { i: "e" },
    },
    {
      w: 6,
      from: "2006-03-20",
      to: "2006-03-26",
      p: [220_000, 450_000],
      a: 630,
      f: 90,
    },
    {
      w: 7,
      from: "2006-03-27",
      to: "2006-04-02",
      p: [1_055_000, 2_710_000],
      a: 600,
    },
    { w: 8, from: "2006-04-03", to: "2006-04-09", p: [1_000_000, 3_100_000] },
    { w: 9, from: "2006-04-10", to: "2006-04-16" },
  ],
};

const GJ_ACTS: [number, string, number][] = [
  [0, "2018-11-17", 287_700],
  [1, "2018-11-24", 166_000],
  [2, "2018-12-01", 136_000],
  [3, "2018-12-08", 136_000],
  [4, "2018-12-15", 66_000],
  [5, "2018-12-22", 38_600],
  [6, "2018-12-29", 32_000],
  [7, "2019-01-05", 50_000],
  [8, "2019-01-12", 84_000],
  [9, "2019-01-19", 84_000],
  [10, "2019-01-26", 69_000],
  [11, "2019-02-02", 58_600],
  [12, "2019-02-09", 51_400],
  [13, "2019-02-16", 41_500],
  [14, "2019-02-23", 46_600],
  [15, "2019-03-02", 39_300],
  [16, "2019-03-09", 28_600],
  [17, "2019-03-16", 32_300],
  [18, "2019-03-23", 40_500],
  [19, "2019-03-30", 33_700],
  [20, "2019-04-06", 22_300],
  [21, "2019-04-13", 31_000],
  [22, "2019-04-20", 27_900],
  [23, "2019-04-27", 23_600],
  [24, "2019-05-04", 18_900],
  [25, "2019-05-11", 18_600],
  [26, "2019-05-18", 15_500],
  [27, "2019-05-25", 12_500],
  [28, "2019-06-01", 9_500],
  [29, "2019-06-08", 10_300],
  [30, "2019-06-15", 7_000],
  [31, "2019-06-22", 11_800],
  [32, "2019-06-29", 5_800],
  [43, "2019-09-07", 7_000],
];

/** Enforcement figures exist only for Acts I–IV; later acts were not published as a series. */
const GJ_EXTRA: Record<number, Pick<Row, "a" | "f" | "i" | "flag">> = {
  0: { a: [974, 1_150], f: 17, i: 109, flag: { f: "e", i: "e" } },
  1: { a: [307, 339], f: 30, i: 54, flag: { i: "e" } },
  2: { a: 630, flag: { a: "f" } },
  3: { a: [1_709, 2_000] },
};

const GILETS: Episode = {
  id: "gj",
  start: "2018-11-12",
  end: "2019-09-09",
  weeks: GJ_ACTS.map(([w, date, n]) => ({
    w,
    from: date,
    to: date,
    act: w + 1,
    p: n,
    ...(GJ_EXTRA[w] ?? {}),
    flag: {
      ...(w === 0 ? { p: "c" as Flag } : {}),
      ...(GJ_EXTRA[w]?.flag ?? {}),
    },
  })),
};

const NAHEL: Episode = {
  id: "nahel",
  start: "2023-06-27",
  end: "2023-07-09",
  weeks: [
    {
      w: 0,
      from: "2023-06-26",
      to: "2023-07-02",
      p: [6_200, 20_000],
      a: 3_354,
      f: 722,
    },
    { w: 1, from: "2023-07-03", to: "2023-07-09", a: 108, f: 1 },
  ],
};

const PENSIONS: Episode = {
  id: "pensions",
  start: "2023-01-19",
  end: "2023-06-08",
  weeks: [
    { w: 0, from: "2023-01-16", to: "2023-01-22", p: [1_120_000, 2_000_000] },
    { w: 2, from: "2023-01-30", to: "2023-02-05", p: [1_270_000, 2_800_000] },
    { w: 3, from: "2023-02-06", to: "2023-02-12", p: [963_000, 2_500_000] },
    { w: 4, from: "2023-02-13", to: "2023-02-19", p: [440_000, 1_300_000] },
    { w: 7, from: "2023-03-06", to: "2023-03-12", p: [1_280_000, 3_500_000] },
    { w: 8, from: "2023-03-13", to: "2023-03-19", p: [480_000, 1_700_000] },
    { w: 9, from: "2023-03-20", to: "2023-03-26", p: [1_089_000, 3_500_000] },
    { w: 10, from: "2023-03-27", to: "2023-04-02", p: [740_000, 2_000_000] },
    { w: 11, from: "2023-04-03", to: "2023-04-09", p: [570_000, 2_000_000] },
    { w: 12, from: "2023-04-10", to: "2023-04-16", p: [380_000, 1_500_000] },
    { w: 16, from: "2023-05-01", to: "2023-05-07", p: [782_000, 2_300_000] },
    { w: 20, from: "2023-06-05", to: "2023-06-11", p: [281_000, 900_000] },
  ],
};

const BLOQUONS: Episode = {
  id: "bt",
  start: "2025-09-10",
  end: "2025-10-05",
  weeks: [
    {
      w: 0,
      from: "2025-09-08",
      to: "2025-09-14",
      p: [175_000, 250_000],
      a: 540,
      flag: { p: "c" },
    },
    {
      w: 1,
      from: "2025-09-15",
      to: "2025-09-21",
      p: [500_000, 1_000_000],
      a: 309,
      f: 26,
      i: 11,
    },
    { w: 3, from: "2025-09-29", to: "2025-10-05", p: [195_000, 600_000] },
  ],
};

/* ------------------------------------------------------------ 2026 rows */

/** The aggregator cannot infer stock / floor / regional-only from a band alone. */
const STUDENT_FLAG_PATCH: Partial<
  Record<number, Partial<Record<Metric, Flag>>>
> = {
  0: { i: "c" },
  5: { i: "f" },
  6: { a: "r" },
};

const STUDENT_SPAN = { start: "2026-10-01", end: "2026-11-11" };

/** Safety net: the brief's weekly table, used only if a whole column arrives empty. */
const STUDENT_FALLBACK: Record<Metric, (Band | null)[]> = {
  p: [
    null,
    [256_000, 450_000],
    [550_000, 800_000],
    [410_000, 800_000],
    [320_000, 500_000],
    [575_000, 1_600_000],
    null,
  ],
  a: [
    [1_949, 1_949],
    null,
    [2_397, 2_628],
    [1_314, 1_435],
    [565, 779],
    [798, 1_002],
    [17, 17],
  ],
  f: [[84, 305], null, [1_037, 1_184], [267, 267], [116, 159], [53, 112], null],
  i: [[119, 235], null, null, [150, 150], null, [18, 18], null],
};

function studentColumn(m: Metric): { bands: (Band | null)[]; pinned: boolean } {
  const live = STUDENT_WEEKS.map((w) => w[m]);
  if (live.some((b) => b !== null))
    return { bands: live as (Band | null)[], pinned: false };
  console.error(
    `[episodes] 2026 weekly "${m}" arrived empty from chart.ts — falling back to the handoff table. Check STUDENT_WEEKS.`,
  );
  return { bands: STUDENT_FALLBACK[m], pinned: true };
}

function rows2026(): Row[] {
  const cols = {
    p: studentColumn("p"),
    a: studentColumn("a"),
    f: studentColumn("f"),
    i: studentColumn("i"),
  } as const;

  return STUDENT_WEEKS.map((wk, idx) => {
    const row: Row = {
      w: idx,
      from: wk.start,
      to: wk.end,
      partial: wk.touchesEdge,
    };

    for (const m of METRICS) {
      const band = cols[m].bands[idx];
      if (!band) continue;

      row[m] = typeof band === "number" ? band : [band[0], band[1]];

      const flag =
        STUDENT_FLAG_PATCH[idx]?.[m] ??
        (cols[m].pinned ? undefined : wk.flags[m]);
      if (flag && flag !== "n") row.flag = { ...row.flag, [m]: flag };

      const ref: NoteRef | undefined = wk.notes[m];
      if (ref) row.noteRef = { ...row.noteRef, [m]: ref };
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: "students26",
  ...STUDENT_SPAN,
  weeks: rows2026(),
};

const EPISODES: Episode[] = [
  MAY68,
  CPE,
  GILETS,
  NAHEL,
  PENSIONS,
  BLOQUONS,
  STUDENTS,
];

/** Last week on which any episode carries an arrest or injury figure (CPE, w7). */
const ENFORCEMENT_LAST = ((): number => {
  let last = 0;
  for (const ep of EPISODES) {
    for (const r of ep.weeks) {
      if (r.a !== undefined || r.f !== undefined || r.i !== undefined)
        last = Math.max(last, r.w);
    }
  }
  return last;
})();

/* ------------------------------------------------------------------ text */

/** Tooltip title: "16 – 22 Jan · 19 Jan", "Act 1 · 17 Nov 2018", "W3 · 12–18 Oct". */
function rowTitle(ep: Episode, r: Row): string {
  const m = t();

  if (ep.id === "students26") {
    const base = fmtWeek(r.from, r.to);
    return r.partial ? fill(m.panels.partialWeek, { label: base }) : base;
  }

  const when =
    r.act !== undefined
      ? fill(m.panels.act, { n: r.act })
      : fmtWeek(r.from, r.to);
  const action = m.episodes[ep.id].weeks[r.w]?.action;
  return action ? fill(m.panels.withAction, { when, action }) : when;
}

function noteFor(id: EpisodeId, r: Row, m: Metric): string | undefined {
  if (id === "students26") {
    return (
      noteText(r.noteRef?.[m]) || t().episodes.students26.fallbackNote?.[m]
    );
  }
  return t().episodes[id].weeks[r.w]?.note?.[m];
}

/* -------------------------------------------------------------- indexing */

const bandOf = (b: Band): [number, number] =>
  typeof b === "number" ? [b, b] : b;
const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

function seriesData(ep: Episode, key: Metric): Pt[] | null {
  const rows = ep.weeks
    .filter((r) => r[key] !== undefined)
    .sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? "n";
  const baseRow = rows.find((r) => flagOf(r) !== "c") ?? rows[0];
  const base = midOf(baseRow[key]!);

  return rows.map((r) => {
    const [low, high] = bandOf(r[key]!);
    return {
      x: r.w,
      y: (low + high) / 2,
      low,
      high,
      flag: flagOf(r),
      note: noteFor(ep.id, r, key),
      base,
      t: rowTitle(ep, r),
    };
  });
}

function buildDataset(
  ep: Episode,
  epIndex: number,
  key: Metric,
  color: string,
  maxX: number,
): PanelDataset | null {
  const all = seriesData(ep, key);
  if (!all) return null;

  const points = all.filter((p) => p.x <= maxX);
  if (!points.length) return null;

  const m = t();
  const drawn = points.map((p) => hollow(p.flag));

  return {
    label: m.items[key].label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: points.map((p) => (p.flag === "c" ? 3 : 2.75)),
    pointBackgroundColor: points.map((_, i) => (drawn[i] ? "#ffffff" : color)),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: {
      borderDash: (ctx) =>
        Math.abs((ctx.p1.parsed.x as number) - (ctx.p0.parsed.x as number)) >
        1.01
          ? [5, 4]
          : undefined,
    },
    __item: key,
    __ep: epIndex,
    __color: color,
    __hollow: drawn,
    __label:
      points.length < all.length
        ? fill(m.panels.seriesContinues, { name: m.episodes[ep.id].short })
        : m.episodes[ep.id].short,
  };
}

function rawExtent(
  eps: Episode[],
  keys: Metric[],
  maxX: number,
): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;

  for (const ep of eps) {
    for (const k of keys) {
      const pts = seriesData(ep, k);
      if (!pts) continue;
      for (const p of pts) {
        if (p.x > maxX) continue;
        if (p.low > 0) lo = Math.min(lo, p.low);
        hi = Math.max(hi, p.high);
      }
    }
  }

  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi <= lo)
    return [1, 1e6];
  return [lo, hi];
}

/* --------------------------------------------------------------- plugins */

/** Only the companion figure labels its lines: there, names differ within a panel. */
const directLabels: Plugin<"line"> = {
  id: "directLabels",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const entries: { y: number; text: string }[] = [];

    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) return;

      for (let j = meta.data.length - 1; j >= 0; j--) {
        const raw = d.data[j];
        if (!raw || !Number.isFinite(raw.y)) continue;
        const el = meta.data[j] as unknown as { x: number; y: number };
        entries.push({ y: el.y, text: d.__label });
        break;
      }
    });

    entries.sort((a, b) => a.y - b.y);
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < 11)
        entries[i].y = entries[i - 1].y + 11;
    }

    ctx.save();
    ctx.font = '500 9.5px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#374151";
    for (const e of entries) {
      const y = Math.max(
        chartArea.top + 5,
        Math.min(chartArea.bottom - 5, e.y),
      );
      ctx.fillText(e.text, chartArea.right + 7, y);
    }
    ctx.restore();
  },
};

/* ---------------------------------------------------------------- scales */

function xScale(maxW: number) {
  const step = maxW <= 8 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: "linear" as const,
    min: -0.5,
    max: maxW + 0.5,
    grid: { display: false },
    border: { display: false },
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      font: { size: 9 },
      color: MUTED,
      padding: 4,
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      const out: { value: number }[] = [];
      for (let v = 0; v <= maxW + 0.001; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s: { height: number }) => {
      s.height = 20;
    },
  };
}

/** Padding in log space keeps every marker off the frame without inventing round bounds. */
function logBounds(lo: number, hi: number): [number, number] {
  const l = Math.log10(Math.max(lo, 1e-6));
  const h = Math.log10(Math.max(hi, l + 0.1));
  const pad = Math.max(0.06, (h - l) * 0.05);
  return [10 ** (l - pad), 10 ** (h + pad)];
}

/** 1-per-decade for wide ranges, 1-and-3 for medium, 1-2-5 for narrow. */
function logTicks(min: number, max: number): number[] {
  const l = Math.log10(min);
  const h = Math.log10(max);
  const span = h - l;
  const mantissas = span > 4.5 ? [1] : span > 1.5 ? [1, 3] : [1, 2, 5];
  const out: number[] = [];

  for (let e = Math.floor(l); e <= Math.ceil(h); e++) {
    for (const mm of mantissas) {
      const v = Number((mm * 10 ** e).toPrecision(12));
      if (v > min * 1.01 && v < max / 1.01) out.push(v);
    }
  }
  return out;
}

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = logTicks(min, max);
  return {
    type: "logarithmic" as const,
    min,
    max,
    grid: { color: GRID, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: MUTED,
      padding: 6,
      callback: (v: string | number) => compact().format(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 46;
    },
  };
}

/* --------------------------------------------------------------- tooltip */

const pctOf = (v: number, base: number): string => {
  const r = (100 * v) / base;
  return r >= 10 ? `${Math.round(r)}%` : `${Number(r.toFixed(1))}%`;
};

function tooltipSpec() {
  const m = t();
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<"line">[]) => (items[0].raw as Pt).t,
      label: (item: TooltipItem<"line">) => {
        const p = item.raw as Pt;
        const value =
          p.low === p.high
            ? nf().format(Math.round(p.low))
            : `${nf().format(Math.round(p.low))} – ${nf().format(Math.round(p.high))}`;
        const flag = m.flags[p.flag];
        return !flag
          ? fill(m.tooltip.linePlain, { value })
          : fill(m.tooltip.lineWithFlag, { value, flag });
      },
      afterLabel: (item: TooltipItem<"line">) => (item.raw as Pt).note ?? "",
      footer: (items: TooltipItem<"line">[]) => {
        const p = items[0].raw as Pt;
        const n = nf().format(Math.round(p.base));
        return Math.abs(p.y - p.base) / p.base < 1e-9
          ? fill(m.tooltip.firstFigure, { n })
          : fill(m.tooltip.shareOfFirst, { pct: pctOf(p.y, p.base), n });
      },
    },
  };
}

/* -------------------------------------------------------------- emphasis */

const episodePanels: Chart<"line">[] = [];
const itemPanels: { chart: Chart<"line">; item: Metric }[] = [];
let activeItem: Metric | null = null;
let activeEvent: number | null = null;

function emphasiseItem(key: Metric | null): void {
  if (key === activeItem) return;
  activeItem = key;

  for (const chart of episodePanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = key === null || d.__item === key;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? "#ffffff" : colour));
      d.borderWidth = key !== null && d.__item === key ? 2.75 : 1.75;
    }
    chart.update("none");
  }

  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host) host.style.opacity = key === null || item === key ? "1" : "0.18";
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;

  for (const { chart } of itemPanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = index === null || d.__ep === index;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? "#ffffff" : colour));
    }
    chart.update("none");
  }
}

/* --------------------------------------------------------------- legends */

function legendButton(
  text: string,
  swatch: HTMLElement,
  onEnter: () => void,
  onLeave: () => void,
): HTMLElement {
  const b = document.createElement("button");
  b.type = "button";
  b.append(swatch, document.createTextNode(text));
  b.addEventListener("mouseenter", onEnter);
  b.addEventListener("mouseleave", onLeave);
  b.addEventListener("focus", onEnter);
  b.addEventListener("blur", onLeave);
  return b;
}

/* ---------------------------------------------------------------- mounts */

function observations(ep: Episode): string {
  const m = t();
  const counts = METRICS.map(
    (k) => ep.weeks.filter((r) => r[k] !== undefined).length,
  ).join("·");
  return fill(m.panels.obs, {
    counts,
    weeks: plural(m.units.weeks, ep.weeks.length),
  });
}

function panelFigure(
  strip: string,
  meta: string,
  note?: string,
): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement("figure");
  figure.className = "trellis-panel";

  const caption = document.createElement("figcaption");
  const head = document.createElement("span");
  head.className = "strip";
  head.textContent = strip;
  const sub = document.createElement("span");
  sub.className = "strip-meta";
  sub.textContent = meta;
  caption.append(head, sub);

  if (note) {
    const p = document.createElement("p");
    p.className = "strip-note";
    p.textContent = note;
    caption.append(p);
  }

  const box = document.createElement("div");
  box.className = "panel-canvas";
  const canvas = document.createElement("canvas");
  box.append(canvas);

  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

export function mountCrossEpisode(opts: {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}): Chart<"line">[] {
  const charts: Chart<"line">[] = [];
  const m = t();
  const unbounded = Number.POSITIVE_INFINITY;

  /* ---- primary trellis: one panel per episode, one y range for all ---- */
  const [yMin, yMax] = logBounds(...rawExtent(EPISODES, METRICS, unbounded));
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const text = m.episodes[ep.id];
    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const { figure, canvas } = panelFigure(
      text.strip,
      `${fmtSpan(ep.start, ep.end)} · ${observations(ep)}`,
      text.banner,
    );
    opts.episodeHost.append(figure);

    const datasets = SERIES.map((s) =>
      buildDataset(ep, idx, s.key, s.color, unbounded),
    ).filter((d): d is PanelDataset => d !== null);

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
        y: yScale(yMin, yMax, idx % cols === 0),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
      onHover: (_e, elements) => {
        const d = elements[0]?.dataset as PanelDataset | undefined;
        emphasiseItem(d ? d.__item : null);
      },
    };

    const chart = new Chart<"line">(canvas, {
      type: "line",
      data: { datasets } as unknown as ChartData<"line">,
      options,
      plugins: [], // no per-panel labels: the episode is the panel title
    });

    canvas.addEventListener("mouseleave", () => emphasiseItem(null));
    episodePanels.push(chart);
    charts.push(chart);
  });

  /* ---- companion trellis: one panel per series, x capped at the last enforcement week ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  SERIES.forEach((series) => {
    const [rawLo, rawHi] = rawExtent(EPISODES, [series.key], ENFORCEMENT_LAST);
    const [lo, hi] = logBounds(rawLo, rawHi);
    const range = fill(m.panels.valueRange, {
      lo: compact().format(rawLo),
      hi: compact().format(rawHi),
    });

    const { figure, canvas } = panelFigure(
      m.items[series.key].short,
      fill(m.panels.itemMeta, { range, n: ENFORCEMENT_LAST }),
    );
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) =>
      buildDataset(ep, i, series.key, RAMP[i], ENFORCEMENT_LAST),
    ).filter((d): d is PanelDataset => d !== null);

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      layout: { padding: { top: 6, right: 92, bottom: 0, left: 0 } },
      scales: {
        x: xScale(ENFORCEMENT_LAST),
        y: yScale(lo, hi, true),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
    };

    const chart = new Chart<"line">(canvas, {
      type: "line",
      data: { datasets } as unknown as ChartData<"line">,
      options,
      plugins: [directLabels],
    });

    canvas.addEventListener("mouseleave", () => emphasiseEvent(null));
    canvas.addEventListener("mousemove", (ev) => {
      const pts = chart.getElementsAtEventForMode(
        ev,
        "nearest",
        { intersect: false },
        true,
      );
      if (!pts.length) {
        emphasiseEvent(null);
        return;
      }
      const ds = chart.data.datasets[pts[0].datasetIndex] as PanelDataset;
      emphasiseEvent(ds.__ep);
    });

    itemPanels.push({ chart, item: series.key });
    charts.push(chart);
  });

  /* ---- legends ---- */
  opts.itemLegend.replaceChildren(
    ...SERIES.map((s) => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = s.color;
      return legendButton(
        m.items[s.key].label,
        swatch,
        () => emphasiseItem(s.key),
        () => emphasiseItem(null),
      );
    }),
  );

  opts.eventLegend.replaceChildren(
    ...EPISODES.map((ep, i) => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = RAMP[i];
      return legendButton(
        m.episodes[ep.id].short,
        swatch,
        () => emphasiseEvent(i),
        () => emphasiseEvent(null),
      );
    }),
  );

  return charts;
}
