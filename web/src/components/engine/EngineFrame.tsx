"use client";

import { useCallback, useEffect, useState } from "react";
import { isSparkEngineMessage, type SparkEngineMessage } from "@/types/engine";

type Props = {
  slug: string;
  src: string;
  title: string;
  launchToken?: string;
  trustedSameOrigin?: boolean;
};

export function EngineFrame({ slug, src, title, launchToken, trustedSameOrigin = false }: Props) {
  const [status, setStatus] = useState<"loading" | "ready" | "complete" | "blocked">("loading");
  const sandbox = [
    "allow-scripts",
    "allow-forms",
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    trustedSameOrigin ? "allow-same-origin" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const onMessage = useCallback(
    (event: MessageEvent) => {
      let origin: string;
      try {
        origin = new URL(src).origin;
      } catch {
        return;
      }
      if (event.origin !== origin) return;
      if (!isSparkEngineMessage(event.data)) return;
      const message: SparkEngineMessage = event.data;
      if (message.type === "spark:ready") setStatus("ready");
      if (message.type === "spark:complete") setStatus("complete");
      if (message.type === "spark:telemetry" && process.env.NODE_ENV !== "production") {
        console.info("[spark:telemetry]", slug, message.event, message.props ?? {});
      }
    },
    [slug, src],
  );

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-black/40">
      {status === "loading" ? (
        <p className="pointer-events-none absolute top-3 left-3 z-10 font-mono text-[0.62rem] tracking-[0.16em] text-white/40 uppercase">
          Linking engine…
        </p>
      ) : null}
      <iframe
        title={title}
        src={src}
        className="h-full min-h-[70dvh] w-full border-0 bg-[#050508]"
        sandbox={sandbox}
        allow="clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        data-launch-token={launchToken ? "pending" : undefined}
        onLoad={() => setStatus((current) => (current === "loading" ? "ready" : current))}
        onError={() => setStatus("blocked")}
      />
    </div>
  );
}
