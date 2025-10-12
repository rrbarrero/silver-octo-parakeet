import { describe, expect, it } from "vitest";

import {
  APPLICATION_STATUSES,
  assertValidApplicationStatus,
} from "./ApplicationStatus";

describe("ApplicationStatus value object", () => {
  it("contains expected statuses", () => {
    expect(APPLICATION_STATUSES).toContain("cv_sent");
    expect(APPLICATION_STATUSES).toContain("offer_received");
  });

  it("asserts valid statuses", () => {
    expect(() => assertValidApplicationStatus("cv_sent")).not.toThrow();
    expect(() => assertValidApplicationStatus("unknown")).toThrow(
      "Unknown application status: unknown",
    );
  });
});
