import Link from "next/link";
import type { HubRelatedLink } from "@/lib/hub-content/types";

type HubRelatedLinksProps = {
  title: string;
  links: HubRelatedLink[];
  className?: string;
};

const categoryEmoji: Record<string, string> = {
  "/finance": "💰",
  "/education": "📚",
  "/health": "❤️",
  "/engineering": "⚙️",
  "/daily": "🏠",
  "/conversion": "🔄",
  "/business": "💼",
  "/ai": "🤖",
};

export function HubRelatedLinks({ title, links, className = "" }: HubRelatedLinksProps) {
  if (links.length === 0) return null;
  return (
    <nav className={className} aria-label={title}>
      <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => {
          const emoji = categoryEmoji[link.href];
          return (
            <li key={`${link.href}-${link.label}`}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2 text-sm font-medium text-[var(--accent)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {emoji ? <span aria-hidden>{emoji}</span> : null}
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
