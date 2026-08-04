import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export type MembershipTier = "FREE" | "PRO" | "LIFETIME";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  bio?: string | null;
  role: string;
  membershipTier: MembershipTier;
};

/**
 * Better Auth client.
 *
 * `inferAdditionalFields` types the custom user fields (bio/role/
 * membershipTier) on the client without adding runtime behavior — it is a
 * type-only plugin.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [
    inferAdditionalFields<{
      user: {
        bio: { type: "string"; required: false; input: true; returned: true };
        role: { type: "string"; required: false; input: false; returned: true };
        membershipTier: { type: "string"; required: false; input: false; returned: true };
      };
    }>(),
  ],
});
