export type EntryType =
  | "built"
  | "fixed"
  | "researched"
  | "designed"
  | "shipped"
  | "blocked";

export type ArtifactKind = "github" | "notion" | "figma" | "loom" | "external";

export type Artifact = {
  kind: ArtifactKind;
  title: string;
  meta: string;
  href?: string;
  detected?: string;
};

export type LogEntry = {
  id: string;
  authorHandle: string;
  title: string;
  type: EntryType;
  timeSpent: string;
  artifact?: Artifact;
  postedAgo: string;
  reviewedBy?: string[];
  selfReviewed?: boolean;
};

export type PreviousDay = {
  day: number;
  dateLabel: string;
  entries: number;
  hours: string;
  warnings?: string;
  reviewsLabel?: string;
};

export type Member = {
  handle: string;
  initials: string;
  avatarBg: string;
  name: string;
  status: "logged-today" | "no-entries" | "returned" | "lead";
  statusLabel: string;
  isMe?: boolean;
  isLead?: boolean;
};

export type FeedItem = {
  id: string;
  authorHandle: string;
  postedAt: string;
  title: string;
  type: EntryType;
  artifact?: Artifact;
  metric?: string;
  reviewState: "pending" | "reviewed" | "skipped";
};

export type ReviewTarget = {
  handle: string;
  todayEntries: { title: string; meta: string }[];
  totalHours: string;
};

export type InboxItem = {
  id: string;
  group: "today" | "yesterday" | "earlier";
  kind: "warning" | "feedback" | "info" | "mention" | "reminder";
  title: string;
  body?: string;
  cta?: { label: string; href: string };
  timeAgo: string;
  read: boolean;
};

export const ME_HANDLE = "anna";
export const TEAM_NAME = "Team Alpha";
export const PROJECT_NAME = "HireMatch AI";
export const SPRINT_DAY = 7;
export const SPRINT_TOTAL = 30;

export const TEAM_MEMBERS: Member[] = [
  { handle: "yves", initials: "YV", avatarBg: "#FF9800", name: "Yves", status: "logged-today", statusLabel: "Logged today (3)" },
  { handle: "anna", initials: "AN", avatarBg: "#222222", name: "Anna", status: "lead", statusLabel: "Logged today (3) · Reviewed", isMe: true, isLead: true },
  { handle: "boris", initials: "BO", avatarBg: "#7B1FA2", name: "Boris", status: "no-entries", statusLabel: "No entries today" },
  { handle: "carol", initials: "CA", avatarBg: "#C62828", name: "Carol", status: "returned", statusLabel: "Returned (1)" },
  { handle: "dmitry", initials: "DM", avatarBg: "#1565C0", name: "Dmitry", status: "no-entries", statusLabel: "No entries today" },
];

export function getMember(handle: string): Member | undefined {
  return TEAM_MEMBERS.find((m) => m.handle === handle);
}

export const TODAY_ENTRIES: LogEntry[] = [
  {
    id: "t-1",
    authorHandle: "anna",
    title: "Built login form with OAuth",
    type: "built",
    timeSpent: "3h",
    artifact: {
      kind: "github",
      title: "GitHub PR #142",
      meta: "324 +    21 −    /    src / auth / login.tsx",
      detected: "github.com/team42/hirematch/pull/142",
      href: "#",
    },
    postedAgo: "posted 27 min ago",
    selfReviewed: true,
  },
  {
    id: "t-2",
    authorHandle: "anna",
    title: "Fixed race condition in auth middleware",
    type: "fixed",
    timeSpent: "1.2h",
    artifact: {
      kind: "github",
      title: "GitHub PR #143",
      meta: "12 +    7 −    /    src / lib / session.ts",
      detected: "github.com/team42/hirematch/pull/143",
      href: "#",
    },
    postedAgo: "committed 12 min ago",
  },
];

export const PREVIOUS_DAYS: PreviousDay[] = [
  { day: 6, dateLabel: "Apr 24", entries: 3, hours: "6h", reviewsLabel: "3 / 3 reviewed" },
  { day: 5, dateLabel: "Apr 23", entries: 2, hours: "4h", reviewsLabel: "3 / 3 reviewed" },
  { day: 4, dateLabel: "Apr 22", entries: 4, hours: "4h", reviewsLabel: "" },
  { day: 3, dateLabel: "Apr 21", entries: 2, hours: "3h", warnings: "1 missing" },
];

export const TEAM_FEED: FeedItem[] = [
  {
    id: "f-1",
    authorHandle: "anna",
    postedAt: "14:02",
    title: "Designed onboarding flow",
    type: "designed",
    artifact: { kind: "figma", title: "Figma · Onboarding v3", meta: "7 frames · last edited 60 min ago" },
    metric: "5h",
    reviewState: "pending",
  },
  {
    id: "f-2",
    authorHandle: "boris",
    postedAt: "11:48",
    title: "Researched Stripe alternatives",
    type: "researched",
    artifact: { kind: "notion", title: "Notion · Payments research", meta: "comparison of 4 providers · 6 areas" },
    metric: "2h",
    reviewState: "pending",
  },
  {
    id: "f-3",
    authorHandle: "anna",
    postedAt: "10:15",
    title: "Fixed race condition in auth middleware",
    type: "fixed",
    artifact: { kind: "github", title: "PR #143", meta: "12 +  7 −" },
    metric: "1.2h",
    reviewState: "reviewed",
  },
  {
    id: "f-4",
    authorHandle: "anna",
    postedAt: "09:30",
    title: "Set up Postgres migrations",
    type: "built",
    artifact: { kind: "github", title: "GitHub PR #141", meta: "82 +    7 −    /    db / migrations" },
    metric: "3h",
    reviewState: "reviewed",
  },
];

export const REVIEW_QUEUE: ReviewTarget[] = [
  {
    handle: "anna",
    totalHours: "5h",
    todayEntries: [
      { title: "Designed onboarding flow", meta: "Figma · 5h" },
      { title: "Set up Postgres migrations", meta: "PR #141 · 3h" },
      { title: "Researched OAuth providers", meta: "Notion · 1h" },
    ],
  },
  {
    handle: "boris",
    totalHours: "2h",
    todayEntries: [{ title: "Researched Stripe alternatives", meta: "Notion · 2h" }],
  },
  {
    handle: "dmitry",
    totalHours: "3.5h",
    todayEntries: [
      { title: "Wired up dashboard data layer", meta: "PR #38 · 2h" },
      { title: "Sync call with Yves on routing", meta: "Loom · 1.5h" },
    ],
  },
];

export const INBOX_ITEMS: InboxItem[] = [
  {
    id: "i-1",
    group: "today",
    kind: "warning",
    title: "Reviews due in 4h 23m",
    body: "You haven't submitted today's peer reviews. They lock at 24:00 — after that you can't review.",
    cta: { label: "Review now", href: "/app/reviews" },
    timeAgo: "20:31",
    read: false,
  },
  {
    id: "i-2",
    group: "today",
    kind: "warning",
    title: "Carol hasn't logged in 36h",
    body: "Your teammate has 0 entries in the last 36 hours. Team velocity is at risk.",
    cta: { label: "Open team feed", href: "/app/team" },
    timeAgo: "13:00",
    read: false,
  },
  {
    id: "i-3",
    group: "today",
    kind: "feedback",
    title: "Anna left you anonymous feedback",
    body: "“Great work on the Postgres migration. Could you share the runbook with the team?”",
    timeAgo: "11:48",
    read: false,
  },
  {
    id: "i-4",
    group: "yesterday",
    kind: "info",
    title: "Day 6 reviews submitted",
    body: "4 of 4 teammates reviewed. You're on a 6-day review streak.",
    timeAgo: "23:14",
    read: true,
  },
  {
    id: "i-5",
    group: "yesterday",
    kind: "mention",
    title: "Boris reviewed your entry",
    body: "Your PR #135 (“Set up CI pipeline”) was reviewed and approved.",
    timeAgo: "18:32",
    read: true,
  },
  {
    id: "i-6",
    group: "earlier",
    kind: "info",
    title: "Sprint Day 5 closed",
    body: "Your team logged 12 entries · 28h logged · 100% review rate.",
    timeAgo: "Apr 23",
    read: true,
  },
  {
    id: "i-7",
    group: "earlier",
    kind: "info",
    title: "Anna was elected LEAD for Day 6",
    body: "3 of 4 votes. Term resets after the day closes.",
    timeAgo: "Apr 23",
    read: true,
  },
];

export const PUBLIC_DAY_TAGS = [
  { label: "Built", count: 3 },
  { label: "Fixed", count: 2 },
  { label: "Shipped", count: 2 },
  { label: "Researched", count: 2 },
];
