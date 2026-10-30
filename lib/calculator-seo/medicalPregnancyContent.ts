import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/pregnancy-womens-health";
const HUB_LABEL = "Health · Medical · Pregnancy & Women's Health";
const SHELL =
  "Educational pregnancy and cycle dating tools in your browser only. Not obstetric diagnosis, prenatal care, fertility treatment, or medical advice. Confirm dates and guidance with qualified clinicians.";

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
        title: "Pregnancy & cycle tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Due date", "LMP + 280 days (Naegele)"],
          ["Ovulation", "Cycle length − 14 from LMP"],
          ["Fertility window", "Ovulation −5 to +1 days"],
          ["Gestational age", "Days from LMP to today"],
          ["Weight gain", "IOM-style BMI bands"],
          ["Conception", "Aligned with ovulation day"],
          ["IVF success", "Illustrative age-band %"],
          ["Menstrual cycle", "LMP + cycle length"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your date and cycle inputs. Educational planning models only — not obstetric care.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Cycle awareness",
            caption:
              "Share URL preserves your date and cycle inputs. Educational planning models only — not obstetric care.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_PREGNANCY_ARTICLES: Record<string, RichArticle> = {
  "medical-pregnancy-due-date-calculator": article(
    "medical-pregnancy-due-date-calculator",
    "Naegele due-date estimate",
    [
      "Enter last menstrual period (LMP) as YYYY-MM-DD. The tool adds 280 days for a teaching estimated due date.",
      "Planning arithmetic only — ultrasound dating and obstetric care require a clinician. Not medical advice.",
    ],
    {
      question: "Is Naegele’s rule always accurate?",
      answer:
        "No. It is a classic teaching estimate. Real dating depends on cycle length, ultrasound, and clinical context.",
    },
    "Pregnancy Due Date Calculator — Naegele LMP + 280 Days",
    "Estimate a teaching due date from LMP (YYYY-MM-DD) using Naegele’s rule. Educational only — not medical advice.",
    ["pregnancy due date calculator", "Naegele rule", "EDD from LMP educational"],
    "sparkTrendDemo",
  ),
  "medical-ovulation-calculator": article(
    "medical-ovulation-calculator",
    "Ovulation day estimate",
    [
      "Uses LMP and optional cycle length (default 28) and assumes ovulation about 14 days before the next period.",
      "Not a fertility diagnosis or contraception/ conception plan — educational timing only.",
    ],
    {
      question: "What cycle lengths are accepted?",
      answer:
        "This helper typically expects about 21–45 days. Irregular cycles need clinician guidance, not this estimate alone.",
    },
    "Ovulation Calculator — LMP and Cycle Length Teaching Tool",
    "Estimate ovulation from LMP and cycle length for education. Not medical advice or fertility diagnosis.",
    ["ovulation calculator", "LMP ovulation estimate", "cycle length educational"],
    "none",
  ),
  "medical-fertility-window-calculator": article(
    "medical-fertility-window-calculator",
    "Fertility window estimate",
    [
      "Builds an approximate window from estimated ovulation (about five days before through one day after).",
      "Teaching calendar math only — not fertility treatment or guarantee of conception.",
    ],
    {
      question: "Can I use this for contraception?",
      answer:
        "No. Fertile-window teaching tools are not reliable contraception. Discuss family planning with a clinician.",
    },
    "Fertility Window Calculator — Approximate Ovulation Range",
    "Estimate a teaching fertility window from LMP and cycle length. Educational only — not medical advice.",
    ["fertility window calculator", "fertile days estimate", "ovulation window educational"],
    "sparkTrendDemo",
  ),
  "medical-gestational-age-calculator": article(
    "medical-gestational-age-calculator",
    "Gestational age from LMP",
    [
      "Counts days from LMP to today (optional YYYY-MM-DD) and reports weeks plus leftover days.",
      "Educational chronology only — clinical gestational age may use ultrasound or other dating.",
    ],
    {
      question: "What if today is before LMP?",
      answer:
        "The helper returns an error. Check date order (YYYY-MM-DD) or leave today blank to use the current date.",
    },
    "Gestational Age Calculator — Weeks and Days from LMP",
    "Compute teaching gestational age in weeks/days from LMP. Educational only — not obstetric diagnosis.",
    ["gestational age calculator", "weeks pregnant from LMP", "pregnancy dating educational"],
    "none",
  ),
  "medical-pregnancy-weight-gain-calculator": article(
    "medical-pregnancy-weight-gain-calculator",
    "IOM-style weight-gain bands",
    [
      "Maps pre-pregnancy BMI to common teaching total-gain ranges and compares them with current gain in kg.",
      "Not individualized prenatal nutrition advice — discuss targets with obstetric care providers.",
    ],
    {
      question: "Which BMI bands are used?",
      answer:
        "Underweight <18.5, normal <25, overweight <30, and obesity ≥30 map to common IOM-style total kg ranges for teaching.",
    },
    "Pregnancy Weight Gain Calculator — BMI Band Teaching Ranges",
    "Compare current pregnancy weight gain with IOM-style BMI teaching bands. Not medical advice.",
    ["pregnancy weight gain calculator", "IOM weight gain", "prenatal BMI educational"],
    "sparkTrendDemo",
  ),
  "medical-conception-calculator": article(
    "medical-conception-calculator",
    "Conception day estimate",
    [
      "Aligns a teaching conception estimate with the same ovulation-day model used for cycle helpers.",
      "Not proof of conception date — clinical dating may differ. Educational planning only.",
    ],
    {
      question: "Is this the same as ovulation day?",
      answer:
        "In this educational model, yes — the conception estimate follows the calculated ovulation date.",
    },
    "Conception Calculator — Ovulation-Aligned Teaching Estimate",
    "Estimate a teaching conception date from LMP and cycle length. Educational only — not medical advice.",
    ["conception calculator", "conception date from LMP", "ovulation conception educational"],
    "none",
  ),
  "medical-ivf-success-calculator": article(
    "medical-ivf-success-calculator",
    "Illustrative IVF age bands",
    [
      "Maps age (18–50) to simplified teaching success percentages by band — not clinic-specific outcomes.",
      "Real IVF success depends on many factors; discuss prognosis with a fertility specialist.",
    ],
    {
      question: "Are these clinic rates?",
      answer:
        "No. They are illustrative age-band percentages for education only. Outcomes vary widely by clinic and case.",
    },
    "IVF Success Calculator — Age-Band Educational Estimates",
    "View illustrative IVF success percentages by age band for teaching. Not medical advice or prognosis.",
    ["IVF success calculator", "IVF age success rates educational", "fertility success estimate"],
    "sparkTrendDemo",
  ),
  "medical-menstrual-cycle-calculator": article(
    "medical-menstrual-cycle-calculator",
    "Next period estimate",
    [
      "Adds cycle length (default 28 days) to LMP (YYYY-MM-DD) for a teaching next-period date.",
      "Irregular cycles, pregnancy, hormones, and health conditions need clinician guidance — not this helper alone.",
    ],
    {
      question: "What if my cycle varies?",
      answer:
        "Use a typical length for rough planning, or see a clinician for irregular bleeding. This tool only adds days.",
    },
    "Menstrual Cycle Calculator — Next Period from LMP",
    "Estimate the next period from LMP and cycle length. Educational only — not medical advice.",
    ["menstrual cycle calculator", "next period calculator", "LMP cycle length educational"],
    "none",
  ),
};
