import { describe, expect, it } from "vitest";
import { electronConfiguration, periodicLookup, valencyFinder } from "./chemistryBonusMicro";

describe("chemistryBonusMicro", () => {
  it("looks up oxygen", () => {
    const r = periodicLookup({ query: "O" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.z).toBe(8);
  });

  it("suggests group 1 valency", () => {
    const r = valencyFinder({ group: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.valency).toBe(1);
  });

  it("builds config for carbon", () => {
    const r = electronConfiguration({ z: 6 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.config).toContain("2p2");
  });
});
