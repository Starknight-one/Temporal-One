import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

const BodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(500),
  category: z.string().trim().min(1).max(40).optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(8).optional(),
  maxMembers: z.number().int().min(1).max(10).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ip = ipFromRequest(req);
  const limited = rateLimit(`teams-create:${session.user.id}:${ip}`, {
    limit: 10,
    windowMs: 60 * 60 * 1000,
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

  const slug = await ensureUniqueSlug(slugify(parsed.data.name));
  const tags = (parsed.data.tags ?? [])
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const [team] = await db
    .insert(teams)
    .values({
      slug,
      name: parsed.data.name.trim(),
      projectName: parsed.data.name.trim(),
      description: parsed.data.description.trim(),
      category: parsed.data.category?.trim() || null,
      tags,
      status: "open",
      maxMembers: parsed.data.maxMembers ?? 5,
      startedAt: new Date(),
      createdBy: session.user.id,
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
    role: "lead",
    isLead: 1,
  });

  return NextResponse.json({ team });
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let suffix = 1;
  while (true) {
    const existing = await db
      .select({ id: teams.id })
      .from(teams)
      .where(eq(teams.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

