import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorArticle } from "@/components/calculator-content/CalculatorArticle";
import { FaqAccordion } from "@/components/calculator-content/FaqAccordion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CalculatorPageFrame } from "@/components/calculators/CalculatorPageFrame";
import { CalculatorRouter } from "@/components/calculators/CalculatorRouter";
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

export default async function CalculatorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const def = getCalculator(slug);
  if (!def) notFound();

  const rich = getRichArticle(slug);
  const faqItems = rich ? [...rich.faq, ...def.faq] : def.faq;
  const jsonLd = buildCalculatorJsonLd({ ...def, faq: faqItems });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorPageFrame definition={def} />
      <AnimatedPage className="w-full">
        <CalculatorRouter slug={slug} initialSearchParams={sp} />
      </AnimatedPage>
      <CalculatorArticle slug={slug}>
        <FaqAccordion detailsGroupName={`mwc-calc-${slug}`} items={faqItems} />
      </CalculatorArticle>
    </>
  );
}
