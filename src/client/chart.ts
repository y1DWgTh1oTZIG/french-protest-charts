/* Sections A/B — 2026 daily and weekly charts. The five build*Config() bodies that
   differed only in their arguments are now one table (DEF) and one builder. */

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
  type ChartData,
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
  type ChartCardCopy,
  type ChartCopy,
} from "./i18n.ts";
import { DAILY, DATES, WEEKLY, WEEKS, type Pt, type Series } from "./data.ts";
import { THEME, gapSegment, track } from "./canvas.ts";
import { byId } from "./dom.ts";
import { noteText, suffixFor } from "./notes.ts";
import { isDetached, type Band, type Flag, type NoteRef } from "./model.ts";

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

type Unit = "count" | "eurM";
type SeriesId = keyof ChartCopy["series"];

const LEFT = "y";
const RIGHT = "y1";
const CAP_PX = 5;

/* ------------------------------------------------ one row per plotted series */

interface SeriesDef {
  readonly data: Series;
  readonly color: string;
  readonly unit: Unit;
  readonly radius: number;
  readonly width: number;
  readonly style?: PointStyle;
  readonly axis?: string;
  readonly bandFill?: string;
}

const DEF: Readonly<Record<SeriesId, SeriesDef>> = {
  protestersDaily: {
    data: DAILY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 4,
    width: 2,
  },
  arrestsDaily: {
    data: DAILY.arrests,
    color: "#b91c1c",
    unit: "count",
    radius: 3.5,
    width: 1.5,
  },
  forcesDaily: {
    data: DAILY.forcesInjured,
    color: "#047857",
    unit: "count",
    radius: 4,
    width: 1.5,
    style: "rectRot",
  },
  protestersInjuredDaily: {
    data: DAILY.protesterInjured,
    color: "#b45309",
    unit: "count",
    radius: 5,
    width: 1.5,
    style: "triangle",
  },
  damagesDaily: {
    data: DAILY.damagesCost,
    color: "#7c3aed",
    unit: "eurM",
    radius: 5,
    width: 2,
  },
  policingDaily: {
    data: DAILY.policing,
    color: "#0e7490",
    unit: "eurM",
    radius: 4,
    width: 2,
    style: "rect",
  },
  policingCumulative: {
    data: DAILY.policingCumulative,
    color: "#0369a1",
    unit: "eurM",
    radius: 0,
    width: 2,
    axis: RIGHT,
    bandFill: "rgba(3,105,161,0.12)",
  },
  protestersWeekly: {
    data: WEEKLY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 5,
    width: 2,
  },
  arrestsWeekly: {
    data: WEEKLY.arrests,
    color: "#b91c1c",
    unit: "count",
    radius: 4,
    width: 2,
  },
  forcesWeekly: {
    data: WEEKLY.forcesInjured,
    color: "#047857",
    unit: "count",
    radius: 4,
    width: 1.5,
    style: "rectRot",
  },
  protestersInjuredWeekly: {
    data: WEEKLY.protesterInjured,
    color: "#b45309",
    unit: "count",
    radius: 5,
    width: 1.5,
    style: "triangle",
  },
};

/** The five canvases, declared once — main.ts no longer keeps a parallel list. */
export interface ChartSpec {
  readonly id: string;
  readonly copy: keyof ChartCopy["charts"];
  readonly weekly: boolean;
  readonly series: readonly SeriesId[];
}

export const CHARTS: readonly ChartSpec[] = [
  {
    id: "chart-protesters",
    copy: "protestersDaily",
    weekly: false,
    series: ["protestersDaily"],
  },
  {
    id: "chart-enforcement",
    copy: "enforcementDaily",
    weekly: false,
    series: ["arrestsDaily", "forcesDaily", "protestersInjuredDaily"],
  },
  {
    id: "chart-costs",
    copy: "cost",
    weekly: false,
    series: ["damagesDaily", "policingDaily", "policingCumulative"],
  },
  {
    id: "chart-protesters-weekly",
    copy: "protestersWeekly",
    weekly: true,
    series: ["protestersWeekly"],
  },
  {
    id: "chart-enforcement-weekly",
    copy: "enforcementWeekly",
    weekly: true,
    series: ["arrestsWeekly", "forcesWeekly", "protestersInjuredWeekly"],
  },
];

/* ---------------------------------------------------------------- axis view */

interface View {
  labels: string[];
  titles: string[];
  footers: (string | null)[];
  xTitle: string;
  maxRotation: number;
  maxTicksLimit: number;
}

function view(weekly: boolean): View {
  const c = t().chart;
  return weekly
    ? {
        labels: WEEKS.map(
          (w) => fmtWeek(w.key, w.end) + (w.touchesEdge ? c.edgeMark : ""),
        ),
        titles: WEEKS.map((w) =>
          fill(w.touchesEdge ? c.weekOfPartial : c.weekOf, {
            date: fmtDayMonth(w.key),
          }),
        ),
        footers: WEEKS.map(() => null),
        xTitle: c.axisWeek,
        maxRotation: 0,
        maxTicksLimit: 12,
      }
    : {
        labels: DATES.map(fmtDayMonth),
        titles: DATES.map(fmtDate),
        footers: DATES.map((d) => c.dayNotes[d] ?? null),
        xTitle: c.axisDate,
        maxRotation: 90,
        maxTicksLimit: 25,
      };
}

/* -------------------------------------------------------- dataset building */

interface ProtestDataset extends ChartDataset<"line", (number | null)[]> {
  errorBars?: (Band | null)[];
  errorBarColor?: string;
  bandFill?: boolean;
  bandFillColor?: string;
  quality?: (Flag | null)[];
  notes?: (NoteRef | null)[];
  unit?: Unit;
  /** hidden from the legend — the points-only twin of a line series */
  detachedOnly?: boolean;
}

/** A line plus, when the series contains any detached point, a hollow twin. */
function datasetsFor(id: SeriesId): ProtestDataset[] {
  const def = DEF[id];
  const copy = t().chart.series[id];
  const axis = def.axis ?? LEFT;
  const plot = (keep: (p: Pt) => boolean) =>
    def.data.map((p) => (keep(p) ? p.v : null));
  const bands = (keep: (p: Pt) => boolean) =>
    def.data.map((p) => (keep(p) ? p.band : null));

  const line: ProtestDataset = {
    label: copy.label,
    data: plot((p) => !p.detach),
    yAxisID: axis,
    unit: def.unit,
    errorBars: bands((p) => !p.detach),
    errorBarColor: def.color,
    bandFill: Boolean(def.bandFill),
    bandFillColor: def.bandFill,
    quality: def.data.map((p) => p.q),
    notes: def.data.map((p) => p.note),
    borderColor: def.color,
    backgroundColor: def.color,
    borderWidth: def.width,
    pointStyle: def.style,
    pointRadius: def.radius,
    pointHoverRadius: def.radius + 2,
    pointHitRadius: 14,
    tension: 0,
    spanGaps: true,
    segment: gapSegment(),
  };

  if (!def.data.some((p) => p.detach)) return [line];

  return [
    line,
    {
      label: copy.detached,
      data: plot((p) => p.detach),
      yAxisID: axis,
      unit: def.unit,
      showLine: false,
      detachedOnly: true,
      errorBars: bands((p) => p.detach),
      errorBarColor: def.color,
      quality: line.quality,
      notes: line.notes,
      borderWidth: 0,
      pointStyle: def.style ?? "circle",
      pointBackgroundColor: THEME.hollow,
      pointBorderColor: def.color,
      pointBorderWidth: 2,
      pointRadius: def.radius + 1,
      pointHoverRadius: def.radius + 3,
      pointHoverBorderWidth: 3,
      pointHitRadius: 14,
      spanGaps: false,
    },
  ];
}

/* -------------------------------------------------------- error-bar plugin */

const errorBars: Plugin<"line"> = {
  id: "errorBars",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;

    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i] as ProtestDataset;
      if (!ds.errorBars) continue;

      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;

      const scale = chart.scales[meta.yAxisID ?? LEFT];
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

      ctx.strokeStyle = ds.errorBarColor ?? THEME.muted;
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

/* --------------------------------------------------------------- formatting */

function fmt(v: number, unit: Unit): string {
  return unit === "eurM"
    ? fill(t().chart.eurM, { v: eurM().format(v) })
    : nf().format(Math.round(v));
}

const tickFormat =
  (unit: Unit) =>
  (v: number): string =>
    unit === "eurM"
      ? fill(t().chart.eurM, { v: nf().format(v) })
      : compact().format(v);

/* ----------------------------------------------------------------- tooltip */

function tooltipCallbacks(v: View) {
  const m = t().chart;
  return {
    title: (items: { dataIndex: number }[]) =>
      v.titles[items[0].dataIndex] ?? "",
    label: (item: {
      dataset: ChartDataset<"line", (number | null)[]>;
      dataIndex: number;
      parsed: { y: number | null };
    }) => {
      const ds = item.dataset as ProtestDataset;
      const unit = ds.unit ?? "count";
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

      const body = base + suffixFor(ds.quality?.[item.dataIndex], detached);
      return note ? fill(m.tooltipNote, { base: body, note }) : body;
    },
    footer: (items: { dataIndex: number }[]) => {
      const note = v.footers[items[0].dataIndex];
      return note ? [fill(m.footerMark, { note })] : [];
    },
  };
}

/* ------------------------------------------------------------------ scales */

/** 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 8 / 10 × 10^n — keeps bands inside the frame. */
function niceCeil(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 10;
  const base = 10 ** Math.floor(Math.log10(v));
  const n = v / base;
  const step =
    [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s + 1e-9) ?? 10;
  return step * base;
}

/** Upper bound from the values AND bands actually present on this axis. */
function axisMax(list: readonly Series[], headroom = 1.08): number {
  let max = 0;
  for (const series of list) {
    for (const p of series) {
      if (p.v !== null && p.v > max) max = p.v;
      if (p.band && p.band[1] > max) max = p.band[1];
    }
  }
  return max > 0 ? niceCeil(max * headroom) : 10;
}

const Y_TICKS = {
  maxTicksLimit: 6,
  autoSkip: false,
  font: { size: 10 },
  padding: 6,
} as const;

/** The tick formatter follows the unit, so call sites stop re-passing it. */
function yAxis(
  title: string,
  list: readonly Series[],
  unit: Unit,
  position: "left" | "right",
) {
  return {
    type: "linear" as const,
    position,
    beginAtZero: true,
    max: axisMax(list),
    title: {
      display: true,
      text: title,
      color: THEME.label,
      font: { size: 11 },
      padding: { bottom: 6 },
    },
    ticks: {
      ...Y_TICKS,
      callback: (v: string | number) => tickFormat(unit)(Number(v)),
    },
    grid: { color: THEME.axisGrid, drawTicks: false },
  };
}

type Scales = NonNullable<ChartOptions<"line">["scales"]>;

function baseScales(v: View): Scales {
  return {
    x: {
      title: {
        display: true,
        text: v.xTitle,
        color: THEME.label,
        font: { size: 11 },
        padding: { top: 4 },
      },
      grid: { display: false },
      ticks: {
        maxRotation: v.maxRotation,
        autoSkip: true,
        maxTicksLimit: v.maxTicksLimit,
        font: { size: 10 },
        color: THEME.muted,
        padding: 4,
      },
    },
  };
}

function scalesFor(
  v: View,
  card: ChartCardCopy,
  ids: readonly SeriesId[],
): Scales {
  const defs = ids.map((id) => DEF[id]);
  const left = defs.filter((d) => (d.axis ?? LEFT) === LEFT);
  const right = defs.filter((d) => d.axis === RIGHT);

  const scales: Scales = {
    ...baseScales(v),
    [LEFT]: yAxis(
      card.y ?? card.yLeft ?? "",
      left.map((d) => d.data),
      left[0].unit,
      "left",
    ),
  };
  if (right.length) {
    scales[RIGHT] = {
      ...yAxis(
        card.yRight ?? "",
        right.map((d) => d.data),
        right[0].unit,
        "right",
      ),
      grid: { drawOnChartArea: false },
    };
  }
  return scales;
}

/* ------------------------------------------------------------- chart shell */

const shell = (v: View, subtitle: string, title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 0,
  devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  interaction: { mode: "index" as const, intersect: false },
  layout: { padding: { top: 4, right: 16, bottom: 0, left: 4 } },
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        padding: 14,
        font: { size: 11 },
        // Chart.js passes the ChartData; the old datasetsOf() probe is gone
        filter: (item: LegendItem, data: ChartData<"line">) =>
          !(
            data.datasets[item.datasetIndex ?? -1] as ProtestDataset | undefined
          )?.detachedOnly,
      },
    },
    subtitle: {
      display: true,
      text: subtitle,
      color: THEME.muted,
      font: { size: 11 },
      padding: { top: 0, bottom: 8 },
    },
    title: {
      display: true,
      text: title,
      color: THEME.ink,
      font: { size: 15, weight: "bold" as const },
      padding: { top: 0, bottom: 2 },
    },
    tooltip: { callbacks: tooltipCallbacks(v) },
  },
});

type Cfg = {
  data: { labels: string[]; datasets: ProtestDataset[] };
} & ChartOptions<"line">;

/** One builder for all five charts. */
export function buildChart(spec: ChartSpec): Cfg {
  const card = t().chart.charts[spec.copy];
  const v = view(spec.weekly);
  return {
    data: { labels: v.labels, datasets: spec.series.flatMap(datasetsFor) },
    ...shell(v, card.subtitle, card.title),
    scales: scalesFor(v, card, spec.series),
  };
}

/* ------------------------------------------------------------------- mount */

const MIN_CHART_H = 420;

/** Chart.js measures the PARENT, never the canvas; an auto-height parent resolves
 *  to the canvas's intrinsic 150px, which collapsed every series onto the baseline. */
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

export function mount(canvas: HTMLCanvasElement, cfg: Cfg): Chart<"line"> {
  ensureChartBox(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;
  return track(
    new Chart<"line">(ctx, {
      type: "line",
      data,
      options,
      plugins: [errorBars],
    }),
  );
}

/** Mounts every canvas in CHARTS; one bad chart must not blank the page. */
export function mountCharts(): void {
  for (const spec of CHARTS) {
    const canvas = byId(spec.id);
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn(`[chart] #${spec.id} is not a canvas`);
      continue;
    }
    try {
      // the aria-label in index.html is French-only; keep it in sync with the locale
      const title = t().chart.charts[spec.copy].title;
      canvas.setAttribute("aria-label", title);
      mount(canvas, buildChart(spec));
    } catch (err) {
      console.error(`[${spec.id}]`, err);
    }
  }
}
