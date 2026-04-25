"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  TODAY_ENTRIES,
  type EntryType,
  type LogEntry,
} from "@/lib/admin-data";

type Ctx = {
  entries: LogEntry[];
  addEntry: (input: {
    title: string;
    type: EntryType;
    timeSpent: string;
    artifactUrl?: string;
    note?: string;
  }) => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const LogCtx = createContext<Ctx | null>(null);

export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>(TODAY_ENTRIES);
  const [modalOpen, setModalOpen] = useState(false);

  const addEntry = useCallback(
    (input: {
      title: string;
      type: EntryType;
      timeSpent: string;
      artifactUrl?: string;
      note?: string;
    }) => {
      const id = `t-${Date.now()}`;
      const detected = parseGithubUrl(input.artifactUrl);
      const entry: LogEntry = {
        id,
        authorHandle: "anna",
        title: input.title,
        type: input.type,
        timeSpent: input.timeSpent,
        postedAgo: "just now",
        artifact: detected
          ? {
              kind: "github",
              title: `GitHub PR #${detected.number}`,
              meta: "auto-detected just now",
              detected: detected.shortUrl,
              href: input.artifactUrl,
            }
          : input.artifactUrl
            ? {
                kind: "external",
                title: input.artifactUrl,
                meta: "external link",
                href: input.artifactUrl,
              }
            : undefined,
      };
      setEntries((prev) => [entry, ...prev]);
    },
    []
  );

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const value = useMemo(
    () => ({ entries, addEntry, modalOpen, openModal, closeModal }),
    [entries, addEntry, modalOpen, openModal, closeModal]
  );

  return <LogCtx.Provider value={value}>{children}</LogCtx.Provider>;
}

export function useLog() {
  const ctx = useContext(LogCtx);
  if (!ctx) throw new Error("useLog must be inside LogProvider");
  return ctx;
}

function parseGithubUrl(url?: string): { number: string; shortUrl: string } | null {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return { number: match[2], shortUrl: `github.com/${match[1]}/pull/${match[2]}` };
}
