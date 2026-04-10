export type SectionCalculatorNode = {
  slug: string;
  title: string;
  description?: string;
  status?: "planned";
};

export type SectionNode = {
  slug: string;
  title: string;
  description: string;
  calculators: SectionCalculatorNode[];
};
