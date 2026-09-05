import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FolderOpen, MailWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/profile-form";
import { SiteHeader } from "@/components/site-header";
import { TierPanel } from "@/components/tier-panel";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { tierAtLeast, tierLabel } from "@/lib/tiers";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();

  const [posts, resources] = await Promise.all([
    prisma.post.findMany({ where: { published: true }, select: { minimumTier: true } }),
    prisma.resource.findMany({ where: { published: true }, select: { minimumTier: true } }),
  ]);
  const unlockedPosts = posts.filter((p) => tierAtLeast(user.membershipTier, p.minimumTier)).length;
  const unlockedResources = resources.filter((r) =>
    tierAtLeast(user.membershipTier, r.minimumTier)
  ).length;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            {user.email} · <Badge variant="secondary">{tierLabel(user.membershipTier)}</Badge>
          </p>
        </div>

        {!user.emailVerified && (
          <Card className="border-amber-400/40">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <MailWarning className="size-5 shrink-0 text-amber-400" />
              <div>
                <CardTitle className="text-base">Verify your email</CardTitle>
                <CardDescription>
                  We sent a verification link when you signed up. In development it lands in the{" "}
                  <Link href="/dev/mailbox" className="underline underline-offset-4">
                    dev mailbox
                  </Link>
                  .
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="size-4 text-amber-400" /> Posts
              </CardTitle>
              <CardDescription>
                {unlockedPosts} of {posts.length} unlocked on your tier.{" "}
                <Link href="/posts" className="underline underline-offset-4">
                  Read →
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderOpen className="size-4 text-amber-400" /> Resources
              </CardTitle>
              <CardDescription>
                {unlockedResources} of {resources.length} unlocked on your tier.{" "}
                <Link href="/resources" className="underline underline-offset-4">
                  Browse →
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Separator />

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Membership</h2>
            <p className="text-sm text-muted-foreground">
              Upgrades are simulated until Stripe keys are configured — no card is charged.
            </p>
          </div>
          <TierPanel current={user.membershipTier} />
        </section>

        <Separator />

        <section className="flex max-w-lg flex-col gap-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <ProfileForm name={user.name} bio={user.bio ?? null} />
        </section>
      </main>
    </>
  );
}
