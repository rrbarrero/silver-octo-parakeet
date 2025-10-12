import {
  AddCommentCommandHandler,
  CreateApplicationCommandHandler,
  GetApplicationByIdQueryHandler,
  ListApplicationsQueryHandler,
  UpdateApplicationStatusCommandHandler,
} from "@/domain/applications";
import { InMemoryApplicationRepository } from "./persistence/InMemoryApplicationRepository";

const repository = new InMemoryApplicationRepository();

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
