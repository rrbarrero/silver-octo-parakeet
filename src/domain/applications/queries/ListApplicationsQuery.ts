import { JobApplication } from "../entities/Application";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export class ListApplicationsQueryHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(): Promise<JobApplication[]> {
    const applications = await this.repository.list();

    return applications.sort(
      (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime(),
    );
  }
}
