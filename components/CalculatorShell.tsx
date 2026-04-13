"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { transitionSoft } from "@/lib/motion";

export type CalculatorShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  result?: ReactNode;
  /** Change when result meaningfully updates to allow subtle motion (optional). */
  resultKey?: string | number;
  /** Tighter padding and typography for dense forms (e.g. many rows). */
  compact?: boolean;
  /** Rendered below the description, above inputs (e.g. loan reset / copy / share). */
  toolbar?: ReactNode;
};

export function CalculatorShell({
  title,
  description,
  children,
  result,
  resultKey = 0,
  compact = false,
  toolbar,
}: CalculatorShellProps) {
  const reduce = useReducedMotion();
  const headerPad = compact ? "pb-4" : toolbar ? "pb-4" : "pb-8";
  const gridTop = compact ? "mt-5" : toolbar ? "mt-5" : "mt-8";

  return (
    <GlassCard
      className={`w-full max-w-full ${compact ? "!p-4 sm:!p-5 lg:!p-6" : "sm:p-8 lg:p-10"}`}
    >
      <header
        className={`border-b border-[var(--border)] ${compact ? "space-y-2" : "space-y-3"} ${headerPad}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Calculator
          </span>
        </div>
        <h1
          className={`text-balance font-semibold tracking-tight text-[var(--text)] ${compact ? "text-xl md:text-2xl lg:text-3xl" : "text-2xl md:text-3xl lg:text-4xl"}`}
        >
          {title}
        </h1>
        <p
          className={`max-w-3xl leading-relaxed text-[var(--muted)] ${compact ? "text-xs sm:text-sm" : "text-sm md:text-base"}`}
        >
          {description}
        </p>
        {toolbar ? (
          <div
            className={`max-w-full print:hidden ${compact ? "mt-3" : "mt-4"}`}
            role="group"
            aria-label="Calculator actions"
          >
            {toolbar}
          </div>
        ) : null}
      </header>

      <div
        className={`grid lg:grid-cols-[1fr_minmax(260px,20rem)] lg:items-start ${compact ? `${gridTop} gap-5 lg:gap-6` : `${gridTop} gap-8 lg:gap-10`}`}
      >
        <div className={`order-2 min-w-0 lg:order-1 ${compact ? "space-y-3" : "space-y-4"}`}>
          {children}
        </div>
        {result ? (
          <motion.aside
            layout={!reduce}
            className={`order-1 rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-br from-[var(--surface-strong)]/95 to-[var(--surface)]/90 shadow-[var(--shadow-card)] backdrop-blur-md lg:sticky lg:top-20 lg:order-2 ${compact ? "p-4" : "p-5"}`}
            aria-live="polite"
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] ${compact ? "mb-3" : "mb-4"}`}
            >
              Result
            </p>
            <motion.div
              key={resultKey}
              initial={reduce ? false : { opacity: 0.85, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitionSoft}
            >
              {result}
            </motion.div>
          </motion.aside>
        ) : null}
      </div>
    </GlassCard>
  );
}
