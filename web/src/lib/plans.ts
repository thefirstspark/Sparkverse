export const PLANS = {
  lobby: {
    name: "Lobby",
    price: "Free",
    planId: "plan_dBFxXLnwQoj1l",
    href: "https://whop.com/sparkverse-511c/spark-access/",
    blurb: "Free Sparkverse join. Creates a Whop account so you can use lobby tools.",
  },
  player: {
    name: "Players Lounge",
    price: "$33/mo",
    planId: "plan_okFWwlpgnc2bQ",
    href: "https://whop.com/checkout/plan_okFWwlpgnc2bQ",
    canonical: "https://thefirstspark.shop/playerslounge/",
    blurb: "3-day trial. Unlocks player-only tools.",
  },
  soulMap: {
    name: "Soul Map",
    price: "$22",
    planId: "plan_anQKP3Pzf1cGm",
    href: "https://whop.com/checkout/plan_anQKP3Pzf1cGm",
    canonical: "https://thefirstspark.shop/map.html",
    blurb: "One-time numerological blueprint.",
  },
} as const;

export const LEGACY_ORIGIN = "https://sparkverse.thefirstspark.shop";
