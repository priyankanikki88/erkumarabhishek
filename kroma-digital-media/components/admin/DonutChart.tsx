export function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const circumference = 2 * Math.PI * 15.9155;

  const segments = data.reduce<Array<{ label: string; color: string; dash: number; offset: number }>>(
    (acc, d) => {
      const dash = (d.value / total) * circumference;
      const offset = acc.reduce((sum, s) => sum + s.dash, 0);
      return [...acc, { label: d.label, color: d.color, dash, offset }];
    },
    []
  );

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 36 36" className="h-36 w-36 -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        {segments.map((s) => (
          <circle
            key={s.label}
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke={s.color}
            strokeWidth="4"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted">{d.label}</span>
            <span className="font-semibold text-foreground">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
