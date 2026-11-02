import { PortfolioProject } from "@/lib/types";

// Demo content — replace with real Kroma Digital Media projects.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "nimbus-ai-concierge",
    title: "Nimbus AI Concierge",
    category: "AI",
    tagline: "A generative AI concierge for a hospitality group.",
    description:
      "An AI assistant that handles guest queries, bookings and upsells across web and WhatsApp.",
    capabilities: ["AI Agents", "Generative AI", "NLP", "WhatsApp Integration"],
    challenge:
      "A multi-property hospitality group was losing bookings to slow response times across phone, email and WhatsApp, with staff repeating the same answers hundreds of times a day.",
    solution:
      "We designed and built an AI concierge grounded in each property's live inventory and policies, capable of answering guest questions, suggesting upgrades and handing off to a human when needed.",
    technology: ["Generative AI", "Vector Search", "WhatsApp API", "Cloud Functions"],
    process:
      "Discovery workshops with front-desk teams, conversation design, a grounded retrieval pipeline, then a phased rollout starting with one property before scaling group-wide.",
    result:
      "Response time dropped from hours to seconds, with a measurable lift in direct bookings during the pilot quarter.",
    accent: "cyan",
  },
  {
    slug: "orbit-commerce-platform",
    title: "Orbit Commerce Platform",
    category: "Web",
    tagline: "A headless commerce platform for a multi-brand retailer.",
    description:
      "A composable storefront built for speed, built to scale across multiple brands from one codebase.",
    capabilities: ["Web Application", "E-commerce", "API Architecture", "Cloud Integration"],
    challenge:
      "The retailer ran three separate storefronts on outdated templates, each slow to update and impossible to scale consistently.",
    solution:
      "We consolidated the brands onto a single headless commerce architecture with shared components and brand-specific theming, connected to their existing inventory systems.",
    technology: ["Next.js", "Headless CMS", "Cloud Hosting", "Payment Integration"],
    process:
      "An audit of existing storefronts, a unified design system, incremental migration brand-by-brand to avoid downtime.",
    result:
      "Page load times improved significantly and the team now ships new landing pages in days instead of weeks.",
    accent: "blue",
  },
  {
    slug: "fieldworks-ops-app",
    title: "FieldWorks Ops App",
    category: "Mobile",
    tagline: "A field-service mobile app for a facilities management company.",
    description:
      "An offline-first mobile app that lets technicians manage jobs, parts and reports from anywhere.",
    capabilities: ["Mobile App", "Offline Sync", "Enterprise Mobile", "UI/UX"],
    challenge:
      "Field technicians relied on paper job sheets, leading to delayed reporting and lost paperwork.",
    solution:
      "A cross-platform mobile app with offline-first data sync, digital job sheets and photo-based reporting that syncs the moment a connection is available.",
    technology: ["Cross-platform Mobile", "Offline Storage", "Cloud Sync", "Push Notifications"],
    process:
      "Shadowing technicians on-site, prototyping the offline flow first, then piloting with one regional team before a full rollout.",
    result:
      "Reporting turnaround moved from days to minutes, with significantly fewer missed job updates.",
    accent: "purple",
  },
  {
    slug: "ledgerline-erp",
    title: "LedgerLine ERP Module",
    category: "Software",
    tagline: "A custom ERP module for a manufacturing business.",
    description:
      "A production-tracking module that replaced three disconnected spreadsheets with one live system.",
    capabilities: ["Custom Software", "ERP", "Workflow Automation", "Internal Tools"],
    challenge:
      "Production data lived in disconnected spreadsheets, making it hard to track delays or inventory in real time.",
    solution:
      "A custom ERP module covering production tracking, inventory and reporting, integrated with their existing accounting software.",
    technology: ["Custom Backend", "Relational Database", "Internal Dashboards", "API Integration"],
    process:
      "Mapping the existing manual workflow, building in stages with floor supervisors testing each release.",
    result:
      "Real-time visibility into production status, cutting reporting delays from days to hours.",
    accent: "cyan",
  },
  {
    slug: "pulse-brand-film",
    title: "Pulse Brand Film",
    category: "Audio Visual",
    tagline: "A cinematic brand film for a consumer tech launch.",
    description:
      "A 90-second brand film combining live production with motion graphics for a product launch campaign.",
    capabilities: ["Video Production", "Motion Graphics", "Post Production", "Social Content"],
    challenge:
      "The client needed a launch film that could work as a hero asset across TV, social and in-store screens on a tight timeline.",
    solution:
      "A combined live-action and motion graphics production, edited into multiple cuts optimized for each platform.",
    technology: ["4K Production", "Motion Graphics", "Color Grading", "Multi-format Editing"],
    process:
      "Concept and script development, a two-day shoot, then parallel editing and motion graphics production.",
    result:
      "The film became the campaign's top-performing creative across paid social channels.",
    accent: "pink",
  },
  {
    slug: "clarity-insights-dashboard",
    title: "Clarity Insights Dashboard",
    category: "AI",
    tagline: "An AI-powered analytics dashboard for a retail chain.",
    description:
      "A dashboard that turns raw sales and footfall data into plain-language insights for store managers.",
    capabilities: ["AI Data Analysis", "Analytics", "Recommendation Systems", "Dashboards"],
    challenge:
      "Store managers were drowning in raw data exports with no time to interpret them before decisions had to be made.",
    solution:
      "An analytics layer that summarizes trends in plain language and recommends specific actions, surfaced in a simple dashboard.",
    technology: ["Data Pipelines", "AI Analytics", "Cloud Warehouse", "Dashboarding"],
    process:
      "Data audit, defining the handful of metrics that actually drive decisions, then building the summarization layer on top.",
    result:
      "Store teams now review performance in minutes instead of hours each week.",
    accent: "blue",
  },
];

export const portfolioCategories: Array<PortfolioProject["category"] | "All"> = [
  "All",
  "AI",
  "Web",
  "Mobile",
  "Software",
  "Audio Visual",
];
