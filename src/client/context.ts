/* =============================================================== context
 *
 * Stage 2 — what was happening around the chart.
 *
 * Two families, kept apart because merging them would be a category error:
 *
 *   · the SCHOOL CALENDAR is a fact about the population being counted.
 *     During the Toussaint break no lycée is in session, so "blocked lycées"
 *     is not a low number: the metric did not exist, and the gap is the
 *     calendar rather than the movement.
 *   · a RESTRICTION is a decision taken against the movement. It has a legal
 *     author, and the author's level IS the scope: national law, a prefect's
 *     arrêté, a mayor's arrêté, or a rectorat closing one establishment.
 *     A nationwide ban and a curfew in one city are different layers and are
 *     never summed into "restrictions in force".
 *
 * Every span carries its own source string, printed in the table. A span with
 * no source is rendered nowhere — the table would otherwise assert something
 * nobody wrote down.
 *
 * One registry, four consumers: section A by day, section B by week, section
 * C by week index inside each episode, and the strip below. Resolution is by
 * overlap, so the 1968 span simply does not exist for a 2026 chart and no
 * per-section filtering is needed at the call sites.
 */

import type { Plugin } from "chart.js";
import { dataTable } from "./a11y.ts";
import { DATES, END, HOLIDAY_END, HOLIDAY_START, START } from "./data.ts";
import { byId, el } from "./dom.ts";
import { fmtDate, getLocale } from "./i18n.ts";

/* ----- copy */

interface Bi {
  readonly en: string;
  readonly fr: string;
}
const L = (o: Bi): string =>
  String(getLocale()).slice(0, 2) === "fr" ? o.fr : o.en;

/* ----- scope taxonomy */

export type RestrictionScope = "national" | "prefectoral" | "municipal";

export type ContextKind = "school" | RestrictionScope;

export const LAYERS: readonly { kind: ContextKind; label: Bi; note?: Bi }[] = [
  {
    kind: "school",
    label: { en: "School calendar", fr: "Calendrier scolaire" },
  },
  {
    kind: "national",
    label: { en: "National", fr: "National" },
    note: {
      en: "A ban applying to the whole territory.",
      fr: "Une interdiction valant pour tout le territoire.",
    },
  },
  {
    kind: "prefectoral",
    label: { en: "Prefectoral", fr: "Préfectoral" },
    note: {
      en: "An arrêté by a prefect or the préfet de police: one department or one city.",
      fr: "Un arrêté d’un préfet ou du préfet de police : un département ou une ville.",
    },
  },
  {
    kind: "municipal",
    label: { en: "Municipal", fr: "Municipal" },
    note: {
      en: "An arrêté by a mayor. Kept separate from the prefectoral layer even when it covers the same streets.",
      fr: "Un arrêté d’un maire. Séparé de la couche préfectorale même lorsqu’il couvre les mêmes rues.",
    },
  },
];

/* national moved off #b91c1c: that is the arrests series colour on every 2026
   chart, and a ban band in the same red read as an arrests area. */
export const KIND_COLOR: Readonly<Record<ContextKind, string>> = {
  school: "#b45309",
  national: "#7f1d1d",
  prefectoral: "#7c3aed",
  municipal: "#0e7490",
};

/* ----- the registry */

export interface Span {
  readonly id: string;
  readonly kind: ContextKind;
  readonly from: string; // ISO, inclusive
  readonly to: string; // ISO, inclusive
  readonly label: Bi;
  readonly detail: Bi;
  readonly source: string;
}

export const SPANS: readonly Span[] = [
  {
    id: "toussaint",
    kind: "school",
    from: HOLIDAY_START,
    to: HOLIDAY_END,
    label: { en: "Toussaint break", fr: "Vacances de la Toussaint" },
    detail: {
      en: "Classes end Saturday 17 October and resume Monday 2 November, the same dates in zones A, B and C. The band starts on 18 October, the first day with no school anywhere: 17 October was a school day and carries the peak of the movement. Nothing school-based exists on these days — a blocked lycée is not a small number here, it is not a number.",
      fr: "Les cours s’arrêtent le samedi 17 octobre et reprennent le lundi 2 novembre, mêmes dates dans les zones A, B et C. La bande commence le 18 octobre, premier jour sans école : le 17 octobre était un jour de classe et porte la pointe du mouvement. Rien de scolaire n’existe ces jours-là — un lycée bloqué n’est pas un petit nombre, ce n’est pas un nombre.",
    },
    source:
      "education.gouv.fr, calendrier scolaire 2026-2027 · data.ts HOLIDAY_START / HOLIDAY_END",
  },
  {
    id: "protestBans",
    kind: "national",
    from: "2026-10-22",
    to: END,
    label: { en: "Protest bans", fr: "Interdictions de manifester" },
    detail: {
      en: "Macron announced that 'illegitimate' protests would be banned, which has been followed by a wave of prefectural bans",
      fr: "Macron a annoncé que les manifestations « illégitimes » seraient interdites, ce qui a été suivi d’une vague d’interdictions préfectorales.",
    },
    /* Fill this before shipping — a span whose source is a placeholder is a
       claim with no author. */
    source:
      "https://www.lemonde.fr/en/france/article/2026/10/22/french-city-of-lyon-bans-all-protests-on-saturday_6761449_7.html",
  },
];

/* ----- resolution: registry → chart x indices */

export interface ChartSpan {
  readonly x0: number; // first x index covered
  readonly x1: number; // last x index covered
  readonly kind: ContextKind;
  readonly label: string;
}

const DAY = 86_400_000;

/** Section A: index into DATES. A span outside the window resolves to nothing,
 *  so the 1968 ban never reaches a 2026 daily chart. */
export function daySpans(): ChartSpan[] {
  const out: ChartSpan[] = [];
  for (const s of SPANS) {
    const a = DATES.indexOf(s.from);
    const b = DATES.indexOf(s.to);
    if (a < 0 && b < 0) continue;
    out.push({
      x0: Math.max(0, a < 0 ? 0 : a),
      x1: Math.min(DATES.length - 1, b < 0 ? DATES.length - 1 : b),
      kind: s.kind,
      label: L(s.label),
    });
  }
  return out;
}

/** Sections B and C: resolve against the panel's own week rows, using each
 *  row's `w` (not its array position — episode weeks are sparse). */
export function weekSpans(
  weeks: readonly {
    readonly w: number;
    readonly from: string;
    readonly to: string;
  }[],
): ChartSpan[] {
  const out: ChartSpan[] = [];
  for (const s of SPANS) {
    let a = Number.POSITIVE_INFINITY;
    let b = Number.NEGATIVE_INFINITY;
    for (const wk of weeks) {
      if (s.from <= wk.to && s.to >= wk.from) {
        a = Math.min(a, wk.w);
        b = Math.max(b, wk.w);
      }
    }
    if (!Number.isFinite(a)) continue;
    out.push({ x0: a, x1: b, kind: s.kind, label: L(s.label) });
  }
  return out;
}

/* ----- chart band plugin */

const withAlpha = (hex: string, a: number): string => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Shaded background bands, drawn under every dataset. A category scale gives
 *  a pixel per tick CENTRE, so a band runs midpoint-to-midpoint and is clamped
 *  to the plot area at both ends — otherwise a one-day span is 0 px wide. */
export const contextBands: Plugin<"line"> = {
  id: "contextBands",
  beforeDatasetsDraw(chart) {
    const cfg = (
      chart.options.plugins as unknown as
        | { contextBands?: { spans?: readonly ChartSpan[] } }
        | undefined
    )?.contextBands;
    const spans = cfg?.spans;
    if (!spans?.length) return;

    const xs = chart.scales.x;
    const { ctx, chartArea } = chart;
    const count = chart.data.labels?.length ?? 0;
    if (!xs || count === 0) return;

    const left = (i: number): number =>
      i <= 0
        ? chartArea.left
        : (xs.getPixelForValue(i - 1) + xs.getPixelForValue(i)) / 2;
    const right = (i: number): number =>
      i >= count - 1
        ? chartArea.right
        : (xs.getPixelForValue(i) + xs.getPixelForValue(i + 1)) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.clip();

    for (const s of spans) {
      const a = Math.min(s.x0, s.x1);
      const b = Math.max(s.x0, s.x1);
      const x0 = left(a);
      const x1 = right(b);
      if (x1 - x0 < 1) continue;

      const color = KIND_COLOR[s.kind];

      ctx.fillStyle = withAlpha(color, s.kind === "school" ? 0.09 : 0.07);
      ctx.fillRect(x0, chartArea.top, x1 - x0, chartArea.height);

      if (s.kind === "school") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x0, chartArea.top, x1 - x0, chartArea.height);
        ctx.clip();
        ctx.strokeStyle = withAlpha(color, 0.16);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = x0 - chartArea.height; x < x1; x += 6) {
          ctx.moveTo(x, chartArea.bottom);
          ctx.lineTo(x + chartArea.height, chartArea.top);
        }
        ctx.stroke();
        ctx.restore();
      }

      if (s.kind !== "school") {
        ctx.strokeStyle = withAlpha(color, 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x0, chartArea.top + 0.75);
        ctx.lineTo(x1, chartArea.top + 0.75);
        ctx.stroke();
      }
    }

    /* ----- labels: left-anchored, two rows -----
       Centring put each label at its band's midpoint, which is how "Toussaint
       break" landed on top of "Protest bans": a thirteen-day band and a
       sixteen-week band had midpoints a few pixels apart. Two rules replace it.
         · anchor at the band's LEFT edge, so the label marks where the span
           starts rather than where its middle happens to fall;
         · pack into rows, left to right, moving to the second row when the
           previous label on this row is still on screen.
       Spans arrive in registry order, not x order, so the list is sorted first.
       A label that finds no room in two rows is dropped, not nudged: a moved
       label points at the wrong date. */
    ctx.font = "600 9px system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    const rowRight: number[] = [];
    const ordered = spans
      .map((s) => {
        const a = Math.min(s.x0, s.x1);
        const b = Math.max(s.x0, s.x1);
        return { s, x0: left(a), x1: right(b) };
      })
      .filter((o) => o.x1 - o.x0 >= 1)
      .sort((p, q) => p.x0 - q.x0);

    for (const { s, x0 } of ordered) {
      const w = ctx.measureText(s.label).width;
      const x = Math.min(x0 + 4, chartArea.right - w - 4);
      if (x < chartArea.left + 2) continue;

      let row = rowRight.findIndex((edge) => x >= edge + 8);
      if (row < 0) {
        if (rowRight.length >= 2) continue;
        row = rowRight.length;
        rowRight.push(Number.NEGATIVE_INFINITY);
      }
      rowRight[row] = x + w;

      ctx.fillStyle = withAlpha(KIND_COLOR[s.kind], 0.9);
      ctx.fillText(s.label, x, chartArea.top + 5 + row * 11);
    }

    ctx.restore();
  },
};

/* ----- the strip */

const RANGE: Range = {
  from: START,
  to: END,
  title: { en: "The 2026 window", fr: "La fenêtre 2026" },
};

function renderStrip(host: HTMLElement): void {
  const figure = el("figure", "ctx-figure");
  const cap = el("figcaption", "ctx-caption");
  cap.textContent = fillL(
    {
      en: "Context, not causation: {title}. Each layer keeps its own legal author.",
      fr: "Contexte, non causalité : {title}. Chaque couche garde son auteur juridique.",
    },
    { title: L(RANGE.title) },
  );
  figure.append(cap);

  const strip = el("div", "ctx-strip");
  /* `to: END` on the ban means this filter keeps it for any span that
     intersects the window at all, including one that overruns the end. */
  const spans = SPANS.filter((s) => s.to >= RANGE.from && s.from <= RANGE.to);

  for (const layer of LAYERS) {
    const mine = spans.filter((s) => s.kind === layer.kind);
    // An empty restriction layer is omitted, except the municipal one: its
    // absence is the finding, not a gap in the drawing.
    if (!mine.length && layer.kind !== "municipal") continue;
    strip.append(stripRow(layer.kind, L(layer.label), mine));
  }
  strip.append(axisRow());
  figure.append(strip);

  figure.append(
    dataTable({
      caption: fillL(
        { en: "Context spans: {title}", fr: "Repères de contexte : {title}" },
        { title: L(RANGE.title) },
      ),
      indexHeader: L({ en: "Dates", fr: "Dates" }),
      index: spans.map((s) =>
        s.from === s.to
          ? fmtDate(s.from)
          : `${fmtDate(s.from)} – ${fmtDate(s.to)}`,
      ),
      columns: [
        {
          header: L({ en: "Layer", fr: "Couche" }),
          values: spans.map((s) =>
            L(LAYERS.find((l) => l.kind === s.kind)?.label ?? s.label),
          ),
        },
        {
          header: L({ en: "Measure", fr: "Mesure" }),
          values: spans.map((s) => L(s.label)),
        },
        {
          header: L({ en: "Source", fr: "Source" }),
          values: spans.map((s) => s.source),
        },
      ],
    }),
  );

  const details = el("div", "ctx-details");
  for (const s of spans)
    details.append(el("p", "ctx-note", `${L(s.label)} — ${L(s.detail)}`));
  details.append(
    el(
      "p",
      "ctx-note",
      L({
        en: "No prefectoral or municipal measure is recorded in this window: the only spans are the school calendar and the national ban. The municipal row is kept empty rather than omitted — a missing row reads as a clean sheet, an empty row reads as a check that came back empty.",
        fr: "Aucune mesure préfectorale ou municipale n’est enregistrée dans cette fenêtre : les seuls repères sont le calendrier scolaire et l’interdiction nationale. La ligne municipale est conservée vide plutôt que supprimée — une ligne absente se lit comme un casier vierge, une ligne vide comme une vérification revenue sans réponse.",
      }),
    ),
  );
  figure.append(details);

  host.append(figure);
}

/* `stripRow` and `axisRow` lose their `r: Range` parameter — one range now.
   Replace `r.from` / `r.to` with RANGE.from / RANGE.to inside both bodies. */

export function mountContext(): void {
  const a = byId("ctx-a");
  if (!a) return;
  a.replaceChildren();
  try {
    renderStrip(a);
  } catch (e) {
    console.error("[context A]", e);
  }
}
