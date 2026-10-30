"use client";

import { computeAigenFinance, type AigenFinanceSlug } from "@/lib/calculators/aigenFinance";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenFinanceSlug, AigenHostConfig<AigenFinanceSlug>> = {
  "aigen-budget-planner-generator": {
    title: "Budget Planner Generator",
    description: `50/30/20-style budget draft from monthly budget. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Plan label", def: "household" },
      { key: "M", label: "Monthly budget (₹)", def: "50000" },
      { key: "T", label: "Goal focus", def: "build emergency fund" },
    ],
    build: (v) => ({ topic: v.a, budget: Number(v.m) || 50000, goal: v.t }),
  },
  "aigen-expense-breakdown-generator": {
    title: "Expense Breakdown Generator",
    description: `Category split from income and expenses. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "monthly" },
      { key: "M", label: "Income (₹)", def: "60000" },
      { key: "P", label: "Expenses (₹)", def: "42000" },
    ],
    build: (v) => ({ topic: v.a, amount: Number(v.m) || 0, amount2: Number(v.p) || 0 }),
  },
  "aigen-savings-plan-generator": {
    title: "Savings Plan Generator",
    description: `Timeline sketch from target and monthly save. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "T", label: "Goal", def: "vacation fund" },
      { key: "M", label: "Monthly save (₹)", def: "10000" },
      { key: "P", label: "Target (₹)", def: "200000" },
    ],
    build: (v) => ({ goal: v.t, amount: Number(v.m) || 0, amount2: Number(v.p) || 0 }),
  },
  "aigen-loan-repayment-plan-generator": {
    title: "Loan Repayment Plan Generator",
    description: `Illustrative EMI repayment plan. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Loan label", def: "personal loan" },
      { key: "M", label: "Principal (₹)", def: "500000" },
      { key: "R", label: "Rate % p.a.", def: "12" },
      { key: "D", label: "Tenure (months)", def: "36" },
    ],
    build: (v) => ({
      topic: v.a,
      amount: Number(v.m) || 0,
      rate: Number(v.r) || 0,
      days: Number(v.d) || 36,
    }),
  },
  "aigen-debt-payoff-strategy-generator": {
    title: "Debt Payoff Strategy Generator",
    description: `Avalanche/snowball strategy draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Debt context", def: "cards + loan" },
      { key: "M", label: "Total debt (₹)", def: "300000" },
      { key: "P", label: "Extra monthly (₹)", def: "5000" },
    ],
    build: (v) => ({ topic: v.a, amount: Number(v.m) || 0, amount2: Number(v.p) || 0 }),
  },
  "aigen-investment-portfolio-generator": {
    title: "Investment Portfolio Generator",
    description: `Age-biased portfolio sketch. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Investor label", def: "long-term" },
      { key: "N", label: "Age / horizon proxy", def: "35" },
      { key: "T", label: "Goal", def: "wealth building" },
    ],
    build: (v) => ({ topic: v.a, count: Number(v.n) || 35, goal: v.t }),
  },
  "aigen-retirement-plan-generator": {
    title: "Retirement Plan Generator",
    description: `Simple retirement corpus teaching draft. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Plan label", def: "retirement" },
      { key: "D", label: "Years to retire", def: "25" },
      { key: "M", label: "Monthly invest (₹)", def: "15000" },
      { key: "T", label: "Goal note", def: "replace 70% expenses" },
    ],
    build: (v) => ({
      topic: v.a,
      days: Number(v.d) || 25,
      amount: Number(v.m) || 0,
      goal: v.t,
    }),
  },
  "aigen-emi-breakdown-generator": {
    title: "EMI Breakdown Generator",
    description: `EMI with month-1 interest/principal split. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Loan label", def: "home loan slice" },
      { key: "M", label: "Principal (₹)", def: "1000000" },
      { key: "R", label: "Rate % p.a.", def: "8.5" },
      { key: "D", label: "Tenure (months)", def: "240" },
    ],
    build: (v) => ({
      topic: v.a,
      amount: Number(v.m) || 0,
      rate: Number(v.r) || 0,
      days: Number(v.d) || 240,
    }),
  },
  "aigen-passive-income-plan-generator": {
    title: "Passive Income Plan Generator",
    description: `Corpus sketch for target passive income. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Plan label", def: "passive streams" },
      { key: "M", label: "Target monthly (₹)", def: "20000" },
      { key: "R", label: "Assumed yield %", def: "6" },
      { key: "T", label: "Goal", def: "diversify income" },
    ],
    build: (v) => ({
      topic: v.a,
      amount: Number(v.m) || 0,
      rate: Number(v.r) || 6,
      goal: v.t,
    }),
  },
};

export const AigenFinanceCalculatorHost = createAigenSectionHost({
  name: "AigenFinanceCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-budget-planner-generator",
  compute: computeAigenFinance,
  idPrefix: "aigen-finance",
});
