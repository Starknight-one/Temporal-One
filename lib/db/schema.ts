import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
  pgEnum,
  jsonb,
  numeric,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const userRoleEnum = pgEnum("user_role", ["builder", "hirer", "admin"]);

export const entryTypeEnum = pgEnum("entry_type", [
  "built",
  "fixed",
  "researched",
  "designed",
  "shipped",
  "blocked",
]);

export const artifactKindEnum = pgEnum("artifact_kind", [
  "github",
  "notion",
  "figma",
  "loom",
  "external",
]);

/* ---------- Auth.js core tables ---------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    handle: text("handle").unique(),
    role: userRoleEnum("role").notNull().default("builder"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_handle_idx").on(t.handle)],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ---------- Domain tables ---------- */

export const logEntries = pgTable("log_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: entryTypeEnum("type").notNull(),
  timeSpent: numeric("time_spent", { precision: 4, scale: 1 }).notNull(),
  artifactUrl: text("artifact_url"),
  artifactKind: artifactKindEnum("artifact_kind"),
  artifactMeta: jsonb("artifact_meta").$type<Record<string, unknown>>(),
  note: text("note"),
  postedAt: timestamp("posted_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  lockedAt: timestamp("locked_at", { mode: "date" }),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  intent: text("intent").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  linkedinUrl: text("linkedin_url"),
  track: text("track"),
  company: text("company"),
  roles: text("roles"),
  note: text("note"),
  ip: text("ip"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const interestSubmissions = pgTable("interest_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  intent: text("intent").notNull(),
  target: text("target").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  note: text("note"),
  ip: text("ip"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* ---------- Domain tables (defined now, unused this cycle) ---------- */

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  projectName: text("project_name"),
  cohortNumber: integer("cohort_number"),
  startedAt: timestamp("started_at", { mode: "date" }),
  totalDays: integer("total_days").notNull().default(30),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role"),
    isLead: integer("is_lead").notNull().default(0),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.userId] })],
);

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  toUserId: uuid("to_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  realAndGood: text("real_and_good"),
  easyToWorkWith: text("easy_to_work_with"),
  note: text("note"),
  submittedAt: timestamp("submitted_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const inboxItems = pgTable("inbox_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  readAt: timestamp("read_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LogEntryRow = typeof logEntries.$inferSelect;
export type NewLogEntry = typeof logEntries.$inferInsert;
