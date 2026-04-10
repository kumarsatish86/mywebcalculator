import type { ReactNode } from "react";

/**
 * Plain section wrapper — avoids framer-motion `opacity: 0` + whileInView, which can defer LCP
 * on calculator pages until JS runs.
 */
export function SectionReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={className}>{children}</section>;
}
