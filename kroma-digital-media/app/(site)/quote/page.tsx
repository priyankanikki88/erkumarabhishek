import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell Kroma Digital Media about your project — service, timeline and budget — and receive a tailored quote.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      <AnimatedBackground variant="section" />
      <div className="container-page relative z-10 mx-auto max-w-3xl">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple">
            Request a Quote
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Let&apos;s Scope Your Project.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Share your project details and we&apos;ll come back with a
            tailored quote and recommended approach.
          </p>
        </div>

        <div className="glass mt-12 rounded-3xl p-6 sm:p-10">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
