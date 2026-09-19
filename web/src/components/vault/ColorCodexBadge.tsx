import { radiantByCode, type Radiant } from "@/lib/color-codex";

export function ColorCodexBadge({
  code,
  radiant,
}: {
  code?: string;
  radiant?: Radiant;
}) {
  const badge = radiant ?? (code ? radiantByCode(code) : undefined);
  if (!badge) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-2.5 py-1">
      <span className="size-3 rounded-full" style={{ background: badge.hex }} aria-hidden />
      <span className="font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.12em] uppercase">
        {badge.radiant} · {badge.name}
      </span>
    </span>
  );
}
