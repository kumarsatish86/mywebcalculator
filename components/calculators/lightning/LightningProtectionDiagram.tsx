"use client";

type Props = {
  heightM: number;
  radiusM: number;
  lengthM: number;
  widthM: number;
  covers: boolean;
  buildingLabel?: string;
};

/**
 * Animated LPS schematic via CSS transitions (stable across SVG attrs).
 */
export function LightningProtectionDiagram({
  heightM,
  radiusM,
  lengthM,
  widthM,
  covers,
  buildingLabel = "Building",
}: Props) {
  const maxH = Math.max(heightM, 1);
  const maxR = Math.max(radiusM, lengthM / 2, 1);
  const scale = 120 / maxH;
  const buildingH = Math.min(120, heightM * scale);
  const buildingW = Math.min(90, Math.max(40, (lengthM / maxR) * 48));
  const coneR = Math.min(110, Math.max(28, radiusM * (70 / maxR)));
  const rodH = 16;
  const cx = 160;
  const groundY = 175;
  const buildingTop = groundY - buildingH;
  const rodTop = buildingTop - rodH;
  const conePoints = `${cx},${rodTop} ${cx - coneR},${groundY} ${cx + coneR},${groundY}`;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/40 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Live protection schematic
      </p>
      <svg viewBox="0 0 320 210" className="h-auto w-full" role="img" aria-label="Lightning protection diagram">
        <ellipse cx="160" cy="22" rx="36" ry="12" fill="var(--border)" opacity={0.55} />
        <ellipse cx="140" cy="26" rx="18" ry="10" fill="var(--border)" opacity={0.45} />
        <ellipse cx="178" cy="26" rx="16" ry="9" fill="var(--border)" opacity={0.45} />
        <path
          d="M168 34 L160 48 L166 48 L158 62"
          fill="none"
          stroke="var(--accent-bright)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text x="148" y="14" className="fill-[var(--muted)]" fontSize={8}>
          CLOUD
        </text>

        <polygon
          points={conePoints}
          fill={
            covers
              ? "color-mix(in oklab, var(--accent) 18%, transparent)"
              : "color-mix(in oklab, #e11 12%, transparent)"
          }
          stroke="var(--accent)"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          className="transition-all duration-300 ease-out"
        />

        <rect
          x={cx - buildingW / 2}
          y={buildingTop}
          width={buildingW}
          height={buildingH}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth={2}
          rx={2}
          className="transition-all duration-300 ease-out"
        />

        <line
          x1={cx}
          y1={buildingTop}
          x2={cx}
          y2={rodTop}
          stroke="var(--accent-bright)"
          strokeWidth={3}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        <circle cx={cx} cy={rodTop} r={4} fill="var(--accent-bright)" className="transition-all duration-300 ease-out" />
        <text x={cx + 8} y={rodTop + 3} className="fill-[var(--accent-bright)]" fontSize={8}>
          Rod
        </text>

        <path
          d={`M ${cx + buildingW / 2 - 2} ${buildingTop + 10} L ${cx + buildingW / 2 + 14} ${groundY - 6}`}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={2}
          strokeDasharray="4 3"
          className="transition-all duration-300 ease-out"
        />

        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={70 + i * 18}
            y1={groundY + 4}
            x2={82 + i * 18}
            y2={groundY + 14}
            stroke="var(--border)"
            strokeWidth={1.5}
          />
        ))}
        <text x="70" y={groundY + 26} className="fill-[var(--muted)]" fontSize={8}>
          Ground grid
        </text>

        <line
          x1={cx + buildingW / 2 + 14}
          y1={groundY - 6}
          x2={cx + buildingW / 2 + 14}
          y2={groundY + 20}
          stroke="var(--accent)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <text x={cx + buildingW / 2 + 20} y={groundY + 14} className="fill-[var(--muted)]" fontSize={8}>
          Earth rod
        </text>

        <line x1={40} y1={groundY} x2={280} y2={groundY} stroke="var(--border)" strokeWidth={2} />

        <text x={cx - 24} y={buildingTop + buildingH / 2} className="fill-[var(--muted)]" fontSize={8}>
          {buildingLabel}
        </text>
        <text x={Math.min(240, cx + coneR - 40)} y={groundY - 6} className="fill-[var(--muted)]" fontSize={9}>
          r≈{radiusM.toFixed(0)}m
        </text>
        <text x={20} y={205} className="fill-[var(--muted)]" fontSize={8}>
          h={heightM.toFixed(1)}m · {lengthM.toFixed(0)}×{widthM.toFixed(0)}m
        </text>
      </svg>
    </div>
  );
}
