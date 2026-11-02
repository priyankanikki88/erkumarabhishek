import { StatusBadge } from "@/components/admin/StatusBadge";
import { quoteRequests } from "@/lib/data/admin";

export default function AdminQuotesPage() {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Quote Requests
        </h1>
        <p className="text-sm text-muted">
          Submissions from the Request a Quote page. Mock data — connect to
          the backend for live requests.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-panel/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Timeline</th>
              <th className="px-5 py-3">Budget</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {quoteRequests.map((q) => (
              <tr key={q.id} className="border-b border-border/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 font-medium text-foreground">{q.id}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{q.name}</p>
                  <p className="text-xs text-muted">{q.company}</p>
                </td>
                <td className="px-5 py-3 text-muted">{q.service}</td>
                <td className="px-5 py-3 text-muted">{q.timeline}</td>
                <td className="px-5 py-3 text-muted">{q.budget}</td>
                <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                <td className="px-5 py-3 text-muted">{q.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
