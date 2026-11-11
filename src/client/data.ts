/* Every figure and every projection. Sections A/B (chart.ts) and C (episodes.ts)
   both read these, which is why section C no longer needs a fallback table, an
   index patch applied to derived values, or its own recalculation of flags. */

import {
  METRICS,
  METRIC_OF,
  isDetached,
  type Band,
  type Flag,
  type Metric,
  type MetricKey,
  type NoteRef,
  type WeekNoteParts,
} from "./model.ts";

export interface Obs {
  low: number;
  high: number;
  q?: Flag;
}

/** One x-slot. A null `v` means "nothing published here" — never interpolated. */
export interface Pt {
  v: number | null;
  band: [number, number] | null;
  q: Flag | null;
  note: NoteRef | null;
  detach: boolean;
}
export type Series = Pt[];

const NIL: Pt = { v: null, band: null, q: null, note: null, detach: false };

export const START = "2026-10-01";
export const END = "2026-11-11";

/* ------------------------------------------------------------------ calendar */

const utc = (s: string): Date => new Date(`${s}T00:00:00Z`);
export const iso = (d: Date): string => d.toISOString().slice(0, 10);

export const addDays = (isoDate: string, n: number): string => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** ISO date of the Monday on or before `isoDate`. */
export const mondayOf = (isoDate: string): string => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); // Mon→0 … Sun→6
  return d.toISOString().slice(0, 10);
};

function eachDay(start: string, end: string): string[] {
  const out: string[] = [];
  const stop = utc(end);
  for (const d = utc(start); d <= stop; d.setUTCDate(d.getUTCDate() + 1))
    out.push(iso(d));
  return out;
}

export const DATES: readonly string[] = eachDay(START, END);

export interface Week {
  key: string; // ISO Monday — the aggregator key
  end: string; // ISO Sunday
  dates: string[];
  touchesEdge: boolean; // the week is cut by the window on either side
}

export const WEEKS: readonly Week[] = (() => {
  const byKey = new Map<string, string[]>();
  for (const d of DATES) {
    const k = mondayOf(d);
    const list = byKey.get(k);
    if (list) list.push(d);
    else byKey.set(k, [d]);
  }
  return [...byKey]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, dates]) => {
      const end = addDays(key, 6);
      return { key, end, dates, touchesEdge: key < START || end > END };
    });
})();

/* --------------------------------------------------------------------- facts */

export const FACTS: Readonly<Record<string, Partial<Record<MetricKey, Obs>>>> =
  {
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

export const DEPLOYMENT: Readonly<Record<string, Obs>> = {
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

/** € per officer per day: CRS-company marginal opex → Sainte-Soline all-in. */
export const RATE = { low: 136, high: 1_133 } as const;

const round2 = (v: number): number =>
  Number.isInteger(v) ? v : Math.round(v * 100) / 100;

const costBand = (dep: Obs): [number, number] => [
  (dep.low * RATE.low) / 1e6,
  (dep.high * RATE.high) / 1e6,
];

/* ---------------------------------------------------------------- projections */

function projectDaily(key: MetricKey): Series {
  return DATES.map((date) => {
    const obs = FACTS[date]?.[key];
    if (!obs) return NIL;
    const q = obs.q ?? "n";
    return {
      v: round2((obs.low + obs.high) / 2),
      band: [obs.low, obs.high] as [number, number],
      q,
      note: { k: "obs", date, metric: key } as NoteRef,
      detach: isDetached(q),
    };
  });
}

function projectPolicingDaily(): Series {
  return DATES.map((date) => {
    const dep = DEPLOYMENT[date];
    if (!dep) return NIL;
    const [lo, hi] = costBand(dep);
    const q = dep.q ?? "n";
    return {
      v: round2((lo + hi) / 2),
      band: [round2(lo), round2(hi)] as [number, number],
      q,
      note: { k: "policing", low: dep.low, high: dep.high, date } as NoteRef,
      detach: isDetached(q),
    };
  });
}

/** Running total; carries forward on days with no deployment — a total does not fall. */
function projectPolicingCumulative(): Series {
  let lo = 0;
  let hi = 0;
  let days = 0;
  let started = false;

  return DATES.map((date) => {
    const dep = DEPLOYMENT[date];
    if (dep) {
      const [a, b] = costBand(dep);
      lo += a;
      hi += b;
      days++;
      started = true;
    }
    if (!started) return NIL;
    return {
      v: round2((lo + hi) / 2),
      band: [round2(lo), round2(hi)] as [number, number],
      q: "e",
      note: { k: "cumulative", days, added: Boolean(dep) } as NoteRef,
      detach: false, // always a line; its band is shaded, not barred
    };
  });
}

function aggregate(key: MetricKey, op: "sum" | "max"): Series {
  return WEEKS.map((week) => {
    const nat: { date: string; obs: Obs }[] = [];
    const sub: { date: string; obs: Obs }[] = [];

    for (const d of week.dates) {
      const obs = FACTS[d]?.[key];
      if (!obs) continue;
      const q = obs.q ?? "n";
      (q === "r" || q === "p" ? sub : nat).push({ date: d, obs });
    }

    const bucket = nat.length ? nat : sub;
    if (!bucket.length) return NIL;

    const regionalOnly = nat.length === 0;
    let low: number;
    let high: number;
    let value: number;
    let peak: string | undefined;

    if (op === "sum") {
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

    return {
      v: round2(value),
      band: [round2(low), round2(high)] as [number, number],
      // regional-only used to be re-derived in episodes.ts; it is decided here once
      q: parts.floored ? "f" : regionalOnly ? "r" : "w",
      note: { k: "week", p: parts } as NoteRef,
      detach: regionalOnly,
    };
  });
}

export const DAILY: Readonly<Record<string, Series>> = {
  turnout: projectDaily("turnout"),
  arrests: projectDaily("arrests"),
  forcesInjured: projectDaily("forcesInjured"),
  protesterInjured: projectDaily("protesterInjured"),
  damagesCost: projectDaily("damagesCost"),
  policing: projectPolicingDaily(),
  policingCumulative: projectPolicingCumulative(),
};

export const WEEKLY: Readonly<Record<string, Series>> = {
  turnout: aggregate("turnout", "max"),
  arrests: aggregate("arrests", "sum"),
  forcesInjured: aggregate("forcesInjured", "sum"),
  protesterInjured: aggregate("protesterInjured", "sum"),
};

/* ----------------------------------------------- section C's weekly table */

export interface StudentWeek {
  key: string; // ISO Monday — also the row's `from`
  end: string; // ISO Sunday
  touchesEdge: boolean;
  p: [number, number] | null;
  a: [number, number] | null;
  f: [number, number] | null;
  i: [number, number] | null;
  flags: Partial<Record<Metric, Flag>>;
  notes: Partial<Record<Metric, NoteRef>>;
}

/** Editorial corrections the aggregator cannot infer from a band alone.
 *  Keyed by ISO Monday, so inserting a fact above cannot shift them. */
const WEEK_FLAG_OVERRIDE: Partial<
  Record<string, Partial<Record<Metric, Flag>>>
> = {
  [mondayOf(START)]: { i: "c" }, // w0: protester injuries were published as an actions-total
};

export const STUDENT_WEEKS: readonly StudentWeek[] = WEEKS.map((week, idx) => {
  const out: StudentWeek = {
    key: week.key,
    end: week.end,
    touchesEdge: week.touchesEdge,
    p: null,
    a: null,
    f: null,
    i: null,
    flags: {},
    notes: {},
  };
  const override = WEEK_FLAG_OVERRIDE[week.key];

  for (const m of METRICS) {
    const pt = WEEKLY[METRIC_OF[m]][idx];
    if (pt.band) out[m] = pt.band;
    const q = override?.[m] ?? pt.q;
    if (q && q !== "n") out.flags[m] = q;
    if (pt.note) out.notes[m] = pt.note;
  }
  return out;
});
