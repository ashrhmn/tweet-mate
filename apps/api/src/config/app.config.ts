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
};
