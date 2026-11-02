import { Pencil, Plus, Trash2 } from "lucide-react";
import { portfolioProjects } from "@/lib/data/portfolio";

export default function AdminPortfolioPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Portfolio Management
          </h1>
          <p className="text-sm text-muted">
            Manage the projects shown on the public Portfolio page.
          </p>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-4 py-2.5 text-sm font-semibold text-background">
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-panel/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Tagline</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolioProjects.map((project) => (
              <tr key={project.slug} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 font-medium text-foreground">{project.title}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-accent-cyan">
                    {project.category}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">{project.tagline}</td>
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
