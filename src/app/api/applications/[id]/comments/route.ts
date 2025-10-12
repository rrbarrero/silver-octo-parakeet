import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { applicationModule } from "@/infrastructure/container";
import { addApplicationCommentSchema } from "@/lib/validation/applicationSchemas";
import { serializeApplication } from "../../serializer";
import { requireUserId } from "@/lib/auth/isAuthenticated";
import { formatErrorResponse } from "@/lib/errors/formatErrorResponse";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const ownerId = requireUserId(request);
    const body = addApplicationCommentSchema.parse(await request.json());

    await applicationModule.commands.addComment.execute({
      id: params.id,
      comment: {
        id: randomUUID(),
        message: body.comment,
      },
      ownerId,
    });

    const updated =
      await applicationModule.queries.getApplicationById.execute(
        params.id,
        ownerId,
      );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeApplication(updated), { status: 200 });
  } catch (error) {
    const { status, body } = formatErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
