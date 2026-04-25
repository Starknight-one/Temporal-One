import type { ReactNode } from "react";
import { BuilderTopNav } from "@/components/admin/BuilderTopNav";
import { InboxProvider } from "@/components/admin/InboxState";
import { ReviewsProvider } from "@/components/admin/ReviewsState";
import { LogProvider } from "@/components/admin/LogState";
import { AddLogEntryModal } from "@/components/admin/AddLogEntryModal";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <InboxProvider>
      <ReviewsProvider>
        <LogProvider>
          <div className="min-h-dvh bg-surface-card-alt">
            <BuilderTopNav />
            <main className="px-4 py-8 sm:px-8 sm:py-10">{children}</main>
            <AddLogEntryModal />
          </div>
        </LogProvider>
      </ReviewsProvider>
    </InboxProvider>
  );
}
