"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Decorative only — kept client-side so the hero headline can stay server-rendered for LCP. */
export function HeroAmbientOrb() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <>
      {/* Large purple blob — right */}
      <motion.div
        className="pointer-events-none absolute -right-16 -top-8 hidden h-[28rem] w-[28rem] rounded-full opacity-35 blur-3xl md:block"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.28, 0.45, 0.28] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      {/* Teal blob — top left */}
      <motion.div
        className="pointer-events-none absolute -left-20 top-8 hidden h-64 w-64 rounded-full opacity-25 blur-3xl md:block"
        style={{ background: "radial-gradient(circle, var(--accent-bright) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        aria-hidden
      />
      {/* Pink blob — mid right */}
      <motion.div
        className="pointer-events-none absolute right-24 top-52 hidden h-48 w-48 rounded-full opacity-20 blur-2xl md:block"
        style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.14, 0.26, 0.14] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        aria-hidden
      />
      {/* Small amber blob — bottom right of hero */}
      <motion.div
        className="pointer-events-none absolute bottom-8 right-8 hidden h-32 w-32 rounded-full opacity-20 blur-2xl lg:block"
        style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        aria-hidden
      />
    </>
  );
}
