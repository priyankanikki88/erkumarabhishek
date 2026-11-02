"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/ai-solutions", label: "AI Solutions" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/industries", label: "Industries" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={clsx(
          "container-page relative z-50 flex items-center justify-between rounded-2xl transition-all duration-500",
          scrolled ? "glass px-4 py-2.5 shadow-card backdrop-blur-xl" : "px-2"
        )}
      >
        <Link href="/" className="focus-ring flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-wide text-foreground">
            KROMA
          </span>
          <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted sm:inline">
            Digital Media
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/quote"
            className="focus-ring group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-5 py-2.5 text-sm font-semibold text-background shadow-glow transition-transform duration-300 hover:-translate-y-0.5"
          >
            Start a Project
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex h-full flex-col justify-center gap-2 pb-24 pt-24">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring block rounded-xl px-4 py-3.5 text-2xl font-display font-medium text-foreground/90 hover:bg-white/[0.06]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple px-5 py-4 text-base font-semibold text-background"
              >
                Start a Project →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
