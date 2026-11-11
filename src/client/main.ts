import {
  mount,
  buildProtestersConfig,
  buildEnforcementConfig,
  buildCostConfig,
  buildProtestersWeeklyConfig,
  buildEnforcementWeeklyConfig,
} from "./chart.ts";
import { mountCrossEpisode } from "./episodes.ts";

function canvas(id: string): HTMLCanvasElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLCanvasElement))
    throw new Error(`canvas#${id} not found`);
  return el;
}

function host(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) throw new Error(`#${id} not found`);
  return el;
}

const charts = [
  mount(canvas("chart-protesters"), buildProtestersConfig()),
  mount(canvas("chart-enforcement"), buildEnforcementConfig()),
  mount(canvas("chart-costs"), buildCostConfig()),
  mount(canvas("chart-protesters-weekly"), buildProtestersWeeklyConfig()),
  mount(canvas("chart-enforcement-weekly"), buildEnforcementWeeklyConfig()),
  ...mountCrossEpisode({
    episodeHost: host("trellis-episodes"),
    itemHost: host("trellis-items"),
    itemLegend: host("legend-items"),
    eventLegend: host("legend-events"),
  }),
];

(window as unknown as { __charts: unknown }).__charts = charts;

window.addEventListener(
  "beforeunload",
  () => charts.forEach((c) => c.destroy()),
  { once: true },
);
