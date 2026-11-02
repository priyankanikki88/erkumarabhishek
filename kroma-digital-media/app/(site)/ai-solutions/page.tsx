import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AIArchitecture } from "@/components/AIArchitecture";
import { LinkButton } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { aiFeatures } from "@/lib/data/content";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "AI Solutions",
  description:
    "AI agents, AI automation, AI assistants, AI analytics, generative AI and custom AI products — practical AI solutions built around your business.",
  alternates: { canonical: "/ai-solutions" },
};

const aiService = services.find((s) => s.id === "ai-solutions")!;

export default function AISolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-20">
        <AnimatedBackground variant="hero" />
        <div className="container-page relative z-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple">
            AI Solutions
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            AI Is Not the Future.{" "}
            <span className="text-gradient">It&apos;s Your Competitive
            Advantage Today.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Kroma Digital Media helps businesses move beyond AI
            experimentation and build practical AI-powered products,
            automation systems and intelligent workflows.
          </p>
          <div className="mt-8">
            <LinkButton href="/quote">Build an AI Solution</LinkButton>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <AIArchitecture />
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Capabilities"
            title="Six Ways We Put AI to Work."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feature) => (
              <div
                key={feature.id}
                className="group relative overflow-hidden rounded-3xl border border-accent-purple/20 bg-panel/50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent-purple/40 hover:shadow-glow-purple"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Full Scope"
            title="Everything Inside Our AI Practice."
          />
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {aiService.bullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-foreground/80"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  );
}
