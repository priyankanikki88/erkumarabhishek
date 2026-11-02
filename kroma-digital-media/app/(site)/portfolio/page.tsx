import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A look at the digital products, AI systems, apps and media experiences Kroma Digital Media builds for its clients.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10">
          <SectionHeading
            eyebrow="Our Work"
            title="Ideas We've Turned Into Digital Experiences."
          />
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted">
            The projects below are illustrative demo content, included to show
            how real Kroma Digital Media case studies will appear.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <PortfolioGrid />
        </div>
      </section>

      <CTASection />
    </>
  );
}
