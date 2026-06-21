import type { CalculatorDefinition } from "../types";
import type { SectionCalculatorNode, SectionNode } from "../hub-section-types";
import { getSection } from "../category-tree";
import { EDUCATION_MATHEMATICS_SECTIONS } from "../education/math-sections";
import { CONVERSION_TIME_DATE_SECTIONS } from "../conversion/time-date-sections";
import { AI_SMART_TOOLS_SECTIONS } from "../ai/smart-tools-sections";
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

function financePrepaymentForeclosureCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "prepayment-foreclosure-tools");
  return node?.calculators ?? [];
}

function financeEmiSchedulePlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "emi-schedule-planning-tools");
  return node?.calculators ?? [];
}

function financeRegionSpecificCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "region-specific-loan-tools");
  return node?.calculators ?? [];
}

function financeSmartAiLoanCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "smart-ai-loan-tools");
  return node?.calculators ?? [];
}

function financeLoanMicroToolsCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "loans-emi", "loan-micro-tools");
  return node?.calculators ?? [];
}

function financeCoreSalaryCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "core-salary-calculators");
  return node?.calculators ?? [];
}

function financeIndiaSalaryCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "india-salary-calculators");
  return node?.calculators ?? [];
}

function aiFinanceSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-finance");
  return sec?.calculators ?? [];
}

function aiEducationSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-education");
  return sec?.calculators ?? [];
}

function aiHealthSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-health-fitness");
  return sec?.calculators ?? [];
}

function aiDailyLifeSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-daily-life");
  return sec?.calculators ?? [];
}

function aiBusinessSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-business-professional");
  return sec?.calculators ?? [];
}

function aiDeveloperSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-developer-tech");
  return sec?.calculators ?? [];
}

function aiConversionSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-conversion-utility");
  return sec?.calculators ?? [];
}

function aiPersonalizedSmartToolsCalculators(): SectionCalculatorNode[] {
  const sec = AI_SMART_TOOLS_SECTIONS.find((s) => s.slug === "aist-personalized-decisions");
  return sec?.calculators ?? [];
}

function conversionTimeDateBasicCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-basic-core");
  return sec?.calculators ?? [];
}

function conversionTimeDateAdvancedCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-advanced");
  return sec?.calculators ?? [];
}

function conversionTimeDateBusinessCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-business-productivity");
  return sec?.calculators ?? [];
}

function conversionTimeDatePersonalCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-personal-events");
  return sec?.calculators ?? [];
}

function conversionTimeDateSpecializedCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-specialized-niche");
  return sec?.calculators ?? [];
}

function conversionTimeDateFunCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-fun-viral");
  return sec?.calculators ?? [];
}

function conversionTimeDateSmartCalculators(): SectionCalculatorNode[] {
  const sec = CONVERSION_TIME_DATE_SECTIONS.find((s) => s.slug === "tdate-super-advanced");
  return sec?.calculators ?? [];
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

  for (const c of financePrepaymentForeclosureCalculators()) {
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

  for (const c of financeEmiSchedulePlanningCalculators()) {
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

  for (const c of financeRegionSpecificCalculators()) {
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

  for (const c of financeSmartAiLoanCalculators()) {
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

  for (const c of financeLoanMicroToolsCalculators()) {
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

  for (const c of financeCoreSalaryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "salary-income",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeIndiaSalaryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "salary-income",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of aiFinanceSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of aiEducationSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "education-math",
      }),
    );
  }

  for (const c of aiHealthSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "health-body",
      }),
    );
  }

  for (const c of aiDailyLifeSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of aiBusinessSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of aiDeveloperSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "engineering-electrical",
      }),
    );
  }

  for (const c of aiConversionSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of aiPersonalizedSmartToolsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "smart-tools",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateBasicCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateAdvancedCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateBusinessCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDatePersonalCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateSpecializedCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateFunCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of conversionTimeDateSmartCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "time-date",
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
  financePrepaymentForeclosure: Set<string>;
  financeEmiSchedulePlanning: Set<string>;
  financeRegionSpecific: Set<string>;
  financeSmartAiLoan: Set<string>;
  financeLoanMicroTools: Set<string>;
  financeCoreSalary: Set<string>;
  financeIndiaSalary: Set<string>;
  aiFinanceSmart: Set<string>;
  aiEducationSmart: Set<string>;
  aiHealthSmart: Set<string>;
  aiDailyLifeSmart: Set<string>;
  aiBusinessSmart: Set<string>;
  aiDeveloperSmart: Set<string>;
  aiConversionSmart: Set<string>;
  aiPersonalizedSmart: Set<string>;
  conversionTimeDateBasic: Set<string>;
  conversionTimeDateAdvanced: Set<string>;
  conversionTimeDateBusiness: Set<string>;
  conversionTimeDatePersonal: Set<string>;
  conversionTimeDateSpecialized: Set<string>;
  conversionTimeDateFun: Set<string>;
  conversionTimeDateSmart: Set<string>;
} {
  const electrical = new Set<string>();
  const healthBody = new Set<string>();
  const educationMathPlanned = new Set<string>();
  const financeLoanType = new Set<string>();
  const financeAdvancedPayment = new Set<string>();
  const financeLoanComparison = new Set<string>();
  const financeCreditDebt = new Set<string>();
  const financePrepaymentForeclosure = new Set<string>();
  const financeEmiSchedulePlanning = new Set<string>();
  const financeRegionSpecific = new Set<string>();
  const financeSmartAiLoan = new Set<string>();
  const financeLoanMicroTools = new Set<string>();
  const financeCoreSalary = new Set<string>();
  const financeIndiaSalary = new Set<string>();
  const aiFinanceSmart = new Set<string>();
  const aiEducationSmart = new Set<string>();
  const aiHealthSmart = new Set<string>();
  const aiDailyLifeSmart = new Set<string>();
  const aiBusinessSmart = new Set<string>();
  const aiDeveloperSmart = new Set<string>();
  const aiConversionSmart = new Set<string>();
  const aiPersonalizedSmart = new Set<string>();
  const conversionTimeDateBasic = new Set<string>();
  const conversionTimeDateAdvanced = new Set<string>();
  const conversionTimeDateBusiness = new Set<string>();
  const conversionTimeDatePersonal = new Set<string>();
  const conversionTimeDateSpecialized = new Set<string>();
  const conversionTimeDateFun = new Set<string>();
  const conversionTimeDateSmart = new Set<string>();

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
  for (const c of financePrepaymentForeclosureCalculators()) {
    if (!existingSlugs.has(c.slug)) financePrepaymentForeclosure.add(c.slug);
  }
  for (const c of financeEmiSchedulePlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) financeEmiSchedulePlanning.add(c.slug);
  }
  for (const c of financeRegionSpecificCalculators()) {
    if (!existingSlugs.has(c.slug)) financeRegionSpecific.add(c.slug);
  }
  for (const c of financeSmartAiLoanCalculators()) {
    if (!existingSlugs.has(c.slug)) financeSmartAiLoan.add(c.slug);
  }
  for (const c of financeLoanMicroToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) financeLoanMicroTools.add(c.slug);
  }
  for (const c of financeCoreSalaryCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCoreSalary.add(c.slug);
  }
  for (const c of financeIndiaSalaryCalculators()) {
    if (!existingSlugs.has(c.slug)) financeIndiaSalary.add(c.slug);
  }
  for (const c of aiFinanceSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiFinanceSmart.add(c.slug);
  }
  for (const c of aiEducationSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiEducationSmart.add(c.slug);
  }
  for (const c of aiHealthSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiHealthSmart.add(c.slug);
  }
  for (const c of aiDailyLifeSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiDailyLifeSmart.add(c.slug);
  }
  for (const c of aiBusinessSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiBusinessSmart.add(c.slug);
  }
  for (const c of aiDeveloperSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiDeveloperSmart.add(c.slug);
  }
  for (const c of aiConversionSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiConversionSmart.add(c.slug);
  }
  for (const c of aiPersonalizedSmartToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) aiPersonalizedSmart.add(c.slug);
  }
  for (const c of conversionTimeDateBasicCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateBasic.add(c.slug);
  }
  for (const c of conversionTimeDateAdvancedCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateAdvanced.add(c.slug);
  }
  for (const c of conversionTimeDateBusinessCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateBusiness.add(c.slug);
  }
  for (const c of conversionTimeDatePersonalCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDatePersonal.add(c.slug);
  }
  for (const c of conversionTimeDateSpecializedCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateSpecialized.add(c.slug);
  }
  for (const c of conversionTimeDateFunCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateFun.add(c.slug);
  }
  for (const c of conversionTimeDateSmartCalculators()) {
    if (!existingSlugs.has(c.slug)) conversionTimeDateSmart.add(c.slug);
  }

  return {
    electrical,
    healthBody,
    educationMathPlanned,
    financeLoanType,
    financeAdvancedPayment,
    financeLoanComparison,
    financeCreditDebt,
    financePrepaymentForeclosure,
    financeEmiSchedulePlanning,
    financeRegionSpecific,
    financeSmartAiLoan,
    financeLoanMicroTools,
    financeCoreSalary,
    financeIndiaSalary,
    aiFinanceSmart,
    aiEducationSmart,
    aiHealthSmart,
    aiDailyLifeSmart,
    aiBusinessSmart,
    aiDeveloperSmart,
    aiConversionSmart,
    aiPersonalizedSmart,
    conversionTimeDateBasic,
    conversionTimeDateAdvanced,
    conversionTimeDateBusiness,
    conversionTimeDatePersonal,
    conversionTimeDateSpecialized,
    conversionTimeDateFun,
    conversionTimeDateSmart,
  };
}
