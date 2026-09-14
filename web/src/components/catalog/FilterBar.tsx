"use client";

import { TIER_META } from "@/lib/catalog";
import { ZONE_LABELS } from "@/lib/planets";
import { TOOL_TIERS, TOOL_ZONES, type ToolTier, type ToolZone } from "@/types/catalog";

type Props = {
  query: string;
  zone: ToolZone | "all";
  tier: ToolTier | "all";
  onQuery: (value: string) => void;
  onZone: (value: ToolZone | "all") => void;
  onTier: (value: ToolTier | "all") => void;
};

const selectClass =
  "h-10 rounded-2xl border border-white/10 bg-white/5 px-3 font-mono text-xs text-white focus:border-cyan-400/60 focus:outline-none";

export function FilterBar({ query, zone, tier, onQuery, onZone, onTier }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="catalog-q">
        Filter tools
      </label>
      <input
        id="catalog-q"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Filter by name…"
        className="h-10 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 font-mono text-sm text-white placeholder:text-white/35 focus:border-cyan-400/60 focus:outline-none"
      />
      <select
        aria-label="Zone"
        className={selectClass}
        value={zone}
        onChange={(e) => onZone(e.target.value as ToolZone | "all")}
      >
        <option value="all">All zones</option>
        {TOOL_ZONES.map((z) => (
          <option key={z} value={z}>
            {ZONE_LABELS[z]}
          </option>
        ))}
      </select>
      <select
        aria-label="Tier"
        className={selectClass}
        value={tier}
        onChange={(e) => onTier(e.target.value as ToolTier | "all")}
      >
        <option value="all">All tiers</option>
        {TOOL_TIERS.map((t) => (
          <option key={t} value={t}>
            {TIER_META[t].label}
          </option>
        ))}
      </select>
    </div>
  );
}
