import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inbox } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dev Mailbox" };
export const dynamic = "force-dynamic";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);
  return (
    <>
      {parts.map((part, i) =>
        part.match(URL_PATTERN) ? (
          <a
            key={i}
            href={part}
            className="break-all text-amber-400 underline underline-offset-4"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default async function DevMailboxPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const emails = await prisma.devEmail.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Inbox className="size-6 text-amber-400" /> Dev mailbox
          </h1>
          <p className="text-muted-foreground">
            Development only — verification and reset emails land here instead of being sent.
          </p>
        </div>
        {emails.length === 0 && (
          <p className="text-muted-foreground">No mail yet. Sign up or request a password reset.</p>
        )}
        <div className="flex flex-col gap-4">
          {emails.map((email) => (
            <Card key={email.id}>
              <CardHeader>
                <CardTitle className="text-base">{email.subject}</CardTitle>
                <CardDescription>
                  to {email.to} · {email.createdAt.toLocaleString("en-US")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                  <Linkified text={email.body} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
