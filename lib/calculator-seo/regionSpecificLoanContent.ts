import type { RichArticle } from "./types";

const HUB_HREF = "/finance/loans-emi/region-specific-loan-tools";
const HUB_LABEL = "Finance · Region-Specific Loan Tools";

export const REGION_SPECIFIC_LOAN_ARTICLES: Record<string, RichArticle> = {
  "home-loan-emi-calculator-india": {
    slug: "home-loan-emi-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Uses standard reducing-balance EMI math in INR. Actual bank offers include processing fees, insurance mandates, and floating-rate resets not modeled here. Verify final numbers with your lender's sanction letter.",
    sections: [
      {
        heading: "How Home Loan EMI Works in India",
        paragraphs: [
          "Indian home loans from banks and Housing Finance Companies (HFCs) use the reducing-balance EMI method: the same formula as any standard amortizing loan. The monthly EMI = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P = loan principal (sanctioned amount), r = monthly interest rate (annual rate ÷ 12 ÷ 100), n = tenure in months.",
          "Interest is charged on the outstanding principal balance each month, not on the original loan amount. This means every rupee of principal you repay reduces the interest charged in all future months — the basis for why prepayments are so powerful on long home loans.",
          "The EMI stays constant throughout the tenure on fixed-rate home loans. On floating-rate home loans (which dominate India's market), the rate changes with your lender's benchmark — either MCLR (Marginal Cost of Funds-based Lending Rate) or EBLR/RLLR (External Benchmark-based Lending Rate, linked to the RBI repo rate). When the rate changes, your lender adjusts either the EMI or the tenure — check your loan agreement for which option applies.",
        ],
      },
      {
        heading: "India-Specific Parameters: Rates, LTV, and FOIR",
        paragraphs: [
          "Interest rates as of 2025: Home loan rates from major public sector banks and private banks typically range 8.25%–10.5% p.a. HFCs (LIC HFL, PNB Housing, Bajaj Housing) may offer slightly higher or lower depending on the product. NBFCs and smaller lenders charge a premium. For the best rate, compare across at least 3–4 lenders and factor in the benchmark rate (RBI repo rate, currently relevant as the EBLR anchor).",
          "Loan-to-Value (LTV) limits set by the RBI: Up to ₹30 lakh — 90% LTV (10% minimum down payment). ₹30 lakh to ₹75 lakh — 80% LTV (20% down). Above ₹75 lakh — 75% LTV (25% down). LTV is on the property's market value or agreement value, whichever is lower. This means your down payment is a significant consideration.",
          "FOIR (Fixed Obligation to Income Ratio): Lenders restrict your total EMI obligations (all loans combined) to 40–50% of your net monthly income. For a ₹50 lakh home loan at 8.5% for 20 years (EMI ≈ ₹43,391), you would need minimum net monthly income of ≈ ₹86,800–₹1,08,500 (with no other EMIs). High FOIR is the most common reason for home loan rejections or lower-than-requested sanctions.",
          "Processing fees: Banks charge 0.25%–0.5% of loan amount as processing fee, subject to GST at 18%. Some banks waive this periodically. HFCs often charge higher processing fees (0.5%–1%). This is a one-time cost and does not affect the EMI calculation but adds to the total cost of borrowing.",
        ],
      },
      {
        heading: "Worked Example: ₹50 Lakh Home Loan at 8.5% for 20 Years",
        paragraphs: [
          "Loan: ₹50,00,000 at 8.5% p.a. for 20 years (240 months). Monthly rate r = 8.5 ÷ 12 ÷ 100 = 0.70833%. EMI = ₹50,00,000 × 0.0070833 × (1.0070833)^240 ÷ [(1.0070833)^240 − 1] = ₹43,391/month.",
          "Total paid over 20 years = ₹43,391 × 240 = ₹1,04,13,840. Total interest = ₹1,04,13,840 − ₹50,00,000 = ₹54,13,840 — more than the original loan amount. This is the single most important number to internalize about long home loans: you will pay more in interest than you borrowed.",
          "If you shorten to 15 years: EMI = ₹49,282/month. Total interest = ₹38,70,760. Savings vs 20-year option: ₹15,43,080 in interest, at the cost of paying ₹5,891 more per month. The 15-year option saves ₹15 lakh in interest — a powerful argument for shorter tenure if cash flow permits.",
          "Impact of a 0.5% rate difference: Same ₹50 lakh for 20 years at 9.0% → EMI = ₹44,986 (₹1,595 more/month) and total interest = ₹57,96,640 (₹3,82,800 more than at 8.5%). Over 20 years, every 0.5% reduction in rate saves approximately ₹3.8–4 lakh in total interest on a ₹50 lakh loan.",
        ],
      },
      {
        heading: "Tax Benefits on Home Loan EMI in India",
        paragraphs: [
          "Section 80C — Principal repayment: The principal component of your home loan EMI qualifies for deduction under Section 80C of the Income Tax Act, up to a maximum of ₹1.5 lakh per financial year. This includes both the regular EMI's principal component and any voluntary prepayments. Note: the limit is shared with other 80C investments (PPF, ELSS, life insurance, etc.).",
          "Section 24(b) — Interest deduction: Interest paid on a home loan for a self-occupied property qualifies for deduction up to ₹2 lakh per financial year. For a let-out or deemed let-out property, there is no cap on the interest deduction (subject to other conditions). In early loan years when interest is ₹3–5 lakh/year, you cannot claim the full amount — only ₹2 lakh is deductible for self-occupied property.",
          "Section 80EEA — Additional deduction for affordable housing: First-time homebuyers of affordable housing (stamp duty value up to ₹45 lakh) could claim an additional ₹1.5 lakh interest deduction under Section 80EEA over and above the ₹2 lakh under Section 24(b). This made effective interest deduction ₹3.5 lakh/year — check current eligibility as these provisions are subject to revision in Finance Acts.",
          "PMAY (Pradhan Mantri Awas Yojana) Credit Linked Subsidy: Under PMAY-U's Credit Linked Subsidy Scheme (CLSS), eligible borrowers in EWS/LIG/MIG categories can receive upfront interest subsidy (now being restructured under PMAY 2.0). The subsidy is credited upfront to your loan account, reducing the principal and thus the EMI. Check current PMAY eligibility on the official NHB/MoHUA portal — the scheme parameters change with each phase.",
        ],
      },
      {
        heading: "Floating Rate vs Fixed Rate: What Applies to Your Loan",
        paragraphs: [
          "Floating rate (most common in India): Your rate is linked to an external benchmark — since October 2019, new home loans from banks must be linked to an external benchmark (RBI repo rate, 91-day T-bill, or 182-day T-bill). A spread is added over the benchmark to arrive at your rate. When the RBI cuts or hikes the repo rate, your effective rate changes within the same quarter. Floating rates are lower than fixed rates over a long cycle but create EMI or tenure uncertainty.",
          "Fixed rate: A minority of home loan products offer fixed rates, typically for 2–5 years before converting to floating. True 20–30 year fixed-rate home loans are rare in India and carry a higher initial rate to compensate for the lender's rate risk. HFCs and some NBFCs offer semi-fixed products. If you value payment certainty, compare the fixed rate premium against the floating rate before deciding.",
          "Which to choose: If RBI rates are high and likely to fall (easing cycle), floating rate benefits you as your EMI/tenure decreases with each rate cut. If rates are at historic lows and likely to rise, fixed rate locks in the low rate. In practice, most Indian borrowers take floating rate because it offers lower rates during normal and easing cycles, and the RBI has broadly maintained a bias toward growth-supportive rates.",
        ],
      },
    ],
    tables: [
      {
        title: "EMI Comparison Across Tenures and Rates — ₹50,00,000 Home Loan",
        columnHeaders: ["Tenure", "8.0% p.a. EMI (₹)", "8.5% p.a. EMI (₹)", "9.0% p.a. EMI (₹)", "9.5% p.a. EMI (₹)", "Total Interest @ 8.5% (₹)"],
        rows: [
          ["10 years", "60,665", "61,993", "63,338", "64,700", "24,39,160"],
          ["15 years", "47,782", "49,282", "50,714", "52,238", "38,70,760"],
          ["20 years", "41,822", "43,391", "44,986", "46,607", "54,13,840"],
          ["25 years", "38,590", "40,265", "41,960", "43,679", "70,79,500"],
          ["30 years", "36,688", "38,446", "40,231", "42,040", "88,40,560"],
        ],
      },
      {
        title: "Total Cost of a ₹50 Lakh Home Loan — 20 Years at 8.5%",
        columnHeaders: ["Component", "Amount (₹)", "% of Total Outflow", "Notes"],
        rows: [
          ["Down payment (20%)", "12,50,000", "10.7%", "Paid upfront from own funds"],
          ["Loan principal", "50,00,000", "42.9%", "Amount borrowed"],
          ["Total interest", "54,13,840", "46.4%", "Over 240 months"],
          ["Processing fee (0.5%)", "25,000 + GST", "0.2%", "One-time, lender-specific"],
          ["Property insurance", "~50,000 total", "0.4%", "Lender-mandated, variable"],
          ["Total all-in cost", "~1,17,38,840", "100%", "Excl. stamp duty & registration"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Outstanding balance over a typical Indian home loan tenure",
      caption: "Longer tenures keep the balance high for longer, meaning more months of interest accrual. The balance curve for a 20-year loan barely moves for the first 5–7 years — a visual reminder of why prepayments in early years save the most.",
    },
    faq: [
      {
        question: "Which rate should I enter — the interest rate or APR?",
        answer:
          "For Indian home loans, enter the annual interest rate as quoted in your sanction letter or the lender's product sheet (e.g., 8.5% p.a.). Indian lenders quote rates as nominal annual rates; the calculator converts to monthly rate by dividing by 12. The concept of APR (Annual Percentage Rate inclusive of all fees) is not commonly quoted in the Indian market — your sanction letter will show the interest rate and fees separately. For comparison purposes, add the processing fee cost amortized over the loan tenure to get a rough all-in APR.",
      },
      {
        question: "Should I choose the longest tenure for the lowest EMI?",
        answer:
          "Only if affordability requires it. Longer tenure lowers the monthly payment but dramatically increases total interest. A 30-year ₹50 lakh loan at 8.5% pays ₹88 lakh in interest — almost twice the original loan. A 20-year option saves ₹34 lakh in interest at the cost of ₹4,945 more per month. Use the shortest tenure your income (and FOIR limit) allows, then make prepayments to further reduce the effective term.",
      },
      {
        question: "How does the RBI repo rate affect my home loan EMI?",
        answer:
          "For repo-linked home loans (RLLR/EBLR), any change in the RBI repo rate directly changes your interest rate by the same magnitude, typically within the same quarter. When the RBI cuts the repo rate by 0.25%, your rate drops by 0.25% and your lender should either reduce your EMI or reduce your remaining tenure. For MCLR-linked loans, the pass-through takes 1–12 months depending on your reset frequency (quarterly, half-yearly, or annually as specified in your loan agreement).",
      },
      {
        question: "Is it better to take a home loan from a bank or an HFC?",
        answer:
          "Banks are regulated by the RBI and must link new floating-rate loans to external benchmarks (EBLR) — this means faster rate transmission. HFCs are regulated by the NHB and may use their own benchmark (PLR-linked); rate cuts may pass through more slowly. Banks often have better digital infrastructure and lower processing fees. HFCs may offer more flexible eligibility criteria, higher LTV for specific products, or better terms for self-employed borrowers. Compare the effective interest rate, processing charges, and prepayment flexibility from both types before deciding.",
      },
      {
        question: "What happens if I miss an EMI on my home loan?",
        answer:
          "Missing an EMI triggers a late payment fee (typically ₹200–500 or 2% of EMI, per lender's schedule). After 30 days, the account is flagged as 'SMA-0' (Special Mention Account) with credit bureaus. After 60 days, 'SMA-1'. After 90 days (3 consecutive missed EMIs), the loan is classified as NPA (Non-Performing Asset) — a serious negative event that severely lowers your CIBIL score and can trigger legal recovery proceedings. Always prioritize home loan EMI over other financial commitments, and contact your lender immediately if you anticipate a payment difficulty — most lenders have EMI moratorium or restructuring options for genuine cases.",
      },
    ],
    meta: {
      seoTitle: "Home Loan EMI Calculator India — Monthly EMI, Total Interest & Tax Benefits | mywebcalculator",
      seoDescription:
        "Calculate Indian home loan EMI with reducing-balance amortization. Compare tenures at 8–9.5% rates, understand LTV limits, FOIR norms, Section 24 and 80C tax benefits, and floating vs fixed rate trade-offs.",
      keywords: [
        "home loan emi calculator india",
        "housing loan emi calculator india",
        "home loan emi 2025 india",
        "home loan interest rate india",
        "section 24 home loan deduction",
        "section 80c home loan principal",
        "rllr eblr home loan calculator",
        "home loan ltv calculator india",
        "pmay home loan subsidy calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "personal-loan-emi-calculator-india": {
    slug: "personal-loan-emi-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Personal loan rates and fees vary significantly by lender type and CIBIL score. Processing fees (1–3%), GST on fees (18%), and prepayment charges are not included in the EMI calculation here.",
    sections: [
      {
        heading: "Personal Loan EMI in India — What Makes It Different",
        paragraphs: [
          "A personal loan is an unsecured loan — no property, vehicle, or other asset is pledged as collateral. Because the lender has no security to fall back on, personal loan interest rates are significantly higher than home or auto loans, typically 10–24% p.a. from mainstream lenders and even higher from fintech apps and digital lenders.",
          "EMIs are calculated using the same reducing-balance formula as home loans: EMI = P × r × (1 + r)^n ÷ [(1 + r)^n − 1]. Tenures are typically 1–7 years. The shorter tenure and higher rate mean total interest as a percentage of principal is much higher per rupee compared to home loans — making personal loan prepayment even more financially impactful.",
          "Key difference from home loans: There is no government subsidy (no PMAY equivalent), no tax deduction (except for business use), and no LTV limit (since there is no collateral). The sanctioned amount is based purely on income, credit score, employer profile, and existing EMI obligations.",
        ],
      },
      {
        heading: "What Determines Your Personal Loan Interest Rate",
        paragraphs: [
          "CIBIL score is the single biggest factor. Scores above 750 typically qualify for the best rates (10–13% from PSU banks, 11–15% from private banks). Scores 700–749 see rates 2–3% higher. Scores below 700 may be declined or offered at 18–24%+. Building and maintaining a CIBIL score above 750 before applying can save lakhs on a personal loan.",
          "Employer and income type: Salaried employees of listed companies, central/state government, PSUs, and reputed MNCs get preferential rates because default risk is lower. Self-employed professionals (doctors, CAs) often get competitive rates if income documentation is strong. Self-employed business owners face higher rates due to income variability. Gig workers and contract employees are the highest-risk category.",
          "Loan amount and tenure: Larger loan amounts from the same lender often attract marginally better rates (lower origination cost per rupee). Shorter tenures (1–2 years) sometimes command slightly better rates because the lender's exposure period is shorter. However, the EMI is much higher — match tenure to your repayment capacity, not just rate optimization.",
          "Lender type: PSU banks (SBI, PNB, Canara) offer the lowest rates but have stricter eligibility and slower processing. Private banks (HDFC, ICICI, Axis) offer faster disbursals with competitive rates. NBFCs (Bajaj Finserv, Fullerton) are more flexible on eligibility but charge higher rates. Fintech/digital lenders (MoneyTap, KreditBee, LazyPay) have the highest rates (18–36%+) but offer instant approval.",
        ],
      },
      {
        heading: "Worked Example: ₹5 Lakh Personal Loan at 14% for 5 Years",
        paragraphs: [
          "Loan: ₹5,00,000 at 14% p.a. for 5 years (60 months). Monthly rate r = 14 ÷ 12 ÷ 100 = 1.1667%. EMI = ₹5,00,000 × 0.011667 × (1.011667)^60 ÷ [(1.011667)^60 − 1] = ₹11,634/month.",
          "Total paid = ₹11,634 × 60 = ₹6,98,040. Total interest = ₹1,98,040 — essentially 40% of the principal amount in pure interest over 5 years. This is why financial advisors recommend using personal loans only for genuine needs, not discretionary spending.",
          "Processing fee reality: Most lenders charge 1–3% of loan amount upfront. On a ₹5 lakh loan at 2%, that's ₹10,000 + 18% GST = ₹11,800 deducted from disbursement. You receive ₹4,88,200 but repay ₹5,00,000 + ₹1,98,040 = ₹6,98,040. Effective all-in cost is higher than the stated 14% rate.",
          "Prepayment impact: If you prepay ₹1 lakh at month 18: Outstanding at month 18 ≈ ₹3,74,000. New principal = ₹2,74,000. Remaining months reduce from 42 to ~26. Interest saved ≈ ₹38,000. On a 14% personal loan, prepayment return is much higher than any FD or safe investment — clear it as fast as possible.",
        ],
      },
      {
        heading: "Personal Loan vs Alternatives — When to Use Each",
        paragraphs: [
          "Medical emergencies: A personal loan is appropriate when you need ₹1–10 lakh quickly and have no other liquid assets. Compare against hospital's EMI scheme (often 0% for 6–12 months via No Cost EMI) before taking a personal loan. Also check if your health insurance has a cashless/reimbursement option that eliminates the loan need.",
          "Home renovation: Consider a top-up on your existing home loan first. Top-up home loans carry home loan rates (8.5–10%) versus personal loan rates (13–18%) and may be tax-deductible under Section 24(b) if used for home improvement. A personal loan for home renovation is significantly more expensive.",
          "Debt consolidation: Using a lower-rate personal loan to close multiple high-rate credit card balances (where credit cards charge 36–42% p.a.) is one of the strongest use cases. Converting ₹2 lakh in credit card debt from 3% per month to a 14% p.a. personal loan saves ₹22,000–40,000 per year.",
          "Avoid for: Down payment on a home (banks check source of funds and disallow loan-funded down payments), volatile investments (taking a personal loan to invest in stocks or crypto is extremely high risk), or recurring operational needs (repeated personal loans for monthly expenses signal a cash flow problem that needs budgeting, not more debt).",
        ],
      },
      {
        heading: "Key Costs Beyond the EMI — What You Pay Total",
        paragraphs: [
          "Processing fee: 1–3% of loan amount, deducted upfront from disbursement. On ₹5 lakh, this is ₹5,000–15,000 + GST. Always ask for the net disbursement amount — the bank transfers less than your sanctioned amount.",
          "Prepayment/foreclosure charges: Most banks and major NBFCs charge 2–5% of outstanding principal if you close the loan within 12–24 months (lock-in period). After the lock-in, charges are typically 1–4%. Some lenders allow part prepayment without charge after 6 months. Unlike home loans, there is no RBI mandate exempting personal loans from prepayment charges — always check your loan agreement.",
          "Late payment fee: ₹200–1,000 per missed EMI, plus penal interest (typically 2–3% p.m. on the overdue amount). A single missed personal loan payment appears on your CIBIL report and can reduce your score by 50–100 points — taking 2–3 years to recover.",
          "Insurance: Many lenders push a loan protection insurance (credit shield/term plan) that pays the outstanding balance if you die or become permanently disabled. This is optional — do not accept it as mandatory, and compare the cost with a standalone term policy if you actually need coverage.",
        ],
      },
    ],
    tables: [
      {
        title: "Personal Loan EMI Comparison — ₹5,00,000 Across Rates and Tenures",
        columnHeaders: ["Rate", "3 Years EMI (₹)", "Total Interest 3yr (₹)", "5 Years EMI (₹)", "Total Interest 5yr (₹)", "7 Years EMI (₹)", "Total Interest 7yr (₹)"],
        rows: [
          ["10% p.a.", "16,134", "81,824", "10,624", "1,37,440", "8,317", "1,98,628"],
          ["12% p.a.", "16,607", "97,852", "11,122", "1,67,320", "8,847", "2,42,936"],
          ["14% p.a.", "17,089", "1,14,204", "11,634", "1,98,040", "9,393", "2,88,792"],
          ["16% p.a.", "17,580", "1,30,880", "12,159", "2,29,540", "9,956", "3,36,208"],
          ["18% p.a.", "18,080", "1,47,880", "12,700", "2,62,000", "10,535", "3,84,940"],
          ["24% p.a.", "19,614", "2,06,104", "14,250", "3,55,000", "12,101", "5,16,484"],
        ],
      },
      {
        title: "Personal Loan Rate Ranges by Lender Type and CIBIL Score",
        columnHeaders: ["Lender Category", "CIBIL 750+", "CIBIL 700–749", "CIBIL 650–699", "Below 650", "Typical Tenure"],
        rows: [
          ["PSU Banks (SBI, PNB)", "10.5–12%", "12–14%", "14–16% or decline", "Decline", "1–5 years"],
          ["Private Banks (HDFC, ICICI, Axis)", "10.5–14%", "13–16%", "15–20%", "Usually decline", "1–7 years"],
          ["Leading NBFCs (Bajaj, Fullerton)", "12–16%", "15–20%", "18–24%", "22–28%", "1–7 years"],
          ["Fintech / Digital Lenders", "14–20%", "18–26%", "24–36%", "30–42%", "3 months–3 years"],
          ["Credit Union / Co-op Bank", "9–13%", "12–16%", "Limited availability", "N/A", "1–5 years"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Personal loan balance payoff curve — shorter tenure advantage",
      caption: "A personal loan balance falls quickly relative to its term because rates are high and tenures short. Even so, total interest on a 5-year personal loan is 35–50% of the principal — underlining why these loans should be repaid as fast as possible.",
    },
    faq: [
      {
        question: "What CIBIL score do I need for a personal loan in India?",
        answer:
          "Most mainstream lenders require a minimum CIBIL score of 650–700 to consider a personal loan application. Scores below 650 are generally declined or offered at exploitatively high rates from fringe lenders. For the best rates (10–13%), target a CIBIL score of 750+. Key factors in your score: payment history (35% weight), credit utilization (<30% recommended), credit mix (loans + cards), and age of oldest account. Check your score free once a year at the official CIBIL website before applying.",
      },
      {
        question: "Is the EMI calculation the same for all personal loan lenders in India?",
        answer:
          "Yes — all regulated lenders (banks and RBI-registered NBFCs) use the reducing-balance method, which is mandated and standard. However, the effective cost differs: (1) some lenders deduct processing fee from disbursement, making the effective rate higher than stated; (2) some 'flat rate' products (rare in mainstream, common in informal lending) charge interest on the original principal throughout — this is NOT the same as reducing balance and is far more expensive; (3) always confirm 'reducing balance' in your sanction letter.",
      },
      {
        question: "Can I get a personal loan without a salary slip?",
        answer:
          "Yes, but it is harder. Self-employed borrowers need to show 2–3 years of ITR (Income Tax Returns), bank statements showing regular income credit, GST registration (if applicable), and business vintage of at least 2 years. Some lenders also accept Form 16 or pension statements for retired borrowers. Without income documentation, you are likely to be directed toward gold loans, loan against FD, or loan against mutual funds — all of which carry lower rates because they have collateral.",
      },
      {
        question: "Should I prepay my personal loan or invest the money?",
        answer:
          "For personal loans at 12%+ rates: prepayment is almost always the better financial decision. Your personal loan rate (14%) is a guaranteed, risk-free return on the prepaid amount — far better than FD returns (6–7% pre-tax, ~5% post-tax in the 30% bracket). Equity investments may yield 10–14% over 10 years but with significant volatility and uncertainty. The exception: if your employer offers a PF match or ESOP that delivers certain high returns, capture those first. Otherwise, clear high-rate personal debt before investing in voluntary instruments.",
      },
      {
        question: "What is the difference between a personal loan and a credit card EMI?",
        answer:
          "Both are unsecured credit, but the structure differs. A personal loan is disbursed as a lump sum into your bank account — you use it as needed. It has a fixed EMI on a reducing balance. A credit card EMI (No Cost EMI or standard EMI conversion) converts a specific credit card transaction into equal monthly installments, often at 0–3% per month. 'No Cost EMI' on cards typically involves the merchant absorbing the interest as a discount — read the T&Cs carefully. For amounts above ₹50,000 needed as cash, a personal loan is usually more transparent. For purchases at specific merchants, credit card EMI may be cheaper if genuinely 0% interest.",
      },
    ],
    meta: {
      seoTitle: "Personal Loan EMI Calculator India — Rates, CIBIL Score Impact & Total Cost | mywebcalculator",
      seoDescription:
        "Calculate personal loan EMI in India across rates (10–24%) and tenures. Compare lender types by CIBIL score, understand processing fees, prepayment charges, and when a personal loan beats alternatives.",
      keywords: [
        "personal loan emi calculator india",
        "personal loan calculator india 2025",
        "personal loan interest rate india",
        "personal loan cibil score",
        "instant personal loan emi calculator",
        "personal loan vs home loan top up",
        "personal loan processing fee india",
        "personal loan prepayment charges",
        "best personal loan rate india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "loan-calculator-usa": {
    slug: "loan-calculator-usa",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Uses standard fixed-rate amortization in USD. Does not model origination fees, PMI, prepayment penalties, or variable-rate adjustments. APR from your lender's Truth in Lending (Reg Z) disclosure is the most accurate input.",
    sections: [
      {
        heading: "How US Installment Loans Work",
        paragraphs: [
          "Most consumer loans in the United States — auto loans, personal loans, and student loans — use a fixed monthly payment on a fully amortizing reducing-balance schedule. The monthly payment = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], identical to the formula used worldwide for standard amortizing loans.",
          "The key US-specific concept is APR (Annual Percentage Rate). The Truth in Lending Act (TILA), implemented under Regulation Z, requires lenders to disclose the APR on every loan offer. For simple installment loans without fees, APR ≈ nominal interest rate. But when origination fees, points, or mortgage insurance are included, APR can be meaningfully higher than the stated interest rate. Your Loan Estimate and Closing Disclosure documents show the APR for any US loan.",
          "Unlike India, the US has a broader range of loan products in this category: auto loans (new vs used, dealer vs bank), personal loans (unsecured installment), home improvement loans, student loan consolidation, boat/RV loans, and medical financing. All use the same core amortization math, but rates vary widely by product, lender, and borrower credit profile.",
        ],
      },
      {
        heading: "Credit Score (FICO) Impact on US Loan Rates",
        paragraphs: [
          "In the US, the FICO score (ranging 300–850) is the dominant credit metric lenders use to price loan rates. Unlike India's CIBIL where 750+ is generally 'good', the US has more granular tiering. Exceptional (800–850): best rates, often 2–4% below average. Very Good (740–799): near-best rates with most lenders. Good (670–739): standard rates, most applicants qualify. Fair (580–669): sub-prime rates, higher costs. Poor (300–579): severely limited options, usually only sub-prime or secured alternatives.",
          "For auto loans, the rate difference between Exceptional and Fair credit can be 8–12 percentage points. On a $30,000 auto loan for 60 months: at 5% (excellent credit) EMI = $566, total interest = $3,968. At 15% (fair credit) EMI = $714, total interest = $12,847. The same car costs $8,879 more in interest over 5 years purely due to credit score.",
          "Building US credit: If you are new to the US (immigrant or international student), you may have no FICO score initially. Start with a secured credit card (deposit-backed), use it lightly and pay in full each month, and your FICO score typically establishes within 3–6 months. Credit unions (member-owned financial cooperatives) often offer better rates for borrowers with thin credit files than commercial banks.",
        ],
      },
      {
        heading: "Worked Example: $25,000 Auto Loan at 6.5% APR for 5 Years",
        paragraphs: [
          "Loan: $25,000 at 6.5% APR for 60 months. Monthly rate r = 6.5 ÷ 12 ÷ 100 = 0.5417%. Monthly payment = $25,000 × 0.005417 × (1.005417)^60 ÷ [(1.005417)^60 − 1] = $489/month.",
          "Total paid = $489 × 60 = $29,340. Total interest = $4,340. At $489/month, this auto loan represents roughly $117/week — the context borrowers often miss when evaluating affordability.",
          "Extending to 7 years: Monthly payment drops to $374 (saves $115/month). But total interest rises to $6,416 — $2,076 more over the life of the loan. The 7-year payment looks $115 cheaper per month but costs $2,076 more overall. Furthermore, auto loan lenders charge higher rates for longer terms, so the $374 figure likely uses a 7%+ rate, widening the actual interest gap further.",
          "Shorter term advantage: 3-year loan at 6.5%: Payment = $767/month (much higher). Total interest = $2,612. You save $1,728 in interest versus 5 years. Shorter auto loans also reduce the risk of being 'underwater' (owing more than the car is worth), which matters for insurance and trade-in decisions.",
        ],
      },
      {
        heading: "US-Specific Loan Types and Their Typical Rates",
        paragraphs: [
          "Auto loans: New car loans from banks/credit unions: 5.5–8% for excellent credit (2024–2025 environment). Used car loans: 7–12% (higher due to collateral depreciation risk). Dealer-arranged financing may carry additional 'buy rate' markup — dealers typically get a lower rate from the finance company and mark it up as profit. Always get pre-approved from a bank or credit union before visiting a dealer so you have a benchmark rate to compare.",
          "Personal loans (unsecured): 7–36% APR depending on credit profile and lender. Online lenders like SoFi, LightStream, Marcus (by Goldman Sachs), and Discover offer competitive rates for strong credit profiles (720+). LightStream requires excellent credit but offers rates as low as 7–8% for certain loan purposes (home improvement, auto purchase). For debt consolidation, compare the personal loan APR against your existing credit card rates — card APRs of 20–29% are commonly replaced with 10–15% personal loans.",
          "Student loans (federal): Federal student loans (Direct Subsidized, Unsubsidized, PLUS) are set annually by Congress — rates in 2024–25 range approximately 6.5–9% depending on loan type. Federal loans have income-driven repayment, deferment, and forgiveness options unavailable on private loans. Always exhaust federal options before considering private student loans, which are priced like unsecured personal loans (5–14%+) but lack federal protections.",
        ],
      },
      {
        heading: "Prepayment and Early Payoff in the US",
        paragraphs: [
          "Unlike many other countries, the US generally has no prepayment penalties on consumer loans. Personal loans, most auto loans, and federal student loans can be paid off early at any time with no fee. Some older car dealership contracts and a minority of personal loan products have prepayment penalties — always check the loan agreement before signing.",
          "Extra payments strategy: Any additional payment you make above the minimum monthly payment reduces the outstanding principal directly. If you pay $600 instead of $489 on the auto loan example above ($111 extra/month), the loan closes in approximately 51 months instead of 60, saving roughly $900 in interest. Specify to your lender that extra payments should be applied to 'principal reduction' — some servicers default to applying extra payments to the next month's payment instead.",
          "Refinancing: If your credit score improves significantly after taking a loan, refinancing at a lower rate can reduce monthly payments and total interest. Auto loan refinancing with a credit union is common — the process is similar to a new loan application. For student loans, refinancing federal loans into private loans trades flexibility for a lower rate — think carefully before surrendering federal protections.",
        ],
      },
    ],
    tables: [
      {
        title: "Monthly Payment Comparison — $25,000 Loan at Various Rates and Terms",
        columnHeaders: ["APR", "3-Year Payment ($)", "Total Interest 3yr ($)", "5-Year Payment ($)", "Total Interest 5yr ($)", "7-Year Payment ($)", "Total Interest 7yr ($)"],
        rows: [
          ["4.0%", "738", "1,568", "460", "2,592", "342", "3,715"],
          ["5.5%", "756", "2,222", "479", "3,764", "361", "5,285"],
          ["6.5%", "767", "2,612", "489", "4,352", "374", "6,416"],
          ["8.0%", "783", "3,191", "507", "5,420", "392", "7,884"],
          ["10.0%", "807", "4,037", "531", "6,896", "417", "9,996"],
          ["15.0%", "867", "6,229", "595", "10,704", "482", "15,430"],
        ],
      },
      {
        title: "FICO Score Impact on US Loan Rates and Costs — $25,000 Auto Loan, 5 Years",
        columnHeaders: ["FICO Score Range", "Category", "Typical APR (New Auto)", "Monthly Payment ($)", "Total Interest ($)", "vs Exceptional Credit"],
        rows: [
          ["800–850", "Exceptional", "4.5–5.5%", "467–480", "2,980–3,791", "Baseline"],
          ["740–799", "Very Good", "5.5–6.5%", "479–489", "3,764–4,352", "+$784–$1,372 more"],
          ["670–739", "Good", "7.0–9.0%", "495–518", "4,714–6,080", "+$1,734–$3,100 more"],
          ["580–669", "Fair", "11.0–15.0%", "543–595", "7,587–10,704", "+$4,607–$7,724 more"],
          ["300–579", "Poor", "15.0–25.0%+", "595–726", "10,704–18,560", "+$7,724–$15,580 more"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Loan balance declining over the US installment loan term",
      caption: "Fixed-rate US installment loans amortize predictably when payments are made on schedule. The balance curve shows more rapid early decline on shorter terms — justifying the higher monthly payment for total interest savings.",
    },
    faq: [
      {
        question: "Is APR the same as the interest rate on US loans?",
        answer:
          "Not always. APR (Annual Percentage Rate) is the all-in cost rate mandated by TILA/Reg Z disclosure rules. For a simple installment loan with no fees, APR = nominal interest rate. But when the lender charges an origination fee (e.g., 1–5% of loan amount on personal loans), the fee is included in the APR calculation, making APR > stated rate. For mortgages, APR includes points, mortgage insurance, and certain closing costs — making it significantly different from the note rate. Always compare APRs across lenders, not just nominal rates, for an apples-to-apples comparison.",
      },
      {
        question: "Can I pay off my US loan early without penalty?",
        answer:
          "For most US consumer loans — yes, without penalty. Federal student loans, most personal loans, and most auto loans from banks and credit unions have no prepayment penalties. However, some dealer-originated auto loans and a minority of personal loan contracts include prepayment penalties — always check clause by clause in the loan agreement before signing. Mortgage loans originated after January 2014 that qualify as 'Qualified Mortgages' (QM) under the CFPB rules cannot have prepayment penalties.",
      },
      {
        question: "What is the difference between a bank loan and a credit union loan in the US?",
        answer:
          "Credit unions are member-owned, non-profit financial cooperatives. Because they do not distribute profits to shareholders, they typically offer lower loan rates and higher savings rates than commercial banks. The average credit union auto loan rate is 1–2 percentage points below commercial bank rates. Membership requires meeting an eligibility criterion (employer, geography, association) but many credit unions have broad 'community charter' memberships. On a $25,000 auto loan, a 1.5% rate difference saves approximately $1,000–$1,500 in total interest.",
      },
      {
        question: "How do US auto dealer financing rates compare to bank rates?",
        answer:
          "Dealer-arranged financing (through manufacturer's captive finance arm or third-party lenders) can be competitive — manufacturers sometimes offer promotional rates (0%, 0.9%, 1.9% APR) as sales incentives. However, dealers may also mark up the rate above what the lender charges them (the 'buy rate') by 1–2.5% to earn backend profit. Always get a pre-approval letter from your bank or credit union before visiting a dealer. This gives you a guaranteed rate to compare against the dealer's offer and removes the information asymmetry.",
      },
      {
        question: "What happens if I miss a payment on a US loan?",
        answer:
          "Missing a payment triggers late fees (typically $25–$40 or a percentage of payment). After 30 days, the missed payment is reported to the credit bureaus (Equifax, Experian, TransUnion), which can drop your FICO score by 50–100+ points. After 90–120 days, auto loans may be subject to vehicle repossession without court action in most states. Personal loans go to collections after 90–180 days. Federal student loans have more generous defaults (270 days) but also have unique collection powers (wage garnishment, tax refund offset) not available to other lenders. Always contact your lender before missing a payment — most offer hardship or deferment options.",
      },
    ],
    meta: {
      seoTitle: "Loan Calculator USA — Monthly Payment, APR & Total Interest in USD | mywebcalculator",
      seoDescription:
        "Calculate US auto, personal, and installment loan monthly payments in USD. Understand FICO score impact on rates, APR vs interest rate, credit union advantages, and prepayment savings.",
      keywords: [
        "loan calculator usa",
        "us loan payment calculator",
        "monthly payment calculator usa",
        "auto loan calculator usa",
        "personal loan calculator usa",
        "fico score loan rate calculator",
        "apr vs interest rate usa",
        "credit union vs bank loan usa",
        "car loan calculator united states",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "mortgage-calculator-uk": {
    slug: "mortgage-calculator-uk",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Models a standard repayment mortgage in GBP at a fixed nominal rate using monthly reducing-balance amortization. UK mortgages may be fixed, tracker, SVR, or interest-only — this tool models repayment (capital and interest) mortgages only.",
    sections: [
      {
        heading: "UK Repayment Mortgages — How They Work",
        paragraphs: [
          "A repayment mortgage (also called a capital-and-interest mortgage) requires the borrower to pay both the interest charge and a portion of the principal balance every month. By the end of the mortgage term, the entire loan is fully repaid — in contrast to an interest-only mortgage where only the interest is paid monthly and the full principal is due at term end.",
          "The monthly payment formula is identical to any standard amortizing loan: M = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P = mortgage amount, r = monthly rate (annual rate ÷ 12), n = term in months. UK mortgages typically use a nominal annual rate compounded monthly, unlike the US where a fully specified APR is required to be disclosed; always confirm compounding with your lender.",
          "Repayment mortgages are the FCA's recommended default for most UK residential borrowers. They provide certainty of full repayment and build equity throughout the term. Interest-only mortgages are available but restricted — they require a credible repayment vehicle (ISA, pension, investment portfolio) and are subject to stricter affordability assessment.",
        ],
      },
      {
        heading: "UK Mortgage Market Structure — Fixed, Tracker, and SVR",
        paragraphs: [
          "Fixed-rate mortgages: The interest rate is fixed for an initial deal period — typically 2 years or 5 years (also available in 3, 7, or 10-year fixes). After the deal period ends, the mortgage reverts to the lender's Standard Variable Rate (SVR), which is typically 1–3% above the Bank of England base rate. Most borrowers remortgage at the end of each deal period to avoid SVR reversion.",
          "Tracker mortgages: The interest rate tracks the Bank of England (BoE) base rate plus a fixed margin (e.g., base rate + 0.5%). When the BoE raises or cuts rates, your monthly payment adjusts accordingly — usually within the same month. Trackers carry rate risk but often have lower ERCs (Early Repayment Charges) or no ERCs, making them suitable if you might move or remortgage early.",
          "Standard Variable Rate (SVR): The lender's default rate applied after the initial deal period. SVRs are set independently by each lender (not directly tied to the BoE base rate) and are typically the most expensive rate. Most borrowers should remortgage before reverting to SVR. In 2024–25, major UK lender SVRs were in the range of 7–9% — significantly above deal rates.",
          "LTV (Loan-to-Value) tiers: UK mortgage rates are strongly influenced by LTV. Lower LTV = lower risk = better rate. Key tiers: 60%, 75%, 80%, 85%, 90%, and 95%. A £250,000 property with 40% deposit (60% LTV) commands a substantially better rate than the same property with 5% deposit (95% LTV). The rate difference between 60% and 90% LTV on a 2-year fix was typically 1.0–1.5% in 2024–25.",
        ],
      },
      {
        heading: "Worked Example: £250,000 Mortgage at 4.5% for 25 Years",
        paragraphs: [
          "Mortgage: £250,000 at 4.5% p.a. for 25 years (300 months). Monthly rate r = 4.5 ÷ 12 ÷ 100 = 0.375%. Monthly payment = £250,000 × 0.00375 × (1.00375)^300 ÷ [(1.00375)^300 − 1] = £1,390/month.",
          "Total paid = £1,390 × 300 = £417,000. Total interest = £167,000. This means you pay 67% more than you borrowed. A 25-year mortgage is the UK standard, but shortening to 20 years (same rate): Monthly payment = £1,582 (+£192/month). Total interest = £129,680 — saving £37,320 at the cost of £192 more per month.",
          "Impact of the 2-year fixed rate deal: If your initial rate is 4.5% for 2 years, then reverts to SVR at 8.0%: After 24 months at 4.5%, outstanding balance ≈ £234,500. Remaining 276 months at 8.0%: New payment = £1,753/month (vs £1,390). New total interest for remaining term ≈ £248,700. Total interest over full 25 years ≈ £275,000 — compared to £167,000 if you stayed at 4.5% forever. This illustrates why remortgaging before SVR reversion is critical — the savings are enormous.",
          "Stamp Duty Land Tax (SDLT): Not included in the EMI calculation but must be budgeted separately. For a first-time buyer in England purchasing at £250,000 (2024): £0 SDLT on first £425,000 (FTB threshold) = no SDLT. For subsequent buyers: 0% up to £250,000, so also £0. But at £300,000 for a next home buyer: 5% on (£300,000 − £250,000) = £2,500. Always calculate SDLT separately using HMRC's official calculator.",
        ],
      },
      {
        heading: "Overpayments and Early Repayment Charges in the UK",
        paragraphs: [
          "Most UK fixed-rate mortgage deals allow annual overpayments of 10% of the outstanding balance without triggering Early Repayment Charges (ERCs). Overpaying reduces the outstanding balance and either shortens the term or (less commonly) reduces the monthly payment, depending on your lender's default. Contact your lender to confirm their overpayment policy before making extra payments.",
          "ERCs apply to overpayments above the annual 10% threshold or to full early repayment during the deal period. Typical ERCs on a 5-year fixed deal: Year 1 = 5%, Year 2 = 4%, Year 3 = 3%, Year 4 = 2%, Year 5 = 1%. On a £200,000 remaining balance in Year 2, the ERC would be 4% × £200,000 = £8,000. Tracker mortgages often have lower or zero ERCs — useful if you plan to sell the property during the mortgage term.",
          "Porting a mortgage: Most UK fixed deals are 'portable' — you can transfer the mortgage to a new property without triggering ERCs. The lender will reassess affordability based on the new property and your current circumstances. If you need to borrow more, the additional amount is taken at current market rates (a 'part and part' arrangement).",
          "Offset mortgages: A UK-specific product where your savings (held in a linked account with the same lender) offset your mortgage balance for interest calculation purposes. If your mortgage is £250,000 and you have £50,000 in the offset account, you only pay interest on £200,000. This can dramatically reduce total interest without formally prepaying — and your savings remain accessible. Rates are typically 0.5–1% above equivalent non-offset deals.",
        ],
      },
      {
        heading: "UK Mortgage Eligibility — Affordability Assessment and Deposit",
        paragraphs: [
          "Lenders use a stress test to assess affordability: they calculate whether you could afford payments if the interest rate rose by 3% above the deal rate (under FCA Mortgage Market Review rules). This means being approved at 4.5% requires demonstrating you could afford payments at 7.5%. This is why some borrowers with good incomes are declined — the stress test, not their current payment, is the barrier.",
          "Deposit requirements: The minimum deposit for a standard repayment mortgage is typically 5% (95% LTV). However, rates at 95% LTV are significantly higher, and fewer lenders operate at this tier. A 10–15% deposit opens more lender options and meaningfully better rates. A 25–40% deposit (60–75% LTV) gives access to the best rates in the market. The deposit must be from the borrower's own funds — lenders require a 'gifted deposit letter' if funds come from family, and some lenders restrict the proportion of gifted funds.",
          "Help to Buy (closed) and alternatives: The Help to Buy Equity Loan scheme (England) closed in March 2023. Current schemes include Shared Ownership (purchase a share of a property, pay rent on the rest) and First Homes (discounted properties for first-time buyers in certain areas). The Lifetime ISA (LISA) remains available — you can save up to £4,000/year and receive a 25% government bonus (up to £1,000/year) for use as a first-home deposit. The LISA matures at age 50 or for first-home purchase — a highly effective first-home savings vehicle.",
        ],
      },
    ],
    tables: [
      {
        title: "UK Mortgage Payment by LTV and Rate — £250,000 Mortgage, 25 Years",
        columnHeaders: ["LTV", "Deposit Required", "Typical 2yr Fix Rate", "Monthly Payment (£)", "Total Interest (£)", "Total Paid (£)"],
        rows: [
          ["60% LTV", "£166,667", "~3.8%", "1,294", "138,200", "388,200"],
          ["75% LTV", "£83,333", "~4.2%", "1,353", "155,900", "405,900"],
          ["80% LTV", "£62,500", "~4.5%", "1,390", "167,000", "417,000"],
          ["85% LTV", "£44,118", "~4.9%", "1,434", "180,200", "430,200"],
          ["90% LTV", "£27,778", "~5.4%", "1,494", "198,200", "448,200"],
          ["95% LTV", "£13,158", "~6.0%", "1,611", "233,300", "483,300"],
        ],
      },
      {
        title: "2-Year vs 5-Year Fixed Mortgage — Trade-offs for £250,000 at 25 Years",
        columnHeaders: ["Feature", "2-Year Fixed (4.5%)", "5-Year Fixed (4.8%)", "Notes"],
        rows: [
          ["Initial monthly payment", "£1,390", "£1,433", "5yr fixed costs £43/month more"],
          ["Total interest during deal period", "£22,028", "£57,650", "Comparable per-year cost"],
          ["ERC (Year 1)", "Typically 2–3%", "Typically 4–5%", "Higher ERC on longer fix"],
          ["Rate certainty period", "24 months", "60 months", "5yr fix: more payment stability"],
          ["Remortgage frequency", "Every 2 years", "Every 5 years", "2yr fix: more remortgage cost/effort"],
          ["Best for", "Expect rate falls, plan to move", "Rate stability priority", "2yr if falling rate outlook; 5yr for certainty"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "UK mortgage balance over a 25-year repayment term",
      caption: "The balance curve for a 25-year mortgage moves slowly in the early years — a consequence of the high interest component in early payments at typical UK rates. Overpayments shift the curve down, potentially saving £10,000s in interest.",
    },
    faq: [
      {
        question: "Does this calculator include stamp duty or arrangement fees?",
        answer:
          "No. Enter the amount you plan to borrow (your property purchase price minus deposit). Stamp Duty Land Tax (SDLT in England/NI), Land Transaction Tax (LTT in Wales), and Land and Buildings Transaction Tax (LBTT in Scotland) are separate purchase costs that vary by property value, buyer status (first-time or not), and jurisdiction. Arrangement fees (£999–£2,499 typically) and valuation fees should also be budgeted separately. HMRC's SDLT calculator and your lender's full cost illustration are the authoritative sources for these figures.",
      },
      {
        question: "What is SVR and why should I avoid reverting to it?",
        answer:
          "SVR (Standard Variable Rate) is the default mortgage rate your lender applies after your initial fixed or tracker deal period ends. SVRs are set by each lender independently and are typically 2–4% above the Bank of England base rate — in 2024, most lender SVRs were 7–9%. If your 4.5% fixed deal ends and you revert to 8% SVR, your monthly payment on £200,000 remaining balance jumps from ~£1,110 to ~£1,543 — an extra £433/month. Set a remortgage reminder 3–6 months before your deal end date to avoid this.",
      },
      {
        question: "Should I choose a 2-year or 5-year fixed mortgage?",
        answer:
          "The decision depends on your rate outlook, life plans, and risk tolerance. A 2-year fix is better if: you believe rates will fall (allowing you to remortgage to a lower rate in 2 years), or you plan to sell or move within 5 years (avoiding ERC). A 5-year fix is better if: you value payment certainty, you cannot afford payment shocks, or you believe rates will rise further. In periods of rate uncertainty, many UK borrowers prefer 5-year fixes for stability. Note: 5-year fixes carry higher ERCs (4–5% in year 1) versus 2-year fixes (2–3% in year 1).",
      },
      {
        question: "How do UK mortgage overpayments work?",
        answer:
          "Most lenders allow you to overpay up to 10% of the outstanding balance per year without ERC. Overpayments reduce the outstanding balance and (by default on most lenders' systems) shorten the remaining term while keeping the monthly payment the same. Some lenders offer a 'payment holiday' in exchange for overpayments made — effectively allowing you to use banked overpayments during a future income dip. Always confirm your lender's overpayment policy and instruct them to apply extra payments to 'capital reduction'.",
      },
      {
        question: "Can I port my UK mortgage to a new property?",
        answer:
          "Yes — most UK fixed-rate mortgages are portable. When you sell and buy a new property during the deal period, you can carry the mortgage to the new property without triggering ERCs. The lender will re-assess affordability based on the new property and your current income. If the new property costs more, you borrow the additional amount at current market rates (a 'part and part' deal — existing rate on ported amount, new rate on the top-up). Porting is subject to the lender's criteria at the time of application, not at origination.",
      },
    ],
    meta: {
      seoTitle: "Mortgage Calculator UK — Monthly Payment, LTV Tiers & Total Interest in GBP | mywebcalculator",
      seoDescription:
        "Calculate UK repayment mortgage monthly payments in pounds sterling. Compare 2-year vs 5-year fixed deals, understand LTV impact on rates, overpayment rules, SDLT, and how to avoid SVR reversion.",
      keywords: [
        "mortgage calculator uk",
        "uk mortgage payment calculator",
        "repayment mortgage calculator uk",
        "uk mortgage ltv calculator",
        "stamp duty calculator uk",
        "2 year vs 5 year fixed mortgage uk",
        "mortgage overpayment calculator uk",
        "svr mortgage calculator uk",
        "first time buyer mortgage calculator uk",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "gst-plus-loan-calculator-india": {
    slug: "gst-plus-loan-calculator-india",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. GST rates on under-construction property depend on property type, date of purchase, and government notifications — verify the applicable rate and input tax credit status with your developer and CA before relying on this estimate.",
    sections: [
      {
        heading: "Why GST Matters for Home Loan Planning in India",
        paragraphs: [
          "GST (Goods and Services Tax) applies to under-construction residential property in India. This means the amount you borrow on a home loan for an under-construction flat or house is typically higher than the base (ex-GST) price — because GST is included in the agreement value that the bank uses to calculate your loan.",
          "Ready-to-move-in (RTM) or completed properties with an Occupancy Certificate (OC) are NOT subject to GST — you pay only the base price, stamp duty, and registration charges. The GST question arises only when buying an under-construction property from a developer registered under GST.",
          "This calculator helps you plan the actual loan amount and EMI when buying an under-construction property. Enter the base price (ex-GST), the applicable GST rate, your planned down payment, and your loan parameters to see the total cost, loan amount, and monthly EMI.",
        ],
      },
      {
        heading: "Current GST Rates on Under-Construction Property in India",
        paragraphs: [
          "Effective April 1, 2019, the GST Council revised residential property GST rates to: Affordable housing: 1% without Input Tax Credit (ITC). Standard/regular under-construction residential property: 5% without ITC. Commercial property: 12% with ITC available.",
          "Definition of affordable housing (for GST purposes): Residential properties with carpet area up to 60 sq m in metropolitan cities (Bengaluru, Chennai, Delhi NCR, Hyderabad, Kolkata, Mumbai) or up to 90 sq m in non-metropolitan cities, AND where the gross amount charged does not exceed ₹45 lakh. Both conditions must be met — a sub-60 sq m flat above ₹45 lakh does not qualify.",
          "Input Tax Credit (ITC): Under the post-April 2019 scheme, developers cannot claim ITC on materials and services used for construction (cement, steel, contractor fees). Theoretically, the removal of ITC (compared to the earlier 12% with ITC regime) benefits buyers because developers should not embed unclaimed tax costs in the price — though actual developer behavior varies.",
          "GST on commercial-cum-residential: Mixed-use projects where the construction plan includes both commercial and residential floors may have different GST treatment for different units. Your developer's sale agreement and GST invoice will specify the applicable rate for your specific unit.",
        ],
      },
      {
        heading: "How the GST + Loan Calculation Works",
        paragraphs: [
          "Step 1 — Calculate total agreement value: Total cost = Base price × (1 + GST% ÷ 100). For a ₹50 lakh base price with 5% GST: Total = ₹50,00,000 × 1.05 = ₹52,50,000.",
          "Step 2 — Subtract down payment: Loan principal = Total cost − Down payment. If down payment = ₹10,00,000: Loan = ₹52,50,000 − ₹10,00,000 = ₹42,50,000.",
          "Step 3 — Calculate EMI on loan principal: EMI = ₹42,50,000 × r × (1 + r)^n ÷ [(1 + r)^n − 1], where r = monthly rate. At 8.5% for 20 years: EMI = ₹36,882/month.",
          "Step 4 — Understand the GST impact on EMI: Without GST (₹50L − ₹10L = ₹40L loan): EMI = ₹34,713/month. The 5% GST adds ₹2,50,000 to the loan, increasing the monthly EMI by ₹2,169/month — or ₹5,20,560 in additional total EMI payments over 20 years for just ₹2.5 lakh of extra loan from GST. This compound effect of GST on EMI is often underestimated.",
        ],
      },
      {
        heading: "GST vs Stamp Duty vs Registration — What You Pay at Property Purchase",
        paragraphs: [
          "GST: Applicable only on under-construction property. Paid to the developer as part of the agreement value. Developer pays this to the government. Not applicable on RTM properties with OC.",
          "Stamp Duty: Applicable on all property transactions (both under-construction and RTM). Rate varies by state — typically 3–8% of market value or agreement value. Maharashtra: 5–7% (various concessions for women buyers and specific zones). Karnataka: 5%. Delhi: 4% (women), 6% (others). Tamil Nadu: 7%. Gujarat: 4.9%. Stamp duty is paid to the state government and is a one-time charge at the time of registration.",
          "Registration charges: A flat percentage (typically 0.5–1% of property value, up to a cap) paid to the sub-registrar's office when registering the sale deed. In Maharashtra, 1% (capped at ₹30,000). In Karnataka, 1% (capped at ₹15,000 for properties below ₹45L).",
          "All three combined for ₹50 lakh under-construction flat (Maharashtra example): GST @ 5% = ₹2,50,000. Stamp duty @ 5% = ₹2,50,000. Registration @ 1% (capped) = ₹30,000. Total purchase cost = ₹55,30,000 vs base price of ₹50,00,000. Banks typically do not finance stamp duty and registration charges — these must come from own funds (over and above the normal down payment).",
        ],
      },
      {
        heading: "Loan Eligibility and Bank Policy on GST-Included Loans",
        paragraphs: [
          "Banks calculate LTV (Loan-to-Value) on the agreement value including GST. For properties above ₹75 lakh (agreement value), LTV is capped at 75%. For a ₹52.5 lakh agreement value (₹50L + 5% GST), LTV up to 80% applies (as it is between ₹30L and ₹75L) — meaning the bank can sanction up to ₹42 lakh (₹52.5L × 80%). In our example, the required loan of ₹42.5 lakh exceeds this — the down payment must be increased.",
          "Some banks sanction the loan on the base price (ex-GST) and require you to pay GST separately from own funds. Others include GST in the project cost and calculate LTV on the inclusive amount. Confirm your specific lender's policy — it directly affects how much you need to arrange from own sources.",
          "Under-construction loans are disbursed in tranches as construction progresses. Pre-EMI (interest only on disbursed amount) is paid during construction; full EMI begins after complete disbursement. The EMI shown in this calculator is the final full EMI — your actual outflow during construction will be lower (just the pre-EMI interest on partial disbursements).",
          "GST invoice from developer: The developer must issue a valid GST tax invoice for each tranche payment. Ensure you receive these invoices — they are required for any GST-related claims and for your records. If the developer is not GST-registered or does not issue invoices, be cautious — this suggests possible non-compliance.",
        ],
      },
    ],
    tables: [
      {
        title: "GST Impact on Loan Amount and EMI — ₹50 Lakh Base Price, 8.5% p.a., 20 Years",
        columnHeaders: ["GST Rate", "GST Amount (₹)", "Total Cost (₹)", "Loan (₹10L Down) (₹)", "Monthly EMI (₹)", "Extra vs No GST (₹/month)", "Extra over 20yr (₹)"],
        rows: [
          ["0% (RTM/no GST)", "0", "50,00,000", "40,00,000", "34,713", "—", "—"],
          ["1% (affordable housing)", "50,000", "50,50,000", "40,50,000", "35,147", "+434", "+1,04,160"],
          ["5% (standard u/c)", "2,50,000", "52,50,000", "42,50,000", "36,882", "+2,169", "+5,20,560"],
          ["12% (commercial)", "6,00,000", "56,00,000", "46,00,000", "39,918", "+5,205", "+12,49,200"],
        ],
      },
      {
        title: "Full Cost Breakdown — ₹50 Lakh Under-Construction Flat (Standard 5% GST, Maharashtra)",
        columnHeaders: ["Cost Component", "Calculation", "Amount (₹)", "Financed by Loan?"],
        rows: [
          ["Base price (ex-GST)", "Builder quote", "50,00,000", "Yes (up to LTV limit)"],
          ["GST @ 5%", "₹50L × 5%", "2,50,000", "Yes (included in agreement value)"],
          ["Stamp duty @ 5%", "₹52.5L × 5%", "2,62,500", "No — own funds only"],
          ["Registration @ 1% (capped)", "Min of 1% or cap", "30,000", "No — own funds only"],
          ["Total purchase cost", "All above", "55,42,500", "—"],
          ["Down payment (20% of ₹52.5L)", "LTV 80%", "10,50,000", "—"],
          ["Loan amount", "₹52.5L − ₹10.5L", "42,00,000", "Yes"],
          ["EMI at 8.5%, 20 years", "Standard formula", "36,450", "Monthly obligation"],
          ["Total EMI outflow (20yr)", "₹36,450 × 240", "87,48,000", "—"],
          ["Total all-in cost (ex-furniture)", "Purchase + EMI", "1,42,90,500", "—"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Loan balance after financing GST-inclusive property cost",
      caption: "Financing a higher agreement value (with GST included in the loan) increases the starting balance and EMI versus buying a GST-exempt ready-to-move property. The difference compounds over 20 years — enter your actual GST rate above to see the impact on your specific purchase.",
    },
    faq: [
      {
        question: "Which GST rate should I enter for my under-construction flat?",
        answer:
          "Enter the rate specified in your sale agreement or developer's GST invoice. As of 2024–25, the rates are: 1% for affordable housing (carpet area ≤60 sq m in metros / ≤90 sq m in non-metros, AND agreement value ≤₹45 lakh); 5% for all other under-construction residential property. If your flat is larger or priced above ₹45 lakh, use 5%. For commercial units in a mixed-use project, use 12% with your CA's guidance on ITC eligibility. If in doubt, request the GST rate confirmation in writing from your developer before signing the agreement.",
      },
      {
        question: "Is GST charged on the home loan EMI itself?",
        answer:
          "No. GST applies to the supply of goods and services — not to interest on a loan. Home loan interest (and EMIs) are exempt from GST. However, certain loan-related fees ARE subject to 18% GST: processing fee, valuation fee, mortgage documentation charges, and legal charges. Your bank will add GST on these service charges. For example, a ₹20,000 processing fee becomes ₹23,600 (including ₹3,600 GST). The EMI itself — comprising interest and principal repayment — has no GST.",
      },
      {
        question: "Can I claim input tax credit (ITC) on GST paid for my residential property?",
        answer:
          "No. As an individual homebuyer purchasing for personal use, you cannot claim ITC on GST paid on your property purchase. ITC is available only to businesses that purchase goods or services as inputs for further taxable supply. Under the post-April 2019 scheme, even the developer cannot claim ITC on construction inputs (hence the lower 5% rate). The 5% or 1% GST you pay is a final cost with no credit available to you.",
      },
      {
        question: "Does the bank finance the GST component of the agreement value?",
        answer:
          "It depends on the lender and their interpretation. Most major banks (SBI, HDFC, ICICI) include GST in the agreement value when calculating the loan amount — meaning they will lend against the total (base + GST), subject to the applicable LTV cap. If the agreement value including GST is ₹52.5 lakh (80% LTV category), the bank can sanction up to ₹42 lakh. Some lenders exclude GST from the loan calculation and require you to pay GST from own funds — confirming this is critical since it changes your minimum down payment requirement. Ask your lender explicitly: 'Is GST included in the agreement value for LTV calculation?'",
      },
      {
        question: "What is the difference between GST and stamp duty on property?",
        answer:
          "GST is a central tax on the supply of goods and services — it applies to under-construction property because it involves ongoing construction services (a taxable supply). It is collected by the developer and remitted to the GST portal. Stamp duty is a state government tax on the legal document (sale deed) that transfers ownership — it applies to ALL property transactions (both under-construction and ready-to-move). Registration is the fee for recording the transfer at the sub-registrar's office. The key practical difference: GST is part of the agreement value and can be (partly) financed via the home loan; stamp duty and registration must be paid from own funds and are typically not financed.",
      },
    ],
    meta: {
      seoTitle: "GST + Home Loan Calculator India — Property GST, Down Payment & EMI | mywebcalculator",
      seoDescription:
        "Calculate total cost of an under-construction property with 1% or 5% GST, subtract down payment, and compute home loan EMI. Understand GST vs stamp duty, which components banks finance, and the compounding EMI impact of GST.",
      keywords: [
        "gst home loan calculator india",
        "property gst calculator india",
        "under construction property gst emi",
        "gst plus loan calculator india",
        "affordable housing gst 1 percent",
        "under construction flat gst 5 percent",
        "home loan agreement value gst",
        "stamp duty vs gst property india",
        "gst on under construction property 2025",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
