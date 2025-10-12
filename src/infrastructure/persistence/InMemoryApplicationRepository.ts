import { ApplicationRepository } from "@/domain/applications";
import { JobApplication } from "@/domain/applications";

export class InMemoryApplicationRepository implements ApplicationRepository {
  private readonly store = new Map<string, JobApplication>();

  async save(application: JobApplication): Promise<void> {
    if (this.store.has(application.id)) {
      throw new Error(`Application ${application.id} already exists`);
    }

    this.store.set(application.id, clone(application));
  }

  async update(application: JobApplication): Promise<void> {
    if (!this.store.has(application.id)) {
      throw new Error(`Application ${application.id} does not exist`);
    }

    this.store.set(application.id, clone(application));
  }

  async findById(id: string): Promise<JobApplication | null> {
    const application = this.store.get(id);
    return application ? clone(application) : null;
  }

  async list(): Promise<JobApplication[]> {
    return Array.from(this.store.values(), clone);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

function clone(application: JobApplication): JobApplication {
  return {
    ...application,
    appliedAt: new Date(application.appliedAt),
    comments: application.comments.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
    })),
  };
}
