import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PermissionsGuard } from "./guards/permission.guard";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { ExistingTweetPostModule } from "./modules/existingTweetPost/existingTweetPost.module";
import { NewTweetPostModule } from "./modules/newTweetPost/newTweetPost.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ProjectModule } from "./modules/project/project.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProjectModule,
    UserModule,
    NewTweetPostModule,
    ExistingTweetPostModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: PermissionsGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
