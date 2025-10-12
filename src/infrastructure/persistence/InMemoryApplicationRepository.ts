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

  async findById(id: string, ownerId: string): Promise<JobApplication | null> {
    const application = this.store.get(id);
    if (!application || application.ownerId !== ownerId) {
      return null;
    }

    return clone(application);
  }

  async listByOwner(ownerId: string): Promise<JobApplication[]> {
    return Array.from(this.store.values())
      .filter((application) => application.ownerId === ownerId)
      .map(clone);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const existing = this.store.get(id);
    if (!existing || existing.ownerId !== ownerId) {
      return;
    }

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
