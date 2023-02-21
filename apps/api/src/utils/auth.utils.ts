import { User } from "@prisma/client";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { CONFIG } from "src/config/app.config";

export const getUser = (req: Request) => {
  try {
    const access_token = req.cookies.authorization;
    if (!access_token || typeof access_token !== "string") return null;
    return verify(access_token, CONFIG.JWT.SECRET.ACCESS) as Omit<
      User,
      "password"
    >;
  } catch (err) {
    console.error("req.user error : ", err);
    return null;
  }
};
