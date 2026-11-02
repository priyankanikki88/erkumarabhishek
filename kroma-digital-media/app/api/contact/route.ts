import { NextRequest, NextResponse } from "next/server";
import { validateContactForm, type ContactFormData } from "@/lib/validation";

// Mock endpoint — validates and acknowledges the submission. Wire this up to
// a real database / CRM / email notification service for production use.
export async function POST(request: NextRequest) {
  let body: Partial<ContactFormData>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: ContactFormData = {
    name: body.name ?? "",
    company: body.company ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    projectType: body.projectType ?? "",
    budget: body.budget ?? "",
    description: body.description ?? "",
  };

  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  console.log("[contact] new lead received:", {
    name: data.name,
    company: data.company,
    email: data.email,
    projectType: data.projectType,
  });

  return NextResponse.json({ ok: true });
}
