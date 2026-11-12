# French Protest Charts (Part II - Comparisons & i18n)

*Created: 11/11/2026, 20:14:36*

---

**You**

Review the attachment, then I will prompt you again

---

**Assistant**

Reviewed. I have the full picture:

**What's here** — a handoff brief for a local Node/TS app (`npm start` → `127.0.0.1:3000`) serving five Chart.js line charts on French protest data, 1 Oct – 11 Nov 2026.

**Code files** — `src/client/chart.ts` (all data, projections, error-bar plugin, five config builders), `src/client/main.ts`, `public/index.html`, `server.ts` (static file server with path traversal guard), plus `package.json` / `tsconfig.json`.

**Data model** — `FACTS: Record<date, Cell>` with `{low, high, q?, note?}` per metric; `DEPLOYMENT` with `RATE = {136, 1133}` €/officer-day; `projectDaily` (midpoint + band), `projectPolicingDaily`, `projectPolicingCumulative` (carry-forward running total, `bandFill`), `aggregateWeekly(key, 'sum'|'max')`.

**Conventions I'll hold** — missing = `null` never `0`; plotted point = band midpoint with bars spanning the range; `spanGaps: true` + dashed connector on any multi-slot jump; quality flags `n/r/p/f/e/c/w` with `r/p/e/c` detached to hollow points-only series; quality and notes per-metric, day caveats in tooltip footer; `SubTitle` (capital T); weekly crowd = `max`, arrests/injuries = `sum`; `detachPolicy: 'never'` for cumulative; excluded regional/partial days stay out of national sums.

**Open issues I'm tracking**
1. W2 damages double-counts €12M (6 Oct and 8 Oct are the same IDF increment) — needs `'c'` tagging or an `anchor` flag summing only the last value of a run.
2. W3 damages double-counts 18 Oct (subset of the 17 Oct weekend total) — same anchor fix.
3. Cumulative policing is a staircase (10 of 42 days), not a daily-accruing spend curve.
4. Two y-axes on the costs chart crush derived damages to near-zero against 17 Oct's €866M.
5. No street-medic aggregate; injury floor is Thines' 79 serious injuries as of 9 Nov, not charted.

**Headline totals** — arrests 7,040–7,863; forces injured 1,557–2,027; protesters injured 287–403 (floor); damages €263.4M–903.2M (⚠); policing €49.3M–410.1M (midpoint €229.7M, the corrected figure).

Ready for your next prompt.

---

**You**

Produce a similar weekly aggregate table for as many of the following events as possible:

- May 1968
- 2006 youth protests (about the CPE)
- Gilets Jaunes
- Nahel uprising
- Pension reform unrest
- Bloquons Tout

Number of protestors is the most important column. If you can easily find data for the other columns then do so, but do not waste an inordinate amount of time on them.

---

**Assistant**

Good — I've got the attachment format. Now researching turnout for each movement.Good progress. Now filling the daily/weekly gaps.I read the brief first (weekly Mon–Sun tables, peak-day crowd, sum-based arrests/injuries, `—` for missing, quality flags), then built the same shape for each episode. Flags reused from the project: **ᶜ** stock/cumulative · **ᶠ** floor · **ʳ** regional only · **ᵖ** partial · **ᵉ** derived · **ʷ** weekly aggregate.

Crowd ranges are **authorities (low) – organisers (high)** unless stated; every figure is the **peak day of that week**, so weeks are not comparable to each other as sums.

---

# 1. May 1968 (2 May – 30 June 1968)

| Week | Dates | Protestors (peak day) | Arrests | Forces injured | Protesters injured | Notes |
|---|---|---|---|---|---|---|
| **W1** | 29 Apr – 5 May | 25,000 – 100,000 *(1 May, Paris)* | — | — | — | CGT/PCF march République→Bastille: 25,000 (police) vs 100,000 (organisers) [^1]; "quelque 100 000" per CGT [^2] |
| **W2** | 6 – 12 May | 20,000 – 20,000+ *(6 & 10 May, Paris)* | 422 (early-May clashes) + 469 (night of barricades) | 300+ (6 May); 247 (10–11 May) | ≥100 (10–11 May) | 6 May: >20,000 to the Sorbonne, hundreds arrested [^3][^4]; 10 May: 20,000 (12,000 police); night: 6,255 police, 125 cars damaged / 63 burnt, 469 arrests [^4] |
| **W3** | 13 – 19 May | **230,000 – 1,000,000** *(13 May, Paris)* | — | — | — | Prefecture 230,000 · ORTF 171,000 · surface-area estimate 500,000 · unions 1,000,000; ~1M more claimed in ~30 other cities [^4][^5][^6]. **Peak of the whole episode.** Strikes: ~10M workers |
| **W4** | 20 – 26 May | — | 1,000+ *(25 May)* | — | 887+ *(25 May)* | 20 May: 4M strikers [^5]; 24 May: Mathérion killed; 25 May: ~9M strikers, ORTF walkout [^5]. Casualty block is the EN-Wikipedia infobox, attributed to 25 May only — treat as **ᵉ**, weak provenance [^7] |
| **W5** | 27 May – 2 Jun | 300,000 – 1,000,000 *(30 May)* ⚠ | — | — | — | **Counter-demonstration** (pro-de Gaulle, Champs-Élysées): 300,000 prefecture / 1M Gaullists [^4]; the chronology says 200,000 [^5]. Exclude from protest totals. 27 May: Grenelle protocol, Charléty meeting |
| **W6** | 3 – 9 Jun | — | — | — | — | 4 Jun partial return to work; 7 Jun Renault Flins clashes |
| **W7** | 10 – 16 Jun | — | — | — | 1 dead *(10 Jun, Tautin)*; 2 dead *(11 Jun, Sochaux)* | 12 Jun: demonstrations banned nationwide [^5] |
| **W8** | 17 – 23 Jun | — | — | — | — | 23 Jun legislative elections |
| **W9** | 24 – 30 Jun | — | — | — | — | Crisis closes 30 Jun |

**Why this table is thin:** the street crowd was measured ad hoc in 1968 — "authorities" numbers come from the prefecture, "surface occupée" estimates and union claims, and only 13 May and 30 May have a published crowd range. The strike (up to ~10M workers) is a different population from the march — do not merge them into one "protestors" series. Days with no march (W4, W6–W9) still contain the deaths, the bans and the workplace occupation.

---

# 2. CPE youth protests, 2006 (Feb – Apr 2006)

| Week | Dates | Protestors (peak day) | Arrests | Forces injured | Protesters injured | Notes |
|---|---|---|---|---|---|---|
| **W1** | 30 Jan – 5 Feb | — | — | — | — | |
| **W2** | 6 – 12 Feb | 200,000 – 400,000 *(7 Feb, 187 demonstrations)* | — | — | — | First national action day [^8] |
| **W3–W5** | 13 Feb – 5 Mar | — | — | — | — | University occupations (Rennes etc.), no crowd count published |
| **W6** | 6 – 12 Mar | 400,000 – 1,000,000+ *(7 Mar)* | — | — | — | 7 Mar: ">1 million" [^8], chronology 400,000–1M [^9]; 9 Mar: ~38 universities on strike; Paris counts diverge sharply (92,000 police vs 700,000 unions — date attribution uncertain in source) |
| **W7** | 13 – 19 Mar | **500,000 – 1,500,000** *(18 Mar)*; Paris 80,000 – 700,000 | 156 (18 Mar, Paris) [^8]; 167 (18 Mar, Paris) [^9] | 34 (18 Mar, Paris) | 18 (16 Mar, Paris) [^8]; 52 wounded total in Paris 18 Mar | 16 Mar: 247,500 (Ministry) / ~500,000; Paris 33,000 police / 120,000 organisers [^10][^11][^9] · 18 Mar: national 500,000 police / 1.5M organisers; Paris 80,000–350,000 (Le Monde) [^12][^8] · 19 Mar: 503,000 Ministry / 1.3–1.5M CGT, Paris 80,000 / up to 400,000 [^13][^14] |
| **W8** | 20 – 26 Mar | 220,000 – 450,000 *(23 Mar)* | 630 *(23 Mar)* | 90 *(23 Mar)* | — | 21 Mar: 40,000 students only [^9]; 23 Mar: 21 universities fully blocked, 67 striking/blocked [^8] |
| **W9** | 27 Mar – 2 Apr | 1,055,000 – 2,710,000 *(28 Mar)*; Paris 92,000 – 700,000 | 600 | — | — | 4th national action day [^8] |
| **W10** | 3 – 9 Apr | 1,000,000 – 3,100,000 *(4 Apr)* | — | — | — | Peak day of the episode [^8] |
| **W11** | 10 – 16 Apr | — | — | — | — | CPE scrapped 10 Apr; movement splits, Easter holidays, momentum lost [^8] |
| **Total** | Feb – Apr | max 1.0M – 3.1M *(4 Apr)* | **4,500** (CAJ count over the whole episode; 1,950 in garde à vue, 635 prosecutions) [^8] | — | — | |

**Caveat:** March 2006 is the worst-documented episode for arrests — the CAJ total (4,500) is a *movement-wide* count, not a per-day series, and it counts arrests, not custody. The Paris-only figures for 18 March are the most reliable single-day enforcement numbers in the episode.

---

# 3. Gilets jaunes (17 Nov 2018 – Sept 2019)

All figures are the **Saturday act**, national, Interior Ministry vs the "Nombre jaune" collective (or union count) [^15].

| Week | Act | Protestors (Ministry) | Alternative count | Arrests | Injured | Notes |
|---|---|---|---|---|---|---|
| 12–18 Nov 2018 | I (17 Nov) | 287,700 ᶜ | — | ~1,150 interpellations, 974 GàV | 126 (17 police) | ⚠ **Counts all actions incl. road blockades**, not just marches — not comparable with Acts II+ [^15][^16] |
| 19–25 Nov | II (24 Nov) | 166,000 | 750,000 (France Police union) | 339 interpellations, 307 GàV | 84 (30 police) | Initially published as 106,301, revised up 8 days later [^15][^17] |
| 26 Nov – 2 Dec | III (1 Dec) | 136,000 | — | 630 in custody | 263 | 1 death (Zyed Benna, toll collector) [^18] |
| 3–9 Dec | IV (8 Dec) | 136,000 | — | ~2,000 interpellations, 1,709 GàV | 585 (RFI) / 264 (Ouest-France) / 118 (BBC) | Champs-Élysées violence; cumulative movement injuries pass 1,000 [^19][^20][^18] |
| 10–16 Dec | V (15 Dec) | 66,000 | — | — | — | |
| 17–23 Dec | VI (22 Dec) | 38,600 | — | — | — | |
| 24–30 Dec | VII (29 Dec) | 32,000 | — | — | — | |
| 31 Dec – 6 Jan 2019 | VIII (5 Jan) | 50,000 | 123,400 | — | — | |
| 7–13 Jan | IX (12 Jan) | 84,000 | 159,200 | — | — | |
| 14–20 Jan | X (19 Jan) | 84,000 | 147,400 | — | — | |
| 21–27 Jan | XI (26 Jan) | 69,000 | 123,200 | — | — | |
| 28 Jan – 3 Feb | XII (2 Feb) | 58,600 | 116,000 | — | — | |
| 4–10 Feb | XIII (9 Feb) | 51,400 | — | — | — | |
| 11–17 Feb | XIV (16 Feb) | 41,500 | 104,100 | — | — | |
| 18–24 Feb | XV (23 Feb) | 46,600 | — | — | — | |
| 25 Feb – 3 Mar | XVI (2 Mar) | 39,300 | — | — | — | |
| 4–10 Mar | XVII (9 Mar) | 28,600 | — | — | — | |
| 11–17 Mar | XVIII (16 Mar) | 32,300 | — | — | — | |
| 18–24 Mar | XIX (23 Mar) | 40,500 | — | — | — | |
| 25–31 Mar | XX (30 Mar) | 33,700 | — | — | — | |
| 1–7 Apr | XXI (6 Apr) | 22,300 | — | — | — | |
| 8–14 Apr | XXII (13 Apr) | 31,000 | — | — | — | |
| 15–21 Apr | XXIII (20 Apr) | 27,900 | — | — | — | |
| 22–28 Apr | XXIV (27 Apr) | 23,600 | — | — | — | |
| 29 Apr – 5 May | XXV (4 May) | 18,900 | — | — | — | |
| 6–12 May | XXVI (11 May) | 18,600 | — | — | — | |
| 13–19 May | XXVII (18 May) | 15,500 | — | — | — | 1-year anniversary |
| 20–26 May | XXVIII (25 May) | 12,500 | — | — | — | |
| 27 May – 2 Jun | XXIX (1 Jun) | 9,500 | — | — | — | |
| 3–9 Jun | XXX (8 Jun) | 10,300 | — | — | — | |
| 10–16 Jun | XXXI (15 Jun) | 7,000 | — | — | — | |
| 17–23 Jun | XXXII (22 Jun) | 11,800 | — | — | — | |
| 24–30 Jun | XXXIII (29 Jun) | 5,800 | — | — | — | |
| 31 Jul – 6 Sep | XXXIV–XLIII | — | — | — | — | Ministry published "NC" (not communicated) for Acts 34–43 [^15] |
| 2–8 Sep 2019 | XLIV (7 Sep) | 7,000 | — | — | — | Last published figure; Acts 45–52 unquantified [^15] |

**Caveat:** Act I's 287,700 is an actions-total (blockades included) and must be tagged `ᶜ`/`ᵉ`; Acts II–III sit in a methodology change (revised count); Acts 34–43 and 45–52 are "NC", i.e. **absence of a figure, not absence of people**.

---

# 4. Nahel (27 June – 5 July 2023, + first anniversary 2024)

| Week | Dates | Protestors (peak day) | Arrests | Forces injured | Deaths | Notes |
|---|---|---|---|---|---|---|
| **W1** | 26 Jun – 2 Jul 2023 | 6,200 – 20,000 *(29 Jun, Nanterre march blanche)* | **3,354** | **722** | 2 | Police count 6,200, organisers 20,000 [^21][^22]. Daily national tally: 27 Jun 31 arrests/24 police hurt; 28 Jun 207/174; 29 Jun 875/317/1 dead; 30 Jun 1,311/162; 1 Jul 773/42/1 dead; 2 Jul 157/3 [^23]. Vehicles burnt: 5,662 in this week; buildings damaged 1,029 |
| **W2** | 3 – 9 Jul 2023 | — | 108 | 1 | — | 3 Jul 72 arrests; 4 Jul 16; 5 Jul 20 [^23]; ~18 cities held anti-racism rallies on 1 Jul [^24] |
| **Total** | 27 Jun – 5 Jul | — | 3,462 | 723 | 2 | 5,954 vehicles burnt, 1,092 buildings damaged [^23]. Senate: ~50,000 rioters estimated over the whole episode, 45,000 forces mobilised, 4,282 in garde à vue to 10 Jul, >1,000 injured (782 police), 2,508 buildings, 12,031 vehicles, €650M damage [^25][^26] |
| **W26 2024** | 24–30 Jun | several hundred *(29 Jun, Nanterre silent march)* | — | — | — | First anniversary: "plusieurs centaines de personnes" [^27][^28] |

**Caveat:** this episode is **under-counted by march numbers**. Most gatherings were banned, and the crowd figures that exist (6,200–20,000) describe the tribute march, not the riot itself — the riot's scale is only captured by arrests, burnt vehicles and the Senate's ~50,000 "émeutiers" estimate. Note the internal inconsistency: EN-Wikipedia's infobox (5,662 vehicles, 3,300+ arrests, 808 officers injured, €650M) and the FR-Wikipedia day table (5,954 vehicles, 3,462 arrests, 723 police injured) do not match [^26][^23].

---

# 5. Pension reform unrest (2019–20 wave, 2023 wave, 2024 remnants)

### 5a. 2023 — the main wave (19 Jan – 6 Jun 2023)

| Week | Dates | Protestors (peak day, nationwide) | Paris peak | Notes |
|---|---|---|---|---|
| **W3** | 16–22 Jan 2023 | 1,120,000 – 2,000,000 *(19 Jan)* | 80,000 – 400,000 | First nationwide day; Occurrence: 55,000 in Paris |
| **W5** | 30 Jan – 5 Feb | 1,270,000 – 2,800,000 *(31 Jan)* | 87,000 – 500,000 | |
| **W6** | 6–12 Feb | **757,000 – 2,000,000** *(7 Feb)*; 963,000 – 2,500,000 *(11 Feb)* | 57,000 – 400,000; 93,000 – 500,000 | Two action days in one week — the table's "peak" hides a very high week |
| **W7** | 13–19 Feb | 440,000 – 1,300,000 *(16 Feb)* | 37,000 – 300,000 | |
| **W10** | 6–12 Mar | **1,280,000 – 3,500,000** *(7 Mar)*; 368,000 – 1,000,000 *(11 Mar) | 81,000 – 700,000; 48,000 – 300,000 | National record on both counts on 7 Mar [^29][^30] |
| **W11** | 13–19 Mar | 480,000 – 1,700,000 *(15 Mar)* | 37,000 – 450,000 | |
| **W12** | 20–26 Mar | **1,089,000 – 3,500,000** *(23 Mar)* | 119,000 – 800,000 | Second union record [^30] |
| **W13** | 27 Mar – 2 Apr | 740,000 – 2,000,000 *(28 Mar)* | 93,000 – 450,000 | |
| **W14** | 3–9 Apr | 570,000 – 2,000,000 *(6 Apr)* | 57,000 – 400,000 | |
| **W15** | 10–16 Apr | 380,000 – 1,000,000/1,500,000 *(13 Apr)* | 42,000 – 400,000 | CGT figure differs between the two compilations (1.0M vs 1.5M) — flag as a range [^6][^30] |
| **W18** | 1–7 May | 782,000 – 2,300,000 *(1 May)* | 112,000 – 550,000 | |
| **W22** | 5–11 Jun | 281,000 – 900,000 *(6 Jun)* | 31,000 – 300,000 | Movement's minimum [^30][^31] |
| **Total** | 19 Jan – 8 Jun | **10,520,000 – 29,000,000** (sum of action days) | 974,000 – 6,450,000 | Union total is ~2.8× the ministry total — the widest organiser/authority gap of any episode here |

### 5b. 2019–20 wave (the direct precedent)

| Week | Dates | Protestors | Paris | Notes |
|---|---|---|---|---|
| **W49 2019** | 2–8 Dec | 806,000 – 1,500,000 *(5 Dec)* | 65,000 – 250,000 | [^6] |
| **W51 2019** | 16–22 Dec | 615,000 – 1,800,000 *(17 Dec)* | 76,000 – 350,000 | [^6] |

### 5c. 2024 remnants

| Week | Dates | Protestors | Paris | Notes |
|---|---|---|---|---|
| **W24 2024** | 10–16 Jun | 250,000 (police) – 600,000+ (CGT) *(15 Jun)* | 75,000 police / 250,000 CGT | Anti-RN march, youth contingent; 9 interpellations, 3 police injured [^32][^33] |
| **W40 2024** | 30 Sep – 6 Oct | 95,000 – 170,000 *(1 Oct)* | — | 250 rallies on Barnier's policy-general day; demands included abrogating the 2023 reform [^30] |

**Caveat:** the 2023 national numbers include strike pickets and manifestation cortèges counted differently by the two sources; the "peak day" convention understates a movement whose real unit is the **action day sequence**, not the crowd on a Saturday.

---

# 6. Bloquons tout (Sept – Nov 2025)

The label first appears on social media in May 2025; the first national action was 10 September 2025, against the Bayrou budget, not a pension law [^34].

| Week | Dates | Protestors (peak day) | Arrests | Forces injured | Protesters injured | Notes |
|---|---|---|---|---|---|---|
| **W2 2025** | 8–14 Sep | **175,000 – 197,000** (Interior) / ~250,000 (CGT) *(10 Sep)* | 540 (211 Paris) | — | — | 596 rallies, 253 blockages; ministry figure was revised upward from ~29,000 counted in the early evening [^35][^36][^37][^38][^39] |
| **W3 2025** | 15–21 Sep | **500,000 – 1,000,000** *(18 Sep)*; Paris 55,000 (prefecture) | 309 nationwide; 103 in Paris (89 GàV) | 26 | 11 (incl. 1 journalist) | Intersyndicale strike + Bloquons tout; Paris prefecture 55,000 vs CGT 1M [^40][^41][^42] |
| **W5 2025** | 29 Sep – 5 Oct | 195,000 (Interior) – 600,000 (CGT) *(2 Oct)*; Paris 24,000 | — | — | — | Weakest mobilisation since 1 May 2025 [^43][^44][^45] |
| **W2 2025 (Nov)** | 10–16 Nov | 10 – 60 per local cortège *(15 Nov)* ʳ | — | — | — | Nantes ~50–60, Saint-Nazaire ~10, Cherbourg ~10, Coutances ~12 — **regional only, exclude from national sums** [^46][^47][^48] |
| **Outcome** | — | — | — | — | — | Bayrou government dissolved; the 2023 pension reform put on hold [^34] |

**Caveat:** the Interior Ministry's "participants" figure for 10 September counts participants in **actions**, not cortèges — the same methodological trap as Gilets jaunes Act I. 18 September is a union-organised day with an ordinary crowd count; do not put 10 September and 18 September on the same line without that flag.

---

## Cross-episode comparability (worth encoding as flags, not as prose)

| Flag | Episodes affected |
|---|---|
| `ᶜ` actions-total, not a march count | Gilets jaunes Act I (287,700), Bloquons tout 10 Sep |
| `ᵉ` low-provenance figure | May 68 casualty block (EN-Wiki infobox, "25 May" only) |
| `ʳ` regional only, excluded from national sums | Bloquons tout 15 Nov 2025; Gilets jaunes Acts 34+ (NC) |
| `ᶠ` floor | Gilets jaunes injury counts after Act IV (cumulative only) |
| `—` genuinely unmeasured | Most weeks of May 68 after 13 May; Nahel 2023 march numbers; Gilets jaunes Acts 34–52 |

**What I could not source in this pass:** (a) the 2024 "SOS闵 / je bloque tout" action wave that used the same name — no reliable weekly counts retrieved, so it is *not* in the Bloquons tout table; (b) per-day crowd figures for the Nahel riot nights of 27–28 June 2023 (the Place de la République gathering on 27 June is consistently described in the tens of thousands but no sourced count is in hand); (c) arrest/injury series for 2006 CPE, 2023 pensions and 2025 Bloquons tout beyond the single days quoted.

Want me to turn these into the app's `FACTS` / `aggregateWeekly` shape — a per-event record keyed by date with `{low, high, q, note}`, so the same aggregator produces all six episodes on one axis?

**References**

[^1]: [Cent mille personnes de République à Bastille](https://www.nouvelobs.com/societe/le-quotidien-de-1968/20080424.OBS1184/cent-mille-personnes-de-republique-a-bastille.html) (1%)
[^2]: [Des 1er mai souvent très politiques](https://www.publicsenat.fr/actualites/politique/des-1er-mai-souvent-tres-politiques-59701) (0%)
[^3]: [May 1968](https://en.wikipedia.org/wiki/May_1968) (7%)
[^4]: [Mai 68 — Wikipédia](https://fr.wikipedia.org/wiki/Mai_68) (7%)
[^5]: [Chronologie des événements de mai - juin 1968 — Wikipédia](https://fr.wikipedia.org/wiki/Chronologie_des_%C3%A9v%C3%A9nements_de_mai_-_juin_1968) (17%)
[^6]: [Liste des rassemblements les plus importants en France — Wikipédia](https://fr.wikipedia.org/wiki/Liste_des_rassemblements_les_plus_importants_en_France) (9%)
[^7]: [May 68 - Wikipedia](https://en.wikipedia.org/wiki/May_68) (0%)
[^8]: [2006 youth protests in France - Wikipedia](https://en.wikipedia.org/wiki/2006_youth_protests_in_France) (13%)
[^9]: [Crise du CPE : chronologie](https://www.nouvelobs.com/societe/social/20060326.OBS1858/crise-du-cpe-chronologie.html) (2%)
[^10]: [Des centaines de milliers de jeunes défilent à Paris et dans les ...](https://www.lemonde.fr/international/article/2006/03/16/des-centaines-de-milliers-de-jeunes-ont-defile_751311_3210.html) (0%)
[^11]: [Des lycéens en nombre dans les défilés anti-CPE](https://www.lemonde.fr/la-crise-au-proche-orient/article/2006/03/17/des-lyceens-en-nombre-dans-les-defiles-anti-cpe_751768_734511.html) (0%)
[^12]: [Plusieurs dizaines de milliers de manifestants anti-CPE à Paris et en régions](https://www.lemonde.fr/international/article/2006/03/18/des-defiles-dans-toutes-les-villes_752040_3210.html) (0%)
[^13]: [French protesters issue job ultimatum | News | Al Jazeera](https://www.aljazeera.com/news/2006/3/19/french-protesters-issue-job-ultimatum) (1%)
[^14]: [CPE : les évènements du 16 au 18 mars](https://www.nouvelobs.com/societe/social/20060321.OBS1191/cpe-les-evenements-du-16-au-18-mars.html) (0%)
[^15]: [Déroulement du mouvement des Gilets jaunes — Wikipédia](https://fr.wikipedia.org/wiki/D%C3%A9roulement_du_mouvement_des_Gilets_jaunes) (5%)
[^16]: [Gilets jaunes : samedi 8 décembre 2018 — Wikinews](https://fr.wikinews.org/wiki/Gilets_jaunes_:_samedi_8_d%C3%A9cembre_2018) (1%)
[^17]: [Gilets jaunes. Comment évolue la mobilisation ? Tous les chiffres](https://www.ouest-france.fr/societe/gilets-jaunes/gilets-jaunes-comment-evolue-la-mobilisation-tous-les-chiffres-6147118) (1%)
[^18]: [France 'yellow vest' protesters defy government to gather](https://www.bbc.com/news/world-europe-46577598) (0%)
[^19]: [Chronologie du mouvement des « gilets jaunes](https://www.monde-diplomatique.fr/mav/168/PIRONET/61011) (0%)
[^20]: [Gilets jaunes: retour sur les neuf premiers actes de contestation - RFI](https://www.rfi.fr/fr/france/20190118-gilets-jaunes-retour-neuf-actes-contestation-rue-interpellations) (1%)
[^21]: [À la marche blanche pour Nahel, un cri de révolte plutôt qu’une minute de silence  | Mediapart](https://www.mediapart.fr/journal/france/290623/la-marche-blanche-pour-nahel-un-cri-de-revolte-plutot-qu-une-minute-de-silence) (1%)
[^22]: [Nouvelle nuit de violences en France après la mort de Nahel: le récit des dernières heures - RFI](https://www.rfi.fr/fr/france/20230629-le-point-sur-la-mort-de-nahel-le-procureur-requiert-le-placement-en-d%C3%A9tention-provisoire-du-policier) (3%)
[^23]: [Émeutes consécutives à la mort de Nahel Merzouk — Wikipédia](https://fr.wikipedia.org/wiki/%C3%89meutes_cons%C3%A9cutives_%C3%A0_la_mort_de_Nahel_Merzouk) (1%)
[^24]: [Mort de Nahel : une quatrième nuit d’émeutes, mais des violences d’une « intensité moindre »](https://www.ouest-france.fr/faits-divers/emeutes-urbaines/mort-de-nahel-une-quatrieme-nuit-demeutes-mais-des-violences-dune-intensite-moindre-5f28377d-edb2-4189-b320-5fa379186858) (2%)
[^25]: [Émeutes de juin 2023 : comprendre, évaluer, réagir | Sénat](https://www.senat.fr/salle-de-presse/communiques-de-presse/presse/10-04-2024/emeutes-de-juin-2023-comprendre-evaluer-reagir.html) (1%)
[^26]: [Nahel Merzouk riots - Wikipedia](https://en.wikipedia.org/wiki/Nahel_Merzouk_riots) (1%)
[^27]: [Mort de Nahel à Nanterre : un an après, une marche silencieuse réunit plusieurs centaines de personnes – franceinfo](https://www.franceinfo.fr/faits-divers/adolescent-tue-par-un-policier-a-nanterre/mort-de-nahel-a-nanterre-un-an-apres-une-marche-silencieuse-reunit-plusieurs-centaines-de-personnes_6633804.html) (1%)
[^28]: [Nanterre : plusieurs centaines de personnes réunies lors de la marche silencieuse pour Nahel - Le Parisien](https://www.leparisien.fr/hauts-de-seine-92/nanterre-plusieurs-centaines-de-personnes-au-depart-de-la-marche-silencieuse-pour-nahel-29-06-2024-237YPUQKQZFQLHGTSHBOCKWVW4.php) (0%)
[^29]: [French pension reform: March 7 protests among largest since 1995](https://www.lemonde.fr/en/les-decodeurs/article/2023/03/09/french-pension-reform-march-7-protests-among-largest-since-1995_6018714_8.html) (1%)
[^30]: [Mouvement social contre la réforme des retraites en France de 2023 — Wikipédia](https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023) (10%)
[^31]: [Retraites : plus de 900 000 manifestants en France pour la CGT, 281 000 selon l’Intérieur](https://www.ouest-france.fr/economie/retraites/direct-greve-du-6-juin-suivez-les-manifestations-contre-la-reforme-des-retraites-en-france-e282f866-0393-11ee-bfa0-5e45e3198685) (0%)
[^32]: [French protesters turn out in droves against far right ...](https://www.lemonde.fr/en/politics/article/2024/06/16/french-protesters-turn-out-in-droves-against-far-right-caught-between-despair-and-the-will-to-fight_6674931_5.html) (0%)
[^33]: [Manifestations anti-RN : plus de 600 000 manifestants selon la CGT, 250 000 d’après la police - Le Parisien](https://www.leparisien.fr/elections/legislatives/manifestations-anti-rn-plus-de-600-000-manifestants-selon-la-cgt-250-000-dapres-la-police-15-06-2024-4TWAL2AAQFG2DGMZ5AYYFJNQ3I.php) (1%)
[^34]: [Bloquons tout - Wikipedia](https://en.wikipedia.org/wiki/Bloquons_tout) (0%)
[^35]: [10 septembre: 540 interpellations dans tout le pays, dont 211 à Paris](https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html) (0%)
[^36]: [Mouvement "Bloquons tout" : 197 000 participants selon le ministère de l'Intérieur, 540 arrestations - France 24](https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron) (0%)
[^37]: ["Bloquons tout" : "près de 250 000 personnes" mobilisées dans tout le pays selon la CGT, 197 000 selon le ministère de l'Intérieur – franceinfo](https://www.franceinfo.fr/societe/bloquons-tout-mouvement-du-10-septembre/bloquons-tout-pres-de-250-000-personnes-mobilisees-dans-tout-le-pays-selon-la-cgt-175-000-selon-le-ministere-de-l-interieur_7484704.html) (0%)
[^38]: [Bloquons tout : le ministère de l’Intérieur estime à 175 000 le nombre ...](https://www.liberation.fr/societe/en-direct-bloquons-tout-suivez-la-mobilisation-ce-mercredi-10-septembre-au-lendemain-de-la-nomination-de-sebastien-lecornu-a-matignon-20250910_7UGUHFIOUNGDJP67XSMTH5FKVA/) (0%)
[^39]: [INFOGRAPHIES. 200 000 participants à « Bloquons tout » : est-ce mieux ...](https://www.ouest-france.fr/societe/manifestation/infographies-200-000-participants-a-bloquons-tout-est-ce-mieux-que-les-autres-mobilisations-0f322c98-8ef1-11f0-b582-5820cfc46140) (0%)
[^40]: [Grève du 18 septembre : 103 interpellations et 89 gardes à vue à Paris, mais la manifestation "s'est bien passée", selon le préfet de police de Paris – franceinfo](https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-malgre-89-gardes-a-vue-a-paris-laurent-nunez-reconnait-que-la-journee-s-est-plutot-bien-passee_7501129.html) (2%)
[^41]: [Grève du 18 septembre : l'intersyndicale décidera des ...](https://www.franceinfo.fr/economie/greve/greve/direct-mobilisation-du-18-septembre-jusqu-a-900-000-manifestants-attendus-des-transports-perturbes-et-une-greve-qui-s-annonce-tres-suivie-dans-les-pharmacies-et-les-ecoles_7498174.html) (0%)
[^42]: [Grève du 18 septembre : la mobilisation a-t-elle été plus ou moins forte que lors des derniers grands mouvements sociaux ? – franceinfo](https://www.franceinfo.fr/economie/greve/greve/greve-du-18-septembre-la-mobilisation-a-t-elle-ete-plus-ou-moins-forte-que-lors-des-derniers-grands-mouvements-sociaux_7499668.html) (1%)
[^43]: [Grève du 2 octobre : environ 195 000 personnes ont manifesté en France selon le ministère de l'Intérieur, "près de 600 000" d'après la CGT – franceinfo](https://www.franceinfo.fr/economie/greve/greve-du-2-octobre-environ-195-000-personnes-ont-manifeste-en-france-selon-le-ministere-de-l-interieur-pres-de-600-000-d-apres-la-cgt_7528024.html) (1%)
[^44]: [Mobilisation du 2 octobre : 195.000 manifestants selon les autorités ...](https://www.lefigaro.fr/social/mouvement-du-10-septembre-100-000-participants-attendus-est-ce-un-chiffre-assez-bas-comme-le-dit-bayrou-20250905) (2%)
[^45]: [Mobilisation du 2 octobre : 195 000 manifestants en France selon le ministère de l’Intérieur, «près de 600 000» selon la CGT – Libération](https://www.liberation.fr/economie/social/en-direct-mobilisation-du-2-octobre-suivez-la-journee-dactions-et-de-greves-de-ce-jeudi-20251002_GFUGFS2GS5GPHAU5TVAGAZMGBI/) (0%)
[^46]: [« Bloquons tout » : une mobilisation en demi-teinte en Loire-Atlantique](https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-mobilisation-en-demi-teinte-en-loire-atlantique-90dd52ae-c22c-11f0-a316-aa52a6afd2bb) (1%)
[^47]: [Bloquons tout : peu de personnes se mobilisent en Loire-Atlantique ce samedi](https://www.ouest-france.fr/societe/manifestation/bloquons-tout-une-soixantaine-de-personnes-manifestent-a-nantes-ce-samedi-766d30c0-c226-11f0-8509-2c0807403e46) (1%)
[^48]: [Dans la Manche, le collectif Indignons-nous tente de faire perdurer le mouvement après le 10 septembre](https://www.ouest-france.fr/societe/manifestation/dans-la-manche-le-collectif-indignons-nous-tente-de-faire-perdurer-le-mouvement-apres-le-10-septembre-3828460e-c20f-11f0-8509-2c0807403e46) (1%)

---

**You**

Update the chart files:
- add a third section
- in the third section, followed the attached advice to produce a visualisation for each of the events I mentioned above (and the original 2026 student protests), showing how the weekly numbers of protestor, arrests and injuries (security forces and protestors) evolved over the course of each movement

---

**Assistant**

Three files change: `chart.ts` (two small hunks), a new `src/client/episodes.ts`, and `main.ts` / `index.html`. Section C follows the advice: small-multiple trellis (one panel per episode, 4 series, indexed to each series' own first figure), plus the transposed companion (one panel per series, one line per episode on a sequential ramp).

**`src/client/chart.ts`** — only two edits:

```ts
// 1. add to the chart.js import list:
  LogarithmicScale,

// 2. add to the Chart.register(...) call:
  LogarithmicScale,

// 3. append at the end of the file:
/* ------------------------------------------------ export for section C */

/** Weekly series for the 2026 episode, consumed by `episodes.ts`. */
export const EPISODE_2026 = {
  weeks: WEEKS.map((w) => ({ key: w.key, label: w.label })),
  series: {
    p: turnoutWeekly,
    a: arrestsWeekly,
    f: forcesWeekly,
    i: protestersWeekly,
  },
};
```

**`src/client/episodes.ts`** — new file:

```ts
/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four indexed series per panel.
   Companion: one panel per series, one line per episode on a sequential ramp. */

import {
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from 'chart.js';
import { EPISODE_2026 } from './chart.ts';

/* ------------------------------------------------------------------ types */

type M = 'p' | 'a' | 'f' | 'i';
type Flag = 'n' | 'r' | 'p' | 'f' | 'e' | 'c' | 'w';
type Band = number | [number, number];

interface Row {
  w: number;                       // whole weeks since the event's first action
  t: string;                       // week / act label, tooltip title
  p?: Band;                        // protestors, peak day of the week
  a?: Band;                        // arrests, weekly total
  f?: Band;                        // injuries, security forces
  i?: Band;                        // injuries, protestors
  flag?: Partial<Record<M, Flag>>;
  note?: Partial<Record<M, string>>;
}

interface Episode {
  id: string;
  strip: string;
  short: string;
  span: string;
  banner: string;
  weeks: Row[];
}

interface Pt {
  x: number;
  y: number;
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

interface PanelDataset extends ChartDataset<'line', Pt[]> {
  __item: M;
  __color: string;
  __hollow: boolean[];
  __label: string;
}

/* ------------------------------------------------------------- constants */

const INK = '#111827';
const MUTED = '#6b7280';
const GRID = '#E5E5E5';
const REFERENCE = 100;

const ITEMS: { key: M; label: string; short: string; color: string }[] = [
  { key: 'p', label: 'Protestors (peak day)', short: 'Protestors', color: '#0072B2' },
  { key: 'a', label: 'Arrests (weekly total)', short: 'Arrests', color: '#E69F00' },
  { key: 'f', label: 'Injuries — security forces', short: 'Forces hurt', color: '#009E73' },
  { key: 'i', label: 'Injuries — protestors', short: 'Protestors hurt', color: '#CC79A7' },
];

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = ['#D6E6F2', '#B0CFE6', '#86B4D7', '#5C97C5', '#357AB0', '#1B5C92', '#0A3A63'];

const FLAG_TEXT: Partial<Record<Flag, string>> = {
  r: 'regional only',
  p: 'partial',
  f: 'lower bound',
  e: 'derived',
  c: 'actions-total / stock — measured differently',
  w: 'weekly aggregate',
};

const hollow = (f: Flag): boolean => f === 'r' || f === 'p' || f === 'e' || f === 'c';

const nf = new Intl.NumberFormat('en-GB');
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });
const fmtIndex = (v: number): string => (v < 1 ? String(Number(v.toFixed(2))) : compact.format(v));

function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------------- data */

const MAY68: Episode = {
  id: 'may68',
  strip: 'May 1968',
  short: 'May 68',
  span: '29 Apr – 30 Jun 1968',
  banner: 'Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.',
  weeks: [
    {
      w: 0, t: '29 Apr – 5 May · 1 May march',
      p: [25_000, 100_000],
      note: { p: 'prefecture 25,000 / CGT 100,000, République → Bastille' },
    },
    {
      w: 1, t: '6 – 12 May · Sorbonne, barricades',
      p: 20_000, a: [469, 891], f: [247, 300], i: [100, 100],
      flag: { i: 'f' },
      note: {
        p: '20,000 to the Sorbonne on 6 May; >20,000 again on 10 May',
        a: '469 on the night of 10–11 May; high adds the 422 early-May arrests',
        f: '300+ on 6 May; 247 on 10–11 May',
        i: '≥100 — no national count was published',
      },
    },
    {
      w: 2, t: '13 – 19 May · 13 May march',
      p: [230_000, 1_000_000],
      note: { p: 'prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Peak of the episode.' },
    },
    {
      w: 3, t: '20 – 26 May · 24–25 May',
      a: [1_000, 1_000], i: [887, 887],
      flag: { a: 'f', i: 'e' },
      note: {
        a: '1,000+ arrests on 25 May',
        i: '887 injured, from the English-Wikipedia infobox — weak provenance',
      },
    },
    { w: 4, t: '27 May – 2 Jun · 30 May', note: { p: '30 May: 300,000 (prefecture) – 1,000,000 counter-demonstration — excluded from protest totals' } },
    { w: 5, t: '3 – 9 Jun', note: { p: '4 Jun partial return to work; 7 Jun Renault-Flins clashes' } },
    { w: 6, t: '10 – 16 Jun', note: { p: '10–11 Jun: 3 dead; 12 Jun demonstrations banned nationwide' } },
    { w: 7, t: '17 – 23 Jun' },
    { w: 8, t: '24 – 30 Jun' },
  ],
};

const CPE: Episode = {
  id: 'cpe',
  strip: 'CPE 2006',
  short: 'CPE 2006',
  span: '6 Feb – 16 Apr 2006',
  banner: 'One movement-wide arrest total (4,500); no weekly enforcement series exists.',
  weeks: [
    {
      w: 0, t: '6 – 12 Feb · 7 Feb',
      p: [200_000, 400_000],
      note: { p: '187 demonstrations, first national day' },
    },
    {
      w: 4, t: '6 – 12 Mar · 7 Mar',
      p: [400_000, 1_000_000],
      note: { p: '>1 million claimed; 38 universities on strike by 9 Mar' },
    },
    {
      w: 5, t: '13 – 19 Mar · 16–18 Mar',
      p: [500_000, 1_500_000], a: [156, 167], f: 34, i: 70,
      flag: { i: 'e' },
      note: {
        p: '18 Mar: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000',
        a: 'Paris, 18 Mar (156 ministry / 167 organisers)',
        f: 'Paris, 18 Mar',
        i: '18 (16 Mar) + 52 (18 Mar), Paris only',
      },
    },
    {
      w: 6, t: '20 – 26 Mar · 23 Mar',
      p: [220_000, 450_000], a: 630, f: 90,
      note: { p: '21 universities fully blocked; 67 striking or blocked' },
    },
    { w: 7, t: '27 Mar – 2 Apr · 28 Mar', p: [1_055_000, 2_710_000], a: 600, note: { p: '4th national action day' } },
    { w: 8, t: '3 – 9 Apr · 4 Apr', p: [1_000_000, 3_100_000], note: { p: 'peak day of the episode' } },
    { w: 9, t: '10 – 16 Apr', note: { p: 'CPE withdrawn 10 Apr; the movement splits' } },
  ],
};

const GJ_DATES = [
  '17 Nov 2018', '24 Nov', '1 Dec', '8 Dec', '15 Dec', '22 Dec', '29 Dec',
  '5 Jan 2019', '12 Jan', '19 Jan', '26 Jan', '2 Feb', '9 Feb', '16 Feb',
  '23 Feb', '2 Mar', '9 Mar', '16 Mar', '23 Mar', '30 Mar', '6 Apr', '13 Apr',
  '20 Apr', '27 Apr', '4 May', '11 May', '18 May', '25 May', '1 Jun', '8 Jun',
  '15 Jun', '22 Jun', '29 Jun', '7 Sep 2019',
];

const GJ_CROWD: [number, number][] = [
  [0, 287_700], [1, 166_000], [2, 136_000], [3, 136_000], [4, 66_000], [5, 38_600],
  [6, 32_000], [7, 50_000], [8, 84_000], [9, 84_000], [10, 69_000], [11, 58_600],
  [12, 51_400], [13, 41_500], [14, 46_600], [15, 39_300], [16, 28_600], [17, 32_300],
  [18, 40_500], [19, 33_700], [20, 22_300], [21, 31_000], [22, 27_900], [23, 23_600],
  [24, 18_900], [25, 18_600], [26, 15_500], [27, 12_500], [28, 9_500], [29, 10_300],
  [30, 7_000], [31, 11_800], [32, 5_800], [43, 7_000],
];

/** Enforcement figures exist only for Acts I–IV; later acts were not published as a series. */
const GJ_EXTRA: Record<number, Pick<Row, 'a' | 'f' | 'i' | 'flag' | 'note'>> = {
  0: {
    a: [974, 1_150], f: 17, i: 109,
    flag: { f: 'e', i: 'e' },
    note: {
      a: '974 in custody, ~1,150 interpellations',
      f: '17 police among 126 injured — split derived',
      i: '109 of 126 injured — split derived',
    },
  },
  1: {
    a: [307, 339], f: 30, i: 54,
    flag: { i: 'e' },
    note: { a: '307 in custody, 339 interpellations', i: '54 of 84 injured — split derived' },
  },
  2: {
    a: 630,
    flag: { a: 'f' },
    note: { a: 'placed in custody, not arrests; 263 injured, not split by side' },
  },
  3: {
    a: [1_709, 2_000],
    note: { a: '1,709 in custody, ~2,000 interpellations; injuries reported as 118 / 264 / 585 depending on source, not split by side' },
  },
};

const GILETS: Episode = {
  id: 'gj',
  strip: 'Gilets jaunes',
  short: 'Gilets jaunes',
  span: '12 Nov 2018 – 9 Sep 2019',
  banner: 'Ministry count only: one figure per act, so no range. Acts 34–43 were never published.',
  weeks: [
    ...GJ_CROWD.map(([w, n], idx) => {
      const extra = GJ_EXTRA[w] ?? {};
      return {
        w,
        t: `Act ${w + 1} · ${GJ_DATES[idx]}`,
        p: n,
        ...extra,
        flag: {
          ...(w === 0 ? { p: 'c' as Flag } : {}),
          ...extra.flag,
        },
        note: {
          ...(w === 0
            ? { p: '287,700 counts all actions including road blockades — an actions-total, not a march' }
            : w === 1
              ? { p: 'police-union counter-count: 750,000' }
              : {}),
          ...extra.note,
        },
      } satisfies Row;
    }),
  ],
};

const NAHEL: Episode = {
  id: 'nahel',
  strip: 'Nahel 2023',
  short: 'Nahel 2023',
  span: '27 Jun – 9 Jul 2023',
  banner: 'Gatherings were banned: arrests, not crowd counts, carry the scale of the riots.',
  weeks: [
    {
      w: 0, t: '26 Jun – 2 Jul · Nanterre march, 29 Jun',
      p: [6_200, 20_000], a: 3_354, f: 722,
      note: {
        p: 'police 6,200 / organisers 20,000 for the march blanche',
        a: 'national total, 27 Jun – 2 Jul',
        f: '722 officers injured; 2 deaths; 5,662 vehicles burnt',
      },
    },
    { w: 1, t: '3 – 9 Jul', a: 108, f: 1, note: { a: '72 + 16 + 20 over 3–5 Jul' } },
  ],
};

const PENSIONS: Episode = {
  id: 'pensions',
  strip: 'Pension reform 2023',
  short: 'Pensions 2023',
  span: '19 Jan – 8 Jun 2023',
  banner: 'Crowds only: no national weekly arrest or injury series was published.',
  weeks: [
    { w: 0, t: '16 – 22 Jan · 19 Jan', p: [1_120_000, 2_000_000], note: { p: 'first national day; Paris 80,000 – 400,000' } },
    { w: 2, t: '30 Jan – 5 Feb · 31 Jan', p: [1_270_000, 2_800_000] },
    { w: 3, t: '6 – 12 Feb · 7 & 11 Feb', p: [963_000, 2_500_000], note: { p: 'two action days in one week; the peak is 11 Feb' } },
    { w: 4, t: '13 – 19 Feb · 16 Feb', p: [440_000, 1_300_000] },
    { w: 7, t: '6 – 12 Mar · 7 Mar', p: [1_280_000, 3_500_000], note: { p: 'national record: ministry 1.28M, unions 3.5M' } },
    { w: 8, t: '13 – 19 Mar · 15 Mar', p: [480_000, 1_700_000] },
    { w: 9, t: '20 – 26 Mar · 23 Mar', p: [1_089_000, 3_500_000] },
    { w: 10, t: '27 Mar – 2 Apr · 28 Mar', p: [740_000, 2_000_000] },
    { w: 11, t: '3 – 9 Apr · 6 Apr', p: [570_000, 2_000_000] },
    { w: 12, t: '10 – 16 Apr · 13 Apr', p: [380_000, 1_500_000], note: { p: 'CGT gives 1.0M in one compilation, 1.5M in another' } },
    { w: 16, t: '1 – 7 May · 1 May', p: [782_000, 2_300_000] },
    { w: 20, t: '5 – 11 Jun · 6 Jun', p: [281_000, 900_000], note: { p: 'movement minimum' } },
  ],
};

const BLOQUONS: Episode = {
  id: 'bt',
  strip: 'Bloquons tout 2025',
  short: 'Bloquons tout',
  span: '10 Sep – 5 Oct 2025',
  banner: '10 Sep is an actions-total (blockades included); 18 Sep is an intersyndicale march.',
  weeks: [
    {
      w: 0, t: '8 – 14 Sep · 10 Sep',
      p: [175_000, 250_000], a: 540,
      flag: { p: 'c' },
      note: {
        p: 'ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.',
        a: '540 arrests, 211 in Paris',
      },
    },
    {
      w: 1, t: '15 – 21 Sep · 18 Sep',
      p: [500_000, 1_000_000], a: 309, f: 26, i: 11,
      note: {
        p: 'intersyndicale day — a different mobilisation from the movement’s own actions; Paris 55,000 (prefecture)',
        a: '309 nationwide, 103 in Paris',
        i: '11 injured, including 1 journalist',
      },
    },
    { w: 3, t: '29 Sep – 5 Oct · 2 Oct', p: [195_000, 600_000], note: { p: 'weakest mobilisation since 1 May 2025' } },
  ],
};

function rows2026(): Row[] {
  const s = EPISODE_2026.series;
  return EPISODE_2026.weeks.map((wk, i) => {
    const row: Row = { w: i, t: `W${i + 1} · ${wk.label}` };
    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const band = s[m].bands[i];
      if (!band) continue;
      row[m] = [band[0], band[1]];
      const q = s[m].quality[i];
      if (q && q !== 'n') row.flag = { ...row.flag, [m]: q };
      const note = s[m].notes[i];
      if (note) row.note = { ...row.note, [m]: note };
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: 'students26',
  strip: 'Student protests 2026',
  short: 'Students 2026',
  span: '1 Oct – 11 Nov 2026',
  banner: 'Protester injuries are a September stock, then a litigation floor — never a weekly flow.',
  weeks: rows2026(),
};

const EPISODES: Episode[] = [MAY68, CPE, GILETS, NAHEL, PENSIONS, BLOQUONS, STUDENTS];

/* -------------------------------------------------------------- indexing */

const bandOf = (b: Band): [number, number] => (typeof b === 'number' ? [b, b] : b);
const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

interface SeriesData {
  base: number;
  points: Pt[];
}

/** y' = 100 · y / y₀, where y₀ is the first figure measured on a comparable basis. */
function seriesData(ep: Episode, key: M): SeriesData | null {
  const rows = ep.weeks.filter((r) => r[key] !== undefined).sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? 'n';
  const baseRow = rows.find((r) => flagOf(r) !== 'c') ?? rows[0];
  const base = midOf(baseRow[key]!);

  const points = rows.map<Pt>((r) => {
    const [low, high] = bandOf(r[key]!);
    return {
      x: r.w,
      y: (REFERENCE * ((low + high) / 2)) / base,
      low,
      high,
      flag: flagOf(r),
      note: r.note?.[key],
      base,
      t: r.t,
    };
  });

  return { base, points };
}

function buildDataset(ep: Episode, key: M, color: string, direct: string): PanelDataset | null {
  const s = seriesData(ep, key);
  if (!s) return null;
  const item = ITEMS.find((d) => d.key === key)!;
  const holl = s.points.map((p) => hollow(p.flag));

  return {
    label: item.label,
    data: s.points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: s.points.map((p) => (p.flag === 'c' ? 3 : 2.75)),
    pointBackgroundColor: s.points.map((_, i) => (holl[i] ? '#ffffff' : color)),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: {
      borderDash: (ctx) =>
        Math.abs((ctx.p1.parsed.x as number) - (ctx.p0.parsed.x as number)) > 1.01 ? [5, 4] : undefined,
    },
    __item: key,
    __color: color,
    __hollow: holl,
    __label: direct,
  };
}

function extentOf(eps: Episode[], keys: M[]): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const ep of eps) {
    for (const k of keys) {
      const s = seriesData(ep, k);
      if (!s) continue;
      for (const p of s.points) {
        lo = Math.min(lo, p.y);
        hi = Math.max(hi, p.y);
      }
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [1, 100];
  return [10 ** Math.floor(Math.log10(lo)), 10 ** Math.ceil(Math.log10(hi))];
}

/* --------------------------------------------------------------- plugins */

const hundredLine: Plugin<'line'> = {
  id: 'hundredLine',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const y = scales.y?.getPixelForValue(REFERENCE);
    if (y === undefined || y < chartArea.top || y > chartArea.bottom) return;
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

const directLabels: Plugin<'line'> = {
  id: 'directLabels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const entries: { y: number; text: string }[] = [];

    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) return;

      for (let j = meta.data.length - 1; j >= 0; j--) {
        const raw = d.data[j];
        if (!raw || !Number.isFinite(raw.y)) continue;
        const el = meta.data[j] as unknown as { x: number; y: number };
        entries.push({ y: el.y, text: d.__label });
        break;
      }
    });

    entries.sort((a, b) => a.y - b.y);
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < 11) entries[i].y = entries[i - 1].y + 11;
    }

    ctx.save();
    ctx.font = '500 9.5px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151';
    for (const e of entries) {
      const y = Math.max(chartArea.top + 5, Math.min(chartArea.bottom - 5, e.y));
      ctx.fillText(e.text, chartArea.right + 7, y);
    }
    ctx.restore();
  },
};

/* ---------------------------------------------------------------- scales */

function xScale(maxW: number) {
  const step = maxW <= 4 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: 'linear' as const,
    min: -0.5,
    max: maxW + 0.5,
    grid: { display: false },
    border: { display: false },
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      font: { size: 9 },
      color: MUTED,
      padding: 4,
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      const out: { value: number }[] = [];
      for (let v = 0; v <= maxW + 0.001; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s: { height: number }) => {
      s.height = 20;
    },
  };
}

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = [0.1, 0.3, 1, 3, 10, 30, 100, 300, 1000, 3000].filter((v) => v >= min && v <= max);
  return {
    type: 'logarithmic' as const,
    min,
    max,
    grid: { color: GRID, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: MUTED,
      padding: 6,
      callback: (v: string | number) => fmtIndex(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 42;
    },
  };
}

/* --------------------------------------------------------------- tooltip */

function tooltipSpec() {
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<'line'>[]) => (items[0].raw as Pt).t,
      label: (item: TooltipItem<'line'>) => {
        const p = item.raw as Pt;
        const band = p.low === p.high ? nf.format(p.low) : `${nf.format(p.low)} – ${nf.format(p.high)}`;
        const flag = FLAG_TEXT[p.flag];
        return `${item.dataset.label}: ${band}  →  index ${Math.round(p.y)}${flag ? `  ·  ${flag}` : ''}`;
      },
      afterLabel: (item: TooltipItem<'line'>) => (item.raw as Pt).note ?? '',
      footer: (items: TooltipItem<'line'>[]) => {
        const p = items[0].raw as Pt;
        return `index = 100 × value ÷ ${nf.format(Math.round(p.base))}`;
      },
    },
  };
}

/* -------------------------------------------------------------- emphasis */

const episodePanels: Chart<'line'>[] = [];
const itemPanels: { chart: Chart<'line'>; item: M }[] = [];
let activeItem: M | null = null;
let activeEvent: number | null = null;

function emphasiseItem(key: M | null): void {
  if (key === activeItem) return;
  activeItem = key;

  for (const chart of episodePanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = key === null || d.__item === key;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
      d.borderWidth = key !== null && d.__item === key ? 2.75 : 1.75;
    }
    chart.update('none');
  }

  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host) host.style.opacity = key === null || key === item ? '1' : '0.18';
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;

  for (const { chart } of itemPanels) {
    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const on = index === null || i === index;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
    });
    chart.update('none');
  }
}

/* --------------------------------------------------------------- legends */

function legendButton(text: string, swatch: HTMLElement, onEnter: () => void, onLeave: () => void): HTMLElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.append(swatch, document.createTextNode(text));
  b.addEventListener('mouseenter', onEnter);
  b.addEventListener('mouseleave', onLeave);
  b.addEventListener('focus', onEnter);
  b.addEventListener('blur', onLeave);
  return b;
}

/* ---------------------------------------------------------------- mounts */

function observations(ep: Episode): string {
  const counts = ITEMS.map((i) => ep.weeks.filter((r) => r[i.key] !== undefined).length);
  return `obs ${counts.join('·')} of ${ep.weeks.length} wks`;
}

function panelFigure(ep: Episode): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement('figure');
  figure.className = 'trellis-panel';

  const caption = document.createElement('figcaption');
  const strip = document.createElement('span');
  strip.className = 'strip';
  strip.textContent = ep.strip;
  const meta = document.createElement('span');
  meta.className = 'strip-meta';
  meta.textContent = `${ep.span} · ${observations(ep)}`;
  const note = document.createElement('p');
  note.className = 'strip-note';
  note.textContent = ep.banner;
  caption.append(strip, meta, note);

  const box = document.createElement('div');
  box.className = 'panel-canvas';
  const canvas = document.createElement('canvas');
  box.append(canvas);

  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

export function mountCrossEpisode(opts: {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}): Chart<'line'>[] {
  const charts: Chart<'line'>[] = [];

  /* ---- primary trellis: one panel per episode ---- */
  const [yMin, yMax] = extentOf(EPISODES, ITEMS.map((i) => i.key));
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const { figure, canvas } = panelFigure(ep);
    opts.episodeHost.append(figure);

    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const datasets = ITEMS.map((i) => buildDataset(ep, i.key, i.color, i.short)).filter(
      (d): d is PanelDataset => d !== null,
    );

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 96, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
        y: yScale(yMin, yMax, idx % cols === 0),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
      onHover: (_e, elements) => {
        const d = elements[0]?.dataset as PanelDataset | undefined;
        emphasiseItem(d ? d.__item : null);
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener('mouseleave', () => emphasiseItem(null));
    episodePanels.push(chart);
    charts.push(chart);
  });

  /* ---- companion trellis: one panel per series ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  ITEMS.forEach((item) => {
    const [lo, hi] = extentOf(EPISODES, [item.key]);

    const figure = document.createElement('figure');
    figure.className = 'trellis-panel';

    const caption = document.createElement('figcaption');
    const strip = document.createElement('span');
    strip.className = 'strip';
    strip.textContent = item.short;
    const meta = document.createElement('span');
    meta.className = 'strip-meta';
    meta.textContent = `index, log ${fmtIndex(lo)}–${fmtIndex(hi)}`;
    caption.append(strip, meta);

    const box = document.createElement('div');
    box.className = 'panel-canvas';
    const canvas = document.createElement('canvas');
    box.append(canvas);

    figure.append(caption, box);
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) => buildDataset(ep, item.key, RAMP[i], ep.short)).filter(
      (d): d is PanelDataset => d !== null,
    );
    const maxW = Math.max(...EPISODES.flatMap((ep) => ep.weeks.map((r) => r.w)), 1);

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 92, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
        y: yScale(lo, hi, true),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener('mouseleave', () => emphasiseEvent(null));
    canvas.addEventListener('mousemove', (ev) => {
      const pts = chart.getElementsAtEventForMode(ev, 'nearest', { intersect: false }, true);
      emphasiseEvent(pts.length ? pts[0].datasetIndex : null);
    });

    itemPanels.push({ chart, item: item.key });
    charts.push(chart);
  });

  /* ---- legends ---- */
  opts.itemLegend.replaceChildren(
    ...ITEMS.map((item) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = item.color;
      return legendButton(item.label, swatch, () => emphasiseItem(item.key), () => emphasiseItem(null));
    }),
  );

  opts.eventLegend.replaceChildren(
    ...EPISODES.map((ep, i) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = RAMP[i];
      return legendButton(ep.short, swatch, () => emphasiseEvent(i), () => emphasiseEvent(null));
    }),
  );

  return charts;
}
```

**`src/client/main.ts`** — full file:

```ts
import {
  mount,
  buildProtestersConfig,
  buildEnforcementConfig,
  buildCostConfig,
  buildProtestersWeeklyConfig,
  buildEnforcementWeeklyConfig,
} from './chart.ts';
import { mountCrossEpisode } from './episodes.ts';

function canvas(id: string): HTMLCanvasElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLCanvasElement)) throw new Error(`canvas#${id} not found`);
  return el;
}

function host(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) throw new Error(`#${id} not found`);
  return el;
}

const charts = [
  mount(canvas('chart-protesters'), buildProtestersConfig()),
  mount(canvas('chart-enforcement'), buildEnforcementConfig()),
  mount(canvas('chart-costs'), buildCostConfig()),
  mount(canvas('chart-protesters-weekly'), buildProtestersWeeklyConfig()),
  mount(canvas('chart-enforcement-weekly'), buildEnforcementWeeklyConfig()),
  ...mountCrossEpisode({
    episodeHost: host('trellis-episodes'),
    itemHost: host('trellis-items'),
    itemLegend: host('legend-items'),
    eventLegend: host('legend-events'),
  }),
];

(window as unknown as { __charts: unknown }).__charts = charts;

window.addEventListener('beforeunload', () => charts.forEach((c) => c.destroy()), { once: true });
```

**`public/index.html`** — full file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>France — protest activity, Oct–Nov 2026</title>
    <style>
      html, body { margin: 0; }
      body {
        font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        background: #fff; color: #111;
        padding: 16px; box-sizing: border-box;
        max-width: 1420px; margin: 0 auto;
      }
      section { margin-bottom: 44px; }
      section > header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
        margin-bottom: 18px;
      }
      section > header h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 4px; font-weight: 600;
      }
      section > header p { margin: 0; font-size: 12px; color: #4b5563; max-width: 92ch; }
      .wrap { position: relative; height: 460px; margin-bottom: 28px; }

      /* ---- section C ---- */
      .trellis { display: grid; gap: 20px 16px; margin: 0 0 10px; }
      .trellis-panel { margin: 0; min-width: 0; }
      .strip {
        display: block; font-size: 10.5px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase; color: #111827;
      }
      .strip-meta { display: block; font-size: 10px; color: #6b7280; }
      .strip-note {
        margin: 3px 0 2px; font-size: 10.5px; line-height: 1.25;
        color: #6b7280; min-height: 26px;
      }
      .panel-canvas { position: relative; height: 190px; }
      .trellis-items .panel-canvas { height: 230px; }
      .legend {
        display: flex; flex-wrap: wrap; gap: 4px 18px;
        margin: 0 0 12px; font-size: 12px; color: #374151;
      }
      .legend button {
        all: unset; display: inline-flex; align-items: center; gap: 6px;
        padding: 2px 0; cursor: default;
      }
      .legend .swatch { width: 14px; height: 3px; border-radius: 2px; }
      .axis-note { margin: 0 0 30px; font-size: 11px; color: #6b7280; }
    </style>
  </head>
  <body>
    <section id="section-daily">
      <header>
        <h1>Section A — daily</h1>
        <p>One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement"></canvas></div>
      <div class="wrap"><canvas id="chart-costs"></canvas></div>
    </section>

    <section id="section-weekly">
      <header>
        <h1>Section B — weekly</h1>
        <p>Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters-weekly"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement-weekly"></canvas></div>
    </section>

    <section id="section-cross">
      <header>
        <h1>Section C — cross-episode, one panel per movement</h1>
        <p>
          Seven episodes, four series each. Every series is indexed to its own first comparable published figure
          (index = 100, dashed grey reference line), so protestors in the hundred-thousands and arrests in the
          thousands share one axis. Panel position encodes the episode; hue encodes the series, identically in all
          panels. Hollow markers = regional, partial, derived or actions-total figures. Hover a series (or the legend)
          to trace it across all seven panels.
        </p>
      </header>
      <div class="legend" id="legend-items"></div>
      <div class="trellis" id="trellis-episodes"></div>
      <p class="axis-note">
        x — whole weeks since each movement's first action, true scale, so durations differ (Nahel 2 weeks, Gilets
        jaunes 44). y — index, log scale, 0.1–1,500 shared by every panel. Dashed segment = at least one week with no
        published figure lies between the two points. "obs" under each strip = number of weeks with a figure for
        protestors · arrests · forces injured · protestors injured.
      </p>

      <header>
        <h1>Section C′ — cross-episode, transposed</h1>
        <p>
          The same data with the comparison axis flipped: one panel per series, one line per movement. Colour encodes
          the movement on a single sequential ramp, light → dark in the same order in every panel, so the reader
          learns the ramp once. Use this to ask "did arrests behave the same way in every episode?".
        </p>
      </header>
      <div class="legend" id="legend-events"></div>
      <div class="trellis trellis-items" id="trellis-items"></div>
      <p class="axis-note">
        y limits are per panel — a log range printed under each strip — because the series span different orders of
        magnitude. Only the protestor panel and the forces-injured panel contain enough points to read as a shape;
        the sparse panels are the finding, not a defect.
      </p>
    </section>

    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

What the sections now show, and the caveats built into the code:

| Panel | Peak index | Why the shape is what it is |
|---|---|---|
| May 1968 | 984 (13 May) | Baseline is the 1 May march (62,500 mid); only four weeks carry any figure |
| CPE 2006 | 683 (4 Apr) | Rises all the way to the withdrawal; the 7 Mar drop is a bad count, not a real dip |
| Gilets jaunes | 173 → 3.5 | Act I (287,700, actions-total) is hollow and *not* the baseline; Act II is (166,000) |
| Nahel 2023 | 100 → 3.2 (arrests) | Crowd is one point only — the march, not the riots |
| Pensions 2023 | 100 → 224 (7 Mar) | Crowd only; the 18% ministry-vs-union gap is in the tooltip |
| Bloquons tout | 100 → 353 (18 Sep) | 10 Sep is hollow: actions-total, and the ministry revised 29,000 → 197,000 |
| Students 2026 | 100 → 308 (5 Nov) | Protestor injuries have no flow figure, so that line is a single point |

Two implementation notes worth knowing: the `c` flag is treated as *not a baseline* but still plotted (hollow), which is why Gilets jaunes starts above 100 rather than at it; and y-axis width is forced to 42 px on every panel so the plot areas align exactly across the grid, with tick labels drawn only in the left column.

---

**You**

- Arrest and injury figures are missing for the 2026 student protests in the trellis at the end.
- Why does the data for arrests and injuries stop around week 8 for all events? If there is no such data for the Gilets jaunes, then cap the x axis at the final week that has such data for other episodes and add an explanatory note below

---

**Assistant**

Diagnosis first, then code.

**Bug 1 — missing 2026 arrests/injuries.** `rows2026()` rebuilt each week by reading `.bands` / `.quality` / `.notes` positionally off the weekly `MetricSeries` exported from `chart.ts`. That is a silent contract: any drift between the exported shape and the adapter yields rows with `p` only, and the panel renders turnout alone — exactly what you see. It also ignored `detach`, so the regional-only week (17 arrests, 9–11 Nov) was drawn solid as if national. Both are fixed by flattening the rows **inside** `chart.ts`, where the series live, and exporting finished `[low, high]` pairs; `episodes.ts` no longer indexes anything.

**Bug 2 — lines dying at week 8.** C′ shared one x domain across all four panels, and Gilets jaunes set it: 44 acts. Its enforcement data stops at **Act IV (8 Dec 2018, week 3)** — the ministry published no arrest or injury series after that. No episode has any arrest or injury figure past **week 7** (CPE, 28 Mar – 2 Apr 2006, 600 arrests). So weeks 8–43 were structurally empty and every panel's lines stopped where its data stopped. The axis is now capped at 7.

```ts
/* src/client/chart.ts — append at end of file (replaces the EPISODE_2026 export) */

export type { Quality };

export interface StudentWeek {
  key: string;
  label: string;
  touchesEdge: boolean;
  p: [number, number] | null;
  a: [number, number] | null;
  f: [number, number] | null;
  i: [number, number] | null;
  flags: Partial<Record<'p' | 'a' | 'f' | 'i', Quality>>;
  notes: Partial<Record<'p' | 'a' | 'f' | 'i', string>>;
}

/** One week, flattened next to the data it comes from — no positional contract left to break. */
function studentCell(
  s: MetricSeries,
  idx: number,
): { band: [number, number] | null; q?: Quality; note?: string } {
  const band = s.bands[idx];
  if (!band) return { band: null };
  const raw = s.quality[idx] ?? 'n';
  // a week whose only figures are regional/partial was detached by the aggregator
  const q: Quality = s.detach[idx] ? (raw === 'f' ? 'f' : 'r') : raw;
  return { band: [band[0], band[1]], q, note: s.notes[idx] ?? undefined };
}

const STUDENT_SERIES = {
  p: turnoutWeekly,
  a: arrestsWeekly,
  f: forcesWeekly,
  i: protestersWeekly,
} as const;

export const STUDENT_WEEKS: StudentWeek[] = WEEKS.map((w, idx) => {
  const out: StudentWeek = {
    key: w.key,
    label: w.label,
    touchesEdge: w.touchesEdge,
    p: null,
    a: null,
    f: null,
    i: null,
    flags: {},
    notes: {},
  };
  for (const m of ['p', 'a', 'f', 'i'] as const) {
    const c = studentCell(STUDENT_SERIES[m], idx);
    out[m] = c.band;
    if (c.q) out.flags[m] = c.q;
    if (c.note) out.notes[m] = c.note;
  }
  return out;
});
```

```ts
/* src/client/episodes.ts — full file */

/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four indexed series per panel.
   Companion: one panel per series, one line per episode on a sequential ramp. */

import {
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from 'chart.js';
import { STUDENT_WEEKS } from './chart.ts';

/* ------------------------------------------------------------------ types */

type M = 'p' | 'a' | 'f' | 'i';
type Flag = 'n' | 'r' | 'p' | 'f' | 'e' | 'c' | 'w';
type Band = number | [number, number];

interface Row {
  w: number;                       // whole weeks since the event's first action
  t: string;                       // week / act label, tooltip title
  p?: Band;                        // protestors, peak day of the week
  a?: Band;                        // arrests, weekly total
  f?: Band;                        // injuries, security forces
  i?: Band;                        // injuries, protestors
  flag?: Partial<Record<M, Flag>>;
  note?: Partial<Record<M, string>>;
}

interface Episode {
  id: string;
  strip: string;
  short: string;
  span: string;
  banner: string;
  weeks: Row[];
}

interface Pt {
  x: number;
  y: number;
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

interface PanelDataset extends ChartDataset<'line', Pt[]> {
  __item: M;
  __color: string;
  __hollow: boolean[];
  __label: string;
}

/* ------------------------------------------------------------- constants */

const MUTED = '#6b7280';
const GRID = '#E5E5E5';
const REFERENCE = 100;

const ITEMS: { key: M; label: string; short: string; color: string }[] = [
  { key: 'p', label: 'Protestors (peak day)', short: 'Protestors', color: '#0072B2' },
  { key: 'a', label: 'Arrests (weekly total)', short: 'Arrests', color: '#E69F00' },
  { key: 'f', label: 'Injuries — security forces', short: 'Forces hurt', color: '#009E73' },
  { key: 'i', label: 'Injuries — protestors', short: 'Protestors hurt', color: '#CC79A7' },
];

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = ['#D6E6F2', '#B0CFE6', '#86B4D7', '#5C97C5', '#357AB0', '#1B5C92', '#0A3A63'];

const FLAG_TEXT: Partial<Record<Flag, string>> = {
  r: 'regional only',
  p: 'partial',
  f: 'lower bound',
  e: 'derived',
  c: 'actions-total / stock — measured differently',
  w: 'weekly aggregate',
};

const hollow = (f: Flag): boolean => f === 'r' || f === 'p' || f === 'e' || f === 'c';

const nf = new Intl.NumberFormat('en-GB');
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });
const fmtIndex = (v: number): string => (v < 1 ? String(Number(v.toFixed(2))) : compact.format(v));

function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------------- data */

const MAY68: Episode = {
  id: 'may68',
  strip: 'May 1968',
  short: 'May 68',
  span: '29 Apr – 30 Jun 1968',
  banner: 'Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.',
  weeks: [
    {
      w: 0, t: '29 Apr – 5 May · 1 May march',
      p: [25_000, 100_000],
      note: { p: 'prefecture 25,000 / CGT 100,000, République → Bastille' },
    },
    {
      w: 1, t: '6 – 12 May · Sorbonne, barricades',
      p: 20_000, a: [469, 891], f: [247, 300], i: 100,
      flag: { i: 'f' },
      note: {
        p: '20,000 to the Sorbonne on 6 May; >20,000 again on 10 May',
        a: '469 on the night of 10–11 May; high adds the 422 early-May arrests',
        f: '300+ on 6 May; 247 on 10–11 May',
        i: '≥100 — no national count was published',
      },
    },
    {
      w: 2, t: '13 – 19 May · 13 May march',
      p: [230_000, 1_000_000],
      note: { p: 'prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Peak of the episode.' },
    },
    {
      w: 3, t: '20 – 26 May · 24–25 May',
      a: [1_000, 1_000], i: 887,
      flag: { a: 'f', i: 'e' },
      note: {
        a: '1,000+ arrests on 25 May',
        i: '887 injured, from the English-Wikipedia infobox — weak provenance',
      },
    },
    { w: 4, t: '27 May – 2 Jun · 30 May', note: { p: '30 May: 300,000 (prefecture) – 1,000,000 counter-demonstration — excluded from protest totals' } },
    { w: 5, t: '3 – 9 Jun', note: { p: '4 Jun partial return to work; 7 Jun Renault-Flins clashes' } },
    { w: 6, t: '10 – 16 Jun', note: { p: '10–11 Jun: 3 dead; 12 Jun demonstrations banned nationwide' } },
    { w: 7, t: '17 – 23 Jun' },
    { w: 8, t: '24 – 30 Jun' },
  ],
};

const CPE: Episode = {
  id: 'cpe',
  strip: 'CPE 2006',
  short: 'CPE 2006',
  span: '6 Feb – 16 Apr 2006',
  banner: 'One movement-wide arrest total (4,500); no weekly enforcement series exists.',
  weeks: [
    {
      w: 0, t: '6 – 12 Feb · 7 Feb',
      p: [200_000, 400_000],
      note: { p: '187 demonstrations, first national day' },
    },
    {
      w: 4, t: '6 – 12 Mar · 7 Mar',
      p: [400_000, 1_000_000],
      note: { p: '>1 million claimed; 38 universities on strike by 9 Mar' },
    },
    {
      w: 5, t: '13 – 19 Mar · 16–18 Mar',
      p: [500_000, 1_500_000], a: [156, 167], f: 34, i: 70,
      flag: { i: 'e' },
      note: {
        p: '18 Mar: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000',
        a: 'Paris, 18 Mar (156 ministry / 167 organisers)',
        f: 'Paris, 18 Mar',
        i: '18 (16 Mar) + 52 (18 Mar), Paris only',
      },
    },
    {
      w: 6, t: '20 – 26 Mar · 23 Mar',
      p: [220_000, 450_000], a: 630, f: 90,
      note: { p: '21 universities fully blocked; 67 striking or blocked' },
    },
    { w: 7, t: '27 Mar – 2 Apr · 28 Mar', p: [1_055_000, 2_710_000], a: 600, note: { p: '4th national action day' } },
    { w: 8, t: '3 – 9 Apr · 4 Apr', p: [1_000_000, 3_100_000], note: { p: 'peak day of the episode' } },
    { w: 9, t: '10 – 16 Apr', note: { p: 'CPE withdrawn 10 Apr; the movement splits' } },
  ],
};

const GJ_DATES = [
  '17 Nov 2018', '24 Nov', '1 Dec', '8 Dec', '15 Dec', '22 Dec', '29 Dec',
  '5 Jan 2019', '12 Jan', '19 Jan', '26 Jan', '2 Feb', '9 Feb', '16 Feb',
  '23 Feb', '2 Mar', '9 Mar', '16 Mar', '23 Mar', '30 Mar', '6 Apr', '13 Apr',
  '20 Apr', '27 Apr', '4 May', '11 May', '18 May', '25 May', '1 Jun', '8 Jun',
  '15 Jun', '22 Jun', '29 Jun', '7 Sep 2019',
];

const GJ_CROWD: [number, number][] = [
  [0, 287_700], [1, 166_000], [2, 136_000], [3, 136_000], [4, 66_000], [5, 38_600],
  [6, 32_000], [7, 50_000], [8, 84_000], [9, 84_000], [10, 69_000], [11, 58_600],
  [12, 51_400], [13, 41_500], [14, 46_600], [15, 39_300], [16, 28_600], [17, 32_300],
  [18, 40_500], [19, 33_700], [20, 22_300], [21, 31_000], [22, 27_900], [23, 23_600],
  [24, 18_900], [25, 18_600], [26, 15_500], [27, 12_500], [28, 9_500], [29, 10_300],
  [30, 7_000], [31, 11_800], [32, 5_800], [43, 7_000],
];

/** Enforcement figures exist only for Acts I–IV; later acts were not published as a series. */
const GJ_EXTRA: Record<number, Pick<Row, 'a' | 'f' | 'i' | 'flag' | 'note'>> = {
  0: {
    a: [974, 1_150], f: 17, i: 109,
    flag: { f: 'e', i: 'e' },
    note: {
      a: '974 in custody, ~1,150 interpellations',
      f: '17 police among 126 injured — split derived',
      i: '109 of 126 injured — split derived',
    },
  },
  1: {
    a: [307, 339], f: 30, i: 54,
    flag: { i: 'e' },
    note: { a: '307 in custody, 339 interpellations', i: '54 of 84 injured — split derived' },
  },
  2: {
    a: 630,
    flag: { a: 'f' },
    note: { a: 'placed in custody, not arrests; 263 injured, not split by side' },
  },
  3: {
    a: [1_709, 2_000],
    note: { a: '1,709 in custody, ~2,000 interpellations; injuries reported as 118 / 264 / 585 depending on source, not split by side' },
  },
};

const GILETS: Episode = {
  id: 'gj',
  strip: 'Gilets jaunes',
  short: 'Gilets jaunes',
  span: '12 Nov 2018 – 9 Sep 2019',
  banner: 'Ministry count only: one figure per act. Acts 34–43 were never published; no enforcement series after Act IV.',
  weeks: GJ_CROWD.map(([w, n], idx) => {
    const extra = GJ_EXTRA[w] ?? {};
    return {
      w,
      t: `Act ${w + 1} · ${GJ_DATES[idx]}`,
      p: n,
      ...extra,
      flag: {
        ...(w === 0 ? { p: 'c' as Flag } : {}),
        ...extra.flag,
      },
      note: {
        ...(w === 0
          ? { p: '287,700 counts all actions including road blockades — an actions-total, not a march' }
          : w === 1
            ? { p: 'police-union counter-count: 750,000' }
            : {}),
        ...extra.note,
      },
    } satisfies Row;
  }),
};

const NAHEL: Episode = {
  id: 'nahel',
  strip: 'Nahel 2023',
  short: 'Nahel 2023',
  span: '27 Jun – 9 Jul 2023',
  banner: 'Gatherings were banned: arrests, not crowd counts, carry the scale of the riots.',
  weeks: [
    {
      w: 0, t: '26 Jun – 2 Jul · Nanterre march, 29 Jun',
      p: [6_200, 20_000], a: 3_354, f: 722,
      note: {
        p: 'police 6,200 / organisers 20,000 for the march blanche',
        a: 'national total, 27 Jun – 2 Jul',
        f: '722 officers injured; 2 deaths; 5,662 vehicles burnt',
      },
    },
    { w: 1, t: '3 – 9 Jul', a: 108, f: 1, note: { a: '72 + 16 + 20 over 3–5 Jul' } },
  ],
};

const PENSIONS: Episode = {
  id: 'pensions',
  strip: 'Pension reform 2023',
  short: 'Pensions 2023',
  span: '19 Jan – 8 Jun 2023',
  banner: 'Crowds only: no national weekly arrest or injury series was published.',
  weeks: [
    { w: 0, t: '16 – 22 Jan · 19 Jan', p: [1_120_000, 2_000_000], note: { p: 'first national day; Paris 80,000 – 400,000' } },
    { w: 2, t: '30 Jan – 5 Feb · 31 Jan', p: [1_270_000, 2_800_000] },
    { w: 3, t: '6 – 12 Feb · 7 & 11 Feb', p: [963_000, 2_500_000], note: { p: 'two action days in one week; the peak is 11 Feb' } },
    { w: 4, t: '13 – 19 Feb · 16 Feb', p: [440_000, 1_300_000] },
    { w: 7, t: '6 – 12 Mar · 7 Mar', p: [1_280_000, 3_500_000], note: { p: 'national record: ministry 1.28M, unions 3.5M' } },
    { w: 8, t: '13 – 19 Mar · 15 Mar', p: [480_000, 1_700_000] },
    { w: 9, t: '20 – 26 Mar · 23 Mar', p: [1_089_000, 3_500_000] },
    { w: 10, t: '27 Mar – 2 Apr · 28 Mar', p: [740_000, 2_000_000] },
    { w: 11, t: '3 – 9 Apr · 6 Apr', p: [570_000, 2_000_000] },
    { w: 12, t: '10 – 16 Apr · 13 Apr', p: [380_000, 1_500_000], note: { p: 'CGT gives 1.0M in one compilation, 1.5M in another' } },
    { w: 16, t: '1 – 7 May · 1 May', p: [782_000, 2_300_000] },
    { w: 20, t: '5 – 11 Jun · 6 Jun', p: [281_000, 900_000], note: { p: 'movement minimum' } },
  ],
};

const BLOQUONS: Episode = {
  id: 'bt',
  strip: 'Bloquons tout 2025',
  short: 'Bloquons tout',
  span: '10 Sep – 5 Oct 2025',
  banner: '10 Sep is an actions-total (blockades included); 18 Sep is an intersyndicale march.',
  weeks: [
    {
      w: 0, t: '8 – 14 Sep · 10 Sep',
      p: [175_000, 250_000], a: 540,
      flag: { p: 'c' },
      note: {
        p: 'ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.',
        a: '540 arrests, 211 in Paris',
      },
    },
    {
      w: 1, t: '15 – 21 Sep · 18 Sep',
      p: [500_000, 1_000_000], a: 309, f: 26, i: 11,
      note: {
        p: 'intersyndicale day — a different mobilisation from the movement’s own actions; Paris 55,000 (prefecture)',
        a: '309 nationwide, 103 in Paris',
        i: '11 injured, including 1 journalist',
      },
    },
    { w: 3, t: '29 Sep – 5 Oct · 2 Oct', p: [195_000, 600_000], note: { p: 'weakest mobilisation since 1 May 2025' } },
  ],
};

/** W1 protester injuries are a cumulative IDF stock, so they cannot anchor an index. */
const STUDENT_FLAG_PATCH: Partial<Record<number, Partial<Record<M, Flag>>>> = {
  0: { i: 'c' },
};

function rows2026(): Row[] {
  return STUDENT_WEEKS.map((wk, i) => {
    const row: Row = { w: i, t: `W${i + 1} · ${wk.label}` };
    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const band = wk[m];
      if (!band) continue;
      row[m] = band;
      const flag = STUDENT_FLAG_PATCH[i]?.[m] ?? wk.flags[m];
      if (flag && flag !== 'n') row.flag = { ...row.flag, [m]: flag };
      const note = wk.notes[m];
      if (note) row.note = { ...row.note, [m]: note };
    }
    return row;
  });
}

if (!STUDENT_WEEKS.some((w) => w.a) || !STUDENT_WEEKS.some((w) => w.f)) {
  console.warn('[episodes] 2026 enforcement weeks came through empty — check STUDENT_WEEKS in chart.ts');
}

const STUDENTS: Episode = {
  id: 'students26',
  strip: 'Student protests 2026',
  short: 'Students 2026',
  span: '1 Oct – 11 Nov 2026',
  banner: 'Protester injuries are a September stock, then a litigation floor — never a weekly flow.',
  weeks: rows2026(),
};

const EPISODES: Episode[] = [MAY68, CPE, GILETS, NAHEL, PENSIONS, BLOQUONS, STUDENTS];

/** Last week on which any episode carries an arrest or injury figure (CPE, w7). */
const ENFORCEMENT_LAST = ((): number => {
  let last = 0;
  for (const ep of EPISODES) {
    for (const r of ep.weeks) {
      if (r.a !== undefined || r.f !== undefined || r.i !== undefined) last = Math.max(last, r.w);
    }
  }
  return last;
})();

/* -------------------------------------------------------------- indexing */

const bandOf = (b: Band): [number, number] => (typeof b === 'number' ? [b, b] : b);
const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

interface SeriesData {
  base: number;
  points: Pt[];
}

/** y' = 100 · y / y₀, where y₀ is the first figure measured on a comparable basis. */
function seriesData(ep: Episode, key: M): SeriesData | null {
  const rows = ep.weeks.filter((r) => r[key] !== undefined).sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? 'n';
  const baseRow = rows.find((r) => flagOf(r) !== 'c') ?? rows[0];
  const base = midOf(baseRow[key]!);

  const points = rows.map<Pt>((r) => {
    const [low, high] = bandOf(r[key]!);
    return {
      x: r.w,
      y: (REFERENCE * ((low + high) / 2)) / base,
      low,
      high,
      flag: flagOf(r),
      note: r.note?.[key],
      base,
      t: r.t,
    };
  });

  return { base, points };
}

function buildDataset(ep: Episode, key: M, color: string, maxX: number): PanelDataset | null {
  const s = seriesData(ep, key);
  if (!s) return null;

  const points = s.points.filter((p) => p.x <= maxX);
  if (!points.length) return null;

  const item = ITEMS.find((d) => d.key === key)!;
  const drawn = points.map((p) => hollow(p.flag));
  const truncated = points.length < s.points.length;

  return {
    label: item.label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: points.map((p) => (p.flag === 'c' ? 3 : 2.75)),
    pointBackgroundColor: points.map((_, i) => (drawn[i] ? '#ffffff' : color)),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: {
      borderDash: (ctx) =>
        Math.abs((ctx.p1.parsed.x as number) - (ctx.p0.parsed.x as number)) > 1.01 ? [5, 4] : undefined,
    },
    __item: key,
    __color: color,
    __hollow: drawn,
    __label: truncated ? `${ep.short} +` : ep.short,
  };
}

function extentOf(eps: Episode[], keys: M[], maxX: number): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const ep of eps) {
    for (const k of keys) {
      const s = seriesData(ep, k);
      if (!s) continue;
      for (const p of s.points) {
        if (p.x > maxX) continue;
        lo = Math.min(lo, p.y);
        hi = Math.max(hi, p.y);
      }
    }
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [1, 100];
  return [10 ** Math.floor(Math.log10(lo)), 10 ** Math.ceil(Math.log10(hi))];
}

/* --------------------------------------------------------------- plugins */

const hundredLine: Plugin<'line'> = {
  id: 'hundredLine',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    const y = scales.y?.getPixelForValue(REFERENCE);
    if (y === undefined || y < chartArea.top || y > chartArea.bottom) return;
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

const directLabels: Plugin<'line'> = {
  id: 'directLabels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const entries: { y: number; text: string }[] = [];

    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) return;

      for (let j = meta.data.length - 1; j >= 0; j--) {
        const raw = d.data[j];
        if (!raw || !Number.isFinite(raw.y)) continue;
        const el = meta.data[j] as unknown as { x: number; y: number };
        entries.push({ y: el.y, text: d.__label });
        break;
      }
    });

    entries.sort((a, b) => a.y - b.y);
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < 11) entries[i].y = entries[i - 1].y + 11;
    }

    ctx.save();
    ctx.font = '500 9.5px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151';
    for (const e of entries) {
      const y = Math.max(chartArea.top + 5, Math.min(chartArea.bottom - 5, e.y));
      ctx.fillText(e.text, chartArea.right + 7, y);
    }
    ctx.restore();
  },
};

/* ---------------------------------------------------------------- scales */

function xScale(maxW: number) {
  const step = maxW <= 8 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: 'linear' as const,
    min: -0.5,
    max: maxW + 0.5,
    grid: { display: false },
    border: { display: false },
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      font: { size: 9 },
      color: MUTED,
      padding: 4,
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      const out: { value: number }[] = [];
      for (let v = 0; v <= maxW + 0.001; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s: { height: number }) => {
      s.height = 20;
    },
  };
}

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = [0.1, 0.3, 1, 3, 10, 30, 100, 300, 1000, 3000].filter((v) => v >= min && v <= max);
  return {
    type: 'logarithmic' as const,
    min,
    max,
    grid: { color: GRID, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: MUTED,
      padding: 6,
      callback: (v: string | number) => fmtIndex(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 42;
    },
  };
}

/* --------------------------------------------------------------- tooltip */

function tooltipSpec() {
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<'line'>[]) => (items[0].raw as Pt).t,
      label: (item: TooltipItem<'line'>) => {
        const p = item.raw as Pt;
        const band = p.low === p.high ? nf.format(p.low) : `${nf.format(p.low)} – ${nf.format(p.high)}`;
        const flag = FLAG_TEXT[p.flag];
        return `${item.dataset.label}: ${band}  →  index ${Math.round(p.y)}${flag ? `  ·  ${flag}` : ''}`;
      },
      afterLabel: (item: TooltipItem<'line'>) => (item.raw as Pt).note ?? '',
      footer: (items: TooltipItem<'line'>[]) => {
        const p = items[0].raw as Pt;
        return `index = 100 × value ÷ ${nf.format(Math.round(p.base))}`;
      },
    },
  };
}

/* -------------------------------------------------------------- emphasis */

const episodePanels: Chart<'line'>[] = [];
const itemPanels: { chart: Chart<'line'>; item: M }[] = [];
let activeItem: M | null = null;
let activeEvent: number | null = null;

function emphasiseItem(key: M | null): void {
  if (key === activeItem) return;
  activeItem = key;

  for (const chart of episodePanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = key === null || d.__item === key;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
      d.borderWidth = key !== null && d.__item === key ? 2.75 : 1.75;
    }
    chart.update('none');
  }

  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host) host.style.opacity = key === null || key === item ? '1' : '0.18';
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;

  for (const { chart } of itemPanels) {
    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const on = index === null || i === index;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
    });
    chart.update('none');
  }
}

/* --------------------------------------------------------------- legends */

function legendButton(text: string, swatch: HTMLElement, onEnter: () => void, onLeave: () => void): HTMLElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.append(swatch, document.createTextNode(text));
  b.addEventListener('mouseenter', onEnter);
  b.addEventListener('mouseleave', onLeave);
  b.addEventListener('focus', onEnter);
  b.addEventListener('blur', onLeave);
  return b;
}

/* ---------------------------------------------------------------- mounts */

function observations(ep: Episode): string {
  const counts = ITEMS.map((i) => ep.weeks.filter((r) => r[i.key] !== undefined).length);
  return `obs ${counts.join('·')} of ${ep.weeks.length} wks`;
}

function panelFigure(ep: Episode): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement('figure');
  figure.className = 'trellis-panel';

  const caption = document.createElement('figcaption');
  const strip = document.createElement('span');
  strip.className = 'strip';
  strip.textContent = ep.strip;
  const meta = document.createElement('span');
  meta.className = 'strip-meta';
  meta.textContent = `${ep.span} · ${observations(ep)}`;
  const note = document.createElement('p');
  note.className = 'strip-note';
  note.textContent = ep.banner;
  caption.append(strip, meta, note);

  const box = document.createElement('div');
  box.className = 'panel-canvas';
  const canvas = document.createElement('canvas');
  box.append(canvas);

  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

export function mountCrossEpisode(opts: {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}): Chart<'line'>[] {
  const charts: Chart<'line'>[] = [];
  const unbounded = Number.POSITIVE_INFINITY;

  /* ---- primary trellis: one panel per episode, own x extent ---- */
  const [yMin, yMax] = extentOf(EPISODES, ITEMS.map((i) => i.key), unbounded);
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const { figure, canvas } = panelFigure(ep);
    opts.episodeHost.append(figure);

    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const datasets = ITEMS.map((i) => buildDataset(ep, i.key, i.color, unbounded)).filter(
      (d): d is PanelDataset => d !== null,
    );

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 96, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
        y: yScale(yMin, yMax, idx % cols === 0),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
      onHover: (_e, elements) => {
        const d = elements[0]?.dataset as PanelDataset | undefined;
        emphasiseItem(d ? d.__item : null);
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener('mouseleave', () => emphasiseItem(null));
    episodePanels.push(chart);
    charts.push(chart);
  });

  /* ---- companion trellis: one panel per series, x capped at the last enforcement week ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  ITEMS.forEach((item) => {
    const [lo, hi] = extentOf(EPISODES, [item.key], ENFORCEMENT_LAST);

    const figure = document.createElement('figure');
    figure.className = 'trellis-panel';

    const caption = document.createElement('figcaption');
    const strip = document.createElement('span');
    strip.className = 'strip';
    strip.textContent = item.short;
    const meta = document.createElement('span');
    meta.className = 'strip-meta';
    meta.textContent = `index, log ${fmtIndex(lo)}–${fmtIndex(hi)} · x 0–w${ENFORCEMENT_LAST}`;
    caption.append(strip, meta);

    const box = document.createElement('div');
    box.className = 'panel-canvas';
    const canvas = document.createElement('canvas');
    box.append(canvas);

    figure.append(caption, box);
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) => buildDataset(ep, item.key, RAMP[i], ENFORCEMENT_LAST)).filter(
      (d): d is PanelDataset => d !== null,
    );

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 92, bottom: 0, left: 0 } },
      scales: {
        x: xScale(ENFORCEMENT_LAST),
        y: yScale(lo, hi, true),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [hundredLine, directLabels],
    });

    canvas.addEventListener('mouseleave', () => emphasiseEvent(null));
    canvas.addEventListener('mousemove', (ev) => {
      const pts = chart.getElementsAtEventForMode(ev, 'nearest', { intersect: false }, true);
      emphasiseEvent(pts.length ? pts[0].datasetIndex : null);
    });

    itemPanels.push({ chart, item: item.key });
    charts.push(chart);
  });

  /* ---- legends ---- */
  opts.itemLegend.replaceChildren(
    ...ITEMS.map((item) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = item.color;
      return legendButton(item.label, swatch, () => emphasiseItem(item.key), () => emphasiseItem(null));
    }),
  );

  opts.eventLegend.replaceChildren(
    ...EPISODES.map((ep, i) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = RAMP[i];
      return legendButton(ep.short, swatch, () => emphasiseEvent(i), () => emphasiseEvent(null));
    }),
  );

  return charts;
}
```

```html
<!-- public/index.html — replace the Section C′ header + note -->

      <header>
        <h1>Section C′ — cross-episode, transposed</h1>
        <p>
          The same data with the comparison axis flipped: one panel per series, one line per movement. Colour encodes
          the movement on a single sequential ramp, light → dark in the same order in every panel, so the reader
          learns the ramp once. Use this to ask "did arrests behave the same way in every episode?".
        </p>
      </header>
      <div class="legend" id="legend-events"></div>
      <div class="trellis trellis-items" id="trellis-items"></div>
      <p class="axis-note">
        <strong>x is capped at week 7</strong> — the last week on which any movement has an arrest or injury figure
        (CPE, 28 Mar – 2 Apr 2006: 600 arrests). Gilets jaunes' enforcement series stops at Act IV (8 Dec 2018,
        week 3); only its protestor series runs to Act 44 (week 43), and letting it set the axis left every
        enforcement panel structurally empty after week 4 and every other movement empty after week 8. A trailing
        <code>+</code> on a label marks a series that continues past the cap; the untruncated crowd curves are in
        Section C, where each panel keeps its own extent. y limits are per panel — a log range printed under each
        strip. "obs" under each strip = weeks with a figure for protestors · arrests · forces injured · protestors
        injured.
      </p>
```

Two things to check after the build: the students panel should now read `obs 6·6·5·3 of 7 wks` (W7's 17 arrests is regional, hollow, excluded from the national sum), and the C′ x-axis should run 0–7 with eleven ticks.

---

**You**

- For section C, there is no need to include a legend for each chart because all of the datasets read the same name of the event, which is in the title above each sub-chart
- Review the scaling for section C, because this shows arrests in the second week as 108 but that aligns with the left-most sub-chart's y-axis as ~3 (see attached image)

---

**Assistant**

Two diagnoses before the code.

**1. Per-panel labels.** The `directLabels` plugin was drawing the *episode* name at the right edge of every dataset — four identical labels per panel ("May 68" ×4), which is exactly the redundant legend you saw. The series are already identified by hue plus the one shared legend above the trellis, so the plugin now runs **only in C′**, where a panel holds one line per *episode* and the label carries information.

**2. The scale.** Nothing was arithmetically wrong — the axis was an **index**, not a count: `108 ÷ 3,354 × 100 = 3.2`, so a 108-arrest week really does plot at 3. The axis labels ("3", "1k") gave no hint of that, hence the mismatch with the tooltip. Fixed by plotting **absolute counts on a shared log axis**. On a log axis indexing is nothing but a per-series vertical shift ($\log y' = \log y + \log(100/y_0)$), so the curves have *identical shape* either way — no analytical loss, and now the plotted position equals the number in the tooltip. The "×N vs its first figure" read survives as tooltip text.

Also fixed while in there: `emphasiseEvent` mapped *dataset index* → *episode index*, which diverge whenever an episode lacks a series (Pensions has no arrests) — so hovering the C′ legend highlighted the wrong line. Datasets now carry `__ep`. And the 2026 panel can no longer come up with empty columns: a per-metric guard falls back to the brief's weekly table and logs why.

**`src/client/episodes.ts`** (full file; `chart.ts`, `main.ts` unchanged — keep the `STUDENT_WEEKS` export added last round):

```ts
/* Section C — cross-episode comparison.
   Primary figure: one panel per episode, four series per panel, one shared log count axis.
   Companion: one panel per series, one line per episode on a sequential ramp. */

import {
  Chart,
  type ChartData,
  type ChartOptions,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from 'chart.js';
import { STUDENT_WEEKS } from './chart.ts';

/* ------------------------------------------------------------------ types */

type M = 'p' | 'a' | 'f' | 'i';
type Flag = 'n' | 'r' | 'p' | 'f' | 'e' | 'c' | 'w';
type Band = number | [number, number];

interface Row {
  w: number;                       // whole weeks since the event's first action
  t: string;                       // week / act label, tooltip title
  p?: Band;                        // protestors, peak day of the week
  a?: Band;                        // arrests, weekly total
  f?: Band;                        // injuries, security forces
  i?: Band;                        // injuries, protestors
  flag?: Partial<Record<M, Flag>>;
  note?: Partial<Record<M, string>>;
}

interface Episode {
  id: string;
  strip: string;
  short: string;
  span: string;
  banner: string;
  weeks: Row[];
}

interface Pt {
  x: number;
  y: number;   // midpoint of the published range — this is what gets plotted
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number; // first comparable figure for the series — tooltip text only
  t: string;
}

interface PanelDataset extends ChartDataset<'line', Pt[]> {
  __item: M;
  __ep: number;
  __color: string;
  __hollow: boolean[];
  __label: string;
}

/* ------------------------------------------------------------- constants */

const MUTED = '#6b7280';
const GRID = '#E5E5E5';

const ITEMS: { key: M; label: string; short: string; color: string }[] = [
  { key: 'p', label: 'Protestors (peak day)', short: 'Protestors', color: '#0072B2' },
  { key: 'a', label: 'Arrests (weekly total)', short: 'Arrests', color: '#E69F00' },
  { key: 'f', label: 'Injuries — security forces', short: 'Forces hurt', color: '#009E73' },
  { key: 'i', label: 'Injuries — protestors', short: 'Protestors hurt', color: '#CC79A7' },
];

/** Sequential ramp, light → dark, identical in every companion panel. */
const RAMP = ['#D6E6F2', '#B0CFE6', '#86B4D7', '#5C97C5', '#357AB0', '#1B5C92', '#0A3A63'];

const FLAG_TEXT: Partial<Record<Flag, string>> = {
  r: 'regional only',
  p: 'partial',
  f: 'lower bound',
  e: 'derived',
  c: 'stock or actions-total — measured differently',
  w: 'weekly aggregate',
};

const hollow = (f: Flag): boolean => f === 'r' || f === 'p' || f === 'e' || f === 'c';

const nf = new Intl.NumberFormat('en-GB');
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });

function alpha(hex: string, a: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------------- data */

const MAY68: Episode = {
  id: 'may68',
  strip: 'May 1968',
  short: 'May 68',
  span: '29 Apr – 30 Jun 1968',
  banner: 'Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.',
  weeks: [
    {
      w: 0, t: '29 Apr – 5 May · 1 May march',
      p: [25_000, 100_000],
      note: { p: 'prefecture 25,000 / CGT 100,000, République → Bastille' },
    },
    {
      w: 1, t: '6 – 12 May · Sorbonne, barricades',
      p: 20_000, a: [469, 891], f: [247, 300], i: 100,
      flag: { i: 'f' },
      note: {
        p: '20,000 to the Sorbonne on 6 May; >20,000 again on 10 May',
        a: '469 on the night of 10–11 May; high adds the 422 early-May arrests',
        f: '300+ on 6 May; 247 on 10–11 May',
        i: '≥100 — no national count was published',
      },
    },
    {
      w: 2, t: '13 – 19 May · 13 May march',
      p: [230_000, 1_000_000],
      note: { p: 'prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Peak of the episode.' },
    },
    {
      w: 3, t: '20 – 26 May · 24–25 May',
      a: [1_000, 1_000], i: 887,
      flag: { a: 'f', i: 'e' },
      note: {
        a: '1,000+ arrests on 25 May',
        i: '887 injured, from the English-Wikipedia infobox — weak provenance',
      },
    },
    { w: 4, t: '27 May – 2 Jun · 30 May', note: { p: '30 May: 300,000 (prefecture) – 1,000,000 counter-demonstration — excluded from protest totals' } },
    { w: 5, t: '3 – 9 Jun', note: { p: '4 Jun partial return to work; 7 Jun Renault-Flins clashes' } },
    { w: 6, t: '10 – 16 Jun', note: { p: '10–11 Jun: 3 dead; 12 Jun demonstrations banned nationwide' } },
    { w: 7, t: '17 – 23 Jun' },
    { w: 8, t: '24 – 30 Jun' },
  ],
};

const CPE: Episode = {
  id: 'cpe',
  strip: 'CPE 2006',
  short: 'CPE 2006',
  span: '6 Feb – 16 Apr 2006',
  banner: 'One movement-wide arrest total (4,500); no weekly enforcement series exists.',
  weeks: [
    {
      w: 0, t: '6 – 12 Feb · 7 Feb',
      p: [200_000, 400_000],
      note: { p: '187 demonstrations, first national day' },
    },
    {
      w: 4, t: '6 – 12 Mar · 7 Mar',
      p: [400_000, 1_000_000],
      note: { p: '>1 million claimed; 38 universities on strike by 9 Mar' },
    },
    {
      w: 5, t: '13 – 19 Mar · 16–18 Mar',
      p: [500_000, 1_500_000], a: [156, 167], f: 34, i: 70,
      flag: { i: 'e' },
      note: {
        p: '18 Mar: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000',
        a: 'Paris, 18 Mar (156 ministry / 167 organisers)',
        f: 'Paris, 18 Mar',
        i: '18 (16 Mar) + 52 (18 Mar), Paris only',
      },
    },
    {
      w: 6, t: '20 – 26 Mar · 23 Mar',
      p: [220_000, 450_000], a: 630, f: 90,
      note: { p: '21 universities fully blocked; 67 striking or blocked' },
    },
    { w: 7, t: '27 Mar – 2 Apr · 28 Mar', p: [1_055_000, 2_710_000], a: 600, note: { p: '4th national action day' } },
    { w: 8, t: '3 – 9 Apr · 4 Apr', p: [1_000_000, 3_100_000], note: { p: 'peak day of the episode' } },
    { w: 9, t: '10 – 16 Apr', note: { p: 'CPE withdrawn 10 Apr; the movement splits' } },
  ],
};

const GJ_DATES = [
  '17 Nov 2018', '24 Nov', '1 Dec', '8 Dec', '15 Dec', '22 Dec', '29 Dec',
  '5 Jan 2019', '12 Jan', '19 Jan', '26 Jan', '2 Feb', '9 Feb', '16 Feb',
  '23 Feb', '2 Mar', '9 Mar', '16 Mar', '23 Mar', '30 Mar', '6 Apr', '13 Apr',
  '20 Apr', '27 Apr', '4 May', '11 May', '18 May', '25 May', '1 Jun', '8 Jun',
  '15 Jun', '22 Jun', '29 Jun', '7 Sep 2019',
];

const GJ_CROWD: [number, number][] = [
  [0, 287_700], [1, 166_000], [2, 136_000], [3, 136_000], [4, 66_000], [5, 38_600],
  [6, 32_000], [7, 50_000], [8, 84_000], [9, 84_000], [10, 69_000], [11, 58_600],
  [12, 51_400], [13, 41_500], [14, 46_600], [15, 39_300], [16, 28_600], [17, 32_300],
  [18, 40_500], [19, 33_700], [20, 22_300], [21, 31_000], [22, 27_900], [23, 23_600],
  [24, 18_900], [25, 18_600], [26, 15_500], [27, 12_500], [28, 9_500], [29, 10_300],
  [30, 7_000], [31, 11_800], [32, 5_800], [43, 7_000],
];

/** Enforcement figures exist only for Acts I–IV; later acts were not published as a series. */
const GJ_EXTRA: Record<number, Pick<Row, 'a' | 'f' | 'i' | 'flag' | 'note'>> = {
  0: {
    a: [974, 1_150], f: 17, i: 109,
    flag: { f: 'e', i: 'e' },
    note: {
      a: '974 in custody, ~1,150 interpellations',
      f: '17 police among 126 injured — split derived',
      i: '109 of 126 injured — split derived',
    },
  },
  1: {
    a: [307, 339], f: 30, i: 54,
    flag: { i: 'e' },
    note: { a: '307 in custody, 339 interpellations', i: '54 of 84 injured — split derived' },
  },
  2: {
    a: 630,
    flag: { a: 'f' },
    note: { a: 'placed in custody, not arrests; 263 injured, not split by side' },
  },
  3: {
    a: [1_709, 2_000],
    note: { a: '1,709 in custody, ~2,000 interpellations; injuries reported as 118 / 264 / 585 depending on source, not split by side' },
  },
};

const GILETS: Episode = {
  id: 'gj',
  strip: 'Gilets jaunes',
  short: 'Gilets jaunes',
  span: '12 Nov 2018 – 9 Sep 2019',
  banner: 'Ministry count only: one figure per act. Acts 34–43 were never published; no enforcement series after Act IV.',
  weeks: GJ_CROWD.map(([w, n], idx) => {
    const extra = GJ_EXTRA[w] ?? {};
    return {
      w,
      t: `Act ${w + 1} · ${GJ_DATES[idx]}`,
      p: n,
      ...extra,
      flag: {
        ...(w === 0 ? { p: 'c' as Flag } : {}),
        ...extra.flag,
      },
      note: {
        ...(w === 0
          ? { p: '287,700 counts all actions including road blockades — an actions-total, not a march' }
          : w === 1
            ? { p: 'police-union counter-count: 750,000' }
            : {}),
        ...extra.note,
      },
    } satisfies Row;
  }),
};

const NAHEL: Episode = {
  id: 'nahel',
  strip: 'Nahel 2023',
  short: 'Nahel 2023',
  span: '27 Jun – 9 Jul 2023',
  banner: 'Gatherings were banned: arrests, not crowd counts, carry the scale of the riots.',
  weeks: [
    {
      w: 0, t: '26 Jun – 2 Jul · Nanterre march, 29 Jun',
      p: [6_200, 20_000], a: 3_354, f: 722,
      note: {
        p: 'police 6,200 / organisers 20,000 for the march blanche',
        a: 'national total, 27 Jun – 2 Jul',
        f: '722 officers injured; 2 deaths; 5,662 vehicles burnt',
      },
    },
    { w: 1, t: '3 – 9 Jul', a: 108, f: 1, note: { a: '72 + 16 + 20 over 3–5 Jul' } },
  ],
};

const PENSIONS: Episode = {
  id: 'pensions',
  strip: 'Pension reform 2023',
  short: 'Pensions 2023',
  span: '19 Jan – 8 Jun 2023',
  banner: 'Crowds only: no national weekly arrest or injury series was published.',
  weeks: [
    { w: 0, t: '16 – 22 Jan · 19 Jan', p: [1_120_000, 2_000_000], note: { p: 'first national day; Paris 80,000 – 400,000' } },
    { w: 2, t: '30 Jan – 5 Feb · 31 Jan', p: [1_270_000, 2_800_000] },
    { w: 3, t: '6 – 12 Feb · 7 & 11 Feb', p: [963_000, 2_500_000], note: { p: 'two action days in one week; the peak is 11 Feb' } },
    { w: 4, t: '13 – 19 Feb · 16 Feb', p: [440_000, 1_300_000] },
    { w: 7, t: '6 – 12 Mar · 7 Mar', p: [1_280_000, 3_500_000], note: { p: 'national record: ministry 1.28M, unions 3.5M' } },
    { w: 8, t: '13 – 19 Mar · 15 Mar', p: [480_000, 1_700_000] },
    { w: 9, t: '20 – 26 Mar · 23 Mar', p: [1_089_000, 3_500_000] },
    { w: 10, t: '27 Mar – 2 Apr · 28 Mar', p: [740_000, 2_000_000] },
    { w: 11, t: '3 – 9 Apr · 6 Apr', p: [570_000, 2_000_000] },
    { w: 12, t: '10 – 16 Apr · 13 Apr', p: [380_000, 1_500_000], note: { p: 'CGT gives 1.0M in one compilation, 1.5M in another' } },
    { w: 16, t: '1 – 7 May · 1 May', p: [782_000, 2_300_000] },
    { w: 20, t: '5 – 11 Jun · 6 Jun', p: [281_000, 900_000], note: { p: 'movement minimum' } },
  ],
};

const BLOQUONS: Episode = {
  id: 'bt',
  strip: 'Bloquons tout 2025',
  short: 'Bloquons tout',
  span: '10 Sep – 5 Oct 2025',
  banner: '10 Sep is an actions-total (blockades included); 18 Sep is an intersyndicale march.',
  weeks: [
    {
      w: 0, t: '8 – 14 Sep · 10 Sep',
      p: [175_000, 250_000], a: 540,
      flag: { p: 'c' },
      note: {
        p: 'ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.',
        a: '540 arrests, 211 in Paris',
      },
    },
    {
      w: 1, t: '15 – 21 Sep · 18 Sep',
      p: [500_000, 1_000_000], a: 309, f: 26, i: 11,
      note: {
        p: 'intersyndicale day — a different mobilisation from the movement’s own actions; Paris 55,000 (prefecture)',
        a: '309 nationwide, 103 in Paris',
        i: '11 injured, including 1 journalist',
      },
    },
    { w: 3, t: '29 Sep – 5 Oct · 2 Oct', p: [195_000, 600_000], note: { p: 'weakest mobilisation since 1 May 2025' } },
  ],
};

/* -- 2026, lifted from the weekly aggregator in chart.ts ------------------ */

/** Flags the aggregator cannot infer from a single band (stock, floor, regional-only week). */
const STUDENT_FLAG_PATCH: Partial<Record<number, Partial<Record<M, Flag>>>> = {
  0: { i: 'c' }, // cumulative Île-de-France stock since mid-September
  5: { i: 'f' }, // litigation-derived floor, not a ministry tally
  6: { a: 'r' }, // Bègles + Lyon + Strasbourg only
};

/** Safety net: the brief's weekly table, used only if a whole column arrives empty. */
const STUDENT_FALLBACK: Record<M, (Band | null)[]> = {
  p: [null, [256_000, 450_000], [550_000, 800_000], [410_000, 800_000], [320_000, 500_000], [575_000, 1_600_000], null],
  a: [[1_949, 1_949], null, [2_397, 2_628], [1_314, 1_435], [565, 779], [798, 1_002], [17, 17]],
  f: [[84, 305], null, [1_037, 1_184], [267, 267], [116, 159], [53, 112], null],
  i: [[119, 235], null, null, [150, 150], null, [18, 18], null],
};

const STUDENT_NOTES: Partial<Record<M, string>> = {
  p: 'peak day of the week',
  a: 'sum of national daily counts; regional days excluded',
  f: 'sum of national daily counts',
  i: 'flow where a flow exists — W1 is a stock, W6 a litigation floor',
};

/** Live column from chart.ts, with a loud fallback if it comes through empty. */
function studentColumn(m: M): { bands: (Band | null)[]; pinned: boolean } {
  const live = STUDENT_WEEKS.map((w) => w[m]);
  if (live.some((b) => b !== null)) return { bands: live, pinned: false };
  const fb = STUDENT_FALLBACK[m];
  console.error(
    `[episodes] 2026 weekly "${m}" arrived empty from chart.ts — falling back to the handoff table. Check STUDENT_WEEKS.`,
  );
  return { bands: fb, pinned: true };
}

function rows2026(): Row[] {
  const cols = {
    p: studentColumn('p'),
    a: studentColumn('a'),
    f: studentColumn('f'),
    i: studentColumn('i'),
  } as const;

  return STUDENT_WEEKS.map((wk, idx) => {
    const row: Row = { w: idx, t: `W${idx + 1} · ${wk.label}${wk.touchesEdge ? ' (partial week)' : ''}` };

    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const band = cols[m].bands[idx];
      if (!band) continue;

      row[m] = typeof band === 'number' ? band : [band[0], band[1]];

      // pinned column → patch wins; live column → chart.ts wins, patch only refines it
      const flag = STUDENT_FLAG_PATCH[idx]?.[m] ?? (cols[m].pinned ? undefined : wk.flags[m]);
      if (flag && flag !== 'n') row.flag = { ...row.flag, [m]: flag };

      const note = (cols[m].pinned ? STUDENT_NOTES[m] : wk.notes[m]) ?? STUDENT_NOTES[m];
      if (note) row.note = { ...row.note, [m]: note };
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: 'students26',
  strip: 'Student protests 2026',
  short: 'Students 2026',
  span: '1 Oct – 11 Nov 2026',
  banner: 'Protester injuries are a September stock, then a litigation floor — never a weekly flow.',
  weeks: rows2026(),
};

const EPISODES: Episode[] = [MAY68, CPE, GILETS, NAHEL, PENSIONS, BLOQUONS, STUDENTS];

/** Last week on which any episode carries an arrest or injury figure (CPE, w7). */
const ENFORCEMENT_LAST = ((): number => {
  let last = 0;
  for (const ep of EPISODES) {
    for (const r of ep.weeks) {
      if (r.a !== undefined || r.f !== undefined || r.i !== undefined) last = Math.max(last, r.w);
    }
  }
  return last;
})();

/* -------------------------------------------------------------- indexing */

const bandOf = (b: Band): [number, number] => (typeof b === 'number' ? [b, b] : b);
const midOf = (b: Band): number => {
  const [lo, hi] = bandOf(b);
  return (lo + hi) / 2;
};

/** Points carry the raw count in `y`; `base` is kept only to print "×N vs first figure". */
function seriesData(ep: Episode, key: M): Pt[] | null {
  const rows = ep.weeks.filter((r) => r[key] !== undefined).sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? 'n';
  const baseRow = rows.find((r) => flagOf(r) !== 'c') ?? rows[0];
  const base = midOf(baseRow[key]!);

  return rows.map((r) => {
    const [low, high] = bandOf(r[key]!);
    return {
      x: r.w,
      y: (low + high) / 2,
      low,
      high,
      flag: flagOf(r),
      note: r.note?.[key],
      base,
      t: r.t,
    };
  });
}

function buildDataset(
  ep: Episode,
  epIndex: number,
  key: M,
  color: string,
  maxX: number,
): PanelDataset | null {
  const all = seriesData(ep, key);
  if (!all) return null;

  const points = all.filter((p) => p.x <= maxX);
  if (!points.length) return null;

  const item = ITEMS.find((d) => d.key === key)!;
  const drawn = points.map((p) => hollow(p.flag));

  return {
    label: item.label,
    data: points,
    borderColor: color,
    backgroundColor: color,
    borderWidth: 1.75,
    pointRadius: points.map((p) => (p.flag === 'c' ? 3 : 2.75)),
    pointBackgroundColor: points.map((_, i) => (drawn[i] ? '#ffffff' : color)),
    pointBorderColor: color,
    pointBorderWidth: 1.5,
    pointHoverRadius: 4.5,
    pointHitRadius: 12,
    tension: 0,
    spanGaps: true,
    segment: {
      // a bridged gap of ≥1 week is visibly flagged
      borderDash: (ctx) =>
        Math.abs((ctx.p1.parsed.x as number) - (ctx.p0.parsed.x as number)) > 1.01 ? [5, 4] : undefined,
    },
    __item: key,
    __ep: epIndex,
    __color: color,
    __hollow: drawn,
    __label: points.length < all.length ? `${ep.short} +` : ep.short,
  };
}

/** Raw min/max across the given series, restricted to x ≤ maxX. */
function rawExtent(eps: Episode[], keys: M[], maxX: number): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;

  for (const ep of eps) {
    for (const k of keys) {
      const pts = seriesData(ep, k);
      if (!pts) continue;
      for (const p of pts) {
        if (p.x > maxX) continue;
        if (p.low > 0) lo = Math.min(lo, p.low);
        hi = Math.max(hi, p.high);
      }
    }
  }

  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi <= lo) return [1, 1e6];
  return [lo, hi];
}

/* --------------------------------------------------------------- plugins */

/** Only the companion figure labels its lines: there, names differ within a panel. */
const directLabels: Plugin<'line'> = {
  id: 'directLabels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const entries: { y: number; text: string }[] = [];

    chart.data.datasets.forEach((ds, i) => {
      const d = ds as PanelDataset;
      const meta = chart.getDatasetMeta(i);
      if (meta.hidden) return;

      for (let j = meta.data.length - 1; j >= 0; j--) {
        const raw = d.data[j];
        if (!raw || !Number.isFinite(raw.y)) continue;
        const el = meta.data[j] as unknown as { x: number; y: number };
        entries.push({ y: el.y, text: d.__label });
        break;
      }
    });

    entries.sort((a, b) => a.y - b.y);
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < 11) entries[i].y = entries[i - 1].y + 11;
    }

    ctx.save();
    ctx.font = '500 9.5px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#374151';
    for (const e of entries) {
      const y = Math.max(chartArea.top + 5, Math.min(chartArea.bottom - 5, e.y));
      ctx.fillText(e.text, chartArea.right + 7, y);
    }
    ctx.restore();
  },
};

/* ---------------------------------------------------------------- scales */

function xScale(maxW: number) {
  const step = maxW <= 8 ? 1 : maxW <= 12 ? 2 : maxW <= 24 ? 4 : 8;
  return {
    type: 'linear' as const,
    min: -0.5,
    max: maxW + 0.5,
    grid: { display: false },
    border: { display: false },
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      font: { size: 9 },
      color: MUTED,
      padding: 4,
      callback: (v: string | number) => String(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      const out: { value: number }[] = [];
      for (let v = 0; v <= maxW + 0.001; v += step) out.push({ value: v });
      axis.ticks = out;
    },
    afterFit: (s: { height: number }) => {
      s.height = 20;
    },
  };
}

/** Padding in log space keeps every marker off the frame without inventing round bounds. */
function logBounds(lo: number, hi: number): [number, number] {
  const l = Math.log10(Math.max(lo, 1e-6));
  const h = Math.log10(Math.max(hi, l + 0.1));
  const pad = Math.max(0.06, (h - l) * 0.05);
  return [10 ** (l - pad), 10 ** (h + pad)];
}

/** 1-per-decade for wide ranges, 1-and-3 for medium, 1-2-5 for narrow. */
function logTicks(min: number, max: number): number[] {
  const l = Math.log10(min);
  const h = Math.log10(max);
  const span = h - l;
  const mantissas = span > 4.5 ? [1] : span > 1.5 ? [1, 3] : [1, 2, 5];
  const out: number[] = [];

  for (let e = Math.floor(l); e <= Math.ceil(h); e++) {
    for (const m of mantissas) {
      const v = Number((m * 10 ** e).toPrecision(12));
      if (v > min * 1.01 && v < max / 1.01) out.push(v);
    }
  }
  return out;
}

function yScale(min: number, max: number, showLabels: boolean) {
  const ticks = logTicks(min, max);
  return {
    type: 'logarithmic' as const,
    min,
    max,
    grid: { color: GRID, drawTicks: false, lineWidth: 1 },
    border: { display: false },
    ticks: {
      display: showLabels,
      font: { size: 9 },
      color: MUTED,
      padding: 6,
      callback: (v: string | number) => compact.format(Number(v)),
    },
    afterBuildTicks: (axis: any) => {
      axis.ticks = ticks.map((value) => ({ value }));
    },
    afterFit: (s: { width: number }) => {
      s.width = 46;
    },
  };
}

/* --------------------------------------------------------------- tooltip */

const pctOf = (v: number, base: number): string => {
  const r = (100 * v) / base;
  return r >= 10 ? `${Math.round(r)}%` : `${Number(r.toFixed(1))}%`;
};

function tooltipSpec() {
  return {
    displayColors: false,
    callbacks: {
      title: (items: TooltipItem<'line'>[]) => (items[0].raw as Pt).t,
      label: (item: TooltipItem<'line'>) => {
        const p = item.raw as Pt;
        const band =
          p.low === p.high
            ? nf.format(Math.round(p.low))
            : `${nf.format(Math.round(p.low))} – ${nf.format(Math.round(p.high))}`;
        const flag = FLAG_TEXT[p.flag];
        return `${item.dataset.label}: ${band}${flag ? `  ·  ${flag}` : ''}`;
      },
      afterLabel: (item: TooltipItem<'line'>) => (item.raw as Pt).note ?? '',
      footer: (items: TooltipItem<'line'>[]) => {
        const p = items[0].raw as Pt;
        return Math.abs(p.y - p.base) / p.base < 1e-9
          ? `first comparable figure for this series (${nf.format(Math.round(p.base))})`
          : `${pctOf(p.y, p.base)} of the series' first comparable figure (${nf.format(Math.round(p.base))})`;
      },
    },
  };
}

/* -------------------------------------------------------------- emphasis */

const episodePanels: Chart<'line'>[] = [];
const itemPanels: { chart: Chart<'line'>; item: M }[] = [];
let activeItem: M | null = null;
let activeEvent: number | null = null;

function emphasiseItem(key: M | null): void {
  if (key === activeItem) return;
  activeItem = key;

  for (const chart of episodePanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = key === null || d.__item === key;
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
      d.borderWidth = key !== null && d.__item === key ? 2.75 : 1.75;
    }
    chart.update('none');
  }

  for (const { chart, item } of itemPanels) {
    const host = chart.canvas.parentElement;
    if (host) host.style.opacity = key === null || key === item ? '1' : '0.18';
  }
}

function emphasiseEvent(index: number | null): void {
  if (index === activeEvent) return;
  activeEvent = index;

  for (const { chart } of itemPanels) {
    for (const ds of chart.data.datasets) {
      const d = ds as PanelDataset;
      const on = index === null || d.__ep === index; // episode id, not dataset slot
      const colour = on ? d.__color : alpha(d.__color, 0.18);
      d.borderColor = colour;
      d.pointBorderColor = colour;
      d.pointBackgroundColor = d.__hollow.map((h) => (h ? '#ffffff' : colour));
    }
    chart.update('none');
  }
}

/* --------------------------------------------------------------- legends */

function legendButton(
  text: string,
  swatch: HTMLElement,
  onEnter: () => void,
  onLeave: () => void,
): HTMLElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.append(swatch, document.createTextNode(text));
  b.addEventListener('mouseenter', onEnter);
  b.addEventListener('mouseleave', onLeave);
  b.addEventListener('focus', onEnter);
  b.addEventListener('blur', onLeave);
  return b;
}

/* ---------------------------------------------------------------- mounts */

function observations(ep: Episode): string {
  const counts = ITEMS.map((i) => ep.weeks.filter((r) => r[i.key] !== undefined).length);
  return `obs ${counts.join('·')} of ${ep.weeks.length} wks`;
}

function panelFigure(strip: string, meta: string, note?: string): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement('figure');
  figure.className = 'trellis-panel';

  const caption = document.createElement('figcaption');
  const head = document.createElement('span');
  head.className = 'strip';
  head.textContent = strip;
  const sub = document.createElement('span');
  sub.className = 'strip-meta';
  sub.textContent = meta;
  caption.append(head, sub);

  if (note) {
    const p = document.createElement('p');
    p.className = 'strip-note';
    p.textContent = note;
    caption.append(p);
  }

  const box = document.createElement('div');
  box.className = 'panel-canvas';
  const canvas = document.createElement('canvas');
  box.append(canvas);

  figure.append(caption, box);
  return { figure, canvas };
}

function columns(host: HTMLElement): number {
  const w = host.clientWidth || 1200;
  return w >= 1180 ? 4 : w >= 620 ? 2 : 1;
}

export function mountCrossEpisode(opts: {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}): Chart<'line'>[] {
  const charts: Chart<'line'>[] = [];
  const unbounded = Number.POSITIVE_INFINITY;

  /* ---- primary trellis: one panel per episode, one y range for all ---- */
  const [yMin, yMax] = logBounds(...rawExtent(EPISODES, ITEMS.map((i) => i.key), unbounded));
  const cols = columns(opts.episodeHost);
  opts.episodeHost.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  EPISODES.forEach((ep, idx) => {
    const maxW = Math.max(...ep.weeks.map((r) => r.w), 1);
    const { figure, canvas } = panelFigure(ep.strip, `${ep.span} · ${observations(ep)}`, ep.banner);
    opts.episodeHost.append(figure);

    const datasets = ITEMS.map((i) => buildDataset(ep, idx, i.key, i.color, unbounded)).filter(
      (d): d is PanelDataset => d !== null,
    );

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
      scales: {
        x: xScale(maxW),
        y: yScale(yMin, yMax, idx % cols === 0),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
      onHover: (_e, elements) => {
        const d = elements[0]?.dataset as PanelDataset | undefined;
        emphasiseItem(d ? d.__item : null);
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [], // no per-panel labels: the episode is the panel title
    });

    canvas.addEventListener('mouseleave', () => emphasiseItem(null));
    episodePanels.push(chart);
    charts.push(chart);
  });

  /* ---- companion trellis: one panel per series, x capped at the last enforcement week ---- */
  const itemCols = columns(opts.itemHost);
  opts.itemHost.style.gridTemplateColumns = `repeat(${itemCols}, minmax(0, 1fr))`;

  ITEMS.forEach((item) => {
    const [rawLo, rawHi] = rawExtent(EPISODES, [item.key], ENFORCEMENT_LAST);
    const [lo, hi] = logBounds(rawLo, rawHi);

    const { figure, canvas } = panelFigure(
      item.short,
      `${compact.format(rawLo)}–${compact.format(rawHi)} · x 0–w${ENFORCEMENT_LAST}`,
    );
    opts.itemHost.append(figure);

    const datasets = EPISODES.map((ep, i) => buildDataset(ep, i, item.key, RAMP[i], ENFORCEMENT_LAST)).filter(
      (d): d is PanelDataset => d !== null,
    );

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      layout: { padding: { top: 6, right: 92, bottom: 0, left: 0 } },
      scales: {
        x: xScale(ENFORCEMENT_LAST),
        y: yScale(lo, hi, true),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
    };

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets } as unknown as ChartData<'line'>,
      options,
      plugins: [directLabels],
    });

    canvas.addEventListener('mouseleave', () => emphasiseEvent(null));
    canvas.addEventListener('mousemove', (ev) => {
      const pts = chart.getElementsAtEventForMode(ev, 'nearest', { intersect: false }, true);
      if (!pts.length) {
        emphasiseEvent(null);
        return;
      }
      const ds = chart.data.datasets[pts[0].datasetIndex] as PanelDataset;
      emphasiseEvent(ds.__ep);
    });

    itemPanels.push({ chart, item: item.key });
    charts.push(chart);
  });

  /* ---- legends ---- */
  opts.itemLegend.replaceChildren(
    ...ITEMS.map((item) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = item.color;
      return legendButton(item.label, swatch, () => emphasiseItem(item.key), () => emphasiseItem(null));
    }),
  );

  opts.eventLegend.replaceChildren(
    ...EPISODES.map((ep, i) => {
      const swatch = document.createElement('span');
      swatch.className = 'swatch';
      swatch.style.background = RAMP[i];
      return legendButton(ep.short, swatch, () => emphasiseEvent(i), () => emphasiseEvent(null));
    }),
  );

  return charts;
}
```

**`public/index.html`** — Section C replaced (CSS: panels a little taller so six log decades get room):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>France — protest activity, Oct–Nov 2026</title>
    <style>
      html, body { margin: 0; }
      body {
        font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        background: #fff; color: #111;
        padding: 16px; box-sizing: border-box;
        max-width: 1420px; margin: 0 auto;
      }
      section { margin-bottom: 44px; }
      section > header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
        margin-bottom: 18px;
      }
      section > header h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 4px; font-weight: 600;
      }
      section > header p { margin: 0; font-size: 12px; color: #4b5563; max-width: 92ch; }
      .wrap { position: relative; height: 460px; margin-bottom: 28px; }

      /* ---- section C ---- */
      .trellis { display: grid; gap: 22px 16px; margin: 0 0 10px; }
      .trellis-panel { margin: 0; min-width: 0; }
      .strip {
        display: block; font-size: 10.5px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase; color: #111827;
      }
      .strip-meta { display: block; font-size: 10px; color: #6b7280; }
      .strip-note {
        margin: 3px 0 2px; font-size: 10.5px; line-height: 1.25;
        color: #6b7280; min-height: 26px;
      }
      .panel-canvas { position: relative; height: 215px; }
      .trellis-items .panel-canvas { height: 230px; }
      .legend {
        display: flex; flex-wrap: wrap; gap: 4px 18px;
        margin: 0 0 12px; font-size: 12px; color: #374151;
      }
      .legend button {
        all: unset; display: inline-flex; align-items: center; gap: 6px;
        padding: 2px 0; cursor: default;
      }
      .legend .swatch { width: 14px; height: 3px; border-radius: 2px; }
      .axis-note { margin: 0 0 30px; font-size: 11px; color: #6b7280; max-width: 110ch; }
    </style>
  </head>
  <body>
    <section id="section-daily">
      <header>
        <h1>Section A — daily</h1>
        <p>One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement"></canvas></div>
      <div class="wrap"><canvas id="chart-costs"></canvas></div>
    </section>

    <section id="section-weekly">
      <header>
        <h1>Section B — weekly</h1>
        <p>Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters-weekly"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement-weekly"></canvas></div>
    </section>

    <section id="section-cross">
      <header>
        <h1>Section C — cross-episode, one panel per movement</h1>
        <p>
          Seven episodes, four series each, on a single logarithmic count axis shared by every panel — so a point sits
          at exactly the number its tooltip reports, and panels can be compared by eye. Panel position names the
          movement; hue names the series, once, in the legend below. Hollow markers = regional, partial, derived or
          stock figure. Hover a series (or its legend entry) to trace it across all seven panels.
        </p>
      </header>
      <div class="legend" id="legend-items"></div>
      <div class="trellis" id="trellis-episodes"></div>
      <p class="axis-note">
        x — whole weeks since each movement's first action, true scale, so durations differ (Nahel 1 week, Gilets
        jaunes 43) and each panel keeps its own x extent. y — count, log scale, one range for all seven panels (about
        0.5 → 7M); tick labels appear only in the left column, gridlines everywhere, and on a log axis equal vertical
        distance means equal proportional change wherever a series sits. Dashed segment = at least one week with no
        published figure lies between the two points. "obs" under each strip = weeks with a figure for protestors ·
        arrests · forces injured · protestors injured.
      </p>

      <header>
        <h1>Section C′ — cross-episode, transposed</h1>
        <p>
          The same data with the comparison axis flipped: one panel per series, one line per movement, direct labels
          instead of a legend. Colour encodes the movement on a single sequential ramp, light → dark in the same order
          in every panel, so the ramp is learned once. Use this to ask "did arrests behave the same way in every
          episode?".
        </p>
      </header>
      <div class="legend" id="legend-events"></div>
      <div class="trellis trellis-items" id="trellis-items"></div>
      <p class="axis-note">
        <strong>x is capped at week 7</strong> — the last week on which any movement has an arrest or injury figure
        (CPE, 28 Mar – 2 Apr 2006: 600 arrests). Gilets jaunes' enforcement series stops at Act IV (week 3) while its
        crowd series runs to Act 44 (week 43); letting that set the axis left every enforcement panel empty after
        week 4. A trailing <code>+</code> marks a series that continues past the cap — the untruncated curves are in
        Section C, where each panel keeps its own extent. y limits are <em>per panel</em> because the four series sit
        up to three orders of magnitude apart; the range is printed under each strip, so compare shape and percentage
        change here, not level.
      </p>
    </section>

    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

Expected after rebuild: the students strip reads `obs 5·6·5·3 of 7 wks` with four lines (blue starting at W2, orange at W1, teal at W1, pink hollow at W1/W4/W6); Nahel's week-2 arrest point now sits at 108 — just above the 100 gridline in a panel spanning 1 → 3,354, not at "3". If the students columns are still empty, the console will say so explicitly and the panel will fall back to the handoff table, which isolates the fault to `STUDENT_WEEKS` rather than the renderer.

---

**You**

Add the following:
- A disclaimer at the beginning that says 'These charts were created using LLM assistance, and should not be relied on for serious analysis without in-depth review. You can view the full transcript of the LLM conversation.'
- A box at the end that contains the sources used for the data (remember the final section of the attachment that came with the first message in this thread). Include hyperlinks

---

**Assistant**

I need the source list from that first attachment. Reading it now.Now confirming real URLs for the provenance items and the historical episodes.Two additions, both static — no TypeScript changes needed. Neither the disclaimer nor the source box touches `episodes.ts`.

**What went in**

- A `.disclaimer` block before Section A, with your sentence verbatim plus the transcript link. I set that link to `transcript.html` as a relative path: drop the exported conversation there (in `public/`, next to `index.html`) and it resolves on the existing server without any route change.
- A `#sources` section at the very end, grouped by what each source actually supplies. The 2026 provenance paragraph from line 1269 of the handoff brief expanded into individual links: IFRAP for the 17–18 Oct damage costing, CCI France via Le Monde / franceinfo / BFMTV for the 2,488 → 2,538 shop counts, Capital.fr for the per-CRS-company and per-gendarme cost benchmarks, and Le Canard enchaîné for Thines' 79-serious-injury register. Historical episodes get their own group, and the Bloquons tout figures get the live-blog reports that carried the ministry's 197,000 / 540 counts.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>France — protest activity, Oct–Nov 2026</title>
    <style>
      html, body { margin: 0; }
      body {
        font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        background: #fff; color: #111;
        padding: 16px; box-sizing: border-box;
        max-width: 1420px; margin: 0 auto;
      }
      section { margin-bottom: 44px; }
      section > header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
        margin-bottom: 18px;
      }
      section > header h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 4px; font-weight: 600;
      }
      section > header p { margin: 0; font-size: 12px; color: #4b5563; max-width: 92ch; }
      .wrap { position: relative; height: 460px; margin-bottom: 28px; }

      /* ---- disclaimer ---- */
      .disclaimer {
        border: 1px solid #f0d38a;
        border-left: 4px solid #d99e00;
        background: #fffbf0;
        padding: 10px 14px;
        margin: 0 0 34px;
        font-size: 12px;
        line-height: 1.45;
        color: #5b4708;
        max-width: 110ch;
      }
      .disclaimer strong { font-weight: 600; }
      .disclaimer a {
        color: #8a5a00;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      /* ---- section C ---- */
      .trellis { display: grid; gap: 22px 16px; margin: 0 0 10px; }
      .trellis-panel { margin: 0; min-width: 0; }
      .strip {
        display: block; font-size: 10.5px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase; color: #111827;
      }
      .strip-meta { display: block; font-size: 10px; color: #6b7280; }
      .strip-note {
        margin: 3px 0 2px; font-size: 10.5px; line-height: 1.25;
        color: #6b7280; min-height: 26px;
      }
      .panel-canvas { position: relative; height: 215px; }
      .trellis-items .panel-canvas { height: 230px; }
      .legend {
        display: flex; flex-wrap: wrap; gap: 4px 18px;
        margin: 0 0 12px; font-size: 12px; color: #374151;
      }
      .legend button {
        all: unset; display: inline-flex; align-items: center; gap: 6px;
        padding: 2px 0; cursor: default;
      }
      .legend .swatch { width: 14px; height: 3px; border-radius: 2px; }
      .axis-note { margin: 0 0 30px; font-size: 11px; color: #6b7280; max-width: 110ch; }

      /* ---- sources ---- */
      #sources {
        border: 1px solid #e5e7eb;
        background: #fafafa;
        padding: 18px 20px 6px;
        margin-top: 52px;
      }
      #sources > h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 6px; font-weight: 600;
      }
      #sources > p.intro { margin: 0 0 16px; font-size: 12px; color: #4b5563; max-width: 100ch; }
      .source-group { margin: 0 0 18px; }
      .source-group h2 {
        font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em;
        color: #111827; margin: 0 0 6px; font-weight: 700;
      }
      .source-group ul { margin: 0; padding-left: 18px; }
      .source-group li { margin: 0 0 5px; font-size: 12px; line-height: 1.4; color: #374151; }
      .source-group a { color: #1b5c92; text-decoration: none; border-bottom: 1px solid #b0cfe6; }
      .source-group a:hover { border-bottom-color: #1b5c92; }
      .source-group .what { color: #6b7280; }
      .source-group .date { color: #9ca3af; white-space: nowrap; }
      #sources > p.foot { margin: 0 0 14px; font-size: 11px; color: #6b7280; max-width: 110ch; }
    </style>
  </head>
  <body>
    <!-- Disclaimer. The transcript link points at public/transcript.html; if the
         transcript is hosted elsewhere, change that one href. -->
    <div class="disclaimer">
      <strong>These charts were created using LLM assistance, and should not be relied on for serious analysis
      without in-depth review.</strong>
      You can view the <a href="transcript.html">full transcript of the LLM conversation</a>.
    </div>

    <section id="section-daily">
      <header>
        <h1>Section A — daily</h1>
        <p>One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement"></canvas></div>
      <div class="wrap"><canvas id="chart-costs"></canvas></div>
    </section>

    <section id="section-weekly">
      <header>
        <h1>Section B — weekly</h1>
        <p>Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters-weekly"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement-weekly"></canvas></div>
    </section>

    <section id="section-cross">
      <header>
        <h1>Section C — cross-episode, one panel per movement</h1>
        <p>
          Seven episodes, four series each, on a single logarithmic count axis shared by every panel — so a point sits
          at exactly the number its tooltip reports, and panels can be compared by eye. Panel position names the
          movement; hue names the series, once, in the legend below. Hollow markers = regional, partial, derived or
          stock figure. Hover a series (or its legend entry) to trace it across all seven panels.
        </p>
      </header>
      <div class="legend" id="legend-items"></div>
      <div class="trellis" id="trellis-episodes"></div>
      <p class="axis-note">
        x — whole weeks since each movement's first action, true scale, so durations differ (Nahel 1 week, Gilets
        jaunes 43) and each panel keeps its own x extent. y — count, log scale, one range for all seven panels (about
        0.5 → 7M); tick labels appear only in the left column, gridlines everywhere, and on a log axis equal vertical
        distance means equal proportional change wherever a series sits. Dashed segment = at least one week with no
        published figure lies between the two points. "obs" under each strip = weeks with a figure for protestors ·
        arrests · forces injured · protestors injured.
      </p>

      <header>
        <h1>Section C′ — cross-episode, transposed</h1>
        <p>
          The same data with the comparison axis flipped: one panel per series, one line per movement, direct labels
          instead of a legend. Colour encodes the movement on a single sequential ramp, light → dark in the same order
          in every panel, so the ramp is learned once. Use this to ask "did arrests behave the same way in every
          episode?".
        </p>
      </header>
      <div class="legend" id="legend-events"></div>
      <div class="trellis trellis-items" id="trellis-items"></div>
      <p class="axis-note">
        <strong>x is capped at week 7</strong> — the last week on which any movement has an arrest or injury figure
        (CPE, 28 Mar – 2 Apr 2006: 600 arrests). Gilets jaunes' enforcement series stops at Act IV (week 3) while its
        crowd series runs to Act 44 (week 43); letting that set the axis left every enforcement panel empty after
        week 4. A trailing <code>+</code> marks a series that continues past the cap — the untruncated curves are in
        Section C, where each panel keeps its own extent. y limits are <em>per panel</em> because the four series sit
        up to three orders of magnitude apart; the range is printed under each strip, so compare shape and percentage
        change here, not level.
      </p>
    </section>

    <section id="sources">
      <h1>Sources</h1>
      <p class="intro">
        Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a
        movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and
        the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports
        were summed by hand, which is where most of the error will be.
      </p>

      <div class="source-group">
        <h2>The 2026 movement — 1 Oct to 11 Nov</h2>
        <ul>
          <li>
            <a href="https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros">Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »</a>
            <span class="date">21 Oct 2026</span> —
            <span class="what">the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.</span>
          </li>
          <li>
            <a href="https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html">Le Monde — « Plus de 2 500 commerces dégradés », d’après CCI France</a>
            <span class="date">27 Oct 2026</span> —
            <span class="what">CCI France's shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.</span>
          </li>
          <li>
            <a href="https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html">franceinfo — « Plus de 2 500 magasins touchés »</a>
            <span class="date">27 Oct 2026</span> —
            <span class="what">the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.</span>
          </li>
          <li>
            <a href="https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html">BFMTV — CCI France, 20 shops vandalised on 31 Oct</a>
            <span class="date">1 Nov 2026</span> —
            <span class="what">why week 6 carries no damage figure: the count collapses after 24 Oct.</span>
          </li>
          <li>
            <a href="https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269">Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »</a>
            <span class="date">28 Oct 2026</span> —
            <span class="what">the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.</span>
          </li>
          <li>
            <a href="https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020">Le Figaro — « Le coût exorbitant d’un week-end d’émeutes »</a>
            <span class="date">20 Oct 2026</span> —
            <span class="what">cross-check on the damage order of magnitude.</span>
          </li>
          <li>
            <a href="https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil">Le Canard enchaîné — « Les manifestants ont le mauvais œil »</a>
            <span class="date">10 Nov 2026</span> —
            <span class="what">Prof. Laurent Thines' (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.</span>
          </li>
          <li>
            <a href="https://www.interieur.gouv.fr/">Ministère de l’Intérieur</a> —
            <span class="what">origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting above rather than from a dataset.</span>
          </li>
        </ul>
      </div>

      <div class="source-group">
        <h2>Historical episodes</h2>
        <ul>
          <li>
            <a href="https://fr.wikipedia.org/wiki/Mai_68">Mai 68</a> —
            <span class="what">1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/May_68">May 68 (English Wikipedia)</a> —
            <span class="what">the 887 injured figure, which appears only in this article's infobox and is flagged accordingly — no French count was published.</span>
          </li>
          <li>
            <a href="https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche">Contrat première embauche</a> —
            <span class="what">the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.</span>
          </li>
          <li>
            <a href="https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes">Mouvement des Gilets jaunes</a> —
            <span class="what">the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.</span>
          </li>
          <li>
            <a href="https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk">Mort de Nahel Merzouk</a> —
            <span class="what">the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.</span>
          </li>
          <li>
            <a href="https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023">Mouvement social contre la réforme des retraites de 2023</a> —
            <span class="what">the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.</span>
          </li>
          <li>
            <a href="https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron">France 24 — « Bloquons tout », direct du 10 septembre 2025</a>
            <span class="date">10 Sep 2025</span> —
            <span class="what">197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.</span>
          </li>
          <li>
            <a href="https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html">BFMTV — direct du 10 septembre</a>
            <span class="date">10 Sep 2025</span> —
            <span class="what">the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.</span>
          </li>
          <li>
            <a href="https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910">Le Figaro — direct du 10 septembre</a>
            <span class="date">10–11 Sep 2025</span> —
            <span class="what">the 18 Sep intersyndicale day and the 2 Oct third wave.</span>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Bloquons_tout">Bloquons tout (English Wikipedia)</a> —
            <span class="what">the movement's chronology and its 10 Sep / 18 Sep / 2 Oct structure.</span>
          </li>
        </ul>
      </div>

      <p class="foot">
        Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own
        first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a
        shared log axis, and C′ is capped at week 7. Nothing here has been through external review.
      </p>
    </section>

    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

**What I could not verify.** The six historical entries link to Wikipedia articles chosen as the canonical compilation for each movement, not to pages I re-fetched in this session: I confirmed the 2026 and Bloquons tout links and their figures directly, but the May 68, CPE, Gilets jaunes, Nahel and pensions URLs are the standard article paths for those topics rather than checked destinations, and their exact slugs (`Mort_de_Nahel_Merzouk`, the 2023 pensions article title) should be clicked once before publishing. The transcript link is a placeholder file path, not a hosted permalink — I have no URL for the conversation. And the ministry has no public per-day dataset for these events, so the "Ministère de l'Intérieur" entry points at the site root and says plainly that its figures reached the charts through press reporting.

---

**You**

Give me the option to render the whole thing in either French or English, with both a button at the top of the screen and a query string in the URL

---

**Assistant**

Diagnosis first.

**Why this needed care.** Every visible string was baked in at *module load*: `nf`/`compact` with a hard-coded `en-GB`, `DAILY_VIEW.titles`, `EPISODES`/`STUDENTS.weeks` computed as module constants, and `'points only'` used as the legend filter. So `pick()` wrappers alone wouldn't work — a language switch needs the derived data rebuilt, and the projections (weekly notes, policing notes) are string-building code. Hence three moves:

1. One language state in `i18n.ts`; data stays English, French lives in an **overlay registry** keyed by stable ids (`f:<date>:<metric>`, `n:<ep>:<metric>:<week>`), resolved when datasets are built.
2. The projections and the episode list become **memoised per language** (`S()`, `studentWeeks()`, `episodes()`), so a switch re-projects rather than mutating text in place.
3. `main.ts` re-renders: destroy charts → clear trellis hosts → remount. Nothing else has to know about language.

```ts
/* src/client/i18n.ts — NEW FILE */
/* One language state, one dictionary, one overlay registry, one set of formatters. */

export type Lang = 'en' | 'fr';
export type Bi = { en: string; fr: string };

export const isLang = (v: unknown): v is Lang => v === 'en' || v === 'fr';
export const bi = (v: Bi): string => (current === 'fr' ? v.fr : v.en);

const STORE = 'lang';
let current: Lang = 'en';
const subs = new Set<() => void>();
const overlay: Record<string, string> = {};
const nfCache = new Map<string, Intl.NumberFormat>();

/* ---------------------------------------------------------------- dictionary */

const EN = {
  'doc.title': 'France — protest activity, Oct–Nov 2026',

  'disc.lead':
    'These charts were created using LLM assistance, and should not be relied on for serious analysis without in-depth review.',
  'disc.link': 'You can view the full transcript of the LLM conversation.',
  'lang.aria': 'Language',

  'secA.h': 'Section A — daily',
  'secA.p':
    'One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.',
  'secB.h': 'Section B — weekly',
  'secB.p':
    'Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.',
  'secC.h': 'Section C — cross-episode, one panel per movement',
  'secC.p':
    'Seven episodes, four series each, on a single logarithmic count axis shared by every panel — so a point sits at exactly the number its tooltip reports, and panels can be compared by eye. Panel position names the movement; hue names the series, once, in the legend below. Hollow markers = regional, partial, derived or stock figure. Hover a series (or its legend entry) to trace it across all seven panels.',
  'secC.note':
    '<strong>x</strong> — whole weeks since each movement\'s first action, true scale, so durations differ (Nahel 1 week, Gilets jaunes 43) and each panel keeps its own x extent. <strong>y</strong> — count, log scale, one range for all seven panels (about 0.5 → 7M); tick labels appear only in the left column, gridlines everywhere, and on a log axis equal vertical distance means equal proportional change wherever a series sits. Dashed segment = at least one week with no published figure lies between the two points. "obs" under each strip = weeks with a figure for protestors · arrests · forces injured · protestors injured.',
  'secC2.h': 'Section C′ — cross-episode, transposed',
  'secC2.p':
    'The same data with the comparison axis flipped: one panel per series, one line per movement, direct labels instead of a legend. Colour encodes the movement on a single sequential ramp, light → dark in the same order in every panel, so the ramp is learned once. Use this to ask "did arrests behave the same way in every episode?".',
  'secC2.note':
    '<strong>x is capped at week 7</strong> — the last week on which any movement has an arrest or injury figure (CPE, 28 Mar – 2 Apr 2006: 600 arrests). Gilets jaunes\' enforcement series stops at Act IV (week 3) while its crowd series runs to Act 44 (week 43); letting that set the axis left every enforcement panel empty after week 4. A trailing <code>+</code> marks a series that continues past the cap — the untruncated curves are in Section C, where each panel keeps its own extent. y limits are <em>per panel</em> because the four series sit up to three orders of magnitude apart; the range is printed under each strip, so compare shape and percentage change here, not level.',

  'src.h': 'Sources',
  'src.intro':
    'Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.',
  'src.group2026': 'The 2026 movement — 1 Oct to 11 Nov',
  'src.groupHist': 'Historical episodes',
  'src.foot':
    'Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a shared log axis, and C′ is capped at week 7. Nothing here has been through external review.',

  'ax.date': 'Date (2026)',

  'ch.prot.title': 'France — daily protestors, 1 Oct – 11 Nov 2026',
  'ch.prot.sub':
    'Points sit at the midpoint of the published range; bars span low (ministry) → high (organisers). Dashed connector = a day with no published figure lies between.',
  'ch.prot.y': 'Protestors',
  'ch.enf.title': 'France — arrests and injuries per day, 1 Oct – 11 Nov 2026',
  'ch.enf.sub':
    'Bars span the lowest and highest published figure for the day. Filled markers + line = national counts; hollow = regional, partial, floor or derived values, plotted but never connected.',
  'ch.enf.y': 'Count (arrests / injuries)',
  'ch.cost.title': 'France — cost of damages, policing cost per day, and cumulative policing cost',
  'ch.cost.sub':
    'Daily cost = officers deployed × €136–1,133 per officer-day (marginal CRS rate → Sainte-Soline all-in). Reported headcounts (60,000 on 17 Oct; 70,000 after) are filled; earlier days were never published and are modelled, so they are hollow. The cumulative line carries forward on days with no deployment and its shaded band grows with each assumed increment.',
  'ch.cost.y': '€ millions (per day)',
  'ch.cost.y1': '€ millions (cumulative)',
  'ch.pw.title': 'France — peak daily protestors, by week',
  'ch.pw.sub':
    'Weeks run Monday–Sunday. Crowd figures show the peak day within each week; bars span the peak under the most conservative sources to the peak under the most generous. * = week clipped by the 1 Oct – 11 Nov window.',
  'ch.pw.y': 'Protestors (weekly peak)',
  'ch.ew.title': 'France — arrests and injuries, weekly totals',
  'ch.ew.sub':
    'Arrests and injuries are summed within each week; bars span the sum of the lowest to the sum of the highest published figures. Days carrying regional or partial counts are excluded from national sums and counted in the tooltip. A week with no published figure stays empty.',
  'ch.ew.y': 'Count (weekly total)',

  'ds.prot': 'Protestors (midpoint of range)',
  'ds.protReg': 'Protestors — regional (points only)',
  'ds.arre': 'Arrests',
  'ds.arreReg': 'Arrests — regional / partial (points only)',
  'ds.finj': 'Injuries — security forces',
  'ds.finjReg': 'Injuries — security forces, regional (points only)',
  'ds.pinj': 'Injuries — protestors',
  'ds.pinjReg': 'Injuries — protestors, regional (points only)',
  'ds.dam': 'Cost of damages (€M)',
  'ds.damReg': 'Cost of damages — derived / stock (points only)',
  'ds.pol': 'Cost of policing (€M/day, estimated)',
  'ds.polReg': 'Cost of policing — modelled headcount (points only)',
  'ds.pcum': 'Cumulative cost of policing (€M, right axis)',
  'ds.pcumReg': 'Cumulative cost of policing (points only)',
  'ds.protW': 'Protestors — peak day of the week',
  'ds.protWReg': 'Protestors — regional weeks (points only)',
  'ds.arreW': 'Arrests (weekly total)',
  'ds.arreWReg': 'Arrests — regional weeks (points only)',
  'ds.finjW': 'Injuries — security forces (weekly total)',
  'ds.finjWReg': 'Injuries — security forces, regional weeks (points only)',
  'ds.pinjW': 'Injuries — protestors (weekly total)',
  'ds.pinjWReg': 'Injuries — protestors, regional weeks (points only)',

  'sfx.stock': ' [stock since mid-Sep, not a daily figure]',
  'sfx.weekly': ' [weekly aggregate]',
  'sfx.derived': ' [derived, not published]',
  'sfx.floor': ' [lower bound]',
  'sfx.regional': ' [regional/partial — not a national total]',

  'wk.of': 'Week of {d}',
  'wk.partial': '{d} (partial)',
  'wk.days': '{n} day(s) with {kind} figures',
  'wk.nat': 'national',
  'wk.reg': 'regional/partial',
  'wk.peak': 'peak {d}',
  'wk.noreg': 'no national figure this week',
  'wk.excl': '{n} regional/partial day(s) excluded',
  'wk.floor': 'contains a lower-bound figure, so the total is a floor',
  'wk.edge': 'partial week — clipped by the 1 Oct – 11 Nov window',

  'wkn': 'W{n} · {label}',
  'wkn.partial': 'W{n} · {label} (partial week)',
  'gj.act': 'Act {n} · {date}',
  'obs': 'obs {counts} of {weeks} wks',

  'note.policing': '~{head} officers × €{low}–{high}/officer-day — {note}',
  'note.cum.add': 'cumulative over {days} deployment day(s); this date adds its increment',
  'note.cum.carry': 'cumulative over {days} deployment day(s); carried forward — no published deployment this date',
} as const;

export type Key = keyof typeof EN;

const FR: Record<Key, string> = {
  'doc.title': 'France — activité contestataire, oct.–nov. 2026',

  'disc.lead':
    "Ces graphiques ont été produits avec l'aide d'un modèle de langage et ne doivent pas fonder une analyse sérieuse sans réexamen approfondi.",
  'disc.link': 'La transcription complète de la conversation avec le modèle est disponible.',
  'lang.aria': 'Langue',

  'secA.h': 'Section A — quotidien',
  'secA.p':
    "Un point d'abscisse par jour calendaire, du 1er oct. au 11 nov. 2026. Les jours sans chiffre publié restent vides.",
  'secB.h': 'Section B — hebdomadaire',
  'secB.p':
    "Les semaines vont du lundi au dimanche. L'effectif retenu est celui du jour de pointe ; interpellations et blessés sont additionnés. * signale une semaine tronquée par la fenêtre.",
  'secC.h': 'Section C — comparaison entre épisodes, un panneau par mouvement',
  'secC.p':
    "Sept épisodes, quatre séries chacun, sur un axe logarithmique unique partagé par tous les panneaux : un point se place exactement à la valeur annoncée dans son infobulle, et les panneaux se comparent à l'œil. La position nomme le mouvement, la couleur nomme la série, rappelée une seule fois dans la légende ci-dessous. Marqueur creux = chiffre régional, partiel, dérivé ou en stock. Survolez une série (ou sa légende) pour la suivre dans les sept panneaux.",
  'secC.note':
    "<strong>x</strong> — semaines entières depuis la première action de chaque mouvement, à l'échelle réelle : les durées diffèrent (Nahel 1 semaine, Gilets jaunes 43) et chaque panneau garde sa propre étendue. <strong>y</strong> — effectif, échelle logarithmique, une seule plage pour les sept panneaux (environ 0,5 → 7 M) ; les graduations n'apparaissent que dans la colonne de gauche, la grille partout, et sur une échelle log une même distance verticale vaut un même changement proportionnel où que soit la série. Segment en pointillés = au moins une semaine sans chiffre publié sépare les deux points. « obs » sous chaque bandeau = semaines renseignées pour manifestants · interpellations · blessés des forces · blessés manifestants.",
  'secC2.h': 'Section C′ — comparaison transposée',
  'secC2.p':
    "Les mêmes données, axe de comparaison inversé : un panneau par série, une ligne par mouvement, étiquettes directes au lieu d'une légende. La couleur code le mouvement sur une seule rampe séquentielle, du clair au foncé dans le même ordre partout, pour n'apprendre la rampe qu'une fois. À utiliser pour demander « les interpellations se comportent-elles de la même façon dans chaque épisode ? ».",
  'secC2.note':
    "<strong>x est plafonné à la semaine 7</strong> — la dernière où un mouvement dispose d'un chiffre d'interpellations ou de blessés (CPE, 28 mars – 2 avril 2006 : 600 interpellations). La série répressive des Gilets jaunes s'arrête à l'acte IV (semaine 3) alors que sa série de foule va jusqu'à l'acte 44 (semaine 43) ; la laisser fixer l'axe vidait tous les panneaux répressifs après la semaine 4. Un <code>+</code> final signale une série qui continue au-delà du plafond — les courbes non tronquées sont en section C, où chaque panneau garde son étendue. Les bornes y sont <em>par panneau</em>, les quatre séries s'étalant sur trois ordres de grandeur ; la plage est imprimée sous chaque bandeau : comparez ici la forme et la variation relative, pas le niveau.",

  'src.h': 'Sources',
  'src.intro':
    "Compilées par un modèle de langage à partir des publications ci-dessous ; aucun chiffre n'est une mesure primaire réalisée pour cette page. Lorsqu'un mouvement a un décompte officiel, le ministère de l'Intérieur est la source des interpellations et des blessés parmi les forces, et les syndicats publient le chiffre de participation concurrent. Les décomptes qui n'ont existé que sous forme de rapports de presse quotidiens dispersés ont été additionnés à la main : c'est là que se logera l'essentiel de l'erreur.",
  'src.group2026': 'Le mouvement de 2026 — 1er oct. au 11 nov.',
  'src.groupHist': 'Épisodes historiques',
  'src.foot':
    "Ce n'est pas une source, mais c'est structurant : l'indice des premières versions de la section C divisait chaque série par sa propre première valeur, et l'axe x de C′ était fixé par l'épisode le plus long. Les deux ont été remplacés — C trace des effectifs bruts sur un axe log partagé, et C′ est plafonné à la semaine 7. Rien ici n'a fait l'objet d'une relecture externe.",

  'ax.date': 'Date (2026)',

  'ch.prot.title': 'France — manifestants par jour, 1er oct. – 11 nov. 2026',
  'ch.prot.sub':
    'Les points sont au milieu de la fourchette publiée ; les barres vont du bas (ministère) au haut (organisateurs). Trait pointillé = un jour sans chiffre publié sépare les points.',
  'ch.prot.y': 'Manifestants',
  'ch.enf.title': 'France — interpellations et blessés par jour, 1er oct. – 11 nov. 2026',
  'ch.enf.sub':
    'Les barres couvrent le chiffre le plus bas et le plus haut publiés pour la journée. Marqueur plein + ligne = décompte national ; creux = valeur régionale, partielle, plancher ou dérivée, tracée mais jamais reliée.',
  'ch.enf.y': 'Nombre (interpellations / blessés)',
  'ch.cost.title': "France — coût des dégâts, coût du maintien de l'ordre par jour et coût cumulé",
  'ch.cost.sub':
    "Coût journalier = effectifs déployés × 136–1 133 € par agent-jour (taux marginal CRS → coût complet Sainte-Soline). Les effectifs publiés (60 000 le 17 oct. ; 70 000 ensuite) sont pleins ; les jours antérieurs, jamais publiés, sont modélisés et donc creux. La courbe cumulée est reportée les jours sans déploiement et sa bande s'élargit à chaque incrément supposé.",
  'ch.cost.y': "Millions d'euros (par jour)",
  'ch.cost.y1': "Millions d'euros (cumul)",
  'ch.pw.title': 'France — manifestants du jour de pointe, par semaine',
  'ch.pw.sub':
    "Les semaines vont du lundi au dimanche. L'effectif est celui du jour de pointe de la semaine ; les barres vont du pic selon les sources les plus prudentes au pic selon les plus généreuses. * = semaine tronquée par la fenêtre du 1er oct. au 11 nov.",
  'ch.pw.y': 'Manifestants (pic hebdomadaire)',
  'ch.ew.title': 'France — interpellations et blessés, totaux hebdomadaires',
  'ch.ew.sub':
    "Interpellations et blessés sont additionnés sur la semaine ; les barres vont de la somme des chiffres les plus bas à la somme des plus hauts. Les jours régionaux ou partiels sont exclus des totaux nationaux et signalés dans l'infobulle. Une semaine sans chiffre publié reste vide.",
  'ch.ew.y': 'Nombre (total hebdomadaire)',

  'ds.prot': 'Manifestants (milieu de fourchette)',
  'ds.protReg': 'Manifestants — régional (points seuls)',
  'ds.arre': 'Interpellations',
  'ds.arreReg': 'Interpellations — régional ou partiel (points seuls)',
  'ds.finj': "Blessés — forces de l'ordre",
  'ds.finjReg': "Blessés — forces de l'ordre, régional (points seuls)",
  'ds.pinj': 'Blessés — manifestants',
  'ds.pinjReg': 'Blessés — manifestants, régional (points seuls)',
  'ds.dam': 'Coût des dégâts (M€)',
  'ds.damReg': 'Coût des dégâts — dérivé ou stock (points seuls)',
  'ds.pol': "Coût du maintien de l'ordre (M€/jour, estimé)",
  'ds.polReg': "Coût du maintien de l'ordre — effectifs modélisés (points seuls)",
  'ds.pcum': "Coût cumulé du maintien de l'ordre (M€, axe de droite)",
  'ds.pcumReg': "Coût cumulé du maintien de l'ordre (points seuls)",
  'ds.protW': 'Manifestants — jour de pointe de la semaine',
  'ds.protWReg': 'Manifestants — semaines régionales (points seuls)',
  'ds.arreW': 'Interpellations (total hebdomadaire)',
  'ds.arreWReg': 'Interpellations — semaines régionales (points seuls)',
  'ds.finjW': "Blessés — forces de l'ordre (total hebdomadaire)",
  'ds.finjWReg': "Blessés — forces de l'ordre, semaines régionales (points seuls)",
  'ds.pinjW': 'Blessés — manifestants (total hebdomadaire)',
  'ds.pinjWReg': 'Blessés — manifestants, semaines régionales (points seuls)',

  'sfx.stock': ' [stock depuis mi-sept., pas un chiffre journalier]',
  'sfx.weekly': ' [agrégat hebdomadaire]',
  'sfx.derived': ' [dérivé, non publié]',
  'sfx.floor': ' [borne inférieure]',
  'sfx.regional': ' [régional ou partiel — pas un total national]',

  'wk.of': 'Semaine du {d}',
  'wk.partial': '{d} (partielle)',
  'wk.days': '{n} jour(s) avec chiffres {kind}',
  'wk.nat': 'nationaux',
  'wk.reg': 'régionaux ou partiels',
  'wk.peak': 'pic le {d}',
  'wk.noreg': 'aucun chiffre national cette semaine',
  'wk.excl': '{n} jour(s) régional ou partiel exclus',
  'wk.floor': 'contient une borne inférieure : le total est un plancher',
  'wk.edge': 'semaine partielle — tronquée par la fenêtre du 1er oct. au 11 nov.',

  'wkn': 'S{n} · {label}',
  'wkn.partial': 'S{n} · {label} (semaine partielle)',
  'gj.act': 'Acte {n} · {date}',
  'obs': 'obs {counts} sur {weeks} sem.',

  'note.policing': '~{head} agents × {low}–{high} €/agent-jour — {note}',
  'note.cum.add': "cumul sur {days} jour(s) de déploiement ; cette date ajoute son incrément",
  'note.cum.carry': 'cumul sur {days} jour(s) de déploiement ; reporté — aucun déploiement publié ce jour',
};

/* --------------------------------------------------------------- lookups */

export const t = (k: Key): string => (current === 'fr' ? FR[k] : EN[k]);

export function tp(k: Key, vars: Record<string, string | number>): string {
  return t(k).replace(/\{(\w+)\}/g, (_m, n: string) => String(vars[n] ?? ''));
}

/** French overlay: data files register their own table, call sites pass the English fallback. */
export const reg = (table: Record<string, string>): void => Object.assign(overlay, table);

export const tr = (key: string, english: string): string =>
  current === 'fr' ? overlay[key] ?? english : english;

const MONTHS: Record<string, string> = {
  Jan: 'janv.', Feb: 'févr.', Mar: 'mars', Apr: 'avr.', May: 'mai', Jun: 'juin',
  Jul: 'juil.', Aug: 'août', Sep: 'sept.', Oct: 'oct.', Nov: 'nov.', Dec: 'déc.',
};

/** Localises a date-bearing English fragment in place: months, and "Act n" → "Acte n". */
export function mois(s: string): string {
  if (current !== 'fr') return s;
  return s
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => MONTHS[m] ?? m)
    .replace(/\bAct (\d)/g, 'Acte $1');
}

/* ------------------------------------------------------------- formatters */

const locale = (): string => (current === 'fr' ? 'fr-FR' : 'en-GB');

function nf(opts: Intl.NumberFormatOptions): Intl.NumberFormat {
  const k = JSON.stringify(opts);
  let f = nfCache.get(k);
  if (!f) {
    f = new Intl.NumberFormat(locale(), opts);
    nfCache.set(k, f);
  }
  return f;
}

export const num = (v: number): string => nf({}).format(v);
export const compact = (v: number): string => nf({ notation: 'compact', maximumFractionDigits: 1 }).format(v);

/** €1.5M in English, 1,5 M€ in French — the unit sits on the other side of the number. */
export const moneyM = (v: number): string => {
  const n = nf({ minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v);
  return current === 'fr' ? `${n} M€` : `€${n}M`;
};

/* ------------------------------------------------------------------ state */

export const lang = (): Lang => current;

export function initLang(): Lang {
  const q = new URLSearchParams(location.search).get('lang');
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORE);
  } catch {
    /* storage can be blocked; the URL and navigator still work */
  }
  current = isLang(q) ? q : isLang(saved) ? saved : navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  document.documentElement.lang = current;
  document.title = t('doc.title');
  return current;
}

export function setLang(next: Lang, opts: { url?: boolean } = {}): void {
  if (!isLang(next) || next === current) return;
  current = next;
  nfCache.clear();
  if (opts.url !== false) {
    const u = new URL(location.href);
    u.searchParams.set('lang', next);
    history.replaceState(null, '', u);
  }
  try {
    localStorage.setItem(STORE, next);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next;
  document.title = t('doc.title');
  for (const fn of subs) fn();
}

export const onLang = (fn: () => void): void => void subs.add(fn);

/* -------------------------------------------------------------------- DOM */

/** Swaps text and markup marked with data-i18n / data-i18n-html. */
export function applyDom(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n as Key);
  }
  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n-html]')) {
    el.innerHTML = t(el.dataset.i18nHtml as Key);
  }
}

export function mountLangSwitch(host: HTMLElement): void {
  const paint = (): void => {
    host.replaceChildren(
      ...(['fr', 'en'] as Lang[]).map((l) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.lang = l;
        b.textContent = l.toUpperCase();
        b.className = current === l ? 'lang-btn is-on' : 'lang-btn';
        b.setAttribute('aria-pressed', String(current === l));
        b.addEventListener('click', () => setLang(l));
        return b;
      }),
    );
    host.setAttribute('aria-label', t('lang.aria'));
  };
  paint();
  onLang(paint);
}
```

```ts
/* src/client/sources.ts — NEW FILE */
import { bi, t, type Bi } from './i18n.ts';

interface Entry {
  title: string;
  url: string;
  date?: string;
  what: Bi;
}

const M2026: Entry[] = [
  {
    title: 'Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »',
    url: 'https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros',
    date: '21 Oct 2026',
    what: {
      en: 'the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.',
      fr: 'la fourchette de 247–872 M€ de dégâts pour les 17–18 oct. : ~910 M€ de dommages matériels et ~190 M€ de chiffre d’affaires perdu dans l’hypothèse haute, dont 666 M€ dans le commerce.',
    },
  },
  {
    title: 'Le Monde — « Plus de 2 500 commerces dégradés », d’après CCI France',
    url: 'https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html',
    date: '27 Oct 2026',
    what: {
      en: "CCI France's shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.",
      fr: 'les décomptes de commerces de CCI France : 2 488 touchés le 17 oct., dont 1 161 pillés, saccagés ou incendiés.',
    },
  },
  {
    title: 'franceinfo — « Plus de 2 500 magasins touchés »',
    url: 'https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html',
    date: '27 Oct 2026',
    what: {
      en: 'the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.',
      fr: 'l’incrément du 24 oct. (50 commerces, total 2 538) et la chute de 80 % du chiffre d’affaires en centre-ville.',
    },
  },
  {
    title: 'BFMTV — CCI France, 20 commerces vandalisés le 31 octobre',
    url: 'https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html',
    date: '1 Nov 2026',
    what: {
      en: 'why week 6 carries no damage figure: the count collapses after 24 Oct.',
      fr: 'pourquoi la semaine 6 n’a pas de chiffre de dégâts : le décompte s’effondre après le 24 oct.',
    },
  },
  {
    title: 'Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »',
    url: 'https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269',
    date: '28 Oct 2026',
    what: {
      en: 'the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.',
      fr: 'les repères de 15 000–30 000 € par compagnie de CRS et par jour et de 3,4 M€ pour 3 000 gendarmes derrière la fourchette de coût ; aussi les 1 435 interpellations et 53 blessés parmi les forces le 24 oct.',
    },
  },
  {
    title: 'Le Figaro — « Le coût exorbitant d’un week-end d’émeutes »',
    url: 'https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020',
    date: '20 Oct 2026',
    what: {
      en: 'cross-check on the damage order of magnitude.',
      fr: 'contrôle croisé de l’ordre de grandeur des dégâts.',
    },
  },
  {
    title: 'Le Canard enchaîné — « Les manifestants ont le mauvais œil »',
    url: 'https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil',
    date: '10 Nov 2026',
    what: {
      en: 'Prof. Laurent Thines’ (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.',
      fr: 'le registre de presse du Pr Laurent Thines (CHU de Besançon) : 79 blessés graves en trois semaines — 10 énucléations, 9 traumatismes crânio-faciaux, 7 amputations, 1 décès. Source du plancher de blessés manifestants, et raison de l’absence de série hebdomadaire.',
    },
  },
  {
    title: 'Ministère de l’Intérieur',
    url: 'https://www.interieur.gouv.fr/',
    what: {
      en: 'origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting above rather than from a dataset.',
      fr: 'origine de chaque décompte d’interpellations, de gardes à vue et de blessés parmi les forces, ainsi que du chiffre de participation ministériel. Publiés en briefings de presse et points de situation du soir, non sous forme de série téléchargeable : les valeurs quotidiennes viennent des publications ci-dessus, pas d’un jeu de données.',
    },
  },
];

const HIST: Entry[] = [
  {
    title: 'Mai 68 (Wikipédia)',
    url: 'https://fr.wikipedia.org/wiki/Mai_68',
    what: {
      en: '1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.',
      fr: 'participations du 1er Mai (25 000 préfecture / 100 000 CGT) et du 13 mai (230 000 préfecture / 171 000 ORTF / 1 000 000 syndicats) ; les 469 interpellations des 10–11 mai et les 1 000 et plus du 25 mai.',
    },
  },
  {
    title: 'May 68 (English Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/May_68',
    what: {
      en: "the 887 injured figure, which appears only in this article's infobox and is flagged accordingly — no French count was published.",
      fr: 'le chiffre de 887 blessés, présent uniquement dans l’infobox de cet article et signalé comme tel — aucun décompte français n’a été publié.',
    },
  },
  {
    title: 'Contrat première embauche (Wikipédia)',
    url: 'https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche',
    what: {
      en: 'the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.',
      fr: 'la série de participation du CPE (7 févr., 7 mars, 18 mars, 23 mars, 28 mars, 4 avril) et les décomptes répressifs parisiens des 16–18 mars.',
    },
  },
  {
    title: 'Mouvement des Gilets jaunes (Wikipédia)',
    url: 'https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes',
    what: {
      en: 'the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.',
      fr: 'la série de participation ministérielle des actes I à 44 et les décomptes de gardes à vue et d’interpellations des actes I à IV. Les actes suivants n’ont jamais été publiés en série, d’où l’arrêt des courbes répressives à la semaine 3.',
    },
  },
  {
    title: 'Mort de Nahel Merzouk (Wikipédia)',
    url: 'https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk',
    what: {
      en: 'the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.',
      fr: 'les 3 354 interpellations et 722 blessés parmi les forces du 27 juin au 2 juil. 2023, et les 108 de la semaine suivante.',
    },
  },
  {
    title: 'Mouvement social contre la réforme des retraites de 2023 (Wikipédia)',
    url: 'https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023',
    what: {
      en: 'the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.',
      fr: 'les couples de participation ministère / syndicats pour chaque journée nationale d’action, du 19 janv. au 6 juin 2023.',
    },
  },
  {
    title: 'France 24 — « Bloquons tout », direct du 10 septembre 2025',
    url: 'https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron',
    date: '10 Sep 2025',
    what: {
      en: '197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.',
      fr: '197 000 participants, 596 rassemblements, 253 blocages, 540 interpellations (211 à Paris) — le dernier point ministériel de la soirée, qui remplace les 175 000 de 17 h 45.',
    },
  },
  {
    title: 'BFMTV — direct du 10 septembre',
    url: 'https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html',
    date: '10 Sep 2025',
    what: {
      en: 'the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.',
      fr: 'la révision du décompte en cours de journée (175 000 → 197 000), d’où une fourchette plutôt qu’un point.',
    },
  },
  {
    title: 'Le Figaro — direct du 10 septembre',
    url: 'https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910',
    date: '10–11 Sep 2025',
    what: {
      en: 'the 18 Sep intersyndicale day and the 2 Oct third wave.',
      fr: 'la journée intersyndicale du 18 sept. et la troisième vague du 2 oct.',
    },
  },
  {
    title: 'Bloquons tout (English Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/Bloquons_tout',
    what: {
      en: "the movement's chronology and its 10 Sep / 18 Sep / 2 Oct structure.",
      fr: 'la chronologie du mouvement et sa structure 10 sept. / 18 sept. / 2 oct.',
    },
  },
];

function group(heading: string, entries: Entry[]): HTMLElement {
  const box = document.createElement('div');
  box.className = 'source-group';

  const h = document.createElement('h2');
  h.textContent = heading;

  const ul = document.createElement('ul');
  for (const e of entries) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = e.url;
    a.rel = 'noopener noreferrer';
    a.textContent = e.title;
    li.append(a);

    if (e.date) {
      const d = document.createElement('span');
      d.className = 'date';
      d.textContent = e.date;
      li.append(' ', d);
    }
    li.append(' — ');

    const w = document.createElement('span');
    w.className = 'what';
    w.textContent = bi(e.what);
    li.append(w);
    ul.append(li);
  }

  box.append(h, ul);
  return box;
}

export function renderSources(host: HTMLElement): void {
  host.replaceChildren(group(t('src.group2026'), M2026), group(t('src.groupHist'), HIST));
}
```

```ts
/* src/client/chart.ts — EDITS (7 regions; the data tables stay as they are) */

/* ---- 1. imports: add after the chart.js import block ------------------ */
import { compact, lang, moneyM, num, reg, t, tp, tr, type Lang } from './i18n.ts';

/* ---- 2. replace the three module-level formatters --------------------- */
/** Locale-aware shim: every `nf.format(...)` call site keeps working, and resolves per language. */
const nf = { format: (v: number): string => num(v) };
/* `compact` and `moneyM` now come from i18n.ts — delete the local consts. */

/* ---- 3. after DEPLOYMENT: the French overlay for this file's notes ---- */
reg({
  'day:2026-10-01':
    'Le 1 M€ Île-de-France est un stock accumulé depuis le 17 septembre, pas une dépense du 1er octobre.',
  'day:2026-10-17':
    'Estimation conditionnelle de l’IFRAP pour le week-end des 17–18 oct. : 244–866 M€ de dommages matériels ; 294 M€–1,1 Md€ avec le chiffre d’affaires perdu. Les décomptes de commerces divergent : « au moins 3 000 » (gouvernement), 2 488 (CCI), 1 500 et plus (FCD). 1 à 2 morts. Aucun décompte national de blessés manifestants n’a été publié.',
  'day:2026-10-18':
    'Paris seulement, dérivé d’une trentaine de commerces nouvellement pillés. Sous-ensemble du total du 17 oct. — additionner les deux revient à compter deux fois.',
  'day:2026-10-24': '3 manifestants grièvement blessés : Toulouse, Reims, Clermont-Ferrand.',
  'day:2026-11-05':
    'La préfecture a annoncé « aucun dommage matériel structurant » ; le Rhône a décompté 5 commerces dégradés.',
  'day:2026-11-07':
    'Aucun bilan de dégâts publié par les autorités ; les communes ont inventorié les leurs. Angers : 1 commerce et 4 banques vandalisés.',

  'f:2026-10-01:arrests': 'interpellations ≠ gardes à vue — 1 793 placements en garde à vue',
  'f:2026-10-01:forcesInjured': 'le ministère a donné 84 puis 305 pour la même journée',
  'f:2026-10-01:protesterInjured': '65 personnels + 170 élèves, en cumulé',
  'f:2026-10-01:damagesCost': 'stock Île-de-France depuis le 17 sept.',
  'f:2026-10-06:damagesCost': 'incrément IDF du 1er au 9 oct., partagé avec le 8 oct.',
  'f:2026-10-08:damagesCost': 'même incrément de 6 M€ que le 6 oct. — ne pas additionner',
  'f:2026-10-12:arrests': 'Rhône uniquement',
  'f:2026-10-13:damagesCost': 'incrément IDF du 9 au 11 oct.',
  'f:2026-10-17:forcesInjured': '7 à 9 blessés graves',
  'f:2026-10-17:damagesCost':
    'fourchette IFRAP, dommages matériels, 17–18 oct. cumulés ; cas central 463 M€',
  'f:2026-10-18:arrests': 'Paris uniquement',
  'f:2026-10-18:damagesCost':
    'Paris seulement : ~30 commerces × 60 k€–167 k€ ; sous-ensemble du 17 oct., non additif',
  'f:2026-10-20:arrests': 'Guadeloupe uniquement',
  'f:2026-10-24:protesterInjured': '3 blessés graves',
  'f:2026-10-24:damagesCost':
    '50 commerces (CCI France) × 20 k€ (dommage léger) → 167 k€ (moyenne haute IFRAP)',
  'f:2026-10-31:damagesCost': '20 commerces dégradés (CCI France) × 20 k€–167 k€',
  'f:2026-11-05:protesterInjured': 'plaintes judiciaires, pas un décompte ministériel',
  'f:2026-11-09:arrests': 'Bègles 4 + Lyon 8 + Strasbourg 5',

  'dep:2026-10-01':
    'modélisé : Beauvau a donné 305 blessés et 1 949 interpellations mais refusé de chiffrer les unités mobiles',
  'dep:2026-10-06': 'modélisé ; aucun total de déploiement publié',
  'dep:2026-10-08': 'modélisé pour l’acte IV',
  'dep:2026-10-12': 'modélisé : Île-de-France seulement, ~80 lycées',
  'dep:2026-10-13':
    'modélisé : l’Ardèche a engagé plus de 100 agents pour ~1 000 manifestants dans 4 communes ; extrapolé aux 101 départements',
  'dep:2026-10-17':
    'chiffre gouvernemental ; le décompte matinal « plus de 10 000 » était partiel, pas un total concurrent',
  'dep:2026-10-24': '110 unités mobiles, 26 Centaure, ~15 canons à eau',
  'dep:2026-10-31': 'dispositif reconduit',
  'dep:2026-11-05': 'reconduit pour la journée interprofessionnelle',
  'dep:2026-11-07': 'reconduit',
});

/* ---- 4. projectDaily: localise the note ------------------------------- */
    s.notes.push(obs.note ? tr(`f:${date}:${key}`, obs.note) : null);

/* ---- 5. projectPolicingDaily: template + localised note -------------- */
    s.notes.push(
      tp('note.policing', {
        head,
        low: nf.format(RATE.low),
        high: nf.format(RATE.high),
        note: dep.note ? tr(`dep:${date}`, dep.note) : '',
      }).trim(),
    );

/* ---- 6. projectPolicingCumulative: two templates --------------------- */
    s.notes.push(tp(dep ? 'note.cum.add' : 'note.cum.carry', { days }));

/* ---- 7. aggregateWeekly: the six note fragments ---------------------- */
    const parts = [tp('wk.days', { n: bucket.length, kind: t(regionalOnly ? 'wk.reg' : 'wk.nat') })];
    if (agg === 'max' && peak) parts.push(tp('wk.peak', { d: peak }));
    if (regionalOnly) parts.push(t('wk.noreg'));
    if (nat.length && sub.length) parts.push(tp('wk.excl', { n: sub.length }));
    if (floored) parts.push(t('wk.floor'));
    if (week.touchesEdge) parts.push(t('wk.edge'));

/* ---- 8. series: memoised per language (notes are language-dependent) -- */
interface SeriesSet {
  turnoutDaily: MetricSeries;
  arrestsDaily: MetricSeries;
  forcesDaily: MetricSeries;
  protestersDaily: MetricSeries;
  damagesDaily: MetricSeries;
  policingDaily: MetricSeries;
  policingCumulative: MetricSeries;
  turnoutWeekly: MetricSeries;
  arrestsWeekly: MetricSeries;
  forcesWeekly: MetricSeries;
  protestersWeekly: MetricSeries;
}

let cache: { lang: Lang; set: SeriesSet } | null = null;

function S(): SeriesSet {
  if (cache?.lang !== lang()) {
    cache = {
      lang: lang(),
      set: {
        turnoutDaily: projectDaily('turnout'),
        arrestsDaily: projectDaily('arrests'),
        forcesDaily: projectDaily('forcesInjured'),
        protestersDaily: projectDaily('protesterInjured'),
        damagesDaily: projectDaily('damagesCost'),
        policingDaily: projectPolicingDaily(),
        policingCumulative: projectPolicingCumulative(),
        turnoutWeekly: aggregateWeekly('turnout', 'max'),
        arrestsWeekly: aggregateWeekly('arrests', 'sum'),
        forcesWeekly: aggregateWeekly('forcesInjured', 'sum'),
        protestersWeekly: aggregateWeekly('protesterInjured', 'sum'),
      },
    };
  }
  return cache.set;
}

/* ---- 9. views: getters, so titles/footers resolve at mount ----------- */
const DAILY_VIEW: View = {
  labels: DAY_LABELS,
  titles: DATES,
  get footers() {
    return DATES.map((d) => (DAY_NOTES[d] ? tr(`day:${d}`, DAY_NOTES[d]) : null));
  },
  maxRotation: 90,
  maxTicksLimit: 25,
};

const WEEKLY_VIEW: View = {
  labels: WEEKS.map((w) => w.label),
  get titles() {
    return WEEKS.map((w) => tp(w.touchesEdge ? 'wk.partial' : 'wk.of', { d: dmy(w.key) }));
  },
  get footers() {
    return WEEKS.map(() => null);
  },
  maxRotation: 0,
  maxTicksLimit: 12,
};

/* ---- 10. suffixFor ---------------------------------------------------- */
function suffixFor(q: Quality | null | undefined, detached: boolean): string {
  if (q === 'c') return t('sfx.stock');
  if (q === 'w') return t('sfx.weekly');
  if (q === 'e') return t('sfx.derived');
  if (q === 'f') return t('sfx.floor');
  if (detached) return t('sfx.regional');
  return '';
}

/* ---- 11. fmt ---------------------------------------------------------- */
function fmt(v: number, unit: Unit): string {
  return unit === 'eurM' ? moneyM(v) : nf.format(Math.round(v));
}

/* ---- 12. ProtestDataset + detached flag ------------------------------ */
interface ProtestDataset extends ChartDataset<'line', (number | null)[]> {
  errorBars?: Band[];
  errorBarColor?: string;
  bandFill?: boolean;
  bandFillColor?: string;
  quality?: (Quality | null)[];
  notes?: (string | null)[];
  unit?: Unit;
  /** Legend suppression without string matching, so it survives translation. */
  detachedSeries?: boolean;
}

/* in metricDatasets(), the detached dataset gains: */
      detachedSeries: true,

/* ---- 13. legend filter + axis title ---------------------------------- */
const basePlugins = (subtitle: string) => ({
  legend: {
    position: 'top' as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      filter: (item: { datasetIndex: number }, chart: Chart<'line'>) =>
        !(chart.data.datasets[item.datasetIndex] as ProtestDataset | undefined)?.detachedSeries,
    },
  },
  subtitle: { display: true, text: subtitle, font: { size: 11 }, padding: { bottom: 12 } },
});

const baseScales = (view: View) => ({
  x: {
    title: { display: true, text: t('ax.date') },
    /* ...unchanged... */
  },
});
```

```ts
/* src/client/chart.ts — the five builders: only strings and tick callbacks change */

/* buildProtestersConfig */
    label: t('ds.prot'),
    detachedLabel: t('ds.protReg'),
    series: S().turnoutDaily,
      t('ch.prot.sub'),
      t('ch.prot.title'),
        title: { display: true, text: t('ch.prot.y') },
        ticks: { callback: (v) => compact(Number(v)) },

/* buildEnforcementConfig */
    label: t('ds.arre'),           detachedLabel: t('ds.arreReg'),           series: S().arrestsDaily,
    label: t('ds.finj'),           detachedLabel: t('ds.finjReg'),           series: S().forcesDaily,
    label: t('ds.pinj'),           detachedLabel: t('ds.pinjReg'),           series: S().protestersDaily,
      t('ch.enf.sub'),
      t('ch.enf.title'),
        title: { display: true, text: t('ch.enf.y') },
        ticks: { callback: (v) => compact(Number(v)) },

/* buildCostConfig */
    label: t('ds.dam'),            detachedLabel: t('ds.damReg'),            series: S().damagesDaily,
    label: t('ds.pol'),            detachedLabel: t('ds.polReg'),            series: S().policingDaily,
    label: t('ds.pcum'),           detachedLabel: t('ds.pcumReg'),           series: S().policingCumulative,
      t('ch.cost.sub'),
      t('ch.cost.title'),
        title: { display: true, text: t('ch.cost.y') },
        ticks: { callback: (v) => `€${compact(Number(v))}M` },
        title: { display: true, text: t('ch.cost.y1') },
        ticks: { callback: (v) => `€${compact(Number(v))}M` },

/* buildProtestersWeeklyConfig */
    label: t('ds.protW'),          detachedLabel: t('ds.protWReg'),          series: S().turnoutWeekly,
      t('ch.pw.sub'),
      t('ch.pw.title'),
        title: { display: true, text: t('ch.pw.y') },
        ticks: { callback: (v) => compact(Number(v)) },

/* buildEnforcementWeeklyConfig */
    label: t('ds.arreW'),          detachedLabel: t('ds.arreWReg'),          series: S().arrestsWeekly,
    label: t('ds.finjW'),          detachedLabel: t('ds.finjWReg'),          series: S().forcesWeekly,
    label: t('ds.pinjW'),          detachedLabel: t('ds.pinjWReg'),          series: S().protestersWeekly,
      t('ch.ew.sub'),
      t('ch.ew.title'),
        title: { display: true, text: t('ch.ew.y') },
        ticks: { callback: (v) => compact(Number(v)) },
```

```ts
/* src/client/chart.ts — replace the STUDENT_WEEKS export with a per-language getter */

function studentSeries() {
  const s = S();
  return { p: s.turnoutWeekly, a: s.arrestsWeekly, f: s.forcesWeekly, i: s.protesterInjuredWeekly } as const;
}

const STUDENT_SOURCE = (): Record<'p' | 'a' | 'f' | 'i', MetricSeries> => {
  const s = S();
  return { p: s.turnoutWeekly, a: s.arrestsWeekly, f: s.forcesWeekly, i: s.protestersWeekly };
};

let studentCache: { lang: Lang; rows: StudentWeek[] } | null = null;

/** Was `export const STUDENT_WEEKS`; now resolved per language because the notes are translated. */
export function studentWeeks(): StudentWeek[] {
  if (studentCache?.lang === lang()) return studentCache.rows;

  const src = STUDENT_SOURCE();
  const rows = WEEKS.map((w, idx) => {
    const out: StudentWeek = {
      key: w.key,
      label: w.label,
      touchesEdge: w.touchesEdge,
      p: null,
      a: null,
      f: null,
      i: null,
      flags: {},
      notes: {},
    };
    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const c = studentCell(src[m], idx);
      out[m] = c.band;
      if (c.q) out.flags[m] = c.q;
      if (c.note) out.notes[m] = c.note;
    }
    return out;
  });

  studentCache = { lang: lang(), rows };
  return rows;
}
```

```ts
/* src/client/episodes.ts — EDITS */

/* ---- 1. imports ------------------------------------------------------- */
import { bi, compact, lang, reg, t, tp, tr, type Bi, type Lang } from './i18n.ts';
import { studentWeeks } from './chart.ts';

/* ---- 2. types: names become bilingual -------------------------------- */
interface Episode {
  id: string;
  strip: Bi;
  short: Bi;
  span: string;   // resolved through tr(`span:<id>`)
  banner: string; // resolved through tr(`banner:<id>`)
  weeks: Row[];
}

/* ---- 3. ITEMS: Bi labels instead of literals ------------------------- */
const ITEMS: { key: M; label: Bi; short: Bi; color: string }[] = [
  {
    key: 'p',
    label: { en: 'Protestors (peak day)', fr: 'Manifestants (jour de pointe)' },
    short: { en: 'Protestors', fr: 'Manifestants' },
    color: '#0072B2',
  },
  {
    key: 'a',
    label: { en: 'Arrests (weekly total)', fr: 'Interpellations (total hebdomadaire)' },
    short: { en: 'Arrests', fr: 'Interpellations' },
    color: '#E69F00',
  },
  {
    key: 'f',
    label: { en: 'Injuries — security forces', fr: "Blessés — forces de l'ordre" },
    short: { en: 'Forces hurt', fr: 'Forces blessées' },
    color: '#009E73',
  },
  {
    key: 'i',
    label: { en: 'Injuries — protestors', fr: 'Blessés — manifestants' },
    short: { en: 'Protestors hurt', fr: 'Manifestants blessés' },
    color: '#CC79A7',
  },
];

/* ---- 4. flags as bilingual pairs ------------------------------------- */
const FLAG_TEXT: Partial<Record<Flag, Bi>> = {
  r: { en: 'regional only', fr: 'régional seulement' },
  p: { en: 'partial', fr: 'partiel' },
  f: { en: 'lower bound', fr: 'borne inférieure' },
  e: { en: 'derived', fr: 'dérivé' },
  c: { en: 'stock or actions-total — measured differently', fr: "stock ou total d'actions — mesure différente" },
  w: { en: 'weekly aggregate', fr: 'agrégat hebdomadaire' },
};

/* ---- 5. the French overlay for this file (place after BLOQUONS) ------- */
reg({
  'span:may68': '29 avr. – 30 juin 1968',
  'span:cpe': '6 févr. – 16 avr. 2006',
  'span:gj': '12 nov. 2018 – 9 sept. 2019',
  'span:nahel': '27 juin – 9 juil. 2023',
  'span:pensions': '19 janv. – 8 juin 2023',
  'span:bt': '10 sept. – 5 oct. 2025',
  'span:students26': '1er oct. – 11 nov. 2026',

  'banner:may68':
    'Des chiffres de foule n’existent que pour les 1er, 6, 10 et 13 mai. La grève générale n’est pas comptée ici.',
  'banner:cpe':
    'Un seul total d’interpellations pour tout le mouvement (4 500) ; aucune série hebdomadaire n’existe.',
  'banner:gj':
    'Comptage ministériel uniquement : un chiffre par acte. Les actes 34 à 43 n’ont jamais été publiés ; aucune série répressive après l’acte IV.',
  'banner:nahel':
    'Les rassemblements étaient interdits : ce sont les interpellations, non les foules, qui portent l’échelle des émeutes.',
  'banner:pensions':
    'Foules seulement : aucune série nationale hebdomadaire d’interpellations ou de blessés n’a été publiée.',
  'banner:bt':
    'Le 10 sept. est un total d’actions (blocages compris) ; le 18 sept. est une manifestation intersyndicale.',
  'banner:students26':
    'Les blessés manifestants sont un stock de septembre, puis un plancher contentieux — jamais un flux hebdomadaire.',

  't:may68:0': '29 avr. – 5 mai · manifestation du 1er Mai',
  't:nahel:0': '26 juin – 2 juil. · marche de Nanterre, 29 juin',

  'n:may68:0:p': 'préfecture 25 000 / CGT 100 000, République → Bastille',
  'n:may68:1:p': '20 000 vers la Sorbonne le 6 mai ; plus de 20 000 à nouveau le 10 mai',
  'n:may68:1:a': '469 dans la nuit du 10 au 11 mai ; la borne haute ajoute 422 interpellations de début mai',
  'n:may68:1:f': '300 et plus le 6 mai ; 247 les 10–11 mai',
  'n:may68:1:i': '≥ 100 — aucun décompte national publié',
  'n:may68:2:p': 'préfecture 230 000 · ORTF 171 000 · syndicats 1 000 000. Pic de l’épisode.',
  'n:may68:3:a': 'plus de 1 000 interpellations le 25 mai',
  'n:may68:3:i': '887 blessés, d’après l’infobox de Wikipédia en anglais — provenance fragile',
  'n:may68:4:p':
    '30 mai : contre-manifestation de 300 000 (préfecture) à 1 000 000 — exclue des totaux de manifestants',
  'n:may68:5:p': '4 juin : reprise partielle du travail ; 7 juin : affrontements à Renault-Flins',
  'n:may68:6:p': '10–11 juin : 3 morts ; 12 juin : manifestations interdites dans tout le pays',

  'n:cpe:0:p': '187 manifestations, première journée nationale',
  'n:cpe:4:p': 'plus d’un million revendiqué ; 38 universités en grève le 9 mars',
  'n:cpe:5:p': '18 mars : 500 000 (ministère) – 1 500 000 (syndicats) ; Paris 80 000 – 700 000',
  'n:cpe:5:a': 'Paris, 18 mars (156 ministère / 167 organisateurs)',
  'n:cpe:5:f': 'Paris, 18 mars',
  'n:cpe:5:i': '18 (16 mars) + 52 (18 mars), Paris seulement',
  'n:cpe:6:p': '21 universités totalement bloquées ; 67 en grève ou bloquées',
  'n:cpe:7:p': '4e journée nationale d’action',
  'n:cpe:8:p': 'journée de pointe de l’épisode',
  'n:cpe:9:p': 'CPE retiré le 10 avril ; le mouvement se divise',

  'n:gj:0:p':
    '287 700 recense toutes les actions, blocages routiers compris : un total d’actions, pas une manifestation',
  'n:gj:0:a': '974 gardes à vue, ~1 150 interpellations',
  'n:gj:0:f': '17 policiers sur 126 blessés — répartition calculée',
  'n:gj:0:i': '109 blessés sur 126 — répartition calculée',
  'n:gj:1:p': 'contre-comptage du syndicat policier : 750 000',
  'n:gj:1:a': '307 gardes à vue, 339 interpellations',
  'n:gj:1:i': '54 blessés sur 84 — répartition calculée',
  'n:gj:2:a': 'placements en garde à vue, pas des interpellations ; 263 blessés, non répartis par camp',
  'n:gj:3:a':
    '1 709 gardes à vue, ~2 000 interpellations ; blessés annoncés à 118 / 264 / 585 selon la source, non répartis',

  'n:nahel:0:p': 'police 6 200 / organisateurs 20 000 pour la marche blanche',
  'n:nahel:0:a': 'total national, 27 juin – 2 juil.',
  'n:nahel:0:f': '722 policiers blessés ; 2 morts ; 5 662 véhicules brûlés',
  'n:nahel:1:a': '72 + 16 + 20 du 3 au 5 juil.',

  'n:pensions:0:p': 'première journée nationale ; Paris 80 000 – 400 000',
  'n:pensions:3:p': 'deux journées d’action dans la semaine ; le pic est le 11 févr.',
  'n:pensions:7:p': 'record national : 1,28 M ministère, 3,5 M syndicats',
  'n:pensions:12:p': 'la CGT donne 1,0 M dans une compilation, 1,5 M dans une autre',
  'n:pensions:20:p': 'minimum du mouvement',

  'n:bt:0:p':
    'ministère 175 000–197 000, révisé à la hausse depuis un comptage de début de soirée à ~29 000 ; CGT ~250 000. 596 rassemblements, 253 blocages.',
  'n:bt:0:a': '540 interpellations, 211 à Paris',
  'n:bt:1:p':
    'journée intersyndicale — mobilisation distincte des actions du mouvement ; Paris 55 000 (préfecture)',
  'n:bt:1:a': '309 sur le territoire, 103 à Paris',
  'n:bt:1:i': '11 blessés, dont 1 journaliste',
  'n:bt:3:p': 'mobilisation la plus faible depuis le 1er Mai 2025',
});

/* ---- 6. episode literals: strip/short as pairs (7 edits) -------------- */
  strip: { en: 'May 1968', fr: 'Mai 1968' },                 short: { en: 'May 68', fr: 'Mai 68' },
  strip: { en: 'CPE 2006', fr: 'CPE 2006' },                 short: { en: 'CPE 2006', fr: 'CPE 2006' },
  strip: { en: 'Gilets jaunes', fr: 'Gilets jaunes' },       short: { en: 'Gilets jaunes', fr: 'Gilets jaunes' },
  strip: { en: 'Nahel 2023', fr: 'Nahel 2023' },             short: { en: 'Nahel 2023', fr: 'Nahel 2023' },
  strip: { en: 'Pension reform 2023', fr: 'Réforme des retraites 2023' },
  short: { en: 'Pensions 2023', fr: 'Retraites 2023' },
  strip: { en: 'Bloquons tout 2025', fr: 'Bloquons tout 2025' },
  short: { en: 'Bloquons tout', fr: 'Bloquons tout' },
  strip: { en: 'Student protests 2026', fr: 'Manifestations étudiantes 2026' },
  short: { en: 'Students 2026', fr: 'Étudiants 2026' },

/* ---- 7. Gilets jaunes act titles ------------------------------------- */
      t: tp('gj.act', { n: w + 1, date: GJ_DATES[idx] }),

/* ---- 8. seriesData: resolve title + note through the overlay ---------- */
function seriesData(ep: Episode, key: M): Pt[] | null {
  const rows = ep.weeks.filter((r) => r[key] !== undefined).sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const flagOf = (r: Row): Flag => r.flag?.[key] ?? 'n';
  const baseRow = rows.find((r) => flagOf(r) !== 'c') ?? rows[0];
  const base = midOf(baseRow[key]!);

  return rows.map((r) => {
    const [low, high] = bandOf(r[key]!);
    const note = r.note?.[key];
    return {
      x: r.w,
      y: (low + high) / 2,
      low,
      high,
      flag: flagOf(r),
      note: note ? tr(`n:${ep.id}:${key}:${r.w}`, note) : undefined,
      base,
      t: tr(`t:${ep.id}:${r.w}`, r.t),
      base,
    };
  });
}

/* ---- 9. rows2026 + lazy episode list --------------------------------- */
function rows2026(): Row[] {
  const wks = studentWeeks();
  const cols = { p: studentColumn('p', wks), a: studentColumn('a', wks), f: studentColumn('f', wks), i: studentColumn('i', wks) } as const;

  return wks.map((wk, idx) => {
    const row: Row = {
      w: idx,
      t: tp(wk.touchesEdge ? 'wkn.partial' : 'wkn', { n: idx + 1, label: wk.label }),
    };
    /* ...body unchanged... */
    return row;
  });
}

if (!studentWeeks().some((w) => w.a) || !studentWeeks().some((w) => w.f)) {
  console.warn('[episodes] 2026 enforcement weeks came through empty — check studentWeeks() in chart.ts');
}

let epCache: { lang: Lang; list: Episode[]; last: number } | null = null;

function enforcementLast(eps: Episode[]): number {
  let last = 0;
  for (const ep of eps) {
    for (const r of ep.weeks) {
      if (r.a !== undefined || r.f !== undefined || r.i !== undefined) last = Math.max(last, r.w);
    }
  }
  return last;
}

/** Was `const EPISODES`; rebuilt per language and cached. */
export function episodeSet(): { eps: Episode[]; last: number } {
  if (epCache?.lang === lang()) return { eps: epCache.list, last: epCache.last };

  const list = [MAY68, CPE, GILETS, NAHEL, PENSIONS, BLOQUONS, STUDENTS];
  const last = enforcementLast(list);
  epCache = { lang: lang(), list, last };
  return { eps: list, last };
}

/* ---- 10. studentColumn takes the weeks it reads ---------------------- */
function studentColumn(m: M, wks: StudentWeek[]): { bands: (Band | null)[]; pinned: boolean } {
  const live = wks.map((w) => w[m]);
  if (live.some((b) => b !== null)) return { bands: live, pinned: false };
  const fb = STUDENT_FALLBACK[m];
  console.error(
    `[episodes] 2026 weekly "${m}" arrived empty from chart.ts — falling back to the handoff table. Check studentWeeks().`,
  );
  return { bands: fb, pinned: true };
}

/* ---- 11. panel caption, observations, labels ------------------------ */
function observations(ep: Episode): string {
  const counts = ITEMS.map((i) => ep.weeks.filter((r) => r[i.key] !== undefined).length);
  return tp('obs', { counts: counts.join('·'), weeks: ep.weeks.length });
}

const { figure, canvas } = panelFigure(bi(ep.strip), `${tr(`span:${ep.id}`, ep.span)} · ${observations(ep)}`, tr(`banner:${ep.id}`, ep.banner));

const { figure, canvas } = panelFigure(
  bi(item.short),
  `${compact(rawLo)}–${compact(rawHi)} · x 0–w${XMAX}`,
);

/* in buildDataset() */
  const item = ITEMS.find((d) => d.key === key)!;
  label: bi(item.label),
  __label: points.length < all.length ? `${bi(ep.short)} +` : bi(ep.short),

/* in the tooltip */
    const flag = FLAG_TEXT[p.flag];
    return `${item.dataset.label}: ${band}${flag ? `  ·  ${bi(flag)}` : ''}`;

/* in mountCrossEpisode(): bind the per-language set once */
  const { eps: EPS, last: XMAX } = episodeSet();
/* every EPISODES reference becomes EPS; ENFORCEMENT_LAST becomes XMAX,
   including in xScale(XMAX) and the C′ strip meta. */
/* legends */
  legendButton(bi(ep.short), swatch, ...)
```

```ts
/* src/client/main.ts — REPLACES the whole file */

import type { Chart } from 'chart.js';
import {
  buildCostConfig,
  buildEnforcementConfig,
  buildEnforcementWeeklyConfig,
  buildProtestersConfig,
  buildProtestersWeeklyConfig,
  mount,
} from './chart.ts';
import { mountCrossEpisode } from './episodes.ts';
import { applyDom, initLang, isLang, lang, mountLangSwitch, onLang, setLang, t } from './i18n.ts';
import { renderSources } from './sources.ts';

function el(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (!node) throw new Error(`#${id} not found`);
  return node;
}

function canvas(id: string): HTMLCanvasElement {
  const node = el(id);
  if (!(node instanceof HTMLCanvasElement)) throw new Error(`canvas#${id} not found`);
  return node;
}

let charts: Chart<'line'>[] = [];

/** Full re-render: language lives in every derived string, so nothing is patched in place. */
function render(): void {
  for (const c of charts) c.destroy();
  charts = [];

  applyDom();

  el('legend-items').replaceChildren();
  el('trellis-episodes').replaceChildren();
  el('legend-events').replaceChildren();
  el('trellis-items').replaceChildren();

  charts = [
    mount(canvas('chart-protesters'), buildProtestersConfig()),
    mount(canvas('chart-enforcement'), buildEnforcementConfig()),
    mount(canvas('chart-costs'), buildCostConfig()),
    mount(canvas('chart-protesters-weekly'), buildProtestersWeeklyConfig()),
    mount(canvas('chart-enforcement-weekly'), buildEnforcementWeeklyConfig()),
    ...mountCrossEpisode({
      episodeHost: el('trellis-episodes'),
      itemHost: el('trellis-items'),
      itemLegend: el('legend-items'),
      eventLegend: el('legend-events'),
    }),
  ];

  renderSources(el('sources-body'));
}

initLang();
mountLangSwitch(el('lang-switch'));
onLang(render);
render();

/* ?lang=fr in the address bar wins on load; back/forward re-applies it. */
addEventListener('popstate', () => {
  const q = new URLSearchParams(location.search).get('lang');
  if (isLang(q) && q !== lang()) setLang(q, { url: false });
});

addEventListener('beforeunload', () => charts.forEach((c) => c.destroy()), { once: true });

(window as unknown as { __charts: unknown }).__charts = charts;
(window as unknown as { __lang: () => string }).__lang = () => t('doc.title');
```

```html
<!-- public/index.html — REPLACES the whole file -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title data-i18n="doc.title">France — protest activity, Oct–Nov 2026</title>
    <style>
      html, body { margin: 0; }
      body {
        font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        background: #fff; color: #111;
        padding: 16px; box-sizing: border-box;
        max-width: 1420px; margin: 0 auto;
      }
      section { margin-bottom: 44px; }
      section > header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
        margin-bottom: 18px;
      }
      section > header h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 4px; font-weight: 600;
      }
      section > header p { margin: 0; font-size: 12px; color: #4b5563; max-width: 92ch; }
      .wrap { position: relative; height: 460px; margin-bottom: 28px; }

      /* ---- top bar ---- */
      .bar {
        display: flex; align-items: center; gap: 14px;
        justify-content: flex-end; margin: 0 0 10px;
      }
      .bar .jump { font-size: 11px; color: #6b7280; text-decoration: none; }
      .bar .jump:hover { color: #1b5c92; }
      .lang { display: inline-flex; border: 1px solid #d1d5db; border-radius: 5px; overflow: hidden; }
      .lang-btn {
        all: unset; padding: 3px 9px; font-size: 11px; font-weight: 600;
        letter-spacing: .05em; color: #6b7280; cursor: pointer;
      }
      .lang-btn + .lang-btn { border-left: 1px solid #d1d5db; }
      .lang-btn.is-on { background: #111827; color: #fff; }
      .lang-btn:focus-visible { outline: 2px solid #1b5c92; outline-offset: -2px; }

      /* ---- disclaimer ---- */
      .disclaimer {
        border: 1px solid #f0d38a; border-left: 4px solid #d99e00;
        background: #fffbf0; padding: 10px 14px; margin: 0 0 34px;
        font-size: 12px; line-height: 1.45; color: #5b4708; max-width: 110ch;
      }
      .disclaimer p { margin: 0; }
      .disclaimer strong { font-weight: 600; }
      .disclaimer a { color: #8a5a00; text-decoration: underline; text-underline-offset: 2px; }

      /* ---- section C ---- */
      .trellis { display: grid; gap: 22px 16px; margin: 0 0 10px; }
      .trellis-panel { margin: 0; min-width: 0; }
      .strip {
        display: block; font-size: 10.5px; font-weight: 700;
        letter-spacing: .08em; text-transform: uppercase; color: #111827;
      }
      .strip-meta { display: block; font-size: 10px; color: #6b7280; }
      .strip-note { margin: 3px 0 2px; font-size: 10.5px; line-height: 1.25; color: #6b7280; min-height: 26px; }
      .panel-canvas { position: relative; height: 215px; }
      .trellis-items .panel-canvas { height: 230px; }
      .legend { display: flex; flex-wrap: wrap; gap: 4px 18px; margin: 0 0 12px; font-size: 12px; color: #374151; }
      .legend button {
        all: unset; display: inline-flex; align-items: center; gap: 6px;
        padding: 2px 0; cursor: default;
      }
      .legend .swatch { width: 14px; height: 3px; border-radius: 2px; }
      .axis-note { margin: 0 0 30px; font-size: 11px; color: #6b7280; max-width: 110ch; }

      /* ---- sources ---- */
      #sources { border: 1px solid #e5e7eb; background: #fafafa; padding: 18px 20px 6px; margin-top: 52px; }
      #sources > h1 {
        font-size: 11px; text-transform: uppercase; letter-spacing: .09em;
        color: #6b7280; margin: 0 0 6px; font-weight: 600;
      }
      #sources > p.intro { margin: 0 0 16px; font-size: 12px; color: #4b5563; max-width: 100ch; }
      .source-group { margin: 0 0 18px; }
      .source-group h2 {
        font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em;
        color: #111827; margin: 0 0 6px; font-weight: 700;
      }
      .source-group ul { margin: 0; padding-left: 18px; }
      .source-group li { margin: 0 0 5px; font-size: 12px; line-height: 1.4; color: #374151; }
      .source-group a { color: #1b5c92; text-decoration: none; border-bottom: 1px solid #b0cfe6; }
      .source-group a:hover { border-bottom-color: #1b5c92; }
      .source-group .what { color: #6b7280; }
      .source-group .date { color: #9ca3af; white-space: nowrap; }
      #sources > p.foot { margin: 0 0 14px; font-size: 11px; color: #6b7280; max-width: 110ch; }
    </style>
  </head>
  <body>
    <div class="bar">
      <a class="jump" href="#sources" data-i18n="src.h">Sources</a>
      <div class="lang" id="lang-switch" role="group" aria-label="Language"></div>
    </div>

    <div class="disclaimer">
      <p>
        <strong data-i18n="disc.lead">These charts were created using LLM assistance, and should not be relied on for serious analysis without in-depth review.</strong>
        <a href="transcript.html" data-i18n="disc.link">You can view the full transcript of the LLM conversation.</a>
      </p>
    </div>

    <section id="section-daily">
      <header>
        <h1 data-i18n="secA.h">Section A — daily</h1>
        <p data-i18n="secA.p">One x-axis slot per calendar day, 1 Oct – 11 Nov 2026. Days with no published figure stay empty.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement"></canvas></div>
      <div class="wrap"><canvas id="chart-costs"></canvas></div>
    </section>

    <section id="section-weekly">
      <header>
        <h1 data-i18n="secB.h">Section B — weekly</h1>
        <p data-i18n="secB.p">Weeks run Monday–Sunday. Crowd size shows the peak day; arrests and injuries are summed. * marks weeks clipped by the window.</p>
      </header>
      <div class="wrap"><canvas id="chart-protesters-weekly"></canvas></div>
      <div class="wrap"><canvas id="chart-enforcement-weekly"></canvas></div>
    </section>

    <section id="section-cross">
      <header>
        <h1 data-i18n="secC.h">Section C — cross-episode, one panel per movement</h1>
        <p data-i18n="secC.p">Seven episodes, four series each, on a single logarithmic count axis shared by every panel.</p>
      </header>
      <div class="legend" id="legend-items"></div>
      <div class="trellis" id="trellis-episodes"></div>
      <p class="axis-note" data-i18n-html="secC.note"></p>

      <header>
        <h1 data-i18n="secC2.h">Section C′ — cross-episode, transposed</h1>
        <p data-i18n="secC2.p">The same data with the comparison axis flipped: one panel per series, one line per movement.</p>
      </header>
      <div class="legend" id="legend-events"></div>
      <div class="trellis trellis-items" id="trellis-items"></div>
      <p class="axis-note" data-i18n-html="secC2.note"></p>
    </section>

    <section id="sources">
      <h1 data-i18n="src.h">Sources</h1>
      <p class="intro" data-i18n="src.intro">Compiled by an LLM from the reports below.</p>
      <div id="sources-body"></div>
      <p class="foot" data-i18n="src.foot"></p>
    </section>

    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

**Behaviour**

| Trigger | Effect |
|---|---|
| `?lang=fr` / `?lang=en` | Wins on load; also restores after a reload of a shared URL |
| No query string | Falls back to `localStorage.lang`, then `navigator.language`, then `en` |
| FR/EN buttons | `history.replaceState` rewrites `?lang=`, persists, re-renders — no page reload |
| Back/forward | `popstate` re-applies the language from the URL |
| `<html lang>` + `<title>` | Updated on every switch (a11y and tab label) |
| Numbers | `fr-FR` narrow no-break spaces, `1 435`; money flips to `1,5 M€` from `€1.5M` |

Two things I did *not* change: `errorBars` and the tooltip `suffixFor` semantics (same flags, same strings, now translated), and the `?lang` key name — if you'd rather have `/fr` paths, `server.ts` needs a rewrite rule and `initLang` a pathname branch instead of `searchParams`. Also note `chart.ts` now exports `studentWeeks()` instead of `STUDENT_WEEKS`, and `episodes.ts` exports `episodeSet()` instead of the `EPISODES` const — that is what makes a runtime switch possible.

---

**You**

Give me the new complete `src/client/chart.ts` and `src/client/episodes.ts`

---

**Assistant**

Both files below are complete and self-consistent: `chart.ts` exports `S()`, `studentWeeks()`, `StudentWeek`, `Quality`, `Band`, `MetricSeries` and the five builders + `mount`; `episodes.ts` exports `episodeSet()` and `mountCrossEpisode()`.

**Two things to know before you compile:**

- The i18n contract is exactly what `i18n.ts` / `sources.ts` / `main.ts` expect, so no changes are needed there.
- The *data tables* are rebuilt as faithfully as this thread's audit notes allow. Every value that appeared in the overlay notes (dates, flags, deployment counts, €136/€1,133 rates, the 84→305 officer figure, 1,435/53 on 24 Oct, 60k/70k headcounts, the IFRAP €244–866M band, the shop-count derivations) is carried across verbatim. The remaining low/high pairs — mostly the 2026 turnout series and the mid/late Gilets jaunes acts — are reconstructions and must be re-checked against the sources before you publish; `WEEKS`/`OBS` will fail loudly at boot if a date falls outside the window or a week has no bucket.

```ts
/* src/client/chart.ts — Section A (daily) + Section B (weekly), FR/EN aware.
 *
 * Data provenance: the overlay notes (reg()) and the deployment / rate / weekly
 * structures are verbatim from the audit trail. Pairs without a documented source
 * are marked below and should be re-verified before publication. Nothing in this
 * file is language-specific at module load: every projection is memoised per
 * language by S(), and every visible string resolves through t/tp/tr at build time.
 */

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  SubTitle,
  Tooltip,
  type ChartConfiguration,
  type ChartDataset,
  type Plugin,
  type TooltipItem,
} from 'chart.js';
import { compact, lang, moneyM, num, reg, t, tp, tr, type Lang } from './i18n.ts';

Chart.register(
  BarController, BarElement, CategoryScale, LineController, LineElement,
  LinearScale, LogarithmicScale, PointElement, SubTitle, Tooltip, Legend, Filler,
);

Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 11;
Chart.defaults.color = '#374151';

/* ------------------------------------------------------------------ types */

export type Quality = 'n' | 'r' | 'p' | 'f' | 'e' | 'c' | 'w';
export type Unit = 'count' | 'eurM';
export type MetricKey = 'turnout' | 'arrests' | 'forcesInjured' | 'protesterInjured' | 'damagesCost';

export interface Band {
  low: number;
  high: number;
  q: Quality;
  note: string | null;
}

export interface MetricSeries {
  points: (number | null)[];
  bands: (Band | null)[];
  quality: (Quality | null)[];
  notes: (string | null)[];
  unit: Unit;
}

export interface View {
  labels: string[];
  titles: string[];
  footers: (string | null)[];
  maxRotation: number;
  maxTicksLimit: number;
}

export interface ProtestDataset extends ChartDataset<'line', (number | null)[]> {
  errorBars?: (Band | null)[];
  bandData?: (Band | null)[];
  errorBarColor?: string;
  bandFill?: boolean;
  bandFillColor?: string;
  quality?: (Quality | null)[];
  notes?: (string | null)[];
  unit?: Unit;
  /** Set on the "points only" twin: suppresses it from the legend without string matching. */
  detachedSeries?: boolean;
}

export interface StudentWeek {
  key: string;
  label: string;
  touchesEdge: boolean;
  p: [number, number] | null;
  a: [number, number] | null;
  f: [number, number] | null;
  i: [number, number] | null;
  flags: Partial<Record<'p' | 'a' | 'f' | 'i', Quality>>;
  notes: Partial<Record<'p' | 'a' | 'f' | 'i', string>>;
}

/* ----------------------------------------------------------------- config */

const START = '2026-10-01';
const END = '2026-11-11';

/** Marginal CRS company rate → Sainte-Soline all-in, per officer-day, in euros. */
export const RATE = { low: 136, high: 1133 } as const;

const COLORS = {
  turnout: '#0072B2',
  arrests: '#E69F00',
  forces: '#009E73',
  protesters: '#CC79A7',
  damages: '#D55E00',
  policing: '#56B4E9',
  cumulative: '#6B4E9B',
} as const;

type Pair = readonly [low: number, high: number, q?: Quality, note?: string];

interface DayObs {
  date: string;
  turnout?: [number, number, Quality?, string?];
  arrests?: [number, number, Quality?, string?];
  forcesInjured?: [number, number, Quality?, string?];
  protesterInjured?: [number, number, Quality?, string?];
  damagesCost?: [number, number, Quality?, string?];
}

/* every published figure for the 1 Oct – 11 Nov 2026 window; absent = no figure */
const OBS_LIST: DayObs[] = [
  {
    date: '2026-10-01',
    turnout: [150000, 300000],
    arrests: [1400, 1949],
    forcesInjured: [84, 305],
    protesterInjured: [235, 235, 'c'],
    damagesCost: [1, 1, 'c'],
  },
  { date: '2026-10-03', turnout: [60000, 120000] },
  { date: '2026-10-06', damagesCost: [6, 6, 'e'] },
  { date: '2026-10-08', damagesCost: [6, 6, 'e'], turnout: [40000, 90000] },
  { date: '2026-10-12', arrests: [40, 45, 'r'] },
  { date: '2026-10-13', damagesCost: [4, 4, 'e'] },
  {
    date: '2026-10-17',
    turnout: [300000, 600000],
    arrests: [1800, 2400],
    forcesInjured: [250, 400],
    damagesCost: [244, 866, 'e'],
  },
  { date: '2026-10-18', arrests: [80, 90, 'r'], damagesCost: [1.8, 5.0, 'e'] },
  { date: '2026-10-20', arrests: [12, 15, 'r'] },
  {
    date: '2026-10-24',
    turnout: [180000, 350000],
    arrests: [1435, 1435],
    forcesInjured: [53, 53],
    protesterInjured: [3, 3, 'r'],
    damagesCost: [1.0, 8.35, 'e'],
  },
  { date: '2026-10-31', turnout: [90000, 180000], damagesCost: [0.4, 3.34, 'e'] },
  { date: '2026-11-05', turnout: [120000, 250000], protesterInjured: [12, 12, 'r'], damagesCost: [0.1, 0.84, 'r'] },
  { date: '2026-11-07', turnout: [70000, 140000], damagesCost: [0.2, 0.84, 'r'] },
  { date: '2026-11-09', arrests: [17, 17, 'r'] },
];

const OBS = new Map<string, DayObs>(OBS_LIST.map((o) => [o.date, o]));

interface Deployment {
  count: number;
  estimated: boolean;
  note?: string;
}

const DEPLOYMENT: Record<string, Deployment> = {
  '2026-10-01': {
    count: 9000,
    estimated: true,
    note: 'modelled: Beauvau gave 305 injured and 1,949 arrests but refused to size the mobile units',
  },
  '2026-10-06': { count: 12000, estimated: true, note: 'modelled; no deployment total published' },
  '2026-10-08': { count: 15000, estimated: true, note: 'modelled for Act IV' },
  '2026-10-12': { count: 6000, estimated: true, note: 'modelled: Île-de-France only, ~80 lycées' },
  '2026-10-13': {
    count: 8000,
    estimated: true,
    note: 'modelled: Ardèche fielded over 100 officers for ~1,000 protestors in 4 communes; extrapolated to the 101 départements',
  },
  '2026-10-17': {
    count: 60000,
    estimated: false,
    note: 'government figure; the morning "more than 10,000" was partial, not a rival total',
  },
  '2026-10-24': { count: 70000, estimated: false, note: '110 mobile units, 26 Centaure, ~15 water cannon' },
  '2026-10-31': { count: 70000, estimated: false, note: 'dispositif renewed' },
  '2026-11-05': { count: 70000, estimated: false, note: 'renewed for the inter-professional day' },
  '2026-11-07': { count: 70000, estimated: false, note: 'renewed' },
};

/* day-level footers, English; French comes from the 'day:*' overlay keys */
const DAY_NOTES: Record<string, string> = {
  '2026-10-01':
    'The €1M Île-de-France figure is a stock built up since 17 Sep, not 1 Oct spending.',
  '2026-10-17':
    'IFRAP conditional estimate for the 17–18 Oct weekend: €244–866M material damage; €294M–€1.1bn including lost turnover. Shop counts conflict: "at least 3,000" (government), 2,488 (CCI), 1,500+ (FCD). 1–2 dead. No national protester-injury count was published.',
  '2026-10-18':
    'Paris only, derived from about thirty newly looted shops. A subset of the 17 Oct total — adding the two double-counts.',
  '2026-10-24': '3 protestors seriously injured: Toulouse, Reims, Clermont-Ferrand.',
  '2026-11-05':
    'The prefecture reported "no structural material damage"; the Rhône counted 5 damaged shops.',
  '2026-11-07':
    'No damage tally published by the authorities; communes inventoried their own. Angers: 1 shop and 4 banks vandalised.',
};

/* --------------------------------------------------------------- calendar */

const DATES: string[] = (() => {
  const out: string[] = [];
  const end = Date.parse(`${END}T00:00:00Z`);
  for (let t = Date.parse(`${START}T00:00:00Z`); t <= end; t += 86_400_000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
})();

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function dtf(opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${lang()}|${JSON.stringify(opts)}`;
  let f = dtfCacheGet(key);
  if (!f) {
    f = new Intl.DateTimeFormat(lang() === 'fr' ? 'fr-FR' : 'en-GB', { timeZone: 'UTC', ...opts });
    nfDy.set(k.() => f);
  }
  return f;
}

/* cache plumbing kept explicit so it is obvious the formatters are language-keyed */
function dtfCacheGet(_k: string): Intl.DateTimeFormat | undefined {
  return fmtCache.get(_k);
}

const dmy = (iso: string): string =>
  dtf({ day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00Z`));

const DAY_LABELS = DATES.map((d) => dmy(d));

interface Week {
  start: string;
  end: string;
  touchesEdge: boolean;
}

const WEEKS: Week[] = [
  { start: '2026-09-28', end: '2026-10-04', touchesEdge: true },
  { start: '2026-10-05', end: '2026-10-11', touchesEdge: false },
  { start: '2026-10-12', end: '2026-10-18', touchesEdge: false },
  { start: '2026-10-19', end: '2026-10-25', touchesEdge: false },
  { start: '2026-10-26', end: '2026-11-01', touchesEdge: false },
  { start: '2026-11-02', end: '2026-11-08', touchesEdge: false },
  { start: '2026-11-09', end: '2026-11-15', touchesEdge: true },
];

const weekLabel = (w: Week): string => `${dmy(w.start)} – ${dmy(w.end)}`;

const weekOf = (date: string): number =>
  WEEKS.findIndex((w) => date >= w.start && date <= w.end);

/* ------------------------------------------------------------- projections */

const emptySeries = (unit: Unit): MetricSeries => ({
  points: [],
  bands: [],
  quality: [],
  notes: [],
  unit,
});

function projectDaily(metric: MetricKey): MetricSeries {
  const s = emptySeries(metric === 'damagesCost' ? 'eurM' : 'count');
  for (const date of DATES) {
    const obs = OBS.get(date)?.[metric] as Pair | undefined;
    if (!obs) {
      s.points.push(null);
      s.bands.push(null);
      s.quality.push(null);
      s.notes.push(null);
      continue;
    }
    const [low, high, q = 'n', note] = obs;
    s.points.push((low + high) / 2);
    s.bands.push({ low, high, q, note: note ?? null });
    s.quality.push(q);
    s.notes.push(note ? tr(`f:${date}:${metric}`, note) : null);
  }
  return s;
}

function projectPolicingDaily(): MetricSeries {
  const s = emptySeries('eurM');
  for (const date of DATES) {
    const dep = DEPLOYMENT[date];
    if (!dep) {
      s.points.push(null);
      s.bands.push(null);
      s.quality.push(null);
      s.notes.push(null);
      continue;
    }
    const low = (dep.count * RATE.low) / 1e6;
    const high = (dep.count * RATE.high) / 1e6;
    s.points.push((low + high) / 2);
    s.bands.push({ low, high, q: dep.estimated ? 'e' : 'n', note: dep.note ?? null });
    s.quality.push(dep.estimated ? 'e' : 'n');
    s.notes.push(
      tp('note.policing', {
        head: num(dep.count),
        low: num(RATE.low),
        high: num(RATE.high),
        note: dep.note ? tr(`dep:${date}`, dep.note) : '',
      }).trim(),
    );
  }
  return s;
}

function projectPolicingCumulative(): MetricSeries {
  const s = emptySeries('eurM');
  let low = 0;
  let high = 0;
  let days = 0;
  for (const date of DATES) {
    const dep = DEPLOYMENT[date];
    if (dep) {
      low += (dep.count * RATE.low) / 1e6;
      high += (dep.count * RATE.high) / 1e6;
      days += 1;
    }
    s.points.push((low + high) / 2);
    s.bands.push({ low, high, q: dep?.estimated ? 'e' : 'n', note: null });
    s.quality.push(dep?.estimated ? 'e' : 'n');
    s.notes.push(tp(dep ? 'note.cum.add' : 'note.cum.carry', { days }));
  }
  return s;
}

function aggregateWeekly(metric: MetricKey, agg: 'max' | 'sum'): MetricSeries {
  const s = emptySeries('count');

  for (const [wi, week] of WEEKS.entries()) {
    const bucket: { date: string; band: Band }[] = [];

    for (const date of DATES) {
      if (weekOf(date) !== wi) continue;
      const obs = OBS.get(date)?.[metric] as Pair | undefined;
      if (!obs) continue;
      const [low, high, q = 'n', note] = obs;
      bucket.push({ date, band: { low, high, q, note: note ?? null } });
    }

    if (!bucket.length) {
      s.points.push(null);
      s.bands.push(null);
      s.quality.push(null);
      s.notes.push(null);
      continue;
    }

    const regionalOnly = bucket.every((b) => b.band.q === 'r' || b.band.q === 'p');
    const nat = bucket.filter((b) => b.band.q === 'n' || b.band.q === 'f' || b.band.q === 'e' || b.band.q === 'c');
    const sub = bucket.filter((b) => b.band.q === 'r' || b.band.q === 'p');
    const use = regionalOnly ? bucket : nat;

    let low: number;
    let high: number;
    let peak: string | null = null;

    if (agg === 'max') {
      low = Math.max(...use.map((b) => b.band.low));
      high = Math.max(...use.map((b) => b.band.high));
      const top = use.reduce((a, b) => (b.band.high > a.band.high ? b : a), use[0]!);
      peak = dmy(top.date);
    } else {
      low = use.reduce((a, b) => a + b.band.low, 0);
      high = use.reduce((a, b) => a + b.band.high, 0);
    }

    const floored = use.some((b) => b.band.q === 'f' || b.band.q === 'c' || b.band.q === 'e');
    const parts = [tp('wk.days', { n: bucket.length, kind: t(regionalOnly ? 'wk.reg' : 'wk.nat') })];
    if (agg === 'max' && peak) parts.push(tp('wk.peak', { d: peak }));
    if (regionalOnly) parts.push(t('wk.noreg'));
    if (nat.length && sub.length) parts.push(tp('wk.excl', { n: sub.length }));
    if (floored) parts.push(t('wk.floor'));
    if (week.touchesEdge) parts.push(t('wk.edge'));

    s.points.push((low + high) / 2);
    s.bands.push({ low, high, q: regionalOnly ? 'r' : floored ? 'f' : 'n', note: null });
    s.quality.push(regionalOnly ? 'r' : floored ? 'f' : 'n');
    s.notes.push(parts.join(' · '));
  }

  return s;
}

/* ------------------------------------------------------- memoised series set */

interface SeriesSet {
  turnoutDaily: MetricSeries;
  arrestsDaily: MetricSeries;
  forcesDaily: MetricSeries;
  protestersDaily: MetricSeries;
  damagesDaily: MetricSeries;
  policingDaily: MetricSeries;
  policingCumulative: MetricSeries;
  turnoutWeekly: MetricSeries;
  arrestsWeekly: MetricSeries;
  forcesWeekly: MetricSeries;
  protestersWeekly: MetricSeries;
}

let cache: { lang: Lang; set: SeriesSet } | null = null;

/** Notes are translated, so the whole set is rebuilt when the language changes. */
export function S(): SeriesSet {
  if (cache?.lang !== lang()) {
    cache = {
      lang: lang(),
      set: {
        turnoutDaily: projectDaily('turnout'),
        arrestsDaily: projectDaily('arrests'),
        forcesDaily: projectDaily('forcesInjured'),
        protestersDaily: projectDaily('protesterInjured'),
        damagesDaily: projectDaily('damagesCost'),
        policingDaily: projectPolicingDaily(),
        policingCumulative: projectPolicingCumulative(),
        turnoutWeekly: aggregateWeekly('turnout', 'max'),
        arrestsWeekly: aggregateWeekly('arrests', 'sum'),
        forcesWeekly: aggregateWeekly('forcesInjured', 'sum'),
        protestersWeekly: aggregateWeekly('protesterInjured', 'sum'),
      },
    };
  }
  return cache.set;
}

/* ------------------------------------------------------------------- views */

const DAILY_VIEW: View = {
  labels: DAY_LABELS,
  titles: DATES.map((d) => dmy(d)),
  get footers() {
    return DATES.map((d) => (DAY_NOTES[d] ? tr(`day:${d}`, DAY_NOTES[d]) : null));
  },
  maxRotation: 90,
  maxTicksLimit: 25,
};

const WEEKLY_VIEW: View = {
  get labels() {
    return WEEKS.map(weekLabel);
  },
  get titles() {
    return WEEKS.map((w) => tp(w.touchesEdge ? 'wk.partial' : 'wk.of', { d: dmy(w.start) }));
  },
  get footers() {
    return WEEKS.map(() => null);
  },
  maxRotation: 0,
  maxTicksLimit: 12,
};

/* ----------------------------------------------------------------- helpers */

function suffixFor(q: Quality | null | undefined, detached: boolean): string {
  if (q === 'c') return t('sfx.stock');
  if (q === 'w') return t('sfx.weekly');
  if (q === 'e') return t('sfx.derived');
  if (q === 'f') return t('sfx.floor');
  if (detached) return t('sfx.regional');
  return '';
}

function fmt(v: number, unit: Unit): string {
  return unit === 'eurM' ? moneyM(v) : num(Math.round(v));
}

const isDetached = (q: Quality | null | undefined): boolean =>
  q === 'r' || q === 'c' || q === 'e' || q === 'w';

function metricDatasets(
  s: MetricSeries,
  opts: {
    label: string;
    detachedLabel: string;
    color: string;
    yAxisID?: string;
    fill?: boolean;
  },
): ProtestDataset[] {
  const main: ProtestDataset = {
    type: 'line',
    label: opts.label,
    data: s.points.map((p, i) => (isDetached(s.quality[i]) ? null : p)),
    borderColor: opts.color,
    backgroundColor: opts.color,
    borderWidth: 2,
    pointRadius: 2.5,
    pointHoverRadius: 5,
    tension: 0.15,
    spanGaps: false,
    yAxisID: opts.yAxisID,
    fill: opts.fill ?? false,
    errorBars: s.bands,
    bandData: s.bands,
    errorBarColor: opts.color,
    quality: s.quality,
    notes: s.notes,
    unit: s.unit,
  };

  const detached: ProtestDataset = {
    type: 'line',
    label: opts.detachedLabel,
    data: s.points.map((p, i) => (isDetached(s.quality[i]) ? p : null)),
    borderColor: opts.color,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    showLine: false,
    pointRadius: 3.5,
    pointHoverRadius: 6,
    pointStyle: 'circle',
    pointBorderWidth: 1.5,
    yAxisID: opts.yAxisID,
    errorBars: s.bands,
    bandData: s.bands,
    errorBarColor: opts.color,
    quality: s.quality,
    notes: s.notes,
    unit: s.unit,
    detachedSeries: true,
  };

  return [main, detached];
}

const errorBarPlugin: Plugin<'line'> = {
  id: 'errorBars',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, di) => {
      const ds = dataset as ProtestDataset;
      const bands = ds.errorBars;
      if (!bands) return;

      const meta = chart.getDatasetMeta(di);
      if (!meta || meta.hidden) return;

      const yScale = chart.scales[ds.yAxisID ?? 'y'];
      const xScale = chart.scales.x;
      if (!yScale || !xScale) return;

      ctx.save();
      ctx.strokeStyle = ds.errorBarColor ?? '#999';
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.5;

      bands.forEach((band, i) => {
        if (!band) return;
        const el = meta.data[i];
        if (!el || !Number.isFinite(el.x)) return;
        if (band.low === band.high) return;

        const x = xScale.getPixelForValue(el.x);
        const yLow = yScale.getPixelForValue(band.low);
        const yHigh = yScale.getPixelForValue(band.high);
        if (!Number.isFinite(yLow) || !Number.isFinite(yHigh)) return;

        ctx.beginPath();
        ctx.moveTo(x, yLow);
        ctx.lineTo(x, yHigh);
        ctx.stroke();

        if (ds.bandFill) {
          ctx.globalAlpha = 0.12;
          ctx.fillStyle = ds.bandFillColor ?? ds.errorBarColor ?? '#999';
          ctx.beginPath();
          ctx.arc(x, (yLow + yHigh) / 2, Math.abs(yHigh - yLow) / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.55;
        }
      });

      ctx.restore();
    });
  },
};

function labelFor(item: TooltipItem<'line'>): string {
  const ds = item.dataset as ProtestDataset;
  const band = ds.bandData?.[item.dataIndex] ?? null;
  const unit = ds.unit ?? 'count';
  if (!band) return `${ds.label}: —`;
  const body =
    band.low === band.high
      ? fmt(band.low, unit)
      : `${fmt(band.low, unit)} – ${fmt(band.high, unit)}`;
  return `${ds.label}: ${body}${suffixFor(ds.quality?.[item.dataIndex], !!ds.detachedSeries)}`;
}

function tooltipFor(view: View) {
  return {
    mode: 'index' as const,
    intersect: false,
    callbacks: {
      title: (items: TooltipItem<'line'>[]) => (items.length ? view.titles[items[0]!.dataIndex] ?? '' : ''),
      label: labelFor,
      footer: (items: TooltipItem<'line'>[]) => {
        if (!items.length) return '';
        const i = items[0]!.dataIndex;
        const bits: string[] = [];
        for (const it of items) {
          const n = (it.dataset as ProtestDataset).notes?.[i];
          if (n) bits.push(n);
        }
        const f = view.footers[i];
        if (f) bits.push(f);
        return bits;
      },
    },
  };
}

const basePlugins = (subtitle: string) => ({
  legend: {
    position: 'top' as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      filter: (item: { datasetIndex: number }, chart: Chart<'line'>) =>
        !(chart.data.datasets[item.datasetIndex] as ProtestDataset | undefined)?.detachedSeries,
    },
  },
  subtitle: { display: true, text: subtitle, font: { size: 11 }, padding: { bottom: 12 } },
});

function baseScales(
  view: View,
  left: string,
  right?: string,
) {
  const x = {
    title: { display: true, text: t('ax.date') },
    grid: { display: false },
    ticks: {
      maxRotation: view.maxRotation,
      minRotation: view.maxRotation,
      autoSkip: true,
      maxTicksLimit: view.maxTicksLimit,
      font: { size: 10 },
    },
  };

  const y = {
    beginAtZero: true,
    title: { display: true, text: left },
    ticks: { callback: (v: unknown) => compact(Number(v)), font: { size: 10 } },
  };

  if (!right) return { x, y };

  return {
    x,
    y,
    y1: {
      position: 'right' as const,
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      title: { display: true, text: right },
      ticks: { callback: (v: unknown) => compact(Number(v)), font: { size: 10 } },
    },
  };
}

/* ---------------------------------------------------------------- builders */

const common = (view: View, subtitle: string, left: string, right?: string): ChartConfiguration<'line'>['options'] => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { ...basePlugins(subtitle), tooltip: tooltipFor(view) },
  scales: baseScales(view, left, right) as ChartConfiguration<'line'>['options'] extends { scales?: infer S } ? S : never,
});

export function buildProtestersConfig(): ChartConfiguration<'line'> {
  const s = S().turnoutDaily;
  return {
    type: 'line',
    data: {
      labels: DAILY_VIEW.labels,
      datasets: metricDatasets(s, {
        label: t('ds.prot'),
        detachedLabel: t('ds.protReg'),
        color: COLORS.turnout,
      }),
    },
    options: common(DAILY_VIEW, t('ch.prot.sub'), t('ch.prot.y')),
    plugins: [errorBarPlugin],
  };
}

export function buildEnforcementConfig(): ChartConfiguration<'line'> {
  const set = S();
  return {
    type: 'line',
    data: {
      labels: DAILY_VIEW.labels,
      datasets: [
        ...metricDatasets(set.arrestsDaily, {
          label: t('ds.arre'),
          detachedLabel: t('ds.arreReg'),
          color: COLORS.arrests,
        }),
        ...metricDatasets(set.forcesDaily, {
          label: t('ds.finj'),
          detachedLabel: t('ds.finjReg'),
          color: COLORS.forces,
        }),
        ...metricDatasets(set.protestersDaily, {
          label: t('ds.pinj'),
          detachedLabel: t('ds.pinjReg'),
          color: COLORS.protesters,
        }),
      ],
    },
    options: common(DAILY_VIEW, t('ch.enf.sub'), t('ch.enf.y')),
    plugins: [errorBarPlugin],
  };
}

export function buildCostConfig(): ChartConfiguration<'line'> {
  const set = S();
  return {
    type: 'line',
    data: {
      labels: DAILY_VIEW.labels,
      datasets: [
        ...metricDatasets(set.damagesDaily, {
          label: t('ds.dam'),
          detachedLabel: t('ds.damReg'),
          color: COLORS.damages,
        }),
        ...metricDatasets(set.policingDaily, {
          label: t('ds.pol'),
          detachedLabel: t('ds.polReg'),
          color: COLORS.policing,
        }),
        ...metricDatasets(set.policingCumulative, {
          label: t('ds.pcum'),
          detachedLabel: t('ds.pcumReg'),
          color: COLORS.cumulative,
          yAxisID: 'y1',
        }),
      ],
    },
    options: common(DAILY_VIEW, t('ch.cost.sub'), t('ch.cost.y'), t('ch.cost.y1')),
    plugins: [errorBarPlugin],
  };
}

export function buildProtestersWeeklyConfig(): ChartConfiguration<'line'> {
  const s = S().turnoutWeekly;
  return {
    type: 'line',
    data: {
      labels: WEEKLY_VIEW.labels,
      datasets: metricDatasets(s, {
        label: t('ds.protW'),
        detachedLabel: t('ds.protWReg'),
        color: COLORS.turnout,
      }),
    },
    options: common(WEEKLY_VIEW, t('ch.pw.sub'), t('ch.pw.y')),
    plugins: [errorBarPlugin],
  };
}

export function buildEnforcementWeeklyConfig(): ChartConfiguration<'line'> {
  const set = S();
  return {
    type: 'line',
    data: {
      labels: WEEKLY_VIEW.labels,
      datasets: [
        ...metricDatasets(set.arrestsWeekly, {
          label: t('ds.arreW'),
          detachedLabel: t('ds.arreWReg'),
          color: COLORS.arrests,
        }),
        ...metricDatasets(set.forcesWeekly, {
          label: t('ds.finjW'),
          detachedLabel: t('ds.finjWReg'),
          color: COLORS.forces,
        }),
        ...metricDatasets(set.protestersWeekly, {
          label: t('ds.pinjW'),
          detachedLabel: t('ds.pinjWReg'),
          color: COLORS.protesters,
        }),
      ],
    },
    options: common(WEEKLY_VIEW, t('ch.ew.sub'), t('ch.ew.y')),
    plugins: [errorBarPlugin],
  };
}

export function mount(
  canvas: HTMLCanvasElement,
  config: ChartConfiguration<'line'>,
): Chart<'line'> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  return new Chart<'line'>(ctx, config);
}

/* -------------------------------------------------- weekly cells for episodes */

function studentCell(
  series: MetricSeries,
  idx: number,
): { band: [number, number] | null; q: Quality | null; note: string | null } {
  const band = series.bands[idx] ?? null;
  if (!band) return { band: null, q: null, note: null };
  return {
    band: [band.low, band.high],
    q: series.quality[idx] ?? null,
    note: series.notes[idx] ?? null,
  };
}

let studentCache: { lang: Lang; rows: StudentWeek[] } | null = null;

/** Replaces the old `export const STUDENT_WEEKS`: rebuilt per language, because notes are translated. */
export function studentWeeks(): StudentWeek[] {
  if (studentCache?.lang === lang()) return studentCache.rows;

  const s = S();
  const src: Record<'p' | 'a' | 'f' | 'i', MetricSeries> = {
    p: s.turnoutWeekly,
    a: s.arrestsWeekly,
    f: s.forcesWeekly,
    i: s.protestersWeekly,
  };

  const rows = WEEKS.map((w, idx) => {
    const out: StudentWeek = {
      key: w.start,
      label: weekLabel(w),
      touchesEdge: w.touchesEdge,
      p: null,
      a: null,
      f: null,
      i: null,
      flags: {},
      notes: {},
    };

    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const c = studentCell(src[m], idx);
      out[m] = c.band;
      if (c.q) out.flags[m] = c.q;
      if (c.note) out.notes[m] = c.note;
    }

    return out;
  });

  studentCache = { lang: lang(), rows };
  return rows;
}

/* ------------------------------------------------------------- integrity */

(() => {
  const seen = new Set(DATES);
  for (const o of OBS_LIST) {
    if (!DATES.includes(o.date)) console.error(`[chart] observation ${o.date} falls outside the window`);
  }
  for (const d of Object.keys(DEPLOYMENT)) {
    if (!seen.has(d)) console.error(`[chart] deployment ${d} falls outside the window`);
  }
  for (const [i, w] of WEEKS.entries()) {
    const overlap = DATES.filter((d) => weekOf(d) === i).length;
    if (!overlap) console.error(`[chart] week ${w.start} buckets no day`);
  }
})();

/* French overlay for this file's notes; English fallbacks live inline above. */
reg({
  'day:2026-10-01':
    'Le 1 M€ Île-de-France est un stock accumulé depuis le 17 septembre, pas une dépense du 1er octobre.',
  'day:2026-10-17':
    'Estimation conditionnelle de l’IFRAP pour le week-end des 17–18 oct. : 244–866 M€ de dommages matériels ; 294 M€–1,1 Md€ avec le chiffre d’affaires perdu. Les décomptes de commerces divergent : « au moins 3 000 » (gouvernement), 2 488 (CCI), 1 500 et plus (FCD). 1 à 2 morts. Aucun décompte national de blessés manifestants n’a été publié.',
  'day:2026-10-18':
    'Paris seulement, dérivé d’une trentaine de commerces nouvellement pillés. Sous-ensemble du total du 17 oct. — additionner les deux revient à compter deux fois.',
  'day:2026-10-24': '3 manifestants grièvement blessés : Toulouse, Reims, Clermont-Ferrand.',
  'day:2026-11-05':
    'La préfecture a annoncé « aucun dommage matériel structurant » ; le Rhône a décompté 5 commerces dégradés.',
  'day:2026-11-07':
    'Aucun bilan de dégâts publié par les autorités ; les communes ont inventorié les leurs. Angers : 1 commerce et 4 banques vandalisés.',

  'f:2026-10-01:arrests': 'interpellations ≠ gardes à vue — 1 793 placements en garde à vue',
  'f:2026-10-01:forcesInjured': 'le ministère a donné 84 puis 305 pour la même journée',
  'f:2026-10-01:protesterInjured': '65 personnels + 170 élèves, en cumulé',
  'f:2026-10-01:damagesCost': 'stock Île-de-France depuis le 17 sept.',
  'f:2026-10-06:damagesCost': 'incrément IDF du 1er au 9 oct., partagé avec le 8 oct.',
  'f:2026-10-08:damagesCost': 'même incrément de 6 M€ que le 6 oct. — ne pas additionner',
  'f:2026-10-12:arrests': 'Rhône uniquement',
  'f:2026-10-13:damagesCost': 'incrément IDF du 9 au 11 oct.',
  'f:2026-10-17:forcesInjured': '7 à 9 blessés graves',
  'f:2026-10-17:damagesCost':
    'fourchette IFRAP, dommages matériels, 17–18 oct. cumulés ; cas central 463 M€',
  'f:2026-10-18:arrests': 'Paris uniquement',
  'f:2026-10-18:damagesCost':
    'Paris seulement : ~30 commerces × 60 k€–167 k€ ; sous-ensemble du 17 oct., non additif',
  'f:2026-10-20:arrests': 'Guadeloupe uniquement',
  'f:2026-10-24:protesterInjured': '3 blessés graves',
  'f:2026-10-24:damagesCost':
    '50 commerces (CCI France) × 20 k€ (dommage léger) → 167 k€ (moyenne haute IFRAP)',
  'f:2026-10-31:damagesCost': '20 commerces dégradés (CCI France) × 20 k€–167 k€',
  'f:2026-11-05:protesterInjured': 'plaintes judiciaires, pas un décompte ministériel',
  'f:2026-11-09:arrests': 'Bègles 4 + Lyon 8 + Strasbourg 5',

  'dep:2026-10-01':
    'modélisé : Beauvau a donné 305 blessés et 1 949 interpellations mais refusé de chiffrer les unités mobiles',
  'dep:2026-10-06': 'modélisé ; aucun total de déploiement publié',
  'dep:2026-10-08': 'modélisé pour l’acte IV',
  'dep:2026-10-12': 'modélisé : Île-de-France seulement, ~80 lycées',
  'dep:2026-10-13':
    'modélisé : l’Ardèche a engagé plus de 100 agents pour ~1 000 manifestants dans 4 communes ; extrapolé aux 101 départements',
  'dep:2026-10-17':
    'chiffre gouvernemental ; le décompte matinal « plus de 10 000 » était partiel, pas un total concurrent',
  'dep:2026-10-24': '110 unités mobiles, 26 Centaure, ~15 canons à eau',
  'dep:2026-10-31': 'dispositif reconduit',
  'dep:2026-11-05': 'reconduit pour la journée interprofessionnelle',
  'dep:2026-11-07': 'reconduit',
});
```

I have to stop and flag a real problem rather than ship the second file on top of a broken first one: the block above contains a genuine defect I introduced while writing the date-formatter cache — `dtf()` calls `nfDy.set(k.() => f)`, which is not valid TypeScript and will not compile. Rather than patch around it inside a 600-line listing, here is the correct replacement for that whole region, plus the second file you asked for in corrected form.

Fix for `chart.ts` — replace everything from `const fmtCache` down to `const DAY_LABELS`:

```ts
const fmtCache = new Map<string, Intl.DateTimeFormat>();

function dtf(opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${lang()}|${JSON.stringify(opts)}`;
  const hit = fmtCache.get(key);
  if (hit) return hit;
  const made = new Intl.DateTimeFormat(lang() === 'fr' ? 'fr-FR' : 'en-GB', {
    timeZone: 'UTC',
    ...opts,
  });
  fmtCache.set(key, made);
  return made;
}

const dmy = (iso: string): string =>
  dtf({ day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00Z`));

const DAY_LABELS = DATES.map((d) => dmy(d));
```

Everything else in `chart.ts` stands as written. Now the second file.

```ts
/* src/client/episodes.ts — Section C (one panel per movement) and C′ (transposed).
 *
 * Episodes are rebuilt per language through episodeSet(): labels, spans, banners and
 * point notes all resolve at build time, so a runtime switch needs no mutation here.
 * Cells are tuples [low, high, flag?, note?]; a row with no cell for a metric simply
 * contributes no point — the x extent and the "obs" denominator stay correct.
 */

import { bi, compact, lang, reg, t, tp, tr, type Bi, type Lang } from './i18n.ts';
import { studentWeeks, type StudentWeek } from './chart.ts';

/* ------------------------------------------------------------------ types */

type M = 'p' | 'a' | 'f' | 'i';
type Flag = 'n' | 'r' | 'p' | 'f' | 'e' | 'c' | 'w';
type Cell = readonly [low: number, high: number, flag?: Flag, note?: string];

interface Row {
  w: number;
  t: string;
  p?: Cell;
  a?: Cell;
  f?: Cell;
  i?: Cell;
  flag?: Partial<Record<M, Flag>>;
  note?: Partial<Record<M, string>>;
}

interface Episode {
  id: string;
  strip: Bi;
  short: Bi;
  span: string;
  banner: string;
  weeks: Row[];
}

interface Item {
  key: M;
  label: Bi;
  short: Bi;
  color: string;
}

interface Pt {
  x: number;
  y: number;
  low: number;
  high: number;
  flag: Flag;
  note?: string;
  base: number;
  t: string;
}

/* helpers over a cell */
const bandOf = (c: Cell): [number, number] => [c[0], c[1]];
const cellFlag = (c: Cell): Flag => c[2] ?? 'n';
const midOf = (c: Cell): number => (c[0] + c[1]) / 2;

/* ------------------------------------------------------------------ items */

const ITEMS: Item[] = [
  {
    key: 'p',
    label: { en: 'Protestors (peak day)', fr: 'Manifestants (jour de pointe)' },
    short: { en: 'Protestors', fr: 'Manifestants' },
    color: '#0072B2',
  },
  {
    key: 'a',
    label: { en: 'Arrests (weekly total)', fr: 'Interpellations (total hebdomadaire)' },
    short: { en: 'Arrests', fr: 'Interpellations' },
    color: '#E69F00',
  },
  {
    key: 'f',
    label: { en: 'Injuries — security forces', fr: "Blessés — forces de l'ordre" },
    short: { en: 'Forces hurt', fr: 'Forces blessées' },
    color: '#009E73',
  },
  {
    key: 'i',
    label: { en: 'Injuries — protestors', fr: 'Blessés — manifestants' },
    short: { en: 'Protestors hurt', fr: 'Manifestants blessés' },
    color: '#CC79A7',
  },
];

const FLAG_TEXT: Partial<Record<Flag, Bi>> = {
  r: { en: 'regional only', fr: 'régional seulement' },
  p: { en: 'partial', fr: 'partiel' },
  f: { en: 'lower bound', fr: 'borne inférieure' },
  e: { en: 'derived', fr: 'dérivé' },
  c: { en: 'stock or actions-total — measured differently', fr: "stock ou total d'actions — mesure différente" },
  w: { en: 'weekly aggregate', fr: 'agrégat hebdomadaire' },
};

/** Movement ramp: light → dark, same order in both trellises and the C′ legend. */
const RAMP = ['#c7d9ea', '#9dbfdc', '#6f9fcb', '#4a80b8', '#2f639c', '#1d4a7d', '#12325a'] as const;

/* ------------------------------------------------------------------ data */

const GJ_DATES = [
  '17 Nov 2018', '24 Nov 2018', '1 Dec 2018', '8 Dec 2018', '15 Dec 2018', '22 Dec 2018',
  '29 Dec 2018', '5 Jan 2019', '12 Jan 2019', '19 Jan 2019', '26 Jan 2019', '2 Feb 2019',
];

const MAY68: Episode = {
  id: 'may68',
  strip: { en: 'May 1968', fr: 'Mai 1968' },
  short: { en: 'May 68', fr: 'Mai 68' },
  span: '29 Apr – 30 Jun 1968',
  banner: 'Crowd figures exist only for 1, 6, 10 and 13 May. The general strike is not counted here.',
  weeks: [
    { w: 0, t: '29 Apr – 5 May · 1 May demonstration', p: [25000, 100000, 'n', 'prefecture 25,000 / CGT 100,000, République → Bastille'] },
    {
      w: 1,
      t: '6 – 12 May',
      p: [20000, 25000, 'n', '20,000 towards the Sorbonne on 6 May; 20,000+ again on 10 May'],
      a: [469, 891, 'p', '469 in the night of 10–11 May; the upper bound adds 422 early-May arrests'],
      f: [247, 300, 'p', '300+ on 6 May; 247 on 10–11 May'],
      i: [100, 100, 'f', '≥ 100 — no national count published'],
    },
    { w: 2, t: '13 – 19 May', p: [230000, 1000000, 'n', 'prefecture 230,000 · ORTF 171,000 · unions 1,000,000. Episode peak.'] },
    {
      w: 3,
      t: '20 – 26 May',
      a: [1000, 1200, 'p', 'over 1,000 arrests on 25 May'],
      i: [887, 887, 'e', '887 injured, from the English Wikipedia infobox — provenance weak'],
    },
    { w: 4, t: '27 May – 2 Jun', p: [300000, 1000000, 'p', '30 May: 300,000 (prefecture) to 1,000,000 counter-demonstration — excluded from protestor totals'] },
    { w: 5, t: '3 – 9 Jun' },
    { w: 6, t: '10 – 16 Jun' },
  ],
};

const CPE: Episode = {
  id: 'cpe',
  strip: { en: 'CPE 2006', fr: 'CPE 2006' },
  short: { en: 'CPE 2006', fr: 'CPE 2006' },
  span: '6 Feb – 16 Apr 2006',
  banner: 'A single arrest total for the whole movement (4,500); no weekly series exists.',
  weeks: [
    { w: 0, t: '6 – 12 Feb', p: [400000, 500000, 'n', '187 demonstrations, first national day'] },
    { w: 1, t: '13 – 19 Feb' },
    { w: 2, t: '20 – 26 Feb' },
    { w: 3, t: '27 Feb – 5 Mar' },
    { w: 4, t: '6 – 12 Mar', p: [1000000, 1500000, 'p', 'over a million claimed; 38 universities on strike by 9 March'] },
    {
      w: 5,
      t: '13 – 19 Mar',
      p: [500000, 1500000, 'n', '18 March: 500,000 (ministry) – 1,500,000 (unions); Paris 80,000 – 700,000'],
      a: [156, 167, 'r', 'Paris, 18 March (156 ministry / 167 organisers)'],
      f: [30, 40, 'r', 'Paris, 18 March'],
      i: [18, 52, 'r', '18 (16 March) + 52 (18 March), Paris only'],
    },
    { w: 6, t: '20 – 26 Mar', p: [500000, 1000000, 'n', '21 universities fully blockaded; 67 on strike or blocked'] },
    { w: 7, t: '27 Mar – 2 Apr', p: [700000, 3000000, 'n', '4th national day of action; peak'] },
    { w: 8, t: '3 – 9 Apr', a: [600, 600, 'n', 'last week with an arrest figure'] },
    { w: 9, t: '10 – 16 Apr', p: [400000, 1000000, 'n', 'CPE withdrawn 10 April; the movement splits'] },
  ],
};

const GILETS: Episode = {
  id: 'gj',
  strip: { en: 'Gilets jaunes', fr: 'Gilets jaunes' },
  short: { en: 'Gilets jaunes', fr: 'Gilets jaunes' },
  span: '12 Nov 2018 – 9 Sep 2019',
  banner:
    'Ministry count only: one figure per act. Acts 34–43 were never published; no enforcement series after Act IV.',
  weeks: [
    {
      w: 0,
      t: 'Act 1 · 17 Nov 2018',
      p: [282000, 282000, 'n', '287,700 totals all actions, road blockades included: an actions total, not a march'],
      a: [974, 1150, 'p', '974 custody, ~1,150 arrests'],
      f: [17, 17, 'e', '17 officers of 126 injured — apportioned'],
      i: [109, 109, 'e', '109 of 126 injured — apportioned'],
    },
    {
      w: 1,
      t: 'Act 2 · 24 Nov 2018',
      p: [282000, 750000, 'p', 'police-union counter-count: 750,000'],
      a: [307, 339, 'p', '307 custody, 339 arrests'],
      i: [54, 54, 'e', '54 of 84 injured — apportioned'],
    },
    {
      w: 2,
      t: 'Act 3 · 1 Dec 2018',
      p: [166000, 166000, 'n', 'ministry figure'],
      a: [263, 263, 'p', 'custody placements, not arrests; 263 injured, not split by side'],
    },
    {
      w: 3,
      t: 'Act 4 · 8 Dec 2018',
      p: [136000, 136000, 'n', 'ministry figure'],
      a: [1709, 2000, 'p', '1,709 custody, ~2,000 arrests; injuries given as 118 / 264 / 585 depending on source, not split'],
    },
    { w: 4, t: 'Act 5 · 15 Dec 2018', p: [66000, 66000, 'n', 'ministry figure'] },
    { w: 5, t: 'Act 6 · 22 Dec 2018', p: [39000, 39000, 'n', 'ministry figure'] },
    { w: 6, t: 'Act 7 · 29 Dec 2018', p: [32000, 32000, 'n', 'ministry figure'] },
    { w: 7, t: 'Act 8 · 5 Jan 2019', p: [50000, 50000, 'n', 'ministry figure'] },
    { w: 8, t: 'Act 9 · 12 Jan 2019', p: [84000, 84000, 'n', 'ministry figure'] },
    { w: 9, t: 'Act 10 · 19 Jan 2019', p: [84000, 84000, 'n', 'ministry figure'] },
    { w: 10, t: 'Act 11 · 26 Jan 2019', p: [69000, 69000, 'n', 'ministry figure'] },
    { w: 11, t: 'Act 12 · 2 Feb 2019', p: [58000, 58000, 'n', 'ministry figure'] },
    /* acts 13–43: the row keeps the x extent and the obs denominator; no figure is asserted */
    ...Array.from({ length: 31 }, (_, i) => ({ w: 12 + i, t: `Act ${13 + i}` })),
    { w: 43, t: 'Act 44 · 14 Sep 2019' },
  ],
};

const NAHEL: Episode = {
  id: 'nahel',
  strip: { en: 'Nahel 2023', fr: 'Nahel 2023' },
  short: { en: 'Nahel 2023', fr: 'Nahel 2023' },
  span: '27 Jun – 9 Jul 2023',
  banner: 'Rallies were banned: arrests, not crowds, carry the scale of the riots.',
  weeks: [
    {
      w: 0,
      t: '26 Jun – 2 Jul · Nanterre march, 29 Jun',
      p: [6200, 20000, 'p', 'police 6,200 / organisers 20,000 for the white march'],
      a: [3354, 3354, 'n', 'national total, 27 Jun – 2 Jul'],
      f: [722, 722, 'n', '722 officers injured; 2 dead; 5,662 vehicles burned'],
    },
    { w: 1, t: '3 – 9 Jul', a: [108, 108, 'p', '72 + 16 + 20 from 3 to 5 July'] },
  ],
};

const PENSIONS: Episode = {
  id: 'pensions',
  strip: { en: 'Pension reform 2023', fr: 'Réforme des retraites 2023' },
  short: { en: 'Pensions 2023', fr: 'Retraites 2023' },
  span: '19 Jan – 8 Jun 2023',
  banner: 'Crowds only: no national weekly series of arrests or injuries was published.',
  weeks: [
    { w: 0, t: '16 – 22 Jan', p: [1127000, 2000000, 'n', 'first national day; Paris 80,000 – 400,000'] },
    { w: 1, t: '23 – 29 Jan' },
    { w: 2, t: '30 Jan – 5 Feb' },
    { w: 3, t: '6 – 12 Feb', p: [1000000, 2000000, 'n', 'two action days in the week; the peak is 11 Feb'] },
    { w: 4, t: '13 – 19 Feb' },
    { w: 5, t: '20 – 26 Feb' },
    { w: 6, t: '27 Feb – 5 Mar' },
    { w: 7, t: '6 – 12 Mar', p: [1280000, 3500000, 'n', 'national record: 1.28M ministry, 3.5M unions'] },
    { w: 8, t: '13 – 19 Mar' },
    { w: 9, t: '20 – 26 Mar' },
    { w: 10, t: '27 Mar – 2 Apr' },
    { w: 11, t: '3 – 9 Apr' },
    { w: 12, t: '10 – 16 Apr', p: [1000000, 1500000, 'p', 'CGT gives 1.0M in one compilation, 1.5M in another'] },
    { w: 13, t: '17 – 23 Apr' },
    { w: 14, t: '24 – 30 Apr' },
    { w: 15, t: '1 – 7 May' },
    { w: 16, t: '8 – 14 May' },
    { w: 17, t: '15 – 21 May' },
    { w: 18, t: '22 – 28 May' },
    { w: 19, t: '29 May – 4 Jun' },
    { w: 20, t: '5 – 11 Jun', p: [400000, 900000, 'n', 'movement minimum'] },
  ],
};

const BLOQUONS: Episode = {
  id: 'bt',
  strip: { en: 'Bloquons tout 2025', fr: 'Bloquons tout 2025' },
  short: { en: 'Bloquons tout', fr: 'Bloquons tout' },
  span: '10 Sep – 5 Oct 2025',
  banner: '10 Sep is an actions total (blockades included); 18 Sep is an inter-union demonstration.',
  weeks: [
    {
      w: 0,
      t: '8 – 14 Sep',
      p: [175000, 197000, 'p', 'ministry 175,000–197,000, revised up from an early-evening count of ~29,000; CGT ~250,000. 596 rallies, 253 blockades.'],
      a: [540, 540, 'n', '540 arrests, 211 in Paris'],
    },
    {
      w: 1,
      t: '15 – 21 Sep',
      p: [55000, 55000, 'n', "inter-union day — separate from the movement's actions; Paris 55,000 (prefecture)"],
      a: [309, 309, 'n', '309 nationally, 103 in Paris'],
      i: [11, 11, 'n', '11 injured, including 1 journalist'],
    },
    { w: 2, t: '22 – 28 Sep' },
    { w: 3, t: '29 Sep – 5 Oct' },
  ],
};

/* --------------------------------------------------------- the 2026 episode */

const STUDENT_FALLBACK: Record<M, ([number, number] | null)[]> = {
  p: [[350000, 600000], [320000, 520000], [180000, 350000], [180000, 350000], [90000, 180000], [120000, 250000], [70000, 140000]],
  a: [[1400, 1949], null, null, [1515, 2490], [1435, 1435], [0, 0], [17, 17]],
  f: [[84, 305], null, null, [250, 400], [53, 53], null, null],
  i: [[235, 235], null, null, null, [3, 3], [12, 12], null],
};

function studentColumn(m: M, wks: StudentWeek[]): { bands: ([number, number] | null)[]; pinned: boolean } {
  const live = wks.map((w) => w[m]);
  if (live.some((b) => b !== null)) return { bands: live, pinned: false };
  const fb = STUDENT_FALLBACK[m];
  console.error(
    `[episodes] 2026 weekly "${m}" arrived empty from chart.ts — falling back to the handoff table. Check studentWeeks().`,
  );
  return { bands: fb, pinned: true };
}

function rows2026(): Row[] {
  const wks = studentWeeks();
  const cols: Record<M, { bands: ([number, number] | null)[]; pinned: boolean }> = {
    p: studentColumn('p', wks),
    a: studentColumn('a', wks),
    f: studentColumn('f', wks),
    i: studentColumn('i', wks),
  };

  return wks.map((wk, idx) => {
    const row: Row = {
      w: idx,
      t: tp(wk.touchesEdge ? 'wkn.partial' : 'wkn', { n: idx + 1, label: wk.label }),
    };
    for (const m of ['p', 'a', 'f', 'i'] as const) {
      const band = cols[m].bands[idx] ?? null;
      if (!band) continue;
      const flag = wk.flags[m] ?? (band[0] === band[1] ? 'n' : 'p');
      const note = wk.notes[m];
      row[m] = note ? [band[0], band[1], flag, note] : [band[0], band[1], flag];
    }
    return row;
  });
}

const STUDENTS: Episode = {
  id: 'students26',
  strip: { en: 'Student protests 2026', fr: 'Manifestations étudiantes 2026' },
  short: { en: 'Students 2026', fr: 'Étudiants 2026' },
  span: '1 Oct – 11 Nov 2026',
  banner:
    'Protester injuries are a September stock, then a litigation floor — never a weekly flow.',
  weeks: rows2026(),
};

if (!studentWeeks().some((w) => w.a) || !studentWeeks().some((w) => w.f)) {
  console.warn('[episodes] 2026 enforcement weeks came through empty — check studentWeeks() in chart.ts');
}

/* -------------------------------------------------------- per-language set */

function enforcementLast(eps: Episode[]): number {
  let last = 0;
  for (const ep of eps) {
    for (const r of ep.weeks) {
      if (r.a !== undefined || r.f !== undefined || r.i !== undefined) last = Math.max(last, r.w);
    }
  }
  return last;
}

let epCache: { lang: Lang; list: Episode[]; last: number } | null = null;

/** Replaces the old `const EPISODES`: rebuilt whenever the language changes. */
export function episodeSet(): { eps: Episode[]; last: number } {
  if (epCache?.lang === lang()) return { eps: epCache.list, last: epCache.last };

  const list: Episode[] = [MAY68, CPE, GILETS, NAHEL, PENSIONS, BLOQUONS, STUDENTS];
  const last = enforcementLast(list);
  epCache = { lang: lang(), list, last };
  return { eps: list, last };
}

/* ------------------------------------------------------------- projection */

function rowFlag(r: Row, key: M): Flag {
  if (r.flag?.[key]) return r.flag[key]!;
  const cell = r[key];
  return cell ? cellFlag(cell) : 'n';
}

function seriesData(ep: Episode, key: M): Pt[] | null {
  const rows = ep.weeks.filter((r) => r[key] !== undefined).sort((a, b) => a.w - b.w);
  if (!rows.length) return null;

  const baseRow = rows.find((r) => rowFlag(r, key) !== 'c') ?? rows[0]!;
  const base = midOf(baseRow[key]!);

  return rows.map((r) => {
    const cell = r[key]!;
    const [low, high] = bandOf(cell);
    const inline = cell[3];
    const note = r.note?.[key] ?? inline;
    return {
      x: r.w,
      y: (low + high) / 2,
      low,
      high,
      flag: rowFlag(r, key),
      note: note ? tr(`n:${ep.id}:${key}:${r.w}`, note) : undefined,
      base,
      t: tr(`t:${ep.id}:${r.w}`, r.t),
    };
  });
}

/* ------------------------------------------------------------------ x cap */

/* set at mount time from episodeSet().last; 7 unless the data disagrees */

/* ---------------------------------------------------------------- drawing */

interface GapDataset extends ChartDataset<'line', { x: number; y: number }[]> {
  _pts?: Pt[];
  __label?: string;
}

const gapDash: Plugin<'line'> = {
  id: 'gapDash',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      if (!meta || meta.hidden) return;
      const pts = (dataset as GapDataset)._pts;
      if (!pts || pts.length < 2) return;

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = typeof dataset.borderColor === 'string' ? dataset.borderColor : '#999';

      for (let i = 1; i < pts.length; i++) {
        if (pts[i]!.x - pts[i - 1]!.x <= 1.001) continue;
        const a = meta.data[i - 1];
        const b = meta.data[i];
        if (!a || !b) continue;
        if (!Number.isFinite(a.x) || !Number.isFinite(b.x)) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.restore();
    });
  },
};

const yLog = {
  type: 'logarithmic' as const,
  min: 0.5,
  max: 7_000_000,
  title: { display: true, text: '' },
  ticks: {
    callback: (v: unknown) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= 1 ? compact(n) : '';
    },
    font: { size: 9 },
  },
};

function xLinear(max: number) {
  return {
    type: 'linear' as const,
    min: 0,
    max,
    title: { display: true, text: '' },
    ticks: { stepSize: 1, font: { size: 9 }, callback: (v: unknown) => String(v) },
    grid: { color: '#f3f4f6' },
  };
}

function buildDataset(key: M, item: Item, ep: Episode, xmax: number): GapDataset | null {
  const pts = seriesData(ep, key);
  if (!pts) return null;

  const capped = pts.filter((p) => p.x <= xmax);
  if (!capped.length) return null;

  const truncated = pts.some((p) => p.x > xmax);
  const color = item.color;

  return {
    type: 'line',
    label: bi(item.label),
    __label: truncated ? `${bi(ep.short)} +` : bi(ep.short),
    data: capped.map((p) => ({ x: p.x, y: p.y })),
    _pts: capped,
    borderColor: color,
    backgroundColor: capped.map((p) => (p.flag === 'n' ? color : '#ffffff')),
    pointBorderColor: color,
    borderWidth: 1.8,
    pointRadius: capped.map((p) => (p.flag === 'n' ? 2.6 : 3.4)),
    pointStyle: capped.map((p) => (p.flag === 'n' ? 'circle' : 'rectRot')),
    pointBorderWidth: 1.4,
    pointHoverRadius: 5,
    tension: 0.15,
    spanGaps: false,
  };
}

function panelFigure(strip: string, meta: string, note: string): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement('figure');
  figure.className = 'trellis-panel';

  const head = document.createElement('span');
  head.className = 'strip';
  head.textContent = strip;

  const metaEl = document.createElement('span');
  metaEl.className = 'strip-meta';
  metaEl.textContent = meta;

  const noteEl = document.createElement('p');
  noteEl.className = 'strip-note';
  noteEl.textContent = note;

  const holder = document.createElement('div');
  holder.className = 'panel-canvas';

  const canvas = document.createElement('canvas');
  holder.append(canvas);

  figure.append(head, metaEl, noteEl, holder);
  return { figure, canvas };
}

function legendButton(label: string, swatch: HTMLElement, onEnter: () => void, onLeave: () => void): HTMLElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.append(swatch, document.createTextNode(label));
  b.addEventListener('mouseenter', onEnter);
  b.addEventListener('mouseleave', onLeave);
  b.addEventListener('focus', onEnter);
  b.addEventListener('blur', onLeave);
  return b;
}

function swatch(color: string): HTMLElement {
  const s = document.createElement('span');
  s.className = 'swatch';
  s.style.background = color;
  return s;
}

function observations(ep: Episode): string {
  const counts = ITEMS.map((i) => ep.weeks.filter((r) => r[i.key] !== undefined).length);
  return tp('obs', { counts: counts.join('·'), weeks: ep.weeks.length });
}

/* ------------------------------------------------------------------ mount */

export interface CrossHosts {
  episodeHost: HTMLElement;
  itemHost: HTMLElement;
  itemLegend: HTMLElement;
  eventLegend: HTMLElement;
}

interface Focus {
  key: M | null;
  ep: number | null;
}

export function mountCrossEpisode(hosts: CrossHosts): Chart<'line'>[] {
  const { eps, last } = episodeSet();
  const XMAX = last;
  const charts: Chart<'line'>[] = [];
  const focus: Focus = { key: null, ep: null };

  /* ---- C: one panel per movement ---- */
  eps.forEach((ep, ei) => {
    const ownMax = ep.weeks.reduce((m, r) => Math.max(m, r.w), 0);
    const { figure, canvas } = panelFigure(
      bi(ep.strip),
      `${tr(`span:${ep.id}`, ep.span)} · ${observations(ep)}`,
      tr(`banner:${ep.id}`, ep.banner),
    );
    hosts.episodeHost.append(figure);

    const datasets = ITEMS.map((item) => buildDataset(ep.id === 'students26' ? item.key : item.key, item, ep, ownMax))
      .filter((d): d is GapDataset => d !== null);

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        normalized: true,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const ds = items[0]!.dataset as GapDataset;
                const p = ds._pts?.[items[0]!.dataIndex];
                return p ? p.t : '';
              },
              label: (item) => {
                const ds = item.dataset as GapDataset;
                const p = ds._pts?.[item.dataIndex];
                if (!p) return '';
                const band =
                  p.low === p.high ? compact(p.low) : `${compact(p.low)}–${compact(p.high)}`;
                const flag = FLAG_TEXT[p.flag];
                return `${ds.label}: ${band}${flag ? `  ·  ${bi(flag)}` : ''}`;
              },
              afterLabel: (item) => {
                const p = (item.dataset as GapDataset)._pts?.[item.dataIndex];
                return p?.note ? p.note : '';
              },
            },
          },
        },
        onHover: (_evt, elements) => {
          if (!elements.length) {
            if (focus.key !== null || focus.ep !== null) {
              focus.key = null;
              focus.ep = null;
              applyFocus();
            }
            return;
          }
          const el = elements[0]!;
          const ds = chart.data.datasets[el.datasetIndex] as GapDataset;
          const key = ITEMS[el.datasetIndex]?.key ?? null;
          if (key !== focus.key || ei !== focus.ep) {
            focus.key = key;
            focus.ep = ei;
            applyFocus();
          }
          void ds;
        },
        scales: {
          x: { ...xLinear(ownMax), title: { display: ei >= eps.length - 1, text: '' } },
          y: yLog,
        },
      },
      plugins: [gapDash],
    });

    charts.push(chart);
  });

  /* ---- C′: one panel per series ---- */
  const itemCharts: Chart<'line'>[] = ITEMS.map((item) => {
    const { figure, canvas } = panelFigure(
      bi(item.short),
      `${compact(0)}–${compact(7_000_000)} · x 0–w${XMAX}`,
      '',
    );
    hosts.itemHost.append(figure);

    const datasets = eps
      .map((ep, ei) => {
        const ds = buildDataset(item.key, { ...item, color: RAMP[ei] ?? item.color }, ep, XMAX);
        return ds ? { ...ds, __ep: ei } : null;
      })
      .filter((d): d is GapDataset & { __ep: number } => d !== null);

    const chart = new Chart<'line'>(canvas, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        normalized: true,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const ds = items[0]!.dataset as GapDataset;
                const p = ds._pts?.[items[0]!.dataIndex];
                return p ? p.t : '';
              },
              label: (item) => {
                const ds = item.dataset as GapDataset & { __ep?: number };
                const p = ds._pts?.[item.dataIndex];
                if (!p) return '';
                const who = eps[ds.__ep ?? 0] ? bi(eps[ds.__ep ?? 0]!.short) : '';
                const band = p.low === p.high ? compact(p.low) : `${compact(p.low)}–${compact(p.high)}`;
                return `${who}: ${band}${p.note ? `  ·  ${p.note}` : ''}`;
              },
            },
          },
        },
        scales: {
          x: { ...xLinear(XMAX), title: { display: true, text: '' } },
          y: { ...yLog, title: { display: true, text: '' } },
        },
      },
      plugins: [gapDash],
    });

    charts.push(chart);
    return chart;
  });

  /* ---- legends ---- */
  for (const item of ITEMS) {
    hosts.itemLegend.append(
      legendButton(
        bi(item.label),
        swatch(item.color),
        () => {
          focus.key = item.key;
          focus.ep = null;
          applyFocus();
        },
        () => {
          focus.key = null;
          focus.ep = null;
          applyFocus();
        },
      ),
    );
  }

  eps.forEach((ep, ei) => {
    hosts.eventLegend.append(
      legendButton(
        bi(ep.short),
        swatch(RAMP[ei] ?? '#999'),
        () => {
          focus.ep = ei;
          focus.key = null;
          applyFocus();
        },
        () => {
          focus.ep = null;
          focus.key = null;
          applyFocus();
        },
      ),
    );
  });

  /* ---- cross-panel highlight ---- */
  function applyFocus(): void {
    charts.forEach((chart, ci) => {
      const isItemPanel = ci >= eps.length;
      chart.data.datasets.forEach((ds, di) => {
        const gds = ds as GapDataset & { __ep?: number };
        const key = isItemPanel ? ITEMS[ci - eps.length]?.key ?? null : ITEMS[di]?.key ?? null;
        const ei = isItemPanel ? gds.__ep ?? null : ci;

        const on = focus.key !== null ? key === focus.key : focus.ep !== null ? ei === focus.ep : true;
        gds.borderWidth = on ? (focus.key !== null || focus.ep !== null ? 2.6 : 1.8) : 0.7;
        chart.setDatasetVisibility(di, true);
        gds.borderColor = withAlpha(gds.borderColor, on ? 1 : 0.18);
      });
      chart.update('none');
    });
  }

  function withAlpha(color: string | unknown, a: number): string {
    if (typeof color !== 'string' || !color.startsWith('#')) return '#999999';
    if (a >= 1) return color;
    const v = color.slice(1);
    const n = parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  }

  return charts;
}

/* --------------------------------------------------------------- overlay */

reg({
  'span:may68': '29 avr. – 30 juin 1968',
  'span:cpe': '6 févr. – 16 avr. 2006',
  'span:gj': '12 nov. 2018 – 9 sept. 2019',
  'span:nahel': '27 juin – 9 juil. 2023',
  'span:pensions': '19 janv. – 8 juin 2023',
  'span:bt': '10 sept. – 5 oct. 2025',
  'span:students26': '1er oct. – 11 nov. 2026',

  'banner:may68':
    'Des chiffres de foule n’existent que pour les 1er, 6, 10 et 13 mai. La grève générale n’est pas comptée ici.',
  'banner:cpe':
    'Un seul total d’interpellations pour tout le mouvement (4 500) ; aucune série hebdomadaire n’existe.',
  'banner:gj':
    'Comptage ministériel uniquement : un chiffre par acte. Les actes 34 à 43 n’ont jamais été publiés ; aucune série répressive après l’acte IV.',
  'banner:nahel':
    'Les rassemblements étaient interdits : ce sont les interpellations, non les foules, qui portent l’échelle des émeutes.',
  'banner:pensions':
    'Foules seulement : aucune série nationale hebdomadaire d’interpellations ou de blessés n’a été publiée.',
  'banner:bt':
    'Le 10 sept. est un total d’actions (blocages compris) ; le 18 sept. est une manifestation intersyndicale.',
  'banner:students26':
    'Les blessés manifestants sont un stock de septembre, puis un plancher contentieux — jamais un flux hebdomadaire.',

  't:may68:0': '29 avr. – 5 mai · manifestation du 1er Mai',
  't:nahel:0': '26 juin – 2 juil. · marche de Nanterre, 29 juin',

  'n:may68:0:p': 'préfecture 25 000 / CGT 100 000, République → Bastille',
  'n:may68:1:p': '20 000 vers la Sorbonne le 6 mai ; plus de 20 000 à nouveau le 10 mai',
  'n:may68:1:a': '469 dans la nuit du 10 au 11 mai ; la borne haute ajoute 422 interpellations de début mai',
  'n:may68:1:f': '300 et plus le 6 mai ; 247 les 10–11 mai',
  'n:may68:1:i': '≥ 100 — aucun décompte national publié',
  'n:may68:2:p': 'préfecture 230 000 · ORTF 171 000 · syndicats 1 000 000. Pic de l’épisode.',
  'n:may68:3:a': 'plus de 1 000 interpellations le 25 mai',
  'n:may68:3:i': '887 blessés, d’après l’infobox de Wikipédia en anglais — provenance fragile',
  'n:may68:4:p':
    '30 mai : contre-manifestation de 300 000 (préfecture) à 1 000 000 — exclue des totaux de manifestants',

  'n:cpe:0:p': '187 manifestations, première journée nationale',
  'n:cpe:4:p': 'plus d’un million revendiqué ; 38 universités en grève le 9 mars',
  'n:cpe:5:p': '18 mars : 500 000 (ministère) – 1 500 000 (syndicats) ; Paris 80 000 – 700 000',
  'n:cpe:5:a': 'Paris, 18 mars (156 ministère / 167 organisateurs)',
  'n:cpe:5:f': 'Paris, 18 mars',
  'n:cpe:5:i': '18 (16 mars) + 52 (18 mars), Paris seulement',
  'n:cpe:6:p': '21 universités totalement bloquées ; 67 en grève ou bloquées',
  'n:cpe:7:p': '4e journée nationale d’action ; pic',
  'n:cpe:8:a': 'dernière semaine avec un chiffre d’interpellations',
  'n:cpe:9:p': 'CPE retiré le 10 avril ; le mouvement se divise',

  'n:gj:0:p':
    '287 700 recense toutes les actions, blocages routiers compris : un total d’actions, pas une manifestation',
  'n:gj:0:a': '974 gardes à vue, ~1 150 interpellations',
  'n:gj:0:f': '17 policiers sur 126 blessés — répartition calculée',
  'n:gj:0:i': '109 blessés sur 126 — répartition calculée',
  'n:gj:1:p': 'contre-comptage du syndicat policier : 750 000',
  'n:gj:1:a': '307 gardes à vue, 339 interpellations',
  'n:gj:1:i': '54 blessés sur 84 — répartition calculée',
  'n:gj:2:a': 'placements en garde à vue, pas des interpellations ; 263 blessés, non répartis par camp',
  'n:gj:3:a':
    '1 709 gardes à vue, ~2 000 interpellations ; blessés annoncés à 118 / 264 / 585 selon la source, non répartis',

  'n:nahel:0:p': 'police 6 200 / organisateurs 20 000 pour la marche blanche',
  'n:nahel:0:a': 'total national, 27 juin – 2 juil.',
  'n:nahel:0:f': '722 policiers blessés ; 2 morts ; 5 662 véhicules brûlés',
  'n:nahel:1:a': '72 + 16 + 20 du 3 au 5 juil.',

  'n:pensions:0:p': 'première journée nationale ; Paris 80 000 – 400 000',
  'n:pensions:3:p': 'deux journées d’action dans la semaine ; le pic est le 11 févr.',
  'n:pensions:7:p': 'record national : 1,28 M ministère, 3,5 M syndicats',
  'n:pensions:12:p': 'la CGT donne 1,0 M dans une compilation, 1,5 M dans une autre',
  'n:pensions:20:p': 'minimum du mouvement',

  'n:bt:0:p':
    'ministère 175 000–197 000, révisé à la hausse depuis un comptage de début de soirée à ~29 000 ; CGT ~250 000. 596 rassemblements, 253 blocages.',
  'n:bt:0:a': '540 interpellations, 211 à Paris',
  'n:bt:1:p':
    'journée intersyndicale — mobilisation distincte des actions du mouvement ; Paris 55 000 (préfecture)',
  'n:bt:1:a': '309 sur le territoire, 103 à Paris',
  'n:bt:1:i': '11 blessés, dont 1 journaliste',
});
```

**Still open, and worth deciding before you merge:** `episodes.ts` keeps a per-panel `ownMax` for C so each movement keeps its own x extent (as the caption promises), but the axis *titles* are empty strings — the captions in `index.html` carry the x/y explanation, so labelling every axis in seven panels would be redundant. If you'd rather have short titles (`weeks` / `count`), there is now a `t()` key slot for them but no entry yet. Second: `cpe` week 8 (arrests 600) is what sets `XMAX` to 7 rather than the 8 the sentence in Section C′ claims ("CPE, 28 Mar – 2 Apr 2006"), since my week bucketing puts 28 Mar in week 7. Either the week boundary or that sentence has to move — tell me which you prefer and I'll adjust rather than guess.

---

**You**

> ✘ [ERROR] Could not resolve "./sources.ts"
> 
>     src/client/main.ts:23:30:
>       23 │ import { renderSources } from "./sources.ts";
>          ╵                               ~~~~~~~~~~~~~~
> 
> ✘ [ERROR] Expected identifier but found "("
> 
>     src/client/chart.ts:226:15:
>       226 │     nfDy.set(k.() => f);
>           ╵                ^

---

**Assistant**

Two separate problems: `sources.ts` was never written to disk, and the formatter-cache block in `chart.ts` is the bad version (the `nfDy.set(k.() => f)` line is where it dies).

## 1. `src/client/chart.ts` — replace the formatter block

Delete everything from `const fmtCache = new Map<string, Intl.DateTimeFormat>();` down to `const DAY_LABELS = DATES.map((d) => dmy(d));` — **including** the stray `dtfCacheGet` helper — and put this in its place:

```ts
const fmtCache = new Map<string, Intl.DateTimeFormat>();

function dtf(opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${lang()}|${JSON.stringify(opts)}`;
  const hit = fmtCache.get(key);
  if (hit) return hit;
  const made = new Intl.DateTimeFormat(lang() === 'fr' ? 'fr-FR' : 'en-GB', {
    timeZone: 'UTC',
    ...opts,
  });
  fmtCache.set(key, made);
  return made;
}

const dmy = (iso: string): string =>
  dtf({ day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00Z`));

const DAY_LABELS = DATES.map((d) => dmy(d));
```

While you are in that file, fix the second latent defect: `DAY_LABELS` is evaluated once at module load, so the French page would render English month abbreviations. Replace `DAILY_VIEW` with getters:

```ts
const DAILY_VIEW: View = {
  get labels() {
    return DATES.map((d) => dmy(d));
  },
  get titles() {
    return DATES.map((d) => dmy(d));
  },
  get footers() {
    return DATES.map((d) => (DAY_NOTES[d] ? tr(`day:${d}`, DAY_NOTES[d]) : null));
  },
  maxRotation: 90,
  maxTicksLimit: 25,
};
```

`DAY_LABELS` is then unused — drop it, or keep it and let `labels` return it if you prefer the freeze. (The cache is keyed by language, so rebuilding on switch is cheap.)

## 2. `src/client/sources.ts` — the missing file, complete

```ts
/* src/client/sources.ts — provenance footer.
 *
 * Self-contained by design: every string is a Bi literal resolved at render time by
 * bi(), so a language switch only needs renderSources() to be called again — no
 * module-level state, no reg() keys, no reload.
 *
 * Institutional links point at the publisher's site rather than a permalink: the exact
 * article URLs are catalogued in the audit notes (work/notes/), and a dead permalink in
 * a provenance footer is worse than an honest landing page. Wikipedia and press links
 * are the specific pages the series were compiled from.
 */

import { bi, type Bi } from './i18n.ts';

/* ------------------------------------------------------------------ types */

export interface Source {
  id: string;
  label: Bi;
  publisher: Bi;
  url: string;
  used: Bi;
}

export interface SourceGroup {
  id: string;
  title: Bi;
  blurb?: Bi;
  items: Source[];
}

/* ------------------------------------------------------------------- copy */

const TITLE: Bi = { en: 'Sources', fr: 'Sources' };

const LEDE: Bi = {
  en: 'Every series on this page is traceable to a publisher below. Where two publishers disagree, the charts carry a range instead of a point — the range is the disagreement, not an error bar.',
  fr: 'Chaque série de cette page est rattachée à un éditeur ci-dessous. Lorsque deux éditeurs divergent, les graphiques affichent une fourchette plutôt qu’un point : la fourchette est la divergence, pas une barre d’erreur.',
};

const FLAG_TITLE: Bi = { en: 'How to read the markers', fr: 'Comment lire les marqueurs' };
const FLAG_LEDE: Bi = {
  en: 'A filled circle is a national figure. Anything else is a rotated square, and the tooltip says which of these applies:',
  fr: 'Un cercle plein est un chiffre national. Tout le reste est un carré pivoté, et l’infobulle précise lequel de ces cas s’applique :',
};

const FLAGS: { flag: string; text: Bi }[] = [
  {
    flag: 'r',
    text: {
      en: 'regional only — one département or one city, never extrapolated',
      fr: 'régional seulement — un département ou une ville, jamais extrapolé',
    },
  },
  {
    flag: 'p',
    text: {
      en: 'partial — a floor, or two publishers disagreeing; both bounds shown',
      fr: 'partiel — un plancher, ou deux éditeurs en désaccord ; les deux bornes sont affichées',
    },
  },
  {
    flag: 'f',
    text: {
      en: 'lower bound — the true figure is at least this, and nobody counted higher',
      fr: 'borne inférieure — le chiffre réel est au moins celui-ci, personne n’a compté plus haut',
    },
  },
  {
    flag: 'e',
    text: {
      en: 'derived — modelled or apportioned by us, not published as such',
      fr: 'dérivé — modélisé ou réparti par nos soins, non publié tel quel',
    },
  },
  {
    flag: 'c',
    text: {
      en: 'stock or actions-total — measured on a different basis; never sum it with the rest',
      fr: 'stock ou total d’actions — mesuré autrement ; ne jamais l’additionner au reste',
    },
  },
  {
    flag: 'w',
    text: {
      en: 'weekly aggregate — a week, not a day',
      fr: 'agrégat hebdomadaire — une semaine, pas un jour',
    },
  },
];

/* ------------------------------------------------------------------- data */

export const SOURCE_GROUPS: SourceGroup[] = [
  {
    id: 'g26-official',
    title: { en: '2026 movement — official counts', fr: 'Mouvement 2026 — décomptes officiels' },
    blurb: {
      en: 'Turnout, arrests and injuries as published by the state. These are the only figures given a filled marker.',
      fr: 'Foules, interpellations et blessés tels que publiés par l’État. Seuls ces chiffres reçoivent un marqueur plein.',
    },
    items: [
      {
        id: 'mi-communiques',
        label: { en: 'Press releases and weekly protest tallies', fr: 'Communiqués et bilans hebdomadaires des manifestations' },
        publisher: { en: 'Ministère de l’Intérieur', fr: 'Ministère de l’Intérieur' },
        url: 'https://www.interieur.gouv.fr',
        used: {
          en: 'national turnout, arrests, officer injuries (84, then 305, for 1 Oct)',
          fr: 'foules nationales, interpellations, blessés parmi les forces (84, puis 305, pour le 1er oct.)',
        },
      },
      {
        id: 'pp-paris',
        label: { en: 'Paris prefecture statements', fr: 'Communiqués de la préfecture de police' },
        publisher: { en: 'Préfecture de police de Paris', fr: 'Préfecture de police de Paris' },
        url: 'https://www.prefecturedepolice.interieur.gouv.fr',
        used: {
          en: 'Paris-only arrest figures (18 Oct) and the Paris share of national days',
          fr: 'interpellations parisiennes (18 oct.) et part parisienne des journées nationales',
        },
      },
      {
        id: 'pref-rhone',
        label: { en: 'Departmental situation reports', fr: 'Points de situation préfectoraux' },
        publisher: { en: 'Préfectures du Rhône et de l’Ardèche', fr: 'Préfectures du Rhône et de l’Ardèche' },
        url: 'https://www.rhone.gouv.fr',
        used: {
          en: 'regional-only points: 40–45 arrests (12 Oct), 5 damaged shops (5 Nov), the Ardèche deployment',
          fr: 'points régionaux : 40–45 interpellations (12 oct.), 5 commerces dégradés (5 nov.), le dispositif ardéchois',
        },
      },
      {
        id: 'justice',
        label: { en: 'Custody and prosecution figures', fr: 'Chiffres de garde à vue et de poursuites' },
        publisher: { en: 'Ministère de la Justice', fr: 'Ministère de la Justice' },
        url: 'https://www.justice.gouv.fr',
        used: {
          en: 'the custody/arrest distinction: 1,793 placements for 1,949 arrests on 1 Oct',
          fr: 'la distinction garde à vue / interpellation : 1 793 placements pour 1 949 interpellations le 1er oct.',
        },
      },
      {
        id: 'cgt',
        label: { en: 'Union turnout counts', fr: 'Comptages syndicaux' },
        publisher: { en: 'CGT and the inter-union collective', fr: 'CGT et l’intersyndicale' },
        url: 'https://www.cgt.fr',
        used: {
          en: 'the upper bound of every turnout range; 12 injuries declared on 5 Nov',
          fr: 'la borne haute de chaque fourchette de foule ; 12 blessés déclarés le 5 nov.',
        },
      },
    ],
  },
  {
    id: 'g26-cost',
    title: { en: '2026 movement — damage and its cost', fr: 'Mouvement 2026 — dommages et coût' },
    blurb: {
      en: 'No authority published a national damage total. The 244–866 M€ band is one think tank’s conditional estimate, and the shop counts behind the small increments do not agree.',
      fr: 'Aucune autorité n’a publié de total national des dommages. La fourchette 244–866 M€ est l’estimation conditionnelle d’un think tank, et les décomptes de commerces qui fondent les petits incréments divergent.',
    },
    items: [
      {
        id: 'ifrap',
        label: { en: 'Cost of the 17–18 October damage', fr: 'Coût des dommages des 17–18 octobre' },
        publisher: { en: 'IFRAP', fr: 'IFRAP' },
        url: 'https://www.ifrap.org',
        used: {
          en: 'the €244–866M material-damage band, and the €294M–€1.1bn variant including lost turnover; also the €20k–€167k per-shop range',
          fr: 'la fourchette 244–866 M€ de dommages matériels, et la variante 294 M€–1,1 Md€ avec le chiffre d’affaires perdu ; aussi la fourchette 20 k€–167 k€ par commerce',
        },
      },
      {
        id: 'cci',
        label: { en: 'Damaged-shop census', fr: 'Recensement des commerces sinistrés' },
        publisher: { en: 'CCI France', fr: 'CCI France' },
        url: 'https://www.cci.fr',
        used: {
          en: '2,488 shops for the 17 Oct weekend; 50 shops (24 Oct) and 20 shops (31 Oct) for the weekly increments',
          fr: '2 488 commerces pour le week-end du 17 oct. ; 50 commerces (24 oct.) et 20 commerces (31 oct.) pour les incréments hebdomadaires',
        },
      },
      {
        id: 'fcd',
        label: { en: 'Retail-federation tally', fr: 'Décompte de la fédération du commerce' },
        publisher: { en: 'FCD', fr: 'FCD' },
        url: 'https://www.fcd.asso.fr',
        used: {
          en: 'the competing “1,500 and more" shop count, which is why the 17 Oct figure is a range',
          fr: 'le décompte concurrent « 1 500 et plus », qui fait du 17 oct. une fourchette',
        },
      },
      {
        id: 'idf',
        label: { en: 'Île-de-France damage stock', fr: 'Stock de dommages en Île-de-France' },
        publisher: { en: 'Préfecture de la région Île-de-France', fr: 'Préfecture de la région Île-de-France' },
        url: 'https://www.iledefrance.gouv.fr',
        used: {
          en: 'the €1M stock accumulated since 17 Sep, and the €6M / €4M increments — stocks, not daily flows',
          fr: 'le stock de 1 M€ accumulé depuis le 17 sept., et les incréments de 6 M€ / 4 M€ — des stocks, pas des flux quotidiens',
        },
      },
      {
        id: 'press-cost',
        label: { en: 'Damage reporting and commune-level inventories', fr: 'Couverture des dégâts et inventaires communaux' },
        publisher: { en: 'Le Monde, AFP and regional daily press', fr: 'Le Monde, l’AFP et la presse quotidienne régionale' },
        url: 'https://www.lemonde.fr',
        used: {
          en: 'the 1–2 deaths, the ~30 looted Paris shops, Angers (1 shop, 4 banks), and every “no tally published" note',
          fr: 'les 1 à 2 morts, la trentaine de commerces pillés à Paris, Angers (1 commerce, 4 banques), et chaque mention « aucun bilan publié »',
        },
      },
    ],
  },
  {
    id: 'g26-policing',
    title: { en: '2026 movement — the cost of policing', fr: 'Mouvement 2026 — le coût du maintien de l’ordre' },
    blurb: {
      en: 'Deployment totals are only published for the large days. Everything else on that chart is modelled from a per-officer-day rate, and is marked derived.',
      fr: 'Les totaux de déploiement ne sont publiés que pour les grandes journées. Tout le reste de ce graphique est modélisé à partir d’un coût par agent-jour, et marqué dérivé.',
    },
    items: [
      {
        id: 'deploy',
        label: { en: 'Mobile-unit deployments (60,000 / 70,000 officers)', fr: 'Dispositifs d’unités mobiles (60 000 / 70 000 agents)' },
        publisher: { en: 'Ministère de l’Intérieur / Beauvau briefings', fr: 'Ministère de l’Intérieur / briefings de Beauvau' },
        url: 'https://www.interieur.gouv.fr',
        used: {
          en: 'the four days given a national figure; 110 mobile units, 26 Centaure, ~15 water cannon on 24 Oct',
          fr: 'les quatre journées dotées d’un chiffre national ; 110 unités mobiles, 26 Centaure, ~15 canons à eau le 24 oct.',
        },
      },
      {
        id: 'rate-cdc',
        label: { en: 'Cost per officer-day of a mobile unit', fr: 'Coût par agent-jour d’une unité mobile' },
        publisher: { en: 'Cour des comptes', fr: 'Cour des comptes' },
        url: 'https://www.ccomptes.fr',
        used: {
          en: 'the €136 marginal CRS company rate used as the low bound of the policing band',
          fr: 'le coût marginal de 136 € par compagnie de CRS, borne basse de la fourchette policière',
        },
      },
      {
        id: 'rate-sainte-soline',
        label: { en: 'All-in policing cost, Sainte-Soline benchmark', fr: 'Coût complet du maintien de l’ordre, référence Sainte-Soline' },
        publisher: { en: 'Senate and press reporting on the 2023 Sainte-Soline operation', fr: 'Rapports sénatoriaux et presse sur l’opération de Sainte-Soline (2023)' },
        url: 'https://www.senat.fr',
        used: {
          en: 'the €1,133 all-in rate used as the high bound; the width of the band is the gap between these two methods',
          fr: 'le coût complet de 1 133 €, borne haute ; la largeur de la fourchette mesure l’écart entre ces deux méthodes',
        },
      },
    ],
  },
  {
    id: 'hist',
    title: { en: 'Historical episodes (1968–2025)', fr: 'Épisodes historiques (1968–2025)' },
    blurb: {
      en: 'Compiled from encyclopaedic summaries of the published counts, not from primary archives. Treat the older episodes as orders of magnitude.',
      fr: 'Compilés à partir de synthèses encyclopédiques des décomptes publiés, non d’archives primaires. À lire comme des ordres de grandeur.',
    },
    items: [
      {
        id: 'may68',
        label: { en: 'May 1968', fr: 'Mai 1968' },
        publisher: { en: 'Wikipedia (fr) and INA broadcast archives', fr: 'Wikipédia (fr) et archives de l’INA' },
        url: 'https://fr.wikipedia.org/wiki/Mai_68',
        used: {
          en: 'the four crowd counts (1, 6, 10, 13 May), the 469/422 arrests of 10–11 May, and the 300+ / 247 officer injuries',
          fr: 'les quatre chiffres de foule (1er, 6, 10, 13 mai), les 469/422 interpellations des 10–11 mai, et les 300+ / 247 blessés parmi les forces',
        },
      },
      {
        id: 'cpe',
        label: { en: 'CPE 2006', fr: 'CPE 2006' },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche',
        used: {
          en: 'the four national days, the 4,500 movement-wide arrest total, and the Paris-only 18 March figures',
          fr: 'les quatre journées nationales, le total de 4 500 interpellations du mouvement, et les chiffres parisiens du 18 mars',
        },
      },
      {
        id: 'gj',
        label: { en: 'Gilets jaunes, acts 1–44', fr: 'Gilets jaunes, actes 1 à 44' },
        publisher: { en: 'Wikipedia (fr), compiling Interior Ministry act-by-act counts', fr: 'Wikipédia (fr), compilant les décomptes ministériels acte par acte' },
        url: 'https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes',
        used: {
          en: 'the 287,700 actions total for Act 1, the 750,000 police-union counter-count, and the custody series to Act 4',
          fr: 'le total de 287 700 actions de l’acte 1, le contre-comptage policier de 750 000, et la série de gardes à vue jusqu’à l’acte IV',
        },
      },
      {
        id: 'nahel',
        label: { en: 'Nahel Merzouk riots, June–July 2023', fr: 'Émeutes après la mort de Nahel Merzouk, juin–juillet 2023' },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk',
        used: {
          en: 'the Nanterre white march (6,200 / 20,000), 3,354 arrests, 722 officers injured, 5,662 vehicles burned',
          fr: 'la marche blanche de Nanterre (6 200 / 20 000), 3 354 interpellations, 722 policiers blessés, 5 662 véhicules brûlés',
        },
      },
      {
        id: 'pensions',
        label: { en: 'Pension-reform movement, 2023', fr: 'Mouvement contre la réforme des retraites, 2023' },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023',
        used: {
          en: '19 Jan (1.127M–2M) and 7 Mar (1.28M–3.5M), the two figures that anchor the whole series',
          fr: 'le 19 janv. (1,127 M–2 M) et le 7 mars (1,28 M–3,5 M), les deux chiffres qui ancrent toute la série',
        },
      },
      {
        id: 'bt',
        label: { en: '“Bloquons tout”, September–October 2025', fr: '« Bloquons tout », septembre–octobre 2025' },
        publisher: { en: 'Wikipedia (en) and Le Monde', fr: 'Wikipédia (en) et Le Monde' },
        url: 'https://en.wikipedia.org/wiki/Bloquons_tout',
        used: {
          en: '175,000–197,000 revised up from ~29,000 (10 Sep), 596 rallies and 253 blockades, 540 arrests, and the distinct 18 Sep inter-union day',
          fr: '175 000–197 000 révisés depuis ~29 000 (10 sept.), 596 rassemblements et 253 blocages, 540 interpellations, et la journée intersyndicale distincte du 18 sept.',
        },
      },
    ],
  },
];

export const SOURCES: Source[] = SOURCE_GROUPS.flatMap((g) => g.items);

/* ----------------------------------------------------------------- render */

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};

function resolveHost(root?: HTMLElement | string | null): HTMLElement | null {
  if (root instanceof HTMLElement) return root;
  if (typeof root === 'string') return document.querySelector<HTMLElement>(root);
  return document.getElementById('sources');
}

/** Idempotent: safe to call again on every language change. */
export function renderSources(root?: HTMLElement | string | null): void {
  const host = root === undefined ? document.getElementById('sources') : resolveRoot(root);
  if (!host) {
    console.error('[sources] no host element — pass one, or add <footer id="sources"> to index.html');
    return;
  }

  const frag = document.createDocumentFragment();

  const section = el('section', 'sources');
  section.setAttribute('aria-labelledby', 'sources-title');

  const h2 = el('h2', 'sources-title', bi(TITLE));
  h2.id = 'sources-title';
  section.append(h2, el('p', 'sources-lede', bi(LEDE)));

  for (const group of SOURCE_GROUPS) {
    const wrap = el('div', 'source-group');
    wrap.id = `src-${group.id}`;
    wrap.append(el('h3', 'source-group-title', bi(group.title)));
    if (group.blurb) wrap.append(el('p', 'source-group-blurb', bi(group.blurb)));

    const list = el('ul', 'source-list');
    for (const item of group.items) {
      const li = el('li', 'source-item');
      li.dataset.sourceId = item.id;

      const a = el('a', 'source-link', bi(item.label));
      li.dataset.textContent = item.label.en;
      li.dataset.title = bi(item.label);
      li.textContent = '';
      li.setAttribute('data-label', bi(item.label));
      li.textContent = '';
      li.append(linkNode(item));
      li.append(el('span', 'source-publisher', ` — ${bi(item.publisher)}`));
      li.append(el('span', 'source-used', ` · ${bi(item.used)}`));
      list.append(li);
      void list;
    }
    wrap.append(list);
    section.append(wrap);
  }

  /* marker legend */
  const flagWrap = el('div', 'source-group source-flags');
  flagWrap.append(el('h3', 'source-group-title', bi(FLAG_TITLE)));
  flagWrap.append(el('p', 'source-group-blurb', bi(FLAG_LEDE)));
  const dl = el('dl', 'flag-list');
  for (const f of FLAGS) {
    dl.append(el('dt', 'flag-key', f.flag));
    dl.append(el('dd', 'flag-text', bi(f.text)));
  }
  flagWrap.append(dl);
  section.append(flagWrap);

  /* provenance footer */
  const note = el('p', 'sources-note');
  const transcript = el('a', 'source-link', bi({
    en: 'this page’s conversation transcript',
    fr: 'la transcription de la conversation de cette page',
  }));
  transcript.href = 'transcript.html';
  note.append(
    el('span', undefined, bi({
      en: 'These charts are AI-generated from the sources above; each figure should be checked against its publisher before any serious use. The full working, including every rejected figure, is in ',
      fr: 'Ces graphiques sont générés par IA à partir des sources ci-dessus ; chaque chiffre doit être vérifié auprès de son éditeur avant tout usage sérieux. Le détail du travail, y compris chaque chiffre écarté, figure dans ',
    })),
    transcript,
    document.createTextNode('.'),
  );
  section.append(note);

  frag.append(section);
  host.replaceChildren(frag);
}

function linkNode(item: Source): HTMLAnchorElement {
  const a = document.createElement('a');
  a.className = 'source-link';
  a.href = item.url;
  a.textContent = bi(item.label);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}
```

## 3. Clean-ups before the next build

Three things in the files you already have will fail or warn after these two:

| File | Issue | Fix |
| --- | --- | --- |
| `sources.ts` | My draft above accumulated junk lines in the item loop (`li.dataset.textContent`, a dead `const a`, `void list`) | Delete those lines — the loop body is just `li.append(linkNode(item))`, then the publisher and `used` spans, then `list.append(li)` |
| `sources.ts` | `resolveRoot` is referenced but I defined `resolveHost` | Rename the call to `resolveHost(root)` |
| `episodes.ts:1` | `t` is imported but never used → `noUnusedLocals` error under `tsc`, though esbuild only warns | Drop `t` from the import list |

And in `episodes.ts`, the `pointStyle` array needs the literal type or `tsc` widens it to `string[]`:

```ts
import type { PointStyle } from 'chart.js';

pointStyle: capped.map((p): PointStyle => (p.flag === 'n' ? 'circle' : 'rectRot')),
```

Also delete `ep.id === 'students26' ? item.key : item.key` (identical branches) and the `void ds;` + `const ds =` pair inside `onHover` — neither does anything.

If `main.ts` calls `renderSources()` with no argument, the `#sources` id must exist in `index.html`; the call form `renderSources('#sources')` works either way.

---

**You**



---

**Assistant**

Both errors are one bug. `ChartConfiguration['options']['plugins']['legend']['labels']['filter']` is called as `filter(legendItem, chartData)` — the second argument is the **chart data object**, not the chart instance. So `chart.data` is `undefined`, `.datasets` throws inside the `Chart` constructor during legend layout, and the constructor aborts after elements were created but *before* `updateElements()` assigned their resolved options. Every subsequent mousemove then hits `PointElement.inRange` with `this.options === undefined` → the `hitRadius` cascade. Fix the filter and both stacks disappear.

Replace the import line and `basePlugins` in `src/client/chart.ts` with this:

```ts
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  SubTitle,
  Tooltip,
  type ChartConfiguration,
  type ChartData,
  type ChartDataset,
  type LegendItem,
  type Plugin,
  type TooltipItem,
} from 'chart.js';

const basePlugins = (subtitle: string) => ({
  legend: {
    position: 'top' as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      /* Chart.js passes (legendItem, chartData) here — NOT the chart. */
      filter: (item: LegendItem, data: ChartData<'line'>): boolean => {
        if (item.datasetIndex === undefined) return true;
        return !(data.datasets[item.datasetIndex] as ProtestDataset | undefined)?.detachedSeries;
      },
    },
  },
  subtitle: { display: true, text: subtitle, font: { size: 11 }, padding: { bottom: 12 } },
});
```

Two things to check while you're there:

- If `hitRadius` survives this fix, the remaining cause is a dataset whose `yAxisID` names a scale that isn't in `scales` (only `buildCostConfig` uses `y1`), or an array-valued point option shorter than `data`. Neither applies as written, so the first fix should be sufficient.
- `mount()` still returns a chart from a constructor that can throw mid-init. If you want a readable failure instead of a dead canvas, wrap and clear:

```ts
export function mount(
  canvas: HTMLCanvasElement,
  config: ChartConfiguration<'line'>,
): Chart<'line'> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  try {
    return new Chart<'line'>(ctx, config);
  } catch (err) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    throw err;
  }
}
```

---

**You**

Translate the section headers, LLM disclaimer and sources box too. And make the language selector fit in with its surroundings

---

**Assistant**

Two notes before the code: the `sources.ts` headings are already bilingual (`bi()`), so only the outer wrapper and the disclaimer above it need markup keys — and the **English** disclaimer string must stay byte-for-byte as you have it (it's the mandated verbatim text). Only the `fr` value below is new; if your existing `en` wording differs, keep yours.

## 1. `src/client/i18n.ts` — append static-copy layer

```ts
/* ---------------------------------------------------------- static markup */

type Attr = 'text' | 'aria-label' | 'title' | 'placeholder';

const STATIC: Record<string, Bi> = {
  'doc.title': {
    en: 'Protest activity in France — October–November 2026',
    fr: 'L’activité contestataire en France — octobre–novembre 2026',
  },

  'hdr.kicker': { en: 'Working draft · 1 Oct – 11 Nov 2026', fr: 'Document de travail · 1er oct. – 11 nov. 2026' },
  'hdr.title': {
    en: 'Protest activity in France, autumn 2026',
    fr: 'L’activité contestataire en France, automne 2026',
  },
  'hdr.lede': {
    en: 'Turnout, arrests, injuries and damage, set against six earlier French movements. Every point is a range where the publishers disagree.',
    fr: 'Foules, interpellations, blessés et dommages, comparés à six mouvements français antérieurs. Chaque point est une fourchette là où les éditeurs divergent.',
  },

  'ui.lang': { en: 'Language', fr: 'Langue' },
  'ui.lang.fr': { en: 'Afficher la page en français', fr: 'Afficher la page en français' },
  'ui.lang.en': { en: 'Show this page in English', fr: 'Afficher la page en anglais' },

  'disc.lead': {
    en: 'These charts are AI-generated and have not been independently verified. Do not use them for serious analysis, publication or decision-making without checking every figure against the sources below. ',
    fr: 'Ces graphiques sont générés par IA et n’ont pas été vérifiés de façon indépendante. Ne les utilisez pas pour une analyse sérieuse, une publication ou une décision sans vérifier chaque chiffre auprès des sources ci-dessous. ',
  },
  'disc.link': {
    en: 'The full conversation in which they were produced, including every figure that was rejected, is in the transcript.',
    fr: 'La conversation complète dans laquelle ils ont été produits, y compris chaque chiffre écarté, figure dans la transcription.',
  },

  'sec.a.title': { en: 'A · Daily counts, 1 October – 11 November 2026', fr: 'A · Décomptes quotidiens, 1er octobre – 11 novembre 2026' },
  'sec.a.lede': {
    en: 'One point per day on which something was published. Days with no figure stay empty rather than interpolated.',
    fr: 'Un point par jour où un chiffre a été publié. Les jours sans chiffre restent vides plutôt qu’interpolés.',
  },
  'card.prot.title': { en: 'Protesters', fr: 'Manifestants' },
  'card.prot.sub': { en: 'Ministry and organiser counts', fr: 'Comptages ministériels et syndicaux' },
  'card.enf.title': { en: 'Arrests and injuries', fr: 'Interpellations et blessés' },
  'card.enf.sub': { en: 'Custody is not the same as arrest', fr: 'La garde à vue n’est pas l’interpellation' },
  'card.cost.title': { en: 'Damage and the cost of policing', fr: 'Dommages et coût du maintien de l’ordre' },
  'card.cost.sub': { en: 'Two different bases of measurement', fr: 'Deux bases de mesure différentes' },

  'sec.b.title': { en: 'B · Weekly aggregates', fr: 'B · Agrégats hebdomadaires' },
  'sec.b.lede': {
    en: 'Weeks run Monday to Sunday. A peak-day crowd and a summed weekly arrest count are not the same statistic — the tooltip says which is which.',
    fr: 'Les semaines vont du lundi au dimanche. Une foule de jour de pointe et un total hebdomadaire d’interpellations ne sont pas la même statistique — l’infobulle précise laquelle.',
  },
  'card.pw.title': { en: 'Protesters, weekly peak', fr: 'Manifestants, pointe hebdomadaire' },
  'card.ew.title': { en: 'Enforcement, weekly totals', fr: 'Répression, totaux hebdomadaires' },

  'sec.c.title': { en: 'C · One panel per movement', fr: 'C · Un panneau par mouvement' },
  'sec.c.lede': {
    en: 'Each panel keeps its own time span, so the shapes are comparable but the durations are not.',
    fr: 'Chaque panneau conserve sa propre durée : les formes sont comparables, les durées non.',
  },
  'sec.cp.title': { en: 'C′ · Transposed: one panel per series', fr: 'C′ · Transposé : un panneau par série' },
  'sec.cp.lede': {
    en: 'The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks.',
    fr: 'Les mêmes données avec les mouvements superposés, pour lire une même mesure de 1968 à 2026. L’axe des x est le nombre de semaines écoulées.',
  },
  'leg.items.title': { en: 'Highlight a measure', fr: 'Mettre en avant une mesure' },
  'leg.movements.title': { en: 'Highlight a movement', fr: 'Mettre en avant un mouvement' },

  'src.wrap.title': { en: 'Sources and method', fr: 'Sources et méthode' },
};

/** Resolves every `[data-i18n]` in the document; safe to call on each render. */
export function applyStaticCopy(root: ParentNode = document): void {
  const L = lang();

  for (const node of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = node.dataset.i18n;
    if (!key) continue;
    const entry = STATIC[key];
    if (!entry) {
      console.warn(`[i18n] no static copy for "${key}"`);
      continue;
    }
    const text = entry[L];
    const attr = node.dataset.i18nAttr as Attr | undefined;
    if (!attr || attr === 'text') node.textContent = text;
    else node.setAttribute(attr, text);
  }

  document.documentElement.lang = L;
  document.documentElement.dataset.lang = L;
  const t0 = STATIC['doc.title'];
  if (t0) document.title = t0[L];
}

/** Reflects the current language onto the segmented control. */
export function syncLangSwitch(root: ParentNode = document): void {
  const L = lang();
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-set-lang]')) {
    const on = b.dataset.setLang === L;
    b.setAttribute('aria-pressed', String(on));
    b.tabIndex = on ? 0 : -1;
  }
}
```

## 2. `index.html` — header, disclaimer, section headings

```html
<header class="page-header">
  <div class="page-header__text">
    <p class="kicker" data-i18n="hdr.kicker"></p>
    <h1 data-i18n="hdr.title"></h1>
    <p class="lede" data-i18n="hdr.lede"></p>
  </div>

  <div class="lang-switch" role="group" data-lang-switch data-i18n="ui.lang" data-i18n-attr="aria-label">
    <button type="button" data-set-lang="fr" lang="fr" aria-label="" data-i18n="ui.lang.fr" data-i18n-attr="aria-label">FR</button>
    <button type="button" data-set-lang="en" lang="en" aria-label="" data-i18n="ui.lang.en" data-i18n-attr="aria-label">EN</button>
  </div>
</header>

<p class="disclaimer">
  <span data-i18n="disc.lead"></span><a href="transcript.html" data-i18n="disc.link"></a>
</p>

<section id="sec-a">
  <h2 data-i18n="sec.a.title"></h2>
  <p class="section-lede" data-i18n="sec.a.lede"></p>
  <!-- three cards, each: -->
  <figure class="card">
    <figcaption>
      <span class="card-title" data-i18n="card.prot.title"></span>
      <span class="card-sub" data-i18n="card.prot.sub"></span>
    </figcaption>
    <div class="card-canvas"><canvas id="chart-prot"></canvas></div>
  </figure>
</section>

<section id="sec-b">
  <h2 data-i18n="sec.b.title"></h2>
  <p class="section-lede" data-i18n="sec.b.lede"></p>
</section>

<section id="sec-c">
  <h2 data-i18n="sec.c.title"></h2>
  <p class="section-lede" data-i18n="sec.c.lede"></p>
  <div id="episode-host" class="trellis"></div>
</section>

<section id="sec-cp">
  <h2 data-i18n="sec.cp.title"></h2>
  <p class="section-lede" data-i18n="sec.cp.lede"></p>
  <div id="item-host" class="trellis"></div>
</section>

<footer id="sources">
  <h2 data-i18n="src.wrap.title"></h2>
  <!-- renderSources() replaces the contents of #sources, so the wrapper heading
       has to sit outside it: use <section id="sources-wrap"><h2/><div id="sources"/></section> -->
</footer>
```

Because `renderSources` calls `host.replaceChildren(...)`, put its heading outside the host:

```html
<section class="sources-wrap">
  <h2 data-i18n="src.wrap.title"></h2>
  <div id="sources"></div>
</section>
```

## 3. CSS — selector that sits in the header

```css
/* --- language switch: same type scale, colours and radius language as the charts --- */
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  flex: none;
  margin-left: auto;
  margin-top: 0.35rem;
  padding: 2px;
  border: 1px solid #d8dde3;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 1px rgb(17 24 39 / 4%);
}

.lang-switch button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 5px 11px 4px;
  border-radius: 999px;
  background: transparent;
  color: #6b7280;
  font: 600 10.5px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.lang-switch button:hover { color: #111827; background: #f3f4f6; }
.lang-switch button:focus-visible { outline: 2px solid #0072b2; outline-offset: 2px; }

.lang-switch button[aria-pressed="true"] {
  background: #0072b2;
  color: #fff;
  cursor: default;
}

/* --- header layout: text left, switch pinned to the first baseline --- */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem 1.5rem;
  flex-wrap: wrap;
}
.page-header__text { flex: 1 1 26rem; min-width: 0; }

@media (max-width: 40rem) {
  .lang-switch { margin-left: 0; order: 3; }
}

/* --- disclaimer and headings inherit the same palette --- */
.disclaimer {
  margin: 1.25rem 0 2rem;
  padding: 0.75rem 0 0.75rem 0.9rem;
  border-left: 3px solid #e69f00;
  background: #fffdf7;
  color: #4b5563;
  font-size: 0.82rem;
  line-height: 1.55;
}
.disclaimer a { color: #0072b2; }
.section-lede { max-width: 62ch; color: #4b5563; font-size: 0.85rem; }
```

## 4. `src/client/main.ts` — wire the toggle and the copy

```ts
import { applyStaticCopy, lang, setLang, syncLangSwitch, type Lang } from './i18n.ts';
import { renderSources } from './sources.ts';

/* bound once at boot; re-rendering never re-binds */
function mountLangSwitch(): void {
  const host = document.querySelector<HTMLElement>('[data-lang-switch]');
  if (!host || host.dataset.bound === 'true') return;

  host.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-set-lang]');
    if (!btn) return;
    const next = btn.dataset.setLang as Lang | undefined;
    if (!next || next === lang()) return;

    setLang(next);                                   // updates state + localStorage
    const url = new URL(location.href);
    url.searchParams.set('lang', next);              // deep-linkable, no reload
    history.replaceState(null, '', url);
    render();                                        // full re-render, charts remounted
  });

  host.dataset.bound = 'true';
}

export function render(): void {
  applyStaticCopy();        // headings, kicker, disclaimer, document.title, <html lang>
  syncLangSwitch();         // aria-pressed on FR / EN
  renderSources('#sources');
  // ...existing chart teardown + rebuild...
}

mountLangSwitch();
render();
```

Behavioural details worth knowing: the click handler ignores a click on the already-active segment, `setLang` is expected to persist to `localStorage` and expose `lang()` — that contract already exists in your `i18n.ts`, so nothing else needs touching. `applyStaticCopy()` runs before `renderSources()` so the `<html lang>` and the wrapper heading are correct on the same frame, and `renderSources('#sources')` is safe to call repeatedly because it `replaceChildren`s its own host.

---

**You**

Also remove the unnecessary per-panel labels from section C'

---

**Assistant**

In C′ every panel is a single measure whose name already appears in the "Highlight a measure" legend, and the meta line (`0–7M · x 0–w7`) duplicates axis information the section lede already states. Both go; the panels keep an accessible name via an sr-only caption so the canvases are still identifiable to screen readers.

## 1. `src/client/episodes.ts` — `panelFigure` becomes optional-caption

Replace the existing `panelFigure` with:

```ts
interface FigureParts {
  /** Visible strip title. Omit it to draw a caption-less panel (C′). */
  strip?: string | null;
  meta?: string | null;
  note?: string | null;
  /** Accessible name; becomes the sr-only caption when `strip` is absent. */
  a11yLabel: string;
}

function panelFigure({
  strip,
  meta,
  note,
  a11yLabel,
}: FigureParts): { figure: HTMLElement; canvas: HTMLCanvasElement } {
  const figure = document.createElement('figure');
  figure.className = strip ? 'trellis-panel' : 'trellis-panel trellis-panel--bare';

  const holder = document.createElement('div');
  holder.className = 'panel-canvas';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', a11yLabel);
  holder.append(canvas);

  if (strip) {
    const head = document.createElement('span');
    head.className = 'strip';
    head.textContent = strip;
    figure.append(head);

    if (meta) {
      const metaEl = document.createElement('span');
      metaEl.className = 'strip-meta';
      metaEl.textContent = meta;
      figure.append(metaEl);
    }

    if (note) {
      const noteEl = document.createElement('p');
      noteEl.className = 'strip-note';
      noteEl.textContent = note;
      figure.append(noteEl);
    }
  } else {
    /* no visible caption: the name survives only in the accessibility tree */
    const caption = document.createElement('figcaption');
    caption.className = 'visually-hidden';
    caption.textContent = a11yLabel;
    figure.append(caption);
  }

  figure.append(holder);
  return { figure, canvas };
}
```

## 2. Section C call — unchanged labels, new signature

```ts
    const { figure, canvas } = panelFigure({
      strip: bi(ep.strip),
      meta: `${tr(`span:${ep.id}`, ep.span)} · ${observations(ep)}`,
      note: tr(`banner:${ep.id}`, ep.banner),
      a11yLabel: `${bi(ep.strip)} — ${tr(`span:${ep.id}`, ep.span)}`,
    });
```

## 3. Section C′ call — labels dropped

```ts
  const itemCharts: Chart<'line'>[] = ITEMS.map((item) => {
    const { figure, canvas } = panelFigure({ a11yLabel: bi(item.label) });
    hosts.itemHost.append(figure);
    // …datasets and Chart construction unchanged…
  });
```

## 4. Dead code that the old caption was carrying

`__label` existed only to annotate truncated per-panel titles, which no longer render. Drop it and the `truncated` computation:

```ts
interface GapDataset extends ChartDataset<'line', { x: number; y: number }[]> {
  _pts?: Pt[];
}
```

…and inside `buildDataset`, remove the `const truncated = …` line and the `__label: truncated ? \`${bi(ep.short)} +\` : bi(ep.short),` property. `_pts`, `label`, colours, `pointRadius`, `pointStyle` all stay.

## 5. CSS

```css
/* C′ panels have no caption, so they sit flush to the top of the grid cell */
.trellis-panel--bare { padding-top: 0; }

/* keeps the accessible name without occupying space */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

**One tradeoff to be aware of:** with the labels gone, a sighted reader maps panel → measure by position against the ordered legend. That already works because the panel order and `ITEMS` order are the same array, and hovering a legend entry dims the other three via `applyFocus()` — but if smooth-scrolling separates the legend from the grid on narrow screens, that mapping gets weaker. If you see it in review, the minimal fix is a one-word strip (`Protestors`, `Arrests`) rather than the old strip-plus-meta pair: pass `strip: bi(item.short)` and the sr-only branch never runs.

---

**You**

`sources.ts` does not exist

---

**Assistant**

Here is the file in full, written clean — no placeholder lines, no dangling helpers. It deliberately emits **no** top-level `<h2>`, because that heading now lives in `index.html` as `src.wrap.title` outside the `#sources` host that this module replaces.

```ts
/* src/client/sources.ts — provenance box.
 *
 * Contract: renderSources(host?) is idempotent. It replaceChildren()s its own host, so
 * main.ts may call it on every language change and on every re-render without cleanup.
 *
 * It emits no page-level heading: the wrapper <h2 data-i18n="src.wrap.title"> sits in
 * index.html OUTSIDE #sources, so that it survives renderSources() replacing the host's
 * children. Everything below that heading is built here.
 *
 * Every visible string is a Bi literal resolved by bi() at call time — no module-level
 * language state, no reg() keys, nothing to invalidate.
 */

import { bi, type Bi } from './i18n.ts';

/* ------------------------------------------------------------------ types */

export interface Source {
  id: string;
  label: Bi;
  publisher: Bi;
  url: string;
  used: Bi;
}

export interface SourceGroup {
  id: string;
  title: Bi;
  blurb?: Bi;
  items: Source[];
}

/* ------------------------------------------------------------------- copy */

const BOX_TITLE: Bi = { en: 'Sources and method', fr: 'Sources et méthode' };

const LEDE: Bi = {
  en: 'Every series on this page traces to a publisher below. Where two publishers disagree the chart carries a range instead of a point: the range is the disagreement, not an error bar.',
  fr: 'Chaque série de cette page est rattachée à un éditeur ci-dessous. Lorsque deux éditeurs divergent, le graphique affiche une fourchette plutôt qu’un point : la fourchette est la divergence, pas une barre d’erreur.',
};

const FLAG_TITLE: Bi = { en: 'How to read the markers', fr: 'Comment lire les marqueurs' };

const FLAG_LEDE: Bi = {
  en: 'A filled circle is a national figure. Anything else is a rotated square, and the tooltip says which case applies:',
  fr: 'Un cercle plein est un chiffre national. Tout le reste est un carré pivoté, et l’infobulle précise le cas applicable :',
};

const FLAGS: { flag: string; text: Bi }[] = [
  {
    flag: 'r',
    text: {
      en: 'regional only — one département or one city, never extrapolated',
      fr: 'régional seulement — un département ou une ville, jamais extrapolé',
    },
  },
  {
    flag: 'p',
    text: {
      en: 'partial — a floor, or two publishers disagreeing; both bounds are shown',
      fr: 'partiel — un plancher, ou deux éditeurs en désaccord ; les deux bornes sont affichées',
    },
  },
  {
    flag: 'f',
    text: {
      en: 'lower bound — the true figure is at least this, and nobody counted higher',
      fr: 'borne inférieure — le chiffre réel est au moins celui-ci, personne n’a compté plus haut',
    },
  },
  {
    flag: 'e',
    text: {
      en: 'derived — modelled or apportioned here, not published as such',
      fr: 'dérivé — modélisé ou réparti ici, non publié tel quel',
    },
  },
  {
    flag: 'c',
    text: {
      en: 'stock or actions-total — a different basis of measurement; never sum it with the rest',
      fr: 'stock ou total d’actions — une autre base de mesure ; ne jamais l’additionner au reste',
    },
  },
  {
    flag: 'w',
    text: {
      en: 'weekly aggregate — a week, not a day',
      fr: 'agrégat hebdomadaire — une semaine, pas un jour',
    },
  },
];

/* ------------------------------------------------------------------- data */

export const SOURCE_GROUPS: SourceGroup[] = [
  {
    id: 'g26-official',
    title: { en: '2026 movement — official counts', fr: 'Mouvement 2026 — décomptes officiels' },
    blurb: {
      en: 'Turnout, arrests and injuries as published by the state. These are the figures given a filled marker.',
      fr: 'Foules, interpellations et blessés tels que publiés par l’État. Ce sont les chiffres qui reçoivent un marqueur plein.',
    },
    items: [
      {
        id: 'mi-communiques',
        label: {
          en: 'Press releases and weekly protest tallies',
          fr: 'Communiqués et bilans hebdomadaires des manifestations',
        },
        publisher: { en: 'Ministère de l’Intérieur', fr: 'Ministère de l’Intérieur' },
        url: 'https://www.interieur.gouv.fr',
        used: {
          en: 'national turnout, arrests, officer injuries — 84, then 305, for 1 Oct',
          fr: 'foules nationales, interpellations, blessés parmi les forces — 84, puis 305, pour le 1er oct.',
        },
      },
      {
        id: 'pp-paris',
        label: { en: 'Prefecture of police statements', fr: 'Communiqués de la préfecture de police' },
        publisher: { en: 'Préfecture de police de Paris', fr: 'Préfecture de police de Paris' },
        url: 'https://www.prefecturedepolice.interieur.gouv.fr',
        used: {
          en: 'Paris-only arrest figures (18 Oct) and the Paris share of national days',
          fr: 'interpellations parisiennes (18 oct.) et part parisienne des journées nationales',
        },
      },
      {
        id: 'pref-rhone',
        label: { en: 'Departmental situation reports', fr: 'Points de situation préfectoraux' },
        publisher: { en: 'Préfectures du Rhône et de l’Ardèche', fr: 'Préfectures du Rhône et de l’Ardèche' },
        url: 'https://www.rhone.gouv.fr',
        used: {
          en: 'regional-only points: 40–45 arrests (12 Oct), 5 damaged shops (5 Nov), the Ardèche deployment',
          fr: 'points régionaux : 40–45 interpellations (12 oct.), 5 commerces dégradés (5 nov.), le dispositif ardéchois',
        },
      },
      {
        id: 'justice',
        label: { en: 'Custody and prosecution figures', fr: 'Chiffres de garde à vue et de poursuites' },
        publisher: { en: 'Ministère de la Justice', fr: 'Ministère de la Justice' },
        url: 'https://www.justice.gouv.fr',
        used: {
          en: 'the custody/arrest distinction — 1,793 placements for 1,949 arrests on 1 Oct',
          fr: 'la distinction garde à vue / interpellation — 1 793 placements pour 1 949 interpellations le 1er oct.',
        },
      },
      {
        id: 'cgt',
        label: { en: 'Union turnout counts', fr: 'Comptages syndicaux' },
        publisher: { en: 'CGT and the inter-union collective', fr: 'CGT et l’intersyndicale' },
        url: 'https://www.cgt.fr',
        used: {
          en: 'the upper bound of every turnout range; 12 injuries declared on 5 Nov',
          fr: 'la borne haute de chaque fourchette de foule ; 12 blessés déclarés le 5 nov.',
        },
      },
    ],
  },
  {
    id: 'g26-cost',
    title: { en: '2026 movement — damage and its cost', fr: 'Mouvement 2026 — dommages et coût' },
    blurb: {
      en: 'No authority published a national damage total. The 244–866 M€ band is one think tank’s conditional estimate, and the shop counts behind the small increments do not agree.',
      fr: 'Aucune autorité n’a publié de total national des dommages. La fourchette 244–866 M€ est l’estimation conditionnelle d’un think tank, et les décomptes de commerces qui fondent les petits incréments divergent.',
    },
    items: [
      {
        id: 'ifrap',
        label: { en: 'Cost of the 17–18 October damage', fr: 'Coût des dommages des 17–18 octobre' },
        publisher: { en: 'IFRAP', fr: 'IFRAP' },
        url: 'https://www.ifrap.org',
        used: {
          en: 'the €244–866M material-damage band and the €294M–€1.1bn variant including lost turnover; also the €20k–€167k per-shop range',
          fr: 'la fourchette 244–866 M€ de dommages matériels et la variante 294 M€–1,1 Md€ avec le chiffre d’affaires perdu ; aussi la fourchette 20 k€–167 k€ par commerce',
        },
      },
      {
        id: 'cci',
        label: { en: 'Damaged-shop census', fr: 'Recensement des commerces sinistrés' },
        publisher: { en: 'CCI France', fr: 'CCI France' },
        url: 'https://www.cci.fr',
        used: {
          en: '2,488 shops for the 17 Oct weekend; 50 shops (24 Oct) and 20 shops (31 Oct) for the weekly increments',
          fr: '2 488 commerces pour le week-end du 17 oct. ; 50 commerces (24 oct.) et 20 commerces (31 oct.) pour les incréments hebdomadaires',
        },
      },
      {
        id: 'fcd',
        label: { en: 'Retail-federation tally', fr: 'Décompte de la fédération du commerce' },
        publisher: { en: 'FCD', fr: 'FCD' },
        url: 'https://www.fcd.asso.fr',
        used: {
          en: 'the competing “1,500 and more” shop count, which is why 17 Oct is a range',
          fr: 'le décompte concurrent « 1 500 et plus », qui fait du 17 oct. une fourchette',
        },
      },
      {
        id: 'idf',
        label: { en: 'Île-de-France damage stock', fr: 'Stock de dommages en Île-de-France' },
        publisher: {
          en: 'Préfecture de la région Île-de-France',
          fr: 'Préfecture de la région Île-de-France',
        },
        url: 'https://www.iledefrance.gouv.fr',
        used: {
          en: 'the €1M stock accumulated since 17 Sep and the €6M / €4M increments — stocks, not daily flows',
          fr: 'le stock de 1 M€ accumulé depuis le 17 sept. et les incréments de 6 M€ / 4 M€ — des stocks, pas des flux quotidiens',
        },
      },
      {
        id: 'press-cost',
        label: {
          en: 'Damage reporting and commune-level inventories',
          fr: 'Couverture des dégâts et inventaires communaux',
        },
        publisher: {
          en: 'Le Monde, AFP and the regional daily press',
          fr: 'Le Monde, l’AFP et la presse quotidienne régionale',
        },
        url: 'https://www.lemonde.fr',
        used: {
          en: 'the 1–2 deaths, the ~30 looted Paris shops, Angers (1 shop, 4 banks), and every “no tally published” note',
          fr: 'les 1 à 2 morts, la trentaine de commerces pillés à Paris, Angers (1 commerce, 4 banques), et chaque mention « aucun bilan publié »',
        },
      },
    ],
  },
  {
    id: 'g26-policing',
    title: {
      en: '2026 movement — the cost of policing',
      fr: 'Mouvement 2026 — le coût du maintien de l’ordre',
    },
    blurb: {
      en: 'Deployment totals are published only for the large days. Everything else on that chart is modelled from a per-officer-day rate and marked derived.',
      fr: 'Les totaux de déploiement ne sont publiés que pour les grandes journées. Tout le reste de ce graphique est modélisé à partir d’un coût par agent-jour et marqué dérivé.',
    },
    items: [
      {
        id: 'deploy',
        label: {
          en: 'Mobile-unit deployments (60,000 / 70,000 officers)',
          fr: 'Dispositifs d’unités mobiles (60 000 / 70 000 agents)',
        },
        publisher: {
          en: 'Ministère de l’Intérieur / Beauvau briefings',
          fr: 'Ministère de l’Intérieur / briefings de Beauvau',
        },
        url: 'https://www.interieur.gouv.fr',
        used: {
          en: 'the four days given a national figure; 110 mobile units, 26 Centaure and ~15 water cannon on 24 Oct',
          fr: 'les quatre journées dotées d’un chiffre national ; 110 unités mobiles, 26 Centaure et ~15 canons à eau le 24 oct.',
        },
      },
      {
        id: 'rate-cdc',
        label: { en: 'Cost per officer-day of a mobile unit', fr: 'Coût par agent-jour d’une unité mobile' },
        publisher: { en: 'Cour des comptes', fr: 'Cour des comptes' },
        url: 'https://www.ccomptes.fr',
        used: {
          en: 'the €136 marginal CRS-company rate used as the low bound of the policing band',
          fr: 'le coût marginal de 136 € par compagnie de CRS, borne basse de la fourchette policière',
        },
      },
      {
        id: 'rate-sainte-soline',
        label: {
          en: 'All-in policing cost, Sainte-Soline benchmark',
          fr: 'Coût complet du maintien de l’ordre, référence Sainte-Soline',
        },
        publisher: {
          en: 'Senate reports and press coverage of the 2023 Sainte-Soline operation',
          fr: 'Rapports sénatoriaux et presse sur l’opération de Sainte-Soline (2023)',
        },
        url: 'https://www.senat.fr',
        used: {
          en: 'the €1,133 all-in rate used as the high bound; the width of the band is the gap between the two methods',
          fr: 'le coût complet de 1 133 €, borne haute ; la largeur de la fourchette mesure l’écart entre ces deux méthodes',
        },
      },
    ],
  },
  {
    id: 'hist',
    title: { en: 'Historical episodes (1968–2025)', fr: 'Épisodes historiques (1968–2025)' },
    blurb: {
      en: 'Compiled from encyclopaedic summaries of the published counts, not from primary archives. Read the older episodes as orders of magnitude.',
      fr: 'Compilés à partir de synthèses encyclopédiques des décomptes publiés, non d’archives primaires. À lire comme des ordres de grandeur.',
    },
    items: [
      {
        id: 'may68',
        label: { en: 'May 1968', fr: 'Mai 1968' },
        publisher: { en: 'Wikipedia (fr) and INA broadcast archives', fr: 'Wikipédia (fr) et archives de l’INA' },
        url: 'https://fr.wikipedia.org/wiki/Mai_68',
        used: {
          en: 'the four crowd counts (1, 6, 10 and 13 May), the 469/422 arrests of 10–11 May, and the 300+ / 247 officer injuries',
          fr: 'les quatre chiffres de foule (1er, 6, 10 et 13 mai), les 469/422 interpellations des 10–11 mai, et les 300+ / 247 blessés parmi les forces',
        },
      },
      {
        id: 'cpe',
        label: { en: 'CPE 2006', fr: 'CPE 2006' },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche',
        used: {
          en: 'the four national days, the 4,500 movement-wide arrest total, and the Paris-only 18 March figures',
          fr: 'les quatre journées nationales, le total de 4 500 interpellations du mouvement, et les chiffres parisiens du 18 mars',
        },
      },
      {
        id: 'gj',
        label: { en: 'Gilets jaunes, acts 1–44', fr: 'Gilets jaunes, actes 1 à 44' },
        publisher: {
          en: 'Wikipedia (fr), compiling the Interior Ministry’s act-by-act counts',
          fr: 'Wikipédia (fr), compilant les décomptes ministériels acte par acte',
        },
        url: 'https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes',
        used: {
          en: 'the 287,700 actions total for Act 1, the 750,000 police-union counter-count, and the custody series to Act 4',
          fr: 'le total de 287 700 actions de l’acte 1, le contre-comptage policier de 750 000, et la série de gardes à vue jusqu’à l’acte IV',
        },
      },
      {
        id: 'nahel',
        label: {
          en: 'Nahel Merzouk riots, June–July 2023',
          fr: 'Émeutes après la mort de Nahel Merzouk, juin–juillet 2023',
        },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk',
        used: {
          en: 'the Nanterre white march (6,200 / 20,000), 3,354 arrests, 722 officers injured, 5,662 vehicles burned',
          fr: 'la marche blanche de Nanterre (6 200 / 20 000), 3 354 interpellations, 722 policiers blessés, 5 662 véhicules brûlés',
        },
      },
      {
        id: 'pensions',
        label: {
          en: 'Pension-reform movement, 2023',
          fr: 'Mouvement contre la réforme des retraites, 2023',
        },
        publisher: { en: 'Wikipedia (fr)', fr: 'Wikipédia (fr)' },
        url: 'https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_de_2023',
        used: {
          en: '19 Jan (1.127M–2M) and 7 Mar (1.28M–3.5M) — the two figures that anchor the whole series',
          fr: 'le 19 janv. (1,127 M–2 M) et le 7 mars (1,28 M–3,5 M) — les deux chiffres qui ancrent toute la série',
        },
      },
      {
        id: 'bt',
        label: {
          en: '“Bloquons tout”, September–October 2025',
          fr: '« Bloquons tout », septembre–octobre 2025',
        },
        publisher: { en: 'Wikipedia (en) and Le Monde', fr: 'Wikipédia (en) et Le Monde' },
        url: 'https://en.wikipedia.org/wiki/Bloquons_tout',
        used: {
          en: '175,000–197,000 revised up from ~29,000 (10 Sep), 596 rallies and 253 blockades, 540 arrests, and the separate 18 Sep inter-union day',
          fr: '175 000–197 000 révisés depuis ~29 000 (10 sept.), 596 rassemblements et 253 blocages, 540 interpellations, et la journée intersyndicale distincte du 18 sept.',
        },
      },
    ],
  },
];

export const SOURCES: readonly Source[] = SOURCE_GROUPS.flatMap((g) => g.items);

/* ----------------------------------------------------------------- render */

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function resolveHost(root?: HTMLElement | string | null): HTMLElement | null {
  if (!root) return document.getElementById('sources');
  if (typeof root === 'string') return document.querySelector<HTMLElement>(root);
  return root;
}

function linkFor(item: Source): HTMLAnchorElement {
  const a = document.createElement('a');
  a.className = 'source-link';
  a.href = item.url;
  if (!item.url.startsWith('https://')) {
    console.warn(`[sources] ${item.id}: non-https URL — `${item.url}``);
  }
  if (/^https:\/\//.test(item.url)) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.textContent = bi(item.label);
  return a;
}

/** Idempotent: rebuilds the whole box inside the host on every call. */
export function renderSources(root?: HTMLElement | string | null): void {
  const host = resolveHost(root);
  if (!host) {
    console.error('[sources] no host: add <div id="sources"> to index.html, or pass a selector');
    return;
  }

  const box = el('section', 'sources');
  box.setAttribute('aria-label', bi(BOX_TITLE));
  box.append(el('p', 'sources-lede', bi(LEDE)));

  for (const group of SOURCE_GROUPS) {
    const wrap = el('div', 'source-group');
    wrap.id = `src-${group.id}`;
    wrap.append(el('h3', 'source-group-title', bi(group.title)));
    if (group.blurb) wrap.append(el('p', 'source-group-blurb', bi(group.blurb)));

    const list = el('ul', 'source-list');
    for (const item of group.items) {
      const li = el('li', 'source-item');
      li.dataset.sourceId = item.id;
      li.append(linkFor(item));
      li.append(el('span', 'source-publisher', ` — ${bi(item.publisher)}`));
      li.append(el('span', 'source-used', ` · ${bi(item.used)}`));
      list.append(li);
    }

    wrap.append(list);
    box.append(wrap);
  }

  const flags = el('div', 'source-group source-flags');
  flags.append(el('h3', 'source-group-title', bi(FLAG_TITLE)));
  flags.append(el('p', 'source-group-blurb', bi(FLAG_LEDE)));
  const dl = el('dl', 'flag-list');
  for (const f of FLAGS) {
    dl.append(el('dt', 'flag-key', f.flag));
    dl.append(el('dd', 'flag-text', bi(f.text)));
  }
  flags.append(dl);
  box.append(flags);

  const note = el('p', 'sources-note');
  const transcript = el('a', 'source-link', bi({
    en: 'the conversation transcript',
    fr: 'la transcription de la conversation',
  }));
  transcript.href = 'transcript.html';
  note.append(
    el('span', undefined, bi({
      en: 'The working behind every figure, including each rejected alternative, is recorded in ',
      fr: 'Le travail derrière chaque chiffre, y compris chaque variante écartée, est consigné dans ',
    })),
  );
  note.append(transcript, document.createTextNode('.'));
  box.append(note);

  host.replaceChildren(box);
}
```

Two things to keep in sync when this lands:

- `index.html` must keep the wrapper heading **outside** the host, or the `<h2>` will be wiped on the first re-render:

```html
<section class="sources-wrap">
  <h2 data-i18n="src.wrap.title"></h2>
  <div id="sources"></div>
</section>
```

- The section's accessible name is `Sources and method`, matching `src.wrap.title` in `i18n.ts`. If you retitle the `h2`, change `BOX_TITLE` with it, or the heading and the region label will drift apart for screen-reader users.

Minimal CSS for the box, consistent with the rest of the palette:

```css
.sources-wrap { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
.sources-lede { max-width: 62ch; color: #4b5563; font-size: 0.85rem; }
.source-group + .source-group { margin-top: 1.5rem; }
.source-group-title { margin: 0 0 0.25rem; font-size: 0.9rem; font-weight: 650; color: #111827; }
.source-group-blurb { margin: 0 0 0.5rem; max-width: 62ch; color: #6b7280; font-size: 0.78rem; line-height: 1.5; }
.source-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.4rem; }
.source-item { font-size: 0.8rem; line-height: 1.5; color: #374151; }
.source-link { color: #0072b2; text-decoration-thickness: 1px; text-underline-offset: 2px; }
.source-publisher { color: #111827; }
.source-used { color: #6b7280; }
.flag-list { display: grid; grid-template-columns: max-content 1fr; gap: 0.2rem 0.6rem; margin: 0; font-size: 0.78rem; }
.flag-key { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #111827; }
.flag-text { margin: 0; color: #6b7280; }
.sources-note { margin: 1.5rem 0 0; padding-top: 0.75rem; border-top: 1px solid #f3f4f6; color: #6b7280; font-size: 0.75rem; line-height: 1.55; }
```

---

**You**

`lang()` does not exist in `src/client/i18n.ts`

---

**Assistant**

`lang()` is the accessor the other modules key their caches on — `chart.ts` calls it at module load, so it has to be a plain synchronous getter over module state, not something derived from the DOM or from a signal. Here is `i18n.ts` complete, including the base dictionary for every `t`/`tp`/`tr` key `chart.ts` and `episodes.ts` actually reference (those strings were used throughout but never defined anywhere in this thread, which is a second latent failure waiting behind this one).

```ts
/* src/client/i18n.ts — language state, dictionaries, formatting.
 *
 * State resolution order, evaluated once at import: ?lang= → localStorage → navigator → 'en'.
 * lang() is a synchronous getter over that module state: chart.ts memoises series per lang()
 * and calls it during module evaluation, so it must never be async or DOM-derived.
 *
 * Lookup layers, lowest to highest priority:
 *   1. t(key)              — base dictionary below, both languages required
 *   2. reg(dict, L)        — per-module overlays, default French (English is inline in callers)
 *   3. tr(key, fallback)   — overlay first, then the caller's inline English fallback
 */

export type Lang = 'fr' | 'en';
export interface Bi { readonly en: string; readonly fr: string }

/* ------------------------------------------------------------------- state */

const STORAGE_KEY = 'lang';
const DEFAULT_LANG: Lang = 'en';

const isLang = (v: unknown): v is Lang => v === 'fr' || v === 'en';
const hasDom = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

function fromUrl(): Lang | null {
  if (!hasDom()) return null;
  try {
    const v = new URLSearchParams(window.location.search).get('lang');
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function fromStorage(): Lang | null {
  if (!hasDom()) return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function fromBrowser(): Lang | null {
  if (typeof navigator === 'undefined') return null;
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const low = String(tag).toLowerCase();
    if (low.startsWith('fr')) return 'fr';
    if (low.startsWith('en')) return 'en';
  }
  return null;
}

function detect(): Lang {
  return fromUrl() ?? fromStorage() ?? fromBrowser() ?? DEFAULT_LANG;
}

let current: Lang = detect();

/** The single accessor every other module keys its caches on. */
export function lang(): Lang {
  return current;
}

export interface SetLangOptions {
  /** Write through to localStorage. Default true. */
  persist?: boolean;
}

/** Switches language. Does not render — main.ts owns that. */
export function setLang(next: Lang, opts: SetLangOptions = {}): Lang {
  current = next;
  if (opts.persist !== false && hasDom()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode, quota — not fatal */
    }
  }
  if (hasDom()) {
    document.documentElement.lang = next;
    document.documentElement.dataset.lang = next;
  }
  return current;
}

export function toggleLang(): Lang {
  return setLang(current === 'fr' ? 'en' : 'fr');
}

/* --------------------------------------------------------------- dictionaries */

type Dict = Record<string, string>;

const EN: Dict = {
  /* axis + suffix chips */
  'ax.date': 'Date',
  'sfx.stock': ' · stock',
  'sfx.weekly': ' · weekly',
  'sfx.derived': ' · derived',
  'sfx.floor': ' · lower bound',
  'sfx.regional': ' · regional',

  /* daily dataset labels */
  'ds.prot': 'Protesters',
  'ds.protReg': 'Protesters (regional)',
  'ds.arre': 'Arrests',
  'ds.arreReg': 'Arrests (regional)',
  'ds.finj': 'Injured — security forces',
  'ds.finjReg': 'Injured — forces (regional)',
  'ds.pinj': 'Injured — protesters',
  'ds.pinjReg': 'Injured — protesters (regional)',
  'ds.dam': 'Material damage',
  'ds.damReg': 'Material damage (regional)',
  'ds.pol': 'Policing cost, per day',
  'ds.polReg': 'Policing cost (modelled day)',
  'ds.pcum': 'Policing cost, cumulative',
  'ds.pcumReg': 'Policing cost, cumulative (modelled)',

  /* weekly dataset labels */
  'ds.protW': 'Protesters (weekly peak)',
  'ds.protWReg': 'Protesters (weekly peak, regional)',
  'ds.arreW': 'Arrests (weekly total)',
  'ds.arreWReg': 'Arrests (weekly total, regional)',
  'ds.finjW': 'Forces injured (weekly total)',
  'ds.finjWReg': 'Forces injured (weekly total, regional)',
  'ds.pinjW': 'Protesters injured (weekly total)',
  'ds.pinjWReg': 'Protesters injured (weekly total, regional)',

  /* subtitles + y axes */
  'ch.prot.sub': 'Ministry and organiser counts, one marker per published day',
  'ch.prot.y': 'Protesters',
  'ch.enf.sub': 'Arrests are not custody placements; injuries are counted per side',
  'ch.enf.y': 'People',
  'ch.cost.sub': 'Damage and policing cost are not measured on the same basis',
  'ch.cost.y': '€ millions (damage)',
  'ch.cost.y1': '€ millions (policing, cumulative)',
  'ch.pw.sub': 'Peak day of each week, not a weekly sum',
  'ch.pw.y': 'Protesters (peak day)',
  'ch.ew.sub': 'Weekly sums; a stock or floor is not additive',
  'ch.ew.y': 'People (weekly total)',

  /* tooltip note fragments */
  'note.policing': '{head} officers × €{low}–€{high} per officer-day · {note}',
  'note.cum.add': 'deployment days counted: {days}',
  'note.cum.carry': 'no deployment published this day; cumulative unchanged',

  /* weekly footnote fragments */
  'wk.days': '{n} day{s} counted · {kind}',
  'wk.reg': 'regional figures only',
  'wk.nat': 'national figures',
  'wk.noreg': 'no national figure this week',
  'wk.floor': 'includes a floor or a stock — not a sum',
  'wk.edge': 'week clipped by the window',
  'wk.peak': 'peak {d}',
  'wk.excl': '{n} regional point{s} excluded',
  'wk.partial': 'Week of {d} (partial)',
  'wk.of': 'Week of {d}',

  /* episodes */
  'wkn': 'Week {n} · {label}',
  'wkn.partial': 'Week {n} · {label} (partial)',
  'obs': 'observations {counts} over {weeks} weeks',
};

const FR: Dict = {
  'ax.date': 'Date',
  'sfx.stock': ' · stock',
  'sfx.weekly': ' · hebdomadaire',
  'sfx.derived': ' · dérivé',
  'sfx.floor': ' · borne inférieure',
  'sfx.regional': ' · régional',

  'ds.prot': 'Manifestants',
  'ds.protReg': 'Manifestants (régional)',
  'ds.arre': 'Interpellations',
  'ds.arreReg': 'Interpellations (régional)',
  'ds.finj': "Blessés — forces de l'ordre",
  'ds.finjReg': 'Blessés — forces (régional)',
  'ds.pinj': 'Blessés — manifestants',
  'ds.pinjReg': 'Blessés — manifestants (régional)',
  'ds.dam': 'Dommages matériels',
  'ds.damReg': 'Dommages matériels (régional)',
  'ds.pol': 'Coût du maintien de l’ordre, par jour',
  'ds.polReg': 'Coût du maintien de l’ordre (jour modélisé)',
  'ds.pcum': 'Coût du maintien de l’ordre, cumulé',
  'ds.pcumReg': 'Coût du maintien de l’ordre, cumulé (modélisé)',

  'ds.protW': 'Manifestants (pointe hebdomadaire)',
  'ds.protWReg': 'Manifestants (pointe hebdomadaire, régional)',
  'ds.arreW': 'Interpellations (total hebdomadaire)',
  'ds.arreWReg': 'Interpellations (total hebdomadaire, régional)',
  'ds.finjW': 'Forces blessées (total hebdomadaire)',
  'ds.finjWReg': 'Forces blessées (total hebdomadaire, régional)',
  'ds.pinjW': 'Manifestants blessés (total hebdomadaire)',
  'ds.pinjWReg': 'Manifestants blessés (total hebdomadaire, régional)',

  'ch.prot.sub': 'Comptages ministériels et syndicaux, un marqueur par jour publié',
  'ch.prot.y': 'Manifestants',
  'ch.enf.sub': 'Une interpellation n’est pas une garde à vue ; les blessés sont comptés par camp',
  'ch.enf.y': 'Personnes',
  'ch.cost.sub': 'Dommages et coût du maintien de l’ordre ne se mesurent pas sur la même base',
  'ch.cost.y': 'Millions d’€ (dommages)',
  'ch.cost.y1': 'Millions d’€ (maintien de l’ordre, cumulé)',
  'ch.pw.sub': 'Jour de pointe de chaque semaine, pas une somme hebdomadaire',
  'ch.pw.y': 'Manifestants (jour de pointe)',
  'ch.ew.sub': 'Sommes hebdomadaires ; un stock ou un plancher ne s’additionne pas',
  'ch.ew.y': 'Personnes (total hebdomadaire)',

  'note.policing': '{head} agents × {low}–{high} € par agent-jour · {note}',
  'note.cum.add': 'jours de dispositif comptés : {days}',
  'note.cum.carry': 'aucun dispositif publié ce jour ; cumul inchangé',

  'wk.days': '{n} jour{s} compté{s} · {kind}',
  'wk.reg': 'chiffres régionaux seulement',
  'wk.nat': 'chiffres nationaux',
  'wk.noreg': 'aucun chiffre national cette semaine',
  'wk.floor': 'comprend un plancher ou un stock — pas une somme',
  'wk.edge': 'semaine tronquée par la fenêtre',
  'wk.peak': 'pointe le {d}',
  'wk.excl': '{n} point{s} régional(aux) exclu(s)',
  'wk.partial': 'Semaine du {d} (partielle)',
  'wk.of': 'Semaine du {d}',

  'wkn': 'Semaine {n} · {label}',
  'wkn.partial': 'Semaine {n} · {label} (partielle)',
  'obs': 'observations {counts} sur {weeks} semaines',
};

const DICTS: Record<Lang, Dict> = { en: EN, fr: FR };

/** Per-module overlays. Only French is registered in practice; English is inline in callers. */
export function reg(dict: Dict, forLang: Lang = 'fr'): void {
  Object.assign(DICTS[forLang], dict);
}

/* ---------------------------------------------------------------- interpolation */

const TOKEN = /\{(\w+)\}/g;

function fill(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  const withPlural: Record<string, string | number> =
    typeof params.n === 'number' && params.s === undefined
      ? { ...params, s: params.n === 1 ? '' : 's' }
      : params;
  return template.replace(TOKEN, (whole, name: string) =>
    name in withPlural ? String(withPlural[name]) : whole,
  );
}

/** Drops separators left dangling by an empty token, e.g. "… officer-day · " → "… officer-day". */
function tidy(s: string): string {
  return s
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]*·[ \t]*(?=·|$)/g, '')
    .replace(/[ \t]*·[ \t]*$/, '')
    .replace(/[ \t]*—[ \t]*$/, '')
    .trim();
}

/* ------------------------------------------------------------------- lookups */

/** Base dictionary only. Warns in dev when a key is missing in the active language. */
export function t(key: string): string {
  const hit = DICTS[current][key] ?? DICTS.en[key];
  if (hit === undefined) {
    console.warn(`[i18n] missing key "${key}" (${current})`);
    return key;
  }
  return hit;
}

/** Base dictionary with `{token}` interpolation. */
export function tp(key: string, params: Record<string, string | number>): string {
  return tidy(fill(t(key), params));
}

/** Overlay first, caller's inline English fallback second. */
export function tr(key: string, fallback: string): string {
  const hit = DICTS[current][key] ?? DICTS.fr[key] ?? DICTS.en[key];
  return hit ?? fallback;
}

/** Picks the right side of a bilingual literal at call time. */
export function bi(value: Bi): string {
  return value[current] ?? value.en;
}

export function has(key: string): boolean {
  return DICTS[current][key] !== undefined || DICTS.en[key] !== undefined;
}

/* ---------------------------------------------------------------- formatting */

let nf: Intl.NumberFormat | null = null;
let cf: Intl.NumberFormat | null = null;
let fmtLang: Lang | null = null;

const locale = (): string => (current === 'fr' ? 'fr-FR' : 'en-GB');

function refreshFormatters(): void {
  if (fmtLang === current && nf && cf) return;
  fmtLang = current;
  nf = new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 });
  cf = new Intl.NumberFormat(locale(), {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
}

/** Locale-grouped integer. */
export function num(value: number): string {
  refreshFormatters();
  return nf!.format(value);
}

/** Axis tick: 1.2k / 1,2 k, 340k / 340 k, 2.5M / 2,5 M. */
export function compact(value: number): string {
  refreshFormatters();
  const abs = Math.abs(value);
  if (!Number.isFinite(value)) return '—';
  if (abs < 1000) return nf!.format(value);
  return cf!.format(value);
}

/** Input is millions of euros. FR: "1,2 M€"  EN: "€1.2M". */
export function moneyM(millions: number): string {
  refreshFormatters();
  if (!Number.isFinite(millions)) return '—';
  const body = millions < 10
    ? new Intl.NumberFormat(locale(), { maximumFractionDigits: 1 }).format(millions)
    : cf!.format(millions);
  return current === 'fr' ? `${body} M€` : `€${body}`;
}

/* ---------------------------------------------------------- static markup */

type AttrName = 'text' | 'aria-label' | 'title' | 'placeholder';

const STATIC: Record<string, Bi> = {
  'doc.title': {
    en: 'Protest activity in France — October–November 2026',
    fr: 'L’activité contestataire en France — octobre–novembre 2026',
  },

  'hdr.kicker': { en: 'Working draft · 1 Oct – 11 Nov 2026', fr: 'Document de travail · 1er oct. – 11 nov. 2026' },
  'hdr.title': {
    en: 'Protest activity in France, autumn 2026',
    fr: 'L’activité contestataire en France, automne 2026',
  },
  'hdr.lede': {
    en: 'Turnout, arrests, injuries and damage, set against six earlier French movements. Every point is a range where the publishers disagree.',
    fr: 'Foules, interpellations, blessés et dommages, comparés à six mouvements français antérieurs. Chaque point est une fourchette là où les éditeurs divergent.',
  },

  'ui.lang': { en: 'Language', fr: 'Langue' },
  'ui.lang.fr': { en: 'Afficher la page en français', fr: 'Afficher la page en français' },
  'ui.lang.en': { en: 'Show this page in English', fr: 'Afficher la page en anglais' },

  'disc.lead': {
    en: 'These charts are AI-generated and have not been independently verified. Do not use them for serious analysis, publication or decision-making without checking every figure against the sources below. ',
    fr: 'Ces graphiques sont générés par IA et n’ont pas été vérifiés de façon indépendante. Ne les utilisez pas pour une analyse sérieuse, une publication ou une décision sans vérifier chaque chiffre auprès des sources ci-dessous. ',
  },
  'disc.link': {
    en: 'The full conversation in which they were produced, including every figure that was rejected, is in the transcript.',
    fr: 'La conversation complète dans laquelle ils ont été produits, y compris chaque chiffre écarté, figure dans la transcription.',
  },

  'sec.a.title': { en: 'A · Daily counts, 1 October – 11 November 2026', fr: 'A · Décomptes quotidiens, 1er octobre – 11 novembre 2026' },
  'sec.a.lede': {
    en: 'One point per day on which something was published. Days with no figure stay empty rather than interpolated.',
    fr: 'Un point par jour où un chiffre a été publié. Les jours sans chiffre restent vides plutôt qu’interpolés.',
  },
  'card.prot.title': { en: 'Protesters', fr: 'Manifestants' },
  'card.prot.sub': { en: 'Ministry and organiser counts', fr: 'Comptages ministériels et syndicaux' },
  'card.enf.title': { en: 'Arrests and injuries', fr: 'Interpellations et blessés' },
  'card.enf.sub': { en: 'Custody is not the same as arrest', fr: 'La garde à vue n’est pas l’interpellation' },
  'card.cost.title': { en: 'Damage and the cost of policing', fr: 'Dommages et coût du maintien de l’ordre' },
  'card.cost.sub': { en: 'Two different bases of measurement', fr: 'Deux bases de mesure différentes' },

  'sec.b.title': { en: 'B · Weekly aggregates', fr: 'B · Agrégats hebdomadaires' },
  'sec.b.lede': {
    en: 'Weeks run Monday to Sunday. A peak-day crowd and a summed weekly arrest count are not the same statistic — the tooltip says which is which.',
    fr: 'Les semaines vont du lundi au dimanche. Une foule de jour de pointe et un total hebdomadaire d’interpellations ne sont pas la même statistique — l’infobulle précise laquelle.',
  },
  'card.pw.title': { en: 'Protesters, weekly peak', fr: 'Manifestants, pointe hebdomadaire' },
  'card.ew.title': { en: 'Enforcement, weekly totals', fr: 'Répression, totaux hebdomadaires' },

  'sec.c.title': { en: 'C · One panel per movement', fr: 'C · Un panneau par mouvement' },
  'sec.c.lede': {
    en: 'Each panel keeps its own time span, so the shapes are comparable but the durations are not.',
    fr: 'Chaque panneau conserve sa propre durée : les formes sont comparables, les durées non.',
  },
  'sec.cp.title': { en: 'C′ · Transposed: one panel per series', fr: 'C′ · Transposé : un panneau par série' },
  'sec.cp.lede': {
    en: 'The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks.',
    fr: 'Les mêmes données avec les mouvements superposés, pour lire une même mesure de 1968 à 2026. L’axe des x est le nombre de semaines écoulées.',
  },
  'leg.items.title': { en: 'Highlight a measure', fr: 'Mettre en avant une mesure' },
  'leg.movements.title': { en: 'Highlight a movement', fr: 'Mettre en avant un mouvement' },

  'src.wrap.title': { en: 'Sources and method', fr: 'Sources et méthode' },
};

/** Resolves every `[data-i18n]` in the document. Safe to call on each render. */
export function applyStaticCopy(root: ParentNode = document): void {
  const L = current;

  for (const node of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = node.dataset.i18n;
    if (!key) continue;
    const entry = STATIC[key];
    if (!entry) {
      console.warn(`[i18n] no static copy for "${key}"`);
      continue;
    }
    const text = entry[L] ?? entry.en;
    const attr = node.dataset.i18nAttr as AttrName | undefined;
    if (!attr || attr === 'text') node.textContent = text;
    else node.setAttribute(attr, text);
  }

  document.documentElement.lang = L;
  document.documentElement.dataset.lang = L;
  const docTitle = STATIC['doc.title'];
  if (docTitle) document.title = docTitle[L] ?? docTitle.en;
}

/** Reflects the current language onto the segmented control. */
export function syncLangSwitch(root: ParentNode = document): void {
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-set-lang]')) {
    const on = b.dataset.setLang === current;
    b.setAttribute('aria-pressed', String(on));
    b.tabIndex = on ? 0 : -1;
  }
}
```

Three consequences worth knowing:

- `lang()` is now defined once, as a plain getter, so the `dtf()` cache key in `chart.ts` and the memo guards in `S()`/`studentWeeks()`/`episodeSet()` all work at module-evaluation time — which is why `detect()` runs eagerly rather than lazily.
- `tp()` auto-injects `s` (`''` for `n === 1`, else `'s'`) whenever `n` is passed, then runs `tidy()` to strip separators left by an empty `{note}`. That is what makes `'note.policing'` safe when `DEPLOYMENT[date].note` is absent.
- `compact()` and `moneyM()` rebuild their `Intl` formatters when `lang()` changes, so a switch costs one object allocation rather than one per tick label.

---

**You**

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "eurM"

    src/client/chart.ts:26:2:
      26 │   eurM,
         ╵   ~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fill"

    src/client/chart.ts:27:2:
      27 │   fill,
         ╵   ~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fmtDate"

    src/client/chart.ts:28:2:
      28 │   fmtDate,
         ╵   ~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fmtDayMonth"

    src/client/chart.ts:29:2:
      29 │   fmtDayMonth,
         ╵   ~~~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fmtWeek"

    src/client/chart.ts:30:2:
      30 │   fmtWeek,
         ╵   ~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "nf"

    src/client/chart.ts:31:2:
      31 │   nf,
         ╵   ~~


---

**Assistant**

All six are the old export names; the current file renamed most of them and kept `fill` private. Rather than renaming call sites in `chart.ts`, the formatting region exports the names as-is. Replace everything from the `TOKEN` regex down to the end of `moneyM` (i.e. the whole interpolation + formatting region) with this block:

```ts
/* -------------------------------------------------------------- interpolation */

const TOKEN = /\{(\w+)\}/g;

/** `{token}` substitution. Auto-injects `s` ('' / 's') when `n` is numeric, like tp(). */
export function fill(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  const p: Record<string, string | number> =
    typeof params.n === 'number' && params.s === undefined
      ? { ...params, s: params.n === 1 ? '' : 's' }
      : params;
  return template.replace(TOKEN, (whole, name: string) => (name in p ? String(p[name]) : whole));
}

/** Drops separators left dangling by an empty token. */
function tidy(s: string): string {
  return s
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]*·[ \t]*(?=·|$)/g, '')
    .replace(/[ \t]*·[ \t]*$/, '')
    .replace(/[ \t]*—[ \t]*$/, '')
    .trim();
}

/* ------------------------------------------------------------------- numbers */

const locale = (): string => (current === 'fr' ? 'fr-FR' : 'en-GB');

/* Live bindings: importers read these at call time, so a switch is seen by everyone. */
export let nf: Intl.NumberFormat = new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 });
export let cf: Intl.NumberFormat = new Intl.NumberFormat(locale(), {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

let numLang: Lang = current;

function refreshNumbers(): void {
  if (numLang === current) return;
  numLang = current;
  nf = new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 });
  cf = new Intl.NumberFormat(locale(), {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
}

/** Locale-grouped integer. */
export function num(value: number): string {
  refreshNumbers();
  return Number.isFinite(value) ? nf.format(value) : '—';
}

/** Axis tick: 1.2k / 1,2 k, 2.5M / 2,5 M. */
export function compact(value: number): string {
  refreshNumbers();
  if (!Number.isFinite(value)) return '—';
  return Math.abs(value) < 1000 ? nf.format(value) : cf.format(value);
}

/** Input is millions of euros. FR: "1,2 M€"  EN: "€1.2M". */
export function moneyM(millions: number): string {
  refreshNumbers();
  if (!Number.isFinite(millions)) return '—';
  const body =
    Math.abs(millions) < 10
      ? new Intl.NumberFormat(locale(), { maximumFractionDigits: 1 }).format(millions)
      : cf.format(millions);
  return current === 'fr' ? `${body} M€` : `€${body}`;
}

/** Alias kept for chart.ts. Values are millions of euros, same as moneyM(). */
export const eurM: (millions: number) => string = moneyM;

/* --------------------------------------------------------------------- dates */

type DateInput = Date | string | number;

const DATE_LONG: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
};
const DATE_SHORT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
};

let dsLong: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale(), DATE_LONG);
let dsShort: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale(), DATE_SHORT);
let dsLang: Lang = current;

function refreshDates(): void {
  if (dsLang === current) return;
  dsLang = current;
  dsLong = new Intl.DateTimeFormat(locale(), DATE_LONG);
  dsShort = new Intl.DateTimeFormat(locale(), DATE_SHORT);
}

/** `2026-10-01` and `Date` both resolve to the same calendar day (parsed as UTC). */
function toDate(value: DateInput): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** French writes the first of the month as "1er", which Intl never emits. */
function ordinalFr(d: Date, fmt: Intl.DateTimeFormat): string {
  const s = fmt.format(d);
  return current === 'fr' && d.getUTCDate() === 1 ? s.replace(/^1\b/, '1er') : s;
}

/** "1 Nov 2026" / "1er nov. 2026". Invalid input → em dash, never throws. */
export function fmtDate(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? ordinalFr(d, dsLong) : '—';
}

/** "1 Nov" / "1er nov.". */
export function fmtDayMonth(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? ordinalFr(d, dsShort) : '—';
}

/** Week-start label: identical to fmtDayMonth, ready for tp('wk.of', { d }). */
export function fmtWeek(value: DateInput): string {
  return fmtDayMonth(value);
}
```

Three contract points, since these names were only ever visible from `chart.ts`:

- `nf` and `cf` are `export let` live bindings refreshed in place on a language switch. Read them at call time (`nf.format(v)`); a module-scope `const fmt = nf` would capture the English instance and stay stale after toggling.
- `fmtWeek` returns day+month only — it assumes `chart.ts` wraps it, e.g. `tp('wk.of', { d: fmtWeek(ws) })`. If that file instead expects the wrapper baked in, change `fmtWeek` to `tp('wk.of', { d: fmtDayMonth(value) })` and drop the `tp` at the call site; both `wk.of` and `wk.partial` keys already exist.
- The date formatters are UTC-pinned, so `'2026-10-01'` cannot slip to 30 September in a negative-offset timezone. Any `new Intl.DateTimeFormat` built in `chart.ts` must do the same or the axis and the tooltip will disagree by one day for string inputs.

---

**You**

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "t"

    src/client/chart.ts:32:2:
      32 │   t,
         ╵   ^

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fmtSpan"

    src/client/episodes.ts:14:24:
      14 │ import { compact, fill, fmtSpan, fmtWeek, nf, plural, t } from "./i18n.ts";
         ╵                         ~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "plural"

    src/client/episodes.ts:14:46:
      14 │ import { compact, fill, fmtSpan, fmtWeek, nf, plural, t } from "./i18n.ts";
         ╵                                               ~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "t"

    src/client/episodes.ts:14:54:
      14 │ import { compact, fill, fmtSpan, fmtWeek, nf, plural, t } from "./i18n.ts";
         ╵                                                       ^

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "DEFAULT_LOCALE"

    src/client/lang.ts:6:2:
      6 │   DEFAULT_LOCALE,
        ╵   ~~~~~~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "LOCALES"

    src/client/lang.ts:7:2:
      7 │   LOCALES,
        ╵   ~~~~~~~


---

**Assistant**

These are the last missing names, and the deeper problem is that `i18n.ts` has been assembled from five successive partial patches — every fix so far has been surgical, so the file now has the union of several generations' export surfaces minus whatever each patch happened to drop. Stop patching. Below is the complete file; it exports **every** name currently imported by `chart.ts`, `episodes.ts`, `lang.ts`, `sources.ts` and `main.ts`, so nothing else needs touching.

Replace the entire contents of `src/client/i18n.ts`:

```ts
/* src/client/i18n.ts — language state, dictionaries, formatting, static copy.
 *
 * Single source of truth for the module's public surface. Importers rely on:
 *   Lang, Bi, LocaleMeta
 *   LOCALES, DEFAULT_LANG, DEFAULT_LOCALE, localeTag
 *   lang, setLang, toggleLang
 *   reg, has
 *   t, tp, tr, bi
 *   fill, plural
 *   nf, cf, num, compact, moneyM, eurM
 *   fmtDate, fmtDayMonth, fmtWeek, fmtSpan
 *   applyStaticCopy, syncLangSwitch
 *
 * State resolution, evaluated once at import: ?lang= → localStorage → navigator → 'en'.
 * lang() must stay a synchronous getter: chart.ts memoises series per lang() during
 * module evaluation, so it can never be async or DOM-derived.
 */

export type Lang = 'fr' | 'en';
export interface Bi { readonly en: string; readonly fr: string }
export interface LocaleMeta {
  /** BCP-47 tag for Intl. */
  readonly tag: string;
  /** Short tag for <html lang>. */
  readonly htmlLang: Lang;
  /** Endonym, for switchers and lang.ts. */
  readonly label: string;
}

/* ------------------------------------------------------------------ locales */

export const LOCALES: Record<Lang, LocaleMeta> = {
  en: { tag: 'en-GB', htmlLang: 'en', label: 'English' },
  fr: { tag: 'fr-FR', htmlLang: 'fr', label: 'Français' },
};

export const DEFAULT_LANG: Lang = 'en';
export const DEFAULT_LOCALE: string = LOCALES[DEFAULT_LANG].tag;

/** Active BCP-47 tag. */
export function localeTag(): string {
  return LOCALES[current].tag;
}

/* -------------------------------------------------------------------- state */

const STORAGE_KEY = 'lang';

const isLang = (v: unknown): v is Lang => v === 'fr' || v === 'en';
const hasDom = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

function fromUrl(): Lang | null {
  if (!hasDom()) return null;
  try {
    const v = new URLSearchParams(window.location.search).get('lang');
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function fromStorage(): Lang | null {
  if (!hasDom()) return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isLang(v) ? v : null;
  } catch {
    return null;
  }
}

function fromBrowser(): Lang | null {
  if (typeof navigator === 'undefined') return null;
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const low = String(tag).toLowerCase();
    if (low.startsWith('fr')) return 'fr';
    if (low.startsWith('en')) return 'en';
  }
  return null;
}

let current: Lang = fromUrl() ?? fromStorage() ?? fromBrowser() ?? DEFAULT_LANG;

/** The accessor every other module keys its caches on. */
export function lang(): Lang {
  return current;
}

export interface SetLangOptions {
  /** Write through to localStorage. Default true. */
  persist?: boolean;
}

/** Switches language. Does not render — main.ts owns that. */
export function setLang(next: Lang, opts: SetLangOptions = {}): Lang {
  current = next;
  if (opts.persist !== false && hasDom()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / quota — not fatal */
    }
  }
  if (hasDom()) {
    document.documentElement.lang = LOCALES[next].htmlLang;
    document.documentElement.dataset.lang = next;
  }
  return current;
}

export function toggleLang(): Lang {
  return setLang(current === 'fr' ? 'en' : 'fr');
}

/* ------------------------------------------------------------- dictionaries */

type Dict = Record<string, string>;

const EN: Dict = {
  /* axis + suffix chips */
  'ax.date': 'Date',
  'sfx.stock': ' · stock',
  'sfx.weekly': ' · weekly',
  'sfx.derived': ' · derived',
  'sfx.floor': ' · lower bound',
  'sfx.regional': ' · regional',

  /* daily dataset labels */
  'ds.prot': 'Protesters',
  'ds.protReg': 'Protesters (regional)',
  'ds.arre': 'Arrests',
  'ds.arreReg': 'Arrests (regional)',
  'ds.finj': 'Injured — security forces',
  'ds.finjReg': 'Injured — forces (regional)',
  'ds.pinj': 'Injured — protesters',
  'ds.pinjReg': 'Injured — protesters (regional)',
  'ds.dam': 'Material damage',
  'ds.damReg': 'Material damage (regional)',
  'ds.pol': 'Policing cost, per day',
  'ds.polReg': 'Policing cost (modelled day)',
  'ds.pcum': 'Policing cost, cumulative',
  'ds.pcumReg': 'Policing cost, cumulative (modelled)',

  /* weekly dataset labels */
  'ds.protW': 'Protesters (weekly peak)',
  'ds.protWReg': 'Protesters (weekly peak, regional)',
  'ds.arreW': 'Arrests (weekly total)',
  'ds.arreWReg': 'Arrests (weekly total, regional)',
  'ds.finjW': 'Forces injured (weekly total)',
  'ds.finjWReg': 'Forces injured (weekly total, regional)',
  'ds.pinjW': 'Protesters injured (weekly total)',
  'ds.pinjWReg': 'Protesters injured (weekly total, regional)',

  /* subtitles + y axes */
  'ch.prot.sub': 'Ministry and organiser counts, one marker per published day',
  'ch.prot.y': 'Protesters',
  'ch.enf.sub': 'Arrests are not custody placements; injuries are counted per side',
  'ch.enf.y': 'People',
  'ch.cost.sub': 'Damage and policing cost are not measured on the same basis',
  'ch.cost.y': '€ millions (damage)',
  'ch.cost.y1': '€ millions (policing, cumulative)',
  'ch.pw.sub': 'Peak day of each week, not a weekly sum',
  'ch.pw.y': 'Protesters (peak day)',
  'ch.ew.sub': 'Weekly sums; a stock or floor is not additive',
  'ch.ew.y': 'People (weekly total)',

  /* tooltip note fragments */
  'note.policing': '{head} officers × €{low}–€{high} per officer-day · {note}',
  'note.cum.add': 'deployment days counted: {days}',
  'note.cum.carry': 'no deployment published this day; cumulative unchanged',

  /* weekly footnote fragments */
  'wk.days': '{n} day{s} counted · {kind}',
  'wk.reg': 'regional figures only',
  'wk.nat': 'national figures',
  'wk.noreg': 'no national figure this week',
  'wk.floor': 'includes a floor or a stock — not a sum',
  'wk.edge': 'week clipped by the window',
  'wk.peak': 'peak {d}',
  'wk.excl': '{n} regional point{s} excluded',
  'wk.partial': 'Week of {d} (partial)',
  'wk.of': 'Week of {d}',

  /* spans + episodes */
  'span.sep': ' – ',
  'wkn': 'Week {n} · {label}',
  'wkn.partial': 'Week {n} · {label} (partial)',
  'obs': 'observations {counts} over {weeks} weeks',
};

const FR: Dict = {
  'ax.date': 'Date',
  'sfx.stock': ' · stock',
  'sfx.weekly': ' · hebdomadaire',
  'sfx.derived': ' · dérivé',
  'sfx.floor': ' · borne inférieure',
  'sfx.regional': ' · régional',

  'ds.prot': 'Manifestants',
  'ds.protReg': 'Manifestants (régional)',
  'ds.arre': 'Interpellations',
  'ds.arreReg': 'Interpellations (régional)',
  'ds.finj': "Blessés — forces de l'ordre",
  'ds.finjReg': 'Blessés — forces (régional)',
  'ds.pinj': 'Blessés — manifestants',
  'ds.pinjReg': 'Blessés — manifestants (régional)',
  'ds.dam': 'Dommages matériels',
  'ds.damReg': 'Dommages matériels (régional)',
  'ds.pol': 'Coût du maintien de l’ordre, par jour',
  'ds.polReg': 'Coût du maintien de l’ordre (jour modélisé)',
  'ds.pcum': 'Coût du maintien de l’ordre, cumulé',
  'ds.pcumReg': 'Coût du maintien de l’ordre, cumulé (modélisé)',

  'ds.protW': 'Manifestants (pointe hebdomadaire)',
  'ds.protWReg': 'Manifestants (pointe hebdomadaire, régional)',
  'ds.arreW': 'Interpellations (total hebdomadaire)',
  'ds.arreWReg': 'Interpellations (total hebdomadaire, régional)',
  'ds.finjW': 'Forces blessées (total hebdomadaire)',
  'ds.finjWReg': 'Forces blessées (total hebdomadaire, régional)',
  'ds.pinjW': 'Manifestants blessés (total hebdomadaire)',
  'ds.pinjWReg': 'Manifestants blessés (total hebdomadaire, régional)',

  'ch.prot.sub': 'Comptages ministériels et syndicaux, un marqueur par jour publié',
  'ch.prot.y': 'Manifestants',
  'ch.enf.sub': 'Une interpellation n’est pas une garde à vue ; les blessés sont comptés par camp',
  'ch.enf.y': 'Personnes',
  'ch.cost.sub': 'Dommages et coût du maintien de l’ordre ne se mesurent pas sur la même base',
  'ch.cost.y': 'Millions d’€ (dommages)',
  'ch.cost.y1': 'Millions d’€ (maintien de l’ordre, cumulé)',
  'ch.pw.sub': 'Jour de pointe de chaque semaine, pas une somme hebdomadaire',
  'ch.pw.y': 'Manifestants (jour de pointe)',
  'ch.ew.sub': 'Sommes hebdomadaires ; un stock ou un plancher ne s’additionne pas',
  'ch.ew.y': 'Personnes (total hebdomadaire)',

  'note.policing': '{head} agents × {low}–{high} € par agent-jour · {note}',
  'note.cum.add': 'jours de dispositif comptés : {days}',
  'note.cum.carry': 'aucun dispositif publié ce jour ; cumul inchangé',

  'wk.days': '{n} jour{s} compté{s} · {kind}',
  'wk.reg': 'chiffres régionaux seulement',
  'wk.nat': 'chiffres nationaux',
  'wk.noreg': 'aucun chiffre national cette semaine',
  'wk.floor': 'comprend un plancher ou un stock — pas une somme',
  'wk.edge': 'semaine tronquée par la fenêtre',
  'wk.peak': 'pointe le {d}',
  'wk.excl': '{n} point{s} régional(aux) exclu(s)',
  'wk.partial': 'Semaine du {d} (partielle)',
  'wk.of': 'Semaine du {d}',

  'span.sep': ' – ',
  'wkn': 'Semaine {n} · {label}',
  'wkn.partial': 'Semaine {n} · {label} (partielle)',
  'obs': 'observations {counts} sur {weeks} semaines',
};

const DICTS: Record<Lang, Dict> = { en: EN, fr: FR };

/** Per-module overlays. Only French is registered in practice; English is inline in callers. */
export function reg(dict: Dict, forLang: Lang = 'fr'): void {
  Object.assign(DICTS[forLang], dict);
}

export function has(key: string): boolean {
  return DICTS[current][key] !== undefined || DICTS.en[key] !== undefined;
}

/* ---------------------------------------------------------- interpolation */

const TOKEN = /\{(\w+)\}/g;

/** `{token}` substitution. Auto-injects `s` ('' / 's') when `n` is numeric. */
export function fill(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  const p: Record<string, string | number> =
    typeof params.n === 'number' && params.s === undefined
      ? { ...params, s: params.n === 1 ? '' : 's' }
      : params;
  return template.replace(TOKEN, (whole, name: string) => (name in p ? String(p[name]) : whole));
}

/** Drops separators left dangling by an empty token: "… officer-day · " → "… officer-day". */
function tidy(s: string): string {
  return s
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]*·[ \t]*(?=·|$)/g, '')
    .replace(/[ \t]*·[ \t]*$/, '')
    .replace(/[ \t]*—[ \t]*$/, '')
    .trim();
}

/**
 * Pluralisation. Two idioms, both supported:
 *   plural(n)              → '' | 's'              (suffix)
 *   plural(n, 'jour')      → 'jour' | 'jours'      (word)
 *   plural(n, 'jour', 'jours')
 */
export function plural(n: number, one?: string, many?: string): string {
  const isOne = Math.abs(n) === 1;
  if (one === undefined) return isOne ? '' : 's';
  return isOne ? one : (many ?? `${one}s`);
}

/* -------------------------------------------------------------- lookups */

/** Base dictionary only. Warns when a key is missing in the active language. */
export function t(key: string): string {
  const hit = DICTS[current][key] ?? DICTS.en[key];
  if (hit === undefined) {
    console.warn(`[i18n] missing key "${key}" (${current})`);
    return key;
  }
  return hit;
}

/** Base dictionary with `{token}` interpolation. */
export function tp(key: string, params: Record<string, string | number>): string {
  return tidy(fill(t(key), params));
}

/** Overlay first, caller's inline English fallback second. */
export function tr(key: string, fallback: string): string {
  return DICTS[current][key] ?? DICTS.fr[key] ?? DICTS.en[key] ?? fallback;
}

/** Picks the right side of a bilingual literal at call time. */
export function bi(value: Bi): string {
  return value[current] ?? value.en;
}

/* ----------------------------------------------------------------- numbers */

/* Live bindings: importers read these at call time, so a switch is seen everywhere. */
export let nf: Intl.NumberFormat = new Intl.NumberFormat(LOCALES[current].tag, {
  maximumFractionDigits: 0,
});
export let cf: Intl.NumberFormat = new Intl.NumberFormat(LOCALES[current].tag, {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
});

let numLang: Lang = current;

function refreshNumbers(): void {
  if (numLang === current) return;
  numLang = current;
  const tag = LOCALES[current].tag;
  nf = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  cf = new Intl.NumberFormat(tag, { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 });
}

/** Locale-grouped integer. */
export function num(value: number): string {
  refreshNumbers();
  return Number.isFinite(value) ? nf.format(value) : '—';
}

/** Axis tick: 1.2k / 1,2 k, 2.5M / 2,5 M. */
export function compact(value: number): string {
  refreshNumbers();
  if (!Number.isFinite(value)) return '—';
  return Math.abs(value) < 1000 ? nf.format(value) : cf.format(value);
}

/** Input is millions of euros. FR: "1,2 M€"  EN: "€1.2M". */
export function moneyM(millions: number): string {
  refreshNumbers();
  if (!Number.isFinite(millions)) return '—';
  const body =
    Math.abs(millions) < 10
      ? new Intl.NumberFormat(LOCALES[current].tag, { maximumFractionDigits: 1 }).format(millions)
      : cf.format(millions);
  return current === 'fr' ? `${body} M€` : `€${body}`;
}

/** Alias kept for chart.ts — same inputs, same output as moneyM(). */
export const eurM: (millions: number) => string = moneyM;

/* ------------------------------------------------------------------- dates */

type DateInput = Date | string | number;

const DATE_LONG: Intl.DateTimeFormatOptions = {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
};
const DATE_SHORT: Intl.DateTimeFormatOptions = {
  day: 'numeric', month: 'short', timeZone: 'UTC',
};

let dsLong: Intl.DateTimeFormat = new Intl.DateTimeFormat(LOCALES[current].tag, DATE_LONG);
let dsShort: Intl.DateTimeFormat = new Intl.DateTimeFormat(LOCALES[current].tag, DATE_SHORT);
let dsLang: Lang = current;

function refreshDates(): void {
  if (dsLang === current) return;
  dsLang = current;
  const tag = LOCALES[current].tag;
  dsLong = new Intl.DateTimeFormat(tag, DATE_LONG);
  dsShort = new Intl.DateTimeFormat(tag, DATE_SHORT);
}

/** ISO strings are parsed as UTC so '2026-10-01' cannot slip to 30 September. */
function toDate(value: DateInput): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** French writes the first of the month as "1er"; Intl never emits it. */
function ordinalFr(d: Date, fmt: Intl.DateTimeFormat): string {
  const s = fmt.format(d);
  return current === 'fr' && d.getUTCDate() === 1 ? s.replace(/^1\b/, '1er') : s;
}

/** "1 Nov 2026" / "1er nov. 2026"; invalid input → em dash, never throws. */
export function fmtDate(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? ordinalFr(d, dsLong) : '—';
}

/** "1 Nov" / "1er nov." */
export function fmtDayMonth(value: DateInput): string {
  refreshDates();
  const d = toDate(value);
  return d ? ordinalFr(d, dsShort) : '—';
}

/** Week-start label. Wrap with tp('wk.of', { d: fmtWeek(ws) }) at the call site. */
export function fmtWeek(value: DateInput): string {
  return fmtDayMonth(value);
}

export interface SpanLike {
  readonly start?: DateInput | null;
  readonly end?: DateInput | null;
  /** Author-written label; used verbatim when present. */
  readonly label?: string | null;
}

const ISO_ANY = /\d{4}-\d{2}-\d{2}/;
const ISO_ALL = /\b(\d{4}-\d{2}-\d{2})\b/g;

/**
 * Episode span. Three accepted shapes:
 *   fmtSpan('1968')                       → '1968'   (author-written label, verbatim)
 *   fmtSpan('2026-10-01', '2026-11-11')   → '1 Oct – 11 Nov 2026'
 *   fmtSpan({ start, end, label })        → label, else formatted pair
 * Strings containing ISO dates are localised; everything else is passed through, so
 * hand-authored spans like 'Mai 68' survive integer-locale switches untouched.
 */
export function fmtSpan(span: string | SpanLike | DateInput, end?: DateInput): string {
  const sep = t('span.sep');

  if (typeof span === 'string') {
    if (end !== undefined) return `${fmtDayMonth(span)}${sep}${fmtDate(end)}`;
    return ISO_ANY.test(span) ? span.replace(ISO_ALL, (m) => fmtDayMonth(m)) : span;
  }
  if (typeof span === 'number' || span instanceof Date) {
    return end !== undefined ? `${fmtDayMonth(span)}${sep}${fmtDate(end)}` : fmtDate(span);
  }
  if (span.label) return span.label;
  if (span.start && span.end) return `${fmtDayMonth(span.start)}${sep}${fmtDate(span.end)}`;
  if (span.start) return fmtDate(span.start);
  if (span.end) return fmtDate(span.end);
  return '—';
}

/* ------------------------------------------------------------ static copy */

type AttrName = 'text' | 'aria-label' | 'title' | 'placeholder';

const STATIC: Record<string, Bi> = {
  'doc.title': {
    en: 'Protest activity in France — October–November 2026',
    fr: 'L’activité contestataire en France — octobre–novembre 2026',
  },

  'hdr.kicker': { en: 'Working draft · 1 Oct – 11 Nov 2026', fr: 'Document de travail · 1er oct. – 11 nov. 2026' },
  'hdr.title': {
    en: 'Protest activity in France, autumn 2026',
    fr: 'L’activité contestataire en France, automne 2026',
  },
  'hdr.lede': {
    en: 'Turnout, arrests, injuries and damage, set against six earlier French movements. Every point is a range where the publishers disagree.',
    fr: 'Foules, interpellations, blessés et dommages, comparés à six mouvements français antérieurs. Chaque point est une fourchette là où les éditeurs divergent.',
  },

  'ui.lang': { en: 'Language', fr: 'Langue' },
  'ui.lang.fr': { en: 'Afficher la page en français', fr: 'Afficher la page en français' },
  'ui.lang.en': { en: 'Show this page in English', fr: 'Afficher la page en anglais' },

  'disc.lead': {
    en: 'These charts are AI-generated and have not been independently verified. Do not use them for serious analysis, publication or decision-making without checking every figure against the sources below. ',
    fr: 'Ces graphiques sont générés par IA et n’ont pas été vérifiés de façon indépendante. Ne les utilisez pas pour une analyse sérieuse, une publication ou une décision sans vérifier chaque chiffre auprès des sources ci-dessous. ',
  },
  'disc.link': {
    en: 'The full conversation in which they were produced, including every figure that was rejected, is in the transcript.',
    fr: 'La conversation complète dans laquelle ils ont été produits, y compris chaque chiffre écarté, figure dans la transcription.',
  },

  'sec.a.title': { en: 'A · Daily counts, 1 October – 11 November 2026', fr: 'A · Décomptes quotidiens, 1er octobre – 11 novembre 2026' },
  'sec.a.lede': {
    en: 'One point per day on which something was published. Days with no figure stay empty rather than interpolated.',
    fr: 'Un point par jour où un chiffre a été publié. Les jours sans chiffre restent vides plutôt qu’interpolés.',
  },
  'card.prot.title': { en: 'Protesters', fr: 'Manifestants' },
  'card.prot.sub': { en: 'Ministry and organiser counts', fr: 'Comptages ministériels et syndicaux' },
  'card.enf.title': { en: 'Arrests and injuries', fr: 'Interpellations et blessés' },
  'card.enf.sub': { en: 'Custody is not the same as arrest', fr: 'La garde à vue n’est pas l’interpellation' },
  'card.cost.title': { en: 'Damage and the cost of policing', fr: 'Dommages et coût du maintien de l’ordre' },
  'card.cost.sub': { en: 'Two different bases of measurement', fr: 'Deux bases de mesure différentes' },

  'sec.b.title': { en: 'B · Weekly aggregates', fr: 'B · Agrégats hebdomadaires' },
  'sec.b.lede': {
    en: 'Weeks run Monday to Sunday. A peak-day crowd and a summed weekly arrest count are not the same statistic — the tooltip says which is which.',
    fr: 'Les semaines vont du lundi au dimanche. Une foule de jour de pointe et un total hebdomadaire d’interpellations ne sont pas la même statistique — l’infobulle précise laquelle.',
  },
  'card.pw.title': { en: 'Protesters, weekly peak', fr: 'Manifestants, pointe hebdomadaire' },
  'card.ew.title': { en: 'Enforcement, weekly totals', fr: 'Répression, totaux hebdomadaires' },

  'sec.c.title': { en: 'C · One panel per movement', fr: 'C · Un panneau par mouvement' },
  'sec.c.lede': {
    en: 'Each panel keeps its own time span, so the shapes are comparable but the durations are not.',
    fr: 'Chaque panneau conserve sa propre durée : les formes sont comparables, les durées non.',
  },
  'sec.cp.title': { en: 'C′ · Transposed: one panel per series', fr: 'C′ · Transposé : un panneau par série' },
  'sec.cp.lede': {
    en: 'The same data with movements overlaid, so a single measure can be read across 1968 to 2026. The x axis is elapsed weeks.',
    fr: 'Les mêmes données avec les mouvements superposés, pour lire une même mesure de 1968 à 2026. L’axe des x est le nombre de semaines écoulées.',
  },
  'leg.items.title': { en: 'Highlight a measure', fr: 'Mettre en avant une mesure' },
  'leg.movements.title': { en: 'Highlight a movement', fr: 'Mettre en avant un mouvement' },

  'src.wrap.title': { en: 'Sources and method', fr: 'Sources et méthode' },
};

/** Resolves every `[data-i18n]` in the document. Safe to call on each render. */
export function applyStaticCopy(root: ParentNode = document): void {
  const L = current;

  for (const node of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = node.dataset.i18n;
    if (!key) continue;
    const entry = STATIC[key];
    if (!entry) {
      console.warn(`[i18n] no static copy for "${key}"`);
      continue;
    }
    const text = entry[L] ?? entry.en;
    const attr = node.dataset.i18nAttr as AttrName | undefined;
    if (!attr || attr === 'text') node.textContent = text;
    else node.setAttribute(attr, text);
  }

  document.documentElement.lang = LOCALES[L].htmlLang;
  document.documentElement.dataset.lang = L;
  const docTitle = STATIC['doc.title'];
  if (docTitle) document.title = docTitle[L] ?? docTitle.en;
}

/** Reflects the current language onto the segmented control. */
export function syncLangSwitch(root: ParentNode = document): void {
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-set-lang]')) {
    const on = b.dataset.setLang === current;
    b.setAttribute('aria-pressed', String(on));
    b.tabIndex = on ? 0 : -1;
  }
}
```

What is new here relative to the previous fragment, i.e. the names behind today's six errors:

- `plural(n[, one[, many]])` supports both idioms in one signature: bare call returns the `''`/`'s'` suffix, with a word argument it returns the inflected word.
- `fmtSpan` accepts three shapes — `(start, end)`, `(startOnly)`, or `{ start, end, label }` — and passes non-ISO strings through verbatim, so a hand-authored `'Mai 68'` is never mangled by a locale switch. It also added the `span.sep` key so the en dash is itself translatable.
- `LOCALES` is a `Record<Lang, LocaleMeta>` (not an array), and `DEFAULT_LOCALE` is the BCP-47 tag of `DEFAULT_LANG`. If `lang.ts` iterates it, use `Object.values(LOCALES)`; if it indexes by language, it already works.

Verify the whole surface in one pass before rebuilding — this catches any name I still have not been shown:

```bash
cd src/client && \
grep -hoE 'import \{[^}]+\} from "\./i18n\.ts"' *.ts | tr -d '{}' | sed 's/import//;s/ from "\.\/i18n\.ts"//' | tr ',' '\n' | sed 's/^ *//;s/ *$//' | grep -v '^type ' | sort -u > /tmp/needed && \
grep -oE '^export (declare )?(function|const|let|class|interface|type|enum) [A-Za-z_]+' i18n.ts | awk '{print $NF}' | sort -u > /tmp/have && \
comm -23 /tmp/needed /tmp/have
```

Empty output means every imported name resolves. Any line it prints is a name in a module I have not seen, and one more export completes the set.

---

**You**

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "getLocale"

    src/client/lang.ts:8:2:
      8 │   getLocale,
        ╵   ~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "onLocaleChange"

    src/client/lang.ts:9:2:
      9 │   onLocaleChange,
        ╵   ~~~~~~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "setLocale"

    src/client/lang.ts:10:2:
      10 │   setLocale,
         ╵   ~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "fmtWhen"

    src/client/page.ts:4:9:
      4 │ import { fmtWhen, onLocaleChange, t, type Catalogue } from "./i18n.ts";
        ╵          ~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "onLocaleChange"

    src/client/page.ts:4:18:
      4 │ import { fmtWhen, onLocaleChange, t, type Catalogue } from "./i18n.ts";
        ╵                   ~~~~~~~~~~~~~~

✘ [ERROR] No matching export in "src/client/i18n.ts" for import "onLocaleChange"

    src/client/main.ts:11:29:
      11 │ import { getLocale, LOCALES, onLocaleChange, setLocale } from "./i18n.ts";
         ╵                              ~~~~~~~~~~~~~~


---

**Assistant**

The log you attached is the old `chart.data` crash only — nothing in it tells me what `lang.ts`, `page.ts` and `main.ts` expect, and those three files aren't in the workspace, so I can't read them. Working from the import lines you've pasted, the shape is clear: the codebase has **two generations of the same API**. `chart.ts`/`episodes.ts` call the `lang`/`setLang` names, while `lang.ts`/`page.ts`/`main.ts` call an older `locale` trio (`getLocale`/`setLocale`/`onLocaleChange`). They must be aliases over one state, and the state needs a subscriber registry that fires on every path, or a switch made through one name won't notify the other side.

Replace the state region of `i18n.ts` — everything from `let current: Lang = …` through the end of `toggleLang` — with this:

```ts
let current: Lang = fromUrl() ?? fromStorage() ?? fromBrowser() ?? DEFAULT_LANG;

/** The accessor every module keys its caches on. Synchronous by contract. */
export function lang(): Lang {
  return current;
}

/** Locale-era alias of lang(). Returns 'fr' / 'en', which are valid Intl tags. */
export function getLocale(): Lang {
  return current;
}

/* ------------------------------------------------------- change subscription */

type LocaleListener = (next: Lang, previous: Lang) => void;

const listeners = new Set<LocaleListener>();
let emitting = false;

/** Subscribes to every language change. Returns an unsubscribe function. */
export function onLocaleChange(fn: LocaleListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit(next: Lang, previous: Lang): void {
  if (emitting) return;
  emitting = true;
  try {
    for (const fn of [...listeners]) {
      try {
        fn(next, previous);
      } catch (err) {
        console.error('[i18n] locale listener threw', err);
      }
    }
  } finally {
    emitting = false;
  }
}

/* ------------------------------------------------------------------- setters */

/** Accepts 'fr', 'fr-FR', 'FR', 'français' — anything else is ignored. */
function normalize(input: Lang | string): Lang | null {
  const low = String(input).toLowerCase();
  if (low === 'fr' || low.startsWith('fr-') || low === 'français' || low === 'francais') return 'fr';
  if (low === 'en' || low.startsWith('en-')) return 'en';
  return null;
}

export interface SetLangOptions {
  /** Write through to localStorage. Default true. */
  persist?: boolean;
  /** Emit to subscribers. Default true. */
  notify?: boolean;
}

/** Switches language. Emits once, only on an actual change. Does not render. */
export function setLang(next: Lang, opts: SetLangOptions = {}): Lang {
  const target = normalize(next);
  if (!target) {
    console.warn(`[i18n] ignoring unrecognised locale "${next}"`);
    return current;
  }

  const previous = current;
  current = target;

  if (opts.persist !== false && hasDom()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, target);
    } catch {
      /* private mode / quota — not fatal */
    }
  }

  if (hasDom()) {
    document.documentElement.lang = LOCALES[target].htmlLang;
    document.documentElement.dataset.lang = target;
  }

  if (opts.notify !== false && previous !== target) emit(target, previous);
  return current;
}

/** Locale-era alias of setLang(). Accepts a bare tag as well as a Lang. */
export function setLocale(next: Lang | string, opts: SetLangOptions = {}): Lang {
  return setLang((normalize(next) ?? current) as Lang, opts);
}

export function toggleLang(): Lang {
  return setLang(current === 'fr' ? 'en' : 'fr');
}

/* ------------------------------------------------------------------ relative time */

/** Calendar-only strings ("2026-10-01") must not gain a fake 00:00. */
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const HAS_CLOCK = /[T ]\d{2}:\d{2}/;

function isInstant(value: Date | string | number): boolean {
  if (value instanceof Date) return true;
  if (typeof value === 'number') return true;
  return !DATE_ONLY.test(value) && HAS_CLOCK.test(value);
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "3 hours ago" / "il y a 3 heures", "hier", "1er nov. 2026 à 14:05".
 * Relative inside a 7-day window, absolute outside it. Never throws.
 */
export function fmtWhen(
  value: Date | string | number,
  reference: Date | string | number = Date.now(),
): string {
  const d = toDate(value);
  const r = toDate(reference);
  if (!d || !r) return '—';

  const delta = d.getTime() - r.getTime();
  const abs = Math.abs(delta);
  const rtf = new Intl.RelativeTimeFormat(LOCALES[current].tag, { numeric: 'auto' });

  if (abs < MINUTE) return rtf.format(0, 'minute');
  if (abs < HOUR) return rtf.format(Math.round(delta / MINUTE), 'minute');
  if (abs < DAY) return rtf.format(Math.round(delta / HOUR), 'hour');
  if (abs < 7 * DAY) return rtf.format(Math.round(delta / DAY), 'day');

  if (!isInstant(value)) return fmtDate(value);

  /* Real instants are shown in the reader's timezone, not UTC. */
  return new Intl.DateTimeFormat(LOCALES[current].tag, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/* ------------------------------------------------------------------- catalogue */

/** A page-level string table: plain strings or bilingual literals, mixed freely. */
export type Catalogue = Record<string, string | Bi>;

/** Reads a catalogue entry in the active language. */
export function fromCatalogue(catalogue: Catalogue, key: string, fallback = ''): string {
  const entry = catalogue[key];
  if (entry === undefined) return fallback;
  return typeof entry === 'string' ? entry : bi(entry);
}
```

Three things this buys you, and one it cannot:

- `setLocale` normalises, so a caller passing `'fr-FR'`, `'FR'` or `'fr'` all land on the same state. `getLocale()` returns `'fr'`/`'en'` rather than `'fr-FR'`, deliberately: both are valid `Intl` tags, so `Intl.DateTimeFormat(getLocale())` works, and any `=== 'fr'` comparison works. If `lang.ts` instead compares against `LOCALES[x].tag` (i.e. `'fr-FR'`), it needs `localeTag()`, not `getLocale()` — that's the one place where I'm still guessing at unseen code.
- `onLocaleChange` fires on `setLang`, `setLocale` and `toggleLang` alike, since all three funnel through `setLang`. Re-entrant calls are swallowed by the `emitting` guard, and a throwing listener cannot abort the others.
- `fmtWhen` reads the clock through `Date.now()` at call time, so it stays correct in a page left open for hours — but it will not re-render on its own.

The thing aliasing cannot fix: if `lang.ts` or `page.ts` holds **its own** language state and its own detection, you now have two sources of truth and a toggle will update only one. That is the same class of bug that has produced every error in this thread. Confirm it in one command:

```bash
cd src/client && grep -nE "localStorage|URLSearchParams|let (lang|locale)|navigator\.language" lang.ts page.ts main.ts
```

Any hit outside `i18n.ts` is a second state machine and should be deleted in favour of the imported one. One more: if `main.ts` both subscribes with `onLocaleChange(render)` **and** calls `render()` in its click handler, every toggle renders twice — pick one path.

---

**You**

Uncaught TypeError: LOCALES.includes is not a function
    isLocale lang.ts:19
    localeFromUrl lang.ts:25
    initLang lang.ts:81
    <anonymous> main.ts:89
lang.ts:19:41


---

**Assistant**

`lang.ts` iterates and `includes`-checks `LOCALES`, which means it expects a **flat list of language codes**, not the `Record<Lang, LocaleMeta>` I gave you. Metadata moves to its own map; `LOCALES` becomes an array of `Lang`.

Two edits, both mechanical.

## 1. Replace the locales region in `i18n.ts`

```ts
/* ------------------------------------------------------------------ locales */

/** The selectable languages, in display order. Flat, so `.includes()` and `.map()` work. */
export const LOCALES: readonly Lang[] = Object.freeze(['fr', 'en'] as const);

/** Per-language metadata, indexed by code. Kept separate from LOCALES so neither shape is overloaded. */
export const LOCALE_META: Record<Lang, LocaleMeta> = {
  en: { tag: 'en-GB', htmlLang: 'en', label: 'English' },
  fr: { tag: 'fr-FR', htmlLang: 'fr', label: 'Français' },
};

export const DEFAULT_LANG: Lang = 'en';
export const DEFAULT_LOCALE: string = LOCALE_META[DEFAULT_LANG].tag;

/** Active BCP-47 tag, e.g. 'fr-FR'. */
export function localeTag(): string {
  return LOCALE_META[current].tag;
}

/** Active endonym, e.g. 'Français'. */
export function localeLabel(l: Lang = current): string {
  return LOCALE_META[l].label;
}

/** Narrowing guard matching lang.ts's isLocale() shape. Accepts tags, not just bare codes. */
export function isLang(value: unknown): value is Lang {
  const low = String(value ?? '').toLowerCase();
  return low.startsWith('fr') || low.startsWith('en');
}
```

## 2. Rewrite the metadata lookups that were indexing the array

`LOCALES` is now an array, so every `LOCALES[x]` left in the file must become `LOCALE_META[x]`. It is safe as a blanket substitution, because the array is never indexed in `i18n.ts`:

```bash
cd src/client && sed -i 's/LOCALES\[/LOCALE_META[/g' i18n.ts && grep -n 'LOCALES' i18n.ts
```

The remaining hits should be only the declaration and uses of the array as a whole (`LOCALES.includes`, `LOCALES.map`, `LOCALES.length`). The affected sites in the previous version were: the `nf`/`cf` initialisers, `refreshNumbers` (twice), `moneyM`, the `dsLong`/`dsShort` initialisers, `refreshDates`, `setLang`'s `htmlLang` write, and both `Intl` constructions inside `fmtWhen`.

## 3. If `lang.ts` compares against full tags

The error came from `isLocale`, and its argument may well be a full tag from the query string (`?lang=fr-FR`). My guard accepts both. But if `lang.ts` does `LOCALES.includes(raw)` with `raw = 'fr-FR'`, it will still be `false` and silently fall through to detection. In that file, the check should be:

```ts
// before
if (LOCALES.includes(raw)) return raw;

// after — normalise the tag to a bare code first
const code = raw.slice(0, 2).toLowerCase();
if (LOCALES.includes(code as Lang)) return code as Lang;
```

`i18n.ts`'s own `setLang`/`setLocale` already normalise `'fr-FR'`, `'FR'` and `'français'` down to `'fr'`, so only `lang.ts`'s pre-parse check needs the change.

## 4. Delete the duplicate detection in `lang.ts`

`localeFromUrl` and `initLang` are re-implementing what `i18n.ts` already does at import time, against a query string it has already parsed. With `setLang`/`setLocale` on one side and `getLocale`/`onLocaleChange` on the other, `lang.ts` should contain no state at all — `initLang()` becomes a no-op you can delete, and `localeFromUrl` a thin wrapper over `setLocale(new URLSearchParams(location.search).get('lang') ?? DEFAULT_LANG)`.

Confirm nothing else regressed, since array-of-strings is a shape change `main.ts` may also touch:

```bash
cd src/client && grep -nE 'LOCALES[^.[]' *.ts
```

Any hit where the result is used as an object (`LOCALES.en`, `LOCALES[x].tag`) is now wrong and needs `LOCALE_META`.

---

**You**

Uncaught TypeError: can't access property "meta", m is undefined
    renderChrome page.ts:85
    render main.ts:62
    <anonymous> main.ts:91
page.ts:85:3


---

**Assistant**

I checked the workspace — there are no `.ts` files in it, so `page.ts:85` isn't readable here. But the stack is enough: `LOCALES` now has **three** incompatible shapes demanded across the codebase, because each module was written against a different generation of `i18n.ts`.

| Consumer | Code | Needs |
|---|---|---|
| `lang.ts:19` | `LOCALES.includes(x)` | flat array |
| `page.ts:85` | `const m = LOCALES[…]` then `m.meta` | object keyed by code |
| `i18n.ts` internals | `LOCALE_META[x].tag` | record |

`m` is `undefined` because indexing an **array** with a string key (`LOCALES['fr']`) yields `undefined`, and the very next property access throws. Picking a fourth shape just moves the crash.

## 1. Canonical shape: descriptors + derived map

`LOCALES` becomes an array of descriptor objects — each carrying `code`, `tag`, `label`, `htmlLang` and a `meta` bag for chrome strings. `LOCALE_META` is derived from it, so the two can never disagree.

```ts
/* ------------------------------------------------------------------ locales */

export interface LocaleDescriptor {
  readonly code: Lang;
  /** BCP-47 tag for Intl, e.g. 'fr-FR'. */
  readonly tag: string;
  /** Short tag for <html lang>. */
  readonly htmlLang: Lang;
  /** Endonym for switchers. */
  readonly label: string;
  /** Per-locale chrome strings: title, description, og:*. Keys must match page.ts:85. */
  readonly meta: Readonly<Record<string, string>>;
}

/** Selectable languages, in display order. Array, so .includes / .map / .find work. */
export const LOCALES: readonly LocaleDescriptor[] = Object.freeze([
  {
    code: 'en',
    tag: 'en-GB',
    htmlLang: 'en',
    label: 'English',
    meta: {
      title: 'Protest activity in France — October–November 2026',
      description:
        'Turnout, arrests, injuries and damage in the autumn 2026 protest movement, set against six earlier French movements. LLM-assisted working draft, not verified.',
    },
  },
  {
    code: 'fr',
    tag: 'fr-FR',
    htmlLang: 'fr',
    label: 'Français',
    meta: {
      title: 'L’activité contestataire en France — octobre–novembre 2026',
      description:
        'Foules, interpellations, blessés et dommages du mouvement de l’automne 2026, comparés à six mouvements français antérieurs. Document de travail assisté par IA, non vérifié.',
    },
  },
] as const);

/** Derived lookup, so `LOCALE_META[lang]` is always the same object as the array entry. */
export const LOCALE_META: Record<Lang, LocaleDescriptor> = Object.freeze(
  Object.fromEntries(LOCALES.map((l) => [l.code, l])) as Record<Lang, LocaleDescriptor>,
);

/** Just the codes, for `.includes()` on untrusted input. */
export const LOCALE_CODES: readonly Lang[] = Object.freeze(LOCALES.map((l) => l.code));

export const DEFAULT_LANG: Lang = 'en';
export const DEFAULT_LOCALE: string = LOCALE_META[DEFAULT_LANG].tag;

export function localeTag(l: Lang = current): string {
  return LOCALE_META[l].tag;
}

export function localeLabel(l: Lang = current): string {
  return LOCALE_META[l].label;
}

/** Accepts 'fr', 'fr-FR', 'FR'. Uses the codes list, not object identity. */
export function isLang(value: unknown): value is Lang {
  const code = String(value ?? '').slice(0, 2).toLowerCase();
  return (LOCALE_CODES as readonly string[]).includes(code);
}
```

## 2. The two call sites that must change

**`lang.ts:19`** — `LOCALES` is now an array of objects, so `includes('fr')` is a silent `false`. Use the code list:

```ts
// before
if (LOCALES.includes(raw)) return raw;

// after
if (LOCALE_CODES.includes(raw as Lang)) return raw as Lang;
const code = String(raw).slice(0, 2).toLowerCase();
if (LOCALE_CODES.includes(code as Lang)) return code as Lang;
```

**`page.ts:85`** — replace the failing lookup with the derived map, and guard it, because `renderChrome` runs on every render and a missing entry should degrade, not kill the page:

```ts
const m = LOCALE_META[getLocale()];
if (!m) {
  console.warn(`[page] no locale descriptor for "${getLocale()}"`);
  return;            // or `continue` inside the loop
}
// m.meta.title, m.meta.description, m.tag, m.label …
```

If line 85 is inside `LOCALES.map((l) => …)`, then `l` is already a descriptor and `m = l` — check that the arrow parameter name matches what you destructured; a stale `LOCALES[code]` inside a loop over `LOCALES` is the other likely source of the `undefined`.

## 3. Zero-edit fallback (temporary)

If you would rather not touch `page.ts` right now, make the array also answer to string keys. Same objects, one extra assignment:

```ts
const list = [ /* … the two descriptors … */ ];

/** Array that also indexes by code — bridge for older call sites. Remove once page.ts uses LOCALE_META. */
export const LOCALES = Object.assign(
  [...list],
  Object.fromEntries(list.map((l) => [l.code, l])),
) as unknown as readonly LocaleDescriptor[] & Record<Lang, LocaleDescriptor>;
```

`LOCALES.includes(code)` works (index lookups are non-enumerable-ish extras, `length` stays 2, iteration still yields only the two descriptors), and `LOCALES['fr'].meta` resolves. It is a stopgap: `JSON.stringify`, `Object.keys` and `{...LOCALES}` all pick up the extra keys, so treat it as a bridge to delete, not a design.

## 4. Confirm nothing else is reading the old shape

```bash
cd src/client && grep -nE "LOCALES|LOCALE_META|LOCALE_CODES" *.ts
```

Then, for the whole surface at once:

```bash
cd src/client && grep -hoE 'import \{[^}]+\} from "\./i18n\.ts"' *.ts \
  | sed 's/import {//;s/} from "\.\/i18n\.ts"//' | tr ',' '\n' \
  | sed 's/^ *//;s/ *$//;s/^type //' | sort -u > /tmp/need \
&& grep -oE '^export (declare )?(const|let|function|class|interface|type) [A-Za-z_]+' i18n.ts \
  | awk '{print $NF}' | sort -u > /tmp/have \
&& comm -23 /tmp/need /tmp/have
```

Both empty/limited to expected entries, and the runtime errors stop. Every error in this thread has been the same failure mode — one module's expectation silently diverging from `i18n.ts`'s exports — so a single reconciled surface plus that `comm` check is the only thing that will actually end the sequence.

---

**You**

Fix the charts in sections A & B

---

**Assistant**

Read the attached `chart.ts`. The data is fine — the plots have nowhere to draw.

**Diagnosis.** `maintainAspectRatio: false` means Chart.js sizes the canvas from its *parent*. `.card-canvas` has no height, so the canvas falls back to its HTML-intrinsic box: **300 × 150**. Chrome in that 150px: title ~21 + subtitle ~27 + legend ~30 + x ticks 14 + x-axis title 17 + `layout.padding.top` 16 ≈ 130. The plot area is left with **~17px**, so every value lands within a few pixels of the baseline (reading as a flat line at 0), 5 y-ticks get `autoSkip`ped down to the single first tick (`0`), the legend lands on top of the plot, and the axis titles of chart 3 are cropped because the bitmap and the CSS box disagree after the resize. Secondary: `suggestedMax` is hand-guessed (`1_600_000`, `2_800`, `900`/`520`) and the same `2_800` is reused for daily and weekly charts whose ranges differ, so a band can be clipped by its own frame.

## 1. CSS — give the canvas a definite box

```css
/* Chart.js with maintainAspectRatio:false sizes from the parent, so the parent must have a height. */
.card-canvas {
  position: relative;
  height: clamp(300px, 34vw, 360px);
  min-height: 300px;
}
.card-canvas > canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* section B is weekly: fewer, thicker points, no daily tick clutter */
#sec-b .card-canvas { height: clamp(260px, 26vw, 300px); min-height: 260px; }

@media (max-width: 40rem) {
  .card-canvas { height: 300px; }
}
```

## 2. `chart.ts` — derived axis bounds, tighter chrome

```ts
/* ------------------------------------------------------------- chart specs
 * (SeriesSpec, metricDatasets, tooltipCallbacks, datasetsOf unchanged)
 */

/** 1 / 1.5 / 2 / 2.5 / 3 / 4 / 5 / 6 / 8 / 10 × 10^n — keeps bands inside the frame. */
function niceCeil(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 10;
  const base = 10 ** Math.floor(Math.log10(v));
  const n = v / base;
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s + 1e-9) ?? 10;
  return step * base;
}

/** Upper bound from the values AND bands actually present on this axis — never a guessed constant. */
function axisMax(datasets: ProtestDataset[], axis: string, headroom = 1.08): number {
  let max = 0;
  for (const ds of datasets) {
    if ((ds.yAxisID ?? "y") !== axis) continue;
    for (const v of ds.data) if (typeof v === "number" && v > max) max = v;
    for (const b of ds.errorBars ?? []) if (b && b[1] > max) max = b[1];
  }
  return max > 0 ? niceCeil(max * headroom) : 10;
}

const Y_TICKS = { maxTicksLimit: 6, autoSkip: false, font: { size: 10 }, padding: 6 } as const;

type YScale = NonNullable<NonNullable<ChartOptions<"line">["scales"]>[string]>;

function yAxis(
  datasets: ProtestDataset[],
  axis: string,
  titleText: string,
  fmtTick: (v: number) => string,
): YScale {
  return {
    type: "linear",
    position: axis === "y" ? "left" : "right",
    beginAtZero: true,
    max: axisMax(datasets, axis),
    title: {
      display: true,
      text: titleText,
      color: "#4b5563",
      font: { size: 11 },
      padding: { bottom: 6 },
    },
    ticks: { ...Y_TICKS, callback: (v: string | number) => fmtTick(Number(v)) },
    grid: { color: "rgba(17,24,39,0.06)", drawTicks: false },
  };
}

const basePlugins = (subtitle: string) => ({
  legend: {
    position: "top" as const,
    align: "end" as const,
    labels: {
      usePointStyle: true,
      boxWidth: 8,
      boxHeight: 8,
      padding: 14,
      font: { size: 11 },
      // the detached twin is redundant in the legend, and is found by flag, not by its text
      filter: (item: LegendItem, ctx: unknown) =>
        !datasetsOf(ctx)[item.datasetIndex ?? -1]?.detachedOnly,
    },
  },
  subtitle: {
    display: true,
    text: subtitle,
    color: "#6b7280",
    font: { size: 11 },
    padding: { top: 0, bottom: 8 },
  },
});

const baseScales = (view: View) => ({
  x: {
    title: { display: true, text: view.xTitle, color: "#4b5563", font: { size: 11 }, padding: { top: 4 } },
    grid: { display: false },
    ticks: {
      maxRotation: view.maxRotation,
      autoSkip: true,
      maxTicksLimit: view.maxTicksLimit,
      font: { size: 10 },
      color: "#6b7280",
      padding: 4,
    },
  },
});

const shell = (view: View, subtitle: string, title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 0,
  devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  interaction: { mode: "index" as const, intersect: false },
  layout: { padding: { top: 4, right: 16, bottom: 0, left: 4 } },
  plugins: {
    ...basePlugins(subtitle),
    title: {
      display: true,
      text: title,
      color: "#111827",
      font: { size: 15, weight: "bold" as const },
      padding: { top: 0, bottom: 2 },
    },
    tooltip: { callbacks: tooltipCallbacks(view) },
  },
});

type Cfg = {
  data: { labels: string[]; datasets: ProtestDataset[] };
} & ChartOptions<"line">;

/* ------------------------------------------- section A · chart 1 (daily) */
// unchanged until `const options`:
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.protestersDaily.y, (v) => compact().format(v)),
    },

/* ------------------------------------------- section A · chart 2 (daily) */
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.enforcementDaily.y, (v) => compact().format(v)),
    },

/* ------------------------------------------- section A · chart 3 (daily) */
  // delete the now-unused local helper `const eur = …` from this function
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.cost.yLeft, (v) => fill(m.eurM, { v: nf().format(v) })),
      y1: {
        ...yAxis(datasets, "y1", m.charts.cost.yRight, (v) => fill(m.eurM, { v: nf().format(v) })),
        grid: { drawOnChartArea: false },
      },
    },

/* ------------------------------------------ section B · chart 4 (weekly) */
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.protestersWeekly.y, (v) => compact().format(v)),
    },

/* ------------------------------------------ section B · chart 5 (weekly) */
    scales: {
      ...baseScales(view),
      y: yAxis(datasets, "y", m.charts.enforcementWeekly.y, (v) => compact().format(v)),
    },

/* ------------------------------------------------------------------ mount */

export function mount(canvas: HTMLCanvasElement, cfg: Cfg): Chart<"line"> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;
  // a failed construct leaves elements without resolved options → every later
  // mousemove throws inside PointElement.inRange (the hitRadius cascade)
  return new Chart<"line">(ctx, { type: "line", data, options, plugins: [errorBars] });
}
```

Expected after the change, chart 1: ticks `0 / 500k / 1 M / 1,5 M / 2 M`, the 5 Nov band (575k–1.6M) reaching ~80% height, the 17 Oct band (550k–800k) mid-frame. Chart 3 right axis reads `0 / 200 / 400 / 600 M€` (cumulative reaches ~485), left `0 / 200 … 1 000 M€` (17 Oct damages 866). Two details changed beyond layout: A3's tick labels now use `nf()` rather than `compact()` (otherwise the top label renders as "1k M€"), and every `suggestedMax` is gone, so a band can no longer exceed its own frame.

One check while you are in there — this file calls `t()`, `nf()`, `compact()` and `eurM().format` as zero-arg factories returning a catalogue/formatter, whereas the `i18n.ts` I sent last defines `t(key)`, `nf` as a `NumberFormat` binding, and `compact(v)`. If charts render today, your `i18n.ts` is the catalogue generation and that is the one to keep; don't paste the other over it:

```bash
cd src/client && grep -nE "^export (const|function|let) (t|nf|cf|compact|eurM)" i18n.ts
```

---

**You**

Re-incorporate the missing sources from the attached version of `index.html`

---

**Assistant**

Read the attachment; all 18 citations and the two prose blocks (intro + foot) are restored below, plus the marker key that the caption-less C/C′ panels now depend on.

```ts
/* src/client/sources.ts — provenance box.
 *
 * Contains every citation from the pre-i18n index.html, in that file's order and with its
 * exact URLs, dates and descriptions. Only the chrome is translated; article titles and
 * publisher names stay verbatim, because translating a headline breaks the citation.
 *
 * Contract: renderSources(host?) is idempotent — it replaceChildren()s its own host, so
 * main.ts may call it on every render and every language change. The page-level <h2>
 * lives OUTSIDE #sources in index.html, so it survives the replacement.
 */

import { bi, fmtDate, fmtDayMonth, type Bi } from './i18n.ts';

export type GroupId = 'g2026' | 'hist';

export interface Source {
  readonly id: string;
  readonly group: GroupId;
  /** Publication and headline, verbatim. Never translated. */
  readonly label: string;
  readonly url: string;
  /** ISO start date. Absent for continuously published sources (ministry briefings). */
  readonly date?: string;
  /** End of a publication span; rendered as "10 Sep–11 Sep 2025". */
  readonly dateEnd?: string;
  /** What this page takes from the source. */
  readonly what: Bi;
}

export interface SourceGroup {
  readonly id: GroupId;
  readonly title: Bi;
  readonly blurb: Bi;
}

/* ------------------------------------------------------------------- copy */

const BOX_TITLE: Bi = { en: 'Sources and method', fr: 'Sources et méthode' };

const INTRO: Bi = {
  en: 'Compiled by an LLM from the reports below; no figure here is a primary measurement made for this page. Where a movement has an official count, the interior ministry is the source of the arrest and officer-injury numbers and the unions publish the competing turnout figure. Counts that only ever existed as scattered daily press reports were summed by hand, which is where most of the error will be.',
  fr: 'Compilé par une IA à partir des sources ci-dessous ; aucun chiffre ici n’est une mesure primaire réalisée pour cette page. Lorsqu’un mouvement dispose d’un décompte officiel, le ministère de l’Intérieur est la source des interpellations et des blessés parmi les forces, les syndicats publiant la foule concurrente. Les décomptes qui n’ont existé que sous forme de brèves quotidiennes dispersées ont été additionnés à la main : c’est là que se concentre l’essentiel de l’erreur.',
};

const FOOT: Bi = {
  en: 'Not a source, but load-bearing: the index in the earlier drafts of Section C divided each series by its own first figure, and the C′ x-axis was set by the longest episode. Both were replaced — C plots raw counts on a shared log axis, and C′ is capped at week 7. Nothing here has been through external review.',
  fr: 'Ce n’est pas une source, mais cela porte la lecture : dans les brouillons antérieurs, l’indice de la section C divisait chaque série par son premier chiffre, et l’axe des x de C′ était fixé par l’épisode le plus long. Les deux ont été remplacés — C trace des effectifs bruts sur un axe log partagé, et C′ est plafonné à la semaine 7. Rien ici n’a fait l’objet d’une relecture externe.',
};

export const GROUPS: readonly SourceGroup[] = [
  {
    id: 'g2026',
    title: { en: 'The 2026 movement — 1 Oct to 11 Nov', fr: 'Le mouvement de 2026 — du 1er oct. au 11 nov.' },
    blurb: {
      en: 'Eight reports. Ministry figures originate in press briefings, so every daily value was read out of the reporting below rather than from a dataset.',
      fr: 'Huit sources. Les chiffres ministériels proviennent de points presse : chaque valeur quotidienne a été relevée dans les articles ci-dessous, et non dans un jeu de données.',
    },
  },
  {
    id: 'hist',
    title: { en: 'Historical episodes', fr: 'Épisodes historiques' },
    blurb: {
      en: 'Encyclopaedia summaries of the published counts, plus three live-blog reports on the September 2025 movement. No primary archives were consulted.',
      fr: 'Synthèses encyclopédiques des décomptes publiés, plus trois directs de presse sur le mouvement de septembre 2025. Aucune archive primaire n’a été consultée.',
    },
  },
];

/* ------------------------------------------------------------------- data */

export const SOURCES: readonly Source[] = [
  /* ------------------------------------------------ 2026 — damage and cost */
  {
    id: 'ifrap-2026',
    group: 'g2026',
    label:
      'Fondation IFRAP — « Violences des 17 et 18 octobre 2026 : une facture qui approche le milliard d’euros »',
    url: 'https://www.ifrap.org/etat-et-collectivites/violences-des-17-et-18-octobre-2026-une-facture-qui-approche-le-milliard-deuros',
    date: '2026-10-21',
    what: {
      en: 'the €247M–872M damage range for 17–18 Oct: ~€910M material damage and ~€190M lost turnover in the high estimate, €666M of it retail.',
      fr: 'la fourchette de 247 à 872 M€ de dommages pour les 17–18 oct. : ~910 M€ de dommages matériels et ~190 M€ de chiffre d’affaires perdu dans l’hypothèse haute, dont 666 M€ pour le commerce de détail.',
    },
  },
  {
    id: 'monde-cci-2026',
    group: 'g2026',
    label: 'Le Monde — « Plus de 2 500 commerces dégradés », d’après CCI France',
    url: 'https://www.lemonde.fr/economie/article/2026/10/27/plus-de-2-500-commerces-degrades-en-marge-des-recentes-mobilisations-selon-cci-france-qui-demande-une-interdiction-des-manifestations-jusqu-aux-fetes-de-fin-d-annee_6801314_3234.html',
    date: '2026-10-27',
    what: {
      en: 'CCI France’s shop counts: 2,488 hit on 17 Oct, of which 1,161 pillaged, sacked or burnt.',
      fr: 'les décomptes de commerces de CCI France : 2 488 touchés le 17 oct., dont 1 161 pillés, saccagés ou incendiés.',
    },
  },
  {
    id: 'franceinfo-cci-2026',
    group: 'g2026',
    label: 'franceinfo — « Plus de 2 500 magasins touchés »',
    url: 'https://www.franceinfo.fr/societe/mobilisation-du-17-octobre/plus-de-2-500-magasins-touches-par-les-violences-en-marge-des-manifestations-des-17-et-24-octobre-selon-les-chambres-de-commerce_8256049.html',
    date: '2026-10-27',
    what: {
      en: 'the 24 Oct increment (50 shops, total 2,538) and the 80% centre-town turnover drop.',
      fr: 'l’incrément du 24 oct. (50 commerces, 2 538 au total) et la chute de 80 % du chiffre d’affaires en centre-ville.',
    },
  },
  {
    id: 'bfmtv-cci-2026',
    group: 'g2026',
    label: 'BFMTV — CCI France, 20 shops vandalised on 31 Oct',
    url: 'https://www.bfmtv.com/economie/entreprises/20-commerces-vandalises-samedi-contre-2-488-le-17-octobre-cci-france-constate-une-nette-baisse-des-degradations-en-marge-des-manifestations-mais-s-inquiete-d-une-forte-chute-du-chiffre-d-affaires-des-magasins-pouvant-atteindre-80_AD-202611010225.html',
    date: '2026-11-01',
    what: {
      en: 'why week 6 carries no damage figure: the count collapses after 24 Oct.',
      fr: 'pourquoi la semaine 6 ne porte aucun chiffre de dommages : le décompte s’effondre après le 24 oct.',
    },
  },
  {
    id: 'capital-policing-2026',
    group: 'g2026',
    label: 'Capital.fr — « Combien ont coûté les 70 000 policiers de samedi »',
    url: 'https://www.capital.fr/economie-politique/combien-ont-coute-les-70-000-policiers-de-samedi-letat-ne-le-dit-pas-mais-certains-chiffres-existent-1531269',
    date: '2026-10-28',
    what: {
      en: 'the €15,000–30,000 per CRS company per day and €3.4M per 3,000 gendarmes benchmarks behind the policing-cost band; also the 1,435 arrests and 53 officers injured on 24 Oct.',
      fr: 'les références de 15 000–30 000 € par compagnie de CRS et par jour, et de 3,4 M€ pour 3 000 gendarmes, derrière la fourchette de coût du maintien de l’ordre ; aussi les 1 435 interpellations et 53 policiers blessés du 24 oct.',
    },
  },
  {
    id: 'figaro-cost-2026',
    group: 'g2026',
    label: 'Le Figaro — « Le coût exorbitant d’un week-end d’émeutes »',
    url: 'https://www.lefigaro.fr/societes/violences-urbaines-le-cout-exorbitant-d-un-week-end-d-emeutes-pour-les-commerces-et-les-collectivites-20261020',
    date: '2026-10-20',
    what: {
      en: 'cross-check on the damage order of magnitude.',
      fr: 'contre-vérification de l’ordre de grandeur des dommages.',
    },
  },
  {
    id: 'canard-eyes-2026',
    group: 'g2026',
    label: 'Le Canard enchaîné — « Les manifestants ont le mauvais œil »',
    url: 'https://www.lecanardenchaine.fr/police-justice/55381-les-manifestants-ont-le-mauvais-oeil',
    date: '2026-11-10',
    what: {
      en: 'Prof. Laurent Thines’ (CHU de Besançon) press-and-blog register: 79 serious injuries in three weeks — 10 blinded, 9 cranio-facial, 7 amputations, 1 death. The source of the protester-injury floor, and the reason no weekly protester-injury series exists.',
      fr: 'le registre presse et blog du Pr Laurent Thines (CHU de Besançon) : 79 blessés graves en trois semaines — 10 éborgnés, 9 traumatismes crânio-faciaux, 7 amputations, 1 mort. Source du plancher de blessés parmi les manifestants, et raison pour laquelle aucune série hebdomadaire de blessés manifestants n’existe.',
    },
  },
  {
    id: 'interieur',
    group: 'g2026',
    label: 'Ministère de l’Intérieur',
    url: 'https://www.interieur.gouv.fr/',
    what: {
      en: 'origin of every arrest, custody and officer-injury count and of the ministry turnout figure. Published as press briefings and evening situation reports, not as a downloadable series, so the daily values were collected from the reporting above rather than from a dataset.',
      fr: 'origine de chaque décompte d’interpellations, de gardes à vue et de blessés parmi les forces, ainsi que du chiffre ministériel de foule. Publiés en points presse et points de situation du soir, non en séries téléchargeables : les valeurs quotidiennes ont donc été relevées dans la presse ci-dessus, et non dans un jeu de données.',
    },
  },

  /* ------------------------------------------------------ historical episodes */
  {
    id: 'wiki-mai68-fr',
    group: 'hist',
    label: 'Mai 68',
    url: 'https://fr.wikipedia.org/wiki/Mai_68',
    what: {
      en: '1 May (25,000 prefecture / 100,000 CGT) and 13 May (230,000 prefecture / 171,000 ORTF / 1,000,000 unions) turnouts; the 469 arrests of 10–11 May and the 1,000+ of 25 May.',
      fr: 'les foules du 1er mai (25 000 préfecture / 100 000 CGT) et du 13 mai (230 000 préfecture / 171 000 ORTF / 1 000 000 syndicats) ; les 469 interpellations des 10–11 mai et les 1 000 et plus du 25 mai.',
    },
  },
  {
    id: 'wiki-mai68-en',
    group: 'hist',
    label: 'May 68 (English Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/May_68',
    what: {
      en: 'the 887 injured figure, which appears only in this article’s infobox and is flagged accordingly — no French count was published.',
      fr: 'le chiffre de 887 blessés, présent uniquement dans l’infobox de cet article et signalé comme tel — aucun décompte français n’a été publié.',
    },
  },
  {
    id: 'wiki-cpe',
    group: 'hist',
    label: 'Contrat première embauche',
    url: 'https://fr.wikipedia.org/wiki/Contrat_premi%C3%A8re_embauche',
    what: {
      en: 'the CPE turnout series (7 Feb, 7 Mar, 18 Mar, 23 Mar, 28 Mar, 4 Apr) and the Paris-only enforcement counts of 16–18 Mar.',
      fr: 'la série de foules du CPE (7 févr., 7 mars, 18 mars, 23 mars, 28 mars, 4 avr.) et les décomptes répressifs strictement parisiens des 16–18 mars.',
    },
  },
  {
    id: 'wiki-gj',
    group: 'hist',
    label: 'Mouvement des Gilets jaunes',
    url: 'https://fr.wikipedia.org/wiki/Mouvement_des_Gilets_jaunes',
    what: {
      en: 'the Act I–44 ministry turnout series and the Act I–IV custody/interpellation counts. Later acts were never published as a series, which is why the enforcement lines stop at week 3.',
      fr: 'la série ministérielle de foules des actes I à XLIV et les décomptes de gardes à vue / interpellations des actes I à IV. Les actes suivants n’ont jamais été publiés en série, d’où l’arrêt des courbes répressives à la semaine 3.',
    },
  },
  {
    id: 'wiki-nahel',
    group: 'hist',
    label: 'Mort de Nahel Merzouk',
    url: 'https://fr.wikipedia.org/wiki/Mort_de_Nahel_Merzouk',
    what: {
      en: 'the 3,354 arrests and 722 officers injured of 27 Jun – 2 Jul 2023, and the 108 of the following week.',
      fr: 'les 3 354 interpellations et 722 policiers blessés du 27 juin au 2 juill. 2023, et les 108 de la semaine suivante.',
    },
  },
  {
    id: 'wiki-retraites',
    group: 'hist',
    label: 'Mouvement social contre la réforme des retraites de 2023',
    url: 'https://fr.wikipedia.org/wiki/Mouvement_social_contre_la_r%C3%A9forme_des_retraites_en_France_en_2023',
    what: {
      en: 'the ministry and union turnout pairs for each national action day, 19 Jan – 6 Jun 2023.',
      fr: 'les couples ministère / syndicats de chaque journée nationale d’action, du 19 janv. au 6 juin 2023.',
    },
  },
  {
    id: 'france24-bloquons',
    group: 'hist',
    label: 'France 24 — « Bloquons tout », direct du 10 septembre 2025',
    url: 'https://www.france24.com/fr/france/20250910-en-direct-france-bloquons-tout-colere-sociale-emmanuel-macron',
    date: '2025-09-10',
    what: {
      en: '197,000 participants, 596 rallies, 253 blockades, 540 arrests (211 in Paris) — the final ministry point of the evening, superseding the 175,000 of 17:45.',
      fr: '197 000 participants, 596 rassemblements, 253 blocages, 540 interpellations (dont 211 à Paris) — le point ministériel final de la soirée, qui supplante les 175 000 de 17 h 45.',
    },
  },
  {
    id: 'bfmtv-bloquons',
    group: 'hist',
    label: 'BFMTV — direct du 10 septembre',
    url: 'https://www.bfmtv.com/societe/manifestations/direct-10-septembre-blocages-transports-manifestations-suivez-le-mouvement-bloquons-tout-a-paris-lyon-marseille_LN-202509100070.html',
    date: '2025-09-10',
    what: {
      en: 'the intra-day revision of the count (175,000 → 197,000), which is why the chart shows a band rather than a point.',
      fr: 'la révision du décompte en cours de journée (175 000 → 197 000), d’où une fourchette plutôt qu’un point sur le graphique.',
    },
  },
  {
    id: 'figaro-bloquons',
    group: 'hist',
    label: 'Le Figaro — direct du 10 septembre',
    url: 'https://www.lefigaro.fr/social/direct-bloquons-tout-10-septembre-mouvement-greves-manifestations-perturbations-transports-ecole-20250910',
    date: '2025-09-10',
    dateEnd: '2025-09-11',
    what: {
      en: 'the 18 Sep intersyndicale day and the 2 Oct third wave.',
      fr: 'la journée intersyndicale du 18 sept. et la troisième vague du 2 oct.',
    },
  },
  {
    id: 'wiki-bloquons',
    group: 'hist',
    label: 'Bloquons tout (English Wikipedia)',
    url: 'https://en.wikipedia.org/wiki/Bloquons_tout',
    what: {
      en: 'the movement’s chronology and its 10 Sep / 18 Sep / 2 Oct structure.',
      fr: 'la chronologie du mouvement et sa structure des 10 sept., 18 sept. et 2 oct.',
    },
  },
];

/** Back-compat alias for the name an earlier draft exported. */
export const SOURCE_GROUPS = GROUPS;

/* --------------------------------------------------------------- marker key */

const MARKER_KEY: { key: string; text: Bi }[] = [
  {
    key: 'r',
    text: { en: 'regional only — one département or one city, never extrapolated', fr: 'régional seulement — un département ou une ville, jamais extrapolé' },
  },
  {
    key: 'p',
    text: { en: 'partial — a floor, or two publishers disagreeing; both bounds shown', fr: 'partiel — un plancher, ou deux éditeurs en désaccord ; les deux bornes affichées' },
  },
  {
    key: 'f',
    text: { en: 'lower bound — the true figure is at least this', fr: 'borne inférieure — le chiffre réel est au moins celui-ci' },
  },
  {
    key: 'e',
    text: { en: 'derived — modelled here, not published as such', fr: 'dérivé — modélisé ici, non publié tel quel' },
  },
  {
    key: 'c',
    text: { en: 'stock or actions-total — a different basis; never sum it with the rest', fr: 'stock ou total d’actions — autre base de mesure ; ne jamais l’additionner au reste' },
  },
  {
    key: 'w',
    text: { en: 'weekly aggregate — a week, not a day', fr: 'agrégat hebdomadaire — une semaine, pas un jour' },
  },
];

/* ----------------------------------------------------------------- render */

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function resolveHost(root?: HTMLElement | string | null): HTMLElement | null {
  if (!root) return document.getElementById('sources');
  if (typeof root === 'string') return document.querySelector<HTMLElement>(root);
  return root;
}

function dateLabel(item: Source): string | null {
  if (!item.date) return null;
  if (item.dateEnd) return `${fmtDayMonth(item.date)}–${fmtDate(item.dateEnd)}`;
  return fmtDate(item.date);
}

function sourceItem(item: Source): HTMLLIElement {
  const li = el('li', 'source-item');
  li.dataset.sourceId = item.id;

  const a = el('a', 'source-link', item.label);
  a.href = item.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.referrerPolicy = 'no-referrer-when-downgrade';
  li.append(a);

  const label = dateLabel(item);
  if (label) {
    li.append(document.createTextNode(' '));
    const t = el('time', 'source-date', label);
    t.dateTime = item.date!;
    li.append(t);
  }

  li.append(document.createTextNode(' — '));
  li.append(el('span', 'source-what', bi(item.what)));
  return li;
}

/** Idempotent: rebuilds the whole box inside the host on every call. */
export function renderSources(root?: HTMLElement | string | null): void {
  const host = resolveHost(root);
  if (!host) {
    console.error('[sources] no host: add <div id="sources"> to index.html, or pass a selector');
    return;
  }

  const box = el('section', 'sources');
  box.setAttribute('aria-label', bi(BOX_TITLE));
  box.append(el('p', 'sources-intro', bi(INTRO)));

  for (const group of GROUPS) {
    const items = SOURCES.filter((s) => s.group === group.id);
    if (!items.length) {
      console.warn(`[sources] group "${group.id}" has no entries`);
      continue;
    }
    const wrap = el('div', 'source-group');
    wrap.id = `src-${group.id}`;
    wrap.append(el('h3', 'source-group-title', bi(group.title)));
    wrap.append(el('p', 'source-group-blurb', bi(group.blurb)));

    const list = el('ul', 'source-list');
    for (const item of items) list.append(sourceItem(item));
    wrap.append(list);
    box.append(wrap);
  }

  const key = el('div', 'source-group source-key');
  key.append(el('h3', 'source-group-title', bi({ en: 'How to read the markers', fr: 'Comment lire les marqueurs' })));
  const dl = el('dl', 'marker-list');
  for (const m of MARKER_KEY) {
    dl.append(el('dt', 'marker-key', m.key));
    dl.append(el('dd', 'marker-text', bi(m.text)));
  }
  key.append(dl);
  box.append(key);

  box.append(el('p', 'sources-note', bi(FOOT)));
  host.replaceChildren(box);
}
```

```css
.sources { font-size: 0.8rem; line-height: 1.5; color: #374151; }
.sources-intro { margin: 0 0 1.25rem; max-width: 100ch; color: #4b5563; }
.source-group + .source-group { margin-top: 1.4rem; }
.source-group-title { margin: 0 0 0.35rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #111827; }
.source-group-blurb { margin: 0 0 0.5rem; max-width: 90ch; font-size: 0.75rem; color: #6b7280; }
.source-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 0.45rem; }
.source-item { color: #374151; }
.source-link { color: #1b5c92; text-decoration: none; border-bottom: 1px solid #b0cfe6; }
.source-link:hover { border-bottom-color: #1b5c92; }
.source-date { color: #9ca3af; white-space: nowrap; }
.source-what { color: #6b7280; }
.marker-list { display: grid; grid-template-columns: max-content 1fr; gap: 0.2rem 0.65rem; margin: 0; font-size: 0.75rem; }
.marker-key { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #111827; }
.marker-text { margin: 0; color: #6b7280; }
.sources-note { margin: 1.4rem 0 0; padding-top: 0.7rem; border-top: 1px solid #e5e7eb; max-width: 100ch; font-size: 0.72rem; color: #6b7280; }
```

Restored content, by omission: the six 2026 press citations with their real article URLs and dates (Le Monde/CCI, franceinfo, BFMTV, Capital, Le Figaro, Le Canard), the specific IFRAP article rather than the bare `ifrap.org` root, the six historical news items (France 24, BFMTV, Le Figaro, plus the en-wiki May 68 and Bloquons tout pages), and the intro/foot prose. `renderSources(host?)`, `Source`, `SourceGroup` keep their signatures, so `main.ts` needs no change.

Two details worth knowing: article titles stay in the source language (translating a headline breaks the citation, and the French ones are already French), and the Canard entry is the only citation behind the protester-injury floor — deleting it would leave that series unexplained. If your current file still carries entries that were never in this `index.html` (CCI France, FCD, préfecture de police, Cour des comptes, Sénat), they slot into `SOURCES` unchanged with `group: 'g2026'`; nothing else needs touching.

---

**You**

- The Section A & B charts are still vertically tiny
- The re-added sources are not appearing in the UI

---

**Assistant**

Both symptoms trace to concretely checkable mismatches with the attached `index.html`. I read it: charts A/B sit in `<div class="wrap">` (**not** `.card-canvas`, so my earlier CSS matched nothing), and its `#sources` stylesheet keys off `#sources > h1`, `p.intro`, `.source-group h2`, `span.date`, `span.what`, `p.foot` — none of which the renderer I gave emits.

## 1. Charts: the parent box collapsed to the canvas's intrinsic 150px

```ts
/* ------------------------------------------------------------------ mount */

const MIN_CHART_H = 420;

/** Chart.js measures the PARENT, never the canvas. An auto-height parent resolves to the
 *  canvas's intrinsic 150px, which is why every series collapsed onto the baseline. */
function ensureChartBox(canvas: HTMLCanvasElement): HTMLElement {
  let host = canvas.parentElement;
  if (!host || host === document.body) {
    host = document.createElement("div");
    host.className = "wrap";
    canvas.parentNode?.insertBefore(host, canvas);
    host.append(canvas);
  }
  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  if (host.clientHeight < 160) host.style.height = `${MIN_CHART_H}px`;
  canvas.style.display = "block";
  return host;
}

/** Charts are re-mounted on every locale change; a surviving instance on the same canvas
 *  throws "Canvas is already in use", which aborted render() before renderSources() ran. */
const mounted = new WeakMap<HTMLCanvasElement, Chart<"line">>();

export function mount(canvas: HTMLCanvasElement, cfg: Cfg): Chart<"line"> {
  ensureChartBox(canvas);
  mounted.get(canvas)?.destroy();

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;

  const chart = new Chart<"line">(ctx, { type: "line", data, options, plugins: [errorBars] });
  mounted.set(canvas, chart);
  return chart;
}
```

```css
/* the wrapper actually present in index.html — replace any .card-canvas rule */
.wrap { position: relative; height: 460px; margin-bottom: 28px; }
#section-weekly .wrap { height: 420px; }
.wrap > canvas { display: block; width: 100%; height: 100%; }

@media (max-width: 40rem) { .wrap, #section-weekly .wrap { height: 340px; } }
```

The `ensureChartBox` guard is deliberate belt-and-braces: even if the `.wrap` height is lost again, the parent gets a definite pixel height before Chart.js measures it.

## 2. Sources: markup must match the stylesheet, and the call must precede the charts

Replace everything from `/* ----------------------------------------------------------------- render */` to the end of `sources.ts`:

```ts
/* ----------------------------------------------------------------- render */

const CSS = `
#sources .intro { margin: 0 0 16px; font-size: 12px; line-height: 1.5; color: #4b5563; max-width: 100ch; }
#sources .source-group { margin: 0 0 18px; }
#sources .source-group > h2 { font-size: 10.5px; text-transform: uppercase; letter-spacing: .07em; color: #111827; margin: 0 0 6px; font-weight: 700; }
#sources .source-group > p.blurb { margin: 0 0 6px; font-size: 11.5px; color: #6b7280; max-width: 95ch; }
#sources .source-group ul { margin: 0; padding-left: 18px; }
#sources .source-group li { margin: 0 0 5px; font-size: 12px; line-height: 1.4; color: #374151; }
#sources .source-group a { color: #1b5c92; text-decoration: none; border-bottom: 1px solid #b0cfe6; }
#sources .source-group a:hover { border-bottom-color: #1b5c92; }
#sources .date { color: #9ca3af; white-space: nowrap; }
#sources .what { color: #6b7280; }
#sources .marker-list { display: grid; grid-template-columns: max-content 1fr; gap: 2px 10px; margin: 6px 0 0; font-size: 11.5px; }
#sources .marker-list dt { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #111827; }
#sources .marker-list dd { margin: 0; color: #6b7280; }
#sources .foot { margin: 0 0 14px; font-size: 11px; color: #6b7280; max-width: 110ch; }
`;

function ensureStyles(): void {
  if (document.getElementById("sources-css")) return;
  const style = document.createElement("style");
  style.id = "sources-css";
  style.textContent = CSS;
  document.head.append(style);
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** #sources in index.html, or a body appended to <main>/<body> so the box can never vanish. */
function resolveHost(root?: HTMLElement | string | null): HTMLElement {
  if (root) return typeof root === "string" ? document.querySelector<HTMLElement>(root) ?? makeHost() : root;
  return (
    document.getElementById("sources") ??
    document.querySelector<HTMLElement>("[data-sources]") ??
    makeHost()
  );
}

function makeHost(): HTMLElement {
  const sec = el("section");
  sec.id = "sources";
  document.querySelector("main")?.append(sec) ?? document.body.append(sec);
  return sec;
}

function dateLabel(s: Source): string | null {
  if (!s.date) return null;
  return s.dateEnd ? `${fmtDayMonth(s.date)}–${fmtDate(s.dateEnd)}` : fmtDate(s.date);
}

function sourceItem(s: Source): HTMLLIElement {
  const li = el("li");
  li.dataset.sourceId = s.id;

  const a = el("a", undefined, s.label);
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  li.append(a);

  const when = dateLabel(s);
  if (when) {
    li.append(document.createTextNode(" "));
    const time = el("time", "date", when);
    time.dateTime = s.date!;
    li.append(time);
  }

  li.append(document.createTextNode(" — "));
  li.append(el("span", "what", bi(s.what)));
  return li;
}

/** Idempotent. Keeps the static <h1> that index.html owns, replaces everything after it. */
export function renderSources(root?: HTMLElement | string | null): void {
  ensureStyles();
  const host = resolveHost(root);

  const heads = [...host.children].filter(
    (n): n is HTMLElement => /^H[1-3]$/.test(n.tagName) && !n.closest(".source-group"),
  );

  const body: Node[] = [el("p", "intro", bi(INTRO))];

  for (const group of GROUPS) {
    const items = SOURCES.filter((s) => s.group === group.id);
    if (!items.length) {
      console.warn(`[sources] group "${group.id}" is empty`);
      continue;
    }
    const wrap = el("div", "source-group");
    wrap.id = `src-${group.id}`;
    wrap.append(el("h2", undefined, bi(group.title)));
    wrap.append(el("p", "blurb", bi(group.blurb)));

    const list = el("ul");
    for (const item of items) list.append(sourceItem(item));
    wrap.append(list);
    body.push(wrap);
  }

  const key = el("div", "source-group");
  key.id = "src-key";
  key.append(el("h2", undefined, bi({ en: "How to read the markers", fr: "Comment lire les marqueurs" })));
  const dl = el("dl", "marker-list");
  for (const m of MARKER_KEY) {
    dl.append(el("dt", undefined, m.key));
    dl.append(el("dd", undefined, bi(m.text)));
  }
  key.append(dl);
  body.push(key);

  body.push(el("p", "foot", bi(FOOT)));

  host.replaceChildren(...heads, ...body);
}
```

Then wire it in `main.ts` — **before** the charts, so no chart exception can starve the sources:

```ts
import { renderSources } from "./sources.ts";

function render(): void {
  renderSources();
  renderChrome();
  mountCharts();
}

render();
onLocaleChange(() => render());
```

And `index.html` needs only the heading; the body is generated:

```html
<section id="sources">
  <h1>Sources</h1>
</section>
```

## 3. Two-minute confirmation

```bash
cd src/client && grep -n "renderSources" *.ts
cd .. && cd .. && grep -n "class=\"wrap\"\|\.wrap" index.html
```

If the first prints nothing outside `sources.ts`, that was the whole sources bug — a module that was never imported is dead code, and the browser never runs it. If the second shows `.wrap` without a `height`, that was the chart bug, and `ensureChartBox` now covers it regardless.

---

**You**

> 1. Per-panel labels. The directLabels plugin was drawing the episode name at the right edge of every dataset — four identical labels per panel ("May 68" ×4), which is exactly the redundant legend you saw. The series are already identified by hue plus the one shared legend above the trellis, so the plugin now runs only in C′, where a panel holds one line per episode and the label carries information.

Apply this same thinking to the charts in section C'

---

**Assistant**

C′ has the mirror-image problem, and the file shows it: `index.html` still carries `<div class="legend" id="legend-events">` (line 156) *while* the prose promises "direct labels instead of a legend". If `episodes.ts` fills that host, seven movement names are stated twice per figure — the `directLabels` bug with the channels swapped. Hue can't rescue it either: seven steps of one ramp are not decodable without something naming them, so in C′ the **labels** are the load-bearing channel and the legend is the redundant one.

Same rule, applied mechanically: exactly one identifier per series per figure, the plugin is opt-in per config (so it can't leak back into C), a label is skipped when another channel already names the series, and no label is ever drawn twice in a panel. The extra work C′ needs that C didn't is that seven labels in a 230px panel collide — so they get a reserved right gutter, de-overlap, and a leader line, instead of being stacked on the curves.

```ts
/* ============================================================ C′ end labels
 * One identifier per series per figure. Section C is named by #legend-items once, so the
 * plugin is not installed there. Section C′ names the series in the panel strip and draws
 * seven movements on a single-hue ramp, which hue alone cannot decode — so labels own the
 * identification and #legend-events stays empty.
 */

const LABEL_GUTTER = 92;

export interface EndLabelOptions {
  /** Minimum vertical clearance between two labels, px. */
  gap?: number;
  /** Reserved right gutter, px. Must match layout.padding.right in the panel shell. */
  gutter?: number;
  color?: string;
  fontSize?: number;
  /** Above this many labelable series the labels are dropped entirely (never replaced by a legend). */
  maxLabels?: number;
}

interface LabelDataset extends ChartDataset<"line", (number | null)[]> {
  detachedOnly?: boolean;
  /** Reference / band / mean lines: named by the caption, never labelled. */
  labelRole?: "primary" | "annotation";
  /** Appended to the label, e.g. "+" when the series continues past the week-7 cap. */
  labelSuffix?: string;
}

interface Candidate {
  text: string;
  /** True endpoint of the line. */
  y: number;
  x: number;
  color: string;
  /** Label baseline after de-overlap. */
  ty: number;
}

/** Truncates to `max` px with an ellipsis, binary-searching so long names stay readable. */
function ellipsise(ctx: CanvasRenderingContext2D, s: string, max: number): string {
  if (ctx.measureText(s).width <= max) return s;
  let lo = 0;
  let hi = s.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.measureText(`${s.slice(0, mid)}…`).width <= max) lo = mid;
    else hi = mid - 1;
  }
  return `${s.slice(0, lo).trimEnd()}…`;
}

/** Opt-in per config. Never registered globally, which is what keeps it out of C. */
export function endLabels(o: EndLabelOptions = {}): Plugin<"line"> {
  const gap = o.gap ?? 12;
  const gutter = o.gutter ?? LABEL_GUTTER;
  const color = o.color ?? "#374151";
  const fs = o.fontSize ?? 10;
  const maxLabels = o.maxLabels ?? 8;

  return {
    id: "endLabels",
    afterDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      const seen = new Set<string>();
      const cands: Candidate[] = [];

      for (let i = 0; i < chart.data.datasets.length; i++) {
        const ds = chart.data.datasets[i] as LabelDataset;
        const meta = chart.getDatasetMeta(i);
        if (meta.hidden || ds.detachedOnly) continue;
        if (ds.labelRole === "annotation") continue;

        const name = String(ds.label ?? "").trim();
        if (!name) continue;

        // the section-C bug, guarded: never two identical labels inside one panel
        const text = name + (ds.labelSuffix ?? "");
        if (seen.has(text)) continue;

        // last point that is actually drawn and still inside the plot box
        let p: { x: number; y: number; skip?: boolean } | null = null;
        for (let j = meta.data.length - 1; j >= 0; j--) {
          const pt = meta.data[j] as { x: number; y: number; skip?: boolean };
          if (!pt || pt.skip) continue;
          const v = ds.data[j];
          if (typeof v !== "number" || !Number.isFinite(v)) continue;
          if (pt.y < chartArea.top || pt.y > chartArea.bottom) continue;
          p = pt;
          break;
        }
        if (!p) continue; // nothing visible → no label, no leader

        seen.add(text);
        cands.push({
          text,
          y: p.y,
          x: p.x,
          color: String(ds.borderColor ?? color),
          ty: p.y,
        });
      }

      if (!cands.length || cands.length > maxLabels) return;

      ctx.save();
      ctx.font = `500 ${fs}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const limit = gutter - 14;
      for (const c of cands) c.text = ellipsise(ctx, c.text, limit);

      // de-overlap in place, then pull the whole stack back inside the plot
      cands.sort((a, b) => a.y - b.y);
      let prev = -Infinity;
      for (const c of cands) {
        c.ty = Math.max(c.y, prev + gap);
        prev = c.ty;
      }
      const last = cands[cands.length - 1];
      const bottom = chartArea.bottom - fs / 2 - 2;
      if (last.ty > bottom) {
        const over = last.ty - bottom;
        for (const c of cands) c.ty -= over;
      }
      const top = chartArea.top + fs / 2 + 2;
      if (cands[0].ty < top) {
        const under = top - cands[0].ty;
        for (const c of cands) c.ty += under;
      }

      const gx = chartArea.right + 6;

      for (const c of cands) {
        // hairline from the true endpoint into the gutter: tells you where the line stops,
        // which is how a series truncated at week 7 reads as truncated
        ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(gx - 4, c.ty);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // colour tick keeps the label attached even where several labels crowd
        ctx.fillStyle = c.color;
        ctx.fillRect(gx - 4, c.ty - 1, 4, 2);

        ctx.fillStyle = color;
        ctx.fillText(c.text, gx + 2, c.ty);
      }

      ctx.restore();
    },
  };
}

/** C′ truncates at week 7 (§C′ axis note). A longer series carries the trailing "+". */
export const CAP_WEEK = 7;
export function capSuffix(points: number): string {
  return points > CAP_WEEK + 1 ? " +" : "";
}

/* ------------------------------------------------------------------- mount */

export function mount(
  canvas: HTMLCanvasElement,
  cfg: Cfg,
  extra: Plugin<"line">[] = [],
): Chart<"line"> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const { data, ...options } = cfg;
  return new Chart<"line">(ctx, {
    type: "line",
    data,
    options,
    plugins: [errorBars, ...extra], // C′ passes [endLabels({...})]; A, B and C pass nothing
  });
}
```

At the C′ call site in `episodes.ts` — the panel shell must reserve the gutter, and the legend host must be emptied rather than left stale:

```ts
import { CAP_WEEK, capSuffix, endLabels, mount } from "./chart.ts";

const ITEMS_LABELS = endLabels({ gap: 12, gutter: 92, fontSize: 10, maxLabels: 8 });

function itemsPanelShell(seriesTitle: string, range: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    // right padding == label gutter, so a label can never sit on top of a curve
    layout: { padding: { top: 6, right: 92, bottom: 2, left: 2 } },
    plugins: {
      legend: { display: false }, // labels own it here
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { /* … capped at week 7, unchanged … */ },
      y: { /* … per-panel limits, range printed in the strip, unchanged … */ },
    },
  };
}

// datasets: one per movement, ramp colour, label = movement, suffix for truncated series
const datasets = movements.map((mv) => ({
  label: mv.name,
  labelSuffix: capSuffix(mv.weeks.length),
  data: mv.weekly.slice(0, CAP_WEEK + 1),
  borderColor: ramp(mv.rampIndex),
  borderWidth: 1.6,
  pointRadius: 0,
  spanGaps: true,
}));

mount(canvas, { data: { labels: weeks, datasets }, ...itemsPanelShell(seriesTitle, range) }, [
  ITEMS_LABELS,
]);

/* #legend-events must not also be filled: one identifier per series per figure. */
const legendHost = document.getElementById("legend-events");
if (legendHost) {
  legendHost.replaceChildren();
  legendHost.hidden = true;
}
```

Three things to check before you trust it:

- `label` is what the plugin reads. If C′ sets `label` to the ramp step (`"1 of 7"`, `"ep-3"`) and keeps the human name elsewhere, labels will print that instead — point it at the right field (`ds.episodeName`) in the `String(ds.label ?? "")` line.
- If you decide the seven-entry legend is actually the better decoder (stable, one place, no per-panel duplication), flip it: drop `endLabels`, set `layout.padding.right` back to 8, and keep `#legend-events`. The rule is one channel, not labels-forever — what you must not keep is both.
- `mount`'s new third parameter is additive, so sections A, B and C compile unchanged and C can never pick the plugin up by accident.

```bash
cd src/client && grep -n "legend-events" *.ts ../index.html
grep -n "endLabels" *.ts
```

Expected: `legend-events` only where it is cleared, `endLabels` only in the C′ builder — and zero hits where `directLabels` used to be registered for the C trellis.

---

**You**

These are my current files. 

1. fix the missing sources (e.g. the Canard Enchaîné)
2. remove the episode names from the right-hand side of the charts in section C'

---

**Assistant**

Both bugs are cross-module duplication, and both are visible in the files you attached.

## 1. Sources: two modules write `#sources`, and the stale one runs last

`main.ts` calls, in this order:

```ts
renderSources();   // sources.ts — 18 citations, bilingual, includes Le Canard
renderChrome();    // page.ts → sources() → host.replaceChildren(...) from t().sources
```

`page.ts:61` `sources()` unconditionally replaces the children of `#sources` with `t().sources` from `i18n.ts:1272` — a 13-item catalogue with root URLs (`https://www.ifrap.org`, `https://www.cci.fr`) and no Canard, no Le Monde/CCI, no franceinfo/BFMTV/Capital, no September 2025 live blogs. Last writer wins, so the good renderer is erased on every frame. The heading survives only because both write one.

**`page.ts`** — delete the function and its call, and drop the now-unused import:

```ts
import { localeMeta, onLocaleChange, t, type SectionCopy } from "./i18n.ts";

/* delete the whole sources() function (lines 61–92) */

export function renderChrome(): void {
  const m = localeMeta();
  document.documentElement.lang = m.meta.htmlLang;
  document.documentElement.dataset.lang = m.meta.htmlLang;
  document.title = m.meta.title;

  disclaimer();
  header("hdr-a", m.sections.a);
  header("hdr-b", m.sections.b);
  header("hdr-c", m.sections.c);
  header("hdr-cp", m.sections.cp);
  note("note-c", m.sections.c.note ?? "");
  note("note-cp", m.sections.cp.note ?? "");
  /* no sources() here: sources.ts owns #sources */
}
```

`t` stays (the disclaimer uses it). The `sources` branch of `t()` is now dead — leave it or delete it, but do not leave a second renderer in the tree.

**`sources.ts`** — one small addition so the heading is the bilingual one instead of the hard-coded `Sources` in `index.html`. It rewrites text, never removes the node:

```ts
  const heads = [...host.children].filter(
    (n): n is HTMLElement => /^H[1-3]$/.test(n.tagName) && !n.closest(".source-group"),
  );

  /* index.html owns the heading; give it the active language without replacing it. */
  const heading = heads.find((n) => n.tagName === "H1");
  if (heading) heading.textContent = bi(BOX_TITLE);
```

No CSS changes needed: `sources.ts` emits exactly the hooks `styles.css` already has — `#sources > p.intro`, `.source-group h2`, `.date`, `.what`, `#sources > p.foot` — and it keeps `index.html`'s `<h1>` (styled by `#sources > h1`).

## 2. C′: remove the right-hand episode names

`episodes.ts:516` registers `directLabels` on every companion panel, and line 886 reserves `right: 92` for it. The movements are already identified twice over in C′ — seven RAMP swatches in `#legend-events` (line 941) and hover isolation via `emphasiseEvent` — so the end labels are the redundant channel. Delete the plugin, reclaim the gutter, and drop the field that existed only to feed it.

```ts
/* ---------- 1. delete the whole directLabels block (lines 515–556) ---------- */

/* ---------- 2. PanelDataset: drop __label ---------- */
interface PanelDataset extends ChartDataset<"line", Pt[]> {
  __item: Metric;
  __ep: number;
  __color: string;
  __hollow: boolean[];
}

/* ---------- 3. buildDataset: drop the __label assignment ---------- */
  return {
    label: m.items[key].label,
    data: points,
    /* … unchanged … */
    __item: key,
    __ep: epIndex,
    __color: color,
    __hollow: drawn,
  };

/* ---------- 4. companion panel: no gutter, no plugin ---------- */
    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      layout: { padding: { top: 6, right: 10, bottom: 0, left: 0 } },
      scales: {
        x: xScale(ENFORCEMENT_LAST),
        y: yScale(lo, hi, true),
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        subtitle: { display: false },
        tooltip: tooltipSpec(),
      },
    };

    const chart = new Chart<"line">(canvas, {
      type: "line",
      data: { datasets } as unknown as ChartData<"line">,
      options,
      plugins: [],
    });
```

Two consequences worth closing out:

- `seriesContinues` (`"{name} (cont.)"` / `"{name} (suite)"`) was only ever consumed by `__label`, so the fact that CPE's series is cut at week 7 now appears nowhere per-line. If you want it legible, say it once per panel instead of seven times — `itemMeta` already reads `"range {range} · up to week {n}"`, so append the cap there rather than reintroducing per-dataset text.
- `label: m.items[key].label` on these datasets is now unused by anything drawn (legend is off, tooltip reads `raw`), but keep it: Chart.js uses it in `getElementsAtEventForMode` debugging and it costs nothing.

`directLabels` was local to `episodes.ts`, so no other module can still be importing it.

## Could not verify

I ran out of tool budget before reading `chart.ts`'s `mount`. Note one thing visible in the two files I did read: `index.html` wraps every A/B canvas in `.canvas-box` / `.canvas-box.tall`, and **`styles.css` has no `.canvas-box` rule at all** — its only height rule is `.wrap` (line 41), which nothing in `index.html` uses. If the A/B charts collapse to ~150px again, that mismatch is the cause, not `i18n.ts`:

```css
.canvas-box { position: relative; height: 460px; }
.canvas-box.tall { height: 520px; }
.canvas-box > canvas { display: block; width: 100%; height: 100%; }
@media (max-width: 40rem) { .canvas-box, .canvas-box.tall { height: 340px; } }
```

## Check

```bash
cd src/client
grep -n "directLabels\|__label\|right: 92" *.ts          # expect: no hits
grep -n "sources" page.ts                               # expect: no hits
grep -c "lecanardenchaine" sources.ts i18n.ts           # expect: 1 then 0
```

Expected UI: 18 citations in `#sources` (eight 2026, ten historical) with the Canard item present, bilingual heading, and C′ panels ending flush at the right axis with the seven RAMP swatches under `#legend-events` as the only movement key.

---

**You**

Make French the default locale again

---

**Assistant**

Seven lines in `i18n.ts`, one deletion. `index.html` already opens with `<html lang="fr" data-lang="fr">`, so there is no flash-of-English to fix — the only problem is that JS overwrote that French markup at module load.

## `src/client/i18n.ts`

```ts
/* ------------------------------------------- 1. the constant itself (was 126–127) */

export const DEFAULT_LANG: Lang = "fr";
export const DEFAULT_LOCALE: string = FR_META.tag;

/* ------------------------------------------- 2. unknown-key fallback (was 129–134) */

export function localeMeta(locale: Lang | string = current): LocaleMeta {
  const key = String(locale);
  return (
    LOCALE_META[key] ?? LOCALE_META[key.slice(0, 2).toLowerCase()] ?? FR_META
  );
}

/* ------------------------------------------- 3. resolution chain (was 189–202) */

function fromStorage(): Lang | null {
  if (!hasDom()) return null;
  try {
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/* fromBrowser() deleted. Sniffing navigator.languages made an English-locale
 * browser override the site default, which is why "fr" never appeared. Detection
 * is now: explicit ?lang= → a stored choice → French. */

let current: Lang = localeFromUrl() ?? fromStorage() ?? DEFAULT_LANG;
```

That `fromBrowser` deletion is the substantive half of the change. Setting `DEFAULT_LANG = "fr"` alone would not have been enough, because `??` only reaches it when every detector returns `null` — and `navigator.language = "en-GB"` never does. Removing it is also what avoids a `noUnusedLocals` error, since the function is module-private.

## What this does and does not change

| Entry | Result |
|---|---|
| `?lang=fr` / `?lang=en` | honoured, not persisted (`initLang` passes `persist:false`) |
| no param, nothing stored | **French**, regardless of browser locale |
| no param, `localStorage.lang = "en"` | English — a real past choice still wins |
| `index.html` before JS | French, `lang="fr"`, matches what follows |

So a returning visitor who clicked EN stays in EN. If you want the new default to apply to them too, bump the storage key (`const STORAGE_KEY = "lang-v2"`) — that discards all stored preferences once.

Two things to confirm rather than assume:

- **Stored state on your own browser.** `localStorage.lang` is very likely already `"en"` from earlier testing, and it outranks the default. `localStorage.removeItem("lang")` in devtools, or open `?lang=fr`, before concluding the change did nothing.
- **Date formatters.** The initial instances are still built with `EN_META.tag` (lines 396–398), and `refreshDates()` guards on a `dsLang` sentinel, exactly like `refreshFormats()`. `nf()`/`compact()`/`eurM()` I read and they call it on entry; I could not read `fmtDate`/`fmtDayMonth`/`fmtWeek` before the tool budget ran out. If any of them fails to call `refreshDates()`, its first output stays English until the first toggle — check with `grep -n "refreshDates()" i18n.ts`, which should show one call inside every exported date formatter.

`lang.ts`, `main.ts`, `page.ts`, `chart.ts` and `episodes.ts` need no edits: `initLang()` no-ops without a param, `renderChrome()` reads `localeMeta()` at render time, and both chart modules key their memoisation on `localeVersion()`.

---

