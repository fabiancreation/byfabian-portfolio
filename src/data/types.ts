export type Aspect = "portrait" | "landscape" | "square";

export type CampaignImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspect: Aspect;
  feature?: boolean;
};

export type Model = {
  slug: string;
  name: string;
  bio?: string;
};

export type Campaign = {
  slug: string;
  title: string;
  number: string;
  modelSlug: string;
  modelName: string;
  category: string;
  year: number;
  tagline: string;
  description: string;
  tools: string[];
  cover: string;
  coverAspect: Aspect;
  images: CampaignImage[];
};
