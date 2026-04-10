export type GpaRow = { credits: number; gradePoints: number };

export function computeWeightedGpa(rows: GpaRow[]): { gpa: number } | { error: string } {
  const valid = rows.filter((r) => r.credits > 0);
  if (valid.length === 0) return { error: "Add at least one course with credits." };
  let weighted = 0;
  let credits = 0;
  for (const r of valid) {
    if (r.gradePoints < 0 || r.gradePoints > 4) return { error: "Grade points must be 0–4." };
    weighted += r.gradePoints * r.credits;
    credits += r.credits;
  }
  if (credits <= 0) return { error: "Total credits must be positive." };
  return { gpa: weighted / credits };
}
