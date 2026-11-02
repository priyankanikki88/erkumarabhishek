import { LinkButton } from "@/components/Button";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <AnimatedBackground variant="section" />
      <div className="container-page relative z-10 text-center">
        <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
          Have an Idea? Let&apos;s Build It.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
          Whether you&apos;re launching a startup, transforming an existing
          business or creating something completely new, Kroma Digital Media
          can help turn your vision into reality.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton href="/quote" variant="primary">
            Start a Project
          </LinkButton>
          <LinkButton href="/contact" variant="secondary" withArrow={false}>
            Talk to Us →
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
