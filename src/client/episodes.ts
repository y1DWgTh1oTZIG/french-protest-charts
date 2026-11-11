/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four series per panel, one shared log axis.
   Companion: one panel per series, one line per episode on a sequential ramp. */

import {
  Chart,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";

import { compact, fill, fmtSpan, fmtWeek, nf, plural, t } from "./i18n.ts";
import { STUDENT_WEEKS, type StudentWeek } from "./data.ts";
import {
  METRICS,
  bandOf,
  isDetached,
  midOf,
  type Episode,
  type EpisodeId,
  type Flag,
  type Metric,
  type Row,
} from "./model.ts";
import { THEME, alpha, gapSegment, track } from "./canvas.ts";
import { noteText } from "./notes.ts";
import { el } from "./dom.ts";

/* ------------------------------------------------------------------- types */

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
}

/* --------------------------------------------------------------- constants */

const DIM = THEME.dim;

/** Colour only — labels come from t().items. */
const SERIES: readonly { key: Metric; color: string }[] = [
  { key: "p", color: "#0072B2" },
  { key: "a", color: "#E69F00" },
  { key: "f", color: "#009E73" },
  { key: "i", color: "#CC79A7" },
];

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = [
  "#D6E6F2",
  "#B0CFE6",
  "#86B4D7",
  "#5C97C5",
  "#357AB0",
  "#1B5C92",
  "#0A3A63",
] as const;

/* -------------------------------------------------------------------- data */

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

const GJ_ACTS: readonly [number, string, number][] = [
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
const GJ_EXTRA: Readonly<Record<number, Pick<Row, "a" | "f" | "i" | "flag">>> =
  {
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

/* -------------------------------------------------------------- 2026 rows */

/** STUDENT_WEEKS already carries bands, flags and note refs; this is a copy, not
 *  a recalculation — the fallback table and the index patch are gone. */
function rows2026(): Row[] {
  return STUDENT_WEEKS.map((wk: StudentWeek, w) => {
    const row: Row = { w, from: wk.key, to: wk.end, partial: wk.touchesEdge };
    for (const m of METRICS) {
      const band = wk[m];
      if (band) row[m] = band;
      const flag = wk.flags[m];
      if (flag && flag !== "n") (row.flag ??= {})[m] = flag;
      const ref = wk.notes[m];
      if (ref) (row.noteRef ??= {})[m] = ref;
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: "students26",
  start: STUDENT_WEEKS[0].key,
  end: STUDENT_WEEKS[STUDENT_WEEKS.length - 1].end,
  weeks: rows2026(),
};

const EPISODES: readonly Episode[] = [
  MAY68,
  CPE,
  GILETS,
  NAHEL,
  PENSIONS,
  BLOQUONS,
  STUDENTS,
];

/** Last week on which any episode carries an arrest or injury figure (CPE, w7). */
const ENFORCEMENT_LAST = EPISODES.reduce(
  (last, ep) =>
    ep.weeks.reduce(
      (l, r) =>
        r.a !== undefined || r.f !== undefined || r.i !== undefined
          ? Math.max(l, r.w)
          : l,
      last,
    ),
  0,
);

/* -------------------------------------------------------------------- text */

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

/* --------------------------------------------------------------- indexing */

/** Memoised: rawExtent() used to rebuild every series ~33× per render, each pass
 *  re-running t(), fmtWeek() and noteText(). Cleared on every mount (locale-bound). */
let seriesCache = new Map<string, Pt[] | null>();

function seriesData(ep: Episode, key: Metric): Pt[] | null {
  const id = `${ep.id}:${key}`;
  if (seriesCache.has(id)) return seriesCache.get(id)!;

  const rows = ep.weeks
    .filter((r) => r[key] !== undefined)
    .sort((a, b) => a.w - b.w);
  const out =
    rows.length === 0
      ? null
      : (() => {
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
        })();

  seriesCache.set(id, out);
  return out;
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

  return {
    label: t().items[key].label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: points.map((p) => (p.flag === "c" ? 3 : 2.75)),
    pointBackgroundColor: points.map((p) =>
      isDetached(p.flag) ? THEME.hollow : color,
    ),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: gapSegment(1, [5, 4]),
    __item: key,
    __ep: epIndex,
    __color: color,
  };
}

function rawExtent(
  eps: readonly Episode[],
  keys: readonly Metric[],
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

/* ------------------------------------------------------------------ scales */

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
      color: THEME.muted,
      padding: 4,
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
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
  const span = Math.log10(max) - l;
  const mantissas = span > 4.5 ? [1] : span > 1.5 ? [1, 3] : [1, 2, 5];
  const out: number[] = [];

  for (let e = Math.floor(l); e <= Math.ceil(Math.log10(max)); e++) {
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
    grid: { color: THEME.grid, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: THEME.muted,
      padding: 6,
      callback: (v: string | number) => compact().format(Number(v)),
    },
    afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 46;
    },
  };
}

/* ----------------------------------------------------------------- tooltip */

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
        return flag
          ? fill(m.tooltip.lineWithFlag, { value, flag })
          : fill(m.tooltip.linePlain, { value });
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

/* ---------------------------------------------------------------- emphasis */

const episodePanels: Chart<"line">[] = [];
const itemPanels: { chart: Chart<"line">; item: Metric }[] = [];
let activeItem: Metric | null = null;
let activeEvent: number | null = null;

const datasetsOf = (chart: Chart<"line">): PanelDataset[] =>
  chart.data.datasets as PanelDataset[];

/** One recolour path for both emphasis modes. Hollow points are decided from the
 *  point's own flag at draw time, so `__hollow` no longer has to be kept in sync. */
function restyle(d: PanelDataset, on: boolean, bold = false): void {
  const c = on ? d.__color : alpha(d.__color, DIM);
  d.borderColor = c;
  d.pointBorderColor = c;
  d.pointBackgroundColor = d.data.map((p) =>
    isDetached(p.flag) ? THEME.hollow : c,
  );
  d.borderWidth = bold && on ? 2.75 : 1.75;
}

function restylePanels(
  charts: readonly Chart<"line">[],
  keep: (d: PanelDataset) => boolean,
  bold = false,
): void {
  for (const chart of charts) {
    for (const d of datasetsOf(chart)) restyle(d, keep(d), bold);
    chart.update("none");
  }
}

function emphasiseItem(key: Metric | null): void {
  if (key === activeItem) return;
  activeItem = key;
  restylePanels(episodePanels, (d) => key === null || d.__item === key, true);
  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host)
      host.style.opacity = key === null || item === key ? "1" : String(DIM);
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;
  restylePanels(
    itemPanels.map((p) => p.chart),
    (d) => index === null || d.__ep === index,
  );
}

/* ---------------------------------------------------------------- legends */

interface LegendEntry {
  text: string;
  color: string;
  on: () => void;
  off: () => void;
}

/** One builder for both legends; `pointerdown` makes the highlight reachable on touch. */
function legend(host: HTMLElement, entries: readonly LegendEntry[]): void {
  host.replaceChildren(
    ...entries.map(({ text, color, on, off }) => {
      const button = el("button");
      button.type = "button";
      const swatch = el("span", "swatch");
      swatch.style.background = color;
      button.append(swatch, document.createTextNode(text));
      for (const ev of ["mouseenter", "focus", "pointerdown"] as const)
        button.addEventListener(ev, on);
      for (const ev of ["mouseleave", "blur"] as const)
        button.addEventListener(ev, off);
      return button;
    }),
  );
}

/* ----------------------------------------------------------------- panels */

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
  const figure = el("figure", "trellis-panel");
  const caption = el("figcaption");
  caption.append(el("span", "strip", strip), el("span", "strip-meta", meta));
  if (note) caption.append(el("p", "strip-note", note));

  const box = el("div", "panel-canvas");
  const canvas = el("canvas");
  box.append(canvas);
  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

/** One options factory for both trellises. */
const panelOptions = (
  x: object,
  y: object,
  onHover?: ChartOptions<"line">["onHover"],
): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: "nearest", axis: "x", intersect: false },
  layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
  scales: { x, y } as ChartOptions<"line">["scales"],
  plugins: {
    legend: { display: false },
    title: { display: false },
    subtitle: { display: false },
    tooltip: tooltipSpec(),
  },
  onHover,
});

export interface TrellisHosts {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}

export function mountCrossEpisode(opts: TrellisHosts): void {
  /* destroyAll() has already destroyed the previous instances (canvas.ts owns
     them); clear the handles so emphasis cannot touch a dead chart. */
  episodePanels.length = 0;
  itemPanels.length = 0;
  activeItem = null;
  activeEvent = null;
  seriesCache = new Map(); // titles and notes are locale-bound
  opts.episodeHost.replaceChildren();
  opts.itemHost.replaceChildren();

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

    const chart = track(
      new Chart<"line">(canvas, {
        type: "line",
        data: { datasets } as unknown as ChartData<"line">,
        options: panelOptions(
          xScale(maxW),
          yScale(yMin, yMax, idx % cols === 0),
          (_e, elements) => {
            const d = elements[0]?.dataset as PanelDataset | undefined;
            emphasiseItem(d ? d.__item : null);
          },
        ),
        plugins: [], // no per-panel labels: the episode is the panel title
      }),
    );

    canvas.addEventListener("mouseleave", () => emphasiseItem(null));
    episodePanels.push(chart);
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

    const chart = track(
      new Chart<"line">(canvas, {
        type: "line",
        data: { datasets } as unknown as ChartData<"line">,
        options: panelOptions(xScale(ENFORCEMENT_LAST), yScale(lo, hi, true)),
        plugins: [],
      }),
    );

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
      emphasiseEvent(datasetsOf(chart)[pts[0].datasetIndex].__ep);
    });

    itemPanels.push({ chart, item: series.key });
  });

  /* ---- legends ---- */
  legend(
    opts.itemLegend,
    SERIES.map((s) => ({
      text: m.items[s.key].label,
      color: s.color,
      on: () => emphasiseItem(s.key),
      off: () => emphasiseItem(null),
    })),
  );

  legend(
    opts.eventLegend,
    EPISODES.map((ep, i) => ({
      text: m.episodes[ep.id].short,
      color: RAMP[i],
      on: () => emphasiseEvent(i),
      off: () => emphasiseEvent(null),
    })),
  );
}
