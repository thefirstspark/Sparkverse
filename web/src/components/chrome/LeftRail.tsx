"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/nav";

export function LeftRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 z-40 hidden h-dvh w-16 flex-col items-center border-r border-white/10 bg-[#050508]/95 pt-16 md:flex"
    >
      {PRIMARY_NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            aria-current={active ? "page" : undefined}
            className={`flex h-16 w-16 flex-col items-center justify-center gap-1 text-[0.55rem] tracking-[0.12em] uppercase ${
              active ? "text-white" : "text-white/45 hover:text-white"
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
