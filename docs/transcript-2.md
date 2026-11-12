# French Protest Charts (Part V - Improvements)

*Created: 12/11/2026, 14:18:30*

---

**You**

Take the project in this GitHub repo: https://github.com/y1DWgTh1oTZIG/french-protest-charts

Make the following changes:
1. Add a link to the GitHub repo as an icon next to the language toggle
2. Sort the sources within each source group by publication date, earliest-first
3. Wrap each source group inside a collapsible `<details>` element

---

**Assistant**

I'll start by examining the repository structure.Read the repo (`src/client/{sources,page,lang,dom}.ts`, `docs/index.html`). Three edits: `docs/index.html` (icon markup), `src/client/page.ts` (localise the icon label), `src/client/sources.ts` (sorted groups + `<details>`), `docs/styles.css` (layout).

````html
<!-- docs/index.html — replace the <div class="lang-switch"> block with this -->
<div class="head-tools">
  <div class="lang-switch" data-lang-switch role="group" aria-label="Langue">
    <button type="button" data-set-lang="fr">FR</button>
    <button type="button" data-set-lang="en">EN</button>
  </div>
  <a
    class="repo-link"
    id="repo-link"
    href="https://github.com/y1DWgTh1oTZIG/french-protest-charts"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Code source sur GitHub"
  >
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  </a>
</div>
````

```ts
/* src/client/page.ts — add below the `$` helper; call repoLink() from renderChrome() */

const REPO_LABEL = {
  en: "Source code on GitHub",
  fr: "Code source sur GitHub",
} as const;

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

  repoLink(); // ← added
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

```ts
/* src/client/sources.ts — replace everything from `/* ----- render */` to EOF */

/* ----- render */

/** ISO strings compare lexicographically; undated sources sort last, stably. */
function byPublicationDate(a: Source, b: Source): number {
  if (!a.date || !b.date) {
    if (a.date !== b.date) return a.date ? -1 : 1;
    return a.id.localeCompare(b.id);
  }
  return a.date !== b.date
    ? (a.date < b.date ? -1 : 1)
    : (a.dateEnd ?? "").localeCompare(b.dateEnd ?? "") ||
        a.id.localeCompare(b.id);
}

/** Bucketed and sorted once: renderSources() re-runs on every locale change. */
const SOURCES_BY_GROUP: ReadonlyMap<GroupId, readonly Source[]> = (() => {
  const buckets = new Map<GroupId, Source[]>();
  for (const s of SOURCES) {
    const bucket = buckets.get(s.group);
    if (bucket) bucket.push(s);
    else buckets.set(s.group, [s]);
  }
  for (const bucket of buckets.values()) bucket.sort(byPublicationDate);
  return buckets;
})();

function dateLabel(s: Source): string | null {
  if (!s.date) return null;
  return s.dateEnd
    ? `${fmtDayMonth(s.date)}–${fmtDate(s.dateEnd)}`
    : fmtDate(s.date);
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

/** Collapsible group; `open` comes from the pre-render DOM so locale changes don't reset it. */
function sourceGroup(
  id: string,
  open: ReadonlyMap<string, boolean>,
  summary: Node[],
  body: Node[],
): HTMLDetailsElement {
  const details = el("details", "source-group");
  details.dataset.group = id;
  details.open = open.get(id) ?? true;

  const head = el("summary", "group-summary");
  head.append(...summary);
  details.append(head, ...body);
  return details;
}

/** Idempotent. Keeps the static <h1> that index.html owns, replaces everything after it. */
export function renderSources(
  host: HTMLElement | null = document.getElementById("sources"),
): void {
  if (!host) return; // boot() guarantees it; no silent re-append to <body>

  const kept = [...host.children].filter((n): n is HTMLElement =>
    /^H[1-6]$/.test(n.tagName),
  );
  // The page-level heading is static in index.html and therefore French-only;
  // give it the localised title so the box is right in both languages.
  if (kept[0]) kept[0].textContent = bi(BOX_TITLE);

  // Read the reader's open/closed choices before the subtree is replaced.
  const open = new Map<string, boolean>();
  for (const d of host.querySelectorAll<HTMLDetailsElement>(
    "details[data-group]",
  )) {
    open.set(d.dataset.group as string, d.open);
  }

  const box = el("div", "sources-box");
  box.append(el("p", "intro", bi(INTRO)));

  for (const group of GROUPS) {
    const items = SOURCES_BY_GROUP.get(group.id);
    if (!items || items.length === 0) continue;

    // count is derived, never typed into the blurb
    const title = el("h3", undefined, bi(group.title));
    title.append(" ", el("span", "count", String(items.length)));

    const list = el("ul");
    for (const s of items) list.append(sourceItem(s));

    box.append(
      sourceGroup(group.id, open, [title], [
        el("p", "blurb", bi(group.blurb)),
        list,
      ]),
    );
  }

  const dl = el("dl", "mention-list");
  for (const { name, note } of MENTIONS) {
    dl.append(el("dt", undefined, name), el("dd", undefined, bi(note)));
  }
  box.append(
    sourceGroup("mentions", open, [el("h3", undefined, bi(MENTIONS_TITLE))], [
      el("p", "blurb", bi(MENTIONS_BLURB)),
      dl,
    ]),
  );

  const key = el("dl", "marker-list");
  for (const { key: marker, text } of MARKER_KEY) {
    key.append(el("dt", undefined, marker), el("dd", undefined, bi(text)));
  }
  box.append(key, el("p", "foot", bi(FOOT)));

  host.replaceChildren(...kept, box);
}
```

```css
/* docs/styles.css — append */

/* ---- GitHub icon beside the language toggle ---- */
.head-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repo-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.repo-link svg {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
  fill: currentColor;
}

.repo-link:hover {
  background: rgb(0 0 0 / 6%);
}

.repo-link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* ---- collapsible source groups ---- */
.source-group > summary {
  cursor: pointer;
  list-style: none;
}

.source-group > summary::-webkit-details-marker {
  display: none;
}

.source-group > summary::before {
  content: "▸";
  display: inline-block;
  width: 1em;
  font-size: 0.8em;
  transform: translateY(-0.1em);
  transition: transform 0.15s ease;
}

.source-group[open] > summary::before {
  content: "▾";
}

.source-group > summary h3 {
  display: inline;
  margin: 0;
}

.source-group[open] > summary {
  margin-bottom: 0.5rem;
}
```

Build note: the page loads `bundle.js` from `docs/`, but `npm run build` writes to `public/` — regenerate with `npx esbuild src/client/main.ts --bundle --format=esm --target=es2022 --outfile=docs/bundle.js --sourcemap`.

Two things worth knowing: the anchor sits outside `[data-lang-switch]`, so `mountLangSwitch`'s click and arrow-key handlers (which query `[data-set-lang]`) ignore it; and if `.lang-switch` is absolutely positioned in the existing CSS, drop that rule so the new `.head-tools` flex row takes over. Sources without a `date` (ministry portals, maviligence, several overseas pages) can't be sorted by publication date, so they keep declaration order at the end of their group.

---

**You**

Review the GitHub repo for the current state of the code.

After the disclaimer, add a section containing the attached content, with each sub-section wrapped in a `<details>` element, and only the 'About This Project' sub-section open be default.

---

**Assistant**

I'll review the current state of the repo before writing code.The repo is in an earlier state than expected (no `.head-tools`). Let me check the i18n/copy architecture and file layout.Reviewed `main`. Current state: `docs/index.html` has the `.head-tools` + `#repo-link` icon (previous round applied), the disclaimer is an empty `<p id="disclaimer">`, `page.ts#renderChrome()` owns all chrome and re-runs on locale change, catalogue prose is plain text (`textContent`-only, no HTML), and `styles.css` already carries the `.source-group` `<details>` pattern to mirror. There is no `#about` container yet, so the section needs both a mount point and a renderer.

Content issues in the attachment worth knowing (handled below): one malformed link `[considering escape by helicopter)(https://…` (would render literally), the quote's attribution reads *The Spook Who Sat By the Soor*, and `docs/` has no `transcript-5.md` (transcripts 1–4 exist; 3 and 4 are byte-identical), so the "reviewing sources" link will 404.

**New file — `src/client/about.ts`**

```ts
/**
 * src/client/about.ts — the long-form notes shown directly after the disclaimer.
 *
 * One <details> per sub-section; only "About this project" starts open.
 * Idempotent: renderChrome() re-runs on every locale change, so the reader's
 * open/closed choices are read back off the DOM before the subtree is replaced.
 *
 * Copy lives here rather than in CATALOGUE because it is block-structured
 * (paragraphs, a list, a blockquote) and the catalogue is textContent-only.
 */
import { localeMeta, type Lang } from "./i18n";

/* ------------------------------------------------------------------ model */

type Run =
  | string
  | { readonly em: string }
  | { readonly link: string; readonly href: string };

type Block =
  | { readonly kind: "p"; readonly runs: readonly Run[] }
  | { readonly kind: "ul"; readonly items: readonly (readonly Run[])[] }
  | {
      readonly kind: "quote";
      readonly paras: readonly (readonly Run[])[];
      readonly by: readonly Run[];
    };

interface SubSection {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly Block[];
}

/** Only this sub-section is expanded on load. */
const OPEN_ID = "project";

const SECTION_LABEL: Record<Lang, string> = {
  en: "Notes on this project",
  fr: "Notes sur le projet",
};

/* ------------------------------------------------------------------- copy */

const BLOG =
  "https://www.lemonde.fr/societe/article/2026/11/09/a-brest-la-police-saisit-les-trombinoscopes-de-plusieurs-lycees-eleves-et-parents-denoncent-un-fichage_6808694_3224.html";
const RN_VOTE =
  "https://www.humanite.fr/politique/rassemblement-national/entre-les-67-de-vote-rn-dans-ses-rangs-et-lambiance-securitaire-en-vigueur-la-police-deja-prete-a-servir-lextreme-droite";
const HELICOPTER =
  "https://www.lavoixdunord.fr/506027/article/2018-12-13/un-helicoptere-etait-pret-samedi-au-cas-ou-pour-emmener-emmanuel-macron";
const STRATEGY =
  "https://lepoing.net/manifestation-du-7-novembre-a-montpellier-la-contestation-cherche-encore-sa-strategie/";
const BUNKER = "https://neru.tv/sources/macron-bunker-secret-pour-fuir-le-peuple/";
const PAGES = "https://y1dwgth1otzig.github.io/french-protest-charts/?lang=en";
const REPO = "https://github.com/y1DWgTh1oTZIG/french-protest-charts";
const SPOOK = "https://www.youtube.com/watch?v=HG-56GKbPtk&t=3896";

/** Quoted verbatim, so it stays in English in both locales. */
const QUOTE: Block = {
  kind: "quote",
  paras: [
    [
      "In guerilla warfare, the winning is in not losing. When you sleep on the floor, you can’t fall out of bed.",
    ],
    ["..."],
    [
      "[We have to force] him to make a choice between the two things which he seems to dig most of all.",
    ],
    [
      "There is no way that the United States can police the world and keep us on our ass too unless we cooperate. When we revolt, we reduce it to a simple choice.",
    ],
    ["[The time for others to make a] choice is when we start."],
    [
      "If they don’t follow our program and turn us in to the cops we lose in a week.",
    ],
    [
      "[But if they support us] then it’s hit and run, harass and hound, and we can paralyze this country.",
    ],
  ],
  by: [
    "Dan Freeman, ",
    { link: "The Spook Who Sat by the Door", href: SPOOK },
  ],
};

const ABOUT: Record<Lang, readonly SubSection[]> = {
  /* ---------------------------------------------------------------- english */
  en: [
    {
      id: "project",
      title: "About This Project",
      blocks: [
        {
          kind: "p",
          runs: [
            "This is an attempt to better visualise the ongoing student-led uprising taking place in France, as well as putting it into context against other past uprisings.",
          ],
        },
      ],
    },
    {
      id: "analysis",
      title: "My Analysis",
      blocks: [
        {
          kind: "p",
          runs: [
            "Section A shows the early dynamics of the movement quite starkly: school blockades were rapidly spreading around the country (and its overseas territories), which was met with a hugely excessive response from the police at the end of September. This helps to contextualise ",
            { em: "why" },
            " people were so angry and why, when the police lost control on Oct 17, they caused such an amount of damage.",
          ],
        },
        {
          kind: "p",
          runs: [
            "In an attempt to regain control, the state responded with lawfare, with Macron and his prefects attempting to ban protests and implement curfews for young people. This has been resoundingly rejected week after week as—during the school holidays and therefore a break in the school blockades—huge numbers of people continued to take to the streets in defiance of these orders.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Looking at the data since Oct 17, things seem to have settled into an uneasy routine: the unions declare planned routes; the prefects ban them or propose ridiculous alternatives; the unions file urgent appeals that invariably get rejected; the weaker unions accept the alternative routes; the spicier unions join the Gilets Jaunes, students, et al. in defiant undeclared manifestations; the cops wait until most people go; and then they engage in running battles with the remaining few until the evening. But either the more-recent arrest and injury figures are currently undercounted, or there has been a steady decline in eacy since Oct 17.",
          ],
        },
        {
          kind: "p",
          runs: [
            "However, I think the police may have decided to try intelligence in place of violence for a change. They seem to be using kettling much more often, surrounding and tear-gassing protestors and then allowing them to exit only by allowing their identity card to be photographed and a fine for attending an illegal protest to be issued. The fixed-penalty fines are 135EUR, but I suspect their main objective is the IDs for intelligence collection and issuing future charges. Similarly, police in Brest ",
            { link: "seized the photo directories of several schools", href: BLOG },
            ", for as-yet-unclear reasons. It’s worth noting that in France, it is illegal for the state to record ethnicity data and for employers to record lists of striking employees, both because of the experience in WWII where the French collaborator and German occupier governments used these lists to round up their enemies for deportation and worse. The fear in the back of everyone’s mind is the possibility that France will again have a far-right government next April, which ",
            { link: "almost two thirds of the police openly support", href: RN_VOTE },
            ", and so where might those lists end up?",
          ],
        },
        {
          kind: "p",
          runs: [
            "In terms of the historic comparisons (although the data here is less trustworthy; see the section below), the pension reform protests are interesting as, apparently, the only case where the protests were already ongoing for some time before the police repression began. The most obvious comparison to make is with the Gilets Jaunes (especially since the present movement has adopted the same Act-based structure), which managed to prolong a steadily decreasing weekly turnout for well over a year (and at one point had Macron ",
            { link: "considering escape by helicopter", href: HELICOPTER },
            "), but it’s hard to say what was achieved by doing so.",
          ],
        },
        {
          kind: "p",
          runs: [
            "The big question facing the movement is ",
            { link: "what should they do now", href: STRATEGY },
            "? They’ve seen off wanton police violence, shameless media demonisation and one particularly chaotic night that could have lost them public support (but this seems not to have happened). As I see it (and I’m sure many others are having the same conversations), they need to figure out what they want and develop their theory of change. For example, the government has already made some small concessions to the students’ original demands for increased education funding, but the movement has now absorbed all sorts of other grievances, from the cost of living to fear of militarism to personal distaste for Macron’s patronising and authoritarian style of rule to fear of an incoming RN government.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Do they want to influence elites? Do they want to focus on influencing next year’s elections? There is the presidential election in April, but the winner could well choose to call a snap legislative election just after. In this case, should work be undertaken to produce something like the Student List in Serbia?",
          ],
        },
        {
          kind: "p",
          runs: [
            "Do they want to inflict economic pain on the state to force it to meet their demands? The data below suggests that we may be reaching an inflection point whereby the cost of policing these protests exceeded even the highest estimated for the damage caused on Oct 17. But as the Gilets Jaunes well know, this is an approach that favours many dispersed, smaller groups acting against intelligently-chosen targets (e.g. malls, logistics hubs, etc.), and not just smashing up random shop windows.",
          ],
        },
        {
          kind: "p",
          runs: [
            "What are those demands? Just the original student demands? Or the whole programme of reversing the pension reforms, re-funding every sector, demilitarising the police, seeking justice for Palestine, etc.?",
          ],
        },
        {
          kind: "p",
          runs: [
            "Do they want to overthrow the government by force? This has happened before—the end of Fourth Republic came when French military personnel and settlers in Algeria launched an attempted coup d’état. Certainly, the government seems to be ",
            { link: "taking the possibility seriously", href: BUNKER },
            ". But even if protestors did succeed in causing Macron to flee, it’s not clear how the symbolic victory might translate into a practical takeover.",
          ],
        },
        QUOTE,
      ],
    },
    {
      id: "data",
      title: "Data Problems",
      blocks: [
        {
          kind: "p",
          runs: [
            "The biggest challenge has been finding reliable data sources. In particular, I want to highlight some issues with the injury data.",
          ],
        },
        {
          kind: "p",
          runs: [
            "The police are the only ones to publish official figures, but they make no distinction between: accidental & self-inflicted injuries, and those caused by protestors; nor the severity of injury. Potentially a good way to enrich this would be to compare with figures for injury-related work stoppages, but I don’t know when or where these might be published (and they would probably have to be compared against the non-uprising baseline to identify any excess). On the other hand, no official figures for violence against protestor exists. Deaths are obviously pretty easy to verify, but the exact causes can be unclear. For injuries, the most reliable data is compiled by Prof. Laurent Thines, and provides the floor of verified serious injuries. Some local street medic groups publish accounts of how many people they treated after large protests, but many of these will be for relatively minor things like ‘gave saline to rinse out teargas’; on the flipside, many people who receive saline or a Maalox squirt for the same thing won’t be recorded; and the street medic landscape is very fragmented, with multiple groups often operating in the same protests but not all reporting their figures afterwards.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Damage is another tricky one, and also one of the most politicised. Wide-ranging figures are published shortly after the fact, but I suspect that if we wait a while we might be able to determine a more realistic floor by looking at the real insurance claim amounts (although that might exclude smaller stores that might not have insurance). And the estimates for policing costs should be taken as very rough, mainly determined by estimating the per-squadron cost of riot police deployment and scaling that up to the reported police deployment numbers. This also dovetails with the injury data problem, because we can’t make estimates for the cost of any subsequent sick leave (whether for police, protestors, or bystanders).",
          ],
        },
        {
          kind: "p",
          runs: [
            "Obviously, all of these issues are intensified when looking further back at historical events.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "How I Made This",
      blocks: [
        {
          kind: "p",
          runs: [
            "This project began as a personal experiment in ‘vibe-coding’ (i.e., iterative software development using an LLM and trying to avoid touching the code yourself).",
          ],
        },
        {
          kind: "p",
          runs: [
            "The charts are rendered using Chart.js. I’ve made things using this by hand in the past, and it’s pretty tedious, so the ability to have the LLM convert natural language instructions into Chart.js syntax is pretty incredible.",
          ],
        },
        {
          kind: "p",
          runs: [
            "I used MiniMax M3.1 Flash for research and DeepSeek V4.1 Flash for coding—thanks China! You can view my full development transcripts here:",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ link: "initial development", href: "transcript-1.md" }],
            [{ link: "chart type selection", href: "transcript-2.md" }],
            [
              {
                link: "adding comparisons and translation",
                href: "transcript-3.md",
              },
            ],
            [{ link: "reviewing code", href: "transcript-4.md" }],
            [{ link: "reviewing sources", href: "transcript-5.md" }],
          ],
        },
        {
          kind: "p",
          runs: [
            "This project is hosted on ",
            { link: "GitHub Pages", href: PAGES },
            ". You can view the code ",
            { link: "here", href: REPO },
            ".",
          ],
        },
        {
          kind: "p",
          runs: [
            "The first draft of this project took me just over a day of pretty intense back-and-forth.",
          ],
        },
      ],
    },
  ],

  /* ---------------------------------------------------------------- français */
  fr: [
    {
      id: "project",
      title: "À propos de ce projet",
      blocks: [
        {
          kind: "p",
          runs: [
            "Ceci est une tentative de mieux visualiser le soulèvement étudiant en cours en France, et de le mettre en perspective avec d’autres soulèvements passés.",
          ],
        },
      ],
    },
    {
      id: "analysis",
      title: "Mon analyse",
      blocks: [
        {
          kind: "p",
          runs: [
            "La section A montre assez crûment la dynamique initiale du mouvement : les blocages de lycées se sont rapidement propagés dans tout le pays (et dans ses territoires d’outre-mer), et la police y a répondu de manière extrêmement disproportionnée fin septembre. Cela aide à comprendre ",
            { em: "pourquoi" },
            " les gens étaient si en colère et pourquoi, lorsque la police a perdu le contrôle le 17 octobre, les dégâts ont été aussi considérables.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Pour tenter de reprendre la main, l’État a répondu par le droit : Macron et ses préfets ont cherché à interdire les manifestations et à instaurer des couvre-feux pour les jeunes. Ces mesures ont été rejetées avec éclat semaine après semaine, car — pendant les vacances scolaires, donc en pause des blocages de lycées — des foules immenses ont continué à descendre dans la rue en dépit de ces arrêtés.",
          ],
        },
        {
          kind: "p",
          runs: [
            "À regarder les données depuis le 17 octobre, les choses semblent s’être installées dans une routine inconfortable : les syndicats annoncent des parcours ; les préfets les interdisent ou proposent des itinéraires ridicules ; les syndicats déposent des recours en urgence qui sont invariablement rejetés ; les syndicats les plus tièdes acceptent les parcours de substitution ; les plus combatifs rejoignent les Gilets jaunes, les étudiants, etc. dans des manifestations sauvages et provocatrices ; les flics attendent que la plupart des gens partent ; puis ils engagent des batailles rangées avec les derniers jusqu’au soir. Mais soit les chiffres récents d’interpellations et de blessés sont actuellement sous-estimés, soit il y a eu une baisse régulière depuis le 17 octobre.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Je pense cependant que la police a peut-être décidé d’essayer le renseignement plutôt que la violence, pour changer. Elle semble recourir beaucoup plus souvent à l’encerclement (le « kettling ») : entourer et gazer les manifestants, puis ne les laisser sortir qu’en photographiant leur carte d’identité et en leur infligeant une amende pour participation à une manifestation interdite. Les amendes forfaitaires sont de 135 EUR, mais je soupçonne que l’objectif principal soit les pièces d’identité, pour la collecte de renseignements et les poursuites à venir. De même, à Brest, la police ",
            {
              link: "a saisi les trombinoscopes de plusieurs lycées",
              href: BLOG,
            },
            ", pour des raisons encore floues. Il faut rappeler qu’en France, l’État n’a pas le droit d’enregistrer des données ethniques, ni les employeurs de tenir des listes de salariés grévistes, en raison de l’expérience de la Seconde Guerre mondiale, où les gouvernements collaborateurs français et l’occupant allemand ont utilisé ces listes pour arrêter leurs ennemis en vue de leur déportation et pire. La crainte au fond de chacun est que la France ait de nouveau un gouvernement d’extrême droite en avril prochain, que ",
            {
              link: "près de deux tiers des policiers soutiennent ouvertement",
              href: RN_VOTE,
            },
            ", et alors où pourraient aboutir ces listes ?",
          ],
        },
        {
          kind: "p",
          runs: [
            "Pour les comparaisons historiques (même si les données y sont moins fiables ; voir la section ci-dessous), les mobilisations contre la réforme des retraites sont intéressantes : apparemment le seul cas où les protestations duraient déjà depuis un certain temps avant que la répression policière ne commence. La comparaison la plus évidente est avec les Gilets jaunes (d’autant que le mouvement actuel a adopté la même structure en « actes »), qui ont réussi à prolonger pendant bien plus d’un an une participation hebdomadaire en baisse constante (et ont un moment conduit Macron à ",
            {
              link: "envisager de s’enfuir en hélicoptère",
              href: HELICOPTER,
            },
            "), mais il est difficile de dire ce que cela a permis d’obtenir.",
          ],
        },
        {
          kind: "p",
          runs: [
            "La grande question qui se pose au mouvement est : ",
            { link: "que faire maintenant", href: STRATEGY },
            " ? Il a résisté à une violence policière gratuite, à une diabolisation médiatique sans vergogne et à une nuit particulièrement chaotique qui aurait pu lui faire perdre le soutien du public (mais cela ne semble pas s’être produit). À mon sens (et je suis sûr que beaucoup d’autres ont les mêmes conversations), il faut définir ce que l’on veut et élaborer une théorie du changement. Par exemple, le gouvernement a déjà fait quelques petites concessions aux revendications initiales des étudiants sur le financement de l’éducation, mais le mouvement a désormais absorbé toutes sortes d’autres griefs, du coût de la vie à la peur du militarisme, en passant par l’aversion personnelle pour le style de gouvernance paternaliste et autoritaire de Macron, jusqu’à la crainte d’un gouvernement RN.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Veut-il influencer les élites ? Veut-il peser sur les élections de l’an prochain ? L’élection présidentielle a lieu en avril, mais le vainqueur pourrait bien convoquer des législatives anticipées juste après. Dans ce cas, faudrait-il travailler à produire quelque chose comme la Liste étudiante en Serbie ?",
          ],
        },
        {
          kind: "p",
          runs: [
            "Veut-il infliger une douleur économique à l’État pour le contraindre à céder ? Les données ci-dessous suggèrent que nous approchons peut-être d’un point d’inflexion où le coût du maintien de l’ordre dépasse même l’estimation la plus haute des dommages causés le 17 octobre. Mais comme les Gilets jaunes le savent bien, cette approche favorise de nombreux groupes dispersés et plus petits, agissant contre des cibles intelligemment choisies (centres commerciaux, plateformes logistiques, etc.), et pas seulement le saccage de vitrines au hasard.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Quelles sont ces revendications ? Seulement les revendications étudiantes initiales ? Ou tout le programme : abrogation des réformes des retraites, refinancement de tous les secteurs, démilitarisation de la police, justice pour la Palestine, etc. ?",
          ],
        },
        {
          kind: "p",
          runs: [
            "Veut-il renverser le gouvernement par la force ? Cela s’est déjà produit — la fin de la IVe République est venue de la tentative de coup d’État de militaires français et de colons en Algérie. Certes, le gouvernement semble ",
            { link: "prendre la possibilité au sérieux", href: BUNKER },
            ". Mais même si les manifestants parvenaient à faire fuir Macron, on ne voit pas bien comment cette victoire symbolique se traduirait en prise de pouvoir concrète.",
          ],
        },
        QUOTE,
      ],
    },
    {
      id: "data",
      title: "Problèmes de données",
      blocks: [
        {
          kind: "p",
          runs: [
            "La plus grande difficulté a été de trouver des sources de données fiables. Je veux en particulier souligner quelques problèmes avec les données sur les blessés.",
          ],
        },
        {
          kind: "p",
          runs: [
            "La police est la seule à publier des chiffres officiels, mais elle ne distingue pas les blessures accidentelles et auto-infligées de celles causées par les manifestants, ni la gravité des blessures. Une bonne façon d’enrichir ces données serait peut-être de les comparer aux chiffres des arrêts de travail pour accident, mais je ne sais pas quand ni où ceux-ci pourraient être publiés (et il faudrait probablement les comparer à une base de référence hors soulèvement pour identifier un éventuel excès). À l’inverse, il n’existe aucun chiffre officiel sur les violences subies par les manifestants. Les décès sont évidemment assez faciles à vérifier, mais les causes exactes peuvent être floues. Pour les blessures, les données les plus fiables sont compilées par le Pr Laurent Thines et fournissent le plancher des blessures graves vérifiées. Certains collectifs locaux de street medics publient le nombre de personnes soignées après les grandes manifestations, mais beaucoup de ces cas concernent des choses relativement bénignes du type « sérum physiologique pour rincer le gaz lacrymogène » ; à l’inverse, beaucoup de personnes qui reçoivent du sérum ou une giclée de Maalox pour la même chose ne seront pas comptabilisées ; et le paysage des street medics est très fragmenté, plusieurs groupes opérant souvent sur les mêmes manifestations sans tous publier leurs chiffres ensuite.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Les dommages sont un autre cas délicat, et l’un des plus politisés. Des chiffres très larges sont publiés peu après les faits, mais je soupçonne qu’en attendant un peu, on pourrait déterminer un plancher plus réaliste en examinant les montants réels des déclarations d’assurance (même si cela exclurait peut-être les petits commerces non assurés). Et les estimations des coûts de maintien de l’ordre doivent être prises comme très approximatives : elles sont surtout obtenues en estimant le coût par escadron de CRS déployé, puis en l’extrapolant aux effectifs annoncés. Cela recoupe aussi le problème des données sur les blessés, car nous ne pouvons pas estimer le coût des arrêts de travail qui en découlent (qu’ils concernent des policiers, des manifestants ou des passants).",
          ],
        },
        {
          kind: "p",
          runs: [
            "De toute évidence, tous ces problèmes s’intensifient lorsqu’on remonte à des événements historiques.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Comment j’ai fait ceci",
      blocks: [
        {
          kind: "p",
          runs: [
            "Ce projet a commencé comme une expérience personnelle de « vibe-coding » (c’est-à-dire du développement itératif avec un LLM, en essayant de ne pas toucher soi-même au code).",
          ],
        },
        {
          kind: "p",
          runs: [
            "Les graphiques sont rendus avec Chart.js. J’en ai fait à la main par le passé, et c’est assez fastidieux ; pouvoir faire convertir des instructions en langage naturel en syntaxe Chart.js par le LLM est donc assez incroyable.",
          ],
        },
        {
          kind: "p",
          runs: [
            "J’ai utilisé MiniMax M3.1 Flash pour la recherche et DeepSeek V4.1 Flash pour le code — merci la Chine ! Vous pouvez consulter l’intégralité de mes transcriptions de développement ici :",
          ],
        },
        {
          kind: "ul",
          items: [
            [{ link: "développement initial", href: "transcript-1.md" }],
            [{ link: "choix du type de graphique", href: "transcript-2.md" }],
            [
              {
                link: "ajout de comparaisons et de traduction",
                href: "transcript-3.md",
              },
            ],
            [{ link: "revue du code", href: "transcript-4.md" }],
            [{ link: "examen des sources", href: "transcript-5.md" }],
          ],
        },
        {
          kind: "p",
          runs: [
            "Ce projet est hébergé sur ",
            { link: "GitHub Pages", href: PAGES },
            ". Vous pouvez consulter le code ",
            { link: "ici", href: REPO },
            ".",
          ],
        },
        {
          kind: "p",
          runs: [
            "La première version de ce projet m’a pris un peu plus d’une journée d’allers-retours assez intenses.",
          ],
        },
      ],
    },
  ],
};

/* ---------------------------------------------------------------- render */

function inline(run: Run): Node {
  if (typeof run === "string") return document.createTextNode(run);

  if ("em" in run) {
    const em = document.createElement("em");
    em.textContent = run.em;
    return em;
  }

  const a = document.createElement("a");
  a.href = run.href;
  a.textContent = run.link;
  a.rel = "noopener noreferrer";
  if (/^https?:/i.test(run.href)) a.target = "_blank";
  return a;
}

function block(b: Block): HTMLElement {
  if (b.kind === "p") {
    const p = document.createElement("p");
    p.append(...b.runs.map(inline));
    return p;
  }

  if (b.kind === "ul") {
    const ul = document.createElement("ul");
    for (const item of b.items) {
      const li = document.createElement("li");
      li.append(...item.map(inline));
      ul.append(li);
    }
    return ul;
  }

  const quote = document.createElement("blockquote");
  quote.className = "about-quote";
  for (const para of b.paras) {
    const p = document.createElement("p");
    p.append(...para.map(inline));
    quote.append(p);
  }
  const by = document.createElement("footer");
  by.append(...b.by.map(inline));
  quote.append(by);
  return quote;
}

/** `open` carries the reader's choices across locale changes. */
function group(
  sub: SubSection,
  open: ReadonlyMap<string, boolean>,
): HTMLDetailsElement {
  const details = document.createElement("details");
  details.className = "about-group";
  details.dataset.about = sub.id;
  details.open = open.get(sub.id) ?? sub.id === OPEN_ID;

  const summary = document.createElement("summary");
  summary.className = "about-summary";

  const title = document.createElement("h3");
  title.className = "about-title";
  title.textContent = sub.title;
  summary.append(title);

  const body = document.createElement("div");
  body.className = "about-body";
  for (const b of sub.blocks) body.append(block(b));

  details.append(summary, body);
  return details;
}

/**
 * Idempotent: safe to call on every locale change.
 * The mount point is static in index.html so this never appends to <body>.
 */
export function renderAbout(
  host: HTMLElement | null = document.getElementById("about"),
): void {
  if (!host) return;

  const lang = localeMeta().meta.htmlLang;

  const open = new Map<string, boolean>();
  for (const el of host.querySelectorAll<HTMLDetailsElement>(
    "details[data-about]",
  )) {
    const id = el.dataset.about;
    if (id) open.set(id, el.open);
  }

  host.setAttribute("aria-label", SECTION_LABEL[lang]);

  const subs = ABOUT[lang];
  const frag = document.createDocumentFragment();
  for (const sub of subs) frag.append(group(sub, open));
  host.replaceChildren(frag);
}
```

**Mount point + hook + styles**

```html
<!-- docs/index.html: directly after this line -->
<!--     <p id="disclaimer" class="disclaimer"></p> -->
    <section id="about" class="about"></section>
```

```ts
/* src/client/page.ts */
import { renderAbout } from "./about";

// inside renderChrome(), immediately after disclaimer():
  disclaimer();
  renderAbout(); // after the disclaimer, before the chart sections
```

```css
/* docs/styles.css — append */

/* ---- notes: one collapsible block per sub-section ---- */
.about {
  margin: 0 0 2.75rem;
}

.about-group {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  margin: 0 0 0.5rem;
}

.about-summary {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  cursor: pointer;
  list-style: none;
}

.about-summary::-webkit-details-marker {
  display: none;
}

.about-summary::before {
  content: "▸";
  font-size: 0.8em;
  transform: translateY(-0.1em);
  transition: transform 0.15s ease;
}

.about-group[open] > .about-summary::before {
  content: "▾";
}

.about-group[open] > .about-summary {
  border-bottom: 1px solid #eef0f2;
  margin-bottom: 0.6rem;
}

.about-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.about-body {
  padding: 0 0.9rem 0.85rem;
  max-width: 78ch;
  font-size: 0.86rem;
  line-height: 1.6;
  color: #374151;
}

.about-body p {
  margin: 0 0 0.7rem;
}

.about-body p:last-child,
.about-body ul:last-child {
  margin-bottom: 0;
}

.about-body a {
  color: #0072b2;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.about-body ul {
  margin: 0 0 0.7rem;
  padding-left: 1.1rem;
}

.about-quote {
  margin: 0 0 0.8rem;
  padding: 0.1rem 0 0.1rem 0.9rem;
  border-left: 3px solid #e5e7eb;
  color: #4b5563;
}

.about-quote p {
  margin: 0 0 0.45rem;
}

.about-quote footer {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #6b7280;
}
```

Build: `npx esbuild src/client/main.ts --bundle --format=esm --target=es2022 --outfile=docs/bundle.js --sourcemap` (`npm run build` writes to `public/`, which Pages does not serve).

Two things to decide: the French copy above is my translation of your English text — worth a read before it ships, since the argument is yours. And the blockquote stays in English in both locales because it quotes Dan Freeman verbatim; the attribution is the only translated part.

---

