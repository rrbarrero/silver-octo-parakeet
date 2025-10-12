import { describe, expect, it } from "vitest";

import {
  addApplicationComment,
  createApplication,
  createComment,
  updateStatus,
} from "./Application";

const baseDate = new Date("2024-01-10T00:00:00Z");

describe("JobApplication entity", () => {
  it("creates an application with trimmed values", () => {
    const application = createApplication({
      id: "app-1",
      companyName: "  Acme Corp  ",
      roleTitle: "  Frontend Engineer ",
      roleDescription: "  Build modern UIs ",
      appliedAt: baseDate,
      url: "https://careers.acme.com/frontend",
      status: "cv_sent",
      ownerId: "user-123",
    });

    expect(application).toMatchObject({
      id: "app-1",
      companyName: "Acme Corp",
      roleTitle: "Frontend Engineer",
      roleDescription: "Build modern UIs",
      url: "https://careers.acme.com/frontend",
      appliedAt: baseDate,
      status: "cv_sent",
      comments: [],
      ownerId: "user-123",
    });
  });

  it("throws when core fields are invalid", () => {
    expect(() =>
      createApplication({
        id: "app-invalid",
        companyName: " ",
        roleTitle: "Engineer",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId: "user-123",
    }),
    ).toThrow("Company name cannot be empty");

    expect(() =>
      createApplication({
        id: "app-invalid",
        companyName: "Acme",
        roleTitle: " ",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId: "user-123",
    }),
    ).toThrow("Role title cannot be empty");

    expect(() =>
      createApplication({
        id: "app-invalid",
        companyName: "Acme",
        roleTitle: "Engineer",
      appliedAt: new Date("invalid"),
      status: "cv_sent",
      ownerId: "user-123",
    }),
    ).toThrow("Applied date must be a valid date");

    expect(() =>
      createApplication({
        id: "app-invalid-url",
        companyName: "Acme",
        roleTitle: "Engineer",
        appliedAt: baseDate,
      status: "cv_sent",
      url: "ftp://example.com",
      ownerId: "user-123",
    }),
    ).toThrow("Provided job posting URL is invalid");

    expect(() =>
      createApplication({
        id: "app-invalid-url2",
        companyName: "Acme",
        roleTitle: "Engineer",
        appliedAt: baseDate,
      status: "cv_sent",
      url: "not-a-url",
      ownerId: "user-123",
    }),
    ).toThrow("Provided job posting URL is invalid");

    expect(() =>
      createApplication({
        id: "app-invalid-owner",
        companyName: "Acme",
        roleTitle: "Engineer",
        appliedAt: baseDate,
        status: "cv_sent",
        ownerId: " ",
      }),
    ).toThrow("Owner id cannot be empty");
  });

  it("updates the status only when it changes", () => {
    const application = createApplication({
      id: "app-status",
      companyName: "Acme",
      roleTitle: "Engineer",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId: "user-status",
    });

    const sameStatusResult = updateStatus(application, "cv_sent");
    expect(sameStatusResult).toBe(application);

    const differentStatusResult = updateStatus(application, "technical_interview");
    expect(differentStatusResult).not.toBe(application);
    expect(differentStatusResult.status).toBe("technical_interview");
  });

  it("appends comments immutably", () => {
    const application = createApplication({
      id: "app-comments",
      companyName: "Acme",
      roleTitle: "Engineer",
      appliedAt: baseDate,
      status: "cv_sent",
      ownerId: "user-comments",
    });

    const comment = createComment({
      id: "comment-1",
      message: "Scheduled phone screen",
      createdAt: baseDate,
    });

    const withComment = addApplicationComment(application, comment);

    expect(withComment.comments).toHaveLength(1);
    expect(application.comments).toHaveLength(0);
  });
});
