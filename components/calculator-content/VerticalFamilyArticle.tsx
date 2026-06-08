"use client";

import Link from "next/link";
import { FAMILY_SLUG_SETS, getCalculator } from "@/lib/registry";
import { SectionReveal } from "./SectionReveal";

const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 backdrop-blur-md sm:p-8";
const h2 = "text-xl font-semibold tracking-tight text-[var(--text)]";
const prose = "mt-4 text-sm leading-relaxed text-[var(--muted)]";

export function RelatedInFamily({ slug, family }: { slug: string; family: "electrical" | "health" | "math" | "loan" }) {
  const set =
    family === "electrical"
      ? FAMILY_SLUG_SETS.electrical
      : family === "health"
        ? FAMILY_SLUG_SETS.healthBody
        : family === "math"
          ? FAMILY_SLUG_SETS.educationMathPlanned
          : FAMILY_SLUG_SETS.financeLoanType;
  const links = Array.from(set)
    .filter((s) => s !== slug)
    .slice(0, 12);
  if (!links.length) return null;
  return (
    <SectionReveal className={`${box} mt-8`}>
      <h2 className={h2}>More tools in this rollout</h2>
      <p className={prose}>Open related calculators in the same family for side-by-side checks.</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
        {links.map((s) => {
          const d = getCalculator(s);
          return (
            <li key={s}>
              <Link href={`/calculators/${s}`} className="font-medium text-[var(--accent)] hover:underline">
                {d?.title ?? s}
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionReveal>
  );
}

export function VerticalFamilyArticle({
  slug,
  vertical,
}: {
  slug: string;
  vertical: "engineering-electrical" | "health-body" | "education-math" | "finance-loan";
}) {
  const def = getCalculator(slug);
  const family =
    vertical === "engineering-electrical"
      ? "electrical"
      : vertical === "health-body"
        ? "health"
        : vertical === "education-math"
          ? "math"
          : "loan";

  return (
    <>
      <SectionReveal className={box}>
        <h2 className={h2}>How to use this page</h2>
        <p className={prose}>
          {vertical === "engineering-electrical" &&
            "Fill the fields that match your textbook problem, then press Calculate. SI-style units are used unless noted (V, A, Ω, W, kWh, Hz)."}
          {vertical === "health-body" &&
            "Enter metric measurements when possible. Results are rounded teaching estimates—never a substitute for clinical assessment."}
          {vertical === "education-math" &&
            "Many tools share the a/b/c/x fields—match the labels to your assignment. Lists accept commas or spaces."}
          {vertical === "finance-loan" &&
            "This product page uses the same reducing-balance EMI engine as our universal EMI calculator—adjust principal, APR, term, and optional prepayment in the live card above."}
        </p>
      </SectionReveal>

      <SectionReveal className={`${box} mt-8`}>
        <h2 className={h2}>Reference table (illustrative)</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
                <th className="px-4 py-3 font-semibold text-[var(--text)]">Topic</th>
                <th className="px-4 py-3 font-semibold text-[var(--text)]">Reminder</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2 text-[var(--text)]">Title</td>
                <td className="px-4 py-2 text-[var(--muted)]">{def?.title ?? slug}</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="px-4 py-2 text-[var(--text)]">Slug</td>
                <td className="px-4 py-2 font-mono text-[var(--muted)]">{slug}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-[var(--text)]">Privacy</td>
                <td className="px-4 py-2 text-[var(--muted)]">Runs in your browser on mywebcalculator.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionReveal>

      <RelatedInFamily slug={slug} family={family} />

      <SectionReveal className={`${box} mt-8`}>
        <h2 className={h2}>Internal links for crawlers and students</h2>
        <p className={prose}>
          Browse the hub sections for structured discovery:{" "}
          {vertical === "engineering-electrical" && (
            <Link className="font-medium text-[var(--accent)] hover:underline" href="/engineering/electrical">
              Engineering · Electrical
            </Link>
          )}
          {vertical === "health-body" && (
            <Link className="font-medium text-[var(--accent)] hover:underline" href="/health/body-metrics">
              Health · Body metrics
            </Link>
          )}
          {vertical === "education-math" && (
            <Link className="font-medium text-[var(--accent)] hover:underline" href="/education/mathematics">
              Education · Mathematics
            </Link>
          )}
          {vertical === "finance-loan" && (
            <Link className="font-medium text-[var(--accent)] hover:underline" href="/finance/loans-emi/loan-type-calculators">
              Finance · Loan types
            </Link>
          )}
          .
        </p>
      </SectionReveal>
    </>
  );
}
