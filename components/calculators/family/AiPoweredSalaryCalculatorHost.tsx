"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { HealthScoreBadge, InsightPanel } from "@/components/calculators/ai-finance/AiFinanceUi";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parsePositive } from "@/lib/calculators/loanInputParse";
import type { AiSalaryCurrencyCode, LocationTier } from "@/lib/calculators/aiPoweredSalary";
import {
  AI_SALARY_URL,
  LOCATION_TIERS,
  aiCareerGrowthPredict,
  aiIncomePlan,
  aiOfferAnalyze,
  aiSalaryEstimate,
  aiSalaryNegotiation,
  formatAiSalaryMoney,
} from "@/lib/calculators/aiPoweredSalary";

type AiSalarySlug =
  | "ai-salary-estimator"
  | "ai-offer-analyzer"
  | "ai-salary-negotiation-tool"
  | "ai-career-growth-predictor"
  | "ai-income-planner";

type AiSalaryMode = "estimate" | "offer" | "negotiate" | "growth" | "incomePlan";

type Config = {
  title: string;
  description: string;
  mode: AiSalaryMode;
  amountLabel: string;
  amountDefault: string;
  showMarket?: boolean;
  showBonus?: boolean;
  showExperience?: boolean;
  showLocation?: boolean;
  showSkills?: boolean;
  showWalkAway?: boolean;
  showGrowth?: boolean;
  showSideIncome?: boolean;
  showHorizon?: boolean;
  secondaryLabel?: string;
  secondaryDefault?: string;
};

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM; educational use only.";

const CONFIG: Record<AiSalarySlug, Config> = {
  "ai-salary-estimator": {
    title: "AI salary estimator",
    description: "Estimate annual salary from role market data, experience, location tier, and skills score.",
    mode: "estimate",
    amountLabel: "Base market salary (annual)",
    amountDefault: "1000000",
    showExperience: true,
    showLocation: true,
    showSkills: true,
  },
  "ai-offer-analyzer": {
    title: "AI offer analyzer",
    description: "Score whether a job offer is competitive vs market median including bonus and benefits value.",
    mode: "offer",
    amountLabel: "Offer base (annual)",
    amountDefault: "1200000",
    showMarket: true,
    showBonus: true,
    secondaryLabel: "Market median (annual)",
    secondaryDefault: "1000000",
  },
  "ai-salary-negotiation-tool": {
    title: "AI salary negotiation tool",
    description: "Get a recommended counter-offer range and negotiation insights based on market and walk-away floor.",
    mode: "negotiate",
    amountLabel: "Current offer (annual)",
    amountDefault: "900000",
    showMarket: true,
    showWalkAway: true,
    secondaryLabel: "Market median (annual)",
    secondaryDefault: "1100000",
  },
  "ai-career-growth-predictor": {
    title: "AI career growth predictor",
    description: "Project salary growth over time with annual raises and periodic promotion bumps.",
    mode: "growth",
    amountLabel: "Current annual salary",
    amountDefault: "800000",
    showGrowth: true,
    secondaryLabel: "Years to project",
    secondaryDefault: "5",
  },
  "ai-income-planner": {
    title: "AI income planner",
    description: "Plan path to a target income using raises, side income, and a planning horizon.",
    mode: "incomePlan",
    amountLabel: "Current annual income",
    amountDefault: "600000",
    showHorizon: true,
    showGrowth: true,
    showSideIncome: true,
    secondaryLabel: "Target annual income",
    secondaryDefault: "1200000",
  },
};

const CURRENCIES: AiSalaryCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function AiPoweredSalaryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiSalarySlug] ?? CONFIG["ai-salary-estimator"];
  const [currency, setCurrency] = useState<AiSalaryCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(AI_SALARY_URL.A, config.amountDefault));
  const [secondary, setSecondary] = useState(
    useLoanInitialInput(AI_SALARY_URL.B, config.secondaryDefault ?? "1000000"),
  );
  const [yearsExp, setYearsExp] = useState(useLoanInitialInput(AI_SALARY_URL.Y, "5"));
  const [skillsScore, setSkillsScore] = useState(useLoanInitialInput(AI_SALARY_URL.S, "7"));
  const [locationTier, setLocationTier] = useState<LocationTier>(
    (useLoanInitialInput(AI_SALARY_URL.L, "metro") as LocationTier) || "metro",
  );
  const [bonusPct, setBonusPct] = useState(useLoanInitialInput(AI_SALARY_URL.P, "10"));
  const [benefitsPct, setBenefitsPct] = useState(useLoanInitialInput(AI_SALARY_URL.E, "12"));
  const [walkAway, setWalkAway] = useState(useLoanInitialInput(AI_SALARY_URL.W, "950000"));
  const [raisePct, setRaisePct] = useState(useLoanInitialInput(AI_SALARY_URL.R, "10"));
  const [horizonYears, setHorizonYears] = useState(useLoanInitialInput(AI_SALARY_URL.H, "10"));
  const [sideIncome, setSideIncome] = useState(useLoanInitialInput(AI_SALARY_URL.M, "0"));
  const [projectYears, setProjectYears] = useState(useLoanInitialInput(AI_SALARY_URL.T, "5"));

  const fmt = useCallback((n: number) => formatAiSalaryMoney(n, currency), [currency]);

  const shareParams = useCallback(
    () => ({
      [AI_SALARY_URL.A]: amount,
      [AI_SALARY_URL.B]: secondary,
      [AI_SALARY_URL.Y]: yearsExp,
      [AI_SALARY_URL.S]: skillsScore,
      [AI_SALARY_URL.L]: locationTier,
      [AI_SALARY_URL.P]: bonusPct,
      [AI_SALARY_URL.E]: benefitsPct,
      [AI_SALARY_URL.W]: walkAway,
      [AI_SALARY_URL.R]: raisePct,
      [AI_SALARY_URL.H]: horizonYears,
      [AI_SALARY_URL.M]: sideIncome,
      [AI_SALARY_URL.T]: projectYears,
    }),
    [amount, secondary, yearsExp, skillsScore, locationTier, bonusPct, benefitsPct, walkAway, raisePct, horizonYears, sideIncome, projectYears],
  );

  useLoanUrlSync(shareParams, [
    amount,
    secondary,
    yearsExp,
    skillsScore,
    locationTier,
    bonusPct,
    benefitsPct,
    walkAway,
    raisePct,
    horizonYears,
    sideIncome,
    projectYears,
  ]);

  const result = useMemo(() => {
    const amountParsed = parsePositive(amount, config.amountLabel);
    if (!amountParsed.ok) return { error: amountParsed.error };

    switch (config.mode) {
      case "estimate": {
        const exp = parsePositive(yearsExp, "Years of experience");
        const skills = parsePositive(skillsScore, "Skills score");
        if (!exp.ok) return { error: exp.error };
        if (!skills.ok) return { error: skills.error };
        const computed = aiSalaryEstimate({
          baseMarketAnnual: amountParsed.value,
          yearsExperience: exp.value,
          locationTier,
          skillsScore: skills.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.estimatedAnnual),
          primaryLabel: "Estimated annual salary",
          score: computed.confidenceScore,
          grade: computed.grade,
          scoreLabel: "Estimate confidence",
          insights: computed.insights,
          rows: [
            { label: "Range low", value: fmt(computed.rangeLow) },
            { label: "Range high", value: fmt(computed.rangeHigh) },
            { label: "Experience factor", value: `×${computed.experienceMultiplier.toFixed(2)}` },
            { label: "Location factor", value: `×${computed.locationMultiplier.toFixed(2)}` },
            { label: "Skills factor", value: `×${computed.skillsMultiplier.toFixed(2)}` },
          ],
        };
      }
      case "offer": {
        const market = parsePositive(secondary, config.secondaryLabel ?? "Market median");
        const bonus = parseAprPercent(bonusPct, "Bonus %");
        const benefits = parseAprPercent(benefitsPct, "Benefits value %");
        if (!market.ok) return { error: market.error };
        if (!bonus.ok) return { error: bonus.error };
        if (!benefits.ok) return { error: benefits.error };
        const computed = aiOfferAnalyze({
          offerAnnual: amountParsed.value,
          marketMedianAnnual: market.value,
          bonusPercent: bonus.value,
          benefitsPercent: benefits.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${Math.round(computed.offerScore)}`,
          primaryLabel: computed.grade,
          score: computed.offerScore,
          grade: computed.grade,
          scoreLabel: "Offer score",
          insights: computed.insights,
          rows: [
            { label: "Total comp (annual)", value: fmt(computed.totalCompAnnual) },
            { label: "Market median", value: fmt(computed.marketMedianAnnual) },
            { label: "Vs market", value: `${computed.vsMarketPercent >= 0 ? "+" : ""}${computed.vsMarketPercent.toFixed(1)}%` },
            { label: "Verdict", value: computed.verdict },
          ],
        };
      }
      case "negotiate": {
        const market = parsePositive(secondary, config.secondaryLabel ?? "Market median");
        const floor = parsePositive(walkAway, "Walk-away minimum");
        if (!market.ok) return { error: market.error };
        if (!floor.ok) return { error: floor.error };
        const computed = aiSalaryNegotiation({
          currentOfferAnnual: amountParsed.value,
          marketMedianAnnual: market.value,
          walkAwayAnnual: floor.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.recommendedAskAnnual),
          primaryLabel: "Recommended ask (annual)",
          score: computed.negotiationScore,
          grade: computed.grade,
          scoreLabel: "Negotiation readiness",
          insights: computed.insights,
          rows: [
            { label: "Current offer", value: fmt(amountParsed.value) },
            { label: "Market median", value: fmt(market.value) },
            { label: "Gap to market", value: fmt(computed.gapToMarket) },
            { label: "Likely counter low", value: fmt(computed.likelyCounterLow) },
            { label: "Likely counter high", value: fmt(computed.likelyCounterHigh) },
          ],
        };
      }
      case "growth": {
        const years = parsePositive(projectYears, "Years to project");
        const raise = parseAprPercent(raisePct, "Annual raise %");
        if (!years.ok) return { error: years.error };
        if (!raise.ok) return { error: raise.error };
        const computed = aiCareerGrowthPredict({
          currentAnnual: amountParsed.value,
          annualRaisePercent: raise.value,
          yearsToProject: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        const last = computed.projections[computed.projections.length - 1];
        return {
          primary: fmt(computed.endingSalary),
          primaryLabel: `Salary in year ${last?.year ?? years.value}`,
          score: computed.growthScore,
          grade: computed.grade,
          scoreLabel: "Growth outlook",
          insights: computed.insights,
          rows: [
            { label: "Current salary", value: fmt(amountParsed.value) },
            { label: "Ending salary", value: fmt(computed.endingSalary) },
            { label: "Total earnings (period)", value: fmt(computed.totalEarnings) },
            ...computed.projections.slice(-3).map((p) => ({
              label: `Year ${p.year}`,
              value: fmt(p.salary),
            })),
          ],
        };
      }
      case "incomePlan": {
        const target = parsePositive(secondary, config.secondaryLabel ?? "Target income");
        const horizon = parsePositive(horizonYears, "Planning horizon (years)");
        const raise = parseAprPercent(raisePct, "Annual raise %");
        const side = parsePositive(sideIncome, "Side income (monthly)");
        if (!target.ok) return { error: target.error };
        if (!horizon.ok) return { error: horizon.error };
        if (!raise.ok) return { error: raise.error };
        if (!side.ok) return { error: side.error };
        const computed = aiIncomePlan({
          currentAnnual: amountParsed.value,
          targetAnnual: target.value,
          yearsHorizon: horizon.value,
          annualRaisePercent: raise.value,
          sideIncomeMonthly: side.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.yearsToTarget !== null ? `~${computed.yearsToTarget} yrs` : "30+ yrs",
          primaryLabel: "Years to target income",
          score: computed.planScore,
          grade: computed.grade,
          scoreLabel: "Plan feasibility",
          insights: computed.insights,
          rows: [
            { label: "Target income", value: fmt(target.value) },
            { label: "Projected at horizon", value: fmt(computed.projectedAnnualAtHorizon) },
            { label: "Gap at horizon", value: fmt(computed.gapAtHorizon) },
            { label: "Monthly gap today", value: fmt(computed.monthlyGapToday) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    amount,
    benefitsPct,
    bonusPct,
    config,
    fmt,
    horizonYears,
    locationTier,
    projectYears,
    raisePct,
    secondary,
    sideIncome,
    skillsScore,
    walkAway,
    yearsExp,
  ]);

  return (
    <CalculatorShell
      title={config.title}
      description={config.description}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.primary}</p>
            </div>
            {"score" in result && result.score !== undefined ? (
              <HealthScoreBadge score={result.score} grade={result.grade} scoreLabel={result.scoreLabel} />
            ) : null}
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              {result.rows.map((row) => (
                <Row key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
            {"insights" in result && result.insights ? <InsightPanel insights={result.insights} /> : null}
            <p className="text-xs text-[var(--muted)]">{AI_NOTE}</p>
          </div>
        )
      }
    >
      <div className="mb-4">
        <FieldLabel htmlFor="currency">Currency</FieldLabel>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as AiSalaryCurrencyCode)}
          className={`${selectCls} sm:max-w-xs`}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" />
        </div>

        {config.showMarket || config.mode === "incomePlan" || config.mode === "negotiate" || config.mode === "offer" ? (
          <div>
            <FieldLabel htmlFor="secondary">{config.secondaryLabel}</FieldLabel>
            <FieldInput id="secondary" inputMode="decimal" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showExperience ? (
          <div>
            <FieldLabel htmlFor="yearsExp">Years of experience</FieldLabel>
            <FieldInput id="yearsExp" inputMode="decimal" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showSkills ? (
          <div>
            <FieldLabel htmlFor="skills">Skills score (1–10)</FieldLabel>
            <FieldInput id="skills" inputMode="decimal" value={skillsScore} onChange={(e) => setSkillsScore(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showLocation ? (
          <div>
            <FieldLabel htmlFor="location">Location tier</FieldLabel>
            <select
              id="location"
              value={locationTier}
              onChange={(e) => setLocationTier(e.target.value as LocationTier)}
              className={selectCls}
            >
              {LOCATION_TIERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {config.showBonus ? (
          <>
            <div>
              <FieldLabel htmlFor="bonus">Variable / bonus %</FieldLabel>
              <FieldInput id="bonus" inputMode="decimal" value={bonusPct} onChange={(e) => setBonusPct(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="benefits">Benefits value % of base</FieldLabel>
              <FieldInput id="benefits" inputMode="decimal" value={benefitsPct} onChange={(e) => setBenefitsPct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showWalkAway ? (
          <div>
            <FieldLabel htmlFor="walkAway">Walk-away minimum (annual)</FieldLabel>
            <FieldInput id="walkAway" inputMode="decimal" value={walkAway} onChange={(e) => setWalkAway(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showGrowth && config.mode === "growth" ? (
          <>
            <div>
              <FieldLabel htmlFor="projectYears">Years to project</FieldLabel>
              <FieldInput id="projectYears" inputMode="decimal" value={projectYears} onChange={(e) => setProjectYears(e.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="raise">Annual raise %</FieldLabel>
              <FieldInput id="raise" inputMode="decimal" value={raisePct} onChange={(e) => setRaisePct(e.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.showHorizon ? (
          <div>
            <FieldLabel htmlFor="horizon">Planning horizon (years)</FieldLabel>
            <FieldInput id="horizon" inputMode="decimal" value={horizonYears} onChange={(e) => setHorizonYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showGrowth && config.mode === "incomePlan" ? (
          <div>
            <FieldLabel htmlFor="raisePlan">Expected annual raise %</FieldLabel>
            <FieldInput id="raisePlan" inputMode="decimal" value={raisePct} onChange={(e) => setRaisePct(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showSideIncome ? (
          <div>
            <FieldLabel htmlFor="side">Side income (monthly)</FieldLabel>
            <FieldInput id="side" inputMode="decimal" value={sideIncome} onChange={(e) => setSideIncome(e.target.value)} className="mt-2" />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
