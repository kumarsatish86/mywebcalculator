"use client";

import { Suspense } from "react";
import { ExamSuccessCenter } from "./ExamSuccessCenter";

export function ExamSuccessCenterClient() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4 rounded-xl border border-[var(--border)] p-8">
          <div className="h-8 w-2/3 rounded bg-[var(--border)]" />
          <div className="h-4 w-full rounded bg-[var(--border)]" />
          <div className="h-32 rounded bg-[var(--border)]" />
        </div>
      }
    >
      <ExamSuccessCenter />
    </Suspense>
  );
}
