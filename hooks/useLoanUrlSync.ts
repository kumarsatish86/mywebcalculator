"use client";

import { useDebouncedSearchParamsReplace } from "@/hooks/useDebouncedSearchParamsReplace";

/**
 * Debounced `router.replace` with query string when loan inputs change.
 * Skips the first run so server-hydrated URL is not immediately rewritten.
 */
export function useLoanUrlSync(buildParams: () => Record<string, string | undefined>, deps: unknown[]) {
  useDebouncedSearchParamsReplace(buildParams, deps);
}
