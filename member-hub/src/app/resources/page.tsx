import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, Film, Headphones, Link2, Lock, Paperclip } from "lucide-react";
import type { ResourceType } from "@prisma/client";
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

export const metadata: Metadata = { title: "Resources" };

const TYPE_ICONS: Record<ResourceType, typeof FileText> = {
  DOCUMENT: FileText,
  VIDEO: Film,
  AUDIO: Headphones,
  LINK: Link2,
  FILE: Paperclip,
};

export default async function ResourcesPage() {
  const user = await requireUser();
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resource vault</h1>
          <p className="text-muted-foreground">Templates, files, and links for members.</p>
        </div>
        {resources.length === 0 && (
          <p className="text-muted-foreground">The vault is empty — check back soon.</p>
        )}
        <div className="flex flex-col gap-4">
          {resources.map((resource) => {
            const unlocked = tierAtLeast(user.membershipTier, resource.minimumTier);
            const Icon = TYPE_ICONS[resource.type];
            return (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-amber-400" />
                    <TierBadge tier={resource.minimumTier} />
                    {resource.sizeLabel && (
                      <span className="text-xs text-muted-foreground">{resource.sizeLabel}</span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {resource.description && (
                    <CardDescription>{resource.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {unlocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      render={<a href={resource.url} target="_blank" rel="noopener noreferrer" />}
                    >
                      Open <ExternalLink className="size-3.5" />
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" render={<Link href="/dashboard" />}>
                      <Lock className="size-3.5" />
                      Requires {tierLabel(resource.minimumTier)}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
