/* ==================================================== casualty breakdown
 *
 * Two tables per section, and they answer different questions:
 *
 *   severity  — how many of the declared injuries were light, and what share
 *               of the total that is. A share needs a denominator, so this
 *               table can only fill a cell where one was published. The
 *               protester row therefore has no share and says why.
 *   cause     — whether an injury was accidental, self-inflicted or inflicted
 *               in the confrontation. No source counts this, so the table is
 *               a register of named cases with an explicit count of how many
 *               are documented — not a distribution.
 *
 * The light share is drawn as a linear 0–100% bar. This is the one bar on the
 * site that is legitimate: shares have a true zero and sum to 100, which the
 * log-scaled timelines do not.
 */

import {
  CASES,
  SEVERITY_LEVELS,
  SEVERITY_WEEKS,
  type CaseRow,
  type Cell,
  type SevRow,
} from "./data.ts";
import { byId, el } from "./dom.ts";
import { fill, nf, t } from "./i18n.ts";

/* ----- cells ----- */

function cellText(c: Cell): { text: string; cls: string } {
  switch (c.s) {
    case "n":
      return {
        text: `${c.d ? "≈ " : ""}${nf().format(c.v)}`,
        cls: c.d ? "cas-num cas-derived" : "cas-num",
      };
    case "r":
      return {
        text: `≈ ${nf().format(c.lo)}–${nf().format(c.hi)}`,
        cls: "cas-num cas-derived",
      };
    case "c":
      return {
        text: fill(t().casualties.casesCount, { n: c.n }),
        cls: "cas-num cas-cases",
      };
    default:
      return { text: t().casualties.why[c.why], cls: "cas-absent" };
  }
}

function cell(c: Cell, extra = ""): HTMLElement {
  const { text, cls } = cellText(c);
  return el("td", extra ? `${cls} ${extra}` : cls, text);
}

/** The share the light figure represents of its own total, when both exist. */
function share(light: Cell, total: Cell): number | null {
  if (light.s !== "n" || total.s !== "n" || total.v <= 0) return null;
  return light.v / total.v;
}

function bar(p: number): HTMLElement {
  const wrap = el("span", "cas-bar");
  const run = el("span", "cas-bar-fill");
  run.style.width = `${Math.max(0, Math.min(1, p)) * 100}%`;
  wrap.append(run);
  return wrap;
}

/* ----- severity table ----- */

function severityTable(rows: readonly SevRow[], caption: string): HTMLElement {
  const c = t().casualties;
  const table = el("table", "cas-table");
  table.append(el("caption", "cas-caption", caption));

  const thead = el("thead");
  const head = el("tr");
  const labels = [
    c.colScope,
    c.colTotal,
    c.colSerious,
    c.colLight,
    c.colLightShare,
    c.colOther,
  ];
  labels.forEach((label, i) => {
    const th = el("th", i === 0 ? "cas-scope-head" : "cas-num-head", label);
    (th as HTMLTableCellElement).scope = "col";
    head.append(th);
  });
  thead.append(head);
  table.append(thead);

  const tbody = el("tbody");
  for (const row of rows) {
    const tr = el("tr");

    const th = el("th", "cas-scope", c.scope[row.id] ?? row.id);
    (th as HTMLTableCellElement).scope = "row";
    tr.append(th);

    tr.append(cell(row.total));
    tr.append(cell(row.serious));
    tr.append(cell(row.light));

    const p = share(row.light, row.total);
    const td = el("td", "cas-share");
    if (p === null) {
      td.append(el("span", "cas-absent", "—"));
    } else {
      td.append(el("span", "cas-pct", `${(p * 100).toFixed(1)}%`), bar(p));
    }
    tr.append(td);

    tr.append(cell(row.other));
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

/* ----- the headline proportion ----- */

function headline(): HTMLElement {
  const c = t().casualties;
  const top = SEVERITY_LEVELS[0];
  const p = share(top.light, top.total);

  const wrap = el("div", "cas-headline");

  const left = el("div", "cas-head-stat");
  left.append(
    el("span", "cas-head-num", p === null ? "—" : `${(p * 100).toFixed(1)}%`),
    el(
      "span",
      "cas-head-label",
      p === null || top.light.s !== "n" || top.total.s !== "n"
        ? c.headLightNote
        : fill(c.headLight, {
            light: nf().format(top.light.v),
            total: nf().format(top.total.v),
          }),
    ),
  );

  const right = el("div", "cas-head-stat cas-head-missing");
  right.append(
    el("span", "cas-head-num", "—"),
    el("span", "cas-head-label", c.headMissingNote),
  );

  wrap.append(left, right);
  return wrap;
}

/* ----- cause table ----- */

function causeTable(rows: readonly CaseRow[], caption: string): HTMLElement {
  const c = t().casualties;
  const table = el("table", "cas-table cas-cause");
  table.append(el("caption", "cas-caption", caption));

  const thead = el("thead");
  const head = el("tr");
  [c.colSide, c.colCircumstance, c.colCount, c.colCases].forEach((label, i) => {
    const th = el("th", i < 2 ? "cas-scope-head" : "cas-num-head", label);
    (th as HTMLTableCellElement).scope = "col";
    head.append(th);
  });
  thead.append(head);
  table.append(thead);

  const tbody = el("tbody");
  for (const row of rows) {
    const tr = el("tr", row.reference ? "cas-reference" : "");

    const th = el("th", "cas-scope", c.side[row.side]);
    (th as HTMLTableCellElement).scope = "row";
    tr.append(th);

    tr.append(el("td", "cas-kind", c.kind[row.kind]));
    tr.append(cell(row.count));

    const td = el("td", "cas-cases-cell");
    if (!row.cases.length) {
      td.append(el("span", "cas-absent", t().casualties.noCases));
    } else {
      const list = el("ul", "cas-case-list");
      for (const key of row.cases) list.append(el("li", "", c.cases[key]));
      td.append(list);
    }
    tr.append(td);
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

/* ----- resolution table, section B ----- */

function resolutionTable(): HTMLElement {
  const c = t().casualties;
  const table = el("table", "cas-table cas-resolution");
  table.append(el("caption", "cas-caption", c.capResolution));

  const thead = el("thead");
  const head = el("tr");
  [c.colQuestion, c.colWindow, c.colWeekly].forEach((label, i) => {
    const th = el("th", i === 2 ? "cas-num-head" : "cas-scope-head", label);
    (th as HTMLTableCellElement).scope = "col";
    head.append(th);
  });
  thead.append(head);
  table.append(thead);

  const tbody = el("tbody");
  for (const row of c.resolution) {
    const tr = el("tr");
    const th = el("th", "cas-scope", row.label);
    (th as HTMLTableCellElement).scope = "row";
    tr.append(th, el("td", "", row.window));
    tr.append(el("td", "cas-num", row.weekly));
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

/* ----- mount ----- */

export function mountCasualties(): void {
  const c = t().casualties;

  const a = byId("cas-a");
  if (a) {
    a.replaceChildren(
      el("h4", "cas-title", c.headlineTitle),
      headline(),
      severityTable(SEVERITY_LEVELS, c.capLevels),
      causeTable(CASES, c.capCases),
      el("p", "cas-note", c.noteLevels),
    );
  }

  const b = byId("cas-b");
  if (b) {
    b.replaceChildren(
      el("h4", "cas-title", c.weeklyTitle),
      severityTable(SEVERITY_WEEKS, c.capWeeks),
      resolutionTable(),
      el("p", "cas-note", c.noteWeeks),
    );
  }
}
