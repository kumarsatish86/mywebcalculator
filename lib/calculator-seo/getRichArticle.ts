import { FAMILY_SLUG_SETS, getCalculator } from "@/lib/registry";
import { composeRichArticle, verticalForDefinition } from "./composeArticle";
import { ADVANCED_EMI_ARTICLES } from "./advancedEmiContent";
import { LOAN_COMPARISON_ARTICLES } from "./loanComparisonContent";
import { CREDIT_DEBT_ARTICLES } from "./creditDebtContent";
import { PREPAYMENT_FORECLOSURE_ARTICLES } from "./prepaymentForeclosureContent";
import { EMI_SCHEDULE_PLANNING_ARTICLES } from "./emiSchedulePlanningContent";
import { REGION_SPECIFIC_LOAN_ARTICLES } from "./regionSpecificLoanContent";
import { SMART_AI_LOAN_ARTICLES } from "./smartAiLoanContent";
import { LOAN_MICRO_TOOLS_ARTICLES } from "./loanMicroToolsContent";
import { CORE_SALARY_ARTICLES } from "./coreSalaryContent";
import { INDIA_SALARY_ARTICLES } from "./indiaSalaryContent";
import { TAX_DEDUCTION_ARTICLES } from "./taxDeductionContent";
import { BENEFITS_CONTRIBUTIONS_ARTICLES } from "./benefitsContributionsContent";
import { BONUS_INCENTIVE_ARTICLES } from "./bonusIncentiveContent";
import { WORK_TIME_PAY_ARTICLES } from "./workTimePayContent";
import { INTERNATIONAL_SALARY_ARTICLES } from "./internationalSalaryContent";
import { SALARY_COMPARISON_PLANNING_ARTICLES } from "./salaryComparisonPlanningContent";
import { SALARY_FINANCIAL_PLANNING_ARTICLES } from "./salaryFinancialPlanningContent";
import { FREELANCE_GIG_INCOME_ARTICLES } from "./freelanceGigIncomeContent";
import { HR_EMPLOYER_TOOLS_ARTICLES } from "./hrEmployerToolsContent";
import { AI_POWERED_SALARY_ARTICLES } from "./aiPoweredSalaryContent";
import { AI_FINANCE_SMART_ARTICLES } from "./aiFinanceSmartContent";
import { AI_EDUCATION_SMART_ARTICLES } from "./aiEducationSmartContent";
import { AI_HEALTH_SMART_ARTICLES } from "./aiHealthSmartContent";
import { AI_DAILY_LIFE_SMART_ARTICLES } from "./aiDailyLifeSmartContent";
import { AI_BUSINESS_SMART_ARTICLES } from "./aiBusinessSmartContent";
import { AI_DEVELOPER_SMART_ARTICLES } from "./aiDeveloperSmartContent";
import { AI_CONVERSION_SMART_ARTICLES } from "./aiConversionSmartContent";
import { AI_PERSONALIZED_SMART_ARTICLES } from "./aiPersonalizedSmartContent";
import { TIME_DATE_BASIC_ARTICLES } from "./timeDateBasicContent";
import { TIME_DATE_ADVANCED_ARTICLES } from "./timeDateAdvancedContent";
import { TIME_DATE_BUSINESS_ARTICLES } from "./timeDateBusinessContent";
import { TIME_DATE_PERSONAL_ARTICLES } from "./timeDatePersonalContent";
import { TIME_DATE_SPECIALIZED_ARTICLES } from "./timeDateSpecializedContent";
import { TIME_DATE_FUN_ARTICLES } from "./timeDateFunContent";
import { TIME_DATE_SMART_ARTICLES } from "./timeDateSmartContent";
import type { RichArticle } from "./types";

const HAND_CRAFTED_ARTICLES: Record<string, RichArticle> = {
  ...ADVANCED_EMI_ARTICLES,
  ...LOAN_COMPARISON_ARTICLES,
  ...CREDIT_DEBT_ARTICLES,
  ...PREPAYMENT_FORECLOSURE_ARTICLES,
  ...EMI_SCHEDULE_PLANNING_ARTICLES,
  ...REGION_SPECIFIC_LOAN_ARTICLES,
  ...SMART_AI_LOAN_ARTICLES,
  ...LOAN_MICRO_TOOLS_ARTICLES,
  ...CORE_SALARY_ARTICLES,
  ...INDIA_SALARY_ARTICLES,
  ...TAX_DEDUCTION_ARTICLES,
  ...BENEFITS_CONTRIBUTIONS_ARTICLES,
  ...BONUS_INCENTIVE_ARTICLES,
  ...WORK_TIME_PAY_ARTICLES,
  ...INTERNATIONAL_SALARY_ARTICLES,
  ...SALARY_COMPARISON_PLANNING_ARTICLES,
  ...SALARY_FINANCIAL_PLANNING_ARTICLES,
  ...FREELANCE_GIG_INCOME_ARTICLES,
  ...HR_EMPLOYER_TOOLS_ARTICLES,
  ...AI_POWERED_SALARY_ARTICLES,
  ...AI_FINANCE_SMART_ARTICLES,
  ...AI_EDUCATION_SMART_ARTICLES,
  ...AI_HEALTH_SMART_ARTICLES,
  ...AI_DAILY_LIFE_SMART_ARTICLES,
  ...AI_BUSINESS_SMART_ARTICLES,
  ...AI_DEVELOPER_SMART_ARTICLES,
  ...AI_CONVERSION_SMART_ARTICLES,
  ...AI_PERSONALIZED_SMART_ARTICLES,
  ...TIME_DATE_BASIC_ARTICLES,
  ...TIME_DATE_ADVANCED_ARTICLES,
  ...TIME_DATE_BUSINESS_ARTICLES,
  ...TIME_DATE_PERSONAL_ARTICLES,
  ...TIME_DATE_SPECIALIZED_ARTICLES,
  ...TIME_DATE_FUN_ARTICLES,
  ...TIME_DATE_SMART_ARTICLES,
};

export function isBulkFamilySlug(slug: string): boolean {
  return (
    FAMILY_SLUG_SETS.electrical.has(slug) ||
    FAMILY_SLUG_SETS.healthBody.has(slug) ||
    FAMILY_SLUG_SETS.educationMathPlanned.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanType.has(slug) ||
    FAMILY_SLUG_SETS.financeAdvancedPayment.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanComparison.has(slug) ||
    FAMILY_SLUG_SETS.financeCreditDebt.has(slug) ||
    FAMILY_SLUG_SETS.financePrepaymentForeclosure.has(slug) ||
    FAMILY_SLUG_SETS.financeEmiSchedulePlanning.has(slug) ||
    FAMILY_SLUG_SETS.financeRegionSpecific.has(slug) ||
    FAMILY_SLUG_SETS.financeSmartAiLoan.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanMicroTools.has(slug) ||
    FAMILY_SLUG_SETS.financeCoreSalary.has(slug) ||
    FAMILY_SLUG_SETS.financeIndiaSalary.has(slug) ||
    FAMILY_SLUG_SETS.financeTaxDeduction.has(slug) ||
    FAMILY_SLUG_SETS.financeBenefitsContributions.has(slug) ||
    FAMILY_SLUG_SETS.financeBonusIncentive.has(slug) ||
    FAMILY_SLUG_SETS.financeWorkTimePay.has(slug) ||
    FAMILY_SLUG_SETS.financeInternationalSalary.has(slug) ||
    FAMILY_SLUG_SETS.financeSalaryComparisonPlanning.has(slug) ||
    FAMILY_SLUG_SETS.financeSalaryFinancialPlanning.has(slug) ||
    FAMILY_SLUG_SETS.financeFreelanceGigIncome.has(slug) ||
    FAMILY_SLUG_SETS.financeHrEmployerTools.has(slug) ||
    FAMILY_SLUG_SETS.financeAiPoweredSalary.has(slug) ||
    FAMILY_SLUG_SETS.aiFinanceSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiEducationSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiHealthSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiDailyLifeSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiBusinessSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiDeveloperSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiConversionSmart.has(slug) ||
    FAMILY_SLUG_SETS.aiPersonalizedSmart.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateBasic.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateAdvanced.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateBusiness.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDatePersonal.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateSpecialized.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateFun.has(slug) ||
    FAMILY_SLUG_SETS.conversionTimeDateSmart.has(slug)
  );
}

/** All calculator slugs that receive the rich article layer (union of bulk families). */
export function allBulkFamilySlugs(): string[] {
  const out = new Set<string>();
  for (const s of FAMILY_SLUG_SETS.electrical) out.add(s);
  for (const s of FAMILY_SLUG_SETS.healthBody) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationMathPlanned) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanType) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeAdvancedPayment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanComparison) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCreditDebt) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financePrepaymentForeclosure) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeEmiSchedulePlanning) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeRegionSpecific) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeSmartAiLoan) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanMicroTools) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCoreSalary) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeIndiaSalary) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeTaxDeduction) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeBenefitsContributions) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeBonusIncentive) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeWorkTimePay) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeInternationalSalary) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeSalaryComparisonPlanning) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeSalaryFinancialPlanning) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeFreelanceGigIncome) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeHrEmployerTools) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeAiPoweredSalary) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiFinanceSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiEducationSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiHealthSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiDailyLifeSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiBusinessSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiDeveloperSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiConversionSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.aiPersonalizedSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateBasic) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateAdvanced) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateBusiness) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDatePersonal) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateSpecialized) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateFun) out.add(s);
  for (const s of FAMILY_SLUG_SETS.conversionTimeDateSmart) out.add(s);
  return [...out].sort();
}

export function getRichArticle(slug: string): RichArticle | null {
  // Hand-crafted override content takes precedence over generic composition
  if (slug in HAND_CRAFTED_ARTICLES) return HAND_CRAFTED_ARTICLES[slug];
  if (!isBulkFamilySlug(slug)) return null;
  const def = getCalculator(slug);
  if (!def) return null;
  const vertical = verticalForDefinition(def);
  if (!vertical) return null;
  return composeRichArticle(def, vertical);
}
