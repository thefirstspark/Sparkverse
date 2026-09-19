export const TOOL_TIERS = ["public", "lobby", "player", "shop"] as const;
export type ToolTier = (typeof TOOL_TIERS)[number];

export const TOOL_ZONES = [
  "core",
  "lumina",
  "playground",
  "nexus",
  "void",
  "forge",
  "archive",
  "echo",
  "genesis",
] as const;
export type ToolZone = (typeof TOOL_ZONES)[number];

export type TierMeta = {
  label: string;
  blurb: string;
  planId?: string;
  productId?: string;
};

export type CatalogTool = {
  id: string;
  title: string;
  url: string;
  zone: ToolZone;
  tier: ToolTier;
  blurb?: string;
};

export type ToolsCatalog = {
  tiers: Record<ToolTier, TierMeta>;
  tools: CatalogTool[];
};
