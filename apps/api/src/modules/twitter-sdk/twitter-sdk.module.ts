import { Global, Module, Provider } from "@nestjs/common";
import { TWITTER_SDK_PROVIDER } from "src/constants";
import { Client, auth } from "twitter-api-sdk";

const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_OAUTH_CLIENT_ID || "client-id-not-initialized",
  client_secret:
    process.env.TWITTER_OAUTH_CLIENT_SECRET || "client-secret-not-initialized",
  callback: "http://localhost:3000/api/auth/twitter-callback",
  scopes: [
    "like.read",
    "like.write",
    "tweet.read",
    "tweet.write",
    "users.read",
  ],
});

const twitterSdkProvider: Provider = {
  provide: TWITTER_SDK_PROVIDER,
  useValue: {
    client: new Client(authClient),
    authClient,
  },
};

@Global()
@Module({
  providers: [twitterSdkProvider],
  exports: [twitterSdkProvider],
})
export class TwitterSdkModule {}
