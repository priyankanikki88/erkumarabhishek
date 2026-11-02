import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple text-background shadow-glow hover:shadow-glow-purple hover:-translate-y-0.5",
  secondary:
    "glass text-foreground hover:border-accent-cyan/40 hover:-translate-y-0.5",
  ghost: "text-foreground/90 hover:text-accent-cyan",
};

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  withArrow?: boolean;
};

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
  withArrow = true,
}: LinkButtonProps) {
  return (
    <Link href={href} className={clsx(base, variants[variant], className)}>
      {children}
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function SubmitButton({
  variant = "primary",
  className,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
