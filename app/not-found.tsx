import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center sm:py-36">
      <p className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-accent">404</p>
      <h1 className="mt-4 font-display text-5xl font-normal tracking-tight">We couldn’t find that page</h1>
      <p className="mt-4 leading-7 text-muted">The link may be mistyped, or the page may have moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-brand px-6 py-3 font-semibold text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lg hover:shadow-brand/30">
          Go to home
        </Link>
        <Link href="/the-works/" className="rounded-full border border-line px-6 py-3 font-medium hover:border-accent hover:text-accent">
          See our projects
        </Link>
      </div>
    </section>
  );
}
