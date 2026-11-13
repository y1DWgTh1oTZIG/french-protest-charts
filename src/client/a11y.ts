/* ═══════════════════════════════════════════════════════════════════
   src/client/a11y.ts — NEW. Accessible names, data tables, key nav,
   live announcements. No Chart.js internals beyond the public API.
   ═══════════════════════════════════════════════════════════════════ */
import type { Chart } from "chart.js";
import { nf } from "./i18n.ts";

/* ---- live region (4.1.3) ---- */
let live: HTMLElement | null = null;
let timer = 0;

function region(): HTMLElement {
  if (live?.isConnected) return live;
  live = document.getElementById("a11y-live");
  if (!live) {
    live = document.createElement("p");
    live.id = "a11y-live";
    live.className = "sr-only";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    document.body.append(live);
  }
  return live;
}

/** Clearing first makes an identical string speak again. */
export function announce(text: string): void {
  const r = region();
  r.textContent = "";
  window.clearTimeout(timer);
  timer = window.setTimeout(() => (r.textContent = text), 120);
}

/* ---- value formatting shared by tables and readouts ---- */
const txt = (v: unknown): string => {
  if (v == null) return "—";
  if (typeof v === "number") return nf().format(Math.round(v));
  if (typeof v === "object") {
    const p = v as { v?: number; y?: number; low?: number; high?: number };
    if (typeof p.low === "number" && typeof p.high === "number")
      return p.low === p.high
        ? nf().format(Math.round(p.low))
        : `${nf().format(Math.round(p.low))} – ${nf().format(Math.round(p.high))}`;
    for (const n of [p.v, p.y])
      if (typeof n === "number") return nf().format(Math.round(n));
  }
  return String(v);
};

/* ---- data table (1.1.1 / 1.3.1) ---- */
export interface TableSpec {
  caption: string;
  indexHeader: string;
  index: string[];
  columns: { header: string; values: string[] }[];
}

export function dataTable(spec: TableSpec): HTMLDetailsElement {
  const details = document.createElement("details");
  details.className = "data-table";
  const summary = document.createElement("summary");
  summary.textContent = spec.caption;

  const table = document.createElement("table");
  const cap = document.createElement("caption");
  cap.className = "sr-only";
  cap.textContent = spec.caption;
  const head = table.createTHead().insertRow();
  for (const h of [spec.indexHeader, ...spec.columns.map((c) => c.header)]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = h;
    head.append(th);
  }
  const body = table.createTBody();
  spec.index.forEach((label, i) => {
    const tr = body.insertRow();
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    tr.append(th);
    for (const c of spec.columns)
      tr.insertCell().textContent = c.values[i] ?? "—";
  });

  table.append(); // no-op guard for older engines
  details.append(summary, table);
  return details;
}

/** Build a table straight from a mounted chart (sections A/B). */
export function fromChart(
  chart: Chart,
  opts: {
    caption: string;
    indexHeader: string;
    indexOf?: (dataset: unknown, i: number) => string;
    include?: (dataset: unknown) => boolean;
  },
): HTMLDetailsElement {
  const data = chart.data;
  const sets = (data.datasets as unknown[]).filter(
    (d) => opts.include?.(d) ?? true,
  );
  const labels = (data.labels ?? []).map(String);
  const n =
    labels.length ||
    Math.max(
      0,
      ...sets.map((d) => ((d as { data: unknown[] }).data ?? []).length),
    );

  return dataTable({
    caption: opts.caption,
    indexHeader: opts.indexHeader,
    index: Array.from(
      { length: n },
      (_, i) => opts.indexOf?.(sets[0], i) ?? labels[i] ?? String(i + 1),
    ),
    columns: sets.map((d) => {
      const ds = d as { label?: string; data?: unknown[] };
      return {
        header: String(ds.label ?? ""),
        values: Array.from({ length: n }, (_, i) => txt(ds.data?.[i])),
      };
    }),
  });
}

/** Spoken summary of one data index, reused by keyboard nav. */
export function readout(chart: Chart, i: number): string {
  const label = chart.data.labels?.[i] ?? "";
  const parts = (chart.data.datasets as unknown[])
    .filter((d) => !(d as { detachedOnly?: boolean }).detachedOnly)
    .map((d) => {
      const ds = d as { label?: string; data?: unknown[] };
      return `${ds.label}: ${txt(ds.data?.[i])}`;
    });
  return [label, ...parts].join(". ");
}

/* ---- keyboard navigation (2.1.1) ---- */
let seq = 0;

export function keyboardChart(
  chart: Chart,
  opts: {
    hint: string;
    roledescription: string;
    readout?: (i: number) => string;
  },
): void {
  const canvas = chart.canvas;
  const n = chart.data.labels?.length ?? 0;
  if (!n) return;

  const hintId = canvas.id ? `kbd-${canvas.id}` : `kbd-chart-${++seq}`;
  if (!document.getElementById(hintId)) {
    const hint = document.createElement("p");
    hint.id = hintId;
    hint.className = "sr-only";
    hint.textContent = opts.hint;
    canvas.after(hint);
  }

  canvas.tabIndex = 0;
  canvas.setAttribute("aria-roledescription", opts.roledescription);
  const ids = new Set(
    (canvas.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean),
  );
  ids.add(hintId);
  canvas.setAttribute("aria-describedby", [...ids].join(" "));

  const speak = opts.readout ?? ((i: number) => readout(chart, i));
  let at = -1;

  const paint = (next: number | null): void => {
    if (next === null || next < 0 || next >= n) {
      at = -1;
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      chart.update("none");
      return;
    }
    at = next;
    const els = chart.data.datasets.map((_, datasetIndex) => ({
      datasetIndex,
      index: at,
    }));
    const pt = chart.getDatasetMeta(0).data[at] as
      | { x?: number; y?: number }
      | undefined;
    chart.setActiveElements(els);
    chart.tooltip.setActiveElements(els, { x: pt?.x ?? 0, y: pt?.y ?? 0 });
    chart.update("none");
    announce(speak(at));
  };

  canvas.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowRight":
      case "ArrowUp":
        paint(at < 0 ? 0 : Math.min(n - 1, at + 1));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        paint(at < 0 ? n - 1 : Math.max(0, at - 1));
        break;
      case "Home":
        paint(0);
        break;
      case "End":
        paint(n - 1);
        break;
      case "Escape":
        paint(null);
        break;
      default:
        return;
    }
    ev.preventDefault();
  });
  canvas.addEventListener("blur", () => paint(null));
}
