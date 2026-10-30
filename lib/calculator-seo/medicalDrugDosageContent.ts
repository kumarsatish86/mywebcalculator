import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/drug-dosage-pharmacology";
const HUB_LABEL = "Health · Medical · Drug Dosage & Pharmacology";
const SHELL =
  "Educational pharmacology arithmetic in your browser only. Not a prescription, pharmacy verification, dosing order, or medical advice. Confirm formulas and labels with qualified clinicians.";

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
        title: "Drug dosage tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["mg/kg dose", "weight × mg/kg"],
          ["IV drip rate", "(mL × drop factor) / min"],
          ["Infusion rate", "mL / hours"],
          ["CrCl", "Cockcroft–Gault"],
          ["eGFR", "CKD-EPI 2021 teaching"],
          ["Corrected Ca", "Payne albumin adjust"],
          ["Anion gap", "Na − (Cl + HCO₃)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your pharmacology inputs. Educational teaching models only — not for clinical dosing.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Dose awareness",
            caption:
              "Share URL preserves your pharmacology inputs. Educational teaching models only — not for clinical dosing.",
            sparkValues: [0.2, 0.35, 0.5, 0.6, 0.75, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_DRUG_DOSAGE_ARTICLES: Record<string, RichArticle> = {
  "medical-dosage-calculator-mg-kg": article(
    "medical-dosage-calculator-mg-kg",
    "Weight-based mg/kg dose",
    [
      "Multiplies weight (kg) by mg/kg to produce a teaching dose in mg.",
      "Does not apply max doses, organ adjustments, or product labels — educational arithmetic only.",
    ],
    {
      question: "Is this a prescription dose?",
      answer:
        "No. Clinicians and pharmacists verify indication, concentration, and limits. This host only multiplies the inputs.",
    },
    "Dosage Calculator (mg/kg) — Educational Weight-Based Math",
    "Compute a teaching dose from weight and mg/kg. Not a prescription or medical advice.",
    ["mg/kg dosage calculator", "weight based dose educational", "drug dose mg kg"],
    "sparkTrendDemo",
  ),
  "medical-iv-drip-rate-calculator": article(
    "medical-iv-drip-rate-calculator",
    "IV drip gtt/min",
    [
      "Uses gtt/min = (volume_mL × drop factor) / time_min for gravity-drip teaching math.",
      "Pump programming and tubing factors belong to clinical protocols — not this helper.",
    ],
    {
      question: "What is drop factor?",
      answer:
        "Drops per mL for the tubing set (e.g., 10, 15, 20, 60). Confirm the set in use; this tool does not choose it.",
    },
    "IV Drip Rate Calculator — gtt/min Teaching Formula",
    "Estimate IV drip rate in gtt/min from volume, time, and drop factor. Educational only.",
    ["IV drip rate calculator", "gtt per min", "drop factor educational"],
    "none",
  ),
  "medical-infusion-rate-calculator": article(
    "medical-infusion-rate-calculator",
    "Infusion mL/hr",
    [
      "Divides volume (mL) by hours for a teaching mL/hr rate.",
      "Not pump orders or drug concentration math — verify with pharmacy and nursing protocols.",
    ],
    {
      question: "Does this include drug concentration?",
      answer:
        "No. It only converts volume and time to mL/hr. Concentration and dose checks are separate clinical steps.",
    },
    "Infusion Rate Calculator — mL per Hour Educational Tool",
    "Compute infusion rate as mL/hr from volume and hours. Not medical advice or pump programming.",
    ["infusion rate calculator", "mL per hour", "IV infusion educational"],
    "sparkTrendDemo",
  ),
  "medical-creatinine-clearance-calculator": article(
    "medical-creatinine-clearance-calculator",
    "Cockcroft–Gault CrCl",
    [
      "Estimates CrCl (mL/min) from age, weight (kg), creatinine (mg/dL), and sex text male|female.",
      "Teaching renal estimate only — dosing and GFR reporting use clinic-approved tools.",
    ],
    {
      question: "Ideal or actual body weight?",
      answer:
        "This educational form uses the weight you enter. Clinical dosing may adjust weight selection — ask a clinician/pharmacist.",
    },
    "Creatinine Clearance Calculator — Cockcroft-Gault Teaching",
    "Estimate CrCl with Cockcroft–Gault from age, weight, creatinine, and sex. Educational only.",
    ["creatinine clearance calculator", "Cockcroft Gault", "CrCl educational"],
    "none",
  ),
  "medical-egfr-calculator": article(
    "medical-egfr-calculator",
    "CKD-EPI 2021 teaching eGFR",
    [
      "Applies a race-free CKD-EPI 2021 teaching form from age, creatinine (mg/dL), and sex (male|female).",
      "Not a lab report substitute — verify with laboratory and nephrology tools used in practice.",
    ],
    {
      question: "Is race used in this equation?",
      answer:
        "No. This educational host follows a race-free CKD-EPI 2021-style form for teaching.",
    },
    "eGFR Calculator — CKD-EPI 2021 Race-Free Teaching",
    "Estimate eGFR with a CKD-EPI 2021 race-free teaching form. Not medical advice or a lab report.",
    ["eGFR calculator", "CKD-EPI 2021", "glomerular filtration educational"],
    "sparkTrendDemo",
  ),
  "medical-corrected-calcium-calculator": article(
    "medical-corrected-calcium-calculator",
    "Payne corrected calcium",
    [
      "Corrected Ca = measured + 0.8 × (4 − albumin) using mg/dL and g/dL teaching units.",
      "Ionized calcium and clinical context may supersede albumin correction — clinician judgment required.",
    ],
    {
      question: "Which units are required?",
      answer:
        "Calcium in mg/dL and albumin in g/dL for this Payne-style teaching formula. Convert before entering if needed.",
    },
    "Corrected Calcium Calculator — Albumin Adjustment Teaching",
    "Correct calcium for albumin with the Payne teaching formula. Educational only — not medical advice.",
    ["corrected calcium calculator", "Payne calcium", "albumin calcium educational"],
    "none",
  ),
  "medical-anion-gap-calculator": article(
    "medical-anion-gap-calculator",
    "Anion gap teaching bands",
    [
      "Computes AG = Na − (Cl + HCO₃) and shows a simple teaching band.",
      "Acid–base interpretation needs full clinical context — not this arithmetic alone.",
    ],
    {
      question: "Is potassium included?",
      answer:
        "This educational form uses the common Na − (Cl + HCO₃) version without potassium.",
    },
    "Anion Gap Calculator — Na Cl HCO3 Teaching Tool",
    "Compute anion gap from Na, Cl, and HCO₃ with teaching bands. Not medical advice.",
    ["anion gap calculator", "metabolic acidosis teaching", "Na Cl bicarbonate gap"],
    "sparkTrendDemo",
  ),
};
