import type { ReactNode } from "react";
import { auth } from "@/auth";
import { BuilderTopNav } from "@/components/admin/BuilderTopNav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  // middleware should have redirected by now; this is defensive only.
  const user = session?.user ?? {
    name: null,
    email: null,
    image: null,
    handle: null,
  };

  return (
    <div className="min-h-dvh bg-surface-card-alt">
      <BuilderTopNav
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
          handle: user.handle ?? null,
        }}
      />
      <main className="px-4 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
