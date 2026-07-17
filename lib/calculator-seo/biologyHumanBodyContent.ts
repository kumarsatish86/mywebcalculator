import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-human-body-health";
const HUB_LABEL = "Education · Science · Biology Human Body & Health";
const SHELL =
  "Educational anthropometric and vital-sign math for classroom use only — not medical advice, diagnosis, or treatment. Always consult a qualified clinician for health decisions.";

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
        title: "Human body & health tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["BMI", "kg / m²"],
          ["BMR", "Mifflin–St Jeor"],
          ["Ideal body weight", "Devine formula"],
          ["Lean body mass", "Boer formula"],
          ["BSA", "Mosteller"],
          ["Max / target HR", "220 − age / Karvonen"],
          ["BP & pulse pressure", "Educational bands"],
          ["Calories & METs", "MET × kg × hours"],
          ["VO₂ max", "15.3 × max/rest HR"],
          ["Blood volume", "Nadler"],
          ["Glucose / HbA1c", "Unit convert / eAG"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational estimates only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Body metrics idea",
            caption: "Share URL preserves your inputs. Educational estimates only — not medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_HUMAN_BODY_ARTICLES: Record<string, RichArticle> = {
  "bmi-calculator-biology": article(
    "bmi-calculator-biology",
    "BMI (biology)",
    [
      "BMI = weight (kg) ÷ height (m)² with educational underweight/normal/overweight/obese bands.",
      "Height is entered in metres. Classroom use only — not medical advice.",
    ],
    {
      question: "Is BMI a diagnosis?",
      answer: "No — BMI bands here are educational labels only and are not a clinical assessment.",
    },
    "BMI Calculator (Biology) — Educational kg/m²",
    "Calculate BMI from weight and height for educational use — not medical advice.",
    ["BMI calculator biology", "body mass index education", "kg per m2 BMI"],
    "sparkTrendDemo",
  ),
  "bmr-calculator": article(
    "bmr-calculator",
    "BMR (Mifflin–St Jeor)",
    [
      "Estimates resting energy with Mifflin–St Jeor using weight, height (cm), age, and sex (male/female).",
      "Educational estimate only — not medical advice or a personalized nutrition plan.",
    ],
    {
      question: "Which sex values are accepted?",
      answer: 'Enter the text "male" or "female" in the sex field.',
    },
    "BMR Calculator — Mifflin–St Jeor Educational Estimate",
    "Estimate basal metabolic rate with Mifflin–St Jeor — educational only, not medical advice.",
    ["BMR calculator", "Mifflin St Jeor", "basal metabolic rate education"],
    "none",
  ),
  "ideal-body-weight-calculator": article(
    "ideal-body-weight-calculator",
    "Ideal body weight (Devine)",
    [
      "Devine IBW from height (≥ 152 cm) and sex. Classroom anthropometry — not a clinical target.",
      "Not medical advice for dosing or weight goals.",
    ],
    {
      question: "Why is there a height minimum?",
      answer: "The classic Devine formula is commonly taught for heights at or above about 152 cm.",
    },
    "Ideal Body Weight Calculator — Devine Educational Formula",
    "Estimate Devine ideal body weight from height and sex — educational only.",
    ["ideal body weight calculator", "Devine IBW", "educational IBW"],
    "sparkTrendDemo",
  ),
  "lean-body-mass-calculator": article(
    "lean-body-mass-calculator",
    "Lean body mass (Boer)",
    [
      "Boer lean-body-mass estimate from weight, height, and sex.",
      "Educational body-composition math — not medical advice or DXA replacement.",
    ],
    {
      question: "Is this the same as body-fat %?",
      answer:
        "No — this estimates lean mass with the Boer formula. The body-fat tool lives on the health body-fat page.",
    },
    "Lean Body Mass Calculator — Boer Educational Estimate",
    "Estimate lean body mass with the Boer formula — educational only, not medical advice.",
    ["lean body mass calculator", "Boer LBM", "lean mass education"],
    "none",
  ),
  "body-surface-area-calculator": article(
    "body-surface-area-calculator",
    "Body surface area (Mosteller)",
    [
      "Mosteller BSA ≈ √((height_cm × weight_kg) / 3600).",
      "Educational surface-area estimate — not medical dosing advice.",
    ],
    {
      question: "Can I use this for drug dosing?",
      answer: "No — dosing requires clinical protocols. This tool is for classroom BSA arithmetic only.",
    },
    "Body Surface Area Calculator — Mosteller Educational Formula",
    "Estimate BSA with the Mosteller formula — educational only, not medical advice.",
    ["body surface area calculator", "Mosteller BSA", "BSA education"],
    "sparkTrendDemo",
  ),
  "heart-rate-calculator": article(
    "heart-rate-calculator",
    "Max heart rate",
    [
      "Educational max HR ≈ 220 − age.",
      "Not exercise prescription or medical advice — individual limits vary widely.",
    ],
    {
      question: "Is 220 − age accurate for everyone?",
      answer: "No — it is a simplified teaching estimate. Use clinician or coach guidance for training.",
    },
    "Heart Rate Calculator — Educational Max HR Estimate",
    "Estimate maximum heart rate as 220 minus age — educational only, not medical advice.",
    ["max heart rate calculator", "220 minus age", "heart rate education"],
    "none",
  ),
  "target-heart-rate-calculator": article(
    "target-heart-rate-calculator",
    "Target heart rate zones",
    [
      "Karvonen-style moderate and vigorous zones from age and resting HR.",
      "Educational training math — not medical advice or an exercise prescription.",
    ],
    {
      question: "What resting HR should I enter?",
      answer: "Use a quiet resting measurement if available. This tool does not diagnose fitness level.",
    },
    "Target Heart Rate Calculator — Educational Karvonen Zones",
    "Estimate moderate and vigorous HR zones from age and resting HR — not medical advice.",
    ["target heart rate calculator", "Karvonen zones", "training heart rate education"],
    "sparkTrendDemo",
  ),
  "blood-pressure-analysis-tool": article(
    "blood-pressure-analysis-tool",
    "Blood pressure analysis",
    [
      "Educational category bands from systolic and diastolic values, plus pulse pressure.",
      "Not a diagnosis — seek urgent care for crisis-range readings and consult a clinician.",
    ],
    {
      question: "Is this a blood-pressure diagnosis?",
      answer: "No — labels are educational only and are not a substitute for clinical evaluation.",
    },
    "Blood Pressure Analysis Tool — Educational Categories",
    "Explore educational BP category bands from systolic and diastolic — not medical advice.",
    ["blood pressure analysis", "BP category education", "pulse pressure BP"],
    "none",
  ),
  "pulse-pressure-calculator": article(
    "pulse-pressure-calculator",
    "Pulse pressure",
    [
      "Pulse pressure = systolic − diastolic.",
      "Simple educational difference — not medical advice or vascular diagnosis.",
    ],
    {
      question: "What is a normal pulse pressure?",
      answer: "Clinical norms vary; this tool only computes the difference for classroom use.",
    },
    "Pulse Pressure Calculator — Systolic Minus Diastolic",
    "Calculate pulse pressure from systolic and diastolic — educational only.",
    ["pulse pressure calculator", "systolic diastolic difference", "PP education"],
    "sparkTrendDemo",
  ),
  "calorie-burn-calculator": article(
    "calorie-burn-calculator",
    "Calorie burn (MET)",
    [
      "kcal ≈ MET × weight (kg) × hours.",
      "Educational activity-energy estimate — not medical advice or a metabolic measurement.",
    ],
    {
      question: "Where do MET values come from?",
      answer: "Use published activity MET tables for teaching examples; real burn varies by person.",
    },
    "Calorie Burn Calculator — MET × Weight × Hours",
    "Estimate activity calories from METs, weight, and hours — educational only.",
    ["calorie burn calculator", "MET calorie estimate", "activity energy education"],
    "none",
  ),
  "daily-calorie-needs-calculator": article(
    "daily-calorie-needs-calculator",
    "Daily calorie needs (TDEE)",
    [
      "TDEE ≈ BMR × activity factor.",
      "Educational energy-budget math — not medical advice or a personalized meal plan.",
    ],
    {
      question: "What activity factor should I use?",
      answer: "Classroom examples often use about 1.2–1.9. Choose a teaching factor; this is not clinical guidance.",
    },
    "Daily Calorie Needs Calculator — BMR × Activity",
    "Estimate TDEE from BMR and activity factor — educational only, not medical advice.",
    ["daily calorie needs calculator", "TDEE from BMR", "activity factor education"],
    "sparkTrendDemo",
  ),
  "vo2-max-calculator": article(
    "vo2-max-calculator",
    "VO₂ max estimate",
    [
      "Educational VO₂max ≈ 15.3 × (max HR / rest HR).",
      "Not a lab VO₂ test or medical fitness assessment.",
    ],
    {
      question: "Is this as accurate as a treadmill test?",
      answer: "No — it is a simplified classroom estimate from heart-rate ratios only.",
    },
    "VO2 Max Calculator — Educational Heart-Rate Estimate",
    "Estimate VO₂ max from max and resting heart rate — educational only.",
    ["VO2 max calculator", "VO2 heart rate estimate", "cardio fitness education"],
    "none",
  ),
  "mets-calculator": article(
    "mets-calculator",
    "METs from activity",
    [
      "MET ≈ (kcal per hour) / weight (kg).",
      "Educational intensity estimate from energy rate and body weight.",
    ],
    {
      question: "Can MET replace a clinical stress test?",
      answer: "No — this is classroom intensity math only, not medical advice.",
    },
    "METs Calculator — kcal/hour ÷ Weight",
    "Estimate METs from kcal per hour and body weight — educational only.",
    ["METs calculator", "metabolic equivalent education", "activity MET estimate"],
    "sparkTrendDemo",
  ),
  "blood-volume-calculator": article(
    "blood-volume-calculator",
    "Blood volume (Nadler)",
    [
      "Nadler-style blood volume from weight, height, and sex (male/female).",
      "Educational estimate only — not medical advice for transfusion or dosing.",
    ],
    {
      question: "Is Nadler volume used clinically here?",
      answer: "This page is educational only. Clinical decisions require qualified care.",
    },
    "Blood Volume Calculator — Nadler Educational Estimate",
    "Estimate blood volume with the Nadler formula — educational only, not medical advice.",
    ["blood volume calculator", "Nadler blood volume", "estimated blood volume education"],
    "none",
  ),
  "hemoglobin-correction-calculator": article(
    "hemoglobin-correction-calculator",
    "Hemoglobin altitude factor",
    [
      "Educational placeholder: corrected ≈ measured × (1 + 0.03 × altitude_km).",
      "Not a clinical altitude-adjustment protocol or medical advice.",
    ],
    {
      question: "Is this a real clinical correction formula?",
      answer: "No — it is a simplified teaching placeholder. Use clinical references for real adjustments.",
    },
    "Hemoglobin Correction Calculator — Educational Altitude Factor",
    "Explore a simple educational altitude hemoglobin factor — not medical advice.",
    ["hemoglobin correction calculator", "altitude hemoglobin education", "Hb factor classroom"],
    "sparkTrendDemo",
  ),
  "glucose-level-converter": article(
    "glucose-level-converter",
    "Glucose unit converter",
    [
      "Convert between mg/dL and mmol/L (factor ≈ 18.0182).",
      "Use from flag b=0 for mg/dL input or b=1 for mmol/L. Not medical advice.",
    ],
    {
      question: "Does converting units diagnose diabetes?",
      answer: "No — unit conversion is educational arithmetic only and is not a diagnosis.",
    },
    "Glucose Level Converter — mg/dL ↔ mmol/L",
    "Convert glucose between mg/dL and mmol/L for educational use — not medical advice.",
    ["glucose converter", "mg/dL to mmol/L", "blood glucose units education"],
    "none",
  ),
  "hba1c-calculator": article(
    "hba1c-calculator",
    "HbA1c → eAG",
    [
      "Educational eAG (mg/dL) ≈ 28.7 × A1c% − 46.7, with mmol/L conversion.",
      "Not medical advice, diagnosis, or treatment guidance.",
    ],
    {
      question: "Can I manage diabetes with this tool?",
      answer: "No — discuss A1c and glucose targets with a qualified clinician.",
    },
    "HbA1c Calculator — Educational eAG Estimate",
    "Estimate average glucose from A1c for educational use — not medical advice.",
    ["HbA1c calculator", "eAG from A1c", "A1c education"],
    "sparkTrendDemo",
  ),
};
