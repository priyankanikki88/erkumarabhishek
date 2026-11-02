import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://www.kromadigitalmedia.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kroma Digital Media — Digital Solutions, AI & Technology Company",
    template: "%s | Kroma Digital Media",
  },
  description:
    "Kroma Digital Media is a digital technology and media solutions company building web, mobile, software, AI and audio-visual products for businesses across India and worldwide.",
  keywords: [
    "Digital Media Company",
    "Digital Solutions Company",
    "Web Application Development",
    "Mobile App Development",
    "Software Development",
    "AI Solutions",
    "AI Development",
    "AI Automation",
    "Audio Visual Production",
    "Digital Transformation",
    "Custom Software Development",
  ],
  authors: [{ name: "Kroma Digital Media" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Kroma Digital Media",
    title: "Kroma Digital Media — We Create. We Innovate. We Digitize.",
    description:
      "From audio-visual experiences to intelligent AI solutions, web platforms, mobile applications and enterprise software — Kroma Digital Media transforms ideas into powerful digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kroma Digital Media — We Create. We Innovate. We Digitize.",
    description:
      "From audio-visual experiences to intelligent AI solutions, web platforms, mobile applications and enterprise software — Kroma Digital Media transforms ideas into powerful digital products.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
