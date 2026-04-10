import { CategoryPreviewCards } from "@/components/CategoryPreviewCards";
import { SectionHeading } from "@/components/SectionHeading";

export function CategoryPreviews() {
  return (
    <section className="mt-20 space-y-10 md:mt-28">
      <SectionHeading
        eyebrow="Categories"
        title="Three doors in"
        subtitle="Every tool lives in a category hub so you can browse instead of searching."
      />
      <CategoryPreviewCards />
    </section>
  );
}
