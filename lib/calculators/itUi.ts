/** IT UI/UX frontend — educational. */

export type ItUiSlug =
  | "it-screen-resolution-calculator"
  | "it-aspect-ratio-calculator"
  | "it-pixel-density-ppi-calculator"
  | "it-rem-to-px-converter"
  | "it-css-unit-converter"
  | "it-color-converter-hex-rgb-hsl"
  | "it-contrast-ratio-checker"
  | "it-font-size-calculator"
  | "it-viewport-size-calculator";

export type ItUiInput = {
  widthPx?: number;
  heightPx?: number;
  diagonalIn?: number;
  rem?: number;
  rootPx?: number;
  value?: number;
  fromUnit?: string;
  toUnit?: string;
  hex?: string;
  r?: number;
  g?: number;
  b?: number;
  hexFg?: string;
  hexBg?: string;
  basePx?: number;
  scale?: number;
  steps?: number;
};

export type ItUiResult =
  | { ok: false; error: string }
  | {
      ok: true;
      megapixels?: number;
      aspect?: string;
      ppi?: number;
      px?: number;
      converted?: number;
      hex?: string;
      rgb?: string;
      hsl?: string;
      contrast?: number;
      wcag?: string;
      scale?: string;
      note: string;
    };

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function parseHex(hex: string): [number, number, number] | { error: string } {
  const h = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return { error: "Hex must be #RRGGBB." };
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function relLum(r: number, g: number, b: number): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function computeItUi(slug: ItUiSlug, input: ItUiInput): ItUiResult {
  switch (slug) {
    case "it-screen-resolution-calculator":
    case "it-viewport-size-calculator": {
      const w = input.widthPx;
      const h = input.heightPx;
      if (!w || !h || w <= 0 || h <= 0) return { ok: false, error: "Width and height (px) must be positive." };
      return { ok: true, megapixels: (w * h) / 1e6, note: "Pixels = W×H; megapixels = /1e6." };
    }
    case "it-aspect-ratio-calculator": {
      const w = input.widthPx;
      const h = input.heightPx;
      if (!w || !h || w <= 0 || h <= 0) return { ok: false, error: "Width and height must be positive." };
      const g = gcd(w, h);
      return { ok: true, aspect: `${w / g}:${h / g}`, note: "Simplified aspect ratio." };
    }
    case "it-pixel-density-ppi-calculator": {
      const w = input.widthPx;
      const h = input.heightPx;
      const d = input.diagonalIn;
      if (!w || !h || !d || w <= 0 || h <= 0 || d <= 0) return { ok: false, error: "W, H, diagonal inches required." };
      const ppi = Math.sqrt(w * w + h * h) / d;
      return { ok: true, ppi, note: "PPI = √(w²+h²) / diagonal." };
    }
    case "it-rem-to-px-converter": {
      const rem = input.rem;
      const root = input.rootPx ?? 16;
      if (rem === undefined || !Number.isFinite(rem) || root <= 0) return { ok: false, error: "rem and root px required." };
      return { ok: true, px: rem * root, note: `px = rem × root (${root}).` };
    }
    case "it-css-unit-converter": {
      const v = input.value;
      const from = (input.fromUnit ?? "px").toLowerCase();
      const to = (input.toUnit ?? "rem").toLowerCase();
      const root = input.rootPx ?? 16;
      if (v === undefined || !Number.isFinite(v)) return { ok: false, error: "Value required." };
      const toPx = from === "rem" || from === "em" ? v * root : from === "pt" ? v * (96 / 72) : v;
      const out = to === "rem" || to === "em" ? toPx / root : to === "pt" ? toPx * (72 / 96) : toPx;
      return { ok: true, converted: out, px: toPx, note: `Converted ${from} → ${to} (root ${root}px).` };
    }
    case "it-color-converter-hex-rgb-hsl": {
      if (input.hex) {
        const rgb = parseHex(input.hex);
        if (!Array.isArray(rgb)) return { ok: false, error: rgb.error };
        const [r, g, b] = rgb;
        return {
          ok: true,
          hex: `#${input.hex.replace("#", "").toUpperCase()}`,
          rgb: `${r}, ${g}, ${b}`,
          hsl: rgbToHsl(r, g, b),
          note: "HEX → RGB → HSL.",
        };
      }
      const r = input.r ?? 0;
      const g = input.g ?? 0;
      const b = input.b ?? 0;
      if ([r, g, b].some((x) => x < 0 || x > 255)) return { ok: false, error: "RGB components 0–255." };
      const hex = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
      return { ok: true, hex, rgb: `${r}, ${g}, ${b}`, hsl: rgbToHsl(r, g, b), note: "RGB → HEX/HSL." };
    }
    case "it-contrast-ratio-checker": {
      const fg = parseHex(input.hexFg ?? "");
      const bg = parseHex(input.hexBg ?? "");
      if (!Array.isArray(fg)) return { ok: false, error: fg.error };
      if (!Array.isArray(bg)) return { ok: false, error: bg.error };
      const L1 = relLum(...fg);
      const L2 = relLum(...bg);
      const lighter = Math.max(L1, L2);
      const darker = Math.min(L1, L2);
      const ratio = (lighter + 0.05) / (darker + 0.05);
      const wcag = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "fail";
      return { ok: true, contrast: ratio, wcag, note: "WCAG relative-luminance contrast." };
    }
    case "it-font-size-calculator": {
      const base = input.basePx ?? 16;
      const scale = input.scale ?? 1.25;
      const steps = Math.min(12, Math.max(1, Math.floor(input.steps ?? 5)));
      const sizes: number[] = [];
      for (let i = 0; i < steps; i++) sizes.push(base * Math.pow(scale, i));
      return { ok: true, scale: sizes.map((s) => s.toFixed(1)).join(", "), note: `Modular scale base ${base} × ${scale}^i.` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
