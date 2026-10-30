/** IT time & productivity — educational. */

export type ItTimeSlug =
  | "it-unix-timestamp-converter"
  | "it-cron-expression-generator"
  | "it-time-zone-converter"
  | "it-working-hours-calculator"
  | "it-sprint-velocity-calculator"
  | "it-story-points-calculator"
  | "it-deadline-calculator";

export type ItTimeInput = {
  timestamp?: number;
  iso?: string;
  minute?: string;
  hour?: string;
  dom?: string;
  month?: string;
  dow?: string;
  utcOffsetFrom?: number;
  utcOffsetTo?: number;
  hoursPerDay?: number;
  days?: number;
  pointsDone?: number;
  sprints?: number;
  points?: number;
  velocity?: number;
  startIso?: string;
  workDays?: number;
};

export type ItTimeResult =
  | { ok: false; error: string }
  | {
      ok: true;
      iso?: string;
      unix?: number;
      cron?: string;
      convertedIso?: string;
      hours?: number;
      velocity?: number;
      sprintsNeeded?: number;
      deadlineIso?: string;
      note: string;
    };

export function computeItTime(slug: ItTimeSlug, input: ItTimeInput): ItTimeResult {
  switch (slug) {
    case "it-unix-timestamp-converter": {
      if (input.iso) {
        const d = Date.parse(input.iso);
        if (!Number.isFinite(d)) return { ok: false, error: "Invalid ISO date." };
        return { ok: true, unix: Math.floor(d / 1000), iso: new Date(d).toISOString(), note: "ISO → Unix seconds." };
      }
      const ts = input.timestamp;
      if (ts === undefined || !Number.isFinite(ts)) return { ok: false, error: "Unix timestamp required." };
      const ms = Math.abs(ts) < 1e12 ? ts * 1000 : ts;
      return { ok: true, unix: Math.floor(ms / 1000), iso: new Date(ms).toISOString(), note: "Unix → ISO (UTC)." };
    }
    case "it-cron-expression-generator": {
      const cron = [
        input.minute ?? "0",
        input.hour ?? "*",
        input.dom ?? "*",
        input.month ?? "*",
        input.dow ?? "*",
      ].join(" ");
      return { ok: true, cron, note: "5-field cron (min hour dom month dow). Verify on your scheduler." };
    }
    case "it-time-zone-converter": {
      const base = input.iso ? Date.parse(input.iso) : Date.now();
      if (!Number.isFinite(base)) return { ok: false, error: "Invalid ISO date." };
      const from = input.utcOffsetFrom ?? 0;
      const to = input.utcOffsetTo ?? 0;
      // Interpret input as local-at-from, convert to to by shifting offsets
      const utc = base - from * 3600_000;
      const dest = utc + to * 3600_000;
      return {
        ok: true,
        convertedIso: new Date(dest).toISOString(),
        note: `Shifted by ${(to - from).toFixed(1)} hours between offsets (fixed offset, not DST rules).`,
      };
    }
    case "it-working-hours-calculator": {
      const hpd = input.hoursPerDay ?? 8;
      const days = input.days;
      if (!days || days <= 0 || hpd <= 0) return { ok: false, error: "Days and hours/day must be positive." };
      return { ok: true, hours: days * hpd, note: "Working hours = days × hours/day." };
    }
    case "it-sprint-velocity-calculator": {
      const done = input.pointsDone;
      const sprints = input.sprints ?? 1;
      if (done === undefined || done < 0 || sprints <= 0) return { ok: false, error: "Points ≥ 0 and sprints > 0." };
      return { ok: true, velocity: done / sprints, note: "Velocity ≈ points completed ÷ sprints." };
    }
    case "it-story-points-calculator": {
      const points = input.points;
      const vel = input.velocity;
      if (!points || points <= 0 || !vel || vel <= 0) return { ok: false, error: "Points and velocity must be positive." };
      return { ok: true, sprintsNeeded: points / vel, note: "Sprints needed ≈ backlog points ÷ velocity." };
    }
    case "it-deadline-calculator": {
      const start = input.startIso ? Date.parse(input.startIso) : Date.now();
      const days = input.workDays;
      if (!Number.isFinite(start) || !days || days < 0) return { ok: false, error: "Start date and work days required." };
      const end = start + days * 86400_000;
      return { ok: true, deadlineIso: new Date(end).toISOString(), note: "Deadline = start + N×24h (calendar days, not business-day calendar)." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
