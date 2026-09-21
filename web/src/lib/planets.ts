import type { ToolZone } from "@/types/catalog";

export type PlanetId = ToolZone;

export type Planet = {
  id: PlanetId;
  name: string;
  job: string;
  subtitle: string;
  description: string;
  action: string;
  enterHref: string;
  cssName: string;
  icon: string;
};

export const PLANETS: Planet[] = [
  {
    id: "core",
    name: "CORE SPARK",
    job: "you · maps",
    subtitle: "The Origin Point",
    description:
      "The central hub. Soul maps, origin stories, sovereignty dashboards, and the timeline of your evolution across dimensions.",
    action: "ENTER CORE",
    enterHref: "/dashboard",
    cssName: "sun",
    icon: "radial-gradient(circle at 30% 30%, #fff, #fbbf24, #f97316, #ec4899, #7c2d12)",
  },
  {
    id: "lumina",
    name: "LUMINA",
    job: "daily practice",
    subtitle: "Beginner Consciousness",
    description:
      "The gateway zone. Foundational practices, daily resets, energy check-ins — where awakening begins.",
    action: "ENTER LUMINA",
    enterHref: "/engine/daily-reset",
    cssName: "lumina",
    icon: "radial-gradient(circle at 25% 25%, #fff, #22d3d3, #0d9488, #064e3b)",
  },
  {
    id: "playground",
    name: "PLAYGROUND",
    job: "play",
    subtitle: "Experiment · Glitch · Play",
    description:
      "The free experimental zone. No rules, no hierarchy — just consciousness toys, canvases, arenas, and wild prototypes. Get lost here on purpose.",
    action: "ENTER PLAYGROUND",
    enterHref: "/engine/stardust-engine",
    cssName: "playground",
    icon: "radial-gradient(circle at 25% 25%, #ecfccb, #84cc16, #4d7c0f, #365314)",
  },
  {
    id: "nexus",
    name: "NEXUS",
    job: "tools",
    subtitle: "Interactive Tools Hub",
    description:
      "The workshop. Sigils, oracles, numerology, karma, patterns, archetypes — every instrument that transforms energy into clarity.",
    action: "ENTER NEXUS",
    enterHref: "/engine/tools-hub",
    cssName: "nexus",
    icon: "radial-gradient(circle at 25% 25%, #e9d5ff, #8b5cf6, #6d28d9, #4c1d95)",
  },
  {
    id: "void",
    name: "VOID STATION",
    job: "shadow work",
    subtitle: "Shadow Work & Deep Processing",
    description:
      "High intensity. Shadow integration, collapse and reset, digital wards, equilibrium — the work that happens in the dark.",
    action: "ENTER VOID",
    enterHref: "/engine/void-portal",
    cssName: "void",
    icon: "radial-gradient(circle at 25% 25%, #374151, #111827, #000)",
  },
  {
    id: "forge",
    name: "THE FORGE",
    job: "make",
    subtitle: "Reality Creation Tools",
    description:
      "Where intention becomes form. Protocols, planners, render engines, manifestation compilers — the heat that shapes reality.",
    action: "ENTER FORGE",
    enterHref: "/engine/spark-protocol",
    cssName: "forge",
    icon: "radial-gradient(circle at 25% 25%, #fef3c7, #fbbf24, #f97316, #9a3412)",
  },
  {
    id: "archive",
    name: "DNA CHAMBER",
    job: "lineage",
    subtitle: "The Lineage Layer",
    description:
      "Four living strands. Ancestral fire, selector choice, forge, orbit. Lineage work, origin keys, and the algorithmic soul.",
    action: "ENTER DNA CHAMBER",
    enterHref: "/engine/dna-chamber",
    cssName: "archive",
    icon: "radial-gradient(circle at 25% 25%, #ff6b3d, #c94c2a, #7c2d12)",
  },
  {
    id: "echo",
    name: "ECHO CHAMBER",
    job: "people",
    subtitle: "Community & Signal",
    description:
      "The signal zone. Players, walls, graffiti, members — amplify presence and connect with the living network.",
    action: "ENTER ECHO",
    enterHref: "/engine/players-lounge",
    cssName: "echo",
    icon: "radial-gradient(circle at 25% 25%, #a5f3fc, #06b6d4, #0891b2, #155e75)",
  },
  {
    id: "genesis",
    name: "GENESIS",
    job: "your artifacts",
    subtitle: "Soul Artifacts",
    description:
      "Where soul maps become permanent. Cards, drop artifacts, reincarnation paths — receipts that live in the Sparkverse.",
    action: "ENTER GENESIS",
    enterHref: "https://thefirstspark.shop/genesis.html",
    cssName: "genesis",
    icon: "radial-gradient(circle at 25% 25%, #fce7f3, #ec4899, #be185d, #831843)",
  },
];

export const ORBIT_PLANETS = PLANETS.filter((planet) => planet.id !== "core");

export const ZONE_LABELS: Record<ToolZone, string> = Object.fromEntries(
  PLANETS.map((planet) => [planet.id, planet.name]),
) as Record<ToolZone, string>;

export function getPlanet(id: string): Planet | undefined {
  return PLANETS.find((planet) => planet.id === id);
}
