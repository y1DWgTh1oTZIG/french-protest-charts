/**
 * src/client/i18n.ts — the single source of truth for language state, the page
 * catalogue, number/date formatting and static copy.
 *
 * Contract imposed by chart.ts / episodes.ts:
 *   nf() · compact() · eurM()  return Intl.NumberFormat   (called as functions)
 *   fmtWeek(start, end)        → "12–18 oct."
 *   plural(word, n)            → pluralised word
 *   t().chart / .episodes / .panels / .items / .units / .flags / .tooltip
 */

export type Lang = "fr" | "en";

export interface Bi {
  readonly en: string;
  readonly fr: string;
}

/* ============================================================== descriptors */

export type SectionId = "a" | "b" | "c" | "d" | "e";

export interface SectionCopy {
  readonly title: string;
  readonly blurb: string;
  readonly note?: string;
}

export interface LocaleMeta {
  readonly tag: string;
  readonly label: string;
  readonly meta: {
    readonly htmlLang: Lang;
    readonly title: string;
    readonly description: string;
  };
  readonly groups: {
    readonly ongoing: SectionCopy;
    readonly historical: SectionCopy;
  };

  readonly sections: Readonly<Record<SectionId, SectionCopy>>;
}

const EN_META: LocaleMeta = {
  tag: "en-GB",
  label: "English",
  meta: {
    htmlLang: "en",
    title: "Protest activity in France — September–November 2026",
    description:
      "Turnout, arrests, injuries and damage in the autumn 2026 movement, set against six earlier French movements.",
  },
  sections: {
    a: {
      title: "A · Daily counts, 15 September – 11 November 2026",
      blurb:
        "One marker per day on which something was published. Days with no figure stay empty rather than interpolated; gaps in a line are dashed. The school-blockade line is dotted across the Toussaint holiday, when no lycée was in session. The strike series is derived from participation rates: no authority published a national headcount of strikers.",
    },
    b: {
      title: "B · Weekly aggregates",
      blurb:
        "Weeks run Monday to Sunday. A peak-day crowd and a summed weekly arrest count are not the same statistic — the tooltip says which is which. The weekly blockade figure is a peak, never a sum: the same lycée is blocked on several consecutive days. People on strike is a level, so the weekly figure is the peak of the week, never a sum.",
    },
    c: {
      title: "C · One panel per movement",
      blurb:
        "Each panel keeps its own time span on a shared logarithmic axis, so the shapes are comparable but the durations are not. The tooltip also compares every point with its own series — as a percentage of the highest figure in that panel, of the mean, of the median and of the first published figure. The last of these can run to thousands of percent when a movement began with a handful of people, which is exactly why the other three are given first.",
      note: "Hollow markers are regional, Paris-only, modelled or stock figures. Dashed connectors span a week with nothing published.",
    },
    d: {
      title: "D · Transposed: one panel per series",
      blurb:
        "The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks, capped at the last week with enforcement figures. Tooltip comparisons work as in section C, but are computed over the weeks actually plotted in the hovered panel.",
      note: "Hover a measure or a movement to isolate it. Panel order matches legend order.",
    },
    e: {
      title: "E · Median and peak",
      blurb:
        "Each panel gathers one measure across the movements that published it. The dot is the median of the series — the typical week — and the triangle its peak, the largest single figure. The pale bar behind each pair spans the whole series, from its smallest figure to its largest, so a movement that was steady reads as a short bar and one that had a few enormous weeks as a long one. The axis is logarithmic, so a handful of mass marches and a routine week can share a panel.",
      note: "Each figure is counted once, at the midpoint of its range where one was published. The count of published figures is in the tooltip: with a single figure the median and the peak are the same number.",
    },
  },
  groups: {
    ongoing: {
      title: "The Ongoing Revolt",
      blurb:
        "Both sections cover the autumn 2026 movement. A plots every published daily figure; B aggregates those same figures by week, so a peak-day crowd and a summed arrest count never share an axis.",
    },
    historical: {
      title: "Historical Comparisons",
      blurb:
        "The same measures set against six earlier French movements: 1968, 1986, 1995, 2006, 2010 and 2016. C keeps one panel per movement; D keeps one panel per series.",
    },
  },
};

const FR_META: LocaleMeta = {
  tag: "fr-FR",
  label: "Français",
  meta: {
    htmlLang: "fr",
    title: "L’activité contestataire en France — septembre–novembre 2026",
    description:
      "Foules, interpellations, blessés et dommages du mouvement de l’automne 2026, comparés à six mouvements français antérieurs.",
  },
  sections: {
    a: {
      title: "A · Décomptes quotidiens, 15 septembre – 11 novembre 2026",
      blurb:
        "Un marqueur par jour où un chiffre a été publié. Les jours sans chiffre restent vides plutôt qu’interpolés ; les lacunes d’une courbe sont en pointillés. La courbe des blocages de lycées est en pointillés pendant les vacances de la Toussaint, aucun lycée n’étant en cours. La série des personnes en grève est dérivée de taux de participation : aucune autorité n’a publié de décompte national des grévistes.",
    },
    b: {
      title: "B · Agrégats hebdomadaires",
      blurb:
        "Les semaines vont du lundi au dimanche. Une foule de jour de pointe et un total hebdomadaire d’interpellations ne sont pas la même statistique — l’infobulle précise laquelle. Le chiffre hebdomadaire des blocages est une pointe, jamais une somme : un même lycée est bloqué plusieurs jours de suite. Les personnes en grève sont un niveau, non un flux : le chiffre hebdomadaire en est la pointe de la semaine, jamais une somme.",
    },
    c: {
      title: "C · Un panneau par mouvement",
      blurb:
        "Chaque panneau conserve sa propre durée sur un axe logarithmique commun : les formes sont comparables, les durées non. L’infobulle compare en outre chaque point à sa propre série — en pourcentage du chiffre le plus élevé du panneau, de la moyenne, de la médiane et du premier chiffre publié. Ce dernier peut atteindre des milliers de pour cent lorsqu’un mouvement a commencé avec une poignée de personnes, et c’est précisément pourquoi les trois autres sont donnés d’abord.",
      note: "Les marqueurs creux sont des chiffres régionaux, parisiens, modélisés ou des stocks. Les liaisons en pointillés traversent une semaine sans publication.",
    },
    d: {
      title: "D · Transposé : un panneau par série",
      blurb:
        "Les mêmes données avec les mouvements superposés, pour lire une même mesure de 1968 à 2026. L’axe des x est le nombre de semaines écoulées, arrêté à la dernière semaine de chiffres de maintien de l’ordre. Les comparaisons de l’infobulle fonctionnent comme en section C, mais sont calculées sur les seules semaines tracées dans le panneau survolé.",
      note: "Survolez une mesure ou un mouvement pour l’isoler. L’ordre des panneaux suit celui de la légende.",
    },
    e: {
      title: "E · Médiane et pointe",
      blurb:
        "Chaque panneau rassemble une mesure pour les mouvements qui l’ont publiée. Le point est la médiane de la série — la semaine typique — et le triangle sa pointe, le plus grand chiffre publié. La barre claire derrière chaque paire couvre toute la série, de son plus petit chiffre à son plus grand : un mouvement régulier se lit donc comme une barre courte, un mouvement ayant connu quelques semaines énormes comme une barre longue. L’axe est logarithmique, de sorte que quelques marches de masse et une semaine ordinaire peuvent partager un panneau.",
      note: "Chaque chiffre est compté une fois, au milieu de sa fourchette lorsqu’une fourchette a été publiée. Le nombre de chiffres publiés figure dans l’infobulle : avec un seul chiffre, la médiane et la pointe sont le même nombre.",
    },
  },
  groups: {
    ongoing: {
      title: "La révolte en cours",
      blurb:
        "Les deux sections portent sur le mouvement de l’automne 2026. A trace chaque chiffre quotidien publié ; B agrège ces mêmes chiffres par semaine, de sorte qu’une foule de jour de pointe et un total d’interpellations ne partagent jamais un axe.",
    },
    historical: {
      title: "Comparaisons historiques",
      blurb:
        "Les mêmes mesures rapportées à six mouvements français antérieurs : 1968, 1986, 1995, 2006, 2010 et 2016. C garde un panneau par mouvement ; D un panneau par série.",
    },
  },
};

/** Flat list, in display order — `.includes()`, `.map()`, `.length` all work. */
export const LOCALES: readonly Lang[] = Object.freeze([
  "fr",
  "en",
] as const) as readonly Lang[];

/** Descriptors, reachable by bare code and by full tag. */
export const LOCALE_META: Readonly<Record<Lang, LocaleMeta>> = {
  en: EN_META,
  fr: FR_META,
};

export function localeMeta(locale: Lang | string = current): LocaleMeta {
  return LOCALE_META[normalizeLocale(locale) ?? DEFAULT_LANG];
}

export const DEFAULT_LANG: Lang = "fr";
export const DEFAULT_LOCALE: string = FR_META.tag;

/* ==================================================================== state */

const STORAGE_KEY = "lang";

const hasDom = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

export function normalizeLocale(input: unknown): Lang | null {
  const low = String(input ?? "")
    .toLowerCase()
    .replace(/_/g, "-");
  if (
    low === "fr" ||
    low.startsWith("fr-") ||
    low === "français" ||
    low === "francais"
  )
    return "fr";
  if (low === "en" || low.startsWith("en-")) return "en";
  return null;
}

export function isLang(value: unknown): value is Lang {
  return normalizeLocale(value) !== null;
}

export function localeFromUrl(search?: string): Lang | null {
  if (search === undefined && !hasDom()) return null;
  try {
    const q = search ?? window.location.search;
    return normalizeLocale(new URLSearchParams(q).get("lang"));
  } catch {
    return null;
  }
}

function fromStorage(): Lang | null {
  if (!hasDom()) return null;
  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

let current: Lang = localeFromUrl() ?? fromStorage() ?? DEFAULT_LANG;

let version = 0;

/** Bumped on every change. Fold into any config memo key. */
export function localeVersion(): number {
  return version;
}

/** The one synchronous accessor. `lang()` was an identical twin — deleted. */
export function getLocale(): Lang {
  return current;
}

/** Synchronous accessor. */
export function lang(): Lang {
  return current;
}

/* ============================================================ subscriptions */

type LocaleListener = (next: Lang, previous: Lang) => void;

const listeners = new Set<LocaleListener>();
let emitting = false;

export function onLocaleChange(fn: LocaleListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit(next: Lang, previous: Lang): void {
  if (emitting) return;
  emitting = true;
  try {
    for (const fn of [...listeners]) {
      try {
        fn(next, previous);
      } catch (err) {
        console.error("[i18n] locale listener threw", err);
      }
    }
  } finally {
    emitting = false;
  }
}

export interface SetLangOptions {
  persist?: boolean;
  notify?: boolean;
}

export function setLang(next: Lang | string, opts: SetLangOptions = {}): Lang {
  const { persist = true, notify = true } = opts;
  const target = normalizeLocale(next);
  if (!target) {
    warnOnce(`locale:${String(next)}`, `unrecognised locale "${String(next)}"`);
    return current;
  }
  const previous = current;
  if (previous === target) return current;

  current = target;
  version += 1;

  const locale = localeMeta(target);
  buildFormats(locale.tag);

  if (hasDom()) {
    if (persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, target);
      } catch {
        /* private mode or quota — never fatal */
      }
    }
    document.documentElement.lang = locale.meta.htmlLang;
    document.documentElement.dataset.lang = target;
  }
  if (notify) emit(target, previous);
  return current;
}

export function toggleLang(): Lang {
  return setLang(current === "fr" ? "en" : "fr");
}

/* ============================================================ interpolation */

const TOKEN = /\{(\w+)\}/g;

/** `{token}` substitution; injects `s` ('' / 's') when `n` is numeric. */
export function fill(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  const p: Record<string, string | number> =
    typeof params.n === "number" && params.s === undefined
      ? { ...params, s: params.n === 1 ? "" : "s" }
      : params;
  return template.replace(TOKEN, (whole, name: string) =>
    name in p ? String(p[name]) : whole,
  );
}

/** Pluralisation, both call orders used by the modules. */
export function plural(word: string, n: number, many?: string): string;
export function plural(n: number, one?: string, many?: string): string;
export function plural(
  a: string | number,
  b?: number | string,
  c?: string,
): string {
  if (typeof a === "string") {
    const n = typeof b === "number" ? b : 0;
    return Math.abs(n) === 1 ? a : (c ?? `${a}s`);
  }
  const isOne = Math.abs(a) === 1;
  if (typeof b !== "string") return isOne ? "" : "s";
  return isOne ? b : (c ?? `${b}s`);
}

/* ============================================================== number/date */

type DateInput = Date | string | number;

let numFmt: Intl.NumberFormat;
let cptFmt: Intl.NumberFormat;
let eurFmt: Intl.NumberFormat;
let dateFmt: Record<"long" | "short" | "day", Intl.DateTimeFormat>;

function buildFormats(tag: string): void {
  numFmt = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  cptFmt = new Intl.NumberFormat(tag, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });
  eurFmt = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 });
  dateFmt = {
    long: new Intl.DateTimeFormat(tag, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
    short: new Intl.DateTimeFormat(tag, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
    day: new Intl.DateTimeFormat(tag, { day: "numeric", timeZone: "UTC" }),
  };
}
buildFormats(localeMeta(current).tag);

export const nf = (): Intl.NumberFormat => numFmt;
export const compact = (): Intl.NumberFormat => cptFmt;
export const eurM = (): Intl.NumberFormat => eurFmt;

const DATE_LONG: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};
const DATE_SHORT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
};
const DAY_ONLY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  timeZone: "UTC",
};

let dsLong = new Intl.DateTimeFormat(EN_META.tag, DATE_LONG);
let dsShort = new Intl.DateTimeFormat(EN_META.tag, DATE_SHORT);
let dsDay = new Intl.DateTimeFormat(EN_META.tag, DAY_ONLY);
let dsLang: Lang | null = null;

function refreshDates(): void {
  if (dsLang === current) return;
  dsLang = current;
  const tag = localeMeta(current).tag;
  dsLong = new Intl.DateTimeFormat(tag, DATE_LONG);
  dsShort = new Intl.DateTimeFormat(tag, DATE_SHORT);
  dsDay = new Intl.DateTimeFormat(tag, DAY_ONLY);
}

/** ISO strings parse as UTC, so '2026-10-01' cannot slip to 30 September. */
function toDate(value: DateInput): Date | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** French writes the first of the month as "1er"; Intl never emits it. */
function firstOfMonth(s: string, d: Date): string {
  return current === "fr" && d.getUTCDate() === 1
    ? s.replace(/^1\b/, "1er")
    : s;
}

/** "1 Nov 2026" / "1er nov. 2026". Invalid input → em dash. */
export function fmtDate(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? firstOfMonth(dsLong.format(d), d) : "—";
}

/** "1 Nov" / "1er nov." */
export function fmtDayMonth(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? firstOfMonth(dsShort.format(d), d) : "—";
}

/**
 * Week label. Two arguments give a range:
 *   fmtWeek('2026-10-12', '2026-10-18') → "12–18 Oct"  ·  "12–18 oct."
 *   fmtWeek('2026-09-28', '2026-10-04') → "28 Sep – 4 Oct"
 * One argument gives a single day-month, for callers that pass a lone date.
 */
export function fmtWeek(start: DateInput, end?: DateInput): string {
  refreshDates();
  const a = toDate(start);
  if (!a) return "—";
  if (end === undefined) return firstOfMonth(dsShort.format(a), a);

  const b = toDate(end);
  if (!b) return firstOfMonth(dsShort.format(a), a);

  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const sameMonth = sameYear && a.getUTCMonth() === b.getUTCMonth();

  if (sameMonth) return `${firstOfMonth(dsDay.format(a), a)}–${fmtDayMonth(b)}`;
  if (sameYear) return `${fmtDayMonth(a)} – ${fmtDayMonth(b)}`;
  return `${fmtDayMonth(a)} ${a.getUTCFullYear()} – ${fmtDayMonth(b)} ${b.getUTCFullYear()}`;
}

export interface SpanLike {
  readonly start?: DateInput | null;
  readonly end?: DateInput | null;
  readonly label?: string | null;
}

const ISO_ANY = /\d{4}-\d{2}-\d{2}/;
const ISO_ALL = /\b(\d{4}-\d{2}-\d{2})\b/g;

/**
 *   fmtSpan('2026-10-01', '2026-11-11')  → "1 Oct – 11 Nov 2026"
 *   fmtSpan('Mai 68')                    → verbatim
 *   fmtSpan({ start, end, label })
 */
export function fmtSpan(
  span: string | SpanLike | DateInput,
  end?: DateInput,
): string {
  const sep = t("span.sep");

  if (typeof span === "string") {
    if (end !== undefined) return `${fmtDayMonth(span)}${sep}${fmtDate(end)}`;
    return ISO_ANY.test(span)
      ? span.replace(ISO_ALL, (m) => fmtDayMonth(m))
      : span;
  }
  if (typeof span === "number" || span instanceof Date) {
    return end !== undefined
      ? `${fmtDayMonth(span)}${sep}${fmtDate(end)}`
      : fmtDate(span);
  }
  if (span.label) return span.label;
  if (span.start != null && span.end != null) {
    return `${fmtDayMonth(span.start)}${sep}${fmtDate(span.end)}`;
  }
  if (span.start != null) return fmtDate(span.start);
  if (span.end != null) return fmtDate(span.end);
  return "—";
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const HAS_CLOCK = /[T ]\d{2}:\d{2}/;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/* ======================================================= catalogue: chart.ts */

export interface SeriesCopy {
  readonly label: string;
  /** Legend entry for the hollow "detached" twin. */
  readonly detached: string;
}

export interface ChartCardCopy {
  readonly title: string;
  readonly subtitle: string;
  readonly y?: string;
  readonly yLeft?: string;
  readonly yRight?: string;
}

export interface ChartCopy {
  readonly axisDate: string;
  readonly axisWeek: string;
  readonly edgeMark: string;
  readonly weekOf: string;
  readonly weekOfPartial: string;
  /** Template for € millions: EN "€{v}M", FR "{v} M€". */
  readonly eurM: string;
  readonly suffix: Readonly<Record<string, string>>;
  readonly suffixWrap: string;
  readonly dayNotes: Readonly<Record<string, string>>;
  readonly obsNotes: Readonly<Record<string, Readonly<Record<string, string>>>>;
  readonly deployNotes: Readonly<Record<string, string>>;
  readonly policingDay: string;
  readonly policingDayPlain: string;
  readonly cumulativeAdded: string;
  readonly cumulativeCarried: string;
  readonly weekNational: string;
  readonly weekRegionalOnly: string;
  readonly weekPeak: string;
  readonly weekNoNational: string;
  readonly weekExcluded: string;
  readonly weekFloored: string;
  readonly weekClipped: string;
  readonly weekJoin: string;
  readonly tooltipRange: string;
  readonly tooltipPoint: string;
  readonly tooltipNote: string;
  readonly footerMark: string;
  readonly series: Readonly<Record<string, SeriesCopy>>;
  readonly charts: Readonly<Record<string, ChartCardCopy>>;
  readonly weekVacation: string;
  readonly holidayLine: string;
  readonly metricNote: string;
  readonly blockerNote: string;
}

const CHART_EN: ChartCopy = {
  axisDate: "Date",
  axisWeek: "Week",
  edgeMark: "†",
  weekOf: "Week of {date}",
  weekOfPartial: "Week of {date} (partial)",
  eurM: "€{v}M",
  suffix: {
    c: "stock",
    w: "",
    e: "modelled",
    f: "lower bound",
    r: "regional",
    p: "partial",
    x: "wider measure",
    n: "",
    regional: "regional",
  },
  suffixWrap: " · {text}",
  dayNotes: {
    "2026-09-25":
      "Paris-area figure only: 21 interpellations by midday, announced by the Préfecture de Police.",
    "2026-09-28":
      "The movement goes national — actions in Marseille, Lille, the Rhône, the Var and the Alpes-Maritimes.",
    "2026-09-29":
      "Act I. The crowd figure counts the public-service cortège the school actions joined, not a student crowd. The strike series starts here: 250,000 state civil servants, derived from the government's 10% rate.",
    "2026-09-30":
      "The second day of Act I: 625 interpellations and 83 security forces injured. The Education ministry counted 356 establishments concerned; no count of fully blocked schools was published that day.",
    "2026-10-01":
      "Act II, the peak of the first week. Arrests and injuries published with no turnout figure for the day.",
    "2026-10-02":
      "735 establishments still perturbed, and urban violence near 158 of them.",
    "2026-10-03":
      "No weekend figure was published; the arrests for 3–4 October are derived by subtraction. 735 establishments perturbed — a wider measure than blockades, so the point is flagged as such.",
    "2026-10-05":
      "The first national school day after the break, with the ministry's stock figures.",
    "2026-10-06":
      "Act III — the first full national student demonstration of the movement.",
    "2026-10-07":
      "The Interior Ministry suspended the use of stun grenades for the student mobilisations, after a lycée student was injured at Lens.",
    "2026-10-09":
      "Justice Ministry publishes its first judicial balance: 6,877 in garde à vue since mid-September.",
    "2026-10-10":
      "CNEWS compiles a national damage bill of €30M — with no ministry tally behind it.",
    "2026-10-13":
      "Turnout band spans a factor of three: ministry floor, organiser ceiling.",
    "2026-10-16":
      "Last day of classes before the Toussaint holiday: from 17 October no lycée is in session, so the blockade count stops.",
    "2026-10-17":
      "The peak day. The damage band here is the 17–18 October IFRAP estimate, not a daily flow. Toussaint holiday — schools closed.",
    "2026-10-19":
      "Toussaint holiday — students supported the lycée movement from outside the schools.",
    "2026-10-24":
      "Arrest figures include preventive stops; not all become custody placements. Toussaint holiday — the mobilisation was an inter-union day, not a school day.",
    "2026-10-31":
      "No protester-injury figure was published for this day. Toussaint holiday — inter-union mobilisation.",
    "2026-11-01": "Last day of the Toussaint holiday.",
    "2026-11-04":
      "In the Rhône, seven establishments ran in remote mode; no lycée was reported blocked.",
    "2026-11-05":
      "Turnout band runs from 575 000 to 1.6 million — the band is the disagreement, not an error bar. The strike point is derived from the government's rates: 9.89–11% of state civil servants.",
    "2026-11-06":
      "In the Rhône, 16 lycées and two colleges saw incidents, and a lycée in Lyon's 8th arrondissement was blocked when it was cleared.",
    "2026-11-09":
      "In the Rhône, no lycée was blocked: 14 ran in remote mode and 11 were reported as affected. A zero cannot be plotted on a logarithmic axis, so it is recorded here rather than as a point.",
    "2026-11-10": "In the Rhône, about ten establishments were affected.",
  },
  obsNotes: {
    "2026-09-15": {
      blockades:
        "The lycée Victor-Hugo in Caen — the first mainland blockade. Villeneuve-d'Ascq was blocked on 14 September and Le Rheu on 7 September, both before the window opens.",
    },
    "2026-09-19": {
      blockades:
        "Lycée Saint-Exupéry in Créteil: students backed the teachers' strike with the school's first blockade — the origin of the national movement.",
    },
    "2026-09-23": {
      blockades:
        "Île-de-France only: the Créteil rectorate counted the blockades spreading to about ten lycées.",
    },
    "2026-09-25": {
      arrests: "Paris area only — Préfecture de Police figure, by midday.",
    },
    "2026-09-28": {
      protesterInjured:
        "One documented case: a 14-year-old hit by a police projectile. A floor, not a count.",
      blockades:
        "Interior Ministry: 27 complete blockades, out of 180 establishments perturbed.",
    },
    "2026-09-29": {
      turnout:
        "Counts the public-service cortège the school actions joined (206 000 ministry / 300 000 CGT), not a student crowd.",
      strikers:
        "Derived, not counted. 10% of the 2,500,000 state civil servants on strike (government figure), giving 250,000. Education is the largest component, not an addend: 11.47% of education staff (ministry weighted average — 12.74% second degree, 27.39% life-school staff; 13.71% of teachers) is 114,700 of the same civil service and is already inside the 250,000. Union claims (>40% of first-degree staff, >40% in Lyon and Créteil) are regional and are not used as a national ceiling.",
      protesterInjured:
        "Students and education staff injured that day, counted by the Education ministry.",
      blockades:
        "Education ministry at the time of its balance: 45 schools blocked out of 338 concerned. Le Monde counted actions at nearly 410 establishments.",
    },
    "2026-09-30": {
      protesterInjured:
        "Cumulative since the first blockades — a stock, not a daily count.",
      forcesInjuredStock:
        "The running total of injured security forces: 83 on 30 September, the first injury figures of the movement.",
    },
    "2026-10-01": {
      forcesInjured:
        "The day's own figure: 'some 300' injured in intervention on Thursday (Nuñez), 305 in Actu Forces' Beauvau tally. The running total that day was 383–388.",
      protesterInjured:
        "Cumulative level reached at the 1 October cut-off (170 students + 65 education staff) — a stock, not a daily count. Where a week ends on this cell, the level is the week’s figure, never the sum of the week’s flows.",
      damagesCost:
        "Part of the 1–8 October Île-de-France increment; the anchor of that run is 8 October.",
      blockades:
        "Low end: 222 schools blocked (Le Monde live, out of 1,027 establishments concerned). High end: the Union étudiante's 640. The police counted 169 blockades in the morning, and 900 actions with 400 closures by the end of the day.",
    },
    "2026-10-02": {
      blockades:
        "'More than 400 schools blocked' (Le Monde live). The Interior Ministry's own tally for 2 October: 1,027 lycées concerned, more than 560 perturbed, 400 closed.",
    },
    "2026-10-03": {
      arrests:
        "Derived by subtraction: the ministry's 6 059 since 28 September (published 5 October) less the published daily figures. Covers 3 and 4 October together.",
      blockades:
        "Wider measure: the Education ministry counted 735 establishments perturbed, not schools fully blocked. The highest blocked count that week was 400+ on 2 October.",
    },
    "2026-10-05": {
      arrests:
        "984 interpellations that day. The ministry's 6 059 since 28 September is the stock that makes the weekend figure checkable.",
      blockades:
        "Wider measure: 400 to 500 establishments closed (government spokeswoman), more than 400 to stay closed. The ministry's morning count was 413 establishments perturbed.",
      forcesInjuredStock:
        "Running total since the start of the movement: 715 injured police and gendarmes (Matignon).",
    },
    "2026-10-06": {
      damagesCost:
        "Part of the 1–8 October Île-de-France increment; the anchor of that run is 8 October.",
      blockades:
        "Wider measure: 891 of the 3,700 schools had their classes suspended, totally or partially, at midday (ministry). The USL counted 1,800 schools 'à l'arrêt' — a union figure that also includes administratively closed schools.",
    },
    "2026-10-08": {
      damagesCost:
        "Anchor of the 1–8 October Île-de-France damage increment. The same €6M is published for 6 October and is not counted twice.",
      strikers:
        "Derived, not counted. The Education ministry published a weighted participation rate of 0.82% for education staff; no function-wide rate was published that day, so the education rate stands in for the civil service on the same 2,500,000-agent base: 20,500. The proxy is known to run low — where both were published, education was 11.47% against about 10% for the civil service (29 Sept) and 12.77% against 10.46% (5 Nov).",
      blockades:
        "Wider measure: 224 establishments closed (ministry); more than 150 still perturbed (franceinfo). The 224 figure is the benchmark the ministry quotes back on 13 October.",
      forcesInjuredStock:
        "Running total: 761 injured (Nuñez). The published increments reconcile with it — 715 on 5 October plus 43 on 6 October is 758.",
    },
    "2026-10-09": {
      arrests:
        "Justice Ministry judicial balance, cut off 8 Oct 17:00: 6,877 people placed in garde à vue since the start of the movement, 86% minors, 2,376 being prosecuted, 21 in detention. A different scope (since mid-September) and a different statistic (custodial placements, not interpellations) from the Interior Ministry's series — not reconcilable with it.",
    },
    "2026-10-10": {
      damagesCost:
        "National cumulative stock since mid-September, compiled by CNEWS from regional figures — no ministry published a national tally. Pannekoucke's parallel €25–30M estimate for Auvergne-Rhône-Alpes is NOT included, so this is neither a floor nor additive with the regional figures.",
      blockades: "'More than 40 schools blocked' (AFP/Reuters, 10 October).",
    },
    "2026-10-12": {
      arrests:
        "13 interpellations reported independently by the Rhône prefecture (27 établissements touched) and the Bas-Rhin prefecture in Strasbourg. Two prefectures, the same number — so 13 is a floor for the day, not the day's regional total. Not Paris.",
      protesterInjured:
        "Île-de-France only: a proviseur, a parent d'élève and a Région employee injured. Counted as education and local-authority staff, on the same basis as the 29 September ministry figure.",
      damagesCost:
        'Normandy — Hervé Morin, Conseil régional de Normandie, at the regional assembly, 12 Oct: "1,5 million en Normandie" out of "d\'ores et déjà 30 millions d\'euros" nationally. A cumulative regional stock, not a daily flow, and a component of the national stock — never added to it. Île-de-France\'s own revised total the same day was €8.5M.',
      blockades:
        "Rhône prefecture only: 19 of the 27 establishments affected were lycées (six universities, two colleges). Île-de-France counted nearly 80 lycées perturbed the same day.",
    },
    "2026-10-13": {
      blockades:
        "Wider measure: 214 establishments closed, 94.2% of lycées open — against 224 on 8 October. The ministry called the movement 'en recul'.",
      strikers:
        "Derived, not counted. 3.71% weighted education participation (ministry), used as a proxy for the civil service on the 2,500,000-agent base: 92,750. Education's own rates that day: 4.52% of teachers, 10.31% of life-schools staff. The ministry's figure excludes Toulouse, La Réunion (school holidays since 10 October), Guadeloupe, Martinique and Guyana (time difference).",
    },
    "2026-10-14": {
      forcesInjuredStock: "Running total: 937 injured (Nuñez).",
    },
    "2026-10-17": {
      forcesInjured:
        "Derived: the ministry's running total rose from 937 (14 October) to 1,144 (17 October), so this is the three-day increment, not a single day.",
      forcesInjuredStock:
        "The peak of the running total: 997 injured in the first bilan, 1,144 on consolidation, 7 of them serious. This is the total since the movement began, not that day's toll.",
      protesterInjured:
        "Derived band: the floor is the serious-injury register, the ceiling is extrapolated from street-medics treatment counts. No official count exists.",
      damagesCost:
        "IFRAP modelled estimate for the 17–18 October weekend; excludes lost turnover and order-maintenance costs. The Paris-only estimate published for 18 October is a subset of it and is excluded from the weekly sum.",
    },
    "2026-10-18": {
      arrests: "Prefecture of police of Paris figure only — curfew day.",
      damagesCost:
        "Paris-only subset of the 17–18 October IFRAP total — never added to it.",
    },
    "2026-10-20": {
      arrests: "Guadeloupe prefecture figures only — regional.",
    },
    "2026-10-24": {
      damagesCost:
        "CCI France's national tally for 17–24 October — a superset of the 17 October cell, never added to it.",
      forcesInjuredStock:
        "Derived: 1,144 (17 October) plus 267 injured that day gives 1,411.",
    },
    "2026-10-31": {
      damagesCost: "Local estimate — no national damage figure was published.",
      forcesInjuredStock:
        "Derived: 1,411 plus 116–159 injured that day gives 1,527–1,570. An internal CRS file obtained by Mediapart counts 1,233 CRS agents declared injured in October, of whom 1,167 were classified as light injuries — 94.6%.",
    },
    "2026-11-02": {
      blockades:
        "Education ministry at 9.30: 41 lycées blocked, about 1% of the country's 3,700, with no perturbation in three quarters of the departments.",
    },
    "2026-11-03": {
      blockades:
        "Education ministry: 48 schools blocked. The USL counted nearly 500.",
    },
    "2026-11-05": {
      strikers:
        "Derived, not counted. The government put 9.89% of state civil servants on strike at midday and 11% by the end of the day, on 2,500,000 agents: 247,250 to 275,000 — the band is the timing of the count, not an error bar. The Education ministry's own weighted rate was 12.77% (19.14% in the first degree, 25.65% for life-schools staff): a component of that total, never an addition to it.",
      forcesInjured: "The day's own figure: 53 at 18:00, 112 on consolidation.",
      forcesInjuredStock:
        "The ministry's final running total: 1,580 injured since the start of the movement. It reconciles exactly with the published daily increments — 1,144 (17 October) + 267 (24 October) + 116 (31 October) + 53 (5 November) = 1,580.",
      protesterInjured: 'Published as a floor: "at least this many".',
      blockades:
        "Matignon at 10.00: 81 establishments blocked (2.2%). The USL counted 1,000 schools 'à l'arrêt' — blocked or administratively closed, so an upper bound. The Education ministry counted 33% of establishments perturbed.",
    },
    "2026-11-09": {
      arrests: "Regional prefecture figures only — Bordeaux, Lyon, Strasbourg.",
    },
    "2026-11-10": {
      strikers:
        "Derived, not counted. 1.55% weighted education participation (ministry), used as a proxy for the civil service on the 2,500,000-agent base: 38,750. Education's own rates: 1.60% of teachers, 7.01% of life-schools staff. The ministry's figure covers the metropolitan academies only.",
    },
  },
  deployNotes: {
    "2026-09-28": "deployment estimated",
    "2026-09-29": "deployment estimated",
    "2026-09-30": "deployment estimated",
    "2026-10-01": "deployment estimated",
    "2026-10-02": "deployment estimated",
    "2026-10-05": "deployment estimated",
    "2026-10-06": "deployment estimated",
    "2026-10-08": "deployment estimated",
    "2026-10-12": "estimé — Île-de-France, Lyon et Strasbourg",
    "2026-10-13": "deployment estimated",
    "2026-10-17": "deployment published",
    "2026-10-18": "estimated — Paris curfew",
    "2026-10-24": "deployment published",
    "2026-10-31": "deployment published",
    "2026-11-05": "deployment published",
    "2026-11-07": "deployment published",
  },
  policingDay: "{head} officers × {low}–{high} per officer-day · {note}",
  policingDayPlain: "{head} officers × {low}–{high} per officer-day",
  cumulativeAdded: "deployment counted this day — {days} so far",
  cumulativeCarried: "no deployment published — cumulative carried forward",
  weekNational: "{n} day{s} counted",
  weekRegionalOnly: "{n} day{s}, regional only",
  weekPeak: "peak {date}",
  weekNoNational: "no national figure this week",
  weekExcluded: "{n} point{s} excluded (regional or subset)",
  weekFloored: "includes a floor — not a sum",
  weekClipped: "week clipped by the window",
  weekJoin: " · ",
  tooltipRange: "{label}: {mid} (band {low}–{high})",
  tooltipPoint: "{label}: {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "ⓘ {note}",
  weekVacation: "partly inside the Toussaint holiday (17 Oct – 1 Nov)",
  holidayLine:
    "Dotted line: the Toussaint holiday, 17 October – 1 November 2026. No lycée was in session, so no school could be blocked — the count did not exist, it was not zero.",
  metricNote:
    "Schools blocked or closed: establishments where pupils could not attend normally. The band runs from the official count to the union count, and the union's figure also includes administratively closed schools.",
  blockerNote:
    "A wider measure than blockades — establishments perturbed, with classes suspended, or closed — used where it is the only figure published that day.",
  series: {
    protestersDaily: {
      label: "Protesters",
      detached: "Protesters (detached figure)",
    },
    strikersDaily: {
      label: "People on strike",
      detached: "People on strike (modelled)",
    },
    blockadesDaily: {
      label: "Schools blocked",
      detached: "Schools blocked (regional count)",
    },
    arrestsDaily: { label: "Arrests", detached: "Arrests (detached figure)" },
    forcesDaily: {
      label: "Injured — security forces",
      detached: "Injured forces (detached figure)",
    },
    forcesInjuredStock: {
      label: "Injured forces (running total)",
      detached: "Injured forces, running total (stock)",
    },
    protestersInjuredDaily: {
      label: "Injured — protesters",
      detached: "Injured protesters (detached figure)",
    },
    damagesDaily: {
      label: "Material damage",
      detached: "Damage (stock or modelled figure)",
    },
    policingDaily: {
      label: "Policing cost, per day",
      detached: "Policing cost, per day (modelled)",
    },
    policingCumulative: {
      label: "Policing cost, cumulative",
      detached: "Policing cost, cumulative (modelled)",
    },
    protestersWeekly: {
      label: "Protesters (weekly peak)",
      detached: "Protesters (regional week)",
    },
    strikersWeekly: {
      label: "People on strike (weekly peak)",
      detached: "People on strike (modelled)",
    },
    blockadesWeekly: {
      label: "Schools blocked (weekly peak)",
      detached: "Schools blocked (regional week)",
    },
    arrestsWeekly: {
      label: "Arrests (weekly total)",
      detached: "Arrests (regional week)",
    },
    forcesWeekly: {
      label: "Forces injured (weekly total)",
      detached: "Forces injured (regional week)",
    },
    protestersInjuredWeekly: {
      label: "Protesters injured (weekly total)",
      detached: "Protesters injured (regional week)",
    },
  },
  charts: {
    protestersDaily: {
      title: "Protesters, people on strike and blocked schools, daily",
      subtitle:
        "Crowd counts and people on strike on the left axis, school blockades on the right. People on strike is derived from published participation rates — no authority published a headcount. The dotted line is the Toussaint holiday. Three of the five strike points are derived.",
      y: "People in the street or on strike",
      yRight: "Schools blocked or closed",
    },
    enforcementDaily: {
      title: "Arrests and injuries, daily",
      subtitle:
        "Arrests are not custody placements; injuries are counted per side",
      y: "People",
    },
    cost: {
      title: "Damage and the cost of policing",
      subtitle: "",
      y: "€ millions",
    },
    protestersWeekly: {
      title: "Protesters, people on strike and blocked schools, weekly peak",
      subtitle:
        "Peak day of each week, not a weekly sum — the same lycée is blocked on several consecutive days, and a person on strike for three days is still one person",
      y: "People (peak day)",
      yRight: "Schools blocked or closed (peak)",
    },
    enforcementWeekly: {
      title: "Enforcement, weekly totals",
      subtitle: "Weekly sums; a stock or a floor is not additive",
      y: "People (weekly total)",
    },
  },
};

const CHART_FR: ChartCopy = {
  axisDate: "Date",
  axisWeek: "Semaine",
  edgeMark: "†",
  weekOf: "Semaine du {date}",
  weekOfPartial: "Semaine du {date} (partielle)",
  eurM: "{v} M€",
  suffix: {
    c: "stock",
    w: "",
    e: "modélisé",
    f: "borne inférieure",
    r: "régional",
    p: "partiel",
    x: "mesure plus large",
    n: "",
    regional: "régional",
  },
  suffixWrap: " · {text}",
  dayNotes: {
    "2026-09-25":
      "Chiffre de la région parisienne uniquement : 21 interpellations à midi, annoncées par la préfecture de police.",
    "2026-09-28":
      "Le mouvement prend une dimension nationale — actions à Marseille, Lille, dans le Rhône, le Var et les Alpes-Maritimes.",
    "2026-09-29":
      "Acte I. Le chiffre de foule compte le cortège de la fonction publique rejoint par les actions lycée, pas une foule étudiante. La série des personnes en grève commence ici : 250 000 agents de la fonction publique d’État, dérivés du taux de 10 % annoncé par le gouvernement.",
    "2026-09-30":
      "Deuxième jour de l’acte I : 625 interpellations et 83 blessés des forces de l’ordre. Le ministère de l’Éducation compte 356 établissements concernés ; aucun décompte de lycées entièrement bloqués n’a été publié ce jour-là.",
    "2026-10-01":
      "Acte II, la pointe de la première semaine. Interpellations et blessés publiés sans chiffre de foule pour la journée.",
    "2026-10-02":
      "735 établissements encore perturbés, et des violences urbaines près de 158 d’entre eux.",
    "2026-10-03":
      "Aucun chiffre de week-end n’a été publié ; les interpellations des 3–4 octobre sont dérivées par soustraction. 735 établissements perturbés — une mesure plus large que les blocages ; le point est signalé comme tel.",
    "2026-10-05":
      "Première journée nationale scolaire après les vacances, avec les stocks ministériels.",
    "2026-10-06":
      "Acte III — première manifestation étudiante nationale de plein exercice.",
    "2026-10-13":
      "La fourchette de foule va du simple au triple : plancher ministériel, plafond syndical.",
    "2026-10-16":
      "Dernier jour de cours avant les vacances de la Toussaint : à partir du 17 octobre aucun lycée n’est en cours, le décompte des blocages s’interrompt.",
    "2026-10-17":
      "La journée de pointe. La fourchette de dommages ici est l’estimation IFRAP des 17–18 octobre, non un flux quotidien. Vacances de la Toussaint — établissements fermés. ",
    "2026-10-19":
      "Vacances de la Toussaint — les étudiants soutiennent le mouvement lycéeen depuis l’extérieur des établissements.",
    "2026-10-24":
      "Les interpellations incluent les contrôles préventifs ; toutes ne deviennent pas des gardes à vue. Vacances de la Toussaint — la mobilisation était une journée interprofessionnelle, pas une journée scolaire.",
    "2026-10-31":
      "Aucun chiffre de blessés parmi les manifestants n’a été publié ce jour-là. Vacances de la Toussaint — mobilisation interprofessionnelle.",
    "2026-11-01": "Dernier jour des vacances de la Toussaint.",
    "2026-11-04":
      "Dans le Rhône, sept établissements ont fait cours à distance ; aucun lycée n’est signalé comme bloqué.",
    "2026-11-05":
      "La fourchette de foule va de 575 000 à 1,6 million — la fourchette est la divergence, pas une barre d’erreur. Le point de grève est dérivé des taux gouvernementaux : 9,89–11 % des agents de la fonction publique d’État.",
    "2026-11-06":
      "Dans le Rhône, incidents dans 16 lycées et deux collèges, et un lycée du 8e arrondissement de Lyon bloqué lors de son évacuation.",
    "2026-11-09":
      "Dans le Rhône, aucun lycée n’est bloqué : 14 fonctionnent à distance et 11 sont signalés comme touchés. Un zéro ne peut pas être porté sur un axe logarithmique, il est donc consigné ici et non comme point.",
    "2026-11-10": "Dans le Rhône, une dizaine d’établissements sont touchés.",
  },
  obsNotes: {
    "2026-09-15": {
      blockades:
        "Le lycée Victor-Hugo de Caen — le premier blocus en métropole. Villeneuve-d’Ascq avait été bloqué le 14 septembre et Le Rheu le 7 septembre, avant l’ouverture de la fenêtre.",
    },
    "2026-09-19": {
      blockades:
        "Lycée Saint-Exupéry de Créteil : les élèves soutiennent la grève des enseignants par le premier blocus de l’établissement — l’origine du mouvement national.",
    },
    "2026-09-23": {
      blockades:
        "Île-de-France uniquement : selon le rectorat de Créteil, les blocus s’étendent rapidement à une dizaine de lycées.",
    },
    "2026-09-25": {
      arrests:
        "Région parisienne uniquement — chiffres de la préfecture de police, à midi.",
    },
    "2026-09-28": {
      protesterInjured:
        "Un cas documenté : un garçon de 14 ans touché par un projectile de police. Un plancher, pas un décompte.",
      blockades:
        "Ministère de l’Intérieur : 27 blocages totaux, sur 180 établissements perturbés.",
    },
    "2026-09-29": {
      turnout:
        "Compte le cortège de la fonction publique rejoint par les actions lycée (206 000 ministère / 300 000 CGT), pas une foule étudiante.",
      strikers:
        "Chiffre dérivé, non compté. 10 % des 2 500 000 agents de la fonction publique d’État en grève (chiffre gouvernemental), soit 250 000. L’Éducation en est la principale composante, non un supplément : 11,47 % des personnels de l’Éducation (moyenne pondérée du ministère — 12,74 % dans le second degré, 27,39 % pour la vie scolaire ; 13,71 % des enseignants) représentent 114 700 agents de la même fonction publique d’État, déjà compris dans ces 250 000. Les revendications syndicales (plus de 40 % des personnels du premier degré, plus de 40 % à Lyon et à Créteil) sont régionales et ne servent pas de plafond national.",
      protesterInjured:
        "Élèves et personnels de l’éducation blessés ce jour-là, comptés par le ministère de l’Éducation.",
      blockades:
        "Ministère de l’Éducation au moment de son bilan : 45 lycées bloqués sur 338 concernés. Le Monde recense des actions dans près de 410 établissements.",
    },
    "2026-09-30": {
      protesterInjured:
        "Cumul depuis les premiers blocages — un stock, pas un décompte quotidien.",
      forcesInjuredStock:
        "Cumul des blessés parmi les forces : 83 le 30 septembre, premiers chiffres de blessures du mouvement.",
    },
    "2026-10-01": {
      forcesInjured:
        "Le compte du jour : « quelque 300 » blessés en intervention le jeudi (Nuñez), 305 dans le décompte Beauvau d’Actu Forces. Le cumul de ce jour-là : 383–388.",
      protesterInjured:
        "Niveau cumulé atteint à l’arrêt du 1er octobre (170 élèves + 65 personnels de l’éducation) — un stock, pas un décompte quotidien. Lorsqu’une semaine se termine sur cette cellule, le niveau est le chiffre de la semaine, jamais la somme des flux de la semaine.",
      damagesCost:
        "Une part de l’incrément francilien du 1er au 8 octobre ; l’ancrage de cette série est le 8 octobre.",
      blockades:
        "Borne basse : 222 lycées bloqués (Le Monde en direct, sur 1 027 établissements concernés). Borne haute : les 640 de l’Union étudiante. La police comptait 169 blocages le matin, et 900 actions avec 400 fermetures en fin de journée.",
    },
    "2026-10-02": {
      blockades:
        "« Plus de 400 lycées bloqués » (Le Monde en direct). Le décompte du ministère de l’Intérieur pour le 2 octobre : 1 027 lycées concernés, plus de 560 perturbés, 400 fermés.",
    },
    "2026-10-03": {
      arrests:
        "Dérivé par soustraction : les 6 059 interpellations depuis le 28 septembre (publiés le 5 octobre) moins les chiffres journaliers publiés. Couvre les 3 et 4 octobre ensemble.",
      blockades:
        "Mesure plus large : le ministère de l’Éducation compte 735 établissements perturbés, et non des lycées entièrement bloqués. Le plus haut décompte de blocages de la semaine est de 400+ le 2 octobre.",
    },
    "2026-10-05": {
      arrests:
        "984 interpellations ce jour-là. Le stock ministériel de 6 059 depuis le 28 septembre est ce qui rend vérifiable le chiffre du week-end.",
      blockades:
        "Mesure plus large : 400 à 500 établissements fermés (porte-parole du gouvernement), plus de 400 doivent le rester. Le comptage de mi-matin du ministère est de 413 établissements perturbés.",
      forcesInjuredStock:
        "Cumul depuis le début du mouvement : 715 policiers et gendarmes blessés (Matignon).",
    },
    "2026-10-06": {
      damagesCost:
        "Une part de l’incrément francilien du 1er au 8 octobre ; l’ancrage de cette série est le 8 octobre.",
      blockades:
        "Mesure plus large : 891 établissements sur 3 700 ont eu leurs cours suspendus, totalement ou partiellement, à la mi-journée (ministère). L’USL compte 1 800 lycées « à l’arrêt » — un décompte syndical qui inclut aussi les lycées fermés administrativement.",
    },
    "2026-10-08": {
      damagesCost:
        "Ancrage de l’incrément de dommages francilien du 1er au 8 octobre. Les mêmes 6 M€ sont publiés au 6 octobre et ne sont pas comptés deux fois.",
      blockades:
        "Mesure plus large : 224 établissements fermés (ministère) ; plus de 150 encore perturbés (franceinfo). Le chiffre de 224 est celui que le ministère rappellera le 13 octobre.",
      forcesInjuredStock:
        "Cumul : 761 blessés (Nuñez). Les incréments publiés se recoupent — 715 le 5 octobre plus 43 le 6 octobre font 758.",
    },
    "2026-10-10": {
      blockades: "« Plus de 40 lycées bloqués » (AFP/Reuters, 10 octobre).",
    },
    "2026-10-12": {
      arrests:
        "13 interpellations rapportées indépendamment par la préfecture du Rhône (27 établissements touchés) et par celle du Bas-Rhin à Strasbourg. Deux préfectures, le même nombre : 13 est donc un plancher pour la journée, pas le total régional du jour. Ce n’est pas Paris.",
      protesterInjured:
        "Île-de-France uniquement : un proviseur, un parent d’élève et un agent de la Région blessés. Comptés comme personnels de l’éducation et des collectivités, sur la même base que le chiffre ministériel du 29 septembre.",
      damagesCost:
        "Normandie — Hervé Morin, Conseil régional de Normandie, à l’assemblée régionale le 12 oct. : « 1,5 million en Normandie » sur « d’ores et déjà 30 millions d’euros » au niveau national. Un stock régional cumulé, pas un flux quotidien, et une composante du stock national — jamais additionné. Le total francilien révisé le même jour était de 8,5 M€.",
      blockades:
        "Préfecture du Rhône uniquement : 19 des 27 établissements touchés étaient des lycées (six universités, deux collèges). L’Île-de-France comptait près de 80 lycées perturbés le même jour.",
    },
    "2026-10-13": {
      blockades:
        "Mesure plus large : 214 établissements fermés, 94,2 % de lycées ouverts — contre 224 le 8 octobre. Le ministère parle d’un mouvement « en recul ».",
    },
    "2026-10-14": {
      forcesInjuredStock: "Cumul : 937 blessés (Nuñez).",
    },
    "2026-10-17": {
      protesterInjured:
        "Fourchette dérivée : le plancher est le registre des blessures graves, le plafond est extrapolé à partir des soins dispensés par les street-medics. Aucun décompte officiel n’existe.",
      damagesCost:
        "Estimation modélisée de l’IFRAP pour le week-end des 17–18 octobre ; hors chiffre d’affaires perdu et coûts de maintien de l’ordre. L’estimation parisienne publiée le 18 octobre en est un sous-ensemble, exclue de la somme hebdomadaire.",
      forcesInjured:
        "Dérivé : le cumul ministériel passe de 937 (14 octobre) à 1 144 (17 octobre) ; c’est donc l’incrément de trois jours, pas celui d’une journée.",
      forcesInjuredStock:
        "Pic du cumul : 997 blessés au premier bilan, 1 144 après consolidation, dont 7 graves. C’est le total depuis le début du mouvement, pas le compte du jour.",
    },
    "2026-10-18": {
      arrests:
        "Chiffre de la préfecture de police de Paris uniquement — journée de couvre-feu.",
      damagesCost:
        "Sous-ensemble parisien du total IFRAP des 17–18 octobre — jamais additionné.",
    },
    "2026-10-20": {
      arrests: "Chiffres des préfectures de Guadeloupe uniquement — régional.",
    },
    "2026-10-24": {
      damagesCost:
        "Bilan national de CCI France pour le 17–24 octobre — un surensemble de la cellule du 17 octobre, jamais additionné.",
    },
    "2026-10-31": {
      damagesCost:
        "Estimation locale — aucun chiffre national de dommages n’a été publié.",
      forcesInjuredStock:
        "Dérivé : 1 411 (17 octobre) plus 116–159 blessés le jour même font 1 527–1 570. Un fichier interne des CRS obtenu par Mediapart dénombre 1 233 agents déclarés blessés en octobre, dont 1 167 classés « légèrement » blessés — 94,6 %.",
    },
    "2026-11-02": {
      blockades:
        "Ministère de l’Éducation à 9 h 30 : 41 lycées bloqués, environ 1 % des 3 700 du pays, et aucune perturbation dans les trois quarts des départements.",
    },
    "2026-11-03": {
      blockades:
        "Ministère de l’Éducation : 48 lycées bloqués. L’USL en compte près de 500.",
    },
    "2026-11-05": {
      strikers:
        "Chiffre dérivé, non compté. 9,89 % des agents de la fonction publique d’État à la mi-journée, puis 11 % plus tard, sur 2 500 000 agents : de 247 250 à 275 000 — la fourchette est celle de l’heure du comptage, non une barre d’erreur. Éducation : 12,77 % des personnels (ministère, hors académie de Toulouse) = 127 700, une composante de ce total. Exclus : collectivités territoriales 4,60 % et hôpitaux publics 3,93 % (aucun effectif publié), les 52 % de la SNES-FSU (périmètre plus étroit), et le « près d’1,6 million en grève et dans les manifestations » de la CGT, qui recouvre deux populations et borne déjà la fourchette de foule ci-dessus.",
      protesterInjured: "Publié comme plancher : « au moins ». ",
      blockades:
        "Matignon à 10 h : 81 établissements bloqués (2,2 %). L’USL compte 1 000 lycées « à l’arrêt » — bloqués ou fermés administrativement, donc une borne haute. Le ministère de l’Éducation compte 33 % d’établissements perturbés.",
      forcesInjured: "Le compte du jour : 53 à 18 h, 112 après consolidation.",
      forcesInjuredStock:
        "Cumul final du ministère : 1 580 blessés depuis le début du mouvement. Il se recoupe exactement avec les incréments publiés — 1 144 (17 octobre) + 267 (24 octobre) + 116 (31 octobre) + 53 (5 novembre) = 1 580.",
    },
    "2026-11-09": {
      arrests:
        "Chiffres de préfectures régionales uniquement — Bordeaux, Lyon, Strasbourg.",
    },
  },
  deployNotes: {
    "2026-09-28": "dispositif estimé",
    "2026-09-29": "dispositif estimé",
    "2026-09-30": "dispositif estimé",
    "2026-10-01": "dispositif estimé",
    "2026-10-02": "dispositif estimé",
    "2026-10-05": "dispositif estimé",
    "2026-10-06": "dispositif estimé",
    "2026-10-08": "dispositif estimé",
    "2026-10-12": "estimated — Île-de-France, Lyon and Strasbourg",
    "2026-10-13": "dispositif estimé",
    "2026-10-17": "dispositif publié",
    "2026-10-18": "estimé — couvre-feu parisien",
    "2026-10-24": "dispositif publié",
    "2026-10-31": "dispositif publié",
    "2026-11-05": "dispositif publié",
    "2026-11-07": "dispositif publié",
  },
  policingDay: "{head} agents × {low}–{high} € par agent-jour · {note}",
  policingDayPlain: "{head} agents × {low}–{high} € par agent-jour",
  cumulativeAdded: "dispositif compté ce jour — {days} à ce stade",
  cumulativeCarried: "aucun dispositif publié — cumul reporté",
  weekNational: "{n} jour{s} compté{s}",
  weekRegionalOnly: "{n} jour{s}, régional seulement",
  weekPeak: "pointe le {date}",
  weekNoNational: "aucun chiffre national cette semaine",
  weekExcluded: "{n} point{s} exclu(s) (régional ou sous-ensemble)",
  weekFloored: "comprend un plancher — pas une somme",
  weekClipped: "semaine tronquée par la fenêtre",
  weekJoin: " · ",
  tooltipRange: "{label} : {mid} (fourchette {low}–{high})",
  tooltipPoint: "{label} : {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "ⓘ {note}",
  weekVacation:
    "en partie pendant les vacances de la Toussaint (17 oct. – 1 nov.)",
  holidayLine:
    "Ligne en pointillés : les vacances de la Toussaint, du 17 octobre au 1er novembre 2026. Aucun lycée n’était en cours, aucun ne pouvait être bloqué — le décompte n’existait pas, il n’était pas nul.",
  metricNote:
    "Lycées bloqués ou fermés : les établissements où les élèves ne pouvaient pas suivre normalement. La fourchette va du décompte officiel au décompte syndical, et ce dernier inclut les lycées fermés administrativement.",
  blockerNote:
    "Mesure plus large que les blocages — établissements perturbés, cours suspendus ou fermés — utilisée lorsque c’est le seul chiffre publié ce jour-là.",
  series: {
    protestersDaily: {
      label: "Manifestants",
      detached: "Manifestants (chiffre écarté de la courbe)",
    },
    strikersDaily: {
      label: "Personnes en grève",
      detached: "Personnes en grève (chiffre modélisé)",
    },
    blockadesDaily: {
      label: "Lycées bloqués",
      detached: "Lycées bloqués (décompte régional)",
    },
    arrestsDaily: {
      label: "Interpellations",
      detached: "Interpellations (chiffre écarté)",
    },
    forcesDaily: {
      label: "Blessés — forces de l’ordre",
      detached: "Forces blessées (chiffre écarté)",
    },
    forcesInjuredStock: {
      label: "Forces blessées (cumul)",
      detached: "Forces blessées, cumul (stock)",
    },
    protestersInjuredDaily: {
      label: "Blessés — manifestants",
      detached: "Manifestants blessés (chiffre écarté)",
    },
    damagesDaily: {
      label: "Dommages matériels",
      detached: "Dommages (stock ou chiffre modélisé)",
    },
    policingDaily: {
      label: "Coût du maintien de l’ordre, par jour",
      detached: "Coût par jour (modélisé)",
    },
    policingCumulative: {
      label: "Coût du maintien de l’ordre, cumulé",
      detached: "Coût cumulé (modélisé)",
    },
    protestersWeekly: {
      label: "Manifestants (pointe hebdomadaire)",
      detached: "Manifestants (semaine régionale)",
    },
    strikersWeekly: {
      label: "Personnes en grève (pointe hebdomadaire)",
      detached: "Personnes en grève (chiffre modélisé)",
    },
    blockadesWeekly: {
      label: "Lycées bloqués (pointe hebdomadaire)",
      detached: "Lycées bloqués (semaine régionale)",
    },
    arrestsWeekly: {
      label: "Interpellations (total hebdomadaire)",
      detached: "Interpellations (semaine régionale)",
    },
    forcesWeekly: {
      label: "Forces blessées (total hebdomadaire)",
      detached: "Forces blessées (semaine régionale)",
    },
    protestersInjuredWeekly: {
      label: "Manifestants blessés (total hebdomadaire)",
      detached: "Manifestants blessés (semaine régionale)",
    },
  },
  charts: {
    protestersDaily: {
      title: "Manifestants, personnes en grève et lycées bloqués, par jour",
      subtitle:
        "Foules et personnes en grève sur l’axe de gauche, blocages de lycées sur l’axe de droite. Les personnes en grève sont dérivées de taux de participation publiés — aucune autorité n’a publié de décompte. La ligne en pointillés correspond aux vacances de la Toussaint",
      y: "Personnes dans la rue ou en grève",
      yRight: "Lycées bloqués ou fermés",
    },
    enforcementDaily: {
      title: "Interpellations et blessés, par jour",
      subtitle:
        "Une interpellation n’est pas une garde à vue ; les blessés sont comptés par camp",
      y: "Personnes",
    },
    cost: {
      title: "Dommages et coût du maintien de l’ordre",
      subtitle: "",
      y: "Millions d’€",
    },
    protestersWeekly: {
      title:
        "Manifestants, personnes en grève et lycées bloqués, pointe hebdomadaire",
      subtitle:
        "Jour de pointe de chaque semaine, non une somme hebdomadaire — un même lycée est bloqué plusieurs jours de suite, et une personne en grève trois jours reste une personne",
      y: "Personnes (jour de pointe)",
      yRight: "Lycées bloqués ou fermés (pointe)",
    },
    enforcementWeekly: {
      title: "Maintien de l’ordre, totaux hebdomadaires",
      subtitle:
        "Sommes hebdomadaires ; un stock ou un plancher ne s’additionne pas",
      y: "Personnes (total hebdomadaire)",
    },
  },
};

/* ==================================================== catalogue: episodes.ts */

export interface WeekCopy {
  /** "13 May: general strike" — appended to the tooltip title. */
  readonly action?: string;
  readonly note?: Readonly<Partial<Record<string, string>>>;
}

export interface EpisodeCopy {
  /** Legend and direct label. */
  readonly short: string;
  /** Panel caption head. */
  readonly strip: string;
  /** Prose under the panel caption. */
  readonly banner: string;
  /** Indexed BY WEEK NUMBER — holes are expected (gj reaches w: 43). */
  readonly weeks: readonly (WeekCopy | undefined)[];
  readonly fallbackNote?: Readonly<Partial<Record<string, string>>>;
}

const EPISODES_EN: Record<string, EpisodeCopy> = {
  may68: {
    short: "May 68",
    strip: "May 68",
    banner:
      "General strike and factory occupations. Union and ministry crowd counts differ by a factor of ten, so both are plotted.",
    weeks: [
      { action: "1 May marches" },
      {
        action: "Night of the barricades, 10–11 May",
        note: { i: "Injury figure published as a floor." },
      },
      { action: "General strike from 13 May" },
      {
        action: "24 May: de Gaulle’s broadcast",
        note: { a: "Arrest count published as a floor." },
      },
      { action: "Grenelle agreements, 27 May" },
      { action: "Legislative campaign" },
      undefined,
      undefined,
      undefined,
    ],
  },
  cpe: {
    short: "CPE 2006",
    strip: "CPE 2006",
    banner:
      "First-employment contract: student and school movement, with two inter-union days. Enforcement figures exist for four weeks only.",
    weeks: [
      { action: "7 February: first national day" },
      undefined,
      undefined,
      undefined,
      { action: "Blockaded universities" },
      { action: "14 March: national day" },
      { action: "21 March: student day" },
      { action: "28 March: national day" },
      { action: "4 April: national day" },
      { action: "Withdrawal announced" },
    ],
  },
  gj: {
    short: "Gilets jaunes",
    strip: "Gilets jaunes",
    banner:
      "Counted act by act, on Saturdays only. Enforcement figures were published for the first four acts and never as a series afterwards.",
    weeks: [], // the act number in the tooltip title carries the chronology
  },
  nahel: {
    short: "June 2023",
    strip: "June 2023",
    banner:
      "Five nights of rioting after the 27 June killing. Arrests and injuries are high relative to turnout because this was not a demonstration.",
    weeks: [{ action: "27 June: riots begin" }, { action: "Return to calm" }],
  },
  pensions: {
    short: "Pensions 2023",
    strip: "Pensions 2023",
    banner:
      "Movement against the rise in the statutory retirement age. Two anchor days carry most of the series; the inter-union band is wide.",
    weeks: [
      { action: "19 January: first national day" },
      undefined,
      { action: "31 January" },
      { action: "7 February" },
      { action: "16 February" },
      undefined,
      undefined,
      { action: "7 March: schools and transport shut" },
      { action: "11 March" },
      { action: "15 March" },
      { action: "23 March" },
      { action: "28 March" },
      { action: "6 April" },
      undefined,
      undefined,
      undefined,
      { action: "1 May" },
      undefined,
      undefined,
      undefined,
      { action: "6 June" },
    ],
  },
  bt: {
    short: "Bloquons tout",
    strip: "Bloquons tout",
    banner:
      "September 2025: blockades and marches, counted partially. Weeks without a published figure are left empty.",
    weeks: [
      { action: "10 September: blockades" },
      { action: "18 September: national day" },
      undefined,
      { action: "1 October" },
    ],
  },
  students26: {
    short: "Autumn 2026",
    strip: "Autumn 2026",
    banner:
      "The movement this page was built for, traced from the first mainland high-school blockades on 15 September. Daily publication, so days with no figure stay empty rather than interpolated.",
    weeks: [
      { action: "15 September: the Caen and Villeneuve-d'Ascq blockades" },
      { action: "25 September: Paris-area blockades" },
      { action: "Act I on 29 September, Act II on 1 October" },
      { action: "Act III on 6 October" },
      { action: "17 October: the peak" },
      { action: "24 October" },
      { action: "31 October" },
      { action: "5 and 7 November" },
      { action: "9 November — window ends 11 November" },
    ],
    fallbackNote: {
      p: "Weekly peak taken from the daily series — the peak day of the week.",
      a: "Sum of the published daily figures for the week; a cumulative stock is shown as the stock, never added to it.",
    },
  },
};

const EPISODES_FR: Record<string, EpisodeCopy> = {
  may68: {
    short: "Mai 68",
    strip: "Mai 68",
    banner:
      "Grève générale et occupations d’usines. Les foules syndicales et les décomptes ministériels diffèrent d’un facteur dix : les deux sont tracés.",
    weeks: [
      { action: "Manifestations du 1er mai" },
      {
        action: "Nuit des barricades, 10–11 mai",
        note: { i: "Chiffre publié comme plancher." },
      },
      { action: "Grève générale à partir du 13 mai" },
      {
        action: "24 mai : allocution du général de Gaulle",
        note: { a: "Bilan d’interpellations publié comme plancher." },
      },
      { action: "Accords de Grenelle, 27 mai" },
      { action: "Campagne des législatives" },
      undefined,
      undefined,
      undefined,
    ],
  },
  cpe: {
    short: "CPE 2006",
    strip: "CPE 2006",
    banner:
      "Contrat première embauche : mouvement lycéen et étudiant, avec deux journées interprofessionnelles. Les chiffres de maintien de l’ordre n’existent que pour quatre semaines.",
    weeks: [
      { action: "7 février : première journée nationale" },
      undefined,
      undefined,
      undefined,
      { action: "Universités bloquées" },
      { action: "14 mars : journée nationale" },
      { action: "21 mars : journée étudiante" },
      { action: "28 mars : journée nationale" },
      { action: "4 avril : journée nationale" },
      { action: "Retrait annoncé" },
    ],
  },
  gj: {
    short: "Gilets jaunes",
    strip: "Gilets jaunes",
    banner:
      "Compté acte par acte, le samedi uniquement. Les chiffres de maintien de l’ordre n’ont été publiés que pour les quatre premiers actes, jamais en série.",
    weeks: [],
  },
  nahel: {
    short: "Juin 2023",
    strip: "Juin 2023",
    banner:
      "Cinq nuits d’émeutes après la mort du 27 juin. Les interpellations et blessés sont élevés rapportés à la foule parce qu’il ne s’agissait pas de manifestations.",
    weeks: [
      { action: "27 juin : début des émeutes" },
      { action: "Retour au calme" },
    ],
  },
  pensions: {
    short: "Retraites 2023",
    strip: "Retraites 2023",
    banner:
      "Mouvement contre le report de l’âge légal. Deux journées portent l’essentiel de la série ; la fourchette intersyndicale est large.",
    weeks: [
      { action: "19 janvier : première journée nationale" },
      undefined,
      { action: "31 janvier" },
      { action: "7 février" },
      { action: "16 février" },
      undefined,
      undefined,
      { action: "7 mars : écoles et transports bloqués" },
      { action: "11 mars" },
      { action: "15 mars" },
      { action: "23 mars" },
      { action: "28 mars" },
      { action: "6 avril" },
      undefined,
      undefined,
      undefined,
      { action: "1er mai" },
      undefined,
      undefined,
      undefined,
      { action: "6 juin" },
    ],
  },
  bt: {
    short: "Bloquons tout",
    strip: "Bloquons tout",
    banner:
      "Septembre 2025 : blocages et défilés, décomptes partiels. Les semaines sans chiffre publié restent vides.",
    weeks: [
      { action: "10 septembre : blocages" },
      { action: "18 septembre : journée nationale" },
      undefined,
      { action: "1er octobre" },
    ],
  },
  students26: {
    short: "Automne 2026",
    strip: "Automne 2026",
    banner:
      "Le mouvement pour lequel cette page a été construite, suivi depuis les premiers blocages de lycées en métropole le 15 septembre. Publication quotidienne : les jours sans chiffre restent vides plutôt qu’interpolés.",
    weeks: [
      { action: "15 septembre : blocages de Caen et de Villeneuve-d’Ascq" },
      { action: "25 septembre : blocages dans l’agglomération parisienne" },
      { action: "Acte I le 29 septembre, acte II le 1er octobre" },
      { action: "Acte III le 6 octobre" },
      { action: "17 octobre : la pointe" },
      { action: "24 octobre" },
      { action: "31 octobre" },
      { action: "5 et 7 novembre" },
      { action: "9 novembre — fenêtre arrêtée au 11 novembre" },
    ],
    fallbackNote: {
      p: "Pointe hebdomadaire issue de la série quotidienne — le jour de pointe de la semaine.",
      a: "Somme des chiffres journaliers publiés de la semaine ; un stock cumulé est montré comme le stock, jamais additionné.",
    },
  },
};

/* ==================================================== catalogue: page + misc */

export interface DisclaimerCopy {
  readonly body: string;
}

export interface PanelsCopy {
  readonly partialWeek: string;
  readonly act: string;
  readonly withAction: string;
  readonly seriesContinues: string;
  readonly obs: string;
  readonly valueRange: string;
  readonly itemMeta: string;
  readonly median: string;
  readonly peak: string;
  readonly range: string;
  readonly figureCount: string;
  readonly singleFigure: string;
  /** Caption meta on section E panels. */
  readonly summaryMeta: string;
}

export interface KpiCopy {
  readonly heading: string;
  readonly largestDay: string;
  readonly largestWeek: string;
  readonly largestFigure: string;
  readonly vsMean: string;
  readonly vsMedian: string;
  readonly vsFirst: string;
  readonly againstMean: string;
  readonly againstMedian: string;
  readonly againstFirst: string;
  readonly noteDaily: string;
  readonly noteWeekly: string;
  readonly noteEpisodes: string;
  readonly noteEpisodesCapped: string;
  readonly eurM: string;
  readonly none: string;
}

export interface CasualtyCopy {
  readonly headlineTitle: string;
  readonly weeklyTitle: string;

  readonly colScope: string;
  readonly colTotal: string;
  readonly colSerious: string;
  readonly colLight: string;
  readonly colLightShare: string;
  readonly colOther: string;
  readonly colSide: string;
  readonly colCircumstance: string;
  readonly colCount: string;
  readonly colCases: string;
  readonly colQuestion: string;
  readonly colWindow: string;
  readonly colWeekly: string;

  readonly scope: Readonly<Record<string, string>>;
  readonly side: Readonly<Record<string, string>>;
  readonly kind: Readonly<Record<string, string>>;
  readonly why: Readonly<Record<string, string>>;
  readonly cases: Readonly<Record<string, string>>;

  readonly casesCount: string;
  readonly noCases: string;

  readonly capLevels: string;
  readonly capWeeks: string;
  readonly capCases: string;
  readonly capResolution: string;
  readonly noteLevels: string;
  readonly noteWeeks: string;

  readonly headLight: string;
  readonly headLightNote: string;
  readonly headMissingNote: string;

  readonly resolution: readonly {
    readonly label: string;
    readonly window: string;
    readonly weekly: string;
  }[];
}

export interface ItemCopy {
  readonly label: string;
  readonly short: string;
}

export interface TooltipCopy {
  readonly linePlain: string;
  readonly lineWithFlag: string;
  readonly firstFigure: string;
  readonly shareOfFirst: string;
  /** "Comparisons: {list}" — one compact line. */
  readonly shareComparisons: string;
  readonly cmpHighest: string;
  readonly cmpMean: string;
  readonly cmpMedian: string;
  readonly cmpFirst: string;
  /** Joins the last item: "a, b and c" / "a, b et c". */
  readonly listAnd: string;
}

export interface Catalogue {
  readonly chart: ChartCopy;
  readonly episodes: Readonly<Record<string, EpisodeCopy>>;
  readonly panels: PanelsCopy;
  readonly items: Readonly<Record<string, ItemCopy>>;
  readonly units: { readonly weeks: string };
  readonly flags: Readonly<Record<string, string>>;
  readonly tooltip: TooltipCopy;
  readonly disclaimer: DisclaimerCopy;
  readonly kpi: KpiCopy;
  readonly casualties: CasualtyCopy;
  /** Dictionary lookups; `t('key')` reads these. */
  readonly [key: string]: unknown;
}

const SPAN_SEP = { en: " – ", fr: " – " };

const CATALOGUE: Record<Lang, Catalogue> = {
  en: {
    chart: CHART_EN,
    episodes: EPISODES_EN,
    panels: {
      partialWeek: "Week of {label} (partial)",
      act: "Act {n}",
      withAction: "{when} · {action}",
      seriesContinues: "{name} (cont.)",
      obs: "observations {counts} over {weeks}",
      valueRange: "{lo}–{hi}",
      itemMeta: "range {range} · up to week {n}",
      median: "median",
      peak: "peak",
      range: "min–max range",
      figureCount: "{n} published figures",
      singleFigure:
        "one published figure — the median and the peak are the same number",
      summaryMeta: "median and peak · {n} movements",
    },
    kpi: {
      heading: "Key figures",
      largestDay: "Largest day",
      largestWeek: "Largest week",
      largestFigure: "Largest figure",
      vsMean: "Highest vs mean",
      vsMedian: "Highest vs median",
      vsFirst: "Highest vs first figure",
      againstMean: "{value} against a mean of {base}",
      againstMedian: "{value} against a median of {base}",
      againstFirst: "{value} against a first figure of {base}",
      noteDaily:
        "Ratios are computed on the daily series: each published figure is divided by the mean, the median and the first published figure of its own series. Days with no published figure are left out, not counted as zero. The €1,000M damages total of 24 October carries no marker on the chart and is left out here too.",
      noteWeekly:
        "Ratios are computed on the weekly series: each published figure is divided by the mean, the median and the first published figure of its own series. Weeks with no published figure are left out, not counted as zero.",
      noteEpisodes:
        "Each movement is compared with its own series — its mean, its median and its first published figure — and the largest ratio across all seven movements is shown. A ratio of the first figure can run into the thousands when a movement began with a handful of people.",
      noteEpisodesCapped:
        "As in section C, but over the weeks plotted in section D only, which stop at the last week with an enforcement figure.",
      eurM: "€{v}M",
      none: "no figure published",
    },
    casualties: {
      headlineTitle: "How the injuries divide",
      weeklyTitle: "What a week can establish",

      colScope: "Population",
      colTotal: "Declared total",
      colSerious: "Serious",
      colLight: "Light",
      colLightShare: "Light share",
      colOther: "Not classed light",
      colSide: "Side",
      colCircumstance: "Circumstance",
      colCount: "Count",
      colCases: "Documented cases",
      colQuestion: "Question",
      colWindow: "Smallest published window",
      colWeekly: "Weekly figure",

      scope: {
        crsOctober: "CRS, October 2026",
        forcesPeak: "All forces, running total at its peak",
        protesters: "Protesters, since 30 September",
        week12oct: "Week of 12 October",
        week19oct: "Week of 19 October",
        week26oct: "Week of 26 October",
        week2nov: "Week of 2 November",
      },
      side: {
        forces: "Police and gendarmerie",
        protesters: "Protesters",
      },
      kind: {
        accidental: "Accidental or self-inflicted",
        conflictual: "Inflicted in the confrontation",
      },
      why: {
        notPublished: "not published",
        noDenominator: "no published total",
        binaryFile: "file is light / not light only",
        noTally: "no count, cases only",
        noneDocumented: "none documented",
      },
      cases: {
        givors:
          "Givors, 10 October: two officers on patrol outside a school burned on the hand and thigh when a grenade fired accidentally inside their own vehicle, setting it alight.",
        crsWrist:
          "A CRS officer bruised his left wrist closing his own vehicle door.",
        crsAnkle:
          "Another CRS officer sprained his ankle falling out of a van.",
        helmet:
          "Paris, 31 October: a CRS officer struck on the helmet, found uninjured — a little paint removed from the shell.",
        groin2023:
          "Sainte-Soline, March 2023, for comparison: of the 29 gendarmes counted, one had a groin haematoma, one respiratory trauma, the rest were examined for acoustic trauma.",
        mael: "Tours, 30 September: a school student blinded in one eye by a rubber bullet, having thrown nothing.",
        alaric:
          "Paris, 17 October: a 19-year-old student burned on the torso and arm by a tear-gas grenade fired flat at him; second-degree burns, unhealed ten days later.",
        eyes: "Several other minors lost an eye in the same circumstances.",
        sainteSoline:
          "The official claim was 29 gendarmes injured, two in absolute emergency. The two were later described as a groin haematoma and respiratory trauma.",
      },

      casesCount: "{n} documented cases",
      noCases: "none documented",

      capLevels:
        "Severity, by the finest window each source publishes. Rows are different populations and different windows — they are never summed.",
      capWeeks:
        "Severity, by week. The increment is the difference between the running total at the start and the end of the week.",
      capCases:
        "Circumstance. No source counts this, so the column gives the number of documented cases, not a share.",
      capResolution:
        "The smallest window at which each breakdown exists, and whether a weekly figure can be derived from it.",
      noteLevels:
        "The 1,167 of 1,233 is the only published light share: 94.6%, the figure the file itself states. It covers CRS officers in October, so it cannot be extended to all forces or to the whole movement. The 7 serious injuries belong to the 1,144 consolidation of 17 October. No total for protester injuries has ever been published, so no share can be computed on that side — the serious cases are a register, not a rate. The four documented accidental injuries are four named people, not four per cent of anything.",
      noteWeeks:
        "The ministry publishes a running total, not a weekly severity breakdown. Splitting the total into weeks is arithmetic, and it reconciles exactly to 1,580, but the only light/not-light split that exists is the October CRS file, which spans four of these weeks and cannot be attributed to any one of them. That is why section A carries the breakdown and section B carries the increments.",
      headLight: "{light} of {total} declared injuries were classed light",
      headLightNote: "CRS officers, October 2026",
      headMissingNote:
        "No published total for protester injuries, so no share exists",

      resolution: [
        {
          label: "Light / serious split",
          window: "One month (October 2026), CRS only",
          weekly: "no",
        },
        {
          label: "Accidental / conflictual split",
          window: "None — named cases only",
          weekly: "no",
        },
        {
          label: "Running total of injured forces",
          window: "One day",
          weekly: "yes",
        },
        {
          label: "Daily increments",
          window: "One day",
          weekly: "yes",
        },
      ],
    },
    items: {
      p: { label: "Protesters", short: "Protesters" },
      a: { label: "Arrests", short: "Arrests" },
      f: { label: "Injured — security forces", short: "Forces injured" },
      i: { label: "Injured — protesters", short: "Protesters injured" },
    },
    units: { weeks: "week" },
    flags: {
      n: "",
      r: "regional",
      p: "partial",
      e: "modelled",
      f: "floor",
      c: "stock",
      w: "weekly",
      x: "wider measure",
    }, // en
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} · {flag}",
      firstFigure: "first published figure: {n}",
      shareOfFirst: "{pct} of the first figure ({n})",
      shareComparisons: "Comparisons: {list}",
      cmpHighest: "highest",
      cmpMean: "mean",
      cmpMedian: "median",
      cmpFirst: "first figure",
      listAnd: " and ",
    },
    disclaimer: {
      body: "Research and coding was performed using an LLM and figures have not been verified. Do not use them for serious analysis or decision-making without first double-checking the figures and the sources at the bottom.",
    },
  },
  fr: {
    chart: CHART_FR,
    episodes: EPISODES_FR,
    panels: {
      partialWeek: "Semaine du {label} (partielle)",
      act: "Acte {n}",
      withAction: "{when} · {action}",
      seriesContinues: "{name} (suite)",
      obs: "observations {counts} sur {weeks}",
      valueRange: "{lo}–{hi}",
      itemMeta: "fourchette {range} · jusqu’à la semaine {n}",
      median: "médiane",
      peak: "pointe",
      range: "fourchette min–max",
      figureCount: "{n} chiffres publiés",
      singleFigure:
        "un seul chiffre publié — la médiane et la pointe sont le même nombre",
      summaryMeta: "médiane et pointe · {n} mouvements",
    },
    kpi: {
      heading: "Chiffres clés",
      largestDay: "Plus grand jour",
      largestWeek: "Plus grande semaine",
      largestFigure: "Plus grand chiffre",
      vsMean: "Max vs moyenne",
      vsMedian: "Max vs médiane",
      vsFirst: "Max vs premier chiffre",
      againstMean: "{value} contre une moyenne de {base}",
      againstMedian: "{value} contre une médiane de {base}",
      againstFirst: "{value} contre un premier chiffre de {base}",
      noteDaily:
        "Les rapports sont calculés sur les séries quotidiennes : chaque chiffre publié est divisé par la moyenne, la médiane et le premier chiffre publié de sa propre série. Les jours sans chiffre publié sont écartés, non comptés comme zéro. Le total de dommages de 1 000 M€ du 24 octobre n’a pas de marqueur sur le graphique et en est donc écarté ici aussi.",
      noteWeekly:
        "Les rapports sont calculés sur les séries hebdomadaires : chaque chiffre publié est divisé par la moyenne, la médiane et le premier chiffre publié de sa propre série. Les semaines sans chiffre publié sont écartées, non comptées comme zéro.",
      noteEpisodes:
        "Chaque mouvement est comparé à sa propre série — sa moyenne, sa médiane et son premier chiffre publié — et le plus grand rapport sur les sept mouvements est affiché. Un rapport au premier chiffre peut atteindre des milliers de pour cent lorsqu’un mouvement a commencé avec une poignée de personnes.",
      noteEpisodesCapped:
        "Comme en section C, mais sur les seules semaines tracées en section D, qui s’arrêtent à la dernière semaine de chiffres de maintien de l’ordre.",
      eurM: "{v} M€",
      none: "aucun chiffre publié",
    },
    casualties: {
      headlineTitle: "Comment se répartissent les blessures",
      weeklyTitle: "Ce qu’une semaine peut établir",

      colScope: "Population",
      colTotal: "Total déclaré",
      colSerious: "Graves",
      colLight: "Légères",
      colLightShare: "Part de légères",
      colOther: "Non classées légères",
      colSide: "Camp",
      colCircumstance: "Circonstance",
      colCount: "Décompte",
      colCases: "Cas documentés",
      colQuestion: "Question",
      colWindow: "Plus petite fenêtre publiée",
      colWeekly: "Chiffre hebdomadaire",

      scope: {
        crsOctober: "CRS, octobre 2026",
        forcesPeak: "Toutes forces, cumul à son pic",
        protesters: "Manifestant·es, depuis le 30 septembre",
        week12oct: "Semaine du 12 octobre",
        week19oct: "Semaine du 19 octobre",
        week26oct: "Semaine du 26 octobre",
        week2nov: "Semaine du 2 novembre",
      },
      side: {
        forces: "Police et gendarmerie",
        protesters: "Manifestant·es",
      },
      kind: {
        accidental: "Accidentelle ou auto-infligée",
        conflictual: "Imputée à l’affrontement",
      },
      why: {
        notPublished: "non publié",
        noDenominator: "aucun total publié",
        binaryFile: "fichier binaire : léger / non léger",
        noTally: "aucun décompte, des cas seulement",
        noneDocumented: "aucun cas documenté",
      },
      cases: {
        givors:
          "Givors, 10 octobre : deux policiers en faction devant un lycée se brûlent à la main et à la cuisse quand une grenade part accidentellement dans leur propre véhicule, qui prend feu.",
        crsWrist:
          "Un CRS s’est contusionné le poignet gauche en fermant la portière de son véhicule.",
        crsAnkle: "Un autre CRS s’est tordu la cheville en chutant du fourgon.",
        helmet:
          "Paris, 31 octobre : un CRS touché au casque, indemne — un peu de peinture ôtée de la coque.",
        groin2023:
          "Sainte-Soline, mars 2023, pour comparaison : sur 29 gendarmes recensés, un hématome à l’aine, un traumatisme respiratoire, les autres examinés pour traumatismes sonores.",
        mael: "Tours, 30 septembre : un lycéen éborgné par une balle en caoutchouc, alors qu’il ne lançait rien.",
        alaric:
          "Paris, 17 octobre : un étudiant de 19 ans brûlé au torse et au bras par une grenade lacrymogène tirée en tir tendu ; brûlures au deuxième degré, non cicatrisées dix jours plus tard.",
        eyes: "Plusieurs autres mineurs ont perdu un œil dans les mêmes circonstances.",
        sainteSoline:
          "Le bilan officiel était de 29 gendarmes blessés, dont deux en urgence absolue. Les deux ont ensuite été décrits comme un hématome à l’aine et un traumatisme respiratoire.",
      },

      casesCount: "{n} cas documentés",
      noCases: "aucun cas documenté",

      capLevels:
        "Gravité, à la plus fine fenêtre publiée par chaque source. Les lignes sont des populations et des fenêtres différentes — elles ne s’additionnent jamais.",
      capWeeks:
        "Gravité, par semaine. L’incrément est la différence entre le cumul en début et en fin de semaine.",
      capCases:
        "Circonstance. Aucune source ne la dénombre : la colonne donne le nombre de cas documentés, non une part.",
      capResolution:
        "La plus petite fenêtre à laquelle chaque ventilation existe, et si un chiffre hebdomadaire peut en être tiré.",
      noteLevels:
        "Les 1 167 sur 1 233 constituent la seule part de blessés légers publiée : 94,6 %, le chiffre que le fichier énonce lui-même. Il porte sur les CRS en octobre : il ne s’étend ni à toutes les forces ni à tout le mouvement. Les 7 blessés graves relèvent de la consolidation de 1 144 du 17 octobre. Aucun total des blessures chez les manifestant·es n’a jamais été publié : aucune part ne peut donc être calculée de ce côté — les cas graves forment un registre, non un taux. Les quatre blessures accidentelles documentées sont quatre personnes nommées, non quatre pour cent de quoi que ce soit.",
      noteWeeks:
        "Le ministère publie un cumul, non une ventilation hebdomadaire de la gravité. Découper ce cumul en semaines est de l’arithmétique, et le total se recoupe exactement à 1 580, mais la seule ventilation léger / non léger existante est le fichier des CRS d’octobre, qui couvre quatre de ces semaines sans pouvoir être attribué à l’une d’elles. C’est pourquoi la section A porte la ventilation et la section B les incréments.",
      headLight: "{light} blessures déclarées sur {total} classées légères",
      headLightNote: "Agents des CRS, octobre 2026",
      headMissingNote:
        "Aucun total publié pour les blessures des manifestant·es : aucune part n’existe",

      resolution: [
        {
          label: "Ventilation léger / grave",
          window: "Un mois (octobre 2026), CRS seulement",
          weekly: "non",
        },
        {
          label: "Ventilation accidentelle / conflictuelle",
          window: "Aucune — des cas nommés seulement",
          weekly: "non",
        },
        {
          label: "Cumul des forces blessées",
          window: "Un jour",
          weekly: "oui",
        },
        {
          label: "Incréments quotidiens",
          window: "Un jour",
          weekly: "oui",
        },
      ],
    },
    items: {
      p: { label: "Manifestants", short: "Manifestants" },
      a: { label: "Interpellations", short: "Interpellations" },
      f: { label: "Blessés — forces de l’ordre", short: "Forces blessées" },
      i: { label: "Blessés — manifestants", short: "Manifestants blessés" },
    },
    units: { weeks: "semaine" },
    flags: {
      n: "",
      r: "régional",
      p: "partiel",
      e: "modélisé",
      f: "plancher",
      c: "stock",
      w: "hebdomadaire",
      x: "mesure plus large",
    }, // fr
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} · {flag}",
      firstFigure: "premier chiffre publié : {n}",
      shareOfFirst: "{pct} du premier chiffre ({n})",
      shareComparisons: "Comparaisons : {list}",
      cmpHighest: "le plus élevé",
      cmpMean: "moyenne",
      cmpMedian: "médiane",
      cmpFirst: "premier chiffre",
      listAnd: " et ",
    },
    disclaimer: {
      body: "La recherche et le code ont été réalisés à l’aide d’un LLM et les chiffres n’ont pas été vérifiés. Ne les utilisez pas pour une analyse sérieuse ou pour prendre des décisions sans avoir d’abord vérifié les chiffres et les sources en bas de page.",
    },
  },
};

/* ================================================================= lookups */

const DICT: Record<Lang, Record<string, string>> = {
  en: { "span.sep": SPAN_SEP.en },
  fr: { "span.sep": SPAN_SEP.fr },
};

const warned = new Set<string>();
function warnOnce(key: string, message: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[i18n] ${message}`);
}
const PASSTHROUGH = new Set([
  "then",
  "toJSON",
  "constructor",
  "length",
  "name",
  "toString",
  "valueOf",
  "hasOwnProperty",
  "inspect",
  "nodeType",
  "$$typeof",
  "prototype",
]);

const tolerant = new Map<Lang, Catalogue>();

/** Unknown branches warn once and yield '' rather than crashing a render. */
function catalogueFor(forLang: Lang): Catalogue {
  const cached = tolerant.get(forLang);
  if (cached) return cached;

  const proxy = new Proxy(CATALOGUE[forLang], {
    get(target, prop, receiver) {
      if (typeof prop !== "string" || prop in target || PASSTHROUGH.has(prop)) {
        return Reflect.get(target, prop, receiver);
      }
      const tag = `${forLang}:${prop}`;
      if (!warned.has(tag)) {
        warned.add(tag);
        console.warn(
          `[i18n] catalogue branch "${prop}" is missing (${forLang})`,
        );
      }
      return new Proxy({} as Record<string, unknown>, { get: () => "" });
    },
  }) as Catalogue;

  tolerant.set(forLang, proxy);
  return proxy;
}

/** No argument → the active catalogue. With a key → the dictionary string. */
export function t(): Catalogue;
export function t(key: string): string;
export function t(key: string, params: Record<string, string | number>): string;
export function t(
  key?: string,
  params?: Record<string, string | number>,
): string | Catalogue {
  if (key === undefined) return catalogueFor(current);

  const template = DICT[current][key] ?? DICT.en[key];
  if (template === undefined) {
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[i18n] missing key "${key}" (${current})`);
    }
    return key;
  }
  return params === undefined ? template : fill(template, params);
}

export function bi(value: Bi): string {
  return value[current] ?? value.en;
}

/* ============================================================== static copy */

type AttrName = "text" | "aria-label" | "title" | "placeholder";

const STATIC: Record<string, Bi> = {
  "hdr.kicker": {
    en: "15 Sep – 11 Nov 2026",
    fr: "15 sept. – 11 nov. 2026",
  },
  "hdr.title": {
    en: "Protest activity in France, autumn 2026",
    fr: "L’activité contestataire en France, automne 2026",
  },
  "hdr.lede": {
    en: "Turnout, arrests, injuries and damage, set against six earlier French movements. Every point is a range where the publishers disagree. The series starts on 15 September 2026, with the first mainland high-school blockades.",
    fr: "Foules, interpellations, blessés et dommages, comparés à six mouvements français antérieurs. Chaque point est une fourchette là où les éditeurs divergent. La série commence le 15 septembre 2026, avec les premiers blocages de lycées en métropole.",
  },
  "ui.lang": { en: "Language", fr: "Langue" },
  "ui.lang.fr": {
    en: "Afficher la page en français",
    fr: "Afficher la page en français",
  },
  "ui.lang.en": {
    en: "Show this page in English",
    fr: "Afficher la page en anglais",
  },
  "ui.theme": { en: "Dark mode", fr: "Mode sombre" },
  "card.prot.title": { en: "Protesters", fr: "Manifestants" },
  "card.prot.sub": {
    en: "Ministry and organiser counts",
    fr: "Comptages ministériels et syndicaux",
  },
  "card.enf.title": {
    en: "Arrests and injuries",
    fr: "Interpellations et blessés",
  },
  "card.enf.sub": {
    en: "Custody is not the same as arrest",
    fr: "La garde à vue n’est pas l’interpellation",
  },
  "card.cost.title": {
    en: "Damage and the cost of policing",
    fr: "Dommages et coût du maintien de l’ordre",
  },
  "card.pw.title": {
    en: "Protesters, weekly peak",
    fr: "Manifestants, pointe hebdomadaire",
  },
  "card.ew.title": {
    en: "Enforcement, weekly totals",
    fr: "Maintien de l’ordre, totaux hebdomadaires",
  },
  "leg.holiday.title": {
    en: "Dotted line = the Toussaint school holiday",
    fr: "Ligne en pointillés = les vacances de la Toussaint",
  },
  "leg.items.title": {
    en: "Highlight a measure",
    fr: "Mettre en avant une mesure",
  },
  "leg.movements.title": {
    en: "Highlight a movement",
    fr: "Mettre en avant un mouvement",
  },
  "hdr.skip": { en: "Skip to content", fr: "Aller au contenu" },
  "leg.summary.title": {
    en: "Highlight a statistic",
    fr: "Mettre en avant une statistique",
  },
};

for (const id of ["a", "b", "c", "d", "e"] as const) {
  STATIC[`sec.${id}.title`] = {
    en: EN_META.sections[id].title,
    fr: FR_META.sections[id].title,
  };
  STATIC[`sec.${id}.lede`] = {
    en: EN_META.sections[id].blurb,
    fr: FR_META.sections[id].blurb,
  };
}

STATIC["doc.title"] = { en: EN_META.meta.title, fr: FR_META.meta.title };

/** Flat key set, for the build-time guard. Must stay below all STATIC writes. */
export const STATIC_KEYS: ReadonlySet<string> = new Set(Object.keys(STATIC));

/** Resolves every `[data-i18n]` under root. Idempotent. */
export function applyStaticCopy(root: ParentNode = document): void {
  const L = current;

  for (const node of root.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = node.dataset.i18n;
    if (!key) continue;
    const entry = STATIC[key];
    if (!entry) {
      if (!warned.has(key)) {
        warned.add(key);
        console.warn(`[i18n] no static copy for "${key}"`);
      }
      continue;
    }
    const text = entry[L] ?? entry.en;
    const attr = node.dataset.i18nAttr as AttrName | undefined;
    if (!attr || attr === "text") node.textContent = text;
    else node.setAttribute(attr, text);
  }
}

/** Reflects the current language onto the segmented control. */
export function syncLangSwitch(root: ParentNode = document): void {
  for (const b of root.querySelectorAll<HTMLButtonElement>("[data-set-lang]")) {
    const on = b.dataset.setLang === current;
    b.setAttribute("aria-pressed", String(on));
    b.tabIndex = on ? 0 : -1;
  }
}

export interface A11yCopy {
  about: string;
  chart: string;
  chartRole: string;
  chartHint: string;
  tableCaption: string;
  dateHeader: string;
  weekHeader: string;
  switched: string;
}

const A11Y: Record<"fr" | "en", A11yCopy> = {
  en: {
    about: "Notes on this project",
    chart: "Chart",
    chartRole: "chart",
    chartHint:
      "Interactive chart. Use the left and right arrow keys to step through data points, Home and End for the ends, Escape to clear. A table of the same data follows the chart.",
    tableCaption: "Data for “{title}”",
    dateHeader: "Date",
    weekHeader: "Week",
    switched: "Page language: {lang}. Charts redrawn.",
  },
  fr: {
    about: "Notes sur ce projet",
    chart: "Graphique",
    chartRole: "graphique",
    chartHint:
      "Graphique interactif. Utilisez les flèches gauche et droite pour parcourir les points, Début et Fin pour les extrémités, Échap pour quitter. Un tableau des mêmes données suit le graphique.",
    tableCaption: "Données de « {title} »",
    dateHeader: "Date",
    weekHeader: "Semaine",
    switched: "Langue de la page : {lang}. Graphiques redessinés.",
  },
};

export const a11y = (): A11yCopy => A11Y[current];
