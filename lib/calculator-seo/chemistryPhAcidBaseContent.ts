import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-ph-acid-base";
const HUB_LABEL = "Education · Science · Chemistry pH / Acid–Base";
const SHELL =
  "Educational pH and acid–base arithmetic for classroom use. Simplified models only — not lab method validation or clinical advice.";

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
        title: "pH / acid–base tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["pH", "pH = −log₁₀[H⁺] or 14 − pOH"],
          ["pOH", "pOH = −log₁₀[OH⁻] or 14 − pH"],
          ["pKa", "pKa = −log₁₀(Ka)"],
          ["Buffer / HH", "pH = pKa + log([A⁻]/[HA])"],
          ["Dissociation", "[H⁺] ≈ √(Ka·C₀)"],
          ["Titration", "M₁V₁ = M₂V₂ (1:1)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your pH / acid–base inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "pH scale idea",
            caption: "Share URL preserves your pH / acid–base inputs. Educational models only.",
            sparkValues: [1, 3, 5, 7, 9, 11, 13],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_PH_ACID_BASE_ARTICLES: Record<string, RichArticle> = {
  "ph-calculator-chemistry": article(
    "ph-calculator-chemistry",
    "pH from concentration or pOH",
    [
      "pH = −log₁₀[H⁺] when you enter hydrogen-ion concentration in mol/L.",
      "Alternatively leave [H⁺] blank and enter pOH; then pH = 14 − pOH (25 °C water convention).",
    ],
    {
      question: "Which field takes priority?",
      answer: "If [H⁺] is provided and positive, it is used; otherwise pOH is used.",
    },
    "pH Calculator — From [H+] or pOH Chemistry",
    "Calculate pH from hydrogen-ion concentration or from pOH for classroom acid–base chemistry.",
    ["ph calculator", "pH from H+", "pOH to pH"],
    "sparkTrendDemo",
  ),
  "poh-calculator": article(
    "poh-calculator",
    "pOH from concentration or pH",
    [
      "pOH = −log₁₀[OH⁻] when you enter hydroxide concentration in mol/L.",
      "Or leave [OH⁻] blank and enter pH; then pOH = 14 − pH.",
    ],
    {
      question: "Is the 14 relation always exact?",
      answer: "This tool uses Kw = 10⁻¹⁴ (25 °C). Other temperatures change Kw.",
    },
    "pOH Calculator — From [OH-] or pH",
    "Calculate pOH from hydroxide concentration or from pH for educational chemistry.",
    ["poh calculator", "pOH from OH-", "pH to pOH"],
    "none",
  ),
  "pka-calculator": article(
    "pka-calculator",
    "pKa ↔ Ka conversion",
    [
      "pKa = −log₁₀(Ka). Enter Ka to get pKa, or enter pKa to recover Ka = 10^(−pKa).",
      "Leave exactly one field blank. Classroom acid–strength arithmetic only.",
    ],
    {
      question: "What units does Ka use?",
      answer: "Ka is treated as a dimensionless concentration-based constant for teaching drills.",
    },
    "pKa Calculator — Convert Ka and pKa",
    "Convert between Ka and pKa with pKa = −log₁₀(Ka) for educational chemistry.",
    ["pka calculator", "ka to pka", "acid dissociation constant"],
    "sparkTrendDemo",
  ),
  "buffer-solution-calculator-chemistry": article(
    "buffer-solution-calculator-chemistry",
    "Buffer pH (Henderson–Hasselbalch)",
    [
      "pH = pKa + log₁₀([A⁻]/[HA]) for a weak acid and its conjugate base.",
      "Uses the same hendersonHasselbalch engine as the dedicated Henderson–Hasselbalch tool.",
    ],
    {
      question: "Can I use moles instead of concentrations?",
      answer: "Yes if volumes cancel — the ratio [A⁻]/[HA] is what matters in this form.",
    },
    "Buffer Solution Calculator — Henderson–Hasselbalch Chemistry",
    "Estimate buffer pH from pKa and the [A⁻]/[HA] ratio with Henderson–Hasselbalch.",
    ["buffer calculator", "henderson hasselbalch buffer", "weak acid buffer pH"],
    "none",
  ),
  "henderson-hasselbalch-calculator": article(
    "henderson-hasselbalch-calculator",
    "Henderson–Hasselbalch equation",
    [
      "Classic form: pH = pKa + log₁₀([A⁻]/[HA]). Enter pKa, salt [A⁻], and acid [HA].",
      "Shares the same engine as the buffer solution calculator.",
    ],
    {
      question: "Does this work for bases?",
      answer: "This form is for HA/A⁻. For B/BH⁺ use the corresponding pKb / [BH⁺]/[B] form.",
    },
    "Henderson–Hasselbalch Calculator — Buffer pH",
    "Apply pH = pKa + log([A⁻]/[HA]) for weak-acid buffers in classroom chemistry.",
    ["henderson hasselbalch calculator", "buffer pH equation", "pKa log ratio"],
    "sparkTrendDemo",
  ),
  "acid-base-dissociation-calculator": article(
    "acid-base-dissociation-calculator",
    "Weak acid dissociation approximation",
    [
      "Uses [H⁺] ≈ √(Ka × C₀) when the dissociated fraction is small (x ≪ C₀).",
      "Reports pH, α = [H⁺]/C₀, and rejects cases where the approximation fails.",
    ],
    {
      question: "What if the approximation fails?",
      answer: "Use a quadratic ICE solve when √(Ka·C₀) is not much smaller than C₀.",
    },
    "Acid–Base Dissociation Calculator — √(Ka·C0)",
    "Approximate [H⁺], pH, and degree of dissociation for dilute weak acids.",
    ["weak acid dissociation", "ka c0 ph", "degree of dissociation alpha"],
    "none",
  ),
  "titration-calculator-chemistry": article(
    "titration-calculator-chemistry",
    "Titration equivalence",
    [
      "For 1:1 acid–base stoichiometry, M₁V₁ = M₂V₂ at the equivalence point.",
      "Leave exactly one of M1, V1, M2, or V2 blank to solve. Classroom arithmetic only.",
    ],
    {
      question: "What if the reaction is not 1:1?",
      answer: "Scale by stoichiometric coefficients first; this tool assumes a 1:1 equivalence relation.",
    },
    "Titration Calculator — M1V1 = M2V2 Chemistry",
    "Solve acid–base titration equivalence with M₁V₁ = M₂V₂ for educational chemistry.",
    ["titration calculator chemistry", "M1V1=M2V2", "acid base titration"],
    "sparkTrendDemo",
  ),
};
