import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-waves-sound";
const HUB_LABEL = "Education · Physics · Waves & Sound";
const SHELL =
  "SI units, educational textbook models only. Ideal wave and Doppler formulas — not acoustic design tools.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Waves & sound tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Wave speed", "v = f λ"],
          ["Frequency", "f = v / λ"],
          ["Wavelength", "λ = v / f"],
          ["Intensity", "I = P / A"],
          ["Doppler", "Moving source/observer"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Wave parameter demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.3, 0.45, 0.55, 0.7, 0.82, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_WAVES_SOUND_ARTICLES: Record<string, RichArticle> = {
  "wave-speed-calculator": article(
    "wave-speed-calculator",
    "Wave speed",
    [
      "Computes v = f λ from frequency and wavelength for periodic waves.",
      "Works for sound, water waves, or other linear waves in SI units.",
    ],
    {
      question: "Is this the same as particle speed?",
      answer: "No — wave speed is how the disturbance travels, not medium particle velocity.",
    },
    "Wave Speed Calculator — v = fλ",
    "Calculate wave speed from frequency and wavelength in SI units.",
    ["wave speed calculator", "v = fλ", "frequency wavelength"],
    "sparkTrendDemo",
  ),
  "frequency-calculator-waves": article(
    "frequency-calculator-waves",
    "Frequency from wave",
    [
      "Rearranges v = f λ to solve f = v / λ.",
      "Enter wave speed and wavelength as positive values.",
    ],
    {
      question: "Can I use km/h for speed?",
      answer: "Convert to m/s first so the frequency result is in hertz.",
    },
    "Frequency Calculator — Waves",
    "Find wave frequency from speed and wavelength.",
    ["frequency calculator waves", "f = v/λ", "wave frequency"],
    "none",
  ),
  "wavelength-calculator": article(
    "wavelength-calculator",
    "Wavelength calculator",
    [
      "Solves λ = v / f for a wave of known speed and frequency.",
      "Common for audio wavelengths in air near 343 m/s.",
    ],
    {
      question: "What speed should I use for sound in air?",
      answer: "About 343 m/s at room temperature is a typical textbook value.",
    },
    "Wavelength Calculator — λ = v/f",
    "Calculate wavelength from wave speed and frequency.",
    ["wavelength calculator", "λ = v/f", "sound wavelength"],
    "sparkTrendDemo",
  ),
  "sound-intensity-calculator": article(
    "sound-intensity-calculator",
    "Sound intensity",
    [
      "Computes intensity I = P / A and a dB level re 10⁻¹² W/m².",
      "Idealized uniform spreading over the entered area.",
    ],
    {
      question: "Is dB A-weighted?",
      answer: "No — it is a simple 10 log₁₀(I/I₀) level, not psychoacoustic weighting.",
    },
    "Sound Intensity Calculator — W/m² and dB",
    "Calculate sound intensity and decibel level from power and area.",
    ["sound intensity calculator", "intensity dB", "I = P/A"],
    "none",
  ),
  "doppler-effect-calculator": article(
    "doppler-effect-calculator",
    "Doppler effect",
    [
      "Applies the moving-observer/source formula f′ = f (v ± vₒ) / (v ± vₛ) in air.",
      "Use 1/0 fields: observer toward source and source toward observer.",
    ],
    {
      question: "What do the 1 and 0 toggles mean?",
      answer: "1 means moving toward the other party; 0 means moving away (sign convention).",
    },
    "Doppler Effect Calculator — Heard Frequency",
    "Estimate heard frequency with moving observer and source speeds.",
    ["doppler effect calculator", "doppler frequency", "moving source sound"],
    "sparkTrendDemo",
  ),
};
