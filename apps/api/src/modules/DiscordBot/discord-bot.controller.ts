import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiscordBotService } from "./discord-bot.service";

//  TODO: implement api-interface zod schema

@Controller()
export class DiscordBotController {
  constructor(private readonly discordBotService: DiscordBotService) {}

  @Get("/discord-bot/guilds")
  getGuildList() {
    return this.discordBotService.getGuildList();
  }

  @Get("/discord-bot/channels/:guildId")
  getChannelList(@Param("guildId") guildId: string) {
    return this.discordBotService.getChannelList(guildId);
  }

  @Post("/discord-bot/send-message/")
  sendMessage(
    @Body() { channelId, content }: { channelId: string; content: string },
  ) {
    return this.discordBotService.sendMessage(channelId, content);
  }
}
