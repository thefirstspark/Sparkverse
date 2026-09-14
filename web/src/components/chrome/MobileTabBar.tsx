"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/nav";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-stretch border-t border-white/10 bg-[#050508]/95 md:hidden"
    >
      {PRIMARY_NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 text-[0.55rem] tracking-[0.1em] uppercase ${
              active ? "text-white" : "text-white/45"
            }`}
          >
            <Icon size={20} strokeWidth={1.75} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
