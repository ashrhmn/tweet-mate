import { User } from "@prisma/client";
import { Request, Response } from "express";

export type AuthUser = Omit<User, "password"> & { iat: number; exp: number };
export type IContextRequest = Request & {
  user?: AuthUser;
  tokens?: { authorization: string; refresh_token: string };
};

export type IContext = {
  req: IContextRequest;
  res: Response;
  user?: AuthUser;
};
