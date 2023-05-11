import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { TimeTableService } from 'src/TimeTable/TimeTable.service';
import { StudentAttCode, UUID } from 'src/User/User.Model';
import { UserService } from 'src/User/User.service';
import { AttdenceService } from './Attdence.service';

@Controller('attdence')
export class AttdenceController {
  constructor(
    private readonly attdenceService: AttdenceService,
    private readonly userService: UserService,
    private readonly appService: AppService,
    private readonly timeTableService: TimeTableService,
  ) {}

  @Post('create_code')
  async CreateCode(@Body() teacherID: UUID) {
    return this.attdenceService.CreateCode(
      teacherID,
      this.userService,
      this.appService,
      this.timeTableService,
    );
  }

  @Post('verify_code')
  async VerifyCode(@Body() studentAtt: StudentAttCode) {
    return this.attdenceService.VerifyCode(
      studentAtt,
      this.userService,
      this.appService,
      this.timeTableService,
    );
  }

  @Post('mark')
  async MarkAttdence(@Body('Usn') Usn: string) {
    return this.attdenceService.MarkAttdenceByUsn(
      Usn,
      this.timeTableService,
      this.userService,
      this.appService,
    );
  }

  @Post('count')
  async Count(@Body() userId: UUID) {
    return this.attdenceService.GetAttdence(
      userId,
      this.appService,
      this.userService,
    );
  }
}
