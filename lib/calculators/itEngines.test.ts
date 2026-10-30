import { describe, expect, it } from "vitest";
import { computeItBinary } from "./itBinary";
import { computeItStorage } from "./itStorage";
import { computeItNetworking } from "./itNetworking";
import { computeItCrypto } from "./itCrypto";
import { computeItLogic } from "./itLogic";
import { computeItDatabase } from "./itDatabase";
import { computeItCloud } from "./itCloud";
import { computeItPerf } from "./itPerf";
import { computeItUi } from "./itUi";
import { computeItApi } from "./itApi";
import { computeItTime } from "./itTime";
import { computeItUtils } from "./itUtils";

describe("it-dev engines smoke", () => {
  it("binary", () => {
    const r = computeItBinary("it-decimal-to-binary-converter", { value: "10" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.binary).toBe("1010");
  });

  it("storage", () => {
    const r = computeItStorage("it-data-storage-converter-kb-mb-gb-tb-pb", { value: 1, unit: "gb" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.mb).toBe(1024);
  });

  it("subnet", () => {
    const r = computeItNetworking("it-subnet-calculator", { ip: "192.168.1.10", cidr: 24 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.network).toBe("192.168.1.0");
  });

  it("base64", () => {
    const r = computeItCrypto("it-base64-encode-decode", { text: "hi", mode: "encode" });
    expect(r.ok).toBe(true);
  });

  it("big-o", () => {
    const r = computeItLogic("it-big-o-calculator", { n: 100, kind: "n2" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.ops).toBe(10000);
  });

  it("table size", () => {
    const r = computeItDatabase("it-table-size-estimator", { rows: 1000, bytesPerRow: 100, indexFactor: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.bytes).toBe(100000);
  });

  it("cloud cost", () => {
    const r = computeItCloud("it-ec2-instance-cost-calculator", { hourlyRate: 0.1, hours: 100, instances: 2 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.monthlyCost).toBe(20);
  });

  it("rps", () => {
    const r = computeItPerf("it-requests-per-second-calculator", { requests: 1000, seconds: 10 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.rps).toBe(100);
  });

  it("contrast", () => {
    const r = computeItUi("it-contrast-ratio-checker", { hexFg: "#000000", hexBg: "#FFFFFF" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.contrast).toBeGreaterThan(20);
  });

  it("json", () => {
    const r = computeItApi("it-json-formatter-validator", { text: '{"a":1}' });
    expect(r.ok).toBe(true);
  });

  it("unix", () => {
    const r = computeItTime("it-unix-timestamp-converter", { timestamp: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.iso).toContain("1970");
  });

  it("slug", () => {
    const r = computeItUtils("it-slug-generator", { text: "Hello World!" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output).toBe("hello-world");
  });
});
