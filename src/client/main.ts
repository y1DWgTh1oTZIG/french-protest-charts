/* src/client/main.ts — boot: locale, chrome, charts, trellis.
   One render path: setLang emits once, scheduleRender coalesces to one frame. */

import {
  applyStaticCopy,
  getLocale,
  LOCALES,
  localeFromUrl,
  onLocaleChange,
  setLang,
  syncLangSwitch,
  type Lang,
} from "./i18n.ts";
import { CHARTS, mountCharts } from "./chart.ts";
import { destroyAll } from "./canvas.ts";
import { byId } from "./dom.ts";
import { mountCrossEpisode, type TrellisHosts } from "./episodes.ts";
import { applyUrlLang, mountLangSwitch } from "./lang.ts";
import { renderChrome } from "./page.ts";
import { renderSources } from "./sources.ts";

function trellisHosts(): TrellisHosts | null {
  const episodeHost = byId("trellis-episodes");
  const itemHost = byId("trellis-items");
  const itemLegend = byId("legend-items");
  const eventLegend = byId("legend-events");
  if (!episodeHost || !itemHost || !itemLegend || !eventLegend) {
    console.warn("[trellis] one or more hosts missing");
    return null;
  }
  return { episodeHost, itemHost, itemLegend, eventLegend }; // no `as Required<>` cast
}

export function render(): void {
  destroyAll(); // one owner for every chart instance, both sections
  renderSources();
  renderChrome(); // headers, notes, #disclaimer, #sources, <title>
  applyStaticCopy(); // kicker, lede, card titles, legend headings
  syncLangSwitch();
  mountCharts();
  const hosts = trellisHosts();
  if (hosts) {
    try {
      mountCrossEpisode(hosts);
    } catch (err) {
      console.error("[trellis]", err);
    }
  }
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

const REQUIRED = [
  ...CHARTS.map((c) => c.id),
  "trellis-episodes",
  "trellis-items",
  "legend-items",
  "legend-events",
  "disclaimer",
  "sources",
] as const;

/** hdr-a…hdr-cp are no longer validated: page.ts already no-ops on a missing
 *  header, so their absence was an abort switch for no reason. */
function boot(): void {
  const missing = REQUIRED.filter((id) => !byId(id));
  if (missing.length) {
    console.error(
      `[boot] ${missing.length} host(s) absent from the DOM: ${missing.join(", ")}`,
    );
    return;
  }

  applyUrlLang(); // ?lang= → state, no persist, before any subscriber
  mountLangSwitch(); // the only click handler for the control
  onLocaleChange(scheduleRender); // the only render trigger
  render(); // first paint
  window.addEventListener("pagehide", destroyAll, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export { getLocale, LOCALES, localeFromUrl, setLang };
export type { Lang };
