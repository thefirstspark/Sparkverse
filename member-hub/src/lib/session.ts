import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Returns the authenticated session for a server component, or null.
 */
export async function getSession() {
  const sessionHeaders = await headers();
  return auth.api.getSession({ headers: sessionHeaders });
}

/**
 * Guards a server component: redirects to /login when unauthenticated.
 * Use in dashboard, profile, content and admin pages.
 */
export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export function isAdmin(user: { role?: string | null } | undefined | null) {
  return user?.role === "admin";
}
