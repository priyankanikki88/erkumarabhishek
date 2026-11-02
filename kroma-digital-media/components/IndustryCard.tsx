import { IndustryItem } from "@/lib/types";
import {
  Banknote,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Hotel,
  Landmark,
  Rocket,
  ShoppingBag,
  Tv,
  Briefcase,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Rocket> = {
  startups: Rocket,
  "media-entertainment": Tv,
  "real-estate": Building2,
  education: GraduationCap,
  healthcare: HeartPulse,
  "retail-ecommerce": ShoppingBag,
  finance: Banknote,
  hospitality: Hotel,
  manufacturing: Factory,
  "professional-services": Briefcase,
  "government-organizations": Landmark,
};

export function IndustryCard({ industry }: { industry: IndustryItem }) {
  const Icon = ICON_MAP[industry.id] ?? Building2;
  return (
    <div className="group relative flex h-full flex-col rounded-3xl border border-border bg-panel/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent-cyan/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-accent-cyan">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
        {industry.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {industry.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {industry.solutions.map((s) => (
          <li
            key={s}
            className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-foreground/70"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
