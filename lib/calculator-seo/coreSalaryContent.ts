import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/core-salary-calculators";
const HUB_LABEL = "Finance · Core Salary Calculators";

export const CORE_SALARY_ARTICLES: Record<string, RichArticle> = {
  "salary-calculator-monthly-annual": {
    slug: "salary-calculator-monthly-annual",
    vertical: "finance-loan",
    category: "finance",
    shellNote: "Runs in your browser. Monthly and annual figures use a straight ×12 conversion—no pro-rating for bonuses or partial years.",
    sections: [
      {
        heading: "Monthly vs Annual Salary",
        paragraphs: [
          "Annual salary = monthly salary × 12. Monthly salary = annual salary ÷ 12.",
          "Use this when comparing job offers quoted in different formats or budgeting from a monthly paycheck.",
        ],
      },
    ],
    tables: [
      {
        title: "Quick conversion examples",
        columnHeaders: ["Monthly", "Annual"],
        rows: [
          ["₹50,000", "₹6,00,000"],
          ["₹1,00,000", "₹12,00,000"],
          ["$5,000", "$60,000"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Linear scale-up from monthly to annual",
      caption: "Fixed monthly pay extrapolated across twelve months.",
      sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 1],
    },
    faq: [
      {
        question: "Does this include bonuses?",
        answer: "No—enter base salary only. Bonuses and variable pay need separate lines in your budget.",
      },
    ],
    meta: {
      seoTitle: "Salary Calculator — Monthly to Annual Conversion",
      seoDescription: "Convert salary between monthly and annual amounts instantly. Simple ×12 math for job offers and budgeting.",
      keywords: ["salary calculator monthly annual", "monthly to annual salary"],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "in-hand-salary-calculator": {
    slug: "in-hand-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Enter gross monthly salary, your effective income-tax rate, and other deductions (PF, professional tax, insurance) as a combined percentage. Results are planning estimates — your actual payslip uses slab-wise tax and fixed statutory amounts.",
    sections: [
      {
        heading: "What Is In-Hand Salary and Why It Differs from CTC",
        paragraphs: [
          "In-hand salary (also called take-home pay or net salary) is the amount credited to your bank account each month — after your employer deducts income tax (TDS), employee Provident Fund (EPF), professional tax, health insurance premium, and other statutory or voluntary deductions from your gross salary.",
          "For most salaried employees in India, in-hand is substantially lower than the CTC (Cost to Company) quoted in the offer letter — typically 25–40% less. A ₹12 LPA CTC may translate to only ₹72,000–₹80,000 in-hand per month. This gap surprises many freshers joining their first job. Understanding the deduction chain — CTC → Gross → Net — is essential for budgeting, loan eligibility assessment, and salary negotiation.",
          "This calculator uses a simplified percentage model: Net = Gross × (1 − Tax% − Deduction%). For quick estimates, this is accurate within 5% of actual payslip for most salary levels. For precise figures, use Form 16 data or your HR's payslip breakup sheet.",
        ],
      },
      {
        heading: "Worked Example: ₹1,00,000 Gross at 20% Tax and 5% Deductions",
        paragraphs: [
          "Inputs: Gross monthly salary = ₹1,00,000. Income tax rate (effective, blended) = 20%. Other deductions = 5% (employee PF + professional tax combined).",
          "Calculation: Tax deducted = ₹1,00,000 × 20% = ₹20,000. Other deductions = ₹1,00,000 × 5% = ₹5,000. In-hand (net) monthly = ₹1,00,000 − ₹20,000 − ₹5,000 = ₹75,000. Annual in-hand = ₹75,000 × 12 = ₹9,00,000.",
          "What does the 5% 'other deductions' represent in practice? On a ₹1,00,000 gross with a basic salary of ₹40,000: Employee PF = 12% of ₹40,000 = ₹4,800 (4.8% of gross). Professional tax (Maharashtra/Karnataka) ≈ ₹200/month (0.2% of gross). Total ≈ 5% — matching the default input precisely.",
        ],
      },
      {
        heading: "The CTC → Gross → In-Hand Journey on an Indian Payslip",
        paragraphs: [
          "CTC (Cost to Company) includes everything the employer spends: gross salary + employer's PF contribution (12% of basic) + gratuity accrual (~4.81% of basic per year) + group health insurance premium + other employer-funded benefits. CTC is not money you receive in full — it bundles both employee-received components and employer-side costs.",
          "Gross salary is the total of all salary components you receive before employee-side deductions: Basic salary (40–50% of gross) + House Rent Allowance (40–50% of basic for metros, 40% for non-metros) + Special allowance + LTA + Medical allowance = Gross. This appears on your payslip as 'Gross Earnings' or 'Total Earnings'.",
          "Net salary = Gross − (Employee PF + Professional tax + TDS/Income tax + any health insurance employee contribution + voluntary deductions). The standard PF deduction is 12% of basic (employee side), plus an equal 12% employer contribution which goes into your PF account but is part of CTC, not gross. This is why CTC is higher than gross by approximately 12–15% at most salary levels.",
        ],
      },
      {
        heading: "New Tax Regime vs Old Regime: Impact on In-Hand Pay (FY 2024–25)",
        paragraphs: [
          "From FY 2023–24, the New Tax Regime is the default for salaried employees. It offers lower slab rates with a ₹75,000 standard deduction but disallows HRA, 80C, 80D, LTA, and most other exemptions. New regime slabs: 0% up to ₹3 lakh; 5% on ₹3–7 lakh; 10% on ₹7–10 lakh; 15% on ₹10–12 lakh; 20% on ₹12–15 lakh; 30% above ₹15 lakh. Rebate u/s 87A gives zero tax payable if taxable income ≤ ₹7 lakh.",
          "The Old Tax Regime has higher slab rates (5%/20%/30%) but allows ₹1.5 lakh under 80C, ₹25,000–₹50,000 under 80D, HRA exemption, NPS top-up, and home loan interest deduction. For employees with large deductions (e.g., ₹2 lakh HRA + ₹1.5 lakh 80C + ₹50,000 NPS = ₹4 lakh in deductions), the old regime may yield more in-hand despite higher slab rates.",
          "To find the effective tax% to enter in this calculator: compute your expected annual tax under your chosen regime, then divide by annual gross. Example — ₹1,00,000/month gross (₹12 LPA) under new regime: taxable income = ₹12,00,000 − ₹75,000 std deduction = ₹11,25,000. Tax ≈ ₹20,000 (3–7L at 5%) + ₹30,000 (7–10L at 10%) + ₹18,750 (10–11.25L at 15%) = ₹68,750. Effective rate = ₹68,750 ÷ ₹12,00,000 = 5.7%. Enter 6% as tax%.",
        ],
      },
      {
        heading: "Using In-Hand Salary for Budgeting, Loans, and Salary Negotiation",
        paragraphs: [
          "For monthly budgeting: In-hand is the only figure that matters for your household cash flow. The 50/30/20 rule (50% needs, 30% wants, 20% savings) applied to ₹75,000 in-hand: ₹37,500 for needs (rent, groceries, EMIs), ₹22,500 for discretionary, ₹15,000 for savings and investments.",
          "For home or car loan eligibility: Banks use net monthly income (in-hand) — not gross or CTC — to assess loan eligibility. The FOIR (Fixed Obligation to Income Ratio) limit is typically 40–50% of net income. On ₹75,000 in-hand, maximum total EMIs = ₹30,000–₹37,500. At 8.5% for 20 years, this implies a home loan eligibility of approximately ₹25–32 lakh.",
          "For salary negotiation: Always cross-check a new offer's gross against the resulting in-hand. Use this calculator: enter the offered gross and your expected tax% and deduction%. If the in-hand falls short of your requirement, negotiate the gross upward or restructure components (higher special allowance relative to basic reduces PF deductions at the same gross, increasing in-hand by ₹2,000–₹5,000/month on a ₹1 lakh gross).",
        ],
      },
    ],
    tables: [
      {
        title: "In-Hand Salary at Various Gross Levels — 20% Tax, 5% Deductions",
        columnHeaders: ["Gross Monthly (₹)", "Tax 20% (₹)", "Deductions 5% (₹)", "In-Hand Monthly (₹)", "In-Hand Annual (₹)", "Take-Home %"],
        rows: [
          ["30,000", "6,000", "1,500", "22,500", "2,70,000", "75%"],
          ["50,000", "10,000", "2,500", "37,500", "4,50,000", "75%"],
          ["75,000", "15,000", "3,750", "56,250", "6,75,000", "75%"],
          ["1,00,000", "20,000", "5,000", "75,000", "9,00,000", "75%"],
          ["1,50,000", "30,000", "7,500", "1,12,500", "13,50,000", "75%"],
          ["2,00,000", "40,000", "10,000", "1,50,000", "18,00,000", "75%"],
          ["3,00,000", "60,000", "15,000", "2,25,000", "27,00,000", "75%"],
        ],
      },
      {
        title: "How Combined Deduction Rate Affects In-Hand — ₹1,00,000 Gross Monthly",
        columnHeaders: ["Tax Rate", "Other Deductions", "Combined Rate", "In-Hand Monthly (₹)", "In-Hand Annual (₹)", "% Retained"],
        rows: [
          ["5% (≤₹7L rebate)", "5%", "10%", "90,000", "10,80,000", "90%"],
          ["10%", "5%", "15%", "85,000", "10,20,000", "85%"],
          ["15%", "5%", "20%", "80,000", "9,60,000", "80%"],
          ["20%", "5%", "25%", "75,000", "9,00,000", "75%"],
          ["25%", "5%", "30%", "70,000", "8,40,000", "70%"],
          ["30%", "5%", "35%", "65,000", "7,80,000", "65%"],
          ["30%", "10%", "40%", "60,000", "7,20,000", "60%"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "In-hand pay falls as combined tax and deduction rates rise",
      caption:
        "Each additional percentage point of combined deduction reduces net monthly pay by ₹1,000 on a ₹1,00,000 gross. Higher income brackets face higher effective rates, widening the gross-to-in-hand gap.",
      sparkValues: [1, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6],
    },
    faq: [
      {
        question: "Why is my actual in-hand different from this calculator?",
        answer:
          "This calculator uses a simplified percentage model (Net = Gross × (1 − Tax% − Deduction%)). Your payslip uses exact statutory calculations: PF is 12% of basic salary (not gross), income tax is computed slab-wise on annual taxable income after exemptions, and professional tax is a fixed state-specific amount (not a %). These differences mean the calculator is best used for planning. For exact figures, derive your effective rates from Form 16: divide total tax deducted by annual gross for tax%, and total other deductions by annual gross for deduction%.",
      },
      {
        question: "What percentage should I enter for other deductions if I contribute to PF?",
        answer:
          "Employee PF = 12% of basic salary (not gross). If basic is 40% of gross, PF ≈ 4.8% of gross. Add professional tax (~0.2% at ₹1 lakh gross), and any health insurance employee contribution (~0.5–1%). Total 'other deductions' for most employees: 5–7% of gross. If you opt out of PF (allowed when gross > ₹15,000/month with employer agreement, typically in newer startups), enter 1–2% for professional tax only.",
      },
      {
        question: "Does the new tax regime give higher in-hand than the old regime?",
        answer:
          "It depends on your total deductions. For employees with low deductions (paying metro rent but renting cheaply, no home loan, minimal 80C), the new regime's lower slab rates typically deliver higher in-hand. For employees with large deductions (₹2 lakh HRA exemption, ₹1.5 lakh 80C, ₹50,000 NPS, home loan interest), the old regime often wins. The break-even is roughly ₹15–20 LPA CTC: below this, new regime tends to give higher in-hand for most profiles; above this, old regime often wins for high-deduction employees.",
      },
      {
        question: "What is the standard deduction and does it apply here?",
        answer:
          "The standard deduction (₹75,000 for FY 2024–25, available in both regimes) reduces your taxable income before slab application — it is not a direct reduction in gross or in-hand. It reduces your annual tax liability, which lowers your effective tax%. For a ₹12 LPA gross employee, the ₹75,000 standard deduction reduces taxable income to ₹11.25 lakh, saving approximately ₹11,250 in tax under the new regime (15% slab). Enter a slightly lower tax% in this calculator to account for the standard deduction's effect.",
      },
      {
        question: "What is the maximum in-hand from a ₹12 LPA CTC?",
        answer:
          "₹12 LPA CTC with 12% employer PF gives approximately ₹10.71 LPA gross (₹12L ÷ 1.12 = ₹89,286/month gross). Under new regime FY 2024–25: taxable income ≈ ₹10,71,432 − ₹75,000 = ₹9,96,432. Tax ≈ ₹20,000 + ₹29,643 = ₹49,643/year = ₹4,137/month. Employee PF ≈ ₹4,800/month. Professional tax ≈ ₹200/month. Monthly in-hand ≈ ₹89,286 − ₹4,137 − ₹4,800 − ₹200 = ₹80,149. The practical in-hand ceiling from ₹12 LPA CTC is approximately ₹78,000–₹82,000/month depending on salary structure and state.",
      },
    ],
    meta: {
      seoTitle: "In-Hand Salary Calculator — Take-Home Pay from Gross (India 2024–25)",
      seoDescription:
        "Calculate in-hand salary from gross monthly pay after income tax and PF deductions. Understand the CTC to in-hand gap, find your effective tax rate, and compare new vs old tax regime impact on take-home pay.",
      keywords: [
        "in hand salary calculator",
        "take home salary calculator india",
        "net salary from gross calculator",
        "ctc to in hand salary calculator",
        "take home pay after tax pf india",
        "in hand salary new tax regime 2024",
        "monthly net salary calculator india",
        "salary after tds pf calculator",
        "in hand salary 12 lpa",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "gross-salary-calculator": {
    slug: "gross-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Enter gross monthly salary plus your effective income-tax % and other deductions % to see how gross breaks into tax, deductions, and net pay. Uses a simplified percentage model — actual payslips apply statutory slab rates and fixed amounts.",
    sections: [
      {
        heading: "What Is Gross Salary and What Does It Include?",
        paragraphs: [
          "Gross salary is the total of all salary components an employee is entitled to receive before any employee-side deductions are made. It is the figure that appears as 'Gross Earnings' or 'Total Earnings' on your payslip. It is higher than in-hand (net) salary but lower than CTC (Cost to Company) — gross sits in the middle of the compensation ladder.",
          "Typical gross salary components in India: Basic salary (usually 40–50% of gross, the foundation for PF and gratuity calculations) + House Rent Allowance or HRA (40–50% of basic for metro cities, 40% for non-metros, partially or fully tax-exempt) + Special allowance (balancing component, fully taxable) + Leave Travel Allowance or LTA (tax-exempt for actual travel twice in a 4-year block) + Medical allowance or reimbursements + any performance allowance. All these together = Gross.",
          "Gross is not the same as CTC. CTC adds employer-side costs on top of gross: employer PF contribution (12% of basic), gratuity accrual (~4.81% of basic per year), group health insurance premium, ESIC (if applicable), and other employer-funded benefits. At a gross of ₹1,00,000/month, the CTC is typically ₹1,10,000–₹1,15,000/month.",
        ],
      },
      {
        heading: "Worked Example: Breaking Down ₹1,00,000 Gross at 20% Tax and 5% Deductions",
        paragraphs: [
          "Inputs: Gross monthly salary = ₹1,00,000. Income tax rate (effective) = 20%. Other deductions (PF + professional tax) = 5%.",
          "Calculation: Tax = ₹1,00,000 × 20% = ₹20,000. Other deductions = ₹1,00,000 × 5% = ₹5,000. Net (in-hand) = ₹1,00,000 − ₹20,000 − ₹5,000 = ₹75,000 per month. Annual net = ₹75,000 × 12 = ₹9,00,000.",
          "The gross-to-net ratio here is 75%: you keep ₹3 out of every ₹4 you earn gross. This ratio varies by income level: lower-income employees (≤ ₹7 lakh taxable income) benefit from the 87A rebate (zero tax) and keep 93–97% of gross as net; higher-income employees (₹25 LPA+) face 30% marginal tax and may keep only 60–65% of gross. The gross breakdown calculator makes this leakage visible before you accept a salary figure.",
        ],
      },
      {
        heading: "How Gross Salary Is Structured to Optimise Tax Efficiency",
        paragraphs: [
          "Salary structure design significantly affects both gross and in-hand pay. Employers and employees can legally structure salary components to minimise taxable income while keeping gross constant. Key structuring strategies: (1) Maximise HRA: For metro employees paying rent, a higher basic-to-HRA ratio increases the HRA exemption (under old regime). (2) Minimise basic (old regime only): Lower basic → lower employee PF → higher in-hand on same gross. (3) Add LTA: ₹25,000–₹50,000 LTA in gross costs the same to the employer but is tax-exempt on actual travel claims. (4) Food coupons / meal allowance: ₹2,200/month (₹26,400/year) is exempt under perquisite rules.",
          "For employees under the new tax regime, most structuring benefits (HRA, LTA exemption) are unavailable — only the ₹75,000 standard deduction applies. New regime employees benefit more from NPS employer contribution (up to 10% of basic in NPS under 80CCD(2) is deductible even under the new regime, reducing taxable income meaningfully at higher salary levels).",
          "Practical structuring example at ₹1,00,000 gross under the new regime: Basic = ₹40,000, HRA = ₹20,000, Special allowance = ₹40,000. With ₹5,000/month employer NPS contribution (5% of basic, deductible for employee): taxable gross = ₹1,00,000 − ₹5,000 NPS = ₹95,000/month. At 12 months, taxable income = ₹11,40,000 − ₹75,000 std = ₹10,65,000. Tax savings vs no NPS: approximately ₹15,000/year (15% slab × ₹1,00,000 annual NPS contribution), or ₹1,250/month more in-hand.",
        ],
      },
      {
        heading: "Gross Salary Benchmarks by Experience Level and City (India 2024)",
        paragraphs: [
          "Understanding where your gross salary stands relative to market benchmarks helps evaluate job offers and negotiate raises. Typical gross monthly salary ranges by role and city for FY 2024–25 (illustrative, varies by industry, company size, and negotiation): Fresher (0–1 yr, IT services): ₹25,000–₹50,000 gross; 3–5 yr experience (IT products): ₹1,00,000–₹2,00,000 gross; 8–12 yr senior/lead (IT or BFSI): ₹2,50,000–₹5,00,000 gross; VP/Director level: ₹5,00,000+ gross.",
          "Metro vs non-metro adjustment: A ₹1,00,000 gross in Bengaluru, Mumbai, or Delhi typically translates to ₹70,000–₹85,000 after adjusting for city-specific professional tax rates, higher rental costs (if HRA is structured), and state-level differences. The same gross in Pune, Hyderabad, or Chennai may yield similar in-hand but lower cost-of-living impact, effectively stretching purchasing power by 10–20%.",
          "Year-on-year hike planning: If you are currently earning ₹1,00,000 gross and expect a 15% hike, new gross = ₹1,15,000. New in-hand (at same 25% combined deduction) = ₹86,250. The absolute increment to in-hand = ₹11,250/month. However, if the hike pushes you into a higher effective tax bracket, the net increment may be smaller — use this calculator at the new gross to verify the actual in-hand improvement.",
        ],
      },
      {
        heading: "Gross Salary vs CTC vs In-Hand: A Three-Level Framework",
        paragraphs: [
          "Think of compensation as a three-level pyramid. CTC (topmost, largest number): everything the company spends on you — gross + employer PF + gratuity accrual + group insurance + other perks. Gross (middle): all components that appear in your payslip as earnings — basic, HRA, special allowance, LTA, etc. In-hand/Net (bottom, smallest number): what enters your bank account after all employee-side deductions.",
          "Typical ratios at ₹12 LPA CTC for a Bengaluru IT employee (FY 2024–25): CTC = ₹12,00,000. Gross ≈ ₹10,71,000 (₹89,250/month). Employee deductions (PF ₹4,800 + PT ₹200 + TDS ₹4,000) ≈ ₹9,000/month. In-hand ≈ ₹80,250/month. So CTC:Gross:In-hand ≈ 12L:10.7L:9.6L — with 20% lost from CTC to in-hand. At ₹25 LPA CTC, the same ratio might be 25L:22L:16L — 36% lost — because higher income tax rates apply at higher brackets.",
          "When comparing two job offers, always reduce both to in-hand using the same methodology. Offer A at ₹15 LPA CTC with better structure (higher HRA, NPS, meal allowance) may yield ₹1,00,000/month in-hand. Offer B at ₹16 LPA CTC with all basic and no exempt components may yield ₹98,000/month in-hand after higher tax on the unstructured gross. The ₹1 lakh higher CTC could actually mean lower take-home.",
        ],
      },
    ],
    tables: [
      {
        title: "Gross Salary Breakdown at Varying Deduction Rates — ₹1,00,000 Gross Monthly",
        columnHeaders: ["Tax Rate", "Other Deductions", "Tax (₹)", "Other Deductions (₹)", "Net Monthly (₹)", "Net Annual (₹)"],
        rows: [
          ["0% (rebate u/s 87A)", "5%", "0", "5,000", "95,000", "11,40,000"],
          ["10%", "5%", "10,000", "5,000", "85,000", "10,20,000"],
          ["15%", "5%", "15,000", "5,000", "80,000", "9,60,000"],
          ["20%", "5%", "20,000", "5,000", "75,000", "9,00,000"],
          ["25%", "5%", "25,000", "5,000", "70,000", "8,40,000"],
          ["30%", "5%", "30,000", "5,000", "65,000", "7,80,000"],
          ["30%", "8%", "30,000", "8,000", "62,000", "7,44,000"],
        ],
      },
      {
        title: "Gross vs CTC vs In-Hand at Common CTC Levels (New Tax Regime, Metro, 12% Employer PF)",
        columnHeaders: ["Annual CTC (₹)", "Annual Gross (₹)", "Gross/Month (₹)", "Est. Monthly TDS (₹)", "Employee PF/Month (₹)", "In-Hand/Month (₹)"],
        rows: [
          ["4,00,000", "3,57,143", "29,762", "0 (rebate)", "1,429", "28,133"],
          ["6,00,000", "5,35,714", "44,643", "0 (rebate)", "2,143", "42,300"],
          ["8,00,000", "7,14,286", "59,524", "1,400", "2,857", "55,067"],
          ["10,00,000", "8,92,857", "74,405", "2,900", "3,571", "67,734"],
          ["12,00,000", "10,71,429", "89,286", "4,100", "4,286", "80,700"],
          ["15,00,000", "13,39,286", "1,11,607", "8,600", "5,357", "97,450"],
          ["20,00,000", "17,85,714", "1,48,810", "18,200", "7,143", "1,23,267"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gross salary breakdown: tax and deductions rise at higher income",
      caption:
        "As gross rises into higher tax slabs, the share going to income tax increases while the in-hand percentage falls. Optimising salary structure (NPS, meal allowance, LTA) can partially offset this compression.",
      sparkValues: [1, 0.93, 0.88, 0.82, 0.78, 0.73, 0.68, 0.63],
    },
    faq: [
      {
        question: "Is gross salary the same as CTC?",
        answer:
          "No — gross salary is lower than CTC. CTC (Cost to Company) adds the employer's statutory contributions on top of gross: employer PF (12% of basic salary), gratuity accrual (~4.81% of basic per year), group health insurance premium, and other employer-funded perks. At a gross of ₹1,00,000/month, the CTC is typically ₹1,10,000–₹1,15,000/month. On an annual basis, a ₹12 LPA gross usually corresponds to a ₹13–14 LPA CTC. Always ask HR for the CTC-to-gross breakup when evaluating an offer.",
      },
      {
        question: "What components should I include in 'gross salary' when using this calculator?",
        answer:
          "Include all fixed monthly salary components that your employer pays and that appear on your payslip as 'earnings': basic salary, HRA, special allowance, LTA (monthly accrual), medical allowance, any other fixed allowances. Do not include one-time bonuses (performance bonus, joining bonus, retention bonus), employer PF contribution, or gratuity accrual — these are either variable/CTC-side items, not part of gross monthly. Enter the total of all fixed monthly earnings as 'gross salary'.",
      },
      {
        question: "How does salary restructuring increase in-hand without changing gross?",
        answer:
          "By shifting components to tax-exempt categories. Example at ₹1,00,000 gross: Before restructuring — all in special allowance, fully taxable, at 20% effective tax = ₹20,000 TDS, in-hand = ₹75,000. After restructuring — add ₹2,200/month meal allowance (exempt), ₹5,000/month employer NPS (deductible even in new regime under 80CCD(2)): taxable gross falls by ₹7,200/month. Tax saving ≈ ₹7,200 × 20% = ₹1,440/month. New in-hand ≈ ₹76,440 — ₹1,440 more per month without any change in total employer cost.",
      },
      {
        question: "Does gross salary appear on Form 16?",
        answer:
          "Yes — Part B of Form 16 shows your total salary (gross), broken down into allowances, perquisites, and profits in lieu of salary. It also shows the standard deduction, exempt HRA (under old regime), and other exemptions, arriving at the taxable salary figure. The 'total salary' line at the top of Part B of Form 16 = your annual gross (including all components). Divide by 12 to get monthly gross. This is the most accurate source for the gross figure to enter in this calculator.",
      },
      {
        question: "Why does my payslip show a different gross each month?",
        answer:
          "Common reasons for monthly gross variation: (1) LOP (Loss of Pay) for leave taken beyond entitlement reduces that month's gross. (2) Arrear payments from salary revisions are added in the month they are processed. (3) Variable pay or bonus disbursements increase gross in specific months. (4) Overtime payments for eligible employees. (5) Reimbursements (medical, fuel, mobile) added to gross in months of submission. For the calculator, enter the steady-state gross (without one-time items) for planning purposes, and add the variable components separately when budgeting for specific months.",
      },
    ],
    meta: {
      seoTitle: "Gross Salary Calculator — Pay Breakdown into Tax, Deductions & Net (India)",
      seoDescription:
        "Break down gross salary into income tax, PF deductions, and net take-home pay. Understand CTC vs gross vs in-hand, salary structuring for tax efficiency, and gross salary benchmarks across experience levels.",
      keywords: [
        "gross salary calculator india",
        "gross to net salary calculator",
        "gross salary breakdown calculator",
        "ctc vs gross salary calculator",
        "gross salary components india",
        "salary structure calculator india",
        "gross salary after deductions calculator",
        "total earnings vs net pay calculator",
        "gross monthly salary india 2024",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "net-salary-calculator": {
    slug: "net-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Enter your target net (in-hand) monthly salary plus your income-tax % and other deductions % — this calculator reverse-computes the gross you must earn to achieve that net. Gross = Net ÷ (1 − Tax% − Deduction%).",
    sections: [
      {
        heading: "What Is the Net Salary Calculator and When Do You Need It?",
        paragraphs: [
          "The net salary calculator answers a question that standard gross-to-net calculators cannot: 'If I need ₹75,000 in my bank account every month, what gross salary do I need to negotiate?' Instead of starting from gross and computing net, it starts from your desired net and reverse-calculates the required gross.",
          "The formula is: Gross = Net ÷ (1 − Combined_Rate), where Combined_Rate = Tax% + Other_Deductions% expressed as decimals. At a 25% combined rate (20% tax + 5% PF): Gross = ₹75,000 ÷ (1 − 0.25) = ₹75,000 ÷ 0.75 = ₹1,00,000. The annual gross = ₹1,00,000 × 12 = ₹12,00,000.",
          "This is the most useful calculator at the negotiation table. When a recruiter asks 'What are your salary expectations?', you can now give a gross figure that precisely delivers your target in-hand — rather than guessing and underselling.",
        ],
      },
      {
        heading: "Worked Example: Getting to ₹75,000 In-Hand at 25% Combined Rate",
        paragraphs: [
          "Target net = ₹75,000/month. Tax rate = 20% (blended effective). Other deductions = 5% (employee PF + professional tax). Combined rate = 25%.",
          "Required gross = ₹75,000 ÷ (1 − 0.25) = ₹75,000 ÷ 0.75 = ₹1,00,000/month. Annual gross = ₹12,00,000. Tax at 20% on gross = ₹20,000. Other deductions at 5% = ₹5,000. Net = ₹1,00,000 − ₹25,000 = ₹75,000. ✓ The back-calculation confirms the result.",
          "For a higher in-hand target of ₹1,00,000/month at the same 25% combined rate: Required gross = ₹1,00,000 ÷ 0.75 = ₹1,33,333/month = ₹16,00,000 annual gross. At the same tax%/deduction% structure, the required gross is always exactly (target net × 4 ÷ 3) when combined rate = 25% — a useful mental shortcut.",
        ],
      },
      {
        heading: "Using the Net Calculator for Salary Negotiation",
        paragraphs: [
          "The most common salary negotiation error is quoting a gross figure without accounting for deductions. Many candidates say 'I want ₹1 lakh per month' meaning they want ₹1 lakh in-hand, but recruiters interpret this as ₹1 lakh gross — which after 25% deductions gives only ₹75,000 in-hand. The net salary calculator prevents this mismatch by establishing the exact gross needed for your in-hand goal.",
          "Step-by-step negotiation approach: (1) Decide on your minimum acceptable in-hand (e.g., ₹80,000/month based on your rent + EMIs + savings goal). (2) Estimate your effective tax% at the new gross level (use the approximate slab calculation or the previous year's effective rate as a proxy). (3) Estimate deductions% (employee PF + professional tax + any insurance contribution ≈ 5–7%). (4) Enter these into the net calculator to get required gross. (5) Quote the gross figure in negotiations, and ask HR for the CTC-to-gross breakup to verify the employer PF addition on top.",
          "Counter-offer validation: If the company's best offer is ₹1,10,000 gross at your anticipated deduction rate of 22% combined (using the new tax regime at your salary level), net = ₹1,10,000 × (1 − 0.22) = ₹85,800. Is ₹85,800 in-hand sufficient? If your minimum was ₹80,000, you have a ₹5,800 buffer. If your minimum was ₹90,000, you need to push the offer to at least ₹90,000 ÷ 0.78 = ₹1,15,385 gross.",
        ],
      },
      {
        heading: "How Combined Deduction Rate Changes the Required Gross",
        paragraphs: [
          "Small changes in the combined deduction rate have a surprisingly large effect on the required gross for a fixed net target. At ₹75,000 net: If combined rate = 20%, gross needed = ₹75,000 ÷ 0.80 = ₹93,750. If combined rate = 25%, gross needed = ₹1,00,000. If combined rate = 30%, gross needed = ₹1,07,143. A 10 percentage-point increase in the combined rate raises the required gross by ₹13,393 — a 14% increase in the gross needed to deliver the same net.",
          "This is why the deduction percentage you enter matters. Overestimating your tax% leads you to request a higher gross than necessary (harmless but leaves money on the table if the company has a maximum budget). Underestimating leads you to accept a gross that produces less in-hand than you planned. Use your most recent Form 16 to derive an accurate effective tax%, and your payslip to verify the deduction%.",
          "Cross-check with the annual figure: The calculator also outputs annual gross (monthly gross × 12). Use this to confirm the gross falls into the expected tax slab range — if the annual gross calculated implies a very different effective tax rate than what you entered, iterate the tax% until it is internally consistent.",
        ],
      },
      {
        heading: "Net Salary and Loan Eligibility Planning",
        paragraphs: [
          "Banks and NBFCs evaluate loan eligibility based on net monthly income (the in-hand figure this calculator starts from), not gross or CTC. The standard FOIR limit is 40–50% of net income. If your current net is ₹75,000, maximum total EMI burden = ₹30,000–₹37,500. If you have an existing car loan EMI of ₹12,000, your remaining EMI capacity = ₹18,000–₹25,500 — limiting your new home loan amount.",
          "Planning a home loan while switching jobs? If you are moving from ₹75,000 net to a target of ₹90,000 net at the new job, your FOIR-based home loan eligibility increases from approximately ₹25 lakh to ₹30 lakh (at 8.5%, 20-year term, 40% FOIR). Use the net salary calculator to confirm the gross required for ₹90,000 net, then use a loan eligibility calculator to quantify the borrowing power uplift.",
          "Salary breakpoint for NPS contribution: Under Section 80CCD(2), employer NPS contribution up to 10% of basic salary is deductible from taxable income even under the new tax regime. On a ₹1,00,000 gross with ₹40,000 basic and 5% employer NPS (₹2,000/month), annual taxable income falls by ₹24,000. At 15% slab, tax saving = ₹3,600/year = ₹300/month more in-hand — effectively a free boost to in-hand enabled by NPS structuring. Use this calculator both with and without NPS to see the in-hand difference.",
        ],
      },
    ],
    tables: [
      {
        title: "Required Gross for Various Net Targets — at 25% Combined Rate (20% Tax + 5% Deductions)",
        columnHeaders: ["Target Net Monthly (₹)", "Required Gross Monthly (₹)", "Tax Amount (₹)", "Other Deductions (₹)", "Annual Gross (₹)", "Annual Net (₹)"],
        rows: [
          ["30,000", "40,000", "8,000", "2,000", "4,80,000", "3,60,000"],
          ["50,000", "66,667", "13,333", "3,333", "8,00,004", "6,00,000"],
          ["60,000", "80,000", "16,000", "4,000", "9,60,000", "7,20,000"],
          ["75,000", "1,00,000", "20,000", "5,000", "12,00,000", "9,00,000"],
          ["90,000", "1,20,000", "24,000", "6,000", "14,40,000", "10,80,000"],
          ["1,00,000", "1,33,333", "26,667", "6,667", "16,00,000", "12,00,000"],
          ["1,50,000", "2,00,000", "40,000", "10,000", "24,00,000", "18,00,000"],
        ],
      },
      {
        title: "How Deduction Rate Changes Required Gross — ₹75,000 Net Target",
        columnHeaders: ["Tax Rate", "Other Deductions", "Combined Rate", "Required Gross (₹)", "Annual Gross (₹)", "Extra vs 20% Base (₹/month)"],
        rows: [
          ["15%", "5%", "20%", "93,750", "11,25,000", "Baseline"],
          ["20%", "5%", "25%", "1,00,000", "12,00,000", "+6,250"],
          ["25%", "5%", "30%", "1,07,143", "12,85,716", "+13,393"],
          ["28%", "5%", "33%", "1,11,940", "13,43,280", "+18,190"],
          ["30%", "5%", "35%", "1,15,385", "13,84,620", "+21,635"],
          ["30%", "8%", "38%", "1,20,968", "14,51,616", "+27,218"],
          ["30%", "12%", "42%", "1,29,310", "15,51,720", "+35,560"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Required gross rises steeply as combined deduction rate increases",
      caption:
        "The higher the combined tax and deduction rate, the more gross salary you need to achieve the same in-hand target. A 5-percentage-point increase in the combined rate adds approximately ₹6,000–₹8,000 to the required gross for a ₹75,000 net target.",
      sparkValues: [0.6, 0.67, 0.75, 0.8, 0.86, 0.93, 1.0],
    },
    faq: [
      {
        question: "What is the formula this calculator uses?",
        answer:
          "Gross = Net ÷ (1 − Tax% ÷ 100 − Deduction% ÷ 100). The derived tax amount = Gross × Tax% ÷ 100. The derived deduction amount = Gross × Deduction% ÷ 100. Annual gross = monthly gross × 12. Verification: Net + Tax amount + Deduction amount = Gross. If your combined rate exceeds 100%, no positive gross can satisfy the net target, and the calculator returns an error.",
      },
      {
        question: "Should I enter current or expected future tax rate?",
        answer:
          "Use the rate that will apply at the new gross level, not your current rate. If a salary increase moves you into a higher effective tax bracket, the required gross will be higher than a naive estimate using your current rate. Quick approach: estimate the new annual gross (net target × 12 ÷ (1 − current_rate)), then check which slab this falls into. If it crosses a major threshold (e.g., from 10% to 15% slab), iterate the tax% upward. Two to three iterations of this estimate-and-check process converges quickly.",
      },
      {
        question: "Does this calculator account for the standard deduction?",
        answer:
          "Not directly — the standard deduction (₹75,000 for FY 2024–25) reduces your annual taxable income, lowering the effective tax rate. To account for it: compute your annual tax after applying the standard deduction, divide by annual gross to get the true effective tax%, and enter that lower% in this calculator. This makes the required gross slightly lower than it would be without accounting for the standard deduction — a meaningful improvement for employees in the ₹7–15 lakh range where the ₹75,000 reduction shifts them into a lower effective bracket.",
      },
      {
        question: "Can I use this to negotiate salary if my employer quotes CTC, not gross?",
        answer:
          "Yes, with one extra step. First compute required gross from this calculator. Then estimate the CTC equivalent by adding employer PF (12% of basic; if basic is 40% of gross, employer PF ≈ 4.8% of gross) and gratuity (~0.4% of gross annually). Approximate CTC = gross × 1.052 (adding 5.2% for employer PF + gratuity). Example: required gross = ₹1,00,000. Approximate CTC = ₹1,00,000 × 1.052 = ₹1,05,200. Quote ₹1,05,200 as your minimum expected CTC. Then verify the actual gross in the offer letter to confirm it matches ₹1,00,000.",
      },
      {
        question: "I have no PF deduction at my company — what deduction% should I enter?",
        answer:
          "If your employer does not deduct PF (allowed for employees whose gross exceeds ₹15,000/month and where the employer is not a covered establishment, or if you have a specific exemption), enter only professional tax as other deductions. Professional tax varies by state: Maharashtra ₹200/month for income > ₹10,000; Karnataka ₹200/month for income > ₹15,000; West Bengal ₹110–₹208/month by slab; Tamil Nadu / AP ₹0 (abolished). Divide your annual PT by annual gross to get the deduction%. For most salaried employees without PF, this is 0.2–0.5% — much lower than the 5% default.",
      },
    ],
    meta: {
      seoTitle: "Net Salary Calculator — Find Gross Salary from Target In-Hand Pay (India)",
      seoDescription:
        "Reverse-calculate the gross salary needed to achieve your target in-hand (net) monthly pay. Enter desired net, income tax %, and deduction % to instantly find required gross. Essential for salary negotiation and job offer comparison.",
      keywords: [
        "net salary calculator india",
        "gross salary from net salary calculator",
        "reverse salary calculator india",
        "salary negotiation calculator india",
        "what gross salary to get 75000 in hand",
        "required gross for take home salary",
        "net to gross salary calculator 2024",
        "in hand to gross calculator",
        "salary calculator after tax india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "ctc-calculator": {
    slug: "ctc-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. CTC = gross salary + employer contributions (PF, gratuity, etc.) expressed as a percentage of gross. Enter gross monthly salary and employer contribution % to estimate monthly and annual CTC. This is a simplified model — actual CTC components vary by employer.",
    sections: [
      {
        heading: "What Is CTC and What Does It Actually Include?",
        paragraphs: [
          "CTC stands for Cost to Company — the total annual amount an employer spends to employ you. It is not the money you receive; it is the total expenditure from the company's side. CTC includes every benefit and contribution the employer makes on your behalf, whether or not the money reaches your bank account directly.",
          "Typical CTC components in India: Gross salary (basic + HRA + special allowance + LTA + other allowances) + Employer's PF contribution (12% of basic salary) + Gratuity accrual (~4.81% of basic salary per year, accrued monthly) + Group health insurance premium (employer-paid portion) + ESIC contribution (3.25% of gross for eligible employees earning ≤ ₹21,000/month) + Performance bonus variable (sometimes included in CTC as a 'fixed variable' or 'target bonus') + Other perquisites (company car, laptop, meal card, club membership) valued at cost.",
          "This calculator simplifies: CTC = Gross + (Gross × Employer Contribution%). At 12% employer contribution on ₹1,00,000 gross: CTC = ₹1,00,000 + ₹12,000 = ₹1,12,000/month = ₹13,44,000/year. The 12% typically represents employer PF (12% of basic ≈ 4.8% of gross at 40% basic) + gratuity (~1.6% of gross) + group insurance + other — though in this simplified model it is entered as a flat % of gross.",
        ],
      },
      {
        heading: "Worked Example: ₹1,00,000 Gross Monthly at 12% Employer Contribution",
        paragraphs: [
          "Inputs: Gross monthly salary = ₹1,00,000. Employer contribution rate = 12%.",
          "Calculation: Employer contribution = ₹1,00,000 × 12% = ₹12,000/month. Monthly CTC = ₹1,00,000 + ₹12,000 = ₹1,12,000. Annual CTC = ₹1,12,000 × 12 = ₹13,44,000.",
          "What does ₹13,44,000 CTC mean for in-hand? The employee-side deductions: Employee PF (12% of basic, say basic = ₹40,000) = ₹4,800/month. Income tax (at ~6% effective rate for this gross under new regime) = ~₹6,000/month. Professional tax = ₹200/month. Total deductions ≈ ₹11,000/month. In-hand = ₹1,00,000 − ₹11,000 = ₹89,000/month. So from a ₹13,44,000 CTC, take-home is approximately ₹89,000/month — confirming the CTC-to-in-hand gap of approximately 20% at this salary level.",
        ],
      },
      {
        heading: "Breaking Down the Employer Contribution Percentage",
        paragraphs: [
          "The 12% default in this calculator represents a typical combined employer contribution rate. In detail: Employer PF: 12% of basic salary goes into the employee's EPF account. If basic = 40% of gross, employer PF = 12% × 40% = 4.8% of gross. Employer Gratuity accrual: 4.81% of basic per year = 4.81% × 40% ÷ 12 per month = ~0.16% of gross/month. Group Health Insurance: typically ₹3,000–₹8,000/year per employee, or ~0.25–0.67% of a ₹12 LPA gross. Other perquisites (meal card, laptop) add another 0.5–2%.",
          "Combined employer contribution as % of gross (illustrative for ₹1,00,000 gross, ₹40,000 basic): Employer PF = 4.8%. Gratuity = 0.16% monthly accrual. Group insurance = 0.5%. Other = 0.5%. Total ≈ 6%. However, many companies also include the variable pay in CTC — a 20% annual performance bonus on ₹10,71,000 annual gross adds ₹2,14,200 to CTC, making the total CTC look like ₹15,61,000 even though the fixed monthly gross is ₹89,250. This is a common source of CTC inflation in offer letters.",
          "Government/PSU employees: For central government employees, the employer-side contribution includes 10–14% to NPS (National Pension System), making CTC significantly higher than gross — often by 25–30%. The employer NPS contribution is a real asset accruing in the employee's NPS account, unlike private company 'CTC' items such as gratuity that are only payable after 5 years of service.",
        ],
      },
      {
        heading: "The CTC vs In-Hand Gap: Why It Widens at Higher Salary Levels",
        paragraphs: [
          "The percentage gap between CTC and in-hand widens at higher salary levels for two compounding reasons: (1) Income tax rates are progressive — as CTC rises, the marginal and effective tax rates increase, deducting a larger share of gross from in-hand. (2) Many CTC components are fixed-amount employer costs (group insurance, ESIC) that are a larger percentage of gross at lower salaries and a smaller percentage at higher salaries — but this effect is outweighed by the progressive tax effect for incomes above ₹15 LPA.",
          "Typical CTC-to-in-hand ratios at common CTC levels (FY 2024–25, new regime, metro city): ₹4 LPA CTC → ~₹28,000 in-hand/month (~84% of CTC/12). ₹8 LPA → ~₹55,000 in-hand (~82.5%). ₹12 LPA → ~₹80,000 in-hand (~80%). ₹20 LPA → ~₹1,23,000 in-hand (~73.8%). ₹30 LPA → ~₹1,72,000 in-hand (~68.8%). ₹50 LPA → ~₹2,60,000 in-hand (~62.4%). The in-hand percentage of CTC/12 falls from ~84% at ₹4 LPA to ~62% at ₹50 LPA.",
          "Practical implication: when evaluating a salary hike from ₹12 LPA to ₹20 LPA (67% CTC increase), the in-hand increase is only from ₹80,000 to ₹1,23,000 — a 54% in-hand increase. A 67% CTC hike delivers only 54% more in-hand because the additional salary is taxed at higher rates. This is why large CTC hikes feel less impactful than expected, and why negotiating for tax-efficient CTC components (NPS, meal card, LTA) matters more at higher salary levels.",
        ],
      },
      {
        heading: "How to Verify and Negotiate Your CTC Offer Letter",
        paragraphs: [
          "Indian offer letters are not standardised — CTC breakups vary widely between companies and can include items that have different practical values. Before accepting any offer, request the full CTC breakup in a table format and verify: Is the performance bonus guaranteed or target-based? Guaranteed bonus = certain cash. Target bonus = may not materialise. Is the employer PF capped at ₹1,800/month (12% of ₹15,000 statutory ceiling) or uncapped? Capped PF saves you employee PF deduction on higher basic but reduces your PF retirement corpus.",
          "Items frequently included in CTC that do not reach your bank: Gratuity accrual (only paid after 5+ years of continuous service). Group health insurance premium (protects you but is not cash). ESIC (benefit-in-kind, not cash). EDLI (Employee Deposit Linked Insurance). Laptop / phone (perquisite valued at cost). If you subtract these non-cash items from the CTC, you get a more realistic 'liquid CTC' — the portion that either reaches your bank account directly or is added to your PF corpus.",
          "Counter-offer strategy using this calculator: If Company A offers ₹13 LPA CTC with high non-cash components and Company B offers ₹12 LPA CTC with all-cash gross, use the gross-to-CTC and in-hand calculators together. Enter Company A's estimated gross (CTC minus non-cash items), apply your deduction%, and check in-hand. Do the same for Company B. The lower CTC company may actually deliver higher in-hand if its gross is structured better — CTC alone is a poor comparison metric.",
        ],
      },
    ],
    tables: [
      {
        title: "CTC Calculation at Various Gross Levels — 12% Employer Contribution",
        columnHeaders: ["Gross Monthly (₹)", "Employer Contribution 12% (₹)", "Monthly CTC (₹)", "Annual CTC (₹)", "Annual Gross (₹)", "CTC Premium over Gross"],
        rows: [
          ["30,000", "3,600", "33,600", "4,03,200", "3,60,000", "12%"],
          ["50,000", "6,000", "56,000", "6,72,000", "6,00,000", "12%"],
          ["75,000", "9,000", "84,000", "10,08,000", "9,00,000", "12%"],
          ["1,00,000", "12,000", "1,12,000", "13,44,000", "12,00,000", "12%"],
          ["1,50,000", "18,000", "1,68,000", "20,16,000", "18,00,000", "12%"],
          ["2,00,000", "24,000", "2,24,000", "26,88,000", "24,00,000", "12%"],
          ["3,00,000", "36,000", "3,36,000", "40,32,000", "36,00,000", "12%"],
        ],
      },
      {
        title: "CTC vs Gross vs In-Hand — Three-Level Salary Pyramid (New Regime, Metro)",
        columnHeaders: ["Annual CTC (₹)", "Monthly Gross (₹)", "Monthly Tax+PF Deductions (₹)", "Monthly In-Hand (₹)", "In-Hand as % of CTC/12", "CTC-to-In-Hand Gap (₹/month)"],
        rows: [
          ["4,00,000", "29,762", "1,629", "28,133", "84.4%", "5,200"],
          ["6,00,000", "44,643", "2,343", "42,300", "84.6%", "7,867"],
          ["8,00,000", "59,524", "4,457", "55,067", "82.6%", "10,266"],
          ["10,00,000", "74,405", "6,671", "67,734", "81.3%", "12,599"],
          ["12,00,000", "89,286", "8,586", "80,700", "80.7%", "15,633"],
          ["15,00,000", "1,11,607", "14,157", "97,450", "77.9%", "27,050"],
          ["20,00,000", "1,48,810", "25,543", "1,23,267", "73.9%", "43,543"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "CTC sits above gross; in-hand sits below gross",
      caption:
        "Employer contributions lift CTC above gross by a fixed percentage, while employee deductions and income tax pull in-hand below gross by a progressive percentage. The CTC-to-in-hand gap widens at higher salary levels as marginal tax rates increase.",
      sparkValues: [0.62, 0.68, 0.74, 0.79, 0.84, 0.88, 0.94, 1.0],
    },
    faq: [
      {
        question: "Is CTC the same as in-hand salary?",
        answer:
          "No — CTC (Cost to Company) is almost always much higher than in-hand (take-home) salary. CTC includes employer-side costs that never reach your bank account (employer PF, gratuity accrual, group insurance). In-hand is gross minus all employee-side deductions (employee PF, income tax, professional tax). For a ₹12 LPA CTC employee, in-hand is typically ₹78,000–₹82,000/month — about 78–82% of CTC/12. The gap between CTC and in-hand is larger at higher salary levels due to progressive income tax.",
      },
      {
        question: "What is the typical employer contribution percentage in India?",
        answer:
          "For private sector companies: Employer PF = 12% of basic (often 4.8–6% of gross depending on basic ratio). Gratuity accrual = ~4.81% of basic per year (0.16% of gross per month if basic is 40% of gross). Group health insurance = 0.5–2% of annual gross depending on plan quality. Combined: typically 6–10% of gross for most private sector employees. This calculator's default of 12% is higher than the typical actual employer contribution as a % of gross — use 6–8% for a more accurate estimate at the ₹8–15 LPA range. The 12% default is most accurate when the employer's PF is uncapped (12% of full basic without the ₹15,000 ceiling).",
      },
      {
        question: "Should I include variable pay/bonus in CTC calculation?",
        answer:
          "For planning purposes, distinguish fixed CTC from variable CTC. Fixed CTC = gross + employer PF + gratuity + insurance = the component this calculator estimates. Variable CTC includes performance bonus, ESOP value, profit sharing — which depend on individual and company performance. When evaluating offers, compare fixed CTC against fixed CTC (not against total CTC which inflates the number with uncertain variable pay). Use the gross from fixed CTC to estimate real in-hand, and treat variable pay as a separate upside to plan around conservatively.",
      },
      {
        question: "Is gratuity part of CTC in all companies?",
        answer:
          "Most Indian companies include gratuity accrual in CTC — it is a statutory obligation under the Payment of Gratuity Act, 1972, for establishments with 10+ employees. The accrual rate is 15/26 of basic salary per year of service (≈ 4.81% of basic per year). However, gratuity is only paid upon resignation after 5 years of continuous service, retirement, or death/disablement. If you leave before completing 5 years, you forfeit the accrued gratuity. Some companies use a 5-year vesting cliff; others now offer shorter vesting for flexibility. Always check whether the gratuity in CTC has a vesting condition.",
      },
      {
        question: "My CTC includes RSUs/ESOPs — should I enter their value here?",
        answer:
          "RSUs (Restricted Stock Units) and ESOPs (Employee Stock Option Plans) are often quoted as part of annual CTC in tech companies — but they are not cash salary. They vest over time, and their actual value depends on the stock price at vesting, which may be higher or lower than the grant-date value. For this calculator, enter only the cash salary components (gross) and the employer's cash contributions (PF, insurance) as gross and employer contribution%. Track RSU/ESOP vesting and current value separately. Include realised RSU income in your tax planning in the year the shares vest — they are taxable as perquisites at fair market value on vesting date.",
      },
    ],
    meta: {
      seoTitle: "CTC Calculator — Cost to Company from Gross Salary (India 2024–25)",
      seoDescription:
        "Calculate monthly and annual CTC from gross salary and employer contribution rate. Understand the CTC vs gross vs in-hand gap, what employer PF and gratuity add to CTC, and how to verify Indian salary offer letters.",
      keywords: [
        "ctc calculator india",
        "cost to company calculator",
        "ctc to gross salary calculator",
        "ctc vs in hand salary calculator",
        "ctc breakup calculator india",
        "employer pf gratuity ctc calculator",
        "annual ctc from monthly gross",
        "salary offer letter ctc calculator india",
        "ctc to take home salary 2024",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "annual-salary-calculator": {
    slug: "annual-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Divides annual salary by 12 to show the equivalent monthly pay. Figures are gross — no tax or deductions applied. Use the in-hand or net calculators for after-tax estimates.",
    sections: [
      {
        heading: "What Is Annual Salary and Why Job Offers Use It",
        paragraphs: [
          "Annual salary (also called yearly salary or annual package) is the total gross compensation an employee earns over one full year before any deductions. In India, annual salary is the standard unit used in offer letters, LinkedIn profiles, and salary surveys — almost always quoted as CTC (Cost to Company) per annum. In the US and UK, annual salary is also the norm for professional roles, while hourly-wage jobs use hourly rates.",
          "Dividing annual salary by 12 gives the monthly equivalent — the number that appears on your monthly payslip as 'Gross Earnings' (if no variable components). The formula is: Monthly = Annual ÷ 12. For ₹12,00,000 annual gross: Monthly = ₹12,00,000 ÷ 12 = ₹1,00,000. This is purely a gross conversion — income tax, PF, and professional tax are not deducted here. For in-hand equivalents, use the In-Hand Salary Calculator.",
          "Why annual framing dominates offer letters: Employers quote annual CTC because it presents a larger, more impressive number and allows flexibility in how monthly components are split (basic, HRA, special allowance proportions can vary as long as the annual total is maintained). From a budgeting perspective, monthly figures are more useful — this calculator bridges that gap instantly.",
        ],
      },
      {
        heading: "Worked Example: ₹12,00,000 Annual to Monthly",
        paragraphs: [
          "Input: Annual salary = ₹12,00,000 (₹12 LPA). Calculation: Monthly = ₹12,00,000 ÷ 12 = ₹1,00,000/month.",
          "Additional reference points from the same annual figure: Weekly equivalent (÷52) = ₹23,077. Daily equivalent assuming 5-day, 52-week year (÷260 working days) = ₹4,615/day. Hourly equivalent at 8 hours/day, 260 days = ₹577/hour.",
          "Converting a US offer: Annual salary of $60,000 = $5,000/month gross. After US federal and state taxes (effective ~22% for a single filer at this income), take-home ≈ $3,900/month. Bi-weekly paycheck (US standard, 26 per year) = $60,000 ÷ 26 = $2,307.69 per paycheck.",
          "Converting a UK offer: Annual salary of £35,000 = £2,916.67/month gross. After UK income tax (20% basic rate above £12,570 personal allowance) and National Insurance (8% on £12,570–£50,270): monthly take-home ≈ £2,340.",
        ],
      },
      {
        heading: "Annual Salary Benchmarks in India by Role and Experience (2024–25)",
        paragraphs: [
          "Knowing where your annual salary stands relative to market benchmarks helps you evaluate offers and negotiate with data. Illustrative annual gross (not CTC) ranges for common roles in FY 2024–25: Fresher software engineer (IT services, Tier 1 cities): ₹3–5 LPA. Mid-level software engineer (3–5 yrs, IT products): ₹12–25 LPA. Senior engineer / tech lead (7–10 yrs): ₹25–50 LPA. Product manager (5+ yrs): ₹20–45 LPA. Finance professional (CA, 5 yrs): ₹12–20 LPA. Sales professional (B2B, 5 yrs): ₹8–18 LPA + variable.",
          "Annual salary growth expectations: The average annual increment in India's private sector is 8–12% for performers, 5–7% for average performers, and 0–2% for underperformers. At 10% annual increment, a ₹6 LPA annual salary becomes ₹9.66 LPA in 5 years (₹6L × 1.1^5). At 15% (job-hopping pace), it becomes ₹12.07 LPA in 5 years. Every 3–4 years without a job change typically means 30–40% below market rate for high-growth tech roles.",
          "Annual salary and income tax slabs (FY 2024–25, new regime): Gross ≤ ₹3,00,000 — 0%. ₹3–7 lakh — 5%. ₹7–10 lakh — 10%. ₹10–12 lakh — 15%. ₹12–15 lakh — 20%. Above ₹15 lakh — 30%. Standard deduction ₹75,000 shifts the effective start of taxation to ₹3,75,000 annual gross. Section 87A rebate makes effective tax zero for taxable income (after standard deduction) up to ₹7 lakh, meaning annual gross up to ₹7,75,000 is tax-free under the new regime.",
        ],
      },
      {
        heading: "Annual vs Monthly Framing: When Each Format Is Most Useful",
        paragraphs: [
          "Annual framing is most useful for: (1) Comparing offers across companies where each quotes CTC differently. (2) Tax planning — income tax is computed on annual taxable income. (3) Savings goal-setting — saving 20% of annual income is a common wealth-building target. (4) Retirement planning — projecting corpus growth, pension calculations, and gratuity eligibility (minimum ₹X per year × years of service) all use annual figures.",
          "Monthly framing is most useful for: (1) Monthly budget planning — rent, EMIs, groceries, SIPs all operate on a monthly cycle. (2) Loan eligibility assessment — banks evaluate net monthly income, not annual. (3) Payslip verification — ensuring your monthly payslip matches the annual offer letter commitment. (4) Comparing with month-to-month variable expenses.",
          "Common annual-to-monthly conversion errors to avoid: (1) Confusing CTC with gross — CTC ÷ 12 includes employer PF and gratuity, which do not appear as monthly cash. The real monthly gross = (CTC − employer PF − gratuity − insurance) ÷ 12. (2) Treating annual bonus as monthly — a ₹1 lakh annual bonus paid once is not ₹8,333/month; it arrives once and affects one month's budget. (3) Not accounting for variable pay risk — if annual CTC includes a 20% performance bonus, only 80% of the CTC ÷ 12 figure is fixed monthly gross.",
        ],
      },
      {
        heading: "Using Annual Salary for Financial Planning and Loan Applications",
        paragraphs: [
          "Home loan eligibility: Banks typically lend 60 times net monthly income (at FOIR 40–50%), or approximately 4–5 times annual gross. At ₹12 LPA gross, typical home loan eligibility is ₹48–60 lakh (subject to CIBIL score, employer profile, existing obligations). Converting annual salary to monthly (this calculator) is the first step; then apply deductions (use in-hand calculator) to get net monthly income for FOIR calculation.",
          "Investment as a percentage of annual income: Financial planners recommend saving 20–30% of annual gross. At ₹12 LPA gross: 20% saving = ₹2.4 LPA = ₹20,000/month. Standard recommendation: ₹12,500/month SIP in equity mutual funds (for long-term wealth), ₹5,000/month PPF or NPS (for tax savings and retirement), ₹2,500/month term insurance + health insurance. The annual figure makes it easy to see if your savings rate is adequate.",
          "Appraisal and increment negotiation: When your annual performance review comes around, use the annual salary figure to compute your expected increment. A 15% hike on ₹12 LPA gross = ₹1.8 lakh more per year = ₹15,000 more per month gross. After 25% deductions, in-hand increase = ₹11,250/month. Is the increment offer keeping pace with inflation (6–7% in India) and market movement (10–15% for your level)? Annual figures make this comparison clear.",
        ],
      },
    ],
    tables: [
      {
        title: "Annual to Monthly Salary Conversion — All Standard Levels (Gross, No Tax)",
        columnHeaders: ["Annual Salary (₹)", "Monthly Gross (₹)", "Weekly (÷52) (₹)", "Daily (÷260 working days) (₹)", "Hourly (÷2080 hrs) (₹)"],
        rows: [
          ["3,00,000", "25,000", "5,769", "1,154", "144"],
          ["6,00,000", "50,000", "11,538", "2,308", "288"],
          ["9,00,000", "75,000", "17,308", "3,462", "433"],
          ["12,00,000", "1,00,000", "23,077", "4,615", "577"],
          ["18,00,000", "1,50,000", "34,615", "6,923", "865"],
          ["24,00,000", "2,00,000", "46,154", "9,231", "1,154"],
          ["36,00,000", "3,00,000", "69,231", "13,846", "1,731"],
          ["60,00,000", "5,00,000", "1,15,385", "23,077", "2,885"],
        ],
      },
      {
        title: "Annual Salary Brackets vs Income Tax (New Regime FY 2024–25)",
        columnHeaders: ["Annual Gross (₹)", "Taxable Income after Std. Deduction (₹)", "Estimated Annual Tax (₹)", "Effective Tax Rate", "Monthly Gross (₹)", "Approx. Monthly In-Hand (₹)"],
        rows: [
          ["4,00,000", "3,25,000", "0 (rebate)", "0%", "33,333", "31,000"],
          ["6,00,000", "5,25,000", "0 (rebate)", "0%", "50,000", "46,000"],
          ["8,00,000", "7,25,000", "12,500", "1.6%", "66,667", "59,500"],
          ["10,00,000", "9,25,000", "35,000", "3.5%", "83,333", "74,400"],
          ["12,00,000", "11,25,000", "68,750", "5.7%", "1,00,000", "87,700"],
          ["15,00,000", "14,25,000", "1,23,750", "8.3%", "1,25,000", "1,06,900"],
          ["20,00,000", "19,25,000", "2,62,500", "13.1%", "1,66,667", "1,33,000"],
          ["25,00,000", "24,25,000", "4,12,500", "16.5%", "2,08,333", "1,60,000"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Annual salary divided equally across 12 months",
      caption:
        "Annual salary converts to monthly gross via a simple ÷12. However, take-home (in-hand) grows more slowly than gross as annual salary rises, because higher income pushes a larger share into higher tax slabs.",
      sparkValues: [0.25, 0.38, 0.5, 0.62, 0.75, 0.87, 1.0],
    },
    faq: [
      {
        question: "Does dividing annual CTC by 12 give monthly in-hand salary?",
        answer:
          "No — CTC ÷ 12 gives monthly CTC, which is not the same as monthly in-hand. CTC includes employer-side costs (employer PF, gratuity, group insurance) that do not reach your bank account. Additionally, income tax, employee PF, and professional tax are deducted before in-hand is calculated. For a ₹12 LPA CTC, monthly CTC = ₹1,00,000, but in-hand is typically ₹78,000–₹82,000. Use the In-Hand Salary Calculator or CTC Calculator for a more accurate take-home figure.",
      },
      {
        question: "What is the difference between annual salary and annual package?",
        answer:
          "In Indian usage, 'annual salary' and 'annual package' are often used interchangeably to mean CTC per annum. Strictly, 'salary' refers to cash compensation (gross), while 'package' includes all forms of compensation including non-cash perquisites (company car, meal card, ESOP). However, both terms in offer letters almost always mean CTC. When comparing offers, always ask for the detailed CTC breakup — two identical 'annual packages' can differ significantly in in-hand pay depending on how fixed vs variable the components are.",
      },
      {
        question: "How do I convert a bi-weekly US salary to annual?",
        answer:
          "US employers typically pay bi-weekly (every two weeks), giving 26 pay periods per year. Annual salary = bi-weekly paycheck × 26. Example: $2,000 bi-weekly = $2,000 × 26 = $52,000/year. Monthly equivalent = $52,000 ÷ 12 = $4,333.33. Note that some months have three bi-weekly paydays, creating a higher-income month — important for monthly budgeting. Semi-monthly (24 pay periods per year) is different: $2,000 semi-monthly = $2,000 × 24 = $48,000/year.",
      },
      {
        question: "Is annual salary gross or net in the context of Indian job offers?",
        answer:
          "In India, annual salary in job offers is always gross CTC — before income tax, employee PF, and professional tax deductions. It is not the amount you will receive. The net (in-hand) annual amount is typically 20–38% lower depending on your income level, deduction profile, and tax regime choice. Always clarify with HR whether the quoted figure is total CTC or gross salary (which excludes employer PF and gratuity) to know exactly what monthly gross to enter in the in-hand calculator.",
      },
      {
        question: "Can I use this for salary hike calculations?",
        answer:
          "Yes. Enter your current annual salary and note the monthly gross. Then enter your post-hike annual salary and note the new monthly gross. The difference is your monthly gross increment. Apply your expected combined deduction rate to find the net monthly increment: Net increment = Gross increment × (1 − Combined rate). Example: ₹12 LPA → ₹14 LPA (16.7% hike). Monthly gross increment = ₹14L÷12 − ₹12L÷12 = ₹1,16,667 − ₹1,00,000 = ₹16,667. At 25% deductions: Net monthly increment = ₹16,667 × 0.75 = ₹12,500 more in-hand per month.",
      },
    ],
    meta: {
      seoTitle: "Annual Salary Calculator — Convert Yearly to Monthly Pay (India & Global)",
      seoDescription:
        "Convert annual salary to monthly, weekly, daily, and hourly equivalents. Understand annual CTC vs gross vs in-hand, India salary benchmarks by role and experience, and how annual income maps to tax slabs for FY 2024–25.",
      keywords: [
        "annual salary calculator",
        "yearly to monthly salary calculator",
        "annual to monthly salary india",
        "ctc to monthly salary calculator",
        "12 lpa monthly salary",
        "annual salary tax slab india 2024",
        "salary per month from annual package",
        "yearly salary converter india",
        "annual salary benchmarks india 2024",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "monthly-salary-calculator": {
    slug: "monthly-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Multiplies monthly salary by 12 to show annual package equivalent. Figures are gross — no tax or deductions applied. Use this to quickly state annual CTC equivalents from a monthly payslip figure.",
    sections: [
      {
        heading: "Converting Monthly Salary to Annual: The Most Common Pay Comparison",
        paragraphs: [
          "Monthly salary × 12 = annual salary. This is the most frequently needed salary conversion in India, where job seekers typically receive their current payslip in monthly terms but are expected to state their 'current CTC' in annual terms when applying for new roles.",
          "Formula: Annual Gross = Monthly Gross × 12. For ₹1,00,000 monthly gross: Annual = ₹1,00,000 × 12 = ₹12,00,000 (₹12 LPA). This is the gross annual salary — the CTC is higher by the employer contributions (typically 6–12% of gross for employer PF, gratuity, and group insurance), making CTC approximately ₹12,72,000–₹13,44,000 at this salary level.",
          "Important distinction: The ₹12,00,000 annual figure derived here is gross annual salary, not CTC. When asked for 'current CTC' by an interviewer, add your estimated employer contributions to get the CTC. When asked for 'current gross', use this figure directly. Mixing the two is one of the most common errors in salary disclosure, and can create issues during background verification.",
        ],
      },
      {
        heading: "Worked Example: ₹1,00,000 Monthly to Annual and All Equivalent Periods",
        paragraphs: [
          "Input: Monthly salary = ₹1,00,000. Annual = ₹1,00,000 × 12 = ₹12,00,000.",
          "All period equivalents: Quarterly (3 months) = ₹3,00,000. Half-yearly (6 months) = ₹6,00,000. Weekly (÷ 52 weeks × 12) = ₹23,077. Daily (÷ 260 working days) = ₹4,615. Hourly (÷ 2,080 hours at standard 40 hrs/week) = ₹576.92.",
          "With CTC estimation: If your employer contributes 12% additionally (PF + gratuity + insurance), CTC = ₹12,00,000 × 1.12 = ₹13,44,000/year. Saying 'my CTC is ₹13.44 LPA' or 'my gross is ₹12 LPA' are both accurate — just be consistent with which basis you use when comparing offers.",
        ],
      },
      {
        heading: "Why Monthly Framing Matters More Than Annual for Day-to-Day Finance",
        paragraphs: [
          "Almost all personal finance obligations operate on monthly cycles: rent (monthly), EMIs (monthly), insurance premiums (monthly), SIPs (monthly), utility bills (monthly). Annual salary figures are useful for comparing offers and tax planning, but monthly figures are what actually govern your cash flow. The average Indian salaried employee lives on monthly cycles and benefits from understanding their salary primarily in monthly terms.",
          "Monthly salary and savings rate: Financial planners recommend saving at least 20% of monthly gross. On ₹1,00,000/month: ₹20,000/month minimum savings. Ideally: ₹12,500 in equity SIP, ₹5,000 in PPF/NPS, ₹2,500 in emergency fund / liquid fund. After deducting income tax (~₹6,000 TDS) and employee PF (~₹4,800), in-hand ≈ ₹89,200. After ₹20,000 savings: ₹69,200 available for expenses. In Bengaluru or Mumbai, this requires disciplined budgeting.",
          "Monthly salary for city comparison: ₹1,00,000/month in Bengaluru, Mumbai, or Delhi after rent (₹25,000–₹40,000 for 2BHK), commute (₹3,000–₹8,000), and food (₹12,000–₹20,000) leaves ₹30,000–₹50,000 for other expenses and savings. The same ₹1,00,000 in Pune, Hyderabad, or Coimbatore — with 30–40% lower rental costs — leaves significantly more disposable income. Monthly salary in absolute terms should always be evaluated against the cost of living in the specific city.",
        ],
      },
      {
        heading: "Stating Monthly Salary in Job Applications and Background Checks",
        paragraphs: [
          "When asked 'what is your current salary?' in India, the expected answer format varies by context: HR screening call → 'My current CTC is ₹X LPA.' Salary breakup form → Split gross into basic, HRA, special allowance by month. Loan application → Net monthly income (in-hand). Background verification → Annual gross (from payslip or Form 16). This calculator converts the monthly payslip figure into the annual format needed for job applications and background checks.",
          "Form 16 cross-check: Part A of Form 16 shows TDS deducted by employer. Part B shows total salary (annual gross), which should equal monthly gross × 12 plus any variable pay received that year. If you received no bonus, Part B salary = monthly gross × 12. Divide the Form 16 annual salary by 12 to get the monthly gross figure you should be reporting. Any discrepancy between payslip monthly gross × 12 and Form 16 annual salary indicates variable pay, arrears, or mid-year salary changes.",
          "ESOPs and RSUs in monthly salary: Stock grants that vest monthly or quarterly add to taxable income in the vesting month (perquisite tax is deducted in that month as TDS). These should not be included in 'monthly salary' for job applications as they are variable and equity-linked. Quote the fixed monthly gross (cash salary only) when stating current monthly salary; disclose ESOP vesting separately as 'equity compensation'.",
        ],
      },
      {
        heading: "Monthly Salary Milestones and Financial Life Events",
        paragraphs: [
          "Key monthly salary thresholds and what they unlock financially in India: ₹25,000/month — minimum for many bank salary accounts; basic home loan eligibility begins (₹8–10 lakh). ₹50,000/month — comfortable metropolitan life possible with disciplined budgeting; home loan eligibility ₹20–25 lakh; premium credit card eligibility. ₹1,00,000/month (₹12 LPA gross) — income tax liability begins meaningfully under new regime; home loan eligibility ₹40–50 lakh; NPS/80C structuring starts to matter significantly.",
          "₹2,00,000/month (₹24 LPA gross) — surcharge territory in old regime (none in new regime at this level); home loan eligibility ₹80 lakh–₹1 crore; luxury car loan feasible; wealth management advisory interest. ₹5,00,000/month (₹60 LPA gross) — 30% marginal tax in both regimes; HNI banking thresholds; portfolio management service (PMS) eligibility (₹50 lakh minimum AUM reachable within a few years at this income with 20% savings rate).",
          "Using monthly salary for retirement planning: Rule of thumb — to retire comfortably at your current monthly expense level, you need a corpus of approximately 25 times your annual expense. On ₹1,00,000 monthly income with ₹70,000 monthly expense: Annual expense = ₹8,40,000. Retirement corpus needed ≈ ₹8,40,000 × 25 = ₹2,10,00,000 (₹2.1 crore). At a 12% annual return on equity investments, reaching ₹2.1 crore requires a monthly SIP of approximately ₹15,000 for 25 years — comfortably within reach at ₹1 lakh/month salary with 20% savings rate.",
        ],
      },
    ],
    tables: [
      {
        title: "Monthly to Annual Salary Conversion — Common Levels",
        columnHeaders: ["Monthly Gross (₹)", "Annual Gross (₹)", "Approx. Annual CTC (₹) +12%", "Quarterly (₹)", "Weekly (₹)", "Daily (₹)"],
        rows: [
          ["20,000", "2,40,000", "2,68,800", "60,000", "4,615", "923"],
          ["30,000", "3,60,000", "4,03,200", "90,000", "6,923", "1,385"],
          ["50,000", "6,00,000", "6,72,000", "1,50,000", "11,538", "2,308"],
          ["75,000", "9,00,000", "10,08,000", "2,25,000", "17,308", "3,462"],
          ["1,00,000", "12,00,000", "13,44,000", "3,00,000", "23,077", "4,615"],
          ["1,50,000", "18,00,000", "20,16,000", "4,50,000", "34,615", "6,923"],
          ["2,00,000", "24,00,000", "26,88,000", "6,00,000", "46,154", "9,231"],
          ["3,00,000", "36,00,000", "40,32,000", "9,00,000", "69,231", "13,846"],
        ],
      },
      {
        title: "Monthly Salary: Savings & EMI Capacity at Key Gross Levels (India, FY 2024–25)",
        columnHeaders: ["Monthly Gross (₹)", "Est. In-Hand (₹)", "20% Savings Target (₹)", "Remaining for Expenses (₹)", "Max EMI at 40% FOIR (₹)", "Est. Home Loan Eligibility (₹)"],
        rows: [
          ["30,000", "27,500", "5,500", "22,000", "11,000", "9,00,000"],
          ["50,000", "45,500", "9,100", "36,400", "18,200", "15,00,000"],
          ["75,000", "67,500", "13,500", "54,000", "27,000", "22,50,000"],
          ["1,00,000", "88,500", "17,700", "70,800", "35,400", "29,50,000"],
          ["1,50,000", "1,27,500", "25,500", "1,02,000", "51,000", "42,50,000"],
          ["2,00,000", "1,62,000", "32,400", "1,29,600", "64,800", "54,00,000"],
          ["3,00,000", "2,22,000", "44,400", "1,77,600", "88,800", "74,00,000"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Monthly salary accumulates to annual total across 12 months",
      caption:
        "Monthly salary scales linearly to annual. The in-hand fraction of annual salary falls progressively at higher income levels as tax rates increase — making salary structuring and deduction optimisation increasingly important above ₹12 LPA.",
      sparkValues: [0.08, 0.17, 0.25, 0.33, 0.42, 0.5, 0.58, 0.67, 0.75, 0.83, 0.92, 1.0],
    },
    faq: [
      {
        question: "Is monthly salary × 12 the same as CTC?",
        answer:
          "No — monthly payslip gross × 12 = annual gross salary. CTC is higher than annual gross by the employer-side contributions: employer PF (12% of basic, typically 4.8–6% of gross), gratuity accrual (~1.6% of gross annually), group health insurance (~0.5–1% of gross), and other perquisites. At ₹1,00,000 monthly gross: Annual gross = ₹12,00,000. CTC = approximately ₹12,72,000–₹13,44,000 depending on employer contributions. When asked for 'current CTC' in job applications, add approximately 6–12% to your annual gross to arrive at the CTC figure.",
      },
      {
        question: "Should I include variable pay in my monthly salary?",
        answer:
          "For monthly budgeting and in-hand estimates: no — use fixed monthly gross only, as variable pay is uncertain and paid at irregular intervals. For job application 'current CTC' disclosure: yes — include the variable pay component at target (not actuals), as employers expect you to quote the full CTC including variable. For background verification and income proof: use only the fixed monthly gross × 12 = annual gross, as this matches Form 16. Disclose variable pay and ESOP separately when asked. Conflating fixed and variable makes both salary negotiation and tax planning more complicated.",
      },
      {
        question: "My monthly pay varies — how do I compute annual salary?",
        answer:
          "If your monthly pay varies due to LOP (Loss of Pay), overtime, or piecemeal payments: Average monthly pay = Sum of last 12 months' payslip gross ÷ 12. Annualise this average. For tax purposes (Form 16), the actual sum of 12 months' gross is used — not an estimated annualisation. For salary disclosure to a new employer, use your steady-state monthly gross (the payslip in a normal month with full attendance and no LOP) × 12, and separately disclose any variable components. This gives the most accurate representation of your fixed compensation.",
      },
      {
        question: "How do I state my salary when moving from India to a US job?",
        answer:
          "For a US employer expecting an annual salary number: Convert your Indian annual gross (monthly × 12) from INR to USD at the current exchange rate for context, but note that Indian and US salaries are not directly comparable due to purchasing power parity (PPP) differences. What matters to the US employer is the US market rate for the role — research Glassdoor, Levels.fyi, or LinkedIn Salary for your role and location. If the US employer is asking for 'current salary' for a transfer, state your annual Indian gross in INR and let them handle the comparison. Do not convert to USD and claim that as equivalent US compensation.",
      },
      {
        question: "What if I get paid differently in different months (some months have 3 biweekly pays)?",
        answer:
          "This is a US payroll phenomenon (bi-weekly pay = 26 periods/year, but 12 months × 2 = 24 payments, so 2 'extra' paydays hit). In India, monthly payroll means exactly 12 pay periods — no variation in paycheck count. For bi-weekly US pay: Annual = paycheck × 26 (not × 24). Monthly budget: use paycheck × 26 ÷ 12 as average monthly. In months with 3 paychecks (occurs twice a year), treat the third check as a windfall — ideal for EMI prepayment, emergency fund top-up, or investments.",
      },
    ],
    meta: {
      seoTitle: "Monthly Salary Calculator — Convert Monthly Pay to Annual Package (India)",
      seoDescription:
        "Convert monthly salary to annual package instantly. Understand monthly gross vs annual CTC, savings capacity by monthly income, EMI eligibility, and how to state monthly salary as annual CTC in job applications.",
      keywords: [
        "monthly salary calculator",
        "monthly to annual salary india",
        "monthly salary to ctc calculator",
        "1 lakh monthly annual salary",
        "monthly gross to annual gross",
        "salary per year from monthly",
        "monthly salary financial planning india",
        "monthly pay to yearly salary converter",
        "monthly salary emi eligibility calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "hourly-to-salary-calculator": {
    slug: "hourly-to-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Annual = Hourly × Hours/Week × Weeks/Year. Monthly = Annual ÷ 12. Default is 40 hrs/week and 52 weeks/year (standard full-time equivalent). Adjust for part-time, contracted, or variable-hour work.",
    sections: [
      {
        heading: "Why Hourly Workers and Freelancers Need an Annual Salary Equivalent",
        paragraphs: [
          "Freelancers, consultants, gig workers, and hourly employees often earn excellent hourly rates but struggle to communicate their income in the annual salary format that banks, lenders, landlords, and new employers require. A software consultant billing ₹5,000/hour for 20 hours/week is earning ₹52 lakh/year — but a payslip that shows ₹5,000 per invoice tells the bank nothing about annual income.",
          "The formula is straightforward: Annual = Hourly Rate × Hours per Week × Weeks per Year. Monthly = Annual ÷ 12. Weekly = Hourly × Hours per Week. For ₹500/hour at 40 hours/week × 52 weeks: Annual = ₹500 × 40 × 52 = ₹10,40,000. Monthly = ₹10,40,000 ÷ 12 = ₹86,667. Weekly = ₹500 × 40 = ₹20,000.",
          "Beyond just comparison, the annual equivalent is needed for: home loan and personal loan applications (income proof requirement), rental applications (annual income declaration), income tax returns (ITR-3 for business/professional income, reporting gross receipts), and any credit application that asks for 'annual income'.",
        ],
      },
      {
        heading: "Worked Example: ₹500/Hour at 40 Hours/Week",
        paragraphs: [
          "Inputs: Hourly rate = ₹500. Hours per week = 40. Weeks per year = 52.",
          "Calculation: Weekly pay = ₹500 × 40 = ₹20,000. Annual pay = ₹20,000 × 52 = ₹10,40,000. Monthly equivalent = ₹10,40,000 ÷ 12 = ₹86,667.",
          "Adjusting for actual billed weeks: Most consultants and freelancers do not bill 52 weeks/year. Accounting for 2 weeks vacation, 2 weeks national holidays, and ~2 weeks of unbilled gaps between projects: effective billable weeks ≈ 46. At 46 weeks: Annual = ₹20,000 × 46 = ₹9,20,000. Monthly equivalent = ₹76,667. This more conservative estimate is appropriate for income proof and financial planning — use 46–48 weeks for realistic annual income estimation if you are not guaranteed 52 billable weeks.",
          "Gross-to-net for freelancers: Unlike salaried employees, freelancers/self-employed professionals pay both employee and employer-side taxes. Under GST: if annual billings exceed ₹20 lakh (₹10 lakh for some states), GST registration is mandatory and 18% GST applies to services. Income tax: professional income is taxed under ITR-3 (Presumptive Taxation u/s 44ADA allows declaring 50% of gross receipts as net income if receipts ≤ ₹75 lakh). At ₹10,40,000 annual billing under 44ADA: taxable income = 50% × ₹10,40,000 = ₹5,20,000. After standard deduction and rebate, effective tax ≈ ₹0 under the new regime. True after-tax income is significantly better than for a salaried employee at the same gross.",
        ],
      },
      {
        heading: "Hourly Rate Benchmarks: India, US, and UK (2024–25)",
        paragraphs: [
          "India freelance/consulting rates by skill: Junior software developer: ₹500–₹1,500/hr. Senior software engineer: ₹2,000–₹5,000/hr. Full-stack/AI/ML specialist: ₹3,000–₹10,000/hr. CA/Finance consultant: ₹2,000–₹8,000/hr. Digital marketing specialist: ₹500–₹3,000/hr. UI/UX designer: ₹800–₹4,000/hr. Content writer (English): ₹200–₹1,500/hr. These rates are for Indian domestic clients; rates for international clients (USD/GBP billing) are typically 3–5× higher.",
          "US hourly wages (2024): Federal minimum wage: $7.25/hr. California minimum wage: $16/hr. Living wage (urban, single adult): ~$20–25/hr. Entry-level software engineer: $35–$55/hr. Experienced software engineer: $60–$120/hr. Senior consultant (FAANG equivalent): $100–$250/hr. At $50/hr, 40 hrs/week, 52 weeks: Annual = $50 × 2,080 = $104,000 — solidly in the professional class for US compensation.",
          "UK hourly wages (2024): National Living Wage (21+): £11.44/hr. London living wage: £13.15/hr. Graduate/junior professional: £15–£25/hr. Mid-level IT contractor: £350–£600/day (£44–£75/hr at 8 hrs/day). Senior contractor / consultant: £600–£1,200/day (£75–£150/hr). IR35 rules in the UK affect contractor taxation — inside IR35 contractors are taxed like employees; outside IR35 can operate via limited company with more tax efficiency.",
        ],
      },
      {
        heading: "Part-Time and Variable Hours: Adjusting the Calculation",
        paragraphs: [
          "Part-time scenarios: 20 hours/week at ₹500/hr × 52 weeks = ₹5,20,000/year = ₹43,333/month. 30 hours/week at ₹500/hr = ₹7,80,000/year = ₹65,000/month. Part-time workers often underestimate their annual earnings because monthly invoices appear small — the annual equivalent makes the real income visible.",
          "Contract-specific weeks: Some contracts specify total hours or days rather than weekly hours. Convert: 200 contracted days × 8 hrs/day = 1,600 hours. At ₹500/hr: ₹8,00,000 for the contract. Monthly equivalent over a 10-month contract: ₹80,000. Over a 12-month view (assuming no other income): ₹66,667/month. Enter the contract-specific hours in the calculator by adjusting 'hours per week' and 'weeks per year' to match the contract terms.",
          "Overhead cost adjustment for freelancers: An hourly salaried employee has zero cost of employment to track. A freelancer must account for: Client acquisition time (unbillable). Equipment, software, internet costs. Accountant/GST fees. Self-paid health insurance (no employer group cover). No paid leave or sick leave. These overhead costs typically add 15–25% to the effective cost of being self-employed vs salaried at the same gross. A ₹500/hr freelancer competing with a ₹86,667/month gross salaried employee needs to bill ₹575–₹625/hr to have equivalent total compensation.",
        ],
      },
      {
        heading: "Using Hourly Rate for Income Proof and Loan Applications",
        paragraphs: [
          "Lenders and banks require freelancers and gig workers to submit income proof in a standardised format. Acceptable documents for self-employed income proof in India: ITR (Income Tax Return) — last 2–3 years. Bank statements — last 6–12 months showing regular credits. GST returns (if registered) — last 4–6 quarters. Chartered Accountant certificate of income (for loan applications). The annual income figure from this calculator aligns with what you should report in your ITR as gross professional receipts.",
          "Home loan for freelancers: Most banks require 2–3 years of ITR showing consistent income before granting home loans to self-employed individuals. Some NBFCs and digital lenders (Bajaj Finserv, HDFC Credila for education loans) are more flexible with 1 year of ITR plus strong bank statement. Home loan eligibility for a freelancer earning ₹10,40,000 gross/year with ₹6,00,000 net income (after deducting 40% expenses + tax): approximately ₹25–30 lakh home loan at 8.5% for 20 years.",
          "Tax filing for hourly/freelance income: File ITR-3 if maintaining books of accounts, or ITR-4 under Presumptive Taxation Scheme (Section 44ADA for professionals, 44AD for business). Under 44ADA, declare 50% of gross professional receipts as net income — no need to maintain detailed expense records. On ₹10,40,000 gross receipts: presumptive income = ₹5,20,000. After ₹75,000 standard deduction and 87A rebate: zero tax payable under new regime if this is total income. Effectively, freelance professionals earning below ₹10.5 lakh gross may pay zero income tax under 44ADA + new regime.",
        ],
      },
    ],
    tables: [
      {
        title: "Hourly Rate to Annual Salary — Standard 40 hrs/Week, 52 Weeks/Year",
        columnHeaders: ["Hourly Rate (₹)", "Weekly Pay (₹)", "Monthly Pay (₹)", "Annual Pay (₹)", "Approx. Tax Category (New Regime)", "Post-Tax Annual (₹ est.)"],
        rows: [
          ["200", "8,000", "34,667", "4,16,000", "Zero tax (rebate)", "4,16,000"],
          ["375", "15,000", "65,000", "7,80,000", "Zero tax (rebate)", "7,80,000"],
          ["500", "20,000", "86,667", "10,40,000", "~3% effective", "10,08,800"],
          ["750", "30,000", "1,30,000", "15,60,000", "~8% effective", "14,35,200"],
          ["1,000", "40,000", "1,73,333", "20,80,000", "~13% effective", "18,09,600"],
          ["2,000", "80,000", "3,46,667", "41,60,000", "~22% effective", "32,44,800"],
          ["5,000", "2,00,000", "8,66,667", "1,04,00,000", "~28% effective", "74,88,000"],
        ],
      },
      {
        title: "Same Hourly Rate, Different Hours: Annual Income Impact",
        columnHeaders: ["Hourly Rate (₹)", "20 hrs/week", "30 hrs/week", "40 hrs/week", "50 hrs/week", "Best for"],
        rows: [
          ["500", "₹5,20,000/yr", "₹7,80,000/yr", "₹10,40,000/yr", "₹13,00,000/yr", "Part-time / side work"],
          ["750", "₹7,80,000/yr", "₹11,70,000/yr", "₹15,60,000/yr", "₹19,50,000/yr", "Mid-senior freelance"],
          ["1,000", "₹10,40,000/yr", "₹15,60,000/yr", "₹20,80,000/yr", "₹26,00,000/yr", "Senior consultant"],
          ["2,000", "₹20,80,000/yr", "₹31,20,000/yr", "₹41,60,000/yr", "₹52,00,000/yr", "Expert / niche specialist"],
          ["5,000", "₹52,00,000/yr", "₹78,00,000/yr", "₹1,04,00,000/yr", "₹1,30,00,000/yr", "Premium consultant"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Annual income grows linearly with hours worked per week",
      caption:
        "At a fixed hourly rate, annual income scales proportionally with hours worked. Doubling hours per week doubles annual income. For freelancers, tracking effective hourly rate (including unbillable admin time) gives a more accurate income picture than headline billing rate alone.",
      sparkValues: [0.25, 0.38, 0.5, 0.63, 0.75, 0.88, 1.0],
    },
    faq: [
      {
        question: "Why does this calculator default to 52 weeks per year?",
        answer:
          "52 weeks × 40 hours = 2,080 hours/year is the standard full-time equivalent (FTE) in the US, Canada, and increasingly used in India for contractor comparison. It assumes zero unpaid leave. For a realistic freelance estimate, use 46–50 weeks (accounting for vacation, sick days, national holidays, and gaps between projects). For a part-time employee with guaranteed 48-week employment: use 48 weeks. Change the 'weeks per year' input to match your actual or contracted schedule.",
      },
      {
        question: "How does hourly freelance income compare to salaried income at the same monthly amount?",
        answer:
          "A freelancer billing ₹86,667/month (₹500/hr × 40 hrs × 52 weeks ÷ 12) appears equal to a salaried employee at ₹86,667 gross/month — but the net comparison favors the freelancer in India. Freelancer advantages: Section 44ADA presumptive taxation (50% of receipts treated as income; 50% implicitly deducted for expenses). GST input credits available on business expenses. No employee PF deduction (though this means no PF accumulation either). Freelancer disadvantages: No employer PF match, no group insurance, no paid leave, no job security. Net-net, a skilled freelancer at ₹500/hr typically has higher post-tax income than a salaried employee at ₹86,667 gross, especially under the new tax regime.",
      },
      {
        question: "Can I use this for daily rate (day rate) consulting contracts?",
        answer:
          "Yes. Convert your day rate to an hourly rate first: Day rate ÷ hours per day = hourly rate. Then enter that hourly rate with your hours per week. Example: Day rate ₹8,000/day at 8 hours/day = ₹1,000/hr. Enter ₹1,000/hr, 40 hrs/week, and adjust weeks to your contracted days ÷ 5 (working days per week). For a 200-day contract: weeks = 200 ÷ 5 = 40 weeks. Annual income = ₹1,000 × 40 × 40 = ₹16,00,000. Alternatively, simply enter total contracted hours ÷ 52 as effective hours per week and use 52 weeks.",
      },
      {
        question: "How do I prove hourly income to a bank for a home loan?",
        answer:
          "Banks require documentation of consistent income over 2–3 years for self-employed applicants: ITR for last 2–3 years (showing gross professional receipts in Schedule BP or Schedule DI). Bank account statements for last 12 months (regular credit entries from clients). GST returns (if registered). For freelancers with inconsistent monthly income, some banks average 6–12 months of bank credits to compute 'monthly income'. Others use ITR annual income ÷ 12. Maintain a dedicated current account or savings account for all professional income credits — mixing business and personal accounts makes income documentation harder.",
      },
      {
        question: "What is a good hourly rate for an Indian software developer in 2024?",
        answer:
          "For Indian domestic clients (INR billing): Junior developer (0–2 yrs): ₹300–₹700/hr. Mid-level developer (3–5 yrs): ₹800–₹2,000/hr. Senior/specialist (6–10 yrs): ₹2,000–₹5,000/hr. For international clients (USD billing via Upwork, Toptal, direct contracts): Junior: $15–$30/hr (₹1,250–₹2,500/hr). Mid-level: $30–$60/hr (₹2,500–₹5,000/hr). Senior: $60–$120/hr (₹5,000–₹10,000/hr). The USD arbitrage is substantial — an Indian developer billing $50/hr for 30 weeks × 40 hrs earns $60,000 = approximately ₹50 lakh/year, well above most salaried engineering roles in India. Platforms: Toptal (premium, curated), Upwork (volume, competitive), Deel/Remote (for international payroll compliance).",
      },
    ],
    meta: {
      seoTitle: "Hourly to Salary Calculator — Convert Hourly Rate to Annual & Monthly Pay",
      seoDescription:
        "Convert hourly wage or freelance billing rate to weekly, monthly, and annual salary equivalent. Includes India, US, and UK hourly rate benchmarks, freelancer vs salaried income comparison, and income proof for loans.",
      keywords: [
        "hourly to salary calculator",
        "hourly rate to annual salary india",
        "freelancer income annual calculator",
        "hourly wage to monthly salary",
        "consultant billing rate annual income",
        "hourly to yearly salary calculator",
        "freelance income proof india",
        "per hour rate to annual package",
        "hourly rate income tax india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "salary-to-hourly-calculator": {
    slug: "salary-to-hourly-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Hourly rate = Annual salary ÷ (Hours per week × Weeks per year). Default: 40 hrs/week × 52 weeks = 2,080 hours/year. Adjust for your actual or contracted schedule. Enter gross annual salary for a gross hourly rate.",
    sections: [
      {
        heading: "Why Salaried Employees Need to Know Their Hourly Rate",
        paragraphs: [
          "Most salaried employees in India and globally think of their compensation purely in monthly or annual terms. But knowing your effective hourly rate unlocks several important comparisons: evaluating freelance or consulting gigs against your salaried job, understanding the true cost of unpaid overtime, comparing a part-time offer to a full-time position, and benchmarking against contractor market rates for your skill set.",
          "The formula is: Hourly Rate = Annual Salary ÷ (Hours per Week × Weeks per Year). At the default 40 hours/week × 52 weeks = 2,080 hours/year: For ₹12,00,000 annual gross, hourly rate = ₹12,00,000 ÷ 2,080 = ₹576.92/hour. Weekly pay = ₹576.92 × 40 = ₹23,077. This is the gross hourly rate — before income tax and deductions.",
          "The 2,080 hours standard (40 hrs × 52 weeks) is the basis for most US salary-to-hourly conversions and is widely used as a global reference point. In India, the standard working hours under the Factories Act and Shops and Establishments Act vary by state, typically 48 hours/week (6 days × 8 hours) for manufacturing and 45–50 hours/week for IT sector by practice. Adjust the hours per week input accordingly if your work schedule differs from 40 hours.",
        ],
      },
      {
        heading: "Worked Example: ₹12,00,000 Annual at 40 Hours/Week",
        paragraphs: [
          "Inputs: Annual salary = ₹12,00,000. Hours per week = 40. Weeks per year = 52. Hours per year = 40 × 52 = 2,080.",
          "Hourly rate = ₹12,00,000 ÷ 2,080 = ₹576.92/hour. Weekly = ₹576.92 × 40 = ₹23,077. Monthly = ₹12,00,000 ÷ 12 = ₹1,00,000. Daily (8-hour day) = ₹576.92 × 8 = ₹4,615.",
          "At 45 hours/week (more typical for Indian IT sector): Hours/year = 45 × 52 = 2,340. Hourly rate = ₹12,00,000 ÷ 2,340 = ₹512.82/hour. The effective hourly rate drops by 11% simply because you work 12.5% more hours for the same annual pay — highlighting the hidden cost of a 45-hour standard workweek vs a 40-hour one.",
          "US example: $60,000 annual salary ÷ 2,080 hours = $28.85/hour. At California minimum wage ($16/hr), the equivalent annual salary is $16 × 2,080 = $33,280. A $60,000 salaried employee earns $28.85/hr — significantly above minimum wage but below the $40–$50/hr range of experienced contractors in many US tech markets.",
        ],
      },
      {
        heading: "The True Hourly Rate: Accounting for Unpaid Overtime",
        paragraphs: [
          "The salary-to-hourly conversion reveals an uncomfortable truth about salaried jobs with excessive hours. If you earn ₹12,00,000/year but routinely work 55 hours/week instead of 40, your actual hours worked per year = 55 × 52 = 2,860. True effective hourly rate = ₹12,00,000 ÷ 2,860 = ₹419.58/hour — 27% lower than the nominal ₹576.92/hour based on 40 hours.",
          "This effective rate calculation is powerful for career decisions. A job at ₹10,00,000/year requiring exactly 40 hours/week gives ₹480.77/hour. A job at ₹12,00,000/year requiring 55 hours/week gives ₹419.58/hour. The lower-paying job has a 15% higher effective hourly rate — meaning you are better compensated per hour even though annual pay is 20% lower. The decision depends on whether the ₹2 lakh annual premium for the higher-paying job is worth 780 extra hours of your life per year.",
          "Work-life value quantification: If you value your leisure time at ₹300/hour (a rough proxy: what would you pay someone to do a necessary task so you can free up an hour?), those 780 extra hours cost you ₹2,34,000 in 'shadow cost'. Against a ₹2 lakh pay premium, the high-hour job is actually a net negative on a total-value basis. The salary-to-hourly calculator makes this trade-off explicit.",
        ],
      },
      {
        heading: "Comparing Salaried vs Freelance/Consulting at the Same Hourly Rate",
        paragraphs: [
          "The salary-to-hourly tool is most powerful when used to compare a current salaried role against a freelance or consulting offer. Salaried job: ₹12,00,000/year gross → ₹576.92/hour. Employer provides PF match, group insurance, paid leave, job stability. No business development overhead.",
          "Freelance offer at ₹700/hour: Annual at 40 hrs × 52 weeks = ₹14,56,000 gross. But: No employer PF match (lose ~₹57,600/year in matched contributions). No group health insurance (self-pay ₹15,000–₹40,000/year). No paid leave (2 weeks vacation = 80 hours × ₹700 = ₹56,000 of foregone income). Business development, invoicing, accountant = ~10% overhead (₹1,45,600). Adjusted effective annual income = ₹14,56,000 − ₹57,600 − ₹30,000 − ₹56,000 − ₹1,45,600 = ₹12,66,800. Only ₹66,800 more than the salaried role — the ₹123/hour premium shrinks to approximately ₹32/hour real premium after adjusting for employment benefits.",
          "Freelance break-even hourly rate: To genuinely earn more than a salaried ₹12 LPA position after accounting for all hidden costs, a freelancer typically needs to bill 25–35% above the implied salaried hourly rate. For a ₹12 LPA employee (₹576.92/hour), the freelance break-even is approximately ₹720–₹780/hour. Below this, the salaried role may offer better total compensation including benefits and job security.",
        ],
      },
      {
        heading: "Salary to Hourly for Moonlighting and Side Gigs",
        paragraphs: [
          "India's moonlighting policy landscape evolved significantly after 2022 (following the Wipro and Infosys moonlighting controversies). Many tech companies now have explicit dual-employment policies — some permitting part-time consulting outside office hours, others prohibiting it. If moonlighting is permitted, knowing your effective salaried hourly rate helps price consulting gigs correctly.",
          "If your salary implies ₹577/hour and you accept a consulting gig at ₹400/hour, you are pricing below your opportunity cost — the extra hours may not be worth it. At ₹800/hour, the premium over your salaried rate (39% higher) adequately compensates for the absence of benefits, the tax complexity, and the time spent on administration.",
          "Moonlighting income tax: Additional consulting income is added to your existing salary income and taxed at the marginal slab rate. At ₹12 LPA gross salary, your marginal tax rate under the new regime is 20% (₹12–15 lakh slab). Any moonlighting income pushes you further up the slab — potentially into 30% on the incremental income above ₹15 lakh. Factor this additional tax into your effective net rate when evaluating consulting gigs alongside a salaried job.",
        ],
      },
    ],
    tables: [
      {
        title: "Annual Salary to Hourly Rate — Standard 2,080 Hours/Year (40 hrs × 52 weeks)",
        columnHeaders: ["Annual Gross (₹)", "Monthly Gross (₹)", "Hourly Rate (₹)", "Daily Rate (8 hrs) (₹)", "Weekly Rate (₹)", "Freelance Break-Even Rate (₹/hr)*"],
        rows: [
          ["4,00,000", "33,333", "192", "1,538", "7,692", "240–260"],
          ["6,00,000", "50,000", "288", "2,308", "11,538", "360–390"],
          ["8,00,000", "66,667", "385", "3,077", "15,385", "480–520"],
          ["10,00,000", "83,333", "481", "3,846", "19,231", "600–650"],
          ["12,00,000", "1,00,000", "577", "4,615", "23,077", "720–780"],
          ["15,00,000", "1,25,000", "721", "5,769", "28,846", "900–975"],
          ["20,00,000", "1,66,667", "962", "7,692", "38,462", "1,200–1,300"],
          ["30,00,000", "2,50,000", "1,442", "11,538", "57,692", "1,800–1,950"],
        ],
      },
      {
        title: "True Effective Hourly Rate by Actual Hours Worked — ₹12,00,000 Annual",
        columnHeaders: ["Actual Hours/Week", "Hours/Year", "Effective Hourly Rate (₹)", "vs 40-hr Rate (₹)", "% Reduction", "True Annual Value of Overtime"],
        rows: [
          ["35 hrs", "1,820", "659", "+82", "+14.2%", "Pay equivalent to ₹13.69 LPA"],
          ["40 hrs", "2,080", "577", "Baseline", "0%", "₹12,00,000 — as quoted"],
          ["45 hrs", "2,340", "513", "−64", "−11.1%", "Effectively earning ₹10.67 LPA"],
          ["50 hrs", "2,600", "462", "−115", "−19.9%", "Effectively earning ₹9.60 LPA"],
          ["55 hrs", "2,860", "420", "−157", "−27.2%", "Effectively earning ₹8.74 LPA"],
          ["60 hrs", "3,120", "385", "−192", "−33.3%", "Effectively earning ₹8.00 LPA"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Effective hourly rate falls as unpaid hours increase",
      caption:
        "A fixed annual salary spread over more hours per week means each additional hour of work is compensated at a lower effective rate. Working 55 hours/week on a 40-hour salary reduces your real hourly rate by 27% — equivalent to a pay cut of ₹1.26 LPA without any change to the offer letter.",
      sparkValues: [1, 0.88, 0.79, 0.71, 0.64, 0.58, 0.53],
    },
    faq: [
      {
        question: "Should I enter gross or net annual salary?",
        answer:
          "Enter gross annual salary to get your gross hourly rate — useful for comparing with freelance or consulting billing rates, which are always quoted gross. Enter net (in-hand) annual salary if you want your net effective hourly rate — useful for comparing after-tax hourly earnings with investment returns or the after-tax value of your time. For most comparisons (job offers, freelance evaluation), use gross. For personal finance decisions about how to spend your leisure time, net effective rate is more meaningful.",
      },
      {
        question: "What hours per week should I use for an Indian IT sector employee?",
        answer:
          "Most Indian IT sector employment contracts specify 9 hours/day, 5 days/week = 45 hours/week, with some OT expected during project peaks. For a realistic average, use 45–48 hours/week. This gives 2,340–2,496 hours/year at ₹12,00,000 annual: hourly rate = ₹481–₹513/hour — about 11–17% below the nominal 40-hour rate. Use 40 hours/week for comparison with US/UK market rates (which use 40-hour standards), but 45–48 hours for internal reality checks about compensation adequacy.",
      },
      {
        question: "How is hourly rate useful when my salary is fixed regardless of hours?",
        answer:
          "Even though your pay does not change with hours, the hourly rate is a utility tool for: (1) Comparing your compensation with contractor/freelance market rates — if contractors with your skills bill ₹1,500/hr and your implied rate is ₹577/hr, you may be undervalued. (2) Quantifying overtime's hidden cost — each hour above 40/week is compensated at progressively lower effective rates. (3) Evaluating paid leave value — each vacation day uses up ₹4,615 of your salary budget at ₹12 LPA; paid leave is a more valuable benefit at higher salaries. (4) Pricing side work — you should not accept consulting gigs below your salaried hourly rate unless the experience, flexibility, or network access justifies it.",
      },
      {
        question: "What is the equivalent hourly rate for minimum wages in India?",
        answer:
          "India does not have a single national minimum wage — it varies by state, sector, and skill category. Under the Code on Wages 2019, the Central Government sets a national floor minimum wage (last revised to ₹178/day in 2017; updated advisory values now suggest ₹375–₹450/day). At ₹375/day × 26 working days × 12 months = ₹1,17,000/year. At 8 hours/day: ₹375 ÷ 8 = ₹46.88/hour. State-specific minimum wages for unskilled labour range from ₹300–₹800/day. For skilled IT workers, the minimum wage concept is irrelevant — market rates apply.",
      },
      {
        question: "My company gives me 25 days of paid leave — how does this affect the hourly calculation?",
        answer:
          "Paid leave increases the effective value of your salaried hourly rate compared to a contractor who does not get paid for leave. At ₹12 LPA with 25 days paid leave: You work 52 weeks × 5 days − 25 days = 235 days = 47 weeks × 5 days = 1,880 actual working days × 8 hours = 1,880 billable hours. Effective hourly rate = ₹12,00,000 ÷ 1,880 = ₹638.30/hour. Your nominal hourly rate (2,080 hours) is ₹577/hour, but because the company pays you for 25 non-working days, your real compensation per hour worked is ₹638. A contractor who gets no paid leave must bill 10.6% higher just to break even with this leave benefit.",
      },
    ],
    meta: {
      seoTitle: "Salary to Hourly Calculator — Find Hourly Rate from Annual or Monthly Pay",
      seoDescription:
        "Convert annual salary to hourly, daily, and weekly rates. Calculate true effective hourly rate including unpaid overtime. Compare salaried vs freelance compensation and evaluate moonlighting gig pricing in India.",
      keywords: [
        "salary to hourly calculator",
        "annual salary to hourly rate india",
        "monthly salary to hourly rate",
        "effective hourly rate calculator",
        "salaried vs freelance hourly comparison",
        "12 lpa hourly rate",
        "true hourly rate with overtime",
        "salary to hourly converter india 2024",
        "moonlighting hourly rate calculator india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
