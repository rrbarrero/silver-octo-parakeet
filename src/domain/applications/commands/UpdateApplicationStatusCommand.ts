import { updateStatus } from "../entities/Application";
import { ApplicationStatus } from "../value-objects/ApplicationStatus";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export interface UpdateApplicationStatusCommand {
  readonly id: string;
  readonly status: ApplicationStatus;
}

export class UpdateApplicationStatusCommandHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(command: UpdateApplicationStatusCommand): Promise<void> {
    const existing = await this.repository.findById(command.id);

    if (!existing) {
      throw new Error(`Application ${command.id} not found`);
    }

    const updated = updateStatus(existing, command.status);
    await this.repository.update(updated);
  }
}
