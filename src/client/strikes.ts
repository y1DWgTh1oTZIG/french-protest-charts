/* ================================================================= strikes
 *
 * the labour dimension, as a share of employees.
 *
 * ── Three parts, always ───────────────────────────────────────────────────
 * A strike rate is `strikers / employees of that scope`. It is not a share of
 * the population (stage 1) and not a crowd (stage 0). Drop the denominator and
 * "11.47 %" reads as a share of France: it is 11.47 % of education staff.
 *
 * ── Nesting, which is why nothing here is summed ──────────────────────────
 * The four published rates for 29 September 2026 are not four parts of a
 * whole. 11.47 % is the ministry's WEIGHTED total, so it is the share of all
 * education staff on strike; 12.74 % (second degree), 13.71 % (teachers) and
 * 27.39 % (vie scolaire) are rates over overlapping sub-populations. Their
 * mean is 17.9 % and their sum 53.8 %; neither number means anything, and the
 * chart is built so neither can be produced by eye.
 *
 * ── No denominator, no count ──────────────────────────────────────────────
 * The ministry publishes rates and does not publish the staff totals behind
 * its weights in what this project carries. So the module prints the rate, and
 * refuses to print a head count: rate × an unpublished total is our arithmetic
 * wearing the ministry's authority. `employees: null` is that refusal, and the
 * table's "Staff covered" column disappears entirely rather than printing four
 * em dashes.
 *
 * ── What the record does not contain ──────────────────────────────────────
 * 5 November was a national strike day (193 actions, 575,000 ministry /
 * 1.6M CGT) with no strike rate published, and Mayotte has been on strike
 * since 31 August with a duration and no rate. Both are listed as gaps, not
 * plotted as zero: a missing rate is not a rate of zero.
 */

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
  type ChartDataset,
  type ChartOptions,
  type Plugin,
  type TooltipItem,
} from "chart.js";
import { dataTable, keyboardChart } from "./a11y.ts";
import { THEME, track } from "./canvas.ts";
import { byId, el } from "./dom.ts";
import { a11y, fill, getLocale, nf } from "./i18n.ts";
import type { Flag } from "./model.ts";
import { wrapTooltipLines } from "./tooltip.ts";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

/* ----- copy */

interface Bi {
  readonly en: string;
  readonly fr: string;
}
const L = (o: Bi): string =>
  String(getLocale()).slice(0, 2) === "fr" ? o.fr : o.en;
const fillL = (o: Bi, vars?: Record<string, string | number>): string =>
  fill(L(o), vars);

/* ----- scopes */

export type ScopeId =
  | "education"
  | "secondDegre"
  | "teachers"
  | "vieScolaire"
  | "firstDegre"
  | "otherStaff";

/** How a scope sits relative to the others. Decides the bar's treatment, and
 *  is the only thing that licenses a comparison between two rows. */
export type Relation = "aggregate" | "subset" | "overlapping";

interface Scope {
  readonly id: ScopeId;
  readonly label: Bi;
  readonly short: Bi;
  readonly relation: Relation;
  /** Staff in the scope, as published. null = not published in this dataset. */
  readonly employees: number | null;
  readonly employeesAsOf: string;
  readonly employeesSource: string;
}

const RELATION_LABEL: Readonly<Record<Relation, Bi>> = {
  aggregate: { en: "Weighted total", fr: "Total pondéré" },
  subset: { en: "Part of the total", fr: "Partie du total" },
  overlapping: {
    en: "Overlaps the other rows",
    fr: "Recoupe les autres lignes",
  },
};

export const SCOPES: Readonly<Record<ScopeId, Scope>> = {
  education: {
    id: "education",
    label: {
      en: "All education staff",
      fr: "Ensemble du personnel de l’éducation",
    },
    short: { en: "All education staff", fr: "Tout le personnel" },
    relation: "aggregate",
    /* The ministry's "11,47 % pondéré" is weighted over its own staff counts.
       Those counts are not in what this project carries, so the total is not
       printed here and no head count is derived from it. */
    employees: null,
    employeesAsOf: "2026-09-29",
    employeesSource: "not published in this dataset",
  },
  secondDegre: {
    id: "secondDegre",
    label: { en: "Second degree", fr: "Second degré" },
    short: { en: "Second degree", fr: "Second degré" },
    relation: "subset",
    employees: null,
    employeesAsOf: "2026-09-29",
    employeesSource: "not published in this dataset",
  },
  teachers: {
    id: "teachers",
    label: {
      en: "Teachers (both degrees)",
      fr: "Enseignants (les deux degrés)",
    },
    short: { en: "Teachers", fr: "Enseignants" },
    /* Deliberately "overlapping", not "subset": the scope spans first and
       second degree, so it intersects the second-degree row without being
       inside it. Two rows that overlap cannot be added. */
    relation: "overlapping",
    employees: null,
    employeesAsOf: "2026-09-29",
    employeesSource: "not published in this dataset",
  },
  vieScolaire: {
    id: "vieScolaire",
    label: { en: "Life-schools staff", fr: "Personnel de vie scolaire" },
    short: { en: "Life-schools staff", fr: "Vie scolaire" },
    relation: "subset",
    employees: null,
    employeesAsOf: "2026-09-29",
    employeesSource: "not published in this dataset",
  },
};

/* ----- observations */

interface StrikeObs {
  readonly date: string;
  readonly scope: ScopeId;
  /** Percent of the scope's staff, as published: 11.47 means 11.47 %. */
  readonly rate: number;
  readonly flag: Flag;
  readonly source: string;
  readonly note?: Bi;
}

/* Each day gets its own constant because the COVERAGE differs. The ministry
   publishes a rate for "most académies" and names the ones it leaves out,
   and those exclusions move from day to day. "à ce stade" is the ministry's
   own qualifier: a provisional snapshot, not a final tally. */

const SRC_0929 =
  "data.ts · FACTS 2026-09-29 (ministry, end of day) — strike rate";

const SRC_1008 =
  "Ministère de l’Éducation nationale · Mouvement social du jeudi 8 octobre 2026 (https://www.education.gouv.fr/mouvement-social-du-jeudi-8-octobre-2026-506191) — participation rates, provisional (“à ce stade”), excluding the Toulouse, Nantes and Corse académies";

const SRC_1013 =
  "Ministère de l’Éducation nationale · Mouvement social du mardi 13 octobre 2026 (https://www.education.gouv.fr/mouvement-social-du-mardi-13-octobre-2026-506220) — participation rates, provisional (“à ce stade”), excluding Toulouse, La Réunion (holiday since 10 October), Guadeloupe, Martinique and Guyane (time difference)";

const SRC_1105 =
  "Ministère de l’Éducation nationale · Mouvement social du jeudi 5 novembre 2026 (https://www.education.gouv.fr/mouvement-social-du-jeudi-5-novembre-2026-506652) — participation rates, provisional (“à ce stade”), hexagonal académies except Toulouse, plus La Réunion";

const SRC_1110 =
  "Ministère de l’Éducation nationale · Mouvement social du mardi 10 novembre 2026 (https://www.education.gouv.fr/mouvement-social-du-mardi-10-novembre-2026-506685) — participation rates, provisional (“à ce stage”), hexagonal académies only";

export const RATES: readonly StrikeObs[] = [
  {
    date: "2026-09-29",
    scope: "vieScolaire",
    rate: 27.39,
    flag: "n",
    source: SRC_0929,
    note: {
      en: "The smallest of the four workforces and the highest rate: it is what pulls the weighted total up, and it is not a rate for teachers.",
      fr: "La plus petite des quatre populations et le taux le plus élevé : c’est elle qui tire le total pondéré vers le haut, et ce n’est pas un taux d’enseignants.",
    },
  },
  {
    date: "2026-09-29",
    scope: "teachers",
    rate: 13.71,
    flag: "n",
    source: SRC_0929,
    note: {
      en: "Spans both degrees, so it overlaps the second-degree row — a reader who adds the two counts the same teacher twice.",
      fr: "Couvre les deux degrés, donc recoupe la ligne du second degré — qui additionne les deux compte deux fois le même enseignant.",
    },
  },
  {
    date: "2026-09-29",
    scope: "secondDegre",
    rate: 12.74,
    flag: "n",
    source: SRC_0929,
  },
  {
    date: "2026-09-29",
    scope: "education",
    rate: 11.47,
    flag: "n",
    source: SRC_0929,
    note: {
      en: "Weighted over all education staff, not the mean of the three rows below it — the mean would be 17.92 %, which no ministry published.",
      fr: "Pondéré sur l’ensemble du personnel, et non la moyenne des trois lignes ci-dessous — cette moyenne serait de 17,92 %, que nul ministère n’a publiée.",
    },
  },
  {
    date: "2026-09-29",
    scope: "firstDegre",
    rate: 15.28,
    flag: "n",
    source: SRC_0929,
  },
  {
    date: "2026-09-29",
    scope: "otherStaff",
    rate: 6.68,
    flag: "n",
    source: SRC_0929,
  },
  // 8 Oct
  {
    date: "2026-10-08",
    scope: "education",
    rate: 0.82,
    flag: "n",
    source: SRC_1008,
  },
  {
    date: "2026-10-08",
    scope: "teachers",
    rate: 0.99,
    flag: "n",
    source: SRC_1008,
  },
  {
    date: "2026-10-08",
    scope: "firstDegre",
    rate: 0.1,
    flag: "n",
    source: SRC_1008,
  },
  {
    date: "2026-10-08",
    scope: "secondDegre",
    rate: 1.67,
    flag: "n",
    source: SRC_1008,
  },
  {
    date: "2026-10-08",
    scope: "vieScolaire",
    rate: 2.33,
    flag: "n",
    source: SRC_1008,
  },
  {
    date: "2026-10-08",
    scope: "otherStaff",
    rate: 0.45,
    flag: "n",
    source: SRC_1008,
  },

  // 13 Oct
  {
    date: "2026-10-13",
    scope: "education",
    rate: 3.71,
    flag: "n",
    source: SRC_1013,
  },
  {
    date: "2026-10-13",
    scope: "teachers",
    rate: 4.52,
    flag: "n",
    source: SRC_1013,
  },
  {
    date: "2026-10-13",
    scope: "firstDegre",
    rate: 3.92,
    flag: "n",
    source: SRC_1013,
  },
  {
    date: "2026-10-13",
    scope: "secondDegre",
    rate: 4.98,
    flag: "n",
    source: SRC_1013,
  },
  {
    date: "2026-10-13",
    scope: "vieScolaire",
    rate: 10.31,
    flag: "n",
    source: SRC_1013,
  },
  {
    date: "2026-10-13",
    scope: "otherStaff",
    rate: 1.96,
    flag: "n",
    source: SRC_1013,
  },

  // 5 Nov
  {
    date: "2026-11-05",
    scope: "education",
    rate: 12.77,
    flag: "n",
    source: SRC_1105,
  },
  {
    date: "2026-11-05",
    scope: "teachers",
    rate: 15.81,
    flag: "n",
    source: SRC_1105,
  },
  {
    date: "2026-11-05",
    scope: "firstDegre",
    rate: 19.14,
    flag: "n",
    source: SRC_1105,
  },
  {
    date: "2026-11-05",
    scope: "secondDegre",
    rate: 13.53,
    flag: "n",
    source: SRC_1105,
  },
  {
    date: "2026-11-05",
    scope: "vieScolaire",
    rate: 25.65,
    flag: "n",
    source: SRC_1105,
  },
  {
    date: "2026-11-05",
    scope: "otherStaff",
    rate: 6.09,
    flag: "n",
    source: SRC_1105,
  },

  // 10 Nov
  {
    date: "2026-11-10",
    scope: "education",
    rate: 1.55,
    flag: "n",
    source: SRC_1110,
  },
  {
    date: "2026-11-10",
    scope: "teachers",
    rate: 1.6,
    flag: "n",
    source: SRC_1110,
  },
  {
    date: "2026-11-10",
    scope: "firstDegre",
    rate: 0.45,
    flag: "n",
    source: SRC_1110,
  },
  {
    date: "2026-11-10",
    scope: "secondDegre",
    rate: 2.47,
    flag: "n",
    source: SRC_1110,
  },
  {
    date: "2026-11-10",
    scope: "vieScolaire",
    rate: 7.01,
    flag: "n",
    source: SRC_1110,
  },
  {
    date: "2026-11-10",
    scope: "otherStaff",
    rate: 1.45,
    flag: "n",
    source: SRC_1110,
  },
];

/** Days the record mentions but cannot rate. Rendered as text, never as zero. */
interface Gap {
  readonly date: string;
  readonly label: Bi;
  readonly reason: Bi;
  readonly source: string;
}

export const GAPS: readonly Gap[] = [
  {
    date: "2026-08-31",
    label: {
      en: "Mayotte teachers and parents, on strike since 31 August",
      fr: "Enseignants et parents de Mayotte, en grève depuis le 31 août",
    },
    reason: {
      en: "A duration, not a rate: the strike is continuous, so a single day’s share would misrepresent it. No staff total was published either.",
      fr: "Une durée, non un taux : la grève est continue, la part d’un seul jour la trahirait. Aucun effectif n’a été publié non plus.",
    },
    source: "data.ts · FACTS 2026-09-15 (background note)",
  },

  {
    date: "2026-10-31",
    label: { en: "Saturday mobilisation", fr: "Mobilisation du samedi" },
    reason: {
      en: "320,000 (ministry) / ~500,000 (youth organisations), 291 actions — a turnout, with no strike rate published for any function.",
      fr: "320 000 (ministère) / ~500 000 (organisations de jeunesse), 291 actions — une participation, sans taux de grève publié pour aucune fonction.",
    },
    source: "data.ts · FACTS 2026-10-31",
  },
  {
    date: "2026-11-05",
    label: { en: "National strike day", fr: "Journée de grève nationale" },
    reason: {
      en: "193 actions and a crowd of 575,000 (ministry) to 1.6 M (CGT) — a turnout, not a strike rate.",
      fr: "193 actions et une foule de 575 000 (ministère) à 1,6 M (CGT) — une participation, non un taux de grévistes. Aucun effectif ni taux publiés : aucune part n’existe.",
    },
    source: "data.ts · FACTS 2026-11-05",
  },
  {
    date: "2026-11-05",
    label: {
      en: "Local-authority and hospital staff",
      fr: "Agents territoriaux et hospitaliers",
    },
    reason: {
      en: "The government published 4.60% (midday) and 6.10% (close) of local-authority staff, and 3.93% / 4.97% of hospital staff, on 5 November. No workforce total was published for either function, so no head count exists — only a rate.",
      fr: "Le gouvernement a publié 4,60 % (mi-journée) puis 6,10 % (fin de journée) des agents territoriaux, et 3,93 % / 4,97 % des hospitaliers, le 5 novembre. Aucun effectif n’a été publié pour ces deux fonctions : aucun décompte n’existe, seulement un taux.",
    },
    source: "Gazette des communes · 5–6 Nov 2026",
  },
  {
    date: "2026-11-14",
    label: {
      en: "Demonstration day, no strike call",
      fr: "Journée de manifestation, pas d’appel à la grève",
    },
    reason: {
      en: "Act V was a demonstration only: the CGT and FO's Île-de-France regional unions backed the Paris march but neither issued a national strike call. At 14:00 the ministry counted 8,900 people at 55 actions nationwide, excluding the Paris march. The national strike call is for Tuesday 17 November.",
      fr: "L’acte V était une manifestation sans appel à la grève : les unions régionales CGT et FO de l’Île-de-France ont soutenu la marche parisienne, mais aucun appel national à la grève n’a été lancé. À 14 h, le ministère comptait 8 900 personnes sur 55 actions sur le territoire national, cortège parisien exclu. L’appel national à la grève porte sur le mardi 17 novembre.",
    },
    source: "Le Monde · 14 Nov 2026",
  },
];
