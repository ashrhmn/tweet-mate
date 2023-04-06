import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { Permissions } from "src/guards/permission.guard";
import { IContext } from "src/interfaces";
import { createAsyncController } from "src/utils/common.utils";
import { NewTweetPostService } from "./newTweetPost.service";

@Controller()
export class NewTweetPostController {
  constructor(private readonly newTweetPostService: NewTweetPostService) {}

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.newTweetPosts.getAll)
  getAll(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.newTweetPosts.getAll,
      contex,
      this.newTweetPostService.getAll,
    );
  }

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.newTweetPosts.create)
  create(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.newTweetPosts.create,
      contex,
      this.newTweetPostService.create,
    );
  }
}
