import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import { authProxy, notificationProxy, paymentProxy, usersProxy } from "./middleware/middleware.middleware";
import { requestLogger } from "./common/request-logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "./auth/jwt.strategy";
import { UsersController } from "./controllers/users.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ],

  controllers: [UsersController],

  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(requestLogger)
      .forRoutes("*");

    consumer
      .apply(usersProxy)
      .forRoutes({ path: "users/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(authProxy)
      .forRoutes({ path: "auth/(.*)", method: RequestMethod.ALL});

    consumer
      .apply(paymentProxy)
      .forRoutes({ path: "payments/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(notificationProxy)
      .forRoutes({ path: "notifications/(.*)", method: RequestMethod.ALL });

  }

}