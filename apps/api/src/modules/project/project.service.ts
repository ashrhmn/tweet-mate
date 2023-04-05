import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = createAsyncService<typeof endpoints.projects.getAll>(
    async ({}, { user }) => {
      if (!user) throw new UnauthorizedException();
      const userId = user.id;

      return this.prisma.project.findMany({
        where: {
          author: {
            id: userId,
          },
        },
        include: {
          author: { select: { id: true, permissions: true, username: true } },
        },
      });
    },
  );

  getProject = createAsyncService<typeof endpoints.projects.getProject>(
    async ({ param }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const userId = user.id;
      const id = param.id;
      const project = await this.prisma.project.findFirst({
        where: {
          id,
          authorId: userId,
        },
        include: {
          author: { select: { id: true, permissions: true, username: true } },
          newTweetPosts: true,
          retweetPosts: true,
          likeTweets: true,
        },
      });
      if (!project) throw new BadRequestException("User not Found");
      return project;
    },
  );

  create = createAsyncService<typeof endpoints.projects.create>(
    async ({ body }, { user }) => {
      if (!user) throw new UnauthorizedException();

      body.url = body.url.replace(/\s+/g, "");
      const existingProject = await this.prisma.project.findFirst({
        where: {
          url: body.url,
        },
      });
      if (!!existingProject)
        throw new BadRequestException("Url already in list");

      await this.prisma.project.create({
        data: { ...body, authorId: user.id },
      });
      return "created";
    },
  );

  delete = createAsyncService<typeof endpoints.projects.delete>(
    async ({ param: { id } }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const project = await this.prisma.project.findFirst({
        where: { id, authorId: user.id },
      });
      if (!project) throw new NotFoundException();
      await this.prisma.project.delete({ where: { id } });
      return "deleted";
    },
  );
}
