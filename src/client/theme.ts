/* src/client/theme.ts — light/dark, system-first.
   One writer: <html data-theme="light"|"dark">. Its absence means "follow the
   OS", which the stylesheet understands natively via color-scheme. */

import { refreshTheme } from "./canvas.ts";
import { scheduleRender } from "./main.ts";

export type Theme = "light" | "dark";

const KEY = "fpc-theme";
const QUERY = "(prefers-color-scheme: dark)";
const TOGGLE = "[data-theme-toggle]";
const root = document.documentElement;

const media = (): MediaQueryList | null =>
  typeof window.matchMedia === "function" ? window.matchMedia(QUERY) : null;

/** null = the API is missing, so the caller falls back to light. */
export function systemTheme(): Theme | null {
  const q = media();
  return q ? (q.matches ? "dark" : "light") : null;
}

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null; // private mode / storage disabled
  }
}

function store(theme: Theme | null): void {
  try {
    if (theme) localStorage.setItem(KEY, theme);
    else localStorage.removeItem(KEY);
  } catch {
    /* session-only */
  }
}

/** Explicit choice wins; otherwise the OS; otherwise light. */
export function currentTheme(): Theme {
  const explicit = root.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return systemTheme() ?? "light";
}

function repaint(): void {
  refreshTheme(); // drop the resolved canvas colours
  scheduleRender(); // destroy + rebuild every chart: colours are baked at create
}

export function syncThemeToggle(
  host: HTMLElement | null = document.querySelector<HTMLElement>(TOGGLE),
): void {
  if (!host) return;
  host.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  host.dataset.theme = currentTheme();
}

/**
 * Click toggles. Landing back on the OS preference clears the override, so the
 * page returns to following the system rather than pinning an equal value.
 */
export function setTheme(theme: Theme): void {
  if (theme === systemTheme()) {
    store(null);
    delete root.dataset.theme;
  } else {
    store(theme);
    root.dataset.theme = theme;
  }
  syncThemeToggle();
  repaint();
}

export function mountThemeToggle(
  host: HTMLElement | null = document.querySelector<HTMLElement>(TOGGLE),
): () => void {
  if (!host || host.dataset.bound === "true") return () => {};

  const onClick = (): void => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  };

  host.addEventListener("click", onClick);
  host.dataset.bound = "true";
  syncThemeToggle(host);

  return () => {
    host.removeEventListener("click", onClick);
    delete host.dataset.bound;
  };
}

/** Binds the toggle and follows later OS changes while no override is set. */
export function initTheme(): () => void {
  syncThemeToggle(); // reflect the attribute the inline <head> script may have set
  const unbind = mountThemeToggle();
  const q = media();

  const onSystemChange = (): void => {
    if (root.dataset.theme) return; // pinned by the user
    syncThemeToggle();
    repaint();
  };

  q?.addEventListener("change", onSystemChange);

  return () => {
    unbind();
    q?.removeEventListener("change", onSystemChange);
  };
}
