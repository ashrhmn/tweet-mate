import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NewTweetPostService {
  constructor(private readonly prisma: PrismaService) {}

  getAllByProjectId = createAsyncService<
    typeof endpoints.newTweetPosts.getAllByProjectId
  >(async ({ param }, { user }) => {
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
  });

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

  delete = createAsyncService<typeof endpoints.newTweetPosts.delete>(
    async ({ param: { id } }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const newTweetPost = await this.prisma.newTweetPost.findFirst({
        where: {
          id,
          project: {
            authorId: user.id,
          },
        },
      });
      if (!newTweetPost) throw new NotFoundException();
      await this.prisma.newTweetPost.delete({ where: { id } });
      return "deleted";
    },
  );
}
