"use client";

import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import type { TermMode } from "@/lib/calculators/loanInputParse";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const KEY_CURRENCY = "mwc-loan-currency";
const KEY_TERM = "mwc-loan-term-mode";
const KEY_BANK_PENNY = "mwc-loan-bank-penny";

type LoanCalcPrefsContextValue = {
  currency: LoanCurrencyCode;
  setCurrency: (c: LoanCurrencyCode) => void;
  termMode: TermMode;
  setTermMode: (m: TermMode) => void;
  bankPennyRounding: boolean;
  setBankPennyRounding: (v: boolean) => void;
};

const LoanCalcPrefsContext = createContext<LoanCalcPrefsContextValue | null>(null);

function readStoredCurrency(): LoanCurrencyCode {
  if (typeof window === "undefined") return "INR";
  try {
    const v = sessionStorage.getItem(KEY_CURRENCY);
    if (v === "INR" || v === "USD" || v === "EUR" || v === "GBP") return v;
  } catch {
    /* ignore */
  }
  return "INR";
}

function readStoredTermMode(): TermMode {
  if (typeof window === "undefined") return "years";
  try {
    const v = sessionStorage.getItem(KEY_TERM);
    if (v === "months" || v === "years") return v;
  } catch {
    /* ignore */
  }
  return "years";
}

function readStoredBankPenny(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(KEY_BANK_PENNY) === "1";
  } catch {
    /* ignore */
  }
  return false;
}

export type LoanUrlPrefs = {
  currency?: LoanCurrencyCode;
  termMode?: TermMode;
  bankPennyRounding?: boolean;
};

export function LoanCalcPrefsProvider({
  children,
  urlPrefs,
}: {
  children: ReactNode;
  /** Applied once after reading sessionStorage so shared links can override stored prefs. */
  urlPrefs?: LoanUrlPrefs;
}) {
  const [currency, setCurrencyState] = useState<LoanCurrencyCode>("INR");
  const [termMode, setTermModeState] = useState<TermMode>("years");
  const [bankPennyRounding, setBankPennyRoundingState] = useState(false);

  useEffect(() => {
    let cur = readStoredCurrency();
    let tm = readStoredTermMode();
    let br = readStoredBankPenny();
    if (urlPrefs?.currency) {
      cur = urlPrefs.currency;
      try {
        sessionStorage.setItem(KEY_CURRENCY, cur);
      } catch {
        /* ignore */
      }
    }
    if (urlPrefs?.termMode) {
      tm = urlPrefs.termMode;
      try {
        sessionStorage.setItem(KEY_TERM, tm);
      } catch {
        /* ignore */
      }
    }
    if (urlPrefs?.bankPennyRounding === true) {
      br = true;
      try {
        sessionStorage.setItem(KEY_BANK_PENNY, "1");
      } catch {
        /* ignore */
      }
    } else if (urlPrefs?.bankPennyRounding === false) {
      br = false;
      try {
        sessionStorage.setItem(KEY_BANK_PENNY, "0");
      } catch {
        /* ignore */
      }
    }
    setCurrencyState(cur);
    setTermModeState(tm);
    setBankPennyRoundingState(br);
    // urlPrefs applied once on mount for shared calculator links
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrency = useCallback((c: LoanCurrencyCode) => {
    setCurrencyState(c);
    try {
      sessionStorage.setItem(KEY_CURRENCY, c);
    } catch {
      /* ignore */
    }
  }, []);

  const setTermMode = useCallback((m: TermMode) => {
    setTermModeState(m);
    try {
      sessionStorage.setItem(KEY_TERM, m);
    } catch {
      /* ignore */
    }
  }, []);

  const setBankPennyRounding = useCallback((v: boolean) => {
    setBankPennyRoundingState(v);
    try {
      sessionStorage.setItem(KEY_BANK_PENNY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      termMode,
      setTermMode,
      bankPennyRounding,
      setBankPennyRounding,
    }),
    [currency, setCurrency, termMode, setTermMode, bankPennyRounding, setBankPennyRounding],
  );

  return <LoanCalcPrefsContext.Provider value={value}>{children}</LoanCalcPrefsContext.Provider>;
}

export function useLoanCalcPrefs(): LoanCalcPrefsContextValue {
  const ctx = useContext(LoanCalcPrefsContext);
  if (!ctx) {
    throw new Error("useLoanCalcPrefs must be used within LoanCalcPrefsProvider");
  }
  return ctx;
}
