// One-shot: for every log_entries row without team_id, if the author is a
// member of exactly one team, set team_id to that team. Rows for users in 0 or
// 2+ teams stay NULL (ambiguous — leave for the user to decide).

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set in .env.local");
  process.exit(1);
}

const sql = neon(url);

const before = await sql`
  SELECT
    COUNT(*) FILTER (WHERE team_id IS NULL) AS unscoped,
    COUNT(*)                               AS total
  FROM log_entries
`;
console.log(
  `Before: ${before[0].unscoped} unscoped / ${before[0].total} total`,
);

const updated = await sql`
  UPDATE log_entries le
  SET team_id = (
    SELECT tm.team_id
    FROM team_members tm
    WHERE tm.user_id = le.user_id
    LIMIT 1
  )
  WHERE le.team_id IS NULL
    AND 1 = (
      SELECT COUNT(*) FROM team_members tm WHERE tm.user_id = le.user_id
    )
  RETURNING id, user_id, team_id
`;

console.log(`Updated ${updated.length} entries`);

const after = await sql`
  SELECT
    COUNT(*) FILTER (WHERE team_id IS NULL) AS unscoped,
    COUNT(*)                               AS total
  FROM log_entries
`;
console.log(
  `After:  ${after[0].unscoped} unscoped / ${after[0].total} total`,
);

if (Number(after[0].unscoped) > 0) {
  const stranded = await sql`
    SELECT le.id, le.title, le.user_id, COUNT(tm.team_id) AS team_count
    FROM log_entries le
    LEFT JOIN team_members tm ON tm.user_id = le.user_id
    WHERE le.team_id IS NULL
    GROUP BY le.id, le.title, le.user_id
  `;
  console.log("\nLeft unscoped (user in 0 or 2+ teams):");
  for (const row of stranded) {
    console.log(
      `  ${row.id}  user=${row.user_id}  teams=${row.team_count}  "${row.title}"`,
    );
  }
}
