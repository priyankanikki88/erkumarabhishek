"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SubmitButton } from "@/components/Button";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormControls";
import { budgetRanges, projectTypes } from "@/lib/data/forms";
import {
  ContactFormData,
  FieldErrors,
  validateContactForm,
} from "@/lib/validation";

const initialData: ContactFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  projectType: "",
  budget: "",
  description: "",
};

export function ContactForm() {
  const [data, setData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactForm(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass flex flex-col items-center rounded-3xl p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent-cyan" />
        <h3 className="mt-5 font-display text-2xl font-semibold text-foreground">
          Thank you!
        </h3>
        <p className="mt-3 max-w-md text-muted">
          Your project request has been received. Our team will get in touch
          with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Name"
          required
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          id="company"
          label="Company"
          value={data.company}
          onChange={(e) => update("company", e.target.value)}
          error={errors.company}
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="projectType"
          label="Project Type"
          required
          options={projectTypes}
          value={data.projectType}
          onChange={(e) => update("projectType", e.target.value)}
          error={errors.projectType}
        />
        <SelectField
          id="budget"
          label="Budget Range"
          required
          options={budgetRanges}
          value={data.budget}
          onChange={(e) => update("budget", e.target.value)}
          error={errors.budget}
        />
      </div>

      <TextAreaField
        id="description"
        label="Project Description"
        required
        placeholder="Tell us what you're trying to build..."
        value={data.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
      />

      {status === "error" && (
        <p className="text-sm text-rose-400">
          Something went wrong submitting your request. Please try again.
        </p>
      )}

      <SubmitButton
        type="submit"
        variant="primary"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting" ? "Submitting..." : "Submit Project Request"}
      </SubmitButton>
    </form>
  );
}
