export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export type SolutionItem = {
  id: string;
  title: string;
  description: string;
};

export type AIFeature = {
  id: string;
  title: string;
  description: string;
};

export type IndustryItem = {
  id: string;
  title: string;
  description: string;
  solutions: string[];
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type WhyItem = {
  title: string;
  description: string;
};

export type PortfolioCategory =
  | "AI"
  | "Web"
  | "Mobile"
  | "Software"
  | "Audio Visual";

export type PortfolioProject = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  tagline: string;
  description: string;
  capabilities: string[];
  challenge: string;
  solution: string;
  technology: string[];
  process: string;
  result: string;
  accent: "cyan" | "blue" | "purple" | "pink";
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  accent: "cyan" | "blue" | "purple" | "pink";
  readingTime: string;
};
