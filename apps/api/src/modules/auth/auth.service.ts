import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { endpoints } from "api-interface";
import { verify } from "argon2";
import * as DiscordOauth2 from "discord-oauth2";
import { CONFIG } from "src/config/app.config";
import { TWITTER_SDK_PROVIDER, TwitterClient } from "src/constants";
import { generateTokens } from "src/utils/auth.utils";
import { createAsyncService, createService } from "src/utils/common.utils";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(TWITTER_SDK_PROVIDER) private readonly twitterSdk: TwitterClient,
  ) {}

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

      const { access_token, refresh_token } = generateTokens(user);
      res.cookie("authorization", access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + CONFIG.JWT.TIMEOUT.ACCESS * 1000),
        secure: CONFIG.NODE_ENV === "production",
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: CONFIG.NODE_ENV === "production",
      });
      return "success";
    },
  );

  currentUser = createAsyncService<typeof endpoints.auth.currentUser>(
    async (_, { user }) => {
      if (!!user) return user;
      throw new UnauthorizedException();
    },
  );

  logout = createService<typeof endpoints.auth.logout>((_, { res }) => {
    res.clearCookie("authorization");
    res.clearCookie("refresh_token");
    return res.redirect("/login");
  });

  currentTwitterUser = createAsyncService<
    typeof endpoints.auth.currentTwitterUser
  >(async (_, { twitterClientSdk }) => {
    if (!twitterClientSdk) throw new UnauthorizedException();
    const currentUser = await twitterClientSdk.users
      .findMyUser()
      .catch((error) => {
        console.error("Error in finding current twitter user", error);
        return null;
      });
    if (!currentUser || !currentUser.data) {
      console.error(
        "Error in finding current twitter user",
        currentUser?.errors,
      );
      throw new UnauthorizedException();
    }
    return currentUser.data;
  });

  insertDiscordUser = async (discordUser: any) => {
    if (!discordUser) throw new BadRequestException("Discord User Not Found");
    const existingUser = await this.prisma.memberUser.findFirst({
      where: {
        discordUsername: discordUser.username,
      },
    });
    if (existingUser) return false;

    await this.prisma.memberUser.create({
      data: {
        discordUsername: discordUser.username,
        discordDiscriminator: Number(discordUser.discriminator),
      },
    });
    return true;
  };

  currentDiscordUser = createAsyncService<
    typeof endpoints.auth.currentDiscordUser
  >(async (_, { discordUser }) => {
    if (!discordUser) throw new UnauthorizedException();
    return discordUser;
  });

  revokeDiscordUser = createAsyncService<
    typeof endpoints.auth.revokeDiscordUser
  >(async (_, { discordUser, req }) => {
    if (!discordUser) throw new UnauthorizedException();

    const clientID = "1096356030771908679";
    const client_secret = "6fHt4LxdkBPhj3GH-T8pnCcHmO33fdmj";
    const discordAccesToken =
      req.cookies[CONFIG.PUBLIC_SECRET.DISCORD_ACCESS_TOKEN_COOKIE_KEY];

    // You must encode your client ID along with your client secret including the colon in between
    const credentials = Buffer.from(`${clientID}:${client_secret}`).toString(
      "base64",
    ); // MzMyMjY5OTk5OTEyMTMyMDk3OjkzN2l0M293ODdpNGVyeTY5ODc2d3FpcmU=

    new DiscordOauth2()
      .revokeToken(discordAccesToken, credentials)
      .then(console.log);
    return "revokedDiscordToken";
  });
}
