"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { mwcTrack } from "@/lib/analytics/mwcTrack";

export type MathShareSearchParamsResult = {
  params: Record<string, string | undefined>;
  /** True when encoded state was skipped (e.g. URL too long); link is still copied without `ms`. */
  sharePayloadOmitted?: boolean;
};

type Props = {
  analyticsId: string;
  onReset?: () => void;
  getSummary?: () => string;
  getShareSearchParams?: () => MathShareSearchParamsResult;
  onPrintSchedule?: () => void;
};

export function MathActionBar({
  analyticsId,
  onReset,
  getSummary,
  getShareSearchParams,
  onPrintSchedule,
}: Props) {
  const t = useTranslations("MathActionBar");
  const pathname = usePathname();
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const [linkFeedback, setLinkFeedback] = useState<"idle" | "copied" | "copied_omitted" | "failed">("idle");

  useEffect(() => {
    if (copyFeedback === "idle" && linkFeedback === "idle") return;
    const t = window.setTimeout(() => {
      setCopyFeedback("idle");
      setLinkFeedback("idle");
    }, copyFeedback === "failed" || linkFeedback === "failed" ? 4000 : linkFeedback === "copied_omitted" ? 5000 : 2000);
    return () => window.clearTimeout(t);
  }, [copyFeedback, linkFeedback]);

  const handleCopy = async () => {
    if (!getSummary) return;
    try {
      await navigator.clipboard.writeText(getSummary());
      setCopyFeedback("copied");
      mwcTrack("math_copy_summary", { tool: analyticsId });
    } catch {
      setCopyFeedback("failed");
      mwcTrack("math_copy_failed", { tool: analyticsId });
    }
  };

  const handleShareLink = async () => {
    if (!getShareSearchParams) return;
    try {
      const { params, sharePayloadOmitted } = getShareSearchParams();
      const u = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v != null && v !== "") u.set(k, v);
      }
      const qs = u.toString();
      const url = `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
      await navigator.clipboard.writeText(url);
      if (sharePayloadOmitted) {
        setLinkFeedback("copied_omitted");
        mwcTrack("math_share_link_omitted", { tool: analyticsId });
      } else {
        setLinkFeedback("copied");
        mwcTrack("math_share_link_copy", { tool: analyticsId });
      }
    } catch {
      setLinkFeedback("failed");
      mwcTrack("math_share_link_failed", { tool: analyticsId });
    }
  };

  const handleReset = () => {
    onReset?.();
    mwcTrack("math_reset_inputs", { tool: analyticsId });
  };

  const handlePrint = () => {
    onPrintSchedule?.();
    mwcTrack("math_print", { tool: analyticsId });
  };

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap items-center gap-3">
        {onReset ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {t("resetInputs")}
          </button>
        ) : null}
        {getSummary ? (
          <button
            type="button"
            onClick={handleCopy}
            aria-describedby={`mwc-math-copy-status-${analyticsId}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {t("copySummary")}
          </button>
        ) : null}
        {getShareSearchParams ? (
          <button
            type="button"
            onClick={handleShareLink}
            aria-describedby={`mwc-math-link-status-${analyticsId}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {t("copyShareLink")}
          </button>
        ) : null}
        {onPrintSchedule ? (
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {t("printPage")}
          </button>
        ) : null}
      </div>
      <p
        id={`mwc-math-copy-status-${analyticsId}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-1.5 text-xs empty:hidden"
      >
        {copyFeedback === "copied" ? (
          <span className="text-emerald-700">{t("summaryCopied")}</span>
        ) : copyFeedback === "failed" ? (
          <span className="text-rose-700">{t("summaryFailed")}</span>
        ) : null}
      </p>
      {getShareSearchParams ? (
        <p
          id={`mwc-math-link-status-${analyticsId}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-1 text-xs empty:hidden"
        >
          {linkFeedback === "copied" ? (
            <span className="text-emerald-700">{t("linkCopiedWithInputs")}</span>
          ) : linkFeedback === "copied_omitted" ? (
            <span className="text-amber-800 dark:text-amber-200">{t("linkCopiedOmitted")}</span>
          ) : linkFeedback === "failed" ? (
            <span className="text-rose-700">{t("linkCopyFailed")}</span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
