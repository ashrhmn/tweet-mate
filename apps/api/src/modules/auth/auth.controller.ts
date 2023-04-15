import { BadRequestException, Controller, Get, Inject } from "@nestjs/common";
import { endpoints } from "api-interface";
import { randomBytes } from "crypto";
import * as DiscordOauth2 from "discord-oauth2";
import { CONFIG } from "src/config/app.config";
import { TWITTER_SDK_PROVIDER, TwitterClient } from "src/constants";
import { Context, InferMethod } from "src/decorators";
import { IContext } from "src/interfaces";
import {
  createAsyncController,
  createController,
} from "src/utils/common.utils";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(TWITTER_SDK_PROVIDER) private readonly twitterSdk: TwitterClient,
  ) {}

  @InferMethod(endpoints.auth.login)
  login(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.login,
      context,
      this.authService.login,
    );
  }

  @InferMethod(endpoints.auth.currentUser)
  currentUser(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.currentUser,
      context,
      this.authService.currentUser,
    );
  }

  @InferMethod(endpoints.auth.logout)
  logout(@Context() context: IContext) {
    return createController(
      endpoints.auth.logout,
      context,
      this.authService.logout,
    );
  }

  @InferMethod(endpoints.auth.currentTwitterUser)
  currentTwitterUser(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.currentTwitterUser,
      context,
      this.authService.currentTwitterUser,
    );
  }

  @Get("/auth/twitter")
  loginWithTwitter(@Context() context: IContext) {
    const url = this.twitterSdk.authClient.generateAuthURL({
      state: CONFIG.TWITTER_SDK.STATE,
      code_challenge: "s256",
    });
    return context.res.redirect(url);
  }

  @Get("/auth/twitter-callback")
  async twitterCallBack(@Context() context: IContext): Promise<any> {
    try {
      const { query } = context.req;
      console.log({ query });
      const { token } = await this.twitterSdk.authClient.requestAccessToken(
        query?.code as string,
      );
      if (!token || !token.access_token || !token.expires_at)
        throw new BadRequestException();
      context.res.cookie(
        CONFIG.PUBLIC_SECRET.TWITTER_ACCESS_TOKEN_COOKIE_KEY,
        token.access_token,
        {
          httpOnly: true,
          expires: new Date(token.expires_at),
          secure: CONFIG.ENV.PRODUCTION,
        },
      );
      return context.res.redirect("/");
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }

  @Get("/auth/discord")
  async loginWithDiscord(@Context() context: IContext) {
    // const crypto = require("crypto");
    // const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2({
      clientId: "1096356030771908679",
      clientSecret: "6fHt4LxdkBPhj3GH-T8pnCcHmO33fdmj",
      redirectUri: "http://localhost:4000/api/auth/discord-callback",
    });

    const url = oauth.generateAuthUrl({
      scope: ["identify", "guilds"],
      state: randomBytes(16).toString("hex"), // Be aware that randomBytes is sync if no callback is provided
    });

    console.log(url);
    return context.res.redirect(url);
  }

  @Get("/auth/discord-callback")
  async discordCallBack(@Context() context: IContext): Promise<any> {
    try {
      const { query } = context.req;
      // const DiscordOauth2 = require("discord-oauth2");
      const oauth = new DiscordOauth2();
      const token = await oauth.tokenRequest({
        clientId: "1096356030771908679",
        clientSecret: "6fHt4LxdkBPhj3GH-T8pnCcHmO33fdmj",

        code: query.code as string,
        scope: "identify guilds",
        grantType: "authorization_code",

        redirectUri: "http://localhost:4000/api/auth/discord-callback",
      });

      console.log(token);

      if (!token || !token.access_token || !token.expires_in)
        throw new BadRequestException();
      context.res.cookie(
        CONFIG.PUBLIC_SECRET.DISCORD_ACCESS_TOKEN_COOKIE_KEY,
        token.access_token,
        {
          httpOnly: true,
          expires: new Date(new Date().getTime() + token.expires_in * 1000),
          secure: CONFIG.ENV.PRODUCTION,
        },
      );
      return context.res.redirect("http://localhost:3000");
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  @InferMethod(endpoints.auth.currentDiscordUser)
  currentDiscordUser(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.currentDiscordUser,
      context,
      this.authService.currentDiscordUser,
    );
  }
}
