import { LeftRail } from "@/components/chrome/LeftRail";
import { MobileTabBar } from "@/components/chrome/MobileTabBar";
import { PlayerGate } from "@/components/chrome/PlayerGate";
import { TopBar } from "@/components/chrome/TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-void text-foreground">
      <div className="grid-overlay pointer-events-none fixed inset-0 z-0 opacity-80" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 10% 20%, rgba(139,92,246,.15), transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(236,72,153,.12), transparent 45%), linear-gradient(180deg, #050508, #0a0a12 50%, #050510)",
        }}
      />
      <PlayerGate>
        <TopBar />
        <LeftRail />
        <main className="relative z-10 min-h-dvh pt-16 pb-16 md:pr-0 md:pb-0 md:pl-16">
          {children}
        </main>
        <MobileTabBar />
      </PlayerGate>
    </div>
  );
}
