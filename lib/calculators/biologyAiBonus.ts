/** Rule-based “AI” biology planners — not a live model; educational only. */

export const BIOLOGY_AI_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseBiologyAiSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_AI_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function aiDietPlanner(params: {
  calories: number;
  style: string;
}): { plan: string; proteinG: number; carbG: number; fatG: number } | { error: string } {
  if (params.calories < 1000 || params.calories > 5000) {
    return { error: "Enter calories between 1000 and 5000 (educational template)." };
  }
  const style = params.style.trim().toLowerCase();
  const veg = style.includes("veg") && !style.includes("non");
  const proteinG = (params.calories * 0.25) / 4;
  const carbG = (params.calories * 0.5) / 4;
  const fatG = (params.calories * 0.25) / 9;
  const plan = veg
    ? `Plant-forward day ~${Math.round(params.calories)} kcal: oats + fruit; dal/legumes + grain; tofu/tempeh stir-fry. Not medical advice.`
    : `Mixed day ~${Math.round(params.calories)} kcal: eggs/yogurt breakfast; grain + lean protein lunch; fish/chicken or legumes dinner. Not medical advice.`;
  return { plan, proteinG, carbG, fatG };
}

export function aiFitnessPlanner(params: {
  daysPerWeek: number;
  goal: string;
}): { plan: string } | { error: string } {
  if (params.daysPerWeek < 1 || params.daysPerWeek > 7) {
    return { error: "Days/week must be 1–7." };
  }
  const g = params.goal.trim().toLowerCase();
  let focus = "general fitness (mix of cardio + strength)";
  if (g.includes("strength") || g.includes("muscle")) focus = "strength (compound lifts + recovery)";
  else if (g.includes("endurance") || g.includes("cardio")) focus = "endurance (zone-2 + intervals)";
  else if (g.includes("flex") || g.includes("mobility")) focus = "mobility (stretch + light cardio)";
  return {
    plan: `${params.daysPerWeek} day/week template focused on ${focus}. Warm-up 5–10 min each session. Rule-based helper — not a coach or medical plan.`,
  };
}

const STUDY_TIPS: Record<string, string> = {
  cell: "Cell biology: sketch organelles, then quiz membrane transport and mitosis stages.",
  gene: "Genetics: practice Punnett squares, then HWE allele-frequency drills.",
  eco: "Ecology: map food webs, then compute simple growth and diversity indices.",
  physio: "Physiology: link structure→function; draw feedback loops for hormones.",
  molec: "Molecular: walk DNA→RNA→protein; calculate GC% and Tm on short oligos.",
};

export function aiStudyAssistantBiology(params: {
  topic: string;
}): { advice: string } | { error: string } {
  const t = params.topic.trim().toLowerCase();
  if (!t) return { error: "Enter a topic keyword (cell, gene, eco, physio, molec)." };
  const hit = Object.entries(STUDY_TIPS).find(([k]) => t.includes(k));
  if (!hit) {
    return {
      advice:
        "No preset match. Try cell, gene, eco, physio, or molec. Rule-based study tips — not a live AI tutor.",
    };
  }
  return { advice: hit[1] };
}

const REPORT_SECTIONS: Record<string, string> = {
  dilution: "Title → Aim → Materials → Serial-dilution method → Results table → Discussion → Sources of error.",
  pcr: "Title → Aim → Primer/template notes → Cycling conditions → Gel/results → Interpretation → Errors.",
  enzyme: "Title → Aim → Enzyme assay protocol → Controls → Rate graph → Km/Vmax discussion → Errors.",
  field: "Title → Aim → Site description → Sampling method → Data → Ecology interpretation → Limitations.",
};

export function aiLabReportGenerator(params: {
  experiment: string;
}): { outline: string } | { error: string } {
  const e = params.experiment.trim().toLowerCase();
  if (!e) return { error: "Enter an experiment keyword (dilution, pcr, enzyme, field)." };
  const hit = Object.entries(REPORT_SECTIONS).find(([k]) => e.includes(k));
  if (!hit) {
    return {
      outline:
        "Generic outline: Title, Aim, Background, Method, Results, Discussion, Conclusion, References. Not AI-written prose.",
    };
  }
  return { outline: hit[1] };
}
