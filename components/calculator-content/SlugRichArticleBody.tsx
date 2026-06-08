"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { RichArticle } from "@/lib/calculator-seo/types";
import { SectionReveal } from "./SectionReveal";
import { RelatedInFamily } from "./VerticalFamilyArticle";
import { ChartSkeleton } from "./ChartSkeleton";

const LoanBalanceDemoChart = dynamic(() => import("./charts/LoanBalanceDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const SparkTrendDemoChart = dynamic(() => import("./charts/SparkTrendDemoChart"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const box = "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 backdrop-blur-md sm:p-8";
const h2 = "text-xl font-semibold tracking-tight text-[var(--text)]";
const prose = "mt-4 text-sm leading-relaxed text-[var(--muted)]";

function familyKey(vertical: RichArticle["vertical"]): "electrical" | "health" | "math" | "loan" {
  if (vertical === "engineering-electrical") return "electrical";
  if (vertical === "health-body") return "health";
  if (vertical === "education-math") return "math";
  return "loan";
}

export function SlugRichArticleBody({ article }: { article: RichArticle }) {
  const fam = familyKey(article.vertical);

  return (
    <>
      {article.shellNote ? (
        <SectionReveal className={box}>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--accent-bright)]">Quick note</p>
          <p className={`${prose} mt-2`}>{article.shellNote}</p>
        </SectionReveal>
      ) : null}

      {article.sections.map((sec) => (
        <SectionReveal key={sec.heading} className={`${box} mt-8`}>
          <h2 className={h2}>{sec.heading}</h2>
          {sec.paragraphs.map((p, pi) => (
            <p key={pi} className={prose}>
              {p}
            </p>
          ))}
        </SectionReveal>
      ))}

      {article.tables.map((tbl) => (
        <SectionReveal key={tbl.title} className={`${box} mt-8`}>
          <h2 className={h2}>{tbl.title}</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]/60">
                  {tbl.columnHeaders.map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-[var(--text)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tbl.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[var(--border)] last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 text-[var(--muted)]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>
      ))}

      {article.chart.kind !== "none" ? (
        <SectionReveal className={`${box} mt-8`}>
          <h2 className={h2}>{article.chart.title}</h2>
          <p className={prose}>{article.chart.caption}</p>
          <div className="mt-6">
            {article.chart.kind === "loanBalanceDemo" ? <LoanBalanceDemoChart /> : null}
            {article.chart.kind === "sparkTrendDemo" && article.chart.sparkValues?.length ? (
              <SparkTrendDemoChart values={article.chart.sparkValues} />
            ) : null}
          </div>
        </SectionReveal>
      ) : null}

      <RelatedInFamily slug={article.slug} family={fam} />

      <SectionReveal className={`${box} mt-8`}>
        <h2 className={h2}>Hub navigation</h2>
        <p className={prose}>
          Structured discovery:{" "}
          <Link href={article.hubHref} className="font-medium text-[var(--accent)] hover:underline">
            {article.hubLabel}
          </Link>
          .
        </p>
      </SectionReveal>
    </>
  );
}
