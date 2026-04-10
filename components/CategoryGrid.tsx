"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { CalculatorDefinition } from "@/lib/types";
import { GlassCard } from "./GlassCard";
import { staggerContainer, staggerItem, transitionSoft } from "@/lib/motion";

const categoryLabel: Record<CalculatorDefinition["category"], string> = {
  finance: "Finance",
  education: "Education",
  health: "Health",
  engineering: "Engineering",
  daily: "Daily Life",
  conversion: "Conversion",
  business: "Business",
  ai: "AI",
};

type CategoryGridProps = {
  items: CalculatorDefinition[];
};

export function CategoryGrid({ items }: CategoryGridProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c.slug}>
            <Link href={`/calculators/${c.slug}`} className="block focus:outline-none">
              <GlassCard hover className="h-full">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                  {categoryLabel[c.category]}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{c.shortTitle}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{c.description}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-[var(--accent-bright)]">
                  Open →
                </span>
              </GlassCard>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {items.map((c) => (
        <motion.li key={c.slug} variants={staggerItem} transition={transitionSoft}>
          <Link href={`/calculators/${c.slug}`} className="block focus:outline-none">
            <GlassCard hover className="h-full">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                {categoryLabel[c.category]}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{c.shortTitle}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{c.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-[var(--accent-bright)]">
                Open →
              </span>
            </GlassCard>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
