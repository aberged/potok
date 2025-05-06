import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ClsMiddleware, ClsModule, ClsService } from 'nestjs-cls';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './auth.interceprot';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { enhance } from '@zenstackhq/runtime';
import { CrudMiddleware } from './crud.middleware';

export const API_REST_BASE_URL = '/api/rest';
export const API_RPC_BASE_URL = '/api/rpc';
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
      interceptor: {
        mount: true,
      },
    }),
    ZenStackModule.registerAsync({
      useFactory: (...args: unknown[]) => {
        const [prisma, cls] = args as [PrismaService, ClsService];
        return {
          getEnhancedPrisma: () => enhance(prisma, { user: cls.get('auth') }),
        };
      },
      inject: [PrismaService, ClsService],
      extraProviders: [PrismaService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes(API_REST_BASE_URL).apply(CrudMiddleware).forRoutes(API_REST_BASE_URL);
    consumer.apply(ClsMiddleware).forRoutes(API_RPC_BASE_URL).apply(CrudMiddleware).forRoutes(API_RPC_BASE_URL);
  }
}
