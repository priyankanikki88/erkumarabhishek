import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CTASection } from "@/components/CTASection";
import { blogPosts } from "@/lib/data/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    articleSection: post.category,
    author: { "@type": "Organization", name: "Kroma Digital Media" },
    publisher: { "@type": "Organization", name: "Kroma Digital Media" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <section className="relative overflow-hidden pt-40 pb-16">
        <AnimatedBackground variant="section" />
        <div className="container-page relative z-10 max-w-2xl">
          <Link
            href="/insights"
            className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Insights
          </Link>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-white/[0.05] px-3 py-1 font-semibold uppercase tracking-wider text-accent-cyan">
              {post.category}
            </span>
            <span>{date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page max-w-2xl space-y-5 text-base leading-relaxed text-foreground/80">
          <p>
            This article is placeholder content, structured so it can be
            managed from the Kroma Digital Media admin dashboard once the CMS
            is connected. Replace this section with the full article body,
            images and formatting for &ldquo;{post.title}&rdquo;.
          </p>
          <p>
            Each article in Insights carries a title, category, publish date,
            featured image and excerpt — the same fields the admin dashboard&apos;s
            Blog / Articles module will edit.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
