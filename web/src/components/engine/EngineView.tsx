"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/catalog/StatusBadge";
import { EngineFrame } from "@/components/engine/EngineFrame";
import { originUrl } from "@/lib/catalog";
import { ZONE_LABELS } from "@/lib/planets";
import type { CatalogTool } from "@/types/catalog";

export function EngineView({ tool }: { tool: CatalogTool }) {
  const src = originUrl(tool);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col md:h-[calc(100dvh-4rem)]">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.2em] text-cyan-300 uppercase">
            Engine · {ZONE_LABELS[tool.zone]}
          </p>
          <h1 className="truncate font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.1em]">
            {tool.title}
          </h1>
        </div>
        <StatusBadge tier={tool.tier} />
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-white/15 px-3 py-2 font-mono text-[0.62rem] tracking-[0.12em] text-white/70 uppercase no-underline sm:inline-flex"
        >
          New tab
        </a>
        <Link
          href="/workshop"
          className="rounded-full border border-white/15 px-3 py-2 font-mono text-[0.62rem] tracking-[0.12em] text-white/70 uppercase no-underline"
        >
          Workshop
        </Link>
      </div>
      <EngineFrame slug={tool.id} src={src} title={tool.title} trustedSameOrigin />
    </div>
  );
}
