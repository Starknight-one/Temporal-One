import { NextResponse } from "next/server";
import {
  isEmail,
  isNonEmptyString,
  htmlEnvelope,
  sendEmail,
} from "@/lib/email";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const limit = rateLimit(`magic:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const b = (raw ?? {}) as Record<string, unknown>;

  // Honeypot
  if (typeof b.website === "string" && b.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!isNonEmptyString(b.email, 200) || !isEmail(b.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  const email = b.email.trim();

  // Notify admin
  try {
    await sendEmail({
      replyTo: email,
      subject: `[Temporal One] Sign-in request: ${email}`,
      text: [
        `New sign-in request — Temporal One`,
        ``,
        `Email: ${email}`,
        `IP:    ${ip}`,
      ].join("\n"),
      html: htmlEnvelope(`Sign-in request: ${email}`, [
        ["Email", email],
        ["IP", ip],
      ]),
    });
  } catch (err) {
    console.error("[magic-link] Failed to email admin:", err);
    return NextResponse.json(
      { error: "Could not send your request. Please try again." },
      { status: 502 },
    );
  }

  // Confirm to the user — best-effort. Don't fail the response if this errors.
  try {
    await sendEmail({
      to: email,
      subject: "Temporal One — sign-in request received",
      text: [
        `Hey,`,
        ``,
        `We got your sign-in request for Temporal One.`,
        ``,
        `Sign-in is hand-handled for cohort #1 — we'll reply within 24h with`,
        `your access link or, if you don't have an invite yet, with next steps.`,
        ``,
        `— Temporal One`,
      ].join("\n"),
    });
  } catch (err) {
    console.warn("[magic-link] Could not send confirmation to user:", err);
  }

  return NextResponse.json({ ok: true });
}
