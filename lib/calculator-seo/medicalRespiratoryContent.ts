import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/respiratory";
const HUB_LABEL = "Health · Medical · Respiratory";
const SHELL =
  "Educational respiratory physiology arithmetic for learning only — not medical advice, diagnosis, oxygen titration, asthma action plans, or emergency care. Always consult qualified clinicians for personal health decisions.";

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
    vertical: "health-body",
    category: "health",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Respiratory teaching tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Oxygen requirement", "SpO₂ deficit heuristic → L/min"],
          ["Lung capacity", "VC ≈ IRV + TV + ERV"],
          ["Peak flow", "% predicted PEF bands"],
          ["Alveolar gas", "PAO₂ = FIO₂(Patm − PH₂O) − PaCO₂/R"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your respiratory inputs. Educational physiology only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Respiratory metrics idea",
            caption:
              "Share URL preserves your respiratory inputs. Educational physiology only — not medical advice.",
            sparkValues: [0.3, 0.45, 0.55, 0.7, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_RESPIRATORY_ARTICLES: Record<string, RichArticle> = {
  "medical-oxygen-requirement-calculator": article(
    "medical-oxygen-requirement-calculator",
    "Oxygen requirement (teaching)",
    [
      "A crude classroom heuristic estimates supplemental O₂ flow from the gap between current and target SpO₂.",
      "This is not a titration protocol, emergency algorithm, or medical advice — defer all oxygen decisions to clinicians.",
    ],
    {
      question: "Can I use this to set oxygen for a patient?",
      answer:
        "No. It is educational arithmetic only. Oxygen therapy requires clinical assessment, protocols, and continuous monitoring.",
    },
    "Oxygen Requirement Calculator — Educational SpO₂ Heuristic",
    "Estimate a teaching O₂ flow from SpO₂ deficit. Educational only — not medical advice or titration guidance.",
    ["oxygen requirement calculator", "SpO2 oxygen estimate", "medical oxygen teaching"],
    "sparkTrendDemo",
  ),
  "medical-lung-capacity-calculator": article(
    "medical-lung-capacity-calculator",
    "Lung capacity (vital capacity)",
    [
      "Vital capacity is approximated as IRV + tidal volume + ERV in millilitres for classroom physiology.",
      "Not a spirometry report or diagnosis — educational lung-volume arithmetic only.",
    ],
    {
      question: "Does this replace spirometry?",
      answer: "No. Real lung volumes require calibrated spirometry and clinical interpretation.",
    },
    "Lung Capacity Calculator — VC = IRV + TV + ERV",
    "Sum inspiratory reserve, tidal volume, and expiratory reserve for educational vital capacity.",
    ["lung capacity calculator", "vital capacity calculator", "IRV TV ERV"],
    "none",
  ),
  "medical-peak-flow-calculator": article(
    "medical-peak-flow-calculator",
    "Peak flow % predicted",
    [
      "% predicted PEF = (measured ÷ predicted) × 100 with green/yellow/red teaching zone bands.",
      "Not a personal asthma action plan or medical advice — seek clinician guidance for symptoms.",
    ],
    {
      question: "What do the colour zones mean here?",
      answer:
        "They are teaching labels only. Real action plans are individualized by clinicians and should not be replaced by this tool.",
    },
    "Peak Flow Calculator — % Predicted PEF",
    "Calculate percent predicted peak expiratory flow with teaching zone bands — not medical advice.",
    ["peak flow calculator", "PEF percent predicted", "asthma peak flow teaching"],
    "sparkTrendDemo",
  ),
  "medical-alveolar-gas-equation-calculator": article(
    "medical-alveolar-gas-equation-calculator",
    "Alveolar gas equation",
    [
      "Ideal alveolar gas: PAO₂ = FIO₂ × (Patm − PH₂O) − PaCO₂ / R, with FIO₂ as URL param a and PaCO₂ as b.",
      "Educational gas-exchange math — not ABG interpretation or clinical decision support.",
    ],
    {
      question: "What defaults are used?",
      answer: "If omitted, Patm ≈ 760 mmHg, PH₂O ≈ 47 mmHg, and R ≈ 0.8 for teaching problems.",
    },
    "Alveolar Gas Equation Calculator — PAO₂",
    "Compute ideal alveolar oxygen partial pressure from FIO₂ and PaCO₂ — educational physiology only.",
    ["alveolar gas equation calculator", "PAO2 calculator", "FIO2 PaCO2"],
    "none",
  ),
};
