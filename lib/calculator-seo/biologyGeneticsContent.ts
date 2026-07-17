import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-genetics-heredity";
const HUB_LABEL = "Education · Science · Biology Genetics & Heredity";
const SHELL =
  "Classroom Mendelian and population-genetics arithmetic. Educational models only — not clinical genetics advice.";

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
        title: "Genetics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Punnett square", "Monohybrid offspring counts"],
          ["Genotype probability", "Target genotype / 4"],
          ["Phenotype ratio", "Dominant : recessive"],
          ["Allele frequency", "p from AA, Aa, aa counts"],
          ["Hardy–Weinberg", "p², 2pq, q²"],
          ["Genetic drift", "He decay with N, t"],
          ["Mutation rate", "mutations / (sites × gens)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your genetics inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Inheritance idea",
            caption: "Share URL preserves your genetics inputs.",
            sparkValues: [0.25, 0.4, 0.5, 0.55, 0.7, 0.85],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_GENETICS_ARTICLES: Record<string, RichArticle> = {
  "punnett-square-calculator": article(
    "punnett-square-calculator",
    "Punnett square",
    [
      "Builds a monohybrid Punnett square from two diploid genotypes (two letters each, e.g. Aa).",
      "Offspring genotypes are sorted allele pairs with counts out of four.",
    ],
    {
      question: "Does order of alleles matter?",
      answer: "No — Aa and aA are treated as the same genotype after sorting.",
    },
    "Punnett Square Calculator — Monohybrid Cross",
    "Calculate Punnett square offspring genotypes from two parent genotypes.",
    ["punnett square calculator", "monohybrid cross", "Mendelian genetics"],
    "sparkTrendDemo",
  ),
  "genotype-probability-calculator": article(
    "genotype-probability-calculator",
    "Genotype probability",
    [
      "Finds the probability of a target genotype from a monohybrid Punnett cross.",
      "Enter parent genotypes and the target (e.g. aa).",
    ],
    {
      question: "What if the target never appears?",
      answer: "Probability is 0 — the target genotype is not among the four offspring slots.",
    },
    "Genotype Probability Calculator — Punnett Target Odds",
    "Calculate the probability of a target genotype from two parent genotypes.",
    ["genotype probability calculator", "Punnett probability", "Mendelian odds"],
    "none",
  ),
  "phenotype-ratio-calculator": article(
    "phenotype-ratio-calculator",
    "Phenotype ratio",
    [
      "Counts dominant vs recessive phenotypes assuming any uppercase allele is dominant.",
      "Reports a simple dominant:recessive ratio from the Punnett offspring.",
    ],
    {
      question: "Does this handle incomplete dominance?",
      answer: "No — this classroom tool uses a simple complete-dominance rule.",
    },
    "Phenotype Ratio Calculator — Dominant to Recessive",
    "Calculate dominant:recessive phenotype ratios from a monohybrid cross.",
    ["phenotype ratio calculator", "dominant recessive ratio", "Mendelian phenotype"],
    "sparkTrendDemo",
  ),
  "allele-frequency-calculator": article(
    "allele-frequency-calculator",
    "Allele frequency",
    [
      "Estimates p = (2×AA + heterozygous) / (2N) and q = 1 − p from genotype counts.",
      "Enter AA, heterozygous, and recessive (aa) individual counts.",
    ],
    {
      question: "Must counts be integers?",
      answer: "Whole-number counts are typical, but any non-negative values that sum to a positive N work.",
    },
    "Allele Frequency Calculator — p and q from Genotypes",
    "Calculate allele frequencies p and q from AA, heterozygous, and aa counts.",
    ["allele frequency calculator", "p and q genetics", "genotype counts"],
    "none",
  ),
  "hardy-weinberg-equilibrium-calculator": article(
    "hardy-weinberg-equilibrium-calculator",
    "Hardy–Weinberg equilibrium",
    [
      "From allele frequency p (0–1), computes p², 2pq, and q² with q = 1 − p.",
      "Ideal HWE genotype frequencies for a single diallelic locus.",
    ],
    {
      question: "What if p is 0.5?",
      answer: "Then q is 0.5 and expected frequencies are 0.25 : 0.5 : 0.25.",
    },
    "Hardy Weinberg Equilibrium Calculator — p² 2pq q²",
    "Calculate Hardy–Weinberg genotype frequencies from allele frequency p.",
    ["hardy weinberg calculator", "p2 2pq q2", "HWE genetics"],
    "sparkTrendDemo",
  ),
  "genetic-drift-simulator": article(
    "genetic-drift-simulator",
    "Genetic drift",
    [
      "Projects expected heterozygosity He_t ≈ He₀ × (1 − 1/(2N))^t.",
      "Illustrates how small populations lose diversity over generations.",
    ],
    {
      question: "Is this a stochastic simulation?",
      answer: "No — it is the classic expected-heterozygosity decay formula, not a random walk draw.",
    },
    "Genetic Drift Simulator — Heterozygosity Decay",
    "Estimate heterozygosity after genetic drift from He₀, population size, and generations.",
    ["genetic drift simulator", "heterozygosity decay", "effective population"],
    "none",
  ),
  "mutation-rate-calculator": article(
    "mutation-rate-calculator",
    "Mutation rate",
    [
      "Computes μ = mutations / (sites × generations).",
      "A simple per-site per-generation classroom estimator.",
    ],
    {
      question: "Can mutations be zero?",
      answer: "Yes — zero mutations gives μ = 0; sites and generations must stay positive.",
    },
    "Mutation Rate Calculator — Mutations per Site per Generation",
    "Calculate mutation rate from mutation count, sites, and generations.",
    ["mutation rate calculator", "per site mutation rate", "μ genetics"],
    "sparkTrendDemo",
  ),
};
