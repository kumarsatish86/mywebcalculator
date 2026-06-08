"use client";

type Theme = "light" | "dark";

const storageKey = "mwc-theme";

function getDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(storageKey, theme);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => {
        const theme = getDocumentTheme();
        const nextTheme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
      }}
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] shadow-sm transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nav-bg)]"
    >
      <svg
        aria-hidden="true"
        className="theme-toggle-sun h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      <svg
        aria-hidden="true"
        className="theme-toggle-moon h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 7.7A8 8 0 1 1 12 3Z" />
      </svg>
    </button>
  );
}
