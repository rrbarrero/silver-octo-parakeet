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
    const ownerId = "user-command";

    const application = await handler.execute({
      id: "command-create",
      companyName: "Acme",
      roleTitle: "Engineer",
      url: "https://jobs.acme.com/frontend",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId,
    });

    const stored = await repository.findById("command-create", ownerId);
    expect(stored).toEqual(application);
  });

  it("updates status for an existing application", async () => {
    const repository = new InMemoryApplicationRepository();
    const createHandler = new CreateApplicationCommandHandler(repository);
    const updateHandler = new UpdateApplicationStatusCommandHandler(repository);
    const ownerId = "user-update";

    await createHandler.execute({
      id: "command-update",
      companyName: "Globex",
      roleTitle: "Developer",
      url: "https://globex.com/jobs/123",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId,
    });

    await updateHandler.execute({
      id: "command-update",
      status: "technical_interview",
      ownerId,
    });

    const updated = await repository.findById("command-update", ownerId);
    expect(updated?.status).toBe("technical_interview");
  });

  it("appends comments using the add comment handler", async () => {
    const repository = new InMemoryApplicationRepository();
    const createHandler = new CreateApplicationCommandHandler(repository);
    const addCommentHandler = new AddCommentCommandHandler(repository);
    const ownerId = "user-comment";

    await createHandler.execute({
      id: "command-comment",
      companyName: "Initech",
      roleTitle: "QA Analyst",
      url: "https://initech.com/careers/qa",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId,
    });

    await addCommentHandler.execute({
      id: "command-comment",
      comment: {
        id: "comment-1",
        message: "Received invite for screening task",
        createdAt: new Date("2024-02-05T12:00:00Z"),
      },
      ownerId,
    });

    const application = await repository.findById("command-comment", ownerId);
    expect(application?.comments).toHaveLength(1);
    expect(application?.comments[0].message).toBe(
      "Received invite for screening task",
    );
  });
});
