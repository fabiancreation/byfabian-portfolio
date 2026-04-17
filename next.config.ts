import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048],
    imageSizes: [256, 384, 512, 640, 768, 896, 1024],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default config;
