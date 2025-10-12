export const APPLICATION_STATUSES = [
  "cv_sent",
  "phone_screen_scheduled",
  "technical_interview",
  "offer_received",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export function assertValidApplicationStatus(
  status: string,
): asserts status is ApplicationStatus {
  if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
    throw new Error(`Unknown application status: ${status}`);
  }
}
