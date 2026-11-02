import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Kroma Digital Media collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-page max-w-2xl pt-40 pb-24">
      <h1 className="font-display text-4xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated: November 2026</p>
      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/80">
        <p>
          Kroma Digital Media (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
          your privacy. This page outlines, at a placeholder level, how
          information submitted through our contact and quote forms is
          collected and used. Replace this page with your finalized legal
          policy before launch.
        </p>
        <p>
          We collect the information you provide through our forms (name,
          company, email, phone, project details) solely to respond to your
          enquiry and provide relevant services. We do not sell your
          information to third parties.
        </p>
        <p>
          For questions about this policy, contact us through the{" "}
          <a href="/contact" className="text-accent-cyan hover:underline">
            Contact page
          </a>
          .
        </p>
      </div>
    </section>
  );
}
