import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/lib/types";

const ACCENT: Record<BlogPost["accent"], string> = {
  cyan: "from-accent-cyan/25",
  blue: "from-accent-blue/25",
  purple: "from-accent-purple/25",
  pink: "from-accent-pink/25",
};

export function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/insights/${post.slug}`}
      className="focus-ring group block overflow-hidden rounded-3xl border border-border bg-panel/50 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent-cyan/30"
    >
      <div
        className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${ACCENT[post.accent]} via-background to-background`}
      >
        <div className="absolute inset-0 bg-grid-pattern bg-[size:24px_24px] opacity-15" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-semibold uppercase tracking-wider text-accent-cyan">
            {post.category}
          </span>
          <span>{date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan">
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
