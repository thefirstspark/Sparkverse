import { TIER_META } from "@/lib/catalog";
import type { ToolTier } from "@/types/catalog";

const TIER_CLASS: Record<ToolTier, string> = {
  public: "border-white/20 text-white/70",
  lobby: "border-cyan-400/40 text-cyan-300",
  player: "border-violet-400/40 text-violet-300",
  shop: "border-amber-400/40 text-amber-300",
};

export function StatusBadge({ tier }: { tier: ToolTier }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.12em] uppercase ${TIER_CLASS[tier]}`}
    >
      {TIER_META[tier].label}
    </span>
  );
}
