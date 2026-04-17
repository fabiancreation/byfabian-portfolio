import Image from "next/image";
import Link from "next/link";
import { campaigns } from "@/data/campaigns";

export const metadata = {
  title: "About",
  description:
    "ByFabian is a one-person AI imagery studio. Editorial campaigns for fashion, beauty, and lifestyle brands.",
};

const numbers = [
  { n: "01", label: "Director", body: "Everything — concept, model, art direction, retouch — is one hand." },
  { n: "02", label: "Turnaround", body: "First frames within 72 hours. Full campaign delivery in under two weeks." },
  { n: "03", label: "Rights", body: "Clients receive full commercial usage. AI-generated, legally uncomplicated." },
];

export default function AboutPage() {
  const hero = campaigns[0].images[0];
  return (
    <>
      <section className="container-edge pt-[calc(64px+2.5rem)] md:pt-[calc(72px+3rem)] pb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="serial">About</span>
          <span className="h-px w-8 bg-ink-mute/40" aria-hidden />
          <span className="eyebrow">Studio note</span>
        </div>

        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-8 items-start">
          <div className="md:col-span-7">
            <h1 className="font-display text-display-xl tracking-tightest">
              One director.<br />
              <span className="italic text-ink-soft">Zero logistics.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="relative aspect-[4/5] overflow-hidden bg-rule/30">
              <Image
                src={hero.src}
                alt="ByFabian — portrait frame"
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                quality={92}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7 md:col-start-2 space-y-6 text-[1.05rem] text-ink-soft leading-[1.7]">
            <p>
              ByFabian is a small studio building the kind of fashion imagery
              that used to take a scout, a crew of twelve, and a flight across
              an ocean. Now it takes a clear brief, a quiet morning, and a
              director who knows how to look at a face.
            </p>
            <p>
              The work lives in that strange new space where{" "}
              <span className="italic">editorial</span> and{" "}
              <span className="italic">synthetic</span> stop being opposites —
              where a brand can say something specific about who it is without
              burning three months of budget to say it.
            </p>
            <p>
              Yamada is the first muse. She&apos;ll be joined by others.
            </p>
          </div>
        </div>
      </section>

      <section className="container-edge py-20">
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 hairline pt-10">
          {numbers.map((item) => (
            <div key={item.n}>
              <span className="serial block mb-6">{item.n}</span>
              <p className="eyebrow mb-3">{item.label}</p>
              <p className="text-[0.95rem] text-ink-soft leading-relaxed max-w-[28ch]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-edge py-24 text-center">
        <p className="eyebrow mb-6">Ready when you are</p>
        <p className="font-display text-display-lg tracking-tightest max-w-[20ch] mx-auto">
          Tell me about the brand.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 mt-10 text-sm uppercase tracking-wider2 text-ink hover:text-accent transition-colors"
        >
          <span>Start a brief</span>
          <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
