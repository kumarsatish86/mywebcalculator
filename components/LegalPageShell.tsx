import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { GlassCard } from "@/components/GlassCard";

export type RelatedLink = { href: string; label: string };

const articleProse =
  "legal-prose text-[var(--text)] [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-[var(--text)] [&_h3]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--text)] [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_strong]:font-semibold [&_strong]:text-[var(--text)] [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-[var(--muted)] [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-[var(--muted)] [&_li]:my-1.5 [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-[var(--accent-bright)] [&_a]:focus:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-[var(--ring)] [&_a]:rounded";

type LegalPageShellProps = {
  title: string;
  lastUpdated?: string;
  intro?: ReactNode;
  children: ReactNode;
  related?: RelatedLink[];
};

function formatDisplayDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function LegalPageShell({
  title,
  lastUpdated,
  intro,
  children,
  related,
}: LegalPageShellProps) {
  return (
    <AnimatedPage className="w-full">
      <GlassCard className="w-full max-w-full sm:p-8 lg:p-10">
        <article className={articleProse}>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl lg:text-4xl">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Last updated: <time dateTime={lastUpdated}>{formatDisplayDate(lastUpdated)}</time>
            </p>
          ) : null}
          {intro ? <div className="mt-6 leading-relaxed text-[var(--muted)]">{intro}</div> : null}
          <div className={intro ? "mt-6" : "mt-8"}>{children}</div>
          {related && related.length > 0 ? (
            <aside
              className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/60 p-5"
              aria-label="Related pages"
            >
              <h2 className="text-sm font-semibold text-[var(--text)]">Related</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>{r.label}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </article>
      </GlassCard>
    </AnimatedPage>
  );
}
