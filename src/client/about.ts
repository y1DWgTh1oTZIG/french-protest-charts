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

/** Green counterweight to the amber disclaimer; the "…" continues its sentence. */
const CALLOUT: Record<Lang, string> = {
  en: "…except for this section, which is 100% human written! (in English, and then machine translated)",
  fr: "…sauf cette section, qui est écrite à 100 % par un humain ! (en anglais, puis traduite automatiquement)",
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
const BUNKER =
  "https://neru.tv/sources/macron-bunker-secret-pour-fuir-le-peuple/";
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
  by: ["Dan Freeman, ", { link: "The Spook Who Sat by the Door", href: SPOOK }],
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
            {
              link: "seized the photo directories of several schools",
              href: BLOG,
            },
            ", for as-yet-unclear reasons. It’s worth noting that in France, it is illegal for the state to record ethnicity data and for employers to record lists of striking employees, both because of the experience in WWII where the French collaborator and German occupier governments used these lists to round up their enemies for deportation and worse. The fear in the back of everyone’s mind is the possibility that France will again have a far-right government next April, which ",
            {
              link: "almost two thirds of the police openly support",
              href: RN_VOTE,
            },
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
        /* closing argument, in the author's own words */
        {
          kind: "p",
          runs: [
            "At the moment, I think a complete fizzling-out is unlikely. I think the most likely course is that this will continue for some time, with slowly diminishing turnout and some small concessions won here and there. Most people’s engagement will be limited to therapeutic marching, but the people who are politicised here will go on to develop new associations and be instrumental in future movements, as the former Gilets Jaunes have been here, and the 68-ers before them.",
          ],
        },
        {
          kind: "p",
          runs: [
            "But maybe, just maybe, the threat of an incoming fascist government and the memory of so many past underwhelming results will serve to focus minds and harden hearts in time to press home their present advantage and win lasting, significant wins. And just as mere ",
            { em: "resistance" },
            " in France has already spread like wildfire across Europe, a real victory in France could be the thing to spark a conflagration that burns down the old world and inaugurates the new.",
          ],
        },
        {
          kind: "p",
          runs: [
            "I will leave you with this (heavily paraphrased) quote from a classic film, which I watched for the first time recently:",
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
        {
          kind: "p",
          runs: [
            "Pour l’instant, je pense qu’un essoufflement complet est peu probable. Le scénario le plus probable est que cela continue un certain temps, avec une participation en baisse lente et quelques petites concessions obtenues çà et là. L’engagement de la plupart des gens se limitera à une marche thérapeutique, mais les personnes politisées ici développeront de nouvelles associations et joueront un rôle déterminant dans les mouvements à venir, comme les anciens Gilets jaunes l’ont fait ici, et les soixante-huitards avant eux.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Mais peut-être, juste peut-être, la menace d’un gouvernement fasciste à venir et le souvenir de tant de résultats décevants par le passé serviront-ils à concentrer les esprits et à durcir les cœurs à temps pour exploiter leur avantage actuel et obtenir des victoires durables et significatives. Et de même que la simple ",
            { em: "résistance" },
            " en France s’est déjà propagée comme une traînée de poudre à travers l’Europe, une véritable victoire en France pourrait bien être ce qui déclenche un incendie embrasant le vieux monde et inaugurant le nouveau.",
          ],
        },
        {
          kind: "p",
          runs: [
            "Je vous laisse avec cette citation (très largement paraphrasée) d’un film classique, que j’ai regardé pour la première fois récemment :",
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

function callout(lang: Lang): HTMLElement {
  const p = document.createElement("p");
  p.className = "callout callout--positive";
  p.setAttribute("role", "note");
  p.textContent = CALLOUT[lang];
  return p;
}

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
  frag.append(callout(lang)); // above every <details>
  for (const sub of subs) frag.append(group(sub, open));
  host.replaceChildren(frag);
}
