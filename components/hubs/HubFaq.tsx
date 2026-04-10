import { FaqAccordion } from "@/components/calculator-content/FaqAccordion";
import type { CalculatorFaqItem } from "@/lib/types";

type HubFaqProps = {
  items: CalculatorFaqItem[];
  className?: string;
};

export function HubFaq({ items, className = "" }: HubFaqProps) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <FaqAccordion
        detailsGroupName="mwc-hub-faq"
        items={items}
        title="Frequently asked questions"
        subtitle="How this hub works, what “planned” means, and how to treat results. For high-stakes decisions, consult a professional."
      />
    </div>
  );
}
