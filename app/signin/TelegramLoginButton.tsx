"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type TelegramPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramPayload) => void;
  }
}

export function TelegramLoginButton({
  botUsername,
  callbackUrl,
}: {
  botUsername: string;
  callbackUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.onTelegramAuth = async (user: TelegramPayload) => {
      setError(null);
      setPending(true);
      try {
        const res = await fetch("/api/auth/telegram-callback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...user, callbackUrl }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = await res.json();
        router.replace(data.redirect ?? callbackUrl);
        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : "auth_failed";
        setError(`Telegram sign-in failed: ${message}`);
        setPending(false);
      }
    };
    return () => {
      window.onTelegramAuth = undefined;
    };
  }, [callbackUrl, router]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (node.querySelector("script[data-tg-injected]")) return;
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-tg-injected", "true");
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "20");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "false");
    node.appendChild(script);
  }, [botUsername]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="flex min-h-[52px] items-center justify-center rounded-full border-[1.5px] border-black bg-surface-card px-1 py-1"
      >
        {!botUsername && (
          <span className="font-mono text-[11px] text-fg-muted">
            Telegram bot is not configured.
          </span>
        )}
      </div>
      {pending && (
        <span className="font-mono text-[11px] text-fg-muted">
          Signing you in…
        </span>
      )}
      {error && (
        <span className="font-mono text-[11px] text-[#C62828]">{error}</span>
      )}
      <Script src="https://telegram.org/js/telegram-widget.js?22" strategy="lazyOnload" />
    </div>
  );
}
