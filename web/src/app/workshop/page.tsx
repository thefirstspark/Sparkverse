import { ToolCard } from "@/components/catalog/ToolCard";
import { toolsByZone } from "@/lib/catalog";
import { PLANETS } from "@/lib/planets";
import { TOOL_ZONES } from "@/types/catalog";

export default function WorkshopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Tools by zone
      </p>
      <h1 className="gradient-text mb-8 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        WORKSHOP
      </h1>
      <div className="space-y-10">
        {TOOL_ZONES.map((zone) => {
          const planet = PLANETS.find((p) => p.id === zone);
          const tools = toolsByZone(zone);
          if (!tools.length) return null;
          return (
            <section key={zone}>
              <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.16em] text-white">
                {planet?.name ?? zone}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
