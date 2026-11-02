import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ServiceCard } from "@/components/ServiceCard";
import { CTASection } from "@/components/CTASection";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audio-visual production, web and mobile application development, custom software, AI solutions and digital transformation — all under one roof at Kroma Digital Media.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10">
          <SectionHeading
            eyebrow="Services"
            title="Everything You Need to Go Digital."
            description="Technology, creativity and intelligence under one roof."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
