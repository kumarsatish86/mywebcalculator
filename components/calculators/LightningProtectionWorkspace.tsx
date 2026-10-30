"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { InsightList } from "@/components/results/SmartResultPanel";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import {
  BUILDING_PRESETS,
  LPS_STANDARDS,
  LPS_URL,
  computeLightningProtection,
  type BuildingPresetId,
  type DecisionOption,
  type LpsClass,
  type LpsStandardId,
} from "@/lib/calculators/engineering/lightningProtection";
import { parseLengthToMetres, parseResistivityOhmM } from "@/lib/calculators/parseEngineeringQuantity";
import { LightningProtectionDiagram } from "./lightning/LightningProtectionDiagram";
import { LpsDecisionCenter } from "./lightning/LpsDecisionCenter";
import { LpsInputCards } from "./lightning/LpsInputCards";
import { LpsTrustHero } from "./lightning/LpsTrustHero";

type TabId = "calculator" | "formula" | "examples" | "assistant" | "standards" | "faq";
type FormulaSub = "formula" | "variables" | "examples" | "references";
type Mode = "quick" | "expert";

type SavedProject = {
  id: string;
  name: string;
  savedAt: number;
  snapshot: {
    buildingId: BuildingPresetId;
    standardId: LpsStandardId;
    height: string;
    length: string;
    width: string;
    lpsClass: LpsClass;
    angle: string;
    rho: string;
    rod: string;
    air: string;
    sphere: string;
    mode: Mode;
  };
  summary?: {
    radiusM: number;
    risk: string;
    groundingOhm: number;
    safetyScore: number;
    costInr: number;
    coverageRatio: number;
  };
};

const STORAGE_KEY = "mwc-lps-projects";
const PRESET_IDS = Object.keys(BUILDING_PRESETS) as BuildingPresetId[];
const STD_IDS = Object.keys(LPS_STANDARDS) as LpsStandardId[];

function loadProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProjects(list: SavedProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
}

const TIMELINE: { id: string; label: string; tab?: TabId }[] = [
  { id: "study", label: "Study", tab: "standards" },
  { id: "estimate", label: "Estimate", tab: "calculator" },
  { id: "protection", label: "Protection", tab: "calculator" },
  { id: "grounding", label: "Grounding", tab: "calculator" },
  { id: "review", label: "Review", tab: "assistant" },
];

export function LightningProtectionWorkspace() {
  const stdInit = useLoanInitialInput(LPS_URL.STD, "iec62305");
  const bldInit = useLoanInitialInput(LPS_URL.BLD, "warehouse");
  const modeInit = useLoanInitialInput(LPS_URL.MODE, "quick");

  const [tab, setTab] = useState<TabId>("calculator");
  const [formulaSub, setFormulaSub] = useState<FormulaSub>("formula");
  const [mode, setMode] = useState<Mode>(modeInit === "expert" ? "expert" : "quick");
  const [standardId, setStandardId] = useState<LpsStandardId>(
    STD_IDS.includes(stdInit as LpsStandardId) ? (stdInit as LpsStandardId) : "iec62305",
  );
  const [buildingId, setBuildingId] = useState<BuildingPresetId>(
    PRESET_IDS.includes(bldInit as BuildingPresetId) ? (bldInit as BuildingPresetId) : "warehouse",
  );

  const preset = BUILDING_PRESETS[buildingId];
  const [height, setHeight] = useState(useLoanInitialInput(LPS_URL.H, String(preset.heightM)));
  const [length, setLength] = useState(useLoanInitialInput(LPS_URL.L, String(preset.lengthM)));
  const [width, setWidth] = useState(useLoanInitialInput(LPS_URL.W, String(preset.widthM)));
  const [lpsClass, setLpsClass] = useState<LpsClass>(
    (useLoanInitialInput(LPS_URL.CLS, preset.lpsClass) as LpsClass) || preset.lpsClass,
  );
  const [angle, setAngle] = useState(useLoanInitialInput(LPS_URL.ANG, ""));
  const [rho, setRho] = useState(useLoanInitialInput(LPS_URL.RHO, String(preset.soilOhmM)));
  const [rod, setRod] = useState(useLoanInitialInput(LPS_URL.ROD, String(preset.rodLengthM)));
  const [air, setAir] = useState(useLoanInitialInput(LPS_URL.AT, String(preset.airTerminators)));
  const [sphere, setSphere] = useState(useLoanInitialInput(LPS_URL.SPH, ""));
  const [coachPrompt, setCoachPrompt] = useState<string | null>(null);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Warehouse study");
  const [varHover, setVarHover] = useState<string | null>(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const applyPreset = (id: BuildingPresetId) => {
    const p = BUILDING_PRESETS[id];
    setBuildingId(id);
    setHeight(String(p.heightM));
    setLength(String(p.lengthM));
    setWidth(String(p.widthM));
    setLpsClass(p.lpsClass);
    setRho(String(p.soilOhmM));
    setRod(String(p.rodLengthM));
    setAir(String(p.airTerminators));
    setAngle("");
    setSphere("");
    setProjectName(`${p.label} study`);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {
      [LPS_URL.STD]: standardId,
      [LPS_URL.BLD]: buildingId,
      [LPS_URL.H]: height,
      [LPS_URL.L]: length,
      [LPS_URL.W]: width,
      [LPS_URL.CLS]: lpsClass,
      [LPS_URL.RHO]: rho,
      [LPS_URL.ROD]: rod,
      [LPS_URL.AT]: air,
      [LPS_URL.MODE]: mode,
    };
    if (angle.trim()) out[LPS_URL.ANG] = angle;
    if (sphere.trim()) out[LPS_URL.SPH] = sphere;
    return out;
  }, [standardId, buildingId, height, length, width, lpsClass, rho, rod, air, mode, angle, sphere]);

  useLoanUrlSync(shareParams, [standardId, buildingId, height, length, width, lpsClass, rho, rod, air, mode, angle, sphere]);

  const parsed = useMemo(() => {
    const h = parseLengthToMetres(height, "Height");
    const l = parseLengthToMetres(length, "Length");
    const w = parseLengthToMetres(width, "Width");
    const rLen = parseLengthToMetres(rod, "Rod length");
    const soil = parseResistivityOhmM(rho, "Soil resistivity");
    if (!h.ok) return { error: h.error };
    if (!l.ok) return { error: l.error };
    if (!w.ok) return { error: w.error };
    if (!rLen.ok) return { error: rLen.error };
    if (!soil.ok) return { error: soil.error };
    const airN = Number(air);
    if (!Number.isFinite(airN) || airN < 1) return { error: "Air terminators must be ≥ 1." };
    let ang: number | undefined;
    if (angle.trim()) {
      const a = Number(angle);
      if (!Number.isFinite(a) || a <= 0 || a >= 90) return { error: "Protective angle must be between 0 and 90°." };
      ang = a;
    }
    let sph: number | undefined;
    if (sphere.trim()) {
      const s = parseLengthToMetres(sphere, "Sphere radius");
      if (!s.ok) return { error: s.error };
      sph = s.value;
    }
    const filled = [height, length, width, rho, rod, air].filter((x) => x.trim()).length / 6;
    return {
      error: null as string | null,
      input: {
        standardId,
        buildingId,
        heightM: h.value,
        lengthM: l.value,
        widthM: w.value,
        lpsClass,
        protectiveAngleDeg: ang,
        soilOhmM: soil.value,
        rodLengthM: rLen.value,
        airTerminators: Math.round(airN),
        sphereRadiusM: sph,
        inputCompleteness: mode === "expert" ? Math.min(1, filled + (ang ? 0.05 : 0) + (sph ? 0.05 : 0)) : filled,
      },
    };
  }, [height, length, width, rod, rho, air, angle, sphere, standardId, buildingId, lpsClass, mode]);

  const result = useMemo(() => {
    if (parsed.error || !("input" in parsed) || !parsed.input) return null;
    const r = computeLightningProtection(parsed.input);
    return "error" in r ? null : r;
  }, [parsed]);

  const applyOption = (opt: DecisionOption) => {
    if (opt.patch.heightM != null) setHeight(String(Math.round(opt.patch.heightM * 10) / 10));
    if (opt.patch.airTerminators != null) setAir(String(opt.patch.airTerminators));
    if (opt.patch.protectiveAngleDeg != null) {
      setAngle(String(opt.patch.protectiveAngleDeg));
      setMode("expert");
    }
  };

  const saveProject = () => {
    const item: SavedProject = {
      id: `p-${Date.now()}`,
      name: projectName.trim() || "Untitled",
      savedAt: Date.now(),
      snapshot: {
        buildingId,
        standardId,
        height,
        length,
        width,
        lpsClass,
        angle,
        rho,
        rod,
        air,
        sphere,
        mode,
      },
      summary: result
        ? {
            radiusM: result.protectionRadiusM,
            risk: result.risk,
            groundingOhm: result.groundingOhm,
            safetyScore: result.safetyScore,
            costInr: result.cost.totalInr,
            coverageRatio: result.coverageRatio,
          }
        : undefined,
    };
    const next = [item, ...projects];
    setProjects(next);
    saveProjects(next);
  };

  const restoreProject = (p: SavedProject) => {
    const s = p.snapshot;
    setBuildingId(s.buildingId);
    setStandardId(s.standardId);
    setHeight(s.height);
    setLength(s.length);
    setWidth(s.width);
    setLpsClass(s.lpsClass);
    setAngle(s.angle);
    setRho(s.rho);
    setRod(s.rod);
    setAir(s.air);
    setSphere(s.sphere);
    setMode(s.mode);
    setProjectName(p.name);
    setTab("calculator");
  };

  const deleteProject = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    saveProjects(next);
    if (compareA === id) setCompareA(null);
    if (compareB === id) setCompareB(null);
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* ignore */
    }
  };

  const heightNum = "input" in parsed && parsed.input ? parsed.input.heightM : 18;
  const sliderMin = Math.max(5, Math.round(heightNum * 0.5));
  const sliderMax = Math.round(heightNum * 1.5 + 5);

  const tabs: { id: TabId; label: string }[] = [
    { id: "calculator", label: "Calculator" },
    { id: "formula", label: "Formula" },
    { id: "examples", label: "Examples" },
    { id: "assistant", label: "Assistant" },
    { id: "standards", label: "Standards" },
    { id: "faq", label: "FAQ" },
  ];

  const projA = projects.find((p) => p.id === compareA);
  const projB = projects.find((p) => p.id === compareB);
  const coachReply =
    result && coachPrompt ? result.coachTips.find((t) => t.prompt === coachPrompt)?.reply : null;

  return (
    <CalculatorShell
      title="Lightning Protection Calculator"
      description="Decision Center for LPS study estimates — radius, coverage, grounding, and next actions. Not a design approval."
      toolbar={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copyShare} className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold">
            Share
          </button>
          <button type="button" onClick={saveProject} className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold">
            Save project
          </button>
          <button
            type="button"
            onClick={() => {
              applyPreset("hospital");
              setTab("calculator");
            }}
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-semibold"
          >
            Example
          </button>
          <button
            type="button"
            onClick={() => setTab("formula")}
            className="rounded-lg bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--accent-fg,white)]"
          >
            Explain formula
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <LpsTrustHero standardId={standardId} onStandardChange={setStandardId} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${mode === "quick" ? "bg-[var(--accent)] text-[var(--accent-fg,white)]" : "border border-[var(--border)] text-[var(--muted)]"}`}
          >
            Quick mode
          </button>
          <button
            type="button"
            onClick={() => setMode("expert")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${mode === "expert" ? "bg-[var(--accent)] text-[var(--accent-fg,white)]" : "border border-[var(--border)] text-[var(--muted)]"}`}
          >
            Expert mode
          </button>
        </div>

        {/* Timeline */}
        <ol className="flex flex-wrap gap-1.5">
          {TIMELINE.map((step, i) => (
            <li key={step.id} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => step.tab && setTab(step.tab)}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
              >
                {step.label}
              </button>
              {i < TIMELINE.length - 1 ? <span className="text-[var(--border)]" aria-hidden>→</span> : null}
            </li>
          ))}
          <li>
            <Link
              href="/journeys/electrical-protection"
              className="rounded-full border border-[var(--accent)]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]"
            >
              Export journey
            </Link>
          </li>
        </ol>

        <div className="flex gap-1 overflow-x-auto border-b border-[var(--border)] pb-px">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium ${
                tab === t.id
                  ? "border-[var(--accent)] text-[var(--accent-bright)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "calculator" ? (
          <>
            {/* Mobile sticky decision strip */}
            {result ? (
              <div className="sticky top-0 z-30 -mx-1 lg:hidden">
                <LpsDecisionCenter result={result} onApplyOption={applyOption} compact />
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
              <div className="space-y-4">
                <LpsInputCards
                  mode={mode}
                  buildingId={buildingId}
                  onPreset={applyPreset}
                  height={height}
                  setHeight={setHeight}
                  length={length}
                  setLength={setLength}
                  width={width}
                  setWidth={setWidth}
                  rho={rho}
                  setRho={setRho}
                  rod={rod}
                  setRod={setRod}
                  lpsClass={lpsClass}
                  setLpsClass={setLpsClass}
                  angle={angle}
                  setAngle={setAngle}
                  air={air}
                  setAir={setAir}
                  sphere={sphere}
                  setSphere={setSphere}
                />
                {parsed.error ? <p className="text-sm text-rose-600">{parsed.error}</p> : null}

                {/* Height slider */}
                {"input" in parsed && parsed.input ? (
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]" htmlFor="h-slider">
                      Live height scrubber
                    </label>
                    <input
                      id="h-slider"
                      type="range"
                      min={sliderMin}
                      max={sliderMax}
                      step={0.5}
                      value={parsed.input.heightM}
                      onChange={(e) => setHeight(e.target.value)}
                      className="mt-2 w-full accent-[var(--accent)]"
                    />
                    <p className="mt-1 font-mono text-xs text-[var(--text)]">{parsed.input.heightM.toFixed(1)} m</p>
                  </div>
                ) : null}

                {/* Projects */}
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Projects</p>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <div className="min-w-[140px] flex-1">
                      <FieldLabel htmlFor="proj-name">Name</FieldLabel>
                      <FieldInput id="proj-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    <button type="button" onClick={saveProject} className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-fg,white)]">
                      Save
                    </button>
                  </div>
                  {projects.length ? (
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {projects.map((p) => (
                        <li key={p.id} className="rounded-lg border border-[var(--border)] p-2 text-xs">
                          <button type="button" className="w-full text-left font-semibold text-[var(--text)] hover:text-[var(--accent-bright)]" onClick={() => restoreProject(p)}>
                            {p.name}
                          </button>
                          <p className="text-[var(--muted)]">
                            {BUILDING_PRESETS[p.snapshot.buildingId]?.label}
                            {p.summary ? ` · r=${p.summary.radiusM.toFixed(0)}m · ${p.summary.risk}` : ""}
                          </p>
                          <div className="mt-1 flex gap-2">
                            <button type="button" className="text-[10px] text-[var(--accent)]" onClick={() => restoreProject(p)}>
                              Open
                            </button>
                            <button type="button" className="text-[10px] text-rose-600" onClick={() => deleteProject(p.id)}>
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-[var(--muted)]">No saved projects yet (this device only).</p>
                  )}
                  {projects.length >= 2 ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-[10px] font-semibold uppercase text-[var(--muted)]">Compare</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <select className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-2 py-1.5 text-xs" value={compareA ?? ""} onChange={(e) => setCompareA(e.target.value || null)}>
                          <option value="">Project A…</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <select className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-2 py-1.5 text-xs" value={compareB ?? ""} onChange={(e) => setCompareB(e.target.value || null)}>
                          <option value="">Project B…</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      {projA?.summary && projB?.summary ? (
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          {[projA, projB].map((p) => (
                            <div key={p.id} className="rounded-lg border border-[var(--border)] p-2">
                              <p className="font-semibold">{p.name}</p>
                              <p className="font-mono">r={p.summary!.radiusM.toFixed(1)}m</p>
                              <p>Coverage {(p.summary!.coverageRatio * 100).toFixed(0)}%</p>
                              <p>Ground {p.summary!.groundingOhm.toFixed(1)}Ω</p>
                              <p>Score {p.summary!.safetyScore}</p>
                              <p>Risk {p.summary!.risk}</p>
                              <p>₹{p.summary!.costInr.toLocaleString("en-IN")}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                {result && "input" in parsed && parsed.input ? (
                  <>
                    <LpsDecisionCenter result={result} onApplyOption={applyOption} />
                    <LightningProtectionDiagram
                      heightM={parsed.input.heightM}
                      radiusM={result.protectionRadiusM}
                      lengthM={parsed.input.lengthM}
                      widthM={parsed.input.widthM}
                      covers={result.coversFootprint}
                      buildingLabel={result.summary.building}
                    />
                    <div className="rounded-xl border border-[var(--border)] p-3">
                      <p className="mb-1 text-xs text-[var(--muted)]">Protection radius vs height (hover for values)</p>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={result.chartHeightVsRadius}>
                            <XAxis dataKey="heightM" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <ReferenceLine x={parsed.input.heightM} stroke="var(--accent)" strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="radiusM" stroke="var(--accent)" strokeWidth={2} dot={false} name="r (m)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[var(--muted)]">Enter valid dimensions for live Decision Center results.</p>
                )}
              </div>
            </div>
          </>
        ) : null}

        {tab === "formula" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {(["formula", "variables", "examples", "references"] as FormulaSub[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormulaSub(s)}
                  className={`rounded-full px-3 py-1 text-xs capitalize ${formulaSub === s ? "bg-[var(--accent)] text-[var(--accent-fg,white)]" : "border border-[var(--border)] text-[var(--muted)]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {formulaSub === "formula" ? (
              <div className="space-y-3">
                <p className="font-mono text-xl text-[var(--accent-bright)]">
                  r ={" "}
                  <button type="button" className="underline decoration-dotted" onMouseEnter={() => setVarHover("h")} onMouseLeave={() => setVarHover(null)} onFocus={() => setVarHover("h")} onBlur={() => setVarHover(null)}>
                    h
                  </button>{" "}
                  × tan(
                  <button type="button" className="underline decoration-dotted" onMouseEnter={() => setVarHover("theta")} onMouseLeave={() => setVarHover(null)} onFocus={() => setVarHover("theta")} onBlur={() => setVarHover(null)}>
                    θ
                  </button>
                  )
                </p>
                {varHover === "h" ? <p className="text-sm text-[var(--muted)]"><strong>h</strong> — air-termination / building height (m).</p> : null}
                {varHover === "theta" ? <p className="text-sm text-[var(--muted)]"><strong>θ</strong> — protective angle from LPS class / standard teaching table.</p> : null}
                {result ? (
                  <ol className="space-y-2">
                    {result.steps.map((s, i) => (
                      <li key={i} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                        <p className="font-medium">{i + 1}. {s.title}</p>
                        <p className="font-mono text-xs text-[var(--muted)]">{s.detail}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-[var(--muted)]">Valid inputs required for substitution steps.</p>
                )}
              </div>
            ) : null}
            {formulaSub === "variables" ? (
              <ul className="space-y-2 text-sm text-[var(--muted)]">
                <li><strong className="text-[var(--text)]">r</strong> — horizontal protection radius at ground.</li>
                <li><strong className="text-[var(--text)]">h</strong> — height of air termination.</li>
                <li><strong className="text-[var(--text)]">θ</strong> — protective angle (degrees).</li>
                <li><strong className="text-[var(--text)]">R</strong> — rolling-sphere radius (simplified check).</li>
                <li><strong className="text-[var(--text)]">ρ, L</strong> — soil resistivity and rod length for R ≈ ρ/(2πL).</li>
              </ul>
            ) : null}
            {formulaSub === "examples" ? (
              <div className="space-y-2">
                {PRESET_IDS.slice(0, 3).map((id) => {
                  const p = BUILDING_PRESETS[id];
                  return (
                    <button key={id} type="button" onClick={() => { applyPreset(id); setTab("calculator"); }} className="block w-full rounded-xl border border-[var(--border)] p-3 text-left text-sm hover:border-[var(--accent)]/40">
                      <p className="font-semibold text-[var(--text)]">{p.label}</p>
                      <p className="text-xs text-[var(--muted)]">H={p.heightM}m · {p.lengthM}×{p.widthM}m · class {p.lpsClass}</p>
                    </button>
                  );
                })}
              </div>
            ) : null}
            {formulaSub === "references" ? (
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                Teaching geometry only. Authoritative methods: IEC 62305, NFPA 780, IS 2309, BS EN 62305 — obtain the edition adopted by your AHJ.
              </p>
            ) : null}
          </div>
        ) : null}

        {tab === "examples" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {PRESET_IDS.map((id) => {
              const p = BUILDING_PRESETS[id];
              return (
                <button key={id} type="button" onClick={() => { applyPreset(id); setTab("calculator"); }} className="rounded-xl border border-[var(--border)] p-4 text-left hover:border-[var(--accent)]/40">
                  <p className="font-semibold text-[var(--text)]">{p.label}</p>
                  <p className="text-xs text-[var(--muted)]">H={p.heightM}m · {p.lengthM}×{p.widthM}m · ρ={p.soilOhmM}</p>
                </button>
              );
            })}
          </div>
        ) : null}

        {tab === "assistant" && result ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--muted)]">Rules-based engineer tips — not a live AI model.</p>
            <div className="flex flex-wrap gap-2">
              {result.coachTips.map((t) => (
                <button key={t.prompt} type="button" onClick={() => setCoachPrompt(t.prompt)} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">
                  {t.prompt}
                </button>
              ))}
            </div>
            {coachReply ? <p className="rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">{coachReply}</p> : null}
            <InsightList
              title="Quick insights"
              items={[
                {
                  title: "Coverage",
                  detail: result.coversFootprint ? "Cone/sphere estimate covers half-diagonal." : "Footprint extends beyond estimated radius.",
                  tone: result.coversFootprint ? "good" : "warn",
                },
                {
                  title: "Grounding",
                  detail: result.groundingLabel,
                  tone: result.groundingOhm <= 10 ? "good" : "bad",
                },
              ]}
            />
          </div>
        ) : null}
        {tab === "assistant" && !result ? <p className="text-sm text-[var(--muted)]">Generate a valid estimate first.</p> : null}

        {tab === "standards" ? (
          <div className="space-y-3">
            {STD_IDS.map((id) => (
              <article key={id} className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                <h3 className="font-semibold text-[var(--text)]">{LPS_STANDARDS[id].label}</h3>
                <p className="mt-2">{LPS_STANDARDS[id].note}</p>
              </article>
            ))}
          </div>
        ) : null}

        {tab === "faq" ? (
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-[var(--text)]">Is the Decision Center a code pass?</dt>
              <dd className="mt-1 text-[var(--muted)]">No. PASS/REVIEW and safety scores are teaching heuristics only.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--text)]">Where are projects stored?</dt>
              <dd className="mt-1 text-[var(--muted)]">Browser localStorage on this device — not synced to an account.</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--text)]">Related journey?</dt>
              <dd className="mt-1">
                <Link href="/journeys/electrical-protection" className="text-[var(--accent)]">Electrical protection toolkit</Link>
              </dd>
            </div>
          </dl>
        ) : null}
      </div>

      {/* Ask engineer FAB */}
      <button
        type="button"
        onClick={() => {
          setTab("assistant");
          setCoachPrompt("Why is my coverage low?");
        }}
        className="fixed bottom-5 right-5 z-40 rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-fg,white)] shadow-lg"
      >
        Ask engineer
      </button>
    </CalculatorShell>
  );
}
