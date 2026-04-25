import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db/client";
import { teams, teamMembers } from "@/lib/db/schema";

export async function POST(
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
  if (team.status !== "open") {
    return NextResponse.json({ error: "not_open" }, { status: 409 });
  }

  const existing = await db.query.teamMembers.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.teamId, team.id), eq(m.userId, session.user.id)),
  });
  if (existing) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  const memberCount = await db
    .select({ userId: teamMembers.userId })
    .from(teamMembers)
    .where(eq(teamMembers.teamId, team.id));
  if (memberCount.length >= team.maxMembers) {
    return NextResponse.json({ error: "team_full" }, { status: 409 });
  }

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
    role: "member",
    isLead: 0,
  });

  return NextResponse.json({ ok: true });
}
