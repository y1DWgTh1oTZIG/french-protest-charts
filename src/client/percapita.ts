/* ================================================================ per capita
 *
 * Sections A and B plot counts; section C plots counts for seven movements.
 * None of them answers the question a count cannot: what share of the country
 * was in the street, and how does that share compare across 58 years?
 *
 * Three rules, and they are the whole design:
 *
 *   1. Every row keeps the ministry and organiser counts visible NEXT TO the
 *      rate. A percentage of a union claim is not a measurement.
 *   2. Sums of turnout are person-days, not people. The total row says so and
 *      does not claim a share of the population that participated.
 *   3. A missing denominator prints an em dash and says why. 1968 is
 *      metropolitan France because no France-entière row exists for it.
 *
 * Reads DAILY/WEEKLY.turnout and EPISODES directly, so a figure added to
 * data.ts or episodes.ts appears here without a second edit.
 */

import { DAILY, DATES, WEEKLY, WEEKS } from "./data.ts";
import { EPISODES, seriesData } from "./episodes.ts";
import { byId, el } from "./dom.ts";
import { bi, fill, fmtDate, fmtWeek, nf, t, type Bi } from "./i18n.ts";
import {
  EPISODE_POP,
  KEY_2026,
  denominator,
  fmtPctBand,
  fmtRateBand,
  per100k,
  population,
  share,
} from "./population.ts";

/* ----- copy. Kept here in both languages rather than in the catalogue: this
   block is self-contained, and a missing catalogue branch renders '' silently. */

const COPY = {
  titleDaily: {
    en: "Turnout as a share of the population",
    fr: "La foule rapportée à la population",
  },
  titleWeekly: {
    en: "Weekly peak as a share of the population",
    fr: "Pointe hebdomadaire rapportée à la population",
  },
  titleEpisodes: {
    en: "Peak turnout of each movement, as a share of its population",
    fr: "Pointe de chaque mouvement rapportée à sa population",
  },
  capDaily: {
    en: "Turnout by day against France entière, {pop} residents at 1 January 2026. The band runs from the ministry count to the organiser count.",
    fr: "Foule par jour rapportée à la France entière, {pop} habitants au 1er janvier 2026. La fourchette va du décompte ministériel au décompte syndical.",
  },
  capWeekly: {
    en: "The peak day of each week against France entière, {pop} residents at 1 January 2026. A peak, not a sum: the same person is counted once per day.",
    fr: "Le jour de pointe de chaque semaine rapporté à la France entière, {pop} habitants au 1er janvier 2026. Une pointe, pas une somme : une même personne est comptée une fois par jour.",
  },
  capEpisodes: {
    en: "The highest weekly turnout in each movement, against the population of that year. The figure plotted is the midpoint of the published band; the band is given in the last column.",
    fr: "La foule hebdomadaire la plus élevée de chaque mouvement, rapportée à la population de l’année. Le chiffre retenu est le milieu de la fourchette publiée ; la fourchette figure en dernière colonne.",
  },
  colDate: { en: "Date", fr: "Date" },
  colWeek: { en: "Week", fr: "Semaine" },
  colMinistry: { en: "Ministry", fr: "Ministère" },
  colOrganisers: { en: "Organisers", fr: "Organisateurs" },
  colShare: { en: "Share of population", fr: "Part de la population" },
  colRate: { en: "Per 100 000", fr: "Pour 100 000" },
  colMovement: { en: "Movement", fr: "Mouvement" },
  colBase: { en: "Population", fr: "Population" },
  colPeak: { en: "Peak", fr: "Pointe" },
  colBand: { en: "Published band", fr: "Fourchette publiée" },
  peakLabel: {
    en: "Peak day · {date} · {pct}",
    fr: "Jour de pointe · {date} · {pct}",
  },
  peakSub: {
    en: "{n} residents in 100 000 were in the street — the upper bound of the day.",
    fr: "{n} habitants sur 100 000 étaient dans la rue — la borne haute du jour.",
  },
  totalLabel: {
    en: "Person-days · {n} counted days",
    fr: "Jours-manifestation · {n} jours comptés",
  },
  totalSub: {
    en: "These are attendances, not people: the same person marched more than once, so this is not the share of the population that protested.",
    fr: "Ce sont des présences, pas des personnes : une même personne a défilé plusieurs fois, ce n’est donc pas la part de la population qui a manifesté.",
  },
  noteDaily: {
    en: "France entière, {pop} residents at 1 January 2026 (INSEE, provisional). Metropolitan France would give {metro}. The 29 September band is a floor: it counts the public-service cortège, with no student crowd counted separately. The 5 November and 17 October upper bounds are organiser claims, not counts.",
    fr: "France entière, {pop} habitants au 1er janvier 2026 (INSEE, chiffre provisoire). La France métropolitaine donnerait {metro}. La fourchette du 29 septembre est un plancher : elle compte le cortège de la fonction publique, sans foule étudiante distincte. Les bornes hautes des 17 octobre et 5 novembre sont des chiffres syndicaux, pas des décomptes.",
  },
  noteEpisodes: {
    en: "May 68 is read against metropolitan France only: no France-entière figure exists for 1968 in this vintage, and its 49 723 072 is a resident estimate, not a census count. Its turnout band is a scholarly reconstruction, so the rate is approximate. A rate adds arithmetic precision to a numerator that may not have it — read it as a magnitude.",
    fr: "Mai 68 est rapporté à la France métropolitaine seulement : aucun chiffre pour la France entière n’existe pour 1968 dans cette version, et ses 49 723 072 sont une estimation de population, non un décompte censitaire. Sa fourchette de foule est une reconstruction savante : le taux est donc approximatif. Un taux ajoute une précision arithmétique à un numérateur qui n’en a peut-être pas — à lire comme un ordre de grandeur.",
  },
  absent: { en: "no denominator", fr: "pas de dénominateur" },
} satisfies Record<string, Bi>;

const txt = (k: keyof typeof COPY): string => bi(COPY[k]);

/* ----- rows ----- */

interface Row {
  readonly where: string;
  readonly lo: number;
  readonly hi: number;
  readonly pctLo: number | null;
  readonly pctHi: number | null;
  readonly rateLo: number | null;
  readonly rateHi: number | null;
}

/** Daily or weekly turnout, straight from the projected series. Detached
 *  points are INCLUDED: a partial or regional day is still a published
 *  crowd, and dropping it would hide the floor. */
function rowsFor(weekly: boolean): Row[] {
  const pop = population(KEY_2026);
  const series = weekly ? WEEKLY.turnout : DAILY.turnout;
  const out: Row[] = [];

  series.forEach((p, i) => {
    if (!p || p.v === null) return;
    const lo = p.band?.[0] ?? p.v;
    const hi = p.band?.[1] ?? p.v;

    let where: string;
    if (weekly) {
      const w = WEEKS[i];
      if (!w) return;
      where = fmtWeek(w.key, w.end);
    } else {
      if (!DATES[i]) return;
      where = fmtDate(DATES[i]);
    }

    out.push({
      where,
      lo,
      hi,
      pctLo: share(lo, pop),
      pctHi: share(hi, pop),
      rateLo: per100k(lo, pop),
      rateHi: per100k(hi, pop),
    });
  });

  return out;
}

/* ----- one table, two sections ----- */

function cell(text: string, cls = "pc-num"): HTMLElement {
  return el("td", cls, text);
}

function head(labels: readonly string[]): HTMLTableSectionElement {
  const thead = el("thead");
  const tr = el("tr");
  labels.forEach((label, i) => {
    const th = el("th", i === 0 ? "pc-scope-head" : "pc-num-head", label);
    (th as HTMLTableCellElement).scope = "col";
    tr.append(th);
  });
  thead.append(tr);
  return thead as HTMLTableSectionElement;
}

function block(
  rows: readonly Row[],
  title: string,
  caption: string,
  firstCol: string,
  note: string,
  peakTemplate: string,
  peakSubTemplate: string,
): HTMLElement[] {
  const out: HTMLElement[] = [el("h4", "pc-title", title)];

  const table = el("table", "pc-table");
  table.append(el("caption", "pc-caption", caption));
  table.append(
    head([
      firstCol,
      txt("colMinistry"),
      txt("colOrganisers"),
      txt("colShare"),
      txt("colRate"),
    ]),
  );

  const tbody = el("tbody");
  let peak: Row | null = null;
  let sumLo = 0;
  let sumHi = 0;

  for (const r of rows) {
    sumLo += r.lo;
    sumHi += r.hi;
    if (!peak || r.hi > peak.hi) peak = r;

    const tr = el("tr");
    const th = el("th", "pc-scope", r.where);
    (th as HTMLTableCellElement).scope = "row";
    tr.append(
      th,
      cell(nf().format(r.lo)),
      cell(nf().format(r.hi)),
      cell(fmtPctBand(r.pctLo, r.pctHi)),
      cell(fmtRateBand(r.rateLo, r.rateHi)),
    );
    tbody.append(tr);
  }
  table.append(tbody);

  /* Totals: person-days. Labelled as such, never as "share of the population
     that protested". */
  if (rows.length > 1) {
    const pop = population(KEY_2026);
    const tfoot = el("tfoot");
    const tr = el("tr");
    const th = el(
      "th",
      "pc-scope",
      fill(txt("totalLabel"), { n: rows.length }),
    );
    (th as HTMLTableCellElement).scope = "row";
    (th as HTMLTableCellElement).colSpan = 2;
    tr.append(
      th,
      cell(`${nf().format(sumLo)} – ${nf().format(sumHi)}`),
      cell(fmtPctBand(share(sumLo, pop), share(sumHi, pop))),
      cell(fmtRateBand(per100k(sumLo, pop), per100k(sumHi, pop))),
    );
    tfoot.append(tr);
    table.append(tfoot);
  }

  /* Headline: the peak. */
  if (peak) {
    const box = el("div", "pc-headline");
    const stat = el("div", "pc-stat");
    stat.append(
      el(
        "span",
        "pc-num-big",
        fill(peakTemplate, {
          date: peak.where,
          pct: fmtPctBand(peak.pctLo, peak.pctHi),
        }),
      ),
      el(
        "span",
        "pc-stat-label",
        fill(peakSubTemplate, { n: fmtRateBand(peak.rateLo, peak.rateHi) }),
      ),
    );
    box.append(stat);
    out.push(box);
  }

  out.push(table, el("p", "pc-note", note));
  return out;
}

function daily(): HTMLElement[] {
  const pop = population(KEY_2026);
  const cap = fill(txt("capDaily"), {
    pop: nf().format(denominator(pop) ?? 0),
  });
  const note = fill(txt("noteDaily"), {
    pop: nf().format(denominator(pop) ?? 0),
    metro: nf().format(pop?.metro ?? 0),
  });
  return block(
    rowsFor(false),
    txt("titleDaily"),
    cap,
    txt("colDate"),
    note,
    txt("peakLabel"),
    txt("peakSub"),
  );
}

function weekly(): HTMLElement[] {
  const pop = population(KEY_2026);
  const cap = fill(txt("capWeekly"), {
    pop: nf().format(denominator(pop) ?? 0),
  });
  return block(
    rowsFor(true),
    txt("titleWeekly"),
    cap,
    txt("colWeek"),
    fill(txt("noteDaily"), {
      pop: nf().format(denominator(pop) ?? 0),
      metro: nf().format(pop?.metro ?? 0),
    }),
    txt("peakLabel"),
    txt("peakSub"),
  );
}

/* ----- section C: one row per movement ----- */

function episodes(): HTMLElement[] {
  const table = el("table", "pc-table");
  table.append(el("caption", "pc-caption", txt("capEpisodes")));
  table.append(
    head([
      txt("colMovement"),
      txt("colBase"),
      txt("colPeak"),
      txt("colShare"),
      txt("colRate"),
    ]),
  );

  const tbody = el("tbody");
  for (const ep of EPISODES) {
    const pop = population(EPISODE_POP[ep.id] ?? "");
    const pts = seriesData(ep, "p") ?? [];

    let peak: number | null = null;
    for (const p of pts) if (peak === null || p.y > peak) peak = p.y;

    const tr = el("tr");
    const th = el("th", "pc-scope", t().episodes[ep.id].short);
    (th as HTMLTableCellElement).scope = "row";

    const base = denominator(pop);
    /* No France-entière row for 1968: say "métropole", do not quietly
       substitute it for the national total. */
    const baseText =
      base === null
        ? txt("absent")
        : `${nf().format(base)}${pop?.france === null ? " · métropole" : ""}`;

    tr.append(
      th,
      cell(baseText, "pc-num pc-base"),
      cell(peak === null ? "—" : nf().format(Math.round(peak))),
      cell(fmtPctBand(share(peak ?? 0, pop), share(peak ?? 0, pop))),
      cell(fmtRateBand(per100k(peak ?? 0, pop), per100k(peak ?? 0, pop))),
    );
    tbody.append(tr);
  }
  table.append(tbody);

  return [
    el("h4", "pc-title", txt("titleEpisodes")),
    table,
    el("p", "pc-note", txt("noteEpisodes")),
  ];
}

/* ----- mount ----- */

export function mountPerCapita(): void {
  const a = byId("pc-a");
  if (a) a.replaceChildren(...daily());

  const b = byId("pc-b");
  if (b) b.replaceChildren(...weekly());

  const c = byId("pc-c");
  if (c) c.replaceChildren(...episodes());
}
