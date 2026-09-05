import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <Sparkles className="size-5 text-amber-400" />
        Sparkverse Member Hub
      </Link>
      {children}
    </main>
  );
}
