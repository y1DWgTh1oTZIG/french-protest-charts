/* Chart.js draws tooltip text on the canvas and never wraps it, so a long
   source note runs off both edges of a narrow panel. These helpers fold a
   string to the width the tooltip actually has; Chart.js renders one array
   element per line (and splits plain "\n"), so callbacks can hand back arrays. */

import { Chart, type ChartType, type TooltipItem } from "chart.js";

type Padding =
  | number
  | { top?: number; right?: number; bottom?: number; left?: number };

type Fontish = {
  size?: number;
  family?: string | string[];
  style?: string;
  weight?: number | string | null;
};

/** Only the slice of TooltipOptions this reads; deep-partials type badly. */
type Tooltipish = {
  padding?: Padding;
  caretPadding?: number;
  boxWidth?: number;
  boxPadding?: number;
  displayColors?: boolean;
  titleFont?: Fontish;
  bodyFont?: Fontish;
  footerFont?: Fontish;
};

export type TooltipPart = "title" | "body" | "footer";

const DEFAULT_SIZE = 12;
/** Readability cap: beyond this a single line is hard to track. */
const MAX_WIDTH = 360;
/** Floor for very narrow panels, where chrome alone would eat the frame. */
const MIN_WIDTH = 80;

/** Offscreen context, created once: measureText is the only way to know. */
let probe: CanvasRenderingContext2D | null | undefined;

function measurer(): CanvasRenderingContext2D | null {
  if (probe === undefined) {
    probe = document.createElement("canvas").getContext("2d");
  }
  return probe;
}

function fontCss(font: Fontish | undefined, bold: boolean): string {
  const size = font?.size ?? Chart.defaults.font.size ?? DEFAULT_SIZE;
  const family = Array.isArray(font?.family)
    ? font.family.join(", ")
    : (font?.family ?? Chart.defaults.font.family);
  const style = font?.style ?? "normal";
  const weight = font?.weight ?? (bold ? "bold" : "normal");
  return `${style} ${weight} ${size}px ${family}`;
}

/** Horizontal space the box spends before any text is drawn. */
function chromeWidth(tt: Tooltipish): number {
  const pad = tt.padding ?? 6;
  const side =
    typeof pad === "number" ? pad * 2 : (pad.left ?? 0) + (pad.right ?? 0);
  const swatch =
    tt.displayColors === false
      ? 0
      : (tt.boxWidth ?? DEFAULT_SIZE) + (tt.boxPadding ?? 6);
  return side + swatch + 2 * (tt.caretPadding ?? 2);
}

/** Text width available to one line, in CSS px (Chart.js sizes in CSS px). */
function textWidth(chart: Chart, tt: Tooltipish): number {
  const frame = chart.chartArea?.width ?? chart.width;
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, frame - chromeWidth(tt)));
}

function wrapText(text: string, max: number, font: string): string[] {
  const ctx = measurer();
  if (!ctx) return text.split("\n");
  ctx.font = font;

  const fits = (s: string): boolean => ctx.measureText(s).width <= max;
  const lines: string[] = [];

  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push(""); // keeps the blank line the template asked for
      continue;
    }

    let line = "";
    for (const word of words) {
      if (line && !fits(`${line} ${word}`)) {
        lines.push(line);
        line = "";
      }

      // Unbreakable token (URL, "17–24", compound): cut at the widest prefix
      // that still fits, by measurement rather than by character count.
      if (!line && !fits(word)) {
        let rest = word;
        while (rest.length > 1 && !fits(rest)) {
          let lo = 1;
          let hi = rest.length;
          while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (fits(rest.slice(0, mid))) lo = mid;
            else hi = mid - 1;
          }
          lines.push(rest.slice(0, lo));
          rest = rest.slice(lo);
        }
        line = rest;
        continue;
      }

      line = line ? `${line} ${word}` : word;
    }
    if (line) lines.push(line);
  }

  return lines;
}

/** Wrapped lines for one tooltip field. Falls back to a plain split. */
export function wrapTooltipLines<T extends ChartType>(
  text: string,
  item: TooltipItem<T> | undefined,
  part: TooltipPart = "body",
): string[] {
  const chart = (item as { chart?: Chart } | undefined)?.chart;
  if (!chart) return text.split("\n");

  const tt = (chart.options.plugins?.tooltip ?? {}) as unknown as Tooltipish;
  const font = fontCss(
    part === "title"
      ? tt.titleFont
      : part === "footer"
        ? tt.footerFont
        : tt.bodyFont,
    part !== "body",
  );

  return wrapText(text, textWidth(chart, tt), font);
}
