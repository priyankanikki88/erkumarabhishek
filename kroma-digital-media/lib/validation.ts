export type FieldErrors = Record<string, string>;

export function required(value: string, message = "This field is required.") {
  return value.trim().length === 0 ? message : undefined;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string) {
  return /^[0-9+\-\s()]{7,20}$/.test(value);
}

export type ContactFormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  description: string;
};

export function validateContactForm(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!data.email.trim()) errors.email = "Please enter your email.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";
  if (data.phone.trim() && !isValidPhone(data.phone))
    errors.phone = "Enter a valid phone number.";
  if (!data.projectType) errors.projectType = "Please select a project type.";
  if (!data.budget) errors.budget = "Please select a budget range.";
  if (!data.description.trim())
    errors.description = "Tell us a little about your project.";
  else if (data.description.trim().length < 20)
    errors.description = "Please provide a bit more detail (20+ characters).";
  return errors;
}

export type QuoteFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  description: string;
  timeline: string;
  budget: string;
};

export function validateQuoteForm(data: QuoteFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!data.email.trim()) errors.email = "Please enter your email.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";
  if (data.phone.trim() && !isValidPhone(data.phone))
    errors.phone = "Enter a valid phone number.";
  if (!data.company.trim()) errors.company = "Please enter your company name.";
  if (!data.service) errors.service = "Please select a service.";
  if (!data.description.trim())
    errors.description = "Please describe your project.";
  else if (data.description.trim().length < 20)
    errors.description = "Please provide a bit more detail (20+ characters).";
  if (!data.timeline) errors.timeline = "Please select a timeline.";
  if (!data.budget) errors.budget = "Please select a budget range.";
  return errors;
}
