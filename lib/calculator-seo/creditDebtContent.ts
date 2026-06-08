import type { RichArticle } from "./types";

const HUB_HREF = "/finance/loans-emi/credit-debt-calculators";
const HUB_LABEL = "Finance · Credit & Debt Calculators";

export const CREDIT_DEBT_ARTICLES: Record<string, RichArticle> = {
  "debt-to-income-ratio-calculator": {
    slug: "debt-to-income-ratio-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. DTI uses gross (pre-tax) monthly income per standard lender convention. Some lenders use net income — confirm which basis your lender requires.",
    sections: [
      {
        heading: "What Is the Debt-to-Income (DTI) Ratio?",
        paragraphs: [
          "The debt-to-income ratio (DTI) measures what percentage of your gross monthly income goes toward paying debt obligations. It is one of the two most important numbers lenders look at when evaluating a loan application — the other being your credit score. A high DTI signals to lenders that your income is heavily committed to existing debt, leaving little room to absorb a new loan payment.",
          "DTI = (Total monthly debt payments ÷ Gross monthly income) × 100. Monthly debt payments include: all EMIs (home loan, car loan, personal loan), minimum credit card payments, student loan payments, and any other fixed financial obligation. It does NOT include utilities, groceries, insurance premiums, or rent unless rent is paid as part of a lease under a formal agreement.",
          "In India, lenders more commonly use FOIR (Fixed Obligation to Income Ratio) — which is essentially the same calculation. In the US and globally, DTI is the standard term. Both represent the same fundamental concept: the share of income consumed by debt service.",
        ],
      },
      {
        heading: "DTI Formula, Components, and Calculation",
        paragraphs: [
          "Front-end DTI (Housing Ratio): Only includes housing costs (home loan EMI + property tax + insurance). Formula: (Monthly housing cost ÷ Gross monthly income) × 100. Benchmark: lenders prefer this below 28–31%.",
          "Back-end DTI (Total DTI): All fixed debt obligations. Formula: (Sum of all monthly debt payments ÷ Gross monthly income) × 100. This is the primary metric lenders evaluate. Benchmark: most banks prefer total DTI below 36–43% for home loans; for personal loans, 40–50%.",
          "Example: Gross monthly income = ₹1,20,000. Existing EMIs: home loan ₹25,000 + car loan ₹8,500 + personal loan ₹4,000 = ₹37,500. New home loan EMI being applied for = ₹18,000. Front-end DTI = (₹25,000 ÷ ₹1,20,000) × 100 = 20.8%. Back-end DTI (current) = (₹37,500 ÷ ₹1,20,000) × 100 = 31.25%. Back-end DTI (with new loan) = ((₹37,500 + ₹18,000) ÷ ₹1,20,000) × 100 = 46.25% — likely above many lenders' limit.",
        ],
      },
      {
        heading: "What DTI Thresholds Mean for Loan Approval",
        paragraphs: [
          "Below 36% (excellent): Strong approval likelihood for most loan types. Lenders view you as a low-risk borrower with comfortable debt headroom. You will typically qualify for the best rate tiers.",
          "36%–43% (good to borderline): Approval likely for home loans and car loans. Some lenders may reduce the sanctioned amount or require compensating factors (higher credit score, lower LTV, co-applicant).",
          "43%–50% (caution zone): Many prime lenders will decline or apply tighter scrutiny. NBFCs and HFCs are more flexible. Approval possible with strong compensating factors.",
          "Above 50% (high risk): Most institutional lenders will decline. The borrower's income is too heavily committed. Focus on paying down existing debt before applying for new credit. Alternatively, add a co-applicant with separate income to dilute combined DTI.",
        ],
      },
      {
        heading: "How to Improve Your DTI Before Applying for a Loan",
        paragraphs: [
          "Increase income: Side income, bonuses, rental income, or a salary hike — if you can document it — directly reduces DTI. Some lenders allow you to include rental income, interest income, and spouse income in the denominator.",
          "Pay down existing debt: Close small personal loans or outstanding credit card balances before applying. Even eliminating a ₹3,000/month EMI on a small personal loan can meaningfully improve your DTI and approval odds.",
          "Extend existing loan tenures: If your car loan has 24 months remaining at ₹10,000/month, ask the lender to extend it — reducing the monthly obligation. This lowers your current DTI for the new application, though it increases your total interest cost.",
          "Apply with a co-applicant: A co-borrower's income is added to the denominator. A spouse or earning family member as co-applicant can cut DTI in half if incomes are equal, dramatically improving approval odds.",
        ],
      },
      {
        heading: "DTI vs CIBIL Score: Which Matters More?",
        paragraphs: [
          "CIBIL score reflects your credit repayment history — have you paid on time, how much credit are you using, how long have you had credit. DTI reflects your current capacity to take on more debt. Both are necessary conditions, but neither is sufficient alone.",
          "You can have an excellent CIBIL score of 780 but a DTI of 55% — and be declined because you are already over-leveraged. Conversely, you can have a low DTI of 20% but a CIBIL of 650 and be declined because of past defaults. Lenders want both: good history AND current capacity.",
          "If you have to prioritize, fix your CIBIL score first (takes 6–24 months of clean repayment) and simultaneously work on reducing DTI. Applications made with a score below 700 are almost always declined or penalized in rate regardless of DTI.",
        ],
      },
    ],
    tables: [
      {
        title: "DTI / FOIR Thresholds Across Lender Types (India, Indicative)",
        columnHeaders: ["DTI Range", "Risk Category", "Home Loan Approval", "Personal Loan Approval"],
        rows: [
          ["< 30%", "Excellent", "High probability, best rates", "High probability, best rates"],
          ["30% – 36%", "Good", "Strong approval, standard rates", "Strong approval"],
          ["36% – 43%", "Borderline", "Possible; amount may be capped", "Possible with higher rate"],
          ["43% – 50%", "Caution", "NBFC/HFC route; co-applicant helps", "Declined by most banks"],
          ["> 50%", "High risk", "Likely declined", "Declined by most lenders"],
        ],
      },
      {
        title: "DTI Calculation Example — ₹1.2L Monthly Income",
        columnHeaders: ["Debt Item", "Monthly Payment (₹)", "DTI Contribution (%)"],
        rows: [
          ["Home loan EMI", "25,000", "20.8%"],
          ["Car loan EMI", "8,500", "7.1%"],
          ["Personal loan EMI", "4,000", "3.3%"],
          ["Credit card min payment", "2,500", "2.1%"],
          ["Total (existing)", "40,000", "33.3%"],
          ["Proposed new home loan EMI", "18,000", "15.0%"],
          ["Total (with new loan)", "58,000", "48.3% — exceeds many lenders' limit"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "How DTI drops as debts are paid off over time (illustrative)",
      caption:
        "As existing loans are paid down, your DTI naturally improves, increasing your borrowing capacity. This tool calculates your current DTI and shows the headroom for new debt at any given income level.",
      sparkValues: [48, 44, 40, 37, 33, 29, 24],
    },
    faq: [
      {
        question: "Does DTI use gross or net income?",
        answer:
          "Most lenders (particularly in the US and for formal bank loans in India) use gross monthly income (before tax and deductions). However, some Indian NBFCs and informal lenders use net (take-home) income. Always clarify which basis your lender uses, and input the correct figure in the calculator.",
      },
      {
        question: "Is rent included in DTI calculations?",
        answer:
          "Rent you PAY is not included as a debt obligation in DTI — it is an expense, not a debt payment. Rent you RECEIVE (as landlord) may be included in your income denominator (usually at 70–90% of actual to account for vacancy). Personal loan repayments, credit card minimums, and all loan EMIs are included.",
      },
      {
        question: "My loan was declined due to high DTI. What should I do?",
        answer:
          "Short-term: Add a co-applicant (spouse, parent) with income. Close any small outstanding debts before re-applying. Long-term: Pay down existing loans; ask your lender to extend the tenure on any existing loan to reduce the monthly obligation temporarily. Reapply after 6 months of improvements.",
      },
      {
        question: "Can a very high income override a high DTI?",
        answer:
          "Partially. Lenders care about the ratio, not the absolute income level. A ₹10L/month earner with 55% DTI is just as risky by this metric as a ₹1L/month earner with 55% DTI — both have similar proportional overcommitment. Some premium private banks exercise discretion for HNI borrowers, but the ratio still matters.",
      },
      {
        question: "How often should I calculate my DTI?",
        answer:
          "Recalculate whenever you take on a new debt, pay off a loan, or get a salary change. It is especially important to check before applying for any major loan — 3–6 months in advance gives you time to improve it if needed.",
      },
    ],
    meta: {
      seoTitle: "Debt-to-Income Ratio Calculator — DTI Formula, Thresholds & Loan Approval Guide",
      seoDescription:
        "Calculate your debt-to-income ratio (DTI / FOIR), understand lender thresholds, and learn how to improve it. Includes worked examples, approval benchmarks, and DTI vs CIBIL comparison.",
      keywords: [
        "debt to income ratio calculator",
        "dti calculator",
        "foir calculator india",
        "debt to income ratio formula",
        "loan eligibility dti",
        "how to calculate dti",
        "improve debt to income ratio",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "loan-repayment-capacity-calculator": {
    slug: "loan-repayment-capacity-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Capacity estimates are based on standard FOIR conventions and may differ from your specific lender's eligibility model. Treat outputs as planning estimates.",
    sections: [
      {
        heading: "What Is Loan Repayment Capacity?",
        paragraphs: [
          "Loan repayment capacity is the maximum monthly debt obligation (EMI) a borrower can sustain without financial stress, given their income and existing obligations. It is the borrower-side answer to a question lenders ask from the other direction: 'How much loan can this person safely service?'",
          "Knowing your repayment capacity before applying for a loan is critical because: (1) it helps you set a realistic loan amount target, (2) it prevents you from being over-leveraged, (3) it tells you which loan offers (amount, rate, tenure) you can realistically pursue, and (4) it gives you a negotiating frame — if a lender's sanctioned amount is less than your capacity-derived target, you can challenge it with your own analysis.",
          "Repayment capacity is not just a lender's tool. It is a personal finance instrument for preventing the trap of lifestyle-inflation-driven debt, where people borrow the maximum the lender will allow rather than the maximum that is financially sensible for them.",
        ],
      },
      {
        heading: "How Repayment Capacity Is Calculated",
        paragraphs: [
          "Step 1 — Determine available EMI budget: Available EMI = (Gross monthly income × FOIR limit) − Existing monthly EMIs. Standard FOIR: 40–50% for salaried borrowers, 50–55% for self-employed (higher income volatility acknowledged by lenders). Example: Income ₹1,00,000 × 40% = ₹40,000 available for all EMIs. Existing EMIs: ₹12,000. Available for new loan: ₹40,000 − ₹12,000 = ₹28,000.",
          "Step 2 — Convert available EMI to loan amount: Loan amount = Available EMI × [(1 + r)^n − 1] ÷ [r × (1 + r)^n], where r = monthly interest rate, n = tenure in months. This is the inverse of the standard EMI formula. Example: Available EMI ₹28,000, rate 8.5% p.a. (r = 0.7083%), tenure 20 years (n = 240). Loan amount = 28,000 × [(1.007083)^240 − 1] ÷ [0.007083 × (1.007083)^240] = 28,000 × 5.2516 ÷ 0.04417 = ₹33,28,000 approx.",
          "Step 3 — Apply LTV constraint: For home loans, banks also apply Loan-to-Value (LTV) limits (max 75–90% of property value). Your repayment capacity may support ₹33L but the property value cap may be lower. The sanctioned amount is the minimum of the two.",
        ],
      },
      {
        heading: "Worked Example: Full Capacity Calculation",
        paragraphs: [
          "Profile: Salaried individual, gross income ₹1,20,000/month. Existing EMIs: car loan ₹9,500 + one personal loan ₹3,500 = ₹13,000. Applying for: home loan at 8.75% p.a. for 20 years.",
          "FOIR-based EMI budget (at 45%): ₹1,20,000 × 45% = ₹54,000. Subtract existing EMIs: ₹54,000 − ₹13,000 = ₹41,000 available for home loan EMI.",
          "Max loan from EMI: ₹41,000 at 8.75% for 240 months = ₹41,000 × 5.1567 ÷ 0.04387 ≈ ₹48,24,000.",
          "LTV check: If property costs ₹65L and bank allows 80% LTV = ₹52L. Your capacity (₹48.24L) is below LTV limit. Max sanctioned = ₹48.24L. You need to arrange ₹65L − ₹48.24L = ₹16.76L as down payment.",
        ],
      },
      {
        heading: "Factors That Reduce Effective Repayment Capacity",
        paragraphs: [
          "Age: Lenders cap loan tenure such that the loan closes before retirement (typically age 58–60 for salaried, 65 for self-employed). A 45-year-old applying for a home loan may only get a 15-year tenure, not 20 — reducing the affordable loan amount by 10–15% for the same EMI.",
          "Job stability: Probationary employees, contract workers, or those with less than 2 years at current employer may face a haircut in the income lenders recognize. Some banks discount 30–40% of income for such profiles.",
          "Irregular income: Commission income, rental income, or freelance income is typically counted at 70–80% of average over 2 years, not at the current peak. This is a key issue for self-employed borrowers who have had a recent good year.",
          "Credit card outstanding balances: Even if you pay your credit card in full each month, the bank may count 5% of your credit limit as a monthly obligation in their DTI calculation. If you have a ₹10L credit card limit, that could add ₹50,000/month to your obligations — dramatically reducing your apparent capacity even if you never carry a balance.",
        ],
      },
      {
        heading: "How to Maximize Loan Repayment Capacity",
        paragraphs: [
          "Close small outstanding debts before applying: Prepay any personal loans, car loans nearing their final months, or outstanding credit card balances. Every ₹5,000/month EMI you eliminate adds roughly ₹6–8 lakh to your maximum loan eligibility at 8.5% for 20 years.",
          "Reduce credit card limits: Request a reduction in your credit card limit to what you actually use. This reduces the 'shadow EMI' that some lenders impute from your card limits, improving your assessed capacity.",
          "Add a co-borrower: A working spouse or earning family member adding their income to the application directly increases the combined income base, expanding capacity. This is the single highest-leverage action for couples.",
          "Time your application: Apply when your salary is highest (after an increment), when you have recently closed a debt, or when you have documented additional income (rental receipts, FD interest certificates). Capacity is assessed on the snapshot of income and obligations at the time of application.",
        ],
      },
    ],
    tables: [
      {
        title: "Loan Eligibility vs Income — 8.5% Rate, 20-Year Tenure, 45% FOIR",
        columnHeaders: ["Gross Monthly Income", "FOIR Budget (45%)", "Existing EMIs", "Available EMI", "Max Loan Amount"],
        rows: [
          ["₹50,000", "₹22,500", "₹5,000", "₹17,500", "~₹20.6L"],
          ["₹75,000", "₹33,750", "₹7,000", "₹26,750", "~₹31.5L"],
          ["₹1,00,000", "₹45,000", "₹10,000", "₹35,000", "~₹41.2L"],
          ["₹1,50,000", "₹67,500", "₹15,000", "₹52,500", "~₹61.8L"],
          ["₹2,00,000", "₹90,000", "₹20,000", "₹70,000", "~₹82.4L"],
          ["₹3,00,000", "₹1,35,000", "₹25,000", "₹1,10,000", "~₹1.29Cr"],
        ],
      },
      {
        title: "Impact of Tenure on Max Loan Amount (₹30,000 Available EMI, 8.5%)",
        columnHeaders: ["Loan Tenure", "Monthly Rate", "Max Loan Amount", "Total Interest"],
        rows: [
          ["10 years", "0.7083%", "~₹24.3L", "~₹11.7L"],
          ["15 years", "0.7083%", "~₹30.5L", "~₹23.9L"],
          ["20 years", "0.7083%", "~₹35.3L", "~₹36.7L"],
          ["25 years", "0.7083%", "~₹38.8L", "~₹51.2L"],
          ["30 years", "0.7083%", "~₹41.1L", "~₹67.0L"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Maximum loan at different income levels and tenures",
      caption:
        "Longer tenures allow a larger loan for the same monthly payment, but at significantly higher total interest cost. Use this calculator to find the tenure that balances loan amount with total interest for your income.",
    },
    faq: [
      {
        question: "Is the maximum eligible loan amount the same as what I should borrow?",
        answer:
          "No — these are very different numbers. Lender eligibility is the maximum they will lend you based on repayment safety. What you should borrow is the amount you need for the purchase minus your down payment. Always borrow less than the maximum if you can: lower principal means lower total interest and faster equity building.",
      },
      {
        question: "Does rental income count toward repayment capacity?",
        answer:
          "Most lenders include rental income at 70–90% of the actual amount (haircut for vacancy and maintenance). You typically need 2 years of documented rental income (ITR-backed) for it to be counted. Projected future rental income is generally not considered.",
      },
      {
        question: "I am self-employed. How do lenders assess my capacity?",
        answer:
          "Self-employed applicants are assessed on net profit from business (per 2–3 years of ITRs), not turnover. Lenders average income over 2–3 years and may apply a 20–30% haircut for business risk. Maintaining clean ITR filings for 3+ years is the single most important step for self-employed borrowers.",
      },
      {
        question: "What happens if my income drops after taking a large loan?",
        answer:
          "If your income drops but you continue paying EMIs, there is no immediate issue. If you miss EMIs, the loan goes NPA after 90 days and your CIBIL score is damaged. To protect yourself, maintain a 6-month EMI emergency fund, consider EMI insurance, and borrow at a DTI that gives you a 30–40% income buffer above the FOIR threshold.",
      },
      {
        question: "Why does the bank approve less than this calculator shows?",
        answer:
          "This calculator uses a standard FOIR model. Banks use additional filters: property valuation, LTV limits, age-based tenure caps, credit score adjustments, employer category (PSU vs private vs startup), and internal policy overrides. These can reduce the actual sanction below the theoretical capacity.",
      },
    ],
    meta: {
      seoTitle: "Loan Repayment Capacity Calculator — How Much Loan Can You Afford?",
      seoDescription:
        "Calculate the maximum loan amount you qualify for based on income, existing EMIs, and FOIR limits. Includes formula, worked example, eligibility tables, and tips to maximize capacity.",
      keywords: [
        "loan repayment capacity calculator",
        "how much loan can i afford",
        "loan eligibility calculator",
        "foir based loan eligibility",
        "maximum loan amount calculator",
        "home loan eligibility calculator india",
        "loan capacity based on salary",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "credit-card-emi-calculator": {
    slug: "credit-card-emi-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Credit card EMI interest rates vary widely (13–42% p.a.). No-cost EMI schemes may include merchant-paid interest subvention or a processing fee — always check the fine print.",
    sections: [
      {
        heading: "How Credit Card EMI Works",
        paragraphs: [
          "When you convert a credit card purchase into EMIs, the bank splits your purchase amount into fixed monthly installments (typically 3, 6, 9, 12, 18, or 24 months) and adds interest charges. The EMI amount is deducted from your credit limit and collected via your monthly statement.",
          "Standard credit card EMI (with interest): The bank charges an interest rate on the purchase amount, typically 13–24% p.a. for premium cards and up to 36–42% p.a. for co-branded store cards. The EMI = Principal × r × (1+r)^n ÷ [(1+r)^n − 1], exactly like a regular loan — just at a much higher rate.",
          "No-cost EMI (merchant-funded): The merchant pays the bank a 'subvention' (pre-payment of interest) to offer you '0% interest'. You pay only the principal in equal installments. However, many merchants add a processing fee (₹99–₹299 or 1–2% of value) or inflate the MRP of the product to cover their subvention cost. The 'free' EMI almost always has a hidden cost — the question is whether it is transparent.",
        ],
      },
      {
        heading: "Credit Card EMI Formula and True Cost Calculation",
        paragraphs: [
          "Standard EMI: E = P × r × (1+r)^n ÷ [(1+r)^n − 1], where P = purchase amount, r = monthly rate (annual rate ÷ 12), n = tenure in months.",
          "Total interest = E × n − P. This is the total finance charge you pay above the purchase price.",
          "Effective annual cost with processing fee: If the bank charges a one-time processing fee F, the adjusted APR is found by solving for the rate r' such that PV of all EMIs = P − F (since you effectively borrow P but pay back P + interest over n months after incurring F upfront). This true APR is always higher than the stated rate.",
          "No-cost EMI true cost: If the product is available for ₹10,000 cash but only ₹10,999 when converted to 6-month no-cost EMI (a common scenario on e-commerce platforms), the implied rate = IRR of paying [₹10,999/6 per month for 6 months, net present value = ₹10,000] ≈ 36% p.a. effective. The 'cost' is the price inflation, not an explicit interest charge.",
        ],
      },
      {
        heading: "Worked Example: ₹60,000 Laptop on Credit Card EMI",
        paragraphs: [
          "Purchase: ₹60,000 laptop. Three options: pay in full, standard 12-month EMI at 18% p.a., no-cost 6-month EMI with ₹499 processing fee.",
          "Pay in full: ₹60,000. Total cost = ₹60,000.",
          "Standard 12-month EMI at 18% (monthly rate = 1.5%): EMI = ₹60,000 × 1.5% × (1.015)^12 ÷ [(1.015)^12 − 1] = ₹60,000 × 0.9163 ÷ 0.1956 = ₹5,498/month. Total paid = ₹5,498 × 12 = ₹65,976. Total interest = ₹5,976 (9.96% of purchase price).",
          "No-cost 6-month EMI with ₹499 processing fee: EMI = ₹60,000 ÷ 6 = ₹10,000/month. Processing fee: ₹499 charged upfront (or added to first statement). Total paid = ₹60,000 + ₹499 = ₹60,499. Effective APR ≈ 3.3% — far cheaper than standard EMI despite the fee, and better than most credit card interest scenarios.",
          "Verdict: No-cost EMI (₹60,499) > Pay in full (₹60,000) > Standard EMI (₹65,976). No-cost EMI costs ₹499 vs standard EMI's ₹5,976 — for most purchases, no-cost EMI is the clearly superior choice if you cannot pay in full.",
        ],
      },
      {
        heading: "When to Convert a Credit Card Purchase to EMI",
        paragraphs: [
          "Convert to EMI if: (1) The purchase amount is large relative to your income (>50% of one month's income), (2) You are unable to pay the full amount by the due date, (3) The EMI option is genuinely at 0% (no-cost) from a reputable platform, or (4) You need to preserve liquidity for an emergency fund.",
          "Do NOT convert to EMI if: (1) You have the cash to pay in full and no better use for that cash, (2) The stated '0% EMI' carries a processing fee that makes it expensive relative to the purchase amount, (3) The EMI tenure extends beyond the product's useful life, or (4) Your credit card already carries a revolving balance at 30%+ APR — in that case, first clear the revolving balance as it costs far more than any purchase EMI.",
          "Also note: converting a purchase to EMI reduces your available credit limit by the outstanding EMI principal balance. This can affect your credit utilization ratio, which impacts your CIBIL score.",
        ],
      },
      {
        heading: "Credit Card EMI vs Personal Loan: Which Is Cheaper?",
        paragraphs: [
          "For the same purchase amount and tenure, a personal loan from a bank (9–15% p.a.) is almost always cheaper than a standard credit card EMI (18–36% p.a.). The exception is no-cost EMI (effective rate typically < 5%), which beats both.",
          "A personal loan requires documentation and processing time (1–7 days). Credit card EMI is instant — one click on the banking app. For urgent large purchases, the 3–5% extra interest cost of a credit card EMI over a personal loan may be worth the convenience. For planned purchases, take the time to apply for a personal loan.",
          "Bottom line: No-cost CC EMI < Personal loan < Standard CC EMI. Structure your financing accordingly.",
        ],
      },
    ],
    tables: [
      {
        title: "Credit Card EMI Cost Comparison — ₹60,000 Purchase",
        columnHeaders: ["Option", "Tenure", "Monthly Payment", "Total Interest", "Total Cost"],
        rows: [
          ["Pay in full", "—", "₹60,000 (one-time)", "₹0", "₹60,000"],
          ["No-cost EMI + ₹499 fee", "6 months", "₹10,000", "₹499 (fee only)", "₹60,499"],
          ["Standard EMI @ 15% p.a.", "6 months", "₹10,574", "₹3,444", "₹63,444"],
          ["Standard EMI @ 18% p.a.", "12 months", "₹5,498", "₹5,976", "₹65,976"],
          ["Standard EMI @ 24% p.a.", "12 months", "₹5,769", "₹9,228", "₹69,228"],
          ["Revolving (min payment only)", "Ongoing", "₹1,800 (3%)", "₹40,000+ (est.)", "₹1,00,000+"],
        ],
      },
      {
        title: "EMI per ₹10,000 at Various Credit Card Interest Rates",
        columnHeaders: ["Tenure", "13% p.a.", "18% p.a.", "24% p.a.", "36% p.a."],
        rows: [
          ["3 months", "₹3,393", "₹3,429", "₹3,469", "₹3,550"],
          ["6 months", "₹1,720", "₹1,757", "₹1,799", "₹1,890"],
          ["12 months", "₹896", "₹917", "₹943", "₹997"],
          ["18 months", "₹615", "₹637", "₹663", "₹722"],
          ["24 months", "₹476", "₹499", "₹526", "₹588"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Total cost increases sharply with tenure and rate",
      caption:
        "Longer tenures mean more total interest even if the monthly payment is lower. For credit card EMIs, minimizing tenure minimizes cost. Use the calculator above to find the optimal tenure for your purchase.",
      sparkValues: [60, 61.5, 63, 65, 68, 72, 77],
    },
    faq: [
      {
        question: "Can I foreclose a credit card EMI early?",
        answer:
          "Yes, most banks allow pre-closure of credit card EMIs. There may be a foreclosure fee (typically 2–3% of outstanding principal) or a fixed charge. Calculate whether the interest saving from early closure exceeds the foreclosure fee before proceeding.",
      },
      {
        question: "Does converting a purchase to EMI affect my CIBIL score?",
        answer:
          "Not significantly, as long as you pay each EMI on time. The EMI reduces your available credit limit (increasing utilization, which can temporarily dip your score by 5–15 points). Once the EMIs are paid off, your limit is restored and score typically recovers.",
      },
      {
        question: "What is the difference between 'no-cost EMI' and 'zero interest EMI'?",
        answer:
          "They are marketed as the same thing but the mechanics differ. True zero interest EMI: neither you nor the merchant pays interest (rare — usually a seasonal promotion by the bank). No-cost EMI: the merchant pays the interest as a subvention, often subsidized by a slightly higher product price. Either way, you pay no explicit interest.",
      },
      {
        question: "Why is the total amount on my statement more than the product price on EMI conversion?",
        answer:
          "Processing fees, GST on the interest component, or account maintenance fees may be added on top of principal and interest. Request a complete amortization schedule from your bank when converting to EMI — it should show all charges clearly.",
      },
      {
        question: "Is it better to use a personal loan or credit card EMI for a large purchase?",
        answer:
          "For large purchases (₹50,000+) where you need 12–24 months, a pre-approved personal loan (9–14% p.a.) is almost always cheaper than standard credit card EMI (18–36%). The exception is if a no-cost EMI is available — then the credit card route is optimal. Compare total outflows (not just rates) using both calculators.",
      },
    ],
    meta: {
      seoTitle: "Credit Card EMI Calculator — Monthly Payment, True Cost & No-Cost EMI Guide",
      seoDescription:
        "Calculate credit card EMI payments, total interest, and the true cost of no-cost EMI schemes. Includes formula, worked example, comparison tables, and when to convert vs pay in full.",
      keywords: [
        "credit card emi calculator",
        "credit card emi interest rate",
        "no cost emi true cost",
        "convert purchase to emi calculator",
        "credit card emi vs personal loan",
        "emi on credit card india",
        "zero interest emi calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "credit-card-interest-calculator": {
    slug: "credit-card-interest-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Credit card interest rates in India range from 23% to 47% p.a. (as of 2025). Interest is calculated daily on the outstanding balance. Minimum payment trap simulations are illustrative.",
    sections: [
      {
        heading: "How Credit Card Interest Is Calculated",
        paragraphs: [
          "Credit card interest is one of the most expensive forms of consumer debt, yet one of the least understood. Most people know their card's APR (Annual Percentage Rate), but few understand how that translates into daily charges and how quickly an unpaid balance can compound.",
          "Daily Periodic Rate (DPR): DPR = APR ÷ 365. For a card with 36% APR: DPR = 36% ÷ 365 = 0.0986% per day. On a ₹10,000 balance, that is ₹9.86 in interest every single day — whether you make purchases or not.",
          "Monthly interest on outstanding balance: Interest for the month = Outstanding balance × (APR ÷ 12). For 36% APR: 3% per month. On ₹50,000 outstanding: ₹1,500 added to your balance every month just as interest. If your minimum payment is less than ₹1,500, your balance actually grows even as you pay.",
          "No interest-free period when you carry a balance: Credit cards offer an interest-free period (typically 20–50 days) only if you pay the previous month's full statement balance. If you carry even ₹1 from last month, ALL new purchases from the first day of the cycle start accruing interest immediately — there is no grace period.",
        ],
      },
      {
        heading: "The Minimum Payment Trap: Why It Is Dangerous",
        paragraphs: [
          "Credit card companies set minimum payments at 2–5% of the outstanding balance (or ₹200–500, whichever is higher). This minimum seems manageable, but it is structured to maximize interest revenue for the bank — not to help you escape debt quickly.",
          "Example: ₹1,00,000 credit card debt at 36% APR. Minimum payment = 3% = ₹3,000/month. Month 1: interest = ₹3,000 (exactly equal to minimum payment). Your principal balance barely reduces. At this rate, it would take approximately 10+ years to pay off and cost ₹1,20,000+ in interest — more than the original balance.",
          "Contrast: Pay ₹5,000/month instead of ₹3,000 minimum. Payoff time = 26 months. Total interest = ₹30,360. Difference: ₹90,000+ in interest saved by paying ₹2,000 extra per month. The minimum payment is a debt trap. Always pay as much above the minimum as you can.",
          "Formula for months to pay off: n = −ln[1 − (r × P ÷ PMT)] ÷ ln(1 + r), where PMT = monthly payment, r = monthly rate, P = balance. This only works if PMT > P × r (otherwise the balance never decreases).",
        ],
      },
      {
        heading: "Worked Example: ₹50,000 Balance at 36% APR",
        paragraphs: [
          "Balance: ₹50,000 at 36% APR (3% per month). Three payment strategies.",
          "Pay minimum only (3% of balance, declining): First month payment = ₹1,500. As balance drops, minimum also drops. This stretches payoff to 8+ years and total interest to ₹60,000+.",
          "Pay fixed ₹2,500/month: Monthly interest on ₹50,000 = ₹1,500. Net principal reduction per payment = ₹1,000. Payoff in approximately 41 months. Total interest ≈ ₹52,500.",
          "Pay fixed ₹5,000/month: Payoff in approximately 13 months. Total interest ≈ ₹14,862. Interest saving vs ₹2,500 plan = ₹37,638. The extra ₹2,500/month (₹32,500 total extra over the period) prevents ₹37,638 in interest — a return of 116% on the extra payments.",
        ],
      },
      {
        heading: "Comparing Credit Card Interest to Other Debt",
        paragraphs: [
          "Credit card interest is the most expensive common debt form: 23–47% p.a. vs personal loans at 10–20%, home loans at 8–10%, and car loans at 8–12%. This means every month you carry a credit card balance while also holding a savings account (earning 3–4%), you are losing 20–40% per year on that money.",
          "The hierarchy of debt repayment — always pay credit card debt first, above all other financial goals except minimum payments on other debts. No investment can reliably return 36% annually (the interest you avoid by paying off a high-rate credit card balance).",
          "If you cannot pay off your credit card balance, consider a balance transfer to a lower-rate personal loan or a balance-transfer card with a 0% introductory period. This alone can save thousands of rupees by reducing the effective rate from 36% to 12–15%.",
        ],
      },
      {
        heading: "How to Avoid Paying Credit Card Interest",
        paragraphs: [
          "Rule 1 — Always pay the full statement balance, not just the minimum, by the due date. This ensures you never pay interest and keeps the grace period active for future purchases.",
          "Rule 2 — Set up auto-pay for the full statement balance. This eliminates the risk of forgetting, which is the most common reason people end up carrying a balance and paying interest.",
          "Rule 3 — If you cannot pay in full, pay as much over the minimum as possible. Target clearing the full balance within 2–3 months. Any balance you carry for longer becomes expensive.",
          "Rule 4 — Never use credit card cash advances. Cash withdrawals from a credit card typically have no grace period (interest starts from day 1), a cash advance fee (2–3%), and often a higher APR than purchases. It is the most expensive short-term borrowing available to most consumers.",
        ],
      },
    ],
    tables: [
      {
        title: "Minimum Payment Trap: ₹50,000 Balance at 36% APR",
        columnHeaders: ["Monthly Payment", "Payoff Period", "Total Interest", "Total Paid"],
        rows: [
          ["Min only (3%, declining)", "~8+ years", "~₹60,000+", "~₹1,10,000+"],
          ["₹1,500 (flat)", "Never (= interest)", "Infinite", "Infinite"],
          ["₹2,000/month", "~56 months", "~₹62,000", "~₹1,12,000"],
          ["₹3,000/month", "~22 months", "~₹15,800", "~₹65,800"],
          ["₹5,000/month", "~12 months", "~₹8,500", "~₹58,500"],
          ["₹10,000/month", "~6 months", "~₹4,200", "~₹54,200"],
        ],
      },
      {
        title: "Daily Interest Accrual on ₹50,000 at Different APRs",
        columnHeaders: ["APR", "Daily Rate", "Daily Interest on ₹50K", "Monthly Interest on ₹50K", "Annual Interest on ₹50K"],
        rows: [
          ["24% p.a.", "0.0658%", "₹32.88", "₹1,000", "₹12,000"],
          ["30% p.a.", "0.0822%", "₹41.10", "₹1,250", "₹15,000"],
          ["36% p.a.", "0.0986%", "₹49.32", "₹1,500", "₹18,000"],
          ["42% p.a.", "0.1151%", "₹57.53", "₹1,750", "₹21,000"],
          ["47% p.a.", "0.1288%", "₹64.38", "₹1,958", "₹23,500"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Balance under minimum payment vs fixed payment (illustrative)",
      caption:
        "Minimum-only payments barely reduce the balance in early months. A fixed higher payment creates a steep decline. The gap represents tens of thousands of rupees in avoidable interest.",
      sparkValues: [50, 49.2, 48.1, 46.8, 44.9, 41.5, 36.0],
    },
    faq: [
      {
        question: "What happens if I only pay the minimum on my credit card every month?",
        answer:
          "Your balance reduces very slowly (or not at all if the minimum equals the interest charge). You will be in debt for years and pay more in interest than the original amount you spent. Always treat the minimum as an emergency floor, not a target payment.",
      },
      {
        question: "Is it true that new purchases lose their interest-free period if I carry a balance?",
        answer:
          "Yes. If you carry any balance from a previous statement into the current month, ALL new purchases start accruing interest immediately from the transaction date — there is no 20–50 day grace period. This is one of the most important and least understood features of credit card interest.",
      },
      {
        question: "How does a credit card cash advance differ from a regular purchase in terms of interest?",
        answer:
          "Cash advances: (1) carry a higher APR than purchases (often 42–47%), (2) have no grace period — interest starts from the day of withdrawal, (3) carry a cash advance fee of 2.5–3% + flat minimum. A ₹10,000 cash advance can cost ₹300–500 in fees before a single day's interest is charged. Avoid entirely unless it is a genuine emergency with no alternatives.",
      },
      {
        question: "What is the best strategy if I have multiple credit card balances?",
        answer:
          "Use the Debt Avalanche method: pay minimum on all cards, put every extra rupee on the card with the highest APR. This minimizes total interest. Alternatively, use the Debt Snowball (lowest balance first) for psychological momentum — see those dedicated calculators for detailed modeling.",
      },
      {
        question: "How does a balance transfer work and when is it worth it?",
        answer:
          "A balance transfer moves your outstanding balance to a new card or loan at a lower rate. Many cards offer 0% for 3–12 months on transferred balances (with a 1–3% transfer fee). If you can pay off the balance during the 0% period, this is an excellent strategy. The risk: if you do not pay off before the promotional period ends, the rate resets to a high default rate (often 36%+).",
      },
    ],
    meta: {
      seoTitle: "Credit Card Interest Calculator — Daily Rate, Minimum Payment Trap & True Cost",
      seoDescription:
        "Calculate credit card interest charges, see the minimum payment trap in numbers, and compare payoff strategies. Includes daily rate formula, worked examples, and escape strategies.",
      keywords: [
        "credit card interest calculator",
        "credit card apr calculator",
        "minimum payment calculator credit card",
        "credit card balance interest",
        "how credit card interest works india",
        "daily periodic rate calculator",
        "credit card debt calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "debt-payoff-calculator": {
    slug: "debt-payoff-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Payoff calculations use standard reducing-balance amortization. Results assume fixed monthly payments and no new charges on existing debt accounts.",
    sections: [
      {
        heading: "What Is a Debt Payoff Calculator?",
        paragraphs: [
          "A debt payoff calculator answers the two most important questions for anyone managing debt: (1) If I pay $X per month, how long until I am debt-free? (2) If I want to be debt-free by date Y, how much do I need to pay each month? These questions have exact mathematical answers — and knowing them is the first step to taking control of your financial situation.",
          "The calculator works for any type of amortizing debt: credit cards, personal loans, car loans, student loans, or combinations. You input the outstanding balance, interest rate (APR), and either a monthly payment (to find the payoff date) or a target payoff date (to find the required payment).",
          "Most importantly, this tool makes visible the compounding cost of paying too little each month — a truth that banks profit from but rarely volunteer to their customers.",
        ],
      },
      {
        heading: "Debt Payoff Formulas",
        paragraphs: [
          "Time to pay off given a monthly payment: n = −ln[1 − (r × P ÷ PMT)] ÷ ln(1 + r), where P = current balance, r = monthly interest rate (APR ÷ 12), PMT = monthly payment. Note: PMT must be greater than P × r (the monthly interest charge) for any progress to be made.",
          "Payment required to pay off by a specific date: PMT = P × r × (1 + r)^n ÷ [(1 + r)^n − 1]. This is the standard EMI formula — you are computing the EMI that clears the balance in n months.",
          "Total interest paid: Total interest = (PMT × n) − P. The difference between what you pay back in total and the original balance.",
          "Interest saved by paying extra: If you pay PMT_extra instead of PMT_minimum each month, interest saved = [PMT_minimum × n_minimum − P] − [PMT_extra × n_extra − P] = PMT_minimum × n_minimum − PMT_extra × n_extra.",
        ],
      },
      {
        heading: "Worked Example: Two Debts, Two Strategies",
        paragraphs: [
          "You have: Debt A — ₹80,000 personal loan at 14% p.a. (monthly rate 1.167%), current minimum payment ₹2,500/month. Debt B — ₹30,000 credit card at 36% p.a. (monthly rate 3%), minimum payment ₹1,000/month. Total minimum monthly payments = ₹3,500.",
          "If you pay only minimums: Debt A payoff in ~43 months (total interest ₹27,500). Debt B payoff: minimum equals interest (₹900/month interest vs ₹1,000 minimum — only ₹100 net principal reduction per month), payoff in 300+ months with interest exceeding the original balance.",
          "Better strategy — extra ₹2,000/month on Debt B (high interest): Pay ₹3,000/month on Debt B instead of ₹1,000. Debt B payoff: 11 months (total interest ₹5,390, saving ₹24,610+ vs minimum-only). After Debt B is cleared, redirect all freed cash to Debt A: ₹2,500 + ₹3,000 = ₹5,500/month on Debt A. Payoff: ~18 more months. Total time: 29 months (vs 43+ months paying minimums). Total interest: ₹27,500 (Debt A) + ₹5,390 (Debt B) = ₹32,890 vs ₹55,000+ on minimums-only path.",
        ],
      },
      {
        heading: "The Debt-Free Date: Planning Backwards",
        paragraphs: [
          "Setting a specific debt-free date — 'I will be debt-free by December 2027' — is more psychologically powerful than thinking about monthly payments in isolation. Work backwards: calculate the monthly payment needed to hit that date, compare it to your current payment, and identify the gap you need to close through spending cuts or income increases.",
          "The debt-free date calculation is especially powerful when it is tied to a life event: buying a home (want zero existing debt for best loan eligibility), having a child, retirement planning, or a specific financial goal. Quantifying the monthly payment requirement turns a vague aspiration into an action plan.",
          "If the required payment is out of reach, the calculator also shows you the trade-off clearly: an extra ₹1,000/month might eliminate 6–8 months from the payoff date. Even small increments have a visible impact on the timeline.",
        ],
      },
      {
        heading: "Accelerating Debt Payoff: Practical Strategies",
        paragraphs: [
          "Lump-sum windfalls: Tax refunds, annual bonuses, Diwali bonuses, FD maturities — any lump sum applied to debt principal creates the same compounding benefit as a prepayment on a home loan. Use this calculator to quantify exactly how much time and interest a specific lump sum saves.",
          "Round-up payments: Instead of paying the minimum of ₹2,347, pay ₹2,500. The extra ₹153/month feels negligible but can shorten a 3-year loan by 2–3 months.",
          "Balance transfer: Moving high-rate debt (credit card at 36%) to a personal loan (12–15%) does not reduce the debt principal but dramatically reduces the interest burden — freeing up cash that accelerates payoff.",
          "The debt payoff calculator shows the exact impact of each strategy in months saved and interest avoided — helping you prioritize where your extra rupees have the most impact.",
        ],
      },
    ],
    tables: [
      {
        title: "Time to Debt Freedom — ₹80,000 Balance at 18% APR",
        columnHeaders: ["Monthly Payment", "Time to Pay Off", "Total Interest", "Interest Saved vs Min"],
        rows: [
          ["₹1,200 (min only, ~1.5%)", "~10+ years", "~₹64,000+", "—"],
          ["₹1,800/month", "~65 months", "₹37,000", "~₹27,000"],
          ["₹2,500/month", "~41 months", "₹22,500", "~₹41,500"],
          ["₹3,500/month", "~27 months", "₹14,500", "~₹49,500"],
          ["₹5,000/month", "~18 months", "₹10,000", "~₹54,000"],
          ["₹8,000/month (pay-fast)", "~11 months", "₹6,200", "~₹57,800"],
        ],
      },
      {
        title: "Required Monthly Payment to Meet Target Payoff Date — ₹80,000 at 18% APR",
        columnHeaders: ["Target Payoff", "Remaining Months", "Required EMI", "Total Interest"],
        rows: [
          ["1 year from now", "12 months", "₹7,332", "₹7,984"],
          ["18 months from now", "18 months", "₹5,146", "₹12,628"],
          ["2 years from now", "24 months", "₹4,003", "₹16,072"],
          ["3 years from now", "36 months", "₹2,890", "₹24,040"],
          ["4 years from now", "48 months", "₹2,327", "₹31,696"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Debt balance under different monthly payment levels",
      caption:
        "Higher payments create a much steeper decline in outstanding balance. Even a modest increase above the minimum has a dramatic compounding effect on payoff time. Use the calculator above to find your optimal payment level.",
    },
    faq: [
      {
        question: "What is the minimum payment I need to make to eventually pay off my debt?",
        answer:
          "The minimum required payment is slightly above the monthly interest charge: PMT_min = P × r + ε (any positive amount above pure interest). In practice, set your monthly payment at least 10% above the interest charge to make meaningful progress. For a ₹50,000 balance at 36% APR (₹1,500 monthly interest), pay at least ₹1,650–₹1,800/month as a floor.",
      },
      {
        question: "Should I make bi-weekly payments instead of monthly?",
        answer:
          "Bi-weekly payments (every 2 weeks) result in 26 half-payments per year = 13 full monthly payments instead of 12. The extra monthly payment per year shaves months off the payoff timeline and saves meaningful interest, especially for longer-tenure loans. Check if your lender accepts and properly credits bi-weekly payments.",
      },
      {
        question: "How much does a one-time lump-sum payment save compared to paying that same amount over time?",
        answer:
          "A lump-sum payment saves more than spreading the same amount because it reduces the principal immediately, cutting interest accrual from that day forward. The earlier in the debt's life, the bigger the advantage. Use the calculator to compare 'pay ₹10,000 today' vs 'pay ₹1,000/month extra for 10 months' on your specific balance and rate.",
      },
      {
        question: "What if I have multiple debts — should I use this calculator or the snowball/avalanche calculators?",
        answer:
          "This calculator is best for analyzing a single debt or understanding the general principle of payoff timing. For a multi-debt strategy comparing whether to prioritize the smallest balance (snowball) or highest rate (avalanche), use the dedicated Debt Snowball and Debt Avalanche calculators.",
      },
      {
        question: "Can I add new purchases while using this calculator?",
        answer:
          "This calculator assumes no new charges are added to the balance. If you continue spending on a credit card while trying to pay it off, use the month-end balance (after new purchases) as the input each month. The goal of a payoff plan is typically to stop new accumulation while aggressively paying down existing debt.",
      },
    ],
    meta: {
      seoTitle: "Debt Payoff Calculator — Time to Pay Off, Monthly Payment & Interest Saved",
      seoDescription:
        "Calculate how long to pay off any debt, the required monthly payment to meet a target date, and total interest saved by paying extra. Includes formula, worked examples, and payoff strategy guide.",
      keywords: [
        "debt payoff calculator",
        "loan payoff calculator",
        "how long to pay off debt",
        "monthly payment to payoff debt",
        "debt free date calculator",
        "credit card payoff time calculator",
        "interest saved paying extra",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "debt-snowball-calculator": {
    slug: "debt-snowball-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. The Debt Snowball method prioritizes psychological wins over mathematical optimality. Total interest paid is typically higher than the Debt Avalanche method — but completion rates are higher.",
    sections: [
      {
        heading: "What Is the Debt Snowball Method?",
        paragraphs: [
          "The Debt Snowball method, popularized by personal finance author Dave Ramsey, is a debt repayment strategy where you pay minimums on all debts except the one with the smallest outstanding balance — on which you throw every available extra rupee. When that smallest debt is cleared, you 'roll' the freed-up payment (what you were paying on the cleared debt) to the next-smallest debt, creating a growing 'snowball' of monthly payment power.",
          "The core insight is behavioral, not mathematical: winning early — seeing a debt disappear completely — generates motivation, confidence, and momentum that keeps people on track long enough to become debt-free. Research in behavioral economics (Ariely, Amar et al.) supports this: the psychological boost from small wins significantly improves completion rates compared to purely optimal strategies.",
          "The snowball does not minimize total interest paid (the Debt Avalanche does that). But a strategy you actually follow through to completion beats a mathematically optimal strategy you abandon halfway. Both approaches are significantly better than paying minimums indefinitely.",
        ],
      },
      {
        heading: "How the Debt Snowball Works: Step by Step",
        paragraphs: [
          "Step 1 — List all debts from smallest to largest outstanding balance. Interest rates do not factor into the order.",
          "Step 2 — Pay the minimum payment on every debt except the smallest. On the smallest debt, pay the minimum PLUS all your extra available monthly payment budget.",
          "Step 3 — When the smallest debt is paid off, take the payment you were making on it (minimum + extra) and add it to the minimum payment on the now-smallest remaining debt. Your total monthly debt payment stays the same — it just all concentrates on the new target.",
          "Step 4 — Repeat until all debts are cleared. The freed-up payment 'snowballs' — growing larger with each debt eliminated, accelerating the payoff of subsequent debts.",
          "The key: your total monthly payment amount stays constant throughout. You are not paying more each month — you are concentrating payment power more effectively as each debt is cleared.",
        ],
      },
      {
        heading: "Worked Example: Three Debts, Snowball Strategy",
        paragraphs: [
          "Starting debts: Debt 1 — ₹8,000 credit card at 36% APR (minimum ₹400/month). Debt 2 — ₹25,000 personal loan at 18% APR (minimum ₹800/month). Debt 3 — ₹60,000 car loan at 10% APR (minimum ₹1,800/month). Total minimum payments = ₹3,000/month. Extra budget = ₹2,000/month. Total monthly payment = ₹5,000.",
          "Snowball order: Debt 1 (₹8,000) → Debt 2 (₹25,000) → Debt 3 (₹60,000).",
          "Debt 1: Pay ₹400 (min) + ₹2,000 (extra) = ₹2,400/month. Payoff: 4 months. Freed payment: ₹2,400.",
          "Debt 2: Now pay ₹800 (min) + ₹2,400 (freed from Debt 1) = ₹3,200/month. Outstanding when Debt 1 cleared ≈ ₹21,620. Payoff from month 5: 8 more months. Freed payment: ₹3,200 + ₹800 = ₹4,000 total.",
          "Debt 3: Now pay ₹1,800 + ₹4,000 freed = ₹5,800/month. Outstanding ≈ ₹51,200. Payoff: 10 more months. Total timeline: 4 + 8 + 10 = 22 months to fully debt-free. Compare to minimum-only: 28+ months (Debt 1 alone takes 22+ months at minimum).",
        ],
      },
      {
        heading: "Snowball vs Avalanche: The Real-World Comparison",
        paragraphs: [
          "Mathematical difference: For the example above, the Debt Avalanche (highest rate first, Debt 1 then Debt 2 then Debt 3) also targets Debt 1 first since it has the highest rate AND smallest balance — so in this specific case, both methods are identical. The methods diverge most when the highest-rate debt also has a large balance.",
          "When they diverge: If Debt 1 were ₹8,000 at 18% and Debt 2 were ₹25,000 at 36%: Snowball still attacks Debt 1 first (smallest balance). Avalanche attacks Debt 2 first (highest rate). Avalanche saves ~₹1,500–3,000 in total interest but delivers a win 8 months later. Choose based on your psychology: need early wins → Snowball; disciplined and focused on minimizing cost → Avalanche.",
          "Hybrid approach: Use the Snowball to eliminate 1–2 small debts quickly for momentum, then switch to Avalanche logic for the remaining larger debts. This 'Snowlanche' balances motivation and mathematical efficiency.",
        ],
      },
      {
        heading: "Tracking Progress and Staying Motivated",
        paragraphs: [
          "Visual debt tracking significantly improves follow-through. Use a debt tracking sheet or app where you color in each paid-off segment — research shows that visual progress indicators reduce abandonment by 30–40%.",
          "Celebrate each debt payoff — not with spending (which undermines the goal), but with recognition. Tell your accountability partner. Update your net worth tracker. The celebration reinforces the habit loop that keeps the snowball rolling.",
          "Monthly check-in: Update balances, confirm minimum payments, and recalculate the snowball schedule if your circumstances have changed. Irregular income (bonus month, extra freelance income) should trigger an ad-hoc lump-sum payment on the current target debt.",
        ],
      },
    ],
    tables: [
      {
        title: "Debt Snowball Example — 3 Debts, ₹5,000 Total Monthly Payment",
        columnHeaders: ["Debt", "Balance", "Rate", "Minimum", "Snowball Target Month", "Cleared By Month"],
        rows: [
          ["Debt 1 (Credit Card)", "₹8,000", "36% APR", "₹400", "1 (first target)", "Month 4"],
          ["Debt 2 (Personal Loan)", "₹25,000", "18% APR", "₹800", "5 (after Debt 1 cleared)", "Month 12"],
          ["Debt 3 (Car Loan)", "₹60,000", "10% APR", "₹1,800", "13 (after Debt 2 cleared)", "Month 22"],
          ["Total (Snowball)", "₹93,000", "—", "₹3,000", "Extra: ₹2,000/month", "22 months"],
        ],
      },
      {
        title: "Snowball vs Minimums Only — Total Cost Comparison",
        columnHeaders: ["Strategy", "Time to Debt-Free", "Total Interest Paid", "Interest Saved"],
        rows: [
          ["Minimum payments only", "35+ months", "~₹28,500", "—"],
          ["Snowball (₹2,000 extra/month)", "22 months", "~₹18,200", "~₹10,300"],
          ["Avalanche (₹2,000 extra/month)", "22 months", "~₹16,800", "~₹11,700"],
          ["Snowball with ₹4,000 extra/month", "15 months", "~₹12,100", "~₹16,400"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Total debt balance declining under the Snowball strategy",
      caption:
        "The total balance drops slowly at first (only one debt receiving extra payments), then accelerates as freed payments snowball into larger and larger monthly assaults on remaining balances.",
      sparkValues: [93, 88, 83, 77, 65, 51, 36, 19, 5, 0],
    },
    faq: [
      {
        question: "Why does the Debt Snowball ignore interest rates?",
        answer:
          "Intentionally. The method prioritizes psychological wins (quick early payoffs) over mathematical optimality. Dave Ramsey's philosophy is that personal finance is 80% behavior and 20% math — and the behavior of staying motivated matters more than saving the last few percent of interest. If you are highly disciplined, Avalanche saves more. If you need wins to stay the course, Snowball wins.",
      },
      {
        question: "What counts as the 'minimum payment' in the Snowball method?",
        answer:
          "The minimum payment is whatever your lender requires to keep the account in good standing — typically 2–5% of the balance for credit cards, or the fixed EMI for installment loans. In the Snowball, you pay exactly this minimum on all non-target debts — not a rupee more, not a rupee less.",
      },
      {
        question: "Should I include my home loan in the Debt Snowball?",
        answer:
          "Dave Ramsey's original method includes the home loan as the last step (Baby Step 6). However, many financial advisors in India suggest not rushing home loan prepayment if the rate is low (8–9%) and you have higher-rate debts, tax benefits (Section 24), and better investment alternatives. Focus Snowball on non-secured, higher-rate debt first.",
      },
      {
        question: "What if I cannot afford more than the minimum on all debts?",
        answer:
          "That is a serious situation requiring a different approach — either debt consolidation (combine all debts into a single lower-rate loan), negotiation with lenders for rate reduction, or formal debt counselling. The Snowball assumes you have some extra monthly payment capacity above the sum of all minimums.",
      },
      {
        question: "Can I switch from Snowball to Avalanche mid-plan?",
        answer:
          "Yes. Once you have cleared a few small debts and built confidence, switching to Avalanche for the remaining larger, higher-rate debts is a mathematically optimal upgrade. The transition costs nothing — just reorder your target debts by rate instead of balance.",
      },
    ],
    meta: {
      seoTitle: "Debt Snowball Calculator — Pay Off Debt Fastest with Psychological Wins",
      seoDescription:
        "Calculate your debt-free date using the Debt Snowball method. See the snowball effect in action, compare with minimum payments, and get a month-by-month payoff plan.",
      keywords: [
        "debt snowball calculator",
        "dave ramsey debt snowball",
        "debt snowball method",
        "debt snowball vs avalanche",
        "debt payoff order calculator",
        "snowball debt repayment plan",
        "fastest way to pay off debt",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "debt-avalanche-calculator": {
    slug: "debt-avalanche-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. The Debt Avalanche minimizes total interest paid. Results assume consistent extra payments each month and no new debt accumulation.",
    sections: [
      {
        heading: "What Is the Debt Avalanche Method?",
        paragraphs: [
          "The Debt Avalanche is the mathematically optimal debt repayment strategy. Like the Snowball, you pay minimums on all debts — but instead of targeting the smallest balance next, you concentrate all extra payment power on the debt with the highest interest rate. Once the highest-rate debt is cleared, the freed payment rolls to the next-highest-rate debt, creating an 'avalanche' that buries your debt in the shortest possible time and at the lowest total interest cost.",
          "The mathematical proof is straightforward: since interest accrues proportionally to the outstanding balance and the rate, reducing the balance of the highest-rate debt first reduces your total interest accumulation at the fastest rate. No other ordering minimizes total interest paid for a given monthly budget.",
          "The trade-off vs. Snowball: the Avalanche's first payoff may take longer (if the highest-rate debt is also a large balance). This delay can erode motivation for some people. Research suggests the Avalanche is best for disciplined, analytically-oriented individuals; the Snowball is better for those who need early wins to maintain momentum.",
        ],
      },
      {
        heading: "Debt Avalanche: Step-by-Step Process",
        paragraphs: [
          "Step 1 — List all debts ranked from highest to lowest interest rate. Balances and loan types are irrelevant to the order — only the APR matters.",
          "Step 2 — Pay the minimum required payment on every debt. This keeps all accounts current and prevents defaults.",
          "Step 3 — Direct all extra monthly payment budget to the highest-rate debt. Pay nothing extra to other debts until the target is cleared.",
          "Step 4 — When the highest-rate debt is paid off, its full payment amount (minimum + extra) rolls to the next-highest-rate debt. Your total monthly payment remains constant — only the concentration changes.",
          "Step 5 — Continue until debt-free. The 'avalanche' gains momentum with each cleared debt, just as with the Snowball — the difference is purely in the ordering.",
        ],
      },
      {
        heading: "Worked Example: Same Debts, Avalanche Order",
        paragraphs: [
          "Same starting debts as the Snowball example — Debt 1: ₹8,000 at 36% APR (min ₹400). Debt 2: ₹25,000 at 18% APR (min ₹800). Debt 3: ₹60,000 at 10% APR (min ₹1,800). Extra budget: ₹2,000/month.",
          "Avalanche order: Debt 1 (36%) → Debt 2 (18%) → Debt 3 (10%). In this case, the Avalanche and Snowball orders are identical because Debt 1 has both the highest rate AND the smallest balance. Payoff timeline is the same: 22 months.",
          "Where Avalanche diverges: Change Debt 1 to ₹40,000 at 36%, keeping others the same. Snowball would target ₹25,000 (Debt 2, smallest balance). Avalanche targets ₹40,000 (Debt 1, highest rate). Avalanche: Debt 1 cleared in ~15 months (not 4), but total interest over all 3 debts ≈ ₹24,000. Snowball: Total interest ≈ ₹28,500. Avalanche saves ₹4,500 but your first win comes at month 15 vs month 8 (Snowball's Debt 2 cleared). Cost of psychological momentum: ₹4,500 saved.",
        ],
      },
      {
        heading: "Calculating the Exact Interest Saved: Avalanche vs Snowball",
        paragraphs: [
          "The interest savings from Avalanche over Snowball come entirely from paying off high-rate debt faster, which reduces the daily interest accrual on that debt sooner.",
          "For any set of debts, the Avalanche-Snowball interest gap depends on: (1) how different the rates are — larger rate spreads mean bigger savings from Avalanche, (2) how large the high-rate balances are relative to low-rate ones — if high rate = large balance, Avalanche advantage is maximum, (3) your extra payment budget — more extra payment → faster clearance → less time for rate differences to compound → smaller absolute difference between methods.",
          "As a rule of thumb: if your highest-rate debt carries a rate 10%+ above your lowest-rate debt AND has a large balance, the Avalanche saves materially more. If all rates are within 5% of each other, the method choice matters far less than the total payment amount.",
        ],
      },
      {
        heading: "Hybrid Approach: When to Combine Snowball and Avalanche",
        paragraphs: [
          "The 'Snowlanche' hybrid: Use Snowball logic for debts under ₹10,000 (small enough to clear quickly for motivation) and Avalanche logic for larger debts above that threshold. This gives you early wins without sacrificing the rate-optimization benefits for the larger, more expensive portion of your debt.",
          "Another hybrid approach: Start with Avalanche for 3–6 months. If you lose motivation because no debt has been fully paid off, switch to Snowball for one quick win, then return to Avalanche. This is a pragmatic response to observed behavioral patterns.",
          "The most important principle: any method executed consistently beats the best method executed sporadically. If Avalanche requires a spreadsheet you check once a month and Snowball is simple enough to follow automatically, Snowball might produce better real-world results for your personality.",
        ],
      },
    ],
    tables: [
      {
        title: "Debt Avalanche vs Snowball: Key Differences",
        columnHeaders: ["Dimension", "Debt Avalanche", "Debt Snowball"],
        rows: [
          ["Target selection", "Highest interest rate first", "Smallest balance first"],
          ["Mathematical optimality", "Minimizes total interest", "Sub-optimal (higher total interest)"],
          ["First payoff timing", "Potentially longer (if high-rate = large balance)", "Faster (smallest balance clears quickest)"],
          ["Psychological impact", "Delayed gratification; requires discipline", "Early wins; higher motivation & completion rates"],
          ["Best for", "Disciplined, analytically focused individuals", "Those who need momentum to stay on track"],
          ["Total interest saved vs minimums", "Maximum saving", "Slightly less than Avalanche"],
        ],
      },
      {
        title: "Avalanche Payoff Schedule: ₹8K @ 36%, ₹25K @ 18%, ₹60K @ 10% — ₹5,000/month Total",
        columnHeaders: ["Month Range", "Target Debt", "Target Balance Start", "Monthly to Target", "Cleared By"],
        rows: [
          ["Months 1–4", "Debt 1 (36%)", "₹8,000", "₹400 min + ₹2,000 extra = ₹2,400", "End of Month 4"],
          ["Months 5–12", "Debt 2 (18%)", "~₹21,620", "₹800 min + ₹2,400 freed = ₹3,200", "End of Month 12"],
          ["Months 13–22", "Debt 3 (10%)", "~₹51,200", "₹1,800 min + ₹3,200 freed = ₹5,000", "End of Month 22"],
          ["Total", "All 3 debts", "₹93,000", "₹5,000/month constant", "22 months debt-free"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Total interest accrued: Avalanche vs Snowball over time (illustrative)",
      caption:
        "The Avalanche method cuts into the highest-accruing debt first, causing total interest to taper faster in early months. The Snowball's interest curve is slightly higher. Both dramatically beat minimum-payment strategies.",
      sparkValues: [18, 15, 12, 9, 7, 5, 3, 1.5, 0.5, 0],
    },
    faq: [
      {
        question: "Does the Debt Avalanche always save the most money?",
        answer:
          "Yes — mathematically, the Avalanche always minimizes total interest paid for a given monthly payment amount, regardless of the specific debts or rates. However, the saving over Snowball may be modest if your debts have similar interest rates or if your extra payment budget is large relative to total debt.",
      },
      {
        question: "What if two debts have the same interest rate?",
        answer:
          "If two debts share the same APR, use balance as the tiebreaker — target the smaller one first. The mathematical difference is negligible, but clearing the smaller one faster frees up payment power sooner, which helps the larger same-rate debt.",
      },
      {
        question: "I have a home loan at 8.5% and a personal loan at 14%. Should I use Avalanche?",
        answer:
          "Yes — Avalanche says clear the 14% personal loan before making extra payments on the 8.5% home loan. The 5.5% rate difference represents a guaranteed, risk-free return differential. Once the personal loan is cleared, you can consider extra home loan prepayments — but still compare against investment alternatives at 8.5%+ post-tax.",
      },
      {
        question: "How long does it typically take to become debt-free using the Avalanche?",
        answer:
          "Depends on total debt size, interest rates, and extra payment budget. A rough rule: with an extra payment equal to 10–15% of total debt per year, you can typically clear consumer debt in 3–5 years. The Avalanche calculator on this page shows the exact timeline for your specific numbers.",
      },
      {
        question: "Should I include my home loan EMI in my total minimum payments for the Avalanche?",
        answer:
          "For the purpose of debt management strategy: list your home loan as one of the debts. If it has the lowest rate (which home loans usually do), it will be the last target in the Avalanche — you pay only minimums on it while clearing all higher-rate debts first. Once higher-rate debts are gone, the freed cash can accelerate home loan prepayment.",
      },
    ],
    meta: {
      seoTitle: "Debt Avalanche Calculator — Minimize Interest with the Optimal Payoff Strategy",
      seoDescription:
        "Calculate your debt-free date using the mathematically optimal Debt Avalanche method. Compare with Debt Snowball, see total interest saved, and get a month-by-month payoff plan.",
      keywords: [
        "debt avalanche calculator",
        "debt avalanche method",
        "debt avalanche vs snowball",
        "highest interest debt first",
        "optimal debt payoff calculator",
        "minimize total interest debt",
        "debt avalanche plan calculator india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
