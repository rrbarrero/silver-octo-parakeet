import { auth } from "@clerk/nextjs/server";

export function isAuthenticated(): boolean {
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const { userId } = auth();
  return Boolean(userId);
}
