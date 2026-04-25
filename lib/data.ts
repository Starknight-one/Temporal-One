export type LogType = "code" | "design" | "doc" | "talk" | "data";

export type ProjectLogEntry = {
  day: number;
  authorHandle: string;
  text: string;
  type: LogType;
  scores: string;
};

export type BuilderLogEntry = {
  day: number;
  text: string;
  type: LogType;
  hours: string;
  scores: string;
};

export type ProjectStatusKind =
  | "live"
  | "hiring"
  | "stealth"
  | "launch"
  | "open"
  | "lead"
  | "beta";

export type Project = {
  slug: string;
  initials: string;
  bg: string;
  fg: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  badge: { text: string; tone: "filled" | "outline" };
  status: { kind: ProjectStatusKind; daysIn: number; totalDays: number };
  entries: number;
  mrr: string;
  rating: string;
  tags: string[];
  team: { handle: string; role: string; isLeader?: boolean }[];
  log: ProjectLogEntry[];
};

export type Builder = {
  handle: string;
  initials: string;
  avatarBg: string;
  name: string;
  role: string;
  bio: string;
  verified: boolean;
  daysIn: number;
  totalDays: number;
  entries: number;
  hours: string;
  currentProject: string;
  previousProjects: { title: string; meta: string }[];
  log: BuilderLogEntry[];
};

/* -------------------------- Builders -------------------------- */

export const BUILDERS: Builder[] = [
  {
    handle: "aya-s",
    initials: "AY",
    avatarBg: "#000000",
    name: "Aya Saito",
    role: "backend · data",
    bio: "Backend / data engineer  ·  6y experience  ·  Berlin",
    verified: true,
    daysIn: 17,
    totalDays: 30,
    entries: 42,
    hours: "123h",
    currentProject: "hirematch-ai",
    previousProjects: [{ title: "Cohort 4 · TeamPulse", meta: "30 days  ·  4.7 / 4.8  ·  shipped" }],
    log: [
      { day: 17, text: "pushed 13 commits — match scoring v2 endpoint  ·  code", type: "code", hours: "3h", scores: "4.8 / 5.0" },
      { day: 16, text: "migrated DB to Postgres + 4 sessions tables live  ·  code", type: "code", hours: "4h", scores: "4.7 / 4.9" },
      { day: 16, text: "added webhook signature verification + replay guard  ·  code", type: "code", hours: "2h", scores: "4.8 / 4.9" },
      { day: 15, text: "finished sign-up + email verification — async backend ready  ·  code", type: "code", hours: "3h", scores: "4.8 / 5.0" },
      { day: 14, text: "payment flow webhook — Stripe sandbox green  ·  code", type: "code", hours: "5h", scores: "4.7 / 4.9" },
      { day: 13, text: "drafted ETL plan for nightly resume rescoring  ·  doc", type: "doc", hours: "1h", scores: "4.5 / 4.9" },
      { day: 12, text: "200-row dataset annotated for scoring weights  ·  data", type: "data", hours: "4h", scores: "4.7 / 4.9" },
      { day: 11, text: "paired with Lila on resume parser API  ·  code", type: "code", hours: "2h", scores: "4.8 / 4.9" },
      { day: 10, text: "talk + Vercel migration spec written  ·  doc", type: "doc", hours: "1h", scores: "4.6 / 4.8" },
      { day: 9, text: "interviewed 2 ex-recruiters about scoring weights  ·  talk", type: "talk", hours: "2h", scores: "4.6 / 4.7" },
    ],
  },
  {
    handle: "sasha-k",
    initials: "SK",
    avatarBg: "#FF9800",
    name: "Sasha Kovacs",
    role: "leader · full-stack",
    bio: "Full-stack engineer  ·  ex-CTO  ·  8y experience  ·  Tbilisi",
    verified: true,
    daysIn: 17,
    totalDays: 30,
    entries: 36,
    hours: "118h",
    currentProject: "hirematch-ai",
    previousProjects: [{ title: "Cohort 3 · DealRoom", meta: "30 days  ·  4.8 / 4.9  ·  shipped" }],
    log: [
      { day: 17, text: "Loom — weekly demo to 3 advisors  ·  talk", type: "talk", hours: "1h", scores: "4.7 / 5.0" },
      { day: 16, text: "landing copy v2 — 3 a/b variants ready  ·  doc", type: "doc", hours: "2h", scores: "4.6 / 4.9" },
      { day: 15, text: "added empty states + 404 page  ·  code", type: "code", hours: "3h", scores: "4.6 / 4.7" },
      { day: 14, text: "weekly retro — shipping pace good, hiring slow  ·  doc", type: "doc", hours: "1h", scores: "4.7 / 4.9" },
      { day: 13, text: "wrote launch plan for week 4  ·  doc", type: "doc", hours: "2h", scores: "4.6 / 4.8" },
    ],
  },
  {
    handle: "marcus-r",
    initials: "MR",
    avatarBg: "#000000",
    name: "Marcus Reyes",
    role: "design · UX",
    bio: "Product designer  ·  9y experience  ·  Lisbon",
    verified: true,
    daysIn: 17,
    totalDays: 30,
    entries: 31,
    hours: "104h",
    currentProject: "hirematch-ai",
    previousProjects: [],
    log: [
      { day: 17, text: "6 Figma frames — onboarding screens revised  ·  design", type: "design", hours: "5h", scores: "4.6 / 4.9" },
      { day: 14, text: "onboarding tour with Aria  ·  UX call  ·  talk", type: "talk", hours: "2h", scores: "4.5 / 4.9" },
      { day: 13, text: "initial mid · logo + typo + system finalized  ·  design", type: "design", hours: "4h", scores: "4.5 / 4.8" },
    ],
  },
  {
    handle: "lila-p",
    initials: "LP",
    avatarBg: "#000000",
    name: "Lila Park",
    role: "frontend",
    bio: "Frontend engineer  ·  4y experience  ·  Seoul",
    verified: true,
    daysIn: 17,
    totalDays: 30,
    entries: 29,
    hours: "94h",
    currentProject: "hirematch-ai",
    previousProjects: [],
    log: [
      { day: 16, text: "shipped 2 new screens — onboarding, profile, match  ·  code", type: "code", hours: "4h", scores: "4.9 / 4.8" },
      { day: 15, text: "redesigned tag system from scratch in 5 hours  ·  design", type: "design", hours: "5h", scores: "4.7 / 4.8" },
      { day: 12, text: "review parser hooked to OpenAI — first 200 done  ·  code", type: "code", hours: "3h", scores: "4.6 / 4.8" },
    ],
  },
  {
    handle: "dima-j",
    initials: "DJ",
    avatarBg: "#000000",
    name: "Dima Janowski",
    role: "growth · BD",
    bio: "Growth & BD  ·  ex-marketer  ·  5y experience  ·  Warsaw",
    verified: true,
    daysIn: 17,
    totalDays: 30,
    entries: 24,
    hours: "82h",
    currentProject: "hirematch-ai",
    previousProjects: [],
    log: [
      { day: 16, text: "sent 18 cold emails — 1 reply  ·  talk", type: "talk", hours: "2h", scores: "4.4 / 4.7" },
      { day: 13, text: "interviewed 5 unemployed devs about pain spots  ·  talk", type: "talk", hours: "3h", scores: "4.6 / 4.8" },
    ],
  },
];

/* -------------------------- Projects -------------------------- */

const HIREMATCH_LOG: ProjectLogEntry[] = [
  { day: 17, authorHandle: "aya-s", text: "pushed 13 commits — match scoring v2 endpoint  ·  code", type: "code", scores: "4.8 / 5.0" },
  { day: 17, authorHandle: "marcus-r", text: "6 Figma frames — onboarding screens revised  ·  design", type: "design", scores: "4.6 / 4.9" },
  { day: 17, authorHandle: "sasha-k", text: "Loom — weekly demo to 3 advisors  ·  talk", type: "talk", scores: "4.7 / 5.0" },
  { day: 16, authorHandle: "lila-p", text: "shipped 2 new screens — onboarding, profile, match  ·  code", type: "code", scores: "4.9 / 4.8" },
  { day: 16, authorHandle: "dima-j", text: "sent 18 cold emails — 1 reply  ·  talk", type: "talk", scores: "4.4 / 4.7" },
  { day: 16, authorHandle: "aya-s", text: "migrated DB to Postgres — auth + sessions tables live  ·  data", type: "data", scores: "4.8 / 5.0" },
  { day: 15, authorHandle: "sasha-k", text: "landing copy v2 — 3 a/b variants ready  ·  doc", type: "doc", scores: "4.6 / 4.9" },
  { day: 15, authorHandle: "lila-p", text: "redesigned tag system from scratch in 5 hours  ·  design", type: "design", scores: "4.7 / 4.8" },
  { day: 14, authorHandle: "marcus-r", text: "onboarding tour with Aria for 2 hours — UX call  ·  talk", type: "talk", scores: "4.5 / 4.9" },
  { day: 14, authorHandle: "sasha-k", text: "added empty states + 404 page  ·  code", type: "code", scores: "4.6 / 4.7" },
  { day: 14, authorHandle: "aya-s", text: "finished sign-up + email verification  ·  code", type: "code", scores: "4.7 / 4.9" },
  { day: 13, authorHandle: "dima-j", text: "interviewed 5 unemployed devs about pain spots  ·  talk", type: "talk", scores: "4.6 / 4.8" },
  { day: 13, authorHandle: "marcus-r", text: "initial mid · logo + typo + system finalized  ·  design", type: "design", scores: "4.5 / 4.8" },
  { day: 13, authorHandle: "sasha-k", text: "weekly retro — shipping pace good, hiring slow  ·  doc", type: "doc", scores: "4.7 / 4.9" },
  { day: 12, authorHandle: "lila-p", text: "review parser hooked to OpenAI — first 200 done  ·  code", type: "code", scores: "4.6 / 4.8" },
];

const HIREMATCH_TEAM = [
  { handle: "sasha-k", role: "leader · full-stack", isLeader: true },
  { handle: "aya-s", role: "backend · data" },
  { handle: "marcus-r", role: "design · UX" },
  { handle: "lila-p", role: "frontend" },
  { handle: "dima-j", role: "growth · BD" },
];

export const PROJECTS: Project[] = [
  {
    slug: "hirematch-ai",
    initials: "HM", bg: "#FFE0B2", fg: "#FF9800",
    name: "HireMatch AI",
    shortDesc: "AI matching for engineers tired of 200-app voids.",
    longDesc:
      "Auto-rewrites your resume into 200-word stories tailored to each role. Built by Team #017.",
    badge: { text: "HIRING", tone: "filled" },
    status: { kind: "live", daysIn: 17, totalDays: 30 },
    entries: 167, mrr: "$0", rating: "4.8 ★",
    tags: ["NLP", "hiring", "Next.js · Postgres"],
    team: HIREMATCH_TEAM,
    log: HIREMATCH_LOG,
  },
  {
    slug: "teampulse", initials: "TP", bg: "#E1BEE7", fg: "#7B1FA2",
    name: "TeamPulse",
    shortDesc: "Async standups + pulse checks for remote teams.",
    longDesc:
      "Replaces zoom standups with async daily check-ins + auto-summaries shared across timezones.",
    badge: { text: "HIRING", tone: "filled" },
    status: { kind: "live", daysIn: 9, totalDays: 30 },
    entries: 41, mrr: "$0", rating: "4.6 ★",
    tags: ["remote", "async", "SaaS"],
    team: [
      { handle: "aya-s", role: "leader · backend", isLeader: true },
      { handle: "marcus-r", role: "design" },
    ],
    log: HIREMATCH_LOG,
  },
  {
    slug: "skillstack", initials: "SS", bg: "#C8E6C9", fg: "#2E7D32",
    name: "SkillStack",
    shortDesc: "Bite-sized skill paths for laid-off mid-career devs.",
    longDesc:
      "30-minute paths that get you back to interview-ready in modern stacks. No tutorials, only artifacts.",
    badge: { text: "LEAD?", tone: "outline" },
    status: { kind: "lead", daysIn: 6, totalDays: 30 },
    entries: 28, mrr: "$0", rating: "4.4 ★",
    tags: ["edtech", "career", "MDX"],
    team: [{ handle: "lila-p", role: "frontend" }],
    log: HIREMATCH_LOG,
  },
  {
    slug: "dealroom", initials: "DR", bg: "#FFCDD2", fg: "#C62828",
    name: "DealRoom",
    shortDesc: "Async deal review for early-stage VCs. Live users.",
    longDesc:
      "Pipeline view + async deal commentary for partners across timezones. Lightweight, no Salesforce.",
    badge: { text: "LAUNCH", tone: "outline" },
    status: { kind: "launch", daysIn: 22, totalDays: 30 },
    entries: 77, mrr: "$1.2k", rating: "4.7 ★",
    tags: ["VC", "ops", "Postgres"],
    team: [{ handle: "sasha-k", role: "leader" }, { handle: "marcus-r", role: "design" }],
    log: HIREMATCH_LOG,
  },
  {
    slug: "team-42", initials: "??", bg: "#BBDEFB", fg: "#1565C0",
    name: "Team #42",
    shortDesc: "Anonymous · B2B SaaS · idea private until launch.",
    longDesc:
      "Stealth team. Project name is hidden until public launch. Logs are public, content paywalled.",
    badge: { text: "STEALTH", tone: "outline" },
    status: { kind: "stealth", daysIn: 4, totalDays: 30 },
    entries: 19, mrr: "$0", rating: "4.5 ★",
    tags: ["stealth", "B2B"],
    team: [],
    log: HIREMATCH_LOG,
  },
  {
    slug: "quiethire", initials: "QH", bg: "#E1BEE7", fg: "#6A1B9A",
    name: "QuietHire",
    shortDesc: "Hiring without LinkedIn theatre. Match by logs.",
    longDesc:
      "Recruiting tool that matches builders by their verified work logs, not by self-reported skills.",
    badge: { text: "HIRING", tone: "filled" },
    status: { kind: "live", daysIn: 14, totalDays: 30 },
    entries: 63, mrr: "$0", rating: "4.9 ★",
    tags: ["hiring", "recruiting", "AI"],
    team: [{ handle: "dima-j", role: "leader · growth", isLeader: true }],
    log: HIREMATCH_LOG,
  },
  {
    slug: "burnrate", initials: "BR", bg: "#FFCDD2", fg: "#C62828",
    name: "BurnRate",
    shortDesc: "Live runway calc + hiring spend warnings.",
    longDesc:
      "Plug your accounting + hiring data, get live runway and spend alerts. Built for early-stage CFOs.",
    badge: { text: "BETA", tone: "filled" },
    status: { kind: "beta", daysIn: 8, totalDays: 30 },
    entries: 34, mrr: "$0", rating: "4.5 ★",
    tags: ["finance", "fintech"],
    team: [],
    log: HIREMATCH_LOG,
  },
  {
    slug: "portpilot", initials: "PP", bg: "#BBDEFB", fg: "#1565C0",
    name: "PortPilot",
    shortDesc: "Auto-build portfolios from your verified log.",
    longDesc:
      "One-click static portfolio site generated from your Temporal One log. Custom domain, NDA-aware.",
    badge: { text: "LEAD?", tone: "outline" },
    status: { kind: "lead", daysIn: 12, totalDays: 30 },
    entries: 47, mrr: "$0", rating: "4.7 ★",
    tags: ["portfolio", "static", "career"],
    team: [],
    log: HIREMATCH_LOG,
  },
  {
    slug: "promptops", initials: "PO", bg: "#C8E6C9", fg: "#2E7D32",
    name: "PromptOps",
    shortDesc: "Shared prompt library with attribution + scores.",
    longDesc:
      "Team prompt library with versioning, peer rating, and attribution. Built for AI-first engineering teams.",
    badge: { text: "LAUNCH", tone: "outline" },
    status: { kind: "launch", daysIn: 17, totalDays: 30 },
    entries: 58, mrr: "$420", rating: "4.6 ★",
    tags: ["AI", "devtools", "ops"],
    team: [],
    log: HIREMATCH_LOG,
  },
  {
    slug: "crew7", initials: "C7", bg: "#FFE0B2", fg: "#FF9800",
    name: "Crew7",
    shortDesc: "Find a 5-person team in 72h. Skill-matched.",
    longDesc:
      "Onboarding for new builders. Open lab format, 3 days to find your 5, then a 30-day sprint.",
    badge: { text: "OPEN", tone: "filled" },
    status: { kind: "open", daysIn: 3, totalDays: 30 },
    entries: 15, mrr: "$0", rating: "4.3 ★",
    tags: ["onboarding", "matching"],
    team: [],
    log: HIREMATCH_LOG,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getBuilder(handle: string): Builder | undefined {
  return BUILDERS.find((b) => b.handle === handle);
}

export function getTeamBuilders(p: Project): Array<Builder & { roleOverride?: string; isLeader?: boolean }> {
  return p.team
    .map((m) => {
      const b = BUILDERS.find((x) => x.handle === m.handle);
      if (!b) return null;
      return { ...b, roleOverride: m.role, isLeader: m.isLeader };
    })
    .filter(Boolean) as Array<Builder & { roleOverride?: string; isLeader?: boolean }>;
}
