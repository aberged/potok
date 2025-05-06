import { Injectable, OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}