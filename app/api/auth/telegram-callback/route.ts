import { NextResponse } from "next/server";
import { z } from "zod";
import { signIn } from "@/auth";

const PayloadSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.union([z.string(), z.number()]).transform(String),
  hash: z.string(),
  callbackUrl: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { callbackUrl, ...credentials } = parsed.data;
  try {
    await signIn("telegram", {
      ...credentials,
      redirect: false,
    });
    return NextResponse.json({ ok: true, redirect: callbackUrl ?? "/app/today" });
  } catch (err) {
    console.error("Telegram sign-in failed", err);
    return NextResponse.json({ error: "auth_failed" }, { status: 401 });
  }
}
