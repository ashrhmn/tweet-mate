import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { PrismaModule } from "./modules/prisma/prisma.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
