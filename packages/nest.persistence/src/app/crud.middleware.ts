import { Injectable, NestMiddleware } from '@nestjs/common';
import { RestApiHandler } from '@zenstackhq/server/api/rest';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { Request, Response } from 'express';
import { PrismaService } from './prisma.service';
import { enhance } from '@zenstackhq/runtime';
import { ClsService } from 'nestjs-cls';
import { setClsAuth } from './auth.interceprot';
import { API_REST_BASE_URL } from './app.module';

@Injectable()
export class CrudMiddleware implements NestMiddleware {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService,
  ) {}

  async use(req: Request, _res: Response, next: (error?: unknown) => void) {
    const baseUrl = `${req.protocol}://${req.headers.host}${req.baseUrl}`;

    await setClsAuth(req, this.cls, this.prismaService);

    const inner = ZenStackMiddleware({
      getPrisma: () =>
        enhance(this.prismaService, { user: this.cls.get('auth') }),
      handler: req.baseUrl.startsWith(API_REST_BASE_URL)? RestApiHandler({ endpoint: baseUrl }) : undefined , 
      sendResponse: false,
    });
    await inner(req, _res, zenNext);
    function zenNext(err: unknown) {
      if (err) {
        next(err);
      } else {
        if (_res.locals.status === 200) {
          _res.status(200).json(_res.locals.body);
        } else {
          _res.status(_res.locals.status).json(_res.locals.body);
        }
      }
    }
  }
}
