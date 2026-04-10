export function tipSplit(input: {
  bill: number;
  tipPercent: number;
  people: number;
}): { tipAmount: number; total: number; perPerson: number } | { error: string } {
  const { bill, tipPercent, people } = input;
  if (bill < 0) return { error: "Bill cannot be negative." };
  if (people < 1 || !Number.isInteger(people)) {
    return { error: "People must be a whole number ≥ 1." };
  }
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  return { tipAmount, total, perPerson: total / people };
}
