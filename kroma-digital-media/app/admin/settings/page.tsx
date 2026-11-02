import { TextField, TextAreaField } from "@/components/forms/FormControls";
import { SubmitButton } from "@/components/Button";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Website Settings
      </h1>
      <p className="mt-1 text-sm text-muted">
        General site information used across the public website and SEO
        metadata.
      </p>

      <form className="mt-6 space-y-5 rounded-2xl border border-border bg-panel/60 p-6">
        <TextField id="site-name" label="Site Name" defaultValue="Kroma Digital Media" />
        <TextField id="tagline" label="Tagline" defaultValue="We Create. We Innovate. We Digitize." />
        <TextAreaField
          id="meta-description"
          label="Default Meta Description"
          defaultValue="Kroma Digital Media is a digital technology and media solutions company building web, mobile, software, AI and audio-visual products for businesses across India and worldwide."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="contact-email" label="Contact Email" defaultValue="hello@kromadigitalmedia.com" />
          <TextField id="contact-phone" label="Contact Phone" defaultValue="+91 00000 00000" />
        </div>
        <SubmitButton type="button" variant="primary">
          Save Changes
        </SubmitButton>
      </form>
    </div>
  );
}
