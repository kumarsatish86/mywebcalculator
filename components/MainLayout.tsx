import type { ReactNode } from "react";
import { SiteBackground } from "./SiteBackground";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteBackground />
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
      <Footer />
    </>
  );
}
