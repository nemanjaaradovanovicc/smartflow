import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    // simple query da potvrdi konekciju
    const result = await this.prisma.user.count();
    return { ok: true, users: result };
  }
}
