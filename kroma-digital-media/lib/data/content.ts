import { AIFeature, IndustryItem, ProcessStep, SolutionItem, WhyItem } from "@/lib/types";

export const solutions: SolutionItem[] = [
  {
    id: "business-automation",
    title: "Business Automation",
    description: "Automate repetitive processes and improve productivity.",
  },
  {
    id: "customer-management",
    title: "Customer Management",
    description:
      "CRM platforms, customer portals and intelligent engagement systems.",
  },
  {
    id: "digital-commerce",
    title: "Digital Commerce",
    description:
      "E-commerce platforms, mobile commerce and payment integrations.",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    description: "Turn business data into useful insights.",
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    description: "Build intelligent workflows, agents and AI-powered products.",
  },
  {
    id: "media-content",
    title: "Media & Content",
    description: "Create engaging digital media experiences for modern audiences.",
  },
];

export const aiFeatures: AIFeature[] = [
  {
    id: "ai-agents",
    title: "AI Agents",
    description: "Autonomous digital workers for business processes.",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Reduce repetitive manual work.",
  },
  {
    id: "ai-assistants",
    title: "AI Assistants",
    description: "Intelligent customer and employee assistants.",
  },
  {
    id: "ai-analytics",
    title: "AI Analytics",
    description: "Convert complex data into actionable insights.",
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    description: "Create intelligent content and business applications.",
  },
  {
    id: "custom-ai-products",
    title: "Custom AI Products",
    description: "Build AI systems specifically around business requirements.",
  },
];

export const whyKroma: WhyItem[] = [
  {
    title: "Innovation",
    description:
      "We combine creativity, technology and emerging technologies to create future-ready solutions.",
  },
  {
    title: "One Digital Partner",
    description:
      "From media production to software and AI, everything can be handled under one roof.",
  },
  {
    title: "Custom Solutions",
    description:
      "We build solutions around your business instead of forcing your business into a template.",
  },
  {
    title: "Scalable Technology",
    description: "Our digital products are designed to grow with your business.",
  },
  {
    title: "AI-First Thinking",
    description:
      "We identify practical opportunities where AI and automation can create measurable value.",
  },
  {
    title: "End-to-End Execution",
    description: "From concept and design to development, deployment and support.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand the business, audience and problem.",
  },
  {
    number: "02",
    title: "Strategize",
    description: "Define the solution, technology and roadmap.",
  },
  {
    number: "03",
    title: "Design",
    description: "Create intuitive and engaging experiences.",
  },
  {
    number: "04",
    title: "Build",
    description: "Develop, integrate and test the solution.",
  },
  {
    number: "05",
    title: "Launch",
    description: "Deploy the product and make it production-ready.",
  },
  {
    number: "06",
    title: "Grow",
    description: "Optimize, automate and continuously improve.",
  },
];

export const industries: IndustryItem[] = [
  {
    id: "startups",
    title: "Startups",
    description: "Launch fast with lean, scalable digital foundations.",
    solutions: ["MVP Development", "Brand & Web Presence", "Automation"],
  },
  {
    id: "media-entertainment",
    title: "Media & Entertainment",
    description: "Content platforms and production tech for modern audiences.",
    solutions: ["Audio Visual Production", "Streaming Platforms", "Content Systems"],
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Digital experiences that showcase properties and close deals.",
    solutions: ["Property Platforms", "Virtual Tours", "CRM"],
  },
  {
    id: "education",
    title: "Education",
    description: "Learning platforms and tools that scale with every learner.",
    solutions: ["LMS Platforms", "Mobile Learning Apps", "AI Tutoring"],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Secure, reliable digital systems for care providers.",
    solutions: ["Patient Portals", "Appointment Systems", "Data Management"],
  },
  {
    id: "retail-ecommerce",
    title: "Retail & E-commerce",
    description: "Commerce experiences that convert across every device.",
    solutions: ["E-commerce Platforms", "Mobile Commerce", "AI Recommendations"],
  },
  {
    id: "finance",
    title: "Finance",
    description: "Robust platforms built for trust, compliance and scale.",
    solutions: ["Customer Portals", "Workflow Automation", "Analytics Dashboards"],
  },
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Guest experiences that feel as premium as the stay.",
    solutions: ["Booking Platforms", "Guest Apps", "Digital Marketing Content"],
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    description: "Operational software that keeps production moving.",
    solutions: ["ERP Integration", "Process Automation", "Internal Tools"],
  },
  {
    id: "professional-services",
    title: "Professional Services",
    description: "Client-facing platforms backed by efficient internal systems.",
    solutions: ["Client Portals", "CRM Systems", "Business Websites"],
  },
  {
    id: "government-organizations",
    title: "Government & Organizations",
    description: "Accessible, reliable digital services for the public.",
    solutions: ["Public Portals", "Document Systems", "Digital Transformation"],
  },
];

export const technologyCategories: string[] = [
  "Frontend",
  "Backend",
  "Mobile",
  "Cloud",
  "Database",
  "AI / ML",
  "Automation",
  "DevOps",
  "Analytics",
  "Media Technology",
];
