import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

const PatchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  handle: z.string().trim().min(2).max(32).optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updates: { name?: string; handle?: string } = {};
  if (parsed.data.name !== undefined) {
    updates.name = parsed.data.name.trim();
  }
  if (parsed.data.handle !== undefined) {
    const handle = slugify(parsed.data.handle);
    const conflict = await db.query.users.findFirst({
      where: (u) => and(eq(u.handle, handle), ne(u.id, session.user.id)),
      columns: { id: true },
    });
    if (conflict) {
      return NextResponse.json({ error: "handle_taken" }, { status: 409 });
    }
    updates.handle = handle;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const [row] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, session.user.id))
    .returning();

  return NextResponse.json({ user: row });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, session.user.id));

  // Caller is expected to follow up with /api/auth/signout to clear the cookie.
  return NextResponse.json({ ok: true });
}
