export type LoanCurrencyCode = "INR" | "USD" | "EUR" | "GBP";

const LOCALE_BY_CURRENCY: Record<LoanCurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

export function loanCurrencyLocale(code: LoanCurrencyCode): string {
  return LOCALE_BY_CURRENCY[code];
}

export function formatLoanMoney(amount: number, currency: LoanCurrencyCode): string {
  return amount.toLocaleString(loanCurrencyLocale(currency), {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

/** Short axis tick label (e.g. ₹25L, $25k). */
export function formatLoanAxisTick(amount: number, currency: LoanCurrencyCode): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";
  if (currency === "INR") {
    if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(1)}L`;
    if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(0)}k`;
    return `₹${Math.round(abs)}`;
  }
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(0)}k`;
  return `${sym}${Math.round(abs)}`;
}

export function formatLoanMoneyPlain(amount: number, currency: LoanCurrencyCode): string {
  return amount.toLocaleString(loanCurrencyLocale(currency), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
