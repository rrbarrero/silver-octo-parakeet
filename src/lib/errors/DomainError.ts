export type DomainErrorMetadata = Record<string, unknown>;

export class DomainError extends Error {
  readonly status: number;
  readonly code: string;
  readonly metadata?: DomainErrorMetadata;

  constructor({
    message,
    status = 400,
    code = "domain_error",
    metadata,
  }: {
    message: string;
    status?: number;
    code?: string;
    metadata?: DomainErrorMetadata;
  }) {
    super(message);
    this.name = "DomainError";
    this.status = status;
    this.code = code;
    this.metadata = metadata;
  }
}

export class AuthenticationError extends DomainError {
  constructor(metadata?: DomainErrorMetadata) {
    super({
      message: "User is not authenticated",
      status: 401,
      code: "auth.not_authenticated",
      metadata,
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends DomainError {
  constructor(metadata?: DomainErrorMetadata) {
    super({
      message: "User is not authorized to perform this action",
      status: 403,
      code: "auth.not_authorized",
      metadata,
    });
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends DomainError {
  constructor({
    message = "Validation failed",
    metadata,
  }: {
    message?: string;
    metadata?: DomainErrorMetadata;
  }) {
    super({
      message,
      status: 400,
      code: "validation.failed",
      metadata,
    });
    this.name = "ValidationError";
  }
}
