/* =============================================================== per capita
 *
 * Turnout as a share of the population, for sections A, B and C.
 *
 * ── The stack ─────────────────────────────────────────────────────────────
 * 100 % stacked, drawn explicitly in `pcStack`: a blue polygon from the axis
 * floor up to the turnout line, and a pale polygon from the turnout line up
 * to the stack total (100 %). The two share that polyline as a boundary and
 * tile the plot area exactly, which is what "100 % stacked" means. It is NOT
 * Chart.js `stacked: true` — segment lengths are not additive on a log axis,
 * so the polygons are built from pixel positions in one pass.
 *
 * ── The axis ──────────────────────────────────────────────────────────────
 * Logarithmic, floor derived from the smallest plotted share (one decade of
 * headroom), ceil fixed at the stack total of 100 % — the total, not a cap.
 *
 * ── Data density ──────────────────────────────────────────────────────────
 * Only nine days carry a published crowd. `spanGaps` connects them and the
 * area is interpolated between observations; the nine are marked with dots so
 * an interpolated stretch is visibly different from a measured day.
 */

import {
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LogarithmicScale,
  PointElement,
  Tooltip,
  type ChartDataset,
  type ChartOptions,
  type Plugin,
  type Scale,
  type TooltipItem,
} from "chart.js";
import { dataTable, keyboardChart } from "./a11y.ts";
import { THEME, track } from "./canvas.ts";
import { DAILY, DATES, WEEKLY, WEEKS, type Pt as DayPt } from "./data.ts";
import { byId, el } from "./dom.ts";
import { EPISODES, seriesData } from "./episodes.ts";
import {
  a11y,
  fill,
  fmtDate,
  fmtDayMonth,
  fmtWeek,
  getLocale,
  nf,
  t,
} from "./i18n.ts";
import type { Episode } from "./model.ts";
import {
  KEY_2026,
  basisOf,
  denominator,
  pctOfValue,
  popKeyFor,
  population,
} from "./population.ts";
import { wrapTooltipLines } from "./tooltip.ts";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LogarithmicScale,
  Tooltip,
  Legend,
);

/* ----- constants */

const BLUE = "#1d4ed8";
const PALE = "rgba(29,78,216,0.10)";
/** The top of the stack. Not a cap: 100 % is the whole country. */
const STACK_TOTAL = 100;

/* ----- copy */

interface Bi {
  readonly en: string;
  readonly fr: string;
}
const L = (o: Bi): string =>
  String(getLocale()).slice(0, 2) === "fr" ? o.fr : o.en;

const COPY = {
  turnout: { en: "In the street", fr: "Dans la rue" },
  rest: { en: "The rest of the population", fr: "Le reste de la population" },
  measured: { en: "Measured day", fr: "Jour mesuré" },
  logNote: {
    en: "· log scale: band heights are not proportional",
    fr: "· échelle log : les hauteurs ne sont pas proportionnelles",
  },
  axisY: {
    en: "Share of the population (log)",
    fr: "Part de la population (log)",
  },
  axisDate: { en: "Date", fr: "Date" },
  axisWeek: { en: "Week", fr: "Semaine" },
  axisWeekNo: { en: "Week of the movement", fr: "Semaine du mouvement" },
  titleA: {
    en: "Turnout as a share of the population, day by day",
    fr: "La foule rapportée à la population, jour par jour",
  },
  titleB: {
    en: "Weekly peak as a share of the population",
    fr: "Pointe hebdomadaire rapportée à la population",
  },
  ttCount: { en: "{v} in the street", fr: "{v} dans la rue" },
  ttShare: { en: "{v} of the population", fr: "{v} de la population" },
  tableCaption: {
    en: "Table of figures: {title}",
    fr: "Tableau des chiffres : {title}",
  },
  colDate: { en: "Date", fr: "Date" },
  colWeek: { en: "Week", fr: "Semaine" },
  colCount: { en: "Count", fr: "Décompte" },
  colShare: { en: "Share of population", fr: "Part de la population" },
  base: { en: "Population {n}", fr: "Population {n}" },
  metro: { en: "metropolitan France", fr: "France métropolitaine" },
  noBase: { en: "no denominator", fr: "pas de dénominateur" },
  noteA: {
    en: "France entière — {pop} residents at 1 January 2026 (INSEE, provisional). Nine days carry a published crowd; the band is interpolated between them and those nine are marked with a dot. Blue is the ministry count, and the organisers’ ceiling is in the tooltip. Logarithmic axis from {min} to 100 %: it spreads the range so small shares are readable, so band heights are not proportional to population. The 29 September count is a floor — public-service cortège only.",
    fr: "France entière — {pop} habitants au 1er janvier 2026 (INSEE, chiffre provisoire). Neuf jours portent une foule publiée ; la bande est interpolée entre eux et ces neuf jours sont marqués d’un point. Le bleu est le décompte ministériel, la borne syndicale est dans l’infobulle. Axe logarithmique de {min} à 100 % : il étale la plage pour rendre les petites parts lisibles, les hauteurs ne sont donc pas proportionnelles à la population. Le décompte du 29 septembre est un plancher — cortège de la fonction publique seulement.",
  },
  noteB: {
    en: "The peak day of each week, against France entière — {pop} residents. A peak, not a sum: the same person is counted once per day. Logarithmic axis from {min} to 100 %: band heights are not proportional.",
    fr: "Le jour de pointe de chaque semaine, rapporté à la France entière — {pop} habitants. Une pointe, pas une somme : une même personne est comptée une fois par jour. Axe logarithmique de {min} à 100 % : les hauteurs ne sont pas proportionnelles.",
  },
  noteC: {
    en: "Each panel uses the population of its own year and the same logarithmic axis, so the seven are comparable. May 68 is read against metropolitan France — 49 711 853 residents at the census of 7 March 1968 — because no France-entière count exists for that year in this vintage; the metropolitan base is narrower than France entière by the overseas departments, so its rate reads a little high against the others. On it, 13 May is 0,40 % to 2,01 % of the country: 200 000 according to the prefecture, over a million according to the organisers, and that fivefold band is the disagreement, not an error bar. Its crowd is a scholarly reconstruction, so its rate is a magnitude, not a measurement. The Gilets jaunes count includes road blockades (Act I); the Nahel crowd is an episode-level estimate.",
    fr: "Chaque panneau utilise la population de son année et le même axe logarithmique : les sept sont comparables. Mai 68 est rapporté à la France métropolitaine — 49 711 853 habitants au recensement du 7 mars 1968 — car aucun décompte France entière n’existe pour cette année dans cette version ; la base métropolitaine est plus étroite que la France entière du fait des départements d’outre-mer, son taux est donc un peu surestimé par rapport aux autres. Sur cette base, le 13 mai représente de 0,40 % à 2,01 % du pays : 200 000 selon la préfecture, plus d’un million selon les organisateurs, et cette fourchette de 1 à 5 est le désaccord, non une barre d’erreur. Sa foule est une reconstruction savante : son taux est un ordre de grandeur, non une mesure. Le décompte des Gilets jaunes inclut les blocages routiers (acte I) ; la foule du mouvement Nahel est une estimation d’épisode.",
  },
} as const satisfies Record<string, Bi>;

const SHARE = {
  france: { en: "Share of population", fr: "Part de la population" },
  metropole: {
    en: "Share of the metropolitan population",
    fr: "Part de la population métropolitaine",
  },
  ttFrance: { en: "{v} of the population", fr: "{v} de la population" },
  ttMetro: {
    en: "{v} of the metropolitan population",
    fr: "{v} de la population métropolitaine",
  },
} as const satisfies Record<string, Bi>;

/* ----- rows */

interface Row {
  readonly key: string;
  readonly title: string;
  readonly p: number | null; // fraction: 0.008
  readonly plo: number | null;
  readonly phi: number | null;
  readonly lo: number | null;
  readonly hi: number | null;
  readonly note?: string;
  readonly basis?: "france" | "metro"; // which denominator produced plo/phi
}

/* ----- formatting */

let tag = "";
let pctFmt: Intl.NumberFormat | null = null;

function locale(): string {
  const next = String(getLocale()).slice(0, 2) === "fr" ? "fr-FR" : "en-GB";
  if (next !== tag) {
    tag = next;
    pctFmt = new Intl.NumberFormat(next, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return next;
}

const pctText = (v: number | null): string => {
  locale();
  return v === null ? "—" : pctFmt!.format(v);
};

const pctBand = (lo: number | null, hi: number | null): string => {
  if (lo === null || hi === null) return "—";
  const a = pctText(lo);
  return Math.abs(hi - lo) < 1e-9 ? a : `${a} – ${pctText(hi)}`;
};

const countText = (v: number | null): string =>
  v === null ? "—" : nf().format(Math.round(v));

const countBand = (r: Row): string => {
  if (r.lo === null) return "—";
  const hi = r.hi ?? r.lo;
  return Math.abs(hi - r.lo) < 1e-9
    ? countText(r.lo)
    : `${countText(r.lo)} – ${countText(hi)}`;
};

/** Percent value (0.8 means 0.8 %) → "0,80 %" / "0.80%", decimals derived
 *  from the magnitude so a 0,001 % tick keeps its zeros. */
function tickText(v: number): string {
  const exp = Math.round(Math.log10(v));
  const d = Math.max(0, -exp);
  const n = new Intl.NumberFormat(locale(), {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(v);
  return locale() === "fr-FR" ? `${n} %` : `${n}%`;
}

/* ----- row builders */

function dailyRows(): Row[] {
  const pop = population(KEY_2026);
  const notes = t().chart.dayNotes as Record<string, string | undefined>;
  return DATES.map((d, i) => {
    const p = DAILY.turnout[i] as DayPt | undefined;
    const v = p?.v ?? null;
    const hi = p?.band?.[1] ?? v;
    const plo = v === null ? null : pctOfValue(v, pop);
    const phi = hi === null ? null : pctOfValue(hi, pop);
    return {
      key: fmtDayMonth(d),
      title: fmtDate(d),
      p: plo === null ? null : plo / 100,
      plo: plo === null ? null : plo / 100,
      phi: phi === null ? null : phi / 100,
      lo: v,
      hi: hi ?? null,
      note: notes?.[d],
    };
  });
}

function weeklyRows(): Row[] {
  const pop = population(KEY_2026);
  return WEEKS.map((w, i) => {
    const p = WEEKLY.turnout[i] as DayPt | undefined;
    const v = p?.v ?? null;
    const hi = p?.band?.[1] ?? v;
    const plo = v === null ? null : pctOfValue(v, pop);
    const phi = hi === null ? null : pctOfValue(hi, pop);
    return {
      key: String(w.key),
      title: fmtWeek(w.key, w.end),
      p: plo === null ? null : plo / 100,
      plo: plo === null ? null : plo / 100,
      phi: phi === null ? null : phi / 100,
      lo: v,
      hi: hi ?? null,
    };
  });
}

function episodeRows(ep: Episode): Row[] {
  const pop = population(popKeyFor(ep.id));
  const basis = basisOf(pop) ?? undefined; // 1968 → "metro"
  const pts = seriesData(ep, "p") ?? [];
  const byWeek = new Map(pts.map((p) => [p.x, p]));

  /* Derive the span from the series as well as the week rows: an episode
     with no `weeks` gave maxW = 1, which is why the June 2023 panel drew an
     axis reading 0…1 and a single point. */
  const span = Math.max(...pts.map((p) => p.x), ...ep.weeks.map((r) => r.w), 0);

  const out: Row[] = [];
  for (let w = 0; w <= span; w++) {
    const p = byWeek.get(w);
    if (!p) {
      out.push({
        key: String(w),
        title: String(w),
        p: null,
        plo: null,
        phi: null,
        lo: null,
        hi: null,
        basis,
      });
      continue;
    }
    /* Fall back to the point estimate when a series carries no band, so a
       single-figure observation still plots and still prints a share. */
    const lo = p.low ?? p.y ?? null;
    const hi = p.high ?? p.y ?? null;
    const mid = pctOfValue(p.y, pop);
    const plo = pctOfValue(lo, pop);
    const phi = pctOfValue(hi, pop);
    out.push({
      key: String(w),
      title: p.t,
      p: mid === null ? null : mid / 100,
      plo: plo === null ? null : plo / 100,
      phi: phi === null ? null : phi / 100,
      lo,
      hi,
      note: p.note,
      basis,
    });
  }
  return out;
}

/* ----- plugins */

/** 100 % stack. Blue from the axis floor to the turnout line, pale from the
 *  turnout line to the stack total. Drawn from pixel positions so the log
 *  scale cannot distort the two areas relative to each other. */
const pcStack: Plugin<"line"> = {
  id: "pcStack",
  beforeDatasetsDraw(chart) {
    const data = chart.data.datasets[0]?.data as (number | null)[] | undefined;
    if (!data) return;

    const meta = chart.getDatasetMeta(0);
    const pts: Array<{ x: number; y: number }> = [];
    meta.data.forEach((item, i) => {
      const v = data[i];
      if (v === null || v === undefined || !(v > 0)) return;
      pts.push({ x: item.x, y: item.y });
    });
    if (!pts.length) return;

    const { ctx, chartArea, scales } = chart;
    const yTop = scales.y?.getPixelForValue(STACK_TOTAL) ?? chartArea.top;
    const yBottom = chartArea.bottom;
    const x0 = pts[0].x;
    const xN = pts[pts.length - 1].x;

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      chartArea.bottom - chartArea.top,
    );
    ctx.clip();

    // remainder: stack total down to the turnout line
    ctx.beginPath();
    ctx.moveTo(x0, yTop);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.lineTo(xN, yTop);
    ctx.closePath();
    ctx.fillStyle = PALE;
    ctx.fill();

    // turnout: axis floor up to the turnout line
    ctx.beginPath();
    ctx.moveTo(x0, yBottom);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.lineTo(xN, yBottom);
    ctx.closePath();
    ctx.fillStyle = BLUE;
    ctx.fill();

    ctx.restore();
  },
};

/** The peak value above the point, with a halo: a 0.8 % band is 48 % of a log
 *  axis but only ~5 px of a linear one, and the eye should not have to measure. */
const pcPeak: Plugin<"line"> = {
  id: "pcPeak",
  afterDatasetsDraw(chart) {
    const ds = chart.data.datasets[0] as
      | ChartDataset<"line", (number | null)[]>
      | undefined;
    if (!ds) return;
    const data = ds.data as (number | null)[];

    let best = -1;
    let bestV = -Infinity;
    data.forEach((v, j) => {
      if (v !== null && v > bestV) {
        bestV = v;
        best = j;
      }
    });
    if (best < 0) return;

    const at = chart.getDatasetMeta(0).data[best];
    if (!at) return;

    const { ctx, chartArea } = chart;
    const text = tickText(bestV);
    ctx.save();
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const x = Math.min(
      Math.max(at.x, chartArea.left + 30),
      chartArea.right - 30,
    );
    const y = Math.max(at.y - 7, chartArea.top + 14);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = BLUE;
    ctx.fillText(text, x, y);
    ctx.restore();
  },
};

/* ----- chart */

interface Cfg {
  data: {
    labels: string[];
    datasets: ChartDataset<"line", (number | null)[]>[];
  };
  options: ChartOptions<"line">;
}

interface Opts {
  readonly xTitle: string;
  readonly rotate: boolean;
  readonly maxTicks: number;
  readonly showY: boolean;
  readonly floor?: number;
}

/** Floor = one decade below the smallest plotted share, derived per panel so
 *  a panel whose minimum is 0.07 % is not crushed by a fixed 0.01 % floor. */
function axisFloor(values: readonly number[]): number {
  const pos = values.filter((v) => v > 0);
  if (!pos.length) return 0.01;
  return Math.pow(10, Math.floor(Math.log10(Math.min(...pos))) - 1);
}

function build(rows: readonly Row[], o: Opts): Cfg | null {
  const plotted = rows.map((r) => (r.p === null ? null : r.p * 100));
  if (!plotted.some((v) => v !== null && v > 0)) return null;

  const floor = o.floor ?? axisFloor(plotted as number[]);
  const decades: number[] = [];
  for (
    let e = Math.round(Math.log10(floor));
    e <= Math.log10(STACK_TOTAL);
    e++
  ) {
    decades.push(Number(Math.pow(10, e).toPrecision(12)));
  }

  const dataset: ChartDataset<"line", (number | null)[]> = {
    label: L(COPY.turnout),
    data: plotted,
    borderColor: BLUE,
    backgroundColor: "transparent", // the area is drawn by pcStack
    borderWidth: 2,
    // nine observations across 58 days: without this the series is invisible
    spanGaps: true,
    tension: 0,
    pointRadius: (ctx) => (ctx.raw === null ? 0 : 3),
    pointBackgroundColor: "#fff",
    pointBorderColor: BLUE,
    pointBorderWidth: 1.5,
    pointHoverRadius: 5,
    pointHitRadius: 12,
    fill: false,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    layout: { padding: { top: 16, right: 16, bottom: 0, left: 4 } },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          maxRotation: o.rotate ? 90 : 0,
          autoSkip: true,
          maxTicksLimit: o.maxTicks,
          font: { size: 10 },
          color: THEME.muted,
          padding: 4,
        },
        title: {
          display: Boolean(o.xTitle),
          text: o.xTitle,
          color: THEME.label,
          font: { size: 11 },
          padding: { top: 4 },
        },
      },
      y: {
        type: "logarithmic",
        min: floor,
        max: STACK_TOTAL,
        border: { display: false },
        grid: { color: THEME.axisGrid, drawTicks: false },
        afterBuildTicks: (axis: Scale) => {
          axis.ticks = decades.map((value) => ({ value }));
        },
        ticks: {
          display: o.showY,
          font: { size: 10 },
          color: THEME.muted,
          padding: 6,
          callback: (v) => tickText(Number(v)),
        },
        title: {
          display: o.showY,
          text: L(COPY.axisY),
          color: THEME.label,
          font: { size: 11 },
          padding: { bottom: 4 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: THEME.tooltipBg,
        titleColor: THEME.tooltipInk,
        bodyColor: THEME.tooltipInk,
        borderColor: THEME.grid,
        borderWidth: 1,
        callbacks: {
          title: (items: TooltipItem<"line">[]) =>
            wrapTooltipLines(
              rows[items[0]?.dataIndex ?? 0]?.title ?? "",
              items[0],
              "title",
            ),
          label: (item: TooltipItem<"line">) => {
            const r = rows[item.dataIndex];
            if (!r) return "";
            const lines: string[] = [];
            if (r.lo !== null)
              lines.push(fill(L(COPY.ttCount), { v: countBand(r) }));
            lines.push(fill(L(COPY.ttShare), { v: pctBand(r.plo, r.phi) }));
            return wrapTooltipLines(lines.join("\n"), item, "body");
          },
          footer: (items: TooltipItem<"line">[]) => {
            const r = rows[items[0]?.dataIndex ?? 0];
            return r?.note ? wrapTooltipLines(r.note, items[0], "footer") : "";
          },
        },
      },
    },
  };

  return {
    data: { labels: rows.map((r) => r.key), datasets: [dataset] },
    options,
  };
}

/* ----- DOM */

function legendRow(): HTMLElement {
  const row = el("div", "pc-legend");
  const chip = (bg: string, text: string, ring: boolean): HTMLElement => {
    const span = el("span", "pc-chip");
    const sw = el("span", "pc-swatch");
    sw.style.background = bg;
    if (ring) {
      sw.style.border = `1.5px solid ${BLUE}`;
      sw.style.background = "#fff";
      sw.style.borderRadius = "50%";
    }
    span.append(sw, document.createTextNode(text));
    return span;
  };
  row.append(
    chip(BLUE, L(COPY.turnout), false),
    chip(PALE, `${L(COPY.rest)} ${L(COPY.logNote)}`, false),
    chip("#fff", L(COPY.measured), true),
  );
  return row;
}

/* render(): the share column and the tooltip both name the base of the rows
   they describe, so a métropole row never borrows the France-entière label. */
function render(
  host: HTMLElement,
  rows: readonly Row[],
  o: Opts,
  title: string,
  note: string,
  firstCol: string,
): void {
  const cfg = build(rows, o);
  if (!cfg) return;

  const metro = rows.some((r) => r.basis === "metropole");
  const shareHeader = metro ? L(SHARE.metropole) : L(SHARE.france);

  const figure = el("figure", "pc-figure");
  const cap = el("figcaption", "pc-caption");
  cap.append(el("span", "pc-fig-title", title), legendRow());

  const box = el("div", "pc-canvas");
  const canvas = el("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", title);
  box.append(canvas);
  figure.append(cap, box);

  figure.append(
    dataTable({
      caption: fill(L(COPY.tableCaption), { title }),
      indexHeader: firstCol,
      index: rows.map((r) => r.title),
      columns: [
        { header: L(COPY.colCount), values: rows.map(countBand) },
        { header: shareHeader, values: rows.map((r) => pctBand(r.plo, r.phi)) },
      ],
    }),
  );

  // the shared disclosure every other chart on the site uses
  figure.append(
    dataTable({
      caption: fill(L(COPY.tableCaption), { title }),
      indexHeader: firstCol,
      index: rows.map((r) => r.title),
      columns: [
        { header: L(COPY.colCount), values: rows.map(countBand) },
        {
          header: L(COPY.colShare),
          values: rows.map((r) => pctBand(r.plo, r.phi)),
        },
      ],
    }),
  );
  figure.append(el("p", "pc-note", note));
  host.append(figure);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const chart = track(
    new Chart(ctx, {
      type: "line",
      data: cfg.data,
      options: cfg.options,
      plugins: [pcStack, pcPeak],
    }),
  );
  keyboardChart(chart, {
    hint: a11y().chartHint,
    roledescription: a11y().chartRole,
    readout: (i) => {
      const r = rows[i];
      return r
        ? `${r.title}. ${countBand(r)}. ${pctBand(r.plo, r.phi)}`
        : String(i + 1);
    },
  });
}

/* ----- sections */

function floorLabel(rows: readonly Row[]): string {
  const vals = rows.map((r) => (r.p === null ? 0 : r.p * 100));
  return tickText(axisFloor(vals));
}

function sectionA(host: HTMLElement): void {
  const pop = population(KEY_2026);
  const rows = dailyRows();
  render(
    host,
    rows,
    { xTitle: L(COPY.axisDate), rotate: true, maxTicks: 25, showY: true },
    L(COPY.titleA),
    fill(L(COPY.noteA), {
      pop: nf().format(denominator(pop) ?? 0),
      min: floorLabel(rows),
    }),
    L(COPY.colDate),
  );
}

function sectionB(host: HTMLElement): void {
  const pop = population(KEY_2026);
  const rows = weeklyRows();
  render(
    host,
    rows,
    { xTitle: L(COPY.axisWeek), rotate: false, maxTicks: 12, showY: true },
    L(COPY.titleB),
    fill(L(COPY.noteB), {
      pop: nf().format(denominator(pop) ?? 0),
      min: floorLabel(rows),
    }),
    L(COPY.colWeek),
  );
}

/* sectionC(): one shared floor for the whole trellis. A per-panel floor made
   two points at the same height mean different shares, which is the one thing
   a trellis must not do — and it is what put 1968 at 40 % while Nahel sat at
   21 % on a different scale. */
function sectionC(host: HTMLElement): void {
  const m = t();
  const cols = host.clientWidth >= 1180 ? 4 : host.clientWidth >= 620 ? 2 : 1;
  host.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  const panels = EPISODES.map((ep) => ({ ep, rows: episodeRows(ep) }));
  const floor = axisFloor(
    panels.flatMap((p) => p.rows.map((r) => (r.p === null ? 0 : r.p * 100))),
  );

  panels.forEach(({ ep, rows }, idx) => {
    const pop = population(popKeyFor(ep.id));
    const base = denominator(pop);
    const caption =
      base === null
        ? L(COPY.noBase)
        : fill(L(COPY.base), {
            n: `${nf().format(base)}${basisOf(pop) === "metro" ? ` · ${L(COPY.metro)}` : ""}`,
          });

    const panel = el("div", "pc-panel");
    render(
      panel,
      rows,
      {
        xTitle: idx >= EPISODES.length - cols ? L(COPY.axisWeekNo) : "",
        rotate: false,
        maxTicks: 9,
        showY: idx % cols === 0,
        floor,
      },
      `${m.episodes[ep.id].short} · ${caption}`,
      "",
      L(COPY.colWeek),
    );
    host.append(panel);
  });

  const head = el("div", "pc-trellis-head");
  head.append(el("p", "pc-note", L(COPY.noteC)));
  host.append(head);
}

/* ----- mount */

export function mountPerCapita(): void {
  const a = byId("pc-a");
  if (a) {
    a.replaceChildren();
    try {
      sectionA(a);
    } catch (e) {
      console.error("[percapita A]", e);
    }
  }

  const b = byId("pc-b");
  if (b) {
    b.replaceChildren();
    try {
      sectionB(b);
    } catch (e) {
      console.error("[percapita B]", e);
    }
  }

  const c = byId("pc-c");
  if (c) {
    c.replaceChildren();
    try {
      sectionC(c);
    } catch (e) {
      console.error("[percapita C]", e);
    }
  }
}
