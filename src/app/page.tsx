import { Hero } from "@/components/Hero";
import { CampaignCard } from "@/components/CampaignCard";
import { StudioStrip } from "@/components/StudioStrip";
import { campaigns } from "@/data/campaigns";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="container-edge pt-20 md:pt-28">
        <div className="flex items-end justify-between mb-14 md:mb-20 hairline pt-6">
          <p className="eyebrow">Work</p>
          <p className="serial">
            {campaigns.length.toString().padStart(2, "0")} campaigns
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {campaigns.map((c, i) => (
            <CampaignCard
              key={c.slug}
              campaign={c}
              index={i}
              align={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>

      <StudioStrip />
    </>
  );
}
