import { NextResponse } from "next/server";
import {
  isEmail,
  isHttpsUrl,
  isNonEmptyString,
  htmlEnvelope,
  sendEmail,
} from "@/lib/email";
import { ipFromRequest, rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db/client";
import { applications } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRACKS = [
  "frontend",
  "backend",
  "fullstack",
  "design",
  "pm",
  "growth",
  "other",
] as const;
type Track = (typeof TRACKS)[number];

type BuildPayload = {
  intent: "build";
  name: string;
  email: string;
  linkedin: string;
  track: Track;
  note?: string;
};

type HirePayload = {
  intent: "hire";
  company: string;
  name: string;
  email: string;
  roles: string;
};

type Payload = BuildPayload | HirePayload;

function parse(body: unknown): Payload | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };
  const b = body as Record<string, unknown>;

  // Honeypot. Don't surface as an error — just drop silently with success.
  if (typeof b.website === "string" && b.website.length > 0) {
    return { error: "__honeypot__" };
  }

  const intent = b.intent;
  if (intent === "build") {
    if (!isNonEmptyString(b.name, 120)) return { error: "Please enter your name." };
    if (!isNonEmptyString(b.email, 200) || !isEmail(b.email))
      return { error: "Please enter a valid email." };
    if (!isNonEmptyString(b.linkedin, 300) || !isHttpsUrl(b.linkedin))
      return { error: "LinkedIn URL needs to be a full https:// link." };
    if (!isNonEmptyString(b.track, 40) || !TRACKS.includes(b.track as Track))
      return { error: "Pick a track." };
    return {
      intent: "build",
      name: b.name.trim(),
      email: b.email.trim(),
      linkedin: b.linkedin.trim(),
      track: b.track as Track,
      note: isNonEmptyString(b.note, 500) ? b.note.trim() : undefined,
    };
  }

  if (intent === "hire") {
    if (!isNonEmptyString(b.company, 200))
      return { error: "Please enter your company." };
    if (!isNonEmptyString(b.name, 120)) return { error: "Please enter your name." };
    if (!isNonEmptyString(b.email, 200) || !isEmail(b.email))
      return { error: "Please enter a valid work email." };
    if (!isNonEmptyString(b.roles, 600))
      return { error: "Tell us what roles you're trying to fill." };
    return {
      intent: "hire",
      company: b.company.trim(),
      name: b.name.trim(),
      email: b.email.trim(),
      roles: b.roles.trim(),
    };
  }

  return { error: "Unknown intent." };
}

function buildMessage(p: Payload) {
  if (p.intent === "build") {
    const rows: [string, string][] = [
      ["Name", p.name],
      ["Email", p.email],
      ["LinkedIn", p.linkedin],
      ["Track", p.track],
      ["Note", p.note ?? "—"],
    ];
    const text = [
      `New BUILDER application — Temporal One`,
      ``,
      `Name:      ${p.name}`,
      `Email:     ${p.email}`,
      `LinkedIn:  ${p.linkedin}`,
      `Track:     ${p.track}`,
      `Note:      ${p.note ?? "—"}`,
    ].join("\n");
    return {
      subject: `[Temporal One] Apply (build): ${p.name}`,
      text,
      html: htmlEnvelope(`Apply (build): ${p.name}`, rows),
    };
  }
  const rows: [string, string][] = [
    ["Company", p.company],
    ["Name", p.name],
    ["Email", p.email],
    ["Roles", p.roles],
  ];
  const text = [
    `New HIRER pilot request — Temporal One`,
    ``,
    `Company:  ${p.company}`,
    `Name:     ${p.name}`,
    `Email:    ${p.email}`,
    `Roles:    ${p.roles}`,
  ].join("\n");
  return {
    subject: `[Temporal One] Apply (hire): ${p.company}`,
    text,
    html: htmlEnvelope(`Apply (hire): ${p.company}`, rows),
  };
}

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const limit = rateLimit(`apply:${ip}`);
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

  const parsed = parse(raw);
  if ("error" in parsed) {
    if (parsed.error === "__honeypot__") {
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const message = buildMessage(parsed);

  try {
    await db.insert(applications).values(
      parsed.intent === "build"
        ? {
            intent: "build",
            email: parsed.email,
            name: parsed.name,
            linkedinUrl: parsed.linkedin,
            track: parsed.track,
            note: parsed.note ?? null,
            ip,
          }
        : {
            intent: "hire",
            email: parsed.email,
            name: parsed.name,
            company: parsed.company,
            roles: parsed.roles,
            ip,
          },
    );
  } catch (err) {
    console.error("[apply] DB insert failed (continuing to email):", err);
  }

  try {
    const { delivered } = await sendEmail({
      replyTo: parsed.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return NextResponse.json({ ok: true, delivered });
  } catch (err) {
    console.error("[apply] Failed to send email:", err);
    return NextResponse.json(
      { error: "Could not send your application. Please try again." },
      { status: 502 },
    );
  }
}
