import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getTool } from "@/lib/catalog";
import { LEGACY_ORIGIN } from "@/lib/plans";
import { ZONE_LABELS } from "@/lib/planets";

export default async function EnginePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const legacyUrl = tool.url.startsWith("http") ? tool.url : `${LEGACY_ORIGIN}/${tool.url}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Engine · {ZONE_LABELS[tool.zone]}
      </p>
      <h1 className="gradient-text mb-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.12em]">
        {tool.title}
      </h1>
      <Card>
        <p className="mb-4 text-sm leading-relaxed text-white/60">
          {tool.blurb ?? "Legacy tool. This frame will iframe the live HTML engine in a later pass."}
        </p>
        <p className="mb-6 font-mono text-xs text-white/40">{tool.url}</p>
        <a
          href={legacyUrl}
          className="inline-flex h-11 items-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f97316] px-5 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.14em] text-[#050508] uppercase no-underline"
        >
          Open live tool
        </a>
        <Link href="/workshop" className="ml-4 text-xs text-white/50 underline">
          Back to workshop
        </Link>
      </Card>
    </div>
  );
}
