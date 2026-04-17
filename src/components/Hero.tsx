"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { campaigns } from "@/data/campaigns";
import { cn } from "@/lib/cn";

const ROTATE_MS = 6500;

// Campaigns that rotate in the hero, in order. Portrait-only campaigns
// (e.g. Face) are intentionally excluded — they crop awkwardly in the
// landscape hero and live instead in the Work grid below.
const HERO_ORDER = ["yamada-bomber-jacket", "yamada-alo"];

type Slide = {
  src: string;
  alt: string;
  title: string;
  category: string;
  slug: string;
  aspect: "portrait" | "landscape" | "square";
};

const slides: Slide[] = HERO_ORDER.map((slug) => campaigns.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c))
  .map((c) => {
    const pick = c.heroImage ?? c.images.find((i) => i.feature) ?? c.images[0];
    return {
      src: pick.src,
      alt: `${c.modelName} — ${c.title}`,
      title: c.title,
      category: c.category,
      slug: c.slug,
      aspect: pick.aspect,
    };
  });

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const slide = slides[i];

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[88svh] min-h-[560px] max-h-[960px] w-full overflow-hidden bg-ink">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.src}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority
              sizes="100vw"
              quality={92}
              className={cn(
                "object-cover",
                // Portrait sources need their focus zone raised so the face
                // isn't half out of the frame in a landscape crop.
                slide.aspect === "portrait"
                  ? "object-[center_20%]"
                  : "object-center",
              )}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25"
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom: slide label + controls */}
        <div className="absolute inset-x-0 bottom-0 text-ground">
          <div className="container-edge pb-8 md:pb-12">
            <div className="flex items-end justify-between gap-6">
              <Link
                href={`/work/${slide.slug}`}
                className="group block"
                aria-label={`Open campaign ${slide.title}`}
              >
                <p className="text-[0.7rem] uppercase tracking-wider2 text-ground/75 mb-2">
                  {slide.category}
                </p>
                <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tightest">
                  {slide.title}
                  <span
                    aria-hidden
                    className="inline-block ml-4 align-middle text-[0.55em] translate-y-[-0.12em] transition-transform duration-300 group-hover:translate-x-2"
                  >
                    ↗
                  </span>
                </h1>
              </Link>

              <div className="hidden md:flex items-center gap-3 pb-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.slug}
                    onClick={() => setI(idx)}
                    aria-label={`Show ${s.title}`}
                    className={cn(
                      "h-px w-10 transition-all duration-300",
                      idx === i
                        ? "bg-ground h-[2px]"
                        : "bg-ground/40 hover:bg-ground/70",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positioning line beneath the hero */}
      <div className="container-edge py-10 md:py-14 grid md:grid-cols-12 gap-y-6 md:gap-x-8 items-start">
        <p className="md:col-span-7 font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.25] tracking-tightest max-w-[34ch]">
          ByFabian is a one-person studio making editorial campaign imagery —
          fashion, beauty, activewear — without a set, a flight, or a crew.
        </p>
        <div className="md:col-span-4 md:col-start-9">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 text-[0.8125rem] uppercase tracking-wider2 text-ink hover:text-accent transition-colors"
          >
            <span>Book a campaign</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
