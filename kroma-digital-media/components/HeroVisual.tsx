"use client";

import { motion } from "framer-motion";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
};

const NODES: Node[] = [
  { id: "ai", label: "AI", x: 50, y: 10, color: "#4df0ff" },
  { id: "cloud", label: "Cloud", x: 85, y: 28, color: "#5b7fff" },
  { id: "mobile", label: "Mobile", x: 88, y: 68, color: "#9b6bff" },
  { id: "web", label: "Web", x: 62, y: 92, color: "#4df0ff" },
  { id: "software", label: "Software", x: 30, y: 92, color: "#5b7fff" },
  { id: "av", label: "Audio Visual", x: 8, y: 66, color: "#ff6bd6" },
  { id: "data", label: "Data", x: 10, y: 28, color: "#9b6bff" },
  { id: "automation", label: "Automation", x: 50, y: 50, color: "#4df0ff" },
];

const EDGES: [string, string][] = [
  ["ai", "automation"],
  ["cloud", "automation"],
  ["mobile", "automation"],
  ["web", "automation"],
  ["software", "automation"],
  ["av", "automation"],
  ["data", "automation"],
  ["ai", "cloud"],
  ["cloud", "mobile"],
  ["mobile", "web"],
  ["web", "software"],
  ["software", "av"],
  ["av", "data"],
  ["data", "ai"],
];

function byId(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-0 rounded-full bg-glow-radial blur-2xl" />
      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4df0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9b6bff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {EDGES.map(([a, b], i) => {
          const from = byId(a);
          const to = byId(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#edge-gradient)"
              strokeWidth="0.35"
              strokeDasharray="2 2"
              className="animate-[dash_6s_linear_infinite]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          );
        })}

        {NODES.map((node, i) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.id === "automation" ? 4.5 : 3.2}
              fill={node.color}
              opacity={0.18}
              className="animate-pulse-glow"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.id === "automation" ? 1.8 : 1.3}
              fill={node.color}
            />
          </g>
        ))}
      </svg>

      {NODES.map((node, i) => (
        <div
          key={node.id}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: `translate(-50%, ${node.id === "automation" ? 36 : 28}px)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 * i }}
            className="whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[0.65rem] font-medium text-foreground/80 backdrop-blur-sm"
          >
            {node.label}
          </motion.div>
        </div>
      ))}

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </div>
  );
}
