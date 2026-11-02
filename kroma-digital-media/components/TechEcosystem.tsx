import { technologyCategories } from "@/lib/data/content";

export function TechEcosystem() {
  const loop = [...technologyCategories, ...technologyCategories];
  return (
    <div className="relative mt-14 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max gap-4 animate-[scroll_32s_linear_infinite] hover:[animation-play-state:paused]">
        {loop.map((category, i) => (
          <div
            key={`${category}-${i}`}
            className="glass flex min-w-[220px] items-center justify-center rounded-2xl px-8 py-6 text-center"
          >
            <span className="font-display text-base font-semibold text-foreground/90">
              {category}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
