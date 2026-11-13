// src/client/i18n.ts
var EN_META = {
  tag: "en-GB",
  label: "English",
  meta: {
    htmlLang: "en",
    title: "Protest activity in France \u2014 September\u2013November 2026",
    description: "Turnout, arrests, injuries and damage in the autumn 2026 movement, set against six earlier French movements."
  },
  sections: {
    a: {
      title: "A \xB7 Daily counts, 15 September \u2013 11 November 2026",
      blurb: "One marker per day on which something was published. Days with no figure stay empty rather than interpolated; gaps in a line are dashed. The school-blockade line is dotted across the Toussaint holiday, when no lyc\xE9e was in session."
    },
    b: {
      title: "B \xB7 Weekly aggregates",
      blurb: "Weeks run Monday to Sunday. A peak-day crowd and a summed weekly arrest count are not the same statistic \u2014 the tooltip says which is which. The weekly blockade figure is a peak, never a sum: the same lyc\xE9e is blocked on several consecutive days."
    },
    c: {
      title: "C \xB7 One panel per movement",
      blurb: "Each panel keeps its own time span on a shared logarithmic axis, so the shapes are comparable but the durations are not.",
      note: "Hollow markers are regional, Paris-only, modelled or stock figures. Dashed connectors span a week with nothing published."
    },
    cp: {
      title: "C\u2032 \xB7 Transposed: one panel per series",
      blurb: "The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks, capped at the last week with enforcement figures.",
      note: "Hover a measure or a movement to isolate it. Panel order matches legend order."
    }
  }
};
var FR_META = {
  tag: "fr-FR",
  label: "Fran\xE7ais",
  meta: {
    htmlLang: "fr",
    title: "L\u2019activit\xE9 contestataire en France \u2014 septembre\u2013novembre 2026",
    description: "Foules, interpellations, bless\xE9s et dommages du mouvement de l\u2019automne 2026, compar\xE9s \xE0 six mouvements fran\xE7ais ant\xE9rieurs."
  },
  sections: {
    a: {
      title: "A \xB7 D\xE9comptes quotidiens, 15 septembre \u2013 11 novembre 2026",
      blurb: "Un marqueur par jour o\xF9 un chiffre a \xE9t\xE9 publi\xE9. Les jours sans chiffre restent vides plut\xF4t qu\u2019interpol\xE9s ; les lacunes d\u2019une courbe sont en pointill\xE9s. La courbe des blocages de lyc\xE9es est en pointill\xE9s pendant les vacances de la Toussaint, aucun lyc\xE9e n\u2019\xE9tant en cours."
    },
    b: {
      title: "B \xB7 Agr\xE9gats hebdomadaires",
      blurb: "Les semaines vont du lundi au dimanche. Une foule de jour de pointe et un total hebdomadaire d\u2019interpellations ne sont pas la m\xEAme statistique \u2014 l\u2019infobulle pr\xE9cise laquelle. Le chiffre hebdomadaire des blocages est une pointe, jamais une somme : un m\xEAme lyc\xE9e est bloqu\xE9 plusieurs jours de suite."
    },
    c: {
      title: "C \xB7 Un panneau par mouvement",
      blurb: "Chaque panneau conserve sa propre dur\xE9e sur un axe logarithmique commun : les formes sont comparables, les dur\xE9es non.",
      note: "Les marqueurs creux sont des chiffres r\xE9gionaux, parisiens, mod\xE9lis\xE9s ou des stocks. Les liaisons en pointill\xE9s traversent une semaine sans publication."
    },
    cp: {
      title: "C\u2032 \xB7 Transpos\xE9 : un panneau par s\xE9rie",
      blurb: "Les m\xEAmes donn\xE9es avec les mouvements superpos\xE9s, pour lire une m\xEAme mesure de 1968 \xE0 2026. L\u2019axe des x est le nombre de semaines \xE9coul\xE9es, arr\xEAt\xE9 \xE0 la derni\xE8re semaine de chiffres de maintien de l\u2019ordre.",
      note: "Survolez une mesure ou un mouvement pour l\u2019isoler. L\u2019ordre des panneaux suit celui de la l\xE9gende."
    }
  }
};
var LOCALES = Object.freeze([
  "fr",
  "en"
]);
var LOCALE_META = {
  en: EN_META,
  fr: FR_META
};
function localeMeta(locale = current) {
  return LOCALE_META[normalizeLocale(locale) ?? DEFAULT_LANG];
}
var DEFAULT_LANG = "fr";
var DEFAULT_LOCALE = FR_META.tag;
var STORAGE_KEY = "lang";
var hasDom = () => typeof window !== "undefined" && typeof document !== "undefined";
function normalizeLocale(input) {
  const low = String(input ?? "").toLowerCase().replace(/_/g, "-");
  if (low === "fr" || low.startsWith("fr-") || low === "fran\xE7ais" || low === "francais")
    return "fr";
  if (low === "en" || low.startsWith("en-")) return "en";
  return null;
}
function localeFromUrl(search) {
  if (search === void 0 && !hasDom()) return null;
  try {
    const q = search ?? window.location.search;
    return normalizeLocale(new URLSearchParams(q).get("lang"));
  } catch {
    return null;
  }
}
function fromStorage() {
  if (!hasDom()) return null;
  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}
var current = localeFromUrl() ?? fromStorage() ?? DEFAULT_LANG;
var version = 0;
function getLocale() {
  return current;
}
var listeners = /* @__PURE__ */ new Set();
var emitting = false;
function onLocaleChange(fn) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function emit(next, previous) {
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
function setLang(next, opts = {}) {
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
      }
    }
    document.documentElement.lang = locale.meta.htmlLang;
    document.documentElement.dataset.lang = target;
  }
  if (notify) emit(target, previous);
  return current;
}
var TOKEN = /\{(\w+)\}/g;
function fill(template, params) {
  if (!params) return template;
  const p = typeof params.n === "number" && params.s === void 0 ? { ...params, s: params.n === 1 ? "" : "s" } : params;
  return template.replace(
    TOKEN,
    (whole, name) => name in p ? String(p[name]) : whole
  );
}
function plural(a, b, c) {
  if (typeof a === "string") {
    const n = typeof b === "number" ? b : 0;
    return Math.abs(n) === 1 ? a : c ?? `${a}s`;
  }
  const isOne = Math.abs(a) === 1;
  if (typeof b !== "string") return isOne ? "" : "s";
  return isOne ? b : c ?? `${b}s`;
}
var numFmt;
var cptFmt;
var eurFmt;
var dateFmt;
function buildFormats(tag2) {
  numFmt = new Intl.NumberFormat(tag2, { maximumFractionDigits: 0 });
  cptFmt = new Intl.NumberFormat(tag2, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  });
  eurFmt = new Intl.NumberFormat(tag2, { maximumFractionDigits: 1 });
  dateFmt = {
    long: new Intl.DateTimeFormat(tag2, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }),
    short: new Intl.DateTimeFormat(tag2, {
      day: "numeric",
      month: "short",
      timeZone: "UTC"
    }),
    day: new Intl.DateTimeFormat(tag2, { day: "numeric", timeZone: "UTC" })
  };
}
buildFormats(localeMeta(current).tag);
var nf = () => numFmt;
var compact = () => cptFmt;
var eurM = () => eurFmt;
var DATE_LONG = {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC"
};
var DATE_SHORT = {
  day: "numeric",
  month: "short",
  timeZone: "UTC"
};
var DAY_ONLY = {
  day: "numeric",
  timeZone: "UTC"
};
var dsLong = new Intl.DateTimeFormat(EN_META.tag, DATE_LONG);
var dsShort = new Intl.DateTimeFormat(EN_META.tag, DATE_SHORT);
var dsDay = new Intl.DateTimeFormat(EN_META.tag, DAY_ONLY);
var dsLang = null;
function refreshDates() {
  if (dsLang === current) return;
  dsLang = current;
  const tag2 = localeMeta(current).tag;
  dsLong = new Intl.DateTimeFormat(tag2, DATE_LONG);
  dsShort = new Intl.DateTimeFormat(tag2, DATE_SHORT);
  dsDay = new Intl.DateTimeFormat(tag2, DAY_ONLY);
}
function toDate(value2) {
  if (value2 instanceof Date)
    return Number.isNaN(value2.getTime()) ? null : value2;
  if (typeof value2 === "number") {
    const d2 = new Date(value2);
    return Number.isNaN(d2.getTime()) ? null : d2;
  }
  if (typeof value2 !== "string" || value2.trim() === "") return null;
  const d = new Date(value2);
  return Number.isNaN(d.getTime()) ? null : d;
}
function firstOfMonth(s, d) {
  return current === "fr" && d.getUTCDate() === 1 ? s.replace(/^1\b/, "1er") : s;
}
function fmtDate(value2) {
  refreshDates();
  const d = toDate(value2);
  return d ? firstOfMonth(dsLong.format(d), d) : "\u2014";
}
function fmtDayMonth(value2) {
  refreshDates();
  const d = toDate(value2);
  return d ? firstOfMonth(dsShort.format(d), d) : "\u2014";
}
function fmtWeek(start, end) {
  refreshDates();
  const a = toDate(start);
  if (!a) return "\u2014";
  if (end === void 0) return firstOfMonth(dsShort.format(a), a);
  const b = toDate(end);
  if (!b) return firstOfMonth(dsShort.format(a), a);
  const sameYear = a.getUTCFullYear() === b.getUTCFullYear();
  const sameMonth = sameYear && a.getUTCMonth() === b.getUTCMonth();
  if (sameMonth) return `${firstOfMonth(dsDay.format(a), a)}\u2013${fmtDayMonth(b)}`;
  if (sameYear) return `${fmtDayMonth(a)} \u2013 ${fmtDayMonth(b)}`;
  return `${fmtDayMonth(a)} ${a.getUTCFullYear()} \u2013 ${fmtDayMonth(b)} ${b.getUTCFullYear()}`;
}
var ISO_ANY = /\d{4}-\d{2}-\d{2}/;
var ISO_ALL = /\b(\d{4}-\d{2}-\d{2})\b/g;
function fmtSpan(span, end) {
  const sep = t("span.sep");
  if (typeof span === "string") {
    if (end !== void 0) return `${fmtDayMonth(span)}${sep}${fmtDate(end)}`;
    return ISO_ANY.test(span) ? span.replace(ISO_ALL, (m) => fmtDayMonth(m)) : span;
  }
  if (typeof span === "number" || span instanceof Date) {
    return end !== void 0 ? `${fmtDayMonth(span)}${sep}${fmtDate(end)}` : fmtDate(span);
  }
  if (span.label) return span.label;
  if (span.start != null && span.end != null) {
    return `${fmtDayMonth(span.start)}${sep}${fmtDate(span.end)}`;
  }
  if (span.start != null) return fmtDate(span.start);
  if (span.end != null) return fmtDate(span.end);
  return "\u2014";
}
var MINUTE = 6e4;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var CHART_EN = {
  axisDate: "Date",
  axisWeek: "Week",
  edgeMark: "\u2020",
  weekOf: "Week of {date}",
  weekOfPartial: "Week of {date} (partial)",
  eurM: "\u20AC{v}M",
  suffix: {
    c: "stock",
    w: "",
    e: "modelled",
    f: "lower bound",
    r: "regional",
    p: "partial",
    x: "wider measure",
    n: "",
    regional: "regional"
  },
  suffixWrap: " \xB7 {text}",
  dayNotes: {
    "2026-09-25": "Paris-area figure only: 21 interpellations by midday, announced by the Pr\xE9fecture de Police.",
    "2026-09-28": "The movement goes national \u2014 actions in Marseille, Lille, the Rh\xF4ne, the Var and the Alpes-Maritimes.",
    "2026-09-29": "Act I. The crowd figure counts the public-service cort\xE8ge the school actions joined, not a student crowd.",
    "2026-09-30": "The second day of Act I: 625 interpellations and 83 security forces injured. The Education ministry counted 356 establishments concerned; no count of fully blocked schools was published that day.",
    "2026-10-01": "Act II, the peak of the first week. Arrests and injuries published with no turnout figure for the day.",
    "2026-10-02": "735 establishments still perturbed, and urban violence near 158 of them.",
    "2026-10-03": "No weekend figure was published; the arrests for 3\u20134 October are derived by subtraction. 735 establishments perturbed \u2014 a wider measure than blockades, so the point is flagged as such.",
    "2026-10-05": "The first national school day after the break, with the ministry's stock figures.",
    "2026-10-06": "Act III \u2014 the first full national student demonstration of the movement.",
    "2026-10-07": "The Interior Ministry suspended the use of stun grenades for the student mobilisations, after a lyc\xE9e student was injured at Lens.",
    "2026-10-09": "Justice Ministry publishes its first judicial balance: 6,877 in garde \xE0 vue since mid-September.",
    "2026-10-10": "CNEWS compiles a national damage bill of \u20AC30M \u2014 with no ministry tally behind it.",
    "2026-10-13": "Turnout band spans a factor of three: ministry floor, organiser ceiling.",
    "2026-10-16": "Last day of classes before the Toussaint holiday: from 17 October no lyc\xE9e is in session, so the blockade count stops.",
    "2026-10-17": "The peak day. The damage band here is the 17\u201318 October IFRAP estimate, not a daily flow. Toussaint holiday \u2014 schools closed.",
    "2026-10-19": "Toussaint holiday \u2014 students supported the lyc\xE9e movement from outside the schools.",
    "2026-10-24": "Arrest figures include preventive stops; not all become custody placements. Toussaint holiday \u2014 the mobilisation was an inter-union day, not a school day.",
    "2026-10-31": "No protester-injury figure was published for this day. Toussaint holiday \u2014 inter-union mobilisation.",
    "2026-11-01": "Last day of the Toussaint holiday.",
    "2026-11-04": "In the Rh\xF4ne, seven establishments ran in remote mode; no lyc\xE9e was reported blocked.",
    "2026-11-05": "Turnout band runs from 575 000 to 1.6 million \u2014 the band is the disagreement, not an error bar.",
    "2026-11-06": "In the Rh\xF4ne, 16 lyc\xE9es and two colleges saw incidents, and a lyc\xE9e in Lyon's 8th arrondissement was blocked when it was cleared.",
    "2026-11-09": "In the Rh\xF4ne, no lyc\xE9e was blocked: 14 ran in remote mode and 11 were reported as affected. A zero cannot be plotted on a logarithmic axis, so it is recorded here rather than as a point.",
    "2026-11-10": "In the Rh\xF4ne, about ten establishments were affected."
  },
  obsNotes: {
    "2026-09-15": {
      blockades: "The lyc\xE9e Victor-Hugo in Caen \u2014 the first mainland blockade. Villeneuve-d'Ascq was blocked on 14 September and Le Rheu on 7 September, both before the window opens."
    },
    "2026-09-19": {
      blockades: "Lyc\xE9e Saint-Exup\xE9ry in Cr\xE9teil: students backed the teachers' strike with the school's first blockade \u2014 the origin of the national movement."
    },
    "2026-09-23": {
      blockades: "\xCEle-de-France only: the Cr\xE9teil rectorate counted the blockades spreading to about ten lyc\xE9es."
    },
    "2026-09-25": {
      arrests: "Paris area only \u2014 Pr\xE9fecture de Police figure, by midday."
    },
    "2026-09-28": {
      protesterInjured: "One documented case: a 14-year-old hit by a police projectile. A floor, not a count.",
      blockades: "Interior Ministry: 27 complete blockades, out of 180 establishments perturbed."
    },
    "2026-09-29": {
      turnout: "Counts the public-service cort\xE8ge the school actions joined (206 000 ministry / 300 000 CGT), not a student crowd.",
      protesterInjured: "Students and education staff injured that day, counted by the Education ministry.",
      blockades: "Education ministry at the time of its balance: 45 schools blocked out of 338 concerned. Le Monde counted actions at nearly 410 establishments."
    },
    "2026-09-30": {
      protesterInjured: "Cumulative since the first blockades \u2014 a stock, not a daily count."
    },
    "2026-10-01": {
      forcesInjured: "Brackets a Wednesday cumulative level with a Thursday daily flow: a derived band, not a published count.",
      protesterInjured: "Cumulative level reached at the 1 October cut-off (170 students + 65 education staff) \u2014 a stock, not a daily count. Where a week ends on this cell, the level is the week\u2019s figure, never the sum of the week\u2019s flows.",
      damagesCost: "Part of the 1\u20138 October \xCEle-de-France increment; the anchor of that run is 8 October.",
      blockades: "Low end: 222 schools blocked (Le Monde live, out of 1,027 establishments concerned). High end: the Union \xE9tudiante's 640. The police counted 169 blockades in the morning, and 900 actions with 400 closures by the end of the day."
    },
    "2026-10-02": {
      blockades: "'More than 400 schools blocked' (Le Monde live). The Interior Ministry's own tally for 2 October: 1,027 lyc\xE9es concerned, more than 560 perturbed, 400 closed."
    },
    "2026-10-03": {
      arrests: "Derived by subtraction: the ministry's 6 059 since 28 September (published 5 October) less the published daily figures. Covers 3 and 4 October together.",
      blockades: "Wider measure: the Education ministry counted 735 establishments perturbed, not schools fully blocked. The highest blocked count that week was 400+ on 2 October."
    },
    "2026-10-05": {
      arrests: "984 interpellations that day. The ministry's 6 059 since 28 September is the stock that makes the weekend figure checkable.",
      blockades: "Wider measure: 400 to 500 establishments closed (government spokeswoman), more than 400 to stay closed. The ministry's morning count was 413 establishments perturbed."
    },
    "2026-10-06": {
      damagesCost: "Part of the 1\u20138 October \xCEle-de-France increment; the anchor of that run is 8 October.",
      blockades: "Wider measure: 891 of the 3,700 schools had their classes suspended, totally or partially, at midday (ministry). The USL counted 1,800 schools '\xE0 l'arr\xEAt' \u2014 a union figure that also includes administratively closed schools."
    },
    "2026-10-08": {
      damagesCost: "Anchor of the 1\u20138 October \xCEle-de-France damage increment. The same \u20AC6M is published for 6 October and is not counted twice.",
      blockades: "Wider measure: 224 establishments closed (ministry); more than 150 still perturbed (franceinfo). The 224 figure is the benchmark the ministry quotes back on 13 October."
    },
    "2026-10-09": {
      arrests: "Justice Ministry judicial balance, cut off 8 Oct 17:00: 6,877 people placed in garde \xE0 vue since the start of the movement, 86% minors, 2,376 being prosecuted, 21 in detention. A different scope (since mid-September) and a different statistic (custodial placements, not interpellations) from the Interior Ministry's series \u2014 not reconcilable with it."
    },
    "2026-10-10": {
      damagesCost: "National cumulative stock since mid-September, compiled by CNEWS from regional figures \u2014 no ministry published a national tally. Pannekoucke's parallel \u20AC25\u201330M estimate for Auvergne-Rh\xF4ne-Alpes is NOT included, so this is neither a floor nor additive with the regional figures.",
      blockades: "'More than 40 schools blocked' (AFP/Reuters, 10 October)."
    },
    "2026-10-12": {
      arrests: "13 interpellations reported independently by the Rh\xF4ne prefecture (27 \xE9tablissements touched) and the Bas-Rhin prefecture in Strasbourg. Two prefectures, the same number \u2014 so 13 is a floor for the day, not the day's regional total. Not Paris.",
      protesterInjured: "\xCEle-de-France only: a proviseur, a parent d'\xE9l\xE8ve and a R\xE9gion employee injured. Counted as education and local-authority staff, on the same basis as the 29 September ministry figure.",
      damagesCost: `Normandy \u2014 Herv\xE9 Morin, Conseil r\xE9gional de Normandie, at the regional assembly, 12 Oct: "1,5 million en Normandie" out of "d'ores et d\xE9j\xE0 30 millions d'euros" nationally. A cumulative regional stock, not a daily flow, and a component of the national stock \u2014 never added to it. \xCEle-de-France's own revised total the same day was \u20AC8.5M.`,
      blockades: "Rh\xF4ne prefecture only: 19 of the 27 establishments affected were lyc\xE9es (six universities, two colleges). \xCEle-de-France counted nearly 80 lyc\xE9es perturbed the same day."
    },
    "2026-10-13": {
      blockades: "Wider measure: 214 establishments closed, 94.2% of lyc\xE9es open \u2014 against 224 on 8 October. The ministry called the movement 'en recul'."
    },
    "2026-10-17": {
      protesterInjured: "Derived band: the floor is the serious-injury register, the ceiling is extrapolated from street-medics treatment counts. No official count exists.",
      damagesCost: "IFRAP modelled estimate for the 17\u201318 October weekend; excludes lost turnover and order-maintenance costs. The Paris-only estimate published for 18 October is a subset of it and is excluded from the weekly sum."
    },
    "2026-10-18": {
      arrests: "Prefecture of police of Paris figure only \u2014 curfew day.",
      damagesCost: "Paris-only subset of the 17\u201318 October IFRAP total \u2014 never added to it."
    },
    "2026-10-20": {
      arrests: "Guadeloupe prefecture figures only \u2014 regional."
    },
    "2026-10-24": {
      damagesCost: "CCI France's national tally for 17\u201324 October \u2014 a superset of the 17 October cell, never added to it."
    },
    "2026-10-31": {
      damagesCost: "Local estimate \u2014 no national damage figure was published."
    },
    "2026-11-02": {
      blockades: "Education ministry at 9.30: 41 lyc\xE9es blocked, about 1% of the country's 3,700, with no perturbation in three quarters of the departments."
    },
    "2026-11-03": {
      blockades: "Education ministry: 48 schools blocked. The USL counted nearly 500."
    },
    "2026-11-05": {
      protesterInjured: 'Published as a floor: "at least this many".',
      blockades: "Matignon at 10.00: 81 establishments blocked (2.2%). The USL counted 1,000 schools '\xE0 l'arr\xEAt' \u2014 blocked or administratively closed, so an upper bound. The Education ministry counted 33% of establishments perturbed."
    },
    "2026-11-09": {
      arrests: "Regional prefecture figures only \u2014 Bordeaux, Lyon, Strasbourg."
    }
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
    "2026-10-12": "estim\xE9 \u2014 \xCEle-de-France, Lyon et Strasbourg",
    "2026-10-13": "deployment estimated",
    "2026-10-17": "deployment published",
    "2026-10-18": "estimated \u2014 Paris curfew",
    "2026-10-24": "deployment published",
    "2026-10-31": "deployment published",
    "2026-11-05": "deployment published",
    "2026-11-07": "deployment published"
  },
  policingDay: "{head} officers \xD7 {low}\u2013{high} per officer-day \xB7 {note}",
  policingDayPlain: "{head} officers \xD7 {low}\u2013{high} per officer-day",
  cumulativeAdded: "deployment counted this day \u2014 {days} so far",
  cumulativeCarried: "no deployment published \u2014 cumulative carried forward",
  weekNational: "{n} day{s} counted",
  weekRegionalOnly: "{n} day{s}, regional only",
  weekPeak: "peak {date}",
  weekNoNational: "no national figure this week",
  weekExcluded: "{n} point{s} excluded (regional or subset)",
  weekFloored: "includes a floor \u2014 not a sum",
  weekClipped: "week clipped by the window",
  weekJoin: " \xB7 ",
  tooltipRange: "{label}: {mid} (band {low}\u2013{high})",
  tooltipPoint: "{label}: {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "\u24D8 {note}",
  weekVacation: "partly inside the Toussaint holiday (17 Oct \u2013 1 Nov)",
  holidayLine: "Dotted line: the Toussaint holiday, 17 October \u2013 1 November 2026. No lyc\xE9e was in session, so no school could be blocked \u2014 the count did not exist, it was not zero.",
  metricNote: "Schools blocked or closed: establishments where pupils could not attend normally. The band runs from the official count to the union count, and the union's figure also includes administratively closed schools.",
  blockerNote: "A wider measure than blockades \u2014 establishments perturbed, with classes suspended, or closed \u2014 used where it is the only figure published that day.",
  series: {
    protestersDaily: {
      label: "Protesters",
      detached: "Protesters (detached figure)"
    },
    blockadesDaily: {
      label: "Schools blocked",
      detached: "Schools blocked (regional count)"
    },
    arrestsDaily: { label: "Arrests", detached: "Arrests (detached figure)" },
    forcesDaily: {
      label: "Injured \u2014 security forces",
      detached: "Injured forces (detached figure)"
    },
    protestersInjuredDaily: {
      label: "Injured \u2014 protesters",
      detached: "Injured protesters (detached figure)"
    },
    damagesDaily: {
      label: "Material damage",
      detached: "Damage (stock or modelled figure)"
    },
    policingDaily: {
      label: "Policing cost, per day",
      detached: "Policing cost, per day (modelled)"
    },
    policingCumulative: {
      label: "Policing cost, cumulative",
      detached: "Policing cost, cumulative (modelled)"
    },
    protestersWeekly: {
      label: "Protesters (weekly peak)",
      detached: "Protesters (regional week)"
    },
    blockadesWeekly: {
      label: "Schools blocked (weekly peak)",
      detached: "Schools blocked (regional week)"
    },
    arrestsWeekly: {
      label: "Arrests (weekly total)",
      detached: "Arrests (regional week)"
    },
    forcesWeekly: {
      label: "Forces injured (weekly total)",
      detached: "Forces injured (regional week)"
    },
    protestersInjuredWeekly: {
      label: "Protesters injured (weekly total)",
      detached: "Protesters injured (regional week)"
    }
  },
  charts: {
    protestersDaily: {
      title: "Protesters and blocked schools, daily",
      subtitle: "Crowd counts on the left axis, school blockades on the right. The dotted line is the Toussaint holiday",
      y: "Protesters",
      yRight: "Schools blocked or closed"
    },
    enforcementDaily: {
      title: "Arrests and injuries, daily",
      subtitle: "Arrests are not custody placements; injuries are counted per side",
      y: "People"
    },
    cost: {
      title: "Damage and the cost of policing",
      subtitle: "",
      y: "\u20AC millions"
    },
    protestersWeekly: {
      title: "Protesters and blocked schools, weekly peak",
      subtitle: "Peak day of each week, not a weekly sum \u2014 the same lyc\xE9e is blocked on several consecutive days",
      y: "Protesters (peak day)",
      yRight: "Schools blocked or closed (peak)"
    },
    enforcementWeekly: {
      title: "Enforcement, weekly totals",
      subtitle: "Weekly sums; a stock or a floor is not additive",
      y: "People (weekly total)"
    }
  }
};
var CHART_FR = {
  axisDate: "Date",
  axisWeek: "Semaine",
  edgeMark: "\u2020",
  weekOf: "Semaine du {date}",
  weekOfPartial: "Semaine du {date} (partielle)",
  eurM: "{v} M\u20AC",
  suffix: {
    c: "stock",
    w: "",
    e: "mod\xE9lis\xE9",
    f: "borne inf\xE9rieure",
    r: "r\xE9gional",
    p: "partiel",
    x: "mesure plus large",
    n: "",
    regional: "r\xE9gional"
  },
  suffixWrap: " \xB7 {text}",
  dayNotes: {
    "2026-09-25": "Chiffre de la r\xE9gion parisienne uniquement : 21 interpellations \xE0 midi, annonc\xE9es par la pr\xE9fecture de police.",
    "2026-09-28": "Le mouvement prend une dimension nationale \u2014 actions \xE0 Marseille, Lille, dans le Rh\xF4ne, le Var et les Alpes-Maritimes.",
    "2026-09-29": "Acte I. Le chiffre de foule compte le cort\xE8ge de la fonction publique rejoint par les actions lyc\xE9e, pas une foule \xE9tudiante.",
    "2026-09-30": "Deuxi\xE8me jour de l\u2019acte I : 625 interpellations et 83 bless\xE9s des forces de l\u2019ordre. Le minist\xE8re de l\u2019\xC9ducation compte 356 \xE9tablissements concern\xE9s ; aucun d\xE9compte de lyc\xE9es enti\xE8rement bloqu\xE9s n\u2019a \xE9t\xE9 publi\xE9 ce jour-l\xE0.",
    "2026-10-01": "Acte II, la pointe de la premi\xE8re semaine. Interpellations et bless\xE9s publi\xE9s sans chiffre de foule pour la journ\xE9e.",
    "2026-10-02": "735 \xE9tablissements encore perturb\xE9s, et des violences urbaines pr\xE8s de 158 d\u2019entre eux.",
    "2026-10-03": "Aucun chiffre de week-end n\u2019a \xE9t\xE9 publi\xE9 ; les interpellations des 3\u20134 octobre sont d\xE9riv\xE9es par soustraction. 735 \xE9tablissements perturb\xE9s \u2014 une mesure plus large que les blocages ; le point est signal\xE9 comme tel.",
    "2026-10-05": "Premi\xE8re journ\xE9e nationale scolaire apr\xE8s les vacances, avec les stocks minist\xE9riels.",
    "2026-10-06": "Acte III \u2014 premi\xE8re manifestation \xE9tudiante nationale de plein exercice.",
    "2026-10-13": "La fourchette de foule va du simple au triple : plancher minist\xE9riel, plafond syndical.",
    "2026-10-16": "Dernier jour de cours avant les vacances de la Toussaint : \xE0 partir du 17 octobre aucun lyc\xE9e n\u2019est en cours, le d\xE9compte des blocages s\u2019interrompt.",
    "2026-10-17": "La journ\xE9e de pointe. La fourchette de dommages ici est l\u2019estimation IFRAP des 17\u201318 octobre, non un flux quotidien. Vacances de la Toussaint \u2014 \xE9tablissements ferm\xE9s. ",
    "2026-10-19": "Vacances de la Toussaint \u2014 les \xE9tudiants soutiennent le mouvement lyc\xE9een depuis l\u2019ext\xE9rieur des \xE9tablissements.",
    "2026-10-24": "Les interpellations incluent les contr\xF4les pr\xE9ventifs ; toutes ne deviennent pas des gardes \xE0 vue. Vacances de la Toussaint \u2014 la mobilisation \xE9tait une journ\xE9e interprofessionnelle, pas une journ\xE9e scolaire.",
    "2026-10-31": "Aucun chiffre de bless\xE9s parmi les manifestants n\u2019a \xE9t\xE9 publi\xE9 ce jour-l\xE0. Vacances de la Toussaint \u2014 mobilisation interprofessionnelle.",
    "2026-11-01": "Dernier jour des vacances de la Toussaint.",
    "2026-11-04": "Dans le Rh\xF4ne, sept \xE9tablissements ont fait cours \xE0 distance ; aucun lyc\xE9e n\u2019est signal\xE9 comme bloqu\xE9.",
    "2026-11-05": "La fourchette de foule va de 575 000 \xE0 1,6 million \u2014 la fourchette est la divergence, pas une barre d\u2019erreur.",
    "2026-11-06": "Dans le Rh\xF4ne, incidents dans 16 lyc\xE9es et deux coll\xE8ges, et un lyc\xE9e du 8e arrondissement de Lyon bloqu\xE9 lors de son \xE9vacuation.",
    "2026-11-09": "Dans le Rh\xF4ne, aucun lyc\xE9e n\u2019est bloqu\xE9 : 14 fonctionnent \xE0 distance et 11 sont signal\xE9s comme touch\xE9s. Un z\xE9ro ne peut pas \xEAtre port\xE9 sur un axe logarithmique, il est donc consign\xE9 ici et non comme point.",
    "2026-11-10": "Dans le Rh\xF4ne, une dizaine d\u2019\xE9tablissements sont touch\xE9s."
  },
  obsNotes: {
    "2026-09-15": {
      blockades: "Le lyc\xE9e Victor-Hugo de Caen \u2014 le premier blocus en m\xE9tropole. Villeneuve-d\u2019Ascq avait \xE9t\xE9 bloqu\xE9 le 14 septembre et Le Rheu le 7 septembre, avant l\u2019ouverture de la fen\xEAtre."
    },
    "2026-09-19": {
      blockades: "Lyc\xE9e Saint-Exup\xE9ry de Cr\xE9teil : les \xE9l\xE8ves soutiennent la gr\xE8ve des enseignants par le premier blocus de l\u2019\xE9tablissement \u2014 l\u2019origine du mouvement national."
    },
    "2026-09-23": {
      blockades: "\xCEle-de-France uniquement : selon le rectorat de Cr\xE9teil, les blocus s\u2019\xE9tendent rapidement \xE0 une dizaine de lyc\xE9es."
    },
    "2026-09-25": {
      arrests: "R\xE9gion parisienne uniquement \u2014 chiffres de la pr\xE9fecture de police, \xE0 midi."
    },
    "2026-09-28": {
      protesterInjured: "Un cas document\xE9 : un gar\xE7on de 14 ans touch\xE9 par un projectile de police. Un plancher, pas un d\xE9compte.",
      blockades: "Minist\xE8re de l\u2019Int\xE9rieur : 27 blocages totaux, sur 180 \xE9tablissements perturb\xE9s."
    },
    "2026-09-29": {
      turnout: "Compte le cort\xE8ge de la fonction publique rejoint par les actions lyc\xE9e (206 000 minist\xE8re / 300 000 CGT), pas une foule \xE9tudiante.",
      protesterInjured: "\xC9l\xE8ves et personnels de l\u2019\xE9ducation bless\xE9s ce jour-l\xE0, compt\xE9s par le minist\xE8re de l\u2019\xC9ducation.",
      blockades: "Minist\xE8re de l\u2019\xC9ducation au moment de son bilan : 45 lyc\xE9es bloqu\xE9s sur 338 concern\xE9s. Le Monde recense des actions dans pr\xE8s de 410 \xE9tablissements."
    },
    "2026-09-30": {
      protesterInjured: "Cumul depuis les premiers blocages \u2014 un stock, pas un d\xE9compte quotidien."
    },
    "2026-10-01": {
      forcesInjured: "Encadre un niveau cumul\xE9 du mercredi et un flux quotidien du jeudi : une fourchette d\xE9riv\xE9e, pas un chiffre publi\xE9.",
      protesterInjured: "Niveau cumul\xE9 atteint \xE0 l\u2019arr\xEAt du 1er octobre (170 \xE9l\xE8ves + 65 personnels de l\u2019\xE9ducation) \u2014 un stock, pas un d\xE9compte quotidien. Lorsqu\u2019une semaine se termine sur cette cellule, le niveau est le chiffre de la semaine, jamais la somme des flux de la semaine.",
      damagesCost: "Une part de l\u2019incr\xE9ment francilien du 1er au 8 octobre ; l\u2019ancrage de cette s\xE9rie est le 8 octobre.",
      blockades: "Borne basse : 222 lyc\xE9es bloqu\xE9s (Le Monde en direct, sur 1 027 \xE9tablissements concern\xE9s). Borne haute : les 640 de l\u2019Union \xE9tudiante. La police comptait 169 blocages le matin, et 900 actions avec 400 fermetures en fin de journ\xE9e."
    },
    "2026-10-02": {
      blockades: "\xAB Plus de 400 lyc\xE9es bloqu\xE9s \xBB (Le Monde en direct). Le d\xE9compte du minist\xE8re de l\u2019Int\xE9rieur pour le 2 octobre : 1 027 lyc\xE9es concern\xE9s, plus de 560 perturb\xE9s, 400 ferm\xE9s."
    },
    "2026-10-03": {
      arrests: "D\xE9riv\xE9 par soustraction : les 6 059 interpellations depuis le 28 septembre (publi\xE9s le 5 octobre) moins les chiffres journaliers publi\xE9s. Couvre les 3 et 4 octobre ensemble.",
      blockades: "Mesure plus large : le minist\xE8re de l\u2019\xC9ducation compte 735 \xE9tablissements perturb\xE9s, et non des lyc\xE9es enti\xE8rement bloqu\xE9s. Le plus haut d\xE9compte de blocages de la semaine est de 400+ le 2 octobre."
    },
    "2026-10-05": {
      arrests: "984 interpellations ce jour-l\xE0. Le stock minist\xE9riel de 6 059 depuis le 28 septembre est ce qui rend v\xE9rifiable le chiffre du week-end.",
      blockades: "Mesure plus large : 400 \xE0 500 \xE9tablissements ferm\xE9s (porte-parole du gouvernement), plus de 400 doivent le rester. Le comptage de mi-matin du minist\xE8re est de 413 \xE9tablissements perturb\xE9s."
    },
    "2026-10-06": {
      damagesCost: "Une part de l\u2019incr\xE9ment francilien du 1er au 8 octobre ; l\u2019ancrage de cette s\xE9rie est le 8 octobre.",
      blockades: "Mesure plus large : 891 \xE9tablissements sur 3 700 ont eu leurs cours suspendus, totalement ou partiellement, \xE0 la mi-journ\xE9e (minist\xE8re). L\u2019USL compte 1 800 lyc\xE9es \xAB \xE0 l\u2019arr\xEAt \xBB \u2014 un d\xE9compte syndical qui inclut aussi les lyc\xE9es ferm\xE9s administrativement."
    },
    "2026-10-08": {
      damagesCost: "Ancrage de l\u2019incr\xE9ment de dommages francilien du 1er au 8 octobre. Les m\xEAmes 6 M\u20AC sont publi\xE9s au 6 octobre et ne sont pas compt\xE9s deux fois.",
      blockades: "Mesure plus large : 224 \xE9tablissements ferm\xE9s (minist\xE8re) ; plus de 150 encore perturb\xE9s (franceinfo). Le chiffre de 224 est celui que le minist\xE8re rappellera le 13 octobre."
    },
    "2026-10-10": {
      blockades: "\xAB Plus de 40 lyc\xE9es bloqu\xE9s \xBB (AFP/Reuters, 10 octobre)."
    },
    "2026-10-12": {
      arrests: "13 interpellations rapport\xE9es ind\xE9pendamment par la pr\xE9fecture du Rh\xF4ne (27 \xE9tablissements touch\xE9s) et par celle du Bas-Rhin \xE0 Strasbourg. Deux pr\xE9fectures, le m\xEAme nombre : 13 est donc un plancher pour la journ\xE9e, pas le total r\xE9gional du jour. Ce n\u2019est pas Paris.",
      protesterInjured: "\xCEle-de-France uniquement : un proviseur, un parent d\u2019\xE9l\xE8ve et un agent de la R\xE9gion bless\xE9s. Compt\xE9s comme personnels de l\u2019\xE9ducation et des collectivit\xE9s, sur la m\xEAme base que le chiffre minist\xE9riel du 29 septembre.",
      damagesCost: "Normandie \u2014 Herv\xE9 Morin, Conseil r\xE9gional de Normandie, \xE0 l\u2019assembl\xE9e r\xE9gionale le 12 oct. : \xAB 1,5 million en Normandie \xBB sur \xAB d\u2019ores et d\xE9j\xE0 30 millions d\u2019euros \xBB au niveau national. Un stock r\xE9gional cumul\xE9, pas un flux quotidien, et une composante du stock national \u2014 jamais additionn\xE9. Le total francilien r\xE9vis\xE9 le m\xEAme jour \xE9tait de 8,5 M\u20AC.",
      blockades: "Pr\xE9fecture du Rh\xF4ne uniquement : 19 des 27 \xE9tablissements touch\xE9s \xE9taient des lyc\xE9es (six universit\xE9s, deux coll\xE8ges). L\u2019\xCEle-de-France comptait pr\xE8s de 80 lyc\xE9es perturb\xE9s le m\xEAme jour."
    },
    "2026-10-13": {
      blockades: "Mesure plus large : 214 \xE9tablissements ferm\xE9s, 94,2 % de lyc\xE9es ouverts \u2014 contre 224 le 8 octobre. Le minist\xE8re parle d\u2019un mouvement \xAB en recul \xBB."
    },
    "2026-10-17": {
      protesterInjured: "Fourchette d\xE9riv\xE9e : le plancher est le registre des blessures graves, le plafond est extrapol\xE9 \xE0 partir des soins dispens\xE9s par les street-medics. Aucun d\xE9compte officiel n\u2019existe.",
      damagesCost: "Estimation mod\xE9lis\xE9e de l\u2019IFRAP pour le week-end des 17\u201318 octobre ; hors chiffre d\u2019affaires perdu et co\xFBts de maintien de l\u2019ordre. L\u2019estimation parisienne publi\xE9e le 18 octobre en est un sous-ensemble, exclue de la somme hebdomadaire."
    },
    "2026-10-18": {
      arrests: "Chiffre de la pr\xE9fecture de police de Paris uniquement \u2014 journ\xE9e de couvre-feu.",
      damagesCost: "Sous-ensemble parisien du total IFRAP des 17\u201318 octobre \u2014 jamais additionn\xE9."
    },
    "2026-10-20": {
      arrests: "Chiffres des pr\xE9fectures de Guadeloupe uniquement \u2014 r\xE9gional."
    },
    "2026-10-24": {
      damagesCost: "Bilan national de CCI France pour le 17\u201324 octobre \u2014 un surensemble de la cellule du 17 octobre, jamais additionn\xE9."
    },
    "2026-10-31": {
      damagesCost: "Estimation locale \u2014 aucun chiffre national de dommages n\u2019a \xE9t\xE9 publi\xE9."
    },
    "2026-11-02": {
      blockades: "Minist\xE8re de l\u2019\xC9ducation \xE0 9 h 30 : 41 lyc\xE9es bloqu\xE9s, environ 1 % des 3 700 du pays, et aucune perturbation dans les trois quarts des d\xE9partements."
    },
    "2026-11-03": {
      blockades: "Minist\xE8re de l\u2019\xC9ducation : 48 lyc\xE9es bloqu\xE9s. L\u2019USL en compte pr\xE8s de 500."
    },
    "2026-11-05": {
      protesterInjured: "Publi\xE9 comme plancher : \xAB au moins \xBB. ",
      blockades: "Matignon \xE0 10 h : 81 \xE9tablissements bloqu\xE9s (2,2 %). L\u2019USL compte 1 000 lyc\xE9es \xAB \xE0 l\u2019arr\xEAt \xBB \u2014 bloqu\xE9s ou ferm\xE9s administrativement, donc une borne haute. Le minist\xE8re de l\u2019\xC9ducation compte 33 % d\u2019\xE9tablissements perturb\xE9s."
    },
    "2026-11-09": {
      arrests: "Chiffres de pr\xE9fectures r\xE9gionales uniquement \u2014 Bordeaux, Lyon, Strasbourg."
    }
  },
  deployNotes: {
    "2026-09-28": "dispositif estim\xE9",
    "2026-09-29": "dispositif estim\xE9",
    "2026-09-30": "dispositif estim\xE9",
    "2026-10-01": "dispositif estim\xE9",
    "2026-10-02": "dispositif estim\xE9",
    "2026-10-05": "dispositif estim\xE9",
    "2026-10-06": "dispositif estim\xE9",
    "2026-10-08": "dispositif estim\xE9",
    "2026-10-12": "estimated \u2014 \xCEle-de-France, Lyon and Strasbourg",
    "2026-10-13": "dispositif estim\xE9",
    "2026-10-17": "dispositif publi\xE9",
    "2026-10-18": "estim\xE9 \u2014 couvre-feu parisien",
    "2026-10-24": "dispositif publi\xE9",
    "2026-10-31": "dispositif publi\xE9",
    "2026-11-05": "dispositif publi\xE9",
    "2026-11-07": "dispositif publi\xE9"
  },
  policingDay: "{head} agents \xD7 {low}\u2013{high} \u20AC par agent-jour \xB7 {note}",
  policingDayPlain: "{head} agents \xD7 {low}\u2013{high} \u20AC par agent-jour",
  cumulativeAdded: "dispositif compt\xE9 ce jour \u2014 {days} \xE0 ce stade",
  cumulativeCarried: "aucun dispositif publi\xE9 \u2014 cumul report\xE9",
  weekNational: "{n} jour{s} compt\xE9{s}",
  weekRegionalOnly: "{n} jour{s}, r\xE9gional seulement",
  weekPeak: "pointe le {date}",
  weekNoNational: "aucun chiffre national cette semaine",
  weekExcluded: "{n} point{s} exclu(s) (r\xE9gional ou sous-ensemble)",
  weekFloored: "comprend un plancher \u2014 pas une somme",
  weekClipped: "semaine tronqu\xE9e par la fen\xEAtre",
  weekJoin: " \xB7 ",
  tooltipRange: "{label} : {mid} (fourchette {low}\u2013{high})",
  tooltipPoint: "{label} : {value}",
  tooltipNote: "{base}\n{note}",
  footerMark: "\u24D8 {note}",
  weekVacation: "en partie pendant les vacances de la Toussaint (17 oct. \u2013 1 nov.)",
  holidayLine: "Ligne en pointill\xE9s : les vacances de la Toussaint, du 17 octobre au 1er novembre 2026. Aucun lyc\xE9e n\u2019\xE9tait en cours, aucun ne pouvait \xEAtre bloqu\xE9 \u2014 le d\xE9compte n\u2019existait pas, il n\u2019\xE9tait pas nul.",
  metricNote: "Lyc\xE9es bloqu\xE9s ou ferm\xE9s : les \xE9tablissements o\xF9 les \xE9l\xE8ves ne pouvaient pas suivre normalement. La fourchette va du d\xE9compte officiel au d\xE9compte syndical, et ce dernier inclut les lyc\xE9es ferm\xE9s administrativement.",
  blockerNote: "Mesure plus large que les blocages \u2014 \xE9tablissements perturb\xE9s, cours suspendus ou ferm\xE9s \u2014 utilis\xE9e lorsque c\u2019est le seul chiffre publi\xE9 ce jour-l\xE0.",
  series: {
    protestersDaily: {
      label: "Manifestants",
      detached: "Manifestants (chiffre \xE9cart\xE9 de la courbe)"
    },
    blockadesDaily: {
      label: "Lyc\xE9es bloqu\xE9s",
      detached: "Lyc\xE9es bloqu\xE9s (d\xE9compte r\xE9gional)"
    },
    arrestsDaily: {
      label: "Interpellations",
      detached: "Interpellations (chiffre \xE9cart\xE9)"
    },
    forcesDaily: {
      label: "Bless\xE9s \u2014 forces de l\u2019ordre",
      detached: "Forces bless\xE9es (chiffre \xE9cart\xE9)"
    },
    protestersInjuredDaily: {
      label: "Bless\xE9s \u2014 manifestants",
      detached: "Manifestants bless\xE9s (chiffre \xE9cart\xE9)"
    },
    damagesDaily: {
      label: "Dommages mat\xE9riels",
      detached: "Dommages (stock ou chiffre mod\xE9lis\xE9)"
    },
    policingDaily: {
      label: "Co\xFBt du maintien de l\u2019ordre, par jour",
      detached: "Co\xFBt par jour (mod\xE9lis\xE9)"
    },
    policingCumulative: {
      label: "Co\xFBt du maintien de l\u2019ordre, cumul\xE9",
      detached: "Co\xFBt cumul\xE9 (mod\xE9lis\xE9)"
    },
    protestersWeekly: {
      label: "Manifestants (pointe hebdomadaire)",
      detached: "Manifestants (semaine r\xE9gionale)"
    },
    blockadesWeekly: {
      label: "Lyc\xE9es bloqu\xE9s (pointe hebdomadaire)",
      detached: "Lyc\xE9es bloqu\xE9s (semaine r\xE9gionale)"
    },
    arrestsWeekly: {
      label: "Interpellations (total hebdomadaire)",
      detached: "Interpellations (semaine r\xE9gionale)"
    },
    forcesWeekly: {
      label: "Forces bless\xE9es (total hebdomadaire)",
      detached: "Forces bless\xE9es (semaine r\xE9gionale)"
    },
    protestersInjuredWeekly: {
      label: "Manifestants bless\xE9s (total hebdomadaire)",
      detached: "Manifestants bless\xE9s (semaine r\xE9gionale)"
    }
  },
  charts: {
    protestersDaily: {
      title: "Manifestants et lyc\xE9es bloqu\xE9s, par jour",
      subtitle: "Foules sur l\u2019axe de gauche, blocages de lyc\xE9es sur l\u2019axe de droite. La ligne en pointill\xE9s est les vacances de la Toussaint",
      y: "Manifestants",
      yRight: "Lyc\xE9es bloqu\xE9s ou ferm\xE9s"
    },
    enforcementDaily: {
      title: "Interpellations et bless\xE9s, par jour",
      subtitle: "Une interpellation n\u2019est pas une garde \xE0 vue ; les bless\xE9s sont compt\xE9s par camp",
      y: "Personnes"
    },
    cost: {
      title: "Dommages et co\xFBt du maintien de l\u2019ordre",
      subtitle: "",
      y: "Millions d\u2019\u20AC"
    },
    protestersWeekly: {
      title: "Manifestants et lyc\xE9es bloqu\xE9s, pointe hebdomadaire",
      subtitle: "Jour de pointe de chaque semaine, pas une somme hebdomadaire \u2014 un m\xEAme lyc\xE9e est bloqu\xE9 plusieurs jours de suite",
      y: "Manifestants (jour de pointe)",
      yRight: "Lyc\xE9es bloqu\xE9s ou ferm\xE9s (pointe)"
    },
    enforcementWeekly: {
      title: "Maintien de l\u2019ordre, totaux hebdomadaires",
      subtitle: "Sommes hebdomadaires ; un stock ou un plancher ne s\u2019additionne pas",
      y: "Personnes (total hebdomadaire)"
    }
  }
};
var EPISODES_EN = {
  may68: {
    short: "May 68",
    strip: "May 68",
    banner: "General strike and factory occupations. Union and ministry crowd counts differ by a factor of ten, so both are plotted.",
    weeks: [
      { action: "1 May marches" },
      {
        action: "Night of the barricades, 10\u201311 May",
        note: { i: "Injury figure published as a floor." }
      },
      { action: "General strike from 13 May" },
      {
        action: "24 May: de Gaulle\u2019s broadcast",
        note: { a: "Arrest count published as a floor." }
      },
      { action: "Grenelle agreements, 27 May" },
      { action: "Legislative campaign" },
      void 0,
      void 0,
      void 0
    ]
  },
  cpe: {
    short: "CPE 2006",
    strip: "CPE 2006",
    banner: "First-employment contract: student and school movement, with two inter-union days. Enforcement figures exist for four weeks only.",
    weeks: [
      { action: "7 February: first national day" },
      void 0,
      void 0,
      void 0,
      { action: "Blockaded universities" },
      { action: "14 March: national day" },
      { action: "21 March: student day" },
      { action: "28 March: national day" },
      { action: "4 April: national day" },
      { action: "Withdrawal announced" }
    ]
  },
  gj: {
    short: "Gilets jaunes",
    strip: "Gilets jaunes",
    banner: "Counted act by act, on Saturdays only. Enforcement figures were published for the first four acts and never as a series afterwards.",
    weeks: []
    // the act number in the tooltip title carries the chronology
  },
  nahel: {
    short: "June 2023",
    strip: "June 2023",
    banner: "Five nights of rioting after the 27 June killing. Arrests and injuries are high relative to turnout because this was not a demonstration.",
    weeks: [{ action: "27 June: riots begin" }, { action: "Return to calm" }]
  },
  pensions: {
    short: "Pensions 2023",
    strip: "Pensions 2023",
    banner: "Movement against the rise in the statutory retirement age. Two anchor days carry most of the series; the inter-union band is wide.",
    weeks: [
      { action: "19 January: first national day" },
      void 0,
      { action: "31 January" },
      { action: "7 February" },
      { action: "16 February" },
      void 0,
      void 0,
      { action: "7 March: schools and transport shut" },
      { action: "11 March" },
      { action: "15 March" },
      { action: "23 March" },
      { action: "28 March" },
      { action: "6 April" },
      void 0,
      void 0,
      void 0,
      { action: "1 May" },
      void 0,
      void 0,
      void 0,
      { action: "6 June" }
    ]
  },
  bt: {
    short: "Bloquons tout",
    strip: "Bloquons tout",
    banner: "September 2025: blockades and marches, counted partially. Weeks without a published figure are left empty.",
    weeks: [
      { action: "10 September: blockades" },
      { action: "18 September: national day" },
      void 0,
      { action: "1 October" }
    ]
  },
  students26: {
    short: "Autumn 2026",
    strip: "Autumn 2026",
    banner: "The movement this page was built for, traced from the first mainland high-school blockades on 15 September. Daily publication, so days with no figure stay empty rather than interpolated.",
    weeks: [
      { action: "15 September: the Caen and Villeneuve-d'Ascq blockades" },
      { action: "25 September: Paris-area blockades" },
      { action: "Act I on 29 September, Act II on 1 October" },
      { action: "Act III on 6 October" },
      { action: "17 October: the peak" },
      { action: "24 October" },
      { action: "31 October" },
      { action: "5 and 7 November" },
      { action: "9 November \u2014 window ends 11 November" }
    ],
    fallbackNote: {
      p: "Weekly peak taken from the daily series \u2014 the peak day of the week.",
      a: "Sum of the published daily figures for the week; a cumulative stock is shown as the stock, never added to it."
    }
  }
};
var EPISODES_FR = {
  may68: {
    short: "Mai 68",
    strip: "Mai 68",
    banner: "Gr\xE8ve g\xE9n\xE9rale et occupations d\u2019usines. Les foules syndicales et les d\xE9comptes minist\xE9riels diff\xE8rent d\u2019un facteur dix : les deux sont trac\xE9s.",
    weeks: [
      { action: "Manifestations du 1er mai" },
      {
        action: "Nuit des barricades, 10\u201311 mai",
        note: { i: "Chiffre publi\xE9 comme plancher." }
      },
      { action: "Gr\xE8ve g\xE9n\xE9rale \xE0 partir du 13 mai" },
      {
        action: "24 mai : allocution du g\xE9n\xE9ral de Gaulle",
        note: { a: "Bilan d\u2019interpellations publi\xE9 comme plancher." }
      },
      { action: "Accords de Grenelle, 27 mai" },
      { action: "Campagne des l\xE9gislatives" },
      void 0,
      void 0,
      void 0
    ]
  },
  cpe: {
    short: "CPE 2006",
    strip: "CPE 2006",
    banner: "Contrat premi\xE8re embauche : mouvement lyc\xE9en et \xE9tudiant, avec deux journ\xE9es interprofessionnelles. Les chiffres de maintien de l\u2019ordre n\u2019existent que pour quatre semaines.",
    weeks: [
      { action: "7 f\xE9vrier : premi\xE8re journ\xE9e nationale" },
      void 0,
      void 0,
      void 0,
      { action: "Universit\xE9s bloqu\xE9es" },
      { action: "14 mars : journ\xE9e nationale" },
      { action: "21 mars : journ\xE9e \xE9tudiante" },
      { action: "28 mars : journ\xE9e nationale" },
      { action: "4 avril : journ\xE9e nationale" },
      { action: "Retrait annonc\xE9" }
    ]
  },
  gj: {
    short: "Gilets jaunes",
    strip: "Gilets jaunes",
    banner: "Compt\xE9 acte par acte, le samedi uniquement. Les chiffres de maintien de l\u2019ordre n\u2019ont \xE9t\xE9 publi\xE9s que pour les quatre premiers actes, jamais en s\xE9rie.",
    weeks: []
  },
  nahel: {
    short: "Juin 2023",
    strip: "Juin 2023",
    banner: "Cinq nuits d\u2019\xE9meutes apr\xE8s la mort du 27 juin. Les interpellations et bless\xE9s sont \xE9lev\xE9s rapport\xE9s \xE0 la foule parce qu\u2019il ne s\u2019agissait pas de manifestations.",
    weeks: [
      { action: "27 juin : d\xE9but des \xE9meutes" },
      { action: "Retour au calme" }
    ]
  },
  pensions: {
    short: "Retraites 2023",
    strip: "Retraites 2023",
    banner: "Mouvement contre le report de l\u2019\xE2ge l\xE9gal. Deux journ\xE9es portent l\u2019essentiel de la s\xE9rie ; la fourchette intersyndicale est large.",
    weeks: [
      { action: "19 janvier : premi\xE8re journ\xE9e nationale" },
      void 0,
      { action: "31 janvier" },
      { action: "7 f\xE9vrier" },
      { action: "16 f\xE9vrier" },
      void 0,
      void 0,
      { action: "7 mars : \xE9coles et transports bloqu\xE9s" },
      { action: "11 mars" },
      { action: "15 mars" },
      { action: "23 mars" },
      { action: "28 mars" },
      { action: "6 avril" },
      void 0,
      void 0,
      void 0,
      { action: "1er mai" },
      void 0,
      void 0,
      void 0,
      { action: "6 juin" }
    ]
  },
  bt: {
    short: "Bloquons tout",
    strip: "Bloquons tout",
    banner: "Septembre 2025 : blocages et d\xE9fil\xE9s, d\xE9comptes partiels. Les semaines sans chiffre publi\xE9 restent vides.",
    weeks: [
      { action: "10 septembre : blocages" },
      { action: "18 septembre : journ\xE9e nationale" },
      void 0,
      { action: "1er octobre" }
    ]
  },
  students26: {
    short: "Automne 2026",
    strip: "Automne 2026",
    banner: "Le mouvement pour lequel cette page a \xE9t\xE9 construite, suivi depuis les premiers blocages de lyc\xE9es en m\xE9tropole le 15 septembre. Publication quotidienne : les jours sans chiffre restent vides plut\xF4t qu\u2019interpol\xE9s.",
    weeks: [
      { action: "15 septembre : blocages de Caen et de Villeneuve-d\u2019Ascq" },
      { action: "25 septembre : blocages dans l\u2019agglom\xE9ration parisienne" },
      { action: "Acte I le 29 septembre, acte II le 1er octobre" },
      { action: "Acte III le 6 octobre" },
      { action: "17 octobre : la pointe" },
      { action: "24 octobre" },
      { action: "31 octobre" },
      { action: "5 et 7 novembre" },
      { action: "9 novembre \u2014 fen\xEAtre arr\xEAt\xE9e au 11 novembre" }
    ],
    fallbackNote: {
      p: "Pointe hebdomadaire issue de la s\xE9rie quotidienne \u2014 le jour de pointe de la semaine.",
      a: "Somme des chiffres journaliers publi\xE9s de la semaine ; un stock cumul\xE9 est montr\xE9 comme le stock, jamais additionn\xE9."
    }
  }
};
var SPAN_SEP = { en: " \u2013 ", fr: " \u2013 " };
var CATALOGUE = {
  en: {
    chart: CHART_EN,
    episodes: EPISODES_EN,
    panels: {
      partialWeek: "Week of {label} (partial)",
      act: "Act {n}",
      withAction: "{when} \xB7 {action}",
      seriesContinues: "{name} (cont.)",
      obs: "observations {counts} over {weeks}",
      valueRange: "{lo}\u2013{hi}",
      itemMeta: "range {range} \xB7 up to week {n}"
    },
    items: {
      p: { label: "Protesters", short: "Protesters" },
      a: { label: "Arrests", short: "Arrests" },
      f: { label: "Injured \u2014 security forces", short: "Forces injured" },
      i: { label: "Injured \u2014 protesters", short: "Protesters injured" }
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
      x: "wider measure"
    },
    // en
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} \xB7 {flag}",
      firstFigure: "first published figure: {n}",
      shareOfFirst: "{pct} of the first figure ({n})"
    },
    disclaimer: {
      body: "Research and coding was performed using an LLM and figures have not been verified. Do not use them for serious analysis or decision-making without first double-checking the figures and the sources at the bottom."
    }
  },
  fr: {
    chart: CHART_FR,
    episodes: EPISODES_FR,
    panels: {
      partialWeek: "Semaine du {label} (partielle)",
      act: "Acte {n}",
      withAction: "{when} \xB7 {action}",
      seriesContinues: "{name} (suite)",
      obs: "observations {counts} sur {weeks}",
      valueRange: "{lo}\u2013{hi}",
      itemMeta: "fourchette {range} \xB7 jusqu\u2019\xE0 la semaine {n}"
    },
    items: {
      p: { label: "Manifestants", short: "Manifestants" },
      a: { label: "Interpellations", short: "Interpellations" },
      f: { label: "Bless\xE9s \u2014 forces de l\u2019ordre", short: "Forces bless\xE9es" },
      i: { label: "Bless\xE9s \u2014 manifestants", short: "Manifestants bless\xE9s" }
    },
    units: { weeks: "semaine" },
    flags: {
      n: "",
      r: "r\xE9gional",
      p: "partiel",
      e: "mod\xE9lis\xE9",
      f: "plancher",
      c: "stock",
      w: "hebdomadaire",
      x: "mesure plus large"
    },
    // fr
    tooltip: {
      linePlain: "{value}",
      lineWithFlag: "{value} \xB7 {flag}",
      firstFigure: "premier chiffre publi\xE9 : {n}",
      shareOfFirst: "{pct} du premier chiffre ({n})"
    },
    disclaimer: {
      body: "La recherche et le code ont \xE9t\xE9 r\xE9alis\xE9s \xE0 l\u2019aide d\u2019un LLM et les chiffres n\u2019ont pas \xE9t\xE9 v\xE9rifi\xE9s. Ne les utilisez pas pour une analyse s\xE9rieuse ou pour prendre des d\xE9cisions sans avoir d\u2019abord v\xE9rifi\xE9 les chiffres et les sources en bas de page."
    }
  }
};
var DICT = {
  en: { "span.sep": SPAN_SEP.en },
  fr: { "span.sep": SPAN_SEP.fr }
};
var warned = /* @__PURE__ */ new Set();
function warnOnce(key, message) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[i18n] ${message}`);
}
var PASSTHROUGH = /* @__PURE__ */ new Set([
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
  "prototype"
]);
var tolerant = /* @__PURE__ */ new Map();
function catalogueFor(forLang) {
  const cached = tolerant.get(forLang);
  if (cached) return cached;
  const proxy = new Proxy(CATALOGUE[forLang], {
    get(target, prop, receiver) {
      if (typeof prop !== "string" || prop in target || PASSTHROUGH.has(prop)) {
        return Reflect.get(target, prop, receiver);
      }
      const tag2 = `${forLang}:${prop}`;
      if (!warned.has(tag2)) {
        warned.add(tag2);
        console.warn(
          `[i18n] catalogue branch "${prop}" is missing (${forLang})`
        );
      }
      return new Proxy({}, { get: () => "" });
    }
  });
  tolerant.set(forLang, proxy);
  return proxy;
}
function t(key, params) {
  if (key === void 0) return catalogueFor(current);
  const template = DICT[current][key] ?? DICT.en[key];
  if (template === void 0) {
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[i18n] missing key "${key}" (${current})`);
    }
    return key;
  }
  return params === void 0 ? template : fill(template, params);
}
function bi(value2) {
  return value2[current] ?? value2.en;
}
var STATIC = {
  "hdr.kicker": {
    en: "Working draft \xB7 15 Sep \u2013 11 Nov 2026",
    fr: "Document de travail \xB7 15 sept. \u2013 11 nov. 2026"
  },
  "hdr.title": {
    en: "Protest activity in France, autumn 2026",
    fr: "L\u2019activit\xE9 contestataire en France, automne 2026"
  },
  "hdr.lede": {
    en: "Turnout, arrests, injuries and damage, set against six earlier French movements. Every point is a range where the publishers disagree. The series starts on 15 September 2026, with the first mainland high-school blockades.",
    fr: "Foules, interpellations, bless\xE9s et dommages, compar\xE9s \xE0 six mouvements fran\xE7ais ant\xE9rieurs. Chaque point est une fourchette l\xE0 o\xF9 les \xE9diteurs divergent. La s\xE9rie commence le 15 septembre 2026, avec les premiers blocages de lyc\xE9es en m\xE9tropole."
  },
  "ui.lang": { en: "Language", fr: "Langue" },
  "ui.lang.fr": {
    en: "Afficher la page en fran\xE7ais",
    fr: "Afficher la page en fran\xE7ais"
  },
  "ui.lang.en": {
    en: "Show this page in English",
    fr: "Afficher la page en anglais"
  },
  "ui.theme": { en: "Dark mode", fr: "Mode sombre" },
  "card.prot.title": { en: "Protesters", fr: "Manifestants" },
  "card.prot.sub": {
    en: "Ministry and organiser counts",
    fr: "Comptages minist\xE9riels et syndicaux"
  },
  "card.enf.title": {
    en: "Arrests and injuries",
    fr: "Interpellations et bless\xE9s"
  },
  "card.enf.sub": {
    en: "Custody is not the same as arrest",
    fr: "La garde \xE0 vue n\u2019est pas l\u2019interpellation"
  },
  "card.cost.title": {
    en: "Damage and the cost of policing",
    fr: "Dommages et co\xFBt du maintien de l\u2019ordre"
  },
  "card.pw.title": {
    en: "Protesters, weekly peak",
    fr: "Manifestants, pointe hebdomadaire"
  },
  "card.ew.title": {
    en: "Enforcement, weekly totals",
    fr: "Maintien de l\u2019ordre, totaux hebdomadaires"
  },
  "leg.holiday.title": {
    en: "Dotted line = the Toussaint school holiday",
    fr: "Ligne en pointill\xE9s = les vacances de la Toussaint"
  },
  "leg.items.title": {
    en: "Highlight a measure",
    fr: "Mettre en avant une mesure"
  },
  "leg.movements.title": {
    en: "Highlight a movement",
    fr: "Mettre en avant un mouvement"
  }
};
for (const id of ["a", "b", "c", "cp"]) {
  STATIC[`sec.${id}.title`] = {
    en: EN_META.sections[id].title,
    fr: FR_META.sections[id].title
  };
  STATIC[`sec.${id}.lede`] = {
    en: EN_META.sections[id].blurb,
    fr: FR_META.sections[id].blurb
  };
}
STATIC["doc.title"] = { en: EN_META.meta.title, fr: FR_META.meta.title };
var STATIC_KEYS = new Set(Object.keys(STATIC));
function applyStaticCopy(root2 = document) {
  const L = current;
  for (const node of root2.querySelectorAll("[data-i18n]")) {
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
    const attr = node.dataset.i18nAttr;
    if (!attr || attr === "text") node.textContent = text;
    else node.setAttribute(attr, text);
  }
}
function syncLangSwitch(root2 = document) {
  for (const b of root2.querySelectorAll("[data-set-lang]")) {
    const on = b.dataset.setLang === current;
    b.setAttribute("aria-pressed", String(on));
    b.tabIndex = on ? 0 : -1;
  }
}
var A11Y = {
  en: {
    about: "Notes on this project",
    chart: "Chart",
    chartRole: "chart",
    chartHint: "Interactive chart. Use the left and right arrow keys to step through data points, Home and End for the ends, Escape to clear. A table of the same data follows the chart.",
    tableCaption: "Data for \u201C{title}\u201D",
    dateHeader: "Date",
    weekHeader: "Week",
    switched: "Page language: {lang}. Charts redrawn."
  },
  fr: {
    about: "Notes sur ce projet",
    chart: "Graphique",
    chartRole: "graphique",
    chartHint: "Graphique interactif. Utilisez les fl\xE8ches gauche et droite pour parcourir les points, D\xE9but et Fin pour les extr\xE9mit\xE9s, \xC9chap pour quitter. Un tableau des m\xEAmes donn\xE9es suit le graphique.",
    tableCaption: "Donn\xE9es de \xAB {title} \xBB",
    dateHeader: "Date",
    weekHeader: "Semaine",
    switched: "Langue de la page : {lang}. Graphiques redessin\xE9s."
  }
};
var a11y = () => A11Y[current];

// node_modules/@kurkle/color/dist/color.esm.js
function round(v) {
  return v + 0.5 | 0;
}
var lim = (v, l, h) => Math.max(Math.min(v, h), l);
function p2b(v) {
  return lim(round(v * 2.55), 0, 255);
}
function n2b(v) {
  return lim(round(v * 255), 0, 255);
}
function b2n(v) {
  return lim(round(v / 2.55) / 100, 0, 1);
}
function n2p(v) {
  return lim(round(v * 100), 0, 100);
}
var map$1 = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
var hex = [..."0123456789ABCDEF"];
var h1 = (b) => hex[b & 15];
var h2 = (b) => hex[(b & 240) >> 4] + hex[b & 15];
var eq = (b) => (b & 240) >> 4 === (b & 15);
var isShort = (v) => eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
function hexParse(str) {
  var len = str.length;
  var ret;
  if (str[0] === "#") {
    if (len === 4 || len === 5) {
      ret = {
        r: 255 & map$1[str[1]] * 17,
        g: 255 & map$1[str[2]] * 17,
        b: 255 & map$1[str[3]] * 17,
        a: len === 5 ? map$1[str[4]] * 17 : 255
      };
    } else if (len === 7 || len === 9) {
      ret = {
        r: map$1[str[1]] << 4 | map$1[str[2]],
        g: map$1[str[3]] << 4 | map$1[str[4]],
        b: map$1[str[5]] << 4 | map$1[str[6]],
        a: len === 9 ? map$1[str[7]] << 4 | map$1[str[8]] : 255
      };
    }
  }
  return ret;
}
var alpha = (a, f) => a < 255 ? f(a) : "";
function hexString(v) {
  var f = isShort(v) ? h1 : h2;
  return v ? "#" + f(v.r) + f(v.g) + f(v.b) + alpha(v.a, f) : void 0;
}
var HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
}
function hsv2rgbn(h, s, v) {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}
function hwb2rgbn(h, w, b) {
  const rgb = hsl2rgbn(h, 1, 0.5);
  let i;
  if (w + b > 1) {
    i = 1 / (w + b);
    w *= i;
    b *= i;
  }
  for (i = 0; i < 3; i++) {
    rgb[i] *= 1 - w - b;
    rgb[i] += w;
  }
  return rgb;
}
function hueValue(r, g, b, d, max) {
  if (r === max) {
    return (g - b) / d + (g < b ? 6 : 0);
  }
  if (g === max) {
    return (b - r) / d + 2;
  }
  return (r - g) / d + 4;
}
function rgb2hsl(v) {
  const range = 255;
  const r = v.r / range;
  const g = v.g / range;
  const b = v.b / range;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s, d;
  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = hueValue(r, g, b, d, max);
    h = h * 60 + 0.5;
  }
  return [h | 0, s || 0, l];
}
function calln(f, a, b, c) {
  return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
}
function hsl2rgb(h, s, l) {
  return calln(hsl2rgbn, h, s, l);
}
function hwb2rgb(h, w, b) {
  return calln(hwb2rgbn, h, w, b);
}
function hsv2rgb(h, s, v) {
  return calln(hsv2rgbn, h, s, v);
}
function hue(h) {
  return (h % 360 + 360) % 360;
}
function hueParse(str) {
  const m = HUE_RE.exec(str);
  let a = 255;
  let v;
  if (!m) {
    return;
  }
  if (m[5] !== v) {
    a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
  }
  const h = hue(+m[2]);
  const p1 = +m[3] / 100;
  const p2 = +m[4] / 100;
  if (m[1] === "hwb") {
    v = hwb2rgb(h, p1, p2);
  } else if (m[1] === "hsv") {
    v = hsv2rgb(h, p1, p2);
  } else {
    v = hsl2rgb(h, p1, p2);
  }
  return {
    r: v[0],
    g: v[1],
    b: v[2],
    a
  };
}
function rotate(v, deg) {
  var h = rgb2hsl(v);
  h[0] = hue(h[0] + deg);
  h = hsl2rgb(h);
  v.r = h[0];
  v.g = h[1];
  v.b = h[2];
}
function hslString(v) {
  if (!v) {
    return;
  }
  const a = rgb2hsl(v);
  const h = a[0];
  const s = n2p(a[1]);
  const l = n2p(a[2]);
  return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
}
var map = {
  x: "dark",
  Z: "light",
  Y: "re",
  X: "blu",
  W: "gr",
  V: "medium",
  U: "slate",
  A: "ee",
  T: "ol",
  S: "or",
  B: "ra",
  C: "lateg",
  D: "ights",
  R: "in",
  Q: "turquois",
  E: "hi",
  P: "ro",
  O: "al",
  N: "le",
  M: "de",
  L: "yello",
  F: "en",
  K: "ch",
  G: "arks",
  H: "ea",
  I: "ightg",
  J: "wh"
};
var names$1 = {
  OiceXe: "f0f8ff",
  antiquewEte: "faebd7",
  aqua: "ffff",
  aquamarRe: "7fffd4",
  azuY: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "0",
  blanKedOmond: "ffebcd",
  Xe: "ff",
  XeviTet: "8a2be2",
  bPwn: "a52a2a",
  burlywood: "deb887",
  caMtXe: "5f9ea0",
  KartYuse: "7fff00",
  KocTate: "d2691e",
  cSO: "ff7f50",
  cSnflowerXe: "6495ed",
  cSnsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "ffff",
  xXe: "8b",
  xcyan: "8b8b",
  xgTMnPd: "b8860b",
  xWay: "a9a9a9",
  xgYF: "6400",
  xgYy: "a9a9a9",
  xkhaki: "bdb76b",
  xmagFta: "8b008b",
  xTivegYF: "556b2f",
  xSange: "ff8c00",
  xScEd: "9932cc",
  xYd: "8b0000",
  xsOmon: "e9967a",
  xsHgYF: "8fbc8f",
  xUXe: "483d8b",
  xUWay: "2f4f4f",
  xUgYy: "2f4f4f",
  xQe: "ced1",
  xviTet: "9400d3",
  dAppRk: "ff1493",
  dApskyXe: "bfff",
  dimWay: "696969",
  dimgYy: "696969",
  dodgerXe: "1e90ff",
  fiYbrick: "b22222",
  flSOwEte: "fffaf0",
  foYstWAn: "228b22",
  fuKsia: "ff00ff",
  gaRsbSo: "dcdcdc",
  ghostwEte: "f8f8ff",
  gTd: "ffd700",
  gTMnPd: "daa520",
  Way: "808080",
  gYF: "8000",
  gYFLw: "adff2f",
  gYy: "808080",
  honeyMw: "f0fff0",
  hotpRk: "ff69b4",
  RdianYd: "cd5c5c",
  Rdigo: "4b0082",
  ivSy: "fffff0",
  khaki: "f0e68c",
  lavFMr: "e6e6fa",
  lavFMrXsh: "fff0f5",
  lawngYF: "7cfc00",
  NmoncEffon: "fffacd",
  ZXe: "add8e6",
  ZcSO: "f08080",
  Zcyan: "e0ffff",
  ZgTMnPdLw: "fafad2",
  ZWay: "d3d3d3",
  ZgYF: "90ee90",
  ZgYy: "d3d3d3",
  ZpRk: "ffb6c1",
  ZsOmon: "ffa07a",
  ZsHgYF: "20b2aa",
  ZskyXe: "87cefa",
  ZUWay: "778899",
  ZUgYy: "778899",
  ZstAlXe: "b0c4de",
  ZLw: "ffffe0",
  lime: "ff00",
  limegYF: "32cd32",
  lRF: "faf0e6",
  magFta: "ff00ff",
  maPon: "800000",
  VaquamarRe: "66cdaa",
  VXe: "cd",
  VScEd: "ba55d3",
  VpurpN: "9370db",
  VsHgYF: "3cb371",
  VUXe: "7b68ee",
  VsprRggYF: "fa9a",
  VQe: "48d1cc",
  VviTetYd: "c71585",
  midnightXe: "191970",
  mRtcYam: "f5fffa",
  mistyPse: "ffe4e1",
  moccasR: "ffe4b5",
  navajowEte: "ffdead",
  navy: "80",
  Tdlace: "fdf5e6",
  Tive: "808000",
  TivedBb: "6b8e23",
  Sange: "ffa500",
  SangeYd: "ff4500",
  ScEd: "da70d6",
  pOegTMnPd: "eee8aa",
  pOegYF: "98fb98",
  pOeQe: "afeeee",
  pOeviTetYd: "db7093",
  papayawEp: "ffefd5",
  pHKpuff: "ffdab9",
  peru: "cd853f",
  pRk: "ffc0cb",
  plum: "dda0dd",
  powMrXe: "b0e0e6",
  purpN: "800080",
  YbeccapurpN: "663399",
  Yd: "ff0000",
  Psybrown: "bc8f8f",
  PyOXe: "4169e1",
  saddNbPwn: "8b4513",
  sOmon: "fa8072",
  sandybPwn: "f4a460",
  sHgYF: "2e8b57",
  sHshell: "fff5ee",
  siFna: "a0522d",
  silver: "c0c0c0",
  skyXe: "87ceeb",
  UXe: "6a5acd",
  UWay: "708090",
  UgYy: "708090",
  snow: "fffafa",
  sprRggYF: "ff7f",
  stAlXe: "4682b4",
  tan: "d2b48c",
  teO: "8080",
  tEstN: "d8bfd8",
  tomato: "ff6347",
  Qe: "40e0d0",
  viTet: "ee82ee",
  JHt: "f5deb3",
  wEte: "ffffff",
  wEtesmoke: "f5f5f5",
  Lw: "ffff00",
  LwgYF: "9acd32"
};
function unpack() {
  const unpacked = {};
  const keys = Object.keys(names$1);
  const tkeys = Object.keys(map);
  let i, j, k, ok, nk;
  for (i = 0; i < keys.length; i++) {
    ok = nk = keys[i];
    for (j = 0; j < tkeys.length; j++) {
      k = tkeys[j];
      nk = nk.replace(k, map[k]);
    }
    k = parseInt(names$1[ok], 16);
    unpacked[nk] = [k >> 16 & 255, k >> 8 & 255, k & 255];
  }
  return unpacked;
}
var names;
function nameParse(str) {
  if (!names) {
    names = unpack();
    names.transparent = [0, 0, 0, 0];
  }
  const a = names[str.toLowerCase()];
  return a && {
    r: a[0],
    g: a[1],
    b: a[2],
    a: a.length === 4 ? a[3] : 255
  };
}
var RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
  const m = RGB_RE.exec(str);
  let a = 255;
  let r, g, b;
  if (!m) {
    return;
  }
  if (m[7] !== r) {
    const v = +m[7];
    a = m[8] ? p2b(v) : lim(v * 255, 0, 255);
  }
  r = +m[1];
  g = +m[3];
  b = +m[5];
  r = 255 & (m[2] ? p2b(r) : lim(r, 0, 255));
  g = 255 & (m[4] ? p2b(g) : lim(g, 0, 255));
  b = 255 & (m[6] ? p2b(b) : lim(b, 0, 255));
  return {
    r,
    g,
    b,
    a
  };
}
function rgbString(v) {
  return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
}
var to = (v) => v <= 31308e-7 ? v * 12.92 : Math.pow(v, 1 / 2.4) * 1.055 - 0.055;
var from = (v) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
function interpolate(rgb1, rgb2, t2) {
  const r = from(b2n(rgb1.r));
  const g = from(b2n(rgb1.g));
  const b = from(b2n(rgb1.b));
  return {
    r: n2b(to(r + t2 * (from(b2n(rgb2.r)) - r))),
    g: n2b(to(g + t2 * (from(b2n(rgb2.g)) - g))),
    b: n2b(to(b + t2 * (from(b2n(rgb2.b)) - b))),
    a: rgb1.a + t2 * (rgb2.a - rgb1.a)
  };
}
function modHSL(v, i, ratio) {
  if (v) {
    let tmp = rgb2hsl(v);
    tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
    tmp = hsl2rgb(tmp);
    v.r = tmp[0];
    v.g = tmp[1];
    v.b = tmp[2];
  }
}
function clone(v, proto) {
  return v ? Object.assign(proto || {}, v) : v;
}
function fromObject(input) {
  var v = { r: 0, g: 0, b: 0, a: 255 };
  if (Array.isArray(input)) {
    if (input.length >= 3) {
      v = { r: input[0], g: input[1], b: input[2], a: 255 };
      if (input.length > 3) {
        v.a = n2b(input[3]);
      }
    }
  } else {
    v = clone(input, { r: 0, g: 0, b: 0, a: 1 });
    v.a = n2b(v.a);
  }
  return v;
}
function functionParse(str) {
  if (str.charAt(0) === "r") {
    return rgbParse(str);
  }
  return hueParse(str);
}
var Color = class _Color {
  constructor(input) {
    if (input instanceof _Color) {
      return input;
    }
    const type = typeof input;
    let v;
    if (type === "object") {
      v = fromObject(input);
    } else if (type === "string") {
      v = hexParse(input) || nameParse(input) || functionParse(input);
    }
    this._rgb = v;
    this._valid = !!v;
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var v = clone(this._rgb);
    if (v) {
      v.a = b2n(v.a);
    }
    return v;
  }
  set rgb(obj) {
    this._rgb = fromObject(obj);
  }
  rgbString() {
    return this._valid ? rgbString(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? hexString(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? hslString(this._rgb) : void 0;
  }
  mix(color2, weight) {
    if (color2) {
      const c1 = this.rgb;
      const c2 = color2.rgb;
      let w2;
      const p = weight === w2 ? 0.5 : weight;
      const w = 2 * p - 1;
      const a = c1.a - c2.a;
      const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
      w2 = 1 - w1;
      c1.r = 255 & w1 * c1.r + w2 * c2.r + 0.5;
      c1.g = 255 & w1 * c1.g + w2 * c2.g + 0.5;
      c1.b = 255 & w1 * c1.b + w2 * c2.b + 0.5;
      c1.a = p * c1.a + (1 - p) * c2.a;
      this.rgb = c1;
    }
    return this;
  }
  interpolate(color2, t2) {
    if (color2) {
      this._rgb = interpolate(this._rgb, color2._rgb, t2);
    }
    return this;
  }
  clone() {
    return new _Color(this.rgb);
  }
  alpha(a) {
    this._rgb.a = n2b(a);
    return this;
  }
  clearer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 - ratio;
    return this;
  }
  greyscale() {
    const rgb = this._rgb;
    const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    rgb.r = rgb.g = rgb.b = val;
    return this;
  }
  opaquer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 + ratio;
    return this;
  }
  negate() {
    const v = this._rgb;
    v.r = 255 - v.r;
    v.g = 255 - v.g;
    v.b = 255 - v.b;
    return this;
  }
  lighten(ratio) {
    modHSL(this._rgb, 2, ratio);
    return this;
  }
  darken(ratio) {
    modHSL(this._rgb, 2, -ratio);
    return this;
  }
  saturate(ratio) {
    modHSL(this._rgb, 1, ratio);
    return this;
  }
  desaturate(ratio) {
    modHSL(this._rgb, 1, -ratio);
    return this;
  }
  rotate(deg) {
    rotate(this._rgb, deg);
    return this;
  }
};

// node_modules/chart.js/dist/chunks/index.js
function noop() {
}
var uid = /* @__PURE__ */ (() => {
  let id = 0;
  return () => id++;
})();
function isNullOrUndef(value2) {
  return value2 === null || value2 === void 0;
}
function isArray(value2) {
  if (Array.isArray && Array.isArray(value2)) {
    return true;
  }
  const type = Object.prototype.toString.call(value2);
  if (type.slice(0, 7) === "[object" && type.slice(-6) === "Array]") {
    return true;
  }
  return false;
}
function isObject(value2) {
  return value2 !== null && Object.prototype.toString.call(value2) === "[object Object]";
}
function isNumberFinite(value2) {
  return (typeof value2 === "number" || value2 instanceof Number) && isFinite(+value2);
}
function finiteOrDefault(value2, defaultValue) {
  return isNumberFinite(value2) ? value2 : defaultValue;
}
function valueOrDefault(value2, defaultValue) {
  return typeof value2 === "undefined" ? defaultValue : value2;
}
var toDimension = (value2, dimension) => typeof value2 === "string" && value2.endsWith("%") ? parseFloat(value2) / 100 * dimension : +value2;
function callback(fn, args, thisArg) {
  if (fn && typeof fn.call === "function") {
    return fn.apply(thisArg, args);
  }
}
function each(loopable, fn, thisArg, reverse) {
  let i, len, keys;
  if (isArray(loopable)) {
    len = loopable.length;
    if (reverse) {
      for (i = len - 1; i >= 0; i--) {
        fn.call(thisArg, loopable[i], i);
      }
    } else {
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[i], i);
      }
    }
  } else if (isObject(loopable)) {
    keys = Object.keys(loopable);
    len = keys.length;
    for (i = 0; i < len; i++) {
      fn.call(thisArg, loopable[keys[i]], keys[i]);
    }
  }
}
function _elementsEqual(a0, a1) {
  let i, ilen, v0, v1;
  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }
  for (i = 0, ilen = a0.length; i < ilen; ++i) {
    v0 = a0[i];
    v1 = a1[i];
    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }
  return true;
}
function clone2(source) {
  if (isArray(source)) {
    return source.map(clone2);
  }
  if (isObject(source)) {
    const target = /* @__PURE__ */ Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;
    for (; k < klen; ++k) {
      target[keys[k]] = clone2(source[keys[k]]);
    }
    return target;
  }
  return source;
}
function isValidKey(key) {
  return [
    "__proto__",
    "prototype",
    "constructor"
  ].indexOf(key) === -1;
}
function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone2(sval);
  }
}
function merge(target, source, options) {
  const sources = isArray(source) ? source : [
    source
  ];
  const ilen = sources.length;
  if (!isObject(target)) {
    return target;
  }
  options = options || {};
  const merger = options.merger || _merger;
  let current2;
  for (let i = 0; i < ilen; ++i) {
    current2 = sources[i];
    if (!isObject(current2)) {
      continue;
    }
    const keys = Object.keys(current2);
    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, current2, options);
    }
  }
  return target;
}
function mergeIf(target, source) {
  return merge(target, source, {
    merger: _mergerIf
  });
}
function _mergerIf(key, target, source) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone2(sval);
  }
}
var keyResolvers = {
  // Chart.helpers.core resolveObjectKey should resolve empty key to root object
  "": (v) => v,
  // default resolvers
  x: (o) => o.x,
  y: (o) => o.y
};
function _splitKey(key) {
  const parts = key.split(".");
  const keys = [];
  let tmp = "";
  for (const part of parts) {
    tmp += part;
    if (tmp.endsWith("\\")) {
      tmp = tmp.slice(0, -1) + ".";
    } else {
      keys.push(tmp);
      tmp = "";
    }
  }
  return keys;
}
function _getKeyResolver(key) {
  const keys = _splitKey(key);
  return (obj) => {
    for (const k of keys) {
      if (k === "") {
        break;
      }
      obj = obj && obj[k];
    }
    return obj;
  };
}
function resolveObjectKey(obj, key) {
  const resolver = keyResolvers[key] || (keyResolvers[key] = _getKeyResolver(key));
  return resolver(obj);
}
function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
var defined = (value2) => typeof value2 !== "undefined";
var isFunction = (value2) => typeof value2 === "function";
var setsEqual = (a, b) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
};
function _isClickEvent(e) {
  return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
var PI = Math.PI;
var TAU = 2 * PI;
var PITAU = TAU + PI;
var INFINITY = Number.POSITIVE_INFINITY;
var RAD_PER_DEG = PI / 180;
var HALF_PI = PI / 2;
var QUARTER_PI = PI / 4;
var TWO_THIRDS_PI = PI * 2 / 3;
var log10 = Math.log10;
var sign = Math.sign;
function almostEquals(x, y, epsilon) {
  return Math.abs(x - y) < epsilon;
}
function niceNum(range) {
  const roundedRange = Math.round(range);
  range = almostEquals(range, roundedRange, range / 1e3) ? roundedRange : range;
  const niceRange = Math.pow(10, Math.floor(log10(range)));
  const fraction = range / niceRange;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * niceRange;
}
function _factorize(value2) {
  const result = [];
  const sqrt = Math.sqrt(value2);
  let i;
  for (i = 1; i < sqrt; i++) {
    if (value2 % i === 0) {
      result.push(i);
      result.push(value2 / i);
    }
  }
  if (sqrt === (sqrt | 0)) {
    result.push(sqrt);
  }
  result.sort((a, b) => a - b).pop();
  return result;
}
function isNonPrimitive(n) {
  return typeof n === "symbol" || typeof n === "object" && n !== null && !(Symbol.toPrimitive in n || "toString" in n || "valueOf" in n);
}
function isNumber(n) {
  return !isNonPrimitive(n) && !isNaN(parseFloat(n)) && isFinite(n);
}
function almostWhole(x, epsilon) {
  const rounded = Math.round(x);
  return rounded - epsilon <= x && rounded + epsilon >= x;
}
function _setMinAndMaxByKey(array, target, property) {
  let i, ilen, value2;
  for (i = 0, ilen = array.length; i < ilen; i++) {
    value2 = array[i][property];
    if (!isNaN(value2)) {
      target.min = Math.min(target.min, value2);
      target.max = Math.max(target.max, value2);
    }
  }
}
function toRadians(degrees) {
  return degrees * (PI / 180);
}
function toDegrees(radians) {
  return radians * (180 / PI);
}
function _decimalPlaces(x) {
  if (!isNumberFinite(x)) {
    return;
  }
  let e = 1;
  let p = 0;
  while (Math.round(x * e) / e !== x) {
    e *= 10;
    p++;
  }
  return p;
}
function getAngleFromPoint(centrePoint, anglePoint) {
  const distanceFromXCenter = anglePoint.x - centrePoint.x;
  const distanceFromYCenter = anglePoint.y - centrePoint.y;
  const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
  let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
  if (angle < -0.5 * PI) {
    angle += TAU;
  }
  return {
    angle,
    distance: radialDistanceFromCenter
  };
}
function distanceBetweenPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}
function _angleDiff(a, b) {
  return (a - b + PITAU) % TAU - PI;
}
function _normalizeAngle(a) {
  return (a % TAU + TAU) % TAU;
}
function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
  const a = _normalizeAngle(angle);
  const s = _normalizeAngle(start);
  const e = _normalizeAngle(end);
  const angleToStart = _normalizeAngle(s - a);
  const angleToEnd = _normalizeAngle(e - a);
  const startToAngle = _normalizeAngle(a - s);
  const endToAngle = _normalizeAngle(a - e);
  return a === s || a === e || sameAngleIsFullCircle && s === e || angleToStart > angleToEnd && startToAngle < endToAngle;
}
function _limitValue(value2, min, max) {
  return Math.max(min, Math.min(max, value2));
}
function _int16Range(value2) {
  return _limitValue(value2, -32768, 32767);
}
function _isBetween(value2, start, end, epsilon = 1e-6) {
  return value2 >= Math.min(start, end) - epsilon && value2 <= Math.max(start, end) + epsilon;
}
function _lookup(table, value2, cmp) {
  cmp = cmp || ((index) => table[index] < value2);
  let hi = table.length - 1;
  let lo = 0;
  let mid;
  while (hi - lo > 1) {
    mid = lo + hi >> 1;
    if (cmp(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return {
    lo,
    hi
  };
}
var _lookupByKey = (table, key, value2, last) => _lookup(table, value2, last ? (index) => {
  const ti = table[index][key];
  return ti < value2 || ti === value2 && table[index + 1][key] === value2;
} : (index) => table[index][key] < value2);
var _rlookupByKey = (table, key, value2) => _lookup(table, value2, (index) => table[index][key] >= value2);
function _filterBetween(values, min, max) {
  let start = 0;
  let end = values.length;
  while (start < end && values[start] < min) {
    start++;
  }
  while (end > start && values[end - 1] > max) {
    end--;
  }
  return start > 0 || end < values.length ? values.slice(start, end) : values;
}
var arrayEvents = [
  "push",
  "pop",
  "shift",
  "splice",
  "unshift"
];
function listenArrayEvents(array, listener) {
  if (array._chartjs) {
    array._chartjs.listeners.push(listener);
    return;
  }
  Object.defineProperty(array, "_chartjs", {
    configurable: true,
    enumerable: false,
    value: {
      listeners: [
        listener
      ]
    }
  });
  arrayEvents.forEach((key) => {
    const method = "_onData" + _capitalize(key);
    const base = array[key];
    Object.defineProperty(array, key, {
      configurable: true,
      enumerable: false,
      value(...args) {
        const res = base.apply(this, args);
        array._chartjs.listeners.forEach((object) => {
          if (typeof object[method] === "function") {
            object[method](...args);
          }
        });
        return res;
      }
    });
  });
}
function unlistenArrayEvents(array, listener) {
  const stub = array._chartjs;
  if (!stub) {
    return;
  }
  const listeners2 = stub.listeners;
  const index = listeners2.indexOf(listener);
  if (index !== -1) {
    listeners2.splice(index, 1);
  }
  if (listeners2.length > 0) {
    return;
  }
  arrayEvents.forEach((key) => {
    delete array[key];
  });
  delete array._chartjs;
}
function _arrayUnique(items) {
  const set2 = new Set(items);
  if (set2.size === items.length) {
    return items;
  }
  return Array.from(set2);
}
var requestAnimFrame = (function() {
  if (typeof window === "undefined") {
    return function(callback2) {
      return callback2();
    };
  }
  return window.requestAnimationFrame;
})();
function throttled(fn, thisArg) {
  let argsToUse = [];
  let ticking = false;
  return function(...args) {
    argsToUse = args;
    if (!ticking) {
      ticking = true;
      requestAnimFrame.call(window, () => {
        ticking = false;
        fn.apply(thisArg, argsToUse);
      });
    }
  };
}
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay, args);
    } else {
      fn.apply(this, args);
    }
    return delay;
  };
}
var _toLeftRightCenter = (align) => align === "start" ? "left" : align === "end" ? "right" : "center";
var _alignStartEnd = (align, start, end) => align === "start" ? start : align === "end" ? end : (start + end) / 2;
var _textX = (align, left, right, rtl) => {
  const check = rtl ? "left" : "right";
  return align === check ? right : align === "center" ? (left + right) / 2 : left;
};
function _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
  const pointCount = points.length;
  let start = 0;
  let count = pointCount;
  if (meta._sorted) {
    const { iScale, vScale, _parsed } = meta;
    const spanGaps = meta.dataset ? meta.dataset.options ? meta.dataset.options.spanGaps : null : null;
    const axis = iScale.axis;
    const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
    if (minDefined) {
      start = Math.min(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, axis, min).lo,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo
      );
      if (spanGaps) {
        const distanceToDefinedLo = _parsed.slice(0, start + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        start -= Math.max(0, distanceToDefinedLo);
      }
      start = _limitValue(start, 0, pointCount - 1);
    }
    if (maxDefined) {
      let end = Math.max(
        // @ts-expect-error Need to type _parsed
        _lookupByKey(_parsed, iScale.axis, max, true).hi + 1,
        // @ts-expect-error Need to fix types on _lookupByKey
        animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max), true).hi + 1
      );
      if (spanGaps) {
        const distanceToDefinedHi = _parsed.slice(end - 1).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        end += Math.max(0, distanceToDefinedHi);
      }
      count = _limitValue(end, start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
  }
  return {
    start,
    count
  };
}
function _scaleRangesChanged(meta) {
  const { xScale: xScale2, yScale: yScale2, _scaleRanges } = meta;
  const newRanges = {
    xmin: xScale2.min,
    xmax: xScale2.max,
    ymin: yScale2.min,
    ymax: yScale2.max
  };
  if (!_scaleRanges) {
    meta._scaleRanges = newRanges;
    return true;
  }
  const changed = _scaleRanges.xmin !== xScale2.min || _scaleRanges.xmax !== xScale2.max || _scaleRanges.ymin !== yScale2.min || _scaleRanges.ymax !== yScale2.max;
  Object.assign(_scaleRanges, newRanges);
  return changed;
}
var atEdge = (t2) => t2 === 0 || t2 === 1;
var elasticIn = (t2, s, p) => -(Math.pow(2, 10 * (t2 -= 1)) * Math.sin((t2 - s) * TAU / p));
var elasticOut = (t2, s, p) => Math.pow(2, -10 * t2) * Math.sin((t2 - s) * TAU / p) + 1;
var effects = {
  linear: (t2) => t2,
  easeInQuad: (t2) => t2 * t2,
  easeOutQuad: (t2) => -t2 * (t2 - 2),
  easeInOutQuad: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 : -0.5 * (--t2 * (t2 - 2) - 1),
  easeInCubic: (t2) => t2 * t2 * t2,
  easeOutCubic: (t2) => (t2 -= 1) * t2 * t2 + 1,
  easeInOutCubic: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 : 0.5 * ((t2 -= 2) * t2 * t2 + 2),
  easeInQuart: (t2) => t2 * t2 * t2 * t2,
  easeOutQuart: (t2) => -((t2 -= 1) * t2 * t2 * t2 - 1),
  easeInOutQuart: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 * t2 : -0.5 * ((t2 -= 2) * t2 * t2 * t2 - 2),
  easeInQuint: (t2) => t2 * t2 * t2 * t2 * t2,
  easeOutQuint: (t2) => (t2 -= 1) * t2 * t2 * t2 * t2 + 1,
  easeInOutQuint: (t2) => (t2 /= 0.5) < 1 ? 0.5 * t2 * t2 * t2 * t2 * t2 : 0.5 * ((t2 -= 2) * t2 * t2 * t2 * t2 + 2),
  easeInSine: (t2) => -Math.cos(t2 * HALF_PI) + 1,
  easeOutSine: (t2) => Math.sin(t2 * HALF_PI),
  easeInOutSine: (t2) => -0.5 * (Math.cos(PI * t2) - 1),
  easeInExpo: (t2) => t2 === 0 ? 0 : Math.pow(2, 10 * (t2 - 1)),
  easeOutExpo: (t2) => t2 === 1 ? 1 : -Math.pow(2, -10 * t2) + 1,
  easeInOutExpo: (t2) => atEdge(t2) ? t2 : t2 < 0.5 ? 0.5 * Math.pow(2, 10 * (t2 * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t2 * 2 - 1)) + 2),
  easeInCirc: (t2) => t2 >= 1 ? t2 : -(Math.sqrt(1 - t2 * t2) - 1),
  easeOutCirc: (t2) => Math.sqrt(1 - (t2 -= 1) * t2),
  easeInOutCirc: (t2) => (t2 /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t2 * t2) - 1) : 0.5 * (Math.sqrt(1 - (t2 -= 2) * t2) + 1),
  easeInElastic: (t2) => atEdge(t2) ? t2 : elasticIn(t2, 0.075, 0.3),
  easeOutElastic: (t2) => atEdge(t2) ? t2 : elasticOut(t2, 0.075, 0.3),
  easeInOutElastic(t2) {
    const s = 0.1125;
    const p = 0.45;
    return atEdge(t2) ? t2 : t2 < 0.5 ? 0.5 * elasticIn(t2 * 2, s, p) : 0.5 + 0.5 * elasticOut(t2 * 2 - 1, s, p);
  },
  easeInBack(t2) {
    const s = 1.70158;
    return t2 * t2 * ((s + 1) * t2 - s);
  },
  easeOutBack(t2) {
    const s = 1.70158;
    return (t2 -= 1) * t2 * ((s + 1) * t2 + s) + 1;
  },
  easeInOutBack(t2) {
    let s = 1.70158;
    if ((t2 /= 0.5) < 1) {
      return 0.5 * (t2 * t2 * (((s *= 1.525) + 1) * t2 - s));
    }
    return 0.5 * ((t2 -= 2) * t2 * (((s *= 1.525) + 1) * t2 + s) + 2);
  },
  easeInBounce: (t2) => 1 - effects.easeOutBounce(1 - t2),
  easeOutBounce(t2) {
    const m = 7.5625;
    const d = 2.75;
    if (t2 < 1 / d) {
      return m * t2 * t2;
    }
    if (t2 < 2 / d) {
      return m * (t2 -= 1.5 / d) * t2 + 0.75;
    }
    if (t2 < 2.5 / d) {
      return m * (t2 -= 2.25 / d) * t2 + 0.9375;
    }
    return m * (t2 -= 2.625 / d) * t2 + 0.984375;
  },
  easeInOutBounce: (t2) => t2 < 0.5 ? effects.easeInBounce(t2 * 2) * 0.5 : effects.easeOutBounce(t2 * 2 - 1) * 0.5 + 0.5
};
function isPatternOrGradient(value2) {
  if (value2 && typeof value2 === "object") {
    const type = value2.toString();
    return type === "[object CanvasPattern]" || type === "[object CanvasGradient]";
  }
  return false;
}
function color(value2) {
  return isPatternOrGradient(value2) ? value2 : new Color(value2);
}
function getHoverColor(value2) {
  return isPatternOrGradient(value2) ? value2 : new Color(value2).saturate(0.5).darken(0.1).hexString();
}
var numbers = [
  "x",
  "y",
  "borderWidth",
  "radius",
  "tension"
];
var colors = [
  "color",
  "borderColor",
  "backgroundColor"
];
function applyAnimationsDefaults(defaults2) {
  defaults2.set("animation", {
    delay: void 0,
    duration: 1e3,
    easing: "easeOutQuart",
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0
  });
  defaults2.describe("animation", {
    _fallback: false,
    _indexable: false,
    _scriptable: (name) => name !== "onProgress" && name !== "onComplete" && name !== "fn"
  });
  defaults2.set("animations", {
    colors: {
      type: "color",
      properties: colors
    },
    numbers: {
      type: "number",
      properties: numbers
    }
  });
  defaults2.describe("animations", {
    _fallback: "animation"
  });
  defaults2.set("transitions", {
    active: {
      animation: {
        duration: 400
      }
    },
    resize: {
      animation: {
        duration: 0
      }
    },
    show: {
      animations: {
        colors: {
          from: "transparent"
        },
        visible: {
          type: "boolean",
          duration: 0
        }
      }
    },
    hide: {
      animations: {
        colors: {
          to: "transparent"
        },
        visible: {
          type: "boolean",
          easing: "linear",
          fn: (v) => v | 0
        }
      }
    }
  });
}
function applyLayoutsDefaults(defaults2) {
  defaults2.set("layout", {
    autoPadding: true,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });
}
var intlCache = /* @__PURE__ */ new Map();
function getNumberFormat(locale, options) {
  options = options || {};
  const cacheKey = locale + JSON.stringify(options);
  let formatter = intlCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    intlCache.set(cacheKey, formatter);
  }
  return formatter;
}
function formatNumber(num, locale, options) {
  return getNumberFormat(locale, options).format(num);
}
var formatters = {
  values(value2) {
    return isArray(value2) ? value2 : "" + value2;
  },
  numeric(tickValue, index, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue;
    if (ticks.length > 1) {
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
      if (maxTick < 1e-4 || maxTick > 1e15) {
        notation = "scientific";
      }
      delta = calculateDelta(tickValue, ticks);
    }
    const logDelta = log10(Math.abs(delta));
    const numDecimal = isNaN(logDelta) ? 1 : Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
    const options = {
      notation,
      minimumFractionDigits: numDecimal,
      maximumFractionDigits: numDecimal
    };
    Object.assign(options, this.options.ticks.format);
    return formatNumber(tickValue, locale, options);
  },
  logarithmic(tickValue, index, ticks) {
    if (tickValue === 0) {
      return "0";
    }
    const remain = ticks[index].significand || tickValue / Math.pow(10, Math.floor(log10(tickValue)));
    if ([
      1,
      2,
      3,
      5,
      10,
      15
    ].includes(remain) || index > 0.8 * ticks.length) {
      return formatters.numeric.call(this, tickValue, index, ticks);
    }
    return "";
  }
};
function calculateDelta(tickValue, ticks) {
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
  if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
    delta = tickValue - Math.floor(tickValue);
  }
  return delta;
}
var Ticks = {
  formatters
};
function applyScaleDefaults(defaults2) {
  defaults2.set("scale", {
    display: true,
    offset: false,
    reverse: false,
    beginAtZero: false,
    bounds: "ticks",
    clip: true,
    grace: 0,
    grid: {
      display: true,
      lineWidth: 1,
      drawOnChartArea: true,
      drawTicks: true,
      tickLength: 8,
      tickWidth: (_ctx, options) => options.lineWidth,
      tickColor: (_ctx, options) => options.color,
      offset: false
    },
    border: {
      display: true,
      dash: [],
      dashOffset: 0,
      width: 1
    },
    title: {
      display: false,
      text: "",
      padding: {
        top: 4,
        bottom: 4
      }
    },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      textStrokeWidth: 0,
      textStrokeColor: "",
      padding: 3,
      display: true,
      autoSkip: true,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ticks.formatters.values,
      minor: {},
      major: {},
      align: "center",
      crossAlign: "near",
      showLabelBackdrop: false,
      backdropColor: "rgba(255, 255, 255, 0.75)",
      backdropPadding: 2
    }
  });
  defaults2.route("scale.ticks", "color", "", "color");
  defaults2.route("scale.grid", "color", "", "borderColor");
  defaults2.route("scale.border", "color", "", "borderColor");
  defaults2.route("scale.title", "color", "", "color");
  defaults2.describe("scale", {
    _fallback: false,
    _scriptable: (name) => !name.startsWith("before") && !name.startsWith("after") && name !== "callback" && name !== "parser",
    _indexable: (name) => name !== "borderDash" && name !== "tickBorderDash" && name !== "dash"
  });
  defaults2.describe("scales", {
    _fallback: "scale"
  });
  defaults2.describe("scale.ticks", {
    _scriptable: (name) => name !== "backdropPadding" && name !== "callback",
    _indexable: (name) => name !== "backdropPadding"
  });
}
var overrides = /* @__PURE__ */ Object.create(null);
var descriptors = /* @__PURE__ */ Object.create(null);
function getScope$1(node, key) {
  if (!key) {
    return node;
  }
  const keys = key.split(".");
  for (let i = 0, n = keys.length; i < n; ++i) {
    const k = keys[i];
    node = node[k] || (node[k] = /* @__PURE__ */ Object.create(null));
  }
  return node;
}
function set(root2, scope, values) {
  if (typeof scope === "string") {
    return merge(getScope$1(root2, scope), values);
  }
  return merge(getScope$1(root2, ""), scope);
}
var Defaults = class {
  constructor(_descriptors2, _appliers) {
    this.animation = void 0;
    this.backgroundColor = "rgba(0,0,0,0.1)";
    this.borderColor = "rgba(0,0,0,0.1)";
    this.color = "#666";
    this.datasets = {};
    this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
    this.elements = {};
    this.events = [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove"
    ];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: "normal",
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};
    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
    this.hoverColor = (ctx, options) => getHoverColor(options.color);
    this.indexAxis = "x";
    this.interaction = {
      mode: "nearest",
      intersect: true,
      includeInvisible: false
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = void 0;
    this.scales = {};
    this.showLine = true;
    this.drawActiveElementsOnTop = true;
    this.describe(_descriptors2);
    this.apply(_appliers);
  }
  set(scope, values) {
    return set(this, scope, values);
  }
  get(scope) {
    return getScope$1(this, scope);
  }
  describe(scope, values) {
    return set(descriptors, scope, values);
  }
  override(scope, values) {
    return set(overrides, scope, values);
  }
  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = "_" + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,
        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];
          if (isObject(local)) {
            return Object.assign({}, target, local);
          }
          return valueOrDefault(local, target);
        },
        set(value2) {
          this[privateName] = value2;
        }
      }
    });
  }
  apply(appliers) {
    appliers.forEach((apply) => apply(this));
  }
};
var defaults = /* @__PURE__ */ new Defaults({
  _scriptable: (name) => !name.startsWith("on"),
  _indexable: (name) => name !== "events",
  hover: {
    _fallback: "interaction"
  },
  interaction: {
    _scriptable: false,
    _indexable: false
  }
}, [
  applyAnimationsDefaults,
  applyLayoutsDefaults,
  applyScaleDefaults
]);
function toFontString(font) {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return null;
  }
  return (font.style ? font.style + " " : "") + (font.weight ? font.weight + " " : "") + font.size + "px " + font.family;
}
function _measureText(ctx, data, gc, longest, string) {
  let textWidth2 = data[string];
  if (!textWidth2) {
    textWidth2 = data[string] = ctx.measureText(string).width;
    gc.push(string);
  }
  if (textWidth2 > longest) {
    longest = textWidth2;
  }
  return longest;
}
function _longestText(ctx, font, arrayOfThings, cache2) {
  cache2 = cache2 || {};
  let data = cache2.data = cache2.data || {};
  let gc = cache2.garbageCollect = cache2.garbageCollect || [];
  if (cache2.font !== font) {
    data = cache2.data = {};
    gc = cache2.garbageCollect = [];
    cache2.font = font;
  }
  ctx.save();
  ctx.font = font;
  let longest = 0;
  const ilen = arrayOfThings.length;
  let i, j, jlen, thing, nestedThing;
  for (i = 0; i < ilen; i++) {
    thing = arrayOfThings[i];
    if (thing !== void 0 && thing !== null && !isArray(thing)) {
      longest = _measureText(ctx, data, gc, longest, thing);
    } else if (isArray(thing)) {
      for (j = 0, jlen = thing.length; j < jlen; j++) {
        nestedThing = thing[j];
        if (nestedThing !== void 0 && nestedThing !== null && !isArray(nestedThing)) {
          longest = _measureText(ctx, data, gc, longest, nestedThing);
        }
      }
    }
  }
  ctx.restore();
  const gcLen = gc.length / 2;
  if (gcLen > arrayOfThings.length) {
    for (i = 0; i < gcLen; i++) {
      delete data[gc[i]];
    }
    gc.splice(0, gcLen);
  }
  return longest;
}
function _alignPixel(chart, pixel, width) {
  const devicePixelRatio = chart.currentDevicePixelRatio;
  const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
  return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}
function clearCanvas(canvas, ctx) {
  if (!ctx && !canvas) {
    return;
  }
  ctx = ctx || canvas.getContext("2d");
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
function drawPoint(ctx, options, x, y) {
  drawPointLegend(ctx, options, x, y, null);
}
function drawPointLegend(ctx, options, x, y, w) {
  let type, xOffset, yOffset, size, cornerRadius, width, xOffsetW, yOffsetW;
  const style = options.pointStyle;
  const rotation = options.rotation;
  const radius = options.radius;
  let rad = (rotation || 0) * RAD_PER_DEG;
  if (style && typeof style === "object") {
    type = style.toString();
    if (type === "[object HTMLImageElement]" || type === "[object HTMLCanvasElement]") {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
      ctx.restore();
      return;
    }
  }
  if (isNaN(radius) || radius <= 0) {
    return;
  }
  ctx.beginPath();
  switch (style) {
    // Default includes circle
    default:
      if (w) {
        ctx.ellipse(x, y, w / 2, radius, 0, 0, TAU);
      } else {
        ctx.arc(x, y, radius, 0, TAU);
      }
      ctx.closePath();
      break;
    case "triangle":
      width = w ? w / 2 : radius;
      ctx.moveTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * width, y - Math.cos(rad) * radius);
      ctx.closePath();
      break;
    case "rectRounded":
      cornerRadius = radius * 0.516;
      size = radius - cornerRadius;
      xOffset = Math.cos(rad + QUARTER_PI) * size;
      xOffsetW = Math.cos(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
      yOffset = Math.sin(rad + QUARTER_PI) * size;
      yOffsetW = Math.sin(rad + QUARTER_PI) * (w ? w / 2 - cornerRadius : size);
      ctx.arc(x - xOffsetW, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
      ctx.arc(x + yOffsetW, y - xOffset, cornerRadius, rad - HALF_PI, rad);
      ctx.arc(x + xOffsetW, y + yOffset, cornerRadius, rad, rad + HALF_PI);
      ctx.arc(x - yOffsetW, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
      ctx.closePath();
      break;
    case "rect":
      if (!rotation) {
        size = Math.SQRT1_2 * radius;
        width = w ? w / 2 : size;
        ctx.rect(x - width, y - size, 2 * width, 2 * size);
        break;
      }
      rad += QUARTER_PI;
    /* falls through */
    case "rectRot":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      ctx.closePath();
      break;
    case "crossRot":
      rad += QUARTER_PI;
    /* falls through */
    case "cross":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      break;
    case "star":
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      rad += QUARTER_PI;
      xOffsetW = Math.cos(rad) * (w ? w / 2 : radius);
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      yOffsetW = Math.sin(rad) * (w ? w / 2 : radius);
      ctx.moveTo(x - xOffsetW, y - yOffset);
      ctx.lineTo(x + xOffsetW, y + yOffset);
      ctx.moveTo(x + yOffsetW, y - xOffset);
      ctx.lineTo(x - yOffsetW, y + xOffset);
      break;
    case "line":
      xOffset = w ? w / 2 : Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      break;
    case "dash":
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(rad) * (w ? w / 2 : radius), y + Math.sin(rad) * radius);
      break;
    case false:
      ctx.closePath();
      break;
  }
  ctx.fill();
  if (options.borderWidth > 0) {
    ctx.stroke();
  }
}
function _isPointInArea(point, area, margin) {
  margin = margin || 0.5;
  return !area || point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}
function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}
function unclipArea(ctx) {
  ctx.restore();
}
function _steppedLineTo(ctx, previous, target, flip, mode) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  if (mode === "middle") {
    const midpoint = (previous.x + target.x) / 2;
    ctx.lineTo(midpoint, previous.y);
    ctx.lineTo(midpoint, target.y);
  } else if (mode === "after" !== !!flip) {
    ctx.lineTo(previous.x, target.y);
  } else {
    ctx.lineTo(target.x, previous.y);
  }
  ctx.lineTo(target.x, target.y);
}
function _bezierCurveTo(ctx, previous, target, flip) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }
  ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
}
function setRenderOpts(ctx, opts) {
  if (opts.translation) {
    ctx.translate(opts.translation[0], opts.translation[1]);
  }
  if (!isNullOrUndef(opts.rotation)) {
    ctx.rotate(opts.rotation);
  }
  if (opts.color) {
    ctx.fillStyle = opts.color;
  }
  if (opts.textAlign) {
    ctx.textAlign = opts.textAlign;
  }
  if (opts.textBaseline) {
    ctx.textBaseline = opts.textBaseline;
  }
}
function decorateText(ctx, x, y, line, opts) {
  if (opts.strikethrough || opts.underline) {
    const metrics = ctx.measureText(line);
    const left = x - metrics.actualBoundingBoxLeft;
    const right = x + metrics.actualBoundingBoxRight;
    const top = y - metrics.actualBoundingBoxAscent;
    const bottom = y + metrics.actualBoundingBoxDescent;
    const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.lineWidth = opts.decorationWidth || 2;
    ctx.moveTo(left, yDecoration);
    ctx.lineTo(right, yDecoration);
    ctx.stroke();
  }
}
function drawBackdrop(ctx, opts) {
  const oldColor = ctx.fillStyle;
  ctx.fillStyle = opts.color;
  ctx.fillRect(opts.left, opts.top, opts.width, opts.height);
  ctx.fillStyle = oldColor;
}
function renderText(ctx, text, x, y, font, opts = {}) {
  const lines = isArray(text) ? text : [
    text
  ];
  const stroke = opts.strokeWidth > 0 && opts.strokeColor !== "";
  let i, line;
  ctx.save();
  ctx.font = font.string;
  setRenderOpts(ctx, opts);
  for (i = 0; i < lines.length; ++i) {
    line = lines[i];
    if (opts.backdrop) {
      drawBackdrop(ctx, opts.backdrop);
    }
    if (stroke) {
      if (opts.strokeColor) {
        ctx.strokeStyle = opts.strokeColor;
      }
      if (!isNullOrUndef(opts.strokeWidth)) {
        ctx.lineWidth = opts.strokeWidth;
      }
      ctx.strokeText(line, x, y, opts.maxWidth);
    }
    ctx.fillText(line, x, y, opts.maxWidth);
    decorateText(ctx, x, y, line, opts);
    y += Number(font.lineHeight);
  }
  ctx.restore();
}
function addRoundedRectPath(ctx, rect) {
  const { x, y, w, h, radius } = rect;
  ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, 1.5 * PI, PI, true);
  ctx.lineTo(x, y + h - radius.bottomLeft);
  ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
  ctx.lineTo(x + w - radius.bottomRight, y + h);
  ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
  ctx.lineTo(x + w, y + radius.topRight);
  ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
  ctx.lineTo(x + radius.topLeft, y);
}
var LINE_HEIGHT = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/;
var FONT_STYLE = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function toLineHeight(value2, size) {
  const matches = ("" + value2).match(LINE_HEIGHT);
  if (!matches || matches[1] === "normal") {
    return size * 1.2;
  }
  value2 = +matches[2];
  switch (matches[3]) {
    case "px":
      return value2;
    case "%":
      value2 /= 100;
      break;
  }
  return size * value2;
}
var numberOrZero = (v) => +v || 0;
function _readValueToProps(value2, props) {
  const ret = {};
  const objProps = isObject(props);
  const keys = objProps ? Object.keys(props) : props;
  const read2 = isObject(value2) ? objProps ? (prop) => valueOrDefault(value2[prop], value2[props[prop]]) : (prop) => value2[prop] : () => value2;
  for (const prop of keys) {
    ret[prop] = numberOrZero(read2(prop));
  }
  return ret;
}
function toTRBL(value2) {
  return _readValueToProps(value2, {
    top: "y",
    right: "x",
    bottom: "y",
    left: "x"
  });
}
function toTRBLCorners(value2) {
  return _readValueToProps(value2, [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);
}
function toPadding(value2) {
  const obj = toTRBL(value2);
  obj.width = obj.left + obj.right;
  obj.height = obj.top + obj.bottom;
  return obj;
}
function toFont(options, fallback) {
  options = options || {};
  fallback = fallback || defaults.font;
  let size = valueOrDefault(options.size, fallback.size);
  if (typeof size === "string") {
    size = parseInt(size, 10);
  }
  let style = valueOrDefault(options.style, fallback.style);
  if (style && !("" + style).match(FONT_STYLE)) {
    console.warn('Invalid font style specified: "' + style + '"');
    style = void 0;
  }
  const font = {
    family: valueOrDefault(options.family, fallback.family),
    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
    size,
    style,
    weight: valueOrDefault(options.weight, fallback.weight),
    string: ""
  };
  font.string = toFontString(font);
  return font;
}
function resolve(inputs, context, index, info) {
  let cacheable = true;
  let i, ilen, value2;
  for (i = 0, ilen = inputs.length; i < ilen; ++i) {
    value2 = inputs[i];
    if (value2 === void 0) {
      continue;
    }
    if (context !== void 0 && typeof value2 === "function") {
      value2 = value2(context);
      cacheable = false;
    }
    if (index !== void 0 && isArray(value2)) {
      value2 = value2[index % value2.length];
      cacheable = false;
    }
    if (value2 !== void 0) {
      if (info && !cacheable) {
        info.cacheable = false;
      }
      return value2;
    }
  }
}
function _addGrace(minmax, grace, beginAtZero) {
  const { min, max } = minmax;
  const change = toDimension(grace, (max - min) / 2);
  const keepZero = (value2, add) => beginAtZero && value2 === 0 ? 0 : value2 + add;
  return {
    min: keepZero(min, -Math.abs(change)),
    max: keepZero(max, change)
  };
}
function createContext(parentContext, context) {
  return Object.assign(Object.create(parentContext), context);
}
function _createResolver(scopes, prefixes = [
  ""
], rootScopes, fallback, getTarget = () => scopes[0]) {
  const finalRootScopes = rootScopes || scopes;
  if (typeof fallback === "undefined") {
    fallback = _resolve("_fallback", scopes);
  }
  const cache2 = {
    [Symbol.toStringTag]: "Object",
    _cacheable: true,
    _scopes: scopes,
    _rootScopes: finalRootScopes,
    _fallback: fallback,
    _getTarget: getTarget,
    override: (scope) => _createResolver([
      scope,
      ...scopes
    ], prefixes, finalRootScopes, fallback)
  };
  return new Proxy(cache2, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete target._keys;
      delete scopes[0][prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop) {
      return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(scopes[0]);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return getKeysFromAllScopes(target).includes(prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys(target) {
      return getKeysFromAllScopes(target);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value2) {
      const storage = target._storage || (target._storage = getTarget());
      target[prop] = storage[prop] = value2;
      delete target._keys;
      return true;
    }
  });
}
function _attachContext(proxy, context, subProxy, descriptorDefaults) {
  const cache2 = {
    _cacheable: false,
    _proxy: proxy,
    _context: context,
    _subProxy: subProxy,
    _stack: /* @__PURE__ */ new Set(),
    _descriptors: _descriptors(proxy, descriptorDefaults),
    setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
    override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
  };
  return new Proxy(cache2, {
    /**
    * A trap for the delete operator.
    */
    deleteProperty(target, prop) {
      delete target[prop];
      delete proxy[prop];
      return true;
    },
    /**
    * A trap for getting property values.
    */
    get(target, prop, receiver) {
      return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
    },
    /**
    * A trap for Object.getOwnPropertyDescriptor.
    * Also used by Object.hasOwnProperty.
    */
    getOwnPropertyDescriptor(target, prop) {
      return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
        enumerable: true,
        configurable: true
      } : void 0 : Reflect.getOwnPropertyDescriptor(proxy, prop);
    },
    /**
    * A trap for Object.getPrototypeOf.
    */
    getPrototypeOf() {
      return Reflect.getPrototypeOf(proxy);
    },
    /**
    * A trap for the in operator.
    */
    has(target, prop) {
      return Reflect.has(proxy, prop);
    },
    /**
    * A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    */
    ownKeys() {
      return Reflect.ownKeys(proxy);
    },
    /**
    * A trap for setting property values.
    */
    set(target, prop, value2) {
      proxy[prop] = value2;
      delete target[prop];
      return true;
    }
  });
}
function _descriptors(proxy, defaults2 = {
  scriptable: true,
  indexable: true
}) {
  const { _scriptable = defaults2.scriptable, _indexable = defaults2.indexable, _allKeys = defaults2.allKeys } = proxy;
  return {
    allKeys: _allKeys,
    scriptable: _scriptable,
    indexable: _indexable,
    isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
    isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
  };
}
var readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
var needsSubResolver = (prop, value2) => isObject(value2) && prop !== "adapters" && (Object.getPrototypeOf(value2) === null || value2.constructor === Object);
function _cached(target, prop, resolve2) {
  if (Object.prototype.hasOwnProperty.call(target, prop) || prop === "constructor") {
    return target[prop];
  }
  const value2 = resolve2();
  target[prop] = value2;
  return value2;
}
function _resolveWithContext(target, prop, receiver) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  let value2 = _proxy[prop];
  if (isFunction(value2) && descriptors2.isScriptable(prop)) {
    value2 = _resolveScriptable(prop, value2, target, receiver);
  }
  if (isArray(value2) && value2.length) {
    value2 = _resolveArray(prop, value2, target, descriptors2.isIndexable);
  }
  if (needsSubResolver(prop, value2)) {
    value2 = _attachContext(value2, _context, _subProxy && _subProxy[prop], descriptors2);
  }
  return value2;
}
function _resolveScriptable(prop, getValue, target, receiver) {
  const { _proxy, _context, _subProxy, _stack } = target;
  if (_stack.has(prop)) {
    throw new Error("Recursion detected: " + Array.from(_stack).join("->") + "->" + prop);
  }
  _stack.add(prop);
  let value2 = getValue(_context, _subProxy || receiver);
  _stack.delete(prop);
  if (needsSubResolver(prop, value2)) {
    value2 = createSubResolver(_proxy._scopes, _proxy, prop, value2);
  }
  return value2;
}
function _resolveArray(prop, value2, target, isIndexable) {
  const { _proxy, _context, _subProxy, _descriptors: descriptors2 } = target;
  if (typeof _context.index !== "undefined" && isIndexable(prop)) {
    return value2[_context.index % value2.length];
  } else if (isObject(value2[0])) {
    const arr = value2;
    const scopes = _proxy._scopes.filter((s) => s !== arr);
    value2 = [];
    for (const item of arr) {
      const resolver = createSubResolver(scopes, _proxy, prop, item);
      value2.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors2));
    }
  }
  return value2;
}
function resolveFallback(fallback, prop, value2) {
  return isFunction(fallback) ? fallback(prop, value2) : fallback;
}
var getScope = (key, parent) => key === true ? parent : typeof key === "string" ? resolveObjectKey(parent, key) : void 0;
function addScopes(set2, parentScopes, key, parentFallback, value2) {
  for (const parent of parentScopes) {
    const scope = getScope(key, parent);
    if (scope) {
      set2.add(scope);
      const fallback = resolveFallback(scope._fallback, key, value2);
      if (typeof fallback !== "undefined" && fallback !== key && fallback !== parentFallback) {
        return fallback;
      }
    } else if (scope === false && typeof parentFallback !== "undefined" && key !== parentFallback) {
      return null;
    }
  }
  return false;
}
function createSubResolver(parentScopes, resolver, prop, value2) {
  const rootScopes = resolver._rootScopes;
  const fallback = resolveFallback(resolver._fallback, prop, value2);
  const allScopes = [
    ...parentScopes,
    ...rootScopes
  ];
  const set2 = /* @__PURE__ */ new Set();
  set2.add(value2);
  let key = addScopesFromKey(set2, allScopes, prop, fallback || prop, value2);
  if (key === null) {
    return false;
  }
  if (typeof fallback !== "undefined" && fallback !== prop) {
    key = addScopesFromKey(set2, allScopes, fallback, key, value2);
    if (key === null) {
      return false;
    }
  }
  return _createResolver(Array.from(set2), [
    ""
  ], rootScopes, fallback, () => subGetTarget(resolver, prop, value2));
}
function addScopesFromKey(set2, allScopes, key, fallback, item) {
  while (key) {
    key = addScopes(set2, allScopes, key, fallback, item);
  }
  return key;
}
function subGetTarget(resolver, prop, value2) {
  const parent = resolver._getTarget();
  if (!(prop in parent)) {
    parent[prop] = {};
  }
  const target = parent[prop];
  if (isArray(target) && isObject(value2)) {
    return value2;
  }
  return target || {};
}
function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
  let value2;
  for (const prefix of prefixes) {
    value2 = _resolve(readKey(prefix, prop), scopes);
    if (typeof value2 !== "undefined") {
      return needsSubResolver(prop, value2) ? createSubResolver(scopes, proxy, prop, value2) : value2;
    }
  }
}
function _resolve(key, scopes) {
  for (const scope of scopes) {
    if (!scope) {
      continue;
    }
    const value2 = scope[key];
    if (typeof value2 !== "undefined") {
      return value2;
    }
  }
}
function getKeysFromAllScopes(target) {
  let keys = target._keys;
  if (!keys) {
    keys = target._keys = resolveKeysFromAllScopes(target._scopes);
  }
  return keys;
}
function resolveKeysFromAllScopes(scopes) {
  const set2 = /* @__PURE__ */ new Set();
  for (const scope of scopes) {
    for (const key of Object.keys(scope).filter((k) => !k.startsWith("_"))) {
      set2.add(key);
    }
  }
  return Array.from(set2);
}
var EPSILON = Number.EPSILON || 1e-14;
var getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
var getValueAxis = (indexAxis) => indexAxis === "x" ? "y" : "x";
function splineCurve(firstPoint, middlePoint, afterPoint, t2) {
  const previous = firstPoint.skip ? middlePoint : firstPoint;
  const current2 = middlePoint;
  const next = afterPoint.skip ? middlePoint : afterPoint;
  const d01 = distanceBetweenPoints(current2, previous);
  const d12 = distanceBetweenPoints(next, current2);
  let s01 = d01 / (d01 + d12);
  let s12 = d12 / (d01 + d12);
  s01 = isNaN(s01) ? 0 : s01;
  s12 = isNaN(s12) ? 0 : s12;
  const fa = t2 * s01;
  const fb = t2 * s12;
  return {
    previous: {
      x: current2.x - fa * (next.x - previous.x),
      y: current2.y - fa * (next.y - previous.y)
    },
    next: {
      x: current2.x + fb * (next.x - previous.x),
      y: current2.y + fb * (next.y - previous.y)
    }
  };
}
function monotoneAdjust(points, deltaK, mK) {
  const pointsLen = points.length;
  let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen - 1; ++i) {
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent || !pointAfter) {
      continue;
    }
    if (almostEquals(deltaK[i], 0, EPSILON)) {
      mK[i] = mK[i + 1] = 0;
      continue;
    }
    alphaK = mK[i] / deltaK[i];
    betaK = mK[i + 1] / deltaK[i];
    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
    if (squaredMagnitude <= 9) {
      continue;
    }
    tauK = 3 / Math.sqrt(squaredMagnitude);
    mK[i] = alphaK * tauK * deltaK[i];
    mK[i + 1] = betaK * tauK * deltaK[i];
  }
}
function monotoneCompute(points, mK, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  let delta, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (let i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    const iPixel = pointCurrent[indexAxis];
    const vPixel = pointCurrent[valueAxis];
    if (pointBefore) {
      delta = (iPixel - pointBefore[indexAxis]) / 3;
      pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
      pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
    }
    if (pointAfter) {
      delta = (pointAfter[indexAxis] - iPixel) / 3;
      pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
      pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
    }
  }
}
function splineCurveMonotone(points, indexAxis = "x") {
  const valueAxis = getValueAxis(indexAxis);
  const pointsLen = points.length;
  const deltaK = Array(pointsLen).fill(0);
  const mK = Array(pointsLen);
  let i, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);
  for (i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);
    if (!pointCurrent) {
      continue;
    }
    if (pointAfter) {
      const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
      deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
    }
    mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
  }
  monotoneAdjust(points, deltaK, mK);
  monotoneCompute(points, mK, indexAxis);
}
function capControlPoint(pt, min, max) {
  return Math.max(Math.min(pt, max), min);
}
function capBezierPoints(points, area) {
  let i, ilen, point, inArea, inAreaPrev;
  let inAreaNext = _isPointInArea(points[0], area);
  for (i = 0, ilen = points.length; i < ilen; ++i) {
    inAreaPrev = inArea;
    inArea = inAreaNext;
    inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
    if (!inArea) {
      continue;
    }
    point = points[i];
    if (inAreaPrev) {
      point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
      point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
    }
    if (inAreaNext) {
      point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
      point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
    }
  }
}
function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
  let i, ilen, point, controlPoints;
  if (options.spanGaps) {
    points = points.filter((pt) => !pt.skip);
  }
  if (options.cubicInterpolationMode === "monotone") {
    splineCurveMonotone(points, indexAxis);
  } else {
    let prev = loop ? points[points.length - 1] : points[0];
    for (i = 0, ilen = points.length; i < ilen; ++i) {
      point = points[i];
      controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
      point.cp1x = controlPoints.previous.x;
      point.cp1y = controlPoints.previous.y;
      point.cp2x = controlPoints.next.x;
      point.cp2y = controlPoints.next.y;
      prev = point;
    }
  }
  if (options.capBezierPoints) {
    capBezierPoints(points, area);
  }
}
function _isDomSupported() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function _getParentNode(domNode) {
  let parent = domNode.parentNode;
  if (parent && parent.toString() === "[object ShadowRoot]") {
    parent = parent.host;
  }
  return parent;
}
function parseMaxStyle(styleValue, node, parentProperty) {
  let valueInPixels;
  if (typeof styleValue === "string") {
    valueInPixels = parseInt(styleValue, 10);
    if (styleValue.indexOf("%") !== -1) {
      valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
    }
  } else {
    valueInPixels = styleValue;
  }
  return valueInPixels;
}
var getComputedStyle2 = (element) => element.ownerDocument.defaultView.getComputedStyle(element, null);
function getStyle(el2, property) {
  return getComputedStyle2(el2).getPropertyValue(property);
}
var positions = [
  "top",
  "right",
  "bottom",
  "left"
];
function getPositionedStyle(styles, style, suffix) {
  const result = {};
  suffix = suffix ? "-" + suffix : "";
  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    result[pos] = parseFloat(styles[style + "-" + pos + suffix]) || 0;
  }
  result.width = result.left + result.right;
  result.height = result.top + result.bottom;
  return result;
}
var useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
function getCanvasPosition(e, canvas) {
  const touches = e.touches;
  const source = touches && touches.length ? touches[0] : e;
  const { offsetX, offsetY } = source;
  let box = false;
  let x, y;
  if (useOffsetPos(offsetX, offsetY, e.target)) {
    x = offsetX;
    y = offsetY;
  } else {
    const rect = canvas.getBoundingClientRect();
    x = source.clientX - rect.left;
    y = source.clientY - rect.top;
    box = true;
  }
  return {
    x,
    y,
    box
  };
}
function getRelativePosition(event, chart) {
  if ("native" in event) {
    return event;
  }
  const { canvas, currentDevicePixelRatio } = chart;
  const style = getComputedStyle2(canvas);
  const borderBox = style.boxSizing === "border-box";
  const paddings = getPositionedStyle(style, "padding");
  const borders = getPositionedStyle(style, "border", "width");
  const { x, y, box } = getCanvasPosition(event, canvas);
  const xOffset = paddings.left + (box && borders.left);
  const yOffset = paddings.top + (box && borders.top);
  let { width, height } = chart;
  if (borderBox) {
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  return {
    x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
    y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
  };
}
function getContainerSize(canvas, width, height) {
  let maxWidth, maxHeight;
  if (width === void 0 || height === void 0) {
    const container = canvas && _getParentNode(canvas);
    if (!container) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    } else {
      const rect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle2(container);
      const containerBorder = getPositionedStyle(containerStyle, "border", "width");
      const containerPadding = getPositionedStyle(containerStyle, "padding");
      width = rect.width - containerPadding.width - containerBorder.width;
      height = rect.height - containerPadding.height - containerBorder.height;
      maxWidth = parseMaxStyle(containerStyle.maxWidth, container, "clientWidth");
      maxHeight = parseMaxStyle(containerStyle.maxHeight, container, "clientHeight");
    }
  }
  return {
    width,
    height,
    maxWidth: maxWidth || INFINITY,
    maxHeight: maxHeight || INFINITY
  };
}
var round1 = (v) => Math.round(v * 10) / 10;
function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
  const style = getComputedStyle2(canvas);
  const margins = getPositionedStyle(style, "margin");
  const maxWidth = parseMaxStyle(style.maxWidth, canvas, "clientWidth") || INFINITY;
  const maxHeight = parseMaxStyle(style.maxHeight, canvas, "clientHeight") || INFINITY;
  const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
  let { width, height } = containerSize;
  if (style.boxSizing === "content-box") {
    const borders = getPositionedStyle(style, "border", "width");
    const paddings = getPositionedStyle(style, "padding");
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }
  width = Math.max(0, width - margins.width);
  height = Math.max(0, aspectRatio ? width / aspectRatio : height - margins.height);
  width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
  height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
  if (width && !height) {
    height = round1(width / 2);
  }
  const maintainHeight = bbWidth !== void 0 || bbHeight !== void 0;
  if (maintainHeight && aspectRatio && containerSize.height && height > containerSize.height) {
    height = containerSize.height;
    width = round1(Math.floor(height * aspectRatio));
  }
  return {
    width,
    height
  };
}
function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = forceRatio || 1;
  const deviceHeight = round1(chart.height * pixelRatio);
  const deviceWidth = round1(chart.width * pixelRatio);
  chart.height = round1(chart.height);
  chart.width = round1(chart.width);
  const canvas = chart.canvas;
  if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
    canvas.style.height = `${chart.height}px`;
    canvas.style.width = `${chart.width}px`;
  }
  const canvasHeight = Math.floor(deviceHeight);
  const canvasWidth = Math.floor(deviceWidth);
  if (chart.currentDevicePixelRatio !== pixelRatio || canvas.height !== canvasHeight || canvas.width !== canvasWidth) {
    chart.currentDevicePixelRatio = pixelRatio;
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    return true;
  }
  return false;
}
var supportsEventListenerOptions = (function() {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    if (_isDomSupported()) {
      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    }
  } catch (e) {
  }
  return passiveSupported;
})();
function readUsedSize(element, property) {
  const value2 = getStyle(element, property);
  const matches = value2 && value2.match(/^(\d+)(\.\d+)?px$/);
  return matches ? +matches[1] : void 0;
}
function _pointInLine(p1, p2, t2, mode) {
  return {
    x: p1.x + t2 * (p2.x - p1.x),
    y: p1.y + t2 * (p2.y - p1.y)
  };
}
function _steppedInterpolation(p1, p2, t2, mode) {
  return {
    x: p1.x + t2 * (p2.x - p1.x),
    y: mode === "middle" ? t2 < 0.5 ? p1.y : p2.y : mode === "after" ? t2 < 1 ? p1.y : p2.y : t2 > 0 ? p2.y : p1.y
  };
}
function _bezierInterpolation(p1, p2, t2, mode) {
  const cp1 = {
    x: p1.cp2x,
    y: p1.cp2y
  };
  const cp2 = {
    x: p2.cp1x,
    y: p2.cp1y
  };
  const a = _pointInLine(p1, cp1, t2);
  const b = _pointInLine(cp1, cp2, t2);
  const c = _pointInLine(cp2, p2, t2);
  const d = _pointInLine(a, b, t2);
  const e = _pointInLine(b, c, t2);
  return _pointInLine(d, e, t2);
}
var getRightToLeftAdapter = function(rectX, width) {
  return {
    x(x) {
      return rectX + rectX + width - x;
    },
    setWidth(w) {
      width = w;
    },
    textAlign(align) {
      if (align === "center") {
        return align;
      }
      return align === "right" ? "left" : "right";
    },
    xPlus(x, value2) {
      return x - value2;
    },
    leftForLtr(x, itemWidth) {
      return x - itemWidth;
    }
  };
};
var getLeftToRightAdapter = function() {
  return {
    x(x) {
      return x;
    },
    setWidth(w) {
    },
    textAlign(align) {
      return align;
    },
    xPlus(x, value2) {
      return x + value2;
    },
    leftForLtr(x, _itemWidth) {
      return x;
    }
  };
};
function getRtlAdapter(rtl, rectX, width) {
  return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}
function overrideTextDirection(ctx, direction) {
  let style, original;
  if (direction === "ltr" || direction === "rtl") {
    style = ctx.canvas.style;
    original = [
      style.getPropertyValue("direction"),
      style.getPropertyPriority("direction")
    ];
    style.setProperty("direction", direction, "important");
    ctx.prevTextDirection = original;
  }
}
function restoreTextDirection(ctx, original) {
  if (original !== void 0) {
    delete ctx.prevTextDirection;
    ctx.canvas.style.setProperty("direction", original[0], original[1]);
  }
}
function propertyFn(property) {
  if (property === "angle") {
    return {
      between: _angleBetween,
      compare: _angleDiff,
      normalize: _normalizeAngle
    };
  }
  return {
    between: _isBetween,
    compare: (a, b) => a - b,
    normalize: (x) => x
  };
}
function normalizeSegment({ start, end, count, loop, style }) {
  return {
    start: start % count,
    end: end % count,
    loop: loop && (end - start + 1) % count === 0,
    style
  };
}
function getSegment(segment, points, bounds) {
  const { property, start: startBound, end: endBound } = bounds;
  const { between, normalize } = propertyFn(property);
  const count = points.length;
  let { start, end, loop } = segment;
  let i, ilen;
  if (loop) {
    start += count;
    end += count;
    for (i = 0, ilen = count; i < ilen; ++i) {
      if (!between(normalize(points[start % count][property]), startBound, endBound)) {
        break;
      }
      start--;
      end--;
    }
    start %= count;
    end %= count;
  }
  if (end < start) {
    end += count;
  }
  return {
    start,
    end,
    loop,
    style: segment.style
  };
}
function _boundSegment(segment, points, bounds) {
  if (!bounds) {
    return [
      segment
    ];
  }
  const { property, start: startBound, end: endBound } = bounds;
  const count = points.length;
  const { compare, between, normalize } = propertyFn(property);
  const { start, end, loop, style } = getSegment(segment, points, bounds);
  const result = [];
  let inside = false;
  let subStart = null;
  let value2, point, prevValue;
  const startIsBefore = () => between(startBound, prevValue, value2) && compare(startBound, prevValue) !== 0;
  const endIsBefore = () => compare(endBound, value2) === 0 || between(endBound, prevValue, value2);
  const shouldStart = () => inside || startIsBefore();
  const shouldStop = () => !inside || endIsBefore();
  for (let i = start, prev = start; i <= end; ++i) {
    point = points[i % count];
    if (point.skip) {
      continue;
    }
    value2 = normalize(point[property]);
    if (value2 === prevValue) {
      continue;
    }
    inside = between(value2, startBound, endBound);
    if (subStart === null && shouldStart()) {
      subStart = compare(value2, startBound) === 0 ? i : prev;
    }
    if (subStart !== null && shouldStop()) {
      result.push(normalizeSegment({
        start: subStart,
        end: i,
        loop,
        count,
        style
      }));
      subStart = null;
    }
    prev = i;
    prevValue = value2;
  }
  if (subStart !== null) {
    result.push(normalizeSegment({
      start: subStart,
      end,
      loop,
      count,
      style
    }));
  }
  return result;
}
function _boundSegments(line, bounds) {
  const result = [];
  const segments = line.segments;
  for (let i = 0; i < segments.length; i++) {
    const sub = _boundSegment(segments[i], line.points, bounds);
    if (sub.length) {
      result.push(...sub);
    }
  }
  return result;
}
function findStartAndEnd(points, count, loop, spanGaps) {
  let start = 0;
  let end = count - 1;
  if (loop && !spanGaps) {
    while (start < count && !points[start].skip) {
      start++;
    }
  }
  while (start < count && points[start].skip) {
    start++;
  }
  start %= count;
  if (loop) {
    end += start;
  }
  while (end > start && points[end % count].skip) {
    end--;
  }
  end %= count;
  return {
    start,
    end
  };
}
function solidSegments(points, start, max, loop) {
  const count = points.length;
  const result = [];
  let last = start;
  let prev = points[start];
  let end;
  for (end = start + 1; end <= max; ++end) {
    const cur = points[end % count];
    if (cur.skip || cur.stop) {
      if (!prev.skip) {
        loop = false;
        result.push({
          start: start % count,
          end: (end - 1) % count,
          loop
        });
        start = last = cur.stop ? end : null;
      }
    } else {
      last = end;
      if (prev.skip) {
        start = end;
      }
    }
    prev = cur;
  }
  if (last !== null) {
    result.push({
      start: start % count,
      end: last % count,
      loop
    });
  }
  return result;
}
function _computeSegments(line, segmentOptions) {
  const points = line.points;
  const spanGaps = line.options.spanGaps;
  const count = points.length;
  if (!count) {
    return [];
  }
  const loop = !!line._loop;
  const { start, end } = findStartAndEnd(points, count, loop, spanGaps);
  if (spanGaps === true) {
    return splitByStyles(line, [
      {
        start,
        end,
        loop
      }
    ], points, segmentOptions);
  }
  const max = end < start ? end + count : end;
  const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
  return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
}
function splitByStyles(line, segments, points, segmentOptions) {
  if (!segmentOptions || !segmentOptions.setContext || !points) {
    return segments;
  }
  return doSplitByStyles(line, segments, points, segmentOptions);
}
function doSplitByStyles(line, segments, points, segmentOptions) {
  const chartContext = line._chart.getContext();
  const baseStyle = readStyle(line.options);
  const { _datasetIndex: datasetIndex, options: { spanGaps } } = line;
  const count = points.length;
  const result = [];
  let prevStyle = baseStyle;
  let start = segments[0].start;
  let i = start;
  function addStyle(s, e, l, st) {
    const dir = spanGaps ? -1 : 1;
    if (s === e) {
      return;
    }
    s += count;
    while (points[s % count].skip) {
      s -= dir;
    }
    while (points[e % count].skip) {
      e += dir;
    }
    if (s % count !== e % count) {
      result.push({
        start: s % count,
        end: e % count,
        loop: l,
        style: st
      });
      prevStyle = st;
      start = e % count;
    }
  }
  for (const segment of segments) {
    start = spanGaps ? start : segment.start;
    let prev = points[start % count];
    let style;
    for (i = start + 1; i <= segment.end; i++) {
      const pt = points[i % count];
      style = readStyle(segmentOptions.setContext(createContext(chartContext, {
        type: "segment",
        p0: prev,
        p1: pt,
        p0DataIndex: (i - 1) % count,
        p1DataIndex: i % count,
        datasetIndex
      })));
      if (styleChanged(style, prevStyle)) {
        addStyle(start, i - 1, segment.loop, prevStyle);
      }
      prev = pt;
      prevStyle = style;
    }
    if (start < i - 1) {
      addStyle(start, i - 1, segment.loop, prevStyle);
    }
  }
  return result;
}
function readStyle(options) {
  return {
    backgroundColor: options.backgroundColor,
    borderCapStyle: options.borderCapStyle,
    borderDash: options.borderDash,
    borderDashOffset: options.borderDashOffset,
    borderJoinStyle: options.borderJoinStyle,
    borderWidth: options.borderWidth,
    borderColor: options.borderColor
  };
}
function styleChanged(style, prevStyle) {
  if (!prevStyle) {
    return false;
  }
  const cache2 = [];
  const replacer = function(key, value2) {
    if (!isPatternOrGradient(value2)) {
      return value2;
    }
    if (!cache2.includes(value2)) {
      cache2.push(value2);
    }
    return cache2.indexOf(value2);
  };
  return JSON.stringify(style, replacer) !== JSON.stringify(prevStyle, replacer);
}
function getSizeForArea(scale, chartArea, field) {
  return scale.options.clip ? scale[field] : chartArea[field];
}
function getDatasetArea(meta, chartArea) {
  const { xScale: xScale2, yScale: yScale2 } = meta;
  if (xScale2 && yScale2) {
    return {
      left: getSizeForArea(xScale2, chartArea, "left"),
      right: getSizeForArea(xScale2, chartArea, "right"),
      top: getSizeForArea(yScale2, chartArea, "top"),
      bottom: getSizeForArea(yScale2, chartArea, "bottom")
    };
  }
  return chartArea;
}
function getDatasetClipArea(chart, meta) {
  const clip = meta._clip;
  if (clip.disabled) {
    return false;
  }
  const area = getDatasetArea(meta, chart.chartArea);
  return {
    left: clip.left === false ? 0 : area.left - (clip.left === true ? 0 : clip.left),
    right: clip.right === false ? chart.width : area.right + (clip.right === true ? 0 : clip.right),
    top: clip.top === false ? 0 : area.top - (clip.top === true ? 0 : clip.top),
    bottom: clip.bottom === false ? chart.height : area.bottom + (clip.bottom === true ? 0 : clip.bottom)
  };
}

// node_modules/chart.js/dist/chart.js
var Animator = class {
  constructor() {
    this._request = null;
    this._charts = /* @__PURE__ */ new Map();
    this._running = false;
    this._lastDate = void 0;
  }
  _notify(chart, anims, date, type) {
    const callbacks = anims.listeners[type];
    const numSteps = anims.duration;
    callbacks.forEach((fn) => fn({
      chart,
      initial: anims.initial,
      numSteps,
      currentStep: Math.min(date - anims.start, numSteps)
    }));
  }
  _refresh() {
    if (this._request) {
      return;
    }
    this._running = true;
    this._request = requestAnimFrame.call(window, () => {
      this._update();
      this._request = null;
      if (this._running) {
        this._refresh();
      }
    });
  }
  _update(date = Date.now()) {
    let remaining = 0;
    this._charts.forEach((anims, chart) => {
      if (!anims.running || !anims.items.length) {
        return;
      }
      const items = anims.items;
      let i = items.length - 1;
      let draw2 = false;
      let item;
      for (; i >= 0; --i) {
        item = items[i];
        if (item._active) {
          if (item._total > anims.duration) {
            anims.duration = item._total;
          }
          item.tick(date);
          draw2 = true;
        } else {
          items[i] = items[items.length - 1];
          items.pop();
        }
      }
      if (draw2) {
        chart.draw();
        this._notify(chart, anims, date, "progress");
      }
      if (!items.length) {
        anims.running = false;
        this._notify(chart, anims, date, "complete");
        anims.initial = false;
      }
      remaining += items.length;
    });
    this._lastDate = date;
    if (remaining === 0) {
      this._running = false;
    }
  }
  _getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);
    if (!anims) {
      anims = {
        running: false,
        initial: true,
        items: [],
        listeners: {
          complete: [],
          progress: []
        }
      };
      charts.set(chart, anims);
    }
    return anims;
  }
  listen(chart, event, cb) {
    this._getAnims(chart).listeners[event].push(cb);
  }
  add(chart, items) {
    if (!items || !items.length) {
      return;
    }
    this._getAnims(chart).items.push(...items);
  }
  has(chart) {
    return this._getAnims(chart).items.length > 0;
  }
  start(chart) {
    const anims = this._charts.get(chart);
    if (!anims) {
      return;
    }
    anims.running = true;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
    this._refresh();
  }
  running(chart) {
    if (!this._running) {
      return false;
    }
    const anims = this._charts.get(chart);
    if (!anims || !anims.running || !anims.items.length) {
      return false;
    }
    return true;
  }
  stop(chart) {
    const anims = this._charts.get(chart);
    if (!anims || !anims.items.length) {
      return;
    }
    const items = anims.items;
    let i = items.length - 1;
    for (; i >= 0; --i) {
      items[i].cancel();
    }
    anims.items = [];
    this._notify(chart, anims, Date.now(), "complete");
  }
  remove(chart) {
    return this._charts.delete(chart);
  }
};
var animator = /* @__PURE__ */ new Animator();
var transparent = "transparent";
var interpolators = {
  boolean(from2, to2, factor) {
    return factor > 0.5 ? to2 : from2;
  },
  color(from2, to2, factor) {
    const c0 = color(from2 || transparent);
    const c1 = c0.valid && color(to2 || transparent);
    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to2;
  },
  number(from2, to2, factor) {
    return from2 + (to2 - from2) * factor;
  }
};
var Animation = class {
  constructor(cfg, target, prop, to2) {
    const currentValue = target[prop];
    to2 = resolve([
      cfg.to,
      to2,
      currentValue,
      cfg.from
    ]);
    const from2 = resolve([
      cfg.from,
      currentValue,
      to2
    ]);
    this._active = true;
    this._fn = cfg.fn || interpolators[cfg.type || typeof from2];
    this._easing = effects[cfg.easing] || effects.linear;
    this._start = Math.floor(Date.now() + (cfg.delay || 0));
    this._duration = this._total = Math.floor(cfg.duration);
    this._loop = !!cfg.loop;
    this._target = target;
    this._prop = prop;
    this._from = from2;
    this._to = to2;
    this._promises = void 0;
  }
  active() {
    return this._active;
  }
  update(cfg, to2, date) {
    if (this._active) {
      this._notify(false);
      const currentValue = this._target[this._prop];
      const elapsed = date - this._start;
      const remain = this._duration - elapsed;
      this._start = date;
      this._duration = Math.floor(Math.max(remain, cfg.duration));
      this._total += elapsed;
      this._loop = !!cfg.loop;
      this._to = resolve([
        cfg.to,
        to2,
        currentValue,
        cfg.from
      ]);
      this._from = resolve([
        cfg.from,
        currentValue,
        to2
      ]);
    }
  }
  cancel() {
    if (this._active) {
      this.tick(Date.now());
      this._active = false;
      this._notify(false);
    }
  }
  tick(date) {
    const elapsed = date - this._start;
    const duration = this._duration;
    const prop = this._prop;
    const from2 = this._from;
    const loop = this._loop;
    const to2 = this._to;
    let factor;
    this._active = from2 !== to2 && (loop || elapsed < duration);
    if (!this._active) {
      this._target[prop] = to2;
      this._notify(true);
      return;
    }
    if (elapsed < 0) {
      this._target[prop] = from2;
      return;
    }
    factor = elapsed / duration % 2;
    factor = loop && factor > 1 ? 2 - factor : factor;
    factor = this._easing(Math.min(1, Math.max(0, factor)));
    this._target[prop] = this._fn(from2, to2, factor);
  }
  wait() {
    const promises = this._promises || (this._promises = []);
    return new Promise((res, rej) => {
      promises.push({
        res,
        rej
      });
    });
  }
  _notify(resolved) {
    const method = resolved ? "res" : "rej";
    const promises = this._promises || [];
    for (let i = 0; i < promises.length; i++) {
      promises[i][method]();
    }
  }
};
var Animations = class {
  constructor(chart, config) {
    this._chart = chart;
    this._properties = /* @__PURE__ */ new Map();
    this.configure(config);
  }
  configure(config) {
    if (!isObject(config)) {
      return;
    }
    const animationOptions = Object.keys(defaults.animation);
    const animatedProps = this._properties;
    Object.getOwnPropertyNames(config).forEach((key) => {
      const cfg = config[key];
      if (!isObject(cfg)) {
        return;
      }
      const resolved = {};
      for (const option of animationOptions) {
        resolved[option] = cfg[option];
      }
      (isArray(cfg.properties) && cfg.properties || [
        key
      ]).forEach((prop) => {
        if (prop === key || !animatedProps.has(prop)) {
          animatedProps.set(prop, resolved);
        }
      });
    });
  }
  _animateOptions(target, values) {
    const newOptions = values.options;
    const options = resolveTargetOptions(target, newOptions);
    if (!options) {
      return [];
    }
    const animations = this._createAnimations(options, newOptions);
    if (newOptions.$shared) {
      awaitAll(target.options.$animations, newOptions).then(() => {
        target.options = newOptions;
      }, () => {
      });
    }
    return animations;
  }
  _createAnimations(target, values) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    let i;
    for (i = props.length - 1; i >= 0; --i) {
      const prop = props[i];
      if (prop.charAt(0) === "$") {
        continue;
      }
      if (prop === "options") {
        animations.push(...this._animateOptions(target, values));
        continue;
      }
      const value2 = values[prop];
      let animation = running[prop];
      const cfg = animatedProps.get(prop);
      if (animation) {
        if (cfg && animation.active()) {
          animation.update(cfg, value2, date);
          continue;
        } else {
          animation.cancel();
        }
      }
      if (!cfg || !cfg.duration) {
        target[prop] = value2;
        continue;
      }
      running[prop] = animation = new Animation(cfg, target, prop, value2);
      animations.push(animation);
    }
    return animations;
  }
  update(target, values) {
    if (this._properties.size === 0) {
      Object.assign(target, values);
      return;
    }
    const animations = this._createAnimations(target, values);
    if (animations.length) {
      animator.add(this._chart, animations);
      return true;
    }
  }
};
function awaitAll(animations, properties) {
  const running = [];
  const keys = Object.keys(properties);
  for (let i = 0; i < keys.length; i++) {
    const anim = animations[keys[i]];
    if (anim && anim.active()) {
      running.push(anim.wait());
    }
  }
  return Promise.all(running);
}
function resolveTargetOptions(target, newOptions) {
  if (!newOptions) {
    return;
  }
  let options = target.options;
  if (!options) {
    target.options = newOptions;
    return;
  }
  if (options.$shared) {
    target.options = options = Object.assign({}, options, {
      $shared: false,
      $animations: {}
    });
  }
  return options;
}
function scaleClip(scale, allowedOverflow) {
  const opts = scale && scale.options || {};
  const reverse = opts.reverse;
  const min = opts.min === void 0 ? allowedOverflow : 0;
  const max = opts.max === void 0 ? allowedOverflow : 0;
  return {
    start: reverse ? max : min,
    end: reverse ? min : max
  };
}
function defaultClip(xScale2, yScale2, allowedOverflow) {
  if (allowedOverflow === false) {
    return false;
  }
  const x = scaleClip(xScale2, allowedOverflow);
  const y = scaleClip(yScale2, allowedOverflow);
  return {
    top: y.end,
    right: x.end,
    bottom: y.start,
    left: x.start
  };
}
function toClip(value2) {
  let t2, r, b, l;
  if (isObject(value2)) {
    t2 = value2.top;
    r = value2.right;
    b = value2.bottom;
    l = value2.left;
  } else {
    t2 = r = b = l = value2;
  }
  return {
    top: t2,
    right: r,
    bottom: b,
    left: l,
    disabled: value2 === false
  };
}
function getSortedDatasetIndices(chart, filterVisible) {
  const keys = [];
  const metasets = chart._getSortedDatasetMetas(filterVisible);
  let i, ilen;
  for (i = 0, ilen = metasets.length; i < ilen; ++i) {
    keys.push(metasets[i].index);
  }
  return keys;
}
function applyStack(stack, value2, dsIndex, options = {}) {
  const keys = stack.keys;
  const singleMode = options.mode === "single";
  let i, ilen, datasetIndex, otherValue;
  if (value2 === null) {
    return;
  }
  let found = false;
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    datasetIndex = +keys[i];
    if (datasetIndex === dsIndex) {
      found = true;
      if (options.all) {
        continue;
      }
      break;
    }
    otherValue = stack.values[datasetIndex];
    if (isNumberFinite(otherValue) && (singleMode || value2 === 0 || sign(value2) === sign(otherValue))) {
      value2 += otherValue;
    }
  }
  if (!found && !options.all) {
    return 0;
  }
  return value2;
}
function convertObjectDataToArray(data, meta) {
  const { iScale, vScale } = meta;
  const iAxisKey = iScale.axis === "x" ? "x" : "y";
  const vAxisKey = vScale.axis === "x" ? "x" : "y";
  const keys = Object.keys(data);
  const adata = new Array(keys.length);
  let i, ilen, key;
  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    key = keys[i];
    adata[i] = {
      [iAxisKey]: key,
      [vAxisKey]: data[key]
    };
  }
  return adata;
}
function isStacked(scale, meta) {
  const stacked = scale && scale.options.stacked;
  return stacked || stacked === void 0 && meta.stack !== void 0;
}
function getStackKey(indexScale, valueScale, meta) {
  return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
function getUserBounds(scale) {
  const { min, max, minDefined, maxDefined } = scale.getUserBounds();
  return {
    min: minDefined ? min : Number.NEGATIVE_INFINITY,
    max: maxDefined ? max : Number.POSITIVE_INFINITY
  };
}
function getOrCreateStack(stacks, stackKey, indexValue) {
  const subStack = stacks[stackKey] || (stacks[stackKey] = {});
  return subStack[indexValue] || (subStack[indexValue] = {});
}
function getLastIndexInStack(stack, vScale, positive, type) {
  for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
    const value2 = stack[meta.index];
    if (positive && value2 > 0 || !positive && value2 < 0) {
      return meta.index;
    }
  }
  return null;
}
function updateStacks(controller, parsed) {
  const { chart, _cachedMeta: meta } = controller;
  const stacks = chart._stacks || (chart._stacks = {});
  const { iScale, vScale, index: datasetIndex } = meta;
  const iAxis = iScale.axis;
  const vAxis = vScale.axis;
  const key = getStackKey(iScale, vScale, meta);
  const ilen = parsed.length;
  let stack;
  for (let i = 0; i < ilen; ++i) {
    const item = parsed[i];
    const { [iAxis]: index, [vAxis]: value2 } = item;
    const itemStacks = item._stacks || (item._stacks = {});
    stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
    stack[datasetIndex] = value2;
    stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
    stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
    const visualValues = stack._visualValues || (stack._visualValues = {});
    visualValues[datasetIndex] = value2;
  }
}
function getFirstScaleId(chart, axis) {
  const scales = chart.scales;
  return Object.keys(scales).filter((key) => scales[key].axis === axis).shift();
}
function createDatasetContext(parent, index) {
  return createContext(parent, {
    active: false,
    dataset: void 0,
    datasetIndex: index,
    index,
    mode: "default",
    type: "dataset"
  });
}
function createDataContext(parent, index, element) {
  return createContext(parent, {
    active: false,
    dataIndex: index,
    parsed: void 0,
    raw: void 0,
    element,
    index,
    mode: "default",
    type: "data"
  });
}
function clearStacks(meta, items) {
  const datasetIndex = meta.controller.index;
  const axis = meta.vScale && meta.vScale.axis;
  if (!axis) {
    return;
  }
  items = items || meta._parsed;
  for (const parsed of items) {
    const stacks = parsed._stacks;
    if (!stacks || stacks[axis] === void 0 || stacks[axis][datasetIndex] === void 0) {
      continue;
    }
    delete stacks[axis][datasetIndex];
    if (stacks[axis]._visualValues !== void 0 && stacks[axis]._visualValues[datasetIndex] !== void 0) {
      delete stacks[axis]._visualValues[datasetIndex];
    }
  }
}
var isDirectUpdateMode = (mode) => mode === "reset" || mode === "none";
var cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
var createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && {
  keys: getSortedDatasetIndices(chart, true),
  values: null
};
var DatasetController = class {
  static defaults = {};
  static datasetElementType = null;
  static dataElementType = null;
  constructor(chart, datasetIndex) {
    this.chart = chart;
    this._ctx = chart.ctx;
    this.index = datasetIndex;
    this._cachedDataOpts = {};
    this._cachedMeta = this.getMeta();
    this._type = this._cachedMeta.type;
    this.options = void 0;
    this._parsing = false;
    this._data = void 0;
    this._objectData = void 0;
    this._sharedOptions = void 0;
    this._drawStart = void 0;
    this._drawCount = void 0;
    this.enableOptionSharing = false;
    this.supportsDecimation = false;
    this.$context = void 0;
    this._syncList = [];
    this.datasetElementType = new.target.datasetElementType;
    this.dataElementType = new.target.dataElementType;
    this.initialize();
  }
  initialize() {
    const meta = this._cachedMeta;
    this.configure();
    this.linkScales();
    meta._stacked = isStacked(meta.vScale, meta);
    this.addElements();
    if (this.options.fill && !this.chart.isPluginEnabled("filler")) {
      console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
    }
  }
  updateIndex(datasetIndex) {
    if (this.index !== datasetIndex) {
      clearStacks(this._cachedMeta);
    }
    this.index = datasetIndex;
  }
  linkScales() {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    const chooseId = (axis, x, y, r) => axis === "x" ? x : axis === "r" ? r : y;
    const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, "x"));
    const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, "y"));
    const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, "r"));
    const indexAxis = meta.indexAxis;
    const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
    const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
    meta.xScale = this.getScaleForId(xid);
    meta.yScale = this.getScaleForId(yid);
    meta.rScale = this.getScaleForId(rid);
    meta.iScale = this.getScaleForId(iid);
    meta.vScale = this.getScaleForId(vid);
  }
  getDataset() {
    return this.chart.data.datasets[this.index];
  }
  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }
  getScaleForId(scaleID) {
    return this.chart.scales[scaleID];
  }
  _getOtherScale(scale) {
    const meta = this._cachedMeta;
    return scale === meta.iScale ? meta.vScale : meta.iScale;
  }
  reset() {
    this._update("reset");
  }
  _destroy() {
    const meta = this._cachedMeta;
    if (this._data) {
      unlistenArrayEvents(this._data, this);
    }
    if (meta._stacked) {
      clearStacks(meta);
    }
  }
  _dataCheck() {
    const dataset = this.getDataset();
    const data = dataset.data || (dataset.data = []);
    const _data = this._data;
    if (isObject(data)) {
      const meta = this._cachedMeta;
      this._data = convertObjectDataToArray(data, meta);
    } else if (_data !== data) {
      if (_data) {
        unlistenArrayEvents(_data, this);
        const meta = this._cachedMeta;
        clearStacks(meta);
        meta._parsed = [];
      }
      if (data && Object.isExtensible(data)) {
        listenArrayEvents(data, this);
      }
      this._syncList = [];
      this._data = data;
    }
  }
  addElements() {
    const meta = this._cachedMeta;
    this._dataCheck();
    if (this.datasetElementType) {
      meta.dataset = new this.datasetElementType();
    }
  }
  buildOrUpdateElements(resetNewElements) {
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    let stackChanged = false;
    this._dataCheck();
    const oldStacked = meta._stacked;
    meta._stacked = isStacked(meta.vScale, meta);
    if (meta.stack !== dataset.stack) {
      stackChanged = true;
      clearStacks(meta);
      meta.stack = dataset.stack;
    }
    this._resyncElements(resetNewElements);
    if (stackChanged || oldStacked !== meta._stacked) {
      updateStacks(this, meta._parsed);
      meta._stacked = isStacked(meta.vScale, meta);
    }
  }
  configure() {
    const config = this.chart.config;
    const scopeKeys = config.datasetScopeKeys(this._type);
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
    this.options = config.createResolver(scopes, this.getContext());
    this._parsing = this.options.parsing;
    this._cachedDataOpts = {};
  }
  parse(start, count) {
    const { _cachedMeta: meta, _data: data } = this;
    const { iScale, _stacked } = meta;
    const iAxis = iScale.axis;
    let sorted = start === 0 && count === data.length ? true : meta._sorted;
    let prev = start > 0 && meta._parsed[start - 1];
    let i, cur, parsed;
    if (this._parsing === false) {
      meta._parsed = data;
      meta._sorted = true;
      parsed = data;
    } else {
      if (isArray(data[start])) {
        parsed = this.parseArrayData(meta, data, start, count);
      } else if (isObject(data[start])) {
        parsed = this.parseObjectData(meta, data, start, count);
      } else {
        parsed = this.parsePrimitiveData(meta, data, start, count);
      }
      const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
      for (i = 0; i < count; ++i) {
        meta._parsed[i + start] = cur = parsed[i];
        if (sorted) {
          if (isNotInOrderComparedToPrev()) {
            sorted = false;
          }
          prev = cur;
        }
      }
      meta._sorted = sorted;
    }
    if (_stacked) {
      updateStacks(this, parsed);
    }
  }
  parsePrimitiveData(meta, data, start, count) {
    const { iScale, vScale } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = new Array(count);
    let i, ilen, index;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      parsed[i] = {
        [iAxis]: singleScale || iScale.parse(labels[index], index),
        [vAxis]: vScale.parse(data[index], index)
      };
    }
    return parsed;
  }
  parseArrayData(meta, data, start, count) {
    const { xScale: xScale2, yScale: yScale2 } = meta;
    const parsed = new Array(count);
    let i, ilen, index, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale2.parse(item[0], index),
        y: yScale2.parse(item[1], index)
      };
    }
    return parsed;
  }
  parseObjectData(meta, data, start, count) {
    const { xScale: xScale2, yScale: yScale2 } = meta;
    const { xAxisKey = "x", yAxisKey = "y" } = this._parsing;
    const parsed = new Array(count);
    let i, ilen, index, item;
    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale2.parse(resolveObjectKey(item, xAxisKey), index),
        y: yScale2.parse(resolveObjectKey(item, yAxisKey), index)
      };
    }
    return parsed;
  }
  getParsed(index) {
    return this._cachedMeta._parsed[index];
  }
  getDataElement(index) {
    return this._cachedMeta.data[index];
  }
  applyStack(scale, parsed, mode) {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const value2 = parsed[scale.axis];
    const stack = {
      keys: getSortedDatasetIndices(chart, true),
      values: parsed._stacks[scale.axis]._visualValues
    };
    return applyStack(stack, value2, meta.index, {
      mode
    });
  }
  updateRangeFromParsed(range, scale, parsed, stack) {
    const parsedValue = parsed[scale.axis];
    let value2 = parsedValue === null ? NaN : parsedValue;
    const values = stack && parsed._stacks[scale.axis];
    if (stack && values) {
      stack.values = values;
      value2 = applyStack(stack, parsedValue, this._cachedMeta.index);
    }
    range.min = Math.min(range.min, value2);
    range.max = Math.max(range.max, value2);
  }
  getMinMax(scale, canStack) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;
    const otherScale = this._getOtherScale(scale);
    const stack = createStack(canStack, meta, this.chart);
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
    let i, parsed;
    function _skip() {
      parsed = _parsed[i];
      const otherValue = parsed[otherScale.axis];
      return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
    }
    for (i = 0; i < ilen; ++i) {
      if (_skip()) {
        continue;
      }
      this.updateRangeFromParsed(range, scale, parsed, stack);
      if (sorted) {
        break;
      }
    }
    if (sorted) {
      for (i = ilen - 1; i >= 0; --i) {
        if (_skip()) {
          continue;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        break;
      }
    }
    return range;
  }
  getAllParsedValues(scale) {
    const parsed = this._cachedMeta._parsed;
    const values = [];
    let i, ilen, value2;
    for (i = 0, ilen = parsed.length; i < ilen; ++i) {
      value2 = parsed[i][scale.axis];
      if (isNumberFinite(value2)) {
        values.push(value2);
      }
    }
    return values;
  }
  getMaxOverflow() {
    return false;
  }
  getLabelAndValue(index) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = this.getParsed(index);
    return {
      label: iScale ? "" + iScale.getLabelForValue(parsed[iScale.axis]) : "",
      value: vScale ? "" + vScale.getLabelForValue(parsed[vScale.axis]) : ""
    };
  }
  _update(mode) {
    const meta = this._cachedMeta;
    this.update(mode || "default");
    meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
  }
  update(mode) {
  }
  draw() {
    const ctx = this._ctx;
    const chart = this.chart;
    const meta = this._cachedMeta;
    const elements = meta.data || [];
    const area = chart.chartArea;
    const active = [];
    const start = this._drawStart || 0;
    const count = this._drawCount || elements.length - start;
    const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
    let i;
    if (meta.dataset) {
      meta.dataset.draw(ctx, area, start, count);
    }
    for (i = start; i < start + count; ++i) {
      const element = elements[i];
      if (element.hidden) {
        continue;
      }
      if (element.active && drawActiveElementsOnTop) {
        active.push(element);
      } else {
        element.draw(ctx, area);
      }
    }
    for (i = 0; i < active.length; ++i) {
      active[i].draw(ctx, area);
    }
  }
  getStyle(index, active) {
    const mode = active ? "active" : "default";
    return index === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
  }
  getContext(index, active, mode) {
    const dataset = this.getDataset();
    let context;
    if (index >= 0 && index < this._cachedMeta.data.length) {
      const element = this._cachedMeta.data[index];
      context = element.$context || (element.$context = createDataContext(this.getContext(), index, element));
      context.parsed = this.getParsed(index);
      context.raw = dataset.data[index];
      context.index = context.dataIndex = index;
    } else {
      context = this.$context || (this.$context = createDatasetContext(this.chart.getContext(), this.index));
      context.dataset = dataset;
      context.index = context.datasetIndex = this.index;
    }
    context.active = !!active;
    context.mode = mode;
    return context;
  }
  resolveDatasetElementOptions(mode) {
    return this._resolveElementOptions(this.datasetElementType.id, mode);
  }
  resolveDataElementOptions(index, mode) {
    return this._resolveElementOptions(this.dataElementType.id, mode, index);
  }
  _resolveElementOptions(elementType, mode = "default", index) {
    const active = mode === "active";
    const cache2 = this._cachedDataOpts;
    const cacheKey = elementType + "-" + mode;
    const cached = cache2[cacheKey];
    const sharing = this.enableOptionSharing && defined(index);
    if (cached) {
      return cloneIfNotShared(cached, sharing);
    }
    const config = this.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
    const prefixes = active ? [
      `${elementType}Hover`,
      "hover",
      elementType,
      ""
    ] : [
      elementType,
      ""
    ];
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
    const names2 = Object.keys(defaults.elements[elementType]);
    const context = () => this.getContext(index, active, mode);
    const values = config.resolveNamedOptions(scopes, names2, context, prefixes);
    if (values.$shared) {
      values.$shared = sharing;
      cache2[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }
    return values;
  }
  _resolveAnimations(index, transition, active) {
    const chart = this.chart;
    const cache2 = this._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache2[cacheKey];
    if (cached) {
      return cached;
    }
    let options;
    if (chart.options.animation !== false) {
      const config = this.chart.config;
      const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
      const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
      options = config.createResolver(scopes, this.getContext(index, active, transition));
    }
    const animations = new Animations(chart, options && options.animations);
    if (options && options._cacheable) {
      cache2[cacheKey] = Object.freeze(animations);
    }
    return animations;
  }
  getSharedOptions(options) {
    if (!options.$shared) {
      return;
    }
    return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
  }
  includeOptions(mode, sharedOptions) {
    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
  }
  _getSharedOptions(start, mode) {
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const previouslySharedOptions = this._sharedOptions;
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
    return {
      sharedOptions,
      includeOptions
    };
  }
  updateElement(element, index, properties, mode) {
    if (isDirectUpdateMode(mode)) {
      Object.assign(element, properties);
    } else {
      this._resolveAnimations(index, mode).update(element, properties);
    }
  }
  updateSharedOptions(sharedOptions, mode, newOptions) {
    if (sharedOptions && !isDirectUpdateMode(mode)) {
      this._resolveAnimations(void 0, mode).update(sharedOptions, newOptions);
    }
  }
  _setStyle(element, index, mode, active) {
    element.active = active;
    const options = this.getStyle(index, active);
    this._resolveAnimations(index, mode, active).update(element, {
      options: !active && this.getSharedOptions(options) || options
    });
  }
  removeHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, "active", false);
  }
  setHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, "active", true);
  }
  _removeDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", false);
    }
  }
  _setDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;
    if (element) {
      this._setStyle(element, void 0, "active", true);
    }
  }
  _resyncElements(resetNewElements) {
    const data = this._data;
    const elements = this._cachedMeta.data;
    for (const [method, arg1, arg2] of this._syncList) {
      this[method](arg1, arg2);
    }
    this._syncList = [];
    const numMeta = elements.length;
    const numData = data.length;
    const count = Math.min(numData, numMeta);
    if (count) {
      this.parse(0, count);
    }
    if (numData > numMeta) {
      this._insertElements(numMeta, numData - numMeta, resetNewElements);
    } else if (numData < numMeta) {
      this._removeElements(numData, numMeta - numData);
    }
  }
  _insertElements(start, count, resetNewElements = true) {
    const meta = this._cachedMeta;
    const data = meta.data;
    const end = start + count;
    let i;
    const move = (arr) => {
      arr.length += count;
      for (i = arr.length - 1; i >= end; i--) {
        arr[i] = arr[i - count];
      }
    };
    move(data);
    for (i = start; i < end; ++i) {
      data[i] = new this.dataElementType();
    }
    if (this._parsing) {
      move(meta._parsed);
    }
    this.parse(start, count);
    if (resetNewElements) {
      this.updateElements(data, start, count, "reset");
    }
  }
  updateElements(element, start, count, mode) {
  }
  _removeElements(start, count) {
    const meta = this._cachedMeta;
    if (this._parsing) {
      const removed = meta._parsed.splice(start, count);
      if (meta._stacked) {
        clearStacks(meta, removed);
      }
    }
    meta.data.splice(start, count);
  }
  _sync(args) {
    if (this._parsing) {
      this._syncList.push(args);
    } else {
      const [method, arg1, arg2] = args;
      this[method](arg1, arg2);
    }
    this.chart._dataChanges.push([
      this.index,
      ...args
    ]);
  }
  _onDataPush() {
    const count = arguments.length;
    this._sync([
      "_insertElements",
      this.getDataset().data.length - count,
      count
    ]);
  }
  _onDataPop() {
    this._sync([
      "_removeElements",
      this._cachedMeta.data.length - 1,
      1
    ]);
  }
  _onDataShift() {
    this._sync([
      "_removeElements",
      0,
      1
    ]);
  }
  _onDataSplice(start, count) {
    if (count) {
      this._sync([
        "_removeElements",
        start,
        count
      ]);
    }
    const newCount = arguments.length - 2;
    if (newCount) {
      this._sync([
        "_insertElements",
        start,
        newCount
      ]);
    }
  }
  _onDataUnshift() {
    this._sync([
      "_insertElements",
      0,
      arguments.length
    ]);
  }
};
var LineController = class extends DatasetController {
  static id = "line";
  static defaults = {
    datasetElementType: "line",
    dataElementType: "point",
    showLine: true,
    spanGaps: false
  };
  static overrides = {
    scales: {
      _index_: {
        type: "category"
      },
      _value_: {
        type: "linear"
      }
    }
  };
  initialize() {
    this.enableOptionSharing = true;
    this.supportsDecimation = true;
    super.initialize();
  }
  update(mode) {
    const meta = this._cachedMeta;
    const { dataset: line, data: points = [], _dataset } = meta;
    const animationsDisabled = this.chart._animationsDisabled;
    let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    this._drawStart = start;
    this._drawCount = count;
    if (_scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }
    line._chart = this.chart;
    line._datasetIndex = this.index;
    line._decimated = !!_dataset._decimated;
    line.points = points;
    const options = this.resolveDatasetElementOptions(mode);
    if (!this.options.showLine) {
      options.borderWidth = 0;
    }
    options.segment = this.options.segment;
    this.updateElement(line, void 0, {
      animated: !animationsDisabled,
      options
    }, mode);
    this.updateElements(points, start, count, mode);
  }
  updateElements(points, start, count, mode) {
    const reset = mode === "reset";
    const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const { spanGaps, segment } = this.options;
    const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = this.chart._animationsDisabled || reset || mode === "none";
    const end = start + count;
    const pointsCount = points.length;
    let prevParsed = start > 0 && this.getParsed(start - 1);
    for (let i = 0; i < pointsCount; ++i) {
      const point = points[i];
      const properties = directUpdate ? point : {};
      if (i < start || i >= end) {
        properties.skip = true;
        continue;
      }
      const parsed = this.getParsed(i);
      const nullData = isNullOrUndef(parsed[vAxis]);
      const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
      const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
      properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
      properties.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
      if (segment) {
        properties.parsed = parsed;
        properties.raw = _dataset.data[i];
      }
      if (includeOptions) {
        properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? "active" : mode);
      }
      if (!directUpdate) {
        this.updateElement(point, i, properties, mode);
      }
      prevParsed = parsed;
    }
  }
  getMaxOverflow() {
    const meta = this._cachedMeta;
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    const data = meta.data || [];
    if (!data.length) {
      return border;
    }
    const firstPoint = data[0].size(this.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }
  draw() {
    const meta = this._cachedMeta;
    meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
    super.draw();
  }
};
function abstract() {
  throw new Error("This method is not implemented: Check that a complete date adapter is provided.");
}
var DateAdapterBase = class _DateAdapterBase {
  /**
  * Override default date adapter methods.
  * Accepts type parameter to define options type.
  * @example
  * Chart._adapters._date.override<{myAdapterOption: string}>({
  *   init() {
  *     console.log(this.options.myAdapterOption);
  *   }
  * })
  */
  static override(members) {
    Object.assign(_DateAdapterBase.prototype, members);
  }
  options;
  constructor(options) {
    this.options = options || {};
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {
  }
  formats() {
    return abstract();
  }
  parse() {
    return abstract();
  }
  format() {
    return abstract();
  }
  add() {
    return abstract();
  }
  diff() {
    return abstract();
  }
  startOf() {
    return abstract();
  }
  endOf() {
    return abstract();
  }
};
var adapters = {
  _date: DateAdapterBase
};
function binarySearch(metaset, axis, value2, intersect) {
  const { controller, data, _sorted } = metaset;
  const iScale = controller._cachedMeta.iScale;
  const spanGaps = metaset.dataset ? metaset.dataset.options ? metaset.dataset.options.spanGaps : null : null;
  if (iScale && axis === iScale.axis && axis !== "r" && _sorted && data.length) {
    const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
    if (!intersect) {
      const result = lookupMethod(data, axis, value2);
      if (spanGaps) {
        const { vScale } = controller._cachedMeta;
        const { _parsed } = metaset;
        const distanceToDefinedLo = _parsed.slice(0, result.lo + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        result.lo -= Math.max(0, distanceToDefinedLo);
        const distanceToDefinedHi = _parsed.slice(result.hi).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
        result.hi += Math.max(0, distanceToDefinedHi);
      }
      return result;
    } else if (controller._sharedOptions) {
      const el2 = data[0];
      const range = typeof el2.getRange === "function" && el2.getRange(axis);
      if (range) {
        const start = lookupMethod(data, axis, value2 - range);
        const end = lookupMethod(data, axis, value2 + range);
        return {
          lo: start.lo,
          hi: end.hi
        };
      }
    }
  }
  return {
    lo: 0,
    hi: data.length - 1
  };
}
function evaluateInteractionItems(chart, axis, position, handler, intersect) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  const value2 = position[axis];
  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const { index, data } = metasets[i];
    const { lo, hi } = binarySearch(metasets[i], axis, value2, intersect);
    for (let j = lo; j <= hi; ++j) {
      const element = data[j];
      if (!element.skip) {
        handler(element, index, j);
      }
    }
  }
}
function getDistanceMetricForAxis(axis) {
  const useX = axis.indexOf("x") !== -1;
  const useY = axis.indexOf("y") !== -1;
  return function(pt1, pt2) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}
function getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) {
  const items = [];
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return items;
  }
  const evaluationFunc = function(element, datasetIndex, index) {
    if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
      return;
    }
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }
  };
  evaluateInteractionItems(chart, axis, position, evaluationFunc, true);
  return items;
}
function getNearestRadialItems(chart, position, axis, useFinalPosition) {
  let items = [];
  function evaluationFunc(element, datasetIndex, index) {
    const { startAngle, endAngle } = element.getProps([
      "startAngle",
      "endAngle"
    ], useFinalPosition);
    const { angle } = getAngleFromPoint(element, {
      x: position.x,
      y: position.y
    });
    if (_angleBetween(angle, startAngle, endAngle)) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  let items = [];
  const distanceMetric = getDistanceMetricForAxis(axis);
  let minDistance = Number.POSITIVE_INFINITY;
  function evaluationFunc(element, datasetIndex, index) {
    const inRange = element.inRange(position.x, position.y, useFinalPosition);
    if (intersect && !inRange) {
      return;
    }
    const center = element.getCenterPoint(useFinalPosition);
    const pointInArea = !!includeInvisible || chart.isPointInArea(center);
    if (!pointInArea && !inRange) {
      return;
    }
    const distance = distanceMetric(position, center);
    if (distance < minDistance) {
      items = [
        {
          element,
          datasetIndex,
          index
        }
      ];
      minDistance = distance;
    } else if (distance === minDistance) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }
  }
  evaluateInteractionItems(chart, axis, position, evaluationFunc);
  return items;
}
function getNearestItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
  if (!includeInvisible && !chart.isPointInArea(position)) {
    return [];
  }
  return axis === "r" && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
}
function getAxisItems(chart, position, axis, intersect, useFinalPosition) {
  const items = [];
  const rangeMethod = axis === "x" ? "inXRange" : "inYRange";
  let intersectsItem = false;
  evaluateInteractionItems(chart, axis, position, (element, datasetIndex, index) => {
    if (element[rangeMethod] && element[rangeMethod](position[axis], useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index
      });
      intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
    }
  });
  if (intersect && !intersectsItem) {
    return [];
  }
  return items;
}
var Interaction = {
  evaluateInteractionItems,
  modes: {
    index(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "x";
      const includeInvisible = options.includeInvisible || false;
      const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      const elements = [];
      if (!items.length) {
        return [];
      }
      chart.getSortedVisibleDatasetMetas().forEach((meta) => {
        const index = items[0].index;
        const element = meta.data[index];
        if (element && !element.skip) {
          elements.push({
            element,
            datasetIndex: meta.index,
            index
          });
        }
      });
      return elements;
    },
    dataset(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
      if (items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        items = [];
        for (let i = 0; i < data.length; ++i) {
          items.push({
            element: data[i],
            datasetIndex,
            index: i
          });
        }
      }
      return items;
    },
    point(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
    },
    nearest(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || "xy";
      const includeInvisible = options.includeInvisible || false;
      return getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
    },
    x(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      return getAxisItems(chart, position, "x", options.intersect, useFinalPosition);
    },
    y(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      return getAxisItems(chart, position, "y", options.intersect, useFinalPosition);
    }
  }
};
var STATIC_POSITIONS = [
  "left",
  "top",
  "right",
  "bottom"
];
function filterByPosition(array, position) {
  return array.filter((v) => v.pos === position);
}
function filterDynamicPositionByAxis(array, axis) {
  return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}
function sortByWeight(array, reverse) {
  return array.sort((a, b) => {
    const v0 = reverse ? b : a;
    const v1 = reverse ? a : b;
    return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
  });
}
function wrapBoxes(boxes) {
  const layoutBoxes = [];
  let i, ilen, box, pos, stack, stackWeight;
  for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
    box = boxes[i];
    ({ position: pos, options: { stack, stackWeight = 1 } } = box);
    layoutBoxes.push({
      index: i,
      box,
      pos,
      horizontal: box.isHorizontal(),
      weight: box.weight,
      stack: stack && pos + stack,
      stackWeight
    });
  }
  return layoutBoxes;
}
function buildStacks(layouts2) {
  const stacks = {};
  for (const wrap of layouts2) {
    const { stack, pos, stackWeight } = wrap;
    if (!stack || !STATIC_POSITIONS.includes(pos)) {
      continue;
    }
    const _stack = stacks[stack] || (stacks[stack] = {
      count: 0,
      placed: 0,
      weight: 0,
      size: 0
    });
    _stack.count++;
    _stack.weight += stackWeight;
  }
  return stacks;
}
function setLayoutDims(layouts2, params) {
  const stacks = buildStacks(layouts2);
  const { vBoxMaxWidth, hBoxMaxHeight } = params;
  let i, ilen, layout;
  for (i = 0, ilen = layouts2.length; i < ilen; ++i) {
    layout = layouts2[i];
    const { fullSize } = layout.box;
    const stack = stacks[layout.stack];
    const factor = stack && layout.stackWeight / stack.weight;
    if (layout.horizontal) {
      layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
      layout.height = hBoxMaxHeight;
    } else {
      layout.width = vBoxMaxWidth;
      layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
    }
  }
  return stacks;
}
function buildLayoutBoxes(boxes) {
  const layoutBoxes = wrapBoxes(boxes);
  const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
  const left = sortByWeight(filterByPosition(layoutBoxes, "left"), true);
  const right = sortByWeight(filterByPosition(layoutBoxes, "right"));
  const top = sortByWeight(filterByPosition(layoutBoxes, "top"), true);
  const bottom = sortByWeight(filterByPosition(layoutBoxes, "bottom"));
  const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, "x");
  const centerVertical = filterDynamicPositionByAxis(layoutBoxes, "y");
  return {
    fullSize,
    leftAndTop: left.concat(top),
    rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
    chartArea: filterByPosition(layoutBoxes, "chartArea"),
    vertical: left.concat(right).concat(centerVertical),
    horizontal: top.concat(bottom).concat(centerHorizontal)
  };
}
function getCombinedMax(maxPadding, chartArea, a, b) {
  return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}
function updateMaxPadding(maxPadding, boxPadding) {
  maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
  maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
  maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
  maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
function updateDims(chartArea, params, layout, stacks) {
  const { pos, box } = layout;
  const maxPadding = chartArea.maxPadding;
  if (!isObject(pos)) {
    if (layout.size) {
      chartArea[pos] -= layout.size;
    }
    const stack = stacks[layout.stack] || {
      size: 0,
      count: 1
    };
    stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
    layout.size = stack.size / stack.count;
    chartArea[pos] += layout.size;
  }
  if (box.getPadding) {
    updateMaxPadding(maxPadding, box.getPadding());
  }
  const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, "left", "right"));
  const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, "top", "bottom"));
  const widthChanged = newWidth !== chartArea.w;
  const heightChanged = newHeight !== chartArea.h;
  chartArea.w = newWidth;
  chartArea.h = newHeight;
  return layout.horizontal ? {
    same: widthChanged,
    other: heightChanged
  } : {
    same: heightChanged,
    other: widthChanged
  };
}
function handleMaxPadding(chartArea) {
  const maxPadding = chartArea.maxPadding;
  function updatePos(pos) {
    const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
    chartArea[pos] += change;
    return change;
  }
  chartArea.y += updatePos("top");
  chartArea.x += updatePos("left");
  updatePos("right");
  updatePos("bottom");
}
function getMargins(horizontal, chartArea) {
  const maxPadding = chartArea.maxPadding;
  function marginForPositions(positions2) {
    const margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    positions2.forEach((pos) => {
      margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
    });
    return margin;
  }
  return horizontal ? marginForPositions([
    "left",
    "right"
  ]) : marginForPositions([
    "top",
    "bottom"
  ]);
}
function fitBoxes(boxes, chartArea, params, stacks) {
  const refitBoxes = [];
  let i, ilen, layout, box, refit, changed;
  for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
    layout = boxes[i];
    box = layout.box;
    box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
    const { same, other } = updateDims(chartArea, params, layout, stacks);
    refit |= same && refitBoxes.length;
    changed = changed || other;
    if (!box.fullSize) {
      refitBoxes.push(layout);
    }
  }
  return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
}
function setBoxDims(box, left, top, width, height) {
  box.top = top;
  box.left = left;
  box.right = left + width;
  box.bottom = top + height;
  box.width = width;
  box.height = height;
}
function placeBoxes(boxes, chartArea, params, stacks) {
  const userPadding = params.padding;
  let { x, y } = chartArea;
  for (const layout of boxes) {
    const box = layout.box;
    const stack = stacks[layout.stack] || {
      count: 1,
      placed: 0,
      weight: 1
    };
    const weight = layout.stackWeight / stack.weight || 1;
    if (layout.horizontal) {
      const width = chartArea.w * weight;
      const height = stack.size || box.height;
      if (defined(stack.start)) {
        y = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
      } else {
        setBoxDims(box, chartArea.left + stack.placed, y, width, height);
      }
      stack.start = y;
      stack.placed += width;
      y = box.bottom;
    } else {
      const height = chartArea.h * weight;
      const width = stack.size || box.width;
      if (defined(stack.start)) {
        x = stack.start;
      }
      if (box.fullSize) {
        setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
      } else {
        setBoxDims(box, x, chartArea.top + stack.placed, width, height);
      }
      stack.start = x;
      stack.placed += height;
      x = box.right;
    }
  }
  chartArea.x = x;
  chartArea.y = y;
}
var layouts = {
  addBox(chart, item) {
    if (!chart.boxes) {
      chart.boxes = [];
    }
    item.fullSize = item.fullSize || false;
    item.position = item.position || "top";
    item.weight = item.weight || 0;
    item._layers = item._layers || function() {
      return [
        {
          z: 0,
          draw(chartArea) {
            item.draw(chartArea);
          }
        }
      ];
    };
    chart.boxes.push(item);
  },
  removeBox(chart, layoutItem) {
    const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
    if (index !== -1) {
      chart.boxes.splice(index, 1);
    }
  },
  configure(chart, item, options) {
    item.fullSize = options.fullSize;
    item.position = options.position;
    item.weight = options.weight;
  },
  update(chart, width, height, minPadding) {
    if (!chart) {
      return;
    }
    const padding = toPadding(chart.options.layout.padding);
    const availableWidth = Math.max(width - padding.width, 0);
    const availableHeight = Math.max(height - padding.height, 0);
    const boxes = buildLayoutBoxes(chart.boxes);
    const verticalBoxes = boxes.vertical;
    const horizontalBoxes = boxes.horizontal;
    each(chart.boxes, (box) => {
      if (typeof box.beforeLayout === "function") {
        box.beforeLayout();
      }
    });
    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
    const params = Object.freeze({
      outerWidth: width,
      outerHeight: height,
      padding,
      availableWidth,
      availableHeight,
      vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
      hBoxMaxHeight: availableHeight / 2
    });
    const maxPadding = Object.assign({}, padding);
    updateMaxPadding(maxPadding, toPadding(minPadding));
    const chartArea = Object.assign({
      maxPadding,
      w: availableWidth,
      h: availableHeight,
      x: padding.left,
      y: padding.top
    }, padding);
    const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
    fitBoxes(boxes.fullSize, chartArea, params, stacks);
    fitBoxes(verticalBoxes, chartArea, params, stacks);
    if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
      fitBoxes(verticalBoxes, chartArea, params, stacks);
    }
    handleMaxPadding(chartArea);
    placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
    chartArea.x += chartArea.w;
    chartArea.y += chartArea.h;
    placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
    chart.chartArea = {
      left: chartArea.left,
      top: chartArea.top,
      right: chartArea.left + chartArea.w,
      bottom: chartArea.top + chartArea.h,
      height: chartArea.h,
      width: chartArea.w
    };
    each(boxes.chartArea, (layout) => {
      const box = layout.box;
      Object.assign(box, chart.chartArea);
      box.update(chartArea.w, chartArea.h, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
    });
  }
};
var BasePlatform = class {
  acquireContext(canvas, aspectRatio) {
  }
  releaseContext(context) {
    return false;
  }
  addEventListener(chart, type, listener) {
  }
  removeEventListener(chart, type, listener) {
  }
  getDevicePixelRatio() {
    return 1;
  }
  getMaximumSize(element, width, height, aspectRatio) {
    width = Math.max(0, width || element.width);
    height = height || element.height;
    return {
      width,
      height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
    };
  }
  isAttached(canvas) {
    return true;
  }
  updateConfig(config) {
  }
};
var BasicPlatform = class extends BasePlatform {
  acquireContext(item) {
    return item && item.getContext && item.getContext("2d") || null;
  }
  updateConfig(config) {
    config.options.animation = false;
  }
};
var EXPANDO_KEY = "$chartjs";
var EVENT_TYPES = {
  touchstart: "mousedown",
  touchmove: "mousemove",
  touchend: "mouseup",
  pointerenter: "mouseenter",
  pointerdown: "mousedown",
  pointermove: "mousemove",
  pointerup: "mouseup",
  pointerleave: "mouseout",
  pointerout: "mouseout"
};
var isNullOrEmpty = (value2) => value2 === null || value2 === "";
function initCanvas(canvas, aspectRatio) {
  const style = canvas.style;
  const renderHeight = canvas.getAttribute("height");
  const renderWidth = canvas.getAttribute("width");
  canvas[EXPANDO_KEY] = {
    initial: {
      height: renderHeight,
      width: renderWidth,
      style: {
        display: style.display,
        height: style.height,
        width: style.width
      }
    }
  };
  style.display = style.display || "block";
  style.boxSizing = style.boxSizing || "border-box";
  if (isNullOrEmpty(renderWidth)) {
    const displayWidth = readUsedSize(canvas, "width");
    if (displayWidth !== void 0) {
      canvas.width = displayWidth;
    }
  }
  if (isNullOrEmpty(renderHeight)) {
    if (canvas.style.height === "") {
      canvas.height = canvas.width / (aspectRatio || 2);
    } else {
      const displayHeight = readUsedSize(canvas, "height");
      if (displayHeight !== void 0) {
        canvas.height = displayHeight;
      }
    }
  }
  return canvas;
}
var eventListenerOptions = supportsEventListenerOptions ? {
  passive: true
} : false;
function addListener(node, type, listener) {
  if (node) {
    node.addEventListener(type, listener, eventListenerOptions);
  }
}
function removeListener(chart, type, listener) {
  if (chart && chart.canvas) {
    chart.canvas.removeEventListener(type, listener, eventListenerOptions);
  }
}
function fromNativeEvent(event, chart) {
  const type = EVENT_TYPES[event.type] || event.type;
  const { x, y } = getRelativePosition(event, chart);
  return {
    type,
    chart,
    native: event,
    x: x !== void 0 ? x : null,
    y: y !== void 0 ? y : null
  };
}
function nodeListContains(nodeList, canvas) {
  for (const node of nodeList) {
    if (node === canvas || node.contains(canvas)) {
      return true;
    }
  }
}
function createAttachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.addedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
function createDetachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const observer = new MutationObserver((entries) => {
    let trigger = false;
    for (const entry of entries) {
      trigger = trigger || nodeListContains(entry.removedNodes, canvas);
      trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
    }
    if (trigger) {
      listener();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}
var drpListeningCharts = /* @__PURE__ */ new Map();
var oldDevicePixelRatio = 0;
function onWindowResize() {
  const dpr = window.devicePixelRatio;
  if (dpr === oldDevicePixelRatio) {
    return;
  }
  oldDevicePixelRatio = dpr;
  drpListeningCharts.forEach((resize, chart) => {
    if (chart.currentDevicePixelRatio !== dpr) {
      resize();
    }
  });
}
function listenDevicePixelRatioChanges(chart, resize) {
  if (!drpListeningCharts.size) {
    window.addEventListener("resize", onWindowResize);
  }
  drpListeningCharts.set(chart, resize);
}
function unlistenDevicePixelRatioChanges(chart) {
  drpListeningCharts.delete(chart);
  if (!drpListeningCharts.size) {
    window.removeEventListener("resize", onWindowResize);
  }
}
function createResizeObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && _getParentNode(canvas);
  if (!container) {
    return;
  }
  const resize = throttled((width, height) => {
    const w = container.clientWidth;
    listener(width, height);
    if (w < container.clientWidth) {
      listener();
    }
  }, window);
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    if (width === 0 && height === 0) {
      return;
    }
    resize(width, height);
  });
  observer.observe(container);
  listenDevicePixelRatioChanges(chart, resize);
  return observer;
}
function releaseObserver(chart, type, observer) {
  if (observer) {
    observer.disconnect();
  }
  if (type === "resize") {
    unlistenDevicePixelRatioChanges(chart);
  }
}
function createProxyAndListen(chart, type, listener) {
  const canvas = chart.canvas;
  const proxy = throttled((event) => {
    if (chart.ctx !== null) {
      listener(fromNativeEvent(event, chart));
    }
  }, chart);
  addListener(canvas, type, proxy);
  return proxy;
}
var DomPlatform = class extends BasePlatform {
  acquireContext(canvas, aspectRatio) {
    const context = canvas && canvas.getContext && canvas.getContext("2d");
    if (context && context.canvas === canvas) {
      initCanvas(canvas, aspectRatio);
      return context;
    }
    return null;
  }
  releaseContext(context) {
    const canvas = context.canvas;
    if (!canvas[EXPANDO_KEY]) {
      return false;
    }
    const initial = canvas[EXPANDO_KEY].initial;
    [
      "height",
      "width"
    ].forEach((prop) => {
      const value2 = initial[prop];
      if (isNullOrUndef(value2)) {
        canvas.removeAttribute(prop);
      } else {
        canvas.setAttribute(prop, value2);
      }
    });
    const style = initial.style || {};
    Object.keys(style).forEach((key) => {
      canvas.style[key] = style[key];
    });
    canvas.width = canvas.width;
    delete canvas[EXPANDO_KEY];
    return true;
  }
  addEventListener(chart, type, listener) {
    this.removeEventListener(chart, type);
    const proxies = chart.$proxies || (chart.$proxies = {});
    const handlers = {
      attach: createAttachObserver,
      detach: createDetachObserver,
      resize: createResizeObserver
    };
    const handler = handlers[type] || createProxyAndListen;
    proxies[type] = handler(chart, type, listener);
  }
  removeEventListener(chart, type) {
    const proxies = chart.$proxies || (chart.$proxies = {});
    const proxy = proxies[type];
    if (!proxy) {
      return;
    }
    const handlers = {
      attach: releaseObserver,
      detach: releaseObserver,
      resize: releaseObserver
    };
    const handler = handlers[type] || removeListener;
    handler(chart, type, proxy);
    proxies[type] = void 0;
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(canvas, width, height, aspectRatio) {
    return getMaximumSize(canvas, width, height, aspectRatio);
  }
  isAttached(canvas) {
    const container = canvas && _getParentNode(canvas);
    return !!(container && container.isConnected);
  }
};
function _detectPlatform(canvas) {
  if (!_isDomSupported() || typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return BasicPlatform;
  }
  return DomPlatform;
}
var Element = class {
  static defaults = {};
  static defaultRoutes = void 0;
  x;
  y;
  active = false;
  options;
  $animations;
  tooltipPosition(useFinalPosition) {
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x,
      y
    };
  }
  hasValue() {
    return isNumber(this.x) && isNumber(this.y);
  }
  getProps(props, final) {
    const anims = this.$animations;
    if (!final || !anims) {
      return this;
    }
    const ret = {};
    props.forEach((prop) => {
      ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
    });
    return ret;
  }
};
function autoSkip(scale, ticks) {
  const tickOpts = scale.options.ticks;
  const determinedMaxTicks = determineMaxTicks(scale);
  const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
  const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
  const numMajorIndices = majorIndices.length;
  const first = majorIndices[0];
  const last = majorIndices[numMajorIndices - 1];
  const newTicks = [];
  if (numMajorIndices > ticksLimit) {
    skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
    return newTicks;
  }
  const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
  if (numMajorIndices > 0) {
    let i, ilen;
    const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
    skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
    for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
      skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
    }
    skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
    return newTicks;
  }
  skip(ticks, newTicks, spacing);
  return newTicks;
}
function determineMaxTicks(scale) {
  const offset = scale.options.offset;
  const tickLength = scale._tickSize();
  const maxScale = scale._length / tickLength + (offset ? 0 : 1);
  const maxChart = scale._maxLength / tickLength;
  return Math.floor(Math.min(maxScale, maxChart));
}
function calculateSpacing(majorIndices, ticks, ticksLimit) {
  const evenMajorSpacing = getEvenSpacing(majorIndices);
  const spacing = ticks.length / ticksLimit;
  if (!evenMajorSpacing) {
    return Math.max(spacing, 1);
  }
  const factors = _factorize(evenMajorSpacing);
  for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
    const factor = factors[i];
    if (factor > spacing) {
      return factor;
    }
  }
  return Math.max(spacing, 1);
}
function getMajorIndices(ticks) {
  const result = [];
  let i, ilen;
  for (i = 0, ilen = ticks.length; i < ilen; i++) {
    if (ticks[i].major) {
      result.push(i);
    }
  }
  return result;
}
function skipMajors(ticks, newTicks, majorIndices, spacing) {
  let count = 0;
  let next = majorIndices[0];
  let i;
  spacing = Math.ceil(spacing);
  for (i = 0; i < ticks.length; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = majorIndices[count * spacing];
    }
  }
}
function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
  const start = valueOrDefault(majorStart, 0);
  const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
  let count = 0;
  let length, i, next;
  spacing = Math.ceil(spacing);
  if (majorEnd) {
    length = majorEnd - majorStart;
    spacing = length / Math.floor(length / spacing);
  }
  next = start;
  while (next < 0) {
    count++;
    next = Math.round(start + count * spacing);
  }
  for (i = Math.max(start, 0); i < end; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = Math.round(start + count * spacing);
    }
  }
}
function getEvenSpacing(arr) {
  const len = arr.length;
  let i, diff;
  if (len < 2) {
    return false;
  }
  for (diff = arr[0], i = 1; i < len; ++i) {
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }
  return diff;
}
var reverseAlign = (align) => align === "left" ? "right" : align === "right" ? "left" : align;
var offsetFromEdge = (scale, edge, offset) => edge === "top" || edge === "left" ? scale[edge] + offset : scale[edge] - offset;
var getTicksLimit = (ticksLength, maxTicksLimit) => Math.min(maxTicksLimit || ticksLength, ticksLength);
function sample(arr, numItems) {
  const result = [];
  const increment = arr.length / numItems;
  const len = arr.length;
  let i = 0;
  for (; i < len; i += increment) {
    result.push(arr[Math.floor(i)]);
  }
  return result;
}
function getPixelForGridLine(scale, index, offsetGridLines) {
  const length = scale.ticks.length;
  const validIndex2 = Math.min(index, length - 1);
  const start = scale._startPixel;
  const end = scale._endPixel;
  const epsilon = 1e-6;
  let lineValue = scale.getPixelForTick(validIndex2);
  let offset;
  if (offsetGridLines) {
    if (length === 1) {
      offset = Math.max(lineValue - start, end - lineValue);
    } else if (index === 0) {
      offset = (scale.getPixelForTick(1) - lineValue) / 2;
    } else {
      offset = (lineValue - scale.getPixelForTick(validIndex2 - 1)) / 2;
    }
    lineValue += validIndex2 < index ? offset : -offset;
    if (lineValue < start - epsilon || lineValue > end + epsilon) {
      return;
    }
  }
  return lineValue;
}
function garbageCollect(caches, length) {
  each(caches, (cache2) => {
    const gc = cache2.gc;
    const gcLen = gc.length / 2;
    let i;
    if (gcLen > length) {
      for (i = 0; i < gcLen; ++i) {
        delete cache2.data[gc[i]];
      }
      gc.splice(0, gcLen);
    }
  });
}
function getTickMarkLength(options) {
  return options.drawTicks ? options.tickLength : 0;
}
function getTitleHeight(options, fallback) {
  if (!options.display) {
    return 0;
  }
  const font = toFont(options.font, fallback);
  const padding = toPadding(options.padding);
  const lines = isArray(options.text) ? options.text.length : 1;
  return lines * font.lineHeight + padding.height;
}
function createScaleContext(parent, scale) {
  return createContext(parent, {
    scale,
    type: "scale"
  });
}
function createTickContext(parent, index, tick) {
  return createContext(parent, {
    tick,
    index,
    type: "tick"
  });
}
function titleAlign(align, position, reverse) {
  let ret = _toLeftRightCenter(align);
  if (reverse && position !== "right" || !reverse && position === "right") {
    ret = reverseAlign(ret);
  }
  return ret;
}
function titleArgs(scale, offset, position, align) {
  const { top, left, bottom, right, chart } = scale;
  const { chartArea, scales } = chart;
  let rotation = 0;
  let maxWidth, titleX, titleY;
  const height = bottom - top;
  const width = right - left;
  if (scale.isHorizontal()) {
    titleX = _alignStartEnd(align, left, right);
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value2 = position[positionAxisID];
      titleY = scales[positionAxisID].getPixelForValue(value2) + height - offset;
    } else if (position === "center") {
      titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
    } else {
      titleY = offsetFromEdge(scale, position, offset);
    }
    maxWidth = right - left;
  } else {
    if (isObject(position)) {
      const positionAxisID = Object.keys(position)[0];
      const value2 = position[positionAxisID];
      titleX = scales[positionAxisID].getPixelForValue(value2) - width + offset;
    } else if (position === "center") {
      titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
    } else {
      titleX = offsetFromEdge(scale, position, offset);
    }
    titleY = _alignStartEnd(align, bottom, top);
    rotation = position === "left" ? -HALF_PI : HALF_PI;
  }
  return {
    titleX,
    titleY,
    maxWidth,
    rotation
  };
}
var Scale = class _Scale extends Element {
  constructor(cfg) {
    super();
    this.id = cfg.id;
    this.type = cfg.type;
    this.options = void 0;
    this.ctx = cfg.ctx;
    this.chart = cfg.chart;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    this.maxWidth = void 0;
    this.maxHeight = void 0;
    this.paddingTop = void 0;
    this.paddingBottom = void 0;
    this.paddingLeft = void 0;
    this.paddingRight = void 0;
    this.axis = void 0;
    this.labelRotation = void 0;
    this.min = void 0;
    this.max = void 0;
    this._range = void 0;
    this.ticks = [];
    this._gridLineItems = null;
    this._labelItems = null;
    this._labelSizes = null;
    this._length = 0;
    this._maxLength = 0;
    this._longestTextCache = {};
    this._startPixel = void 0;
    this._endPixel = void 0;
    this._reversePixels = false;
    this._userMax = void 0;
    this._userMin = void 0;
    this._suggestedMax = void 0;
    this._suggestedMin = void 0;
    this._ticksLength = 0;
    this._borderValue = 0;
    this._cache = {};
    this._dataLimitsCached = false;
    this.$context = void 0;
  }
  init(options) {
    this.options = options.setContext(this.getContext());
    this.axis = options.axis;
    this._userMin = this.parse(options.min);
    this._userMax = this.parse(options.max);
    this._suggestedMin = this.parse(options.suggestedMin);
    this._suggestedMax = this.parse(options.suggestedMax);
  }
  parse(raw, index) {
    return raw;
  }
  getUserBounds() {
    let { _userMin, _userMax, _suggestedMin, _suggestedMax } = this;
    _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
    _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
    _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
    _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
    return {
      min: finiteOrDefault(_userMin, _suggestedMin),
      max: finiteOrDefault(_userMax, _suggestedMax),
      minDefined: isNumberFinite(_userMin),
      maxDefined: isNumberFinite(_userMax)
    };
  }
  getMinMax(canStack) {
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    let range;
    if (minDefined && maxDefined) {
      return {
        min,
        max
      };
    }
    const metas = this.getMatchingVisibleMetas();
    for (let i = 0, ilen = metas.length; i < ilen; ++i) {
      range = metas[i].controller.getMinMax(this, canStack);
      if (!minDefined) {
        min = Math.min(min, range.min);
      }
      if (!maxDefined) {
        max = Math.max(max, range.max);
      }
    }
    min = maxDefined && min > max ? max : min;
    max = minDefined && min > max ? min : max;
    return {
      min: finiteOrDefault(min, finiteOrDefault(max, min)),
      max: finiteOrDefault(max, finiteOrDefault(min, max))
    };
  }
  getPadding() {
    return {
      left: this.paddingLeft || 0,
      top: this.paddingTop || 0,
      right: this.paddingRight || 0,
      bottom: this.paddingBottom || 0
    };
  }
  getTicks() {
    return this.ticks;
  }
  getLabels() {
    const data = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
  }
  getLabelItems(chartArea = this.chart.chartArea) {
    const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
    return items;
  }
  beforeLayout() {
    this._cache = {};
    this._dataLimitsCached = false;
  }
  beforeUpdate() {
    callback(this.options.beforeUpdate, [
      this
    ]);
  }
  update(maxWidth, maxHeight, margins) {
    const { beginAtZero, grace, ticks: tickOpts } = this.options;
    const sampleSize = tickOpts.sampleSize;
    this.beforeUpdate();
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    this.ticks = null;
    this._labelSizes = null;
    this._gridLineItems = null;
    this._labelItems = null;
    this.beforeSetDimensions();
    this.setDimensions();
    this.afterSetDimensions();
    this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
    if (!this._dataLimitsCached) {
      this.beforeDataLimits();
      this.determineDataLimits();
      this.afterDataLimits();
      this._range = _addGrace(this, grace, beginAtZero);
      this._dataLimitsCached = true;
    }
    this.beforeBuildTicks();
    this.ticks = this.buildTicks() || [];
    this.afterBuildTicks();
    const samplingEnabled = sampleSize < this.ticks.length;
    this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
    this.configure();
    this.beforeCalculateLabelRotation();
    this.calculateLabelRotation();
    this.afterCalculateLabelRotation();
    if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === "auto")) {
      this.ticks = autoSkip(this, this.ticks);
      this._labelSizes = null;
      this.afterAutoSkip();
    }
    if (samplingEnabled) {
      this._convertTicksToLabels(this.ticks);
    }
    this.beforeFit();
    this.fit();
    this.afterFit();
    this.afterUpdate();
  }
  configure() {
    let reversePixels = this.options.reverse;
    let startPixel, endPixel;
    if (this.isHorizontal()) {
      startPixel = this.left;
      endPixel = this.right;
    } else {
      startPixel = this.top;
      endPixel = this.bottom;
      reversePixels = !reversePixels;
    }
    this._startPixel = startPixel;
    this._endPixel = endPixel;
    this._reversePixels = reversePixels;
    this._length = endPixel - startPixel;
    this._alignToPixels = this.options.alignToPixels;
  }
  afterUpdate() {
    callback(this.options.afterUpdate, [
      this
    ]);
  }
  beforeSetDimensions() {
    callback(this.options.beforeSetDimensions, [
      this
    ]);
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = 0;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = 0;
      this.bottom = this.height;
    }
    this.paddingLeft = 0;
    this.paddingTop = 0;
    this.paddingRight = 0;
    this.paddingBottom = 0;
  }
  afterSetDimensions() {
    callback(this.options.afterSetDimensions, [
      this
    ]);
  }
  _callHooks(name) {
    this.chart.notifyPlugins(name, this.getContext());
    callback(this.options[name], [
      this
    ]);
  }
  beforeDataLimits() {
    this._callHooks("beforeDataLimits");
  }
  determineDataLimits() {
  }
  afterDataLimits() {
    this._callHooks("afterDataLimits");
  }
  beforeBuildTicks() {
    this._callHooks("beforeBuildTicks");
  }
  buildTicks() {
    return [];
  }
  afterBuildTicks() {
    this._callHooks("afterBuildTicks");
  }
  beforeTickToLabelConversion() {
    callback(this.options.beforeTickToLabelConversion, [
      this
    ]);
  }
  generateTickLabels(ticks) {
    const tickOpts = this.options.ticks;
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      tick = ticks[i];
      tick.label = callback(tickOpts.callback, [
        tick.value,
        i,
        ticks
      ], this);
    }
  }
  afterTickToLabelConversion() {
    callback(this.options.afterTickToLabelConversion, [
      this
    ]);
  }
  beforeCalculateLabelRotation() {
    callback(this.options.beforeCalculateLabelRotation, [
      this
    ]);
  }
  calculateLabelRotation() {
    const options = this.options;
    const tickOpts = options.ticks;
    const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
    let labelRotation = minRotation;
    let tickWidth, maxHeight, maxLabelDiagonal;
    if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
      this.labelRotation = minRotation;
      return;
    }
    const labelSizes = this._getLabelSizes();
    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
    tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
    if (maxLabelWidth + 6 > tickWidth) {
      tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
      maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
      maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
      labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
      labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }
    this.labelRotation = labelRotation;
  }
  afterCalculateLabelRotation() {
    callback(this.options.afterCalculateLabelRotation, [
      this
    ]);
  }
  afterAutoSkip() {
  }
  beforeFit() {
    callback(this.options.beforeFit, [
      this
    ]);
  }
  fit() {
    const minSize = {
      width: 0,
      height: 0
    };
    const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
    const display = this._isVisible();
    const isHorizontal = this.isHorizontal();
    if (display) {
      const titleHeight = getTitleHeight(titleOpts, chart.options.font);
      if (isHorizontal) {
        minSize.width = this.maxWidth;
        minSize.height = getTickMarkLength(gridOpts) + titleHeight;
      } else {
        minSize.height = this.maxHeight;
        minSize.width = getTickMarkLength(gridOpts) + titleHeight;
      }
      if (tickOpts.display && this.ticks.length) {
        const { first, last, widest, highest } = this._getLabelSizes();
        const tickPadding = tickOpts.padding * 2;
        const angleRadians = toRadians(this.labelRotation);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);
        if (isHorizontal) {
          const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
          minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
        } else {
          const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
          minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
        }
        this._calculatePadding(first, last, sin, cos);
      }
    }
    this._handleMargins();
    if (isHorizontal) {
      this.width = this._length = chart.width - this._margins.left - this._margins.right;
      this.height = minSize.height;
    } else {
      this.width = minSize.width;
      this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
    }
  }
  _calculatePadding(first, last, sin, cos) {
    const { ticks: { align, padding }, position } = this.options;
    const isRotated = this.labelRotation !== 0;
    const labelsBelowTicks = position !== "top" && this.axis === "x";
    if (this.isHorizontal()) {
      const offsetLeft = this.getPixelForTick(0) - this.left;
      const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
      let paddingLeft = 0;
      let paddingRight = 0;
      if (isRotated) {
        if (labelsBelowTicks) {
          paddingLeft = cos * first.width;
          paddingRight = sin * last.height;
        } else {
          paddingLeft = sin * first.height;
          paddingRight = cos * last.width;
        }
      } else if (align === "start") {
        paddingRight = last.width;
      } else if (align === "end") {
        paddingLeft = first.width;
      } else if (align !== "inner") {
        paddingLeft = first.width / 2;
        paddingRight = last.width / 2;
      }
      this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
      this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
    } else {
      let paddingTop = last.height / 2;
      let paddingBottom = first.height / 2;
      if (align === "start") {
        paddingTop = 0;
        paddingBottom = first.height;
      } else if (align === "end") {
        paddingTop = last.height;
        paddingBottom = 0;
      }
      this.paddingTop = paddingTop + padding;
      this.paddingBottom = paddingBottom + padding;
    }
  }
  _handleMargins() {
    if (this._margins) {
      this._margins.left = Math.max(this.paddingLeft, this._margins.left);
      this._margins.top = Math.max(this.paddingTop, this._margins.top);
      this._margins.right = Math.max(this.paddingRight, this._margins.right);
      this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
    }
  }
  afterFit() {
    callback(this.options.afterFit, [
      this
    ]);
  }
  isHorizontal() {
    const { axis, position } = this.options;
    return position === "top" || position === "bottom" || axis === "x";
  }
  isFullSize() {
    return this.options.fullSize;
  }
  _convertTicksToLabels(ticks) {
    this.beforeTickToLabelConversion();
    this.generateTickLabels(ticks);
    let i, ilen;
    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      if (isNullOrUndef(ticks[i].label)) {
        ticks.splice(i, 1);
        ilen--;
        i--;
      }
    }
    this.afterTickToLabelConversion();
  }
  _getLabelSizes() {
    let labelSizes = this._labelSizes;
    if (!labelSizes) {
      const sampleSize = this.options.ticks.sampleSize;
      let ticks = this.ticks;
      if (sampleSize < ticks.length) {
        ticks = sample(ticks, sampleSize);
      }
      this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
    }
    return labelSizes;
  }
  _computeLabelSizes(ticks, length, maxTicksLimit) {
    const { ctx, _longestTextCache: caches } = this;
    const widths = [];
    const heights = [];
    const increment = Math.floor(length / getTicksLimit(length, maxTicksLimit));
    let widestLabelSize = 0;
    let highestLabelSize = 0;
    let i, j, jlen, label, tickFont, fontString, cache2, lineHeight, width, height, nestedLabel;
    for (i = 0; i < length; i += increment) {
      label = ticks[i].label;
      tickFont = this._resolveTickFontOptions(i);
      ctx.font = fontString = tickFont.string;
      cache2 = caches[fontString] = caches[fontString] || {
        data: {},
        gc: []
      };
      lineHeight = tickFont.lineHeight;
      width = height = 0;
      if (!isNullOrUndef(label) && !isArray(label)) {
        width = _measureText(ctx, cache2.data, cache2.gc, width, label);
        height = lineHeight;
      } else if (isArray(label)) {
        for (j = 0, jlen = label.length; j < jlen; ++j) {
          nestedLabel = label[j];
          if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
            width = _measureText(ctx, cache2.data, cache2.gc, width, nestedLabel);
            height += lineHeight;
          }
        }
      }
      widths.push(width);
      heights.push(height);
      widestLabelSize = Math.max(width, widestLabelSize);
      highestLabelSize = Math.max(height, highestLabelSize);
    }
    garbageCollect(caches, length);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);
    const valueAt = (idx) => ({
      width: widths[idx] || 0,
      height: heights[idx] || 0
    });
    return {
      first: valueAt(0),
      last: valueAt(length - 1),
      widest: valueAt(widest),
      highest: valueAt(highest),
      widths,
      heights
    };
  }
  getLabelForValue(value2) {
    return value2;
  }
  getPixelForValue(value2, index) {
    return NaN;
  }
  getValueForPixel(pixel) {
  }
  getPixelForTick(index) {
    const ticks = this.ticks;
    if (index < 0 || index > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index].value);
  }
  getPixelForDecimal(decimal) {
    if (this._reversePixels) {
      decimal = 1 - decimal;
    }
    const pixel = this._startPixel + decimal * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
  }
  getDecimalForPixel(pixel) {
    const decimal = (pixel - this._startPixel) / this._length;
    return this._reversePixels ? 1 - decimal : decimal;
  }
  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }
  getBaseValue() {
    const { min, max } = this;
    return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
  }
  getContext(index) {
    const ticks = this.ticks || [];
    if (index >= 0 && index < ticks.length) {
      const tick = ticks[index];
      return tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
    }
    return this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
  }
  _tickSize() {
    const optionTicks = this.options.ticks;
    const rot = toRadians(this.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const labelSizes = this._getLabelSizes();
    const padding = optionTicks.autoSkipPadding || 0;
    const w = labelSizes ? labelSizes.widest.width + padding : 0;
    const h = labelSizes ? labelSizes.highest.height + padding : 0;
    return this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
  }
  _isVisible() {
    const display = this.options.display;
    if (display !== "auto") {
      return !!display;
    }
    return this.getMatchingVisibleMetas().length > 0;
  }
  _computeGridLineItems(chartArea) {
    const axis = this.axis;
    const chart = this.chart;
    const options = this.options;
    const { grid, position, border } = options;
    const offset = grid.offset;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = borderOpts.display ? borderOpts.width : 0;
    const axisHalfWidth = axisWidth / 2;
    const alignBorderValue = function(pixel) {
      return _alignPixel(chart, pixel, axisWidth);
    };
    let borderValue, i, lineValue, alignedLineValue;
    let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
    if (position === "top") {
      borderValue = alignBorderValue(this.bottom);
      ty1 = this.bottom - tl;
      ty2 = borderValue - axisHalfWidth;
      y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
      y2 = chartArea.bottom;
    } else if (position === "bottom") {
      borderValue = alignBorderValue(this.top);
      y1 = chartArea.top;
      y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
      ty1 = borderValue + axisHalfWidth;
      ty2 = this.top + tl;
    } else if (position === "left") {
      borderValue = alignBorderValue(this.right);
      tx1 = this.right - tl;
      tx2 = borderValue - axisHalfWidth;
      x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
      x2 = chartArea.right;
    } else if (position === "right") {
      borderValue = alignBorderValue(this.left);
      x1 = chartArea.left;
      x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
      tx1 = borderValue + axisHalfWidth;
      tx2 = this.left + tl;
    } else if (axis === "x") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value2 = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value2));
      }
      y1 = chartArea.top;
      y2 = chartArea.bottom;
      ty1 = borderValue + axisHalfWidth;
      ty2 = ty1 + tl;
    } else if (axis === "y") {
      if (position === "center") {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value2 = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value2));
      }
      tx1 = borderValue - axisHalfWidth;
      tx2 = tx1 - tl;
      x1 = chartArea.left;
      x2 = chartArea.right;
    }
    const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
    const step = Math.max(1, Math.ceil(ticksLength / limit));
    for (i = 0; i < ticksLength; i += step) {
      const context = this.getContext(i);
      const optsAtIndex = grid.setContext(context);
      const optsAtIndexBorder = border.setContext(context);
      const lineWidth = optsAtIndex.lineWidth;
      const lineColor = optsAtIndex.color;
      const borderDash = optsAtIndexBorder.dash || [];
      const borderDashOffset = optsAtIndexBorder.dashOffset;
      const tickWidth = optsAtIndex.tickWidth;
      const tickColor = optsAtIndex.tickColor;
      const tickBorderDash = optsAtIndex.tickBorderDash || [];
      const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
      lineValue = getPixelForGridLine(this, i, offset);
      if (lineValue === void 0) {
        continue;
      }
      alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
      if (isHorizontal) {
        tx1 = tx2 = x1 = x2 = alignedLineValue;
      } else {
        ty1 = ty2 = y1 = y2 = alignedLineValue;
      }
      items.push({
        tx1,
        ty1,
        tx2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        width: lineWidth,
        color: lineColor,
        borderDash,
        borderDashOffset,
        tickWidth,
        tickColor,
        tickBorderDash,
        tickBorderDashOffset
      });
    }
    this._ticksLength = ticksLength;
    this._borderValue = borderValue;
    return items;
  }
  _computeLabelItems(chartArea) {
    const axis = this.axis;
    const options = this.options;
    const { position, ticks: optionTicks } = options;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const { align, crossAlign, padding, mirror } = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + padding;
    const hTickAndPadding = mirror ? -padding : tickAndPadding;
    const rotation = -toRadians(this.labelRotation);
    const items = [];
    let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
    let textBaseline = "middle";
    if (position === "top") {
      y = this.bottom - hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "bottom") {
      y = this.top + hTickAndPadding;
      textAlign = this._getXAxisLabelAlignment();
    } else if (position === "left") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (position === "right") {
      const ret = this._getYAxisLabelAlignment(tl);
      textAlign = ret.textAlign;
      x = ret.x;
    } else if (axis === "x") {
      if (position === "center") {
        y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value2 = position[positionAxisID];
        y = this.chart.scales[positionAxisID].getPixelForValue(value2) + tickAndPadding;
      }
      textAlign = this._getXAxisLabelAlignment();
    } else if (axis === "y") {
      if (position === "center") {
        x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
      } else if (isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value2 = position[positionAxisID];
        x = this.chart.scales[positionAxisID].getPixelForValue(value2);
      }
      textAlign = this._getYAxisLabelAlignment(tl).textAlign;
    }
    if (axis === "y") {
      if (align === "start") {
        textBaseline = "top";
      } else if (align === "end") {
        textBaseline = "bottom";
      }
    }
    const labelSizes = this._getLabelSizes();
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      label = tick.label;
      const optsAtIndex = optionTicks.setContext(this.getContext(i));
      pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
      font = this._resolveTickFontOptions(i);
      lineHeight = font.lineHeight;
      lineCount = isArray(label) ? label.length : 1;
      const halfCount = lineCount / 2;
      const color2 = optsAtIndex.color;
      const strokeColor = optsAtIndex.textStrokeColor;
      const strokeWidth = optsAtIndex.textStrokeWidth;
      let tickTextAlign = textAlign;
      if (isHorizontal) {
        x = pixel;
        if (textAlign === "inner") {
          if (i === ilen - 1) {
            tickTextAlign = !this.options.reverse ? "right" : "left";
          } else if (i === 0) {
            tickTextAlign = !this.options.reverse ? "left" : "right";
          } else {
            tickTextAlign = "center";
          }
        }
        if (position === "top") {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = -lineCount * lineHeight + lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
          } else {
            textOffset = -labelSizes.highest.height + lineHeight / 2;
          }
        } else {
          if (crossAlign === "near" || rotation !== 0) {
            textOffset = lineHeight / 2;
          } else if (crossAlign === "center") {
            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
          } else {
            textOffset = labelSizes.highest.height - lineCount * lineHeight;
          }
        }
        if (mirror) {
          textOffset *= -1;
        }
        if (rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
          x += lineHeight / 2 * Math.sin(rotation);
        }
      } else {
        y = pixel;
        textOffset = (1 - lineCount) * lineHeight / 2;
      }
      let backdrop;
      if (optsAtIndex.showLabelBackdrop) {
        const labelPadding = toPadding(optsAtIndex.backdropPadding);
        const height = labelSizes.heights[i];
        const width = labelSizes.widths[i];
        let top = textOffset - labelPadding.top;
        let left = 0 - labelPadding.left;
        switch (textBaseline) {
          case "middle":
            top -= height / 2;
            break;
          case "bottom":
            top -= height;
            break;
        }
        switch (textAlign) {
          case "center":
            left -= width / 2;
            break;
          case "right":
            left -= width;
            break;
          case "inner":
            if (i === ilen - 1) {
              left -= width;
            } else if (i > 0) {
              left -= width / 2;
            }
            break;
        }
        backdrop = {
          left,
          top,
          width: width + labelPadding.width,
          height: height + labelPadding.height,
          color: optsAtIndex.backdropColor
        };
      }
      items.push({
        label,
        font,
        textOffset,
        options: {
          rotation,
          color: color2,
          strokeColor,
          strokeWidth,
          textAlign: tickTextAlign,
          textBaseline,
          translation: [
            x,
            y
          ],
          backdrop
        }
      });
    }
    return items;
  }
  _getXAxisLabelAlignment() {
    const { position, ticks } = this.options;
    const rotation = -toRadians(this.labelRotation);
    if (rotation) {
      return position === "top" ? "left" : "right";
    }
    let align = "center";
    if (ticks.align === "start") {
      align = "left";
    } else if (ticks.align === "end") {
      align = "right";
    } else if (ticks.align === "inner") {
      align = "inner";
    }
    return align;
  }
  _getYAxisLabelAlignment(tl) {
    const { position, ticks: { crossAlign, mirror, padding } } = this.options;
    const labelSizes = this._getLabelSizes();
    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x;
    if (position === "left") {
      if (mirror) {
        x = this.right + padding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x += widest / 2;
        } else {
          textAlign = "right";
          x += widest;
        }
      } else {
        x = this.right - tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x -= widest / 2;
        } else {
          textAlign = "left";
          x = this.left;
        }
      }
    } else if (position === "right") {
      if (mirror) {
        x = this.left + padding;
        if (crossAlign === "near") {
          textAlign = "right";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x -= widest / 2;
        } else {
          textAlign = "left";
          x -= widest;
        }
      } else {
        x = this.left + tickAndPadding;
        if (crossAlign === "near") {
          textAlign = "left";
        } else if (crossAlign === "center") {
          textAlign = "center";
          x += widest / 2;
        } else {
          textAlign = "right";
          x = this.right;
        }
      }
    } else {
      textAlign = "right";
    }
    return {
      textAlign,
      x
    };
  }
  _computeLabelArea() {
    if (this.options.ticks.mirror) {
      return;
    }
    const chart = this.chart;
    const position = this.options.position;
    if (position === "left" || position === "right") {
      return {
        top: 0,
        left: this.left,
        bottom: chart.height,
        right: this.right
      };
    }
    if (position === "top" || position === "bottom") {
      return {
        top: this.top,
        left: 0,
        bottom: this.bottom,
        right: chart.width
      };
    }
  }
  drawBackground() {
    const { ctx, options: { backgroundColor }, left, top, width, height } = this;
    if (backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    }
  }
  getLineWidthForValue(value2) {
    const grid = this.options.grid;
    if (!this._isVisible() || !grid.display) {
      return 0;
    }
    const ticks = this.ticks;
    const index = ticks.findIndex((t2) => t2.value === value2);
    if (index >= 0) {
      const opts = grid.setContext(this.getContext(index));
      return opts.lineWidth;
    }
    return 0;
  }
  drawGrid(chartArea) {
    const grid = this.options.grid;
    const ctx = this.ctx;
    const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
    let i, ilen;
    const drawLine = (p1, p2, style) => {
      if (!style.width || !style.color) {
        return;
      }
      ctx.save();
      ctx.lineWidth = style.width;
      ctx.strokeStyle = style.color;
      ctx.setLineDash(style.borderDash || []);
      ctx.lineDashOffset = style.borderDashOffset;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    };
    if (grid.display) {
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        const item = items[i];
        if (grid.drawOnChartArea) {
          drawLine({
            x: item.x1,
            y: item.y1
          }, {
            x: item.x2,
            y: item.y2
          }, item);
        }
        if (grid.drawTicks) {
          drawLine({
            x: item.tx1,
            y: item.ty1
          }, {
            x: item.tx2,
            y: item.ty2
          }, {
            color: item.tickColor,
            width: item.tickWidth,
            borderDash: item.tickBorderDash,
            borderDashOffset: item.tickBorderDashOffset
          });
        }
      }
    }
  }
  drawBorder() {
    const { chart, ctx, options: { border, grid } } = this;
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = border.display ? borderOpts.width : 0;
    if (!axisWidth) {
      return;
    }
    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
    const borderValue = this._borderValue;
    let x1, x2, y1, y2;
    if (this.isHorizontal()) {
      x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
      x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
      y1 = y2 = borderValue;
    } else {
      y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
      y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
      x1 = x2 = borderValue;
    }
    ctx.save();
    ctx.lineWidth = borderOpts.width;
    ctx.strokeStyle = borderOpts.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  drawLabels(chartArea) {
    const optionTicks = this.options.ticks;
    if (!optionTicks.display) {
      return;
    }
    const ctx = this.ctx;
    const area = this._computeLabelArea();
    if (area) {
      clipArea(ctx, area);
    }
    const items = this.getLabelItems(chartArea);
    for (const item of items) {
      const renderTextOptions = item.options;
      const tickFont = item.font;
      const label = item.label;
      const y = item.textOffset;
      renderText(ctx, label, 0, y, tickFont, renderTextOptions);
    }
    if (area) {
      unclipArea(ctx);
    }
  }
  drawTitle() {
    const { ctx, options: { position, title, reverse } } = this;
    if (!title.display) {
      return;
    }
    const font = toFont(title.font);
    const padding = toPadding(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;
    if (position === "bottom" || position === "center" || isObject(position)) {
      offset += padding.bottom;
      if (isArray(title.text)) {
        offset += font.lineHeight * (title.text.length - 1);
      }
    } else {
      offset += padding.top;
    }
    const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
    renderText(ctx, title.text, 0, 0, font, {
      color: title.color,
      maxWidth,
      rotation,
      textAlign: titleAlign(align, position, reverse),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ],
      strokeColor: title.strokeColor,
      strokeWidth: title.strokeWidth
    });
  }
  draw(chartArea) {
    if (!this._isVisible()) {
      return;
    }
    this.drawBackground();
    this.drawGrid(chartArea);
    this.drawBorder();
    this.drawTitle();
    this.drawLabels(chartArea);
  }
  _layers() {
    const opts = this.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
    const bz = valueOrDefault(opts.border && opts.border.z, 0);
    if (!this._isVisible() || this.draw !== _Scale.prototype.draw) {
      return [
        {
          z: tz,
          draw: (chartArea) => {
            this.draw(chartArea);
          }
        }
      ];
    }
    return [
      {
        z: gz,
        draw: (chartArea) => {
          this.drawBackground();
          this.drawGrid(chartArea);
          this.drawTitle();
        }
      },
      {
        z: bz,
        draw: () => {
          this.drawBorder();
        }
      },
      {
        z: tz,
        draw: (chartArea) => {
          this.drawLabels(chartArea);
        }
      }
    ];
  }
  getMatchingVisibleMetas(type) {
    const metas = this.chart.getSortedVisibleDatasetMetas();
    const axisID = this.axis + "AxisID";
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      const meta = metas[i];
      if (meta[axisID] === this.id && (!type || meta.type === type)) {
        result.push(meta);
      }
    }
    return result;
  }
  _resolveTickFontOptions(index) {
    const opts = this.options.ticks.setContext(this.getContext(index));
    return toFont(opts.font);
  }
  _maxDigits() {
    const fontSize = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / fontSize;
  }
};
var TypedRegistry = class {
  constructor(type, scope, override) {
    this.type = type;
    this.scope = scope;
    this.override = override;
    this.items = /* @__PURE__ */ Object.create(null);
  }
  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }
  register(item) {
    const proto = Object.getPrototypeOf(item);
    let parentScope;
    if (isIChartComponent(proto)) {
      parentScope = this.register(proto);
    }
    const items = this.items;
    const id = item.id;
    const scope = this.scope + "." + id;
    if (!id) {
      throw new Error("class does not have id: " + item);
    }
    if (id in items) {
      return scope;
    }
    items[id] = item;
    registerDefaults(item, scope, parentScope);
    if (this.override) {
      defaults.override(item.id, item.overrides);
    }
    return scope;
  }
  get(id) {
    return this.items[id];
  }
  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;
    if (id in items) {
      delete items[id];
    }
    if (scope && id in defaults[scope]) {
      delete defaults[scope][id];
      if (this.override) {
        delete overrides[id];
      }
    }
  }
};
function registerDefaults(item, scope, parentScope) {
  const itemDefaults = merge(/* @__PURE__ */ Object.create(null), [
    parentScope ? defaults.get(parentScope) : {},
    defaults.get(scope),
    item.defaults
  ]);
  defaults.set(scope, itemDefaults);
  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }
  if (item.descriptors) {
    defaults.describe(scope, item.descriptors);
  }
}
function routeDefaults(scope, routes) {
  Object.keys(routes).forEach((property) => {
    const propertyParts = property.split(".");
    const sourceName = propertyParts.pop();
    const sourceScope = [
      scope
    ].concat(propertyParts).join(".");
    const parts = routes[property].split(".");
    const targetName = parts.pop();
    const targetScope = parts.join(".");
    defaults.route(sourceScope, sourceName, targetScope, targetName);
  });
}
function isIChartComponent(proto) {
  return "id" in proto && "defaults" in proto;
}
var Registry = class {
  constructor() {
    this.controllers = new TypedRegistry(DatasetController, "datasets", true);
    this.elements = new TypedRegistry(Element, "elements");
    this.plugins = new TypedRegistry(Object, "plugins");
    this.scales = new TypedRegistry(Scale, "scales");
    this._typedRegistries = [
      this.controllers,
      this.scales,
      this.elements
    ];
  }
  add(...args) {
    this._each("register", args);
  }
  remove(...args) {
    this._each("unregister", args);
  }
  addControllers(...args) {
    this._each("register", args, this.controllers);
  }
  addElements(...args) {
    this._each("register", args, this.elements);
  }
  addPlugins(...args) {
    this._each("register", args, this.plugins);
  }
  addScales(...args) {
    this._each("register", args, this.scales);
  }
  getController(id) {
    return this._get(id, this.controllers, "controller");
  }
  getElement(id) {
    return this._get(id, this.elements, "element");
  }
  getPlugin(id) {
    return this._get(id, this.plugins, "plugin");
  }
  getScale(id) {
    return this._get(id, this.scales, "scale");
  }
  removeControllers(...args) {
    this._each("unregister", args, this.controllers);
  }
  removeElements(...args) {
    this._each("unregister", args, this.elements);
  }
  removePlugins(...args) {
    this._each("unregister", args, this.plugins);
  }
  removeScales(...args) {
    this._each("unregister", args, this.scales);
  }
  _each(method, args, typedRegistry) {
    [
      ...args
    ].forEach((arg) => {
      const reg = typedRegistry || this._getRegistryForType(arg);
      if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
        this._exec(method, reg, arg);
      } else {
        each(arg, (item) => {
          const itemReg = typedRegistry || this._getRegistryForType(item);
          this._exec(method, itemReg, item);
        });
      }
    });
  }
  _exec(method, registry2, component) {
    const camelMethod = _capitalize(method);
    callback(component["before" + camelMethod], [], component);
    registry2[method](component);
    callback(component["after" + camelMethod], [], component);
  }
  _getRegistryForType(type) {
    for (let i = 0; i < this._typedRegistries.length; i++) {
      const reg = this._typedRegistries[i];
      if (reg.isForType(type)) {
        return reg;
      }
    }
    return this.plugins;
  }
  _get(id, typedRegistry, type) {
    const item = typedRegistry.get(id);
    if (item === void 0) {
      throw new Error('"' + id + '" is not a registered ' + type + ".");
    }
    return item;
  }
};
var registry = /* @__PURE__ */ new Registry();
var PluginService = class {
  constructor() {
    this._init = void 0;
  }
  notify(chart, hook, args, filter) {
    if (hook === "beforeInit") {
      this._init = this._createDescriptors(chart, true);
      this._notify(this._init, chart, "install");
    }
    if (this._init === void 0) {
      return;
    }
    const descriptors2 = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
    const result = this._notify(descriptors2, chart, hook, args);
    if (hook === "afterDestroy") {
      this._notify(descriptors2, chart, "stop");
      this._notify(this._init, chart, "uninstall");
      this._init = void 0;
    }
    return result;
  }
  _notify(descriptors2, chart, hook, args) {
    args = args || {};
    for (const descriptor of descriptors2) {
      const plugin = descriptor.plugin;
      const method = plugin[hook];
      const params = [
        chart,
        args,
        descriptor.options
      ];
      if (callback(method, params, plugin) === false && args.cancelable) {
        return false;
      }
    }
    return true;
  }
  invalidate() {
    if (!isNullOrUndef(this._cache)) {
      this._oldCache = this._cache;
      this._cache = void 0;
    }
  }
  _descriptors(chart) {
    if (this._cache) {
      return this._cache;
    }
    const descriptors2 = this._cache = this._createDescriptors(chart);
    this._notifyStateChanges(chart);
    return descriptors2;
  }
  _createDescriptors(chart, all) {
    const config = chart && chart.config;
    const options = valueOrDefault(config.options && config.options.plugins, {});
    const plugins = allPlugins(config);
    return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
  }
  _notifyStateChanges(chart) {
    const previousDescriptors = this._oldCache || [];
    const descriptors2 = this._cache;
    const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
    this._notify(diff(previousDescriptors, descriptors2), chart, "stop");
    this._notify(diff(descriptors2, previousDescriptors), chart, "start");
  }
};
function allPlugins(config) {
  const localIds = {};
  const plugins = [];
  const keys = Object.keys(registry.plugins.items);
  for (let i = 0; i < keys.length; i++) {
    plugins.push(registry.getPlugin(keys[i]));
  }
  const local = config.plugins || [];
  for (let i = 0; i < local.length; i++) {
    const plugin = local[i];
    if (plugins.indexOf(plugin) === -1) {
      plugins.push(plugin);
      localIds[plugin.id] = true;
    }
  }
  return {
    plugins,
    localIds
  };
}
function getOpts(options, all) {
  if (!all && options === false) {
    return null;
  }
  if (options === true) {
    return {};
  }
  return options;
}
function createDescriptors(chart, { plugins, localIds }, options, all) {
  const result = [];
  const context = chart.getContext();
  for (const plugin of plugins) {
    const id = plugin.id;
    const opts = getOpts(options[id], all);
    if (opts === null) {
      continue;
    }
    result.push({
      plugin,
      options: pluginOpts(chart.config, {
        plugin,
        local: localIds[id]
      }, opts, context)
    });
  }
  return result;
}
function pluginOpts(config, { plugin, local }, opts, context) {
  const keys = config.pluginScopeKeys(plugin);
  const scopes = config.getOptionScopes(opts, keys);
  if (local && plugin.defaults) {
    scopes.push(plugin.defaults);
  }
  return config.createResolver(scopes, context, [
    ""
  ], {
    scriptable: false,
    indexable: false,
    allKeys: true
  });
}
function getIndexAxis(type, options) {
  const datasetDefaults = defaults.datasets[type] || {};
  const datasetOptions = (options.datasets || {})[type] || {};
  return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || "x";
}
function getAxisFromDefaultScaleID(id, indexAxis) {
  let axis = id;
  if (id === "_index_") {
    axis = indexAxis;
  } else if (id === "_value_") {
    axis = indexAxis === "x" ? "y" : "x";
  }
  return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
  return axis === indexAxis ? "_index_" : "_value_";
}
function idMatchesAxis(id) {
  if (id === "x" || id === "y" || id === "r") {
    return id;
  }
}
function axisFromPosition(position) {
  if (position === "top" || position === "bottom") {
    return "x";
  }
  if (position === "left" || position === "right") {
    return "y";
  }
}
function determineAxis(id, ...scaleOptions) {
  if (idMatchesAxis(id)) {
    return id;
  }
  for (const opts of scaleOptions) {
    const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
    if (axis) {
      return axis;
    }
  }
  throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
}
function getAxisFromDataset(id, axis, dataset) {
  if (dataset[axis + "AxisID"] === id) {
    return {
      axis
    };
  }
}
function retrieveAxisFromDatasets(id, config) {
  if (config.data && config.data.datasets) {
    const boundDs = config.data.datasets.filter((d) => d.xAxisID === id || d.yAxisID === id);
    if (boundDs.length) {
      return getAxisFromDataset(id, "x", boundDs[0]) || getAxisFromDataset(id, "y", boundDs[0]);
    }
  }
  return {};
}
function mergeScaleConfig(config, options) {
  const chartDefaults = overrides[config.type] || {
    scales: {}
  };
  const configScales = options.scales || {};
  const chartIndexAxis = getIndexAxis(config.type, options);
  const scales = /* @__PURE__ */ Object.create(null);
  Object.keys(configScales).forEach((id) => {
    const scaleConf = configScales[id];
    if (!isObject(scaleConf)) {
      return console.error(`Invalid scale configuration for scale: ${id}`);
    }
    if (scaleConf._proxy) {
      return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
    }
    const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
    const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
    const defaultScaleOptions = chartDefaults.scales || {};
    scales[id] = mergeIf(/* @__PURE__ */ Object.create(null), [
      {
        axis
      },
      scaleConf,
      defaultScaleOptions[axis],
      defaultScaleOptions[defaultId]
    ]);
  });
  config.data.datasets.forEach((dataset) => {
    const type = dataset.type || config.type;
    const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
    const datasetDefaults = overrides[type] || {};
    const defaultScaleOptions = datasetDefaults.scales || {};
    Object.keys(defaultScaleOptions).forEach((defaultID) => {
      const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
      const id = dataset[axis + "AxisID"] || axis;
      scales[id] = scales[id] || /* @__PURE__ */ Object.create(null);
      mergeIf(scales[id], [
        {
          axis
        },
        configScales[id],
        defaultScaleOptions[defaultID]
      ]);
    });
  });
  Object.keys(scales).forEach((key) => {
    const scale = scales[key];
    mergeIf(scale, [
      defaults.scales[scale.type],
      defaults.scale
    ]);
  });
  return scales;
}
function initOptions(config) {
  const options = config.options || (config.options = {});
  options.plugins = valueOrDefault(options.plugins, {});
  options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
  data = data || {};
  data.datasets = data.datasets || [];
  data.labels = data.labels || [];
  return data;
}
function initConfig(config) {
  config = config || {};
  config.data = initData(config.data);
  initOptions(config);
  return config;
}
var keyCache = /* @__PURE__ */ new Map();
var keysCached = /* @__PURE__ */ new Set();
function cachedKeys(cacheKey, generate) {
  let keys = keyCache.get(cacheKey);
  if (!keys) {
    keys = generate();
    keyCache.set(cacheKey, keys);
    keysCached.add(keys);
  }
  return keys;
}
var addIfFound = (set2, obj, key) => {
  const opts = resolveObjectKey(obj, key);
  if (opts !== void 0) {
    set2.add(opts);
  }
};
var Config = class {
  constructor(config) {
    this._config = initConfig(config);
    this._scopeCache = /* @__PURE__ */ new Map();
    this._resolverCache = /* @__PURE__ */ new Map();
  }
  get platform() {
    return this._config.platform;
  }
  get type() {
    return this._config.type;
  }
  set type(type) {
    this._config.type = type;
  }
  get data() {
    return this._config.data;
  }
  set data(data) {
    this._config.data = initData(data);
  }
  get options() {
    return this._config.options;
  }
  set options(options) {
    this._config.options = options;
  }
  get plugins() {
    return this._config.plugins;
  }
  update() {
    const config = this._config;
    this.clearCache();
    initOptions(config);
  }
  clearCache() {
    this._scopeCache.clear();
    this._resolverCache.clear();
  }
  datasetScopeKeys(datasetType) {
    return cachedKeys(datasetType, () => [
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetAnimationScopeKeys(datasetType, transition) {
    return cachedKeys(`${datasetType}.transition.${transition}`, () => [
      [
        `datasets.${datasetType}.transitions.${transition}`,
        `transitions.${transition}`
      ],
      [
        `datasets.${datasetType}`,
        ""
      ]
    ]);
  }
  datasetElementScopeKeys(datasetType, elementType) {
    return cachedKeys(`${datasetType}-${elementType}`, () => [
      [
        `datasets.${datasetType}.elements.${elementType}`,
        `datasets.${datasetType}`,
        `elements.${elementType}`,
        ""
      ]
    ]);
  }
  pluginScopeKeys(plugin) {
    const id = plugin.id;
    const type = this.type;
    return cachedKeys(`${type}-plugin-${id}`, () => [
      [
        `plugins.${id}`,
        ...plugin.additionalOptionScopes || []
      ]
    ]);
  }
  _cachedScopes(mainScope, resetCache) {
    const _scopeCache = this._scopeCache;
    let cache2 = _scopeCache.get(mainScope);
    if (!cache2 || resetCache) {
      cache2 = /* @__PURE__ */ new Map();
      _scopeCache.set(mainScope, cache2);
    }
    return cache2;
  }
  getOptionScopes(mainScope, keyLists, resetCache) {
    const { options, type } = this;
    const cache2 = this._cachedScopes(mainScope, resetCache);
    const cached = cache2.get(keyLists);
    if (cached) {
      return cached;
    }
    const scopes = /* @__PURE__ */ new Set();
    keyLists.forEach((keys) => {
      if (mainScope) {
        scopes.add(mainScope);
        keys.forEach((key) => addIfFound(scopes, mainScope, key));
      }
      keys.forEach((key) => addIfFound(scopes, options, key));
      keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
      keys.forEach((key) => addIfFound(scopes, defaults, key));
      keys.forEach((key) => addIfFound(scopes, descriptors, key));
    });
    const array = Array.from(scopes);
    if (array.length === 0) {
      array.push(/* @__PURE__ */ Object.create(null));
    }
    if (keysCached.has(keyLists)) {
      cache2.set(keyLists, array);
    }
    return array;
  }
  chartOptionScopes() {
    const { options, type } = this;
    return [
      options,
      overrides[type] || {},
      defaults.datasets[type] || {},
      {
        type
      },
      defaults,
      descriptors
    ];
  }
  resolveNamedOptions(scopes, names2, context, prefixes = [
    ""
  ]) {
    const result = {
      $shared: true
    };
    const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
    let options = resolver;
    if (needContext(resolver, names2)) {
      result.$shared = false;
      context = isFunction(context) ? context() : context;
      const subResolver = this.createResolver(scopes, context, subPrefixes);
      options = _attachContext(resolver, context, subResolver);
    }
    for (const prop of names2) {
      result[prop] = options[prop];
    }
    return result;
  }
  createResolver(scopes, context, prefixes = [
    ""
  ], descriptorDefaults) {
    const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
    return isObject(context) ? _attachContext(resolver, context, void 0, descriptorDefaults) : resolver;
  }
};
function getResolver(resolverCache, scopes, prefixes) {
  let cache2 = resolverCache.get(scopes);
  if (!cache2) {
    cache2 = /* @__PURE__ */ new Map();
    resolverCache.set(scopes, cache2);
  }
  const cacheKey = prefixes.join();
  let cached = cache2.get(cacheKey);
  if (!cached) {
    const resolver = _createResolver(scopes, prefixes);
    cached = {
      resolver,
      subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes("hover"))
    };
    cache2.set(cacheKey, cached);
  }
  return cached;
}
var hasFunction = (value2) => isObject(value2) && Object.getOwnPropertyNames(value2).some((key) => isFunction(value2[key]));
function needContext(proxy, names2) {
  const { isScriptable, isIndexable } = _descriptors(proxy);
  for (const prop of names2) {
    const scriptable = isScriptable(prop);
    const indexable = isIndexable(prop);
    const value2 = (indexable || scriptable) && proxy[prop];
    if (scriptable && (isFunction(value2) || hasFunction(value2)) || indexable && isArray(value2)) {
      return true;
    }
  }
  return false;
}
var version2 = "4.6.1";
var KNOWN_POSITIONS = [
  "top",
  "bottom",
  "left",
  "right",
  "chartArea"
];
function positionIsHorizontal(position, axis) {
  return position === "top" || position === "bottom" || KNOWN_POSITIONS.indexOf(position) === -1 && axis === "x";
}
function compare2Level(l1, l2) {
  return function(a, b) {
    return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
  };
}
function onAnimationsComplete(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  chart.notifyPlugins("afterRender");
  callback(animationOptions && animationOptions.onComplete, [
    context
  ], chart);
}
function onAnimationProgress(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  callback(animationOptions && animationOptions.onProgress, [
    context
  ], chart);
}
function getCanvas(item) {
  if (_isDomSupported() && typeof item === "string") {
    item = document.getElementById(item);
  } else if (item && item.length) {
    item = item[0];
  }
  if (item && item.canvas) {
    item = item.canvas;
  }
  return item;
}
var instances = {};
var getChart = (key) => {
  const canvas = getCanvas(key);
  return Object.values(instances).filter((c) => c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const intKey = +key;
    if (intKey >= start) {
      const value2 = obj[key];
      delete obj[key];
      if (move > 0 || intKey > start) {
        obj[intKey + move] = value2;
      }
    }
  }
}
function determineLastEvent(e, lastEvent, inChartArea, isClick) {
  if (!inChartArea || e.type === "mouseout") {
    return null;
  }
  if (isClick) {
    return lastEvent;
  }
  return e;
}
var Chart = class {
  static defaults = defaults;
  static instances = instances;
  static overrides = overrides;
  static registry = registry;
  static version = version2;
  static getChart = getChart;
  static register(...items) {
    registry.add(...items);
    invalidatePlugins();
  }
  static unregister(...items) {
    registry.remove(...items);
    invalidatePlugins();
  }
  constructor(item, userConfig) {
    const config = this.config = new Config(userConfig);
    const initialCanvas = getCanvas(item);
    const existingChart = getChart(initialCanvas);
    if (existingChart) {
      throw new Error("Canvas is already in use. Chart with ID '" + existingChart.id + "' must be destroyed before the canvas with ID '" + existingChart.canvas.id + "' can be reused.");
    }
    const options = config.createResolver(config.chartOptionScopes(), this.getContext());
    this.platform = new (config.platform || _detectPlatform(initialCanvas))();
    this.platform.updateConfig(config);
    const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
    const canvas = context && context.canvas;
    const height = canvas && canvas.height;
    const width = canvas && canvas.width;
    this.id = uid();
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this._options = options;
    this._aspectRatio = this.aspectRatio;
    this._layers = [];
    this._metasets = [];
    this._stacks = void 0;
    this.boxes = [];
    this.currentDevicePixelRatio = void 0;
    this.chartArea = void 0;
    this._active = [];
    this._lastEvent = void 0;
    this._listeners = {};
    this._responsiveListeners = void 0;
    this._sortedMetasets = [];
    this.scales = {};
    this._plugins = new PluginService();
    this.$proxies = {};
    this._hiddenIndices = {};
    this.attached = false;
    this._animationsDisabled = void 0;
    this.$context = void 0;
    this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
    this._dataChanges = [];
    instances[this.id] = this;
    if (!context || !canvas) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }
    animator.listen(this, "complete", onAnimationsComplete);
    animator.listen(this, "progress", onAnimationProgress);
    this._initialize();
    if (this.attached) {
      this.update();
    }
  }
  get aspectRatio() {
    const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
    if (!isNullOrUndef(aspectRatio)) {
      return aspectRatio;
    }
    if (maintainAspectRatio && _aspectRatio) {
      return _aspectRatio;
    }
    return height ? width / height : null;
  }
  get data() {
    return this.config.data;
  }
  set data(data) {
    this.config.data = data;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    this.config.options = options;
  }
  get registry() {
    return registry;
  }
  _initialize() {
    this.notifyPlugins("beforeInit");
    if (this.options.responsive) {
      this.resize();
    } else {
      retinaScale(this, this.options.devicePixelRatio);
    }
    this.bindEvents();
    this.notifyPlugins("afterInit");
    return this;
  }
  clear() {
    clearCanvas(this.canvas, this.ctx);
    return this;
  }
  stop() {
    animator.stop(this);
    return this;
  }
  resize(width, height) {
    if (!animator.running(this)) {
      this._resize(width, height);
    } else {
      this._resizeBeforeDraw = {
        width,
        height
      };
    }
  }
  _resize(width, height) {
    const options = this.options;
    const canvas = this.canvas;
    const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
    const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
    const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
    const mode = this.width ? "resize" : "attach";
    this.width = newSize.width;
    this.height = newSize.height;
    this._aspectRatio = this.aspectRatio;
    if (!retinaScale(this, newRatio, true)) {
      return;
    }
    this.notifyPlugins("resize", {
      size: newSize
    });
    callback(options.onResize, [
      this,
      newSize
    ], this);
    if (this.attached) {
      if (this._doResize(mode)) {
        this.render();
      }
    }
  }
  ensureScalesHaveIDs() {
    const options = this.options;
    const scalesOptions = options.scales || {};
    each(scalesOptions, (axisOptions, axisID) => {
      axisOptions.id = axisID;
    });
  }
  buildOrUpdateScales() {
    const options = this.options;
    const scaleOpts = options.scales;
    const scales = this.scales;
    const updated = Object.keys(scales).reduce((obj, id) => {
      obj[id] = false;
      return obj;
    }, {});
    let items = [];
    if (scaleOpts) {
      items = items.concat(Object.keys(scaleOpts).map((id) => {
        const scaleOptions = scaleOpts[id];
        const axis = determineAxis(id, scaleOptions);
        const isRadial = axis === "r";
        const isHorizontal = axis === "x";
        return {
          options: scaleOptions,
          dposition: isRadial ? "chartArea" : isHorizontal ? "bottom" : "left",
          dtype: isRadial ? "radialLinear" : isHorizontal ? "category" : "linear"
        };
      }));
    }
    each(items, (item) => {
      const scaleOptions = item.options;
      const id = scaleOptions.id;
      const axis = determineAxis(id, scaleOptions);
      const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
      if (scaleOptions.position === void 0 || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
        scaleOptions.position = item.dposition;
      }
      updated[id] = true;
      let scale = null;
      if (id in scales && scales[id].type === scaleType) {
        scale = scales[id];
      } else {
        const scaleClass = registry.getScale(scaleType);
        scale = new scaleClass({
          id,
          type: scaleType,
          ctx: this.ctx,
          chart: this
        });
        scales[scale.id] = scale;
      }
      scale.init(scaleOptions, options);
    });
    each(updated, (hasUpdated, id) => {
      if (!hasUpdated) {
        delete scales[id];
      }
    });
    each(scales, (scale) => {
      layouts.configure(this, scale, scale.options);
      layouts.addBox(this, scale);
    });
  }
  _updateMetasets() {
    const metasets = this._metasets;
    const numData = this.data.datasets.length;
    const numMeta = metasets.length;
    metasets.sort((a, b) => a.index - b.index);
    if (numMeta > numData) {
      for (let i = numData; i < numMeta; ++i) {
        this._destroyDatasetMeta(i);
      }
      metasets.splice(numData, numMeta - numData);
    }
    this._sortedMetasets = metasets.slice(0).sort(compare2Level("order", "index"));
  }
  _removeUnreferencedMetasets() {
    const { _metasets: metasets, data: { datasets } } = this;
    if (metasets.length > datasets.length) {
      delete this._stacks;
    }
    metasets.forEach((meta, index) => {
      if (datasets.filter((x) => x === meta._dataset).length === 0) {
        this._destroyDatasetMeta(index);
      }
    });
  }
  buildOrUpdateControllers() {
    const newControllers = [];
    const datasets = this.data.datasets;
    let i, ilen;
    this._removeUnreferencedMetasets();
    for (i = 0, ilen = datasets.length; i < ilen; i++) {
      const dataset = datasets[i];
      let meta = this.getDatasetMeta(i);
      const type = dataset.type || this.config.type;
      if (meta.type && meta.type !== type) {
        this._destroyDatasetMeta(i);
        meta = this.getDatasetMeta(i);
      }
      meta.type = type;
      meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
      meta.order = dataset.order || 0;
      meta.index = i;
      meta.label = "" + dataset.label;
      meta.visible = this.isDatasetVisible(i);
      if (meta.controller) {
        meta.controller.updateIndex(i);
        meta.controller.linkScales();
      } else {
        const ControllerClass = registry.getController(type);
        const { datasetElementType, dataElementType } = defaults.datasets[type];
        Object.assign(ControllerClass, {
          dataElementType: registry.getElement(dataElementType),
          datasetElementType: datasetElementType && registry.getElement(datasetElementType)
        });
        meta.controller = new ControllerClass(this, i);
        newControllers.push(meta.controller);
      }
    }
    this._updateMetasets();
    return newControllers;
  }
  _resetElements() {
    each(this.data.datasets, (dataset, datasetIndex) => {
      this.getDatasetMeta(datasetIndex).controller.reset();
    }, this);
  }
  reset() {
    this._resetElements();
    this.notifyPlugins("reset");
  }
  update(mode) {
    const config = this.config;
    config.update();
    const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
    const animsDisabled = this._animationsDisabled = !options.animation;
    this._updateScales();
    this._checkEventBindings();
    this._updateHiddenIndices();
    this._plugins.invalidate();
    if (this.notifyPlugins("beforeUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    const newControllers = this.buildOrUpdateControllers();
    this.notifyPlugins("beforeElementsUpdate");
    let minPadding = 0;
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
      const { controller } = this.getDatasetMeta(i);
      const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
      controller.buildOrUpdateElements(reset);
      minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
    }
    minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
    this._updateLayout(minPadding);
    if (!animsDisabled) {
      each(newControllers, (controller) => {
        controller.reset();
      });
    }
    this._updateDatasets(mode);
    this.notifyPlugins("afterUpdate", {
      mode
    });
    this._layers.sort(compare2Level("z", "_idx"));
    const { _active, _lastEvent } = this;
    if (_lastEvent) {
      this._eventHandler(_lastEvent, true);
    } else if (_active.length) {
      this._updateHoverStyles(_active, _active, true);
    }
    this.render();
  }
  _updateScales() {
    each(this.scales, (scale) => {
      layouts.removeBox(this, scale);
    });
    this.ensureScalesHaveIDs();
    this.buildOrUpdateScales();
  }
  _checkEventBindings() {
    const options = this.options;
    const existingEvents = new Set(Object.keys(this._listeners));
    const newEvents = new Set(options.events);
    if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
      this.unbindEvents();
      this.bindEvents();
    }
  }
  _updateHiddenIndices() {
    const { _hiddenIndices } = this;
    const changes = this._getUniformDataChanges() || [];
    for (const { method, start, count } of changes) {
      const move = method === "_removeElements" ? -count : count;
      moveNumericKeys(_hiddenIndices, start, move);
    }
  }
  _getUniformDataChanges() {
    const _dataChanges = this._dataChanges;
    if (!_dataChanges || !_dataChanges.length) {
      return;
    }
    this._dataChanges = [];
    const datasetCount = this.data.datasets.length;
    const makeSet = (idx) => new Set(_dataChanges.filter((c) => c[0] === idx).map((c, i) => i + "," + c.splice(1).join(",")));
    const changeSet = makeSet(0);
    for (let i = 1; i < datasetCount; i++) {
      if (!setsEqual(changeSet, makeSet(i))) {
        return;
      }
    }
    return Array.from(changeSet).map((c) => c.split(",")).map((a) => ({
      method: a[1],
      start: +a[2],
      count: +a[3]
    }));
  }
  _updateLayout(minPadding) {
    if (this.notifyPlugins("beforeLayout", {
      cancelable: true
    }) === false) {
      return;
    }
    layouts.update(this, this.width, this.height, minPadding);
    const area = this.chartArea;
    const noArea = area.width <= 0 || area.height <= 0;
    this._layers = [];
    each(this.boxes, (box) => {
      if (noArea && box.position === "chartArea") {
        return;
      }
      if (box.configure) {
        box.configure();
      }
      this._layers.push(...box._layers());
    }, this);
    this._layers.forEach((item, index) => {
      item._idx = index;
    });
    this.notifyPlugins("afterLayout");
  }
  _updateDatasets(mode) {
    if (this.notifyPlugins("beforeDatasetsUpdate", {
      mode,
      cancelable: true
    }) === false) {
      return;
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this.getDatasetMeta(i).controller.configure();
    }
    for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._updateDataset(i, isFunction(mode) ? mode({
        datasetIndex: i
      }) : mode);
    }
    this.notifyPlugins("afterDatasetsUpdate", {
      mode
    });
  }
  _updateDataset(index, mode) {
    const meta = this.getDatasetMeta(index);
    const args = {
      meta,
      index,
      mode,
      cancelable: true
    };
    if (this.notifyPlugins("beforeDatasetUpdate", args) === false) {
      return;
    }
    meta.controller._update(mode);
    args.cancelable = false;
    this.notifyPlugins("afterDatasetUpdate", args);
  }
  render() {
    if (this.notifyPlugins("beforeRender", {
      cancelable: true
    }) === false) {
      return;
    }
    if (animator.has(this)) {
      if (this.attached && !animator.running(this)) {
        animator.start(this);
      }
    } else {
      this.draw();
      onAnimationsComplete({
        chart: this
      });
    }
  }
  draw() {
    let i;
    if (this._resizeBeforeDraw) {
      const { width, height } = this._resizeBeforeDraw;
      this._resizeBeforeDraw = null;
      this._resize(width, height);
    }
    this.clear();
    if (this.width <= 0 || this.height <= 0) {
      return;
    }
    if (this.notifyPlugins("beforeDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const layers = this._layers;
    for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
      layers[i].draw(this.chartArea);
    }
    this._drawDatasets();
    for (; i < layers.length; ++i) {
      layers[i].draw(this.chartArea);
    }
    this.notifyPlugins("afterDraw");
  }
  _getSortedDatasetMetas(filterVisible) {
    const metasets = this._sortedMetasets;
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metasets.length; i < ilen; ++i) {
      const meta = metasets[i];
      if (!filterVisible || meta.visible) {
        result.push(meta);
      }
    }
    return result;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(true);
  }
  _drawDatasets() {
    if (this.notifyPlugins("beforeDatasetsDraw", {
      cancelable: true
    }) === false) {
      return;
    }
    const metasets = this.getSortedVisibleDatasetMetas();
    for (let i = metasets.length - 1; i >= 0; --i) {
      this._drawDataset(metasets[i]);
    }
    this.notifyPlugins("afterDatasetsDraw");
  }
  _drawDataset(meta) {
    const ctx = this.ctx;
    const args = {
      meta,
      index: meta.index,
      cancelable: true
    };
    const clip = getDatasetClipArea(this, meta);
    if (this.notifyPlugins("beforeDatasetDraw", args) === false) {
      return;
    }
    if (clip) {
      clipArea(ctx, clip);
    }
    meta.controller.draw();
    if (clip) {
      unclipArea(ctx);
    }
    args.cancelable = false;
    this.notifyPlugins("afterDatasetDraw", args);
  }
  isPointInArea(point) {
    return _isPointInArea(point, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(e, mode, options, useFinalPosition) {
    const method = Interaction.modes[mode];
    if (typeof method === "function") {
      return method(this, e, options, useFinalPosition);
    }
    return [];
  }
  getDatasetMeta(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    const metasets = this._metasets;
    let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
    if (!meta) {
      meta = {
        type: null,
        data: [],
        dataset: null,
        controller: null,
        hidden: null,
        xAxisID: null,
        yAxisID: null,
        order: dataset && dataset.order || 0,
        index: datasetIndex,
        _dataset: dataset,
        _parsed: [],
        _sorted: false
      };
      metasets.push(meta);
    }
    return meta;
  }
  getContext() {
    return this.$context || (this.$context = createContext(null, {
      chart: this,
      type: "chart"
    }));
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];
    if (!dataset) {
      return false;
    }
    const meta = this.getDatasetMeta(datasetIndex);
    return typeof meta.hidden === "boolean" ? !meta.hidden : !dataset.hidden;
  }
  setDatasetVisibility(datasetIndex, visible) {
    const meta = this.getDatasetMeta(datasetIndex);
    meta.hidden = !visible;
  }
  toggleDataVisibility(index) {
    this._hiddenIndices[index] = !this._hiddenIndices[index];
  }
  getDataVisibility(index) {
    return !this._hiddenIndices[index];
  }
  _updateVisibility(datasetIndex, dataIndex, visible) {
    const mode = visible ? "show" : "hide";
    const meta = this.getDatasetMeta(datasetIndex);
    const anims = meta.controller._resolveAnimations(void 0, mode);
    if (defined(dataIndex)) {
      meta.data[dataIndex].hidden = !visible;
      this.update();
    } else {
      this.setDatasetVisibility(datasetIndex, visible);
      anims.update(meta, {
        visible
      });
      this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : void 0);
    }
  }
  hide(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, false);
  }
  show(datasetIndex, dataIndex) {
    this._updateVisibility(datasetIndex, dataIndex, true);
  }
  _destroyDatasetMeta(datasetIndex) {
    const meta = this._metasets[datasetIndex];
    if (meta && meta.controller) {
      meta.controller._destroy();
    }
    delete this._metasets[datasetIndex];
  }
  _stop() {
    let i, ilen;
    this.stop();
    animator.remove(this);
    for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
      this._destroyDatasetMeta(i);
    }
  }
  destroy() {
    this.notifyPlugins("beforeDestroy");
    const { canvas, ctx } = this;
    this._stop();
    this.config.clearCache();
    if (canvas) {
      this.unbindEvents();
      clearCanvas(canvas, ctx);
      this.platform.releaseContext(ctx);
      this.canvas = null;
      this.ctx = null;
    }
    delete instances[this.id];
    this.notifyPlugins("afterDestroy");
  }
  toBase64Image(...args) {
    return this.canvas.toDataURL(...args);
  }
  bindEvents() {
    this.bindUserEvents();
    if (this.options.responsive) {
      this.bindResponsiveEvents();
    } else {
      this.attached = true;
    }
  }
  bindUserEvents() {
    const listeners2 = this._listeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners2[type] = listener2;
    };
    const listener = (e, x, y) => {
      e.offsetX = x;
      e.offsetY = y;
      this._eventHandler(e);
    };
    each(this.options.events, (type) => _add(type, listener));
  }
  bindResponsiveEvents() {
    if (!this._responsiveListeners) {
      this._responsiveListeners = {};
    }
    const listeners2 = this._responsiveListeners;
    const platform = this.platform;
    const _add = (type, listener2) => {
      platform.addEventListener(this, type, listener2);
      listeners2[type] = listener2;
    };
    const _remove = (type, listener2) => {
      if (listeners2[type]) {
        platform.removeEventListener(this, type, listener2);
        delete listeners2[type];
      }
    };
    const listener = (width, height) => {
      if (this.canvas) {
        this.resize(width, height);
      }
    };
    let detached;
    const attached = () => {
      _remove("attach", attached);
      this.attached = true;
      this.resize();
      _add("resize", listener);
      _add("detach", detached);
    };
    detached = () => {
      this.attached = false;
      _remove("resize", listener);
      this._stop();
      this._resize(0, 0);
      _add("attach", attached);
    };
    if (platform.isAttached(this.canvas)) {
      attached();
    } else {
      detached();
    }
  }
  unbindEvents() {
    each(this._listeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._listeners = {};
    each(this._responsiveListeners, (listener, type) => {
      this.platform.removeEventListener(this, type, listener);
    });
    this._responsiveListeners = void 0;
  }
  updateHoverStyle(items, mode, enabled) {
    const prefix = enabled ? "set" : "remove";
    let meta, item, i, ilen;
    if (mode === "dataset") {
      meta = this.getDatasetMeta(items[0].datasetIndex);
      meta.controller["_" + prefix + "DatasetHoverStyle"]();
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      item = items[i];
      const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
      if (controller) {
        controller[prefix + "HoverStyle"](item.element, item.datasetIndex, item.index);
      }
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements) {
    const lastActive = this._active || [];
    const active = activeElements.map(({ datasetIndex, index }) => {
      const meta = this.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("No dataset found at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index],
        index
      };
    });
    const changed = !_elementsEqual(active, lastActive);
    if (changed) {
      this._active = active;
      this._lastEvent = null;
      this._updateHoverStyles(active, lastActive);
    }
  }
  notifyPlugins(hook, args, filter) {
    return this._plugins.notify(this, hook, args, filter);
  }
  isPluginEnabled(pluginId) {
    return this._plugins._cache.filter((p) => p.plugin.id === pluginId).length === 1;
  }
  _updateHoverStyles(active, lastActive, replay) {
    const hoverOptions = this.options.hover;
    const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
    const deactivated = diff(lastActive, active);
    const activated = replay ? active : diff(active, lastActive);
    if (deactivated.length) {
      this.updateHoverStyle(deactivated, hoverOptions.mode, false);
    }
    if (activated.length && hoverOptions.mode) {
      this.updateHoverStyle(activated, hoverOptions.mode, true);
    }
  }
  _eventHandler(e, replay) {
    const args = {
      event: e,
      replay,
      cancelable: true,
      inChartArea: this.isPointInArea(e)
    };
    const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
    if (this.notifyPlugins("beforeEvent", args, eventFilter) === false) {
      return;
    }
    const changed = this._handleEvent(e, replay, args.inChartArea);
    args.cancelable = false;
    this.notifyPlugins("afterEvent", args, eventFilter);
    if (changed || args.changed) {
      this.render();
    }
    return this;
  }
  _handleEvent(e, replay, inChartArea) {
    const { _active: lastActive = [], options } = this;
    const useFinalPosition = replay;
    const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
    const isClick = _isClickEvent(e);
    const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
    if (inChartArea) {
      this._lastEvent = null;
      callback(options.onHover, [
        e,
        active,
        this
      ], this);
      if (isClick) {
        callback(options.onClick, [
          e,
          active,
          this
        ], this);
      }
    }
    const changed = !_elementsEqual(active, lastActive);
    if (changed || replay) {
      this._active = active;
      this._updateHoverStyles(active, lastActive, replay);
    }
    this._lastEvent = lastEvent;
    return changed;
  }
  _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
    if (e.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive;
    }
    const hoverOptions = this.options.hover;
    return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
  }
};
function invalidatePlugins() {
  return each(Chart.instances, (chart) => chart._plugins.invalidate());
}
function setStyle(ctx, options, style = options) {
  ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
  ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
  ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
  ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
  ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
  ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
  ctx.lineTo(target.x, target.y);
}
function getLineMethod(options) {
  if (options.stepped) {
    return _steppedLineTo;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierCurveTo;
  }
  return lineTo;
}
function pathVars(points, segment, params = {}) {
  const count = points.length;
  const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
  const { start: segmentStart, end: segmentEnd } = segment;
  const start = Math.max(paramsStart, segmentStart);
  const end = Math.min(paramsEnd, segmentEnd);
  const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
  return {
    count,
    start,
    loop: segment.loop,
    ilen: end < start && !outside ? count + end - start : end - start
  };
}
function pathSegment(ctx, line, segment, params) {
  const { points, options } = line;
  const { count, start, loop, ilen } = pathVars(points, segment, params);
  const lineMethod = getLineMethod(options);
  let { move = true, reverse } = params || {};
  let i, point, prev;
  for (i = 0; i <= ilen; ++i) {
    point = points[(start + (reverse ? ilen - i : i)) % count];
    if (point.skip) {
      continue;
    } else if (move) {
      ctx.moveTo(point.x, point.y);
      move = false;
    } else {
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    prev = point;
  }
  if (loop) {
    point = points[(start + (reverse ? ilen : 0)) % count];
    lineMethod(ctx, prev, point, reverse, options.stepped);
  }
  return !!loop;
}
function fastPathSegment(ctx, line, segment, params) {
  const points = line.points;
  const { count, start, ilen } = pathVars(points, segment, params);
  const { move = true, reverse } = params || {};
  let avgX = 0;
  let countX = 0;
  let i, point, prevX, minY, maxY, lastY;
  const pointIndex = (index) => (start + (reverse ? ilen - index : index)) % count;
  const drawX = () => {
    if (minY !== maxY) {
      ctx.lineTo(avgX, maxY);
      ctx.lineTo(avgX, minY);
      ctx.lineTo(avgX, lastY);
    }
  };
  if (move) {
    point = points[pointIndex(0)];
    ctx.moveTo(point.x, point.y);
  }
  for (i = 0; i <= ilen; ++i) {
    point = points[pointIndex(i)];
    if (point.skip) {
      continue;
    }
    const x = point.x;
    const y = point.y;
    const truncX = x | 0;
    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }
      avgX = (countX * avgX + x) / ++countX;
    } else {
      drawX();
      ctx.lineTo(x, y);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
    }
    lastY = y;
  }
  drawX();
}
function _getSegmentMethod(line) {
  const opts = line.options;
  const borderDash = opts.borderDash && opts.borderDash.length;
  const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== "monotone" && !opts.stepped && !borderDash;
  return useFastPath ? fastPathSegment : pathSegment;
}
function _getInterpolationMethod(options) {
  if (options.stepped) {
    return _steppedInterpolation;
  }
  if (options.tension || options.cubicInterpolationMode === "monotone") {
    return _bezierInterpolation;
  }
  return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
  let path = line._path;
  if (!path) {
    path = line._path = new Path2D();
    if (line.path(path, start, count)) {
      path.closePath();
    }
  }
  setStyle(ctx, line.options);
  ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
  const { segments, options } = line;
  const segmentMethod = _getSegmentMethod(line);
  for (const segment of segments) {
    setStyle(ctx, options, segment.style);
    ctx.beginPath();
    if (segmentMethod(ctx, line, segment, {
      start,
      end: start + count - 1
    })) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}
var usePath2D = typeof Path2D === "function";
function draw(ctx, line, start, count) {
  if (usePath2D && !line.options.segment) {
    strokePathWithCache(ctx, line, start, count);
  } else {
    strokePathDirect(ctx, line, start, count);
  }
}
var LineElement = class extends Element {
  static id = "line";
  static defaults = {
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: "miter",
    borderWidth: 3,
    capBezierPoints: true,
    cubicInterpolationMode: "default",
    fill: false,
    spanGaps: false,
    stepped: false,
    tension: 0
  };
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  static descriptors = {
    _scriptable: true,
    _indexable: (name) => name !== "borderDash" && name !== "fill"
  };
  constructor(cfg) {
    super();
    this.animated = true;
    this.options = void 0;
    this._chart = void 0;
    this._loop = void 0;
    this._fullLoop = void 0;
    this._path = void 0;
    this._points = void 0;
    this._segments = void 0;
    this._decimated = false;
    this._pointsUpdated = false;
    this._datasetIndex = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  updateControlPoints(chartArea, indexAxis) {
    const options = this.options;
    if ((options.tension || options.cubicInterpolationMode === "monotone") && !options.stepped && !this._pointsUpdated) {
      const loop = options.spanGaps ? this._loop : this._fullLoop;
      _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
      this._pointsUpdated = true;
    }
  }
  set points(points) {
    this._points = points;
    delete this._segments;
    delete this._path;
    this._pointsUpdated = false;
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = _computeSegments(this, this.options.segment));
  }
  first() {
    const segments = this.segments;
    const points = this.points;
    return segments.length && points[segments[0].start];
  }
  last() {
    const segments = this.segments;
    const points = this.points;
    const count = segments.length;
    return count && points[segments[count - 1].end];
  }
  interpolate(point, property) {
    const options = this.options;
    const value2 = point[property];
    const points = this.points;
    const segments = _boundSegments(this, {
      property,
      start: value2,
      end: value2
    });
    if (!segments.length) {
      return;
    }
    const result = [];
    const _interpolate = _getInterpolationMethod(options);
    let i, ilen;
    for (i = 0, ilen = segments.length; i < ilen; ++i) {
      const { start, end } = segments[i];
      const p1 = points[start];
      const p2 = points[end];
      if (p1 === p2) {
        result.push(p1);
        continue;
      }
      const t2 = Math.abs((value2 - p1[property]) / (p2[property] - p1[property]));
      const interpolated = _interpolate(p1, p2, t2, options.stepped);
      interpolated[property] = point[property];
      result.push(interpolated);
    }
    return result.length === 1 ? result[0] : result;
  }
  pathSegment(ctx, segment, params) {
    const segmentMethod = _getSegmentMethod(this);
    return segmentMethod(ctx, this, segment, params);
  }
  path(ctx, start, count) {
    const segments = this.segments;
    const segmentMethod = _getSegmentMethod(this);
    let loop = this._loop;
    start = start || 0;
    count = count || this.points.length - start;
    for (const segment of segments) {
      loop &= segmentMethod(ctx, this, segment, {
        start,
        end: start + count - 1
      });
    }
    return !!loop;
  }
  draw(ctx, chartArea, start, count) {
    const options = this.options || {};
    const points = this.points || [];
    if (points.length && options.borderWidth) {
      ctx.save();
      draw(ctx, this, start, count);
      ctx.restore();
    }
    if (this.animated) {
      this._pointsUpdated = false;
      this._path = void 0;
    }
  }
};
function inRange$1(el2, pos, axis, useFinalPosition) {
  const options = el2.options;
  const { [axis]: value2 } = el2.getProps([
    axis
  ], useFinalPosition);
  return Math.abs(pos - value2) < options.radius + options.hitRadius;
}
var PointElement = class extends Element {
  static id = "point";
  parsed;
  skip;
  stop;
  /**
  * @type {any}
  */
  static defaults = {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: "circle",
    radius: 3,
    rotation: 0
  };
  /**
  * @type {any}
  */
  static defaultRoutes = {
    backgroundColor: "backgroundColor",
    borderColor: "borderColor"
  };
  constructor(cfg) {
    super();
    this.options = void 0;
    this.parsed = void 0;
    this.skip = void 0;
    this.stop = void 0;
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  inRange(mouseX, mouseY, useFinalPosition) {
    const options = this.options;
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
  }
  inXRange(mouseX, useFinalPosition) {
    return inRange$1(this, mouseX, "x", useFinalPosition);
  }
  inYRange(mouseY, useFinalPosition) {
    return inRange$1(this, mouseY, "y", useFinalPosition);
  }
  getCenterPoint(useFinalPosition) {
    const { x, y } = this.getProps([
      "x",
      "y"
    ], useFinalPosition);
    return {
      x,
      y
    };
  }
  size(options) {
    options = options || this.options || {};
    let radius = options.radius || 0;
    radius = Math.max(radius, radius && options.hoverRadius || 0);
    const borderWidth = radius && options.borderWidth || 0;
    return (radius + borderWidth) * 2;
  }
  draw(ctx, area) {
    const options = this.options;
    if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
      return;
    }
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.fillStyle = options.backgroundColor;
    drawPoint(ctx, options, this.x, this.y);
  }
  getRange() {
    const options = this.options || {};
    return options.radius + options.hitRadius;
  }
};
var getBoxSize = (labelOpts, fontSize) => {
  let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
  if (labelOpts.usePointStyle) {
    boxHeight = Math.min(boxHeight, fontSize);
    boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
  }
  return {
    boxWidth,
    boxHeight,
    itemHeight: Math.max(fontSize, boxHeight)
  };
};
var itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
var Legend = class extends Element {
  constructor(config) {
    super();
    this._added = false;
    this.legendHitBoxes = [];
    this._hoveredItem = null;
    this.doughnutMode = false;
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this.legendItems = void 0;
    this.columnSizes = void 0;
    this.lineWidths = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.height = void 0;
    this.width = void 0;
    this._margins = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight, margins) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this._margins = margins;
    this.setDimensions();
    this.buildLabels();
    this.fit();
  }
  setDimensions() {
    if (this.isHorizontal()) {
      this.width = this.maxWidth;
      this.left = this._margins.left;
      this.right = this.width;
    } else {
      this.height = this.maxHeight;
      this.top = this._margins.top;
      this.bottom = this.height;
    }
  }
  buildLabels() {
    const labelOpts = this.options.labels || {};
    let legendItems = callback(labelOpts.generateLabels, [
      this.chart
    ], this) || [];
    if (labelOpts.filter) {
      legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
    }
    if (labelOpts.sort) {
      legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
    }
    if (this.options.reverse) {
      legendItems.reverse();
    }
    this.legendItems = legendItems;
  }
  fit() {
    const { options, ctx } = this;
    if (!options.display) {
      this.width = this.height = 0;
      return;
    }
    const labelOpts = options.labels;
    const labelFont = toFont(labelOpts.font);
    const fontSize = labelFont.size;
    const titleHeight = this._computeTitleHeight();
    const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
    let width, height;
    ctx.font = labelFont.string;
    if (this.isHorizontal()) {
      width = this.maxWidth;
      height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    } else {
      height = this.maxHeight;
      width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
    }
    this.width = Math.min(width, options.maxWidth || this.maxWidth);
    this.height = Math.min(height, options.maxHeight || this.maxHeight);
  }
  _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
    const { ctx, maxWidth, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const lineWidths = this.lineWidths = [
      0
    ];
    const lineHeight = itemHeight + padding;
    let totalHeight = titleHeight;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let row = -1;
    let top = -lineHeight;
    this.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
      if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
        totalHeight += lineHeight;
        lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
        top += lineHeight;
        row++;
      }
      hitboxes[i] = {
        left: 0,
        top,
        row,
        width: itemWidth,
        height: itemHeight
      };
      lineWidths[lineWidths.length - 1] += itemWidth + padding;
    });
    return totalHeight;
  }
  _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
    const { ctx, maxHeight, options: { labels: { padding } } } = this;
    const hitboxes = this.legendHitBoxes = [];
    const columnSizes = this.columnSizes = [];
    const heightLimit = maxHeight - titleHeight;
    let totalWidth = padding;
    let currentColWidth = 0;
    let currentColHeight = 0;
    let left = 0;
    let col = 0;
    this.legendItems.forEach((legendItem, i) => {
      const { itemWidth, itemHeight } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
      if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
        totalWidth += currentColWidth + padding;
        columnSizes.push({
          width: currentColWidth,
          height: currentColHeight
        });
        left += currentColWidth + padding;
        col++;
        currentColWidth = currentColHeight = 0;
      }
      hitboxes[i] = {
        left,
        top: currentColHeight,
        col,
        width: itemWidth,
        height: itemHeight
      };
      currentColWidth = Math.max(currentColWidth, itemWidth);
      currentColHeight += itemHeight + padding;
    });
    totalWidth += currentColWidth;
    columnSizes.push({
      width: currentColWidth,
      height: currentColHeight
    });
    return totalWidth;
  }
  adjustHitBoxes() {
    if (!this.options.display) {
      return;
    }
    const titleHeight = this._computeTitleHeight();
    const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
    const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
    if (this.isHorizontal()) {
      let row = 0;
      let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
      for (const hitbox of hitboxes) {
        if (row !== hitbox.row) {
          row = hitbox.row;
          left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
        }
        hitbox.top += this.top + titleHeight + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
        left += hitbox.width + padding;
      }
    } else {
      let col = 0;
      let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
      for (const hitbox of hitboxes) {
        if (hitbox.col !== col) {
          col = hitbox.col;
          top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
        }
        hitbox.top = top;
        hitbox.left += this.left + padding;
        hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
        top += hitbox.height + padding;
      }
    }
  }
  isHorizontal() {
    return this.options.position === "top" || this.options.position === "bottom";
  }
  draw() {
    if (this.options.display) {
      const ctx = this.ctx;
      clipArea(ctx, this);
      this._draw();
      unclipArea(ctx);
    }
  }
  _draw() {
    const { options: opts, columnSizes, lineWidths, ctx } = this;
    const { align, labels: labelOpts } = opts;
    const defaultColor = defaults.color;
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const labelFont = toFont(labelOpts.font);
    const { padding } = labelOpts;
    const fontSize = labelFont.size;
    const halfFontSize = fontSize / 2;
    let cursor;
    this.drawTitle();
    ctx.textAlign = rtlHelper.textAlign("left");
    ctx.textBaseline = "middle";
    ctx.lineWidth = 0.5;
    ctx.font = labelFont.string;
    const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
    const drawLegendBox = function(x, y, legendItem) {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return;
      }
      ctx.save();
      const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
      ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
      ctx.lineCap = valueOrDefault(legendItem.lineCap, "butt");
      ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
      ctx.lineJoin = valueOrDefault(legendItem.lineJoin, "miter");
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
      ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
      if (labelOpts.usePointStyle) {
        const drawOptions = {
          radius: boxHeight * Math.SQRT2 / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        };
        const centerX = rtlHelper.xPlus(x, boxWidth / 2);
        const centerY = y + halfFontSize;
        drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
      } else {
        const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
        const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
        const borderRadius = toTRBLCorners(legendItem.borderRadius);
        ctx.beginPath();
        if (Object.values(borderRadius).some((v) => v !== 0)) {
          addRoundedRectPath(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          });
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
        }
        ctx.fill();
        if (lineWidth !== 0) {
          ctx.stroke();
        }
      }
      ctx.restore();
    };
    const fillText = function(x, y, legendItem) {
      renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: rtlHelper.textAlign(legendItem.textAlign)
      });
    };
    const isHorizontal = this.isHorizontal();
    const titleHeight = this._computeTitleHeight();
    if (isHorizontal) {
      cursor = {
        x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
        y: this.top + padding + titleHeight,
        line: 0
      };
    } else {
      cursor = {
        x: this.left + padding,
        y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
        line: 0
      };
    }
    overrideTextDirection(this.ctx, opts.textDirection);
    const lineHeight = itemHeight + padding;
    this.legendItems.forEach((legendItem, i) => {
      ctx.strokeStyle = legendItem.fontColor;
      ctx.fillStyle = legendItem.fontColor;
      const textWidth2 = ctx.measureText(legendItem.text).width;
      const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
      const width = boxWidth + halfFontSize + textWidth2;
      let x = cursor.x;
      let y = cursor.y;
      rtlHelper.setWidth(this.width);
      if (isHorizontal) {
        if (i > 0 && x + width + padding > this.right) {
          y = cursor.y += lineHeight;
          cursor.line++;
          x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
        }
      } else if (i > 0 && y + lineHeight > this.bottom) {
        x = cursor.x = x + columnSizes[cursor.line].width + padding;
        cursor.line++;
        y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
      }
      const realX = rtlHelper.x(x);
      drawLegendBox(realX, y, legendItem);
      x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
      fillText(rtlHelper.x(x), y, legendItem);
      if (isHorizontal) {
        cursor.x += width + padding;
      } else if (typeof legendItem.text !== "string") {
        const fontLineHeight = labelFont.lineHeight;
        cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
      } else {
        cursor.y += lineHeight;
      }
    });
    restoreTextDirection(this.ctx, opts.textDirection);
  }
  drawTitle() {
    const opts = this.options;
    const titleOpts = opts.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    if (!titleOpts.display) {
      return;
    }
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
    const ctx = this.ctx;
    const position = titleOpts.position;
    const halfFontSize = titleFont.size / 2;
    const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
    let y;
    let left = this.left;
    let maxWidth = this.width;
    if (this.isHorizontal()) {
      maxWidth = Math.max(...this.lineWidths);
      y = this.top + topPaddingPlusHalfFontSize;
      left = _alignStartEnd(opts.align, left, this.right - maxWidth);
    } else {
      const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
      y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
    }
    const x = _alignStartEnd(position, left, left + maxWidth);
    ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
    ctx.textBaseline = "middle";
    ctx.strokeStyle = titleOpts.color;
    ctx.fillStyle = titleOpts.color;
    ctx.font = titleFont.string;
    renderText(ctx, titleOpts.text, x, y, titleFont);
  }
  _computeTitleHeight() {
    const titleOpts = this.options.title;
    const titleFont = toFont(titleOpts.font);
    const titlePadding = toPadding(titleOpts.padding);
    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
  }
  _getLegendItemAt(x, y) {
    let i, hitBox, lh;
    if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
      lh = this.legendHitBoxes;
      for (i = 0; i < lh.length; ++i) {
        hitBox = lh[i];
        if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
          return this.legendItems[i];
        }
      }
    }
    return null;
  }
  handleEvent(e) {
    const opts = this.options;
    if (!isListened(e.type, opts)) {
      return;
    }
    const hoveredItem = this._getLegendItemAt(e.x, e.y);
    if (e.type === "mousemove" || e.type === "mouseout") {
      const previous = this._hoveredItem;
      const sameItem = itemsEqual(previous, hoveredItem);
      if (previous && !sameItem) {
        callback(opts.onLeave, [
          e,
          previous,
          this
        ], this);
      }
      this._hoveredItem = hoveredItem;
      if (hoveredItem && !sameItem) {
        callback(opts.onHover, [
          e,
          hoveredItem,
          this
        ], this);
      }
    } else if (hoveredItem) {
      callback(opts.onClick, [
        e,
        hoveredItem,
        this
      ], this);
    }
  }
};
function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
  const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
  const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
  return {
    itemWidth,
    itemHeight
  };
}
function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
  let legendItemText = legendItem.text;
  if (legendItemText && typeof legendItemText !== "string") {
    legendItemText = legendItemText.reduce((a, b) => a.length > b.length ? a : b);
  }
  return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
  let itemHeight = _itemHeight;
  if (typeof legendItem.text !== "string") {
    itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
  }
  return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
  const labelHeight = legendItem.text ? legendItem.text.length : 0;
  return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
  if ((type === "mousemove" || type === "mouseout") && (opts.onHover || opts.onLeave)) {
    return true;
  }
  if (opts.onClick && (type === "click" || type === "mouseup")) {
    return true;
  }
  return false;
}
var plugin_legend = {
  id: "legend",
  _element: Legend,
  start(chart, _args, options) {
    const legend2 = chart.legend = new Legend({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, legend2, options);
    layouts.addBox(chart, legend2);
  },
  stop(chart) {
    layouts.removeBox(chart, chart.legend);
    delete chart.legend;
  },
  beforeUpdate(chart, _args, options) {
    const legend2 = chart.legend;
    layouts.configure(chart, legend2, options);
    legend2.options = options;
  },
  afterUpdate(chart) {
    const legend2 = chart.legend;
    legend2.buildLabels();
    legend2.adjustHitBoxes();
  },
  afterEvent(chart, args) {
    if (!args.replay) {
      chart.legend.handleEvent(args.event);
    }
  },
  defaults: {
    display: true,
    position: "top",
    align: "center",
    fullSize: true,
    reverse: false,
    weight: 1e3,
    onClick(e, legendItem, legend2) {
      const index = legendItem.datasetIndex;
      const ci = legend2.chart;
      if (ci.isDatasetVisible(index)) {
        ci.hide(index);
        legendItem.hidden = true;
      } else {
        ci.show(index);
        legendItem.hidden = false;
      }
    },
    onHover: null,
    onLeave: null,
    labels: {
      color: (ctx) => ctx.chart.options.color,
      boxWidth: 40,
      padding: 10,
      generateLabels(chart) {
        const datasets = chart.data.datasets;
        const { labels: { usePointStyle, pointStyle, textAlign, color: color2, useBorderRadius, borderRadius } } = chart.legend.options;
        return chart._getSortedDatasetMetas().map((meta) => {
          const style = meta.controller.getStyle(usePointStyle ? 0 : void 0);
          const borderWidth = toPadding(style.borderWidth);
          return {
            text: datasets[meta.index].label,
            fillStyle: style.backgroundColor,
            fontColor: color2,
            hidden: !meta.visible,
            lineCap: style.borderCapStyle,
            lineDash: style.borderDash,
            lineDashOffset: style.borderDashOffset,
            lineJoin: style.borderJoinStyle,
            lineWidth: (borderWidth.width + borderWidth.height) / 4,
            strokeStyle: style.borderColor,
            pointStyle: pointStyle || style.pointStyle,
            rotation: style.rotation,
            textAlign: textAlign || style.textAlign,
            borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
            datasetIndex: meta.index
          };
        }, this);
      }
    },
    title: {
      color: (ctx) => ctx.chart.options.color,
      display: false,
      position: "center",
      text: ""
    }
  },
  descriptors: {
    _scriptable: (name) => !name.startsWith("on"),
    labels: {
      _scriptable: (name) => ![
        "generateLabels",
        "filter",
        "sort"
      ].includes(name)
    }
  }
};
var Title = class extends Element {
  constructor(config) {
    super();
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this._padding = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.left = void 0;
    this.right = void 0;
    this.width = void 0;
    this.height = void 0;
    this.position = void 0;
    this.weight = void 0;
    this.fullSize = void 0;
  }
  update(maxWidth, maxHeight) {
    const opts = this.options;
    this.left = 0;
    this.top = 0;
    if (!opts.display) {
      this.width = this.height = this.right = this.bottom = 0;
      return;
    }
    this.width = this.right = maxWidth;
    this.height = this.bottom = maxHeight;
    const lineCount = isArray(opts.text) ? opts.text.length : 1;
    this._padding = toPadding(opts.padding);
    const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
    if (this.isHorizontal()) {
      this.height = textSize;
    } else {
      this.width = textSize;
    }
  }
  isHorizontal() {
    const pos = this.options.position;
    return pos === "top" || pos === "bottom";
  }
  _drawArgs(offset) {
    const { top, left, bottom, right, options } = this;
    const align = options.align;
    let rotation = 0;
    let maxWidth, titleX, titleY;
    if (this.isHorizontal()) {
      titleX = _alignStartEnd(align, left, right);
      titleY = top + offset;
      maxWidth = right - left;
    } else {
      if (options.position === "left") {
        titleX = left + offset;
        titleY = _alignStartEnd(align, bottom, top);
        rotation = PI * -0.5;
      } else {
        titleX = right - offset;
        titleY = _alignStartEnd(align, top, bottom);
        rotation = PI * 0.5;
      }
      maxWidth = bottom - top;
    }
    return {
      titleX,
      titleY,
      maxWidth,
      rotation
    };
  }
  draw() {
    const ctx = this.ctx;
    const opts = this.options;
    if (!opts.display) {
      return;
    }
    const fontOpts = toFont(opts.font);
    const lineHeight = fontOpts.lineHeight;
    const offset = lineHeight / 2 + this._padding.top;
    const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
    renderText(ctx, opts.text, 0, 0, fontOpts, {
      color: opts.color,
      maxWidth,
      rotation,
      textAlign: _toLeftRightCenter(opts.align),
      textBaseline: "middle",
      translation: [
        titleX,
        titleY
      ]
    });
  }
};
function createTitle(chart, titleOpts) {
  const title = new Title({
    ctx: chart.ctx,
    options: titleOpts,
    chart
  });
  layouts.configure(chart, title, titleOpts);
  layouts.addBox(chart, title);
  chart.titleBlock = title;
}
var plugin_title = {
  id: "title",
  _element: Title,
  start(chart, _args, options) {
    createTitle(chart, options);
  },
  stop(chart) {
    const titleBlock = chart.titleBlock;
    layouts.removeBox(chart, titleBlock);
    delete chart.titleBlock;
  },
  beforeUpdate(chart, _args, options) {
    const title = chart.titleBlock;
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "bold"
    },
    fullSize: true,
    padding: 10,
    position: "top",
    text: "",
    weight: 2e3
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
var map2 = /* @__PURE__ */ new WeakMap();
var plugin_subtitle = {
  id: "subtitle",
  start(chart, _args, options) {
    const title = new Title({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, title, options);
    layouts.addBox(chart, title);
    map2.set(chart, title);
  },
  stop(chart) {
    layouts.removeBox(chart, map2.get(chart));
    map2.delete(chart);
  },
  beforeUpdate(chart, _args, options) {
    const title = map2.get(chart);
    layouts.configure(chart, title, options);
    title.options = options;
  },
  defaults: {
    align: "center",
    display: false,
    font: {
      weight: "normal"
    },
    fullSize: true,
    padding: 0,
    position: "top",
    text: "",
    weight: 1500
  },
  defaultRoutes: {
    color: "color"
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
var positioners = {
  average(items) {
    if (!items.length) {
      return false;
    }
    let i, len;
    let xSet = /* @__PURE__ */ new Set();
    let y = 0;
    let count = 0;
    for (i = 0, len = items.length; i < len; ++i) {
      const el2 = items[i].element;
      if (el2 && el2.hasValue()) {
        const pos = el2.tooltipPosition();
        xSet.add(pos.x);
        y += pos.y;
        ++count;
      }
    }
    if (count === 0 || xSet.size === 0) {
      return false;
    }
    const xAverage = [
      ...xSet
    ].reduce((a, b) => a + b) / xSet.size;
    return {
      x: xAverage,
      y: y / count
    };
  },
  nearest(items, eventPosition) {
    if (!items.length) {
      return false;
    }
    let x = eventPosition.x;
    let y = eventPosition.y;
    let minDistance = Number.POSITIVE_INFINITY;
    let i, len, nearestElement;
    for (i = 0, len = items.length; i < len; ++i) {
      const el2 = items[i].element;
      if (el2 && el2.hasValue()) {
        const center = el2.getCenterPoint();
        const d = distanceBetweenPoints(eventPosition, center);
        if (d < minDistance) {
          minDistance = d;
          nearestElement = el2;
        }
      }
    }
    if (nearestElement) {
      const tp = nearestElement.tooltipPosition();
      x = tp.x;
      y = tp.y;
    }
    return {
      x,
      y
    };
  }
};
function pushOrConcat(base, toPush) {
  if (toPush) {
    if (isArray(toPush)) {
      Array.prototype.push.apply(base, toPush);
    } else {
      base.push(toPush);
    }
  }
  return base;
}
function splitNewlines(str) {
  if ((typeof str === "string" || str instanceof String) && str.indexOf("\n") > -1) {
    return str.split("\n");
  }
  return str;
}
function createTooltipItem(chart, item) {
  const { element, datasetIndex, index } = item;
  const controller = chart.getDatasetMeta(datasetIndex).controller;
  const { label, value: value2 } = controller.getLabelAndValue(index);
  return {
    chart,
    label,
    parsed: controller.getParsed(index),
    raw: chart.data.datasets[datasetIndex].data[index],
    formattedValue: value2,
    dataset: controller.getDataset(),
    dataIndex: index,
    datasetIndex,
    element
  };
}
function getTooltipSize(tooltip, options) {
  const ctx = tooltip.chart.ctx;
  const { body, footer, title } = tooltip;
  const { boxWidth, boxHeight } = options;
  const bodyFont = toFont(options.bodyFont);
  const titleFont = toFont(options.titleFont);
  const footerFont = toFont(options.footerFont);
  const titleLineCount = title.length;
  const footerLineCount = footer.length;
  const bodyLineItemCount = body.length;
  const padding = toPadding(options.padding);
  let height = padding.height;
  let width = 0;
  let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
  combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
  if (titleLineCount) {
    height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
  }
  if (combinedBodyLength) {
    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
    height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
  }
  if (footerLineCount) {
    height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
  }
  let widthPadding = 0;
  const maxLineWidth = function(line) {
    width = Math.max(width, ctx.measureText(line).width + widthPadding);
  };
  ctx.save();
  ctx.font = titleFont.string;
  each(tooltip.title, maxLineWidth);
  ctx.font = bodyFont.string;
  each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
  widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
  each(body, (bodyItem) => {
    each(bodyItem.before, maxLineWidth);
    each(bodyItem.lines, maxLineWidth);
    each(bodyItem.after, maxLineWidth);
  });
  widthPadding = 0;
  ctx.font = footerFont.string;
  each(tooltip.footer, maxLineWidth);
  ctx.restore();
  width += padding.width;
  return {
    width,
    height
  };
}
function determineYAlign(chart, size) {
  const { y, height } = size;
  if (y < height / 2) {
    return "top";
  } else if (y > chart.height - height / 2) {
    return "bottom";
  }
  return "center";
}
function doesNotFitWithAlign(xAlign, chart, options, size) {
  const { x, width } = size;
  const caret = options.caretSize + options.caretPadding;
  if (xAlign === "left" && x + width + caret > chart.width) {
    return true;
  }
  if (xAlign === "right" && x - width - caret < 0) {
    return true;
  }
}
function determineXAlign(chart, options, size, yAlign) {
  const { x, width } = size;
  const { width: chartWidth, chartArea: { left, right } } = chart;
  let xAlign = "center";
  if (yAlign === "center") {
    xAlign = x <= (left + right) / 2 ? "left" : "right";
  } else if (x <= width / 2) {
    xAlign = "left";
  } else if (x >= chartWidth - width / 2) {
    xAlign = "right";
  }
  if (doesNotFitWithAlign(xAlign, chart, options, size)) {
    xAlign = "center";
  }
  return xAlign;
}
function determineAlignment(chart, options, size) {
  const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
  return {
    xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
    yAlign
  };
}
function alignX(size, xAlign) {
  let { x, width } = size;
  if (xAlign === "right") {
    x -= width;
  } else if (xAlign === "center") {
    x -= width / 2;
  }
  return x;
}
function alignY(size, yAlign, paddingAndSize) {
  let { y, height } = size;
  if (yAlign === "top") {
    y += paddingAndSize;
  } else if (yAlign === "bottom") {
    y -= height + paddingAndSize;
  } else {
    y -= height / 2;
  }
  return y;
}
function getBackgroundPoint(options, size, alignment, chart) {
  const { caretSize, caretPadding, cornerRadius } = options;
  const { xAlign, yAlign } = alignment;
  const paddingAndSize = caretSize + caretPadding;
  const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
  let x = alignX(size, xAlign);
  const y = alignY(size, yAlign, paddingAndSize);
  if (yAlign === "center") {
    if (xAlign === "left") {
      x += paddingAndSize;
    } else if (xAlign === "right") {
      x -= paddingAndSize;
    }
  } else if (xAlign === "left") {
    x -= Math.max(topLeft, bottomLeft) + caretSize;
  } else if (xAlign === "right") {
    x += Math.max(topRight, bottomRight) + caretSize;
  }
  return {
    x: _limitValue(x, 0, chart.width - size.width),
    y: _limitValue(y, 0, chart.height - size.height)
  };
}
function getAlignedX(tooltip, align, options) {
  const padding = toPadding(options.padding);
  return align === "center" ? tooltip.x + tooltip.width / 2 : align === "right" ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
}
function getBeforeAfterBodyLines(callback2) {
  return pushOrConcat([], splitNewlines(callback2));
}
function createTooltipContext(parent, tooltip, tooltipItems) {
  return createContext(parent, {
    tooltip,
    tooltipItems,
    type: "tooltip"
  });
}
function overrideCallbacks(callbacks, context) {
  const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
  return override ? callbacks.override(override) : callbacks;
}
var defaultCallbacks = {
  beforeTitle: noop,
  title(tooltipItems) {
    if (tooltipItems.length > 0) {
      const item = tooltipItems[0];
      const labels = item.chart.data.labels;
      const labelCount = labels ? labels.length : 0;
      if (this && this.options && this.options.mode === "dataset") {
        return item.dataset.label || "";
      } else if (item.label) {
        return item.label;
      } else if (labelCount > 0 && item.dataIndex < labelCount) {
        return labels[item.dataIndex];
      }
    }
    return "";
  },
  afterTitle: noop,
  beforeBody: noop,
  beforeLabel: noop,
  label(tooltipItem) {
    if (this && this.options && this.options.mode === "dataset") {
      return tooltipItem.label + ": " + tooltipItem.formattedValue || tooltipItem.formattedValue;
    }
    let label = tooltipItem.dataset.label || "";
    if (label) {
      label += ": ";
    }
    const value2 = tooltipItem.formattedValue;
    if (!isNullOrUndef(value2)) {
      label += value2;
    }
    return label;
  },
  labelColor(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      borderColor: options.borderColor,
      backgroundColor: options.backgroundColor,
      borderWidth: options.borderWidth,
      borderDash: options.borderDash,
      borderDashOffset: options.borderDashOffset,
      borderRadius: 0
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(tooltipItem) {
    const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
    const options = meta.controller.getStyle(tooltipItem.dataIndex);
    return {
      pointStyle: options.pointStyle,
      rotation: options.rotation
    };
  },
  afterLabel: noop,
  afterBody: noop,
  beforeFooter: noop,
  footer: noop,
  afterFooter: noop
};
function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
  const result = callbacks[name].call(ctx, arg);
  if (typeof result === "undefined") {
    return defaultCallbacks[name].call(ctx, arg);
  }
  return result;
}
var Tooltip = class extends Element {
  static positioners = positioners;
  constructor(config) {
    super();
    this.opacity = 0;
    this._active = [];
    this._eventPosition = void 0;
    this._size = void 0;
    this._cachedAnimations = void 0;
    this._tooltipItems = [];
    this.$animations = void 0;
    this.$context = void 0;
    this.chart = config.chart;
    this.options = config.options;
    this.dataPoints = void 0;
    this.title = void 0;
    this.beforeBody = void 0;
    this.body = void 0;
    this.afterBody = void 0;
    this.footer = void 0;
    this.xAlign = void 0;
    this.yAlign = void 0;
    this.x = void 0;
    this.y = void 0;
    this.height = void 0;
    this.width = void 0;
    this.caretX = void 0;
    this.caretY = void 0;
    this.labelColors = void 0;
    this.labelPointStyles = void 0;
    this.labelTextColors = void 0;
  }
  initialize(options) {
    this.options = options;
    this._cachedAnimations = void 0;
    this.$context = void 0;
  }
  _resolveAnimations() {
    const cached = this._cachedAnimations;
    if (cached) {
      return cached;
    }
    const chart = this.chart;
    const options = this.options.setContext(this.getContext());
    const opts = options.enabled && chart.options.animation && options.animations;
    const animations = new Animations(this.chart, opts);
    if (opts._cacheable) {
      this._cachedAnimations = Object.freeze(animations);
    }
    return animations;
  }
  getContext() {
    return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
  }
  getTitle(context, options) {
    const { callbacks } = options;
    const beforeTitle = invokeCallbackWithFallback(callbacks, "beforeTitle", this, context);
    const title = invokeCallbackWithFallback(callbacks, "title", this, context);
    const afterTitle = invokeCallbackWithFallback(callbacks, "afterTitle", this, context);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeTitle));
    lines = pushOrConcat(lines, splitNewlines(title));
    lines = pushOrConcat(lines, splitNewlines(afterTitle));
    return lines;
  }
  getBeforeBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "beforeBody", this, tooltipItems));
  }
  getBody(tooltipItems, options) {
    const { callbacks } = options;
    const bodyItems = [];
    each(tooltipItems, (context) => {
      const bodyItem = {
        before: [],
        lines: [],
        after: []
      };
      const scoped = overrideCallbacks(callbacks, context);
      pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, "beforeLabel", this, context)));
      pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, "label", this, context));
      pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, "afterLabel", this, context)));
      bodyItems.push(bodyItem);
    });
    return bodyItems;
  }
  getAfterBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, "afterBody", this, tooltipItems));
  }
  getFooter(tooltipItems, options) {
    const { callbacks } = options;
    const beforeFooter = invokeCallbackWithFallback(callbacks, "beforeFooter", this, tooltipItems);
    const footer = invokeCallbackWithFallback(callbacks, "footer", this, tooltipItems);
    const afterFooter = invokeCallbackWithFallback(callbacks, "afterFooter", this, tooltipItems);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeFooter));
    lines = pushOrConcat(lines, splitNewlines(footer));
    lines = pushOrConcat(lines, splitNewlines(afterFooter));
    return lines;
  }
  _createItems(options) {
    const active = this._active;
    const data = this.chart.data;
    const labelColors = [];
    const labelPointStyles = [];
    const labelTextColors = [];
    let tooltipItems = [];
    let i, len;
    for (i = 0, len = active.length; i < len; ++i) {
      tooltipItems.push(createTooltipItem(this.chart, active[i]));
    }
    if (options.filter) {
      tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
    }
    if (options.itemSort) {
      tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
    }
    each(tooltipItems, (context) => {
      const scoped = overrideCallbacks(options.callbacks, context);
      labelColors.push(invokeCallbackWithFallback(scoped, "labelColor", this, context));
      labelPointStyles.push(invokeCallbackWithFallback(scoped, "labelPointStyle", this, context));
      labelTextColors.push(invokeCallbackWithFallback(scoped, "labelTextColor", this, context));
    });
    this.labelColors = labelColors;
    this.labelPointStyles = labelPointStyles;
    this.labelTextColors = labelTextColors;
    this.dataPoints = tooltipItems;
    return tooltipItems;
  }
  update(changed, replay) {
    const options = this.options.setContext(this.getContext());
    const active = this._active;
    let properties;
    let tooltipItems = [];
    if (!active.length) {
      if (this.opacity !== 0) {
        properties = {
          opacity: 0
        };
      }
    } else {
      const position = positioners[options.position].call(this, active, this._eventPosition);
      tooltipItems = this._createItems(options);
      this.title = this.getTitle(tooltipItems, options);
      this.beforeBody = this.getBeforeBody(tooltipItems, options);
      this.body = this.getBody(tooltipItems, options);
      this.afterBody = this.getAfterBody(tooltipItems, options);
      this.footer = this.getFooter(tooltipItems, options);
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, size);
      const alignment = determineAlignment(this.chart, options, positionAndSize);
      const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
      this.xAlign = alignment.xAlign;
      this.yAlign = alignment.yAlign;
      properties = {
        opacity: 1,
        x: backgroundPoint.x,
        y: backgroundPoint.y,
        width: size.width,
        height: size.height,
        caretX: position.x,
        caretY: position.y
      };
    }
    this._tooltipItems = tooltipItems;
    this.$context = void 0;
    if (properties) {
      this._resolveAnimations().update(this, properties);
    }
    if (changed && options.external) {
      options.external.call(this, {
        chart: this.chart,
        tooltip: this,
        replay
      });
    }
  }
  drawCaret(tooltipPoint, ctx, size, options) {
    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
    ctx.lineTo(caretPosition.x1, caretPosition.y1);
    ctx.lineTo(caretPosition.x2, caretPosition.y2);
    ctx.lineTo(caretPosition.x3, caretPosition.y3);
  }
  getCaretPosition(tooltipPoint, size, options) {
    const { xAlign, yAlign } = this;
    const { caretSize, cornerRadius } = options;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
    const { x: ptX, y: ptY } = tooltipPoint;
    const { width, height } = size;
    let x1, x2, x3, y1, y2, y3;
    if (yAlign === "center") {
      y2 = ptY + height / 2;
      if (xAlign === "left") {
        x1 = ptX;
        x2 = x1 - caretSize;
        y1 = y2 + caretSize;
        y3 = y2 - caretSize;
      } else {
        x1 = ptX + width;
        x2 = x1 + caretSize;
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      }
      x3 = x1;
    } else {
      if (xAlign === "left") {
        x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
      } else if (xAlign === "right") {
        x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
      } else {
        x2 = this.caretX;
      }
      if (yAlign === "top") {
        y1 = ptY;
        y2 = y1 - caretSize;
        x1 = x2 - caretSize;
        x3 = x2 + caretSize;
      } else {
        y1 = ptY + height;
        y2 = y1 + caretSize;
        x1 = x2 + caretSize;
        x3 = x2 - caretSize;
      }
      y3 = y1;
    }
    return {
      x1,
      x2,
      x3,
      y1,
      y2,
      y3
    };
  }
  drawTitle(pt, ctx, options) {
    const title = this.title;
    const length = title.length;
    let titleFont, titleSpacing, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.titleAlign, options);
      ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
      ctx.textBaseline = "middle";
      titleFont = toFont(options.titleFont);
      titleSpacing = options.titleSpacing;
      ctx.fillStyle = options.titleColor;
      ctx.font = titleFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
        pt.y += titleFont.lineHeight + titleSpacing;
        if (i + 1 === length) {
          pt.y += options.titleMarginBottom - titleSpacing;
        }
      }
    }
  }
  _drawColorBox(ctx, pt, i, rtlHelper, options) {
    const labelColor = this.labelColors[i];
    const labelPointStyle = this.labelPointStyles[i];
    const { boxHeight, boxWidth } = options;
    const bodyFont = toFont(options.bodyFont);
    const colorX = getAlignedX(this, "left", options);
    const rtlColorX = rtlHelper.x(colorX);
    const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
    const colorY = pt.y + yOffSet;
    if (options.usePointStyle) {
      const drawOptions = {
        radius: Math.min(boxWidth, boxHeight) / 2,
        pointStyle: labelPointStyle.pointStyle,
        rotation: labelPointStyle.rotation,
        borderWidth: 1
      };
      const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
      const centerY = colorY + boxHeight / 2;
      ctx.strokeStyle = options.multiKeyBackground;
      ctx.fillStyle = options.multiKeyBackground;
      drawPoint(ctx, drawOptions, centerX, centerY);
      ctx.strokeStyle = labelColor.borderColor;
      ctx.fillStyle = labelColor.backgroundColor;
      drawPoint(ctx, drawOptions, centerX, centerY);
    } else {
      ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
      ctx.strokeStyle = labelColor.borderColor;
      ctx.setLineDash(labelColor.borderDash || []);
      ctx.lineDashOffset = labelColor.borderDashOffset || 0;
      const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
      const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
      const borderRadius = toTRBLCorners(labelColor.borderRadius);
      if (Object.values(borderRadius).some((v) => v !== 0)) {
        ctx.beginPath();
        ctx.fillStyle = options.multiKeyBackground;
        addRoundedRectPath(ctx, {
          x: outerX,
          y: colorY,
          w: boxWidth,
          h: boxHeight,
          radius: borderRadius
        });
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.beginPath();
        addRoundedRectPath(ctx, {
          x: innerX,
          y: colorY + 1,
          w: boxWidth - 2,
          h: boxHeight - 2,
          radius: borderRadius
        });
        ctx.fill();
      } else {
        ctx.fillStyle = options.multiKeyBackground;
        ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
        ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
        ctx.fillStyle = labelColor.backgroundColor;
        ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
      }
    }
    ctx.fillStyle = this.labelTextColors[i];
  }
  drawBody(pt, ctx, options) {
    const { body } = this;
    const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
    const bodyFont = toFont(options.bodyFont);
    let bodyLineHeight = bodyFont.lineHeight;
    let xLinePadding = 0;
    const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
    const fillLineOfText = function(line) {
      ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
      pt.y += bodyLineHeight + bodySpacing;
    };
    const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
    let bodyItem, textColor, lines, i, j, ilen, jlen;
    ctx.textAlign = bodyAlign;
    ctx.textBaseline = "middle";
    ctx.font = bodyFont.string;
    pt.x = getAlignedX(this, bodyAlignForCalculation, options);
    ctx.fillStyle = options.bodyColor;
    each(this.beforeBody, fillLineOfText);
    xLinePadding = displayColors && bodyAlignForCalculation !== "right" ? bodyAlign === "center" ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
    for (i = 0, ilen = body.length; i < ilen; ++i) {
      bodyItem = body[i];
      textColor = this.labelTextColors[i];
      ctx.fillStyle = textColor;
      each(bodyItem.before, fillLineOfText);
      lines = bodyItem.lines;
      if (displayColors && lines.length) {
        this._drawColorBox(ctx, pt, i, rtlHelper, options);
        bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
      }
      for (j = 0, jlen = lines.length; j < jlen; ++j) {
        fillLineOfText(lines[j]);
        bodyLineHeight = bodyFont.lineHeight;
      }
      each(bodyItem.after, fillLineOfText);
    }
    xLinePadding = 0;
    bodyLineHeight = bodyFont.lineHeight;
    each(this.afterBody, fillLineOfText);
    pt.y -= bodySpacing;
  }
  drawFooter(pt, ctx, options) {
    const footer = this.footer;
    const length = footer.length;
    let footerFont, i;
    if (length) {
      const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
      pt.x = getAlignedX(this, options.footerAlign, options);
      pt.y += options.footerMarginTop;
      ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
      ctx.textBaseline = "middle";
      footerFont = toFont(options.footerFont);
      ctx.fillStyle = options.footerColor;
      ctx.font = footerFont.string;
      for (i = 0; i < length; ++i) {
        ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
        pt.y += footerFont.lineHeight + options.footerSpacing;
      }
    }
  }
  drawBackground(pt, ctx, tooltipSize, options) {
    const { xAlign, yAlign } = this;
    const { x, y } = pt;
    const { width, height } = tooltipSize;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.beginPath();
    ctx.moveTo(x + topLeft, y);
    if (yAlign === "top") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width - topRight, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
    if (yAlign === "center" && xAlign === "right") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + width, y + height - bottomRight);
    ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
    if (yAlign === "bottom") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x + bottomLeft, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
    if (yAlign === "center" && xAlign === "left") {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }
    ctx.lineTo(x, y + topLeft);
    ctx.quadraticCurveTo(x, y, x + topLeft, y);
    ctx.closePath();
    ctx.fill();
    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }
  _updateAnimationTarget(options) {
    const chart = this.chart;
    const anims = this.$animations;
    const animX = anims && anims.x;
    const animY = anims && anims.y;
    if (animX || animY) {
      const position = positioners[options.position].call(this, this._active, this._eventPosition);
      if (!position) {
        return;
      }
      const size = this._size = getTooltipSize(this, options);
      const positionAndSize = Object.assign({}, position, this._size);
      const alignment = determineAlignment(chart, options, positionAndSize);
      const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
      if (animX._to !== point.x || animY._to !== point.y) {
        this.xAlign = alignment.xAlign;
        this.yAlign = alignment.yAlign;
        this.width = size.width;
        this.height = size.height;
        this.caretX = position.x;
        this.caretY = position.y;
        this._resolveAnimations().update(this, point);
      }
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(ctx) {
    const options = this.options.setContext(this.getContext());
    let opacity = this.opacity;
    if (!opacity) {
      return;
    }
    this._updateAnimationTarget(options);
    const tooltipSize = {
      width: this.width,
      height: this.height
    };
    const pt = {
      x: this.x,
      y: this.y
    };
    opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
    const padding = toPadding(options.padding);
    const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
    if (options.enabled && hasTooltipContent) {
      ctx.save();
      ctx.globalAlpha = opacity;
      this.drawBackground(pt, ctx, tooltipSize, options);
      overrideTextDirection(ctx, options.textDirection);
      pt.y += padding.top;
      this.drawTitle(pt, ctx, options);
      this.drawBody(pt, ctx, options);
      this.drawFooter(pt, ctx, options);
      restoreTextDirection(ctx, options.textDirection);
      ctx.restore();
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(activeElements, eventPosition) {
    const lastActive = this._active;
    const active = activeElements.map(({ datasetIndex, index }) => {
      const meta = this.chart.getDatasetMeta(datasetIndex);
      if (!meta) {
        throw new Error("Cannot find a dataset at index " + datasetIndex);
      }
      return {
        datasetIndex,
        element: meta.data[index],
        index
      };
    });
    const changed = !_elementsEqual(lastActive, active);
    const positionChanged = this._positionChanged(active, eventPosition);
    if (changed || positionChanged) {
      this._active = active;
      this._eventPosition = eventPosition;
      this._ignoreReplayEvents = true;
      this.update(true);
    }
  }
  handleEvent(e, replay, inChartArea = true) {
    if (replay && this._ignoreReplayEvents) {
      return false;
    }
    this._ignoreReplayEvents = false;
    const options = this.options;
    const lastActive = this._active || [];
    const active = this._getActiveElements(e, lastActive, replay, inChartArea);
    const positionChanged = this._positionChanged(active, e);
    const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
    if (changed) {
      this._active = active;
      if (options.enabled || options.external) {
        this._eventPosition = {
          x: e.x,
          y: e.y
        };
        this.update(true, replay);
      }
    }
    return changed;
  }
  _getActiveElements(e, lastActive, replay, inChartArea) {
    const options = this.options;
    if (e.type === "mouseout") {
      return [];
    }
    if (!inChartArea) {
      return lastActive.filter((i) => this.chart.data.datasets[i.datasetIndex] && this.chart.getDatasetMeta(i.datasetIndex).controller.getParsed(i.index) !== void 0);
    }
    const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
    if (options.reverse) {
      active.reverse();
    }
    return active;
  }
  _positionChanged(active, e) {
    const { caretX, caretY, options } = this;
    const position = positioners[options.position].call(this, active, e);
    return position !== false && (caretX !== position.x || caretY !== position.y);
  }
};
var plugin_tooltip = {
  id: "tooltip",
  _element: Tooltip,
  positioners,
  afterInit(chart, _args, options) {
    if (options) {
      chart.tooltip = new Tooltip({
        chart,
        options
      });
    }
  },
  beforeUpdate(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  reset(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    if (tooltip && tooltip._willRender()) {
      const args = {
        tooltip
      };
      if (chart.notifyPlugins("beforeTooltipDraw", {
        ...args,
        cancelable: true
      }) === false) {
        return;
      }
      tooltip.draw(chart.ctx);
      chart.notifyPlugins("afterTooltipDraw", args);
    }
  },
  afterEvent(chart, args) {
    if (chart.tooltip) {
      const useFinalPosition = args.replay;
      if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
        args.changed = true;
      }
    }
  },
  defaults: {
    enabled: true,
    external: null,
    position: "average",
    backgroundColor: "rgba(0,0,0,0.8)",
    titleColor: "#fff",
    titleFont: {
      weight: "bold"
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: "left",
    bodyColor: "#fff",
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: "left",
    footerColor: "#fff",
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: "bold"
    },
    footerAlign: "left",
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (ctx, opts) => opts.bodyFont.size,
    boxWidth: (ctx, opts) => opts.bodyFont.size,
    multiKeyBackground: "#fff",
    displayColors: true,
    boxPadding: 0,
    borderColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: "easeOutQuart"
    },
    animations: {
      numbers: {
        type: "number",
        properties: [
          "x",
          "y",
          "width",
          "height",
          "caretX",
          "caretY"
        ]
      },
      opacity: {
        easing: "linear",
        duration: 200
      }
    },
    callbacks: defaultCallbacks
  },
  defaultRoutes: {
    bodyFont: "font",
    footerFont: "font",
    titleFont: "font"
  },
  descriptors: {
    _scriptable: (name) => name !== "filter" && name !== "itemSort" && name !== "external",
    _indexable: false,
    callbacks: {
      _scriptable: false,
      _indexable: false
    },
    animation: {
      _fallback: false
    },
    animations: {
      _fallback: "animation"
    }
  },
  additionalOptionScopes: [
    "interaction"
  ]
};
var addIfString = (labels, raw, index, addedLabels) => {
  if (typeof raw === "string") {
    index = labels.push(raw) - 1;
    addedLabels.unshift({
      index,
      label: raw
    });
  } else if (isNaN(raw)) {
    index = null;
  }
  return index;
};
function findOrAddLabel(labels, raw, index, addedLabels) {
  const first = labels.indexOf(raw);
  if (first === -1) {
    return addIfString(labels, raw, index, addedLabels);
  }
  const last = labels.lastIndexOf(raw);
  return first !== last ? index : first;
}
var validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
function _getLabelForValue(value2) {
  const labels = this.getLabels();
  if (value2 >= 0 && value2 < labels.length) {
    return labels[value2];
  }
  return value2;
}
var CategoryScale = class extends Scale {
  static id = "category";
  static defaults = {
    ticks: {
      callback: _getLabelForValue
    }
  };
  constructor(cfg) {
    super(cfg);
    this._startValue = void 0;
    this._valueRange = 0;
    this._addedLabels = [];
  }
  init(scaleOptions) {
    const added = this._addedLabels;
    if (added.length) {
      const labels = this.getLabels();
      for (const { index, label } of added) {
        if (labels[index] === label) {
          labels.splice(index, 1);
        }
      }
      this._addedLabels = [];
    }
    super.init(scaleOptions);
  }
  parse(raw, index) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    const labels = this.getLabels();
    index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
    return validIndex(index, labels.length - 1);
  }
  determineDataLimits() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this.getMinMax(true);
    if (this.options.bounds === "ticks") {
      if (!minDefined) {
        min = 0;
      }
      if (!maxDefined) {
        max = this.getLabels().length - 1;
      }
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const min = this.min;
    const max = this.max;
    const offset = this.options.offset;
    const ticks = [];
    let labels = this.getLabels();
    labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
    this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
    this._startValue = this.min - (offset ? 0.5 : 0);
    for (let value2 = min; value2 <= max; value2++) {
      ticks.push({
        value: value2
      });
    }
    return ticks;
  }
  getLabelForValue(value2) {
    return _getLabelForValue.call(this, value2);
  }
  configure() {
    super.configure();
    if (!this.isHorizontal()) {
      this._reversePixels = !this._reversePixels;
    }
  }
  getPixelForValue(value2) {
    if (typeof value2 !== "number") {
      value2 = this.parse(value2);
    }
    return value2 === null ? NaN : this.getPixelForDecimal((value2 - this._startValue) / this._valueRange);
  }
  getPixelForTick(index) {
    const ticks = this.ticks;
    if (index < 0 || index > ticks.length - 1) {
      return null;
    }
    return this.getPixelForValue(ticks[index].value);
  }
  getValueForPixel(pixel) {
    return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
  }
  getBasePixel() {
    return this.bottom;
  }
};
function generateTicks$1(generationOptions, dataRange) {
  const ticks = [];
  const MIN_SPACING = 1e-14;
  const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
  const unit = step || 1;
  const maxSpaces = maxTicks - 1;
  const { min: rmin, max: rmax } = dataRange;
  const minDefined = !isNullOrUndef(min);
  const maxDefined = !isNullOrUndef(max);
  const countDefined = !isNullOrUndef(count);
  const minSpacing = (rmax - rmin) / (maxDigits + 1);
  let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
  let factor, niceMin, niceMax, numSpaces;
  if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
    return [
      {
        value: rmin
      },
      {
        value: rmax
      }
    ];
  }
  numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
  if (numSpaces > maxSpaces) {
    spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
  }
  if (!isNullOrUndef(precision)) {
    factor = Math.pow(10, precision);
    spacing = Math.ceil(spacing * factor) / factor;
  }
  if (bounds === "ticks") {
    niceMin = Math.floor(rmin / spacing) * spacing;
    niceMax = Math.ceil(rmax / spacing) * spacing;
  } else {
    niceMin = rmin;
    niceMax = rmax;
  }
  if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1e3)) {
    numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
    spacing = (max - min) / numSpaces;
    niceMin = min;
    niceMax = max;
  } else if (countDefined) {
    niceMin = minDefined ? min : niceMin;
    niceMax = maxDefined ? max : niceMax;
    numSpaces = count - 1;
    spacing = (niceMax - niceMin) / numSpaces;
  } else {
    numSpaces = (niceMax - niceMin) / spacing;
    if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1e3)) {
      numSpaces = Math.round(numSpaces);
    } else {
      numSpaces = Math.ceil(numSpaces);
    }
  }
  const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
  factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
  niceMin = Math.round(niceMin * factor) / factor;
  niceMax = Math.round(niceMax * factor) / factor;
  let j = 0;
  if (minDefined) {
    if (includeBounds && niceMin !== min) {
      ticks.push({
        value: min
      });
      if (niceMin < min) {
        j++;
      }
      if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
        j++;
      }
    } else if (niceMin < min) {
      j++;
    }
  }
  for (; j < numSpaces; ++j) {
    const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
    if (maxDefined && tickValue > max) {
      break;
    }
    ticks.push({
      value: tickValue
    });
  }
  if (maxDefined && includeBounds && niceMax !== max) {
    if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
      ticks[ticks.length - 1].value = max;
    } else {
      ticks.push({
        value: max
      });
    }
  } else if (!maxDefined || niceMax === max) {
    ticks.push({
      value: niceMax
    });
  }
  return ticks;
}
function relativeLabelSize(value2, minSpacing, { horizontal, minRotation }) {
  const rad = toRadians(minRotation);
  const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 1e-3;
  const length = 0.75 * minSpacing * ("" + value2).length;
  return Math.min(minSpacing / ratio, length);
}
var LinearScaleBase = class extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._endValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index) {
    if (isNullOrUndef(raw)) {
      return null;
    }
    if ((typeof raw === "number" || raw instanceof Number) && !isFinite(+raw)) {
      return null;
    }
    return +raw;
  }
  handleTickRangeOptions() {
    const { beginAtZero } = this.options;
    const { minDefined, maxDefined } = this.getUserBounds();
    let { min, max } = this;
    const setMin = (v) => min = minDefined ? min : v;
    const setMax = (v) => max = maxDefined ? max : v;
    if (beginAtZero) {
      const minSign = sign(min);
      const maxSign = sign(max);
      if (minSign < 0 && maxSign < 0) {
        setMax(0);
      } else if (minSign > 0 && maxSign > 0) {
        setMin(0);
      }
    }
    if (min === max) {
      let offset = max === 0 ? 1 : Math.abs(max * 0.05);
      setMax(max + offset);
      if (!beginAtZero) {
        setMin(min - offset);
      }
    }
    this.min = min;
    this.max = max;
  }
  getTickLimit() {
    const tickOpts = this.options.ticks;
    let { maxTicksLimit, stepSize } = tickOpts;
    let maxTicks;
    if (stepSize) {
      maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
      if (maxTicks > 1e3) {
        console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
        maxTicks = 1e3;
      }
    } else {
      maxTicks = this.computeTickLimit();
      maxTicksLimit = maxTicksLimit || 11;
    }
    if (maxTicksLimit) {
      maxTicks = Math.min(maxTicksLimit, maxTicks);
    }
    return maxTicks;
  }
  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }
  buildTicks() {
    const opts = this.options;
    const tickOpts = opts.ticks;
    let maxTicks = this.getTickLimit();
    maxTicks = Math.max(2, maxTicks);
    const numericGeneratorOptions = {
      maxTicks,
      bounds: opts.bounds,
      min: opts.min,
      max: opts.max,
      precision: tickOpts.precision,
      step: tickOpts.stepSize,
      count: tickOpts.count,
      maxDigits: this._maxDigits(),
      horizontal: this.isHorizontal(),
      minRotation: tickOpts.minRotation || 0,
      includeBounds: tickOpts.includeBounds !== false
    };
    const dataRange = this._range || this;
    const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  configure() {
    const ticks = this.ticks;
    let start = this.min;
    let end = this.max;
    super.configure();
    if (this.options.offset && ticks.length) {
      const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
      start -= offset;
      end += offset;
    }
    this._startValue = start;
    this._endValue = end;
    this._valueRange = end - start;
  }
  getLabelForValue(value2) {
    return formatNumber(value2, this.chart.options.locale, this.options.ticks.format);
  }
};
var LinearScale = class extends LinearScaleBase {
  static id = "linear";
  static defaults = {
    ticks: {
      callback: Ticks.formatters.numeric
    }
  };
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? min : 0;
    this.max = isNumberFinite(max) ? max : 1;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    const horizontal = this.isHorizontal();
    const length = horizontal ? this.width : this.height;
    const minRotation = toRadians(this.options.ticks.minRotation);
    const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 1e-3;
    const tickFont = this._resolveTickFontOptions(0);
    return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
  }
  getPixelForValue(value2) {
    return value2 === null ? NaN : this.getPixelForDecimal((value2 - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
  }
};
var log10Floor = (v) => Math.floor(log10(v));
var changeExponent = (v, m) => Math.pow(10, log10Floor(v) + m);
function isMajor(tickVal) {
  const remain = tickVal / Math.pow(10, log10Floor(tickVal));
  return remain === 1;
}
function steps(min, max, rangeExp) {
  const rangeStep = Math.pow(10, rangeExp);
  const start = Math.floor(min / rangeStep);
  const end = Math.ceil(max / rangeStep);
  return end - start;
}
function startExp(min, max) {
  const range = max - min;
  let rangeExp = log10Floor(range);
  while (steps(min, max, rangeExp) > 10) {
    rangeExp++;
  }
  while (steps(min, max, rangeExp) < 10) {
    rangeExp--;
  }
  return Math.min(rangeExp, log10Floor(min));
}
function generateTicks(generationOptions, { min, max }) {
  min = finiteOrDefault(generationOptions.min, min);
  const ticks = [];
  const minExp = log10Floor(min);
  let exp = startExp(min, max);
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
  const stepSize = Math.pow(10, exp);
  const base = minExp > exp ? Math.pow(10, minExp) : 0;
  const start = Math.round((min - base) * precision) / precision;
  const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
  let significand = Math.floor((start - offset) / Math.pow(10, exp));
  let value2 = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
  while (value2 < max) {
    ticks.push({
      value: value2,
      major: isMajor(value2),
      significand
    });
    if (significand >= 10) {
      significand = significand < 15 ? 15 : 20;
    } else {
      significand++;
    }
    if (significand >= 20) {
      exp++;
      significand = 2;
      precision = exp >= 0 ? 1 : precision;
    }
    value2 = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
  }
  const lastTick = finiteOrDefault(generationOptions.max, value2);
  ticks.push({
    value: lastTick,
    major: isMajor(lastTick),
    significand
  });
  return ticks;
}
var LogarithmicScale = class extends Scale {
  static id = "logarithmic";
  static defaults = {
    ticks: {
      callback: Ticks.formatters.logarithmic,
      major: {
        enabled: true
      }
    }
  };
  constructor(cfg) {
    super(cfg);
    this.start = void 0;
    this.end = void 0;
    this._startValue = void 0;
    this._valueRange = 0;
  }
  parse(raw, index) {
    const value2 = LinearScaleBase.prototype.parse.apply(this, [
      raw,
      index
    ]);
    if (value2 === 0) {
      this._zero = true;
      return void 0;
    }
    return isNumberFinite(value2) && value2 > 0 ? value2 : null;
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(true);
    this.min = isNumberFinite(min) ? Math.max(0, min) : null;
    this.max = isNumberFinite(max) ? Math.max(0, max) : null;
    if (this.options.beginAtZero) {
      this._zero = true;
    }
    if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
      this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
    }
    this.handleTickRangeOptions();
  }
  handleTickRangeOptions() {
    const { minDefined, maxDefined } = this.getUserBounds();
    let min = this.min;
    let max = this.max;
    const setMin = (v) => min = minDefined ? min : v;
    const setMax = (v) => max = maxDefined ? max : v;
    if (min === max) {
      if (min <= 0) {
        setMin(1);
        setMax(10);
      } else {
        setMin(changeExponent(min, -1));
        setMax(changeExponent(max, 1));
      }
    }
    if (min <= 0) {
      setMin(changeExponent(max, -1));
    }
    if (max <= 0) {
      setMax(changeExponent(min, 1));
    }
    this.min = min;
    this.max = max;
  }
  buildTicks() {
    const opts = this.options;
    const generationOptions = {
      min: this._userMin,
      max: this._userMax
    };
    const ticks = generateTicks(generationOptions, this);
    if (opts.bounds === "ticks") {
      _setMinAndMaxByKey(ticks, this, "value");
    }
    if (opts.reverse) {
      ticks.reverse();
      this.start = this.max;
      this.end = this.min;
    } else {
      this.start = this.min;
      this.end = this.max;
    }
    return ticks;
  }
  getLabelForValue(value2) {
    return value2 === void 0 ? "0" : formatNumber(value2, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    const start = this.min;
    super.configure();
    this._startValue = log10(start);
    this._valueRange = log10(this.max) - log10(start);
  }
  getPixelForValue(value2) {
    if (value2 === void 0 || value2 === 0) {
      value2 = this.min;
    }
    if (value2 === null || isNaN(value2)) {
      return NaN;
    }
    return this.getPixelForDecimal(value2 === this.min ? 0 : (log10(value2) - this._startValue) / this._valueRange);
  }
  getValueForPixel(pixel) {
    const decimal = this.getDecimalForPixel(pixel);
    return Math.pow(10, this._startValue + decimal * this._valueRange);
  }
};
function getTickBackdropHeight(opts) {
  const tickOpts = opts.ticks;
  if (tickOpts.display && opts.display) {
    const padding = toPadding(tickOpts.backdropPadding);
    return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
  }
  return 0;
}
function measureLabelSize(ctx, font, label) {
  label = isArray(label) ? label : [
    label
  ];
  return {
    w: _longestText(ctx, font.string, label),
    h: label.length * font.lineHeight
  };
}
function determineLimits(angle, pos, size, min, max) {
  if (angle === min || angle === max) {
    return {
      start: pos - size / 2,
      end: pos + size / 2
    };
  } else if (angle < min || angle > max) {
    return {
      start: pos - size,
      end: pos
    };
  }
  return {
    start: pos,
    end: pos + size
  };
}
function fitWithPointLabels(scale) {
  const orig = {
    l: scale.left + scale._padding.left,
    r: scale.right - scale._padding.right,
    t: scale.top + scale._padding.top,
    b: scale.bottom - scale._padding.bottom
  };
  const limits = Object.assign({}, orig);
  const labelSizes = [];
  const padding = [];
  const valueCount = scale._pointLabels.length;
  const pointLabelOpts = scale.options.pointLabels;
  const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
  for (let i = 0; i < valueCount; i++) {
    const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
    padding[i] = opts.padding;
    const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
    const plFont = toFont(opts.font);
    const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
    labelSizes[i] = textSize;
    const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
    const angle = Math.round(toDegrees(angleRadians));
    const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
    const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
    updateLimits(limits, orig, angleRadians, hLimits, vLimits);
  }
  scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
  scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
  const sin = Math.abs(Math.sin(angle));
  const cos = Math.abs(Math.cos(angle));
  let x = 0;
  let y = 0;
  if (hLimits.start < orig.l) {
    x = (orig.l - hLimits.start) / sin;
    limits.l = Math.min(limits.l, orig.l - x);
  } else if (hLimits.end > orig.r) {
    x = (hLimits.end - orig.r) / sin;
    limits.r = Math.max(limits.r, orig.r + x);
  }
  if (vLimits.start < orig.t) {
    y = (orig.t - vLimits.start) / cos;
    limits.t = Math.min(limits.t, orig.t - y);
  } else if (vLimits.end > orig.b) {
    y = (vLimits.end - orig.b) / cos;
    limits.b = Math.max(limits.b, orig.b + y);
  }
}
function createPointLabelItem(scale, index, itemOpts) {
  const outerDistance = scale.drawingArea;
  const { extra, additionalAngle, padding, size } = itemOpts;
  const pointLabelPosition = scale.getPointPosition(index, outerDistance + extra + padding, additionalAngle);
  const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
  const y = yForAngle(pointLabelPosition.y, size.h, angle);
  const textAlign = getTextAlignForAngle(angle);
  const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
  return {
    visible: true,
    x: pointLabelPosition.x,
    y,
    textAlign,
    left,
    top: y,
    right: left + size.w,
    bottom: y + size.h
  };
}
function isNotOverlapped(item, area) {
  if (!area) {
    return true;
  }
  const { left, top, right, bottom } = item;
  const apexesInArea = _isPointInArea({
    x: left,
    y: top
  }, area) || _isPointInArea({
    x: left,
    y: bottom
  }, area) || _isPointInArea({
    x: right,
    y: top
  }, area) || _isPointInArea({
    x: right,
    y: bottom
  }, area);
  return !apexesInArea;
}
function buildPointLabelItems(scale, labelSizes, padding) {
  const items = [];
  const valueCount = scale._pointLabels.length;
  const opts = scale.options;
  const { centerPointLabels, display } = opts.pointLabels;
  const itemOpts = {
    extra: getTickBackdropHeight(opts) / 2,
    additionalAngle: centerPointLabels ? PI / valueCount : 0
  };
  let area;
  for (let i = 0; i < valueCount; i++) {
    itemOpts.padding = padding[i];
    itemOpts.size = labelSizes[i];
    const item = createPointLabelItem(scale, i, itemOpts);
    items.push(item);
    if (display === "auto") {
      item.visible = isNotOverlapped(item, area);
      if (item.visible) {
        area = item;
      }
    }
  }
  return items;
}
function getTextAlignForAngle(angle) {
  if (angle === 0 || angle === 180) {
    return "center";
  } else if (angle < 180) {
    return "left";
  }
  return "right";
}
function leftForTextAlign(x, w, align) {
  if (align === "right") {
    x -= w;
  } else if (align === "center") {
    x -= w / 2;
  }
  return x;
}
function yForAngle(y, h, angle) {
  if (angle === 90 || angle === 270) {
    y -= h / 2;
  } else if (angle > 270 || angle < 90) {
    y -= h;
  }
  return y;
}
function drawPointLabelBox(ctx, opts, item) {
  const { left, top, right, bottom } = item;
  const { backdropColor } = opts;
  if (!isNullOrUndef(backdropColor)) {
    const borderRadius = toTRBLCorners(opts.borderRadius);
    const padding = toPadding(opts.backdropPadding);
    ctx.fillStyle = backdropColor;
    const backdropLeft = left - padding.left;
    const backdropTop = top - padding.top;
    const backdropWidth = right - left + padding.width;
    const backdropHeight = bottom - top + padding.height;
    if (Object.values(borderRadius).some((v) => v !== 0)) {
      ctx.beginPath();
      addRoundedRectPath(ctx, {
        x: backdropLeft,
        y: backdropTop,
        w: backdropWidth,
        h: backdropHeight,
        radius: borderRadius
      });
      ctx.fill();
    } else {
      ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
    }
  }
}
function drawPointLabels(scale, labelCount) {
  const { ctx, options: { pointLabels } } = scale;
  for (let i = labelCount - 1; i >= 0; i--) {
    const item = scale._pointLabelItems[i];
    if (!item.visible) {
      continue;
    }
    const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
    drawPointLabelBox(ctx, optsAtIndex, item);
    const plFont = toFont(optsAtIndex.font);
    const { x, y, textAlign } = item;
    renderText(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
      color: optsAtIndex.color,
      textAlign,
      textBaseline: "middle"
    });
  }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
  const { ctx } = scale;
  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);
    for (let i = 1; i < labelCount; i++) {
      pointPosition = scale.getPointPosition(i, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;
  const { color: color2, lineWidth } = gridLineOpts;
  if (!circular && !labelCount || !color2 || !lineWidth || radius < 0) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = color2;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(borderOpts.dash || []);
  ctx.lineDashOffset = borderOpts.dashOffset;
  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
function createPointLabelContext(parent, index, label) {
  return createContext(parent, {
    label,
    index,
    type: "pointLabel"
  });
}
var RadialLinearScale = class extends LinearScaleBase {
  static id = "radialLinear";
  static defaults = {
    display: true,
    animate: true,
    position: "chartArea",
    angleLines: {
      display: true,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0
    },
    grid: {
      circular: false
    },
    startAngle: 0,
    ticks: {
      showLabelBackdrop: true,
      callback: Ticks.formatters.numeric
    },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: true,
      font: {
        size: 10
      },
      callback(label) {
        return label;
      },
      padding: 5,
      centerPointLabels: false
    }
  };
  static defaultRoutes = {
    "angleLines.color": "borderColor",
    "pointLabels.color": "color",
    "ticks.color": "color"
  };
  static descriptors = {
    angleLines: {
      _fallback: "grid"
    }
  };
  constructor(cfg) {
    super(cfg);
    this.xCenter = void 0;
    this.yCenter = void 0;
    this.drawingArea = void 0;
    this._pointLabels = [];
    this._pointLabelItems = [];
  }
  setDimensions() {
    const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
    const w = this.width = this.maxWidth - padding.width;
    const h = this.height = this.maxHeight - padding.height;
    this.xCenter = Math.floor(this.left + w / 2 + padding.left);
    this.yCenter = Math.floor(this.top + h / 2 + padding.top);
    this.drawingArea = Math.floor(Math.min(w, h) / 2);
  }
  determineDataLimits() {
    const { min, max } = this.getMinMax(false);
    this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
    this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
    this.handleTickRangeOptions();
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }
  generateTickLabels(ticks) {
    LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
    this._pointLabels = this.getLabels().map((value2, index) => {
      const label = callback(this.options.pointLabels.callback, [
        value2,
        index
      ], this);
      return label || label === 0 ? label : "";
    }).filter((v, i) => this.chart.getDataVisibility(i));
  }
  fit() {
    const opts = this.options;
    if (opts.display && opts.pointLabels.display) {
      fitWithPointLabels(this);
    } else {
      this.setCenterPoint(0, 0, 0, 0);
    }
  }
  setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
    this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
    this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
    this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
  }
  getIndexAngle(index) {
    const angleMultiplier = TAU / (this._pointLabels.length || 1);
    const startAngle = this.options.startAngle || 0;
    return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
  }
  getDistanceFromCenterForValue(value2) {
    if (isNullOrUndef(value2)) {
      return NaN;
    }
    const scalingFactor = this.drawingArea / (this.max - this.min);
    if (this.options.reverse) {
      return (this.max - value2) * scalingFactor;
    }
    return (value2 - this.min) * scalingFactor;
  }
  getValueForDistanceFromCenter(distance) {
    if (isNullOrUndef(distance)) {
      return NaN;
    }
    const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
  }
  getPointLabelContext(index) {
    const pointLabels = this._pointLabels || [];
    if (index >= 0 && index < pointLabels.length) {
      const pointLabel = pointLabels[index];
      return createPointLabelContext(this.getContext(), index, pointLabel);
    }
  }
  getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
    const angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
    return {
      x: Math.cos(angle) * distanceFromCenter + this.xCenter,
      y: Math.sin(angle) * distanceFromCenter + this.yCenter,
      angle
    };
  }
  getPointPositionForValue(index, value2) {
    return this.getPointPosition(index, this.getDistanceFromCenterForValue(value2));
  }
  getBasePosition(index) {
    return this.getPointPositionForValue(index || 0, this.getBaseValue());
  }
  getPointLabelPosition(index) {
    const { left, top, right, bottom } = this._pointLabelItems[index];
    return {
      left,
      top,
      right,
      bottom
    };
  }
  drawBackground() {
    const { backgroundColor, grid: { circular } } = this.options;
    if (backgroundColor) {
      const ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
  }
  drawGrid() {
    const ctx = this.ctx;
    const opts = this.options;
    const { angleLines, grid, border } = opts;
    const labelCount = this._pointLabels.length;
    let i, offset, position;
    if (opts.pointLabels.display) {
      drawPointLabels(this, labelCount);
    }
    if (grid.display) {
      this.ticks.forEach((tick, index) => {
        if (index !== 0 || index === 0 && this.min < 0) {
          offset = this.getDistanceFromCenterForValue(tick.value);
          const context = this.getContext(index);
          const optsAtIndex = grid.setContext(context);
          const optsAtIndexBorder = border.setContext(context);
          drawRadiusLine(this, optsAtIndex, offset, labelCount, optsAtIndexBorder);
        }
      });
    }
    if (angleLines.display) {
      ctx.save();
      for (i = labelCount - 1; i >= 0; i--) {
        const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
        const { color: color2, lineWidth } = optsAtIndex;
        if (!lineWidth || !color2) {
          continue;
        }
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color2;
        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;
        offset = this.getDistanceFromCenterForValue(opts.reverse ? this.min : this.max);
        position = this.getPointPosition(i, offset);
        ctx.beginPath();
        ctx.moveTo(this.xCenter, this.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  drawBorder() {
  }
  drawLabels() {
    const ctx = this.ctx;
    const opts = this.options;
    const tickOpts = opts.ticks;
    if (!tickOpts.display) {
      return;
    }
    const startAngle = this.getIndexAngle(0);
    let offset, width;
    ctx.save();
    ctx.translate(this.xCenter, this.yCenter);
    ctx.rotate(startAngle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.ticks.forEach((tick, index) => {
      if (index === 0 && this.min >= 0 && !opts.reverse) {
        return;
      }
      const optsAtIndex = tickOpts.setContext(this.getContext(index));
      const tickFont = toFont(optsAtIndex.font);
      offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
      if (optsAtIndex.showLabelBackdrop) {
        ctx.font = tickFont.string;
        width = ctx.measureText(tick.label).width;
        ctx.fillStyle = optsAtIndex.backdropColor;
        const padding = toPadding(optsAtIndex.backdropPadding);
        ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
      }
      renderText(ctx, tick.label, 0, -offset, tickFont, {
        color: optsAtIndex.color,
        strokeColor: optsAtIndex.textStrokeColor,
        strokeWidth: optsAtIndex.textStrokeWidth
      });
    });
    ctx.restore();
  }
  drawTitle() {
  }
};
var INTERVALS = {
  millisecond: {
    common: true,
    size: 1,
    steps: 1e3
  },
  second: {
    common: true,
    size: 1e3,
    steps: 60
  },
  minute: {
    common: true,
    size: 6e4,
    steps: 60
  },
  hour: {
    common: true,
    size: 36e5,
    steps: 24
  },
  day: {
    common: true,
    size: 864e5,
    steps: 30
  },
  week: {
    common: false,
    size: 6048e5,
    steps: 4
  },
  month: {
    common: true,
    size: 2628e6,
    steps: 12
  },
  quarter: {
    common: false,
    size: 7884e6,
    steps: 4
  },
  year: {
    common: true,
    size: 3154e7
  }
};
var UNITS = /* @__PURE__ */ Object.keys(INTERVALS);
function sorter(a, b) {
  return a - b;
}
function parse(scale, input) {
  if (isNullOrUndef(input)) {
    return null;
  }
  const adapter = scale._adapter;
  const { parser, round: round3, isoWeekday } = scale._parseOpts;
  let value2 = input;
  if (typeof parser === "function") {
    value2 = parser(value2);
  }
  if (!isNumberFinite(value2)) {
    value2 = typeof parser === "string" ? adapter.parse(value2, parser) : adapter.parse(value2);
  }
  if (value2 === null) {
    return null;
  }
  if (round3) {
    value2 = round3 === "week" && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value2, "isoWeek", isoWeekday) : adapter.startOf(value2, round3);
  }
  return +value2;
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
  const ilen = UNITS.length;
  for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
    const interval = INTERVALS[UNITS[i]];
    const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
      return UNITS[i];
    }
  }
  return UNITS[ilen - 1];
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
  for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
    const unit = UNITS[i];
    if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
      return unit;
    }
  }
  return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
function determineMajorUnit(unit) {
  for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
    if (INTERVALS[UNITS[i]].common) {
      return UNITS[i];
    }
  }
}
function addTick(ticks, time, timestamps) {
  if (!timestamps) {
    ticks[time] = true;
  } else if (timestamps.length) {
    const { lo, hi } = _lookup(timestamps, time);
    const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
    ticks[timestamp] = true;
  }
}
function setMajorTicks(scale, ticks, map3, majorUnit) {
  const adapter = scale._adapter;
  const first = +adapter.startOf(ticks[0].value, majorUnit);
  const last = ticks[ticks.length - 1].value;
  let major, index;
  for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
    index = map3[major];
    if (index >= 0) {
      ticks[index].major = true;
    }
  }
  return ticks;
}
function ticksFromTimestamps(scale, values, majorUnit) {
  const ticks = [];
  const map3 = {};
  const ilen = values.length;
  let i, value2;
  for (i = 0; i < ilen; ++i) {
    value2 = values[i];
    map3[value2] = i;
    ticks.push({
      value: value2,
      major: false
    });
  }
  return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map3, majorUnit);
}
var TimeScale = class extends Scale {
  static id = "time";
  static defaults = {
    bounds: "data",
    adapters: {},
    time: {
      parser: false,
      unit: false,
      round: false,
      isoWeekday: false,
      minUnit: "millisecond",
      displayFormats: {}
    },
    ticks: {
      source: "auto",
      callback: false,
      major: {
        enabled: false
      }
    }
  };
  constructor(props) {
    super(props);
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
    this._unit = "day";
    this._majorUnit = void 0;
    this._offsets = {};
    this._normalized = false;
    this._parseOpts = void 0;
  }
  init(scaleOpts, opts = {}) {
    const time = scaleOpts.time || (scaleOpts.time = {});
    const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
    adapter.init(opts);
    mergeIf(time.displayFormats, adapter.formats());
    this._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday
    };
    super.init(scaleOpts);
    this._normalized = opts.normalized;
  }
  parse(raw, index) {
    if (raw === void 0) {
      return null;
    }
    return parse(this, raw);
  }
  beforeLayout() {
    super.beforeLayout();
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }
  determineDataLimits() {
    const options = this.options;
    const adapter = this._adapter;
    const unit = options.time.unit || "day";
    let { min, max, minDefined, maxDefined } = this.getUserBounds();
    function _applyBounds(bounds) {
      if (!minDefined && !isNaN(bounds.min)) {
        min = Math.min(min, bounds.min);
      }
      if (!maxDefined && !isNaN(bounds.max)) {
        max = Math.max(max, bounds.max);
      }
    }
    if (!minDefined || !maxDefined) {
      _applyBounds(this._getLabelBounds());
      if (options.bounds !== "ticks" || options.ticks.source !== "labels") {
        _applyBounds(this.getMinMax(false));
      }
    }
    min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
    max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
    this.min = Math.min(min, max - 1);
    this.max = Math.max(min + 1, max);
  }
  _getLabelBounds() {
    const arr = this.getLabelTimestamps();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    if (arr.length) {
      min = arr[0];
      max = arr[arr.length - 1];
    }
    return {
      min,
      max
    };
  }
  buildTicks() {
    const options = this.options;
    const timeOpts = options.time;
    const tickOpts = options.ticks;
    const timestamps = tickOpts.source === "labels" ? this.getLabelTimestamps() : this._generate();
    if (options.bounds === "ticks" && timestamps.length) {
      this.min = this._userMin || timestamps[0];
      this.max = this._userMax || timestamps[timestamps.length - 1];
    }
    const min = this.min;
    const max = this.max;
    const ticks = _filterBetween(timestamps, min, max);
    this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
    this._majorUnit = !tickOpts.major.enabled || this._unit === "year" ? void 0 : determineMajorUnit(this._unit);
    this.initOffsets(timestamps);
    if (options.reverse) {
      ticks.reverse();
    }
    return ticksFromTimestamps(this, ticks, this._majorUnit);
  }
  afterAutoSkip() {
    if (this.options.offsetAfterAutoskip) {
      this.initOffsets(this.ticks.map((tick) => +tick.value));
    }
  }
  initOffsets(timestamps = []) {
    let start = 0;
    let end = 0;
    let first, last;
    if (this.options.offset && timestamps.length) {
      first = this.getDecimalForValue(timestamps[0]);
      if (timestamps.length === 1) {
        start = 1 - first;
      } else {
        start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
      }
      last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
      if (timestamps.length === 1) {
        end = last;
      } else {
        end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
      }
    }
    const limit = timestamps.length < 3 ? 0.5 : 0.25;
    start = _limitValue(start, 0, limit);
    end = _limitValue(end, 0, limit);
    this._offsets = {
      start,
      end,
      factor: 1 / (start + 1 + end)
    };
  }
  _generate() {
    const adapter = this._adapter;
    const min = this.min;
    const max = this.max;
    const options = this.options;
    const timeOpts = options.time;
    const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
    const stepSize = valueOrDefault(options.ticks.stepSize, 1);
    const weekday = minor === "week" ? timeOpts.isoWeekday : false;
    const hasWeekday = isNumber(weekday) || weekday === true;
    const ticks = {};
    let first = min;
    let time, count;
    if (hasWeekday) {
      first = +adapter.startOf(first, "isoWeek", weekday);
    }
    first = +adapter.startOf(first, hasWeekday ? "day" : minor);
    if (adapter.diff(max, min, minor) > 1e5 * stepSize) {
      throw new Error(min + " and " + max + " are too far apart with stepSize of " + stepSize + " " + minor);
    }
    const timestamps = options.ticks.source === "data" && this.getDataTimestamps();
    for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
      addTick(ticks, time, timestamps);
    }
    if (time === max || options.bounds === "ticks" || count === 1) {
      addTick(ticks, time, timestamps);
    }
    return Object.keys(ticks).sort(sorter).map((x) => +x);
  }
  getLabelForValue(value2) {
    const adapter = this._adapter;
    const timeOpts = this.options.time;
    if (timeOpts.tooltipFormat) {
      return adapter.format(value2, timeOpts.tooltipFormat);
    }
    return adapter.format(value2, timeOpts.displayFormats.datetime);
  }
  format(value2, format) {
    const options = this.options;
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const fmt2 = format || formats[unit];
    return this._adapter.format(value2, fmt2);
  }
  _tickFormatFunction(time, index, ticks, format) {
    const options = this.options;
    const formatter = options.ticks.callback;
    if (formatter) {
      return callback(formatter, [
        time,
        index,
        ticks
      ], this);
    }
    const formats = options.time.displayFormats;
    const unit = this._unit;
    const majorUnit = this._majorUnit;
    const minorFormat = unit && formats[unit];
    const majorFormat = majorUnit && formats[majorUnit];
    const tick = ticks[index];
    const major = majorUnit && majorFormat && tick && tick.major;
    return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
  }
  generateTickLabels(ticks) {
    let i, ilen, tick;
    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      tick.label = this._tickFormatFunction(tick.value, i, ticks);
    }
  }
  getDecimalForValue(value2) {
    return value2 === null ? NaN : (value2 - this.min) / (this.max - this.min);
  }
  getPixelForValue(value2) {
    const offsets = this._offsets;
    const pos = this.getDecimalForValue(value2);
    return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return this.min + pos * (this.max - this.min);
  }
  _getLabelSize(label) {
    const ticksOpts = this.options.ticks;
    const tickLabelWidth = this.ctx.measureText(label).width;
    const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
    const cosRotation = Math.cos(angle);
    const sinRotation = Math.sin(angle);
    const tickFontSize = this._resolveTickFontOptions(0).size;
    return {
      w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
      h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
    };
  }
  _getLabelCapacity(exampleTime) {
    const timeOpts = this.options.time;
    const displayFormats = timeOpts.displayFormats;
    const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
    const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
      exampleTime
    ], this._majorUnit), format);
    const size = this._getLabelSize(exampleLabel);
    const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
    return capacity > 0 ? capacity : 1;
  }
  getDataTimestamps() {
    let timestamps = this._cache.data || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const metas = this.getMatchingVisibleMetas();
    if (this._normalized && metas.length) {
      return this._cache.data = metas[0].controller.getAllParsedValues(this);
    }
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
    }
    return this._cache.data = this.normalize(timestamps);
  }
  getLabelTimestamps() {
    const timestamps = this._cache.labels || [];
    let i, ilen;
    if (timestamps.length) {
      return timestamps;
    }
    const labels = this.getLabels();
    for (i = 0, ilen = labels.length; i < ilen; ++i) {
      timestamps.push(parse(this, labels[i]));
    }
    return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
  }
  normalize(values) {
    return _arrayUnique(values.sort(sorter));
  }
};
function interpolate2(table, val, reverse) {
  let lo = 0;
  let hi = table.length - 1;
  let prevSource, nextSource, prevTarget, nextTarget;
  if (reverse) {
    if (val >= table[lo].pos && val <= table[hi].pos) {
      ({ lo, hi } = _lookupByKey(table, "pos", val));
    }
    ({ pos: prevSource, time: prevTarget } = table[lo]);
    ({ pos: nextSource, time: nextTarget } = table[hi]);
  } else {
    if (val >= table[lo].time && val <= table[hi].time) {
      ({ lo, hi } = _lookupByKey(table, "time", val));
    }
    ({ time: prevSource, pos: prevTarget } = table[lo]);
    ({ time: nextSource, pos: nextTarget } = table[hi]);
  }
  const span = nextSource - prevSource;
  return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
var TimeSeriesScale = class extends TimeScale {
  static id = "timeseries";
  static defaults = TimeScale.defaults;
  constructor(props) {
    super(props);
    this._table = [];
    this._minPos = void 0;
    this._tableRange = void 0;
  }
  initOffsets() {
    const timestamps = this._getTimestampsForTable();
    const table = this._table = this.buildLookupTable(timestamps);
    this._minPos = interpolate2(table, this.min);
    this._tableRange = interpolate2(table, this.max) - this._minPos;
    super.initOffsets(timestamps);
  }
  buildLookupTable(timestamps) {
    const { min, max } = this;
    const items = [];
    const table = [];
    let i, ilen, prev, curr, next;
    for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
      curr = timestamps[i];
      if (curr >= min && curr <= max) {
        items.push(curr);
      }
    }
    if (items.length < 2) {
      return [
        {
          time: min,
          pos: 0
        },
        {
          time: max,
          pos: 1
        }
      ];
    }
    for (i = 0, ilen = items.length; i < ilen; ++i) {
      next = items[i + 1];
      prev = items[i - 1];
      curr = items[i];
      if (Math.round((next + prev) / 2) !== curr) {
        table.push({
          time: curr,
          pos: i / (ilen - 1)
        });
      }
    }
    return table;
  }
  _generate() {
    const min = this.min;
    const max = this.max;
    let timestamps = super.getDataTimestamps();
    if (!timestamps.includes(min) || !timestamps.length) {
      timestamps.splice(0, 0, min);
    }
    if (!timestamps.includes(max) || timestamps.length === 1) {
      timestamps.push(max);
    }
    return timestamps.sort((a, b) => a - b);
  }
  _getTimestampsForTable() {
    let timestamps = this._cache.all || [];
    if (timestamps.length) {
      return timestamps;
    }
    const data = this.getDataTimestamps();
    const label = this.getLabelTimestamps();
    if (data.length && label.length) {
      timestamps = this.normalize(data.concat(label));
    } else {
      timestamps = data.length ? data : label;
    }
    timestamps = this._cache.all = timestamps;
    return timestamps;
  }
  getDecimalForValue(value2) {
    return (interpolate2(this._table, value2) - this._minPos) / this._tableRange;
  }
  getValueForPixel(pixel) {
    const offsets = this._offsets;
    const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return interpolate2(this._table, decimal * this._tableRange + this._minPos, true);
  }
};

// src/client/canvas.ts
var VARS = {
  ink: "--chart-ink",
  label: "--chart-label",
  muted: "--chart-muted",
  grid: "--chart-grid",
  axisGrid: "--chart-axis-grid",
  hollow: "--chart-hollow",
  tooltipBg: "--chart-tooltip-bg",
  tooltipInk: "--chart-tooltip-ink",
  series1: "--chart-series-1",
  series2: "--chart-series-2",
  series3: "--chart-series-3",
  series4: "--chart-series-4",
  series5: "--chart-series-5",
  series6: "--chart-series-6",
  series7: "--chart-series-7"
};
var FALLBACK = {
  ink: "#111827",
  label: "#4b5563",
  muted: "#6b7280",
  grid: "#e5e5e5",
  axisGrid: "rgba(17, 24, 39, 0.06)",
  hollow: "#ffffff",
  tooltipBg: "rgba(17, 24, 39, 0.92)",
  tooltipInk: "#ffffff",
  series1: "#5C97C5",
  series2: "#357AB0",
  series3: "#2A6B9C",
  series4: "#1B5C92",
  series5: "#124A78",
  series6: "#0A3A63",
  series7: "#062844"
};
var ctx2d = document.createElement("canvas").getContext("2d");
function normalise(css, fallback) {
  if (!ctx2d) return fallback;
  ctx2d.fillStyle = fallback;
  ctx2d.fillStyle = css;
  return typeof ctx2d.fillStyle === "string" ? ctx2d.fillStyle : fallback;
}
var cache = null;
function read() {
  const out = {};
  const probe2 = document.createElement("span");
  probe2.setAttribute("aria-hidden", "true");
  probe2.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
  (document.body ?? document.documentElement).append(probe2);
  for (const key of Object.keys(VARS)) {
    probe2.style.color = `var(${VARS[key]})`;
    out[key] = normalise(getComputedStyle(probe2).color, FALLBACK[key]);
  }
  probe2.remove();
  return out;
}
var value = (key) => (cache ??= read(), cache[key]);
var SERIES = [
  "series1",
  "series2",
  "series3",
  "series4",
  "series5",
  "series6",
  "series7"
].map((k) => value(k));
function refreshTheme() {
  cache = null;
}
var THEME = {
  get ink() {
    return value("ink");
  },
  get label() {
    return value("label");
  },
  get muted() {
    return value("muted");
  },
  get grid() {
    return value("grid");
  },
  get axisGrid() {
    return value("axisGrid");
  },
  get hollow() {
    return value("hollow");
  },
  get tooltipBg() {
    return value("tooltipBg");
  },
  get tooltipInk() {
    return value("tooltipInk");
  },
  dim: 0.45
  // was 0.18 — ≈1.3:1 against both modes (WCAG 1.4.1)
};
var SERIES_KEYS = [
  "series1",
  "series2",
  "series3",
  "series4",
  "series5",
  "series6",
  "series7"
];
function seriesColor(i) {
  const last = SERIES_KEYS.length - 1;
  return value(SERIES_KEYS[Math.min(Math.max(i, 0), last)]);
}
var DASHES = [
  [],
  [6, 3],
  [2, 3],
  [8, 3, 2, 3],
  [1.5, 3],
  [10, 4],
  [4, 3]
];
var RAMP = DASHES.map((dash, i) => ({
  get color() {
    return seriesColor(i);
  },
  dash
}));
function alpha2(hex2, a) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex2);
  if (!m) throw new Error(`alpha() expects #rrggbb, got "${hex2}"`);
  const n = Number.parseInt(m[1], 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
}
function segIndex(ctx, which) {
  const given = which === 0 ? ctx.p0DataIndex : ctx.p1DataIndex;
  if (typeof given === "number" && Number.isFinite(given)) {
    return Math.round(given);
  }
  const pt = which === 0 ? ctx.p0 : ctx.p1;
  const parsed = pt?.parsed?.x;
  if (typeof parsed === "number" && Number.isInteger(parsed)) return parsed;
  const px = pt?.x;
  const axis = ctx.chart?.options?.indexAxis === "y" ? "y" : "x";
  const scale = ctx.chart?.scales?.[axis];
  if (typeof px === "number" && typeof scale?.getValueForPixel === "function") {
    const v = scale.getValueForPixel(px);
    if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  }
  return void 0;
}
var gapSegment = (slots = 1, dash = [6, 4]) => ({
  borderDash: (ctx) => {
    const i0 = segIndex(ctx, 0);
    const i1 = segIndex(ctx, 1);
    if (i0 === void 0 || i1 === void 0) return void 0;
    return Math.abs(i1 - i0) > slots + 0.01 ? dash : void 0;
  }
});
var live = /* @__PURE__ */ new Set();
var track = (chart) => (live.add(chart), chart);
function destroyAll() {
  for (const chart of live) {
    try {
      chart.destroy();
    } catch (err) {
      console.error("[chart] destroy failed", err);
    }
  }
  live.clear();
}

// src/client/model.ts
var METRICS = ["p", "a", "f", "i"];
var METRIC_OF = {
  p: "turnout",
  a: "arrests",
  f: "forcesInjured",
  i: "protesterInjured"
};
var DETACHED = /* @__PURE__ */ new Set(["r", "p", "e", "c"]);
var isDetached = (q) => q != null && q !== "n" && DETACHED.has(q);
var bandOf = (b) => typeof b === "number" ? [b, b] : b;
var midOf = (b) => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

// src/client/data.ts
var NIL = { v: null, band: null, q: null, note: null, detach: false };
var START = "2026-09-15";
var END = "2026-11-11";
var utc = (s) => /* @__PURE__ */ new Date(`${s}T00:00:00Z`);
var iso = (d) => d.toISOString().slice(0, 10);
var addDays = (isoDate, n) => {
  const d = /* @__PURE__ */ new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
var mondayOf = (isoDate) => {
  const d = /* @__PURE__ */ new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
};
function eachDay(start, end) {
  const out = [];
  const stop = utc(end);
  for (const d = utc(start); d <= stop; d.setUTCDate(d.getUTCDate() + 1))
    out.push(iso(d));
  return out;
}
var DATES = eachDay(START, END);
var WEEKS = (() => {
  const byKey = /* @__PURE__ */ new Map();
  for (const d of DATES) {
    const k = mondayOf(d);
    const list = byKey.get(k);
    if (list) list.push(d);
    else byKey.set(k, [d]);
  }
  return [...byKey].sort(([a], [b]) => a.localeCompare(b)).map(([key, dates]) => {
    const end = addDays(key, 6);
    return { key, end, dates, touchesEdge: key < START || end > END };
  });
})();
var HOLIDAY_START = "2026-10-17";
var HOLIDAY_END = "2026-11-01";
var HOLIDAY_DASH = [1.5, 3];
var weekTouchesHoliday = (weekStart) => weekStart <= HOLIDAY_END && addDays(weekStart, 6) >= HOLIDAY_START;
var weekInHoliday = (weekStart) => weekStart >= HOLIDAY_START && addDays(weekStart, 6) <= HOLIDAY_END;
function dailyHolidaySegment(a, b) {
  const dateOf = (v) => {
    if (typeof v === "string") return v;
    if (typeof v === "number") return DATES[Math.round(v)];
    return void 0;
  };
  const da = dateOf(a);
  const db = dateOf(b);
  if (!da || !db) return false;
  return da <= HOLIDAY_END && db >= HOLIDAY_START;
}
function weeklyHolidaySegment(a, b) {
  if (a === void 0 || a === null || b === void 0 || b === null)
    return false;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  for (let i = lo + 1; i < hi; i++) {
    const wk = WEEKS[i];
    if (wk && weekInHoliday(wk.key)) return true;
  }
  return false;
}
var FACTS = {
  /* ── School blockades ─────────────────────────────────────────────────
         Metric: establishments where pupils could not attend normally —
         blocked, or closed by decision. Band = official count (floor) to
         union count (ceiling); the union's "à l'arrêt" also counts
         administratively closed schools, so the ceiling is an upper bound.
  
         "x" = a wider measure than blockades (établissements perturbés,
         cours suspendus, établissements fermés) — the only figure published
         that day. "r" = regional count. "f" = publisher said "more than".
  
         Days with no published count stay empty. During the Toussaint
         holiday (17 Oct – 1 Nov) no lycée was in session, so the metric did
         not exist: those days are empty and the connector is dotted.       */
  /* ── The movement's first fortnight ─────────────────────────────────────
         The wave began after the rentrée: teachers and parents had been on
         strike in Mayotte since 31 August (lycée Nord d'Acoua, blocked for
         five weeks); in mainland France the lycée Théodore-Monod at Le Rheu
         was blocked on 7 September, the lycée Queneau at Villeneuve-d'Ascq on
         14 September and the lycée Victor-Hugo at Caen on 15 September. The
         window opens on 15 September at the user's request, so the 7 and 14
         September blockades fall outside it.
  
         NONE of 15–27 September carries a published turnout, arrest, injury or
         damage figure, so the week of 14–20 September is empty rather than
         estimated. The one exception is the Paris area on 25 September. */
  "2026-09-15": { blockades: { low: 1, high: 1 } },
  "2026-09-19": { blockades: { low: 1, high: 1 } },
  "2026-09-23": { blockades: { low: 10, high: 10, q: "r" } },
  /* Fri 25 Sep — the Île-de-France centre of gravity: ~60 franciliens
     lycées disrupted over 24–25 Sep, mainly Seine-Saint-Denis and
     Val-de-Marne (Saint-Denis, Sarcelles, Gonesse, Stains, Saint-Ouen,
     Rosny-sous-Bois, La Courneuve); the Créteil rectorat counted a
     "grosse dizaine" of new blockades that day.
     21 interpellations by noon by the Préfecture de Police, in connection
     with the Paris-area mobilisations — PARIS ONLY, hence "r". The
     rectorat noted gatherings, crowd movements and material damage
     without quantifying them. */
  "2026-09-25": {
    arrests: { low: 21, high: 21, q: "r" }
  },
  /* Mon 28 Sep — the movement goes national: actions in Marseille, Lille,
     the Rhône, the Var and the Alpes-Maritimes. Interior Ministry: 180
     establishments perturbed, 27 of them totally blocked, 164
     interpellations that day.
     First serious injury of the movement: a 14-year-old hit in the face
     by a police projectile at the lycée professionnel Château-d'Epluches,
     Saint-Ouen-l'Aumône (Val-d'Oise); the IGPN was seized. Flagged "f":
     one documented casualty is a minimum, not a count. */
  "2026-09-28": {
    arrests: { low: 164, high: 164 },
    protesterInjured: { low: 1, high: 1, q: "f" },
    blockades: { low: 27, high: 27 }
  },
  /* Tue 29 Sep — national public-service mobilisation day, which the USL
     called students to join; it is the movement's Act I.
     Education ministry, end of day: 416 establishments touched since the
     morning, 338 still affected, 45 blocked; Le Monde counted actions at
     nearly 410 establishments; the USL claimed 400 blocked out of ~3,700
     in France. 440 interpellations, two thirds of them leading to a garde
     à vue, "essentially for degradations and attacks on officers"
     (Nuñez, BFM-TV).
     Turnout: the intersyndicale demonstration drew 206,000 (ministry) /
     300,000 (CGT) nationwide and 30,000 / 70,000 in Paris, across 170+
     demonstrations. The students marched with it, so the figure is
     carried here — but it counts the public-service cortèges, not a
     student crowd, for which no national count exists. Flagged "p".
     The Education ministry counted 31 injured students and staff that
     day. Strike rate: 11.47% weighted (12.74% second degree, 27.39%
     life-schools staff; 13.71% of teachers). */
  "2026-09-29": {
    turnout: { low: 206e3, high: 3e5, q: "p" },
    arrests: { low: 440, high: 440 },
    protesterInjured: { low: 31, high: 31, q: "p" },
    blockades: { low: 45, high: 45 }
  },
  /* Wed 30 Sep — 356 establishments perturbed; 625 interpellations that
     day, which with 440 on the 29th makes the two-day total 1,065.
     83 police and gendarmes injured.
     The Education ministry's stock since the start of the blockades
     reaches 119 injured students and staff (85 students, 34 staff) — a
     cumulative level, hence "c". */
  "2026-09-30": {
    arrests: { low: 625, high: 625 },
    protesterInjured: { low: 119, high: 119, q: "c" }
  },
  /* Thu 1 Oct — Acte II. More than 900 actions and blockages; AFP's police
         returns counted 340 actions in the morning and 169 blockades, ending
         the day at 900 actions including 400 closures; the Union étudiante
         claimed 640 lycées and ~30 campuses blocked, a figure the authorities
         do not confirm. Marseille: 18 high schools totally blocked, 3
         partially, ~40 in Bouches-du-Rhône; Aix-en-Provence ~600 students;
         Metz 6; Brest most; Épinal 2; Perpignan 11 interpellations and one
         student injured. No national turnout figure was published.
  
         FIX 5: arrests 1,949 are THAT DAY ("1 949 interpellations ce jeudi"),
         not a stock; the only stock is 6,059 "depuis le 28 septembre" on
         5 Oct. The day was the peak of the first week.
  
         FIX 7: forces injured are bracketed [83, 300] — 83 is the
         government level at the Wednesday cut-off (it is the same 83 that
         appears in the 318-injury total of 1 Oct) and ~300 is Nuñez's
         Thursday figure ("quelque 300 policiers et gendarmes blessés en
         intervention jeudi"). The band spans a cumulative level and a daily
         flow, so it is flagged "e" and the 83 is not counted twice.
  
         FIX 6: 235 = 170 students + 65 education staff, cumulative at the
         1 Oct cut-off; the previous 119–235 band was two vintages of this
         same series. Flagged "c".
  
         Damage: the hall of the lycée Nelson-Mandela in Nantes was destroyed
         by a fire (several classrooms unusable for weeks), as was the main
         entrance and a 35-classroom block at the lycée Henri-Moissan in
         Meaux; the façade of the lycée Lumière in Lyon was burnt; in
         Seine-Maritime two headteachers were hurt (Petit-Quevilly, Rouen) and
         the prefecture counted eight injured and several intrusions. The €1M
         cell is a local estimate from the original research and is a subset
         of the larger Île-de-France and IFRAP totals, hence "c". */
  "2026-10-01": {
    arrests: { low: 1949, high: 1949 },
    forcesInjured: { low: 83, high: 300, q: "e" },
    protesterInjured: { low: 235, high: 235, q: "c" },
    damagesCost: { low: 1, high: 1, q: "c" },
    blockades: { low: 222, high: 640 }
  },
  /* Fri 2 Oct — 1,747 interpellations that day and "more than 5,000 since
     Monday" (the daily series gives 4,925); 735 establishments perturbed,
     30% fewer than the day before, with urban violence near 158 of them
     (projectiles, attacks on officers, teachers, journalists and
     passers-by). A young police lieutenant was assaulted in Paris's 20th
     arrondissement. Geffray: 65 education staff injured since the start
     of the movement, 40 of them headteachers. */
  "2026-10-02": {
    arrests: { low: 1747, high: 1747 },
    blockades: { low: 400, high: 400, q: "f" }
  },
  /* Sat 3 Oct — the ministry's stock "6,059 interpellations since
     28 September" (5 Oct) minus 984 on Monday 5 Oct leaves 5,075 through
     Sunday 4 Oct; the daily figures for 28 Sep–2 Oct sum to 4,925. The
     difference, 150, is the weekend of 3–4 October. It is a two-day total
     derived by subtraction, not a Saturday figure — flagged "e" and
     carried on the Saturday, with the derivation in this comment. */
  "2026-10-03": {
    arrests: { low: 150, high: 150, q: "e" },
    blockades: { low: 735, high: 735, q: "x" }
  },
  /* Mon 5 Oct — 984 interpellations and 65 forces injured that day.
     Stocks published the same day: 6,059 interpellations since 28 Sep;
     715 police and gendarmes injured since the start of the movement;
     Matignon: 215 students and 85 education staff injured since the
     start, 34 of them headteachers. */
  "2026-10-05": {
    arrests: { low: 984, high: 984 },
    forcesInjured: { low: 65, high: 65 },
    blockades: { low: 400, high: 500, q: "x" }
  },
  /* Tue 6 Oct — "Acte III", first national school/student day.
     256,000 ministry / 450,000 organisers; Paris 56,000 / 100,000.
     488 interpellations and 43 forces injured that day; 215 students
     injured since mid-September. The €6M is the Île-de-France damage
     increment for the 1–8 Oct run and is therefore a subset, not an
     increment unique to 6 Oct. Flagged "c"; the anchor of the run is
     8 Oct. */
  "2026-10-06": {
    turnout: { low: 256e3, high: 45e4 },
    arrests: { low: 488, high: 488 },
    forcesInjured: { low: 43, high: 43 },
    damagesCost: { low: 6, high: 6, q: "c" },
    blockades: { low: 891, high: 1800, q: "x" }
  },
  /* Thu 8 Oct — "Acte IV": 71,500 ministry / 130,000+ CGT; Paris 24,500.
     Anchor of the 1–8 Oct Île-de-France damage increment (€6M). */
  "2026-10-08": {
    turnout: { low: 71500, high: 13e4 },
    damagesCost: { low: 6, high: 6, q: "e" },
    blockades: { low: 224, high: 224, q: "x" }
  },
  /* Sat 10 Oct — national cumulative damage stock: "déjà estimées à
     30 millions d'euros en France" since mid-September (CNEWS's own
     compilation of regional figures — no ministry published a national
     tally). Pannekoucke's parallel AURA estimate of €25–30M is NOT
     included, so this is neither a floor nor additive with the regional
     figures. Flagged "c": a stock, never summed with flows. */
  "2026-10-10": {
    damagesCost: { low: 30, high: 30, q: "c" },
    blockades: { low: 40, high: 40, q: "f" }
  },
  /* Mon 12 Oct — three regional prefecture figures, all regional:
       · Rhône: 27 établissements touchés (19 lycées, 6 universités,
         2 collèges), 13 interpellations.
       · Bas-Rhin/Strasbourg: 13 interpellations (préfecture), incl. 4
         for preparing incendiary devices, 3 for mortar fire.
     Two prefectures published 13 independently, so 13 is a FLOOR for the
     day, not the day's regional total. NOT Paris — the old note was
     wrong.
     FIX 13 (third pass): the €1.5M moved here from 13 Oct. It is
     NORMANDY (Hervé Morin, Conseil régional de Normandie, 12 Oct) and
     it is a CUMULATIVE stock since mid-September — "atteint d'ores et
     déjà 30 millions d'euros, dont 1,5 million en Normandie" — so the
     flag moves from "e" to "c". Île-de-France's own revised total the
     same day was €8.5M (110+ lycées, ~120 portails/sas out of service).
     Both regional stocks are components of the €30M national stock and
     must never be added to it.
     The 3 injured are an Île-de-France figure and count education and
     local-authority staff, not protesters: 1 proviseur, 1 parent
     d'élève, 1 agent de la Région. */
  "2026-10-12": {
    arrests: { low: 13, high: 13, q: "r" },
    protesterInjured: { low: 3, high: 3, q: "r" },
    damagesCost: { low: 1.5, high: 1.5, q: "c" },
    blockades: { low: 19, high: 19, q: "r" }
  },
  /* Tue 13 Oct — "Acte V": 214 high schools closed (94.2% open), 161,500
     ministry / 480,000 youth intersyndicate (41,500 Paris), 40 police
     and gendarmes injured.
     FIX 13 (third pass): the €1.5M cell is GONE from this date — it
     was Normandy, and it was published on 12 October. */
  "2026-10-13": {
    turnout: { low: 161500, high: 48e4 },
    forcesInjured: { low: 40, high: 40 },
    blockades: { low: 214, high: 214, q: "x" }
  },
  /* Sat 17 Oct — the peak of the episode.
         110 → 430 → 441 actions; ~60,000 officers deployed.
         550,000 ministry / 800,000 organisers; Paris 110,000.
         Arrests 2,397 initial → 2,628 consolidated (2,513 gardes à vue;
         108 in Paris). Forces injured 997 initial → 1,144 consolidated,
         7 serious. One civilian death: Christophe M., 59, Paris.
  
         FIX 2 (first pass): no official protester-injury count exists. The
         low bound is Laurent Thines's serious-injury register (54 seriously
         injured — 5 eye, 5 cranio-facial, 2 amputations, 42 other — plus the
         1 death, i.e. 55); the high bound is a reasoned ceiling from
         Toulouse's 130+ street-medics treatments (~13 treated per serious
         case) against 54 serious cases nationally. Wikipedia's "400+ civilians"
         is an uncited infobox line and sits below the partial nine-city sum
         (~204 across Bordeaux, Clermont-Ferrand, Dijon, Metz, Nancy, Rouen,
         Strasbourg, Avignon, Toulouse), so it is a floor, not a ceiling.
         Flagged "e": derived, drawn hollow.
  
         Damages: IFRAP conditional estimate for the 17–18 Oct weekend,
         €244M low / €463M central / €866M high for MATERIAL damage; the
         €294M–€1.1bn variant includes lost turnover and is a different measure.
         IFRAP excludes marginal order-maintenance and curfew costs. */
  "2026-10-17": {
    turnout: { low: 55e4, high: 8e5 },
    arrests: { low: 2397, high: 2628 },
    forcesInjured: { low: 997, high: 1144 },
    protesterInjured: { low: 55, high: 1e3, q: "e" },
    damagesCost: { low: 244, high: 866, q: "e" }
  },
  /* Sun 18 Oct — Paris curfew only, 108 interpellations.
     FIX 3 (first pass): the €1.8–5M damage figure is a subset of the
     17–18 Oct IFRAP weekend total, so it is flagged "c" and cannot be
     added to it.
     FIX 11 (third pass): "r", not "p" — the figure is Paris-only, and
     "p" now means partial coverage. */
  "2026-10-18": {
    arrests: { low: 108, high: 108, q: "r" },
    damagesCost: { low: 1.8, high: 5, q: "c" }
  },
  /* Tue 20 Oct — regional only: 13 interpellations overnight in Guadeloupe
     (Basse-Terre, Saint-François, Goyave, Vieux-Habitants, Gosier). */
  "2026-10-20": { arrests: { low: 13, high: 13, q: "r" } },
  /* Sat 24 Oct — 289 actions, 70,000 officers, Centaure AFVs, water cannons,
     14 aerial cameras in Paris. 410,000 ministry / 800,000+ CGT;
     Paris 110,000 (préfecture) / 250,000 (CGT).
     Arrests 1,314 initial → 1,435 final (142 Paris, 126 GàV).
     Forces injured 53 at 7:30 a.m. — the ministry's own communiqué calls
     this "provisoire" — then 267 on consolidation (Nuñez, 26 Oct), with
     150 civilians injured, 3 seriously. 75 fire interventions.
     La Réunion: ~80 Saint-Denis, 300 Saint-Pierre. Mayotte: Tsingoni.
     FIX 4 (first pass): the national damage cell below replaces the earlier
     local derivation. CCI France's 27 Oct tally — 2,488 shops hit after the
     17th plus 50 after the 24th, 1,161 heavily damaged, 643 still shut —
     puts the cost of the degradations at over €1bn on the IFRAP estimate,
     for the 17–24 Oct period as a whole. That is a SUPERSET of the 17 Oct
     cell, so it is flagged "c" and is never added to it. */
  "2026-10-24": {
    turnout: { low: 41e4, high: 8e5 },
    arrests: { low: 1314, high: 1435 },
    forcesInjured: { low: 267, high: 267 },
    protesterInjured: { low: 150, high: 150 },
    damagesCost: { low: 1e3, high: 1e3, q: "c" }
  },
  /* Sat 31 Oct — 291 actions → 227 consolidated.
     320,000 ministry / ~500,000 youth organisations; Paris 70,000.
     Arrests 565 at 21h → 779 cumulative (incl. 214 on the Halloween night).
     Forces injured 116 by 21h + 43 that night = 159.
     515 fires handled; 36 shops degraded, 3 pillaged — no cost figure. */
  "2026-10-31": {
    turnout: { low: 32e4, high: 5e5 },
    arrests: { low: 565, high: 779 },
    forcesInjured: { low: 116, high: 159 },
    damagesCost: { low: 0.4, high: 3.3, q: "e" }
  },
  "2026-11-02": { blockades: { low: 41, high: 41 } },
  "2026-11-03": { blockades: { low: 48, high: 500 } },
  /* Thu 5 Nov — national strike day, 193 actions.
     575,000 ministry (definitive) / 1.6M CGT; Paris 65,000 / 350,000.
     Arrests 448 at 18h → 642 updated. Forces injured 53 at 18h → 112.
     86 fire interventions. Marseille: 17 schools blocked, ~40 interpellations,
     13 police wounded.
     Protester injuries = 18, a FLOOR: the 18 who instructed lawyers to sue
     Nuñez. Not a ministry count. */
  "2026-11-05": {
    turnout: { low: 575e3, high: 16e5 },
    arrests: { low: 448, high: 642 },
    forcesInjured: { low: 53, high: 112 },
    protesterInjured: { low: 18, high: 18, q: "f" },
    blockades: { low: 81, high: 1e3 }
  },
  /* Sat 7 Nov — 141 actions; ~70,000 officers, 25 blindés, 15 water-cannon
     trucks; ~40,000 preventive checks; Caen campus dispersed by 50 CRS.
     146,000 ministry / 250,000 youth intersyndicate; Paris 46,000 / 75,000.
     Arrests 232 at 18h → 360+ at 19h.
     Security-force casualties acknowledged but no number published. */
  "2026-11-07": {
    turnout: { low: 146e3, high: 25e4 },
    arrests: { low: 350, high: 360 }
  },
  /* Mon 9 Nov — regional only: Bègles 4, Lyon 8, Strasbourg 5 = 17.
     ~50 Île-de-France schools disrupted with mortar fire; Rennes 2
     evacuated; Brest rally; Guadeloupe: lycée blocked at Baie-Mahault. */
  "2026-11-09": { arrests: { low: 17, high: 17, q: "r" } }
};
var DEPLOYMENT = {
  /* September deployment is an ASSUMPTION, on the same basis as the early
     October cells: no official headcount exists for these days. The band
     spans the marginal cost of one CRS company-day to the Sainte-Soline
     all-in benchmark. It is an order-of-magnitude placeholder for the
     policing-cost series, not a measurement. */
  "2026-09-28": { low: 5e3, high: 2e4, q: "e" },
  "2026-09-29": { low: 5e3, high: 2e4, q: "e" },
  "2026-09-30": { low: 5e3, high: 2e4, q: "e" },
  "2026-10-01": { low: 5e3, high: 2e4, q: "e" },
  "2026-10-02": { low: 1e4, high: 3e4, q: "e" },
  "2026-10-05": { low: 1e4, high: 3e4, q: "e" },
  "2026-10-06": { low: 5e3, high: 2e4, q: "e" },
  "2026-10-08": { low: 5e3, high: 2e4, q: "e" },
  /* 12 Oct: three cities at once — Île-de-France (~80 lycées perturbed),
     Lyon/Rhône (27 établissements), Strasbourg. No headcount published:
     the only concrete data is "une dizaine de camions de gendarmes
     mobiles" at the Strasbourg schools and several CRS/police vans at
     porte Dorée, Paris. */
  "2026-10-12": { low: 2e3, high: 8e3, q: "e" },
  "2026-10-13": { low: 5e3, high: 2e4, q: "e" },
  "2026-10-17": {
    low: 6e4,
    high: 6e4
  },
  "2026-10-18": { low: 2e3, high: 8e3, q: "e" },
  "2026-10-24": { low: 7e4, high: 7e4 },
  "2026-10-31": { low: 7e4, high: 7e4 },
  "2026-11-05": { low: 7e4, high: 7e4 },
  "2026-11-07": { low: 7e4, high: 7e4 }
};
var RATE = { low: 136, high: 1133 };
var round2 = (v) => Number.isInteger(v) ? v : Math.round(v * 100) / 100;
var costBand = (dep) => [
  dep.low * RATE.low / 1e6,
  dep.high * RATE.high / 1e6
];
function projectDaily(key) {
  return DATES.map((date) => {
    const obs = FACTS[date]?.[key];
    if (!obs) return NIL;
    const q = obs.q ?? "n";
    return {
      v: round2((obs.low + obs.high) / 2),
      band: [obs.low, obs.high],
      q,
      note: { k: "obs", date, metric: key },
      detach: isDetached(q)
    };
  });
}
function projectPolicingDaily() {
  return DATES.map((date) => {
    const dep = DEPLOYMENT[date];
    if (!dep) return NIL;
    const [lo, hi] = costBand(dep);
    const q = dep.q ?? "n";
    return {
      v: round2((lo + hi) / 2),
      band: [round2(lo), round2(hi)],
      q,
      note: { k: "policing", low: dep.low, high: dep.high, date },
      detach: isDetached(q)
    };
  });
}
function projectPolicingCumulative() {
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
      band: [round2(lo), round2(hi)],
      q: "e",
      note: { k: "cumulative", days, added: Boolean(dep) },
      detach: false
      // always a line; its band is shaded, not barred
    };
  });
}
function aggregate(key, op) {
  return WEEKS.map((week) => {
    const cells = [];
    for (const d of week.dates) {
      const obs = FACTS[d]?.[key];
      if (!obs) continue;
      cells.push({ date: d, obs, q: obs.q ?? "n" });
    }
    if (!cells.length) return NIL;
    const last = cells[cells.length - 1];
    const othersHigh = Math.max(
      ...cells.filter((c) => c !== last).map((c) => c.obs.high),
      Number.NEGATIVE_INFINITY
    );
    if (last.q === "c" && last.obs.high >= othersHigh) {
      return {
        v: round2((last.obs.low + last.obs.high) / 2),
        band: [round2(last.obs.low), round2(last.obs.high)],
        q: "c",
        note: { k: "obs", date: last.date, metric: key },
        detach: isDetached("c")
      };
    }
    const regional = cells.filter((c) => c.q === "r");
    const subsets = cells.filter((c) => c.q === "c");
    const flows = cells.filter((c) => c.q !== "c" && c.q !== "r");
    const regionalOnly = flows.length === 0 && regional.length > 0;
    let pool = regionalOnly ? regional : flows;
    if (!pool.length) {
      if (!subsets.length) return NIL;
      pool = [
        subsets.reduce((best, x) => x.obs.high > best.obs.high ? x : best)
      ];
    }
    let low;
    let high;
    let value2;
    let peak;
    if (op === "sum") {
      low = pool.reduce((a, x) => a + x.obs.low, 0);
      high = pool.reduce((a, x) => a + x.obs.high, 0);
      value2 = (low + high) / 2;
    } else {
      low = Math.max(...pool.map((x) => x.obs.low));
      high = Math.max(...pool.map((x) => x.obs.high));
      const top = pool.reduce(
        (best, x) => (x.obs.low + x.obs.high) / 2 > (best.obs.low + best.obs.high) / 2 ? x : best
      );
      value2 = (top.obs.low + top.obs.high) / 2;
      peak = top.date;
    }
    const derived = pool.filter((x) => x.q === "e").sort((a, b) => b.obs.high - a.obs.high)[0];
    const excluded = cells.length - pool.length;
    const partial = pool.some((x) => x.q === "p");
    const parts = {
      days: new Set(pool.map((x) => x.date)).size,
      kind: regionalOnly ? "regional" : "national",
      peak,
      noNational: regionalOnly || void 0,
      excluded: excluded > 0 ? excluded : void 0,
      floored: pool.some((x) => x.q === "f") || void 0,
      clipped: week.touchesEdge || void 0
    };
    return {
      v: round2(value2),
      band: [round2(low), round2(high)],
      q: regionalOnly ? "r" : parts.floored ? "f" : partial ? "p" : "w",
      note: derived ? { k: "obs", date: derived.date, metric: key } : { k: "week", p: parts },
      detach: regionalOnly
    };
  });
}
function aggregateBlockades() {
  return WEEKS.map((week) => {
    const cells = [];
    for (const date of week.dates) {
      const obs = FACTS[date]?.blockades;
      if (!obs) continue;
      cells.push({ date, obs, q: obs.q ?? "n" });
    }
    if (!cells.length) return NIL;
    const national = cells.filter((c) => c.q !== "r");
    const pool = national.length ? national : cells;
    const regionalOnly = national.length === 0;
    const top = pool.reduce((best, c) => {
      const mid = (c.obs.low + c.obs.high) / 2;
      const bestMid = (best.obs.low + best.obs.high) / 2;
      if (c.q === "c" && best.q !== "c") return c;
      if (best.q === "c" && c.q !== "c") return best;
      return mid > bestMid ? c : best;
    });
    const wide = top.q === "x";
    const parts = {
      days: new Set(pool.map((c) => c.date)).size,
      kind: regionalOnly ? "regional" : "national",
      peak: top.date,
      noNational: regionalOnly || void 0,
      excluded: cells.length - pool.length || void 0,
      floored: pool.some((c) => c.q === "f") || void 0,
      clipped: week.touchesEdge || void 0,
      vacation: weekTouchesHoliday(week.key) || void 0
    };
    return {
      v: round2((top.obs.low + top.obs.high) / 2),
      band: [round2(top.obs.low), round2(top.obs.high)],
      q: regionalOnly ? "r" : wide ? "x" : top.q === "f" ? "f" : "w",
      note: wide ? { k: "obs", date: top.date, metric: "blockades" } : { k: "week", p: parts },
      detach: regionalOnly
    };
  });
}
var DAILY = {
  turnout: projectDaily("turnout"),
  arrests: projectDaily("arrests"),
  forcesInjured: projectDaily("forcesInjured"),
  protesterInjured: projectDaily("protesterInjured"),
  damagesCost: projectDaily("damagesCost"),
  blockades: projectDaily("blockades"),
  policing: projectPolicingDaily(),
  policingCumulative: projectPolicingCumulative()
};
var WEEKLY = {
  turnout: aggregate("turnout", "max"),
  arrests: aggregate("arrests", "sum"),
  forcesInjured: aggregate("forcesInjured", "sum"),
  protesterInjured: aggregate("protesterInjured", "sum"),
  blockades: aggregateBlockades()
};
var WEEK_FLAG_OVERRIDE = {
  // Week of 28 Sep: the injury figure is the cumulative level reached on
  // 1 Oct (235 students and staff). The cell-level "c" flag produces this
  // on its own; the override documents the intent and survives any future
  // re-ordering of the underlying cells.
  "2026-09-28": { i: "c" }
};
var STUDENT_WEEKS = WEEKS.map((week, idx) => {
  const out = {
    key: week.key,
    end: week.end,
    touchesEdge: week.touchesEdge,
    p: null,
    a: null,
    f: null,
    i: null,
    flags: {},
    notes: {}
  };
  const override = WEEK_FLAG_OVERRIDE[week.key];
  for (const m of METRICS) {
    const pt = WEEKLY[METRIC_OF[m]][idx];
    if (pt.band) out[m] = pt.band;
    const q = override?.[m] ?? pt.q;
    if (pt.band && q && q !== "n") out.flags[m] = q;
    if (pt.note) out.notes[m] = pt.note;
  }
  return out;
});

// src/client/dom.ts
var byId = (id) => document.getElementById(id);
function el(name, cls, text) {
  const node = document.createElement(name);
  if (cls) node.className = cls;
  if (text !== void 0) node.textContent = text;
  return node;
}

// src/client/notes.ts
function noteText(ref) {
  if (!ref) return "";
  const m = t().chart;
  switch (ref.k) {
    case "obs":
      return m.obsNotes[ref.date]?.[ref.metric] ?? "";
    case "policing": {
      const head = ref.low === ref.high ? nf().format(ref.low) : `${nf().format(ref.low)}\u2013${nf().format(ref.high)}`;
      const note2 = m.deployNotes[ref.date];
      return fill(note2 ? m.policingDay : m.policingDayPlain, {
        head,
        low: nf().format(RATE.low),
        high: nf().format(RATE.high),
        note: note2 ?? ""
      });
    }
    case "cumulative":
      return fill(ref.added ? m.cumulativeAdded : m.cumulativeCarried, {
        days: ref.days
      });
    case "week": {
      const p = ref.p;
      const parts = [
        fill(p.kind === "national" ? m.weekNational : m.weekRegionalOnly, {
          n: p.days
        })
      ];
      if (p.peak) parts.push(fill(m.weekPeak, { date: fmtDayMonth(p.peak) }));
      if (p.noNational) parts.push(m.weekNoNational);
      if (p.excluded) parts.push(fill(m.weekExcluded, { n: p.excluded }));
      if (p.floored) parts.push(m.weekFloored);
      if (p.clipped) parts.push(m.weekClipped);
      if (p.vacation) parts.push(m.weekVacation);
      return parts.join(m.weekJoin);
    }
    default:
      return "";
  }
}
function suffixFor(q, detached) {
  const s = t().chart.suffix;
  const text = q === "c" ? s.c : q === "w" ? s.w : q === "e" ? s.e : q === "f" ? s.f : q === "x" ? s.x : detached ? s.regional : "";
  return text ? fill(t().chart.suffixWrap, { text }) : "";
}

// src/client/tooltip.ts
var DEFAULT_SIZE = 12;
var MAX_WIDTH = 360;
var MIN_WIDTH = 80;
var probe;
function measurer() {
  if (probe === void 0) {
    probe = document.createElement("canvas").getContext("2d");
  }
  return probe;
}
function fontCss(font, bold) {
  const size = font?.size ?? Chart.defaults.font.size ?? DEFAULT_SIZE;
  const family = Array.isArray(font?.family) ? font.family.join(", ") : font?.family ?? Chart.defaults.font.family;
  const style = font?.style ?? "normal";
  const weight = font?.weight ?? (bold ? "bold" : "normal");
  return `${style} ${weight} ${size}px ${family}`;
}
function chromeWidth(tt) {
  const pad = tt.padding ?? 6;
  const side = typeof pad === "number" ? pad * 2 : (pad.left ?? 0) + (pad.right ?? 0);
  const swatch = tt.displayColors === false ? 0 : (tt.boxWidth ?? DEFAULT_SIZE) + (tt.boxPadding ?? 6);
  return side + swatch + 2 * (tt.caretPadding ?? 2);
}
function textWidth(chart, tt) {
  const frame2 = chart.chartArea?.width ?? chart.width;
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, frame2 - chromeWidth(tt)));
}
function wrapText(text, max, font) {
  const ctx = measurer();
  if (!ctx) return text.split("\n");
  ctx.font = font;
  const fits = (s) => ctx.measureText(s).width <= max;
  const lines = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      if (line && !fits(`${line} ${word}`)) {
        lines.push(line);
        line = "";
      }
      if (!line && !fits(word)) {
        let rest = word;
        while (rest.length > 1 && !fits(rest)) {
          let lo = 1;
          let hi = rest.length;
          while (lo < hi) {
            const mid = lo + hi + 1 >> 1;
            if (fits(rest.slice(0, mid))) lo = mid;
            else hi = mid - 1;
          }
          lines.push(rest.slice(0, lo));
          rest = rest.slice(lo);
        }
        line = rest;
        continue;
      }
      line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
  }
  return lines;
}
function wrapTooltipLines(text, item, part = "body") {
  const chart = item?.chart;
  if (!chart) return text.split("\n");
  const tt = chart.options.plugins?.tooltip ?? {};
  const font = fontCss(
    part === "title" ? tt.titleFont : part === "footer" ? tt.footerFont : tt.bodyFont,
    part !== "body"
  );
  return wrapText(text, textWidth(chart, tt), font);
}

// src/client/a11y.ts
var live2 = null;
var timer = 0;
function region() {
  if (live2?.isConnected) return live2;
  live2 = document.getElementById("a11y-live");
  if (!live2) {
    live2 = document.createElement("p");
    live2.id = "a11y-live";
    live2.className = "sr-only";
    live2.setAttribute("role", "status");
    live2.setAttribute("aria-live", "polite");
    live2.setAttribute("aria-atomic", "true");
    document.body.append(live2);
  }
  return live2;
}
function announce(text) {
  const r = region();
  r.textContent = "";
  window.clearTimeout(timer);
  timer = window.setTimeout(() => r.textContent = text, 120);
}
var txt = (v) => {
  if (v == null) return "\u2014";
  if (typeof v === "number") return nf().format(Math.round(v));
  if (typeof v === "object") {
    const p = v;
    if (typeof p.low === "number" && typeof p.high === "number")
      return p.low === p.high ? nf().format(Math.round(p.low)) : `${nf().format(Math.round(p.low))} \u2013 ${nf().format(Math.round(p.high))}`;
    for (const n of [p.v, p.y])
      if (typeof n === "number") return nf().format(Math.round(n));
  }
  return String(v);
};
function dataTable(spec) {
  const details = document.createElement("details");
  details.className = "data-table";
  const summary = document.createElement("summary");
  summary.textContent = spec.caption;
  const table = document.createElement("table");
  const cap = document.createElement("caption");
  cap.className = "sr-only";
  cap.textContent = spec.caption;
  const head = table.createTHead().insertRow();
  for (const h of [spec.indexHeader, ...spec.columns.map((c) => c.header)]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = h;
    head.append(th);
  }
  const body = table.createTBody();
  spec.index.forEach((label, i) => {
    const tr = body.insertRow();
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    tr.append(th);
    for (const c of spec.columns)
      tr.insertCell().textContent = c.values[i] ?? "\u2014";
  });
  table.append();
  details.append(summary, table);
  return details;
}
function fromChart(chart, opts) {
  const data = chart.data;
  const sets = data.datasets.filter(
    (d) => opts.include?.(d) ?? true
  );
  const labels = (data.labels ?? []).map(String);
  const n = labels.length || Math.max(
    0,
    ...sets.map((d) => (d.data ?? []).length)
  );
  return dataTable({
    caption: opts.caption,
    indexHeader: opts.indexHeader,
    index: Array.from(
      { length: n },
      (_, i) => opts.indexOf?.(sets[0], i) ?? labels[i] ?? String(i + 1)
    ),
    columns: sets.map((d) => {
      const ds = d;
      return {
        header: String(ds.label ?? ""),
        values: Array.from({ length: n }, (_, i) => txt(ds.data?.[i]))
      };
    })
  });
}
function readout(chart, i) {
  const label = chart.data.labels?.[i] ?? "";
  const parts = chart.data.datasets.filter((d) => !d.detachedOnly).map((d) => {
    const ds = d;
    return `${ds.label}: ${txt(ds.data?.[i])}`;
  });
  return [label, ...parts].join(". ");
}
var seq = 0;
function keyboardChart(chart, opts) {
  const canvas = chart.canvas;
  const n = chart.data.labels?.length ?? 0;
  if (!n) return;
  const hintId = canvas.id ? `kbd-${canvas.id}` : `kbd-chart-${++seq}`;
  if (!document.getElementById(hintId)) {
    const hint = document.createElement("p");
    hint.id = hintId;
    hint.className = "sr-only";
    hint.textContent = opts.hint;
    canvas.after(hint);
  }
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-roledescription", opts.roledescription);
  const ids = new Set(
    (canvas.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean)
  );
  ids.add(hintId);
  canvas.setAttribute("aria-describedby", [...ids].join(" "));
  const speak = opts.readout ?? ((i) => readout(chart, i));
  let at = -1;
  const paint = (next) => {
    if (next === null || next < 0 || next >= n) {
      at = -1;
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      chart.update("none");
      return;
    }
    at = next;
    const els = chart.data.datasets.map((_, datasetIndex) => ({
      datasetIndex,
      index: at
    }));
    const pt = chart.getDatasetMeta(0).data[at];
    chart.setActiveElements(els);
    chart.tooltip.setActiveElements(els, { x: pt?.x ?? 0, y: pt?.y ?? 0 });
    chart.update("none");
    announce(speak(at));
  };
  canvas.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowRight":
      case "ArrowUp":
        paint(at < 0 ? 0 : Math.min(n - 1, at + 1));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        paint(at < 0 ? n - 1 : Math.max(0, at - 1));
        break;
      case "Home":
        paint(0);
        break;
      case "End":
        paint(n - 1);
        break;
      case "Escape":
        paint(null);
        break;
      default:
        return;
    }
    ev.preventDefault();
  });
  canvas.addEventListener("blur", () => paint(null));
}

// src/client/chart.ts
Chart.register(
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  LinearScale,
  CategoryScale,
  plugin_tooltip,
  plugin_legend,
  plugin_title,
  plugin_subtitle
);
var LEFT = "y";
var RIGHT = "y1";
var CAP_PX = 5;
var DAMAGES_ANCHOR = "2026-10-24";
var damagesRadius = (r) => DATES.map((d) => d === DAMAGES_ANCHOR ? 0 : r);
var DEF = {
  protestersDaily: {
    data: DAILY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 4,
    width: 2
  },
  blockadesDaily: {
    data: DAILY.blockades,
    color: "#8C564B",
    unit: "count",
    radius: 3,
    width: 1.75,
    axis: RIGHT,
    log: true,
    holiday: "daily"
  },
  arrestsDaily: {
    data: DAILY.arrests,
    color: "#b91c1c",
    unit: "count",
    radius: 3.5,
    width: 1.5
  },
  forcesDaily: {
    data: DAILY.forcesInjured,
    color: "#047857",
    unit: "count",
    radius: 4,
    width: 1.5,
    style: "rectRot"
  },
  protestersInjuredDaily: {
    data: DAILY.protesterInjured,
    color: "#b45309",
    unit: "count",
    radius: 5,
    width: 1.5,
    style: "triangle"
  },
  damagesDaily: {
    data: DAILY.damagesCost,
    color: "#7c3aed",
    unit: "eurM",
    radius: 5,
    pointRadius: damagesRadius(5),
    width: 2
  },
  policingDaily: {
    data: DAILY.policing,
    color: "#0e7490",
    unit: "eurM",
    radius: 4,
    width: 2,
    style: "rect"
  },
  policingCumulative: {
    data: DAILY.policingCumulative,
    color: "#0369a1",
    unit: "eurM",
    radius: 0,
    width: 2,
    bandFill: "rgba(3,105,161,0.12)",
    shadeOnly: true
  },
  protestersWeekly: {
    data: WEEKLY.turnout,
    color: "#1d4ed8",
    unit: "count",
    radius: 5,
    width: 2
  },
  blockadesWeekly: {
    data: WEEKLY.blockades,
    color: "#8C564B",
    unit: "count",
    radius: 3,
    width: 1.75,
    axis: RIGHT,
    log: true,
    holiday: "weekly"
  },
  arrestsWeekly: {
    data: WEEKLY.arrests,
    color: "#b91c1c",
    unit: "count",
    radius: 4,
    width: 2
  },
  forcesWeekly: {
    data: WEEKLY.forcesInjured,
    color: "#047857",
    unit: "count",
    radius: 4,
    width: 1.5,
    style: "rectRot"
  },
  protestersInjuredWeekly: {
    data: WEEKLY.protesterInjured,
    color: "#b45309",
    unit: "count",
    radius: 5,
    width: 1.5,
    style: "triangle"
  }
};
var CHARTS = [
  {
    id: "chart-protesters",
    copy: "protestersDaily",
    weekly: false,
    series: ["protestersDaily", "blockadesDaily"]
  },
  {
    id: "chart-enforcement",
    copy: "enforcementDaily",
    weekly: false,
    series: ["arrestsDaily", "forcesDaily", "protestersInjuredDaily"]
  },
  {
    id: "chart-costs",
    copy: "cost",
    weekly: false,
    series: ["damagesDaily", "policingDaily", "policingCumulative"]
  },
  {
    id: "chart-protesters-weekly",
    copy: "protestersWeekly",
    weekly: true,
    series: ["protestersWeekly", "blockadesWeekly"]
  },
  {
    id: "chart-enforcement-weekly",
    copy: "enforcementWeekly",
    weekly: true,
    series: ["arrestsWeekly", "forcesWeekly", "protestersInjuredWeekly"]
  }
];
function view(weekly) {
  const c = t().chart;
  return weekly ? {
    labels: WEEKS.map(
      (w) => fmtWeek(w.key, w.end) + (w.touchesEdge ? c.edgeMark : "")
    ),
    titles: WEEKS.map(
      (w) => fill(w.touchesEdge ? c.weekOfPartial : c.weekOf, {
        date: fmtDayMonth(w.key)
      })
    ),
    footers: WEEKS.map(() => null),
    xTitle: c.axisWeek,
    maxRotation: 0,
    maxTicksLimit: 12
  } : {
    labels: DATES.map(fmtDayMonth),
    titles: DATES.map(fmtDate),
    footers: DATES.map((d) => c.dayNotes[d] ?? null),
    xTitle: c.axisDate,
    maxRotation: 90,
    maxTicksLimit: 25
  };
}
var DAILY_GAP = 7;
var WEEKLY_GAP = 1;
function datasetsFor(id, weekly) {
  const def = DEF[id];
  if (!def) throw new Error(`chart.ts: no DEF entry for series "${id}"`);
  if (!def.data) throw new Error(`chart.ts: series "${id}" has no data`);
  if (def.pointRadius && def.pointRadius.length !== def.data.length) {
    throw new Error(
      `chart.ts: "${id}" pointRadius has ${def.pointRadius.length} entries, expected ${def.data.length}`
    );
  }
  const radiusAt = (i, bump = 0) => {
    const r = def.pointRadius?.[i] ?? def.radius;
    return r === 0 ? 0 : r + bump;
  };
  const copy = t().chart.series[id];
  const axis = def.axis ?? LEFT;
  const plot = (keep) => def.data.map((p) => keep(p) ? p.v : null);
  const bands = (keep) => def.data.map((p) => keep(p) ? p.band : null);
  const holiday = def.holiday === "weekly" ? weeklyHolidaySegment : def.holiday === "daily" ? dailyHolidaySegment : void 0;
  const line = {
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
      holiday
    }
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
      spanGaps: false
    }
  ];
}
var errorBars = {
  id: "errorBars",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i];
      if (!ds.bandFill || !ds.errorBars) continue;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;
      const scale = chart.scales[meta.yAxisID ?? LEFT];
      if (!scale) continue;
      const pts = meta.data;
      const lowPts = [];
      const highPts = [];
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
        chartArea.height
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
      const ds = chart.data.datasets[i];
      if (!ds.errorBars || ds.noWhiskers) continue;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;
      const scale = chart.scales[meta.yAxisID ?? LEFT];
      if (!scale) continue;
      const pts = meta.data;
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        chartArea.left,
        chartArea.top,
        chartArea.width,
        chartArea.height
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
  }
};
var connectors = {
  id: "connectors",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const xs = scales.x;
    if (!chartArea || !xs) return;
    for (let i = 0; i < chart.data.datasets.length; i++) {
      const ds = chart.data.datasets[i];
      const spec = ds.connectors;
      if (!spec) continue;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) continue;
      const ys = scales[meta.yAxisID ?? LEFT];
      if (!ys) continue;
      const logAxis = ys.type === "logarithmic";
      const at = [];
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
        chartArea.height
      );
      ctx.clip();
      ctx.strokeStyle = ds.borderColor ?? THEME.ink;
      ctx.lineWidth = ds.borderWidth ?? 1;
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
  }
};
var SPAN_MARKS = [
  {
    from: "2026-10-17",
    to: "2026-10-24",
    value: 1e3,
    color: DEF.damagesDaily.color
  }
];
var MARKER = "ellipse";
var ELLIPSE_RY = 7;
var BRACE_CURL = 6;
var BRACE_LIFT = 12;
function withAlpha(hex2, a) {
  const n = Number.parseInt(hex2.slice(1), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
var spanMark = {
  id: "spanMark",
  afterDatasetsDraw(chart) {
    const spans = chart.options.plugins?.spanMark?.spans;
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
          Math.PI * 2
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
      const labelY = (MARKER === "ellipse" ? y - ELLIPSE_RY : y - BRACE_LIFT - BRACE_CURL) - 2;
      if (labelY - 10 > chartArea.top) {
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillStyle = s.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          `${fmtDayMonth(s.from)}\u2013${fmtDayMonth(s.to)}`,
          mid,
          labelY
        );
      }
      ctx.setLineDash([]);
    }
    ctx.restore();
  }
};
function fmt(v, unit) {
  return unit === "eurM" ? fill(t().chart.eurM, { v: eurM().format(v) }) : nf().format(Math.round(v));
}
var tickFormat = (unit) => (v) => unit === "eurM" ? fill(t().chart.eurM, { v: nf().format(v) }) : compact().format(v);
function tooltipCallbacks(v) {
  const m = t().chart;
  return {
    title: (items) => wrapTooltipLines(v.titles[items[0].dataIndex] ?? "", items[0], "title"),
    label: (item) => {
      const ds = item.dataset;
      const unit = ds.unit ?? "count";
      const note2 = noteText(ds.notes?.[item.dataIndex]);
      const detached = ds.showLine === false;
      const band = ds.errorBars?.[item.dataIndex];
      const base = band ? fill(m.tooltipRange, {
        label: ds.label,
        mid: fmt((band[0] + band[1]) / 2, unit),
        low: fmt(band[0], unit),
        high: fmt(band[1], unit)
      }) : fill(m.tooltipPoint, {
        label: ds.label,
        value: fmt(item.parsed.y ?? 0, unit)
      });
      const body = base + suffixFor(ds.quality?.[item.dataIndex], detached);
      return wrapTooltipLines(
        note2 ? fill(m.tooltipNote, { base: body, note: note2 }) : body,
        item,
        "body"
      );
    },
    footer: (items) => {
      const note2 = v.footers[items[0].dataIndex];
      return note2 ? wrapTooltipLines(fill(m.footerMark, { note: note2 }), items[0], "footer") : [];
    }
  };
}
function niceCeil(v) {
  if (!Number.isFinite(v) || v <= 0) return 10;
  const base = 10 ** Math.floor(Math.log10(v));
  const n = v / base;
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s + 1e-9) ?? 10;
  return step * base;
}
function axisMax(list, headroom = 1.08) {
  let max = 0;
  for (const series of list) {
    for (const p of series) {
      if (p.v !== null && p.v > max) max = p.v;
      if (p.band && p.band[1] > max) max = p.band[1];
    }
  }
  return max > 0 ? niceCeil(max * headroom) : 10;
}
var Y_TICKS = {
  maxTicksLimit: 6,
  autoSkip: false,
  font: { size: 10 },
  padding: 6
};
function logTicks(min, max) {
  const out = [];
  const from2 = Math.floor(Math.log10(Math.max(min, 1e-6)));
  const to2 = Math.ceil(Math.log10(Math.max(max, 1)));
  for (let e = from2; e <= to2; e++) {
    const v = 10 ** e;
    if (v >= min * 1.0001 && v <= max * 0.9999) out.push(v);
  }
  if (max > 1) out.push(max);
  return out;
}
function axisMin(list) {
  let min = Infinity;
  for (const series of list) {
    for (const p of series) {
      if (p.v !== null && p.v > 0 && p.v < min) min = p.v;
      if (p.band && p.band[0] > 0 && p.band[0] < min) min = p.band[0];
    }
  }
  return Number.isFinite(min) ? min : 1;
}
function yAxis(title, list, unit, position, log = false) {
  const max = axisMax(list);
  const floor = axisMin(list) * 0.9;
  const tick = (n) => {
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
      padding: { bottom: 6 }
    },
    ticks: {
      ...Y_TICKS,
      callback: (v) => tick(Number(v))
    },
    grid: { color: THEME.axisGrid, drawTicks: false }
  };
  if (!log) return { type: "linear", beginAtZero: true, ...base };
  return {
    type: "logarithmic",
    min: floor,
    ...base,
    ticks: { ...base.ticks, autoSkip: false },
    afterBuildTicks: (axis) => {
      axis.ticks = logTicks(floor, max).map((value2) => ({ value: value2 }));
    }
  };
}
function baseScales(v) {
  return {
    x: {
      title: {
        display: true,
        text: v.xTitle,
        color: THEME.label,
        font: { size: 11 },
        padding: { top: 4 }
      },
      grid: { display: false },
      ticks: {
        maxRotation: v.maxRotation,
        autoSkip: true,
        maxTicksLimit: v.maxTicksLimit,
        font: { size: 12 },
        color: THEME.muted,
        padding: 4
      }
    }
  };
}
function scalesFor(v, card, ids) {
  const defs = ids.map((id) => DEF[id]);
  const left = defs.filter((d) => (d.axis ?? LEFT) === LEFT);
  const right = defs.filter((d) => d.axis === RIGHT);
  const leftList = (left.length ? left : defs).map((d) => d.data);
  const leftUnit = left[0]?.unit ?? defs[0]?.unit ?? "count";
  const scales = {
    ...baseScales(v),
    [LEFT]: yAxis(card.y ?? card.yLeft ?? "", leftList, leftUnit, "left")
  };
  if (right.length) {
    scales[RIGHT] = {
      ...yAxis(
        card.yRight ?? "",
        right.map((d) => d.data),
        right[0].unit,
        "right",
        right.some((d) => d.log)
      ),
      grid: {
        color: THEME.axisGrid,
        drawTicks: false,
        drawOnChartArea: false
      }
    };
  }
  return scales;
}
var shell = (v, subtitle, title, extra) => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 0,
  devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  interaction: { mode: "index", intersect: false },
  layout: { padding: { top: 4, right: 16, bottom: 0, left: 4 } },
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        color: THEME.label,
        // was Chart.js default #666: invisible on dark
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        padding: 14,
        font: { size: 11 },
        filter: (item, data) => !data.datasets[item.datasetIndex ?? -1]?.detachedOnly
      }
    },
    subtitle: {
      display: true,
      text: subtitle,
      color: THEME.muted,
      font: { size: 12 },
      padding: { top: 0, bottom: 8 }
    },
    title: {
      display: true,
      text: title,
      color: THEME.ink,
      font: { size: 16, weight: "bold" },
      padding: { top: 0, bottom: 2 }
    },
    tooltip: {
      backgroundColor: THEME.tooltipBg,
      titleColor: THEME.tooltipInk,
      bodyColor: THEME.tooltipInk,
      borderColor: THEME.grid,
      borderWidth: 1,
      callbacks: tooltipCallbacks(v)
    },
    ...extra
  }
});
function buildChart(spec) {
  const card = t().chart.charts[spec.copy];
  const v = view(spec.weekly);
  return {
    data: {
      labels: v.labels,
      datasets: spec.series.flatMap((id) => datasetsFor(id, spec.weekly))
    },
    ...shell(
      v,
      card.subtitle,
      card.title,
      spec.id === "chart-costs" ? { spanMark: { spans: SPAN_MARKS } } : void 0
    ),
    scales: scalesFor(v, card, spec.series)
  };
}
var MIN_CHART_H = 420;
function ensureChartBox(canvas) {
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
function mount(canvas, cfg) {
  ensureChartBox(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;
  return track(
    new Chart(ctx, {
      type: "line",
      data,
      options,
      plugins: [errorBars, connectors, spanMark]
    })
  );
}
function mountCharts() {
  for (const spec of CHARTS) {
    const canvas = byId(spec.id);
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.warn(`[chart] #${spec.id} is not a canvas`);
      continue;
    }
    try {
      const copy = t().chart.charts[spec.copy];
      const name = copy.subtitle ? `${copy.title}. ${copy.subtitle}` : copy.title;
      canvas.setAttribute("aria-label", name);
      canvas.setAttribute("role", "img");
      const chart = mount(canvas, buildChart(spec));
      const host = canvas.closest("figure") ?? canvas.parentElement;
      host?.querySelector(".data-table")?.remove();
      const table = fromChart(chart, {
        caption: fill(a11y().tableCaption, { title: copy.title }),
        indexHeader: a11y().dateHeader
      });
      host?.append(table);
      keyboardChart(chart, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole
      });
    } catch (err) {
      console.error(`[${spec.id}]`, err);
    }
  }
}

// src/client/episodes.ts
var DIM = THEME.dim;
var SERIES2 = [
  { key: "p", color: "#1d4ed8" },
  { key: "a", color: "#b91c1c" },
  { key: "f", color: "#047857" },
  { key: "i", color: "#b45309" }
];
var RAMP2 = [
  "#D6E6F2",
  "#B0CFE6",
  "#86B4D7",
  "#5C97C5",
  "#357AB0",
  "#1B5C92",
  "#0A3A63"
];
var MAY68 = {
  id: "may68",
  start: "1968-04-29",
  end: "1968-06-30",
  weeks: [
    /* 1 May, République → Bastille: 25,000 (police) vs 100,000 (CGT). */
    { w: 0, from: "1968-04-29", to: "1968-05-05", p: [25e3, 1e5] },
    {
      /* 6 May: >20,000 to the Sorbonne; 10 May: 20,000 (12,000 police).
         Night of 10–11 May: 6,255 police, 125 cars damaged / 63 burnt,
         469 arrests. The 891 high adds 422 early-May arrests.
         Forces: 300+ on 6 May, 247 on 10–11 May.
         Protesters injured: ≥100 — no national count was published. */
      w: 1,
      from: "1968-05-06",
      to: "1968-05-12",
      p: 2e4,
      a: [469, 891],
      f: [247, 300],
      i: 100,
      flag: { i: "f" }
    },
    /* 13 May, Paris — peak of the episode: prefecture 230,000 · ORTF 171,000
       · surface-area estimate 500,000 · unions 1,000,000. */
    { w: 2, from: "1968-05-13", to: "1968-05-19", p: [23e4, 1e6] },
    {
      /* 25 May: 1,000+ arrests (floor), ~9M strikers, ORTF walkout.
         887 injured — from the English-Wikipedia infobox, attributed to 25 May
         only. Weak provenance, flagged "e". */
      w: 3,
      from: "1968-05-20",
      to: "1968-05-26",
      a: 1e3,
      i: 887,
      flag: { a: "f", i: "e" }
    },
    /* 27 May Grenelle protocol · Charléty meeting. */
    { w: 4, from: "1968-05-27", to: "1968-06-02" },
    /* 4 Jun partial return to work · 7 Jun Renault Flins clashes. */
    { w: 5, from: "1968-06-03", to: "1968-06-09" },
    /* 10 Jun: Tautin killed · 11 Jun: 2 killed at Sochaux · 12 Jun:
       demonstrations banned nationwide. */
    { w: 6, from: "1968-06-10", to: "1968-06-16" },
    /* 23 Jun legislative elections. */
    { w: 7, from: "1968-06-17", to: "1968-06-23" },
    /* Crisis closes 30 Jun. */
    { w: 8, from: "1968-06-24", to: "1968-06-30" }
  ]
};
var CPE = {
  id: "cpe",
  start: "2006-02-06",
  end: "2006-04-16",
  weeks: [
    /* 7 Feb: first national action day, 187 demonstrations. */
    { w: 0, from: "2006-02-06", to: "2006-02-12", p: [2e5, 4e5] },
    /* 7 Mar: ">1 million" claimed; ~38 universities on strike by 9 Mar. */
    { w: 4, from: "2006-03-06", to: "2006-03-12", p: [4e5, 1e6] },
    {
      /* 16 Mar: 250,000 (Le Monde) / 447,500 (police) — the ministry's
         247,500 is the same police count rounded differently.
         18 Mar: 500,000 ministry / 1.5M organisers; Paris 80,000–350,000.
         Enforcement, Paris only: 156 (ministry) / 167 (organisers) arrests;
         34 forces injured.
         Protesters injured 70 = 18 (16 Mar) + 52 (18 Mar), Paris only —
         flagged "e" because it is a two-day Paris sum inside a weekly row.
         14 Mar (same week, second action day): 41,000 (police source). */
      w: 5,
      from: "2006-03-13",
      to: "2006-03-19",
      p: [5e5, 15e5],
      a: [156, 167],
      f: 34,
      i: 70,
      flag: { i: "e" }
    },
    {
      /* 23 Mar: 21 universities fully blocked, 67 striking or blocked.
         630 arrests, 90 forces injured. */
      w: 6,
      from: "2006-03-20",
      to: "2006-03-26",
      p: [22e4, 45e4],
      a: 630,
      f: 90
    },
    /* 28 Mar: 4th national action day, 600 arrests. */
    {
      w: 7,
      from: "2006-03-27",
      to: "2006-04-02",
      p: [1055e3, 271e4],
      a: 600
    },
    /* 4 Apr: peak day of the episode. */
    { w: 8, from: "2006-04-03", to: "2006-04-09", p: [1e6, 31e5] },
    /* CPE scrapped 10 Apr; the movement splits, Easter follows. */
    { w: 9, from: "2006-04-10", to: "2006-04-16" }
  ]
};
var GJ_ACTS = [
  [0, "2018-11-17", 287700],
  [1, "2018-11-24", 166e3],
  [2, "2018-12-01", 136e3],
  [3, "2018-12-08", 136e3],
  [4, "2018-12-15", 66e3],
  [5, "2018-12-22", 38600],
  [6, "2018-12-29", 32e3],
  [7, "2019-01-05", 5e4],
  [8, "2019-01-12", 84e3],
  [9, "2019-01-19", 84e3],
  [10, "2019-01-26", 69e3],
  [11, "2019-02-02", 58600],
  [12, "2019-02-09", 51400],
  [13, "2019-02-16", 41500],
  [14, "2019-02-23", 46600],
  [15, "2019-03-02", 39300],
  [16, "2019-03-09", 28600],
  [17, "2019-03-16", 32300],
  [18, "2019-03-23", 40500],
  [19, "2019-03-30", 33700],
  [20, "2019-04-06", 22300],
  [21, "2019-04-13", 31e3],
  [22, "2019-04-20", 27900],
  [23, "2019-04-27", 23600],
  [24, "2019-05-04", 18900],
  [25, "2019-05-11", 18600],
  [26, "2019-05-18", 15500],
  [27, "2019-05-25", 12500],
  [28, "2019-06-01", 9500],
  [29, "2019-06-08", 10300],
  [30, "2019-06-15", 7e3],
  [31, "2019-06-22", 11800],
  [32, "2019-06-29", 5800],
  [43, "2019-09-07", 7e3]
];
var GJ_EXTRA = {
  0: { a: [117, 73], flag: { a: "f" } },
  1: { a: [101, 103], f: 5, i: 19, flag: { i: "e" } },
  2: {},
  3: { a: 1385 }
};
var GILETS = {
  id: "gj",
  start: "2018-11-12",
  end: "2019-09-09",
  weeks: GJ_ACTS.map(([w, date, n]) => ({
    w,
    from: date,
    to: date,
    act: w + 1,
    p: n,
    ...GJ_EXTRA[w] ?? {},
    flag: {
      ...w === 0 ? { p: "c" } : {},
      ...GJ_EXTRA[w]?.flag ?? {}
    }
  }))
};
var NAHEL = {
  id: "nahel",
  start: "2023-06-27",
  end: "2023-07-09",
  weeks: [
    {
      w: 0,
      from: "2023-06-26",
      to: "2023-07-02",
      p: [8e3, 5e4],
      a: 3354,
      f: 722,
      flag: { p: "e" }
    },
    { w: 1, from: "2023-07-03", to: "2023-07-09", a: 108, f: 1 }
  ]
};
var PENSIONS = {
  id: "pensions",
  start: "2023-01-19",
  end: "2023-06-08",
  weeks: [
    { w: 0, from: "2023-01-16", to: "2023-01-22", p: [112e4, 2e6] },
    { w: 2, from: "2023-01-30", to: "2023-02-05", p: [127e4, 28e5] },
    { w: 3, from: "2023-02-06", to: "2023-02-12", p: [963e3, 25e5] },
    { w: 4, from: "2023-02-13", to: "2023-02-19", p: [44e4, 13e5] },
    { w: 7, from: "2023-03-06", to: "2023-03-12", p: [128e4, 35e5] },
    { w: 8, from: "2023-03-13", to: "2023-03-19", p: [48e4, 17e5] },
    {
      /* 23 Mar: the flashpoint — 49.3 passed, two failed no-confidence votes.
         Ministry: up to 1.08M nationwide / 119,000 Paris; CGT 3.5M / 800,000.
         Darmanin's consolidated day: 457 arrests, 441 security forces injured.
         An earlier evening statement had given 80+ arrests / 123 police hurt,
         so 457/441 is the final figure and the only one plotted. */
      w: 9,
      from: "2023-03-20",
      to: "2023-03-26",
      p: [1089e3, 35e5],
      a: 457,
      f: 441
    },
    {
      /* 27 Mar: the eleventh day of mobilisation, after the 5 April talks
         failed. Expected 600,000–800,000 nationwide (60,000–90,000 Paris).
         Interior Ministry: 111 arrests, 154 police officers injured. */
      w: 11,
      from: "2023-04-03",
      to: "2023-04-09",
      p: [57e4, 2e6],
      a: 111,
      f: 154
    },
    { w: 10, from: "2023-03-27", to: "2023-04-02", p: [74e4, 2e6] },
    { w: 12, from: "2023-04-10", to: "2023-04-16", p: [38e4, 15e5] },
    { w: 16, from: "2023-05-01", to: "2023-05-07", p: [782e3, 23e5] },
    { w: 20, from: "2023-06-05", to: "2023-06-08", p: [281e3, 9e5] }
  ]
};
var BLOQUONS = {
  id: "bt",
  start: "2025-09-10",
  end: "2025-10-05",
  weeks: [
    {
      w: 0,
      from: "2025-09-08",
      to: "2025-09-14",
      p: [175e3, 25e4],
      a: 540,
      flag: { p: "c" }
    },
    {
      w: 1,
      from: "2025-09-15",
      to: "2025-09-21",
      p: [5e5, 1e6],
      a: 309,
      f: 26,
      i: 11
    },
    { w: 3, from: "2025-09-29", to: "2025-10-05", p: [195e3, 6e5] }
  ]
};
function rows2026() {
  return STUDENT_WEEKS.map((wk, w) => {
    const row = { w, from: wk.key, to: wk.end, partial: wk.touchesEdge };
    for (const m of METRICS) {
      const band = wk[m];
      if (band) row[m] = band;
      const flag = wk.flags[m];
      if (flag && flag !== "n") (row.flag ??= {})[m] = flag;
      const ref = wk.notes[m];
      if (ref) (row.noteRef ??= {})[m] = ref;
    }
    return row;
  });
}
var STUDENTS = {
  id: "students26",
  start: STUDENT_WEEKS[0].key,
  end: END,
  // the window's last day, not the Sunday of the final week
  weeks: rows2026()
};
var EPISODES = [
  MAY68,
  CPE,
  GILETS,
  NAHEL,
  PENSIONS,
  BLOQUONS,
  STUDENTS
];
var ENFORCEMENT_LAST = EPISODES.reduce(
  (last, ep) => ep.weeks.reduce(
    (l, r) => r.a !== void 0 || r.f !== void 0 || r.i !== void 0 ? Math.max(l, r.w) : l,
    last
  ),
  0
);
function rowTitle(ep, r) {
  const m = t();
  if (ep.id === "students26") {
    const base = fmtWeek(r.from, r.to);
    return r.partial ? fill(m.panels.partialWeek, { label: base }) : base;
  }
  const when = r.act !== void 0 ? fill(m.panels.act, { n: r.act }) : fmtWeek(r.from, r.to);
  const action = m.episodes[ep.id].weeks[r.w]?.action;
  return action ? fill(m.panels.withAction, { when, action }) : when;
}
function noteFor(id, r, m) {
  if (id === "students26") {
    return noteText(r.noteRef?.[m]) || t().episodes.students26.fallbackNote?.[m];
  }
  return t().episodes[id].weeks[r.w]?.note?.[m];
}
var seriesCache = /* @__PURE__ */ new Map();
function seriesData(ep, key) {
  const id = `${ep.id}:${key}`;
  if (seriesCache.has(id)) return seriesCache.get(id);
  const rows = ep.weeks.filter((r) => r[key] !== void 0).sort((a, b) => a.w - b.w);
  const out = rows.length === 0 ? null : (() => {
    const flagOf = (r) => r.flag?.[key] ?? "n";
    const baseRow = rows.find((r) => flagOf(r) !== "c") ?? rows[0];
    const base = midOf(baseRow[key]);
    return rows.map((r) => {
      const [low, high] = bandOf(r[key]);
      return {
        x: r.w,
        y: (low + high) / 2,
        low,
        high,
        flag: flagOf(r),
        note: noteFor(ep.id, r, key),
        base,
        t: rowTitle(ep, r)
      };
    });
  })();
  seriesCache.set(id, out);
  return out;
}
function buildDataset(ep, epIndex, key, color2, maxX) {
  const all = seriesData(ep, key);
  if (!all) return null;
  const points = all.filter((p) => p.x <= maxX);
  if (!points.length) return null;
  return {
    label: t().items[key].label,
    data: points,
    borderColor: color2,
    backgroundColor: color2,
    borderWidth: 1.75,
    pointRadius: points.map((p) => p.flag === "c" ? 3 : 2.75),
    pointBackgroundColor: points.map(
      (p) => isDetached(p.flag) ? THEME.hollow : color2
    ),
    pointBorderColor: color2,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: gapSegment(1, [5, 4]),
    __item: key,
    __ep: epIndex,
    __color: color2
  };
}
function rawExtent(eps, keys, maxX) {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const ep of eps) {
    for (const k of keys) {
      const pts = seriesData(ep, k);
      if (!pts) continue;
      for (const p of pts) {
        if (p.x > maxX) continue;
        if (p.low > 0) lo = Math.min(lo, p.low);
        hi = Math.max(hi, p.high);
      }
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi <= lo)
    return [1, 1e6];
  return [lo, hi];
}
function xScale(maxW) {
  const step = maxW <= 8 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: "linear",
    min: -0.5,
    max: maxW + 0.5,
    grid: { display: false },
    border: { display: false },
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      font: { size: 9 },
      color: THEME.muted,
      padding: 4,
      callback: (v) => String(Number(v))
    },
    afterBuildTicks: (axis) => {
      const out = [];
      for (let v = 0; v <= maxW + 1e-3; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s) => {
      s.height = 20;
    }
  };
}
function logBounds(lo, hi) {
  const l = Math.log10(Math.max(lo, 1e-6));
  const h = Math.log10(Math.max(hi, l + 0.1));
  const pad = Math.max(0.06, (h - l) * 0.05);
  return [10 ** (l - pad), 10 ** (h + pad)];
}
function logTicks2(min, max) {
  const l = Math.log10(min);
  const span = Math.log10(max) - l;
  const mantissas = span > 4.5 ? [1] : span > 1.5 ? [1, 3] : [1, 2, 5];
  const out = [];
  for (let e = Math.floor(l); e <= Math.ceil(Math.log10(max)); e++) {
    for (const mm of mantissas) {
      const v = Number((mm * 10 ** e).toPrecision(12));
      if (v > min * 1.01 && v < max / 1.01) out.push(v);
    }
  }
  return out;
}
function yScale(min, max, showLabels) {
  const ticks = logTicks2(min, max);
  return {
    type: "logarithmic",
    min,
    max,
    grid: { color: THEME.grid, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: THEME.muted,
      padding: 6,
      callback: (v) => compact().format(Number(v))
    },
    afterBuildTicks: (axis) => {
      axis.ticks = ticks.map((value2) => ({ value: value2 }));
    },
    afterFit: (s) => {
      s.width = 46;
    }
  };
}
var pctOf = (v, base) => {
  const r = 100 * v / base;
  return r >= 10 ? `${Math.round(r)}%` : `${Number(r.toFixed(1))}%`;
};
function tooltipSpec() {
  const m = t();
  return {
    displayColors: false,
    callbacks: {
      title: (items) => wrapTooltipLines(items[0].raw.t, items[0], "title"),
      label: (item) => {
        const p = item.raw;
        const value2 = p.low === p.high ? nf().format(Math.round(p.low)) : `${nf().format(Math.round(p.low))} \u2013 ${nf().format(Math.round(p.high))}`;
        const flag = m.flags[p.flag];
        return wrapTooltipLines(
          flag ? fill(m.tooltip.lineWithFlag, { value: value2, flag }) : fill(m.tooltip.linePlain, { value: value2 }),
          item,
          "body"
        );
      },
      afterLabel: (item) => {
        const note2 = item.raw.note;
        return note2 ? wrapTooltipLines(note2, item, "body") : "";
      },
      footer: (items) => {
        const p = items[0].raw;
        const n = nf().format(Math.round(p.base));
        return wrapTooltipLines(
          Math.abs(p.y - p.base) / p.base < 1e-9 ? fill(m.tooltip.firstFigure, { n }) : fill(m.tooltip.shareOfFirst, { pct: pctOf(p.y, p.base), n }),
          items[0],
          "footer"
        );
      }
    }
  };
}
var episodePanels = [];
var itemPanels = [];
var activeItem = null;
var activeEvent = null;
function resetEmphasis() {
  activeItem = null;
  activeEvent = null;
}
var datasetsOf = (chart) => chart.data.datasets;
function restyle(d, on, bold = false) {
  const c = on ? d.__color : alpha2(d.__color, DIM);
  d.borderColor = c;
  d.pointBorderColor = c;
  d.pointBackgroundColor = d.data.map(
    (p) => isDetached(p.flag) ? THEME.hollow : c
  );
  d.borderWidth = bold && on ? 2.75 : 1.75;
}
function restylePanels(charts, keep, bold = false) {
  for (const chart of charts) {
    for (const d of datasetsOf(chart)) restyle(d, keep(d), bold);
    chart.update("none");
  }
}
function emphasiseItem(key) {
  if (key === activeItem) return;
  activeItem = key;
  restylePanels(episodePanels, (d) => key === null || d.__item === key, true);
  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host)
      host.style.opacity = key === null || item === key ? "1" : String(DIM);
  }
}
function emphasiseEvent(index) {
  if (index === activeEvent) return;
  activeEvent = index;
  restylePanels(
    itemPanels.map((p) => p.chart),
    (d) => index === null || d.__ep === index
  );
}
function legend(host, entries) {
  let pinned = null;
  host.replaceChildren(
    ...entries.map(({ text, color: color2, dash, on, off }, idx) => {
      const button = el("button");
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      const swatch = el("span", "swatch");
      swatch.style.background = dash?.length ? `repeating-linear-gradient(90deg, ${color2} 0 3px, transparent 3px 6px)` : color2;
      button.append(swatch, document.createTextNode(text));
      button.addEventListener("click", () => {
        pinned = pinned === idx ? null : idx;
        button.setAttribute("aria-pressed", String(pinned === idx));
        pinned === null ? off() : on();
      });
      for (const ev of ["mouseenter", "focus", "pointerdown"])
        button.addEventListener(ev, on);
      for (const ev of ["mouseleave", "blur"])
        button.addEventListener(ev, () => {
          if (pinned === idx) return;
          off();
          host.querySelectorAll("[aria-pressed]").forEach((b, j) => {
            if (j !== pinned) b.setAttribute("aria-pressed", "false");
          });
        });
      return button;
    })
  );
}
function observations(ep) {
  const m = t();
  const counts = METRICS.map(
    (k) => ep.weeks.filter((r) => r[k] !== void 0).length
  ).join("\xB7");
  return fill(m.panels.obs, {
    counts,
    weeks: plural(m.units.weeks, ep.weeks.length)
  });
}
function panelFigure(strip, meta, note2) {
  const figure = el("figure", "trellis-panel");
  const caption = el("figcaption");
  const title = el("span", "strip", strip);
  title.id = `strip-${crypto.randomUUID().slice(0, 8)}`;
  caption.append(title, el("span", "strip-meta", meta));
  if (note2) caption.append(el("p", "strip-note", note2));
  const box = el("div", "panel-canvas");
  const canvas = el("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-labelledby", title.id);
  box.append(canvas);
  figure.append(caption, box);
  return { figure, canvas };
}
function columns(host) {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}
var panelOptions = (x, y, onHover) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: "nearest", axis: "x", intersect: false },
  layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
  scales: { x, y },
  plugins: {
    legend: { display: false },
    title: { display: false },
    subtitle: { display: false },
    tooltip: tooltipSpec()
  },
  onHover
});
function mountCrossEpisode(opts) {
  resetEmphasis();
  episodePanels.length = 0;
  itemPanels.length = 0;
  activeItem = null;
  activeEvent = null;
  seriesCache = /* @__PURE__ */ new Map();
  opts.episodeHost.replaceChildren();
  opts.itemHost.replaceChildren();
  resetEmphasis();
  const m = t();
  const unbounded = Number.POSITIVE_INFINITY;
  const [yMin, yMax] = logBounds(...rawExtent(EPISODES, METRICS, unbounded));
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  EPISODES.forEach((ep, idx) => {
    const text = m.episodes[ep.id];
    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const { figure, canvas } = panelFigure(
      text.strip,
      `${fmtSpan(ep.start, ep.end)} \xB7 ${observations(ep)}`,
      text.banner
    );
    opts.episodeHost.append(figure);
    const datasets = SERIES2.map(
      (s) => buildDataset(ep, idx, s.key, s.color, unbounded)
    ).filter((d) => d !== null);
    const chart = track(
      new Chart(canvas, {
        type: "line",
        data: { datasets },
        options: panelOptions(
          xScale(maxW),
          yScale(yMin, yMax, idx % cols === 0),
          (_e, elements) => {
            const d = elements[0]?.dataset;
            emphasiseItem(d ? d.__item : null);
          }
        ),
        plugins: []
        // no per-panel labels: the episode is the panel title
      })
    );
    function decoratePanel(chart2, figure2, title) {
      figure2.append(
        fromChart(chart2, {
          caption: fill(a11y().tableCaption, { title }),
          indexHeader: a11y().weekHeader,
          indexOf: (ds, i) => String(ds.data[i]?.t ?? "\u2014")
        })
      );
      keyboardChart(chart2, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole,
        readout: (i) => (chart2.data.datasets[0]?.data?.[i]?.t ?? String(i + 1)) + ". " + chart2.data.datasets.map((d) => {
          const p = d.data[i];
          return p ? `${d.label}: ${p.low === p.high ? p.low : `${p.low}\u2013${p.high}`}` : `${d.label}: \u2014`;
        }).join(". ")
      });
    }
    canvas.addEventListener("mouseleave", () => emphasiseItem(null));
    episodePanels.push(chart);
  });
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;
  SERIES2.forEach((series) => {
    const [rawLo, rawHi] = rawExtent(EPISODES, [series.key], ENFORCEMENT_LAST);
    const [lo, hi] = logBounds(rawLo, rawHi);
    const range = fill(m.panels.valueRange, {
      lo: compact().format(rawLo),
      hi: compact().format(rawHi)
    });
    const { figure, canvas } = panelFigure(
      m.items[series.key].short,
      fill(m.panels.itemMeta, { range, n: ENFORCEMENT_LAST })
    );
    opts.itemHost.append(figure);
    const datasets = EPISODES.map(
      (ep, i) => buildDataset(ep, i, series.key, RAMP2[i], ENFORCEMENT_LAST)
    ).filter((d) => d !== null);
    const chart = track(
      new Chart(canvas, {
        type: "line",
        data: { datasets },
        options: panelOptions(xScale(ENFORCEMENT_LAST), yScale(lo, hi, true)),
        plugins: []
      })
    );
    function decoratePanel(chart2, figure2, title) {
      figure2.append(
        fromChart(chart2, {
          caption: fill(a11y().tableCaption, { title }),
          indexHeader: a11y().weekHeader,
          indexOf: (ds, i) => String(ds.data[i]?.t ?? "\u2014")
        })
      );
      keyboardChart(chart2, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole,
        readout: (i) => (chart2.data.datasets[0]?.data?.[i]?.t ?? String(i + 1)) + ". " + chart2.data.datasets.map((d) => {
          const p = d.data[i];
          return p ? `${d.label}: ${p.low === p.high ? p.low : `${p.low}\u2013${p.high}`}` : `${d.label}: \u2014`;
        }).join(". ")
      });
    }
    canvas.addEventListener("mouseleave", () => emphasiseEvent(null));
    canvas.addEventListener("mousemove", (ev) => {
      const pts = chart.getElementsAtEventForMode(
        ev,
        "nearest",
        { intersect: false },
        true
      );
      if (!pts.length) {
        emphasiseEvent(null);
        return;
      }
      emphasiseEvent(datasetsOf(chart)[pts[0].datasetIndex].__ep);
    });
    itemPanels.push({ chart, item: series.key });
  });
  legend(
    opts.itemLegend,
    SERIES2.map((s) => ({
      text: m.items[s.key].label,
      color: s.color,
      on: () => emphasiseItem(s.key),
      off: () => emphasiseItem(null)
    }))
  );
  legend(
    opts.eventLegend,
    EPISODES.map((ep, i) => ({
      text: m.episodes[ep.id].short,
      color: RAMP2[i],
      on: () => emphasiseEvent(i),
      off: () => emphasiseEvent(null)
    }))
  );
}

// src/client/lang.ts
function applyUrlLang(search) {
  const from2 = localeFromUrl(search);
  if (from2 && from2 !== getLocale())
    setLang(from2, { persist: false, notify: false });
  return getLocale();
}
function mountLangSwitch(host = document.querySelector(
  "[data-lang-switch]"
)) {
  if (!host || host.dataset.bound === "true") return () => {
  };
  const onClick = (ev) => {
    const btn = ev.target?.closest(
      "[data-set-lang]"
    );
    if (!btn) return;
    const next = normalizeLocale(btn.dataset.setLang);
    if (!next || next === getLocale()) return;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
    setLang(next);
  };
  const onKey = (ev) => {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    const btns = [
      ...host.querySelectorAll("[data-set-lang]")
    ];
    const i = btns.indexOf(document.activeElement);
    if (i === -1) return;
    ev.preventDefault();
    const next = btns[(i + (ev.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
    next.focus();
    next.click();
  };
  host.addEventListener("click", onClick);
  host.addEventListener("keydown", onKey);
  host.dataset.bound = "true";
  syncLangSwitch(host);
  return () => {
    host.removeEventListener("click", onClick);
    host.removeEventListener("keydown", onKey);
    delete host.dataset.bound;
  };
}

// src/client/about.ts
var OPEN_ID = "project";
var SECTION_LABEL = {
  en: "Notes on this project",
  fr: "Notes sur le projet"
};
var CALLOUT = {
  en: "\u2026except for this section, which is 100% human written! (in English, and then machine translated)",
  fr: "\u2026sauf cette section, qui est \xE9crite \xE0 100 % par un humain ! (en anglais, puis traduite automatiquement)"
};
var BLOG = "https://www.lemonde.fr/societe/article/2026/11/09/a-brest-la-police-saisit-les-trombinoscopes-de-plusieurs-lycees-eleves-et-parents-denoncent-un-fichage_6808694_3224.html";
var RN_VOTE = "https://www.humanite.fr/politique/rassemblement-national/entre-les-67-de-vote-rn-dans-ses-rangs-et-lambiance-securitaire-en-vigueur-la-police-deja-prete-a-servir-lextreme-droite";
var HELICOPTER = "https://www.lavoixdunord.fr/506027/article/2018-12-13/un-helicoptere-etait-pret-samedi-au-cas-ou-pour-emmener-emmanuel-macron";
var STRATEGY = "https://lepoing.net/manifestation-du-7-novembre-a-montpellier-la-contestation-cherche-encore-sa-strategie/";
var BUNKER = "https://neru.tv/sources/macron-bunker-secret-pour-fuir-le-peuple/";
var PAGES = "https://y1dwgth1otzig.github.io/french-protest-charts/?lang=en";
var REPO = "https://github.com/y1DWgTh1oTZIG/french-protest-charts";
var SPOOK = "https://www.youtube.com/watch?v=HG-56GKbPtk&t=3896";
var QUOTE = {
  kind: "quote",
  paras: [
    [
      "In guerilla warfare, the winning is in not losing. When you sleep on the floor, you can\u2019t fall out of bed."
    ],
    [
      "[We have to force] him to make a choice between the two things which he seems to dig most of all."
    ],
    [
      "There is no way that the United States can police the world and keep us on our ass too unless we cooperate. When we revolt, we reduce it to a simple choice."
    ],
    ["[The time for others to make a] choice is when we start."],
    [
      "If they don\u2019t follow our program and turn us in to the cops we lose in a week."
    ],
    [
      "[But if they support us] then it\u2019s hit and run, harass and hound, and we can paralyze this country."
    ]
  ],
  by: ["Dan Freeman, ", { link: "The Spook Who Sat by the Door", href: SPOOK }]
};
var ABOUT = {
  /* ---------------------------------------------------------------- english */
  en: [
    {
      id: "project",
      title: "About This Project",
      blocks: [
        {
          kind: "p",
          runs: [
            "This is an attempt to better visualise the ongoing student-led uprising taking place in France, as well as putting it into context against other past uprisings."
          ]
        }
      ]
    },
    {
      id: "analysis",
      title: "My Analysis",
      blocks: [
        {
          kind: "p",
          runs: [
            "Section A shows the early dynamics of the movement quite starkly: school blockades were rapidly spreading around the country (and its overseas territories), which was met with a hugely excessive response from the police at the end of September. This helps to contextualise ",
            { em: "why" },
            " people were so angry and why, when the police lost control on Oct 17, they caused such an amount of damage."
          ]
        },
        {
          kind: "p",
          runs: [
            "In an attempt to regain control, the state responded with lawfare, with Macron and his prefects attempting to ban protests and implement curfews for young people. This has been resoundingly rejected week after week as\u2014during the school holidays and therefore a break in the school blockades\u2014huge numbers of people continued to take to the streets in defiance of these orders."
          ]
        },
        {
          kind: "p",
          runs: [
            "Looking at the data since Oct 17, things seem to have settled into an uneasy routine: the unions declare planned routes; the prefects ban them or propose ridiculous alternatives; the unions file urgent appeals that invariably get rejected; the weaker unions accept the alternative routes; the spicier unions join the Gilets Jaunes, students, et al. in defiant undeclared manifestations; the cops wait until most people go; and then they engage in running battles with the remaining few until the evening. But either the more-recent arrest and injury figures are currently undercounted, or there has been a steady decline in each since Oct 17."
          ]
        },
        {
          kind: "p",
          runs: [
            "However, I think the police may have decided to try intelligence in place of violence for a change. They seem to be using kettling much more often, surrounding and tear-gassing protestors and then allowing them to exit only by allowing their identity card to be photographed and a fine for attending an illegal protest to be issued. The fixed-penalty fines are 135EUR, but I suspect their main objective is the IDs for intelligence collection and issuing future charges. Similarly, police in Brest ",
            {
              link: "seized the photo directories of several schools",
              href: BLOG
            },
            ", for as-yet-unclear reasons. It\u2019s worth noting that in France, it is illegal for the state to record ethnicity data and for employers to record lists of striking employees, both because of the experience in WWII where the French collaborator and German occupier governments used these lists to round up their enemies for deportation and worse. The fear in the back of everyone\u2019s mind is the possibility that France will again have a far-right government next April, which ",
            {
              link: "almost two thirds of the police openly support",
              href: RN_VOTE
            },
            ", and so where might those lists end up?"
          ]
        },
        {
          kind: "p",
          runs: [
            "In terms of the historic comparisons (although the data here is less trustworthy; see the section below), the pension reform protests are interesting as, apparently, the only case where the protests were already ongoing for some time before the police repression began. The most obvious comparison to make is with the Gilets Jaunes (especially since the present movement has adopted the same Act-based structure), which managed to prolong a steadily decreasing weekly turnout for well over a year (and at one point had Macron ",
            { link: "considering escape by helicopter", href: HELICOPTER },
            "), but it\u2019s hard to say what was achieved by doing so."
          ]
        },
        {
          kind: "p",
          runs: [
            "The big question facing the movement is ",
            { link: "what should they do now", href: STRATEGY },
            "? They\u2019ve seen off wanton police violence, shameless media demonisation and one particularly chaotic night that could have lost them public support (but this seems not to have happened). As I see it (and I\u2019m sure many others are having the same conversations), they need to figure out what they want and develop their theory of change. For example, the government has already made some small concessions to the students\u2019 original demands for increased education funding, but the movement has now absorbed all sorts of other grievances, from the cost of living to fear of militarism to personal distaste for Macron\u2019s patronising and authoritarian style of rule to fear of an incoming RN government."
          ]
        },
        {
          kind: "p",
          runs: [
            "Do they want to influence elites? Do they want to focus on influencing next year\u2019s elections? There is the presidential election in April, but the winner could well choose to call a snap legislative election just after. In this case, should work be undertaken to produce something like the Student List in Serbia?"
          ]
        },
        {
          kind: "p",
          runs: [
            "Do they want to inflict economic pain on the state to force it to meet their demands? The data below suggests that we may be reaching an inflection point whereby the cost of policing these protests exceeded even the highest estimated for the damage caused on Oct 17. But as the Gilets Jaunes well know, this is an approach that favours many dispersed, smaller groups acting against intelligently-chosen targets (e.g. malls, logistics hubs, etc.), and not just smashing up random shop windows."
          ]
        },
        {
          kind: "p",
          runs: [
            "What are those demands? Just the original student demands? Or the whole programme of reversing the pension reforms, re-funding every sector, demilitarising the police, seeking justice for Palestine, etc.?"
          ]
        },
        {
          kind: "p",
          runs: [
            "Do they want to overthrow the government by force? This has happened before\u2014the end of Fourth Republic came when French military personnel and settlers in Algeria launched an attempted coup d\u2019\xE9tat. Certainly, the government seems to be ",
            { link: "taking the possibility seriously", href: BUNKER },
            ". But even if protestors did succeed in causing Macron to flee, it\u2019s not clear how the symbolic victory might translate into a practical takeover."
          ]
        },
        /* closing argument, in the author's own words */
        {
          kind: "p",
          runs: [
            "At the moment, I think a complete fizzling-out is unlikely. I think the most likely course is that this will continue for some time, with slowly diminishing turnout and some small concessions won here and there. Most people\u2019s engagement will be limited to therapeutic marching, but the people who are politicised here will go on to develop new associations and be instrumental in future movements, as the former Gilets Jaunes have been here, and the 68-ers before them."
          ]
        },
        {
          kind: "p",
          runs: [
            "But maybe, just maybe, the threat of an incoming fascist government and the memory of so many past underwhelming results will serve to focus minds and harden hearts in time to press home their present advantage and win lasting, significant wins. And just as mere ",
            { em: "resistance" },
            " in France has already spread like wildfire across Europe, a real victory in France could be the thing to spark a conflagration that burns down the old world and inaugurates the new."
          ]
        },
        {
          kind: "p",
          runs: [
            "I will leave you with this (heavily paraphrased) quote from a classic film, which I watched for the first time recently:"
          ]
        },
        QUOTE
      ]
    },
    {
      id: "data",
      title: "Data Problems",
      blocks: [
        {
          kind: "p",
          runs: [
            "The biggest challenge has been finding reliable data sources. In particular, I want to highlight some issues with the injury data."
          ]
        },
        {
          kind: "p",
          runs: [
            "The police are the only ones to publish official figures, but they make no distinction between: accidental & self-inflicted injuries, and those caused by protestors; nor the severity of injury. Potentially a good way to enrich this would be to compare with figures for injury-related work stoppages, but I don\u2019t know when or where these might be published (and they would probably have to be compared against the non-uprising baseline to identify any excess). On the other hand, no official figures for violence against protestor exists. Deaths are obviously pretty easy to verify, but the exact causes can be unclear. For injuries, the most reliable data is compiled by Prof. Laurent Thines, and provides the floor of verified serious injuries. Some local street medic groups publish accounts of how many people they treated after large protests, but many of these will be for relatively minor things like \u2018gave saline to rinse out teargas\u2019; on the flipside, many people who receive saline or a Maalox squirt for the same thing won\u2019t be recorded; and the street medic landscape is very fragmented, with multiple groups often operating in the same protests but not all reporting their figures afterwards."
          ]
        },
        {
          kind: "p",
          runs: [
            "Damage is another tricky one, and also one of the most politicised. Wide-ranging figures are published shortly after the fact, but I suspect that if we wait a while we might be able to determine a more realistic floor by looking at the real insurance claim amounts (although that might exclude smaller stores that might not have insurance). And the estimates for policing costs should be taken as very rough, mainly determined by estimating the per-squadron cost of riot police deployment and scaling that up to the reported police deployment numbers. This also dovetails with the injury data problem, because we can\u2019t make estimates for the cost of any subsequent sick leave (whether for police, protestors, or bystanders)."
          ]
        },
        {
          kind: "p",
          runs: [
            "Obviously, all of these issues are intensified when looking further back at historical events."
          ]
        }
      ]
    },
    {
      id: "method",
      title: "How I Made This",
      blocks: [
        {
          kind: "p",
          runs: [
            "This project began as a personal experiment in \u2018vibe-coding\u2019 (i.e., iterative software development using an LLM and trying to avoid touching the code yourself)."
          ]
        },
        {
          kind: "p",
          runs: [
            "The charts are rendered using Chart.js. I\u2019ve made things using this by hand in the past, and it\u2019s pretty tedious, so the ability to have the LLM convert natural language instructions into Chart.js syntax is pretty incredible."
          ]
        },
        {
          kind: "p",
          runs: [
            "I used MiniMax M3.1 Flash for research and DeepSeek V4.1 Flash for coding\u2014thanks China! You can view my full development transcripts here:"
          ]
        },
        {
          kind: "ul",
          items: [
            [{ link: "initial development", href: "transcript-1.md" }],
            [{ link: "chart type selection", href: "transcript-2.md" }],
            [
              {
                link: "adding comparisons and translation",
                href: "transcript-3.md"
              }
            ],
            [{ link: "reviewing code", href: "transcript-4.md" }],
            [{ link: "reviewing sources", href: "transcript-5.md" }]
          ]
        },
        {
          kind: "p",
          runs: [
            "This project is hosted on ",
            { link: "GitHub Pages", href: PAGES },
            ". You can view the code ",
            { link: "here", href: REPO },
            "."
          ]
        },
        {
          kind: "p",
          runs: [
            "The first draft of this project took me just over a day of pretty intense back-and-forth."
          ]
        }
      ]
    }
  ],
  /* ---------------------------------------------------------------- français */
  fr: [
    {
      id: "project",
      title: "\xC0 propos de ce projet",
      blocks: [
        {
          kind: "p",
          runs: [
            "Ceci est une tentative de mieux visualiser le soul\xE8vement \xE9tudiant en cours en France, et de le mettre en perspective avec d\u2019autres soul\xE8vements pass\xE9s."
          ]
        }
      ]
    },
    {
      id: "analysis",
      title: "Mon analyse",
      blocks: [
        {
          kind: "p",
          runs: [
            "La section A montre assez cr\xFBment la dynamique initiale du mouvement : les blocages de lyc\xE9es se sont rapidement propag\xE9s dans tout le pays (et dans ses territoires d\u2019outre-mer), et la police y a r\xE9pondu de mani\xE8re extr\xEAmement disproportionn\xE9e fin septembre. Cela aide \xE0 comprendre ",
            { em: "pourquoi" },
            " les gens \xE9taient si en col\xE8re et pourquoi, lorsque la police a perdu le contr\xF4le le 17 octobre, les d\xE9g\xE2ts ont \xE9t\xE9 aussi consid\xE9rables."
          ]
        },
        {
          kind: "p",
          runs: [
            "Pour tenter de reprendre la main, l\u2019\xC9tat a r\xE9pondu par le droit : Macron et ses pr\xE9fets ont cherch\xE9 \xE0 interdire les manifestations et \xE0 instaurer des couvre-feux pour les jeunes. Ces mesures ont \xE9t\xE9 rejet\xE9es avec \xE9clat semaine apr\xE8s semaine, car \u2014 pendant les vacances scolaires, donc en pause des blocages de lyc\xE9es \u2014 des foules immenses ont continu\xE9 \xE0 descendre dans la rue en d\xE9pit de ces arr\xEAt\xE9s."
          ]
        },
        {
          kind: "p",
          runs: [
            "\xC0 regarder les donn\xE9es depuis le 17 octobre, les choses semblent s\u2019\xEAtre install\xE9es dans une routine inconfortable : les syndicats annoncent des parcours ; les pr\xE9fets les interdisent ou proposent des itin\xE9raires ridicules ; les syndicats d\xE9posent des recours en urgence qui sont invariablement rejet\xE9s ; les syndicats les plus ti\xE8des acceptent les parcours de substitution ; les plus combatifs rejoignent les Gilets jaunes, les \xE9tudiants, etc. dans des manifestations sauvages et provocatrices ; les flics attendent que la plupart des gens partent ; puis ils engagent des batailles rang\xE9es avec les derniers jusqu\u2019au soir. Mais soit les chiffres r\xE9cents d\u2019interpellations et de bless\xE9s sont actuellement sous-estim\xE9s, soit il y a eu une baisse r\xE9guli\xE8re depuis le 17 octobre."
          ]
        },
        {
          kind: "p",
          runs: [
            "Je pense cependant que la police a peut-\xEAtre d\xE9cid\xE9 d\u2019essayer le renseignement plut\xF4t que la violence, pour changer. Elle semble recourir beaucoup plus souvent \xE0 l\u2019encerclement (le \xAB kettling \xBB) : entourer et gazer les manifestants, puis ne les laisser sortir qu\u2019en photographiant leur carte d\u2019identit\xE9 et en leur infligeant une amende pour participation \xE0 une manifestation interdite. Les amendes forfaitaires sont de 135 EUR, mais je soup\xE7onne que l\u2019objectif principal soit les pi\xE8ces d\u2019identit\xE9, pour la collecte de renseignements et les poursuites \xE0 venir. De m\xEAme, \xE0 Brest, la police ",
            {
              link: "a saisi les trombinoscopes de plusieurs lyc\xE9es",
              href: BLOG
            },
            ", pour des raisons encore floues. Il faut rappeler qu\u2019en France, l\u2019\xC9tat n\u2019a pas le droit d\u2019enregistrer des donn\xE9es ethniques, ni les employeurs de tenir des listes de salari\xE9s gr\xE9vistes, en raison de l\u2019exp\xE9rience de la Seconde Guerre mondiale, o\xF9 les gouvernements collaborateurs fran\xE7ais et l\u2019occupant allemand ont utilis\xE9 ces listes pour arr\xEAter leurs ennemis en vue de leur d\xE9portation et pire. La crainte au fond de chacun est que la France ait de nouveau un gouvernement d\u2019extr\xEAme droite en avril prochain, que ",
            {
              link: "pr\xE8s de deux tiers des policiers soutiennent ouvertement",
              href: RN_VOTE
            },
            ", et alors o\xF9 pourraient aboutir ces listes ?"
          ]
        },
        {
          kind: "p",
          runs: [
            "Pour les comparaisons historiques (m\xEAme si les donn\xE9es y sont moins fiables ; voir la section ci-dessous), les mobilisations contre la r\xE9forme des retraites sont int\xE9ressantes : apparemment le seul cas o\xF9 les protestations duraient d\xE9j\xE0 depuis un certain temps avant que la r\xE9pression polici\xE8re ne commence. La comparaison la plus \xE9vidente est avec les Gilets jaunes (d\u2019autant que le mouvement actuel a adopt\xE9 la m\xEAme structure en \xAB actes \xBB), qui ont r\xE9ussi \xE0 prolonger pendant bien plus d\u2019un an une participation hebdomadaire en baisse constante (et ont un moment conduit Macron \xE0 ",
            {
              link: "envisager de s\u2019enfuir en h\xE9licopt\xE8re",
              href: HELICOPTER
            },
            "), mais il est difficile de dire ce que cela a permis d\u2019obtenir."
          ]
        },
        {
          kind: "p",
          runs: [
            "La grande question qui se pose au mouvement est : ",
            { link: "que faire maintenant", href: STRATEGY },
            " ? Il a r\xE9sist\xE9 \xE0 une violence polici\xE8re gratuite, \xE0 une diabolisation m\xE9diatique sans vergogne et \xE0 une nuit particuli\xE8rement chaotique qui aurait pu lui faire perdre le soutien du public (mais cela ne semble pas s\u2019\xEAtre produit). \xC0 mon sens (et je suis s\xFBr que beaucoup d\u2019autres ont les m\xEAmes conversations), il faut d\xE9finir ce que l\u2019on veut et \xE9laborer une th\xE9orie du changement. Par exemple, le gouvernement a d\xE9j\xE0 fait quelques petites concessions aux revendications initiales des \xE9tudiants sur le financement de l\u2019\xE9ducation, mais le mouvement a d\xE9sormais absorb\xE9 toutes sortes d\u2019autres griefs, du co\xFBt de la vie \xE0 la peur du militarisme, en passant par l\u2019aversion personnelle pour le style de gouvernance paternaliste et autoritaire de Macron, jusqu\u2019\xE0 la crainte d\u2019un gouvernement RN."
          ]
        },
        {
          kind: "p",
          runs: [
            "Veut-il influencer les \xE9lites ? Veut-il peser sur les \xE9lections de l\u2019an prochain ? L\u2019\xE9lection pr\xE9sidentielle a lieu en avril, mais le vainqueur pourrait bien convoquer des l\xE9gislatives anticip\xE9es juste apr\xE8s. Dans ce cas, faudrait-il travailler \xE0 produire quelque chose comme la Liste \xE9tudiante en Serbie ?"
          ]
        },
        {
          kind: "p",
          runs: [
            "Veut-il infliger une douleur \xE9conomique \xE0 l\u2019\xC9tat pour le contraindre \xE0 c\xE9der ? Les donn\xE9es ci-dessous sugg\xE8rent que nous approchons peut-\xEAtre d\u2019un point d\u2019inflexion o\xF9 le co\xFBt du maintien de l\u2019ordre d\xE9passe m\xEAme l\u2019estimation la plus haute des dommages caus\xE9s le 17 octobre. Mais comme les Gilets jaunes le savent bien, cette approche favorise de nombreux groupes dispers\xE9s et plus petits, agissant contre des cibles intelligemment choisies (centres commerciaux, plateformes logistiques, etc.), et pas seulement le saccage de vitrines au hasard."
          ]
        },
        {
          kind: "p",
          runs: [
            "Quelles sont ces revendications ? Seulement les revendications \xE9tudiantes initiales ? Ou tout le programme : abrogation des r\xE9formes des retraites, refinancement de tous les secteurs, d\xE9militarisation de la police, justice pour la Palestine, etc. ?"
          ]
        },
        {
          kind: "p",
          runs: [
            "Veut-il renverser le gouvernement par la force ? Cela s\u2019est d\xE9j\xE0 produit \u2014 la fin de la IVe R\xE9publique est venue de la tentative de coup d\u2019\xC9tat de militaires fran\xE7ais et de colons en Alg\xE9rie. Certes, le gouvernement semble ",
            { link: "prendre la possibilit\xE9 au s\xE9rieux", href: BUNKER },
            ". Mais m\xEAme si les manifestants parvenaient \xE0 faire fuir Macron, on ne voit pas bien comment cette victoire symbolique se traduirait en prise de pouvoir concr\xE8te."
          ]
        },
        {
          kind: "p",
          runs: [
            "Pour l\u2019instant, je pense qu\u2019un essoufflement complet est peu probable. Le sc\xE9nario le plus probable est que cela continue un certain temps, avec une participation en baisse lente et quelques petites concessions obtenues \xE7\xE0 et l\xE0. L\u2019engagement de la plupart des gens se limitera \xE0 une marche th\xE9rapeutique, mais les personnes politis\xE9es ici d\xE9velopperont de nouvelles associations et joueront un r\xF4le d\xE9terminant dans les mouvements \xE0 venir, comme les anciens Gilets jaunes l\u2019ont fait ici, et les soixante-huitards avant eux."
          ]
        },
        {
          kind: "p",
          runs: [
            "Mais peut-\xEAtre, juste peut-\xEAtre, la menace d\u2019un gouvernement fasciste \xE0 venir et le souvenir de tant de r\xE9sultats d\xE9cevants par le pass\xE9 serviront-ils \xE0 concentrer les esprits et \xE0 durcir les c\u0153urs \xE0 temps pour exploiter leur avantage actuel et obtenir des victoires durables et significatives. Et de m\xEAme que la simple ",
            { em: "r\xE9sistance" },
            " en France s\u2019est d\xE9j\xE0 propag\xE9e comme une tra\xEEn\xE9e de poudre \xE0 travers l\u2019Europe, une v\xE9ritable victoire en France pourrait bien \xEAtre ce qui d\xE9clenche un incendie embrasant le vieux monde et inaugurant le nouveau."
          ]
        },
        {
          kind: "p",
          runs: [
            "Je vous laisse avec cette citation (tr\xE8s largement paraphras\xE9e) d\u2019un film classique, que j\u2019ai regard\xE9 pour la premi\xE8re fois r\xE9cemment :"
          ]
        },
        QUOTE
      ]
    },
    {
      id: "data",
      title: "Probl\xE8mes de donn\xE9es",
      blocks: [
        {
          kind: "p",
          runs: [
            "La plus grande difficult\xE9 a \xE9t\xE9 de trouver des sources de donn\xE9es fiables. Je veux en particulier souligner quelques probl\xE8mes avec les donn\xE9es sur les bless\xE9s."
          ]
        },
        {
          kind: "p",
          runs: [
            "La police est la seule \xE0 publier des chiffres officiels, mais elle ne distingue pas les blessures accidentelles et auto-inflig\xE9es de celles caus\xE9es par les manifestants, ni la gravit\xE9 des blessures. Une bonne fa\xE7on d\u2019enrichir ces donn\xE9es serait peut-\xEAtre de les comparer aux chiffres des arr\xEAts de travail pour accident, mais je ne sais pas quand ni o\xF9 ceux-ci pourraient \xEAtre publi\xE9s (et il faudrait probablement les comparer \xE0 une base de r\xE9f\xE9rence hors soul\xE8vement pour identifier un \xE9ventuel exc\xE8s). \xC0 l\u2019inverse, il n\u2019existe aucun chiffre officiel sur les violences subies par les manifestants. Les d\xE9c\xE8s sont \xE9videmment assez faciles \xE0 v\xE9rifier, mais les causes exactes peuvent \xEAtre floues. Pour les blessures, les donn\xE9es les plus fiables sont compil\xE9es par le Pr Laurent Thines et fournissent le plancher des blessures graves v\xE9rifi\xE9es. Certains collectifs locaux de street medics publient le nombre de personnes soign\xE9es apr\xE8s les grandes manifestations, mais beaucoup de ces cas concernent des choses relativement b\xE9nignes du type \xAB s\xE9rum physiologique pour rincer le gaz lacrymog\xE8ne \xBB ; \xE0 l\u2019inverse, beaucoup de personnes qui re\xE7oivent du s\xE9rum ou une gicl\xE9e de Maalox pour la m\xEAme chose ne seront pas comptabilis\xE9es ; et le paysage des street medics est tr\xE8s fragment\xE9, plusieurs groupes op\xE9rant souvent sur les m\xEAmes manifestations sans tous publier leurs chiffres ensuite."
          ]
        },
        {
          kind: "p",
          runs: [
            "Les dommages sont un autre cas d\xE9licat, et l\u2019un des plus politis\xE9s. Des chiffres tr\xE8s larges sont publi\xE9s peu apr\xE8s les faits, mais je soup\xE7onne qu\u2019en attendant un peu, on pourrait d\xE9terminer un plancher plus r\xE9aliste en examinant les montants r\xE9els des d\xE9clarations d\u2019assurance (m\xEAme si cela exclurait peut-\xEAtre les petits commerces non assur\xE9s). Et les estimations des co\xFBts de maintien de l\u2019ordre doivent \xEAtre prises comme tr\xE8s approximatives : elles sont surtout obtenues en estimant le co\xFBt par escadron de CRS d\xE9ploy\xE9, puis en l\u2019extrapolant aux effectifs annonc\xE9s. Cela recoupe aussi le probl\xE8me des donn\xE9es sur les bless\xE9s, car nous ne pouvons pas estimer le co\xFBt des arr\xEAts de travail qui en d\xE9coulent (qu\u2019ils concernent des policiers, des manifestants ou des passants)."
          ]
        },
        {
          kind: "p",
          runs: [
            "De toute \xE9vidence, tous ces probl\xE8mes s\u2019intensifient lorsqu\u2019on remonte \xE0 des \xE9v\xE9nements historiques."
          ]
        }
      ]
    },
    {
      id: "method",
      title: "Comment j\u2019ai fait ceci",
      blocks: [
        {
          kind: "p",
          runs: [
            "Ce projet a commenc\xE9 comme une exp\xE9rience personnelle de \xAB vibe-coding \xBB (c\u2019est-\xE0-dire du d\xE9veloppement it\xE9ratif avec un LLM, en essayant de ne pas toucher soi-m\xEAme au code)."
          ]
        },
        {
          kind: "p",
          runs: [
            "Les graphiques sont rendus avec Chart.js. J\u2019en ai fait \xE0 la main par le pass\xE9, et c\u2019est assez fastidieux ; pouvoir faire convertir des instructions en langage naturel en syntaxe Chart.js par le LLM est donc assez incroyable."
          ]
        },
        {
          kind: "p",
          runs: [
            "J\u2019ai utilis\xE9 MiniMax M3.1 Flash pour la recherche et DeepSeek V4.1 Flash pour le code \u2014 merci la Chine ! Vous pouvez consulter l\u2019int\xE9gralit\xE9 de mes transcriptions de d\xE9veloppement ici :"
          ]
        },
        {
          kind: "ul",
          items: [
            [{ link: "d\xE9veloppement initial", href: "transcript-1.md" }],
            [{ link: "choix du type de graphique", href: "transcript-2.md" }],
            [
              {
                link: "ajout de comparaisons et de traduction",
                href: "transcript-3.md"
              }
            ],
            [{ link: "revue du code", href: "transcript-4.md" }],
            [{ link: "examen des sources", href: "transcript-5.md" }]
          ]
        },
        {
          kind: "p",
          runs: [
            "Ce projet est h\xE9berg\xE9 sur ",
            { link: "GitHub Pages", href: PAGES },
            ". Vous pouvez consulter le code ",
            { link: "ici", href: REPO },
            "."
          ]
        },
        {
          kind: "p",
          runs: [
            "La premi\xE8re version de ce projet m\u2019a pris un peu plus d\u2019une journ\xE9e d\u2019allers-retours assez intenses."
          ]
        }
      ]
    }
  ]
};
function inline(run) {
  if (typeof run === "string") return document.createTextNode(run);
  if ("em" in run) {
    const em = document.createElement("em");
    em.textContent = run.em;
    return em;
  }
  const a = document.createElement("a");
  a.href = run.href;
  a.textContent = run.link;
  a.rel = "noopener noreferrer";
  if (/^https?:/i.test(run.href)) a.target = "_blank";
  return a;
}
function block(b) {
  if (b.kind === "p") {
    const p = document.createElement("p");
    p.append(...b.runs.map(inline));
    return p;
  }
  if (b.kind === "ul") {
    const ul = document.createElement("ul");
    for (const item of b.items) {
      const li = document.createElement("li");
      li.append(...item.map(inline));
      ul.append(li);
    }
    return ul;
  }
  const quote = document.createElement("blockquote");
  quote.className = "about-quote";
  for (const para of b.paras) {
    const p = document.createElement("p");
    p.append(...para.map(inline));
    quote.append(p);
  }
  const by = document.createElement("footer");
  by.append(...b.by.map(inline));
  quote.append(by);
  return quote;
}
function group(sub, open) {
  const details = document.createElement("details");
  details.className = "about-group";
  details.dataset.about = sub.id;
  details.open = open.get(sub.id) ?? sub.id === OPEN_ID;
  const summary = document.createElement("summary");
  summary.className = "about-summary";
  const title = document.createElement("h3");
  title.className = "about-title";
  title.textContent = sub.title;
  summary.append(title);
  const body = document.createElement("div");
  body.className = "about-body";
  for (const b of sub.blocks) body.append(block(b));
  details.append(summary, body);
  return details;
}
function callout(lang) {
  const p = document.createElement("p");
  p.className = "callout callout--positive";
  p.setAttribute("role", "note");
  p.textContent = CALLOUT[lang];
  return p;
}
function renderAbout(host = document.getElementById("about")) {
  if (!host) return;
  const lang = localeMeta().meta.htmlLang;
  const open = /* @__PURE__ */ new Map();
  for (const el2 of host.querySelectorAll(
    "details[data-about]"
  )) {
    const id = el2.dataset.about;
    if (id) open.set(id, el2.open);
  }
  host.setAttribute("aria-label", SECTION_LABEL[lang]);
  const subs = ABOUT[lang];
  const frag = document.createDocumentFragment();
  frag.append(callout(lang));
  for (const sub of subs) frag.append(group(sub, open));
  host.replaceChildren(frag);
}

// src/client/page.ts
var $ = (id) => document.getElementById(id);
function tag(name, className, text) {
  const el2 = document.createElement(name);
  if (className) el2.className = className;
  if (text !== void 0) el2.textContent = text;
  return el2;
}
function header(id, s) {
  const host = $(id);
  if (!host) return;
  host.replaceChildren(
    tag("h2", "sec-title", s.title),
    tag("p", "sec-blurb", s.blurb)
  );
}
function note(id, text) {
  const host = $(id);
  if (!host) return;
  host.textContent = text;
}
function disclaimer() {
  const host = $("disclaimer");
  if (!host) return;
  host.textContent = t().disclaimer.body;
}
function renderChrome() {
  const m = localeMeta();
  document.title = m.meta.title;
  disclaimer();
  renderAbout();
  header("hdr-a", m.sections.a);
  header("hdr-a", m.sections.a);
  header("hdr-b", m.sections.b);
  header("hdr-c", m.sections.c);
  header("hdr-cp", m.sections.cp);
  note("note-c", m.sections.c.note ?? "");
  note("note-cp", m.sections.cp.note ?? "");
}

// src/client/sources.ts
var BOX_TITLE = { en: "Sources and method", fr: "Sources et m\xE9thode" };
var INTRO = {
  en: "Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.",
  fr: "Compil\xE9 par une IA \xE0 partir des sources ci-dessous ; aucun chiffre ici n\u2019est une mesure primaire r\xE9alis\xE9e pour cette page. Lorsqu\u2019un mouvement dispose d\u2019un d\xE9compte officiel, le minist\xE8re de l\u2019Int\xE9rieur est la source des interpellations et des bless\xE9s parmi les forces, les syndicats publiant la foule concurrente. Les d\xE9comptes qui n\u2019ont exist\xE9 que sous forme de br\xE8ves quotidiennes dispers\xE9es ont \xE9t\xE9 additionn\xE9s \xE0 la main : c\u2019est l\xE0 que se concentre l\u2019essentiel de l\u2019erreur."
};
var FOOT = {
  en: "Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C\u2032 x-axis was set by the longest episode. Both were replaced \u2014 C plots raw counts on a shared log axis, and C\u2032 is capped at week 7. The blockade series counts establishments where pupils could not attend normally; its band runs from the ministry count to the union count, and the union's count also includes administratively closed schools. The Toussaint holiday (17 Oct \u2013 1 Nov) is drawn dotted: no lyc\xE9e was in session, so the figure did not exist. Nothing here has been through external review.",
  fr: "Ce n\u2019est pas une source, mais cela porte la lecture : dans les brouillons ant\xE9rieurs, l\u2019indice de la section C divisait chaque s\xE9rie par son premier chiffre, et l\u2019axe des x de C\u2032 \xE9tait fix\xE9 par l\u2019\xE9pisode le plus long. Les deux ont \xE9t\xE9 remplac\xE9s \u2014 C trace des effectifs bruts sur un axe log partag\xE9, et C\u2032 est plafonn\xE9 \xE0 la semaine 7. La s\xE9rie des blocages compte les \xE9tablissements o\xF9 les \xE9l\xE8ves ne pouvaient pas suivre normalement ; sa fourchette va du d\xE9compte minist\xE9riel au d\xE9compte syndical, et ce dernier inclut aussi les lyc\xE9es ferm\xE9s administrativement. Les vacances de la Toussaint (17 oct. \u2013 1 nov.) sont en pointill\xE9s : aucun lyc\xE9e n\u2019\xE9tait en cours, le chiffre n\u2019existait donc pas. Rien ici n\u2019a fait l\u2019objet d\u2019une relecture externe."
};
var MENTIONS_TITLE = {
  en: "Named in the reporting, not linked",
  fr: "Nomm\xE9s dans les articles, non li\xE9s"
};
var MENTIONS_BLURB = {
  en: "Organisations and authors whose figures this page uses second-hand, through the articles above. List them here rather than invent a URL for them.",
  fr: "Organisations et auteurs dont les chiffres sont repris de seconde main, via les articles ci-dessus. Les nommer ici plut\xF4t que d\u2019inventer une URL."
};
var both = (en, fr) => ({ en, fr });
function src(id, group2, label, url, what, date, dateEnd) {
  const s = { id, group: group2, label, url, what };
  if (date) s.date = date;
  if (dateEnd) s.dateEnd = dateEnd;
  return s;
}
var GROUPS = [
  {
    id: "official",
    title: {
      en: "The 2026 movement \u2014 state situation reports",
      fr: "Le mouvement de 2026 \u2014 points de situation de l\u2019\xC9tat"
    },
    blurb: {
      en: "Origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting in the next group rather than from a dataset. One pr\xE9fecture bulletin is included: 13 Oct had no national briefing, so the Ard\xE8che report is the only state account of that day.",
      fr: "Origine de chaque d\xE9compte d\u2019interpellations, de gardes \xE0 vue et de bless\xE9s parmi les forces, ainsi que du chiffre minist\xE9riel de foule. Publi\xE9s en points presse et points de situation du soir, non en s\xE9ries t\xE9l\xE9chargeables : les valeurs quotidiennes ont donc \xE9t\xE9 relev\xE9es dans la presse du groupe suivant, et non dans un jeu de donn\xE9es. Un communiqu\xE9 pr\xE9fectoral est inclus : le 13 oct. n\u2019a donn\xE9 lieu \xE0 aucun point national, le rapport ard\xE9chois est donc le seul compte rendu \xE9tatique de cette journ\xE9e."
    }
  },
  {
    id: "press",
    title: {
      en: "The 2026 movement \u2014 turnout, arrests, injuries",
      fr: "Le mouvement de 2026 \u2014 foule, interpellations, bless\xE9s"
    },
    blurb: {
      en: "Daily press reporting for 15 Sep \u2013 11 Nov 2026, plus the two disputes that shaped the charts: whether the 17 Oct policing operation was actually smaller than its predecessors, and how far the injured-protester total can be trusted.",
      fr: "La presse quotidienne du 1er oct. au 11 nov. 2026, plus les deux controverses qui ont fa\xE7onn\xE9 les graphiques : le dispositif du 17 oct. \xE9tait-il r\xE9ellement inf\xE9rieur aux pr\xE9c\xE9dents, et jusqu\u2019o\xF9 le total de bless\xE9s parmi les manifestants est-il fiable."
    }
  },
  {
    id: "blockades",
    title: {
      en: "The 2026 movement \u2014 school blockades and the school calendar",
      fr: "Le mouvement de 2026 \u2014 blocages de lyc\xE9es et calendrier scolaire"
    },
    blurb: {
      en: "The blockade line on the daily and weekly charts is a separate statistic: establishments where pupils could not attend normally \u2014 blocked, or closed by decision. The band runs from the ministry count to the union count, and the two publishers do not count the same thing: the union's \u201C\xE0 l'arr\xEAt\u201D includes schools closed administratively, so it is an upper bound. The Toussaint holiday (17 Oct \u2013 1 Nov) is drawn dotted because no lyc\xE9e was in session: the count did not exist, it was not zero. The Interior Ministry's daily tallies of establishments concerned and blocked are in the first group above.",
      fr: "La courbe des blocages des graphiques quotidien et hebdomadaire est une statistique \xE0 part : les \xE9tablissements o\xF9 les \xE9l\xE8ves ne pouvaient pas suivre normalement \u2014 bloqu\xE9s, ou ferm\xE9s par d\xE9cision. La fourchette va du d\xE9compte minist\xE9riel au d\xE9compte syndical, et les deux \xE9diteurs ne comptent pas la m\xEAme chose : le \xAB \xE0 l'arr\xEAt \xBB syndical inclut les lyc\xE9es ferm\xE9s administrativement, c'est donc une borne haute. Les vacances de la Toussaint (17 oct. \u2013 1 nov.) sont en pointill\xE9s car aucun lyc\xE9e n'\xE9tait en cours : le d\xE9compte n'existait pas, il n'\xE9tait pas nul. Les bilans quotidiens du minist\xE8re de l'Int\xE9rieur sur les \xE9tablissements concern\xE9s et bloqu\xE9s figurent dans le premier groupe ci-dessus."
    }
  },
  {
    id: "cost",
    title: {
      en: "The 2026 movement \u2014 damage and cost",
      fr: "Le mouvement de 2026 \u2014 dommages et co\xFBts"
    },
    blurb: {
      en: "Damage, damage cost and policing cost. None of this exists as a daily series: it is a handful of one-off assessments for 17\u201318 Oct and for the lyc\xE9e blockades, which is why most cells in those columns are empty rather than estimated.",
      fr: "Dommages, co\xFBt des dommages et co\xFBt du maintien de l\u2019ordre. Rien de tout cela n\u2019existe en s\xE9rie quotidienne : ce sont quelques bilans ponctuels pour les 17\u201318 oct. et pour les blocages de lyc\xE9es, d\u2019o\xF9 des colonnes le plus souvent vides plut\xF4t qu\u2019estim\xE9es."
    }
  },
  {
    id: "overseas",
    title: {
      en: "The 2026 movement \u2014 overseas",
      fr: "Le mouvement de 2026 \u2014 outre-mer"
    },
    blurb: {
      en: "Outre-mer La 1\xE8re is the only continuous reporting on the Guadeloupe, Martinique, R\xE9union, Guyane and Mayotte half of the protest count; the ministry bilan gives no territorial split.",
      fr: "Outre-mer La 1\xE8re est le seul suivi continu de la moiti\xE9 guadeloup\xE9enne, martiniquaise, r\xE9unionnaise, guyanaise et mahoraise du d\xE9compte ; le bilan minist\xE9riel ne fournit aucune ventilation territoriale."
    }
  },
  {
    id: "ref2026",
    title: {
      en: "The 2026 movement \u2014 reference pages",
      fr: "Le mouvement de 2026 \u2014 pages de r\xE9f\xE9rence"
    },
    blurb: {
      en: "Encyclopaedia and aggregator pages used to cross-check the 2026 chronology. Secondary: never used for a figure that a primary report in the groups above carries.",
      fr: "Pages encyclop\xE9diques et agr\xE9gateurs servant \xE0 recouper la chronologie de 2026. Secondaires : jamais utilis\xE9es pour un chiffre qu\u2019un article primaire des groupes pr\xE9c\xE9dents porte d\xE9j\xE0."
    }
  },
  {
    id: "mai68",
    title: { en: "May 1968", fr: "Mai 68" },
    blurb: {
      en: "Two counts exist for almost every 1968 day \u2014 prefecture and union \u2014 and they diverge by a factor of four on 13 May. Both are plotted.",
      fr: "Deux d\xE9comptes existent pour presque chaque journ\xE9e de 1968 \u2014 pr\xE9fecture et syndicats \u2014 et ils divergent d\u2019un facteur quatre le 13 mai. Les deux sont trac\xE9s."
    }
  },
  {
    id: "cpe",
    title: { en: "CPE, 2006", fr: "CPE, 2006" },
    blurb: {
      en: "The first movement in the comparison with a usable daily series. The 16\u201318 March enforcement counts are Paris-only and are marked as such.",
      fr: "Le premier mouvement de la comparaison dot\xE9 d\u2019une s\xE9rie quotidienne exploitable. Les d\xE9comptes r\xE9pressifs des 16\u201318 mars sont strictement parisiens et signal\xE9s comme tels."
    }
  },
  {
    id: "gj",
    title: { en: "Gilets jaunes, 2018\u201319", fr: "Gilets jaunes, 2018\u20132019" },
    blurb: {
      en: "Turnout was published act by act for 44 acts; the custody and injury counts were not, which is why the enforcement lines stop at week 3.",
      fr: "La foule a \xE9t\xE9 publi\xE9e acte par acte sur 44 actes ; les d\xE9comptes de gardes \xE0 vue et de bless\xE9s non, d\u2019o\xF9 l\u2019arr\xEAt des courbes r\xE9pressives \xE0 la semaine 3."
    }
  },
  {
    id: "nahel",
    title: {
      en: "Nahel Merzouk, June\u2013July 2023",
      fr: "Nahel Merzouk, juin\u2013juillet 2023"
    },
    blurb: {
      en: "The only episode here with a consolidated official total, via the S\xE9nat inquiry; the four nights themselves are counted day by day from press and encyclopaedia summaries.",
      fr: "Le seul \xE9pisode disposant d\u2019un total officiel consolid\xE9, via l\u2019enqu\xEAte du S\xE9nat ; les quatre nuits elles-m\xEAmes sont d\xE9compt\xE9es jour par jour \xE0 partir de la presse et des synth\xE8ses encyclop\xE9diques."
    }
  },
  {
    id: "retraites",
    title: { en: "Pensions, 2023", fr: "Retraites, 2023" },
    blurb: {
      en: "Ministry and union pairs for each national action day, 19 Jan \u2013 6 Jun 2023.",
      fr: "Les couples minist\xE8re / syndicats de chaque journ\xE9e nationale d\u2019action, du 19 janv. au 6 juin 2023."
    }
  },
  {
    id: "rn2024",
    title: {
      en: "Anti-RN marches, June 2024",
      fr: "Marches anti-RN, juin 2024"
    },
    blurb: {
      en: "Kept separate because the 15\u201316 June 2024 marches are usually folded into the pensions series; they are a different mobilisation with a different organiser base.",
      fr: "Groupe distinct car les marches des 15\u201316 juin 2024 sont souvent rattach\xE9es \xE0 la s\xE9rie retraites ; c\u2019est une mobilisation diff\xE9rente, avec une base d\u2019organisateurs diff\xE9rente."
    }
  },
  {
    id: "bloquons",
    title: {
      en: "\xAB Bloquons tout \xBB, September\u2013October 2025",
      fr: "\xAB Bloquons tout \xBB, septembre\u2013octobre 2025"
    },
    blurb: {
      en: "The closest precedent to 2026 and the reason the 2026 figures are shown as a band: the ministry revised its own 10 Sep count upward during the evening, from 175,000 to 197,000.",
      fr: "Le pr\xE9c\xE9dent le plus proche de 2026, et la raison pour laquelle les chiffres de 2026 sont trac\xE9s en fourchette : le minist\xE8re a r\xE9vis\xE9 son propre d\xE9compte du 10 sept. en cours de soir\xE9e, de 175 000 \xE0 197 000."
    }
  }
];
var SOURCES = [
  /* ---------------------- 2026 — school blockades and the school calendar */
  src(
    "service-public-vacances",
    "blockades",
    "Service-Public \u2014 \xAB Calendrier des vacances scolaires 2026-2027 \xBB",
    "https://www.service-public.gouv.fr/particuliers/actualites/A18563",
    both(
      "the Toussaint dates behind the dotted line: classes end Friday 16 October and resume Monday 2 November 2026, identical in zones A, B and C \u2014 which is why the holiday needs no zone logic.",
      "les dates de la Toussaint derri\xE8re la ligne en pointill\xE9s : fin des cours le vendredi 16 octobre et reprise le lundi 2 novembre 2026, identiques dans les zones A, B et C \u2014 d'o\xF9 l'absence de logique par zone."
    )
  ),
  src(
    "education-calendrier",
    "blockades",
    "Minist\xE8re de l\u2019\xC9ducation nationale \u2014 \xAB Calendrier scolaire : toutes les dates des cours et des vacances \xBB",
    "https://www.education.gouv.fr/calendrier-scolaire-toutes-les-dates-des-cours-et-des-vacances-100148",
    both(
      "the official end-of-class and return-to-school dates, read against the press calendar for the last day of classes (Friday 16 October).",
      "les dates officielles de fin de cours et de reprise, confront\xE9es au calendrier de presse pour le dernier jour de cours (vendredi 16 octobre)."
    )
  ),
  src(
    "education-bilans",
    "blockades",
    "Minist\xE8re de l\u2019\xC9ducation nationale \u2014 bilans d\u2019\xE9tablissements perturb\xE9s et ferm\xE9s",
    "https://www.education.gouv.fr",
    both(
      "the ministry's balances behind the blockade line: 45 blocked of 338 concerned (29 Sept), 735 establishments perturbed (3 Oct), 224 closed (8 Oct), 214 closed with 94.2% of lyc\xE9es open (13 Oct), 41 blocked at the rentr\xE9e (2 Nov) and 48 (3 Nov). Where the only figure published is \u201C\xE9tablissements perturb\xE9s\u201D or \u201Ccours suspendus\u201D rather than \u201Cbloqu\xE9s\u201D, the point is flagged as a wider measure \u2014 the tooltip says which.",
      "les bilans minist\xE9riels derri\xE8re la courbe des blocages : 45 bloqu\xE9s sur 338 concern\xE9s (29 sept.), 735 \xE9tablissements perturb\xE9s (3 oct.), 224 ferm\xE9s (8 oct.), 214 ferm\xE9s avec 94,2 % de lyc\xE9es ouverts (13 oct.), 41 bloqu\xE9s \xE0 la rentr\xE9e (2 nov.) et 48 (3 nov.). Lorsque le seul chiffre publi\xE9 est \xAB \xE9tablissements perturb\xE9s \xBB ou \xAB cours suspendus \xBB plut\xF4t que \xAB bloqu\xE9s \xBB, le point est signal\xE9 comme une mesure plus large \u2014 l'infobulle pr\xE9cise laquelle."
    )
  ),
  src(
    "usl-comptes",
    "blockades",
    "Union syndicale lyn\xE9enne \u2014 appels et d\xE9comptes syndicaux",
    "https://lyceens.org",
    both(
      "the organiser side of the blockade band: 640 (1 Oct), 1 800 schools \u201C\xE0 l'arr\xEAt\u201D (6 Oct), 1 000 (5 Nov). The union's own definition counts schools closed administratively as well as schools actually blocked, so its figure is an upper bound rather than a like-for-like count \u2014 which is why the band is wide and the tooltip says so.",
      "le c\xF4t\xE9 syndical de la fourchette des blocages : 640 (1er oct.), 1 800 lyc\xE9es \xAB \xE0 l'arr\xEAt \xBB (6 oct.), 1 000 (5 nov.). La d\xE9finition syndicale compte aussi les lyc\xE9es ferm\xE9s administrativement, et non seulement les lyc\xE9es bloqu\xE9s : son chiffre est une borne haute plut\xF4t qu'un d\xE9compte comparable \u2014 d'o\xF9 la largeur de la fourchette, que l'infobulle explique."
    )
  ),
  src(
    "franceinfo-blocages",
    "blockades",
    "Franceinfo \u2014 le suivi jour par jour des blocages de lyc\xE9es",
    "https://www.franceinfo.fr/societe/education/blocage-des-lycees/",
    both(
      "the live day-by-day counts used where no ministry balance was issued: 169 blockades in the morning of 1 Oct, 891 schools with classes suspended at midday on 6 Oct, more than 150 perturbed on 8 Oct, and \u201Cmore than 40 schools blocked\u201D on 10 Oct.",
      "les d\xE9comptes journaliers en direct utilis\xE9s l\xE0 o\xF9 aucun bilan minist\xE9riel n'a \xE9t\xE9 publi\xE9 : 169 blocages le matin du 1er oct., 891 \xE9tablissements avec cours suspendus \xE0 la mi-journ\xE9e du 6 oct., plus de 150 perturb\xE9s le 8 oct. et \xAB plus de 40 lyc\xE9es bloqu\xE9s \xBB le 10 oct."
    )
  ),
  /* ------------------------------------------- 2026 — ministry briefings */
  src(
    "interieur",
    "official",
    "Minist\xE8re de l\u2019Int\xE9rieur",
    "https://www.interieur.gouv.fr/",
    both(
      "origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series.",
      "origine de chaque d\xE9compte d\u2019interpellations, de gardes \xE0 vue et de bless\xE9s parmi les forces, ainsi que du chiffre minist\xE9riel de foule. Publi\xE9s en points presse et points de situation du soir, non en s\xE9ries t\xE9l\xE9chargeables."
    )
  ),
  src(
    "ardeche-13oct",
    "official",
    "Pr\xE9fecture de l\u2019Ard\xE8che \u2014 \xAB Mobilisation en Ard\xE8che \u2013 mardi 13 octobre 2026 \u2013 point de situation \xE0 17 h \xBB",
    "https://www.ardeche.gouv.fr/Actualites/Actualites-2026/Mobilisation-en-Ardeche-Mardi-13-octobre-2026-Point-de-situation-a-17-h",
    both(
      "the departmental control case: peak of 130 in Privas, 120 in Annonay, 60 in Tournon-sur-Rh\xF4ne and 600 in Aubenas (student counts included), no school blocked, no violence and no damage, two procedures for insults against officers, 100+ police mobilised. Read against the national aggregate as evidence that a day can be busy in one department and uneventful in the rest.",
      "le cas de contr\xF4le d\xE9partemental : pic de 130 \xE0 Privas, 120 \xE0 Annonay, 60 \xE0 Tournon-sur-Rh\xF4ne et 600 \xE0 Aubenas (lyc\xE9ens inclus), aucun \xE9tablissement bloqu\xE9, aucune violence ni d\xE9gradation, deux proc\xE9dures pour outrages, plus de cent policiers mobilis\xE9s. \xC0 lire face \xE0 l\u2019agr\xE9gat national : une journ\xE9e peut \xEAtre charg\xE9e dans un d\xE9partement et calme ailleurs."
    ),
    "2026-10-13"
  ),
  /* 17 Oct 2026 — the injury series for that day. Read as a stack, not a list:
     the ministry figure (forces only) at the bottom, encyclopaedic / militant
     tallies above it, the medical register as the documented floor. */
  src(
    "bfmtv-bilan-17oct",
    "press",
    "BFMTV \u2014 \xAB Violences du 17 octobre : le minist\xE8re de l\u2019Int\xE9rieur recense 2 397 interpellations, 997 policiers et gendarmes bless\xE9s dont 7 graves \xBB",
    "https://www.bfmtv.com/police-justice/violences-du-7-octobre-le-ministere-de-l-interieur-recense-2-397-interpellations-997-policiers-et-gendarmes-blesses-dont-7-graves_AD-202610180350.html",
    both(
      "the only consolidated state tally for the day: 2,397 arrests and 997 police and gendarmes injured, 7 seriously. It counts forces only \u2014 no protester figure \u2014 which is why the protest-injury series has no official anchor.",
      "le seul bilan \xE9tatique consolid\xE9 de la journ\xE9e : 2 397 interpellations et 997 policiers et gendarmes bless\xE9s, dont 7 graves. Il ne compte que les forces \u2014 aucun chiffre de manifestants bless\xE9s \u2014 d\u2019o\xF9 l\u2019absence d\u2019ancrage officiel pour la s\xE9rie."
    ),
    "2026-10-18"
  ),
  src(
    "mediacites-toulouse-17oct",
    "press",
    "M\xE9diacit\xE9s \u2014 \xAB Plus de 130 bless\xE9s parmi les manifestants du 17 octobre \xE0 Toulouse \xBB",
    "https://www.mediacites.fr/enquete/toulouse/2026/10/23/plus-de-130-blesses-parmi-les-manifestants-du-17-octobre-a-toulouse/",
    both(
      "the single largest city count for the day: 130+ people treated in Toulouse, mostly after police injuries, set against the prefecture\u2019s \u201Ca dozen or so\u201D officers hurt and the police\u2019s 70 \u201Cbruised\u201D. The treated-per-serious-case ratio that drives the reasoned ceiling comes from here.",
      "le plus gros d\xE9compte municipal de la journ\xE9e : plus de 130 personnes prises en charge \xE0 Toulouse, pour la plupart bless\xE9es par les forces de l\u2019ordre, face aux \xAB une dizaine \xBB d\u2019effectifs bless\xE9s de la pr\xE9fecture et aux 70 agents \xAB contusionn\xE9s \xBB de la police. C\u2019est d\u2019ici que vient le ratio pris-en-charge / cas grave qui fonde le plafond raisonn\xE9."
    ),
    "2026-10-23"
  ),
  src(
    "wikifr-17oct",
    "press",
    "Wikip\xE9dia \u2014 \xAB Manifestations du 17 octobre 2026 en France \xBB",
    "https://fr.wikipedia.org/wiki/Manifestations_du_17_octobre_2026_en_France",
    both(
      "the per-city pr\xE9fecture tallies used for the bottom-up sum: Bordeaux 23 injured (15 forces), Clermont-Ferrand 9 (5 forces), Dijon 3, Metz 6 (2 forces), Nancy 23 (2 seriously), Rouen 17, plus Paris 12 and Lyon 4 among the serious cases. Also the running casualty total of the movement as a whole.",
      "les bilans pr\xE9fectoraux par ville utilis\xE9s pour la somme ascendante : Bordeaux 23 bless\xE9s (dont 15 forces), Clermont-Ferrand 9 (5 forces), Dijon 3, Metz 6 (2 forces), Nancy 23 (dont 2 graves), Rouen 17, plus Paris 12 et Lyon 4 parmi les cas graves. Aussi le d\xE9compte courant des bless\xE9s du mouvement."
    )
  ),
  src(
    "wiki-en-17oct-riots",
    "press",
    "Wikipedia \u2014 \xAB 17 October riots \xBB",
    "https://en.wikipedia.org/wiki/17_October_riots",
    both(
      "the \u201C400+ civilians\u201D injured figure in the infobox, tagged citation needed \u2014 so it is a published high bound, not a sourced one. Its 1,000+ forces figure sits on the same line and is equally uncited, which is why the ministry number is preferred for that series.",
      "le chiffre de \xAB 400+ civils \xBB bless\xE9s de l\u2019infobox, marqu\xE9 \xAB citation needed \xBB : une borne haute publi\xE9e, non sourc\xE9e. Le \xAB 1 000+ \xBB de forces figure sur la m\xEAme ligne et n\u2019est pas davantage sourc\xE9, d\u2019o\xF9 la pr\xE9f\xE9rence donn\xE9e au chiffre minist\xE9riel pour cette s\xE9rie."
    )
  ),
  src(
    "mediaclub-thines",
    "press",
    "Le Club de Mediapart (Jonathan Gensburger) \u2014 \xAB Violences d\u2019\xC9tat \xBB",
    "https://blogs.mediapart.fr/jonathan-gensburger/blog/111126/violences-d-etat",
    both(
      "the full Thines register, stopped 5 Nov: 79 victims \u2014 78 seriously injured plus one death \u2014 of whom 55 fall on 17 Oct (54 seriously injured: 5 eyes, 5 cranio-facial, 2 amputations, 42 other serious wounds). Documents the floor; the author states plainly that it is neither an official toll nor a judicial expertise.",
      "le relev\xE9 Thines complet, arr\xEAt\xE9 au 5 nov. : 79 victimes \u2014 78 bless\xE9s graves et un d\xE9c\xE8s \u2014 dont 55 le 17 oct. (54 bless\xE9s graves : 5 yeux, 5 traumatismes cranio-faciaux, 2 amputations, 42 autres blessures graves). Documente le plancher ; l\u2019auteur pr\xE9cise qu\u2019il ne s\u2019agit ni d\u2019un bilan officiel ni d\u2019une expertise judiciaire."
    ),
    "2026-11-11"
  ),
  src(
    "mediapart-blesses-17oct",
    "press",
    "Mediapart \u2014 \xAB \u201CJ\u2019ai cru mourir\u201D : enqu\xEAte sur les bless\xE9s du 17 octobre \xBB",
    "https://www.mediapart.fr/journal/france/231026/j-ai-cru-mourir-enquete-sur-les-blesses-du-17-octobre",
    both(
      "the qualitative case file behind the day\u2019s serious injuries \u2014 femoral artery severed by a grenade, dozens gravely hurt while peaceful \u2014 with no total, which is the point: even the paper that documented the day most closely declines to give one.",
      "le dossier de cas derri\xE8re les blessures graves du jour \u2014 art\xE8re f\xE9morale sectionn\xE9e par une grenade, dizaines de bless\xE9s graves alors qu\u2019ils manifestaient pacifiquement \u2014 sans total, ce qui est pr\xE9cis\xE9ment l\u2019int\xE9r\xEAt : m\xEAme le journal qui a le plus document\xE9 la journ\xE9e s\u2019abstient d\u2019en donner un."
    ),
    "2026-10-23"
  ),
  src(
    "canard-mauvais-oeil",
    "press",
    "Le Canard encha\xEEn\xE9 \u2014 \xAB Violences polici\xE8res : les manifestants ont le mauvais \u0153il \xBB",
    "https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil",
    both(
      "the explicit statement that no official figure for serious injuries has ever been published since the movement began, and the method note: Thines built his register from national and local press plus militant blogs, and 127 IGPN referrals are open.",
      "la mention explicite qu\u2019aucun chiffre officiel de bless\xE9s graves n\u2019a jamais \xE9t\xE9 publi\xE9 depuis le d\xE9but du mouvement, et la note de m\xE9thode : Thines a b\xE2ti son relev\xE9 dans la presse nationale, locale et les blogs militants, 127 saisines de l\u2019IGPN \xE9tant ouvertes."
    ),
    "2026-11-10"
  ),
  src(
    "contre-attaque-20oct",
    "press",
    "Contre-Attaque \u2014 \xAB Terrorisme d\u2019\xC9tat : le 17 octobre la police a fait couler le sang \xBB",
    "https://contre-attaque.net/2026/10/20/terrorisme-detat-le-17-octobre-la-police-a-fait-couler-le-sang/",
    both(
      "the earliest case-by-case sweep (Paris, Rennes, Grenoble, Limoges, Caen, Nancy, Marseille) and the phrase \u201Ca repression that touched thousands\u201D \u2014 the source of the upper part of the band. It gives no total, only an invitation for victims to come forward.",
      "le premier recensement cas par cas (Paris, Rennes, Grenoble, Limoges, Caen, Nancy, Marseille) et la formule d\u2019une r\xE9pression \xAB qui a touch\xE9 des milliers de personnes \xBB \u2014 d\u2019o\xF9 vient le haut de la fourchette. Aucun total, seulement un appel \xE0 t\xE9moins."
    ),
    "2026-10-20"
  ),
  src(
    "contre-attaque-23oct",
    "press",
    "Contre-Attaque \u2014 \xAB 17 Octobre : un carnage policier sans pr\xE9c\xE9dent, nouveau recensement de la sauvagerie polici\xE8re \xBB",
    "https://contre-attaque.net/2026/10/23/17-octobre-un-carnage-policier-sans-precedent-nouveau-recensement-de-la-sauvagerie-policiere/",
    both(
      "\u201Ctwo cardiac arrests, an unprecedented number of mutilations in a few hours, hundreds of serious injuries\u201D \u2014 the militant figure that sets the top of the band, and the claim of a second death on the day, which no register corroborates and which the chart therefore does not carry.",
      "\xAB deux arr\xEAts cardiaques, un nombre de mutilations sans pr\xE9c\xE9dent en quelques heures, des centaines de bless\xE9s graves \xBB \u2014 le chiffre militant qui fixe le haut de la fourchette, et la revendication d\u2019un second mort ce jour-l\xE0, que nul relev\xE9 ne corrobore et que le graphique ne retient donc pas."
    ),
    "2026-10-23"
  ),
  src(
    "ici-avignon-17oct",
    "press",
    "ICI \u2014 \xAB Manifestation du 17 octobre \xE0 Avignon : 21 interpellations, 9 policiers et au moins 5 civils bless\xE9s \xBB",
    "https://www.ici.fr/provence-alpes-cote-d-azur/vaucluse-84/avignon/manifestation-du-17-octobre-a-avignon-21-interpellations-9-policiers-et-au-moins-5-civils-blesses-8087735",
    both(
      "Avignon\u2019s pr\xE9fecture tally, one of the few that separates civilians from forces: 5 civilians hurt for 2,000 demonstrators. Note the publisher revised the officer count downward from 18 to 9 between its first and second version \u2014 a reminder that even same-day figures move.",
      "le bilan pr\xE9fectoral d\u2019Avignon, l\u2019un des rares \xE0 s\xE9parer civils et forces : 5 civils bless\xE9s pour 2 000 manifestants. \xC0 noter : le journal a r\xE9vis\xE9 \xE0 la baisse le nombre de policiers bless\xE9s, de 18 \xE0 9, entre ses deux versions \u2014 rappel que m\xEAme les chiffres du jour bougent."
    ),
    "2026-10-21"
  ),
  src(
    "ici-strasbourg-17oct",
    "press",
    "ICI \u2014 \xAB Mobilisation du 17 octobre : 17 bless\xE9s et 27 interpellations \xE0 Strasbourg, le bilan s\u2019alourdit \xBB",
    "https://www.ici.fr/grand-est/alsace-cea/mobilisation-du-17-octobre-16-interpellations-a-strasbourg-et-11-blesses-selon-un-premier-bilan-5327220",
    both(
      "Strasbourg\u2019s revision in action: 11 injured and 16 arrests in the first evening bulletin, 17 and 27 the next day, with one man gravely head-injured near the pont du Corbeau. The URL still carries the original figures, which is why the entry cites the updated headline.",
      "la r\xE9vision strasbourgeoise en acte : 11 bless\xE9s et 16 interpellations au premier communiqu\xE9 du soir, 17 et 27 le lendemain, dont un homme gri\xE8vement touch\xE9 \xE0 la t\xEAte pr\xE8s du pont du Corbeau. L\u2019URL porte encore les chiffres d\u2019origine, d\u2019o\xF9 le titre mis \xE0 jour."
    ),
    "2026-10-17"
  ),
  /* ── optional: cross-checks for the severity breakdown and its limits ── */
  src(
    "monde-enquete-blessures",
    "press",
    "Le Monde \u2014 \xAB Hands torn off, broken bones, blinded eye: Le Monde investigates French protesters\u2019 injuries \xBB",
    "https://www.lemonde.fr/en/france/article/2026/11/05/hands-torn-off-broken-bones-blinded-eye-le-monde-investigates-french-protesters-injuries_6772405_7.html",
    both(
      "independent corroboration of the register\u2019s shape \u2014 three hands torn off, four eyes mutilated \u2014 described by Le Monde itself as \u201Ca preliminary and certainly underestimated count\u201D, with intermediate-force weapons implicated in nearly every case.",
      "corroboration ind\xE9pendante de la structure du relev\xE9 \u2014 trois mains arrach\xE9es, quatre yeux mutil\xE9s \u2014 que Le Monde qualifie lui-m\xEAme de d\xE9compte \xAB pr\xE9liminaire et certainement sous-estim\xE9 \xBB, les armes de force interm\xE9diaire \xE9tant en cause dans presque tous les cas."
    ),
    "2026-11-05"
  ),
  src(
    "prodpress-verification",
    "press",
    "PRODPRESS \u2014 \xAB Bless\xE9s des manifestations : les enqu\xEAtes documentent les cas, les bilans restent \xE0 consolider \xBB",
    "https://www.prodpress.eu/manifestations-blesses-bilan-coquerel-verification-2026/",
    both(
      "the cautionary counterweight: the same Thines count stood at 61 cases on 30 Oct and 79 on 5 Nov, so any figure is a snapshot; the site declines to validate the extrapolation to a national total, which is why the middle point is labelled an estimate rather than a count.",
      "le contrepoids m\xE9thodologique : le m\xEAme relev\xE9 Thines affichait 61 cas au 30 oct. et 79 au 5 nov., tout chiffre n\u2019\xE9tant donc qu\u2019une photographie ; le site refuse de valider l\u2019extrapolation \xE0 un total national, d\u2019o\xF9 le point milieu pr\xE9sent\xE9 comme une estimation, non un d\xE9compte."
    )
  ),
  /* ── Outstanding-figure verification, 12 Nov 2026 ───────────────────── */
  src(
    "senat-emeutes-2023",
    "official",
    "S\xE9nat \u2014 \xAB \xC9meutes de juin 2023 : comprendre, \xE9valuer, r\xE9agir \xBB",
    "https://www.senat.fr/salle-de-presse/communiques-de-presse/presse/10-04-2024/emeutes-de-juin-2023-comprendre-evaluer-reagir.html",
    both(
      "the Senate mission's headline figures for the Nahel riots: 672 communes affected, 45,000 security personnel mobilised, 50,000 \xE9meutiers estimated (Darmanin: 8,000\u201312,000; Brochand: 100,000\u2013200,000), 16,400 claims filed with insurers for \u20AC793 million, 2,500 buildings burnt or degraded including 168 schools and 105 mairies. Also the authority for the episode-level rioter estimates now used in the p band.",
      "les chiffres cl\xE9s de la mission du S\xE9nat sur les \xE9meutes de Nahel : 672 communes concern\xE9es, 45 000 personnels de s\xE9curit\xE9 mobilis\xE9s, 50 000 \xE9meutiers estim\xE9s (Darmanin : 8 000 \xE0 12 000 ; Brochand : 100 000 \xE0 200 000), 16 400 sinistres pour 793 millions d\u2019euros, 2 500 b\xE2timents incendi\xE9s ou d\xE9grad\xE9s dont 168 \xE9coles et 105 mairies. Tambi\xE9n l\u2019autorit\xE9 des estimations d\u2019\xE9meutiers d\xE9sormais port\xE9es par la bande p."
    ),
    "2024-04-10"
  ),
  src(
    "interieur-24oct-bilan",
    "official",
    "Minist\xE8re de l\u2019Int\xE9rieur \u2014 \xAB Bilan de la journ\xE9e de mobilisation nationale du 24 octobre 2026 \xBB",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-journee-de-mobilisation-nationale-du-24-octobre-2026",
    both(
      "the communiqu\xE9 behind every 2026 core figure: 24 Oct = 289 actions, 410,000 participants (110,000 Paris), provisional 7:30 a.m. bilan of 1,314 arrests and 53 forces injured \u201Cprovisoire \xE0 ce stade\u201D, 75 fire interventions, 24 shops pillaged, against 1,522 shops hit on 17 Oct; and the cross-references to 31 Oct (227 actions, 320,000) and 5 Nov (193 actions, 575,000 incl. 65,000 Paris).",
      "le communiqu\xE9 qui fonde tous les chiffres centraux de 2026 : 24 oct. = 289 actions, 410 000 participants (110 000 \xE0 Paris), bilan provisoire \xE0 7 h 30 de 1 314 interpellations et 53 bless\xE9s des forces \xAB provisoire \xE0 ce stade \xBB, 75 interventions incendie, 24 commerces pill\xE9s, contre 1 522 commerces touch\xE9s le 17 oct. ; renvois au 31 oct. (227 actions, 320 000) et au 5 nov. (193 actions, 575 000 dont 65 000 \xE0 Paris)."
    ),
    "2026-10-25"
  ),
  src(
    "france24-24oct-prov",
    "press",
    "France 24 \u2014 \xAB Mobilisation du 24 octobre : plus de 1 300 interpellations, une cinquantaine de policiers bless\xE9s \xBB",
    "https://www.france24.com/fr/france/20261025-mobilisation-du-24-octobre-plus-de-1-300-interpellations-une-cinquantaine-de-policiers-bless%C3%A9s",
    both(
      "the press rendering of the provisional 24 Oct bilan: 1,314 arrests and 53 forces injured. Establishes that the 53 is a first-overnight provisional figure, which is why the table keeps the consolidated 267 rather than widening to a 53\u2013267 band.",
      "le compte rendu presse du bilan provisoire du 24 oct. : 1 314 interpellations et 53 bless\xE9s des forces. \xC9tablit que le 53 est un chiffre provisoire de la nuit, ce qui justifie de conserver le 267 consolid\xE9 plut\xF4t que d'ouvrir une bande 53\u2013267."
    ),
    "2026-10-25"
  ),
  src(
    "franceinfo-24oct-final",
    "press",
    "Franceinfo \u2014 \xAB Manifestations du 24 octobre : 267 membres des forces de l\u2019ordre et 150 someplaceants ont \xE9t\xE9 bless\xE9s, dont trois gravement, annonce Laurent Nu\xF1ez \xBB",
    "https://www.franceinfo.fr/societe/manifestations/manifestations-du-24-octobre-267-membres-des-forces-de-l-ordre-et-150-manifestants-ont-ete-blesses-dont-trois-gravement-annonce-laurent-nunez_8253910.html",
    both(
      "the minister's consolidated 24 Oct figures: 267 forces injured, 150 protesters injured including 3 seriously, 1,435 arrests. Source of the two cells now carried for that date.",
      "les chiffres consolid\xE9s du 24 oct. annonc\xE9s par le ministre : 257... 267 bless\xE9s des forces de l\u2019ordre, 150 manifestants bless\xE9s dont 3 graves, 1 435 interpellations. Source des deux cellules port\xE9es pour cette date."
    ),
    "2026-10-26"
  ),
  src(
    "lsa-cci-bilan",
    "press",
    "LSA / CCI France \u2014 \xAB Manifestations d\u2019octobre : 1 milliard d\u2019euros de d\xE9g\xE2ts et 2 500 commerces touch\xE9s selon CCI France, les d\xE9tails ville par ville \xBB",
    "https://www.lsa-conso.fr/distributeurs-alimentaires/manifestations-doctobre-1-milliard-deuros-de-degats-et-2-500-commerces-touches-selon-cci-france-les-details-ville-par-ville.2HTRI7YOSJHP5E52ISPEQEF4KQ.html",
    both(
      "CCI France's 27 Oct tally, the basis of the new national damage cell: 2,488 businesses hit after 17 Oct plus 50 after 24 Oct, 1,161 heavily damaged, 643 still closed, cost of the degradations estimated at over \u20AC1bn on IFRAP's estimate. City detail: Marseille 500 (225 heavy), Paris/IDF 480 (240 degraded), Lyon\u2013Saint-\xC9tienne\u2013Roanne 300 (\u20AC20M), Bordeaux 158, Rennes 143, Nantes 59, Toulouse 41, Montpellier 56 (\u20AC1\u20132M). No separate Marseille or Paris damage amount.",
      "le bilan CCI France du 27 oct., base de la nouvelle cellule nationale de d\xE9g\xE2ts : 2 488 commerces touch\xE9s apr\xE8s le 17 oct. plus 50 apr\xE8s le 24 oct., 1 161 fortement d\xE9grad\xE9s, 643 encore ferm\xE9s, co\xFBt des d\xE9gradations estim\xE9 \xE0 plus d\u20191 milliard d\u2019euros selon l\u2019IFRAP. D\xE9tail par ville : Marseille 500 (225 lourds), Paris/IDF 480 (240 d\xE9grad\xE9s), Lyon\u2013Saint-\xC9tienne\u2013Roanne 300 (20 M\u20AC), Bordeaux 158, Rennes 143, Nantes 59, Toulouse 41, Montpellier 56 (1 \xE0 2 M\u20AC). Aucun montant distinct pour Marseille ni Paris."
    ),
    "2026-10-27"
  ),
  src(
    "leprogres-cci-rhone",
    "press",
    "Le Progr\xE8s \u2014 \xAB Rh\xF4ne 307 commerces impact\xE9s, 20 millions d\u2019euros de d\xE9g\xE2ts\u2026 Les cons\xE9quences des manifestations depuis le 17 octobre \xBB",
    "https://www.leprogres.fr/economie/2026/10/27/307-commerces-impactes-20-millions-d-euros-de-degats-les-consequences-des-manifestations-depuis-le-17-octobre",
    both(
      "the regional half of the CCI tally: 307 businesses hit in the Rh\xF4ne for \u20AC20M of damage, corroborating the Lyon\u2013Saint-\xC9tienne\u2013Roanne line independently of CCI France.",
      "la moiti\xE9 r\xE9gionale du bilan CCI : 307 commerces impact\xE9s dans le Rh\xF4ne pour 20 M\u20AC de d\xE9g\xE2ts, corroboration ind\xE9pendante de la ligne Lyon\u2013Saint-\xC9tienne\u2013Roanne."
    ),
    "2026-10-27"
  ),
  src(
    "lemonde-en-pensions-23mar",
    "press",
    "Le Monde \u2014 \xAB French pension protests: 457 arrested and 441 police injured on Thursday, minister reports \xBB",
    "https://www.lemonde.fr/en/france/article/2023/03/24/french-pension-protests-457-arrested-and-441-police-injured-on-thursday-minister-reports_6020504_7.html",
    both(
      "the consolidated 23 March 2023 enforcement figures \u2014 457 arrests, 441 security forces injured \u2014 which close the pensions episode's enforcement gap. Earlier statements that night had put the figures at 80+ arrests and 123 police injured, so the consolidated numbers are the ones plotted.",
      "les chiffres dcited de la r\xE9pression du 23 mars 2023 \u2014 457 interpellations, 441 bless\xE9s des forces \u2014 qui comblent le trou de donn\xE9es de r\xE9pression de l\u2019\xE9pisode pensions. Les statements de la soir\xE9e donnaient 80+ interpellations et 123 bless\xE9s, d\u2019o\xF9 le choix des chiffres consolid\xE9s."
    ),
    "2023-03-24"
  ),
  src(
    "france24-pensions-23mar",
    "press",
    "France 24 \u2014 \xAB At least 457 people arrested, 441 security forces injured in violent French pension protests \xBB",
    "https://www.france24.com/en/europe/20230324-at-least-457-people-arrested-441-security-forces-injured-in-violent-french-pension-protests",
    both(
      "independent confirmation of the 23 March totals, with Darmanin's evening statement of over 80 arrests and 123 police injured noted alongside, which is why the day is plotted at the consolidated figure.",
      "confirmation ind\xE9pendante des totaux du 23 mars, avec la d\xE9claration de Darmanin en soir\xE9e (plus de 80 interpellations, 123 bless\xE9s) rappel\xE9e en regard \u2014 d\u2019o\xF9 le choix du chiffre consolid\xE9."
    ),
    "2023-03-24"
  ),
  src(
    "enwiki-pensions-2023",
    "press",
    "Wikipedia \u2014 \xAB 2023 French pension reform strikes \xBB",
    "https://en.wikipedia.org/wiki/2023_French_pension_reform_strikes",
    both(
      "the chronology that fixes the pensions episode's weekly bands: 7 Mar 1.1\u20131.4M over 260+ protests; 11 Mar about 368,000, below the 800,000\u20131,000,000 expected; 15 Mar ministry 480,000 (37,000 Paris) against CGT 1.78M (450,000 Paris) over 200 protests; 19 Mar only hundreds; 23 Mar ministry 1.08M (119,000 Paris) against CGT 3.5M (800,000 Paris); 6 Apr 111 arrests and 154 police injured. It is also the source that shows 14 March was the eve, not the action day.",
      "la chronologie qui fixe les bandes de l\u2019\xE9pisode pensions : 7 mars 1,1\u20131,4 M sur plus de 260 manifestations ; 11 mars environ 368 000, loin des 800 000 \xE0 1 000 000 attendus ; 15 mars 480 000 minist\xE8re (37 000 Paris) contre 1,78 M CGT (450 000 Paris) sur 200 manifestations ; 19 mars quelques centaines ; 23 mars 1,08 M minist\xE8re (119 000 Paris) contre 3,5 M CGT (800 000 Paris) ; 6 avril 111 interpellations et 154 policiers bless\xE9s. C\u2019est aussi ce qui montre que le 14 mars \xE9tait la veille, pas le jour d\u2019action."
    ),
    "2026-10-22"
  ),
  src(
    "enwiki-cpe-2006",
    "press",
    "Wikipedia \u2014 \xAB 2006 youth protests in France \xBB",
    "https://en.wikipedia.org/wiki/2006_youth_protests_in_France",
    both(
      "the CPE series that is published at all: 7 Feb 200,000\u2013400,000 over 187 demonstrations; 28 Mar 1.055M (police) against 2.71M (unions) with 600 arrests; 4 Apr 1M (police) against 3.1M (CGT); 18 demonstrators injured on 16 March; and the CAJ totals of 4,500 arrests, 1,950 in garde \xE0 vue and 635 prosecutions. It gives no totals for 15 or 25 February, 4 or 11 March \u2014 the series does not exist, and the episode should say so.",
      "la seule s\xE9rie CPE qui soit publi\xE9e : 7 f\xE9vr. 200 000\u2013400 000 sur 187 manifestations ; 28 mars 1,055 M (police) contre 2,71 M (syndicats) et 600 interpellations ; 4 avr. 1 M (police) contre 3,1 M (CGT) ; 18 bless\xE9s le 16 mars ; totaux CAJ : 4 500 interpellations, 1 950 gardes \xE0 vue, 635 poursuites. Aucun total pour les 15 ou 25 f\xE9vrier, 4 ou 11 mars : la s\xE9rie n\u2019existe pas, et l\u2019\xE9pisode doit le dire."
    ),
    "2026-05-31"
  ),
  src(
    "frwiki-cpe-2006",
    "press",
    "Wikip\xE9dia \u2014 \xAB Mouvement contre le contrat premi\xE8re embauche de 2006 \xBB",
    "https://fr.wikipedia.org/wiki/Mouvement_contre_le_contrat_premi%C3%A8re_embauche_de_2006",
    both(
      "the French CPE account: 7 Feb nearly 400,000; 14 March 41,000 (police source); 16 March 447,500 (police) or 500,000\u2013800,000 (organisers); 28 March 1,055,000\u20133,000,000; 4 April 1\u20133 million. The 14 March figure is the one addition this pass makes to the episode.",
      "le compte rendu fran\xE7ais du CPE : 7 f\xE9vr. pr\xE8s de 400 000 ; 14 mars 41 000 (source police) ; 16 mars 447 500 (police) ou 500 000 \xE0 800 000 (organisateurs) ; 28 mars 1 055 000 \xE0 3 000 000 ; 4 avril 1 \xE0 3 millions. Le chiffre du 14 mars est le seul ajout de cette passe \xE0 l\u2019\xE9pisode."
    ),
    "2026-10-01"
  ),
  src(
    "enwiki-bloquons-tout",
    "press",
    "Wikipedia \u2014 \xAB Bloquons tout \xBB",
    "https://en.wikipedia.org/wiki/Bloquons_tout",
    both(
      "the movement's complete action calendar: 10 September (hundreds of actions, ring roads blocked in Bordeaux, Rennes, Nantes, Caen and Paris; participation 200,000\u2013300,000), 18 September (union strikes more important than the movement's own actions; 500,000 to one million followed), and 2 October as the third wave. It mentions no action on 21 September, which closes that supposed gap.",
      "le calendrier complet des actions du mouvement : 10 septembre (des centaines d\u2019actions, p\xE9riph\xE9riques bloqu\xE9s \xE0 Bordeaux, Rennes, Nantes, Caen et Paris ; participation de 200 000 \xE0 300 000), 18 septembre (les gr\xE8ves syndicales plus importantes que les actions du mouvement ; 500 000 \xE0 un million de participants) et 2 octobre comme troisi\xE8me vague. Aucune action au 21 septembre n\u2019y figure, ce qui ferme le faux manque."
    ),
    "2026-06-25"
  ),
  src(
    "frwiki-nahel-2023",
    "press",
    "Wikip\xE9dia \u2014 \xAB \xC9meutes cons\xE9cutives \xE0 la mort de Nahel Merzouk \xBB",
    "https://fr.wikipedia.org/wiki/%C3%89meutes_cons%C3%A9cutives_%C3%A0_la_mort_de_Nahel_Merzouk",
    both(
      "the ministry day table that confirms the episode's weekly sums exactly: arrests 31/207/875/1,311/773/157/72/16/20 = 3,462; police injured 24/174/317/162/42/3/\u2014/\u2014/1 = 723; 5,954 vehicles burnt; 1,092 buildings damaged; 2 deaths. It gives no crowd count for any riot night, and the Place de la R\xE9publique demonstration it mentions was called for 8 July.",
      "le tableau journalier du minist\xE8re qui confirme exactement les sommes hebdomadaires de l\u2019\xE9pisode : interpellations 31/207/875/1 311/773/157/72/16/20 = 3 462 ; policiers bless\xE9s 24/174/317/162/42/3/\u2014/\u2014/1 = 723 ; 5 954 v\xE9hicules incendi\xE9s ; 1 092 b\xE2timents d\xE9grad\xE9s ; 2 morts. Aucun d\xE9compte de foule pour aucune nuit, et la manifestation place de la R\xE9publique qu\u2019il mentionne \xE9tait pr\xE9vue pour le 8 juillet."
    ),
    "2026-10-22"
  ),
  src(
    "frwiki-gj-mouvement",
    "press",
    "Wikip\xE9dia \u2014 \xAB Mouvement des Gilets jaunes \xBB",
    "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
    both(
      "the per-act casualty figures behind the revised GJ_EXTRA: Act I 409 injured and 1 death (Lib\xE9ration: 287,710 demonstrators, one death, 409 injured); Act II 24 injured including 5 police with 103 interpellations (Le JDD); Act IV 1,385 interpellations and 974 gardes \xE0 vue (Le Figaro live), with ~89,000 agents mobilised.",
      "les chiffres de victimes par acte qui fondent le GJ_EXTRA r\xE9vis\xE9 : acte I 409 bless\xE9s et 1 mort (Lib\xE9ration : 287 710 manifestants, un mort, 409 bless\xE9s) ; acte II 24 bless\xE9s dont 5 policiers et 103 interpellations (Le JDD) ; acte IV 1 385 interpellations et 974 gardes \xE0 vue (Le Figaro live), avec environ 89 000 agents mobilis\xE9s."
    ),
    "2026-10-01"
  ),
  src(
    "frwiki-gj-deroulement",
    "press",
    "Wikip\xE9dia \u2014 \xAB D\xE9roulement du mouvement des Gilets jaunes \xBB",
    "https://fr.wikipedia.org/wiki/D%C3%A9roulement_du_mouvement_des_Gilets_jaunes",
    both(
      "the authoritative per-act table: all 33 ministry counts and all seven Le Nombre jaune counts, which confirm GJ_ACTS and GJ_ORGANISER_COUNTS line for line. It also records Act II's first figure of 106,301 revised eight days later to 166,000, and Act I's communiqu\xE9 of 117 interpellations with 73 gardes \xE0 vue and 409 injured.",
      "le tableau par acte de r\xE9f\xE9rence : les 33 chiffres du minist\xE8re et les sept comptes du Nombre jaune, qui confirment GJ_ACTS et GJ_ORGANISER_COUNTS ligne \xE0 ligne. Y figurent aussi le premier chiffre de l\u2019acte II (106 301) r\xE9vis\xE9 huit jours plus tard \xE0 166 000, et le communiqu\xE9 de l\u2019acte I : 117 interpellations dont 73 gardes \xE0 vue, 409 bless\xE9s."
    ),
    "2026-11-07"
  ),
  src(
    "lemonde-bloquons-10sep",
    "press",
    "Le Monde \u2014 \xAB Takeaways from France's \u2018Block Everything\u2019 protests: \u2018A lot of anger is building up around issues of social injustice\u2019 \xBB",
    "https://www.lemonde.fr/en/politics/article/2025/09/12/takeaways-from-france-s-block-everything-protests-a-lot-of-anger-is-building-up-around-issues-of-social-injustice_6745326_5.html",
    both(
      "the 10 September action count: 812 actions including 550 rallies and 262 blockades, 540 arrests and 415 people held in custody, 175,000 participants on the ministry's count. Explains why the file's \u201C596 rallies / 253 blockages\u201D is a different counting method, not a contradiction.",
      "le d\xE9compte des actions du 10 septembre : 812 actions dont 550 manifestations et 262 blocages, 540 interpellations et 415 personnes en garde \xE0 vue, 175 000 participants selon le minist\xE8re. Explique pourquoi les \xAB 596 actions / 253 blocages \xBB du fichier rel\xE8vent d\u2019une autre m\xE9thode de comptage et non d\u2019une contradiction."
    ),
    "2025-09-12"
  ),
  src(
    "rfi-bloquons-10sep",
    "press",
    "RFI \u2014 \xAB France: retour sur la journ\xE9e \u201CBloquons tout\u201D, qui a rassembl\xE9 200 000 manifestants \xBB",
    "https://www.rfi.fr/fr/france/20250910-en-direct-mouvement-bloquons-tout-des-nombreuses-arrestations-apr%C3%A8s-les-premi%C3%A8res-actions-partout-en-france",
    both(
      "the first-morning estimate for 10 September \u2014 200,000 \u2014 which brackets the ministry's revised 175,000\u2013197,000 and the 200,000\u2013300,000 encyclopaedic range and confirms that the episode's band [175,000, 250,000] is defensible.",
      "la premi\xE8re estimation du 10 septembre au matin \u2014 200 000 \u2014 qui encadre le chiffre minist\xE9riel r\xE9vis\xE9 de 175 000\u2013197 000 et la fourchette encyclop\xE9dique de 200 000 \xE0 300 000, et confirme que la bande [175 000, 250 000] de l\u2019\xE9pisode est d\xE9fendable."
    ),
    "2025-09-10"
  ),
  src(
    "lesechos-18sep",
    "press",
    "Les \xC9chos \u2014 \xAB Gr\xE8ve du 18 septembre : retour sur une journ\xE9e de mobilisation \xBB",
    "https://www.lesechos.fr/economie-france/conjoncture/direct-greve-du-18-septembre-les-fortes-perturbations-se-confirment-2186895",
    both(
      "the 18 September totals: more than 500,000 demonstrators per the Interior Ministry, 55,000 of them in Paris \u2014 the authority band already carried for the episode's w1, confirmed here against the union claim of one million.",
      "les totaux du 18 septembre : plus de 500 000clusousc d\xE9fileants selon le minist\xE8re de l\u2019Int\xE9rieur, dont 55 000 \xE0 Paris \u2014 la bande d\u2019autorit\xE9 d\xE9j\xE0 port\xE9e au w1 de l\u2019\xE9pisode, confirm\xE9e ici face \xE0 la revendication syndicale d\u2019un million."
    ),
    "2025-09-18"
  ),
  src(
    "interieur-31oct",
    "official",
    "Minist\xE8re de l\u2019Int\xE9rieur \u2014 \xAB Bilan de la journ\xE9e de mobilisation du 31 octobre 2026 et de la soir\xE9e d\u2019Halloween \xBB",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-journee-de-mobilisation-du-31-octobre-2026-et-de-soiree-dhalloween",
    both(
      "the week-5 national point, including the Halloween evening, when the damage count collapses.",
      "le point national de la semaine 5, soir\xE9e d\u2019Halloween incluse, moment o\xF9 le d\xE9compte des dommages s\u2019effondre."
    ),
    "2026-10-31"
  ),
  src(
    "interieur-05nov",
    "official",
    "Minist\xE8re de l\u2019Int\xE9rieur \u2014 \xAB Bilan de mobilisation lyc\xE9enne et de journ\xE9e nationale d\u2019action du 5 novembre 2026 \xBB",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-mobilisation-lyceenne-et-de-journee-nationale-daction-du-5-novembre-2026",
    both(
      "the 575,000 figure for 5 Nov, the peak of the movement, plus arrests and officer injuries.",
      "le chiffre de 575 000 pour le 5 nov., sommet du mouvement, plus interpellations et bless\xE9s parmi les forces."
    ),
    "2026-11-05"
  ),
  src(
    "interieur-07nov",
    "official",
    "Minist\xE8re de l\u2019Int\xE9rieur \u2014 \xAB Bilan de mobilisation du 7 novembre 2026 : des cort\xE8ges \xE9maill\xE9s de nombreux incidents \xBB",
    "https://www.interieur.gouv.fr/actualites/actualites-du-ministere/bilan-de-mobilisation-du-7-novembre-2026-des-corteges-emailles-de-nombreux-incidents-dans-grandes",
    both(
      "the 146,000 figure, the arrest count and the incident list for 7 Nov, the last national day in the window.",
      "le chiffre de 146 000, le nombre d\u2019interpellations et la liste des incidents du 7 nov., derni\xE8re journ\xE9e nationale de la fen\xEAtre."
    ),
    "2026-11-07"
  ),
  /* ── 2026 movement: origins and the September–October bilans ────────── */
  src(
    "frwiki-mvt-lyceen-2026",
    "press",
    "Wikip\xE9dia \u2014 \xAB Mouvement lyc\xE9e et \xE9tudiant de 2026 en France \xBB",
    "https://fr.wikipedia.org/wiki/Mouvement_lyc%C3%A9en_et_%C3%A9tudiant_de_2026_en_France",
    both(
      "the dated chronology of the whole movement: the first blockades (Mayotte 31 Aug, Le Rheu 7 Sep, Villeneuve-d'Ascq 14 Sep, Caen 15 Sep), Cr\xE9teil 18\u201319 Sep, the 23 and 24\u201325 Sep extensions, then the national turn on 28 Sep (180 establishments perturbed, 27 blockades, 164 arrests), Act I on 29 Sep (338 establishments affected, 45 blocked, 440 arrests), 30 Sep (356 establishments, 625 arrests, 83 forces injured) and Acte II on 1 Oct (900 actions, 340 in the morning per AFP, 400 closures, 1,949 arrests, 318 injured = 170 students + 65 staff + 83 forces). Also the named damage of 1 Oct at Nantes, Meaux and Rouen.",
      "la chronologie dat\xE9e de tout le mouvement : les premiers blocages (Mayotte 31 ao\xFBt, Le Rheu 7 sept., Villeneuve-d\u2019Ascq 14 sept., Caen 15 sept.), Cr\xE9teil 18\u201319 sept., les extensions des 23 et 24\u201325 sept., puis le tournant national du 28 sept. (180 \xE9tablissements perturb\xE9s, 27 blocages, 164 interpellations), l\u2019acte I du 29 sept. (338 \xE9tablissements concern\xE9s, 45 bloqu\xE9s, 440 interpellations), le 30 sept. (356 \xE9tablissements, 625 interpellations, 83 bless\xE9s des forces) et l\u2019acte II du 1er oct. (900 actions, 340 le matin selon l\u2019AFP, 400 fermetures, 1 949 interpellations, 318 bless\xE9s = 170 \xE9l\xE8ves + 65 personnels + 83 forces). Aussi les d\xE9g\xE2ts nomm\xE9s du 1er oct. \xE0 Nantes, Meaux et Rouen."
    ),
    "2026-11-11"
  ),
  src(
    "lemonde-29sept-338",
    "blockades",
    "Le Monde \u2014 \xAB Blocages des lyc\xE9es : 338 \xE9tablissements concern\xE9s mardi, dont 45 encore bloqu\xE9s, selon le minist\xE8re de l\u2019\xE9ducation nationale \xBB",
    "https://www.lemonde.fr/societe/article/2026/09/29/blocages-des-lycees-338-etablissements-concernes-et-dix-blesses-selon-le-ministere-de-l-education-nationale_6785573_3225.html",
    both(
      "Act I: the USL claimed 400 blocked establishments out of ~3,700 in France; the Education ministry counted 416 establishments touched since the morning, 338 still affected at day's end with 45 blocked, and 31 injured students and staff; 440 interpellations, two thirds leading to a garde \xE0 vue.",
      "l\u2019acte I : l\u2019USL revendiquait 400 \xE9tablissements bloqu\xE9s sur ~3 700 en France ; le minist\xE8re de l\u2019\xC9ducation recensait 416 \xE9tablissements touch\xE9s depuis le matin, 338 encore affect\xE9s en fin de journ\xE9e dont 45 bloqu\xE9s, et 31 bless\xE9s parmi \xE9l\xE8ves et personnels ; 440 interpellations, les deux tiers ayant donn\xE9 lieu \xE0 une garde \xE0 vue."
    ),
    "2026-09-29"
  ),
  src(
    "lemonde-30sept-625",
    "press",
    "Le Monde \u2014 \xAB Blocage des lyc\xE9es : 625 interpellations mercredi, annonce le ministre de l\u2019Int\xE9rieur qui constate une extension du mouvement \xBB",
    "https://www.lemonde.fr/societe/article/2026/09/30/blocage-des-lycees-625-interpellations-mercredi-annonce-le-ministre-de-l-interieur-qui-constate-une-extension-du-mouvement_6786023_3225.html",
    both(
      "30 September: 625 interpellations, actions in \xCEle-de-France, Lyon, Strasbourg and Nice, and the extension of the movement after the 29 Sep national day.",
      "le 30 septembre : 625 interpellations, des actions en \xCEle-de-France, \xE0 Lyon, Strasbourg et Nice, et l\u2019extension du mouvement apr\xE8s la journ\xE9e nationale du 29 sept."
    ),
    "2026-09-30"
  ),
  src(
    "lefigaro-30sept-625",
    "press",
    "Le Figaro \u2014 \xAB Blocages des lyc\xE9es : 625 interpellations, 83 policiers et gendarmes bless\xE9s mercredi, annonce le ministre de l\u2019Int\xE9rieur Laurent Nu\xF1ez \xBB",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-la-colere-ne-justifie-pas-la-violence-cingle-emmanuel-macron-des-tensions-dans-plusieurs-villes-20260930",
    both(
      "the 30 September figures: 625 interpellations, 83 police and gendarmes injured, 356 establishments concerned, and the Education ministry's 119 injured students and staff since the start of the blockades.",
      "les chiffres du 30 septembre : 625 interpellations, 83 policiers et gendarmes bless\xE9s, 356 \xE9tablissements concern\xE9s, et les 119 \xE9l\xE8ves et personnels bless\xE9s depuis le d\xE9but des blocages selon le minist\xE8re de l\u2019\xC9ducation."
    ),
    "2026-10-01"
  ),
  src(
    "lefigaro-1oct-1949",
    "press",
    "Le Figaro \u2014 \xAB Blocages des lyc\xE9es : 1 949 interpellations jeudi, 1 793 gardes \xE0 vue depuis lundi, interdiction de manifester autour des \xE9tablissements ferm\xE9s vendredi \xBB",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-lyceens-et-etudiants-appellent-ce-jeudi-a-un-acte-deux-de-mobilisation-20261001",
    both(
      "the 1 October daily arrest figure of 1,949 \u2014 the basis for correcting that cell from a cumulative stock to a daily flow \u2014 with 1,793 gardes \xE0 vue since Monday and the Wednesday figures of 625 arrests and 83 police injured.",
      "le chiffre d\u2019interpellations du jeudi 1er octobre, 1 949 \u2014 base de la correction de cette cellule, de stock cumulatif \xE0 flux journalier \u2014 avec 1 793 gardes \xE0 vue depuis lundi et les chiffres du mercredi, 625 interpellations et 83 bless\xE9s."
    ),
    "2026-10-01"
  ),
  src(
    "lefigaro-2oct-1747",
    "press",
    "Le Figaro \u2014 \xAB Blocages des lyc\xE9es : 1 747 interpellations ce vendredi, plus de 5 000 depuis lundi, annonce Nu\xF1ez \xBB",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-les-autorites-espere-l-apaisement-apres-les-violences-d-une-extreme-gravite-400-etablissements-fermes-20261002",
    both(
      "2 October: 1,747 arrests that day, more than 5,000 since Monday, 735 establishments perturbed (30% fewer), urban violence near 158 of them, ~300 police and gendarmes injured on Thursday, and 65 education staff injured since the start of the movement including 40 headteachers.",
      "le 2 octobre : 1 747 interpellations, plus de 5 000 depuis lundi, 735 \xE9tablissements perturb\xE9s (\u221230 %), des violences urbaines pr\xE8s de 158 d\u2019entre eux, ~300 policiers et gendarmes bless\xE9s le jeudi, et 65 personnels de l\u2019\xC9ducation bless\xE9s depuis le d\xE9but du mouvement dont 40 proviseurs."
    ),
    "2026-10-02"
  ),
  src(
    "lefigaro-5oct-6059",
    "press",
    "Le Figaro \u2014 \xAB Blocages des lyc\xE9es : 984 personnes interpell\xE9es ce lundi, 715 bless\xE9s c\xF4t\xE9 forces de l\u2019ordre depuis le d\xE9but de la mobilisation \xBB",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocage-des-lycees-des-centaines-de-lycees-seront-a-nouveau-fermes-au-moins-partiellement-lundi-avant-un-acte-iii-mardi-20261005",
    both(
      "the 5 October daily figures (984 arrests, 65 forces injured) and the ministry's stocks: 6,059 interpellations since 28 September and 715 police and gendarmes injured since the start of the movement. Matignon: 215 students and 85 education staff injured, 34 of them headteachers. The 6,059 figure is what makes the derived weekend total of 150 arrests checkable.",
      "les chiffres journaliers du 5 octobre (984 interpellations, 65 bless\xE9s des forces) et les stocks minist\xE9riels : 6 059 interpellations depuis le 28 septembre et 715 policiers ou gendarmes bless\xE9s depuis le d\xE9but du mouvement. Matignon : 215 \xE9l\xE8ves et 85 personnels \xE9ducatifs bless\xE9s, dont 34 chefs d\u2019\xE9tablissement. Le chiffre de 6 059 est ce qui rend v\xE9rifiable le total de 150 interpellations du week-end."
    ),
    "2026-10-06"
  ),
  src(
    "lefigaro-6oct-488",
    "press",
    "Le Figaro \u2014 \xAB Mobilisation des lyc\xE9ens : 488 interpellations en France, 43 membres des forces de l\u2019ordre bless\xE9s \xBB",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocage-des-lycees-des-dizaines-de-milliers-de-lyceens-dans-la-rue-pour-un-acte-iii-sous-haute-surveillance-20261006",
    both(
      "the 6 October daily figures \u2014 488 interpellations and 43 forces injured \u2014 and the cumulative 215 students injured since mid-September, including a 16-year-old who lost the use of an eye.",
      "les chiffres journaliers du 6 octobre \u2014 488 interpellations et 53 bless\xE9s des forces \u2014 et le cumul de 215 \xE9l\xE8ves bless\xE9s depuis la mi-septembre, dont un youngster de 16 ans ayant perdu l\u2019usage d\u2019un \u0153il."
    ),
    "2026-11-05"
  ),
  src(
    "ouestfrance-25sept-21",
    "press",
    "Ouest-France \u2014 \xAB Apr\xE8s des blocus dans des lyc\xE9es d\u2019\xCEle-de-France, 21 personnes ont \xE9t\xE9 interpell\xE9es \xBB",
    "https://www.ouest-france.fr/education/ecole/apres-des-blocus-dans-des-lycees-dile-de-france-21-personnes-ont-ete-interpellees-7d16e80e-b8b0-11f1-8a73-5c5c9f666d13",
    both(
      "the only figure before the 28 September national turn: 21 interpellations by noon on Friday 25 September, announced by the Pr\xE9fecture de Police, in connection with the Paris-area lyc\xE9e mobilisations; the Cr\xE9teil rectorat counted a \u201Cgrosse dizaine\u201D of new blockades, mainly in Seine-Saint-Denis and Val-de-Marne.",
      "le seul chiffre avant le tournant national du 28 septembre : 21 interpellations \xE0 midi le vendredi 25 septembre, annonc\xE9es par la pr\xE9fecture de Police, au titre des mobilisations de lyc\xE9es de l\u2019agglom\xE9ration parisienne ; le rectorat de Cr\xE9teil comptait une \xAB grosse dizaine \xBB de nouveaux blocages, surtout en Seine-Saint-Denis et dans le Val-de-Marne."
    ),
    "2026-09-25"
  ),
  src(
    "franceinfo-mvt-ampleur",
    "press",
    "Franceinfo \u2014 \xAB Revendications locales, vid\xE9os virales, soutien de LFI\u2026 Comment le blocage de quelques lyc\xE9es s\u2019est transform\xE9 en un mouvement d\u2019ampleur \xBB",
    "https://www.franceinfo.fr/societe/education/blocage-des-lycees/la-mobilisation-a-pris-une-ampleur-inattendue-comment-le-mouvement-de-blocage-des-lycees-s-est-propage-en-france_8216054.html",
    both(
      "the movement's chronology from the rentr\xE9e: first blockades in Brittany, Villeneuve-d'Ascq and Caen on 15 September, Cr\xE9teil on 17 September, the LFI visit on 21 September, a dozen blocked lyc\xE9es in the Cr\xE9teil academy on 25 September, the USL call for 29 September, and the cumulative figures of 119 injured (85 students, 34 staff) and 1,065 arrests over Tuesday and Wednesday.",
      "la chronologie du mouvement d\xE8s la rentr\xE9e : premiers blocages en Bretagne, puis Villeneuve-d\u2019Ascq et Caen le 15 septembre, Cr\xE9teil le 17 septembre, la visite de LFI le 21 septembre, une dizaine de lyc\xE9es bloqu\xE9s dans l\u2019acad\xE9mie de Cr\xE9teil le 25 septembre, l\u2019appel de l\u2019USL pour le 29 septembre, et les cumulats de 119 bless\xE9s (85 \xE9l\xE8ves, 34 personnels) et 1 065 interpellations sur mardi et mercredi."
    ),
    "2026-10-01"
  ),
  src(
    "rtbf-blocages-mineurs",
    "press",
    "RTBF \u2014 \xAB Blocages, d\xE9gradations, arrestations de mineurs : que se passe-t-il dans les lyc\xE9es en France ? \xBB",
    "https://www.rtbf.be/article/blocages-degradations-arrestations-de-mineurs-que-se-passe-t-il-dans-les-lycees-en-france-11792600",
    both(
      "the enforcement narrative of the first fortnight: 21 arrests in the margins after a few days of blockades, 440 on 29 September mainly minors with two thirds in custody, 625 on 30 September, more than 100 students and staff injured, and the first IGPN referrals after police-firearm injuries.",
      "le r\xE9cit de la r\xE9pression des premi\xE8res semaines : 21 interpellations en marge apr\xE8s quelques jours de blocages, 440 le 29 septembre principalement des mineurs aux deux tiers en garde \xE0 vue, 625 le 30 septembre, plus d\u2019une centaine d\u2019\xE9l\xE8ves et de personnels bless\xE9s, et les premi\xE8res saisines de l\u2019IGPN apr\xE8s des blessures par armes l\xE9tales."
    ),
    "2026-10-12"
  ),
  src(
    "lemonde-29sept-fonction-publique",
    "press",
    "Le Monde \u2014 \xAB Gr\xE8ve du 29 septembre : 300 000-maths manifestations ont d\xE9fil\xE9 en France pour demander plus de moyens dans la fonction publique, selon la CGT \xBB",
    "https://www.lemonde.fr/societe/article/2026/09/29/greve-du-29-septembre-300-000-manifestants-ont-defile-en-france-pour-demander-plus-de-moyens-dans-la-fonction-publique-selon-la-cgt_6785560_3225.html",
    both(
      "the 29 September crowd: about 206,000 demonstrators nationwide per the Interior Ministry against the CGT's 300,000, 30,000 in Paris per the police prefecture (including 8,000 firefighters), across more than 170 demonstrations. These are the figures carried in the 29 September turnout cell, flagged \u201Cp\u201D because they count the public-service cort\xE8ge the lyc\xE9e actions joined, not a student crowd.",
      "la foule du 29 septembre : environ 206 000IRR\xC9S manifestation selon le minist\xE8re de l\u2019Int\xE9rieur contre 300 000 pour la CGT, 30 000 \xE0 Paris selon la pr\xE9fecture de police (dont 8 000 pompiers), pour plus de 170 manifestations. Ce sont les chiffres port\xE9s dans la cellule de participation du 29 septembre, marqu\xE9e \xAB p \xBB car ils d\xE9nombrent le cort\xE8ge de la fonction publique rejoint par les actions lyc\xE9e et non une foule \xE9tudiante."
    ),
    "2026-09-29"
  ),
  src(
    "franceinfo-fonction-publique-29sept",
    "press",
    "Franceinfo \u2014 \xAB Mobilisation dans la fonction publique : 206 000 manifestants selon le minist\xE8re de l\u2019Int\xE9rieur, 300 000 pour la CGT \xBB",
    "https://www.franceinfo.fr/economie/greve/mobilisation-dans-la-fonction-publique-206-000-manifestants-selon-le-ministere-de-l-interieur-300-000-pour-la-cgt_8215472.html",
    both(
      "the same 29 September figures with the Paris split (70,000 CGT / 30,000 ministry) and the strike rates: 9.64% of state civil servants, 5.68% territorial, 4.5% hospital, 13.71% of teachers.",
      "les m\xEAmes chiffres du 29 septembre avec la r\xE9partition parisienne (70 000 CGT / 30 000 minist\xE8re) et les taux de gr\xE8ve : 9,64 % dans la fonction publique d\u2019\xC9tat, 5,68 % territoriale, 4,5 % hospitali\xE8re, 13,71 % des enseignants."
    ),
    "2026-09-29"
  ),
  src(
    "ouestfrance-7sept-lerheu",
    "press",
    "Ouest-France \u2014 \xAB Cours tardifs ou par correspondance, classes surcharg\xE9es\u2026 ces lyc\xE9ens bloquent leur \xE9tablissement pr\xE8s de Rennes \xBB",
    "https://www.ouest-france.fr/bretagne/le-rheu-35650/cours-tardifs-ou-par-correspondance-classes-surchargees-ces-lyceens-bloquent-leur-etablissement-pres-de-rennes-5cb2156e-aac0-11f1-9556-770e8387e7e9",
    both(
      "the movement's first mainland blockade: the lyc\xE9e Th\xE9odore-Monod at Le Rheu, near Rennes, on Monday 7 September 2026, over late or correspondence classes and overcrowded classes \u2014 the origin point that precedes the 15 September window opening.",
      "le tout premier blocus en m\xE9tropole : le lyc\xE9e Th\xE9odore-Monod au Rheu, pr\xE8s de Rennes, le lundi 7 septembre 2026, sur les cours tardifs ou par correspondance et les classes surcharg\xE9es \u2014 le point d\u2019origine qui pr\xE9c\xE8de l\u2019ouverture de la fen\xEAtre au 15 septembre."
    ),
    "2026-09-07"
  ),
  src(
    "actu-caen-15sept",
    "press",
    "Actu \u2014 \xAB Un lyc\xE9e bloqu\xE9 par des \xE9l\xE8ves \xE0 Caen \xBB",
    "https://actu.fr/normandie/caen_14118/un-lycee-bloque-par-des-eleves-a-caen-ils-denoncent-une-mauvaise-organisation-interne_64794136.html",
    both(
      "the 15 September blockade of the lyc\xE9e Victor-Hugo in Caen over internal organisation \u2014 the first date inside the new window.",
      "le blocage du 15 septembre du lyc\xE9e Victor-Hugo de Caen sur l\u2019organisation interne \u2014 la premi\xE8re date \xE0 l\u2019int\xE9rieur de la nouvelle fen\xEAtre."
    ),
    "2026-09-18"
  ),
  src(
    "actu-villeneuve-15sept",
    "press",
    "Actu \u2014 \xAB Pourquoi d\xE9j\xE0 un blocage de l\u2019universit\xE9 de Pont de Bois \xE0 Villeneuve-d\u2019Ascq ? \xBB",
    "https://actu.fr/hauts-de-france/villeneuve-d-ascq_59009/pourquoi-deja-un-blocage-de-luniversite-de-pont-de-bois_64791633.html",
    both(
      "the campus Pont de Bois blockade at Villeneuve-d'Ascq on Tuesday 15 September, with the lyc\xE9e Queneau in the same town blocked the day before \u2014 the source of the one-day discrepancy between the two accounts of the Villeneuve-d'Ascq date.",
      "le blocage du campus Pont de Bois \xE0 Villeneuve-d\u2019Ascq le mardi 15 septembre, le lyc\xE9e Queneau de la m\xEAme ville \xE9tant bloqu\xE9 la veille \u2014 \xE0 l\u2019origine de l\u2019\xE9cart d\u2019un jour entre les deux versions de la date de Villeneuve-d\u2019Ascq."
    ),
    "2026-09-15"
  ),
  src(
    "ouestfrance-infographie-2026",
    "press",
    "Ouest-France \u2014 \xAB Infographie. Du 29 septembre au 29 octobre, comment la col\xE8re des lyc\xE9ens est devenue une col\xE8re sociale \xBB",
    "https://www.ouest-france.fr/societe/manifestation/infographie-du-29-septembre-au-29-octobre-comment-la-colere-des-lyceens-est-devenue-une-colere-sociale-0c2ca3ec-d37a-11f1-81f2-0d14b9f9c452",
    both(
      "the movement's own calendar, from the first act of manifestations and blockades on 29 September to 29 October \u2014 the spine the September rows are placed on.",
      "le calendrier du mouvement, du premier acte de manifestations et blocages le 29 septembre au 29 octobre \u2014 l\u2019axe sur lequel sont pos\xE9s les lignes de septembre."
    ),
    "2026-10-29"
  ),
  src(
    "investigation-genz",
    "press",
    "Investigaction \u2014 \xAB \u201CTasty crousti antifascisti\u201D : Quand la Gen Z tente de faire nation \xBB",
    "https://investigaction.net/tasty-crousti-antifascisti-quand-la-gen-z-tente-de-faire-nation/",
    both(
      "an independent dating of the movement's origin at Cr\xE9teil on 17 September, the 21 September LFI visit, and the activist record of the repression that followed \u2014 mutilations by flashballs and grenades, custody humiliations, and the case of the Trappes killing.",
      "une datation ind\xE9pendante de l\u2019origine du mouvement \xE0 Cr\xE9teil le 17 septembre, de la visite de LFI le 21 septembre, et le r\xE9cit militant de la r\xE9pression qui a suivi \u2014 mutilations par flashballs et grenades, humiliations en garde \xE0 vue, affaire de l\u2019homicide \xE0 Trappes."
    ),
    "2026-11-01"
  ),
  /* ------------------------------------- 2026 — turnout, arrests, injuries */
  src(
    "europe1-07nov",
    "press",
    "Europe 1 \u2014 \xAB Manifestations du 7 novembre : 146 000 personnes ont d\xE9fil\xE9 en France samedi, 360 interpellations \xBB",
    "https://www.europe1.fr/societe/manifestations-du-7-novembre-146000-personnes-ont-defile-en-france-samedi-360-interpellations-selon-le-ministere-de-linterieur-1216046",
    both(
      "146,000 demonstrators and 360 arrests on 7 Nov \u2014 the figure the 7 Nov ministry bilan is read through.",
      "146 000 manifestants et 360 interpellations le 7 nov. \u2014 la lecture retenue du bilan minist\xE9riel du 7 nov."
    ),
    "2026-11-07"
  ),
  src(
    "tf1info-07nov",
    "press",
    "TF1 Info \u2014 \xAB Manifestations : 146 000 personnes en France samedi 7 novembre, au moins 360 interpellations \xBB",
    "https://www.tf1info.fr/societe/manifestations-146-000-personnes-en-france-samedi-7-novembre-au-moins-360-interpellations-2474538.html",
    both(
      "independent confirmation of the 7 Nov pair.",
      "confirmation ind\xE9pendante du couple de valeurs du 7 nov."
    ),
    "2026-11-07"
  ),
  src(
    "france24-05nov",
    "press",
    "France 24 \u2014 live coverage of the 5 November national day",
    "https://www.france24.com/en/france/20261105-live-france-nationwide-strikes-living-costs",
    both(
      "the ministry\u2019s 575,000 for 5 Nov, quoted in English.",
      "les 575 000 du minist\xE8re pour le 5 nov., cit\xE9s en anglais."
    ),
    "2026-11-05"
  ),
  src(
    "france24-06nov",
    "press",
    "France 24 \u2014 70 000 policiers et gendarmes \xE0 nouveau mobilis\xE9s samedi",
    "https://www.france24.com/fr/france/20261106-manifestations-de-samedi-en-france-70-000-policiers-et-gendarmes-%C3%A0-nouveau-mobilis%C3%A9s",
    both(
      "the size of the 7 Nov policing operation, the input to the week-6 cost band.",
      "la taille du dispositif du 7 nov., entr\xE9e de la fourchette de co\xFBt de la semaine 6."
    ),
    "2026-11-06"
  ),
  src(
    "franceinfo-05nov",
    "press",
    "franceinfo \u2014 direct du 5 novembre : plus de 250 actions annonc\xE9es dans toute la France",
    "https://www.franceinfo.fr/societe/manifestations/direct-greve-du-5-novembre-plus-de-250-actions-annoncees-dans-toute-la-france-selon-une-carte-de-la-ggt_8268827.html",
    both(
      "448 interpellations on 5 Nov, the arrest figure plotted for that day.",
      "448 interpellations le 5 nov., valeur trac\xE9e pour cette journ\xE9e."
    ),
    "2026-11-05"
  ),
  src(
    "franceinfo-24oct",
    "press",
    "franceinfo \u2014 \xAB Pr\xE8s de 1 000 interpellations, deux bless\xE9s graves \xBB : le bilan du 24 octobre",
    "https://www.franceinfo.fr/societe/manifestations/mobilisation-en-baisse-pres-de-1-000-interpellations-deux-blesses-graves-ce-qu-il-faut-retenir-de-cette-nouvelle-journee-de-manifestation-contre-la-vie-chere-partout-en-france_8252476.html",
    both(
      "24 Oct arrests and the two seriously injured protesters; also the evidence that turnout fell that day.",
      "les interpellations du 24 oct. et les deux manifestants gri\xE8vement bless\xE9s ; aussi la preuve d\u2019une mobilisation en baisse ce jour-l\xE0."
    ),
    "2026-10-24"
  ),
  src(
    "anadolu-05nov",
    "press",
    "Anadolu Agency (fran\xE7ais) \u2014 642 interpellations lors de la mobilisation du 5 novembre",
    "https://www.aa.com.tr/fr/france/france-642-interpellations-lors-de-la-mobilisation-du-5-novembre-une-plainte-annonc%C3%A9e-contre-nu%C3%B1ez/4114506",
    both(
      "the 642 figure that competes with 448 for 5 Nov; the higher bound is plotted as partial.",
      "le chiffre de 642 qui concurrence 448 pour le 5 nov. ; la borne haute est trac\xE9e comme partielle."
    ),
    "2026-11-05"
  ),
  src(
    "yenisafak-05nov",
    "press",
    "Yeni \u015Eafak (fran\xE7ais) \u2014 642 interpellations lors de la mobilisation du 5 novembre",
    "https://fr.yenisafak.com/actualites/642-interpellations-lors-de-la-mobilisation-du-5-novembre-61558",
    both(
      "corroborates Anadolu\u2019s 642, which is why that bound is shown at all.",
      "corrobore les 642 d\u2019Anadolu, raison pour laquelle cette borne est affich\xE9e."
    ),
    "2026-11-05"
  ),
  src(
    "tf1info-05nov",
    "press",
    "TF1 Info \u2014 direct du 5 novembre : la France se pr\xE9pare \xE0 un \xAB jeudi noir \xBB",
    "https://www.tf1info.fr/societe/en-direct-mobilisation-du-5-novembre-manifestations-et-greves-paris-marseille-nantes-la-france-se-prepare-a-un-jeudi-noir-2473952.html",
    both(
      "the shape of the 5 Nov day \u2014 250+ actions, strikes in Paris, Marseille and Nantes.",
      "la physionomie du 5 nov. \u2014 plus de 250 actions, gr\xE8ves \xE0 Paris, Marseille et Nantes."
    ),
    "2026-11-05"
  ),
  src(
    "lefigaro-05nov",
    "press",
    "Le Figaro \u2014 \xAB Manifestations du 5 novembre : 70 000 policiers et gendarmes mobilis\xE9s, d\xE9clare Nu\xF1ez \xBB",
    "https://www.lefigaro.fr/flash-actu/manifestations-du-5-novembre-70-000-policiers-et-gendarmes-mobilises-declare-nunez-20261104",
    both(
      "announcement, on 4 Nov, of the 70,000-strong deployment for 5 Nov.",
      "annonce, le 4 nov., du dispositif de 70 000 agents pour le 5 nov."
    ),
    "2026-11-04"
  ),
  src(
    "armees-05nov",
    "press",
    "armees.com \u2014 le dispositif de s\xE9curit\xE9 du 5 novembre 2026",
    "https://armees.com/manifestations-5-novembre-2026-dispositif-securite-70000-policiers-gendarmes/",
    both(
      "third confirmation of the 70,000 deployment.",
      "troisi\xE8me confirmation du dispositif de 70 000 agents."
    )
  ),
  src(
    "leparisien-24oct-blesses",
    "press",
    "Le Parisien \u2014 \xAB 267 membres des forces de l\u2019ordre et 150 manifestants ont \xE9t\xE9 bless\xE9s, annonce Laurent Nu\xF1ez \xBB",
    "https://www.leparisien.fr/faits-divers/manifestations-du-samedi-24-octobre-267-membres-des-forces-de-lordre-et-150-manifestants-ont-ete-blesses-annonce-laurent-nunez-26-10-2026-MHSP3XA3QBEM7GR4JUZL77Z54I.php",
    both(
      "the only day in the window with both sides of the injury count published together.",
      "la seule journ\xE9e de la fen\xEAtre o\xF9 les deux c\xF4t\xE9s du bilan de bless\xE9s sont publi\xE9s ensemble."
    ),
    "2026-10-26"
  ),
  src(
    "ouest-france-angers",
    "press",
    "Ouest-France \u2014 manifestation du 7 novembre \xE0 Angers : huit bless\xE9s, onze interpell\xE9s",
    "https://www.ouest-france.fr/societe/manifestation/manifestation-du-7-novembre-a-angers-huit-blesses-onze-interpelles-un-commerce-et-quatre-banques-vandalises-b7d296cc-dada-11f1-a45f-49114163a350",
    both(
      "regional-only marker: 8 injured, 11 arrests, one shop and four banks vandalised \u2014 never extrapolated.",
      "marqueur r\xE9gional : 8 bless\xE9s, 11 interpellations, un commerce et quatre banques vandalis\xE9s \u2014 jamais extrapol\xE9."
    ),
    "2026-11-07"
  ),
  src(
    "bulletindescommunes-07nov",
    "press",
    "Bulletin des communes \u2014 la mobilisation du 7 novembre, commune par commune",
    "https://bulletindescommunes.net/mobilisation-du-7-novembre-communes/",
    both(
      "the municipality-level outcome of 7 Nov, used to sanity-check the national total.",
      "le r\xE9sultat communal du 7 nov., servant \xE0 recouper le total national."
    ),
    "2026-11-07"
  ),
  src(
    "figaro-06nov-live",
    "blockades",
    "Le Figaro \u2014 direct du 6 novembre : 41 lyc\xE9es bloqu\xE9s, de nouvelles actions attendues samedi",
    "https://www.lefigaro.fr/actualite-france/en-direct-colere-sociale-apres-la-forte-mobilisation-de-jeudi-de-nouvelles-actions-attendues-des-samedi-20261106",
    both(
      "41 lyc\xE9es still blocked the day after the 5 Nov peak \u2014 the tail of the school movement.",
      "41 lyc\xE9es encore bloqu\xE9s au lendemain du pic du 5 nov. \u2014 la queue du mouvement lyc\xE9en."
    ),
    "2026-11-06"
  ),
  src(
    "actuforces-17oct",
    "press",
    "Actu Forces de l\u2019Ordre \u2014 plus de 10 000 policiers et gendarmes mobilis\xE9s \xE0 Paris le 17 octobre",
    "https://actuforcesdelordre.fr/2026/10/17/10000-policiers-gendarmes-mobilises-paris-manifestations/",
    both(
      "the Paris deployment on 17 Oct, the low end of the policing-cost band for that day.",
      "le dispositif parisien du 17 oct., borne basse de la fourchette de co\xFBt pour cette journ\xE9e."
    ),
    "2026-10-17"
  ),
  src(
    "actuforces-beauvau",
    "press",
    "Actu Forces de l\u2019Ordre \u2014 Beauvau : 305 bless\xE9s, 1 949 interpellations",
    "https://actuforcesdelordre.fr/2026/10/01/beauvau-mobilise-forces-mobiles-305-blesses-1949-interpellations-lycees/",
    both(
      "the cumulative police-side tally of the lyc\xE9e wave (305 injured, 1,949 arrests).",
      "le cumul c\xF4t\xE9 forces de l\u2019ordre pour la vague lyc\xE9enne (305 bless\xE9s, 1 949 interpellations)."
    )
  ),
  src(
    "larep-17oct",
    "press",
    "La R\xE9publique du Centre \u2014 la journ\xE9e du 17 octobre est-elle vraiment in\xE9dite ?",
    "https://www.larep.fr/paris-75000/faits-divers/arrestations-mobilisations-la-journee-du-17-octobre-est-elle-vraiment-inedite_15066265/",
    both(
      "the \xAB unprecedented \xBB claim tested against earlier mobilisations; it is why 17 Oct is not called a record.",
      "le caract\xE8re \xAB in\xE9dit \xBB mis \xE0 l\u2019\xE9preuve des mobilisations ant\xE9rieures ; d\u2019o\xF9 l\u2019absence de record pour le 17 oct."
    )
  ),
  src(
    "laprovence-17oct",
    "press",
    "La Provence \u2014 violences du 17 octobre : le dispositif policier inf\xE9rieur \xE0 celui de mobilisations similaires",
    "https://www.laprovence.com/article/faits-divers-justice/5795089910157914/violences-du-17-octobre-le-dispositif-policier-inferieur-a-celui-observe-dans-des-mobilisations-similaires",
    both(
      "the numerical claim behind the \xAB smaller dispositif \xBB reading.",
      "l\u2019argument chiffr\xE9 derri\xE8re la lecture d\u2019un dispositif plus faible."
    )
  ),
  src(
    "franceinfo-dispositif-17oct",
    "press",
    "franceinfo \u2014 le dispositif de maintien de l\u2019ordre du 17 octobre \xE9tait-il moins important ?",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/le-dispositif-de-maintien-de-l-ordre-deploye-le-17-octobre-etait-il-moins-important-que-lors-des-dernieres-grandes-manifestations_8243998.html",
    both(
      "the fact-check that sets the policing-cost comparison against previous movements.",
      "la v\xE9rification qui situe la comparaison de co\xFBt face aux mouvements pr\xE9c\xE9dents."
    )
  ),
  src(
    "franceinfo-nunez-moyens",
    "press",
    "franceinfo \u2014 Laurent Nu\xF1ez revient sur les moyens policiers d\xE9ploy\xE9s apr\xE8s le 17 octobre",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/apres-les-mobilisations-du-17-octobre-laurent-nunez-revient-sur-les-moyens-policiers-deployes_8266529.html",
    both(
      "the minister\u2019s own account of the deployment, which contradicts the press reading.",
      "la version du ministre sur le dispositif, qui contredit la lecture de la presse."
    )
  ),
  src(
    "reporterre-street-medics",
    "press",
    "Reporterre \u2014 les street-medics face \xE0 une r\xE9pression de plus en plus f\xE9roce",
    "https://reporterre.net/Les-street-medics-face-a-une-repression-de-plus-en-plus-feroce",
    both(
      "why no weekly protester-injury series exists: the first-aid volunteers are themselves policed.",
      "pourquoi aucune s\xE9rie hebdomadaire de bless\xE9s n\u2019existe : les secouristes sont eux-m\xEAmes vis\xE9s."
    )
  ),
  src(
    "sudouest-street-medics",
    "press",
    "Sud Ouest \u2014 \xE0 Bordeaux, les secouristes de rue en premi\xE8re ligne",
    "https://www.sudouest.fr/gironde/bordeaux/mobilisation-sociale-a-bordeaux-c-est-le-meilleur-moyen-de-militer-au-milieu-des-detonations-et-des-lacrymogenes-les-secouristes-de-rue-en-premiere-ligne-du-secours-31404007.php",
    both(
      "local colour on injury recording, and the Bordeaux figure used as a regional check.",
      "le reportage local sur le relev\xE9 des bless\xE9s, et le chiffre bordelais utilis\xE9 comme contr\xF4le r\xE9gional."
    )
  ),
  src(
    "prodpress-blesses",
    "press",
    "PRODPRESS \u2014 bless\xE9s : des cas document\xE9s, des totaux non consolid\xE9s",
    "https://www.prodpress.eu/manifestations-blesses-bilan-coquerel-verification-2026/",
    both(
      "explicit statement that injury totals were never consolidated \u2014 the method note behind the injury floor.",
      "constat explicite que les totaux de bless\xE9s n\u2019ont jamais \xE9t\xE9 consolid\xE9s \u2014 la note de m\xE9thode derri\xE8re le plancher."
    )
  ),
  src(
    "mediapart-violences-detat",
    "press",
    "Mediapart (Le Club) \u2014 \xAB Violences d\u2019\xC9tat \xBB (deux versions du billet)",
    "https://blogs.mediapart.fr/jonathan-gensburger/blog/111126/violences-d-etat",
    both(
      "two versions of the same blog post circulate under different slugs; the higher figures come from the later one, so the citation is flagged as a blog, not reporting.",
      "deux versions du m\xEAme billet circulent sous des slugs diff\xE9rents ; les chiffres hauts viennent de la seconde, d\u2019o\xF9 le signalement en tant que blog et non reportage."
    ),
    "2026-11-11"
  ),
  src(
    "mutins-pangee",
    "press",
    "Les Mutins de Pang\xE9e (Facebook) \u2014 \xAB 10 \xE9borgn\xE9s, 7 amput\xE9s, 52 autres bless\xE9s graves \xBB",
    "https://www.facebook.com/LesMutinsDePangee/posts/-le-terrible-bilan-de-la-r%C3%A9pression10-%C3%A9borgn%C3%A9s-7-amput%C3%A9s-52-autres-bless%C3%A9s-grave/1566486208856655/",
    both(
      "the 79-victim figure before Le Canard encha\xEEn\xE9 attributed it to Thines; social-media origin, treated as a floor only.",
      "les 79 victimes avant que Le Canard ne l\u2019attribue \xE0 Thines ; origine r\xE9seaux sociaux, trait\xE9e comme plancher seulement."
    )
  ),
  src(
    "contre-attaque",
    "press",
    "Contre-Attaque \u2014 17 octobre, un carnage policier sans pr\xE9c\xE9dent : nouveau recensement",
    "https://contre-attaque.net/2026/10/23/17-octobre-un-carnage-policier-sans-precedent-nouveau-recensement-de-la-sauvagerie-policiere/",
    both(
      "the militant recount of 17 Oct injuries; the highest bound considered, never plotted alone.",
      "le recensement militant des bless\xE9s du 17 oct. ; borne la plus haute examin\xE9e, jamais trac\xE9e seule."
    )
  ),
  src(
    "canard-eyes-2026",
    "press",
    "Le Canard encha\xEEn\xE9 \u2014 \xAB Les manifestants ont le mauvais \u0153il \xBB",
    "https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil",
    both(
      "Prof. Laurent Thines\u2019 (CHU de Besan\xE7on) press-and-blog register: 79 serious injuries in three weeks \u2014 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.",
      "le registre presse et blog du Pr Laurent Thines (CHU de Besan\xE7on) : 79 bless\xE9s graves en trois semaines \u2014 10 \xE9borgn\xE9s, 9 traumatismes cr\xE2nio-faciaux, 7 amputations, 1 mort. Source du plancher de bless\xE9s parmi les manifestants, et raison pour laquelle aucune s\xE9rie hebdomadaire de bless\xE9s manifestants n\u2019existe."
    ),
    "2026-11-10"
  ),
  /* ------------------------------------------ 2026 — damage and cost */
  src(
    "ifrap-2026",
    "cost",
    "Fondation IFRAP \u2014 \xAB Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d\u2019euros \xBB",
    "https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros",
    both(
      "the \u20AC247M\u2013872M damage range for 17\u201318 Oct: ~\u20AC910M material damage and ~\u20AC190M lost turnover in the high estimate, \u20AC666M of it retail.",
      "la fourchette de 247 \xE0 872 M\u20AC de dommages pour les 17\u201318 oct. : ~910 M\u20AC de dommages mat\xE9riels et ~190 M\u20AC de chiffre d\u2019affaires perdu dans l\u2019hypoth\xE8se haute, dont 666 M\u20AC pour le commerce de d\xE9tail."
    ),
    "2026-10-21"
  ),
  src(
    "monde-cci-2026",
    "cost",
    "Le Monde \u2014 \xAB Plus de 2 500 commerces d\xE9grad\xE9s \xBB, d\u2019apr\xE8s CCI France",
    "https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html",
    both(
      "CCI France\u2019s shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.",
      "les d\xE9comptes de commerces de CCI France : 2 488 touch\xE9s le 17 oct., dont 1 161 pill\xE9s, saccag\xE9s ou incendi\xE9s."
    ),
    "2026-10-27"
  ),
  src(
    "franceinfo-cci-2026",
    "cost",
    "franceinfo \u2014 \xAB Plus de 2 500 magasins touch\xE9s \xBB",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html",
    both(
      "the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.",
      "l\u2019incr\xE9ment du 24 oct. (50 commerces, 2 538 au total) et la chute de 80 % du chiffre d\u2019affaires en centre-ville."
    ),
    "2026-10-27"
  ),
  src(
    "bfmtv-cci-2026",
    "cost",
    "BFMTV \u2014 CCI France, 20 commerces vandalis\xE9s le 31 octobre",
    "https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html",
    both(
      "why week 6 carries no damage figure: the count collapses after 24 Oct.",
      "pourquoi la semaine 6 ne porte aucun chiffre de dommages : le d\xE9compte s\u2019effondre apr\xE8s le 24 oct."
    ),
    "2026-11-01"
  ),
  src(
    "ladepeche-cci-31oct",
    "cost",
    "La D\xE9p\xEAche \u2014 20 commerces d\xE9grad\xE9s ce samedi, contre 2 488 il y a deux semaines",
    "https://www.ladepeche.fr/2026/11/01/manifestations-du-31-octobre-20-commerces-degrades-ce-samedi-selon-cci-france-il-y-en-avait-2-488-il-y-a-deux-semaines-13630867.html",
    both(
      "the 31 Oct figure set against 17 Oct, the cleanest evidence of the movement\u2019s tapering.",
      "le chiffre du 31 oct. face au 17 oct., preuve la plus nette de l\u2019essoufflement."
    ),
    "2026-11-01"
  ),
  src(
    "lsa-cci-2026",
    "cost",
    "LSA / CCI France \u2014 1 milliard d\u2019euros de d\xE9g\xE2ts, 2 500 commerces touch\xE9s, ville par ville",
    "https://www.lsa-conso.fr/distributeurs-alimentaires/manifestations-doctobre-1-milliard-deuros-de-degats-et-2-500-commerces-touches-selon-cci-france-les-details-ville-par-ville.2HTRI7YOSJHP5E52ISPEQEF4KQ.html",
    both(
      "the city-by-city breakdown of the \u20AC1bn retail estimate.",
      "la ventilation par ville de l\u2019estimation de 1 Md\u20AC pour le commerce."
    )
  ),
  src(
    "figaro-cost-weekend",
    "cost",
    "Le Figaro \u2014 \xAB Le co\xFBt exorbitant d\u2019un week-end d\u2019\xE9meutes pour les commerces et les collectivit\xE9s \xBB",
    "https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020",
    both(
      "cross-check on the damage order of magnitude.",
      "contre-v\xE9rification de l\u2019ordre de grandeur des dommages."
    ),
    "2026-10-20"
  ),
  src(
    "figaro-damage-2500",
    "cost",
    "Le Figaro \u2014 plus de 2 500 commerces d\xE9grad\xE9s en France",
    "https://www.lefigaro.fr/actualite-france/violences-urbaines-plus-de-2-500-commerces-degrades-en-france-20261027",
    both(
      "second, non-CCI route to the 2,500-shop figure and the \u20AC1bn headline.",
      "seconde voie, hors CCI, vers les 2 500 commerces et le titre du milliard."
    ),
    "2026-10-27"
  ),
  src(
    "leparisien-idf-1m",
    "cost",
    "Le Parisien \u2014 1 million d\u2019euros de d\xE9g\xE2ts, 200 lyc\xE9es perturb\xE9s : le bilan des blocages en \xCEle-de-France",
    "https://www.leparisien.fr/societe/1-million-deuros-de-degats-200-lycees-perturbes-le-bilan-des-blocus-de-lycees-en-ile-de-france-01-10-2026-YACA325BUBAD5K7L5B6DWBDODY.php",
    both(
      "the 1 Oct lyc\xE9e-blockade baseline: \u20AC1M and 200 establishments in \xCEle-de-France.",
      "la base du 1er oct. pour les blocages de lyc\xE9es : 1 M\u20AC et 200 \xE9tablissements en \xCEle-de-France."
    ),
    "2026-10-01"
  ),
  src(
    "leparisien-millions",
    "cost",
    "Le Parisien \u2014 blocages des lyc\xE9es : plusieurs millions d\u2019euros de d\xE9g\xE2ts d\xE9j\xE0 estim\xE9s en France",
    "https://www.leparisien.fr/societe/blocages-des-lycees-plusieurs-millions-deuros-de-degats-materiels-deja-estimes-en-france-02-10-2026-ICDKIV5SEFEA7NXURY45JLAZRA.php",
    both(
      "the first national order of magnitude for the school movement, before 17 Oct.",
      "le premier ordre de grandeur national pour le mouvement lyc\xE9en, avant le 17 oct."
    ),
    "2026-10-02"
  ),
  src(
    "leparisien-1500shops",
    "cost",
    "Le Parisien \u2014 violences du 17 octobre : 1 500 magasins touch\xE9s, plusieurs centaines de millions d\u2019euros de d\xE9g\xE2ts",
    "https://www.leparisien.fr/economie/violences-du-17-octobre-1-500-magasins-touches-en-france-plusieurs-centaines-de-millions-deuros-de-degats-18-10-2026-PAAKNFW6ZVCCJMLJ7LTOAWLKOI.php",
    both(
      "the 1,500-shop figure published the day after, later revised upward to 2,488.",
      "les 1 500 commerces publi\xE9s au lendemain, r\xE9vis\xE9s ensuite \xE0 2 488."
    ),
    "2026-10-18"
  ),
  src(
    "leparisien-looting",
    "cost",
    "Le Parisien \u2014 Paris : des heurts et des magasins pill\xE9s dans la nuit de dimanche \xE0 lundi",
    "https://www.leparisien.fr/paris-75/paris-des-heurts-et-des-magasins-pilles-encore-tard-dans-la-nuit-de-dimanche-a-lundi-19-10-2026-OUUITGPFNRD47NWIU5VVWP2IKY.php",
    both(
      "the 18\u201319 Oct looting, which is why the 17\u201318 Oct damage window closes on the Monday night.",
      "les pillages des 18\u201319 oct., d\u2019o\xF9 la cl\xF4ture de la fen\xEAtre de dommages le lundi soir."
    ),
    "2026-10-19"
  ),
  src(
    "leparisien-451-shops",
    "cost",
    "Le Parisien \u2014 451 commerces vandalises : la carte des \xE9tablissements parisiens pill\xE9s et d\xE9grad\xE9s",
    "https://www.leparisien.fr/paris-75/451-commerces-vandalises-la-carte-des-etablissements-parisiens-pilles-et-degrades-les-17-et-18-octobre-22-10-2026-SBWJHPIKZ5DMZFSEWE4IYYCAIY.php",
    both(
      "the Paris-only shop count (451), marked regional in the table.",
      "le d\xE9compte strictement parisien (451), marqu\xE9 r\xE9gional dans le tableau."
    ),
    "2026-10-22"
  ),
  src(
    "mesinfos-idf",
    "cost",
    "mesinfos.fr \u2014 blocages de lyc\xE9es : 8,5 millions d\u2019euros de d\xE9g\xE2ts en \xCEle-de-France",
    "https://mesinfos.fr/ile-de-france/blocus-lyceens-85-millions-d-euros-de-degats-en-ile-de-france-341003.html",
    both(
      "the highest \xCEle-de-France figure for the lyc\xE9e blockades \u2014 the upper bound in the table.",
      "le chiffre francilien le plus \xE9lev\xE9 pour les blocages de lyc\xE9es \u2014 borne haute du tableau."
    )
  ),
  src(
    "ici-lille",
    "cost",
    "ici.fr (Nord) \u2014 mobilisation du 17 octobre : premi\xE8res tensions \xE0 Lille",
    "https://www.ici.fr/hauts-de-france/nord-59/lille/mobilisation-du-17-octobre-des-premieres-tensions-a-lille-entre-forces-de-l-ordre-et-manifestants-7548967",
    both(
      "the Lille McDonald\u2019s fire, one of the few individually costed damage items.",
      "l\u2019incendie du McDonald\u2019s \xE0 Lille, l\u2019un des rares dommages chiffr\xE9s individuellement."
    )
  ),
  src(
    "cnews-14oct",
    "cost",
    "CNEWS \u2014 blocus des lyc\xE9es : agence immobili\xE8re attaqu\xE9e, feux de poubelle, le bilan",
    "https://www.cnews.fr/videos/france/2026-10-14/blocus-des-lycees-agence-immobiliere-attaquee-feux-de-poubelle-le-bilan",
    both(
      "the 14 Oct incidents, the first damage report of the school movement.",
      "les incidents du 14 oct., premier bilan de dommages du mouvement lyc\xE9en."
    ),
    "2026-10-14"
  ),
  src(
    "actu-450-shops",
    "cost",
    "actu.fr \u2014 pillages et d\xE9gradations en marge du 17 octobre : 450 commerces sinistr\xE9s \xE0 Paris",
    "https://actu.fr/ile-de-france/paris_75056/pillages-et-degradations-en-marge-du-17-octobre-450-commerces-sinistres-a-paris-quels-sont-les-plus-touches_64960656.html",
    both(
      "the 450/451 Paris shops with the sector breakdown.",
      "les 450/451 commerces parisiens avec la ventilation par secteur."
    )
  ),
  src(
    "of-facture",
    "cost",
    "Ouest-France \u2014 violences du 17 octobre : des d\xE9g\xE2ts estim\xE9s \xE0 des centaines de millions d\u2019euros, qui va payer ?",
    "https://www.ouest-france.fr/societe/manifestation/violences-du-17-octobre-des-degats-estimes-a-des-centaines-de-millions-deuros-qui-va-payer-la-facture-5e077b82-cbb5-11f1-b8bc-a46147b584ed",
    both(
      "who bears the cost \u2014 communes, insurers, the state \u2014 the basis for the footnote on the damage columns.",
      "qui supporte le co\xFBt \u2014 communes, assureurs, \xC9tat \u2014 base de la note de bas de page des colonnes dommages."
    )
  ),
  src(
    "of-assurance",
    "cost",
    "Ouest-France \u2014 17 octobre : le chiffrage pr\xE9cis des d\xE9g\xE2ts attendra la fin du d\xE9lai de 30 jours accord\xE9 par les assureurs",
    "https://www.ouest-france.fr/economie/assurance/17-octobre-le-chiffrage-precis-des-degats-devra-attendre-la-fin-du-delai-de-30-jours-accorde-par-les-assureurs-0da74e46-cdff-11f1-bf87-17eca79cb13c",
    both(
      "why every damage figure here is provisional: the insurers\u2019 30-day claim window had not closed at the time of writing.",
      "pourquoi tout chiffre de dommages est provisoire : le d\xE9lai de 30 jours des assureurs n\u2019\xE9tait pas \xE9coul\xE9 \xE0 la r\xE9daction."
    )
  ),
  src(
    "decryptargent",
    "cost",
    "D\xE9cryptargent \u2014 17 octobre : le premier bilan \xE9conomique",
    "https://decryptargent.fr/finances-personnelles/17-octobre-bilan-economique-premiers-chiffres/",
    both(
      "the first, earliest economic assessment of 17 Oct, superseded by IFRAP and CCI France.",
      "la premi\xE8re estimation \xE9conomique du 17 oct., supplant\xE9e par l\u2019IFRAP et CCI France."
    )
  ),
  src(
    "capital-policing",
    "cost",
    "Capital.fr \u2014 \xAB Combien ont co\xFBt\xE9 les 70 000 policiers de samedi \xBB",
    "https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269",
    both(
      "the \u20AC15,000\u201330,000 per CRS company per day and \u20AC3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.",
      "les r\xE9f\xE9rences de 15 000\u201330 000 \u20AC par compagnie de CRS et par jour, et de 3,4 M\u20AC pour 3 000 gendarmes, derri\xE8re la fourchette de co\xFBt du maintien de l\u2019ordre ; aussi les 1 435 interpellations et 53 policiers bless\xE9s du 24 oct."
    ),
    "2026-10-28"
  ),
  /* ------------------------------------------------------- 2026 — overseas */
  src(
    "la1ere-lyceens",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 ce que l\u2019on sait du mouvement des lyc\xE9ens, de la R\xE9union \xE0 la Guyane",
    "https://la1ere.franceinfo.fr/ce-que-l-on-sait-du-mouvement-des-lyceens-de-la-reunion-a-la-guyane-en-passant-par-la-guyane-mayotte-et-la-martinique-1744191.html",
    both(
      "the geography of the lyc\xE9en movement across R\xE9union, Guyane, Mayotte and Martinique \u2014 the overseas half of the protest count.",
      "la g\xE9ographie du mouvement lyc\xE9en \xE0 la R\xE9union, en Guyane, \xE0 Mayotte et en Martinique \u2014 la moiti\xE9 ultramarine du d\xE9compte."
    )
  ),
  src(
    "la1ere-territoires",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 la Guadeloupe, la Martinique et la R\xE9union, territoires les plus mobilis\xE9s depuis d\xE9but octobre",
    "https://la1ere.franceinfo.fr/colere-dans-les-lycees-et-contre-la-vie-chere-la-guadeloupe-la-martinique-et-la-reunion-les-territoires-les-plus-mobilises-dans-les-outre-mer-depuis-debut-octobre-1751730.html",
    both(
      "which three territories carry almost all overseas activity, and the ranking used in the split.",
      "les trois territoires qui portent presque toute l\u2019activit\xE9 ultramarine, et le classement retenu pour la ventilation."
    )
  ),
  src(
    "la1ere-gign",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 intervention du GIGN, manifestations et premi\xE8res condamnations : le climat social reste tendu",
    "https://la1ere.franceinfo.fr/intervention-du-gign-manifestations-et-premieres-condamnations-outre-mer-le-climat-social-reste-tendu-1750008.html",
    both(
      "the enforcement side overseas, which the ministry bilan never covers.",
      "le volet r\xE9pressif ultramarin, que le bilan minist\xE9riel ne couvre jamais."
    )
  ),
  src(
    "la1ere-martinique-hot",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 Martinique et Cara\xEFbe : les sujets chauds",
    "https://la1ere.franceinfo.fr/martinique/hot-topics-from-martinique-and-the-caribbean-1742126.html",
    both(
      "the Martinique strand, where the cost-of-living movement overlaps a pre-existing mobilisation.",
      "le volet martiniquais, o\xF9 le mouvement contre la vie ch\xE8re recouvre une mobilisation ant\xE9rieure."
    )
  ),
  src(
    "la1ere-reunion-saintpierre",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 une centaine de manifestants \xE0 Saint-Pierre et un barrage filtrant dans le nord",
    "https://la1ere.franceinfo.fr/reunion/mobilisation-sociale-une-centaine-de-manifestants-a-saint-pierre-et-un-barrage-filtrant-dans-le-nord-on-fait-le-point-1753413.html",
    both(
      "a R\xE9union day detail: ~100 at Saint-Pierre plus a filtering roadblock \u2014 regional-only, never extrapolated.",
      "un d\xE9tail journalier r\xE9unionnais : ~100 \xE0 Saint-Pierre et un barrage filtrant \u2014 r\xE9gional seulement, jamais extrapol\xE9."
    )
  ),
  src(
    "la1ere-archives-03nov",
    "overseas",
    "Outre-mer La 1\xE8re \u2014 archives du 3 novembre 2026",
    "https://la1ere.franceinfo.fr/archives/2026/03-novembre-2026/",
    both(
      "the day-archive route used where no standalone article existed (Guyane intersyndicale call).",
      "la voie des archives quotidiennes l\xE0 o\xF9 aucun article autonome n\u2019existait (appel de l\u2019intersyndicale guyanaise)."
    ),
    "2026-11-03"
  ),
  /* --------------------------------------------------- 2026 — reference */
  src(
    "wiki-lyceen-2026",
    "ref2026",
    "Wikip\xE9dia (fran\xE7ais) \u2014 Mouvement lyc\xE9en et \xE9tudiant de 2026 en France",
    "https://fr.wikipedia.org/wiki/Mouvement_lyc%C3%A9en_et_%C3%A9tudiant_de_2026_en_France",
    both(
      "the 1 Oct \u2013 16 Oct chronology of the school movement, which no ministry series covers.",
      "la chronologie du 1er au 16 oct. du mouvement lyc\xE9en, qu\u2019aucune s\xE9rie minist\xE9rielle ne couvre."
    )
  ),
  src(
    "wiki-17oct-2026",
    "ref2026",
    "Wikip\xE9dia (fran\xE7ais) \u2014 Manifestations du 17 octobre 2026 en France",
    "https://fr.wikipedia.org/wiki/Manifestations_du_17_octobre_2026_en_France",
    both(
      "the 17 Oct day page, used to cross-check the arrest and injury counts.",
      "la page du 17 oct., servant \xE0 recouper interpellations et bless\xE9s."
    )
  ),
  src(
    "wiki-automne-2026",
    "ref2026",
    "Wikip\xE9dia (fran\xE7ais) \u2014 Mouvement social d\u2019automne 2026 en France",
    "https://fr.wikipedia.org/wiki/Mouvement_social_d%27automne_2026_en_France",
    both(
      "the overall movement chronology and the list of national call days.",
      "la chronologie d\u2019ensemble du mouvement et la liste des journ\xE9es d\u2019appel nationales."
    )
  ),
  src(
    "wiki-civil-unrest-en",
    "ref2026",
    "Wikipedia (English) \u2014 2026 French civil unrest",
    "https://en.wikipedia.org/wiki/2026_French_civil_unrest",
    both(
      "the English-language summary, checked against the French pages for divergences in the injury counts.",
      "la synth\xE8se anglophone, recoup\xE9e avec les pages fran\xE7aises pour les \xE9carts de bless\xE9s."
    )
  ),
  src(
    "mavigilance-manifestation",
    "ref2026",
    "Ma vigilance \u2014 manifestation lyc\xE9enne : rassemblements et cort\xE8ges",
    "https://mavigilance.fr/themes/manifestation",
    both(
      "protest-level aggregation by theme, used for the count of actions rather than of participants.",
      "agr\xE9gation par th\xE8me, utilis\xE9e pour le nombre d\u2019actions plut\xF4t que de participants."
    )
  ),
  src(
    "mavigilance-lyceens",
    "ref2026",
    "Ma vigilance \u2014 mouvement lyc\xE9en : dates et appels",
    "https://mavigilance.fr/mouvements/lyceens",
    both(
      "the call calendar behind the \xAB protest taking place \xBB column on the school-movement days.",
      "le calendrier des appels derri\xE8re la colonne \xAB manifestations \xBB des journ\xE9es lyc\xE9ennes."
    )
  ),
  /* -------------------------------------------------------------- May 1968 */
  src(
    "wiki-mai68-fr",
    "mai68",
    "Mai 68",
    "https://fr.wikipedia.org/wiki/Mai_68",
    both(
      "1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10\u201311 May and the 1,000+ of 25 May.",
      "les foules du 1er mai (25 000 pr\xE9fecture / 100 000 CGT) et du 13 mai (230 000 pr\xE9fecture / 171 000 ORTF / 1 000 000 syndicats) ; les 469 interpellations des 10\u201311 mai et les 1 000 et plus du 25 mai."
    )
  ),
  src(
    "wiki-mai68-en",
    "mai68",
    "May 68 (English Wikipedia)",
    "https://en.wikipedia.org/wiki/May_68",
    both(
      "the 887 injured figure, which appears only in this article\u2019s infobox and is flagged accordingly \u2014 no French count was published.",
      "le chiffre de 887 bless\xE9s, pr\xE9sent uniquement dans l\u2019infobox de cet article et signal\xE9 comme tel \u2014 aucun d\xE9compte fran\xE7ais n\u2019a \xE9t\xE9 publi\xE9."
    )
  ),
  src(
    "nouvelobs-1mai-68",
    "mai68",
    "Le Nouvel Obs (Le Quotidien de 1968) \u2014 \xAB Cent mille personnes de R\xE9publique \xE0 Bastille \xBB",
    "https://www.nouvelobs.com/societe/le-quotidien-de-1968/20080424.OBS1184/cent-mille-personnes-de-republique-a-bastille.html",
    both(
      "the 1 May 1968 cort\xE8ge described day-of, the origin of the 100,000 union figure.",
      "le cort\xE8ge du 1er mai 1968 racont\xE9 le jour m\xEAme, origine du chiffre syndical de 100 000."
    )
  ),
  src(
    "publicsenat-1mai",
    "mai68",
    "Public S\xE9nat \u2014 \xAB Des 1er mai souvent tr\xE8s politiques \xBB",
    "https://www.publicsenat.fr/actualites/politique/des-1er-mai-souvent-tres-politiques-59701",
    both(
      "context for reading 1 May turnouts across episodes, including the 1968 and 2023 comparison.",
      "le contexte de lecture des foules du 1er mai entre \xE9pisodes, dont la comparaison 1968 / 2023."
    )
  ),
  src(
    "wiki-chrono-68",
    "mai68",
    "Wikip\xE9dia (fran\xE7ais) \u2014 Chronologie des \xE9v\xE9nements de mai-juin 1968",
    "https://fr.wikipedia.org/wiki/Chronologie_des_%C3%A9v%C3%A9nements_de_mai_-_juin_1968",
    both(
      "the day-by-day sequence that fixes which days enter the C\u2032 weekly series.",
      "la s\xE9quence jour par jour qui d\xE9termine les journ\xE9es retenues dans la s\xE9rie hebdomadaire de C\u2032."
    )
  ),
  src(
    "wiki-rassemblements",
    "mai68",
    "Wikip\xE9dia (fran\xE7ais) \u2014 Liste des rassemblements les plus importants en France",
    "https://fr.wikipedia.org/wiki/Liste_des_rassemblements_les_plus_importants_en_France",
    both(
      "the cross-episode leaderboard used to decide which movements belong in the comparison at all.",
      "le classement inter-\xE9pisodes servant \xE0 d\xE9cider quels mouvements entrent dans la comparaison."
    )
  ),
  /* ------------------------------------------------------------------- CPE */
  src(
    "wiki-cpe",
    "cpe",
    "Contrat premi\xE8re embauche",
    "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
    both(
      "the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16\u201318 Mar.",
      "la s\xE9rie de foules du CPE (7 f\xE9vr., 7 mars, 18 mars, 23 mars, 28 mars, 4 avr.) et les d\xE9comptes r\xE9pressifs strictement parisiens des 16\u201318 mars."
    )
  ),
  src(
    "wiki-cpe-en",
    "cpe",
    "2006 youth protests in France (English Wikipedia)",
    "https://en.wikipedia.org/wiki/2006_youth_protests_in_France",
    both(
      "the English summary, used for the participation estimates that the French page leaves out.",
      "la synth\xE8se anglophone, utilis\xE9e pour les estimations de participation absentes de la page fran\xE7aise."
    )
  ),
  src(
    "nouvelobs-cpe-chrono",
    "cpe",
    "Le Nouvel Obs \u2014 \xAB Crise du CPE : chronologie \xBB",
    "https://www.nouvelobs.com/societe/social/20060326.OBS1858/crise-du-cpe-chronologie.html",
    both(
      "the full chronology, including the 10 Apr withdrawal that ends the series.",
      "la chronologie compl\xE8te, dont le retrait du 10 avr. qui cl\xF4t la s\xE9rie."
    )
  ),
  src(
    "nouvelobs-cpe-mars",
    "cpe",
    "Le Nouvel Obs \u2014 \xAB CPE : les \xE9v\xE9nements du 16 au 18 mars \xBB",
    "https://www.nouvelobs.com/societe/social/20060321.OBS1191/cpe-les-evenements-du-16-au-18-mars.html",
    both(
      "the three peak days described day-of, used to date the enforcement counts.",
      "les trois journ\xE9es de pointe racont\xE9es au jour le jour, servant \xE0 dater les d\xE9comptes r\xE9pressifs."
    )
  ),
  src(
    "lemonde-16mars-2006",
    "cpe",
    "Le Monde \u2014 \xAB Des centaines de milliers de jeunes ont d\xE9fil\xE9 \xBB (16 mars 2006)",
    "https://www.lemonde.fr/international/article/2006/03/16/des-centaines-de-milliers-de-jeunes-ont-defile_751311_3210.html",
    both(
      "the 16 Mar turnout, the first day of the peak.",
      "la foule du 16 mars, premi\xE8re journ\xE9e du pic."
    ),
    "2006-03-16"
  ),
  src(
    "lemonde-17mars-2006",
    "cpe",
    "Le Monde \u2014 \xAB Des lyc\xE9ens en nombre dans les d\xE9fil\xE9s anti-CPE \xBB (17 mars 2006)",
    "https://www.lemonde.fr/la-crise-au-proche-orient/article/2006/03/17/des-lyceens-en-nombre-dans-les-defiles-anti-cpe_751768_734511.html",
    both(
      "17 Mar, the day the lyc\xE9ens rather than the students carry the movement.",
      "le 17 mars, jour o\xF9 les lyc\xE9ens plut\xF4t que les \xE9tudiants portent le mouvement."
    ),
    "2006-03-17"
  ),
  src(
    "lemonde-18mars-2006",
    "cpe",
    "Le Monde \u2014 \xAB Des d\xE9fil\xE9s dans toutes les villes \xBB (18 mars 2006)",
    "https://www.lemonde.fr/international/article/2006/03/18/des-defiles-dans-toutes-les-villes_752040_3210.html",
    both(
      "18 Mar and the nationwide spread, which is why the CPE week is not Paris-weighted.",
      "le 18 mars et la diffusion nationale, d\u2019o\xF9 une semaine CPE non pond\xE9r\xE9e par Paris."
    ),
    "2006-03-18"
  ),
  src(
    "aljazeera-19mars-2006",
    "cpe",
    "Al Jazeera \u2014 \xAB French protesters issue job ultimatum \xBB (19 March 2006)",
    "https://www.aljazeera.com/news/2006/3/19/french-protesters-issue-job-ultimatum",
    both(
      "the English-language account of the 18\u201319 Mar ultimatum, used to confirm the sequencing.",
      "le r\xE9cit anglophone de l\u2019ultimatum des 18\u201319 mars, servant \xE0 confirmer l\u2019encha\xEEnement."
    ),
    "2006-03-19"
  ),
  /* --------------------------------------------------------- Gilets jaunes */
  src(
    "wiki-gj",
    "gj",
    "Mouvement des Gilets jaunes",
    "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
    both(
      "the Act I\u201344 ministry turnout series and the Act I\u2013IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.",
      "la s\xE9rie minist\xE9rielle de foules des actes I \xE0 XLIV et les d\xE9comptes de gardes \xE0 vue / interpellations des actes I \xE0 IV. Les actes suivants n\u2019ont jamais \xE9t\xE9 publi\xE9s en s\xE9rie, d\u2019o\xF9 l\u2019arr\xEAt des courbes r\xE9pressives \xE0 la semaine 3."
    )
  ),
  src(
    "wiki-gj-deroulement",
    "gj",
    "Wikip\xE9dia (fran\xE7ais) \u2014 D\xE9roulement du mouvement des Gilets jaunes",
    "https://fr.wikipedia.org/wiki/D%C3%A9roulement_du_mouvement_des_Gilets_jaunes",
    both(
      "the act-by-act narrative that dates each turnout point.",
      "le r\xE9cit acte par acte qui date chaque point de foule."
    )
  ),
  src(
    "wikinews-8dec2018",
    "gj",
    "Wikinews (fran\xE7ais) \u2014 Gilets jaunes : samedi 8 d\xE9cembre 2018",
    "https://fr.wikinews.org/wiki/Gilets_jaunes_:_samedi_8_d%C3%A9cembre_2018",
    both(
      "Act IV day-of reporting: the 8 Dec turnout and the 1,700+ arrests.",
      "le compte rendu de l\u2019acte IV : foule du 8 d\xE9c. et plus de 1 700 interpellations."
    ),
    "2018-12-08"
  ),
  src(
    "of-gj-chiffres",
    "gj",
    "Ouest-France \u2014 \xAB Gilets jaunes : comment \xE9volue la mobilisation ? Tous les chiffres \xBB",
    "https://www.ouest-france.fr/societe/gilets-jaunes/gilets-jaunes-comment-evolue-la-mobilisation-tous-les-chiffres-6147118",
    both(
      "the running ministry-vs-union turnout table, used as the primary series and cross-checked against the Wikipedia acts.",
      "le tableau courant minist\xE8re / syndicats, utilis\xE9 comme s\xE9rie principale et recoup\xE9 avec les actes de Wikip\xE9dia."
    )
  ),
  src(
    "bbc-gj",
    "gj",
    "BBC News \u2014 yellow-vest protests",
    "https://www.bbc.com/news/world-europe-46577598",
    both(
      "the English narrative and the casualty figures quoted at the time.",
      "le r\xE9cit anglophone et les chiffres de bless\xE9s cit\xE9s \xE0 l\u2019\xE9poque."
    )
  ),
  src(
    "monde-diplo-gj",
    "gj",
    "Le Monde diplomatique \u2014 chronologie du mouvement des Gilets jaunes",
    "https://www.monde-diplomatique.fr/mav/168/PIRONET/61011",
    both(
      "an independent chronology, used to check the act numbering (the press and the state do not agree on it).",
      "une chronologie ind\xE9pendante, servant \xE0 v\xE9rifier la num\xE9rotation des actes (presse et \xC9tat ne s\u2019accordent pas)."
    )
  ),
  src(
    "rfi-gj",
    "gj",
    "RFI \u2014 Gilets jaunes : retour sur neuf actes de contestation",
    "https://www.rfi.fr/fr/france/20190118-gilets-jaunes-retour-neuf-actes-contestation-rue-interpellations",
    both(
      "the first nine acts condensed, with arrest figures \u2014 the only compact source for acts I\u2013IX enforcement.",
      "les neuf premiers actes en r\xE9sum\xE9, avec interpellations \u2014 seule source compacte pour la r\xE9pression des actes I \xE0 IX."
    )
  ),
  /* -------------------------------------------------- Nahel Merzouk, 2023 */
  src(
    "wiki-nahel",
    "nahel",
    "Mort de Nahel Merzouk",
    "https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk",
    both(
      "the 3,354 arrests and 722 officers injured of 27 Jun \u2013 2 Jul 2023, and the 108 of the following week.",
      "les 3 354 interpellations et 722 policiers bless\xE9s du 27 juin au 2 juill. 2023, et les 108 de la semaine suivante."
    )
  ),
  src(
    "wiki-nahel-emeutes",
    "nahel",
    "Wikip\xE9dia (fran\xE7ais) \u2014 \xC9meutes cons\xE9cutives \xE0 la mort de Nahel Merzouk",
    "https://fr.wikipedia.org/wiki/%C3%89meutes_cons%C3%A9cutives_%C3%A0_la_mort_de_Nahel_Merzouk",
    both(
      "the night-by-night breakdown of the four riot nights, which the casualty total does not carry.",
      "la ventilation nuit par nuit des quatre nuits d\u2019\xE9meute, absente du total de victimes."
    )
  ),
  src(
    "wiki-nahel-en",
    "nahel",
    "Nahel Merzouk riots (English Wikipedia)",
    "https://en.wikipedia.org/wiki/Nahel_Merzouk_riots",
    both(
      "the English summary and its damage estimate, used only as a cross-check.",
      "la synth\xE8se anglophone et son estimation de dommages, utilis\xE9es seulement en recoupement."
    )
  ),
  src(
    "mediapart-marche-blanche",
    "nahel",
    "Mediapart \u2014 \xAB La marche blanche pour Nahel, un cri de r\xE9volte plut\xF4t qu\u2019une minute de silence \xBB",
    "https://www.mediapart.fr/journal/france/290623/la-marche-blanche-pour-nahel-un-cri-de-revolte-plutot-qu-une-minute-de-silence",
    both(
      "the 29 Jun 2023 silent march, the only 2023 day with a participant count from a non-police source.",
      "la marche blanche du 29 juin 2023, seule journ\xE9e de 2023 dot\xE9e d\u2019un d\xE9compte non policier."
    ),
    "2023-06-29"
  ),
  src(
    "rfi-29juin-2023",
    "nahel",
    "RFI \u2014 le point sur la mort de Nahel (29 juin 2023)",
    "https://www.rfi.fr/fr/france/20230629-le-point-sur-la-mort-de-nahel-le-procureur-requiert-le-placement-en-d%C3%A9tention-provisoire-du-policier",
    both(
      "the legal chronology of 29 Jun, used to date the start of the riot series.",
      "la chronologie judiciaire du 29 juin, servant \xE0 dater le d\xE9but de la s\xE9rie d\u2019\xE9meutes."
    ),
    "2023-06-29"
  ),
  src(
    "of-4e-nuit",
    "nahel",
    "Ouest-France \u2014 mort de Nahel : une quatri\xE8me nuit d\u2019\xE9meutes, d\u2019une intensit\xE9 moindre",
    "https://www.ouest-france.fr/faits-divers/emeutes-urbaines/mort-de-nahel-une-quatrieme-nuit-demeutes-mais-des-violences-dune-intensite-moindre-5f28377d-edb2-4189-b320-5fa379186858",
    both(
      "the tapering after the third night, which is why the 2023 curve is drawn as an abrupt decay.",
      "la d\xE9crue apr\xE8s la troisi\xE8me nuit, d\u2019o\xF9 une courbe 2023 trac\xE9e en chute brutale."
    )
  ),
  src(
    "franceinfo-1an-marche",
    "nahel",
    "franceinfo \u2014 un an apr\xE8s, une marche silencieuse r\xE9unit plusieurs centaines de personnes",
    "https://www.franceinfo.fr/faits-divers/adolescent-tue-par-un-policier-a-nanterre/mort-de-nahel-a-nanterre-un-an-apres-une-marche-silencieuse-reunit-plusieurs-centaines-de-personnes_6633804.html",
    both(
      "the 29 Jun 2024 anniversary march, the 2024 point in the series.",
      "la marche anniversaire du 29 juin 2024, point 2024 de la s\xE9rie."
    ),
    "2024-06-29"
  ),
  src(
    "leparisien-marche-2024",
    "nahel",
    "Le Parisien \u2014 plusieurs centaines de personnes au d\xE9part de la marche silencieuse pour Nahel",
    "https://www.leparisien.fr/hauts-de-seine-92/nanterre-plusieurs-centaines-de-personnes-au-depart-de-la-marche-silencieuse-pour-nahel-29-06-2024-237YPUQKQZFQLHGTSHBOCKWVW4.php",
    both(
      "second count for the 2024 march, confirming it is an order of magnitude below 2023.",
      "second d\xE9compte de la marche 2024, confirmant un ordre de grandeur inf\xE9rieur \xE0 2023."
    ),
    "2024-06-29"
  ),
  /* --------------------------------------------------------- Pensions, 2023 */
  src(
    "wiki-retraites",
    "retraites",
    "Mouvement social contre la r\xE9forme des retraites de 2023",
    "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023",
    both(
      "the ministry and union turnout pairs for each national action day, 19 Jan \u2013 6 Jun 2023.",
      "les couples minist\xE8re / syndicats de chaque journ\xE9e nationale d\u2019action, du 19 janv. au 6 juin 2023."
    )
  ),
  src(
    "lemonde-en-7mars-2023",
    "retraites",
    "Le Monde (English) \u2014 \xAB March 7 protests among largest since 1995 \xBB",
    "https://www.lemonde.fr/en/les-decodeurs/article/2023/03/09/french-pension-reform-march-7-protests-among-largest-since-1995_6018714_8.html",
    both(
      "the 7 Mar peak placed against 1995 \u2014 the comparison the chart\u2019s annotation relies on.",
      "le pic du 7 mars situ\xE9 face \xE0 1995 \u2014 comparaison sur laquelle repose l\u2019annotation du graphique."
    ),
    "2023-03-09"
  ),
  src(
    "of-6juin-2023",
    "retraites",
    "Ouest-France \u2014 direct du 6 juin 2023 : les manifestations contre la r\xE9forme des retraites",
    "https://www.ouest-france.fr/economie/retraites/direct-greve-du-6-juin-suivez-les-manifestations-contre-la-reforme-des-retraites-en-france-e282f866-0393-11ee-bfa0-5e45e3198685",
    both(
      "the last national day, 6 Jun, which closes the series.",
      "la derni\xE8re journ\xE9e nationale, le 6 juin, qui cl\xF4t la s\xE9rie."
    ),
    "2023-06-06"
  ),
  /* --------------------------------------------------- Anti-RN, June 2024 */
  src(
    "lemonde-en-16juin-2024",
    "rn2024",
    "Le Monde (English) \u2014 French protesters turn out in droves against far right",
    "https://www.lemonde.fr/en/politics/article/2024/06/16/french-protesters-turn-out-in-droves-against-far-right-caught-between-despair-and-the-will-to-fight_6674931_5.html",
    both(
      "the 15\u201316 Jun 2024 marches against the Rassemblement national.",
      "les marches des 15\u201316 juin 2024 contre le Rassemblement national."
    ),
    "2024-06-16"
  ),
  src(
    "leparisien-15juin-2024",
    "rn2024",
    "Le Parisien \u2014 plus de 600 000 manifestants selon la CGT, 250 000 d\u2019apr\xE8s la police",
    "https://www.leparisien.fr/elections/legislatives/manifestations-anti-rn-plus-de-600-000-manifestants-selon-la-cgt-250-000-dapres-la-police-15-06-2024-4TWAL2AAQFG2DGMZ5AYYFJNQ3I.php",
    both(
      "the widest police/union gap in the entire comparison \u2014 a factor of 2.4, which is why the band is drawn explicitly.",
      "l\u2019\xE9cart police / syndicats le plus large de toute la comparaison \u2014 un facteur 2,4, d\u2019o\xF9 la fourchette explicite."
    ),
    "2024-06-15"
  ),
  /* -------------------------------------------------------- Bloquons tout */
  src(
    "wiki-bloquons",
    "bloquons",
    "Bloquons tout (English Wikipedia)",
    "https://en.wikipedia.org/wiki/Bloquons_tout",
    both(
      "the movement\u2019s chronology and its 10 Sep / 18 Sep / 2 Oct structure.",
      "la chronologie du mouvement et sa structure des 10 sept., 18 sept. et 2 oct."
    )
  ),
  src(
    "france24-bloquons",
    "bloquons",
    "France 24 \u2014 direct du 10 septembre 2025",
    "https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron",
    both(
      "197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) \u2014 the final ministry point of the evening, superseding the 175,000 of 17:45.",
      "197 000 participants, 596 rassemblements, 253 blocages, 540 interpellations (dont 211 \xE0 Paris) \u2014 le point minist\xE9riel final de la soir\xE9e, qui supplante les 175 000 de 17 h 45."
    ),
    "2025-09-10"
  ),
  src(
    "bfmtv-bloquons",
    "bloquons",
    "BFMTV \u2014 direct du 10 septembre",
    "https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html",
    both(
      "the intra-day revision of the count (175,000 \u2192 197,000), which is why the chart shows a band rather than a point.",
      "la r\xE9vision du d\xE9compte en cours de journ\xE9e (175 000 \u2192 197 000), d\u2019o\xF9 une fourchette plut\xF4t qu\u2019un point sur le graphique."
    ),
    "2025-09-10"
  ),
  src(
    "franceinfo-bloquons-cgt",
    "bloquons",
    "franceinfo \u2014 pr\xE8s de 250 000 personnes mobilis\xE9es selon la CGT, 197 000 selon l\u2019Int\xE9rieur",
    "https://www.franceinfo.fr/societe/bloquons-tout-mouvement-du-10-septembre/bloquons-tout-pres-de-250-000-personnes-mobilisees-dans-tout-le-pays-selon-la-cgt-175-000-selon-le-ministere-de-l-interieur_7484704.html",
    both(
      "the union side of the 10 Sep pair (~250,000), which completes the band.",
      "le c\xF4t\xE9 syndical du couple du 10 sept. (~250 000), qui compl\xE8te la fourchette."
    ),
    "2025-09-10"
  ),
  src(
    "liberation-10sept",
    "bloquons",
    "Lib\xE9ration \u2014 direct du 10 septembre : la mobilisation \xAB Bloquons tout \xBB",
    "https://www.liberation.fr/societe/en-direct-bloquons-tout-suivez-la-mobilisation-ce-mercredi-10-septembre-au-lendemain-de-la-nomination-de-sebastien-lecornu-a-matignon-20250910_7UGUHFIOUNGDJP67XSMTH5FKVA/",
    both(
      "the 175,000 ministry figure as first published, before the evening revision.",
      "les 175 000 du minist\xE8re tels que publi\xE9s d\u2019abord, avant la r\xE9vision du soir."
    ),
    "2025-09-10"
  ),
  src(
    "of-bloquons-infographies",
    "bloquons",
    "Ouest-France \u2014 \xAB 200 000 participants \xE0 Bloquons tout : est-ce mieux que les autres mobilisations ? \xBB",
    "https://www.ouest-france.fr/societe/manifestation/infographies-200-000-participants-a-bloquons-tout-est-ce-mieux-que-les-autres-mobilisations-0f322c98-8ef1-11f0-b582-5820cfc46140",
    both(
      "the 200,000 working figure and the pre-computed comparison with earlier movements, which the chart re-derives.",
      "le chiffre de travail de 200 000 et la comparaison d\xE9j\xE0 calcul\xE9e avec les mouvements ant\xE9rieurs, que le graphique recalcule."
    )
  ),
  src(
    "franceinfo-18sept-gav",
    "bloquons",
    "franceinfo \u2014 malgr\xE9 89 gardes \xE0 vue \xE0 Paris, Laurent Nu\xF1ez reconna\xEEt que la journ\xE9e s\u2019est \xAB plut\xF4t bien pass\xE9e \xBB",
    "https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-malgre-89-gardes-a-vue-a-paris-laurent-nunez-reconnait-que-la-journee-s-est-plutot-bien-passee_7501129.html",
    both(
      "the 18 Sep arrests (103 in Paris, 89 custodies) \u2014 a markedly lower repressive profile than 2026.",
      "les interpellations du 18 sept. (103 \xE0 Paris, 89 gardes \xE0 vue) \u2014 profil r\xE9pressif nettement plus bas qu\u2019en 2026."
    ),
    "2025-09-18"
  ),
  src(
    "franceinfo-18sept-direct",
    "bloquons",
    "franceinfo \u2014 direct du 18 septembre : jusqu\u2019\xE0 900 000 manifestants attendus",
    "https://www.franceinfo.fr/economie/greve/greve/direct-mobilisation-du-18-septembre-jusqu-a-900-000-manifestants-attendus-des-transports-perturbes-et-une-greve-qui-s-annonce-tres-suivie-dans-les-pharmacies-et-les-ecoles_7498174.html",
    both(
      "the pre-day expectation (900,000), kept to show how far the realised count fell short.",
      "l\u2019attente d\u2019avant-journ\xE9e (900 000), conserv\xE9e pour mesurer l\u2019\xE9cart avec le d\xE9compte r\xE9alis\xE9."
    ),
    "2025-09-18"
  ),
  src(
    "franceinfo-18sept-comparaison",
    "bloquons",
    "franceinfo \u2014 la mobilisation du 18 septembre a-t-elle \xE9t\xE9 plus ou moins forte que les pr\xE9c\xE9dents grands mouvements ?",
    "https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-la-mobilisation-a-t-elle-ete-plus-ou-moins-forte-que-lors-des-derniers-grands-mouvements-sociaux_7499668.html",
    both(
      "the explicit cross-movement comparison the C section reproduces.",
      "la comparaison inter-mouvements explicite que la section C reproduit."
    ),
    "2025-09-18"
  ),
  src(
    "franceinfo-2oct",
    "bloquons",
    "franceinfo \u2014 environ 195 000 personnes ont manifest\xE9 selon l\u2019Int\xE9rieur, pr\xE8s de 600 000 d\u2019apr\xE8s la CGT",
    "https://www.franceinfo.fr/economie/greve/greve-du-2-octobre-environ-195-000-personnes-ont-manifeste-en-france-selon-le-ministere-de-l-interieur-pres-de-600-000-d-apres-la-cgt_7528024.html",
    both(
      "the 2 Oct third wave: 195,000 ministry / ~600,000 CGT.",
      "la troisi\xE8me vague du 2 oct. : 195 000 minist\xE8re / ~600 000 CGT."
    ),
    "2025-10-02"
  ),
  src(
    "lefigaro-2oct",
    "bloquons",
    "Le Figaro \u2014 100 000 participants attendus : \xAB est-ce un chiffre assez bas comme le dit Bayrou ? \xBB",
    "https://www.lefigaro.fr/social/mouvement-du-10-septembre-100-000-participants-attendus-est-ce-un-chiffre-assez-bas-comme-le-dit-bayrou-20250905",
    both(
      "the political framing of the turnout numbers, which is why both bounds are kept rather than averaged.",
      "la mise en politique des chiffres de foule, d\u2019o\xF9 la conservation des deux bornes plut\xF4t qu\u2019une moyenne."
    ),
    "2025-09-05"
  ),
  src(
    "liberation-2oct",
    "bloquons",
    "Lib\xE9ration \u2014 direct du 2 octobre : journ\xE9es d\u2019actions et de gr\xE8ves",
    "https://www.liberation.fr/economie/social/en-direct-mobilisation-du-2-octobre-suivez-la-journee-dactions-et-de-greves-de-ce-jeudi-20251002_GFUGFS2GS5GPHAU5TVAGAZMGBI/",
    both(
      "second source for the 2 Oct pair.",
      "seconde source pour le couple du 2 oct."
    ),
    "2025-10-02"
  ),
  src(
    "of-bloquons-44a",
    "bloquons",
    "Ouest-France \u2014 \xAB Bloquons tout \xBB : une mobilisation en demi-teinte en Loire-Atlantique",
    "https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-mobilisation-en-demi-teinte-en-loire-atlantique-90dd52ae-c22c-11f0-a316-aa52a6afd2bb",
    both(
      "regional-only marker: the gap between the national headline and local reality.",
      "marqueur r\xE9gional : l\u2019\xE9cart entre le titre national et la r\xE9alit\xE9 locale."
    )
  ),
  src(
    "of-bloquons-44b",
    "bloquons",
    "Ouest-France \u2014 une soixantaine de personnes manifestent \xE0 Nantes ce samedi",
    "https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-soixantaine-de-personnes-manifestent-a-nantes-ce-samedi-766d30c0-c226-11f0-8509-2c0807403e46",
    both(
      "~60 in Nantes on the Saturday \u2014 the smallest unit cited anywhere in the comparison.",
      "~60 \xE0 Nantes le samedi \u2014 la plus petite unit\xE9 cit\xE9e dans toute la comparaison."
    )
  ),
  src(
    "of-bloquons-44c",
    "bloquons",
    "Ouest-France (Manche) \u2014 le collectif \xAB Indignons-nous \xBB tente de faire perdurer le mouvement",
    "https://www.ouest-france.fr/societe/manifestation/dans-la-manche-le-collectif-indignons-nous-tente-de-faire-perdurer-le-mouvement-apres-le-10-septembre-3828460e-c20f-11f0-8509-2c0807403e46",
    both(
      "how a local collective tried to sustain the movement after 10 Sep \u2014 context for the 18 Sep and 2 Oct tail.",
      "comment un collectif local a tent\xE9 de prolonger le mouvement apr\xE8s le 10 sept. \u2014 contexte de la queue des 18 sept. et 2 oct."
    )
  ),
  src(
    "figaro-bloquons",
    "bloquons",
    "Le Figaro \u2014 direct \xAB Bloquons tout \xBB des 10 et 11 septembre",
    "https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910",
    both(
      "the 18 Sep intersyndicale day and the 2 Oct third wave.",
      "la journ\xE9e intersyndicale du 18 sept. et la troisi\xE8me vague du 2 oct."
    ),
    "2025-09-10",
    "2025-09-11"
  )
];
var MENTIONS = [
  {
    name: "data.gouv.fr \u2014 base des mobilisations",
    note: both(
      "intended source for the metropolitan/overseas split; never actually retrieved.",
      "source pr\xE9vue pour la ventilation m\xE9tropole / outre-mer ; jamais effectivement consult\xE9e."
    )
  },
  {
    name: "CCI France",
    note: both(
      "author of the 2,488 / 2,538 shop counts, reached through Le Monde, franceinfo, BFMTV, LSA and La D\xE9p\xEAche.",
      "auteur des d\xE9comptes de 2 488 / 2 538 commerces, atteint via Le Monde, franceinfo, BFMTV, LSA et La D\xE9p\xEAche."
    )
  },
  {
    name: "Pr Laurent Thines (CHU de Besan\xE7on)",
    note: both(
      "author of the 79-serious-injury register attributed by Le Canard encha\xEEn\xE9; also cited directly as the injury floor.",
      "auteur du registre de 79 bless\xE9s graves attribu\xE9 par Le Canard encha\xEEn\xE9 ; \xE9galement cit\xE9 directement comme plancher."
    )
  },
  {
    name: "S\xE9nat \u2014 commission d\u2019enqu\xEAte de juin 2023",
    note: both(
      "the ~50,000 rioters and consolidated damage estimate, reached through the Senate press release above.",
      "les ~50 000 \xE9meutiers et l\u2019estimation consolid\xE9e des dommages, atteints via le communiqu\xE9 du S\xE9nat ci-dessus."
    )
  },
  {
    name: "France Police",
    note: both(
      "police union; publisher of the 750,000 counter-count for the Act II of the Gilets jaunes.",
      "syndicat policier ; auteur du contre-d\xE9compte de 750 000 pour l\u2019acte II des Gilets jaunes."
    )
  },
  {
    name: "Collectif \xAB Nombre jaune \xBB",
    note: both(
      "the independent crowd-counting group behind the alternative Gilets jaunes figures.",
      "le collectif ind\xE9pendant de comptage derri\xE8re les chiffres alternatifs des Gilets jaunes."
    )
  },
  {
    name: "Occurrence",
    note: both(
      "Paris crowd counts quoted in Part II but never linked to a page.",
      "comptages parisiens cit\xE9s dans la partie II, jamais li\xE9s \xE0 une page."
    )
  },
  {
    name: "CGT",
    note: both(
      "every union turnout figure here is the CGT\u2019s, relayed by the press.",
      "chaque chiffre syndical de foule est celui de la CGT, relay\xE9 par la presse."
    )
  },
  {
    name: "Union \xE9tudiante",
    note: both(
      "organiser of the student days; no count of its own was retrieved.",
      "organisatrice des journ\xE9es \xE9tudiantes ; aucun d\xE9compte propre n\u2019a \xE9t\xE9 retrouv\xE9."
    )
  },
  {
    name: "USL (intersyndicale lyc\xE9enne)",
    note: both(
      "the lyc\xE9en intersyndicate whose call calendar drives the school-movement rows.",
      "l\u2019intersyndicale lyc\xE9enne dont le calendrier d\u2019appels porte les lignes du mouvement scolaire."
    )
  },
  {
    name: "Pr\xE9fecture de police de Paris",
    note: both(
      "Paris-only counts (17 Oct, 7 Nov) are prefecture figures relayed by the press, never a national series.",
      "les chiffres strictement parisiens (17 oct., 7 nov.) sont des donn\xE9es pr\xE9fectorales relay\xE9es par la presse, jamais une s\xE9rie nationale."
    )
  }
];
var MARKER_KEY = [
  {
    key: "r",
    text: {
      en: "regional only \u2014 one d\xE9partement or one city, never extrapolated",
      fr: "r\xE9gional seulement \u2014 un d\xE9partement ou une ville, jamais extrapol\xE9"
    }
  },
  {
    key: "p",
    text: {
      en: "partial \u2014 a floor, or two publishers disagreeing; both bounds shown",
      fr: "partiel \u2014 un plancher, ou deux \xE9diteurs en d\xE9saccord ; les deux bornes affich\xE9es"
    }
  },
  {
    key: "f",
    text: {
      en: "lower bound \u2014 the true figure is at least this",
      fr: "borne inf\xE9rieure \u2014 le chiffre r\xE9el est au moins celui-ci"
    }
  },
  {
    key: "e",
    text: {
      en: "derived \u2014 modelled here, not published as such",
      fr: "d\xE9riv\xE9 \u2014 mod\xE9lis\xE9 ici, non publi\xE9 tel quel"
    }
  },
  {
    key: "c",
    text: {
      en: "stock or actions-total \u2014 a different basis; never sum it with the rest",
      fr: "stock ou total d\u2019actions \u2014 autre base de mesure ; ne jamais l\u2019additionner au reste"
    }
  },
  {
    key: "w",
    text: {
      en: "weekly aggregate \u2014 a week, not a day",
      fr: "agr\xE9gat hebdomadaire \u2014 une semaine, pas un jour"
    }
  },
  {
    key: "x",
    text: {
      en: "wider measure \u2014 establishments perturbed, with classes suspended, or closed, rather than schools fully blocked",
      fr: "mesure plus large \u2014 \xE9tablissements perturb\xE9s, cours suspendus ou ferm\xE9s, plut\xF4t que des lyc\xE9es enti\xE8rement bloqu\xE9s"
    }
  }
];
{
  const seen = /* @__PURE__ */ new Set();
  for (const s of SOURCES) {
    if (seen.has(s.id))
      throw new Error(`sources.ts: duplicate source id "${s.id}"`);
    seen.add(s.id);
  }
}
function byPublicationDate(a, b) {
  if (!a.date || !b.date) {
    if (a.date !== b.date) return a.date ? -1 : 1;
    return a.id.localeCompare(b.id);
  }
  return a.date !== b.date ? a.date < b.date ? -1 : 1 : (a.dateEnd ?? "").localeCompare(b.dateEnd ?? "") || a.id.localeCompare(b.id);
}
var SOURCES_BY_GROUP = (() => {
  const buckets = /* @__PURE__ */ new Map();
  for (const s of SOURCES) {
    const bucket = buckets.get(s.group);
    if (bucket) bucket.push(s);
    else buckets.set(s.group, [s]);
  }
  for (const bucket of buckets.values()) bucket.sort(byPublicationDate);
  return buckets;
})();
function dateLabel(s) {
  if (!s.date) return null;
  return s.dateEnd ? `${fmtDayMonth(s.date)}\u2013${fmtDate(s.dateEnd)}` : fmtDate(s.date);
}
function sourceItem(s) {
  const li = el("li");
  li.dataset.sourceId = s.id;
  const a = el("a", void 0, s.label);
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  li.append(a);
  const when = dateLabel(s);
  if (when) {
    li.append(document.createTextNode(" "));
    const time = el("time", "date", when);
    time.dateTime = s.date;
    li.append(time);
  }
  li.append(document.createTextNode(" \u2014 "));
  li.append(el("span", "what", bi(s.what)));
  return li;
}
function sourceGroup(id, summary, body) {
  const details = el("details", "source-group");
  details.dataset.group = id;
  const head = el("summary", "group-summary");
  head.append(...summary);
  details.append(head, ...body);
  return details;
}
function renderSources(host = document.getElementById("sources")) {
  if (!host) return;
  const kept = [...host.children].filter(
    (n) => /^H[1-6]$/.test(n.tagName)
  );
  if (kept[0]) kept[0].textContent = bi(BOX_TITLE);
  const box = el("div", "sources-box");
  box.append(el("p", "intro", bi(INTRO)));
  for (const group2 of GROUPS) {
    const items = SOURCES_BY_GROUP.get(group2.id);
    if (!items || items.length === 0) continue;
    const title = el("h3", void 0, bi(group2.title));
    title.append(" ", el("span", "count", String(items.length)));
    const list = el("ul");
    for (const s of items) list.append(sourceItem(s));
    box.append(
      sourceGroup(group2.id, [title], [el("p", "blurb", bi(group2.blurb)), list])
    );
  }
  const dl = el("dl", "mention-list");
  for (const { name, note: note2 } of MENTIONS) {
    dl.append(el("dt", void 0, name), el("dd", void 0, bi(note2)));
  }
  box.append(
    sourceGroup(
      "mentions",
      [el("h3", void 0, bi(MENTIONS_TITLE))],
      [el("p", "blurb", bi(MENTIONS_BLURB)), dl]
    )
  );
  const key = el("dl", "marker-list");
  for (const { key: marker, text } of MARKER_KEY) {
    key.append(el("dt", void 0, marker), el("dd", void 0, bi(text)));
  }
  box.append(key, el("p", "foot", bi(FOOT)));
  host.replaceChildren(...kept, box);
}

// src/client/theme.ts
var KEY = "fpc-theme";
var QUERY = "(prefers-color-scheme: dark)";
var TOGGLE = "[data-theme-toggle]";
var root = document.documentElement;
var media = () => typeof window.matchMedia === "function" ? window.matchMedia(QUERY) : null;
function systemTheme() {
  const q = media();
  return q ? q.matches ? "dark" : "light" : null;
}
function store(theme) {
  try {
    if (theme) localStorage.setItem(KEY, theme);
    else localStorage.removeItem(KEY);
  } catch {
  }
}
function currentTheme() {
  const explicit = root.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return systemTheme() ?? "light";
}
function repaint() {
  refreshTheme();
  scheduleRender();
}
function syncThemeToggle(host = document.querySelector(TOGGLE)) {
  if (!host) return;
  host.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  host.dataset.theme = currentTheme();
}
function setTheme(theme) {
  if (theme === systemTheme()) {
    store(null);
    delete root.dataset.theme;
  } else {
    store(theme);
    root.dataset.theme = theme;
  }
  syncThemeToggle();
  repaint();
}
function mountThemeToggle(host = document.querySelector(TOGGLE)) {
  if (!host || host.dataset.bound === "true") return () => {
  };
  const onClick = () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  };
  host.addEventListener("click", onClick);
  host.dataset.bound = "true";
  syncThemeToggle(host);
  return () => {
    host.removeEventListener("click", onClick);
    delete host.dataset.bound;
  };
}
function initTheme() {
  syncThemeToggle();
  const unbind = mountThemeToggle();
  const q = media();
  const onSystemChange = () => {
    if (root.dataset.theme) return;
    syncThemeToggle();
    repaint();
  };
  q?.addEventListener("change", onSystemChange);
  return () => {
    unbind();
    q?.removeEventListener("change", onSystemChange);
  };
}

// src/client/main.ts
function trellisHosts() {
  const episodeHost = byId("trellis-episodes");
  const itemHost = byId("trellis-items");
  const itemLegend = byId("legend-items");
  const eventLegend = byId("legend-events");
  if (!episodeHost || !itemHost || !itemLegend || !eventLegend) {
    console.warn("[trellis] one or more hosts missing");
    return null;
  }
  return { episodeHost, itemHost, itemLegend, eventLegend };
}
function render() {
  destroyAll();
  renderSources();
  renderChrome();
  applyStaticCopy();
  syncLangSwitch();
  mountCharts();
  const hosts = trellisHosts();
  if (hosts) {
    try {
      mountCrossEpisode(hosts);
    } catch (err) {
      console.error("[trellis]", err);
    }
  }
}
var frame = 0;
function scheduleRender() {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    try {
      render();
    } catch (err) {
      console.error("[render]", err);
    }
  });
}
var REQUIRED = [
  ...CHARTS.map((c) => c.id),
  "trellis-episodes",
  "trellis-items",
  "legend-items",
  "legend-events",
  "disclaimer",
  "sources"
];
function boot() {
  const missing = REQUIRED.filter((id) => !byId(id));
  if (missing.length) {
    console.error(
      `[boot] ${missing.length} host(s) absent from the DOM: ${missing.join(", ")}`
    );
    return;
  }
  applyUrlLang();
  mountLangSwitch();
  initTheme();
  onLocaleChange((_next, _prev) => {
    scheduleRender();
    announce(fill(t().a11y.switched, { lang: localeMeta().label }));
  });
  render();
  window.addEventListener("pagehide", destroyAll, { once: true });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
export {
  LOCALES,
  getLocale,
  localeFromUrl,
  render,
  scheduleRender,
  setLang
};
/*! Bundled license information:

@kurkle/color/dist/color.esm.js:
  (*!
   * @kurkle/color v0.3.4
   * https://github.com/kurkle/color#readme
   * (c) 2024 Jukka Kurkela
   * Released under the MIT License
   *)

chart.js/dist/chunks/index.js:
chart.js/dist/chart.js:
  (*!
   * Chart.js v4.6.1
   * https://www.chartjs.org
   * (c) 2026 Chart.js Contributors
   * Released under the MIT License
   *)
*/
//# sourceMappingURL=bundle.js.map
