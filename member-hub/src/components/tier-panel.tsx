"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MembershipTier } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { changeTier } from "@/lib/actions";
import { TIERS } from "@/lib/tiers";

export function TierPanel({ current }: { current: MembershipTier }) {
  const router = useRouter();
  const [pending, setPending] = useState<MembershipTier | null>(null);

  async function onChange(tier: MembershipTier) {
    setPending(tier);
    const result = await changeTier(tier);
    setPending(null);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      tier === "FREE" ? "Downgraded to Free." : `You're now on ${tier === "PRO" ? "Pro" : "Lifetime"}. (Simulated checkout — no card charged.)`
    );
    router.refresh();
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TIERS.map((tier) => {
        const isCurrent = tier.id === current;
        return (
          <Card key={tier.id} className={isCurrent ? "border-amber-400/60" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {tier.name}
                {isCurrent && <Badge>Current</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="block font-medium text-foreground">{tier.price}</span>
                {tier.blurb}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={isCurrent ? "secondary" : "default"}
                size="sm"
                className="w-full"
                disabled={isCurrent || pending !== null}
                onClick={() => onChange(tier.id)}
              >
                {isCurrent
                  ? "Your plan"
                  : pending === tier.id
                    ? "Switching…"
                    : `Switch to ${tier.name}`}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
