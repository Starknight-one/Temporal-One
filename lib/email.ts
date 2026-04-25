import nodemailer from "nodemailer";

const MAX_LEN = 600;

export function isNonEmptyString(v: unknown, max = MAX_LEN): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function isHttpsUrl(v: string): boolean {
  return /^https?:\/\/.+/i.test(v);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function adminRecipient(): string {
  return process.env.APPLY_TO_EMAIL ?? "starknight@keepstar.one";
}

type SendArgs = {
  to?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends an email via SMTP. If SMTP env vars aren't set, logs the message and
 * resolves with `delivered: false` in development; throws in production.
 */
export async function sendEmail({
  to,
  replyTo,
  subject,
  text,
  html,
}: SendArgs): Promise<{ delivered: boolean }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  const recipient = to ?? adminRecipient();

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[email] SMTP not configured — logging message instead.");
      console.log("[email] To:", recipient);
      console.log("[email] Subject:", subject);
      console.log("[email] Body:\n" + text);
      return { delivered: false };
    }
    throw new Error("Email delivery is not configured.");
  }

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"Temporal One" <${SMTP_USER}>`,
    to: recipient,
    replyTo,
    subject,
    text,
    html,
  });

  return { delivered: true };
}

export function htmlEnvelope(title: string, rows: [string, string][]): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#ffffff; color:#000000; padding:32px;">
      <h2 style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#999; margin:0 0 16px;">Temporal One</h2>
      <h1 style="margin:0 0 24px; font-size:22px; font-family: 'Newsreader', Georgia, serif; font-weight:600;">${escapeHtml(title)}</h1>
      <table style="border-collapse:collapse; width:100%; max-width:520px;">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:10px 16px; border-bottom:1px solid #eee; color:#999; font-size:11px; text-transform:uppercase; letter-spacing:1px; width:140px;">${escapeHtml(k)}</td>
            <td style="padding:10px 16px; border-bottom:1px solid #eee; color:#000; font-size:14px; white-space:pre-wrap;">${escapeHtml(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;
}
