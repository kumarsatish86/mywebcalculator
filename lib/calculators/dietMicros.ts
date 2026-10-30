/** Micronutrient diet calculators. */
import { DIET_URL, parseDietSearchParams, parseSex } from "./dietHelpers";

export { DIET_URL as DIET_MICRO_URL, parseDietSearchParams as parseDietMicroSearchParams };

export function dietVitaminIntake(p: { intakeMg: number; rdaMg: number; name?: string }) {
  if (p.intakeMg < 0 || p.rdaMg <= 0) return { error: "Intake ≥ 0; RDA > 0." };
  return { percentRda: (p.intakeMg / p.rdaMg) * 100, name: p.name ?? "vitamin" };
}

export function dietMineralIntake(p: { intakeMg: number; rdaMg: number }) {
  return dietVitaminIntake(p);
}

export function dietIronIntake(p: { intakeMg: number; sex: string }) {
  const sex = parseSex(p.sex);
  if (typeof sex === "object") return sex;
  if (p.intakeMg < 0) return { error: "Intake cannot be negative." };
  const rda = sex === "female" ? 18 : 8;
  return { intakeMg: p.intakeMg, rdaMg: rda, percentRda: (p.intakeMg / rda) * 100 };
}

export function dietCalciumIntake(p: { intakeMg: number; age: number }) {
  if (p.intakeMg < 0 || p.age <= 0) return { error: "Intake ≥ 0; age > 0." };
  const rda = p.age >= 50 ? 1200 : 1000;
  return { intakeMg: p.intakeMg, rdaMg: rda, percentRda: (p.intakeMg / rda) * 100 };
}

export function dietVitaminD(p: { age: number; iuPerDay?: number }) {
  if (p.age <= 0) return { error: "Age must be positive." };
  const rdaIu = p.age >= 70 ? 800 : 600;
  const intake = p.iuPerDay ?? rdaIu;
  return { recommendedIu: rdaIu, intakeIu: intake, percentRda: (intake / rdaIu) * 100 };
}

export function dietElectrolyteBalance(p: { sodiumMg: number; potassiumMg: number }) {
  if (p.sodiumMg < 0 || p.potassiumMg < 0) return { error: "Values cannot be negative." };
  const ratio = p.potassiumMg === 0 ? Infinity : p.sodiumMg / p.potassiumMg;
  const band = ratio < 1 ? "Favorable Na:K teaching band" : "Higher Na:K — consider more potassium foods";
  return { naKRatio: ratio, band };
}
