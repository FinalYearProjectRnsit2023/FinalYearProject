import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { TimeTableController } from './TimeTable.controller';
import { TimeTableService } from './TimeTable.service';

@Module({
  controllers: [TimeTableController],
  providers: [TimeTableService, AppService],
})
export class TimeTableModule {}
