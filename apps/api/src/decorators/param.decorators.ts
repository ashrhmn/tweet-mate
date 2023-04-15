import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { IEndpoint } from "api-interface";
import { Request } from "express";
import { CONFIG } from "src/config/app.config";
import { IContextRequest } from "src/interfaces";
import { Client } from "twitter-api-sdk";

export const Input = createParamDecorator<IEndpoint<any, any, any, any>>(
  ({ bodySchema, paramSchema, querySchema }, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    if (!req)
      throw new HttpException(
        "Not implemented",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    try {
      const param = paramSchema.parse(req.params);
      const body = bodySchema.parse(req.body);
      const query = querySchema.parse(req.query);
      return { param, body, query };
    } catch (error) {
      throw new BadRequestException(error);
    }
  },
);

export const Context = createParamDecorator((_, context: ExecutionContext) => {
  const req: IContextRequest = context.switchToHttp().getRequest();
  const res: Response = context.switchToHttp().getResponse();
  const user = req.user;
  const twitterAccesToken =
    req.cookies[CONFIG.PUBLIC_SECRET.TWITTER_ACCESS_TOKEN_COOKIE_KEY];
  const twitterClientSdk = !!twitterAccesToken
    ? new Client(twitterAccesToken)
    : null;
  const discordAccesToken =
    req.cookies[CONFIG.PUBLIC_SECRET.DISCORD_ACCESS_TOKEN_COOKIE_KEY];
  // const discordAccesToken = "fH5vi44cjmZCckDGMSULKGpbP7GEvt";
  const DiscordOauth2 = require("discord-oauth2");
  const discordClient = !!discordAccesToken
    ? new DiscordOauth2().getUser(discordAccesToken)
    : null;
  return { req, res, user, twitterClientSdk, discordClient };
});
