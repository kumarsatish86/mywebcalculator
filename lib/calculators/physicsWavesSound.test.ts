import { describe, expect, it } from "vitest";
import { dopplerEffect, soundIntensity, waveSpeed } from "./physicsWavesSound";

describe("physicsWavesSound", () => {
  it("computes v = fλ", () => {
    const r = waveSpeed({ frequencyHz: 440, wavelengthM: 0.78 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.speedMs).toBeCloseTo(343.2, 1);
  });

  it("computes intensity and dB", () => {
    const r = soundIntensity({ powerW: 1e-3, areaM2: 1 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.intensity).toBeCloseTo(0.001, 6);
    expect(r.db).toBeCloseTo(90, 0);
  });

  it("applies Doppler for approaching source", () => {
    const r = dopplerEffect({
      f0: 1000,
      vSound: 340,
      vObserver: 0,
      vSource: 20,
      observerToward: false,
      sourceToward: true,
    });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.fHeard).toBeCloseTo(1000 * (340 / 320), 2);
  });
});
