import { describe, expect, it } from "vitest";
import { cognitiveLoad, reactionTime, sleepCycle } from "./biologyNeuroscience";

describe("biologyNeuroscience", () => {
  it("averages reaction times", () => {
    const r = reactionTime({ samplesCsv: "200,300,250" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.meanMs).toBeCloseTo(250, 5);
  });

  it("scores cognitive load", () => {
    const r = cognitiveLoad({ tasks: 3, difficulty: 2, capacity: 6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.load).toBeCloseTo(1, 5);
  });

  it("suggests sleep-cycle wakes", () => {
    const r = sleepCycle({ bedtime: "23:00", cycles: 2 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.wakeTimes).toHaveLength(2);
  });
});
