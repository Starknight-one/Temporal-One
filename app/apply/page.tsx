"use client";

import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/LandingHeader";
import { Footer } from "@/components/Footer";

type Intent = "build" | "hire";

const TRACKS = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "fullstack", label: "Full-stack" },
  { key: "design", label: "Design" },
  { key: "pm", label: "PM" },
  { key: "growth", label: "Growth" },
  { key: "other", label: "Other" },
] as const;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; intent: Intent; name: string };

export default function ApplyPage() {
  const [intent, setIntent] = useState<Intent>("build");

  // build fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [track, setTrack] = useState<(typeof TRACKS)[number]["key"]>("fullstack");
  const [note, setNote] = useState("");

  // hire fields
  const [company, setCompany] = useState("");
  const [hireName, setHireName] = useState("");
  const [hireEmail, setHireEmail] = useState("");
  const [roles, setRoles] = useState("");

  // honeypot
  const [website, setWebsite] = useState("");

  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "submitting" });

    const body =
      intent === "build"
        ? {
            intent: "build",
            name,
            email,
            linkedin,
            track,
            note: note || undefined,
            website,
          }
        : {
            intent: "hire",
            company,
            name: hireName,
            email: hireEmail,
            roles,
            website,
          };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      setState({
        kind: "success",
        intent,
        name: intent === "build" ? name : hireName,
      });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <>
        <LandingHeader />
        <main className="bg-surface-primary">
          <SuccessCard intent={state.intent} name={state.name} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <LandingHeader />
      <main className="bg-surface-primary">
        <Hero />

        <section className="px-6 pb-16 sm:px-12 md:px-20">
          <div className="mx-auto w-full max-w-[560px]">
            <IntentToggle intent={intent} onChange={setIntent} />

            <form
              onSubmit={onSubmit}
              className="mt-5 flex flex-col gap-5 rounded-2xl border border-border-base bg-surface-card p-6 sm:p-8"
              noValidate
            >
              {/* Honeypot — hidden from real users via tw classes + aria */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label>
                  Website
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              {intent === "build" ? (
                <BuildFields
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  linkedin={linkedin}
                  setLinkedin={setLinkedin}
                  track={track}
                  setTrack={setTrack}
                  note={note}
                  setNote={setNote}
                />
              ) : (
                <HireFields
                  company={company}
                  setCompany={setCompany}
                  name={hireName}
                  setName={setHireName}
                  email={hireEmail}
                  setEmail={setHireEmail}
                  roles={roles}
                  setRoles={setRoles}
                />
              )}

              {state.kind === "error" && (
                <p
                  role="alert"
                  className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700"
                >
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={state.kind === "submitting"}
                className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-accent text-[14px] font-semibold text-fg-inverse transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state.kind === "submitting"
                  ? "Sending…"
                  : intent === "build"
                    ? "Send my application"
                    : "Request pilot access"}
              </button>

              <p className="text-center font-mono text-[11px] text-fg-muted">
                {intent === "build"
                  ? "We'll reply within 48h. Verification is via your LinkedIn."
                  : "We'll reply within 48h with pilot details."}
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* -------------------------- Hero -------------------------- */

function Hero() {
  return (
    <section className="flex flex-col items-center gap-4 px-6 pb-8 pt-14 text-center sm:px-12 md:px-20">
      <span className="font-mono text-[11px] tracking-[0.35em] text-fg-muted">
        APPLY
      </span>
      <h1 className="max-w-[720px] font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-fg-primary sm:text-5xl md:text-[56px]">
        Join Temporal One.
      </h1>
      <p className="max-w-[560px] text-[15px] leading-[1.5] text-fg-secondary">
        One toggle below. Either you&apos;re building with a team this month,
        or you&apos;re hiring and want pilot access to the logs.
      </p>
    </section>
  );
}

/* -------------------------- Intent toggle -------------------------- */

function IntentToggle({
  intent,
  onChange,
}: {
  intent: Intent;
  onChange: (i: Intent) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-border-base bg-surface-card-alt p-1">
      <ToggleButton active={intent === "build"} onClick={() => onChange("build")}>
        I&apos;m building
      </ToggleButton>
      <ToggleButton active={intent === "hire"} onClick={() => onChange("hire")}>
        I&apos;m hiring
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-surface-inverse text-fg-inverse"
          : "text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------- Build fields -------------------------- */

function BuildFields({
  name,
  setName,
  email,
  setEmail,
  linkedin,
  setLinkedin,
  track,
  setTrack,
  note,
  setNote,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  track: (typeof TRACKS)[number]["key"];
  setTrack: (v: (typeof TRACKS)[number]["key"]) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  return (
    <>
      <Field label="Name" htmlFor="name">
        <Input
          id="name"
          value={name}
          onChange={setName}
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />
      </Field>
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jane@example.com"
          autoComplete="email"
          required
        />
      </Field>
      <Field
        label="LinkedIn URL"
        htmlFor="linkedin"
        hint="We verify all builders against LinkedIn before matching."
      >
        <Input
          id="linkedin"
          type="url"
          value={linkedin}
          onChange={setLinkedin}
          placeholder="https://linkedin.com/in/janedoe"
          autoComplete="url"
          required
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-mono text-[11px] tracking-[0.08em] text-fg-secondary">
          Track
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {TRACKS.map((t) => {
            const active = track === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTrack(t.key)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-surface-inverse font-semibold text-fg-inverse"
                    : "border border-border-base bg-surface-card-alt text-fg-secondary hover:text-fg-primary"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field
        label="Short note (optional)"
        htmlFor="note"
        hint="One line — what you'd contribute or what you'd build."
      >
        <Textarea
          id="note"
          value={note}
          onChange={setNote}
          placeholder="I want to build a tool that…"
        />
      </Field>
    </>
  );
}

/* -------------------------- Hire fields -------------------------- */

function HireFields({
  company,
  setCompany,
  name,
  setName,
  email,
  setEmail,
  roles,
  setRoles,
}: {
  company: string;
  setCompany: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  roles: string;
  setRoles: (v: string) => void;
}) {
  return (
    <>
      <Field label="Company" htmlFor="company">
        <Input
          id="company"
          value={company}
          onChange={setCompany}
          placeholder="Your company"
          autoComplete="organization"
          required
        />
      </Field>
      <Field label="Your name" htmlFor="hire-name">
        <Input
          id="hire-name"
          value={name}
          onChange={setName}
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />
      </Field>
      <Field label="Work email" htmlFor="hire-email">
        <Input
          id="hire-email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jane@yourco.com"
          autoComplete="email"
          required
        />
      </Field>
      <Field
        label="Roles you're hiring for"
        htmlFor="roles"
        hint="A few lines — stack, level, location, anything else useful."
      >
        <Textarea
          id="roles"
          value={roles}
          onChange={setRoles}
          placeholder="Senior backend (Go/Python), remote EU, paying $130–160k…"
          rows={4}
        />
      </Field>
    </>
  );
}

/* -------------------------- Atoms -------------------------- */

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] tracking-[0.08em] text-fg-secondary"
      >
        {label}
      </label>
      {children}
      {hint && (
        <span className="font-mono text-[11px] text-fg-muted">{hint}</span>
      )}
    </div>
  );
}

function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="h-11 rounded-lg border border-border-base bg-surface-card-alt px-3.5 text-[14px] text-fg-primary outline-none placeholder:text-fg-muted focus:border-fg-secondary"
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="rounded-lg border border-border-base bg-surface-card-alt px-3.5 py-3 text-[14px] text-fg-primary outline-none placeholder:text-fg-muted focus:border-fg-secondary"
    />
  );
}

/* -------------------------- Success -------------------------- */

function SuccessCard({ intent, name }: { intent: Intent; name: string }) {
  const first = name.trim().split(/\s+/)[0] || (intent === "build" ? "builder" : "hirer");
  return (
    <section className="px-6 pt-14 pb-24 sm:px-12 md:px-20">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-5 rounded-2xl border border-accent bg-surface-card px-8 py-12 text-center sm:px-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[20px] font-semibold text-fg-inverse">
          ✓
        </span>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.01em] text-fg-primary sm:text-[32px]">
          Thanks, {first}.
        </h2>
        <p className="max-w-[440px] text-[15px] leading-[1.55] text-fg-secondary">
          {intent === "build"
            ? "We got your application. We'll review your LinkedIn and reply within 48h with next steps."
            : "Got it. We'll reply within 48h with pilot details and a short intro call."}
        </p>
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.2em] text-fg-primary hover:underline"
        >
          BACK TO THE FEED →
        </Link>
      </div>
    </section>
  );
}
