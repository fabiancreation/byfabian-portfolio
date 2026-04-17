import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-edge py-40 text-center">
      <p className="eyebrow mb-6">404</p>
      <h1 className="font-display text-display-lg tracking-tightest">
        Off the contact sheet.
      </h1>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-10 text-sm uppercase tracking-wider2 hover:text-accent transition-colors"
      >
        <span>Back to work</span>
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
