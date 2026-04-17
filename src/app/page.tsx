import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { CampaignCard } from "@/components/CampaignCard";
import { StudioStrip } from "@/components/StudioStrip";
import { campaigns } from "@/data/campaigns";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />

      <section className="container-edge pt-24 md:pt-32">
        <div className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <p className="eyebrow mb-4">Selected Work</p>
            <h2 className="font-display text-display-lg tracking-tightest">
              Three campaigns, <span className="italic">one muse</span>.
            </h2>
          </div>
          <p className="serial hidden md:block">
            {campaigns.length.toString().padStart(2, "0")} / {campaigns.length.toString().padStart(2, "0")}
          </p>
        </div>

        <div className="space-y-28 md:space-y-40">
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
