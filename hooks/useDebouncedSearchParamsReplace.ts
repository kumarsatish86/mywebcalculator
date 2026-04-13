"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const DEFAULT_MS = 480;

/**
 * Debounced `router.replace` with a built query string. Skips the first effect run
 * so the server-hydrated URL is not immediately rewritten.
 */
export function useDebouncedSearchParamsReplace(
  buildParams: () => Record<string, string | undefined>,
  deps: unknown[],
  debounceMs: number = DEFAULT_MS,
) {
  const pathname = usePathname();
  const router = useRouter();
  const buildRef = useRef(buildParams);
  buildRef.current = buildParams;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      const o = buildRef.current();
      const u = new URLSearchParams();
      for (const [k, v] of Object.entries(o)) {
        if (v != null && v !== "") u.set(k, v);
      }
      const qs = u.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, debounceMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps list is caller-controlled field values
  }, deps);
}
