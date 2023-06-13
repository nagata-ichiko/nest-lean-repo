import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hallo')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('by')
  getby(): string {
    return this.appService.getby();
  }
}
