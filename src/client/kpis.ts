/* ============================================================ KPI blocks
 *
 * Headline figures for sections A, B, C and D. Every number is computed from
 * the arrays the charts plot, so a KPI can never drift from the figure beneath
 * it:
 *
 *   - the daily and weekly points come from chart.ts's visiblePoints(), which
 *     applies the chart's own marker mask: the €1,000M damages total of
 *     24 Oct has no marker on the chart, so it is not a "largest day" here
 *     either and it does not drag a mean around;
 *   - section D's ratios use the same week cap as its panels;
 *   - each movement is compared with its own statistics, never with another's;
 *   - a day or week with no published figure is left out, not counted as zero.
 */

import { DATES, WEEKS } from "./data.ts";
import { visiblePoints } from "./chart.ts";
import { ENFORCEMENT_LAST, EPISODES, seriesData, type Pt } from "./episodes.ts";
import {
  compact,
  eurM,
  fill,
  fmtDate,
  fmtWeek,
  nf,
  t,
  type ChartCopy,
} from "./i18n.ts";
import { byId, el } from "./dom.ts";

type SeriesCopyKey = keyof ChartCopy["series"];

/* ----- what each KPI row is about ----- */

interface KpiSpec {
  /** Key in chart.series — the label the chart itself uses. */
  readonly copy: SeriesCopyKey;
  /** Key in DAILY / WEEKLY. */
  readonly data: string;
  readonly unit: "count" | "eurM";
}

const DAILY_SPECS: readonly KpiSpec[] = [
  { copy: "protestersDaily", data: "turnout", unit: "count" },
  { copy: "arrestsDaily", data: "arrests", unit: "count" },
  { copy: "forcesDaily", data: "forcesInjured", unit: "count" },
  { copy: "protestersInjuredDaily", data: "protesterInjured", unit: "count" },
  { copy: "blockadesDaily", data: "blockades", unit: "count" },
  { copy: "damagesDaily", data: "damagesCost", unit: "eurM" },
];

/* No weekly damage series exists: WEEKLY has no damagesCost, and the daily
   damage figures mix daily, cumulative and derived numbers, which cannot be
   summed into a weekly total without inventing a statistic. */
const WEEKLY_SPECS: readonly KpiSpec[] = [
  { copy: "protestersWeekly", data: "turnout", unit: "count" },
  { copy: "arrestsWeekly", data: "arrests", unit: "count" },
  { copy: "forcesWeekly", data: "forcesInjured", unit: "count" },
  { copy: "protestersInjuredWeekly", data: "protesterInjured", unit: "count" },
  { copy: "blockadesWeekly", data: "blockades", unit: "count" },
];

const METRIC_KEYS = ["p", "a", "f", "i"] as const;

/* ----- the numbers ----- */

interface Observation {
  readonly v: number;
  /** Where the figure sits: a date, a week, or a movement and a week. */
  readonly where: string;
}

interface Ratio {
  readonly obs: Observation;
  /** The ratio itself: v / base. */
  readonly pct: number;
  readonly base: number;
}

interface Row {
  readonly label: string;
  readonly unit: "count" | "eurM";
  readonly largest: Observation | null;
  readonly vsMean: Ratio | null;
  readonly vsMedian: Ratio | null;
  readonly vsFirst: Ratio | null;
}

function meanMedian(values: readonly number[]): {
  mean: number;
  median: number;
} | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = n >> 1;
  let sum = 0;
  for (const v of values) sum += v;
  return {
    mean: sum / n,
    median: n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
  };
}

/** The observation with the largest ratio to `base`. */
function bestRatio(obs: readonly Observation[], base: number): Ratio | null {
  if (!(base > 0)) return null;
  let best: Ratio | null = null;
  for (const o of obs) {
    const pct = o.v / base;
    if (!best || pct > best.pct) best = { obs: o, pct, base };
  }
  return best;
}

function bestValue(obs: readonly Observation[]): Observation | null {
  let best: Observation | null = null;
  for (const o of obs) if (!best || o.v > best.v) best = o;
  return best;
}

/* ----- sections A and B: the 2026 series ----- */

function dailyRows(weekly: boolean): Row[] {
  const specs = weekly ? WEEKLY_SPECS : DAILY_SPECS;

  return specs.map((spec) => {
    const pts = visiblePoints(spec.data, weekly);
    const obs: Observation[] = pts.map((p) => ({
      v: p.v,
      where: weekly
        ? fmtWeek(WEEKS[p.i].key, WEEKS[p.i].end)
        : fmtDate(DATES[p.i]),
    }));

    const st = meanMedian(obs.map((o) => o.v));
    /* visiblePoints keeps the index order and drops the gaps, so obs[0] is
       the first published figure, not the first day of the window. */
    const first = obs.length ? obs[0].v : 0;

    return {
      label: t().chart.series[spec.copy].label,
      unit: spec.unit,
      largest: bestValue(obs),
      vsMean: st ? bestRatio(obs, st.mean) : null,
      vsMedian: st ? bestRatio(obs, st.median) : null,
      vsFirst: bestRatio(obs, first),
    };
  });
}

/* ----- sections C and D: every movement compared with itself ----- */

function episodeRows(maxX: number): Row[] {
  return METRIC_KEYS.map((key) => {
    let largest: Observation | null = null;
    let vsMean: Ratio | null = null;
    let vsMedian: Ratio | null = null;
    let vsFirst: Ratio | null = null;

    for (const ep of EPISODES) {
      const pts: readonly Pt[] = seriesData(ep, key) ?? [];
      const kept = pts.filter((p) => p.x <= maxX);
      if (!kept.length) continue;

      const obs: Observation[] = kept.map((p) => ({
        v: p.y,
        where: `${t().episodes[ep.id].short} · ${p.t}`,
      }));

      const st = meanMedian(obs.map((o) => o.v));
      /* seriesData puts the movement's own first published figure in `base`
         on every point — the same figure the tooltips compare with. */
      const first = kept[0].base;

      const l = bestValue(obs);
      if (l && (!largest || l.v > largest.v)) largest = l;

      const m = st ? bestRatio(obs, st.mean) : null;
      if (m && (!vsMean || m.pct > vsMean.pct)) vsMean = m;

      const md = st ? bestRatio(obs, st.median) : null;
      if (md && (!vsMedian || md.pct > vsMedian.pct)) vsMedian = md;

      const f = bestRatio(obs, first);
      if (f && (!vsFirst || f.pct > vsFirst.pct)) vsFirst = f;
    }

    return {
      label: t().items[key].label,
      unit: "count",
      largest,
      vsMean,
      vsMedian,
      vsFirst,
    };
  });
}

/* ----- rendering ----- */

function fmtValue(v: number, unit: "count" | "eurM"): string {
  return unit === "eurM"
    ? fill(t().kpi.eurM, { v: eurM().format(v) })
    : compact().format(v);
}

function fmtPct(ratio: number): string {
  const x = ratio * 100;
  if (x >= 1000) return `${nf().format(Math.round(x))}%`;
  if (x >= 10) return `${Math.round(x)}%`;
  return `${Number(x.toFixed(1))}%`;
}

function kpiRow(label: string, num: string, sub: string): HTMLElement {
  const row = el("div", "kpi-row");
  row.append(el("dt", "kpi-label", label));
  const dd = el("dd");
  dd.append(el("span", "kpi-num", num), el("span", "kpi-sub", sub));
  row.append(dd);
  return row;
}

function ratioCell(
  r: Ratio | null,
  label: string,
  template: string,
  unit: "count" | "eurM",
): HTMLElement {
  if (!r) return kpiRow(label, "—", t().kpi.none);
  const against = fill(template, {
    value: fmtValue(r.obs.v, unit),
    base: fmtValue(r.base, unit),
  });
  return kpiRow(label, fmtPct(r.pct), `${r.obs.where} · ${against}`);
}

function card(row: Row, largestLabel: string): HTMLElement {
  const k = t().kpi;
  const box = el("div", "kpi-card");
  box.append(el("h5", "kpi-title", row.label));

  const list = el("dl", "kpi-list");
  list.append(
    row.largest
      ? kpiRow(
          largestLabel,
          fmtValue(row.largest.v, row.unit),
          row.largest.where,
        )
      : kpiRow(largestLabel, "—", k.none),
    ratioCell(row.vsMean, k.vsMean, k.againstMean, row.unit),
    ratioCell(row.vsMedian, k.vsMedian, k.againstMedian, row.unit),
    ratioCell(row.vsFirst, k.vsFirst, k.againstFirst, row.unit),
  );

  box.append(list);
  return box;
}

function block(
  rows: readonly Row[],
  largestLabel: string,
  note: string,
): DocumentFragment {
  const frag = document.createDocumentFragment();
  frag.append(el("h4", "kpi-heading", t().kpi.heading));

  const grid = el("div", "kpi-grid");
  for (const row of rows) grid.append(card(row, largestLabel));
  frag.append(grid);
  frag.append(el("p", "kpi-note", note));
  return frag;
}

/* ----- mount ----- */

export function mountKpis(): void {
  const k = t().kpi;

  const a = byId("kpi-a");
  if (a) a.replaceChildren(block(dailyRows(false), k.largestDay, k.noteDaily));

  const b = byId("kpi-b");
  if (b) {
    b.replaceChildren(block(dailyRows(true), k.largestWeek, k.noteWeekly));
  }

  const c = byId("kpi-c");
  if (c) {
    c.replaceChildren(
      block(
        episodeRows(Number.POSITIVE_INFINITY),
        k.largestFigure,
        k.noteEpisodes,
      ),
    );
  }

  const d = byId("kpi-d");
  if (d) {
    d.replaceChildren(
      block(
        episodeRows(ENFORCEMENT_LAST),
        k.largestFigure,
        k.noteEpisodesCapped,
      ),
    );
  }
}
