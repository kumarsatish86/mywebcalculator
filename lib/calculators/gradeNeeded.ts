export function gradeNeededForTarget(input: {
  currentGpa: number;
  earnedCredits: number;
  targetGpa: number;
  newCredits: number;
}): { needed: number } | { error: string } {
  const { currentGpa, earnedCredits, targetGpa, newCredits } = input;
  if (earnedCredits < 0 || newCredits <= 0) {
    return { error: "Earned credits must be ≥ 0 and new credits must be > 0." };
  }
  if (currentGpa < 0 || currentGpa > 4 || targetGpa < 0 || targetGpa > 4) {
    return { error: "GPAs must be between 0 and 4." };
  }
  const totalCredits = earnedCredits + newCredits;
  const pointsNeeded = targetGpa * totalCredits - currentGpa * earnedCredits;
  const needed = pointsNeeded / newCredits;
  return { needed };
}
