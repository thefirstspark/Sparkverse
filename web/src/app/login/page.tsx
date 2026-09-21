import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="mb-2 font-[family-name:var(--font-display)] text-[0.68rem] tracking-[0.28em] text-amber-300 uppercase">
        Players
      </p>
      <h1 className="gradient-text mb-4 font-[family-name:var(--font-display)] text-3xl font-black tracking-[0.12em]">
        ENTER THE SPARKVERSE
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-white/55">
        Same email you used to join. No password. The live galaxy is the door until this app is
        hosted.
      </p>
      <a
        href="https://sparkverse.thefirstspark.shop/"
        className="inline-flex h-12 items-center rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f97316] px-6 font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.16em] text-[#050508] uppercase no-underline"
      >
        Open my planets
      </a>
      <p className="mt-6 text-sm text-white/45">
        New?{" "}
        <Link href="https://thefirstspark.shop/join.html" className="text-cyan-300">
          Join free
        </Link>
        {" · "}
        <Link href="/dashboard" className="text-cyan-300">
          You
        </Link>
      </p>
    </div>
  );
}
