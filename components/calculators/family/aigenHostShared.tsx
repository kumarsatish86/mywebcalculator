"use client";

import type { AigenResult } from "@/lib/calculators/aigenHelpers";

export const AIGEN_UI_DISCLAIMER =
  "Draft for inspiration only. Verify before use. Not professional, medical, or legal advice. Template generator — not a live AI model.";

export function AigenResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono whitespace-pre-wrap text-right break-words">{value}</span>
    </div>
  );
}

export function formatAigenResult(res: AigenResult) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.score !== undefined) rows.push({ label: "Score", value: String(res.score) });
  if (res.primary !== undefined && res.score === undefined) {
    rows.push({ label: "Primary", value: String(res.primary) });
  }
  rows.push({ label: "Note", value: res.note });
  const primaryLabel =
    res.score !== undefined ? "Score" : res.primary !== undefined ? "Primary" : "Draft ready";
  const primary =
    res.score !== undefined
      ? String(res.score)
      : res.primary !== undefined
        ? String(res.primary)
        : "OK";
  return {
    primary,
    primaryLabel,
    draft: res.draft,
    lines: res.lines ?? res.draft.split("\n"),
    rows,
  };
}
