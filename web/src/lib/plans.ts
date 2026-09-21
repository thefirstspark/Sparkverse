export const PLANS = {
  lobby: {
    name: "Free membership",
    price: "Free",
    planId: "join-free",
    href: "https://thefirstspark.shop/join.html",
    blurb: "One email. Then the labeled galaxy. No Whop account.",
  },
  player: {
    name: "Players Lounge",
    price: "$11/mo",
    planId: "paypal-lounge",
    href: "https://thefirstspark.shop/playerslounge/",
    canonical: "https://thefirstspark.shop/playerslounge/",
    blurb: "$11/month or $99/year. PayPal. Cancel any time.",
  },
  soulMap: {
    name: "Soul Map",
    price: "$22",
    planId: "paypal-soul-map",
    href: "https://thefirstspark.shop/soul-map-checkout.html",
    canonical: "https://thefirstspark.shop/map.html",
    blurb: "One-time. A private page about you.",
  },
} as const;

export const LEGACY_ORIGIN =
  process.env.NEXT_PUBLIC_LEGACY_ORIGIN ?? "https://sparkverse.thefirstspark.shop";

export const SOUL_MAP_PREVIEW = "https://thefirstspark.shop/soul-pattern-generator.html";
export const COLOR_WHEEL = `${LEGACY_ORIGIN}/color-wheel.html`;
