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
import { JwtAuthMiddleware } from "./auth/jwt-auth.middleware";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ],

  controllers: [AppController],

  providers: [
    AppService,
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
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/(.*)', method: RequestMethod.GET },
        { path: 'users/(.*)', method: RequestMethod.PATCH },
        { path: 'users/(.*)', method: RequestMethod.DELETE },
      );

    consumer
      .apply(usersProxy)
      .forRoutes(
        { path: "users", method: RequestMethod.ALL },
        { path: "users/(.*)", method: RequestMethod.ALL }
      );

    consumer
      .apply(authProxy)
      .forRoutes({ path: "auth/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({ path: "payments/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(paymentProxy)
      .forRoutes({ path: "payments/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({ path: "notifications/(.*)", method: RequestMethod.ALL });

    consumer
      .apply(notificationProxy)
      .forRoutes({ path: "notifications/(.*)", method: RequestMethod.ALL });

  }

}
