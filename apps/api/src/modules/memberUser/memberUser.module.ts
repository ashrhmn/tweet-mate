import { Module } from "@nestjs/common";
import { MemberUserController } from "./memberUser.controller";

@Module({
  providers: [MemberUserModule],
  controllers: [MemberUserController],
})
export class MemberUserModule {}
