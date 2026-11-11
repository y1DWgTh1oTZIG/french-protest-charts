/* 2026 daily / weekly charts. No user-visible English lives here: labels, titles,
   notes and suffixes all resolve through i18n.ts. Series store NoteRef, not copy,
   so the module-level projections stay valid across locale switches. */

import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  SubTitle,
  type ChartDataset,
  type ChartOptions,
  type LegendItem,
  type Plugin,
  type PointStyle,
} from "chart.js";

import {
  compact,
  eurM,
  fill,
  fmtDate,
  fmtDayMonth,
  fmtWeek,
  nf,
  t,
} from "./i18n.ts";
import type {
  Flag,
  Metric,
  MetricKey,
  NoteRef,
  Quality,
  WeekNoteParts,
} from "./model.ts";

Chart.register(
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  SubTitle,
);

const SPAN_GAPS = true;
/** regional / partial / derived / stock values become detached, points-only series. */
const DETACH_REGIONAL = true;

const START = "2026-10-01";
const END = "2026-11-11";

type Unit = "count" | "eurM";
type Agg = "sum" | "max";

/* ------------------------------------------------------------------ dates */

function eachDay(start: string, end: string): string[] {
  const out: string[] = [];
  const d = new Date(`${start}T00:00:00Z`);
  const stop = new Date(`${end}T00:00:00Z`);
  while (d <= stop) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** ISO date of the Monday on or before `iso`. */
function mondayOf(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const back = (d.getUTCDay() + 6) % 7; // Mon→0 … Sun→6
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}

const DATES = eachDay(START, END);

interface WeekSpec {
  key: string; // ISO Monday — the aggregator key
  end: string; // ISO Sunday — labels are formatted per locale at render time
  dates: string[];
  touchesEdge: boolean;
}

function buildWeeks(dates: string[]): WeekSpec[] {
  const byKey = new Map<string, string[]>();
  for (const d of dates) {
    const k = mondayOf(d);
    const arr = byKey.get(k);
    if (arr) arr.push(d);
    else byKey.set(k, [d]);
  }
  return [...byKey.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, ds]) => {
      const end = addDays(key, 6);
      return { key, end, dates: ds, touchesEdge: key < START || end > END };
    });
}

const WEEKS = buildWeeks(DATES);

/* ------------------------------------------------------------------ types */

interface Obs {
  low: number;
  high: number;
  q?: Quality;
}

interface Cell {
  turnout?: Obs;
  arrests?: Obs;
  forcesInjured?: Obs;
  protesterInjured?: Obs;
  damagesCost?: Obs; // € millions
}

/* ------------------------------------------------------------------- data */

const FACTS: Record<string, Cell> = {
  "2026-10-01": {
    arrests: { low: 1_949, high: 1_949 },
    forcesInjured: { low: 84, high: 305 },
    protesterInjured: { low: 119, high: 235 },
    damagesCost: { low: 1, high: 1, q: "c" },
  },
  "2026-10-06": {
    turnout: { low: 256_000, high: 450_000 },
    damagesCost: { low: 6, high: 6, q: "e" },
  },
  "2026-10-08": {
    turnout: { low: 71_500, high: 130_000 },
    damagesCost: { low: 6, high: 6, q: "e" },
  },
  "2026-10-12": { arrests: { low: 13, high: 13, q: "r" } },
  "2026-10-13": {
    turnout: { low: 161_500, high: 480_000 },
    forcesInjured: { low: 40, high: 40 },
    damagesCost: { low: 1.5, high: 1.5, q: "e" },
  },
  "2026-10-17": {
    turnout: { low: 550_000, high: 800_000 },
    arrests: { low: 2_397, high: 2_628 },
    forcesInjured: { low: 997, high: 1_144 },
    damagesCost: { low: 244, high: 866 },
  },
  "2026-10-18": {
    arrests: { low: 108, high: 108, q: "p" },
    damagesCost: { low: 1.8, high: 5, q: "e" },
  },
  "2026-10-20": { arrests: { low: 13, high: 13, q: "r" } },
  "2026-10-24": {
    turnout: { low: 410_000, high: 800_000 },
    arrests: { low: 1_314, high: 1_435 },
    forcesInjured: { low: 267, high: 267 },
    protesterInjured: { low: 150, high: 150 },
    damagesCost: { low: 1, high: 8.4, q: "e" },
  },
  "2026-10-31": {
    turnout: { low: 320_000, high: 500_000 },
    arrests: { low: 565, high: 779 },
    forcesInjured: { low: 116, high: 159 },
    damagesCost: { low: 0.4, high: 3.3, q: "e" },
  },
  "2026-11-05": {
    turnout: { low: 575_000, high: 1_600_000 },
    arrests: { low: 448, high: 642 },
    forcesInjured: { low: 53, high: 112 },
    protesterInjured: { low: 18, high: 18, q: "f" },
  },
  "2026-11-07": {
    turnout: { low: 146_000, high: 250_000 },
    arrests: { low: 350, high: 360 },
  },
  "2026-11-09": { arrests: { low: 17, high: 17, q: "r" } },
};

/* ------------------------------------------------------ policing cost model */

/** € per officer per day: CRS-company marginal opex → Sainte-Soline all-in benchmark. */
const RATE = { low: 136, high: 1_133 } as const;

const DEPLOYMENT: Record<string, Obs> = {
  "2026-10-01": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-06": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-08": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-12": { low: 2_000, high: 8_000, q: "e" },
  "2026-10-13": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-17": { low: 60_000, high: 60_000 },
  "2026-10-24": { low: 70_000, high: 70_000 },
  "2026-10-31": { low: 70_000, high: 70_000 },
  "2026-11-05": { low: 70_000, high: 70_000 },
  "2026-11-07": { low: 70_000, high: 70_000 },
};

function costBand(dep: Obs): [number, number] {
  return [(dep.low * RATE.low) / 1e6, (dep.high * RATE.high) / 1e6];
}

/* ----------------------------------------------------------- projections */

type Band = [low: number, high: number] | null;

interface MetricSeries {
  values: (number | null)[];
  bands: Band[];
  quality: (Quality | null)[];
  notes: (NoteRef | null)[];
  detach: boolean[];
}

interface View {
  labels: string[];
  titles: string[];
  footers: (string | null)[];
  xTitle: string;
  maxRotation: number;
  maxTicksLimit: number;
}

const round2 = (v: number): number =>
  Number.isInteger(v) ? v : Math.round(v * 100) / 100;

const isDetached = (q: Quality | null | undefined): boolean =>
  Boolean(
    DETACH_REGIONAL && q && (q === "r" || q === "p" || q === "e" || q === "c"),
  );

function empty(): MetricSeries {
  return { values: [], bands: [], quality: [], notes: [], detach: [] };
}

function pushNull(s: MetricSeries): void {
  s.values.push(null);
  s.bands.push(null);
  s.quality.push(null);
  s.notes.push(null);
  s.detach.push(false);
}

/* -- daily ---------------------------------------------------------------- */

function projectDaily(key: MetricKey): MetricSeries {
  const s = empty();
  for (const date of DATES) {
    const obs = FACTS[date]?.[key];
    if (!obs) {
      pushNull(s);
      continue;
    }
    s.values.push(round2((obs.low + obs.high) / 2));
    s.bands.push([obs.low, obs.high]);
    s.quality.push(obs.q ?? "n");
    s.notes.push({ k: "obs", date, metric: key });
    s.detach.push(isDetached(obs.q ?? "n"));
  }
  return s;
}

function projectPolicingDaily(): MetricSeries {
  const s = empty();
  for (const date of DATES) {
    const dep = DEPLOYMENT[date];
    if (!dep) {
      pushNull(s);
      continue;
    }
    const [lo, hi] = costBand(dep);
    s.values.push(round2((lo + hi) / 2));
    s.bands.push([round2(lo), round2(hi)]);
    s.quality.push(dep.q ?? "n");
    s.notes.push({ k: "policing", low: dep.low, high: dep.high, date });
    s.detach.push(isDetached(dep.q ?? "n"));
  }
  return s;
}

/** Running total; carries forward on days with no deployment (a cumulative total does not fall). */
function projectPolicingCumulative(): MetricSeries {
  const s = empty();
  let lo = 0;
  let hi = 0;
  let days = 0;
  let started = false;

  for (const date of DATES) {
    const dep = DEPLOYMENT[date];
    if (dep) {
      const [a, b] = costBand(dep);
      lo += a;
      hi += b;
      days++;
      started = true;
    }
    if (!started) {
      pushNull(s);
      continue;
    }
    s.values.push(round2((lo + hi) / 2));
    s.bands.push([round2(lo), round2(hi)]);
    s.quality.push("e");
    s.notes.push({ k: "cumulative", days, added: Boolean(dep) });
    // a cumulative series is always drawn as a line; its band is shaded instead of barred
    s.detach.push(false);
  }
  return s;
}

/* -- weekly --------------------------------------------------------------- */

function aggregateWeekly(key: MetricKey, agg: Agg): MetricSeries {
  const s = empty();

  for (const week of WEEKS) {
    const nat: { date: string; obs: Obs }[] = [];
    const sub: { date: string; obs: Obs }[] = [];

    for (const d of week.dates) {
      const obs = FACTS[d]?.[key];
      if (!obs) continue;
      const q = obs.q ?? "n";
      (q === "r" || q === "p" ? sub : nat).push({ date: d, obs });
    }

    const bucket = nat.length ? nat : sub;
    if (!bucket.length) {
      pushNull(s);
      continue;
    }

    const regionalOnly = nat.length === 0;
    let low: number;
    let high: number;
    let value: number;
    let peak: string | undefined;

    if (agg === "sum") {
      low = bucket.reduce((a, x) => a + x.obs.low, 0);
      high = bucket.reduce((a, x) => a + x.obs.high, 0);
      value = (low + high) / 2;
    } else {
      low = Math.max(...bucket.map((x) => x.obs.low));
      high = Math.max(...bucket.map((x) => x.obs.high));
      const top = bucket.reduce((best, x) =>
        (x.obs.low + x.obs.high) / 2 > (best.obs.low + best.obs.high) / 2
          ? x
          : best,
      );
      value = (top.obs.low + top.obs.high) / 2;
      peak = top.date;
    }

    const parts: WeekNoteParts = {
      days: bucket.length,
      kind: regionalOnly ? "regional" : "national",
      peak,
      noNational: regionalOnly || undefined,
      excluded: nat.length && sub.length ? sub.length : undefined,
      floored: bucket.some((x) => x.obs.q === "f") || undefined,
      clipped: week.touchesEdge || undefined,
    };

    s.values.push(round2(value));
    s.bands.push([round2(low), round2(high)]);
    s.quality.push(parts.floored ? "f" : "w");
    s.notes.push({ k: "week", p: parts });
    s.detach.push(regionalOnly);
  }

  return s;
}

/* --------------------------------------------------------------- series */

const turnoutDaily = projectDaily("turnout");
const arrestsDaily = projectDaily("arrests");
const forcesDaily = projectDaily("forcesInjured");
const protestersDaily = projectDaily("protesterInjured");
const damagesDaily = projectDaily("damagesCost");
const policingDaily = projectPolicingDaily();
const policingCumulative = projectPolicingCumulative();

const turnoutWeekly = aggregateWeekly("turnout", "max");
const arrestsWeekly = aggregateWeekly("arrests", "sum");
const forcesWeekly = aggregateWeekly("forcesInjured", "sum");
const protestersWeekly = aggregateWeekly("protesterInjured", "sum");

/* ----------------------------------------------------------------- views */

function dailyView(): View {
  const m = t();
  return {
    labels: DATES.map(fmtDayMonth),
    titles: DATES.map(fmtDate),
    footers: DATES.map((d) => m.chart.dayNotes[d] ?? null),
    xTitle: m.chart.axisDate,
    maxRotation: 90,
    maxTicksLimit: 25,
  };
}

function weeklyView(): View {
  const m = t();
  return {
    labels: WEEKS.map(
      (w) => fmtWeek(w.key, w.end) + (w.touchesEdge ? m.chart.edgeMark : ""),
    ),
    titles: WEEKS.map((w) =>
      fill(w.touchesEdge ? m.chart.weekOfPartial : m.chart.weekOf, {
        date: fmtDayMonth(w.key),
      }),
    ),
    footers: WEEKS.map(() => null),
    xTitle: m.chart.axisWeek,
    maxRotation: 0,
    maxTicksLimit: 12,
  };
}

/* --------------------------------------------------- gap-aware connectors */

const GAP_DASH = [6, 4];
const SOLID: number[] = [];
type SegmentCtx = { p0DataIndex: number; p1DataIndex: number };

/** Any jump over more than one x-slot means something is missing in between. */
const connector = {
  borderDash: (ctx: SegmentCtx) =>
    Math.abs(ctx.p1DataIndex - ctx.p0DataIndex) > 1 ? GAP_DASH : SOLID,
} as unknown as NonNullable<ChartDataset<"line">["segment"]>;

/* ------------------------------------------------------- error-bar plugin */

const CAP_PX = 5;

interface ProtestDataset extends ChartDataset<"line", (number | null)[]> {
  errorBars?: Band[];
  errorBarColor?: string;
  bandFill?: boolean;
  bandFillColor?: string;
  quality?: (Quality | null)[];
  notes?: (NoteRef | null)[];
  unit?: Unit;
  /** excluded from the legend — the "points only" twin of a line series */
  detachedOnly?: boolean;
}

const errorBars: Plugin<"line"> = {
  id: "errorBars",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;

    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i] as ProtestDataset;
      if (!ds.errorBars) continue;

      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;

      const scale = chart.scales[meta.yAxisID ?? "y"];
      if (!scale) continue;

      const pts = meta.data as { x: number; skip?: boolean }[];

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        chartArea.left,
        chartArea.top,
        chartArea.width,
        chartArea.height,
      );
      ctx.clip();

      // cumulative series: shade the envelope instead of drawing a bar per day
      if (ds.bandFill) {
        const lowPts: [number, number][] = [];
        const highPts: [number, number][] = [];

        for (let j = 0; j < pts.length; j++) {
          const band = ds.errorBars[j];
          const p = pts[j];
          if (!band || p.skip) continue;
          lowPts.push([p.x, scale.getPixelForValue(band[0])]);
          highPts.push([p.x, scale.getPixelForValue(band[1])]);
        }

        if (lowPts.length > 1) {
          ctx.beginPath();
          ctx.moveTo(lowPts[0][0], lowPts[0][1]);
          for (let k = 1; k < lowPts.length; k++)
            ctx.lineTo(lowPts[k][0], lowPts[k][1]);
          for (let k = highPts.length - 1; k >= 0; k--)
            ctx.lineTo(highPts[k][0], highPts[k][1]);
          ctx.closePath();
          ctx.fillStyle = ds.bandFillColor ?? "rgba(14,116,144,0.14)";
          ctx.fill();
        }

        ctx.restore();
        continue;
      }

      ctx.strokeStyle = ds.errorBarColor ?? "#6b7280";
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let j = 0; j < pts.length; j++) {
        const band = ds.errorBars[j];
        const p = pts[j];
        if (!band || p.skip) continue;

        const yHigh = scale.getPixelForValue(band[1]);
        const yLow = scale.getPixelForValue(band[0]);

        ctx.moveTo(p.x, yHigh);
        ctx.lineTo(p.x, yLow);
        ctx.moveTo(p.x - CAP_PX, yHigh);
        ctx.lineTo(p.x + CAP_PX, yHigh);
        ctx.moveTo(p.x - CAP_PX, yLow);
        ctx.lineTo(p.x + CAP_PX, yLow);
      }

      ctx.stroke();
      ctx.restore();
    }
  },
};

/* -------------------------------------------------------------- formatting */

function fmt(v: number, unit: Unit): string {
  return unit === "eurM"
    ? fill(t().chart.eurM, { v: eurM().format(v) })
    : nf().format(Math.round(v));
}

function suffixFor(q: Quality | null | undefined, detached: boolean): string {
  const s = t().chart.suffix;
  const text =
    q === "c"
      ? s.c
      : q === "w"
        ? s.w
        : q === "e"
          ? s.e
          : q === "f"
            ? s.f
            : detached
              ? s.regional
              : "";
  return text ? fill(t().chart.suffixWrap, { text }) : "";
}

/** Resolve a stored note reference into copy, in the active locale. */
export function noteText(ref: NoteRef | null | undefined): string {
  if (!ref) return "";
  const m = t().chart;

  switch (ref.k) {
    case "obs":
      return m.obsNotes[ref.date]?.[ref.metric] ?? "";

    case "policing": {
      const head =
        ref.low === ref.high
          ? nf().format(ref.low)
          : `${nf().format(ref.low)}–${nf().format(ref.high)}`;
      const note = m.deployNotes[ref.date];
      return fill(note ? m.policingDay : m.policingDayPlain, {
        head,
        low: nf().format(RATE.low),
        high: nf().format(RATE.high),
        note: note ?? "",
      });
    }

    case "cumulative":
      return fill(ref.added ? m.cumulativeAdded : m.cumulativeCarried, {
        days: ref.days,
      });

    case "week": {
      const p = ref.p;
      const parts = [
        fill(p.kind === "national" ? m.weekNational : m.weekRegionalOnly, {
          n: p.days,
        }),
      ];
      if (p.peak) parts.push(fill(m.weekPeak, { date: fmtDayMonth(p.peak) }));
      if (p.noNational) parts.push(m.weekNoNational);
      if (p.excluded) parts.push(fill(m.weekExcluded, { n: p.excluded }));
      if (p.floored) parts.push(m.weekFloored);
      if (p.clipped) parts.push(m.weekClipped);
      return parts.join(m.weekJoin);
    }
  }
}

/* ------------------------------------------------------------- chart specs */

interface SeriesSpec {
  label: string;
  detachedLabel: string;
  series: MetricSeries;
  color: string;
  unit: Unit;
  yAxisID: string;
  borderWidth: number;
  radius: number;
  style?: PointStyle;
  /** 'never' keeps a derived series on the line (e.g. a running total). */
  detachPolicy?: "auto" | "never";
  bandFill?: boolean;
  bandFillColor?: string;
}

function metricDatasets(m: SeriesSpec): ProtestDataset[] {
  const s = m.series;
  const policy = m.detachPolicy ?? "auto";
  const off = (i: number): boolean =>
    policy === "never" ? false : s.detach[i];

  const line = s.values.map((v, i) => (off(i) ? null : v));
  const detached = s.values.map((v, i) => (off(i) ? v : null));
  const hasDetached = detached.some((v) => v !== null);

  const out: ProtestDataset[] = [
    {
      label: m.label,
      data: line,
      yAxisID: m.yAxisID,
      unit: m.unit,
      errorBars: s.bands.map((b, i) => (off(i) ? null : b)),
      errorBarColor: m.color,
      bandFill: m.bandFill,
      bandFillColor: m.bandFillColor,
      quality: s.quality,
      notes: s.notes,
      borderColor: m.color,
      backgroundColor: m.color,
      borderWidth: m.borderWidth,
      pointStyle: m.style,
      pointRadius: m.radius,
      pointHoverRadius: m.radius + 2,
      pointHitRadius: 14,
      tension: 0,
      spanGaps: SPAN_GAPS,
      segment: connector,
    },
  ];

  if (hasDetached) {
    out.push({
      label: m.detachedLabel,
      data: detached,
      yAxisID: m.yAxisID,
      unit: m.unit,
      showLine: false,
      detachedOnly: true,
      errorBars: s.bands.map((b, i) => (off(i) ? b : null)),
      errorBarColor: m.color,
      quality: s.quality,
      notes: s.notes,
      borderWidth: 0,
      pointStyle: m.style ?? "circle",
      pointBackgroundColor: "#ffffff",
      pointBorderColor: m.color,
      pointBorderWidth: 2,
      pointRadius: m.radius + 1,
      pointHoverRadius: m.radius + 3,
      pointHoverBorderWidth: 3,
      pointHitRadius: 14,
      spanGaps: false,
    });
  }

  return out;
}

function tooltipCallbacks(view: View) {
  const m = t().chart;
  return {
    title: (items: { dataIndex: number }[]) =>
      view.titles[items[0].dataIndex] ?? "",
    label: (item: {
      dataset: ChartDataset<"line", (number | null)[]>;
      dataIndex: number;
      parsed: { y: number | null };
    }) => {
      const ds = item.dataset as ProtestDataset;
      const unit = ds.unit ?? "count";
      const q = ds.quality?.[item.dataIndex];
      const note = noteText(ds.notes?.[item.dataIndex]);
      const detached = ds.showLine === false;

      const band = ds.errorBars?.[item.dataIndex];
      const base = band
        ? fill(m.tooltipRange, {
            label: ds.label,
            mid: fmt((band[0] + band[1]) / 2, unit),
            low: fmt(band[0], unit),
            high: fmt(band[1], unit),
          })
        : fill(m.tooltipPoint, {
            label: ds.label,
            value: fmt(item.parsed.y ?? 0, unit),
          });

      const body = base + suffixFor(q, detached);
      return note ? fill(m.tooltipNote, { base: body, note }) : body;
    },
    footer: (items: { dataIndex: number }[]) => {
      const note = view.footers[items[0].dataIndex];
      return note ? [fill(m.footerMark, { note })] : [];
    },
  };
}

function datasetsOf(arg: unknown): ProtestDataset[] {
  const o = arg as {
    datasets?: ProtestDataset[];
    data?: { datasets?: ProtestDataset[] };
  } | null;
  return o?.datasets ?? o?.data?.datasets ?? [];
}

/* ------------------------------------------------------------- chart specs
 * (SeriesSpec, metricDatasets, tooltipCallbacks, datasetsOf unchanged)
 */

/** 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 8 / 10 × 10^n — keeps bands inside the frame. */
function niceCeil(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 10;
  const base = 10 ** Math.floor(Math.log10(v));
  const n = v / base;
  const step =
    [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s + 1e-9) ?? 10;
  return step * base;
}

/** Upper bound from the values AND bands actually present on this axis — never a guessed constant. */
function axisMax(
  datasets: ProtestDataset[],
  axis: string,
  headroom = 1.08,
): number {
  let max = 0;
  for (const ds of datasets) {
    if ((ds.yAxisID ?? "y") !== axis) continue;
    for (const v of ds.data) if (typeof v === "number" && v > max) max = v;
    for (const b of ds.errorBars ?? []) if (b && b[1] > max) max = b[1];
  }
  return max > 0 ? niceCeil(max * headroom) : 10;
}

const Y_TICKS = {
  maxTicksLimit: 6,
  autoSkip: false,
  font: { size: 10 },
  padding: 6,
} as const;

type YScale = NonNullable<NonNullable<ChartOptions<"line">["scales"]>[string]>;

function yAxis(
  datasets: ProtestDataset[],
  axis: string,
  titleText: string,
  fmtTick: (v: number) => string,
): YScale {
  return {
    type: "linear",
    position: axis === "y" ? "left" : "right",
    beginAtZero: true,
    max: axisMax(datasets, axis),
    title: {
      display: true,
      text: titleText,
      color: "#4b5563",
      font: { size: 11 },
      padding: { bottom: 6 },
    },
    ticks: { ...Y_TICKS, callback: (v: string | number) => fmtTick(Number(v)) },
    grid: { color: "rgba(17,24,39,0.06)", drawTicks: false },
  };
}

const basePlugins = (subtitle: string) => ({
  legend: {
    position: "top" as const,
    align: "end" as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      boxHeight: 8,
      padding: 14,
      font: { size: 11 },
      // the detached twin is redundant in the legend, and is found by flag, not by its text
      filter: (item: LegendItem, ctx: unknown) =>
        !datasetsOf(ctx)[item.datasetIndex ?? -1]?.detachedOnly,
    },
  },
  subtitle: {
    display: true,
    text: subtitle,
    color: "#6b7280",
    font: { size: 11 },
    padding: { top: 0, bottom: 8 },
  },
});

const baseScales = (view: View) => ({
  x: {
    title: {
      display: true,
      text: view.xTitle,
      color: "#4b5563",
      font: { size: 11 },
      padding: { top: 4 },
    },
    grid: { display: false },
    ticks: {
      maxRotation: view.maxRotation,
      autoSkip: true,
      maxTicksLimit: view.maxTicksLimit,
      font: { size: 10 },
      color: "#6b7280",
      padding: 4,
    },
  },
});

const shell = (view: View, subtitle: string, title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 0,
  devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  interaction: { mode: "index" as const, intersect: false },
  layout: { padding: { top: 4, right: 16, bottom: 0, left: 4 } },
  plugins: {
    ...basePlugins(subtitle),
    title: {
      display: true,
      text: title,
      color: "#111827",
      font: { size: 15, weight: "bold" as const },
      padding: { top: 0, bottom: 2 },
    },
    tooltip: { callbacks: tooltipCallbacks(view) },
  },
});

type Cfg = {
  data: { labels: string[]; datasets: ProtestDataset[] };
} & ChartOptions<"line">;

/* ------------------------------------------- section A · chart 1 (daily) */

export function buildProtestersConfig(): Cfg {
  const m = t().chart;
  const view = dailyView();
  const s = m.series.protestersDaily;

  const datasets = metricDatasets({
    label: s.label,
    detachedLabel: s.detached,
    series: turnoutDaily,
    color: "#1d4ed8",
    unit: "count",
    yAxisID: "y",
    borderWidth: 2,
    radius: 4,
  });

  const options: ChartOptions<"line"> = {
    ...shell(
      view,
      m.charts.protestersDaily.subtitle,
      m.charts.protestersDaily.title,
    ),
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.protestersDaily.y, (v) =>
        compact().format(v),
      ),
    },
  };

  return { data: { labels: view.labels, datasets }, ...options };
}

/* ------------------------------------------- section A · chart 2 (daily) */

export function buildEnforcementConfig(): Cfg {
  const m = t().chart;
  const view = dailyView();

  const datasets = [
    ...metricDatasets({
      label: m.series.arrestsDaily.label,
      detachedLabel: m.series.arrestsDaily.detached,
      series: arrestsDaily,
      color: "#b91c1c",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 3.5,
    }),
    ...metricDatasets({
      label: m.series.forcesDaily.label,
      detachedLabel: m.series.forcesDaily.detached,
      series: forcesDaily,
      color: "#047857",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 4,
      style: "rectRot",
    }),
    ...metricDatasets({
      label: m.series.protestersInjuredDaily.label,
      detachedLabel: m.series.protestersInjuredDaily.detached,
      series: protestersDaily,
      color: "#b45309",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 5,
      style: "triangle",
    }),
  ];

  const options: ChartOptions<"line"> = {
    ...shell(
      view,
      m.charts.enforcementDaily.subtitle,
      m.charts.enforcementDaily.title,
    ),
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.enforcementDaily.y, (v) =>
        compact().format(v),
      ),
    },
  };

  return { data: { labels: view.labels, datasets }, ...options };
}

/* ------------------------------------------- section A · chart 3 (daily) */

export function buildCostConfig(): Cfg {
  const m = t().chart;
  const view = dailyView();

  const datasets = [
    ...metricDatasets({
      label: m.series.damagesDaily.label,
      detachedLabel: m.series.damagesDaily.detached,
      series: damagesDaily,
      color: "#7c3aed",
      unit: "eurM",
      yAxisID: "y",
      borderWidth: 2,
      radius: 5,
    }),
    ...metricDatasets({
      label: m.series.policingDaily.label,
      detachedLabel: m.series.policingDaily.detached,
      series: policingDaily,
      color: "#0e7490",
      unit: "eurM",
      yAxisID: "y",
      borderWidth: 2,
      radius: 4,
      style: "rect",
    }),
    ...metricDatasets({
      label: m.series.policingCumulative.label,
      detachedLabel: m.series.policingCumulative.detached,
      series: policingCumulative,
      color: "#0369a1",
      unit: "eurM",
      yAxisID: "y1",
      borderWidth: 2,
      radius: 0,
      detachPolicy: "never",
      bandFill: true,
      bandFillColor: "rgba(3,105,161,0.12)",
    }),
  ];

  const options: ChartOptions<"line"> = {
    ...shell(view, m.charts.cost.subtitle, m.charts.cost.title),
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.cost.yLeft, (v) =>
        fill(m.eurM, { v: nf().format(v) }),
      ),
      y1: {
        ...yAxis(datasets, "y1", m.charts.cost.yRight, (v) =>
          fill(m.eurM, { v: nf().format(v) }),
        ),
        grid: { drawOnChartArea: false },
      },
    },
  };

  return { data: { labels: view.labels, datasets }, ...options };
}

/* ------------------------------------------ section B · chart 4 (weekly) */

export function buildProtestersWeeklyConfig(): Cfg {
  const m = t().chart;
  const view = weeklyView();

  const datasets = metricDatasets({
    label: m.series.protestersWeekly.label,
    detachedLabel: m.series.protestersWeekly.detached,
    series: turnoutWeekly,
    color: "#1d4ed8",
    unit: "count",
    yAxisID: "y",
    borderWidth: 2,
    radius: 5,
  });

  const options: ChartOptions<"line"> = {
    ...shell(
      view,
      m.charts.protestersWeekly.subtitle,
      m.charts.protestersWeekly.title,
    ),
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.protestersWeekly.y, (v) =>
        compact().format(v),
      ),
    },
  };

  return { data: { labels: view.labels, datasets }, ...options };
}

/* ------------------------------------------ section B · chart 5 (weekly) */

export function buildEnforcementWeeklyConfig(): Cfg {
  const m = t().chart;
  const view = weeklyView();

  const datasets = [
    ...metricDatasets({
      label: m.series.arrestsWeekly.label,
      detachedLabel: m.series.arrestsWeekly.detached,
      series: arrestsWeekly,
      color: "#b91c1c",
      unit: "count",
      yAxisID: "y",
      borderWidth: 2,
      radius: 4,
    }),
    ...metricDatasets({
      label: m.series.forcesWeekly.label,
      detachedLabel: m.series.forcesWeekly.detached,
      series: forcesWeekly,
      color: "#047857",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 4,
      style: "rectRot",
    }),
    ...metricDatasets({
      label: m.series.protestersInjuredWeekly.label,
      detachedLabel: m.series.protestersInjuredWeekly.detached,
      series: protestersWeekly,
      color: "#b45309",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 5,
      style: "triangle",
    }),
  ];

  const options: ChartOptions<"line"> = {
    ...shell(
      view,
      m.charts.enforcementWeekly.subtitle,
      m.charts.enforcementWeekly.title,
    ),
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.enforcementWeekly.y, (v) =>
        compact().format(v),
      ),
    },
  };

  return { data: { labels: view.labels, datasets }, ...options };
}

/* ------------------------------------------------------------------ mount */

const MIN_CHART_H = 420;

/** Chart.js measures the PARENT, never the canvas. An auto-height parent resolves to the
 *  canvas's intrinsic 150px, which is why every series collapsed onto the baseline. */
function ensureChartBox(canvas: HTMLCanvasElement): HTMLElement {
  let host = canvas.parentElement;
  if (!host || host === document.body) {
    host = document.createElement("div");
    host.className = "wrap";
    canvas.parentNode?.insertBefore(host, canvas);
    host.append(canvas);
  }
  if (getComputedStyle(host).position === "static")
    host.style.position = "relative";
  if (host.clientHeight < 160) host.style.height = `${MIN_CHART_H}px`;
  canvas.style.display = "block";
  return host;
}

/** Charts are re-mounted on every locale change; a surviving instance on the same canvas
 *  throws "Canvas is already in use", which aborted render() before renderSources() ran. */
const mounted = new WeakMap<HTMLCanvasElement, Chart<"line">>();

export function mount(canvas: HTMLCanvasElement, cfg: Cfg): Chart<"line"> {
  ensureChartBox(canvas);
  mounted.get(canvas)?.destroy();

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;

  const chart = new Chart<"line">(ctx, {
    type: "line",
    data,
    options,
    plugins: [errorBars],
  });
  mounted.set(canvas, chart);
  return chart;
}

/* ------------------------------------------------ export for section C */

export type { Quality };

export interface StudentWeek {
  key: string; // ISO Monday
  start: string; // ISO Monday — same value, named for the Section C row
  end: string; // ISO Sunday
  touchesEdge: boolean;
  p: [number, number] | null;
  a: [number, number] | null;
  f: [number, number] | null;
  i: [number, number] | null;
  flags: Partial<Record<Metric, Quality>>;
  notes: Partial<Record<Metric, NoteRef>>;
}

/** One week, flattened next to the data it comes from — no positional contract left to break. */
function studentCell(
  s: MetricSeries,
  idx: number,
): { band: [number, number] | null; q?: Quality; noteRef?: NoteRef } {
  const band = s.bands[idx];
  if (!band) return { band: null };
  const raw = s.quality[idx] ?? "n";
  // a week whose only figures are regional/partial was detached by the aggregator
  const q: Quality = s.detach[idx] ? (raw === "f" ? "f" : "r") : raw;
  return { band: [band[0], band[1]], q, noteRef: s.notes[idx] ?? undefined };
}

const STUDENT_SERIES = {
  p: turnoutWeekly,
  a: arrestsWeekly,
  f: forcesWeekly,
  i: protestersWeekly,
} as const;

const STUDENT_METRICS: Metric[] = ["p", "a", "f", "i"];

export const STUDENT_WEEKS: StudentWeek[] = WEEKS.map((w, idx) => {
  const out: StudentWeek = {
    key: w.key,
    start: w.key,
    end: w.end,
    touchesEdge: w.touchesEdge,
    p: null,
    a: null,
    f: null,
    i: null,
    flags: {},
    notes: {},
  };
  for (const m of STUDENT_METRICS) {
    const c = studentCell(STUDENT_SERIES[m], idx);
    out[m] = c.band;
    if (c.q) out.flags[m] = c.q;
    if (c.noteRef) out.notes[m] = c.noteRef;
  }
  return out;
});
