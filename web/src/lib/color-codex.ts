export type Radiant = {
  radiant: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  name: string;
  light: string;
  hex: string;
  dark: boolean;
};

export const RADIANTS: Radiant[] = [
  { radiant: "1", name: "Ember", light: "deep red", hex: "#E8593C", dark: false },
  { radiant: "2", name: "Dawn", light: "orange", hex: "#D85A30", dark: false },
  { radiant: "3", name: "Gold Vein", light: "gold", hex: "#F2A623", dark: true },
  { radiant: "4", name: "Verdant Gate", light: "green", hex: "#5DCAA5", dark: true },
  { radiant: "5", name: "Tide Glass", light: "teal", hex: "#1D9E75", dark: false },
  { radiant: "6", name: "Still Water", light: "blue", hex: "#378ADD", dark: false },
  { radiant: "7", name: "Violet Hour", light: "violet", hex: "#7F77DD", dark: false },
  { radiant: "8", name: "Rose Ash", light: "rose", hex: "#D4537E", dark: false },
  { radiant: "9", name: "Pearl Gate", light: "white gold", hex: "#F1EFE8", dark: true },
];

function tintTowardWhite(hex: string, amount = 0.35): string {
  const c = hex.replace("#", "");
  let out = "#";
  for (let i = 0; i < 6; i += 2) {
    const v = parseInt(c.slice(i, i + 2), 16);
    out += Math.round(v + (255 - v) * amount)
      .toString(16)
      .padStart(2, "0");
  }
  return out.toUpperCase();
}

export const MASTERS = [
  { master: "11", reduces: "2" as const, base: RADIANTS[1] },
  { master: "22", reduces: "4" as const, base: RADIANTS[3] },
  { master: "33", reduces: "6" as const, base: RADIANTS[5] },
].map((m) => ({
  ...m,
  name: m.base.name,
  hex: tintTowardWhite(m.base.hex),
  light: `${m.base.name}, Moonsilvered`,
}));

export function radiantByCode(code: string): Radiant | undefined {
  return RADIANTS.find((r) => r.radiant === code);
}
