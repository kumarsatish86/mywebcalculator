import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoanCalcPrefsProvider } from "@/components/calculators/LoanCalcPrefsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/calculators/loan-emi-calculator",
}));

vi.mock("@/lib/analytics/mwcTrack", () => ({
  mwcTrack: vi.fn(),
}));

function renderWithPrefs(ui: ReactElement) {
  return render(<LoanCalcPrefsProvider>{ui}</LoanCalcPrefsProvider>);
}

describe("LoanToolBar", () => {
  const clipboardWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    clipboardWriteText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: clipboardWriteText },
      configurable: true,
    });
  });

  it("copies share link with merged field params and prefs", () => {
    renderWithPrefs(
      <LoanToolBar
        analyticsId="test-tool"
        getShareSearchParams={() => ({ p: "100000", a: "8.5", t: "10" })}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /copy share link/i }));

    expect(clipboardWriteText).toHaveBeenCalledTimes(1);
    const url = clipboardWriteText.mock.calls[0][0] as string;
    const u = new URL(url);
    expect(u.pathname).toBe("/calculators/loan-emi-calculator");
    expect(u.searchParams.get("p")).toBe("100000");
    expect(u.searchParams.get("a")).toBe("8.5");
    expect(u.searchParams.get("t")).toBe("10");
    expect(u.searchParams.get("cur")).toBe("INR");
    expect(u.searchParams.get("tm")).toBe("years");
    expect(u.searchParams.get("br")).toBe("0");
  });

  it("invokes onPrintSchedule when Print page is clicked", () => {
    const onPrintSchedule = vi.fn();
    renderWithPrefs(
      <LoanToolBar analyticsId="test-tool" onPrintSchedule={onPrintSchedule} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /print page/i }));
    expect(onPrintSchedule).toHaveBeenCalledTimes(1);
  });

  it("invokes onReset when Reset inputs is clicked", () => {
    const onReset = vi.fn();
    renderWithPrefs(<LoanToolBar analyticsId="test-tool" onReset={onReset} />);

    fireEvent.click(screen.getByRole("button", { name: /reset inputs/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
