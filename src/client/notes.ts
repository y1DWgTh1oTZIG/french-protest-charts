/* Note and marker copy. Lives apart from chart.ts because section C renders the
   same NoteRefs: that import was what pulled STUDENT_WEEKS into the wrong module.

   ── Third pass, 12 Nov 2026 ───────────────────────────────────────────────
   Two kinds of note now share the same table:

   1. DAILY points carry { k: "obs", date, metric }. The text lives in
      i18n.ts under obsNotes[date][metric].
   2. WEEKLY points normally carry { k: "week", p }, rendered from the
      generic week copy ("N days counted", "includes a floor", "N points
      excluded"). But when a week is a cumulative stock, or when it contains a
      derived component that makes the figure uncertain, the weekly point
      borrows the OBSERVATION note of the cell that explains it — a stock is
      a level, not a sum, and "6 days counted" would be the wrong caption for
      it. The obsNotes entry therefore has to read correctly in both a daily
      and a weekly tooltip.

   Nothing here needs to know which context it is in: both resolve through
   the same { k: "obs" } branch. */

import { fill, fmtDayMonth, nf, t } from "./i18n.ts";
import { RATE } from "./data.ts";
import type { Flag, NoteRef } from "./model.ts";

/** Resolve a stored note reference into copy, in the active locale. */
export function noteText(ref: NoteRef | null | undefined): string {
  if (!ref) return "";
  const m = t().chart;

  switch (ref.k) {
    case "obs":
      return m.obsNotes[ref.date]?.[ref.metric] ?? "";

    case "policing": {
      const head =
        ref.low === ref.high
          ? nf().format(ref.low)
          : `${nf().format(ref.low)}–${nf().format(ref.high)}`;
      const note = m.deployNotes[ref.date];
      return fill(note ? m.policingDay : m.policingDayPlain, {
        head,
        low: nf().format(RATE.low),
        high: nf().format(RATE.high),
        note: note ?? "",
      });
    }

    case "cumulative":
      return fill(ref.added ? m.cumulativeAdded : m.cumulativeCarried, {
        days: ref.days,
      });

    case "week": {
      const p = ref.p;
      const parts = [
        fill(p.kind === "national" ? m.weekNational : m.weekRegionalOnly, {
          n: p.days,
        }),
      ];
      if (p.peak) parts.push(fill(m.weekPeak, { date: fmtDayMonth(p.peak) }));
      if (p.noNational) parts.push(m.weekNoNational);
      if (p.excluded) parts.push(fill(m.weekExcluded, { n: p.excluded }));
      if (p.floored) parts.push(m.weekFloored);
      if (p.clipped) parts.push(m.weekClipped);
      if (p.vacation) parts.push(m.weekVacation); // ← new
      return parts.join(m.weekJoin);
    }

    default:
      return "";
  }
}

/** Marker suffix for a tooltip value. `detached` wins only when no flag applies. */
export function suffixFor(
  q: Flag | null | undefined,
  detached: boolean,
): string {
  const s = t().chart.suffix;
  const text =
    q === "c"
      ? s.c
      : q === "w"
        ? s.w
        : q === "e"
          ? s.e
          : q === "f"
            ? s.f
            : q === "x"
              ? s.x // ← new
              : detached
                ? s.regional
                : "";
  return text ? fill(t().chart.suffixWrap, { text }) : "";
}
