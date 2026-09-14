import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-cyan-300 uppercase">
        Search & filter
      </p>
      <h1 className="gradient-text mb-8 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.18em]">
        CATALOG
      </h1>
      <CatalogBrowser initialQuery={q ?? ""} />
    </div>
  );
}
