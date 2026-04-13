"use client";

import { createContext, useContext, type ReactNode } from "react";

const LoanInitialInputsContext = createContext<Record<string, string>>({});

export function LoanInitialInputsProvider({
  value,
  children,
}: {
  value: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <LoanInitialInputsContext.Provider value={value}>{children}</LoanInitialInputsContext.Provider>
  );
}

export function useLoanInitialInput(key: string, defaultValue: string): string {
  const map = useContext(LoanInitialInputsContext);
  const v = map[key];
  return v != null && v !== "" ? v : defaultValue;
}
