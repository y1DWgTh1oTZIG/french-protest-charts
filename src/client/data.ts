/* Every figure and every projection. Sections A/B (chart.ts) and C (episodes.ts)
   both read these, which is why section C no longer needs a fallback table, an
   index patch applied to derived values, or its own recalculation of flags.

   ── Verification pass, 12 Nov 2026 ─────────────────────────────────────────
   Every cell below is carried from the research threads "French Protest Charts"
   Parts I and II, where each figure is cited to the Interior Ministry day-by-day
   bilans, IFRAP, prefecture bulletins or the press. Three corrections were
   applied in the first pass; each is marked FIX at its cell.

   ── Second pass, 12 Nov 2026: the window now opens on 15 September 2026 ───
   The 2026 lycée/student movement is traced back to its origins: the first
   mainland blockades were Le Rheu (7 Sep), Villeneuve-d'Ascq (14 Sep) and Caen
   (15 Sep); the national movement crystallised at Créteil on 18–19 Sep and
   went national on 28 Sep. Four corrections follow from that:

   FIX 5: 1 Oct arrests are a DAILY figure (1,949, "ce jeudi"), not a stock.
          The only published stock is 6,059 "since 28 September" (5 Oct). The
          daily series now runs 164 / 440 / 625 / 1,949 / 1,747 / [weekend
          150, derived] / 984 / 488 and sums to 6,547 through 6 Oct, which
          reproduces the ministry's own 6,059 + 488 exactly.
   FIX 6: the 1 Oct injury figures were two vintages of ONE cumulative series:
          119 (30 Sep: 85 students + 34 staff) and 235 (1 Oct: 170 students +
          65 staff). They are now separate stock cells on their own dates.
   FIX 7: the 1 Oct forces-injured band 84–305 mixed a Wednesday cumulative
          level (83) with a Thursday daily flow (~300). Kept as one band,
          re-flagged "e", and the 83 is no longer added a second time.
   FIX 8: 5 and 6 Oct carry their own daily enforcement figures (984 and 65;
          488 and 43), which raise the movement's forces-injured total from
          1,557–2,027 to 1,664–2,130.

   Arithmetic cross-checks:
     · arrest flows sum to 6,547 through 6 Oct = ministry stock 6,059 (5 Oct)
       + 488 (6 Oct) ✓;
     · forces injured: the ministry's running total is 1,580 (5 Nov); the
       published daily increments sum to 1,091–1,198, the difference being
       injuries on days with no published daily figure;
     · policing cost = DEPLOYMENT × RATE = €49.2M–€484.9M (cumulative high
       ≈ €485M) — unchanged.

   Flag vocabulary: n national · r regional only · p partial · f floor ·
   e derived · c cumulative stock / subset of a larger published total ·
   w weekly aggregate.      

   ── Third pass, 12 Nov 2026: the catalogue catches up with the window ───
   FIX 9:  the policing-cost total was mis-stated in the second pass. The
           September and 2/5 October deployment estimates and the missing
           18 October curfew day move the movement total from
           €49.2M–€484.9M to €54.3M–€629.9M. The old figure was the
           pre-September total and is withdrawn.
   FIX 10: 18 October had a curfew and published Paris arrests but no
           deployment cell, so the cost series silently skipped the day.
           Added at 2,000–8,000 agents (Paris scale, flagged "e").
   FIX 11: the 18 October arrest cell is Paris-only, so it is "r" like the
           other regional cells. "p" now means partial coverage everywhere,
           matching the flag vocabulary.
   FIX 12: the weekly aggregator is rewritten. A week whose last cell is a
           cumulative level takes that level as its figure; a "c" cell that
           is a subset of a larger published total is excluded from sums; a
           week containing a derived component is explained by that
           component's own note. This is what stops the 6 and 8 October
           damage cells (the same €6M increment) being added twice.

   Arithmetic cross-checks:
     · arrest flows sum to 6,547 through 6 Oct = ministry stock 6,059 (5 Oct)
       + 488 (6 Oct) ✓;
     · weekly arrests: 21 · 5,075 · 1,472 · 2,397–2,628 · 1,314–1,435 ·
       565–779 · 798–1,002 · 17 ✓;
     · weekly forces injured: 300–305 · 108 · 247 · 267 · 116–159 · 53–112 ✓;
     · forces injured, movement total = 1,664–2,130;
     · policing cost = DEPLOYMENT × RATE = €54.3M–€629.9M.
*/

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

export interface Pt {
  v: number | null;
  band: [number, number] | null;
  q: Flag | null;
  note: NoteRef | null;
  detach: boolean;
}
export type Series = Pt[];

const NIL: Pt = { v: null, band: null, q: null, note: null, detach: false };

export const START = "2026-09-15";
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

/* ── School holidays (vacances scolaires) ──────────────────────────────────
   Toussaint 2026: classes end Friday 16 October and resume Monday
   2 November — the same dates in zones A, B and C, so no zone logic.
   Source: service-public.gouv.fr / education.gouv.fr.                     */
export const HOLIDAY_START = "2026-10-17";
export const HOLIDAY_END = "2026-11-01";

/** Dotted pattern for the holiday connector — finer than the "no data" dash. */
export const HOLIDAY_DASH = [1.5, 3] as const;

export const inHoliday = (date: string): boolean =>
  date >= HOLIDAY_START && date <= HOLIDAY_END;

/** The week overlaps the holiday. */
export const weekTouchesHoliday = (weekStart: string): boolean =>
  weekStart <= HOLIDAY_END && addDays(weekStart, 6) >= HOLIDAY_START;

/** The week sits wholly inside the holiday — the metric did not exist. */
export const weekInHoliday = (weekStart: string): boolean =>
  weekStart >= HOLIDAY_START && addDays(weekStart, 6) <= HOLIDAY_END;

/** Dotted when a DAILY segment crosses the holiday. */
export function dailyHolidaySegment(
  a?: number | string | null,
  b?: number | string | null,
): boolean {
  const dateOf = (v?: number | string | null): string | undefined => {
    if (typeof v === "string") return v;
    if (typeof v === "number") return DATES[Math.round(v)];
    return undefined;
  };
  const da = dateOf(a);
  const db = dateOf(b);
  if (!da || !db) return false;
  return da <= HOLIDAY_END && db >= HOLIDAY_START;
}

/** Dotted when a WEEKLY connector bridges the empty holiday weeks. */
export function weeklyHolidaySegment(
  a?: number | null,
  b?: number | null,
): boolean {
  if (a === undefined || a === null || b === undefined || b === null)
    return false;
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  for (let i = lo + 1; i < hi; i++) {
    const wk = WEEKS[i];
    if (wk && weekInHoliday(wk.key)) return true;
  }
  return false;
}

/* --------------------------------------------------------------------- facts */

export const FACTS: Readonly<Record<string, Partial<Record<MetricKey, Obs>>>> =
  {
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
      arrests: { low: 21, high: 21, q: "r" },
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
      blockades: { low: 27, high: 27 },
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
      turnout: { low: 206_000, high: 300_000, q: "p" },
      arrests: { low: 440, high: 440 },
      protesterInjured: { low: 31, high: 31, q: "p" },
      blockades: { low: 45, high: 45 },
    },

    /* Wed 30 Sep — 356 establishments perturbed; 625 interpellations that
       day, which with 440 on the 29th makes the two-day total 1,065.
       83 police and gendarmes injured.
       The Education ministry's stock since the start of the blockades
       reaches 119 injured students and staff (85 students, 34 staff) — a
       cumulative level, hence "c". */
    "2026-09-30": {
      arrests: { low: 625, high: 625 },
      protesterInjured: { low: 119, high: 119, q: "c" },
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
      arrests: { low: 1_949, high: 1_949 },
      forcesInjured: { low: 300, high: 305, q: "e" },
      protesterInjured: { low: 235, high: 235, q: "c" },
      damagesCost: { low: 1, high: 1, q: "c" },
      blockades: { low: 222, high: 640 },
    },

    /* Fri 2 Oct — 1,747 interpellations that day and "more than 5,000 since
       Monday" (the daily series gives 4,925); 735 establishments perturbed,
       30% fewer than the day before, with urban violence near 158 of them
       (projectiles, attacks on officers, teachers, journalists and
       passers-by). A young police lieutenant was assaulted in Paris's 20th
       arrondissement. Geffray: 65 education staff injured since the start
       of the movement, 40 of them headteachers. */
    "2026-10-02": {
      arrests: { low: 1_747, high: 1_747 },
      blockades: { low: 400, high: 400, q: "f" },
    },

    /* Sat 3 Oct — the ministry's stock "6,059 interpellations since
       28 September" (5 Oct) minus 984 on Monday 5 Oct leaves 5,075 through
       Sunday 4 Oct; the daily figures for 28 Sep–2 Oct sum to 4,925. The
       difference, 150, is the weekend of 3–4 October. It is a two-day total
       derived by subtraction, not a Saturday figure — flagged "e" and
       carried on the Saturday, with the derivation in this comment. */
    "2026-10-03": {
      arrests: { low: 150, high: 150, q: "e" },
      blockades: { low: 735, high: 735, q: "x" },
    },

    /* Mon 5 Oct — 984 interpellations and 65 forces injured that day.
       Stocks published the same day: 6,059 interpellations since 28 Sep;
       715 police and gendarmes injured since the start of the movement;
       Matignon: 215 students and 85 education staff injured since the
       start, 34 of them headteachers. */
    "2026-10-05": {
      arrests: { low: 984, high: 984 },
      forcesInjured: { low: 65, high: 65 },
      blockades: { low: 400, high: 500, q: "x" },
    },

    /* Tue 6 Oct — "Acte III", first national school/student day.
       256,000 ministry / 450,000 organisers; Paris 56,000 / 100,000.
       488 interpellations and 43 forces injured that day; 215 students
       injured since mid-September. The €6M is the Île-de-France damage
       increment for the 1–8 Oct run and is therefore a subset, not an
       increment unique to 6 Oct. Flagged "c"; the anchor of the run is
       8 Oct. */
    "2026-10-06": {
      turnout: { low: 256_000, high: 450_000 },
      arrests: { low: 488, high: 488 },
      forcesInjured: { low: 43, high: 43 },
      damagesCost: { low: 6, high: 6, q: "c" },
      blockades: { low: 891, high: 1_800, q: "x" },
    },

    /* Thu 8 Oct — "Acte IV": 71,500 ministry / 130,000+ CGT; Paris 24,500.
       Anchor of the 1–8 Oct Île-de-France damage increment (€6M). */
    "2026-10-08": {
      turnout: { low: 71_500, high: 130_000 },
      damagesCost: { low: 6, high: 6, q: "e" },
      blockades: { low: 224, high: 224, q: "x" },
    },

    /* Sat 10 Oct — national cumulative damage stock: "déjà estimées à
       30 millions d'euros en France" since mid-September (CNEWS's own
       compilation of regional figures — no ministry published a national
       tally). Pannekoucke's parallel AURA estimate of €25–30M is NOT
       included, so this is neither a floor nor additive with the regional
       figures. Flagged "c": a stock, never summed with flows. */
    "2026-10-10": {
      damagesCost: { low: 30, high: 30, q: "c" },
      blockades: { low: 40, high: 40, q: "f" },
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
      blockades: { low: 19, high: 19, q: "r" },
    },

    /* Tue 13 Oct — "Acte V": 214 high schools closed (94.2% open), 161,500
       ministry / 480,000 youth intersyndicate (41,500 Paris), 40 police
       and gendarmes injured.
       FIX 13 (third pass): the €1.5M cell is GONE from this date — it
       was Normandy, and it was published on 12 October. */
    "2026-10-13": {
      turnout: { low: 161_500, high: 480_000 },
      forcesInjured: { low: 40, high: 40 },
      blockades: { low: 214, high: 214, q: "x" },
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
      turnout: { low: 550_000, high: 800_000 },
      arrests: { low: 2_397, high: 2_628 },
      forcesInjured: { low: 207, high: 207, q: "e" },
      protesterInjured: { low: 55, high: 1000, q: "e" },
      damagesCost: { low: 244, high: 866, q: "e" },
    },

    /* Sun 18 Oct — Paris curfew only, 108 interpellations.
       FIX 3 (first pass): the €1.8–5M damage figure is a subset of the
       17–18 Oct IFRAP weekend total, so it is flagged "c" and cannot be
       added to it.
       FIX 11 (third pass): "r", not "p" — the figure is Paris-only, and
       "p" now means partial coverage. */
    "2026-10-18": {
      arrests: { low: 108, high: 108, q: "r" },
      damagesCost: { low: 1.8, high: 5, q: "c" },
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
      turnout: { low: 410_000, high: 800_000 },
      arrests: { low: 1_314, high: 1_435 },
      forcesInjured: { low: 267, high: 267 },
      protesterInjured: { low: 150, high: 150 },
      damagesCost: { low: 1_000, high: 1_000, q: "c" },
    },

    /* Sat 31 Oct — 291 actions → 227 consolidated.
       320,000 ministry / ~500,000 youth organisations; Paris 70,000.
       Arrests 565 at 21h → 779 cumulative (incl. 214 on the Halloween night).
       Forces injured 116 by 21h + 43 that night = 159.
       515 fires handled; 36 shops degraded, 3 pillaged — no cost figure. */
    "2026-10-31": {
      turnout: { low: 320_000, high: 500_000 },
      arrests: { low: 565, high: 779 },
      forcesInjured: { low: 116, high: 159 },
      damagesCost: { low: 0.4, high: 3.3, q: "e" },
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
      turnout: { low: 575_000, high: 1_600_000 },
      arrests: { low: 448, high: 642 },
      forcesInjured: { low: 53, high: 112 },
      protesterInjured: { low: 18, high: 18, q: "f" },
      blockades: { low: 81, high: 1_000 },
    },

    /* Sat 7 Nov — 141 actions; ~70,000 officers, 25 blindés, 15 water-cannon
       trucks; ~40,000 preventive checks; Caen campus dispersed by 50 CRS.
       146,000 ministry / 250,000 youth intersyndicate; Paris 46,000 / 75,000.
       Arrests 232 at 18h → 360+ at 19h.
       Security-force casualties acknowledged but no number published. */
    "2026-11-07": {
      turnout: { low: 146_000, high: 250_000 },
      arrests: { low: 350, high: 360 },
    },

    /* Mon 9 Nov — regional only: Bègles 4, Lyon 8, Strasbourg 5 = 17.
       ~50 Île-de-France schools disrupted with mortar fire; Rennes 2
       evacuated; Brest rally; Guadeloupe: lycée blocked at Baie-Mahault. */
    "2026-11-09": { arrests: { low: 17, high: 17, q: "r" } },
  };

export const DEPLOYMENT: Readonly<Record<string, Obs>> = {
  /* September deployment is an ASSUMPTION, on the same basis as the early
     October cells: no official headcount exists for these days. The band
     spans the marginal cost of one CRS company-day to the Sainte-Soline
     all-in benchmark. It is an order-of-magnitude placeholder for the
     policing-cost series, not a measurement. */
  "2026-09-28": { low: 5_000, high: 20_000, q: "e" },
  "2026-09-29": { low: 5_000, high: 20_000, q: "e" },
  "2026-09-30": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-01": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-02": { low: 10_000, high: 30_000, q: "e" },
  "2026-10-05": { low: 10_000, high: 30_000, q: "e" },
  "2026-10-06": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-08": { low: 5_000, high: 20_000, q: "e" },
  /* 12 Oct: three cities at once — Île-de-France (~80 lycées perturbed),
     Lyon/Rhône (27 établissements), Strasbourg. No headcount published:
     the only concrete data is "une dizaine de camions de gendarmes
     mobiles" at the Strasbourg schools and several CRS/police vans at
     porte Dorée, Paris. */
  "2026-10-12": { low: 2_000, high: 8_000, q: "e" },
  "2026-10-13": { low: 5_000, high: 20_000, q: "e" },
  "2026-10-17": {
    low: 60_000,
    high: 60_000,
  } /* 18 Oct: Paris curfew with published arrests, no published headcount.
     Paris-area scale, same basis as the other estimated days. */,
  "2026-10-18": { low: 2_000, high: 8_000, q: "e" },
  "2026-10-24": { low: 70_000, high: 70_000 },
  "2026-10-31": { low: 70_000, high: 70_000 },
  "2026-11-05": { low: 70_000, high: 70_000 },
  "2026-11-07": { low: 70_000, high: 70_000 },
};

/* ── Forces injured: the ministry's running total ───────────────────────────
   The daily "blessés" figures are not one statistic. Some are increments for
   the day; others are the minister's running total since the movement began.
   These are the published levels, and they are what identifies 17 October:
   997, then 1,144 on consolidation, is not that day's toll.

   The reconciliation is exact, and it is the proof that the later daily
   figures are increments:
     1,144 (17 Oct) + 267 (24 Oct) + 116 (31 Oct) + 53 (5 Nov) = 1,580 (5 Nov)
   and at the earlier point:
     715 (5 Oct) + 43 (6 Oct) = 758 ≈ 761 (8 Oct).

   Sources: Le Figaro 5 Oct (715, since the start of the movement); Médiapart
   13 Nov 2026, citing Nuñez (761 on 8 Oct, 937 on 14 Oct, 1,580 on 5 Nov);
   BFMTV 18 Oct (997 → 1,144 for 17 Oct). */

export const FORCES_STOCK: Readonly<Record<string, Obs>> = {
  "2026-09-30": { low: 83, high: 83 },
  "2026-10-05": { low: 715, high: 715 },
  "2026-10-08": { low: 761, high: 761 },
  "2026-10-14": { low: 937, high: 937 },
  "2026-10-17": { low: 997, high: 1_144 },
  "2026-11-05": { low: 1_580, high: 1_580 },
};

/* Levels derived from the published total plus the published increments that
   follow it. Flagged "e" wherever they are plotted. */
export const FORCES_STOCK_DERIVED: Readonly<Record<string, Obs>> = {
  "2026-10-01": { low: 383, high: 388 }, // 83 (30 Sep) + 300–305 (1 Oct)
  "2026-10-24": { low: 1_411, high: 1_411 }, // 1,144 (17 Oct) + 267
  "2026-10-31": { low: 1_527, high: 1_570 }, // + 116–159
};

/** € per officer per day: CRS-company marginal opex → Sainte-Soline all-in.
 *  Low  = marginal cost of one CRS company-day (overtime, travel, fuel,
 *         accommodation, munitions). Salaries are excluded because officers
 *         are paid anyway.
 *  High = 2023 Sainte-Soline benchmark: ~3,000 gendarmes ≈ €3.4M → €1,133.
 *  Equipment context: grenade €36–75, LBD Monocup €1,280, Centaure €80,000.
 *  Yields a movement total of €49.2M–€484.9M (cumulative high ≈ €485M). */
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

/* The running total, as published and as derived.
 *
 * `detach: false` is deliberate and is the one place this file overrides the
 * convention: "c" here means "this is a level", not "this must not be joined
 * to the national line". The levels ARE the national line — a running total
 * that rises. The tooltip suffix still reads "· stock", because the flag is
 * what the suffix looks at. */
function projectForcesStock(): Series {
  return DATES.map((date) => {
    const pub = FORCES_STOCK[date];
    if (pub) {
      return {
        v: round2((pub.low + pub.high) / 2),
        band: [pub.low, pub.high] as [number, number],
        q: "c",
        note: { k: "obs", date, metric: "forcesInjuredStock" } as NoteRef,
        detach: false,
      };
    }
    const der = FORCES_STOCK_DERIVED[date];
    if (der) {
      return {
        v: round2((der.low + der.high) / 2),
        band: [der.low, der.high] as [number, number],
        q: "e",
        note: { k: "obs", date, metric: "forcesInjuredStock" } as NoteRef,
        detach: false,
      };
    }
    return NIL;
  });
}

/* ── Aggregation rules (third pass, 12 Nov 2026) ─────────────────────────
   1. A "c" cell is a cumulative level, or a subset of a larger published
      total. It is never added to a flow.
   2. If the week's LAST cell for the metric is a cumulative level, and
      nothing else in the week is larger, that level IS the week's figure —
      a level is a stronger statement than a partial sum, and summing flows
      into it would double-count. The week is flagged "c" and detached, and
      it borrows the cell's own observation note, because "N days counted"
      would be the wrong caption for a stock.
   3. Otherwise a "c" cell that is a subset of a bigger figure in the same
      week is excluded from the sum and counted in the note. This is what
      keeps the 6 and 8 October damage cells (one €6M increment, published
      twice) from being added to €12M.
   4. Regional-only ("r") cells are excluded whenever a national-scope cell
      exists for the same week.
   5. A week containing a derived ("e") component is explained by that
      component's own note, so the tooltip says what makes the figure
      uncertain.
   6. The weekly figure is a weekly aggregate ("w") unless the week is
      regional only ("r"), includes a floor ("f") or is partial ("p").     */
function aggregate(key: MetricKey, op: "sum" | "max"): Series {
  return WEEKS.map((week) => {
    const cells: { date: string; obs: Obs; q: Flag }[] = [];
    for (const d of week.dates) {
      const obs = FACTS[d]?.[key];
      if (!obs) continue;
      cells.push({ date: d, obs, q: obs.q ?? "n" });
    }
    if (!cells.length) return NIL;

    const last = cells[cells.length - 1];
    const othersHigh = Math.max(
      ...cells.filter((c) => c !== last).map((c) => c.obs.high),
      Number.NEGATIVE_INFINITY,
    );

    /* Rule 2 — the week's last cell is a cumulative level and nothing in
       the week is larger: the level IS the week's figure. */
    if (last.q === "c" && last.obs.high >= othersHigh) {
      return {
        v: round2((last.obs.low + last.obs.high) / 2),
        band: [round2(last.obs.low), round2(last.obs.high)] as [number, number],
        q: "c",
        note: { k: "obs", date: last.date, metric: key } as NoteRef,
        detach: isDetached("c"),
      };
    }

    /* Rules 3–4 — split the cells. */
    const regional = cells.filter((c) => c.q === "r");
    const subsets = cells.filter((c) => c.q === "c");
    const flows = cells.filter((c) => c.q !== "c" && c.q !== "r");
    const regionalOnly = flows.length === 0 && regional.length > 0;
    let pool = regionalOnly ? regional : flows;

    /* Nothing but subsets in the week: take the largest published stock. */
    if (!pool.length) {
      if (!subsets.length) return NIL;
      pool = [
        subsets.reduce((best, x) => (x.obs.high > best.obs.high ? x : best)),
      ];
    }

    let low: number;
    let high: number;
    let value: number;
    let peak: string | undefined;

    if (op === "sum") {
      low = pool.reduce((a, x) => a + x.obs.low, 0);
      high = pool.reduce((a, x) => a + x.obs.high, 0);
      value = (low + high) / 2;
    } else {
      low = Math.max(...pool.map((x) => x.obs.low));
      high = Math.max(...pool.map((x) => x.obs.high));
      const top = pool.reduce((best, x) =>
        (x.obs.low + x.obs.high) / 2 > (best.obs.low + best.obs.high) / 2
          ? x
          : best,
      );
      value = (top.obs.low + top.obs.high) / 2;
      peak = top.date;
    }

    /* Rule 5 — a derived component explains the week better than the
       generic note. */
    const derived = pool
      .filter((x) => x.q === "e")
      .sort((a, b) => b.obs.high - a.obs.high)[0];

    const excluded = cells.length - pool.length;
    const partial = pool.some((x) => x.q === "p");
    const parts: WeekNoteParts = {
      days: new Set(pool.map((x) => x.date)).size,
      kind: regionalOnly ? "regional" : "national",
      peak,
      noNational: regionalOnly || undefined,
      excluded: excluded > 0 ? excluded : undefined,
      floored: pool.some((x) => x.q === "f") || undefined,
      clipped: week.touchesEdge || undefined,
    };

    return {
      v: round2(value),
      band: [round2(low), round2(high)] as [number, number],
      q: regionalOnly ? "r" : parts.floored ? "f" : partial ? "p" : "w",
      note: derived
        ? ({ k: "obs", date: derived.date, metric: key } as NoteRef)
        : ({ k: "week", p: parts } as NoteRef),
      detach: regionalOnly,
    };
  });
}

/* ── Weekly PEAK, never a sum ──────────────────────────────────────────────
   The same lycée is blocked on several consecutive days; a weekly total
   would count one school many times over. So the weekly figure is the
   peak day of the week, exactly as for turnout.

   Regional days are excluded when a national figure exists in the same
   week; a week that is wholly inside the holiday is empty, because the
   metric did not exist. A week whose peak comes from a wider measure
   ("x") inherits that flag and borrows the cell's own note.            */
function aggregateBlockades(): Series {
  return WEEKS.map((week) => {
    const cells: { date: string; obs: Obs; q: Flag }[] = [];
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
    const parts: WeekNoteParts = {
      days: new Set(pool.map((c) => c.date)).size,
      kind: regionalOnly ? "regional" : "national",
      peak: top.date,
      noNational: regionalOnly || undefined,
      excluded: cells.length - pool.length || undefined,
      floored: pool.some((c) => c.q === "f") || undefined,
      clipped: week.touchesEdge || undefined,
      vacation: weekTouchesHoliday(week.key) || undefined,
    };

    return {
      v: round2((top.obs.low + top.obs.high) / 2),
      band: [round2(top.obs.low), round2(top.obs.high)] as [number, number],
      q: regionalOnly ? "r" : wide ? "x" : top.q === "f" ? "f" : "w",
      note: wide
        ? ({ k: "obs", date: top.date, metric: "blockades" } as NoteRef)
        : ({ k: "week", p: parts } as NoteRef),
      detach: regionalOnly,
    };
  });
}

export const DAILY: Readonly<Record<string, Series>> = {
  turnout: projectDaily("turnout"),
  arrests: projectDaily("arrests"),
  forcesInjured: projectDaily("forcesInjured"),
  forcesInjuredStock: projectForcesStock(),
  protesterInjured: projectDaily("protesterInjured"),
  damagesCost: projectDaily("damagesCost"),
  blockades: projectDaily("blockades"),
  policing: projectPolicingDaily(),
  policingCumulative: projectPolicingCumulative(),
};

export const WEEKLY: Readonly<Record<string, Series>> = {
  turnout: aggregate("turnout", "max"),
  arrests: aggregate("arrests", "sum"),
  forcesInjured: aggregate("forcesInjured", "sum"),
  protesterInjured: aggregate("protesterInjured", "sum"),
  blockades: aggregateBlockades(),
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
  // Week of 28 Sep: the injury figure is the cumulative level reached on
  // 1 Oct (235 students and staff). The cell-level "c" flag produces this
  // on its own; the override documents the intent and survives any future
  // re-ordering of the underlying cells.
  "2026-09-28": { i: "c" },
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
    // A flag is only meaningful where there is a band: an empty week must
    // not inherit an override and sprout a phantom marker.
    if (pt.band && q && q !== "n") out.flags[m] = q;
    if (pt.note) out.notes[m] = pt.note;
  }
  return out;
});

/* ── Casualty breakdown (sections A and B) ─────────────────────────────────
 *
 * The injured series in DAILY/WEEKLY hold one figure per day or week. These
 * breakdowns do not, and they are not interchangeable:
 *
 *   · the CRS file is an administrative count with two categories, light and
 *     not-light, for one month (October) and one corps;
 *   · the 17 October tally is a police count of all forces since 30 September,
 *     with a serious sub-count and no light category;
 *   · the protester figure is a case register with no total at all.
 *
 * Different populations, different windows, different categories. The table
 * keeps each on its own row and never sums across rows.
 *
 * Sources: Médiapart 13 Nov 2026 for the CRS file (1,233 declared, 1,167
 * light, 94.6%); BFMTV 18 Oct for the 1,144 consolidation and its 7 serious;
 * Le Progrès 10 Oct via Contre-Attaque for Givors; Médiapart 3 Nov for the
 * protester cases. The Sainte-Soline row is 2023 and is marked as a precedent,
 * not as 2026 data. */

export type Why =
  | "notPublished"
  | "noDenominator"
  | "binaryFile"
  | "noTally"
  | "noneDocumented";

/** A cell is a figure, a range, a count of documented cases, or an absence
 *  with a stated reason. `d` marks a figure obtained by subtraction. */
export type Cell =
  | { readonly s: "n"; readonly v: number; readonly d?: true }
  | {
      readonly s: "r";
      readonly lo: number;
      readonly hi: number;
      readonly d?: true;
    }
  | { readonly s: "c"; readonly n: number }
  | { readonly s: "x"; readonly why: Why };

export interface SevRow {
  /** Key in casualties.scope. */
  readonly id: string;
  readonly total: Cell;
  readonly serious: Cell;
  readonly light: Cell;
  /** Not light, not broken down further — the file's second category. */
  readonly other: Cell;
}

/* ── A: the levels, at the finest window each source publishes ── */

export const SEVERITY_LEVELS: readonly SevRow[] = [
  {
    /* 1,167 / 1,233 = 94.65% → the 94.6% the file itself states. */
    id: "crsOctober",
    total: { s: "n", v: 1_233 },
    serious: { s: "x", why: "binaryFile" },
    light: { s: "n", v: 1_167 },
    other: { s: "n", v: 66, d: true },
  },
  {
    /* All forces, running total at the peak, consolidated. */
    id: "forcesPeak",
    total: { s: "n", v: 1_144 },
    serious: { s: "n", v: 7 },
    light: { s: "x", why: "notPublished" },
    other: { s: "x", why: "notPublished" },
  },
  {
    /* No total has ever been published, so no share can exist. */
    id: "protesters",
    total: { s: "x", why: "noDenominator" },
    serious: { s: "x", why: "noTally" },
    light: { s: "x", why: "noDenominator" },
    other: { s: "x", why: "noDenominator" },
  },
];

/* ── B: the same question asked of a week ──
 *
 * Increments are derived from FORCES_STOCK: the difference between the
 * running total at the end of the week and at its start. The reconciliation
 * is exact against the ministry's 1,580:
 *
 *   83 + 854 (to 14 Oct) + 207 + 267 + 116 + 53 = 1,580
 *
 * The 116 is not a range: 1,527 + 53 = 1,580 rules out the 159 implied by
 * the day's own figure. The 7 serious are attached to the 1,144 level, which
 * falls in the week of 12 October, not to that week's 207 increment. */

export const SEVERITY_WEEKS: readonly SevRow[] = [
  {
    id: "week12oct",
    total: { s: "n", v: 207, d: true },
    serious: { s: "n", v: 7 },
    light: { s: "x", why: "notPublished" },
    other: { s: "x", why: "notPublished" },
  },
  {
    id: "week19oct",
    total: { s: "n", v: 267, d: true },
    serious: { s: "x", why: "notPublished" },
    light: { s: "x", why: "notPublished" },
    other: { s: "x", why: "notPublished" },
  },
  {
    id: "week26oct",
    total: { s: "n", v: 116, d: true },
    serious: { s: "x", why: "notPublished" },
    light: { s: "x", why: "notPublished" },
    other: { s: "x", why: "notPublished" },
  },
  {
    id: "week2nov",
    total: { s: "n", v: 53 },
    serious: { s: "x", why: "notPublished" },
    light: { s: "x", why: "notPublished" },
    other: { s: "x", why: "notPublished" },
  },
  {
    /* The month is the smallest window at which a split exists at all. */
    id: "crsOctober",
    total: { s: "n", v: 1_233 },
    serious: { s: "x", why: "binaryFile" },
    light: { s: "n", v: 1_167 },
    other: { s: "n", v: 66, d: true },
  },
];

/* ── Circumstances ──
 *
 * No source publishes a causation breakdown. What exists is a set of case
 * reports, each a named incident. `n` in a "c" cell counts documented cases,
 * never a proportion of a total: four documented cases do not mean four per
 * cent, and they do not mean four in total. */

export interface CaseRow {
  readonly id: string;
  readonly side: "forces" | "protesters";
  readonly kind: "accidental" | "conflictual";
  readonly count: Cell;
  /** Keys in casualties.cases, in the order they should read. */
  readonly cases: readonly string[];
  /** Era marker: this row is not 2026 data. */
  readonly reference?: true;
}

export const CASES: readonly CaseRow[] = [
  {
    id: "forcesAccidental",
    side: "forces",
    kind: "accidental",
    count: { s: "c", n: 4 },
    cases: ["givors", "crsWrist", "crsAnkle"],
  },
  {
    id: "forcesConflictual",
    side: "forces",
    kind: "conflictual",
    count: { s: "x", why: "noTally" },
    cases: ["helmet", "groin2023"],
  },
  {
    id: "protesterConflictual",
    side: "protesters",
    kind: "conflictual",
    count: { s: "x", why: "noTally" },
    cases: ["mael", "alaric", "eyes"],
  },
  {
    id: "protesterAccidental",
    side: "protesters",
    kind: "accidental",
    count: { s: "x", why: "noneDocumented" },
    cases: [],
  },
  {
    id: "sainteSoline",
    side: "forces",
    kind: "accidental",
    count: { s: "c", n: 29 },
    cases: ["sainteSoline"],
    reference: true,
  },
];

/** What each section can and cannot resolve, for B's second table. */
export interface ResolutionRow {
  readonly id: string;
  readonly weekly: "no" | "yes";
}
