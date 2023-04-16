// import { Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { Client } from "discord.js";
// import { CONFIG } from "src/config/app.config";

import { Module } from "@nestjs/common";
import { DiscordBotController } from "./discord-bot.controller";
import { DiscordBotService } from "./discord-bot.service";

// // const client = new Client({ intents: ["GuildMessages"] });

// // const discordBotProvider: Provider = {
// //   useValue: client,
// //   provide: DISCORD_BOT_PROVIDER,
// // };

// @Module({
//   //   providers: [discordBotProvider],
//   //   exports: [discordBotProvider],
// })
// export class DiscordBotModule
//   extends Client
//   implements OnModuleInit, OnModuleDestroy
// {
//   constructor() {
//     super({ intents: ["MessageContent"] });
//   }
//   onModuleInit() {
//     this.login(CONFIG.DISCORD_BOT.SECRET);
//   }
//   onModuleDestroy() {
//     this.destroy();
//   }
// }

@Module({
  providers: [DiscordBotService],
  exports: [DiscordBotService],
  controllers: [DiscordBotController],
})
export class DiscordBotModule {}
