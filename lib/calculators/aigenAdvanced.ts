/** Advanced hybrid roadmap generators — input-driven plan drafts. */
import { draftOk, money, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenAdvancedSlug =
  | "aigen-salary-to-financial-plan-generator"
  | "aigen-goal-to-roadmap-generator"
  | "aigen-resume-to-improvement-plan-generator"
  | "aigen-expenses-to-savings-strategy-generator"
  | "aigen-marks-to-study-strategy-generator";

export const AIGEN_ADVANCED_SLUGS: AigenAdvancedSlug[] = [
  "aigen-salary-to-financial-plan-generator",
  "aigen-goal-to-roadmap-generator",
  "aigen-resume-to-improvement-plan-generator",
  "aigen-expenses-to-savings-strategy-generator",
  "aigen-marks-to-study-strategy-generator",
];

export function computeAigenAdvanced(slug: AigenAdvancedSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your plan");
  const goal = str(input.goal, "steady progress");
  const amount = numOr(input.amount, 60000);
  const amount2 = numOr(input.amount2, 40000);
  const rate = numOr(input.rate, 70);
  const days = Math.max(1, Math.round(numOr(input.days, 90)));
  const level = str(input.level, "intermediate");

  switch (slug) {
    case "aigen-salary-to-financial-plan-generator": {
      const salary = amount;
      const needs = Math.round(salary * 0.5);
      const wants = Math.round(salary * 0.2);
      const invest = Math.round(salary * 0.2);
      const buffer = salary - needs - wants - invest;
      return draftOk(
        [
          `Financial plan from salary — ${topic}`,
          `Monthly salary input: ₹${money(salary)}`,
          `Needs (~50%): ₹${money(needs)}`,
          `Wants (~20%): ₹${money(wants)}`,
          `Invest (~20%): ₹${money(invest)} (EPF/SIP/etc.)`,
          `Flex / debt accel: ₹${money(buffer)}`,
          `90-day focus: ${goal}`,
          "Verify taxes, EMIs, and goals with real statements",
        ],
        { primary: invest },
      );
    }
    case "aigen-goal-to-roadmap-generator":
      return draftOk([
        `Roadmap — ${goal}`,
        `Context: ${topic} · Horizon: ${days} days · Level: ${level}`,
        "Week 1: Define success metric + constraints",
        "Phase A: Foundations (skills, tools, inputs)",
        "Phase B: Build the smallest shippable slice",
        "Phase C: Feedback loops + iteration",
        "Phase D: Scale or systematize",
        "Weekly review: keep / kill / change",
      ]);
    case "aigen-resume-to-improvement-plan-generator": {
      const score = Math.min(100, Math.max(0, rate));
      return draftOk(
        [
          `Resume improvement plan — ${topic}`,
          `Current heuristic score: ${score}/100`,
          "Pass 1: Target role keywords in top third",
          "Pass 2: Rewrite bullets as verb + scope + metric",
          "Pass 3: Cut older / irrelevant items",
          "Pass 4: Peer review + ATS plain-text check",
          `Align narrative to: ${goal}`,
          `Complete within ~${days} days`,
        ],
        { score, primary: score },
      );
    }
    case "aigen-expenses-to-savings-strategy-generator": {
      const expenses = amount;
      const income = Math.max(expenses, amount2);
      const surplus = income - expenses;
      const cut = Math.round(expenses * 0.08);
      return draftOk(
        [
          `Savings strategy from expenses — ${topic}`,
          `Expenses ₹${money(expenses)} · Income ₹${money(income)} · Surplus ₹${money(surplus)}`,
          `Quick win: trim ~₹${money(cut)} (~8%) from lowest-joy spends`,
          "Automate savings on payday before discretionary spend",
          "Debt: pay minimums + avalanche extras if rates are high",
          `Goal bucket: ${goal}`,
          `Review cadence: every ${Math.min(30, days)} days`,
        ],
        { primary: surplus },
      );
    }
    case "aigen-marks-to-study-strategy-generator": {
      const marks = Math.min(100, Math.max(0, rate));
      const target = Math.min(100, Math.max(marks + 5, numOr(input.amount, 80)));
      return draftOk(
        [
          `Study strategy from marks — ${topic}`,
          `Current marks proxy: ${marks}% · Target: ${target}%`,
          "Diagnose: list chapters by score contribution",
          "Daily: weak chapter drill + one strong chapter polish",
          "Weekly: timed mock + error log",
          `Level lane: ${level} · Horizon: ${days} days`,
          `Motivation goal: ${goal}`,
        ],
        { score: marks, primary: target },
      );
    }
    default:
      return { ok: false, error: "Unknown advanced generator." };
  }
}
