import { JobApplication } from "../entities/Application";
import { ApplicationRepository } from "../repositories/ApplicationRepository";

export class GetApplicationByIdQueryHandler {
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(id: string): Promise<JobApplication | null> {
    return this.repository.findById(id);
  }
}
