import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly cls: ClsService,
    private readonly prismaService: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    await setClsAuth(request, this.cls, this.prismaService);
    return next.handle();
  }
}

export async function setClsAuth(request: Request, cls: ClsService, prismaService: PrismaService) {
  const userId =
    typeof request.headers['x-user-id'] === 'string'
      ? request.headers['x-user-id']
      : undefined;
  const user = Number(userId)? 
    await prismaService.user.findUnique({
      where: { id: Number(userId) },
      include: { auths: true }
    })
    : undefined;
  if (user) {
    cls.set('auth', user);
  } else {
    cls.set('auth', null);
  }
}
