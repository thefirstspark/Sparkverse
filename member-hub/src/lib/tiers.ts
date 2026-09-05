import type { MembershipTier } from "@prisma/client";

const TIER_ORDER: Record<MembershipTier, number> = {
  FREE: 0,
  PRO: 1,
  LIFETIME: 2,
};

export const TIERS: {
  id: MembershipTier;
  name: string;
  price: string;
  blurb: string;
}[] = [
  { id: "FREE", name: "Free", price: "$0", blurb: "Community access and free member content." },
  { id: "PRO", name: "Pro", price: "$9/mo", blurb: "Everything in Free plus Pro posts and resources." },
  { id: "LIFETIME", name: "Lifetime", price: "$149 once", blurb: "Every tier, forever. One payment." },
];

export function tierAtLeast(tier: MembershipTier, minimum: MembershipTier) {
  return TIER_ORDER[tier] >= TIER_ORDER[minimum];
}

export function tierLabel(tier: MembershipTier) {
  return TIERS.find((t) => t.id === tier)?.name ?? tier;
}
