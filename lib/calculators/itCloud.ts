/** IT cloud & DevOps — educational cost/resource math. */

export type ItCloudSlug =
  | "it-cloud-cost-calculator-aws-azure-gcp-style"
  | "it-ec2-instance-cost-calculator"
  | "it-kubernetes-resource-calculator"
  | "it-pod-resource-estimator"
  | "it-docker-resource-calculator"
  | "it-container-size-calculator"
  | "it-cicd-pipeline-time-estimator"
  | "it-server-cost-calculator"
  | "it-uptime-calculator-sla-percent"
  | "it-autoscaling-cost-estimator";

export type ItCloudInput = {
  hourlyRate?: number;
  hours?: number;
  instances?: number;
  cpuCores?: number;
  memoryGb?: number;
  pods?: number;
  cpuRequest?: number;
  memRequestGb?: number;
  imageMb?: number;
  layers?: number;
  stages?: number;
  minutesPerStage?: number;
  slaPercent?: number;
  baselineInstances?: number;
  peakInstances?: number;
  peakHoursPerDay?: number;
};

export type ItCloudResult =
  | { ok: false; error: string }
  | {
      ok: true;
      monthlyCost?: number;
      totalCpu?: number;
      totalMemGb?: number;
      sizeMb?: number;
      minutes?: number;
      downtimeMinutesYear?: number;
      note: string;
    };

export function computeItCloud(slug: ItCloudSlug, input: ItCloudInput): ItCloudResult {
  switch (slug) {
    case "it-cloud-cost-calculator-aws-azure-gcp-style":
    case "it-ec2-instance-cost-calculator":
    case "it-server-cost-calculator": {
      const rate = input.hourlyRate;
      const hours = input.hours ?? 730;
      const n = input.instances ?? 1;
      if (!rate || rate <= 0) return { ok: false, error: "Hourly rate must be positive." };
      return {
        ok: true,
        monthlyCost: rate * hours * n,
        note: `Cost ≈ rate×hours×instances (${hours}h default ≈ month). List prices only.`,
      };
    }
    case "it-kubernetes-resource-calculator":
    case "it-pod-resource-estimator": {
      const pods = input.pods ?? 1;
      const cpu = input.cpuRequest ?? input.cpuCores ?? 0.5;
      const mem = input.memRequestGb ?? input.memoryGb ?? 1;
      if (pods <= 0 || cpu <= 0 || mem <= 0) return { ok: false, error: "Pods/CPU/mem must be positive." };
      return {
        ok: true,
        totalCpu: pods * cpu,
        totalMemGb: pods * mem,
        note: "Cluster request rollup = pods × requests (limits/overcommit not modeled).",
      };
    }
    case "it-docker-resource-calculator": {
      const cpu = input.cpuCores ?? 1;
      const mem = input.memoryGb ?? 1;
      if (cpu <= 0 || mem <= 0) return { ok: false, error: "CPU and memory must be positive." };
      return { ok: true, totalCpu: cpu, totalMemGb: mem, note: "Container resource reservation teaching values." };
    }
    case "it-container-size-calculator": {
      const base = input.imageMb ?? 0;
      const layers = input.layers ?? 0;
      const layerMb = input.memRequestGb ? input.memRequestGb * 1024 : 50;
      if (base < 0 || layers < 0) return { ok: false, error: "Sizes must be ≥ 0." };
      return {
        ok: true,
        sizeMb: base + layers * layerMb,
        note: "Image ≈ base + layers×avg layer (rough).",
      };
    }
    case "it-cicd-pipeline-time-estimator": {
      const stages = input.stages ?? 1;
      const mins = input.minutesPerStage ?? 5;
      if (stages <= 0 || mins <= 0) return { ok: false, error: "Stages and minutes must be positive." };
      return { ok: true, minutes: stages * mins, note: "Pipeline wall time ≈ stages × minutes/stage (serial)." };
    }
    case "it-uptime-calculator-sla-percent": {
      const sla = input.slaPercent;
      if (sla === undefined || sla < 0 || sla > 100) return { ok: false, error: "SLA % must be 0–100." };
      const yearMin = 365.25 * 24 * 60;
      const down = yearMin * (1 - sla / 100);
      return { ok: true, downtimeMinutesYear: down, note: `Allowed downtime/year ≈ ${(100 - sla).toFixed(4)}% of year.` };
    }
    case "it-autoscaling-cost-estimator": {
      const rate = input.hourlyRate;
      const base = input.baselineInstances ?? 1;
      const peak = input.peakInstances ?? base;
      const peakH = input.peakHoursPerDay ?? 8;
      if (!rate || rate <= 0) return { ok: false, error: "Hourly rate must be positive." };
      const daily = rate * (base * (24 - peakH) + peak * peakH);
      return {
        ok: true,
        monthlyCost: daily * 30,
        note: "Autoscaling cost ≈ blend of baseline and peak hours (30-day month).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
