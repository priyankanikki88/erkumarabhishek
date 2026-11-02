import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the Kroma Digital Media website and services.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <section className="container-page max-w-2xl pt-40 pb-24">
      <h1 className="font-display text-4xl font-bold text-foreground">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated: November 2026</p>
      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/80">
        <p>
          These placeholder terms govern your use of the Kroma Digital Media
          website. Replace this page with your finalized terms before
          launch, including service agreements, intellectual property terms
          and liability provisions specific to client engagements.
        </p>
        <p>
          By submitting a project request or quote through this site, you
          agree to be contacted by our team regarding your enquiry.
        </p>
      </div>
    </section>
  );
}
