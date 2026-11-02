import { WhyItem } from "@/lib/types";
import {
  Boxes,
  Layers,
  Puzzle,
  Rocket,
  Sparkles,
  Workflow,
} from "lucide-react";

const ICONS = [Sparkles, Boxes, Puzzle, Layers, Rocket, Workflow];

export function WhyCard({ item, index }: { item: WhyItem; index: number }) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-panel/50 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent-blue/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 text-accent-cyan">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {item.description}
      </p>
    </div>
  );
}
