import type { CalculatorCategory, CalculatorDefinition } from "./types";

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  {
    slug: "weighted-gpa",
    title: "Weighted GPA calculator",
    shortTitle: "Weighted GPA",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Compute your semester or cumulative GPA from credit hours and letter grades on a 4.0 scale.",
    longDescription:
      "Use this weighted GPA calculator to combine course credits with letter grades or 4.0-scale points. It is ideal for semester planning and estimating cumulative GPA using a standard A–F scale with plus and minus.",
    keywords: [
      "weighted GPA calculator",
      "GPA calculator",
      "semester GPA",
      "credit hours GPA",
      "4.0 scale",
      "grade point average",
    ],
    faq: [
      {
        question: "What is weighted GPA?",
        answer:
          "Weighted GPA multiplies each course grade (on a scale such as 4.0) by that course’s credit hours, sums those products, and divides by total credits. Heavier courses influence your GPA more than lighter ones.",
      },
      {
        question: "Is this the same scale every school uses?",
        answer:
          "No. Colleges may differ on plus/minus values, A+ above 4.0, pass/fail, or repeated courses. Always confirm with your institution’s registrar or handbook.",
      },
      {
        question: "Can I enter numeric points instead of letters?",
        answer:
          "Yes. Enter a number from 0 to 4 per course if you already know the grade points your school assigns.",
      },
      {
        question: "Does this store my grades?",
        answer:
          "No. Calculations run in your browser; nothing is sent to our servers for this tool.",
      },
    ],
  },
  {
    slug: "grade-needed",
    title: "Grade needed for target GPA",
    shortTitle: "Target GPA",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Find the GPA you must earn on upcoming credits to reach your target cumulative GPA.",
    longDescription:
      "Estimate the average GPA you need on future credit hours to hit a cumulative target. Helpful when planning how hard you must perform on remaining courses to reach a goal.",
    keywords: [
      "GPA needed",
      "target GPA calculator",
      "cumulative GPA goal",
      "future GPA required",
      "college GPA planning",
    ],
    faq: [
      {
        question: "How is the needed GPA calculated?",
        answer:
          "We use: (target × total future credits − current GPA × credits earned) ÷ upcoming credits. This is the simple average GPA required on the new credits only, assuming your past GPA stays fixed.",
      },
      {
        question: "What if the tool shows I need above a 4.0?",
        answer:
          "That usually means the target is not reachable on the remaining credits under a 4.0 cap. You may need more credits, a different target, or grade replacement policies your school allows.",
      },
      {
        question: "Are pass/fail or withdrawals included?",
        answer:
          "This model assumes you enter GPA-relevant credits only. Pass/fail and W grades vary by school and are not modeled here.",
      },
      {
        question: "Is this official advice?",
        answer:
          "No. It is a planning estimate. Always verify with your academic advisor or degree audit system.",
      },
    ],
  },
  {
    slug: "exam-grade",
    title: "Exam score needed",
    shortTitle: "Exam score",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Given your current average and how much the final counts, see what score you need for your goal.",
    longDescription:
      "Find the exam or final percentage you need to reach a desired course average when you know your current average and the weight of the remaining assessment.",
    keywords: [
      "final exam calculator",
      "grade needed on final",
      "exam score calculator",
      "weighted average final",
      "what do I need on the final",
    ],
    faq: [
      {
        question: "What does “exam weight” mean?",
        answer:
          "It is the share of the final grade the exam represents, as a percent of 100. For example, 30 means the final is 30% of the course grade and the rest is everything else averaged in.",
      },
      {
        question: "Why might I see a score above 100%?",
        answer:
          "That implies reaching your goal on the remaining weight is not possible with a single exam under the numbers you entered—double-check weights and your current average.",
      },
      {
        question: "Does this handle curved courses?",
        answer:
          "No. It assumes a linear weighted average. Curves and drops are not modeled.",
      },
      {
        question: "Are results guaranteed?",
        answer:
          "No. Syllabus rules, rounding, and extra credit can change outcomes. Use this as a planning estimate only.",
      },
    ],
  },
  {
    slug: "loan-payment",
    title: "Loan payment calculator",
    shortTitle: "Loan payment",
    category: "finance",
    subCategorySlug: "loans-emi",
    description:
      "Estimate fixed monthly payments on an amortizing loan from principal, APR, and term.",
    longDescription:
      "Calculate a fixed monthly payment for a standard amortizing loan using principal, annual percentage rate, and term in years. See how much interest you may pay over the life of the loan.",
    keywords: [
      "loan payment calculator",
      "amortization calculator",
      "monthly payment",
      "APR calculator",
      "personal loan estimate",
    ],
    faq: [
      {
        question: "Is this the payment my lender will quote?",
        answer:
          "Maybe not. Lenders add fees, insurance, variable rates, and different day-count conventions. This tool shows a standard fixed-rate amortizing estimate only.",
      },
      {
        question: "What is APR?",
        answer:
          "Annual Percentage Rate is a yearly interest rate for borrowing. Here it is converted to a monthly rate for payment math. It may not include every fee your lender charges.",
      },
      {
        question: "Does this handle extra payments?",
        answer:
          "Not in the default formula. Extra principal payments shorten the loan and change total interest but are not modeled in the basic schedule shown.",
      },
      {
        question: "Is this financial advice?",
        answer:
          "No. It is educational. Consult a qualified professional for borrowing decisions.",
      },
    ],
  },
  {
    slug: "compound-interest",
    title: "Compound interest",
    shortTitle: "Compound interest",
    category: "finance",
    subCategorySlug: "investment-wealth",
    description:
      "Project future balance with compound growth using principal, rate, time, and compounding frequency.",
    longDescription:
      "Project how savings or investments may grow with compound interest over time. Choose how often interest compounds and see future balance and interest earned on a lump sum.",
    keywords: [
      "compound interest calculator",
      "investment growth",
      "future value calculator",
      "APY compounding",
      "savings projection",
    ],
    faq: [
      {
        question: "What does compounding frequency change?",
        answer:
          "More frequent compounding (e.g. monthly vs annually) credits interest more often, so growth can be slightly higher for the same nominal annual rate.",
      },
      {
        question: "Is this the same as APY?",
        answer:
          "APY reflects compounding in one number. This calculator uses a stated annual rate plus an explicit compounding frequency instead of a single APY input.",
      },
      {
        question: "Are taxes or inflation included?",
        answer:
          "No. The chart and numbers are nominal—not adjusted for tax, fees, or inflation.",
      },
      {
        question: "Can I rely on this for investing?",
        answer:
          "Only as a rough illustration. Real products have fees, variable returns, and risk. This is not investment advice.",
      },
    ],
  },
  {
    slug: "tip-splitter",
    title: "Tip & split calculator",
    shortTitle: "Tip & split",
    category: "finance",
    subCategorySlug: "salary-income",
    description:
      "Split a bill with tip fairly across any number of people.",
    longDescription:
      "Calculate tip amount, total with tip, and fair per-person share when splitting a check. Enter the bill, tip percentage, and number of diners for a quick restaurant math helper.",
    keywords: [
      "tip calculator",
      "split bill calculator",
      "restaurant tip",
      "gratuity calculator",
      "divide check",
    ],
    faq: [
      {
        question: "Is tip calculated on the pre-tax amount?",
        answer:
          "This tool uses the bill amount you enter—typically the subtotal before tax if that is what you type. If your group tips on post-tax totals, include tax in the bill field.",
      },
      {
        question: "What about rounding to cash?",
        answer:
          "Displayed amounts are exact splits; real-world cash rounding may differ by a few cents per person.",
      },
      {
        question: "Does it handle separate checks?",
        answer:
          "No. It assumes one shared bill split evenly. Uneven orders need manual adjustment.",
      },
      {
        question: "Is this legal or tax advice?",
        answer:
          "No. It is a simple arithmetic helper for splitting costs.",
      },
    ],
  },
  {
    slug: "days-between",
    title: "Days between dates",
    shortTitle: "Days between",
    category: "conversion",
    subCategorySlug: "time-date",
    description:
      "Count calendar days, weeks, and approximate months between two dates.",
    longDescription:
      "Count the number of calendar days between two dates, plus weeks and approximate months. Useful for countdowns, travel planning, and quick date math.",
    keywords: [
      "days between dates",
      "date difference calculator",
      "countdown days",
      "how many days",
      "calendar calculator",
    ],
    faq: [
      {
        question: "Are the start and end days inclusive?",
        answer:
          "The tool reports the absolute difference in calendar days between the two dates (midnight-based anchor), not inclusive counting unless both dates are the same.",
      },
      {
        question: "How do time zones work?",
        answer:
          "We use a noon UTC anchor on the calendar date you pick to reduce daylight-saving edge cases. For legal deadlines, use an official time-zone-aware tool.",
      },
      {
        question: "Why are months approximate?",
        answer:
          "Months vary in length; we use an average month length for a rough figure only.",
      },
      {
        question: "Can I use this for contracts?",
        answer:
          "Only as informal help. Legal date counting may follow different rules.",
      },
    ],
  },
  {
    slug: "emi-calculator-universal",
    title: "EMI calculator (universal)",
    shortTitle: "Universal EMI",
    category: "finance",
    subCategorySlug: "loans-emi",
    description:
      "Monthly EMI, total repayment, and interest for a fixed-rate reducing-balance loan.",
    longDescription:
      "General-purpose EMI tool: same reducing-balance math as our other loan calculators, with currency and term-mode controls, optional monthly prepayment, annual EMI step-up, shareable links, and CSV-friendly rounding options. Use it when you want one page that covers many loan shapes without picking a product-specific name.",
    keywords: [
      "EMI calculator",
      "loan EMI",
      "monthly payment calculator",
      "amortizing loan",
      "reducing balance EMI",
    ],
    faq: [
      {
        question: "Is EMI the same as my bank’s quote?",
        answer:
          "Often close, but lenders may round, use different day-count rules, or add fees and insurance. Treat this as an educational estimate.",
      },
      {
        question: "What does reducing balance mean?",
        answer:
          "Interest accrues on the remaining principal each month. As principal falls, the interest portion of each payment usually falls too.",
      },
      {
        question: "Does this support floating rates?",
        answer:
          "No. It assumes one fixed APR for the whole term. Variable-rate loans need scenario analysis beyond this tool.",
      },
      {
        question: "Is this financial advice?",
        answer:
          "No. It is a math illustration only. Confirm terms with your lender or a qualified professional.",
      },
      {
        question: "How is this different from the Loan EMI or Reducing balance EMI pages?",
        answer:
          "The math and form are the same; this page is positioned as the all-around entry point. The other two emphasize conventional loan wording and the reducing-balance method in the title and FAQs for search and teaching.",
      },
    ],
  },
  {
    slug: "loan-emi-calculator",
    title: "Loan EMI calculator",
    shortTitle: "Loan EMI",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Standard fixed-rate loan EMI from amount, APR, and years.",
    longDescription:
      "Classic “loan EMI” framing: enter financed principal, nominal APR, and term (years or months) for a standard fixed-rate amortizing loan. Includes the same advanced options as our universal EMI tool—prepayment, step-up, share links, and optional bank-style rounding.",
    keywords: ["loan EMI", "monthly installment", "borrow payment calculator", "APR loan"],
    faq: [
      {
        question: "How is EMI calculated here?",
        answer:
          "We use the standard amortization formula with monthly compounding of the quoted nominal APR—common for many consumer loan calculators.",
      },
      {
        question: "Why might totals differ from my statement?",
        answer:
          "Processing dates, partial periods, fees, and rounding can shift numbers slightly compared to a simple model.",
      },
      {
        question: "Can I include a down payment?",
        answer:
          "Enter only the financed principal after down payment. This tool does not split vehicle or home price versus loan amount automatically.",
      },
      {
        question: "What about prepayments?",
        answer:
          "Use Advanced on the calculator: add extra principal per month and/or an annual EMI step-up percentage to see a simulated payoff and balance chart.",
      },
      {
        question: "Related tools on this site",
        answer:
          "See also the Universal EMI calculator (same engine, broader positioning) and the Reducing balance EMI page, which stresses interest-on-outstanding-principal wording. Loan payment gives payment-only focus; amortization exports the full schedule as CSV.",
      },
    ],
  },
  {
    slug: "interest-rate-calculator",
    title: "Interest rate calculator",
    shortTitle: "Implied APR",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Back-solve APR from principal, monthly payment, and term.",
    longDescription:
      "Given a loan principal, fixed monthly payment, and term, estimate the nominal annual interest rate implied by a standard reducing-balance amortization.",
    keywords: ["implied interest rate", "APR from payment", "loan rate solver", "reverse EMI"],
    faq: [
      {
        question: "Why does the solver fail for some inputs?",
        answer:
          "A payment below the zero-interest amortization (principal ÷ months) is impossible for a standard loan. Very high rates may also fall outside the search range.",
      },
      {
        question: "Is the result my APR or APY?",
        answer:
          "We report a nominal annual rate with monthly compounding, similar to typical loan APR quotes—not annual percentage yield (APY).",
      },
      {
        question: "Can this verify a lender’s rate?",
        answer:
          "It can give a cross-check, but fees, rebates, and non-standard schedules mean your contract is authoritative.",
      },
      {
        question: "What compounding is assumed?",
        answer:
          "Monthly: the annual rate is divided by 12 for each payment period.",
      },
    ],
  },
  {
    slug: "loan-amount-calculator",
    title: "Loan amount calculator",
    shortTitle: "Loan amount",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "How much you can borrow for a target EMI, rate, and term.",
    longDescription:
      "Solve for principal (loan amount) from an affordable monthly payment, nominal APR, and repayment term on a standard amortizing loan.",
    keywords: ["how much can I borrow", "loan eligibility amount", "EMI to principal", "affordable loan"],
    faq: [
      {
        question: "Does this include taxes or insurance?",
        answer:
          "No. It only converts EMI, rate, and term into principal. Housing costs often add escrow items separately.",
      },
      {
        question: "Why is the amount sensitive to rate?",
        answer:
          "A higher APR consumes more of each payment as interest, so the same EMI supports a smaller principal.",
      },
      {
        question: "Is this an approval amount?",
        answer:
          "No. Lenders use income, credit, and policy rules. This is purely the math link between payment, rate, and principal.",
      },
      {
        question: "What if APR is zero?",
        answer:
          "Principal equals EMI multiplied by the number of months—straight division with no interest.",
      },
    ],
  },
  {
    slug: "loan-tenure-calculator",
    title: "Loan tenure calculator",
    shortTitle: "Loan tenure",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Time to pay off a loan given principal, EMI, and APR.",
    longDescription:
      "Estimate how long it will take to repay a fixed-rate reducing-balance loan when you pay a constant monthly amount.",
    keywords: ["loan payoff time", "tenure calculator", "months to repay", "EMI tenure"],
    faq: [
      {
        question: "Why must EMI exceed first-month interest?",
        answer:
          "If the payment does not cover interest on the opening balance, the balance would grow, which this standard model does not allow.",
      },
      {
        question: "Are fractional months real?",
        answer:
          "The math returns a continuous tenure; real loans use whole payment periods and rounding, so expect small differences.",
      },
      {
        question: "Does a longer tenure always mean more interest?",
        answer:
          "Usually yes for the same rate and principal, because principal declines more slowly when payments are smaller.",
      },
      {
        question: "What about 0% APR?",
        answer:
          "Tenure is principal divided by EMI, converted to years.",
      },
    ],
  },
  {
    slug: "total-interest-payable-calculator",
    title: "Total interest payable calculator",
    shortTitle: "Total interest",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Lifetime interest and total repayment on a fixed-rate loan.",
    longDescription:
      "From principal, APR, and term, see total interest paid and total cash outflow on a standard amortizing schedule.",
    keywords: ["total interest on loan", "cost of borrowing", "loan interest total", "finance charge estimate"],
    faq: [
      {
        question: "Is total interest the same as finance charge?",
        answer:
          "Often related, but regulated disclosures may include or exclude certain fees. Here we show interest from principal and rate only.",
      },
      {
        question: "Why is early payoff cheaper?",
        answer:
          "Less time means fewer interest accrual periods on the outstanding balance, so total interest drops if you prepay principal.",
      },
      {
        question: "Does this include origination fees?",
        answer:
          "No. Add fees manually to compare offers holistically.",
      },
      {
        question: "Can I compare two loans with this?",
        answer:
          "Yes for simple scenarios: run each principal/rate/term separately and compare total interest and EMI side by side.",
      },
    ],
  },
  {
    slug: "loan-amortization-calculator",
    title: "Loan amortization calculator",
    shortTitle: "Amortization",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Month-by-month principal, interest, and balance schedule.",
    longDescription:
      "Generate a full amortization table for a fixed-rate loan: each payment’s interest and principal split and the remaining balance after every month.",
    keywords: ["amortization schedule", "loan table", "principal vs interest", "mortgage schedule"],
    faq: [
      {
        question: "Why does early interest dominate?",
        answer:
          "The balance is highest at the start, so the same rate applied to a larger balance yields larger interest charges early on.",
      },
      {
        question: "Will rows match my bank exactly?",
        answer:
          "Minor differences can come from rounding per period, payment timing, or leap months depending on the lender’s system.",
      },
      {
        question: "Can I export the table?",
        answer:
          "Yes. Use Download CSV in the result panel to get a comma-separated schedule plus a short metadata header (principal, APR, term, optional prepayment/step-up, and whether penny rounding was on).",
      },
      {
        question: "What if the term is very long?",
        answer:
          "The table lists every month; long loans produce many rows—scroll inside the panel on small screens.",
      },
    ],
  },
  {
    slug: "reducing-balance-emi-calculator",
    title: "Reducing balance EMI calculator",
    shortTitle: "Reducing balance",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "EMI on interest charged on the outstanding balance each month.",
    longDescription:
      "Explicitly teaches reducing balance: interest applies to outstanding principal each month, then the rest of the payment cuts principal—the standard amortizing model. Same calculator features as Loan EMI and Universal EMI (prepayment, step-up, charts, shareable URLs, penny rounding).",
    keywords: ["reducing balance loan", "diminishing balance", "EMI outstanding principal", "loan interest method"],
    faq: [
      {
        question: "How is this different from flat rate?",
        answer:
          "Flat-rate marketing often applies simple interest on the original principal for the whole term, which can cost more than reducing balance for the same headline number.",
      },
      {
        question: "Is reducing balance the same as amortization?",
        answer:
          "In typical usage, yes—this is the standard amortizing loan model.",
      },
      {
        question: "Do credit cards work this way?",
        answer:
          "Minimum payments follow different rules and rates may change; this tool is for fixed-installment loans.",
      },
      {
        question: "Can EMI change mid-loan?",
        answer:
          "The default is a fixed contractual EMI. Use Advanced to model an annual step-up percentage or use the dedicated EMI tools’ prepayment fields for extra principal each month.",
      },
      {
        question: "Where else can I run the same numbers?",
        answer:
          "Try the EMI calculator (universal) or Loan EMI calculator—they share this engine. For flat-rate marketing comparisons, use Flat vs reducing interest.",
      },
    ],
  },
  {
    slug: "flat-vs-reducing-interest-calculator",
    title: "Flat vs reducing interest calculator",
    shortTitle: "Flat vs reducing",
    category: "finance",
    subCategorySlug: "loans-emi",
    description: "Compare flat-rate and reducing-balance loan costs side by side.",
    longDescription:
      "See EMI and total interest for a flat-rate quote (interest on original principal for the full term) versus a reducing-balance APR loan with the same principal and term.",
    keywords: ["flat rate vs reducing", "loan comparison", "effective interest", "flat interest EMI"],
    faq: [
      {
        question: "How is flat interest modeled?",
        answer:
          "Total interest equals principal × flat annual percent × years; that total plus principal is divided evenly across months. This matches many simplified flat-rate promotions but not every lender wording.",
      },
      {
        question: "Why can flat cost more?",
        answer:
          "Interest does not drop as principal is repaid, so you often pay interest on money you have already returned.",
      },
      {
        question: "Should I always pick the lower EMI?",
        answer:
          "Compare total cost, fees, and flexibility—not EMI alone.",
      },
      {
        question: "Do both sides use the same term?",
        answer:
          "Yes, for a fair comparison we keep principal and years identical; only the interest methods differ.",
      },
    ],
  },
  {
    slug: "basic-calculator-add-subtract-multiply-divide",
    title: "Basic calculator (add, subtract, multiply, divide)",
    shortTitle: "Basic ops",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Add, subtract, multiply, or divide two numbers in one place.",
    longDescription:
      "Free online two-number calculator for add, subtract, multiply, or divide with one operation at a time—ideal for homework checks, lesson demos, and quick sanity checks. Not a PEMDAS parser; pair with our scientific or order-of-operations tools for full expressions.",
    keywords: ["basic calculator", "add subtract multiply divide", "two number calculator"],
    faq: [
      {
        question: "Does it follow order of operations?",
        answer:
          "No—this tool applies one operation to the two numbers you enter. For full expression order (PEMDAS), use the order-of-operations calculator.",
      },
      {
        question: "Can I chain operations?",
        answer: "Use the result as your next input manually, or use the scientific / PEMDAS calculator for one-line expressions.",
      },
      {
        question: "Why does dividing by zero show an error?",
        answer: "Division by zero is undefined in real arithmetic; we block it with a message instead of returning infinity symbols that confuse grading rubrics.",
      },
    ],
  },
  {
    slug: "percentage-calculator",
    title: "Percentage calculator",
    shortTitle: "Percent",
    category: "education",
    subCategorySlug: "mathematics",
    description: "What is P% of W, what percent A is of B, or percent change between two values.",
    longDescription:
      "Online percentage calculator with three modes: what is P% of W, A is what percent of B, and percent change from an old value to a new one. Explained formulas, validation for zero denominators, and shareable links for tutors and students.",
    keywords: ["percentage calculator", "percent of", "percent change"],
    faq: [
      {
        question: "How is percent change calculated?",
        answer: "We use ((new − old) ÷ old) × 100. If the old value is zero, change is undefined—enter a non-zero baseline.",
      },
      {
        question: "Is tax or tip included?",
        answer: "No—this is plain math only. Add fees or rounding rules yourself if needed.",
      },
      {
        question: "How is “P% of W” computed?",
        answer: "We use (P ÷ 100) × W—the standard part-of-a-whole formula taught in middle and high school.",
      },
    ],
  },
  {
    slug: "percentage-increase-decrease-calculator",
    title: "Percentage increase / decrease calculator",
    shortTitle: "% inc/dec",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Apply a percent markup or discount to a starting value.",
    longDescription:
      "Apply one-step percent markup or discount: new value = base × (1 ± percent/100). Use for sale prices, simple raises, and textbook percent-change drills—not multi-period compound growth.",
    keywords: ["percent increase", "percent decrease", "markup calculator", "discount calculator"],
    faq: [
      {
        question: "Is this compound growth?",
        answer: "No—it is a single step. For repeated compounding, use a compound-interest style tool.",
      },
      {
        question: "Can I enter negative percent?",
        answer: "You can; a negative increase acts like a decrease and vice versa—double-check the sign matches your intent.",
      },
      {
        question: "How is this different from the three-mode percentage calculator?",
        answer:
          "That page covers “percent of,” “what percent,” and old-to-new change as separate layouts. This page applies a percent increase or decrease directly to one starting value.",
      },
    ],
  },
  {
    slug: "ratio-calculator",
    title: "Ratio calculator",
    shortTitle: "Ratio",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Simplify a ratio of two whole numbers to lowest terms.",
    longDescription:
      "Simplify ratios to lowest terms using GCD (e.g. 4:6 → 2:3). Explains integer-only reduction, signs, and when to switch to the proportion solver for unknown fourth values.",
    keywords: ["ratio calculator", "simplify ratio", "equivalent ratio"],
    faq: [
      {
        question: "Why must numbers be whole?",
        answer: "Classic ratio reduction uses integer GCD. Decimal ratios can be scaled to integers first (e.g. multiply both sides by 100).",
      },
      {
        question: "What if both terms are zero?",
        answer: "That ratio is undefined; enter at least one non-zero term.",
      },
      {
        question: "Is this the same as simplifying a fraction?",
        answer: "Yes—the same GCD idea applies: divide both terms by their greatest common divisor to get an equivalent ratio in smallest whole numbers.",
      },
    ],
  },
  {
    slug: "proportion-calculator",
    title: "Proportion calculator",
    shortTitle: "Proportion",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Solve proportions with a chosen unknown (A, B, C, or X)—cross-multiply consistent ratios.",
    longDescription:
      "Solve A : B = C : X style proportions by picking which value is unknown; supports rearranged layouts so you can match textbook diagrams. Cross-multiplication with zero guards for scaling, maps, recipes, and similar figures.",
    keywords: ["proportion calculator", "solve proportion", "cross multiply"],
    faq: [
      {
        question: "Why can’t A be zero?",
        answer: "With A = 0 the proportion B/A is undefined, so X cannot be determined from the same formula.",
      },
      {
        question: "Does order of A,B,C matter?",
        answer: "Yes—enter values consistent with A : B = C : X. If your wording differs, rearrange before typing.",
      },
      {
        question: "Can I solve for a different unknown than X?",
        answer: "Yes—choose which letter is unknown and fill in the other three slots; the tool normalizes the same ratio equality behind the scenes.",
      },
    ],
  },
  {
    slug: "average-calculator",
    title: "Average calculator",
    shortTitle: "Average",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Classroom-style “average”: arithmetic mean of a list (sum ÷ count).",
    longDescription:
      "Average calculator (arithmetic mean): paste a list of numbers and get sum ÷ count with clear validation. Long-form guide compares mean vs median vs mode and links related statistics tools.",
    keywords: ["average calculator", "arithmetic mean", "mean of list"],
    faq: [
      {
        question: "Is this the same as median?",
        answer: "No—the mean uses all values; the median is the middle after sorting. Use the median calculator for that.",
      },
      {
        question: "Are outliers handled?",
        answer: "No special trimming—every entered number counts equally.",
      },
      {
        question: "Is this different from the mean calculator page?",
        answer: "No—the calculation is identical. We publish both URLs so students can open the title their assignment uses.",
      },
    ],
  },
  {
    slug: "mean-calculator",
    title: "Mean calculator",
    shortTitle: "Mean",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Statistics wording: arithmetic mean (same as sum ÷ count).",
    longDescription:
      "Mean calculator for the arithmetic mean (sum ÷ count) with list parsing, accessibility-friendly errors, and links to median, mode, and sum tools. Same math as our average calculator under a statistics-friendly name.",
    keywords: ["mean calculator", "arithmetic mean", "average"],
    faq: [
      {
        question: "Mean vs average?",
        answer: "Here they are the same: sum ÷ count. Some courses use “average” loosely for median or mode—we label this one explicitly as the mean.",
      },
      {
        question: "Can I use scientific notation?",
        answer: "Enter values JavaScript can parse, such as 1.5e3 for 1500.",
      },
      {
        question: "When should I use median instead?",
        answer: "When outliers skew the story—housing prices, exam scores with one extreme value—the median often reflects a typical case better than the mean.",
      },
    ],
  },
  {
    slug: "median-calculator",
    title: "Median calculator",
    shortTitle: "Median",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Middle value of a sorted list (average of two middles if needed).",
    longDescription:
      "Median calculator: sort a list and take the middle value (or average of two middles). Article explains skewed data, comparison to mean and mode, and even/odd count rules.",
    keywords: ["median calculator", "middle value", "statistics median"],
    faq: [
      {
        question: "How are ties handled?",
        answer: "We sort numeric values; duplicates stay in the list. The median position follows standard even/odd rules.",
      },
      {
        question: "One number only?",
        answer: "That single value is its own median.",
      },
      {
        question: "Even count of numbers—what is the median?",
        answer: "We use the mean of the two central values after sorting, which matches common textbook and spreadsheet definitions.",
      },
    ],
  },
  {
    slug: "mode-calculator",
    title: "Mode calculator",
    shortTitle: "Mode",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Most frequent value(s) in your list.",
    longDescription:
      "Find the mode (most frequent value) in a list, including multiple modes when frequencies tie. Guide covers discrete vs continuous data and when rounding affects results.",
    keywords: ["mode calculator", "most common number", "frequency"],
    faq: [
      {
        question: "Why “no mode”?",
        answer: "When each number appears exactly once, no value is more common than another.",
      },
      {
        question: "Continuous decimals?",
        answer: "Values must match exactly after parsing; tiny float differences may count as different modes.",
      },
      {
        question: "Can there be more than one mode?",
        answer: "Yes—if several values tie for the highest frequency, we list every mode (bimodal, trimodal, etc.).",
      },
    ],
  },
  {
    slug: "sum-calculator",
    title: "Sum calculator",
    shortTitle: "Sum",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Add every number in a list.",
    longDescription:
      "Sum a list of numbers online: paste comma- or space-separated values for quick totals, budgets, and quiz checks. Supports negatives and links to mean and difference tools.",
    keywords: ["sum calculator", "add list of numbers", "total"],
    faq: [
      {
        question: "Empty list?",
        answer: "Enter at least one number; otherwise we show an error.",
      },
      {
        question: "Negative numbers?",
        answer: "Allowed—they subtract from the total as expected.",
      },
      {
        question: "How do I get the average after summing?",
        answer: "Use the mean or average calculator—it divides by the count automatically after parsing your list.",
      },
    ],
  },
  {
    slug: "difference-calculator",
    title: "Difference calculator",
    shortTitle: "Difference",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Subtract one number from another (A − B).",
    longDescription:
      "Difference calculator for A − B with explicit minuend/subtrahend labels—useful for temperature deltas, account changes, and story problems. Article compares this layout to the basic calculator.",
    keywords: ["difference calculator", "subtract", "A minus B"],
    faq: [
      {
        question: "Order matters?",
        answer: "Yes—result is always first field minus second field.",
      },
      {
        question: "Can the result be negative?",
        answer: "Yes, if B is larger than A.",
      },
      {
        question: "Is this the same as “subtract” on the basic calculator?",
        answer: "Same arithmetic, but this page keeps A − B wording visible for mapping word problems to inputs.",
      },
    ],
  },
  {
    slug: "rounding-calculator",
    title: "Rounding calculator",
    shortTitle: "Rounding",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Round to decimal places: nearest, up, down, toward zero, or half-to-even (banker).",
    longDescription:
      "Rounding calculator with multiple modes: half away from zero (common school “round”), ceil, floor, truncate toward zero, and IEEE-style half-to-even (banker) for tie-breaking. Explains when each policy appears in class and software.",
    keywords: ["rounding calculator", "round decimals", "ceil floor"],
    faq: [
      {
        question: "What is banker’s rounding?",
        answer:
          "Half-to-even: when a value is exactly halfway between two representable decimals, round to the neighbor whose last digit is even. It reduces bias when you sum many rounded numbers.",
      },
      {
        question: "Very large decimals count?",
        answer: "We cap at 20 decimal places for display stability.",
      },
      {
        question: "How does “nearest” differ from banker?",
        answer:
          "Our “nearest” mode uses half away from zero at ties (e.g. 1.5 → 2, −1.5 → −2). Banker uses half to even at ties instead.",
      },
    ],
  },
  {
    slug: "scientific-calculator",
    title: "Scientific calculator",
    shortTitle: "Scientific",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Expressions with powers, pi, e, trig, log, and more.",
    longDescription:
      "Free scientific calculator for single-line numeric expressions: trig (with radians or degrees toggle), logs, powers, pi, e, sqrt, and abs. Explains unary minus vs powers, implied multiplication rules, and limits vs a CAS.",
    keywords: ["scientific calculator", "expression calculator", "sin cos tan online"],
    faq: [
      {
        question: "Degrees or radians?",
        answer:
          "You choose in the angle unit control. Radians are the default for STEM; degrees convert inside sin, cos, and tan only when that mode is selected.",
      },
      {
        question: "Is this CAS?",
        answer: "No symbolic algebra—only numeric evaluation of the grammar we support.",
      },
      {
        question: "Why does 2(3) not work?",
        answer: "Implied multiplication is not supported—use an explicit * between factors (e.g. 2*3).",
      },
    ],
  },
  {
    slug: "order-of-operations-pemdas-calculator",
    title: "Order of operations (PEMDAS) calculator",
    shortTitle: "PEMDAS",
    category: "education",
    subCategorySlug: "mathematics",
    description: "Evaluate expressions with correct operator precedence (PEMDAS / BODMAS).",
    longDescription:
      "PEMDAS / BODMAS calculator with step-by-step trace: parentheses, exponents, multiply/divide, add/subtract—same engine as the scientific calculator plus teaching-oriented reduction steps.",
    keywords: ["PEMDAS calculator", "BODMAS", "order of operations"],
    faq: [
      {
        question: "Does implied multiplication work?",
        answer: "No—use * explicitly (e.g. 2*3 instead of 2(3)).",
      },
      {
        question: "Exponent associativity?",
        answer: "Powers are right-associative: 2^3^2 = 2^(3^2) = 512.",
      },
      {
        question: "Where did the step list go?",
        answer: "Expand “Step-by-step (PEMDAS)” under the result; the scientific calculator hides steps by default.",
      },
    ],
  },
  {
    slug: "cat-age",
    title: "Cat years calculator",
    shortTitle: "Cat years",
    category: "daily",
    subCategorySlug: "home-utility",
    description:
      "Convert human years to a playful cat-age estimate (not veterinary advice).",
    longDescription:
      "Convert human years to a popular rule-of-thumb “cat years” estimate. Fun for curiosity—cats age differently in real life by breed, health, and care.",
    keywords: [
      "cat years calculator",
      "cat age in human years",
      "how old is my cat",
      "pet age joke",
    ],
    faq: [
      {
        question: "Is this scientifically accurate?",
        answer:
          "No. It applies a simplified piecewise rule often seen online. Real aging is not linear and varies by individual animal.",
      },
      {
        question: "Can I use this for medical decisions?",
        answer:
          "No. Always consult a licensed veterinarian for health and care decisions.",
      },
      {
        question: "Why does the first year count more?",
        answer:
          "The model front-loads maturity to mimic the idea that cats mature quickly in early life compared to humans.",
      },
      {
        question: "What about dogs?",
        answer:
          "Different species need different models. This page is only for the cat-years toy estimate.",
      },
    ],
  },
];

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find((c) => c.slug === slug);
}

export function getByCategory(category: CalculatorCategory): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter((c) => c.category === category);
}

export function getBySubcategory(
  category: CalculatorCategory,
  subCategorySlug: string,
): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter(
    (c) => c.category === category && c.subCategorySlug === subCategorySlug,
  );
}

export function getFeaturedSlugs(): string[] {
  return [
    "weighted-gpa",
    "loan-payment",
    "compound-interest",
    "days-between",
  ];
}
