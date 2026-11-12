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

export type SectionId = "a" | "b" | "c" | "cp";

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
        "One marker per day on which something was published, from the first mainland high-school blockades on 15 September. Days with no figure stay empty rather than interpolated; gaps in a line are dashed.",
    },
    b: {
      title: "B · Weekly aggregates",
      blurb:
        "Weeks run Monday to Sunday, from the week of 14 September. A peak-day crowd and a summed weekly arrest count are not the same statistic — the tooltip says which is which.",
    },
    c: {
      title: "C · One panel per movement",
      blurb:
        "Each panel keeps its own time span on a shared logarithmic axis, so the shapes are comparable but the durations are not.",
      note: "Hollow markers are regional, Paris-only, modelled or stock figures. Dashed connectors span a week with nothing published.",
    },
    cp: {
      title: "C′ · Transposed: one panel per series",
      blurb:
        "The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks, capped at the last week with enforcement figures.",
      note: "Hover a measure or a movement to isolate it. Panel order matches legend order.",
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
        "Un marqueur par jour où un chiffre a été publié, à partir des premiers blocages de lycées en métropole le 15 septembre. Les jours sans chiffre restent vides plutôt qu’interpolés ; les lacunes d’une courbe sont en pointillés.",
    },
    b: {
      title: "B · Agrégats hebdomadaires",
      blurb:
        "Les semaines vont du lundi au dimanche, depuis la semaine du 14 septembre. Une foule de jour de pointe et un total hebdomadaire d’interpellations ne sont pas la même statistique — l’infobulle précise laquelle.",
    },
    c: {
      title: "C · Un panneau par mouvement",
      blurb:
        "Chaque panneau conserve sa propre durée sur un axe logarithmique commun : les formes sont comparables, les durées non.",
      note: "Les marqueurs creux sont des chiffres régionaux, parisiens, modélisés ou des stocks. Les liaisons en pointillés traversent une semaine sans publication.",
    },
    cp: {
      title: "C′ · Transposé : un panneau par série",
      blurb:
        "Les mêmes données avec les mouvements superposés, pour lire une même mesure de 1968 à 2026. L’axe des x est le nombre de semaines écoulées, arrêté à la dernière semaine de chiffres de maintien de l’ordre.",
      note: "Survolez une mesure ou un mouvement pour l’isoler. L’ordre des panneaux suit celui de la légende.",
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
    w: "", // the series label already says "weekly total"
    e: "modelled",
    f: "lower bound",
    r: "regional",
    p: "partial",
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
      "Act I. The crowd figure counts the public-service cortège the school actions joined, not a student crowd.",
    "2026-09-30":
      "The second day of Act I: 625 interpellations and 83 security forces injured.",
    "2026-10-01":
      "Act II, the peak of the first week. Arrests and injuries published with no turnout figure for the day.",
    "2026-10-02":
      "735 establishments still perturbed, and urban violence near 158 of them.",
    "2026-10-03":
      "No weekend figure was published; the arrests for 3–4 October are derived by subtraction.",
    "2026-10-05":
      "The first national school day after the break, with the ministry's stock figures.",
    "2026-10-06":
      "Act III — the first full national student demonstration of the movement.",
    "2026-10-13":
      "Turnout band spans a factor of three: ministry floor, organiser ceiling.",
    "2026-10-17":
      "The peak day. The damage band here is the 17–18 October IFRAP estimate, not a daily flow.",
    "2026-10-24":
      "Arrest figures include preventive stops; not all become custody placements.",
    "2026-10-31": "No protester-injury figure was published for this day.",
    "2026-11-05":
      "Turnout band runs from 575 000 to 1.6 million — the band is the disagreement, not an error bar.",
  },
  obsNotes: {
    "2026-09-25": {
      arrests: "Paris area only — Préfecture de Police figure, by midday.",
    },
    "2026-09-28": {
      protesterInjured:
        "One documented case: a 14-year-old hit by a police projectile. A floor, not a count.",
    },
    "2026-09-29": {
      turnout:
        "Counts the public-service cortège the school actions joined (206 000 ministry / 300 000 CGT), not a student crowd.",
      protesterInjured:
        "Students and education staff injured that day, counted by the Education ministry.",
    },
    "2026-09-30": {
      protesterInjured:
        "Cumulative since the first blockades — a stock, not a daily count.",
    },
    "2026-10-01": {
      forcesInjured:
        "Brackets a Wednesday cumulative level with a Thursday daily flow: a derived band, not a published count.",
      protesterInjured:
        "Cumulative level reached at the 1 October cut-off (170 students + 65 education staff) — a stock, not a daily count. Where a week ends on this cell, the level is the week’s figure, never the sum of the week’s flows.",
      damagesCost:
        "Part of the 1–8 October Île-de-France increment; the anchor of that run is 8 October.",
    },
    "2026-10-03": {
      arrests:
        "Derived by subtraction: the ministry's 6 059 since 28 September (published 5 October) less the published daily figures. Covers 3 and 4 October together.",
    },
    "2026-10-05": {
      arrests:
        "984 interpellations that day. The ministry's 6 059 since 28 September is the stock that makes the weekend figure checkable.",
    },
    "2026-10-06": {
      damagesCost:
        "Part of the 1–8 October Île-de-France increment; the anchor of that run is 8 October.",
    },
    "2026-10-08": {
      damagesCost:
        "Anchor of the 1–8 October Île-de-France damage increment. The same €6M is published for 6 October and is not counted twice.",
    },
    "2026-10-09": {
      arrests:
        "Justice Ministry judicial balance, cut off 8 Oct 17:00: 6,877 people placed in garde à vue since the start of the movement, 86% minors, 2,376 being prosecuted, 21 in detention. A different scope (since mid-September) and a different statistic (custodial placements, not interpellations) from the Interior Ministry's series — not reconcilable with it.",
    },
    "2026-10-10": {
      damagesCost:
        "National cumulative stock since mid-September, compiled by CNEWS from regional figures — no ministry published a national tally. Pannekoucke's parallel €25–30M estimate for Auvergne-Rhône-Alpes is NOT included, so this is neither a floor nor additive with the regional figures.",
    },
    "2026-10-12": {
      arrests:
        "13 interpellations reported independently by the Rhône prefecture (27 établissements touched) and the Bas-Rhin prefecture in Strasbourg. Two prefectures, the same number — so 13 is a floor for the day, not the day's regional total. Not Paris.",
      protesterInjured:
        "Île-de-France only: a proviseur, a parent d'élève and a Région employee injured. Counted as education and local-authority staff, on the same basis as the 29 September ministry figure.",
      damagesCost:
        'Normandy — Hervé Morin, Conseil régional de Normandie, at the regional assembly, 12 Oct: "1,5 million en Normandie" out of "d\'ores et déjà 30 millions d\'euros" nationally. A cumulative regional stock, not a daily flow, and a component of the national stock — never added to it. Île-de-France\'s own revised total the same day was €8.5M.',
    },
    "2026-10-13": {
      damagesCost:
        "Local estimate carried from the original research — the Ardèche prefecture reported no damage, so it comes from elsewhere.",
    },
    "2026-10-17": {
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
    },
    "2026-10-31": {
      damagesCost: "Local estimate — no national damage figure was published.",
    },
    "2026-11-05": {
      protesterInjured: 'Published as a floor: "at least this many".',
    },
    "2026-11-09": {
      arrests: "Regional prefecture figures only — Bordeaux, Lyon, Strasbourg.",
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
    "2026-10-12": "estimated, Paris area",
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
  weekExcluded: "{n} point{s} excluded (regional or subset)", // CHART_EN  weekFloored: "includes a floor — not a sum",
  weekClipped: "week clipped by the window",
  weekJoin: " · ",
  tooltipRange: "{label}: {mid} (band {low}–{high})",
  tooltipPoint: "{label}: {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "ⓘ {note}",
  series: {
    protestersDaily: {
      label: "Protesters",
      detached: "Protesters (detached figure)",
    },
    arrestsDaily: { label: "Arrests", detached: "Arrests (detached figure)" },
    forcesDaily: {
      label: "Injured — security forces",
      detached: "Injured forces (detached figure)",
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
      title: "Protesters, daily",
      subtitle: "Ministry and organiser counts, one marker per published day",
      y: "Protesters",
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
      title: "Protesters, weekly peak",
      subtitle: "Peak day of each week, not a weekly sum",
      y: "Protesters (peak day)",
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
      "Acte I. Le chiffre de foule compte le cortège de la fonction publique rejoint par les actions lycée, pas une foule étudiante.",
    "2026-09-30":
      "Deuxième jour de l’acte I : 625 interpellations et 83 blessés des forces de l’ordre.",
    "2026-10-01":
      "Acte II, la pointe de la première semaine. Interpellations et blessés publiés sans chiffre de foule pour la journée.",
    "2026-10-02":
      "735 établissements encore perturbés, et des violences urbaines près de 158 d’entre eux.",
    "2026-10-03":
      "Aucun chiffre de week-end n’a été publié ; les interpellations des 3–4 octobre sont dérivées par soustraction.",
    "2026-10-05":
      "Première journée nationale scolaire après les vacances, avec les stocks ministériels.",
    "2026-10-06":
      "Acte III — première manifestation étudiante nationale de plein exercice.",
    "2026-10-07":
      "The Interior Ministry suspended the use of stun grenades for the student mobilisations, after a lycée student was injured at Lens.",
    "2026-10-09":
      "Justice Ministry publishes its first judicial balance: 6,877 in garde à vue since mid-September.",
    "2026-10-10":
      "CNEWS compiles a national damage bill of €30M — with no ministry tally behind it.",
    "2026-10-13":
      "La fourchette de foule va du simple au triple : plancher ministériel, plafond syndical.",
    "2026-10-17":
      "La journée de pointe. La fourchette de dommages ici est l’estimation IFRAP des 17–18 octobre, non un flux quotidien.",
    "2026-10-24":
      "Les interpellations incluent les contrôles préventifs ; toutes ne deviennent pas des gardes à vue.",
    "2026-10-31":
      "Aucun chiffre de blessés parmi les manifestants n’a été publié ce jour-là.",
    "2026-11-05":
      "La fourchette de foule va de 575 000 à 1,6 million — la fourchette est la divergence, pas une barre d’erreur.",
  },
  obsNotes: {
    "2026-09-25": {
      arrests:
        "Région parisienne uniquement — chiffres de la préfecture de police, à midi.",
    },
    "2026-09-28": {
      protesterInjured:
        "Un cas documenté : un garçon de 14 ans touché par un projectile de police. Un plancher, pas un décompte.",
    },
    "2026-09-29": {
      turnout:
        "Compte le cortège de la fonction publique rejoint par les actions lycée (206 000 ministère / 300 000 CGT), pas une foule étudiante.",
      protesterInjured:
        "Élèves et personnels de l’éducation blessés ce jour-là, comptés par le ministère de l’Éducation.",
    },
    "2026-09-30": {
      protesterInjured:
        "Cumul depuis les premiers blocages — un stock, pas un décompte quotidien.",
    },
    "2026-10-01": {
      forcesInjured:
        "Encadre un niveau cumulé du mercredi et un flux quotidien du jeudi : une fourchette dérivée, pas un chiffre publié.",
      protesterInjured:
        "Niveau cumulé atteint à l’arrêt du 1er octobre (170 élèves + 65 personnels de l’éducation) — un stock, pas un décompte quotidien. Lorsqu’une semaine se termine sur cette cellule, le niveau est le chiffre de la semaine, jamais la somme des flux de la semaine.",
      damagesCost:
        "Une part de l’incrément francilien du 1er au 8 octobre ; l’ancrage de cette série est le 8 octobre.",
    },
    "2026-10-03": {
      arrests:
        "Dérivé par soustraction : les 6 059 interpellations depuis le 28 septembre (publiés le 5 octobre) moins les chiffres journaliers publiés. Couvre les 3 et 4 octobre ensemble.",
    },
    "2026-10-05": {
      arrests:
        "984 interpellations ce jour-là. Le stock ministériel de 6 059 depuis le 28 septembre est ce qui rend vérifiable le chiffre du week-end.",
    },
    "2026-10-06": {
      damagesCost:
        "Une part de l’incrément francilien du 1er au 8 octobre ; l’ancrage de cette série est le 8 octobre.",
    },
    "2026-10-08": {
      damagesCost:
        "Ancrage de l’incrément de dommages francilien du 1er au 8 octobre. Les mêmes 6 M€ sont publiés au 6 octobre et ne sont pas comptés deux fois.",
    },
    "2026-10-12": {
      arrests: "Chiffre régional uniquement — décompte de préfecture.",
    },
    "2026-10-13": {
      damagesCost:
        "Estimation locale reprise de la recherche initiale — la préfecture de l’Ardèche a signalé aucun dommage.",
    },
    "2026-10-17": {
      protesterInjured:
        "Fourchette dérivée : le plancher est le registre des blessures graves, le plafond est extrapolé à partir des soins dispensés par les street-medics. Aucun décompte officiel n’existe.",
      damagesCost:
        "Estimation modélisée de l’IFRAP pour le week-end des 17–18 octobre ; hors chiffre d’affaires perdu et coûts de maintien de l’ordre. L’estimation parisienne publiée le 18 octobre en est un sous-ensemble, exclue de la somme hebdomadaire.",
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
    },
    "2026-11-05": {
      protesterInjured: "Publié comme plancher : « au moins ». ",
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
  weekExcluded: "{n} point{s} exclu(s) (régional ou sous-ensemble)", // CHART_FR  weekFloored: "comprend un plancher — pas une somme",
  weekClipped: "semaine tronquée par la fenêtre",
  weekJoin: " · ",
  tooltipRange: "{label} : {mid} (fourchette {low}–{high})",
  tooltipPoint: "{label} : {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "ⓘ {note}",
  series: {
    protestersDaily: {
      label: "Manifestants",
      detached: "Manifestants (chiffre écarté de la courbe)",
    },
    arrestsDaily: {
      label: "Interpellations",
      detached: "Interpellations (chiffre écarté)",
    },
    forcesDaily: {
      label: "Blessés — forces de l’ordre",
      detached: "Forces blessées (chiffre écarté)",
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
      title: "Manifestants, par jour",
      subtitle:
        "Comptages ministériels et syndicaux, un marqueur par jour publié",
      y: "Manifestants",
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
      title: "Manifestants, pointe hebdomadaire",
      subtitle: "Jour de pointe de chaque semaine, pas une somme hebdomadaire",
      y: "Manifestants (jour de pointe)",
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
  readonly strong: string;
  readonly lead: string;
  readonly links: string[];
  readonly hrefs: string[];
  readonly tail: string;
}

export interface SourceItemCopy {
  readonly label: string;
  readonly href: string;
  readonly what: string;
  readonly when?: string;
}

export interface SourceGroupCopy {
  readonly heading: string;
  readonly items: readonly SourceItemCopy[];
}

export interface SourcesCopy {
  readonly title: string;
  readonly intro: string;
  readonly groups: readonly SourceGroupCopy[];
  readonly foot: string;
}

export interface PanelsCopy {
  readonly partialWeek: string;
  readonly act: string;
  readonly withAction: string;
  readonly seriesContinues: string;
  readonly obs: string;
  readonly valueRange: string;
  readonly itemMeta: string;
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
  readonly sources: SourcesCopy;
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
    }, // en
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} · {flag}",
      firstFigure: "first published figure: {n}",
      shareOfFirst: "{pct} of the first figure ({n})",
    },
    disclaimer: {
      strong: "AI-assisted draft.",
      lead: " These charts were assembled with a language model and have not been independently verified. Do not use them for serious analysis, publication or decision-making without checking every figure against the sources. The full conversation, including every rejected figure, is in the transcript.",
      links: [
        "initial development",
        "adding comparisons and translation",
        "reviewing code",
        "reviewing sources",
      ],
      hrefs: [
        "transcript-1.md",
        "transcript-2.md",
        "transcript-3.md",
        "transcript-4.md",
      ],
      tail: "",
    },
    sources: {
      title: "Sources and method",
      intro:
        "Every series traces to a publisher below. Where publishers disagree the chart carries a range instead of a point: the range is the disagreement, not an error bar. Hollow markers are regional, Paris-only, modelled or stock figures and are never joined to the national line.",
      groups: [
        {
          heading: "2026 movement — the September phase",
          items: [
            {
              label:
                "Ouest-France — the first mainland blockade, Le Rheu, 7 September",
              href: "https://www.ouest-france.fr/bretagne/le-rheu-35650/cours-tardifs-ou-par-correspondance-classes-surchargees-ces-lyceens-bloquent-leur-etablissement-pres-de-rennes-5cb2156e-aac0-11f1-9556-770e8387e7e9",
              what: "the movement's origin point, before the window opens",
            },
            {
              label:
                "Actu — the Caen and Villeneuve-d'Ascq blockades, 15 September",
              href: "https://actu.fr/normandie/caen_14118/un-lycee-bloque-par-des-eleves-a-caen-ils-denoncent-une-mauvaise-organisation-interne_64794136.html",
              what: "the first days inside the chart window",
            },
            {
              label:
                "Franceinfo — how a few school blockades became a national movement",
              href: "https://www.franceinfo.fr/societe/education/blocage-des-lycees/la-mobilisation-a-pris-une-ampleur-inattendue-comment-le-mouvement-de-blocage-des-lycees-s-est-propage-en-france_8216054.html",
              what: "the chronology of September, including Créteil",
            },
            {
              label:
                "Ouest-France — 21 interpellations in the Paris area, 25 September",
              href: "https://www.ouest-france.fr/education/ecole/apres-des-blocus-dans-des-lycees-dile-de-france-21-personnes-ont-ete-interpellees-7d16e80e-b8b0-11f1-8a73-5c5c9f666d13",
              what: "the only figure before the national turn",
            },
            {
              label:
                "Le Monde — 338 establishments concerned, Act I, 29 September",
              href: "https://www.lemonde.fr/societe/article/2026/09/29/blocages-des-lycees-338-etablissements-concernes-et-dix-blesses-selon-le-ministere-de-l-education-nationale_6785573_3225.html",
              what: "Act I: establishments, injuries and arrests",
            },
            {
              label: "Le Monde — 625 interpellations, 30 September",
              href: "https://www.lemonde.fr/societe/article/2026/09/30/blocage-des-lycees-625-interpellations-mercredi-annonce-le-ministre-de-l-interieur-qui-constate-une-extension-du-mouvement_6786023_3225.html",
              what: "the second day of Act I",
            },
            {
              label:
                "Le Figaro — the daily arrest figures, 1, 2, 5 and 6 October",
              href: "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-lyceens-et-etudiants-appellent-ce-jeudi-a-un-acte-deux-de-mobilisation-20261001",
              what: "Act II and Act III",
            },
            {
              label: "Wikipédia — the full dated chronology of the movement",
              href: "https://fr.wikipedia.org/wiki/Mouvement_lyc%C3%A9en_et_%C3%A9tudiant_de_2026_en_France",
              what: "the spine of the September rows",
            },
          ],
        },
        {
          heading: "2026 movement — official counts",
          items: [
            {
              label: "Ministry of the Interior — weekly protest tallies",
              href: "https://www.interieur.gouv.fr",
              what: "national turnout, arrests, officer injuries",
            },
            {
              label: "Prefecture of police of Paris",
              href: "https://www.prefecturedepolice.interieur.gouv.fr",
              what: "Paris-only arrest figures",
              when: "2026-10-18",
            },
            {
              label: "Ministry of Justice — custody and prosecutions",
              href: "https://www.justice.gouv.fr",
              what: "the custody/arrest distinction",
            },
            {
              label: "CGT and the inter-union collective",
              href: "https://www.cgt.fr",
              what: "the upper bound of every turnout range",
            },
          ],
        },
        {
          heading: "2026 movement — damage and its cost",
          items: [
            {
              label: "IFRAP — cost of the 17–18 October damage",
              href: "https://www.ifrap.org",
              what: "the €244–866M material-damage band",
            },
            {
              label: "CCI France — damaged-shop census",
              href: "https://www.cci.fr",
              what: "shop counts behind the weekly increments",
            },
            {
              label: "Prefecture of Île-de-France",
              href: "https://www.iledefrance.gouv.fr",
              what: "the €1M damage stock — a stock, not a daily flow",
            },
          ],
        },
        {
          heading: "Earlier movements, 1968–2025",
          items: [
            {
              label: "May 1968 — encyclopaedic summary of published counts",
              href: "https://fr.wikipedia.org/wiki/Mai_68",
              what: "crowd counts, arrests, injuries",
            },
            {
              label: "CPE 2006 — student and school movement",
              href: "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
              what: "four weeks of published figures",
            },
            {
              label: "Gilets jaunes, acts 1–44",
              href: "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
              what: "ministry counts compiled act by act",
            },
            {
              label: "Riots of June 2023",
              href: "https://fr.wikipedia.org/wiki/%C3%89meutes_de_2023_en_France",
              what: "arrests and injuries over five nights",
            },
            {
              label: "Pension reform, 2023",
              href: "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023",
              what: "the inter-union turnout range",
            },
            {
              label: "« Bloquons tout », 2025",
              href: "https://fr.wikipedia.org/wiki/Bloquons_tout",
              what: "blockades and partial counts",
            },
          ],
        },
      ],
      foot: "Historical episodes come from encyclopaedic summaries, not primary archives. Read them as orders of magnitude. Policing cost is modelled: officers deployed × €136–1 133 per officer-day. The deployment figures for September and early October are estimates, flagged as such in the tooltip; the movement total is €54–630M.",
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
    }, // fr
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} · {flag}",
      firstFigure: "premier chiffre publié : {n}",
      shareOfFirst: "{pct} du premier chiffre ({n})",
    },
    disclaimer: {
      strong: "Brouillon assisté par IA.",
      lead: " Ces graphiques ont été produits avec un modèle de langage et n’ont pas été vérifiés de façon indépendante. Ne les utilisez pas pour une analyse sérieuse, une publication ou une décision sans vérifier chaque chiffre auprès des sources. La conversation complète, y compris chaque chiffre écarté, figure dans la transcription: ",
      links: [
        "développement initial",
        "ajout de comparaisons et de traductions",
        "revue du code",
        "examen des sources",
      ],
      hrefs: [
        "transcript-1.md",
        "transcript-2.md",
        "transcript-3.md",
        "transcript-4.md",
      ],
      tail: "",
    },
    sources: {
      title: "Sources et méthode",
      intro:
        "Chaque série est rattachée à un éditeur ci-dessous. Lorsque deux éditeurs divergent, le graphique affiche une fourchette plutôt qu’un point : la fourchette est la divergence, pas une barre d’erreur. Les marqueurs creux sont régionaux, parisiens, modélisés ou des stocks, et ne sont jamais reliés à la courbe nationale.",
      groups: [
        {
          heading: "Mouvement 2026 — la phase de septembre",
          items: [
            {
              label:
                "Ouest-France — le tout premier blocus en métropole, Le Rheu, 7 septembre",
              href: "https://www.ouest-france.fr/bretagne/le-rheu-35650/cours-tardifs-ou-par-correspondance-classes-surchargees-ces-lyceens-bloquent-leur-etablissement-pres-de-rennes-5cb2156e-aac0-11f1-9556-770e8387e7e9",
              what: "le point d’origine du mouvement, avant l’ouverture de la fenêtre",
            },
            {
              label:
                "Actu — les blocages de Caen et de Villeneuve-d’Ascq, 15 septembre",
              href: "https://actu.fr/normandie/caen_14118/un-lycee-bloque-par-des-eleves-a-caen-ils-denoncent-une-mauvaise-organisation-interne_64794136.html",
              what: "les premiers jours à l’intérieur de la fenêtre",
            },
            {
              label:
                "Franceinfo — comment quelques blocages de lycées sont devenus un mouvement d’ampleur",
              href: "https://www.franceinfo.fr/societe/education/blocage-des-lycees/la-mobilisation-a-pris-une-ampleur-inattendue-comment-le-mouvement-de-blocage-des-lycees-s-est-propage-en-france_8216054.html",
              what: "la chronologie de septembre, avec Créteil",
            },
            {
              label:
                "Ouest-France — 21 interpellations dans l’agglomération parisienne, 25 septembre",
              href: "https://www.ouest-france.fr/education/ecole/apres-des-blocus-dans-des-lycees-dile-de-france-21-personnes-ont-ete-interpellees-7d16e80e-b8b0-11f1-8a73-5c5c9f666d13",
              what: "le seul chiffre avant le tournant national",
            },
            {
              label:
                "Le Monde — 338 établissements concernés, acte I, 29 septembre",
              href: "https://www.lemonde.fr/societe/article/2026/09/29/blocages-des-lycees-338-etablissements-concernes-et-dix-blesses-selon-le-ministere-de-l-education-nationale_6785573_3225.html",
              what: "acte I : établissements, blessés et interpellations",
            },
            {
              label: "Le Monde — 625 interpellations, 30 septembre",
              href: "https://www.lemonde.fr/societe/article/2026/09/30/blocage-des-lycees-625-interpellations-mercredi-annonce-le-ministre-de-l-interieur-qui-constate-une-extension-du-mouvement_6786023_3225.html",
              what: "le deuxième jour de l’acte I",
            },
            {
              label:
                "Le Figaro — les chiffres journaliers d’interpellations, 1er, 2, 5 et 6 octobre",
              href: "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-lyceens-et-etudiants-appellent-ce-jeudi-a-un-acte-deux-de-mobilisation-20261001",
              what: "acte II et acte III",
            },
            {
              label: "Wikipédia — la chronologie datée complète du mouvement",
              href: "https://fr.wikipedia.org/wiki/Mouvement_lyc%C3%A9en_et_%C3%A9tudiant_de_2026_en_France",
              what: "l’axe sur lequel sont posées les lignes de septembre",
            },
          ],
        },
        {
          heading: "Mouvement 2026 — décomptes officiels",
          items: [
            {
              label: "Ministère de l’Intérieur — bilans hebdomadaires",
              href: "https://www.interieur.gouv.fr",
              what: "foules nationales, interpellations, blessés parmi les forces",
            },
            {
              label: "Préfecture de police de Paris",
              href: "https://www.prefecturedepolice.interieur.gouv.fr",
              what: "interpellations parisiennes",
              when: "2026-10-18",
            },
            {
              label: "Ministère de la Justice — gardes à vue et poursuites",
              href: "https://www.justice.gouv.fr",
              what: "la distinction garde à vue / interpellation",
            },
            {
              label: "CGT et l’intersyndicale",
              href: "https://www.cgt.fr",
              what: "la borne haute de chaque fourchette de foule",
            },
          ],
        },
        {
          heading: "Mouvement 2026 — dommages et coût",
          items: [
            {
              label: "IFRAP — coût des dommages des 17–18 octobre",
              href: "https://www.ifrap.org",
              what: "la fourchette 244–866 M€ de dommages matériels",
            },
            {
              label: "CCI France — recensement des commerces sinistrés",
              href: "https://www.cci.fr",
              what: "les décomptes qui fondent les incréments hebdomadaires",
            },
            {
              label: "Préfecture de la région Île-de-France",
              href: "https://www.iledefrance.gouv.fr",
              what: "le stock de 1 M€ — un stock, pas un flux quotidien",
            },
          ],
        },
        {
          heading: "Mouvements antérieurs, 1968–2025",
          items: [
            {
              label: "Mai 1968 — synthèse encyclopédique des décomptes",
              href: "https://fr.wikipedia.org/wiki/Mai_68",
              what: "foules, interpellations, blessés",
            },
            {
              label: "CPE 2006 — mouvement lycéen et étudiant",
              href: "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
              what: "quatre semaines de chiffres publiés",
            },
            {
              label: "Gilets jaunes, actes 1 à 44",
              href: "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
              what: "décomptes ministériels compilés acte par acte",
            },
            {
              label: "Émeutes de juin 2023",
              href: "https://fr.wikipedia.org/wiki/%C3%89meutes_de_2023_en_France",
              what: "interpellations et blessés sur cinq nuits",
            },
            {
              label: "Réforme des retraites, 2023",
              href: "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023",
              what: "la fourchette intersyndicale de foule",
            },
            {
              label: "« Bloquons tout », 2025",
              href: "https://fr.wikipedia.org/wiki/Bloquons_tout",
              what: "blocages et décomptes partiels",
            },
          ],
        },
      ],
      foot: "Les épisodes historiques proviennent de synthèses encyclopédiques, non d’archives primaires. À lire comme des ordres de grandeur. Le coût du maintien de l’ordre est modélisé : agents déployés × 136–1 133 € par agent-jour. Les dispositifs de septembre et de début octobre sont des estimations, signalées comme telles dans l’infobulle ; le total du mouvement est de 54 à 630 M€.",
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
    en: "Working draft · 15 Sep – 11 Nov 2026",
    fr: "Document de travail · 15 sept. – 11 nov. 2026",
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
  "leg.items.title": {
    en: "Highlight a measure",
    fr: "Mettre en avant une mesure",
  },
  "leg.movements.title": {
    en: "Highlight a movement",
    fr: "Mettre en avant un mouvement",
  },
};

for (const id of ["a", "b", "c", "cp"] as const) {
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
