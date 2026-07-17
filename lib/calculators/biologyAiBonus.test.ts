import { describe, expect, it } from "vitest";
import { aiDietPlanner, aiFitnessPlanner, aiStudyAssistantBiology } from "./biologyAiBonus";

describe("biologyAiBonus", () => {
  it("builds a diet template", () => {
    const r = aiDietPlanner({ calories: 2000, style: "veg" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.plan.toLowerCase()).toMatch(/plant|legume|tofu/);
  });

  it("builds a fitness template", () => {
    const r = aiFitnessPlanner({ daysPerWeek: 3, goal: "strength" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.plan).toMatch(/strength/i);
  });

  it("gives study tips", () => {
    const r = aiStudyAssistantBiology({ topic: "genetics" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.advice).toMatch(/Punnett|HWE/i);
  });
});
