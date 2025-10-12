import { getAuth } from "@clerk/nextjs/server";
import { AuthenticationError } from "@/lib/errors/DomainError";

export function requireUserId(request: Request): string {
  if (process.env.NODE_ENV === "test") {
    return "test-user";
  }

  const { userId, sessionId } = getAuth(request);
  if (process.env.NODE_ENV === "development") {
    console.log("[requireUserId]", { userId, sessionId });
  }

  if (!userId) {
    throw new AuthenticationError();
  }

  return userId;
}

export function isAuthenticated(request: Request): boolean {
  try {
    return Boolean(requireUserId(request));
  } catch {
    return false;
  }
}
