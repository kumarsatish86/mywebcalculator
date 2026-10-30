"use client";

import { motion } from "framer-motion";

const NODES = ["Bank", "Interest", "Principal", "Balance", "You"] as const;

export function DiMoneyFlow() {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Money flow</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {NODES.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
            >
              {label}
            </motion.div>
            {i < NODES.length - 1 ? (
              <motion.span
                aria-hidden
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.1 }}
                className="text-[var(--accent)]"
              >
                →
              </motion.span>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-[var(--muted)]">
        Teaching sketch: interest accrues on balance before it reaches you as reduced capacity.
      </p>
    </div>
  );
}
