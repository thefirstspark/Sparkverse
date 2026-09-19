import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PLANS } from "@/lib/plans";
import { firstParam, safeReturnPath } from "@/lib/search-params";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = firstParam((await searchParams).next);
  const plans = [PLANS.lobby, PLANS.player, PLANS.soulMap];
  const back = safeReturnPath(next);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Threshold
      </p>
      <h1 className="gradient-text mb-3 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        GATE
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
        Server entitlements are not in this pass. These are the live Whop plans. After you join, the
        engine still opens the live HTML tool until auth is wired.
      </p>
      {next && back === next ? (
        <p className="mb-6 font-mono text-xs text-white/40">Return path: {back}</p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.planId} className="flex flex-col">
            <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] text-white/50 uppercase">
              {plan.price}
            </p>
            <h2 className="mt-2 mb-3 font-[family-name:var(--font-display)] text-lg font-bold tracking-[0.08em]">
              {plan.name}
            </h2>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-white/55">{plan.blurb}</p>
            <a
              href={plan.href}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f97316] px-4 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.14em] text-[#050508] uppercase no-underline"
            >
              Enter
            </a>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-sm text-white/45">
        <Link href="/treasury" className="text-cyan-300">
          Treasury
        </Link>
        <span className="mx-2 text-white/25">·</span>
        <Link href="/workshop" className="text-cyan-300">
          Workshop
        </Link>
        <span className="mx-2 text-white/25">·</span>
        <Link href={back} className="text-cyan-300">
          Back
        </Link>
      </p>
    </div>
  );
}
