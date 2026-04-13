import type { LoanCurrencyCode } from "./loanFormat";
import type { TermMode } from "./loanInputParse";

/** Short query keys for shareable loan calculator URLs. */
export const LOAN_URL = {
  P: "p",
  A: "a",
  T: "t",
  X: "x",
  U: "u",
  E: "e",
  F: "f",
  R: "r",
  CUR: "cur",
  TM: "tm",
  BR: "br",
} as const;

const CURRENCIES = new Set<string>(["INR", "USD", "EUR", "GBP"]);

export function parseLoanSearchParamsToRecord(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  const keys = [LOAN_URL.P, LOAN_URL.A, LOAN_URL.T, LOAN_URL.X, LOAN_URL.U, LOAN_URL.E, LOAN_URL.F, LOAN_URL.R, LOAN_URL.CUR, LOAN_URL.TM, LOAN_URL.BR];
  for (const k of keys) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function parseLoanCurrencyFromUrl(v: string | undefined): LoanCurrencyCode | undefined {
  if (v && CURRENCIES.has(v)) return v as LoanCurrencyCode;
  return undefined;
}

export function parseTermModeFromUrl(v: string | undefined): TermMode | undefined {
  if (v === "months" || v === "years") return v;
  return undefined;
}

export type UrlLoanPrefs = {
  currency?: LoanCurrencyCode;
  termMode?: TermMode;
  bankPennyRounding?: boolean;
};

export function urlPrefsFromLoanQuery(q: Record<string, string>): UrlLoanPrefs {
  const out: UrlLoanPrefs = {};
  const cur = parseLoanCurrencyFromUrl(q[LOAN_URL.CUR]);
  if (cur) out.currency = cur;
  const tm = parseTermModeFromUrl(q[LOAN_URL.TM]);
  if (tm) out.termMode = tm;
  if (q[LOAN_URL.BR] === "1") out.bankPennyRounding = true;
  else if (q[LOAN_URL.BR] === "0") out.bankPennyRounding = false;
  return out;
}

export function searchParamsStringFromRecord(rec: Record<string, string | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(rec)) {
    if (v != null && v !== "") u.set(k, v);
  }
  return u.toString();
}
