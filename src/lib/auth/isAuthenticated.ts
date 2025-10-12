import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { AuthenticationError } from "@/lib/errors/DomainError";

export function requireUserId(request: NextRequest): string {
  if (process.env.NODE_ENV === "test") {
    return "test-user";
  }

  const { userId } = getAuth(request);

  if (!userId) {
    throw new AuthenticationError();
  }

  return userId;
}

export function isAuthenticated(request: NextRequest): boolean {
  try {
    return Boolean(requireUserId(request));
  } catch {
    return false;
  }
}
