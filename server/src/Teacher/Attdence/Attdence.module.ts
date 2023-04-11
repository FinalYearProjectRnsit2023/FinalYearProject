import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { AttdenceController } from './Attdence.controller';
import { AttdenceService } from './Attdence.service';

@Module({
  controllers: [AttdenceController],
  providers: [AttdenceService, AppService],
})
export class AttdenceModule {}
