import type { Chart } from "chart.js";
import {
  buildCostConfig,
  buildEnforcementConfig,
  buildEnforcementWeeklyConfig,
  buildProtestersConfig,
  buildProtestersWeeklyConfig,
  mount,
} from "./chart.ts";
import { mountCrossEpisode } from "./episodes.ts";
import { getLocale, LOCALES, onLocaleChange, setLocale } from "./i18n.ts";
import { renderChrome } from "./page.ts";

const SECTION_AB = [
  ["chart-protesters", buildProtestersConfig],
  ["chart-enforcement", buildEnforcementConfig],
  ["chart-costs", buildCostConfig],
  ["chart-protesters-weekly", buildProtestersWeeklyConfig],
  ["chart-enforcement-weekly", buildEnforcementWeeklyConfig],
] as const;

let charts: Chart[] = [];

function render(): void {
  for (const c of charts) c.destroy();
  charts = [];

  renderChrome(); // disclaimer, section headers, notes, sources — all from i18n

  for (const [id, build] of SECTION_AB) {
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    if (el) charts.push(mount(el, build()));
  }

  charts.push(
    ...mountCrossEpisode({
      episodeHost: document.getElementById("trellis-episodes")!,
      itemHost: document.getElementById("trellis-items")!,
      itemLegend: document.getElementById("legend-items")!,
      eventLegend: document.getElementById("legend-events")!,
    }),
  );
}

render();
onLocaleChange(render);

// e.g. setLocale('fr') once a `fr` catalogue exists
export { getLocale, LOCALES, setLocale };
