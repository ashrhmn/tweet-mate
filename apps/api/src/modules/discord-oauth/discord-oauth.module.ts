import { Global, Module } from "@nestjs/common";

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
  clientId: process.env.DISCORD_OAUTH_CLIENT_ID || "client-id-not-initialized",
  clientSecret:
    process.env.DISCORD_OAUTH_CLIENT_SECRET || "client-secret-not-initialized",
  scope: "identify guilds",
});

// const twitterSdkProvider: Provider = {
//   provide: TWITTER_SDK_PROVIDER,
//   useValue: {
//     client: new Client(authClient),
//     authClient,
//   },
// };

@Global()
@Module({
  providers: [],
  exports: [],
})
export class DiscordOAuthModule {}
