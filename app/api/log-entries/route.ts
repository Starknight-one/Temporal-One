import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { logEntries } from "@/lib/db/schema";
import { parseGithubPrUrl } from "@/lib/github";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

const BodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  type: z.enum([
    "built",
    "fixed",
    "researched",
    "designed",
    "shipped",
    "blocked",
  ]),
  timeSpent: z.number().min(0.5).max(24),
  artifactUrl: z.string().url().optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ip = ipFromRequest(req);
  const limited = rateLimit(`log-entries:${session.user.id}:${ip}`, {
    limit: 30,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const url = parsed.data.artifactUrl?.trim() || null;
  const pr = parseGithubPrUrl(url);
  const lockedAt = new Date(Date.now() + 60 * 60 * 1000);

  const [row] = await db
    .insert(logEntries)
    .values({
      userId: session.user.id,
      title: parsed.data.title.trim(),
      type: parsed.data.type,
      timeSpent: parsed.data.timeSpent.toFixed(1),
      artifactUrl: url,
      artifactKind: pr ? "github" : url ? "external" : null,
      artifactMeta: pr
        ? { owner: pr.owner, repo: pr.repo, number: pr.number, shortUrl: pr.shortUrl }
        : null,
      note: parsed.data.note?.trim() || null,
      lockedAt,
    })
    .returning();

  return NextResponse.json({ entry: row });
}
