"use client";

const LAYERS = [
  { label: "Input", items: ["Chat", "Voice", "Documents", "Data Streams"] },
  { label: "Intelligence", items: ["LLMs", "Agents", "Vision", "Retrieval"] },
  { label: "Action", items: ["Automation", "CRM", "Workflows", "Insights"] },
];

export function AIArchitecture() {
  return (
    <div className="relative rounded-3xl border border-border bg-panel/50 p-6 sm:p-10">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-glow-radial opacity-60" />
      <div className="grid gap-6 sm:grid-cols-3">
        {LAYERS.map((layer, idx) => (
          <div key={layer.label} className="relative">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-accent-cyan">
              {layer.label}
            </p>
            <div className="flex flex-col gap-3">
              {layer.items.map((item, i) => (
                <div
                  key={item}
                  className="glass rounded-xl px-4 py-3 text-center text-sm font-medium text-foreground/85 animate-float"
                  style={{ animationDelay: `${(idx + i) * 0.3}s` }}
                >
                  {item}
                </div>
              ))}
            </div>
            {idx < LAYERS.length - 1 && (
              <div className="absolute right-[-14px] top-1/2 hidden h-px w-7 bg-gradient-to-r from-accent-cyan/60 to-transparent sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
