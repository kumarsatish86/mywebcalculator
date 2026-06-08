type HubContentAsideProps = {
  heading: string;
  bullets: string[];
  className?: string;
};

export function HubContentAside({ heading, bullets, className = "" }: HubContentAsideProps) {
  if (bullets.length === 0) return null;
  return (
    <aside
      className={`max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur-sm ${className}`}
      aria-labelledby="hub-aside-heading"
    >
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="text-xl">📋</span>
        <h2
          id="hub-aside-heading"
          className="text-lg font-semibold tracking-tight text-[var(--text)]"
        >
          {heading}
        </h2>
      </div>
      <ul className="mt-4 space-y-2.5">
        {bullets.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-bright)]"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
