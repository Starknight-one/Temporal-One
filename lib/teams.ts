import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { teams, teamMembers } from "./db/schema";

export type UserTeamSummary = {
  id: string;
  slug: string;
  name: string;
  isLead: boolean;
};

export async function getUserTeams(userId: string): Promise<UserTeamSummary[]> {
  const rows = await db
    .select({
      id: teams.id,
      slug: teams.slug,
      name: teams.name,
      isLead: teamMembers.isLead,
      joinedAt: teamMembers.joinedAt,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teamMembers.userId, userId));
  return rows
    .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())
    .map(({ id, slug, name, isLead }) => ({
      id,
      slug,
      name,
      isLead: isLead === 1,
    }));
}
