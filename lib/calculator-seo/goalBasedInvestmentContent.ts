import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/goal-based-investment-calculators";
const HUB_LABEL = "Finance · Goal-Based Investment Calculators";
const SHELL =
  "Runs in your browser. Goal-planning SIP math with editable inflation and return assumptions—not investment advice.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Goal planning steps",
        columnHeaders: ["Step", "Action"],
        rows: [
          ["1", "Estimate today's goal cost"],
          ["2", "Inflate to the target year"],
          ["3", "Compute SIP to fill the shortfall"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Save toward the goal",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.25, 0.45, 0.6, 0.8, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const GOAL_BASED_INVESTMENT_ARTICLES: Record<string, RichArticle> = {
  "child-education-planning-calculator": article(
    "child-education-planning-calculator",
    "Child education corpus and SIP",
    [
      "Future education cost = today's cost × (1 + education inflation)^years.",
      "Required SIP fills the gap after growing any amount already saved for this goal.",
    ],
    {
      question: "What inflation should I use for education?",
      answer: "Education costs in India often rise faster than CPI—many planners use 7–10%. Adjust to your city and institution type.",
    },
    "Child Education Planning Calculator",
    "Estimate future education cost and the monthly SIP needed to fund it.",
    ["child education planning calculator", "education SIP calculator", "college fund calculator"],
  ),
  "child-marriage-planning-calculator": article(
    "child-marriage-planning-calculator",
    "Wedding goal planning",
    [
      "Inflates today's estimated wedding budget to the target year, then solves for monthly SIP.",
      "Separate earmarked savings are grown at your expected return before computing the shortfall.",
    ],
    {
      question: "Should gifts and gold be included?",
      answer: "Yes if you expect to fund them—build a realistic all-in budget, then inflate and plan the SIP.",
    },
    "Child Marriage Planning Calculator",
    "Plan wedding costs with inflation and the SIP required to reach the goal.",
    ["marriage planning calculator", "wedding SIP calculator", "child marriage corpus"],
  ),
  "wealth-goal-calculator": article(
    "wealth-goal-calculator",
    "Target wealth SIP",
    [
      "Treats the target as a future corpus (no extra inflation on the number itself).",
      "Computes the monthly SIP needed after existing savings grow at the assumed return.",
    ],
    {
      question: "How is this different from goal SIP?",
      answer: "Same math engine—this framing is for a net-worth target; Goal SIP is a generic future-amount input.",
    },
    "Wealth Goal Calculator",
    "Find the monthly SIP to reach a target wealth amount in a given number of years.",
    ["wealth goal calculator", "net worth goal SIP", "target corpus calculator"],
  ),
  "dream-home-investment-planner": article(
    "dream-home-investment-planner",
    "Home down-payment planner",
    [
      "Inflates full home price, then plans for a down-payment percentage (default 20%).",
      "SIP is sized to the future down payment, not the entire property cost.",
    ],
    {
      question: "What about the loan portion?",
      answer: "Use an EMI calculator for the financed balance once you know the down payment and home price at purchase.",
    },
    "Dream Home Investment Planner",
    "Plan property inflation, down payment, and the SIP needed for your dream home.",
    ["dream home planner", "home down payment SIP", "house goal calculator"],
  ),
  "car-purchase-planning-calculator": article(
    "car-purchase-planning-calculator",
    "Car purchase SIP",
    [
      "Inflates today's car price over your waiting period and computes the required monthly SIP.",
      "Shorter horizons often pair with more conservative return assumptions.",
    ],
    {
      question: "Should I include insurance and RTO?",
      answer: "For an on-road budget, add those costs into the 'car cost today' field before planning.",
    },
    "Car Purchase Planning Calculator",
    "Estimate future car cost and the monthly savings/SIP needed.",
    ["car purchase calculator", "car SIP planner", "vehicle savings calculator"],
  ),
  "vacation-planning-calculator": article(
    "vacation-planning-calculator",
    "Vacation savings plan",
    [
      "Inflates today's trip budget and solves for monthly SIP over the planning horizon.",
      "Useful for international trips where currency and ticket inflation matter.",
    ],
    {
      question: "Can I use this for multiple trips?",
      answer: "Sum the trip budgets into one goal, or plan separate SIPs with different tenures.",
    },
    "Vacation Planning Calculator",
    "Plan vacation costs with inflation and required monthly SIP.",
    ["vacation planning calculator", "holiday SIP calculator", "travel savings goal"],
  ),
  "financial-freedom-calculator": article(
    "financial-freedom-calculator",
    "Financial freedom number",
    [
      "Freedom number = annual expenses ÷ safe withdrawal rate (e.g. 4%).",
      "Then computes the SIP to reach that corpus in your chosen years.",
    ],
    {
      question: "Is this the same as FIRE?",
      answer: "Yes in spirit—financial independence when investment income can cover expenses. Stress-test withdrawal rates.",
    },
    "Financial Freedom Calculator",
    "Calculate your financial freedom number and the SIP path to reach it.",
    ["financial freedom calculator", "FI number calculator", "independence SIP"],
  ),
  "goal-sip-calculator": article(
    "goal-sip-calculator",
    "Goal-based SIP",
    [
      "Solves monthly SIP = remaining target ÷ SIP future-value annuity factor.",
      "Existing corpus is grown to the goal date before the SIP shortfall is calculated.",
    ],
    {
      question: "What if my SIP comes out as zero?",
      answer: "Your existing savings already cover the goal under the assumed return—or the target is already surpassed.",
    },
    "Goal SIP Calculator",
    "Calculate the monthly SIP needed to reach any future financial goal.",
    ["goal SIP calculator", "target SIP calculator", "SIP for goal amount"],
  ),
};
