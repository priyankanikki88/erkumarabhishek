"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Paperclip, X } from "lucide-react";
import { SubmitButton } from "@/components/Button";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormControls";
import { budgetRanges, serviceOptions, timelineOptions } from "@/lib/data/forms";
import { FieldErrors, QuoteFormData, validateQuoteForm } from "@/lib/validation";

const initialData: QuoteFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  description: "",
  timeline: "",
  budget: "",
};

export function QuoteForm() {
  const [data, setData] = useState<QuoteFormData>(initialData);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [referenceId, setReferenceId] = useState<string>("");

  function update<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFiles((prev) => [...prev, ...Array.from(fileList)].slice(0, 5));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateQuoteForm(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();
      setReferenceId(json.referenceId ?? "");
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
          Request Received
        </h3>
        <p className="mt-3 max-w-md text-muted">
          Thank you for sharing your project details. Our team will review
          your request and get back to you with a quote shortly.
        </p>
        {referenceId && (
          <p className="mt-4 rounded-full border border-border bg-white/[0.04] px-4 py-1.5 text-sm text-foreground/80">
            Reference ID: <span className="font-semibold">{referenceId}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">
        Personal &amp; Company Information
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="q-name"
          label="Full Name"
          required
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <TextField
          id="q-company"
          label="Company Name"
          required
          value={data.company}
          onChange={(e) => update("company", e.target.value)}
          error={errors.company}
          autoComplete="organization"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="q-email"
          label="Email"
          type="email"
          required
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <TextField
          id="q-phone"
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      <p className="pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple">
        Project Details
      </p>
      <SelectField
        id="q-service"
        label="Service Required"
        required
        options={serviceOptions}
        value={data.service}
        onChange={(e) => update("service", e.target.value)}
        error={errors.service}
      />
      <TextAreaField
        id="q-description"
        label="Project Description"
        required
        placeholder="Describe your project goals, scope and any specific requirements..."
        value={data.description}
        onChange={(e) => update("description", e.target.value)}
        error={errors.description}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="q-timeline"
          label="Timeline"
          required
          options={timelineOptions}
          value={data.timeline}
          onChange={(e) => update("timeline", e.target.value)}
          error={errors.timeline}
        />
        <SelectField
          id="q-budget"
          label="Budget"
          required
          options={budgetRanges}
          value={data.budget}
          onChange={(e) => update("budget", e.target.value)}
          error={errors.budget}
        />
      </div>

      <div>
        <label htmlFor="q-attachments" className="mb-2 block text-sm font-medium text-foreground/90">
          Attachments (briefs, references, inspiration — optional)
        </label>
        <label
          htmlFor="q-attachments"
          className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white/[0.02] px-4 py-6 text-sm text-muted transition-colors hover:border-accent-cyan/40 hover:text-foreground"
        >
          <Paperclip className="h-4 w-4" />
          Click to attach files (up to 5)
        </label>
        <input
          id="q-attachments"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-foreground/80"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="focus-ring text-muted hover:text-rose-400"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        {status === "submitting" ? "Submitting..." : "Submit Quote Request"}
      </SubmitButton>
    </form>
  );
}
