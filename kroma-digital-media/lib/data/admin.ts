// Mock data for the admin dashboard UI. Replace with real API data once the
// backend (leads, quotes, CMS) is connected.

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  status: LeadStatus;
  source: "Contact Form" | "Quote Request" | "Chatbot" | "Referral";
  date: string;
};

export const leads: Lead[] = [
  { id: "LD-1042", name: "Ritika Sharma", company: "Verve Retail", email: "ritika@ververetail.com", projectType: "E-commerce Platform", budget: "₹5L – ₹10L", status: "Qualified", source: "Quote Request", date: "2026-10-29" },
  { id: "LD-1041", name: "Arjun Mehta", company: "Northwind Logistics", email: "arjun@northwind.co", projectType: "Software Solution", budget: "₹10L+", status: "New", source: "Contact Form", date: "2026-10-28" },
  { id: "LD-1040", name: "Sana Fatima", company: "Lumen Clinic", email: "sana@lumenclinic.in", projectType: "Mobile Application", budget: "₹2L – ₹5L", status: "Contacted", source: "Chatbot", date: "2026-10-27" },
  { id: "LD-1039", name: "Dev Patel", company: "Orbit Realty", email: "dev@orbitrealty.in", projectType: "Website", budget: "₹50,000 – ₹2L", status: "Converted", source: "Referral", date: "2026-10-25" },
  { id: "LD-1038", name: "Meera Nair", company: "Pulse Media Co.", email: "meera@pulsemedia.co", projectType: "Audio Visual", budget: "₹2L – ₹5L", status: "New", source: "Quote Request", date: "2026-10-24" },
  { id: "LD-1037", name: "Karan Suri", company: "FinEdge Capital", email: "karan@finedge.in", projectType: "AI Solution", budget: "₹10L+", status: "Qualified", source: "Contact Form", date: "2026-10-22" },
  { id: "LD-1036", name: "Aisha Khan", company: "BrightPath Edu", email: "aisha@brightpath.edu", projectType: "Web Application", budget: "₹5L – ₹10L", status: "Lost", source: "Chatbot", date: "2026-10-18" },
  { id: "LD-1035", name: "Rohan Desai", company: "Vantage Hotels", email: "rohan@vantagehotels.com", projectType: "Digital Transformation", budget: "₹10L+", status: "Contacted", source: "Referral", date: "2026-10-15" },
];

export type QuoteRequest = {
  id: string;
  name: string;
  company: string;
  service: string;
  timeline: string;
  budget: string;
  status: "Pending" | "Reviewed" | "Quoted" | "Won";
  date: string;
};

export const quoteRequests: QuoteRequest[] = [
  { id: "QR-318", name: "Ritika Sharma", company: "Verve Retail", service: "E-commerce Platform", timeline: "2-3 months", budget: "₹5L – ₹10L", status: "Reviewed", date: "2026-10-29" },
  { id: "QR-317", name: "Meera Nair", company: "Pulse Media Co.", service: "Audio Visual", timeline: "1 month", budget: "₹2L – ₹5L", status: "Pending", date: "2026-10-24" },
  { id: "QR-316", name: "Karan Suri", company: "FinEdge Capital", service: "AI Solution", timeline: "3-6 months", budget: "₹10L+", status: "Quoted", date: "2026-10-22" },
  { id: "QR-315", name: "Simran Kaur", company: "Loop Fashion", service: "Mobile Application", timeline: "2-3 months", budget: "₹2L – ₹5L", status: "Won", date: "2026-10-10" },
  { id: "QR-314", name: "Yash Agarwal", company: "GreenGrid Energy", service: "Software Solution", timeline: "6+ months", budget: "₹10L+", status: "Pending", date: "2026-10-08" },
];

export const monthlyLeadTrend = [
  { month: "May", value: 28 },
  { month: "Jun", value: 34 },
  { month: "Jul", value: 31 },
  { month: "Aug", value: 42 },
  { month: "Sep", value: 48 },
  { month: "Oct", value: 56 },
];

export const leadsBySource = [
  { label: "Contact Form", value: 36, color: "#4df0ff" },
  { label: "Quote Request", value: 29, color: "#5b7fff" },
  { label: "Chatbot", value: 18, color: "#9b6bff" },
  { label: "Referral", value: 17, color: "#ff6bd6" },
];

export const dashboardStats = {
  totalLeads: 248,
  newEnquiries: 32,
  quoteRequests: 61,
  projects: 47,
  conversionRate: "24.6%",
};
