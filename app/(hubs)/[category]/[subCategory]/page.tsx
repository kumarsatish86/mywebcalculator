import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HubContentAside } from "@/components/hubs/HubContentAside";
import { HubFaq } from "@/components/hubs/HubFaq";
import { HubIntroProse } from "@/components/hubs/HubIntroProse";
import { HubRelatedLinks } from "@/components/hubs/HubRelatedLinks";
import { JsonLdFaqPage } from "@/components/hubs/JsonLdFaqPage";
import { SectionHeading } from "@/components/SectionHeading";
import {
  allSubcategoryStaticParams,
  getCategoryHub,
  getSubcategorySections,
  getSubcategory,
  isCalculatorCategory,
} from "@/lib/category-tree";
import { getSubcategoryHubContent } from "@/lib/hub-content";
import { getBySubcategory, getCalculator } from "@/lib/registry";

type Props = {
  params: Promise<{ category: string; subCategory: string }>;
};

export function generateStaticParams() {
  return allSubcategoryStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subCategory } = await params;
  if (!isCalculatorCategory(category)) {
    return {};
  }
  const sub = getSubcategory(category, subCategory);
  if (!sub) {
    return {};
  }
  const hub = getCategoryHub(category);
  const rich = getSubcategoryHubContent(category, subCategory);
  const title = `${sub.title} calculators | mywebcalculator`;
  const description =
    rich.metaDescriptionOverride ??
    `${sub.description} Browse ${hub.title.toLowerCase()} tools on mywebcalculator.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function SubcategoryHubPage({ params }: Props) {
  const { category: cat, subCategory: subSlug } = await params;
  if (!isCalculatorCategory(cat)) {
    notFound();
  }
  const sub = getSubcategory(cat, subSlug);
  if (!sub) {
    notFound();
  }
  const hub = getCategoryHub(cat);
  const items = getBySubcategory(cat, subSlug);
  const sections = getSubcategorySections(cat, subSlug);
  const rich = getSubcategoryHubContent(cat, subSlug);

  return (
    <AnimatedPage>
      <JsonLdFaqPage items={rich.faqs} />
      <nav className="mb-6 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">
            /
          </li>
          <li>
            <Link
              href={hub.path}
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              {hub.title}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">
            /
          </li>
          <li className="font-medium text-[var(--text)]" aria-current="page">
            {sub.title}
          </li>
        </ol>
      </nav>

      <SectionHeading
        eyebrow={`${hub.hubEyebrow} · ${sub.title}`}
        title={`${sub.title} calculators`}
        subtitle={sub.description}
      />

      <div className="mt-10 space-y-10">
        <HubIntroProse paragraphs={rich.introParagraphs} />
        {rich.secondaryHeading && rich.bulletPoints?.length ? (
          <HubContentAside heading={rich.secondaryHeading} bullets={rich.bulletPoints} />
        ) : null}
      </div>

      <div className="mt-12">
        {sections.length > 0 ? (
          <div className="mb-10 grid gap-3 md:grid-cols-2">
            {sections.map((section) => {
              const live = section.calculators.filter((c) => getCalculator(c.slug)).length;
              const planned = section.calculators.length - live;
              return (
                <Link
                  key={section.slug}
                  href={`/${cat}/${subSlug}/${section.slug}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4 transition-colors hover:border-[var(--accent)]/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <p className="font-medium text-[var(--text)]">{section.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{section.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--accent-bright)]">
                    {planned === 0
                      ? `${live} calculators`
                      : `${live} live · ${planned} planned`}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : null}
        {items.length > 0 ? (
          <CategoryGrid items={items} />
        ) : sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-10 text-center">
            <p className="text-[var(--text)] font-medium">More tools on the way</p>
            <p className="mt-3 max-w-lg mx-auto text-sm leading-relaxed text-[var(--muted)]">
              {sub.emptyState ??
                `We are curating ${sub.title.toLowerCase()} calculators for this section. Meanwhile, explore the full ${hub.title.toLowerCase()} hub or related tools on the home page.`}
            </p>
            <Link
              href={hub.path}
              className="mt-6 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              ← Back to {hub.title}
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mt-16 space-y-12 border-t border-[var(--border)] pt-12">
        <HubFaq items={rich.faqs} />
        <HubRelatedLinks title="Related topics" links={rich.relatedLinks} />
      </div>
    </AnimatedPage>
  );
}
