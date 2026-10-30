import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorArticle } from "@/components/calculator-content/CalculatorArticle";
import { FaqAccordion } from "@/components/calculator-content/FaqAccordion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CalculatorPageFrame } from "@/components/calculators/CalculatorPageFrame";
import { CalculatorRouter } from "@/components/calculators/CalculatorRouter";
import { RelatedToolsRail } from "@/components/recommendations/RelatedToolsRail";
import { ExplainAccordionClient } from "@/components/results/ExplainAccordionClient";
import { getRichArticle } from "@/lib/calculator-seo/getRichArticle";
import { buildCalculatorJsonLd } from "@/lib/calculator-jsonld";
import { CALCULATOR_REGISTRY, getCalculator } from "@/lib/registry";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CALCULATOR_REGISTRY.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) return {};
  const rich = getRichArticle(slug);
  const title = rich?.meta.seoTitle ?? c.title;
  const description = rich?.meta.seoDescription ?? c.longDescription;
  const keywords =
    rich?.meta.keywords?.length ? [...new Set([...rich.meta.keywords, ...c.keywords])] : c.keywords;
  const pageUrl = `https://mywebcalculator.com/calculators/${c.slug}`;
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
  };
}

/** Workspace hosts: compact breadcrumb chrome (title lives in the shell). */
const WORKSPACE_SLUGS = new Set([
  "elec-lightning-protection-calculator",
  "exam-strategy-planner",
  "daily-interest-calculator",
]);

/**
 * Workspaces that already ship Formula / Standards / FAQ inside the host.
 * Those keep the long article collapsed so the page does not feel duplicated.
 * Other workspaces (e.g. daily interest) keep the full guide + FAQ visible below.
 */
const WORKSPACE_COLLAPSE_ARTICLE = new Set([
  "elec-lightning-protection-calculator",
  "exam-strategy-planner",
]);

const EXPLAIN_PILOTS = new Set([
  "loan-payment",
  "loan-emi-calculator",
  "body-bmi-calculator",
  "exam-strategy-planner",
]);

export default async function CalculatorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const def = getCalculator(slug);
  if (!def) notFound();

  const rich = getRichArticle(slug);
  const faqItems = rich ? [...rich.faq, ...def.faq] : def.faq;
  const jsonLd = buildCalculatorJsonLd({ ...def, faq: faqItems });
  const isWorkspace = WORKSPACE_SLUGS.has(slug);
  const collapseArticle = WORKSPACE_COLLAPSE_ARTICLE.has(slug);
  const showExplain = !isWorkspace && EXPLAIN_PILOTS.has(slug) && Boolean(rich);
  const showRelated = !collapseArticle;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorPageFrame definition={def} compact={isWorkspace} />
      <AnimatedPage className="w-full">
        <CalculatorRouter slug={slug} initialSearchParams={sp} />
        {showExplain ? (
          <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-0">
            <ExplainAccordionClient article={rich} />
          </div>
        ) : null}
        {showRelated ? (
          <div className="mx-auto max-w-4xl px-4 sm:px-0">
            <RelatedToolsRail slug={slug} />
          </div>
        ) : null}
      </AnimatedPage>
      {collapseArticle ? (
        <details className="mx-auto mt-10 max-w-4xl rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 open:pb-6">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--text)] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="text-[var(--accent)]">Documentation &amp; references</span>
            <span className="ml-2 font-normal text-[var(--muted)]">
              (collapsed — Formula / Standards / FAQ live in the workspace tabs above)
            </span>
          </summary>
          <CalculatorArticle slug={slug} compact>
            <FaqAccordion detailsGroupName={`mwc-calc-${slug}`} items={faqItems} />
          </CalculatorArticle>
        </details>
      ) : (
        <CalculatorArticle slug={slug}>
          <FaqAccordion detailsGroupName={`mwc-calc-${slug}`} items={faqItems} />
        </CalculatorArticle>
      )}
    </>
  );
}
