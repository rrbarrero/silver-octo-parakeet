import { addApplicationComment, createComment } from "../entities/Application";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export interface AddCommentCommand {
  readonly id: string;
  readonly comment: {
    id: string;
    message: string;
    createdAt?: Date;
  };
  readonly ownerId: string;
}

export class AddCommentCommandHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(command: AddCommentCommand): Promise<void> {
    const existing = await this.repository.findById(
      command.id,
      command.ownerId,
    );

    if (!existing) {
      throw new Error(`Application ${command.id} not found`);
    }

    const comment = createComment({
      id: command.comment.id,
      message: command.comment.message,
      createdAt: command.comment.createdAt,
    });

    const updated = addApplicationComment(existing, comment);
    await this.repository.update(updated);
  }
}
