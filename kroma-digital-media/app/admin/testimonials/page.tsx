import { Plus, Star } from "lucide-react";

const testimonials = [
  { name: "Ritika Sharma", company: "Verve Retail", quote: "Kroma rebuilt our storefront and our page speed finally matches our brand.", rating: 5 },
  { name: "Arjun Mehta", company: "Northwind Logistics", quote: "They understood our operations before writing a single line of code.", rating: 5 },
  { name: "Sana Fatima", company: "Lumen Clinic", quote: "The mobile app just works — even for our least tech-savvy staff.", rating: 4 },
];

export default function AdminTestimonialsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Testimonials
          </h1>
          <p className="text-sm text-muted">
            Client quotes available to feature across the website.
          </p>
        </div>
        <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-4 py-2.5 text-sm font-semibold text-background">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-border bg-panel/60 p-5">
            <div className="flex gap-1 text-accent-cyan">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5" fill={i < t.rating ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted">{t.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
