"use client";

import type { HomeElectricitySlug } from "@/lib/calculators/homeElectricity";
import type { HomeWaterSlug } from "@/lib/calculators/homeWater";
import type { HomeRentSlug } from "@/lib/calculators/homeRent";
import type { HomeBillsSlug } from "@/lib/calculators/homeBills";
import type { HomeMaintenanceSlug } from "@/lib/calculators/homeMaintenance";
import type { HomeSpaceSlug } from "@/lib/calculators/homeSpace";
import type { HomeApplianceSlug } from "@/lib/calculators/homeAppliance";
import type { HomeKitchenSlug } from "@/lib/calculators/homeKitchen";
import type { HomeParkingSlug } from "@/lib/calculators/homeParking";
import type { HomeSmartSlug } from "@/lib/calculators/homeSmart";
import type { HomeBonusSlug } from "@/lib/calculators/homeBonus";
import { HomeElectricityCalculatorHost } from "./HomeElectricityCalculatorHost";
import { HomeWaterCalculatorHost } from "./HomeWaterCalculatorHost";
import { HomeRentCalculatorHost } from "./HomeRentCalculatorHost";
import { HomeBillsCalculatorHost } from "./HomeBillsCalculatorHost";
import { HomeMaintenanceCalculatorHost } from "./HomeMaintenanceCalculatorHost";
import { HomeSpaceCalculatorHost } from "./HomeSpaceCalculatorHost";
import { HomeApplianceCalculatorHost } from "./HomeApplianceCalculatorHost";
import { HomeKitchenCalculatorHost } from "./HomeKitchenCalculatorHost";
import { HomeParkingCalculatorHost } from "./HomeParkingCalculatorHost";
import { HomeSmartCalculatorHost } from "./HomeSmartCalculatorHost";
import { HomeBonusCalculatorHost } from "./HomeBonusCalculatorHost";

const ELECTRICITY = new Set<string>([
  "home-electricity-bill-calculator",
  "home-unit-consumption-calculator",
  "home-cost-per-unit-calculator",
  "home-appliance-energy-consumption-calculator",
  "home-monthly-electricity-cost-estimator",
  "home-annual-energy-cost-calculator",
  "home-power-usage-kwh-calculator",
  "home-standby-power-consumption-calculator",
  "home-solar-panel-cost-calculator",
  "home-solar-savings-calculator",
  "home-solar-panel-size-calculator",
  "home-solar-roi-calculator",
  "home-battery-backup-calculator",
  "home-inverter-load-calculator",
  "home-battery-backup-time-calculator",
  "home-ups-calculator",
  "home-generator-fuel-consumption-calculator",
] satisfies HomeElectricitySlug[]);

const WATER = new Set<string>([
  "home-water-consumption-household-calculator",
  "home-daily-water-usage-calculator",
  "home-monthly-water-bill-calculator",
  "home-rainwater-harvesting-calculator",
  "home-water-tank-capacity-calculator",
  "home-borewell-depth-estimator",
  "home-pipe-flow-rate-calculator",
  "home-water-pressure-calculator",
  "home-leak-loss-calculator",
] satisfies HomeWaterSlug[]);

const RENT = new Set<string>([
  "home-rent-affordability-calculator",
  "home-rent-split-roommates-calculator",
  "home-rent-vs-buy-calculator",
  "home-lease-cost-calculator",
  "home-property-maintenance-cost-calculator",
  "home-ownership-cost-calculator",
  "home-society-charges-calculator",
] satisfies HomeRentSlug[]);

const BILLS = new Set<string>([
  "home-monthly-expense-calculator",
  "home-household-budget-calculator",
  "home-cost-of-living-calculator",
  "home-ott-subscription-cost-calculator",
  "home-internet-bill-calculator",
  "home-mobile-recharge-cost-calculator",
  "home-gas-bill-calculator",
  "home-lpg-usage-calculator",
  "home-garbage-utility-fee-calculator",
] satisfies HomeBillsSlug[]);

const MAINTENANCE = new Set<string>([
  "home-cleaning-cost-calculator",
  "home-maid-salary-calculator",
  "home-deep-cleaning-cost-estimator",
  "home-repair-cost-calculator",
  "home-painting-cost-calculator",
  "home-renovation-cost-calculator",
] satisfies HomeMaintenanceSlug[]);

const SPACE = new Set<string>([
  "home-room-area-calculator",
  "home-carpet-area-calculator",
  "home-built-up-area-calculator",
  "home-super-built-up-area-calculator",
  "home-tile-calculator",
  "home-flooring-cost-calculator",
  "home-paint-quantity-calculator",
  "home-wallpaper-calculator",
] satisfies HomeSpaceSlug[]);

const APPLIANCE = new Set<string>([
  "home-ac-power-consumption-calculator",
  "home-ac-tonnage-calculator",
  "home-heater-electricity-cost-calculator",
  "home-refrigerator-energy-calculator",
  "home-washing-machine-cost-calculator",
  "home-tv-power-consumption-calculator",
] satisfies HomeApplianceSlug[]);

const KITCHEN = new Set<string>([
  "home-gas-consumption-calculator",
  "home-cooking-cost-calculator",
  "home-induction-vs-gas-cost-calculator",
  "home-grocery-budget-calculator",
  "home-monthly-food-expense-calculator",
] satisfies HomeKitchenSlug[]);

const PARKING = new Set<string>([
  "home-parking-space-calculator",
  "home-garage-size-calculator",
  "home-ev-charging-cost-calculator",
] satisfies HomeParkingSlug[]);

const SMART = new Set<string>([
  "home-smart-home-cost-calculator",
  "home-iot-device-cost-calculator",
  "home-energy-efficiency-savings-calculator",
  "home-carbon-footprint-calculator",
  "home-energy-saving-calculator",
  "home-green-home-cost-calculator",
] satisfies HomeSmartSlug[]);

const BONUS = new Set<string>([
  "home-electricity-bill-split-roommates-calculator",
  "home-cost-per-appliance-usage-calculator",
  "home-peak-hour-electricity-cost-calculator",
  "home-daily-vs-monthly-utility-analyzer",
  "home-utility-comparison-city-wise-calculator",
  "home-rent-plus-utility-combined-calculator",
] satisfies HomeBonusSlug[]);

export function HomeUtilityCalculatorRouter({ slug }: { slug: string }) {
  if (ELECTRICITY.has(slug)) return <HomeElectricityCalculatorHost slug={slug} />;
  if (WATER.has(slug)) return <HomeWaterCalculatorHost slug={slug} />;
  if (RENT.has(slug)) return <HomeRentCalculatorHost slug={slug} />;
  if (BILLS.has(slug)) return <HomeBillsCalculatorHost slug={slug} />;
  if (MAINTENANCE.has(slug)) return <HomeMaintenanceCalculatorHost slug={slug} />;
  if (SPACE.has(slug)) return <HomeSpaceCalculatorHost slug={slug} />;
  if (APPLIANCE.has(slug)) return <HomeApplianceCalculatorHost slug={slug} />;
  if (KITCHEN.has(slug)) return <HomeKitchenCalculatorHost slug={slug} />;
  if (PARKING.has(slug)) return <HomeParkingCalculatorHost slug={slug} />;
  if (SMART.has(slug)) return <HomeSmartCalculatorHost slug={slug} />;
  if (BONUS.has(slug)) return <HomeBonusCalculatorHost slug={slug} />;
  return <HomeElectricityCalculatorHost slug={slug} />;
}
