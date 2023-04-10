import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { Permissions } from "src/guards/permission.guard";
import { IContext } from "src/interfaces";
import { createAsyncController } from "src/utils/common.utils";
import { ExistingTweetPostService } from "./existingTweetPost.service";

@Controller()
export class ExistingTweetPostController {
  constructor(
    private readonly existingTweetPostService: ExistingTweetPostService,
  ) {}

  // @Permissions("MANAGE_PROJECT")
  // @InferMethod(endpoints.existingTweetPosts.getAllReTweetByProjectId)
  // getAllReTweetByProjectId(@Context() contex: IContext) {
  //   return createAsyncController(
  //     endpoints.existingTweetPosts.getAllReTweetByProjectId,
  //     contex,
  //     this.existingTweetPostService.getAllReTweetByProjectId,
  //   );
  // }

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.existingTweetPosts.createReTweet)
  createReTweet(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.existingTweetPosts.createReTweet,
      contex,
      this.existingTweetPostService.createReTweet,
    );
  }

  @Permissions("MANAGE_PROJECT")
  @InferMethod(endpoints.existingTweetPosts.createLikeOfTweet)
  createLikeOfTweet(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.existingTweetPosts.createLikeOfTweet,
      contex,
      this.existingTweetPostService.createLikeOfTweet,
    );
  }
}
