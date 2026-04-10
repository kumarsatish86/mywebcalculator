export function SiteBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[var(--bg-deep)]" />
      <div
        className="absolute -left-1/4 top-[-20%] h-[70vmin] w-[70vmin] rounded-full opacity-50 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--blob-1) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-1/4 bottom-[-10%] h-[60vmin] w-[60vmin] rounded-full opacity-45 blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--blob-2) 0%, transparent 70%)" }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[40vmin] w-[40vmin] -translate-x-1/2 rounded-full opacity-30 blur-[80px]"
        style={{ background: "radial-gradient(circle, var(--blob-3) 0%, transparent 65%)" }}
      />
      <div
        className="site-bg-noise absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-deep)]"
        style={{ opacity: 0.85 }}
      />
    </div>
  );
}
