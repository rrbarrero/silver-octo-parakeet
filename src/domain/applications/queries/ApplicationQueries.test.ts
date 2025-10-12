import { describe, expect, it } from "vitest";

import {
  GetApplicationByIdQueryHandler,
  ListApplicationsQueryHandler,
} from "@/domain/applications";
import { createApplication } from "@/domain/applications/entities/Application";
import { InMemoryApplicationRepository } from "@/infrastructure/persistence/InMemoryApplicationRepository";

describe("Application query handlers", () => {
  it("lists applications ordered by applied date descending", async () => {
    const repository = new InMemoryApplicationRepository();
    const queryHandler = new ListApplicationsQueryHandler(repository);
    const ownerId = "user-query";

    await repository.save(
      createApplication({
        id: "query-1",
        companyName: "Acme",
        roleTitle: "Engineer",
        appliedAt: new Date("2024-01-10T00:00:00Z"),
        url: "https://acme.com/jobs/1",
        status: "cv_sent",
        ownerId,
      }),
    );

    await repository.save(
      createApplication({
        id: "query-2",
        companyName: "Globex",
        roleTitle: "Engineer",
        appliedAt: new Date("2024-03-05T00:00:00Z"),
        url: "https://globex.com/jobs/2",
        status: "cv_sent",
        ownerId,
      }),
    );

    const list = await queryHandler.execute(ownerId);
    expect(list.map((app) => app.id)).toEqual(["query-2", "query-1"]);
  });

  it("returns null when application is not found", async () => {
    const repository = new InMemoryApplicationRepository();
    const queryHandler = new GetApplicationByIdQueryHandler(repository);

    const result = await queryHandler.execute("missing", "user-query");
    expect(result).toBeNull();
  });
});
