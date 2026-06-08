import type { CalculatorDefinition } from "../types";
import type { SectionCalculatorNode, SectionNode } from "../hub-section-types";
import { getSection } from "../category-tree";
import { EDUCATION_MATHEMATICS_SECTIONS } from "../education/math-sections";
import { ENGINEERING_ELECTRICAL_SECTIONS } from "../engineering/electrical-sections";
import { HEALTH_BODY_METRICS_SECTIONS } from "../health/body-metrics-sections";
import { buildHubSeoDefinition } from "./helpers";

function flattenCalculators(sections: SectionNode[]): SectionCalculatorNode[] {
  const out: SectionCalculatorNode[] = [];
  for (const s of sections) {
    out.push(...s.calculators);
  }
  return out;
}

function financeLoanTypeCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "loan-type-calculators");
  return node?.calculators ?? [];
}

function financeAdvancedPaymentCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "advanced-emi-payment-calculators");
  return node?.calculators ?? [];
}

function financeLoanComparisonCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "loan-comparison-tools");
  return node?.calculators ?? [];
}

function financeCreditDebtCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "credit-debt-calculators");
  return node?.calculators ?? [];
}

export function buildBulkRegistryEntries(existingSlugs: ReadonlySet<string>): CalculatorDefinition[] {
  const out: CalculatorDefinition[] = [];
  const push = (def: CalculatorDefinition) => {
    if (existingSlugs.has(def.slug)) return;
    out.push(def);
  };

  for (const c of flattenCalculators(ENGINEERING_ELECTRICAL_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "engineering",
        subCategorySlug: "electrical",
        vertical: "engineering-electrical",
      }),
    );
  }

  for (const c of flattenCalculators(HEALTH_BODY_METRICS_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "body-metrics",
        vertical: "health-body",
      }),
    );
  }

  for (const sec of EDUCATION_MATHEMATICS_SECTIONS) {
    for (const c of sec.calculators) {
      if (existingSlugs.has(c.slug)) continue;
      push(
        buildHubSeoDefinition({
          slug: c.slug,
          title: c.title,
          category: "education",
          subCategorySlug: "mathematics",
          vertical: "education-math",
        }),
      );
    }
  }

  for (const c of financeLoanTypeCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "loans-emi",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeAdvancedPaymentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "loans-emi",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeLoanComparisonCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "loans-emi",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeCreditDebtCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "loans-emi",
        vertical: "finance-loan",
      }),
    );
  }

  return out;
}

export function bulkSlugSets(existingSlugs: ReadonlySet<string>): {
  electrical: Set<string>;
  healthBody: Set<string>;
  educationMathPlanned: Set<string>;
  financeLoanType: Set<string>;
  financeAdvancedPayment: Set<string>;
  financeLoanComparison: Set<string>;
  financeCreditDebt: Set<string>;
} {
  const electrical = new Set<string>();
  const healthBody = new Set<string>();
  const educationMathPlanned = new Set<string>();
  const financeLoanType = new Set<string>();
  const financeAdvancedPayment = new Set<string>();
  const financeLoanComparison = new Set<string>();
  const financeCreditDebt = new Set<string>();

  for (const c of flattenCalculators(ENGINEERING_ELECTRICAL_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) electrical.add(c.slug);
  }
  for (const c of flattenCalculators(HEALTH_BODY_METRICS_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) healthBody.add(c.slug);
  }
  for (const sec of EDUCATION_MATHEMATICS_SECTIONS) {
    for (const c of sec.calculators) {
      if (!existingSlugs.has(c.slug)) educationMathPlanned.add(c.slug);
    }
  }
  for (const c of financeLoanTypeCalculators()) {
    if (!existingSlugs.has(c.slug)) financeLoanType.add(c.slug);
  }
  for (const c of financeAdvancedPaymentCalculators()) {
    if (!existingSlugs.has(c.slug)) financeAdvancedPayment.add(c.slug);
  }
  for (const c of financeLoanComparisonCalculators()) {
    if (!existingSlugs.has(c.slug)) financeLoanComparison.add(c.slug);
  }
  for (const c of financeCreditDebtCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCreditDebt.add(c.slug);
  }

  return {
    electrical,
    healthBody,
    educationMathPlanned,
    financeLoanType,
    financeAdvancedPayment,
    financeLoanComparison,
    financeCreditDebt,
  };
}
