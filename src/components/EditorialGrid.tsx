"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CampaignImage } from "@/data/campaigns";
import { cn } from "@/lib/cn";

type Props = {
  images: CampaignImage[];
};

/**
 * Mixed-rhythm editorial layout.
 * Pattern per group of 4 images:
 *   [A full-bleed] — [B + C diptych] — [D indented portrait]
 * For portraits-only sets, automatically collapses to tight pairs.
 */
export function EditorialGrid({ images }: Props) {
  const allPortrait = images.every((i) => i.aspect === "portrait");

  if (allPortrait) {
    return <PortraitRhythm images={images} />;
  }

  return <MixedRhythm images={images} />;
}

function Frame({
  image,
  sizes,
  priority = false,
  className,
}: {
  image: CampaignImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const aspect =
    image.aspect === "portrait"
      ? "4 / 5"
      : image.aspect === "landscape"
      ? "4 / 3"
      : "1 / 1";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative overflow-hidden bg-rule/30", className)}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </motion.div>
  );
}

function MixedRhythm({ images }: { images: CampaignImage[] }) {
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let n = 0;

  while (i < images.length) {
    const remaining = images.length - i;

    if (remaining >= 3) {
      // full-bleed hero
      blocks.push(
        <div key={`full-${n}`} className="container-edge">
          <Frame
            image={images[i]}
            sizes="(min-width:1280px) 80vw, 100vw"
            priority={n === 0}
          />
        </div>
      );
      i += 1;

      // diptych
      blocks.push(
        <div
          key={`dip-${n}`}
          className="container-edge grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <Frame image={images[i]} sizes="(min-width:768px) 50vw, 100vw" />
          <Frame image={images[i + 1]} sizes="(min-width:768px) 50vw, 100vw" />
        </div>
      );
      i += 2;
    } else if (remaining === 2) {
      blocks.push(
        <div
          key={`dip-${n}`}
          className="container-edge grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <Frame image={images[i]} sizes="(min-width:768px) 50vw, 100vw" />
          <Frame image={images[i + 1]} sizes="(min-width:768px) 50vw, 100vw" />
        </div>
      );
      i += 2;
    } else {
      // single remaining — indent based on aspect
      const img = images[i];
      blocks.push(
        <div key={`single-${n}`} className="container-edge">
          <div
            className={cn(
              "grid grid-cols-12",
              img.aspect === "portrait" ? "" : ""
            )}
          >
            <div
              className={cn(
                img.aspect === "portrait"
                  ? "col-span-12 md:col-span-6 md:col-start-4"
                  : "col-span-12 md:col-span-10 md:col-start-2"
              )}
            >
              <Frame image={img} sizes="(min-width:768px) 60vw, 100vw" />
            </div>
          </div>
        </div>
      );
      i += 1;
    }
    n += 1;
  }

  return <div className="space-y-8 md:space-y-12">{blocks}</div>;
}

function PortraitRhythm({ images }: { images: CampaignImage[] }) {
  // For all-portrait sets: hero, then alternating pairs with shifted alignment
  const blocks: React.ReactNode[] = [];
  if (images.length > 0) {
    blocks.push(
      <div key="hero" className="container-edge">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <Frame
              image={images[0]}
              sizes="(min-width:768px) 66vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  for (let i = 1; i < images.length; i += 2) {
    const a = images[i];
    const b = images[i + 1];
    const shift = Math.floor(i / 2) % 2 === 0;
    if (!b) {
      blocks.push(
        <div key={`single-${i}`} className="container-edge">
          <div className="grid grid-cols-12">
            <div
              className={cn(
                "col-span-12",
                shift
                  ? "md:col-span-5 md:col-start-1"
                  : "md:col-span-5 md:col-start-8"
              )}
            >
              <Frame image={a} sizes="(min-width:768px) 42vw, 100vw" />
            </div>
          </div>
        </div>
      );
      continue;
    }
    blocks.push(
      <div key={`pair-${i}`} className="container-edge">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div
            className={cn(
              "col-span-12",
              shift ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-2"
            )}
          >
            <Frame image={a} sizes="(min-width:768px) 42vw, 100vw" />
          </div>
          <div
            className={cn(
              "col-span-12",
              shift ? "md:col-span-6 md:col-start-7" : "md:col-span-5 md:col-start-8"
            )}
          >
            <Frame image={b} sizes="(min-width:768px) 42vw, 100vw" />
          </div>
        </div>
      </div>
    );
  }

  return <div className="space-y-8 md:space-y-16">{blocks}</div>;
}
