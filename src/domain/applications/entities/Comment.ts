export interface ApplicationComment {
  readonly id: string;
  readonly message: string;
  readonly createdAt: Date;
}

export function createComment(params: {
  id: string;
  message: string;
  createdAt?: Date;
}): ApplicationComment {
  if (!params.message.trim()) {
    throw new Error("Comment message cannot be empty");
  }

  return {
    id: params.id,
    message: params.message.trim(),
    createdAt: params.createdAt ?? new Date(),
  };
}
