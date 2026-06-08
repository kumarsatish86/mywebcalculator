import Link from "next/link";
import { getByCategory } from "@/lib/registry";
import type { CalculatorCategory } from "@/lib/types";

const blocks: {
  category: CalculatorCategory;
  title: string;
  subtitle: string;
  href: string;
  emoji: string;
  cardGradient: string;
  iconGradient: string;
  decorColor: string;
}[] = [
  {
    category: "finance",
    title: "Finance & Investment",
    subtitle: "Loans, EMI, Investment, Salary, and Banking tools.",
    href: "/finance",
    emoji: "💰",
    cardGradient: "from-emerald-500/18 to-green-400/8",
    iconGradient: "from-emerald-500 to-green-400",
    decorColor: "bg-emerald-400/10",
  },
  {
    category: "education",
    title: "Education & Academic",
    subtitle: "Mathematics, Science, and Exam & Score calculators.",
    href: "/education",
    emoji: "📚",
    cardGradient: "from-blue-500/18 to-sky-400/8",
    iconGradient: "from-blue-500 to-sky-400",
    decorColor: "bg-blue-400/10",
  },
  {
    category: "health",
    title: "Health & Fitness",
    subtitle: "Body Metrics, Diet & Nutrition, and Medical calculators.",
    href: "/health",
    emoji: "❤️",
    cardGradient: "from-rose-500/18 to-pink-400/8",
    iconGradient: "from-rose-500 to-pink-400",
    decorColor: "bg-rose-400/10",
  },
  {
    category: "engineering",
    title: "Engineering & Technical",
    subtitle: "Electrical, Civil, and IT / Dev calculators.",
    href: "/engineering",
    emoji: "⚙️",
    cardGradient: "from-amber-500/18 to-orange-400/8",
    iconGradient: "from-amber-500 to-orange-400",
    decorColor: "bg-amber-400/10",
  },
  {
    category: "daily",
    title: "Daily Life",
    subtitle: "Home & Utility, Shopping & Discount, and Travel calculators.",
    href: "/daily",
    emoji: "🏠",
    cardGradient: "from-violet-500/18 to-purple-400/8",
    iconGradient: "from-violet-500 to-purple-400",
    decorColor: "bg-violet-400/10",
  },
  {
    category: "conversion",
    title: "Conversion Calculators",
    subtitle: "Unit Converters, Currency, and Time & Date calculations.",
    href: "/conversion",
    emoji: "🔄",
    cardGradient: "from-teal-500/18 to-cyan-400/8",
    iconGradient: "from-teal-500 to-cyan-400",
    decorColor: "bg-teal-400/10",
  },
  {
    category: "business",
    title: "Business & Professional",
    subtitle: "Business Finance, Marketing, and HR Productivity tools.",
    href: "/business",
    emoji: "💼",
    cardGradient: "from-slate-500/18 to-gray-400/8",
    iconGradient: "from-slate-500 to-gray-400",
    decorColor: "bg-slate-400/10",
  },
  {
    category: "ai",
    title: "AI-Powered",
    subtitle: "Smart Tools and Generators for your future edge.",
    href: "/ai",
    emoji: "🤖",
    cardGradient: "from-fuchsia-500/18 to-indigo-400/8",
    iconGradient: "from-fuchsia-500 to-indigo-400",
    decorColor: "bg-fuchsia-400/10",
  },
];

const cardLinkClass =
  "group block rounded-2xl transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] active:scale-[0.99]";

export function CategoryPreviewCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {blocks.map((block) => {
        const count = getByCategory(block.category).length;
        return (
          <Link key={block.href} href={block.href} className={cardLinkClass}>
            <div
              className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br ${block.cardGradient} p-5 backdrop-blur-xl transition-shadow duration-200 group-hover:shadow-[var(--shadow-glow)]`}
            >
              {/* White wash */}
              <div className="absolute inset-0 bg-white/52" />
              {/* Decorative circle */}
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${block.decorColor} blur-xl`} />

              <div className="relative">
                {/* Icon box */}
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${block.iconGradient} text-xl shadow-md`}
                  aria-hidden
                >
                  {block.emoji}
                </div>

                {/* Count badge */}
                <span className="absolute right-0 top-0 rounded-full border border-[var(--border)] bg-white/80 px-2 py-0.5 text-xs font-medium text-[var(--muted)]">
                  {count}
                </span>

                <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--text)]">
                  {block.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{block.subtitle}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--accent-bright)]">
                  View category
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
