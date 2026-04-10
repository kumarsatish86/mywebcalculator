import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

/** Server component — no entrance animation so LCP text paints immediately. */
export function SectionHeading({ eyebrow, title, subtitle, className = "" }: SectionHeadingProps) {
  const content: ReactNode = (
    <>
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-sans text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-pretty text-base leading-relaxed text-[var(--muted)]">{subtitle}</p>
      ) : null}
    </>
  );

  return <div className={`max-w-2xl ${className}`}>{content}</div>;
}
