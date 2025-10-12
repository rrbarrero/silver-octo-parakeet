import { DomainError } from "./DomainError";

const isDev = process.env.NODE_ENV === "development";

export function formatErrorResponse(error: unknown) {
  if (error instanceof DomainError) {
    const payload: Record<string, unknown> = {
      error: error.message,
      code: error.code,
    };

    if (isDev && error.metadata) {
      payload.metadata = error.metadata;
    }

    if (isDev && error.stack) {
      payload.stack = error.stack.split("\n").slice(0, 5);
    }

    return {
      status: error.status,
      body: payload,
    };
  }

  // No console noise in dev/prod; return structured payload only

  return {
    status: 500,
    body: {
      error: "Unexpected server error",
      ...(isDev
        ? {
            detail:
              error instanceof Error
                ? { message: error.message, stack: error.stack }
                : { value: error },
          }
        : {}),
    },
  };
}
