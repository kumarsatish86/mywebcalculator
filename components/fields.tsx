import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

const inputBase =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-sm text-[var(--text)] placeholder:text-[var(--muted)] shadow-inner outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]";

const inputPaddingDefault = "px-4 py-3";
const inputPaddingCompact = "px-2.5 py-1.5 h-9 min-h-9";

export function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`block text-xs font-medium uppercase tracking-wider text-[var(--muted)] ${props.className ?? ""}`}
    />
  );
}

export function FieldInput(
  props: InputHTMLAttributes<HTMLInputElement> & { compact?: boolean },
) {
  const { compact, className, ...rest } = props;
  const pad = compact ? inputPaddingCompact : inputPaddingDefault;
  return <input {...rest} className={`${inputBase} ${pad} ${className ?? ""}`} />;
}

export function FieldSelect(
  props: SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean },
) {
  const { compact, className, ...rest } = props;
  const pad = compact ? inputPaddingCompact : inputPaddingDefault;
  return (
    <select
      {...rest}
      className={`${inputBase} ${pad} appearance-none bg-[var(--input-bg)] ${className ?? ""}`}
    />
  );
}
