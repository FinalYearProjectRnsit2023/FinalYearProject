import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { TimeTableService } from 'src/TimeTable/TimeTable.service';
import { UserService } from 'src/User/User.service';
import { AttdenceController } from './Attdence.controller';
import { AttdenceService } from './Attdence.service';

@Module({
  controllers: [AttdenceController],
  providers: [AttdenceService, UserService, TimeTableService, AppService],
})
export class AttdenceModule {}
