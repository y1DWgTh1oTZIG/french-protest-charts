/**
 * src/client/main.ts — boot: locale, chrome, charts, trellis.
 * One render path: setLang emits once, scheduleRender coalesces to one frame.
 */

import type { Chart } from "chart.js";

import {
  applyStaticCopy,
  getLocale,
  LOCALES,
  onLocaleChange,
  setLocale,
  syncLangSwitch,
  type Lang,
} from "./i18n.ts";
import {
  buildCostConfig,
  buildEnforcementConfig,
  buildEnforcementWeeklyConfig,
  buildProtestersConfig,
  buildProtestersWeeklyConfig,
  mount,
} from "./chart.ts";
import { mountCrossEpisode } from "./episodes.ts";
import { initLang, localeFromUrl, mountLangSwitch } from "./lang.ts";
import { renderChrome } from "./page.ts";
import { renderSources } from "./sources.ts";

const SECTION_AB = [
  ["chart-protesters", buildProtestersConfig],
  ["chart-enforcement", buildEnforcementConfig],
  ["chart-costs", buildCostConfig],
  ["chart-protesters-weekly", buildProtestersWeeklyConfig],
  ["chart-enforcement-weekly", buildEnforcementWeeklyConfig],
] as const;

const TRELLIS_HOSTS = [
  "trellis-episodes",
  "trellis-items",
  "legend-items",
  "legend-events",
] as const;

let charts: Chart[] = [];

function destroyCharts(): void {
  for (const c of charts) {
    try {
      c.destroy();
    } catch (err) {
      console.error("[chart] destroy failed", err);
    }
  }
  charts = [];
}

function renderCharts(): void {
  destroyCharts();

  for (const [id, build] of SECTION_AB) {
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    if (!el) {
      console.warn(`[chart] #${id} missing`);
      continue;
    }
    try {
      charts.push(mount(el, build()));
    } catch (err) {
      /* one bad chart must not blank the page */
      console.error(`[${id}]`, err);
    }
  }

  const hosts = {
    episodeHost: document.getElementById("trellis-episodes"),
    itemHost: document.getElementById("trellis-items"),
    itemLegend: document.getElementById("legend-items"),
    eventLegend: document.getElementById("legend-events"),
  };

  if (
    !hosts.episodeHost ||
    !hosts.itemHost ||
    !hosts.itemLegend ||
    !hosts.eventLegend
  ) {
    console.warn("[trellis] one or more hosts missing", hosts);
    return;
  }

  try {
    charts.push(...mountCrossEpisode(hosts as Required<typeof hosts>));
  } catch (err) {
    console.error("[trellis]", err);
  }
}

export function render(): void {
  renderSources();
  renderChrome(); // headers, notes, #disclaimer, #sources, <title>, <html lang>
  applyStaticCopy(); // kicker, lede, card titles, legend headings
  syncLangSwitch();
  renderCharts();
}

/* Coalesce: several listeners switching language still produce one render. */
let frame = 0;

function scheduleRender(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    try {
      render();
    } catch (err) {
      console.error("[render]", err);
    }
  });
}

/**
 * Boot. Runs only when the document has the hosts the page needs — the previous
 * run queried nine ids, got nine nulls, and drew nothing.
 */
function boot(): void {
  const missing = [
    ...SECTION_AB.map(([id]) => id),
    ...TRELLIS_HOSTS,
    "disclaimer",
    "sources",
    "hdr-a",
    "hdr-b",
    "hdr-c",
    "hdr-cp",
  ].filter((id) => !document.getElementById(id));

  if (missing.length) {
    console.error(
      `[boot] ${missing.length} host(s) absent from the DOM: ${missing.join(", ")}\n` +
        `[boot] ids actually present: ${
          [...document.querySelectorAll("[id]")]
            .map((e) => e.id)
            .filter(Boolean)
            .join(", ") || "(none)"
        }`,
    );
    return;
  }

  initLang(); // ?lang= → state, no persist, no notify
  mountLangSwitch(); // the only click handler for the control
  onLocaleChange(scheduleRender); // the only render trigger
  render(); // first paint
  window.addEventListener("pagehide", destroyCharts, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

/* `?lang=en` / `?lang=fr` are the shareable entry points. */
export { getLocale, LOCALES, localeFromUrl, setLocale };
export type { Lang };
