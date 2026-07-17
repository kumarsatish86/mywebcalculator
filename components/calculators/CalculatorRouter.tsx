"use client";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { BasicMathInitialProvider } from "@/components/calculators/BasicMathInitialContext";
import { LoanCalcPrefsProvider } from "@/components/calculators/LoanCalcPrefsContext";
import { LoanInitialInputsProvider } from "@/components/calculators/LoanInitialInputsContext";
import {
  AverageCalculator,
  BasicCalculatorAddSubtractMultiplyDivide,
  DifferenceCalculator,
  MeanCalculator,
  MedianCalculator,
  ModeCalculator,
  OrderOfOperationsPemdasCalculator,
  PercentageCalculator,
  PercentageIncreaseDecreaseCalculator,
  ProportionCalculator,
  RatioCalculator,
  RoundingCalculator,
  ScientificCalculator,
  SumCalculator,
} from "./BasicMathCalculators";
import { CatAgeCalculator } from "./CatAgeCalculator";
import { CompoundInterestCalculator } from "./CompoundInterestCalculator";
import { DaysBetweenCalculator } from "./DaysBetweenCalculator";
import { ExamGradeCalculator } from "./ExamGradeCalculator";
import { GradeNeededCalculator } from "./GradeNeededCalculator";
import {
  EmiCalculatorUniversal,
  FlatVsReducingInterestCalculator,
  InterestRateCalculator,
  LoanAmortizationCalculator,
  LoanAmountCalculator,
  LoanEmiCalculator,
  LoanTenureCalculator,
  ReducingBalanceEmiCalculator,
  TotalInterestPayableCalculator,
} from "./LoanCoreCalculators";
import { LoanPaymentCalculator } from "./LoanPaymentCalculator";
import { TipSplitterCalculator } from "./TipSplitterCalculator";
import { WeightedGpaCalculator } from "./WeightedGpaCalculator";
import { BASIC_MATH_SLUGS } from "@/lib/calculators/basicMathSlugs";
import { parseLoanSearchParamsToRecord, urlPrefsFromLoanQuery } from "@/lib/calculators/loanUrlParams";
import { parseSalarySearchParams } from "@/lib/calculators/salaryCore";
import { parseTaxDeductionSearchParams } from "@/lib/calculators/taxDeduction";
import { parseBenefitsSearchParams } from "@/lib/calculators/benefitsContributions";
import { parseBonusIncentiveSearchParams } from "@/lib/calculators/bonusIncentive";
import { parseWorkTimePaySearchParams } from "@/lib/calculators/workTimePay";
import { parseIntlSalarySearchParams } from "@/lib/calculators/internationalSalary";
import { parseSalaryPlanningSearchParams } from "@/lib/calculators/salaryComparisonPlanning";
import { parseSalaryFinancialPlanningSearchParams } from "@/lib/calculators/salaryFinancialPlanning";
import { parseFreelanceGigSearchParams } from "@/lib/calculators/freelanceGigIncome";
import { parseHrEmployerSearchParams } from "@/lib/calculators/hrEmployerTools";
import { parseAiPoweredSalarySearchParams } from "@/lib/calculators/aiPoweredSalary";
import { parseCoreInvestmentSearchParams } from "@/lib/calculators/coreInvestment";
import { parseMutualFundSearchParams } from "@/lib/calculators/mutualFund";
import { parseFixedIncomeSearchParams } from "@/lib/calculators/fixedIncomeSafe";
import { parseStockMarketSearchParams } from "@/lib/calculators/stockMarket";
import { parseRetirementSearchParams } from "@/lib/calculators/retirementPlanning";
import { parseGoalInvestmentSearchParams } from "@/lib/calculators/goalBasedInvestment";
import { parseRiskPortfolioSearchParams } from "@/lib/calculators/riskPortfolioAnalysis";
import { parseTaxRealReturnSearchParams } from "@/lib/calculators/taxRealReturn";
import { parseAdvancedProSearchParams } from "@/lib/calculators/advancedProInvestment";
import { parseCryptoAltSearchParams } from "@/lib/calculators/cryptoAlternativeInvestment";
import { parseDepositSavingsSearchParams } from "@/lib/calculators/depositSavings";
import { parseCreditCardBankingSearchParams } from "@/lib/calculators/creditCardBanking";
import { parseLoanCreditBankingSearchParams } from "@/lib/calculators/loanCreditBanking";
import { parseCreditScoreHealthSearchParams } from "@/lib/calculators/creditScoreHealth";
import { parseBankingChargesSearchParams } from "@/lib/calculators/bankingChargesFees";
import { parseInvestmentLinkedBankingSearchParams } from "@/lib/calculators/investmentLinkedBanking";
import { parseInterestRateConversionSearchParams } from "@/lib/calculators/interestRateConversion";
import { parseBusinessCorporateBankingSearchParams } from "@/lib/calculators/businessCorporateBanking";
import { parseMortgagePropertySearchParams } from "@/lib/calculators/mortgageProperty";
import { parseAdvancedViralBankingSearchParams } from "@/lib/calculators/advancedViralBanking";
import { parseIndiaSpecificBankingSearchParams } from "@/lib/calculators/indiaSpecificBanking";
import { parseExamViralSearchParams } from "@/lib/calculators/examViralMicro";
import { parseExamAiSmartSearchParams } from "@/lib/calculators/examAiSmart";
import { parseExamInternationalSearchParams } from "@/lib/calculators/examInternational";
import { parseExamScholarshipSearchParams } from "@/lib/calculators/examScholarshipEligibility";
import { parseExamAcademicPlanningSearchParams } from "@/lib/calculators/examAcademicPlanning";
import { parsePhysicsKinematicsSearchParams } from "@/lib/calculators/physicsKinematics";
import { parsePhysicsDynamicsSearchParams } from "@/lib/calculators/physicsDynamics";
import { parsePhysicsWepSearchParams } from "@/lib/calculators/physicsWorkEnergyPower";
import { parsePhysicsRotationalSearchParams } from "@/lib/calculators/physicsRotational";
import { parsePhysicsGravitationSearchParams } from "@/lib/calculators/physicsGravitation";
import { parseChemistryStoichSearchParams } from "@/lib/calculators/chemistryStoichiometry";
import { parseChemistrySolutionsSearchParams } from "@/lib/calculators/chemistrySolutions";
import { parseChemistryGasSearchParams } from "@/lib/calculators/chemistryGasLaws";
import { parseChemistryThermoSearchParams } from "@/lib/calculators/chemistryThermo";
import { parseChemistryBasicSearchParams } from "@/lib/calculators/chemistryBasic";
import { parsePhysicsOpticsSearchParams } from "@/lib/calculators/physicsOptics";
import { parsePhysicsModernSearchParams } from "@/lib/calculators/physicsModern";
import { parsePhysicsAdvancedSearchParams } from "@/lib/calculators/physicsAdvanced";
import { parseBiologyPlantsSearchParams } from "@/lib/calculators/biologyPlants";
import { parseBiologyBiochemSearchParams } from "@/lib/calculators/biologyBiochemistry";
import { parseBiologyMicroSearchParams } from "@/lib/calculators/biologyMicrobiology";
import { parseBiologyGeneticsSearchParams } from "@/lib/calculators/biologyGenetics";
import { parseBiologyPregnancySearchParams } from "@/lib/calculators/biologyPregnancy";
import { parseBiologyHumanSearchParams } from "@/lib/calculators/biologyHumanBody";
import { parseBiologyNutritionSearchParams } from "@/lib/calculators/biologyNutrition";
import { parseBiologyEcologySearchParams } from "@/lib/calculators/biologyEcology";
import { parseBiologyNeuroSearchParams } from "@/lib/calculators/biologyNeuroscience";
import { parseBiologyLabSearchParams } from "@/lib/calculators/biologyLabResearch";
import { parseBiologyMolecularSearchParams } from "@/lib/calculators/biologyMolecular";
import { parseBiologyStudentSearchParams } from "@/lib/calculators/biologyStudent";
import { parseBiologyAiSearchParams } from "@/lib/calculators/biologyAiBonus";
import { parseChemistryBonusSearchParams } from "@/lib/calculators/chemistryBonusMicro";
import { parseChemistryAiSearchParams } from "@/lib/calculators/chemistryAiSmart";
import { parseChemistryIndustrialSearchParams } from "@/lib/calculators/chemistryIndustrial";
import { parseChemistryAnalyticalSearchParams } from "@/lib/calculators/chemistryAnalytical";
import { parseChemistryKineticsSearchParams } from "@/lib/calculators/chemistryKinetics";
import { parseChemistryNuclearSearchParams } from "@/lib/calculators/chemistryNuclear";
import { parseChemistrySolidSearchParams } from "@/lib/calculators/chemistrySolidState";
import { parseChemistryPhSearchParams } from "@/lib/calculators/chemistryPhAcidBase";
import { parseChemistryOrganicSearchParams } from "@/lib/calculators/chemistryOrganic";
import { parseChemistryElectroSearchParams } from "@/lib/calculators/chemistryElectrochemistry";
import { parseChemistryEqSearchParams } from "@/lib/calculators/chemistryEquilibrium";
import { parsePhysicsFluidsSearchParams } from "@/lib/calculators/physicsFluidsSolids";
import { parsePhysicsThermoSearchParams } from "@/lib/calculators/physicsThermoHeat";
import { parsePhysicsElectricitySearchParams } from "@/lib/calculators/physicsElectricity";
import { parsePhysicsMagnetismSearchParams } from "@/lib/calculators/physicsMagnetism";
import { parsePhysicsWavesSearchParams } from "@/lib/calculators/physicsWavesSound";
import { parseExamBasicScoreSearchParams } from "@/lib/calculators/examBasicScore";
import { parseExamTargetScoreSearchParams } from "@/lib/calculators/examTargetScore";
import { parseExamGpaCgpaSearchParams } from "@/lib/calculators/examGpaCgpa";
import { parseExamStrategySearchParams } from "@/lib/calculators/examStrategy";
import { parseExamPerformanceSearchParams } from "@/lib/calculators/examPerformanceAnalysis";
import { parseExamCompetitiveSearchParams } from "@/lib/calculators/examCompetitive";
import { parseExamSchoolCollegeSearchParams } from "@/lib/calculators/examSchoolCollege";
import { parseIndiaSalarySearchParams } from "@/lib/calculators/salaryIndia";
import { parseAiFinanceSearchParams } from "@/lib/calculators/aiFinanceSmart";
import { parseAiEducationSearchParams } from "@/lib/calculators/aiEducationSmart";
import { parseAiHealthSearchParams } from "@/lib/calculators/aiHealthSmart";
import { parseAiDailyLifeSearchParams } from "@/lib/calculators/aiDailyLifeSmart";
import { parseAiBusinessSearchParams } from "@/lib/calculators/aiBusinessSmart";
import { parseAiDeveloperSearchParams } from "@/lib/calculators/aiDeveloperSmart";
import { parseAiConversionSearchParams } from "@/lib/calculators/aiConversionSmart";
import { parseAiPersonalizedSearchParams } from "@/lib/calculators/aiPersonalizedSmart";
import { parseTimeDateSearchParams } from "@/lib/calculators/timeDateParams";
import { FAMILY_SLUG_SETS } from "@/lib/registry";
import { BodyMetricsCalculatorHost } from "./family/BodyMetricsCalculatorHost";
import { CreditDebtCalculatorHost } from "./family/CreditDebtCalculatorHost";
import { EduMathCalculatorHost } from "./family/EduMathCalculatorHost";
import { ElectricalCalculatorHost } from "./family/ElectricalCalculatorHost";
import { LoanAdvancedPaymentCalculatorHost } from "./family/LoanAdvancedPaymentCalculatorHost";
import { LoanComparisonCalculatorHost } from "./family/LoanComparisonCalculatorHost";
import { LoanTypeCalculatorHost } from "./family/LoanTypeCalculatorHost";
import { PrepaymentForeclosureCalculatorHost } from "./family/PrepaymentForeclosureCalculatorHost";
import { EmiSchedulePlanningCalculatorHost } from "./family/EmiSchedulePlanningCalculatorHost";
import { RegionSpecificLoanCalculatorHost } from "./family/RegionSpecificLoanCalculatorHost";
import { SmartAiLoanCalculatorHost } from "./family/SmartAiLoanCalculatorHost";
import { LoanMicroToolsCalculatorHost } from "./family/LoanMicroToolsCalculatorHost";
import { CoreSalaryCalculatorHost } from "./family/CoreSalaryCalculatorHost";
import { IndiaSalaryCalculatorHost } from "./family/IndiaSalaryCalculatorHost";
import { TaxDeductionCalculatorHost } from "./family/TaxDeductionCalculatorHost";
import { BenefitsContributionsCalculatorHost } from "./family/BenefitsContributionsCalculatorHost";
import { BonusIncentiveCalculatorHost } from "./family/BonusIncentiveCalculatorHost";
import { WorkTimePayCalculatorHost } from "./family/WorkTimePayCalculatorHost";
import { InternationalSalaryCalculatorHost } from "./family/InternationalSalaryCalculatorHost";
import { SalaryComparisonPlanningCalculatorHost } from "./family/SalaryComparisonPlanningCalculatorHost";
import { SalaryFinancialPlanningCalculatorHost } from "./family/SalaryFinancialPlanningCalculatorHost";
import { FreelanceGigIncomeCalculatorHost } from "./family/FreelanceGigIncomeCalculatorHost";
import { HrEmployerToolsCalculatorHost } from "./family/HrEmployerToolsCalculatorHost";
import { AiPoweredSalaryCalculatorHost } from "./family/AiPoweredSalaryCalculatorHost";
import { CoreInvestmentCalculatorHost } from "./family/CoreInvestmentCalculatorHost";
import { MutualFundCalculatorHost } from "./family/MutualFundCalculatorHost";
import { FixedIncomeSafeCalculatorHost } from "./family/FixedIncomeSafeCalculatorHost";
import { StockMarketCalculatorHost } from "./family/StockMarketCalculatorHost";
import { RetirementPlanningCalculatorHost } from "./family/RetirementPlanningCalculatorHost";
import { GoalBasedInvestmentCalculatorHost } from "./family/GoalBasedInvestmentCalculatorHost";
import { RiskPortfolioAnalysisCalculatorHost } from "./family/RiskPortfolioAnalysisCalculatorHost";
import { TaxRealReturnCalculatorHost } from "./family/TaxRealReturnCalculatorHost";
import { AdvancedProInvestmentCalculatorHost } from "./family/AdvancedProInvestmentCalculatorHost";
import { CryptoAlternativeInvestmentCalculatorHost } from "./family/CryptoAlternativeInvestmentCalculatorHost";
import { DepositSavingsCalculatorHost } from "./family/DepositSavingsCalculatorHost";
import { CreditCardBankingCalculatorHost } from "./family/CreditCardBankingCalculatorHost";
import { LoanCreditBankingCalculatorHost } from "./family/LoanCreditBankingCalculatorHost";
import { CreditScoreHealthCalculatorHost } from "./family/CreditScoreHealthCalculatorHost";
import { BankingChargesCalculatorHost } from "./family/BankingChargesCalculatorHost";
import { InvestmentLinkedBankingCalculatorHost } from "./family/InvestmentLinkedBankingCalculatorHost";
import { InterestRateConversionCalculatorHost } from "./family/InterestRateConversionCalculatorHost";
import { BusinessCorporateBankingCalculatorHost } from "./family/BusinessCorporateBankingCalculatorHost";
import { MortgagePropertyCalculatorHost } from "./family/MortgagePropertyCalculatorHost";
import { AdvancedViralBankingCalculatorHost } from "./family/AdvancedViralBankingCalculatorHost";
import { IndiaSpecificBankingCalculatorHost } from "./family/IndiaSpecificBankingCalculatorHost";
import { ExamViralMicroCalculatorHost } from "./family/ExamViralMicroCalculatorHost";
import { ExamAiSmartCalculatorHost } from "./family/ExamAiSmartCalculatorHost";
import { ExamInternationalCalculatorHost } from "./family/ExamInternationalCalculatorHost";
import { ExamScholarshipEligibilityCalculatorHost } from "./family/ExamScholarshipEligibilityCalculatorHost";
import { ExamAcademicPlanningCalculatorHost } from "./family/ExamAcademicPlanningCalculatorHost";
import { PhysicsKinematicsCalculatorHost } from "./family/PhysicsKinematicsCalculatorHost";
import { PhysicsDynamicsCalculatorHost } from "./family/PhysicsDynamicsCalculatorHost";
import { PhysicsWorkEnergyPowerCalculatorHost } from "./family/PhysicsWorkEnergyPowerCalculatorHost";
import { PhysicsRotationalCalculatorHost } from "./family/PhysicsRotationalCalculatorHost";
import { PhysicsGravitationCalculatorHost } from "./family/PhysicsGravitationCalculatorHost";
import { ChemistryStoichiometryCalculatorHost } from "./family/ChemistryStoichiometryCalculatorHost";
import { ChemistrySolutionsCalculatorHost } from "./family/ChemistrySolutionsCalculatorHost";
import { ChemistryGasLawsCalculatorHost } from "./family/ChemistryGasLawsCalculatorHost";
import { ChemistryThermoCalculatorHost } from "./family/ChemistryThermoCalculatorHost";
import { ChemistryBasicCalculatorHost } from "./family/ChemistryBasicCalculatorHost";
import { PhysicsOpticsCalculatorHost } from "./family/PhysicsOpticsCalculatorHost";
import { PhysicsModernCalculatorHost } from "./family/PhysicsModernCalculatorHost";
import { PhysicsAdvancedCalculatorHost } from "./family/PhysicsAdvancedCalculatorHost";
import { BiologyPlantsCalculatorHost } from "./family/BiologyPlantsCalculatorHost";
import { BiologyBiochemistryCalculatorHost } from "./family/BiologyBiochemistryCalculatorHost";
import { BiologyMicrobiologyCalculatorHost } from "./family/BiologyMicrobiologyCalculatorHost";
import { BiologyGeneticsCalculatorHost } from "./family/BiologyGeneticsCalculatorHost";
import { BiologyPregnancyCalculatorHost } from "./family/BiologyPregnancyCalculatorHost";
import { BiologyHumanBodyCalculatorHost } from "./family/BiologyHumanBodyCalculatorHost";
import { BiologyNutritionCalculatorHost } from "./family/BiologyNutritionCalculatorHost";
import { BiologyEcologyCalculatorHost } from "./family/BiologyEcologyCalculatorHost";
import { BiologyNeuroscienceCalculatorHost } from "./family/BiologyNeuroscienceCalculatorHost";
import { BiologyLabResearchCalculatorHost } from "./family/BiologyLabResearchCalculatorHost";
import { BiologyMolecularCalculatorHost } from "./family/BiologyMolecularCalculatorHost";
import { BiologyStudentCalculatorHost } from "./family/BiologyStudentCalculatorHost";
import { BiologyAiBonusCalculatorHost } from "./family/BiologyAiBonusCalculatorHost";
import { ChemistryBonusMicroCalculatorHost } from "./family/ChemistryBonusMicroCalculatorHost";
import { ChemistryAiSmartCalculatorHost } from "./family/ChemistryAiSmartCalculatorHost";
import { ChemistryIndustrialCalculatorHost } from "./family/ChemistryIndustrialCalculatorHost";
import { ChemistryAnalyticalCalculatorHost } from "./family/ChemistryAnalyticalCalculatorHost";
import { ChemistryKineticsCalculatorHost } from "./family/ChemistryKineticsCalculatorHost";
import { ChemistryNuclearCalculatorHost } from "./family/ChemistryNuclearCalculatorHost";
import { ChemistrySolidStateCalculatorHost } from "./family/ChemistrySolidStateCalculatorHost";
import { ChemistryPhAcidBaseCalculatorHost } from "./family/ChemistryPhAcidBaseCalculatorHost";
import { ChemistryOrganicCalculatorHost } from "./family/ChemistryOrganicCalculatorHost";
import { ChemistryElectrochemistryCalculatorHost } from "./family/ChemistryElectrochemistryCalculatorHost";
import { ChemistryEquilibriumCalculatorHost } from "./family/ChemistryEquilibriumCalculatorHost";
import { PhysicsFluidsSolidsCalculatorHost } from "./family/PhysicsFluidsSolidsCalculatorHost";
import { PhysicsThermoHeatCalculatorHost } from "./family/PhysicsThermoHeatCalculatorHost";
import { PhysicsElectricityCalculatorHost } from "./family/PhysicsElectricityCalculatorHost";
import { PhysicsMagnetismCalculatorHost } from "./family/PhysicsMagnetismCalculatorHost";
import { PhysicsWavesSoundCalculatorHost } from "./family/PhysicsWavesSoundCalculatorHost";
import { ExamBasicScoreCalculatorHost } from "./family/ExamBasicScoreCalculatorHost";
import { ExamTargetScoreCalculatorHost } from "./family/ExamTargetScoreCalculatorHost";
import { ExamGpaCgpaCalculatorHost } from "./family/ExamGpaCgpaCalculatorHost";
import { ExamStrategyCalculatorHost } from "./family/ExamStrategyCalculatorHost";
import { ExamPerformanceAnalysisCalculatorHost } from "./family/ExamPerformanceAnalysisCalculatorHost";
import { ExamCompetitiveCalculatorHost } from "./family/ExamCompetitiveCalculatorHost";
import { ExamSchoolCollegeCalculatorHost } from "./family/ExamSchoolCollegeCalculatorHost";
import { AiFinanceSmartCalculatorHost } from "./family/AiFinanceSmartCalculatorHost";
import { AiEducationSmartCalculatorHost } from "./family/AiEducationSmartCalculatorHost";
import { AiHealthSmartCalculatorHost } from "./family/AiHealthSmartCalculatorHost";
import { AiDailyLifeSmartCalculatorHost } from "./family/AiDailyLifeSmartCalculatorHost";
import { AiBusinessSmartCalculatorHost } from "./family/AiBusinessSmartCalculatorHost";
import { AiDeveloperSmartCalculatorHost } from "./family/AiDeveloperSmartCalculatorHost";
import { AiConversionSmartCalculatorHost } from "./family/AiConversionSmartCalculatorHost";
import { AiPersonalizedSmartCalculatorHost } from "./family/AiPersonalizedSmartCalculatorHost";
import { TimeDateCalculatorHost } from "./family/TimeDateCalculatorHost";
import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import type { UrlLoanPrefs } from "@/lib/calculators/loanUrlParams";

const MAP: Record<string, ComponentType> = {
  "weighted-gpa": WeightedGpaCalculator,
  "grade-needed": GradeNeededCalculator,
  "exam-grade": ExamGradeCalculator,
  "loan-payment": LoanPaymentCalculator,
  "emi-calculator-universal": EmiCalculatorUniversal,
  "loan-emi-calculator": LoanEmiCalculator,
  "interest-rate-calculator": InterestRateCalculator,
  "loan-amount-calculator": LoanAmountCalculator,
  "loan-tenure-calculator": LoanTenureCalculator,
  "total-interest-payable-calculator": TotalInterestPayableCalculator,
  "loan-amortization-calculator": LoanAmortizationCalculator,
  "reducing-balance-emi-calculator": ReducingBalanceEmiCalculator,
  "flat-vs-reducing-interest-calculator": FlatVsReducingInterestCalculator,
  "compound-interest": CompoundInterestCalculator,
  "tip-splitter": TipSplitterCalculator,
  "days-between": DaysBetweenCalculator,
  "cat-age": CatAgeCalculator,
  "basic-calculator-add-subtract-multiply-divide": BasicCalculatorAddSubtractMultiplyDivide,
  "percentage-calculator": PercentageCalculator,
  "percentage-increase-decrease-calculator": PercentageIncreaseDecreaseCalculator,
  "ratio-calculator": RatioCalculator,
  "proportion-calculator": ProportionCalculator,
  "average-calculator": AverageCalculator,
  "mean-calculator": MeanCalculator,
  "median-calculator": MedianCalculator,
  "mode-calculator": ModeCalculator,
  "sum-calculator": SumCalculator,
  "difference-calculator": DifferenceCalculator,
  "rounding-calculator": RoundingCalculator,
  "scientific-calculator": ScientificCalculator,
  "order-of-operations-pemdas-calculator": OrderOfOperationsPemdasCalculator,
};

export const LOAN_CALCULATOR_SLUGS = new Set([
  "loan-payment",
  "emi-calculator-universal",
  "loan-emi-calculator",
  "interest-rate-calculator",
  "loan-amount-calculator",
  "loan-tenure-calculator",
  "total-interest-payable-calculator",
  "loan-amortization-calculator",
  "reducing-balance-emi-calculator",
  "flat-vs-reducing-interest-calculator",
  ...FAMILY_SLUG_SETS.financeLoanType,
  ...FAMILY_SLUG_SETS.financeAdvancedPayment,
  ...FAMILY_SLUG_SETS.financeLoanComparison,
  ...FAMILY_SLUG_SETS.financeCreditDebt,
  ...FAMILY_SLUG_SETS.financePrepaymentForeclosure,
  ...FAMILY_SLUG_SETS.financeEmiSchedulePlanning,
  ...FAMILY_SLUG_SETS.financeRegionSpecific,
  ...FAMILY_SLUG_SETS.financeSmartAiLoan,
  ...FAMILY_SLUG_SETS.financeLoanMicroTools,
]);

const REGION_DEFAULT_CURRENCY: Partial<Record<string, LoanCurrencyCode>> = {
  "home-loan-emi-calculator-india": "INR",
  "personal-loan-emi-calculator-india": "INR",
  "loan-calculator-usa": "USD",
  "mortgage-calculator-uk": "GBP",
  "gst-plus-loan-calculator-india": "INR",
};

function regionLoanUrlPrefs(slug: string, q: Record<string, string>): UrlLoanPrefs {
  const fromQuery = urlPrefsFromLoanQuery(q);
  const currency = fromQuery.currency ?? REGION_DEFAULT_CURRENCY[slug];
  return currency ? { ...fromQuery, currency } : fromQuery;
}

export { BASIC_MATH_SLUGS };

type Props = {
  slug: string;
  /** Raw Next.js searchParams (loan fields, prefs, basic-math `ms`, etc.). */
  initialSearchParams?: Record<string, string | string[] | undefined>;
};

export function CalculatorRouter({ slug, initialSearchParams }: Props) {
  if (FAMILY_SLUG_SETS.electrical.has(slug)) {
    return <ElectricalCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.healthBody.has(slug)) {
    return <BodyMetricsCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.educationMathPlanned.has(slug)) {
    return <EduMathCalculatorHost slug={slug} />;
  }
  if (FAMILY_SLUG_SETS.financeLoanType.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanTypeCalculatorHost />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeAdvancedPayment.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanAdvancedPaymentCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeLoanComparison.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanComparisonCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCreditDebt.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <CreditDebtCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financePrepaymentForeclosure.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <PrepaymentForeclosureCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeEmiSchedulePlanning.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <EmiSchedulePlanningCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeRegionSpecific.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = regionLoanUrlPrefs(slug, q);
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={urlPrefs}>
          <RegionSpecificLoanCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeSmartAiLoan.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <SmartAiLoanCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeLoanMicroTools.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <LoanMicroToolsCalculatorHost slug={slug} />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCoreSalary.has(slug)) {
    const q = initialSearchParams ? parseSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CoreSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeIndiaSalary.has(slug)) {
    const q = initialSearchParams ? parseIndiaSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <IndiaSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeTaxDeduction.has(slug)) {
    const q = initialSearchParams ? parseTaxDeductionSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <TaxDeductionCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeBenefitsContributions.has(slug)) {
    const q = initialSearchParams ? parseBenefitsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BenefitsContributionsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeBonusIncentive.has(slug)) {
    const q = initialSearchParams ? parseBonusIncentiveSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BonusIncentiveCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeWorkTimePay.has(slug)) {
    const q = initialSearchParams ? parseWorkTimePaySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <WorkTimePayCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeInternationalSalary.has(slug)) {
    const q = initialSearchParams ? parseIntlSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <InternationalSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeSalaryComparisonPlanning.has(slug)) {
    const q = initialSearchParams ? parseSalaryPlanningSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <SalaryComparisonPlanningCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeSalaryFinancialPlanning.has(slug)) {
    const q = initialSearchParams ? parseSalaryFinancialPlanningSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <SalaryFinancialPlanningCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeFreelanceGigIncome.has(slug)) {
    const q = initialSearchParams ? parseFreelanceGigSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <FreelanceGigIncomeCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeHrEmployerTools.has(slug)) {
    const q = initialSearchParams ? parseHrEmployerSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <HrEmployerToolsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeAiPoweredSalary.has(slug)) {
    const q = initialSearchParams ? parseAiPoweredSalarySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiPoweredSalaryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCoreInvestment.has(slug)) {
    const q = initialSearchParams ? parseCoreInvestmentSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CoreInvestmentCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeMutualFund.has(slug)) {
    const q = initialSearchParams ? parseMutualFundSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <MutualFundCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeFixedIncomeSafe.has(slug)) {
    const q = initialSearchParams ? parseFixedIncomeSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <FixedIncomeSafeCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeStockMarket.has(slug)) {
    const q = initialSearchParams ? parseStockMarketSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <StockMarketCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeRetirementPlanning.has(slug)) {
    const q = initialSearchParams ? parseRetirementSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <RetirementPlanningCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeGoalBasedInvestment.has(slug)) {
    const q = initialSearchParams ? parseGoalInvestmentSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <GoalBasedInvestmentCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeRiskPortfolioAnalysis.has(slug)) {
    const q = initialSearchParams ? parseRiskPortfolioSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <RiskPortfolioAnalysisCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeTaxRealReturn.has(slug)) {
    const q = initialSearchParams ? parseTaxRealReturnSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <TaxRealReturnCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeAdvancedProInvestment.has(slug)) {
    const q = initialSearchParams ? parseAdvancedProSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AdvancedProInvestmentCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCryptoAlternativeInvestment.has(slug)) {
    const q = initialSearchParams ? parseCryptoAltSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CryptoAlternativeInvestmentCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeDepositSavings.has(slug)) {
    const q = initialSearchParams ? parseDepositSavingsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <DepositSavingsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCreditCardBanking.has(slug)) {
    const q = initialSearchParams ? parseCreditCardBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CreditCardBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeLoanCreditBanking.has(slug)) {
    const q = initialSearchParams ? parseLoanCreditBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCreditBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeCreditScoreHealth.has(slug)) {
    const q = initialSearchParams ? parseCreditScoreHealthSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <CreditScoreHealthCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeBankingChargesFees.has(slug)) {
    const q = initialSearchParams ? parseBankingChargesSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BankingChargesCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeInvestmentLinkedBanking.has(slug)) {
    const q = initialSearchParams ? parseInvestmentLinkedBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <InvestmentLinkedBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeInterestRateConversion.has(slug)) {
    const q = initialSearchParams ? parseInterestRateConversionSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <InterestRateConversionCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeBusinessCorporateBanking.has(slug)) {
    const q = initialSearchParams ? parseBusinessCorporateBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BusinessCorporateBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeMortgageProperty.has(slug)) {
    const q = initialSearchParams ? parseMortgagePropertySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <MortgagePropertyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeAdvancedViralBanking.has(slug)) {
    const q = initialSearchParams ? parseAdvancedViralBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AdvancedViralBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.financeIndiaSpecificBanking.has(slug)) {
    const q = initialSearchParams ? parseIndiaSpecificBankingSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <IndiaSpecificBankingCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamViralMicro.has(slug)) {
    const q = initialSearchParams ? parseExamViralSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamViralMicroCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamAiSmart.has(slug)) {
    const q = initialSearchParams ? parseExamAiSmartSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamAiSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamInternational.has(slug)) {
    const q = initialSearchParams ? parseExamInternationalSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamInternationalCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamScholarship.has(slug)) {
    const q = initialSearchParams ? parseExamScholarshipSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamScholarshipEligibilityCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamAcademicPlanning.has(slug)) {
    const q = initialSearchParams ? parseExamAcademicPlanningSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamAcademicPlanningCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsKinematics.has(slug)) {
    const q = initialSearchParams ? parsePhysicsKinematicsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsKinematicsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsDynamics.has(slug)) {
    const q = initialSearchParams ? parsePhysicsDynamicsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsDynamicsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsWorkEnergyPower.has(slug)) {
    const q = initialSearchParams ? parsePhysicsWepSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsWorkEnergyPowerCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsRotational.has(slug)) {
    const q = initialSearchParams ? parsePhysicsRotationalSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsRotationalCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsGravitation.has(slug)) {
    const q = initialSearchParams ? parsePhysicsGravitationSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsGravitationCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryStoichiometry.has(slug)) {
    const q = initialSearchParams ? parseChemistryStoichSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryStoichiometryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistrySolutions.has(slug)) {
    const q = initialSearchParams ? parseChemistrySolutionsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistrySolutionsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryGasLaws.has(slug)) {
    const q = initialSearchParams ? parseChemistryGasSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryGasLawsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryThermo.has(slug)) {
    const q = initialSearchParams ? parseChemistryThermoSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryThermoCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryBasic.has(slug)) {
    const q = initialSearchParams ? parseChemistryBasicSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryBasicCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsOptics.has(slug)) {
    const q = initialSearchParams ? parsePhysicsOpticsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsOpticsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsModern.has(slug)) {
    const q = initialSearchParams ? parsePhysicsModernSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsModernCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsAdvanced.has(slug)) {
    const q = initialSearchParams ? parsePhysicsAdvancedSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsAdvancedCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyPlants.has(slug)) {
    const q = initialSearchParams ? parseBiologyPlantsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyPlantsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyBiochemistry.has(slug)) {
    const q = initialSearchParams ? parseBiologyBiochemSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyBiochemistryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyMicrobiology.has(slug)) {
    const q = initialSearchParams ? parseBiologyMicroSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyMicrobiologyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyGenetics.has(slug)) {
    const q = initialSearchParams ? parseBiologyGeneticsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyGeneticsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyPregnancy.has(slug)) {
    const q = initialSearchParams ? parseBiologyPregnancySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyPregnancyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyHumanBody.has(slug)) {
    const q = initialSearchParams ? parseBiologyHumanSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyHumanBodyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyNutrition.has(slug)) {
    const q = initialSearchParams ? parseBiologyNutritionSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyNutritionCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyEcology.has(slug)) {
    const q = initialSearchParams ? parseBiologyEcologySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyEcologyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyNeuroscience.has(slug)) {
    const q = initialSearchParams ? parseBiologyNeuroSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyNeuroscienceCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyLabResearch.has(slug)) {
    const q = initialSearchParams ? parseBiologyLabSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyLabResearchCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyMolecular.has(slug)) {
    const q = initialSearchParams ? parseBiologyMolecularSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyMolecularCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyStudent.has(slug)) {
    const q = initialSearchParams ? parseBiologyStudentSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyStudentCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationBiologyAiBonus.has(slug)) {
    const q = initialSearchParams ? parseBiologyAiSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <BiologyAiBonusCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryBonusMicro.has(slug)) {
    const q = initialSearchParams ? parseChemistryBonusSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryBonusMicroCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryAiSmart.has(slug)) {
    const q = initialSearchParams ? parseChemistryAiSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryAiSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryIndustrial.has(slug)) {
    const q = initialSearchParams ? parseChemistryIndustrialSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryIndustrialCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryAnalytical.has(slug)) {
    const q = initialSearchParams ? parseChemistryAnalyticalSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryAnalyticalCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryKinetics.has(slug)) {
    const q = initialSearchParams ? parseChemistryKineticsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryKineticsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryNuclear.has(slug)) {
    const q = initialSearchParams ? parseChemistryNuclearSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryNuclearCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistrySolidState.has(slug)) {
    const q = initialSearchParams ? parseChemistrySolidSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistrySolidStateCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryPhAcidBase.has(slug)) {
    const q = initialSearchParams ? parseChemistryPhSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryPhAcidBaseCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryOrganic.has(slug)) {
    const q = initialSearchParams ? parseChemistryOrganicSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryOrganicCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryElectrochemistry.has(slug)) {
    const q = initialSearchParams ? parseChemistryElectroSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryElectrochemistryCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationChemistryEquilibrium.has(slug)) {
    const q = initialSearchParams ? parseChemistryEqSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ChemistryEquilibriumCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsFluidsSolids.has(slug)) {
    const q = initialSearchParams ? parsePhysicsFluidsSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsFluidsSolidsCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsThermoHeat.has(slug)) {
    const q = initialSearchParams ? parsePhysicsThermoSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsThermoHeatCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsElectricity.has(slug)) {
    const q = initialSearchParams ? parsePhysicsElectricitySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsElectricityCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsMagnetism.has(slug)) {
    const q = initialSearchParams ? parsePhysicsMagnetismSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsMagnetismCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationPhysicsWavesSound.has(slug)) {
    const q = initialSearchParams ? parsePhysicsWavesSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <PhysicsWavesSoundCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamBasicScore.has(slug)) {
    const q = initialSearchParams ? parseExamBasicScoreSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamBasicScoreCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamTargetScore.has(slug)) {
    const q = initialSearchParams ? parseExamTargetScoreSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamTargetScoreCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamGpaCgpa.has(slug)) {
    const q = initialSearchParams ? parseExamGpaCgpaSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamGpaCgpaCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamStrategy.has(slug)) {
    const q = initialSearchParams ? parseExamStrategySearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamStrategyCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamPerformance.has(slug)) {
    const q = initialSearchParams ? parseExamPerformanceSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamPerformanceAnalysisCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamCompetitive.has(slug)) {
    const q = initialSearchParams ? parseExamCompetitiveSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamCompetitiveCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.educationExamSchoolCollege.has(slug)) {
    const q = initialSearchParams ? parseExamSchoolCollegeSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <ExamSchoolCollegeCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiFinanceSmart.has(slug)) {
    const q = initialSearchParams ? parseAiFinanceSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiFinanceSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiEducationSmart.has(slug)) {
    const q = initialSearchParams ? parseAiEducationSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiEducationSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiHealthSmart.has(slug)) {
    const q = initialSearchParams ? parseAiHealthSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiHealthSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiDailyLifeSmart.has(slug)) {
    const q = initialSearchParams ? parseAiDailyLifeSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiDailyLifeSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiBusinessSmart.has(slug)) {
    const q = initialSearchParams ? parseAiBusinessSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiBusinessSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiDeveloperSmart.has(slug)) {
    const q = initialSearchParams ? parseAiDeveloperSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiDeveloperSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiConversionSmart.has(slug)) {
    const q = initialSearchParams ? parseAiConversionSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiConversionSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.aiPersonalizedSmart.has(slug)) {
    const q = initialSearchParams ? parseAiPersonalizedSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <AiPersonalizedSmartCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }
  if (FAMILY_SLUG_SETS.conversionTimeDateBasic.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateAdvanced.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateBusiness.has(slug) || FAMILY_SLUG_SETS.conversionTimeDatePersonal.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateSpecialized.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateFun.has(slug) || FAMILY_SLUG_SETS.conversionTimeDateSmart.has(slug)) {
    const q = initialSearchParams ? parseTimeDateSearchParams(initialSearchParams) : {};
    return (
      <LoanInitialInputsProvider value={q}>
        <TimeDateCalculatorHost slug={slug} />
      </LoanInitialInputsProvider>
    );
  }

  const C = MAP[slug];
  if (!C) notFound();
  if (LOAN_CALCULATOR_SLUGS.has(slug)) {
    const q = initialSearchParams ? parseLoanSearchParamsToRecord(initialSearchParams) : {};
    const urlPrefs = urlPrefsFromLoanQuery(q);
    const hasUrlPrefs = Object.keys(urlPrefs).length > 0;
    return (
      <LoanInitialInputsProvider value={q}>
        <LoanCalcPrefsProvider urlPrefs={hasUrlPrefs ? urlPrefs : undefined}>
          <C />
        </LoanCalcPrefsProvider>
      </LoanInitialInputsProvider>
    );
  }
  if (BASIC_MATH_SLUGS.has(slug)) {
    return (
      <BasicMathInitialProvider slug={slug} searchParams={initialSearchParams}>
        <C />
      </BasicMathInitialProvider>
    );
  }
  return <C />;
}
