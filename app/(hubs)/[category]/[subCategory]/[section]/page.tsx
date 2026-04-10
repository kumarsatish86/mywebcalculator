import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/AnimatedPage";
import { HubContentAside } from "@/components/hubs/HubContentAside";
import { HubFaq } from "@/components/hubs/HubFaq";
import { HubIntroProse } from "@/components/hubs/HubIntroProse";
import { HubRelatedLinks } from "@/components/hubs/HubRelatedLinks";
import { JsonLdFaqPage } from "@/components/hubs/JsonLdFaqPage";
import {
  allCategorySectionStaticParams,
  getCategoryHub,
  getSection,
  getSubcategory,
  isCalculatorCategory,
} from "@/lib/category-tree";
import { getSectionHubContent } from "@/lib/hub-content";

type Props = {
  params: Promise<{ category: string; subCategory: string; section: string }>;
};

export function generateStaticParams() {
  return allCategorySectionStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subCategory, section } = await params;
  if (!isCalculatorCategory(category)) return {};
  const sub = getSubcategory(category, subCategory);
  const sectionNode = getSection(category, subCategory, section);
  if (!sub || !sectionNode) return {};

  const rich = getSectionHubContent(category, subCategory, section);
  const title = `${sectionNode.title} | ${sub.title} | mywebcalculator`;
  const description = rich.metaDescriptionOverride ?? sectionNode.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mywebcalculator.com/${category}/${subCategory}/${section}`,
      type: "website",
    },
    alternates: {
      canonical: `https://mywebcalculator.com/${category}/${subCategory}/${section}`,
    },
  };
}

export default async function CategorySectionPage({ params }: Props) {
  const { category, subCategory, section } = await params;
  if (!isCalculatorCategory(category)) notFound();
  const hub = getCategoryHub(category);
  const sub = getSubcategory(category, subCategory);
  const sectionNode = getSection(category, subCategory, section);

  if (!sub || !sectionNode) {
    notFound();
  }

  const rich = getSectionHubContent(category, subCategory, section);

  return (
    <AnimatedPage>
      <JsonLdFaqPage items={rich.faqs} />
      <nav className="mb-6 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">/</li>
          <li>
            <Link href={hub.path} className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]">
              {hub.title}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">/</li>
          <li>
            <Link
              href={`${hub.path}/${sub.slug}`}
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]"
            >
              {sub.title}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">/</li>
          <li className="font-medium text-[var(--text)]" aria-current="page">
            {sectionNode.title}
          </li>
        </ol>
      </nav>

      <header className="mb-10 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent-bright)]">
          {sub.title}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
          {sectionNode.title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {sectionNode.description}
        </p>
      </header>

      <div className="mb-10 space-y-10">
        <HubIntroProse paragraphs={rich.introParagraphs} />
        {rich.secondaryHeading && rich.bulletPoints?.length ? (
          <HubContentAside heading={rich.secondaryHeading} bullets={rich.bulletPoints} />
        ) : null}
      </div>

      {category === "health" && subCategory === "medical" ? (
        <aside
          className="mb-8 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-[var(--text)]"
          role="note"
        >
          <p className="font-medium text-[var(--text)]">Medical disclaimer</p>
          <p className="mt-1 text-[var(--muted)]">
            These pages list planned educational calculators only. They are not medical devices, not
            tailored clinical advice, and not a substitute for a licensed professional. Do not use
            them to diagnose, treat, or change medications.
          </p>
        </aside>
      ) : null}

      {category === "health" && subCategory !== "medical" ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          Health and wellness calculators are for general education. Results vary by individual;
          consult a qualified professional for personal medical or nutrition decisions.
        </aside>
      ) : null}

      {category === "engineering" &&
      (subCategory === "electrical" || subCategory === "civil") ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          Engineering results here are for study and estimation only. Codes, standards, and safe
          working practices differ by region and project—verify with a licensed professional before
          designing or modifying electrical or structural systems.
        </aside>
      ) : null}

      {category === "daily" ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          Daily life calculators are for general planning and education. Results are estimates;
          prices, tariffs, taxes, and local rules vary by region—check current figures before you
          budget or commit.
        </aside>
      ) : null}

      {category === "conversion" ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          Conversion tools here are for education and rough planning. Currency and FX figures are
          indicative only—not investment advice; banks and cards use their own rates and fees. Unit
          conversions may round; date and time math is not for legal deadlines or medical decisions.
        </aside>
      ) : null}

      {category === "business" ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          Business calculators are for education and rough estimates only. They are not tax, legal,
          HR, or investment advice. Rules, rates, and payroll treatment vary by jurisdiction and
          employer—confirm with a qualified professional before you rely on results for decisions.
        </aside>
      ) : null}

      {category === "ai" ? (
        <aside
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
          role="note"
        >
          AI-assisted tools are for education and brainstorming. They are not financial, medical, or
          legal advice; models can be wrong or outdated. Double-check anything important, and avoid
          pasting sensitive personal data—see our privacy policy for how we handle information.
        </aside>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {sectionNode.calculators.map((item) => (
          <li key={item.slug} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4">
            <p className="font-medium text-[var(--text)]">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              Planned · {item.slug}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-16 space-y-12 border-t border-[var(--border)] pt-12">
        <HubFaq items={rich.faqs} />
        <HubRelatedLinks title="Explore more" links={rich.relatedLinks} />
      </div>
    </AnimatedPage>
  );
}
