import Client, { auth } from "twitter-api-sdk";

export const TWITTER_SDK_PROVIDER = "TWITTER_SDK_PROVIDER";
export const DISCORD_BOT_PROVIDER = "DISCORD_BOT_PROVIDER";
export type TwitterClient = { client: Client; authClient: auth.OAuth2User };
