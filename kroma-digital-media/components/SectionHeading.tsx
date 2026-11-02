type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
