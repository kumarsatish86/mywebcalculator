"use client";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { CatAgeCalculator } from "./CatAgeCalculator";
import { CompoundInterestCalculator } from "./CompoundInterestCalculator";
import { DaysBetweenCalculator } from "./DaysBetweenCalculator";
import { ExamGradeCalculator } from "./ExamGradeCalculator";
import { GradeNeededCalculator } from "./GradeNeededCalculator";
import { LoanPaymentCalculator } from "./LoanPaymentCalculator";
import { TipSplitterCalculator } from "./TipSplitterCalculator";
import { WeightedGpaCalculator } from "./WeightedGpaCalculator";

const MAP: Record<string, ComponentType> = {
  "weighted-gpa": WeightedGpaCalculator,
  "grade-needed": GradeNeededCalculator,
  "exam-grade": ExamGradeCalculator,
  "loan-payment": LoanPaymentCalculator,
  "compound-interest": CompoundInterestCalculator,
  "tip-splitter": TipSplitterCalculator,
  "days-between": DaysBetweenCalculator,
  "cat-age": CatAgeCalculator,
};

export function CalculatorRouter({ slug }: { slug: string }) {
  const C = MAP[slug];
  if (!C) notFound();
  return <C />;
}
