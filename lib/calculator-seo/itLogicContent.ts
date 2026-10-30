import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-programming-logic";
const HUB_LABEL = "Engineering · IT/Dev · Programming and logic calculators";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

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
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Programming and logic tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Time complexity", "Big-O from loop structure"],
          ["Algorithm complexity", "Compare growth classes"],
          ["Loop iterations", "Count nested loop trips"],
          ["Recursion depth", "Stack depth and base case"],
          ["Execution time", "Ops × cost per op estimate"],
          ["Big-O calculator", "Classify asymptotic growth"],
          ["Logic gates", "AND, OR, NOT, NAND, XOR outputs"],
          ["Boolean algebra", "Simplify expressions"],
          ["Truth table", "All input combinations → output"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your logic inputs. Educational IT aid only — profile real code for production performance decisions.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_LOGIC_ARTICLES: Record<string, RichArticle> = {
  "it-time-complexity-calculator": article(
    "it-time-complexity-calculator",
    "Time complexity calculator",
    [
      "Infers asymptotic time class from described loop nests and input size n for algorithm literacy.",
      "Hidden constants, cache effects, and parallel hardware dominate real runtime — Big-O is a first-order model.",
    ],
    {
      question: "Is O(n log n) always faster than O(n²)?",
      answer:
        "For large n, usually yes. Small n or large constants can invert ordering — measure with benchmarks on your data sizes.",
    },
    "Time Complexity Calculator — Big-O from Loop Structure",
    "Estimate algorithm time complexity from loop patterns. Educational CS tool — benchmark before optimizing production code.",
    ["time complexity calculator", "big o from loops", "algorithm complexity estimate"],
  ),
  "it-algorithm-complexity-estimator": article(
    "it-algorithm-complexity-estimator",
    "Algorithm complexity estimator",
    [
      "Compares described steps against common complexity classes (O(1), O(log n), O(n), O(n log n), O(n²)).",
      "Space complexity and amortized analysis are separate topics — this focuses on time growth intuition.",
    ],
    {
      question: "What is amortized complexity?",
      answer:
        "Some structures (dynamic arrays) have costly rare ops but cheap average ops — amortized O(1) append is a classic example.",
    },
    "Algorithm Complexity Estimator — Growth Class Comparison",
    "Classify algorithm steps into common Big-O categories. Educational aid — use profilers for real bottlenecks.",
    ["algorithm complexity estimator", "big o comparison", "asymptotic growth calculator"],
  ),
  "it-loop-iteration-calculator": article(
    "it-loop-iteration-calculator",
    "Loop iteration calculator",
    [
      "Counts total iterations for nested loops with given bounds — useful when estimating work inside hot paths.",
      "Non-constant bounds, early breaks, and skipped iterations change totals — model the actual control flow.",
    ],
    {
      question: "Why count iterations instead of Big-O?",
      answer:
        "Iteration counts give concrete scale for fixed input sizes; Big-O describes growth as n → ∞. Both views help optimization.",
    },
    "Loop Iteration Calculator — Nested Loop Trip Counts",
    "Calculate total loop iterations from bound expressions. Developer education tool — trace real branches in code.",
    ["loop iteration calculator", "nested loop count", "how many loop iterations"],
  ),
  "it-recursion-depth-calculator": article(
    "it-recursion-depth-calculator",
    "Recursion depth calculator",
    [
      "Estimates maximum call stack depth from recurrence and base case for teaching stack overflow risks.",
      "Tail-call optimization and iterative rewrites eliminate depth in some languages — check your compiler/runtime.",
    ],
    {
      question: "What causes stack overflow in recursion?",
      answer:
        "Each call consumes stack frames; depth exceeds platform limit without a proper base case or tail optimization.",
    },
    "Recursion Depth Calculator — Stack Depth Estimate",
    "Estimate recursive call depth from recurrence relations. Educational CS aid — prefer iteration for deep trees in prod.",
    ["recursion depth calculator", "stack overflow estimate", "recursive call depth"],
  ),
  "it-code-execution-time-estimator": article(
    "it-code-execution-time-estimator",
    "Code execution time estimator",
    [
      "Rough runtime from operation count multiplied by assumed per-op cost — a teaching bridge between theory and profiling.",
      "I/O, GC pauses, and lock contention dominate many apps — CPU op counts miss those entirely.",
    ],
    {
      question: "Should I trust estimated milliseconds?",
      answer:
        "No for SLAs. Use estimates for order-of-magnitude literacy, then profile with your language's tools on representative hardware.",
    },
    "Code Execution Time Estimator — Ops × Cost Model",
    "Rough execution time from operation counts and assumptions. Educational tool — profile production workloads.",
    ["code execution time estimator", "runtime estimate calculator", "operation count timing"],
  ),
  "it-big-o-calculator": article(
    "it-big-o-calculator",
    "Big-O calculator",
    [
      "Maps common algorithm patterns (binary search, merge sort, nested loops) to standard complexity notation.",
      "Best, average, and worst cases differ — quicksort average O(n log n) vs worst O(n²) is a classic distinction.",
    ],
    {
      question: "Does Big-O ignore constants?",
      answer:
        "Yes. O(2n) and O(n) are the same class. Constants matter in practice — that is why profiling complements Big-O analysis.",
    },
    "Big-O Calculator — Classify Algorithm Growth",
    "Identify Big-O complexity for common algorithm patterns. Educational CS tool — analyze worst case for critical paths.",
    ["big o calculator", "algorithm big o notation", "complexity class finder"],
  ),
  "it-logic-gate-calculator": article(
    "it-logic-gate-calculator",
    "Logic gate calculator",
    [
      "Evaluates AND, OR, NOT, NAND, NOR, and XOR gates on binary inputs for digital logic and CS foundations.",
      "Real circuits add propagation delay, fan-out, and voltage levels — this is Boolean output literacy only.",
    ],
    {
      question: "What is the difference between NAND and AND?",
      answer:
        "NAND inverts AND output. NAND is universal — any Boolean function can be built from NAND gates alone.",
    },
    "Logic Gate Calculator — AND, OR, NOT, XOR Outputs",
    "Evaluate digital logic gates on binary inputs. Educational tool — bridge to hardware and boolean code.",
    ["logic gate calculator", "and or xor truth", "digital logic gates"],
  ),
  "it-boolean-algebra-calculator": article(
    "it-boolean-algebra-calculator",
    "Boolean algebra calculator",
    [
      "Applies identities and simplification rules to Boolean expressions used in conditions, masks, and hardware design.",
      "Short-circuit evaluation in languages may skip subexpressions — algebraic simplification assumes pure Boolean math.",
    ],
    {
      question: "Why simplify Boolean expressions?",
      answer:
        "Fewer terms mean less CPU work in hot conditions and clearer predicates in code reviews and circuit layouts.",
    },
    "Boolean Algebra Calculator — Simplify Logic Expressions",
    "Simplify Boolean expressions with standard identities. Educational CS aid — verify against your language semantics.",
    ["boolean algebra calculator", "simplify logic expression", "boolean simplification"],
  ),
  "it-truth-table-generator": article(
    "it-truth-table-generator",
    "Truth table generator",
    [
      "Lists all input combinations and resulting output for a Boolean function — essential for verifying logic designs.",
      "Variable count grows 2^n — large tables explode quickly; use algebraic methods for many inputs.",
    ],
    {
      question: "How many rows for n variables?",
      answer:
        "2^n rows — three variables yield 8 rows, ten variables yield 1024. Plan accordingly for manual verification.",
    },
    "Truth Table Generator — All Input Combinations",
    "Generate truth tables for Boolean functions and gates. Educational tool — use for small n verification.",
    ["truth table generator", "boolean truth table", "logic function table"],
  ),
};
