import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { WhyCard } from "@/components/WhyCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { CTASection } from "@/components/CTASection";
import { whyKroma } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kroma Digital Media is a technology and digital media company bringing together creativity, software engineering, digital media and AI to build scalable digital products.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-20">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
            About Us
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            We Are Kroma Digital Media.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Kroma Digital Media is a technology and digital media company
            focused on building meaningful digital experiences and
            intelligent solutions.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We bring together creativity, software engineering, digital media
            and artificial intelligence to help businesses turn ideas into
            scalable digital products.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-6 sm:grid-cols-2">
          <div className="glass rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
              Mission
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-foreground">
              &ldquo;To make technology more creative, intelligent and
              accessible.&rdquo;
            </p>
          </div>
          <div className="glass rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-purple">
              Vision
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-foreground">
              &ldquo;To become a trusted digital innovation partner for
              businesses worldwide.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Why Kroma" title="Why Businesses Choose Kroma" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyKroma.map((item, i) => (
              <WhyCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading eyebrow="How We Work" title="From Idea to Impact." />
          <ProcessTimeline />
        </div>
      </section>

      <CTASection />
    </>
  );
}
