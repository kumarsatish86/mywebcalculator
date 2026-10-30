import { describe, expect, it } from "vitest";
import { computeTravelFuel } from "./travelFuel";
import { computeTravelTrip } from "./travelTrip";
import { computeTravelStay } from "./travelStay";
import { computeTravelFlight } from "./travelFlight";
import { computeTravelMoney } from "./travelMoney";
import { computeTravelLocal } from "./travelLocal";
import { computeTravelMisc } from "./travelMisc";

describe("travel engines smoke", () => {
  it("fuel cost", () => {
    const r = computeTravelFuel("travel-fuel-cost-calculator", {
      distanceKm: 100,
      efficiency: 10,
      pricePerLiter: 1.5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cost).toBe(15);
  });

  it("trip budget", () => {
    const r = computeTravelTrip("travel-trip-budget-calculator", {
      lodging: 500,
      food: 200,
      transport: 100,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(800);
  });

  it("hotel stay", () => {
    const r = computeTravelStay("travel-hotel-stay-cost-calculator", {
      nightly: 100,
      nights: 3,
      taxPct: 10,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(330);
  });

  it("airfare per mile", () => {
    const r = computeTravelFlight("travel-airfare-per-mile-calculator", {
      fare: 300,
      miles: 1500,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.perMile).toBe(0.2);
  });

  it("fx budget", () => {
    const r = computeTravelMoney("travel-currency-exchange-budget-calculator", {
      amount: 100,
      rate: 1.1,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.converted).toBeCloseTo(110);
  });

  it("luggage weight", () => {
    const r = computeTravelLocal("travel-luggage-weight-allowance-calculator", {
      weightKg: 25,
      limitKg: 23,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.overBy).toBe(2);
      expect(r.compliant).toBe(false);
    }
  });

  it("drive time", () => {
    const r = computeTravelMisc("travel-drive-time-calculator", {
      distanceKm: 120,
      speedKmh: 60,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.hours).toBe(2);
  });

  it("ota vs direct", () => {
    const r = computeTravelMisc("travel-ota-vs-direct-booking-calculator", {
      ota: 220,
      direct: 200,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.cheaper).toBe("direct");
      expect(r.total).toBe(200);
    }
  });
});
