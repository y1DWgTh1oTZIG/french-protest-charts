/**
 * src/client/lang.ts — URL wiring for the language switch. Holds no state:
 * i18n.ts is the single source of truth.
 */

import {
  DEFAULT_LANG,
  LOCALES,
  getLocale,
  isLang,
  lang,
  localeFromUrl,
  normalizeLocale,
  onLocaleChange,
  setLang,
  syncLangSwitch,
  type Lang,
} from "./i18n.ts";

export {
  DEFAULT_LANG,
  LOCALES,
  getLocale,
  lang,
  localeFromUrl,
  onLocaleChange,
  setLang,
};
export type { Lang };

export function isLocale(value: unknown): value is Lang {
  return isLang(value);
}

/**
 * Applies ?lang= at boot. Does not persist (a shared link must not overwrite a
 * stored preference) and does not notify (nothing is subscribed yet).
 */
export function initLang(search?: string): Lang {
  const from = localeFromUrl(search);
  if (from && from !== getLocale())
    setLang(from, { persist: false, notify: false });
  return getLocale();
}

/**
 * Binds the segmented control. Single owner: do not also bind clicks in main.ts,
 * or one toggle fires two switches.
 */
export function mountLangSwitch(
  host: HTMLElement | null = document.querySelector<HTMLElement>(
    "[data-lang-switch]",
  ),
): () => void {
  if (!host || host.dataset.bound === "true") return () => {};

  const onClick = (ev: Event): void => {
    const btn = (ev.target as HTMLElement | null)?.closest<HTMLButtonElement>(
      "[data-set-lang]",
    );
    if (!btn) return;
    const next = normalizeLocale(btn.dataset.setLang);
    if (!next || next === lang()) return;

    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
    setLang(next); // emits; onLocaleChange renders
  };

  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    const btns = [
      ...host.querySelectorAll<HTMLButtonElement>("[data-set-lang]"),
    ];
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (i === -1) return;
    ev.preventDefault();
    const next =
      btns[(i + (ev.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
    next.focus();
    next.click();
  };

  host.addEventListener("click", onClick);
  host.addEventListener("keydown", onKey);
  host.dataset.bound = "true";
  syncLangSwitch(host);

  return () => {
    host.removeEventListener("click", onClick);
    host.removeEventListener("keydown", onKey);
    delete host.dataset.bound;
  };
}
