import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/industries", label: "Industries" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services#audio-visual", label: "Audio Visual" },
  { href: "/services#web-development", label: "Web Applications" },
  { href: "/services#mobile-development", label: "Mobile Applications" },
  { href: "/services#software-solutions", label: "Software" },
  { href: "/ai-solutions", label: "AI Solutions" },
  { href: "/solutions", label: "Digital Transformation" },
];

const socials = [
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "YouTube", icon: Youtube },
  { href: "#", label: "Facebook", icon: Facebook },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">
              KROMA <span className="text-muted">DIGITAL MEDIA</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted">
              &ldquo;We Create. We Innovate. We Digitize.&rdquo;
            </p>
            <p className="mt-6 text-sm text-muted">
              From Media to Software. From Software to AI.
              <br />
              We Build What&apos;s Next.
            </p>
          </div>

          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Services" links={serviceLinks} />

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Connect
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="focus-ring glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-accent-cyan"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/quote"
                className="focus-ring text-sm font-semibold text-accent-cyan hover:underline"
              >
                Request a Quote →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Kroma Digital Media. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="focus-ring hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="focus-ring hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
