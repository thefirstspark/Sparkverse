import Link from "next/link";
import { ArrowRight, BookOpenText, Crown, FileDown, Infinity as InfinityIcon, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Join the community and get a taste of the hub.",
    features: ["Member dashboard", "Community posts", "1 free resource", "Email support"],
    cta: "Start free",
    highlighted: false,
    icon: Zap,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For members who want the full experience.",
    features: ["Everything in Free", "All exclusive posts", "Full resource library", "Monthly live Q&A", "Priority support"],
    cta: "Go Pro",
    highlighted: true,
    icon: Crown,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    description: "One payment. Everything forever.",
    features: ["Everything in Pro", "All future paid content", "Founder-only Discord role", "Lifetime access guarantee"],
    cta: "Go Lifetime",
    highlighted: false,
    icon: InfinityIcon,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span>Sparkverse Member Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Log in
            </Button>
            <Button size="sm" render={<Link href="/signup" />}>
              Join now <ArrowRight />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-5">
          Now open — founding members welcome
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Where <span className="text-primary">first sparks</span> become lasting movements.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          The private membership hub for The First Spark community. Exclusive essays,
          member-only resources, and a front-row seat to everything we build next.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/signup" />}>
            Create your free account <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="#pricing" />}>
            See membership
          </Button>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y bg-muted/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
          <div className="flex gap-3">
            <BookOpenText className="size-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Exclusive essays</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Deep dives and field notes {"you won't"} find anywhere else.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileDown className="size-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Member resources</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Templates, frameworks and assets for building in public.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Crown className="size-6 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">Tiered access</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Free, Pro and Lifetime — upgrade as you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose your access</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Start free forever. Upgrade when {"you're"} ready for the full member experience.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.name} className={tier.highlighted ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <tier.icon className="size-5 text-primary" />
                  {tier.highlighted && <Badge>Most popular</Badge>}
                </div>
                <CardTitle className="mt-3">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                  render={<Link href="/signup" />}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to see {"what's"} inside?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create your account in under a minute. Your first spark is waiting.
          </p>
          <div className="mt-8">
            <Button size="lg" render={<Link href="/signup" />}>
              Get started free <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Sparkverse Member Hub. All rights reserved.</span>
          <Link href="/" className="hover:text-foreground">
            thefirstspark.shop
          </Link>
        </div>
      </footer>
    </div>
  );
}
