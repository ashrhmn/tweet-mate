import { Optional } from "src/utils/option.utils";

export const CONFIG = {
  JWT: {
    SECRET: {
      ACCESS:
        process.env.ACCESS_TOKEN_JWT_SECRET || "access_token_not_configured",
      REFRESH:
        process.env.REFRESH_TOKEN_JWT_SECRET || "refresh_token_not_configured",
    },
    TIMEOUT: {
      ACCESS: Optional.fromEnvNum("ACCESS_TOKEN_TIMEOUT").unwrapOr(120),
      REFRESH: "365d",
    },
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  ENV: {
    PRODUCTION: process.env.NODE_ENV === "production",
  },
  TWITTER_SDK: {
    STATE: process.env.TWKTTER_SDK_STATE || "twitter-sdk-state",
  },
  DISCORD_BOT: {
    SECRET: Optional.fromEnv("DISCORD_BOT_SECRET").unwrapOrThrow(
      "DISCORD_BOT_SECRET not configured",
    ),
  },
  PUBLIC_SECRET: {
    TWITTER_ACCESS_TOKEN_COOKIE_KEY: Optional.fromEnv(
      "TWITTER_ACCESS_TOKEN_COOKIE_KEY",
    ).unwrapOr("8giEFUX6E%@8b)(5eEyTh]z{>[)7-{P3d"),
    DISCORD_ACCESS_TOKEN_COOKIE_KEY: Optional.fromEnv(
      "DISCORD_ACCESS_TOKEN_COOKIE_KEY",
    ).unwrapOr("6txYISC8F%@4L)(4eRzUi]z{>[)9-{t4g"),
  },
};
