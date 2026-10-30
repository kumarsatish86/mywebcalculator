/** Life-stage nutrition teaching calculators. */
import { DIET_URL, macroSplit, mifflinBmr, parseDietSearchParams, parseSex, tdeeFromBmr } from "./dietHelpers";

export { DIET_URL as DIET_AGE_URL, parseDietSearchParams as parseDietAgeSearchParams };

function stageCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: "male" | "female",
  activity: string,
  bonus: number,
) {
  const bmr = mifflinBmr(weightKg, heightCm, age, sex);
  if (typeof bmr === "object") return bmr;
  const td = tdeeFromBmr(bmr, activity);
  if ("error" in td) return td;
  return { calories: td.tdee + bonus, tdee: td.tdee };
}

export function dietChildNutrition(p: { weightKg: number; ageYears: number }) {
  if (p.weightKg <= 0 || p.ageYears <= 0 || p.ageYears > 12) return { error: "Child age 1–12; weight > 0." };
  const calories = 1000 + p.ageYears * 100;
  return { calories, note: "Rough pediatric energy teaching estimate — use growth charts clinically." };
}

export function dietTeenNutrition(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: string;
  activity: string;
}) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  if (p.age < 13 || p.age > 19) return { error: "Teen age 13–19." };
  return stageCalories(p.weightKg, p.heightCm, p.age, sex, p.activity, 0);
}

export function dietAdultNutrition(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: string;
  activity: string;
}) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  return stageCalories(p.weightKg, p.heightCm, p.age, sex, p.activity, 0);
}

export function dietSeniorNutrition(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: string;
  activity: string;
}) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  if (p.age < 60) return { error: "Senior helper expects age ≥ 60." };
  const r = stageCalories(p.weightKg, p.heightCm, p.age, sex, p.activity, 0);
  if ("error" in r) return r;
  const m = macroSplit(r.calories, 25, 45, 30);
  if ("error" in m) return m;
  return { ...r, ...m, proteinNote: "Slightly higher protein % teaching for older adults." };
}

export function dietPregnancyNutrition(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  activity: string;
  trimester: number;
}) {
  if (p.trimester < 1 || p.trimester > 3) return { error: "Trimester 1–3." };
  const bonus = p.trimester === 1 ? 0 : p.trimester === 2 ? 340 : 450;
  return stageCalories(p.weightKg, p.heightCm, p.age, "female", p.activity, bonus);
}

export function dietBreastfeedingNutrition(p: {
  weightKg: number;
  heightCm: number;
  age: number;
  activity: string;
}) {
  return stageCalories(p.weightKg, p.heightCm, p.age, "female", p.activity, 450);
}
