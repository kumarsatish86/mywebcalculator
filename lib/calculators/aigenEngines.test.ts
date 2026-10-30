import { describe, expect, it } from "vitest";
import { computeAigenContent, AIGEN_CONTENT_SLUGS } from "./aigenContent";
import { computeAigenFinance, AIGEN_FINANCE_SLUGS } from "./aigenFinance";
import { computeAigenEducation, AIGEN_EDUCATION_SLUGS } from "./aigenEducation";
import { computeAigenHealth, AIGEN_HEALTH_SLUGS } from "./aigenHealth";
import { computeAigenBusiness, AIGEN_BUSINESS_SLUGS } from "./aigenBusiness";
import { computeAigenMarketing, AIGEN_MARKETING_SLUGS } from "./aigenMarketing";
import { computeAigenDeveloper, AIGEN_DEVELOPER_SLUGS } from "./aigenDeveloper";
import { computeAigenCreative, AIGEN_CREATIVE_SLUGS } from "./aigenCreative";
import { computeAigenTravel, AIGEN_TRAVEL_SLUGS } from "./aigenTravel";
import { computeAigenPersonal, AIGEN_PERSONAL_SLUGS } from "./aigenPersonal";
import { computeAigenSmart, AIGEN_SMART_SLUGS } from "./aigenSmart";
import { computeAigenAdvanced, AIGEN_ADVANCED_SLUGS } from "./aigenAdvanced";

const SAMPLE = {
  topic: "sample topic",
  tone: "professional",
  audience: "general",
  days: 14,
  budget: 50000,
  amount: 60000,
  amount2: 40000,
  rate: 10,
  count: 5,
  length: 16,
  weight: 70,
  hours: 8,
  seed: "test-seed",
  notes: "Sam",
  style: "balanced",
  level: "intermediate",
  goal: "make progress",
};

describe("aigen engines smoke", () => {
  it("covers every slug (105)", () => {
    const counts = [
      AIGEN_CONTENT_SLUGS.length,
      AIGEN_FINANCE_SLUGS.length,
      AIGEN_EDUCATION_SLUGS.length,
      AIGEN_HEALTH_SLUGS.length,
      AIGEN_BUSINESS_SLUGS.length,
      AIGEN_MARKETING_SLUGS.length,
      AIGEN_DEVELOPER_SLUGS.length,
      AIGEN_CREATIVE_SLUGS.length,
      AIGEN_TRAVEL_SLUGS.length,
      AIGEN_PERSONAL_SLUGS.length,
      AIGEN_SMART_SLUGS.length,
      AIGEN_ADVANCED_SLUGS.length,
    ];
    expect(counts.reduce((a, b) => a + b, 0)).toBe(105);
    expect(counts).toEqual([23, 9, 10, 11, 9, 7, 8, 6, 4, 6, 7, 5]);

    for (const slug of AIGEN_CONTENT_SLUGS) {
      expect(computeAigenContent(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_FINANCE_SLUGS) {
      expect(computeAigenFinance(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_EDUCATION_SLUGS) {
      expect(computeAigenEducation(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_HEALTH_SLUGS) {
      expect(computeAigenHealth(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_BUSINESS_SLUGS) {
      expect(computeAigenBusiness(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_MARKETING_SLUGS) {
      expect(computeAigenMarketing(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_DEVELOPER_SLUGS) {
      expect(computeAigenDeveloper(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_CREATIVE_SLUGS) {
      expect(computeAigenCreative(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_TRAVEL_SLUGS) {
      expect(computeAigenTravel(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_PERSONAL_SLUGS) {
      expect(computeAigenPersonal(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_SMART_SLUGS) {
      expect(computeAigenSmart(slug, SAMPLE).ok, slug).toBe(true);
    }
    for (const slug of AIGEN_ADVANCED_SLUGS) {
      expect(computeAigenAdvanced(slug, SAMPLE).ok, slug).toBe(true);
    }
  });

  it("password generator is deterministic for same seed", () => {
    const a = computeAigenDeveloper("aigen-password-generator", { seed: "abc", length: 16 });
    const b = computeAigenDeveloper("aigen-password-generator", { seed: "abc", length: 16 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok) {
      expect(a.draft).toBe(b.draft);
      expect(a.draft).toContain("abc");
    }
  });

  it("EMI breakdown returns a positive primary", () => {
    const r = computeAigenFinance("aigen-emi-breakdown-generator", {
      topic: "loan",
      amount: 100000,
      rate: 12,
      days: 12,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.primary).toBeGreaterThan(0);
      expect(r.draft.length).toBeGreaterThan(20);
    }
  });

  it("resume score returns a score", () => {
    const r = computeAigenSmart("aigen-ai-resume-score-calculator", {
      topic: "pm",
      rate: 80,
      amount: 70,
      goal: "interviews",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.score).toBe(Math.round(80 * 0.55 + 70 * 0.45));
    }
  });

  it("paragraph draft mentions topic", () => {
    const r = computeAigenContent("aigen-paragraph-generator", {
      topic: "coral reefs",
      tone: "curious",
      audience: "kids",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.draft.toLowerCase()).toContain("coral reefs");
  });
});
