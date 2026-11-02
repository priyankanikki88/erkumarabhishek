import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PortfolioProject } from "@/lib/types";

const ACCENT_GRADIENTS: Record<PortfolioProject["accent"], string> = {
  cyan: "from-accent-cyan/30 via-background to-background",
  blue: "from-accent-blue/30 via-background to-background",
  purple: "from-accent-purple/30 via-background to-background",
  pink: "from-accent-pink/30 via-background to-background",
};

export function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="focus-ring group block overflow-hidden rounded-3xl border border-border bg-panel/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-cyan/30"
    >
      <div
        className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${ACCENT_GRADIENTS[project.accent]}`}
      >
        <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-20" />
        <span className="relative rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/70 backdrop-blur-sm">
          Demo Project
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-accent-cyan">
            {project.category}
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-cyan" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="rounded-full border border-border px-2.5 py-1 text-[0.7rem] text-foreground/60"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
