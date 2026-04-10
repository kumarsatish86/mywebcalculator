"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CALCULATOR_CATEGORIES, getCategoryHub } from "@/lib/category-tree";

const categoryLinks = CALCULATOR_CATEGORIES.map((id) => {
  const hub = getCategoryHub(id);
  return { href: hub.path, label: hub.title };
});

const links = [{ href: "/", label: "Home" }, ...categoryLinks];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-xl">
      <div className="mx-auto flex h-auto min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:h-14 sm:px-6 sm:py-0">
        <Link
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] text-sm font-bold text-[var(--text-on-gradient)] shadow-[var(--shadow-glow)]">
            M
          </span>
          <span className="hidden sm:inline">mywebcalculator</span>
        </Link>
        <nav
          className="flex max-w-full flex-1 flex-wrap items-center justify-end gap-x-0.5 gap-y-1 text-xs font-medium sm:text-sm"
          aria-label="Main"
        >
          {links.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-bg)] sm:px-2.5 sm:py-2 ${
                  active
                    ? "text-[var(--text)]"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute inset-0 -z-10 rounded-lg bg-[var(--surface-strong)]/90" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
