import { describe, expect, it } from "vitest";
import {
  BASIC_MATH_SHARE_MAX_LEN,
  decodeBasicMathShareState,
  encodeBasicMathShareState,
} from "./basicMathShareState";

describe("basicMathShareState", () => {
  it("round-trips slug and fields", () => {
    const slug = "percentage-calculator";
    const fields = { mode: "of", p: "15", w: "80" };
    const ms = encodeBasicMathShareState(slug, fields);
    expect(ms).toBeTruthy();
    const d = decodeBasicMathShareState(ms!);
    expect(d).toEqual({ v: 1, slug, fields });
  });

  it("returns null for invalid payload", () => {
    expect(decodeBasicMathShareState(undefined)).toBeNull();
    expect(decodeBasicMathShareState("not-valid")).toBeNull();
  });

  it("returns null when encoding exceeds max length", () => {
    const huge = "x".repeat(BASIC_MATH_SHARE_MAX_LEN * 2);
    const ms = encodeBasicMathShareState("sum-calculator", { raw: huge });
    expect(ms).toBeNull();
  });
});
