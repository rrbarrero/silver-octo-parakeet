import { Prisma, PrismaClient } from "@prisma/client";

import { ApplicationRepository } from "@/domain/applications/repositories/ApplicationRepository";
import { JobApplication } from "@/domain/applications";
import { assertValidApplicationStatus, ApplicationStatus } from "@/domain/applications";

function toPersistence(application: JobApplication) {
  return {
    id: application.id,
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    roleDescription: application.roleDescription,
    url: application.url,
    appliedAt: application.appliedAt,
    status: application.status,
    ownerId: application.ownerId,
  };
}

function toDomain(payload: {
  id: string;
  companyName: string;
  roleTitle: string;
  roleDescription: string | null;
  url: string | null;
  appliedAt: Date;
  status: string;
  comments: { id: string; message: string; createdAt: Date }[];
  ownerId: string;
}): JobApplication {
  // validate and coerce status to a known ApplicationStatus
  assertValidApplicationStatus(payload.status);

  return {
    id: payload.id,
    companyName: payload.companyName,
    roleTitle: payload.roleTitle,
    roleDescription: payload.roleDescription ?? undefined,
    url: payload.url ?? undefined,
    appliedAt: payload.appliedAt,
    status: payload.status as ApplicationStatus,
    comments: payload.comments
      .slice()
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((comment) => ({
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
      })),
    ownerId: payload.ownerId,
  };
}

export class PrismaApplicationRepository implements ApplicationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(application: JobApplication): Promise<void> {
    try {
      await this.prisma.jobApplication.create({
        data: {
          ...toPersistence(application),
          comments: {
            create: application.comments.map((comment) => ({
              id: comment.id,
              message: comment.message,
              createdAt: comment.createdAt,
            })),
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(`Application ${application.id} already exists`);
      }

      throw error;
    }
  }

  async update(application: JobApplication): Promise<void> {
    try {
      const existing = await this.prisma.jobApplication.findUnique({
        where: { id: application.id },
        select: { ownerId: true },
      });

      if (!existing) {
        throw new Error(`Application ${application.id} does not exist`);
      }

      if (existing.ownerId !== application.ownerId) {
        throw new Error(`Application ${application.id} does not exist`);
      }

      await this.prisma.jobApplication.update({
        where: { id: application.id },
        data: {
          ...toPersistence(application),
          comments: {
            deleteMany: {},
            create: application.comments.map((comment) => ({
              id: comment.id,
              message: comment.message,
              createdAt: comment.createdAt,
            })),
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error(`Application ${application.id} does not exist`);
      }

      throw error;
    }
  }

  async findById(id: string, ownerId: string): Promise<JobApplication | null> {
    const application = await this.prisma.jobApplication.findFirst({
      where: { id, ownerId },
      include: { comments: { orderBy: { createdAt: "asc" } } },
    });

    if (!application) {
      return null;
    }

    return toDomain(application);
  }

  async listByOwner(ownerId: string): Promise<JobApplication[]> {
    const applications = await this.prisma.jobApplication.findMany({
      where: { ownerId },
      include: { comments: { orderBy: { createdAt: "asc" } } },
      orderBy: { appliedAt: "desc" },
    });

    return applications.map(toDomain);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    await this.prisma.jobApplication.deleteMany({ where: { id, ownerId } });
  }

  async clear(): Promise<void> {
    await this.prisma.applicationComment.deleteMany();
    await this.prisma.jobApplication.deleteMany();
  }
}
