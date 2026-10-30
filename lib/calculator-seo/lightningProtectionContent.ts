import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/electrical/electrical-safety-protection";
const HUB_LABEL = "Engineering · Electrical safety";
const SHELL =
  "Runs in your browser. Educational LPS estimates only — not design approval. Confirm with a licensed engineer and the governing standard.";

export const LIGHTNING_PROTECTION_ARTICLES: Record<string, RichArticle> = {
  "elec-lightning-protection-calculator": {
    slug: "elec-lightning-protection-calculator",
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This Lightning Protection workspace estimates a protective-angle cone radius, a simplified rolling-sphere horizontal distance, footprint coverage, and a single-rod earthing ballpark.",
          "Use it for study, early feasibility sketches, and teaching — never as a substitute for IEC 62305 / NFPA 780 / IS 2309 design packages or stamped drawings.",
        ],
      },
      {
        heading: "When should you use this?",
        paragraphs: [
          "Comparing building heights and LPS classes while learning, preparing questions for a consultant, or linking into earthing and cable-size tools in the electrical protection journey.",
          "Do not use it to certify hospitals, towers, or explosives facilities without a licensed LPS designer.",
        ],
      },
      {
        heading: "Industry standards (context)",
        paragraphs: [
          "IEC 62305 and BS EN 62305 describe risk management and LPS classes. NFPA 780 covers installation practices in many US jurisdictions. IS 2309 is widely referenced in India.",
          "Selecting a standard in the workspace only switches teaching default angles, sphere radii, and notes — it does not execute the full normative procedure.",
        ],
      },
      {
        heading: "Typical mistakes",
        paragraphs: [
          "Widening the protective angle arbitrarily to “make radius larger,” ignoring soil resistivity when discussing earthing, and treating a single rod R ≈ ρ/(2πL) as a completed earth-termination system.",
          "Tall or complex roofs usually need mesh or rolling-sphere methods with multiple air terminations — cone-only estimates under-serve those cases.",
        ],
      },
      {
        heading: "Worked example (warehouse study)",
        paragraphs: [
          "Warehouse preset: H = 18 m, 60 × 40 m footprint, class III, ρ = 120 Ω·m, rod 3 m. Cone radius r = h·tan(θ) with θ from the IEC-style class table; compare r to half-diagonal ≈ 36 m.",
          "If coverage ratio < 1, add air terminations or revisit height/class with an engineer. If rod R is high, open the Earthing Resistance calculator next.",
        ],
      },
      {
        heading: "Case study sketch",
        paragraphs: [
          "A hospital tower (class I, taller façade) often shows HIGH study risk under cone-only checks even when local LPS exists — that signal means escalate to a full risk assessment, not DIY construction changes.",
        ],
      },
      {
        heading: "References",
        paragraphs: [
          "IEC 62305 series; NFPA 780; IS 2309; manufacturer air-termination guides. Always use the edition adopted by your authority having jurisdiction.",
        ],
      },
    ],
    tables: [
      {
        title: "Workspace modes",
        columnHeaders: ["Mode", "What you enter", "Best for"],
        rows: [
          ["Quick", "Preset, size, soil, rod", "Fast feasibility"],
          ["Expert", "+ class, θ, sphere R, air count", "Teaching sensitivity studies"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Radius grows with height",
      caption: "Live charts in the calculator use your θ — this spark is illustrative only.",
      sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
    },
    faq: [
      {
        question: "What formula is used for protection radius?",
        answer: "Teaching cone model r = h × tan(θ), with θ from the selected standard’s class table unless you override in Expert mode.",
      },
      {
        question: "Is the grounding value a Wenner measurement?",
        answer: "No. It is R ≈ ρ/(2πL) for a single vertical rod — a classroom ballpark only.",
      },
      {
        question: "Can I export a stamped PDF report?",
        answer: "Not in this version. Share the URL or save local project snapshots in your browser.",
      },
    ],
    meta: {
      seoTitle: "Lightning Protection Calculator | LPS radius, coverage & earthing study",
      seoDescription:
        "Engineering workspace: Quick/Expert LPS estimates, IEC/NFPA/IS notes, live diagram, height scenarios, and earthing ballpark. Educational use only.",
      keywords: [
        "lightning protection calculator",
        "LPS protection radius",
        "IEC 62305",
        "NFPA 780",
        "IS 2309",
        "earthing resistance",
        "air terminal",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
