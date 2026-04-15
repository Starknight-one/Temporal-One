import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const metadata: Metadata = {
  title: "Documentation — Temporal One",
};

type TreeFolder = {
  label: string;
  open: boolean;
  items?: { label: string; active?: boolean }[];
};

const TREE: TreeFolder[] = [
  {
    label: "Getting Started",
    open: true,
    items: [
      { label: "Project Overview" },
      { label: "Team Roles & Responsibilities" },
      { label: "Development Setup" },
    ],
  },
  {
    label: "Technical Specs",
    open: true,
    items: [
      { label: "API Architecture", active: true },
      { label: "Database Schema" },
      { label: "Matching Algorithm" },
    ],
  },
  { label: "Design", open: false },
  { label: "Research", open: false },
];

type Endpoint = { method: "GET" | "POST" | "PUT" | "DELETE"; route: string; desc: string };

const ENDPOINTS: Endpoint[] = [
  { method: "GET", route: "/api/v1/candidates", desc: "List all candidates" },
  { method: "POST", route: "/api/v1/matches", desc: "Create new match" },
  { method: "PUT", route: "/api/v1/jobs/:id", desc: "Update job posting" },
  { method: "DELETE", route: "/api/v1/jobs/:id", desc: "Remove job posting" },
];

const METHOD_COLOR: Record<Endpoint["method"], string> = {
  GET: "#39FF14",
  POST: "#FB923C",
  PUT: "#38BDF8",
  DELETE: "#F87171",
};

export default function DocsPage() {
  return (
    <>
      <DashboardSidebar active="docs" />
      <main className="flex flex-1 flex-col gap-5 overflow-hidden px-7 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-fg-primary">Documentation</h1>
          <button className="rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover">
            + New page
          </button>
        </div>

        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Tree */}
          <div className="hidden w-60 shrink-0 flex-col gap-1 overflow-y-auto py-4 pr-4 md:flex">
            {TREE.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5 pt-2">
                <span className="text-[13px] font-semibold text-fg-primary">
                  {f.open ? "▾" : "▸"} {f.label}
                </span>
                {f.open && f.items && (
                  <div className="flex flex-col pl-4 pt-1">
                    {f.items.map((it) => (
                      <span
                        key={it.label}
                        className={`rounded px-2 py-1.5 text-[13px] ${
                          it.active
                            ? "bg-[#39FF1412] font-medium text-accent"
                            : "text-fg-secondary hover:text-fg-primary"
                        }`}
                      >
                        {it.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden w-px self-stretch bg-border-base md:block" />

          {/* Doc content */}
          <article className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto rounded-lg bg-surface-card p-8">
            <h2 className="text-[28px] font-bold text-fg-primary">
              API Architecture
            </h2>
            <span className="font-mono text-[11px] tracking-[0.05em] text-fg-secondary">
              Last edited by Marcus R. · 2 days ago
            </span>
            <div className="h-px w-full bg-border-base" />

            <h3 className="text-lg font-semibold text-fg-primary">Overview</h3>
            <p className="text-sm leading-[1.6] text-fg-secondary">
              The HireMatch AI platform uses a RESTful API architecture built
              on Node.js with Express. All endpoints follow consistent naming
              conventions and return standardized JSON responses. Authentication
              is handled via JWT tokens with refresh token rotation.
            </p>

            <h3 className="text-lg font-semibold text-fg-primary">
              Endpoint Structure
            </h3>
            <p className="text-sm leading-[1.6] text-fg-secondary">
              All API routes are prefixed with /api/v1 and organized by
              resource type. Rate limiting is applied globally at 100 requests
              per minute per authenticated user.
            </p>

            <div className="overflow-hidden rounded-md bg-surface-card-alt">
              <div className="grid grid-cols-[110px_1fr_1fr] bg-border-base px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-primary">
                <span>Method</span>
                <span>Route</span>
                <span>Description</span>
              </div>
              {ENDPOINTS.map((e, i) => (
                <div key={e.route + e.method} className="flex flex-col">
                  <div className="grid grid-cols-[110px_1fr_1fr] px-4 py-2.5">
                    <span
                      className="font-mono text-xs"
                      style={{ color: METHOD_COLOR[e.method] }}
                    >
                      {e.method}
                    </span>
                    <span className="font-mono text-xs text-fg-secondary">
                      {e.route}
                    </span>
                    <span className="text-xs text-fg-secondary">{e.desc}</span>
                  </div>
                  {i < ENDPOINTS.length - 1 && (
                    <div className="h-px bg-border-base" />
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
