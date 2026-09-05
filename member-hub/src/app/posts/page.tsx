import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { TierBadge } from "@/components/tier-badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { tierAtLeast } from "@/lib/tiers";

export const metadata: Metadata = { title: "Posts" };

export default async function PostsPage() {
  const user = await requireUser();
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Member posts</h1>
          <p className="text-muted-foreground">Writing that never hits the public site.</p>
        </div>
        {posts.length === 0 && (
          <p className="text-muted-foreground">Nothing published yet — check back soon.</p>
        )}
        <div className="flex flex-col gap-4">
          {posts.map((post) => {
            const unlocked = tierAtLeast(user.membershipTier, post.minimumTier);
            return (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="transition-colors hover:border-amber-400/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TierBadge tier={post.minimumTier} />
                      {!unlocked && <Lock className="size-3.5 text-muted-foreground" />}
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>
                      {post.excerpt ?? "Read more →"}
                      <span className="mt-1 block text-xs">
                        by {post.author.name} ·{" "}
                        {post.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
