/* Static chrome: disclaimer, section headers, axis notes, sources.
   Called once at boot and again on every locale change. */

import { fmtWhen, onLocaleChange, t, type Catalogue } from "./i18n.ts";

const $ = (id: string): HTMLElement | null => document.getElementById(id);

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

function header(id: string, s: { title: string; blurb: string }): void {
  const host = $(id);
  if (host)
    host.replaceChildren(
      tag("h1", undefined, s.title),
      tag("p", undefined, s.blurb),
    );
}

function note(id: string, html: string): void {
  const host = $(id);
  if (host) host.innerHTML = html; // authored copy only — never user input
}

function disclaimer(): void {
  const host = $("disclaimer");
  if (!host) return;
  const d = t().disclaimer;
  const link = tag("a", undefined, d.link);
  link.href = d.href;
  host.replaceChildren(
    tag("strong", undefined, d.strong),
    document.createTextNode(d.lead),
    link,
    document.createTextNode(d.tail),
  );
}

function sources(): void {
  const host = $("sources");
  if (!host) return;

  const s = t().sources;
  const nodes: HTMLElement[] = [
    tag("h1", undefined, s.title),
    tag("p", "intro", s.intro),
  ];

  for (const group of s.groups) {
    const block = tag("div", "source-group");
    const list = tag("ul");

    for (const item of group.items) {
      const li = tag("li");
      const a = tag("a", undefined, item.label);
      a.href = item.href;
      a.rel = "noopener";
      li.append(a);

      if (item.when) {
        li.append(" ", tag("span", "date", fmtWhen(item.when)));
      }
      li.append(" — ", tag("span", "what", item.what));
      list.append(li);
    }

    block.append(tag("h2", undefined, group.heading), list);
    nodes.push(block);
  }

  nodes.push(tag("p", "foot", s.foot));
  host.replaceChildren(...nodes);
}

export function renderChrome(): void {
  const m: Catalogue = t();
  document.documentElement.lang = m.meta.htmlLang;
  document.title = m.meta.title;

  disclaimer();
  header("hdr-a", m.sections.a);
  header("hdr-b", m.sections.b);
  header("hdr-c", m.sections.c);
  header("hdr-cp", m.sections.cp);
  note("note-c", m.sections.c.note);
  note("note-cp", m.sections.cp.note);
  sources();
}

/** Render now and on every locale switch. */
export function initChrome(): () => void {
  renderChrome();
  return onLocaleChange(renderChrome);
}
