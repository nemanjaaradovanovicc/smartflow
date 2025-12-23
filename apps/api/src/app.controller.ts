import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  root() {
    return {
      ok: true,
      name: 'smartflow api',
      endpoints: ['/health', '/auth/register', '/auth/login'],
    };
  }

  @Get('health')
  async health() {
    const users = await this.prisma.user.count();
    return { ok: true, users };
  }
}
