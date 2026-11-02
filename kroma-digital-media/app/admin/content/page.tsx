import { Pencil, Plus, Trash2 } from "lucide-react";
import { blogPosts } from "@/lib/data/blog";

export default function AdminContentPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Blog / Articles
          </h1>
          <p className="text-sm text-muted">
            CMS-ready structure for the Insights section — each row maps to a
            page at /insights/[slug].
          </p>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-4 py-2.5 text-sm font-semibold text-background">
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-panel/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr key={post.slug} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 font-medium text-foreground">{post.title}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-accent-cyan">
                    {post.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">{post.date}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button className="focus-ring rounded-lg p-2 text-muted hover:bg-white/[0.06] hover:text-foreground" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="focus-ring rounded-lg p-2 text-muted hover:bg-rose-500/10 hover:text-rose-400" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
