import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

/**
 * Better Auth server configuration.
 *
 * - Email + password with required verification (pre-created users in the
 *   seed script are marked verified so you can log straight in).
 * - Password reset and email verification emails are routed through `sendMail`
 *   (dev: stored in the DevEmail table + logged; prod: sent via Resend).
 * - Google OAuth is enabled automatically when `GOOGLE_CLIENT_ID` and
 *   `GOOGLE_CLIENT_SECRET` are present in the environment.
 * - `bio`, `role` and `membershipTier` are custom user fields. `role` and
 *   `membershipTier` are not user-updatable through auth endpoints (admin
 *   manages them directly via the database through the admin panel).
 */
export const auth = betterAuth({
  appName: "Sparkverse Member Hub",
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [appUrl],
  database: prismaAdapter(prisma, { provider: "sqlite" }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = new URL("/reset-password", appUrl);
      resetUrl.searchParams.set("token", token);
      await sendMail({
        to: user.email,
        subject: "Reset your Sparkverse Member Hub password",
        html: `
          <h2>Reset your password</h2>
          <p>Hi ${user.name},</p>
          <p>Someone requested a password reset for your Sparkverse Member Hub account.</p>
          <p><a href="${resetUrl.toString()}">Reset my password</a></p>
          <p>This link expires in one hour. If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verifyUrl = new URL("/verify-email", appUrl);
      verifyUrl.searchParams.set("token", token);
      await sendMail({
        to: user.email,
        subject: "Verify your email — Sparkverse Member Hub",
        html: `
          <h2>Welcome to the Member Hub</h2>
          <p>Hi ${user.name},</p>
          <p>Confirm your email address to unlock your member dashboard.</p>
          <p><a href="${verifyUrl.toString()}">Verify my email</a></p>
          <p>This link expires in one hour.</p>
        `,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendMail({
          to: user.email,
          subject: "Confirm your new email address",
          html: `
            <h2>Change your email</h2>
            <p>Hi ${user.name},</p>
            <p>You asked to change your email to <strong>${newEmail}</strong>.</p>
            <p><a href="${url}">Confirm new email</a></p>
            <p>If this wasn't you, ignore this email.</p>
          `,
        });
      },
    },
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
        returned: true,
      },
      membershipTier: {
        type: "string",
        required: false,
        defaultValue: "FREE",
        input: false,
        returned: true,
      },
    },
  },

  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),

  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },
});

export type Auth = typeof auth;
