import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Book a campaign",
  description:
    "Start a brief with ByFabian — AI campaign imagery for fashion, beauty, and lifestyle brands.",
};

export default function ContactPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <section className="container-edge pt-[calc(64px+2.5rem)] md:pt-[calc(72px+3rem)] pb-24">
      <div className="flex items-center gap-3 mb-10">
        <span className="serial">Book</span>
        <span className="h-px w-8 bg-ink-mute/40" aria-hidden />
        <span className="eyebrow">Open for Q3 2026</span>
      </div>

      <div className="grid md:grid-cols-12 gap-y-16 md:gap-x-10 items-start">
        <div className="md:col-span-5">
          <h1 className="font-display text-display-lg tracking-tightest">
            Tell me about the brand.
          </h1>
          <p className="mt-6 text-[1rem] text-ink-soft leading-relaxed max-w-[36ch]">
            A sentence or a script — both work. I&apos;ll respond within one
            working day with either first thoughts or a time to talk.
          </p>

          {calendlyUrl ? (
            <div className="mt-10 border-t border-rule pt-10">
              <p className="eyebrow mb-3">Or book a call</p>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wider2 hover:text-accent transition-colors"
              >
                <span>30 min discovery</span>
                <span aria-hidden>↗</span>
              </a>
              <div className="mt-6 aspect-[4/5] md:aspect-[4/3] border border-rule overflow-hidden">
                <iframe
                  src={calendlyUrl}
                  className="w-full h-full"
                  title="Book a discovery call"
                />
              </div>
            </div>
          ) : (
            <div className="mt-10 border-t border-rule pt-10">
              <p className="eyebrow mb-3">Or book a call</p>
              <p className="text-sm text-ink-mute">
                Calendly link coming soon.
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
