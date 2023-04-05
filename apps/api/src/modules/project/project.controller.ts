import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { Permissions } from "src/guards/permission.guard";
import { IContext } from "src/interfaces";
import { createAsyncController } from "src/utils/common.utils";
import { ProjectService } from "./project.service";

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.projects.getAll)
  getAll(@Context() context: IContext) {
    return createAsyncController(
      endpoints.projects.getAll,
      context,
      this.projectService.getAll,
    );
  }

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.projects.getProject)
  getProject(@Context() context: IContext) {
    return createAsyncController(
      endpoints.projects.getProject,
      context,
      this.projectService.getProject,
    );
  }

  @Permissions("CREATE_PROJECT")
  @InferMethod(endpoints.projects.create)
  create(@Context() context: IContext) {
    return createAsyncController(
      endpoints.projects.create,
      context,
      this.projectService.create,
    );
  }

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.projects.delete)
  delete(@Context() context: IContext) {
    return createAsyncController(
      endpoints.projects.delete,
      context,
      this.projectService.delete,
    );
  }
}
