import { JobApplication } from "../entities/Application";

export interface ApplicationRepository {
  save(application: JobApplication): Promise<void>;
  update(application: JobApplication): Promise<void>;
  findById(id: string): Promise<JobApplication | null>;
  list(): Promise<JobApplication[]>;
  delete(id: string): Promise<void>;
}
