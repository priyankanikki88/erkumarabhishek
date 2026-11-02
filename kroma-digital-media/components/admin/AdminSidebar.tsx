"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Layers,
  MessageSquareQuote,
  Newspaper,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Contact Leads", icon: Users },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/portfolio", label: "Portfolio Management", icon: Briefcase },
  { href: "/admin/services", label: "Services Management", icon: Layers },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/content", label: "Blog / Articles", icon: Newspaper },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Website Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
      <div className="flex h-full flex-col px-4 py-6">
        <Link href="/admin" className="flex items-baseline gap-2 px-3">
          <span className="font-display text-lg font-bold">KROMA</span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-muted">
            Admin
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/[0.06] text-foreground"
                    : "text-muted hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="focus-ring mt-4 rounded-xl border border-border px-3 py-2.5 text-center text-sm font-medium text-muted hover:text-foreground"
        >
          ← Back to Website
        </Link>
      </div>
    </aside>
  );
}
