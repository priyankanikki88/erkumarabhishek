import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kroma Digital Media to discuss your next web, mobile, software, AI or audio-visual project.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      <AnimatedBackground variant="section" />
      <div className="container-page relative z-10 grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
            Contact
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Let&apos;s Talk About Your Project.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            Share a few details below and our team will get back to you to
            discuss how we can help.
          </p>

          <div className="mt-10 space-y-5">
            <ContactDetail icon={Mail} label="Email" value="hello@kromadigitalmedia.com" />
            <ContactDetail icon={Phone} label="Phone" value="+91 00000 00000" />
            <ContactDetail icon={MapPin} label="Location" value="India · Serving clients globally" />
          </div>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-accent-cyan">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
