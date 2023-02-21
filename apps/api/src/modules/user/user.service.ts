import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  getUserById = (id: string) =>
    this.prisma.user.findUniqueOrThrow({ where: { id } });
}
