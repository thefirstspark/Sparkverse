import { prisma } from "@/lib/prisma";

const RESEND_API_URL = "https://api.resend.com/emails";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends an email.
 *
 * Development (default): persists the message in the DevEmail table and logs
 * the URL to the terminal so verification / reset flows can be tested
 * without a mail server.
 *
 * Production: sends through the Resend REST API when `RESEND_API_KEY` is set.
 * Swap this for any provider — the auth layer only depends on this function.
 */
export async function sendMail({ to, subject, html }: SendMailInput): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Sparkverse Member Hub <onboarding@resend.dev>";

  if (resendApiKey) {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!response.ok) {
      // Fall back to the dev mailbox so flows still work locally, and surface
      // the provider error.
      console.error("[mail] Resend failed:", response.status, await response.text());
    } else {
      return;
    }
  }

  // Extract a readable link position for the terminal preview.
  const linkMatch = html.match(/href="([^"]+)"/);
  await prisma.devEmail.create({
    data: { to, subject, body: html },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("\n📧 [dev mail]\n   To: " + to + "\n   Subject: " + subject + (linkMatch ? "\n   Link: " + linkMatch[1] : "") + "\n");
  }
}
