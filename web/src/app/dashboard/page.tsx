import Link from "next/link";
import { Card } from "@/components/ui/Card";

const LINKS = [
  { href: "/workshop", label: "Workshop", blurb: "Tools by zone" },
  { href: "/vault", label: "Vault", blurb: "Soul Maps and Color Codex" },
  { href: "/treasury", label: "Treasury", blurb: "Lobby, Players, Soul Map" },
  { href: "/gate", label: "Gate", blurb: "Join a live plan" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Player home
      </p>
      <h1 className="gradient-text mb-3 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        DASHBOARD
      </h1>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/55">
        Continue / activations after sign-in. This pass is a hub only — no Whop session yet.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="no-underline">
            <Card className="h-full transition hover:border-white/25">
              <h2 className="mb-1 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.12em] text-white">
                {link.label}
              </h2>
              <p className="text-sm text-white/50">{link.blurb}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
