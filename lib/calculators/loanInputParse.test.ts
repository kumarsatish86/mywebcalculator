import { describe, expect, it } from "vitest";
import {
  parseAprPercent,
  parseFiniteNumber,
  parseNonNegative,
  parsePositive,
  parseTermToMonths,
  termMonthsHint,
} from "./loanInputParse";

describe("parseFiniteNumber", () => {
  it("rejects empty string", () => {
    const r = parseFiniteNumber("", "Amount");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("required");
  });

  it("rejects non-numeric", () => {
    const r = parseFiniteNumber("abc", "Amount");
    expect(r.ok).toBe(false);
  });

  it("accepts valid number", () => {
    const r = parseFiniteNumber(" 12.5 ", "Amount");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(12.5);
  });
});

describe("parsePositive", () => {
  it("rejects zero and negative", () => {
    expect(parsePositive("0", "P").ok).toBe(false);
    expect(parsePositive("-1", "P").ok).toBe(false);
  });
});

describe("parseNonNegative", () => {
  it("rejects negative", () => {
    expect(parseNonNegative("-0.01", "X").ok).toBe(false);
  });

  it("allows zero", () => {
    const r = parseNonNegative("0", "X");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(0);
  });
});

describe("parseAprPercent", () => {
  it("allows zero", () => {
    const r = parseAprPercent("0", "APR");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(0);
  });

  it("rejects negative APR", () => {
    const r = parseAprPercent("-1", "APR");
    expect(r.ok).toBe(false);
  });

  it("rejects unrealistically high APR", () => {
    const r = parseAprPercent("201", "APR");
    expect(r.ok).toBe(false);
  });
});

describe("parseTermToMonths", () => {
  it("converts years with round to months", () => {
    const r = parseTermToMonths("5", "years", "Term");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(60);
  });

  it("uses months mode exactly", () => {
    const r = parseTermToMonths("63", "months", "Term");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(63);
  });

  it("rejects zero months after year conversion", () => {
    const r = parseTermToMonths("0.01", "years", "Term");
    expect(r.ok).toBe(false);
  });

  it("rejects term over 600 months", () => {
    const r = parseTermToMonths("601", "months", "Term");
    expect(r.ok).toBe(false);
  });
});

describe("termMonthsHint", () => {
  it("returns null for invalid term", () => {
    expect(termMonthsHint("years", "")).toBeNull();
  });

  it("hints year conversion", () => {
    const h = termMonthsHint("years", "5");
    expect(h).toContain("60");
  });
});
