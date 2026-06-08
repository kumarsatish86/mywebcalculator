"use client";

import { EmiCalculatorUniversal } from "@/components/calculators/LoanCoreCalculators";

/** Product-specific EMI page — same reducing-balance engine as universal EMI. */
export function LoanTypeCalculatorHost() {
  return <EmiCalculatorUniversal />;
}
