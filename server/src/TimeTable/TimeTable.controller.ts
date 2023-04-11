import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UUID } from 'src/User/User.Model';
import { TimeTableService } from './TimeTable.service';

@Controller('time_table')
export class TimeTableController {
  constructor(
    private readonly timeTableService: TimeTableService,
    private readonly appService: AppService,
  ) {}

  @Get('class_ttid')
  async GetClassTimeTableId(@Body() userId: UUID) {
    return { hello: 'ttid' };
  }
}
