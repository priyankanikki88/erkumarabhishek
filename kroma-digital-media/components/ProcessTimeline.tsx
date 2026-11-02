"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/data/content";

export function ProcessTimeline() {
  return (
    <div className="relative mt-16">
      <div className="absolute left-4 top-0 h-full w-px bg-border lg:left-1/2 lg:w-full lg:h-px lg:top-1/2" />
      <div className="grid gap-10 lg:grid-cols-6 lg:gap-6">
        {processSteps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative pl-10 lg:pl-0 lg:text-center"
          >
            <div className="absolute left-0 top-1 h-8 w-8 -translate-x-1/2 rounded-full border border-accent-cyan/40 bg-background shadow-glow-cyan lg:static lg:mx-auto lg:translate-x-0 lg:mb-4 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-accent-cyan" />
            </div>
            <p className="font-display text-xs font-semibold text-accent-cyan">
              {step.number}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
