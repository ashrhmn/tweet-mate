import { Injectable, UnauthorizedException } from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExistingTweetPostService {
  constructor(private readonly prisma: PrismaService) {}

  getAllReTweetByProjectId = createAsyncService<
    typeof endpoints.existingTweetPosts.getAllReTweetByProjectId
  >(async ({ param }, { user }) => {
    if (!user) throw new UnauthorizedException();
    const retweetOfProjectId = param.projectId;

    return await this.prisma.existingTweetPost.findMany({
      where: {
        retweetOfProjectId,
      },
      include: {
        retweetOfProject: true,
      },
    });
  });

  createReTweet = createAsyncService<
    typeof endpoints.existingTweetPosts.createReTweet
  >(async ({ body, param }, { user }) => {
    if (!user) throw new UnauthorizedException();

    const projectId = param.projectId;

    await this.prisma.existingTweetPost.create({
      data: { ...body, retweetOfProjectId: projectId },
    });
    return "created";
  });

  createLikeOfTweet = createAsyncService<
    typeof endpoints.existingTweetPosts.createLikeOfTweet
  >(async ({ body, param }, { user }) => {
    if (!user) throw new UnauthorizedException();

    const projectId = param.projectId;

    await this.prisma.existingTweetPost.create({
      data: { ...body, likeOfProjectId: projectId },
    });
    return "created";
  });
}
