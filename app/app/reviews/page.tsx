"use client";

import { useState } from "react";
import { REVIEW_QUEUE, getMember } from "@/lib/admin-data";
import { useReviews, type Answer } from "@/components/admin/ReviewsState";
import { Avatar } from "@/components/admin/shared";

type Mode = "quick" | "detailed";

export default function ReviewsPage() {
  const { reviews, setAnswer, setNote, submitAll, doneCount } = useReviews();
  const [mode, setMode] = useState<Mode>("quick");
  const total = reviews.length;
  const allDone = doneCount === total;
  const submitted = reviews.every((r) => r.submitted);

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[28px] font-semibold leading-tight text-fg-primary">
            Review · Wed, Apr 25
          </h1>
          <span className="rounded-full bg-[#FFF3E0] px-3 py-1 font-mono text-[11px] font-semibold text-accent">
            ⏰ Due in 4h 23m
          </span>
        </div>
        <p className="text-[14px] text-fg-secondary">
          For each teammate, rate today overall. Reviews are anonymous and
          immutable once submitted.
        </p>
      </header>

      <div className="flex gap-1 rounded-full border border-border-base bg-surface-card-alt p-1 self-start">
        <ModeButton active={mode === "quick"} onClick={() => setMode("quick")}>
          Quick (≈90s)
        </ModeButton>
        <ModeButton
          active={mode === "detailed"}
          onClick={() => setMode("detailed")}
        >
          Detailed (rank by entry)
        </ModeButton>
      </div>

      <div className="flex flex-col gap-3">
        {REVIEW_QUEUE.map((target) => {
          const review = reviews.find((r) => r.handle === target.handle)!;
          return (
            <ReviewCard
              key={target.handle}
              target={target}
              review={review}
              mode={mode}
              onAnswer={(field, value) => setAnswer(target.handle, field, value)}
              onNote={(note) => setNote(target.handle, note)}
            />
          );
        })}
      </div>

      <footer className="flex flex-col gap-3 rounded-xl border border-border-base bg-surface-card-alt p-5 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-fg-primary">
            {doneCount} of {total} reviews complete
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            All teammates must be rated to submit. Cannot edit after submit.
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-border-base bg-surface-card px-4 py-2 text-[13px] font-medium text-fg-primary hover:bg-surface-card-alt"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={!allDone || submitted}
            onClick={submitAll}
            className="rounded-md bg-surface-inverse px-4 py-2 text-[13px] font-semibold text-fg-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitted ? "Submitted" : `Submit all (${doneCount}/${total})`}
          </button>
        </div>
      </footer>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
        active
          ? "bg-surface-inverse text-fg-inverse"
          : "text-fg-secondary hover:text-fg-primary"
      }`}
    >
      {children}
    </button>
  );
}

function ReviewCard({
  target,
  review,
  mode,
  onAnswer,
  onNote,
}: {
  target: (typeof REVIEW_QUEUE)[number];
  review: { realAndGood: Answer; easyToWorkWith: Answer; note: string; submitted: boolean };
  mode: Mode;
  onAnswer: (field: "realAndGood" | "easyToWorkWith", value: Answer) => void;
  onNote: (note: string) => void;
}) {
  const member = getMember(target.handle);
  if (!member) return null;
  const done = review.realAndGood !== null && review.easyToWorkWith !== null;
  const half =
    (review.realAndGood !== null) !== (review.easyToWorkWith !== null);
  const status = done ? "Done" : half ? "Half done" : "Pending";
  const statusTone = done ? "ok" : half ? "warn" : "muted";
  const [showNote, setShowNote] = useState(!!review.note);

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border bg-surface-card px-5 py-4 ${
        done ? "border-[#C8E6C9] bg-[#FBFDF7]" : "border-border-base"
      }`}
    >
      <header className="flex items-center gap-3">
        <Avatar initials={member.initials} bg={member.avatarBg} size={36} />
        <div className="flex flex-col">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-fg-primary">
            {member.name}
            {member.isLead && (
              <span className="rounded-sm bg-accent px-1 py-[1px] font-mono text-[8px] font-bold tracking-[0.1em] text-fg-inverse">
                LEAD
              </span>
            )}
          </span>
          <span className="font-mono text-[11px] text-fg-muted">
            Today · {target.todayEntries.length} entries · {target.totalHours}
          </span>
        </div>
        <span className="ml-auto">
          <StatusPill status={status} tone={statusTone} />
        </span>
      </header>

      <ul className="flex flex-col gap-1 rounded-lg border border-border-soft bg-surface-card-alt px-4 py-3">
        {target.todayEntries.map((e, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 text-[13px] text-fg-primary"
          >
            <span className="truncate">{e.title}</span>
            <span className="font-mono text-[11px] text-fg-muted">{e.meta}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5">
        <ReviewQuestion
          n={1}
          label="Is the work real and good?"
          value={review.realAndGood}
          onChange={(v) => onAnswer("realAndGood", v)}
          disabled={review.submitted}
        />
        <ReviewQuestion
          n={2}
          label="Easy to work with?"
          value={review.easyToWorkWith}
          onChange={(v) => onAnswer("easyToWorkWith", v)}
          disabled={review.submitted}
        />
      </div>

      {mode === "detailed" && !showNote ? (
        <button
          type="button"
          onClick={() => setShowNote(true)}
          className="self-start font-mono text-[11px] font-medium text-accent hover:underline"
        >
          + Add anonymous note (only admin & employer see this)
        </button>
      ) : mode === "detailed" || showNote ? (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-fg-secondary">
            ANONYMOUS NOTE
          </span>
          <textarea
            value={review.note}
            onChange={(e) => onNote(e.target.value)}
            disabled={review.submitted}
            placeholder="Optional. Only admin & employer see this."
            rows={2}
            className="w-full resize-none rounded-lg border border-border-base bg-surface-card px-3 py-2 text-[13px] text-fg-primary outline-none focus:border-accent disabled:bg-surface-card-alt"
          />
        </div>
      ) : null}
    </article>
  );
}

function ReviewQuestion({
  n,
  label,
  value,
  onChange,
  disabled,
}: {
  n: number;
  label: string;
  value: Answer;
  onChange: (v: Answer) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-fg-muted">
        Q{n}
      </span>
      <span className="flex-1 text-[13px] text-fg-primary">{label}</span>
      <div className="flex items-center gap-2">
        <AnswerBox
          active={value === "yes"}
          tone="yes"
          disabled={disabled}
          onClick={() => onChange(value === "yes" ? null : "yes")}
        >
          Yes
        </AnswerBox>
        <AnswerBox
          active={value === "no"}
          tone="no"
          disabled={disabled}
          onClick={() => onChange(value === "no" ? null : "no")}
        >
          No
        </AnswerBox>
      </div>
    </div>
  );
}

function AnswerBox({
  active,
  tone,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  tone: "yes" | "no";
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const activeClasses =
    tone === "yes"
      ? "border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]"
      : "border-[#C62828] bg-[#FFEBEE] text-[#C62828]";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 min-w-[60px] items-center justify-center rounded-md border px-3 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? activeClasses
          : "border-border-base bg-surface-card text-fg-secondary hover:border-fg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function StatusPill({
  status,
  tone,
}: {
  status: string;
  tone: "ok" | "warn" | "muted";
}) {
  const cls =
    tone === "ok"
      ? "bg-[#E8F5E9] text-[#2E7D32]"
      : tone === "warn"
        ? "bg-[#FFF3E0] text-accent"
        : "bg-surface-card-alt text-fg-secondary";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em] ${cls}`}
    >
      {status}
    </span>
  );
}
