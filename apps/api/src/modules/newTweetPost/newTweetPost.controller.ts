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
  @InferMethod(endpoints.newTweetPosts.getAllByProjectId)
  getAllByProjectId(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.newTweetPosts.getAllByProjectId,
      contex,
      this.newTweetPostService.getAllByProjectId,
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

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.newTweetPosts.delete)
  delete(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.newTweetPosts.delete,
      contex,
      this.newTweetPostService.delete,
    );
  }

  @InferMethod(endpoints.newTweetPosts.createTweetPostByMember)
  createTweetPostByMember(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.newTweetPosts.createTweetPostByMember,
      contex,
      this.newTweetPostService.createTweetPostByMember,
    );
  }
}
