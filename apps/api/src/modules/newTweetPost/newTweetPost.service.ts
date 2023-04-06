import { Injectable, UnauthorizedException } from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NewTweetPostService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = createAsyncService<typeof endpoints.newTweetPosts.getAll>(
    async ({ param }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const projectId = param.projectId;

      return await this.prisma.newTweetPost.findMany({
        where: {
          projectId,
        },
        include: {
          project: true,
        },
      });
    },
  );

  create = createAsyncService<typeof endpoints.newTweetPosts.create>(
    async ({ body, param }, { user }) => {
      if (!user) throw new UnauthorizedException();

      const projectId = param.projectId;

      await this.prisma.newTweetPost.create({
        data: { ...body, projectId },
      });
      return "created";
    },
  );
}
