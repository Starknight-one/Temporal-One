import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplyPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  years: string;
  linkedin: string;
  availability: string;
};

const MAX_LEN = 200;

function isNonEmptyString(v: unknown, max = MAX_LEN): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function isEmail(v: string): boolean {
  // Intentionally permissive; full RFC compliance is not worthwhile here.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parse(body: unknown): ApplyPayload | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;

  for (const key of [
    "firstName",
    "lastName",
    "email",
    "role",
    "years",
    "linkedin",
    "availability",
  ] as const) {
    if (!isNonEmptyString(b[key])) {
      return { error: `Missing or invalid field: ${key}` };
    }
  }

  if (!isEmail(b.email as string)) {
    return { error: "Please enter a valid email address." };
  }

  return {
    firstName: (b.firstName as string).trim(),
    lastName: (b.lastName as string).trim(),
    email: (b.email as string).trim(),
    role: (b.role as string).trim(),
    years: (b.years as string).trim(),
    linkedin: (b.linkedin as string).trim(),
    availability: (b.availability as string).trim(),
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMessage(p: ApplyPayload) {
  const fullName = `${p.firstName} ${p.lastName}`;
  const text = [
    `New waitlist application — Temporal One`,
    ``,
    `Name:          ${fullName}`,
    `Email:         ${p.email}`,
    `Role:          ${p.role}`,
    `Experience:    ${p.years} years`,
    `LinkedIn:      ${p.linkedin}`,
    `Availability:  ${p.availability}/week`,
  ].join("\n");

  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", p.email],
    ["Role", p.role],
    ["Experience", `${p.years} years`],
    ["LinkedIn", p.linkedin],
    ["Availability", `${p.availability}/week`],
  ];

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0a0a0a; color:#ffffff; padding:32px;">
      <h2 style="font-size:14px; letter-spacing:3px; text-transform:uppercase; color:#39ff14; margin:0 0 16px;">Temporal One — New Application</h2>
      <h1 style="margin:0 0 24px; font-size:24px;">${escapeHtml(fullName)}</h1>
      <table style="border-collapse:collapse; width:100%; max-width:520px;">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:10px 16px; border-bottom:1px solid #2a2a2a; color:#a1a1aa; font-size:12px; text-transform:uppercase; letter-spacing:1px; width:140px;">${escapeHtml(
              k,
            )}</td>
            <td style="padding:10px 16px; border-bottom:1px solid #2a2a2a; color:#ffffff; font-size:14px;">${escapeHtml(
              v,
            )}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;

  return { text, html, subject: `[Temporal One] Waitlist: ${fullName}` };
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parse(raw);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, APPLY_TO_EMAIL } =
    process.env;
  const to = APPLY_TO_EMAIL ?? "starknight@keepstar.one";
  const message = buildMessage(parsed);

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    // In local dev without SMTP configured, log and succeed so the UX can be
    // exercised end-to-end without leaking credentials.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[apply] SMTP not configured — logging application instead.",
      );
      console.log("[apply] To:", to);
      console.log("[apply] Subject:", message.subject);
      console.log("[apply] Body:\n" + message.text);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json(
      { error: "Email delivery is not configured." },
      { status: 500 },
    );
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Temporal One" <${SMTP_USER}>`,
      to,
      replyTo: parsed.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  } catch (err) {
    console.error("[apply] Failed to send email:", err);
    return NextResponse.json(
      { error: "Could not send your application. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
