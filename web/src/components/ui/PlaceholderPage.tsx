import { Card } from "@/components/ui/Card";

export function PlaceholderPage({
  title,
  kicker,
  body,
}: {
  title: string;
  kicker: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        {kicker}
      </p>
      <h1 className="gradient-text mb-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        {title}
      </h1>
      <Card>
        <p className="text-sm leading-relaxed text-white/60">{body}</p>
      </Card>
    </div>
  );
}
