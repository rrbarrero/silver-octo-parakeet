import { describe, expect, it } from "vitest";

import {
  AddCommentCommandHandler,
  CreateApplicationCommandHandler,
  UpdateApplicationStatusCommandHandler,
} from "@/domain/applications";
import { InMemoryApplicationRepository } from "@/infrastructure/persistence/InMemoryApplicationRepository";

const baseDate = new Date("2024-02-01T00:00:00Z");

describe("Application command handlers", () => {
  it("creates an application and persists it", async () => {
    const repository = new InMemoryApplicationRepository();
    const handler = new CreateApplicationCommandHandler(repository);

    const application = await handler.execute({
      id: "command-create",
      companyName: "Acme",
      roleTitle: "Engineer",
      appliedAt: baseDate,
      status: "cv_sent",
    });

    const stored = await repository.findById("command-create");
    expect(stored).toEqual(application);
  });

  it("updates status for an existing application", async () => {
    const repository = new InMemoryApplicationRepository();
    const createHandler = new CreateApplicationCommandHandler(repository);
    const updateHandler = new UpdateApplicationStatusCommandHandler(repository);

    await createHandler.execute({
      id: "command-update",
      companyName: "Globex",
      roleTitle: "Developer",
      appliedAt: baseDate,
      status: "cv_sent",
    });

    await updateHandler.execute({
      id: "command-update",
      status: "technical_interview",
    });

    const updated = await repository.findById("command-update");
    expect(updated?.status).toBe("technical_interview");
  });

  it("appends comments using the add comment handler", async () => {
    const repository = new InMemoryApplicationRepository();
    const createHandler = new CreateApplicationCommandHandler(repository);
    const addCommentHandler = new AddCommentCommandHandler(repository);

    await createHandler.execute({
      id: "command-comment",
      companyName: "Initech",
      roleTitle: "QA Analyst",
      appliedAt: baseDate,
      status: "cv_sent",
    });

    await addCommentHandler.execute({
      id: "command-comment",
      comment: {
        id: "comment-1",
        message: "Received invite for screening task",
        createdAt: new Date("2024-02-05T12:00:00Z"),
      },
    });

    const application = await repository.findById("command-comment");
    expect(application?.comments).toHaveLength(1);
    expect(application?.comments[0].message).toBe(
      "Received invite for screening task",
    );
  });
});
