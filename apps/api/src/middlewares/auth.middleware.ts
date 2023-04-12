import { Injectable, NestMiddleware } from "@nestjs/common";
import { User } from "@prisma/client";
import { Response } from "express";
import { verify } from "jsonwebtoken";
import { CONFIG } from "src/config/app.config";
import { IContextRequest } from "src/interfaces";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { generateTokens, getUser } from "src/utils/auth.utils";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}
  async use(req: IContextRequest, res: Response, next: (error?: any) => void) {
    const user = getUser(req);
    if (!!user) {
      req.user = user;
      return next();
    }

    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token || typeof refresh_token !== "string") return next();
    try {
      const payload = verify(refresh_token, CONFIG.JWT.SECRET.REFRESH) as Omit<
        User,
        "password" | "roles"
      > & { iat: number; exp: number };
      const user = await this.prismaService.user.findUnique({
        where: { username: payload.username },
      });
      if (!user) return next();
      const { access_token, refresh_token: new_refresh_token } =
        generateTokens(user);
      res.cookie("authorization", access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + CONFIG.JWT.TIMEOUT.ACCESS * 1000),
        secure: CONFIG.ENV.PRODUCTION,
      });
      res.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        secure: CONFIG.ENV.PRODUCTION,
      });
      req.user = { ...payload, permissions: user.permissions, iat: 0, exp: 0 };
      return next();
    } catch (err) {
      console.error("auth.middleware error : ", err);
      return next();
    }
  }
}
