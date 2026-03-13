import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common";
import {
  authProxy,
  notificationProxy,
  paymentProxy,
  userLoginAliasProxy,
  userRegisterAliasProxy,
  usersProxy
} from "./middleware/middleware.middleware";
import { requestLogger } from "./common/request-logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthMiddleware } from "./auth/jwt-auth.middleware";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

type ProxyRoute = {
  path: string;
  method: RequestMethod;
};

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

  private readonly userProtectedRoutes: ProxyRoute[] = [
    { path: 'users', method: RequestMethod.GET },
    { path: 'users/*path', method: RequestMethod.GET },
    { path: 'users/*path', method: RequestMethod.PATCH },
    { path: 'users/*path', method: RequestMethod.DELETE }
  ];

  private readonly usersProxyRoutes: ProxyRoute[] = [
    { path: 'users', method: RequestMethod.ALL },
    { path: 'users/*path', method: RequestMethod.ALL }
  ];

  private readonly paymentRoutes: ProxyRoute[] = [
    { path: 'payments/*path', method: RequestMethod.ALL }
  ];

  private readonly notificationRoutes: ProxyRoute[] = [
    { path: 'notifications/*path', method: RequestMethod.ALL }
  ];

  private applyProtectedProxy(
    consumer: MiddlewareConsumer,
    proxyMiddleware: Parameters<MiddlewareConsumer['apply']>[0],
    routes: ProxyRoute[]
  ) {
    consumer.apply(JwtAuthMiddleware).forRoutes(...routes);
    consumer.apply(proxyMiddleware).forRoutes(...routes);
  }

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(requestLogger)
      .forRoutes("*");

    consumer.apply(JwtAuthMiddleware).forRoutes(...this.userProtectedRoutes);
    consumer.apply(usersProxy).forRoutes(...this.usersProxyRoutes);

    consumer
      .apply(userRegisterAliasProxy)
      .forRoutes({ path: "user/register", method: RequestMethod.POST });

    consumer
      .apply(userLoginAliasProxy)
      .forRoutes(
        { path: "user/login", method: RequestMethod.POST },
        { path: "auth/login", method: RequestMethod.POST }
      );

    consumer
      .apply(authProxy)
      .forRoutes({ path: "auth/*path", method: RequestMethod.ALL });

    this.applyProtectedProxy(consumer, paymentProxy, this.paymentRoutes);
    this.applyProtectedProxy(consumer, notificationProxy, this.notificationRoutes);

  }

}
