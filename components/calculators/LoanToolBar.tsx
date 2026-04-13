"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mwcTrack } from "@/lib/analytics/mwcTrack";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { LOAN_URL, searchParamsStringFromRecord } from "@/lib/calculators/loanUrlParams";

type Props = {
  analyticsId: string;
  onReset?: () => void;
  getSummary?: () => string;
  showBankRounding?: boolean;
  /** Build field query (p, a, t, …); currency, term mode, and penny flag are merged automatically. */
  getShareSearchParams?: () => Record<string, string | undefined>;
  onPrintSchedule?: () => void;
  /** `inline`: no outer card—use inside CalculatorShell under the description. */
  variant?: "card" | "inline";
};

export function LoanToolBar({
  analyticsId,
  onReset,
  getSummary,
  showBankRounding = false,
  getShareSearchParams,
  onPrintSchedule,
  variant = "card",
}: Props) {
  const pathname = usePathname();
  const { bankPennyRounding, setBankPennyRounding, currency, termMode } = useLoanCalcPrefs();
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const [linkFeedback, setLinkFeedback] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (copyFeedback === "idle" && linkFeedback === "idle") return;
    const t = window.setTimeout(() => {
      setCopyFeedback("idle");
      setLinkFeedback("idle");
    }, copyFeedback === "failed" || linkFeedback === "failed" ? 4000 : 2000);
    return () => window.clearTimeout(t);
  }, [copyFeedback, linkFeedback]);

  const handleCopy = async () => {
    if (!getSummary) return;
    try {
      await navigator.clipboard.writeText(getSummary());
      setCopyFeedback("copied");
      mwcTrack("loan_copy_summary", { tool: analyticsId });
    } catch {
      setCopyFeedback("failed");
      mwcTrack("loan_copy_failed", { tool: analyticsId });
    }
  };

  const handleShareLink = async () => {
    if (!getShareSearchParams) return;
    try {
      const merged: Record<string, string | undefined> = {
        ...getShareSearchParams(),
        [LOAN_URL.CUR]: currency,
        [LOAN_URL.TM]: termMode,
        [LOAN_URL.BR]: bankPennyRounding ? "1" : "0",
      };
      const qs = searchParamsStringFromRecord(merged);
      const url = `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
      await navigator.clipboard.writeText(url);
      setLinkFeedback("copied");
      mwcTrack("loan_share_link_copy", { tool: analyticsId });
    } catch {
      setLinkFeedback("failed");
      mwcTrack("loan_share_link_failed", { tool: analyticsId });
    }
  };

  const handleReset = () => {
    onReset?.();
    mwcTrack("loan_reset_inputs", { tool: analyticsId });
  };

  const handlePrint = () => {
    onPrintSchedule?.();
    mwcTrack("loan_print_schedule", { tool: analyticsId });
  };

  const wrap =
    variant === "inline"
      ? "print:hidden"
      : "mt-6 mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 print:hidden";

  return (
    <div className={wrap}>
      <div className="flex flex-wrap items-center gap-3">
        {onReset ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Reset inputs
          </button>
        ) : null}
        {getSummary ? (
          <button
            type="button"
            onClick={handleCopy}
            aria-describedby={`mwc-loan-copy-status-${analyticsId}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Copy summary
          </button>
        ) : null}
        {getShareSearchParams ? (
          <button
            type="button"
            onClick={handleShareLink}
            aria-describedby={`mwc-loan-link-status-${analyticsId}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Copy share link
          </button>
        ) : null}
        {onPrintSchedule ? (
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            Print page
          </button>
        ) : null}
        {showBankRounding ? (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
            <input
              id="mwc-loan-bank-rounding"
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-[var(--border)]"
              checked={bankPennyRounding}
              onChange={(e) => {
                const v = e.target.checked;
                setBankPennyRounding(v);
                mwcTrack("loan_bank_rounding_toggle", { tool: analyticsId, enabled: v });
              }}
            />
            <span>
              Bank-style penny rounding{" "}
              <span className="text-[var(--muted)]">(interest, principal, balance per row)</span>
            </span>
          </label>
        ) : null}
      </div>
      <p
        id={`mwc-loan-copy-status-${analyticsId}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-1.5 text-xs empty:hidden"
      >
        {copyFeedback === "copied" ? (
          <span className="text-emerald-700">Summary copied to clipboard.</span>
        ) : copyFeedback === "failed" ? (
          <span className="text-rose-700">Could not copy—check browser permissions or try again.</span>
        ) : null}
      </p>
      {getShareSearchParams ? (
        <p
          id={`mwc-loan-link-status-${analyticsId}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-1 text-xs empty:hidden"
        >
          {linkFeedback === "copied" ? (
            <span className="text-emerald-700">Share link copied (includes your inputs and display prefs).</span>
          ) : linkFeedback === "failed" ? (
            <span className="text-rose-700">Could not copy link.</span>
          ) : null}
        </p>
      ) : null}
      {showBankRounding && bankPennyRounding ? (
        <p className="mt-2 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--muted)]">
          Totals and payoff month count may differ slightly from the pure formula (and simulations can run one
          extra month) because each row is rounded to currency cents.
        </p>
      ) : null}
    </div>
  );
}
