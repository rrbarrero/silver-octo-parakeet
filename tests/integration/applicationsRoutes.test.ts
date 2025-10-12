import { beforeEach, describe, expect, it } from "vitest";

import { applicationModule } from "@/infrastructure/container";
import {
  GET as listApplications,
  POST as createApplication,
} from "@/app/api/applications/route";
import { PATCH as updateApplication } from "@/app/api/applications/[id]/route";
import { POST as addComment } from "@/app/api/applications/[id]/comments/route";

const baseUrl = "http://localhost/api/applications";

describe("Applications API routes", () => {
  beforeEach(() => {
    applicationModule.repository.clear();
  });

  it("creates an application and returns the created record", async () => {
    const response = await createApplication(
      new Request(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Acme Corp",
          roleTitle: "Frontend Engineer",
          roleDescription: "Build modern UIs",
          appliedAt: "2024-04-10",
          url: "https://acme.com/jobs/frontend",
          status: "cv_sent",
        }),
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();

    expect(payload).toMatchObject({
      companyName: "Acme Corp",
      roleTitle: "Frontend Engineer",
      url: "https://acme.com/jobs/frontend",
      status: "cv_sent",
    });

    const list = await listApplications();
    const items = await list.json();

    expect(items).toHaveLength(1);
    expect(items[0].companyName).toBe("Acme Corp");
  });

  it("updates application status through PATCH endpoint", async () => {
    const createResponse = await createApplication(
      new Request(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Globex",
          roleTitle: "Backend Engineer",
          appliedAt: "2024-04-01",
          url: "https://globex.com/jobs/backend",
          status: "cv_sent",
        }),
      }),
    );

    const created = await createResponse.json();

    const updateResponse = await updateApplication(
      new Request(`${baseUrl}/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "technical_interview" }),
      }),
      { params: { id: created.id } },
    );

    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.status).toBe("technical_interview");
  });

  it("adds comments via comments endpoint", async () => {
    const createResponse = await createApplication(
      new Request(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Initech",
          roleTitle: "QA Analyst",
          appliedAt: "2024-05-01",
          url: "https://initech.com/careers/qa",
          status: "cv_sent",
        }),
      }),
    );

    const created = await createResponse.json();

    const commentResponse = await addComment(
      new Request(`${baseUrl}/${created.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: "Phone screen complete" }),
      }),
      { params: { id: created.id } },
    );

    expect(commentResponse.status).toBe(200);
    const payload = await commentResponse.json();

    expect(payload.comments).toHaveLength(1);
    expect(payload.comments[0].message).toBe("Phone screen complete");
  });
});
