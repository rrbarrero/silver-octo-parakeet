import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { requireUserId } from "@/lib/auth/isAuthenticated";

export async function GET(request: Request) {
  const { userId, sessionId } = getAuth(request);

  let viaRequire: string | null = null;
  try {
    viaRequire = requireUserId(request);
  } catch {
    viaRequire = null;
  }

  return NextResponse.json({
    userId: userId ?? null,
    sessionId: sessionId ?? null,
    viaRequireUserId: viaRequire,
  });
}
