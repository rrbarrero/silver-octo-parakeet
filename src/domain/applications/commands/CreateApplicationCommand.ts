import {
  JobApplication,
  createApplication,
  createComment,
} from "../entities/Application";
import { ApplicationStatus } from "../value-objects/ApplicationStatus";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export interface CreateApplicationCommand {
  readonly id: string;
  readonly companyName: string;
  readonly roleTitle: string;
  readonly roleDescription?: string;
  readonly appliedAt: Date;
  readonly status: ApplicationStatus;
  readonly initialComment?: {
    id: string;
    message: string;
    createdAt?: Date;
  };
}

export class CreateApplicationCommandHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(command: CreateApplicationCommand): Promise<JobApplication> {
    const comments = command.initialComment
      ? [
          createComment({
            id: command.initialComment.id,
            message: command.initialComment.message,
            createdAt: command.initialComment.createdAt,
          }),
        ]
      : [];

    const application = createApplication({
      id: command.id,
      companyName: command.companyName,
      roleTitle: command.roleTitle,
      roleDescription: command.roleDescription,
      appliedAt: command.appliedAt,
      status: command.status,
      comments,
    });

    await this.repository.save(application);
    return application;
  }
}
