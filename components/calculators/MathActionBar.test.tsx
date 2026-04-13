import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MathActionBar } from "@/components/calculators/MathActionBar";
import { withIntl } from "@/test/withIntl";

vi.mock("next/navigation", () => ({
  usePathname: () => "/calculators/sum-calculator",
}));

vi.mock("@/lib/analytics/mwcTrack", () => ({
  mwcTrack: vi.fn(),
}));

describe("MathActionBar", () => {
  const clipboardWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    clipboardWriteText.mockClear();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: clipboardWriteText },
      configurable: true,
    });
  });

  it("shows omitted-payload message when sharePayloadOmitted is true", async () => {
    render(
      withIntl(
        <MathActionBar
          analyticsId="test-math"
          getShareSearchParams={() => ({ params: {}, sharePayloadOmitted: true })}
        />,
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: /copy share link/i }));

    expect(await screen.findByText(/without saved inputs/i)).toBeInTheDocument();
  });

  it("shows success message when params include ms", async () => {
    render(
      withIntl(
        <MathActionBar
          analyticsId="test-math"
          getShareSearchParams={() => ({ params: { ms: "abc" }, sharePayloadOmitted: false })}
        />,
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: /copy share link/i }));

    expect(await screen.findByText(/includes your inputs/i)).toBeInTheDocument();
  });
});
