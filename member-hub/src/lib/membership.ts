import { MembershipTier } from "@/lib/auth-client";

export const TIER_ORDER: Record<MembershipTier, number> = {
  FREE: 0,
  PRO: 1,
  LIFETIME: 2,
};

export const TIER_LABELS: Record<MembershipTier, string> = {
  FREE: "Free",
  PRO: "Pro",
  LIFETIME: "Lifetime",
};

/**
 * Returns true when `userTier` is at least `requiredTier`.
 * FREE = any logged-in member, PRO = Pro + Lifetime, LIFETIME = Lifetime only.
 */
export function hasTierAccess(userTier: MembershipTier | undefined | null, requiredTier: MembershipTier): boolean {
  return TIER_ORDER[userTier ?? "FREE"] >= TIER_ORDER[requiredTier];
}

export function isPaidTier(tier: MembershipTier) {
  return tier === "PRO" || tier === "LIFETIME";
}
