import Link from "next/link";
import { Card } from "@/components/ui/Card";

const LIVE = "https://sparkverse.thefirstspark.shop";
const SHOP = "https://thefirstspark.shop";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        You
      </p>
      <h1 className="gradient-text mb-3 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        YOUR STUFF
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
        Player home. Galaxy is the world. This page is what you own and how to open it.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link href="/" className="no-underline sm:col-span-2">
          <Card className="transition hover:border-amber-300/40">
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-white">
              Galaxy · the planets
            </h2>
            <p className="text-sm text-white/50">
              Core, Lumina, Playground, Nexus, Void, Forge, DNA, Echo, Genesis. Each one is labeled.
            </p>
          </Card>
        </Link>
        <Link href="/workshop" className="no-underline">
          <Card className="h-full transition hover:border-white/25">
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-white">
              Workshop
            </h2>
            <p className="text-sm text-white/50">Tools you can hold.</p>
          </Card>
        </Link>
        <Link href="/vault" className="no-underline">
          <Card className="h-full transition hover:border-white/25">
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-white">
              Vault
            </h2>
            <p className="text-sm text-white/50">Soul Maps and the Color Codex.</p>
          </Card>
        </Link>
      </div>

      <Card className="mb-4">
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
          Soul Map · $22 once
        </h2>
        <p className="mb-4 text-sm text-white/55">
          A private page about you. We emailed the link. Lost it? Archive, initials plus a date code.
        </p>
        <a href="https://soul-maps.thefirstspark.shop/archive.html" className="text-sm text-cyan-300">
          Find my map
        </a>
      </Card>
      <Card className="mb-4">
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
          Players Lounge · $11 / month
        </h2>
        <p className="mb-4 text-sm text-white/55">
          PayPal emails the door. Cancel in PayPal, not here.
        </p>
        <a href={`${SHOP}/playerslounge/`} className="text-sm text-cyan-300">
          Lounge · billing
        </a>
      </Card>
      <Card className="mb-8">
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em]">
          Discord · optional
        </h2>
        <p className="mb-4 text-sm text-white/55">
          Group chat. A free Discord account the first time is normal.
        </p>
        <a href="https://discord.gg/sAysXgrqcX" className="text-sm text-cyan-300">
          Open Discord
        </a>
        <span className="mx-2 text-white/25">·</span>
        <a href="mailto:kate@thefirstspark.shop" className="text-sm text-cyan-300">
          Email Kate
        </a>
        <span className="mx-2 text-white/25">·</span>
        <a href={LIVE} className="text-sm text-cyan-300">
          Live galaxy
        </a>
      </Card>
    </div>
  );
}
