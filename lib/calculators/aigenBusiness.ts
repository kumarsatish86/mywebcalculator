/** Business & productivity template generators — in-browser drafts. */
import { draftOk, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenBusinessSlug =
  | "aigen-business-plan-generator"
  | "aigen-startup-idea-generator"
  | "aigen-pitch-deck-content-generator"
  | "aigen-swot-analysis-generator"
  | "aigen-daily-planner-generator"
  | "aigen-weekly-planner-generator"
  | "aigen-goal-breakdown-generator"
  | "aigen-habit-tracker-generator"
  | "aigen-to-do-list-generator";

export const AIGEN_BUSINESS_SLUGS: AigenBusinessSlug[] = [
  "aigen-business-plan-generator",
  "aigen-startup-idea-generator",
  "aigen-pitch-deck-content-generator",
  "aigen-swot-analysis-generator",
  "aigen-daily-planner-generator",
  "aigen-weekly-planner-generator",
  "aigen-goal-breakdown-generator",
  "aigen-habit-tracker-generator",
  "aigen-to-do-list-generator",
];

export function computeAigenBusiness(slug: AigenBusinessSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your venture");
  const audience = str(input.audience, "customers");
  const goal = str(input.goal, "ship a useful MVP");
  const days = Math.max(1, Math.round(numOr(input.days, 7)));
  const budget = numOr(input.budget, 100000);

  switch (slug) {
    case "aigen-business-plan-generator":
      return draftOk([
        `Business plan shell — ${topic}`,
        `Customer: ${audience} · Starter budget sketch: ₹${budget.toLocaleString("en-IN")}`,
        "1. Problem & who feels it",
        "2. Solution / offer",
        "3. Market & positioning",
        "4. Go-to-market (channels)",
        "5. Unit economics sketch",
        "6. 90-day milestones",
        `Near-term goal: ${goal}`,
      ]);
    case "aigen-startup-idea-generator":
      return draftOk([
        `Startup idea sparks — ${topic}`,
        `Idea A: Tool that helps ${audience} do ${topic} faster`,
        `Idea B: Marketplace connecting two sides around ${topic}`,
        `Idea C: Content + community niche on ${topic}`,
        "Validation: 10 interviews this week",
        "Smoke test: landing page + waitlist",
        `Budget guardrail: ₹${budget.toLocaleString("en-IN")} experiment cap`,
      ]);
    case "aigen-pitch-deck-content-generator":
      return draftOk([
        `Pitch deck outline — ${topic}`,
        "Slide 1: Title + one-liner",
        "Slide 2: Problem",
        "Slide 3: Solution / demo",
        "Slide 4: Why now",
        "Slide 5: Market",
        "Slide 6: Traction / plan",
        "Slide 7: Business model",
        "Slide 8: Ask + use of funds",
      ]);
    case "aigen-swot-analysis-generator":
      return draftOk([
        `SWOT draft — ${topic}`,
        `Strengths: Unique angle for ${audience}; skills you already have`,
        "Weaknesses: Gaps in distribution, brand, or ops",
        "Opportunities: Trends, underserved niches, partnerships",
        "Threats: Competitors, regulation, cost inflation",
        "Next: pick 1 strength to amplify + 1 weakness to fix",
        `Goal alignment: ${goal}`,
      ]);
    case "aigen-daily-planner-generator":
      return draftOk([
        `Daily planner — ${topic}`,
        "MIT #1 (must happen)",
        "MIT #2",
        "MIT #3",
        "Deep work block (90m)",
        "Admin / messages batch",
        "Health: move + meal",
        "Shutdown: note tomorrow's MIT",
      ]);
    case "aigen-weekly-planner-generator":
      return draftOk([
        `Weekly planner — ${topic} (${days}-day lens)`,
        "Mon: Plan + hardest project work",
        "Tue–Wed: Build / execute",
        "Thu: Reviews, feedback, outreach",
        "Fri: Wrap + metrics",
        "Weekend: Light admin or rest",
        `Theme: ${goal}`,
      ]);
    case "aigen-goal-breakdown-generator":
      return draftOk([
        `Goal breakdown — ${goal}`,
        `Context: ${topic}`,
        "Outcome (measurable): define success metric",
        "Milestone 30 days",
        "Milestone 60 days",
        "Milestone 90 days",
        "Weekly actions (3)",
        "Risks + mitigation",
      ]);
    case "aigen-habit-tracker-generator":
      return draftOk([
        `Habit tracker — ${topic}`,
        "Habit 1: Deep work start ritual",
        "Habit 2: Daily outreach / learning",
        "Habit 3: Health baseline (sleep/move)",
        "Track: checkbox grid for 4 weeks",
        "Rule: never miss twice",
        `Tied to goal: ${goal}`,
      ]);
    case "aigen-to-do-list-generator":
      return draftOk([
        `To-do list — ${topic}`,
        `[ ] Clarify today's outcome for ${audience}`,
        "[ ] Do the highest-leverage task first",
        "[ ] One outreach / collaboration item",
        "[ ] One ops / admin item",
        "[ ] Review metrics / notes (15m)",
        `[ ] Prep tomorrow toward: ${goal}`,
      ]);
    default:
      return { ok: false, error: "Unknown business generator." };
  }
}
