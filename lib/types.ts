export type CalculatorCategory = "finance" | "education" | "health" | "engineering" | "daily" | "conversion" | "business" | "ai";

export type CalculatorFaqItem = {
  question: string;
  answer: string;
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: CalculatorCategory;
  subCategorySlug: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: CalculatorFaqItem[];
};
