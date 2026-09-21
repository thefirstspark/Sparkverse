"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SignOutButton, usePlayer } from "@/components/chrome/PlayerGate";

export function TopBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const player = usePlayer();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center gap-3 border-b border-white/10 bg-[#050508]/95 px-4 md:left-16">
      <Link
        href="/"
        className="gradient-text font-[family-name:var(--font-display)] text-sm font-black tracking-[0.28em] no-underline md:text-base"
      >
        SPARKVERSE
      </Link>
      <form onSubmit={onSearch} className="mx-auto hidden min-w-0 flex-1 max-w-xl sm:block">
        <label className="sr-only" htmlFor="os-search">
          Search tools
        </label>
        <input
          id="os-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the catalog…"
          className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 font-mono text-sm text-white placeholder:text-white/35 focus:border-cyan-400/60 focus:outline-none"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/dashboard"
          className="hidden h-10 items-center px-2 font-mono text-[0.62rem] tracking-[0.14em] text-white/55 uppercase no-underline hover:text-white sm:inline-flex"
        >
          {player.name || player.email?.split("@")[0] || "You"}
        </Link>
        <SignOutButton />
      </div>
    </header>
  );
}
