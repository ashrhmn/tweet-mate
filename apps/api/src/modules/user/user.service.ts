import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PERMISSIONS } from "@prisma/client";
import { endpoints } from "api-interface";
import { hash } from "argon2";
import { createAsyncService, createService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = createAsyncService<typeof endpoints.users.getAll>(
    async ({}, { user }) => {
      console.log(user);
      // if (!user) throw new UnauthorizedException();
      return this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          permissions: true,
        },
      });
    },
  );

  getUser = createAsyncService<typeof endpoints.users.getUser>(
    async ({ param }) => {
      const id = param.id;
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
          permissions: true,
        },
      });
      if (!user) {
        throw new BadRequestException("User not Found");
      } else {
        return user;
      }
    },
  );

  create = createAsyncService<typeof endpoints.users.create>(
    async ({ body }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const {
        username,
        permissions,
        password: plainPassword,
        confirmPassword,
      } = body;

      if (plainPassword !== confirmPassword) {
        throw new BadRequestException("Both passwords must match");
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!!existingUser) {
        throw new BadRequestException("Username already in use");
      }

      const password = await hash(plainPassword);

      const newUser = await this.prisma.user.create({
        data: {
          username,
          password,
          permissions: Array.from(
            new Set(permissions.map((p) => p.permission)),
          ),
        },
      });

      return "created";
    },
  );

  update = createAsyncService<typeof endpoints.users.update>(
    async ({ body, param }, { user }) => {
      if (!user) throw new UnauthorizedException();
      const {
        username,
        permissions,
        password: plainPassword,
        confirmPassword,
      } = body;

      const id = param.id;

      if (plainPassword !== confirmPassword) {
        throw new BadRequestException("Both passwords must match");
      }

      const existingUser = await this.prisma.user.findFirst({
        where: {
          username,
          NOT: {
            id,
          },
        },
      });

      if (existingUser) {
        throw new BadRequestException("Username should be unique");
      }

      const password = plainPassword ? await hash(plainPassword) : null;

      const updatedUser = password
        ? await this.prisma.user.update({
            where: { id },
            data: {
              username,
              password,
              permissions: Array.from(
                new Set(permissions.map((p) => p.permission)),
              ),
            },
          })
        : await this.prisma.user.update({
            where: { id },
            data: {
              username,
              permissions: Array.from(
                new Set(permissions.map((p) => p.permission)),
              ),
            },
          });

      return "updated";
    },
  );

  delete = createAsyncService<typeof endpoints.users.delete>(
    async ({ param }, { user }) => {
      if (!user) throw new UnauthorizedException();

      const id = param.id;

      const deleteUser = await this.prisma.user.delete({
        where: { id },
      });

      return "deleted";
    },
  );

  getAllPermissions = createService<typeof endpoints.users.getAllPermissions>(
    () => {
      return Object.values(PERMISSIONS).map((permission, index) => ({
        id: index,
        permission,
      }));
    },
  );
}
