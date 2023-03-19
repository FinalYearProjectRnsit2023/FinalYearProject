import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { RegesterController } from './regester.controller';
import { RegesterService } from './regester.service';

@Module({
  controllers: [RegesterController],
  providers: [RegesterService, AppService],
})
export class RegesterModule {}
