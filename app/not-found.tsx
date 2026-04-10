import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-10 text-center backdrop-blur-xl">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-[var(--text)]">This page drifted away</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        The calculator or route you wanted is not here. Try the home page or a category hub.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-6 py-3 text-sm font-semibold text-[var(--text-on-gradient)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        Back to home
      </Link>
    </div>
  );
}
