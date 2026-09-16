// Generated from repo-root tools-catalog.json by `npm run sync-catalog`.
import raw from "../../data/tools-catalog.json";
import type { CatalogTool, ToolTier, ToolsCatalog, ToolZone } from "@/types/catalog";
import { TOOL_TIERS, TOOL_ZONES } from "@/types/catalog";

const catalog = raw as ToolsCatalog;

export const TIER_META = catalog.tiers;

export const TOOLS: CatalogTool[] = catalog.tools;

export function isToolTier(value: string): value is ToolTier {
  return (TOOL_TIERS as readonly string[]).includes(value);
}

export function isToolZone(value: string): value is ToolZone {
  return (TOOL_ZONES as readonly string[]).includes(value);
}

export function toolsByZone(zone: ToolZone): CatalogTool[] {
  return TOOLS.filter((tool) => tool.zone === zone);
}

export function toolsByTier(tier: ToolTier): CatalogTool[] {
  return TOOLS.filter((tool) => tool.tier === tier);
}

export function getTool(id: string): CatalogTool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function searchTools(query: string): CatalogTool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((tool) => {
    const hay = `${tool.title} ${tool.blurb ?? ""} ${tool.zone} ${tool.tier}`.toLowerCase();
    return hay.includes(q);
  });
}

export function toolHref(tool: CatalogTool): string {
  if (tool.id === "soul-map") return "/vault";
  if (isExternalTool(tool)) return tool.url;
  return `/engine/${tool.id}`;
}

export function isExternalTool(tool: CatalogTool): boolean {
  return tool.url.startsWith("http://") || tool.url.startsWith("https://");
}

export function originUrl(tool: CatalogTool): string {
  if (tool.id === "soul-map") return "https://thefirstspark.shop/map.html";
  if (isExternalTool(tool)) return tool.url;
  const base = (process.env.NEXT_PUBLIC_LEGACY_ORIGIN ?? "https://sparkverse.thefirstspark.shop").replace(
    /\/$/,
    "",
  );
  return `${base}/${tool.url.replace(/^\//, "")}`;
}
