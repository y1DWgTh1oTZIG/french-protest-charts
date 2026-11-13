/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four series per panel, one shared log axis.
   Companion: one panel per series, one line per episode on a sequential ramp.

   ── Verification pass, 12 Nov 2026 ─────────────────────────────────────────
   Every p/a/f/i cell below was checked against the sourced weekly tables in
   "French Protest Charts" Part II and, for the 2026 episode, against the
   ministry's September–October bilans. Numeric changes since the previous
   pass: the 2026 episode now opens on 14 September 2026 (nine weekly rows
   instead of seven) and carries the Act I figures; the pensions episode
   gains two enforcement rows; the Nahel p band was replaced by a sourced
   one; the Gilets jaunes enforcement cells were replaced by per-act figures
   that match the published source.

   Convention in this file: p = protestors at the PEAK DAY of the week;
   a/f/i = weekly totals. Bands are authority (low) → organiser (high) where
   an organiser count exists; otherwise a point value. */

import {
  Chart,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import {
  a11y,
  compact,
  fill,
  fmtSpan,
  fmtWeek,
  nf,
  plural,
  t,
} from "./i18n.ts";
import { END, STUDENT_WEEKS, type StudentWeek } from "./data.ts";
import {
  METRICS,
  bandOf,
  isDetached,
  midOf,
  type Episode,
  type EpisodeId,
  type Flag,
  type Metric,
  type Row,
} from "./model.ts";
import { THEME, alpha, gapSegment, track } from "./canvas.ts";
import { noteText } from "./notes.ts";
import { el } from "./dom.ts";
import { wrapTooltipLines } from "./tooltip.ts";
import { fromChart, keyboardChart } from "./a11y.ts";

/* ------------------------------------------------------------------- types */

interface Pt {
  x: number;
  y: number; // midpoint of the published range — this is what gets plotted
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

interface PanelDataset extends ChartDataset<"line", Pt[]> {
  __item: Metric;
  __ep: number;
  __color: string;
}

/* --------------------------------------------------------------- constants */

const DIM = THEME.dim;

/** Colour only — labels come from t().items. */
const SERIES: readonly { key: Metric; color: string }[] = [
  { key: "p", color: "#1d4ed8" },
  { key: "a", color: "#b91c1c" },
  { key: "f", color: "#047857" },
  { key: "i", color: "#b45309" },
];

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = [
  "#D6E6F2",
  "#B0CFE6",
  "#86B4D7",
  "#5C97C5",
  "#357AB0",
  "#1B5C92",
  "#0A3A63",
] as const;

/* -------------------------------------------------------------------- data */

/* ── May 1968 ───────────────────────────────────────────────────────────────
   The street crowd was measured ad hoc: prefecture counts, "surface occupée"
   estimates and union claims. Only 1, 6, 10 and 13 May carry a crowd figure.
   The general strike (up to ~10M workers on 25 May) is a DIFFERENT population
   from the march and is deliberately excluded from the p series.
   The 30 May counter-demonstration (300,000 prefecture / 1M Gaullists) is a
   pro-government rally and is likewise excluded from p.                   */
const MAY68: Episode = {
  id: "may68",
  start: "1968-04-29",
  end: "1968-06-30",
  weeks: [
    /* 1 May, République → Bastille: 25,000 (police) vs 100,000 (CGT). */
    { w: 0, from: "1968-04-29", to: "1968-05-05", p: [25_000, 100_000] },
    {
      /* 6 May: >20,000 to the Sorbonne; 10 May: 20,000 (12,000 police).
         Night of 10–11 May: 6,255 police, 125 cars damaged / 63 burnt,
         469 arrests. The 891 high adds 422 early-May arrests.
         Forces: 300+ on 6 May, 247 on 10–11 May.
         Protesters injured: ≥100 — no national count was published. */
      w: 1,
      from: "1968-05-06",
      to: "1968-05-12",
      p: 20_000,
      a: [469, 891],
      f: [247, 300],
      i: 100,
      flag: { i: "f" },
    },
    /* 13 May, Paris — peak of the episode: prefecture 230,000 · ORTF 171,000
       · surface-area estimate 500,000 · unions 1,000,000. */
    { w: 2, from: "1968-05-13", to: "1968-05-19", p: [230_000, 1_000_000] },
    {
      /* 25 May: 1,000+ arrests (floor), ~9M strikers, ORTF walkout.
         887 injured — from the English-Wikipedia infobox, attributed to 25 May
         only. Weak provenance, flagged "e". */
      w: 3,
      from: "1968-05-20",
      to: "1968-05-26",
      a: 1_000,
      i: 887,
      flag: { a: "f", i: "e" },
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
    { w: 8, from: "1968-06-24", to: "1968-06-30" },
  ],
};

/* ── CPE 2006 ───────────────────────────────────────────────────────────────
   The worst-documented episode for enforcement: the CAJ total (4,500 arrests,
   1,950 in garde à vue, 635 prosecutions) is movement-wide, not a per-day
   series, and it counts arrests rather than custody. The Paris-only figures
   for 18 March are the most reliable single-day numbers in the episode.
   OPEN GAP (closed as "no such figure exists"): 15 Feb, 25 Feb, 4 Mar and
   11 Mar action days carry no crowd figure in either encyclopaedic source;
   the only series published is 7 Feb, 16 Mar, 28 Mar and 4 Apr. One addition
   was made: 14 Mar 2006 = 41,000 (police source), a second action day
   inside the week of 16 Mar.                                         */
const CPE: Episode = {
  id: "cpe",
  start: "2006-02-06",
  end: "2006-04-16",
  weeks: [
    /* 7 Feb: first national action day, 187 demonstrations. */
    { w: 0, from: "2006-02-06", to: "2006-02-12", p: [200_000, 400_000] },
    /* 7 Mar: ">1 million" claimed; ~38 universities on strike by 9 Mar. */
    { w: 4, from: "2006-03-06", to: "2006-03-12", p: [400_000, 1_000_000] },
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
      p: [500_000, 1_500_000],
      a: [156, 167],
      f: 34,
      i: 70,
      flag: { i: "e" },
    },
    {
      /* 23 Mar: 21 universities fully blocked, 67 striking or blocked.
         630 arrests, 90 forces injured. */
      w: 6,
      from: "2006-03-20",
      to: "2006-03-26",
      p: [220_000, 450_000],
      a: 630,
      f: 90,
    },
    /* 28 Mar: 4th national action day, 600 arrests. */
    {
      w: 7,
      from: "2006-03-27",
      to: "2006-04-02",
      p: [1_055_000, 2_710_000],
      a: 600,
    },
    /* 4 Apr: peak day of the episode. */
    { w: 8, from: "2006-04-03", to: "2006-04-09", p: [1_000_000, 3_100_000] },
    /* CPE scrapped 10 Apr; the movement splits, Easter follows. */
    { w: 9, from: "2006-04-10", to: "2006-04-16" },
  ],
};

/* ── Gilets jaunes ──────────────────────────────────────────────────────────
   One Ministry count per Saturday act, so no range is plotted: the episode is
   deliberately a ministry series. Acts 34–43 were published as "NC" (not
   communicated) and Acts 45–52 were never quantified — absence of a figure,
   not absence of people.
   Act I's 287,700 counts ALL actions including road blockades, so it is an
   actions-total rather than a march count: flagged "c", hollow, and excluded
   from the index baseline.
   Act II was initially published as 106,301 and revised up 8 days later.     */
const GJ_ACTS: readonly [number, string, number][] = [
  [0, "2018-11-17", 287_700],
  [1, "2018-11-24", 166_000],
  [2, "2018-12-01", 136_000],
  [3, "2018-12-08", 136_000],
  [4, "2018-12-15", 66_000],
  [5, "2018-12-22", 38_600],
  [6, "2018-12-29", 32_000],
  [7, "2019-01-05", 50_000],
  [8, "2019-01-12", 84_000],
  [9, "2019-01-19", 84_000],
  [10, "2019-01-26", 69_000],
  [11, "2019-02-02", 58_600],
  [12, "2019-02-09", 51_400],
  [13, "2019-02-16", 41_500],
  [14, "2019-02-23", 46_600],
  [15, "2019-03-02", 39_300],
  [16, "2019-03-09", 28_600],
  [17, "2019-03-16", 32_300],
  [18, "2019-03-23", 40_500],
  [19, "2019-03-30", 33_700],
  [20, "2019-04-06", 22_300],
  [21, "2019-04-13", 31_000],
  [22, "2019-04-20", 27_900],
  [23, "2019-04-27", 23_600],
  [24, "2019-05-04", 18_900],
  [25, "2019-05-11", 18_600],
  [26, "2019-05-18", 15_500],
  [27, "2019-05-25", 12_500],
  [28, "2019-06-01", 9_500],
  [29, "2019-06-08", 10_300],
  [30, "2019-06-15", 7_000],
  [31, "2019-06-22", 11_800],
  [32, "2019-06-29", 5_800],
  [43, "2019-09-07", 7_000],
];

/** Organiser / union counter-counts for the Gilets jaunes acts, published
 *  alongside the ministry figure but NOT plotted (the episode is a ministry
 *  series). Exported so the data is auditable and so a band version can be
 *  switched on without re-research: a band version would make this episode
 *  comparable with the others, which use authority–organiser ranges.
 *  Source: FR-Wikipedia "Déroulement du mouvement des Gilets jaunes" and
 *  Ouest-France's running count of the mobilisation. */
export const GJ_ORGANISER_COUNTS: Readonly<Record<number, number>> = {
  1: 750_000, // France Police union, Act II
  7: 123_400, // Act VIII,  5 Jan 2019
  8: 159_200, // Act IX,  12 Jan 2019
  9: 147_400, // Act X,   19 Jan 2019
  10: 123_200, // Act XI,  26 Jan 2019
  11: 116_000, // Act XII,  2 Feb 2019
  13: 104_100, // Act XIV, 16 Feb 2019
};

/** Enforcement figures exist only for Acts I–IV; later acts were not published
 *  as a series.
 *  Act I: ministry communiqué — peak 287,710 at 17:00, 3,000 sites occupied,
 *    1 death, 409 injured, 117 interpellations of which 73 GàV. The 409 is
 *    all sides and is NOT split, so no f/i pair is plotted.
 *  Act II: 24 injured including 5 police; 101 arrestations (ministry) or
 *    103 interpellations (Le JDD) for the same day. The 19 protester
 *    injuries are DERIVED (24 − 5), hence "e".
 *  Act III: Arc de Triomphe vandalism; no per-act totals published.
 *  Act IV: 1,385 interpellations and 974 GàV; ~89,000 agents mobilised —
 *    the largest enforcement operation of the episode. */
const GJ_EXTRA: Readonly<Record<number, Pick<Row, "a" | "f" | "i" | "flag">>> =
  {
    0: { a: [117, 73], flag: { a: "f" } },
    1: { a: [101, 103], f: 5, i: 19, flag: { i: "e" } },
    2: {},
    3: { a: 1_385 },
  };

const GILETS: Episode = {
  id: "gj",
  start: "2018-11-12",
  end: "2019-09-09",
  weeks: GJ_ACTS.map(([w, date, n]) => ({
    w,
    from: date,
    to: date,
    act: w + 1,
    p: n,
    ...(GJ_EXTRA[w] ?? {}),
    flag: {
      ...(w === 0 ? { p: "c" as Flag } : {}),
      ...(GJ_EXTRA[w]?.flag ?? {}),
    },
  })),
};

/* ── Nahel 2023 ─────────────────────────────────────────────────────────────
   Under-counted by march numbers: most gatherings were banned, and the crowd
   figure that exists describes the tribute march, not the riot. The riot's
   scale is carried by arrests, burnt vehicles and the Senate's ~50,000
   "émeutiers" estimate for the whole episode.
   Week 0 = 27 Jun – 2 Jul: 3,354 arrests, 722 officers injured, 2 deaths
   (Brahim Bouarram 27 Jun; a young man 1 Jul), 5,662 vehicles burnt, 1,029
   buildings damaged.
   Week 1 = 3–9 Jul: 108 arrests (72 + 16 + 20 over 3–5 Jul), 1 officer hurt.
   Note the two totals differ between sources: the English-Wikipedia infobox
   (5,662 vehicles, 3,300+ arrests, 808 officers injured, €650M) and the
   French-Wikipedia day table (5,954 vehicles, 3,462 arrests, 723 officers
   injured) do not match; the figures used here are the day-table ones.
   The p band is an EPISODE-LEVEL rioter estimate: NO crowd count exists for
   any riot night, and the Place de la République demonstration in the
   sources was called for 8 July. Darmanin 8,000–12,000; Senate committee
   ~50,000; Brochand 100,000–200,000 — the band uses the Senate figure as
   its high, so the high is conservative. Flagged "e". */
const NAHEL: Episode = {
  id: "nahel",
  start: "2023-06-27",
  end: "2023-07-09",
  weeks: [
    {
      w: 0,
      from: "2023-06-26",
      to: "2023-07-02",
      p: [8_000, 50_000],
      a: 3_354,
      f: 722,
      flag: { p: "e" },
    },
    { w: 1, from: "2023-07-03", to: "2023-07-09", a: 108, f: 1 },
  ],
};

/* ── Retirement reform 2023 ─────────────────────────────────────────────────
   Crowds only: no national weekly arrest or injury series was published for
   this movement. Two action days in one week (7 and 11 Feb) means the
   "peak day" convention understates it — the real unit is the action-day
   sequence. The union total runs about 2.8× the ministry total, the widest
   organiser/authority gap of any episode in this file.
   14 March was the CALL; the action day was 15 March (480,000 ministry /
   1.78M CGT), already in w8. The missing enforcement data belongs to
   23 Mar (457 arrests, 441 forces injured) and 6 Apr (111 arrests, 154
   police injured). Both are now plotted — they are the only enforcement
   data points this episode has.
   OPEN GAP: the w7 band (1.28M–3.5M) has an unsourced high; the sourced
   figures for that week are 11 Mar ≈368,000 and "early March" 1.1–1.4M.   */
const PENSIONS: Episode = {
  id: "pensions",
  start: "2023-01-19",
  end: "2023-06-08",
  weeks: [
    { w: 0, from: "2023-01-16", to: "2023-01-22", p: [1_120_000, 2_000_000] },
    { w: 2, from: "2023-01-30", to: "2023-02-05", p: [1_270_000, 2_800_000] },
    { w: 3, from: "2023-02-06", to: "2023-02-12", p: [963_000, 2_500_000] },
    { w: 4, from: "2023-02-13", to: "2023-02-19", p: [440_000, 1_300_000] },
    { w: 7, from: "2023-03-06", to: "2023-03-12", p: [1_280_000, 3_500_000] },
    { w: 8, from: "2023-03-13", to: "2023-03-19", p: [480_000, 1_700_000] },
    {
      /* 23 Mar: the flashpoint — 49.3 passed, two failed no-confidence votes.
         Ministry: up to 1.08M nationwide / 119,000 Paris; CGT 3.5M / 800,000.
         Darmanin's consolidated day: 457 arrests, 441 security forces injured.
         An earlier evening statement had given 80+ arrests / 123 police hurt,
         so 457/441 is the final figure and the only one plotted. */
      w: 9,
      from: "2023-03-20",
      to: "2023-03-26",
      p: [1_089_000, 3_500_000],
      a: 457,
      f: 441,
    },
    {
      /* 27 Mar: the eleventh day of mobilisation, after the 5 April talks
         failed. Expected 600,000–800,000 nationwide (60,000–90,000 Paris).
         Interior Ministry: 111 arrests, 154 police officers injured. */
      w: 11,
      from: "2023-04-03",
      to: "2023-04-09",
      p: [570_000, 2_000_000],
      a: 111,
      f: 154,
    },
    { w: 10, from: "2023-03-27", to: "2023-04-02", p: [740_000, 2_000_000] },
    { w: 12, from: "2023-04-10", to: "2023-04-16", p: [380_000, 1_500_000] },
    { w: 16, from: "2023-05-01", to: "2023-05-07", p: [782_000, 2_300_000] },
    { w: 20, from: "2023-06-05", to: "2023-06-08", p: [281_000, 900_000] },
  ],
};

/* ── Bloquons tout 2025 ─────────────────────────────────────────────────────
   The label first appears on social media in May 2025; the first national
   action was 10 September 2025 against the Bayrou budget.
   10 Sep: the ministry's figure counts PARTICIPANTS IN ACTIONS, not cortèges —
   the same methodological trap as Gilets jaunes Act I — so it is flagged "c".
     It was also revised up from an early-evening count of ~29,000 to
     175,000–197,000; CGT ~250,000. 596 rallies, 253 blockages, 540 arrests
     (211 in Paris).
   18 Sep: an intersyndicale strike day — a different mobilisation from the
     movement's own actions. 309 arrests nationwide (103 in Paris, 89 GàV),
     26 forces injured, 11 protesters injured including 1 journalist.
   2 Oct: weakest mobilisation since 1 May 2025.
   w2 (22–28 Sep) is deliberately EMPTY: the movement ran three actions only
   — 10 Sep, 18 Sep and 2 Oct — and no 21 Sep march appears in any source.
   OUTCOME: Bayrou's government dissolved; the 2023 pension reform put on hold. */
const BLOQUONS: Episode = {
  id: "bt",
  start: "2025-09-10",
  end: "2025-10-05",
  weeks: [
    {
      w: 0,
      from: "2025-09-08",
      to: "2025-09-14",
      p: [175_000, 250_000],
      a: 540,
      flag: { p: "c" },
    },
    {
      w: 1,
      from: "2025-09-15",
      to: "2025-09-21",
      p: [500_000, 1_000_000],
      a: 309,
      f: 26,
      i: 11,
    },
    { w: 3, from: "2025-09-29", to: "2025-10-05", p: [195_000, 600_000] },
  ],
};

/* -------------------------------------------------------------- 2026 rows */

/** STUDENT_WEEKS already carries bands, flags and note refs; this is a copy, not
 *  a recalculation — the fallback table and the index patch are gone.
 *  The window now opens on the week of 14 Sep 2026, so the episode runs nine
 *  weekly rows instead of seven:
 *    w0 14–20 Sep — no published figure for any metric (EMPTY)
 *    w1 21–27 Sep — 21 interpellations (Paris only, "r")
 *    w2 28 Sep–4 Oct — Act I (29 Sep) and Acte II (1 Oct); the week's injury
 *        figure is the cumulative level of 235 reached on 1 Oct ("c")
 *    w3 5–11 Oct — Acte III (6 Oct)
 *    w4 12–18 Oct — 17 Oct
 *    w5 19–25 Oct — 24 Oct
 *    w6 26 Oct–1 Nov — 31 Oct
 *    w7 2–8 Nov — 5 and 7 Nov
 *    w8 9–15 Nov — 9 Nov, clipped by the window
 *  Week 0's injury cell is empty, and the first injury figure is the floor
 *  of 1 on 28 Sep; 17 Oct (flag "e") anchors the injury series. */
function rows2026(): Row[] {
  return STUDENT_WEEKS.map((wk: StudentWeek, w) => {
    const row: Row = { w, from: wk.key, to: wk.end, partial: wk.touchesEdge };
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

const STUDENTS: Episode = {
  id: "students26",
  start: STUDENT_WEEKS[0].key,
  end: END, // the window's last day, not the Sunday of the final week
  weeks: rows2026(),
};

const EPISODES: readonly Episode[] = [
  MAY68,
  CPE,
  GILETS,
  NAHEL,
  PENSIONS,
  BLOQUONS,
  STUDENTS,
];

/** The cap for the companion trellis is the largest week INDEX at which any
 *  episode carries an arrest or injury figure — not the latest date.
 *  That is w11 (6 Apr 2023, pensions: 111 arrests, 154 police injured).
 *  The 2026 episode now runs its enforcement from w2 (28 Sep) to w8 (9 Nov). */
const ENFORCEMENT_LAST = EPISODES.reduce(
  (last, ep) =>
    ep.weeks.reduce(
      (l, r) =>
        r.a !== undefined || r.f !== undefined || r.i !== undefined
          ? Math.max(l, r.w)
          : l,
      last,
    ),
  0,
);

/* -------------------------------------------------------------------- text */

/** Tooltip title: "16 – 22 Jan · 19 Jan", "Act 1 · 17 Nov 2018", "W3 · 12–18 Oct". */
function rowTitle(ep: Episode, r: Row): string {
  const m = t();
  if (ep.id === "students26") {
    const base = fmtWeek(r.from, r.to);
    return r.partial ? fill(m.panels.partialWeek, { label: base }) : base;
  }
  const when =
    r.act !== undefined
      ? fill(m.panels.act, { n: r.act })
      : fmtWeek(r.from, r.to);
  const action = m.episodes[ep.id].weeks[r.w]?.action;
  return action ? fill(m.panels.withAction, { when, action }) : when;
}

function noteFor(id: EpisodeId, r: Row, m: Metric): string | undefined {
  if (id === "students26") {
    return (
      noteText(r.noteRef?.[m]) || t().episodes.students26.fallbackNote?.[m]
    );
  }
  return t().episodes[id].weeks[r.w]?.note?.[m];
}

/* --------------------------------------------------------------- indexing */

/** Memoised: rawExtent() used to rebuild every series ~33× per render, each pass
 *  re-running t(), fmtWeek() and noteText(). Cleared on every mount (locale-bound). */
let seriesCache = new Map<string, Pt[] | null>();

function seriesData(ep: Episode, key: Metric): Pt[] | null {
  const id = `${ep.id}:${key}`;
  if (seriesCache.has(id)) return seriesCache.get(id)!;

  const rows = ep.weeks
    .filter((r) => r[key] !== undefined)
    .sort((a, b) => a.w - b.w);
  const out =
    rows.length === 0
      ? null
      : (() => {
          const flagOf = (r: Row): Flag => r.flag?.[key] ?? "n";
          const baseRow = rows.find((r) => flagOf(r) !== "c") ?? rows[0];
          const base = midOf(baseRow[key]!);
          return rows.map((r) => {
            const [low, high] = bandOf(r[key]!);
            return {
              x: r.w,
              y: (low + high) / 2,
              low,
              high,
              flag: flagOf(r),
              note: noteFor(ep.id, r, key),
              base,
              t: rowTitle(ep, r),
            };
          });
        })();

  seriesCache.set(id, out);
  return out;
}

function buildDataset(
  ep: Episode,
  epIndex: number,
  key: Metric,
  color: string,
  maxX: number,
): PanelDataset | null {
  const all = seriesData(ep, key);
  if (!all) return null;

  const points = all.filter((p) => p.x <= maxX);
  if (!points.length) return null;

  return {
    label: t().items[key].label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: points.map((p) => (p.flag === "c" ? 3 : 2.75)),
    pointBackgroundColor: points.map((p) =>
      isDetached(p.flag) ? THEME.hollow : color,
    ),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: gapSegment(1, [5, 4]),
    __item: key,
    __ep: epIndex,
    __color: color,
  };
}

function rawExtent(
  eps: readonly Episode[],
  keys: readonly Metric[],
  maxX: number,
): [number, number] {
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

/* ------------------------------------------------------------------ scales */

function xScale(maxW: number) {
  const step = maxW <= 8 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: "linear" as const,
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
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
      const out: { value: number }[] = [];
      for (let v = 0; v <= maxW + 0.001; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s: { height: number }) => {
      s.height = 20;
    },
  };
}

/** Padding in log space keeps every marker off the frame without inventing round bounds. */
function logBounds(lo: number, hi: number): [number, number] {
  const l = Math.log10(Math.max(lo, 1e-6));
  const h = Math.log10(Math.max(hi, l + 0.1));
  const pad = Math.max(0.06, (h - l) * 0.05);
  return [10 ** (l - pad), 10 ** (h + pad)];
}

/** 1-per-decade for wide ranges, 1-and-3 for medium, 1-2-5 for narrow. */
function logTicks(min: number, max: number): number[] {
  const l = Math.log10(min);
  const span = Math.log10(max) - l;
  const mantissas = span > 4.5 ? [1] : span > 1.5 ? [1, 3] : [1, 2, 5];
  const out: number[] = [];

  for (let e = Math.floor(l); e <= Math.ceil(Math.log10(max)); e++) {
    for (const mm of mantissas) {
      const v = Number((mm * 10 ** e).toPrecision(12));
      if (v > min * 1.01 && v < max / 1.01) out.push(v);
    }
  }
  return out;
}

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = logTicks(min, max);
  return {
    type: "logarithmic" as const,
    min,
    max,
    grid: { color: THEME.grid, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: THEME.muted,
      padding: 6,
      callback: (v: string | number) => compact().format(Number(v)),
    },
    afterBuildTicks: (axis: { ticks: { value: number }[] }) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 46;
    },
  };
}

/* ----------------------------------------------------------------- tooltip */

const pctOf = (v: number, base: number): string => {
  const r = (100 * v) / base;
  return r >= 10 ? `${Math.round(r)}%` : `${Number(r.toFixed(1))}%`;
};

function tooltipSpec() {
  const m = t();
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<"line">[]) =>
        wrapTooltipLines((items[0].raw as Pt).t, items[0], "title"),
      label: (item: TooltipItem<"line">) => {
        const p = item.raw as Pt;
        const value =
          p.low === p.high
            ? nf().format(Math.round(p.low))
            : `${nf().format(Math.round(p.low))} – ${nf().format(Math.round(p.high))}`;
        const flag = m.flags[p.flag];
        return wrapTooltipLines(
          flag
            ? fill(m.tooltip.lineWithFlag, { value, flag })
            : fill(m.tooltip.linePlain, { value }),
          item,
          "body",
        );
      },
      afterLabel: (item: TooltipItem<"line">) => {
        const note = (item.raw as Pt).note;
        return note ? wrapTooltipLines(note, item, "body") : "";
      },
      footer: (items: TooltipItem<"line">[]) => {
        const p = items[0].raw as Pt;
        const n = nf().format(Math.round(p.base));
        return wrapTooltipLines(
          Math.abs(p.y - p.base) / p.base < 1e-9
            ? fill(m.tooltip.firstFigure, { n })
            : fill(m.tooltip.shareOfFirst, { pct: pctOf(p.y, p.base), n }),
          items[0],
          "footer",
        );
      },
    },
  };
}

/* ---------------------------------------------------------------- emphasis */

const episodePanels: Chart<"line">[] = [];
const itemPanels: { chart: Chart<"line">; item: Metric }[] = [];
let activeItem: Metric | null = null;
let activeEvent: number | null = null;

const datasetsOf = (chart: Chart<"line">): PanelDataset[] =>
  chart.data.datasets as PanelDataset[];

/** One recolour path for both emphasis modes. Hollow points are decided from the
 *  point's own flag at draw time, so `__hollow` no longer has to be kept in sync. */
function restyle(d: PanelDataset, on: boolean, bold = false): void {
  const c = on ? d.__color : alpha(d.__color, DIM);
  d.borderColor = c;
  d.pointBorderColor = c;
  d.pointBackgroundColor = d.data.map((p) =>
    isDetached(p.flag) ? THEME.hollow : c,
  );
  d.borderWidth = bold && on ? 2.75 : 1.75;
}

function restylePanels(
  charts: readonly Chart<"line">[],
  keep: (d: PanelDataset) => boolean,
  bold = false,
): void {
  for (const chart of charts) {
    for (const d of datasetsOf(chart)) restyle(d, keep(d), bold);
    chart.update("none");
  }
}

function emphasiseItem(key: Metric | null): void {
  if (key === activeItem) return;
  activeItem = key;
  restylePanels(episodePanels, (d) => key === null || d.__item === key, true);
  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host)
      host.style.opacity = key === null || item === key ? "1" : String(DIM);
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;
  restylePanels(
    itemPanels.map((p) => p.chart),
    (d) => index === null || d.__ep === index,
  );
}

/* ---------------------------------------------------------------- legends */

interface LegendEntry {
  text: string;
  color: string;
  on: () => void;
  off: () => void;
}

/** Latched highlight: focus previews, click pins, aria-pressed reports it. */
function legend(host: HTMLElement, entries: readonly LegendEntry[]): void {
  let pinned: number | null = null;

  host.replaceChildren(
    ...entries.map(({ text, color, dash, on, off }, idx) => {
      const button = el("button");
      button.type = "button";
      button.setAttribute("aria-pressed", "false");

      const swatch = el("span", "swatch");
      swatch.style.background = dash?.length
        ? `repeating-linear-gradient(90deg, ${color} 0 3px, transparent 3px 6px)`
        : color;
      button.append(swatch, document.createTextNode(text));

      button.addEventListener("click", () => {
        pinned = pinned === idx ? null : idx;
        button.setAttribute("aria-pressed", String(pinned === idx));
        pinned === null ? off() : on();
      });
      for (const ev of ["mouseenter", "focus", "pointerdown"] as const)
        button.addEventListener(ev, on);
      for (const ev of ["mouseleave", "blur"] as const)
        button.addEventListener(ev, () => {
          if (pinned === idx) return; // a pinned highlight survives blur
          off();
          host.querySelectorAll("[aria-pressed]").forEach((b, j) => {
            if (j !== pinned) b.setAttribute("aria-pressed", "false");
          });
        });
      return button;
    }),
  );
}

/* ----------------------------------------------------------------- panels */

function observations(ep: Episode): string {
  const m = t();
  const counts = METRICS.map(
    (k) => ep.weeks.filter((r) => r[k] !== undefined).length,
  ).join("·");
  return fill(m.panels.obs, {
    counts,
    weeks: plural(m.units.weeks, ep.weeks.length),
  });
}

function panelFigure(strip: string, meta: string, note?: string) {
  const figure = el("figure", "trellis-panel");
  const caption = el("figcaption");
  const title = el("span", "strip", strip);
  title.id = `strip-${crypto.randomUUID().slice(0, 8)}`;
  caption.append(title, el("span", "strip-meta", meta));
  if (note) caption.append(el("p", "strip-note", note));

  const box = el("div", "panel-canvas");
  const canvas = el("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-labelledby", title.id); // panel name = series name
  box.append(canvas);
  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

/** One options factory for both trellises. */
const panelOptions = (
  x: object,
  y: object,
  onHover?: ChartOptions<"line">["onHover"],
): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: { mode: "nearest", axis: "x", intersect: false },
  layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
  scales: { x, y } as ChartOptions<"line">["scales"],
  plugins: {
    legend: { display: false },
    title: { display: false },
    subtitle: { display: false },
    tooltip: tooltipSpec(),
  },
  onHover,
});

export interface TrellisHosts {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}

export function mountCrossEpisode(opts: TrellisHosts): void {
  /* destroyAll() has already destroyed the previous instances (canvas.ts owns
     them); clear the handles so emphasis cannot touch a dead chart. */
  episodePanels.length = 0;
  itemPanels.length = 0;
  activeItem = null;
  activeEvent = null;
  seriesCache = new Map(); // titles and notes are locale-bound
  opts.episodeHost.replaceChildren();
  opts.itemHost.replaceChildren();

  const m = t();
  const unbounded = Number.POSITIVE_INFINITY;

  /* ---- primary trellis: one panel per episode, one y range for all ---- */
  const [yMin, yMax] = logBounds(...rawExtent(EPISODES, METRICS, unbounded));
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const text = m.episodes[ep.id];
    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const { figure, canvas } = panelFigure(
      text.strip,
      `${fmtSpan(ep.start, ep.end)} · ${observations(ep)}`,
      text.banner,
    );
    opts.episodeHost.append(figure);

    const datasets = SERIES.map((s) =>
      buildDataset(ep, idx, s.key, s.color, unbounded),
    ).filter((d): d is PanelDataset => d !== null);

    const chart = track(
      new Chart<"line">(canvas, {
        type: "line",
        data: { datasets } as unknown as ChartData<"line">,
        options: panelOptions(
          xScale(maxW),
          yScale(yMin, yMax, idx % cols === 0),
          (_e, elements) => {
            const d = elements[0]?.dataset as PanelDataset | undefined;
            emphasiseItem(d ? d.__item : null);
          },
        ),
        plugins: [], // no per-panel labels: the episode is the panel title
      }),
    );

    function decoratePanel(
      chart: Chart,
      figure: HTMLElement,
      title: string,
    ): void {
      figure.append(
        fromChart(chart, {
          caption: fill(a11y().tableCaption, { title }),
          indexHeader: a11y().weekHeader,
          indexOf: (ds, i) =>
            String((ds as { data: (Pt | null)[] }).data[i]?.t ?? "—"),
        }),
      );
      keyboardChart(chart, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole,
        readout: (i) =>
          ((chart.data.datasets[0]?.data as (Pt | null)[] | undefined)?.[i]
            ?.t ?? String(i + 1)) +
          ". " +
          chart.data.datasets
            .map((d) => {
              const p = (d.data as (Pt | null)[])[i];
              return p
                ? `${d.label}: ${p.low === p.high ? p.low : `${p.low}–${p.high}`}`
                : `${d.label}: —`;
            })
            .join(". "),
      });
    }

    canvas.addEventListener("mouseleave", () => emphasiseItem(null));
    episodePanels.push(chart);
  });

  /* ---- companion trellis: one panel per series, x capped at the last enforcement week ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  SERIES.forEach((series) => {
    const [rawLo, rawHi] = rawExtent(EPISODES, [series.key], ENFORCEMENT_LAST);
    const [lo, hi] = logBounds(rawLo, rawHi);
    const range = fill(m.panels.valueRange, {
      lo: compact().format(rawLo),
      hi: compact().format(rawHi),
    });

    const { figure, canvas } = panelFigure(
      m.items[series.key].short,
      fill(m.panels.itemMeta, { range, n: ENFORCEMENT_LAST }),
    );
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) =>
      buildDataset(ep, i, series.key, RAMP[i], ENFORCEMENT_LAST),
    ).filter((d): d is PanelDataset => d !== null);

    const chart = track(
      new Chart<"line">(canvas, {
        type: "line",
        data: { datasets } as unknown as ChartData<"line">,
        options: panelOptions(xScale(ENFORCEMENT_LAST), yScale(lo, hi, true)),
        plugins: [],
      }),
    );

    function decoratePanel(
      chart: Chart,
      figure: HTMLElement,
      title: string,
    ): void {
      figure.append(
        fromChart(chart, {
          caption: fill(a11y().tableCaption, { title }),
          indexHeader: a11y().weekHeader,
          indexOf: (ds, i) =>
            String((ds as { data: (Pt | null)[] }).data[i]?.t ?? "—"),
        }),
      );
      keyboardChart(chart, {
        hint: a11y().chartHint,
        roledescription: a11y().chartRole,
        readout: (i) =>
          ((chart.data.datasets[0]?.data as (Pt | null)[] | undefined)?.[i]
            ?.t ?? String(i + 1)) +
          ". " +
          chart.data.datasets
            .map((d) => {
              const p = (d.data as (Pt | null)[])[i];
              return p
                ? `${d.label}: ${p.low === p.high ? p.low : `${p.low}–${p.high}`}`
                : `${d.label}: —`;
            })
            .join(". "),
      });
    }

    canvas.addEventListener("mouseleave", () => emphasiseEvent(null));
    canvas.addEventListener("mousemove", (ev) => {
      const pts = chart.getElementsAtEventForMode(
        ev,
        "nearest",
        { intersect: false },
        true,
      );
      if (!pts.length) {
        emphasiseEvent(null);
        return;
      }
      emphasiseEvent(datasetsOf(chart)[pts[0].datasetIndex].__ep);
    });

    itemPanels.push({ chart, item: series.key });
  });

  /* ---- legends ---- */
  legend(
    opts.itemLegend,
    SERIES.map((s) => ({
      text: m.items[s.key].label,
      color: s.color,
      on: () => emphasiseItem(s.key),
      off: () => emphasiseItem(null),
    })),
  );

  legend(
    opts.eventLegend,
    EPISODES.map((ep, i) => ({
      text: m.episodes[ep.id].short,
      color: RAMP[i],
      on: () => emphasiseEvent(i),
      off: () => emphasiseEvent(null),
    })),
  );
}
