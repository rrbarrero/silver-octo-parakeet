import { NextResponse } from "next/server";

import { applicationModule } from "@/infrastructure/container";
import { updateApplicationStatusSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "../serializer";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const application =
      await applicationModule.queries.getApplicationById.execute(params.id);

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeApplication(application), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = updateApplicationStatusSchema.parse(await request.json());

    await applicationModule.commands.updateStatus.execute({
      id: params.id,
      status: body.status,
    });

    const updated =
      await applicationModule.queries.getApplicationById.execute(params.id);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeApplication(updated), { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
