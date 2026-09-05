import Link from "next/link";
import { ArrowRight, BookOpen, FolderOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { getSession } from "@/lib/session";
import { TIERS } from "@/lib/tiers";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4">
        <section className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
            The First Spark
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            The members-only side of the Sparkverse
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Exclusive posts, downloadable resources, and early access to new
            tools — gated by tier, open to everyone who joins.
          </p>
          <div className="flex gap-3">
            {session ? (
              <Button size="lg" render={<Link href="/dashboard" />}>
                Go to your dashboard <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button size="lg" render={<Link href="/sign-up" />}>
                  Join free <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" size="lg" render={<Link href="/sign-in" />}>
                  Sign in
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <BookOpen className="size-6 text-amber-400" />
              <CardTitle>Member posts</CardTitle>
              <CardDescription>
                Long-form writing and updates that never hit the public site.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FolderOpen className="size-6 text-amber-400" />
              <CardTitle>Resource vault</CardTitle>
              <CardDescription>
                Templates, files, and links collected in one place.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="size-6 text-amber-400" />
              <CardTitle>Tiered access</CardTitle>
              <CardDescription>
                Free gets you in the door. Pro and Lifetime unlock the vault.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="pb-24">
          <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">
            Membership tiers
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <Card key={tier.id} className={tier.id === "PRO" ? "border-amber-400/50" : undefined}>
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between">
                    {tier.name}
                    <span className="text-sm font-normal text-muted-foreground">
                      {tier.price}
                    </span>
                  </CardTitle>
                  <CardDescription>{tier.blurb}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
