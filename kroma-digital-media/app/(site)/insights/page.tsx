import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BlogCard } from "@/components/BlogCard";
import { CTASection } from "@/components/CTASection";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on AI, technology, digital transformation, software, web development, mobile apps, audio-visual production and business automation from Kroma Digital Media.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10">
          <SectionHeading eyebrow="Insights" title="Ideas Worth Sharing." />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
