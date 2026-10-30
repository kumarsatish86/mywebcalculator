"use client";

import { useId, useState } from "react";
import type { RichArticle } from "@/lib/calculator-seo/types";

type ExplainSlot = {
  id: string;
  title: string;
  body: string;
};

function buildSlots(article: RichArticle | null | undefined): ExplainSlot[] {
  if (!article) return [];
  const slots: ExplainSlot[] = [];
  const first = article.sections[0];
  if (first) {
    slots.push({
      id: "what",
      title: "What is this?",
      body: first.paragraphs.slice(0, 2).join(" "),
    });
  }
  if (article.shellNote) {
    slots.push({
      id: "when",
      title: "When should you use it?",
      body: article.shellNote,
    });
  }
  const faq = article.faq[0];
  if (faq) {
    slots.push({
      id: "why",
      title: faq.question,
      body: faq.answer,
    });
  }
  if (article.tables[0]?.rows?.length) {
    const rows = article.tables[0].rows
      .slice(0, 4)
      .map((r) => r.join(" — "))
      .join("\n");
    slots.push({
      id: "formula",
      title: article.tables[0].title || "Key ideas",
      body: rows,
    });
  }
  slots.push({
    id: "limits",
    title: "Limitations",
    body: "Teaching estimate only. Rates, tax rules, and personal circumstances vary—verify with official sources before acting.",
  });
  return slots;
}

/** Accordion fed by rich SEO articles — What / Why / When / Formula / Limits. */
export function ExplainAccordion({
  article,
  compact = false,
}: {
  article: RichArticle | null | undefined;
  compact?: boolean;
}) {
  const slots = buildSlots(article);
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(slots[0]?.id ?? null);

  if (!slots.length) return null;

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Explain</p>
      <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
        {slots.map((slot) => {
          const panelId = `${baseId}-${slot.id}`;
          const isOpen = open === slot.id;
          return (
            <div key={slot.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--input-bg)]/50"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : slot.id)}
              >
                {slot.title}
                <span className="text-[var(--muted)]" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen ? (
                <div id={panelId} className="whitespace-pre-wrap px-3 pb-3 text-xs leading-relaxed text-[var(--muted)]">
                  {slot.body}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
