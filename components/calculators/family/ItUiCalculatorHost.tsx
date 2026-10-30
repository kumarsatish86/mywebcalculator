"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItUi,
  type ItUiInput,
  type ItUiResult,
  type ItUiSlug,
} from "@/lib/calculators/itUi";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "resolution" | "aspect" | "ppi" | "rem" | "cssUnit" | "color" | "contrast" | "fontScale";

type Config = {
  title: string; description: string; mode: Mode;
  wDefault: string; hDefault: string; dDefault: string;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string; tDefault: string; nDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItUiSlug, Config> = {
  "it-screen-resolution-calculator": { title: "Screen resolution", description: `Megapixels from W×H. ${DISCLAIMER}`, mode: "resolution", wDefault: "1920", hDefault: "1080", dDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-viewport-size-calculator": { title: "Viewport size", description: `Pixel count from dimensions. ${DISCLAIMER}`, mode: "resolution", wDefault: "390", hDefault: "844", dDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-aspect-ratio-calculator": { title: "Aspect ratio", description: `Simplified W:H ratio. ${DISCLAIMER}`, mode: "aspect", wDefault: "1920", hDefault: "1080", dDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-pixel-density-ppi-calculator": { title: "Pixel density (PPI)", description: `PPI from W, H, diagonal. ${DISCLAIMER}`, mode: "ppi", wDefault: "2560", hDefault: "1440", dDefault: "27", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-rem-to-px-converter": { title: "rem to px", description: `px = rem × root. ${DISCLAIMER}`, mode: "rem", wDefault: "", hDefault: "", dDefault: "", aDefault: "1.5", bDefault: "16", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-css-unit-converter": { title: "CSS unit converter", description: `px/rem/pt conversion. ${DISCLAIMER}`, mode: "cssUnit", wDefault: "", hDefault: "", dDefault: "", aDefault: "16", bDefault: "px", cDefault: "rem", rDefault: "", tDefault: "", nDefault: "" },
  "it-color-converter-hex-rgb-hsl": { title: "Color converter", description: `HEX ↔ RGB ↔ HSL. ${DISCLAIMER}`, mode: "color", wDefault: "", hDefault: "", dDefault: "", aDefault: "#336699", bDefault: "", cDefault: "", rDefault: "", tDefault: "", nDefault: "" },
  "it-contrast-ratio-checker": { title: "Contrast ratio", description: `WCAG relative luminance. ${DISCLAIMER}`, mode: "contrast", wDefault: "", hDefault: "", dDefault: "", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "#000000", nDefault: "#FFFFFF" },
  "it-font-size-calculator": { title: "Font size scale", description: `Modular type scale. ${DISCLAIMER}`, mode: "fontScale", wDefault: "", hDefault: "", dDefault: "", aDefault: "16", bDefault: "1.25", cDefault: "5", rDefault: "", tDefault: "", nDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function formatResult(res: ItUiResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.megapixels !== undefined) rows.push({ label: "Megapixels", value: num(res.megapixels, 2) });
  if (res.aspect) rows.push({ label: "Aspect", value: res.aspect });
  if (res.ppi !== undefined) rows.push({ label: "PPI", value: num(res.ppi, 1) });
  if (res.px !== undefined) rows.push({ label: "px", value: num(res.px, 2) });
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 4) });
  if (res.hex) rows.push({ label: "HEX", value: res.hex });
  if (res.rgb) rows.push({ label: "RGB", value: res.rgb });
  if (res.hsl) rows.push({ label: "HSL", value: res.hsl });
  if (res.contrast !== undefined) rows.push({ label: "Contrast", value: num(res.contrast, 2) });
  if (res.wcag) rows.push({ label: "WCAG", value: res.wcag });
  if (res.scale) rows.push({ label: "Scale (px)", value: res.scale });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.aspect ?? res.hex ?? res.wcag ?? res.scale?.split(",")[0]
    ?? (res.megapixels !== undefined ? num(res.megapixels, 2)
    : res.ppi !== undefined ? num(res.ppi, 1)
    : res.px !== undefined ? num(res.px, 2)
    : res.converted !== undefined ? num(res.converted, 4)
    : res.contrast !== undefined ? num(res.contrast, 2)
    : "—");
  const primaryLabel =
    res.aspect ? "Aspect ratio" : res.hex ? "HEX" : res.wcag ? "WCAG level"
    : res.scale ? "Type scale" : res.megapixels !== undefined ? "Megapixels"
    : res.ppi !== undefined ? "PPI" : res.contrast !== undefined ? "Contrast" : "Result";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItUiCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItUiSlug;
  const config = CONFIG[key] ?? CONFIG["it-screen-resolution-calculator"];
  const [w, setW] = useState(useLoanInitialInput(IT_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(IT_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(IT_URL.D, config.dDefault));
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "resolution": case "aspect": case "ppi": put(IT_URL.W, w); put(IT_URL.H, h); if (config.mode === "ppi") put(IT_URL.D, d); break;
      case "rem": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "cssUnit": put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c); break;
      case "color": put(IT_URL.A, a); if (r.trim() || b.trim() || c.trim()) { put(IT_URL.R, r); put(IT_URL.B, b); put(IT_URL.C, c); } break;
      case "contrast": put(IT_URL.T, t); put(IT_URL.N, n); break;
      case "fontScale": put(IT_URL.A, a); put(IT_URL.B, b); put(IT_URL.C, c); break;
    }
    return out;
  }, [a, b, c, config.mode, d, h, n, r, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, n, r, t, w]);

  const result = useMemo(() => {
    const input: ItUiInput = {};
    switch (config.mode) {
      case "resolution": case "aspect": case "ppi": {
        const width = parsePositive(w, "Width (px)");
        const height = parsePositive(h, "Height (px)");
        if (!width.ok) return { error: width.error };
        if (!height.ok) return { error: height.error };
        input.widthPx = width.value;
        input.heightPx = height.value;
        if (config.mode === "ppi") {
          const diag = parsePositive(d, "Diagonal (in)");
          if (!diag.ok) return { error: diag.error };
          input.diagonalIn = diag.value;
        }
        break;
      }
      case "rem": {
        const rem = parseFiniteNumber(a, "rem");
        const root = parsePositive(b, "Root px");
        if (!rem.ok) return { error: rem.error };
        if (!root.ok) return { error: root.error };
        input.rem = rem.value;
        input.rootPx = root.value;
        break;
      }
      case "cssUnit": {
        const val = parseFiniteNumber(a, "Value");
        if (!val.ok) return { error: val.error };
        input.value = val.value;
        input.fromUnit = b.trim() || "px";
        input.toUnit = c.trim() || "rem";
        input.rootPx = 16;
        break;
      }
      case "color": {
        if (a.trim().startsWith("#") || /^[0-9a-fA-F]{6}$/.test(a.trim())) {
          input.hex = a.trim().startsWith("#") ? a.trim() : `#${a.trim()}`;
        } else {
          const rv = parseNonNegative(r, "R");
          const gv = parseNonNegative(b, "G");
          const bv = parseNonNegative(c, "B");
          if (!rv.ok) return { error: rv.error };
          if (!gv.ok) return { error: gv.error };
          if (!bv.ok) return { error: bv.error };
          input.r = rv.value;
          input.g = gv.value;
          input.b = bv.value;
        }
        break;
      }
      case "contrast":
        input.hexFg = t.trim() || undefined;
        input.hexBg = n.trim() || undefined;
        break;
      case "fontScale": {
        const base = parsePositive(a, "Base px");
        const scale = parsePositive(b, "Scale");
        if (!base.ok) return { error: base.error };
        if (!scale.ok) return { error: scale.error };
        input.basePx = base.value;
        input.scale = scale.value;
        if (c.trim() !== "") {
          const steps = parsePositive(c, "Steps");
          if (!steps.ok) return { error: steps.error };
          input.steps = Math.floor(steps.value);
        }
        break;
      }
    }
    return formatResult(computeItUi(key in CONFIG ? key : "it-screen-resolution-calculator", input), num);
  }, [a, b, c, config.mode, d, h, key, n, r, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "resolution" || config.mode === "aspect" || config.mode === "ppi" ? (
            <>
              <div><FieldLabel htmlFor="itui-w">Width (px)</FieldLabel><FieldInput id="itui-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itui-h">Height (px)</FieldLabel><FieldInput id="itui-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="numeric" /></div>
              {config.mode === "ppi" ? (
                <div><FieldLabel htmlFor="itui-d">Diagonal (inches)</FieldLabel><FieldInput id="itui-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              ) : null}
            </>
          ) : null}
          {config.mode === "rem" ? (
            <>
              <div><FieldLabel htmlFor="itui-a">rem</FieldLabel><FieldInput id="itui-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itui-b">Root font size (px)</FieldLabel><FieldInput id="itui-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cssUnit" ? (
            <>
              <div><FieldLabel htmlFor="itui-a">Value</FieldLabel><FieldInput id="itui-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itui-b">From unit (px, rem, pt)</FieldLabel><FieldInput id="itui-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itui-c">To unit</FieldLabel><FieldInput id="itui-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "color" ? (
            <>
              <div><FieldLabel htmlFor="itui-a">HEX (#RRGGBB) or leave blank for RGB</FieldLabel><FieldInput id="itui-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itui-r">R (0–255)</FieldLabel><FieldInput id="itui-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itui-b">G</FieldLabel><FieldInput id="itui-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itui-c">B</FieldLabel><FieldInput id="itui-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "contrast" ? (
            <>
              <div><FieldLabel htmlFor="itui-t">Foreground (#RRGGBB)</FieldLabel><FieldInput id="itui-t" value={t} onChange={(ev) => setT(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itui-n">Background (#RRGGBB)</FieldLabel><FieldInput id="itui-n" value={n} onChange={(ev) => setN(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "fontScale" ? (
            <>
              <div><FieldLabel htmlFor="itui-a">Base (px)</FieldLabel><FieldInput id="itui-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itui-b">Scale ratio</FieldLabel><FieldInput id="itui-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itui-c">Steps</FieldLabel><FieldInput id="itui-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
