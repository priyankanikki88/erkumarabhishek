"use client";

import { memo } from "react";

type AnimatedBackgroundProps = {
  variant?: "hero" | "section" | "grid-only";
  className?: string;
};

function AnimatedBackgroundBase({
  variant = "section",
  className = "",
}: AnimatedBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-[0.25] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />

      {variant !== "grid-only" && (
        <>
          <div className="absolute left-[-10%] top-[-10%] h-[42rem] w-[42rem] rounded-full bg-accent-blue/20 blur-[120px] animate-drift" />
          <div className="absolute right-[-15%] top-[10%] h-[36rem] w-[36rem] rounded-full bg-accent-purple/20 blur-[120px] animate-drift [animation-delay:3s]" />
          <div className="absolute bottom-[-20%] left-[20%] h-[34rem] w-[34rem] rounded-full bg-accent-cyan/10 blur-[120px] animate-drift [animation-delay:6s]" />
        </>
      )}

      {variant === "hero" && (
        <div className="absolute inset-0">
          {HERO_DOTS.map((dot, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-accent-cyan/70 shadow-glow-cyan animate-float-slow"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                animationDelay: dot.delay,
                opacity: dot.opacity,
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

const HERO_DOTS = [
  { top: "15%", left: "12%", size: "6px", delay: "0s", opacity: 0.8 },
  { top: "28%", left: "82%", size: "4px", delay: "1.2s", opacity: 0.6 },
  { top: "62%", left: "20%", size: "5px", delay: "2.1s", opacity: 0.7 },
  { top: "72%", left: "68%", size: "7px", delay: "0.6s", opacity: 0.5 },
  { top: "40%", left: "48%", size: "4px", delay: "1.8s", opacity: 0.9 },
  { top: "18%", left: "60%", size: "3px", delay: "2.6s", opacity: 0.6 },
  { top: "85%", left: "40%", size: "5px", delay: "0.9s", opacity: 0.5 },
];

export const AnimatedBackground = memo(AnimatedBackgroundBase);
