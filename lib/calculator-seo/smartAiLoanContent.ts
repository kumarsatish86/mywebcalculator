import type { RichArticle } from "./types";

const HUB_HREF = "/finance/loans-emi/smart-ai-loan-tools";
const HUB_LABEL = "Finance · Smart & AI Loan Tools";

const SHELL =
  "Runs entirely in your browser using rule-based logic — not a live AI or chat service. Results are planning estimates, not financial advice. Consult a licensed financial advisor before making borrowing decisions.";

export const SMART_AI_LOAN_ARTICLES: Record<string, RichArticle> = {
  "smart-loan-advisor-ai-based": {
    slug: "smart-loan-advisor-ai-based",
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [
      {
        heading: "What Is the Smart Loan Advisor and What Does 'AI-Based' Mean Here?",
        paragraphs: [
          "The Smart Loan Advisor applies the same affordability rules that banks, HFCs, and NBFCs use when evaluating loan applications — codified as transparent, deterministic logic running entirely in your browser. The 'AI-based' label refers to the intelligent, adaptive recommendations (tips calibrated to your specific DTI situation) rather than a live AI or language model service. No data is sent to any server; no API calls are made.",
          "The core metric is DTI (Debt-to-Income Ratio): the percentage of your gross monthly income that goes to total debt obligations — existing EMIs plus the proposed new EMI. DTI is used by lenders globally to assess repayment capacity. In India, the equivalent term is FOIR (Fixed Obligation to Income Ratio); in the US, DTI is the standard CFPB-compliant metric; in the UK, lenders use Income Multiple and stress-tested affordability calculations.",
          "Enter your gross monthly income, your existing monthly debt obligations (all current EMIs and fixed debt payments), your proposed loan amount, the interest rate, and the tenure. The tool computes the proposed EMI, your new total DTI (existing debt + new EMI as a % of income), and maps that to a verdict band from Strong through High Risk.",
        ],
      },
      {
        heading: "DTI Verdict Bands — What Each Level Means",
        paragraphs: [
          "Strong (DTI ≤ 30%): Your total debt obligations would consume 30% or less of gross income. This is the lender's 'green zone.' Most lenders approve candidates in this range without additional conditions, and you typically qualify for the best rates. You have meaningful headroom for emergencies, savings, and discretionary spending. This is the target zone for conservative financial planning.",
          "Manageable (DTI 30–36%): Debt-to-income is moderate. Most mainstream lenders still approve in this range, though some may add conditions (additional documentation, co-applicant, or lower sanctioned amount). Your financial position is not stressed, but leaves less room for income shocks. Consider whether you have adequate emergency savings before borrowing at the top of this band.",
          "Stretched (DTI 36–43%): Approaching lender limits. Many banks cap FOIR/DTI at 40–45%. At this level, a 10–15% income reduction (job change, variable pay dip) would push your actual debt burden to uncomfortable levels. Lenders may decline, require a co-applicant with strong income, or offer a lower sanction amount. Borrowing at this DTI level is technically possible but financially risky without strong income certainty.",
          "High Risk (DTI > 43%): Total debt obligations would exceed 43% of gross income with the proposed loan. Most lenders decline applications at this level. Even those that approve (often at higher rates) are taking on elevated credit risk, which translates to higher borrowing cost for you. Before proceeding, reduce existing debt, increase income, lower the loan amount, extend the tenure to reduce EMI, or delay the loan until your financial position strengthens.",
        ],
      },
      {
        heading: "Worked Example: ₹1 Lakh Monthly Income, ₹15K Existing Debt, ₹25 Lakh Loan",
        paragraphs: [
          "Inputs: Gross monthly income = ₹1,00,000. Existing monthly debt = ₹15,000 (car loan EMI). Proposed loan = ₹25,00,000 at 8.5% for 20 years. Proposed EMI = ₹21,696/month.",
          "DTI calculation: (Existing ₹15,000 + New EMI ₹21,696) ÷ Income ₹1,00,000 = 36,696 ÷ 1,00,000 = 36.7%. Verdict: Stretched.",
          "Tips generated at Stretched level: (1) The ₹25L loan is technically possible but leaves only ₹63,304/month for taxes, living expenses, savings, and unexpected costs. (2) Consider prepaying the car loan first — eliminating the ₹15,000 existing debt would drop DTI to 21.7% (Strong), making the home loan application much stronger. (3) Alternatively, add a co-applicant (spouse with income) to reduce the effective DTI on a joint application.",
          "What changes at different income levels: At ₹80,000 income: DTI = 45.9% — High Risk (likely decline). At ₹1,20,000 income: DTI = 30.6% — Manageable (solid approval odds). Income vs debt is a lever borrowers often underestimate — modest income growth or debt reduction dramatically changes the verdict.",
        ],
      },
      {
        heading: "How to Improve Your Verdict Before Applying",
        paragraphs: [
          "Reduce existing debt first: Every rupee of existing EMI you eliminate before applying has a 1:1 impact on DTI. Foreclosing a small personal loan (₹5,000/month EMI) can shift your verdict from Stretched to Manageable on a large home loan. Use this tool to experiment: set 'Existing monthly debt' to 0 or to a reduced amount to see what your DTI would be post-closure.",
          "Increase income documentation: DTI is calculated on verified income, not just salary. If you have rental income, freelance income, or an LOP (Letter of Possession) with promised rent, document these and discuss with the lender. Many lenders accept 50–70% of rental income as co-income. Spouses or parents as co-applicants add their income to the denominator, directly improving DTI.",
          "Lower the loan amount: Reducing the proposed principal is the most direct lever. Each ₹1 lakh reduction in loan amount reduces EMI by approximately ₹868/month (for 8.5%, 20 years). Reducing the ask from ₹25L to ₹22L saves ~₹2,600/month in EMI — potentially shifting the verdict band.",
          "Extend the tenure: A longer tenure reduces the EMI (and thus DTI) but increases total interest. This is a cash-flow trade-off, not a financial optimization. Use it to clear the DTI hurdle for approval, then make prepayments to reduce the effective tenure once the loan is sanctioned. Extending from 20 to 25 years drops EMI from ₹21,696 to ₹20,057 — a saving of ₹1,639/month in DTI calculation.",
          "Time the application: If you are expecting a salary hike, bonus, or increment in 3–6 months, apply after the income increases. A 20% salary hike changes the income base, dropping DTI proportionally. Also, pay off any credit card outstanding before the application — banks check your CIBIL statement for running balances, and a high utilization signals financial stress.",
        ],
      },
      {
        heading: "DTI vs FOIR vs EMI Affordability — Understanding Lender Metrics",
        paragraphs: [
          "In India, banks typically cap FOIR (Fixed Obligation to Income Ratio) at 40–50% of net (take-home) income, not gross income. This differs from the DTI this tool uses (gross income). Net income is typically 75–85% of gross for salaried employees after PF, professional tax, and TDS. If your gross is ₹1,00,000 and net (take-home) is ₹80,000, the bank's 50% FOIR cap allows ₹40,000 in total EMIs — not ₹50,000. Always check whether your lender uses gross or net income for the FOIR limit.",
          "In the US, the standard is 'front-end DTI' (housing expenses / gross income, ideally ≤28%) and 'back-end DTI' (all debt / gross income, ideally ≤43%). For Qualified Mortgages under CFPB rules, the back-end DTI cap is 43%. FHA loans allow up to 57% DTI in some cases.",
          "In the UK, lenders use 'income multiples' (loan ÷ annual income, typically 4–5x) combined with an affordability stress test (can you afford payments at the current rate + 3%?). These are structurally different from DTI but serve the same purpose: ensuring borrowers can service debt under adverse conditions.",
        ],
      },
    ],
    tables: [
      {
        title: "DTI Verdict Bands with Real-World Implications",
        columnHeaders: ["DTI Range", "Verdict", "Lender Stance", "Financial Safety", "Recommended Action"],
        rows: [
          ["≤ 30%", "Strong", "Easy approval, best rates", "Excellent — large buffer", "Proceed; consider shorter tenure to save interest"],
          ["30–36%", "Manageable", "Standard approval, competitive rates", "Good — moderate buffer", "Proceed; maintain emergency fund ≥ 6 months"],
          ["36–43%", "Stretched", "Conditional approval; some lenders decline", "Moderate — limited buffer", "Reduce existing debt or add co-applicant first"],
          ["> 43%", "High Risk", "Most lenders decline; sub-prime rates if approved", "Poor — high income-shock risk", "Do not proceed; restructure before borrowing"],
        ],
      },
      {
        title: "How Income and Existing Debt Affect Verdict — ₹25 Lakh Loan @ 8.5%, 20 Years (EMI ₹21,696)",
        columnHeaders: ["Gross Income (₹)", "Existing Debt (₹/month)", "Total Obligations (₹)", "DTI", "Verdict"],
        rows: [
          ["80,000", "0", "21,696", "27.1%", "Strong"],
          ["80,000", "10,000", "31,696", "39.6%", "Stretched"],
          ["80,000", "15,000", "36,696", "45.9%", "High Risk"],
          ["1,00,000", "15,000", "36,696", "36.7%", "Stretched"],
          ["1,20,000", "15,000", "36,696", "30.6%", "Manageable"],
          ["1,50,000", "15,000", "36,696", "24.5%", "Strong"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "DTI improves as income grows or existing debt is eliminated",
      caption: "Paying down existing debt before applying has the same DTI impact as an income increase. Each bar represents a scenario — lower DTI shifts the verdict toward Strong.",
      sparkValues: [0.72, 0.63, 0.55, 0.46, 0.37, 0.28, 0.21],
    },
    faq: [
      {
        question: "Is this connected to ChatGPT, any bank's AI, or an external service?",
        answer:
          "No. This tool uses deterministic, rule-based logic coded into the browser application — no API calls, no external services, no data transmission. The 'AI-based' label reflects the intelligent, adaptive recommendations that respond to your specific inputs rather than generic output. Everything runs locally in your browser session and is cleared when you close the tab.",
      },
      {
        question: "What should I enter as 'existing monthly debt'?",
        answer:
          "Enter the total of ALL current fixed monthly debt obligations: home loan EMI, car loan EMI, personal loan EMI, education loan EMI, credit card minimum payments, and any other fixed debt repayment. Do not include rent (not a debt obligation), living expenses, or insurance premiums. If you have a credit card with ₹50,000 outstanding that you are revolving, include the minimum payment amount (typically 5% of outstanding = ₹2,500). Your bank will pull your CIBIL report and see all active obligations — this tool's output is only as accurate as the inputs you provide.",
      },
      {
        question: "My DTI shows 'Stretched' but I know I can afford it — should I still proceed?",
        answer:
          "A Stretched verdict is a caution signal, not an automatic no. People with stable government jobs, strong future income visibility, or substantial other assets sometimes reasonably borrow at 36–43% DTI. The risk is asymmetric: if income drops 15–20% (job change, health emergency, pay cut), a Stretched DTI becomes an unmanageable burden fast. The tool recommends improving DTI before borrowing. If you choose to proceed anyway, ensure you have at least 6 months of EMI + expenses in liquid emergency savings as a buffer.",
      },
      {
        question: "Does this tool account for taxes on income?",
        answer:
          "No — it uses the gross income figure you enter. Indian lenders assess FOIR on net (take-home) income in practice, not gross. For a more conservative estimate, enter your monthly take-home (post-TDS, PF, and professional tax) instead of CTC-derived gross income. A typical ₹12 LPA CTC might yield ₹80,000–₹85,000 monthly take-home — quite different from ₹1,00,000 gross. Using net income makes this tool's verdict align more closely with what your bank will actually calculate.",
      },
      {
        question: "What is a good DTI to target before applying for a home loan?",
        answer:
          "Target a DTI below 36% (including the proposed home loan EMI) for the best combination of approval probability and rate. Below 30% is ideal — it signals strong financial health, unlocks the most competitive rates, and leaves room for life's uncertainties. If adding the home loan EMI pushes you above 36%, consider: (a) making a larger down payment to reduce the loan amount, (b) closing a smaller existing loan before applying, (c) adding a co-applicant, or (d) waiting and saving until your income grows. Do not let urgency pressure you into a financially stretched home loan — the monthly burden lasts 20–25 years.",
      },
    ],
    meta: {
      seoTitle: "Smart Loan Advisor — DTI Affordability Check, Verdict Bands & Tips | mywebcalculator",
      seoDescription:
        "Rule-based loan affordability advisor: enter income, existing debt, and proposed loan to get a DTI verdict (Strong to High Risk) with actionable tips. Browser-only, no data sent externally.",
      keywords: [
        "smart loan advisor",
        "loan affordability calculator india",
        "dti loan calculator",
        "foir calculator india",
        "loan eligibility calculator",
        "debt to income ratio calculator india",
        "can i afford a home loan",
        "loan approval chances calculator",
        "emi affordability check",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "best-emi-plan-generator": {
    slug: "best-emi-plan-generator",
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [
      {
        heading: "What Is an EMI Plan and Why Choosing Tenure Is the Most Important Decision",
        paragraphs: [
          "An EMI plan is the combination of a loan amount, interest rate, and tenure that determines your monthly payment and total interest cost. For any given principal and rate, the tenure is the one variable entirely within your control — and it is the single most powerful lever you have over total loan cost.",
          "The EMI plan generator compares multiple standard tenures (typically 5, 7, 10, 15, 20, 25, and 30 years) for your loan amount and rate, and recommends the plan with the lowest total interest that still fits within your specified maximum affordable EMI. If you leave the max EMI field blank, it simply ranks all tenures by total interest cost and recommends the shortest one.",
          "The fundamental trade-off: shorter tenure = higher monthly EMI but dramatically lower total interest; longer tenure = lower monthly EMI but far more paid in total. The 'best' plan is the one that maximises savings within your cash flow constraint — and that is exactly what this tool identifies.",
        ],
      },
      {
        heading: "How the Generator Evaluates and Ranks EMI Plans",
        paragraphs: [
          "Step 1 — Generate plans: For each standard tenure (5, 7, 10, 15, 20, 25, 30 years), the tool computes the standard EMI using the reducing-balance formula and the total interest over the full tenure.",
          "Step 2 — Apply budget filter: If you entered a maximum affordable EMI, the tool marks any tenure as 'over budget' if its EMI exceeds your maximum. Tenures within budget are eligible; those over budget are shown for comparison but not recommended.",
          "Step 3 — Select the best: Among eligible (within-budget) plans, the tool recommends the one with the lowest total interest — which is always the shortest eligible tenure. Shorter tenures have lower total interest by definition because interest accrues for fewer months.",
          "Step 4 — Show the full comparison: All tenures are displayed with their EMI and total interest, allowing you to see the full trade-off table and make an informed decision. Plans marked 'over budget' show what you could save in interest if you could stretch your monthly payment.",
        ],
      },
      {
        heading: "Worked Example: ₹25 Lakh Loan at 8.5%",
        paragraphs: [
          "Loan: ₹25,00,000 at 8.5% p.a. Comparison across standard tenures:",
          "5 years: EMI = ₹51,330/month. Total interest = ₹8,00,000. 10 years: EMI = ₹30,935/month. Total interest = ₹12,12,200. 15 years: EMI = ₹24,641/month. Total interest = ₹19,35,380. 20 years: EMI = ₹21,696/month. Total interest = ₹27,07,040. 25 years: EMI = ₹20,057/month. Total interest = ₹35,17,100. 30 years: EMI = ₹19,224/month. Total interest = ₹44,20,640.",
          "If Max Affordable EMI = ₹25,000: The 5-year and 10-year tenures are over budget (EMIs ₹51,330 and ₹30,935). The 15-year plan (EMI ₹24,641) is the shortest eligible tenure — recommended. Total interest = ₹19,35,380 vs ₹44,20,640 for 30 years — a saving of ₹24,85,260 simply by choosing the right tenure.",
          "The cost of a 'comfortable EMI': Moving from 15 years (recommended at ₹24,641) to 20 years (seemingly similar EMI at ₹21,696) saves ₹2,945/month but costs ₹7,71,660 more in total interest over the longer term. That ₹2,945/month EMI difference would need to be invested at a sustained 12%+ p.a. to outperform the interest saving — a high bar.",
        ],
      },
      {
        heading: "How to Set Your Maximum Affordable EMI Correctly",
        paragraphs: [
          "The maximum affordable EMI is not the same as the maximum EMI a lender will approve. It is the amount you can comfortably pay every month for years without depleting savings, skipping investments, or being vulnerable to income disruption.",
          "Rule of thumb: Your total EMI obligations (all loans) should not exceed 35–40% of your net monthly take-home income, with the target closer to 30% for a financially resilient position. If your take-home is ₹80,000 and you have an existing ₹10,000 car loan EMI, your comfortable home loan EMI budget is approximately 30% × ₹80,000 − ₹10,000 = ₹14,000. This is much lower than what a lender might approve (typically 45–50% of net income).",
          "Include the future: Your EMI budget should account for upcoming expenses — school fees starting in 2 years, aging parent medical costs, vehicle replacement, or a planned second child. EMI obligations lock in a fixed cost for 10–20 years; life changes around them. Conservative EMI budgeting is not timidity — it is the difference between a loan that builds wealth and one that causes financial anxiety for decades.",
          "Test the stress: Before locking in a tenure, ask: 'If my income dropped 20% tomorrow, could I still afford this EMI?' If the answer is no, choose a longer tenure (lower EMI) and plan to make prepayments when cash flow allows. Flexible burden management is better than tight budget management.",
        ],
      },
      {
        heading: "The Interest Cost of Tenure Decisions — Quantifying What You Give Up",
        paragraphs: [
          "Every year of additional tenure on a ₹25 lakh home loan at 8.5% costs approximately ₹2.5–3 lakh in additional interest. Over 30 years vs 15 years, the additional cost is ₹24.85 lakh — almost as much as the original loan. These numbers are not hypothetical: they are the mathematical consequence of every borrower who chooses a longer tenure for a lower EMI.",
          "The 'it's only ₹2,000 more per month' trap: When comparing the 20-year EMI (₹21,696) to the 15-year EMI (₹24,641), the ₹2,945 difference feels modest. But ₹2,945/month × 60 months (the 5 additional years of the 20-year plan vs 15) = ₹1,76,700 in extra EMI payments — plus ₹7.7 lakh in additional interest. The 'small monthly difference' compounds into a large total cost.",
          "Best practice: Use this generator to find the recommended plan (shortest tenure within budget), then commit to making prepayments of at least ₹10,000–25,000/year to further shorten the effective tenure. Even small, consistent prepayments can reduce a 15-year effective tenure to 12–13 years, saving an additional ₹3–5 lakh in interest.",
        ],
      },
    ],
    tables: [
      {
        title: "Full EMI Plan Comparison — ₹25,00,000 @ 8.5% Across All Standard Tenures",
        columnHeaders: ["Tenure", "Monthly EMI (₹)", "Total Interest (₹)", "Total Paid (₹)", "Interest as % of Principal", "Eligible if Max EMI ₹25,000?"],
        rows: [
          ["5 years", "51,330", "8,00,000", "33,00,000", "32%", "Over budget"],
          ["7 years", "39,630", "10,24,920", "35,24,920", "41%", "Over budget"],
          ["10 years", "30,935", "12,12,200", "37,12,200", "48%", "Over budget"],
          ["15 years", "24,641", "19,35,380", "44,35,380", "77%", "✓ Recommended"],
          ["20 years", "21,696", "27,07,040", "52,07,040", "108%", "✓ In budget"],
          ["25 years", "20,057", "35,17,100", "60,17,100", "141%", "✓ In budget"],
          ["30 years", "19,224", "44,20,640", "69,20,640", "177%", "✓ In budget"],
        ],
      },
      {
        title: "Interest Savings from Choosing the Recommended Tenure vs Longest Available — ₹25L @ 8.5%",
        columnHeaders: ["Max EMI Budget (₹)", "Recommended Tenure", "Interest (₹)", "vs 30-Year Saving (₹)", "Monthly EMI Gap vs 30yr (₹)", "Interest Saving per ₹ of Extra Monthly EMI"],
        rows: [
          ["20,000", "30 years", "44,20,640", "—", "—", "—"],
          ["22,000", "25 years", "35,17,100", "9,03,540", "+833", "₹10.85 saved per ₹1 more/month"],
          ["25,000", "15 years", "19,35,380", "24,85,260", "+5,417", "₹4.58 saved per ₹1 more/month"],
          ["32,000", "10 years", "12,12,200", "32,08,440", "+11,711", "₹2.74 saved per ₹1 more/month"],
          ["52,000", "5 years", "8,00,000", "36,20,640", "+32,106", "₹1.13 saved per ₹1 more/month"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Shorter plans clear debt faster and accumulate less total interest",
      caption: "The balance curve for shorter tenures drops steeply — less time for interest to accumulate. Each additional year of tenure adds interest without meaningfully reducing the monthly payment. Use the max EMI field to find the optimal plan for your budget.",
    },
    faq: [
      {
        question: "Why not always pick the shortest tenure for lowest total interest?",
        answer:
          "Because the EMI must be affordable every month for years. If the EMI for the shortest tenure is so high that it leaves no room for savings, emergency fund, or unexpected expenses, you are creating a financial trap. The right answer is the shortest tenure whose EMI you can comfortably sustain even in a difficult month — not just in a good month. Aim for 30–35% of net income in total EMIs. If the shortest tenure breaches that, go one step longer and plan prepayments.",
      },
      {
        question: "What if I do not enter a maximum affordable EMI?",
        answer:
          "The tool compares all standard tenures by total interest alone and recommends the shortest one — which always has the lowest total interest. This is the theoretically optimal answer. Use this view to understand the full interest cost spectrum. Then set your max affordable EMI to find the practically optimal answer given your cash flow constraints.",
      },
      {
        question: "My recommended tenure is 15 years but I was thinking 20 years — how much does that cost me?",
        answer:
          "For a ₹25 lakh loan at 8.5%: the 20-year option costs ₹7,71,660 more in total interest than the 15-year option (₹27,07,040 vs ₹19,35,380). In exchange, you pay ₹2,945 less per month for those 20 years. To justify the 20-year choice financially, you would need to invest that ₹2,945/month at 8.5%+ p.a. consistently for 20 years to match the interest saving. Most people do not — the extra cash gets absorbed into lifestyle spending rather than investment. The 15-year recommendation is financially superior for most borrowers who can afford it.",
      },
      {
        question: "Does the generator account for prepayments?",
        answer:
          "No — this tool models a standard EMI plan without prepayments. It finds the best fixed-tenure plan for your budget. For prepayment modeling, use the Loan Prepayment Savings Calculator or the Loan Optimization Calculator in this hub. The best strategy is: use this generator to pick the recommended tenure, then complement it with periodic prepayments to further reduce effective tenure and total interest.",
      },
      {
        question: "Can I use this for a personal loan or auto loan, not just a home loan?",
        answer:
          "Yes — the math is the same for any fixed-rate amortizing loan. Enter your personal loan or auto loan amount and rate. Note that standard tenures for personal loans are typically 1–7 years and for auto loans 3–7 years; the 20–30 year options will show very low EMIs but are not practically available for these products. Focus on the shorter tenures (1–5 years for personal loans, 3–7 years for auto) when interpreting the recommendations.",
      },
    ],
    meta: {
      seoTitle: "Best EMI Plan Generator — Compare Tenures, Find Lowest Interest Loan Plan | mywebcalculator",
      seoDescription:
        "Compare loan tenures from 5 to 30 years and find the best EMI plan for your budget. Lowest-interest tenure recommendation within your max affordable EMI, with full interest cost comparison.",
      keywords: [
        "best emi plan generator",
        "compare loan tenure emi",
        "lowest interest emi plan",
        "optimal home loan tenure",
        "loan tenure comparison calculator",
        "how to choose loan tenure",
        "emi vs tenure calculator",
        "home loan 15 vs 20 years",
        "best tenure for home loan india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "loan-optimization-calculator": {
    slug: "loan-optimization-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [
      {
        heading: "What Does 'Optimizing' a Loan Mean?",
        paragraphs: [
          "Loan optimization means identifying the changes to your loan — within your real-life constraints — that produce the greatest reduction in total interest paid. There are three primary levers: (1) making a lump-sum prepayment to reduce the outstanding principal, (2) shortening the remaining tenure to reduce the months of interest accrual, and (3) refinancing to a lower interest rate.",
          "This calculator models your base loan and compares it against all three optimization scenarios simultaneously, showing you how much each saves in total interest. The 'lowest-interest option' is flagged as the winner. In practice, levers can be combined — but comparing them individually first reveals which has the highest per-rupee or per-month benefit, guiding where to focus first.",
          "The inputs include your current loan parameters (principal, APR, term), a prepayment amount and month, an alternative shorter tenure, and an alternative lower rate. The output is a side-by-side comparison: base scenario vs prepayment scenario vs shorter tenure scenario vs lower rate scenario — all showing total interest and interest saved vs base.",
        ],
      },
      {
        heading: "The Three Optimization Levers — How Each Works",
        paragraphs: [
          "Lever 1 — One-Time Prepayment: A lump-sum payment reduces the outstanding principal at the prepayment month, lowering the base for all future interest calculations. The loan then amortizes at the same EMI until zero balance, which happens sooner than originally scheduled. Interest saved = remaining scheduled interest in original plan − interest actually paid after prepayment. This lever is powerful in early tenure (high outstanding balance) and requires having surplus cash available.",
          "Lever 2 — Shorter Tenure: Reducing the loan term (while keeping the same principal and rate) increases the monthly EMI but reduces the total number of interest-bearing months. For a given loan amount and rate, a shorter tenure unambiguously saves more total interest than a longer one — but requires committing to a higher fixed monthly payment for the rest of the term. This lever is exercised at origination or as part of a balance transfer refinancing.",
          "Lever 3 — Lower Interest Rate: Refinancing the outstanding balance to a lower rate at the same remaining tenure reduces the monthly EMI and total interest. For a given outstanding balance and remaining tenure, a lower rate directly reduces interest proportionally. In India, this is achieved through rate negotiation with the existing lender (for floating-rate home loans when repo rate falls) or through a balance transfer to a new lender. Processing fees (0.25–0.5%) are a one-time cost that must be weighed against the ongoing interest saving.",
        ],
      },
      {
        heading: "Worked Example: $25,000 Loan at 6.5% for 5 Years",
        paragraphs: [
          "Base loan: $25,000 at 6.5% APR for 5 years (60 months). EMI = $489/month. Total interest = $4,352.",
          "Scenario A — Prepayment of $2,500 at Month 12: Outstanding at month 12 ≈ $20,650. After prepayment: $18,150. New term (same EMI $489): approximately 43 more months (total ≈ 55 months). Total interest ≈ $3,150. Interest saved vs base = $1,202.",
          "Scenario B — Shorter Tenure (4 years instead of 5): EMI = $593/month (higher by $104). Total interest = $3,464. Interest saved vs base = $888.",
          "Scenario C — Lower Rate (5.5% instead of 6.5%), same 5-year term: EMI = $479/month (lower by $10). Total interest = $3,740. Interest saved vs base = $612.",
          "Winner in this example: Prepayment at month 12 saves the most ($1,202) among these specific parameters. But note that prepayment requires having $2,500 available in month 12. Shorter tenure requires $104 more per month for the entire term. Lower rate requires a refinancing action. The 'best' optimization depends on which resource — cash lump sum, monthly cash flow, or rate access — you actually have.",
        ],
      },
      {
        heading: "When Each Lever Is Practically Available",
        paragraphs: [
          "Prepayment availability: You need a surplus cash event — bonus, inheritance, asset sale, maturity of FD, or consistent monthly surplus saved over time. Prepayment makes the most sense when: (a) the loan rate is higher than what your cash could earn safely elsewhere, (b) the prepayment is large enough to materially change the schedule (at least 3–5 months of EMI), and (c) no prepayment penalty applies. For floating-rate home loans in India, banks cannot charge prepayment penalties — prepayment is always available and always zero-cost.",
          "Shorter tenure availability: You can only choose a shorter tenure at loan origination or at a restructuring event (balance transfer, rate reset negotiation). After signing the loan agreement, you cannot unilaterally shorten the contractual tenure — but you can achieve the same effect by making regular monthly prepayments (effectively paying more than the EMI, which shortens the actual repayment timeline). If you are about to take a new loan, this calculator helps you compare whether a shorter-tenure plan is worth the higher EMI commitment.",
          "Lower rate availability: The rate on your loan changes through: (a) RBI rate cuts passing through to floating-rate loans (automatic, no action needed), (b) requesting a rate reset from your current lender (possible for long-standing customers, may involve a small fee), or (c) balance transfer to a new lender offering a lower rate. Balance transfers work best when: remaining tenure is long (5+ years), rate difference is ≥ 0.5%, and the transfer fee is recovered within 12–18 months of interest savings.",
        ],
      },
      {
        heading: "Combining Levers for Maximum Optimization",
        paragraphs: [
          "In real life, the most powerful optimization combines all three levers over time. The optimal sequence: (1) Refinance to the lowest available rate as soon as a meaningful rate difference opens up (≥0.5%). (2) Use the shorter-tenure commitment to lock in a higher EMI obligation at the new rate. (3) Apply any surplus cash as periodic prepayments on top of the higher EMI. Each action compounds the previous one.",
          "Example: Balance-transfer from 9% to 8.25% on a ₹30L outstanding balance with 15 years remaining: Monthly interest saving at origination ≈ ₹1,875/month. Shorter tenure at new rate (13 years instead of 15): Additional EMI increase ≈ ₹2,100/month but saves ₹4.2 lakh in interest vs 15-year at 8.25%. Annual prepayment of ₹50,000: Saves additional ₹1.5–2 lakh. Combined, this optimization reduces total interest on a ₹30L loan by ₹8–10 lakh over the remaining term — a meaningful sum.",
          "The diminishing marginal utility of optimization: Each subsequent optimization lever has lower impact than the first. A rate cut from 9% to 8.25% saves more than a subsequent cut from 8.25% to 7.75%. A prepayment in year 2 saves more than the same amount in year 12. Focus optimization energy early in the loan tenure when the outstanding balance is highest and the impact of each action is greatest.",
        ],
      },
    ],
    tables: [
      {
        title: "Optimization Lever Comparison — $25,000 @ 6.5%, 5 Years",
        columnHeaders: ["Scenario", "EMI ($)", "Total Interest ($)", "Interest Saved vs Base ($)", "Cash Required Upfront", "Monthly Cash Impact"],
        rows: [
          ["Base (no change)", "489", "4,352", "—", "None", "None"],
          ["Prepayment $2,500 at Month 12", "489 (unchanged)", "~3,150", "~1,202", "$2,500 at month 12", "None (same EMI)"],
          ["Shorter tenure (4 yr vs 5 yr)", "593", "3,464", "888", "None", "+$104/month for 4 years"],
          ["Lower rate (5.5% vs 6.5%)", "479", "3,740", "612", "Refinancing fee (~0.5%)", "−$10/month (EMI drops)"],
          ["Prepay + Shorter tenure", "593 + prepay", "~2,200", "~2,152", "$2,500 + higher EMI", "+$104/month + $2,500"],
        ],
      },
      {
        title: "Rate Difference Impact on Total Interest — ₹30 Lakh Outstanding, 15 Years Remaining",
        columnHeaders: ["Current Rate", "New Rate", "Rate Saving", "Old Monthly Interest", "New Monthly Interest", "Total Interest Saved Over 15yr (₹)", "Break-even Months at 0.5% Fee"],
        rows: [
          ["9.0%", "8.5%", "0.5%", "22,500", "21,250", "~2,96,000", "~5 months"],
          ["9.0%", "8.0%", "1.0%", "22,500", "20,000", "~5,89,000", "~3 months"],
          ["9.0%", "7.5%", "1.5%", "22,500", "18,750", "~8,79,000", "~2 months"],
          ["8.5%", "8.0%", "0.5%", "21,250", "20,000", "~2,96,000", "~5 months"],
          ["8.5%", "7.5%", "1.0%", "21,250", "18,750", "~5,89,000", "~3 months"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Prepayment visibly accelerates balance decline vs base scenario",
      caption: "The optimization calculator shows each scenario's balance curve. The gap between the base and optimized curves represents cumulative interest saved. Prepayment at an early month produces the steepest divergence.",
    },
    faq: [
      {
        question: "Can I combine all three optimization strategies at once?",
        answer:
          "Yes in real life — and that produces the maximum total saving. This calculator compares them individually so you can see each lever's isolated impact, making it easier to prioritize. In practice, the order of operations matters: (1) First, get the lowest rate you can (refinancing or rate negotiation). (2) At the new (lower) rate, choose the shortest tenure your cash flow allows. (3) Make periodic prepayments as surplus cash becomes available. Each step builds on the previous one.",
      },
      {
        question: "How do I know if a balance transfer to a lower rate is worth it?",
        answer:
          "The break-even formula: Transfer fee (₹) ÷ Monthly interest saving (₹) = Months to recover the fee. If you have 10+ years remaining and the rate difference is ≥0.5%, the fee is typically recovered in 3–6 months — making the transfer financially sound. Calculate: Monthly saving = Outstanding × (Old rate − New rate) ÷ 12. On ₹30 lakh at a 0.5% rate saving: ₹30,00,000 × 0.005 ÷ 12 = ₹1,250/month. At a 0.5% processing fee (₹15,000): Break-even = ₹15,000 ÷ ₹1,250 = 12 months. If you have 120+ months remaining, this transfer saves ₹1,250 × (120 − 12) = ₹1,35,000 net.",
      },
      {
        question: "What if I have both surplus cash and the ability to shorten my tenure — which should I do first?",
        answer:
          "Mathematically, they are very similar if done at the same time. But if the choice is sequential: shortening the tenure first locks in a higher committed EMI, which disciplines future cash flow. Prepayment is then layered on top as surplus arrives. The risk of doing prepayment first without shortening tenure is that freed cash from the lower remaining EMI (if lender auto-reduces tenure slightly) gets spent rather than saved for the next prepayment. Commitment devices (higher contractual EMI) tend to be more reliable than discretionary prepayments for most borrowers.",
      },
      {
        question: "Why does a lower rate sometimes save less than a prepayment?",
        answer:
          "Because the interest saving from a rate reduction depends on the rate difference and the remaining balance, while prepayment saving depends on the prepayment amount and its timing. A 0.5% rate reduction on ₹20L outstanding saves ₹8,333/year in interest. A ₹2.5L prepayment in month 12 saves roughly ₹1,200 in the worked example above (on a $25K loan at 6.5%). These are proportional to the loan size — on a large loan (₹50L+), rate reduction often saves more in absolute terms than a modest prepayment.",
      },
      {
        question: "Does this tool account for prepayment penalties or refinancing fees?",
        answer:
          "No — the comparison shows pure interest savings without accounting for fees. For floating-rate home loans in India, prepayment is fee-free (RBI mandate), so the comparison is accurate. For loans with prepayment penalties (personal loans, fixed-rate home loans, auto loans), subtract the penalty from the shown interest saving to get the true net benefit. For refinancing, subtract the processing fee and other transfer costs. The rule of thumb: if net saving (after fees) over the remaining term is positive, the optimization is worth doing.",
      },
    ],
    meta: {
      seoTitle: "Loan Optimization Calculator — Compare Prepayment vs Shorter Tenure vs Lower Rate | mywebcalculator",
      seoDescription:
        "Find which loan optimization saves the most interest: one-time prepayment, shorter tenure, or lower interest rate. Side-by-side comparison with interest saved for each strategy.",
      keywords: [
        "loan optimization calculator",
        "reduce loan interest calculator",
        "prepayment vs shorter tenure vs lower rate",
        "home loan optimization india",
        "balance transfer savings calculator",
        "loan interest saving calculator",
        "should i prepay or refinance loan",
        "loan cost reduction calculator",
        "best way to reduce home loan interest",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "should-i-take-loan-calculator": {
    slug: "should-i-take-loan-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [
      {
        heading: "A Framework for the 'Should I Borrow?' Decision",
        paragraphs: [
          "The decision to take a loan is one of the most consequential personal finance choices you can make — and it deserves more than gut instinct. This calculator applies a structured three-factor framework: (1) Affordability check via DTI — can you service the debt without financial strain? (2) Interest cost assessment — is the total cost of borrowing justified by what you are getting? (3) Optional opportunity cost comparison — could the money be better deployed elsewhere?",
          "The output is one of three verdicts: 'Likely Sensible' (all three factors check out), 'Proceed with Caution' (one or two factors are borderline), or 'Consider Avoiding' (at least one factor fails clearly). These are planning guides, not financial advice — your specific circumstances, goals, and risk tolerance determine the right answer.",
          "Enter your gross monthly income, existing monthly debt, the proposed loan amount, interest rate, and tenure. Optionally, enter an alternative return rate — the expected annual return you would earn if you invested the money instead of borrowing (or instead of borrowing to avoid an expense). This last input transforms the decision from a one-dimensional affordability check into a proper financial opportunity cost analysis.",
        ],
      },
      {
        heading: "Factor 1: DTI Affordability — Can You Service This Debt?",
        paragraphs: [
          "The DTI check asks: with this loan's EMI added to your existing obligations, what percentage of your gross monthly income is committed to debt? If the answer is ≤36%, affordability is solid (green signal). Between 36–43%, it is borderline (yellow signal). Above 43%, it is a red signal — most lenders would decline this application and the financial strain risk is high.",
          "The DTI check is the same logic as the Smart Loan Advisor — it answers whether you can sustain the monthly payment. A loan that fails the DTI check almost always gets a 'Consider Avoiding' or at best 'Proceed with Caution' verdict, regardless of the other factors. Financial sustainability is the necessary first condition for any borrowing decision.",
          "Key nuance: DTI is about the proposed loan's EMI relative to income. A ₹5 lakh personal loan at 14% for 5 years has an EMI of ₹11,634. If your income is ₹60,000 and you have ₹10,000 in existing EMIs: new DTI = (₹10,000 + ₹11,634) ÷ ₹60,000 = 36.1%. This is borderline — the verdict will be 'Proceed with Caution' even if the purpose is sound.",
        ],
      },
      {
        heading: "Factor 2: Interest Cost Assessment — Is the Total Cost Justified?",
        paragraphs: [
          "The interest cost check asks: is the total interest you will pay over the loan life proportionate to the benefit you receive? For a home loan (asset that appreciates), paying ₹27 lakh in interest on a ₹25 lakh loan over 20 years is generally justified — you own property that has likely appreciated and you had shelter throughout. For a personal loan at 16% to fund a vacation, ₹30,000 in interest on a ₹1.5 lakh loan is harder to justify.",
          "The tool flags when total interest exceeds 50% of the principal as a 'caution' signal, and when it exceeds 100% (you pay back more than double what you borrowed) as a 'red' signal. These thresholds trigger when rates are high and/or tenures are long: a 7-year personal loan at 18% has a total interest burden of ~77% of principal.",
          "Context matters enormously. The same interest cost threshold produces different verdicts depending on the purpose: borrowing to buy a productive asset (business, education, home) can justify higher interest costs because the asset generates returns. Borrowing to fund consumption (holidays, gadgets, weddings) rarely justifies the interest cost in purely financial terms — though personal values and timing considerations are real.",
        ],
      },
      {
        heading: "Factor 3: Opportunity Cost — What Else Could You Do With This Money?",
        paragraphs: [
          "The alternative return comparison is the most sophisticated factor. Enter the expected annual return (%) on the best alternative use of the capital. If you are taking a loan to buy equipment for a business that will generate 20% returns, the 14% personal loan rate is clearly worth it — a 6% net spread in your favor. If you are taking a loan because you did not save for a vacation, there is no alternative investment — the comparison does not apply.",
          "When does the alternative return matter most? Two scenarios: (A) You are borrowing to invest (margin trading, business, education with high ROI potential) — compare loan rate to expected post-tax investment return. If investment return > loan rate, borrowing to invest is financially positive in theory (but adds risk). (B) You have savings that could pay for this purchase outright — compare loan rate to what your savings would earn if left invested. If your FD earns 7% and the loan costs 14%, withdrawing the FD is clearly better than taking the loan.",
          "The math for scenario B: If you have ₹5 lakh in an FD earning 7% and need ₹5 lakh for a purchase: Option A — Use the FD (lose ₹35,000/year in FD interest). Option B — Take a loan at 14% (pay ₹70,000/year in interest). Option A is better by ₹35,000/year. The alternative return comparison always favors using your own funds if your savings rate is close to or above half the loan rate.",
        ],
      },
      {
        heading: "Situations Where Taking the Loan Is Clearly the Right Choice",
        paragraphs: [
          "Home purchase at reasonable rates (8–10%): Property provides shelter, potential appreciation, and tax benefits. Over 15–20 years, most metropolitan Indian properties have appreciated at 8–15% p.a. Even accounting for total EMI cost, home ownership often creates net wealth vs renting. The verdict will be 'Likely Sensible' for borrowers with strong DTI and stable income.",
          "Medical emergency with no liquid savings: When health requires immediate expenditure that exceeds available funds, a personal loan at 14–16% is a necessary cost. There is no 'should I or shouldn't I' — the question becomes minimizing the loan amount and maximizing the repayment speed. The verdict might show 'Proceed with Caution' on pure financial metrics, but the real-world context overrides.",
          "Education loans for high-ROI programs: An engineering degree, MBA from a top institution, or medical degree significantly increases lifetime earning capacity. A ₹20 lakh education loan at 9–10% for an IIM MBA is backed by an asset (human capital) that generates much higher returns than the borrowing cost over a career. The verdict framework is 'Likely Sensible' if DTI projections (post-course income) support repayment.",
          "Situations where the verdict should override the urge to borrow: Lifestyle purchases (new phone, trip, furniture) where the purchase could be delayed and saved for. Investment-linked borrowing (margin loans, crypto-backed loans) where investment return is uncertain and loss of collateral is possible. Debt-to-pay-debt situations where a new loan is taken to pay an old one — this usually signals a deeper cash flow problem requiring budgeting intervention, not more credit.",
        ],
      },
    ],
    tables: [
      {
        title: "Decision Verdict Examples — Illustrative Scenarios",
        columnHeaders: ["Scenario", "DTI After Loan", "Total Interest %", "Alt. Return vs Loan Rate", "Verdict", "Key Action"],
        rows: [
          ["Home loan, 30% DTI, 8.5% rate, 20yr", "30%", "108% of principal", "Not applicable (shelter)", "Likely Sensible", "Proceed; target shorter tenure if income allows"],
          ["Personal loan, 38% DTI, 14% rate, 5yr", "38%", "40% of principal", "FD @ 7% (loan beats FD)", "Proceed with Caution", "Reduce existing debt first; repay aggressively"],
          ["Personal loan, 48% DTI, 18% rate, 5yr", "48%", "51% of principal", "Savings @ 6%", "Consider Avoiding", "Reduce existing debt or find cheaper alternative"],
          ["Education loan, 25% DTI (post-grad), 10% rate, 10yr", "25%", "67% of principal", "Career ROI >> 10%", "Likely Sensible", "Maximize repayment speed post-graduation"],
          ["Luxury vacation loan, 35% DTI, 16% rate, 3yr", "35%", "28% of principal", "No investment return", "Proceed with Caution", "Consider saving for 6–12 months and paying cash"],
          ["Business loan, 40% DTI, 12% rate, 5yr", "40%", "35% of principal", "Business IRR 20%+", "Likely Sensible", "Monitor business ROI; prepay if exceeds target"],
        ],
      },
      {
        title: "Borrowing vs Using Savings — When to Use Each",
        columnHeaders: ["Situation", "Savings Rate (if applicable)", "Loan Rate", "Better Choice", "Net Annual Benefit of Better Choice"],
        rows: [
          ["Have FD @ 7%, loan at 14%", "7%", "14%", "Use savings (break FD)", "Save ₹7,000/lakh/year"],
          ["Have equity MF @ expected 12%, loan at 8.5%", "12%*", "8.5%", "Keep MF, take loan", "Earn ₹3,500/lakh/year net*"],
          ["Have no savings, need emergency funds", "N/A", "16%", "Take personal loan (necessary)", "N/A — unavoidable"],
          ["Have savings @ 4%, loan at 12%", "4%", "12%", "Use savings", "Save ₹8,000/lakh/year"],
          ["Business investment earning 20%, loan at 11%", "N/A", "11%", "Borrow to invest", "Earn ₹9,000/lakh/year net"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "How DTI improvements shift the decision verdict",
      caption: "As DTI falls below 43% and then below 36%, the verdict improves from 'Consider Avoiding' toward 'Likely Sensible.' Reducing existing debt, increasing income, or lowering the loan amount moves the needle.",
      sparkValues: [0.85, 0.75, 0.62, 0.48, 0.35, 0.22],
    },
    faq: [
      {
        question: "Does this calculator replace a financial advisor?",
        answer:
          "No. It is a structured checklist that helps you think through the three most important quantitative factors in a borrowing decision. It does not account for tax implications (e.g., home loan deductions), insurance costs, opportunity costs of your time, family financial goals, job stability, career trajectory, or dozens of other factors a human advisor can assess holistically. Use this tool to clarify your thinking before a conversation with an advisor, not as a substitute for one.",
      },
      {
        question: "What alternative return should I enter?",
        answer:
          "Enter the expected annual return (% p.a.) on the best realistic alternative use of capital. Examples: if you have an FD that would be broken to fund the purchase, enter the FD rate (e.g., 7%). If you would invest in equity mutual funds instead, enter your expected SIP CAGR (e.g., 11–12%, though this is uncertain and long-term). If there is no realistic investment alternative — you simply need the money — leave this field blank. A blank field means the comparison factor is not evaluated, and the verdict is based on DTI and interest cost alone.",
      },
      {
        question: "The verdict says 'Consider Avoiding' but I genuinely need the money — what do I do?",
        answer:
          "A 'Consider Avoiding' verdict means the financial case is weak — not that the loan is impossible. If the need is genuine (medical, emergency, essential asset), proceed but take aggressive corrective action: (1) Borrow the minimum amount needed — not a round number for convenience. (2) Choose the shortest tenure you can service. (3) Plan to prepay aggressively as soon as cash flow allows. (4) Look for cheaper alternatives first: friends/family loan at low/zero interest, employer advance, gold loan at 8–9% vs personal loan at 16%. (5) Avoid converting a short-term loan into a long-term habit.",
      },
      {
        question: "Can I use this to decide between taking a home loan vs renting?",
        answer:
          "The buy-vs-rent decision is more complex than this tool's scope — it requires modeling property appreciation, rental yield, total EMI cost, tax benefits, opportunity cost of down payment, and lifestyle factors. This tool specifically evaluates whether the proposed loan is affordable and financially justified as a borrowing decision — not the underlying asset decision. For buy-vs-rent analysis, a dedicated buy-vs-rent calculator that models both scenarios side-by-side is more appropriate.",
      },
      {
        question: "What if my alternative return is higher than my loan rate — should I always borrow?",
        answer:
          "Not necessarily. A higher expected return on investment vs loan rate is a necessary but not sufficient condition for borrowing to invest. You also need: (1) High confidence in the expected return — equity returns are not guaranteed; (2) Ability to service the loan even if the investment underperforms (DTI check still applies); (3) No prepayment penalty, since you may want to exit quickly if investment doesn't perform; (4) Emotional capacity to hold leveraged investments through downturns without panic-selling. Borrowing to invest amplifies both gains and losses — it is suitable only for investors with strong financial fundamentals, not for beginners.",
      },
    ],
    meta: {
      seoTitle: "Should I Take a Loan Calculator — DTI Check, Interest Cost & Decision Guide | mywebcalculator",
      seoDescription:
        "Decide whether to take a loan using a three-factor framework: DTI affordability check, interest cost assessment, and optional alternative return comparison. Browser-based, no data sent externally.",
      keywords: [
        "should i take a loan calculator",
        "borrow or not calculator india",
        "loan decision calculator",
        "is it worth taking a personal loan",
        "home loan affordability decision",
        "loan vs investment calculator",
        "dti affordability check",
        "should i break fd for loan",
        "is taking a loan wise calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "loan-risk-calculator": {
    slug: "loan-risk-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [
      {
        heading: "What Is Loan Repayment Risk and Why Measure It?",
        paragraphs: [
          "Loan repayment risk is the probability that a borrower experiences financial stress, misses payments, or defaults on a loan obligation during its tenure. It is distinct from credit risk (a lender's perspective) — this is the borrower's own assessment of how vulnerable their personal finances are to the burden of the proposed loan.",
          "Repayment risk is not binary (risky vs safe). It exists on a spectrum influenced by multiple interacting factors: how much of your income the EMI consumes, how high the interest rate is, how long the loan runs, whether you have savings to absorb income shocks, and how much existing debt you already carry. This calculator scores all five factors into a 0–100 composite risk score with four bands: Low (0–24), Moderate (25–49), Elevated (50–74), and High (75–100).",
          "Knowing your risk score before taking a loan allows you to make conscious decisions: reduce the loan amount, build emergency savings first, close an existing loan, or wait for a rate improvement. A score in the Elevated or High band does not mean 'do not borrow' — it means 'borrow only if you have a clear plan for the identified risks.'",
        ],
      },
      {
        heading: "The Five Risk Factors and How They Are Scored",
        paragraphs: [
          "Factor 1 — DTI after loan (0–30 points): The most heavily weighted factor. DTI = (existing monthly debt + proposed EMI) ÷ gross monthly income. DTI ≤30% contributes 0 risk points. Each 1% above 30% adds approximately 1–1.5 points. DTI above 43% contributes the maximum ~20 points for this factor. A borrower with no existing debt and a strong income can propose a large loan without significant DTI risk.",
          "Factor 2 — EMI load as % of income (0–20 points): Specifically the proposed new EMI as a standalone % of income (not combined with existing debt). An EMI consuming 15–25% of income is moderate; above 35% is high-load. This factor identifies loans where the new obligation alone is very large relative to income, regardless of existing debt.",
          "Factor 3 — Interest rate (0–20 points): Higher interest rates signal two risks: (a) you are borrowing an expensive product (personal loan, credit card EMI, NBFC product), and (b) if rates rise further (floating-rate loans), your EMI/tenure increases. Rates below 9% contribute low risk points; rates of 14–18% (personal loans) contribute moderate-high; rates above 18% contribute maximum points for this factor.",
          "Factor 4 — Loan tenure (0–15 points): Longer tenures create extended financial commitment and more lifetime interest cost. A 30-year mortgage carries more uncertainty about income stability than a 3-year personal loan — job changes, health events, or family circumstances over 30 years are unpredictable. Tenures under 3 years contribute minimal points; 20–30 year tenures contribute maximum.",
          "Factor 5 — Emergency fund buffer (0–15 points, inverse): The only factor where more is better. Enter the number of months of essential expenses you have saved in liquid form. Fewer than 1 month: high points (high risk). 3 months: moderate. 6 months: low. 12+ months: minimal. Emergency savings are the shock absorber that determines whether a temporary income disruption becomes a missed EMI.",
        ],
      },
      {
        heading: "Worked Example: ₹5 Lakh Personal Loan at 12%, 5 Years",
        paragraphs: [
          "Inputs: Gross monthly income = ₹80,000. Existing monthly debt = ₹10,000 (car EMI). Proposed loan = ₹5,00,000 at 12% for 5 years. EMI = ₹11,122/month. Emergency fund = 3 months.",
          "Factor scoring: DTI after loan = (₹10,000 + ₹11,122) ÷ ₹80,000 = 26.4% → DTI is below 30%, contributing ~0 DTI risk points. EMI load = ₹11,122 ÷ ₹80,000 = 13.9% → Moderate, contributing ~6 points. Rate 12% → Moderate-high, contributing ~10 points. Tenure 5 years → Low, contributing ~4 points. Emergency fund 3 months → Moderate, contributing ~7 points. Total score ≈ 27/100 — Moderate band.",
          "What changes the score significantly: Reduce emergency fund from 3 to 0 months → Score rises to ~42 (still Moderate but near Elevated). Add ₹5,000 more in existing debt → DTI rises to 32.6% → Score rises to ~34. Increase rate to 16% → Score rises to ~38. All three simultaneously → Score ~55 (Elevated). A single bad factor raises the score modestly; multiple concurrent weaknesses compound the risk.",
        ],
      },
      {
        heading: "What Each Risk Band Means and What to Do",
        paragraphs: [
          "Low Risk (0–24): Your financial position can comfortably absorb this loan. DTI is manageable, the rate is reasonable, tenure is not extreme, and you have emergency savings. Proceed with confidence. Use this clean financial position to negotiate the best rate with your lender — strong DTI and emergency fund signal creditworthiness.",
          "Moderate Risk (25–49): The loan is manageable but you have one or two factors that deserve attention. Common culprits: inadequate emergency fund (most fixable — build 6 months before borrowing if possible), moderate-high existing debt (clear smaller loans first), or a high personal loan rate (shop multiple lenders). Address the highest-scoring individual factor before proceeding.",
          "Elevated Risk (50–74): At least two factors are in concerning territory. This does not mean the loan is unaffordable — it means your margin of safety is thin. A 15% income drop, an unexpected medical expense, or a rate hike could stress your finances significantly. Before proceeding: build emergency fund to 6+ months, close at least one existing loan, consider a lower loan amount, or choose a shorter tenure (lower interest rate risk) if you can afford the higher EMI.",
          "High Risk (75–100): Multiple critical factors are in the danger zone — typically high DTI (45%+), inadequate emergency savings (under 1 month), and/or a very high interest rate product. Proceeding at this risk level significantly increases the probability of missed payments, late fees, CIBIL damage, and debt spiral. Strongly consider delaying the loan, restructuring the ask, or seeking financial counselling before committing.",
        ],
      },
      {
        heading: "Building Financial Resilience to Lower Your Risk Score",
        paragraphs: [
          "Emergency fund impact: The emergency fund is the most underappreciated risk factor. Going from 0 months to 6 months of savings can reduce the risk score by 10–15 points and move a High Risk verdict to Elevated or an Elevated to Moderate. Before any major loan, target at least 3 months of essential expenses in a liquid account (savings account or short-term FD, not equity). This is not a luxury — it is the single most powerful financial resilience tool available.",
          "Existing debt reduction: Each existing EMI you eliminate reduces the DTI component of the risk score. Prioritise clearing shorter-tenure, higher-rate loans (personal loans, credit cards) before applying for a large new loan (home loan). The sequence: (1) Clear all credit card outstanding balances first (36–42% rates). (2) Foreclose any personal loans in the last 12 months of tenure (low outstanding, high per-rupee fee). (3) Then apply for the new loan with a clean, minimal existing obligation profile.",
          "Rate awareness: Entering a 14–16% personal loan raises the risk score meaningfully. Before accepting a quoted rate, compare across at least 3 lenders — the same borrower profile can yield 2–3% rate differences between lenders. A 2% rate reduction on a 5-year ₹5 lakh loan saves ~₹28,000 in interest and lowers the risk score by 5–8 points. Rate shopping is free and takes 30 minutes — it is always worth doing.",
        ],
      },
    ],
    tables: [
      {
        title: "Risk Score Sensitivity Analysis — ₹5,00,000 @ 12%, 5 Years, Income ₹80,000",
        columnHeaders: ["Scenario", "DTI", "Emergency Fund (months)", "Existing Debt (₹)", "Risk Score (est.)", "Band"],
        rows: [
          ["Baseline: no existing debt, 6-month fund", "13.9%", "6", "0", "~15", "Low"],
          ["Existing debt ₹10K, 3-month fund", "26.4%", "3", "10,000", "~27", "Moderate"],
          ["Existing debt ₹10K, 0-month fund", "26.4%", "0", "10,000", "~42", "Moderate"],
          ["Existing debt ₹20K, 3-month fund", "38.9%", "3", "20,000", "~55", "Elevated"],
          ["Existing debt ₹20K, 0-month fund", "38.9%", "0", "20,000", "~68", "Elevated"],
          ["Existing debt ₹25K, 0-month fund", "45.1%", "0", "25,000", "~82", "High"],
        ],
      },
      {
        title: "Risk Factor Contribution Summary — Scoring Guide",
        columnHeaders: ["Risk Factor", "Low Risk (few points)", "Moderate Risk", "High Risk (many points)", "Max Points"],
        rows: [
          ["DTI after loan", "≤ 30%", "30–43%", "> 43%", "30"],
          ["EMI as % of income", "< 15%", "15–30%", "> 30%", "20"],
          ["Interest rate", "< 9%", "9–14%", "> 14%", "20"],
          ["Loan tenure", "< 3 years", "3–10 years", "> 10 years", "15"],
          ["Emergency fund (inverse)", "6+ months", "3–6 months", "< 1 month", "15"],
          ["Total", "0–24 = Low", "25–49 = Moderate", "50–74 = Elevated / 75–100 = High", "100"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Risk score falls as emergency buffer and income buffer grow",
      caption: "Building an emergency fund moves the score down the most efficiently. The curve shows risk score (0–100) as financial resilience improves — even partial improvements in multiple factors have a compounding risk-reduction effect.",
      sparkValues: [0.82, 0.68, 0.55, 0.42, 0.30, 0.18],
    },
    faq: [
      {
        question: "What emergency fund amount should I enter?",
        answer:
          "Enter the number of months of essential living expenses you have saved in liquid, accessible accounts (savings account, short-term FD, liquid mutual fund — not equity, not long-term FD with penalty). Essential expenses = rent + groceries + utilities + minimum EMI obligations + school fees + basic transport. Do not include discretionary spending (dining out, entertainment) in this calculation. If you have ₹1,50,000 saved and your essential monthly expenses are ₹50,000, enter 3 months. Most financial planners recommend a minimum of 3 months, with 6 months as the target for a two-income household and 9–12 months for a single-income household or self-employed borrower.",
      },
      {
        question: "How is this different from the Smart Loan Advisor?",
        answer:
          "The Smart Loan Advisor focuses on DTI and generates a single verdict (Strong/Manageable/Stretched/High Risk) with tips calibrated to that verdict. It is an affordability-first tool. The Loan Risk Calculator is a broader financial health diagnostic — it scores five factors (DTI, EMI load, rate, tenure, emergency fund) into a 0–100 composite score with a risk band. Use the Smart Loan Advisor first to check DTI; use the Risk Calculator to get a fuller picture of the loan's risk profile including your financial resilience factors.",
      },
      {
        question: "Can I use this to assess my current loans, not just a proposed new one?",
        answer:
          "Yes. Enter your total current monthly debt obligations as the 'loan amount equivalent' and your income and emergency fund. The tool will score your current overall debt burden's risk. However, the 'loan amount' and 'APR' fields are used to compute the EMI — for existing loans, enter the combined outstanding balance and a blended rate, or assess each loan individually to understand which contributes most to your risk score.",
      },
      {
        question: "What is the most important factor to improve if my score is High?",
        answer:
          "Start with DTI — it is the most heavily weighted factor (30 points max). Reduce existing debt first. The fastest and most impactful single action is foreclosing a smaller personal loan or credit card balance that you are currently paying EMI on. For example, foreclosing a personal loan with ₹15,000/month EMI reduces your DTI significantly and can shift you from High to Elevated or Moderate risk. Second priority: build emergency fund to at least 3 months before adding new debt. Third: lower the proposed loan amount to reduce the EMI/DTI impact.",
      },
      {
        question: "Does a high risk score mean I will be rejected for a loan?",
        answer:
          "Not necessarily. This tool measures your personal financial repayment risk — it is not a credit bureau assessment or lender decision model. Lenders have their own credit policies, bureau models, and risk appetite that may differ. A borrower with a High risk score here might still be approved by a lender (especially NBFCs or digital lenders with higher risk appetite), but often at higher interest rates that increase the financial risk further. The risk score is a personal finance health check, not a loan approval predictor. Use it to decide whether you want to take on the risk — not just whether a lender might let you.",
      },
    ],
    meta: {
      seoTitle: "Loan Risk Calculator — DTI, EMI Load, Rate & Emergency Fund Risk Score | mywebcalculator",
      seoDescription:
        "Score your loan repayment risk across five factors: DTI, EMI as % of income, interest rate, tenure, and emergency fund buffer. Get a 0–100 risk score with Low to High band and actionable risk reduction tips.",
      keywords: [
        "loan risk calculator",
        "loan repayment risk score",
        "loan stress test calculator india",
        "emi affordability risk",
        "personal loan risk assessment",
        "debt to income risk calculator",
        "emergency fund loan calculator",
        "foir risk calculator",
        "loan default risk calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
