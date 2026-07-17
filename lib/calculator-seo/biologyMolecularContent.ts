import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-molecular";
const HUB_LABEL = "Education · Science · Biology Molecular";
const SHELL =
  "Educational molecular-biology math for classroom sequence and mass estimates only — not clinical diagnostics, lab certification, or research-grade analysis. Verify critical calculations with primary methods.";

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
        title: "Molecular biology tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["DNA/RNA MW", "length × 650 (dsDNA) or × 320 (ssRNA)"],
          ["Primer Tm", "Wallace: 2(A+T) + 4(G+C)"],
          ["GC content", "(G+C) / length × 100"],
          ["Codon usage", "count triplets in CDS"],
          ["Protein MW", "sum AA masses (teaching approx)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational molecular math only — not lab certification.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Sequence metrics idea",
            caption: "Share URL preserves your inputs. Educational molecular math only — not lab certification.",
            sparkValues: [0.25, 0.4, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_MOLECULAR_ARTICLES: Record<string, RichArticle> = {
  "dna-rna-molecular-weight-calculator": article(
    "dna-rna-molecular-weight-calculator",
    "DNA / RNA molecular weight",
    [
      "Approximate mass: dsDNA ≈ length × 650 Da; ssRNA ≈ length × 320 Da.",
      "Classroom rule-of-thumb only — not a substitute for exact oligo or polymer MW methods.",
    ],
    {
      question: "Why 650 vs 320?",
      answer: "They are common teaching averages for average nucleotide mass of double-stranded DNA vs single-stranded RNA.",
    },
    "DNA RNA Molecular Weight Calculator — Educational Estimate",
    "Estimate dsDNA or ssRNA molecular weight from length — educational approximation only.",
    ["dna molecular weight calculator", "rna mw estimate", "oligonucleotide mass education"],
    "sparkTrendDemo",
  ),
  "primer-melting-temperature-tm-calculator": article(
    "primer-melting-temperature-tm-calculator",
    "Primer melting temperature (Tm)",
    [
      "Wallace rule for short primers: Tm = 2(A+T) + 4(G+C).",
      "Best for oligos about 5–35 nt. Educational Tm — not a PCR design guarantee.",
    ],
    {
      question: "Is Wallace Tm accurate for long primers?",
      answer: "No — it is a short-oligo teaching rule. Longer primers need more detailed nearest-neighbor models.",
    },
    "Primer Melting Temperature Calculator — Wallace Tm",
    "Estimate short-primer Tm with the Wallace rule — educational PCR math only.",
    ["primer tm calculator", "wallace rule melting temperature", "oligonucleotide tm education"],
    "none",
  ),
  "gc-content-calculator": article(
    "gc-content-calculator",
    "GC content",
    [
      "GC% = (G + C count) / sequence length × 100 after cleaning to A/C/G/T/U.",
      "Educational sequence statistic for class — not a genome annotation pipeline.",
    ],
    {
      question: "Are U bases counted?",
      answer: "U is treated as T for GC counting; only G and C contribute to the GC numerator.",
    },
    "GC Content Calculator — DNA/RNA Percent G+C",
    "Calculate GC percentage from a DNA or RNA sequence for educational use.",
    ["gc content calculator", "percent gc dna", "sequence gc education"],
    "sparkTrendDemo",
  ),
  "codon-usage-calculator": article(
    "codon-usage-calculator",
    "Codon usage",
    [
      "Counts successive triplets in a coding sequence whose length is a multiple of 3.",
      "Teaching codon tally — not organism-specific codon optimization software.",
    ],
    {
      question: "Must the sequence start at a start codon?",
      answer: "No — any in-frame length multiple of 3 is tallied from the first base you enter.",
    },
    "Codon Usage Calculator — Coding Sequence Counts",
    "Count codon frequencies in a coding sequence — educational molecular biology tool.",
    ["codon usage calculator", "codon frequency", "cds codon counts education"],
    "none",
  ),
  "protein-molecular-weight-calculator": article(
    "protein-molecular-weight-calculator",
    "Protein molecular weight",
    [
      "Sums approximate amino-acid residue masses from 1-letter codes with a simple termini correction.",
      "Classroom MW estimate — not mass-spectrometry–grade monoisotopic calculation.",
    ],
    {
      question: "Are modifications included?",
      answer: "No — only standard residue masses. PTMs and unusual amino acids are not modeled.",
    },
    "Protein Molecular Weight Calculator — AA Sequence MW",
    "Estimate protein molecular weight from a one-letter amino-acid sequence — educational only.",
    ["protein molecular weight calculator", "amino acid sequence mw", "peptide mass education"],
    "sparkTrendDemo",
  ),
};
