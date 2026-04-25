import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers } from "@/lib/db/schema";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const team = await db.query.teams.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });
  if (!team) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const membership = await db.query.teamMembers.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.teamId, team.id), eq(m.userId, session.user.id)),
  });
  if (!membership || membership.isLead !== 1) {
    return NextResponse.json({ error: "not_lead" }, { status: 403 });
  }

  await db
    .delete(teamMembers)
    .where(eq(teamMembers.teamId, team.id));
  await db.delete(teams).where(eq(teams.id, team.id));

  return NextResponse.json({ ok: true });
}
