"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "@/components/catalog/FilterBar";
import { ToolCard } from "@/components/catalog/ToolCard";
import { searchTools } from "@/lib/catalog";
import type { ToolTier, ToolZone } from "@/types/catalog";

export function CatalogBrowser({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [zone, setZone] = useState<ToolZone | "all">("all");
  const [tier, setTier] = useState<ToolTier | "all">("all");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const tools = useMemo(() => {
    return searchTools(query).filter((tool) => {
      if (zone !== "all" && tool.zone !== zone) return false;
      if (tier !== "all" && tool.tier !== tier) return false;
      return true;
    });
  }, [query, zone, tier]);

  return (
    <>
      <FilterBar
        query={query}
        zone={zone}
        tier={tier}
        onQuery={setQuery}
        onZone={setZone}
        onTier={setTier}
      />
      <p className="mb-4 font-mono text-xs tracking-[0.12em] text-white/40 uppercase">
        {tools.length} tools
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </>
  );
}
