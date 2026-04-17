"use client";

import { motion } from "framer-motion";

const services = [
  {
    n: "01",
    label: "Concept & Direction",
    body: "Mood, wardrobe, location, lighting — designed as a coherent visual story before a single frame is rendered.",
  },
  {
    n: "02",
    label: "Model & Wardrobe",
    body: "Custom AI models, trained and consistent. Ready to wear your brand — today, and in next season's campaign.",
  },
  {
    n: "03",
    label: "Full Campaign Delivery",
    body: "Hero, supporting, and cutdown sizes. Print, digital, social — retouched and colour-graded.",
  },
];

export function StudioStrip() {
  return (
    <section className="container-edge py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-y-10 md:gap-x-8">
        <div className="md:col-span-4">
          <p className="eyebrow mb-6">Studio</p>
          <p className="font-display text-display-lg tracking-tightest max-w-[12ch]">
            What ByFabian delivers.
          </p>
        </div>
        <div className="md:col-span-8 grid sm:grid-cols-3 gap-8 md:gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col pt-6 border-t border-ink"
            >
              <span className="serial mb-8">{s.n}</span>
              <h3 className="font-display text-[1.5rem] leading-tight tracking-tightest mb-3">
                {s.label}
              </h3>
              <p className="text-[0.9rem] text-ink-soft leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
