import { Users, Inbox, FileText, Briefcase, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart } from "@/components/admin/BarChart";
import { DonutChart } from "@/components/admin/DonutChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  dashboardStats,
  leads,
  leadsBySource,
  monthlyLeadTrend,
} from "@/lib/data/admin";

export default function AdminOverviewPage() {
  const recentLeads = leads.slice(0, 5);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Overview
        </h1>
        <p className="text-sm text-muted">
          Mock data for demonstration — connect this dashboard to the backend
          to see live numbers.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Leads" value={dashboardStats.totalLeads} icon={Users} trend={{ value: "12%", positive: true }} />
        <StatCard label="New Enquiries" value={dashboardStats.newEnquiries} icon={Inbox} trend={{ value: "8%", positive: true }} />
        <StatCard label="Quote Requests" value={dashboardStats.quoteRequests} icon={FileText} trend={{ value: "5%", positive: true }} />
        <StatCard label="Projects" value={dashboardStats.projects} icon={Briefcase} />
        <StatCard label="Conversion Rate" value={dashboardStats.conversionRate} icon={TrendingUp} trend={{ value: "2.1%", positive: true }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-panel/60 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Leads This Half-Year
          </h2>
          <div className="mt-6">
            <BarChart data={monthlyLeadTrend} />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel/60 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Leads by Source
          </h2>
          <div className="mt-6">
            <DonutChart data={leadsBySource} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-panel/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent Leads
          </h2>
          <a href="/admin/leads" className="focus-ring text-sm font-medium text-accent-cyan hover:underline">
            View all
          </a>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Company</th>
                <th className="py-3 pr-4">Project Type</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{lead.name}</td>
                  <td className="py-3 pr-4 text-muted">{lead.company}</td>
                  <td className="py-3 pr-4 text-muted">{lead.projectType}</td>
                  <td className="py-3 pr-4"><StatusBadge status={lead.status} /></td>
                  <td className="py-3 pr-4 text-muted">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
