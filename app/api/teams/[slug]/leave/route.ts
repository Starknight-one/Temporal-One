import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
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

  const membership = await db.query.teamMembers.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.teamId, team.id), eq(m.userId, session.user.id)),
  });
  if (!membership) {
    return NextResponse.json({ error: "not_member" }, { status: 404 });
  }

  await db
    .delete(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, team.id),
        eq(teamMembers.userId, session.user.id),
      ),
    );

  // If the leaver was the lead, transfer to the oldest remaining member.
  // If no members remain, delete the team.
  const remaining = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.teamId, team.id))
    .orderBy(asc(teamMembers.joinedAt));

  if (remaining.length === 0) {
    await db.delete(teams).where(eq(teams.id, team.id));
    return NextResponse.json({ ok: true, teamDeleted: true });
  }

  if (membership.isLead === 1) {
    const heir = remaining[0];
    await db
      .update(teamMembers)
      .set({ isLead: 1, role: "lead" })
      .where(
        and(
          eq(teamMembers.teamId, team.id),
          eq(teamMembers.userId, heir.userId),
        ),
      );
  }

  return NextResponse.json({ ok: true });
}
