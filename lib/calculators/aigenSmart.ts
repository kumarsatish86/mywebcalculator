/** Smart hybrid generators — scores + plan drafts (not live LLMs). */
import { draftOk, money, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenSmartSlug =
  | "aigen-ai-career-path-generator"
  | "aigen-ai-skill-gap-analyzer"
  | "aigen-ai-resume-score-calculator"
  | "aigen-ai-investment-advisor"
  | "aigen-ai-budget-optimizer"
  | "aigen-ai-learning-path-generator"
  | "aigen-ai-productivity-analyzer";

export const AIGEN_SMART_SLUGS: AigenSmartSlug[] = [
  "aigen-ai-career-path-generator",
  "aigen-ai-skill-gap-analyzer",
  "aigen-ai-resume-score-calculator",
  "aigen-ai-investment-advisor",
  "aigen-ai-budget-optimizer",
  "aigen-ai-learning-path-generator",
  "aigen-ai-productivity-analyzer",
];

export function computeAigenSmart(slug: AigenSmartSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your field");
  const level = str(input.level, "intermediate");
  const goal = str(input.goal, "grow sustainably");
  const amount = numOr(input.amount, 50000);
  const amount2 = numOr(input.amount2, 35000);
  const rate = numOr(input.rate, 70);
  const hours = numOr(input.hours, 40);
  const days = Math.max(1, Math.round(numOr(input.days, 90)));

  switch (slug) {
    case "aigen-ai-career-path-generator": {
      const score = Math.min(95, Math.round(50 + rate / 3));
      return draftOk(
        [
          `Career path draft — ${topic}`,
          `Readiness score (heuristic): ${score}/100`,
          `Level: ${level} · Horizon: ${days} days`,
          "Stage 1: Clarify target role + must-have skills",
          "Stage 2: Build 1–2 portfolio proofs",
          "Stage 3: Network + applications cadence",
          `Goal: ${goal}`,
          "Teaching path only — not a placement guarantee",
        ],
        { score, primary: score },
      );
    }
    case "aigen-ai-skill-gap-analyzer": {
      const current = Math.min(100, Math.max(0, rate));
      const gap = Math.max(0, 100 - current);
      return draftOk(
        [
          `Skill gap analysis — ${topic}`,
          `Self-rated mastery: ${current}/100 → gap ~${gap}`,
          "Gap A: Fundamentals / theory",
          "Gap B: Tools / implementation",
          "Gap C: Communication / storytelling of work",
          `90-day focus: close the largest gap toward ${goal}`,
          "Practice weekly with measurable drills",
        ],
        { score: current, primary: gap },
      );
    }
    case "aigen-ai-resume-score-calculator": {
      const impact = Math.min(100, Math.max(0, rate));
      const clarity = Math.min(100, Math.max(0, numOr(input.amount, 70)));
      const score = Math.round(impact * 0.55 + clarity * 0.45);
      return draftOk(
        [
          `Resume score (heuristic) — ${topic}`,
          `Overall: ${score}/100`,
          `Impact signals: ${impact}/100 · Clarity: ${clarity}/100`,
          "Improve: add metrics to top 3 bullets",
          "Improve: tailor keywords to the target role",
          "Improve: cut fluff; lead with verbs",
          `Goal role context: ${goal}`,
        ],
        { score, primary: score },
      );
    }
    case "aigen-ai-investment-advisor": {
      const risk = Math.min(100, Math.max(0, rate));
      const equity = Math.min(90, Math.max(20, risk));
      return draftOk(
        [
          `Investment sketch — ${topic}`,
          `Risk comfort proxy: ${risk}/100 → equity bias ~${equity}%`,
          `Monthly invest context: ₹${money(amount)}`,
          "Core: diversified equity index / funds",
          "Ballast: debt / liquid for near goals",
          `Objective: ${goal}`,
          "Not SEBI-registered advice — verify with a qualified advisor",
        ],
        { score: equity, primary: equity },
      );
    }
    case "aigen-ai-budget-optimizer": {
      const income = amount;
      const spend = amount2;
      const surplus = income - spend;
      const saveRate = income > 0 ? Math.round((Math.max(0, surplus) / income) * 100) : 0;
      return draftOk(
        [
          `Budget optimizer — ${topic}`,
          `Income ₹${money(income)} · Spend ₹${money(spend)} · Surplus ₹${money(surplus)}`,
          `Save rate ~${saveRate}%`,
          surplus >= 0
            ? "Allocate surplus: 50% goals · 30% invest · 20% fun buffer"
            : "Priority: cut 2 discretionary categories; pause new EMIs",
          `Align cuts/boosts to: ${goal}`,
          "Revisit in 30 days with actuals",
        ],
        { score: saveRate, primary: surplus },
      );
    }
    case "aigen-ai-learning-path-generator": {
      const score = Math.min(95, Math.round(40 + hours / 2));
      return draftOk(
        [
          `Learning path — ${topic}`,
          `Commitment sketch: ${hours}h/week · ${days} days · plan score ${score}`,
          "Week block: Learn → Build → Review",
          `Level track: ${level} → project-ready`,
          "Milestones: notes, mini-project, teach-back",
          `Outcome goal: ${goal}`,
        ],
        { score, primary: score },
      );
    }
    case "aigen-ai-productivity-analyzer": {
      const focus = Math.min(100, Math.max(0, rate));
      const load = Math.min(80, Math.max(10, hours));
      const score = Math.round(focus * 0.6 + (100 - Math.abs(load - 40)) * 0.4);
      return draftOk(
        [
          `Productivity analyzer — ${topic}`,
          `Heuristic score: ${score}/100`,
          `Focus self-rate: ${focus} · Hours load: ${load}`,
          "Keep: one deep-work block before messages",
          "Cut: low-value meetings / tab sprawl",
          `Optimize toward: ${goal}`,
        ],
        { score, primary: score },
      );
    }
    default:
      return { ok: false, error: "Unknown smart generator." };
  }
}
