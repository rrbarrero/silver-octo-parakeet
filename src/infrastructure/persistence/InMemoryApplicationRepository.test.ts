import { describe, expect, it } from "vitest";

import { createApplication } from "@/domain/applications";
import { InMemoryApplicationRepository } from "./InMemoryApplicationRepository";

const baseDate = new Date("2024-03-01T00:00:00Z");

describe("InMemoryApplicationRepository", () => {
  it("saves and retrieves applications", async () => {
    const repository = new InMemoryApplicationRepository();
    const application = createApplication({
      id: "repo-1",
      companyName: "Umbrella",
      roleTitle: "Backend Engineer",
      appliedAt: baseDate,
      status: "cv_sent",
    });

    await repository.save(application);
    const stored = await repository.findById("repo-1");

    expect(stored).toEqual(application);
  });

  it("returns clones to prevent external mutation", async () => {
    const repository = new InMemoryApplicationRepository();
    const application = createApplication({
      id: "repo-immutable",
      companyName: "Cyberdyne",
      roleTitle: "AI Researcher",
      appliedAt: baseDate,
      status: "cv_sent",
    });

    await repository.save(application);

    const fetched = await repository.findById("repo-immutable");
    if (!fetched) {
      throw new Error("Expected application to be stored");
    }

    // @ts-expect-error - intentionally mutating to ensure repository cloning protects state
    fetched.companyName = "Modified Corp";
    fetched.comments.push({
      id: "fake",
      message: "tamper",
      createdAt: new Date(baseDate),
    });

    const afterTamper = await repository.findById("repo-immutable");
    expect(afterTamper?.companyName).toBe("Cyberdyne");
    expect(afterTamper?.comments).toHaveLength(0);
  });

  it("lists applications in insertion order", async () => {
    const repository = new InMemoryApplicationRepository();

    await repository.save(
      createApplication({
        id: "repo-a",
        companyName: "Acme",
        roleTitle: "Engineer",
        appliedAt: new Date("2024-01-01T00:00:00Z"),
        status: "cv_sent",
      }),
    );
    await repository.save(
      createApplication({
        id: "repo-b",
        companyName: "Globex",
        roleTitle: "Engineer",
        appliedAt: new Date("2024-02-01T00:00:00Z"),
        status: "cv_sent",
      }),
    );

    const list = await repository.list();
    expect(list.map((app) => app.id)).toEqual(["repo-a", "repo-b"]);
  });
});
