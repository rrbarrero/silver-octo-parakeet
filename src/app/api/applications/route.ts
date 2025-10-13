import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
//

import { applicationModule } from "@/infrastructure/container";
import { createApplicationInputSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "./serializer";
import { requireUserId } from "@/lib/auth/isAuthenticated";
import { formatErrorResponse } from "@/lib/errors/formatErrorResponse";

//

export async function GET(request: NextRequest) {
  try {
    const ownerId = requireUserId(request);
    const applications =
      await applicationModule.queries.listApplications.execute(ownerId);

    return NextResponse.json(applications.map(serializeApplication), {
      status: 200,
    });
  } catch (error) {
    const { status, body } = formatErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = createApplicationInputSchema.parse(await request.json());
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

    return NextResponse.json(serializeApplication(application), {
      status: 201,
    });
  } catch (error) {
    const { status, body } = formatErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
