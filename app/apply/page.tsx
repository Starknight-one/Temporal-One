"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SubpageHeader } from "@/components/SubpageHeader";
import { Footer } from "@/components/Footer";

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Engineer",
  "Mobile Engineer",
  "Product Designer",
  "Product Manager",
  "Data / ML Engineer",
  "DevOps / SRE",
  "Other",
];

const YEARS = [
  "0–1",
  "1–3",
  "3–5",
  "5–8",
  "8–12",
  "12+",
];

const AVAILABILITY = ["10–15h", "15–20h", "20–30h", "30h+"] as const;
type Availability = (typeof AVAILABILITY)[number];

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success" };

export default function ApplyPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [availability, setAvailability] = useState<Availability>("15–20h");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          years,
          linkedin,
          availability,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }

      setState({ kind: "success" });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again.",
      });
    }
  }

  return (
    <>
      <SubpageHeader />
      <main className="bg-surface-primary">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 px-6 pb-12 pt-20 text-center sm:px-12 md:px-20 md:pt-24">
          <span className="font-mono text-[13px] uppercase tracking-[0.25em] text-accent">
            Join the waitlist
          </span>
          <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl md:text-7xl lg:text-[88px]">
            Claim your
            <br />
            spot.
          </h1>
          <p className="max-w-xl text-base leading-[1.6] text-fg-secondary sm:text-lg">
            The next cohort starts soon. Fill in your details and we&apos;ll
            match you with a team within a week. Only 15 spots per cohort.
          </p>
        </section>

        {/* Form */}
        <section className="px-6 pb-16 sm:px-12 md:px-20">
          <div className="mx-auto w-full max-w-[560px]">
            {state.kind === "success" ? (
              <SuccessCard firstName={firstName} />
            ) : (
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-7 border border-border-base bg-surface-card p-8 sm:p-12"
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First name" htmlFor="firstName">
                    <TextInput
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(v) => setFirstName(v)}
                      required
                    />
                  </Field>
                  <Field label="Last name" htmlFor="lastName">
                    <TextInput
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(v) => setLastName(v)}
                      required
                    />
                  </Field>
                </div>

                <Field label="Email address" htmlFor="email">
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(v) => setEmail(v)}
                    required
                  />
                </Field>

                <Field label="Primary role" htmlFor="role">
                  <SelectInput
                    id="role"
                    name="role"
                    value={role}
                    onChange={(v) => setRole(v)}
                    placeholder="Select your role..."
                    options={ROLES}
                    required
                  />
                </Field>

                <Field label="Years of experience" htmlFor="years">
                  <SelectInput
                    id="years"
                    name="years"
                    value={years}
                    onChange={(v) => setYears(v)}
                    placeholder="5+"
                    options={YEARS}
                    required
                  />
                </Field>

                <Field label="LinkedIn profile URL" htmlFor="linkedin">
                  <TextInput
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    autoComplete="url"
                    placeholder="linkedin.com/in/janedoe"
                    value={linkedin}
                    onChange={(v) => setLinkedin(v)}
                    required
                  />
                </Field>

                <fieldset className="flex flex-col gap-2">
                  <legend className="text-[13px] font-medium text-fg-secondary">
                    Weekly availability (hours)
                  </legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {AVAILABILITY.map((a) => {
                      const selected = availability === a;
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setAvailability(a)}
                          aria-pressed={selected}
                          className={`flex h-12 items-center justify-center border text-sm transition-colors ${
                            selected
                              ? "border-2 border-accent font-medium text-accent"
                              : "border-border-base text-fg-secondary hover:border-fg-secondary"
                          } bg-surface-primary`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {state.kind === "error" && (
                  <p
                    role="alert"
                    className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    {state.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state.kind === "submitting"}
                  className="mt-1 inline-flex h-14 items-center justify-center rounded-sm bg-accent text-base font-semibold text-fg-inverse transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state.kind === "submitting"
                    ? "Sending..."
                    : "Join the waitlist"}
                </button>

                <p className="text-center text-[13px] text-fg-secondary">
                  We verify all applicants via LinkedIn. You&apos;ll hear back
                  within 48 hours.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Bottom strip */}
        <section className="px-6 pb-20 sm:px-12 md:px-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="font-mono text-[13px] text-fg-secondary">
                7 of 15 spots remaining in the next cohort
              </span>
            </div>
            <Link
              href="/cohort"
              className="text-[15px] font-medium text-accent transition-colors hover:text-accent-hover"
            >
              See who&apos;s already in →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-fg-secondary"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="h-12 border border-border-base bg-surface-primary px-4 text-[15px] text-fg-primary outline-none transition-colors placeholder:text-fg-secondary focus:border-accent"
    />
  );
}

function SelectInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  required,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`h-12 appearance-none border border-border-base bg-surface-primary bg-[right_1rem_center] bg-no-repeat px-4 pr-10 text-[15px] outline-none transition-colors focus:border-accent ${
        value ? "text-fg-primary" : "text-fg-secondary"
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23A1A1AA' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-surface-primary text-fg-primary">
          {o}
        </option>
      ))}
    </select>
  );
}

function SuccessCard({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-col items-center gap-6 border border-accent bg-surface-card p-8 text-center sm:p-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-3xl text-fg-inverse">
        ✓
      </span>
      <h2 className="font-display text-3xl uppercase leading-[0.95] sm:text-4xl">
        {firstName ? `Thanks, ${firstName}.` : "You're on the list."}
      </h2>
      <p className="max-w-md text-[15px] leading-[1.6] text-fg-secondary">
        We got your application. We&apos;ll review your LinkedIn and get back
        to you within 48 hours with next steps for the upcoming cohort.
      </p>
      <Link
        href="/cohort"
        className="font-mono text-[13px] uppercase tracking-[0.25em] text-accent transition-colors hover:text-accent-hover"
      >
        See the live cohort →
      </Link>
    </div>
  );
}
