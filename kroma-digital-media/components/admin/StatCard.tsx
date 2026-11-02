import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel/60 p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-accent-cyan">
          <Icon className="h-4 w-4" />
        </span>
        {trend && (
          <span
            className={clsx(
              "text-xs font-semibold",
              trend.positive ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
