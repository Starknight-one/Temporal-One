import { NextResponse } from "next/server";
import {
  isEmail,
  isNonEmptyString,
  htmlEnvelope,
  sendEmail,
} from "@/lib/email";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db/client";
import { interestSubmissions } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INTENTS = [
  "unlock-project",
  "unlock-builder",
  "pro-monthly",
  "pro-pilot",
  "for-hirer",
] as const;
type Intent = (typeof INTENTS)[number];

const INTENT_LABEL: Record<Intent, string> = {
  "unlock-project": "Unlock single project log ($500)",
  "unlock-builder": "Unlock single builder log ($500)",
  "pro-monthly": "Subscribe Pro ($200/mo)",
  "pro-pilot": "Company pilot",
  "for-hirer": "Hirer interest",
};

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const limit = rateLimit(`interest:${ip}`);
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

  if (typeof b.website === "string" && b.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!isNonEmptyString(b.intent, 40) || !INTENTS.includes(b.intent as Intent)) {
    return NextResponse.json({ error: "Unknown intent." }, { status: 400 });
  }
  const intent = b.intent as Intent;

  if (!isNonEmptyString(b.email, 200) || !isEmail(b.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  const email = b.email.trim();
  const target = isNonEmptyString(b.target, 120) ? b.target.trim() : "—";
  const company = isNonEmptyString(b.company, 200) ? b.company.trim() : "";
  const note = isNonEmptyString(b.note, 600) ? b.note.trim() : "";

  const rows: [string, string][] = [
    ["Intent", INTENT_LABEL[intent]],
    ["Target", target],
    ["Email", email],
  ];
  if (company) rows.push(["Company", company]);
  if (note) rows.push(["Note", note]);
  rows.push(["IP", ip]);

  const subject = `[Temporal One] Interest: ${INTENT_LABEL[intent]} · ${target}`;
  const text = [
    `Interest captured — Temporal One`,
    ``,
    ...rows.map(([k, v]) => `${k.padEnd(10)} ${v}`),
  ].join("\n");

  try {
    await db.insert(interestSubmissions).values({
      intent,
      target,
      email,
      company: company || null,
      note: note || null,
      ip,
    });
  } catch (err) {
    console.error("[interest] DB insert failed (continuing to email):", err);
  }

  try {
    await sendEmail({
      replyTo: email,
      subject,
      text,
      html: htmlEnvelope(subject, rows),
    });
  } catch (err) {
    console.error("[interest] Failed to send email:", err);
    return NextResponse.json(
      { error: "Could not send. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
