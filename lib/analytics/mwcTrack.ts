declare global {
  interface Window {
    __mwcTrack?: (event: string, payload?: Record<string, unknown>) => void;
  }
}

/**
 * Fire optional analytics: custom `window.__mwcTrack` hook and `gtag` when present.
 * Safe on SSR and when neither is defined.
 */
export function mwcTrack(event: string, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.__mwcTrack?.(event, payload);
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", event, payload);
  } catch {
    /* ignore */
  }
}
