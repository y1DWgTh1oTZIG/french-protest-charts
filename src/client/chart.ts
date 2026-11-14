/* Sections A/B — 2026 daily and weekly charts. The five build*Config() bodies that
   differed only in their arguments are now one table (DEF) and one builder. */

import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  SubTitle,
  Title,
  Tooltip,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  type LegendItem,
  type Plugin,
  type PointStyle,
  type TooltipItem,
} from "chart.js";
import { THEME, track } from "./canvas.ts";
import {
  DAILY,
  dailyHolidaySegment,
  DATES,
  HOLIDAY_DASH,
  WEEKLY,
  weeklyHolidaySegment,
  WEEKS,
  type Pt,
  type Series,
} from "./data.ts";
import { byId } from "./dom.ts";
import {
  a11y,
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
import { type Band, type Flag, type NoteRef } from "./model.ts";
import { noteText, suffixFor } from "./notes.ts";
import { wrapTooltipLines } from "./tooltip.ts";
import { fromChart, keyboardChart } from "./a11y.ts";

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

const LEFT = "y";
const RIGHT = "y1";
const CAP_PX = 5;

/* ------------------------------------------------ one row per plotted series */

/** The €1,000M damages total is the span ring's right-hand anchor: keep the
 *  datum (tooltip, band, axis max) and hide only its marker. */
const DAMAGES_ANCHOR = "2026-10-24";

const damagesRadius = (r: number): number[] =>
  DATES.map((d) => (d === DAMAGES_ANCHOR ? 0 : r));

interface SeriesDef {
  readonly data: Series;
  readonly color: string;
  readonly unit: Unit;
  readonly radius: number;
  /** Per-index override of `radius`; a 0 hides the marker, not the point. */
  readonly pointRadius?: readonly number[];
  readonly width: number;
  readonly style?: PointStyle;
  readonly axis?: string;
  readonly bandFill?: string;
  readonly log?: boolean;
  readonly holiday?: "daily" | "weekly";
  readonly shadeOnly?: boolean;
}

/**
 * `satisfies` rather than `Record<SeriesId, SeriesDef>`: the key set is
 * inferred from the object, so `keyof typeof DEF` is a literal union and a
 * misspelled key becomes a compile error instead of a runtime undefined.
 */
const DEF = {
  protestersDaily: {
    data: DAILY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 4,
    width: 2,
  },
  blockadesDaily: {
    data: DAILY.blockades,
    color: "#8C564B",
    unit: "count",
    radius: 3,
    width: 1.75,
    axis: RIGHT,
    log: true,
    holiday: "daily",
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
  forcesInjuredStock: {
    data: DAILY.forcesInjuredStock,
    color: "#065f46",
    unit: "count",
    radius: 3,
    width: 2,
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
    pointRadius: damagesRadius(5),
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
    bandFill: "rgba(3,105,161,0.12)",
    shadeOnly: true,
  },
  protestersWeekly: {
    data: WEEKLY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 5,
    width: 2,
  },
  blockadesWeekly: {
    data: WEEKLY.blockades,
    color: "#8C564B",
    unit: "count",
    radius: 3,
    width: 1.75,
    axis: RIGHT,
    log: true,
    holiday: "weekly",
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
} satisfies Record<string, SeriesDef>;

/* ----- KPI support ---- */

/** The points a series actually draws, as index/value pairs.
 *
 * A marker with radius 0 is an aggregate that is not a daily value — the
 * €1,000M damages total of 24 Oct, kept as the span ring's right-hand anchor
 * but drawn without a marker. The KPIs take the chart's own mask, so a figure
 * the reader cannot see as a marker is neither a "largest day" nor an item in
 * a mean. Delete the two mask lines below to count it like any other point.
 */
export function visiblePoints(
  dataKey: string,
  weekly = false,
): { i: number; v: number }[] {
  const series = weekly ? WEEKLY[dataKey] : DAILY[dataKey];
  if (!series) return [];

  let mask: readonly number[] | null = null;
  for (const def of Object.values(DEF)) {
    const d = def as unknown as {
      data?: Series;
      pointRadius?: number | number[];
    };
    if (d.data !== series) continue;
    if (Array.isArray(d.pointRadius)) mask = d.pointRadius;
  }

  const out: { i: number; v: number }[] = [];
  series.forEach((p, i) => {
    if (p.v === null) return;
    if (mask && mask[i] === 0) return;
    out.push({ i, v: p.v });
  });
  return out;
}

/** Literal union of the keys actually defined — a typo is now a type error. */
type SeriesId = keyof typeof DEF;

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
    series: ["protestersDaily", "blockadesDaily"],
  },
  {
    id: "chart-enforcement",
    copy: "enforcementDaily",
    weekly: false,
    series: [
      "arrestsDaily",
      "forcesDaily",
      "forcesInjuredStock",
      "protestersInjuredDaily",
    ],
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
    series: ["protestersWeekly", "blockadesWeekly"],
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
  /** Suppress the whisker pass; the band array is still used for fill + tooltip. */
  noWhiskers?: boolean;
  quality?: (Flag | null)[];
  notes?: (NoteRef | null)[];
  unit?: Unit;
  /** hidden from the legend — the points-only twin of a line series */
  detachedOnly?: boolean;
  connectors?: ConnectorSpec;
  /** Indexical, like Chart.js's own point options. */
  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
}

/** A dashed connector means "reporting paused here", so the policy is a
 *  property of the SERIES, not of a point pair. `segment` cannot express it:
 *  it is resolved per adjacent index pair and its runs are snapped onto
 *  visible points, so a long dashed gap bleeds into the next short one. */
interface ConnectorSpec {
  readonly series: Series;
  /** Dash a connector that skips more than this many x-slots. */
  readonly slots: number;
  /** Dotted instead, when the connector bridges the Toussaint holiday. */
  readonly holiday?: (a: number, b: number) => boolean;
}

const DAILY_GAP = 7; // a reporting break starts at 8 days
const WEEKLY_GAP = 1; // one empty week

/** A line plus, when the series contains any detached point, a hollow twin. */
function datasetsFor(id: SeriesId, weekly: boolean): ProtestDataset[] {
  const def = DEF[id];
  if (!def) throw new Error(`chart.ts: no DEF entry for series "${id}"`);
  if (!def.data) throw new Error(`chart.ts: series "${id}" has no data`);

  // The mask is indexed like DEF.data, so a length mismatch would silently
  // shift every marker one slot left.
  if (def.pointRadius && def.pointRadius.length !== def.data.length) {
    throw new Error(
      `chart.ts: "${id}" pointRadius has ${def.pointRadius.length} entries, ` +
        `expected ${def.data.length}`,
    );
  }

  const radiusAt = (i: number, bump = 0): number => {
    const r = def.pointRadius?.[i] ?? def.radius;
    return r === 0 ? 0 : r + bump;
  };

  const copy = t().chart.series[id];
  const axis = def.axis ?? LEFT;
  const plot = (keep: (p: Pt) => boolean) =>
    def.data.map((p) => (keep(p) ? p.v : null));
  const bands = (keep: (p: Pt) => boolean) =>
    def.data.map((p) => (keep(p) ? p.band : null));

  const holiday =
    def.holiday === "weekly"
      ? weeklyHolidaySegment
      : def.holiday === "daily"
        ? dailyHolidaySegment
        : undefined;

  const line: ProtestDataset = {
    label: copy.label,
    data: plot((p) => !p.detach),
    yAxisID: axis,
    unit: def.unit,
    errorBars: bands((p) => !p.detach),
    errorBarColor: def.color,
    bandFill: Boolean(def.bandFill),
    bandFillColor: def.bandFill,
    noWhiskers: Boolean(def.shadeOnly),
    quality: def.data.map((p) => p.q),
    notes: def.data.map((p) => p.note),
    borderColor: def.color,
    backgroundColor: def.color,
    borderWidth: def.width,
    pointStyle: def.style,
    pointRadius: def.data.map((_, i) => radiusAt(i)),
    pointHoverRadius: def.data.map((_, i) => radiusAt(i, 2)),
    pointHitRadius: 14,
    tension: 0,
    // Chart.js must connect nothing across a hole: the connectors plugin
    // draws every bridge itself, so solid/dashed/dotted is decided once.
    spanGaps: false,
    connectors: {
      series: def.data,
      slots: weekly ? WEEKLY_GAP : DAILY_GAP,
      holiday,
    },
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
      noWhiskers: Boolean(def.shadeOnly),
      quality: line.quality,
      notes: line.notes,
      borderWidth: 0,
      pointStyle: def.style ?? "circle",
      pointBackgroundColor: THEME.hollow,
      pointBorderColor: def.color,
      pointBorderWidth: 2,
      pointRadius: def.data.map((_, i) => radiusAt(i, 1)),
      pointHoverRadius: def.data.map((_, i) => radiusAt(i, 3)),
      pointHoverBorderWidth: 3,
      pointHitRadius: 14,
      spanGaps: false,
    },
  ];
}

/* -------------------------------------------------------- error-bar plugin */

const errorBars: Plugin<"line"> = {
  id: "errorBars",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i] as ProtestDataset;
      if (!ds.bandFill || !ds.errorBars) continue;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;
      const scale = chart.scales[meta.yAxisID ?? LEFT];
      if (!scale) continue;

      const pts = meta.data as { x: number; skip?: boolean }[];
      const lowPts: [number, number][] = [];
      const highPts: [number, number][] = [];

      for (let j = 0; j < pts.length; j++) {
        const band = ds.errorBars[j];
        const p = pts[j];
        if (!band || p.skip) continue;
        lowPts.push([p.x, scale.getPixelForValue(band[0])]);
        highPts.push([p.x, scale.getPixelForValue(band[1])]);
      }
      if (lowPts.length < 2) continue;

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        chartArea.left,
        chartArea.top,
        chartArea.width,
        chartArea.height,
      );
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(lowPts[0][0], lowPts[0][1]);
      for (let k = 1; k < lowPts.length; k++)
        ctx.lineTo(lowPts[k][0], lowPts[k][1]);
      for (let k = highPts.length - 1; k >= 0; k--)
        ctx.lineTo(highPts[k][0], highPts[k][1]);
      ctx.closePath();
      ctx.fillStyle = ds.bandFillColor ?? "rgba(14,116,144,0.14)";
      ctx.fill();
      ctx.restore();
    }
  },
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;

    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i] as ProtestDataset;
      if (!ds.errorBars || ds.noWhiskers) continue;

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

/* Solid where the hole is short, [6,4] where reporting paused, [1.5,3] across
   the Toussaint holiday. Drawn under the markers, over the grid and the band. */
const connectors: Plugin<"line"> = {
  id: "connectors",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const xs = scales.x;
    if (!chartArea || !xs) return;

    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i] as ProtestDataset;
      const spec = ds.connectors;
      if (!spec) continue;

      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;

      const ys = scales[meta.yAxisID ?? LEFT];
      if (!ys) continue;
      const logAxis = ys.type === "logarithmic";

      // plotted points only; a detached marker ends the run
      const at: number[] = [];
      for (let j = 0; j < spec.series.length; j++) {
        const p = spec.series[j];
        if (p && p.v != null && p.v > (logAxis ? 0 : -Infinity) && !p.detach) {
          at.push(j);
        }
      }
      if (at.length < 2) continue;

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        chartArea.left,
        chartArea.top,
        chartArea.width,
        chartArea.height,
      );
      ctx.clip();
      ctx.strokeStyle = (ds.borderColor as string) ?? THEME.ink;
      ctx.lineWidth = (ds.borderWidth as number) ?? 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "butt";

      for (let k = 1; k < at.length; k++) {
        const a = at[k - 1];
        const b = at[k];
        if (b - a === 1) continue;

        const va = spec.series[a]?.v;
        const vb = spec.series[b]?.v;
        if (va == null || vb == null) continue;

        const dotted = spec.holiday?.(a, b) === true;
        const dashed = dotted || b - a > spec.slots;

        ctx.setLineDash(dotted ? [...HOLIDAY_DASH] : dashed ? [6, 4] : []);
        ctx.beginPath();
        ctx.moveTo(xs.getPixelForValue(a), ys.getPixelForValue(va));
        ctx.lineTo(xs.getPixelForValue(b), ys.getPixelForValue(vb));
        ctx.stroke();
      }
      ctx.restore();
    }
  },
};

/* ----- span marker: a figure published for a date range, not a single day */

type SpanMark = {
  readonly from: string; // ISO date, inclusive
  readonly to: string; // ISO date, inclusive
  readonly value: number; // €M, drawn on the left axis
  readonly color: string;
};

/** CCI France's 27 Oct tally values 17–24 Oct as a whole, so the €1bn cell is
 *  shown spanning those dates rather than as a point on 24 Oct. */
const SPAN_MARKS: readonly SpanMark[] = [
  {
    from: "2026-10-17",
    to: "2026-10-24",
    value: 1_000,
    color: DEF.damagesDaily.color,
  },
];

/** "ellipse" = dashed lozenge around the span; "brace" = overbrace, ends
 *  curling down toward the x axis. */
const MARKER: "ellipse" | "brace" = "ellipse";
const ELLIPSE_RY = 7;
const BRACE_CURL = 6;
const BRACE_LIFT = 12;

function withAlpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

const spanMark: Plugin<"line"> = {
  id: "spanMark",
  afterDatasetsDraw(chart) {
    const spans = (
      chart.options.plugins as
        | { spanMark?: { spans?: readonly SpanMark[] } }
        | undefined
    )?.spanMark?.spans;
    if (!spans?.length) return;

    const xs = chart.scales.x;
    const ys = chart.scales[LEFT];
    if (!xs || !ys) return;

    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.clip();
    ctx.lineWidth = 1.5;

    for (const s of spans) {
      const i0 = DATES.indexOf(s.from);
      const i1 = DATES.indexOf(s.to);
      if (i0 < 0 || i1 <= i0) continue;

      const x0 = xs.getPixelForValue(i0);
      const x1 = xs.getPixelForValue(i1);
      if (Math.abs(x1 - x0) < 8) continue;

      const y = ys.getPixelForValue(s.value);
      const mid = (x0 + x1) / 2;

      ctx.strokeStyle = s.color;
      ctx.fillStyle = withAlpha(s.color, 0.1);
      ctx.beginPath();

      if (MARKER === "ellipse") {
        ctx.setLineDash([4, 3]);
        ctx.ellipse(
          mid,
          y,
          Math.abs(x1 - x0) / 2,
          ELLIPSE_RY,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.stroke();
      } else {
        const top = y - BRACE_LIFT;
        const c = BRACE_CURL;
        ctx.setLineDash([]);
        ctx.moveTo(x0, top + c);
        ctx.quadraticCurveTo(x0, top, x0 + c, top);
        ctx.lineTo(mid - c, top);
        ctx.quadraticCurveTo(mid, top, mid, top - c);
        ctx.quadraticCurveTo(mid, top, mid + c, top);
        ctx.lineTo(x1 - c, top);
        ctx.quadraticCurveTo(x1, top, x1, top + c);
        ctx.stroke();
      }

      // caption, skipped when it would hit the frame
      const labelY =
        (MARKER === "ellipse" ? y - ELLIPSE_RY : y - BRACE_LIFT - BRACE_CURL) -
        2;
      if (labelY - 10 > chartArea.top) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillStyle = s.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          `${fmtDayMonth(s.from)}–${fmtDayMonth(s.to)}`,
          mid,
          labelY,
        );
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
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

/* ----- tooltip */

function tooltipCallbacks(v: View) {
  const m = t().chart;
  return {
    title: (items: TooltipItem<"line">[]) =>
      wrapTooltipLines(v.titles[items[0].dataIndex] ?? "", items[0], "title"),
    label: (item: TooltipItem<"line">) => {
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
      // tooltipNote already carries a \n between base and note; wrapText keeps
      // that break as a blank-free paragraph split, then folds each paragraph.
      return wrapTooltipLines(
        note ? fill(m.tooltipNote, { base: body, note }) : body,
        item,
        "body",
      );
    },
    footer: (items: TooltipItem<"line">[]) => {
      const note = v.footers[items[0].dataIndex];
      return note
        ? wrapTooltipLines(fill(m.footerMark, { note }), items[0], "footer")
        : [];
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

/** 1 / 10 / 100 / 1k / 2k. Eleven minor log ticks is what made the axis
 *  unreadable; Chart.js will not thin them itself once autoSkip is false. */
function logTicks(min: number, max: number): number[] {
  const out: number[] = [];
  const from = Math.floor(Math.log10(Math.max(min, 1e-6)));
  const to = Math.ceil(Math.log10(Math.max(max, 1)));
  for (let e = from; e <= to; e++) {
    const v = 10 ** e;
    if (v >= min * 1.0001 && v <= max * 0.9999) out.push(v);
  }
  if (max > 1) out.push(max);
  return out;
}

/** Lower bound for a log axis: the smallest positive value present. */
function axisMin(list: readonly Series[]): number {
  let min = Infinity;
  for (const series of list) {
    for (const p of series) {
      if (p.v !== null && p.v > 0 && p.v < min) min = p.v;
      if (p.band && p.band[0] > 0 && p.band[0] < min) min = p.band[0];
    }
  }
  return Number.isFinite(min) ? min : 1;
}

/** The tick formatter follows the unit, so call sites stop re-passing it. */
function yAxis(
  title: string,
  list: readonly Series[],
  unit: Unit,
  position: "left" | "right",
  log = false,
) {
  const max = axisMax(list);
  const floor = axisMin(list) * 0.9;

  // generateTicks emits 1/2/3/4/5/6/8/10/12/15/20… and buildTicks never calls
  // ticks.callback, so the minors have to be blanked here.
  const tick = (n: number): string => {
    if (!log) return tickFormat(unit)(n);
    const l = Math.log10(n);
    const decade = Math.abs(l - Math.round(l)) < 1e-9;
    return decade || Math.abs(n - max) < 1e-9 ? tickFormat(unit)(n) : "";
  };

  const base = {
    position,
    max,
    title: {
      display: true,
      text: title,
      color: THEME.label,
      font: { size: 11 },
      padding: { bottom: 6 },
    },
    ticks: {
      ...Y_TICKS,
      callback: (v: string | number) => tick(Number(v)),
    },
    grid: { color: THEME.axisGrid, drawTicks: false },
  };

  if (!log) return { type: "linear" as const, beginAtZero: true, ...base };

  return {
    type: "logarithmic" as const,
    min: floor,
    ...base,
    ticks: { ...base.ticks, autoSkip: false },
    afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
      axis.ticks = logTicks(floor, max).map((value) => ({ value }));
    },
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
        font: { size: 12 },
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

  // A spec with only a right-axis series must still get an `y` scale: the
  // datasets reference yAxisID "y", and a missing scale throws inside mount().
  const leftList = (left.length ? left : defs).map((d) => d.data);
  const leftUnit: Unit = left[0]?.unit ?? defs[0]?.unit ?? "count";

  const scales: Scales = {
    ...baseScales(v),
    [LEFT]: yAxis(card.y ?? card.yLeft ?? "", leftList, leftUnit, "left"),
  };
  if (right.length) {
    scales[RIGHT] = {
      ...yAxis(
        card.yRight ?? "",
        right.map((d) => d.data),
        right[0].unit,
        "right",
        right.some((d) => d.log),
      ),
      grid: {
        color: THEME.axisGrid,
        drawTicks: false,
        drawOnChartArea: false,
      },
    };
  }
  return scales;
}

/* ------------------------------------------------------------- chart shell */

const shell = (
  v: View,
  subtitle: string,
  title: string,
  extra?: Record<string, unknown>,
) => ({
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
        color: THEME.label, // was Chart.js default #666: invisible on dark
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        padding: 14,
        font: { size: 11 },
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
      font: { size: 12 },
      padding: { top: 0, bottom: 8 },
    },
    title: {
      display: true,
      text: title,
      color: THEME.ink,
      font: { size: 16, weight: "bold" as const },
      padding: { top: 0, bottom: 2 },
    },
    tooltip: {
      backgroundColor: THEME.tooltipBg,
      titleColor: THEME.tooltipInk,
      bodyColor: THEME.tooltipInk,
      borderColor: THEME.grid,
      borderWidth: 1,
      callbacks: tooltipCallbacks(v),
    },
    ...extra,
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
    data: {
      labels: v.labels,
      datasets: spec.series.flatMap((id) => datasetsFor(id, spec.weekly)),
    },
    ...shell(
      v,
      card.subtitle,
      card.title,
      spec.id === "chart-costs"
        ? { spanMark: { spans: SPAN_MARKS } }
        : undefined,
    ),
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
      plugins: [errorBars, connectors, spanMark],
    }),
  );
}

export function mountCharts(): void {
  for (const spec of CHARTS) {
    const canvas = byId(spec.id);
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn(`[chart] #${spec.id} is not a canvas`);
      continue;
    }
    try {
      const copy = t().chart.charts[spec.copy];
      const name = copy.subtitle
        ? `${copy.title}. ${copy.subtitle}`
        : copy.title;

      // Name = title + subtitle: the subtitle carries the caveats that make
      // the figure honest, and it is otherwise invisible to AT.
      canvas.setAttribute("aria-label", name);
      canvas.setAttribute("role", "img");

      const chart = mount(canvas, buildChart(spec));

      const host = canvas.closest("figure") ?? canvas.parentElement;
      host?.querySelector(".data-table")?.remove();
      const table = fromChart(chart, {
        caption: fill(a11y().tableCaption, { title: copy.title }),
        indexHeader: a11y().dateHeader,
      });
      host?.append(table);

      keyboardChart(chart, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole,
      });
    } catch (err) {
      console.error(`[${spec.id}]`, err);
    }
  }
}
