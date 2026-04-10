type HubContentAsideProps = {
  heading: string;
  bullets: string[];
  className?: string;
};

export function HubContentAside({ heading, bullets, className = "" }: HubContentAsideProps) {
  if (bullets.length === 0) return null;
  return (
    <aside
      className={`max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 p-6 backdrop-blur-sm ${className}`}
      aria-labelledby="hub-aside-heading"
    >
      <h2 id="hub-aside-heading" className="text-lg font-semibold tracking-tight text-[var(--text)]">
        {heading}
      </h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-[var(--muted)] md:text-base">
        {bullets.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
