import {
  AddCommentCommandHandler,
  CreateApplicationCommandHandler,
  GetApplicationByIdQueryHandler,
  ListApplicationsQueryHandler,
  UpdateApplicationStatusCommandHandler,
} from "@/domain/applications";
import { ApplicationRepository } from "@/domain/applications";
import { InMemoryApplicationRepository } from "./persistence/InMemoryApplicationRepository";
import { PrismaApplicationRepository } from "./persistence/PrismaApplicationRepository";
import { prisma } from "./prismaClient";

const shouldUseInMemory =
  process.env.NODE_ENV === "test" || !process.env.DATABASE_URL;

const repository: ApplicationRepository = shouldUseInMemory
  ? new InMemoryApplicationRepository()
  : new PrismaApplicationRepository(prisma);

const createApplicationHandler = new CreateApplicationCommandHandler(
  repository,
);
const updateStatusHandler = new UpdateApplicationStatusCommandHandler(
  repository,
);
const addCommentHandler = new AddCommentCommandHandler(repository);
const listApplicationsQuery = new ListApplicationsQueryHandler(repository);
const getApplicationQuery = new GetApplicationByIdQueryHandler(repository);

export const applicationModule = {
  repository,
  commands: {
    createApplication: createApplicationHandler,
    updateStatus: updateStatusHandler,
    addComment: addCommentHandler,
  },
  queries: {
    listApplications: listApplicationsQuery,
    getApplicationById: getApplicationQuery,
  },
};
