import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { Permissions } from "src/guards/permission.guard";
import { IContext } from "src/interfaces";
import {
  createAsyncController,
  createController,
} from "src/utils/common.utils";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions("READ_USER")
  @InferMethod(endpoints.users.getAll)
  getAll(@Context() context: IContext) {
    return createAsyncController(
      endpoints.users.getAll,
      context,
      this.userService.getAll,
    );
  }

  @Permissions("READ_USER")
  @InferMethod(endpoints.users.getUser)
  getUser(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.users.getUser,
      contex,
      this.userService.getUser,
    );
  }

  @Permissions("CREATE_USER")
  @InferMethod(endpoints.users.create)
  create(@Context() context: IContext) {
    return createAsyncController(
      endpoints.users.create,
      context,
      this.userService.create,
    );
  }

  @Permissions("MANAGE_USER")
  @InferMethod(endpoints.users.update)
  update(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.users.update,
      contex,
      this.userService.update,
    );
  }

  @Permissions("MANAGE_USER")
  @InferMethod(endpoints.users.delete)
  delete(@Context() contex: IContext) {
    return createAsyncController(
      endpoints.users.delete,
      contex,
      this.userService.delete,
    );
  }

  @Permissions("MANAGE_USER")
  @InferMethod(endpoints.users.getAllPermissions)
  getAllPermissions(@Context() contex: IContext) {
    return createController(
      endpoints.users.getAllPermissions,
      contex,
      this.userService.getAllPermissions,
    );
  }
}
