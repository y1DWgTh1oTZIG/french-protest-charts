/**
 * src/client/page.ts — static chrome: disclaimer, section headers, axis notes,
 * <title>. Idempotent; re-run on every locale change.
 *
 * `<html lang>` / `data-lang` are written by setLang() in i18n.ts only —
 * not here. One writer per attribute.
 */

import { renderAbout } from "./about.ts";
import { localeMeta, onLocaleChange, t, type SectionCopy } from "./i18n.ts";

const $ = (id: string): HTMLElement | null => document.getElementById(id);

const REPO_LABEL = {
  en: "Source code on GitHub",
  fr: "Code source sur GitHub",
} as const;

function tag<K extends keyof HTMLElementTagNameMap>(
  name: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(name);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/** h2, not h1: index.html already carries the page h1. */
function header(id: string, s: SectionCopy): void {
  const host = $(id);
  if (!host) return;
  host.replaceChildren(
    tag("h2", "sec-title", s.title),
    tag("p", "sec-blurb", s.blurb),
  );
}

/** Authored copy only — textContent, so a catalogue entry cannot inject markup. */
function note(id: string, text: string): void {
  const host = $(id);
  if (!host) return;
  host.textContent = text;
}

function disclaimer(): void {
  const host = $("disclaimer");
  if (!host) return;
  const d = t().disclaimer;

  const list = document.createElement("ol");
  list.className = "disclaimer-links";

  for (const [index, href] of d.hrefs.entries()) {
    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    a.textContent = d.links[index];
    a.dataset.index = String(index);

    const li = document.createElement("li");
    li.append(a);
    list.append(li);
  }

  const strong = document.createElement("strong");
  strong.textContent = d.strong;

  host.replaceChildren(
    strong,
    document.createTextNode(d.lead),
    list,
    document.createTextNode(d.tail),
  );
}

/** The anchor is static in index.html; only its label follows the locale. */
function repoLink(): void {
  const a = $("repo-link");
  if (!a) return;
  const lang = document.documentElement.dataset.lang === "en" ? "en" : "fr";
  const label = REPO_LABEL[lang];
  a.setAttribute("aria-label", label);
  a.setAttribute("title", label);
}

export function renderChrome(): void {
  const m = localeMeta();
  document.title = m.meta.title;

  repoLink();
  disclaimer();
  renderAbout();
  header("hdr-a", m.sections.a);
  header("hdr-b", m.sections.b);
  header("hdr-c", m.sections.c);
  header("hdr-cp", m.sections.cp);
  note("note-c", m.sections.c.note ?? "");
  note("note-cp", m.sections.cp.note ?? "");
  /* no sources() here: sources.ts owns #sources */
}

/** For a page with no other renderer. main.ts uses onLocaleChange instead. */
export function initChrome(): () => void {
  renderChrome();
  return onLocaleChange(renderChrome);
}
