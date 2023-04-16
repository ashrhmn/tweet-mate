import { User } from "@prisma/client";
import { Request, Response } from "express";
import { Client } from "twitter-api-sdk";

export type AuthUser = Omit<User, "password"> & { iat: number; exp: number };
export type IContextRequest = Request & {
  user?: AuthUser;
  tokens?: { authorization: string; refresh_token: string };
};
export type IDiscordUser = {
  username: string;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  avatar: string;
  discriminator: string;
  id: string;
};

export type IContext = {
  req: IContextRequest;
  res: Response;
  user?: AuthUser;
  twitterClientSdk?: Client;
  discordUser?: IDiscordUser;
};
