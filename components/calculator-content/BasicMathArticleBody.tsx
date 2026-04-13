"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

const sectionBox =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 backdrop-blur-md sm:p-8";
const proseMuted = "mt-4 text-sm leading-relaxed text-[var(--muted)]";
const h2 = "text-xl font-semibold tracking-tight text-[var(--text)]";
const h3 = "mt-6 text-base font-semibold text-[var(--text)]";
const link =
  "font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] hover:underline";

function CalcLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <Link href={`/calculators/${slug}`} className={link}>
      {children}
    </Link>
  );
}

function BasicCalculatorArticle() {
  const t = useTranslations("Article.basic");
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>{t("h2_when")}</h2>
        <p className={proseMuted}>{t("p1")}</p>
        <p className={proseMuted}>
          {t("p2_prefix")}{" "}
          <span className="font-medium text-[var(--text)]">{t("p2_not")}</span> {t("p2_mid")}{" "}
          <span className="font-mono text-[var(--text)]">3 + 4 × 5</span>
          {t("p2_afterExpr")}{" "}
          <CalcLink slug="order-of-operations-pemdas-calculator">{t("link_pemdas")}</CalcLink> {t("p2_or")}{" "}
          <CalcLink slug="scientific-calculator">{t("link_sci")}</CalcLink>
          {t("p2_end")}
        </p>
        <h3 className={h3}>{t("h3_div")}</h3>
        <p className={proseMuted}>
          {t("p3_prefix")} <CalcLink slug="difference-calculator">{t("link_diff")}</CalcLink> {t("p3_end")}
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>{t("h2_acc")}</h2>
        <p className={proseMuted}>
          {t("p4_prefix")} <CalcLink slug="rounding-calculator">{t("link_rnd")}</CalcLink>
          {t("p4_end")}
        </p>
        <p className={proseMuted}>{t("p5")}</p>
      </SectionReveal>
    </>
  );
}

function PercentageCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Three percentage questions, one page</h2>
        <p className={proseMuted}>
          Percent problems show up everywhere: discounts, test scores, survey results, and data literacy lessons.
          This calculator groups the three most common question types so you do not have to remember which
          formula is which—switch the mode and the labels update to match.
        </p>
        <h3 className={h3}>Mode: What is P% of W?</h3>
        <p className={proseMuted}>
          This is the classic “find a part of a whole.” We compute{" "}
          <span className="font-mono text-[var(--text)]">(P ÷ 100) × W</span>. Example: 15% of 80 is 12. Use it
          for tips, tax estimates (before real jurisdictional rules), or any “take a percent of a number” task.
        </p>
        <h3 className={h3}>Mode: A is what percent of B?</h3>
        <p className={proseMuted}>
          Here the whole is <span className="font-mono text-[var(--text)]">B</span> and the part is{" "}
          <span className="font-mono text-[var(--text)]">A</span>. The tool reports{" "}
          <span className="font-mono text-[var(--text)]">(A ÷ B) × 100</span>. If B is zero, the question is
          undefined—we surface an error instead of a misleading infinity symbol.
        </p>
        <h3 className={h3}>Mode: Percent change from old to new</h3>
        <p className={proseMuted}>
          Relative change uses the old value as the baseline:{" "}
          <span className="font-mono text-[var(--text)]">((new − old) ÷ old) × 100</span>. A positive answer is an
          increase; negative is a decrease. For a one-step markup or discount applied to a price (without
          nesting several changes), the{" "}
          <CalcLink slug="percentage-increase-decrease-calculator">percentage increase / decrease calculator</CalcLink>{" "}
          is often quicker.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>How this fits with ratios and proportions</h2>
        <p className={proseMuted}>
          Percentages are ratios scaled to 100. If your problem is stated as a proportion (e.g. maps, similar
          figures, or scaling recipes), the{" "}
          <CalcLink slug="proportion-calculator">proportion calculator</CalcLink> and{" "}
          <CalcLink slug="ratio-calculator">ratio calculator</CalcLink> may match the wording of your textbook
          more closely than a percent-only view.
        </p>
      </SectionReveal>
    </>
  );
}

function PercentageIncDecArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Markup, discount, and one-step percent change</h2>
        <p className={proseMuted}>
          This tool answers: “Start with a value; increase or decrease it by a given percent—what is the new
          value?” We multiply the base by <span className="font-mono text-[var(--text)]">(1 + p/100)</span> for
          an increase or <span className="font-mono text-[var(--text)]">(1 − p/100)</span> for a decrease (with
          the obvious sign convention if you type a negative percent).
        </p>
        <p className={proseMuted}>
          That is a <span className="font-medium text-[var(--text)]">single</span> multiplicative step—not
          compound interest over many periods. If you need repeated growth or decay, browse the finance hub for
          compound-style tools; for “what percent is A of B?” use the{" "}
          <CalcLink slug="percentage-calculator">percentage calculator</CalcLink> instead.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Reading results for prices and grades</h2>
        <p className={proseMuted}>
          Retailers sometimes stack discounts in a specific order; this calculator does not know your store
          policy. For coursework, show your steps: identify the base amount, the percent, and whether the
          problem asks for the new value or only the amount of change (subtract base from result if needed).
        </p>
      </SectionReveal>
    </>
  );
}

function RatioCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Equivalent ratios and lowest terms</h2>
        <p className={proseMuted}>
          A ratio compares two quantities. Reducing <span className="font-mono text-[var(--text)]">4 : 6</span> to{" "}
          <span className="font-mono text-[var(--text)]">2 : 3</span> uses the greatest common divisor (GCD): we
          divide both terms by the largest integer that divides evenly into each. That is the same idea as
          simplifying a fraction.
        </p>
        <p className={proseMuted}>
          For classic integer ratios, both entries should be whole numbers (or values so close to integers that
          rounding noise does not matter). If you enter decimals, we may ask you to scale to integers first—for
          example, multiply both sides by 10 or 100—because GCD-based simplification is defined on integers.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Signs and zero</h2>
        <p className={proseMuted}>
          Negative terms can appear in real data; the simplified ratio keeps a consistent sign convention in
          the displayed pair. If both terms are zero, the ratio is undefined—we block that case with an
          explanation.
        </p>
        <p className={proseMuted}>
          When your problem is really “if A relates to B as C relates to what?,” move to the{" "}
          <CalcLink slug="proportion-calculator">proportion calculator</CalcLink>, which solves for an unknown in a
          four-value layout.
        </p>
      </SectionReveal>
    </>
  );
}

function ProportionCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Proportions and cross multiplication</h2>
        <p className={proseMuted}>
          A proportion states that two ratios are equal. In the usual textbook layout{" "}
          <span className="font-mono text-[var(--text)]">A : B = C : X</span>, once three values are known you can
          solve for the missing one. Algebraically, many courses derive{" "}
          <span className="font-mono text-[var(--text)]">X = B×C÷A</span> (when A is not zero)—the familiar cross
          product pattern.
        </p>
        <p className={proseMuted}>
          This page generalizes that idea: you choose which letter is unknown and fill in the other three slots.
          That covers rearranged wordings (e.g. unknown on the left or in the inner positions) without forcing
          you to memorize a single formula shape. The live calculator includes a small diagram matching{" "}
          <span className="font-mono text-[var(--text)]">A : B = C : X</span> to the input grid.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Real-world examples</h2>
        <p className={proseMuted}>
          Proportions appear in recipe scaling, map distances, similar triangles, and unit costs. Always line up
          corresponding quantities: the same units should sit in parallel roles in the two ratios. If a problem
          gives you percents, you may prefer the{" "}
          <CalcLink slug="percentage-calculator">percentage calculator</CalcLink> after rewriting the story as a
          part-to-whole sentence.
        </p>
      </SectionReveal>
    </>
  );
}

function MeanFamilyArticle({ variant }: { variant: "average" | "mean" }) {
  const t = useTranslations("Article.mean");
  return (
    <>
      <SectionReveal className={sectionBox}>
        {variant === "average" ? (
          <>
            <h2 className={h2}>{t("avg_h2")}</h2>
            <p className={proseMuted}>{t("avg_p1")}</p>
            <p className={proseMuted}>
              {t("avg_p2_prefix")} <CalcLink slug="mean-calculator">{t("link_mean")}</CalcLink>
              {t("avg_p2_end")}
            </p>
          </>
        ) : (
          <>
            <h2 className={h2}>{t("stat_h2")}</h2>
            <p className={proseMuted}>{t("stat_p1")}</p>
            <p className={proseMuted}>
              {t("stat_p2_prefix")} <CalcLink slug="average-calculator">{t("link_avg")}</CalcLink>
              {t("stat_p2_end")}
            </p>
          </>
        )}
        <h3 className={h3}>{t("formula_h3")}</h3>
        <p className={proseMuted}>{t("formula_p")}</p>
        <h3 className={h3}>{t("outlier_h3")}</h3>
        <p className={proseMuted}>
          {t("outlier_p_prefix")} <CalcLink slug="median-calculator">{t("link_median")}</CalcLink>{" "}
          {t("outlier_p_mid")} <CalcLink slug="mode-calculator">{t("link_mode")}</CalcLink>
          {t("outlier_p_end")}
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>{t("lists_h2")}</h2>
        <p className={proseMuted}>{t("lists_p")}</p>
      </SectionReveal>
    </>
  );
}

function MedianCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Median: the middle of an ordered list</h2>
        <p className={proseMuted}>
          To find the median, sort the numbers from smallest to largest. If there is an odd count, the median is
          the middle entry. If there is an even count, the median is usually defined as the average of the two
          central values—that is what we implement here, matching common textbook and spreadsheet behavior.
        </p>
        <p className={proseMuted}>
          Unlike the mean, the median ignores the magnitude of extreme values except for ranking. That makes it a
          strong choice for skewed data (income distributions, response times) when you want a typical value
          without letting outliers dominate.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Relationship to mean and mode</h2>
        <p className={proseMuted}>
          In symmetric, unimodal distributions, mean, median, and mode often line up closely. In real messy data
          they diverge—reporting all three (plus spread) is better practice than picking one at random. Pair this
          page with the <CalcLink slug="mean-calculator">mean</CalcLink>,{" "}
          <CalcLink slug="mode-calculator">mode</CalcLink>, and{" "}
          <CalcLink slug="sum-calculator">sum</CalcLink> calculators when an assignment asks for a full summary.
        </p>
      </SectionReveal>
    </>
  );
}

function ModeCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Mode as “most frequent”</h2>
        <p className={proseMuted}>
          The mode is the value that appears most often in your list. If several values tie for the highest
          frequency, we list every mode (bimodal, trimodal, etc.). If every value appears exactly once, there is
          no mode—again matching standard introductory statistics language.
        </p>
        <p className={proseMuted}>
          Modes are easiest to interpret for categorical or discrete data (favorite color, shoe sizes). With
          continuous measurements, floating-point equality matters: tiny rounding differences can split what
          should be “the same” measurement into separate modes unless you round or bin first.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Classroom tips</h2>
        <p className={proseMuted}>
          When a problem asks for “the average,” read carefully: some instructors still use that word for the
          median. If the rubric says “mean,” use the mean tool; if it says “most common,” use this mode tool.
        </p>
      </SectionReveal>
    </>
  );
}

function SumCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Totaling a list quickly</h2>
        <p className={proseMuted}>
          Summation is the building block for means, variances, invoices, and budgeting. Paste a column-like list
          from a document; we add every finite number and show the total. Negative entries subtract as expected,
          so you can mix debits and credits in one list for a rough balance check.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>From sum to mean</h2>
        <p className={proseMuted}>
          If you also need the count-based average, use the <CalcLink slug="mean-calculator">mean calculator</CalcLink>{" "}
          directly—it divides by the number of entries for you. The{" "}
          <CalcLink slug="difference-calculator">difference calculator</CalcLink> helps when you want the gap
          between two aggregates you computed separately.
        </p>
      </SectionReveal>
    </>
  );
}

function DifferenceCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>A − B with explicit order</h2>
        <p className={proseMuted}>
          Subtraction is not commutative: the first field is the minuend and the second is the subtrahend. We
          always compute <span className="font-mono text-[var(--text)]">A − B</span>. If B is larger, the result is
          negative—useful for temperatures, elevations, account deltas, and “how much more / less” word problems.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Compared with the basic calculator</h2>
        <p className={proseMuted}>
          The <CalcLink slug="basic-calculator-add-subtract-multiply-divide">basic calculator</CalcLink> can also
          subtract two numbers, but this page keeps the “first minus second” story visible in the labels—helpful
          when students map story problem roles onto inputs. For more operations in one place, use the basic or
          scientific tools.
        </p>
      </SectionReveal>
    </>
  );
}

function RoundingCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Rounding modes you might see in school and software</h2>
        <p className={proseMuted}>
          Rounding is never “just chop digits”—the rule at the tie case (exactly halfway between two candidates)
          varies by field. We expose several modes so you can match a policy: half away from zero (common school
          “round”), ceil, floor, truncate toward zero, and half to even (“banker” / IEEE-style ties).
        </p>
        <p className={proseMuted}>
          Banker’s rounding reduces bias when you sum many rounded values; half away from zero is easier to
          teach by hand. If your syllabus names a specific rule, pick the matching mode and cite it in your work.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Decimal places and stability</h2>
        <p className={proseMuted}>
          We cap precision at a generous maximum to keep the UI responsive. Very large or tiny intermediate
          values still inherit floating-point limitations—if you need exact decimal arithmetic for money,
          consider a dedicated accounting tool after you understand the concept here.
        </p>
      </SectionReveal>
    </>
  );
}

function ScientificCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>Numeric expressions, not algebra</h2>
        <p className={proseMuted}>
          Type a single line using <span className="font-mono text-[var(--text)]">+ − * / ^</span>, parentheses,
          constants <span className="font-mono text-[var(--text)]">pi</span> and{" "}
          <span className="font-mono text-[var(--text)]">e</span>, and functions such as{" "}
          <span className="font-mono text-[var(--text)]">sqrt</span>,{" "}
          <span className="font-mono text-[var(--text)]">sin</span>, <span className="font-mono text-[var(--text)]">cos</span>,{" "}
          <span className="font-mono text-[var(--text)]">tan</span>, <span className="font-mono text-[var(--text)]">log</span>{" "}
          (base 10), <span className="font-mono text-[var(--text)]">ln</span>, and{" "}
          <span className="font-mono text-[var(--text)]">abs</span>. There is no symbolic solver—you cannot type{" "}
          <span className="font-mono text-[var(--text)]">solve x</span> and get a formula.
        </p>
        <p className={proseMuted}>
          Multiplication must be explicit: use <span className="font-mono text-[var(--text)]">*</span> rather
          than implied multiplication like <span className="font-mono text-[var(--text)]">2(3)</span>.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Angles: radians vs degrees</h2>
        <p className={proseMuted}>
          Choose the angle unit that matches your problem. In radians (default STEM setting),{" "}
          <span className="font-mono text-[var(--text)]">sin(0)=0</span> and{" "}
          <span className="font-mono text-[var(--text)]">sin(pi/2)=1</span>. In degrees, trig functions convert
          your argument internally so <span className="font-mono text-[var(--text)]">sin(90)</span> is 1. Always
          state which mode you used when you hand in work.
        </p>
        <h3 className={h3}>Unary minus and powers</h3>
        <p className={proseMuted}>
          Exponentiation binds before unary minus: <span className="font-mono text-[var(--text)]">-2^2</span> is{" "}
          <span className="font-mono text-[var(--text)]">−4</span>, not 4. Powers are right-associative:{" "}
          <span className="font-mono text-[var(--text)]">2^3^2</span> means{" "}
          <span className="font-mono text-[var(--text)]">2^(3^2)</span>. For step-by-step reductions matching
          precedence, open the{" "}
          <CalcLink slug="order-of-operations-pemdas-calculator">PEMDAS calculator</CalcLink>.
        </p>
      </SectionReveal>
    </>
  );
}

function PemdasCalculatorArticle() {
  return (
    <>
      <SectionReveal className={sectionBox}>
        <h2 className={h2}>PEMDAS, BODMAS, and what this tool shows</h2>
        <p className={proseMuted}>
          Students learn a standard order: parentheses (brackets), exponents (orders), multiplication and
          division, then addition and subtraction—with multiplication/division on one tier and addition/subtraction
          on another. This calculator evaluates your expression with that structure and can list intermediate
          steps so you can compare against pencil work.
        </p>
        <p className={proseMuted}>
          The step list is a teaching aid: it reflects the same numeric rules as the scientific calculator, but
          surfaces how sub-expressions collapse to single numbers as you go.
        </p>
      </SectionReveal>
      <SectionReveal className={`${sectionBox} mt-8`}>
        <h2 className={h2}>Common pitfalls</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
          <li>
            <span className="font-medium text-[var(--text)]">Implied multiplication</span> is not supported—write{" "}
            <span className="font-mono">2*3</span>, not <span className="font-mono">2(3)</span>.
          </li>
          <li>
            <span className="font-medium text-[var(--text)]">Right-associative powers:</span>{" "}
            <span className="font-mono">2^3^2 = 512</span>, not 64.
          </li>
          <li>
            <span className="font-medium text-[var(--text)]">Trig mode:</span> pick radians or degrees in the
            control; mismatching the unit is a frequent exam error.
          </li>
        </ul>
        <p className={`${proseMuted} mt-4`}>
          For quick answers without the teaching trace, use the{" "}
          <CalcLink slug="scientific-calculator">scientific calculator</CalcLink> on the same engine.
        </p>
      </SectionReveal>
    </>
  );
}

export function BasicMathArticleBody({ slug }: { slug: string }) {
  switch (slug) {
    case "basic-calculator-add-subtract-multiply-divide":
      return <BasicCalculatorArticle />;
    case "percentage-calculator":
      return <PercentageCalculatorArticle />;
    case "percentage-increase-decrease-calculator":
      return <PercentageIncDecArticle />;
    case "ratio-calculator":
      return <RatioCalculatorArticle />;
    case "proportion-calculator":
      return <ProportionCalculatorArticle />;
    case "average-calculator":
      return <MeanFamilyArticle variant="average" />;
    case "mean-calculator":
      return <MeanFamilyArticle variant="mean" />;
    case "median-calculator":
      return <MedianCalculatorArticle />;
    case "mode-calculator":
      return <ModeCalculatorArticle />;
    case "sum-calculator":
      return <SumCalculatorArticle />;
    case "difference-calculator":
      return <DifferenceCalculatorArticle />;
    case "rounding-calculator":
      return <RoundingCalculatorArticle />;
    case "scientific-calculator":
      return <ScientificCalculatorArticle />;
    case "order-of-operations-pemdas-calculator":
      return <PemdasCalculatorArticle />;
    default:
      return null;
  }
}
