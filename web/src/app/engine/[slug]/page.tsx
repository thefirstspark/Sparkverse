import { notFound, redirect } from "next/navigation";
import { EngineView } from "@/components/engine/EngineView";
import { getTool } from "@/lib/catalog";

export default async function EnginePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  if (tool.id === "soul-map") redirect("/vault");

  return <EngineView tool={tool} />;
}
