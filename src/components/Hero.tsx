"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { campaigns } from "@/data/campaigns";

export function Hero() {
  const heroImage = campaigns[1]?.images[0] ?? campaigns[0].images[0];

  return (
    <section className="relative">
      <div className="container-edge pt-6 md:pt-10 pb-12 md:pb-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="serial">ByFabian · Est. 2026</span>
          <span className="h-px flex-1 bg-rule" aria-hidden />
          <span className="serial">Issue 01 — Yamada</span>
        </div>

        <div className="grid md:grid-cols-12 gap-y-10 md:gap-x-8 items-end">
          <div className="md:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-display-xl"
            >
              Campaigns<span className="italic text-ink-soft">,</span>
              <br />
              without the <span className="italic">plane ticket</span>.
            </motion.h1>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[0.95rem] text-ink-soft leading-relaxed max-w-[34ch]"
            >
              ByFabian is a one-person studio building editorial AI imagery for
              fashion, beauty, and lifestyle brands. Full campaigns, a single
              director, zero logistics.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative mt-14 md:mt-20 aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-rule/30"
        >
          <Image
            src={heroImage.src}
            alt="ByFabian cover"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ground/60 via-transparent to-transparent"
          />
          <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 text-ground mix-blend-difference">
            <p className="eyebrow !text-ground/90 mb-2">Now showing</p>
            <p className="font-display text-2xl md:text-3xl tracking-tightest">
              Yamada — three campaigns
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
