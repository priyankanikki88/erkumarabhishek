export function BarChart({
  data,
}: {
  data: { month: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-56 items-end gap-3 sm:gap-5">
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-44 w-full items-end overflow-hidden rounded-lg bg-white/[0.03]">
            <div
              className="w-full rounded-lg bg-gradient-to-t from-accent-blue/70 to-accent-cyan/80 transition-all"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
