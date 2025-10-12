import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { getAuth } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { applicationModule } from "@/infrastructure/container";
import { createApplicationInputSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "./serializer";
import { requireUserId } from "@/lib/auth/isAuthenticated";
import { formatErrorResponse } from "@/lib/errors/formatErrorResponse";

const isDev = process.env.NODE_ENV === "development";

function debugLog(tag: string, payload: unknown) {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.log(`[applications.${tag}]`, payload);
}

function redactCookieHeader(value: string | null) {
  if (!value) return null;
  return value
    .split("; ")
    .map((kv) => kv.split("=")[0])
    .filter(Boolean);
}

export async function GET(request: Request) {
  try {
    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie");
    const authHeader = hdrs.get("authorization");
    const cookieStore = await cookies();
    const cookieList = cookieStore.getAll().map((c) => ({
      name: c.name,
      length: c.value?.length ?? 0,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite ?? null,
    }));
    const clerkCtx = getAuth(request);

    debugLog("GET.request", {
      authHeaderPresent: Boolean(authHeader),
      cookiesInHeader: redactCookieHeader(cookieHeader),
      cookiesStore: cookieList,
      clerkAuth: { userId: clerkCtx.userId, sessionId: clerkCtx.sessionId },
    });

    const ownerId = requireUserId(request);
    const applications =
      await applicationModule.queries.listApplications.execute(ownerId);

    const res = NextResponse.json(
      applications.map(serializeApplication),
      { status: 200 },
    );
    if (isDev) res.headers.set("x-debug", "applications.get.ok");
    return res;
  } catch (error) {
    debugLog(
      "GET.error",
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack?.split("\n").slice(0, 6) }
        : error,
    );
    const { status, body } = formatErrorResponse(error);
    const res = NextResponse.json(body, { status });
    if (isDev) res.headers.set("x-debug", "applications.get.error");
    return res;
  }
}

export async function POST(request: Request) {
  try {
    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie");
    const authHeader = hdrs.get("authorization");
    const cookieStore = await cookies();
    const cookieList = cookieStore.getAll().map((c) => ({
      name: c.name,
      length: c.value?.length ?? 0,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite ?? null,
    }));
    const clerkCtx = getAuth(request);

    const raw = await request.clone().text();
    debugLog("POST.request", {
      authHeaderPresent: Boolean(authHeader),
      cookiesInHeader: redactCookieHeader(cookieHeader),
      cookiesStore: cookieList,
      clerkAuth: { userId: clerkCtx.userId, sessionId: clerkCtx.sessionId },
      bodyPreview: raw.slice(0, 400),
    });

    let json: unknown;
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch (e) {
      debugLog("POST.body.parse.error", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const payload = createApplicationInputSchema.parse(json);
    const ownerId = requireUserId(request);

    const application =
      await applicationModule.commands.createApplication.execute({
        id: randomUUID(),
        companyName: payload.companyName,
        roleTitle: payload.roleTitle,
        roleDescription: payload.roleDescription,
        url: payload.url,
        appliedAt: new Date(`${payload.appliedAt}T00:00:00`),
        status: payload.status,
        ownerId,
        initialComment: payload.initialComment
          ? {
              id: randomUUID(),
              message: payload.initialComment,
            }
          : undefined,
      });

    const res = NextResponse.json(serializeApplication(application), {
      status: 201,
    });
    if (isDev) res.headers.set("x-debug", "applications.post.ok");
    return res;
  } catch (error) {
    if (error instanceof ZodError) {
      debugLog("POST.validation", error.issues);
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    debugLog(
      "POST.error",
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack?.split("\n").slice(0, 6) }
        : error,
    );
    const { status, body } = formatErrorResponse(error);
    const res = NextResponse.json(body, { status });
    if (isDev) res.headers.set("x-debug", "applications.post.error");
    return res;
  }
}
