"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Decorative only — kept client-side so the hero headline can stay server-rendered for LCP. */
export function HeroAmbientOrb() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none absolute -right-4 top-0 hidden h-72 w-72 rounded-full opacity-40 blur-3xl md:block"
      style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}
