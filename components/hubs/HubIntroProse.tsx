type HubIntroProseProps = {
  paragraphs: string[];
  className?: string;
};

export function HubIntroProse({ paragraphs, className = "" }: HubIntroProseProps) {
  if (paragraphs.length === 0) return null;
  return (
    <div className={`max-w-3xl space-y-4 ${className}`}>
      {paragraphs.map((text, i) => (
        <p key={i} className="text-sm leading-relaxed text-[var(--muted)] md:text-base">
          {text}
        </p>
      ))}
    </div>
  );
}
