import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Client as DiscordJsClient } from "discord.js";
import { CONFIG } from "src/config/app.config";

@Injectable()
export class DiscordBotService
  extends DiscordJsClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ intents: [] });
  }
  onModuleInit() {
    this.login(CONFIG.DISCORD_BOT.SECRET);
  }
  onModuleDestroy() {
    this.destroy();
  }

  async sendMessage(channelId: string, content: string) {
    const channel = await this.channels.fetch(channelId);
    if (!channel)
      throw new Error(
        "Channel not found or Bot is not a member in the specified channel",
      );
    if (!channel.isTextBased()) throw new Error("Channel is not text based");
    await channel.send(content);
  }
}
