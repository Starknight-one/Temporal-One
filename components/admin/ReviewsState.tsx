"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { REVIEW_QUEUE } from "@/lib/admin-data";

export type Answer = "yes" | "no" | null;

type Review = {
  handle: string;
  realAndGood: Answer;
  easyToWorkWith: Answer;
  note: string;
  submitted: boolean;
};

type Ctx = {
  reviews: Review[];
  setAnswer: (
    handle: string,
    field: "realAndGood" | "easyToWorkWith",
    value: Answer
  ) => void;
  setNote: (handle: string, note: string) => void;
  submitAll: () => void;
  pendingCount: number;
  doneCount: number;
};

const ReviewsCtx = createContext<Ctx | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(() =>
    REVIEW_QUEUE.map((t) => ({
      handle: t.handle,
      realAndGood: null,
      easyToWorkWith: null,
      note: "",
      submitted: false,
    }))
  );

  const setAnswer = useCallback(
    (handle: string, field: "realAndGood" | "easyToWorkWith", value: Answer) => {
      setReviews((prev) =>
        prev.map((r) => (r.handle === handle ? { ...r, [field]: value } : r))
      );
    },
    []
  );

  const setNote = useCallback((handle: string, note: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.handle === handle ? { ...r, note } : r))
    );
  }, []);

  const submitAll = useCallback(() => {
    setReviews((prev) => prev.map((r) => ({ ...r, submitted: true })));
  }, []);

  const doneCount = reviews.filter(
    (r) => r.realAndGood !== null && r.easyToWorkWith !== null
  ).length;
  const pendingCount = reviews.length - doneCount;

  const value = useMemo(
    () => ({ reviews, setAnswer, setNote, submitAll, pendingCount, doneCount }),
    [reviews, setAnswer, setNote, submitAll, pendingCount, doneCount]
  );

  return <ReviewsCtx.Provider value={value}>{children}</ReviewsCtx.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsCtx);
  if (!ctx) throw new Error("useReviews must be inside ReviewsProvider");
  return ctx;
}

export function usePendingReviewCount() {
  const ctx = useContext(ReviewsCtx);
  if (!ctx) return 0;
  return ctx.pendingCount;
}
