"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { ServiceItem } from "@/lib/types";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div
      id={service.id}
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-panel/60 p-7 transition-all duration-500 hover:-translate-y-1.5",
        service.featured
          ? "border-accent-purple/30 shadow-glow-purple lg:col-span-2"
          : "hover:border-accent-cyan/30 hover:shadow-glow-cyan"
      )}
    >
      <div
        className={clsx(
          "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100",
          service.featured ? "bg-accent-purple/30" : "bg-accent-cyan/20"
        )}
      />

      <div className="relative z-10 flex items-start justify-between">
        <span className="font-display text-sm font-semibold text-muted">
          {service.number}
        </span>
        {service.featured && (
          <span className="rounded-full border border-accent-purple/40 bg-accent-purple/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-purple">
            Most Requested
          </span>
        )}
      </div>

      <h3 className="relative z-10 mt-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
        {service.title}
      </h3>
      <p className="relative z-10 mt-3 text-sm leading-relaxed text-muted">
        {service.description}
      </p>

      <ul className="relative z-10 mt-5 flex flex-wrap gap-2">
        {service.bullets.slice(0, service.featured ? 12 : 6).map((bullet) => (
          <li
            key={bullet}
            className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-foreground/70"
          >
            {bullet}
          </li>
        ))}
      </ul>

      <Link
        href={service.href}
        className="focus-ring group relative z-10 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cyan"
      >
        {service.cta}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
    </div>
  );
}
