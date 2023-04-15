export const CONFIG = {
  JWT: {
    SECRET: {
      ACCESS:
        process.env.ACCESS_TOKEN_JWT_SECRET || "access_token_not_configured",
      REFRESH:
        process.env.REFRESH_TOKEN_JWT_SECRET || "refresh_token_not_configured",
    },
    TIMEOUT: {
      ACCESS: +(process.env.ACCESS_TOKEN_TIMEOUT || 120), // TODO : update time
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
  PUBLIC_SECRET: {
    TWITTER_ACCESS_TOKEN_COOKIE_KEY:
      process.env.TWITTER_ACCESS_TOKEN_COOKIE_KEY ||
      "8giEFUX6E%@8b)(5eEyTh]z{>[)7-{P3d",

    DISCORD_ACCESS_TOKEN_COOKIE_KEY:
      process.env.DISCORD_ACCESS_TOKEN_COOKIE_KEY ||
      "6txYISC8F%@4L)(4eRzUi]z{>[)9-{t4g",
  },
};
