import Link from "next/link";
import { getByCategory } from "@/lib/registry";
import type { CalculatorCategory } from "@/lib/types";

const blocks: {
  category: CalculatorCategory;
  title: string;
  subtitle: string;
  href: string;
  accent: string;
}[] = [
  {
    category: "finance",
    title: "Finance & Investment",
    subtitle: "Loans, EMI, Investment, Salary, and Banking tools.",
    href: "/finance",
    accent: "from-green-500/15 to-emerald-400/10",
  },
  {
    category: "education",
    title: "Education & Academic",
    subtitle: "Mathematics, Science, and Exam & Score calculators.",
    href: "/education",
    accent: "from-blue-500/15 to-cyan-400/10",
  },
  {
    category: "health",
    title: "Health & Fitness",
    subtitle: "Body Metrics, Diet & Nutrition, and Medical calculators.",
    href: "/health",
    accent: "from-rose-500/15 to-pink-400/10",
  },
  {
    category: "engineering",
    title: "Engineering & Technical",
    subtitle: "Electrical, Civil, and IT / Dev calculators.",
    href: "/engineering",
    accent: "from-amber-500/15 to-orange-400/10",
  },
  {
    category: "daily",
    title: "Daily Life",
    subtitle: "Home & Utility, Shopping & Discount, and Travel calculators.",
    href: "/daily",
    accent: "from-violet-500/15 to-purple-400/10",
  },
  {
    category: "conversion",
    title: "Conversion Calculators",
    subtitle: "Unit Converters, Currency, and Time & Date calculations.",
    href: "/conversion",
    accent: "from-teal-500/15 to-cyan-400/10",
  },
  {
    category: "business",
    title: "Business & Professional",
    subtitle: "Business Finance, Marketing, and HR Productivity tools.",
    href: "/business",
    accent: "from-slate-500/15 to-gray-400/10",
  },
  {
    category: "ai",
    title: "AI-Powered",
    subtitle: "Smart Tools and Generators for your future edge.",
    href: "/ai",
    accent: "from-fuchsia-500/15 to-indigo-400/10",
  },
];

const cardLinkClass =
  "block rounded-2xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] active:scale-[0.99]";

export function CategoryPreviewCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {blocks.map((block) => {
        const count = getByCategory(block.category).length;
        return (
          <Link key={block.href} href={block.href} className={cardLinkClass}>
            <div
              className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br ${block.accent} p-6 backdrop-blur-xl`}
            >
              <div className="absolute inset-0 bg-white/55" />
              <div className="relative">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                  {count} calculators
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{block.subtitle}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-[var(--accent-bright)]">
                  View category →
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
