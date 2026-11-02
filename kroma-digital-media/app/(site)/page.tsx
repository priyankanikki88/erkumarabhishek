import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/Button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { HeroVisual } from "@/components/HeroVisual";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { WhyCard } from "@/components/WhyCard";
import { AIArchitecture } from "@/components/AIArchitecture";
import { TechEcosystem } from "@/components/TechEcosystem";
import { IndustryCard } from "@/components/IndustryCard";
import { PortfolioCard } from "@/components/PortfolioCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { CTASection } from "@/components/CTASection";
import { services } from "@/lib/data/services";
import { aiFeatures, industries, whyKroma } from "@/lib/data/content";
import { portfolioProjects } from "@/lib/data/portfolio";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-32">
        <AnimatedBackground variant="hero" />
        <div className="container-page relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted">
              Digital Media • Technology • Software • AI
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              We Build the{" "}
              <span className="text-gradient">Digital Future.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              From audio-visual experiences to intelligent AI solutions, web
              platforms, mobile applications and enterprise software — Kroma
              Digital Media transforms ideas into powerful digital products.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <LinkButton href="/quote" variant="primary">
                Start a Project
              </LinkButton>
              <LinkButton href="/services" variant="secondary" withArrow={false}>
                Explore Our Services
              </LinkButton>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Services"
            title="Everything You Need to Go Digital."
            description="Technology, creativity and intelligence under one roof."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY KROMA */}
      <section className="relative py-24">
        <AnimatedBackground variant="grid-only" />
        <div className="container-page relative z-10">
          <SectionHeading eyebrow="Why Kroma" title="Why Businesses Choose Kroma" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyKroma.map((item, i) => (
              <WhyCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* AI INNOVATION */}
      <section className="relative py-24">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple">
                AI Innovation
              </p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                AI Is Not the Future. It&apos;s Your Competitive Advantage
                Today.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                Kroma Digital Media helps businesses move beyond AI
                experimentation and build practical AI-powered products,
                automation systems and intelligent workflows.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-5">
                {aiFeatures.map((feature) => (
                  <li key={feature.id}>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
              <LinkButton href="/ai-solutions" className="mt-9">
                Build an AI Solution
              </LinkButton>
            </div>
            <AIArchitecture />
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="relative py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Technology"
            title="Technology Without Limits."
          />
          <TechEcosystem />
        </div>
      </section>

      {/* INDUSTRIES PREVIEW */}
      <section className="relative py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Industries"
            title="Digital Solutions Across Industries."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.slice(0, 4).map((industry) => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/industries" variant="secondary">
              View All Industries
            </LinkButton>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="relative py-24">
        <AnimatedBackground variant="grid-only" />
        <div className="container-page relative z-10">
          <SectionHeading
            eyebrow="Our Work"
            title="Ideas We've Turned Into Digital Experiences."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioProjects.slice(0, 3).map((project) => (
              <PortfolioCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <LinkButton href="/portfolio" variant="secondary">
              View Full Portfolio
            </LinkButton>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Process" title="From Idea to Impact." />
          <ProcessTimeline />
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="relative py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              We Are Kroma Digital Media.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              A technology and digital media company focused on building
              meaningful digital experiences and intelligent solutions — where
              media, software and AI meet.
            </p>
            <a
              href="/about"
              className="focus-ring mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan"
            >
              Learn more about us
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="glass rounded-3xl p-8">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-cyan">
              Mission
            </p>
            <p className="mt-2 text-lg text-foreground">
              &ldquo;To make technology more creative, intelligent and
              accessible.&rdquo;
            </p>
            <p className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-accent-purple">
              Vision
            </p>
            <p className="mt-2 text-lg text-foreground">
              &ldquo;To become a trusted digital innovation partner for
              businesses worldwide.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
