"use client";

import { FormEvent, useEffect, useState } from "react";

const API = "https://links.thefirstspark.shop/api/subscribe";
const COOKIE = "tfs-email";

function readCookie() {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|; )tfs-email=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function currentEmail() {
  try {
    const ls = localStorage.getItem("tfs-email");
    if (ls) return ls;
  } catch {
    /* ignore */
  }
  return readCookie();
}

function currentName() {
  try {
    return localStorage.getItem("tfs-name") || "";
  } catch {
    return "";
  }
}

export function writeSession(email: string, name?: string) {
  try {
    localStorage.setItem("tfs-email", email);
    if (name) localStorage.setItem("tfs-name", name);
  } catch {
    /* ignore */
  }
  document.cookie = `${COOKIE}=${encodeURIComponent(email)}; domain=.thefirstspark.shop; path=/; max-age=31536000; secure; samesite=lax`;
}

export function clearSession() {
  try {
    localStorage.removeItem("tfs-email");
    localStorage.removeItem("tfs-name");
  } catch {
    /* ignore */
  }
  document.cookie = `${COOKIE}=; domain=.thefirstspark.shop; path=/; max-age=0; secure; samesite=lax`;
}

export function usePlayer() {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEmail(currentEmail() || null);
    setName(currentName());
    setReady(true);
  }, []);

  return { email, name, ready, signedIn: Boolean(email) };
}

export function PlayerGate({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const em = currentEmail();
    setSignedIn(Boolean(em));
    setOpen(!em);
    if (em) setEmail(em);
    setName(currentName());
    setReady(true);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const em = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em)) {
      setBad(true);
      setMsg("Enter a valid email first.");
      return;
    }
    setBusy(true);
    setMsg("Opening your planets…");
    setBad(false);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          name: name.trim() || undefined,
          source: "sparkverse-os",
          want_email: false,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!data?.ok) throw new Error("failed");
      writeSession(em, name.trim());
      setSignedIn(true);
      setOpen(false);
    } catch {
      setBad(true);
      setMsg("That did not go through. Try again, or email kate@thefirstspark.shop.");
      setBusy(false);
    }
  }

  if (!ready) return <>{children}</>;

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#050508]/92 p-5">
          <div className="w-full max-w-[440px] rounded-2xl border border-white/12 bg-[#101018] p-7">
            <p className="mb-3 font-[family-name:var(--font-display)] text-[0.58rem] tracking-[0.22em] text-amber-300 uppercase">
              Players
            </p>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-white">
              Enter the Sparkverse.
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-white/55">
              Same email you used to join. No password. Your planets open when it lands.
            </p>
            <form onSubmit={onSubmit}>
              <label className="mb-1.5 block text-xs text-white/70" htmlFor="os-name">
                First name <span className="opacity-50">optional</span>
              </label>
              <input
                id="os-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-3 w-full rounded-lg border border-white/12 bg-[#0b0b12] px-3.5 py-3 font-mono text-sm text-white"
                placeholder="Player One"
                autoComplete="given-name"
              />
              <label className="mb-1.5 block text-xs text-white/70" htmlFor="os-email">
                Email
              </label>
              <input
                id="os-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3 w-full rounded-lg border border-white/12 bg-[#0b0b12] px-3.5 py-3 font-mono text-sm text-white"
                placeholder="you@example.com"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={busy}
                className="h-12 w-full rounded-md bg-[#fbbf24] font-[family-name:var(--font-display)] text-[0.62rem] font-bold tracking-[0.14em] text-[#08080d] uppercase disabled:opacity-60"
              >
                Open my planets
              </button>
              <p className={`mt-2.5 min-h-4 text-xs ${bad ? "text-red-400" : "text-white/45"}`}>{msg}</p>
            </form>
            <p className="mt-4 text-[0.66rem] text-white/45">
              New here?{" "}
              <a href="https://thefirstspark.shop/join.html" className="text-amber-300">
                Join free first
              </a>
              .
            </p>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
}

export function SignOutButton() {
  const { signedIn, ready } = usePlayer();
  if (!ready || !signedIn) return null;
  return (
    <button
      type="button"
      onClick={() => {
        clearSession();
        location.reload();
      }}
      className="hidden h-10 items-center rounded-full border border-white/20 px-3 font-[family-name:var(--font-display)] text-[0.62rem] tracking-[0.14em] text-white/70 uppercase sm:inline-flex"
    >
      Sign out
    </button>
  );
}
