import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Include 2400 so retina/4K devices can pick a size that isn't upscaled.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400],
    imageSizes: [256, 384, 512, 640, 768, 896, 1024],
    // Allowed quality presets (Next 15 requires explicit list for non-default qualities).
    qualities: [75, 85, 90, 92, 95],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default config;
