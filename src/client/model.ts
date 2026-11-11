export type Metric = "p" | "a" | "f" | "i";
export type Flag = "n" | "r" | "p" | "f" | "e" | "c" | "w";
export type Quality = Flag;
export type Band = number | [number, number];

export type MetricKey =
  | "turnout"
  | "arrests"
  | "forcesInjured"
  | "protesterInjured"
  | "damagesCost";

/** Structured weekly-aggregate note — rendered per locale by noteText(). */
export interface WeekNoteParts {
  days: number;
  kind: "national" | "regional";
  peak?: string; // ISO date of the peak day
  noNational?: boolean;
  excluded?: number;
  floored?: boolean;
  clipped?: boolean;
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
