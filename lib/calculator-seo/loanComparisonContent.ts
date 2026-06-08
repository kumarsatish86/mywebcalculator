import type { RichArticle } from "./types";

const HUB_HREF = "/finance/loans-emi/loan-comparison-tools";
const HUB_LABEL = "Finance · Loan Comparison Tools";

export const LOAN_COMPARISON_ARTICLES: Record<string, RichArticle> = {
  "loan-comparison-calculator": {
    slug: "loan-comparison-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. All calculations use standard reducing-balance amortization (monthly compounding). Processing fees and ancillary charges are shown separately — not folded into the EMI unless you include them in the loan amount.",
    sections: [
      {
        heading: "Why Comparing Loans Side by Side Matters",
        paragraphs: [
          "Two loans with the same headline interest rate can cost vastly different amounts over their full tenure because of processing fees, prepayment penalties, insurance requirements, and the compounding method used (flat rate vs. reducing balance). A loan comparison calculator eliminates guesswork by placing all options in the same framework and surfacing the true total cost of each.",
          "The most common mistake borrowers make is comparing only EMIs or only interest rates. A lower EMI can mean a longer tenure — and a significantly higher total interest payout. A lower rate can be negated by a high processing fee. The right comparison metric is total cost of borrowing: all EMIs + fees + charges, minus any tax benefits.",
          "For large loans (home loans, car loans, business loans), the difference between the best and worst option from a shortlist of three lenders can easily be ₹1–5 lakh in total interest over the tenure — making a careful comparison one of the highest-ROI financial decisions you can make.",
        ],
      },
      {
        heading: "Key Metrics to Compare Across Loans",
        paragraphs: [
          "1. Monthly EMI: The most visible number, but only one piece of the puzzle. Useful for cash flow planning, but never use it as the sole comparison criterion.",
          "2. Total interest payable: Sum of all interest components across the full amortization schedule. For a fixed-rate loan, this is simply (EMI × n) − Principal.",
          "3. Total cost of borrowing: Total interest + processing fee + documentation charges + prepayment penalty (if applicable). This is the real cost of the loan.",
          "4. Effective APR: If a lender quotes a flat rate, convert it to an equivalent reducing-balance APR for a valid comparison: effective rate ≈ flat rate × 1.83 (rough rule of thumb for a 60-month loan). The exact conversion depends on tenure.",
          "5. Break-even month (for refinancing decisions): The month at which cumulative interest savings from a lower-rate loan exceed the switch cost (processing fee + prepayment penalty on old loan).",
        ],
      },
      {
        heading: "Worked Example: Comparing Three Home Loan Offers",
        paragraphs: [
          "Loan amount: ₹40,00,000. Tenure: 20 years. Three offers from different lenders.",
          "Lender A: 8.5% p.a., processing fee ₹10,000, no prepayment charges. EMI = ₹34,718. Total interest = ₹43,32,320. Total cost = ₹43,42,320.",
          "Lender B: 8.25% p.a., processing fee ₹25,000, 2% prepayment charge. EMI = ₹34,162. Total interest = ₹42,18,880. Total cost (no prepayment) = ₹42,43,880. If you prepay ₹5L at year 5, add ₹10,000 penalty — total rises to ₹42,53,880.",
          "Lender C: 8.0% p.a., processing fee ₹40,000, 1% prepayment charge. EMI = ₹33,458. Total interest = ₹40,29,920. Total cost (no prepayment) = ₹40,69,920.",
          "On pure interest saving, Lender C wins by ₹3,02,400 over Lender A, even after the ₹40,000 fee. But if you plan to prepay aggressively (e.g. ₹10L over the loan life), Lender A (no penalty) could end up cheaper than C, because Lender C's 1% penalty on ₹10L adds ₹10,000. Always model your expected prepayment behaviour.",
        ],
      },
      {
        heading: "Flat Rate vs Reducing Balance: Understanding the Difference",
        paragraphs: [
          "A flat interest rate is calculated on the original principal for the entire tenure: Total interest = P × r_flat × years. This amount is divided equally across all EMIs. The result is that you are paying interest on money you have already returned — making the effective cost much higher than the headline flat rate.",
          "Conversion formula: For a loan with tenure n months, the equivalent reducing-balance APR is approximately: r_reducing ≈ flat rate × (2n) ÷ (n+1). For a 60-month loan at 10% flat: r_reducing ≈ 10% × (120/61) ≈ 19.67%. This is why car dealer financing at '6% flat' can be equivalent to ~11–12% APR reducing.",
          "Always ask your lender whether the quoted rate is flat or reducing. Use the Interest Rate Comparison Tool to convert between the two for any tenure.",
        ],
      },
      {
        heading: "Common Loan Comparison Mistakes to Avoid",
        paragraphs: [
          "Mistake 1 — Comparing different tenures: A 10-year loan will always have a higher EMI than a 20-year loan at the same rate, but will cost less in total interest. Never compare EMIs without also noting the tenure.",
          "Mistake 2 — Ignoring insurance requirements: Some lenders mandate HLPI (Home Loan Protection Insurance). This can add 0.5–1% p.a. effectively to your cost. Factor premiums in.",
          "Mistake 3 — Not asking about rate reset frequency: For floating-rate loans, some reset monthly (tied to repo), others reset annually. Ask your lender how often your rate adjusts.",
          "Mistake 4 — Comparing pre-disbursement estimates: Final loan terms (especially processing fee and rate) can change between sanction and disbursement. Always compare final sanction letters, not marketing brochures.",
        ],
      },
    ],
    tables: [
      {
        title: "Three-Lender Loan Comparison — ₹40 Lakh @ 20 Years",
        columnHeaders: ["Metric", "Lender A (8.5%)", "Lender B (8.25%)", "Lender C (8.0%)"],
        rows: [
          ["Monthly EMI", "₹34,718", "₹34,162", "₹33,458"],
          ["Total Interest", "₹43,32,320", "₹42,18,880", "₹40,29,920"],
          ["Processing Fee", "₹10,000", "₹25,000", "₹40,000"],
          ["Prepayment Penalty", "None", "2% on amount", "1% on amount"],
          ["Total Cost (no prepay)", "₹43,42,320", "₹42,43,880", "₹40,69,920"],
          ["Saving vs Lender A", "—", "₹98,440", "₹2,72,400"],
        ],
      },
      {
        title: "Flat Rate vs Reducing Balance — Equivalent Cost at Various Tenures",
        columnHeaders: ["Flat Rate Quoted", "Tenure (months)", "Equivalent Reducing APR", "EMI on ₹5L Loan"],
        rows: [
          ["10% flat", "36 months", "~18.0% APR", "₹18,098"],
          ["10% flat", "60 months", "~19.7% APR", "₹12,748"],
          ["12% flat", "48 months", "~21.4% APR", "₹14,967"],
          ["8% flat", "24 months", "~14.5% APR", "₹24,006"],
          ["6% flat", "84 months", "~11.1% APR", "₹9,415"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Balance comparison: how loan rate affects principal paydown speed",
      caption:
        "Even a 0.5% rate difference creates a visible gap in how quickly principal is retired. Use the calculator above to plot your specific loan amounts and rates side by side.",
    },
    faq: [
      {
        question: "What is the single most important metric when comparing loans?",
        answer:
          "Total cost of borrowing (all EMIs + all fees + any penalties). This is the only metric that fully accounts for rate differences, fee differences, and tenure differences simultaneously. If you must use one number, use total cost.",
      },
      {
        question: "How do I compare a bank loan with an NBFC loan?",
        answer:
          "Use the same inputs (amount, tenure) and compare EMI, total interest, processing fee, prepayment terms, and any mandatory insurance. NBFCs often approve faster with less paperwork but may charge higher rates or fees. Model both options in this calculator with identical tenure to compare fairly.",
      },
      {
        question: "Should I choose the lowest EMI or the lowest total interest?",
        answer:
          "If cash flow is tight, lowest EMI (usually from a longer tenure) may be necessary. But if you can afford a higher EMI, lowest total interest (usually from a shorter tenure or lower rate) is better — you exit debt sooner and keep more of your income.",
      },
      {
        question: "When is it worth paying a higher processing fee for a lower rate?",
        answer:
          "Calculate the break-even: divide the extra fee by the monthly interest saving. If the break-even is within 12–24 months, the lower rate usually wins (especially for long-tenure loans). Example: ₹30,000 extra fee, ₹500/month interest saving → break-even in 60 months. Worth it for a 10-year loan, questionable for a 3-year loan.",
      },
      {
        question: "Can I negotiate loan terms after receiving a sanction letter?",
        answer:
          "Yes — especially if you have a competing offer in hand. Lenders often match or come close to a competitor's rate to retain a creditworthy borrower. Processing fees, prepayment terms, and insurance requirements are also sometimes negotiable. Always ask.",
      },
    ],
    meta: {
      seoTitle: "Loan Comparison Calculator — Compare EMI, Interest & Total Cost | mywebcalculator",
      seoDescription:
        "Compare multiple loans side by side: EMI, total interest, processing fees, and true cost of borrowing. Includes flat vs reducing rate conversion, worked examples, and strategy tips.",
      keywords: [
        "loan comparison calculator",
        "compare loan offers",
        "best loan calculator",
        "loan emi comparison",
        "total cost of loan calculator",
        "flat vs reducing interest comparison",
        "compare home loan offers india",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "emi-comparison-calculator": {
    slug: "emi-comparison-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. EMI is calculated using standard reducing-balance amortization (monthly compounding). Inputs are illustrative — confirm actual EMI with your lender.",
    sections: [
      {
        heading: "What an EMI Comparison Calculator Does",
        paragraphs: [
          "An EMI comparison calculator lets you enter two or more loan scenarios (varying principal, rate, or tenure) and see how each affects your monthly obligation and total interest in parallel. Instead of running separate calculations and writing down results, the tool surfaces all the trade-offs on one screen.",
          "This is most useful in four scenarios: (1) Deciding between different loan amounts (how much more does borrowing ₹5L extra cost per month?), (2) Comparing the same loan at different rates (e.g. before and after negotiating with a lender), (3) Seeing the EMI impact of different tenures (10 years vs 15 years for the same loan), (4) Understanding the effect of a rate hike on your floating-rate loan.",
          "The EMI formula is the same in all cases: EMI = P × r × (1 + r)^n ÷ [(1 + r)^n − 1], where P = principal, r = monthly rate (APR ÷ 12), n = total months. What changes between scenarios is one or more of these three variables.",
        ],
      },
      {
        heading: "The EMI Formula and How Each Variable Drives It",
        paragraphs: [
          "Principal (P): EMI scales linearly with principal. Double the loan, double the EMI (for the same rate and tenure). A ₹10L loan at 9% for 10 years has an EMI of ₹12,668; a ₹20L loan in the same conditions has an EMI of ₹25,336.",
          "Interest rate (r): EMI responds non-linearly to rate changes, though the sensitivity appears linear in a small range. Going from 8% to 9% on a 20-year ₹30L loan increases EMI by ₹1,954/month (from ₹25,093 to ₹26,947) — that's ₹4,70,016 more in total interest over the tenure.",
          "Tenure (n): Longer tenure reduces EMI but increases total interest sharply. A ₹30L loan at 8.5%: 10-year tenure → EMI ₹37,185, total interest ₹14,62,200. 20-year tenure → EMI ₹26,035, total interest ₹32,48,400. The 10-year extra tenure costs ₹17,86,200 in extra interest to save ₹11,150/month. Only worth it if you invest that ₹11,150 at >8.5% post-tax.",
          "The rule: to minimize total interest, choose the highest EMI you can comfortably afford. To minimize monthly outflow, choose a longer tenure — but know you are paying for that flexibility in interest.",
        ],
      },
      {
        heading: "Worked Example: EMI Impact of Rate Change and Tenure Variation",
        paragraphs: [
          "Loan: ₹50,00,000 home loan. Compare three scenarios.",
          "Scenario A — 9% p.a., 20 years: EMI = ₹44,985. Total interest = ₹57,96,400.",
          "Scenario B — 8.5% p.a., 20 years: EMI = ₹43,391. Total interest = ₹54,13,840. Saving vs A: ₹1,594/month, ₹3,82,560 total interest. The 0.5% rate cut saves ₹3.8L over 20 years — worth negotiating hard for.",
          "Scenario C — 9% p.a., 15 years: EMI = ₹50,713. Total interest = ₹41,28,340. Saving vs A: ₹16,68,060 in total interest, but ₹5,728/month higher EMI. Switching from 20 to 15 years saves you the cost of a decent car in interest — if you can handle the cash flow.",
        ],
      },
      {
        heading: "Comparing EMIs When Rates May Change (Floating Rate Risk)",
        paragraphs: [
          "For floating-rate loans, your EMI is not fixed for the entire tenure. As the benchmark rate (MCLR, T-bill linked, repo-rate linked) changes, your EMI or tenure adjusts. This adds a comparison dimension: the base scenario (current rate) and a stress scenario (rate +1%, +2%).",
          "Stress-testing your EMI is critical. If your ₹40L home loan EMI is ₹35,000/month at 8.5%, what happens if rates rise to 10%? New EMI would be ₹38,600/month — an extra ₹3,600/month or ₹43,200/year. Make sure your salary supports this worst case before committing.",
          "Lenders can also stretch tenure instead of raising EMI (keeping the EMI fixed but adding months). This is less obvious but can add years to your loan. Ask your lender explicitly which adjustment method they apply.",
        ],
      },
      {
        heading: "EMI-to-Income Ratio: How Much Can You Borrow?",
        paragraphs: [
          "Most banks use a FOIR (Fixed Obligation to Income Ratio) of 40–50%. This means your total monthly EMI obligations (all loans combined) should not exceed 40–50% of your net monthly income. If your take-home is ₹1,00,000/month, your total EMIs should stay under ₹40,000–50,000.",
          "This FOIR ceiling is why the EMI comparison matters: if you are close to the limit, even ₹500–1,000/month difference between loan offers can determine whether you qualify for an additional loan later (car, personal, credit card EMI conversion) or not.",
          "Use the EMI comparison calculator to find the rate/tenure combination that fits within your FOIR target while keeping total interest as low as possible.",
        ],
      },
    ],
    tables: [
      {
        title: "EMI Comparison: ₹50L Home Loan Across Rates and Tenures",
        columnHeaders: ["Rate", "Tenure", "Monthly EMI", "Total Interest", "Total Outflow"],
        rows: [
          ["8.0% p.a.", "20 years", "₹41,822", "₹50,37,280", "₹1,00,37,280"],
          ["8.5% p.a.", "20 years", "₹43,391", "₹54,13,840", "₹1,04,13,840"],
          ["9.0% p.a.", "20 years", "₹44,985", "₹57,96,400", "₹1,07,96,400"],
          ["9.0% p.a.", "15 years", "₹50,713", "₹41,28,340", "₹91,28,340"],
          ["9.0% p.a.", "10 years", "₹63,338", "₹26,00,560", "₹76,00,560"],
          ["10.0% p.a.", "20 years", "₹48,251", "₹65,80,240", "₹1,15,80,240"],
        ],
      },
      {
        title: "EMI Sensitivity: Effect of ₹1L Extra Principal on a 15-Year Loan @ 9%",
        columnHeaders: ["Loan Amount", "Monthly EMI", "Extra EMI vs ₹30L Base", "Total Extra Interest"],
        rows: [
          ["₹30,00,000", "₹30,428", "—", "—"],
          ["₹35,00,000", "₹35,499", "+₹5,071", "+₹9,12,780"],
          ["₹40,00,000", "₹40,571", "+₹10,143", "+₹18,25,740"],
          ["₹45,00,000", "₹45,642", "+₹15,214", "+₹27,38,520"],
          ["₹50,00,000", "₹50,713", "+₹20,285", "+₹36,51,300"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Balance curves: same loan at different rates",
      caption:
        "Higher rate loans maintain a steeper balance curve, meaning more interest accrues per month for longer. Use the calculator above to compare your specific scenarios.",
    },
    faq: [
      {
        question: "Which is better: lower EMI or lower total interest?",
        answer:
          "Lower total interest is almost always better from a pure financial standpoint. Lower EMI (from a longer tenure) is only better if you invest the saved monthly amount at a rate exceeding your loan rate — which requires discipline and typically higher-risk instruments. Most people should optimize for total interest, not monthly payment.",
      },
      {
        question: "How much does 1% interest rate difference matter on a ₹30L, 20-year loan?",
        answer:
          "A 1% rate difference (e.g. 8% vs 9%) on a ₹30L, 20-year loan changes the EMI by about ₹2,080/month (₹24,960/year) and the total interest by approximately ₹5,00,000 over the full tenure. That 1% rate negotiation is worth ₹5 lakh — well worth the effort.",
      },
      {
        question: "Is it better to borrow less or negotiate a lower rate?",
        answer:
          "Both reduce total cost, but they work differently. Borrowing ₹5L less saves on both principal and interest. Getting a 0.5% lower rate reduces only interest. For large loans, the rate reduction often has a bigger absolute impact. For smaller loans or shorter tenures, reducing principal wins.",
      },
      {
        question: "What is FOIR and how does it affect how much I can borrow?",
        answer:
          "FOIR (Fixed Obligation to Income Ratio) is the maximum fraction of your net income that lenders allow toward total EMI obligations. Most banks set this at 40–50%. If your income is ₹80,000/month and FOIR is 50%, your total EMIs must not exceed ₹40,000. Use this as a ceiling when comparing loan scenarios.",
      },
      {
        question: "How do I compare EMIs if one lender quotes monthly rest and another quotes daily rest?",
        answer:
          "Daily rest means interest is computed on the outstanding balance every day, while monthly rest computes it once a month. Daily rest is slightly cheaper because any principal repayment reduces interest faster. For comparison purposes, treat both as reducing balance but ask each lender for the effective annual rate (EAR) to normalize them.",
      },
    ],
    meta: {
      seoTitle: "EMI Comparison Calculator — Compare Monthly Payments Across Loan Options | mywebcalculator",
      seoDescription:
        "Compare EMIs for different loan amounts, interest rates, and tenures side by side. Includes formula breakdown, worked examples, rate sensitivity tables, and FOIR guidance.",
      keywords: [
        "emi comparison calculator",
        "compare emi across loans",
        "loan emi comparator",
        "emi vs total interest comparison",
        "home loan emi comparison india",
        "compare different loan options",
        "emi sensitivity calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "fixed-vs-floating-interest-calculator": {
    slug: "fixed-vs-floating-interest-calculator",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Floating rate projections are illustrative — actual rate movements depend on RBI/central bank policy, lender margins, and your loan contract reset terms.",
    sections: [
      {
        heading: "Fixed vs Floating Interest Rate: The Core Difference",
        paragraphs: [
          "A fixed interest rate loan locks your rate for the entire tenure (or a fixed sub-period in a split-rate product). Your EMI is the same from month 1 to month 240 — no surprises. A floating rate loan is tied to a benchmark rate (such as RBI's repo rate, T-bill rate, or the bank's MCLR) and resets periodically. As the benchmark changes, your rate — and often your EMI or tenure — changes with it.",
          "The fundamental trade-off is certainty vs. expected savings. Fixed rates are typically set 0.5–2% higher than the prevailing floating rate to compensate for the lender's risk of holding a sub-market-rate asset if interest rates rise. You pay a premium for certainty. If rates fall during your tenure, floating wins. If rates rise, fixed wins.",
          "In India, most retail home loans are floating rate (mandated to be linked to an external benchmark like the repo rate since October 2019, per RBI guidelines). Fixed-rate home loans are less common and typically available only for shorter sub-periods or from NBFCs.",
        ],
      },
      {
        heading: "How to Compare Fixed and Floating Rate Costs",
        paragraphs: [
          "Step 1 — Baseline: For fixed rate, run a standard amortization at the fixed rate for the full tenure. Total cost is simply EMI × n.",
          "Step 2 — Floating scenarios: Model 3 rate paths — (a) rates stay flat, (b) rates rise 1% after year 3 and another 1% after year 6, (c) rates fall 1% after year 3. For each scenario, recalculate the EMI or tenure at each reset point and sum total payments.",
          "Step 3 — Compare: The fixed rate wins in the rising-rate scenario if the total payments under the fixed plan are less than under the stressed floating scenario. The floating rate wins in the flat or falling-rate scenario.",
          "Step 4 — Factor in the spread: If the floating rate starts 1.5% below the fixed rate, rates need to rise by more than 1.5% and stay there long enough for the fixed loan to save money overall. This is the 'break-even rate rise' — compute it before deciding.",
        ],
      },
      {
        heading: "Worked Example: ₹50 Lakh Loan — Fixed vs Floating",
        paragraphs: [
          "Loan: ₹50,00,000 for 20 years. Fixed rate: 9.5% (EMI = ₹46,607, total interest = ₹61,85,680). Starting floating rate: 8.5% (EMI = ₹43,391, starting difference: ₹3,216/month).",
          "Scenario 1 — Floating stays flat at 8.5% for 20 years: Total interest = ₹54,13,840. Floating saves ₹7,71,840 over the full tenure. Fixed costs more because you paid the certainty premium.",
          "Scenario 2 — Floating rises to 9.5% after year 5: For years 1–5 at 8.5%, EMI = ₹43,391 (60 payments). Outstanding at year 5 ≈ ₹46,03,280. For remaining 15 years at 9.5%, new EMI = ₹48,061. Total interest ≈ ₹25,70,160 (first 5 yr) + ₹38,50,980 (next 15 yr) = ₹64,21,140. Fixed (9.5% constant): ₹61,85,680. Fixed WINS by ₹2,35,460.",
          "Scenario 3 — Floating drops to 7.5% after year 3: First 3 years at 8.5% = ₹15,60,876 interest. Remaining 17 years at 7.5%, outstanding ≈ ₹47,61,220. New EMI = ₹41,266, total remaining interest ≈ ₹35,62,220. Grand total = ₹51,23,096. Floating SAVES ₹10,62,584 vs fixed.",
        ],
      },
      {
        heading: "Which to Choose: A Decision Framework",
        paragraphs: [
          "Choose FIXED if: (1) You believe interest rates will rise significantly during your loan tenure — particularly relevant when current rates are at cyclical lows. (2) You are on a tight or fixed income and cannot absorb EMI increases. (3) You need to budget precisely (young family, single earner). (4) The fixed-floating spread is narrow (< 0.5%) — limited upside from floating.",
          "Choose FLOATING if: (1) You believe rates are at or near cyclical highs and likely to fall. (2) You have income flexibility and can absorb a 20–30% EMI increase if rates rise 2%. (3) The floating rate is significantly lower (> 1.5% below fixed). (4) You plan to foreclose early — floating rate loans in India have no prepayment penalty.",
          "Hybrid/split rate: Some lenders offer fixed rate for the first 3–5 years, then floating for the remainder. This reduces initial uncertainty while capturing floating benefits for the bulk of the tenure — a reasonable compromise for many borrowers.",
        ],
      },
      {
        heading: "Rate Reset Mechanics and Consumer Rights",
        paragraphs: [
          "Since October 2019, RBI mandated that banks link all new floating-rate retail loans to an External Benchmark Lending Rate (EBLR) — most commonly the repo rate. When RBI cuts or hikes the repo rate, your loan rate must reset within 3 months. This is more transparent than the older MCLR system where banks had discretion on passing rate cuts.",
          "If your loan was sanctioned before October 2019 and is still on MCLR, you can request a switch to the repo-rate linked rate. There may be a one-time switching fee (typically ₹2,000–5,000). Given that repo-rate linked loans reset faster when RBI cuts rates, the switch is usually beneficial in a falling-rate environment.",
          "Always ask your lender: (1) What benchmark is my rate linked to? (2) What is the spread/markup above the benchmark? (3) How often does the rate reset? (4) Will my EMI change or will tenure adjust?",
        ],
      },
    ],
    tables: [
      {
        title: "Fixed vs Floating: Scenario Analysis — ₹50L Loan, 20 Years",
        columnHeaders: ["Scenario", "Total Interest (Fixed 9.5%)", "Total Interest (Floating)", "Winner"],
        rows: [
          ["Floating stays at 8.5%", "₹61,85,680", "₹54,13,840", "Floating saves ₹7.7L"],
          ["Floating rises to 9.5% at year 5", "₹61,85,680", "₹64,21,140", "Fixed saves ₹2.4L"],
          ["Floating rises to 10.5% at year 3", "₹61,85,680", "₹72,40,000 (est.)", "Fixed saves ₹10.5L"],
          ["Floating drops to 7.5% at year 3", "₹61,85,680", "₹51,23,096", "Floating saves ₹10.6L"],
          ["Floating drops to 6.5% at year 5", "₹61,85,680", "₹43,00,000 (est.)", "Floating saves ₹18.9L"],
        ],
      },
      {
        title: "Floating Rate EMI Stress Test — ₹40L Loan, Current Rate 8.5%, 15-Year Tenure",
        columnHeaders: ["Rate Scenario", "Revised EMI", "Monthly Increase", "Annual Extra Cost"],
        rows: [
          ["8.5% (baseline)", "₹39,396", "—", "—"],
          ["Rate rises to 9.0%", "₹40,571", "+₹1,175", "+₹14,100"],
          ["Rate rises to 9.5%", "₹41,766", "+₹2,370", "+₹28,440"],
          ["Rate rises to 10.0%", "₹42,982", "+₹3,586", "+₹43,032"],
          ["Rate rises to 11.0%", "₹45,464", "+₹6,068", "+₹72,816"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Fixed vs floating loan balance projection (illustrative)",
      caption:
        "Under a rising-rate floating scenario, the balance declines slower as more of each payment goes to higher interest. Under a falling-rate scenario, the balance drops faster. Model your expected rate path using the calculator above.",
    },
    faq: [
      {
        question: "Are fixed-rate home loans available in India?",
        answer:
          "Fully fixed-rate home loans are rare from major banks (PSBs and large private banks) following RBI's EBLR mandate. They are more commonly available from NBFCs and HFCs, or as 'fixed for first 5 years, then floating' hybrid products. Check with your lender for current offerings.",
      },
      {
        question: "What happens to my EMI when RBI cuts the repo rate?",
        answer:
          "For repo-rate linked (EBLR) loans, the rate cut passes through within 3 months at the next reset date. Your lender will reduce your EMI by a small amount, or maintain the EMI and reduce tenure. For MCLR-linked loans, the cut may take 6–12 months to pass through (depending on the MCLR tenor your rate is linked to).",
      },
      {
        question: "I'm currently on a floating rate. Should I convert to fixed?",
        answer:
          "Only worth considering if (1) you believe rates will rise significantly and stay elevated for most of your remaining tenure, and (2) the fixed rate your lender offers is close to your current floating rate. Conversion fees and any prepayment penalty on the existing loan typically add ₹20,000–50,000 to the switch cost. Model the break-even before converting.",
      },
      {
        question: "What is the spread above the benchmark, and can I negotiate it?",
        answer:
          "Your loan rate = Benchmark (e.g. repo rate) + Spread. The spread includes the bank's credit risk margin for your borrower profile. With a good CIBIL score (750+), stable income, and low LTV ratio, you can sometimes negotiate the spread down by 5–15 basis points at origination — or use a competing offer as leverage.",
      },
      {
        question: "How often should I review my floating rate loan?",
        answer:
          "At least once a year. When RBI changes the repo rate by 50+ basis points, verify your lender has passed through the change and check if a competing lender offers a significantly lower spread. A balance transfer may be worthwhile if the interest saving over remaining tenure exceeds the transfer cost (typically 0.25–0.5% of outstanding).",
      },
    ],
    meta: {
      seoTitle: "Fixed vs Floating Interest Calculator — Compare Rates, Scenarios & Savings | mywebcalculator",
      seoDescription:
        "Compare fixed and floating interest rate loans across multiple rate scenarios. Includes decision framework, worked example (₹50L loan), stress test tables, and RBI rate reset guide.",
      keywords: [
        "fixed vs floating interest calculator",
        "fixed vs floating home loan",
        "floating rate loan calculator",
        "compare fixed floating interest rate",
        "repo rate linked loan calculator",
        "should i choose fixed or floating loan",
        "floating rate emi stress test",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "interest-rate-comparison-tool": {
    slug: "interest-rate-comparison-tool",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Flat-to-reducing rate conversions use standard amortization math. Effective APR calculation assumes level monthly payments with no fees folded in.",
    sections: [
      {
        heading: "Why Interest Rate Comparison Is More Complex Than It Looks",
        paragraphs: [
          "A loan's quoted interest rate is rarely the whole story. Lenders quote rates in multiple ways — flat rate, reducing balance APR, monthly rest APR, daily rest APR, annual percentage rate (APR) with fees included — and comparing them naively leads to wrong decisions. A 10% flat rate is NOT cheaper than a 15% reducing balance rate; it is actually more expensive for most tenures.",
          "The interest rate comparison tool normalizes these different rate expressions into a single, comparable metric: the effective annual cost. This accounts for the compounding method, the payment frequency, and any significant upfront fees that should be amortized over the loan life.",
          "Understanding how to compare rates is one of the most financially valuable skills a borrower can have. In India alone, tens of thousands of borrowers take on car loans and personal loans without realizing that a '9% flat' personal loan is equivalent to roughly 16–18% reducing balance — comparable to a credit card.",
        ],
      },
      {
        heading: "Types of Interest Rates and How to Convert Between Them",
        paragraphs: [
          "Flat rate: Interest = Principal × r_flat × years. Divided across all EMIs. The principal never reduces in this model — you pay interest on the original amount even in the last month. Flat rates are common for vehicle loans and consumer durable loans from dealers and DSAs.",
          "Reducing balance APR (monthly compounding): The standard home loan and bank loan method. Interest each month = Outstanding balance × (APR ÷ 12). As principal reduces, interest charge reduces each month. This is the most borrower-friendly rate expression.",
          "Flat to reducing conversion: r_reducing ≈ 2 × n × r_flat ÷ (n + 1), where n = number of EMIs. For n = 36 (3 years): r_reducing ≈ 2 × 36 × r_flat ÷ 37 ≈ 1.946 × r_flat. For n = 60 (5 years): r_reducing ≈ 2 × 60 × r_flat ÷ 61 ≈ 1.967 × r_flat. Rule of thumb: a flat rate is roughly 1.83–1.95× the equivalent reducing rate for 3–5 year tenures.",
          "Effective Annual Rate (EAR): EAR = (1 + APR ÷ 12)^12 − 1. For a 9% APR (monthly compounding): EAR = (1.0075)^12 − 1 = 9.38%. EAR is most useful for comparing products with different compounding frequencies (e.g. monthly vs quarterly).",
        ],
      },
      {
        heading: "Worked Example: Decoding Three Loan Offers",
        paragraphs: [
          "You are considering a ₹3,00,000 personal loan for 3 years from three sources.",
          "Lender A (bank): 12% p.a. reducing balance. EMI = ₹9,969. Total interest = ₹58,884. Total outflow = ₹3,58,884.",
          "Lender B (NBFC): '7% flat'. EMI = (₹3,00,000 + ₹3,00,000 × 7% × 3) ÷ 36 = (₹3,00,000 + ₹63,000) ÷ 36 = ₹10,083. Total interest = ₹63,000. Equivalent reducing APR ≈ 7% × 1.946 = 13.6%. Despite the lower quoted rate, Lender B costs ₹4,116 more than Lender A.",
          "Lender C (fintech): '14% p.a. reducing, no processing fee'. EMI = ₹10,252. Total interest = ₹69,072. Most expensive of the three. The 'no fee' label doesn't help when the rate is 2% higher.",
          "Takeaway: Always convert to reducing APR and compare total outflow. The lowest headline rate does NOT always mean the cheapest loan.",
        ],
      },
      {
        heading: "How to Include Fees in the True Rate Comparison",
        paragraphs: [
          "Upfront fees (processing fee, documentation fee) reduce the effective loan amount you receive while increasing your payment obligation. The best way to account for them is to compute an Adjusted APR: the rate at which the present value of all EMIs equals the net disbursed amount (loan amount minus all upfront fees).",
          "Example: ₹5,00,000 loan at 10% APR for 5 years. EMI = ₹10,624. Processing fee = ₹15,000. You receive ₹4,85,000 net but pay EMIs as if you received ₹5,00,000. Adjusted APR (solving for rate where PV of EMIs = ₹4,85,000) ≈ 11.28%. The lender advertises 10%, but you are paying 11.28% on the money you actually received.",
          "Fee impact diminishes for longer tenures. A ₹15,000 fee on a 20-year ₹50L home loan adds only about 0.03% to the effective rate. The same fee on a 1-year ₹3L personal loan adds about 0.5%. Fees matter most for short-tenure, small-ticket loans.",
        ],
      },
      {
        heading: "Interest Rate Red Flags When Comparing Loan Offers",
        paragraphs: [
          "Red Flag 1 — 'No interest' or '0% EMI' schemes: These are not free. The retailer or dealer inflates the product price to cover the financing cost. Calculate the difference between the cash price and the financed total (principal + all EMIs) to find the implicit rate.",
          "Red Flag 2 — Very low flat rate: A 6% flat rate on a 5-year loan is equivalent to about 11.8% reducing. Compare this to bank rates before assuming it's a bargain.",
          "Red Flag 3 — Teaser rates: Some lenders offer a low rate for the first 12 months, then reset higher. Model both the teaser and post-teaser periods to find the blended effective rate over the full tenure.",
          "Red Flag 4 — Compulsory insurance bundled into EMI: If the lender mandates a single-premium insurance policy financed into the loan, it inflates both the principal and total interest. Ask for an equivalent quote without insurance if possible.",
        ],
      },
    ],
    tables: [
      {
        title: "Flat Rate to Reducing Balance Conversion Reference Table",
        columnHeaders: ["Flat Rate", "Tenure (months)", "Equiv. Reducing APR", "EMI per ₹1 lakh"],
        rows: [
          ["8% flat", "24 (2 yr)", "14.7%", "₹4,801"],
          ["8% flat", "36 (3 yr)", "15.5%", "₹3,516"],
          ["10% flat", "36 (3 yr)", "19.4%", "₹3,680"],
          ["10% flat", "60 (5 yr)", "19.7%", "₹2,575"],
          ["12% flat", "48 (4 yr)", "21.5%", "₹3,028"],
          ["6% flat", "84 (7 yr)", "11.1%", "₹1,781"],
        ],
      },
      {
        title: "Adjusted APR Including Processing Fee — ₹5L Loan, 60 Months, 10% APR",
        columnHeaders: ["Processing Fee", "Net Disbursed", "Nominal APR", "Adjusted APR", "Extra Effective Cost"],
        rows: [
          ["₹0", "₹5,00,000", "10.0%", "10.00%", "—"],
          ["₹5,000", "₹4,95,000", "10.0%", "10.23%", "+0.23%"],
          ["₹10,000", "₹4,90,000", "10.0%", "10.46%", "+0.46%"],
          ["₹15,000", "₹4,85,000", "10.0%", "10.71%", "+0.71%"],
          ["₹25,000", "₹4,75,000", "10.0%", "11.23%", "+1.23%"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "How effective rate changes with tenure (flat vs reducing)",
      caption:
        "The equivalent reducing rate for any given flat rate depends on tenure. Shorter tenures make flat rate loans look even more expensive relative to reducing balance. The calculator above shows the exact conversion for your loan parameters.",
      sparkValues: [1.95, 1.93, 1.9, 1.86, 1.83, 1.8, 1.77],
    },
    faq: [
      {
        question: "What is the simplest way to compare two loan offers with different rate types?",
        answer:
          "Ask both lenders: 'What is the total amount I will pay back (all EMIs + fees), and what is the net amount I receive?' The ratio (total paid ÷ net received) − 1 gives you a simple total cost percentage that is directly comparable, regardless of the rate type each lender quoted.",
      },
      {
        question: "Is a flat rate ever lower cost than a reducing rate?",
        answer:
          "Never, if both are for the same loan amount and tenure. A flat rate always costs more because you pay interest on the full original principal throughout, whereas reducing balance interest decreases as you repay principal. A lower flat rate number just disguises a higher true cost.",
      },
      {
        question: "How do I know if a '0% interest' scheme is actually free?",
        answer:
          "Ask for the cash price of the product and compare to the total financed cost (down payment + all EMIs). If they differ, the difference is the implicit interest. Divide by the loan amount and use the interest rate conversion formula to find the true APR.",
      },
      {
        question: "What is MCLR and how does it affect my floating rate?",
        answer:
          "MCLR (Marginal Cost of Funds-based Lending Rate) was the predecessor to EBLR for bank loans. It incorporates the bank's cost of funds plus a spread. For pre-Oct-2019 loans, your rate = MCLR + spread. MCLR resets monthly, but your loan rate resets only at the MCLR tenor linked to your loan (often 6 months or 1 year). Switching to a repo-rate linked product often results in faster rate-cut pass-through.",
      },
      {
        question: "How accurate is the flat-to-reducing conversion formula?",
        answer:
          "The approximation r_reducing ≈ 2nr_flat ÷ (n+1) is accurate to within ±0.1–0.2% for standard loan tenures (12–84 months). For very short tenures (< 6 months) or very long tenures (> 10 years), use the exact IRR method: find the monthly rate r such that PV of all EMIs at rate r = original principal.",
      },
    ],
    meta: {
      seoTitle: "Interest Rate Comparison Tool — Flat Rate vs APR, Fee-Adjusted True Cost | mywebcalculator",
      seoDescription:
        "Compare interest rates across loan types: flat rate, reducing balance APR, and fee-adjusted effective rate. Includes conversion formulas, worked examples, and red-flag guide.",
      keywords: [
        "interest rate comparison tool",
        "flat rate vs reducing balance calculator",
        "loan interest rate comparison",
        "effective apr calculator",
        "compare loan interest rates india",
        "flat to reducing rate conversion",
        "true cost of loan calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },

  "bank-loan-comparison-tool": {
    slug: "bank-loan-comparison-tool",
    vertical: "finance-loan",
    category: "finance",
    shellNote:
      "Runs in your browser. Inputs reflect publicly available rate and fee structures for illustrative purposes. Always verify current rates and terms directly with each bank or lender before applying.",
    sections: [
      {
        heading: "How to Compare Bank Loan Offers Effectively",
        paragraphs: [
          "Comparing bank loan offers is not as simple as looking at interest rates on a lender's website. The final cost of a loan depends on the combination of interest rate, processing fee, prepayment penalty structure, part-payment terms, insurance requirements, and rate reset mechanism for floating loans. Each dimension can add or subtract thousands of rupees from the true total cost.",
          "A bank loan comparison tool standardizes this evaluation by accepting your target loan parameters (amount, preferred tenure) and computing — for each lender you input — the full amortization cost: EMI, total interest, total outflow including fees, and the effective APR incorporating upfront costs. This lets you rank options by true cost rather than headline rate.",
          "The three most financially significant variables to compare across banks are: (1) the effective interest rate (rate + amortized fee), (2) prepayment terms (does the bank charge a penalty, and how much?), and (3) the rate reset mechanism for floating loans (EBLR vs MCLR, reset frequency, spread over benchmark).",
        ],
      },
      {
        heading: "What to Ask Each Bank Before Comparing",
        paragraphs: [
          "1. What is the exact interest rate and how is it structured? Ask whether it is fixed, floating, or hybrid. For floating, ask: 'What is the benchmark? What is your spread over the benchmark today? How often does it reset?'",
          "2. What is the complete fee schedule? Request the full schedule of: processing fee (percentage or fixed), documentation charges, technical valuation fee (for secured loans), legal fee, stamp duty on the mortgage deed, and any annual maintenance charges. These can add ₹15,000–75,000 to a home loan.",
          "3. What are the prepayment and foreclosure terms? For floating-rate home loans, banks cannot charge a prepayment penalty (RBI directive). But fixed-rate loans and personal loans may have 1–5% foreclosure charges. For auto loans, check if part-payment is allowed and how it is applied.",
          "4. What is the disbursement timeline? For a home under construction, will the bank disburse in tranches? Will you pay pre-EMI (interest only) during the construction phase? If so, factor in this pre-EMI cost.",
        ],
      },
      {
        heading: "Worked Example: Three Banks, Same ₹35 Lakh Home Loan",
        paragraphs: [
          "Requirements: ₹35,00,000 home loan, 15-year tenure, floating rate. Comparing SBI, HDFC, and an NBFC.",
          "SBI: 8.5% + 0% processing (for existing salary account holders) = effective EMI ₹34,496. Total interest ₹27,09,280. Net advantage: zero fee saves ₹0 directly, but is the clear winner on total cost at this rate.",
          "HDFC Bank: 8.6% + ₹10,000 processing. EMI = ₹34,713. Total interest ₹27,48,340. Adjusted APR ≈ 8.64%. Total cost = ₹27,58,340. Costs ₹49,060 more than SBI.",
          "NBFC (e.g. Bajaj Housing Finance): 9.0% + ₹15,000 processing. EMI = ₹35,499. Total interest ₹28,89,820. Total cost = ₹29,04,820. Costs ₹1,95,540 more than SBI. The NBFC's 0.5% higher rate makes a ₹1.5L difference over 15 years.",
          "Decision: SBI wins here if approval is achievable. The NBFC may be worth the extra cost if approval likelihood is much higher (e.g. self-employed borrower), processing is faster, or a larger loan amount is sanctioned that SBI declined.",
        ],
      },
      {
        heading: "Comparing Loans When Approval Likelihood Differs",
        paragraphs: [
          "Not every lender will approve the same loan amount for the same borrower. Banks have tighter eligibility criteria (CIBIL score 750+, stable income for 2+ years, LTV ≤ 75–80%), while NBFCs often approve higher LTVs, lower credit scores, and newer borrowers — at a higher rate.",
          "The right comparison is not just rate vs rate, but rate vs likelihood-of-approval × overall cost. If a PSB approves only ₹30L but an NBFC approves ₹35L, and you need ₹35L, the PSB option is not actually on the table. Model both your primary target (best rate, standard approval) and a fallback (higher rate, higher approval probability) using the comparison tool.",
          "Also consider turnaround time: for time-sensitive property purchases, a bank taking 3 weeks to sanction may cost you the property, while an NBFC doing it in 5 days at a slightly higher rate is economically rational.",
        ],
      },
      {
        heading: "Understanding a Sanction Letter and Final Offer Sheet",
        paragraphs: [
          "The sanction letter is the bank's binding offer, subject to property valuation and legal due diligence. It will specify: sanctioned amount, rate (and benchmark linkage for floating), tenure, EMI, processing fee, prepayment terms, and any conditions precedent.",
          "Always get sanction letters from at least two lenders before committing. It costs only your time (and a possible ₹500–2,000 per application for credit bureau pulls), but gives you genuine negotiating leverage. Lenders know you can walk, and they are more likely to offer a rate waiver or fee waiver to close the deal.",
          "Key items to verify in the sanction letter: (1) The spread over benchmark — ensure it matches what you were quoted. (2) Any 'rate floor' clause — some lenders include a clause that the rate cannot fall below a minimum even if the benchmark does. (3) Insurance mandate — confirm whether any insurance is optional or forced.",
        ],
      },
    ],
    tables: [
      {
        title: "Three-Bank Comparison — ₹35L Home Loan, 15 Years",
        columnHeaders: ["Lender", "Rate", "Processing Fee", "Monthly EMI", "Total Interest", "Total Cost"],
        rows: [
          ["SBI (example)", "8.5% EBLR-linked", "₹0 (select scheme)", "₹34,496", "₹27,09,280", "₹27,09,280"],
          ["HDFC Bank (example)", "8.6% EBLR-linked", "₹10,000", "₹34,713", "₹27,48,340", "₹27,58,340"],
          ["NBFC (example)", "9.0%", "₹15,000", "₹35,499", "₹28,89,820", "₹29,04,820"],
          ["Cost difference (NBFC vs SBI)", "+0.5% rate", "+₹15,000 fee", "+₹1,003/month", "+₹1,80,540", "+₹1,95,540"],
        ],
      },
      {
        title: "Typical Bank Loan Fees and Charges Reference",
        columnHeaders: ["Charge Type", "Typical Range", "When Applicable", "Negotiable?"],
        rows: [
          ["Processing fee", "0.25% – 1% of loan", "At application / sanction", "Often yes"],
          ["Technical/valuation fee", "₹3,000 – ₹15,000", "Secured loans", "Rarely"],
          ["Legal/documentation fee", "₹5,000 – ₹20,000", "Secured loans", "Rarely"],
          ["Prepayment penalty (floating)", "0% (RBI mandate for banks)", "Home loans", "N/A"],
          ["Prepayment penalty (fixed rate)", "1% – 4% of prepaid amount", "Fixed-rate loans", "Sometimes"],
          ["Balance transfer fee", "0.25% – 0.5%", "At new lender", "Yes"],
          ["EMI bounce / late payment", "₹250 – ₹1,000 per instance", "On default", "No"],
        ],
      },
    ],
    chart: {
      kind: "loanBalanceDemo",
      title: "Total interest comparison across lenders (illustrative)",
      caption:
        "Even a 0.5% rate difference creates a large gap in total interest over a 15–20 year home loan tenure. Use the calculator above to input your specific offers and see the difference in total cost.",
    },
    faq: [
      {
        question: "Should I always go with the lowest interest rate bank?",
        answer:
          "Not always. The lowest rate may come with higher fees, mandatory insurance, restrictive prepayment terms, or lower sanction amounts. Compute total cost of borrowing (all outflows over the loan life) and factor in your likelihood of approval at each lender before deciding.",
      },
      {
        question: "Is it worth applying to multiple banks simultaneously?",
        answer:
          "Yes — with a caveat. Multiple hard credit enquiries within a short period (30–45 days) are typically grouped as a single enquiry by credit bureaus (rate-shopping protection). Applying to 2–4 lenders simultaneously is standard practice and generally does not harm your score significantly.",
      },
      {
        question: "What is a balance transfer and when is it worth doing?",
        answer:
          "A balance transfer moves your outstanding loan from your current lender to a new lender at a lower rate. It is worth doing when: (1) your current rate is ≥ 0.5% above the market rate, (2) your remaining tenure is long (> 5 years), and (3) the transfer cost (processing fee at new lender + foreclosure charge at old lender) is recovered within 24 months of interest savings.",
      },
      {
        question: "Can I negotiate the rate after receiving a sanction letter?",
        answer:
          "Yes. Present the sanction letter from your preferred lender to the competing lender and ask them to match or beat it. Lenders often reduce their offered spread by 5–15 basis points to win a creditworthy borrower, especially at loan amounts above ₹20–30 lakh.",
      },
      {
        question: "How do I verify that my bank is passing RBI rate cuts to me?",
        answer:
          "Your EMI statement or net banking portal should show the current interest rate. Cross-reference it with the published EBLR or MCLR of your bank (available on their website). Your rate = benchmark rate + spread. If the benchmark has fallen but your rate has not, contact the bank to request a reset — they are obligated to do so at the next reset date.",
      },
    ],
    meta: {
      seoTitle: "Bank Loan Comparison Tool — Side-by-Side EMI, Rate & Fee Comparison | mywebcalculator",
      seoDescription:
        "Compare home, car, and personal loans from multiple banks: EMI, total interest, fees, and true cost of borrowing. Includes worked example, fee reference table, and negotiation tips.",
      keywords: [
        "bank loan comparison tool",
        "compare bank loan offers india",
        "home loan comparison calculator",
        "best bank for home loan india",
        "loan comparison tool",
        "compare emi different banks",
        "bank loan true cost calculator",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
