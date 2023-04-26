import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { TimeTableController } from './TimeTable.controller';
import { TimeTableService } from './TimeTable.service';
import { UserService } from 'src/User/User.service';

@Module({
  controllers: [TimeTableController],
  providers: [TimeTableService, UserService, AppService],
})
export class TimeTableModule {}
