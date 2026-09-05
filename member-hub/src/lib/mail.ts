import { prisma } from "./prisma";

type Mail = {
  to: string;
  subject: string;
  body: string;
};

/**
 * Sends mail via Resend when RESEND_API_KEY is configured; otherwise stores
 * the message in the DevEmail table (readable at /dev/mailbox) and echoes it
 * to the terminal so auth flows are testable without a mail provider.
 */
export async function sendMail({ to, subject, body }: Mail) {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM ?? "Sparkverse Member Hub <onboarding@resend.dev>",
        to,
        subject,
        text: body,
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
    }
    return;
  }

  await prisma.devEmail.create({ data: { to, subject, body } });
  console.log(`\n📬 [dev mail] to: ${to}\n   subject: ${subject}\n   ${body}\n`);
}
