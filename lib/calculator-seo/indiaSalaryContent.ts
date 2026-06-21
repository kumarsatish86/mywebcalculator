import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/india-salary-calculators";
const HUB_LABEL = "Finance · India Salary Calculators";

const shellIndia =
  "Runs in your browser. Uses simplified FY 2025–26 tax slabs, PF wage ceiling (₹15,000), and indicative professional tax—not a substitute for Form 16 or payroll software.";

export const INDIA_SALARY_ARTICLES: Record<string, RichArticle> = {
  "salary-calculator-india-full-breakdown": {
    slug: "salary-calculator-india-full-breakdown",
    vertical: "finance-loan",
    category: "finance",
    shellNote: shellIndia,
    sections: [
      {
        heading: "What a Full India Salary Breakdown Shows",
        paragraphs: [
          "An Indian salary breakdown traces the complete journey from the monthly CTC stated in your offer letter to the amount credited to your bank account. It is not a single subtraction — it is a multi-step decomposition: CTC → Gross (by removing employer-side costs) → Earnings components (basic, HRA, special allowance) → Net (by deducting employee PF, professional tax, and income tax). Each step reveals a different number, and knowing all of them is essential for budgeting, tax planning, and evaluating offers accurately.",
          "This calculator performs all those steps in one screen. Enter your monthly CTC and basic percentage, specify rent (for HRA exemption under old regime), your state (for professional tax), and your preferred tax regime (new or old). The output shows every payslip line: basic, HRA, special allowance, gross, employer PF, employee PF, professional tax, monthly income tax (TDS), in-hand monthly, and in-hand annual.",
          "The breakdown uses FY 2025–26 tax slabs, a ₹15,000 PF wage ceiling (unless your employer contributes on full basic), and indicative state-wise professional tax. Results are estimates — actual payslips depend on your employer's salary template and TDS computation schedule, which may differ from this simplified model.",
        ],
      },
      {
        heading: "Worked Example: ₹1,00,000 Monthly CTC, 40% Basic, Maharashtra, New Regime",
        paragraphs: [
          "Inputs: Monthly CTC = ₹1,00,000. Basic as % of CTC = 40%. Rent paid = ₹18,000/month. Metro city (50% HRA rule). State: Maharashtra. Regime: New.",
          "Step 1 — Build gross: Basic = ₹1,00,000 × 40% = ₹40,000. HRA (50% of basic, metro) = ₹20,000. Employer PF (12% of basic) = ₹4,800. Gross = CTC − Employer PF = ₹1,00,000 − ₹4,800 = ₹95,200. Special allowance (balancing) = ₹95,200 − ₹40,000 − ₹20,000 = ₹35,200.",
          "Step 2 — Deductions from gross: Employee PF (12% of basic) = ₹4,800. Professional tax (Maharashtra) = ₹200. Annual gross = ₹95,200 × 12 = ₹11,42,400. Under new regime FY 2025–26: Taxable income = ₹11,42,400 − ₹75,000 std deduction = ₹10,67,400. Tax at new slabs: 0 (0–4L) + ₹20,000 (4–8L @ 5%) + ₹26,740 (8–10.67L @ 10%) = ₹46,740 + 4% cess = ₹48,610 annual. Monthly TDS ≈ ₹4,051.",
          "Step 3 — In-hand: ₹95,200 − ₹4,800 (employee PF) − ₹200 (PT) − ₹4,051 (TDS) = ₹86,149/month. Annual in-hand = ₹86,149 × 12 = ₹10,33,788. CTC-to-in-hand ratio = 86.1%. The remaining 13.9% (₹13,851/month) goes to employer PF (₹4,800), employee PF (₹4,800), PT (₹200), and TDS (₹4,051).",
        ],
      },
      {
        heading: "How the Basic Percentage Choice Shapes Every Line of the Payslip",
        paragraphs: [
          "The basic salary percentage (entered as % of CTC) is the most influential single input in an Indian salary breakdown. Basic anchors three downstream calculations: employee PF (12% of basic), employer PF (12% of basic), and HRA (50% of basic in metros, 40% elsewhere). Changing basic from 40% to 50% on a ₹1,00,000 CTC: Basic rises from ₹40,000 to ₹50,000. Employee PF rises from ₹4,800 to ₹6,000 (+₹1,200/month deducted). Employer PF rises from ₹4,800 to ₹6,000 (more of CTC is consumed by employer side). Gross falls from ₹95,200 to ₹94,000 (because higher employer PF eats more CTC). HRA rises from ₹20,000 to ₹25,000 — but this only helps under the old regime.",
          "For employees under the new tax regime: Minimising basic (e.g., 30–40% of CTC) increases gross and special allowance, which are fully taxable anyway — so special allowance is not tax-efficient. However, lower basic means lower employee PF deduction, which directly increases in-hand. On a ₹1,00,000 CTC at 30% basic vs 50% basic: Employee PF at 30% = ₹3,600; at 50% = ₹6,000. Monthly in-hand difference = ₹2,400 simply from basic percentage choice, with no change to CTC.",
          "For employees under the old tax regime: Higher basic increases HRA deduction eligibility (50%/40% of basic as one of the three tests). If you pay high rent, a higher basic can meaningfully increase HRA exemption — potentially saving more tax than the additional PF deduction costs. The net-optimal basic percentage depends on rent level, tax bracket, and employer flexibility in allowing restructuring.",
        ],
      },
      {
        heading: "State-Wise Professional Tax and Its Effect on Monthly In-Hand",
        paragraphs: [
          "Professional tax (PT) is a state-level levy on salaried income, deducted monthly by employers and remitted to the state government. It is small in absolute terms but worth knowing. Common monthly PT deductions for salary bands of ₹80,000–₹1,00,000+: Maharashtra ₹200/month (₹2,400/year, with February at ₹300 making annual total ₹2,500). Karnataka ₹200/month (₹2,400/year). West Bengal ₹208/month for highest slab. Andhra Pradesh and Telangana ₹200/month. Tamil Nadu: PT was abolished in 2023 for most categories. Delhi: No professional tax (₹0). Kerala ₹212/month for highest slab. Gujarat ₹200/month.",
          "Annual professional tax paid is deductible from gross income for income tax purposes under Section 16(iii) of the Income Tax Act — applicable in both old and new regimes. This makes PT self-reducing to some extent: ₹2,400/year PT deducted saves ₹240–₹720 in income tax depending on your slab rate (10–30%), making the net cost of PT only ₹1,680–₹2,160/year.",
          "Professional tax is also deductible as an employee-side cost in Form 16, Part B — so it is automatically accounted for in the TDS computation by your payroll department. This calculator includes state-wise PT in the monthly deduction and correctly adjusts the taxable income accordingly.",
        ],
      },
      {
        heading: "Using the Full Breakdown for Offer Comparison and Negotiation",
        paragraphs: [
          "The most powerful use of the full breakdown calculator is offer comparison. Two job offers with different CTC structures can be instantly compared by running both through the calculator and comparing in-hand monthly figures. Key variables that make two identical CTCs yield different in-hand: (1) Basic percentage (higher basic = higher PF deduction = lower in-hand). (2) Tax regime alignment (if you plan to use old regime, an offer with higher HRA yields more in-hand; if you use new regime, HRA allocation is irrelevant). (3) State of employment (Delhi: no PT; Maharashtra: ₹200/month PT). (4) Perquisites included in CTC vs excluded (club membership, company car — valued at perquisite rate, taxable; but canteen subsidy, NPS employer contribution may be structured more tax-efficiently).",
          "Salary restructuring request: If your employer allows salary restructuring (many IT companies permit annual restructuring), use this calculator to simulate: (a) Reducing basic from 50% to 40% → saves ₹1,200/month in employee PF on ₹1,00,000 CTC. (b) Adding NPS employer contribution (10% of basic under 80CCD(2), deductible in both regimes) → reduces taxable income without reducing CTC. (c) Adding meal/food coupons (₹2,200/month tax-exempt) → reduces taxable special allowance by ₹2,200 → saves ₹220–₹660/month in TDS.",
          "Appraisal and hike impact: Use the calculator before your appraisal to model the after-tax, after-PF impact of various hike scenarios. A 15% CTC hike from ₹1,00,000 to ₹1,15,000 at 40% basic under new regime may yield only ₹9,000–₹11,000 more in-hand per month (not ₹15,000) because part of the increment goes to higher employee PF and slightly higher TDS at the margin.",
        ],
      },
    ],
    tables: [
      {
        title: "Full Salary Breakdown — ₹1,00,000 Monthly CTC at 40% Basic, Maharashtra, New Regime",
        columnHeaders: ["Payslip Line", "Amount (₹/month)", "Notes"],
        rows: [
          ["Monthly CTC", "1,00,000", "Offer letter figure"],
          ["Basic (40% of CTC)", "40,000", "Anchor for PF, HRA, gratuity"],
          ["HRA (50% of basic, metro)", "20,000", "Metro rate; 40% for non-metro"],
          ["Special allowance (balancing)", "35,200", "CTC − basic − HRA − employer PF"],
          ["Gross monthly", "95,200", "CTC − employer PF"],
          ["Employer PF (12% of basic)", "4,800", "Part of CTC, not gross"],
          ["Employee PF (12% of basic)", "4,800", "Deducted from gross"],
          ["Professional tax (Maharashtra)", "200", "Monthly; ₹2,500/year"],
          ["Monthly TDS (new regime, est.)", "4,051", "Based on ₹11.42L annual gross"],
          ["In-hand monthly", "86,149", "Bank credit after all deductions"],
          ["In-hand annual", "10,33,788", "Monthly in-hand × 12"],
        ],
      },
      {
        title: "How Basic % Affects In-Hand — ₹1,00,000 CTC, Maharashtra, New Regime",
        columnHeaders: ["Basic %", "Basic (₹)", "HRA (₹)", "Gross (₹)", "Emp. PF (₹)", "Monthly TDS est. (₹)", "In-Hand (₹/month)"],
        rows: [
          ["30%", "30,000", "15,000", "96,400", "3,600", "4,200", "88,400"],
          ["35%", "35,000", "17,500", "95,800", "4,200", "4,100", "87,300"],
          ["40%", "40,000", "20,000", "95,200", "4,800", "4,051", "86,149"],
          ["45%", "45,000", "22,500", "94,600", "5,400", "3,900", "85,100"],
          ["50%", "50,000", "25,000", "94,000", "6,000", "3,800", "84,000"],
          ["55%", "55,000", "27,500", "93,400", "6,600", "3,700", "82,900"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "CTC progressively reduced to in-hand through each deduction stage",
      caption:
        "From ₹1,00,000 CTC to ₹86,149 in-hand: employer PF removes ₹4,800 from CTC to reach gross; employee PF, professional tax, and TDS reduce gross to net. Regime choice and basic% are the two levers that most affect the final figure.",
      sparkValues: [1, 0.952, 0.904, 0.902, 0.898, 0.862],
    },
    faq: [
      {
        question: "Is this breakdown the same as my actual payslip?",
        answer:
          "Close, but not identical. Real payslips differ in three ways: (1) Your employer may use a different HRA rate (e.g., 40% of basic even in a metro) or a different set of allowances (LTA, medical, special education allowance). (2) TDS is calculated by payroll software that uses exact slab-wise computation on projected annual income, with adjustments each month as variable pay is confirmed. This calculator uses simplified annual-income-based TDS. (3) The PF contribution may be capped at ₹1,800/month (12% of the ₹15,000 PF wage ceiling) if your employer uses the statutory cap — whereas this calculator uses 12% of your actual basic. For exact payslip figures, use your HR's payslip portal or salary breakup sheet.",
      },
      {
        question: "What is special allowance and why does it vary so much?",
        answer:
          "Special allowance (also called 'balancing component' or 'other allowance') is whatever is left of gross after allocating basic, HRA, and any other named components like LTA or medical allowance. It is fully taxable in both regimes, with no cap or exemption. Its size depends entirely on the CTC and the percentages allocated to other components. On a ₹1,00,000 CTC at 40% basic: special allowance = ₹95,200 gross − ₹40,000 basic − ₹20,000 HRA = ₹35,200. At 50% basic: special allowance = ₹94,000 − ₹50,000 − ₹25,000 = ₹19,000. The large variation is because the balancing component absorbs all the remaining gross after named components are allocated.",
      },
      {
        question: "Does the new regime affect how PF and PT are calculated?",
        answer:
          "No — PF and professional tax are statutory deductions unaffected by the income tax regime choice. Employee PF = 12% of basic (regardless of regime). Professional tax = state-prescribed slab (regardless of regime). The regime choice only affects the income tax (TDS) calculation. Switching from old to new regime does not change your PF deduction or PT deduction — it only changes how much TDS is computed on your taxable income.",
      },
      {
        question: "What happens to employer PF — does it go to my bank?",
        answer:
          "No — employer PF (12% of basic) is not cash that reaches your bank account. It is deposited directly into your EPF account with the EPFO (Employees' Provident Fund Organisation). However, it is part of your CTC and accumulates in your EPF account as retirement savings. When you withdraw from EPF (on resignation, retirement, or as per EPFO rules), you receive both your employee PF contribution and the employer PF contribution plus interest. Employer PF is real savings — just not liquid monthly income.",
      },
      {
        question: "My company gives LTA — where does it appear in this breakdown?",
        answer:
          "LTA (Leave Travel Allowance) is a named allowance that replaces part of the special allowance in your gross. If your CTC includes ₹50,000 LTA per year (₹4,167/month), the gross breakdown shows: basic + HRA + LTA + special allowance (smaller) + any other allowances = total gross. Under the old regime, LTA is tax-exempt for actual travel costs (twice in a 4-year block). Under the new regime, LTA is fully taxable like special allowance. In this calculator, LTA is absorbed into the special allowance for simplicity — for exact LTA handling, use a full payroll system or consult your HR breakup sheet.",
      },
    ],
    meta: {
      seoTitle: "Salary Calculator India — Full CTC Breakdown to In-Hand (FY 2025–26)",
      seoDescription:
        "Complete Indian salary calculator: enter monthly CTC and get full breakdown into basic, HRA, special allowance, employer PF, employee PF, professional tax, TDS, and in-hand salary. Supports new and old tax regime for FY 2025–26.",
      keywords: [
        "salary calculator india full breakdown",
        "ctc to in hand salary calculator india 2025",
        "indian salary breakup calculator",
        "monthly ctc breakdown india",
        "basic hra pf tds salary calculator",
        "india salary calculator fy 2025-26",
        "ctc to take home salary india calculator",
        "salary structure calculator india new regime",
        "gross salary from ctc india calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "in-hand-salary-calculator-india": {
    slug: "in-hand-salary-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote: shellIndia,
    sections: [
      {
        heading: "In-Hand Salary in India: The Three Deductions That Reduce Your Gross",
        paragraphs: [
          "In-hand salary (take-home pay) in India is the amount credited to your bank account after three mandatory deductions from your monthly gross: (1) Employee Provident Fund (EPF) — 12% of basic salary, deposited to your EPFO account. (2) Professional Tax (PT) — a small state-level levy of ₹0–₹212/month depending on your state of employment. (3) Income Tax / TDS — monthly tax deducted at source on estimated annual taxable income, computed under whichever regime you opt for.",
          "The formula: In-hand = Gross − Employee PF − Professional Tax − Monthly TDS. For a ₹1,00,000 CTC at 40% basic in Maharashtra under the new regime: Gross = ₹95,200. Employee PF = ₹4,800. PT = ₹200. Monthly TDS ≈ ₹4,051. In-hand = ₹95,200 − ₹4,800 − ₹200 − ₹4,051 = ₹86,149. The CTC-to-in-hand ratio at this salary level is approximately 86% — you receive about ₹86 for every ₹100 of monthly CTC.",
          "This calculator builds the salary structure from CTC (using the basic % input), computes each deduction using actual statutory rules (PF wage ceiling, state PT slab, FY 2025–26 income tax), and outputs the monthly in-hand directly. It is faster than using separate calculators for each deduction and handles the interdependencies (e.g., HRA exemption under old regime reduces taxable income, which reduces TDS).",
        ],
      },
      {
        heading: "Employee PF: The Largest Non-Tax Deduction in Most Indian Payslips",
        paragraphs: [
          "Employee PF is 12% of the employee's basic salary, deducted each month and deposited into the EPF account. The current EPF interest rate is 8.25% (FY 2023–24, subject to annual EPFO trustee revision). On a ₹40,000 basic: Employee PF = ₹4,800/month = ₹57,600/year. Plus matching employer PF of ₹4,800 → total ₹9,600/month goes into your EPF account.",
          "PF wage ceiling: Under the Employees' Provident Funds Act, the statutory contribution is on a wage ceiling of ₹15,000/month basic. Employees with basic ≤ ₹15,000 must contribute; employers are only obligated to match on ₹15,000. For employees with basic > ₹15,000, employers may cap their contribution at ₹1,800/month (12% of ₹15,000). However, the employee side is typically uncapped in most corporate employers — the employee's full 12% of actual basic is deducted. Some companies offer International Workers PF or VPF contributions beyond the statutory amount.",
          "Can you opt out of PF? Only in limited circumstances: (1) If your basic salary exceeds ₹15,000/month and you were not an EPF member previously (new joining), you may request a PF exemption. (2) Some employers do not register under EPF if they have fewer than 20 employees. (3) International assignments to countries with social security agreements may allow opting out. For most private sector employees, PF is mandatory and cannot be opted out of once enrolled.",
        ],
      },
      {
        heading: "Income Tax Deducted at Source (TDS) on Salary: How Employers Compute It",
        paragraphs: [
          "Your employer computes monthly TDS by estimating your annual tax liability and dividing by 12 (adjusting each month as more information becomes available). The computation: Annual Gross = Monthly Gross × 12. Subtract Standard Deduction (₹75,000 in both regimes, FY 2025–26). Subtract other exemptions/deductions per declared investments (Form 12BB — if old regime: 80C, HRA exemption, LTA, 80D, home loan interest). Apply applicable tax slab rates. Add 4% health and education cess. Divide annual tax by 12 = monthly TDS.",
          "TDS calibration during the year: At the start of the year (April–May), employers often deduct conservative TDS based on prior year data. From June onwards, as employees submit Form 12BB (investment declaration), TDS is adjusted. In Q3–Q4 (October–March), if actual investments are lower than declared, employers may increase monthly TDS to recover the shortfall. Final TDS adjustment typically happens in the February or March payslip.",
          "New regime is now the default: From FY 2023–24, if an employee does not explicitly declare a regime preference (via Form 10IEA or employer's investment declaration form), the employer deducts TDS under the new regime. Employees who want old regime benefits must proactively declare this choice to their employer in April. Under the new regime, only standard deduction (₹75,000) and employer NPS contribution (80CCD(2)) are deductible — no HRA, 80C, 80D, LTA.",
        ],
      },
      {
        heading: "CTC vs Gross vs In-Hand: The Three Numbers Every Indian Employee Must Know",
        paragraphs: [
          "CTC (Cost to Company): Everything the company spends on you. Includes employer PF, gratuity accrual, group insurance, and any other employer-funded benefits. CTC is the headline number in offer letters. It is not money you receive — it includes both employee-received and employer-side costs. Monthly CTC = Gross + Employer PF + Gratuity monthly accrual + Other employer costs.",
          "Gross salary: The total of all salary components that appear as 'earnings' on your payslip — basic, HRA, special allowance, LTA, medical allowance, etc. Gross = CTC minus all employer-side costs. On a ₹1,00,000 CTC at 40% basic: Gross = ₹95,200 (after removing ₹4,800 employer PF). Annual gross = ₹11,42,400.",
          "In-hand (take-home, net): What your bank account receives. In-hand = Gross minus employee PF minus professional tax minus monthly TDS. On ₹95,200 gross: In-hand = ₹95,200 − ₹4,800 − ₹200 − ₹4,051 = ₹86,149. CTC:Gross:In-hand ratio at ₹12 LPA CTC = 100 : 95.2 : 86.1. At higher CTCs (e.g., ₹20 LPA), the ratio widens to approximately 100 : 95 : 73 due to higher marginal tax rates.",
        ],
      },
      {
        heading: "Maximising In-Hand Salary: Structuring and Regime Decisions",
        paragraphs: [
          "Lower basic % (within HR policy): Reduces employee PF deduction (which comes from gross). At ₹1,00,000 CTC, switching from 50% basic (₹6,000 PF) to 30% basic (₹3,600 PF) saves ₹2,400/month in-hand. The trade-off: lower PF accumulation, lower gratuity base, lower HRA (relevant only for old regime), and lower ESIC contribution (if applicable).",
          "Employer NPS contribution (80CCD(2)): Even in the new regime, employer NPS contributions (up to 10% of basic) are deductible from taxable income for the employee. If your employer offers to redirect 5% of basic to NPS as 'employer NPS contribution', this reduces your taxable gross by ₹2,000/month (5% of ₹40,000 basic), saving ₹200–₹600/month in TDS depending on your slab. This effectively increases in-hand without any cash cost to the employer (the NPS contribution comes from within the CTC).",
          "Tax regime optimisation: For a ₹12 LPA CTC employee in FY 2025–26, the new regime with the ₹12 lakh rebate limit typically gives zero tax payable (taxable income after ₹75K std deduction ≈ ₹10.67L < ₹12L rebate threshold). This means TDS close to ₹0 under the new regime — a significant in-hand boost compared to old regime where TDS may be ₹4,000–₹6,000/month. At this CTC level, always verify the new regime calculation before opting for old regime.",
        ],
      },
    ],
    tables: [
      {
        title: "In-Hand Salary from CTC — Maharashtra, 40% Basic, New Regime FY 2025–26",
        columnHeaders: ["Monthly CTC (₹)", "Gross (₹)", "Emp. PF (₹)", "PT (₹)", "Monthly TDS (₹)", "In-Hand (₹/month)", "In-Hand Annual (₹)"],
        rows: [
          ["40,000", "38,080", "1,920", "175", "0 (rebate)", "35,985", "4,31,820"],
          ["60,000", "57,120", "2,880", "200", "0 (rebate)", "54,040", "6,48,480"],
          ["80,000", "76,160", "3,840", "200", "1,200", "70,920", "8,51,040"],
          ["1,00,000", "95,200", "4,800", "200", "4,051", "86,149", "10,33,788"],
          ["1,20,000", "1,14,240", "5,760", "200", "6,800", "1,01,480", "12,17,760"],
          ["1,50,000", "1,42,800", "7,200", "200", "11,500", "1,23,900", "14,86,800"],
          ["2,00,000", "1,90,400", "9,600", "200", "21,000", "1,59,600", "19,15,200"],
        ],
      },
      {
        title: "State-wise Professional Tax and Its Impact on Monthly In-Hand",
        columnHeaders: ["State", "Monthly PT (₹)", "Annual PT (₹)", "In-Hand Impact (₹/month)", "Tax Deduction Value @ 20% slab"],
        rows: [
          ["Delhi", "0", "0", "₹200 more than Maharashtra", "N/A"],
          ["Tamil Nadu", "0", "0 (abolished 2023)", "₹200 more than Maharashtra", "N/A"],
          ["Rajasthan", "0", "0", "₹200 more than Maharashtra", "N/A"],
          ["Maharashtra", "200", "2,500 (Feb ₹300)", "Baseline", "₹480 PT tax saving"],
          ["Karnataka", "200", "2,400", "Same as Maharashtra", "₹480 saving"],
          ["Andhra Pradesh", "200", "2,400", "Same as Maharashtra", "₹480 saving"],
          ["West Bengal", "208", "2,496", "₹8 less than Maharashtra", "₹499 saving"],
          ["Kerala", "212", "2,544", "₹12 less than Maharashtra", "₹509 saving"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gross to in-hand: three deduction layers reduce your pay",
      caption:
        "Employee PF removes a fixed 12% of basic, professional tax removes a small flat amount, and TDS removes a progressive income-linked amount. At higher CTCs, TDS grows fastest — the primary driver of the widening CTC-to-in-hand gap.",
      sparkValues: [1, 0.952, 0.904, 0.902, 0.862],
    },
    faq: [
      {
        question: "Why is my in-hand lower than CTC divided by 12?",
        answer:
          "CTC ÷ 12 gives monthly CTC, not monthly in-hand. Three layers separate them: (1) CTC → Gross: Employer PF and gratuity accrual are part of CTC but do not appear in your payslip gross. (2) Gross → Pre-tax net: Employee PF and professional tax are deducted from gross. (3) Pre-tax net → In-hand: Income tax (TDS) is further deducted. At ₹12 LPA CTC: CTC/12 = ₹1,00,000. Gross = ₹95,200. In-hand ≈ ₹86,149. The difference (₹13,851) consists of employer PF (₹4,800), employee PF (₹4,800), PT (₹200), and TDS (₹4,051).",
      },
      {
        question: "Does the in-hand change month to month even though salary is fixed?",
        answer:
          "Slightly — professional tax in Maharashtra is ₹300 in February (vs ₹200 in other months), which reduces in-hand by ₹100 in February only. TDS can also vary if: (a) your employer adjusts the calibration based on confirmed investments (February adjustment month), (b) you receive variable pay in specific months (TDS spikes in those months), or (c) a salary hike takes effect mid-year, requiring TDS recalibration. For most employees with only fixed salary and no mid-year hike, in-hand is constant except for the February PT variation.",
      },
      {
        question: "When does my EPF accumulation become accessible?",
        answer:
          "EPF (both your contributions and employer's) can be fully withdrawn after 2 months of continuous unemployment (resignation, layoff). Partial withdrawals are permitted for specific purposes: medical treatment (up to 6 months' salary), marriage (up to 50% of employee's contribution after 7 years), home purchase (up to 90% after 5 years), education (after 7 years). EPF balance at retirement (age 58) is fully tax-free if withdrawn. Withdrawals before 5 years of continuous service are taxable. The EPS (pension) component (8.33% of employer's PF contribution, on salary ≤ ₹15,000) is not available for lump-sum withdrawal — it becomes the pension corpus.",
      },
      {
        question: "My employer caps PF at ₹1,800/month — is that correct?",
        answer:
          "Yes, this is legally valid. The EPF Act sets the wage ceiling at ₹15,000/month — employers are only obligated to contribute 12% of ₹15,000 = ₹1,800/month. For employees with basic > ₹15,000, the employer can legally cap their contribution at ₹1,800. The employee's own contribution follows the employer's practice: if employer caps at ₹1,800, the employee is typically also capped at ₹1,800 (12% of ₹15,000) — meaning your PF deduction is only ₹1,800/month regardless of your basic. This significantly increases in-hand but reduces EPF accumulation. Many large IT companies have moved to this capped model.",
      },
      {
        question: "How do I declare my tax regime preference to my employer?",
        answer:
          "At the start of each financial year (April), your employer sends an investment declaration form (Form 12BB) or an online portal prompt. On this form, you indicate: (a) Your regime choice (new or old). (b) If old regime: your investment declarations (80C, 80D, HRA details, home loan interest, LTA). The employer uses this to calibrate monthly TDS throughout the year. If you do not respond, the employer defaults to the new regime (from FY 2023–24 onwards). You can switch regime when filing your ITR (the switch at ITR filing is final for that year for salaried employees). Note: switching at ITR time may create TDS mismatch, requiring refund or payment of advance tax.",
      },
    ],
    meta: {
      seoTitle: "In-Hand Salary Calculator India — Take-Home Pay from CTC (FY 2025–26)",
      seoDescription:
        "Calculate monthly in-hand salary in India from CTC with exact PF deduction, state-wise professional tax, and income tax under new or old regime. Understand why in-hand is 80–90% of CTC and how to maximise take-home.",
      keywords: [
        "in hand salary calculator india",
        "take home salary calculator india 2025",
        "net salary from ctc india",
        "in hand salary after pf and tax india",
        "monthly take home salary india new regime",
        "ctc to in hand india 2025-26",
        "in hand salary 12 lpa india",
        "employee pf tds professional tax calculator",
        "how to calculate in hand salary india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "income-tax-calculator-india-old-vs-new-regime": {
    slug: "income-tax-calculator-india-old-vs-new-regime",
    vertical: "finance-loan",
    category: "finance",
    shellNote: shellIndia,
    sections: [
      {
        heading: "India's Two Tax Regimes: What Changed in FY 2025–26",
        paragraphs: [
          "India has two income tax regimes for salaried individuals: the New Tax Regime (default from FY 2023–24) and the Old Tax Regime (opt-in). The key difference: the new regime offers lower slab rates and a higher rebate threshold but disallows most deductions and exemptions. The old regime has higher slab rates but allows HRA exemption, Section 80C, 80D, home loan interest (Section 24(b)), LTA, and other deductions that can significantly reduce taxable income.",
          "Major FY 2025–26 changes to the new regime: (1) The Section 87A rebate threshold was raised to ₹12 lakh of taxable income (from ₹7 lakh in FY 2024–25). This means employees with taxable income ≤ ₹12 lakh (after standard deduction) pay zero tax under the new regime. (2) New slabs: 0% up to ₹4 lakh; 5% on ₹4–8 lakh; 10% on ₹8–12 lakh; 15% on ₹12–16 lakh; 20% on ₹16–20 lakh; 25% on ₹20–24 lakh; 30% above ₹24 lakh. Standard deduction is ₹75,000 in both regimes.",
          "Old regime slabs (unchanged): 0% up to ₹2.5 lakh; 5% on ₹2.5–5 lakh; 20% on ₹5–10 lakh; 30% above ₹10 lakh. Available deductions include: Standard deduction ₹75,000, Section 80C up to ₹1.5 lakh, Section 80D (health insurance) up to ₹25,000–₹50,000, HRA exemption (computed via the three-test minimum formula), NPS additional deduction ₹50,000 under 80CCD(1B), home loan interest up to ₹2 lakh under 24(b), LTA exemption.",
        ],
      },
      {
        heading: "Worked Example: ₹12,00,000 Annual Income with 80C and HRA",
        paragraphs: [
          "Inputs: Annual income = ₹12,00,000. 80C deductions = ₹1,50,000. Monthly basic+DA = ₹50,000. HRA received monthly = ₹25,000. Rent paid monthly = ₹18,000. Metro city.",
          "New regime (FY 2025–26): Taxable income = ₹12,00,000 − ₹75,000 std deduction = ₹11,25,000. Since ₹11,25,000 < ₹12 lakh rebate threshold, tax payable = ₹0 (full rebate u/s 87A). Annual TDS = ₹0. Monthly TDS = ₹0.",
          "Old regime (FY 2025–26): HRA exemption = min(₹25,000 actual HRA; ₹18,000 − 10%×₹50,000 = ₹13,000; 50%×₹50,000 = ₹25,000) = ₹13,000/month = ₹1,56,000 annual. Taxable income = ₹12,00,000 − ₹75,000 (std) − ₹1,50,000 (80C) − ₹1,56,000 (HRA) = ₹8,19,000. Tax: 0 (0–2.5L) + ₹12,500 (2.5–5L @5%) + ₹63,800 (5–8.19L @20%) = ₹76,300. + 4% cess = ₹79,352. Monthly TDS = ₹6,613.",
          "Verdict for this example: New regime saves ₹79,352 annually (₹6,613/month more in-hand). Despite having ₹3,06,000 in deductions (₹1.5L 80C + ₹1.56L HRA), the old regime is significantly more expensive because the ₹12L new regime rebate eliminates tax entirely. Old regime only becomes competitive when total deductions are very large — typically ₹4+ lakh for ₹12 LPA income level.",
        ],
      },
      {
        heading: "New Regime Tax Slabs vs Old Regime Slabs — FY 2025–26 Complete Comparison",
        paragraphs: [
          "New regime slabs FY 2025–26: ₹0–4 lakh: 0%. ₹4–8 lakh: 5% (max ₹20,000). ₹8–12 lakh: 10% (max ₹40,000). ₹12–16 lakh: 15% (max ₹60,000). ₹16–20 lakh: 20% (max ₹80,000). ₹20–24 lakh: 25% (max ₹1,00,000). Above ₹24 lakh: 30%. Plus 4% health and education cess on tax. Surcharge: 10% on total income ₹50L–₹1Cr; 15% on ₹1–2Cr; 25% on ₹2–5Cr; 25% on >₹5Cr (reduced from 37% in new regime).",
          "Old regime slabs FY 2025–26: ₹0–2.5 lakh: 0%. ₹2.5–5 lakh: 5% (max ₹12,500). ₹5–10 lakh: 20% (max ₹1,00,000). Above ₹10 lakh: 30%. Plus 4% cess. Surcharge: same as new regime. Old regime rebate u/s 87A: zero tax if taxable income (after all deductions) ≤ ₹5 lakh.",
          "The critical difference is the 20% slab in the old regime (₹5–10 lakh) versus the graduated 5%/10%/15% in the new regime for the same range. This means for taxable incomes in the ₹5–10 lakh range, the old regime charges 20% while the new regime charges only 5–10%. Old regime only wins when deductions reduce taxable income below ₹5 lakh (old regime rebate threshold) from a high starting income — typically requiring ₹4–5 lakh+ in deductions for a ₹15–25 LPA income.",
        ],
      },
      {
        heading: "Which Regime to Choose: Decision Framework by Income and Deduction Level",
        paragraphs: [
          "For annual income ≤ ₹12.75 lakh (taxable income ≤ ₹12 lakh after ₹75K std deduction): New regime is almost always better — zero tax under the ₹12L rebate, regardless of deductions. Old regime starts at ₹0 too only if taxable income ≤ ₹5 lakh (old regime rebate threshold), which requires ₹7.75+ lakh in deductions — impossible on ₹12.75 lakh income.",
          "For annual income ₹12.75–20 lakh: Run both calculations. New regime tax = straightforward slab application. Old regime tax = slab on income after standard deduction + 80C (₹1.5L) + 80D (up to ₹50K) + HRA + home loan interest (up to ₹2L) + NPS 80CCD(1B) (₹50K). Total possible deductions: up to ₹5–6 lakh for maximally-optimised old regime. If your actual deductions exceed ₹3–3.5 lakh at ₹15 LPA income, old regime may be better.",
          "For annual income above ₹20 lakh: Old regime frequently wins for employees with home loans (₹2L interest deduction), HRA (₹2L+), and maxed 80C+80D+NPS (₹2.5L). Total deductions of ₹6.5L+ reduce old regime taxable income to ₹13.5L, taxed at ~₹3.85L (old). New regime on ₹20L income: tax ≈ ₹2.97L (at new slabs, no deductions). Difference depends on actual deductions — compute both annually with your exact figures.",
        ],
      },
      {
        heading: "Switching Regime and Practical Tax Filing Guidance",
        paragraphs: [
          "For salaried employees, the regime must be communicated to the employer at the start of the financial year (April) via investment declaration / Form 10IEA. The employer deducts TDS for the entire year under the declared regime. At ITR filing (by July 31 for most salaried employees), you can switch regime one final time — but if you switch at ITR time and the regime change results in higher tax, you may face advance tax liability.",
          "Salaried employees can switch between old and new regime every year (unlike business owners who switch to old regime and are stuck for multiple years). This means you should reassess the better regime annually — a home loan taken this year, or your 80C investments maturing, can flip the calculation significantly.",
          "Standard deduction history and current status: Standard deduction for salaried employees was reintroduced in FY 2018–19 at ₹40,000, raised to ₹50,000 from FY 2019–20, and further raised to ₹75,000 from FY 2024–25 (applicable in both regimes). The ₹75,000 standard deduction is automatic — you do not need to claim it or submit proof. It simply reduces your taxable salary by ₹75,000 before any other computation.",
        ],
      },
    ],
    tables: [
      {
        title: "New Regime vs Old Regime Tax — FY 2025–26 at ₹12,00,000 Annual Income",
        columnHeaders: ["Item", "New Regime (₹)", "Old Regime (₹)"],
        rows: [
          ["Annual gross income", "12,00,000", "12,00,000"],
          ["Standard deduction", "−75,000", "−75,000"],
          ["Section 80C", "Not allowed", "−1,50,000"],
          ["HRA exemption (annual)", "Not allowed", "−1,56,000"],
          ["Taxable income", "11,25,000", "8,19,000"],
          ["Tax (before cess)", "0 (rebate ≤₹12L)", "76,300"],
          ["Add 4% cess", "0", "3,052"],
          ["Annual tax payable", "0", "79,352"],
          ["Monthly TDS", "0", "6,613"],
          ["Better regime", "NEW (saves ₹79,352)", "—"],
        ],
      },
      {
        title: "New vs Old Regime — Break-Even Deduction Analysis at Key Income Levels",
        columnHeaders: ["Annual Income (₹)", "New Regime Tax (₹)", "Old Regime Break-Even Deduction (₹)", "Old Regime Wins When Deductions Exceed", "Typical Max Deduction Available (₹)"],
        rows: [
          ["8,00,000", "0 (rebate)", "N/A — new regime always better", "Impossible", "~3,00,000"],
          ["10,00,000", "0 (rebate)", "N/A — new regime always better", "Impossible", "~3,50,000"],
          ["12,00,000", "0 (rebate)", "₹3,50,000+", "Very hard to achieve", "~4,00,000"],
          ["15,00,000", "30,000", "₹3,50,000", "Achievable with home loan", "~5,00,000"],
          ["20,00,000", "1,17,000", "₹4,00,000", "Easily achievable", "~6,00,000"],
          ["25,00,000", "2,17,000", "₹4,20,000", "Easily achievable", "~6,50,000"],
          ["35,00,000", "5,17,000", "₹4,60,000", "Very achievable", "~7,00,000"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "New regime tax is lower at most income levels up to ₹20 lakh (FY 2025–26)",
      caption:
        "The FY 2025–26 ₹12L rebate makes the new regime dominant for most salaried employees up to ₹12.75 LPA. Above ₹15 LPA, the comparison depends on actual deductions — employees with home loans, high HRA, and maxed 80C/NPS investments should compute both regimes annually.",
      sparkValues: [0, 0, 0.05, 0.15, 0.35, 0.55, 0.75, 1.0],
    },
    faq: [
      {
        question: "Which tax regime is better for a ₹12 LPA employee in FY 2025–26?",
        answer:
          "New regime is almost certainly better for a ₹12 LPA employee in FY 2025–26. Under the new regime with ₹75,000 standard deduction, taxable income = ₹11,25,000 — below the ₹12 lakh rebate threshold, so tax = ₹0. Under old regime with maximum typical deductions (₹75K std + ₹1.5L 80C + ₹1.56L HRA), taxable income = ₹8,19,000, tax ≈ ₹79,352. New regime saves ₹79,352/year (₹6,613/month more in-hand). Only very exceptional deduction profiles could make old regime better at ₹12 LPA.",
      },
      {
        question: "Can I switch tax regime every year?",
        answer:
          "Yes — salaried employees can switch between new and old regime every financial year. The switch must be declared to your employer at the start of the year (April). At ITR filing, you can also switch one final time regardless of what you declared to your employer — but the TDS already deducted under the employer-declared regime creates a mismatch, requiring either a refund claim (if you switched to new regime at ITR time and old regime was applied by employer) or self-assessment tax payment (if vice versa). Business owners (filing ITR-3 or ITR-4) face restrictions: switching from new to old regime is not allowed after the first switch back.",
      },
      {
        question: "What deductions are allowed in the new regime?",
        answer:
          "Very few deductions are available in the new regime: Standard deduction ₹75,000 (automatic). Employer NPS contribution under 80CCD(2) (up to 10% of basic — deductible even in new regime). AGIF (Army Group Insurance Fund) premium for armed forces personnel. Professional tax paid (Section 16(iii)). Deductions not available: 80C (₹1.5L), 80D (health insurance), HRA exemption, LTA exemption, home loan interest under 24(b), 80TTA/TTB (savings interest), 80E (education loan interest), 80G (donations), and most other deductions. The new regime's simplicity is its advantage — only the above deductions need to be tracked.",
      },
      {
        question: "What is the standard deduction and do I need to claim it?",
        answer:
          "The standard deduction is an automatic ₹75,000 reduction from your gross salary income, applicable in both regimes from FY 2024–25. It does not require any proof or declaration — it is automatically applied when computing taxable income. Your employer's TDS computation already factors in the standard deduction (it appears as a deduction in Part B of Form 16). The standard deduction replaced the earlier ₹15,000 medical reimbursement and ₹19,200 transport allowance exemptions. For salaried employees, it is the most valuable deduction in the new regime — saving ₹7,500–₹22,500 in tax depending on your slab.",
      },
      {
        question: "Is Section 87A rebate the same as tax exemption?",
        answer:
          "No — Section 87A is a rebate (not an exemption). It works as follows: first compute tax on taxable income using the applicable slabs. If that computed tax is ≤ the rebate limit (₹25,000 for income ≤ ₹12 lakh under new regime; ₹12,500 for income ≤ ₹5 lakh under old regime), the entire tax is waived. If computed tax exceeds the rebate limit, no rebate is given. This means the rebate has a cliff edge: at ₹11,99,999 taxable income (new regime), tax = ₹0. At ₹12,00,001 taxable income, tax = the full slab computation minus marginal relief. Marginal relief ensures you never pay more tax on the excess over the rebate threshold than the excess income itself.",
      },
    ],
    meta: {
      seoTitle: "Income Tax Calculator India — Old vs New Regime Comparison FY 2025–26",
      seoDescription:
        "Compare income tax under old and new regime for FY 2025–26. See how ₹12 lakh rebate, 80C, HRA, and standard deduction affect annual tax. Find which regime saves more for your income and deduction profile.",
      keywords: [
        "income tax calculator india old vs new regime",
        "new regime vs old regime 2025-26",
        "income tax calculator india 2025",
        "which tax regime is better india",
        "section 87a rebate 12 lakh new regime",
        "india tax comparison calculator",
        "80c hra tax saving calculator india",
        "new tax regime 2025 slabs calculator",
        "old tax regime deductions calculator india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "hra-calculator": {
    slug: "hra-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. HRA exemption = minimum of three values: (1) actual HRA received, (2) rent paid − 10% of basic, (3) 50% of basic (metro) or 40% of basic (non-metro). Only applicable under the old tax regime. New regime does not allow HRA exemption.",
    sections: [
      {
        heading: "What Is HRA Exemption and How Is It Calculated?",
        paragraphs: [
          "House Rent Allowance (HRA) is a salary component paid by employers to employees to cover residential rent expenses. Under Section 10(13A) of the Income Tax Act, the amount of HRA exempt from income tax is the minimum of three calculations — not the full HRA received. This three-test minimum formula is designed to limit the exemption to actual rent paid beyond a self-sufficiency threshold, preventing abuse by employees who do not actually pay rent.",
          "The three tests: (1) Actual HRA received from employer (per month). (2) Rent paid per month minus 10% of basic salary per month. (3) 50% of basic salary if the employee lives in a metro city (Mumbai, Delhi, Kolkata, Chennai); 40% of basic for all other cities.",
          "Exempted HRA = minimum of all three values. Taxable HRA = Actual HRA received minus exempted HRA. The taxable HRA is added back to your gross income and taxed at your applicable slab rate. This calculator computes the exemption and shows which of the three tests is the limiting factor — the 'binding constraint' on your exemption.",
        ],
      },
      {
        heading: "Worked Example: Basic ₹50,000, HRA ₹25,000, Rent ₹18,000, Metro",
        paragraphs: [
          "Inputs: Monthly basic salary = ₹50,000. HRA received monthly = ₹25,000. Rent paid monthly = ₹18,000. City type: Metro (50% rule).",
          "Test 1 — Actual HRA received: ₹25,000. Test 2 — Rent minus 10% of basic: ₹18,000 − 10% × ₹50,000 = ₹18,000 − ₹5,000 = ₹13,000. Test 3 — 50% of basic (metro): 50% × ₹50,000 = ₹25,000.",
          "HRA Exemption = minimum(₹25,000, ₹13,000, ₹25,000) = ₹13,000/month. Limiting factor: Test 2 (rent − 10% of basic). Taxable HRA = ₹25,000 − ₹13,000 = ₹12,000/month. Annual exemption = ₹13,000 × 12 = ₹1,56,000. Annual taxable HRA = ₹12,000 × 12 = ₹1,44,000.",
          "Tax saving from this exemption: At 20% slab (old regime), ₹1,56,000 annual exemption saves ₹31,200 in income tax + 4% cess = ₹32,448/year (₹2,704/month). To maximise this, you would need to pay higher rent — paying ₹25,000/month rent: Test 2 = ₹25,000 − ₹5,000 = ₹20,000. New exemption = min(₹25,000, ₹20,000, ₹25,000) = ₹20,000/month. Annual saving jumps to ₹2,40,000 × 20% × 1.04 = ₹49,920/year.",
        ],
      },
      {
        heading: "Metro vs Non-Metro: Which Cities Get the 50% Rule?",
        paragraphs: [
          "The four metros eligible for the 50% of basic rule are: Mumbai (and Navi Mumbai, Thane), Delhi (and NCR — Noida, Gurgaon), Kolkata, and Chennai. All other cities — including Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur, Kochi — use the 40% of basic rule, even though their rental costs may be comparable to metros.",
          "Impact of the metro classification: At ₹50,000 basic, Test 3 gives ₹25,000 (metro) vs ₹20,000 (non-metro). If Test 3 is the binding constraint (which it is when rent is very high relative to HRA received), the exemption is ₹5,000/month less for a non-metro city, costing approximately ₹12,480/year more in tax (at 20% slab + cess). This is a known anomaly — Bengaluru employees paying ₹50,000 rent on ₹25,000 HRA get less exemption than Delhi employees in the same situation, despite similar market rental costs.",
          "Demand for expansion: Multiple tax reform committees and industry bodies have recommended expanding the metro classification to include Bengaluru, Hyderabad, Pune, and Ahmedabad due to their high rental costs. As of FY 2025–26, no expansion has been notified — only the original four metros qualify for 50%.",
        ],
      },
      {
        heading: "How to Maximise HRA Exemption Legally",
        paragraphs: [
          "The limiting test determines your exemption ceiling. To identify and overcome your binding constraint: If Test 2 (rent − 10% of basic) is limiting: Pay more rent. Every additional ₹1,000 in rent paid increases your exemption by ₹1,000 (up to the cap set by Test 1 or Test 3). You can pay rent to a parent (if they own the property) and claim HRA — this is legal, provided the parent declares the rent income in their ITR and the arrangement is genuine (bank transfers, receipts, and rental agreement required). If Test 1 (actual HRA received) is limiting: Negotiate with your employer to increase HRA component (reduce special allowance by equivalent amount, keeping gross constant). This has no cost to the employer. If Test 3 (50%/40% of basic) is limiting: You are paying high rent and receiving high HRA, but your basic is capping the exemption. Increasing basic (by restructuring) would raise Test 3 — but higher basic also means higher PF and gratuity. Calculate the net benefit.",
          "Rent receipts and PAN requirement: To claim HRA exemption, you must provide rent receipts to your employer with the landlord's name, address, and rent amount. If annual rent exceeds ₹1 lakh (₹8,333/month), the landlord's PAN is mandatory. If the landlord does not have PAN, they must provide a declaration — but employers may decline to process the HRA exemption without PAN. Many employees pay rent to parents and receive their PAN without friction.",
          "HRA for self-owned accommodation: If you live in a house you own (whether mortgaged or fully owned), you cannot claim HRA exemption — even if your employer pays you HRA as a salary component. HRA exemption requires you to actually be paying rent. The HRA received is fully taxable if you do not pay rent. However, home loan interest on a self-occupied property is deductible up to ₹2 lakh under Section 24(b) — the alternative tax benefit for home-owners.",
        ],
      },
      {
        heading: "HRA in the New Regime vs Old Regime — A Clear Comparison",
        paragraphs: [
          "Old tax regime: HRA exemption is available under Section 10(13A). The exempt portion reduces your gross total income before slab application. As shown in the worked example, annual HRA exemption of ₹1,56,000 saves ₹32,448/year at a 20% effective rate.",
          "New tax regime: HRA exemption is not available. The entire HRA received (₹25,000/month = ₹3,00,000/year in the example) is taxable as part of salary income. However, for employees under the new regime at ₹12 LPA, the zero-tax benefit (87A rebate) means this extra taxable HRA may not increase tax liability anyway — because even with the full HRA taxed, total taxable income may still be within the rebate threshold.",
          "Decision rule for HRA: If you are using the old regime specifically because of HRA exemption (and your total deductions including HRA make old regime better), carefully compute both. The HRA exemption calculator helps quantify your annual HRA exemption — input this into the tax comparison calculator to see whether switching to new regime (with zero HRA benefit but potentially lower slabs and higher rebate) is still better overall. For ₹15 LPA income with large HRA, old regime frequently wins — use the tax compare calculator to confirm.",
        ],
      },
    ],
    tables: [
      {
        title: "HRA Exemption at Various Rent Levels — Basic ₹50,000, HRA ₹25,000, Metro",
        columnHeaders: ["Monthly Rent (₹)", "Test 1: HRA rcvd (₹)", "Test 2: Rent−10%basic (₹)", "Test 3: 50%basic (₹)", "Exemption/Month (₹)", "Annual Exemption (₹)", "Tax Saving @20%+cess (₹)"],
        rows: [
          ["5,000", "25,000", "0 (below 10% basic)", "25,000", "0", "0", "0"],
          ["8,000", "25,000", "3,000", "25,000", "3,000", "36,000", "7,488"],
          ["12,000", "25,000", "7,000", "25,000", "7,000", "84,000", "17,472"],
          ["18,000", "25,000", "13,000", "25,000", "13,000", "1,56,000", "32,448"],
          ["25,000", "25,000", "20,000", "25,000", "20,000", "2,40,000", "49,920"],
          ["32,000", "25,000", "27,000", "25,000", "25,000", "3,00,000", "62,400"],
          ["40,000", "25,000", "35,000", "25,000", "25,000", "3,00,000", "62,400"],
        ],
      },
      {
        title: "Metro vs Non-Metro HRA Exemption Comparison — Basic ₹50,000, HRA ₹25,000, Rent ₹18,000",
        columnHeaders: ["City Type", "Test 3 Limit", "Binding Test", "Monthly Exemption (₹)", "Annual Exemption (₹)", "Annual Tax Saving @20%+cess (₹)", "Annual Tax Saving @30%+cess (₹)"],
        rows: [
          ["Metro (Mumbai/Delhi/Kolkata/Chennai)", "₹25,000 (50% of basic)", "Test 2 (₹13,000)", "13,000", "1,56,000", "32,448", "48,672"],
          ["Non-metro (Bengaluru/Hyderabad/Pune)", "₹20,000 (40% of basic)", "Test 2 (₹13,000)", "13,000", "1,56,000", "32,448", "48,672"],
          ["Metro — high rent ₹30,000", "₹25,000 (50% of basic)", "Test 1/3 (₹25,000)", "25,000", "3,00,000", "62,400", "93,600"],
          ["Non-metro — high rent ₹30,000", "₹20,000 (40% of basic)", "Test 3 (₹20,000)", "20,000", "2,40,000", "49,920", "74,880"],
          ["Metro — very low rent ₹6,000", "₹25,000 (50% of basic)", "Test 2 (₹1,000)", "1,000", "12,000", "2,496", "3,744"],
          ["Non-metro — very low rent ₹6,000", "₹20,000 (40% of basic)", "Test 2 (₹1,000)", "1,000", "12,000", "2,496", "3,744"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "HRA exemption increases with rent paid, capped by the three-test minimum",
      caption:
        "HRA exemption rises as rent paid increases, but plateaus when either the actual HRA received or 50%/40% of basic becomes the binding constraint. The inflection point is when Test 2 (rent − 10% basic) equals Test 1 or Test 3 — beyond this, paying more rent gives no additional exemption.",
      sparkValues: [0, 0.12, 0.34, 0.52, 0.77, 1.0, 1.0, 1.0],
    },
    faq: [
      {
        question: "Can I claim HRA if I pay rent to my parents?",
        answer:
          "Yes — paying rent to parents is a legitimate HRA claim strategy, provided: (1) The property is genuinely owned by the parent (not you). (2) Rent is actually paid via bank transfer (not cash for amounts verifiable). (3) A rental agreement exists, even if informal. (4) The parent declares the rental income in their own ITR (income from house property). If your parent is in a lower tax bracket or below the taxable income threshold, the family's net tax outflow is reduced. However, if your employer's payroll department requires a PAN-linked declaration and rent receipt for amounts above ₹1 lakh/year, ensure your parent's PAN is available.",
      },
      {
        question: "My company is in Bengaluru — do I get the 50% metro HRA benefit?",
        answer:
          "No — Bengaluru is not classified as a metro for HRA exemption purposes under Section 10(13A). Only Mumbai, Delhi, Kolkata, and Chennai qualify for the 50% of basic limit. Bengaluru employees use the 40% of basic limit (Test 3). At ₹50,000 basic: metro gives ₹25,000 max from Test 3; Bengaluru gives ₹20,000 max. The difference (₹5,000/month) costs approximately ₹12,480/year more in tax at the 20% slab. Hyderabad, Pune, Ahmedabad, Jaipur, Kochi — all non-metro for HRA purposes, despite their high rental markets.",
      },
      {
        question: "Is there a minimum rent I must pay to claim HRA?",
        answer:
          "Yes — you must pay rent exceeding 10% of basic salary to get any HRA exemption. At ₹50,000 basic, the 10% threshold is ₹5,000/month. Any rent ≤ ₹5,000/month gives zero exemption (Test 2 = 0 or negative). Rent of ₹5,001/month gives only ₹1 exemption. Paying exactly ₹6,000/month rent at ₹50,000 basic: Test 2 = ₹6,000 − ₹5,000 = ₹1,000 exemption. This is why low-rent situations (such as living in employer-provided accommodation below 10% of basic) yield no HRA benefit.",
      },
      {
        question: "Does HRA exemption apply to the new tax regime?",
        answer:
          "No — HRA exemption under Section 10(13A) is not available in the new tax regime. If you opt for the new regime, your entire HRA received is taxable as salary income. This is a significant consideration for employees paying high rent in metro cities — the lost HRA exemption can cost ₹30,000–₹90,000+ annually in higher tax, depending on HRA amount and tax bracket. Use the Income Tax Comparison Calculator to see whether the new regime (with lower slabs and the ₹12L rebate) or the old regime (with HRA + 80C benefits) is better for your specific profile.",
      },
      {
        question: "What documents do I need to submit to claim HRA exemption from my employer?",
        answer:
          "Submit to your employer's payroll team by the deadline they specify (typically December–January for the current year): (1) Rent receipts for each month showing landlord name, address, amount, period, and signature. (2) Rental agreement / lease deed. (3) Landlord's PAN (mandatory if annual rent > ₹1 lakh). (4) Self-declaration form (some employers require a signed declaration of rent paid). If you miss the employer's deadline, the employer will not credit the HRA exemption in TDS — but you can still claim the exemption when filing your ITR by correctly filling the HRA exemption in Schedule EI or the respective field. The ITR-1 form has a dedicated HRA section under 'Salary income' for this purpose.",
      },
    ],
    meta: {
      seoTitle: "HRA Calculator India — Tax Exemption on House Rent Allowance (FY 2025–26)",
      seoDescription:
        "Calculate HRA tax exemption using the three-test minimum formula: actual HRA, rent minus 10% of basic, and 50%/40% of basic. Find which rule limits your exemption and how to maximise it. Metro vs non-metro explained.",
      keywords: [
        "hra calculator india",
        "hra exemption calculator",
        "house rent allowance tax exemption india",
        "hra calculation formula india",
        "hra metro non metro calculator",
        "section 10 13a hra exemption",
        "how to calculate hra exemption india",
        "hra old regime calculator 2025",
        "rent paid hra tax saving india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "basic-salary-calculator": {
    slug: "basic-salary-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote: "Runs in your browser. Basic salary = Monthly CTC × basic %. Typical corporate splits range from 35–50% of CTC. Outputs basic monthly and annual; downstream PF, HRA, and gratuity calculations all anchor to this figure.",
    sections: [
      {
        heading: "What Is Basic Salary and Why It Is the Most Important Component of Your Pay",
        paragraphs: [
          "Basic salary is the fixed, non-variable core component of an employee's salary — the foundation from which all other compensation is built. Unlike allowances, bonuses, or employer contributions, basic salary is a guaranteed monthly payment that does not fluctuate with performance, attendance, or market conditions. It appears on every payslip as the first and typically largest single earning line (where the salary structure maintains 40–50% basic).",
          "Basic salary is significant not just because it is a portion of what you earn — but because at least three statutory calculations are anchored to it. Employee Provident Fund (EPF) = 12% of basic. Employer PF = 12% of basic (or 12% of ₹15,000 PF wage ceiling if capped). HRA = 40–50% of basic (set by employer, tax-exempt under Section 10(13A) for old-regime employees paying rent). Gratuity = (15/26) × basic salary per year of service. Dearness allowance (DA) = % of basic (in PSU and government pay structures). This means a ₹5,000 increase in basic salary generates a ₹600 increase in employee PF, a ₹600 increase in employer PF, a ₹2,000–₹2,500 increase in HRA, and a higher gratuity corpus on exit.",
          "This calculator takes your monthly CTC and the basic percentage (commonly available in your offer letter or HR salary template) and outputs your monthly basic and annual basic. These two numbers are the inputs you need for any PF, HRA, or gratuity calculation.",
        ],
      },
      {
        heading: "Worked Example: Monthly CTC ₹1,00,000 at 40% Basic",
        paragraphs: [
          "Default inputs: Monthly CTC = ₹1,00,000. Basic as % of CTC = 40%. Monthly basic = ₹1,00,000 × 40% = ₹40,000. Annual basic = ₹40,000 × 12 = ₹4,80,000.",
          "Downstream impact of this ₹40,000 basic: Employee PF = 12% × ₹40,000 = ₹4,800/month = ₹57,600/year. Employer PF = ₹4,800/month (deducted from CTC). HRA (metro, 50% of basic) = ₹20,000/month. Gratuity accrual (1 year) = (15/26) × ₹40,000 × 1 = ₹23,077. Special allowance = ₹95,200 (gross) − ₹40,000 (basic) − ₹20,000 (HRA) = ₹35,200/month. The entire salary structure — every number on your payslip — flows from this single ₹40,000 anchor.",
          "Compare with 50% basic on the same CTC: Basic = ₹50,000. Employee PF = ₹6,000/month (₹1,200 more). HRA = ₹25,000/month (₹5,000 more, useful under old regime). Gross = CTC − Employer PF = ₹1,00,000 − ₹6,000 = ₹94,000 (₹1,200 less than 40%). Special allowance = ₹94,000 − ₹50,000 − ₹25,000 = ₹19,000 (₹16,200 less than 40% basic). Same CTC, very different component split.",
        ],
      },
      {
        heading: "How to Find Your Basic Percentage from an Offer Letter or Payslip",
        paragraphs: [
          "From an offer letter: Look for a 'salary breakup' or 'compensation structure' annexure. It typically lists: CTC (annual), then breaks it into basic (annual), HRA (annual), special allowance (annual), employer PF (annual), and other components. Divide annual basic by annual CTC to get the basic %. Example: Basic ₹4,80,000 ÷ CTC ₹12,00,000 = 40%.",
          "From a payslip: Your payslip shows gross earnings (basic, HRA, allowances) and deductions (employee PF, PT, TDS). To reverse-calculate CTC, add employer PF back to gross: CTC = Gross + Employer PF + Gratuity accrual. Basic % = Basic ÷ CTC. Note: some companies express basic as a % of gross (not CTC) — in that case, Basic ÷ Gross gives the gross-based basic %. Verify which convention your employer uses.",
          "Industry norms by sector: Private IT/tech companies: basic typically 35–45% of CTC (minimising basic reduces PF, increasing take-home). FMCG / manufacturing: 45–55% of CTC. Banking (private): 40–50%. PSU / government: pay as per pay commission (7th Pay Commission for central government) — basic pay scales are set by the commission, not % of CTC. Start-ups: varies widely; some set 50–60% of CTC as basic. ESIC-covered establishments (gross ≤ ₹21,000/month): often keep basic at around 50%+ to match ESIC contribution base.",
        ],
      },
      {
        heading: "The Strategic Trade-Off: High Basic vs Low Basic",
        paragraphs: [
          "Low basic (30–40% of CTC): Lower employee PF deduction → higher monthly in-hand. Lower employer PF commitment → more of CTC available as direct gross earnings. Lower HRA component → less HRA tax benefit under old regime. Lower gratuity on exit (at 40% basic on ₹12 LPA CTC, gratuity after 5 years = ₹3,46,154; at 50% basic, it is ₹4,32,692). Best for employees in new tax regime who do not need HRA benefit and prefer liquid monthly cash over retirement savings.",
          "High basic (50–60% of CTC): Higher PF accumulation (better retirement corpus, compounding at 8.25% tax-free). Higher HRA — significant tax benefit under old regime if paying rent in a metro. Higher gratuity. Better ESIC contribution base (if applicable). Better for employees in old tax regime paying high rent (HRA exemption benefit), employees who value forced savings, and those near ESIC applicability threshold. Trade-off: ₹2,400–₹3,600/month less in-hand compared to 30–40% basic on the same CTC.",
          "The NPS middle path: Regardless of basic %, employees can request their employer to structure an employer NPS contribution (10% of basic under Section 80CCD(2)). At 40% basic (₹40,000), employer NPS = ₹4,000/month — this amount is deductible from taxable income in both new and old regimes, reducing annual TDS by ₹4,800–₹14,400 depending on slab. This lets you keep a moderate basic, maintain lower PF, and still get tax efficiency through NPS.",
        ],
      },
      {
        heading: "Basic Salary Across Industries and Pay Grades in India (FY 2025–26 Benchmarks)",
        paragraphs: [
          "Entry-level (0–2 years, B.Tech/MBA, Tier-1 company): CTC ₹6–15 LPA. Basic typically ₹2,10,000–₹5,25,000 annual (35–42% of CTC). PF contribution ₹21,000–₹52,500/year. Graduate in PSU (Group B officer, 7th Pay Commission Level 7): Basic ₹44,900–₹1,42,400/month on pay matrix. Allowances structured separately; no CTC concept in government pay.",
          "Mid-level (5–10 years, IT/product): CTC ₹20–45 LPA. Basic typically ₹7–18 LPA (35–40% of CTC). Employer PF often capped at ₹1,800/month (statutory ceiling), so effective employer PF contribution is low regardless of high basic. In-hand impact of PF ceiling: even at ₹1,50,000 basic, employer PF = only ₹1,800; employee PF is also ₹1,800 (capped) — saving ₹5,400/month in PF vs uncapped 12% of actual basic.",
          "Senior / CXO level (15+ years): CTC ₹1 Cr+. Basic may be only 15–25% of CTC; remainder structured as performance bonus, ESOPs, commission, variable, and perquisites. At these levels, CTC-to-basic% is nearly meaningless for payslip purposes — compensation is structured for tax efficiency using specific perquisite rules, business expenses, and executive pay plans.",
        ],
      },
    ],
    tables: [
      {
        title: "Basic Salary at Various CTC Levels and Basic Percentages",
        columnHeaders: ["Monthly CTC (₹)", "Basic @35% (₹/mo)", "Basic @40% (₹/mo)", "Basic @45% (₹/mo)", "Basic @50% (₹/mo)", "Annual Basic @40% (₹)"],
        rows: [
          ["40,000", "14,000", "16,000", "18,000", "20,000", "1,92,000"],
          ["60,000", "21,000", "24,000", "27,000", "30,000", "2,88,000"],
          ["80,000", "28,000", "32,000", "36,000", "40,000", "3,84,000"],
          ["1,00,000", "35,000", "40,000", "45,000", "50,000", "4,80,000"],
          ["1,25,000", "43,750", "50,000", "56,250", "62,500", "6,00,000"],
          ["1,50,000", "52,500", "60,000", "67,500", "75,000", "7,20,000"],
          ["2,00,000", "70,000", "80,000", "90,000", "1,00,000", "9,60,000"],
        ],
      },
      {
        title: "Impact of Basic % on Key Downstream Values — ₹1,00,000 Monthly CTC",
        columnHeaders: ["Basic %", "Basic (₹/mo)", "Emp. PF (₹/mo)", "HRA metro (₹/mo)", "Gross (₹/mo)", "In-Hand est. (₹/mo)", "Gratuity/year (₹)"],
        rows: [
          ["30%", "30,000", "3,600", "15,000", "96,400", "88,400", "17,308"],
          ["35%", "35,000", "4,200", "17,500", "95,800", "87,300", "20,192"],
          ["40%", "40,000", "4,800", "20,000", "95,200", "86,149", "23,077"],
          ["45%", "45,000", "5,400", "22,500", "94,600", "85,100", "25,962"],
          ["50%", "50,000", "6,000", "25,000", "94,000", "84,000", "28,846"],
          ["55%", "55,000", "6,600", "27,500", "93,400", "82,900", "31,731"],
          ["60%", "60,000", "7,200", "30,000", "92,800", "81,800", "34,615"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Higher basic % increases PF and HRA but reduces monthly in-hand",
      caption:
        "The trade-off is clear: a higher basic percentage grows your EPF corpus and HRA (old regime benefit) but reduces take-home through higher employee PF deduction. At ₹1,00,000 CTC, moving from 30% to 50% basic cuts monthly in-hand by approximately ₹4,400 while adding ₹2,400/month to EPF.",
      sparkValues: [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6],
    },
    faq: [
      {
        question: "Is basic salary always a fixed % of CTC?",
        answer:
          "In most private sector companies, yes — employers define basic as a percentage of CTC and it applies uniformly across salary grades. However, the practice is not legally mandated. Some employers define basic as a % of gross (not CTC), which gives slightly different numbers. Government and PSU employees have basic pay defined by pay commission scales — there is no CTC concept. At start-ups or companies restructuring for tax efficiency, basic may be computed differently. When using this calculator, use the % shown in your offer letter's salary breakup annexure. If unsure, ask HR 'what is basic as a % of gross or CTC in our structure?'",
      },
      {
        question: "What is the difference between basic salary and basic + DA?",
        answer:
          "DA (Dearness Allowance) is an inflation-linked supplement paid primarily in government, PSU, and some older private sector companies. For central government employees, DA is revised twice a year as a % of basic. DA is usually merged with basic for HRA and PF calculation purposes — hence the term 'basic + DA' in statutory contexts. For PF: wage = basic + DA (+ any other allowances attracting PF). For HRA: rent payment must exceed 10% of basic + DA. For gratuity: last drawn salary includes basic + DA. Most modern private IT companies do not pay DA at all — their salary structure is: Basic + HRA + Special Allowance, with no DA component. This calculator assumes no DA (private sector structure); for government/PSU employees with DA, add DA to basic before using gratuity or HRA calculators.",
      },
      {
        question: "Can I negotiate my basic salary separately from CTC?",
        answer:
          "You cannot usually negotiate CTC and basic independently — they are linked by the employer's salary structure policy (e.g., basic = 40% of CTC). However, you can negotiate: (1) The CTC itself (total package). (2) The basic percentage (HR flexibility varies — some companies allow restructuring requests at joining or during annual review). (3) Specific components like NPS employer contribution, meal allowance, or gadget allowance — which come from within the CTC. If you want a higher in-hand and are in the new tax regime, request a lower basic % (higher special allowance) — this reduces PF deduction. If you pay high rent and are in old regime, request a higher basic % to maximise HRA exemption.",
      },
      {
        question: "Does basic salary change every year, or only when I get a hike?",
        answer:
          "Basic salary changes only when you receive a hike or promotion. Between hikes, it stays fixed. Annual hike: typically applied in April (financial year start) for Indian companies. Hike on basic only: if your increment is '10% hike on basic', your basic increases by 10% — HRA, PF, and gratuity accrual all adjust accordingly. Hike on CTC: if your increment is '10% hike on CTC', the absolute increment is applied to CTC and then distributed as per the % structure (basic rises by 10% of 40% = 4% of CTC, etc.). Infrequent restructuring: some companies allow restructuring the basic % at annual salary revision time — useful to switch to lower basic % if you move from old to new tax regime.",
      },
      {
        question: "How is basic salary treated for income tax — is it fully taxable?",
        answer:
          "Yes — basic salary is fully taxable in both old and new income tax regimes. There is no exemption or deduction for basic salary itself. It forms part of your gross salary income. The only tax relief related to basic comes indirectly: HRA exemption reduces taxable income (old regime only) based on basic as one of the three tests. Standard deduction (₹75,000 from total gross in both regimes). PF contribution (employee side 80C up to ₹1.5L in old regime, not in new). Gratuity received on leaving (exempt from tax under Payment of Gratuity Act up to ₹20 lakh for eligible employees). Basic itself — fully taxable in both regimes, every rupee.",
      },
    ],
    meta: {
      seoTitle: "Basic Salary Calculator India — Monthly and Annual from CTC (FY 2025–26)",
      seoDescription:
        "Calculate basic salary from monthly CTC and basic percentage. Understand how basic anchors PF (12%), HRA (40–50%), and gratuity. Compare high vs low basic %, industry norms, and the impact on take-home pay.",
      keywords: [
        "basic salary calculator india",
        "basic salary from ctc calculator",
        "how to calculate basic salary from ctc",
        "basic pay calculator india 2025",
        "basic salary percentage of ctc",
        "basic salary and pf calculator",
        "what is basic salary in india",
        "basic salary hra gratuity calculator",
        "basic salary 40 percent of ctc",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "take-home-salary-calculator-india": {
    slug: "take-home-salary-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote: shellIndia,
    sections: [
      {
        heading: "Take-Home Salary in India: From Offer Letter CTC to Bank Credit",
        paragraphs: [
          "Take-home salary is the amount that arrives in your bank account every month — the end result after your employer has deducted employee provident fund, professional tax, and income tax (TDS) from your gross salary. It is the number that determines your monthly budget: your ability to pay rent, EMIs, groceries, and save for goals. Yet most Indian employees learn their take-home only after joining, not before — because the CTC figure in offer letters is not the monthly bank credit.",
          "The path from CTC to take-home involves two stages of reduction. Stage 1 (CTC → Gross): Employer PF (12% of basic) and gratuity accrual are deducted from CTC to arrive at gross. Gross appears on your payslip as total earnings. Stage 2 (Gross → Take-home): Employee PF (12% of basic), professional tax (state-wise, up to ₹208/month), and monthly TDS are deducted from gross. Take-home = what remains.",
          "For a ₹1,00,000 monthly CTC at 40% basic in Maharashtra under the new regime (FY 2025–26): Gross = ₹95,200. Employee PF = ₹4,800. PT = ₹200. Monthly TDS ≈ ₹4,051. Take-home = ₹86,149. This is 86.1% of monthly CTC — or ₹13,851 less than the CTC figure. Knowing this gap before joining eliminates the 'shock' many employees experience in their first payslip.",
        ],
      },
      {
        heading: "Worked Example: Take-Home at ₹1,00,000 CTC, Maharashtra, New Regime",
        paragraphs: [
          "Step-by-step computation: Monthly CTC = ₹1,00,000. Basic (40% of CTC) = ₹40,000. HRA (50% of basic, metro) = ₹20,000. Employer PF (12% of basic) = ₹4,800 (part of CTC). Gross = ₹1,00,000 − ₹4,800 = ₹95,200. Special allowance (balancing) = ₹95,200 − ₹40,000 − ₹20,000 = ₹35,200.",
          "Deductions from gross: Employee PF = ₹4,800. Professional tax (Maharashtra) = ₹200. Annual gross = ₹11,42,400. Taxable income (new regime) = ₹11,42,400 − ₹75,000 std deduction = ₹10,67,400. Annual TDS = ₹48,610 (4% cess included). Monthly TDS = ₹4,051.",
          "Take-home = ₹95,200 − ₹4,800 − ₹200 − ₹4,051 = ₹86,149/month. Annual take-home = ₹10,33,788. CTC-to-take-home ratio = 86.1%. A 10% CTC hike to ₹1,10,000 would increase take-home by approximately ₹7,500–₹8,000/month (not ₹10,000) because the increment also increases PF and pushes slightly more income into a higher TDS bracket.",
        ],
      },
      {
        heading: "How Tax Regime Choice Changes Monthly Take-Home",
        paragraphs: [
          "The tax regime is the single largest lever affecting take-home for employees with income above the rebate threshold. For the same ₹1,00,000 CTC profile above: New regime (FY 2025–26): Monthly TDS ≈ ₹4,051. Take-home = ₹86,149. Old regime (with ₹1,50,000 in 80C, ₹13,000/month HRA exemption): Taxable income = ₹11,42,400 − ₹75,000 − ₹1,50,000 − ₹1,56,000 = ₹8,61,400. Old regime tax: ₹76,280 + 4% cess ≈ ₹79,331. Monthly TDS = ₹6,611. Take-home (old regime) = ₹95,200 − ₹4,800 − ₹200 − ₹6,611 = ₹83,589 — ₹2,560 less than new regime monthly.",
          "For CTC below ₹12.75 LPA (monthly CTC ≤ ₹1,06,250): The new regime's ₹12 lakh rebate threshold means employees at this income level often pay zero TDS under the new regime (taxable income ≤ ₹12L after ₹75K std deduction). Take-home is maximised by choosing the new regime: TDS = ₹0, take-home = ₹95,200 − ₹4,800 − ₹200 = ₹90,200 at ₹1,00,000 CTC (if taxable income falls within rebate). The TDS of ₹4,051 quoted above applies when taxable income exceeds ₹12L; at exactly ₹12 LPA CTC (₹10.67L taxable), the rebate applies and TDS ≈ ₹0.",
          "The regime choice interacts with salary structure. Employees with large home loan interest (₹2L deduction), high HRA (₹2L+ annual exemption), and maxed 80C+80D+NPS under old regime may find old regime better at higher CTCs (₹20 LPA+). The take-home calculator with regime switching lets you instantly compare the monthly bank credit under both regimes for your specific salary structure and deduction profile.",
        ],
      },
      {
        heading: "Using Monthly Take-Home for Financial Planning: EMI, Savings Rate, and Budgeting",
        paragraphs: [
          "EMI eligibility: Banks typically approve home loan EMIs up to 40–50% of monthly take-home. At ₹86,149 take-home, maximum EMI eligibility = ₹34,460–₹43,075. At 8.5% p.a. home loan for 20 years, this supports a loan of approximately ₹35–44 lakh. For car loans (shorter tenure, 7 years at 9%): maximum EMI ₹43,075 supports ₹26–27 lakh car loan. Rule: keep all EMIs below 40% of take-home to maintain liquidity for other expenses.",
          "Savings rate benchmarks: Financial planners recommend saving 20–30% of take-home for long-term goals. At ₹86,149 take-home: 20% savings = ₹17,230/month → ₹2,06,760/year. 30% savings = ₹25,845/month → ₹3,10,140/year. Note that PF contributions (₹4,800/month employee + ₹4,800 employer) are already a form of forced savings — ₹57,600 to ₹1,15,200 annually going into EPF at 8.25% tax-free interest. True total savings = explicit savings + PF = ₹17,230 + ₹9,600 = ₹26,830/month at the conservative savings rate.",
          "Budget allocation (50/30/20 rule adapted for India): Fixed commitments (rent, EMI, insurance): 40–50% of take-home = ₹34,460–₹43,075. Variable lifestyle (food, transport, entertainment): 20–30% = ₹17,230–₹25,845. Savings and investments: 20–30%. With ₹18,000 rent, ₹15,000 EMI, and ₹5,000 insurance, fixed costs = ₹38,000 = 44% of ₹86,149 take-home. Leaving ₹48,149 for variable + savings — comfortable at this salary level.",
        ],
      },
      {
        heading: "Take-Home at Different CTC and Tenure Levels: What to Expect in India FY 2025–26",
        paragraphs: [
          "Entry level (₹4–6 LPA CTC): Monthly CTC ₹33,333–₹50,000. Take-home (Maharashtra, 40% basic, new regime): ₹30,000–₹46,000. PF deduction minimal (₹1,600–₹2,400/month). TDS = ₹0 (below rebate threshold). Take-home is approximately 90–92% of monthly CTC at these levels because there is no TDS.",
          "Mid-level (₹10–20 LPA CTC): Monthly CTC ₹83,333–₹1,66,667. Take-home (Maharashtra, 40% basic, new regime): ₹72,000–₹1,28,000. TDS becomes meaningful above ₹12 LPA (where taxable income exceeds ₹12L rebate). At ₹15 LPA CTC: monthly TDS ≈ ₹8,500–₹12,000/month. Take-home ratio falls to 82–86% of monthly CTC.",
          "Senior (₹30–50 LPA CTC): Monthly CTC ₹2,50,000–₹4,16,667. Take-home (new regime, Delhi): ₹1,60,000–₹2,50,000. TDS ₹35,000–₹70,000/month at these income levels. Take-home ratio falls to 60–68% of monthly CTC. PF often capped (₹1,800/month employer contribution at ₹15,000 wage ceiling). The erosion from CTC to take-home is primarily from high TDS at 25–30% marginal slab rates.",
        ],
      },
    ],
    tables: [
      {
        title: "Monthly Take-Home Salary Across CTC Levels — Maharashtra, 40% Basic, New Regime FY 2025–26",
        columnHeaders: ["Annual CTC (₹)", "Monthly CTC (₹)", "Monthly Gross (₹)", "PF (₹)", "PT (₹)", "TDS/mo (₹)", "Take-Home/mo (₹)", "Take-Home %"],
        rows: [
          ["4,00,000", "33,333", "31,733", "1,600", "175", "0 (rebate)", "29,958", "89.9%"],
          ["6,00,000", "50,000", "47,600", "2,400", "200", "0 (rebate)", "45,000", "90.0%"],
          ["8,00,000", "66,667", "63,467", "3,200", "200", "0 (rebate)", "60,067", "90.1%"],
          ["10,00,000", "83,333", "79,333", "4,000", "200", "0 (rebate)", "75,133", "90.2%"],
          ["12,00,000", "1,00,000", "95,200", "4,800", "200", "4,051", "86,149", "86.1%"],
          ["15,00,000", "1,25,000", "1,19,000", "6,000", "200", "10,500", "1,02,300", "81.8%"],
          ["20,00,000", "1,66,667", "1,58,667", "8,000", "200", "21,000", "1,29,467", "77.7%"],
          ["30,00,000", "2,50,000", "2,38,000", "12,000", "200", "43,000", "1,82,800", "73.1%"],
        ],
      },
      {
        title: "New Regime vs Old Regime Take-Home — ₹1,00,000 Monthly CTC, Maharashtra, 40% Basic",
        columnHeaders: ["Item", "New Regime (₹)", "Old Regime with 80C + HRA (₹)"],
        rows: [
          ["Monthly gross", "95,200", "95,200"],
          ["Employee PF", "−4,800", "−4,800"],
          ["Professional tax", "−200", "−200"],
          ["Annual taxable income", "10,67,400", "8,61,400"],
          ["Annual TDS (est.)", "48,610", "79,331"],
          ["Monthly TDS", "−4,051", "−6,611"],
          ["Monthly take-home", "86,149", "83,589"],
          ["Annual take-home", "10,33,788", "10,03,068"],
          ["Regime advantage", "NEW +₹2,560/month", "—"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Take-home as % of CTC falls as income rises due to progressive TDS",
      caption:
        "Below ₹12.75 LPA, take-home is 89–91% of monthly CTC (zero TDS under new regime rebate). Above ₹15 LPA, TDS grows faster than gross and take-home ratio falls to 77–85%. At ₹30 LPA+, take-home is 70–75% of monthly CTC.",
      sparkValues: [0.9, 0.9, 0.9, 0.902, 0.861, 0.818, 0.777, 0.731],
    },
    faq: [
      {
        question: "Why is my first-month take-home different from subsequent months?",
        answer:
          "First-month take-home often differs for several reasons: (1) Joining date: if you joined mid-month, salary is prorated. (2) TDS calibration: in April–June (start of financial year), your employer may under-deduct or over-deduct TDS until you submit investment declarations (Form 12BB). (3) One-time joining bonus: if included in first payslip, TDS for that month is higher. (4) Notice period recovery or sign-on advance recovery may appear. From month 2–3 onwards, after investment declarations are processed, take-home stabilises. The 'steady state' take-home from July is more representative — use this calculator's output as an approximation of that steady state.",
      },
      {
        question: "Does my EPF contribution count as take-home?",
        answer:
          "No — employee PF (₹4,800/month on ₹40,000 basic) is deducted from gross before take-home is computed. It does not reach your bank account. However, it accumulates in your EPFO account at 8.25% p.a. (tax-free). Employer PF also does not reach your bank — it is part of CTC that funds your EPF account. If you count total compensation including PF accumulation: Effective compensation = Take-home (₹86,149) + Employee PF (₹4,800) + Employer PF (₹4,800) = ₹95,749. PF accumulates and is accessible at resignation or retirement — so it is 'deferred take-home' rather than lost income.",
      },
      {
        question: "How do I increase my monthly take-home without changing my CTC?",
        answer:
          "Three levers work within a fixed CTC: (1) Lower basic %: At ₹1,00,000 CTC, dropping from 50% basic to 35% basic saves ₹2,400/month in employee PF → take-home rises by ₹2,400. (2) New regime: If your employer applies old regime TDS but new regime is better for your profile (as is usually true for ≤₹12 LPA), declare new regime in April via investment form — TDS drops by ₹2,000–₹5,000/month. (3) Employer NPS contribution in lieu of special allowance: adding NPS as an employer contribution reduces taxable gross by ₹2,000–₹4,000/month (10% of basic), reducing TDS by ₹200–₹1,200/month — while the NPS goes to your retirement account.",
      },
      {
        question: "What is the 'real' take-home if I have a home loan?",
        answer:
          "A home loan affects take-home through two channels: (1) EMI: your home loan EMI is not a 'deduction' in the payslip sense — it is a post-take-home payment from your bank account. It does not change payslip take-home. (2) Home loan interest (Section 24(b)) under old regime: interest paid on a self-occupied property is deductible up to ₹2 lakh annually under the old regime. This reduces taxable income → reduces TDS → increases take-home. At 20% slab, ₹2L deduction saves ₹41,600/year (₹3,467/month) in TDS. Under new regime, this deduction is not available. Many employees take a home loan and switch to old regime specifically to use this deduction — verify with the tax comparison calculator first.",
      },
      {
        question: "Is LTA received in take-home or reimbursed separately?",
        answer:
          "LTA (Leave Travel Allowance) is typically included in the gross salary as a named allowance (e.g., ₹50,000/year = ₹4,167/month). It appears as an earning in every monthly payslip — and your take-home includes it. The tax benefit comes separately: when you actually travel and submit travel bills, the LTA amount (up to ₹50,000 in this case) is declared as an exemption under old regime, reducing TDS in subsequent months (or as an ITR adjustment). Under new regime, LTA is fully taxable — your take-home includes LTA as gross earning but the TDS is also computed on the full LTA without exemption.",
      },
    ],
    meta: {
      seoTitle: "Take Home Salary Calculator India — Monthly Bank Credit from CTC (FY 2025–26)",
      seoDescription:
        "Calculate your monthly take-home salary in India from CTC with employee PF, state professional tax, and income tax under new or old regime. See why take-home is 85–90% of CTC at mid-level salaries and how to maximise it.",
      keywords: [
        "take home salary calculator india",
        "monthly take home salary from ctc india",
        "net salary after pf and tax india 2025",
        "take home pay calculator india fy 2025-26",
        "ctc to take home calculator india",
        "how much take home salary for 12 lpa",
        "take home salary india new regime 2025",
        "monthly bank credit from ctc india",
        "net in hand salary calculator india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "salary-breakup-calculator-india": {
    slug: "salary-breakup-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote: shellIndia,
    sections: [
      {
        heading: "What a Salary Breakup Shows: Components, Structure, and How to Read It",
        paragraphs: [
          "A salary breakup is a line-by-line decomposition of total compensation showing how each rupee of CTC is classified, who it is paid to, and when. Unlike the CTC headline figure (which blends employer costs with employee earnings), or the take-home (which shows only the bank credit), the salary breakup maps every component: basic, HRA, special allowance, LTA, meal allowance, employer PF, gratuity accrual, group medical insurance, and any other elements your employer includes.",
          "The breakup matters for three practical reasons. First, two offers with identical CTCs can yield very different take-home amounts and tax treatments depending on how the CTC is structured. Second, many tax-exempt and partially-exempt allowances (HRA, LTA, meal allowance, NPS employer contribution) only provide benefit if they appear explicitly as named components in your breakup — a CTC with a large 'special allowance' and no HRA means you cannot claim HRA exemption even if you pay rent. Third, understanding your breakup helps you compute Form 16 Section B deductions correctly when filing your ITR.",
          "This calculator generates a full salary breakup from monthly CTC and basic percentage. Enter your CTC, basic %, rent, state, and regime. The output shows: basic, HRA, special allowance (balancing), gross monthly, employer PF, employee PF, professional tax, monthly TDS, and in-hand — giving the complete breakup in a single view.",
        ],
      },
      {
        heading: "Standard Salary Components and Their Tax Treatment",
        paragraphs: [
          "Basic salary: The fixed core component. 100% taxable in both regimes. Anchors PF, HRA, gratuity, and ESIC. At 40% of ₹1,00,000 CTC = ₹40,000/month.",
          "HRA (House Rent Allowance): Set at 40–50% of basic by employer. 100% taxable in new regime. In old regime, exempt up to the three-test minimum (actual HRA, rent − 10% basic, 40%/50% of basic). At metro with ₹40,000 basic: HRA = ₹20,000; if rent paid is ₹18,000, exemption = ₹13,000, taxable HRA = ₹7,000. Special allowance (balancing component): Fully taxable in both regimes. It is the residual gross after basic and HRA — no cap, no exemption. At ₹95,200 gross − ₹40,000 basic − ₹20,000 HRA = ₹35,200 special allowance.",
          "Employer PF (part of CTC, not gross): 12% of basic, deposited to EPFO. Not part of gross; deducted from CTC before computing gross. ₹4,800/month on ₹40,000 basic. Employee PF (deducted from gross): Also 12% of basic, deducted as an employee-side cost. ₹4,800/month. Deductible under 80C (up to ₹1.5L) in old regime; not deductible in new regime. Gratuity accrual (part of CTC): Employer sets aside (15/26) × (basic/12) monthly as gratuity provision. This appears in CTC but not in payslip. At ₹40,000 basic: monthly gratuity provision = ₹23,077 ÷ 12 = ₹1,923/month. Group medical insurance premium (part of CTC): Employer-paid premium appears in CTC. Tax exempt as a perquisite benefit. Not in payslip earnings or deductions.",
        ],
      },
      {
        heading: "Salary Breakup Worked Example: ₹1,00,000 Monthly CTC, 40% Basic",
        paragraphs: [
          "Earnings (payslip gross = ₹95,200): Basic = ₹40,000 (40% of CTC). HRA = ₹20,000 (50% of basic, metro structure). Special allowance = ₹35,200 (balancing). Total earnings = ₹95,200.",
          "Employer-side CTC components (not in gross): Employer PF = ₹4,800 (12% of basic). Gratuity accrual ≈ ₹1,923/month. Group insurance ≈ ₹500–₹1,000/month. Total CTC = ₹95,200 + ₹4,800 + ₹1,923 ≈ ₹1,01,923 (actual CTC may differ slightly by employer rounding). Employer quotes ₹1,00,000 CTC after rounding and excluding or including gratuity per their policy.",
          "Deductions from earnings: Employee PF = ₹4,800. Professional tax (Maharashtra) = ₹200. Monthly TDS (new regime) ≈ ₹4,051. Total deductions = ₹9,051. Net pay (take-home) = ₹95,200 − ₹9,051 = ₹86,149. The complete breakup shows that from ₹1,00,000 CTC: ₹86,149 reaches your bank, ₹9,600 goes to EPF (both sides), ₹200 to state PT, ₹4,051 to income tax, and ≈₹1,923 to gratuity reserve.",
        ],
      },
      {
        heading: "Industry-Wise Salary Structure Differences in India",
        paragraphs: [
          "IT and product companies (TCS, Infosys, Wipro, startups): Basic = 35–45% of CTC. HRA = 40–50% of basic. Special allowance = large balancing component. Flexible benefits plan (FBP) often included — employees choose between meal coupons (₹2,200/month tax-exempt), fuel reimbursement, phone reimbursement, book allowance within an annual FBP limit. Employer PF may be capped at ₹1,800/month (statutory ceiling). ESOP component not in payslip but in CTC at notional value.",
          "FMCG and manufacturing (HUL, ITC, Asian Paints): Basic = 45–55% of CTC. DA may be present (inflation-linked). Sales incentive as variable pay (not in monthly payslip; paid quarterly). Car allowance or company car perquisite for certain grades. LTA = typically 1 month's basic per year (deductible in old regime for actual travel, twice in a 4-year block). Reimbursements (mobile, medical, petrol) kept outside CTC for administrative efficiency.",
          "Banking and financial services (HDFC, ICICI, Kotak): Basic = 40–50% of CTC. Performance bonus (variable; 0–100%+ of basic depending on role). City compensatory allowance (CCA) for metro postings. NPS employer contribution (sometimes mandated for private bank employees similar to old pension scheme). Stock options / ESOP at senior levels. Insurance companies may include special DA or grade allowances.",
        ],
      },
      {
        heading: "Restructuring Your Salary Breakup for Maximum Tax Efficiency",
        paragraphs: [
          "Many private employers allow a one-time breakup restructuring request at joining or annually at appraisal time. Key restructuring strategies: (1) Flexible Benefits Plan (FBP): Ask HR if they offer an FBP. Within the FBP, allocate to meal coupons/food cards (₹26,400/year tax-exempt), gift vouchers (₹5,000/year tax-exempt under perquisite rules), books/periodicals (deductible with receipts under old regime), or petrol/fuel reimbursement (with logbook).",
          "(2) Employer NPS contribution under 80CCD(2): Even in the new tax regime, your employer can contribute up to 10% of your basic to NPS on your behalf. This amount is deductible from your taxable income — reducing annual TDS by ₹4,800–₹14,400/year at 10–30% slab rates. The NPS contribution comes from within your existing CTC (reducing special allowance). If your employer offers this, opt in — it is the most valuable tax-free component in the new regime.",
          "(3) Higher HRA (under old regime only): If you are on the old regime and pay high rent in a metro, request an increase in HRA component (correspondingly reducing special allowance, keeping basic and CTC constant). At ₹40,000 basic, increasing HRA from ₹15,000 to ₹25,000 (metro standard 50% of basic) potentially increases your HRA exemption if rent paid is high — saving ₹12,480–₹24,960/year in income tax depending on rent and slab. This restructuring has no cost to the employer.",
        ],
      },
    ],
    tables: [
      {
        title: "Complete Salary Breakup — ₹1,00,000 Monthly CTC, 40% Basic, Metro, Maharashtra, New Regime",
        columnHeaders: ["Component", "Type", "Monthly (₹)", "Annual (₹)", "Taxable?"],
        rows: [
          ["Basic salary", "Payslip earning", "40,000", "4,80,000", "Yes — 100%"],
          ["HRA (metro, 50% of basic)", "Payslip earning", "20,000", "2,40,000", "New regime: 100%; Old: partly exempt"],
          ["Special allowance", "Payslip earning", "35,200", "4,22,400", "Yes — 100%"],
          ["Total gross (payslip earnings)", "—", "95,200", "11,42,400", "—"],
          ["Employer PF (12% of basic)", "CTC employer cost", "4,800", "57,600", "Not taxable to employee"],
          ["Gratuity accrual (est.)", "CTC employer cost", "1,923", "23,077", "Tax-free on receipt (eligible employees)"],
          ["Total CTC", "—", "~1,01,923", "~12,23,077", "—"],
          ["Employee PF (12% of basic)", "Deduction", "−4,800", "−57,600", "80C in old regime"],
          ["Professional tax (MH)", "Deduction", "−200", "−2,500", "Deductible u/s 16(iii) both regimes"],
          ["Monthly TDS (new regime est.)", "Deduction", "−4,051", "−48,610", "Paid to government"],
          ["Take-home (net pay)", "Bank credit", "86,149", "10,33,788", "—"],
        ],
      },
      {
        title: "Typical Salary Breakup Proportions Across Indian Sectors (for ₹12–15 LPA CTC)",
        columnHeaders: ["Component", "IT/Tech", "FMCG/Mfg", "Banking", "PSU/Govt"],
        rows: [
          ["Basic % of CTC", "35–40%", "45–55%", "40–50%", "Pay scale"],
          ["HRA % of basic", "40–50%", "40–50%", "40–50%", "24–30% of basic"],
          ["Special allowance %", "25–35%", "10–20%", "15–25%", "Various allowances"],
          ["Employer PF", "Capped ₹1,800 often", "On full basic", "On full basic", "NPS or EPF"],
          ["Variable / Bonus", "10–20% of CTC", "10–20% CTC", "Up to 50% CTC", "DA twice/year"],
          ["Perquisites (FBP, car)", "Common", "Senior grades", "Senior grades", "Grade allowances"],
          ["Group insurance", "CTC inclusive", "CTC inclusive", "CTC inclusive", "State-funded"],
          ["LTA", "1–1.5x monthly basic/yr", "1–2x monthly basic/yr", "1x monthly basic/yr", "Included in pay"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "How CTC is distributed: from total cost to employee take-home",
      caption:
        "In a typical ₹12 LPA CTC structure (40% basic, Maharashtra, new regime): Employer PF + gratuity consume 6.7%, employee PF + PT consume 5.0%, TDS consumes 4.0%, and take-home is the remaining 84.3%. The mix shifts at higher CTCs as TDS proportion rises.",
      sparkValues: [1, 0.933, 0.883, 0.879, 0.843],
    },
    faq: [
      {
        question: "What is the difference between gross salary and CTC in a salary breakup?",
        answer:
          "Gross salary is the sum of all components that appear under 'Earnings' in your payslip — basic + HRA + special allowance + LTA + medical allowance + any other named allowances. CTC (Cost to Company) = Gross + Employer PF + Employer ESIC (if applicable) + Gratuity accrual + Group insurance premium + any other employer-funded benefits. CTC is the total the employer spends; gross is what you are 'paid' before employee-side deductions. On a ₹12 LPA CTC: Annual gross ≈ ₹11,42,400 (after removing employer PF of ₹57,600). Annual take-home ≈ ₹10,33,788 (after employee PF + PT + TDS from gross).",
      },
      {
        question: "My offer letter shows CTC with and without gratuity — which is correct?",
        answer:
          "Both are correct representations — they just differ in whether gratuity is counted. Some employers include gratuity in CTC (common practice to quote a larger headline number); others exclude it (to quote a 'cash CTC' that only includes liquid components). If gratuity is included: CTC = Gross + Employer PF + Gratuity provision (≈4.81% of basic). If excluded: CTC = Gross + Employer PF. For a ₹12 LPA CTC including gratuity: actual liquid CTC ≈ ₹11.77 LPA (removing gratuity of ₹23,077/year). This distinction matters when comparing offers — always check if gratuity is included and compare 'liquid CTC' apples-to-apples.",
      },
      {
        question: "Can I ask my employer to add more allowances to my breakup?",
        answer:
          "Yes — many employers allow salary restructuring, especially at joining time or during annual appraisal. Allowances you can typically request (subject to employer's HR policy): Meal/food allowance (₹2,200/month tax-free with meal vouchers or food card — simple to implement). NPS employer contribution (10% of basic, deductible in both regimes). Telephone/mobile reimbursement (actual expenses, up to ₹1,200–₹2,000/month per HR policy). Books and periodicals allowance (with receipts). Flexible Benefits Plan (FBP) window allowing you to choose among the above annually. Note: the total CTC remains the same — allowances come out of special allowance. Request the restructuring in writing and confirm in your revised offer letter or salary revision letter.",
      },
      {
        question: "Why does my payslip show a different CTC than my offer letter?",
        answer:
          "Common reasons for discrepancy: (1) Gratuity inclusion: offer letter may include gratuity in CTC, payslip may not show it monthly. (2) Bonus: performance bonus or variable pay may be included in CTC but paid quarterly/annually — monthly payslip shows only fixed salary components. (3) FBP utilisation: if you have a Flexible Benefits Plan and chose certain reimbursements, they appear as and when claimed, not uniformly monthly. (4) One-time components: joining bonus, retention bonus, or relocation allowance may be in CTC but paid as one-time credits. (5) Rounding: CTC may be rounded to ₹12 LPA but payslip components sum to ₹11,98,992. For reconciliation, ask HR for the annual CTC breakup sheet (sometimes called 'compensation statement') which itemises every component and timing.",
      },
      {
        question: "Is a larger special allowance better or worse for me?",
        answer:
          "A large special allowance is a neutral-to-negative outcome from a tax efficiency standpoint. Special allowance is the balancing component — it is 100% taxable in both regimes, with no cap or exemption. A larger special allowance means: (a) Less basic (lower PF, lower gratuity, lower HRA — mixed impact). (b) More taxable gross in the old regime (worse: the increase in taxable income is not offset by any allowance benefit). (c) In new regime: indifferent — all allowances except NPS employer contribution are fully taxable anyway. The only way a large special allowance is 'better' is if it comes from keeping basic low (reducing PF deduction → increasing take-home). If basic is already optimal, a large special allowance vs any other named allowance makes no tax difference in the new regime.",
      },
    ],
    meta: {
      seoTitle: "Salary Breakup Calculator India — Full CTC Component Breakdown (FY 2025–26)",
      seoDescription:
        "Get a complete salary breakup from CTC showing basic, HRA, special allowance, employer PF, gratuity, employee PF, PT, TDS, and take-home. Understand each component's tax treatment and how to restructure for maximum efficiency.",
      keywords: [
        "salary breakup calculator india",
        "ctc components breakdown india",
        "salary structure calculator india 2025",
        "how to read salary breakup india",
        "basic hra special allowance pf breakup",
        "salary components tax treatment india",
        "ctc breakup to take home india",
        "salary restructuring india tax efficient",
        "payslip components explained india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "professional-tax-calculator-state-wise": {
    slug: "professional-tax-calculator-state-wise",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Indicative monthly professional tax for the selected state and salary level — actual slabs, effective dates, and special conditions may vary. Verify with the relevant State Legislature Act or your payroll team for compliance.",
    sections: [
      {
        heading: "Professional Tax in India: Legal Basis and Who Pays It",
        paragraphs: [
          "Professional tax (PT) is a direct tax levied by state governments under Entry 60 of List II (State List) of the Seventh Schedule of the Indian Constitution. It is the only tax on income that states are constitutionally empowered to levy — income tax is a central subject. The Constitution caps the maximum professional tax at ₹2,500 per person per year, which is why the highest annual PT liability anywhere in India is ₹2,500–₹2,544 (Maharashtra, Kerala).",
          "Who pays professional tax: In most states, professional tax is levied on all wage earners (salaried employees), professionals (doctors, lawyers, CAs, architects), self-employed individuals, and some businesses. For salaried employees, the employer is responsible for deducting PT from the employee's salary each month and remitting it to the state government. Non-compliance by the employer attracts penalties — meaning your payslip PT deduction is mandatory in applicable states regardless of whether you pay it from your pocket.",
          "Which states levy professional tax: States with professional tax (as of FY 2025–26): Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Kerala, Gujarat, Madhya Pradesh, Jharkhand, Meghalaya, Assam, Orissa, and a few others. States without professional tax: Delhi, Rajasthan, Uttar Pradesh, Bihar, Haryana, Himachal Pradesh, Jammu & Kashmir, Punjab, Uttarakhand, Tamil Nadu (abolished for most salaried employees). For employees working from a state with no PT (or companies registered there), no PT is deducted regardless of where you live.",
        ],
      },
      {
        heading: "Maharashtra Professional Tax Slabs — Detailed Breakdown",
        paragraphs: [
          "Maharashtra has one of the most familiar PT structures due to the large number of corporate employees in Mumbai and Pune. Monthly salary slabs (Maharashtra Schedule I): Up to ₹7,500/month: Nil. ₹7,501–₹10,000/month: ₹175/month. ₹10,001/month and above: ₹200/month in all months except February. February: ₹300 (making the annual total ₹2,500 for employees earning ₹10,001+).",
          "Maharashtra PT has been at these levels for many years and has not been revised upward despite inflation — the statutory cap of ₹2,500/year limits upward revision without constitutional amendment. Maharashtra's PT is deposited to the Maharashtra State Tax on Professions, Trades, Callings and Employments Act, 1975. Returns are filed monthly (Form III-B) or annually depending on employee count and state instructions.",
          "Registration and compliance for employers: Establishments with 5+ employees in Maharashtra must register for PT within 30 days of hiring and obtain an Employer Registration Certificate. Penalty for non-deduction: interest at 1.25% per month on unpaid tax. Penalty for non-remittance: same rate. Employee-side: the employee cannot voluntarily opt out of PT deduction — it is mandatory. The ₹2,500/year deducted is the total annual PT liability (₹200 × 11 months + ₹300 in February).",
        ],
      },
      {
        heading: "Karnataka, West Bengal, and Other Key State PT Slabs",
        paragraphs: [
          "Karnataka Professional Tax (Karnataka Tax on Professions, Trades, Callings and Employments Act, 1976): Monthly gross salary up to ₹9,999: Nil. ₹10,000–₹14,999: ₹150/month. ₹15,000–₹29,999: ₹200/month. ₹30,000 and above: ₹200/month. Annual total (Bengaluru employee earning ₹15,000+/month): ₹2,400/year. Note: Karnataka does not have the February ₹300 variation — it is a flat ₹200/month in every month for the applicable slab.",
          "West Bengal Professional Tax: Monthly salary ₹10,000–₹14,999: ₹110/month. ₹15,000–₹24,999: ₹130/month. ₹25,000–₹39,999: ₹150/month. ₹40,000 and above: ₹200/month. Annual total (employee earning ₹40,000+/month): ₹2,400/year. West Bengal also has specific slabs for businesses and professionals.",
          "Andhra Pradesh and Telangana PT: Up to ₹15,000/month: Nil. ₹15,001–₹20,000/month: ₹150/month. ₹20,001+ /month: ₹200/month. Annual total for ₹20,001+: ₹2,400/year. Kerala PT: Progressive slabs up to a maximum of ₹1,250 per half-year (₹2,500/year) for the highest income band. Deducted half-yearly rather than monthly by some employers. Gujarat PT: Up to ₹11,999/month: Nil. ₹12,000–₹17,999: ₹80/month. ₹18,000–₹29,999: ₹150/month. ₹30,000+: ₹200/month. Annual total at ₹30,000+/month: ₹2,400/year.",
        ],
      },
      {
        heading: "How Professional Tax Is Deducted, Remitted, and Treated for Income Tax",
        paragraphs: [
          "Deduction timing: Employers deduct PT from the employee's monthly gross salary on or before the last day of each month (or each half-year in states like Kerala). The PT appears as a line item under 'Deductions' in the payslip — separate from employee PF and TDS. Maharashtra employees see ₹200 deducted in most months and ₹300 in February.",
          "Remittance to state: Employers remit the collected PT to the respective State Commercial Tax or PT Department on a monthly or quarterly basis, depending on the state and the number of employees. Large employers (typically 20+ employees) are usually required to remit monthly. Annual PT returns (Form III or equivalent per state) must be filed. Some states like Maharashtra require enrollment certificates (Enrolment Certificate for employers, Professional Tax Registration Certificate for employees).",
          "Income tax treatment: Professional tax paid by an employee is deductible from gross salary income under Section 16(iii) of the Income Tax Act, in both old and new regimes. The deduction is automatic and appears in Form 16 Part B. At ₹2,400–₹2,500/year PT: Income tax saved = ₹2,400 × effective rate. At 10% slab: ₹240/year saved. At 20% slab: ₹480/year saved. At 30% slab: ₹720/year saved. Net effective annual cost of PT (after income tax deduction benefit): ₹1,680–₹2,160/year. PT paid by employer on behalf of employee (some employers absorb it): this is a perquisite, taxable to the employee as a benefit-in-kind.",
        ],
      },
      {
        heading: "Professional Tax for Employees Switching States or Working Remotely",
        paragraphs: [
          "State of employer registration governs PT: Professional tax liability is typically based on the state where the employer's establishment is registered (the place of business), not the state where the employee physically lives. If your company is registered in Maharashtra but you work remotely from Rajasthan (no PT), your employer may still deduct Maharashtra PT because that is where payroll is processed.",
          "Multiple state employment or consulting: If you work for two employers simultaneously (both part-time), each employer independently deducts PT applicable to their state. If both are in Maharashtra: you pay ₹2,500/year × 2 = ₹5,000 PT (above the ₹2,500 annual cap per employer). The cap applies per employer — the aggregate paid to different employers can exceed ₹2,500. Income tax deduction under 16(iii): only PT actually paid (to state government) is deductible; there is no cap on the deduction amount.",
          "Work from home and remote work PT: India does not have a clear legislative resolution for WFH PT. Practically, most employers deduct PT based on their registered office state regardless of where the employee works physically. Some employers have chosen to not deduct PT for employees in PT-free states (Delhi, Rajasthan) even if company HQ is in Maharashtra — this is a compliance grey area. If PT is wrongly deducted, it is a matter to raise with your HR payroll team, not a self-service adjustment.",
        ],
      },
    ],
    tables: [
      {
        title: "State-Wise Professional Tax — Monthly and Annual Amounts at ₹1,00,000 Monthly Salary",
        columnHeaders: ["State", "Monthly PT (₹)", "Annual PT (₹)", "PT Act", "Deductible under 16(iii)?", "Net Cost @20% slab (₹/yr)"],
        rows: [
          ["Maharashtra", "200 (Feb: 300)", "2,500", "MH PT Act 1975", "Yes", "2,000"],
          ["Karnataka", "200", "2,400", "KA PT Act 1976", "Yes", "1,920"],
          ["West Bengal", "200", "2,400", "WB PT Act 1979", "Yes", "1,920"],
          ["Andhra Pradesh", "200", "2,400", "AP PT Act 1987", "Yes", "1,920"],
          ["Telangana", "200", "2,400", "TS PT Act (successor)", "Yes", "1,920"],
          ["Kerala", "208 (approx)", "2,500", "KL PT Act 1996", "Yes", "2,000"],
          ["Gujarat", "200", "2,400", "GJ PT Act 1976", "Yes", "1,920"],
          ["Madhya Pradesh", "208", "2,500", "MP PT Act 1995", "Yes", "2,000"],
          ["Delhi", "0", "0", "No PT", "N/A", "0 (save ₹480 vs MH)"],
          ["Tamil Nadu", "0", "0 (suspended)", "TN PT Act", "N/A", "0"],
          ["Rajasthan", "0", "0", "No PT", "N/A", "0"],
          ["Uttar Pradesh", "0", "0", "No PT", "N/A", "0"],
          ["Punjab / Haryana", "0", "0", "No PT", "N/A", "0"],
        ],
      },
      {
        title: "Maharashtra Professional Tax Slabs — All Income Bands",
        columnHeaders: ["Monthly Salary Range (₹)", "Monthly PT (₹)", "February PT (₹)", "Annual PT (₹)"],
        rows: [
          ["Up to 7,500", "0", "0", "0"],
          ["7,501 – 10,000", "175", "175", "2,100"],
          ["10,001 and above", "200", "300", "2,500"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Professional tax is small but consistent across major PT-levying states",
      caption:
        "Most states with professional tax converge at ₹200/month (₹2,400–₹2,500/year) for employees earning above ₹10,000–₹20,000/month — well within the constitutional cap of ₹2,500/year. States like Delhi, Rajasthan, and Uttar Pradesh levy no PT at all, giving employees there a ₹200/month take-home advantage over Maharashtra or Karnataka.",
      sparkValues: [0, 0, 0.8, 0.9, 1, 1, 1, 1],
    },
    faq: [
      {
        question: "Is professional tax deductible from income tax?",
        answer:
          "Yes — professional tax paid is deductible from gross salary income under Section 16(iii) of the Income Tax Act in both old and new regimes. The deduction is automatic: your employer's payroll system records PT deducted and reflects it in Form 16 Part B as a deduction from salary income. You do not need to claim it separately when filing ITR — it is included in the salary income computation from Form 16. The tax saving is small (₹480–₹720/year at 20–30% slab) but it applies in both regimes without any declaration or proof.",
      },
      {
        question: "Why is February professional tax higher in Maharashtra?",
        answer:
          "Maharashtra's Professional Tax Act specifies ₹300 for February to make the annual total exactly ₹2,500 (11 months × ₹200 + 1 month × ₹300 = ₹2,500). This is the constitutional maximum of ₹2,500/year for professional tax. Rather than increase the monthly amount (which would be capped anyway at ₹2,500/year), Maharashtra keeps 11 months at ₹200 and one month (February) at ₹300 to hit the ₹2,500 cap. Karnataka at ₹200/month × 12 = ₹2,400/year stays below the cap without a special month adjustment.",
      },
      {
        question: "Can my employer register in Delhi to avoid deducting professional tax?",
        answer:
          "Yes — if an employer registers their establishment in Delhi (which has no professional tax law), they have no PT deduction obligation for their employees, regardless of where those employees are physically located. Some companies with multiple state registrations choose to process payroll through Delhi or other PT-free states. However, this is a compliance decision for the employer, not the employee. If your company's payroll is registered in Maharashtra, they are obligated to deduct and remit Maharashtra PT — you cannot unilaterally request PT exemption. This also applies to remote work: if payroll is run from Maharashtra, Maharashtra PT applies.",
      },
      {
        question: "I have two employers — do I pay double professional tax?",
        answer:
          "Technically yes, if both employers are registered in the same PT-levying state. Each employer independently deducts PT based on their state registration and your salary with them. If both are in Maharashtra and each employer pays you above ₹10,000/month, each will deduct ₹200/month, totalling ₹4,800/year + ₹600 in two Februaries = ₹5,400/year PT. There is no coordination mechanism or cap per taxpayer across employers — the ₹2,500 cap applies per employer, not per employee. You can claim the full PT paid as a deduction under Section 16(iii) in your ITR (aggregate from all employers, as shown in all Form 16s).",
      },
      {
        question: "Does Tamil Nadu still charge professional tax?",
        answer:
          "Tamil Nadu has a Professional Tax Act (Tamil Nadu Municipal Laws (Second Amendment) Act), but enforcement and applicability have been inconsistent. For most private sector salaried employees in Tamil Nadu, professional tax is either not levied or is levied at nominal amounts (₹182–₹182 half-yearly maximum in certain municipalities). Many large IT companies with TN registrations do not deduct PT in Tamil Nadu because of low enforcement and municipal-level applicability rather than statewide mandate. This is unlike Maharashtra, where PT is uniformly mandated statewide. Check with your HR/payroll team — if your employer is based in Tamil Nadu, they may or may not deduct PT depending on their municipal registration and HR policy.",
      },
    ],
    meta: {
      seoTitle: "Professional Tax Calculator India — State-Wise Monthly & Annual PT (FY 2025–26)",
      seoDescription:
        "Find state-wise professional tax in India. Detailed slabs for Maharashtra (₹2,500/yr), Karnataka, West Bengal, Andhra Pradesh, Kerala, Gujarat, and others. States with no PT: Delhi, Rajasthan, UP. Income tax deduction under Section 16(iii) explained.",
      keywords: [
        "professional tax calculator state wise india",
        "professional tax india 2025",
        "maharashtra professional tax slab",
        "karnataka professional tax 2025",
        "state wise professional tax india",
        "professional tax monthly deduction india",
        "section 16 iii professional tax deduction",
        "professional tax delhi maharashtra comparison",
        "how much professional tax india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "gratuity-calculator": {
    slug: "gratuity-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Formula: (last drawn basic + DA × 15 ÷ 26) × completed years of service, capped at ₹20 lakh. Requires 5+ years continuous service for eligibility (except in case of death or disablement). Not a substitute for your employer's final settlement computation.",
    sections: [
      {
        heading: "What Is Gratuity and Who Is Entitled to It",
        paragraphs: [
          "Gratuity is a lump-sum payment made by an employer to an employee as a token of appreciation for long-term service. In India, it is a statutory right governed by the Payment of Gratuity Act, 1972 (POGA). Under this Act, every establishment with 10 or more employees is mandated to pay gratuity. The Act covers all employees — factory workers, mine workers, dock workers, plantation workers, and employees in shops and establishments — making it one of the most widely applicable labour laws in India.",
          "Eligibility: An employee becomes eligible for gratuity after completing five years of continuous service with the same employer. 'Continuous service' means uninterrupted employment, including authorised absence for sickness, accident, leave, lay-off, strike (legal), or lock-out. The five-year rule has two important exceptions: In the event of death or permanent disablement of the employee, gratuity is payable regardless of tenure — even if the employee worked for only one month.",
          "Triggering events for gratuity payment: Superannuation (retirement), resignation after 5+ years, retrenchment, death (paid to nominee/legal heir), permanent disablement due to accident or illness, termination (other than for willful misconduct). Gratuity is not payable if the employee is dismissed for misconduct — the Act specifically exempts employers from paying gratuity to employees whose services are terminated due to willful omission, negligence causing damage to employer property, or commission of an offence involving moral turpitude.",
        ],
      },
      {
        heading: "Gratuity Formula Explained: Why 15 Days and Why Divide by 26",
        paragraphs: [
          "The statutory gratuity formula is: Gratuity = (Last Drawn Monthly Salary × 15 ÷ 26) × Years of Service. 'Last drawn salary' means the last drawn basic salary plus Dearness Allowance (DA). HRA, allowances, bonuses, and other components are excluded — only basic + DA enters the formula.",
          "Why 15 days? The Act entitles the employee to 15 days of wages for every completed year of service. This represents half a month's pay per year — a gratitude payment that grows linearly with tenure. For 10 years of service, the employee earns 15 × 10 = 150 days of pay.",
          "Why divide by 26 (not 30)? The denominator 26 represents the number of working days in a month (30 calendar days minus 4 Sundays = 26 working days). Dividing the monthly salary by 26 gives the daily wage. Multiplying by 15 gives 15 days of wages. This is the per-year gratuity. The formula can be restated as: Daily wage (salary ÷ 26) × 15 days × years = gratuity payable.",
        ],
      },
      {
        heading: "Worked Example: ₹50,000 Basic+DA, 5 Years of Service",
        paragraphs: [
          "Inputs: Last drawn basic + DA = ₹50,000/month. Years of service = 5. Gratuity formula: (₹50,000 × 15 ÷ 26) × 5 = (₹50,000 × 0.5769) × 5 = ₹28,846 × 5 = ₹1,44,231.",
          "How this grows with tenure on the same salary: 5 years: ₹1,44,231. 10 years: ₹2,88,462. 15 years: ₹4,32,692. 20 years: ₹5,76,923. 26 years: ₹7,50,000 (25 × ₹28,846 rounds to ₹7,21,154 before cap). At ₹50,000 basic+DA, the ₹20 lakh cap is reached at approximately 69.3 years of service — well beyond a career horizon. The cap only bites for high-earner long-tenured employees.",
          "Part-year handling: Years of service are rounded to the nearest full year per a 1997 amendment to POGA. If a completed year's excess is ≥ 6 months, it counts as one full year. Example: 5 years and 8 months = 6 years for gratuity. 5 years and 4 months = 5 years. This applies per the Supreme Court ruling in Indian Hume Pipe Co. v. Workmen (1960) and subsequent POGA provisions.",
        ],
      },
      {
        heading: "The ₹20 Lakh Statutory Cap: When and How It Applies",
        paragraphs: [
          "The Payment of Gratuity Act caps the maximum gratuity payable under the Act at ₹20 lakh (₹20,00,000). This ceiling was raised from ₹10 lakh to ₹20 lakh by the Payment of Gratuity (Amendment) Act, 2018, effective 29 March 2018. For any employee whose formula-computed gratuity exceeds ₹20 lakh, only ₹20 lakh is legally owed under POGA.",
          "At what salary and tenure does the cap apply? Formula: ₹20,00,000 ÷ years = (salary × 15 ÷ 26). Rearranging: salary × years = ₹20,00,000 × 26 ÷ 15 = ₹34,66,667. So the cap is reached when (basic+DA) × years > ₹34,66,667 (in ₹). Examples: ₹50,000 basic+DA → cap at 69 years (impractical). ₹1,00,000 basic+DA → cap at 34.7 years. ₹2,00,000 basic+DA → cap at 17.3 years. ₹3,00,000 basic+DA → cap at 11.6 years. ₹5,00,000 basic+DA → cap at 6.9 years (very senior employees serving 7+ years).",
          "Gratuity beyond the statutory cap: Many large employers — especially MNCs, IT companies, and PSUs — pay gratuity in excess of the ₹20 lakh POGA limit as a goodwill gesture or per their HR policy. This excess is a voluntary payment and is structured as 'ex-gratia' rather than statutory gratuity. For income tax purposes, the ₹20 lakh cap on tax exemption applies to all gratuity (both POGA-covered and ex-gratia) for private sector employees. Tax on the excess (above ₹20 lakh) is charged at the applicable slab rate.",
        ],
      },
      {
        heading: "Gratuity Taxation: Tax-Free Limits and Filing",
        paragraphs: [
          "For private sector employees covered under POGA: Gratuity received is exempt from income tax under Section 10(10)(ii) up to the minimum of: (a) Actual gratuity received, (b) ₹20,00,000 (the current cap under Section 10(10) as amended), (c) 15/26 × last drawn salary × years of service (i.e., the formula amount). Effectively, the entire gratuity calculated by the Act's formula and paid as statutory gratuity is tax-free — subject to the ₹20 lakh ceiling. On a gratuity of ₹1,44,231 (at ₹50,000 basic+DA, 5 years): full amount is tax-free.",
          "For government employees (central and state government): Gratuity is fully exempt under Section 10(10)(i) — there is no monetary cap. A government officer retiring after 30 years with a high pay-scale gratuity is fully exempt regardless of amount. Government employees are covered under the Central Civil Services (Pension) Rules and are eligible for retirement/death gratuity as per rule (15/26 formula, same as POGA).",
          "When gratuity is taxable: (a) Amounts received in excess of ₹20 lakh from private employers are taxable at slab rates. (b) Gratuity received from an employer not covered under POGA is taxable beyond ₹10 lakh (the lower ceiling under Section 10(10)(iii) for non-POGA employers). (c) Gratuity received on dismissal for misconduct: fully taxable. (d) Gratuity from multiple employers in a career: lifetime exemption limit is ₹20 lakh in aggregate (not per employer) — keep track across employers.",
        ],
      },
    ],
    tables: [
      {
        title: "Gratuity Payable — Last Drawn Salary (Basic+DA) × Years of Service",
        columnHeaders: ["Years of Service", "Basic+DA ₹30,000 (₹)", "Basic+DA ₹50,000 (₹)", "Basic+DA ₹75,000 (₹)", "Basic+DA ₹1,00,000 (₹)", "Basic+DA ₹2,00,000 (₹)"],
        rows: [
          ["5 years", "86,538", "1,44,231", "2,16,346", "2,88,462", "5,76,923"],
          ["7 years", "1,21,154", "2,01,923", "3,02,885", "4,03,846", "8,07,692"],
          ["10 years", "1,73,077", "2,88,462", "4,32,692", "5,76,923", "11,53,846"],
          ["15 years", "2,59,615", "4,32,692", "6,49,038", "8,65,385", "17,30,769"],
          ["20 years", "3,46,154", "5,76,923", "8,65,385", "11,53,846", "20,00,000 (cap)"],
          ["25 years", "4,32,692", "7,21,154", "10,81,731", "14,42,308", "20,00,000 (cap)"],
          ["30 years", "5,19,231", "8,65,385", "12,98,077", "17,30,769", "20,00,000 (cap)"],
          ["35 years", "6,05,769", "10,09,615", "15,14,423", "20,00,000 (cap)", "20,00,000 (cap)"],
        ],
      },
      {
        title: "Gratuity vs EPF — Retirement Corpus Comparison at ₹50,000 Basic+DA",
        columnHeaders: ["Tenure", "Gratuity (formula, ₹)", "Employee PF accumulated (est., ₹)", "Employer PF accumulated (est., ₹)", "Total PF corpus (₹)", "Combined gratuity + PF (₹)"],
        rows: [
          ["5 years", "1,44,231", "2,88,000", "2,88,000", "5,76,000", "7,20,231"],
          ["10 years", "2,88,462", "7,14,547 (with interest)", "7,14,547", "14,29,094", "17,17,556"],
          ["15 years", "4,32,692", "13,37,856", "13,37,856", "26,75,712", "31,08,404"],
          ["20 years", "5,76,923", "22,73,280", "22,73,280", "45,46,560", "51,23,483"],
          ["25 years", "7,21,154", "36,22,560", "36,22,560", "72,45,120", "79,66,274"],
          ["30 years", "8,65,385", "56,27,136", "56,27,136", "1,12,54,272", "1,21,19,657"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gratuity grows linearly with tenure — ₹50,000 basic+DA",
      caption:
        "Gratuity = ₹28,846 × years of service at ₹50,000 basic+DA. The growth is linear (not compounding) — every additional year adds exactly ₹28,846. The ₹20 lakh cap is hit at ~69 years at this salary — far beyond a typical career. For senior executives earning ₹2 lakh+/month, the cap may apply after 8–17 years.",
      sparkValues: [0.14, 0.2, 0.29, 0.43, 0.58, 0.72, 0.87, 1.0],
    },
    faq: [
      {
        question: "Is 5 years of service exactly required, or is there rounding?",
        answer:
          "There is rounding for the years counted above the initial 5-year threshold. The law requires a minimum of 5 completed years for eligibility (no rounding at this stage — 4 years and 11 months does not qualify). Once the 5-year threshold is cleared, each subsequent year's fraction is rounded up if the employee has served more than 6 months of that additional year. Example: 7 years and 8 months → 8 years for gratuity computation. 7 years and 3 months → 7 years. However, many courts have held that when the employee has completed more than 4 years and 240 days, the fifth year rounding may also apply in certain cases — this varies by state High Court jurisdiction.",
      },
      {
        question: "My employer is contributing to gratuity every month — how?",
        answer:
          "Many employers fund their gratuity liability through Group Gratuity Schemes with LIC or other insurance companies. Under these schemes, the employer pays monthly premiums (approximately 4.81% of annual basic+DA) to the insurer, who builds up a fund to pay out gratuity when employees leave. This monthly outflow appears as a CTC component ('Gratuity' in the CTC breakup at ₹50,000 basic+DA: monthly provision = (50,000 × 15/26) ÷ 12 ≈ ₹2,404). Alternatively, employers may self-fund the gratuity liability and pay from revenue at the time of exit. The gratuity amount you receive is the same regardless of funding method.",
      },
      {
        question: "Can gratuity be forfeited?",
        answer:
          "Yes, in limited circumstances. The Payment of Gratuity Act allows forfeiture — full or partial — of gratuity if the employee is dismissed for: (a) Willful omission or negligence causing financial loss to the employer (forfeiture limited to the extent of loss — not necessarily entire gratuity). (b) Engaging in violence, riot, or disruptive conduct on company premises (full forfeiture). (c) Conviction for an offence involving moral turpitude committed during employment (full forfeiture). Note: Forfeiture must be declared by the employer through the prescribed process — it is not automatic. Ordinary poor performance or disagreements do not qualify as grounds for forfeiture.",
      },
      {
        question: "When must the employer pay gratuity — is there a deadline?",
        answer:
          "Under the POGA, gratuity is payable within 30 days of it becoming due (i.e., within 30 days of the employee's last working day). If the employer disputes the amount or eligibility, they must still pay the undisputed portion within 30 days. Delay beyond 30 days attracts simple interest at the rate fixed by the Central Government (currently 10% per annum) for the delay period. The employee can file a claim with the Controlling Authority (typically the Labour Commissioner) if gratuity is denied or delayed. The employer must also pay the interest on delayed gratuity without the employee needing to separately claim it.",
      },
      {
        question: "I changed jobs — does my gratuity eligibility start over?",
        answer:
          "Yes — gratuity eligibility is employer-specific. If you resigned before 5 years and joined a new employer, the clock restarts. Your previous employer owes you nothing under POGA (unless you were with them for 5+ years). Exception: if your previous employer's business or undertaking was transferred to the new employer (amalgamation, acquisition), the continuous service with the old employer may count toward the new employer's gratuity calculation, subject to the transfer agreement and applicable state labour laws. Ask HR at the new employer if there is a 'transfer of undertaking' provision. In mergers and acquisitions where employee service is explicitly preserved, prior tenure counts.",
      },
    ],
    meta: {
      seoTitle: "Gratuity Calculator India — Payment of Gratuity Act Formula & ₹20L Cap (FY 2025–26)",
      seoDescription:
        "Calculate gratuity using the Payment of Gratuity Act formula: (basic+DA × 15 ÷ 26) × years. Find eligibility, the ₹20 lakh cap, tax-free limits, worked examples at ₹50,000–₹2,00,000 salary, and when the cap applies.",
      keywords: [
        "gratuity calculator india",
        "gratuity formula india 2025",
        "payment of gratuity act calculator",
        "gratuity calculation basic da years",
        "gratuity 20 lakh cap india",
        "gratuity tax exemption india",
        "how to calculate gratuity in india",
        "gratuity 5 years service india",
        "gratuity eligibility india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "leave-encashment-calculator": {
    slug: "leave-encashment-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Encashment = (basic + DA) ÷ 30 × leave days — the most common payroll convention for private sector employers. Some employers use a 26-working-day divisor; use your employer's HR policy for exact figures. Tax treatment differs for retirement vs resignation encashment.",
    sections: [
      {
        heading: "What Is Leave Encashment and When Is It Paid",
        paragraphs: [
          "Leave encashment is the monetary compensation paid to an employee for unused earned leave (EL), also called privilege leave (PL) or annual leave. Under Indian labour law, employees in factories, shops, and establishments are entitled to earned leave based on the number of days worked — typically 1 day per 20 days worked under the Factories Act, 1948, or as specified by state shops and establishments acts. Leave that is not availed accumulates and can either be carried forward to the next year (subject to employer policy) or encashed.",
          "When is leave encashment triggered? (1) On resignation or termination: The employer pays for all accumulated earned leave as part of the full and final (F&F) settlement. This is mandatory in most states — employers cannot deny EL encashment on separation. (2) On retirement or superannuation: Encashment of accumulated EL (up to the applicable limit) — for central government employees, up to 300 days. For private sector, the employer's HR policy sets the limit. (3) While in service (mid-service encashment): Some employers allow annual encashment of leave beyond a carry-forward cap (e.g., if the cap is 30 days, any accumulated leave over 30 days is compulsorily encashed). (4) On death of employee: Paid to nominees as part of final settlement.",
          "Calculation formula: Leave Encashment = (Basic + DA per month) ÷ 30 × Number of leave days. The divisor 30 represents calendar days in a month. Daily rate = Basic+DA ÷ 30. Some employers use 26 (working days) as the divisor — this gives a higher daily rate and higher payout. The choice of divisor is an employer policy matter, not mandated by any central law.",
        ],
      },
      {
        heading: "Worked Example: ₹50,000 Basic+DA, 10 Leave Days",
        paragraphs: [
          "Inputs: Monthly basic + DA = ₹50,000. Leave days to encash = 10. Daily rate (÷30 convention) = ₹50,000 ÷ 30 = ₹1,667/day. Leave encashment = ₹1,667 × 10 = ₹16,667.",
          "With 26-day divisor (some employers): Daily rate = ₹50,000 ÷ 26 = ₹1,923/day. Leave encashment = ₹1,923 × 10 = ₹19,231. Difference between 30-day and 26-day divisors = ₹2,564 on 10 days. The 26-day divisor gives 15.4% more per leave day — a significant difference for high-salary employees with many accumulated leave days.",
          "Common scenario at resignation — 45 accumulated leave days, ₹80,000 basic+DA: Daily rate (÷30) = ₹2,667. Encashment = ₹2,667 × 45 = ₹1,20,000. Daily rate (÷26) = ₹3,077. Encashment = ₹3,077 × 45 = ₹1,38,461. This ₹18,461 difference is real money — verify your employer's divisor with HR before expecting a specific F&F amount.",
        ],
      },
      {
        heading: "Leave Types in India: Earned Leave, Casual Leave, and Sick Leave",
        paragraphs: [
          "Earned Leave (EL) / Privilege Leave (PL): The only leave type eligible for encashment in most cases. Accrues based on days worked — Factories Act: 1 day per 20 days worked (i.e., 15 days per year on 300 working days). State shops and establishments acts vary: most grant 15–21 days EL per year. EL accumulates year on year (subject to carry-forward caps) and is fully encashable on separation. It is also encashable mid-service per employer policy.",
          "Casual Leave (CL): Typically 7–12 days per year. Not encashable in most states and under most employer policies — lapses if unused at year-end. Cannot be accumulated. Exception: some private sector employers voluntarily allow casual leave encashment, but this is uncommon and not legally mandated.",
          "Sick Leave (SL): 7–12 days per year (varies by state act and employer policy). Not encashable under most state laws. Sick leave requires a medical certificate for periods exceeding 3 days in most organisations. Unlike EL, sick leave does not accumulate indefinitely — unused sick leave typically lapses at year-end. Government employees may have sick leave accumulation rules under the Central Civil Services (Leave) Rules.",
        ],
      },
      {
        heading: "EL Carry-Forward Limits and Encashment Caps by Employer Type",
        paragraphs: [
          "Central Government employees: Maximum EL accumulation = 300 days. At retirement, the entire 300-day accumulated EL can be encashed (tax-free up to 10 months of basic+DA per the Supreme Court clarification in 2023). At resignation: only the amount actually due is encashed, taxable as salary. Formula: Central Govt daily rate = monthly basic+DA ÷ 30 (the standard formula used by Central Pay Commission).",
          "State Government employees: Each state has its own leave rules. Most states cap accumulated EL at 180–300 days with full encashment at retirement. State PSU employees follow the relevant State PSU Leave Rules — generally similar to the central government structure.",
          "Private sector (no uniform rule): There is no national law mandating private sector leave carry-forward caps — it depends entirely on the employer's standing orders or HR policy. Common private sector approaches: (a) Cap at 45–60 days, compulsorily encash excess annually. (b) Cap at 15–30 days, no encashment during service — only at separation. (c) Unlimited accumulation with full encashment at separation (rare; typically IT companies with strong HR policies). Large IT companies often cap at 45 days carry-forward and allow mid-service encashment of excess leaves.",
        ],
      },
      {
        heading: "Tax Treatment of Leave Encashment — Retirement vs Resignation",
        paragraphs: [
          "On retirement or superannuation (or death): Leave encashment received by central/state government employees is fully exempt from income tax under Section 10(10AA)(i) — no limit. For private sector employees, leave encashment at retirement is exempt under Section 10(10AA)(ii) up to the minimum of: (a) Actual encashment received, (b) ₹25 lakh (raised from ₹3 lakh to ₹25 lakh by a notification in April 2023), (c) 10 months' basic+DA (at last drawn rate), (d) EL accumulated at credit × daily rate (average of last 10 months). The ₹25 lakh exemption applies per employee lifetime across all employers — i.e., it is a cumulative ₹25 lakh limit, not per employer.",
          "On resignation, termination, or mid-service encashment: Leave encashment is taxable as salary income in the year received — no exemption under 10(10AA). The employer deducts TDS on the encashment amount at the applicable slab rate. Mid-service encashment (while still employed) is also fully taxable in both old and new regimes.",
          "Practical planning implication: Employees near retirement should consider timing leave encashment to maximise the ₹25 lakh exemption. If you have accumulated 200+ days of leave, the encashment at retirement could be: 200 days × (₹80,000 ÷ 30) = ₹5,33,333 — entirely tax-free if within the ₹25 lakh lifetime cap. This is a meaningful tax-free corpus that supplements PF and gratuity. Surrendering accumulated EL before retirement (mid-service) loses this tax benefit — prefer to preserve leave until retirement if your employer and personal circumstances allow.",
        ],
      },
    ],
    tables: [
      {
        title: "Leave Encashment Payout — Basic+DA ÷ 30 × Leave Days",
        columnHeaders: ["Monthly Basic+DA (₹)", "10 days (₹)", "20 days (₹)", "30 days (₹)", "45 days (₹)", "60 days (₹)", "90 days (₹)"],
        rows: [
          ["30,000", "10,000", "20,000", "30,000", "45,000", "60,000", "90,000"],
          ["40,000", "13,333", "26,667", "40,000", "60,000", "80,000", "1,20,000"],
          ["50,000", "16,667", "33,333", "50,000", "75,000", "1,00,000", "1,50,000"],
          ["75,000", "25,000", "50,000", "75,000", "1,12,500", "1,50,000", "2,25,000"],
          ["1,00,000", "33,333", "66,667", "1,00,000", "1,50,000", "2,00,000", "3,00,000"],
          ["1,50,000", "50,000", "1,00,000", "1,50,000", "2,25,000", "3,00,000", "4,50,000"],
          ["2,00,000", "66,667", "1,33,333", "2,00,000", "3,00,000", "4,00,000", "6,00,000"],
        ],
      },
      {
        title: "30-Day vs 26-Day Divisor: Payout Difference at ₹50,000 Basic+DA",
        columnHeaders: ["Leave Days", "Daily Rate ÷30 (₹)", "Payout ÷30 (₹)", "Daily Rate ÷26 (₹)", "Payout ÷26 (₹)", "Difference (₹)", "% Higher (÷26)"],
        rows: [
          ["5 days", "1,667", "8,333", "1,923", "9,615", "1,282", "+15.4%"],
          ["10 days", "1,667", "16,667", "1,923", "19,231", "2,564", "+15.4%"],
          ["15 days", "1,667", "25,000", "1,923", "28,846", "3,846", "+15.4%"],
          ["30 days", "1,667", "50,000", "1,923", "57,692", "7,692", "+15.4%"],
          ["45 days", "1,667", "75,000", "1,923", "86,538", "11,538", "+15.4%"],
          ["60 days", "1,667", "1,00,000", "1,923", "1,15,385", "15,385", "+15.4%"],
          ["90 days", "1,667", "1,50,000", "1,923", "1,73,077", "23,077", "+15.4%"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Leave encashment payout grows linearly with accumulated days",
      caption:
        "At ₹50,000 basic+DA (÷30 divisor), every 10 additional leave days adds ₹16,667 to the encashment payout. The slope steepens with salary — at ₹1,00,000 basic+DA, every 10 days is worth ₹33,333. Tax-free at retirement up to ₹25 lakh (Section 10(10AA)); fully taxable if encashed during service.",
      sparkValues: [0.11, 0.22, 0.33, 0.44, 0.56, 0.67, 0.78, 0.89, 1.0],
    },
    faq: [
      {
        question: "Can my employer refuse to pay leave encashment on resignation?",
        answer:
          "No — for earned leave accumulated under a statutory act (Factories Act, state Shops and Establishments Act), the employer is legally required to encash the earned leave balance as part of the full and final settlement. Refusing to pay EL encashment is a violation of the applicable state labour law and grounds for a complaint to the Labour Commissioner. However, casual leave and sick leave encashment on resignation may not be legally mandated — check the applicable state Shops and Establishments Act for your industry and state. Also verify your employment contract and HR policy for any additional employer-specific entitlements beyond the statutory minimum.",
      },
      {
        question: "Is the ₹25 lakh exemption per employer or lifetime?",
        answer:
          "Lifetime limit, not per employer. The Section 10(10AA) exemption for private sector employees on retirement is a cumulative ₹25 lakh cap across all employers in your career. If you received ₹10 lakh tax-free encashment from Employer A on retirement in 2020, your remaining exemption for Employer B (if you re-join and retire again) is ₹15 lakh. You must track this yourself — the income tax department does not automatically aggregate across employers. Practically, most employees have only one retirement and one large encashment event, so the cap is rarely an issue unless you have had multiple formal retirements from different employers.",
      },
      {
        question: "Is leave encashment received during service (not at retirement) taxable?",
        answer:
          "Yes — fully taxable as salary income. The Section 10(10AA) exemption applies only to leave encashment received at the time of retirement, superannuation, or death — not during active employment. If your employer encashes excess leave every year (e.g., leaves exceeding 30 days are compulsorily encashed annually), each such payment is added to your salary for TDS purposes in that financial year. The TDS is computed at your applicable slab rate. If you have a choice of encashing leave mid-service vs carrying it to retirement, carrying it forward and encashing at retirement is significantly more tax-efficient (up to ₹25 lakh exempt).",
      },
      {
        question: "What is the maximum number of days I can accumulate for encashment?",
        answer:
          "For central government employees: 300 days (maximum EL accumulation). All 300 days can be encashed tax-free on retirement under Section 10(10AA)(i). For private sector: Depends entirely on employer HR policy. There is no statutory minimum or maximum for EL carry-forward in most private establishments — the applicable state Shops and Establishments Act may specify a maximum (typically 30–45 days for some states). Most private IT companies cap at 45 days carry-forward. If the cap is 45 days and you accumulate 60 days, 15 days are compulsorily encashed and the 15-day payout is taxable. Preserving 45 days × your daily rate as a retirement benefit is worth maximising.",
      },
      {
        question: "My F&F statement shows a different leave encashment than the calculator — why?",
        answer:
          "Three common reasons for discrepancy: (1) Divisor difference: your employer may use 26 (working days) instead of 30 (calendar days), or 25, or even the exact working days in the month. (2) Leave days counted differently: HR may have a different count of your accumulated leave (they may not count CL or SL even if you assumed they would; or they may exclude leave taken without formal approval). (3) Salary components included: this calculator uses basic+DA only. Some employers include HRA and special allowance in the encashment base — a practice that varies by HR policy and is not legally mandated. Always request a leave account statement from HR before your last day to verify the outstanding balance and the daily rate formula your employer uses.",
      },
    ],
    meta: {
      seoTitle: "Leave Encashment Calculator India — EL Payout at Resignation & Retirement",
      seoDescription:
        "Calculate leave encashment from basic+DA and number of earned leave days. Covers the ÷30 and ÷26 divisor options, Section 10(10AA) tax exemption of ₹25 lakh at retirement, and taxability during service. Full F&F settlement guide.",
      keywords: [
        "leave encashment calculator india",
        "earned leave encashment formula india",
        "leave encashment tax exemption india 2025",
        "section 10 10aa leave encashment limit",
        "leave encashment on resignation taxable",
        "full and final settlement leave encashment",
        "leave encashment 30 days vs 26 days",
        "privilege leave encashment calculator",
        "leave encashment at retirement tax free",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
  "bonus-calculator-india": {
    slug: "bonus-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Statutory bonus estimate using the Payment of Bonus Act, 1965: bonus% applied to wages capped at ₹21,000/month. Minimum 8.33%; maximum 20%. Actual bonus depends on allocable surplus, employer policy, and whether your establishment is covered under the Act.",
    sections: [
      {
        heading: "The Payment of Bonus Act, 1965: Legal Foundation and Key Provisions",
        paragraphs: [
          "The Payment of Bonus Act, 1965 (POBA) mandates that every establishment in the industry sector (factories, mines, docks, plantations, and every other establishment employing 20 or more persons) must pay an annual bonus to eligible employees. The Act was enacted to distribute a share of profits to employees and was extended to shops and establishments in several states. The bonus is distinct from salary — it is a share of the employer's profits or productivity gains, distributed as a statutory entitlement.",
          "Who is eligible: Employees drawing monthly salary (basic + DA) up to ₹21,000/month are eligible for statutory bonus under the Act (as per the 2015 amendment). The eligibility threshold was raised from ₹10,000 to ₹21,000 in November 2015. Employees earning above ₹21,000/month are not entitled to statutory bonus under POBA — any bonus they receive is an ex-gratia or performance bonus at the employer's discretion, not a statutory right.",
          "Bonus calculation range: The Act mandates a minimum bonus of 8.33% of annual wages (one month's wages = 8.33% of 12 months) and allows a maximum of 20% of annual wages. The minimum is guaranteed regardless of whether the employer makes a profit — it is paid as a minimum bonus if the allocable surplus is insufficient. Maximum 20% is paid only when the allocable surplus (set by a formula in the Act) is sufficient to fund this higher payout.",
        ],
      },
      {
        heading: "Worked Example: ₹50,000 Basic+DA, 8.33% Bonus",
        paragraphs: [
          "Inputs: Monthly basic + DA = ₹50,000. Bonus % = 8.33% (statutory minimum). Since ₹50,000 > ₹21,000 (the Act's simplified wage ceiling used in this calculator), the calculation base is capped at ₹21,000.",
          "Monthly bonus = ₹21,000 × 8.33% = ₹1,749. Annual bonus = ₹1,749 × 12 = ₹20,988. Note: Under the actual Payment of Bonus Act, the calculation base for bonus is the lower of (a) actual wages or (b) ₹7,000/month or the minimum wage for the scheduled employment, whichever is higher. The ₹21,000 figure in this calculator is the eligibility ceiling, not the computation ceiling. Actual statutory bonus for an employee drawing ₹50,000 basic+DA would be: ₹7,000 × 8.33% = ₹583/month or ₹6,996/year (if minimum wage in your state is below ₹7,000). This calculator uses the eligibility ceiling (₹21,000) as the calculation base for simplicity.",
          "For an employee drawing ₹15,000 basic+DA (below the ₹21,000 ceiling): Calculation base = ₹15,000 (actual wages). Monthly bonus = ₹15,000 × 8.33% = ₹1,250. Annual bonus = ₹1,250 × 12 = ₹15,000. This is exactly one month's salary — which is the intuitive interpretation of the minimum bonus (8.33% × 12 months = 1 month's pay). Performance bonus (ex-gratia) for employees above ₹21,000 is entirely employer-discretionary — typically structured as a % of annual CTC, paid quarterly or annually.",
        ],
      },
      {
        heading: "Minimum Bonus (8.33%), Maximum Bonus (20%), and Allocable Surplus",
        paragraphs: [
          "Minimum bonus (8.33%): This is the floor — payable regardless of profit or loss. If the employer has insufficient allocable surplus, they must still pay 8.33% of wages (subject to the ₹7,000/minimum wage cap per Section 12). The minimum bonus is sometimes called 'ex-gratia bonus' in the accounting sense — it is paid from reserves or current revenue even in loss years. For establishments in their first 5 years: bonus is payable only when there is profit in the accounting year. This is the only exception to the minimum bonus guarantee.",
          "Maximum bonus (20%): The Act caps bonus at 20% of annual wages even when the allocable surplus would permit higher distributions. Allocable surplus = 67% of gross profits (60% for banking companies) after deduction of tax. The surplus is computed under the Second and Third Schedules of POBA. If allocable surplus allows only 15% bonus, 15% is paid. If it allows 25%, the cap limits payout to 20% and the remaining surplus carries forward to the next year's bonus fund.",
          "Set-on and set-off: The Act uses a smoothing mechanism: if allocable surplus yields a bonus above 20%, the excess (set-on) is carried forward up to 4 years and used to fund bonus in years when surplus falls short. If surplus yields below 8.33%, the deficiency (set-off) is met from future surpluses up to 4 years. This means an employer may be paying 20% even in a poor year if past surpluses were set-on, and conversely, pay only 8.33% (minimum) in a good year if past set-offs are being repaid.",
        ],
      },
      {
        heading: "Types of Bonus in India: Statutory vs Performance vs Festival",
        paragraphs: [
          "Statutory bonus (Payment of Bonus Act): 8.33%–20% of annual wages (capped base). Mandatory for eligible employees (≤₹21,000/month) in covered establishments. Paid annually, typically before or during Diwali/Pooja season. Fully taxable as salary income. Exempt from professional tax (in most states). Not included in EPF wage computation.",
          "Performance bonus / variable pay: Paid to employees of all salary levels — not governed by POBA. Paid based on individual, team, or company performance metrics set at the beginning of the appraisal year. May be paid quarterly, semi-annually, or annually. Fully taxable as salary. Eligible for EPF deduction (employee+employer PF on variable pay if included in PF-eligible wages). Many IT companies pay 10–30% of fixed CTC as variable performance bonus.",
          "Festival bonus / ex-gratia: One-time payments on occasions like Diwali, Eid, Christmas, or Puja. Not governed by POBA for employees above ₹21,000/month — purely discretionary. For employees covered under POBA, festival bonus is often paid as advance against the annual statutory bonus (set-off at year-end). Fully taxable. Most corporate employers pay ₹1,000–₹5,000 as Diwali bonus/gift; this is taxable but small.",
        ],
      },
      {
        heading: "Bonus Taxation and Payroll Treatment in India",
        paragraphs: [
          "Bonus is fully taxable as salary income in both old and new tax regimes — there is no exemption for statutory bonus under the Income Tax Act. When bonus is credited: the month in which bonus is paid, the employer adds it to the monthly salary for TDS computation. This typically causes a spike in TDS for that month (often October or November for Diwali bonus). Annual income including bonus must be re-projected by payroll in Q2/Q3, resulting in higher TDS for remaining months.",
          "PF on bonus: Statutory bonus is not part of 'basic wages' as defined under the EPF Act — PF is not deducted on statutory bonus under POBA. However, if your employer pays a regular monthly variable component as part of CTC structure and includes it in the EPF-eligible wage base, PF may be deducted. For most mid-to-large companies, the annual statutory bonus is kept outside the EPF wage scope.",
          "ESI (ESIC) on bonus: ESIC (Employees' State Insurance) applies to employees drawing ≤₹21,000/month gross. Statutory bonus is an ESIC-covered wage — ESIC is deducted at 0.75% employee + 3.25% employer on the bonus amount in the months it is paid. Verify with your HR payroll team whether bonus is included in the ESIC contribution computation. For employees above ₹21,000 gross, ESIC does not apply — no ESIC on bonus.",
        ],
      },
    ],
    tables: [
      {
        title: "Statutory Bonus Calculation — At Various Base Wages and Bonus Percentages",
        columnHeaders: ["Monthly Basic+DA (₹)", "Calculation Base (₹)", "8.33% Monthly (₹)", "8.33% Annual (₹)", "15% Monthly (₹)", "15% Annual (₹)", "20% Monthly (₹)", "20% Annual (₹)"],
        rows: [
          ["5,000", "5,000", "417", "5,000", "750", "9,000", "1,000", "12,000"],
          ["7,000", "7,000", "583", "7,000", "1,050", "12,600", "1,400", "16,800"],
          ["10,000", "10,000", "833", "10,000", "1,500", "18,000", "2,000", "24,000"],
          ["15,000", "15,000", "1,250", "15,000", "2,250", "27,000", "3,000", "36,000"],
          ["21,000", "21,000", "1,749", "20,988", "3,150", "37,800", "4,200", "50,400"],
          ["30,000 (above ceiling)", "21,000 (capped)", "1,749", "20,988", "3,150", "37,800", "4,200", "50,400"],
          ["50,000 (above ceiling)", "21,000 (capped)", "1,749", "20,988", "3,150", "37,800", "4,200", "50,400"],
        ],
      },
      {
        title: "Types of Bonus in India — Comparison at a Glance",
        columnHeaders: ["Bonus Type", "Governed by", "Eligible Employees", "Rate / Amount", "Timing", "Taxable?", "PF Deducted?"],
        rows: [
          ["Statutory (POBA)", "Payment of Bonus Act 1965", "≤₹21,000/month basic+DA", "8.33%–20% of wages (capped)", "Annual (usually Diwali)", "Yes — salary income", "No"],
          ["Performance / Variable", "Employment contract, HR policy", "All employees, all salary levels", "10–30% of CTC (typical)", "Quarterly / annual", "Yes — salary income", "Varies by employer"],
          ["Festival / Diwali bonus", "Discretionary / ex-gratia", "All employees (varies)", "₹1,000–₹5,000 or 1 month salary", "Festival occasions", "Yes — salary income", "No"],
          ["Retention bonus", "Special agreement", "Selected employees (retention plan)", "3–12 months salary", "Cliff vesting (1–3 years)", "Yes — at payment", "No"],
          ["Referral bonus", "HR policy", "Referring employees", "₹10,000–₹50,000 per hire", "On joining + confirmation", "Yes — other income", "No"],
          ["Long-term incentive (LTIP)", "ESOP / RSU plan", "Senior leadership", "% of CTC in shares", "Multi-year vesting", "Yes — at vesting/sale", "No"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Statutory bonus is capped at ₹21,000 wage base — higher earners receive same amount",
      caption:
        "Under POBA, the bonus calculation base is capped at ₹21,000/month. Employees earning ₹21,000 to ₹5,00,000+ all receive the same statutory bonus (₹20,988/year at 8.33%). The bonus differentiation for higher earners comes entirely from discretionary performance or variable pay, not statutory entitlement.",
      sparkValues: [0.24, 0.33, 0.48, 0.71, 1.0, 1.0, 1.0],
    },
    faq: [
      {
        question: "Am I entitled to bonus if my salary is ₹50,000/month?",
        answer:
          "Not under the Payment of Bonus Act, 1965 — the Act only covers employees drawing ≤₹21,000/month in basic + DA. At ₹50,000 basic+DA, you are not a POBA-eligible employee and your employer has no statutory obligation to pay you a bonus under the Act. However, most employers pay a performance bonus or variable pay to all employees regardless of POBA eligibility — this is governed by your employment contract and HR policy, not POBA. If your offer letter specifies a bonus of X% of CTC, that is a contractual right regardless of POBA. If it says 'bonus is at the discretion of management', it is ex-gratia and legally you cannot compel payment.",
      },
      {
        question: "Why is my bonus paid before Diwali instead of at the end of the financial year?",
        answer:
          "The Payment of Bonus Act requires the bonus to be paid within 8 months of the close of the accounting year (usually September 30 for April–March accounting year, or October 31 for calendar year companies). Many employers choose to pay ahead of Diwali (October) as a goodwill practice, keeping it within the 8-month window. Some employers pay Diwali bonus as an advance and reconcile it with the final POBA calculation in November–December. When you receive ₹15,000 as 'Diwali bonus' in October, it may be the full statutory bonus or a partial advance — check with HR whether this is the complete POBA payout or a preliminary advance.",
      },
      {
        question: "Is bonus paid during notice period if I resign mid-year?",
        answer:
          "The Payment of Bonus Act entitles employees to a pro-rated bonus for the portion of the year they worked, if they resign after completing the minimum eligibility period (30 working days in the accounting year). If you resign in September (6 months into April–March year), you are entitled to 6/12 of the annual statutory bonus. However, enforcement of this pro-rated claim can be challenging — many employers only pay the full annual bonus to employees who complete the full year. If your employment contract specifies that bonus is paid only to employees present on the payment date, this overrides the POBA pro-ration in practice (though legally contested in some states). Negotiate the bonus pro-ration as part of your resignation discussion or F&F settlement.",
      },
      {
        question: "What is the difference between 8.33% bonus and 1 month's bonus?",
        answer:
          "They are the same thing mathematically. 8.33% of annual wages = 8.33% × 12 months = 1 month's wages = 100% of one monthly salary. This is why the minimum statutory bonus under POBA is informally called 'one month's salary bonus'. However, the calculation is based on capped wages: for employees earning above ₹7,000/month (POBA computation ceiling), the bonus is 1 month of ₹7,000 = ₹7,000, not 1 month of actual salary. The ₹21,000 figure in this calculator is the eligibility ceiling — the actual computation ceiling under the Act is ₹7,000 (or minimum wage, whichever higher). This calculator simplifies by using ₹21,000 as the computation base.",
      },
      {
        question: "Does statutory bonus count toward my EPF or gratuity base?",
        answer:
          "No to both. Statutory bonus is explicitly excluded from the definition of 'basic wages' under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952 — therefore, no PF is deducted on statutory bonus. Similarly, the Payment of Gratuity Act formula uses 'last drawn salary' meaning basic + DA — bonus is specifically excluded. These exclusions matter: if you receive a ₹1,00,000 annual performance bonus and resign after 5 years, the bonus does not add to your gratuity calculation. Gratuity = (basic+DA × 15/26) × years — only the fixed component of salary. ESI (ESIC) is an exception — ESIC-covered employees (≤₹21,000 gross) do have ESIC contributions on bonus payments.",
      },
    ],
    meta: {
      seoTitle: "Bonus Calculator India — Statutory Bonus Under Payment of Bonus Act 1965",
      seoDescription:
        "Calculate statutory bonus in India: 8.33%–20% of wages under Payment of Bonus Act. Eligibility (≤₹21,000/month), computation ceiling (₹7,000 or min wage), minimum and maximum bonus, Diwali bonus timing, and tax treatment explained.",
      keywords: [
        "bonus calculator india",
        "statutory bonus calculator india 2025",
        "payment of bonus act calculator",
        "minimum bonus india 8.33 percent",
        "annual bonus calculation india",
        "diwali bonus india statutory",
        "bonus eligibility 21000 india",
        "how to calculate statutory bonus india",
        "bonus tax treatment india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
