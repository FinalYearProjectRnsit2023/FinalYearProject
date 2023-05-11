import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UUID } from 'src/User/User.Model';
import { TimeTableService } from './TimeTable.service';
import { TimeTable } from './TimeTable.Model';
import { UserService } from 'src/User/User.service';

@Controller('time_table')
export class TimeTableController {
  constructor(
    private readonly timeTableService: TimeTableService,
    private readonly userService: UserService,
    private readonly appService: AppService,
  ) {}

  @Get('class_ttid')
  async GetClassTimeTableId(@Body() userId: UUID) {
    return { hello: 'ttid' };
  }

  @Post('createTT')
  async CreateTT(@Body() TT: TimeTable) {
    const data = await this.timeTableService.CreateTimeTable(
      TT,
      this.appService,
    );

    return { data };
  }

  @Get('Test')
  async Test(@Body('userId') userId: UUID) {
    console.log(userId);

    return await this.timeTableService.GetClassTimeTableId(
      userId,
      this.appService,
      this.userService,
    );
  }
}
