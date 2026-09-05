import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";
import { getSession } from "@/lib/session";
import { tierLabel } from "@/lib/tiers";
import type { MembershipTier } from "@prisma/client";

export async function SiteHeader() {
  const session = await getSession();
  const tier = session?.user
    ? ((session.user as { membershipTier?: string }).membershipTier as MembershipTier | undefined)
    : undefined;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="size-5 text-amber-400" />
          Sparkverse Member Hub
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/posts" className="hover:text-foreground transition-colors">
            Posts
          </Link>
          <Link href="/resources" className="hover:text-foreground transition-colors">
            Resources
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              {tier && <Badge variant="secondary">{tierLabel(tier)}</Badge>}
              <Button variant="outline" size="sm" render={<Link href="/dashboard" />}>
                Dashboard
              </Button>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/sign-in" />}>
                Sign in
              </Button>
              <Button size="sm" render={<Link href="/sign-up" />}>
                Join free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
