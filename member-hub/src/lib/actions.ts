"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireUser } from "./session";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  bio: z.string().trim().max(500).optional(),
});

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, bio: parsed.data.bio ?? null },
  });
  revalidatePath("/dashboard");
  return { success: true as const };
}

const tierSchema = z.enum(["FREE", "PRO", "LIFETIME"]);

/**
 * Simulated checkout: applies the tier change directly. When Stripe keys are
 * configured this is where a Checkout Session should be created instead.
 */
export async function changeTier(tier: string) {
  const user = await requireUser();
  const parsed = tierSchema.safeParse(tier);
  if (!parsed.success) return { error: "Unknown tier." };

  if (user.membershipTier === "LIFETIME" && parsed.data !== "LIFETIME") {
    return { error: "Lifetime membership doesn't downgrade." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { membershipTier: parsed.data },
  });
  revalidatePath("/dashboard");
  revalidatePath("/posts");
  revalidatePath("/resources");
  return { success: true as const };
}
