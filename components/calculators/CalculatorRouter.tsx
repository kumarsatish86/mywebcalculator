"use client";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { BasicMathInitialProvider } from "@/components/calculators/BasicMathInitialContext";
import { LoanCalcPrefsProvider } from "@/components/calculators/LoanCalcPrefsContext";
import { LoanInitialInputsProvider } from "@/components/calculators/LoanInitialInputsContext";
import {
  AverageCalculator,
  BasicCalculatorAddSubtractMultiplyDivide,
  DifferenceCalculator,
  MeanCalculator,
  MedianCalculator,
  ModeCalculator,
  OrderOfOperationsPemdasCalculator,
  PercentageCalculator,
  PercentageIncreaseDecreaseCalculator,
  ProportionCalculator,
  RatioCalculator,
  RoundingCalculator,
  ScientificCalculator,
  SumCalculator,
} from "./BasicMathCalculators";
import { CatAgeCalculator } from "./CatAgeCalculator";
import { CompoundInterestCalculator } from "./CompoundInterestCalculator";
import { DaysBetweenCalculator } from "./DaysBetweenCalculator";
import { ExamGradeCalculator } from "./ExamGradeCalculator";
import { GradeNeededCalculator } from "./GradeNeededCalculator";
import {
  EmiCalculatorUniversal,
  FlatVsReducingInterestCalculator,
  InterestRateCalculator,
  LoanAmortizationCalculator,
  LoanAmountCalculator,
  LoanEmiCalculator,
  LoanTenureCalculator,
  ReducingBalanceEmiCalculator,
  TotalInterestPayableCalculator,
} from "./LoanCoreCalculators";
import { LoanPaymentCalculator } from "./LoanPaymentCalculator";
import { TipSplitterCalculator } from "./TipSplitterCalculator";
import { WeightedGpaCalculator } from "./WeightedGpaCalculator";
import { BASIC_MATH_SLUGS } from "@/lib/calculators/basicMathSlugs";
import { parseLoanSearchParamsToRecord, urlPrefsFromLoanQuery } from "@/lib/calculators/loanUrlParams";
import { FAMILY_SLUG_SETS } from "@/lib/registry";
import { BodyMetricsCalculatorHost } from "./family/BodyMetricsCalculatorHost";
import { CreditDebtCalculatorHost } from "./family/CreditDebtCalculatorHost";
import { EduMathCalculatorHost } from "./family/EduMathCalculatorHost";
import { ElectricalCalculatorHost } from "./family/ElectricalCalculatorHost";
import { LoanAdvancedPaymentCalculatorHost } from "./family/LoanAdvancedPaymentCalculatorHost";
import { LoanComparisonCalculatorHost } from "./family/LoanComparisonCalculatorHost";
import { LoanTypeCalculatorHost } from "./family/LoanTypeCalculatorHost";

const MAP: Record<string, ComponentType> = {
  "weighted-gpa": WeightedGpaCalculator,
  "grade-needed": GradeNeededCalculator,
  "exam-grade": ExamGradeCalculator,
  "loan-payment": LoanPaymentCalculator,
  "emi-calculator-universal": EmiCalculatorUniversal,
  "loan-emi-calculator": LoanEmiCalculator,
  "interest-rate-calculator": InterestRateCalculator,
  "loan-amount-calculator": LoanAmountCalculator,
  "loan-tenure-calculator": LoanTenureCalculator,
  "total-interest-payable-calculator": TotalInterestPayableCalculator,
  "loan-amortization-calculator": LoanAmortizationCalculator,
  "reducing-balance-emi-calculator": ReducingBalanceEmiCalculator,
  "flat-vs-reducing-interest-calculator": FlatVsReducingInterestCalculator,
  "compound-interest": CompoundInterestCalculator,
  "tip-splitter": TipSplitterCalculator,
  "days-between": DaysBetweenCalculator,
  "cat-age": CatAgeCalculator,
  "basic-calculator-add-subtract-multiply-divide": BasicCalculatorAddSubtractMultiplyDivide,
  "percentage-calculator": PercentageCalculator,
  "percentage-increase-decrease-calculator": PercentageIncreaseDecreaseCalculator,
  "ratio-calculator": RatioCalculator,
  "proportion-calculator": ProportionCalculator,
  "average-calculator": AverageCalculator,
  "mean-calculator": MeanCalculator,
  "median-calculator": MedianCalculator,
  "mode-calculator": ModeCalculator,
  "sum-calculator": SumCalculator,
  "difference-calculator": DifferenceCalculator,
  "rounding-calculator": RoundingCalculator,
  "scientific-calculator": ScientificCalculator,
  "order-of-operations-pemdas-calculator": OrderOfOperationsPemdasCalculator,
};

export const LOAN_CALCULATOR_SLUGS = new Set([
  "loan-payment",
  "emi-calculator-universal",
  "loan-emi-calculator",
  "interest-rate-calculator",
  "loan-amount-calculator",
  "loan-tenure-calculator",
  "total-interest-payable-calculator",
  "loan-amortization-calculator",
  "reducing-balance-emi-calculator",
  "flat-vs-reducing-interest-calculator",
  ...FAMILY_SLUG_SETS.financeLoanType,
  ...FAMILY_SLUG_SETS.financeAdvancedPayment,
  ...FAMILY_SLUG_SETS.financeLoanComparison,
  ...FAMILY_SLUG_SETS.financeCreditDebt,
]);

export { BASIC_MATH_SLUGS };

type Props = {
  slug: string;
  /** Raw Next.js searchParams (loan fields, prefs, basic-math `ms`, etc.). */
  initialSearchParams?: Record<string, string | string[] | undefined>;
};

export function CalculatorRouter({ slug, initialSearchParams }: Props) {
  if (FAMILY_SLUG_SETS.electrical.has(slug)) {
    return <ElectricalCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.healthBody.has(slug)) {
    return <BodyMetricsCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.educationMathPlanned.has(slug)) {
    return <EduMathCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.financeLoanType.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanTypeCalculatorHost />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeAdvancedPayment.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanAdvancedPaymentCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeLoanComparison.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanComparisonCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCreditDebt.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <CreditDebtCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }

  const C = MAP[slug];
  if (!C) notFound();
  if (LOAN_CALCULATOR_SLUGS.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <C />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (BASIC_MATH_SLUGS.has(slug)) {
    return (
      <BasicMathInitialProvider slug={slug} searchParams={initialSearchParams}>
        <C />
      </BasicMathInitialProvider>
    );
  }
  return <C />;
}
