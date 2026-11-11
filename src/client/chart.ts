import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  SubTitle, // capital T
  type ChartDataset,
  type ChartOptions,
  type Plugin,
  type PointStyle,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
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

const dmy = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

const DATES = eachDay(START, END);
const DAY_LABELS = DATES.map(dmy);

interface WeekSpec {
  key: string;
  label: string;
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
      const sun = addDays(key, 6);
      const touchesEdge = key < START || sun > END;
      return {
        key,
        label: `${dmy(key)}–${dmy(sun)}${touchesEdge ? "*" : ""}`,
        dates: ds,
        touchesEdge,
      };
    });
}

const WEEKS = buildWeeks(DATES);

const nf = new Intl.NumberFormat("en-GB");
const eurM = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const compact = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/* ------------------------------------------------------------------ types */

/** n national · r regional only · p partial · f floor · e derived · c cumulative stock · w weekly aggregate */
type Quality = "n" | "r" | "p" | "f" | "e" | "c" | "w";
type Unit = "count" | "eurM";

interface Obs {
  low: number;
  high: number;
  q?: Quality;
  note?: string;
}

interface Cell {
  turnout?: Obs;
  arrests?: Obs;
  forcesInjured?: Obs;
  protesterInjured?: Obs;
  damagesCost?: Obs; // € millions
}

/* ---------------------------------------------------------------- caveats */

const DAY_NOTES: Record<string, string> = {
  "2026-10-01":
    "The €1M Île-de-France figure is a stock accumulated since 17 September, not spending on 1 October.",
  "2026-10-17":
    'IFRAP conditional estimate for the 17–18 Oct weekend: €244M–€866M material damage; €294M–€1.1bn including lost turnover. Shop counts diverge: government "at least 3,000", CCI 2,488, FCD 1,500+. 1–2 deaths. No national count of injured protesters was published.',
  "2026-10-18":
    "Paris only, derived from ~30 newly pillaged shops. Subset of the 17 Oct weekend total — adding the two double-counts.",
  "2026-10-24":
    "3 protesters seriously hurt: Toulouse, Reims, Clermont-Ferrand.",
  "2026-11-05":
    'Prefecture reported "no structuring material damage"; Rhône counted 5 shops degraded.',
  "2026-11-07":
    "Authorities published no damage tally; communes inventoried their own. Angers: 1 shop + 4 banks vandalised.",
};

/* ------------------------------------------------------------------- data */

const FACTS: Record<string, Cell> = {
  "2026-10-01": {
    arrests: {
      low: 1_949,
      high: 1_949,
      note: "arrest ≠ custody — 1,793 placed in custody",
    },
    forcesInjured: {
      low: 84,
      high: 305,
      note: "ministry gave 84 then 305 for the same day",
    },
    protesterInjured: {
      low: 119,
      high: 235,
      note: "65 staff + 170 pupils, cumulative",
    },
    damagesCost: {
      low: 1,
      high: 1,
      q: "c",
      note: "Île-de-France stock since 17 Sep",
    },
  },
  "2026-10-06": {
    turnout: { low: 256_000, high: 450_000 },
    damagesCost: {
      low: 6,
      high: 6,
      q: "e",
      note: "IDF increment 1→9 Oct; shared with 8 Oct",
    },
  },
  "2026-10-08": {
    turnout: { low: 71_500, high: 130_000 },
    damagesCost: {
      low: 6,
      high: 6,
      q: "e",
      note: "same €6M increment as 6 Oct — do not add",
    },
  },
  "2026-10-12": { arrests: { low: 13, high: 13, q: "r", note: "Rhône only" } },
  "2026-10-13": {
    turnout: { low: 161_500, high: 480_000 },
    forcesInjured: { low: 40, high: 40 },
    damagesCost: {
      low: 1.5,
      high: 1.5,
      q: "e",
      note: "IDF increment 9→11 Oct",
    },
  },
  "2026-10-17": {
    turnout: { low: 550_000, high: 800_000 },
    arrests: { low: 2_397, high: 2_628 },
    forcesInjured: { low: 997, high: 1_144, note: "7–9 seriously injured" },
    damagesCost: {
      low: 244,
      high: 866,
      note: "IFRAP low–high, material damage, 17–18 Oct combined; central case €463M",
    },
  },
  "2026-10-18": {
    arrests: { low: 108, high: 108, q: "p", note: "Paris only" },
    damagesCost: {
      low: 1.8,
      high: 5,
      q: "e",
      note: "Paris only: ~30 shops × €60k–167k; subset of 17 Oct, not additive",
    },
  },
  "2026-10-20": {
    arrests: { low: 13, high: 13, q: "r", note: "Guadeloupe only" },
  },
  "2026-10-24": {
    turnout: { low: 410_000, high: 800_000 },
    arrests: { low: 1_314, high: 1_435 },
    forcesInjured: { low: 267, high: 267 },
    protesterInjured: { low: 150, high: 150, note: "3 seriously hurt" },
    damagesCost: {
      low: 1,
      high: 8.4,
      q: "e",
      note: "50 shops (CCI France) × €20k light damage → €167k IFRAP high average",
    },
  },
  "2026-10-31": {
    turnout: { low: 320_000, high: 500_000 },
    arrests: { low: 565, high: 779 },
    forcesInjured: { low: 116, high: 159 },
    damagesCost: {
      low: 0.4,
      high: 3.3,
      q: "e",
      note: "20 shops degraded (CCI France) × €20k–167k",
    },
  },
  "2026-11-05": {
    turnout: { low: 575_000, high: 1_600_000 },
    arrests: { low: 448, high: 642 },
    forcesInjured: { low: 53, high: 112 },
    protesterInjured: {
      low: 18,
      high: 18,
      q: "f",
      note: "legal complaints, not a ministry count",
    },
  },
  "2026-11-07": {
    turnout: { low: 146_000, high: 250_000 },
    arrests: { low: 350, high: 360 },
  },
  "2026-11-09": {
    arrests: {
      low: 17,
      high: 17,
      q: "r",
      note: "Bègles 4 + Lyon 8 + Strasbourg 5",
    },
  },
};

/* ------------------------------------------------------ policing cost model */

/** € per officer per day: CRS-company marginal opex → Sainte-Soline all-in benchmark. */
const RATE = { low: 136, high: 1_133 } as const;

const DEPLOYMENT: Record<string, Obs> = {
  "2026-10-01": {
    low: 5_000,
    high: 20_000,
    q: "e",
    note: "modelled: Beauvau gave 305 injured and 1,949 arrests but refused to state mobile-unit numbers",
  },
  "2026-10-06": {
    low: 5_000,
    high: 20_000,
    q: "e",
    note: "modelled; no deployment total published",
  },
  "2026-10-08": {
    low: 5_000,
    high: 20_000,
    q: "e",
    note: "modelled for Acte IV",
  },
  "2026-10-12": {
    low: 2_000,
    high: 8_000,
    q: "e",
    note: "modelled: Île-de-France only, ~80 lycées",
  },
  "2026-10-13": {
    low: 5_000,
    high: 20_000,
    q: "e",
    note: "modelled: Ardèche fielded >100 officers for ~1,000 demonstrators in 4 towns; scaled to 101 departments",
  },
  "2026-10-17": {
    low: 60_000,
    high: 60_000,
    note: 'government figure; the ">10,000" morning tally was partial, not a rival total',
  },
  "2026-10-24": {
    low: 70_000,
    high: 70_000,
    note: "110 mobile units, 26 Centaure, ~15 water cannon",
  },
  "2026-10-31": { low: 70_000, high: 70_000, note: "dispositif reconducted" },
  "2026-11-05": {
    low: 70_000,
    high: 70_000,
    note: "reconducted for the interprofessional day",
  },
  "2026-11-07": { low: 70_000, high: 70_000, note: "reconducted" },
};

function costBand(dep: Obs): [number, number] {
  return [(dep.low * RATE.low) / 1e6, (dep.high * RATE.high) / 1e6];
}

/* ----------------------------------------------------------- projections */

type Band = [low: number, high: number] | null;
type MetricKey = keyof Cell;
type Agg = "sum" | "max";

interface MetricSeries {
  values: (number | null)[];
  bands: Band[];
  quality: (Quality | null)[];
  notes: (string | null)[];
  detach: boolean[];
}

interface View {
  labels: string[];
  titles: string[];
  footers: (string | null)[];
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
    s.notes.push(obs.note ?? null);
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
    const head =
      dep.low === dep.high
        ? nf.format(dep.low)
        : `${nf.format(dep.low)}–${nf.format(dep.high)}`;
    s.values.push(round2((lo + hi) / 2));
    s.bands.push([round2(lo), round2(hi)]);
    s.quality.push(dep.q ?? "n");
    s.notes.push(
      `~${head} officers × €${RATE.low}–${RATE.high}/officer-day — ${dep.note ?? ""}`.trim(),
    );
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
    s.notes.push(
      dep
        ? `cumulative over ${days} deployment day(s); this date adds its increment`
        : `cumulative over ${days} deployment day(s); carried forward — no published deployment this date`,
    );
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
    let peak = "";

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
      peak = dmy(top.date);
    }

    const floored = bucket.some((x) => x.obs.q === "f");
    const parts = [
      `${bucket.length} day(s) with ${regionalOnly ? "regional/partial" : "national"} figures`,
    ];
    if (agg === "max" && peak) parts.push(`peak ${peak}`);
    if (regionalOnly) parts.push("no national figure this week");
    if (nat.length && sub.length)
      parts.push(`${sub.length} regional/partial day(s) excluded`);
    if (floored)
      parts.push("contains a lower-bound figure, so the total is a floor");
    if (week.touchesEdge)
      parts.push("partial week — clipped by the 1 Oct – 11 Nov window");

    s.values.push(round2(value));
    s.bands.push([round2(low), round2(high)]);
    s.quality.push(floored ? "f" : "w");
    s.notes.push(parts.join("; "));
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

const DAILY_VIEW: View = {
  labels: DAY_LABELS,
  titles: DATES,
  footers: DATES.map((d) => DAY_NOTES[d] ?? null),
  maxRotation: 90,
  maxTicksLimit: 25,
};

const WEEKLY_VIEW: View = {
  labels: WEEKS.map((w) => w.label),
  titles: WEEKS.map(
    (w) => `Week of ${dmy(w.key)}${w.touchesEdge ? " (partial)" : ""}`,
  ),
  footers: WEEKS.map(() => null),
  maxRotation: 0,
  maxTicksLimit: 12,
};

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
  notes?: (string | null)[];
  unit?: Unit;
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
  return unit === "eurM" ? `€${eurM.format(v)}M` : nf.format(Math.round(v));
}

function suffixFor(q: Quality | null | undefined, detached: boolean): string {
  if (q === "c") return " [stock since mid-Sep, not a daily figure]";
  if (q === "w") return " [weekly aggregate]";
  if (q === "e") return " [derived, not published]";
  if (q === "f") return " [lower bound]";
  if (detached) return " [regional/partial — not a national total]";
  return "";
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
      const note = ds.notes?.[item.dataIndex];
      const detached = ds.showLine === false;

      const band = ds.errorBars?.[item.dataIndex];
      const base = band
        ? `${ds.label}: ${fmt((band[0] + band[1]) / 2, unit)} (${fmt(band[0], unit)} – ${fmt(band[1], unit)})`
        : `${ds.label}: ${fmt(item.parsed.y ?? 0, unit)}`;

      const sfx = suffixFor(q, detached);
      return note ? `${base}${sfx} — ${note}` : `${base}${sfx}`;
    },
    footer: (items: { dataIndex: number }[]) => {
      const note = view.footers[items[0].dataIndex];
      return note ? [`⚠ ${note}`] : [];
    },
  };
}

const basePlugins = (subtitle: string) => ({
  legend: {
    position: "top" as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      filter: (item: { text: string }) => !item.text.includes("points only"),
    },
  },
  subtitle: {
    display: true,
    text: subtitle,
    font: { size: 11 },
    padding: { bottom: 12 },
  },
});

const baseScales = (view: View) => ({
  x: {
    title: { display: true, text: "Date (2026)" },
    grid: { display: false },
    ticks: {
      maxRotation: view.maxRotation,
      autoSkip: true,
      maxTicksLimit: view.maxTicksLimit,
      font: { size: 10 },
    },
  },
});

const shell = (view: View, subtitle: string, title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  layout: { padding: { top: 16, right: 8 } },
  plugins: {
    ...basePlugins(subtitle),
    title: {
      display: true,
      text: title,
      font: { size: 15, weight: "bold" as const },
    },
    tooltip: { callbacks: tooltipCallbacks(view) },
  },
});

/* ------------------------------------------- section A · chart 1 (daily) */

export function buildProtestersConfig(): ChartOptions<"line"> & {
  data: { labels: string[]; datasets: ProtestDataset[] };
} {
  const datasets = metricDatasets({
    label: "Protestors (midpoint of range)",
    detachedLabel: "Protestors — regional (points only)",
    series: turnoutDaily,
    color: "#1d4ed8",
    unit: "count",
    yAxisID: "y",
    borderWidth: 2,
    radius: 4,
  });

  const options: ChartOptions<"line"> = {
    ...shell(
      DAILY_VIEW,
      "Points sit at the midpoint of the published range; bars span low (ministry) → high (organisers). Dashed connector = a day with no published figure lies between.",
      "France — daily protestors, 1 Oct – 11 Nov 2026",
    ),
    scales: {
      ...baseScales(DAILY_VIEW),
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 1_600_000,
        title: { display: true, text: "Protestors" },
        ticks: { callback: (v) => compact.format(Number(v)) },
      },
    },
  };

  return { data: { labels: DAILY_VIEW.labels, datasets }, ...options };
}

/* ------------------------------------------- section A · chart 2 (daily) */

export function buildEnforcementConfig(): ChartOptions<"line"> & {
  data: { labels: string[]; datasets: ProtestDataset[] };
} {
  const datasets = [
    ...metricDatasets({
      label: "Arrests",
      detachedLabel: "Arrests — regional / partial (points only)",
      series: arrestsDaily,
      color: "#b91c1c",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 3.5,
    }),
    ...metricDatasets({
      label: "Injuries — security forces",
      detachedLabel: "Injuries — security forces, regional (points only)",
      series: forcesDaily,
      color: "#047857",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 4,
      style: "rectRot",
    }),
    ...metricDatasets({
      label: "Injuries — protestors",
      detachedLabel: "Injuries — protestors, regional (points only)",
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
      DAILY_VIEW,
      "Bars span the lowest and highest published figure for the day. Filled markers + line = national counts; hollow = regional, partial, floor or derived values, plotted but never connected.",
      "France — arrests and injuries per day, 1 Oct – 11 Nov 2026",
    ),
    scales: {
      ...baseScales(DAILY_VIEW),
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 2_800,
        title: { display: true, text: "Count (arrests / injuries)" },
        ticks: { callback: (v) => compact.format(Number(v)) },
      },
    },
  };

  return { data: { labels: DAILY_VIEW.labels, datasets }, ...options };
}

/* ------------------------------------------- section A · chart 3 (daily) */

export function buildCostConfig(): ChartOptions<"line"> & {
  data: { labels: string[]; datasets: ProtestDataset[] };
} {
  const datasets = [
    ...metricDatasets({
      label: "Cost of damages (€M)",
      detachedLabel: "Cost of damages — derived / stock (points only)",
      series: damagesDaily,
      color: "#7c3aed",
      unit: "eurM",
      yAxisID: "y",
      borderWidth: 2,
      radius: 5,
    }),
    ...metricDatasets({
      label: "Cost of policing (€M/day, estimated)",
      detachedLabel: "Cost of policing — modelled headcount (points only)",
      series: policingDaily,
      color: "#0e7490",
      unit: "eurM",
      yAxisID: "y",
      borderWidth: 2,
      radius: 4,
      style: "rect",
    }),
    ...metricDatasets({
      label: "Cumulative cost of policing (€M, right axis)",
      detachedLabel: "Cumulative cost of policing (points only)",
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
    ...shell(
      DAILY_VIEW,
      "Daily cost = officers deployed × €136–1,133 per officer-day (marginal CRS rate → Sainte-Soline all-in). Reported headcounts (60,000 on 17 Oct; 70,000 after) are filled; earlier days were never published and are modelled, so they are hollow. The cumulative line carries forward on days with no deployment and its shaded band grows with each assumed increment.",
      "France — cost of damages, policing cost per day, and cumulative policing cost",
    ),
    scales: {
      ...baseScales(DAILY_VIEW),
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 900,
        title: { display: true, text: "€ millions (per day)" },
        ticks: { callback: (v) => `€${compact.format(Number(v))}M` },
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        suggestedMax: 520,
        title: { display: true, text: "€ millions (cumulative)" },
        grid: { drawOnChartArea: false },
        ticks: { callback: (v) => `€${compact.format(Number(v))}M` },
      },
    },
  };

  return { data: { labels: DAILY_VIEW.labels, datasets }, ...options };
}

/* ------------------------------------------ section B · chart 4 (weekly) */

export function buildProtestersWeeklyConfig(): ChartOptions<"line"> & {
  data: { labels: string[]; datasets: ProtestDataset[] };
} {
  const datasets = metricDatasets({
    label: "Protestors — peak day of the week",
    detachedLabel: "Protestors — regional weeks (points only)",
    series: turnoutWeekly,
    color: "#1d4ed8",
    unit: "count",
    yAxisID: "y",
    borderWidth: 2,
    radius: 5,
  });

  const options: ChartOptions<"line"> = {
    ...shell(
      WEEKLY_VIEW,
      "Weeks run Monday–Sunday. Crowd figures show the peak day within each week; bars span the peak under the most conservative sources to the peak under the most generous. * = week clipped by the 1 Oct – 11 Nov window.",
      "France — peak daily protestors, by week",
    ),
    scales: {
      ...baseScales(WEEKLY_VIEW),
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 1_700_000,
        title: { display: true, text: "Protestors (weekly peak)" },
        ticks: { callback: (v) => compact.format(Number(v)) },
      },
    },
  };

  return { data: { labels: WEEKLY_VIEW.labels, datasets }, ...options };
}

/* ------------------------------------------ section B · chart 5 (weekly) */

export function buildEnforcementWeeklyConfig(): ChartOptions<"line"> & {
  data: { labels: string[]; datasets: ProtestDataset[] };
} {
  const datasets = [
    ...metricDatasets({
      label: "Arrests (weekly total)",
      detachedLabel: "Arrests — regional weeks (points only)",
      series: arrestsWeekly,
      color: "#b91c1c",
      unit: "count",
      yAxisID: "y",
      borderWidth: 2,
      radius: 4,
    }),
    ...metricDatasets({
      label: "Injuries — security forces (weekly total)",
      detachedLabel: "Injuries — security forces, regional weeks (points only)",
      series: forcesWeekly,
      color: "#047857",
      unit: "count",
      yAxisID: "y",
      borderWidth: 1.5,
      radius: 4,
      style: "rectRot",
    }),
    ...metricDatasets({
      label: "Injuries — protestors (weekly total)",
      detachedLabel: "Injuries — protestors, regional weeks (points only)",
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
      WEEKLY_VIEW,
      "Arrests and injuries are summed within each week; bars span the sum of the lowest to the sum of the highest published figures. Days carrying regional or partial counts are excluded from national sums and counted in the tooltip. A week with no published figure stays empty.",
      "France — arrests and injuries, weekly totals",
    ),
    scales: {
      ...baseScales(WEEKLY_VIEW),
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        suggestedMax: 2_800,
        title: { display: true, text: "Count (weekly total)" },
        ticks: { callback: (v) => compact.format(Number(v)) },
      },
    },
  };

  return { data: { labels: WEEKLY_VIEW.labels, datasets }, ...options };
}

/* ------------------------------------------------------------------ mount */

type Cfg = {
  data: { labels: string[]; datasets: ProtestDataset[] };
} & ChartOptions<"line">;

export function mount(canvas: HTMLCanvasElement, cfg: Cfg): Chart<"line"> {
  const { data, ...options } = cfg;
  return new Chart<"line">(canvas, {
    type: "line",
    data,
    options,
    plugins: [errorBars],
  });
}
