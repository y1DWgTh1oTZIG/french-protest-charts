/* All user-visible copy, in one place. Adding a locale = adding one object to
   `catalogues` and one entry to Locale; the interface makes a missed key a compile error. */

import type { EpisodeId, Flag, Metric, MetricKey } from "./model.ts";

export type Locale = "en";

export interface WeekText {
  action?: string; // appended to the week label
  note?: Partial<Record<Metric, string>>;
}

export interface EpisodeText {
  strip: string;
  short: string;
  banner: string;
  weeks: Record<number, WeekText>;
  fallbackNote?: Partial<Record<Metric, string>>;
}

export interface SourceItem {
  href: string;
  label: string;
  when?: { from: string; to?: string }; // ISO; rendered per locale
  what: string;
}
export type SeriesKey =
  | "protestersDaily"
  | "arrestsDaily"
  | "forcesDaily"
  | "protestersInjuredDaily"
  | "damagesDaily"
  | "policingDaily"
  | "policingCumulative"
  | "protestersWeekly"
  | "arrestsWeekly"
  | "forcesWeekly"
  | "protestersInjuredWeekly";

export interface ChartStrings {
  axisDate: string;
  axisWeek: string;
  weekOf: string;
  weekOfPartial: string;
  edgeMark: string;
  eurM: string;
  suffixWrap: string;
  suffix: { c: string; w: string; e: string; f: string; regional: string };
  policingDay: string;
  policingDayPlain: string;
  cumulativeAdded: string;
  cumulativeCarried: string;
  weekJoin: string;
  weekNational: string;
  weekRegionalOnly: string;
  weekPeak: string;
  weekNoNational: string;
  weekExcluded: string;
  weekFloored: string;
  weekClipped: string;
  tooltipPoint: string;
  tooltipRange: string;
  tooltipNote: string;
  footerMark: string;
  dayNotes: Record<string, string>;
  obsNotes: Record<string, Partial<Record<MetricKey, string>>>;
  deployNotes: Record<string, string>;
  series: Record<SeriesKey, { label: string; detached: string }>;
  charts: {
    protestersDaily: { title: string; subtitle: string; y: string };
    enforcementDaily: { title: string; subtitle: string; y: string };
    cost: { title: string; subtitle: string; yLeft: string; yRight: string };
    protestersWeekly: { title: string; subtitle: string; y: string };
    enforcementWeekly: { title: string; subtitle: string; y: string };
  };
}

export interface Catalogue {
  meta: { htmlLang: string; intl: string; title: string };
  disclaimer: {
    strong: string;
    lead: string;
    link: string;
    href: string;
    tail: string;
  };
  sections: {
    a: { title: string; blurb: string; note?: string };
    b: { title: string; blurb: string; note?: string };
    c: { title: string; blurb: string; note: string };
    cp: { title: string; blurb: string; note: string };
  };
  items: Record<Metric, { label: string; short: string }>;
  flags: Partial<Record<Flag, string>>;
  units: { weeks: Record<string, string> };
  panels: {
    obs: string;
    act: string;
    withAction: string;
    studentWeek: string;
    partialWeek: string;
    itemMeta: string;
    valueRange: string;
    seriesContinues: string;
  };
  tooltip: {
    lineWithFlag: string;
    linePlain: string;
    firstFigure: string;
    shareOfFirst: string;
  };
  episodes: Record<EpisodeId, EpisodeText>;
  sources: {
    title: string;
    intro: string;
    groups: { heading: string; items: SourceItem[] }[];
    foot: string;
  };
  chart: ChartStrings;
}

const en: Catalogue = {
  meta: {
    htmlLang: "en",
    intl: "en-GB",
    title: "France — protest activity, Oct–Nov 2026",
  },

  disclaimer: {
    strong:
      "These charts were created using LLM assistance, and should not be relied on for serious analysis without in-depth review.",
    lead: "You can view the ",
    link: "full transcript of the LLM conversation",
    href: "transcript.html",
    tail: ".",
  },

  sections: {
    a: {
      title: "Section A — daily",
      blurb:
        "One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.",
    },
    b: {
      title: "Section B — weekly",
      blurb:
        "Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.",
    },
    c: {
      title: "Section C — cross-episode, one panel per movement",
      blurb:
        "Seven episodes, four series each, on a single logarithmic count axis shared by every panel — so a point sits at exactly the number its tooltip reports, and panels can be compared by eye. Panel position names the movement; hue names the series, once, in the legend below. Hollow markers = regional, partial, derived or stock figure. Hover a series (or its legend entry) to trace it across all seven panels.",
      note: 'x — whole weeks since each movement\'s first action, true scale, so durations differ (Nahel 1 week, Gilets jaunes 43) and each panel keeps its own x extent. y — count, log scale, one range for all seven panels (about 0.5 → 7M); tick labels appear only in the left column, gridlines everywhere, and on a log axis equal vertical distance means equal proportional change wherever a series sits. Dashed segment = at least one week with no published figure lies between the two points. "obs" under each strip = weeks with a figure for protestors · arrests · forces injured · protestors injured.',
    },
    cp: {
      title: "Section C′ — cross-episode, transposed",
      blurb:
        'The same data with the comparison axis flipped: one panel per series, one line per movement, direct labels instead of a legend. Colour encodes the movement on a single sequential ramp, light → dark in the same order in every panel, so the ramp is learned once. Use this to ask "did arrests behave the same way in every episode?".',
      note: "<strong>x is capped at week 7</strong> — the last week on which any movement has an arrest or injury figure (CPE, 28 Mar – 2 Apr 2006: 600 arrests). Gilets jaunes' enforcement series stops at Act IV (week 3) while its crowd series runs to Act 44 (week 43); letting that set the axis left every enforcement panel empty after week 4. A trailing <code>+</code> marks a series that continues past the cap — the untruncated curves are in Section C, where each panel keeps its own extent. y limits are <em>per panel</em> because the four series sit up to three orders of magnitude apart; the range is printed under each strip, so compare shape and percentage change here, not level.",
    },
  },
  chart: {
    axisDate: "Date (2026)",
    axisWeek: "Week (2026)",
    weekOf: "Week of {date}",
    weekOfPartial: "Week of {date} (partial)",
    edgeMark: "*",
    eurM: "€{v}M",
    suffixWrap: " [{text}]",
    suffix: {
      c: "stock since mid-Sep, not a daily figure",
      w: "weekly aggregate",
      e: "derived, not published",
      f: "lower bound",
      regional: "regional/partial — not a national total",
    },
    policingDay: "~{head} officers × €{low}–{high}/officer-day — {note}",
    policingDayPlain: "~{head} officers × €{low}–{high}/officer-day",
    cumulativeAdded:
      "cumulative over {days} deployment day(s); this date adds its increment",
    cumulativeCarried:
      "cumulative over {days} deployment day(s); carried forward — no published deployment this date",
    weekJoin: "; ",
    weekNational: "{n} day(s) with national figures",
    weekRegionalOnly: "{n} day(s) with regional/partial figures",
    weekPeak: "peak {date}",
    weekNoNational: "no national figure this week",
    weekExcluded: "{n} regional/partial day(s) excluded",
    weekFloored: "contains a lower-bound figure, so the total is a floor",
    weekClipped: "partial week — clipped by the 1 Oct – 11 Nov window",
    tooltipPoint: "{label}: {value}",
    tooltipRange: "{label}: {mid} ({low} – {high})",
    tooltipNote: "{base} — {note}",
    footerMark: "⚠ {note}",

    dayNotes: {
      "2026-10-01":
        "The €1M Île-de-France figure is a stock accumulated since 17 September, not spending on 1 October.",
      "2026-10-17":
        'IFRAP conditional estimate for the 17–18 Oct weekend: €244M–€866M material damage; €294M–€1.1bn including lost turnover. Shop counts diverge: government "at least 3,000", CCI 2,488, FCD 1,500+. 1–2 deaths. No national count of injured protesters was published.',
      "2026-10-18":
        "Paris only, derived from ~30 newly pillaged shops. Subset of the 17 Oct weekend total — adding the two double-counts.",
      "2026-10-24":
        "3 protesters seriously hurt: Toulouse, Reims, Clermont-Ferrand.",
      "2026-11-05":
        'Prefecture reported "no structuring material damage"; Rhône counted 5 shops degraded.',
      "2026-11-07":
        "Authorities published no damage tally; communes inventoried their own. Angers: 1 shop + 4 banks vandalised.",
    },

    obsNotes: {
      "2026-10-01": {
        arrests: "arrest ≠ custody — 1,793 placed in custody",
        forcesInjured: "ministry gave 84 then 305 for the same day",
        protesterInjured: "65 staff + 170 pupils, cumulative",
        damagesCost: "Île-de-France stock since 17 Sep",
      },
      "2026-10-06": { damagesCost: "IDF increment 1→9 Oct; shared with 8 Oct" },
      "2026-10-08": { damagesCost: "same €6M increment as 6 Oct — do not add" },
      "2026-10-12": { arrests: "Rhône only" },
      "2026-10-13": { damagesCost: "IDF increment 9→11 Oct" },
      "2026-10-17": {
        forcesInjured: "7–9 seriously injured",
        damagesCost:
          "IFRAP low–high, material damage, 17–18 Oct combined; central case €463M",
      },
      "2026-10-18": {
        arrests: "Paris only",
        damagesCost:
          "Paris only: ~30 shops × €60k–167k; subset of 17 Oct, not additive",
      },
      "2026-10-20": { arrests: "Guadeloupe only" },
      "2026-10-24": {
        protesterInjured: "3 seriously hurt",
        damagesCost:
          "50 shops (CCI France) × €20k light damage → €167k IFRAP high average",
      },
      "2026-10-31": {
        damagesCost: "20 shops degraded (CCI France) × €20k–167k",
      },
      "2026-11-05": {
        protesterInjured: "legal complaints, not a ministry count",
      },
      "2026-11-09": { arrests: "Bègles 4 + Lyon 8 + Strasbourg 5" },
    },

    deployNotes: {
      "2026-10-01":
        "modelled: Beauvau gave 305 injured and 1,949 arrests but refused to state mobile-unit numbers",
      "2026-10-06": "modelled; no deployment total published",
      "2026-10-08": "modelled for Acte IV",
      "2026-10-12": "modelled: Île-de-France only, ~80 lycées",
      "2026-10-13":
        "modelled: Ardèche fielded >100 officers for ~1,000 demonstrators in 4 towns; scaled to 101 departments",
      "2026-10-17":
        'government figure; the ">10,000" morning tally was partial, not a rival total',
      "2026-10-24": "110 mobile units, 26 Centaure, ~15 water cannon",
      "2026-10-31": "dispositif reconducted",
      "2026-11-05": "reconducted for the interprofessional day",
      "2026-11-07": "reconducted",
    },

    series: {
      protestersDaily: {
        label: "Protestors (midpoint of range)",
        detached: "Protestors — regional",
      },
      arrestsDaily: {
        label: "Arrests",
        detached: "Arrests — regional / partial",
      },
      forcesDaily: {
        label: "Injuries — security forces",
        detached: "Injuries — security forces, regional",
      },
      protestersInjuredDaily: {
        label: "Injuries — protestors",
        detached: "Injuries — protestors, regional",
      },
      damagesDaily: {
        label: "Cost of damages (€M)",
        detached: "Cost of damages — derived / stock",
      },
      policingDaily: {
        label: "Cost of policing (€M/day, estimated)",
        detached: "Cost of policing — modelled headcount",
      },
      policingCumulative: {
        label: "Cumulative cost of policing (€M, right axis)",
        detached: "Cumulative cost of policing",
      },
      protestersWeekly: {
        label: "Protestors — peak day of the week",
        detached: "Protestors — regional weeks",
      },
      arrestsWeekly: {
        label: "Arrests (weekly total)",
        detached: "Arrests — regional weeks",
      },
      forcesWeekly: {
        label: "Injuries — security forces (weekly total)",
        detached: "Injuries — security forces, regional weeks",
      },
      protestersInjuredWeekly: {
        label: "Injuries — protestors (weekly total)",
        detached: "Injuries — protestors, regional weeks",
      },
    },

    charts: {
      protestersDaily: {
        title: "France — daily protestors, 1 Oct – 11 Nov 2026",
        subtitle:
          "Points sit at the midpoint of the published range; bars span low (ministry) → high (organisers). Dashed connector = a day with no published figure lies between.",
        y: "Protestors",
      },
      enforcementDaily: {
        title: "France — arrests and injuries per day, 1 Oct – 11 Nov 2026",
        subtitle:
          "Bars span the lowest and highest published figure for the day. Filled markers + line = national counts; hollow = regional, partial, floor or derived values, plotted but never connected.",
        y: "Count (arrests / injuries)",
      },
      cost: {
        title:
          "France — cost of damages, policing cost per day, and cumulative policing cost",
        subtitle:
          "Daily cost = officers deployed × €136–1,133 per officer-day (marginal CRS rate → Sainte-Soline all-in). Reported headcounts (60,000 on 17 Oct; 70,000 after) are filled; earlier days were never published and are modelled, so they are hollow. The cumulative line carries forward on days with no deployment and its shaded band grows with each assumed increment.",
        yLeft: "€ millions (per day)",
        yRight: "€ millions (cumulative)",
      },
      protestersWeekly: {
        title: "France — peak daily protestors, by week",
        subtitle:
          "Weeks run Monday–Sunday. Crowd figures show the peak day within each week; bars span the peak under the most conservative sources to the peak under the most generous. * = week clipped by the 1 Oct – 11 Nov window.",
        y: "Protestors (weekly peak)",
      },
      enforcementWeekly: {
        title: "France — arrests and injuries, weekly totals",
        subtitle:
          "Arrests and injuries are summed within each week; bars span the sum of the lowest to the sum of the highest published figures. Days carrying regional or partial counts are excluded from national sums and counted in the tooltip. A week with no published figure stays empty.",
        y: "Count (weekly total)",
      },
    },
  },

  items: {
    p: { label: "Protestors (peak day)", short: "Protestors" },
    a: { label: "Arrests (weekly total)", short: "Arrests" },
    f: { label: "Injuries — security forces", short: "Forces hurt" },
    i: { label: "Injuries — protestors", short: "Protestors hurt" },
  },

  flags: {
    r: "regional only",
    p: "partial",
    f: "lower bound",
    e: "derived",
    c: "stock or actions-total — measured differently",
    w: "weekly aggregate",
  },

  units: {
    weeks: { one: "{n} wk", other: "{n} wks" },
  },

  panels: {
    obs: "obs {counts} of {weeks}",
    act: "Act {n}",
    withAction: "{when} · {action}",
    studentWeek: "W{n} · {label}",
    partialWeek: "{label} (partial week)",
    itemMeta: "{range} · x 0–w{n}",
    valueRange: "{lo}–{hi}",
    seriesContinues: "{name} +",
  },

  tooltip: {
    lineWithFlag: "{value}  ·  {flag}",
    linePlain: "{value}",
    firstFigure: "first comparable figure for this series ({n})",
    shareOfFirst: "{pct} of the series' first comparable figure ({n})",
  },

  episodes: {
    may68: {
      strip: "May 1968",
      short: "May 68",
      banner:
        "Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.",
      weeks: {
        0: {
          action: "1 May march",
          note: { p: "prefecture 25,000 / CGT 100,000, République → Bastille" },
        },
        1: {
          action: "Sorbonne, barricades",
          note: {
            p: "20,000 to the Sorbonne on 6 May; >20,000 again on 10 May",
            a: "469 on the night of 10–11 May; high adds the 422 early-May arrests",
            f: "300+ on 6 May; 247 on 10–11 May",
            i: "≥100 — no national count was published",
          },
        },
        2: {
          action: "13 May march",
          note: {
            p: "prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Peak of the episode.",
          },
        },
        3: {
          action: "24–25 May",
          note: {
            a: "1,000+ arrests on 25 May",
            i: "887 injured, from the English-Wikipedia infobox — weak provenance",
          },
        },
        4: {
          action: "30 May",
          note: {
            p: "30 May: 300,000 (prefecture) – 1,000,000 counter-demonstration — excluded from protest totals",
          },
        },
        5: {
          note: {
            p: "4 Jun partial return to work; 7 Jun Renault-Flins clashes",
          },
        },
        6: {
          note: {
            p: "10–11 Jun: 3 dead; 12 Jun demonstrations banned nationwide",
          },
        },
      },
    },

    cpe: {
      strip: "CPE 2006",
      short: "CPE 2006",
      banner:
        "One movement-wide arrest total (4,500); no weekly enforcement series exists.",
      weeks: {
        0: {
          action: "7 Feb",
          note: { p: "187 demonstrations, first national day" },
        },
        4: {
          action: "7 Mar",
          note: { p: ">1 million claimed; 38 universities on strike by 9 Mar" },
        },
        5: {
          action: "16–18 Mar",
          note: {
            p: "18 Mar: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000",
            a: "Paris, 18 Mar (156 ministry / 167 organisers)",
            f: "Paris, 18 Mar",
            i: "18 (16 Mar) + 52 (18 Mar), Paris only",
          },
        },
        6: {
          action: "23 Mar",
          note: { p: "21 universities fully blocked; 67 striking or blocked" },
        },
        7: { action: "28 Mar", note: { p: "4th national action day" } },
        8: { action: "4 Apr", note: { p: "peak day of the episode" } },
        9: { note: { p: "CPE withdrawn 10 Apr; the movement splits" } },
      },
    },

    gj: {
      strip: "Gilets jaunes",
      short: "Gilets jaunes",
      banner:
        "Ministry count only: one figure per act. Acts 34–43 were never published; no enforcement series after Act IV.",
      weeks: {
        0: {
          note: {
            p: "287,700 counts all actions including road blockades — an actions-total, not a march",
            a: "974 in custody, ~1,150 interpellations",
            f: "17 police among 126 injured — split derived",
            i: "109 of 126 injured — split derived",
          },
        },
        1: {
          note: {
            p: "police-union counter-count: 750,000",
            a: "307 in custody, 339 interpellations",
            i: "54 of 84 injured — split derived",
          },
        },
        2: {
          note: {
            a: "placed in custody, not arrests; 263 injured, not split by side",
          },
        },
        3: {
          note: {
            a: "1,709 in custody, ~2,000 interpellations; injuries reported as 118 / 264 / 585 depending on source, not split by side",
          },
        },
      },
    },

    nahel: {
      strip: "Nahel 2023",
      short: "Nahel 2023",
      banner:
        "Gatherings were banned: arrests, not crowd counts, carry the scale of the riots.",
      weeks: {
        0: {
          action: "Nanterre march, 29 Jun",
          note: {
            p: "police 6,200 / organisers 20,000 for the march blanche",
            a: "national total, 27 Jun – 2 Jul",
            f: "722 officers injured; 2 deaths; 5,662 vehicles burnt",
          },
        },
        1: { note: { a: "72 + 16 + 20 over 3–5 Jul" } },
      },
    },

    pensions: {
      strip: "Pension reform 2023",
      short: "Pensions 2023",
      banner:
        "Crowds only: no national weekly arrest or injury series was published.",
      weeks: {
        0: {
          action: "19 Jan",
          note: { p: "first national day; Paris 80,000 – 400,000" },
        },
        2: { action: "31 Jan" },
        3: {
          action: "7 & 11 Feb",
          note: { p: "two action days in one week; the peak is 11 Feb" },
        },
        4: { action: "16 Feb" },
        7: {
          action: "7 Mar",
          note: { p: "national record: ministry 1.28M, unions 3.5M" },
        },
        8: { action: "15 Mar" },
        9: { action: "23 Mar" },
        10: { action: "28 Mar" },
        11: { action: "6 Apr" },
        12: {
          action: "13 Apr",
          note: { p: "CGT gives 1.0M in one compilation, 1.5M in another" },
        },
        16: { action: "1 May" },
        20: { action: "6 Jun", note: { p: "movement minimum" } },
      },
    },

    bt: {
      strip: "Bloquons tout 2025",
      short: "Bloquons tout",
      banner:
        "10 Sep is an actions-total (blockades included); 18 Sep is an intersyndicale march.",
      weeks: {
        0: {
          action: "10 Sep",
          note: {
            p: "ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.",
            a: "540 arrests, 211 in Paris",
          },
        },
        1: {
          action: "18 Sep",
          note: {
            p: "intersyndicale day — a different mobilisation from the movement’s own actions; Paris 55,000 (prefecture)",
            a: "309 nationwide, 103 in Paris",
            i: "11 injured, including 1 journalist",
          },
        },
        3: { note: { p: "weakest mobilisation since 1 May 2025" } },
      },
    },

    students26: {
      strip: "Student protests 2026",
      short: "Students 2026",
      banner:
        "Protester injuries are a September stock, then a litigation floor — never a weekly flow.",
      weeks: {}, // week labels and tooltips come from chart.ts until WEEKS exposes dates
      fallbackNote: {
        p: "peak day of the week",
        a: "sum of national daily counts; regional days excluded",
        f: "sum of national daily counts",
        i: "flow where a flow exists — W1 is a stock, W6 a litigation floor",
      },
    },
  },

  sources: {
    title: "Sources",
    intro:
      "Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.",
    groups: [
      {
        heading: "The 2026 movement — 1 Oct to 11 Nov",
        items: [
          {
            href: "https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros",
            label:
              "Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »",
            when: { from: "2026-10-21" },
            what: "the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.",
          },
          {
            href: "https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html",
            label:
              "Le Monde — « Plus de 2 500 commerces dégradés », d’après CCI France",
            when: { from: "2026-10-27" },
            what: "CCI France's shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.",
          },
          {
            href: "https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html",
            label: "franceinfo — « Plus de 2 500 magasins touchés »",
            when: { from: "2026-10-27" },
            what: "the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.",
          },
          {
            href: "https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html",
            label: "BFMTV — CCI France, 20 shops vandalised on 31 Oct",
            when: { from: "2026-11-01" },
            what: "why week 6 carries no damage figure: the count collapses after 24 Oct.",
          },
          {
            href: "https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269",
            label:
              "Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »",
            when: { from: "2026-10-28" },
            what: "the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.",
          },
          {
            href: "https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020",
            label: "Le Figaro — « Le coût exorbitant d’un week-end d’émeutes »",
            when: { from: "2026-10-20" },
            what: "cross-check on the damage order of magnitude.",
          },
          {
            href: "https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil",
            label:
              "Le Canard enchaîné — « Les manifestants ont le mauvais œil »",
            when: { from: "2026-11-10" },
            what: "Prof. Laurent Thines' (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.",
          },
          {
            href: "https://www.interieur.gouv.fr/",
            label: "Ministère de l’Intérieur",
            what: "origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting above rather than from a dataset.",
          },
        ],
      },
      {
        heading: "Historical episodes",
        items: [
          {
            href: "https://fr.wikipedia.org/wiki/Mai_68",
            label: "Mai 68",
            what: "1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.",
          },
          {
            href: "https://en.wikipedia.org/wiki/May_68",
            label: "May 68 (English Wikipedia)",
            what: "the 887 injured figure, which appears only in this article's infobox and is flagged accordingly — no French count was published.",
          },
          {
            href: "https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche",
            label: "Contrat première embauche",
            what: "the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.",
          },
          {
            href: "https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes",
            label: "Mouvement des Gilets jaunes",
            what: "the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.",
          },
          {
            href: "https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk",
            label: "Mort de Nahel Merzouk",
            what: "the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.",
          },
          {
            href: "https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023",
            label: "Mouvement social contre la réforme des retraites de 2023",
            what: "the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.",
          },
          {
            href: "https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron",
            label: "France 24 — « Bloquons tout », direct du 10 septembre 2025",
            when: { from: "2025-09-10" },
            what: "197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.",
          },
          {
            href: "https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html",
            label: "BFMTV — direct du 10 septembre",
            when: { from: "2025-09-10" },
            what: "the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.",
          },
          {
            href: "https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910",
            label: "Le Figaro — direct du 10 septembre",
            when: { from: "2025-09-10", to: "2025-09-11" },
            what: "the 18 Sep intersyndicale day and the 2 Oct third wave.",
          },
          {
            href: "https://en.wikipedia.org/wiki/Bloquons_tout",
            label: "Bloquons tout (English Wikipedia)",
            what: "the movement's chronology and its 10 Sep / 18 Sep / 2 Oct structure.",
          },
        ],
      },
    ],
    foot: "Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a shared log axis, and C′ is capped at week 7. Nothing here has been through external review.",
  },
};

const catalogues: Record<Locale, Catalogue> = { en };

let active: Locale = "en";

/* ---------------------------------------------------------------- format */

let dateLong: Intl.DateTimeFormat;
let dateWeek: Intl.DateTimeFormat;
let nfLong: Intl.NumberFormat;
let nfCompact: Intl.NumberFormat;
let pluralRules: Intl.PluralRules;
let dateDayMonth: Intl.DateTimeFormat;
let nfEurM: Intl.NumberFormat;

function rebuild(): void {
  const loc = catalogues[active].meta.intl;
  dateLong = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  dateWeek = new Intl.DateTimeFormat(loc, { day: "numeric", month: "short" });
  dateDayMonth = new Intl.DateTimeFormat(loc, {
    day: "2-digit",
    month: "2-digit",
  });
  nfLong = new Intl.NumberFormat(loc);
  nfCompact = new Intl.NumberFormat(loc, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  nfEurM = new Intl.NumberFormat(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  pluralRules = new Intl.PluralRules(loc);
}
rebuild();

export const fmtDayMonth = (iso: string): string =>
  dateDayMonth.format(parseISO(iso));
export const eurM = (): Intl.NumberFormat => nfEurM;

/** ISO yyyy-mm-dd → local date, avoiding the UTC-midnight off-by-one. */
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** formatRange emits "16–22 Jan" for some locales; normalise the separator. */
const tidyDash = (s: string): string => s.replace(/\s*[–—]\s*/g, " – ");

function span(dtf: Intl.DateTimeFormat, from: string, to?: string): string {
  const a = parseISO(from);
  if (!to || to === from) return dtf.format(a);
  const b = parseISO(to);
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  return typeof dtf.formatRange === "function"
    ? tidyDash(dtf.formatRange(lo, hi))
    : `${dtf.format(lo)} – ${dtf.format(hi)}`;
}

export const fmtDate = (iso: string): string => dateLong.format(parseISO(iso));
export const fmtWeek = (from: string, to: string): string =>
  span(dateWeek, from, to);
export const fmtSpan = (from: string, to: string): string =>
  span(dateLong, from, to);
export const fmtWhen = (w?: { from: string; to?: string }): string =>
  w ? span(dateLong, w.from, w.to) : "";

export const nf = (): Intl.NumberFormat => nfLong;
export const compact = (): Intl.NumberFormat => nfCompact;

/* -------------------------------------------------------------- messages */

export const t = (): Catalogue => catalogues[active];

export function fill(
  pattern: string,
  vars: Record<string, string | number>,
): string {
  return pattern.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] === undefined ? `{${k}}` : String(vars[k]),
  );
}

export function plural(forms: Record<string, string>, n: number): string {
  return fill(forms[pluralRules.select(n)] ?? forms.other, {
    n: nfLong.format(n),
  });
}

/* --------------------------------------------------------------- locale */

export const LOCALES = Object.keys(catalogues) as Locale[];

export const getLocale = (): Locale => active;

const listeners = new Set<() => void>();

export function onLocaleChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setLocale(locale: Locale): void {
  if (locale === active || !catalogues[locale]) return;
  active = locale;
  rebuild();
  for (const fn of listeners) fn();
}
