import type { CalculatorDefinition } from "./types";
import type { CalculatorCategory } from "./types";
import { getCategoryHub, subcategoryTitleForSlug } from "./category-tree";

const SITE = "https://mywebcalculator.com";

function applicationCategoryFor(category: CalculatorCategory): string {
  switch (category) {
    case "finance":
      return "FinanceApplication";
    case "education":
      return "EducationalApplication";
    case "health":
      return "HealthApplication";
    case "engineering":
      return "DesignApplication";
    case "daily":
      return "LifestyleApplication";
    case "conversion":
      return "UtilitiesApplication";
    case "business":
      return "BusinessApplication";
    case "ai":
      return "DeveloperApplication";
    default:
      return "EducationalApplication";
  }
}

export function buildCalculatorJsonLd(def: CalculatorDefinition) {
  const pageUrl = `${SITE}/calculators/${def.slug}`;
  const hub = getCategoryHub(def.category);
  const subTitle = subcategoryTitleForSlug(def.category, def.subCategorySlug);
  const subPageUrl = `${SITE}${hub.path}/${def.subCategorySlug}`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: `${hub.title} calculators`,
        item: `${SITE}${hub.path}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subTitle,
        item: subPageUrl,
      },
      { "@type": "ListItem", position: 4, name: def.shortTitle, item: pageUrl },
    ],
  };

  const webPage = {
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name: def.title,
    description: def.longDescription,
    isPartOf: { "@type": "WebSite", name: "mywebcalculator", url: SITE },
  };

  const webApplication = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: def.title,
    url: pageUrl,
    description: def.longDescription,
    applicationCategory: applicationCategoryFor(def.category),
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isRelatedTo: { "@id": pageUrl },
  };

  const graph: object[] = [breadcrumb, webPage, webApplication];

  if (def.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: def.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
