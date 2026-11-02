import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

const fieldBase =
  "focus-ring w-full rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent-cyan/50";

function Wrapper({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground/90">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  wrapperClassName?: string;
};

export function TextField({ label, error, wrapperClassName, id, className, ...props }: TextFieldProps) {
  return (
    <Wrapper label={label} htmlFor={id!} error={error} className={wrapperClassName}>
      <input
        id={id}
        className={clsx(fieldBase, error && "border-rose-500/60", className)}
        aria-invalid={!!error}
        {...props}
      />
    </Wrapper>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  wrapperClassName?: string;
};

export function TextAreaField({ label, error, wrapperClassName, id, className, ...props }: TextAreaFieldProps) {
  return (
    <Wrapper label={label} htmlFor={id!} error={error} className={wrapperClassName}>
      <textarea
        id={id}
        className={clsx(fieldBase, "min-h-[140px] resize-y", error && "border-rose-500/60", className)}
        aria-invalid={!!error}
        {...props}
      />
    </Wrapper>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: string[];
  placeholder?: string;
  wrapperClassName?: string;
};

export function SelectField({
  label,
  error,
  options,
  placeholder = "Select an option",
  wrapperClassName,
  id,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <Wrapper label={label} htmlFor={id!} error={error} className={wrapperClassName}>
      <select
        id={id}
        className={clsx(fieldBase, "appearance-none", error && "border-rose-500/60", className)}
        aria-invalid={!!error}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}
