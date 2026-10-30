import type { CalculatorDefinition } from "../types";
import type { SectionCalculatorNode, SectionNode } from "../hub-section-types";
import { getSection } from "../category-tree";
import { EDUCATION_MATHEMATICS_SECTIONS } from "../education/math-sections";
import { CONVERSION_TIME_DATE_SECTIONS } from "../conversion/time-date-sections";
import { CONVERSION_UNIT_CONVERTERS_SECTIONS } from "../conversion/unit-converters-sections";
import { AI_SMART_TOOLS_SECTIONS } from "../ai/smart-tools-sections";
import { AI_GENERATORS_SECTIONS } from "../ai/generators-sections";
import { ENGINEERING_ELECTRICAL_SECTIONS } from "../engineering/electrical-sections";
import { ENGINEERING_CIVIL_SECTIONS } from "../engineering/civil-sections";
import { ENGINEERING_IT_DEV_SECTIONS } from "../engineering/it-dev-sections";
import { DAILY_HOME_UTILITY_SECTIONS } from "../daily/home-utility-sections";
import { DAILY_SHOPPING_DISCOUNT_SECTIONS } from "../daily/shopping-discount-sections";
import { DAILY_TRAVEL_SECTIONS } from "../daily/travel-sections";
import { CONVERSION_CURRENCY_SECTIONS } from "../conversion/currency-sections";
import { BUSINESS_FINANCE_SECTIONS } from "../business/business-finance-sections";
import { BUSINESS_MARKETING_SECTIONS } from "../business/marketing-sections";
import { BUSINESS_HR_PRODUCTIVITY_SECTIONS } from "../business/hr-productivity-sections";
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

function financeTaxDeductionCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "tax-deduction-calculators");
  return node?.calculators ?? [];
}

function financeBenefitsContributionsCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "benefits-contributions");
  return node?.calculators ?? [];
}

function financeBonusIncentiveCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "bonus-incentive-calculators");
  return node?.calculators ?? [];
}

function financeWorkTimePayCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "work-time-pay-calculators");
  return node?.calculators ?? [];
}

function financeInternationalSalaryCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "international-salary-calculators");
  return node?.calculators ?? [];
}

function financeSalaryComparisonPlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "salary-comparison-planning-calculators");
  return node?.calculators ?? [];
}

function financeSalaryFinancialPlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "salary-financial-planning");
  return node?.calculators ?? [];
}

function financeFreelanceGigIncomeCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "freelancer-gig-income-calculators");
  return node?.calculators ?? [];
}

function financeHrEmployerToolsCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "hr-employer-tools");
  return node?.calculators ?? [];
}

function financeAiPoweredSalaryCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "salary-income", "ai-powered-salary-tools");
  return node?.calculators ?? [];
}

/** Core investment hub; skips simple-interest (owned by loan micro tools). */
function financeCoreInvestmentCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "core-investment-calculators");
  return (node?.calculators ?? []).filter((c) => c.slug !== "simple-interest-calculator");
}

function financeMutualFundCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "mutual-fund-calculators");
  return node?.calculators ?? [];
}

function financeFixedIncomeSafeCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "fixed-income-safe-investment");
  return node?.calculators ?? [];
}

function financeStockMarketCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "stock-market-calculators");
  return node?.calculators ?? [];
}

function financeRetirementPlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "retirement-financial-planning");
  return node?.calculators ?? [];
}

function financeGoalBasedInvestmentCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "goal-based-investment-calculators");
  return node?.calculators ?? [];
}

function financeRiskPortfolioAnalysisCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "risk-portfolio-analysis");
  return node?.calculators ?? [];
}

function financeTaxRealReturnCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "tax-real-return-calculators");
  return node?.calculators ?? [];
}

function financeAdvancedProInvestmentCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "advanced-pro-investment-calculators");
  return node?.calculators ?? [];
}

function financeCryptoAlternativeInvestmentCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "investment-wealth", "crypto-alternative-investment");
  return node?.calculators ?? [];
}

function financeDepositSavingsCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "deposit-savings-calculators");
  return node?.calculators ?? [];
}

function financeCreditCardBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "credit-card-calculators");
  return node?.calculators ?? [];
}

function financeLoanCreditBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "loan-credit-calculators");
  return node?.calculators ?? [];
}

function financeCreditScoreHealthCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "credit-score-health-calculators");
  return node?.calculators ?? [];
}

function financeBankingChargesFeesCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "banking-charges-fees-calculators");
  return node?.calculators ?? [];
}

function financeInvestmentLinkedBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "investment-linked-banking-tools");
  return node?.calculators ?? [];
}

function financeInterestRateConversionCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "interest-rate-conversion-tools");
  return node?.calculators ?? [];
}

function financeBusinessCorporateBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "business-corporate-banking-calculators");
  return node?.calculators ?? [];
}

function financeMortgagePropertyCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "mortgage-property-financing");
  return node?.calculators ?? [];
}

function financeAdvancedViralBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "advanced-viral-calculators");
  return node?.calculators ?? [];
}

function financeIndiaSpecificBankingCalculators(): SectionCalculatorNode[] {
  const node = getSection("finance", "banking-credit", "india-specific-banking-calculators");
  return node?.calculators ?? [];
}

function educationExamViralMicroCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-viral-micro-tools");
  return node?.calculators ?? [];
}

function educationExamAiSmartCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-ai-smart-tools");
  return node?.calculators ?? [];
}

function educationExamInternationalCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-international");
  return node?.calculators ?? [];
}

function educationExamScholarshipCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-scholarship-eligibility");
  return node?.calculators ?? [];
}

function educationExamAcademicPlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-academic-planning");
  return node?.calculators ?? [];
}

function educationPhysicsKinematicsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-kinematics");
  return node?.calculators ?? [];
}

function educationPhysicsDynamicsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-dynamics");
  return node?.calculators ?? [];
}

function educationPhysicsWorkEnergyPowerCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-work-energy-power");
  return node?.calculators ?? [];
}

function educationPhysicsRotationalCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-rotational-motion");
  return node?.calculators ?? [];
}

function educationPhysicsGravitationCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-gravitation");
  return node?.calculators ?? [];
}

function educationChemistryStoichiometryCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-stoichiometry");
  return node?.calculators ?? [];
}

function educationChemistrySolutionsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-solutions-concentration");
  return node?.calculators ?? [];
}

function educationChemistryGasLawsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-gas-laws");
  return node?.calculators ?? [];
}

function educationChemistryThermoCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-thermodynamics");
  return node?.calculators ?? [];
}

function educationChemistryBasicCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-basic");
  return node?.calculators ?? [];
}

function educationPhysicsOpticsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-optics");
  return node?.calculators ?? [];
}

function educationPhysicsModernCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-modern");
  return node?.calculators ?? [];
}

function educationPhysicsAdvancedCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-advanced-competitive");
  return node?.calculators ?? [];
}

function educationBiologyPlantsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-plants");
  return node?.calculators ?? [];
}

function educationBiologyBiochemistryCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-biochemistry");
  return node?.calculators ?? [];
}

function educationBiologyMicrobiologyCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-microbiology-cell");
  return node?.calculators ?? [];
}

function educationBiologyGeneticsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-genetics-heredity");
  return node?.calculators ?? [];
}

function educationBiologyPregnancyCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-pregnancy-reproductive");
  return node?.calculators ?? [];
}

function educationBiologyHumanBodyCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-human-body-health");
  return node?.calculators ?? [];
}

function educationBiologyNutritionCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-nutrition-diet");
  return node?.calculators ?? [];
}

function educationBiologyEcologyCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-ecology-environment");
  return node?.calculators ?? [];
}

function educationBiologyNeuroscienceCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-neuroscience-psychology");
  return node?.calculators ?? [];
}

function educationBiologyLabResearchCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-lab-research");
  return node?.calculators ?? [];
}

function educationBiologyMolecularCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-molecular");
  return node?.calculators ?? [];
}

function educationBiologyStudentCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-student-educational");
  return node?.calculators ?? [];
}

function educationBiologyAiBonusCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "biology-ai-bonus");
  return node?.calculators ?? [];
}

function healthMedicalClinicalRiskCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "clinical-risk-scores");
  return node?.calculators ?? [];
}

function healthMedicalLifestyleCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "lifestyle-habits");
  return node?.calculators ?? [];
}

function healthMedicalGeriatricsCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "geriatrics-aging");
  return node?.calculators ?? [];
}

function healthMedicalOrthopedicCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "orthopedic");
  return node?.calculators ?? [];
}

function healthMedicalOncologyCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "oncology-risk");
  return node?.calculators ?? [];
}

function healthMedicalRespiratoryCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "respiratory");
  return node?.calculators ?? [];
}

function healthMedicalEmergencyCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "emergency-critical-care");
  return node?.calculators ?? [];
}

function healthMedicalNeurologyCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "neurology-mental-health");
  return node?.calculators ?? [];
}

function healthMedicalBodyMetricsCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "medical-body-metrics");
  return node?.calculators ?? [];
}

function healthMedicalNutritionMedCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "medical-nutrition");
  return node?.calculators ?? [];
}

function healthMedicalHeartCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "heart-cardiovascular");
  return node?.calculators ?? [];
}

function healthMedicalDiabetesCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "diabetes-glucose");
  return node?.calculators ?? [];
}

function healthMedicalPregnancyCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "pregnancy-womens-health");
  return node?.calculators ?? [];
}

function healthMedicalPediatricsCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "pediatrics-child-health");
  return node?.calculators ?? [];
}

function healthMedicalDrugDosageCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "drug-dosage-pharmacology");
  return node?.calculators ?? [];
}

function healthMedicalLabValuesCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "medical", "lab-values-clinical");
  return node?.calculators ?? [];
}

function healthDietCalorieEnergyCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "calorie-energy");
  return node?.calculators ?? [];
}
function healthDietMacrosCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "macronutrients");
  return node?.calculators ?? [];
}
function healthDietWeightMgmtCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "weight-management-diet");
  return node?.calculators ?? [];
}
function healthDietHydrationCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "hydration-water");
  return node?.calculators ?? [];
}
function healthDietMealPlanningCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "meal-diet-planning");
  return node?.calculators ?? [];
}
function healthDietTrendsCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "diet-specific-trends");
  return node?.calculators ?? [];
}
function healthDietMicrosCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "micronutrients");
  return node?.calculators ?? [];
}
function healthDietFitnessCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "fitness-nutrition");
  return node?.calculators ?? [];
}
function healthDietConditionCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "condition-specific-diets");
  return node?.calculators ?? [];
}
function healthDietAgeGenderCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "age-gender-nutrition");
  return node?.calculators ?? [];
}
function healthDietFoodBasedCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "food-based-calories");
  return node?.calculators ?? [];
}
function healthDietAiAdvancedCalculators(): SectionCalculatorNode[] {
  const node = getSection("health", "diet-nutrition", "advanced-ai-nutrition");
  return node?.calculators ?? [];
}

function pushHealthDietSeo(
  push: (d: CalculatorDefinition) => void,
  calculators: SectionCalculatorNode[],
) {
  for (const c of calculators) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "diet-nutrition",
        vertical: "health-body",
      }),
    );
  }
}

function educationChemistryBonusMicroCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-bonus-micro");
  return node?.calculators ?? [];
}

function educationChemistryAiSmartCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-ai-smart");
  return node?.calculators ?? [];
}

function educationChemistryIndustrialCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-industrial");
  return node?.calculators ?? [];
}

function educationChemistryAnalyticalCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-analytical");
  return node?.calculators ?? [];
}

function educationChemistryKineticsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-kinetics");
  return node?.calculators ?? [];
}

function educationChemistryNuclearCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-nuclear");
  return node?.calculators ?? [];
}

function educationChemistrySolidStateCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-solid-state");
  return node?.calculators ?? [];
}

function educationChemistryPhAcidBaseCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-ph-acid-base");
  return node?.calculators ?? [];
}

function educationChemistryOrganicCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-organic");
  return node?.calculators ?? [];
}

function educationChemistryElectrochemistryCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-electrochemistry");
  return node?.calculators ?? [];
}

function educationChemistryEquilibriumCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "chemistry-equilibrium");
  return node?.calculators ?? [];
}

function educationPhysicsFluidsSolidsCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-fluids-solids");
  return node?.calculators ?? [];
}

function educationPhysicsThermoHeatCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-thermodynamics-heat");
  return node?.calculators ?? [];
}

function educationPhysicsElectricityCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-electricity");
  return node?.calculators ?? [];
}

function educationPhysicsMagnetismCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-magnetism");
  return node?.calculators ?? [];
}

function educationPhysicsWavesSoundCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "science", "physics-waves-sound");
  return node?.calculators ?? [];
}

function educationExamBasicScoreCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-basic-score-percentage");
  return node?.calculators ?? [];
}

function educationExamTargetScoreCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-target-score");
  return node?.calculators ?? [];
}

function educationExamGpaCgpaCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-gpa-cgpa");
  return node?.calculators ?? [];
}

function educationExamStrategyCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-strategy");
  return node?.calculators ?? [];
}

function educationExamPerformanceCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-performance-analysis");
  return node?.calculators ?? [];
}

function educationExamCompetitiveCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-competitive-exams");
  return node?.calculators ?? [];
}

function educationExamSchoolCollegeCalculators(): SectionCalculatorNode[] {
  const node = getSection("education", "exam-score", "exam-school-college-specific");
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

  for (const c of flattenCalculators(ENGINEERING_CIVIL_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "engineering",
        subCategorySlug: "civil",
        vertical: "engineering-electrical",
      }),
    );
  }

  for (const c of flattenCalculators(ENGINEERING_IT_DEV_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "engineering",
        subCategorySlug: "it-dev",
        vertical: "engineering-electrical",
      }),
    );
  }

  for (const c of flattenCalculators(DAILY_HOME_UTILITY_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "daily",
        subCategorySlug: "home-utility",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(DAILY_SHOPPING_DISCOUNT_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "daily",
        subCategorySlug: "shopping-discount",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(DAILY_TRAVEL_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "daily",
        subCategorySlug: "travel",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(CONVERSION_UNIT_CONVERTERS_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "unit-converters",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(CONVERSION_CURRENCY_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "conversion",
        subCategorySlug: "currency",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(BUSINESS_FINANCE_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "business",
        subCategorySlug: "business-finance",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(BUSINESS_MARKETING_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "business",
        subCategorySlug: "marketing",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(BUSINESS_HR_PRODUCTIVITY_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "business",
        subCategorySlug: "hr-productivity",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of flattenCalculators(AI_GENERATORS_SECTIONS)) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "ai",
        subCategorySlug: "generators",
        vertical: "finance-loan",
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

  for (const c of healthMedicalClinicalRiskCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalLifestyleCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalGeriatricsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalOrthopedicCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalOncologyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalRespiratoryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalEmergencyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalNeurologyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalBodyMetricsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalNutritionMedCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalHeartCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalDiabetesCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalPregnancyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalPediatricsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalDrugDosageCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }
  for (const c of healthMedicalLabValuesCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "health",
        subCategorySlug: "medical",
        vertical: "health-body",
      }),
    );
  }

  pushHealthDietSeo(push, healthDietCalorieEnergyCalculators());
  pushHealthDietSeo(push, healthDietMacrosCalculators());
  pushHealthDietSeo(push, healthDietWeightMgmtCalculators());
  pushHealthDietSeo(push, healthDietHydrationCalculators());
  pushHealthDietSeo(push, healthDietMealPlanningCalculators());
  pushHealthDietSeo(push, healthDietTrendsCalculators());
  pushHealthDietSeo(push, healthDietMicrosCalculators());
  pushHealthDietSeo(push, healthDietFitnessCalculators());
  pushHealthDietSeo(push, healthDietConditionCalculators());
  pushHealthDietSeo(push, healthDietAgeGenderCalculators());
  pushHealthDietSeo(push, healthDietFoodBasedCalculators());
  pushHealthDietSeo(push, healthDietAiAdvancedCalculators());

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

  for (const c of financeTaxDeductionCalculators()) {
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

  for (const c of financeBenefitsContributionsCalculators()) {
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

  for (const c of financeBonusIncentiveCalculators()) {
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

  for (const c of financeWorkTimePayCalculators()) {
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

  for (const c of financeInternationalSalaryCalculators()) {
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

  for (const c of financeSalaryComparisonPlanningCalculators()) {
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

  for (const c of financeSalaryFinancialPlanningCalculators()) {
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

  for (const c of financeFreelanceGigIncomeCalculators()) {
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

  for (const c of financeHrEmployerToolsCalculators()) {
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

  for (const c of financeAiPoweredSalaryCalculators()) {
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

  for (const c of financeCoreInvestmentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeMutualFundCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeFixedIncomeSafeCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeStockMarketCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeRetirementPlanningCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeGoalBasedInvestmentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeRiskPortfolioAnalysisCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeTaxRealReturnCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeAdvancedProInvestmentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeCryptoAlternativeInvestmentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "investment-wealth",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeDepositSavingsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeCreditCardBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeLoanCreditBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeCreditScoreHealthCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeBankingChargesFeesCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeInvestmentLinkedBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeInterestRateConversionCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeBusinessCorporateBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeMortgagePropertyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeAdvancedViralBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of financeIndiaSpecificBankingCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "finance",
        subCategorySlug: "banking-credit",
        vertical: "finance-loan",
      }),
    );
  }

  for (const c of educationExamViralMicroCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamAiSmartCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamInternationalCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamScholarshipCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamAcademicPlanningCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsKinematicsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsDynamicsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsWorkEnergyPowerCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsRotationalCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsGravitationCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryStoichiometryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistrySolutionsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryGasLawsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryThermoCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryBasicCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsOpticsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsModernCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsAdvancedCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyPlantsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyBiochemistryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyMicrobiologyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyGeneticsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyPregnancyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyHumanBodyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyNutritionCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyEcologyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyNeuroscienceCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyLabResearchCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyMolecularCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyStudentCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationBiologyAiBonusCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryBonusMicroCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryAiSmartCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryIndustrialCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryAnalyticalCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryKineticsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryNuclearCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistrySolidStateCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryPhAcidBaseCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryOrganicCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryElectrochemistryCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationChemistryEquilibriumCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsFluidsSolidsCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsThermoHeatCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsElectricityCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsMagnetismCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationPhysicsWavesSoundCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "science",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamBasicScoreCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamTargetScoreCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamGpaCgpaCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamStrategyCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamPerformanceCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamCompetitiveCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
      }),
    );
  }

  for (const c of educationExamSchoolCollegeCalculators()) {
    push(
      buildHubSeoDefinition({
        slug: c.slug,
        title: c.title,
        category: "education",
        subCategorySlug: "exam-score",
        vertical: "education-math",
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
  engineeringCivil: Set<string>;
  engineeringItDev: Set<string>;
  dailyHomeUtility: Set<string>;
  dailyShoppingDiscount: Set<string>;
  dailyTravel: Set<string>;
  conversionUnitConverters: Set<string>;
  conversionCurrency: Set<string>;
  businessFinance: Set<string>;
  businessMarketing: Set<string>;
  businessHrProductivity: Set<string>;
  aiGenerators: Set<string>;
  healthBody: Set<string>;
  healthMedicalClinicalRisk: Set<string>;
  healthMedicalLifestyle: Set<string>;
  healthMedicalGeriatrics: Set<string>;
  healthMedicalOrthopedic: Set<string>;
  healthMedicalOncology: Set<string>;
  healthMedicalRespiratory: Set<string>;
  healthMedicalEmergency: Set<string>;
  healthMedicalNeurology: Set<string>;
  healthMedicalBodyMetrics: Set<string>;
  healthMedicalNutritionMed: Set<string>;
  healthMedicalHeart: Set<string>;
  healthMedicalDiabetes: Set<string>;
  healthMedicalPregnancy: Set<string>;
  healthMedicalPediatrics: Set<string>;
  healthMedicalDrugDosage: Set<string>;
  healthMedicalLabValues: Set<string>;
  healthDietCalorieEnergy: Set<string>;
  healthDietMacros: Set<string>;
  healthDietWeightMgmt: Set<string>;
  healthDietHydration: Set<string>;
  healthDietMealPlanning: Set<string>;
  healthDietTrends: Set<string>;
  healthDietMicros: Set<string>;
  healthDietFitness: Set<string>;
  healthDietCondition: Set<string>;
  healthDietAgeGender: Set<string>;
  healthDietFoodBased: Set<string>;
  healthDietAiAdvanced: Set<string>;
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
  financeTaxDeduction: Set<string>;
  financeBenefitsContributions: Set<string>;
  financeBonusIncentive: Set<string>;
  financeWorkTimePay: Set<string>;
  financeInternationalSalary: Set<string>;
  financeSalaryComparisonPlanning: Set<string>;
  financeSalaryFinancialPlanning: Set<string>;
  financeFreelanceGigIncome: Set<string>;
  financeHrEmployerTools: Set<string>;
  financeAiPoweredSalary: Set<string>;
  financeCoreInvestment: Set<string>;
  financeMutualFund: Set<string>;
  financeFixedIncomeSafe: Set<string>;
  financeStockMarket: Set<string>;
  financeRetirementPlanning: Set<string>;
  financeGoalBasedInvestment: Set<string>;
  financeRiskPortfolioAnalysis: Set<string>;
  financeTaxRealReturn: Set<string>;
  financeAdvancedProInvestment: Set<string>;
  financeCryptoAlternativeInvestment: Set<string>;
  financeDepositSavings: Set<string>;
  financeCreditCardBanking: Set<string>;
  financeLoanCreditBanking: Set<string>;
  financeCreditScoreHealth: Set<string>;
  financeBankingChargesFees: Set<string>;
  financeInvestmentLinkedBanking: Set<string>;
  financeInterestRateConversion: Set<string>;
  financeBusinessCorporateBanking: Set<string>;
  financeMortgageProperty: Set<string>;
  financeAdvancedViralBanking: Set<string>;
  financeIndiaSpecificBanking: Set<string>;
  educationExamViralMicro: Set<string>;
  educationExamAiSmart: Set<string>;
  educationExamInternational: Set<string>;
  educationExamScholarship: Set<string>;
  educationExamAcademicPlanning: Set<string>;
  educationPhysicsKinematics: Set<string>;
  educationPhysicsDynamics: Set<string>;
  educationPhysicsWorkEnergyPower: Set<string>;
  educationPhysicsRotational: Set<string>;
  educationPhysicsGravitation: Set<string>;
  educationChemistryStoichiometry: Set<string>;
  educationChemistrySolutions: Set<string>;
  educationChemistryGasLaws: Set<string>;
  educationChemistryThermo: Set<string>;
  educationChemistryBasic: Set<string>;
  educationPhysicsOptics: Set<string>;
  educationPhysicsModern: Set<string>;
  educationPhysicsAdvanced: Set<string>;
  educationBiologyPlants: Set<string>;
  educationBiologyBiochemistry: Set<string>;
  educationBiologyMicrobiology: Set<string>;
  educationBiologyGenetics: Set<string>;
  educationBiologyPregnancy: Set<string>;
  educationBiologyHumanBody: Set<string>;
  educationBiologyNutrition: Set<string>;
  educationBiologyEcology: Set<string>;
  educationBiologyNeuroscience: Set<string>;
  educationBiologyLabResearch: Set<string>;
  educationBiologyMolecular: Set<string>;
  educationBiologyStudent: Set<string>;
  educationBiologyAiBonus: Set<string>;
  educationChemistryBonusMicro: Set<string>;
  educationChemistryAiSmart: Set<string>;
  educationChemistryIndustrial: Set<string>;
  educationChemistryAnalytical: Set<string>;
  educationChemistryKinetics: Set<string>;
  educationChemistryNuclear: Set<string>;
  educationChemistrySolidState: Set<string>;
  educationChemistryPhAcidBase: Set<string>;
  educationChemistryOrganic: Set<string>;
  educationChemistryElectrochemistry: Set<string>;
  educationChemistryEquilibrium: Set<string>;
  educationPhysicsFluidsSolids: Set<string>;
  educationPhysicsThermoHeat: Set<string>;
  educationPhysicsElectricity: Set<string>;
  educationPhysicsMagnetism: Set<string>;
  educationPhysicsWavesSound: Set<string>;
  educationExamBasicScore: Set<string>;
  educationExamTargetScore: Set<string>;
  educationExamGpaCgpa: Set<string>;
  educationExamStrategy: Set<string>;
  educationExamPerformance: Set<string>;
  educationExamCompetitive: Set<string>;
  educationExamSchoolCollege: Set<string>;
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
  const engineeringCivil = new Set<string>();
  const engineeringItDev = new Set<string>();
  const dailyHomeUtility = new Set<string>();
  const dailyShoppingDiscount = new Set<string>();
  const dailyTravel = new Set<string>();
  const conversionUnitConverters = new Set<string>();
  const conversionCurrency = new Set<string>();
  const businessFinance = new Set<string>();
  const businessMarketing = new Set<string>();
  const businessHrProductivity = new Set<string>();
  const aiGenerators = new Set<string>();
  const healthBody = new Set<string>();
  const healthMedicalClinicalRisk = new Set<string>();
  const healthMedicalLifestyle = new Set<string>();
  const healthMedicalGeriatrics = new Set<string>();
  const healthMedicalOrthopedic = new Set<string>();
  const healthMedicalOncology = new Set<string>();
  const healthMedicalRespiratory = new Set<string>();
  const healthMedicalEmergency = new Set<string>();
  const healthMedicalNeurology = new Set<string>();
  const healthMedicalBodyMetrics = new Set<string>();
  const healthMedicalNutritionMed = new Set<string>();
  const healthMedicalHeart = new Set<string>();
  const healthMedicalDiabetes = new Set<string>();
  const healthMedicalPregnancy = new Set<string>();
  const healthMedicalPediatrics = new Set<string>();
  const healthMedicalDrugDosage = new Set<string>();
  const healthMedicalLabValues = new Set<string>();
  const healthDietCalorieEnergy = new Set<string>();
  const healthDietMacros = new Set<string>();
  const healthDietWeightMgmt = new Set<string>();
  const healthDietHydration = new Set<string>();
  const healthDietMealPlanning = new Set<string>();
  const healthDietTrends = new Set<string>();
  const healthDietMicros = new Set<string>();
  const healthDietFitness = new Set<string>();
  const healthDietCondition = new Set<string>();
  const healthDietAgeGender = new Set<string>();
  const healthDietFoodBased = new Set<string>();
  const healthDietAiAdvanced = new Set<string>();
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
  const financeTaxDeduction = new Set<string>();
  const financeBenefitsContributions = new Set<string>();
  const financeBonusIncentive = new Set<string>();
  const financeWorkTimePay = new Set<string>();
  const financeInternationalSalary = new Set<string>();
  const financeSalaryComparisonPlanning = new Set<string>();
  const financeSalaryFinancialPlanning = new Set<string>();
  const financeFreelanceGigIncome = new Set<string>();
  const financeHrEmployerTools = new Set<string>();
  const financeAiPoweredSalary = new Set<string>();
  const financeCoreInvestment = new Set<string>();
  const financeMutualFund = new Set<string>();
  const financeFixedIncomeSafe = new Set<string>();
  const financeStockMarket = new Set<string>();
  const financeRetirementPlanning = new Set<string>();
  const financeGoalBasedInvestment = new Set<string>();
  const financeRiskPortfolioAnalysis = new Set<string>();
  const financeTaxRealReturn = new Set<string>();
  const financeAdvancedProInvestment = new Set<string>();
  const financeCryptoAlternativeInvestment = new Set<string>();
  const financeDepositSavings = new Set<string>();
  const financeCreditCardBanking = new Set<string>();
  const financeLoanCreditBanking = new Set<string>();
  const financeCreditScoreHealth = new Set<string>();
  const financeBankingChargesFees = new Set<string>();
  const financeInvestmentLinkedBanking = new Set<string>();
  const financeInterestRateConversion = new Set<string>();
  const financeBusinessCorporateBanking = new Set<string>();
  const financeMortgageProperty = new Set<string>();
  const financeAdvancedViralBanking = new Set<string>();
  const financeIndiaSpecificBanking = new Set<string>();
  const educationExamViralMicro = new Set<string>();
  const educationExamAiSmart = new Set<string>();
  const educationExamInternational = new Set<string>();
  const educationExamScholarship = new Set<string>();
  const educationExamAcademicPlanning = new Set<string>();
  const educationPhysicsKinematics = new Set<string>();
  const educationPhysicsDynamics = new Set<string>();
  const educationPhysicsWorkEnergyPower = new Set<string>();
  const educationPhysicsRotational = new Set<string>();
  const educationPhysicsGravitation = new Set<string>();
  const educationChemistryStoichiometry = new Set<string>();
  const educationChemistrySolutions = new Set<string>();
  const educationChemistryGasLaws = new Set<string>();
  const educationChemistryThermo = new Set<string>();
  const educationChemistryBasic = new Set<string>();
  const educationPhysicsOptics = new Set<string>();
  const educationPhysicsModern = new Set<string>();
  const educationPhysicsAdvanced = new Set<string>();
  const educationBiologyPlants = new Set<string>();
  const educationBiologyBiochemistry = new Set<string>();
  const educationBiologyMicrobiology = new Set<string>();
  const educationBiologyGenetics = new Set<string>();
  const educationBiologyPregnancy = new Set<string>();
  const educationBiologyHumanBody = new Set<string>();
  const educationBiologyNutrition = new Set<string>();
  const educationBiologyEcology = new Set<string>();
  const educationBiologyNeuroscience = new Set<string>();
  const educationBiologyLabResearch = new Set<string>();
  const educationBiologyMolecular = new Set<string>();
  const educationBiologyStudent = new Set<string>();
  const educationBiologyAiBonus = new Set<string>();
  const educationChemistryBonusMicro = new Set<string>();
  const educationChemistryAiSmart = new Set<string>();
  const educationChemistryIndustrial = new Set<string>();
  const educationChemistryAnalytical = new Set<string>();
  const educationChemistryKinetics = new Set<string>();
  const educationChemistryNuclear = new Set<string>();
  const educationChemistrySolidState = new Set<string>();
  const educationChemistryPhAcidBase = new Set<string>();
  const educationChemistryOrganic = new Set<string>();
  const educationChemistryElectrochemistry = new Set<string>();
  const educationChemistryEquilibrium = new Set<string>();
  const educationPhysicsFluidsSolids = new Set<string>();
  const educationPhysicsThermoHeat = new Set<string>();
  const educationPhysicsElectricity = new Set<string>();
  const educationPhysicsMagnetism = new Set<string>();
  const educationPhysicsWavesSound = new Set<string>();
  const educationExamBasicScore = new Set<string>();
  const educationExamTargetScore = new Set<string>();
  const educationExamGpaCgpa = new Set<string>();
  const educationExamStrategy = new Set<string>();
  const educationExamPerformance = new Set<string>();
  const educationExamCompetitive = new Set<string>();
  const educationExamSchoolCollege = new Set<string>();
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
  for (const c of flattenCalculators(ENGINEERING_CIVIL_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) engineeringCivil.add(c.slug);
  }
  for (const c of flattenCalculators(ENGINEERING_IT_DEV_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) engineeringItDev.add(c.slug);
  }
  for (const c of flattenCalculators(DAILY_HOME_UTILITY_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) dailyHomeUtility.add(c.slug);
  }
  for (const c of flattenCalculators(DAILY_SHOPPING_DISCOUNT_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) dailyShoppingDiscount.add(c.slug);
  }
  for (const c of flattenCalculators(DAILY_TRAVEL_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) dailyTravel.add(c.slug);
  }
  for (const c of flattenCalculators(CONVERSION_UNIT_CONVERTERS_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) conversionUnitConverters.add(c.slug);
  }
  for (const c of flattenCalculators(CONVERSION_CURRENCY_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) conversionCurrency.add(c.slug);
  }
  for (const c of flattenCalculators(BUSINESS_FINANCE_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) businessFinance.add(c.slug);
  }
  for (const c of flattenCalculators(BUSINESS_MARKETING_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) businessMarketing.add(c.slug);
  }
  for (const c of flattenCalculators(BUSINESS_HR_PRODUCTIVITY_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) businessHrProductivity.add(c.slug);
  }
  for (const c of flattenCalculators(AI_GENERATORS_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) aiGenerators.add(c.slug);
  }
  for (const c of flattenCalculators(HEALTH_BODY_METRICS_SECTIONS)) {
    if (!existingSlugs.has(c.slug)) healthBody.add(c.slug);
  }
  for (const c of healthMedicalClinicalRiskCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalClinicalRisk.add(c.slug);
  }
  for (const c of healthMedicalLifestyleCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalLifestyle.add(c.slug);
  }
  for (const c of healthMedicalGeriatricsCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalGeriatrics.add(c.slug);
  }
  for (const c of healthMedicalOrthopedicCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalOrthopedic.add(c.slug);
  }
  for (const c of healthMedicalOncologyCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalOncology.add(c.slug);
  }
  for (const c of healthMedicalRespiratoryCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalRespiratory.add(c.slug);
  }
  for (const c of healthMedicalEmergencyCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalEmergency.add(c.slug);
  }
  for (const c of healthMedicalNeurologyCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalNeurology.add(c.slug);
  }
  for (const c of healthMedicalBodyMetricsCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalBodyMetrics.add(c.slug);
  }
  for (const c of healthMedicalNutritionMedCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalNutritionMed.add(c.slug);
  }
  for (const c of healthMedicalHeartCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalHeart.add(c.slug);
  }
  for (const c of healthMedicalDiabetesCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalDiabetes.add(c.slug);
  }
  for (const c of healthMedicalPregnancyCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalPregnancy.add(c.slug);
  }
  for (const c of healthMedicalPediatricsCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalPediatrics.add(c.slug);
  }
  for (const c of healthMedicalDrugDosageCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalDrugDosage.add(c.slug);
  }
  for (const c of healthMedicalLabValuesCalculators()) {
    if (!existingSlugs.has(c.slug)) healthMedicalLabValues.add(c.slug);
  }
  for (const c of healthDietCalorieEnergyCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietCalorieEnergy.add(c.slug);
  }
  for (const c of healthDietMacrosCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietMacros.add(c.slug);
  }
  for (const c of healthDietWeightMgmtCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietWeightMgmt.add(c.slug);
  }
  for (const c of healthDietHydrationCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietHydration.add(c.slug);
  }
  for (const c of healthDietMealPlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietMealPlanning.add(c.slug);
  }
  for (const c of healthDietTrendsCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietTrends.add(c.slug);
  }
  for (const c of healthDietMicrosCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietMicros.add(c.slug);
  }
  for (const c of healthDietFitnessCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietFitness.add(c.slug);
  }
  for (const c of healthDietConditionCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietCondition.add(c.slug);
  }
  for (const c of healthDietAgeGenderCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietAgeGender.add(c.slug);
  }
  for (const c of healthDietFoodBasedCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietFoodBased.add(c.slug);
  }
  for (const c of healthDietAiAdvancedCalculators()) {
    if (!existingSlugs.has(c.slug)) healthDietAiAdvanced.add(c.slug);
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
  for (const c of financeTaxDeductionCalculators()) {
    if (!existingSlugs.has(c.slug)) financeTaxDeduction.add(c.slug);
  }
  for (const c of financeBenefitsContributionsCalculators()) {
    if (!existingSlugs.has(c.slug)) financeBenefitsContributions.add(c.slug);
  }
  for (const c of financeBonusIncentiveCalculators()) {
    if (!existingSlugs.has(c.slug)) financeBonusIncentive.add(c.slug);
  }
  for (const c of financeWorkTimePayCalculators()) {
    if (!existingSlugs.has(c.slug)) financeWorkTimePay.add(c.slug);
  }
  for (const c of financeInternationalSalaryCalculators()) {
    if (!existingSlugs.has(c.slug)) financeInternationalSalary.add(c.slug);
  }
  for (const c of financeSalaryComparisonPlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) financeSalaryComparisonPlanning.add(c.slug);
  }
  for (const c of financeSalaryFinancialPlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) financeSalaryFinancialPlanning.add(c.slug);
  }
  for (const c of financeFreelanceGigIncomeCalculators()) {
    if (!existingSlugs.has(c.slug)) financeFreelanceGigIncome.add(c.slug);
  }
  for (const c of financeHrEmployerToolsCalculators()) {
    if (!existingSlugs.has(c.slug)) financeHrEmployerTools.add(c.slug);
  }
  for (const c of financeAiPoweredSalaryCalculators()) {
    if (!existingSlugs.has(c.slug)) financeAiPoweredSalary.add(c.slug);
  }
  for (const c of financeCoreInvestmentCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCoreInvestment.add(c.slug);
  }
  for (const c of financeMutualFundCalculators()) {
    if (!existingSlugs.has(c.slug)) financeMutualFund.add(c.slug);
  }
  for (const c of financeFixedIncomeSafeCalculators()) {
    if (!existingSlugs.has(c.slug)) financeFixedIncomeSafe.add(c.slug);
  }
  for (const c of financeStockMarketCalculators()) {
    if (!existingSlugs.has(c.slug)) financeStockMarket.add(c.slug);
  }
  for (const c of financeRetirementPlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) financeRetirementPlanning.add(c.slug);
  }
  for (const c of financeGoalBasedInvestmentCalculators()) {
    if (!existingSlugs.has(c.slug)) financeGoalBasedInvestment.add(c.slug);
  }
  for (const c of financeRiskPortfolioAnalysisCalculators()) {
    if (!existingSlugs.has(c.slug)) financeRiskPortfolioAnalysis.add(c.slug);
  }
  for (const c of financeTaxRealReturnCalculators()) {
    if (!existingSlugs.has(c.slug)) financeTaxRealReturn.add(c.slug);
  }
  for (const c of financeAdvancedProInvestmentCalculators()) {
    if (!existingSlugs.has(c.slug)) financeAdvancedProInvestment.add(c.slug);
  }
  for (const c of financeCryptoAlternativeInvestmentCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCryptoAlternativeInvestment.add(c.slug);
  }
  for (const c of financeDepositSavingsCalculators()) {
    if (!existingSlugs.has(c.slug)) financeDepositSavings.add(c.slug);
  }
  for (const c of financeCreditCardBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCreditCardBanking.add(c.slug);
  }
  for (const c of financeLoanCreditBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeLoanCreditBanking.add(c.slug);
  }
  for (const c of financeCreditScoreHealthCalculators()) {
    if (!existingSlugs.has(c.slug)) financeCreditScoreHealth.add(c.slug);
  }
  for (const c of financeBankingChargesFeesCalculators()) {
    if (!existingSlugs.has(c.slug)) financeBankingChargesFees.add(c.slug);
  }
  for (const c of financeInvestmentLinkedBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeInvestmentLinkedBanking.add(c.slug);
  }
  for (const c of financeInterestRateConversionCalculators()) {
    if (!existingSlugs.has(c.slug)) financeInterestRateConversion.add(c.slug);
  }
  for (const c of financeBusinessCorporateBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeBusinessCorporateBanking.add(c.slug);
  }
  for (const c of financeMortgagePropertyCalculators()) {
    if (!existingSlugs.has(c.slug)) financeMortgageProperty.add(c.slug);
  }
  for (const c of financeAdvancedViralBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeAdvancedViralBanking.add(c.slug);
  }
  for (const c of financeIndiaSpecificBankingCalculators()) {
    if (!existingSlugs.has(c.slug)) financeIndiaSpecificBanking.add(c.slug);
  }
  for (const c of educationExamViralMicroCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamViralMicro.add(c.slug);
  }
  for (const c of educationExamAiSmartCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamAiSmart.add(c.slug);
  }
  for (const c of educationExamInternationalCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamInternational.add(c.slug);
  }
  for (const c of educationExamScholarshipCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamScholarship.add(c.slug);
  }
  for (const c of educationExamAcademicPlanningCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamAcademicPlanning.add(c.slug);
  }
  for (const c of educationPhysicsKinematicsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsKinematics.add(c.slug);
  }
  for (const c of educationPhysicsDynamicsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsDynamics.add(c.slug);
  }
  for (const c of educationPhysicsWorkEnergyPowerCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsWorkEnergyPower.add(c.slug);
  }
  for (const c of educationPhysicsRotationalCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsRotational.add(c.slug);
  }
  for (const c of educationPhysicsGravitationCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsGravitation.add(c.slug);
  }
  for (const c of educationChemistryStoichiometryCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryStoichiometry.add(c.slug);
  }
  for (const c of educationChemistrySolutionsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistrySolutions.add(c.slug);
  }
  for (const c of educationChemistryGasLawsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryGasLaws.add(c.slug);
  }
  for (const c of educationChemistryThermoCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryThermo.add(c.slug);
  }
  for (const c of educationChemistryBasicCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryBasic.add(c.slug);
  }
  for (const c of educationPhysicsOpticsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsOptics.add(c.slug);
  }
  for (const c of educationPhysicsModernCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsModern.add(c.slug);
  }
  for (const c of educationPhysicsAdvancedCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsAdvanced.add(c.slug);
  }
  for (const c of educationBiologyPlantsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyPlants.add(c.slug);
  }
  for (const c of educationBiologyBiochemistryCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyBiochemistry.add(c.slug);
  }
  for (const c of educationBiologyMicrobiologyCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyMicrobiology.add(c.slug);
  }
  for (const c of educationBiologyGeneticsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyGenetics.add(c.slug);
  }
  for (const c of educationBiologyPregnancyCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyPregnancy.add(c.slug);
  }
  for (const c of educationBiologyHumanBodyCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyHumanBody.add(c.slug);
  }
  for (const c of educationBiologyNutritionCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyNutrition.add(c.slug);
  }
  for (const c of educationBiologyEcologyCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyEcology.add(c.slug);
  }
  for (const c of educationBiologyNeuroscienceCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyNeuroscience.add(c.slug);
  }
  for (const c of educationBiologyLabResearchCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyLabResearch.add(c.slug);
  }
  for (const c of educationBiologyMolecularCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyMolecular.add(c.slug);
  }
  for (const c of educationBiologyStudentCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyStudent.add(c.slug);
  }
  for (const c of educationBiologyAiBonusCalculators()) {
    if (!existingSlugs.has(c.slug)) educationBiologyAiBonus.add(c.slug);
  }
  for (const c of educationChemistryBonusMicroCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryBonusMicro.add(c.slug);
  }
  for (const c of educationChemistryAiSmartCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryAiSmart.add(c.slug);
  }
  for (const c of educationChemistryIndustrialCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryIndustrial.add(c.slug);
  }
  for (const c of educationChemistryAnalyticalCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryAnalytical.add(c.slug);
  }
  for (const c of educationChemistryKineticsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryKinetics.add(c.slug);
  }
  for (const c of educationChemistryNuclearCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryNuclear.add(c.slug);
  }
  for (const c of educationChemistrySolidStateCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistrySolidState.add(c.slug);
  }
  for (const c of educationChemistryPhAcidBaseCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryPhAcidBase.add(c.slug);
  }
  for (const c of educationChemistryOrganicCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryOrganic.add(c.slug);
  }
  for (const c of educationChemistryElectrochemistryCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryElectrochemistry.add(c.slug);
  }
  for (const c of educationChemistryEquilibriumCalculators()) {
    if (!existingSlugs.has(c.slug)) educationChemistryEquilibrium.add(c.slug);
  }
  for (const c of educationPhysicsFluidsSolidsCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsFluidsSolids.add(c.slug);
  }
  for (const c of educationPhysicsThermoHeatCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsThermoHeat.add(c.slug);
  }
  for (const c of educationPhysicsElectricityCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsElectricity.add(c.slug);
  }
  for (const c of educationPhysicsMagnetismCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsMagnetism.add(c.slug);
  }
  for (const c of educationPhysicsWavesSoundCalculators()) {
    if (!existingSlugs.has(c.slug)) educationPhysicsWavesSound.add(c.slug);
  }
  for (const c of educationExamBasicScoreCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamBasicScore.add(c.slug);
  }
  for (const c of educationExamTargetScoreCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamTargetScore.add(c.slug);
  }
  for (const c of educationExamGpaCgpaCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamGpaCgpa.add(c.slug);
  }
  for (const c of educationExamStrategyCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamStrategy.add(c.slug);
  }
  for (const c of educationExamPerformanceCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamPerformance.add(c.slug);
  }
  for (const c of educationExamCompetitiveCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamCompetitive.add(c.slug);
  }
  for (const c of educationExamSchoolCollegeCalculators()) {
    if (!existingSlugs.has(c.slug)) educationExamSchoolCollege.add(c.slug);
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
    engineeringCivil,
    engineeringItDev,
    dailyHomeUtility,
    dailyShoppingDiscount,
    dailyTravel,
    conversionUnitConverters,
    conversionCurrency,
    businessFinance,
    businessMarketing,
    businessHrProductivity,
    aiGenerators,
    healthBody,
    healthMedicalClinicalRisk,
    healthMedicalLifestyle,
    healthMedicalGeriatrics,
    healthMedicalOrthopedic,
    healthMedicalOncology,
    healthMedicalRespiratory,
    healthMedicalEmergency,
    healthMedicalNeurology,
    healthMedicalBodyMetrics,
    healthMedicalNutritionMed,
    healthMedicalHeart,
    healthMedicalDiabetes,
    healthMedicalPregnancy,
    healthMedicalPediatrics,
    healthMedicalDrugDosage,
    healthMedicalLabValues,
    healthDietCalorieEnergy,
    healthDietMacros,
    healthDietWeightMgmt,
    healthDietHydration,
    healthDietMealPlanning,
    healthDietTrends,
    healthDietMicros,
    healthDietFitness,
    healthDietCondition,
    healthDietAgeGender,
    healthDietFoodBased,
    healthDietAiAdvanced,
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
    financeTaxDeduction,
    financeBenefitsContributions,
    financeBonusIncentive,
    financeWorkTimePay,
    financeInternationalSalary,
    financeSalaryComparisonPlanning,
    financeSalaryFinancialPlanning,
    financeFreelanceGigIncome,
    financeHrEmployerTools,
    financeAiPoweredSalary,
    financeCoreInvestment,
    financeMutualFund,
    financeFixedIncomeSafe,
    financeStockMarket,
    financeRetirementPlanning,
    financeGoalBasedInvestment,
    financeRiskPortfolioAnalysis,
    financeTaxRealReturn,
    financeAdvancedProInvestment,
    financeCryptoAlternativeInvestment,
    financeDepositSavings,
    financeCreditCardBanking,
    financeLoanCreditBanking,
    financeCreditScoreHealth,
    financeBankingChargesFees,
    financeInvestmentLinkedBanking,
    financeInterestRateConversion,
    financeBusinessCorporateBanking,
    financeMortgageProperty,
    financeAdvancedViralBanking,
    financeIndiaSpecificBanking,
    educationExamViralMicro,
    educationExamAiSmart,
    educationExamInternational,
    educationExamScholarship,
    educationExamAcademicPlanning,
    educationPhysicsKinematics,
    educationPhysicsDynamics,
    educationPhysicsWorkEnergyPower,
    educationPhysicsRotational,
    educationPhysicsGravitation,
    educationChemistryStoichiometry,
    educationChemistrySolutions,
    educationChemistryGasLaws,
    educationChemistryThermo,
    educationChemistryBasic,
    educationPhysicsOptics,
    educationPhysicsModern,
    educationPhysicsAdvanced,
    educationBiologyPlants,
    educationBiologyBiochemistry,
    educationBiologyMicrobiology,
    educationBiologyGenetics,
    educationBiologyPregnancy,
    educationBiologyHumanBody,
    educationBiologyNutrition,
    educationBiologyEcology,
    educationBiologyNeuroscience,
    educationBiologyLabResearch,
    educationBiologyMolecular,
    educationBiologyStudent,
    educationBiologyAiBonus,
    educationChemistryBonusMicro,
    educationChemistryAiSmart,
    educationChemistryIndustrial,
    educationChemistryAnalytical,
    educationChemistryKinetics,
    educationChemistryNuclear,
    educationChemistrySolidState,
    educationChemistryPhAcidBase,
    educationChemistryOrganic,
    educationChemistryElectrochemistry,
    educationChemistryEquilibrium,
    educationPhysicsFluidsSolids,
    educationPhysicsThermoHeat,
    educationPhysicsElectricity,
    educationPhysicsMagnetism,
    educationPhysicsWavesSound,
    educationExamBasicScore,
    educationExamTargetScore,
    educationExamGpaCgpa,
    educationExamStrategy,
    educationExamPerformance,
    educationExamCompetitive,
    educationExamSchoolCollege,
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
