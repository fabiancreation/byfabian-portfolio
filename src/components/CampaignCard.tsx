"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Campaign } from "@/data/campaigns";

type Props = {
  campaign: Campaign;
  index: number;
  align?: "left" | "right";
};

export function CampaignCard({ campaign, index, align = "left" }: Props) {
  const alignRight = align === "right";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <Link
        href={`/work/${campaign.slug}`}
        className="group block"
        aria-label={`Open campaign ${campaign.title}`}
      >
        <div
          className={`grid md:grid-cols-12 gap-y-6 md:gap-x-8 items-end ${
            alignRight ? "" : ""
          }`}
        >
          <div
            className={`md:col-span-8 ${
              alignRight ? "md:col-start-5 md:order-2" : ""
            }`}
          >
            <div
              className="relative overflow-hidden bg-rule/30"
              style={{
                aspectRatio:
                  campaign.coverAspect === "portrait"
                    ? "4 / 5"
                    : campaign.coverAspect === "landscape"
                    ? "4 / 3"
                    : "1 / 1",
              }}
            >
              <Image
                src={campaign.cover}
                alt={`${campaign.title} — cover`}
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                priority={index < 2}
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>
          </div>

          <div
            className={`md:col-span-4 ${
              alignRight ? "md:col-start-1 md:order-1" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="serial">{campaign.number}</span>
              <span className="h-px w-6 bg-ink-mute/40" aria-hidden />
              <span className="eyebrow !tracking-wider2">{campaign.category}</span>
            </div>
            <h3 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.95] tracking-tightest">
              {campaign.title}
            </h3>
            <p className="mt-4 text-[0.95rem] text-ink-soft max-w-[32ch]">
              {campaign.tagline}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-wider2 text-ink-mute group-hover:text-accent transition-colors">
              <span>Enter</span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
