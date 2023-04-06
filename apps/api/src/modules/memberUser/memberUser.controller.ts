import { Controller } from "@nestjs/common";
import { MemberUserService } from "./memberUser.service";

@Controller()
export class MemberUserController {
  constructor(private readonly memberUserService: MemberUserService) {}
}
