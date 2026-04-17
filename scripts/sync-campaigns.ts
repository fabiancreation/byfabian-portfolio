/**
 * Sync pipeline — run after adding, renaming, or replacing image folders.
 * One command: `npm run sync`
 *
 * Walks `Images/<Model>/<Campaign>/*.{png,jpg,jpeg}` and for each:
 *   1. Optimises every image to public/images/<model>/<campaign>/ (AVIF, WebP, JPG at 3 widths).
 *   2. Writes/updates a manifest.json listing frames, widths, aspects.
 *   3. Preserves campaign.json metadata (title/category/tagline/…) if present, else creates a stub.
 *   4. Writes a model.json stub at public/images/<model>/ if none exists.
 *   5. Generates src/data/campaigns.generated.ts — the single source of truth the app reads.
 *
 * Folder name → slug (e.g. "Bomber Jacket" → "bomber-jacket"). Frame order comes from
 * filenames in natural-numeric order.
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile, stat, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC_ROOT = join(ROOT, "Images");
const OUT_ROOT = join(ROOT, "public", "images");
const DATA_FILE = join(ROOT, "src", "data", "campaigns.generated.ts");

const SIZES = [
  { w: 800, suffix: "sm" },
  { w: 1400, suffix: "md" },
  { w: 2000, suffix: "lg" },
];

// -- helpers --------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(s: string): string {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

async function ensureDir(p: string) {
  await mkdir(p, { recursive: true });
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson(path: string, data: unknown) {
  await writeFile(path, JSON.stringify(data, null, 2) + "\n");
}

// -- types ----------------------------------------------------------

type Aspect = "portrait" | "landscape" | "square";

type ImageEntry = {
  id: string;
  base: string;
  width: number;
  height: number;
  aspect: Aspect;
};

type Manifest = {
  model: string;
  campaign: string;
  source: string;
  images: ImageEntry[];
};

type CampaignMeta = {
  title: string;
  number: string;
  category: string;
  year: number;
  tagline: string;
  description: string;
  tools: string[];
  featureIds?: string[];
  order?: number;
};

type ModelMeta = {
  name: string;
  bio?: string;
};

type GeneratedCampaign = Manifest & {
  slug: string;
  modelSlug: string;
  modelName: string;
  meta: CampaignMeta;
};

// -- image optimisation --------------------------------------------

async function listSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(png|jpe?g)$/i.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)?.[1] || "0", 10);
      const nb = parseInt(b.match(/(\d+)/)?.[1] || "0", 10);
      return na - nb || a.localeCompare(b);
    });
}

async function optimiseCampaign(
  srcDir: string,
  outDir: string,
  modelSlug: string,
  campaignSlug: string,
  sourceName: string,
): Promise<Manifest> {
  await ensureDir(outDir);
  const files = await listSourceFiles(srcDir);
  const entries: ImageEntry[] = [];

  console.log(`  ${campaignSlug} (${files.length} frames)`);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = join(srcDir, file);
    const id = String(i + 1).padStart(2, "0");
    const base = id;

    const meta = await sharp(srcPath, { failOn: "none" }).metadata();
    const width = meta.width || 0;
    const height = meta.height || 0;
    const ratio = width / height;
    const aspect: Aspect = ratio > 1.1 ? "landscape" : ratio < 0.9 ? "portrait" : "square";

    const biggestJpg = [...SIZES].reverse().find((s) => width >= s.w) || SIZES[SIZES.length - 1];

    for (const { w, suffix } of SIZES) {
      if (width < w) continue;
      const outAvif = join(outDir, `${base}-${suffix}.avif`);
      const outWebp = join(outDir, `${base}-${suffix}.webp`);
      if (!existsSync(outAvif)) {
        await sharp(srcPath)
          .resize({ width: w, withoutEnlargement: true })
          .toFormat("avif", { quality: 62, effort: 4 })
          .toFile(outAvif);
      }
      if (!existsSync(outWebp)) {
        await sharp(srcPath)
          .resize({ width: w, withoutEnlargement: true })
          .toFormat("webp", { quality: 78 })
          .toFile(outWebp);
      }
    }
    const outJpg = join(outDir, `${base}.jpg`);
    if (!existsSync(outJpg)) {
      await sharp(srcPath)
        .resize({ width: biggestJpg.w, withoutEnlargement: true })
        .toFormat("jpeg", { quality: 82, mozjpeg: true })
        .toFile(outJpg);
    }

    entries.push({ id, base, width, height, aspect });
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  const manifest: Manifest = {
    model: modelSlug,
    campaign: campaignSlug,
    source: sourceName,
    images: entries,
  };
  await writeJson(join(outDir, "manifest.json"), manifest);
  return manifest;
}

// -- metadata stubs -------------------------------------------------

function stubCampaignMeta(sourceName: string, order: number): CampaignMeta {
  return {
    title: titleCase(sourceName),
    number: String(order + 1).padStart(2, "0"),
    category: "Editorial",
    year: new Date().getFullYear(),
    tagline: "A new campaign. Fresh frames.",
    description:
      "A campaign description — swap this text with the brief, the feel, the reason the work exists.",
    tools: ["Flux 1.1", "ComfyUI"],
    featureIds: [],
    order,
  };
}

function stubModelMeta(name: string): ModelMeta {
  return {
    name: titleCase(name),
    bio: "",
  };
}

// -- TS data file generation ----------------------------------------

function stringify(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent);
}

function generateDataFile(
  campaigns: GeneratedCampaign[],
  models: { slug: string; meta: ModelMeta }[],
): string {
  const campaignObjects = campaigns
    .map((c) => {
      const images = c.images.map((img) => ({
        id: img.id,
        src: `/images/${c.modelSlug}/${c.campaign}/${img.base}.jpg`,
        alt: `${c.modelName} — ${c.meta.title} — frame ${img.id}`,
        width: img.width,
        height: img.height,
        aspect: img.aspect,
        feature: (c.meta.featureIds ?? []).includes(img.id),
      }));
      const coverImage = images[0];
      const obj = {
        slug: c.slug,
        title: c.meta.title,
        number: c.meta.number,
        modelSlug: c.modelSlug,
        modelName: c.modelName,
        category: c.meta.category,
        year: c.meta.year,
        tagline: c.meta.tagline,
        description: c.meta.description,
        tools: c.meta.tools,
        cover: coverImage.src,
        coverAspect: coverImage.aspect,
        images,
      };
      return stringify(obj, 2);
    })
    .join(",\n");

  const modelObjects = models
    .map((m) =>
      stringify(
        { slug: m.slug, name: m.meta.name, bio: m.meta.bio ?? "" },
        2,
      ),
    )
    .join(",\n");

  return `// AUTO-GENERATED by scripts/sync-campaigns.ts — do not edit by hand.
// Campaign metadata lives in public/images/<model>/<campaign>/campaign.json.
// Model metadata lives in public/images/<model>/model.json.

import type { Aspect, Campaign, Model } from "./types";

export const models: Model[] = [
${modelObjects}
];

export const campaigns: Campaign[] = [
${campaignObjects}
];

export type { Aspect, Campaign, Model };
`;
}

// -- main ------------------------------------------------------------

async function main() {
  try {
    await stat(SRC_ROOT);
  } catch {
    console.error(`Source folder not found: ${SRC_ROOT}`);
    console.error(`Create it and add campaign folders under it, then re-run.`);
    process.exit(1);
  }
  await ensureDir(OUT_ROOT);

  const models: { slug: string; meta: ModelMeta }[] = [];
  const campaigns: GeneratedCampaign[] = [];

  const modelDirs = (await readdir(SRC_ROOT, { withFileTypes: true })).filter(
    (d) => d.isDirectory() && !d.name.startsWith("."),
  );

  for (const mdir of modelDirs) {
    const modelSlug = slugify(mdir.name);
    const modelPath = join(SRC_ROOT, mdir.name);
    const modelOut = join(OUT_ROOT, modelSlug);
    await ensureDir(modelOut);

    // Model metadata
    const modelMetaPath = join(modelOut, "model.json");
    let modelMeta = await readJson<ModelMeta>(modelMetaPath);
    if (!modelMeta) {
      modelMeta = stubModelMeta(mdir.name);
      await writeJson(modelMetaPath, modelMeta);
      console.log(`  + ${modelSlug}/model.json (stub created — fill it in)`);
    }
    models.push({ slug: modelSlug, meta: modelMeta });

    console.log(`\nModel: ${mdir.name} → ${modelSlug}`);

    const campaignDirs = (await readdir(modelPath, { withFileTypes: true })).filter(
      (d) => d.isDirectory() && !d.name.startsWith("."),
    );

    for (let i = 0; i < campaignDirs.length; i++) {
      const cdir = campaignDirs[i];
      const folderSlug = slugify(cdir.name);
      const campaignSlug = `${modelSlug}-${folderSlug}`;
      const srcDir = join(modelPath, cdir.name);
      const outDir = join(modelOut, folderSlug);

      const manifest = await optimiseCampaign(
        srcDir,
        outDir,
        modelSlug,
        folderSlug,
        cdir.name,
      );

      // Campaign metadata
      const metaPath = join(outDir, "campaign.json");
      let meta = await readJson<CampaignMeta>(metaPath);
      if (!meta) {
        meta = stubCampaignMeta(cdir.name, campaigns.length);
        await writeJson(metaPath, meta);
        console.log(
          `  + ${modelSlug}/${campaignSlug}/campaign.json (stub created — fill it in)`,
        );
      }

      campaigns.push({
        ...manifest,
        slug: campaignSlug,
        modelSlug,
        modelName: modelMeta.name,
        meta,
      });
    }
  }

  // Sort by explicit order, else by first-seen
  campaigns.sort((a, b) => {
    const ao = a.meta.order ?? 999;
    const bo = b.meta.order ?? 999;
    if (ao !== bo) return ao - bo;
    return a.slug.localeCompare(b.slug);
  });

  // Re-number based on final order
  campaigns.forEach((c, i) => {
    c.meta.number = String(i + 1).padStart(2, "0");
  });

  await ensureDir(join(ROOT, "src", "data"));
  await writeFile(DATA_FILE, generateDataFile(campaigns, models));

  console.log(`\nGenerated: ${DATA_FILE}`);
  console.log(`Done — ${campaigns.length} campaigns across ${models.length} model(s).\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
