import { Card } from "@/components/ui/Card";
import { PLANS } from "@/lib/plans";

export default function TreasuryPage() {
  const plans = [PLANS.lobby, PLANS.player, PLANS.soulMap];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Plans
      </p>
      <h1 className="gradient-text mb-8 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        TREASURY
      </h1>
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
            <p className="mt-3 font-mono text-[0.6rem] text-white/30">{plan.planId}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
