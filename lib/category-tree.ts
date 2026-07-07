import { EDUCATION_EXAM_SCORE_SECTIONS } from "./education/exam-sections";
import { EDUCATION_MATHEMATICS_SECTIONS } from "./education/math-sections";
import { EDUCATION_SCIENCE_SECTIONS } from "./education/science-sections";
import { HEALTH_BODY_METRICS_SECTIONS } from "./health/body-metrics-sections";
import { HEALTH_DIET_NUTRITION_SECTIONS } from "./health/diet-nutrition-sections";
import { HEALTH_MEDICAL_SECTIONS } from "./health/medical-sections";
import { ENGINEERING_CIVIL_SECTIONS } from "./engineering/civil-sections";
import { ENGINEERING_ELECTRICAL_SECTIONS } from "./engineering/electrical-sections";
import { ENGINEERING_IT_DEV_SECTIONS } from "./engineering/it-dev-sections";
import { DAILY_HOME_UTILITY_SECTIONS } from "./daily/home-utility-sections";
import { DAILY_SHOPPING_DISCOUNT_SECTIONS } from "./daily/shopping-discount-sections";
import { DAILY_TRAVEL_SECTIONS } from "./daily/travel-sections";
import { CONVERSION_CURRENCY_SECTIONS } from "./conversion/currency-sections";
import { CONVERSION_TIME_DATE_SECTIONS } from "./conversion/time-date-sections";
import { CONVERSION_UNIT_CONVERTERS_SECTIONS } from "./conversion/unit-converters-sections";
import { BUSINESS_FINANCE_SECTIONS } from "./business/business-finance-sections";
import { BUSINESS_HR_PRODUCTIVITY_SECTIONS } from "./business/hr-productivity-sections";
import { BUSINESS_MARKETING_SECTIONS } from "./business/marketing-sections";
import { AI_GENERATORS_SECTIONS } from "./ai/generators-sections";
import { AI_SMART_TOOLS_SECTIONS } from "./ai/smart-tools-sections";
import type { SectionNode } from "./hub-section-types";
import type { CalculatorCategory } from "./types";

export type { SectionCalculatorNode, SectionNode } from "./hub-section-types";

export type SubcategoryNode = {
  slug: string;
  title: string;
  description: string;
  emptyState?: string;
  sections?: SectionNode[];
};

export type CategoryHubNode = {
  id: CalculatorCategory;
  path: string;
  title: string;
  hubEyebrow: string;
  hubHeadline: string;
  hubSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: SubcategoryNode[];
};

const hubs: CategoryHubNode[] = [
  {
    id: "finance",
    path: "/finance",
    title: "Finance",
    hubEyebrow: "Finance",
    hubHeadline: "Money that adds up",
    hubSubtitle: "Loans, investing, income, and banking calculators in one glassy hub.",
    metaTitle: "Finance calculators | mywebcalculator",
    metaDescription:
      "Loan payments, compound growth, tips and splits, and more personal finance calculators.",
    subcategories: [
      {
        slug: "loans-emi",
        title: "Loans & EMI",
        description: "Amortizing loans, monthly payments, and borrowing estimates.",
        emptyState:
          "Core loan and EMI calculators are live below; specialized loan-type and regional tools are still rolling out—bookmark this hub for updates.",
        sections: [
          {
            slug: "core-loan-calculators",
            title: "Core loan calculators",
            description:
              "Foundational tools: monthly payment, EMI, implied rate, loan amount, tenure, total interest, full amortization, and flat vs reducing comparison.",
            calculators: [
              { slug: "loan-payment", title: "Loan Payment Calculator" },
              { slug: "emi-calculator-universal", title: "EMI Calculator (Universal)" },
              { slug: "loan-emi-calculator", title: "Loan EMI Calculator" },
              { slug: "interest-rate-calculator", title: "Interest Rate Calculator" },
              { slug: "loan-amount-calculator", title: "Loan Amount Calculator" },
              { slug: "loan-tenure-calculator", title: "Loan Tenure Calculator" },
              { slug: "total-interest-payable-calculator", title: "Total Interest Payable Calculator" },
              { slug: "loan-amortization-calculator", title: "Loan Amortization Calculator" },
              { slug: "reducing-balance-emi-calculator", title: "Reducing Balance EMI Calculator" },
              { slug: "flat-vs-reducing-interest-calculator", title: "Flat vs Reducing Interest Calculator" },
            ],
          },
          {
            slug: "loan-type-calculators",
            title: "Loan type-based calculators",
            description: "Home, vehicle, personal, education, business, and other loan variants.",
            calculators: [
              { slug: "home-loan-emi-calculator", title: "Home Loan EMI Calculator" },
              { slug: "home-loan-eligibility-calculator", title: "Home Loan Eligibility Calculator" },
              { slug: "home-loan-affordability-calculator", title: "Home Loan Affordability Calculator" },
              { slug: "home-loan-interest-calculator", title: "Home Loan Interest Calculator" },
              { slug: "home-loan-prepayment-calculator", title: "Home Loan Prepayment Calculator" },
              { slug: "home-loan-balance-transfer-calculator", title: "Home Loan Balance Transfer Calculator" },
              { slug: "home-loan-tax-benefit-calculator", title: "Home Loan Tax Benefit Calculator" },
              { slug: "car-loan-emi-calculator", title: "Car Loan EMI Calculator" },
              { slug: "bike-loan-emi-calculator", title: "Bike Loan EMI Calculator" },
              { slug: "commercial-vehicle-loan-calculator", title: "Commercial Vehicle Loan Calculator" },
              { slug: "personal-loan-emi-calculator", title: "Personal Loan EMI Calculator" },
              { slug: "instant-loan-calculator", title: "Instant Loan Calculator" },
              { slug: "short-term-loan-calculator", title: "Short-Term Loan Calculator" },
              { slug: "education-loan-emi-calculator", title: "Education Loan EMI Calculator" },
              { slug: "student-loan-repayment-calculator", title: "Student Loan Repayment Calculator" },
              { slug: "moratorium-period-calculator", title: "Moratorium Period Calculator" },
              { slug: "business-loan-emi-calculator", title: "Business Loan EMI Calculator" },
              { slug: "msme-loan-calculator", title: "MSME Loan Calculator" },
              { slug: "startup-loan-calculator", title: "Startup Loan Calculator" },
              { slug: "gold-loan-calculator", title: "Gold Loan Calculator" },
              { slug: "loan-against-property-calculator", title: "Loan Against Property Calculator" },
              { slug: "consumer-durable-loan-calculator", title: "Consumer Durable Loan Calculator" },
            ],
          },
          {
            slug: "advanced-emi-payment-calculators",
            title: "Advanced EMI and payment calculators",
            description: "What-if scenarios for repayments, balloons, and restructuring.",
            calculators: [
              { slug: "emi-with-prepayment-calculator", title: "EMI with Prepayment Calculator", status: "planned" },
              { slug: "emi-with-extra-payment-calculator", title: "EMI with Extra Payment Calculator", status: "planned" },
              { slug: "step-up-emi-calculator", title: "Step-up EMI Calculator", status: "planned" },
              { slug: "step-down-emi-calculator", title: "Step-down EMI Calculator", status: "planned" },
              { slug: "balloon-payment-calculator", title: "Balloon Payment Calculator", status: "planned" },
              { slug: "bullet-repayment-calculator", title: "Bullet Repayment Calculator", status: "planned" },
              { slug: "loan-part-payment-calculator", title: "Loan Part Payment Calculator", status: "planned" },
              { slug: "loan-restructuring-calculator", title: "Loan Restructuring Calculator", status: "planned" },
            ],
          },
          {
            slug: "loan-comparison-tools",
            title: "Loan comparison tools",
            description: "Compare products, rates, and EMI outcomes side by side.",
            calculators: [
              { slug: "loan-comparison-calculator", title: "Loan Comparison Calculator", status: "planned" },
              { slug: "emi-comparison-calculator", title: "EMI Comparison Calculator", status: "planned" },
              { slug: "interest-rate-comparison-tool", title: "Interest Rate Comparison Tool", status: "planned" },
              { slug: "fixed-vs-floating-interest-calculator", title: "Fixed vs Floating Interest Calculator", status: "planned" },
              { slug: "bank-loan-comparison-tool", title: "Bank Loan Comparison Tool", status: "planned" },
            ],
          },
          {
            slug: "credit-debt-calculators",
            title: "Credit and debt calculators",
            description: "Debt servicing, card costs, and payoff strategy tools.",
            calculators: [
              { slug: "debt-to-income-ratio-calculator", title: "Debt-to-Income Ratio Calculator", status: "planned" },
              { slug: "loan-repayment-capacity-calculator", title: "Loan Repayment Capacity Calculator", status: "planned" },
              { slug: "credit-card-emi-calculator", title: "Credit Card EMI Calculator", status: "planned" },
              { slug: "credit-card-interest-calculator", title: "Credit Card Interest Calculator", status: "planned" },
              { slug: "debt-payoff-calculator", title: "Debt Payoff Calculator", status: "planned" },
              { slug: "debt-snowball-calculator", title: "Debt Snowball Calculator", status: "planned" },
              { slug: "debt-avalanche-calculator", title: "Debt Avalanche Calculator", status: "planned" },
            ],
          },
          {
            slug: "prepayment-foreclosure-tools",
            title: "Prepayment and foreclosure tools",
            description: "Estimate savings and timeline impact from early closure.",
            calculators: [
              { slug: "loan-foreclosure-calculator", title: "Loan Foreclosure Calculator" },
              { slug: "loan-prepayment-savings-calculator", title: "Loan Prepayment Savings Calculator" },
              { slug: "emi-reduction-vs-tenure-reduction-calculator", title: "EMI Reduction vs Tenure Reduction Calculator" },
              { slug: "early-loan-closure-calculator", title: "Early Loan Closure Calculator" },
            ],
          },
          {
            slug: "emi-schedule-planning-tools",
            title: "EMI schedule and planning tools",
            description: "Planning views and payment calendars for repayment management.",
            calculators: [
              { slug: "emi-schedule-generator", title: "EMI Schedule Generator" },
              { slug: "monthly-payment-breakdown-calculator", title: "Monthly Payment Breakdown Calculator" },
              { slug: "loan-timeline-calculator", title: "Loan Timeline Calculator" },
              { slug: "payment-calendar-generator", title: "Payment Calendar Generator" },
            ],
          },
          {
            slug: "region-specific-loan-tools",
            title: "Region-specific loan tools",
            description: "Country and region tuned versions for SEO and user intent.",
            calculators: [
              { slug: "home-loan-emi-calculator-india", title: "Home Loan EMI Calculator India" },
              { slug: "personal-loan-emi-calculator-india", title: "Personal Loan EMI Calculator India" },
              { slug: "loan-calculator-usa", title: "Loan Calculator USA" },
              { slug: "mortgage-calculator-uk", title: "Mortgage Calculator UK" },
              { slug: "gst-plus-loan-calculator-india", title: "GST + Loan Calculator (India specific)" },
            ],
          },
          {
            slug: "smart-ai-loan-tools",
            title: "Smart and AI-enhanced calculators",
            description: "Advisory and optimization flows with future AI augmentation.",
            calculators: [
              { slug: "smart-loan-advisor-ai-based", title: "Smart Loan Advisor (AI-based)" },
              { slug: "best-emi-plan-generator", title: "Best EMI Plan Generator" },
              { slug: "loan-optimization-calculator", title: "Loan Optimization Calculator" },
              { slug: "should-i-take-loan-calculator", title: "Should I Take Loan? Calculator" },
              { slug: "loan-risk-calculator", title: "Loan Risk Calculator" },
            ],
          },
          {
            slug: "loan-micro-tools",
            title: "Loan micro tools",
            description: "Long-tail interest and balance tools for niche searches.",
            calculators: [
              { slug: "daily-interest-calculator", title: "Daily Interest Calculator" },
              { slug: "monthly-interest-calculator", title: "Monthly Interest Calculator" },
              { slug: "simple-interest-calculator", title: "Simple Interest Calculator" },
              { slug: "compound-interest-for-loan-calculator", title: "Compound Interest for Loan" },
              { slug: "interest-per-emi-calculator", title: "Interest per EMI Calculator" },
              { slug: "outstanding-balance-calculator", title: "Outstanding Balance Calculator" },
            ],
          },
        ],
      },
      {
        slug: "investment-wealth",
        title: "Investment & wealth",
        description: "Compound growth, savings projections, and long-term balance math.",
        sections: [
          {
            slug: "core-investment-calculators",
            title: "Core investment calculators",
            description: "Must-have tools for growth, returns, and value calculations.",
            calculators: [
              { slug: "sip-calculator", title: "SIP Calculator", status: "planned" },
              { slug: "lumpsum-investment-calculator", title: "Lumpsum Investment Calculator", status: "planned" },
              { slug: "compound-interest-calculator", title: "Compound Interest Calculator", status: "planned" },
              { slug: "simple-interest-calculator", title: "Simple Interest Calculator", status: "planned" },
              { slug: "investment-growth-calculator", title: "Investment Growth Calculator", status: "planned" },
              { slug: "future-value-calculator", title: "Future Value Calculator", status: "planned" },
              { slug: "present-value-calculator", title: "Present Value Calculator", status: "planned" },
              { slug: "rate-of-return-calculator", title: "Rate of Return Calculator", status: "planned" },
              { slug: "annual-return-calculator", title: "Annual Return Calculator", status: "planned" },
              { slug: "inflation-adjusted-return-calculator", title: "Inflation Adjusted Return Calculator", status: "planned" },
            ],
          },
          {
            slug: "mutual-fund-calculators",
            title: "Mutual fund calculators",
            description: "SIP, SWP, STP, and advanced mutual-fund return views.",
            calculators: [
              { slug: "mutual-fund-returns-calculator", title: "Mutual Fund Returns Calculator", status: "planned" },
              { slug: "sip-vs-lumpsum-calculator", title: "SIP vs Lumpsum Calculator", status: "planned" },
              { slug: "sip-step-up-calculator", title: "SIP Step-Up Calculator", status: "planned" },
              { slug: "swp-calculator", title: "SWP (Systematic Withdrawal Plan) Calculator", status: "planned" },
              { slug: "stp-calculator", title: "STP (Systematic Transfer Plan) Calculator", status: "planned" },
              { slug: "mutual-fund-expense-ratio-impact-calculator", title: "Mutual Fund Expense Ratio Impact Calculator", status: "planned" },
              { slug: "cagr-calculator", title: "CAGR Calculator", status: "planned" },
              { slug: "xirr-calculator", title: "XIRR Calculator", status: "planned" },
            ],
          },
          {
            slug: "fixed-income-safe-investment",
            title: "Fixed income and safe investment",
            description: "FD, RD, provident funds, and conservative options.",
            calculators: [
              { slug: "fixed-deposit-fd-calculator", title: "Fixed Deposit (FD) Calculator", status: "planned" },
              { slug: "recurring-deposit-rd-calculator", title: "Recurring Deposit (RD) Calculator", status: "planned" },
              { slug: "ppf-calculator", title: "PPF Calculator", status: "planned" },
              { slug: "epf-calculator", title: "EPF Calculator", status: "planned" },
              { slug: "nps-calculator", title: "NPS Calculator", status: "planned" },
              { slug: "sukanya-samriddhi-yojana-calculator", title: "Sukanya Samriddhi Yojana Calculator", status: "planned" },
              { slug: "senior-citizen-savings-scheme-calculator", title: "Senior Citizen Savings Scheme Calculator", status: "planned" },
              { slug: "post-office-savings-calculator", title: "Post Office Savings Calculator", status: "planned" },
              { slug: "treasury-bill-bond-calculator", title: "Treasury Bill / Bond Calculator", status: "planned" },
            ],
          },
          {
            slug: "stock-market-calculators",
            title: "Stock market calculators",
            description: "Returns, dividend, brokerage, portfolio, and risk math.",
            calculators: [
              { slug: "stock-return-calculator", title: "Stock Return Calculator", status: "planned" },
              { slug: "cagr-for-stocks-calculator", title: "CAGR for Stocks Calculator", status: "planned" },
              { slug: "dividend-yield-calculator", title: "Dividend Yield Calculator", status: "planned" },
              { slug: "dividend-reinvestment-calculator", title: "Dividend Reinvestment Calculator", status: "planned" },
              { slug: "stock-average-calculator", title: "Stock Average Calculator (buy average price)", status: "planned" },
              { slug: "intraday-profit-loss-calculator", title: "Intraday Profit/Loss Calculator", status: "planned" },
              { slug: "brokerage-calculator", title: "Brokerage Calculator", status: "planned" },
              { slug: "capital-gain-calculator-equity", title: "Capital Gain Calculator (Equity)", status: "planned" },
              { slug: "portfolio-return-calculator", title: "Portfolio Return Calculator", status: "planned" },
              { slug: "risk-vs-return-calculator", title: "Risk vs Return Calculator", status: "planned" },
            ],
          },
          {
            slug: "retirement-financial-planning",
            title: "Retirement and financial planning",
            description: "Retirement corpus, withdrawal, and long-run planning tools.",
            calculators: [
              { slug: "retirement-calculator", title: "Retirement Calculator", status: "planned" },
              { slug: "early-retirement-fire-calculator", title: "Early Retirement (FIRE) Calculator", status: "planned" },
              { slug: "pension-calculator", title: "Pension Calculator", status: "planned" },
              { slug: "retirement-corpus-calculator", title: "Retirement Corpus Calculator", status: "planned" },
              { slug: "retirement-withdrawal-calculator", title: "Retirement Withdrawal Calculator", status: "planned" },
              { slug: "inflation-impact-on-retirement-calculator", title: "Inflation Impact on Retirement Calculator", status: "planned" },
              { slug: "life-expectancy-calculator-financial-context", title: "Life Expectancy Calculator (financial context)", status: "planned" },
            ],
          },
          {
            slug: "goal-based-investment-calculators",
            title: "Goal-based investment calculators",
            description: "Tools mapped to life goals and milestone planning.",
            calculators: [
              { slug: "child-education-planning-calculator", title: "Child Education Planning Calculator", status: "planned" },
              { slug: "child-marriage-planning-calculator", title: "Child Marriage Planning Calculator", status: "planned" },
              { slug: "wealth-goal-calculator", title: "Wealth Goal Calculator", status: "planned" },
              { slug: "dream-home-investment-planner", title: "Dream Home Investment Planner", status: "planned" },
              { slug: "car-purchase-planning-calculator", title: "Car Purchase Planning Calculator", status: "planned" },
              { slug: "vacation-planning-calculator", title: "Vacation Planning Calculator", status: "planned" },
              { slug: "financial-freedom-calculator", title: "Financial Freedom Calculator", status: "planned" },
              { slug: "goal-sip-calculator", title: "Goal SIP Calculator", status: "planned" },
            ],
          },
          {
            slug: "risk-portfolio-analysis",
            title: "Risk and portfolio analysis",
            description: "Allocation and risk-adjusted performance metrics.",
            calculators: [
              { slug: "asset-allocation-calculator", title: "Asset Allocation Calculator", status: "planned" },
              { slug: "portfolio-diversification-calculator", title: "Portfolio Diversification Calculator", status: "planned" },
              { slug: "risk-tolerance-calculator", title: "Risk Tolerance Calculator", status: "planned" },
              { slug: "sharpe-ratio-calculator", title: "Sharpe Ratio Calculator", status: "planned" },
              { slug: "beta-calculator", title: "Beta Calculator", status: "planned" },
              { slug: "volatility-calculator", title: "Volatility Calculator", status: "planned" },
              { slug: "drawdown-calculator", title: "Drawdown Calculator", status: "planned" },
            ],
          },
          {
            slug: "tax-real-return-calculators",
            title: "Tax and real return calculators",
            description: "Tax-aware and inflation-aware return planning.",
            calculators: [
              { slug: "capital-gains-tax-calculator-india-global", title: "Capital Gains Tax Calculator (India + Global)", status: "planned" },
              { slug: "tax-saving-investment-calculator", title: "Tax Saving Investment Calculator", status: "planned" },
              { slug: "elss-calculator", title: "ELSS Calculator", status: "planned" },
              { slug: "after-tax-return-calculator", title: "After-Tax Return Calculator", status: "planned" },
              { slug: "real-rate-of-return-calculator", title: "Real Rate of Return Calculator", status: "planned" },
              { slug: "inflation-vs-return-calculator", title: "Inflation vs Return Calculator", status: "planned" },
            ],
          },
          {
            slug: "advanced-pro-investment-calculators",
            title: "Advanced and pro calculators",
            description: "Differentiation layer for advanced investors and analysts.",
            calculators: [
              { slug: "monte-carlo-investment-simulator", title: "Monte Carlo Investment Simulator", status: "planned" },
              { slug: "dollar-cost-averaging-calculator", title: "Dollar Cost Averaging Calculator", status: "planned" },
              { slug: "time-weighted-return-calculator", title: "Time Weighted Return Calculator", status: "planned" },
              { slug: "money-weighted-return-calculator", title: "Money Weighted Return Calculator", status: "planned" },
              { slug: "investment-fee-impact-calculator", title: "Investment Fee Impact Calculator", status: "planned" },
              { slug: "rebalancing-calculator", title: "Rebalancing Calculator", status: "planned" },
              { slug: "net-worth-growth-calculator", title: "Net Worth Growth Calculator", status: "planned" },
            ],
          },
          {
            slug: "crypto-alternative-investment",
            title: "Crypto and alternative investment",
            description: "Crypto, gold, and real-estate style alternative returns.",
            calculators: [
              { slug: "crypto-profit-calculator", title: "Crypto Profit Calculator", status: "planned" },
              { slug: "crypto-cagr-calculator", title: "Crypto CAGR Calculator", status: "planned" },
              { slug: "staking-reward-calculator", title: "Staking Reward Calculator", status: "planned" },
              { slug: "nft-roi-calculator", title: "NFT ROI Calculator", status: "planned" },
              { slug: "gold-investment-calculator", title: "Gold Investment Calculator", status: "planned" },
              { slug: "real-estate-roi-calculator", title: "Real Estate ROI Calculator", status: "planned" },
              { slug: "rental-yield-calculator", title: "Rental Yield Calculator", status: "planned" },
            ],
          },
        ],
      },
      {
        slug: "salary-income",
        title: "Salary & income",
        description: "Everyday money splits, tips, and wage-adjacent helpers.",
        sections: [
          {
            slug: "core-salary-calculators",
            title: "Core salary calculators",
            description: "Foundation salary conversion and in-hand estimators.",
            calculators: [
              { slug: "salary-calculator-monthly-annual", title: "Salary Calculator (Monthly/Annual)" },
              { slug: "in-hand-salary-calculator", title: "In-Hand Salary Calculator" },
              { slug: "gross-salary-calculator", title: "Gross Salary Calculator" },
              { slug: "net-salary-calculator", title: "Net Salary Calculator" },
              { slug: "ctc-calculator", title: "CTC Calculator (Cost to Company)" },
              { slug: "annual-salary-calculator", title: "Annual Salary Calculator" },
              { slug: "monthly-salary-calculator", title: "Monthly Salary Calculator" },
              { slug: "hourly-to-salary-calculator", title: "Hourly to Salary Calculator" },
              { slug: "salary-to-hourly-calculator", title: "Salary to Hourly Calculator" },
            ],
          },
          {
            slug: "india-salary-calculators",
            title: "India-specific salary calculators",
            description: "High-intent India payroll, tax, and salary breakup tools.",
            calculators: [
              { slug: "salary-calculator-india-full-breakdown", title: "Salary Calculator India (Full Breakdown)" },
              { slug: "in-hand-salary-calculator-india", title: "In-Hand Salary Calculator India" },
              { slug: "income-tax-calculator-india-old-vs-new-regime", title: "Income Tax Calculator India (Old vs New Regime)" },
              { slug: "hra-calculator", title: "HRA Calculator" },
              { slug: "basic-salary-calculator", title: "Basic Salary Calculator" },
              { slug: "take-home-salary-calculator-india", title: "Take Home Salary Calculator India" },
              { slug: "salary-breakup-calculator-india", title: "Salary Breakup Calculator India" },
              { slug: "professional-tax-calculator-state-wise", title: "Professional Tax Calculator (State-wise)" },
              { slug: "gratuity-calculator", title: "Gratuity Calculator" },
              { slug: "leave-encashment-calculator", title: "Leave Encashment Calculator" },
              { slug: "bonus-calculator-india", title: "Bonus Calculator (India)" },
            ],
          },
          {
            slug: "tax-deduction-calculators",
            title: "Tax and deduction calculators",
            description: "Taxable income, rates, and after-tax income calculations.",
            calculators: [
              { slug: "income-tax-calculator-global", title: "Income Tax Calculator (Global)" },
              { slug: "after-tax-salary-calculator", title: "After Tax Salary Calculator" },
              { slug: "tax-refund-calculator", title: "Tax Refund Calculator" },
              { slug: "tds-calculator", title: "TDS Calculator" },
              { slug: "taxable-income-calculator", title: "Taxable Income Calculator" },
              { slug: "salary-after-tax-calculator", title: "Salary After Tax Calculator" },
              { slug: "effective-tax-rate-calculator", title: "Effective Tax Rate Calculator" },
            ],
          },
          {
            slug: "benefits-contributions",
            title: "Benefits and contributions",
            description: "PF, pension, and statutory contribution estimators.",
            calculators: [
              { slug: "pf-provident-fund-calculator", title: "PF (Provident Fund) Calculator" },
              { slug: "epf-contribution-calculator", title: "EPF Contribution Calculator" },
              { slug: "employer-pf-contribution-calculator", title: "Employer PF Contribution Calculator" },
              { slug: "pension-calculator-eps", title: "Pension Calculator (EPS)" },
              { slug: "nps-calculator-india", title: "NPS Calculator (India)" },
              { slug: "superannuation-calculator", title: "Superannuation Calculator" },
              { slug: "esic-calculator", title: "ESIC Calculator" },
            ],
          },
          {
            slug: "bonus-incentive-calculators",
            title: "Bonus and incentive calculators",
            description: "Variable comp and commission payout tools.",
            calculators: [
              { slug: "annual-bonus-calculator", title: "Annual Bonus Calculator" },
              { slug: "performance-bonus-calculator", title: "Performance Bonus Calculator" },
              { slug: "sales-commission-calculator", title: "Sales Commission Calculator" },
              { slug: "incentive-calculator", title: "Incentive Calculator" },
              { slug: "profit-sharing-calculator", title: "Profit Sharing Calculator" },
              { slug: "variable-pay-calculator", title: "Variable Pay Calculator" },
            ],
          },
          {
            slug: "work-time-pay-calculators",
            title: "Work time and pay calculators",
            description: "Hours, overtime, and shift-based pay math.",
            calculators: [
              { slug: "hourly-wage-calculator", title: "Hourly Wage Calculator" },
              { slug: "overtime-pay-calculator", title: "Overtime Pay Calculator" },
              { slug: "double-pay-holiday-pay-calculator", title: "Double Pay / Holiday Pay Calculator" },
              { slug: "work-hours-calculator", title: "Work Hours Calculator" },
              { slug: "timesheet-calculator", title: "Timesheet Calculator" },
              { slug: "shift-pay-calculator", title: "Shift Pay Calculator" },
              { slug: "night-shift-allowance-calculator", title: "Night Shift Allowance Calculator" },
            ],
          },
          {
            slug: "international-salary-calculators",
            title: "International salary calculators",
            description: "Country-specific salary and cost-of-living views.",
            calculators: [
              { slug: "salary-calculator-usa", title: "Salary Calculator USA" },
              { slug: "salary-calculator-uk", title: "Salary Calculator UK" },
              { slug: "salary-calculator-canada", title: "Salary Calculator Canada" },
              { slug: "salary-calculator-australia", title: "Salary Calculator Australia" },
              { slug: "salary-calculator-uae", title: "Salary Calculator UAE" },
              { slug: "salary-after-tax-country-wise", title: "Salary After Tax (Country-wise)" },
              { slug: "cost-of-living-adjusted-salary-calculator", title: "Cost of Living Adjusted Salary Calculator" },
            ],
          },
          {
            slug: "salary-comparison-planning-calculators",
            title: "Comparison and planning calculators",
            description: "Offer comparisons and career progression projections.",
            calculators: [
              { slug: "salary-comparison-calculator", title: "Salary Comparison Calculator" },
              { slug: "offer-comparison-calculator", title: "Offer Comparison Calculator" },
              { slug: "cost-of-living-comparison-calculator", title: "Cost of Living Comparison Calculator" },
              { slug: "salary-growth-calculator", title: "Salary Growth Calculator" },
              { slug: "promotion-salary-calculator", title: "Promotion Salary Calculator" },
              { slug: "increment-calculator", title: "Increment Calculator" },
            ],
          },
          {
            slug: "salary-financial-planning",
            title: "Advanced financial planning",
            description: "Savings, budget, and FIRE planning from salary inputs.",
            calculators: [
              { slug: "savings-from-salary-calculator", title: "Savings from Salary Calculator" },
              { slug: "expense-vs-salary-calculator", title: "Expense vs Salary Calculator" },
              { slug: "salary-budget-planner", title: "Salary Budget Planner" },
              { slug: "salary-investment-calculator", title: "Salary Investment Calculator" },
              { slug: "fire-calculator-financial-independence", title: "FIRE Calculator (Financial Independence)" },
              { slug: "retirement-planning-calculator-salary-based", title: "Retirement Planning Calculator (Salary-based)" },
            ],
          },
          {
            slug: "freelancer-gig-income-calculators",
            title: "Freelancer and gig income calculators",
            description: "Rates, contracts, and freelance tax planning tools.",
            calculators: [
              { slug: "freelance-income-calculator", title: "Freelance Income Calculator" },
              { slug: "hourly-rate-calculator", title: "Hourly Rate Calculator" },
              { slug: "project-rate-calculator", title: "Project Rate Calculator" },
              { slug: "freelancer-tax-calculator", title: "Freelancer Tax Calculator" },
              { slug: "contractor-pay-calculator", title: "Contractor Pay Calculator" },
              { slug: "daily-rate-calculator", title: "Daily Rate Calculator" },
            ],
          },
          {
            slug: "hr-employer-tools",
            title: "HR and employer tools",
            description: "B2B payroll and compensation planning calculators.",
            calculators: [
              { slug: "payroll-calculator", title: "Payroll Calculator" },
              { slug: "employee-cost-calculator", title: "Employee Cost Calculator" },
              { slug: "salary-structure-builder", title: "Salary Structure Builder" },
              { slug: "compensation-planning-calculator", title: "Compensation Planning Calculator" },
              { slug: "salary-benchmark-calculator", title: "Salary Benchmark Calculator" },
              { slug: "cost-to-hire-calculator", title: "Cost to Hire Calculator" },
            ],
          },
          {
            slug: "ai-powered-salary-tools",
            title: "AI-powered salary tools",
            description: "AI-forward salary estimation and career planning concepts.",
            calculators: [
              { slug: "ai-salary-estimator", title: "AI Salary Estimator (based on role, skills, location)" },
              { slug: "ai-offer-analyzer", title: "AI Offer Analyzer (good offer or not)" },
              { slug: "ai-salary-negotiation-tool", title: "AI Salary Negotiation Tool" },
              { slug: "ai-career-growth-predictor", title: "AI Career Growth Predictor" },
              { slug: "ai-income-planner", title: "AI Income Planner" },
            ],
          },
        ],
      },
      {
        slug: "banking-credit",
        title: "Banking & credit",
        description: "APR context, credit scenarios, and bank-friendly estimates.",
        emptyState:
          "Credit and banking calculators will land here—check back as we expand the suite.",
        sections: [
          {
            slug: "deposit-savings-calculators",
            title: "Deposit and savings calculators",
            description: "Savings growth, FD/RD maturity, and interest payout tools.",
            calculators: [
              { slug: "savings-account-interest-calculator", title: "Savings Account Interest Calculator", status: "planned" },
              { slug: "fixed-deposit-fd-calculator", title: "Fixed Deposit (FD) Calculator", status: "planned" },
              { slug: "recurring-deposit-rd-calculator", title: "Recurring Deposit (RD) Calculator", status: "planned" },
              { slug: "simple-interest-calculator", title: "Simple Interest Calculator", status: "planned" },
              { slug: "compound-interest-calculator", title: "Compound Interest Calculator", status: "planned" },
              { slug: "fd-interest-payout-calculator", title: "FD Interest Payout Calculator (Monthly/Quarterly)", status: "planned" },
              { slug: "fd-maturity-amount-calculator", title: "FD Maturity Amount Calculator", status: "planned" },
              { slug: "rd-maturity-calculator-with-monthly-breakdown", title: "RD Maturity Calculator with Monthly Breakdown", status: "planned" },
              { slug: "savings-growth-calculator-with-regular-deposits", title: "Savings Growth Calculator (with regular deposits)", status: "planned" },
              { slug: "goal-based-savings-calculator", title: "Goal-Based Savings Calculator", status: "planned" },
            ],
          },
          {
            slug: "credit-card-calculators",
            title: "Credit card calculators",
            description: "High-CPC card interest, payoff, fee, and rewards tools.",
            calculators: [
              { slug: "credit-card-interest-calculator", title: "Credit Card Interest Calculator", status: "planned" },
              { slug: "credit-card-emi-calculator", title: "Credit Card EMI Calculator", status: "planned" },
              { slug: "minimum-payment-calculator", title: "Minimum Payment Calculator", status: "planned" },
              { slug: "credit-card-payoff-calculator", title: "Credit Card Payoff Calculator", status: "planned" },
              { slug: "credit-card-debt-reduction-planner", title: "Credit Card Debt Reduction Planner", status: "planned" },
              { slug: "balance-transfer-savings-calculator", title: "Balance Transfer Savings Calculator", status: "planned" },
              { slug: "credit-card-late-payment-fee-calculator", title: "Credit Card Late Payment Fee Calculator", status: "planned" },
              { slug: "interest-free-period-calculator", title: "Interest-Free Period Calculator", status: "planned" },
              { slug: "credit-card-rewards-calculator", title: "Credit Card Rewards Calculator", status: "planned" },
              { slug: "cashback-calculator", title: "Cashback Calculator", status: "planned" },
              { slug: "credit-card-annual-fee-value-calculator", title: "Credit Card Annual Fee Value Calculator", status: "planned" },
              { slug: "revolving-credit-cost-calculator", title: "Revolving Credit Cost Calculator", status: "planned" },
            ],
          },
          {
            slug: "loan-credit-calculators",
            title: "Loan and credit calculators",
            description: "Bank-grade loan modeling with schedule and sensitivity views.",
            calculators: [
              { slug: "loan-emi-calculator", title: "Loan EMI Calculator", status: "planned" },
              { slug: "loan-interest-calculator", title: "Loan Interest Calculator", status: "planned" },
              { slug: "loan-tenure-calculator", title: "Loan Tenure Calculator", status: "planned" },
              { slug: "loan-affordability-calculator", title: "Loan Affordability Calculator", status: "planned" },
              { slug: "loan-amortization-calculator-with-full-schedule", title: "Loan Amortization Calculator (with full schedule)", status: "planned" },
              { slug: "prepayment-foreclosure-calculator", title: "Prepayment / Foreclosure Calculator", status: "planned" },
              { slug: "part-payment-impact-calculator", title: "Part Payment Impact Calculator", status: "planned" },
              { slug: "reducing-balance-calculator", title: "Reducing Balance Calculator", status: "planned" },
              { slug: "flat-vs-reducing-interest-calculator", title: "Flat vs Reducing Interest Calculator", status: "planned" },
              { slug: "loan-comparison-calculator-multi-bank", title: "Loan Comparison Calculator (multi-bank)", status: "planned" },
              { slug: "floating-vs-fixed-interest-calculator", title: "Floating vs Fixed Interest Calculator", status: "planned" },
              { slug: "interest-rate-sensitivity-calculator", title: "Interest Rate Sensitivity Calculator", status: "planned" },
              { slug: "total-loan-cost-calculator", title: "Total Loan Cost Calculator", status: "planned" },
            ],
          },
          {
            slug: "credit-score-health-calculators",
            title: "Credit score and credit health calculators",
            description: "Credit utilization, eligibility, and score progression tools.",
            calculators: [
              { slug: "credit-score-simulator", title: "Credit Score Simulator", status: "planned" },
              { slug: "credit-utilization-ratio-calculator", title: "Credit Utilization Ratio Calculator", status: "planned" },
              { slug: "debt-to-income-ratio-calculator", title: "Debt-to-Income Ratio Calculator", status: "planned" },
              { slug: "credit-score-improvement-calculator", title: "Credit Score Improvement Calculator", status: "planned" },
              { slug: "loan-eligibility-based-on-credit-score", title: "Loan Eligibility Based on Credit Score", status: "planned" },
              { slug: "credit-limit-recommendation-calculator", title: "Credit Limit Recommendation Calculator", status: "planned" },
              { slug: "how-long-to-improve-credit-score-calculator", title: "How long to improve credit score? Calculator", status: "planned" },
              { slug: "credit-risk-assessment-tool", title: "Credit Risk Assessment Tool", status: "planned" },
            ],
          },
          {
            slug: "banking-charges-fees-calculators",
            title: "Banking charges and fees calculators",
            description: "Penalty and fee estimators across banking products.",
            calculators: [
              { slug: "bank-charges-calculator", title: "Bank Charges Calculator", status: "planned" },
              { slug: "atm-withdrawal-fee-calculator", title: "ATM Withdrawal Fee Calculator", status: "planned" },
              { slug: "overdraft-interest-calculator", title: "Overdraft Interest Calculator", status: "planned" },
              { slug: "penalty-calculator-minimum-balance-late-fee", title: "Penalty Calculator (minimum balance, late fee)", status: "planned" },
              { slug: "account-maintenance-fee-calculator", title: "Account Maintenance Fee Calculator", status: "planned" },
              { slug: "loan-processing-fee-calculator", title: "Loan Processing Fee Calculator", status: "planned" },
            ],
          },
          {
            slug: "investment-linked-banking-tools",
            title: "Investment linked banking tools",
            description: "Compare banking savings products with investment alternatives.",
            calculators: [
              { slug: "fd-vs-rd-calculator", title: "FD vs RD Calculator", status: "planned" },
              { slug: "fd-vs-mutual-fund-calculator", title: "FD vs Mutual Fund Calculator", status: "planned" },
              { slug: "savings-vs-investment-calculator", title: "Savings vs Investment Calculator", status: "planned" },
              { slug: "inflation-impact-on-savings-calculator", title: "Inflation Impact on Savings Calculator", status: "planned" },
              { slug: "real-interest-rate-calculator", title: "Real Interest Rate Calculator", status: "planned" },
              { slug: "tax-on-interest-calculator", title: "Tax on Interest Calculator", status: "planned" },
            ],
          },
          {
            slug: "interest-rate-conversion-tools",
            title: "Interest and rate conversion tools",
            description: "APR/APY and nominal-effective rate conversions.",
            calculators: [
              { slug: "interest-rate-calculator", title: "Interest Rate Calculator", status: "planned" },
              { slug: "apr-calculator", title: "APR Calculator", status: "planned" },
              { slug: "apy-calculator", title: "APY Calculator", status: "planned" },
              { slug: "nominal-vs-effective-interest-calculator", title: "Nominal vs Effective Interest Calculator", status: "planned" },
              { slug: "monthly-annual-interest-converter", title: "Monthly ↔ Annual Interest Converter", status: "planned" },
              { slug: "reducing-vs-flat-rate-converter", title: "Reducing vs Flat Rate Converter", status: "planned" },
            ],
          },
          {
            slug: "business-corporate-banking-calculators",
            title: "Business and corporate banking calculators",
            description: "Working capital and business credit planning tools.",
            calculators: [
              { slug: "working-capital-loan-calculator", title: "Working Capital Loan Calculator", status: "planned" },
              { slug: "business-loan-emi-calculator", title: "Business Loan EMI Calculator", status: "planned" },
              { slug: "cash-flow-calculator", title: "Cash Flow Calculator", status: "planned" },
              { slug: "business-credit-line-calculator", title: "Business Credit Line Calculator", status: "planned" },
              { slug: "invoice-financing-calculator", title: "Invoice Financing Calculator", status: "planned" },
            ],
          },
          {
            slug: "mortgage-property-financing",
            title: "Mortgage and property financing",
            description: "Mortgage and refinance planning calculators.",
            calculators: [
              { slug: "mortgage-calculator", title: "Mortgage Calculator", status: "planned" },
              { slug: "down-payment-calculator", title: "Down Payment Calculator", status: "planned" },
              { slug: "mortgage-amortization-calculator", title: "Mortgage Amortization Calculator", status: "planned" },
              { slug: "refinance-calculator", title: "Refinance Calculator", status: "planned" },
              { slug: "home-affordability-calculator", title: "Home Affordability Calculator", status: "planned" },
            ],
          },
          {
            slug: "advanced-viral-calculators",
            title: "Niche and advanced calculators",
            description: "Lower-competition concepts for discovery growth.",
            calculators: [
              { slug: "loan-burden-calculator", title: "Loan Burden Calculator", status: "planned" },
              { slug: "interest-saved-by-prepayment-calculator", title: "Interest Saved by Prepayment Calculator", status: "planned" },
              { slug: "debt-snowball-calculator", title: "Debt Snowball Calculator", status: "planned" },
              { slug: "debt-avalanche-calculator", title: "Debt Avalanche Calculator", status: "planned" },
              { slug: "emergency-fund-calculator", title: "Emergency Fund Calculator", status: "planned" },
              { slug: "financial-health-score-calculator", title: "Financial Health Score Calculator", status: "planned" },
            ],
          },
          {
            slug: "india-specific-banking-calculators",
            title: "India-specific banking calculators",
            description: "Localized banking and loan tools for India traffic.",
            calculators: [
              { slug: "fd-calculator-india-bank-wise", title: "FD Calculator India (bank-wise)", status: "planned" },
              { slug: "rd-calculator-india", title: "RD Calculator India", status: "planned" },
              { slug: "credit-card-interest-india", title: "Credit Card Interest India", status: "planned" },
              { slug: "loan-emi-calculator-india", title: "Loan EMI Calculator India", status: "planned" },
              { slug: "bank-interest-comparison-tool", title: "Bank Interest Comparison Tool", status: "planned" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "education",
    path: "/education",
    title: "Education",
    hubEyebrow: "Education",
    hubHeadline: "Academic mastery",
    hubSubtitle: "Mathematics, science, and exam planning for students and teachers.",
    metaTitle: "Education calculators | mywebcalculator",
    metaDescription:
      "GPA tools, grade targets, exam score math, and more academic calculators.",
    subcategories: [
      {
        slug: "mathematics",
        title: "Mathematics",
        description: "Algebra-friendly utilities, graphing-adjacent math, and numeric drills.",
        sections: EDUCATION_MATHEMATICS_SECTIONS,
      },
      {
        slug: "science",
        title: "Science",
        description: "Physics, chemistry, and biology helpers in one science lane.",
        sections: EDUCATION_SCIENCE_SECTIONS,
      },
      {
        slug: "exam-score",
        title: "Exam & score",
        description: "GPA, finals weighting, and what you need on the next test.",
        sections: EDUCATION_EXAM_SCORE_SECTIONS,
      },
    ],
  },
  {
    id: "health",
    path: "/health",
    title: "Health",
    hubEyebrow: "Health",
    hubHeadline: "Wellness by the numbers",
    hubSubtitle: "Body metrics, nutrition estimates, and careful medical-adjacent math.",
    metaTitle: "Health calculators | mywebcalculator",
    metaDescription:
      "BMI-style tools, macro estimates, and health planning calculators with clear disclaimers.",
    subcategories: [
      {
        slug: "body-metrics",
        title: "Body metrics",
        description: "Height, weight, and body-composition style estimates.",
        sections: HEALTH_BODY_METRICS_SECTIONS,
      },
      {
        slug: "diet-nutrition",
        title: "Diet & nutrition",
        description: "Calories, macros, and meal-planning arithmetic.",
        sections: HEALTH_DIET_NUTRITION_SECTIONS,
      },
      {
        slug: "medical",
        title: "Medical",
        description: "Dosing-adjacent and clinical-style estimates where we add strong disclaimers.",
        sections: HEALTH_MEDICAL_SECTIONS,
      },
    ],
  },
  {
    id: "engineering",
    path: "/engineering",
    title: "Engineering",
    hubEyebrow: "Engineering",
    hubHeadline: "Technical precision",
    hubSubtitle: "Electrical, civil, and developer-friendly engineering calculators.",
    metaTitle: "Engineering calculators | mywebcalculator",
    metaDescription:
      "Electrical, civil, and IT engineering calculators for students and practitioners.",
    subcategories: [
      {
        slug: "electrical",
        title: "Electrical",
        description: "Ohm’s law cousins, power estimates, and circuit math.",
        sections: ENGINEERING_ELECTRICAL_SECTIONS,
      },
      {
        slug: "civil",
        title: "Civil",
        description: "Loads, materials, and field estimates for built environments.",
        sections: ENGINEERING_CIVIL_SECTIONS,
      },
      {
        slug: "it-dev",
        title: "IT & development",
        description: "Base conversions, Big-O style estimates, and keyboard-friendly dev math.",
        sections: ENGINEERING_IT_DEV_SECTIONS,
      },
    ],
  },
  {
    id: "daily",
    path: "/daily",
    title: "Daily life",
    hubEyebrow: "Daily life",
    hubHeadline: "Everyday orbit",
    hubSubtitle: "Home utilities, shopping math, and travel-friendly calculators.",
    metaTitle: "Daily life calculators | mywebcalculator",
    metaDescription:
      "Date math, pet-age fun, discounts, and other day-to-day calculators.",
    subcategories: [
      {
        slug: "home-utility",
        title: "Home & utility",
        description:
          "Electricity and water estimates, rent and bills, maintenance, and household space math.",
        sections: DAILY_HOME_UTILITY_SECTIONS,
      },
      {
        slug: "shopping-discount",
        title: "Shopping & discount",
        description:
          "Discounts, tax and invoices, seller fees, margins, coupons, EMI, shipping, and currency.",
        sections: DAILY_SHOPPING_DISCOUNT_SECTIONS,
      },
      {
        slug: "travel",
        title: "Travel",
        description:
          "Fuel and trips, stays and flights, money abroad, group splits, and business or eco travel.",
        sections: DAILY_TRAVEL_SECTIONS,
      },
    ],
  },
  {
    id: "conversion",
    path: "/conversion",
    title: "Conversion",
    hubEyebrow: "Conversion",
    hubHeadline: "Units without friction",
    hubSubtitle:
      "SI and imperial units, FX and fee-aware currency math, and calendar or timezone helpers.",
    metaTitle: "Conversion calculators | mywebcalculator",
    metaDescription:
      "Unit converters, currency and FX-style tools, plus date, time zone, and productivity calculators.",
    subcategories: [
      {
        slug: "unit-converters",
        title: "Unit converters",
        description:
          "Length through textiles—storage, pressure, energy, fuel economy, construction, and more.",
        sections: CONVERSION_UNIT_CONVERTERS_SECTIONS,
      },
      {
        slug: "currency",
        title: "Currency",
        description:
          "Core pairs, forex study tools, crypto, transfers, travel FX, inflation, and AI-assisted planners.",
        sections: CONVERSION_CURRENCY_SECTIONS,
      },
      {
        slug: "time-date",
        title: "Time & date",
        description:
          "Date differences, business days, zones, payroll hours, calendars, cron, and fun countdowns.",
        sections: CONVERSION_TIME_DATE_SECTIONS,
      },
    ],
  },
  {
    id: "business",
    path: "/business",
    title: "Business",
    hubEyebrow: "Business",
    hubHeadline: "Operate with clarity",
    hubSubtitle:
      "Finance ratios and SaaS metrics, full-funnel marketing math, and HR payroll plus productivity.",
    metaTitle: "Business calculators | mywebcalculator",
    metaDescription:
      "Business finance, marketing and growth metrics, HR payroll, compliance, and workforce planning calculators.",
    subcategories: [
      {
        slug: "business-finance",
        title: "Business finance",
        description:
          "Profit through valuation, cash flow, tax, inventory, manufacturing, SaaS, and international trade.",
        sections: BUSINESS_FINANCE_SECTIONS,
      },
      {
        slug: "marketing",
        title: "Marketing",
        description:
          "Paid media, CRO, email, social, SEO, e-commerce, content, affiliates, and SaaS growth metrics.",
        sections: BUSINESS_MARKETING_SECTIONS,
      },
      {
        slug: "hr-productivity",
        title: "HR & productivity",
        description:
          "Payroll and statutory deductions, time and leave, performance, hiring cost, and compliance.",
        sections: BUSINESS_HR_PRODUCTIVITY_SECTIONS,
      },
    ],
  },
  {
    id: "ai",
    path: "/ai",
    title: "AI",
    hubEyebrow: "AI",
    hubHeadline: "Smart assistants",
    hubSubtitle:
      "Context-aware planners across finance, study, health, business, and dev—plus hybrid generators for copy and data.",
    metaTitle: "AI calculators | mywebcalculator",
    metaDescription:
      "AI-assisted smart tools and generators for finance, education, health, business, marketing, code, and daily life.",
    subcategories: [
      {
        slug: "smart-tools",
        title: "Smart tools",
        description:
          "Budget, investment, study, fitness, travel, business, security, and personalized decision assists.",
        sections: AI_SMART_TOOLS_SECTIONS,
      },
      {
        slug: "generators",
        title: "Generators",
        description:
          "Writing, money plans, study aids, SEO, dev snippets, creative assets, travel, and roadmap hybrids.",
        sections: AI_GENERATORS_SECTIONS,
      },
    ],
  },
];

const hubById = Object.fromEntries(hubs.map((h) => [h.id, h])) as Record<
  CalculatorCategory,
  CategoryHubNode
>;

export const CALCULATOR_CATEGORIES = [
  "finance",
  "education",
  "health",
  "engineering",
  "daily",
  "conversion",
  "business",
  "ai",
] as const satisfies readonly CalculatorCategory[];

export function isCalculatorCategory(value: string): value is CalculatorCategory {
  return (CALCULATOR_CATEGORIES as readonly string[]).includes(value);
}

export function getCategoryHub(category: CalculatorCategory): CategoryHubNode {
  return hubById[category];
}

export function getSubcategories(category: CalculatorCategory): SubcategoryNode[] {
  return getCategoryHub(category).subcategories;
}

export function getSubcategory(
  category: CalculatorCategory,
  slug: string,
): SubcategoryNode | undefined {
  return getSubcategories(category).find((s) => s.slug === slug);
}

export function getSubcategoryOrThrow(category: CalculatorCategory, slug: string): SubcategoryNode {
  const sub = getSubcategory(category, slug);
  if (!sub) {
    throw new Error(`Unknown subcategory: ${category}/${slug}`);
  }
  return sub;
}

export function subcategoryTitleForSlug(
  category: CalculatorCategory,
  slug: string,
): string {
  return getSubcategory(category, slug)?.title ?? slug;
}

export function allCategoryStaticParams(): { category: string }[] {
  return CALCULATOR_CATEGORIES.map((category) => ({ category }));
}

export function allSubcategoryStaticParams(): { category: string; subCategory: string }[] {
  const out: { category: string; subCategory: string }[] = [];
  for (const category of CALCULATOR_CATEGORIES) {
    for (const sub of getSubcategories(category)) {
      out.push({ category, subCategory: sub.slug });
    }
  }
  return out;
}

export function getSubcategorySections(
  category: CalculatorCategory,
  subCategory: string,
): SectionNode[] {
  return getSubcategory(category, subCategory)?.sections ?? [];
}

export function getSection(
  category: CalculatorCategory,
  subCategory: string,
  section: string,
): SectionNode | undefined {
  return getSubcategorySections(category, subCategory).find((entry) => entry.slug === section);
}

export function allCategorySectionStaticParams(): {
  category: CalculatorCategory;
  subCategory: string;
  section: string;
}[] {
  const out: { category: CalculatorCategory; subCategory: string; section: string }[] = [];
  for (const category of CALCULATOR_CATEGORIES) {
    for (const sub of getSubcategories(category)) {
      for (const section of sub.sections ?? []) {
        out.push({ category, subCategory: sub.slug, section: section.slug });
      }
    }
  }
  return out;
}

/** @deprecated Use allCategorySectionStaticParams */
export function allFinanceSectionStaticParams(): {
  category: "finance";
  subCategory: string;
  section: string;
}[] {
  return allCategorySectionStaticParams().filter(
    (p): p is { category: "finance"; subCategory: string; section: string } =>
      p.category === "finance",
  );
}
