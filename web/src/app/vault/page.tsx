import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ColorCodexBadge } from "@/components/vault/ColorCodexBadge";
import { MASTERS, RADIANTS } from "@/lib/color-codex";
import { COLOR_WHEEL, PLANS, SOUL_MAP_PREVIEW } from "@/lib/plans";

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Holdings
      </p>
      <h1 className="gradient-text mb-3 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        VAULT
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
        Soul Maps you own will land here. The map&apos;s own Color Codex badge is the source of truth
        for tier and color — never the archive card. Sign-in and entitlements come in a later pass.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
            Buy a Soul Map
          </h2>
          <p className="mb-4 flex-1 text-sm text-white/55">{PLANS.soulMap.blurb}</p>
          <a
            href={PLANS.soulMap.canonical}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f97316] px-4 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.14em] text-[#050508] uppercase no-underline"
          >
            {PLANS.soulMap.price} · map.html
          </a>
        </Card>
        <Card className="flex flex-col">
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
            Free preview
          </h2>
          <p className="mb-4 flex-1 text-sm text-white/55">
            Pattern generator only. Never confuse this with the paid map.
          </p>
          <a
            href={SOUL_MAP_PREVIEW}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-4 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.14em] uppercase no-underline"
          >
            Soul pattern generator
          </a>
        </Card>
      </div>

      <Card className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
            Color Codex
          </h2>
          <a href={COLOR_WHEEL} className="text-xs text-cyan-300 no-underline">
            Open the wheel
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {RADIANTS.map((radiant) => (
            <ColorCodexBadge key={radiant.radiant} radiant={radiant} />
          ))}
        </div>
        <p className="mt-4 mb-2 font-mono text-[0.62rem] tracking-[0.16em] text-white/40 uppercase">
          Masters · Moonsilvered
        </p>
        <div className="flex flex-wrap gap-2">
          {MASTERS.map((master) => (
            <span
              key={master.master}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-1"
            >
              <span
                className="size-3 rounded-full"
                style={{ background: master.hex, boxShadow: `0 0 0 2px ${master.base.hex}` }}
                aria-hidden
              />
              <span className="font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.12em] uppercase">
                {master.master} · {master.light}
              </span>
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
          Your maps
        </h2>
        <p className="mb-4 text-sm text-white/50">
          Empty until identity is wired. Owned maps will deep-link to{" "}
          <span className="font-mono text-white/70">soul-maps.thefirstspark.shop/{"{code}"}.html</span>.
        </p>
        <Link href="/login" className="text-sm text-cyan-300">
          Sign in
        </Link>
        <span className="mx-2 text-white/25">·</span>
        <Link href="/treasury" className="text-sm text-cyan-300">
          Treasury
        </Link>
        <span className="mx-2 text-white/25">·</span>
        <Link href="/dashboard" className="text-sm text-cyan-300">
          Dashboard
        </Link>
      </Card>
    </div>
  );
}
