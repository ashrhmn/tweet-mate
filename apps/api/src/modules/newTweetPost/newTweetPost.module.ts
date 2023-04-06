import { Module } from "@nestjs/common";
import { NewTweetPostController } from "./newTweetPost.controller";
import { NewTweetPostService } from "./newTweetPost.service";

@Module({
  providers: [NewTweetPostService],
  controllers: [NewTweetPostController],
})
export class NewTweetPostModule {}
