import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function GlassCard({ children, className = "", hover = false }: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl",
        hover
          ? "transition-transform duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:shadow-[var(--shadow-glow)]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
