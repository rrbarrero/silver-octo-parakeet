import { JobApplication } from "../entities/Application";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export class ListApplicationsQueryHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(ownerId: string): Promise<JobApplication[]> {
    const applications = await this.repository.listByOwner(ownerId);

    return applications.sort(
      (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime(),
    );
  }
}
