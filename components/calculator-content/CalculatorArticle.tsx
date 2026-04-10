"use client";

import dynamic from "next/dynamic";
import { amortizationSchedule } from "@/lib/calculators/loanPayment";
import { GRADE_SCALE_ROWS } from "@/lib/calculators/letterGrade";
import { humanToCatYears } from "@/lib/calculators/catAge";
import { getCalculator } from "@/lib/registry";
import { ChartSkeleton } from "./ChartSkeleton";
import { DaysBetweenTimeline } from "./DaysBetweenTimeline";
import type { ReactNode } from "react";
import { SectionReveal } from "./SectionReveal";

const WeightedGpaDemoChart = dynamic(() => import("./charts/WeightedGpaDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const GradeNeededDemoChart = dynamic(() => import("./charts/GradeNeededDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const ExamWeightDemoChart = dynamic(() => import("./charts/ExamWeightDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const LoanBalanceDemoChart = dynamic(() => import("./charts/LoanBalanceDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const CompoundGrowthDemoChart = dynamic(() => import("./charts/CompoundGrowthDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const TipPieDemoChart = dynamic(() => import("./charts/TipPieDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const CatAgeDemoChart = dynamic(() => import("./charts/CatAgeDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const sectionBox =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 backdrop-blur-md sm:p-8";
const proseMuted = "mt-4 text-sm leading-relaxed text-[var(--muted)]";
const h2 = "text-xl font-semibold tracking-tight text-[var(--text)]";
const h3 = "mt-6 text-base font-semibold text-[var(--text)]";

function GradeScaleTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Letter grade</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Points (4.0 scale)</th>
          </tr>
        </thead>
        <tbody>
          {GRADE_SCALE_ROWS.map((row) => (
            <tr key={row.letter} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-2.5 text-[var(--text)]">{row.letter}</td>
              <td className="px-4 py-2.5 font-mono text-[var(--muted)]">{row.points.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoanDemoScheduleTable() {
  const rows = amortizationSchedule(25000, 6.5, 5, 12);
  if ("error" in rows) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
            <th className="px-3 py-3 font-semibold text-[var(--text)]">Mo</th>
            <th className="px-3 py-3 font-semibold text-[var(--text)]">Payment</th>
            <th className="px-3 py-3 font-semibold text-[var(--text)]">Principal</th>
            <th className="px-3 py-3 font-semibold text-[var(--text)]">Interest</th>
            <th className="px-3 py-3 font-semibold text-[var(--text)]">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} className="border-b border-[var(--border)] last:border-0">
              <td className="px-3 py-2 font-mono text-[var(--text)]">{r.month}</td>
              <td className="px-3 py-2 font-mono text-[var(--muted)]">${r.payment.toFixed(2)}</td>
              <td className="px-3 py-2 font-mono text-[var(--muted)]">${r.principal.toFixed(2)}</td>
              <td className="px-3 py-2 font-mono text-[var(--muted)]">${r.interest.toFixed(2)}</td>
              <td className="px-3 py-2 font-mono text-[var(--muted)]">${r.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 px-1 text-xs text-[var(--muted)]">
        First 12 payments, demo loan: $25,000 @ 6.5% APR, 5 years (illustrative).
      </p>
    </div>
  );
}

function CompoundFrequencyTable() {
  const rows = [
    { freq: "Annually", n: 1, note: "Interest once per year" },
    { freq: "Quarterly", n: 4, note: "Common for some savings products" },
    { freq: "Monthly", n: 12, note: "Typical for many accounts" },
    { freq: "Daily", n: 365, note: "Maximum effect for same nominal rate" },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Compounding</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Periods / year</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.freq} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-2.5 text-[var(--text)]">{r.freq}</td>
              <td className="px-4 py-2.5 font-mono text-[var(--muted)]">{r.n}</td>
              <td className="px-4 py-2.5 text-[var(--muted)]">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CatAgeTable() {
  const samples = [0, 0.5, 1, 2, 5, 10, 15];
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[260px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Human years</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Cat years (estimate)</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((h) => (
            <tr key={h} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-2.5 font-mono text-[var(--text)]">{h}</td>
              <td className="px-4 py-2.5 font-mono text-[var(--muted)]">
                {humanToCatYears(h).toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TipReferenceTable() {
  const tips = [15, 18, 20, 22];
  const bill = 100;
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Tip %</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Tip on ${bill} bill</th>
            <th className="px-4 py-3 font-semibold text-[var(--text)]">Total</th>
          </tr>
        </thead>
        <tbody>
          {tips.map((pct) => {
            const tip = bill * (pct / 100);
            return (
              <tr key={pct} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-2.5 text-[var(--text)]">{pct}%</td>
                <td className="px-4 py-2.5 font-mono text-[var(--muted)]">${tip.toFixed(2)}</td>
                <td className="px-4 py-2.5 font-mono text-[var(--muted)]">${(bill + tip).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ArticleBody({ slug }: { slug: string }) {
  switch (slug) {
    case "weighted-gpa":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>How weighted GPA works</h2>
            <p className={proseMuted}>
              Multiply each course&apos;s grade points by its credit hours. Sum those products and divide by
              total credits. A 4-credit A moves the average more than a 1-credit A—that is what makes it
              &quot;weighted&quot; by workload.
            </p>
            <h3 className={h3}>Reference: letter grades on this site</h3>
            <p className={proseMuted}>
              The calculator accepts the letters below (and plain numbers 0–4). Your registrar may use
              slightly different values.
            </p>
            <GradeScaleTable />
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Example credit mix</h2>
            <p className={proseMuted}>
              Bars show how much each demo course contributes in &quot;quality points&quot; (grade points ×
              credits) before dividing by total credits.
            </p>
            <div className="mt-6">
              <WeightedGpaDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "grade-needed":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Planning toward a target GPA</h2>
            <p className={proseMuted}>
              Your cumulative GPA is a credit-weighted average of all graded courses so far. To reach a new
              target after adding more credits, you need a specific average on those new credits—often higher
              than the target itself if you are catching up.
            </p>
            <h3 className={h3}>Tiny numeric example</h3>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full min-w-[320px] text-left text-sm">
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 text-[var(--muted)]">Credits earned</td>
                    <td className="px-4 py-2 font-mono text-[var(--text)]">60</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 text-[var(--muted)]">Current GPA</td>
                    <td className="px-4 py-2 font-mono text-[var(--text)]">3.20</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 text-[var(--muted)]">Upcoming credits</td>
                    <td className="px-4 py-2 font-mono text-[var(--text)]">15</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="px-4 py-2 text-[var(--muted)]">Target cumulative GPA</td>
                    <td className="px-4 py-2 font-mono text-[var(--text)]">3.50</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-[var(--muted)]">Needed average on new credits</td>
                    <td className="px-4 py-2 font-mono font-semibold text-[var(--accent)]">4.40 (not possible on 4.0 scale)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={`${proseMuted} mt-4`}>
              This toy row shows why the tool may report an impossible requirement: check credits remaining or
              adjust expectations.
            </p>
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Illustrative path</h2>
            <p className={proseMuted}>
              The curve below is fictional—just a visual reminder that improvement is gradual when credits
              accumulate.
            </p>
            <div className="mt-6">
              <GradeNeededDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "exam-grade":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Weighted average intuition</h2>
            <p className={proseMuted}>
              Your course grade is often a weighted average: homework, quizzes, midterms, and a final each
              take a slice of 100%. If the final is worth 30%, then 70% of your grade is already represented
              by your &quot;current average&quot; in the model we use.
            </p>
            <h3 className={h3}>Visual: 70% / 30% split (example)</h3>
            <div className="mt-4">
              <ExamWeightDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "loan-payment":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Fixed payment amortization</h2>
            <p className={proseMuted}>
              Each payment covers interest on the remaining balance plus a slice of principal. Early
              payments are interest-heavy; later ones pay principal faster. That is why refinancing or extra
              payments can change total interest dramatically.
            </p>
            <h3 className={h3}>Demo amortization schedule (first year)</h3>
            <div className="mt-4">
              <LoanDemoScheduleTable />
            </div>
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Balance falling over time</h2>
            <p className={proseMuted}>
              The line shows remaining principal for a sample loan. Your numbers above the fold update the
              chart inside the calculator card.
            </p>
            <div className="mt-6">
              <LoanBalanceDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "compound-interest":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Why compounding frequency matters</h2>
            <p className={proseMuted}>
              Interest can be credited on a schedule. The more often it compounds (while the nominal annual
              rate stays the same), the slightly faster the balance grows because you earn &quot;interest on
              interest&quot; sooner.
            </p>
            <CompoundFrequencyTable />
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Demo growth curve</h2>
            <p className={proseMuted}>
              Area chart uses a lump-sum demo. Adjust the calculator to explore your own principal, rate,
              and horizon—the in-card chart reflects your inputs.
            </p>
            <div className="mt-6">
              <CompoundGrowthDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "tip-splitter":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Splitting fairly</h2>
            <p className={proseMuted}>
              We divide the bill plus tip evenly across the headcount you enter. If some guests ordered more,
              you may need to split items manually or use separate checks.
            </p>
            <h3 className={h3}>Quick reference (on a $100 subtotal)</h3>
            <div className="mt-4">
              <TipReferenceTable />
            </div>
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Bill vs tip (demo)</h2>
            <div className="mt-6">
              <TipPieDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    case "days-between":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Counting calendar days</h2>
            <p className={proseMuted}>
              Pick two dates; we measure the difference in whole calendar days and show weeks and approximate
              months. Legal or business deadlines may count differently—always confirm critical dates with an
              official calendar rule.
            </p>
            <DaysBetweenTimeline />
          </SectionReveal>
        </>
      );
    case "cat-age":
      return (
        <>
          <SectionReveal className={sectionBox}>
            <h2 className={h2}>Rule-of-thumb cat years</h2>
            <p className={proseMuted}>
              This is a playful mapping, not biology. Real cats age at different speeds based on genetics,
              diet, indoor/outdoor life, and veterinary care.
            </p>
            <h3 className={h3}>Sample conversions</h3>
            <div className="mt-4">
              <CatAgeTable />
            </div>
          </SectionReveal>
          <SectionReveal className={`${sectionBox} mt-8`}>
            <h2 className={h2}>Stepped curve (illustrative)</h2>
            <div className="mt-6">
              <CatAgeDemoChart />
            </div>
          </SectionReveal>
        </>
      );
    default:
      return null;
  }
}

export function CalculatorArticle({ slug, children }: { slug: string; children?: ReactNode }) {
  const def = getCalculator(slug);
  if (!def) return null;

  return (
    <article className="mt-14 w-full max-w-full space-y-10 pb-8">
      <ArticleBody slug={slug} />
      {children ? <SectionReveal>{children}</SectionReveal> : null}
      {/*
        Future live chat widget mount (Crisp, Intercom, etc.):
        document.querySelector('#chat-widget-root') or provider snippet in layout.
      */}
      <div id="chat-widget-root" className="min-h-0" aria-hidden />
    </article>
  );
}
