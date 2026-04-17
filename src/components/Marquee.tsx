"use client";

const defaults = [
  "Editorial",
  "Beauty",
  "Streetwear",
  "Activewear",
  "Lookbook",
  "Lifestyle",
  "E-commerce",
  "Brand",
];

export function Marquee({ items = defaults }: { items?: string[] }) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="hairline border-b border-rule overflow-hidden py-5 select-none">
      <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] gap-10 will-change-transform">
        {loop.map((t, i) => (
          <span
            key={i}
            className="font-display text-[clamp(1.75rem,3vw,2.5rem)] tracking-tightest italic text-ink-soft"
          >
            {t}
            <span className="mx-10 text-ink-mute not-italic" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </div>
  );
}
