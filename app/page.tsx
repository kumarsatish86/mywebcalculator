import { HomeSearchHero } from "@/components/home/HomeSearchHero";
import { FeaturedCalculators } from "@/components/FeaturedCalculators";
import { CategoryPreviews } from "@/components/CategoryPreviews";

export default function Home() {
  return (
    <>
      <HomeSearchHero />
      <FeaturedCalculators />
      <CategoryPreviews />
    </>
  );
}
