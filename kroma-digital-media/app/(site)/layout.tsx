import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kroma Digital Media",
  url: "https://www.kromadigitalmedia.com",
  slogan: "We Create. We Innovate. We Digitize.",
  description:
    "Kroma Digital Media is a full-service digital solutions company providing audio-visual, web, mobile, software, AI and digital transformation services.",
  areaServed: ["India", "Global"],
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kroma Digital Media",
  url: "https://www.kromadigitalmedia.com",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
