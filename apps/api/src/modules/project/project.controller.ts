import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { IContext } from "src/interfaces";
import { createAsyncController } from "src/utils/common.utils";
import { ProjectService } from "./project.service";

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @InferMethod(endpoints.projects.getAll)
  getAll(@Context() context: IContext) {
    return createAsyncController(
      endpoints.projects.getAll,
      context,
      this.projectService.getAll,
    );
  }
}
