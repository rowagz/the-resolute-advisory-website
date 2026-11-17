// Selected engagements (§06). Copy is verbatim from the original static site.
export interface CaseImage { src: string; alt: string; caption: string }
export interface CaseStudy {
  num: string;
  thumb: { src: string; alt: string };
  client: string;
  tags: string[];
  title: string;
  lead: string;
  /** aria-label for the expandable region */
  label: string;
  sdi: { label: string; text: string }[];
  outcome: string;
  /** two-column image strip instead of three */
  twoUp: boolean;
  images: CaseImage[];
}

export const cases: CaseStudy[] = [
  {
    "num": "001",
    "thumb": {
      "src": "pdf_pages/page_07.png",
      "alt": "Vision Greens retail pack"
    },
    "client": "Vision Greens",
    "tags": [
      "AgriTech / FMCG",
      "Canada",
      "2024"
    ],
    "title": "Canada retail entry in 90 days.",
    "lead": "A Canadian fresh-produce startup — Foodland Ontario certified, Non-GMO Project verified — needed to enter retail with a system three vendors could run from one file.",
    "label": "Vision Greens — full case",
    "sdi": [
      {
        "label": "Situation",
        "text": "Three SKUs (Crispy Romaine 227g, Living Basil, Fancy range) shelf-ready for Foodland Ontario. Five vendors making decisions in parallel — packaging printer, social team, web team, retail buyer, and logistics — with no shared system."
      },
      {
        "label": "Decision",
        "text": "Stop designing more. Build the manual first — a seven-section brand system that could be handed to any printer, any vendor, any new hire, and produce consistent output without a call to the agency."
      },
      {
        "label": "Implementation",
        "text": "Identity (V-mark + wordmark). Brand manual v2.0. Pack system across three retail SKUs. Foodland Ontario and Non-GMO Project compliance built into every file. Retail collateral. Website. 392 Enterprise Drive, Welland, ON — on shelf."
      }
    ],
    "outcome": "\"Three printers, two social vendors, and a web team — all working from the same v2.0 spec with zero agency calls in between.\"",
    "twoUp": false,
    "images": [
      {
        "src": "pdf_pages/page_07.png",
        "alt": "Vision Greens Crispy Romaine Lettuce — 227g Foodland Ontario certified retail pack",
        "caption": "Shelf-ready · 227g retail pack"
      },
      {
        "src": "pdf_pages/page_09.png",
        "alt": "Vision Greens Living Genovese Basil",
        "caption": "Living Basil SKU"
      },
      {
        "src": "assets/cases/vg_routes.png",
        "alt": "Logo exploration — 8 direction routes",
        "caption": "Mark exploration · 8 routes"
      }
    ]
  },
  {
    "num": "002",
    "thumb": {
      "src": "pdf_pages/page_10.png",
      "alt": "Curve It Right shapewear campaign"
    },
    "client": "Curve It Right",
    "tags": [
      "D2C / Lifestyle",
      "India",
      "2024"
    ],
    "title": "Own Lane. Own Race. Own Pace.",
    "lead": "A D2C shapewear brand — three categories, 50+ SKUs, two celebrity campaigns — with no unified camera language, no brand line, no social system.",
    "label": "Curve It Right — full case",
    "sdi": [
      {
        "label": "Situation",
        "text": "Shapewear, activewear, and body scrub each shot in a different visual environment. No brand line. Celebrity campaigns with Santoshi Shetty and Neha Kakkar needed before year-end. 900+ creators to brief with no single system."
      },
      {
        "label": "Decision",
        "text": "Reframe from \"shapewear\" to wearable engineering — body-first design that adapts to you. One camera language across all three categories. Build the creator brief system before going to celebrities, not after."
      },
      {
        "label": "Implementation",
        "text": "Brand line + creative direction. 50+ SKU shoot: soft architectural shadow for shapewear, studio-grey for activewear, lifestyle-black for the body range. Two celebrity drops. 18-post social content system handed to the in-house team."
      }
    ],
    "outcome": "\"Two celebrity campaigns shipped. The social system now runs without us on retainer — 900+ creators briefed from one document.\"",
    "twoUp": false,
    "images": [
      {
        "src": "pdf_pages/page_10.png",
        "alt": "Curve It Right campaign — two models in black and brown shapewear",
        "caption": "Campaign · Shapewear"
      },
      {
        "src": "pdf_pages/page_11.png",
        "alt": "Curve It Right — three model spread across shapewear, activewear and lifestyle",
        "caption": "Three categories · One language"
      },
      {
        "src": "pdf_imgs/p13_0_1458x1242.png",
        "alt": "Curve It Right social content system — 18-post Instagram grid",
        "caption": "Social system · 18 posts"
      }
    ]
  },
  {
    "num": "003",
    "thumb": {
      "src": "pdf_pages/page_03.png",
      "alt": "Bike Beverages 7-SKU range"
    },
    "client": "Bike Beverages",
    "tags": [
      "Beverage / Startup",
      "Asia",
      "2023"
    ],
    "title": "Seven Italian sodas. Every bottle tells its own story.",
    "lead": "An Italian-soda house entering the Asian market — seven SKUs, strong product, and nothing else. A category that rewards storytelling.",
    "label": "Bike Beverages — full case",
    "sdi": [
      {
        "label": "Situation",
        "text": "Seven SKUs production-ready. No visual identity. No SKU copy. No Instagram. A launch date approaching and a category that rewards storytelling — shelf presence earned bottle by bottle, not brand by brand."
      },
      {
        "label": "Decision",
        "text": "The font choice is the flavour cue. Each SKU gets a shared silhouette and Italian tricolour cap, but its own typographic personality — Aranciata in citrus orange script, Limonata in chalked yellow, Pompelmo Fragola in confident pink. SKU copy written as stories, not ingredient lists."
      },
      {
        "label": "Implementation",
        "text": "Full identity + seven-SKU range system. Aranciata · Gassosa · Limonata · Pompelmo Fragola · Spuma Bionda · Spumotto · Tonica Lemongrass — each with a written origin story. 90-day Instagram content engine. Catalog and in-market collateral."
      }
    ],
    "outcome": "\"Share in our memories of a drink our Grandmothers made squeezing fresh lemons on a hot summer day, with our Limonata.\" — SKU copy, written for launch",
    "twoUp": false,
    "images": [
      {
        "src": "pdf_pages/page_03.png",
        "alt": "Bike Beverages — all 7 Italian soda SKUs lined up",
        "caption": "Range · 7 SKUs"
      },
      {
        "src": "pdf_pages/page_05.png",
        "alt": "Limonata — SKU story page with bottle and origin copy",
        "caption": "Limonata · SKU story"
      },
      {
        "src": "pdf_pages/page_06.png",
        "alt": "Bike Beverages catalog and in-market marketing materials",
        "caption": "Catalog · In-market"
      }
    ]
  },
  {
    "num": "004",
    "thumb": {
      "src": "pdf_imgs/p14_0_1100x1125.png",
      "alt": "PayAiro crypto wallet UI"
    },
    "client": "PayAiro",
    "tags": [
      "Fintech · Crypto Payments",
      "India",
      "2023"
    ],
    "title": "A fintech identity that ships consistent — with or without an agency.",
    "lead": "A crypto-payments platform needing a mark that read as trustworthy before users had a reason to trust it. No guidelines. Different logos across every touchpoint.",
    "label": "PayAiro — full case",
    "sdi": [
      {
        "label": "Situation",
        "text": "Multiple marks across app screens, partner decks, and launch collateral. No clear-space rules. No colour specifications. New hires and new vendors both guessing. The app was live — the brand wasn't."
      },
      {
        "label": "Decision",
        "text": "Credibility is drawn, not claimed. Build an eight-section guideline from mark construction through colour and typography — so every new screen, every new swag piece, every new partner deck starts from one source of truth."
      },
      {
        "label": "Implementation",
        "text": "Leaf-arrow mark (motion + trust in one shape). Clear-space system. Three colour variations on dark/light/brand-green (#2C6A3F). Nexa Heavy + Montserrat type pair. Icon family. Applications: app UI, cup, notebook, apparel."
      }
    ],
    "outcome": "\"Eight-page brand guideline shipped. One source of truth for the app team, the print vendors, and the merch runs — whoever picks it up next, ships consistent.\"",
    "twoUp": true,
    "images": [
      {
        "src": "pdf_imgs/p14_0_1100x1125.png",
        "alt": "PayAiro app — crypto wallet interface",
        "caption": "App UI · Live product"
      },
      {
        "src": "pdf_imgs/p15_0_2000x800.png",
        "alt": "PayAiro brand guidelines — clear space, logo variations, typography, colour palette #2C6A3F",
        "caption": "Brand guidelines · 4 spreads"
      }
    ]
  },
  {
    "num": "005",
    "thumb": {
      "src": "assets/cases/promore_hero.png",
      "alt": "Promore Restorations interior"
    },
    "client": "Promore Restorations",
    "tags": [
      "Construction",
      "Toronto",
      "2024"
    ],
    "title": "Live in 21 days. Used in the first enterprise pitch.",
    "lead": "A Toronto commercial construction firm pitching enterprise contracts from a PDF deck — no website, no documented gallery, no credibility stack.",
    "label": "Promore Restorations — full case",
    "sdi": [
      {
        "label": "Situation",
        "text": "Strong portfolio of real Toronto projects — envelope, roofing, interior fit-outs, MEP, electrical. All undocumented. Enterprise buyers being pitched verbally, with no proof they could open on a screen or send ahead of a meeting."
      },
      {
        "label": "Decision",
        "text": "Construction sells with proof, not promises. Build the site around the gallery — real photography from real Toronto sites. The project you land on is the one the procurement lead recognises. Ship fast enough to use in the first enterprise pitch."
      },
      {
        "label": "Implementation",
        "text": "Website strategy, copywriting, and end-to-end build. Photography direction on live Toronto construction sites. Project gallery across four phases: envelope + roofing, interior finishes, MEP, electrical infrastructure."
      }
    ],
    "outcome": "\"Live in 21 days. Used in the first post-launch enterprise pitch, on a board-room screen, before the dev environment was archived.\"",
    "twoUp": true,
    "images": [
      {
        "src": "assets/cases/promore_hero.png",
        "alt": "Promore Restorations — warm-lit reception interior",
        "caption": "Interior · Recent fit-out"
      },
      {
        "src": "assets/cases/promore_gallery.png",
        "alt": "Promore project gallery — roofing, interior, MEP, electrical phases",
        "caption": "Project gallery · 4 phases"
      }
    ]
  }
];
