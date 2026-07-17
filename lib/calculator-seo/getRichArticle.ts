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
import { CORE_INVESTMENT_ARTICLES } from "./coreInvestmentContent";
import { MUTUAL_FUND_ARTICLES } from "./mutualFundContent";
import { FIXED_INCOME_SAFE_ARTICLES } from "./fixedIncomeSafeContent";
import { STOCK_MARKET_ARTICLES } from "./stockMarketContent";
import { RETIREMENT_PLANNING_ARTICLES } from "./retirementPlanningContent";
import { GOAL_BASED_INVESTMENT_ARTICLES } from "./goalBasedInvestmentContent";
import { RISK_PORTFOLIO_ANALYSIS_ARTICLES } from "./riskPortfolioAnalysisContent";
import { TAX_REAL_RETURN_ARTICLES } from "./taxRealReturnContent";
import { ADVANCED_PRO_INVESTMENT_ARTICLES } from "./advancedProInvestmentContent";
import { CRYPTO_ALTERNATIVE_INVESTMENT_ARTICLES } from "./cryptoAlternativeInvestmentContent";
import { DEPOSIT_SAVINGS_ARTICLES } from "./depositSavingsContent";
import { CREDIT_CARD_BANKING_ARTICLES } from "./creditCardBankingContent";
import { LOAN_CREDIT_BANKING_ARTICLES } from "./loanCreditBankingContent";
import { CREDIT_SCORE_HEALTH_ARTICLES } from "./creditScoreHealthContent";
import { BANKING_CHARGES_FEES_ARTICLES } from "./bankingChargesFeesContent";
import { INVESTMENT_LINKED_BANKING_ARTICLES } from "./investmentLinkedBankingContent";
import { INTEREST_RATE_CONVERSION_ARTICLES } from "./interestRateConversionContent";
import { BUSINESS_CORPORATE_BANKING_ARTICLES } from "./businessCorporateBankingContent";
import { MORTGAGE_PROPERTY_ARTICLES } from "./mortgagePropertyContent";
import { ADVANCED_VIRAL_BANKING_ARTICLES } from "./advancedViralBankingContent";
import { INDIA_SPECIFIC_BANKING_ARTICLES } from "./indiaSpecificBankingContent";
import { EXAM_VIRAL_MICRO_ARTICLES } from "./examViralMicroContent";
import { EXAM_AI_SMART_ARTICLES } from "./examAiSmartContent";
import { EXAM_INTERNATIONAL_ARTICLES } from "./examInternationalContent";
import { EXAM_SCHOLARSHIP_ELIGIBILITY_ARTICLES } from "./examScholarshipEligibilityContent";
import { EXAM_ACADEMIC_PLANNING_ARTICLES } from "./examAcademicPlanningContent";
import { PHYSICS_FLUIDS_SOLIDS_ARTICLES } from "./physicsFluidsSolidsContent";
import { PHYSICS_THERMO_HEAT_ARTICLES } from "./physicsThermoHeatContent";
import { PHYSICS_ELECTRICITY_ARTICLES } from "./physicsElectricityContent";
import { PHYSICS_MAGNETISM_ARTICLES } from "./physicsMagnetismContent";
import { PHYSICS_WAVES_SOUND_ARTICLES } from "./physicsWavesSoundContent";
import { PHYSICS_KINEMATICS_ARTICLES } from "./physicsKinematicsContent";
import { PHYSICS_DYNAMICS_ARTICLES } from "./physicsDynamicsContent";
import { PHYSICS_WORK_ENERGY_POWER_ARTICLES } from "./physicsWorkEnergyPowerContent";
import { PHYSICS_ROTATIONAL_ARTICLES } from "./physicsRotationalContent";
import { PHYSICS_GRAVITATION_ARTICLES } from "./physicsGravitationContent";
import { CHEMISTRY_STOICHIOMETRY_ARTICLES } from "./chemistryStoichiometryContent";
import { CHEMISTRY_SOLUTIONS_ARTICLES } from "./chemistrySolutionsContent";
import { CHEMISTRY_GAS_LAWS_ARTICLES } from "./chemistryGasLawsContent";
import { CHEMISTRY_THERMO_ARTICLES } from "./chemistryThermoContent";
import { CHEMISTRY_BASIC_ARTICLES } from "./chemistryBasicContent";
import { PHYSICS_OPTICS_ARTICLES } from "./physicsOpticsContent";
import { PHYSICS_MODERN_ARTICLES } from "./physicsModernContent";
import { PHYSICS_ADVANCED_ARTICLES } from "./physicsAdvancedContent";
import { BIOLOGY_PLANTS_ARTICLES } from "./biologyPlantsContent";
import { BIOLOGY_BIOCHEMISTRY_ARTICLES } from "./biologyBiochemistryContent";
import { BIOLOGY_MICROBIOLOGY_ARTICLES } from "./biologyMicrobiologyContent";
import { BIOLOGY_GENETICS_ARTICLES } from "./biologyGeneticsContent";
import { BIOLOGY_PREGNANCY_ARTICLES } from "./biologyPregnancyContent";
import { BIOLOGY_HUMAN_BODY_ARTICLES } from "./biologyHumanBodyContent";
import { BIOLOGY_NUTRITION_ARTICLES } from "./biologyNutritionContent";
import { BIOLOGY_ECOLOGY_ARTICLES } from "./biologyEcologyContent";
import { BIOLOGY_NEUROSCIENCE_ARTICLES } from "./biologyNeuroscienceContent";
import { BIOLOGY_LAB_RESEARCH_ARTICLES } from "./biologyLabResearchContent";
import { BIOLOGY_MOLECULAR_ARTICLES } from "./biologyMolecularContent";
import { BIOLOGY_STUDENT_ARTICLES } from "./biologyStudentContent";
import { BIOLOGY_AI_BONUS_ARTICLES } from "./biologyAiBonusContent";
import { CHEMISTRY_BONUS_MICRO_ARTICLES } from "./chemistryBonusMicroContent";
import { CHEMISTRY_AI_SMART_ARTICLES } from "./chemistryAiSmartContent";
import { CHEMISTRY_INDUSTRIAL_ARTICLES } from "./chemistryIndustrialContent";
import { CHEMISTRY_ANALYTICAL_ARTICLES } from "./chemistryAnalyticalContent";
import { CHEMISTRY_KINETICS_ARTICLES } from "./chemistryKineticsContent";
import { CHEMISTRY_NUCLEAR_ARTICLES } from "./chemistryNuclearContent";
import { CHEMISTRY_SOLID_STATE_ARTICLES } from "./chemistrySolidStateContent";
import { CHEMISTRY_PH_ACID_BASE_ARTICLES } from "./chemistryPhAcidBaseContent";
import { CHEMISTRY_ORGANIC_ARTICLES } from "./chemistryOrganicContent";
import { CHEMISTRY_ELECTROCHEMISTRY_ARTICLES } from "./chemistryElectrochemistryContent";
import { CHEMISTRY_EQUILIBRIUM_ARTICLES } from "./chemistryEquilibriumContent";
import { EXAM_BASIC_SCORE_ARTICLES } from "./examBasicScoreContent";
import { EXAM_TARGET_SCORE_ARTICLES } from "./examTargetScoreContent";
import { EXAM_GPA_CGPA_ARTICLES } from "./examGpaCgpaContent";
import { EXAM_STRATEGY_ARTICLES } from "./examStrategyContent";
import { EXAM_PERFORMANCE_ANALYSIS_ARTICLES } from "./examPerformanceAnalysisContent";
import { EXAM_COMPETITIVE_ARTICLES } from "./examCompetitiveContent";
import { EXAM_SCHOOL_COLLEGE_ARTICLES } from "./examSchoolCollegeContent";
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
  ...CORE_INVESTMENT_ARTICLES,
  ...MUTUAL_FUND_ARTICLES,
  ...FIXED_INCOME_SAFE_ARTICLES,
  ...STOCK_MARKET_ARTICLES,
  ...RETIREMENT_PLANNING_ARTICLES,
  ...GOAL_BASED_INVESTMENT_ARTICLES,
  ...RISK_PORTFOLIO_ANALYSIS_ARTICLES,
  ...TAX_REAL_RETURN_ARTICLES,
  ...ADVANCED_PRO_INVESTMENT_ARTICLES,
  ...CRYPTO_ALTERNATIVE_INVESTMENT_ARTICLES,
  ...DEPOSIT_SAVINGS_ARTICLES,
  ...CREDIT_CARD_BANKING_ARTICLES,
  ...LOAN_CREDIT_BANKING_ARTICLES,
  ...CREDIT_SCORE_HEALTH_ARTICLES,
  ...BANKING_CHARGES_FEES_ARTICLES,
  ...INVESTMENT_LINKED_BANKING_ARTICLES,
  ...INTEREST_RATE_CONVERSION_ARTICLES,
  ...BUSINESS_CORPORATE_BANKING_ARTICLES,
  ...MORTGAGE_PROPERTY_ARTICLES,
  ...ADVANCED_VIRAL_BANKING_ARTICLES,
  ...INDIA_SPECIFIC_BANKING_ARTICLES,
  ...EXAM_VIRAL_MICRO_ARTICLES,
  ...EXAM_AI_SMART_ARTICLES,
  ...EXAM_INTERNATIONAL_ARTICLES,
  ...EXAM_SCHOLARSHIP_ELIGIBILITY_ARTICLES,
  ...EXAM_ACADEMIC_PLANNING_ARTICLES,
  ...PHYSICS_FLUIDS_SOLIDS_ARTICLES,
  ...PHYSICS_THERMO_HEAT_ARTICLES,
  ...PHYSICS_ELECTRICITY_ARTICLES,
  ...PHYSICS_MAGNETISM_ARTICLES,
  ...PHYSICS_WAVES_SOUND_ARTICLES,
  ...PHYSICS_KINEMATICS_ARTICLES,
  ...PHYSICS_DYNAMICS_ARTICLES,
  ...PHYSICS_WORK_ENERGY_POWER_ARTICLES,
  ...PHYSICS_ROTATIONAL_ARTICLES,
  ...PHYSICS_GRAVITATION_ARTICLES,
  ...CHEMISTRY_STOICHIOMETRY_ARTICLES,
  ...CHEMISTRY_SOLUTIONS_ARTICLES,
  ...CHEMISTRY_GAS_LAWS_ARTICLES,
  ...CHEMISTRY_THERMO_ARTICLES,
  ...CHEMISTRY_BASIC_ARTICLES,
  ...PHYSICS_OPTICS_ARTICLES,
  ...PHYSICS_MODERN_ARTICLES,
  ...PHYSICS_ADVANCED_ARTICLES,
  ...BIOLOGY_PLANTS_ARTICLES,
  ...BIOLOGY_BIOCHEMISTRY_ARTICLES,
  ...BIOLOGY_MICROBIOLOGY_ARTICLES,
  ...BIOLOGY_GENETICS_ARTICLES,
  ...BIOLOGY_PREGNANCY_ARTICLES,
  ...BIOLOGY_HUMAN_BODY_ARTICLES,
  ...BIOLOGY_NUTRITION_ARTICLES,
  ...BIOLOGY_ECOLOGY_ARTICLES,
  ...BIOLOGY_NEUROSCIENCE_ARTICLES,
  ...BIOLOGY_LAB_RESEARCH_ARTICLES,
  ...BIOLOGY_MOLECULAR_ARTICLES,
  ...BIOLOGY_STUDENT_ARTICLES,
  ...BIOLOGY_AI_BONUS_ARTICLES,
  ...CHEMISTRY_BONUS_MICRO_ARTICLES,
  ...CHEMISTRY_AI_SMART_ARTICLES,
  ...CHEMISTRY_INDUSTRIAL_ARTICLES,
  ...CHEMISTRY_ANALYTICAL_ARTICLES,
  ...CHEMISTRY_KINETICS_ARTICLES,
  ...CHEMISTRY_NUCLEAR_ARTICLES,
  ...CHEMISTRY_SOLID_STATE_ARTICLES,
  ...CHEMISTRY_PH_ACID_BASE_ARTICLES,
  ...CHEMISTRY_ORGANIC_ARTICLES,
  ...CHEMISTRY_ELECTROCHEMISTRY_ARTICLES,
  ...CHEMISTRY_EQUILIBRIUM_ARTICLES,
  ...EXAM_BASIC_SCORE_ARTICLES,
  ...EXAM_TARGET_SCORE_ARTICLES,
  ...EXAM_GPA_CGPA_ARTICLES,
  ...EXAM_STRATEGY_ARTICLES,
  ...EXAM_PERFORMANCE_ANALYSIS_ARTICLES,
  ...EXAM_COMPETITIVE_ARTICLES,
  ...EXAM_SCHOOL_COLLEGE_ARTICLES,
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
    FAMILY_SLUG_SETS.financeCoreInvestment.has(slug) ||
    FAMILY_SLUG_SETS.financeMutualFund.has(slug) ||
    FAMILY_SLUG_SETS.financeFixedIncomeSafe.has(slug) ||
    FAMILY_SLUG_SETS.financeStockMarket.has(slug) ||
    FAMILY_SLUG_SETS.financeRetirementPlanning.has(slug) ||
    FAMILY_SLUG_SETS.financeGoalBasedInvestment.has(slug) ||
    FAMILY_SLUG_SETS.financeRiskPortfolioAnalysis.has(slug) ||
    FAMILY_SLUG_SETS.financeTaxRealReturn.has(slug) ||
    FAMILY_SLUG_SETS.financeAdvancedProInvestment.has(slug) ||
    FAMILY_SLUG_SETS.financeCryptoAlternativeInvestment.has(slug) ||
    FAMILY_SLUG_SETS.financeDepositSavings.has(slug) ||
    FAMILY_SLUG_SETS.financeCreditCardBanking.has(slug) ||
    FAMILY_SLUG_SETS.financeLoanCreditBanking.has(slug) ||
    FAMILY_SLUG_SETS.financeCreditScoreHealth.has(slug) ||
    FAMILY_SLUG_SETS.financeBankingChargesFees.has(slug) ||
    FAMILY_SLUG_SETS.financeInvestmentLinkedBanking.has(slug) ||
    FAMILY_SLUG_SETS.financeInterestRateConversion.has(slug) ||
    FAMILY_SLUG_SETS.financeBusinessCorporateBanking.has(slug) ||
    FAMILY_SLUG_SETS.financeMortgageProperty.has(slug) ||
    FAMILY_SLUG_SETS.financeAdvancedViralBanking.has(slug) ||
    FAMILY_SLUG_SETS.financeIndiaSpecificBanking.has(slug) ||
    FAMILY_SLUG_SETS.educationExamViralMicro.has(slug) ||
    FAMILY_SLUG_SETS.educationExamAiSmart.has(slug) ||
    FAMILY_SLUG_SETS.educationExamInternational.has(slug) ||
    FAMILY_SLUG_SETS.educationExamScholarship.has(slug) ||
    FAMILY_SLUG_SETS.educationExamAcademicPlanning.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsKinematics.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsDynamics.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsWorkEnergyPower.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsRotational.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsGravitation.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryStoichiometry.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistrySolutions.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryGasLaws.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryThermo.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryBasic.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsOptics.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsModern.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsAdvanced.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyPlants.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyBiochemistry.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyMicrobiology.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyGenetics.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyPregnancy.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyHumanBody.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyNutrition.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyEcology.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyNeuroscience.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyLabResearch.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyMolecular.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyStudent.has(slug) ||
    FAMILY_SLUG_SETS.educationBiologyAiBonus.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryBonusMicro.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryAiSmart.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryIndustrial.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryAnalytical.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryKinetics.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryNuclear.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistrySolidState.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryPhAcidBase.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryOrganic.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryElectrochemistry.has(slug) ||
    FAMILY_SLUG_SETS.educationChemistryEquilibrium.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsFluidsSolids.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsThermoHeat.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsElectricity.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsMagnetism.has(slug) ||
    FAMILY_SLUG_SETS.educationPhysicsWavesSound.has(slug) ||
    FAMILY_SLUG_SETS.educationExamBasicScore.has(slug) ||
    FAMILY_SLUG_SETS.educationExamTargetScore.has(slug) ||
    FAMILY_SLUG_SETS.educationExamGpaCgpa.has(slug) ||
    FAMILY_SLUG_SETS.educationExamStrategy.has(slug) ||
    FAMILY_SLUG_SETS.educationExamPerformance.has(slug) ||
    FAMILY_SLUG_SETS.educationExamCompetitive.has(slug) ||
    FAMILY_SLUG_SETS.educationExamSchoolCollege.has(slug) ||
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
  for (const s of FAMILY_SLUG_SETS.financeCoreInvestment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeMutualFund) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeFixedIncomeSafe) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeStockMarket) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeRetirementPlanning) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeGoalBasedInvestment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeRiskPortfolioAnalysis) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeTaxRealReturn) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeAdvancedProInvestment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCryptoAlternativeInvestment) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeDepositSavings) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCreditCardBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeLoanCreditBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeCreditScoreHealth) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeBankingChargesFees) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeInvestmentLinkedBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeInterestRateConversion) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeBusinessCorporateBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeMortgageProperty) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeAdvancedViralBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.financeIndiaSpecificBanking) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamViralMicro) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamAiSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamInternational) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamScholarship) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamAcademicPlanning) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsKinematics) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsDynamics) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsWorkEnergyPower) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsRotational) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsGravitation) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryStoichiometry) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistrySolutions) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryGasLaws) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryThermo) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryBasic) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsOptics) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsModern) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsAdvanced) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyPlants) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyBiochemistry) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyMicrobiology) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyGenetics) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyPregnancy) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyHumanBody) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyNutrition) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyEcology) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyNeuroscience) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyLabResearch) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyMolecular) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyStudent) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationBiologyAiBonus) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryBonusMicro) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryAiSmart) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryIndustrial) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryAnalytical) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryKinetics) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryNuclear) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistrySolidState) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryPhAcidBase) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryOrganic) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryElectrochemistry) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationChemistryEquilibrium) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsFluidsSolids) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsThermoHeat) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsElectricity) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsMagnetism) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationPhysicsWavesSound) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamBasicScore) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamTargetScore) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamGpaCgpa) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamStrategy) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamPerformance) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamCompetitive) out.add(s);
  for (const s of FAMILY_SLUG_SETS.educationExamSchoolCollege) out.add(s);
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
