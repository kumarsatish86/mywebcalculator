/** Advanced / AI-powered HR helpers — heuristic teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrAiSlug =
  | "hr-ai-salary-benchmark-calculator"
  | "hr-ai-workforce-optimization-tool"
  | "hr-ai-productivity-analyzer"
  | "hr-ai-hiring-decision-score-tool";

export const HR_AI_SLUGS: HrAiSlug[] = [
  "hr-ai-salary-benchmark-calculator",
  "hr-ai-workforce-optimization-tool",
  "hr-ai-productivity-analyzer",
  "hr-ai-hiring-decision-score-tool",
];

export type HrAiInput = {
  offerAnnual?: number;
  marketMedian?: number;
  marketP25?: number;
  marketP75?: number;
  currentFte?: number;
  demandFte?: number;
  overtimeHours?: number;
  idlePct?: number;
  output?: number;
  hours?: number;
  peerOutputPerHour?: number;
  skillScore?: number;
  cultureScore?: number;
  experienceScore?: number;
  compensationFit?: number;
  weightSkill?: number;
  weightCulture?: number;
  weightExperience?: number;
  weightComp?: number;
};

export function computeHrAi(slug: HrAiSlug, input: HrAiInput): HrResult {
  switch (slug) {
    case "hr-ai-salary-benchmark-calculator": {
      const offer = pos(input.offerAnnual, "Offer (annual)");
      if (typeof offer !== "number") return { ok: false, error: offer.error };
      const median = pos(input.marketMedian, "Market median");
      if (typeof median !== "number") return { ok: false, error: median.error };
      const p25 = input.marketP25 && input.marketP25 > 0 ? input.marketP25 : median * 0.85;
      const p75 = input.marketP75 && input.marketP75 > 0 ? input.marketP75 : median * 1.15;
      const vsMedian = ((offer - median) / median) * 100;
      let band = "at median";
      if (offer < p25) band = "below P25";
      else if (offer > p75) band = "above P75";
      else if (offer < median) band = "P25–median";
      else band = "median–P75";
      return { ok: true, pct: vsMedian, amount: offer, amount2: median, note: `Heuristic band: ${band}. Not market survey data.` };
    }
    case "hr-ai-workforce-optimization-tool": {
      const current = pos(input.currentFte, "Current FTE");
      if (typeof current !== "number") return { ok: false, error: current.error };
      const demand = pos(input.demandFte, "Demand FTE");
      if (typeof demand !== "number") return { ok: false, error: demand.error };
      const ot = nonNeg(input.overtimeHours ?? 0, "OT hours (period)");
      if (typeof ot !== "number") return { ok: false, error: ot.error };
      const idle = nonNeg(input.idlePct ?? 0, "Idle %");
      if (typeof idle !== "number") return { ok: false, error: idle.error };
      const gap = demand - current;
      const otFte = ot / 160;
      const idleFte = current * (idle / 100);
      const suggested = Math.max(0, gap - idleFte + otFte * 0.5);
      return {
        ok: true,
        count: suggested,
        amount: gap,
        amount2: idleFte,
        note: "Heuristic FTE tweak from demand gap, idle capacity, and OT pressure — verify with ops.",
      };
    }
    case "hr-ai-productivity-analyzer": {
      const output = pos(input.output, "Output");
      if (typeof output !== "number") return { ok: false, error: output.error };
      const hours = pos(input.hours, "Hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const peer = pos(input.peerOutputPerHour ?? output / hours, "Peer output/hour");
      if (typeof peer !== "number") return { ok: false, error: peer.error };
      const rate = output / hours;
      const vsPeer = peer > 0 ? (rate / peer) * 100 : 100;
      return { ok: true, rate, pct: vsPeer, amount: rate, note: "Productivity vs peer benchmark (heuristic analyzer)." };
    }
    case "hr-ai-hiring-decision-score-tool": {
      const skill = nonNeg(input.skillScore ?? 0, "Skill score");
      if (typeof skill !== "number") return { ok: false, error: skill.error };
      const culture = nonNeg(input.cultureScore ?? 0, "Culture score");
      if (typeof culture !== "number") return { ok: false, error: culture.error };
      const exp = nonNeg(input.experienceScore ?? 0, "Experience score");
      if (typeof exp !== "number") return { ok: false, error: exp.error };
      const comp = nonNeg(input.compensationFit ?? 0, "Compensation fit");
      if (typeof comp !== "number") return { ok: false, error: comp.error };
      const ws = input.weightSkill && input.weightSkill > 0 ? input.weightSkill : 0.35;
      const wc = input.weightCulture && input.weightCulture > 0 ? input.weightCulture : 0.25;
      const we = input.weightExperience && input.weightExperience > 0 ? input.weightExperience : 0.25;
      const wp = input.weightComp && input.weightComp > 0 ? input.weightComp : 0.15;
      const tw = ws + wc + we + wp;
      const score = (ws * skill + wc * culture + we * exp + wp * comp) / tw;
      return { ok: true, score, amount: score, note: "Weighted hiring decision score (0–100 style inputs) — not an automated hire decision." };
    }
    default:
      return { ok: false, error: "Unknown AI HR calculator." };
  }
}
