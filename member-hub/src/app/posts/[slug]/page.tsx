import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { TierBadge } from "@/components/tier-badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { tierAtLeast, tierLabel } from "@/lib/tiers";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true } });
  return { title: post?.title ?? "Post" };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const user = await requireUser();
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || !post.published) notFound();

  const unlocked = tierAtLeast(user.membershipTier, post.minimumTier);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-col gap-3">
          <div>
            <TierBadge tier={post.minimumTier} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            by {post.author.name} ·{" "}
            {post.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
        </div>

        {unlocked ? (
          <article className="whitespace-pre-wrap leading-7 text-foreground/90">
            {post.content}
          </article>
        ) : (
          <Card className="border-amber-400/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-4 text-amber-400" />
                This post is for {tierLabel(post.minimumTier)} members
              </CardTitle>
              <CardDescription>
                {post.excerpt ?? "Upgrade your membership to read the full post."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href="/dashboard" />}>
                Upgrade on your dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
