import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
