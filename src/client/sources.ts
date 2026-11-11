/* src/client/sources.ts — provenance box.
 *
 * Contains every citation from the pre-i18n index.html, in that file's order and with its
 * exact URLs, dates and descriptions. Only the chrome is translated; article titles and
 * publisher names stay verbatim, because translating a headline breaks the citation.
 *
 * Contract: renderSources(host?) is idempotent — it replaceChildren()s its own host, so
 * main.ts may call it on every render and every language change. The page-level <h2>
 * lives OUTSIDE #sources in index.html, so it survives the replacement.
 */

import { bi, fmtDate, fmtDayMonth, type Bi } from "./i18n.ts";

export type GroupId = "g2026" | "hist";

export interface Source {
  readonly id: string;
  readonly group: GroupId;
  /** Publication and headline, verbatim. Never translated. */
  readonly label: string;
  readonly url: string;
  /** ISO start date. Absent for continuously published sources (ministry briefings). */
  readonly date?: string;
  /** End of a publication span; rendered as "10 Sep–11 Sep 2025". */
  readonly dateEnd?: string;
  /** What this page takes from the source. */
  readonly what: Bi;
}

export interface SourceGroup {
  readonly id: GroupId;
  readonly title: Bi;
  readonly blurb: Bi;
}

/* ------------------------------------------------------------------- copy */

const BOX_TITLE: Bi = { en: "Sources and method", fr: "Sources et méthode" };

const INTRO: Bi = {
  en: "Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.",
  fr: "Compilé par une IA à partir des sources ci-dessous ; aucun chiffre ici n’est une mesure primaire réalisée pour cette page. Lorsqu’un mouvement dispose d’un décompte officiel, le ministère de l’Intérieur est la source des interpellations et des blessés parmi les forces, les syndicats publiant la foule concurrente. Les décomptes qui n’ont existé que sous forme de brèves quotidiennes dispersées ont été additionnés à la main : c’est là que se concentre l’essentiel de l’erreur.",
};

const FOOT: Bi = {
  en: "Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a shared log axis, and C′ is capped at week 7. Nothing here has been through external review.",
  fr: "Ce n’est pas une source, mais cela porte la lecture : dans les brouillons antérieurs, l’indice de la section C divisait chaque série par son premier chiffre, et l’axe des x de C′ était fixé par l’épisode le plus long. Les deux ont été remplacés — C trace des effectifs bruts sur un axe log partagé, et C′ est plafonné à la semaine 7. Rien ici n’a fait l’objet d’une relecture externe.",
};

export const GROUPS: readonly SourceGroup[] = [
  {
    id: "g2026",
    title: {
      en: "The 2026 movement — 1 Oct to 11 Nov",
      fr: "Le mouvement de 2026 — du 1er oct. au 11 nov.",
    },
    blurb: {
      en: "Eight reports. Ministry figures originate in press briefings, so every daily value was read out of the reporting below rather than from a dataset.",
      fr: "Huit sources. Les chiffres ministériels proviennent de points presse : chaque valeur quotidienne a été relevée dans les articles ci-dessous, et non dans un jeu de données.",
    },
  },
  {
    id: "hist",
    title: { en: "Historical episodes", fr: "Épisodes historiques" },
    blurb: {
      en: "Encyclopaedia summaries of the published counts, plus three live-blog reports on the September 2025 movement. No primary archives were consulted.",
      fr: "Synthèses encyclopédiques des décomptes publiés, plus trois directs de presse sur le mouvement de septembre 2025. Aucune archive primaire n’a été consultée.",
    },
  },
];

/* ------------------------------------------------------------------- data */

export const SOURCES: readonly Source[] = [
  /* ------------------------------------------------ 2026 — damage and cost */
  {
    id: "ifrap-2026",
    group: "g2026",
    label:
      "Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »",
    url: "https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros",
    date: "2026-10-21",
    what: {
      en: "the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.",
      fr: "la fourchette de 247 à 872 M€ de dommages pour les 17–18 oct. : ~910 M€ de dommages matériels et ~190 M€ de chiffre d’affaires perdu dans l’hypothèse haute, dont 666 M€ pour le commerce de détail.",
    },
  },
  {
    id: "monde-cci-2026",
    group: "g2026",
    label:
      "Le Monde — « Plus de 2 500 commerces dégradés », d’après CCI France",
    url: "https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html",
    date: "2026-10-27",
    what: {
      en: "CCI France’s shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.",
      fr: "les décomptes de commerces de CCI France : 2 488 touchés le 17 oct., dont 1 161 pillés, saccagés ou incendiés.",
    },
  },
  {
    id: "franceinfo-cci-2026",
    group: "g2026",
    label: "franceinfo — « Plus de 2 500 magasins touchés »",
    url: "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html",
    date: "2026-10-27",
    what: {
      en: "the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.",
      fr: "l’incrément du 24 oct. (50 commerces, 2 538 au total) et la chute de 80 % du chiffre d’affaires en centre-ville.",
    },
  },
  {
    id: "bfmtv-cci-2026",
    group: "g2026",
    label: "BFMTV — CCI France, 20 shops vandalised on 31 Oct",
    url: "https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html",
    date: "2026-11-01",
    what: {
      en: "why week 6 carries no damage figure: the count collapses after 24 Oct.",
      fr: "pourquoi la semaine 6 ne porte aucun chiffre de dommages : le décompte s’effondre après le 24 oct.",
    },
  },
  {
    id: "capital-policing-2026",
    group: "g2026",
    label: "Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »",
    url: "https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269",
    date: "2026-10-28",
    what: {
      en: "the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.",
      fr: "les références de 15 000–30 000 € par compagnie de CRS et par jour, et de 3,4 M€ pour 3 000 gendarmes, derrière la fourchette de coût du maintien de l’ordre ; aussi les 1 435 interpellations et 53 policiers blessés du 24 oct.",
    },
  },
  {
    id: "figaro-cost-2026",
    group: "g2026",
    label: "Le Figaro — « Le coût exorbitant d’un week-end d’émeutes »",
    url: "https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020",
    date: "2026-10-20",
    what: {
      en: "cross-check on the damage order of magnitude.",
      fr: "contre-vérification de l’ordre de grandeur des dommages.",
    },
  },
  {
    id: "canard-eyes-2026",
    group: "g2026",
    label: "Le Canard enchaîné — « Les manifestants ont le mauvais œil »",
    url: "https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil",
    date: "2026-11-10",
    what: {
      en: "Prof. Laurent Thines’ (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.",
      fr: "le registre presse et blog du Pr Laurent Thines (CHU de Besançon) : 79 blessés graves en trois semaines — 10 éborgnés, 9 traumatismes crânio-faciaux, 7 amputations, 1 mort. Source du plancher de blessés parmi les manifestants, et raison pour laquelle aucune série hebdomadaire de blessés manifestants n’existe.",
    },
  },
  {
    id: "interieur",
    group: "g2026",
    label: "Ministère de l’Intérieur",
    url: "https://www.interieur.gouv.fr/",
    what: {
      en: "origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting above rather than from a dataset.",
      fr: "origine de chaque décompte d’interpellations, de gardes à vue et de blessés parmi les forces, ainsi que du chiffre ministériel de foule. Publiés en points presse et points de situation du soir, non en séries téléchargeables : les valeurs quotidiennes ont donc été relevées dans la presse ci-dessus, et non dans un jeu de données.",
    },
  },

  /* ------------------------------------------------------ historical episodes */
  {
    id: "wiki-mai68-fr",
    group: "hist",
    label: "Mai 68",
    url: "https://fr.wikipedia.org/wiki/Mai_68",
    what: {
      en: "1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.",
      fr: "les foules du 1er mai (25 000 préfecture / 100 000 CGT) et du 13 mai (230 000 préfecture / 171 000 ORTF / 1 000 000 syndicats) ; les 469 interpellations des 10–11 mai et les 1 000 et plus du 25 mai.",
    },
  },
  {
    id: "wiki-mai68-en",
    group: "hist",
    label: "May 68 (English Wikipedia)",
    url: "https://en.wikipedia.org/wiki/May_68",
    what: {
      en: "the 887 injured figure, which appears only in this article’s infobox and is flagged accordingly — no French count was published.",
      fr: "le chiffre de 887 blessés, présent uniquement dans l’infobox de cet article et signalé comme tel — aucun décompte français n’a été publié.",
    },
  },
  {
    id: "wiki-cpe",
    group: "hist",
    label: "Contrat première embauche",
    url: "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
    what: {
      en: "the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.",
      fr: "la série de foules du CPE (7 févr., 7 mars, 18 mars, 23 mars, 28 mars, 4 avr.) et les décomptes répressifs strictement parisiens des 16–18 mars.",
    },
  },
  {
    id: "wiki-gj",
    group: "hist",
    label: "Mouvement des Gilets jaunes",
    url: "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
    what: {
      en: "the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.",
      fr: "la série ministérielle de foules des actes I à XLIV et les décomptes de gardes à vue / interpellations des actes I à IV. Les actes suivants n’ont jamais été publiés en série, d’où l’arrêt des courbes répressives à la semaine 3.",
    },
  },
  {
    id: "wiki-nahel",
    group: "hist",
    label: "Mort de Nahel Merzouk",
    url: "https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk",
    what: {
      en: "the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.",
      fr: "les 3 354 interpellations et 722 policiers blessés du 27 juin au 2 juill. 2023, et les 108 de la semaine suivante.",
    },
  },
  {
    id: "wiki-retraites",
    group: "hist",
    label: "Mouvement social contre la réforme des retraites de 2023",
    url: "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023",
    what: {
      en: "the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.",
      fr: "les couples ministère / syndicats de chaque journée nationale d’action, du 19 janv. au 6 juin 2023.",
    },
  },
  {
    id: "france24-bloquons",
    group: "hist",
    label: "France 24 — « Bloquons tout », direct du 10 septembre 2025",
    url: "https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron",
    date: "2025-09-10",
    what: {
      en: "197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.",
      fr: "197 000 participants, 596 rassemblements, 253 blocages, 540 interpellations (dont 211 à Paris) — le point ministériel final de la soirée, qui supplante les 175 000 de 17 h 45.",
    },
  },
  {
    id: "bfmtv-bloquons",
    group: "hist",
    label: "BFMTV — direct du 10 septembre",
    url: "https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html",
    date: "2025-09-10",
    what: {
      en: "the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.",
      fr: "la révision du décompte en cours de journée (175 000 → 197 000), d’où une fourchette plutôt qu’un point sur le graphique.",
    },
  },
  {
    id: "figaro-bloquons",
    group: "hist",
    label: "Le Figaro — direct du 10 septembre",
    url: "https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910",
    date: "2025-09-10",
    dateEnd: "2025-09-11",
    what: {
      en: "the 18 Sep intersyndicale day and the 2 Oct third wave.",
      fr: "la journée intersyndicale du 18 sept. et la troisième vague du 2 oct.",
    },
  },
  {
    id: "wiki-bloquons",
    group: "hist",
    label: "Bloquons tout (English Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Bloquons_tout",
    what: {
      en: "the movement’s chronology and its 10 Sep / 18 Sep / 2 Oct structure.",
      fr: "la chronologie du mouvement et sa structure des 10 sept., 18 sept. et 2 oct.",
    },
  },
];

/** Back-compat alias for the name an earlier draft exported. */
export const SOURCE_GROUPS = GROUPS;

/* --------------------------------------------------------------- marker key */

const MARKER_KEY: { key: string; text: Bi }[] = [
  {
    key: "r",
    text: {
      en: "regional only — one département or one city, never extrapolated",
      fr: "régional seulement — un département ou une ville, jamais extrapolé",
    },
  },
  {
    key: "p",
    text: {
      en: "partial — a floor, or two publishers disagreeing; both bounds shown",
      fr: "partiel — un plancher, ou deux éditeurs en désaccord ; les deux bornes affichées",
    },
  },
  {
    key: "f",
    text: {
      en: "lower bound — the true figure is at least this",
      fr: "borne inférieure — le chiffre réel est au moins celui-ci",
    },
  },
  {
    key: "e",
    text: {
      en: "derived — modelled here, not published as such",
      fr: "dérivé — modélisé ici, non publié tel quel",
    },
  },
  {
    key: "c",
    text: {
      en: "stock or actions-total — a different basis; never sum it with the rest",
      fr: "stock ou total d’actions — autre base de mesure ; ne jamais l’additionner au reste",
    },
  },
  {
    key: "w",
    text: {
      en: "weekly aggregate — a week, not a day",
      fr: "agrégat hebdomadaire — une semaine, pas un jour",
    },
  },
];

/* ----------------------------------------------------------------- render */

const CSS = `
#sources .intro { margin: 0 0 16px; font-size: 12px; line-height: 1.5; color: #4b5563; max-width: 100ch; }
#sources .source-group { margin: 0 0 18px; }
#sources .source-group > h2 { font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em; color: #111827; margin: 0 0 6px; font-weight: 700; }
#sources .source-group > p.blurb { margin: 0 0 6px; font-size: 11.5px; color: #6b7280; max-width: 95ch; }
#sources .source-group ul { margin: 0; padding-left: 18px; }
#sources .source-group li { margin: 0 0 5px; font-size: 12px; line-height: 1.4; color: #374151; }
#sources .source-group a { color: #1b5c92; text-decoration: none; border-bottom: 1px solid #b0cfe6; }
#sources .source-group a:hover { border-bottom-color: #1b5c92; }
#sources .date { color: #9ca3af; white-space: nowrap; }
#sources .what { color: #6b7280; }
#sources .marker-list { display: grid; grid-template-columns: max-content 1fr; gap: 2px 10px; margin: 6px 0 0; font-size: 11.5px; }
#sources .marker-list dt { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #111827; }
#sources .marker-list dd { margin: 0; color: #6b7280; }
#sources .foot { margin: 0 0 14px; font-size: 11px; color: #6b7280; max-width: 110ch; }
`;

function ensureStyles(): void {
  if (document.getElementById("sources-css")) return;
  const style = document.createElement("style");
  style.id = "sources-css";
  style.textContent = CSS;
  document.head.append(style);
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** #sources in index.html, or a body appended to <main>/<body> so the box can never vanish. */
function resolveHost(root?: HTMLElement | string | null): HTMLElement {
  if (root)
    return typeof root === "string"
      ? (document.querySelector<HTMLElement>(root) ?? makeHost())
      : root;
  return (
    document.getElementById("sources") ??
    document.querySelector<HTMLElement>("[data-sources]") ??
    makeHost()
  );
}

function makeHost(): HTMLElement {
  const sec = el("section");
  sec.id = "sources";
  document.querySelector("main")?.append(sec) ?? document.body.append(sec);
  return sec;
}

function dateLabel(s: Source): string | null {
  if (!s.date) return null;
  return s.dateEnd
    ? `${fmtDayMonth(s.date)}–${fmtDate(s.dateEnd)}`
    : fmtDate(s.date);
}

function sourceItem(s: Source): HTMLLIElement {
  const li = el("li");
  li.dataset.sourceId = s.id;

  const a = el("a", undefined, s.label);
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  li.append(a);

  const when = dateLabel(s);
  if (when) {
    li.append(document.createTextNode(" "));
    const time = el("time", "date", when);
    time.dateTime = s.date!;
    li.append(time);
  }

  li.append(document.createTextNode(" — "));
  li.append(el("span", "what", bi(s.what)));
  return li;
}

/** Idempotent. Keeps the static <h1> that index.html owns, replaces everything after it. */
export function renderSources(root?: HTMLElement | string | null): void {
  ensureStyles();
  const host = resolveHost(root);

  const heads = [...host.children].filter(
    (n): n is HTMLElement =>
      /^H[1-3]$/.test(n.tagName) && !n.closest(".source-group"),
  );

  /* index.html owns the heading; give it the active language without replacing it. */
  const heading = heads.find((n) => n.tagName === "H1");
  if (heading) heading.textContent = bi(BOX_TITLE);

  const body: Node[] = [el("p", "intro", bi(INTRO))];

  for (const group of GROUPS) {
    const items = SOURCES.filter((s) => s.group === group.id);
    if (!items.length) {
      console.warn(`[sources] group "${group.id}" is empty`);
      continue;
    }
    const wrap = el("div", "source-group");
    wrap.id = `src-${group.id}`;
    wrap.append(el("h2", undefined, bi(group.title)));
    wrap.append(el("p", "blurb", bi(group.blurb)));

    const list = el("ul");
    for (const item of items) list.append(sourceItem(item));
    wrap.append(list);
    body.push(wrap);
  }

  const key = el("div", "source-group");
  key.id = "src-key";
  key.append(
    el(
      "h2",
      undefined,
      bi({ en: "How to read the markers", fr: "Comment lire les marqueurs" }),
    ),
  );
  const dl = el("dl", "marker-list");
  for (const m of MARKER_KEY) {
    dl.append(el("dt", undefined, m.key));
    dl.append(el("dd", undefined, bi(m.text)));
  }
  key.append(dl);
  body.push(key);

  body.push(el("p", "foot", bi(FOOT)));

  host.replaceChildren(...heads, ...body);
}
