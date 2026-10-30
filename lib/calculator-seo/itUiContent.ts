import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-ui-ux-frontend";
const HUB_LABEL = "Engineering · IT/Dev · UI, UX, and frontend calculators";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

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
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "UI, UX, and frontend tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Screen resolution", "Width × height pixels"],
          ["Aspect ratio", "W:H simplification & common presets"],
          ["Pixel density (PPI)", "Diagonal inches → PPI"],
          ["REM to PX", "Root em × font-size base"],
          ["CSS unit converter", "px, rem, em, vw, vh"],
          ["Color converter", "HEX ↔ RGB ↔ HSL"],
          ["Contrast ratio", "WCAG relative luminance"],
          ["Font size", "Scale steps & modular scale"],
          ["Viewport size", "Layout breakpoints literacy"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your frontend layout inputs. Educational IT aid only — test accessibility on real devices and users.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_UI_ARTICLES: Record<string, RichArticle> = {
  "it-screen-resolution-calculator": article(
    "it-screen-resolution-calculator",
    "Screen resolution calculator",
    [
      "Computes total pixel count and megapixels from width and height for asset export and media query planning.",
      "Device pixel ratio (DPR) means CSS pixels differ from physical pixels on Retina and high-DPI displays.",
    ],
    {
      question: "Do I design for physical or CSS pixels?",
      answer:
        "Web layout uses CSS pixels; export @2x/@3x assets using DPR for sharp images on high-density screens.",
    },
    "Screen Resolution Calculator — Pixels & Megapixels",
    "Calculate pixel dimensions and megapixels from width and height. Frontend literacy tool — account for DPR.",
    ["screen resolution calculator", "pixels width height", "megapixel calculator display"],
  ),
  "it-aspect-ratio-calculator": article(
    "it-aspect-ratio-calculator",
    "Aspect ratio calculator",
    [
      "Reduces width and height to simplest ratio (16:9, 4:3, 21:9) for video, images, and responsive layout decisions.",
      "Letterboxing and object-fit change visible crop without changing intrinsic aspect ratio of source media.",
    ],
    {
      question: "What aspect ratio for responsive hero images?",
      answer:
        "Match design breakpoints and crop safe zones. 16:9 is common for video heroes; test crop on narrow viewports.",
    },
    "Aspect Ratio Calculator — W:H & Common Presets",
    "Find aspect ratio from pixel dimensions or presets. UI design aid — test crops across breakpoints.",
    ["aspect ratio calculator", "16:9 aspect ratio", "image ratio calculator"],
  ),
  "it-pixel-density-ppi-calculator": article(
    "it-pixel-density-ppi-calculator",
    "Pixel density (PPI) calculator",
    [
      "Derives pixels per inch from diagonal size and resolution for comparing phone, tablet, and monitor sharpness.",
      "PPI differs from CSS DPR — browsers map hardware pixels to CSS pixels using devicePixelRatio.",
    ],
    {
      question: "How much PPI is retina?",
      answer:
        "Apple historically used ~300 PPI at phone viewing distance. 'Retina' is perceptual — distance and font rendering matter.",
    },
    "Pixel Density PPI Calculator — Diagonal & Resolution",
    "Calculate PPI from screen size and pixel dimensions. Frontend education tool — pair with devicePixelRatio.",
    ["ppi calculator", "pixel density calculator", "pixels per inch screen"],
  ),
  "it-rem-to-px-converter": article(
    "it-rem-to-px-converter",
    "REM to PX converter",
    [
      "Converts rem values to pixels using root font-size (often 16px default) for design handoff and token audits.",
      "Changing html { font-size } scales all rem-based spacing — document root size in your design system.",
    ],
    {
      question: "Why use rem instead of px?",
      answer:
        "rem respects user browser font settings for accessibility. px is fixed; rem scales with root size for inclusive typography.",
    },
    "REM to PX Converter — Root Font Size Scaling",
    "Convert rem units to pixels with configurable root font-size. Frontend literacy tool — document your base size.",
    ["rem to px converter", "rem px calculator", "css rem conversion"],
  ),
  "it-css-unit-converter": article(
    "it-css-unit-converter",
    "CSS unit converter",
    [
      "Translates among px, rem, em, vw, and vh given context (root size, parent em, viewport) for layout math.",
      "em compounds with nested font sizes; vw/vh include scrollbars differently across browsers — test visually.",
    ],
    {
      question: "When should I use vw for font size?",
      answer:
        "Fluid type scales with viewport but can become too small/large at extremes. clamp() combines min, preferred, max.",
    },
    "CSS Unit Converter — px, rem, em, vw, vh",
    "Convert CSS length units with context assumptions. Educational frontend aid — verify in browser devtools.",
    ["css unit converter", "px rem em converter", "vw vh calculator"],
  ),
  "it-color-converter-hex-rgb-hsl": article(
    "it-color-converter-hex-rgb-hsl",
    "Color converter (HEX ↔ RGB ↔ HSL)",
    [
      "Converts among HEX, RGB, and HSL representations used in CSS, Figma tokens, and design system palettes.",
      "sRGB is the web default; wide-gamut displays and color profiles affect perceived color outside sRGB literals.",
    ],
    {
      question: "HEX vs HSL for theming?",
      answer:
        "HSL makes lightness/saturation tweaks intuitive for themes. Use OKLCH where supported for perceptually uniform scales.",
    },
    "Color Converter — HEX, RGB & HSL for CSS",
    "Convert web colors between HEX, RGB, and HSL. Frontend design aid — validate contrast separately.",
    ["color converter hex rgb hsl", "hex to rgb converter", "hsl color calculator"],
  ),
  "it-contrast-ratio-checker": article(
    "it-contrast-ratio-checker",
    "Contrast ratio checker",
    [
      "Computes WCAG 2.x relative luminance contrast between foreground and background colors for accessibility review.",
      "Large text (18pt+ or 14pt bold) has lower AA thresholds — still test with real users and forced-colors modes.",
    ],
    {
      question: "What contrast ratio passes WCAG AA?",
      answer:
        "Normal text needs 4.5:1; large text 3:1. AAA requires 7:1 and 4.5:1 respectively — aim AA minimum for body copy.",
    },
    "Contrast Ratio Checker — WCAG Accessibility Test",
    "Check color contrast ratio for WCAG AA/AAA literacy. Educational a11y aid — audit full UI states, not swatches alone.",
    ["contrast ratio checker", "wcag contrast calculator", "color accessibility test"],
  ),
  "it-font-size-calculator": article(
    "it-font-size-calculator",
    "Font size calculator",
    [
      "Builds modular type scales (major third, perfect fourth) from a base size for consistent typography systems.",
      "Line-height and letter-spacing pair with font size — scale tokens together in your design system.",
    ],
    {
      question: "What base font size for web?",
      answer:
        "16px root is the common default respecting user settings. Scale headings with rem from that base.",
    },
    "Font Size Calculator — Modular Type Scale",
    "Generate modular font size scales from a base and ratio. UI system aid — pair with line-height tokens.",
    ["font size calculator", "modular scale typography", "type scale generator"],
  ),
  "it-viewport-size-calculator": article(
    "it-viewport-size-calculator",
    "Viewport size calculator",
    [
      "Relates layout viewport, visual viewport, and common breakpoint widths for responsive CSS planning.",
      "Mobile browser chrome and virtual keyboard shrink visual viewport — use dvh/svh units where supported.",
    ],
    {
      question: "100vh vs 100dvh on mobile?",
      answer:
        "Classic 100vh can overflow when URL bar shows/hides. Dynamic viewport units (dvh) track visible area better.",
    },
    "Viewport Size Calculator — Breakpoints & Layout Width",
    "Explore viewport dimensions and breakpoint literacy for responsive design. Test on real devices.",
    ["viewport size calculator", "css breakpoint planner", "layout viewport width"],
  ),
};
