"use client";

import { UnitConvertersCalculatorHost } from "./UnitConvertersCalculatorHost";

export function UnitConvertersCalculatorRouter({ slug }: { slug: string }) {
  return <UnitConvertersCalculatorHost slug={slug} />;
}
