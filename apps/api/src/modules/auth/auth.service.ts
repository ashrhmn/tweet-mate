import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { CONFIG } from "src/config/app.config";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import { createAsyncService, createService } from "src/utils/common.utils";
import { endpoints } from "api-interface";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async generateTokens(user: User) {
    const { password: _, ...payload } = user;

    const access_token = sign(payload, CONFIG.JWT.SECRET.ACCESS, {
      expiresIn: CONFIG.JWT.TIMEOUT.ACCESS,
    });

    const { roles: __, ...refreshTokenPayload } = payload;

    const refresh_token = sign(refreshTokenPayload, CONFIG.JWT.SECRET.REFRESH, {
      expiresIn: CONFIG.JWT.TIMEOUT.REFRESH,
    });
    return { access_token, refresh_token };
  }

  login = createAsyncService<typeof endpoints.auth.login>(
    async ({ body }, { res }) => {
      const { username, password } = body;
      const user = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) throw new BadRequestException("Invalid Username or Password");

      const isCorrectPassword = await verify(user.password, password).catch(
        () => false,
      );

      if (!isCorrectPassword)
        throw new BadRequestException("Invalid Username or Password");

      const { access_token, refresh_token } = await this.generateTokens(user);
      res.cookie("authorization", access_token);
      res.cookie("refresh_token", refresh_token);
      return "success";
    },
  );

  signup = createAsyncService<typeof endpoints.auth.signup>(
    async ({ body }, { res }) => {
      const { username, password: plainPassword, confirmPassword } = body;
      if (plainPassword !== confirmPassword)
        throw new BadRequestException("Both passwords must match");

      const password = await hash(plainPassword);

      const user = await this.prisma.user.create({
        data: { username, password, roles: ["USER"] },
      });
      const { access_token, refresh_token } = await this.generateTokens(user);
      res.cookie("authorization", access_token);
      res.cookie("refresh_token", refresh_token);

      return "success";
    },
  );

  currentUser = createService<typeof endpoints.auth.currentUser>(
    (_, { user }) => {
      if (!user) throw new UnauthorizedException();
      return user;
    },
  );

  logout = createService<typeof endpoints.auth.logout>((_, { res }) => {
    res.clearCookie("authorization");
    res.clearCookie("refresh_token");
    return res.redirect("/login");
  });
}
