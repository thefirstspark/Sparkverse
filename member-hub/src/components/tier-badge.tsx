import type { MembershipTier } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { tierLabel } from "@/lib/tiers";

const STYLES: Record<MembershipTier, string> = {
  FREE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PRO: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  LIFETIME: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

export function TierBadge({ tier }: { tier: MembershipTier }) {
  return (
    <Badge variant="outline" className={STYLES[tier]}>
      {tierLabel(tier)}
    </Badge>
  );
}
