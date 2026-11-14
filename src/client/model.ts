/* Pure types and the definitions of "band" and "detached". Imports nothing. */

export const METRICS = ["p", "a", "f", "i"] as const;
export type Metric = (typeof METRICS)[number];

/** n = published point · r = regional only · p = partial · f = floor
 *  e = derived/modelled · c = stock or actions-total · w = weekly aggregate
 *  "x" = a wider measure than the metric's definition (perturbés, closed). */
export type Flag = "n" | "r" | "p" | "f" | "e" | "c" | "w" | "x";

/** Kept as an alias so existing call sites compile; one name for one type. */
export type Quality = Flag;

/** A single figure, or a published range. */
export type Band = number | [number, number];

// MetricKey only. NOT METRICS/METRIC_OF — sections C/D/E stay four-measure.
export type MetricKey =
  | "turnout"
  | "strikers"
  | "arrests"
  | "forcesInjured"
  | "forcesInjuredStock"
  | "protesterInjured"
  | "damagesCost"
  | "blockades";

/** Short code used by sections B/C → long key used by the dashboards. */
export const METRIC_OF: Readonly<Record<Metric, MetricKey>> = {
  p: "turnout",
  a: "arrests",
  f: "forcesInjured",
  i: "protesterInjured",
};

/** The single definition of "must not be joined to the national line". */
const DETACHED: ReadonlySet<Flag> = new Set<Flag>(["r", "p", "e", "c"]);

export const isDetached = (q: Flag | null | undefined): boolean =>
  q != null && q !== "n" && DETACHED.has(q);

export const bandOf = (b: Band): [number, number] =>
  typeof b === "number" ? [b, b] : b;

export const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

/** Structured weekly-aggregate note — rendered per locale by notes.ts. */
export interface WeekNoteParts {
  days: number;
  kind: "national" | "regional";
  peak?: string; // ISO date of the peak day
  noNational?: boolean;
  excluded?: number;
  floored?: boolean;
  clipped?: boolean;
  /** The week overlaps the Toussaint holiday — the metric did not exist. */
  vacation?: boolean;
}

/** A note is a reference to copy, never the copy itself. */
export type NoteRef =
  | { k: "obs"; date: string; metric: MetricKey }
  | { k: "policing"; low: number; high: number; date: string }
  | { k: "cumulative"; days: number; added: boolean }
  | { k: "week"; p: WeekNoteParts };

export type EpisodeId =
  | "may68"
  | "cpe"
  | "gj"
  | "nahel"
  | "pensions"
  | "bt"
  | "students26";

export interface Row {
  w: number;
  from: string;
  to: string;
  act?: number;
  partial?: boolean;
  p?: Band;
  a?: Band;
  f?: Band;
  i?: Band;
  flag?: Partial<Record<Metric, Flag>>;
  noteRef?: Partial<Record<Metric, NoteRef>>;
}

export interface Episode {
  id: EpisodeId;
  start: string;
  end: string;
  weeks: Row[];
}
