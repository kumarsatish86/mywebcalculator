import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualFromMonthly, monthlyFromAnnual, netFromGross } from "./salaryCore";

export type IntlCountry = "usa" | "uk" | "canada" | "australia" | "uae";

export const INTL_SALARY_URL = {
  A: "a",
  T: "t",
  D: "d",
  M: "m",
  P: "p",
  C: "c",
  X: "x",
  MD: "md",
} as const;

export type CountryProfile = {
  currency: LoanCurrencyCode;
  label: string;
  defaultTaxPercent: number;
  defaultDeductionPercent: number;
  planningColIndex: number;
};

export const COUNTRY_PROFILES: Record<IntlCountry, CountryProfile> = {
  usa: {
    currency: "USD",
    label: "United States",
    defaultTaxPercent: 22,
    defaultDeductionPercent: 7.65,
    planningColIndex: 100,
  },
  uk: {
    currency: "GBP",
    label: "United Kingdom",
    defaultTaxPercent: 20,
    defaultDeductionPercent: 12,
    planningColIndex: 95,
  },
  canada: {
    currency: "CAD",
    label: "Canada",
    defaultTaxPercent: 25,
    defaultDeductionPercent: 7,
    planningColIndex: 90,
  },
  australia: {
    currency: "AUD",
    label: "Australia",
    defaultTaxPercent: 30,
    defaultDeductionPercent: 5,
    planningColIndex: 88,
  },
  uae: {
    currency: "AED",
    label: "United Arab Emirates",
    defaultTaxPercent: 0,
    defaultDeductionPercent: 0,
    planningColIndex: 75,
  },
};

export const INTL_COUNTRY_OPTIONS: { id: IntlCountry; label: string }[] = (
  Object.entries(COUNTRY_PROFILES) as [IntlCountry, CountryProfile][]
).map(([id, p]) => ({ id, label: p.label }));

export function countryFromSlug(slug: string): IntlCountry | null {
  const map: Record<string, IntlCountry> = {
    "salary-calculator-usa": "usa",
    "salary-calculator-uk": "uk",
    "salary-calculator-canada": "canada",
    "salary-calculator-australia": "australia",
    "salary-calculator-uae": "uae",
  };
  return map[slug] ?? null;
}

export function formatIntlMoney(amount: number, currency: LoanCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseIntlSalarySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(INTL_SALARY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function countrySalary(params: {
  grossMonthly: number;
  taxPercent: number;
  deductionPercent: number;
  country: IntlCountry;
}): {
  country: IntlCountry;
  currency: LoanCurrencyCode;
  grossMonthly: number;
  grossAnnual: number;
  taxAmount: number;
  deductionAmount: number;
  netMonthly: number;
  netAnnual: number;
} {
  const profile = COUNTRY_PROFILES[params.country];
  const breakdown = netFromGross({
    gross: params.grossMonthly,
    taxPercent: params.taxPercent,
    deductionPercent: params.deductionPercent,
  });
  return {
    country: params.country,
    currency: profile.currency,
    grossMonthly: breakdown.gross,
    grossAnnual: breakdown.gross * 12,
    taxAmount: breakdown.taxAmount,
    deductionAmount: breakdown.deductionAmount,
    netMonthly: breakdown.net,
    netAnnual: breakdown.annualNet,
  };
}

export function salaryAfterTaxCountry(params: {
  grossMonthly: number;
  country: IntlCountry;
  taxPercent?: number;
  deductionPercent?: number;
}): ReturnType<typeof countrySalary> {
  const profile = COUNTRY_PROFILES[params.country];
  return countrySalary({
    grossMonthly: params.grossMonthly,
    country: params.country,
    taxPercent: params.taxPercent ?? profile.defaultTaxPercent,
    deductionPercent: params.deductionPercent ?? profile.defaultDeductionPercent,
  });
}

export function costOfLivingAdjustedSalary(params: {
  salary: number;
  fromColIndex: number;
  toColIndex: number;
}): {
  salary: number;
  fromColIndex: number;
  toColIndex: number;
  adjustedSalary: number;
  difference: number;
  percentChange: number;
} | { error: string } {
  if (params.fromColIndex <= 0 || params.toColIndex <= 0) {
    return { error: "Cost-of-living indices must be positive." };
  }
  const adjustedSalary = params.salary * (params.toColIndex / params.fromColIndex);
  const difference = adjustedSalary - params.salary;
  const percentChange = params.salary > 0 ? (difference / params.salary) * 100 : 0;
  return {
    salary: params.salary,
    fromColIndex: params.fromColIndex,
    toColIndex: params.toColIndex,
    adjustedSalary,
    difference,
    percentChange,
  };
}

export { annualFromMonthly, monthlyFromAnnual };
