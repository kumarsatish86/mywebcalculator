"use client";

import dynamic from "next/dynamic";

const HeroAmbientOrb = dynamic(
  () => import("./HeroAmbientOrb").then((mod) => ({ default: mod.HeroAmbientOrb })),
  { ssr: false, loading: () => null },
);

export function HeroOrbLazy() {
  return <HeroAmbientOrb />;
}
