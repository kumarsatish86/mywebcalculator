import Link from "next/link";
import { FOOTER_COLUMNS, SITE_URL } from "@/lib/site-footer";

const linkClass =
  "text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/40 py-12 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-semibold text-[var(--text)]">mywebcalculator</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Free calculators for study, money, and curiosity. All tools run in your browser.
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              <Link
                href={SITE_URL}
                className="font-medium text-[var(--accent-bright)] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
              >
                mywebcalculator.com
              </Link>
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {col.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-[var(--border)] pt-8 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} mywebcalculator. Calculators are for general information only.
        </p>
      </div>
    </footer>
  );
}
