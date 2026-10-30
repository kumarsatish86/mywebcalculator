/** Travel & lifestyle template generators — in-browser drafts. */
import { draftOk, money, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenTravelSlug =
  | "aigen-travel-itinerary-generator"
  | "aigen-packing-list-generator"
  | "aigen-trip-budget-generator"
  | "aigen-daily-travel-plan-generator";

export const AIGEN_TRAVEL_SLUGS: AigenTravelSlug[] = [
  "aigen-travel-itinerary-generator",
  "aigen-packing-list-generator",
  "aigen-trip-budget-generator",
  "aigen-daily-travel-plan-generator",
];

export function computeAigenTravel(slug: AigenTravelSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your destination");
  const days = Math.max(1, Math.round(numOr(input.days, 5)));
  const budget = numOr(input.budget, 50000);
  const style = str(input.style, "balanced");
  const audience = str(input.audience, "travelers");

  switch (slug) {
    case "aigen-travel-itinerary-generator":
      return draftOk([
        `Itinerary — ${topic} (${days} days, ${style})`,
        "Day 1: Arrive, check-in, neighborhood walk, early night",
        `Day 2: Signature sights of ${topic}`,
        "Day 3: Local food + one museum / nature spot",
        days > 3 ? "Day 4: Day trip or slower café morning" : "",
        days > 4 ? `Day 5+: Free blocks for ${audience} priorities` : "",
        "Build buffers; don't stack 3 major sites same day",
      ]);
    case "aigen-packing-list-generator":
      return draftOk([
        `Packing list — ${topic} (${days} days)`,
        "Docs: ID, tickets, bookings, insurance copy",
        "Clothes: 1 outfit/day rule + 1 spare; laundry option",
        "Tech: charger, power bank, adapters",
        "Health: meds, sunscreen, basic first-aid",
        `Style note: ${style} — adjust layers for climate`,
        "Money: card + small cash; notify bank if needed",
      ]);
    case "aigen-trip-budget-generator": {
      const stay = Math.round(budget * 0.4);
      const food = Math.round(budget * 0.25);
      const transit = Math.round(budget * 0.2);
      const fun = budget - stay - food - transit;
      const perDay = Math.round(budget / days);
      return draftOk(
        [
          `Trip budget — ${topic}`,
          `Total budget: ₹${money(budget)} · ${days} days · ~₹${money(perDay)}/day`,
          `Stay (~40%): ₹${money(stay)}`,
          `Food (~25%): ₹${money(food)}`,
          `Local transit (~20%): ₹${money(transit)}`,
          `Activities / buffer: ₹${money(fun)}`,
          "Track daily; keep 10% contingency",
        ],
        { primary: perDay },
      );
    }
    case "aigen-daily-travel-plan-generator":
      return draftOk([
        `Daily travel plan — ${topic}`,
        "Morning: one hero activity before crowds",
        "Late morning: coffee + flexible second stop",
        "Afternoon: indoor / rest option if heat/rain",
        "Evening: food street or reserved dinner",
        `Pace for ${audience}: ${style}`,
        "Pin offline maps + emergency contacts",
      ]);
    default:
      return { ok: false, error: "Unknown travel generator." };
  }
}
