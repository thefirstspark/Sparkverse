import Link from "next/link";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { toolHref } from "@/lib/catalog";
import { ZONE_LABELS } from "@/lib/planets";
import type { CatalogTool } from "@/types/catalog";

export function ToolCard({ tool }: { tool: CatalogTool }) {
  const href = toolHref(tool);
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="sv-card block p-4 no-underline transition hover:border-white/25 hover:bg-white/[0.05]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.08em] text-white">
          {tool.title}
        </h3>
        <StatusBadge tier={tool.tier} />
      </div>
      <p className="mb-3 text-xs leading-relaxed text-white/50">
        {tool.blurb ?? ZONE_LABELS[tool.zone]}
      </p>
      <p className="font-mono text-[0.62rem] tracking-[0.14em] text-white/35 uppercase">
        {ZONE_LABELS[tool.zone]}
      </p>
    </Link>
  );
}
