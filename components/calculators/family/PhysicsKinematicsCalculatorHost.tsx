"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_KINEMATICS_URL,
  acceleration,
  accelerationTimeGraph,
  averageSpeed,
  boatRiver,
  displacementEom,
  distanceFromSpeed,
  distanceTimeGraph,
  finalVelocity,
  freeFall,
  initialVelocity,
  maxHeightProjectile,
  projectileAngle,
  projectileRange,
  relativeVelocity,
  speed,
  timeFromDistance,
  timeOfFlight,
  trainSpeed,
  velocity,
  velocityTimeGraph,
} from "@/lib/calculators/physicsKinematics";

type KinematicsSlug =
  | "speed-calculator"
  | "velocity-calculator"
  | "average-speed-calculator"
  | "distance-calculator-physics"
  | "time-calculator-physics"
  | "acceleration-calculator"
  | "final-velocity-calculator"
  | "initial-velocity-calculator"
  | "displacement-equations-of-motion-calculator"
  | "free-fall-calculator"
  | "distance-time-graph-calculator"
  | "velocity-time-graph-calculator"
  | "acceleration-time-graph-calculator"
  | "relative-velocity-calculator"
  | "boat-river-calculator"
  | "train-speed-calculator"
  | "projectile-range-calculator"
  | "time-of-flight-calculator"
  | "maximum-height-projectile-calculator"
  | "projectile-angle-calculator";

type Mode =
  | "speed"
  | "velocity"
  | "averageSpeed"
  | "distanceFromSpeed"
  | "timeFromDistance"
  | "acceleration"
  | "finalVelocity"
  | "initialVelocity"
  | "displacementEom"
  | "freeFall"
  | "distanceTimeGraph"
  | "velocityTimeGraph"
  | "accelerationTimeGraph"
  | "relativeVelocity"
  | "boatRiver"
  | "trainSpeed"
  | "projectileRange"
  | "timeOfFlight"
  | "maxHeightProjectile"
  | "projectileAngle";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const CONFIG: Record<KinematicsSlug, Config> = {
  "speed-calculator": {
    title: "Speed calculator",
    description: "v = d / t in SI (m/s).",
    mode: "speed",
    aDefault: "100",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
  },
  "velocity-calculator": {
    title: "Velocity calculator",
    description: "v = Δx / t (signed displacement over time).",
    mode: "velocity",
    aDefault: "50",
    bDefault: "5",
    cDefault: "",
    rDefault: "",
  },
  "average-speed-calculator": {
    title: "Average speed",
    description: "Average speed = total distance / total time.",
    mode: "averageSpeed",
    aDefault: "120",
    bDefault: "2",
    cDefault: "",
    rDefault: "",
  },
  "distance-calculator-physics": {
    title: "Distance from speed",
    description: "d = v t for constant speed.",
    mode: "distanceFromSpeed",
    aDefault: "15",
    bDefault: "8",
    cDefault: "",
    rDefault: "",
  },
  "time-calculator-physics": {
    title: "Time from distance",
    description: "t = d / v for constant speed.",
    mode: "timeFromDistance",
    aDefault: "100",
    bDefault: "20",
    cDefault: "",
    rDefault: "",
  },
  "acceleration-calculator": {
    title: "Acceleration",
    description: "a = (v − u) / t from initial and final velocity.",
    mode: "acceleration",
    aDefault: "0",
    bDefault: "20",
    cDefault: "4",
    rDefault: "",
  },
  "final-velocity-calculator": {
    title: "Final velocity",
    description: "v = u + a t (constant acceleration).",
    mode: "finalVelocity",
    aDefault: "0",
    bDefault: "5",
    cDefault: "3",
    rDefault: "",
  },
  "initial-velocity-calculator": {
    title: "Initial velocity",
    description: "u = v − a t (constant acceleration).",
    mode: "initialVelocity",
    aDefault: "20",
    bDefault: "5",
    cDefault: "3",
    rDefault: "",
  },
  "displacement-equations-of-motion-calculator": {
    title: "Displacement (eom)",
    description: "s = u t + ½ a t².",
    mode: "displacementEom",
    aDefault: "0",
    bDefault: "2",
    cDefault: "5",
    rDefault: "",
  },
  "free-fall-calculator": {
    title: "Free fall",
    description: "From rest: s = ½ g t², v = g t (g ≈ 9.80665 m/s²).",
    mode: "freeFall",
    aDefault: "2",
    bDefault: "",
    cDefault: "",
    rDefault: "",
  },
  "distance-time-graph-calculator": {
    title: "Distance–time graph",
    description: "Average speed ≈ Δs / Δt between two points.",
    mode: "distanceTimeGraph",
    aDefault: "0",
    bDefault: "0",
    cDefault: "100",
    rDefault: "10",
  },
  "velocity-time-graph-calculator": {
    title: "Velocity–time graph",
    description: "Displacement = trapezoid area; a = slope.",
    mode: "velocityTimeGraph",
    aDefault: "0",
    bDefault: "20",
    cDefault: "5",
    rDefault: "",
  },
  "acceleration-time-graph-calculator": {
    title: "Acceleration–time graph",
    description: "Δv = a t; optional initial u (default 0).",
    mode: "accelerationTimeGraph",
    aDefault: "2",
    bDefault: "5",
    cDefault: "0",
    rDefault: "",
  },
  "relative-velocity-calculator": {
    title: "Relative velocity",
    description: "v_A relative to B: v_A − v_B (1D).",
    mode: "relativeVelocity",
    aDefault: "30",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
  },
  "boat-river-calculator": {
    title: "Boat–river",
    description: "Resultant and drift angle for boat speed across a current.",
    mode: "boatRiver",
    aDefault: "5",
    bDefault: "2",
    cDefault: "",
    rDefault: "",
  },
  "train-speed-calculator": {
    title: "Train speed",
    description: "Speed to clear a platform: (L_train + L_platform) / t.",
    mode: "trainSpeed",
    aDefault: "200",
    bDefault: "300",
    cDefault: "25",
    rDefault: "",
  },
  "projectile-range-calculator": {
    title: "Projectile range",
    description: "R = u² sin(2θ) / g on level ground.",
    mode: "projectileRange",
    aDefault: "20",
    bDefault: "45",
    cDefault: "",
    rDefault: "",
  },
  "time-of-flight-calculator": {
    title: "Time of flight",
    description: "T = 2 u sin θ / g on level ground.",
    mode: "timeOfFlight",
    aDefault: "20",
    bDefault: "45",
    cDefault: "",
    rDefault: "",
  },
  "maximum-height-projectile-calculator": {
    title: "Maximum height",
    description: "H = u² sin²θ / (2 g).",
    mode: "maxHeightProjectile",
    aDefault: "20",
    bDefault: "45",
    cDefault: "",
    rDefault: "",
  },
  "projectile-angle-calculator": {
    title: "Projectile angle",
    description: "Acute launch angle for a given range (and complement).",
    mode: "projectileAngle",
    aDefault: "30",
    bDefault: "50",
    cDefault: "",
    rDefault: "",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function PhysicsKinematicsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as KinematicsSlug] ?? CONFIG["speed-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_KINEMATICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_KINEMATICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_KINEMATICS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_KINEMATICS_URL.R, config.rDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_KINEMATICS_URL.A]: a,
      [PHYSICS_KINEMATICS_URL.B]: b,
    };
    if (
      config.mode === "acceleration" ||
      config.mode === "finalVelocity" ||
      config.mode === "initialVelocity" ||
      config.mode === "displacementEom" ||
      config.mode === "velocityTimeGraph" ||
      config.mode === "trainSpeed" ||
      config.mode === "accelerationTimeGraph"
    ) {
      return { ...base, [PHYSICS_KINEMATICS_URL.C]: c };
    }
    if (config.mode === "distanceTimeGraph") {
      return {
        ...base,
        [PHYSICS_KINEMATICS_URL.C]: c,
        [PHYSICS_KINEMATICS_URL.R]: r,
      };
    }
    if (config.mode === "freeFall") {
      return { [PHYSICS_KINEMATICS_URL.A]: a };
    }
    return base;
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "speed": {
        const dP = parseNonNegative(a, "Distance (m)");
        const tP = parsePositive(b, "Time (s)");
        if (!dP.ok) return { error: dP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = speed({ distance: dP.value, time: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.speed)} m/s`,
          primaryLabel: "Speed",
          rows: [
            { label: "Distance", value: `${num(dP.value)} m` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "velocity": {
        const sP = parseFiniteNumber(a, "Displacement (m)");
        const tP = parsePositive(b, "Time (s)");
        if (!sP.ok) return { error: sP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = velocity({ displacement: sP.value, time: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.velocity)} m/s`,
          primaryLabel: "Velocity",
          rows: [
            { label: "Displacement", value: `${num(sP.value)} m` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "averageSpeed": {
        const dP = parseNonNegative(a, "Total distance (m)");
        const tP = parsePositive(b, "Total time (s)");
        if (!dP.ok) return { error: dP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = averageSpeed({ totalDistance: dP.value, totalTime: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.averageSpeed)} m/s`,
          primaryLabel: "Average speed",
          rows: [
            { label: "Total distance", value: `${num(dP.value)} m` },
            { label: "Total time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "distanceFromSpeed": {
        const vP = parseNonNegative(a, "Speed (m/s)");
        const tP = parseNonNegative(b, "Time (s)");
        if (!vP.ok) return { error: vP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = distanceFromSpeed({ speed: vP.value, time: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.distance)} m`,
          primaryLabel: "Distance",
          rows: [
            { label: "Speed", value: `${num(vP.value)} m/s` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "timeFromDistance": {
        const dP = parseNonNegative(a, "Distance (m)");
        const vP = parsePositive(b, "Speed (m/s)");
        if (!dP.ok) return { error: dP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = timeFromDistance({ distance: dP.value, speed: vP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.time)} s`,
          primaryLabel: "Time",
          rows: [
            { label: "Distance", value: `${num(dP.value)} m` },
            { label: "Speed", value: `${num(vP.value)} m/s` },
          ],
        };
      }
      case "acceleration": {
        const uP = parseFiniteNumber(a, "Initial velocity u (m/s)");
        const vP = parseFiniteNumber(b, "Final velocity v (m/s)");
        const tP = parsePositive(c, "Time (s)");
        if (!uP.ok) return { error: uP.error };
        if (!vP.ok) return { error: vP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = acceleration({ u: uP.value, v: vP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.a)} m/s²`,
          primaryLabel: "Acceleration a",
          rows: [
            { label: "u → v", value: `${num(uP.value)} → ${num(vP.value)} m/s` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "finalVelocity": {
        const uP = parseFiniteNumber(a, "Initial velocity u (m/s)");
        const aP = parseFiniteNumber(b, "Acceleration a (m/s²)");
        const tP = parseNonNegative(c, "Time (s)");
        if (!uP.ok) return { error: uP.error };
        if (!aP.ok) return { error: aP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = finalVelocity({ u: uP.value, a: aP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.v)} m/s`,
          primaryLabel: "Final velocity v",
          rows: [
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "a", value: `${num(aP.value)} m/s²` },
            { label: "t", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "initialVelocity": {
        const vP = parseFiniteNumber(a, "Final velocity v (m/s)");
        const aP = parseFiniteNumber(b, "Acceleration a (m/s²)");
        const tP = parseNonNegative(c, "Time (s)");
        if (!vP.ok) return { error: vP.error };
        if (!aP.ok) return { error: aP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = initialVelocity({ v: vP.value, a: aP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.u)} m/s`,
          primaryLabel: "Initial velocity u",
          rows: [
            { label: "v", value: `${num(vP.value)} m/s` },
            { label: "a", value: `${num(aP.value)} m/s²` },
            { label: "t", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "displacementEom": {
        const uP = parseFiniteNumber(a, "Initial velocity u (m/s)");
        const aP = parseFiniteNumber(b, "Acceleration a (m/s²)");
        const tP = parseNonNegative(c, "Time (s)");
        if (!uP.ok) return { error: uP.error };
        if (!aP.ok) return { error: aP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = displacementEom({ u: uP.value, a: aP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.s)} m`,
          primaryLabel: "Displacement s",
          rows: [
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "a", value: `${num(aP.value)} m/s²` },
            { label: "t", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "freeFall": {
        const tP = parseNonNegative(a, "Time (s)");
        if (!tP.ok) return { error: tP.error };
        const computed = freeFall({ t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.distance)} m`,
          primaryLabel: "Fall distance",
          rows: [
            { label: "Impact speed", value: `${num(computed.velocity)} m/s` },
            { label: "Time", value: `${num(tP.value)} s` },
            { label: "g", value: "9.80665 m/s²" },
          ],
        };
      }
      case "distanceTimeGraph": {
        const s1P = parseFiniteNumber(a, "s1 (m)");
        const t1P = parseFiniteNumber(b, "t1 (s)");
        const s2P = parseFiniteNumber(c, "s2 (m)");
        const t2P = parseFiniteNumber(r, "t2 (s)");
        if (!s1P.ok) return { error: s1P.error };
        if (!t1P.ok) return { error: t1P.error };
        if (!s2P.ok) return { error: s2P.error };
        if (!t2P.ok) return { error: t2P.error };
        const computed = distanceTimeGraph({
          s1: s1P.value,
          t1: t1P.value,
          s2: s2P.value,
          t2: t2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.avgSpeed)} m/s`,
          primaryLabel: "Average speed Δs/Δt",
          rows: [
            { label: "Δs", value: `${num(computed.deltaS)} m` },
            { label: "Δt", value: `${num(computed.deltaT)} s` },
          ],
        };
      }
      case "velocityTimeGraph": {
        const v1P = parseFiniteNumber(a, "v1 (m/s)");
        const v2P = parseFiniteNumber(b, "v2 (m/s)");
        const tP = parsePositive(c, "Duration t (s)");
        if (!v1P.ok) return { error: v1P.error };
        if (!v2P.ok) return { error: v2P.error };
        if (!tP.ok) return { error: tP.error };
        const computed = velocityTimeGraph({ v1: v1P.value, v2: v2P.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.displacement)} m`,
          primaryLabel: "Displacement (area)",
          rows: [
            { label: "Acceleration (slope)", value: `${num(computed.acceleration)} m/s²` },
            { label: "v1 → v2", value: `${num(v1P.value)} → ${num(v2P.value)} m/s` },
          ],
        };
      }
      case "accelerationTimeGraph": {
        const aP = parseFiniteNumber(a, "Acceleration a (m/s²)");
        const tP = parseNonNegative(b, "Time (s)");
        const uRaw = c.trim() === "" ? "0" : c;
        const uP = parseFiniteNumber(uRaw, "Initial u (m/s)");
        if (!aP.ok) return { error: aP.error };
        if (!tP.ok) return { error: tP.error };
        if (!uP.ok) return { error: uP.error };
        const computed = accelerationTimeGraph({ a: aP.value, t: tP.value, u: uP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.v)} m/s`,
          primaryLabel: "Final velocity v",
          rows: [
            { label: "Δv", value: `${num(computed.deltaV)} m/s` },
            { label: "Initial u", value: `${num(uP.value)} m/s` },
          ],
        };
      }
      case "relativeVelocity": {
        const aP = parseFiniteNumber(a, "vA (m/s)");
        const bP = parseFiniteNumber(b, "vB (m/s)");
        if (!aP.ok) return { error: aP.error };
        if (!bP.ok) return { error: bP.error };
        const computed = relativeVelocity({ vA: aP.value, vB: bP.value });
        return {
          primary: `${num(computed.vRel)} m/s`,
          primaryLabel: "v_A relative to B",
          rows: [
            { label: "vA", value: `${num(aP.value)} m/s` },
            { label: "vB", value: `${num(bP.value)} m/s` },
          ],
        };
      }
      case "boatRiver": {
        const boatP = parsePositive(a, "Boat speed (m/s)");
        const riverP = parseNonNegative(b, "River speed (m/s)");
        if (!boatP.ok) return { error: boatP.error };
        if (!riverP.ok) return { error: riverP.error };
        const computed = boatRiver({ boatSpeed: boatP.value, riverSpeed: riverP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.resultant)} m/s`,
          primaryLabel: "Resultant speed",
          rows: [
            { label: "Drift angle", value: `${num(computed.driftAngleDeg)}°` },
            { label: "Boat", value: `${num(boatP.value)} m/s` },
            { label: "River", value: `${num(riverP.value)} m/s` },
          ],
        };
      }
      case "trainSpeed": {
        const trainP = parseNonNegative(a, "Train length (m)");
        const platP = parseNonNegative(b, "Platform length (m)");
        const tP = parsePositive(c, "Time (s)");
        if (!trainP.ok) return { error: trainP.error };
        if (!platP.ok) return { error: platP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = trainSpeed({
          trainLength: trainP.value,
          platformLength: platP.value,
          time: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.speed)} m/s`,
          primaryLabel: "Train speed",
          rows: [
            { label: "Train length", value: `${num(trainP.value)} m` },
            { label: "Platform", value: `${num(platP.value)} m` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "projectileRange": {
        const uP = parseNonNegative(a, "Launch speed u (m/s)");
        const angP = parseFiniteNumber(b, "Angle (°)");
        if (!uP.ok) return { error: uP.error };
        if (!angP.ok) return { error: angP.error };
        const computed = projectileRange({ u: uP.value, angleDeg: angP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.range)} m`,
          primaryLabel: "Range R",
          rows: [
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "Angle", value: `${num(angP.value)}°` },
            { label: "g", value: "9.80665 m/s²" },
          ],
        };
      }
      case "timeOfFlight": {
        const uP = parseNonNegative(a, "Launch speed u (m/s)");
        const angP = parseFiniteNumber(b, "Angle (°)");
        if (!uP.ok) return { error: uP.error };
        if (!angP.ok) return { error: angP.error };
        const computed = timeOfFlight({ u: uP.value, angleDeg: angP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.t)} s`,
          primaryLabel: "Time of flight",
          rows: [
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "Angle", value: `${num(angP.value)}°` },
          ],
        };
      }
      case "maxHeightProjectile": {
        const uP = parseNonNegative(a, "Launch speed u (m/s)");
        const angP = parseFiniteNumber(b, "Angle (°)");
        if (!uP.ok) return { error: uP.error };
        if (!angP.ok) return { error: angP.error };
        const computed = maxHeightProjectile({ u: uP.value, angleDeg: angP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.height)} m`,
          primaryLabel: "Maximum height H",
          rows: [
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "Angle", value: `${num(angP.value)}°` },
          ],
        };
      }
      case "projectileAngle": {
        const uP = parsePositive(a, "Launch speed u (m/s)");
        const rangeP = parseNonNegative(b, "Range (m)");
        if (!uP.ok) return { error: uP.error };
        if (!rangeP.ok) return { error: rangeP.error };
        const computed = projectileAngle({ u: uP.value, range: rangeP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.angleDeg)}°`,
          primaryLabel: "Launch angle θ",
          rows: [
            { label: "Complement (90°−θ)", value: `${num(computed.complementDeg)}°` },
            { label: "u", value: `${num(uP.value)} m/s` },
            { label: "Range", value: `${num(rangeP.value)} m` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "speed" || config.mode === "averageSpeed" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-dist">
                  {config.mode === "averageSpeed" ? "Total distance (m)" : "Distance (m)"}
                </FieldLabel>
                <FieldInput id="pk-dist" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-time">
                  {config.mode === "averageSpeed" ? "Total time (s)" : "Time (s)"}
                </FieldLabel>
                <FieldInput id="pk-time" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "velocity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-disp">Displacement (m)</FieldLabel>
                <FieldInput id="pk-disp" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-vt">Time (s)</FieldLabel>
                <FieldInput id="pk-vt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "distanceFromSpeed" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-spd">Speed (m/s)</FieldLabel>
                <FieldInput id="pk-spd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-dt">Time (s)</FieldLabel>
                <FieldInput id="pk-dt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "timeFromDistance" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-td">Distance (m)</FieldLabel>
                <FieldInput id="pk-td" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-ts">Speed (m/s)</FieldLabel>
                <FieldInput id="pk-ts" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "acceleration" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-u">Initial velocity u (m/s)</FieldLabel>
                <FieldInput id="pk-u" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-v">Final velocity v (m/s)</FieldLabel>
                <FieldInput id="pk-v" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-at">Time t (s)</FieldLabel>
                <FieldInput id="pk-at" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "finalVelocity" ||
          config.mode === "displacementEom" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-fu">Initial velocity u (m/s)</FieldLabel>
                <FieldInput id="pk-fu" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-fa">Acceleration a (m/s²)</FieldLabel>
                <FieldInput id="pk-fa" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-ft">Time t (s)</FieldLabel>
                <FieldInput id="pk-ft" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "initialVelocity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-iv">Final velocity v (m/s)</FieldLabel>
                <FieldInput id="pk-iv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-ia">Acceleration a (m/s²)</FieldLabel>
                <FieldInput id="pk-ia" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-it">Time t (s)</FieldLabel>
                <FieldInput id="pk-it" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "freeFall" ? (
            <div>
              <FieldLabel htmlFor="pk-ff">Time of fall (s)</FieldLabel>
              <FieldInput id="pk-ff" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "distanceTimeGraph" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-s1">s1 (m)</FieldLabel>
                <FieldInput id="pk-s1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-t1">t1 (s)</FieldLabel>
                <FieldInput id="pk-t1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-s2">s2 (m)</FieldLabel>
                <FieldInput id="pk-s2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-t2">t2 (s)</FieldLabel>
                <FieldInput id="pk-t2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "velocityTimeGraph" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-v1">v1 (m/s)</FieldLabel>
                <FieldInput id="pk-v1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-v2">v2 (m/s)</FieldLabel>
                <FieldInput id="pk-v2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-vtt">Duration t (s)</FieldLabel>
                <FieldInput id="pk-vtt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "accelerationTimeGraph" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-aa">Acceleration a (m/s²)</FieldLabel>
                <FieldInput id="pk-aa" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-aat">Time t (s)</FieldLabel>
                <FieldInput id="pk-aat" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-au">Initial u (m/s, optional)</FieldLabel>
                <FieldInput id="pk-au" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "relativeVelocity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-va">vA (m/s)</FieldLabel>
                <FieldInput id="pk-va" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-vb">vB (m/s)</FieldLabel>
                <FieldInput id="pk-vb" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "boatRiver" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-boat">Boat speed (m/s)</FieldLabel>
                <FieldInput id="pk-boat" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-river">River speed (m/s)</FieldLabel>
                <FieldInput id="pk-river" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "trainSpeed" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-tl">Train length (m)</FieldLabel>
                <FieldInput id="pk-tl" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-pl">Platform length (m)</FieldLabel>
                <FieldInput id="pk-pl" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-tt">Time (s)</FieldLabel>
                <FieldInput id="pk-tt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "projectileRange" ||
          config.mode === "timeOfFlight" ||
          config.mode === "maxHeightProjectile" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-pu">Launch speed u (m/s)</FieldLabel>
                <FieldInput id="pk-pu" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-pang">Angle (°)</FieldLabel>
                <FieldInput id="pk-pang" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "projectileAngle" ? (
            <>
              <div>
                <FieldLabel htmlFor="pk-pau">Launch speed u (m/s)</FieldLabel>
                <FieldInput id="pk-pau" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pk-pr">Range (m)</FieldLabel>
                <FieldInput id="pk-pr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
