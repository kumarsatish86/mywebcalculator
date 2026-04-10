/** currentAvg and desired are 0–100; examWeight is share of grade (e.g. 30 for 30%). */
export function examScoreNeeded(input: {
  currentAvgPercent: number;
  examWeightPercent: number;
  desiredPercent: number;
}): { neededPercent: number } | { error: string } {
  const { currentAvgPercent, examWeightPercent, desiredPercent } = input;
  if (examWeightPercent <= 0 || examWeightPercent > 100) {
    return { error: "Exam weight should be between 0 and 100%." };
  }
  const w = examWeightPercent / 100;
  const needed = (desiredPercent - currentAvgPercent * (1 - w)) / w;
  return { neededPercent: needed };
}
