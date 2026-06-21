import type { RichArticle } from "./types";

const HUB_HREF = "/finance/loans-emi/prepayment-foreclosure-tools";
const HUB_LABEL = "Finance · Prepayment & Foreclosure Tools";

export const PREPAYMENT_FORECLOSURE_ARTICLES: Record<string, RichArticle> = {
  "loan-foreclosure-calculator": {
    slug: "loan-foreclosure-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs entirely in your browser. Foreclosure totals use reducing-balance amortization and a percentage fee on outstanding principal. Actual bank charges may include GST, processing fees, or fixed penalties not modeled here.",
    sections: [
      {
        heading: "What Is Loan Foreclosure?",
        paragraphs: [
          "Loan foreclosure means closing your loan before the originally scheduled end date by paying the entire outstanding balance in one settlement. Banks and NBFCs may charge a foreclosure or prepayment penalty — especially on fixed-rate, personal, or auto loans. Floating-rate home loans in India are often exempt from prepayment penalties under RBI guidelines (circular RBI/2011-12/540), but always confirm with your lender before initiating closure.",
          "The total foreclosure amount has three components: (1) Outstanding principal after the last EMI paid, (2) Foreclosure fee charged as a percentage of outstanding principal, and (3) Any accrued interest or processing charges your lender adds. This calculator estimates the first two using standard reducing-balance amortization math — the most common method used by banks in India.",
          "Foreclosure is distinct from partial prepayment. A prepayment reduces the outstanding principal while keeping the loan active; foreclosure closes the account entirely, terminating all future EMI obligations and freeing you from the debt.",
        ],
      },
      {
        heading: "How the Foreclosure Amount Is Calculated — Step by Step",
        paragraphs: [
          "Step 1 — Build the standard EMI amortization schedule from loan disbursement. Monthly EMI = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P = principal, r = monthly interest rate (APR ÷ 12), n = total EMIs.",
          "Step 2 — Run the schedule month by month until your chosen closure month M. After each EMI: Interest portion = Remaining Balance × r; Principal portion = EMI − Interest; New Balance = Old Balance − Principal portion.",
          "Step 3 — Read the outstanding balance after the M-th EMI. This is the principal you owe at the point of foreclosure.",
          "Step 4 — Apply the foreclosure fee: Fee = Outstanding Balance × (Fee % ÷ 100). In India, this is typically 1–5% for personal loans and fixed-rate products; 0% for floating-rate home loans under RBI norms.",
          "Step 5 — Total foreclosure amount = Outstanding Balance + Foreclosure Fee. Interest saved = sum of all interest components in months M+1 through n (the payments you will never have to make).",
        ],
      },
      {
        heading: "Worked Example: ₹5 Lakh Personal Loan Foreclosure",
        paragraphs: [
          "Loan: ₹5,00,000 at 14% p.a. for 5 years (60 months). Monthly rate r = 14 ÷ 12 ÷ 100 = 1.1667%. Standard EMI = ₹11,634/month. Total interest over full tenure = ₹11,634 × 60 − ₹5,00,000 = ₹1,98,040.",
          "Foreclosure at month 24 (after 24 EMIs paid): Outstanding balance ≈ ₹3,39,850. Foreclosure fee @ 2% = ₹6,797. Total closure amount = ₹3,46,647. Interest saved (months 25–60, i.e. 36 months not paid) ≈ ₹79,620.",
          "Key insight: The ₹6,797 fee is completely offset by the ₹79,620 interest saved — a net saving of ₹72,823 by closing at month 24. Even a 5% fee (₹16,993) would still leave a net saving of ₹62,627. Run the calculator to find the crossover point for your specific loan.",
        ],
      },
      {
        heading: "When Foreclosure Makes Financial Sense",
        paragraphs: [
          "Foreclosure is attractive when your loan rate exceeds safe after-tax returns on investments you would otherwise make with the payoff amount. Closing a 14% personal loan is equivalent to earning a guaranteed 14% post-tax return on the payoff amount — a return almost no risk-free instrument can match.",
          "Compare the foreclosure fee against interest saved. A 2% fee on ₹3.4 lakh (≈₹6,800) versus ₹79,000 in interest saved makes foreclosure clearly worthwhile. The break-even analysis is simple: if Interest Saved > Foreclosure Fee, close the loan.",
          "Foreclosure may not make sense in the final 12–18 months of a loan. Most of the interest has already been paid; the remaining EMIs are mostly principal. The interest saved will be small, while the foreclosure fee is still a percentage of remaining principal. Use this calculator to check the numbers for any closure month.",
          "Tax consideration: For home loans, the interest paid qualifies for deduction under Section 24 (up to ₹2 lakh/year for self-occupied property). Foreclosing eliminates this deduction in future years — a hidden cost not shown here. Weigh this against the interest saved.",
        ],
      },
      {
        heading: "Foreclosure Fees by Loan Type in India",
        paragraphs: [
          "Floating-rate home loans from banks: 0% prepayment/foreclosure fee (RBI mandate since 2012). This makes home loan foreclosure almost always beneficial if you have surplus funds.",
          "Fixed-rate home loans and loans from HFCs: May charge 0–2% of outstanding principal. Check your sanction letter for exact terms.",
          "Personal loans: Typically 1–5% of outstanding principal, sometimes with a minimum lock-in period (e.g., no foreclosure in the first 6–12 months). Some lenders charge a flat ₹1,000–5,000 fee instead of a percentage.",
          "Auto loans: Usually 2–6% of outstanding, with some lenders requiring 3–6 months of advance EMIs as the closure charge. Electric vehicle loans may have different terms.",
          "Business and MSME loans: Highly variable — 0% for government-backed MUDRA/CGTMSE loans to 4–5% for NBFC products. Always request the foreclosure statement from your lender before acting.",
        ],
      },
      {
        heading: "How to Initiate Foreclosure — Practical Steps",
        paragraphs: [
          "Step 1: Request a Foreclosure Statement from your lender (branch, net banking, or customer care). This document shows the exact closure amount valid for a specific date — their figure is authoritative and supersedes any calculator estimate.",
          "Step 2: Transfer the exact foreclosure amount (typically via NEFT/RTGS/Demand Draft) on or before the validity date of the foreclosure statement. Do not use UPI for large amounts — verify IFSC, account number, and transfer limits.",
          "Step 3: Collect the No Objection Certificate (NOC) and all original documents (property papers, RC book, etc.) within 15–30 days post-closure. Follow up proactively — document collection is your responsibility.",
          "Step 4: For home loans, get the lien/mortgage removed from the property records at the sub-registrar's office. This is called satisfaction of mortgage and requires the NOC plus a registered deed of release in many states.",
        ],
      },
    ],
    tables: [
      {
        title: "Loan Foreclosure at Different Months — ₹5,00,000 @ 14% for 5 Years, Fee: 2%",
        columnHeaders: ["Closure Month", "EMIs Paid", "Outstanding (₹)", "Fee @ 2% (₹)", "Total Closure (₹)", "Interest Saved (₹)"],
        rows: [
          ["12", "12", "4,28,490", "8,570", "4,37,060", "1,22,380"],
          ["24", "24", "3,39,850", "6,797", "3,46,647", "79,620"],
          ["36", "36", "2,26,810", "4,536", "2,31,346", "44,080"],
          ["48", "48", "88,240", "1,765", "90,005", "10,020"],
          ["54", "54", "40,110", "802", "40,912", "2,210"],
        ],
      },
      {
        title: "Foreclosure Fee Breakeven — At What Fee % Does Foreclosure Stop Making Sense?",
        columnHeaders: ["Closure Month", "Interest Saved (₹)", "Outstanding (₹)", "Breakeven Fee %", "Verdict if Bank Charges 2%"],
        rows: [
          ["12", "1,22,380", "4,28,490", "28.5%", "Foreclose — saves ₹1,13,810 net"],
          ["24", "79,620", "3,39,850", "23.4%", "Foreclose — saves ₹72,823 net"],
          ["36", "44,080", "2,26,810", "19.4%", "Foreclose — saves ₹39,544 net"],
          ["48", "10,020", "88,240", "11.4%", "Foreclose — saves ₹8,255 net"],
          ["54", "2,210", "40,110", "5.5%", "Marginal — only ₹1,408 net saved at 2%"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Outstanding balance declining toward foreclosure month",
      caption: "The balance curve shows how much principal remains at each month — the amount you must settle to foreclose. Early in the tenure, the balance is high but so is the interest you save. Late in the tenure, both are small.",
    },
    faq: [
      {
        question: "Is foreclosure the same as prepayment?",
        answer:
          "No — they are different. Prepayment (or part payment) reduces the outstanding principal while keeping the loan account active; future EMIs continue at a revised schedule. Foreclosure closes the loan entirely — no more EMIs, account is settled. Some lenders use 'prepayment' to mean any early payment, including full closure, which causes confusion. Clarify with your lender whether you want partial prepayment or full foreclosure.",
      },
      {
        question: "Do all loans in India charge a foreclosure fee?",
        answer:
          "No. Floating-rate home loans from banks and most HFCs are exempt from foreclosure charges under RBI's 2012 circular. Fixed-rate home loans, personal loans, auto loans, and NBFC products typically charge 1–5% of outstanding or prepaid amount. Always check your specific loan sanction letter and loan agreement — not the general policy, as individual loan terms override general policy.",
      },
      {
        question: "When should I foreclose versus make partial prepayments?",
        answer:
          "Partial prepayments are better when you do not have enough funds for full foreclosure but want to reduce interest. They keep the loan active with a shorter tenure or lower EMI. Choose full foreclosure when: you have sufficient surplus funds, the foreclosure fee is small relative to interest saved (use this calculator), and you want to eliminate the EMI obligation entirely. Partial prepayments on the same amount save less total interest than foreclosure because you continue paying interest on the remaining balance.",
      },
      {
        question: "What documents do I need after loan foreclosure?",
        answer:
          "After paying the foreclosure amount: (1) NOC (No Objection Certificate) from the lender — always in writing, (2) Original documents held as security (property deed, RC book, insurance papers), (3) Form 35 (for hypothecation removal on vehicle loans — submit to RTO), (4) For home loans: 'Satisfaction of mortgage' letter for registration at sub-registrar's office to remove mortgage lien, (5) Updated CIBIL report showing 'Closed' status — check 30–45 days post-closure.",
      },
      {
        question: "How long does it take for a foreclosed loan to reflect as 'Closed' in my credit report?",
        answer:
          "Most lenders update credit bureaus (CIBIL, Experian, Equifax) within 30–45 days of receiving the foreclosure payment. If the loan still shows 'Active' or 'Overdue' after 60 days, raise a dispute with CIBIL using your closure letter and payment receipt. A correctly closed loan in good standing has a neutral to slightly positive effect on your credit score over time.",
      },
    ],
    meta: {
      seoTitle: "Loan Foreclosure Calculator — Total Closure Amount, Fee & Interest Saved | mywebcalculator",
      seoDescription:
        "Calculate exact loan foreclosure amount including outstanding balance, penalty fee, and interest saved. Step-by-step formula, worked examples for personal and home loans, breakeven fee analysis, and documents checklist.",
      keywords: [
        "loan foreclosure calculator",
        "foreclosure amount calculator",
        "home loan foreclosure calculator",
        "loan closure penalty calculator",
        "prepayment foreclosure fee india",
        "personal loan foreclosure charges",
        "foreclose loan early interest saved",
        "loan payoff amount calculator",
        "noc after loan foreclosure",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "loan-prepayment-savings-calculator": {
    slug: "loan-prepayment-savings-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Assumes tenure reduction (EMI unchanged) after a lump-sum prepayment — the option that typically saves the most total interest. Switch to the EMI Reduction vs Tenure Reduction calculator to compare both paths.",
    sections: [
      {
        heading: "What Is Loan Prepayment Savings?",
        paragraphs: [
          "A one-time prepayment is a lump-sum amount you pay toward the outstanding principal on top of your regular EMI, at any point during the loan tenure. Because interest is calculated on the remaining balance (reducing-balance method), every rupee prepaid immediately reduces the base on which future interest is charged. This creates a compounding savings effect: less principal → less interest each month → principal falls faster → loan closes sooner.",
          "This calculator models the 'tenure reduction' option — you keep paying the same EMI but the loan closes earlier. This is the option that maximizes total interest saved. If you prefer to reduce your monthly payment instead, use the EMI Reduction vs Tenure Reduction Calculator to compare both outcomes side by side.",
          "The savings are disproportionately large when you prepay early in the tenure. In the first few years, the majority of each EMI is pure interest (because the outstanding principal is highest). A ₹1 lakh prepayment in year 2 of a 20-year home loan saves 2–3× more interest than the same prepayment in year 15.",
        ],
      },
      {
        heading: "Formula: Prepayment with Tenure Reduction",
        paragraphs: [
          "Step 1 — Compute standard EMI: EMI = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P = principal, r = monthly rate (APR ÷ 12), n = total EMIs.",
          "Step 2 — Run amortization until prepayment month M. Record outstanding balance B_M after that month's EMI.",
          "Step 3 — Apply prepayment: New principal = B_M − Prepayment Amount.",
          "Step 4 — Solve for new tenure: n_new = −ln[1 − (New Principal × r) ÷ EMI] ÷ ln(1 + r). This gives the number of remaining months to close the loan at the same EMI.",
          "Step 5 — Interest saved = (Total interest in original schedule from month M+1 to end) − (Total interest in new schedule from month M+1 to new end). Equivalently: Interest saved = [EMI × (n − M)] − [EMI × n_new] − Prepayment Amount + Prepayment Amount = [EMI × (n − M − n_new)]. In simple terms: every month you cut from the original schedule eliminates one full EMI worth of principal + interest.",
        ],
      },
      {
        heading: "Worked Example: ₹20 Lakh Home Loan Prepayment",
        paragraphs: [
          "Loan: ₹20,00,000 at 8.5% p.a. for 20 years (240 months). Monthly rate r = 8.5 ÷ 12 ÷ 100 = 0.7083%. EMI = ₹17,356/month. Total interest over full term = ₹17,356 × 240 − ₹20,00,000 = ₹21,65,440.",
          "Prepayment of ₹2,00,000 at month 36 (after 3 years): Outstanding at month 36 ≈ ₹18,57,000. New principal = ₹16,57,000. New remaining tenure = −ln[1 − 16,57,000 × 0.007083 ÷ 17,356] ÷ ln(1.007083) ≈ 175 months (was 204 months remaining). Months saved = 29.",
          "Interest saved ≈ 29 months × average payment content ≈ ₹3,40,000–₹3,80,000. Effective return on the ₹2 lakh prepayment = 8.5% p.a. guaranteed, risk-free, and for home loans — tax-favored (Section 80C). Compare: a 3-year FD at 7% yields roughly ₹45,000 post-tax on ₹2 lakh; the prepayment saves ₹3.5 lakh over the remaining term.",
        ],
      },
      {
        heading: "Prepayment Strategy: When, How Much, and How Often",
        paragraphs: [
          "When to prepay: As early as possible. The benefit decays as the tenure progresses because the outstanding principal (the base for future interest) shrinks naturally. A prepayment in the first 20% of tenure often saves 2–3× the interest compared to the same amount in the last 20%.",
          "How much to prepay: The marginal return on prepayment is constant at your loan rate regardless of prepayment size. However, practical considerations matter: (a) Maintain 6 months of expenses as an emergency fund before prepaying. (b) Exhaust high-interest debt first (credit cards at 36–42% p.a. > personal loans at 14–18% > home loans at 8–10%). (c) Do not prepay if you lose better-returning investments — equity SIPs with 10–12% CAGR over 10+ years may outperform a 8.5% home loan prepayment.",
          "How often: For floating-rate home loans (0% prepayment fee), prepay as often as you have surplus cash — even ₹5,000–10,000 at a time. Each prepayment resets the amortization and compounds with future savings. For loans with prepayment fees, calculate whether the interest saved exceeds the fee before each prepayment.",
          "Tax note: Home loan principal repayment (including voluntary prepayments) qualifies for Section 80C deduction up to ₹1.5 lakh/year. If you are already at the ceiling from other 80C investments, additional principal repayments provide no marginal tax benefit. However, the guaranteed interest saving remains valuable regardless of tax status.",
        ],
      },
      {
        heading: "Prepayment vs Other Uses of Surplus Money",
        paragraphs: [
          "The comparison framework: Your loan rate (say 8.5%) is a guaranteed, risk-free return. Compare it with post-tax returns on other options. An FD at 7% gives ~5% post-tax (30% tax bracket). Debt mutual funds give ~6–7% pre-tax, ~5.5% post-tax. Equity mutual funds historically give 10–12% CAGR but with high volatility and uncertainty over short horizons (3–5 years).",
          "For time horizons under 5 years: Prepayment usually wins over FDs and debt funds. For horizons over 10 years: Equity SIPs often win mathematically, but only if you can stay invested without panic-selling. The psychological benefit of reduced debt and lower financial stress is real and often underweighted in pure financial comparisons.",
          "Employer PF/EPF match: If your employer matches PF contributions beyond the mandatory 12%, capture that first — it is a 100% instant return. Then prepay if the loan rate exceeds available risk-free returns.",
        ],
      },
    ],
    tables: [
      {
        title: "Prepayment Impact — ₹20,00,000 @ 8.5% p.a. for 20 Years (Tenure Reduction)",
        columnHeaders: ["Prepayment (₹)", "At Month", "Outstanding Before (₹)", "Months Saved", "Interest Saved (₹)", "Effective Return"],
        rows: [
          ["50,000", "12", "19,69,450", "3", "42,500", "8.5% p.a."],
          ["2,00,000", "12", "19,69,450", "14", "1,82,000", "8.5% p.a."],
          ["2,00,000", "36", "18,57,000", "12", "1,58,000", "8.5% p.a."],
          ["5,00,000", "12", "19,69,450", "40", "4,92,000", "8.5% p.a."],
          ["2,00,000", "120", "14,32,000", "7", "62,000", "8.5% p.a."],
        ],
      },
      {
        title: "Impact of Prepayment Timing — ₹2 Lakh Prepayment on ₹20L Loan @ 8.5%, 20 yr",
        columnHeaders: ["Prepayment at Year", "Outstanding at Prepayment (₹)", "Months Saved", "Interest Saved (₹)", "Interest Saved vs Year-2 Prepayment"],
        rows: [
          ["Year 1 (month 12)", "19,69,450", "14", "1,82,000", "Baseline (maximum saving)"],
          ["Year 3 (month 36)", "18,57,000", "12", "1,58,000", "−13% vs Year 1"],
          ["Year 5 (month 60)", "17,18,000", "10", "1,28,000", "−30% vs Year 1"],
          ["Year 10 (month 120)", "12,89,000", "6", "62,000", "−66% vs Year 1"],
          ["Year 15 (month 180)", "7,15,000", "3", "22,000", "−88% vs Year 1"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Balance after prepayment vs standard schedule",
      caption: "After prepayment, the balance drops sharply and the loan reaches zero sooner than the original term. The earlier the prepayment, the steeper the divergence between the two curves — representing total interest saved.",
    },
    faq: [
      {
        question: "Should I reduce tenure or reduce EMI after prepayment?",
        answer:
          "Tenure reduction (keep same EMI, close sooner) almost always saves more total interest. Here's why: with tenure reduction, each future EMI still has the same large principal component — you clear debt faster. With EMI reduction, you pay a smaller amount each month on a balance that shrinks slowly, accruing interest for the full remaining original term. Choose EMI reduction only if your monthly cash flow is genuinely under stress — for example, after a job change or income cut. This calculator models tenure reduction.",
      },
      {
        question: "Is there a tax benefit on loan prepayment in India?",
        answer:
          "Yes, for home loans. Principal repayment (including voluntary prepayments) qualifies for Section 80C deduction up to ₹1.5 lakh/year. Home loan interest paid qualifies under Section 24(b) — up to ₹2 lakh/year for self-occupied property, unlimited for let-out property. Note: If you prepay a large amount and reduce the remaining interest to below ₹2 lakh, you may lose the full Section 24 deduction — calculate the tax impact before large prepayments. For personal loans, auto loans, and business loans, no such deductions apply.",
      },
      {
        question: "Do banks charge a fee for prepayment on home loans?",
        answer:
          "For floating-rate home loans from banks: No — the RBI circular RBI/2011-12/540 prohibits prepayment charges. For fixed-rate home loans: banks may charge up to 2% of the prepaid amount. HFCs (Housing Finance Companies) are regulated by the NHB and generally follow similar norms, but check your specific sanction letter. For personal loans, auto loans, and NBFC products, prepayment charges of 1–5% are common, sometimes with a minimum lock-in period of 6–12 months.",
      },
      {
        question: "How is this calculator different from the EMI with prepayment calculator?",
        answer:
          "Both use the same underlying reducing-balance amortization math. The difference is framing and context. This calculator (Loan Prepayment Savings) is focused on summarizing the savings from a single lump-sum prepayment in the context of the Prepayment & Foreclosure hub — it emphasizes interest saved, months saved, and the savings comparison. The EMI with Prepayment calculator in the Advanced EMI hub is more general-purpose and includes the revised amortization schedule. Use this one for a quick savings check; use the other for detailed schedule review.",
      },
      {
        question: "What is the minimum prepayment amount banks accept?",
        answer:
          "Most banks set a minimum prepayment amount equivalent to 3–6 months of EMI. For a typical ₹20 lakh home loan at ₹17,356 EMI, that is ₹52,000–₹1,04,000. Some banks accept amounts as low as ₹10,000 per transaction via net banking. Smaller amounts (like ₹1,000) may not trigger an amortization reset — the bank may hold it in a 'suspense account' until the minimum is reached. Always confirm your bank's minimum prepayment policy and instruct them explicitly that the transfer should be applied toward 'principal reduction'.",
      },
    ],
    meta: {
      seoTitle: "Loan Prepayment Savings Calculator — Interest & Months Saved | mywebcalculator",
      seoDescription:
        "Calculate how much interest and time you save with a one-time lump-sum loan prepayment. Tenure reduction model with worked examples, prepayment timing analysis, and comparison with investment alternatives.",
      keywords: [
        "loan prepayment savings calculator",
        "prepayment interest saved calculator",
        "home loan prepayment calculator india",
        "lump sum prepayment savings",
        "reduce loan tenure calculator",
        "prepayment vs investment comparison",
        "how much to prepay home loan",
        "tenure reduction after prepayment",
        "section 80c home loan prepayment",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "emi-reduction-vs-tenure-reduction-calculator": {
    slug: "emi-reduction-vs-tenure-reduction-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Compares two standard lender options after a part payment: keep EMI and shorten tenure vs keep tenure and recast to a lower EMI. Both paths use the same reducing-balance amortization engine.",
    sections: [
      {
        heading: "The Two Paths After a Part Payment",
        paragraphs: [
          "After you make a part payment (lump-sum payment toward outstanding principal), lenders typically offer you two choices. Path 1 — Tenure Reduction: Your EMI stays the same, but the loan closes sooner because the principal is lower. Path 2 — EMI Reduction (also called EMI recast): Your remaining tenure stays the same, but your monthly payment is recalculated to a lower amount based on the reduced principal.",
          "These two paths save different amounts of total interest and serve different financial needs. Tenure reduction almost always saves more total interest; EMI reduction improves monthly cash flow at the cost of higher total interest paid. This side-by-side calculator shows you exactly how much each path saves so you can make an informed decision.",
          "Note: Some lenders call Path 2 'loan restructuring' or 'EMI recasting'. The underlying math is the same — you are solving for new EMI using the outstanding balance as the new principal with the remaining original months as the new tenure.",
        ],
      },
      {
        heading: "How Each Path Is Calculated",
        paragraphs: [
          "Shared setup: Run standard amortization from month 1 to part payment month M. Record outstanding balance B_M and the interest paid so far (I_pre).",
          "Tenure reduction path: Keep EMI constant. Solve for new remaining months n_new = −ln[1 − (B_M − Part Payment) × r ÷ EMI] ÷ ln(1 + r). Total interest = I_pre + (sum of interest in n_new remaining months at the same EMI). Interest saved = Original total interest − Total interest (tenure path).",
          "EMI reduction path: Keep remaining months n_rem = original n − M. Compute new EMI = (B_M − Part Payment) × r × (1 + r)^n_rem ÷ [(1 + r)^n_rem − 1]. Total interest = I_pre + (New EMI × n_rem) − (B_M − Part Payment). Interest saved = Original total interest − Total interest (EMI path).",
          "Comparison: Interest saved (tenure path) is always ≥ Interest saved (EMI path) for the same part payment. The difference between the two savings figures represents the 'cost of choosing EMI reduction' — the extra interest you pay to get a lower monthly payment.",
        ],
      },
      {
        heading: "Worked Example: ₹30 Lakh Home Loan, ₹3 Lakh Part Payment",
        paragraphs: [
          "Loan: ₹30,00,000 at 8.75% p.a. for 20 years (240 months). Monthly rate r = 0.7292%. EMI = ₹26,431/month. Total interest over full term = ₹26,431 × 240 − ₹30,00,000 = ₹33,43,440.",
          "Part payment of ₹3,00,000 at month 36 (after 3 years). Outstanding at month 36 ≈ ₹28,00,000. New principal = ₹25,00,000. Original remaining months = 204.",
          "Tenure path: Same EMI ₹26,431. New remaining months = −ln[1 − 25,00,000 × 0.007292 ÷ 26,431] ÷ ln(1.007292) ≈ 164 months (saves 40 months). Interest saved ≈ ₹7,42,000.",
          "EMI path: Same remaining 204 months. New EMI = 25,00,000 × 0.007292 × (1.007292)^204 ÷ [(1.007292)^204 − 1] ≈ ₹22,450/month (saves ₹3,981/month). Interest saved ≈ ₹5,12,000.",
          "Trade-off: Tenure reduction saves ₹2,30,000 more interest but requires continuing to pay ₹26,431/month. EMI reduction gives ₹3,981 of monthly relief but costs ₹2,30,000 more in total interest over 204 months.",
        ],
      },
      {
        heading: "Which Option Should You Choose?",
        paragraphs: [
          "Choose tenure reduction if: (1) You can comfortably afford the current EMI, (2) You want to maximize total interest savings, (3) Your income is stable and you do not anticipate cash flow stress in the near future, (4) You are planning additional part payments in future years — tenure reduction compounds the benefit of future prepayments more effectively.",
          "Choose EMI reduction if: (1) Your monthly cash flow is under genuine pressure (income drop, new large expense, job uncertainty), (2) You have other high-interest debt that the freed monthly cash could service, (3) You plan to invest the monthly saving at a rate higher than your loan rate (uncommon in the current rate environment for safe instruments), (4) You are close to retirement and want to reduce fixed monthly obligations.",
          "A hybrid approach: Some lenders allow you to choose tenure reduction for most of the part payment and take a modest EMI reduction. Not all lenders support this — ask your bank relationship manager.",
        ],
      },
      {
        heading: "Frequently Confused Points About EMI Recast",
        paragraphs: [
          "Does EMI recast change the interest rate? No. The EMI is recalculated on the same APR and same remaining months. Only the payment amount changes. If you want a rate reduction, you need to separately negotiate a rate reset or consider a balance transfer.",
          "Can I switch from EMI reduction back to the faster payoff path later? Yes — you can make another part payment in the future and choose tenure reduction at that point. The two decisions are independent. Many borrowers choose EMI reduction for immediate relief and then accelerate payoff once their finances stabilize.",
          "Does choosing EMI reduction affect my credit score? No. Both choices are legitimate loan management actions. Neither registers as a negative event with credit bureaus. Only missed payments, defaults, and restructuring-under-distress flags affect your CIBIL score.",
        ],
      },
    ],
    tables: [
      {
        title: "Tenure vs EMI Reduction — ₹30,00,000 @ 8.75%, 20 yr, ₹3L Part Payment at Month 36",
        columnHeaders: ["Metric", "Tenure Reduction Path", "EMI Reduction Path", "Advantage"],
        rows: [
          ["New EMI / Payment", "₹26,431 (unchanged)", "₹22,450 (new)", "EMI path: ₹3,981/month less"],
          ["Months remaining after payment", "164 months", "204 months", "Tenure path: 40 months shorter"],
          ["Interest saved vs no part payment", "₹7,42,000", "₹5,12,000", "Tenure path: ₹2,30,000 more saved"],
          ["Total interest paid (lifetime)", "₹25,27,000", "₹27,57,000", "Tenure path: ₹2,30,000 less"],
          ["Total cash flow relief (monthly)", "None", "₹3,981/month for 204 months", "EMI path: ₹8,12,124 total cash freed"],
        ],
      },
      {
        title: "EMI Reduction vs Tenure Reduction Across Part Payment Amounts — ₹30L @ 8.75%, Part Payment at Month 36",
        columnHeaders: ["Part Payment (₹)", "Tenure Saved (months)", "Interest Saved — Tenure (₹)", "New EMI (EMI path)", "Interest Saved — EMI (₹)", "Extra Interest Cost of EMI Path (₹)"],
        rows: [
          ["1,00,000", "13", "2,27,000", "₹25,548", "1,57,000", "70,000"],
          ["2,00,000", "26", "4,80,000", "₹24,646", "3,34,000", "1,46,000"],
          ["3,00,000", "40", "7,42,000", "₹22,450", "5,12,000", "2,30,000"],
          ["5,00,000", "71", "13,38,000", "₹19,642", "9,20,000", "4,18,000"],
          ["10,00,000", "—*", "—*", "₹13,214", "17,89,000", "—*"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Balance trajectory under tenure reduction path",
      caption: "The tenure-reduction path reaches zero balance sooner than the EMI-recast path. The gap between the two curves represents the extra interest cost of choosing EMI reduction — the 'price' of lower monthly payments.",
    },
    faq: [
      {
        question: "Why does tenure reduction always save more interest than EMI reduction?",
        answer:
          "Because you stop paying interest sooner. Under tenure reduction, you continue paying the full original EMI — a significant portion of which is now principal (since outstanding is lower). The loan is retired faster, and all future interest charges are eliminated. Under EMI reduction, the same reduced balance is spread over the full original remaining months. Each month's lower payment covers less principal, so the balance shrinks more slowly, and interest accrues for many more months. The math always favors tenure reduction for total interest savings.",
      },
      {
        question: "Can I switch from EMI reduction to tenure reduction later?",
        answer:
          "Yes. Your choice at the time of each part payment is independent. You can choose EMI reduction now (for cash flow relief) and tenure reduction on your next part payment (to maximize savings). Some lenders also allow you to request a switch mid-tenure even without a new prepayment — ask your bank. Policies vary between lenders, so clarify in writing.",
      },
      {
        question: "Does EMI recast change my interest rate?",
        answer:
          "No. EMI recast (EMI reduction path) recalculates your monthly payment using the same interest rate and same remaining tenure, but on a reduced principal. Your rate is unchanged. If you want a lower interest rate, that requires a separate negotiation with your lender or a balance transfer to a new lender offering a lower rate — a different process entirely.",
      },
      {
        question: "What if my lender does not offer a choice and automatically reduces the EMI?",
        answer:
          "Some lenders automatically apply EMI reduction as the default after a part payment. If you prefer tenure reduction, you must explicitly request it — call customer care, visit the branch, or submit a written request before making the payment. It is easier to specify your preference upfront than to reverse a posted transaction. Get a revised amortization schedule from your lender whichever option you choose, confirming the new terms in writing.",
      },
      {
        question: "How do I calculate the 'cost' of choosing EMI reduction over tenure reduction?",
        answer:
          "The cost = (Interest saved by tenure path) − (Interest saved by EMI path). This calculator shows both figures directly. In the worked example above (₹30L loan, ₹3L part payment at month 36), the cost of choosing EMI reduction is ₹7,42,000 − ₹5,12,000 = ₹2,30,000 in extra lifetime interest — in exchange for ₹3,981/month cash flow relief. Whether that trade-off is worth it depends entirely on your financial situation. If you invest the ₹3,981/month at 10% p.a. for 17 years (remaining term), you would accumulate approximately ₹19 lakh — far exceeding the ₹2.3 lakh extra interest cost, making EMI reduction the mathematically better choice if you actually invest the saving. But most borrowers spend it rather than invest it.",
      },
    ],
    meta: {
      seoTitle: "EMI Reduction vs Tenure Reduction Calculator — Compare Savings After Part Payment | mywebcalculator",
      seoDescription:
        "Compare interest saved when you choose tenure reduction vs EMI recast after a part payment. Side-by-side results, worked examples for ₹30L home loan, and guide on which option suits your situation.",
      keywords: [
        "emi reduction vs tenure reduction calculator",
        "reduce emi or tenure after prepayment",
        "part payment emi recast calculator india",
        "tenure reduction calculator",
        "emi recast calculator india",
        "should i reduce emi or tenure",
        "home loan part payment options",
        "emi recasting after prepayment",
        "interest saved tenure reduction",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "early-loan-closure-calculator": {
    slug: "early-loan-closure-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Early closure payoff uses outstanding balance after the selected month's EMI. Optional fee field covers processing or penalty charges if applicable. Always obtain a closure statement from your lender — their figure is authoritative.",
    sections: [
      {
        heading: "What Is Early Loan Closure?",
        paragraphs: [
          "Early loan closure means paying off the entire remaining principal balance before the contractual end date, settling the loan account in full. Unlike a partial prepayment that keeps the loan active, early closure terminates the account entirely — you stop all future EMIs and avoid all remaining scheduled interest.",
          "The payoff amount is the outstanding principal balance after your last regular EMI, plus any closure fee your lender charges. This is distinct from the original loan principal (which you borrowed at the start); the outstanding balance is what remains after months of repayment, and it is always lower than the original principal in a reducing-balance loan.",
          "Early closure is one of the most powerful financial moves available to a borrower. Eliminating a 9% loan is mathematically equivalent to earning a 9% guaranteed, risk-free return on the payoff amount. For loans at 12–16% (personal loans, auto loans), the case for early closure is even stronger.",
        ],
      },
      {
        heading: "How the Payoff Amount and Interest Saved Are Calculated",
        paragraphs: [
          "Step 1 — Run the amortization schedule from loan start to your target closure month M. The standard EMI formula gives monthly payment; each month splits into interest (Balance × r) and principal (EMI − Interest).",
          "Step 2 — Outstanding at closure month M = balance after that month's EMI and principal deduction. This is the baseline payoff amount with no fee.",
          "Step 3 — Optional closure fee = Outstanding × (Fee % ÷ 100). Add this to outstanding for the total payoff amount.",
          "Step 4 — Interest saved = sum of all interest components in months M+1 through the original end month n. This represents what you would have paid in interest if you continued, and what you avoid by closing early.",
          "Step 5 — Net financial benefit = Interest saved − Total closure fee. If this is positive (and it almost always is except very late in the tenure), early closure makes financial sense.",
        ],
      },
      {
        heading: "Worked Example: ₹10 Lakh Auto Loan Early Closure",
        paragraphs: [
          "Loan: ₹10,00,000 at 10.5% p.a. for 7 years (84 months). Monthly rate r = 10.5 ÷ 12 ÷ 100 = 0.875%. EMI = ₹16,769/month. Total interest over full term = ₹16,769 × 84 − ₹10,00,000 = ₹4,08,596.",
          "Early closure at month 36 (after 3 years): Outstanding balance ≈ ₹6,71,200. Closure fee @ 3% = ₹20,136. Total payoff = ₹6,91,336. Interest saved (months 37–84, i.e. 48 months) ≈ ₹1,83,200.",
          "Net saving = ₹1,83,200 − ₹20,136 = ₹1,63,064. You hand over ₹6,91,336 today and eliminate 48 future EMIs of ₹16,769 (= ₹8,04,912). The ₹1,13,576 difference (₹8,04,912 − ₹6,91,336) is the sum of all future principal + interest you would have paid. Of that, ₹1,83,200 is pure interest you save; the rest is your own principal which you would have repaid anyway.",
          "Bottom line: You spend ₹6.9 lakh now instead of ₹8.0 lakh over 4 years. If you have the ₹6.9 lakh available (or can liquidate an investment), early closure is almost certainly the right move for a 10.5% auto loan.",
        ],
      },
      {
        heading: "Early Closure vs Continued EMI: The Opportunity Cost Framework",
        paragraphs: [
          "The key question is: what would you do with the payoff amount if you did NOT close the loan? If the answer is 'keep it in a savings account at 4%' or 'FD at 7% (pre-tax)' — early closure at 10.5% wins decisively. Your loan rate (10.5%) is the guaranteed after-tax return on the payoff amount; few risk-free instruments match this.",
          "When continued EMI may be better: If you are in a high growth phase of an equity SIP (expected returns 12–14% over 10+ years), the math may favor not closing the loan. But this requires discipline — not redirecting the freed EMI to consumption. Also, equity returns are uncertain; the loan interest saving is certain.",
          "Liquidity consideration: The biggest risk of early closure is locking up your cash. If an emergency arises after closure, you cannot 'un-close' the loan — you would need a fresh loan at potentially higher rates. Always maintain an emergency fund of 6 months of expenses before making any large prepayment or closure.",
          "Tax consideration: For home loans, closing early eliminates future interest deductions under Section 24(b) (up to ₹2 lakh/year for self-occupied property). Calculate the tax value of these deductions over the remaining years before deciding. For personal loans and auto loans, no such tax angle exists — early closure is straightforward.",
        ],
      },
      {
        heading: "Practical Steps to Close a Loan Early",
        paragraphs: [
          "Step 1 — Request a Foreclosure / Closure Statement from your lender. This document specifies the exact amount valid until a given date (typically 7–30 days). It is the only authoritative figure — use it, not this calculator's estimate, for the actual payment.",
          "Step 2 — Verify the breakup in the closure statement: outstanding principal, any accrued interest (especially if you are closing mid-cycle between EMIs), closure fee, GST on the fee (18% GST applies to service charges), and any other administrative charges.",
          "Step 3 — Pay via RTGS/NEFT/DD on or before the validity date. For large amounts, use RTGS (₹2 lakh+) for same-day settlement. Keep the payment receipt.",
          "Step 4 — Collect the No Objection Certificate (NOC) within 15–30 days. For secured loans: collect original security documents (property papers, vehicle RC book). For home loans: get the mortgage release deed registered at the sub-registrar's office.",
          "Step 5 — Monitor your CIBIL report 30–45 days later. Confirm the loan shows 'Closed' status. A prematurely closed loan (technical write-off) or error can negatively impact your credit score — dispute immediately with the bureau using your NOC if you see an error.",
        ],
      },
    ],
    tables: [
      {
        title: "Early Closure Comparison — ₹10,00,000 Auto Loan @ 10.5% for 7 Years (Closure Fee: 3%)",
        columnHeaders: ["Closure Month", "EMIs Paid", "Outstanding (₹)", "Fee @ 3% (₹)", "Total Payoff (₹)", "Months Remaining", "Interest Saved (₹)", "Net Saving (₹)"],
        rows: [
          ["12", "12", "8,68,900", "26,067", "8,94,967", "72", "2,72,000", "2,45,933"],
          ["24", "24", "7,71,100", "23,133", "7,94,233", "60", "2,30,900", "2,07,767"],
          ["36", "36", "6,71,200", "20,136", "6,91,336", "48", "1,83,200", "1,63,064"],
          ["48", "48", "5,61,500", "16,845", "5,78,345", "36", "1,28,100", "1,11,255"],
          ["60", "60", "3,89,400", "11,682", "4,01,082", "24", "65,700", "54,018"],
          ["72", "72", "1,65,200", "4,956", "1,70,156", "12", "15,800", "10,844"],
        ],
      },
      {
        title: "Break-even Analysis: At What Fee % Does Early Closure Stop Being Beneficial?",
        columnHeaders: ["Closure Month", "Interest Saved (₹)", "Outstanding (₹)", "Breakeven Fee %", "Verdict at 3% Fee"],
        rows: [
          ["Month 12", "2,72,000", "8,68,900", "31.3%", "Close — net saving ₹2,45,933"],
          ["Month 24", "2,30,900", "7,71,100", "30.0%", "Close — net saving ₹2,07,767"],
          ["Month 36", "1,83,200", "6,71,200", "27.3%", "Close — net saving ₹1,63,064"],
          ["Month 60", "65,700", "3,89,400", "16.9%", "Close — net saving ₹54,018"],
          ["Month 72", "15,800", "1,65,200", "9.6%", "Marginal — only ₹10,844 net saved"],
          ["Month 78", "4,200", "82,600", "5.1%", "Borderline — check if worth the paperwork"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Remaining balance if you continue vs close early",
      caption: "Each month you continue, you pay interest on the declining balance. Closing early eliminates all future interest charges shown in the shaded area under the balance curve. The earlier you close, the larger the shaded area — and the larger your interest saving.",
    },
    faq: [
      {
        question: "How is early loan closure different from loan foreclosure?",
        answer:
          "In practice, they are the same action — paying off the full remaining balance before term. The terminology difference is contextual. 'Foreclosure' is commonly used for loans with explicit foreclosure penalties and is emphasized when those fees are a major decision factor. 'Early closure' is a more general term that may or may not involve a fee. Both result in the loan account being closed and the borrower's obligation ending. This calculator lets you enter an optional fee for either scenario.",
      },
      {
        question: "Does early loan closure improve my credit score?",
        answer:
          "Closing a loan in good standing has a neutral to mildly positive effect on your credit score over time. The immediate impact can be slightly negative in some scoring models because it reduces your 'active credit mix' — but this is temporary and small. The bigger benefit is on your debt-to-income ratio, which improves as your total EMI obligation drops. Over 6–12 months, a cleanly closed loan is a positive entry on your credit history. Ensure the lender updates the bureau correctly — the loan should show 'Closed' not 'Written-off' or 'Settled'.",
      },
      {
        question: "Should I close my home loan early or invest the money?",
        answer:
          "This is the most common financial dilemma for mid-tenure home loan borrowers. The math: if your home loan rate is 8.5% and you can earn >8.5% post-tax on the payoff amount, investing wins. In practice: FDs give ~5% post-tax (30% bracket), debt funds ~5–6%. Equity funds historically give 10–12% CAGR but with 10+ year horizon and volatility. For peace of mind, risk aversion, and tax simplicity, closing the home loan is often the right personal finance choice even if the math slightly favors equity over a 20-year horizon. There is also the psychological value of being debt-free, which should not be dismissed.",
      },
      {
        question: "Do I need to pay the next EMI if I close mid-cycle?",
        answer:
          "It depends on your lender's policy and the closure date. Most lenders calculate the payoff amount inclusive of accrued interest up to the closure date — so the closure statement already accounts for any interest accrued since the last EMI. If your EMI is debited automatically, stop the auto-debit after confirming the closure date with your lender to avoid overpayment. Some lenders require the current month's EMI plus the outstanding balance; others quote a single all-in payoff figure. Always rely on the lender's closure statement, not this calculator, for the final payment amount.",
      },
      {
        question: "Is GST applicable on the early closure fee?",
        answer:
          "Yes. Prepayment/foreclosure charges are treated as a financial service, and 18% GST applies on the fee amount. So a 2% foreclosure fee on ₹5 lakh outstanding = ₹10,000 base fee + ₹1,800 GST = ₹11,800 total charge. This calculator's 'fee %' field should be entered as the base fee percentage only (not including GST). Add 18% of the fee figure manually, or request the all-inclusive closure statement from your lender which will show the GST component separately as required by the GST invoice format.",
      },
    ],
    meta: {
      seoTitle: "Early Loan Closure Calculator — Payoff Amount, Interest Saved & Break-even | mywebcalculator",
      seoDescription:
        "Calculate early loan closure payoff amount and total interest you avoid. Break-even fee analysis, worked examples for auto and home loans, closure checklist, and invest-vs-close comparison framework.",
      keywords: [
        "early loan closure calculator",
        "loan payoff calculator india",
        "close loan early calculator",
        "outstanding balance payoff amount",
        "interest saved early loan closure",
        "auto loan early closure charges",
        "home loan early closure vs investment",
        "loan foreclosure payoff calculator",
        "gst on foreclosure charges india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
