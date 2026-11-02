import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CTASection } from "@/components/CTASection";
import { portfolioProjects } from "@/lib/data/portfolio";

export function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

const STAGES: Array<{
  key: "challenge" | "solution" | "process" | "result";
  label: string;
}> = [
  { key: "challenge", label: "Challenge" },
  { key: "solution", label: "Solution" },
  { key: "process", label: "Process" },
  { key: "result", label: "Result" },
];

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10 max-w-3xl">
          <Link
            href="/portfolio"
            className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          <p className="mt-6 inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-cyan">
            {project.category} · Demo Project
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-border px-3 py-1 text-xs text-foreground/70"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className="rounded-3xl border border-border bg-panel/50 p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
                {stage.label}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/85">
                {project[stage.key]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple">
            Technology
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technology.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
