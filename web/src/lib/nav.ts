import type { LucideIcon } from "lucide-react";
import { BookOpen, Coins, Hammer, Orbit, Vault } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Galaxy", icon: Orbit },
  { href: "/workshop", label: "Workshop", icon: Hammer },
  { href: "/vault", label: "Vault", icon: Vault },
  { href: "/codex", label: "Codex", icon: BookOpen },
  { href: "/treasury", label: "Treasury", icon: Coins },
];
