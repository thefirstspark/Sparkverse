import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { MembershipTier } from "@prisma/client";
import { auth } from "./auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  bio?: string | null;
  role: string;
  membershipTier: MembershipTier;
};

/** Returns the signed-in user or redirects to /sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session.user as unknown as SessionUser;
}
