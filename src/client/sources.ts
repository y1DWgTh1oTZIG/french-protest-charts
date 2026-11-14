/* src/client/sources.ts — provenance box.
 *
 * 158 sources, 13 groups. ONE ENTRY PER URL: where the same page was cited
 * twice under two ids, the two entries are merged into one and the second id
 * is retired. Part I (2026 movement, policing deployment, injuries, damage,
 * overseas) and Part II (the historical comparison episodes) plus the pre-i18n
 * index.html citations, which are preserved verbatim and keep their ids.
 *
 * Dates. `date` is the ISO publication date of the page; `dateEnd` closes a
 * publication span, rendered as "10 Sep–11 Sep 2025". Wikipedia entries carry
 * the last-revision date of the article, as this file has always done. A page
 * that publishes no date — a ministry portal, a standing reference page, a
 * live topic page — is left undated or spans the window its cited items
 * cover; the Source contract below allows an absent date for exactly that
 * case.
 *
 * Label convention: "Publisher — «headline»" where the page title was captured verbatim in the
 * transcript; otherwise "Publisher — descriptive title" in the same slot, without guillemets.
 * Article titles and publisher names stay verbatim — translating a headline breaks the citation.
 *
 * Contract: renderSources(host?) is idempotent — it replaceChildren()s its own host, so main.ts
 * may call it on every render and every language change. The page-level <h2> lives OUTSIDE
 * #sources in index.html, so it survives the replacement.
 */

import { el } from "./dom.ts";
import { bi, fmtDate, fmtDayMonth, type Bi } from "./i18n.ts";

export type GroupId =
  | "official"
  | "press"
  | "blockades"
  | "cost"
  | "overseas"
  | "ref2026"
  | "mai68"
  | "cpe"
  | "gj"
  | "nahel"
  | "retraites"
  | "rn2024"
  | "bloquons";

export interface Source {
  readonly id: string;
  readonly group: GroupId;
  /** Publisher and headline, verbatim. Never translated. */
  readonly label: string;
  readonly url: string;
  /**
   * ISO start date. Absent for continuously published sources (ministry
   * briefings, portals) and for standing reference pages that publish no
   * date.
   */
  date?: string;
  /** End of a publication span; rendered as "10 Sep–11 Sep 2025". */
  dateEnd?: string;
  /** What this page takes from the source. */
  readonly what: Bi;
}

export interface SourceGroup {
  readonly id: GroupId;
  readonly title: Bi;
  readonly blurb: Bi;
}

/* --------------------------------------------------------------------- copy */

const BOX_TITLE: Bi = { en: "Sources and method", fr: "Sources et méthode" };

const INTRO: Bi = {
  en: "Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.",
  fr: "Compilé par une IA à partir des sources ci-dessous ; aucun chiffre ici n’est une mesure primaire réalisée pour cette page. Lorsqu’un mouvement dispose d’un décompte officiel, le ministère de l’Intérieur est la source des interpellations et des blessés parmi les forces, les syndicats publiant la foule concurrente. Les décomptes qui n’ont existé que sous forme de brèves quotidiennes dispersées ont été additionnés à la main : c’est là que se concentre l’essentiel de l’erreur.",
};

const FOOT: Bi = {
  en: "Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a shared log axis, and C′ is capped at week 7. The blockade series counts establishments where pupils could not attend normally; its band runs from the ministry count to the union count, and the union's count also includes administratively closed schools. The Toussaint holiday (17 Oct – 1 Nov) is drawn dotted: no lycée was in session, so the figure did not exist. Nothing here has been through external review.",
  fr: "Ce n’est pas une source, mais cela porte la lecture : dans les brouillons antérieurs, l’indice de la section C divisait chaque série par son premier chiffre, et l’axe des x de C′ était fixé par l’épisode le plus long. Les deux ont été remplacés — C trace des effectifs bruts sur un axe log partagé, et C′ est plafonné à la semaine 7. La série des blocages compte les établissements où les élèves ne pouvaient pas suivre normalement ; sa fourchette va du décompte ministériel au décompte syndical, et ce dernier inclut aussi les lycées fermés administrativement. Les vacances de la Toussaint (17 oct. – 1 nov.) sont en pointillés : aucun lycée n’était en cours, le chiffre n’existait donc pas. Rien ici n’a fait l’objet d’une relecture externe.",
};

const MENTIONS_TITLE: Bi = {
  en: "Named in the reporting, not linked",
  fr: "Nommés dans les articles, non liés",
};

const MENTIONS_BLURB: Bi = {
  en: "Organisations and authors whose figures this page uses second-hand, through the articles above. List them here rather than invent a URL for them.",
  fr: "Organisations et auteurs dont les chiffres sont repris de seconde main, via les articles ci-dessus. Les nommer ici plutôt que d’inventer une URL.",
};

/* ------------------------------------------------------------------ helpers */

const both = (en: string, fr: string): Bi => ({ en, fr });

function src(
  id: string,
  group: GroupId,
  label: string,
  url: string,
  what: Bi,
  date?: string,
  dateEnd?: string,
): Source {
  const s: Source = { id, group, label, url, what };
  if (date) s.date = date;
  if (dateEnd) s.dateEnd = dateEnd;
  return s;
}

/* ------------------------------------------------------------------- groups */

export const GROUPS: readonly SourceGroup[] = [
  {
    id: "official",
    title: {
      en: "The 2026 movement — state situation reports",
      fr: "Le mouvement de 2026 — points de situation de l’État",
    },
    blurb: {
      en: "Origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting in the next group rather than from a dataset. One préfecture bulletin is included: 13 Oct had no national briefing, so the Ardèche report is the only state account of that day.",
      fr: "Origine de chaque décompte d’interpellations, de gardes à vue et de blessés parmi les forces, ainsi que du chiffre ministériel de foule. Publiés en points presse et points de situation du soir, non en séries téléchargeables : les valeurs quotidiennes ont donc été relevées dans la presse du groupe suivant, et non dans un jeu de données. Un communiqué préfectoral est inclus : le 13 oct. n’a donné lieu à aucun point national, le rapport ardéchois est donc le seul compte rendu étatique de cette journée.",
    },
  },
  {
    id: "press",
    title: {
      en: "The 2026 movement — turnout, arrests, injuries",
      fr: "Le mouvement de 2026 — foule, interpellations, blessés",
    },
    blurb: {
      en: "Daily press reporting for 15 Sep – 11 Nov 2026, plus the two disputes that shaped the charts: whether the 17 Oct policing operation was actually smaller than its predecessors, and how far the injured-protester total can be trusted.",
      fr: "La presse quotidienne du 1er oct. au 11 nov. 2026, plus les deux controverses qui ont façonné les graphiques : le dispositif du 17 oct. était-il réellement inférieur aux précédents, et jusqu’où le total de blessés parmi les manifestants est-il fiable.",
    },
  },
  {
    id: "blockades",
    title: {
      en: "The 2026 movement — school blockades and the school calendar",
      fr: "Le mouvement de 2026 — blocages de lycées et calendrier scolaire",
    },
    blurb: {
      en: "The blockade line on the daily and weekly charts is a separate statistic: establishments where pupils could not attend normally — blocked, or closed by decision. The band runs from the ministry count to the union count, and the two publishers do not count the same thing: the union's “à l'arrêt” includes schools closed administratively, so it is an upper bound. The Toussaint holiday (17 Oct – 1 Nov) is drawn dotted because no lycée was in session: the count did not exist, it was not zero. The Interior Ministry's daily tallies of establishments concerned and blocked are in the first group above.",
      fr: "La courbe des blocages des graphiques quotidien et hebdomadaire est une statistique à part : les établissements où les élèves ne pouvaient pas suivre normalement — bloqués, ou fermés par décision. La fourchette va du décompte ministériel au décompte syndical, et les deux éditeurs ne comptent pas la même chose : le « à l'arrêt » syndical inclut les lycées fermés administrativement, c'est donc une borne haute. Les vacances de la Toussaint (17 oct. – 1 nov.) sont en pointillés car aucun lycée n'était en cours : le décompte n'existait pas, il n'était pas nul. Les bilans quotidiens du ministère de l'Intérieur sur les établissements concernés et bloqués figurent dans le premier groupe ci-dessus.",
    },
  },
  {
    id: "cost",
    title: {
      en: "The 2026 movement — damage and cost",
      fr: "Le mouvement de 2026 — dommages et coûts",
    },
    blurb: {
      en: "Damage, damage cost and policing cost. None of this exists as a daily series: it is a handful of one-off assessments for 17–18 Oct and for the lycée blockades, which is why most cells in those columns are empty rather than estimated.",
      fr: "Dommages, coût des dommages et coût du maintien de l’ordre. Rien de tout cela n’existe en série quotidienne : ce sont quelques bilans ponctuels pour les 17–18 oct. et pour les blocages de lycées, d’où des colonnes le plus souvent vides plutôt qu’estimées.",
    },
  },
  {
    id: "overseas",
    title: {
      en: "The 2026 movement — overseas",
      fr: "Le mouvement de 2026 — outre-mer",
    },
    blurb: {
      en: "Outre-mer La 1ère is the only continuous reporting on the Guadeloupe, Martinique, Réunion, Guyane and Mayotte half of the protest count; the ministry bilan gives no territorial split.",
      fr: "Outre-mer La 1ère est le seul suivi continu de la moitié guadeloupéenne, martiniquaise, réunionnaise, guyanaise et mahoraise du décompte ; le bilan ministériel ne fournit aucune ventilation territoriale.",
    },
  },
  {
    id: "ref2026",
    title: {
      en: "The 2026 movement — reference pages",
      fr: "Le mouvement de 2026 — pages de référence",
    },
    blurb: {
      en: "Encyclopaedia and aggregator pages used to cross-check the 2026 chronology. Secondary: never used for a figure that a primary report in the groups above carries.",
      fr: "Pages encyclopédiques et agrégateurs servant à recouper la chronologie de 2026. Secondaires : jamais utilisées pour un chiffre qu’un article primaire des groupes précédents porte déjà.",
    },
  },
  {
    id: "mai68",
    title: { en: "May 1968", fr: "Mai 68" },
    blurb: {
      en: "Two counts exist for almost every 1968 day — prefecture and union — and they diverge by a factor of four on 13 May. Both are plotted.",
      fr: "Deux décomptes existent pour presque chaque journée de 1968 — préfecture et syndicats — et ils divergent d’un facteur quatre le 13 mai. Les deux sont tracés.",
    },
  },
  {
    id: "cpe",
    title: { en: "CPE, 2006", fr: "CPE, 2006" },
    blurb: {
      en: "The first movement in the comparison with a usable daily series. The 16–18 March enforcement counts are Paris-only and are marked as such.",
      fr: "Le premier mouvement de la comparaison doté d’une série quotidienne exploitable. Les décomptes répressifs des 16–18 mars sont strictement parisiens et signalés comme tels.",
    },
  },
  {
    id: "gj",
    title: { en: "Gilets jaunes, 2018–19", fr: "Gilets jaunes, 2018–2019" },
    blurb: {
      en: "Turnout was published act by act for 44 acts; the custody and injury counts were not, which is why the enforcement lines stop at week 3.",
      fr: "La foule a été publiée acte par acte sur 44 actes ; les décomptes de gardes à vue et de blessés non, d’où l’arrêt des courbes répressives à la semaine 3.",
    },
  },
  {
    id: "nahel",
    title: {
      en: "Nahel Merzouk, June–July 2023",
      fr: "Nahel Merzouk, juin–juillet 2023",
    },
    blurb: {
      en: "The only episode here with a consolidated official total, via the Sénat inquiry; the four nights themselves are counted day by day from press and encyclopaedia summaries.",
      fr: "Le seul épisode disposant d’un total officiel consolidé, via l’enquête du Sénat ; les quatre nuits elles-mêmes sont décomptées jour par jour à partir de la presse et des synthèses encyclopédiques.",
    },
  },
  {
    id: "retraites",
    title: { en: "Pensions, 2023", fr: "Retraites, 2023" },
    blurb: {
      en: "Ministry and union pairs for each national action day, 19 Jan – 6 Jun 2023.",
      fr: "Les couples ministère / syndicats de chaque journée nationale d’action, du 19 janv. au 6 juin 2023.",
    },
  },
  {
    id: "rn2024",
    title: {
      en: "Anti-RN marches, June 2024",
      fr: "Marches anti-RN, juin 2024",
    },
    blurb: {
      en: "Kept separate because the 15–16 June 2024 marches are usually folded into the pensions series; they are a different mobilisation with a different organiser base.",
      fr: "Groupe distinct car les marches des 15–16 juin 2024 sont souvent rattachées à la série retraites ; c’est une mobilisation différente, avec une base d’organisateurs différente.",
    },
  },
  {
    id: "bloquons",
    title: {
      en: "« Bloquons tout », September–October 2025",
      fr: "« Bloquons tout », septembre–octobre 2025",
    },
    blurb: {
      en: "The closest precedent to 2026 and the reason the 2026 figures are shown as a band: the ministry revised its own 10 Sep count upward during the evening, from 175,000 to 197,000.",
      fr: "Le précédent le plus proche de 2026, et la raison pour laquelle les chiffres de 2026 sont tracés en fourchette : le ministère a révisé son propre décompte du 10 sept. en cours de soirée, de 175 000 à 197 000.",
    },
  },
];

/* ------------------------------------------------------------------ sources */

export const SOURCES: readonly Source[] = [
  /* ---------------------- 2026 — school blockades and the school calendar */

  src(
    "service-public-vacances",
    "blockades",
    "Service-Public — « Calendrier des vacances scolaires 2026-2027 »",
    "https://www.service-public.gouv.fr/particuliers/actualites/A18563",
    both(
      "the Toussaint dates behind the dotted line: classes end Friday 16 October and resume Monday 2 November 2026, identical in zones A, B and C — which is why the holiday needs no zone logic.",
      "les dates de la Toussaint derrière la ligne en pointillés : fin des cours le vendredi 16 octobre et reprise le lundi 2 novembre 2026, identiques dans les zones A, B et C — d'où l'absence de logique par zone.",
    ),
    "2025-10-24",
  ),

  src(
    "education-calendrier",
    "blockades",
    "Ministère de l’Éducation nationale — « Calendrier scolaire : toutes les dates des cours et des vacances »",
    "https://www.education.gouv.fr/calendrier-scolaire-toutes-les-dates-des-cours-et-des-vacances-100148",
    both(
      "the official end-of-class and return-to-school dates, read against the press calendar for the last day of classes (Friday 16 October). A standing reference page for the 2026-2027 school year: it publishes no date of its own, so none is shown here.",
      "les dates officielles de fin de cours et de reprise, confrontées au calendrier de presse pour le dernier jour de cours (vendredi 16 octobre). Page de référence permanente pour l’année scolaire 2026-2027 : elle ne publie pas de date propre, aucune n’est donc affichée ici.",
    ),
  ),

  src(
    "education-bilans",
    "blockades",
    "Ministère de l’Éducation nationale — bilans d’établissements perturbés et fermés",
    "https://www.education.gouv.fr",
    both(
      "the ministry's balances behind the blockade line: 45 blocked of 338 concerned (29 Sept), 735 establishments perturbed (3 Oct), 224 closed (8 Oct), 214 closed with 94.2% of lycées open (13 Oct), 41 blocked at the rentrée (2 Nov) and 48 (3 Nov). Where the only figure published is “établissements perturbés” or “cours suspendus” rather than “bloqués”, the point is flagged as a wider measure — the tooltip says which. A continuously updated portal: the span shown is the window its cited balances cover.",
      "les bilans ministériels derrière la courbe des blocages : 45 bloqués sur 338 concernés (29 sept.), 735 établissements perturbés (3 oct.), 224 fermés (8 oct.), 214 fermés avec 94,2 % de lycées ouverts (13 oct.), 41 bloqués à la rentrée (2 nov.) et 48 (3 nov.). Lorsque le seul chiffre publié est « établissements perturbés » ou « cours suspendus » plutôt que « bloqués », le point est signalé comme une mesure plus large — l'infobulle précise laquelle. Portail mis à jour en continu : la période affichée est celle couverte par les bilans cités.",
    ),
    "2026-09-29",
    "2026-11-03",
  ),

  src(
    "usl-comptes",
    "blockades",
    "Union syndicale lynéenne — appels et décomptes syndicaux",
    "https://www.uslsyndicat.fr/",
    both(
      "the organiser side of the blockade band: 640 (1 Oct), 1 800 schools “à l'arrêt” (6 Oct), 1 000 (5 Nov). The union's own definition counts schools closed administratively as well as schools actually blocked, so its figure is an upper bound rather than a like-for-like count — which is why the band is wide and the tooltip says so. The “1800 LYCÉES À L'ARRÊT” communiqué is dated 6 Oct 2026 and the following one 7 Oct; the span shown covers the union's published counts from 1 Oct to 5 Nov.",
      "le côté syndical de la fourchette des blocages : 640 (1er oct.), 1 800 lycées « à l'arrêt » (6 oct.), 1 000 (5 nov.). La définition syndicale compte aussi les lycées fermés administrativement, et non seulement les lycées bloqués : son chiffre est une borne haute plutôt qu'un décompte comparable — d'où la largeur de la fourchette, que l'infobulle explique. Le communiqué « 1800 LYCÉES À L'ARRÊT » est daté du 6 oct. 2026 et le suivant du 7 oct. ; la période affichée couvre les décomptes syndicaux publiés du 1er oct. au 5 nov.",
    ),
    "2026-10-06",
    "2026-11-05",
  ),

  src(
    "franceinfo-blocages",
    "blockades",
    "Franceinfo — le suivi jour par jour des blocages de lycées",
    "https://www.franceinfo.fr/societe/education/blocage-des-lycees/",
    both(
      "the live day-by-day counts used where no ministry balance was issued: 169 blockades in the morning of 1 Oct, 891 schools with classes suspended at midday on 6 Oct, more than 150 perturbed on 8 Oct, and “more than 40 schools blocked” on 10 Oct. A rolling topic page with no date of its own — items are labelled “Aujourd'hui” — so the span shown runs from the first cited count to the last update of the page.",
      "les décomptes journaliers en direct utilisés là où aucun bilan ministériel n'a été publié : 169 blocages le matin du 1er oct., 891 établissements avec cours suspendus à la mi-journée du 6 oct., plus de 150 perturbés le 8 oct. et « plus de 40 lycées bloqués » le 10 oct. Page de suivi sans date propre — les entrées sont marquées « Aujourd'hui » — ; la période affichée va du premier décompte cité à la dernière mise à jour de la page.",
    ),
    "2026-10-01",
    "2026-11-13",
  ),
  /* ------------------------------------------- 2026 — ministry briefings */
  src(
    "interieur",
    "official",
    "Ministère de l’Intérieur",
    "https://www.interieur.gouv.fr/",
    both(
      "origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series. A continuously updated portal: the span shown is the window of the situation reports cited here, from the first national turn to the 7 Nov bilan.",
      "origine de chaque décompte d’interpellations, de gardes à vue et de blessés parmi les forces, ainsi que du chiffre ministériel de foule. Publiés en points presse et points de situation du soir, non en séries téléchargeables. Portail mis à jour en continu : la période affichée est celle des points de situation cités, du premier tournant national au bilan du 7 nov.",
    ),
    "2026-09-28",
    "2026-11-07",
  ),
  src(
    "ardeche-13oct",
    "official",
    "Préfecture de l’Ardèche — « Mobilisation en Ardèche – mardi 13 octobre 2026 – point de situation à 17 h »",
    "https://www.ardeche.gouv.fr/Actualites/Actualites-2026/Mobilisation-en-Ardeche-Mardi-13-octobre-2026-Point-de-situation-a-17-h",
    both(
      "the departmental control case: peak of 130 in Privas, 120 in Annonay, 60 in Tournon-sur-Rhône and 600 in Aubenas (student counts included), no school blocked, no violence and no damage, two procedures for insults against officers, 100+ police mobilised. Read against the national aggregate as evidence that a day can be busy in one department and uneventful in the rest.",
      "le cas de contrôle départemental : pic de 130 à Privas, 120 à Annonay, 60 à Tournon-sur-Rhône et 600 à Aubenas (lycéens inclus), aucun établissement bloqué, aucune violence ni dégradation, deux procédures pour outrages, plus de cent policiers mobilisés. À lire face à l’agrégat national : une journée peut être chargée dans un département et calme ailleurs.",
    ),
    "2026-10-13",
  ),
  src(
    "insee-population-1er-janvier",
    "official",
    "INSEE — « Population au 1er janvier »",
    "https://www.insee.fr/fr/statistiques",
    both(
      "the denominators behind every per-capita figure: France entière and France métropolitaine at 1 January, 1968–2026. The 2026 figures are provisional and the series is revised annually; the release used here is January 2026. No France-entière row exists for 1968 in this release, so May 68 is read against metropolitan France alone.",
      "les dénominateurs de tous les chiffres rapportés à la population : France entière et France métropolitaine au 1er janvier, 1968-2026. Les chiffres de 2026 sont provisoires et la série est révisée chaque année ; la version utilisée ici est celle de janvier 2026. Aucune ligne « France entière » n’existe pour 1968 dans cette version : Mai 68 est donc rapporté à la seule France métropolitaine.",
    ),
    "2026-01-01",
  ),

  /* 17 Oct 2026 — the injury series for that day. Read as a stack, not a list:
     the ministry figure (forces only) at the bottom, encyclopaedic / militant
     tallies above it, the medical register as the documented floor. */

  src(
    "bfmtv-bilan-17oct",
    "press",
    "BFMTV — « Violences du 17 octobre : le ministère de l’Intérieur recense 2 397 interpellations, 997 policiers et gendarmes blessés dont 7 graves »",
    "https://www.bfmtv.com/police-justice/violences-du-7-octobre-le-ministere-de-l-interieur-recense-2-397-interpellations-997-policiers-et-gendarmes-blesses-dont-7-graves_AD-202610180350.html",
    both(
      "the only consolidated state tally for the day: 2,397 arrests and 997 police and gendarmes injured, 7 seriously. It counts forces only — no protester figure — which is why the protest-injury series has no official anchor.",
      "le seul bilan étatique consolidé de la journée : 2 397 interpellations et 997 policiers et gendarmes blessés, dont 7 graves. Il ne compte que les forces — aucun chiffre de manifestants blessés — d’où l’absence d’ancrage officiel pour la série.",
    ),
    "2026-10-18",
  ),

  src(
    "mediacites-toulouse-17oct",
    "press",
    "Médiacités — « Plus de 130 blessés parmi les manifestants du 17 octobre à Toulouse »",
    "https://www.mediacites.fr/enquete/toulouse/2026/10/23/plus-de-130-blesses-parmi-les-manifestants-du-17-octobre-a-toulouse/",
    both(
      "the single largest city count for the day: 130+ people treated in Toulouse, mostly after police injuries, set against the prefecture’s “a dozen or so” officers hurt and the police’s 70 “bruised”. The treated-per-serious-case ratio that drives the reasoned ceiling comes from here.",
      "le plus gros décompte municipal de la journée : plus de 130 personnes prises en charge à Toulouse, pour la plupart blessées par les forces de l’ordre, face aux « une dizaine » d’effectifs blessés de la préfecture et aux 70 agents « contusionnés » de la police. C’est d’ici que vient le ratio pris-en-charge / cas grave qui fonde le plafond raisonné.",
    ),
    "2026-10-23",
  ),

  src(
    "wikifr-17oct",
    "press",
    "Wikipédia — « Manifestations du 17 octobre 2026 en France »",
    "https://fr.wikipedia.org/wiki/Manifestations_du_17_octobre_2026_en_France",
    both(
      "the per-city préfecture tallies used for the bottom-up sum: Bordeaux 23 injured (15 forces), Clermont-Ferrand 9 (5 forces), Dijon 3, Metz 6 (2 forces), Nancy 23 (2 seriously), Rouen 17, plus Paris 12 and Lyon 4 among the serious cases. Also the running casualty total of the movement as a whole. It is also the day page used to cross-check the arrest and injury counts.",
      "les bilans préfectoraux par ville utilisés pour la somme ascendante : Bordeaux 23 blessés (dont 15 forces), Clermont-Ferrand 9 (5 forces), Dijon 3, Metz 6 (2 forces), Nancy 23 (dont 2 graves), Rouen 17, plus Paris 12 et Lyon 4 parmi les cas graves. Aussi le décompte courant des blessés du mouvement. C’est aussi la page du jour servant à recouper interpellations et blessés.",
    ),
    "2026-11-11",
  ),

  src(
    "wiki-en-17oct-riots",
    "press",
    "Wikipedia — « 17 October riots »",
    "https://en.wikipedia.org/wiki/17_October_riots",
    both(
      "the “400+ civilians” injured figure in the infobox, tagged citation needed — so it is a published high bound, not a sourced one. Its 1,000+ forces figure sits on the same line and is equally uncited, which is why the ministry number is preferred for that series.",
      "le chiffre de « 400+ civils » blessés de l’infobox, marqué « citation needed » : une borne haute publiée, non sourcée. Le « 1 000+ » de forces figure sur la même ligne et n’est pas davantage sourcé, d’où la préférence donnée au chiffre ministériel pour cette série.",
    ),
    "2026-11-11",
  ),

  src(
    "mediaclub-thines",
    "press",
    "Le Club de Mediapart (Jonathan Gensburger) — « Violences d’État »",
    "https://blogs.mediapart.fr/jonathan-gensburger/blog/111126/violences-d-etat",
    both(
      "the full Thines register, stopped 5 Nov: 79 victims — 78 seriously injured plus one death — of whom 55 fall on 17 Oct (54 seriously injured: 5 eyes, 5 cranio-facial, 2 amputations, 42 other serious wounds). Documents the floor; the author states plainly that it is neither an official toll nor a judicial expertise. Two versions of the same blog post circulate under different slugs; the higher figures come from the later one, so the citation is flagged as a blog, not reporting.",
      "le relevé Thines complet, arrêté au 5 nov. : 79 victimes — 78 blessés graves et un décès — dont 55 le 17 oct. (54 blessés graves : 5 yeux, 5 traumatismes cranio-faciaux, 2 amputations, 42 autres blessures graves). Documente le plancher ; l’auteur précise qu’il ne s’agit ni d’un bilan officiel ni d’une expertise judiciaire. Deux versions du même billet circulent sous des slugs différents ; les chiffres hauts viennent de la seconde, d’où le signalement en tant que blog et non reportage.",
    ),
    "2026-11-11",
  ),

  src(
    "mediapart-blesses-17oct",
    "press",
    "Mediapart — « “J’ai cru mourir” : enquête sur les blessés du 17 octobre »",
    "https://www.mediapart.fr/journal/france/231026/j-ai-cru-mourir-enquete-sur-les-blesses-du-17-octobre",
    both(
      "the qualitative case file behind the day’s serious injuries — femoral artery severed by a grenade, dozens gravely hurt while peaceful — with no total, which is the point: even the paper that documented the day most closely declines to give one.",
      "le dossier de cas derrière les blessures graves du jour — artère fémorale sectionnée par une grenade, dizaines de blessés graves alors qu’ils manifestaient pacifiquement — sans total, ce qui est précisément l’intérêt : même le journal qui a le plus documenté la journée s’abstient d’en donner un.",
    ),
    "2026-10-23",
  ),

  src(
    "canard-mauvais-oeil",
    "press",
    "Le Canard enchaîné — « Violences policières : les manifestants ont le mauvais œil »",
    "https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil",
    both(
      "the explicit statement that no official figure for serious injuries has ever been published since the movement began, and the method note: Thines built his register from national and local press plus militant blogs, and 127 IGPN referrals are open. It also carries Prof. Laurent Thines’ (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.",
      "la mention explicite qu’aucun chiffre officiel de blessés graves n’a jamais été publié depuis le début du mouvement, et la note de méthode : Thines a bâti son relevé dans la presse nationale, locale et les blogs militants, 127 saisines de l’IGPN étant ouvertes. Elle porte aussi le registre presse et blog du Pr Laurent Thines (CHU de Besançon) : 79 blessés graves en trois semaines — 10 éborgnés, 9 traumatismes crânio-faciaux, 7 amputations, 1 mort. Source du plancher de blessés parmi les manifestants, et raison pour laquelle aucune série hebdomadaire de blessés manifestants n’existe.",
    ),
    "2026-11-10",
  ),

  src(
    "contre-attaque-20oct",
    "press",
    "Contre-Attaque — « Terrorisme d’État : le 17 octobre la police a fait couler le sang »",
    "https://contre-attaque.net/2026/10/20/terrorisme-detat-le-17-octobre-la-police-a-fait-couler-le-sang/",
    both(
      "the earliest case-by-case sweep (Paris, Rennes, Grenoble, Limoges, Caen, Nancy, Marseille) and the phrase “a repression that touched thousands” — the source of the upper part of the band. It gives no total, only an invitation for victims to come forward.",
      "le premier recensement cas par cas (Paris, Rennes, Grenoble, Limoges, Caen, Nancy, Marseille) et la formule d’une répression « qui a touché des milliers de personnes » — d’où vient le haut de la fourchette. Aucun total, seulement un appel à témoins.",
    ),
    "2026-10-20",
  ),

  src(
    "contre-attaque-23oct",
    "press",
    "Contre-Attaque — « 17 Octobre : un carnage policier sans précédent, nouveau recensement de la sauvagerie policière »",
    "https://contre-attaque.net/2026/10/23/17-octobre-un-carnage-policier-sans-precedent-nouveau-recensement-de-la-sauvagerie-policiere/",
    both(
      "“two cardiac arrests, an unprecedented number of mutilations in a few hours, hundreds of serious injuries” — the militant figure that sets the top of the band, and the claim of a second death on the day, which no register corroborates and which the chart therefore does not carry. It is also the militant recount of 17 Oct injuries; the highest bound considered, never plotted alone.",
      "« deux arrêts cardiaques, un nombre de mutilations sans précédent en quelques heures, des centaines de blessés graves » — le chiffre militant qui fixe le haut de la fourchette, et la revendication d’un second mort ce jour-là, que nul relevé ne corrobore et que le graphique ne retient donc pas. C’est aussi le recensement militant des blessés du 17 oct. ; borne la plus haute examinée, jamais tracée seule.",
    ),
    "2026-10-23",
  ),

  src(
    "ici-avignon-17oct",
    "press",
    "ICI — « Manifestation du 17 octobre à Avignon : 21 interpellations, 9 policiers et au moins 5 civils blessés »",
    "https://www.ici.fr/provence-alpes-cote-d-azur/vaucluse-84/avignon/manifestation-du-17-octobre-a-avignon-21-interpellations-9-policiers-et-au-moins-5-civils-blesses-8087735",
    both(
      "Avignon’s préfecture tally, one of the few that separates civilians from forces: 5 civilians hurt for 2,000 demonstrators. Note the publisher revised the officer count downward from 18 to 9 between its first and second version — a reminder that even same-day figures move.",
      "le bilan préfectoral d’Avignon, l’un des rares à séparer civils et forces : 5 civils blessés pour 2 000 manifestants. À noter : le journal a révisé à la baisse le nombre de policiers blessés, de 18 à 9, entre ses deux versions — rappel que même les chiffres du jour bougent.",
    ),
    "2026-10-21",
  ),

  src(
    "ici-strasbourg-17oct",
    "press",
    "ICI — « Mobilisation du 17 octobre : 17 blessés et 27 interpellations à Strasbourg, le bilan s’alourdit »",
    "https://www.ici.fr/grand-est/alsace-cea/mobilisation-du-17-octobre-16-interpellations-a-strasbourg-et-11-blesses-selon-un-premier-bilan-5327220",
    both(
      "Strasbourg’s revision in action: 11 injured and 16 arrests in the first evening bulletin, 17 and 27 the next day, with one man gravely head-injured near the pont du Corbeau. The URL still carries the original figures, which is why the entry cites the updated headline.",
      "la révision strasbourgeoise en acte : 11 blessés et 16 interpellations au premier communiqué du soir, 17 et 27 le lendemain, dont un homme grièvement touché à la tête près du pont du Corbeau. L’URL porte encore les chiffres d’origine, d’où le titre mis à jour.",
    ),
    "2026-10-17",
  ),

  /* ── optional: cross-checks for the severity breakdown and its limits ── */

  src(
    "monde-enquete-blessures",
    "press",
    "Le Monde — « Hands torn off, broken bones, blinded eye: Le Monde investigates French protesters’ injuries »",
    "https://www.lemonde.fr/en/france/article/2026/11/05/hands-torn-off-broken-bones-blinded-eye-le-monde-investigates-french-protesters-injuries_6772405_7.html",
    both(
      "independent corroboration of the register’s shape — three hands torn off, four eyes mutilated — described by Le Monde itself as “a preliminary and certainly underestimated count”, with intermediate-force weapons implicated in nearly every case.",
      "corroboration indépendante de la structure du relevé — trois mains arrachées, quatre yeux mutilés — que Le Monde qualifie lui-même de décompte « préliminaire et certainement sous-estimé », les armes de force intermédiaire étant en cause dans presque tous les cas.",
    ),
    "2026-11-05",
  ),

  src(
    "prodpress-verification",
    "press",
    "PRODPRESS — « Blessés des manifestations : les enquêtes documentent les cas, les bilans restent à consolider »",
    "https://www.prodpress.eu/manifestations-blesses-bilan-coquerel-verification-2026/",
    both(
      "the cautionary counterweight: the same Thines count stood at 61 cases on 30 Oct and 79 on 5 Nov, so any figure is a snapshot; the site declines to validate the extrapolation to a national total, which is why the middle point is labelled an estimate rather than a count. It also states explicitly that injury totals were never consolidated — the method note behind the injury floor. The page publishes no date of its own: no byline, no date metadata, and no archived capture, so none is shown here.",
      "le contrepoids méthodologique : le même relevé Thines affichait 61 cas au 30 oct. et 79 au 5 nov., tout chiffre n’étant donc qu’une photographie ; le site refuse de valider l’extrapolation à un total national, d’où le point milieu présenté comme une estimation, non un décompte. Il constate aussi explicitement que les totaux de blessés n’ont jamais été consolidés — la note de méthode derrière le plancher. La page ne publie aucune date propre : ni signature, ni métadonnée de date, ni capture archivée ; aucune n’est donc affichée ici.",
    ),
  ),

  /* ── Outstanding-figure verification, 12 Nov 2026 ───────────────────── */

  src(
    "senat-emeutes-2023",
    "official",
    "Sénat — « Émeutes de juin 2023 : comprendre, évaluer, réagir »",
    "https://www.senat.fr/salle-de-presse/communiques-de-presse/presse/10-04-2024/emeutes-de-juin-2023-comprendre-evaluer-reagir.html",
    both(
      "the Senate mission's headline figures for the Nahel riots: 672 communes affected, 45,000 security personnel mobilised, 50,000 émeutiers estimated (Darmanin: 8,000–12,000; Brochand: 100,000–200,000), 16,400 claims filed with insurers for €793 million, 2,500 buildings burnt or degraded including 168 schools and 105 mairies. Also the authority for the episode-level rioter estimates now used in the p band.",
      "les chiffres clés de la mission du Sénat sur les émeutes de Nahel : 672 communes concernées, 45 000 personnels de sécurité mobilisés, 50 000 émeutiers estimés (Darmanin : 8 000 à 12 000 ; Brochand : 100 000 à 200 000), 16 400 sinistres pour 793 millions d’euros, 2 500 bâtiments incendiés ou dégradés dont 168 écoles et 105 mairies. También l’autorité des estimations d’émeutiers désormais portées par la bande p.",
    ),
    "2024-04-10",
  ),

  src(
    "interieur-24oct-bilan",
    "official",
    "Ministère de l’Intérieur — « Bilan de la journée de mobilisation nationale du 24 octobre 2026 »",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-journee-de-mobilisation-nationale-du-24-octobre-2026",
    both(
      "the communiqué behind every 2026 core figure: 24 Oct = 289 actions, 410,000 participants (110,000 Paris), provisional 7:30 a.m. bilan of 1,314 arrests and 53 forces injured “provisoire à ce stade”, 75 fire interventions, 24 shops pillaged, against 1,522 shops hit on 17 Oct; and the cross-references to 31 Oct (227 actions, 320,000) and 5 Nov (193 actions, 575,000 incl. 65,000 Paris).",
      "le communiqué qui fonde tous les chiffres centraux de 2026 : 24 oct. = 289 actions, 410 000 participants (110 000 à Paris), bilan provisoire à 7 h 30 de 1 314 interpellations et 53 blessés des forces « provisoire à ce stade », 75 interventions incendie, 24 commerces pillés, contre 1 522 commerces touchés le 17 oct. ; renvois au 31 oct. (227 actions, 320 000) et au 5 nov. (193 actions, 575 000 dont 65 000 à Paris).",
    ),
    "2026-10-25",
  ),

  src(
    "france24-24oct-prov",
    "press",
    "France 24 — « Mobilisation du 24 octobre : plus de 1 300 interpellations, une cinquantaine de policiers blessés »",
    "https://www.france24.com/fr/france/20261025-mobilisation-du-24-octobre-plus-de-1-300-interpellations-une-cinquantaine-de-policiers-bless%C3%A9s",
    both(
      "the press rendering of the provisional 24 Oct bilan: 1,314 arrests and 53 forces injured. Establishes that the 53 is a first-overnight provisional figure, which is why the table keeps the consolidated 267 rather than widening to a 53–267 band.",
      "le compte rendu presse du bilan provisoire du 24 oct. : 1 314 interpellations et 53 blessés des forces. Établit que le 53 est un chiffre provisoire de la nuit, ce qui justifie de conserver le 267 consolidé plutôt qu'ouvrir une bande 53–267.",
    ),
    "2026-10-25",
  ),

  src(
    "franceinfo-24oct-final",
    "press",
    "Franceinfo — « Manifestations du 24 octobre : 267 membres des forces de l’ordre et 150 someplaceants ont été blessés, dont trois gravement, annonce Laurent Nuñez »",
    "https://www.franceinfo.fr/societe/manifestations/manifestations-du-24-octobre-267-membres-des-forces-de-l-ordre-et-150-manifestants-ont-ete-blesses-dont-trois-gravement-annonce-laurent-nunez_8253910.html",
    both(
      "the minister's consolidated 24 Oct figures: 267 forces injured, 150 protesters injured including 3 seriously, 1,435 arrests. Source of the two cells now carried for that date.",
      "les chiffres consolidés du 24 oct. annoncés par le ministre : 257... 267 blessés des forces de l’ordre, 150 manifestants blessés dont 3 graves, 1 435 interpellations. Source des deux cellules portées pour cette date.",
    ),
    "2026-10-26",
  ),

  src(
    "lsa-cci-bilan",
    "press",
    "LSA / CCI France — « Manifestations d’octobre : 1 milliard d’euros de dégâts et 2 500 commerces touchés selon CCI France, les détails ville par ville »",
    "https://www.lsa-conso.fr/distributeurs-alimentaires/manifestations-doctobre-1-milliard-deuros-de-degats-et-2-500-commerces-touches-selon-cci-france-les-details-ville-par-ville.2HTRI7YOSJHP5E52ISPEQEF4KQ.html",
    both(
      "CCI France's 27 Oct tally, the basis of the new national damage cell: 2,488 businesses hit after 17 Oct plus 50 after 24 Oct, 1,161 heavily damaged, 643 still closed, cost of the degradations estimated at over €1bn on IFRAP's estimate. City detail: Marseille 500 (225 heavy), Paris/IDF 480 (240 degraded), Lyon–Saint-Étienne–Roanne 300 (€20M), Bordeaux 158, Rennes 143, Nantes 59, Toulouse 41, Montpellier 56 (€1–2M). No separate Marseille or Paris damage amount. It is also the source of the city-by-city breakdown of the €1bn retail estimate.",
      "le bilan CCI France du 27 oct., base de la nouvelle cellule nationale de dégâts : 2 488 commerces touchés après le 17 oct. plus 50 après le 24 oct., 1 161 fortement dégradés, 643 encore fermés, coût des dégradations estimé à plus d’1 milliard d’euros selon l’IFRAP. Détail par ville : Marseille 500 (225 lourds), Paris/IDF 480 (240 dégradés), Lyon–Saint-Étienne–Roanne 300 (20 M€), Bordeaux 158, Rennes 143, Nantes 59, Toulouse 41, Montpellier 56 (1 à 2 M€). Aucun montant distinct pour Marseille ni Paris. C’est aussi la source de la ventilation par ville de l’estimation de 1 Md€ pour le commerce.",
    ),
    "2026-10-28",
  ),

  src(
    "leprogres-cci-rhone",
    "press",
    "Le Progrès — « Rhône 307 commerces impactés, 20 millions d’euros de dégâts… Les conséquences des manifestations depuis le 17 octobre »",
    "https://www.leprogres.fr/economie/2026/10/27/307-commerces-impactes-20-millions-d-euros-de-degats-les-consequences-des-manifestations-depuis-le-17-octobre",
    both(
      "the regional half of the CCI tally: 307 businesses hit in the Rhône for €20M of damage, corroborating the Lyon–Saint-Étienne–Roanne line independently of CCI France.",
      "la moitié régionale du bilan CCI : 307 commerces impactés dans le Rhône pour 20 M€ de dégâts, corroboration indépendante de la ligne Lyon–Saint-Étienne–Roanne.",
    ),
    "2026-10-27",
  ),

  src(
    "lemonde-en-pensions-23mar",
    "press",
    "Le Monde — « French pension protests: 457 arrested and 441 police injured on Thursday, minister reports »",
    "https://www.lemonde.fr/en/france/article/2023/03/24/french-pension-protests-457-arrested-and-441-police-injured-on-thursday-minister-reports_6020504_7.html",
    both(
      "the consolidated 23 March 2023 enforcement figures — 457 arrests, 441 security forces injured — which close the pensions episode's enforcement gap. Earlier statements that night had put the figures at 80+ arrests and 123 police injured, so the consolidated numbers are the ones plotted.",
      "les chiffres dcited de la répression du 23 mars 2023 — 457 interpellations, 441 blessés des forces — qui comblent le trou de données de répression de l’épisode pensions. Les statements de la soirée donnaient 80+ interpellations et 123 blessés, d’où le choix des chiffres consolidés.",
    ),
    "2023-03-24",
  ),

  src(
    "france24-pensions-23mar",
    "press",
    "France 24 — « At least 457 people arrested, 441 security forces injured in violent French pension protests »",
    "https://www.france24.com/en/europe/20230324-at-least-457-people-arrested-441-security-forces-injured-in-violent-french-pension-protests",
    both(
      "independent confirmation of the 23 March totals, with Darmanin's evening statement of over 80 arrests and 123 police injured noted alongside, which is why the day is plotted at the consolidated figure.",
      "confirmation indépendante des totaux du 23 mars, avec la déclaration de Darmanin en soirée (plus de 80 interpellations, 123 blessés) rappelée en regard — d’où le choix du chiffre consolidé.",
    ),
    "2023-03-24",
  ),

  src(
    "enwiki-pensions-2023",
    "press",
    "Wikipedia — « 2023 French pension reform strikes »",
    "https://en.wikipedia.org/wiki/2023_French_pension_reform_strikes",
    both(
      "the chronology that fixes the pensions episode's weekly bands: 7 Mar 1.1–1.4M over 260+ protests; 11 Mar about 368,000, below the 800,000–1,000,000 expected; 15 Mar ministry 480,000 (37,000 Paris) against CGT 1.78M (450,000 Paris) over 200 protests; 19 Mar only hundreds; 23 Mar ministry 1.08M (119,000 Paris) against CGT 3.5M (800,000 Paris); 6 Apr 111 arrests and 154 police injured. It is also the source that shows 14 March was the eve, not the action day.",
      "la chronologie qui fixe les bandes de l’épisode pensions : 7 mars 1,1–1,4 M sur plus de 260 manifestations ; 11 mars environ 368 000, loin des 800 000 à 1 000 000 attendus ; 15 mars 480 000 ministère (37 000 Paris) contre 1,78 M CGT (450 000 Paris) sur 200 manifestations ; 19 mars quelques centaines ; 23 mars 1,08 M ministère (119 000 Paris) contre 3,5 M CGT (800 000 Paris) ; 6 avril 111 interpellations et 154 policiers blessés. C’est aussi ce qui montre que le 14 mars était la veille, pas le jour d’action.",
    ),
    "2026-10-23",
  ),

  src(
    "enwiki-cpe-2006",
    "press",
    "Wikipedia — « 2006 youth protests in France »",
    "https://en.wikipedia.org/wiki/2006_youth_protests_in_France",
    both(
      "the CPE series that is published at all: 7 Feb 200,000–400,000 over 187 demonstrations; 28 Mar 1.055M (police) against 2.71M (unions) with 600 arrests; 4 Apr 1M (police) against 3.1M (CGT); 18 demonstrators injured on 16 March; and the CAJ totals of 4,500 arrests, 1,950 in garde à vue and 635 prosecutions. It gives no totals for 15 or 25 February, 4 or 11 March — the series does not exist, and the episode should say so. The English summary is also used for the participation estimates that the French page leaves out.",
      "la seule série CPE qui soit publiée : 7 févr. 200 000–400 000 sur 187 manifestations ; 28 mars 1,055 M (police) contre 2,71 M (syndicats) et 600 interpellations ; 4 avr. 1 M (police) contre 3,1 M (CGT) ; 18 blessés le 16 mars ; totaux CAJ : 4 500 interpellations, 1 950 gardes à vue, 635 poursuites. Aucun total pour les 15 ou 25 février, 4 ou 11 mars : la série n’existe pas, et l’épisode doit le dire. La synthèse anglophone est aussi utilisée pour les estimations de participation absentes de la page française.",
    ),
    "2026-05-31",
  ),

  src(
    "frwiki-cpe-2006",
    "press",
    "Wikipédia — « Mouvement contre le contrat première embauche de 2006 »",
    "https://fr.wikipedia.org/wiki/Mouvement_contre_le_contrat_premi%C3%A8re_embauche_de_2006",
    both(
      "the French CPE account: 7 Feb nearly 400,000; 14 March 41,000 (police source); 16 March 447,500 (police) or 500,000–800,000 (organisers); 28 March 1,055,000–3,000,000; 4 April 1–3 million. The 14 March figure is the one addition this pass makes to the episode.",
      "le compte rendu français du CPE : 7 févr. près de 400 000 ; 14 mars 41 000 (source police) ; 16 mars 447 500 (police) ou 500 000 à 800 000 (organisateurs) ; 28 mars 1 055 000 à 3 000 000 ; 4 avril 1 à 3 millions. Le chiffre du 14 mars est le seul ajout de cette passe à l’épisode.",
    ),
    "2026-10-01",
  ),

  src(
    "enwiki-bloquons-tout",
    "press",
    "Wikipedia — « Bloquons tout »",
    "https://en.wikipedia.org/wiki/Bloquons_tout",
    both(
      "the movement's complete action calendar: 10 September (hundreds of actions, ring roads blocked in Bordeaux, Rennes, Nantes, Caen and Paris; participation 200,000–300,000), 18 September (union strikes more important than the movement's own actions; 500,000 to one million followed), and 2 October as the third wave. It mentions no action on 21 September, which closes that supposed gap. It is also the source of the movement's chronology and its 10 Sep / 18 Sep / 2 Oct structure.",
      "le calendrier complet des actions du mouvement : 10 septembre (des centaines d’actions, périphériques bloqués à Bordeaux, Rennes, Nantes, Caen et Paris ; participation de 200 000 à 300 000), 18 septembre (les grèves syndicales plus importantes que les actions du mouvement ; 500 000 à un million de participants) et 2 octobre comme troisième vague. Aucune action au 21 septembre n’y figure, ce qui ferme le faux manque. C’est aussi la source de la chronologie du mouvement et de sa structure des 10 sept., 18 sept. et 2 oct.",
    ),
    "2026-06-25",
  ),

  src(
    "frwiki-nahel-2023",
    "press",
    "Wikipédia — « Émeutes consécutives à la mort de Nahel Merzouk »",
    "https://fr.wikipedia.org/wiki/%C3%89meutes_cons%C3%A9cutives_%C3%A0_la_mort_de_Nahel_Merzouk",
    both(
      "the ministry day table that confirms the episode's weekly sums exactly: arrests 31/207/875/1,311/773/157/72/16/20 = 3,462; police injured 24/174/317/162/42/3/—/—/1 = 723; 5,954 vehicles burnt; 1,092 buildings damaged; 2 deaths. It gives no crowd count for any riot night, and the Place de la République demonstration it mentions was called for 8 July. It also carries the night-by-night breakdown of the four riot nights, which the casualty total does not.",
      "le tableau journalier du ministère qui confirme exactement les sommes hebdomadaires de l’épisode : interpellations 31/207/875/1 311/773/157/72/16/20 = 3 462 ; policiers blessés 24/174/317/162/42/3/—/—/1 = 723 ; 5 954 véhicules incendiés ; 1 092 bâtiments dégradés ; 2 morts. Aucun décompte de foule pour aucune nuit, et la manifestation place de la République qu’il mentionne était prévue pour le 8 juillet. Elle porte aussi la ventilation nuit par nuit des quatre nuits d’émeute, absente du total de victimes.",
    ),
    "2026-10-20",
  ),

  src(
    "frwiki-gj-mouvement",
    "press",
    "Wikipédia — « Mouvement des Gilets jaunes »",
    "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
    both(
      "the per-act casualty figures behind the revised GJ_EXTRA: Act I 409 injured and 1 death (Libération: 287,710 demonstrators, one death, 409 injured); Act II 24 injured including 5 police with 103 interpellations (Le JDD); Act IV 1,385 interpellations and 974 gardes à vue (Le Figaro live), with ~89,000 agents mobilised. It also carries the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts; later acts were never published as a series, which is why the enforcement lines stop at week 3.",
      "les chiffres de victimes par acte qui fondent le GJ_EXTRA révisé : acte I 409 blessés et 1 mort (Libération : 287 710 manifestants, un mort, 409 blessés) ; acte II 24 blessés dont 5 policiers et 103 interpellations (Le JDD) ; acte IV 1 385 interpellations et 974 gardes à vue (Le Figaro live), avec environ 89 000 agents mobilisés. Elle porte aussi la série ministérielle de foules des actes I à XLIV et les décomptes de gardes à vue / interpellations des actes I à IV ; les actes suivants n’ont jamais été publiés en série, d’où l’arrêt des courbes répressives à la semaine 3.",
    ),
    "2026-11-06",
  ),

  src(
    "frwiki-gj-deroulement",
    "press",
    "Wikipédia — « Déroulement du mouvement des Gilets jaunes »",
    "https://fr.wikipedia.org/wiki/D%C3%A9roulement_du_mouvement_des_Gilets_jaunes",
    both(
      "the authoritative per-act table: all 33 ministry counts and all seven Le Nombre jaune counts, which confirm GJ_ACTS and GJ_ORGANISER_COUNTS line for line. It also records Act II's first figure of 106,301 revised eight days later to 166,000, and Act I's communiqué of 117 interpellations with 73 gardes à vue and 409 injured. It is also the act-by-act narrative that dates each turnout point.",
      "le tableau par acte de référence : les 33 chiffres du ministère et les sept comptes du Nombre jaune, qui confirment GJ_ACTS et GJ_ORGANISER_COUNTS ligne à ligne. Y figurent aussi le premier chiffre de l’acte II (106 301) révisé huit jours plus tard à 166 000, et le communiqué de l’acte I : 117 interpellations dont 73 gardes à vue, 409 blessés. C’est aussi le récit acte par acte qui date chaque point de foule.",
    ),
    "2026-11-12",
  ),

  src(
    "lemonde-bloquons-10sep",
    "press",
    "Le Monde — « Takeaways from France's ‘Block Everything’ protests: ‘A lot of anger is building up around issues of social injustice’ »",
    "https://www.lemonde.fr/en/politics/article/2025/09/12/takeaways-from-france-s-block-everything-protests-a-lot-of-anger-is-building-up-around-issues-of-social-injustice_6745326_5.html",
    both(
      "the 10 September action count: 812 actions including 550 rallies and 262 blockades, 540 arrests and 415 people held in custody, 175,000 participants on the ministry's count. Explains why the file's “596 rallies / 253 blockages” is a different counting method, not a contradiction.",
      "le décompte des actions du 10 septembre : 812 actions dont 550 manifestations et 262 blocages, 540 interpellations et 415 personnes en garde à vue, 175 000 participants selon le ministère. Explique pourquoi les « 596 actions / 253 blocages » du fichier relèvent d’une autre méthode de comptage et non d’une contradiction.",
    ),
    "2025-09-12",
  ),

  src(
    "rfi-bloquons-10sep",
    "press",
    "RFI — « France: retour sur la journée “Bloquons tout”, qui a rassemblé 200 000 manifestants »",
    "https://www.rfi.fr/fr/france/20250910-en-direct-mouvement-bloquons-tout-des-nombreuses-arrestations-apr%C3%A8s-les-premi%C3%A8res-actions-partout-en-france",
    both(
      "the first-morning estimate for 10 September — 200,000 — which brackets the ministry's revised 175,000–197,000 and the 200,000–300,000 encyclopaedic range and confirms that the episode's band [175,000, 250,000] is defensible.",
      "la première estimation du 10 septembre au matin — 200 000 — qui encadre le chiffre ministériel révisé de 175 000–197 000 et la fourchette encyclopédique de 200 000 à 300 000, et confirme que la bande [175 000, 250 000] de l’épisode est défendable.",
    ),
    "2025-09-10",
  ),

  src(
    "lesechos-18sep",
    "press",
    "Les Échos — « Grève du 18 septembre : retour sur une journée de mobilisation »",
    "https://www.lesechos.fr/economie-france/conjoncture/direct-greve-du-18-septembre-les-fortes-perturbations-se-confirment-2186895",
    both(
      "the 18 September totals: more than 500,000 demonstrators per the Interior Ministry, 55,000 of them in Paris — the authority band already carried for the episode's w1, confirmed here against the union claim of one million.",
      "les totaux du 18 septembre : plus de 500 000chus défileants selon le ministère de l’Intérieur, dont 55 000 à Paris — la bande d’autorité déjà portée au w1 de l’épisode, confirmée ici face à la revendication syndicale d’un million.",
    ),
    "2025-09-18",
  ),

  src(
    "interieur-31oct",
    "official",
    "Ministère de l’Intérieur — « Bilan de la journée de mobilisation du 31 octobre 2026 et de la soirée d’Halloween »",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-journee-de-mobilisation-du-31-octobre-2026-et-de-soiree-dhalloween",
    both(
      "the week-5 national point, including the Halloween evening, when the damage count collapses.",
      "le point national de la semaine 5, soirée d’Halloween incluse, moment où le décompte des dommages s’effondre.",
    ),
    "2026-10-31",
  ),
  src(
    "interieur-05nov",
    "official",
    "Ministère de l’Intérieur — « Bilan de mobilisation lycéenne et de journée nationale d’action du 5 novembre 2026 »",
    "https://www.interieur.gouv.fr/actualites/communiques-de-presse/bilan-de-mobilisation-lyceenne-et-de-journee-nationale-daction-du-5-novembre-2026",
    both(
      "the 575,000 figure for 5 Nov, the peak of the movement, plus arrests and officer injuries.",
      "le chiffre de 575 000 pour le 5 nov., sommet du mouvement, plus interpellations et blessés parmi les forces.",
    ),
    "2026-11-05",
  ),
  src(
    "interieur-07nov",
    "official",
    "Ministère de l’Intérieur — « Bilan de mobilisation du 7 novembre 2026 : des cortèges émaillés de nombreux incidents »",
    "https://www.interieur.gouv.fr/actualites/actualites-du-ministere/bilan-de-mobilisation-du-7-novembre-2026-des-corteges-emailles-de-nombreux-incidents-dans-grandes",
    both(
      "the 146,000 figure, the arrest count and the incident list for 7 Nov, the last national day in the window.",
      "le chiffre de 146 000, le nombre d’interpellations et la liste des incidents du 7 nov., dernière journée nationale de la fenêtre.",
    ),
    "2026-11-07",
  ),

  /* ── 2026 movement: origins and the September–October bilans ────────── */

  src(
    "frwiki-mvt-lyceen-2026",
    "press",
    "Wikipédia — « Mouvement lycée et étudiant de 2026 en France »",
    "https://fr.wikipedia.org/wiki/Mouvement_lyc%C3%A9en_et_%C3%A9tudiant_de_2026_en_France",
    both(
      "the dated chronology of the whole movement: the first blockades (Mayotte 31 Aug, Le Rheu 7 Sep, Villeneuve-d'Ascq 14 Sep, Caen 15 Sep), Créteil 18–19 Sep, the 23 and 24–25 Sep extensions, then the national turn on 28 Sep (180 establishments perturbed, 27 blockades, 164 arrests), Act I on 29 Sep (338 establishments affected, 45 blocked, 440 arrests), 30 Sep (356 establishments, 625 arrests, 83 forces injured) and Acte II on 1 Oct (900 actions, 340 in the morning per AFP, 400 closures, 1,949 arrests, 318 injured = 170 students + 65 staff + 83 forces). Also the named damage of 1 Oct at Nantes, Meaux and Rouen. It also covers the 1 Oct – 16 Oct chronology of the school movement, which no ministry series covers.",
      "la chronologie datée de tout le mouvement : les premiers blocages (Mayotte 31 août, Le Rheu 7 sept., Villeneuve-d’Ascq 14 sept., Caen 15 sept.), Créteil 18–19 sept., les extensions des 23 et 24–25 sept., puis le tournant national du 28 sept. (180 établissements perturbés, 27 blocages, 164 interpellations), l’acte I du 29 sept. (338 établissements concernés, 45 bloqués, 440 interpellations), le 30 sept. (356 établissements, 625 interpellations, 83 blessés des forces) et l’acte II du 1er oct. (900 actions, 340 le matin selon l’Afrique, 400 fermetures, 1 949 interpellations, 318 blessés = 170 élèves + 65 personnels + 83 forces). Aussi les dégâts nommés du 1er oct. à Nantes, Meaux et Rouen. Elle couvre aussi la chronologie du 1er au 16 oct. du mouvement liceen, qu’aucune série ministérielle ne couvre.",
    ),
    "2026-11-13",
  ),

  src(
    "lemonde-29sept-338",
    "blockades",
    "Le Monde — « Blocages des lycées : 338 établissements concernés mardi, dont 45 encore bloqués, selon le ministère de l’éducation nationale »",
    "https://www.lemonde.fr/societe/article/2026/09/29/blocages-des-lycees-338-etablissements-concernes-et-dix-blesses-selon-le-ministere-de-l-education-nationale_6785573_3225.html",
    both(
      "Act I: the USL claimed 400 blocked establishments out of ~3,700 in France; the Education ministry counted 416 establishments touched since the morning, 338 still affected at day's end with 45 blocked, and 31 injured students and staff; 440 interpellations, two thirds leading to a garde à vue.",
      "l’acte I : l’USL revendiquait 400 établissements bloqués sur ~3 700 en France ; le ministère de l’Éducation recensait 416 établissements touchés depuis le matin, 338 encore affectés en fin de journée dont 45 bloqués, et 31 blessés parmi élèves et personnels ; 440 interpellations, les deux tiers ayant donné lieu à une garde à vue.",
    ),
    "2026-09-29",
  ),

  src(
    "lemonde-30sept-625",
    "press",
    "Le Monde — « Blocage des lycées : 625 interpellations mercredi, annonce le ministre de l’Intérieur qui constate une extension du mouvement »",
    "https://www.lemonde.fr/societe/article/2026/09/30/blocage-des-lycees-625-interpellations-mercredi-annonce-le-ministre-de-l-interieur-qui-constate-une-extension-du-mouvement_6786023_3225.html",
    both(
      "30 September: 625 interpellations, actions in Île-de-France, Lyon, Strasbourg and Nice, and the extension of the movement after the 29 Sep national day.",
      "le 30 septembre : 625 interpellations, des actions en Île-de-France, à Lyon, Strasbourg et Nice, et l’extension du mouvement après la journée nationale du 29 sept.",
    ),
    "2026-09-30",
  ),

  src(
    "lefigaro-30sept-625",
    "press",
    "Le Figaro — « Blocages des lycées : 625 interpellations, 83 policiers et gendarmes blessés mercredi, annonce le ministre de l’Intérieur Laurent Nuñez »",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-la-colere-ne-justifie-pas-la-violence-cingle-emmanuel-macron-des-tensions-dans-plusieurs-villes-20260930",
    both(
      "the 30 September figures: 625 interpellations, 83 police and gendarmes injured, 356 establishments concerned, and the Education ministry's 119 injured students and staff since the start of the blockades.",
      "les chiffres du 30 septembre : 625 interpellations, 83 policiers et gendarmes blessés, 356 établissements concernés, et les 119 élèves et personnels blessés depuis le début des blocages selon le ministère de l’Éducation.",
    ),
    "2026-10-01",
  ),

  src(
    "lefigaro-1oct-1949",
    "press",
    "Le Figaro — « Blocages des lycées : 1 949 interpellations jeudi, 1 793 gardes à vue depuis lundi, interdiction de manifester autour des établissements fermés vendredi »",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-lyceens-et-etudiants-appellent-ce-jeudi-a-un-acte-deux-de-mobilisation-20261001",
    both(
      "the 1 October daily arrest figure of 1,949 — the basis for correcting that cell from a cumulative stock to a daily flow — with 1,793 gardes à vue since Monday and the Wednesday figures of 625 arrests and 83 police injured.",
      "le chiffre d’interpellations du jeudi 1er octobre, 1 949 — base de la correction de cette cellule, de stock cumulatif à flux journalier — avec 1 793 gardes à vue depuis lundi et les chiffres du mercredi, 625 interpellations et 83 blessés.",
    ),
    "2026-10-01",
  ),

  src(
    "lefigaro-2oct-1747",
    "press",
    "Le Figaro — « Blocages des lycées : 1 747 interpellations ce vendredi, plus de 5 000 depuis lundi, annonce Nuñez »",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocus-des-lycees-les-autorites-espere-l-apaisement-apres-les-violences-d-une-extreme-gravite-400-etablissements-fermes-20261002",
    both(
      "2 October: 1,747 arrests that day, more than 5,000 since Monday, 735 establishments perturbed (30% fewer), urban violence near 158 of them, ~300 police and gendarmes injured on Thursday, and 65 education staff injured since the start of the movement including 40 headteachers.",
      "le 2 octobre : 1 747 interpellations, plus de 5 000 depuis lundi, 735 établissements perturbés (−30 %), des violences urbaines près de 158 d’entre eux, ~300 policiers et gendarmes blessés le jeudi, et 65 personnels de l’Éducation blessés depuis le début du mouvement dont 40 proviseurs.",
    ),
    "2026-10-02",
  ),

  src(
    "lefigaro-5oct-6059",
    "press",
    "Le Figaro — « Blocages des lycées : 984 personnes interpellées ce lundi, 715 blessés côté forces de l’ordre depuis le début de la mobilisation »",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocage-des-lycees-des-centaines-de-lycees-seront-a-nouveau-fermes-au-moins-partiellement-lundi-avant-un-acte-iii-mardi-20261005",
    both(
      "the 5 October daily figures (984 arrests, 65 forces injured) and the ministry's stocks: 6,059 interpellations since 28 September and 715 police and gendarmes injured since the start of the movement. Matignon: 215 students and 85 education staff injured, 34 of them headteachers. The 6,059 figure is what makes the derived weekend total of 150 arrests checkable.",
      "les chiffres journaliers du 5 octobre (984 interpellations, 65 blessés des forces) et les stocks ministériels : 6 059 interpellations depuis le 28 septembre et 715 policiers ou gendarmes blessés depuis le début du mouvement. Matignon : 215 élèves et 85 personnels éducatifs blessés, dont 34 chefs d’établissement. Le chiffre de 6 059 est ce qui rend vérifiable le total de 150 interpellations du week-end.",
    ),
    "2026-10-06",
  ),

  src(
    "lefigaro-6oct-488",
    "press",
    "Le Figaro — « Mobilisation des lycéens : 488 interpellations en France, 43 membres des forces de l’ordre blessés »",
    "https://www.lefigaro.fr/actualite-france/en-direct-blocage-des-lycees-des-dizaines-de-milliers-de-lyceens-dans-la-rue-pour-un-acte-iii-sous-haute-surveillance-20261006",
    both(
      "the 6 October daily figures — 488 interpellations and 43 forces injured — and the cumulative 215 students injured since mid-September, including a 16-year-old who lost the use of an eye.",
      "les chiffres journaliers du 6 octobre — 488 interpellations et 53 blessés des forces — et le cumul de 215 élèves blessés depuis la mi-septembre, dont un youngster de 16 ans ayant perdu l’usage d’un œil.",
    ),
    "2026-10-06",
  ),

  src(
    "ouestfrance-25sept-21",
    "press",
    "Ouest-France — « Après des blocus dans des lycées d’Île-de-France, 21 personnes ont été interpellées »",
    "https://www.ouest-france.fr/education/ecole/apres-des-blocus-dans-des-lycees-dile-de-france-21-personnes-ont-ete-interpellees-7d16e80e-b8b0-11f1-8a73-5c5c9f666d13",
    both(
      "the only figure before the 28 September national turn: 21 interpellations by noon on Friday 25 September, announced by the Préfecture de Police, in connection with the Paris-area lycée mobilisations; the Créteil rectorat counted a “grosse dizaine” of new blockades, mainly in Seine-Saint-Denis and Val-de-Marne.",
      "le seul chiffre avant le tournant national du 28 septembre : 21 interpellations à midi le vendredi 25 septembre, annoncées par la préfecture de Police, au titre des mobilisations de lycées de l’agglomération parisienne ; le rectorat de Créteil comptait une « grosse dizaine » de nouveaux blocages, surtout en Seine-Saint-Denis et dans le Val-de-Marne.",
    ),
    "2026-09-25",
  ),

  src(
    "franceinfo-mvt-ampleur",
    "press",
    "Franceinfo — « Revendications locales, vidéos virales, soutien de LFI… Comment le blocage de quelques lycées s’est transformé en un mouvement d’ampleur »",
    "https://www.franceinfo.fr/societe/education/blocage-des-lycees/la-mobilisation-a-pris-une-ampleur-inattendue-comment-le-mouvement-de-blocage-des-lycees-s-est-propage-en-france_8216054.html",
    both(
      "the movement's chronology from the rentrée: first blockades in Brittany, Villeneuve-d'Ascq and Caen on 15 September, Créteil on 17 September, the LFI visit on 21 September, a dozen blocked lycées in the Créteil academy on 25 September, the USL call for 29 September, and the cumulative figures of 119 injured (85 students, 34 staff) and 1,065 arrests over Tuesday and Wednesday.",
      "la chronologie du mouvement dès la rentrée : premiers blocages en Bretagne, puis Villeneuve-d’Ascq et Caen le 15 septembre, Créteil le 17 septembre, la visite de LFI le 21 septembre, une dizaine de lycées bloqués dans l’académie de Créteil le 25 septembre, l’appel de l’USL pour le 29 septembre, et les cumulats de 119 blessés (85 élèves, 34 personnels) et 1 065 interpellations sur mardi et mercredi.",
    ),
    "2026-10-01",
  ),

  src(
    "rtbf-blocages-mineurs",
    "press",
    "RTBF — « Blocages, dégradations, arrestations de mineurs : que se passe-t-il dans les lycées en France ? »",
    "https://www.rtbf.be/article/blocages-degradations-arrestations-de-mineurs-que-se-passe-t-il-dans-les-lycees-en-france-11792600",
    both(
      "the enforcement narrative of the first fortnight: 21 arrests in the margins after a few days of blockades, 440 on 29 September mainly minors with two thirds in custody, 625 on 30 September, more than 100 students and staff injured, and the first IGPN referrals after police-firearm injuries.",
      "le récit de la répression des premières semaines : 21 interpellations en marge après quelques jours de blocages, 440 le 29 septembre principalement des mineurs aux deux tiers en garde à vue, 625 le 30 septembre, plus d’une centaine d’élèves et de personnels blessés, et les premières saisines de l’IGPN après des blessures par armes létales.",
    ),
    "2026-10-12",
  ),

  src(
    "lemonde-29sept-fonction-publique",
    "press",
    "Le Monde — « Grève du 29 septembre : 300 000-maths manifestations ont défilé en France pour demander plus de moyens dans la fonction publique, selon la CGT »",
    "https://www.lemonde.fr/societe/article/2026/09/29/greve-du-29-septembre-300-000-manifestants-ont-defile-en-france-pour-demander-plus-de-moyens-dans-la-fonction-publique-selon-la-cgt_6785560_3225.html",
    both(
      "the 29 September crowd: about 206,000 demonstrators nationwide per the Interior Ministry against the CGT's 300,000, 30,000 in Paris per the police prefecture (including 8,000 firefighters), across more than 170 demonstrations. These are the figures carried in the 29 September turnout cell, flagged “p” because they count the public-service cortège the lycée actions joined, not a student crowd.",
      "la foule du 29 septembre : environ 206 000IRRÉS manifestation selon le ministère de l’Intérieur contre 300 000 pour la CGT, 30 000 à Paris selon la préfecture de police (dont 8 000 pompiers), pour plus de 170 manifestations. Ce sont les chiffres portés dans la cellule de participation du 29 septembre, marquée « p » car ils dénombrent le cortège de la fonction publique rejoint par les actions lycée et non une foule étudiante.",
    ),
    "2026-09-29",
  ),

  src(
    "franceinfo-fonction-publique-29sept",
    "press",
    "Franceinfo — « Mobilisation dans la fonction publique : 206 000 manifestants selon le ministère de l’Intérieur, 300 000 pour la CGT »",
    "https://www.franceinfo.fr/economie/greve/mobilisation-dans-la-fonction-publique-206-000-manifestants-selon-le-ministere-de-l-interieur-300-000-pour-la-cgt_8215472.html",
    both(
      "the same 29 September figures with the Paris split (70,000 CGT / 30,000 ministry) and the strike rates: 9.64% of state civil servants, 5.68% territorial, 4.5% hospital, 13.71% of teachers.",
      "les mêmes chiffres du 29 septembre avec la répartition parisienne (70 000 CGT / 30 000 ministère) et les taux de grève : 9,64 % dans la fonction publique d’État, 5,68 % territoriale, 4,5 % hospitalière, 13,71 % des enseignants.",
    ),
    "2026-09-29",
  ),

  src(
    "ouestfrance-7sept-lerheu",
    "press",
    "Ouest-France — « Cours tardifs ou par correspondance, classes surchargées… ces lycéens bloquent leur établissement près de Rennes »",
    "https://www.ouest-france.fr/bretagne/le-rheu-35650/cours-tardifs-ou-par-correspondance-classes-surchargees-ces-lyceens-bloquent-leur-etablissement-pres-de-rennes-5cb2156e-aac0-11f1-9556-770e8387e7e9",
    both(
      "the movement's first mainland blockade: the lycée Théodore-Monod at Le Rheu, near Rennes, on Monday 7 September 2026, over late or correspondence classes and overcrowded classes — the origin point that precedes the 15 September window opening.",
      "le tout premier blocus en métropole : le lycée Théodore-Monod au Rheu, près de Rennes, le lundi 7 septembre 2026, sur les cours tardifs ou par correspondance et les classes surchargées — le point d’origine qui précède l’ouverture de la fenêtre au 15 septembre.",
    ),
    "2026-09-07",
  ),

  src(
    "actu-caen-15sept",
    "press",
    "Actu — « Un lycée bloqué par des élèves à Caen »",
    "https://actu.fr/normandie/caen_14118/un-lycee-bloque-par-des-eleves-a-caen-ils-denoncent-une-mauvaise-organisation-interne_64794136.html",
    both(
      "the 15 September blockade of the lycée Victor-Hugo in Caen over internal organisation — the first date inside the new window.",
      "le blocage du 15 septembre du lycée Victor-Hugo de Caen sur l’organisation interne — la première date à l’intérieur de la nouvelle fenêtre.",
    ),
    "2026-09-18",
  ),

  src(
    "actu-villeneuve-15sept",
    "press",
    "Actu — « Pourquoi déjà un blocage de l’université de Pont de Bois à Villeneuve-d’Ascq ? »",
    "https://actu.fr/hauts-de-france/villeneuve-d-ascq_59009/pourquoi-deja-un-blocage-de-luniversite-de-pont-de-bois_64791633.html",
    both(
      "the campus Pont de Bois blockade at Villeneuve-d'Ascq on Tuesday 15 September, with the lycée Queneau in the same town blocked the day before — the source of the one-day discrepancy between the two accounts of the Villeneuve-d'Ascq date.",
      "le blocage du campus Pont de Bois à Villeneuve-d’Ascq le mardi 15 septembre, le lycée Queneau de la même ville étant bloqué la veille — à l’origine de l’écart d’un jour entre les deux versions de la date de Villeneuve-d’Ascq.",
    ),
    "2026-09-15",
  ),

  src(
    "ouestfrance-infographie-2026",
    "press",
    "Ouest-France — « Infographie. Du 29 septembre au 29 octobre, comment la colère des lycéens est devenue une colère sociale »",
    "https://www.ouest-france.fr/societe/manifestation/infographie-du-29-septembre-au-29-octobre-comment-la-colere-des-lyceens-est-devenue-une-colere-sociale-0c2ca3ec-d37a-11f1-81f2-0d14b9f9c452",
    both(
      "the movement's own calendar, from the first act of manifestations and blockades on 29 September to 29 October — the spine the September rows are placed on.",
      "le calendrier du mouvement, du premier acte de manifestations et blocages le 29 septembre au 29 octobre — l’axe sur lequel sont posés les lignes de septembre.",
    ),
    "2026-10-29",
  ),

  src(
    "investigation-genz",
    "press",
    "Investigaction — « “Tasty crousti antifascisti” : Quand la Gen Z tente de faire nation »",
    "https://investigaction.net/tasty-crousti-antifascisti-quand-la-gen-z-tente-de-faire-nation/",
    both(
      "an independent dating of the movement's origin at Créteil on 17 September, the 21 September LFI visit, and the activist record of the repression that followed — mutilations by flashballs and grenades, custody humiliations, and the case of the Trappes killing.",
      "une datation indépendante de l’origine du mouvement à Créteil le 17 septembre, de la visite de LFI le 21 septembre, et le récit militant de la répression qui a suivi — mutilations par flashballs et grenades, humiliations en garde à vue, affaire de l’homicide à Trappes.",
    ),
    "2026-11-01",
  ),

  /* ------------------------------------- 2026 — turnout, arrests, injuries */
  src(
    "europe1-07nov",
    "press",
    "Europe 1 — « Manifestations du 7 novembre : 146 000 personnes ont défilé en France samedi, 360 interpellations »",
    "https://www.europe1.fr/societe/manifestations-du-7-novembre-146000-personnes-ont-defile-en-france-samedi-360-interpellations-selon-le-ministere-de-linterieur-1216046",
    both(
      "146,000 demonstrators and 360 arrests on 7 Nov — the figure the 7 Nov ministry bilan is read through.",
      "146 000 manifestants et 360 interpellations le 7 nov. — la lecture retenue du bilan ministériel du 7 nov.",
    ),
    "2026-11-07",
  ),
  src(
    "tf1info-07nov",
    "press",
    "TF1 Info — « Manifestations : 146 000 personnes en France samedi 7 novembre, au moins 360 interpellations »",
    "https://www.tf1info.fr/societe/manifestations-146-000-personnes-en-france-samedi-7-novembre-au-moins-360-interpellations-2474538.html",
    both(
      "independent confirmation of the 7 Nov pair.",
      "confirmation indépendante du couple de valeurs du 7 nov.",
    ),
    "2026-11-07",
  ),
  src(
    "france24-05nov",
    "press",
    "France 24 — live coverage of the 5 November national day",
    "https://www.france24.com/en/france/20261105-live-france-nationwide-strikes-living-costs",
    both(
      "the ministry’s 575,000 for 5 Nov, quoted in English.",
      "les 575 000 du ministère pour le 5 nov., cités en anglais.",
    ),
    "2026-11-05",
  ),
  src(
    "france24-06nov",
    "press",
    "France 24 — 70 000 policiers et gendarmes à nouveau mobilisés samedi",
    "https://www.france24.com/fr/france/20261106-manifestations-de-samedi-en-france-70-000-policiers-et-gendarmes-%C3%A0-nouveau-mobilis%C3%A9s",
    both(
      "the size of the 7 Nov policing operation, the input to the week-6 cost band.",
      "la taille du dispositif du 7 nov., entrée de la fourchette de coût de la semaine 6.",
    ),
    "2026-11-06",
  ),
  src(
    "franceinfo-05nov",
    "press",
    "franceinfo — direct du 5 novembre : plus de 250 actions annoncées dans toute la France",
    "https://www.franceinfo.fr/societe/manifestations/direct-greve-du-5-novembre-plus-de-250-actions-annoncees-dans-toute-la-france-selon-une-carte-de-la-ggt_8268827.html",
    both(
      "448 interpellations on 5 Nov, the arrest figure plotted for that day.",
      "448 interpellations le 5 nov., valeur tracée pour cette journée.",
    ),
    "2026-11-05",
  ),
  src(
    "franceinfo-24oct",
    "press",
    "franceinfo — « Près de 1 000 interpellations, deux blessés graves » : le bilan du 24 octobre",
    "https://www.franceinfo.fr/societe/manifestations/mobilisation-en-baisse-pres-de-1-000-interpellations-deux-blesses-graves-ce-qu-il-faut-retenir-de-cette-nouvelle-journee-de-manifestation-contre-la-vie-chere-partout-en-france_8252476.html",
    both(
      "24 Oct arrests and the two seriously injured protesters; also the evidence that turnout fell that day.",
      "les interpellations du 24 oct. et les deux manifestants grièvement blessés ; aussi la preuve d’une mobilisation en baisse ce jour-là.",
    ),
    "2026-10-24",
  ),
  src(
    "anadolu-05nov",
    "press",
    "Anadolu Agency (français) — 642 interpellations lors de la mobilisation du 5 novembre",
    "https://www.aa.com.tr/fr/france/france-642-interpellations-lors-de-la-mobilisation-du-5-novembre-une-plainte-annonc%C3%A9e-contre-nu%C3%B1ez/4114506",
    both(
      "the 642 figure that competes with 448 for 5 Nov; the higher bound is plotted as partial.",
      "le chiffre de 642 qui concurrence 448 pour le 5 nov. ; la borne haute est tracée comme partielle.",
    ),
    "2026-11-05",
  ),
  src(
    "yenisafak-05nov",
    "press",
    "Yeni Şafak (français) — 642 interpellations lors de la mobilisation du 5 novembre",
    "https://fr.yenisafak.com/actualites/642-interpellations-lors-de-la-mobilisation-du-5-novembre-61558",
    both(
      "corroborates Anadolu’s 642, which is why that bound is shown at all.",
      "corrobore les 642 d’Anadolu, raison pour laquelle cette borne est affichée.",
    ),
    "2026-11-05",
  ),
  src(
    "tf1info-05nov",
    "press",
    "TF1 Info — direct du 5 novembre : la France se prépare à un « jeudi noir »",
    "https://www.tf1info.fr/societe/en-direct-mobilisation-du-5-novembre-manifestations-et-greves-paris-marseille-nantes-la-france-se-prepare-a-un-jeudi-noir-2473952.html",
    both(
      "the shape of the 5 Nov day — 250+ actions, strikes in Paris, Marseille and Nantes.",
      "la physionomie du 5 nov. — plus de 250 actions, grèves à Paris, Marseille et Nantes.",
    ),
    "2026-11-05",
  ),
  src(
    "lefigaro-05nov",
    "press",
    "Le Figaro — « Manifestations du 5 novembre : 70 000 policiers et gendarmes mobilisés, déclare Nuñez »",
    "https://www.lefigaro.fr/flash-actu/manifestations-du-5-novembre-70-000-policiers-et-gendarmes-mobilises-declare-nunez-20261104",
    both(
      "announcement, on 4 Nov, of the 70,000-strong deployment for 5 Nov.",
      "annonce, le 4 nov., du dispositif de 70 000 agents pour le 5 nov.",
    ),
    "2026-11-04",
  ),
  src(
    "armees-05nov",
    "press",
    "armees.com — le dispositif de sécurité du 5 novembre 2026",
    "https://armees.com/manifestations-5-novembre-2026-dispositif-securite-70000-policiers-gendarmes/",
    both(
      "third confirmation of the 70,000 deployment.",
      "troisième confirmation du dispositif de 70 000 agents.",
    ),
    "2026-11-05",
  ),
  src(
    "leparisien-24oct-blesses",
    "press",
    "Le Parisien — « 267 membres des forces de l’ordre et 150 manifestants ont été blessés, annonce Laurent Nuñez »",
    "https://www.leparisien.fr/faits-divers/manifestations-du-samedi-24-octobre-267-membres-des-forces-de-lordre-et-150-manifestants-ont-ete-blesses-annonce-laurent-nunez-26-10-2026-MHSP3XA3QBEM7GR4JUZL77Z54I.php",
    both(
      "the only day in the window with both sides of the injury count published together.",
      "la seule journée de la fenêtre où les deux côtés du bilan de blessés sont publiés ensemble.",
    ),
    "2026-10-26",
  ),
  src(
    "ouest-france-angers",
    "press",
    "Ouest-France — manifestation du 7 novembre à Angers : huit blessés, onze interpellés",
    "https://www.ouest-france.fr/societe/manifestation/manifestation-du-7-novembre-a-angers-huit-blesses-onze-interpelles-un-commerce-et-quatre-banques-vandalises-b7d296cc-dada-11f1-a45f-49114163a350",
    both(
      "regional-only marker: 8 injured, 11 arrests, one shop and four banks vandalised — never extrapolated.",
      "marqueur régional : 8 blessés, 11 interpellations, un commerce et quatre banques vandalisés — jamais extrapolé.",
    ),
    "2026-11-07",
  ),
  src(
    "bulletindescommunes-07nov",
    "press",
    "Bulletin des communes — la mobilisation du 7 novembre, commune par commune",
    "https://bulletindescommunes.net/mobilisation-du-7-novembre-communes/",
    both(
      "the municipality-level outcome of 7 Nov, used to sanity-check the national total.",
      "le résultat communal du 7 nov., servant à recouper le total national.",
    ),
    "2026-11-07",
  ),
  src(
    "figaro-06nov-live",
    "blockades",
    "Le Figaro — direct du 6 novembre : 41 lycées bloqués, de nouvelles actions attendues samedi",
    "https://www.lefigaro.fr/actualite-france/en-direct-colere-sociale-apres-la-forte-mobilisation-de-jeudi-de-nouvelles-actions-attendues-des-samedi-20261106",
    both(
      "41 lycées still blocked the day after the 5 Nov peak — the tail of the school movement.",
      "41 lycées encore bloqués au lendemain du pic du 5 nov. — la queue du mouvementruc.",
    ),
    "2026-11-06",
  ),
  src(
    "actuforces-17oct",
    "press",
    "Actu Forces de l’Ordre — plus de 10 000 policiers et gendarmes mobilisés à Paris le 17 octobre",
    "https://actuforcesdelordre.fr/2026/10/17/10000-policiers-gendarmes-mobilises-paris-manifestations/",
    both(
      "the Paris deployment on 17 Oct, the low end of the policing-cost band for that day.",
      "le dispositif parisien du 17 oct., borne basse de la fourchette de coût pour cette journée.",
    ),
    "2026-10-17",
  ),
  src(
    "actuforces-beauvau",
    "press",
    "Actu Forces de l’Ordre — Beauvau : 305 blessés, 1 949 interpellations",
    "https://actuforcesdelordre.fr/2026/10/01/beauvau-mobilise-forces-mobiles-305-blesses-1949-interpellations-lycees/",
    both(
      "the cumulative police-side tally of the lycée wave (305 injured, 1,949 arrests).",
      "le cumul côté forces de l’ordre pour la vague lycéenne (305 blessés, 1 949 interpellations).",
    ),
    "2026-10-01",
  ),
  src(
    "larep-17oct",
    "press",
    "La République du Centre — la journée du 17 octobre est-elle vraiment inédite ?",
    "https://www.larep.fr/paris-75000/faits-divers/arrestations-mobilisations-la-journee-du-17-octobre-est-elle-vraiment-inedite_15066265/",
    both(
      "the « unprecedented » claim tested against earlier mobilisations; it is why 17 Oct is not called a record.",
      "le caractère « inédit » mis à l’épreuve des mobilisations antérieures ; d’où l’absence de record pour le 17 oct.",
    ),
    "2026-10-19",
  ),
  src(
    "laprovence-17oct",
    "press",
    "La Provence — violences du 17 octobre : le dispositif policier inférieur à celui de mobilisations similaires",
    "https://www.laprovence.com/article/faits-divers-justice/5795089910157914/violences-du-17-octobre-le-dispositif-policier-inferieur-a-celui-observe-dans-des-mobilisations-similaires",
    both(
      "the numerical claim behind the « smaller dispositif » reading.",
      "l’argument chiffré derrière la lecture d’un dispositif plus faible.",
    ),
    "2026-10-19",
  ),
  src(
    "franceinfo-dispositif-17oct",
    "press",
    "franceinfo — le dispositif de maintien de l’ordre du 17 octobre était-il moins important ?",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/le-dispositif-de-maintien-de-l-ordre-deploye-le-17-octobre-etait-il-moins-important-que-lors-des-dernieres-grandes-manifestations_8243998.html",
    both(
      "the fact-check that sets the policing-cost comparison against previous movements.",
      "la vérification qui situe la comparaison de coût face aux mouvements précédents.",
    ),
    "2026-10-21",
  ),
  src(
    "franceinfo-nunez-moyens",
    "press",
    "franceinfo — Laurent Nuñez revient sur les moyens policiers déployés après le 17 octobre",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/apres-les-mobilisations-du-17-octobre-laurent-nunez-revient-sur-les-moyens-policiers-deployes_8266529.html",
    both(
      "the minister’s own account of the deployment, which contradicts the press reading.",
      "la version du ministre sur le dispositif, qui contredit la lecture de la presse.",
    ),
    "2026-11-03",
  ),
  src(
    "reporterre-street-medics",
    "press",
    "Reporterre — les street-medics face à une répression de plus en plus féroce",
    "https://reporterre.net/Les-street-medics-face-a-une-repression-de-plus-en-plus-feroce",
    both(
      "why no weekly protester-injury series exists: the first-aid volunteers are themselves policed.",
      "pourquoi aucune série hebdomadaire de blessés n’existe : les secouristes sont eux-mêmes visés.",
    ),
    "2026-10-26",
    "2026-10-27",
  ),
  src(
    "sudouest-street-medics",
    "press",
    "Sud Ouest — à Bordeaux, les secouristes de rue en première ligne",
    "https://www.sudouest.fr/gironde/bordeaux/mobilisation-sociale-a-bordeaux-c-est-le-meilleur-moyen-de-militer-au-milieu-des-detonations-et-des-lacrymogenes-les-secouristes-de-rue-en-premiere-ligne-du-secours-31404007.php",
    both(
      "local colour on injury recording, and the Bordeaux figure used as a regional check. The page publishes no date of its own, so none is shown here.",
      "le reportage local sur le relevé des blessés, et le chiffre bordelais utilisé comme contrôle régional. La page ne publie aucune date propre, aucune n’est donc affichée ici.",
    ),
  ),
  src(
    "mutins-pangee",
    "press",
    "Les Mutins de Pangée (Facebook) — « 10 éborgnés, 7 amputés, 52 autres blessés graves »",
    "https://www.facebook.com/LesMutinsDePangee/posts/-le-terrible-bilan-de-la-r%C3%A9pression10-%C3%A9borgn%C3%A9s-7-amput%C3%A9s-52-autres-bless%C3%A9s-grave/1566486208856655/",
    both(
      "the 79-victim figure before Le Canard enchaîné attributed it to Thines; social-media origin, treated as a floor only.",
      "les 79 victimes avant que Le Canard ne l’attribue à Thines ; origine réseaux sociaux, traitée comme plancher seulement.",
    ),
    "2026-11-09",
  ),
  src(
    "mediapart-crs-blesses",
    "press",
    "Mediapart — « CRS blessés : le fichier interne qui dégonfle le bilan du ministre »",
    "https://www.mediapart.fr/journal/france/131126/crs-blesses-le-fichier-interne-qui-degonfle-le-bilan-du-ministre",
    both(
      "the minister's running total of injured security personnel, which the ministry's daily figures do not contain: 761 on 8 October, 937 on 14 October and 1,580 on 5 November — the last being the movement's total, and the key that identifies the 17 October figure (997, then 1,144 on consolidation) as a cumulative level rather than a daily count. Also the internal CRS file: 1,233 agents declared injured in October, 1,167 of them classified as light injuries (94.6%).",
      "le cumul des blessés parmi les forces selon le ministre, que les chiffres quotidiens du ministère ne contiennent pas : 761 le 8 octobre, 937 le 14 octobre et 1 580 le 5 novembre — le dernier étant le total du mouvement, et la clef qui montre que le chiffre du 17 octobre (997, puis 1 144 après consolidation) est un cumul et non un compte du jour. Aussi le fichier interne des CRS : 1 233 agents déclarés blessés en octobre, dont 1 167 classés « légers » (94,6 %).",
    ),
    "2026-11-13",
  ),
  src(
    "contre-attaque-blessures",
    "press",
    "Contre-Attaque — « Leurs blessures et les nôtres : l’intox qui sert à justifier des crimes d’État »",
    "https://contre-attaque.net/2026/11/13/leurs-blessures-et-les-notres-lintox-qui-sert-a-justifier-des-crimes-detat/",
    both(
      "the polemical reading of the same two figures — the ministry's 1,580 and the CRS file's 94.6% of light injuries — with the case files it sets against the total: injuries described as accidental (two officers burnt in a patrol car at Givors by their own grenade, 10 October) or minor (a CRS with a bruised wrist from closing his vehicle door). Read as a claim about the composition of the total, not as a source for the total itself.",
      "la lecture polémique des deux mêmes chiffres — les 1 580 du ministère et les 94,6 % de « petits bobos » du fichier des CRS — avec les cas qu’elle oppose au total : blessures accidentelles (deux policiers brûlés dans leur voiture de patrouille à Givors par leur propre grenade, le 10 octobre) ou bénignes (un CRS avec le poignet contusionné en fermant la portière de son véhicule). À lire comme une thèse sur la composition du total, non comme une source du total.",
    ),
    "2026-11-13",
  ),

  /* ------------------------------------------ 2026 — damage and cost */
  src(
    "ifrap-2026",
    "cost",
    "Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »",
    "https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros",
    both(
      "the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.",
      "la fourchette de 247 à 872 M€ de dommages pour les 17–18 oct. : ~910 M€ de dommages matériels et ~190 M€ de chiffre d’affaires perdu dans l’hypothèse haute, dont 666 M€ pour le commerce de détail.",
    ),
    "2026-10-21",
  ),
  src(
    "monde-cci-2026",
    "cost",
    "Le Monde — «Plus de 2 500 commerces dégradés », d’après CCI France",
    "https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html",
    both(
      "CCI France’s shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.",
      "les décomptes de commerces de CCI France : 2 488 touchés le 17 oct., dont 1 161 pillés, saccagés ou incendiés.",
    ),
    "2026-10-27",
  ),
  src(
    "franceinfo-cci-2026",
    "cost",
    "franceinfo — « Plus de 2 500 magasins touchés »",
    "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html",
    both(
      "the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.",
      "l’incrément du 24 oct. (50 commerces, 2 538 au total) et la chute de 80 % du chiffre d’affaires en centre-ville.",
    ),
    "2026-10-27",
  ),
  src(
    "bfmtv-cci-2026",
    "cost",
    "BFMTV — CCI France, 20 commerces vandalisés le 31 octobre",
    "https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html",
    both(
      "why week 6 carries no damage figure: the count collapses after 24 Oct.",
      "pourquoi la semaine 6 ne porte aucun chiffre de dommages : le décompte s’effondre après le 24 oct.",
    ),
    "2026-11-01",
  ),
  src(
    "ladepeche-cci-31oct",
    "cost",
    "La Dépêche — 20 commerces dégradés ce samedi, contre 2 488 il y a deux semaines",
    "https://www.ladepeche.fr/2026/11/01/manifestations-du-31-octobre-20-commerces-degrades-ce-samedi-selon-cci-france-il-y-en-avait-2-488-il-y-a-deux-semaines-13630867.html",
    both(
      "the 31 Oct figure set against 17 Oct, the cleanest evidence of the movement’s tapering.",
      "le chiffre du 31 oct. face au 17 oct., preuve la plus nette de l’essoufflement.",
    ),
    "2026-11-01",
  ),
  src(
    "figaro-cost-weekend",
    "cost",
    "Le Figaro — « Le coût exorbitant d’un week-end d’émeutes pour les commerces et les collectivités »",
    "https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020",
    both(
      "cross-check on the damage order of magnitude.",
      "contre-vérification de l’ordre de grandeur des dommages.",
    ),
    "2026-10-20",
  ),
  src(
    "figaro-damage-2500",
    "cost",
    "Le Figaro — plus de 2 500 commerces dégradés en France",
    "https://www.lefigaro.fr/actualite-france/violences-urbaines-plus-de-2-500-commerces-degrades-en-france-20261027",
    both(
      "second, non-CCI route to the 2,500-shop figure and the €1bn headline.",
      "seconde voie, hors CCI, vers les 2 500 commerces et le titre du milliard.",
    ),
    "2026-10-27",
  ),
  src(
    "leparisien-idf-1m",
    "cost",
    "Le Parisien — 1 million d’euros de dégâts, 200 lycées perturbés : le bilan des blocages en Île-de-France",
    "https://www.leparisien.fr/societe/1-million-deuros-de-degats-200-lycees-perturbes-le-bilan-des-blocus-de-lycees-en-ile-de-france-01-10-2026-YACA325BUBAD5K7L5B6DWBDODY.php",
    both(
      "the 1 Oct lycée-blockade baseline: €1M and 200 establishments in Île-de-France.",
      "la base du 1er oct. pour les blocages de lycées : 1 M€ et 200 établissements en Île-de-France.",
    ),
    "2026-10-01",
  ),
  src(
    "leparisien-millions",
    "cost",
    "Le Parisien — blocages des lycées : plusieurs millions d’euros de dégâts déjà estimés en France",
    "https://www.leparisien.fr/societe/blocages-des-lycees-plusieurs-millions-deuros-de-degats-materiels-deja-estimes-en-france-02-10-2026-ICDKIV5SEFEA7NXURY45JLAZRA.php",
    both(
      "the first national order of magnitude for the school movement, before 17 Oct.",
      "le premier ordre de grandeur national pour le mouvement defecé, avant le 17 oct.",
    ),
    "2026-10-02",
  ),
  src(
    "leparisien-1500shops",
    "cost",
    "Le Parisien — violences du 17 octobre : 1 500 magasins touchés, plusieurs centaines de millions d’euros de dégâts",
    "https://www.leparisien.fr/economie/violences-du-17-octobre-1-500-magasins-touches-en-france-plusieurs-centaines-de-millions-deuros-de-degats-18-10-2026-PAAKNFW6ZVCCJMLJ7LTOAWLKOI.php",
    both(
      "the 1,500-shop figure published the day after, later revised upward to 2,488.",
      "les 1 500 commerces publiés au lendemain, révisés ensuite à 2 488.",
    ),
    "2026-10-18",
  ),
  src(
    "leparisien-looting",
    "cost",
    "Le Parisien — Paris : des heurts et des magasins pillés dans la nuit de dimanche à lundi",
    "https://www.leparisien.fr/paris-75/paris-des-heurts-et-des-magasins-pilles-encore-tard-dans-la-nuit-de-dimanche-a-lundi-19-10-2026-OUUITGPFNRD47NWIU5VVWP2IKY.php",
    both(
      "the 18–19 Oct looting, which is why the 17–18 Oct damage window closes on the Monday night.",
      "les pillages des 18–19 oct., d’où la clôture de la fenêtre de dommages le lundi soir.",
    ),
    "2026-10-19",
  ),
  src(
    "leparisien-451-shops",
    "cost",
    "Le Parisien — 451 commerces vandalises : la carte des établissements parisiens pillés et dégradés",
    "https://www.leparisien.fr/paris-75/451-commerces-vandalises-la-carte-des-etablissements-parisiens-pilles-et-degrades-les-17-et-18-octobre-22-10-2026-SBWJHPIKZ5DMZFSEWE4IYYCAIY.php",
    both(
      "the Paris-only shop count (451), marked regional in the table.",
      "le décompte strictement parisien (451), marqué régional dans le tableau.",
    ),
    "2026-10-22",
  ),
  src(
    "mesinfos-idf",
    "cost",
    "mesinfos.fr — blocages de lycées : 8,5 millions d’euros de dégâts en Île-de-France",
    "https://mesinfos.fr/ile-de-france/blocus-lyceens-85-millions-d-euros-de-degats-en-ile-de-france-341003.html",
    both(
      "the highest Île-de-France figure for the lycée blockades — the upper bound in the table.",
      "le chiffre francilien le plus élevé pour les blocages de lycées — borne haute du tableau.",
    ),
    "2026-10-13",
  ),
  src(
    "ici-lille",
    "cost",
    "ici.fr (Nord) — mobilisation du 17 octobre : premières tensions à Lille",
    "https://www.ici.fr/hauts-de-france/nord-59/lille/mobilisation-du-17-octobre-des-premieres-tensions-a-lille-entre-forces-de-l-ordre-et-manifestants-7548967",
    both(
      "the Lille McDonald’s fire, one of the few individually costed damage items.",
      "l’incendie du McDonald’s à Lille, l’un des rares dommages chiffrés individuellement.",
    ),
    "2026-10-17",
  ),
  src(
    "cnews-14oct",
    "cost",
    "CNEWS — blocus des lycées : agence immobilière attaquée, feux de poubelle, le bilan",
    "https://www.cnews.fr/videos/france/2026-10-14/blocus-des-lycees-agence-immobiliere-attaquee-feux-de-poubelle-le-bilan",
    both(
      "the 14 Oct incidents, the first damage report of the school movement.",
      "les incidents du 14 oct., premier bilan de dommages du mouvementlymcéen.",
    ),
    "2026-10-14",
  ),
  src(
    "actu-450-shops",
    "cost",
    "actu.fr — pillages et dégradations en marge du 17 octobre : 450 commerces sinistrés à Paris",
    "https://actu.fr/ile-de-france/paris_75056/pillages-et-degradations-en-marge-du-17-octobre-450-commerces-sinistres-a-paris-quels-sont-les-plus-touches_64960656.html",
    both(
      "the 450/451 Paris shops with the sector breakdown.",
      "les 450/451 commerces parisiens avec la ventilation par secteur.",
    ),
    "2026-10-22",
  ),
  src(
    "of-facture",
    "cost",
    "Ouest-France — violences du 17 octobre : des dégâts estimés à des centaines de millions d’euros, qui va payer ?",
    "https://www.ouest-france.fr/societe/manifestation/violences-du-17-octobre-des-degats-estimes-a-des-centaines-de-millions-deuros-qui-va-payer-la-facture-5e077b82-cbb5-11f1-b8bc-a46147b584ed",
    both(
      "who bears the cost — communes, insurers, the state — the basis for the footnote on the damage columns.",
      "qui supporte le coût — communes, assureurs, État — base de la note de bas de page des colonnes dommages.",
    ),
    "2026-10-20",
  ),
  src(
    "of-assurance",
    "cost",
    "Ouest-France — 17 octobre : le chiffrage précis des dégâts attendra la fin du délai de 30 jours accordé par les assureurs",
    "https://www.ouest-france.fr/economie/assurance/17-octobre-le-chiffrage-precis-des-degats-devra-attendre-la-fin-du-delai-de-30-jours-accorde-par-les-assureurs-0da74e46-cdff-11f1-bf87-17eca79cb13c",
    both(
      "why every damage figure here is provisional: the insurers’ 30-day claim window had not closed at the time of writing.",
      "pourquoi tout chiffre de dommages est provisoire : le délai de 30 jours des assureurs n’était pas écoulé à la rédaction.",
    ),
    "2026-10-23",
  ),
  src(
    "decryptargent",
    "cost",
    "Décryptargent — 17 octobre : le premier bilan économique",
    "https://decryptargent.fr/finances-personnelles/17-octobre-bilan-economique-premiers-chiffres/",
    both(
      "the first, earliest economic assessment of 17 Oct, superseded by IFRAP and CCI France.",
      "la première estimation économique du 17 oct., supplantée par l’IFRAP et CCI France.",
    ),
    "2026-10-17",
    "2026-10-20",
  ),
  src(
    "capital-policing",
    "cost",
    "Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »",
    "https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269",
    both(
      "the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.",
      "les références de 15 000–30 000 € par compagnie de CRS et par jour, et de 3,4 M€ pour 3 000 gendarmes, derrière la fourchette de coût du maintien de l’ordre ; aussi les 1 435 interpellations et 53 policiers blessés du 24 oct.",
    ),
    "2026-10-28",
  ),

  /* ------------------------------------------------------- 2026 — overseas */
  src(
    "la1ere-lyceens",
    "overseas",
    "Outre-mer La 1ère — ce que l’on sait du mouvement des lycéens, de la Réunion à la Guyane",
    "https://la1ere.franceinfo.fr/ce-que-l-on-sait-du-mouvement-des-lyceens-de-la-reunion-a-la-guyane-en-passant-par-la-guyane-mayotte-et-la-martinique-1744191.html",
    both(
      "the geography of the lycéen movement across Réunion, Guyane, Mayotte and Martinique — the overseas half of the protest count.",
      "la géographie du mouvement Renda et en Guyane, à Mayotte et en Martinique — la moitié ultramarine du décompte.",
    ),
    "2026-10-02",
  ),
  src(
    "la1ere-territoires",
    "overseas",
    "Outre-mer La 1ère — la Guadeloupe, la Martinique et la Réunion, territoires les plus mobilisés depuis début octobre",
    "https://la1ere.franceinfo.fr/colere-dans-les-lycees-et-contre-la-vie-chere-la-guadeloupe-la-martinique-et-la-reunion-les-territoires-les-plus-mobilises-dans-les-outre-mer-depuis-debut-octobre-1751730.html",
    both(
      "which three territories carry almost all overseas activity, and the ranking used in the split.",
      "les trois territoires qui portent presque toute l’activité ultramarine, et le classement retenu pour la ventilation.",
    ),
    "2026-10-26",
  ),
  src(
    "la1ere-gign",
    "overseas",
    "Outre-mer La 1ère — intervention du GIGN, manifestations et premières condamnations : le climat social reste tendu",
    "https://la1ere.franceinfo.fr/intervention-du-gign-manifestations-et-premieres-condamnations-outre-mer-le-climat-social-reste-tendu-1750008.html",
    both(
      "the enforcement side overseas, which the ministry bilan never covers.",
      "le volet répressif ultramarin, que le bilan ministériel ne couvre jamais.",
    ),
    "2026-10-20",
  ),
  src(
    "la1ere-martinique-hot",
    "overseas",
    "Outre-mer La 1ère — Martinique et Caraïbe : les sujets chauds",
    "https://la1ere.franceinfo.fr/martinique/hot-topics-from-martinique-and-the-caribbean-1742126.html",
    both(
      "the Martinique strand, where the cost-of-living movement overlaps a pre-existing mobilisation.",
      "le volet martiniquais, où le mouvement contre la vie chère recouvre une mobilisation antérieure.",
    ),
    "2026-09-26",
  ),
  src(
    "la1ere-reunion-saintpierre",
    "overseas",
    "Outre-mer La 1ère — une centaine de manifestants à Saint-Pierre et un barrage filtrant dans le nord",
    "https://la1ere.franceinfo.fr/reunion/mobilisation-sociale-une-centaine-de-manifestants-a-saint-pierre-et-un-barrage-filtrant-dans-le-nord-on-fait-le-point-1753413.html",
    both(
      "a Réunion day detail: ~100 at Saint-Pierre plus a filtering roadblock — regional-only, never extrapolated.",
      "un détail journalier réunionnais : ~100 à Saint-Pierre et un barrage filtrant — régional seulement, jamais extrapolé.",
    ),
    "2026-10-31",
  ),
  src(
    "la1ere-archives-03nov",
    "overseas",
    "Outre-mer La 1ère — archives du 3 novembre 2026",
    "https://la1ere.franceinfo.fr/archives/2026/03-novembre-2026/",
    both(
      "the day-archive route used where no standalone article existed (Guyane intersyndicale call).",
      "la voie des archives quotidiennes là où aucun article autonome n’existait (appel de l’intersyndicale guyanaise).",
    ),
    "2026-11-03",
  ),

  /* --------------------------------------------------- 2026 — reference */
  src(
    "wiki-automne-2026",
    "ref2026",
    "Wikipédia (français) — Mouvement social d’automne 2026 en France",
    "https://fr.wikipedia.org/wiki/Mouvement_social_d%27automne_2026_en_France",
    both(
      "the overall movement chronology and the list of national call days.",
      "la chronologie d’ensemble du mouvement et la liste des journées d’appel nationales.",
    ),
    "2026-11-11",
  ),
  src(
    "wiki-civil-unrest-en",
    "ref2026",
    "Wikipedia (English) — 2026 French civil unrest",
    "https://en.wikipedia.org/wiki/2026_French_civil_unrest",
    both(
      "the English-language summary, checked against the French pages for divergences in the injury counts.",
      "la synthèse anglophone, recoupée avec les pages françaises pour les écarts de blessés.",
    ),
    "2026-11-13",
  ),
  src(
    "mavigilance-manifestation",
    "ref2026",
    "Ma vigilance — manifestationائحة : rassemblements et cortèges",
    "https://mavigilance.fr/themes/manifestation",
    both(
      "protest-level aggregation by theme, used for the count of actions rather than of participants.",
      "agrégation par thème, utilisée pour le nombre d’actions plutôt que de participants.",
    ),
    "2026-11-13",
  ),
  src(
    "mavigilance-lyceens",
    "ref2026",
    "Ma vigilance — mouvement lycée : dates et appels",
    "https://mavigilance.fr/mouvements/lyceens",
    both(
      "the call calendar behind the « protest taking place » column on the school-movement days.",
      "le calendrier des appels derrière la colonne « manifestations » des journées_shader.",
    ),
    "2026-11-13",
  ),

  /* -------------------------------------------------------------- May 1968 */
  src(
    "wiki-mai68-fr",
    "mai68",
    "Mai 68",
    "https://fr.wikipedia.org/wiki/Mai_68",
    both(
      "1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.",
      "les foules du 1er mai (25 000 préfecture / 100 000 CGT) et du 13 mai (230 000 préfecture / 171 000 ORTF / 1 000 000 syndicats) ; les 469 interpellations des 10–11 mai et les 1 000 et plus du 25 mai.",
    ),
    "2026-10-31",
  ),
  src(
    "wiki-mai68-en",
    "mai68",
    "May 68 (English Wikipedia)",
    "https://en.wikipedia.org/wiki/May_68",
    both(
      "the 887 injured figure, which appears only in this article’s infobox and is flagged accordingly — no French count was published.",
      "le chiffre de 887 blessés, présent uniquement dans l’infobox de cet article et signalé comme tel — aucun décompte français n’a été publié.",
    ),
    "2026-11-07",
  ),
  src(
    "nouvelobs-1mai-68",
    "mai68",
    "Le Nouvel Obs (Le Quotidien de 1968) — « Cent mille personnes de République à Bastille »",
    "https://www.nouvelobs.com/societe/le-quotidien-de-1968/20080424.OBS1184/cent-mille-personnes-de-republique-a-bastille.html",
    both(
      "the 1 May 1968 cortège described day-of, the origin of the 100,000 union figure.",
      "le cortège du 1er mai 1968 raconté le jour même, origine du chiffre syndical de 100 000.",
    ),
    "2008-04-24",
  ),
  src(
    "publicsenat-1mai",
    "mai68",
    "Public Sénat — « Des 1er mai souvent très politiques »",
    "https://www.publicsenat.fr/actualites/politique/des-1er-mai-souvent-tres-politiques-59701",
    both(
      "context for reading 1 May turnouts across episodes, including the 1968 and 2023 comparison.",
      "le contexte de lecture des foules du 1er mai entre épisodes, dont la comparaison 1968 / 2023.",
    ),
    "2017-05-01",
  ),
  src(
    "wiki-chrono-68",
    "mai68",
    "Wikipédia (français) — Chronologie des événements de mai-juin 1968",
    "https://fr.wikipedia.org/wiki/Chronologie_des_%C3%A9v%C3%A9nements_de_mai_-_juin_1968",
    both(
      "the day-by-day sequence that fixes which days enter the C′ weekly series.",
      "la séquence jour par jour qui détermine les journées retenues dans la série hebdomadaire de C′.",
    ),
    "2026-10-20",
  ),
  src(
    "wiki-rassemblements",
    "mai68",
    "Wikipédia (français) — Liste des rassemblements les plus importants en France",
    "https://fr.wikipedia.org/wiki/Liste_des_rassemblements_les_plus_importants_en_France",
    both(
      "the cross-episode leaderboard used to decide which movements belong in the comparison at all.",
      "le classement inter-épisodes servant à décider quels mouvements entrent dans la comparaison.",
    ),
    "2026-11-07",
  ),

  /* ------------------------------------------------------------------- CPE */
  src(
    "wiki-cpe",
    "cpe",
    "Contrat première embauche",
    "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
    both(
      "the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.",
      "la série de foules du CPE (7 févr., 7 mars, 18 mars, 23 mars, 28 mars, 4 avr.) et les décomptes répressifs strictement parisiens des 16–18 mars.",
    ),
    "2026-08-23",
  ),
  src(
    "nouvelobs-cpe-chrono",
    "cpe",
    "Le Nouvel Obs — « Crise du CPE : chronologie »",
    "https://www.nouvelobs.com/societe/social/20060326.OBS1858/crise-du-cpe-chronologie.html",
    both(
      "the full chronology, including the 10 Apr withdrawal that ends the series.",
      "la chronologie complète, dont le retrait du 10 avr. qui clôt la série.",
    ),
    "2006-03-26",
  ),
  src(
    "nouvelobs-cpe-mars",
    "cpe",
    "Le Nouvel Obs — « CPE : les événements du 16 au 18 mars »",
    "https://www.nouvelobs.com/societe/social/20060321.OBS1191/cpe-les-evenements-du-16-au-18-mars.html",
    both(
      "the three peak days described day-of, used to date the enforcement counts.",
      "les trois journées de pointe racontées au jour le jour, servant à dater les décomptes répressifs.",
    ),
    "2006-03-21",
  ),
  src(
    "lemonde-16mars-2006",
    "cpe",
    "Le Monde — « Des centaines de milliers de jeunes ont défilé » (16 mars 2006)",
    "https://www.lemonde.fr/international/article/2006/03/16/des-centaines-de-milliers-de-jeunes-ont-defile_751311_3210.html",
    both(
      "the 16 Mar turnout, the first day of the peak.",
      "la foule du 16 mars, première journée du pic.",
    ),
    "2006-03-16",
  ),
  src(
    "lemonde-17mars-2006",
    "cpe",
    "Le Monde — « Des lycéens en nombre dans les défilés anti-CPE » (17 mars 2006)",
    "https://www.lemonde.fr/la-crise-au-proche-orient/article/2006/03/17/des-lyceens-en-nombre-dans-les-defiles-anti-cpe_751768_734511.html",
    both(
      "17 Mar, the day the lycéens rather than the students carry the movement.",
      "le 17 mars, jour où les lycéens plutôt que les étudiants portent le mouvement.",
    ),
    "2006-03-17",
  ),
  src(
    "lemonde-18mars-2006",
    "cpe",
    "Le Monde — « Des défilés dans toutes les villes » (18 mars 2006)",
    "https://www.lemonde.fr/international/article/2006/03/18/des-defiles-dans-toutes-les-villes_752040_3210.html",
    both(
      "18 Mar and the nationwide spread, which is why the CPE week is not Paris-weighted.",
      "le 18 mars et la diffusion nationale, d’où une semaine CPE non pondérée par Paris.",
    ),
    "2006-03-18",
  ),
  src(
    "aljazeera-19mars-2006",
    "cpe",
    "Al Jazeera — « French protesters issue job ultimatum » (19 March 2006)",
    "https://www.aljazeera.com/news/2006/3/19/french-protesters-issue-job-ultimatum",
    both(
      "the English-language account of the 18–19 Mar ultimatum, used to confirm the sequencing.",
      "le récit anglophone de l’ultimatum des 18–19 mars, servant à confirmer l’enchaînement.",
    ),
    "2006-03-19",
  ),

  /* --------------------------------------------------------- Gilets jaunes */
  src(
    "wikinews-8dec2018",
    "gj",
    "Wikinews (français) — Gilets jaunes : samedi 8 décembre 2018",
    "https://fr.wikinews.org/wiki/Gilets_jaunes_:_samedi_8_d%C3%A9cembre_2018",
    both(
      "Act IV day-of reporting: the 8 Dec turnout and the 1,700+ arrests.",
      "le compte rendu de l’acte IV : foule du 8 déc. et plus de 1 700 interpellations.",
    ),
    "2018-12-08",
  ),
  src(
    "of-gj-chiffres",
    "gj",
    "Ouest-France — « Gilets jaunes : comment évolue la mobilisation ? Tous les chiffres »",
    "https://www.ouest-france.fr/societe/gilets-jaunes/gilets-jaunes-comment-evolue-la-mobilisation-tous-les-chiffres-6147118",
    both(
      "the running ministry-vs-union turnout table, used as the primary series and cross-checked against the Wikipedia acts.",
      "le tableau courant ministère / syndicats, utilisé comme série principale et recoupé avec les actes de Wikipédia.",
    ),
    "2018-12-23",
  ),
  src(
    "bbc-gj",
    "gj",
    "BBC News — yellow-vest protests",
    "https://www.bbc.com/news/world-europe-46577598",
    both(
      "the English narrative and the casualty figures quoted at the time.",
      "le récit anglophone et les chiffres de blessés cités à l’époque.",
    ),
    "2018-12-15",
  ),
  src(
    "monde-diplo-gj",
    "gj",
    "Le Monde diplomatique — chronologie du mouvement des Gilets jaunes",
    "https://www.monde-diplomatique.fr/mav/168/PIRONET/61011",
    both(
      "an independent chronology, used to check the act numbering (the press and the state do not agree on it). Published as issue #168, December 2019 – January 2020; the issue date is shown here.",
      "une chronologie indépendante, servant à vérifier la numérotation des actes (presse et État ne s’accordent pas). Publiée dans le numéro 168, décembre 2019 – janvier 2020 ; la date du numéro est affichée ici.",
    ),
    "2019-12-01",
  ),
  src(
    "rfi-gj",
    "gj",
    "RFI — Gilets jaunes : retour sur neuf actes de contestation",
    "https://www.rfi.fr/fr/france/20190118-gilets-jaunes-retour-neuf-actes-contestation-rue-interpellations",
    both(
      "the first nine acts condensed, with arrest figures — the only compact source for acts I–IX enforcement.",
      "les neuf premiers actes en résumé, avec interpellations — seule source compacte pour la répression des actes I à IX.",
    ),
    "2019-01-18",
  ),

  /* -------------------------------------------------- Nahel Merzouk, 2023 */
  src(
    "wiki-nahel",
    "nahel",
    "Mort de Nahel Merzouk",
    "https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk",
    both(
      "the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.",
      "les 3 354 interpellations et 722 policiers blessés du 27 juin au 2 juill. 2023, et les 108 de la semaine suivante.",
    ),
    "2026-11-13",
  ),
  src(
    "wiki-nahel-en",
    "nahel",
    "Nahel Merzouk riots (English Wikipedia)",
    "https://en.wikipedia.org/wiki/Nahel_Merzouk_riots",
    both(
      "the English summary and its damage estimate, used only as a cross-check.",
      "la synthèse anglophone et son estimation de dommages, utilisées seulement en recoupement.",
    ),
    "2026-10-18",
  ),
  src(
    "mediapart-marche-blanche",
    "nahel",
    "Mediapart — « La marche blanche pour Nahel, un cri de révolte plutôt qu’une minute de silence »",
    "https://www.mediapart.fr/journal/france/290623/la-marche-blanche-pour-nahel-un-cri-de-revolte-plutot-qu-une-minute-de-silence",
    both(
      "the 29 Jun 2023 silent march, the only 2023 day with a participant count from a non-police source.",
      "la marche blanche du 29 juin 2023, seule journée de 2023 dotée d’un décompte non policier.",
    ),
    "2023-06-29",
  ),
  src(
    "rfi-29juin-2023",
    "nahel",
    "RFI — le point sur la mort de Nahel (29 juin 2023)",
    "https://www.rfi.fr/fr/france/20230629-le-point-sur-la-mort-de-nahel-le-procureur-requiert-le-placement-en-d%C3%A9tention-provisoire-du-policier",
    both(
      "the legal chronology of 29 Jun, used to date the start of the riot series.",
      "la chronologie judiciaire du 29 juin, servant à dater le début de la série d’émeutes.",
    ),
    "2023-06-29",
  ),
  src(
    "of-4e-nuit",
    "nahel",
    "Ouest-France — mort de Nahel : une quatrième nuit d’émeutes, d’une intensité moindre",
    "https://www.ouest-france.fr/faits-divers/emeutes-urbaines/mort-de-nahel-une-quatrieme-nuit-demeutes-mais-des-violences-dune-intensite-moindre-5f28377d-edb2-4189-b320-5fa379186858",
    both(
      "the tapering after the third night, which is why the 2023 curve is drawn as an abrupt decay.",
      "la décrue après la troisième nuit, d’où une courbe 2023 tracée en chute brutale.",
    ),
    "2023-06-30",
  ),
  src(
    "franceinfo-1an-marche",
    "nahel",
    "franceinfo — un an après, une marche silencieuse réunit plusieurs centaines de personnes",
    "https://www.franceinfo.fr/faits-divers/adolescent-tue-par-un-policier-a-nanterre/mort-de-nahel-a-nanterre-un-an-apres-une-marche-silencieuse-reunit-plusieurs-centaines-de-personnes_6633804.html",
    both(
      "the 29 Jun 2024 anniversary march, the 2024 point in the series.",
      "la marche anniversaire du 29 juin 2024, point 2024 de la série.",
    ),
    "2024-06-29",
  ),
  src(
    "leparisien-marche-2024",
    "nahel",
    "Le Parisien — plusieurs centaines de personnes au départ de la marche silencieuse pour Nahel",
    "https://www.leparisien.fr/hauts-de-seine-92/nanterre-plusieurs-centaines-de-personnes-au-depart-de-la-marche-silencieuse-pour-nahel-29-06-2024-237YPUQKQZFQLHGTSHBOCKWVW4.php",
    both(
      "second count for the 2024 march, confirming it is an order of magnitude below 2023.",
      "second décompte de la marche 2024, confirmant un ordre de grandeur inférieur à 2023.",
    ),
    "2024-06-29",
  ),

  /* --------------------------------------------------------- Pensions, 2023 */
  src(
    "wiki-retraites",
    "retraites",
    "Mouvement social contre la réforme des retraites de 2023",
    "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023",
    both(
      "the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.",
      "les couples ministère / syndicats de chaque journée nationale d’action, du 19 janv. au 6 juin 2023.",
    ),
    "2026-11-09",
  ),
  src(
    "lemonde-en-7mars-2023",
    "retraites",
    "Le Monde (English) — « March 7 protests among largest since 1995 »",
    "https://www.lemonde.fr/en/les-decodeurs/article/2023/03/09/french-pension-reform-march-7-protests-among-largest-since-1995_6018714_8.html",
    both(
      "the 7 Mar peak placed against 1995 — the comparison the chart’s annotation relies on.",
      "le pic du 7 mars situé face à 1995 — comparaison sur laquelle repose l’annotation du graphique.",
    ),
    "2023-03-09",
  ),
  src(
    "of-6juin-2023",
    "retraites",
    "Ouest-France — direct du 6 juin 2023 : les manifestations contre la réforme des retraites",
    "https://www.ouest-france.fr/economie/retraites/direct-greve-du-6-juin-suivez-les-manifestations-contre-la-reforme-des-retraites-en-france-e282f866-0393-11ee-bfa0-5e45e3198685",
    both(
      "the last national day, 6 Jun, which closes the series.",
      "la dernière journée nationale, le 6 juin, qui clôt la série.",
    ),
    "2023-06-06",
  ),

  /* --------------------------------------------------- Anti-RN, June 2024 */
  src(
    "lemonde-en-16juin-2024",
    "rn2024",
    "Le Monde (English) — French protesters turn out in droves against far right",
    "https://www.lemonde.fr/en/politics/article/2024/06/16/french-protesters-turn-out-in-droves-against-far-right-caught-between-despair-and-the-will-to-fight_6674931_5.html",
    both(
      "the 15–16 Jun 2024 marches against the Rassemblement national.",
      "les marches des 15–16 juin 2024 contre le Rassemblement national.",
    ),
    "2024-06-16",
  ),
  src(
    "leparisien-15juin-2024",
    "rn2024",
    "Le Parisien — plus de 600 000 manifestants selon la CGT, 250 000 d’après la police",
    "https://www.leparisien.fr/elections/legislatives/manifestations-anti-rn-plus-de-600-000-manifestants-selon-la-cgt-250-000-dapres-la-police-15-06-2024-4TWAL2AAQFG2DGMZ5AYYFJNQ3I.php",
    both(
      "the widest police/union gap in the entire comparison — a factor of 2.4, which is why the band is drawn explicitly.",
      "l’écart police / syndicats le plus large de toute la comparaison — un facteur 2,4, d’où la fourchette explicite.",
    ),
    "2024-06-15",
  ),

  /* -------------------------------------------------------- Bloquons tout */
  src(
    "france24-bloquons",
    "bloquons",
    "France 24 — direct du 10 septembre 2025",
    "https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron",
    both(
      "197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.",
      "197 000 participants, 596 rassemblements, 253 blocages, 540 interpellations (dont 211 à Paris) — le point ministériel final de la soirée, qui supplante les 175 000 de 17 h 45.",
    ),
    "2025-09-10",
  ),
  src(
    "bfmtv-bloquons",
    "bloquons",
    "BFMTV — direct du 10 septembre",
    "https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html",
    both(
      "the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.",
      "la révision du décompte en cours de journée (175 000 → 197 000), d’où une fourchette plutôt qu’un point sur le graphique.",
    ),
    "2025-09-10",
  ),
  src(
    "franceinfo-bloquons-cgt",
    "bloquons",
    "franceinfo — près de 250 000 personnes mobilisées selon la CGT, 197 000 selon l’Intérieur",
    "https://www.franceinfo.fr/societe/bloquons-tout-mouvement-du-10-septembre/bloquons-tout-pres-de-250-000-personnes-mobilisees-dans-tout-le-pays-selon-la-cgt-175-000-selon-le-ministere-de-l-interieur_7484704.html",
    both(
      "the union side of the 10 Sep pair (~250,000), which completes the band.",
      "le côté syndical du couple du 10 sept. (~250 000), qui complète la fourchette.",
    ),
    "2025-09-10",
  ),
  src(
    "liberation-10sept",
    "bloquons",
    "Libération — direct du 10 septembre : la mobilisation « Bloquons tout »",
    "https://www.liberation.fr/societe/en-direct-bloquons-tout-suivez-la-mobilisation-ce-mercredi-10-septembre-au-lendemain-de-la-nomination-de-sebastien-lecornu-a-matignon-20250910_7UGUHFIOUNGDJP67XSMTH5FKVA/",
    both(
      "the 175,000 ministry figure as first published, before the evening revision.",
      "les 175 000 du ministère tels que publiés d’abord, avant la révision du soir.",
    ),
    "2025-09-10",
  ),
  src(
    "of-bloquons-infographies",
    "bloquons",
    "Ouest-France — « 200 000 participants à Bloquons tout : est-ce mieux que les autres mobilisations ? »",
    "https://www.ouest-france.fr/societe/manifestation/infographies-200-000-participants-a-bloquons-tout-est-ce-mieux-que-les-autres-mobilisations-0f322c98-8ef1-11f0-b582-5820cfc46140",
    both(
      "the 200,000 working figure and the pre-computed comparison with earlier movements, which the chart re-derives.",
      "le chiffre de travail de 200 000 et la comparaison déjà calculée avec les mouvements antérieurs, que le graphique recalcule.",
    ),
    "2025-09-11",
  ),
  src(
    "franceinfo-18sept-gav",
    "bloquons",
    "franceinfo — malgré 89 gardes à vue à Paris, Laurent Nuñez reconnaît que la journée s’est « plutôt bien passée »",
    "https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-malgre-89-gardes-a-vue-a-paris-laurent-nunez-reconnait-que-la-journee-s-est-plutot-bien-passee_7501129.html",
    both(
      "the 18 Sep arrests (103 in Paris, 89 custodies) — a markedly lower repressive profile than 2026.",
      "les interpellations du 18 sept. (103 à Paris, 89 gardes à vue) — profil répressif nettement plus bas qu’en 2026.",
    ),
    "2025-09-18",
  ),
  src(
    "franceinfo-18sept-direct",
    "bloquons",
    "franceinfo — direct du 18 septembre : jusqu’à 900 000 manifestants attendus",
    "https://www.franceinfo.fr/economie/greve/greve/direct-mobilisation-du-18-septembre-jusqu-a-900-000-manifestants-attendus-des-transports-perturbes-et-une-greve-qui-s-annonce-tres-suivie-dans-les-pharmacies-et-les-ecoles_7498174.html",
    both(
      "the pre-day expectation (900,000), kept to show how far the realised count fell short.",
      "l’attente d’avant-journée (900 000), conservée pour mesurer l’écart avec le décompte réalisé.",
    ),
    "2025-09-18",
  ),
  src(
    "franceinfo-18sept-comparaison",
    "bloquons",
    "franceinfo — la mobilisation du 18 septembre a-t-elle été plus ou moins forte que les précédents grands mouvements ?",
    "https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-la-mobilisation-a-t-elle-ete-plus-ou-moins-forte-que-lors-des-derniers-grands-mouvements-sociaux_7499668.html",
    both(
      "the explicit cross-movement comparison the C section reproduces.",
      "la comparaison inter-mouvements explicite que la section C reproduit.",
    ),
    "2025-09-18",
  ),
  src(
    "franceinfo-2oct",
    "bloquons",
    "franceinfo — environ 195 000 personnes ont manifesté selon l’Intérieur, près de 600 000 d’après la CGT",
    "https://www.franceinfo.fr/economie/greve/greve/greve-du-2-octobre-environ-195-000-personnes-ont-manifeste-en-france-selon-le-ministere-de-l-interieur-pres-de-600-000-d-apres-la-cgt_7528024.html",
    both(
      "the 2 Oct third wave: 195,000 ministry / ~600,000 CGT.",
      "la troisième vague du 2 oct. : 195 000 ministère / ~600 000 CGT.",
    ),
    "2025-10-02",
  ),
  src(
    "lefigaro-2oct",
    "bloquons",
    "Le Figaro — 100 000 participants attendus : « est-ce un chiffre assez bas comme le dit Bayrou ? »",
    "https://www.lefigaro.fr/social/mouvement-du-10-septembre-100-000-participants-attendus-est-ce-un-chiffre-assez-bas-comme-le-dit-bayrou-20250905",
    both(
      "the political framing of the turnout numbers, which is why both bounds are kept rather than averaged.",
      "la mise en politique des chiffres de foule, d’où la conservation des deux bornes plutôt qu’une moyenne.",
    ),
    "2025-09-05",
  ),
  src(
    "liberation-2oct",
    "bloquons",
    "Libération — direct du 2 octobre : journées d’actions et de grèves",
    "https://www.liberation.fr/economie/social/en-direct-mobilisation-du-2-octobre-suivez-la-journee-dactions-et-de-greves-de-ce-jeudi-20251002_GFUGFS2GS5GPHAU5TVAGAZMGBI/",
    both(
      "second source for the 2 Oct pair.",
      "seconde source pour le couple du 2 oct.",
    ),
    "2025-10-02",
  ),
  src(
    "of-bloquons-44a",
    "bloquons",
    "Ouest-France — « Bloquons tout » : une mobilisation en demi-teinte en Loire-Atlantique",
    "https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-mobilisation-en-demi-teinte-en-loire-atlantique-90dd52ae-c22c-11f0-a316-aa52a6afd2bb",
    both(
      "regional-only marker: the gap between the national headline and local reality.",
      "marqueur régional : l’écart entre le titre national et la réalité locale.",
    ),
    "2025-11-16",
  ),
  src(
    "of-bloquons-44b",
    "bloquons",
    "Ouest-France — une soixantaine de personnes manifestent à Nantes ce samedi",
    "https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-soixantaine-de-personnes-manifestent-a-nantes-ce-samedi-766d30c0-c226-11f0-8509-2c0807403e46",
    both(
      "~60 in Nantes on the Saturday — the smallest unit cited anywhere in the comparison.",
      "~60 à Nantes le samedi — la plus petite unité citée dans toute la comparaison.",
    ),
    "2025-11-15",
  ),
  src(
    "of-bloquons-44c",
    "bloquons",
    "Ouest-France (Manche) — le collectif « Indignons-nous » tente de faire perdurer le mouvement",
    "https://www.ouest-france.fr/societe/manifestation/dans-la-manche-le-collectif-indignons-nous-tente-de-faire-perdurer-le-mouvement-apres-le-10-septembre-3828460e-c20f-11f0-8509-2c0807403e46",
    both(
      "how a local collective tried to sustain the movement after 10 Sep — context for the 18 Sep and 2 Oct tail.",
      "comment un collectif local a tenté de prolonger le mouvement après le 10 sept. — contexte de la queue des 18 sept. et 2 oct.",
    ),
    "2025-11-15",
  ),
  src(
    "figaro-bloquons",
    "bloquons",
    "Le Figaro — direct « Bloquons tout » des 10 et 11 septembre",
    "https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910",
    both(
      "the 18 Sep intersyndicale day and the 2 Oct third wave.",
      "la journée intersyndicale du 18 sept. et la troisième vague du 2 oct.",
    ),
    "2025-09-10",
    "2025-09-11",
  ),
];

/* -------------------------------------------- named but never linked */

interface Mention {
  readonly name: string;
  readonly note: Bi;
}

const MENTIONS: readonly Mention[] = [
  {
    name: "data.gouv.fr — base des mobilisations",
    note: both(
      "intended source for the metropolitan/overseas split; never actually retrieved.",
      "source prévue pour la ventilation métropole / outre-mer ; jamais effectivement consultée.",
    ),
  },
  {
    name: "CCI France",
    note: both(
      "author of the 2,488 / 2,538 shop counts, reached through Le Monde, franceinfo, BFMTV, LSA and La Dépêche.",
      "auteur des décomptes de 2 488 / 2 538 commerces, atteint via Le Monde, franceinfo, BFMTV, LSA et La Dépêche.",
    ),
  },
  {
    name: "Pr Laurent Thines (CHU de Besançon)",
    note: both(
      "author of the 79-serious-injury register attributed by Le Canard enchaîné; also cited directly as the injury floor.",
      "auteur du registre de 79 blessés graves attribué par Le Canard enchaîné ; également cité directement comme plancher.",
    ),
  },
  {
    name: "Sénat — commission d’enquête de juin 2023",
    note: both(
      "the ~50,000 rioters and consolidated damage estimate, reached through the Senate press release above.",
      "les ~50 000 émeutiers et l’estimation consolidée des dommages, atteints via le communiqué du Sénat ci-dessus.",
    ),
  },
  {
    name: "France Police",
    note: both(
      "police union; publisher of the 750,000 counter-count for the Act II of the Gilets jaunes.",
      "syndicat policier ; auteur du contre-décompte de 750 000 pour l’acte II des Gilets jaunes.",
    ),
  },
  {
    name: "Collectif « Nombre jaune »",
    note: both(
      "the independent crowd-counting group behind the alternative Gilets jaunes figures.",
      "le collectif indépendant de comptage derrière les chiffres alternatifs des Gilets jaunes.",
    ),
  },
  {
    name: "Occurrence",
    note: both(
      "Paris crowd counts quoted in Part II but never linked to a page.",
      "comptages parisiens cités dans la partie II, jamais liés à une page.",
    ),
  },
  {
    name: "CGT",
    note: both(
      "every union turnout figure here is the CGT’s, relayed by the press.",
      "chaque chiffre syndical de foule est celui de la CGT, relayé par la presse.",
    ),
  },
  {
    name: "Union étudiante",
    note: both(
      "organiser of the student days; no count of its own was retrieved.",
      "organisatrice des journées étudiantes ; aucun décompte propre n’a été retrouvé.",
    ),
  },
  {
    name: "USL (intersyndicale.lycéenne)",
    note: both(
      "the litigé intersyndicate whose call calendar drives the school-movement rows.",
      "l’intersyndicale Pharè whose call calendar drives the school-movement rows.",
    ),
  },
  {
    name: "Préfecture de police de Paris",
    note: both(
      "Paris-only counts (17 Oct, 7 Nov) are prefecture figures relayed by the press, never a national series.",
      "les chiffres strictement parisiens (17 oct., 7 nov.) sont des données préfectorales relayées par la presse, jamais une série nationale.",
    ),
  },
];

/* ------------------------------------------------------------ marker key */

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
  {
    key: "x",
    text: {
      en: "wider measure — establishments perturbed, with classes suspended, or closed, rather than schools fully blocked",
      fr: "mesure plus large — établissements perturbés, cours suspendus ou fermés, plutôt que des lycées entièrement bloqués",
    },
  },
];

/* duplicate ids are a build error, not a runtime surprise */
{
  const seen = new Set<string>();
  for (const s of SOURCES) {
    if (seen.has(s.id))
      throw new Error(`sources.ts: duplicate source id "${s.id}"`);
    seen.add(s.id);
  }
}

/* ----- render */

/** ISO strings compare lexicographically; undated sources sort last, stably. */
function byPublicationDate(a: Source, b: Source): number {
  if (!a.date || !b.date) {
    if (a.date !== b.date) return a.date ? -1 : 1;
    return a.id.localeCompare(b.id);
  }
  return a.date !== b.date
    ? a.date < b.date
      ? -1
      : 1
    : (a.dateEnd ?? "").localeCompare(b.dateEnd ?? "") ||
        a.id.localeCompare(b.id);
}

/** Bucketed and sorted once: renderSources() re-runs on every locale change. */
const SOURCES_BY_GROUP: ReadonlyMap<GroupId, readonly Source[]> = (() => {
  const buckets = new Map<GroupId, Source[]>();
  for (const s of SOURCES) {
    const bucket = buckets.get(s.group);
    if (bucket) bucket.push(s);
    else buckets.set(s.group, [s]);
  }
  for (const bucket of buckets.values()) bucket.sort(byPublicationDate);
  return buckets;
})();

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

/** Collapsible group; `open` comes from the pre-render DOM so locale changes don't reset it. */
function sourceGroup(
  id: string,
  summary: Node[],
  body: Node[],
): HTMLDetailsElement {
  const details = el("details", "source-group");
  details.dataset.group = id;

  const head = el("summary", "group-summary");
  head.append(...summary);
  details.append(head, ...body);
  return details;
}

/** Idempotent. Keeps the static <h1> that index.html owns, replaces everything after it. */
export function renderSources(
  host: HTMLElement | null = document.getElementById("sources"),
): void {
  if (!host) return; // boot() guarantees it; no silent re-append to <body>

  const kept = [...host.children].filter((n): n is HTMLElement =>
    /^H[1-6]$/.test(n.tagName),
  );
  // The page-level heading is static in index.html and therefore French-only;
  // give it the localised title so the box is right in both languages.
  if (kept[0]) kept[0].textContent = bi(BOX_TITLE);

  const box = el("div", "sources-box");
  box.append(el("p", "intro", bi(INTRO)));

  for (const group of GROUPS) {
    const items = SOURCES_BY_GROUP.get(group.id);
    if (!items || items.length === 0) continue;

    // count is derived, never typed into the blurb
    const title = el("h3", undefined, bi(group.title));
    title.append(" ", el("span", "count", String(items.length)));

    const list = el("ul");
    for (const s of items) list.append(sourceItem(s));

    box.append(
      sourceGroup(group.id, [title], [el("p", "blurb", bi(group.blurb)), list]),
    );
  }

  const dl = el("dl", "mention-list");
  for (const { name, note } of MENTIONS) {
    dl.append(el("dt", undefined, name), el("dd", undefined, bi(note)));
  }
  box.append(
    sourceGroup(
      "mentions",
      [el("h3", undefined, bi(MENTIONS_TITLE))],
      [el("p", "blurb", bi(MENTIONS_BLURB)), dl],
    ),
  );

  const key = el("dl", "marker-list");
  for (const { key: marker, text } of MARKER_KEY) {
    key.append(el("dt", undefined, marker), el("dd", undefined, bi(text)));
  }
  box.append(key, el("p", "foot", bi(FOOT)));

  host.replaceChildren(...kept, box);
}
