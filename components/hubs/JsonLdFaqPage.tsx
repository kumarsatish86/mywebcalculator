import type { CalculatorFaqItem } from "@/lib/types";

type JsonLdFaqPageProps = {
  items: CalculatorFaqItem[];
};

/** FAQPage structured data for hub routes that expose FAQ accordions. */
export function JsonLdFaqPage({ items }: JsonLdFaqPageProps) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
