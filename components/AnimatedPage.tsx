import type { ReactNode } from "react";

type AnimatedPageProps = {
  children: ReactNode;
  className?: string;
};

/** Server wrapper — avoids framer-motion on hub/legal shells for lower TBT and faster LCP. */
export function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  return <div className={className}>{children}</div>;
}
