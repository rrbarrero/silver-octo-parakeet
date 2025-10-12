import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { applicationModule } from "@/infrastructure/container";
import { addApplicationCommentSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "../../serializer";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = addApplicationCommentSchema.parse(await request.json());

    await applicationModule.commands.addComment.execute({
      id: params.id,
      comment: {
        id: randomUUID(),
        message: body.comment,
      },
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
