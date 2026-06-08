import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CategoryListicle } from "@/components/hubs/CategoryListicle";
import { HubContentAside } from "@/components/hubs/HubContentAside";
import { HubFaq } from "@/components/hubs/HubFaq";
import { HubHeroSection } from "@/components/hubs/HubHeroSection";
import { HubIntroProse } from "@/components/hubs/HubIntroProse";
import { HubRelatedLinks } from "@/components/hubs/HubRelatedLinks";
import { JsonLdFaqPage } from "@/components/hubs/JsonLdFaqPage";
import {
  allCategoryStaticParams,
  getCategoryHub,
  isCalculatorCategory,
} from "@/lib/category-tree";
import { getCategoryHubContent } from "@/lib/hub-content";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return allCategoryStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCalculatorCategory(category)) {
    return {};
  }
  const hub = getCategoryHub(category);
  const rich = getCategoryHubContent(category);
  const description = rich.metaDescriptionOverride ?? hub.metaDescription;
  return {
    title: hub.metaTitle,
    description,
    openGraph: {
      title: hub.metaTitle,
      description,
    },
  };
}

export default async function CategoryHubPage({ params }: Props) {
  const { category: cat } = await params;
  if (!isCalculatorCategory(cat)) {
    notFound();
  }
  const rich = getCategoryHubContent(cat);

  return (
    <AnimatedPage>
      <JsonLdFaqPage items={rich.faqs} />
      <HubHeroSection category={cat} />
      <div className="mt-10 space-y-10">
        <HubIntroProse paragraphs={rich.introParagraphs} />
        {rich.secondaryHeading && rich.bulletPoints?.length ? (
          <HubContentAside heading={rich.secondaryHeading} bullets={rich.bulletPoints} />
        ) : null}
        <HubFaq items={rich.faqs} />
      </div>
      <div className="mt-16">
        <CategoryListicle category={cat} />
      </div>
      <HubRelatedLinks
        title="Other calculator categories"
        links={rich.relatedLinks}
        className="mt-16 border-t border-[var(--border)] pt-12"
      />
    </AnimatedPage>
  );
}
