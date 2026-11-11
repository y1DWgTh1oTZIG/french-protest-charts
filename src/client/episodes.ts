/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four indexed series per panel.
   Companion: one panel per series, one line per episode on a sequential ramp. */

import {
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from "chart.js";
import { EPISODE_2026 } from "./chart.ts";

/* ------------------------------------------------------------------ types */

type M = "p" | "a" | "f" | "i";
type Flag = "n" | "r" | "p" | "f" | "e" | "c" | "w";
type Band = number | [number, number];

interface Row {
  w: number; // whole weeks since the event's first action
  t: string; // week / act label, tooltip title
  p?: Band; // protestors, peak day of the week
  a?: Band; // arrests, weekly total
  f?: Band; // injuries, security forces
  i?: Band; // injuries, protestors
  flag?: Partial<Record<M, Flag>>;
  note?: Partial<Record<M, string>>;
}

interface Episode {
  id: string;
  strip: string;
  short: string;
  span: string;
  banner: string;
  weeks: Row[];
}

interface Pt {
  x: number;
  y: number;
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

interface PanelDataset extends ChartDataset<"line", Pt[]> {
  __item: M;
  __color: string;
  __hollow: boolean[];
  __label: string;
}

/* ------------------------------------------------------------- constants */

const INK = "#111827";
const MUTED = "#6b7280";
const GRID = "#E5E5E5";
const REFERENCE = 100;

const ITEMS: { key: M; label: string; short: string; color: string }[] = [
  {
    key: "p",
    label: "Protestors (peak day)",
    short: "Protestors",
    color: "#0072B2",
  },
  {
    key: "a",
    label: "Arrests (weekly total)",
    short: "Arrests",
    color: "#E69F00",
  },
  {
    key: "f",
    label: "Injuries — security forces",
    short: "Forces hurt",
    color: "#009E73",
  },
  {
    key: "i",
    label: "Injuries — protestors",
    short: "Protestors hurt",
    color: "#CC79A7",
  },
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
];

const FLAG_TEXT: Partial<Record<Flag, string>> = {
  r: "regional only",
  p: "partial",
  f: "lower bound",
  e: "derived",
  c: "actions-total / stock — measured differently",
  w: "weekly aggregate",
};

const hollow = (f: Flag): boolean =>
  f === "r" || f === "p" || f === "e" || f === "c";

const nf = new Intl.NumberFormat("en-GB");
const compact = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fmtIndex = (v: number): string =>
  v < 1 ? String(Number(v.toFixed(2))) : compact.format(v);

function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------------- data */

const MAY68: Episode = {
  id: "may68",
  strip: "May 1968",
  short: "May 68",
  span: "29 Apr – 30 Jun 1968",
  banner:
    "Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.",
  weeks: [
    {
      w: 0,
      t: "29 Apr – 5 May · 1 May march",
      p: [25_000, 100_000],
      note: { p: "prefecture 25,000 / CGT 100,000, République → Bastille" },
    },
    {
      w: 1,
      t: "6 – 12 May · Sorbonne, barricades",
      p: 20_000,
      a: [469, 891],
      f: [247, 300],
      i: [100, 100],
      flag: { i: "f" },
      note: {
        p: "20,000 to the Sorbonne on 6 May; >20,000 again on 10 May",
        a: "469 on the night of 10–11 May; high adds the 422 early-May arrests",
        f: "300+ on 6 May; 247 on 10–11 May",
        i: "≥100 — no national count was published",
      },
    },
    {
      w: 2,
      t: "13 – 19 May · 13 May march",
      p: [230_000, 1_000_000],
      note: {
        p: "prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Peak of the episode.",
      },
    },
    {
      w: 3,
      t: "20 – 26 May · 24–25 May",
      a: [1_000, 1_000],
      i: [887, 887],
      flag: { a: "f", i: "e" },
      note: {
        a: "1,000+ arrests on 25 May",
        i: "887 injured, from the English-Wikipedia infobox — weak provenance",
      },
    },
    {
      w: 4,
      t: "27 May – 2 Jun · 30 May",
      note: {
        p: "30 May: 300,000 (prefecture) – 1,000,000 counter-demonstration — excluded from protest totals",
      },
    },
    {
      w: 5,
      t: "3 – 9 Jun",
      note: { p: "4 Jun partial return to work; 7 Jun Renault-Flins clashes" },
    },
    {
      w: 6,
      t: "10 – 16 Jun",
      note: { p: "10–11 Jun: 3 dead; 12 Jun demonstrations banned nationwide" },
    },
    { w: 7, t: "17 – 23 Jun" },
    { w: 8, t: "24 – 30 Jun" },
  ],
};

const CPE: Episode = {
  id: "cpe",
  strip: "CPE 2006",
  short: "CPE 2006",
  span: "6 Feb – 16 Apr 2006",
  banner:
    "One movement-wide arrest total (4,500); no weekly enforcement series exists.",
  weeks: [
    {
      w: 0,
      t: "6 – 12 Feb · 7 Feb",
      p: [200_000, 400_000],
      note: { p: "187 demonstrations, first national day" },
    },
    {
      w: 4,
      t: "6 – 12 Mar · 7 Mar",
      p: [400_000, 1_000_000],
      note: { p: ">1 million claimed; 38 universities on strike by 9 Mar" },
    },
    {
      w: 5,
      t: "13 – 19 Mar · 16–18 Mar",
      p: [500_000, 1_500_000],
      a: [156, 167],
      f: 34,
      i: 70,
      flag: { i: "e" },
      note: {
        p: "18 Mar: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000",
        a: "Paris, 18 Mar (156 ministry / 167 organisers)",
        f: "Paris, 18 Mar",
        i: "18 (16 Mar) + 52 (18 Mar), Paris only",
      },
    },
    {
      w: 6,
      t: "20 – 26 Mar · 23 Mar",
      p: [220_000, 450_000],
      a: 630,
      f: 90,
      note: { p: "21 universities fully blocked; 67 striking or blocked" },
    },
    {
      w: 7,
      t: "27 Mar – 2 Apr · 28 Mar",
      p: [1_055_000, 2_710_000],
      a: 600,
      note: { p: "4th national action day" },
    },
    {
      w: 8,
      t: "3 – 9 Apr · 4 Apr",
      p: [1_000_000, 3_100_000],
      note: { p: "peak day of the episode" },
    },
    {
      w: 9,
      t: "10 – 16 Apr",
      note: { p: "CPE withdrawn 10 Apr; the movement splits" },
    },
  ],
};

const GJ_DATES = [
  "17 Nov 2018",
  "24 Nov",
  "1 Dec",
  "8 Dec",
  "15 Dec",
  "22 Dec",
  "29 Dec",
  "5 Jan 2019",
  "12 Jan",
  "19 Jan",
  "26 Jan",
  "2 Feb",
  "9 Feb",
  "16 Feb",
  "23 Feb",
  "2 Mar",
  "9 Mar",
  "16 Mar",
  "23 Mar",
  "30 Mar",
  "6 Apr",
  "13 Apr",
  "20 Apr",
  "27 Apr",
  "4 May",
  "11 May",
  "18 May",
  "25 May",
  "1 Jun",
  "8 Jun",
  "15 Jun",
  "22 Jun",
  "29 Jun",
  "7 Sep 2019",
];

const GJ_CROWD: [number, number][] = [
  [0, 287_700],
  [1, 166_000],
  [2, 136_000],
  [3, 136_000],
  [4, 66_000],
  [5, 38_600],
  [6, 32_000],
  [7, 50_000],
  [8, 84_000],
  [9, 84_000],
  [10, 69_000],
  [11, 58_600],
  [12, 51_400],
  [13, 41_500],
  [14, 46_600],
  [15, 39_300],
  [16, 28_600],
  [17, 32_300],
  [18, 40_500],
  [19, 33_700],
  [20, 22_300],
  [21, 31_000],
  [22, 27_900],
  [23, 23_600],
  [24, 18_900],
  [25, 18_600],
  [26, 15_500],
  [27, 12_500],
  [28, 9_500],
  [29, 10_300],
  [30, 7_000],
  [31, 11_800],
  [32, 5_800],
  [43, 7_000],
];

/** Enforcement figures exist only for Acts I–IV; later acts were not published as a series. */
const GJ_EXTRA: Record<number, Pick<Row, "a" | "f" | "i" | "flag" | "note">> = {
  0: {
    a: [974, 1_150],
    f: 17,
    i: 109,
    flag: { f: "e", i: "e" },
    note: {
      a: "974 in custody, ~1,150 interpellations",
      f: "17 police among 126 injured — split derived",
      i: "109 of 126 injured — split derived",
    },
  },
  1: {
    a: [307, 339],
    f: 30,
    i: 54,
    flag: { i: "e" },
    note: {
      a: "307 in custody, 339 interpellations",
      i: "54 of 84 injured — split derived",
    },
  },
  2: {
    a: 630,
    flag: { a: "f" },
    note: {
      a: "placed in custody, not arrests; 263 injured, not split by side",
    },
  },
  3: {
    a: [1_709, 2_000],
    note: {
      a: "1,709 in custody, ~2,000 interpellations; injuries reported as 118 / 264 / 585 depending on source, not split by side",
    },
  },
};

const GILETS: Episode = {
  id: "gj",
  strip: "Gilets jaunes",
  short: "Gilets jaunes",
  span: "12 Nov 2018 – 9 Sep 2019",
  banner:
    "Ministry count only: one figure per act, so no range. Acts 34–43 were never published.",
  weeks: [
    ...GJ_CROWD.map(([w, n], idx) => {
      const extra = GJ_EXTRA[w] ?? {};
      return {
        w,
        t: `Act ${w + 1} · ${GJ_DATES[idx]}`,
        p: n,
        ...extra,
        flag: {
          ...(w === 0 ? { p: "c" as Flag } : {}),
          ...extra.flag,
        },
        note: {
          ...(w === 0
            ? {
                p: "287,700 counts all actions including road blockades — an actions-total, not a march",
              }
            : w === 1
              ? { p: "police-union counter-count: 750,000" }
              : {}),
          ...extra.note,
        },
      } satisfies Row;
    }),
  ],
};

const NAHEL: Episode = {
  id: "nahel",
  strip: "Nahel 2023",
  short: "Nahel 2023",
  span: "27 Jun – 9 Jul 2023",
  banner:
    "Gatherings were banned: arrests, not crowd counts, carry the scale of the riots.",
  weeks: [
    {
      w: 0,
      t: "26 Jun – 2 Jul · Nanterre march, 29 Jun",
      p: [6_200, 20_000],
      a: 3_354,
      f: 722,
      note: {
        p: "police 6,200 / organisers 20,000 for the march blanche",
        a: "national total, 27 Jun – 2 Jul",
        f: "722 officers injured; 2 deaths; 5,662 vehicles burnt",
      },
    },
    {
      w: 1,
      t: "3 – 9 Jul",
      a: 108,
      f: 1,
      note: { a: "72 + 16 + 20 over 3–5 Jul" },
    },
  ],
};

const PENSIONS: Episode = {
  id: "pensions",
  strip: "Pension reform 2023",
  short: "Pensions 2023",
  span: "19 Jan – 8 Jun 2023",
  banner:
    "Crowds only: no national weekly arrest or injury series was published.",
  weeks: [
    {
      w: 0,
      t: "16 – 22 Jan · 19 Jan",
      p: [1_120_000, 2_000_000],
      note: { p: "first national day; Paris 80,000 – 400,000" },
    },
    { w: 2, t: "30 Jan – 5 Feb · 31 Jan", p: [1_270_000, 2_800_000] },
    {
      w: 3,
      t: "6 – 12 Feb · 7 & 11 Feb",
      p: [963_000, 2_500_000],
      note: { p: "two action days in one week; the peak is 11 Feb" },
    },
    { w: 4, t: "13 – 19 Feb · 16 Feb", p: [440_000, 1_300_000] },
    {
      w: 7,
      t: "6 – 12 Mar · 7 Mar",
      p: [1_280_000, 3_500_000],
      note: { p: "national record: ministry 1.28M, unions 3.5M" },
    },
    { w: 8, t: "13 – 19 Mar · 15 Mar", p: [480_000, 1_700_000] },
    { w: 9, t: "20 – 26 Mar · 23 Mar", p: [1_089_000, 3_500_000] },
    { w: 10, t: "27 Mar – 2 Apr · 28 Mar", p: [740_000, 2_000_000] },
    { w: 11, t: "3 – 9 Apr · 6 Apr", p: [570_000, 2_000_000] },
    {
      w: 12,
      t: "10 – 16 Apr · 13 Apr",
      p: [380_000, 1_500_000],
      note: { p: "CGT gives 1.0M in one compilation, 1.5M in another" },
    },
    { w: 16, t: "1 – 7 May · 1 May", p: [782_000, 2_300_000] },
    {
      w: 20,
      t: "5 – 11 Jun · 6 Jun",
      p: [281_000, 900_000],
      note: { p: "movement minimum" },
    },
  ],
};

const BLOQUONS: Episode = {
  id: "bt",
  strip: "Bloquons tout 2025",
  short: "Bloquons tout",
  span: "10 Sep – 5 Oct 2025",
  banner:
    "10 Sep is an actions-total (blockades included); 18 Sep is an intersyndicale march.",
  weeks: [
    {
      w: 0,
      t: "8 – 14 Sep · 10 Sep",
      p: [175_000, 250_000],
      a: 540,
      flag: { p: "c" },
      note: {
        p: "ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.",
        a: "540 arrests, 211 in Paris",
      },
    },
    {
      w: 1,
      t: "15 – 21 Sep · 18 Sep",
      p: [500_000, 1_000_000],
      a: 309,
      f: 26,
      i: 11,
      note: {
        p: "intersyndicale day — a different mobilisation from the movement’s own actions; Paris 55,000 (prefecture)",
        a: "309 nationwide, 103 in Paris",
        i: "11 injured, including 1 journalist",
      },
    },
    {
      w: 3,
      t: "29 Sep – 5 Oct · 2 Oct",
      p: [195_000, 600_000],
      note: { p: "weakest mobilisation since 1 May 2025" },
    },
  ],
};

function rows2026(): Row[] {
  const s = EPISODE_2026.series;
  return EPISODE_2026.weeks.map((wk, i) => {
    const row: Row = { w: i, t: `W${i + 1} · ${wk.label}` };
    for (const m of ["p", "a", "f", "i"] as const) {
      const band = s[m].bands[i];
      if (!band) continue;
      row[m] = [band[0], band[1]];
      const q = s[m].quality[i];
      if (q && q !== "n") row.flag = { ...row.flag, [m]: q };
      const note = s[m].notes[i];
      if (note) row.note = { ...row.note, [m]: note };
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: "students26",
  strip: "Student protests 2026",
  short: "Students 2026",
  span: "1 Oct – 11 Nov 2026",
  banner:
    "Protester injuries are a September stock, then a litigation floor — never a weekly flow.",
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

/* -------------------------------------------------------------- indexing */

const bandOf = (b: Band): [number, number] =>
  typeof b === "number" ? [b, b] : b;
const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

interface SeriesData {
  base: number;
  points: Pt[];
}

/** y' = 100 · y / y₀, where y₀ is the first figure measured on a comparable basis. */
function seriesData(ep: Episode, key: M): SeriesData | null {
  const rows = ep.weeks
    .filter((r) => r[key] !== undefined)
    .sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? "n";
  const baseRow = rows.find((r) => flagOf(r) !== "c") ?? rows[0];
  const base = midOf(baseRow[key]!);

  const points = rows.map<Pt>((r) => {
    const [low, high] = bandOf(r[key]!);
    return {
      x: r.w,
      y: (REFERENCE * ((low + high) / 2)) / base,
      low,
      high,
      flag: flagOf(r),
      note: r.note?.[key],
      base,
      t: r.t,
    };
  });

  return { base, points };
}

function buildDataset(
  ep: Episode,
  key: M,
  color: string,
  direct: string,
): PanelDataset | null {
  const s = seriesData(ep, key);
  if (!s) return null;
  const item = ITEMS.find((d) => d.key === key)!;
  const holl = s.points.map((p) => hollow(p.flag));

  return {
    label: item.label,
    data: s.points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: s.points.map((p) => (p.flag === "c" ? 3 : 2.75)),
    pointBackgroundColor: s.points.map((_, i) => (holl[i] ? "#ffffff" : color)),
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
    __color: color,
    __hollow: holl,
    __label: direct,
  };
}

function extentOf(eps: Episode[], keys: M[]): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const ep of eps) {
    for (const k of keys) {
      const s = seriesData(ep, k);
      if (!s) continue;
      for (const p of s.points) {
        lo = Math.min(lo, p.y);
        hi = Math.max(hi, p.y);
      }
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [1, 100];
  return [10 ** Math.floor(Math.log10(lo)), 10 ** Math.ceil(Math.log10(hi))];
}

/* --------------------------------------------------------------- plugins */

const hundredLine: Plugin<"line"> = {
  id: "hundredLine",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const y = scales.y?.getPixelForValue(REFERENCE);
    if (y === undefined || y < chartArea.top || y > chartArea.bottom) return;
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

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
  const step = maxW <= 4 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
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

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = [0.1, 0.3, 1, 3, 10, 30, 100, 300, 1000, 3000].filter(
    (v) => v >= min && v <= max,
  );
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
      callback: (v: string | number) => fmtIndex(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 42;
    },
  };
}

/* --------------------------------------------------------------- tooltip */

function tooltipSpec() {
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<"line">[]) => (items[0].raw as Pt).t,
      label: (item: TooltipItem<"line">) => {
        const p = item.raw as Pt;
        const band =
          p.low === p.high
            ? nf.format(p.low)
            : `${nf.format(p.low)} – ${nf.format(p.high)}`;
        const flag = FLAG_TEXT[p.flag];
        return `${item.dataset.label}: ${band}  →  index ${Math.round(p.y)}${flag ? `  ·  ${flag}` : ""}`;
      },
      afterLabel: (item: TooltipItem<"line">) => (item.raw as Pt).note ?? "",
      footer: (items: TooltipItem<"line">[]) => {
        const p = items[0].raw as Pt;
        return `index = 100 × value ÷ ${nf.format(Math.round(p.base))}`;
      },
    },
  };
}

/* -------------------------------------------------------------- emphasis */

const episodePanels: Chart<"line">[] = [];
const itemPanels: { chart: Chart<"line">; item: M }[] = [];
let activeItem: M | null = null;
let activeEvent: number | null = null;

function emphasiseItem(key: M | null): void {
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
    if (host) host.style.opacity = key === null || key === item ? "1" : "0.18";
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;

  for (const { chart } of itemPanels) {
    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const on = index === null || i === index;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? "#ffffff" : colour));
    });
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
  const counts = ITEMS.map(
    (i) => ep.weeks.filter((r) => r[i.key] !== undefined).length,
  );
  return `obs ${counts.join("·")} of ${ep.weeks.length} wks`;
}

function panelFigure(ep: Episode): {
  figure: HTMLElement;
  canvas: HTMLCanvasElement;
} {
  const figure = document.createElement("figure");
  figure.className = "trellis-panel";

  const caption = document.createElement("figcaption");
  const strip = document.createElement("span");
  strip.className = "strip";
  strip.textContent = ep.strip;
  const meta = document.createElement("span");
  meta.className = "strip-meta";
  meta.textContent = `${ep.span} · ${observations(ep)}`;
  const note = document.createElement("p");
  note.className = "strip-note";
  note.textContent = ep.banner;
  caption.append(strip, meta, note);

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

  /* ---- primary trellis: one panel per episode ---- */
  const [yMin, yMax] = extentOf(
    EPISODES,
    ITEMS.map((i) => i.key),
  );
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const { figure, canvas } = panelFigure(ep);
    opts.episodeHost.append(figure);

    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const datasets = ITEMS.map((i) =>
      buildDataset(ep, i.key, i.color, i.short),
    ).filter((d): d is PanelDataset => d !== null);

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      layout: { padding: { top: 6, right: 96, bottom: 0, left: 0 } },
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
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener("mouseleave", () => emphasiseItem(null));
    episodePanels.push(chart);
    charts.push(chart);
  });

  /* ---- companion trellis: one panel per series ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  ITEMS.forEach((item) => {
    const [lo, hi] = extentOf(EPISODES, [item.key]);

    const figure = document.createElement("figure");
    figure.className = "trellis-panel";

    const caption = document.createElement("figcaption");
    const strip = document.createElement("span");
    strip.className = "strip";
    strip.textContent = item.short;
    const meta = document.createElement("span");
    meta.className = "strip-meta";
    meta.textContent = `index, log ${fmtIndex(lo)}–${fmtIndex(hi)}`;
    caption.append(strip, meta);

    const box = document.createElement("div");
    box.className = "panel-canvas";
    const canvas = document.createElement("canvas");
    box.append(canvas);

    figure.append(caption, box);
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) =>
      buildDataset(ep, item.key, RAMP[i], ep.short),
    ).filter((d): d is PanelDataset => d !== null);
    const maxW = Math.max(
      ...EPISODES.flatMap((ep) => ep.weeks.map((r) => r.w)),
      1,
    );

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      layout: { padding: { top: 6, right: 92, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
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
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener("mouseleave", () => emphasiseEvent(null));
    canvas.addEventListener("mousemove", (ev) => {
      const pts = chart.getElementsAtEventForMode(
        ev,
        "nearest",
        { intersect: false },
        true,
      );
      emphasiseEvent(pts.length ? pts[0].datasetIndex : null);
    });

    itemPanels.push({ chart, item: item.key });
    charts.push(chart);
  });

  /* ---- legends ---- */
  opts.itemLegend.replaceChildren(
    ...ITEMS.map((item) => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = item.color;
      return legendButton(
        item.label,
        swatch,
        () => emphasiseItem(item.key),
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
        ep.short,
        swatch,
        () => emphasiseEvent(i),
        () => emphasiseEvent(null),
      );
    }),
  );

  return charts;
}
