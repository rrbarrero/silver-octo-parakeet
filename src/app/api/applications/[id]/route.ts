import { NextRequest, NextResponse } from "next/server";

import { applicationModule } from "@/infrastructure/container";
import { updateApplicationStatusSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "../serializer";
import { requireUserId } from "@/lib/auth/isAuthenticated";
import { formatErrorResponse } from "@/lib/errors/formatErrorResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ownerId = requireUserId(request);
    const { id } = await params;
    const application =
      await applicationModule.queries.getApplicationById.execute(id, ownerId);

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeApplication(application), {
      status: 200,
    });
  } catch (error) {
    const { status, body } = formatErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ownerId = requireUserId(request);
    const { id } = await params;
    const body = updateApplicationStatusSchema.parse(await request.json());

    await applicationModule.commands.updateStatus.execute({
      id,
      status: body.status,
      ownerId,
    });

    const updated =
      await applicationModule.queries.getApplicationById.execute(id, ownerId);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeApplication(updated), { status: 200 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
