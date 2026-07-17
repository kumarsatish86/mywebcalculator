/** Academic planning: study hours, plans, syllabus pacing, revision, countdown. */

export const EXAM_ACADEMIC_PLANNING_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  D: "d",
  P: "p",
} as const;

export function parseExamAcademicPlanningSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_ACADEMIC_PLANNING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function studyHours(params: {
  chapters: number;
  hoursPerChapter: number;
  daysAvailable: number;
}): {
  totalHours: number;
  hoursPerDay: number;
  feasible: boolean;
} | { error: string } {
  if (params.chapters <= 0 || params.hoursPerChapter <= 0) {
    return { error: "Chapters and hours per chapter must be positive." };
  }
  if (params.daysAvailable <= 0) return { error: "Days available must be positive." };
  const totalHours = params.chapters * params.hoursPerChapter;
  const hoursPerDay = totalHours / params.daysAvailable;
  return { totalHours, hoursPerDay, feasible: hoursPerDay <= 8 };
}

export function studyPlanGenerator(params: {
  subjects: number;
  days: number;
  hoursPerDay: number;
}): {
  hoursPerSubjectTotal: number;
  sessionsPerSubject: number;
  outline: string[];
} | { error: string } {
  if (params.subjects <= 0 || params.days <= 0 || params.hoursPerDay <= 0) {
    return { error: "Subjects, days, and hours must be positive." };
  }
  const totalHours = params.days * params.hoursPerDay;
  const hoursPerSubjectTotal = totalHours / params.subjects;
  const sessionsPerSubject = Math.max(1, Math.round(params.days / params.subjects));
  const outline = [
    `Total study budget: ${totalHours.toFixed(0)}h over ${params.days} days.`,
    `~${hoursPerSubjectTotal.toFixed(1)}h per subject across ${params.subjects} subjects.`,
    `Rotate subjects every ${sessionsPerSubject} day(s) to avoid burnout.`,
    "End each week with a short mixed quiz.",
  ];
  return { hoursPerSubjectTotal, sessionsPerSubject, outline };
}

export function daysToCompleteSyllabus(params: {
  topics: number;
  topicsPerDay: number;
  bufferPercent?: number;
}): {
  baseDays: number;
  bufferedDays: number;
  weeks: number;
} | { error: string } {
  if (params.topics <= 0 || params.topicsPerDay <= 0) {
    return { error: "Topics and topics/day must be positive." };
  }
  const buffer = (params.bufferPercent ?? 15) / 100;
  const baseDays = Math.ceil(params.topics / params.topicsPerDay);
  const bufferedDays = Math.ceil(baseDays * (1 + buffer));
  return { baseDays, bufferedDays, weeks: bufferedDays / 7 };
}

export function revisionPlanner(params: {
  topics: number;
  revisions: number;
  daysUntilExam: number;
}): {
  topicsPerDay: number;
  cycleDays: number;
  scheduleNote: string;
} | { error: string } {
  if (params.topics <= 0 || params.revisions <= 0 || params.daysUntilExam <= 0) {
    return { error: "Topics, revisions, and days must be positive." };
  }
  const totalPasses = params.topics * params.revisions;
  const topicsPerDay = totalPasses / params.daysUntilExam;
  const cycleDays = Math.max(1, Math.floor(params.daysUntilExam / params.revisions));
  return {
    topicsPerDay,
    cycleDays,
    scheduleNote: `Aim for ${params.revisions} full pass(es); each cycle ≈ ${cycleDays} day(s). ~${topicsPerDay.toFixed(1)} topic-reviews/day.`,
  };
}

/** Days from today (UTC date) to exam ISO date YYYY-MM-DD. */
export function examCountdown(params: {
  examDateIso: string;
  todayIso?: string;
}): {
  daysLeft: number;
  weeksLeft: number;
  status: "upcoming" | "today" | "past";
} | { error: string } {
  const exam = Date.parse(params.examDateIso + "T00:00:00Z");
  if (!Number.isFinite(exam)) return { error: "Use exam date as YYYY-MM-DD." };
  const todayStr = params.todayIso ?? new Date().toISOString().slice(0, 10);
  const today = Date.parse(todayStr + "T00:00:00Z");
  if (!Number.isFinite(today)) return { error: "Invalid today date." };
  const daysLeft = Math.round((exam - today) / 86_400_000);
  const status = daysLeft > 0 ? "upcoming" : daysLeft === 0 ? "today" : "past";
  return { daysLeft, weeksLeft: daysLeft / 7, status };
}
