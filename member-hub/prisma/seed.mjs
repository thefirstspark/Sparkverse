// Seeds a system author plus sample posts/resources across all three tiers.
// Run with: node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const author = await prisma.user.upsert({
  where: { email: "hub@sparkverse.local" },
  update: {},
  create: {
    name: "The First Spark",
    email: "hub@sparkverse.local",
    emailVerified: true,
    role: "admin",
    membershipTier: "LIFETIME",
    bio: "System author for seeded hub content.",
  },
});

const posts = [
  {
    slug: "welcome-to-the-hub",
    title: "Welcome to the Member Hub",
    excerpt: "What this place is, and where everything lives.",
    minimumTier: "FREE",
    content:
      "Welcome in.\n\nThis hub is the members-only side of the Sparkverse. Posts live here, downloadable resources live in the vault, and your tier controls what unlocks.\n\nFree members see everything marked Free. Pro unlocks the working library. Lifetime opens all of it, permanently.\n\nStart with the vault — there's already something in there for you.",
  },
  {
    slug: "sparkverse-roadmap",
    title: "The Sparkverse Roadmap",
    excerpt: "Where the ecosystem is headed next.",
    minimumTier: "PRO",
    content:
      "Here's what's coming.\n\n1. The ecosystem map gets live status per node.\n2. Soul Maps and Sigil Forge get member-linked profiles.\n3. The Selector Model participant program opens to hub members first.\n\nPro members will see each of these land here before any public announcement.",
  },
  {
    slug: "founders-notes",
    title: "Founder's Notes: Building in the Open",
    excerpt: "The unfiltered version — Lifetime members only.",
    minimumTier: "LIFETIME",
    content:
      "This is the unfiltered channel.\n\nRevenue numbers, failed experiments, what actually converts and what doesn't — the notes I don't publish anywhere else. New entries land here first, always.",
  },
];

for (const post of posts) {
  await prisma.post.upsert({
    where: { slug: post.slug },
    update: {},
    create: { ...post, authorId: author.id },
  });
}

const resources = [
  {
    title: "Sparkverse Ecosystem Map",
    description: "The live clickable map of every Sparkverse node.",
    url: "https://sparkverse.thefirstspark.shop/sparkverse-map.html",
    type: "LINK",
    minimumTier: "FREE",
  },
  {
    title: "Selector Model Thesis",
    description: "The complete thesis page with the participant sign-up form.",
    url: "https://sparkverse.thefirstspark.shop/selector-model-thesis.html",
    type: "DOCUMENT",
    minimumTier: "PRO",
  },
  {
    title: "Sigil Forge",
    description: "Members-first access to the Sigil Forge app.",
    url: "https://sigilcraft.thefirstspark.shop",
    type: "LINK",
    minimumTier: "LIFETIME",
  },
];

for (const resource of resources) {
  const existing = await prisma.resource.findFirst({ where: { url: resource.url } });
  if (!existing) await prisma.resource.create({ data: resource });
}

console.log("Seeded: 1 author, 3 posts, 3 resources.");
await prisma.$disconnect();
