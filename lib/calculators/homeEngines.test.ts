import { describe, expect, it } from "vitest";
import { computeHomeElectricity } from "./homeElectricity";
import { computeHomeWater } from "./homeWater";
import { computeHomeRent } from "./homeRent";
import { computeHomeBills } from "./homeBills";
import { computeHomeMaintenance } from "./homeMaintenance";
import { computeHomeSpace } from "./homeSpace";
import { computeHomeAppliance } from "./homeAppliance";
import { computeHomeKitchen } from "./homeKitchen";
import { computeHomeParking } from "./homeParking";
import { computeHomeSmart } from "./homeSmart";
import { computeHomeBonus } from "./homeBonus";

describe("home-utility engines smoke", () => {
  it("electricity bill", () => {
    const r = computeHomeElectricity("home-electricity-bill-calculator", { kwh: 100, ratePerKwh: 8 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cost).toBe(800);
  });

  it("water tank", () => {
    const r = computeHomeWater("home-water-tank-capacity-calculator", {
      lengthM: 1,
      widthM: 1,
      heightM: 1,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.liters).toBe(1000);
  });

  it("rent split", () => {
    const r = computeHomeRent("home-rent-split-roommates-calculator", { rent: 30000, roommates: 3 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.perPerson).toBe(10000);
  });

  it("budget", () => {
    const r = computeHomeBills("home-household-budget-calculator", { income: 50000, a: 10000, b: 5000 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.remaining).toBe(35000);
  });

  it("cleaning", () => {
    const r = computeHomeMaintenance("home-cleaning-cost-calculator", { areaSqft: 1000, ratePerSqft: 2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(2000);
  });

  it("room area", () => {
    const r = computeHomeSpace("home-room-area-calculator", { lengthM: 4, widthM: 5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.areaM2).toBe(20);
  });

  it("ac tonnage", () => {
    const r = computeHomeAppliance("home-ac-tonnage-calculator", { areaSqft: 150 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.tons).toBeCloseTo(1);
  });

  it("induction vs gas", () => {
    const r = computeHomeKitchen("home-induction-vs-gas-cost-calculator", {
      inductionKwh: 2,
      elecRate: 10,
      gasKg: 0.5,
      pricePerKg: 100,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cheaper).toBe("induction");
  });

  it("ev charging", () => {
    const r = computeHomeParking("home-ev-charging-cost-calculator", {
      kwhPerCharge: 30,
      ratePerKwh: 10,
      chargesPerMonth: 8,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cost).toBe(2400);
  });

  it("carbon", () => {
    const r = computeHomeSmart("home-carbon-footprint-calculator", { kwh: 100, kgCo2PerKwh: 0.7 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.kgCo2).toBe(70);
  });

  it("rent+utility", () => {
    const r = computeHomeBonus("home-rent-plus-utility-combined-calculator", { rent: 20000, utilities: 3000 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(23000);
  });
});
