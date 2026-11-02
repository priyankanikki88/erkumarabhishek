import type { Metadata } from "next";
import {
  Bot,
  LineChart,
  Repeat,
  ShoppingCart,
  Users,
  Video,
} from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CTASection } from "@/components/CTASection";
import { LinkButton } from "@/components/Button";
import { solutions } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Business automation, customer management, digital commerce, data & analytics, AI & automation and media & content solutions built around real business problems.",
  alternates: { canonical: "/solutions" },
};

const ICONS = [Repeat, Users, ShoppingCart, LineChart, Bot, Video];

export default function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10">
          <SectionHeading
            eyebrow="Solutions"
            title="Solutions Built Around Real Business Problems."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={solution.id}
                className="group relative overflow-hidden rounded-3xl border border-border bg-panel/50 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent-blue/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 text-accent-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {solution.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="container-page mt-14 text-center">
          <LinkButton href="/quote" variant="primary">
            Transform Your Business
          </LinkButton>
        </div>
      </section>

      <CTASection />
    </>
  );
}
