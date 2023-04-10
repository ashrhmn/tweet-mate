import { Module } from "@nestjs/common";
import { ExistingTweetPostController } from "./existingTweetPost.controller";
import { ExistingTweetPostService } from "./existingTweetPost.service";

@Module({
  providers: [ExistingTweetPostService],
  controllers: [ExistingTweetPostController],
})
export class ExistingTweetPostModule {}
