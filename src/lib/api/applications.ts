import {
  ApplicationDTO,
  addApplicationCommentSchema,
  applicationSchema,
  createApplicationInputSchema,
  updateApplicationStatusSchema,
} from "@/lib/validation/applicationSchemas";

async function parseResponse<T>(
  response: Response,
  parser: (input: unknown) => T,
): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : "Unexpected server error";
    throw new Error(message);
  }

  return parser(payload);
}

export async function fetchApplications(): Promise<ApplicationDTO[]> {
  const response = await fetch("/api/applications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse(response, (data) =>
    applicationSchema.array().parse(data),
  );
}

export async function createApplication(data: unknown): Promise<ApplicationDTO> {
  const payload = createApplicationInputSchema.parse(data);

  const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseResponse(response, (body) => applicationSchema.parse(body));
}

export async function updateApplicationStatus(
  id: string,
  data: unknown,
): Promise<ApplicationDTO> {
  const payload = updateApplicationStatusSchema.parse(data);

  const response = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseResponse(response, (body) => applicationSchema.parse(body));
}

export async function addApplicationComment(
  id: string,
  data: unknown,
): Promise<ApplicationDTO> {
  const payload = addApplicationCommentSchema.parse(data);

  const response = await fetch(`/api/applications/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseResponse(response, (body) => applicationSchema.parse(body));
}
