import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
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
      throw new BadRequestException(
        "Channel not found or Bot is not a member in the specified channel",
      );
    if (!channel.isTextBased())
      throw new BadRequestException("Channel is not text based");
    await channel.send(content);
  }

  async getGuildList() {
    const guilds = await this.guilds.fetch();
    return guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
    }));
  }

  async getChannelList(guildId: string) {
    const guild = await this.guilds.fetch(guildId);
    if (!guild) throw new Error("Guild not found");
    const channels = await guild.channels.fetch();
    return [...channels.values()].filter(Boolean).map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));
  }
}
