import { describe, expect, it } from "vitest";
import { matchIntent } from "./matchIntent";

describe("matchIntent", () => {
  it("suggests home tools for buy-house query", () => {
    const r = matchIntent("I want to buy a 60 lakh house");
    expect(r.length).toBeGreaterThan(0);
    const slugs = r.map((x) => x.slug);
    expect(slugs.some((s) => s.includes("loan") || s.includes("emi") || s.includes("mortgage") || s.includes("down-payment"))).toBe(
      true,
    );
    expect(r.some((x) => x.journeyId === "buying-home")).toBe(true);
  });

  it("finds EMI tools", () => {
    const r = matchIntent("EMI");
    expect(r.some((x) => x.slug.includes("emi") || x.slug.includes("loan-payment"))).toBe(true);
  });

  it("finds BMI tools", () => {
    const r = matchIntent("BMI body mass");
    expect(r.some((x) => x.slug.includes("bmi"))).toBe(true);
  });

  it("returns empty for blank", () => {
    expect(matchIntent("   ")).toEqual([]);
  });
});
