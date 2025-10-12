import { JobApplication } from "@/domain/applications";

export function serializeApplication(application: JobApplication) {
  return {
    id: application.id,
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    roleDescription: application.roleDescription ?? null,
    appliedAt: application.appliedAt.toISOString(),
    status: application.status,
    comments: application.comments.map((comment) => ({
      id: comment.id,
      message: comment.message,
      createdAt: comment.createdAt.toISOString(),
    })),
  };
}
