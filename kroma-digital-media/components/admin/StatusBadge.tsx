import clsx from "clsx";

const COLORS: Record<string, string> = {
  New: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  Contacted: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  Qualified: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  Converted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Lost: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Pending: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  Reviewed: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  Quoted: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  Won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        COLORS[status] ?? "bg-white/5 text-muted border-border"
      )}
    >
      {status}
    </span>
  );
}
