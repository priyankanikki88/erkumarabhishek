import { MetadataRoute } from "next";
import { portfolioProjects } from "@/lib/data/portfolio";
import { blogPosts } from "@/lib/data/blog";

const siteUrl = "https://www.kromadigitalmedia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/solutions",
    "/ai-solutions",
    "/portfolio",
    "/industries",
    "/contact",
    "/quote",
    "/insights",
    "/privacy-policy",
    "/terms-of-service",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const portfolioRoutes = portfolioProjects.map((p) => ({
    url: `${siteUrl}/portfolio/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${siteUrl}/insights/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...portfolioRoutes, ...blogRoutes];
}
