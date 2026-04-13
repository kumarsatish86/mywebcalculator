import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BasicMathInitialProvider } from "@/components/calculators/BasicMathInitialContext";
import { withIntl } from "@/test/withIntl";
import {
  BasicCalculatorAddSubtractMultiplyDivide,
  OrderOfOperationsPemdasCalculator,
  PercentageCalculator,
  ProportionCalculator,
  RatioCalculator,
  ScientificCalculator,
  SumCalculator,
} from "@/components/calculators/BasicMathCalculators";
import * as basicMathShareState from "@/lib/calculators/basicMathShareState";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/calculators/percentage-calculator",
  useRouter: () => ({ replace }),
}));

vi.mock("@/lib/analytics/mwcTrack", () => ({
  mwcTrack: vi.fn(),
}));

function renderMath(slug: string, ui: ReactElement) {
  return render(withIntl(<BasicMathInitialProvider slug={slug}>{ui}</BasicMathInitialProvider>));
}

describe("BasicMathCalculators", () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it("Percentage: switching mode to is-what shows correct percent", () => {
    renderMath("percentage-calculator", <PercentageCalculator />);

    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: "isWhat" } });

    expect(screen.getByLabelText(/part \(a\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whole \(b\)/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/part \(a\)/i), { target: { value: "12" } });
    fireEvent.change(screen.getByLabelText(/whole \(b\)/i), { target: { value: "48" } });

    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("Ratio: simplifies 4:6 to 2:3", () => {
    renderMath("ratio-calculator", <RatioCalculator />);

    fireEvent.change(screen.getByLabelText(/first term/i), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText(/second term/i), { target: { value: "6" } });

    expect(screen.getByText("2:3")).toBeInTheDocument();
  });

  it("Scientific: invalid expression shows an error", () => {
    renderMath("scientific-calculator", <ScientificCalculator />);

    const expr = document.getElementById("scientific-calculator-expr") as HTMLInputElement;
    expect(expr).toBeTruthy();
    fireEvent.change(expr, { target: { value: "1+" } });

    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("PEMDAS: default expression shows result and step list", () => {
    renderMath("order-of-operations-pemdas-calculator", <OrderOfOperationsPemdasCalculator />);

    expect(screen.getByText("14")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Step-by-step (PEMDAS)"));

    expect(screen.getByRole("list").querySelectorAll("li").length).toBeGreaterThan(0);
  });

  it("Basic calculator: default add shows 15", () => {
    renderMath("basic-calculator-add-subtract-multiply-divide", <BasicCalculatorAddSubtractMultiplyDivide />);
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("Proportion: solves for X with defaults", () => {
    renderMath("proportion-calculator", <ProportionCalculator />);
    expect(document.body.textContent).toMatch(/X\s*=\s*20/);
  });

  it("Scientific: optional step-by-step shows steps when checked", async () => {
    renderMath("scientific-calculator", <ScientificCalculator />);
    fireEvent.click(screen.getByRole("checkbox", { name: /show step-by-step/i }));
    fireEvent.click(screen.getByText("Step-by-step (PEMDAS)"));
    expect(screen.getByRole("list").querySelectorAll("li").length).toBeGreaterThan(0);
  });

  it("Sum: copy share link shows omitted message when ms encoding fails", async () => {
    const spy = vi.spyOn(basicMathShareState, "encodeBasicMathShareState").mockReturnValue(null);
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: clipboardWriteText },
      configurable: true,
    });

    renderMath("sum-calculator", <SumCalculator />);

    fireEvent.click(screen.getByRole("button", { name: /copy share link/i }));

    expect(await screen.findByText(/without saved inputs/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
