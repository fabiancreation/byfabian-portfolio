import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { campaigns, getCampaign, getAdjacentCampaigns } from "@/data/campaigns";
import { EditorialGrid } from "@/components/EditorialGrid";

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) return { title: "Not found" };
  return {
    title: `${c.title} — ${c.category}`,
    description: c.description,
    openGraph: {
      title: `${c.title} — ByFabian`,
      description: c.tagline,
      images: [{ url: c.cover }],
    },
  };
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  const { next } = getAdjacentCampaigns(slug);

  return (
    <article>
      {/* Title plate */}
      <header className="container-edge pt-[calc(64px+2rem)] md:pt-[calc(72px+2.5rem)] pb-8 md:pb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="serial">{campaign.number}</span>
          <span className="h-px w-8 bg-ink-mute/40" aria-hidden />
          <span className="eyebrow">{campaign.category}</span>
        </div>

        <div className="grid md:grid-cols-12 gap-y-8 md:gap-x-8 items-end">
          <h1 className="md:col-span-8 font-display text-display-xl tracking-tightest">
            {campaign.title}
          </h1>

          <div className="md:col-span-4 md:col-start-9 text-right md:text-left">
            <p className="eyebrow mb-2">Model</p>
            <p className="font-display text-xl tracking-tightest">
              {campaign.modelName}
            </p>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-12 gap-y-8 md:gap-x-8">
          <p className="md:col-span-5 md:col-start-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] tracking-tightest italic text-ink-soft max-w-[30ch]">
            {campaign.tagline}
          </p>
          <p className="md:col-span-4 text-[0.95rem] text-ink-soft leading-relaxed">
            {campaign.description}
          </p>
        </div>

        <div className="mt-10 hairline pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 serial">
          <div>
            <p className="eyebrow mb-1">Year</p>
            <p>{campaign.year}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">Frames</p>
            <p>{campaign.images.length.toString().padStart(2, "0")}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">Tools</p>
            <p>{campaign.tools.join(" · ")}</p>
          </div>
          <div>
            <p className="eyebrow mb-1">Studio</p>
            <p>ByFabian</p>
          </div>
        </div>
      </header>

      {/* Editorial grid */}
      <section className="mt-6 md:mt-10">
        <EditorialGrid images={campaign.images} />
      </section>

      {/* CTA + next */}
      <section className="container-edge mt-28 md:mt-40">
        <div className="hairline pt-16 grid md:grid-cols-12 gap-y-12 md:gap-x-8">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">Next up</p>
            <Link
              href={`/work/${next.slug}`}
              className="group block"
              aria-label={`Open campaign ${next.title}`}
            >
              <div className="flex items-center gap-6 md:gap-10">
                <div
                  className="relative w-28 md:w-40 aspect-[4/5] overflow-hidden bg-rule/30 flex-shrink-0"
                >
                  <Image
                    src={next.cover}
                    alt={next.title}
                    fill
                    sizes="160px"
                    quality={90}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div>
                  <p className="serial mb-2">{next.number}</p>
                  <p className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tightest">
                    {next.title}
                    <span
                      aria-hidden
                      className="inline-block ml-4 transition-transform duration-300 group-hover:translate-x-2"
                    >
                      →
                    </span>
                  </p>
                  <p className="eyebrow mt-3">{next.category}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="md:col-span-4 md:col-start-9 md:border-l md:border-rule md:pl-8">
            <p className="eyebrow mb-4">Want a campaign like this?</p>
            <p className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-tightest mb-6 max-w-[16ch]">
              Bring a brand. I&apos;ll bring the frames.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-wider2 text-ink hover:text-accent transition-colors"
            >
              <span>Start a brief</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
