import { clerkMiddleware } from "@clerk/nextjs/server";

const middlewareConfig = process.env.NODE_ENV === "test" ? {} : { publicRoutes: ["/"] };

export default clerkMiddleware(middlewareConfig);

export const config = {
  matcher: [
    // Run middleware on all routes except static files and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
