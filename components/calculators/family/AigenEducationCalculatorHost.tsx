"use client";

import { computeAigenEducation, type AigenEducationSlug } from "@/lib/calculators/aigenEducation";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

function studyFields(topic = "physics", level = "intermediate", days = "14", hours = "2") {
  return {
    fields: [
      { key: "A" as const, label: "Subject / topic", def: topic },
      { key: "B" as const, label: "Level", def: level },
      { key: "D" as const, label: "Days", def: days },
      { key: "H" as const, label: "Hours / day", def: hours },
      { key: "C" as const, label: "Audience", def: "students" },
    ],
    build: (v: Record<string, string>) => ({
      topic: v.a,
      level: v.b,
      days: Number(v.d) || 14,
      hours: Number(v.h) || 2,
      audience: v.c,
    }),
  };
}

const CONFIG: Record<AigenEducationSlug, AigenHostConfig<AigenEducationSlug>> = {
  "aigen-study-plan-generator": {
    title: "Study Plan Generator",
    description: `Multi-day study plan outline. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields(),
  },
  "aigen-timetable-generator": {
    title: "Timetable Generator",
    description: `Weekly study timetable draft. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("chemistry", "beginner", "7", "1.5"),
  },
  "aigen-revision-plan-generator": {
    title: "Revision Plan Generator",
    description: `Spaced revision passes before exams. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("biology", "intermediate", "10", "2"),
  },
  "aigen-exam-strategy-generator": {
    title: "Exam Strategy Generator",
    description: `In-exam timing and order strategy. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("math", "advanced", "1", "3"),
  },
  "aigen-notes-generator": {
    title: "Notes Generator",
    description: `Structured notes outline. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("photosynthesis", "beginner", "1", "1"),
  },
  "aigen-flashcards-generator": {
    title: "Flashcards Generator",
    description: `Q/A flashcard drafts. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("organic chemistry", "intermediate", "3", "1"),
  },
  "aigen-quiz-generator": {
    title: "Quiz Generator",
    description: `Short open quiz draft. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("world history", "intermediate", "1", "1"),
  },
  "aigen-mcq-generator": {
    title: "MCQ Generator",
    description: `Multiple-choice question templates. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("computer networks", "intermediate", "1", "1"),
  },
  "aigen-practice-question-generator": {
    title: "Practice Question Generator",
    description: `Warm-up to stretch practice set. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("calculus", "advanced", "2", "2"),
  },
  "aigen-concept-explanation-generator": {
    title: "Concept Explanation Generator",
    description: `Plain-English concept explainer plan. ${AIGEN_UI_DISCLAIMER}`,
    ...studyFields("recursion", "beginner", "1", "1"),
  },
};

export const AigenEducationCalculatorHost = createAigenSectionHost({
  name: "AigenEducationCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-study-plan-generator",
  compute: computeAigenEducation,
  idPrefix: "aigen-edu",
});
