"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { leads, LeadStatus } from "@/lib/data/admin";

const STATUSES: Array<LeadStatus | "All"> = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

export default function AdminLeadsPage() {
  const [status, setStatus] = useState<LeadStatus | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = status === "All" || lead.status === status;
      const matchesQuery =
        query.trim().length === 0 ||
        `${lead.name} ${lead.company} ${lead.email}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [status, query]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Contact Leads
        </h1>
        <p className="text-sm text-muted">
          Enquiries submitted through the website&apos;s Contact page. Mock
          data — connect to the backend for live leads.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="focus-ring w-full rounded-xl border border-border bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted/70"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-panel/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Project Type</th>
              <th className="px-5 py-3">Budget</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-muted">{lead.id}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted">{lead.email}</p>
                </td>
                <td className="px-5 py-3 text-muted">{lead.company}</td>
                <td className="px-5 py-3 text-muted">{lead.projectType}</td>
                <td className="px-5 py-3 text-muted">{lead.budget}</td>
                <td className="px-5 py-3 text-muted">{lead.source}</td>
                <td className="px-5 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-5 py-3 text-muted">{lead.date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
