import { JobApplication } from "../entities/Application";

export interface ApplicationRepository {
  save(application: JobApplication): Promise<void>;
  update(application: JobApplication): Promise<void>;
  findById(id: string, ownerId: string): Promise<JobApplication | null>;
  listByOwner(ownerId: string): Promise<JobApplication[]>;
  delete(id: string, ownerId: string): Promise<void>;
  clear(): Promise<void>;
}
