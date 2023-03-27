import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS } from "@prisma/client";
import { IContextRequest } from "src/interfaces";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<PERMISSIONS[]>(
      "permissions",
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    if (permissions.length === 0) return true;
    const request: IContextRequest = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) return false;

    return permissions
      .map((r) => r.toLowerCase())
      .some((rr) => user.permissions.map((r) => r.toLowerCase()).includes(rr));
  }
}

export const Permissions = (...permissions: PERMISSIONS[]) =>
  SetMetadata("permissions", permissions);
