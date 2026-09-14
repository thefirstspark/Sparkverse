"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { toolsByZone, toolHref, isExternalTool } from "@/lib/catalog";
import type { Planet } from "@/lib/planets";

export function PlanetModal({
  planet,
  onClose,
}: {
  planet: Planet | null;
  onClose: () => void;
}) {
  const tools = planet ? toolsByZone(planet.id) : [];

  return (
    <AnimatePresence>
      {planet ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/97 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="planet-title"
            className="sv-card relative max-h-[90vh] w-full max-w-[620px] overflow-y-auto p-8"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/45 hover:text-hot-pink"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="mb-4 flex items-center gap-5">
              <div
                className="size-[72px] shrink-0 rounded-full"
                style={{ background: planet.icon }}
              />
              <div>
                <h3
                  id="planet-title"
                  className="gradient-text font-[family-name:var(--font-display)] text-xl font-bold tracking-[0.12em]"
                >
                  {planet.name}
                </h3>
                <p className="text-sm text-cyan-300">{planet.subtitle}</p>
              </div>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-white/45">{planet.description}</p>
            <h4 className="gradient-text mb-3 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.22em]">
              TOOLS IN THIS ZONE
            </h4>
            <div className="mb-6 flex flex-wrap gap-2">
              {tools.map((tool) => {
                const href = toolHref(tool);
                const external = isExternalTool(tool);
                return (
                  <Link
                    key={tool.id}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white no-underline hover:border-nebula hover:bg-violet-500/15"
                  >
                    {tool.title}
                  </Link>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/20 py-3 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.15em] uppercase"
              >
                Orbit
              </button>
              <Link
                href={planet.enterHref}
                className="flex-1 rounded-xl bg-gradient-to-br from-[#fbbf24] via-[#f97316] to-[#ec4899] py-3 text-center font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.15em] text-[#050508] uppercase no-underline"
              >
                {planet.action}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
