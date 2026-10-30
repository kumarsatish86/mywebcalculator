/** Affordability heuristics for loan payment smart results (teaching only). */

export type AffordabilityInput = {
  payment: number;
  totalPaid: number;
  totalInterest: number;
  principal: number;
  termMonths: number;
  /** Optional monthly income for DTI-style ratio */
  monthlyIncome?: number;
};

export type AffordabilityInsight = {
  statusLabel: string;
  statusTone: "good" | "warn" | "bad" | "neutral";
  risk: "LOW" | "MEDIUM" | "HIGH";
  incomeUsedPct?: number;
  savingsAfterEmi?: number;
  suggestions: string[];
  kpis: { label: string; value: string; hint?: string }[];
};

function fmt(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.length === 3 ? currency : "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return n.toFixed(0);
  }
}

export function computeAffordability(
  input: AffordabilityInput,
  currency: string,
): AffordabilityInsight {
  const { payment, totalPaid, totalInterest, principal, termMonths, monthlyIncome } = input;
  const interestShare = principal > 0 ? (totalInterest / principal) * 100 : 0;
  const suggestions: string[] = [];

  let incomeUsedPct: number | undefined;
  let savingsAfterEmi: number | undefined;
  let statusLabel = "Estimate";
  let statusTone: AffordabilityInsight["statusTone"] = "neutral";
  let risk: AffordabilityInsight["risk"] = "MEDIUM";

  if (monthlyIncome && monthlyIncome > 0) {
    incomeUsedPct = (payment / monthlyIncome) * 100;
    savingsAfterEmi = monthlyIncome - payment;
    if (incomeUsedPct <= 30) {
      statusLabel = "Affordable";
      statusTone = "good";
      risk = "LOW";
    } else if (incomeUsedPct <= 45) {
      statusLabel = "Stretch";
      statusTone = "warn";
      risk = "MEDIUM";
      suggestions.push("Keep EMI under ~40% of take-home if possible");
    } else {
      statusLabel = "High burden";
      statusTone = "bad";
      risk = "HIGH";
      suggestions.push("Lower principal or extend term carefully—or raise down payment");
    }
    if (savingsAfterEmi < monthlyIncome * 0.2) {
      suggestions.push("Leave a buffer for emergencies after EMI");
    }
  } else {
    suggestions.push("Add monthly income to see affordability and risk");
  }

  if (termMonths > 240) {
    suggestions.push("Longer tenures lower EMI but raise total interest");
  } else if (termMonths <= 180 && interestShare > 40) {
    suggestions.push("Try a slightly longer tenure or larger down payment to cut EMI stress");
  }

  if (interestShare > 50) {
    suggestions.push(`Interest is ~${interestShare.toFixed(0)}% of principal—compare a shorter tenure`);
  } else {
    suggestions.push("Compare a 15-year vs longer tenure to see interest savings");
  }

  const kpis = [
    { label: "Total cost", value: fmt(totalPaid, currency) },
    { label: "Interest paid", value: fmt(totalInterest, currency) },
    ...(incomeUsedPct !== undefined
      ? [{ label: "Income used", value: `${incomeUsedPct.toFixed(0)}%`, hint: "EMI ÷ monthly income" }]
      : []),
    ...(savingsAfterEmi !== undefined
      ? [{ label: "Left after EMI", value: fmt(savingsAfterEmi, currency) }]
      : []),
  ];

  return {
    statusLabel,
    statusTone,
    risk,
    incomeUsedPct,
    savingsAfterEmi,
    suggestions: [...new Set(suggestions)].slice(0, 4),
    kpis,
  };
}
