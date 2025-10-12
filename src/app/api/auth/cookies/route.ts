import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  const requestHeaders = headers();
  const cookieHeader = requestHeaders.get("cookie");

  return NextResponse.json({
    cookieHeader: cookieHeader ?? null,
    cookies: allCookies.map((cookie) => ({
      name: cookie.name,
      valuePreview: cookie.value.slice(0, 8),
      sameSite: cookie.sameSite ?? null,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
    })),
  });
}
