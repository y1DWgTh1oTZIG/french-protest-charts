import {
  mount,
  buildProtestersConfig,
  buildEnforcementConfig,
  buildCostConfig,
  buildProtestersWeeklyConfig,
  buildEnforcementWeeklyConfig,
} from "./chart.ts";

function canvas(id: string): HTMLCanvasElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLCanvasElement))
    throw new Error(`canvas#${id} not found`);
  return el;
}

const charts = [
  mount(canvas("chart-protesters"), buildProtestersConfig()),
  mount(canvas("chart-enforcement"), buildEnforcementConfig()),
  mount(canvas("chart-costs"), buildCostConfig()),
  mount(canvas("chart-protesters-weekly"), buildProtestersWeeklyConfig()),
  mount(canvas("chart-enforcement-weekly"), buildEnforcementWeeklyConfig()),
];

(window as unknown as { __charts: unknown }).__charts = charts;

window.addEventListener(
  "beforeunload",
  () => charts.forEach((c) => c.destroy()),
  { once: true },
);
