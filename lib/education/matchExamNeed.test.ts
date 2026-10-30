import { describe, expect, it } from "vitest";
import { matchExamNeed, suggestionsForProblem } from "./matchExamNeed";

describe("matchExamNeed", () => {
  it("recommends timing tools for finishing only part of the paper", () => {
    const hits = matchExamNeed("I finish only 70% paper");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.slug.includes("time") || h.slug.includes("speed") || h.slug.includes("attempt"))).toBe(
      true,
    );
  });

  it("recommends negative marking tools", () => {
    const hits = matchExamNeed("I get negative marking");
    expect(hits.some((h) => h.slug === "negative-marking-calculator")).toBe(true);
  });

  it("returns problem chip suggestions", () => {
    const hits = suggestionsForProblem("panic");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]!.problemId).toBe("panic");
  });
});
