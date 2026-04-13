import type { AmortizationRow } from "./loanPayment";

export function amortizationRowsToCsv(rows: AmortizationRow[]): string {
  const header = "Month,Payment,Principal,Interest,Balance";
  const lines = rows.map(
    (r) =>
      `${r.month},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)}`,
  );
  return [header, ...lines].join("\n");
}

export function buildLoanCsvMetadata(meta: {
  principal: number;
  aprPercent: number;
  termMonths: number;
  currency: string;
  extraPrincipalMonthly?: number;
  stepUpPercentPerYear?: number;
  /** When true, schedule rows used bank-style cent rounding. */
  bankPennyRounding?: boolean;
}): string {
  const lines = [
    "# Loan calculation metadata",
    `# Exported at: ${new Date().toISOString()}`,
    `# Principal: ${meta.principal.toFixed(2)} ${meta.currency}`,
    `# APR (%): ${meta.aprPercent}`,
    `# Term (months): ${meta.termMonths}`,
    `# Extra principal / month: ${(meta.extraPrincipalMonthly ?? 0).toFixed(2)} ${meta.currency}`,
    `# EMI step-up % / year: ${meta.stepUpPercentPerYear ?? 0}`,
    `# Bank-style penny rounding: ${meta.bankPennyRounding ? "yes" : "no"}`,
    "",
  ];
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
