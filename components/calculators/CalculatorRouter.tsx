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
import { parseSalarySearchParams } from "@/lib/calculators/salaryCore";
import { parseIndiaSalarySearchParams } from "@/lib/calculators/salaryIndia";
import { parseAiFinanceSearchParams } from "@/lib/calculators/aiFinanceSmart";
import { parseAiEducationSearchParams } from "@/lib/calculators/aiEducationSmart";
import { parseAiHealthSearchParams } from "@/lib/calculators/aiHealthSmart";
import { parseAiDailyLifeSearchParams } from "@/lib/calculators/aiDailyLifeSmart";
import { parseAiBusinessSearchParams } from "@/lib/calculators/aiBusinessSmart";
import { parseAiDeveloperSearchParams } from "@/lib/calculators/aiDeveloperSmart";
import { parseAiConversionSearchParams } from "@/lib/calculators/aiConversionSmart";
import { parseAiPersonalizedSearchParams } from "@/lib/calculators/aiPersonalizedSmart";
import { parseTimeDateSearchParams } from "@/lib/calculators/timeDateParams";
import { FAMILY_SLUG_SETS } from "@/lib/registry";
import { BodyMetricsCalculatorHost } from "./family/BodyMetricsCalculatorHost";
import { CreditDebtCalculatorHost } from "./family/CreditDebtCalculatorHost";
import { EduMathCalculatorHost } from "./family/EduMathCalculatorHost";
import { ElectricalCalculatorHost } from "./family/ElectricalCalculatorHost";
import { LoanAdvancedPaymentCalculatorHost } from "./family/LoanAdvancedPaymentCalculatorHost";
import { LoanComparisonCalculatorHost } from "./family/LoanComparisonCalculatorHost";
import { LoanTypeCalculatorHost } from "./family/LoanTypeCalculatorHost";
import { PrepaymentForeclosureCalculatorHost } from "./family/PrepaymentForeclosureCalculatorHost";
import { EmiSchedulePlanningCalculatorHost } from "./family/EmiSchedulePlanningCalculatorHost";
import { RegionSpecificLoanCalculatorHost } from "./family/RegionSpecificLoanCalculatorHost";
import { SmartAiLoanCalculatorHost } from "./family/SmartAiLoanCalculatorHost";
import { LoanMicroToolsCalculatorHost } from "./family/LoanMicroToolsCalculatorHost";
import { CoreSalaryCalculatorHost } from "./family/CoreSalaryCalculatorHost";
import { IndiaSalaryCalculatorHost } from "./family/IndiaSalaryCalculatorHost";
import { AiFinanceSmartCalculatorHost } from "./family/AiFinanceSmartCalculatorHost";
import { AiEducationSmartCalculatorHost } from "./family/AiEducationSmartCalculatorHost";
import { AiHealthSmartCalculatorHost } from "./family/AiHealthSmartCalculatorHost";
import { AiDailyLifeSmartCalculatorHost } from "./family/AiDailyLifeSmartCalculatorHost";
import { AiBusinessSmartCalculatorHost } from "./family/AiBusinessSmartCalculatorHost";
import { AiDeveloperSmartCalculatorHost } from "./family/AiDeveloperSmartCalculatorHost";
import { AiConversionSmartCalculatorHost } from "./family/AiConversionSmartCalculatorHost";
import { AiPersonalizedSmartCalculatorHost } from "./family/AiPersonalizedSmartCalculatorHost";
import { TimeDateCalculatorHost } from "./family/TimeDateCalculatorHost";
import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import type { UrlLoanPrefs } from "@/lib/calculators/loanUrlParams";

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
  ...FAMILY_SLUG_SETS.financePrepaymentForeclosure,
  ...FAMILY_SLUG_SETS.financeEmiSchedulePlanning,
  ...FAMILY_SLUG_SETS.financeRegionSpecific,
  ...FAMILY_SLUG_SETS.financeSmartAiLoan,
  ...FAMILY_SLUG_SETS.financeLoanMicroTools,
]);

const REGION_DEFAULT_CURRENCY: Partial<Record<string, LoanCurrencyCode>> = {
  "home-loan-emi-calculator-india": "INR",
  "personal-loan-emi-calculator-india": "INR",
  "loan-calculator-usa": "USD",
  "mortgage-calculator-uk": "GBP",
  "gst-plus-loan-calculator-india": "INR",
};

function regionLoanUrlPrefs(slug: string, q: Record<string, string>): UrlLoanPrefs {
  const fromQuery = urlPrefsFromLoanQuery(q);
  const currency = fromQuery.currency ?? REGION_DEFAULT_CURRENCY[slug];
  return currency ? { ...fromQuery, currency } : fromQuery;
}

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
  if (FAMILY_SLUG_SETS.financePrepaymentForeclosure.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <PrepaymentForeclosureCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeEmiSchedulePlanning.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <EmiSchedulePlanningCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeRegionSpecific.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = regionLoanUrlPrefs(slug, q);
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={urlPrefs}>
          <RegionSpecificLoanCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeSmartAiLoan.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <SmartAiLoanCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeLoanMicroTools.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanMicroToolsCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCoreSalary.has(slug)) {
    const q = initialSearchParams ? parseSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CoreSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeIndiaSalary.has(slug)) {
    const q = initialSearchParams ? parseIndiaSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <IndiaSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiFinanceSmart.has(slug)) {
    const q = initialSearchParams ? parseAiFinanceSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiFinanceSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiEducationSmart.has(slug)) {
    const q = initialSearchParams ? parseAiEducationSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiEducationSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiHealthSmart.has(slug)) {
    const q = initialSearchParams ? parseAiHealthSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiHealthSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiDailyLifeSmart.has(slug)) {
    const q = initialSearchParams ? parseAiDailyLifeSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiDailyLifeSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiBusinessSmart.has(slug)) {
    const q = initialSearchParams ? parseAiBusinessSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiBusinessSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiDeveloperSmart.has(slug)) {
    const q = initialSearchParams ? parseAiDeveloperSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiDeveloperSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiConversionSmart.has(slug)) {
    const q = initialSearchParams ? parseAiConversionSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiConversionSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiPersonalizedSmart.has(slug)) {
    const q = initialSearchParams ? parseAiPersonalizedSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiPersonalizedSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.conversionTimeDateBasic.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateAdvanced.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateBusiness.has(slug) || FAMILY_SLUG_SETS.conversionTimeDatePersonal.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateSpecialized.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateFun.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateSmart.has(slug)) {
    const q = initialSearchParams ? parseTimeDateSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <TimeDateCalculatorHost slug={slug} />
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
