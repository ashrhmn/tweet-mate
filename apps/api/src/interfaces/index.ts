import { User } from "@prisma/client";
import { Request, Response } from "express";

export type IContext = {
  req: Request;
  res: Response;
  user: Omit<User, "password"> | null;
};
