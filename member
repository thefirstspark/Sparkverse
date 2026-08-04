import { PrismaClient, MembershipTier, ResourceType } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding the database…");

  // Demo passwords: "password123" for all seeded users.
  const passwordHash = await hashPassword("password123");

  // ---- Users --------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: "admin@sparkverse.shop" },
    update: {},
    create: {
      name: "Sparkverse Admin",
      email: "admin@sparkverse.shop",
      emailVerified: true,
      role: "admin",
      membershipTier: MembershipTier.LIFETIME,
      bio: "Keeper of the first spark. Runs the Member Hub and builds in public.",
      image: null,
    },
  });

  await prisma.account.upsert({
    where: { id: `${admin.id}-credential` },
    update: { password: passwordHash },
    create: {
      id: `${admin.id}-credential`,
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password: passwordHash,
    },
  });

  const proUser = await prisma.user.upsert({
    where: { email: "pro@sparkverse.shop" },
    update: {},
    create: {
      name: "Pro Member",
      email: "pro@sparkverse.shop",
      emailVerified: true,
      role: "user",
      membershipTier: MembershipTier.PRO,
      bio: "Building my first spark, one day at a time.",
      image: null,
    },
  });

  await prisma.account.upsert({
    where: { id: `${proUser.id}-credential` },
    update: { password: passwordHash },
    create: {
      id: `${proUser.id}-credential`,
      userId: proUser.id,
      accountId: proUser.id,
      providerId: "credential",
      password: passwordHash,
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "member@sparkverse.shop" },
    update: {},
    create: {
      name: "Free Member",
      email: "member@sparkverse.shop",
      emailVerified: true,
      role: "user",
      membershipTier: MembershipTier.FREE,
      bio: "Just joined and exploring the hub.",
      image: null,
    },
  });

  await prisma.account.upsert({
    where: { id: `${freeUser.id}-credential` },
    update: { password: passwordHash },
    create: {
      id: `${freeUser.id}-credential`,
      userId: freeUser.id,
      accountId: freeUser.id,
      providerId: "credential",
      password: passwordHash,
    },
  });

  console.log("  ✓ users: admin@sparkverse.shop / pro@sparkverse.shop / member@sparkverse.shop (password: password123)");

  // ---- Posts ---------------------------------------------------------------
  const posts = [
    {
      title: "Welcome to the Member Hub",
      slug: "welcome-to-the-member-hub",
      excerpt: "What this hub is, what's inside, and how to get the most out of it.",
      content:
        "## You're in.\n\nThis is the private corner of The First Spark where members get the real story:\n\n- **Exclusive essays** on building in public, systems and creative courage\n- **Field notes** from the journey of launching and growing Sparkverse\n- **Resources** — frameworks, templates and tools we actually use\n\nStart on the dashboard, then check out the member content area.",
      minimumTier: MembershipTier.FREE,
      published: true,
      authorId: admin.id,
    },
    {
      title: "The First Spark Framework",
      slug: "the-first-spark-framework",
      excerpt: "A repeatable system for turning a faint idea into a real, launched thing.",
      content:
        "## The framework\n\nEvery project we love started as a first spark. The framework is simple:\n\n1. **Capture** — write the idea down the moment it appears\n2. **Compress** — reduce it to one sentence you could say out loud\n3. **Commit** — ship a tiny, public version this week\n4. **Compound** — share the process, not just the result\n\nThe magic isn't the idea. It's the speed from capture to commit.",
      minimumTier: MembershipTier.PRO,
      published: true,
      authorId: admin.id,
    },
    {
      title: "Building in Public: A Field Guide",
      slug: "building-in-public-field-guide",
      excerpt: "How to document your journey without burning out or over-sharing.",
      content:
        "## Show the work, protect the person\n\nBuilding in public is a superpower when it has boundaries. Rules we follow:\n\n- Share the *process*, not private numbers\n- Post the ugly first versions — that's the content\n- Batch your updates: one thoughtful post beats ten hot takes\n- Never post when you're emotional\n\nConsistency beats intensity. 365 small sparks create a fire.",
      minimumTier: MembershipTier.LIFETIME,
      published: true,
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("  ✓ 3 posts");

  // ---- Resources -----------------------------------------------------------
  const resources = [
    {
      title: "First Spark Capture Template",
      description: "A Notion template for capturing and triaging ideas in 60 seconds.",
      url: "https://example.com/spark-capture-template",
      type: ResourceType.DOCUMENT,
      sizeLabel: "Notion",
      minimumTier: MembershipTier.FREE,
      published: true,
    },
    {
      title: "Launch Week Playbook",
      description: "The exact 7-day launch sequence used for Sparkverse.",
      url: "https://example.com/launch-week-playbook",
      type: ResourceType.DOCUMENT,
      sizeLabel: "PDF · 24 pages",
      minimumTier: MembershipTier.PRO,
      published: true,
    },
    {
      title: "Founder's Audio: The Origin Story",
      description: "A raw 40-minute recording about how The First Spark began.",
      url: "https://example.com/origin-story-audio",
      type: ResourceType.AUDIO,
      sizeLabel: "MP3 · 40 min",
      minimumTier: MembershipTier.LIFETIME,
      published: true,
    },
  ];

  for (const resource of resources) {
    const existing = await prisma.resource.findFirst({ where: { title: resource.title } });
    if (existing) {
      await prisma.resource.update({ where: { id: existing.id }, data: resource });
    } else {
      await prisma.resource.create({ data: resource });
    }
  }
  console.log("  ✓ 3 resources");

  console.log("\n✅ Seed complete. Log in with:");
  console.log("   admin@sparkverse.shop   (admin, Lifetime membership)");
  console.log("   pro@sparkverse.shop     (user,  Pro membership)");
  console.log("   member@sparkverse.shop  (user,  Free membership)");
  console.log("   All passwords: password123\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
