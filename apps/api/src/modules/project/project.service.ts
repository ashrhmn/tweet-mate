import { Injectable } from "@nestjs/common";
import { endpoints } from "api-interface";
import { createAsyncService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = createAsyncService<typeof endpoints.projects.getAll>(async () => {
    return this.prisma.project.findMany();
  });
}
