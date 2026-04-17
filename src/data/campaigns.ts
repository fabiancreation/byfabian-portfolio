// Public data layer. All state comes from the generated file which is rebuilt
// by `npm run sync` whenever campaign folders, images, or metadata change.
import { campaigns, models } from "./campaigns.generated";
import type { Campaign } from "./types";

export { campaigns, models };
export type { Aspect, Campaign, CampaignImage, Model } from "./types";

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

export function getAdjacentCampaigns(slug: string) {
  const i = campaigns.findIndex((c) => c.slug === slug);
  const next = campaigns[(i + 1) % campaigns.length];
  const prev = campaigns[(i - 1 + campaigns.length) % campaigns.length];
  return { next, prev };
}
