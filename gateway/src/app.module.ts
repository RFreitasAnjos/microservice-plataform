import {
  MiddlewareConsumer,
  Module,
  NestModule
} from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

import {
  userProxy,
  paymentProxy,
  notificationProxy
} from "./middleware/middleware.middleware";

import { requestLogger } from "./common/request-logger.middleware";

@Module({

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],

  imports: [

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])

  ]

})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(requestLogger)
      .forRoutes("*");

    consumer
      .apply(userProxy)
      .forRoutes("/users");

    consumer
      .apply(paymentProxy)
      .forRoutes("/payments");

    consumer
      .apply(notificationProxy)
      .forRoutes("/notifications");

  }

}