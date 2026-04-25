"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INBOX_ITEMS, type InboxItem } from "@/lib/admin-data";

type Ctx = {
  items: InboxItem[];
  markAllRead: () => void;
  markRead: (id: string) => void;
};

const InboxCtx = createContext<Ctx | null>(null);

export function InboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InboxItem[]>(INBOX_ITEMS);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, read: true } : it))
    );
  }, []);

  const value = useMemo(
    () => ({ items, markAllRead, markRead }),
    [items, markAllRead, markRead]
  );

  return <InboxCtx.Provider value={value}>{children}</InboxCtx.Provider>;
}

export function useInbox() {
  const ctx = useContext(InboxCtx);
  if (!ctx) throw new Error("useInbox must be inside InboxProvider");
  return ctx;
}

export function useUnreadInboxCount() {
  const ctx = useContext(InboxCtx);
  if (!ctx) return 0;
  return ctx.items.filter((it) => !it.read).length;
}
