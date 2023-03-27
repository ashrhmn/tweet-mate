import { Injectable, UnauthorizedException } from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = createAsyncService<typeof endpoints.projects.getAll>(async () => {
    return this.prisma.project.findMany({
      include: {
        author: { select: { id: true, permissions: true, username: true } },
      },
    });
  });

  create = createAsyncService<typeof endpoints.projects.create>(
    async ({ body }, { user }) => {
      if (!user) throw new UnauthorizedException();
      await this.prisma.project.create({
        data: { ...body, authorId: user.id },
      });
      return "created";
    },
  );
}
