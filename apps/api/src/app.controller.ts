import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const result = await this.prisma.user.count();
    return { ok: true, users: result };
  }
}
