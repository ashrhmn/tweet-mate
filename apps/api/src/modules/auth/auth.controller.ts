import { Controller } from "@nestjs/common";
import { endpoints } from "api-interface";
import { Context, InferMethod } from "src/decorators";
import { IContext } from "src/interfaces";
import {
  createAsyncController,
  createController,
} from "src/utils/common.utils";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @InferMethod(endpoints.auth.login)
  login(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.login,
      context,
      this.authService.login,
    );
  }

  @InferMethod(endpoints.auth.signup)
  signup(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.signup,
      context,
      this.authService.signup,
    );
  }

  @InferMethod(endpoints.auth.currentUser)
  currentUser(@Context() context: IContext) {
    return createAsyncController(
      endpoints.auth.currentUser,
      context,
      this.authService.currentUser,
    );
  }

  @InferMethod(endpoints.auth.logout)
  logout(@Context() context: IContext) {
    return createController(
      endpoints.auth.logout,
      context,
      this.authService.logout,
    );
  }
}
