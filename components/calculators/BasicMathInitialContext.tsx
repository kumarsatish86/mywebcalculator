"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { decodeBasicMathShareState, parseMsFromSearchParams } from "@/lib/calculators/basicMathShareState";

const BasicMathInitialContext = createContext<Record<string, string>>({});

export function BasicMathInitialProvider({
  children,
  slug,
  searchParams,
}: {
  children: ReactNode;
  slug: string;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const value = useMemo(() => {
    const ms = parseMsFromSearchParams(searchParams);
    const d = decodeBasicMathShareState(ms);
    if (!d || d.slug !== slug) return {};
    return d.fields;
  }, [slug, searchParams]);

  return <BasicMathInitialContext.Provider value={value}>{children}</BasicMathInitialContext.Provider>;
}

/** First render: use for useState initializer — value from share link if slug matches. */
export function useBasicMathInitialFields(): Record<string, string> {
  return useContext(BasicMathInitialContext);
}
