import {
  ApplicationStatus,
  assertValidApplicationStatus,
} from "../value-objects/ApplicationStatus";
import { ApplicationComment } from "./Comment";
export { createComment } from "./Comment";

export interface JobApplication {
  readonly id: string;
  readonly companyName: string;
  readonly roleTitle: string;
  readonly roleDescription?: string;
  readonly url?: string;
  readonly appliedAt: Date;
  readonly status: ApplicationStatus;
  readonly comments: ApplicationComment[];
  readonly ownerId: string;
}

export function createApplication(params: {
  id: string;
  companyName: string;
  roleTitle: string;
  roleDescription?: string;
  url?: string;
  appliedAt: Date;
  status: ApplicationStatus;
  comments?: ApplicationComment[];
  ownerId: string;
}): JobApplication {
  validateCoreFields(params.companyName, params.roleTitle, params.appliedAt);
  assertValidApplicationStatus(params.status);
  const url = normalizeUrl(params.url);
  const ownerId = params.ownerId.trim();
  if (!ownerId) {
    throw new Error("Owner id cannot be empty");
  }

  return {
    id: params.id,
    companyName: params.companyName.trim(),
    roleTitle: params.roleTitle.trim(),
    roleDescription: params.roleDescription?.trim(),
    url,
    appliedAt: params.appliedAt,
    status: params.status,
    comments: params.comments ?? [],
    ownerId,
  };
}

export function updateStatus(
  application: JobApplication,
  status: ApplicationStatus,
): JobApplication {
  assertValidApplicationStatus(status);

  if (application.status === status) {
    return application;
  }

  return {
    ...application,
    status,
  };
}

export function addApplicationComment(
  application: JobApplication,
  comment: ApplicationComment,
): JobApplication {
  return {
    ...application,
    comments: [...application.comments, comment],
  };
}

function validateCoreFields(
  companyName: string,
  roleTitle: string,
  appliedAt: Date,
) {
  if (!companyName.trim()) {
    throw new Error("Company name cannot be empty");
  }

  if (!roleTitle.trim()) {
    throw new Error("Role title cannot be empty");
  }

  if (!(appliedAt instanceof Date) || Number.isNaN(appliedAt.getTime())) {
    throw new Error("Applied date must be a valid date");
  }
}

function normalizeUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("URL must use http or https protocol");
    }

    return parsed.toString();
  } catch {
    throw new Error("Provided job posting URL is invalid");
  }
}
