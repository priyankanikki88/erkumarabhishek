import { NextRequest, NextResponse } from "next/server";
import { validateQuoteForm, type QuoteFormData } from "@/lib/validation";

// Mock endpoint — validates and acknowledges the submission. Wire this up to
// a real database / CRM / email notification service for production use.
export async function POST(request: NextRequest) {
  let body: Partial<QuoteFormData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: QuoteFormData = {
    name: body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    company: body.company ?? "",
    service: body.service ?? "",
    description: body.description ?? "",
    timeline: body.timeline ?? "",
    budget: body.budget ?? "",
  };

  const errors = validateQuoteForm(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  console.log("[quote] new quote request received:", {
    name: data.name,
    company: data.company,
    service: data.service,
    budget: data.budget,
  });

  return NextResponse.json({
    ok: true,
    referenceId: `QR-${Math.floor(1000 + Math.random() * 9000)}`,
  });
}
