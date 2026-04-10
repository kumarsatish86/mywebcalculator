import { HeroSection } from "@/components/HeroSection";
import { FeaturedCalculators } from "@/components/FeaturedCalculators";
import { CategoryPreviews } from "@/components/CategoryPreviews";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCalculators />
      <CategoryPreviews />
    </>
  );
}
