import { BadRequestException, Controller, Get, Inject } from "@nestjs/common";
import { endpoints } from "api-interface";
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
}
