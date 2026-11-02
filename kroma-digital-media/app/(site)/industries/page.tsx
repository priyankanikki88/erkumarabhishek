import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { IndustryCard } from "@/components/IndustryCard";
import { CTASection } from "@/components/CTASection";
import { industries } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Digital solutions tailored for startups, media & entertainment, real estate, education, healthcare, retail, finance, hospitality, manufacturing and more.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10">
          <SectionHeading
            eyebrow="Industries"
            title="Digital Solutions Across Industries."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
