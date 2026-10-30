import type { RichArticle } from "./types";

const HUB_HREF = "/daily/home-utility/home-space-area";
const HUB_LABEL = "Daily life · Home utility · Space and area calculators";
const SHELL =
  "Daily home and utility estimation tools that run in your browser. Not financial, legal, or contract advice. Tariffs, taxes, utility rates, and local regulations vary by region — verify measurements and vendor quotes on site.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Space and area tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Room area", "Length × width for rectangular rooms"],
          ["Carpet area", "Usable floor inside walls"],
          ["Built-up area", "Carpet + wall thickness share"],
          ["Super built-up area", "Built-up + common area load"],
          ["Tile calculator", "Floor area ÷ tile size + waste"],
          ["Flooring cost", "Area × material rate + labour"],
          ["Paint quantity", "Wall area ÷ coverage per litre"],
          ["Wallpaper", "Roll coverage × rolls + pattern waste"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your area inputs. Planning estimate only — RERA and local area definitions vary by region.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HOME_SPACE_ARTICLES: Record<string, RichArticle> = {
  "home-room-area-calculator": article(
    "home-room-area-calculator",
    "Room area",
    [
      "Computes floor area from length and width for rectangular rooms — the base for flooring, paint, and HVAC load hints.",
      "Bay windows, alcoves, and irregular shapes need subdivision into rectangles; deduct fixed furniture zones only if you plan partial coverage.",
    ],
    {
      question: "Metres or feet?",
      answer:
        "Use one unit system throughout. Convert at the end if vendors quote per square foot while you measure in metres.",
    },
    "Room Area Calculator — Square Metres or Feet",
    "Calculate room floor area from length and width. Home measurement aid — verify on site before ordering materials.",
    ["room area calculator", "floor area square metres", "room size calculator"],
  ),
  "home-carpet-area-calculator": article(
    "home-carpet-area-calculator",
    "Carpet area",
    [
      "Estimates usable internal floor area excluding outer wall thickness — common in apartment sale brochures.",
      "Developer definitions differ; RERA and local law may mandate specific inclusion rules — confirm for your jurisdiction.",
    ],
    {
      question: "Is balcony included in carpet area?",
      answer:
        "Often no for carpet, sometimes partially in saleable area. Read the allotment letter or sale deed definition.",
    },
    "Carpet Area Calculator — Usable Floor Space",
    "Estimate carpet area from room dimensions and wall deductions. Real estate literacy — definitions vary by region.",
    ["carpet area calculator", "usable floor area flat", "carpet sq ft apartment"],
  ),
  "home-built-up-area-calculator": article(
    "home-built-up-area-calculator",
    "Built-up area",
    [
      "Adds wall thickness and exclusive balcony share to carpet area for built-up area teaching estimates.",
      "Wall thickness assumptions (150–230 mm) vary by construction type — adjust to your structural drawings when available.",
    ],
    {
      question: "Why is built-up larger than carpet?",
      answer:
        "Built-up includes a share of wall footprint and sometimes exclusive balcony. Common area is usually excluded until super built-up.",
    },
    "Built-up Area Calculator — Carpet Plus Walls",
    "Estimate built-up area from carpet and wall thickness assumptions. Property literacy — not a legal survey.",
    ["built up area calculator", "BUA from carpet area", "apartment built up sq ft"],
  ),
  "home-super-built-up-area-calculator": article(
    "home-super-built-up-area-calculator",
    "Super built-up area",
    [
      "Applies a loading factor to built-up area to allocate lobby, lift, and corridor share — typical in multi-storey sales.",
      "Loading factors from 1.15× to 1.35× appear in markets; insist on disclosure rather than a generic multiplier.",
    ],
    {
      question: "What is a fair loading factor?",
      answer:
        "Lower is better for buyers. Compare projects by carpet-to-saleable ratio, not headline rate per super built-up foot alone.",
    },
    "Super Built-up Area Calculator — Loading Factor Estimate",
    "Calculate super built-up area from built-up and common-area loading. Real estate aid — RERA rules vary.",
    ["super built up area calculator", "saleable area loading factor", "super BUA estimate"],
  ),
  "home-tile-calculator": article(
    "home-tile-calculator",
    "Tile calculator",
    [
      "Divides floor area by tile face size and adds waste factor for cuts, breakage, and future repairs.",
      "Diagonal layouts and large-format tiles increase waste — use 10–15% margin for complex patterns.",
    ],
    {
      question: "How much tile waste should I order?",
      answer:
        "Straight lay: ~5–10%. Diagonal or herringbone: 10–15%. Keep a few spare boxes for color-matched repairs.",
    },
    "Tile Calculator — Boxes from Floor Area",
    "Calculate tiles needed from room area, tile size, and waste percent. Renovation planning — verify with installer.",
    ["tile calculator", "how many tiles needed", "floor tile quantity estimate"],
  ),
  "home-flooring-cost-calculator": article(
    "home-flooring-cost-calculator",
    "Flooring cost",
    [
      "Multiplies floor area by material and labour rate for tile, laminate, wood, or vinyl budget snapshots.",
      "Subfloor leveling, adhesive type, skirting, and removal of old flooring are often extra line items.",
    ],
    {
      question: "Material or installed price?",
      answer:
        "Quotes may be per sq ft material-only or all-in installed. Align inputs with how your vendor prices the job.",
    },
    "Flooring Cost Calculator — Material + Labour Estimate",
    "Estimate flooring project cost from area and rate per square metre or foot. Budgeting aid — taxes vary locally.",
    ["flooring cost calculator", "floor installation price", "tile flooring cost estimate"],
  ),
  "home-paint-quantity-calculator": article(
    "home-paint-quantity-calculator",
    "Paint quantity",
    [
      "Divides total paintable wall and ceiling area by coverage per litre per coat to estimate cans needed.",
      "Texture, porous surfaces, and deep colours reduce coverage — add an extra coat in your quantity plan.",
    ],
    {
      question: "Do I paint ceiling separately?",
      answer:
        "Yes — add ceiling area (same as floor for flat ceilings). Deductions for large windows and doors reduce wall area.",
    },
    "Paint Quantity Calculator — Litres from Wall Area",
    "Calculate paint litres needed from surface area and coverage. DIY planning — brand coverage varies.",
    ["paint quantity calculator", "how much paint needed", "wall paint litres estimate"],
  ),
  "home-wallpaper-calculator": article(
    "home-wallpaper-calculator",
    "Wallpaper",
    [
      "Estimates rolls from wall area, roll dimensions, and pattern repeat waste for match alignment.",
      "Bold repeats can waste 15–25% extra — check the roll label for coverage square metres before ordering.",
    ],
    {
      question: "What is pattern repeat waste?",
      answer:
        "Repeating motifs must align vertically; each drop may trim excess. Larger repeat means more waste per wall.",
    },
    "Wallpaper Calculator — Rolls from Wall Area",
    "Estimate wallpaper rolls from wall size and roll coverage. Decor planning — pattern repeat affects quantity.",
    ["wallpaper calculator", "how many wallpaper rolls", "wallpaper area estimate"],
  ),
};
