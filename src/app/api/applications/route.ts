import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { applicationModule } from "@/infrastructure/container";
import { createApplicationInputSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "./serializer";
import { isAuthenticated } from "@/lib/auth/isAuthenticated";

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications =
      await applicationModule.queries.listApplications.execute();

    return NextResponse.json(applications.map(serializeApplication), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = createApplicationInputSchema.parse(await request.json());

    const application = await applicationModule.commands.createApplication.execute(
      {
        id: randomUUID(),
        companyName: payload.companyName,
        roleTitle: payload.roleTitle,
        roleDescription: payload.roleDescription,
        url: payload.url,
        appliedAt: new Date(`${payload.appliedAt}T00:00:00`),
        status: payload.status,
        initialComment: payload.initialComment
          ? {
              id: randomUUID(),
              message: payload.initialComment,
            }
          : undefined,
      },
    );

    return NextResponse.json(serializeApplication(application), {
      status: 201,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
